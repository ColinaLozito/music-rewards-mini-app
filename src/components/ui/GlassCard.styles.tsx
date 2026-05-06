// Styles for GlassCard.tsx
import { StyleSheet } from 'react-native';
import { THEME } from '../../theme/theme';

export const styles = StyleSheet.create({
  contentContainer: {
    padding: THEME.spacing.md,
  },
  container: {
    overflow: 'hidden',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  borderOverlay: {
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  backgroundImage: { // <- NEW: fill card without changing aspect ratio
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3, // <- 0.3 opacity
  },
});
