// useMusicPlayer hook - Integrates react-native-track-player with Zustand
import { useCallback, useEffect, useRef, useState } from 'react';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { useMusicStore, selectCurrentTrack, selectIsPlaying } from '../stores/musicStore';
import { useUserStore, selectListenedTimeMap, selectCompletedChallenges, selectAwardedChallenges } from '../stores/userStore';
import { setupTrackPlayer } from '../services/audioService';
import type { MusicChallenge, UseMusicPlayerReturn } from '../types';

const PROGRESS_PERCENT = 100;

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  // TrackPlayer hooks
  const playbackState = usePlaybackState();
  const progress = useProgress();

  // Local state
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [error, setError] = useState<string | null>(null);

  // Zustand store selectors
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
  const setIsPlaying = useMusicStore((state) => state.setIsPlaying);
  const setCurrentPosition = useMusicStore((state) => state.setCurrentPosition);
  const updateProgress = useMusicStore((state) => state.updateProgress);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  const completeChallenge = useUserStore((state) => state.completeChallenge);

  // Sync playback state to store (with ref to prevent loops)
  const prevPlayingRef = useRef(false);
  useEffect(() => {
    let stateValue: any = playbackState;
    if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
      stateValue = (playbackState as any).state;
    }
    const isCurrentlyPlaying = stateValue === State.Playing;

    if (prevPlayingRef.current !== isCurrentlyPlaying) {
      prevPlayingRef.current = isCurrentlyPlaying;
      setIsPlaying(isCurrentlyPlaying);
    }
  }, [playbackState]);

  // Throttled progress sync to store (every 5 seconds, not on every position change)
  const lastSyncRef = useRef(0);
  useEffect(() => {
    if (!progress.position || !progress.duration || !currentTrack) return;

    const progressPercentage = (progress.position / progress.duration) * 100;
    
    // Update progress in store
    if (progressPercentage > (currentTrack.progress || 0)) {
      updateProgress(currentTrack.id, progressPercentage);
    }

    // Check if track is completed (98% threshold for Challenge Integrity)
    if (progressPercentage >= 98 && !currentTrack.completed) {
      markChallengeComplete(currentTrack.id);
      completeChallenge(currentTrack.id);
      
      // Dismiss player by clearing current track when finished
      setCurrentTrack(null);

      // Only award points if not already awarded for this challenge
      if (!awardedChallenges[currentTrack.id]) {
        recordAward(currentTrack.id, currentTrack.points);
      }
    }
  }, [progress.position, progress.duration, currentTrack?.id]);

  // Handle track player events
  useTrackPlayerEvents([Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackError) {
      setError(`Playback error: ${event.message}`);
      setLoading(false);
    }
  });

      // Get awardedChallenges from userStore
  const awardedChallenges = useUserStore(selectAwardedChallenges);
  const recordAward = useUserStore((s) => s.recordAward);

  const play = useCallback(async (track: MusicChallenge) => {
    try {
      setLoading(true);
      setError(null);

      // Save current track's progress to listenedTimeMap (HWM) before switching
      if (currentTrack && currentTrack.id && currentTrack.id !== track.id) {
        try {
          const { position, duration } = await TrackPlayer.getProgress();
          if (position > 0 && duration > 0) {
            const progressPercentage = (position / duration) * PROGRESS_PERCENT;
            updateProgress(currentTrack.id, Math.min(progressPercentage, PROGRESS_PERCENT));
            // Save to listenedTimeMap (HWM) via userStore
            useUserStore.getState().updateMaxListenedTime(currentTrack.id, position);
          }
        } catch {
          // Ignore errors getting position/duration
        }
      }

      // Ensure player is initialized before any action
      setLoadingMessage('Loading track...');
      await setupTrackPlayer();

      // Reset and add new track
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.audioUrl,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
      });

      // Start playback
      setLoadingMessage('Starting playback...');
      await TrackPlayer.play();

      // Case B (In Progress) & Case C (Completed)
      const listenedTimeMap = useUserStore.getState().listenedTimeMap;
      const completedChallenges = useUserStore.getState().completedChallenges;

      if (completedChallenges.includes(track.id)) {
        // Case C: Completed → start from 0
        setLoadingMessage('Restarting challenge...');
        await TrackPlayer.seekTo(0);
      } else {
        // Case B: In Progress → seek to lastPosition (HWM)
        const lastPosition = listenedTimeMap[track.id] || 0;
        if (lastPosition > 0) {
          setLoadingMessage('Resuming challenge...');
          await TrackPlayer.seekTo(lastPosition);
        }
      }

      setCurrentTrack(track);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Playback failed';
      setError(errorMessage);
      console.error('TrackPlayer error:', err);
      // Reset player state on error to prevent inconsistent state
      try {
        await TrackPlayer.reset();
      } catch (resetErr) {
        console.error('Failed to reset player after error:', resetErr);
      }
    } finally {
      setLoading(false);
    }
  }, [setCurrentTrack, currentTrack, updateProgress]);

  const pause = useCallback(async () => {
    try {
      setLoading(true);
      await TrackPlayer.pause();
    } catch (err) {
      console.error('Pause error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const seekTo = useCallback(async (seconds: number) => {
    try {
      setLoading(true);
      await TrackPlayer.seekTo(seconds);
    } catch (err) {
      console.error('Seek error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resume = useCallback(async () => {
    try {
      setLoading(true);
      
      // If track finished, restart from beginning
      const { position } = await TrackPlayer.getProgress();
      const duration = await TrackPlayer.getDuration();
      if (duration > 0 && position >= duration * 0.98) {
        await TrackPlayer.seekTo(0);
      }

      await TrackPlayer.play();
    } catch (err) {
      console.error('Resume error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Extract isPlaying from playbackState for return
  let stateValue: any = playbackState;
  if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
    stateValue = (playbackState as any).state;
  }

    return {
      isPlaying: stateValue === State.Playing,
      currentTrack,
      currentPosition: progress.position,
      duration: progress.duration,
      play,
      pause,
      seekTo,
      resume,
      loading,
      setLoading,
      loadingMessage,
      error,
    };
};
