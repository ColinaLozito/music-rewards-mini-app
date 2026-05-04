// useProgressSync - Sync progress.position to listenedTimeMap (throttled 5s)
import { useEffect, useRef } from 'react';
import { useProgress } from 'react-native-track-player';
import { useMusicStore, selectCurrentTrack } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';

const SYNC_INTERVAL = 5; // seconds between store updates

export const useProgressSync = () => {
  const progress = useProgress();
  const currentTrack = useMusicStore(selectCurrentTrack);
  const updateMaxListenedTime = useUserStore((s) => s.updateMaxListenedTime);
  const lastSyncedRef = useRef(0);

  useEffect(() => {
    if (!currentTrack) return;
    if (!progress.duration) return;
    if (progress.position === 0) return;

    const seconds = Math.floor(progress.position);
    if (seconds - lastSyncedRef.current >= SYNC_INTERVAL) {
      lastSyncedRef.current = seconds;
      updateMaxListenedTime(currentTrack.id, progress.position);
    }
  }, [progress.position, currentTrack?.id]);
};
