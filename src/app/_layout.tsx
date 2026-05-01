// Root layout for Expo Router
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import { setupTrackPlayer } from '../services/audioService';

export default function RootLayout() {
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    // Register the playback service first
    TrackPlayer.registerPlaybackService(() => require('../services/playbackService'));
    
    // Then initialize TrackPlayer when app starts
    setupTrackPlayer()
      .then(() => {
        setPlayerReady(true);
      })
      .catch((error) => {
        console.error('Failed to setup TrackPlayer:', error);
        // Still set ready to true after a delay to prevent app from hanging
        setTimeout(() => setPlayerReady(true), 1000);
      });

    // Cleanup: stop player on app unmount/reload to prevent double instances
    return () => {
      TrackPlayer.reset()
        .then(() => {
          //
        })
        .catch((err) => {
          console.error('Error resetting TrackPlayer:', err);
        });
    };
  }, []);

  if (!playerReady) {
    return null; // Or a loading screen
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="(modals)" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}