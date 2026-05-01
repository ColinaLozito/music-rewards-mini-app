// Home screen - Challenge list (Expo Router)
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { ChallengeCard } from '../../components/challenge/ChallengeCard';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useMusicStore, selectChallenges, selectCurrentTrack, selectIsPlaying } from '../../stores/musicStore';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

export default function HomeScreen() {
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const { play, resume } = useMusicPlayer();

  const handlePlayChallenge = async (challenge: MusicChallenge) => {
    // If this track is already playing, just open the modal (don't restart)
    if (currentTrack?.id === challenge.id) {
      router.push('/(modals)/player');
      return;
    }

    // If this track is current but paused, resume playback
    if (currentTrack?.id === challenge.id && !isPlaying) {
      try {
        await resume();
        router.push('/(modals)/player');
      } catch (error) {
        console.error('Failed to resume challenge:', error);
      }
      return;
    }

    // Otherwise, play the new track
    try {
      await play(challenge);
      router.push('/(modals)/player');
    } catch (error) {
      console.error('Failed to play challenge:', error);
    }
  };

  const renderChallenge = ({ item }: { item: MusicChallenge }) => (
    <ChallengeCard
      challenge={item}
      onPlay={handlePlayChallenge}
      isCurrentTrack={currentTrack?.id === item.id}
      isPlaying={isPlaying}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Music Challenges</Text>
      <Text style={styles.subtitle}>
        Complete listening challenges to earn points and unlock achievements
      </Text>
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
  },
  header: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  listContainer: {
    paddingBottom: THEME.spacing.xl,
  },
});