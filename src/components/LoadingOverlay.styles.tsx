// Styles for LoadingOverlay.tsx
import { StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  blur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
  },
  text: {
    marginTop: THEME.spacing.md,
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.primary,
    fontWeight: '600',
  },
});
