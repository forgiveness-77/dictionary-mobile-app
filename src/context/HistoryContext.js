import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';

const HistoryContext = createContext(null);

const STORAGE_KEY = '@lexitech/history';
const MAX_HISTORY = 50;

export function HistoryProvider({ children }) {
  // Most-recent-first list of unique searched words, persisted across restarts.
  const [history, setHistory] = usePersistentState(STORAGE_KEY, []);

  const addToHistory = useCallback((rawWord) => {
    const word = String(rawWord ?? '').trim().toLowerCase();
    if (!word) return;
    setHistory((prev) => {
      // Remove any existing copy so re-searching moves the word to the top
      // (this is also what prevents duplicate entries).
      const withoutDup = prev.filter((item) => item !== word);
      return [word, ...withoutDup].slice(0, MAX_HISTORY);
    });
  }, [setHistory]);

  const removeFromHistory = useCallback((rawWord) => {
    const word = String(rawWord ?? '').trim().toLowerCase();
    setHistory((prev) => prev.filter((item) => item !== word));
  }, [setHistory]);

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  const value = useMemo(
    () => ({ history, addToHistory, removeFromHistory, clearHistory }),
    [history, addToHistory, removeFromHistory, clearHistory]
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return ctx;
}
