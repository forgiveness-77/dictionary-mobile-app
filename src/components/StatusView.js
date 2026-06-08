import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  InfoIcon,
  SadFaceIcon,
  WifiOffIcon,
  ErrorIcon,
  WarningIcon,
  HistoryIcon,
  BookmarkIcon,
  SearchIcon,
} from './Icons';
import PrimaryButton from './PrimaryButton';
import { spacing, radii, useTheme } from '../theme';

// Helper to render status icon based on name.
function StatusIcon({ name, color, size = 40 }) {
  switch (name) {
    case 'sentiment-dissatisfied':
      return <SadFaceIcon size={size} color={color} />;
    case 'wifi-off':
    case 'cloud-off':
      return <WifiOffIcon size={size} color={color} />;
    case 'error-outline':
      return <ErrorIcon size={size} color={color} />;
    case 'warning-amber':
    case 'bug-report':
      return <WarningIcon size={size} color={color} />;
    case 'schedule':
    case 'history':
      return <HistoryIcon size={size} color={color} />;
    case 'bookmark':
    case 'bookmark-border':
      return <BookmarkIcon size={size} color={color} filled={false} />;
    case 'search':
      return <SearchIcon size={size} color={color} />;
    case 'info-outline':
    default:
      return <InfoIcon size={size} color={color} />;
  }
}

// Generic centered state for empty states and errors: a tinted icon circle,
// a title, a message, and an optional retry action.
export default function StatusView({
  icon = 'info-outline',
  tone = 'neutral', // 'neutral' | 'error' | 'success'
  title,
  message,
  actionLabel,
  onAction,
  style,
}) {
  const { colors, typography } = useTheme();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);

  const tint = {
    neutral: { bg: colors.surfaceLow, fg: colors.outline },
    error: { bg: colors.errorContainer, fg: colors.error },
    success: { bg: colors.successSoft, fg: colors.success },
  }[tone];

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: tint.bg }]}>
        <StatusIcon name={icon} color={tint.fg} size={40} />
      </View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <PrimaryButton title={actionLabel} onPress={onAction} icon="refresh" style={styles.action} />
      ) : null}
    </View>
  );
}

const makeStyles = (colors, typography) =>
  StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    iconCircle: {
      width: 88,
      height: 88,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    title: { ...typography.headlineLgMobile, textAlign: 'center', marginBottom: spacing.sm },
    message: { ...typography.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center', maxWidth: 320 },
    action: { marginTop: spacing.xl, alignSelf: 'stretch', minWidth: 200 },
  });
