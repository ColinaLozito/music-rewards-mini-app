// ChallengeProgressList - Reusable challenge progress list
import React from 'react';
import { View, Text } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { styles } from './ChallengeProgressList.styles';
import type { MusicChallenge } from '../../types';

export const COMPLETION_100_PERCENT = 100;

interface ChallengeProgressItemProps {
  challenge: MusicChallenge;
  isCompleted: boolean;
  progress: number;
}

interface ChallengeProgressListProps {
  challenges: MusicChallenge[];
  completedChallenges: string[];
  listenedTimeMap: Record<string, number>;
}

const ChallengeProgressItem = ({ challenge, isCompleted, progress }: ChallengeProgressItemProps) => {
  const statusStyle = {
    ...styles.challengeStatus,
    color: isCompleted ? styles.completedColor.color : styles.pendingColor.color,
  };

  return (
    <View key={challenge.id} style={styles.challengeItem}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={statusStyle}>
          {isCompleted ? '✅' : '⏳'}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.round(progress)}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {Math.round(progress)}% • {challenge.points} points
      </Text>
    </View>
  );
};

export const ChallengeProgressList = ({ challenges, completedChallenges, listenedTimeMap }: ChallengeProgressListProps) => {
  const getProgress = (challengeId: string, isCompleted: boolean): number => {
    if (isCompleted) return COMPLETION_100_PERCENT;
    const listened = listenedTimeMap[challengeId] || 0;
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.duration === 0) return 0;
    return Math.min(COMPLETION_100_PERCENT, (listened / challenge.duration) * COMPLETION_100_PERCENT);
  };

  return (
    <GlassCard style={styles.progressCard}>
      <Text style={styles.sectionTitle}>Challenge Progress</Text>
      {challenges.map((challenge) => {
        const isCompleted = completedChallenges.includes(challenge.id);
        const progress = getProgress(challenge.id, isCompleted);
        return (
          <ChallengeProgressItem
            key={challenge.id}
            challenge={challenge}
            isCompleted={isCompleted}
            progress={progress}
          />
        );
      })}
    </GlassCard>
  );
};
