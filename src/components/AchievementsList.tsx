// AchievementsList component - Displays user achievements
import React from 'react';
import { View, Text } from 'react-native';
import { GlassCard } from './ui/GlassCard';
import { THEME } from '../constants/theme';
import { styles } from './AchievementsList.styles';

const FIRST_100_POINTS_THRESHOLD = 100;
const MUSIC_LOVER_CHALLENGES_COUNT = 1;
const PERFECT_SCORE_COMPLETION_RATE = 100;

interface AchievementsListProps {
  totalPoints: number;
  completedChallengesCount: number;
  completionRate: number;
}

export const AchievementsList: React.FC<AchievementsListProps> = ({
  totalPoints,
  completedChallengesCount,
  completionRate,
}) => {
  const hasAnyAchievement = totalPoints > 0 || completedChallengesCount > 0;

  return (
    <GlassCard style={styles.achievementsCard}>
      <Text style={styles.sectionTitle}>Achievements</Text>
      
      {totalPoints >= FIRST_100_POINTS_THRESHOLD && (
        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>🏆</Text>
          <Text style={styles.achievementText}>First 100 Points!</Text>
        </View>
      )}
      
      {completedChallengesCount >= MUSIC_LOVER_CHALLENGES_COUNT && (
        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>🎵</Text>
          <Text style={styles.achievementText}>Music Lover</Text>
        </View>
      )}
      
      {completionRate >= PERFECT_SCORE_COMPLETION_RATE && (
        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>🌟</Text>
          <Text style={styles.achievementText}>Perfect Score!</Text>
        </View>
      )}

      {!hasAnyAchievement && (
        <Text style={styles.noAchievements}>
          Complete challenges to unlock achievements!
        </Text>
      )}
    </GlassCard>
  );
};
