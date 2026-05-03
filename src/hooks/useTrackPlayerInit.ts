// Hook: init TrackPlayer on mount, cleanup on unmount
import { useEffect, useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import { setupTrackPlayer, teardownTrackPlayerForJsReload } from '../services/audioService';
import playbackService from '../services/playbackService';

export const useTrackPlayerInit = () => {
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    // Register playback service first
    TrackPlayer.registerPlaybackService(() => playbackService);

    // Kill audio from previous bundle
    (async () => {
      try {
        await teardownTrackPlayerForJsReload();
      } catch {}

      // Init player
      try {
        await setupTrackPlayer();
        setPlayerReady(true);
      } catch (error) {
        console.error('Failed to setup TrackPlayer:', error);
        setTimeout(() => setPlayerReady(true), 1000);
      }
    })();

    // Cleanup on unmount/reload
    return () => {
      TrackPlayer.reset()
        .then(() => {})
        .catch((err) => {
          console.error('Error resetting TrackPlayer:', err);
        });
    };
  }, []);

  return playerReady;
};
