// useTrackPersistence - Progress sync + Challenge completion (Global scope)
import { useEffect, useRef } from 'react';
import { useProgress } from 'react-native-track-player';
import { useMusicStore, selectCurrentTrack } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';
import { updateLockScreenControls } from '../services/audioService';
import { PROGRESS_PERCENT } from './useMusicPlayer';
import { router } from 'expo-router';

const SYNC_INTERVAL = 5; // seconds between store updates
const MINIMUM_PROGRESS_REQUIRED = 98;
const FULL_PROGRESS = 100;

export const useTrackPersistence = () => {
  const progress = useProgress();
  const currentTrack = useMusicStore(selectCurrentTrack);
  const updateProgress = useMusicStore((store) => store.updateProgress);
  const markChallengeComplete = useMusicStore((store) => store.markChallengeComplete);
  const completeChallenge = useUserStore((store) => store.completeChallenge);
  const updateMaxListenedTime = useUserStore((store) => store.updateMaxListenedTime);
  const lastSyncedRef = useRef(0);

  // 1. Throttled progress sync: progress.position → listenedTimeMap (every 5s)
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

  // 2. Challenge completion (98% threshold) + Rewards
  useEffect(() => {
    if (!progress.position || !progress.duration || !currentTrack) return;
    const progressPercentage = (progress.position / progress.duration) * PROGRESS_PERCENT;
    
    // Update progress in store
    if (progressPercentage > (currentTrack.progress || 0)) {
      updateProgress(currentTrack.id, progressPercentage);
    }

    // Check completion
    if (progressPercentage >= MINIMUM_PROGRESS_REQUIRED && !currentTrack.completed) {
      updateProgress(currentTrack.id, FULL_PROGRESS);
      markChallengeComplete(currentTrack.id);
      completeChallenge(currentTrack.id);
      void updateLockScreenControls(true);
      
      // Force listenedTimeMap to full duration so points reach 100%
      updateMaxListenedTime(currentTrack.id, currentTrack.duration);
      
      // Dismiss player
      router.back();
      useMusicStore.getState().setCurrentTrack(null);
      
      // Award points (if not already awarded)
      const { awardedChallenges: aw, recordAward: ra } = useUserStore.getState();
      if (!aw[currentTrack.id]) {
        ra(currentTrack.id, currentTrack.points);
      }
    }
  }, [progress.position, progress.duration, currentTrack?.id]);
};
