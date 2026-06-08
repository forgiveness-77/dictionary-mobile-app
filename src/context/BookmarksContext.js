import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';

const BookmarksContext = createContext(null);

const STORAGE_KEY = '@lexitech/bookmarks';

// Saved/bookmarked words (most-recent-first, deduped), persisted across restarts.
export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = usePersistentState(STORAGE_KEY, []);

  const isBookmarked = useCallback(
    (rawWord) => {
      const word = String(rawWord ?? '').trim().toLowerCase();
      return bookmarks.includes(word);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback((rawWord) => {
    const word = String(rawWord ?? '').trim().toLowerCase();
    if (!word) return;
    setBookmarks((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [word, ...prev]
    );
  }, [setBookmarks]);

  const removeBookmark = useCallback((rawWord) => {
    const word = String(rawWord ?? '').trim().toLowerCase();
    setBookmarks((prev) => prev.filter((w) => w !== word));
  }, [setBookmarks]);

  const clearBookmarks = useCallback(() => setBookmarks([]), [setBookmarks]);

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
