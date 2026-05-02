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
  currentTrackId?: string | null;
  isPlaying: boolean;
  onPlayChallenge: (challenge: MusicChallenge) => void;
}

export const ChallengeList = React.memo<ChallengeListProps>(({
  challenges,
  currentTrackId,
  isPlaying,
  onPlayChallenge,
}) => {
  const renderChallenge = useCallback(({ item }: { item: MusicChallenge }) => (
    <ChallengeCard
      challenge={item}
      onPlay={onPlayChallenge}
      isCurrentTrack={currentTrackId === item.id}
      isPlaying={isPlaying}
    />
  ), [onPlayChallenge, currentTrackId, isPlaying]);

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
