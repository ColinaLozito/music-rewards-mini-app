// Custom hook for PlayerModal logic - encapsulates all state and handlers
import { useState, useRef, useEffect } from 'react';
import { View, GestureResponderEvent } from 'react-native';
import { useMusicPlayer } from './useMusicPlayer';
import { useMusicStore, selectCurrentTrack, selectIsPlaying, selectChallenges } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';

const DEFAULT_PROGRESS_BAR_WIDTH = 300;
const PROGRESS_PERCENT = 100;
const SECONDS_PER_MINUTE = 60

export function usePlayerModal() {
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
  
  const liveChallenge = currentTrack 
    ? challenges.find(c => c.id === currentTrack.id) || currentTrack 
    : null;
  const displayChallenge = liveChallenge;
  const isCompleted = displayChallenge 
    ? completedChallenges.includes(displayChallenge.id) 
    : false;
  
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPosition, setDraggedPosition] = useState(currentPosition);
  const [progressBarWidth, setProgressBarWidth] = useState(DEFAULT_PROGRESS_BAR_WIDTH);
  const progressBarRef = useRef<View>(null);
  
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = Math.floor(seconds % SECONDS_PER_MINUTE);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  
  function getProgress(): number {
    if (!duration || duration === 0) return 0;
    const position = isDragging ? draggedPosition : currentPosition;
    return (position / duration) * PROGRESS_PERCENT;
  }
  
  function handleSeek(percentage: number): void {
    if (!duration) return;
    const newPosition = (percentage / PROGRESS_PERCENT) * duration;
    seekTo(newPosition);
    setDraggedPosition(newPosition);
  }
  
  function handleDrag(event: GestureResponderEvent): void {
    if (!duration) return;
    const { locationX } = event.nativeEvent;
    const percentage = Math.max(0, Math.min(PROGRESS_PERCENT, (locationX / progressBarWidth) * PROGRESS_PERCENT));
    const newPosition = (percentage / PROGRESS_PERCENT) * duration;
    setDraggedPosition(newPosition);
    handleSeek(percentage);
  }
  
  function handlePlayPause(): void {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        resume();
      }
    }
  }
  
  function handleRestart(): void {
    seekTo(0);
    setCurrentPosition(0);
  }
  
  function onTouchStart(event: GestureResponderEvent): void {
    if (isCompleted) {
      setIsDragging(true);
      handleDrag(event);
    }
  }
  
  function onTouchMove(event: GestureResponderEvent): void {
    if (isDragging && isCompleted) {
      handleDrag(event);
    }
  }
  
  function onTouchEnd(): void {
    setIsDragging(false);
  }
  
  useEffect(() => {
    if (!isDragging) {
      setDraggedPosition(currentPosition);
    }
  }, [isDragging, currentPosition]);
  
  // Error effect removed - handled by PlayerModal component via Alert
  
  const displayPosition = (isDragging ? draggedPosition : currentPosition) || 0;
  
  return {
    // State
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
    
    // Computed (safe defaults)
    progress: duration ? getProgress() : 0,
    formattedTime: formatTime(displayPosition),
    formattedDuration: formatTime(duration || 0),
    
    // Handlers
    handleDrag,
    handlePlayPause,
    handleRestart,
    handleSeek,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    setProgressBarWidth,
  };
}
