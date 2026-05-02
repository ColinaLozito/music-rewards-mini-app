// ChallengeCard component - Individual challenge display
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { DifficultyBadge } from './DifficultyBadge';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';
import { styles } from './ChallengeCard.styles'

const SECONDS_PER_MINUTE = 60;

interface ChallengeCardProps {
  challenge: MusicChallenge;
  earnedPoints: number;
  progressPercentage: number; // From listenedTimeMap (actual playback)
  onPlay: (challenge: MusicChallenge) => void;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
}

// Pure functions (outside component per CODE_RULES.md)
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const remainingSeconds = seconds % SECONDS_PER_MINUTE;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getButtonTitle(challenge: MusicChallenge, isCurrentTrack: boolean, isPlaying: boolean): string {
  if (challenge.completed) return 'Play Again';
  if (isCurrentTrack && isPlaying) return 'Open Player';
  if (isCurrentTrack && !isPlaying) return 'Resume';
  return 'Play Challenge';
}

export const ChallengeCard = React.memo<ChallengeCardProps>(({
  challenge,
  earnedPoints,
  progressPercentage,
  onPlay,
  isCurrentTrack = false,
  isPlaying = false,
}) => {
  const buttonTitle = getButtonTitle(challenge, isCurrentTrack, isPlaying);

  const handlePlay = React.useCallback(() => {
    onPlay(challenge);
  }, [onPlay, challenge]);

  const cardStyle = React.useMemo(() => {
    if (isCurrentTrack) {
      return { ...styles.card, ...styles.currentTrackCard };
    }
    return styles.card;
  }, [isCurrentTrack]);

  const pointsStyle = React.useMemo(() => [
    styles.infoValue,
    { color: THEME.colors.accent }
  ], []);

  const progressFillStyle = React.useMemo(() => ({
    ...styles.progressFill,
    width: `${progressPercentage}%` as const
  }), [progressPercentage]);

  return (
    <GlassCard
      style={cardStyle}
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
        <DifficultyBadge difficulty={challenge.difficulty} />
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
          <Text style={pointsStyle}>
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
            <View style={progressFillStyle} />
          </View>
        </View>
      )}

      <GlassButton
        title={buttonTitle}
        onPress={handlePlay}
        variant={isCurrentTrack ? 'primary' : 'secondary'}
        style={styles.playButton}
      />
    </GlassCard>
  );
});

ChallengeCard.displayName = 'ChallengeCard';
