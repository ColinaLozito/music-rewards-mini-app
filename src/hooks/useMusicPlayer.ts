// useMusicPlayer - TrackPlayer + Zustand integration (play, pause, seek, resume)
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { useMusicStore, selectCurrentTrack } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';
import { useLoadingStore } from '../stores/loadingStore';
import { setupTrackPlayer, addTrack, updateLockScreenControls } from '../services/audioService';
import type { MusicChallenge, UseMusicPlayerReturn } from '../types';

const PROGRESS_PERCENT = 100;

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  // TrackPlayer hooks
  const playbackState = usePlaybackState();
  const progress = useProgress();

  // Local state
  const [error, setError] = useState<string | null>(null);

  // Zustand store selectors
  const currentTrack = useMusicStore(selectCurrentTrack);
  const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
  const setIsPlaying = useMusicStore((state) => state.setIsPlaying);
  const updateProgress = useMusicStore((state) => state.updateProgress);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  const completeChallenge = useUserStore((state) => state.completeChallenge);
  const lastCapabilitiesRef = useRef<boolean | null>(null);

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

  // Memoize isPlaying derivation (avoid recomputation on every render)
  const isPlayingValue = useMemo(() => {
    let stateValue: any = playbackState;
    if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
      stateValue = (playbackState as any).state;
    }
    return stateValue === State.Playing;
  }, [playbackState]);

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
      void updateLockScreenControls(true);

      // Dismiss player by clearing current track when finished
      setCurrentTrack(null);

      // Use getState() to avoid stale closure
      const { awardedChallenges: aw, recordAward: ra } = useUserStore.getState();
      if (!aw[currentTrack.id]) {
        ra(currentTrack.id, currentTrack.points);
      }
    }
  }, [progress.position, progress.duration, currentTrack?.id]);

  // Handle track player events
  useTrackPlayerEvents([Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackError) {
      setError(`Playback error: ${event.message}`);
    }
  });

  const { showLoading, hideLoading } = useLoadingStore();

  const play = useCallback(async (track: MusicChallenge) => {
    try {
      setError(null);

      // Same track playing → skip
      if (currentTrack?.id === track.id && isPlayingValue) {
        return;
      }

      // Same track paused → resume (no loading)
      if (currentTrack?.id === track.id && !isPlayingValue) {
        await resume();
        return;
      }

      // === NEW TRACK ===
      // Save current track's progress to listenedTimeMap (HWM) before switching
      if (currentTrack && currentTrack.id && currentTrack.id !== track.id) {
        try {
          const { position, duration } = await TrackPlayer.getProgress();
          if (position > 0 && duration > 0) {
            const progressPercentage = (position / duration) * PROGRESS_PERCENT;
            updateProgress(currentTrack.id, Math.min(progressPercentage, PROGRESS_PERCENT));
            useUserStore.getState().updateMaxListenedTime(currentTrack.id, position);
          }
        } catch {
          // Ignore errors getting position/duration
        }
      }

      await setupTrackPlayer();

      // Reset and add new track
      await TrackPlayer.reset();
      await addTrack({
        id: track.id,
        url: track.audioUrl,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        artwork: track.artwork,
      });

      // === HYBRID: Fast path (500ms) ===
      const fastPathDuration = await Promise.race([
        TrackPlayer.getDuration(),
        new Promise<number>((_, reject) => setTimeout(() => reject('timeout'), 500))
      ]).catch(() => 0);

      if (fastPathDuration > 0) {
        // Duration loaded quickly → no overlay
        const completedChallenges = useUserStore.getState().completedChallenges;
        const isCompleted = completedChallenges.includes(track.id);
        if (lastCapabilitiesRef.current !== isCompleted) {
          await updateLockScreenControls(isCompleted);
          lastCapabilitiesRef.current = isCompleted;
        }

        await TrackPlayer.play();

        // Seek logic
        if (completedChallenges.includes(track.id)) {
          await TrackPlayer.seekTo(0);
        } else {
          const listenedTimeMap = useUserStore.getState().listenedTimeMap;
          const lastPosition = listenedTimeMap[track.id] || 0;
          if (lastPosition > 0) {
            await TrackPlayer.seekTo(lastPosition);
          }
        }

      setCurrentTrack(track);
      return; // Caller will router.push()
    }

    // === Duration not ready in 500ms → show loading overlay ===
    showLoading('Loading track...');

    // Wait for duration (max 5s total)
    const waitForDuration = async (): Promise<void> => {
      const startTime = Date.now();
      while (Date.now() - startTime < 4500) { // 5s total - 500ms already spent
        const dur = await TrackPlayer.getDuration();
        if (dur > 0) {
          await new Promise(resolve => setTimeout(resolve, 100)); // let progress hook update
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.warn('Duration not available after 5s, proceeding anyway');
    };

    await waitForDuration();

    // Now duration is ready → proceed
    const completedChallenges = useUserStore.getState().completedChallenges;
    const isCompleted = completedChallenges.includes(track.id);
    if (lastCapabilitiesRef.current !== isCompleted) {
      await updateLockScreenControls(isCompleted);
      lastCapabilitiesRef.current = isCompleted;
    }

    await TrackPlayer.play();

    // Seek logic
    if (completedChallenges.includes(track.id)) {
      await TrackPlayer.seekTo(0);
    } else {
      const listenedTimeMap = useUserStore.getState().listenedTimeMap;
      const lastPosition = listenedTimeMap[track.id] || 0;
      if (lastPosition > 0) {
        await TrackPlayer.seekTo(lastPosition);
      }
    }

    setCurrentTrack(track);
    hideLoading(); // Hide overlay now that duration is ready
  } catch (err) {
    hideLoading(); // Hide on error
    const errorMessage = err instanceof Error ? err.message : 'Playback failed';
    setError(errorMessage);
    console.error('TrackPlayer error:', err);
    try {
      await TrackPlayer.reset();
    } catch (resetErr) {
      console.error('Failed to reset player after error:', resetErr);
    }
  }
}, [setCurrentTrack, currentTrack, updateProgress, isPlayingValue]);

  const pause = useCallback(async () => {
    try {
      await TrackPlayer.pause();
    } catch (err) {
      console.error('Pause error:', err);
    }
  }, []);

  const seekTo = useCallback(async (seconds: number) => {
    try {
      await TrackPlayer.seekTo(seconds);
    } catch (err) {
      console.error('Seek error:', err);
    }
  }, []);

  const resume = useCallback(async () => {
    try {      
      // If track finished, restart from beginning
      const { position } = await TrackPlayer.getProgress();
      const duration = await TrackPlayer.getDuration();
      if (duration > 0 && position >= duration * 0.98) {
        await TrackPlayer.seekTo(0);
      }

      await TrackPlayer.play();
    } catch (err) {
      console.error('Resume error:', err);
    }
  }, []);

  return {
      isPlaying: isPlayingValue,
      currentTrack,
      currentPosition: progress.position,
      duration: progress.duration,
      play,
      pause,
      seekTo,
      resume,
      error,
    };
};
