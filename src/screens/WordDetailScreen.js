import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import WordHeader from '../components/WordHeader';
import AudioPlayer from '../components/AudioPlayer';
import MeaningCard from '../components/MeaningCard';
import Loading from '../components/Loading';
import StatusView from '../components/StatusView';
import { WarningIcon } from '../components/Icons';
import { getWordData, ErrorType } from '../api/dictionaryApi';
import { capitalize } from '../utils/validation';
import { useHistory } from '../context/HistoryContext';
import { useBookmarks } from '../context/BookmarksContext';
import { useWordAudio } from '../hooks/useWordAudio';
import { colors, radii, spacing, typography } from '../theme';

const ERROR_PRESENTATION = {
  [ErrorType.NOT_FOUND]: { icon: 'sentiment-dissatisfied', title: 'Word not found', tone: 'neutral' },
  [ErrorType.NETWORK]: { icon: 'wifi-off', title: 'No connection', tone: 'error' },
  [ErrorType.TIMEOUT]: { icon: 'schedule', title: 'Request timed out', tone: 'error' },
  [ErrorType.SERVER]: { icon: 'cloud-off', title: 'Service unavailable', tone: 'error' },
  [ErrorType.PARSE]: { icon: 'bug-report', title: 'Unexpected response', tone: 'error' },
  [ErrorType.UNKNOWN]: { icon: 'error-outline', title: 'Something went wrong', tone: 'error' },
};

// Short summary used for the history/saved subtitle.
function summarize(result) {
  const meaning = result?.meanings?.[0];
  return {
    gloss: meaning?.definitions?.[0]?.definition || '',
    partOfSpeech: meaning?.partOfSpeech || '',
  };
}

export default function WordDetailScreen({ route, navigation }) {
  const initialWord = route.params?.word || '';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioError, setAudioError] = useState(null);

  const { addToHistory } = useHistory();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const audio = useWordAudio(data?.audios || [], setAudioError);

  const load = useCallback(
    async (word) => {
      setError(null);
      setAudioError(null);
      setLoading(true);
      try {
        const result = await getWordData(word);
        setData(result);
        addToHistory(result.word || word, summarize(result));
      } catch (e) {
        setData(null);
        setError({ type: e?.type || ErrorType.UNKNOWN, message: e?.message });
      } finally {
        setLoading(false);
      }
    },
    [addToHistory]
  );

  useEffect(() => {
    if (initialWord) load(initialWord);
  }, [initialWord, load]);

  // Keep the header title in sync with the word being shown.
  useEffect(() => {
    navigation.setOptions({ title: capitalize(data?.word || initialWord || 'Definition') });
  }, [data, initialWord, navigation]);

  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <View style={styles.screen}>
        <Loading message="Looking that up…" />
      </View>
    );
  }

  if (error) {
    const preset = ERROR_PRESENTATION[error.type] || ERROR_PRESENTATION[ErrorType.UNKNOWN];
    return (
      <View style={styles.screen}>
        <StatusView
          icon={preset.icon}
          tone={preset.tone}
          title={preset.title}
          message={error.message}
          actionLabel="Try again"
          onAction={() => load(initialWord)}
          style={styles.centered}
        />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.screen}>
        <StatusView
          icon="search"
          title="Nothing to show"
          message="Search for a word to see its definition."
          style={styles.centered}
        />
      </View>
    );
  }

  const bookmarked = isBookmarked(data.word);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
    >
      <WordHeader
        word={capitalize(data.word)}
        phonetic={data.phoneticText}
        isBookmarked={bookmarked}
        onToggleBookmark={() => toggleBookmark(data.word, summarize(data))}
      />

      <AudioPlayer audio={audio} />

      {audioError ? (
        <View style={styles.audioBanner}>
          <WarningIcon size={16} color={colors.error} />
          <Text style={styles.audioBannerText}>{audioError}</Text>
        </View>
      ) : null}

      {data.meanings.length > 0 ? (
        data.meanings.map((meaning, index) => (
          <MeaningCard key={`${meaning.partOfSpeech}-${index}`} meaning={meaning} />
        ))
      ) : (
        <StatusView
          icon="info-outline"
          title="No definitions available"
          message="This entry doesn’t include any definitions."
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center' },
  content: { padding: spacing.lg },
  audioBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.errorContainer,
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  audioBannerText: { ...typography.bodySm, color: colors.onErrorContainer, flex: 1 },
});
