import { StyleSheet } from 'react-native';
import { THEME } from '../../theme/theme';

export const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs,
  },
  icon: {
    fontSize: THEME.fonts.sizes.xl,
    marginRight: THEME.spacing.sm,
  },
  title: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
  },
  description: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    marginLeft: THEME.spacing.sm,
  },
});
