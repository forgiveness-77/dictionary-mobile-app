# LexiTech — Dictionary Mobile App

A cross-platform (Android + iOS) dictionary app built with **React Native + Expo**.
Search English words and view definitions, parts of speech, examples, synonyms/antonyms,
and listen to pronunciations — powered by the [Free Dictionary API](https://dictionaryapi.dev).

> **Authentication:** Intentionally **not** included. None of the required features need an
> account (history and bookmarks are stored locally), so auth was deferred. The app is
> structured so a login/signup module can be added later without rework.

---

## Tech stack

| Concern         | Choice                                              |
| --------------- | --------------------------------------------------- |
| Framework       | React Native (Expo SDK 56)                          |
| HTTP client     | **axios**                                           |
| Navigation      | React Navigation — Drawer + Bottom Tabs + Native Stack |
| Audio           | `expo-audio`                                        |
| Icons           | `@expo/vector-icons` (Material Icons)               |
| State           | React Context (`HistoryContext`, `BookmarksContext`)|
| Design system   | LexiTech tokens in `src/theme` (`#007aff`, Inter scale) |
| Testing / dev   | Expo CLI (`npx expo start`)                         |

---

## Architecture

```
App.js
  GestureHandlerRootView › SafeAreaProvider › HistoryProvider › BookmarksProvider
        │
   AppNavigator
   └── Drawer.Navigator (custom DrawerContent = search history + clear)
         └── Bottom Tabs
               ├── Search  ─ Stack( SearchHome → WordDetail )
               ├── History ─ Stack( HistoryHome → WordDetail )
               └── Saved   ─ Stack( SavedHome → WordDetail )
```

- **WordDetail is registered in every tab's stack**, so the bottom bar stays visible on
  the detail screen and any entry point (search, history, saved, drawer) reuses it.
- **The detail screen owns the fetch.** Search/History/Saved/Drawer all just
  `navigate('WordDetail', { word })`; the detail screen handles loading, errors, retry,
  records history, and exposes the bookmark toggle. One code path, many entry points.

**Layers**

- `api/` — axios + normalization. `getWordData(word)` resolves to a normalized object or
  throws a typed `DictionaryError`.
- `utils/` — pure input validation.
- `context/` — search history and bookmarks (dedupe, most-recent-first).
- `hooks/useWordAudio.js` — owns one audio player; picks a preferred accent, plays any.
- `screens/` — orchestration (loading / error / success).
- `components/` — reusable presentational UI.
- `theme/` — design tokens (colors, spacing, radii, typography, shadows).

---

## Data flow (search)

1. User types a word → `SearchScreen` → `validateSearchTerm()` (non-empty, letters only).
2. Navigate to `WordDetail` with `{ word }`.
3. Detail shows a loading indicator and calls **axios GET**
   `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`.
4. Response is **normalized** to `{ word, phoneticText, audios[], meanings[], sourceUrls[] }`.
5. Word is added to history; the screen renders the hero + meaning cards.
6. On failure, a typed error maps to a friendly message + **Try again**.

## API

| Method | Endpoint                                                  | Purpose             |
| ------ | -------------------------------------------------------- | ------------------- |
| GET    | `https://api.dictionaryapi.dev/api/v2/entries/en/{word}` | Look up a word      |

Handled: `200`, `404` (not found), network errors, timeouts, server errors, malformed payloads.

---

## Screens

| Screen          | Activity | Responsibilities                                                      |
| --------------- | -------- | -------------------------------------------------------------------- |
| **Search**      | 1, 5     | Brand, validated input, navigate to detail                           |
| **Word Detail** | 1, 2, 3, 5 | Fetch + loading + errors + retry; word, phonetics, meanings, examples, synonyms/antonyms, audio, bookmark toggle |
| **History**     | 4        | Tab list of searched words; tap to re-open; remove / clear all       |
| **Saved**       | —        | Tab list of bookmarked words; tap to open; remove / clear all        |
| **Drawer**      | 4        | Brand, search-history list, clear history                            |

## Validation

- Search field cannot be empty; must start with a letter; letters/space/hyphen/apostrophe only; max 50 chars.
- Invalid input shows an inline message and never hits the network.

## Error handling

| Situation            | Behavior                                                  |
| -------------------- | --------------------------------------------------------- |
| Word not found (404) | "Word not found" state with **Try again**                 |
| No network / timeout | Friendly message with **Try again**                       |
| Server error (5xx)   | "Service unavailable" with **Try again**                  |
| Malformed response   | Guarded parsing — app never crashes                       |
| Audio playback fails | Inline banner; the rest of the screen keeps working       |
| No audio available   | Pronunciation button is hidden                            |

---

## Project structure

```
App.js                      Providers + gesture root
index.js                    Entry (imports react-native-gesture-handler first)
src/
  api/dictionaryApi.js      axios client, getWordData(), normalize, DictionaryError
  utils/validation.js       Input validation + capitalize
  context/
    HistoryContext.js       Search history
    BookmarksContext.js     Saved words
  hooks/useWordAudio.js     Pronunciation player (expo-audio)
  navigation/
    AppNavigator.js         Drawer › Tabs › Stacks
    DrawerContent.js        Custom drawer (history)
  screens/
    SearchScreen.js  WordDetailScreen.js  HistoryScreen.js  SavedScreen.js
  components/
    SearchBar.js  PrimaryButton.js  Loading.js  StatusView.js
    WordHeader.js  MeaningCard.js  WordListRow.js  TabBarIcon.js
  theme/index.js            LexiTech design tokens
```

> **Note:** This project relies on Expo's default Babel config. Do **not** add a
> `babel.config.js` with `presets: ['babel-preset-expo']` — in this install
> `babel-preset-expo` is nested under `expo/node_modules` and isn't resolvable from the
> project root, which breaks bundling. Expo's transformer applies the preset (and the
> Reanimated/worklets plugin) automatically.

---

## Running the app

```bash
npm install            # if dependencies aren't installed yet
npx expo start         # then press 'a' (Android), 'i' (iOS), or scan the QR in Expo Go
```

- Android: `npm run android`
- iOS (macOS): `npm run ios`

> **Fonts:** The design specifies Inter; the app currently uses the system sans-serif at
> the same sizes/weights for reliability. Inter can be wired in via
> `@expo-google-fonts/inter` if pixel-exact type is required.
```
