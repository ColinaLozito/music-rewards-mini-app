// useMusicPlayer - Thin glue: TrackPlayer hooks + delegation to Orchestrator
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { useMusicStore, selectCurrentTrack } from "../stores/musicStore";
import { PlaybackOrchestrator } from "../services/PlaybackOrchestrator";
import { toast } from "../utils/toast";
import type { MusicChallenge, UseMusicPlayerReturn } from "../types";

export const PROGRESS_PERCENT = 100;

export const useMusicPlayer = (): UseMusicPlayerReturn & {
  retry: () => Promise<void>;
  isBuffering: boolean;
} => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const lastTrackRef = useRef<MusicChallenge | null>(null);

  const isPlayingValue = useMemo(() => {
    const currentState = playbackState.state ?? State.Paused;
    const playing = currentState === State.Playing;

    // Clear error if playback recovered
    if (playing && error) {
      setError(null);
    }

    return playing;
  }, [playbackState, error]);

  // Handle errors + network interruption
  useTrackPlayerEvents([Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackError) {
      const msg = event.message || "";
      const isNetwork =
        /network|timeout|unable to connect|failed to load/i.test(msg);

      if (isNetwork) {
        setError("Network error: Check your connection and try again.");
        toast.error("Network error: Check your connection and try again.");
        // Let playback continue until the current buffered audio is exhausted.
      } else {
        setError(`Playback error: ${msg}`);
        toast.error(`Playback error: ${msg}`);
        setIsBuffering(false);
      }
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

  // Auto-clear error when playback recovers
  useEffect(() => {
    if (isPlayingValue && error) {
      setError(null);
    }
  }, [isPlayingValue, error]);

  // play() - delegate to Orchestrator, handle errors
  const play = useCallback(async (track: MusicChallenge) => {
    try {
      setError(null);
      setIsBuffering(false);
      lastTrackRef.current = track;
      await PlaybackOrchestrator.play(track);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Playback failed";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("TrackPlayer error:", err);
      try {
        await TrackPlayer.reset();
      } catch (e) {}
      // Clear current track on failure for consistent state
      useMusicStore.getState().setActiveChallengeId(null);
    }
  }, []);

  // retry() - replay last track
  const retry = useCallback(async () => {
    const track = lastTrackRef.current;
    if (!track) return;
    setError(null); // Clear error before retry
    toast.warning("Retrying playback...");
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
