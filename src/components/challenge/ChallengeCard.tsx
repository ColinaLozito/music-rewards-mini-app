// ChallengeCard component - Individual challenge display
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard, GlassButton } from '../ui/GlassCard';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';
import { styles } from './ChallengeCard.styles'

interface ChallengeCardProps {
  challenge: MusicChallenge;
  earnedPoints: number;
  progressPercentage: number; // From listenedTimeMap (actual playback)
  onPlay: (challenge: MusicChallenge) => void;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
}

export const ChallengeCard = React.memo<ChallengeCardProps>(({
  challenge,
  earnedPoints,
  progressPercentage,
  onPlay,
  isCurrentTrack = false,
  isPlaying = false,
}) => {
  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'easy': return THEME.colors.secondary;
      case 'medium': return THEME.colors.accent;
      case 'hard': return THEME.colors.primary;
      default: return THEME.colors.text.secondary;
    }
  }

  function getButtonTitle() {
    if (challenge.completed) return 'Play Again';
    if (isCurrentTrack && isPlaying) return 'Open Player';
    if (isCurrentTrack && !isPlaying) return 'Resume';
    return 'Play Challenge';
  }
  const buttonTitle = getButtonTitle();

  return (
    <GlassCard
      style={StyleSheet.flatten([
        styles.card,
        isCurrentTrack && styles.currentTrackCard
      ])}
      gradientColors={
        isCurrentTrack
          ? THEME.glass.gradientColors.primary
          : THEME.glass.gradientColors.card
      }
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.artist}>{challenge.artist}</Text>
        </View>
        <View style={StyleSheet.flatten([
          styles.difficultyBadge,
          { backgroundColor: getDifficultyColor(challenge.difficulty) }
        ])}>
          <Text style={styles.difficultyText}>
            {challenge.difficulty.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {challenge.description}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>{formatDuration(challenge.duration)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Points</Text>
          <Text style={[styles.infoValue, { color: THEME.colors.accent }]}>
            {earnedPoints} / {challenge.points}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Progress</Text>
          <Text style={styles.infoValue}>{Math.round(progressPercentage)}%</Text>
        </View>
      </View>

      {progressPercentage > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={StyleSheet.flatten([
                styles.progressFill,
                { width: `${progressPercentage}%` }
              ])}
            />
          </View>
        </View>
      )}

      <GlassButton
        title={getButtonTitle()}
        onPress={() => onPlay(challenge)}
        variant={isCurrentTrack ? 'primary' : 'secondary'}
        style={styles.playButton}
      />
    </GlassCard>
  );
});

ChallengeCard.displayName = 'ChallengeCard';
