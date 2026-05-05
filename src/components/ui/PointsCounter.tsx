// PointsCounter component - Reusable points counter UI
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { GlassCard } from './GlassCard';
import { usePointsCounter } from '../../hooks/usePointsCounter';
import { styles } from './PointsCounter.styles'

const MAX_PROGRESS_PERCENT = 100;

interface PointsCounterProps {
  totalPoints: number;
  durationSeconds: number;
  challengeId: string;
  style?: ViewStyle;
  onComplete?: () => void;
}

export const PointsCounter = React.memo<PointsCounterProps>(({
  totalPoints,
  durationSeconds,
  challengeId,
  style,
}) => {
  const {
    currentPoints,
    pointsEarned,
    progress,
    startCounting,
    stopCounting,
  } = usePointsCounter();

  useEffect(() => {
    startCounting({ totalPoints, durationSeconds, challengeId });
    return () => { stopCounting(); };
  }, [challengeId, startCounting, stopCounting]); // Only re-start when challenge changes

  const progressPercentage = Math.min(progress, MAX_PROGRESS_PERCENT);

  return (
    <GlassCard style={StyleSheet.flatten([styles.container, style])}>
      <View style={styles.header}>
        <Text style={styles.label}>Points Earned</Text>
        <Text style={styles.currentPoints}>{currentPoints}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>{Math.round(progress)}%</Text>
          <Text style={styles.infoText}>{pointsEarned} / {totalPoints} points</Text>
        </View>
      </View>
    </GlassCard>
  );
});

PointsCounter.displayName = 'PointsCounter';
