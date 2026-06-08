# LexiTech — Dictionary Mobile App

A cross-platform (Android + iOS) dictionary app built with **React Native + Expo**.
Search English words and view definitions, parts of speech, examples, synonyms/antonyms,
listen to pronunciations, and keep a local history and bookmarks — powered by the
[Free Dictionary API](https://dictionaryapi.dev).

> **Design docs (DFD, architecture, endpoints, pages):** see [DESIGN.md](DESIGN.md).
>
> **Authentication** is intentionally **not** included — no required feature needs an
> account (history and bookmarks are stored locally). It can be added later as a module.

---

## Features

- 🔎 **Search** with input validation and **history-backed suggestions** (recent + matches).
- 📖 **Word detail**: prominent word, phonetics, every part of speech, all definitions,
  examples, and synonym/antonym chips. Handles multiple meanings & long text.
- 🔊 **Pronunciation player**: play / pause / **stop** + a **seekable progress bar** with
  time, an inline speaker by the phonetics, and accent switching (US/UK) when available.
- 🕘 **History** & 🔖 **Saved** tabs — each row shows a short description; tap to re-open,
  swipe-free remove, or clear all. Both **persist across restarts** (AsyncStorage).
- 🧭 **Drawer + bottom tabs** (Search · History · Saved) with an active-tab highlight.
- ⚠️ **Robust errors**: word-not-found, offline (proactive + reactive), timeout, server,
  and malformed responses — all friendly states with retry; never crashes.

---

## Tech stack

| Concern         | Choice                                                  |
| --------------- | ------------------------------------------------------- |
| Framework       | React Native (Expo SDK 56)                              |
| HTTP client     | **axios**                                               |
| Navigation      | React Navigation — Drawer + Bottom Tabs + Native Stack  |
| Audio           | `expo-audio`                                            |
| Icons           | `@expo/vector-icons` (Ionicons)                         |
| Connectivity    | `@react-native-community/netinfo`                       |
| Persistence     | `@react-native-async-storage/async-storage`            |
| State           | React Context (`HistoryContext`, `BookmarksContext`)    |
| Testing / dev   | Expo CLI (`npx expo start`)                             |

---

## Project structure

```
App.js                      Providers + gesture root
index.js                    Entry (imports react-native-gesture-handler first)
app.json                    Expo config (name/icon/splash = LexiTech brand)
src/
  api/dictionaryApi.js      axios client, getWordData(), normalize, DictionaryError
  utils/
    validation.js           Input validation + capitalize
    network.js              isOnline() connectivity check (NetInfo, optional)
  context/
    HistoryContext.js       Search history (persisted)
    BookmarksContext.js     Saved words (persisted)
  hooks/
    useWordAudio.js         Pronunciation transport + progress (expo-audio)
    usePersistentState.js   AsyncStorage-backed state (hydration-safe)
  navigation/
    AppNavigator.js         Drawer › Tabs › Stacks
    DrawerContent.js        Custom drawer (history)
  screens/
    SearchScreen.js  WordDetailScreen.js  HistoryScreen.js  SavedScreen.js
  components/
    SearchBar.js  PrimaryButton.js  Loading.js  StatusView.js
    WordHeader.js  AudioPlayer.js  MeaningCard.js  WordListRow.js
    TabBarIcon.js  Icons.js
  theme/index.js            Design tokens (#007aff, Inter-scale)
```

> **Note:** Do **not** add a `babel.config.js` with `presets: ['babel-preset-expo']` —
> in this install `babel-preset-expo` is nested under `expo/node_modules` and isn't
> resolvable from the project root, which breaks bundling. Expo's transformer applies
> the preset (and the Reanimated/worklets plugin) automatically.

---

## Running the app

```bash
npm install            # if dependencies aren't installed yet
npx expo start         # then press 'a' (Android), 'i' (iOS), or scan the QR in Expo Go
```

- Android: `npm run android`  ·  iOS (macOS): `npm run ios`
- Verified on the Android emulator (Expo Go). iOS shares the same JS and is expected
  to behave identically, but was not run here (no macOS available).

## Notes / follow-ups

- The app icon & splash use the placeholder Expo art with LexiTech brand colors —
  swap `assets/icon.png` for a LexiTech logo for a fully branded build.
- Fonts use the system sans-serif at the design's exact scale; Inter can be wired in
  via `@expo-google-fonts/inter` for pixel-exact type.
