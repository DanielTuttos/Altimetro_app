export interface ThemeColors {
  background: string;
  surface: string;
  surfaceBorder: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentGlow: string;
  success: string;
  warning: string;
  error: string;
  card: string;
}

export const lightColors: ThemeColors = {
  background: '#F8FAF9',
  surface: '#FFFFFF',
  surfaceBorder: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  accent: '#0D9488', // Technical Teal/Cyan
  accentGlow: 'rgba(13, 148, 136, 0.12)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  card: '#FFFFFF',
};

export const darkColors: ThemeColors = {
  background: '#0B0F17',
  surface: '#151C28',
  surfaceBorder: '#232D3F',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  accent: '#14B8A6',
  accentGlow: 'rgba(20, 184, 166, 0.18)',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  card: '#151C28',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  hugeValue: {
    fontSize: 64,
    fontWeight: '700' as const,
    letterSpacing: -1.5,
  },
  unit: {
    fontSize: 24,
    fontWeight: '600' as const,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
};
