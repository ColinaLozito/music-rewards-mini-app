// Styles for Toast component
import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    marginHorizontal: THEME.spacing.lg,
  },
  message: {
    color: THEME.colors.textInverse,
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '500',
  },
});
