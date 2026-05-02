// useProgressSync hook - Syncs playback progress to listenedTimeMap globally
//
// Purpose: Keeps listenedTimeMap updated in real-time across the entire app.
// Runs in root layout (_layout.tsx) so sync works even when player modal is closed.
// No intervals - fully reactive via useEffect on progress.position.
//
// Effect: On every progress.position change, calls updateMaxListenedTime()
// to persist the max seconds listened for the current challenge.
import { useEffect } from 'react';
import { useProgress } from 'react-native-track-player';
import { useMusicStore, selectCurrentTrack } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';

export const useProgressSync = () => {
  const progress = useProgress();
  const currentTrack = useMusicStore(selectCurrentTrack);
  const updateMaxListenedTime = useUserStore((s) => s.updateMaxListenedTime);

  useEffect(() => {
    if (!currentTrack) return;
    if (!progress.duration) return;
    if (progress.position === 0) return;
    updateMaxListenedTime(currentTrack.id, progress.position);
  }, [progress.position, currentTrack?.id]);
};
