// Toast component - Animated toast notification
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { styles } from './Toast.styles';
import { THEME } from '../../constants/theme';
import type { Toast as ToastType } from '../../types/toast';

const AUTO_DISMISS_MS = 4000;
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ToastProps {
  toast: ToastType;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const translateY = useSharedValue(-100);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bgColor = THEME.colors.toast[toast.type];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    translateY.value = withTiming(-100, {
      duration: 200,
      easing: Easing.in(Easing.ease),
    }, () => {
      runOnJS(onDismiss)();
    });
  };

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });

    // Auto-dismiss after 4s with animation
    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, AUTO_DISMISS_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <AnimatedTouchable
      style={[styles.container, { backgroundColor: bgColor }, animatedStyle]}
      onPress={handleDismiss}
      activeOpacity={0.9}
    >
      <Text style={styles.message}>{toast.message}</Text>
    </AnimatedTouchable>
  );
}
