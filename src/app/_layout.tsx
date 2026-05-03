// Root layout for Expo Router
import { Stack } from 'expo-router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useProgressSync } from '../hooks/useProgressSync';
import { useTrackPlayerInit } from '../hooks/useTrackPlayerInit';

export default function RootLayout() {
  useProgressSync();
  const playerReady = useTrackPlayerInit();

  if (!playerReady) {
    return null;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}