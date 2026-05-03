// Playback service for react-native-track-player (no React hooks — runs in headless context)
import TrackPlayer, { Event, State } from 'react-native-track-player';
import { useUserStore } from '../stores/userStore';

async function isActiveChallengeCompleted(): Promise<boolean> {
  const active = await TrackPlayer.getActiveTrack();
  const id = active?.id;
  if (!id || typeof id !== 'string') return false;
  return useUserStore.getState().completedChallenges.includes(id);
}

export default async function playbackService(): Promise<void> {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    try {
      const state = await TrackPlayer.getState();
      if (state !== State.Playing) await TrackPlayer.play();
    } catch (err) {
      console.error('Remote play error:', err);
    }
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    try {
      await TrackPlayer.pause();
    } catch (err) {
      console.error('Remote pause error:', err);
    }
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    try {
      await TrackPlayer.stop();
    } catch (err) {
      console.error('Remote stop error:', err);
    }
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    try {
      if (!(await isActiveChallengeCompleted())) return;
      await TrackPlayer.skipToNext();
    } catch (err) {
      console.error('Remote next error:', err);
    }
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    try {
      if (!(await isActiveChallengeCompleted())) return;
      await TrackPlayer.skipToPrevious();
    } catch (err) {
      console.error('Remote previous error:', err);
    }
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    try {
      if (!(await isActiveChallengeCompleted())) return;
      await TrackPlayer.seekTo(event.position);
    } catch (err) {
      console.error('Remote seek error:', err);
    }
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, (event) => {
    try {
      if (event.paused) {
        console.log('Audio interrupted: paused =', event.paused, 'permanent =', event.permanent);
      } else {
        console.log('Audio interruption ended');
      }
    } catch (err) {
      console.error('Remote duck error:', err);
    }
  });

  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
    console.log('Playback queue ended');
  });

  TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
    console.error('Playback service error:', error);
  });
}
