import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radii, shadow, spacing, typography } from '../theme';
import { PlayIcon, PauseIcon, BookmarkIcon, VolumeIcon } from './Icons';

// Accent selector — shown only when a word has more than one pronunciation.
function AccentChips({ audio }) {
  if (!audio.hasAudio || audio.audios.length < 2) return null;
  return (
    <View style={styles.chips}>
      {audio.audios.map((a, i) => {
        const selected = audio.activeIndex === i;
        return (
          <Pressable
            key={`${a.url}-${i}`}
            onPress={() => audio.play(i)}
            style={[styles.accentChip, selected && styles.accentChipActive]}
            accessibilityRole="button"
            accessibilityLabel={`Play ${a.accent || `audio ${i + 1}`} pronunciation`}
          >
            <VolumeIcon
              size={14}
              color={selected ? colors.primary : colors.onSurfaceVariant}
            />
            <Text style={[styles.accentText, selected && styles.accentTextActive]}>
              {a.accent || `Audio ${i + 1}`}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Detail hero: word + phonetic on the left; bookmark + circular audio button
// on the right; optional accent chips beneath.
export default function WordHeader({ word, phonetic, audio, isBookmarked, onToggleBookmark }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.word} accessibilityRole="header">
            {word}
          </Text>
          {phonetic ? <Text style={styles.phonetic}>{phonetic}</Text> : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={onToggleBookmark}
            style={({ pressed }) => [styles.circle, styles.circleOutline, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={isBookmarked ? 'Remove from saved' : 'Save word'}
          >
            <BookmarkIcon size={22} color={isBookmarked ? colors.primary : colors.onSurfaceVariant} filled={isBookmarked} />
          </Pressable>

          {audio.hasAudio ? (
            <Pressable
              onPress={() => audio.togglePlay()}
              disabled={audio.isLoading}
              style={({ pressed }) => [styles.circle, styles.circlePrimary, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={audio.isPlaying ? 'Pause pronunciation' : 'Play pronunciation'}
            >
              {audio.isLoading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : audio.isPlaying ? (
                <PauseIcon size={24} color={colors.onPrimary} />
              ) : (
                <PlayIcon size={24} color={colors.onPrimary} />
              )}
            </Pressable>
          ) : null}
        </View>
      </View>

      <AccentChips audio={audio} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  left: { flex: 1, paddingRight: spacing.md },
  word: { ...typography.displayWord },
  phonetic: { ...typography.monoPhonetic, marginTop: spacing.xs },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  circle: { width: 48, height: 48, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  circlePrimary: { backgroundColor: colors.primary, ...shadow.button },
  circleOutline: { backgroundColor: colors.surfaceLowest, borderWidth: 1.5, borderColor: colors.outlineVariant },
  pressed: { transform: [{ scale: 0.96 }] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  accentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceLowest,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  accentChipActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  accentText: { ...typography.labelMd, color: colors.onSurfaceVariant, fontWeight: '600' },
  accentTextActive: { color: colors.primary },
});
