// Glass Button Component
import React from 'react';
import { 
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle, 
  TextStyle,
} from 'react-native';
import { GlassCard } from './GlassCard';
import { THEME } from '../../constants/theme';
import { styles } from './GlassButton.styles';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
}) => {
  const gradientColors = variant === 'primary' 
    ? THEME.glass.gradientColors.primary
    : THEME.glass.gradientColors.secondary;

  const buttonStyle = React.useMemo(() => {
    const baseStyle = { ...styles.button };
    return style ? { ...baseStyle, ...(style as object) } : baseStyle;
  }, [style]);

  return (
    <GlassCard
      gradientColors={gradientColors}
      style={buttonStyle}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={styles.buttonContent}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={THEME.colors.text.primary} size="small" />
        ) : (
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </GlassCard>
  );
};
