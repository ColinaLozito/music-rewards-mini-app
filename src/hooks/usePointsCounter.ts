// usePointsCounter hook - Calculates points earned based on audio playback progress
//
// Purpose: Animates points counter in real-time as the user listens to music.
// Derives earned points from playback position (0-100% → 0-totalPoints).
// Uses react-native-track-player's useProgress() hook for live position updates.
//
// Returns: UsePointsCounterReturn interface (see types/index.ts)
// - currentPoints: Points earned so far (animated)
// - pointsEarned: Final points when challenge completes
// - progress: Playback progress percentage (0-100)
// - isActive: Whether counter is currently running
// - startCounting(config): Initialize counter with challenge config
// - stopCounting(): Pause counter
// - resetProgress(): Reset counter to 0


import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from 'react-native-track-player';
import type { PointsCounterConfig, UsePointsCounterReturn } from '../types';

const POINTS_UPDATE_INTERVAL_MS = 500;

export const usePointsCounter = (): UsePointsCounterReturn => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PointsCounterConfig | null>(null);
  
  const progress = useProgress();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCounting = useCallback((newConfig: PointsCounterConfig) => {
    setConfig(newConfig);
    setIsActive(true);
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);

  const stopCounting = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);

  const pointsEarnedRef = useRef(pointsEarned);
  pointsEarnedRef.current = pointsEarned;

  // Calculate points based on playback progress
  useEffect(() => {
    if (!isActive || !config) return;

    const calculatePoints = () => {
      if (!progress.duration || progress.duration === 0) return;

      const progressPercentage = (progress.position / progress.duration) * 100;
      const earnedPoints = Math.floor((progressPercentage / 100) * config.totalPoints);

      if (earnedPoints > pointsEarnedRef.current) {
        pointsEarnedRef.current = earnedPoints;
        setPointsEarned(earnedPoints);
        setCurrentPoints(earnedPoints);
      }
    };

    // Calculate immediately
    calculatePoints();

    // Then recalculate every POINTS_UPDATE_INTERVAL_MS while active
    intervalRef.current = setInterval(calculatePoints, POINTS_UPDATE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, config]);

  return {
    currentPoints,
    pointsEarned,
    progress: progress.position > 0 && progress.duration > 0
      ? (progress.position / progress.duration) * 100
      : 0,
    isActive,
    startCounting,
    stopCounting,
    resetProgress,
  };
};
