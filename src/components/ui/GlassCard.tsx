// Glass design system components - Belong's signature UI
import React from 'react';
import { 
  View, 
  ViewStyle, 
  StyleSheet 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../../constants/theme';
import { styles } from './GlassCard.styles'

// Glass Card Component
interface GlassCardProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  style?: ViewStyle;
  gradientColors?: readonly string[];
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blurIntensity = THEME.glass.blurIntensity,
  borderRadius = THEME.borderRadius.md,
  gradientColors = THEME.glass.gradientColors.card,
  style,
}) => {
    const containerStyle = React.useMemo(() => {
      const baseStyle = { ...styles.container, borderRadius };
      return style ? { ...baseStyle, ...(style as object) } : baseStyle;
    }, [borderRadius, style]);

    const borderOverlayStyle = React.useMemo(() => ({
      ...styles.borderOverlay,
      borderRadius
    }), [borderRadius]);

    return (
      <View style={containerStyle}>
        <BlurView 
          intensity={blurIntensity} 
          style={styles.absoluteFill}
          tint="dark"
        />
        
        <LinearGradient
          colors={gradientColors as [string, string]}
          style={styles.absoluteFill}
        />
        
        <View style={borderOverlayStyle} />
        
        <View style={styles.contentContainer}>
          {children}
        </View>
      </View>
    );
};
