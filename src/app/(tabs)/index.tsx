// Home screen - Challenge list (Expo Router)
import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { ChallengeList } from '../../components/challenge/ChallengeList';
import { MiniPlayer } from '../../components/ui/MiniPlayer';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useMusicStore, selectChallenges, selectCurrentTrack, selectIsPlaying } from '../../stores/musicStore';
import type { MusicChallenge } from '../../types';
import { styles } from './index.styles';

export default function HomeScreen() {
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
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
        currentTrackId={currentTrack?.id}
        isPlaying={isPlaying}
        onPlayChallenge={handlePlayChallenge}
      />
      <MiniPlayer />
    </View>
  );
}
