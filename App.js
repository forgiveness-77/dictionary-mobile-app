import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from './src/theme';
import { HistoryProvider } from './src/context/HistoryContext';
import { BookmarksProvider } from './src/context/BookmarksContext';
import AppNavigator from './src/navigation/AppNavigator';

function Root() {
  const { isDark, colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <HistoryProvider>
            <BookmarksProvider>
              <Root />
            </BookmarksProvider>
          </HistoryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
