import { StyleSheet } from 'react-native';
import { THEME } from '../../theme/theme';

export const styles = StyleSheet.create({
  track: {
    marginBottom: THEME.spacing.xs,
  },
  background: {
    height: THEME.spacing.xs,
    backgroundColor: THEME.colors.progressBackground,
    borderRadius: THEME.borderRadius.sm,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.borderRadius.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.secondary,
  },
});
