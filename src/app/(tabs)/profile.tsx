// Profile screen - User progress and stats
import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { useMusicStore, selectChallenges } from '../../stores/musicStore';
import { useUserStore, selectListenedTimeMap, selectCompletedChallenges } from '../../stores/userStore';
import { THEME } from '../../constants/theme';
import { styles } from './profile.styles';

function calculateTotalPoints(
  challenges: { id: string; duration: number; points: number }[],
  listenedTimeMap: Record<string, number>,
  awardedChallenges: Record<string, number>
): number {
  return challenges.reduce((sum, challenge) => {
    if (awardedChallenges[challenge.id] !== undefined) {
      return sum + awardedChallenges[challenge.id];
    }
    const listened = listenedTimeMap[challenge.id] || 0;
    if (challenge.duration === 0) return sum;
    return sum + Math.floor((listened / challenge.duration) * challenge.points);
  }, 0);
}

export default function ProfileScreen() {
  const challenges = useMusicStore(selectChallenges);
  const listenedTimeMap = useUserStore(selectListenedTimeMap);
  const awardedChallenges = useUserStore((state) => state.awardedChallenges);
  const completedChallenges = useUserStore(selectCompletedChallenges);
  const resetProgress = useUserStore((state) => state.resetProgress);
  const resetMusic = useMusicStore((state) => state.reset);

  const totalPoints = calculateTotalPoints(challenges, listenedTimeMap, awardedChallenges);

  const totalChallenges = challenges.length;
  const completionRate = totalChallenges > 0 ? (completedChallenges.length / totalChallenges) * 100 : 0;

  const handleReset = () => {
    Alert.alert(
      'Reset App',
      'This will erase all local data: points, progress, and completed challenges. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetProgress();
            resetMusic();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Progress</Text>

      {/* Stats Overview */}
      <GlassCard style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedChallenges.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(completionRate)}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>
      </GlassCard>

      {/* Challenge Progress */}
      <GlassCard style={styles.progressCard}>
        <Text style={styles.sectionTitle}>Challenge Progress</Text>
        {challenges.map((challenge) => {
          const isCompleted = completedChallenges.includes(challenge.id);
          const displayProgress = isCompleted ? 100 : challenge.progress;
          return (
            <View key={challenge.id} style={styles.challengeItem}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={[
                  styles.challengeStatus,
                  { color: isCompleted ? THEME.colors.secondary : THEME.colors.text.secondary }
                ]}>
                  {isCompleted ? '✅' : '⏳'}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${displayProgress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(displayProgress)}% • {challenge.points} points
              </Text>
            </View>
          );
        })}
      </GlassCard>

      {/* Achievements */}
      <GlassCard style={styles.achievementsCard}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        
        {totalPoints >= 100 && (
          <View style={styles.achievement}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <Text style={styles.achievementText}>First 100 Points!</Text>
          </View>
        )}
        
        {completedChallenges.length >= 1 && (
          <View style={styles.achievement}>
            <Text style={styles.achievementIcon}>🎵</Text>
            <Text style={styles.achievementText}>Music Lover</Text>
          </View>
        )}
        
        {completionRate >= 100 && (
          <View style={styles.achievement}>
            <Text style={styles.achievementIcon}>🌟</Text>
            <Text style={styles.achievementText}>Perfect Score!</Text>
          </View>
        )}

        {totalPoints === 0 && completedChallenges.length === 0 && (
          <Text style={styles.noAchievements}>
            Complete challenges to unlock achievements!
          </Text>
        )}
      </GlassCard>

      {/* Reset App Button */}
      <GlassCard style={styles.resetCard}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <Text style={styles.resetDescription}>
          Erase all local data: points, progress, and completed challenges.
        </Text>
        <View style={styles.resetButton} onTouchEnd={handleReset}>
          <Text style={styles.resetButtonText}>Reset App</Text>
        </View>
      </GlassCard>
    </ScrollView>
  );
}