// LexiTech design system — tokens taken directly from the provided Tailwind
// config (Material 3 derived). Primary is iOS blue #007aff on a warm near-white
// background, with Inter-scale typography rendered via the system sans-serif.

export const colors = {
  primary: '#007aff',
  primaryDark: '#005bb5',
  onPrimary: '#ffffff',
  primarySoft: 'rgba(0,122,255,0.10)', // primary/10 — active states
  primarySoftBorder: 'rgba(0,122,255,0.30)',

  indigo: '#1a237e', // deep accent (bookmark "saved" highlight)
  secondary: '#4555b7',

  background: '#fcf9f8',
  surface: '#fcf8fb',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f6f3f5',
  surfaceHigh: '#eae7e7',
  surfaceVariant: '#e5e2e1',

  onSurface: '#1b1c1c',
  onSurfaceVariant: '#454652',
  outline: '#767683',
  outlineVariant: '#c6c5d4',

  success: '#1f8f4e',
  successSoft: '#e3f5ea',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
};

// stack-sm 8, gutter 12, container-margin/stack-md 16, stack-lg 24, section-gap 32
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 40 };

// DEFAULT/lg 0.5rem(8) · xl 0.75rem(12) · 2xl 16 · full
export const radii = { sm: 8, md: 12, lg: 16, xl: 20, pill: 9999 };

export const typography = {
  displayWord: { fontSize: 32, lineHeight: 40, fontWeight: '700', letterSpacing: -0.6, color: colors.onSurface },
  headlineLg: { fontSize: 24, lineHeight: 32, fontWeight: '700', color: colors.onSurface },
  headlineLgMobile: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: colors.onSurface },
  bodyXl: { fontSize: 18, lineHeight: 28, fontWeight: '400', color: colors.onSurface },
  bodyMd: { fontSize: 16, lineHeight: 24, fontWeight: '400', color: colors.onSurface },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400', color: colors.onSurfaceVariant },
  labelLg: { fontSize: 14, lineHeight: 16, fontWeight: '600', letterSpacing: 0.7 },
  labelMd: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  monoPhonetic: { fontSize: 16, lineHeight: 24, fontWeight: '400', fontStyle: 'italic', color: colors.onSurfaceVariant },
};

export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
};

export default { colors, spacing, radii, typography, shadow };
