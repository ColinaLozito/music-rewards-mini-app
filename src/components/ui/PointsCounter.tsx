// PointsCounter component - Reusable points counter UI
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { GlassCard } from './GlassCard';
import { usePointsCounter } from '../../hooks/usePointsCounter';
import { THEME } from '../../constants/theme';
import type { PointsCounterConfig } from '../../types';

const MAX_PROGRESS_PERCENT = 100;

interface PointsCounterProps {
  totalPoints: number;
  durationSeconds: number;
  challengeId: string;
  isActive: boolean;
  style?: ViewStyle;
  onComplete?: () => void;
}

export const PointsCounter = React.memo<PointsCounterProps>(({
  totalPoints,
  durationSeconds,
  challengeId,
  isActive,
  style,
  onComplete,
}) => {
  const {
    currentPoints,
    pointsEarned,
    progress,
    startCounting,
    stopCounting,
  } = usePointsCounter();

  useEffect(() => {
    if (isActive) {
      startCounting({ totalPoints, durationSeconds, challengeId });
    }

    return () => {
      stopCounting();
    };
  }, [isActive, totalPoints, durationSeconds, challengeId, startCounting, stopCounting]);

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

      {pointsEarned >= totalPoints && (
        <Text style={styles.completeText}>✅ Complete!</Text>
      )}
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  label: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  currentPoints: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.accent,
  },
  progressContainer: {
    marginTop: THEME.spacing.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: THEME.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  completeText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.secondary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: THEME.spacing.sm,
  },
});

PointsCounter.displayName = 'PointsCounter';
