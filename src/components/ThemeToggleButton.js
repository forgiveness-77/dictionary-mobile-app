import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SunIcon, MoonIcon } from './Icons';
import { spacing, radii, useTheme } from '../theme';

// Header top-right light/dark toggle. Shows the icon of the mode you'll switch to.
export default function ThemeToggleButton() {
  const { isDark, toggleTheme, colors } = useTheme();
  return (
    <Pressable
      onPress={toggleTheme}
      hitSlop={10}
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.6 }]}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <SunIcon size={22} color={colors.onSurface} />
      ) : (
        <MoonIcon size={22} color={colors.onSurface} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
});
