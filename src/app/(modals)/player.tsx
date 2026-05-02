// Player modal - Full-screen audio player (Expo Router modal)
import React, { useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  Alert
} from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { PointsCounter } from '../../components/ui/PointsCounter';
import { usePlayerModal } from '../../hooks/usePlayerModal';
import { THEME } from '../../constants/theme';
import { styles } from './player.styles';

export default function PlayerModal() {
  const {
    currentTrack,
    displayChallenge,
    isCompleted,
    isPlaying,
    loading,
    error,
    duration,
    displayPosition,
    progressBarWidth,
    progressBarRef,
    progress,
    challengeProgress,
    formattedTime,
    formattedDuration,
    handleDrag,
    handlePlayPause,
    handleRestart,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    setProgressBarWidth,
  } = usePlayerModal();

  useEffect(() => {
    if (error) {
      Alert.alert('Playback Error', error);
    }
  }, [error]);

  const challengeStatusStyle = useMemo(() => ({
    ...styles.challengeStatus,
    color: displayChallenge.completed ? THEME.colors.secondary : THEME.colors.accent
  }), [displayChallenge.completed]);

  const progressTrackStyle = useMemo(() => ({
    ...styles.progressTrack,
    ...( !isCompleted ? styles.progressDisabled : {})
  }), [isCompleted]);

  const progressFillStyle = useMemo(() => ({
    ...styles.progressFill,
    width: `${progress}%` as const
  }), [progress]);

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <GlassCard style={styles.noTrackCard}>
          <Text style={styles.noTrackText}>No track selected</Text>
          <Text style={styles.noTrackSubtext}>
            Go back and select a challenge to start playing music
          </Text>
        </GlassCard>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={loading} message="Loading..." />
      
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
          
          {/* Progress Bar */}
          <View
            ref={progressBarRef}
            style={progressTrackStyle}
            onLayout={(event) => setProgressBarWidth(event.nativeEvent.layout.width)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <View style={styles.progressBackground}>
              <View 
                style={progressFillStyle} 
              />
            </View>
          </View>

          {/* Time Display */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formattedTime}</Text>
            <Text style={styles.timeText}>{formattedDuration}</Text>
          </View>
          
          {/* Controls */}
          <View style={styles.controlsRow}>
            <GlassButton
              title="🔄 Restart Track"
              onPress={handleRestart}
              variant="secondary"
              style={styles.mainControlButton}
            />
            <GlassButton
              title={loading ? "..." : isPlaying ? "⏸️ Pause" : "▶️ Play"}
              onPress={handlePlayPause}
              variant={isPlaying ? 'primary' : 'secondary'}
              style={styles.mainControlButton}
              loading={loading}
            />
          </View>
        </GlassCard>

        {/* Points Counter */}
         <PointsCounter
          totalPoints={displayChallenge.points}
          durationSeconds={displayChallenge.duration}
          challengeId={displayChallenge.id}
          isActive={isPlaying}
        />
      </View>
    </SafeAreaView>
  );
}
