import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { CloseIcon, ChevronRightIcon, HistoryIcon, SearchIcon, BookmarkIcon } from './Icons';
import { spacing, radii, useTheme } from '../theme';

function LeadingIcon({ name, color }) {
  switch (name) {
    case 'bookmark':
      return <BookmarkIcon size={20} color={color} filled={false} />;
    case 'search':
      return <SearchIcon size={20} color={color} />;
    case 'schedule':
    default:
      return <HistoryIcon size={20} color={color} />;
  }
}

// Reusable row for history / saved / drawer lists. Tapping opens the word; an
// optional remove button replaces the trailing chevron. Optional description
// renders as a second line.
export default function WordListRow({
  word,
  description,
  onPress,
  onRemove,
  active = false,
  leadingIcon = 'schedule',
}) {
  const { colors, typography } = useTheme();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);
  const iconColor = active ? colors.primary : colors.outline;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colors.surfaceLow }}
      accessibilityRole="button"
      accessibilityLabel={`Open ${word}`}
      style={({ pressed }) => [styles.row, active && styles.rowActive, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <LeadingIcon name={leadingIcon} color={iconColor} />
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.word, active && styles.wordActive]} numberOfLines={1}>
          {word}
        </Text>
        {description ? (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
      </View>

      {onRemove ? (
        <Pressable onPress={onRemove} hitSlop={10} accessibilityLabel={`Remove ${word}`} style={styles.trailing}>
          <CloseIcon size={18} color={colors.outline} />
        </Pressable>
      ) : (
        <ChevronRightIcon size={20} color={colors.outline} />
      )}
    </Pressable>
  );
}

const makeStyles = (colors, typography) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.md,
    },
    rowActive: { backgroundColor: colors.primarySoft },
    pressed: { backgroundColor: colors.surfaceLow },
    iconWrap: { width: 24, alignItems: 'center' },
    textWrap: { flex: 1 },
    word: { ...typography.bodyMd, fontWeight: '600', textTransform: 'capitalize' },
    wordActive: { color: colors.primary },
    description: { ...typography.bodySm, color: colors.onSurfaceVariant, marginTop: 1 },
    trailing: { padding: spacing.xs },
  });
