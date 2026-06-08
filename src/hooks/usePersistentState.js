import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// State that persists to AsyncStorage across app restarts.
// Returns [state, setState, hydrated]. `hydrated` is false until the stored
// value has been read, which prevents the initial empty value from being
// written back over real saved data on first render.
export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Load the persisted value once on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (active && raw != null) {
          const parsed = JSON.parse(raw);
          if (parsed != null) setState(parsed);
        }
      } catch (e) {
        // Corrupt or unavailable storage — fall back to the initial value.
      } finally {
        if (active) setHydrated(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [key]);

  // Persist on every change, but only after hydration has completed.
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(key, JSON.stringify(state)).catch(() => {});
  }, [key, state, hydrated]);

  return [state, setState, hydrated];
}
