import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import SearchBar from '../components/SearchBar';
import { BookIcon } from '../components/Icons';
import { validateSearchTerm } from '../utils/validation';
import { colors, radii, spacing, typography } from '../theme';

// Home screen: brand, validated search, and an empty-state prompt. The actual
// lookup (loading + results) happens on the detail screen.
export default function SearchScreen({ navigation }) {
  const [term, setTerm] = useState('');
  const [inputError, setInputError] = useState(null);
  const [focused, setFocused] = useState(false);

  const onSubmit = useCallback(() => {
    const result = validateSearchTerm(term);
    if (!result.valid) {
      setInputError(result.error);
      return;
    }
    setInputError(null);
    Keyboard.dismiss();
    navigation.navigate('WordDetail', { word: result.value });
  }, [term, navigation]);

  const onChangeText = useCallback((text) => {
    setTerm(text);
    if (inputError) setInputError(null);
  }, [inputError]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
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

        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <BookIcon size={64} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Expand your vocabulary</Text>
          <Text style={styles.emptyText}>
            Search for any English word above to discover definitions, synonyms, and
            examples instantly.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, flexGrow: 1 },
  brand: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl },
  brandTitle: { ...typography.displayWord, fontSize: 34 },
  brandSubtitle: { ...typography.bodySm, marginTop: spacing.xs },
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
