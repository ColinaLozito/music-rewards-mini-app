// Player modal - Full-screen audio player (Expo Router modal)
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { GlassCard, GlassButton } from '../../components/ui/GlassCard';
import { PointsCounter } from '../../components/ui/PointsCounter';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useMusicStore, selectCurrentTrack, selectIsPlaying, selectChallenges } from '../../stores/musicStore';
import { useUserStore } from '../../stores/userStore';
import { THEME } from '../../constants/theme';
import { styles } from './player.styles'

export default function PlayerModal() {
  const { 
    currentTrack, 
    isPlaying, 
    currentPosition, 
    duration, 
    play, 
    pause, 
    resume, 
    seekTo,
    loading,
    error 
  } = useMusicPlayer();
  const completedChallenges = useUserStore((s) => s.completedChallenges);
  const setCurrentPosition = useMusicStore((state) => state.setCurrentPosition);
  const challenges = useMusicStore(selectChallenges);
  
  // Get the live challenge data from store (not stale currentTrack)
  const liveChallenge = challenges.find(c => c.id === currentTrack?.id) || currentTrack;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const [isDragging, setIsDragging] = useState(false);
  const [draggedPosition, setDraggedPosition] = useState(currentPosition);
  const [progressBarWidth, setProgressBarWidth] = useState(300);

  const handleSeek = (percentage: number) => {
    if (!duration) return;
    const newPosition = (percentage / 100) * duration;
    seekTo(newPosition);
    setDraggedPosition(newPosition);
  };

  const handleDrag = (event: any) => {
    if (!duration) return;
    const { locationX } = event.nativeEvent;
    const percentage = Math.max(0, Math.min(100, (locationX / progressBarWidth) * 100));
    const newPosition = (percentage / 100) * duration;
    setDraggedPosition(newPosition); // Update visual immediately
    handleSeek(percentage);
  };

  const progressBarRef = useRef<View>(null);

  const getProgress = (): number => {
    if (!duration || duration === 0) return 0;
    const position = isDragging ? draggedPosition : currentPosition;
    return (position / duration) * 100;
  };

  // Reset dragged position when drag ends
  useEffect(() => {
    if (!isDragging) {
      setDraggedPosition(currentPosition);
    }
  }, [isDragging, currentPosition]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        resume();
      }
    }
  };

  // Format time display - use dragged position if dragging
  const displayPosition = isDragging ? draggedPosition : currentPosition;

  useEffect(() => {
    if (error) {
      Alert.alert('Playback Error', error);
    }
  }, [error]);

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

  // Use liveChallenge for display, fallback to currentTrack
  const displayChallenge = liveChallenge || currentTrack;

  // Helper for completion status (use displayChallenge.id, not currentTrack)
  const isCompleted = completedChallenges.includes(displayChallenge?.id || '');

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
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

        {/* Challenge Progress */}
        <GlassCard style={styles.challengeCard}>
          <View style={styles.challengeInfo}>
            <Text style={[
              styles.challengeStatus,
              { color: displayChallenge.completed ? THEME.colors.secondary : THEME.colors.accent }
            ]}>
              {displayChallenge.completed ? '✅ Completed' : '🎧 In Progress'}
            </Text>
            <Text style={styles.challengeProgress}>
              {Math.round(displayChallenge.progress)}% of challenge complete
            </Text>
             {/* Progress Percentage */}
        {/*   <Text style={styles.progressPercentage}>
            {Math.round(getProgress())}% Complete
          </Text> */}
          </View>
        </GlassCard>

        {/* Player Section */}
        <GlassCard style={styles.progressCard}>
          <Text style={styles.progressLabel}>Listening Progress</Text>
          
          {/* Progress Bar */}
          <View
            ref={progressBarRef}
            style={[
              styles.progressTrack,
              !isCompleted && styles.progressDisabled
            ]}
            onLayout={(event) => {
              setProgressBarWidth(event.nativeEvent.layout.width);
            }}
            onTouchStart={(event) => {
              // Only allow drag if challenge was already completed
              if (isCompleted) {
                setIsDragging(true);
                handleDrag(event);
              }
            }}
            onTouchMove={(event) => {
              if (isDragging && isCompleted) {
                handleDrag(event);
              }
            }}
            onTouchEnd={() => {
              setIsDragging(false);
            }}
          >
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${getProgress()}%` }
                ]} 
              />
            </View>
          </View>

          {/* Time Display */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(displayPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <GlassButton
              title="🔄 Restart Track"
              onPress={() => {
                seekTo(0);
                setCurrentPosition(0);
              }}
              variant="secondary"
              style={styles.mainControlButton}
            />
            <GlassButton
              title={loading ? "..." : isPlaying ? "⏸️ Pause" : "▶️ Play"}
              onPress={handlePlayPause}
              variant="primary"
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
