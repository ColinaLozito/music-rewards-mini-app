// Audio service - TrackPlayer setup and configuration
import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';

export const setupTrackPlayer = async (): Promise<void> => {
  try {
    await TrackPlayer.setupPlayer({ waitForBuffer: true, maxCacheSize: 10240 });
  } catch (error: any) {
    // Swallow "already initialized" errors
    const msg = String(error?.message || error);
    if (msg.includes('already') && msg.includes('initialized')) {
      // Player already exists, continue
    } else {
      throw error;
    }
  }

  // Always update options (idempotent)
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.Stop,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause],
    android: { appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification },
    notificationCapabilities: [Capability.Play, Capability.Pause],
  });
};

// Reset player state
export const resetPlayer = async (): Promise<void> => {
  try {
    await TrackPlayer.reset();
  } catch (error) {
    console.error('Reset player error:', error);
  }
};

// Add track to player
export const addTrack = async (track: {
  id: string;
  url: string;
  title: string;
  artist: string;
  duration?: number;
}): Promise<void> => {
  try {
    await TrackPlayer.add({
      id: track.id,
      url: track.url,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      // Optional: Add artwork if available
      // artwork: track.artwork,
    });
  } catch (error) {
    console.error('Add track error:', error);
    throw error;
  }
};

// Play current track
export const playTrack = async (): Promise<void> => {
  try {
    await TrackPlayer.play();
  } catch (error) {
    console.error('Play track error:', error);
    throw error;
  }
};

// Pause current track
export const pauseTrack = async (): Promise<void> => {
  try {
    await TrackPlayer.pause();
  } catch (error) {
    console.error('Pause track error:', error);
    throw error;
  }
};

// Seek to position
export const seekToPosition = async (seconds: number): Promise<void> => {
  try {
    await TrackPlayer.seekTo(seconds);
  } catch (error) {
    console.error('Seek error:', error);
    throw error;
  }
};

// Get current position
export const getCurrentPosition = async (): Promise<number> => {
  try {
    return await TrackPlayer.getPosition();
  } catch (error) {
    console.error('Get position error:', error);
    return 0;
  }
};

// Get track duration
export const getTrackDuration = async (): Promise<number> => {
  try {
    return await TrackPlayer.getDuration();
  } catch (error) {
    console.error('Get duration error:', error);
    return 0;
  }
};

// Handle playback errors
export const handlePlaybackError = (error: any) => {
  console.error('Playback error:', error);
  
  // You can add error reporting here
  // Example: report to crash analytics
  // crashlytics().recordError(error);
  
  return {
    message: error?.message || 'Unknown playback error',
    code: error?.code || 'UNKNOWN_ERROR',
  };
};

// Cleanup function - call when app is unmounting
export const cleanupTrackPlayer = async (): Promise<void> => {
  try {
    await TrackPlayer.reset();
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};