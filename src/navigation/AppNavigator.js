import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SearchScreen from '../screens/SearchScreen';
import WordDetailScreen from '../screens/WordDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SavedScreen from '../screens/SavedScreen';
import DrawerContent from './DrawerContent';
import TabBarIcon from '../components/TabBarIcon';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { MenuIcon } from '../components/Icons';
import { spacing, useTheme } from '../theme';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const SearchStackNav = createNativeStackNavigator();
const HistoryStackNav = createNativeStackNavigator();
const SavedStackNav = createNativeStackNavigator();

function MenuButton({ navigation }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      hitSlop={12}
      style={styles.headerBtn}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
    >
      <MenuIcon size={26} color={colors.onSurface} />
    </Pressable>
  );
}

// Shared, theme-aware header options. The light/dark toggle lives top-right.
function useStackOptions() {
  const { colors } = useTheme();
  return {
    headerStyle: { backgroundColor: colors.surface },
    headerShadowVisible: false,
    headerTintColor: colors.primary,
    headerTitleStyle: { color: colors.onSurface, fontWeight: '700', fontSize: 20 },
    headerTitleAlign: 'center',
    contentStyle: { backgroundColor: colors.background },
    headerRight: () => <ThemeToggleButton />,
  };
}

const withMenu = (title) => ({ navigation }) => ({
  title,
  headerLeft: () => <MenuButton navigation={navigation} />,
});

function SearchStack() {
  const opts = useStackOptions();
  return (
    <SearchStackNav.Navigator screenOptions={opts}>
      <SearchStackNav.Screen name="SearchHome" component={SearchScreen} options={withMenu('LexiTech')} />
      <SearchStackNav.Screen name="WordDetail" component={WordDetailScreen} options={{ title: 'Definition' }} />
    </SearchStackNav.Navigator>
  );
}

function HistoryStack() {
  const opts = useStackOptions();
  return (
    <HistoryStackNav.Navigator screenOptions={opts}>
      <HistoryStackNav.Screen name="HistoryHome" component={HistoryScreen} options={withMenu('History')} />
      <HistoryStackNav.Screen name="WordDetail" component={WordDetailScreen} options={{ title: 'Definition' }} />
    </HistoryStackNav.Navigator>
  );
}

function SavedStack() {
  const opts = useStackOptions();
  return (
    <SavedStackNav.Navigator screenOptions={opts}>
      <SavedStackNav.Screen name="SavedHome" component={SavedScreen} options={withMenu('Saved')} />
      <SavedStackNav.Screen name="WordDetail" component={WordDetailScreen} options={{ title: 'Definition' }} />
    </SavedStackNav.Navigator>
  );
}

function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
          borderTopWidth: 1,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{ title: 'Search', tabBarIcon: ({ focused }) => <TabBarIcon name="search" focused={focused} /> }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{ title: 'History', tabBarIcon: ({ focused }) => <TabBarIcon name="history" focused={focused} /> }}
      />
      <Tab.Screen
        name="SavedTab"
        component={SavedStack}
        options={{ title: 'Saved', tabBarIcon: ({ focused }) => <TabBarIcon name="bookmark" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isDark, colors } = useTheme();

  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.onSurface,
        border: colors.outlineVariant,
        notification: colors.primary,
      },
    };
  }, [isDark, colors]);

  return (
    <NavigationContainer theme={navTheme}>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: { width: 300, backgroundColor: colors.surface },
        }}
      >
        <Drawer.Screen name="Main" component={MainTabs} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerBtn: { paddingHorizontal: spacing.sm },
});
