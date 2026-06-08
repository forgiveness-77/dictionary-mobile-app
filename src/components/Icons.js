import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// SVG-style play icon (triangle pointing right)
export function PlayIcon({ size = 24, color = colors.onPrimary }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    triangle: {
      width: 0,
      height: 0,
      borderLeftWidth: size * 0.4,
      borderRightWidth: 0,
      borderBottomWidth: size * 0.3,
      borderTopWidth: size * 0.3,
      borderLeftColor: color,
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.triangle} />
    </View>
  );
}

// SVG-style pause icon (two vertical bars)
export function PauseIcon({ size = 24, color = colors.onPrimary }) {
  const barWidth = size * 0.15;
  const barHeight = size * 0.6;
  const gap = size * 0.2;

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: gap,
    },
    bar: {
      width: barWidth,
      height: barHeight,
      backgroundColor: color,
      borderRadius: barWidth * 0.3,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.bar} />
      <View style={styles.bar} />
    </View>
  );
}

// SVG-style stop icon (square)
export function StopIcon({ size = 24, color = colors.onPrimary }) {
  const boxSize = size * 0.65;

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    square: {
      width: boxSize,
      height: boxSize,
      backgroundColor: color,
      borderRadius: boxSize * 0.15,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.square} />
    </View>
  );
}

// SVG-style volume icon (speaker with sound waves)
export function VolumeIcon({ size = 24, color = colors.onPrimary }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    speaker: {
      width: size * 0.5,
      height: size * 0.6,
      backgroundColor: color,
      borderTopLeftRadius: size * 0.1,
      borderBottomLeftRadius: size * 0.1,
      marginRight: size * 0.15,
    },
    cone: {
      position: 'absolute',
      width: 0,
      height: 0,
      borderLeftWidth: size * 0.15,
      borderRightWidth: 0,
      borderBottomWidth: size * 0.18,
      borderTopWidth: size * 0.18,
      borderLeftColor: color,
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      right: size * 0.1,
      top: '50%',
      marginTop: -size * 0.18,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.cone} />
      <View style={styles.speaker} />
    </View>
  );
}

// SVG-style bookmark icon (ribbon)
export function BookmarkIcon({ size = 24, color = colors.primary, filled = false }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bookmark: {
      width: size * 0.6,
      height: size * 0.9,
      backgroundColor: filled ? color : 'transparent',
      borderWidth: filled ? 0 : 2,
      borderColor: color,
      borderRadius: size * 0.1,
      position: 'relative',
    },
    notch: {
      position: 'absolute',
      bottom: -size * 0.15,
      left: '50%',
      width: 0,
      height: 0,
      borderLeftWidth: size * 0.15,
      borderRightWidth: size * 0.15,
      borderTopWidth: size * 0.2,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: filled ? color : color,
      marginLeft: -size * 0.15,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.bookmark}>
        <View style={styles.notch} />
      </View>
    </View>
  );
}

// SVG-style search icon (magnifying glass)
export function SearchIcon({ size = 22, color = colors.onSurface }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      width: size * 0.5,
      height: size * 0.5,
      borderRadius: size * 0.25,
      borderWidth: 2,
      borderColor: color,
    },
    handle: {
      position: 'absolute',
      width: 2,
      height: size * 0.35,
      backgroundColor: color,
      bottom: size * 0.1,
      right: size * 0.1,
      transform: [{ rotate: '-45deg' }],
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <View style={styles.handle} />
    </View>
  );
}

// SVG-style menu icon (hamburger)
export function MenuIcon({ size = 26, color = colors.onSurface }) {
  const lineHeight = 2;
  const lineWidth = size * 0.7;
  const gap = size * 0.15;

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lines: {
      gap: gap,
    },
    line: {
      width: lineWidth,
      height: lineHeight,
      backgroundColor: color,
      borderRadius: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.lines}>
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </View>
    </View>
  );
}

// SVG-style history icon (clock)
export function HistoryIcon({ size = 24, color = colors.onSurface }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      width: size * 0.75,
      height: size * 0.75,
      borderRadius: size * 0.375,
      borderWidth: 2,
      borderColor: color,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    center: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: color,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <View style={styles.center} />
      </View>
    </View>
  );
}

// SVG-style book icon (stacked lines with spine)
export function BookIcon({ size = 64, color = colors.primary }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    book: {
      width: size * 0.7,
      height: size * 0.7,
      borderWidth: 2,
      borderColor: color,
      borderRadius: size * 0.1,
      position: 'relative',
      overflow: 'hidden',
    },
    spine: {
      position: 'absolute',
      left: '50%',
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: color,
      marginLeft: -1,
    },
    line: {
      position: 'absolute',
      height: 2,
      backgroundColor: color,
      left: '20%',
      right: '20%',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.book}>
        <View style={styles.spine} />
        <View style={[styles.line, { top: '25%' }]} />
        <View style={[styles.line, { top: '50%' }]} />
        <View style={[styles.line, { top: '75%' }]} />
      </View>
    </View>
  );
}

// SVG-style close icon (X)
export function CloseIcon({ size = 22, color = colors.onSurfaceVariant }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    line1: {
      position: 'absolute',
      width: size * 0.6,
      height: 2,
      backgroundColor: color,
      transform: [{ rotate: '45deg' }],
    },
    line2: {
      position: 'absolute',
      width: size * 0.6,
      height: 2,
      backgroundColor: color,
      transform: [{ rotate: '-45deg' }],
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.line1} />
      <View style={styles.line2} />
    </View>
  );
}

// SVG-style chevron right icon (>)
export function ChevronRightIcon({ size = 22, color = colors.outline }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chevron: {
      width: size * 0.35,
      height: size * 0.6,
      borderTopWidth: 2,
      borderRightWidth: 2,
      borderColor: color,
      transform: [{ rotate: '-45deg' }],
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.chevron} />
    </View>
  );
}

// SVG-style error icon (exclamation in circle)
export function ErrorIcon({ size = 16, color = colors.error }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 1.5,
      borderColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    },
    exclamation: {
      width: 2,
      height: size * 0.4,
      backgroundColor: color,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <View style={styles.exclamation} />
      </View>
    </View>
  );
}

// SVG-style warning icon (triangle with exclamation)
export function WarningIcon({ size = 16, color = colors.error }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    triangle: {
      width: 0,
      height: 0,
      borderLeftWidth: size * 0.4,
      borderRightWidth: size * 0.4,
      borderBottomWidth: size * 0.7,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: color,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.triangle} />
    </View>
  );
}

// SVG-style delete icon (trash can)
export function DeleteIcon({ size = 22, color = colors.error }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lid: {
      width: size * 0.6,
      height: 2,
      backgroundColor: color,
      marginBottom: size * 0.1,
      borderTopLeftRadius: 1,
      borderTopRightRadius: 1,
    },
    can: {
      width: size * 0.5,
      height: size * 0.5,
      borderWidth: 1.5,
      borderColor: color,
      borderRadius: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.lid} />
      <View style={styles.can} />
    </View>
  );
}

// SVG-style refresh icon (circular arrow)
export function RefreshIcon({ size = 20, color = colors.onPrimary }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      width: size * 0.7,
      height: size * 0.7,
      borderRadius: size * 0.35,
      borderWidth: 2,
      borderColor: color,
      borderTopColor: 'transparent',
    },
    arrow: {
      position: 'absolute',
      width: 0,
      height: 0,
      borderLeftWidth: size * 0.15,
      borderRightWidth: size * 0.15,
      borderTopWidth: size * 0.15,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: color,
      right: size * 0.05,
      top: size * 0.05,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <View style={styles.arrow} />
    </View>
  );
}

// SVG-style info icon (i in circle)
export function InfoIcon({ size = 40, color = colors.outline }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      width: size * 0.15,
      height: size * 0.15,
      borderRadius: size * 0.075,
      backgroundColor: color,
      marginTop: -size * 0.12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <View style={styles.dot} />
      </View>
    </View>
  );
}

// SVG-style sad face icon (sentiment dissatisfied)
export function SadFaceIcon({ size = 40, color = colors.outline }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mouth: {
      width: size * 0.3,
      height: size * 0.2,
      borderBottomLeftRadius: size * 0.3,
      borderBottomRightRadius: size * 0.3,
      borderWidth: 2,
      borderTopWidth: 0,
      borderColor: color,
      marginTop: size * 0.05,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <View style={styles.mouth} />
      </View>
    </View>
  );
}

// SVG-style wifi off icon
export function WifiOffIcon({ size = 40, color = colors.error }) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
    wifiShape: {
      width: size * 0.6,
      height: size * 0.4,
    },
    dot: {
      width: size * 0.12,
      height: size * 0.12,
      borderRadius: size * 0.06,
      backgroundColor: color,
      position: 'absolute',
      bottom: 0,
      alignSelf: 'center',
      marginLeft: '50%',
      marginLeft: -size * 0.06,
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.wifiShape, { borderRadius: size * 0.6, borderWidth: 2, borderColor: color }]} />
      <View style={styles.dot} />
    </View>
  );
}
