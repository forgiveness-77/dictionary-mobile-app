import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// High-quality icons backed by Ionicons (@expo/vector-icons). Callers pass a
// themed `color`; the neutral default below is only a fallback.
const DEFAULT_COLOR = '#767683';

function makeIcon(glyph, defaultSize = 24) {
  const Icon = ({ size = defaultSize, color = DEFAULT_COLOR, style }) => (
    <Ionicons name={glyph} size={size} color={color} style={style} />
  );
  Icon.displayName = glyph;
  return Icon;
}

export const PlayIcon = makeIcon('play');
export const PauseIcon = makeIcon('pause');
export const StopIcon = makeIcon('stop');
export const VolumeIcon = makeIcon('volume-high');

export const SearchIcon = makeIcon('search', 22);
export const MenuIcon = makeIcon('menu', 26);
export const HistoryIcon = makeIcon('time-outline');
export const BookIcon = makeIcon('book-outline', 64);

export const CloseIcon = makeIcon('close', 22);
export const ChevronRightIcon = makeIcon('chevron-forward', 22);
export const RefreshIcon = makeIcon('refresh', 20);
export const DeleteIcon = makeIcon('trash-outline', 22);

export const ErrorIcon = makeIcon('alert-circle', 16);
export const WarningIcon = makeIcon('warning', 16);
export const InfoIcon = makeIcon('information-circle-outline', 40);
export const SadFaceIcon = makeIcon('sad-outline', 40);
export const WifiOffIcon = makeIcon('cloud-offline-outline', 40);

export const SunIcon = makeIcon('sunny-outline', 24);
export const MoonIcon = makeIcon('moon-outline', 24);

// Bookmark supports a filled/outline variant.
export function BookmarkIcon({ size = 24, color = DEFAULT_COLOR, filled = false, style }) {
  return <Ionicons name={filled ? 'bookmark' : 'bookmark-outline'} size={size} color={color} style={style} />;
}
