// ChallengeCard component - Individual challenge display
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { RoundedIconButton } from '../ui/RoundedIconButton';
import { DifficultyBadge } from './DifficultyBadge';
import { THEME } from '../../theme/theme';
import type { MusicChallenge } from '../../types';
import { styles } from './ChallengeCard.styles'
import { formatDuration } from '../../utils/challengeHelpers';
import icons from '../../constants/icons';

interface ChallengeCardProps {
  challenge: MusicChallenge;
  earnedPoints: number;
  progressPercentage: number; // From listenedTimeMap (actual playback)
  onPreload: (challenge: MusicChallenge) => void;
  onResume?: () => void;
  onPause?: () => void;
  onPress?: (challenge: MusicChallenge) => void;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
}

export const ChallengeCard = React.memo<ChallengeCardProps>(({
  challenge,
  earnedPoints,
  progressPercentage,
  onPreload,
  onResume,
  onPause,
  onPress,
  isCurrentTrack = false,
  isPlaying = false,
}) => {
  const handleCardPress = React.useCallback(() => {
    if (onPress) onPress(challenge);
  }, [onPress, challenge]);

  const handleButtonPress = React.useCallback(() => {
    if (isPlaying && onPause) {
      onPause();
    } else if (!isPlaying && isCurrentTrack && onResume) {
      onResume();
    } else {
      onPreload(challenge);
    }
  }, [isPlaying, isCurrentTrack, onPause, onResume, onPreload, challenge]);

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
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
      <GlassCard
        style={cardStyle}
        gradientColors={
          isCurrentTrack
            ? THEME.glass.gradientColors.primary
            : THEME.glass.gradientColors.card
        }
        backgroundImage={challenge.artwork}
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

        <View style={styles.buttonContainer}>
          <RoundedIconButton
            icon={isCurrentTrack && isPlaying ? icons.pause : icons.play}
            onPress={handleButtonPress}
            size={50}
            iconSize={20}
            variant={isCurrentTrack ? 'primary' : 'glass'}
          />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
});

ChallengeCard.displayName = 'ChallengeCard';
