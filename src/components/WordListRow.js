import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { CloseIcon, ChevronRightIcon, HistoryIcon, SearchIcon, BookmarkIcon } from './Icons';
import { colors, radii, spacing, typography } from '../theme';

// Helper to render leading icon based on name
function LeadingIcon({ name, color }) {
  switch (name) {
    case 'schedule':
      return <HistoryIcon size={22} color={color} />;
    case 'bookmark':
      return <BookmarkIcon size={22} color={color} filled={false} />;
    case 'search':
      return <SearchIcon size={22} color={color} />;
    default:
      return <HistoryIcon size={22} color={color} />;
  }
}

// Reusable row for history / saved / drawer lists. Tapping the row opens the
// word; an optional remove button replaces the trailing chevron.
export default function WordListRow({
  word,
  onPress,
  onRemove,
  active = false,
  leadingIcon = 'schedule',
}) {
  const iconColor = active ? colors.primary : colors.outline;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colors.surfaceLow }}
      accessibilityRole="button"
      accessibilityLabel={`Open ${word}`}
      style={({ pressed }) => [styles.row, active && styles.rowActive, pressed && styles.pressed]}
    >
      <LeadingIcon name={leadingIcon} color={iconColor} />
      <Text style={[styles.word, active && styles.wordActive]} numberOfLines={1}>
        {word}
      </Text>
      {onRemove ? (
        <Pressable onPress={onRemove} hitSlop={10} accessibilityLabel={`Remove ${word}`}>
          <CloseIcon size={20} color={colors.outline} />
        </Pressable>
      ) : (
        <ChevronRightIcon size={22} color={colors.outline} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
  },
  rowActive: { backgroundColor: colors.primarySoft },
  pressed: { backgroundColor: colors.surfaceLow },
  word: { ...typography.bodyMd, flex: 1, textTransform: 'capitalize' },
  wordActive: { color: colors.primary, fontWeight: '600' },
});
