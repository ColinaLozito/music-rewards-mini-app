import React from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { router } from 'expo-router';
import { GlassCard } from './GlassCard';
import { RoundedIconButton } from './RoundedIconButton';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { usePlayerModal } from '../../hooks/usePlayerModal';
import { useMusicStore, selectCurrentTrack } from '../../stores/musicStore';
import { styles as miniStyles } from './MiniPlayer.styles';
import { AudioProgressBar } from './AudioProgressBar';
import icons from '../../constants/icons';

const SECONDS_PER_MINUTE = 60
const TOTAL_PERCENTAGE = 100

export function MiniPlayer() {
  const currentTrack = useMusicStore(selectCurrentTrack);
  const { pause, resume, isPlaying } = useMusicPlayer();

  const {
    progressBarRef,
    progress,
    isCompleted,
    duration,
    displayPosition,
    handleSeek,
    setProgressBarWidth,
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
            <RoundedIconButton 
              icon={isPlaying ? icons.pause : icons.play} 
              onPress={handleTogglePlay}
              size={40}
              iconSize={20}
              variant={isPlaying ? 'primary' : 'glass'}
            />
          </View>
        </View>

         {/* Progress Bar */}
         <AudioProgressBar
           progressBarRef={progressBarRef}
           progress={progress}
           duration={duration}
           currentPosition={displayPosition}
           isCompleted={isCompleted}
          onSeek={handleSeek}
          onLayout={(event) => setProgressBarWidth(event.nativeEvent.layout.width)}
          formatTime={(seconds) => {
            const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
            const secs = Math.floor(seconds % SECONDS_PER_MINUTE);
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
          }}
        />
      </GlassCard>
    </View>
  );
}
