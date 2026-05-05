// Home screen - Challenge list (Expo Router)
import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { ChallengeList } from '../../components/challenge/ChallengeList';
import { MiniPlayer } from '../../components/ui/MiniPlayer';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useMusicStore, selectChallenges, selectCurrentTrack, selectIsPlaying } from '../../stores/musicStore';
import type { MusicChallenge } from '../../types';
import { styles } from '../../theme/app/_index.styles';
import { validateAudioUrl } from '../../utils/urlAudioValidator';
import { useLoadingStore } from '../../stores/loadingStore';
import { toast } from '../../utils/toast';

export default function HomeScreen() {
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const { play, resume } = useMusicPlayer();
  const { showLoading, hideLoading } = useLoadingStore.getState();

  const handlePlayChallenge = async (challenge: MusicChallenge) => {

     // CASE 1: Same track is already playing -> Just open the UI
    if (currentTrack?.id === challenge.id && isPlaying) {
      router.push('/(modals)/player');
      return;
    }

    showLoading('Loading track...');
    try {
      const isUrlValid = await validateAudioUrl(challenge.audioUrl);
      if (!isUrlValid) {
        // We throw a specific error to jump to the catch block
        throw new Error('INVALID_TRACK_URL');
      }
      hideLoading();
     
  
      // CASE 2: Same track is paused -> Resume and then open UI
      if (currentTrack?.id === challenge.id && !isPlaying) {
        await resume(); // This uses PlaybackOrchestrator.resume
        router.push('/(modals)/player');
        return;
      }
  
      // CASE 3 & 4: Different track (Completed or New)
      // We MUST await play() here. If validation fails, it throws and stops execution.
      await play(challenge);
  
      // If we reach this line, validation passed and TrackPlayer is ready
      router.push('/(modals)/player');
  
    } catch (error) {
      // This block catches errors from Case 2 (resume) and Cases 3/4 (play)
      // The hook useMusicPlayer already showed the toast and did the cleanup.
      console.warn('[Navigation Guard] Blocked:', error);
      if (error instanceof Error && error.message === 'INVALID_TRACK_URL') {
        toast.error('The audio file is currently unavailable.');
      }
      // Crucial: We do NOT call router.push here.
      // The user stays on the list and sees the error toast.
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
