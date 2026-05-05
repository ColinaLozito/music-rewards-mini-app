import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  progressCard: {
    // Card styling handled by GlassCard
  },
  sectionTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  challengeItem: {
    marginBottom: THEME.spacing.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  challengeTitle: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.primary,
    flex: 1,
  },
  challengeStatus: {
    fontSize: THEME.fonts.sizes.md,
  },
  completedColor: {
    color: THEME.colors.secondary,
  },
  pendingColor: {
    color: THEME.colors.text.secondary,
  },
  progressBar: {
    height: THEME.spacing.xs,
    backgroundColor: THEME.colors.progressBackground,
    borderRadius: THEME.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.borderRadius.sm,
  },
  progressText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
});
