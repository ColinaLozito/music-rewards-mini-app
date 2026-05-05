import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLoadingStore } from '../../stores/loadingStore';
import { THEME } from '../../theme/theme';
import { styles } from './LoadingOverlay.styles';

export const LoadingOverlay = () => {
  const { visible, message } = useLoadingStore();
  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.container}>
        <ActivityIndicator size="large" color={THEME.colors.accent} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};
