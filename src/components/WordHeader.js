import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';
import { BookmarkIcon } from './Icons';

// Detail hero: word + phonetic on the left, bookmark toggle on the right.
// (Audio controls live in the dedicated AudioPlayer card below.)
export default function WordHeader({ word, phonetic, isBookmarked, onToggleBookmark }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.word} accessibilityRole="header">
          {word}
        </Text>
        {phonetic ? <Text style={styles.phonetic}>{phonetic}</Text> : null}
      </View>

      <Pressable
        onPress={onToggleBookmark}
        hitSlop={6}
        style={({ pressed }) => [styles.circle, isBookmarked && styles.circleActive, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={isBookmarked ? 'Remove from saved' : 'Save word'}
      >
        <BookmarkIcon size={22} color={isBookmarked ? colors.primary : colors.onSurfaceVariant} filled={isBookmarked} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  left: { flex: 1, paddingRight: spacing.md },
  word: { ...typography.displayWord },
  phonetic: { ...typography.monoPhonetic, marginTop: spacing.xs },
  circle: {
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLowest,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
  },
  circleActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  pressed: { transform: [{ scale: 0.96 }] },
});
