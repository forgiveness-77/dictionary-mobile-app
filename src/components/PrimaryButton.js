import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { RefreshIcon } from './Icons';
import { colors, radii, shadow, spacing, typography } from '../theme';

// Full-width primary CTA (LexiTech btn-primary-ds): solid #007aff, 8px radius,
// soft blue shadow, slight press scale.
export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  variant = 'primary',
  style,
}) {
  const isDisabled = disabled || loading;
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.primary,
        !isOutline && shadow.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.onPrimary} />
      ) : (
        <View style={styles.content}>
          {icon && icon === 'refresh' ? (
            <RefreshIcon
              size={20}
              color={isOutline ? colors.primary : colors.onPrimary}
              style={styles.icon}
            />
          ) : null}
          <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: { backgroundColor: colors.primary },
  outline: { backgroundColor: colors.surfaceLowest, borderWidth: 1.5, borderColor: colors.outlineVariant },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.95 },
  disabled: { opacity: 0.5 },
  content: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: spacing.sm },
  text: { ...typography.bodyMd, color: colors.onPrimary, fontWeight: '600' },
  outlineText: { color: colors.onSurface },
});
