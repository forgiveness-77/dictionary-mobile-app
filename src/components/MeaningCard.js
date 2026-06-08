import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, shadow, spacing, typography } from '../theme';

function unique(list) {
  return Array.from(new Set(list.filter(Boolean)));
}

function ChipGroup({ label, items }) {
  if (!items.length) return null;
  return (
    <View style={styles.chipGroup}>
      <Text style={styles.chipLabel}>{label}</Text>
      <View style={styles.chips}>
        {items.slice(0, 12).map((item) => (
          <View key={item} style={styles.chip}>
            <Text style={styles.chipText}>#{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// One card per part of speech (LexiTech card-ds with a primary top border):
// badge, numbered definitions, example boxes, and synonym/antonym chips.
export default function MeaningCard({ meaning }) {
  const { partOfSpeech, definitions } = meaning;
  const synonyms = unique([...meaning.synonyms, ...definitions.flatMap((d) => d.synonyms)]);
  const antonyms = unique([...meaning.antonyms, ...definitions.flatMap((d) => d.antonyms)]);

  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        <Text style={styles.badge}>{partOfSpeech}</Text>
      </View>

      {definitions.map((def, index) => (
        <View key={index} style={[styles.definition, index > 0 && styles.definitionDivider]}>
          <Text style={styles.definitionText}>
            <Text style={styles.index}>{index + 1}. </Text>
            {def.definition}
          </Text>
          {def.example ? (
            <View style={styles.example}>
              <Text style={styles.exampleText}>“{def.example}”</Text>
            </View>
          ) : null}
        </View>
      ))}

      <ChipGroup label="Synonyms" items={synonyms} />
      <ChipGroup label="Antonyms" items={antonyms} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.sm,
    borderTopWidth: 4,
    borderTopColor: colors.primary,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  badgeRow: { flexDirection: 'row', marginBottom: spacing.md },
  badge: {
    ...typography.labelLg,
    color: colors.primary,
    textTransform: 'uppercase',
    backgroundColor: colors.primarySoft,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  definition: {},
  definitionDivider: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceHigh,
  },
  definitionText: { ...typography.bodyXl },
  index: { color: colors.outline, fontWeight: '700' },
  example: {
    marginTop: spacing.md,
    backgroundColor: colors.surfaceLow,
    borderRadius: radii.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.primarySoftBorder,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  exampleText: { ...typography.bodyMd, color: colors.onSurfaceVariant, fontStyle: 'italic' },
  chipGroup: { marginTop: spacing.lg },
  chipLabel: {
    ...typography.labelLg,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  chipText: { ...typography.labelMd, color: colors.onSurfaceVariant },
});
