import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchIcon, HistoryIcon, BookmarkIcon } from './Icons';
import { colors, radii, spacing } from '../theme';

// Bottom-tab icon with the LexiTech active "pill" behind the focused icon.
export default function TabBarIcon({ name, focused }) {
  const iconColor = focused ? colors.primary : colors.onSurfaceVariant;
  
  const getIcon = () => {
    switch (name) {
      case 'search':
        return <SearchIcon size={24} color={iconColor} />;
      case 'history':
        return <HistoryIcon size={24} color={iconColor} />;
      case 'bookmark':
        return <BookmarkIcon size={24} color={iconColor} filled={false} />;
      default:
        return <SearchIcon size={24} color={iconColor} />;
    }
  };

  return (
    <View style={[styles.wrap, focused && styles.wrapActive]}>
      {getIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: radii.pill },
  wrapActive: { backgroundColor: colors.primarySoft },
});
