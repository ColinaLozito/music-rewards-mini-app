// Audio service - TrackPlayer setup and configuration
import TrackPlayer, {
  Capability,
  IOSCategory,
  IOSCategoryOptions,
  IOSCategoryMode,
} from 'react-native-track-player';

const PLACEHOLDER_TITLE = 'Unknown title';
const PLACEHOLDER_ARTIST = 'Unknown artist';

const BASELINE_CAPABILITIES = [
  Capability.Play,
  Capability.Pause,
  Capability.Stop,
] as const;

const CHALLENGE_COMPLETE_EXTRA_CAPABILITIES = [
  Capability.SkipToNext,
  Capability.SkipToPrevious,
  Capability.SeekTo,
] as const;

let trackPlayerInitializationPromise: Promise<void> | null = null;

const isAllowedAudioUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const hasAllowedExtension = /\.(mp3|aac)(\?.*)?$/i.test(parsedUrl.pathname + parsedUrl.search);
    return isHttps && hasAllowedExtension;
  } catch {
    return false;
  }
};

const ensureTrackPlayerInitialized = async (): Promise<void> => {
  if (trackPlayerInitializationPromise) {
    return trackPlayerInitializationPromise;
  }

  trackPlayerInitializationPromise = (async () => {
    try {
      await TrackPlayer.setupPlayer({
        waitForBuffer: true,
        maxCacheSize: 10240,
        iosCategory: IOSCategory.Playback,
        iosCategoryMode: IOSCategoryMode.Default,
        iosCategoryOptions: [
          IOSCategoryOptions.AllowBluetooth,
          IOSCategoryOptions.AllowAirPlay,
          IOSCategoryOptions.MixWithOthers,
        ],
      });
    } catch (error: any) {
      const msg = String(error?.message || error);
      if (!(msg.includes('already') && msg.includes('initialized'))) {
        trackPlayerInitializationPromise = null;
        throw error;
      }
    }

    await TrackPlayer.updateOptions({
      capabilities: [...BASELINE_CAPABILITIES],
      compactCapabilities: [Capability.Play, Capability.Pause],
      notificationCapabilities: [...BASELINE_CAPABILITIES],
      icon: require('../icon.png'),
    });
  })();

  return trackPlayerInitializationPromise;
};

export const setupTrackPlayer = async (): Promise<void> => {
  await ensureTrackPlayerInitialized();
};

/** Sync lock screen / notification capabilities with challenge completion (call after setup). */
export async function updateLockScreenControls(
  isChallengeCompleted: boolean
): Promise<void> {
  await setupTrackPlayer();

  if (isChallengeCompleted) {
    const capabilities = [
      ...BASELINE_CAPABILITIES,
      ...CHALLENGE_COMPLETE_EXTRA_CAPABILITIES,
    ];
    await TrackPlayer.updateOptions({
      capabilities,
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      notificationCapabilities: [...capabilities],
      icon: require('../icon.png'),
    });
  } else {
    await TrackPlayer.updateOptions({
      capabilities: [...BASELINE_CAPABILITIES],
      compactCapabilities: [Capability.Play, Capability.Pause],
      notificationCapabilities: [...BASELINE_CAPABILITIES],
      icon: require('../icon.png'),
    });
  }
}

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
  artwork?: string;
}): Promise<void> => {
  if (!isAllowedAudioUrl(track.url)) throw new Error('Invalid URL');

  const title =
    typeof track.title === 'string' && track.title.trim() !== ''
      ? track.title.trim()
      : PLACEHOLDER_TITLE;
  const artist =
    typeof track.artist === 'string' && track.artist.trim() !== ''
      ? track.artist.trim()
      : PLACEHOLDER_ARTIST;

  try {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: track.id,
      url: track.url,
      title,
      artist,
      artwork: track.artwork,
    });

    await TrackPlayer.play();
  } catch (error) {
    console.error(error);
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

// Teardown player for JS reload (stop playback, clear queue)
export const teardownTrackPlayerForJsReload = async (): Promise<void> => {
  try {
    await TrackPlayer.pause();
  } catch {
    // noop - player might not be initialized
  }
  try {
    await TrackPlayer.reset();
  } catch {
    // noop - player might not be initialized
  }
};
