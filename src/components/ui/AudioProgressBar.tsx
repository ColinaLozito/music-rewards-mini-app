import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, GestureResponderEvent } from 'react-native';
import { styles } from './AudioProgressBar.styles';

const PROGRESS_PERCENT = 100;

interface AudioProgressBarProps {
  progressBarRef: React.RefObject<View>;
  progress: number; // 0-100
  duration: number; // seconds
  currentPosition: number; // seconds
  isCompleted: boolean;
  onSeek: (percentage: number) => void;
  onLayout: (event: any) => void;
  formatTime: (seconds: number) => string;
}

export function AudioProgressBar({ 
  progressBarRef, 
  progress, 
  duration, 
  currentPosition,
  isCompleted, 
  onSeek,
  onLayout,
  formatTime 
}: AudioProgressBarProps) {
  
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPosition, setDraggedPosition] = useState(currentPosition);
  const [progressBarWidth, setProgressBarWidth] = useState(300);
  const [isSeeking, setIsSeeking] = useState(false); // Buffer state after seek

  // Update draggedPosition when currentPosition changes (IF NOT dragging AND NOT seeking)
  useEffect(() => {
    if (!isDragging && !isSeeking) {
      setDraggedPosition(currentPosition);
    }
  }, [currentPosition, isDragging, isSeeking]);

  // Internal progress calculation (prevents flicker)
  const displayProgress = (isDragging || isSeeking) 
    ? (draggedPosition / duration) * PROGRESS_PERCENT 
    : progress;

  const fillStyle = useMemo(() => ({
    ...styles.fill,
    width: `${displayProgress}%` as const,
  }), [displayProgress]);

  const trackStyle = useMemo(() => ({
    ...styles.track,
    ...( !isCompleted ? styles.disabled : {}),
  }), [isCompleted]);

  function handleDrag(event: GestureResponderEvent): void {
    if (!duration) return;
    const { locationX } = event.nativeEvent;
    const percentage = Math.max(0, Math.min(PROGRESS_PERCENT, (locationX / progressBarWidth) * PROGRESS_PERCENT));
    const newPosition = (percentage / PROGRESS_PERCENT) * duration;
    setDraggedPosition(newPosition);
  }

  function onTouchStart(event: GestureResponderEvent): void {
    if (!isCompleted) return;
    setIsDragging(true);
    handleDrag(event);
  }

  function onTouchMove(event: GestureResponderEvent): void {
    if (!isDragging || !isCompleted) return;
    handleDrag(event);
  }

  function onTouchEnd(): void {
    if (!isCompleted) return;
    setIsDragging(false);
    setIsSeeking(true); // Start buffer state
    const percentage = (draggedPosition / duration) * PROGRESS_PERCENT;
    onSeek(percentage);
    
    // Clear seeking buffer after 500ms (enough for native player to confirm)
    setTimeout(() => {
      setIsSeeking(false);
    }, 500);
  }

  function handleLayout(event: any): void {
    setProgressBarWidth(event.nativeEvent.layout.width);
    if (onLayout) onLayout(event);
  }

  return (
    <View>
      <View 
        ref={progressBarRef}
        style={trackStyle}
        onLayout={handleLayout}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <View style={styles.background}>
          <View style={fillStyle} />
        </View>
      </View>

      {/* Time Display */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {formatTime(draggedPosition)}
        </Text>
        <Text style={styles.timeText}>
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
}
