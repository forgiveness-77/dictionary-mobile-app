import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import WordListRow from '../components/WordListRow';
import StatusView from '../components/StatusView';
import { useHistory } from '../context/HistoryContext';
import { colors, spacing, typography } from '../theme';

export default function HistoryScreen({ navigation }) {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const insets = useSafeAreaInsets();

  if (history.length === 0) {
    return (
      <View style={styles.screenCentered}>
        <StatusView
          icon="history"
          title="No history yet"
          message="Words you look up will appear here for quick access."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.count}>
          {history.length} {history.length === 1 ? 'word' : 'words'}
        </Text>
        <Pressable onPress={clearHistory} hitSlop={8} accessibilityLabel="Clear all history">
          <Text style={styles.clear}>Clear all</Text>
        </Pressable>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item}
        contentContainerStyle={{ padding: spacing.sm, paddingBottom: insets.bottom + spacing.xxl }}
        renderItem={({ item }) => (
          <WordListRow
            word={item}
            leadingIcon="schedule"
            onPress={() => navigation.navigate('WordDetail', { word: item })}
            onRemove={() => removeFromHistory(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
