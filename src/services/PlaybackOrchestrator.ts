// PlaybackOrchestrator - Singleton service for track playback orchestration
import TrackPlayer, { State } from 'react-native-track-player';
import { useMusicStore } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';
import { setupTrackPlayer, addTrack, updateLockScreenControls } from './audioService';
import type { MusicChallenge } from '../types';

const PROGRESS_PERCENT = 100;
let lastCapabilities: boolean | null = null;

export const PlaybackOrchestrator = {
  // --- Public Methods ---

  async play(track: MusicChallenge): Promise<void> {
    const { currentTrack, updateProgress, setCurrentTrack } = useMusicStore.getState();
    let loadingShown = false;

    try {
      // 1. Guard: If same track, handle toggle
      if (currentTrack?.id === track.id) {
        if (!(await this.isPlaying())) await this.resume();
        return;
      }

      // 2. Cleanup: Save progress of the previous track before switching
      if (currentTrack?.id) {
        await this._saveTrackProgress(currentTrack.id, updateProgress);
      }

      // 3. Setup: Initialize and add new track to queue
      await this._prepareNewTrack(track);

      // 4. Hybrid Path: Attempt quick duration load (500ms limit)
      const quickProgress = await Promise.race([
        TrackPlayer.getProgress(),
        new Promise<{duration: number}>(res => setTimeout(() => res({duration: 0}), 500))
      ]);

      if (quickProgress.duration > 0) {
        await this._finalizeTrackStart(track, setCurrentTrack);
        return;
      }

      // 5. Slow Path: Show loading overlay and poll for duration
      loadingShown = true;
      //const duration = await this._pollForDuration(4500); 
      loadingShown = false;
      
      await this._finalizeTrackStart(track, setCurrentTrack);

    } catch (err) {
      console.error('Orchestrator Play Error:', err);
      throw err;
    } 
  },

  async resume(): Promise<void> {
    try {
      const { position, duration } = await TrackPlayer.getProgress();
      // Restart if track is essentially finished (98% threshold)
      if (duration > 0 && position >= duration * 0.98) {
        await TrackPlayer.seekTo(0);
      }
      await TrackPlayer.play();
    } catch (err) {
      console.error('Resume error:', err);
    }
  },

  async pause(): Promise<void> {
    try {
      await TrackPlayer.pause();
    } catch (err) {
      console.error('Pause error:', err);
    }
  },

  async seekTo(seconds: number): Promise<void> {
    try {
      await TrackPlayer.seekTo(seconds);
    } catch (err) {
      console.error('Seek error:', err);
    }
  },

  async isPlaying(): Promise<boolean> {
    try {
      const state = await TrackPlayer.getPlaybackState();
      return state.state === State.Playing;
    } catch {
      return false;
    }
  },

  // --- Internal Helper Methods (Logic Encapsulation) ---

  async _saveTrackProgress(trackId: string, updateProgress: (id: string, p: number) => void): Promise<void> {
    try {
      const { position, duration } = await TrackPlayer.getProgress();
      if (position > 0 && duration > 0) {
        const progressPercentage = (position / duration) * PROGRESS_PERCENT;
        updateProgress(trackId, Math.min(progressPercentage, PROGRESS_PERCENT));
        useUserStore.getState().updateMaxListenedTime(trackId, position);
      }
    } catch { /* Ignore progress save errors */ }
  },

  async _prepareNewTrack(track: MusicChallenge): Promise<void> {
    await setupTrackPlayer();
    await TrackPlayer.reset();
    await addTrack({
      id: track.id,
      url: track.audioUrl,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      artwork: track.artwork,
    });
  },

  async _finalizeTrackStart(track: MusicChallenge, setCurrentTrack: (t: MusicChallenge) => void): Promise<void> {
    const completedChallenges = useUserStore.getState().completedChallenges;
    const isCompleted = completedChallenges.includes(track.id);

    // Sync LockScreen capabilities only on change to avoid bridge overhead
    if (lastCapabilities !== isCompleted) {
      await updateLockScreenControls(isCompleted);
      lastCapabilities = isCompleted;
    }

    await TrackPlayer.play();

    // Restoration logic: Start from beginning if completed, else resume from last position
    if (isCompleted) {
      await TrackPlayer.seekTo(0);
    } else {
      const lastPos = useUserStore.getState().listenedTimeMap[track.id] || 0;
      if (lastPos > 0) await TrackPlayer.seekTo(lastPos);
    }
    
    setCurrentTrack(track);
  },

  async _pollForDuration(timeout: number): Promise<number> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const { duration } = await TrackPlayer.getProgress();
      if (duration > 0) return duration;
      await new Promise(r => setTimeout(r, 100));
    }
    console.warn('Duration metadata not available, continuing without it.');
    return 0;
  }
};