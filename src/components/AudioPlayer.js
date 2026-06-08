import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, PanResponder } from 'react-native';
import { PlayIcon, PauseIcon, StopIcon, VolumeIcon } from './Icons';
import { spacing, radii, shadow, useTheme } from '../theme';

function formatTime(seconds) {
  if (!seconds || seconds < 0 || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Full pronunciation player: play/pause, stop, and a seekable progress bar with
// elapsed/total time. Renders nothing when the word has no audio.
export default function AudioPlayer({ audio }) {
  const { colors, typography } = useTheme();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);
  const [trackWidth, setTrackWidth] = useState(0);

  // Latest seek handler in a ref so the (once-created) PanResponder isn't stale.
  const seekRef = useRef(() => {});
  seekRef.current = (x) => {
    if (trackWidth > 0) audio.seekToRatio(x / trackWidth);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // Only claim horizontal drags so vertical scrolling still works.
      onMoveShouldSetPanResponder: (e, g) => Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: (e) => seekRef.current(e.nativeEvent.locationX),
      onPanResponderMove: (e) => seekRef.current(e.nativeEvent.locationX),
    })
  ).current;

  if (!audio.hasAudio) return null;

  const pct = `${Math.round(audio.progress * 100)}%`;

  // Label each pronunciation by accent (US/UK/AU/…). Fall back to a numbered
  // label only when there are several; a single unlabeled audio shows no chip.
  const accentChips = audio.audios
    .map((a, i) => ({ ...a, i, label: a.accent || (audio.audios.length > 1 ? `Audio ${i + 1}` : '') }))
    .filter((c) => c.label);
  const showAccents = accentChips.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>Pronunciation</Text>
        {showAccents ? (
          <View style={styles.chips}>
            {accentChips.map((c) => {
              const selected = audio.activeIndex === c.i;
              return (
                <Pressable
                  key={`${c.url}-${c.i}`}
                  onPress={() => audio.play(c.i)}
                  style={[styles.chip, selected && styles.chipActive]}
                  accessibilityRole="button"
                  accessibilityLabel={`Play ${c.label} pronunciation`}
                >
                  <VolumeIcon size={13} color={selected ? colors.primary : colors.onSurfaceVariant} />
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{c.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={() => audio.togglePlay()}
          disabled={audio.isLoading}
          style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={audio.isPlaying ? 'Pause' : 'Play'}
        >
          {audio.isLoading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : audio.isPlaying ? (
            <PauseIcon size={22} color={colors.onPrimary} />
          ) : (
            <PlayIcon size={22} color={colors.onPrimary} />
          )}
        </Pressable>

        <Pressable
          onPress={() => audio.stop()}
          style={({ pressed }) => [styles.stopBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Stop"
        >
          <StopIcon size={16} color={colors.onSurfaceVariant} />
        </Pressable>

        <View style={styles.progressArea}>
          <View
            style={styles.trackHit}
            onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
            {...pan.panHandlers}
          >
            <View style={styles.track}>
              <View style={[styles.fill, { width: pct }]} />
            </View>
            <View style={[styles.thumb, { left: pct }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(audio.position)}</Text>
            <Text style={styles.time}>{formatTime(audio.duration)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (colors, typography) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceLowest,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      padding: spacing.md,
      marginBottom: spacing.lg,
      ...shadow.card,
    },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
    label: {
      ...typography.labelMd,
      color: colors.onSurfaceVariant,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      fontWeight: '700',
    },
    controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    playBtn: {
      width: 46,
      height: 46,
      borderRadius: radii.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow.button,
    },
    stopBtn: {
      width: 40,
      height: 40,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceLow,
      borderWidth: 1.5,
      borderColor: colors.outlineVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: { transform: [{ scale: 0.94 }] },
    progressArea: { flex: 1, marginLeft: spacing.sm },
    trackHit: { height: 24, justifyContent: 'center' },
    track: { height: 6, borderRadius: radii.pill, backgroundColor: colors.surfaceHigh, overflow: 'hidden' },
    fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radii.pill },
    thumb: {
      position: 'absolute',
      top: '50%',
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.surfaceLowest,
      marginTop: -7,
      marginLeft: -7,
    },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
    time: { ...typography.labelMd, color: colors.onSurfaceVariant, fontVariant: ['tabular-nums'] },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.surfaceLow,
      borderWidth: 1.5,
      borderColor: colors.outlineVariant,
      borderRadius: radii.pill,
      paddingVertical: 4,
      paddingHorizontal: spacing.sm,
    },
    chipActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
    chipText: { ...typography.labelMd, color: colors.onSurfaceVariant, fontWeight: '600' },
    chipTextActive: { color: colors.primary },
  });
