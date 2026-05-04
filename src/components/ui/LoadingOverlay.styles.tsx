import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
  },
  text: {
    marginTop: THEME.spacing.md,
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.primary,
  },
});
