import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchIcon, HistoryIcon, BookmarkIcon } from './Icons';
import { colors, radii, spacing } from '../theme';

// Bottom-tab icon with a clear active "pill" highlight behind the focused tab.
export default function TabBarIcon({ name, focused }) {
  const iconColor = focused ? colors.primary : colors.onSurfaceVariant;

  const getIcon = () => {
    switch (name) {
      case 'search':
        return <SearchIcon size={24} color={iconColor} />;
      case 'history':
        return <HistoryIcon size={24} color={iconColor} />;
      case 'bookmark':
        return <BookmarkIcon size={22} color={iconColor} filled={focused} />;
      default:
        return <SearchIcon size={24} color={iconColor} />;
    }
  };

  return <View style={[styles.wrap, focused && styles.wrapActive]}>{getIcon()}</View>;
}

const styles = StyleSheet.create({
  wrap: {
    minWidth: 60,
    height: 32,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
  wrapActive: { backgroundColor: 'rgba(0,122,255,0.14)' },
});
