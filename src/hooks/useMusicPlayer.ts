// useMusicPlayer - Thin glue: TrackPlayer hooks + delegation to Orchestrator
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TrackPlayer, { State, usePlaybackState, useProgress, Event, useTrackPlayerEvents } from 'react-native-track-player';
import { useMusicStore, selectCurrentTrack } from '../stores/musicStore';
import { PlaybackOrchestrator } from '../services/PlaybackOrchestrator';
import type { MusicChallenge, UseMusicPlayerReturn } from '../types';

export const PROGRESS_PERCENT = 100;

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [error, setError] = useState<string | null>(null);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const setIsPlaying = useMusicStore((store) => store.setIsPlaying);

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

  // Handle errors
  useTrackPlayerEvents([Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackError) {
      setError(`Playback error: ${event.message}`);
    }
  });

  // play() - delegate to Orchestrator, handle errors
  const play = useCallback(async (track: MusicChallenge) => {
    try {
      setError(null);
      await PlaybackOrchestrator.play(track);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Playback failed';
      setError(errorMessage);
      console.error('TrackPlayer error:', err);
      try { await TrackPlayer.reset(); } catch (e) {}
    }
  }, []);

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
  };
};
