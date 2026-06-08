import axios from 'axios';
import { isOnline } from '../utils/network';

// Free Dictionary API — https://dictionaryapi.dev
const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { Accept: 'application/json' },
});

// Typed error categories so the UI can show the right message / action.
export const ErrorType = {
  EMPTY: 'EMPTY',
  NOT_FOUND: 'NOT_FOUND',
  NETWORK: 'NETWORK',
  TIMEOUT: 'TIMEOUT',
  SERVER: 'SERVER',
  PARSE: 'PARSE',
  UNKNOWN: 'UNKNOWN',
};

export class DictionaryError extends Error {
  constructor(type, message) {
    super(message);
    this.name = 'DictionaryError';
    this.type = type;
  }
}

const ACCENT_LABELS = { us: 'US', uk: 'UK', au: 'AU', ca: 'CA', in: 'IN', nz: 'NZ', za: 'ZA' };

function deriveAccent(url = '') {
  // Free Dictionary audio files end with a region code, e.g. "word-us.mp3".
  const match = String(url).toLowerCase().match(/-([a-z]{2})\.mp3(?:[?#].*)?$/);
  return match && ACCENT_LABELS[match[1]] ? ACCENT_LABELS[match[1]] : '';
}

// The API can return inconsistent shapes (missing fields, multiple entries,
// empty phonetics). Normalize everything into one predictable object and
// guard every access so a malformed response can never crash the app.
export function normalizeEntries(entries, fallbackWord = '') {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new DictionaryError(ErrorType.PARSE, 'The dictionary response could not be read.');
  }

  const word = entries.find((e) => e && e.word)?.word || fallbackWord;
  let phoneticText = '';
  const audios = [];
  const seenAudio = new Set();
  const meanings = [];
  const sourceUrls = new Set();

  entries.forEach((entry) => {
    if (!entry || typeof entry !== 'object') return;

    if (!phoneticText && entry.phonetic) phoneticText = entry.phonetic;

    (Array.isArray(entry.phonetics) ? entry.phonetics : []).forEach((p) => {
      if (!p) return;
      if (!phoneticText && p.text) phoneticText = p.text;
      if (p.audio && !seenAudio.has(p.audio)) {
        seenAudio.add(p.audio);
        audios.push({ url: p.audio, accent: deriveAccent(p.audio), text: p.text || '' });
      }
    });

    (Array.isArray(entry.meanings) ? entry.meanings : []).forEach((m) => {
      if (!m) return;
      const definitions = (Array.isArray(m.definitions) ? m.definitions : [])
        .filter((d) => d && d.definition)
        .map((d) => ({
          definition: d.definition,
          example: d.example || '',
          synonyms: Array.isArray(d.synonyms) ? d.synonyms : [],
          antonyms: Array.isArray(d.antonyms) ? d.antonyms : [],
        }));
      meanings.push({
        partOfSpeech: m.partOfSpeech || 'other',
        definitions,
        synonyms: Array.isArray(m.synonyms) ? m.synonyms : [],
        antonyms: Array.isArray(m.antonyms) ? m.antonyms : [],
      });
    });

    (Array.isArray(entry.sourceUrls) ? entry.sourceUrls : []).forEach(
      (u) => u && sourceUrls.add(u)
    );
  });

  return {
    word,
    phoneticText,
    audios,
    meanings: meanings.filter((m) => m.definitions.length > 0),
    sourceUrls: Array.from(sourceUrls),
  };
}

// Fetch + normalize a single word. Always throws a DictionaryError on failure
// so callers have one error shape to handle.
export async function getWordData(rawWord) {
  const word = String(rawWord ?? '').trim().toLowerCase();
  if (!word) {
    throw new DictionaryError(ErrorType.EMPTY, 'Please enter a word to search.');
  }

  // Proactively detect an offline device for a clearer message. Falls back to
  // the reactive network handling below when connectivity can't be determined.
  if (!(await isOnline())) {
    throw new DictionaryError(
      ErrorType.NETWORK,
      'You appear to be offline. Please check your internet connection and try again.'
    );
  }

  try {
    const response = await client.get(`/${encodeURIComponent(word)}`);
    return normalizeEntries(response.data, word);
  } catch (error) {
    if (error instanceof DictionaryError) throw error;

    const isAxios = error?.isAxiosError || (axios.isAxiosError && axios.isAxiosError(error));
    if (isAxios) {
      if (error.response) {
        if (error.response.status === 404) {
          throw new DictionaryError(
            ErrorType.NOT_FOUND,
            `No definitions found for “${word}”. Please check the spelling and try again.`
          );
        }
        throw new DictionaryError(
          ErrorType.SERVER,
          `The dictionary service returned an error (${error.response.status}). Please try again shortly.`
        );
      }
      if (error.code === 'ECONNABORTED') {
        throw new DictionaryError(
          ErrorType.TIMEOUT,
          'The request took too long. Check your connection and try again.'
        );
      }
      throw new DictionaryError(
        ErrorType.NETWORK,
        'Unable to reach the dictionary. Please check your internet connection and try again.'
      );
    }

    throw new DictionaryError(ErrorType.UNKNOWN, 'Something went wrong. Please try again.');
  }
}
