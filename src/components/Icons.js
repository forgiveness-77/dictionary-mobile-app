import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// High-quality icons backed by Ionicons (@expo/vector-icons). The public API
// (named components + size/color props) is unchanged, so the rest of the app
// keeps working without edits.
function makeIcon(glyph, defaultColor = colors.onSurface, defaultSize = 24) {
  const Icon = ({ size = defaultSize, color = defaultColor, style }) => (
    <Ionicons name={glyph} size={size} color={color} style={style} />
  );
  Icon.displayName = glyph;
  return Icon;
}

export const PlayIcon = makeIcon('play', colors.onPrimary);
export const PauseIcon = makeIcon('pause', colors.onPrimary);
export const StopIcon = makeIcon('stop', colors.onSurfaceVariant);
export const VolumeIcon = makeIcon('volume-high', colors.onPrimary);

export const SearchIcon = makeIcon('search', colors.onSurface, 22);
export const MenuIcon = makeIcon('menu', colors.onSurface, 26);
export const HistoryIcon = makeIcon('time-outline', colors.onSurface);
export const BookIcon = makeIcon('book-outline', colors.primary, 64);

export const CloseIcon = makeIcon('close', colors.onSurfaceVariant, 22);
export const ChevronRightIcon = makeIcon('chevron-forward', colors.outline, 22);
export const RefreshIcon = makeIcon('refresh', colors.onPrimary, 20);
export const DeleteIcon = makeIcon('trash-outline', colors.error, 22);

export const ErrorIcon = makeIcon('alert-circle', colors.error, 16);
export const WarningIcon = makeIcon('warning', colors.error, 16);
export const InfoIcon = makeIcon('information-circle-outline', colors.outline, 40);
export const SadFaceIcon = makeIcon('sad-outline', colors.outline, 40);
export const WifiOffIcon = makeIcon('cloud-offline-outline', colors.error, 40);

// Bookmark supports a filled/outline variant.
export function BookmarkIcon({ size = 24, color = colors.primary, filled = false, style }) {
  return <Ionicons name={filled ? 'bookmark' : 'bookmark-outline'} size={size} color={color} style={style} />;
}
