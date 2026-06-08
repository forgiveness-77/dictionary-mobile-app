import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Appearance } from 'react-native';
import { usePersistentState } from '../hooks/usePersistentState';

// Mode-independent tokens.
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 40 };
export const radii = { sm: 8, md: 12, lg: 16, xl: 20, pill: 9999 };
export const shadow = {
  card: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  button: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
};

// LexiTech light palette (iOS blue on warm near-white).
const lightColors = {
  primary: '#007aff',
  primaryDark: '#005bb5',
  onPrimary: '#ffffff',
  primarySoft: 'rgba(0,122,255,0.10)',
  primarySoftBorder: 'rgba(0,122,255,0.30)',
  indigo: '#1a237e',
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

// Dark palette — brighter blue, near-black warm surfaces, light text.
const darkColors = {
  primary: '#4c9dff',
  primaryDark: '#2f80ed',
  onPrimary: '#ffffff',
  primarySoft: 'rgba(76,157,255,0.16)',
  primarySoftBorder: 'rgba(76,157,255,0.40)',
  indigo: '#8c9eff',
  secondary: '#9aa7ff',
  background: '#121316',
  surface: '#17181b',
  surfaceLowest: '#1f2024',
  surfaceLow: '#26272c',
  surfaceHigh: '#33353b',
  surfaceVariant: '#33353b',
  onSurface: '#ecedef',
  onSurfaceVariant: '#aeb1ba',
  outline: '#8a8d97',
  outlineVariant: '#3a3c43',
  success: '#3ddc84',
  successSoft: 'rgba(61,220,132,0.16)',
  error: '#ff6b6b',
  errorContainer: 'rgba(255,107,107,0.16)',
  onErrorContainer: '#ffd7d4',
};

// Typography depends on the palette (text colors flip with the theme).
function makeTypography(c) {
  return {
    displayWord: { fontSize: 32, lineHeight: 40, fontWeight: '700', letterSpacing: -0.6, color: c.onSurface },
    headlineLg: { fontSize: 24, lineHeight: 32, fontWeight: '700', color: c.onSurface },
    headlineLgMobile: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: c.onSurface },
    bodyXl: { fontSize: 18, lineHeight: 28, fontWeight: '400', color: c.onSurface },
    bodyMd: { fontSize: 16, lineHeight: 24, fontWeight: '400', color: c.onSurface },
    bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400', color: c.onSurfaceVariant },
    labelLg: { fontSize: 14, lineHeight: 16, fontWeight: '600', letterSpacing: 0.7, color: c.onSurfaceVariant },
    labelMd: { fontSize: 12, lineHeight: 16, fontWeight: '500', color: c.onSurfaceVariant },
    monoPhonetic: { fontSize: 16, lineHeight: 24, fontWeight: '400', fontStyle: 'italic', color: c.onSurfaceVariant },
  };
}

const STORAGE_KEY = '@lexitech/theme-mode';
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemDark = Appearance.getColorScheme() === 'dark';
  const [mode, setMode] = usePersistentState(STORAGE_KEY, systemDark ? 'dark' : 'light');

  const isDark = mode === 'dark';
  const colors = isDark ? darkColors : lightColors;
  const typography = useMemo(() => makeTypography(colors), [colors]);

  const toggleTheme = useCallback(() => {
    setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  }, [setMode]);

  const value = useMemo(
    () => ({ mode, isDark, colors, typography, spacing, radii, shadow, toggleTheme, setMode }),
    [mode, isDark, colors, typography, toggleTheme, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
