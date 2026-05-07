// usePlayerModal - Player modal state + handlers (seek, drag, play/pause, restart)
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, GestureResponderEvent } from 'react-native';
import { useMusicPlayer } from './useMusicPlayer';
import { useMusicStore, selectCurrentTrack, type MusicStore } from '../stores/musicStore';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '../stores/userStore';
import { formatTime } from '../utils/timeFormat';

const PROGRESS_PERCENT = 100;
const SEEK_BUFFER_MS = 1000; // 1 second buffer

export function usePlayerModal() {
  const {
    currentTrack,
    isPlaying,
    currentPosition: progressPosition,
    duration,
    pause,
    resume,
    seekTo,
    error,
    isBuffering,
    retry
  } = useMusicPlayer();

  const [isDragging, setIsDragging] = useState(false);
  const [draggedPosition, setDraggedPosition] = useState(progressPosition);
  const [progressBarWidth, setProgressBarWidth] = useState(300);
  const [isSeeking, setIsSeeking] = useState(false); // Buffer for race condition
  const progressBarRef = useRef<View>(null);
  
  const completedChallenges = useUserStore((state) => state.completedChallenges);
  const listenedTimeMap = useUserStore((state) => state.listenedTimeMap);
  
  // Memoize derived values with useShallow - only re-renders if active track changes
  const liveChallenge = useMusicStore(useShallow((state: MusicStore) => {
    if (!state.activeChallengeId) return null;
    // Return the updated challenge from the list if available, 
    // otherwise fallback to the currentTrack metadata.
    return state.challenges.find((c) => c.id === state.activeChallengeId) || null;
  }));
  
  const displayChallenge = liveChallenge;

  const isCompleted = useMemo(() => 
    displayChallenge 
      ? completedChallenges.includes(displayChallenge.id) 
      : false
  , [displayChallenge, completedChallenges]);
  
  // Memoized computation functions
  const getProgress = useCallback((): number => {
    if (!duration || duration === 0) return 0;
    // Only use stored progress if completed AND track actually finished (progress >= 98%)
    if (isCompleted && !isPlaying && displayChallenge?.progress && displayChallenge.progress >= 98) {
      return displayChallenge.progress;
    }
    const position = (isDragging || isSeeking) ? draggedPosition : progressPosition;
    return (position / duration) * PROGRESS_PERCENT;
  }, [duration, isDragging, isSeeking, draggedPosition, progressPosition, isCompleted, isPlaying, displayChallenge?.progress]);

  const getChallengeProgress = useCallback((): number => {
    if (!displayChallenge || !duration || duration === 0) return 0;
    // Only use stored progress if completed AND track actually finished
    if (isCompleted && !isPlaying && displayChallenge?.progress && displayChallenge.progress >= 98) {
      return displayChallenge.progress;
    }
    const listened = listenedTimeMap[displayChallenge.id] || 0;
    // Use currentTrack.duration as fallback (more reliable than progress.duration)
    const trackDuration = currentTrack?.duration || duration;
    return Math.min(PROGRESS_PERCENT, (listened / trackDuration) * PROGRESS_PERCENT);
  }, [displayChallenge, duration, isCompleted, isPlaying, listenedTimeMap, currentTrack?.duration, progressPosition]);
  
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
      // Start playing immediately after reset
      if (currentTrack) {
        resume();
      }
    } finally {
      // loading reset in seekTo finally block
    }
  }, [seekTo, resume, currentTrack]);

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
        setDraggedPosition(progressPosition);
      }
    }, [isDragging, isSeeking, progressPosition]);
    
    const displayPosition = useMemo(() => 
      ((isDragging || isSeeking) ? draggedPosition : progressPosition) || 0
    , [isDragging, isSeeking, draggedPosition, progressPosition]);

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
    isBuffering,
    retry,
    
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
