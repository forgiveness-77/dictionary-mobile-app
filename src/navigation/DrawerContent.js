import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import WordListRow from '../components/WordListRow';
import { CloseIcon, HistoryIcon, DeleteIcon } from '../components/Icons';
import { useHistory } from '../context/HistoryContext';
import { capitalize } from '../utils/validation';
import { spacing, radii, useTheme } from '../theme';

// Custom drawer: brand + search history + clear action (Activity 4).
export default function DrawerContent({ navigation }) {
  const { history, clearHistory } = useHistory();
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);

  const openWord = (word) => {
    navigation.closeDrawer();
    navigation.navigate('Main', {
      screen: 'SearchTab',
      params: { screen: 'WordDetail', params: { word } },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.md }]}>
      <View style={styles.header}>
        <Text style={styles.brand}>LexiTech</Text>
        <Pressable
          onPress={() => navigation.closeDrawer()}
          hitSlop={10}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
        >
          <CloseIcon size={22} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <View style={styles.sectionRow}>
        <HistoryIcon size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>Search History</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <HistoryIcon size={28} color={colors.outline} />
          <Text style={styles.emptyText}>
            No searches yet.{'\n'}Words you look up appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={history}
          keyExtractor={(item) => item.word}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <WordListRow
              word={capitalize(item.word)}
              leadingIcon="schedule"
              onPress={() => openWord(item.word)}
            />
          )}
        />
      )}

      {history.length > 0 ? (
        <View style={styles.footer}>
          <Pressable
            onPress={clearHistory}
            style={({ pressed }) => [styles.clearBtn, pressed && styles.clearPressed]}
            accessibilityRole="button"
            accessibilityLabel="Clear history"
          >
            <DeleteIcon size={22} color={colors.error} />
            <Text style={styles.clearText}>Clear History</Text>
          </Pressable>
        </View>
      ) : null}

      <Text style={styles.version}>LexiTech v1.0.0</Text>
    </View>
  );
}

const makeStyles = (colors, typography) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface, paddingHorizontal: spacing.sm },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    brand: { ...typography.headlineLgMobile, color: colors.primary, fontWeight: '700' },
    closeBtn: { padding: spacing.xs, borderRadius: radii.pill },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      ...typography.labelLg,
      color: colors.onSurface,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    list: { flex: 1 },
    empty: { flex: 1, alignItems: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.lg },
    emptyText: { ...typography.bodySm, color: colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.md },
    footer: { borderTopWidth: 1, borderTopColor: colors.outlineVariant, paddingTop: spacing.sm, marginTop: spacing.sm },
    clearBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
    },
    clearPressed: { backgroundColor: colors.errorContainer },
    clearText: { ...typography.bodyMd, color: colors.error, fontWeight: '500' },
    version: {
      ...typography.labelMd,
      color: colors.outline,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: 2,
      paddingVertical: spacing.lg,
    },
  });
