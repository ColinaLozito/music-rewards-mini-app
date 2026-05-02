// LoadingOverlay component - Full-screen glassmorphism loading modal
import React from 'react';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { styles } from './LoadingOverlay.styles';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message = 'Loading...' }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <BlurView intensity={20} style={styles.blur} tint="dark">
        <View style={styles.container}>
          <Text style={styles.text}>{message}</Text>
        </View>
      </BlurView>
    </View>
  );
};
