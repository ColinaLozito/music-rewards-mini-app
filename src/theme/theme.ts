// Belong design tokens and theme constants

export const THEME = {
  colors: {
    primary: '#7553DB',     // Belong purple
    secondary: '#34CB76',   // Belong green  
    accent: '#FCBE25',      // Belong yellow
    background: '#1A1A1A',  // Dark background
    glass: 'rgba(255, 255, 255, 0.1)',
    progressBackground: 'rgba(255, 255, 255, 0.1)',
    iconPrimary: '#FFFFFF',
    textInverse: '#FFFFFF',
    danger: '#FF4444',
    error: '#FF6B6B',
    toast: {
      success: '#22C55E', // green-500
      warning: '#EAB308', // yellow-500
      error: '#EF4444',   // red-500
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
    },
    border: 'rgba(255, 255, 255, 0.2)',
  },
  fonts: {
    regular: 'System',
    medium: 'System', 
    bold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  glass: {
    blurIntensity: 20,
    gradientColors: {
      primary: ['rgba(117, 83, 219, 0.3)', 'rgba(117, 83, 219, 0.1)'],
      secondary: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
      card: ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)'],
    }
  }
};