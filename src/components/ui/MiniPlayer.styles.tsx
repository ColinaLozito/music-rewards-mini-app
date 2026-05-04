import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: THEME.spacing.md,
    right: THEME.spacing.md,
    zIndex: 100,
  },
  card: {
    padding: THEME.spacing.sm,
    flexWrap: 'wrap',
  },
  topSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
    width: '100%'
  },
  info: {
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  artist: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.fonts.sizes.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 40,
    height: 40,
    borderRadius: THEME.borderRadius.lg,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: THEME.colors.iconPrimary,
    fontSize: THEME.fonts.sizes.lg,
  },
  progressTrack: {
    width: '100%',
    marginTop: THEME.spacing.xs,
    marginBottom: 4,
  },
  progressBackground: {
    height: THEME.spacing.xs,
    backgroundColor: THEME.colors.progressBackground,
    borderRadius: THEME.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.borderRadius.sm,
  },
  progressDisabled: {
    opacity: 0.5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeText: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.secondary,
  },
});

