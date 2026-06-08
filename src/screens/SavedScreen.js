import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import WordListRow from '../components/WordListRow';
import StatusView from '../components/StatusView';
import { useBookmarks } from '../context/BookmarksContext';
import { capitalize } from '../utils/validation';
import { spacing, useTheme } from '../theme';

function describe(item) {
  if (!item.gloss) return null;
  return item.partOfSpeech ? `${item.partOfSpeech} · ${item.gloss}` : item.gloss;
}

export default function SavedScreen({ navigation }) {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);

  if (bookmarks.length === 0) {
    return (
      <View style={styles.screenCentered}>
        <StatusView
          icon="bookmark-border"
          title="No saved words"
          message="Tap the bookmark icon on any word to save it here."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.count}>{bookmarks.length} saved</Text>
        <Pressable onPress={clearBookmarks} hitSlop={8} accessibilityLabel="Clear all saved words">
          <Text style={styles.clear}>Clear all</Text>
        </Pressable>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.word}
        contentContainerStyle={{ padding: spacing.sm, paddingBottom: insets.bottom + spacing.xxl }}
        renderItem={({ item }) => (
          <WordListRow
            word={capitalize(item.word)}
            description={describe(item)}
            leadingIcon="bookmark"
            onPress={() => navigation.navigate('WordDetail', { word: item.word })}
            onRemove={() => removeBookmark(item.word)}
          />
        )}
      />
    </View>
  );
}

const makeStyles = (colors, typography) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    screenCentered: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },
    count: { ...typography.labelLg, color: colors.onSurfaceVariant, textTransform: 'uppercase' },
    clear: { ...typography.bodySm, color: colors.primary, fontWeight: '600' },
  });
