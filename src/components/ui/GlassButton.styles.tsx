// Styles for GlassButton.tsx
import { StyleSheet } from 'react-native';
import { THEME } from '../../theme/theme';

export const styles = StyleSheet.create({
  button: {
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%"
  },
  buttonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
  },
});
