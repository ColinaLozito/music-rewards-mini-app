// Home screen - Challenge list (Expo Router)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ChallengeList } from '../../components/challenge/ChallengeList';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useMusicStore, selectChallenges, selectCurrentTrack, selectIsPlaying } from '../../stores/musicStore';
import { useUserStore, selectListenedTimeMap } from '../../stores/userStore';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

export default function HomeScreen() {
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const listenedTimeMap = useUserStore(selectListenedTimeMap);
  const awardedChallenges = useUserStore((state) => state.awardedChallenges);
  const { play, resume } = useMusicPlayer();

  const handlePlayChallenge = async (challenge: MusicChallenge) => {
    // Same track playing → keep playing (don't restart)
    if (currentTrack?.id === challenge.id && isPlaying) {
      router.push('/(modals)/player');
      return;
    }

    // Same track paused → resume
    if (currentTrack?.id === challenge.id && !isPlaying) {
      try {
        await resume();
        router.push('/(modals)/player');
      } catch (error) {
        console.error('Failed to resume challenge:', error);
      }
      return;
    }

    // Completed challenge (different track) → restart + play
    if (challenge.completed) {
      try {
        await play(challenge);
        router.push('/(modals)/player');
      } catch (error) {
        console.error('Failed to play challenge:', error);
      }
      return;
    }

    // Different track → restart + play
    try {
      await play(challenge);
      router.push('/(modals)/player');
    } catch (error) {
      console.error('Failed to play challenge:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Music Challenges</Text>
      <Text style={styles.subtitle}>
        Complete listening challenges to earn points and unlock achievements
      </Text>
      <ChallengeList
        challenges={challenges}
        listenedTimeMap={listenedTimeMap}
        awardedChallenges={awardedChallenges}
        currentTrackId={currentTrack?.id}
        isPlaying={isPlaying}
        onPlayChallenge={handlePlayChallenge}
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
});
