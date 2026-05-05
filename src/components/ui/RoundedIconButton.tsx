// RoundedIconButton - Reusable circular icon button with glass effect
import React from 'react';
import { TouchableOpacity, Image, ViewStyle } from 'react-native';
import { styles } from './RoundedIconButton.styles';
import { THEME } from '../../constants/theme';

interface RoundedIconButtonProps {
  icon: any; // require() or imported image
  onPress: () => void;
  size?: number; // Button diameter (default: 40)
  iconSize?: number; // Icon dimensions (default: 20)
  variant?: 'primary' | 'secondary' | 'glass'; // Style variant
  style?: ViewStyle;
  disabled?: boolean;
}

export const RoundedIconButton = React.memo<RoundedIconButtonProps>(({
  icon,
  onPress,
  size = 40,
  iconSize = 20,
  variant = 'primary',
  style,
  disabled = false,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return 'rgba(255,255,255,0.1)';
    switch (variant) {
      case 'primary': return THEME.colors.primary;
      case 'secondary': return 'rgba(255,255,255,0.2)';
      case 'glass': return 'rgba(255,255,255,0.15)';
      default: return THEME.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getBackgroundColor(),
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Image
        source={icon}
        style={[
          styles.icon,
          { width: iconSize, height: iconSize }
        ]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
});

RoundedIconButton.displayName = 'RoundedIconButton';
