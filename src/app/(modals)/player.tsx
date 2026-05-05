// Player modal - Full-screen audio player (Expo Router modal)
import React, { useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  Alert,
} from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { RoundedIconButton } from '../../components/ui/RoundedIconButton';
import { PointsCounter } from '../../components/ui/PointsCounter';
import { AudioProgressBar } from '../../components/ui/AudioProgressBar';
import { usePlayerModal } from '../../hooks/usePlayerModal';
import { THEME } from '../../theme/theme';
import { styles } from './player.styles';
import icons from '../../constants/icons';

export default function PlayerModal() {
  const {
    displayChallenge,
    isCompleted,
    isPlaying,
    error,
    isBuffering,
    retry,
    duration,
    displayPosition,
    progress,
    challengeProgress,
    handlePlayPause,
    handleRestart,
    handleSeek,
    setProgressBarWidth,
    progressBarRef,
  } = usePlayerModal();

  useEffect(() => {
    if (error) {
      Alert.alert('Playback Error', error);
    }
  }, [error]);

  const challengeStatusStyle = useMemo(() => ({
    ...styles.challengeStatus,
    color: displayChallenge?.completed ? THEME.colors.secondary : THEME.colors.accent
  }), [displayChallenge?.completed]);

  if (error && !displayChallenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <RoundedIconButton 
            icon={icons.replay} 
            onPress={retry}
            size={60}
            iconSize={24}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Track Info */}
        <GlassCard style={styles.trackInfoCard}>
          <Text style={styles.trackTitle}>{displayChallenge.title}</Text>
          <Text style={styles.trackArtist}>{displayChallenge.artist}</Text>
          <Text style={styles.trackDescription}>{displayChallenge.description}</Text>
          
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Challenge Points</Text>
            <Text style={styles.pointsValue}>{displayChallenge.points}</Text>
          </View>
        </GlassCard>

        {/* Buffering Indicator */}
        {isBuffering && (
          <GlassCard style={styles.bufferingCard}>
            <Text style={styles.bufferingText}>Buffering...</Text>
          </GlassCard>
        )}

        {/* Challenge Progress */}
        <GlassCard style={styles.challengeCard}>
          <View style={styles.challengeInfo}>
            <Text style={challengeStatusStyle}>
              {displayChallenge.completed ? '✅ Completed' : '🎧 In Progress'}
            </Text>
            <Text style={styles.challengeProgress}>
              {Math.round(challengeProgress)}% of challenge complete
            </Text>
          </View>
        </GlassCard>

        {/* Player Section */}
        <GlassCard style={styles.progressCard}>
          <Text style={styles.progressLabel}>Listening Progress</Text>
          
          {/* Progress Bar or Buffering */}
          {isBuffering ? (
            <Text style={styles.bufferingText}>Loading track...</Text>
          ) : (
            <AudioProgressBar
              progressBarRef={progressBarRef}
              progress={progress}
              duration={duration}
              currentPosition={displayPosition}
              isCompleted={isCompleted}
              onSeek={handleSeek}
              onLayout={(event) => setProgressBarWidth(event.nativeEvent.layout.width)}
              formatTime={(seconds) => {
                const minutes = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${minutes}:${secs.toString().padStart(2, '0')}`;
              }}
            />
          )}

          {/* Controls */}
          <View style={styles.controlsRow}>
            <RoundedIconButton 
              icon={icons.rewind} 
              onPress={handleRestart}
              size={60}
              iconSize={24}
              variant="glass"
            />
            <RoundedIconButton 
              icon={isPlaying ? icons.pause : icons.play} 
              onPress={handlePlayPause}
              size={60}
              iconSize={24}
              variant={isPlaying ? 'primary' : 'glass'}
            />
            {error && (
              <RoundedIconButton 
                icon={icons.replay} 
                onPress={retry}
                size={60}
                iconSize={24}
                variant="primary"
              />
            )}
          </View>
        </GlassCard>

        {/* Points Counter */}
         <PointsCounter
          totalPoints={displayChallenge.points}
          durationSeconds={displayChallenge.duration}
          challengeId={displayChallenge.id}
         />
      </View>
    </SafeAreaView>
  );
}
