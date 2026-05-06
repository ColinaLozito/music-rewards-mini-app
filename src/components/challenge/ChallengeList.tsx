// ChallengeList component - Extracted FlatList from Home screen

import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ChallengeCard } from './ChallengeCard';
import { useUserStore } from '../../stores/userStore';
import type { MusicChallenge } from '../../types';
import { styles } from './ChallengeList.styles'

const CHALLENGE_CARD_HEIGHT = 280;

interface ChallengeListProps {
  challenges: MusicChallenge[];
  currentTrackId?: string | null;
  isPlaying: boolean;
  onPreloadChallenge: (challenge: MusicChallenge) => void;
  onResumeChallenge?: () => void;
  onPauseChallenge?: () => void;
  onPressChallenge: (challenge: MusicChallenge) => void;
}

export const ChallengeList = React.memo<ChallengeListProps>(({
  challenges,
  currentTrackId,
  isPlaying,
  onPreloadChallenge,
  onResumeChallenge,
  onPauseChallenge,
  onPressChallenge,
}) => {
  const renderChallenge = useCallback(({ item }: { item: MusicChallenge }) => {
    // Get store data directly (avoids object deps in callback)
    const { listenedTimeMap, awardedChallenges } = useUserStore.getState();
    
    // Use awarded points if challenge completed (full points), else calculate from listenedTimeMap
    const awarded = awardedChallenges[item.id];
    const earnedPoints = awarded !== undefined
      ? awarded
      : Math.floor(((listenedTimeMap[item.id] || 0) / item.duration) * item.points);
    // Progress from listenedTimeMap (actual playback, not challenge.progress)
    const progressPercentage = item.duration > 0
      ? (listenedTimeMap[item.id] || 0) / item.duration * 100
      : 0;
    return (
      <ChallengeCard
        challenge={item}
        earnedPoints={earnedPoints}
        progressPercentage={progressPercentage}
        onPreload={onPreloadChallenge}
        onResume={onResumeChallenge}
        onPause={onPauseChallenge}
        onPress={onPressChallenge}
        isCurrentTrack={currentTrackId === item.id}
        isPlaying={isPlaying}
      />
    );
  }, [onPreloadChallenge, onResumeChallenge, onPauseChallenge, onPressChallenge, currentTrackId, isPlaying]);

  const listHeader = useMemo(() => (
    <View>
      <Text style={styles.header}>Music Challenges</Text>
      <Text style={styles.subtitle}>
        Complete listening challenges to earn points and unlock achievements
      </Text>
    </View>
  ), [])

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: CHALLENGE_CARD_HEIGHT,
    offset: CHALLENGE_CARD_HEIGHT * index,
    index,
  }), []);

  return (
    <FlatList
      data={challenges}
      ListHeaderComponent={listHeader}
      renderItem={renderChallenge}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      getItemLayout={getItemLayout}
    />
  );
});

ChallengeList.displayName = 'ChallengeList';
