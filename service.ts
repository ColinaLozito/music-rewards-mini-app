// Root Playback Service - handles background audio + remote controls
import TrackPlayer, { 
  Event, 
  State,
  IOSCategory,
  IOSCategoryOptions,
} from 'react-native-track-player';
import { useMusicStore } from './src/stores/musicStore';
import { useUserStore } from './src/stores/userStore';

export const PlaybackService = async function() {
  // Remote Play/Pause from Lock Screen / Notification Center
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    try {
      const state = await TrackPlayer.getState();
      if (state !== State.Playing) {
        await TrackPlayer.play();
      }
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

  // Remote Seek from Lock Screen (ONLY if challenge completed)
  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    try {
      const { position } = event;
      const currentTrackId = useMusicStore.getState().currentTrack?.id;
      const completedChallenges = useUserStore.getState().completedChallenges;
      
      // Only allow seek if challenge is completed
      if (currentTrackId && completedChallenges.includes(currentTrackId)) {
        await TrackPlayer.seekTo(position);
      }
    } catch (err) {
      console.error('Remote seek error:', err);
    }
  });

  // Audio Interruptions (Phone calls, Alarms) - iOS
  TrackPlayer.addEventListener(Event.RemoteDuck, (event) => {
    try {
      if (event.paused) {
        // Interruption started (phone call, alarm, etc.)
        console.log('Audio interrupted: paused =', event.paused, 'permanent =', event.permanent);
      } else {
        // Interruption ended, can resume
        console.log('Audio interruption ended');
      }
    } catch (err) {
      console.error('Remote duck error:', err);
    }
  });

  // Track Ended
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
    console.log('Playback queue ended');
    // Could auto-play next track or stop here
  });

  // Playback State Changes (for debugging)
  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    console.log('Playback state changed:', event.state);
  });

  // Error Handling
  TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
    console.error('Playback service error:', error);
  });
};
