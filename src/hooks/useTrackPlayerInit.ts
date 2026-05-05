// useTrackPlayerInit - Init TrackPlayer, kill zombie audio on reload
import { useEffect, useRef, useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import { setupTrackPlayer, teardownTrackPlayerForJsReload } from '../services/audioService';
import playbackService from '../services/playbackService';

// Register playback service at module level (once, not on every mount)
TrackPlayer.registerPlaybackService(() => playbackService);

export const useTrackPlayerInit = () => {
  const [playerReady, setPlayerReady] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    // Kill audio from previous bundle
    (async () => {
      try {
        await teardownTrackPlayerForJsReload();
      } catch {}

      if (cancelledRef.current) return;

      // Init player
      try {
        await setupTrackPlayer();
        if (!cancelledRef.current) setPlayerReady(true);
      } catch (error) {
        console.error('Failed to setup TrackPlayer:', error);
        if (!cancelledRef.current) setTimeout(() => setPlayerReady(true), 1000);
      }
    })();

    // Cleanup on unmount/reload
    return () => {
      cancelledRef.current = true;
      TrackPlayer.reset()
        .then(() => {})
        .catch((err) => {
          console.error('Error resetting TrackPlayer:', err);
        });
    };
  }, []);

  return playerReady;
};
