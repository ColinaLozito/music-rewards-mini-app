// Home screen - Challenge list (Expo Router)
import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { ChallengeList } from '../../components/challenge/ChallengeList';
import { MiniPlayer } from '../../components/ui/MiniPlayer';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useMusicStore, selectChallenges, selectCurrentTrack } from '../../stores/musicStore';
import type { MusicChallenge } from '../../types';
import { styles } from '../../theme/app/_index.styles';
import { validateAudioUrl } from '../../utils/urlAudioValidator';
import { useLoadingStore } from '../../stores/loadingStore';
import { toast } from '../../utils/toast';

export default function HomeScreen() {
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const { play, resume, pause, isPlaying } = useMusicPlayer();
  const { showLoading, hideLoading } = useLoadingStore.getState();

  const handlePreloadChallenge = useCallback(async (challenge: MusicChallenge) => {
    // Get fresh state to avoid stale closures
    const state = useMusicStore.getState();
    const freshCurrentTrack = selectCurrentTrack(state);
    const freshIsPlaying = isPlaying;

    if (freshCurrentTrack?.id === challenge.id && !freshIsPlaying) {
      await resume();
      return;
    }
    if (freshCurrentTrack?.id === challenge.id && freshIsPlaying) {
      return;
    }
    showLoading('Loading track...');
    try {
      const isUrlValid = await validateAudioUrl(challenge.audioUrl);
      if (!isUrlValid) {
        throw new Error('INVALID_TRACK_URL');
      }
      hideLoading();
      if (freshCurrentTrack?.id !== challenge.id) {
        await play(challenge);
      }
    } catch (error) {
      hideLoading();
      console.warn('[Preload] Failed:', error);
      if (error instanceof Error && error.message === 'INVALID_TRACK_URL') {
        toast.error('The audio file is currently unavailable.');
      }
    }
  }, [isPlaying, play, resume, showLoading, hideLoading]);

  const handlePauseChallenge = () => {
    pause();
  };

  const handlePlayChallenge = useCallback(async (challenge: MusicChallenge) => {
    // Get fresh state directly from store to avoid stale closures
    const state = useMusicStore.getState();
    const freshCurrentTrack = selectCurrentTrack(state);

    // CASE 1: Same track is already playing -> Just open the UI
    if (freshCurrentTrack?.id === challenge.id && isPlaying) {
      router.push('/(modals)/player');
      return;
    }

    // CASE 2: Same track is paused -> Resume and then open UI (no loading)
    if (freshCurrentTrack?.id === challenge.id && !isPlaying) {
      await resume();
      router.push('/(modals)/player');
      return;
    };
  
    // CASE 3 & 4: Different track (Completed or New) -> Show loading
    showLoading('Loading track...');
    try {
      const isUrlValid = await validateAudioUrl(challenge.audioUrl);
      if (!isUrlValid) {
        throw new Error('INVALID_TRACK_URL');
      }
      hideLoading();  
      // We MUST await play() here. If validation fails, it throws and stops execution.
      await play(challenge);  
      // If we reach this line, validation passed and TrackPlayer is ready
      router.push('/(modals)/player');  
    } catch (error) {
      hideLoading();
      console.warn('[Navigation Guard] Blocked:', error);
      if (error instanceof Error && error.message === 'INVALID_TRACK_URL') {
        toast.error('The audio file is currently unavailable.');
      }
    }
  }, [isPlaying, play, resume, router, showLoading, hideLoading]);

  return (
    <View style={styles.container}>
      <ChallengeList
        challenges={challenges}
        currentTrackId={currentTrack?.id}
        isPlaying={isPlaying}
        onPreloadChallenge={handlePreloadChallenge}
        onResumeChallenge={resume}
        onPauseChallenge={handlePauseChallenge}
        onPressChallenge={handlePlayChallenge}
      />
      <MiniPlayer />
    </View>
  );
}
