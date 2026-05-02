// Styles for GlassCard.tsx
import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

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
      height: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: THEME.spacing.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: THEME.colors.accent,
      borderRadius: 4,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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