import React, { useMemo } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { router } from 'expo-router';
import { GlassCard } from './GlassCard';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { usePlayerModal } from '../../hooks/usePlayerModal';
import { useMusicStore, selectCurrentTrack, selectIsPlaying } from '../../stores/musicStore';
import { styles as miniStyles } from './MiniPlayer.styles';
import { AudioProgressBar } from './AudioProgressBar';

export function MiniPlayer() {
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const { pause, resume } = useMusicPlayer();

  const {
    progressBarRef,
    progress,
    isCompleted,
    duration,
    handleSeek,
    setProgressBarWidth,
    formattedTime,
    formattedDuration,
  } = usePlayerModal();

  // Early return AFTER all hooks
  if (!currentTrack) return null;

  function handleTogglePlay() {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }

  function handlePress() {
    router.push('/(modals)/player');
  }

  return (
    <View style={miniStyles.container}>
      <GlassCard style={miniStyles.card}>
        <View style={miniStyles.topSection}>
          <TouchableOpacity 
            style={miniStyles.info} 
            onPress={handlePress} 
            activeOpacity={0.7}
          >
            <Text numberOfLines={1} style={miniStyles.title}>
              {currentTrack.title}
            </Text>
            <Text numberOfLines={1} style={miniStyles.artist}>
              {currentTrack.artist}
            </Text>
          </TouchableOpacity>        
          
          <View style={miniStyles.controls}>
            <TouchableOpacity 
              style={miniStyles.playPauseButton} 
              onPress={handleTogglePlay}
            >
              <Text style={miniStyles.icon}>
                {isPlaying ? '⏸️' : '▶️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar */}
        <AudioProgressBar
          progressBarRef={progressBarRef}
          progress={progress}
          duration={duration}
          currentPosition={duration * (progress / 100)} // Approximate
          isCompleted={isCompleted}
          onSeek={handleSeek}
          onLayout={(event) => setProgressBarWidth(event.nativeEvent.layout.width)}
          formatTime={(seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
          }}
        />
      </GlassCard>
    </View>
  );
}
