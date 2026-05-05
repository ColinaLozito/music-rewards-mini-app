// useMusicPlayer - Thin glue: TrackPlayer hooks + delegation to Orchestrator
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TrackPlayer, { State, usePlaybackState, useProgress, Event, useTrackPlayerEvents } from 'react-native-track-player';
import { useMusicStore, selectCurrentTrack } from '../stores/musicStore';
import { PlaybackOrchestrator } from '../services/PlaybackOrchestrator';
import { toast } from '../utils/toast';
import type { MusicChallenge, UseMusicPlayerReturn } from '../types';

export const PROGRESS_PERCENT = 100;

export const useMusicPlayer = (): UseMusicPlayerReturn & { retry: () => Promise<void>; isBuffering: boolean } => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const setIsPlaying = useMusicStore((store) => store.setIsPlaying);
  const lastTrackRef = useRef<MusicChallenge | null>(null);

  // Sync playback state to store
  const prevPlayingRef = useRef(false);
  useEffect(() => {
    const currentState = playbackState.state ?? State.Paused;
    const isCurrentlyPlaying = currentState === State.Playing;
    if (prevPlayingRef.current !== isCurrentlyPlaying) {
      prevPlayingRef.current = isCurrentlyPlaying;
      setIsPlaying(isCurrentlyPlaying);
    }
  }, [playbackState]);

  const isPlayingValue = useMemo(() => {
    const currentState = playbackState.state ?? State.Paused;
    return currentState === State.Playing;
  }, [playbackState]);

  // Handle errors + network interruption
  useTrackPlayerEvents([Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackError) {
      const msg = event.message || '';
      const isNetwork = /network|timeout|unable to connect|failed to load/i.test(msg);
      
      if (isNetwork) {
        toast.error('Network error: Check your connection and try again.');
        // Auto-pause on network error
        PlaybackOrchestrator.pause().catch(() => {});
      } else {
        toast.error(`Playback error: ${msg}`);
      }
      
      setIsBuffering(false);
    }
  });

  // Track buffering state: playing but no duration
  useEffect(() => {
    if (isPlayingValue && progress.duration === 0) {
      setIsBuffering(true);
    } else {
      setIsBuffering(false);
    }
  }, [isPlayingValue, progress.duration]);

  // play() - delegate to Orchestrator, handle errors
  const play = useCallback(async (track: MusicChallenge) => {
    try {
      setError(null);
      setIsBuffering(false);
      lastTrackRef.current = track;
      await PlaybackOrchestrator.play(track);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Playback failed';
      toast.error(errorMessage);
      console.error('TrackPlayer error:', err);
      try { await TrackPlayer.reset(); } catch (e) {}
      // Clear current track on failure for consistent state
      useMusicStore.getState().setCurrentTrack(null);
    }
  }, []);

  // retry() - replay last track
  const retry = useCallback(async () => {
    const track = lastTrackRef.current;
    if (!track) return;
    toast.warning('Retrying playback...');
    await play(track);
  }, [play]);

  return {
    isPlaying: isPlayingValue,
    currentTrack,
    currentPosition: progress.position,
    duration: progress.duration,
    play,
    pause: PlaybackOrchestrator.pause,
    seekTo: PlaybackOrchestrator.seekTo,
    resume: PlaybackOrchestrator.resume,
    error,
    retry,
    isBuffering,
  };
};
