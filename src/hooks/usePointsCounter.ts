// usePointsCounter hook - Calculates points earned based on audio playback progress
//
// Purpose: Animates points counter in real-time as user listens.
// Derives earned points from listenedTimeMap (max-progress logic).
// Uses react-native-track-player's useProgress() for live position.
// No intervals - fully reactive via useEffect on progress.position.

import { useCallback, useEffect, useState } from 'react';
import { useProgress } from 'react-native-track-player';
import type { PointsCounterConfig, UsePointsCounterReturn } from '../types';
import { useUserStore, selectListenedTimeMap } from '../stores/userStore';
import { useMusicStore } from '../stores/musicStore';

export const usePointsCounter = (): UsePointsCounterReturn => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PointsCounterConfig | null>(null);

  const progress = useProgress();
  const listenedTimeMap = useUserStore(selectListenedTimeMap);

  const startCounting = useCallback((newConfig: PointsCounterConfig) => {
    setConfig(newConfig);
    setIsActive(true);
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);

  const stopCounting = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);

  // Check if current challenge completed (stable, no getState() in effect)
  const isChallengeCompleted = useMusicStore((state) =>
    config ? state.challenges.some(c => c.id === config.challengeId && c.completed) : false
  );

  // Reactive: runs whenever playback position changes
  useEffect(() => {
    if (!isActive || !config) return;
    if (isChallengeCompleted) return;

    // Sync max listened time to store
    const updateFn = useUserStore.getState().updateMaxListenedTime;
    updateFn(config.challengeId, progress.position);
  }, [progress.position, isActive, config]);

  // Reactive: runs whenever listenedTimeMap changes (after sync above)
  useEffect(() => {
    if (!config || !config.durationSeconds) return;

    const maxListened = listenedTimeMap[config.challengeId] || 0;
    const earnedPoints = Math.floor((maxListened / config.durationSeconds) * config.totalPoints);

    setPointsEarned(earnedPoints);
    setCurrentPoints(earnedPoints);
  }, [listenedTimeMap, config]);

  // Progress based on listenedTimeMap (doesn't jump backwards on restart)
  const progressPercentage = config && listenedTimeMap[config.challengeId] !== undefined && config.durationSeconds
    ? (listenedTimeMap[config.challengeId] / config.durationSeconds) * 100
    : 0;

  return {
    currentPoints,
    pointsEarned,
    progress: progressPercentage,
    isActive,
    startCounting,
    stopCounting,
    resetProgress,
  };
};
