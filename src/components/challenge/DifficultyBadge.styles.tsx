// Styles for DifficultyBadge.tsx
import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
  },
  text: {
    fontSize: THEME.fonts.sizes.xs,
    fontWeight: 'bold',
    color: '#fff',
  },
});
