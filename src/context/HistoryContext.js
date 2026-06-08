import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';

const HistoryContext = createContext(null);

const STORAGE_KEY = '@lexitech/history';
const MAX_HISTORY = 50;

// Entries are { word, gloss, partOfSpeech }. Older builds stored plain strings,
// so normalize on read for backward compatibility.
function normalizeEntry(item) {
  if (typeof item === 'string') return { word: item, gloss: '', partOfSpeech: '' };
  return { word: item.word, gloss: item.gloss || '', partOfSpeech: item.partOfSpeech || '' };
}

export function HistoryProvider({ children }) {
  const [raw, setRaw] = usePersistentState(STORAGE_KEY, []);

  const history = useMemo(() => raw.map(normalizeEntry), [raw]);

  const addToHistory = useCallback(
    (rawWord, meta = {}) => {
      const word = String(rawWord ?? '').trim().toLowerCase();
      if (!word) return;
      setRaw((prev) => {
        // Drop any existing copy so re-searching moves the word to the top
        // (also prevents duplicates).
        const list = prev.map(normalizeEntry).filter((e) => e.word !== word);
        const entry = { word, gloss: meta.gloss || '', partOfSpeech: meta.partOfSpeech || '' };
        return [entry, ...list].slice(0, MAX_HISTORY);
      });
    },
    [setRaw]
  );

  const removeFromHistory = useCallback(
    (rawWord) => {
      const word = String(rawWord ?? '').trim().toLowerCase();
      setRaw((prev) => prev.map(normalizeEntry).filter((e) => e.word !== word));
    },
    [setRaw]
  );

  const clearHistory = useCallback(() => setRaw([]), [setRaw]);

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
