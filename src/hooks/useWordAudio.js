import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

// Owns a single audio player and exposes full transport controls + progress for
// a word's pronunciations. Picks a preferred accent (US > UK > first) and lets
// the caller play/pause/stop/seek and switch accents. Errors are reported via
// `onError` rather than thrown so the screen never crashes (Activity 3).
export function useWordAudio(audios = [], onError) {
  // ~10 status updates/sec for a smooth progress bar.
  const player = useAudioPlayer(null, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);

  const preferredIndex = useMemo(() => {
    if (!audios.length) return -1;
    const us = audios.findIndex((a) => a.accent === 'US');
    if (us >= 0) return us;
    const uk = audios.findIndex((a) => a.accent === 'UK');
    if (uk >= 0) return uk;
    return 0;
  }, [audios]);

  const [activeIndex, setActiveIndex] = useState(preferredIndex);
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const loadedIndexRef = useRef(-1); // which audio is currently loaded in the player

  // Reset when the word (and therefore its audios) changes.
  useEffect(() => {
    setActiveIndex(preferredIndex);
    loadedIndexRef.current = -1;
  }, [preferredIndex]);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // Clear the buffering spinner once the source has loaded.
  useEffect(() => {
    if (status?.isLoaded && loadingIndex >= 0) setLoadingIndex(-1);
  }, [status?.isLoaded, loadingIndex]);

  // When playback finishes, rewind so the progress bar resets and the next
  // tap plays from the start.
  useEffect(() => {
    if (status?.didJustFinish) {
      try {
        player.pause();
        player.seekTo(0);
      } catch (e) {
        /* no-op */
      }
    }
  }, [status?.didJustFinish, player]);

  const play = useCallback(
    (index) => {
      const i = typeof index === 'number' ? index : activeIndex;
      const audio = audios[i];
      if (!audio) return;
      try {
        setActiveIndex(i);
        if (loadedIndexRef.current !== i) {
          setLoadingIndex(i);
          player.replace({ uri: audio.url });
          loadedIndexRef.current = i;
        }
        player.seekTo(0);
        player.play();
      } catch (e) {
        setLoadingIndex(-1);
        onError?.('Could not play the pronunciation. Please try again.');
      }
    },
    [audios, activeIndex, player, onError]
  );

  const pause = useCallback(() => {
    try {
      player.pause();
    } catch (e) {
      /* no-op */
    }
  }, [player]);

  const resume = useCallback(() => {
    // Nothing loaded yet → start the active accent from the beginning.
    if (loadedIndexRef.current < 0) {
      play(activeIndex);
      return;
    }
    try {
      player.play();
    } catch (e) {
      onError?.('Could not play the pronunciation. Please try again.');
    }
  }, [player, activeIndex, play, onError]);

  const togglePlay = useCallback(() => {
    if (status?.playing) pause();
    else resume();
  }, [status?.playing, pause, resume]);

  const stop = useCallback(() => {
    try {
      player.pause();
      player.seekTo(0);
    } catch (e) {
      /* no-op */
    }
  }, [player]);

  const seekToRatio = useCallback(
    (ratio) => {
      const d = status?.duration || 0;
      if (d > 0) {
        const clamped = Math.max(0, Math.min(1, ratio));
        try {
          player.seekTo(clamped * d);
        } catch (e) {
          /* no-op */
        }
      }
    },
    [player, status?.duration]
  );

  const duration = status?.duration || 0;
  const position = duration > 0 ? Math.min(status?.currentTime || 0, duration) : 0;
  const progress = duration > 0 ? Math.min(1, Math.max(0, position / duration)) : 0;

  return {
    hasAudio: audios.length > 0,
    audios,
    activeIndex,
    play,
    pause,
    resume,
    togglePlay,
    stop,
    seekToRatio,
    isPlaying: !!status?.playing,
    isLoading: loadingIndex >= 0 && !status?.isLoaded,
    isLoaded: !!status?.isLoaded,
    position,
    duration,
    progress,
  };
}
