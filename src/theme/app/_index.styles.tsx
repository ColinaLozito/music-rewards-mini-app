// Styles for index.tsx
import { StyleSheet } from 'react-native';
import { THEME } from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
  },
});
