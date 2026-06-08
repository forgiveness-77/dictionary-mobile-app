# LexiTech — System Architecture & Data Flow

Design deliverable for the Dictionary Mobile App: the **system architecture**
(layered view, runtime navigation, search sequence) and the **data flow
diagrams** (Level 0 context, Level 1, and a Level 2 detail of the search
process). Diagrams use Mermaid and render on GitHub / VS Code.

---

## 1. System Architecture

### 1.1 Layered architecture

The app is a layered client: **Presentation → State → Hooks → Domain/Logic →
External services**. Each layer only depends on the layer beneath it.

```mermaid
flowchart TB
    subgraph PRES["Presentation layer"]
        NAV["Navigation<br/>Drawer › Tabs › Stacks"]
        SCR["Screens<br/>Search · WordDetail · History · Saved"]
        CMP["Components<br/>SearchBar · AudioPlayer · MeaningCard · …"]
        THM["Theme<br/>ThemeProvider (light / dark)"]
    end

    subgraph STATE["State layer (React Context)"]
        HIST["HistoryContext"]
        BM["BookmarksContext"]
    end

    subgraph HOOKS["Hooks"]
        UWA["useWordAudio"]
        UPS["usePersistentState"]
    end

    subgraph LOGIC["Domain / logic layer"]
        DAPI["api/dictionaryApi<br/>axios · normalize · typed errors"]
        VAL["utils/validation"]
        NETU["utils/network"]
    end

    subgraph EXT["External services"]
        API["Free Dictionary API"]
        AS["AsyncStorage (device)"]
        NET["NetInfo (connectivity)"]
        AUD["expo-audio (native player)"]
    end

    NAV --> SCR
    SCR --> CMP
    THM --> PRES

    SCR --> VAL
    SCR --> DAPI
    SCR --> HIST
    SCR --> BM
    SCR --> UWA

    UWA --> AUD
    DAPI --> NETU
    NETU --> NET
    DAPI --> API

    HIST --> UPS
    BM --> UPS
    THM --> UPS
    UPS --> AS
```

### 1.2 Module responsibilities

| Layer          | Module(s)                                              | Responsibility                                            |
| -------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| Presentation   | `navigation/`, `screens/`, `components/`               | Render UI, capture input, route between screens           |
| Presentation   | `theme/` (`ThemeProvider`, `useTheme`)                 | Light/dark tokens; re-themes the whole tree               |
| State          | `context/HistoryContext`, `BookmarksContext`           | App-wide history & bookmarks (deduped, persisted)         |
| Hooks          | `hooks/useWordAudio`                                   | Pronunciation transport + progress over `expo-audio`      |
| Hooks          | `hooks/usePersistentState`                             | AsyncStorage-backed state (hydration-safe)                |
| Domain / logic | `api/dictionaryApi`                                    | Build request, call API, normalize JSON, map typed errors |
| Domain / logic | `utils/validation`                                     | Validate the search term (single word, letters)           |
| Domain / logic | `utils/network`                                        | Proactive connectivity check                              |
| External       | Free Dictionary API, AsyncStorage, NetInfo, expo-audio | Network data, persistence, connectivity, audio            |

### 1.3 Runtime / navigation structure

```mermaid
flowchart TD
    NC["NavigationContainer<br/>(themed: light / dark)"]
    DRW["Drawer.Navigator<br/>custom DrawerContent = history"]
    TABS["Bottom Tabs"]
    ST1["Search Stack"]
    ST2["History Stack"]
    ST3["Saved Stack"]
    SH["SearchHome"]
    HH["HistoryHome"]
    SVH["SavedHome"]
    WD["WordDetail"]

    NC --> DRW --> TABS
    TABS --> ST1 --> SH
    TABS --> ST2 --> HH
    TABS --> ST3 --> SVH
    ST1 --> WD
    ST2 --> WD
    ST3 --> WD
```

`WordDetail` is registered in **every** tab's stack, so the bottom bar stays
visible on the detail screen and every entry point reuses one screen.

### 1.4 Tech stack

React Native (Expo SDK 56) · React Navigation (Drawer + Bottom Tabs + Native
Stack) · **axios** · `expo-audio` · `@react-native-community/netinfo` ·
`@react-native-async-storage/async-storage` · `@expo/vector-icons` (Ionicons) ·
React Context for state · Expo CLI for dev/testing.

### 1.5 Search sequence (control + data)

```mermaid
sequenceDiagram
    actor U as User
    participant S as SearchScreen
    participant V as validation
    participant D as WordDetailScreen
    participant A as dictionaryApi
    participant N as network / NetInfo
    participant API as Free Dictionary API
    participant H as HistoryContext
    participant ST as AsyncStorage

    U->>S: type word + tap Search
    S->>V: validateSearchTerm(term)
    V-->>S: { valid: true, value }
    S->>D: navigate(WordDetail, { word })
    D->>A: getWordData(word)
    A->>N: isOnline()
    N-->>A: true
    A->>API: GET /entries/en/{word}
    API-->>A: 200 JSON  (or 404 / error)
    A-->>D: normalized data  (or DictionaryError)
    D->>H: addToHistory(word, gloss)
    H->>ST: persist history
    D-->>U: render word · audio · meanings  (or error state)
```

---

## 2. Data Flow Diagrams

**Legend:** `()` rounded = external entity · `(())` circle = process ·
`[( )]` cylinder = data store.

### 2.1 Level 0 — context diagram

```mermaid
flowchart LR
    User(["User"])
    API(["Free Dictionary API"])
    App(("LexiTech<br/>Dictionary App"))

    User -- "search term, taps (play / save / history)" --> App
    App -- "definitions, phonetics, audio, history, saved" --> User
    App -- "GET /entries/en/{word}" --> API
    API -- "JSON: word, phonetics, meanings, audio URLs" --> App
```

### 2.2 Level 1 — processes & data stores

```mermaid
flowchart TD
    User(["User"])
    API(["Free Dictionary API"])

    P1(("1.0<br/>Validate &amp;<br/>capture term"))
    P2(("2.0<br/>Fetch &amp; normalize<br/>word data"))
    P3(("3.0<br/>Render<br/>word details"))
    P4(("4.0<br/>Play<br/>pronunciation"))
    P5(("5.0<br/>Manage history<br/>&amp; bookmarks"))
    P6(("6.0<br/>Apply<br/>theme"))

    D1[("D1  Search History")]
    D2[("D2  Bookmarks")]
    D3[("D3  Theme preference")]

    User -- "raw term" --> P1
    P1 -- "validated word" --> P2
    P2 -- "GET /entries/en/{word}" --> API
    API -- "JSON / 404 / error" --> P2
    P2 -- "normalized word data" --> P3
    P2 -- "word + gloss" --> P5
    P3 -- "definitions, phonetics, examples" --> User
    P3 -- "audio URL + tap" --> P4
    P4 -- "playback state / progress" --> User

    P5 -- "save / read" --> D1
    P5 -- "save / read" --> D2
    D1 -- "recent words + suggestions" --> P3
    D2 -- "saved words" --> P3
    P3 -- "tap history / saved word" --> P2

    User -- "toggle light/dark" --> P6
    P6 -- "save / read" --> D3
    D3 -- "active palette" --> P3
```

### 2.3 Level 2 — process 2.0 "Fetch & normalize word data"

```mermaid
flowchart TD
    In(["validated word"])
    C1(("2.1<br/>Check<br/>connectivity"))
    C2(("2.2<br/>HTTP GET<br/>request (axios)"))
    C3(("2.3<br/>Parse &amp;<br/>normalize JSON"))
    C4(("2.4<br/>Map error<br/>to type"))
    Ok(["normalized word data"])
    Err(["DictionaryError<br/>(NOT_FOUND / NETWORK /<br/>TIMEOUT / SERVER / PARSE)"])
    API(["Free Dictionary API"])

    In --> C1
    C1 -- "offline" --> C4
    C1 -- "online" --> C2
    C2 -- "request" --> API
    API -- "200 JSON" --> C3
    API -- "404 / 5xx / no response" --> C4
    C3 -- "ok" --> Ok
    C3 -- "malformed" --> C4
    C4 --> Err
```

---

## 3. Data stores

| Store | Key                    | Shape                             | Persistence  |
| ----- | ---------------------- | --------------------------------- | ------------ |
| D1    | `@lexitech/history`    | `[{ word, gloss, partOfSpeech }]` | AsyncStorage |
| D2    | `@lexitech/bookmarks`  | `[{ word, gloss, partOfSpeech }]` | AsyncStorage |
| D3    | `@lexitech/theme-mode` | `"light"` \| `"dark"`             | AsyncStorage |

## 4. API / endpoint

| Method | Endpoint                                                 | Purpose        |
| ------ | -------------------------------------------------------- | -------------- |
| GET    | `https://api.dictionaryapi.dev/api/v2/entries/en/{word}` | Look up a word |

Handled responses: `200` (array of entries), `404` (not found), offline,
timeout, server (`5xx`), and malformed payloads — each mapped to a typed
`DictionaryError` and rendered as a friendly state with retry.
