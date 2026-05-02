// DifficultyBadge component - Displays challenge difficulty with color coding
import React from 'react';
import { View, Text } from 'react-native';
import { THEME } from '../../constants/theme';
import { styles } from './DifficultyBadge.styles';

interface DifficultyBadgeProps {
  difficulty: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  function getDifficultyColor(diff: string): string {
    switch (diff) {
      case 'easy': return THEME.colors.secondary;
      case 'medium': return THEME.colors.accent;
      case 'hard': return THEME.colors.primary;
      default: return THEME.colors.text.secondary;
    }
  }

  return (
    <View style={[styles.badge, { backgroundColor: getDifficultyColor(difficulty) }]}>
      <Text style={styles.text}>{difficulty.toUpperCase()}</Text>
    </View>
  );
};
