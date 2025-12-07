export const colors = {
  // Mood Colors
  chill: '#5BC0EB',
  festif: '#F19938',
  creatif: '#9B6BFF',

  // Accent Colors
  accent: '#F4A261',
  accentDark: '#E57E1F',

  // Status Colors
  statusOpen: '#4CAF50',
  statusClosed: '#F44336',

  // Rating
  ratingStar: '#FFD700',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  grey: '#808080',
  lightGrey: '#E0E0E0',

  // Background
  background: '#FFFFFF',
};

export const fonts = {
  serif: 'Playfair Display',
  sans: 'Inter',
};

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Accessibility - minimum touch target size
export const touchTarget = {
  minSize: 44,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
