// Root layout for Expo Router
import { Stack, usePathname } from "expo-router";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useTrackPersistence } from "../hooks/useTrackPersistence";
import { useTrackPlayerInit } from "../hooks/useTrackPlayerInit";
import { LoadingOverlay } from "../components/ui/LoadingOverlay";
import { ToastContainer } from "../components/ui/ToastContainer";

export default function RootLayout() {
  useTrackPersistence();
  const playerReady = useTrackPlayerInit();
  const pathname = usePathname();
  const isModalRoute = pathname?.includes("(modals)") ?? false;

  if (!playerReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      {/* Global notifications - only outside modals */}
      {!isModalRoute && <ToastContainer />}
      
      {/* Global loading overlay */}
      <LoadingOverlay />

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)"
          options={{
            presentation: "modal",
            headerShown: false
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
