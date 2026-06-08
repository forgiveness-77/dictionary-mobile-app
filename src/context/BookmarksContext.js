import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';

const BookmarksContext = createContext(null);

const STORAGE_KEY = '@lexitech/bookmarks';

// Entries are { word, gloss, partOfSpeech }. Older builds stored plain strings,
// so normalize on read for backward compatibility.
function normalizeEntry(item) {
  if (typeof item === 'string') return { word: item, gloss: '', partOfSpeech: '' };
  return { word: item.word, gloss: item.gloss || '', partOfSpeech: item.partOfSpeech || '' };
}

export function BookmarksProvider({ children }) {
  const [raw, setRaw] = usePersistentState(STORAGE_KEY, []);

  const bookmarks = useMemo(() => raw.map(normalizeEntry), [raw]);

  const isBookmarked = useCallback(
    (rawWord) => {
      const word = String(rawWord ?? '').trim().toLowerCase();
      return bookmarks.some((b) => b.word === word);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (rawWord, meta = {}) => {
      const word = String(rawWord ?? '').trim().toLowerCase();
      if (!word) return;
      setRaw((prev) => {
        const list = prev.map(normalizeEntry);
        if (list.some((b) => b.word === word)) {
          return list.filter((b) => b.word !== word);
        }
        const entry = { word, gloss: meta.gloss || '', partOfSpeech: meta.partOfSpeech || '' };
        return [entry, ...list];
      });
    },
    [setRaw]
  );

  const removeBookmark = useCallback(
    (rawWord) => {
      const word = String(rawWord ?? '').trim().toLowerCase();
      setRaw((prev) => prev.map(normalizeEntry).filter((b) => b.word !== word));
    },
    [setRaw]
  );

  const clearBookmarks = useCallback(() => setRaw([]), [setRaw]);

  const value = useMemo(
    () => ({ bookmarks, isBookmarked, toggleBookmark, removeBookmark, clearBookmarks }),
    [bookmarks, isBookmarked, toggleBookmark, removeBookmark, clearBookmarks]
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return ctx;
}
