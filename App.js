import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { HistoryProvider } from './src/context/HistoryContext';
import { BookmarksProvider } from './src/context/BookmarksContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HistoryProvider>
          <BookmarksProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </BookmarksProvider>
        </HistoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
