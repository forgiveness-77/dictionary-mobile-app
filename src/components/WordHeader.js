import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { spacing, radii, useTheme } from '../theme';
import { BookmarkIcon, VolumeIcon } from './Icons';

// Detail hero: word + phonetic (with an inline speaker shortcut) on the left,
// bookmark toggle on the right. The full transport lives in the AudioPlayer card.
export default function WordHeader({
  word,
  phonetic,
  hasAudio,
  onPressSpeaker,
  isBookmarked,
  onToggleBookmark,
}) {
  const { colors, typography } = useTheme();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.word} accessibilityRole="header">
          {word}
        </Text>

        {phonetic || hasAudio ? (
          <View style={styles.phoneticRow}>
            {phonetic ? (
              <Text style={styles.phonetic} numberOfLines={1}>
                {phonetic}
              </Text>
            ) : null}
            {hasAudio ? (
              <Pressable
                onPress={onPressSpeaker}
                hitSlop={6}
                style={({ pressed }) => [styles.speaker, pressed && styles.speakerPressed]}
                accessibilityRole="button"
                accessibilityLabel="Play pronunciation"
              >
                <VolumeIcon size={18} color={colors.primary} />
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={onToggleBookmark}
        hitSlop={6}
        style={({ pressed }) => [styles.circle, isBookmarked && styles.circleActive, pressed && styles.circlePressed]}
        accessibilityRole="button"
        accessibilityLabel={isBookmarked ? 'Remove from saved' : 'Save word'}
      >
        <BookmarkIcon size={22} color={isBookmarked ? colors.primary : colors.onSurfaceVariant} filled={isBookmarked} />
      </Pressable>
    </View>
  );
}

const makeStyles = (colors, typography) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
    },
    left: { flex: 1, paddingRight: spacing.md },
    word: { ...typography.displayWord },
    phoneticRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
    phonetic: { ...typography.monoPhonetic, flexShrink: 1 },
    speaker: { marginLeft: spacing.sm, padding: spacing.xs, borderRadius: radii.pill },
    speakerPressed: { opacity: 0.5 },
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
    circlePressed: { opacity: 0.7 },
  });
