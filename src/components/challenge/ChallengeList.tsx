// ChallengeList component - Extracted FlatList from Home screen
//
// Purpose: Separates list rendering logic from HomeScreen (index.tsx).
// Provides memoized rendering with performance optimizations:
// - React.memo wrapping to prevent unnecessary re-renders
// - useCallback for renderItem to maintain referential stability
// - getItemLayout for constant-height items (280px) to optimize FlatList
//
// Props:
// - challenges: MusicChallenge[] - Array of challenges to display
// - currentTrackId: Currently playing track ID (for highlighting)
// - isPlaying: Whether audio is currently playing
// - onPlayChallenge: Callback when user taps Play on a challenge


import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ChallengeCard } from './ChallengeCard';
import type { MusicChallenge } from '../../types';

const CHALLENGE_CARD_HEIGHT = 280;

interface ChallengeListProps {
  challenges: MusicChallenge[];
  listenedTimeMap: Record<string, number>;
  awardedChallenges: Record<string, number>;
  currentTrackId?: string | null;
  isPlaying: boolean;
  onPlayChallenge: (challenge: MusicChallenge) => void;
}

function calculateEarnedPoints(
  challenge: MusicChallenge,
  listenedTimeMap: Record<string, number>,
  awardedChallenges: Record<string, number>
): number {
  const awarded = awardedChallenges[challenge.id];
  if (awarded !== undefined) return awarded;
  const listened = listenedTimeMap[challenge.id] || 0;
  if (challenge.duration === 0) return 0;
  return Math.floor((listened / challenge.duration) * challenge.points);
}

export const ChallengeList = React.memo<ChallengeListProps>(({
  challenges,
  listenedTimeMap,
  awardedChallenges,
  currentTrackId,
  isPlaying,
  onPlayChallenge,
}) => {
  const renderChallenge = useCallback(({ item }: { item: MusicChallenge }) => {
    const earnedPoints = calculateEarnedPoints(item, listenedTimeMap, awardedChallenges);
    return (
      <ChallengeCard
        challenge={item}
        earnedPoints={earnedPoints}
        onPlay={onPlayChallenge}
        isCurrentTrack={currentTrackId === item.id}
        isPlaying={isPlaying}
      />
    );
  }, [onPlayChallenge, currentTrackId, isPlaying, listenedTimeMap, awardedChallenges]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: CHALLENGE_CARD_HEIGHT,
    offset: CHALLENGE_CARD_HEIGHT * index,
    index,
  }), []);

  return (
    <FlatList
      data={challenges}
      renderItem={renderChallenge}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      getItemLayout={getItemLayout}
    />
  );
});

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 32,
  },
});

ChallengeList.displayName = 'ChallengeList';
