// Styles for GlassCard.tsx
import { StyleSheet } from 'react-native';
import { THEME } from '../../theme/theme';

export const styles = StyleSheet.create({
    container: {
      padding: THEME.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: THEME.spacing.md,
    },
    label: {
      fontSize: THEME.fonts.sizes.sm,
      color: THEME.colors.text.secondary,
    },
    currentPoints: {
      fontSize: THEME.fonts.sizes.xl,
      fontWeight: 'bold',
      color: THEME.colors.accent,
    },
    progressContainer: {
      marginTop: THEME.spacing.sm,
    },
    progressTrack: {
      height: THEME.spacing.xs,
      backgroundColor: THEME.colors.progressBackground,
      borderRadius: THEME.borderRadius.sm,
      overflow: 'hidden',
      marginBottom: THEME.spacing.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: THEME.colors.accent,
      borderRadius: THEME.borderRadius.sm,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    infoText: {
      fontSize: THEME.fonts.sizes.sm,
      color: THEME.colors.text.secondary,
    },
    completeText: {
      fontSize: THEME.fonts.sizes.md,
      color: THEME.colors.secondary,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: THEME.spacing.sm,
    },
  });