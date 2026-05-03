// Custom hook for PlayerModal logic - encapsulates all state and handlers
import { useState, useRef, useEffect } from 'react';
import { View, GestureResponderEvent } from 'react-native';
import { useMusicPlayer } from './useMusicPlayer';
import { useMusicStore, selectCurrentTrack, selectIsPlaying, selectChallenges } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';

const PROGRESS_PERCENT = 100;
const SECONDS_PER_MINUTE = 60
const SEEK_BUFFER_MS = 1000; // 1 second buffer

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
    error
  } = useMusicPlayer();
  
  const completedChallenges = useUserStore((s) => s.completedChallenges);
  const listenedTimeMap = useUserStore((s) => s.listenedTimeMap);
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
  const [progressBarWidth, setProgressBarWidth] = useState(300);
  const [isSeeking, setIsSeeking] = useState(false); // Buffer for race condition
  const progressBarRef = useRef<View>(null);
  
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = Math.floor(seconds % SECONDS_PER_MINUTE);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  
  function getProgress(): number {
    if (!duration || duration === 0) return 0;
    // Use draggedPosition if dragging OR seeking (prevents flicker)
    const position = (isDragging || isSeeking) ? draggedPosition : currentPosition;
    return (position / duration) * PROGRESS_PERCENT;
  }
  
  function getChallengeProgress(): number {
    if (!displayChallenge || !duration || duration === 0) return 0;
    if (isCompleted) return PROGRESS_PERCENT; // Already completed
    const listened = listenedTimeMap[displayChallenge.id] || 0;
    return Math.min(PROGRESS_PERCENT, (listened / duration) * PROGRESS_PERCENT);
  }
  
  function handleSeek(percentage: number): void {
    if (!duration) return;
    const newPosition = (percentage / PROGRESS_PERCENT) * duration;
    setIsSeeking(true); // Start buffer
    seekTo(newPosition);
    setDraggedPosition(newPosition);
    // Clear buffer after delay
    setTimeout(() => setIsSeeking(false), SEEK_BUFFER_MS);
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
    try {
      seekTo(0);
      setCurrentPosition(0);
    } finally {
      // loading reset in seekTo finally block
    }
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
    if (!isCompleted) return;
    setIsDragging(false);
    setIsSeeking(true); // Start buffer
    
    // Clear seeking buffer after delay (allow engine to catch up)
    setTimeout(() => {
      setIsSeeking(false);
    }, SEEK_BUFFER_MS);
  }
  
  useEffect(() => {
    // Only sync if NOT dragging AND NOT seeking
    if (!isDragging && !isSeeking) {
      setDraggedPosition(currentPosition);
    }
  }, [isDragging, isSeeking, currentPosition]);
  
  // Note: error handled by PlayerModal component via Alert (not in hook)
   
  const displayPosition = ((isDragging || isSeeking) ? draggedPosition : currentPosition) || 0;
   
  return {
    // State
    currentTrack,
    displayChallenge,
    isCompleted,
    isPlaying,
    error,
    duration,
    displayPosition,
    progressBarWidth,
    progressBarRef,
    
    // Computed (safe defaults)
    progress: duration ? getProgress() : 0, // Track time progress
    challengeProgress: duration ? getChallengeProgress() : 0, // Challenge completion %
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
    
    // Seek buffer (for race condition fix)
    isSeeking,
    setIsSeeking,
  };
}
