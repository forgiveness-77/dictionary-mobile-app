import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { spacing, useTheme } from '../theme';

// Loading indicator shown while an API request is in progress.
export default function Loading({ message = 'Searching…' }) {
  const { colors, typography } = useTheme();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

const makeStyles = (colors, typography) =>
  StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, minHeight: 200 },
    text: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.md },
  });
