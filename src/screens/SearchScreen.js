import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';

import SearchBar from '../components/SearchBar';
import { BookIcon, HistoryIcon, SearchIcon } from '../components/Icons';
import { validateSearchTerm, capitalize } from '../utils/validation';
import { useHistory } from '../context/HistoryContext';
import { spacing, radii, useTheme } from '../theme';

// Home screen: brand, validated search with history-backed suggestions, and an
// empty-state prompt. The lookup (loading + results) happens on the detail screen.
export default function SearchScreen({ navigation }) {
  const [term, setTerm] = useState('');
  const [inputError, setInputError] = useState(null);
  const [focused, setFocused] = useState(false);
  const { history } = useHistory();
  const { colors, typography } = useTheme();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);

  const query = term.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (query.length > 0) {
      return history.filter((h) => h.word.includes(query) && h.word !== query).slice(0, 6);
    }
    if (focused) return history.slice(0, 5);
    return [];
  }, [query, focused, history]);

  const goToWord = useCallback(
    (word) => {
      Keyboard.dismiss();
      navigation.navigate('WordDetail', { word });
    },
    [navigation]
  );

  const onSubmit = useCallback(() => {
    const result = validateSearchTerm(term);
    if (!result.valid) {
      setInputError(result.error);
      return;
    }
    setInputError(null);
    goToWord(result.value);
  }, [term, goToWord]);

  const onChangeText = useCallback(
    (text) => {
      setTerm(text);
      if (inputError) setInputError(null);
    },
    [inputError]
  );

  const showSuggestions = suggestions.length > 0;
  const isTyping = query.length > 0;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <Text style={styles.brandTitle}>LexiTech</Text>
          <Text style={styles.brandSubtitle}>The authority in modern linguistics.</Text>
        </View>

        <SearchBar
          value={term}
          onChangeText={onChangeText}
          onSubmit={onSubmit}
          onClear={() => onChangeText('')}
          error={inputError}
          focused={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {showSuggestions ? (
          <View style={styles.suggestCard}>
            <Text style={styles.suggestHeading}>{isTyping ? 'Suggestions' : 'Recent searches'}</Text>
            {suggestions.map((item) => (
              <Pressable
                key={item.word}
                onPress={() => goToWord(item.word)}
                android_ripple={{ color: colors.surfaceLow }}
                style={({ pressed }) => [styles.suggestRow, pressed && styles.suggestRowPressed]}
                accessibilityRole="button"
                accessibilityLabel={`Search ${item.word}`}
              >
                {isTyping ? (
                  <SearchIcon size={18} color={colors.outline} />
                ) : (
                  <HistoryIcon size={18} color={colors.outline} />
                )}
                <View style={styles.suggestText}>
                  <Text style={styles.suggestWord} numberOfLines={1}>
                    {capitalize(item.word)}
                  </Text>
                  {item.gloss ? (
                    <Text style={styles.suggestGloss} numberOfLines={1}>
                      {item.gloss}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            ))}
          </View>
        ) : isTyping ? (
          <Pressable
            onPress={onSubmit}
            style={({ pressed }) => [styles.searchPrompt, pressed && styles.suggestRowPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Search ${term}`}
          >
            <SearchIcon size={18} color={colors.primary} />
            <Text style={styles.searchPromptText} numberOfLines={1}>
              Search “{term.trim()}”
            </Text>
          </Pressable>
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <BookIcon size={64} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Expand your vocabulary</Text>
            <Text style={styles.emptyText}>
              Search for any English word above to discover definitions, synonyms, and examples
              instantly.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors, typography) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, flexGrow: 1 },
    brand: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl },
    brandTitle: { ...typography.displayWord, fontSize: 34 },
    brandSubtitle: { ...typography.bodySm, marginTop: spacing.xs },

    suggestCard: {
      marginTop: spacing.lg,
      backgroundColor: colors.surfaceLowest,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      paddingVertical: spacing.xs,
      overflow: 'hidden',
    },
    suggestHeading: {
      ...typography.labelMd,
      color: colors.onSurfaceVariant,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      fontWeight: '700',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.xs,
    },
    suggestRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    suggestRowPressed: { backgroundColor: colors.surfaceLow },
    suggestText: { flex: 1 },
    suggestWord: { ...typography.bodyMd, fontWeight: '600', textTransform: 'capitalize' },
    suggestGloss: { ...typography.bodySm, color: colors.onSurfaceVariant, marginTop: 1 },

    searchPrompt: {
      marginTop: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.primarySoft,
      borderRadius: radii.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    searchPromptText: { ...typography.bodyMd, color: colors.primary, fontWeight: '600', flex: 1 },

    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl },
    emptyIcon: {
      width: 160,
      height: 160,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceLow,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    emptyTitle: { ...typography.headlineLg, fontSize: 20 },
    emptyText: {
      ...typography.bodyMd,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      marginTop: spacing.sm,
      maxWidth: 300,
    },
  });
