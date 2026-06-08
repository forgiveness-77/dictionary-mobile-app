import React, { useMemo } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import { SearchIcon, CloseIcon, ErrorIcon } from './Icons';
import { spacing, radii, useTheme } from '../theme';
import PrimaryButton from './PrimaryButton';

// Search input (icon inside, focus ring) + full-width Search button, with
// inline validation feedback.
export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  error,
  loading = false,
  focused,
  onFocus,
  onBlur,
}) {
  const { colors, typography } = useTheme();
  const styles = useMemo(() => makeStyles(colors, typography), [colors, typography]);
  const showError = !!error;
  const active = focused && !showError;

  return (
    <View>
      <View style={[styles.inputWrap, active && styles.inputWrapActive, showError && styles.inputWrapError]}>
        <SearchIcon size={22} color={showError ? colors.error : active ? colors.primary : colors.outline} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Search for a word..."
          placeholderTextColor={colors.outline}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          editable={!loading}
          accessibilityLabel="Word search input"
        />
        {value?.length > 0 ? (
          <Pressable onPress={onClear} hitSlop={10} accessibilityLabel="Clear search">
            <CloseIcon size={20} color={colors.outline} />
          </Pressable>
        ) : null}
      </View>

      {showError ? (
        <View style={styles.errorRow}>
          <ErrorIcon size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <PrimaryButton title="Search" onPress={onSubmit} loading={loading} style={styles.button} />
    </View>
  );
}

const makeStyles = (colors, typography) =>
  StyleSheet.create({
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceLowest,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.lg,
      height: 52,
    },
    inputWrapActive: { borderColor: colors.primary, borderWidth: 1.5 },
    inputWrapError: { borderColor: colors.error, borderWidth: 1.5 },
    input: { flex: 1, marginLeft: spacing.md, ...typography.bodyMd, paddingVertical: 0 },
    errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
    errorText: { ...typography.bodySm, color: colors.error, marginLeft: spacing.xs, flex: 1 },
    button: { marginTop: spacing.lg },
  });
