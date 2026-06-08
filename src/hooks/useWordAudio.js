import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

// Owns a single audio player and exposes full playback controls for a word's
// pronunciations. Picks a preferred accent (US > UK > first) by default and
// lets the caller switch/play/pause/stop any available accent. Errors are reported via
// `onError` rather than thrown so the screen never crashes (Activity 3).
export function useWordAudio(audios = [], onError) {
  const player = useAudioPlayer();
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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => setActiveIndex(preferredIndex), [preferredIndex]);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  useEffect(() => {
    if (status?.isLoaded && loadingIndex >= 0) setLoadingIndex(-1);
  }, [status?.isLoaded, loadingIndex]);

  const play = useCallback(
    (index) => {
      const i = typeof index === 'number' ? index : activeIndex;
      const audio = audios[i];
      if (!audio) return;
      try {
        setActiveIndex(i);
        setLoadingIndex(i);
        setIsPaused(false);
        player.replace({ uri: audio.url });
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
      setIsPaused(true);
    } catch (e) {
      onError?.('Could not pause the pronunciation.');
    }
  }, [player, onError]);

  const resume = useCallback(() => {
    try {
      player.play();
      setIsPaused(false);
    } catch (e) {
      onError?.('Could not resume the pronunciation.');
    }
  }, [player, onError]);

  const stop = useCallback(() => {
    try {
      player.pause();
      player.seekTo(0);
      setIsPaused(false);
    } catch (e) {
      onError?.('Could not stop the pronunciation.');
    }
  }, [player, onError]);

  const togglePlay = useCallback(() => {
    if (status?.playing) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      play();
    }
  }, [status?.playing, isPaused, play, pause, resume]);

  return {
    hasAudio: audios.length > 0,
    audios,
    activeIndex,
    loadingIndex,
    play,
    pause,
    resume,
    stop,
    togglePlay,
    isPlaying: !!status?.playing,
    isPaused,
    isLoading: loadingIndex >= 0,
    duration: status?.durationMillis || 0,
    position: status?.currentPositionMillis || 0,
  };
}
