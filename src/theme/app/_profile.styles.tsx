// Styles for profile.tsx
import { StyleSheet } from 'react-native';
import { THEME } from '../../theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.lg
  },
  header: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginVertical: THEME.spacing.lg,
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: THEME.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.accent,
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  progressCard: {
    marginBottom: THEME.spacing.md,
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
  },
  challengeStatus: {
    fontSize: THEME.fonts.sizes.lg,
  },
  progressBar: {
    height: 6,
    backgroundColor: THEME.colors.progressBackground,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  achievementsCard: {
    marginBottom: THEME.spacing.xl,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  achievementIcon: {
    fontSize: THEME.fonts.sizes.xl,
    marginRight: THEME.spacing.md,
  },
  achievementText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.primary,
  },
  noAchievements: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resetCard: {
    marginBottom: THEME.spacing.xl,
    borderColor: THEME.colors.danger,
    borderWidth: 1,
  },
  resetDescription: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.md,
  },
  resetButton: {
    backgroundColor: THEME.colors.danger,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  resetButtonText: {
    color: THEME.colors.textInverse,
    fontSize: THEME.fonts.sizes.md,
    fontWeight: 'bold',
  },
});
