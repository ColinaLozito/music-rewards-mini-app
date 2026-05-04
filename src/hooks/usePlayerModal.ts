// usePlayerModal - Player modal state + handlers (seek, drag, play/pause, restart)
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, GestureResponderEvent } from 'react-native';
import { useMusicPlayer } from './useMusicPlayer';
import { useMusicStore, selectChallenges } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';
import { formatTime } from '../utils/timeFormat';

const PROGRESS_PERCENT = 100;
const SEEK_BUFFER_MS = 1000; // 1 second buffer

export function usePlayerModal() {
  const {
    currentTrack,
    isPlaying,
    currentPosition,
    duration,
    pause,
    resume,
    seekTo,
    error
  } = useMusicPlayer();

  const [isDragging, setIsDragging] = useState(false);
  const [draggedPosition, setDraggedPosition] = useState(currentPosition);
  const [progressBarWidth, setProgressBarWidth] = useState(300);
  const [isSeeking, setIsSeeking] = useState(false); // Buffer for race condition
  const progressBarRef = useRef<View>(null);
  
  const completedChallenges = useUserStore((state) => state.completedChallenges);
  const listenedTimeMap = useUserStore((state) => state.listenedTimeMap);
  const setCurrentPosition = useMusicStore((state) => state.setCurrentPosition);
  const challenges = useMusicStore(selectChallenges);
  
  // Memoize derived values
  const liveChallenge = useMemo(() => 
    currentTrack 
      ? challenges.find(c => c.id === currentTrack.id) || currentTrack 
      : null
  , [currentTrack, challenges]);

  const displayChallenge = liveChallenge;

  const isCompleted = useMemo(() => 
    displayChallenge 
      ? completedChallenges.includes(displayChallenge.id) 
      : false
  , [displayChallenge, completedChallenges]);
  
  // Memoized computation functions
  const getProgress = useCallback((): number => {
    if (!duration || duration === 0) return 0;
    const position = (isDragging || isSeeking) ? draggedPosition : currentPosition;
    return (position / duration) * PROGRESS_PERCENT;
  }, [duration, isDragging, isSeeking, draggedPosition, currentPosition]);

  const getChallengeProgress = useCallback((): number => {
    if (!displayChallenge || !duration || duration === 0) return 0;
    if (isCompleted) return PROGRESS_PERCENT;
    const listened = listenedTimeMap[displayChallenge.id] || 0;
    return Math.min(PROGRESS_PERCENT, (listened / duration) * PROGRESS_PERCENT);
  }, [displayChallenge, duration, isCompleted, listenedTimeMap]);
  
  // Memoized handlers
  const handleSeek = useCallback((percentage: number): void => {
    if (!duration) return;
    const newPosition = (percentage / PROGRESS_PERCENT) * duration;
    setIsSeeking(true);
    seekTo(newPosition);
    setDraggedPosition(newPosition);
    setTimeout(() => setIsSeeking(false), SEEK_BUFFER_MS);
  }, [duration, seekTo]);

  const handleDrag = useCallback((event: GestureResponderEvent): void => {
    if (!duration) return;
    const { locationX } = event.nativeEvent;
    const percentage = Math.max(0, Math.min(PROGRESS_PERCENT, (locationX / progressBarWidth) * PROGRESS_PERCENT));
    const newPosition = (percentage / PROGRESS_PERCENT) * duration;
    setDraggedPosition(newPosition);
    handleSeek(percentage);
  }, [duration, progressBarWidth, handleSeek]);

  const handlePlayPause = useCallback((): void => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        resume();
      }
    }
  }, [isPlaying, pause, resume, currentTrack]);

  const handleRestart = useCallback((): void => {
    try {
      seekTo(0);
      setCurrentPosition(0);
    } finally {
      // loading reset in seekTo finally block
    }
  }, [seekTo, setCurrentPosition]);

  const onTouchStart = useCallback((event: GestureResponderEvent): void => {
    if (isCompleted) {
      setIsDragging(true);
      handleDrag(event);
    }
  }, [isCompleted, handleDrag]);

  const onTouchMove = useCallback((event: GestureResponderEvent): void => {
    if (isDragging && isCompleted) {
      handleDrag(event);
    }
  }, [isDragging, isCompleted, handleDrag]);

  const onTouchEnd = useCallback((): void => {
    if (!isCompleted) return;
    setIsDragging(false);
    setIsSeeking(true);
    setTimeout(() => {
      setIsSeeking(false);
    }, SEEK_BUFFER_MS);
  }, [isCompleted]);
  
  useEffect(() => {
    if (!isDragging && !isSeeking) {
      setDraggedPosition(currentPosition);
    }
  }, [isDragging, isSeeking, currentPosition]);
    
  const displayPosition = useMemo(() => 
    ((isDragging || isSeeking) ? draggedPosition : currentPosition) || 0
  , [isDragging, isSeeking, draggedPosition, currentPosition]);

  return {
    currentTrack,
    displayChallenge,
    isCompleted,
    isPlaying,
    error,
    duration,
    displayPosition,
    progressBarWidth,
    progressBarRef,
    
    progress: duration ? getProgress() : 0,
    challengeProgress: duration ? getChallengeProgress() : 0,
    formattedTime: formatTime(displayPosition),
    formattedDuration: formatTime(duration || 0),
    
    handleDrag,
    handlePlayPause,
    handleRestart,
    handleSeek,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    setProgressBarWidth,
    
    isSeeking,
    setIsSeeking,
  };
}
