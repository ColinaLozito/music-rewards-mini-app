// Root layout for Expo Router
import { Stack } from 'expo-router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useTrackPersistence } from '../hooks/useTrackPersistence';
import { useTrackPlayerInit } from '../hooks/useTrackPlayerInit';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

export default function RootLayout() {
  useTrackPersistence();
  const playerReady = useTrackPlayerInit();

  if (!playerReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      {/* Global loading overlay */}
      <LoadingOverlay />

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