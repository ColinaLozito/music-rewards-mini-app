// AchievementsList component - Displays user achievements (data-driven)
import React from 'react';
import { Text } from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { AchievementBadge } from '../../components/ui/AchievementBadge';
import { ACHIEVEMENTS } from '../../constants/achievements';
import { styles } from './AchievementsList.styles';

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
  const stats = { totalPoints, completedChallengesCount, completionRate };
  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.isUnlocked(stats));

  return (
    <GlassCard style={styles.achievementsCard}>
      <Text style={styles.sectionTitle}>Achievements</Text>
      
      {unlockedAchievements.length > 0 ? (
        unlockedAchievements.map(a => (
          <AchievementBadge key={a.id} icon={a.icon} title={a.title} description={a.description} />
        ))
      ) : (
        <Text style={styles.noAchievements}>
          Complete challenges to unlock achievements!
        </Text>
      )}
    </GlassCard>
  );
};
