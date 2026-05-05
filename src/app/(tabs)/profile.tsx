// Profile screen - User progress and stats
import React, { useCallback } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { AchievementsList } from '../../components/profile/AchievementsList';
import { ChallengeProgressList } from '../../components/challenge/ChallengeProgressList';
import { useMusicStore, selectChallenges } from '../../stores/musicStore';
import { useUserStore, selectListenedTimeMap, selectCompletedChallenges, selectAwardedChallenges } from '../../stores/userStore';
import { calculateTotalPoints } from '../../utils/pointsCalculator';
import { styles } from '../../theme/app/_profile.styles';

export default function ProfileScreen() {
  const challenges = useMusicStore(selectChallenges);
  const listenedTimeMap = useUserStore(selectListenedTimeMap);
  const awardedChallenges = useUserStore(selectAwardedChallenges);
  const completedChallenges = useUserStore(selectCompletedChallenges);
  const resetProgress = useUserStore((state) => state.resetProgress);
  const resetMusic = useMusicStore((state) => state.reset);

  const totalPoints = calculateTotalPoints(challenges, listenedTimeMap, awardedChallenges);
  const totalChallenges = challenges.length;
  const completionRate = totalChallenges > 0 ? (completedChallenges.length / totalChallenges) * 100 : 0;

  const handleReset = useCallback(() => {
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
  }, [resetProgress, resetMusic]);

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
      <ChallengeProgressList
        challenges={challenges}
        completedChallenges={completedChallenges}
        listenedTimeMap={listenedTimeMap}
      />

      {/* Achievements */}
      <AchievementsList
        totalPoints={totalPoints}
        completedChallengesCount={completedChallenges.length}
        completionRate={completionRate}
      />

      {/* Reset App Button */}
      <GlassCard style={styles.resetCard}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <Text style={styles.resetDescription}>
          Erase all local data: points, progress, and completed challenges.
        </Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset App</Text>
        </TouchableOpacity>
      </GlassCard>
    </ScrollView>
  );
}
