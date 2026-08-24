# dsh-pattern-search

Regex pattern search for the current DSH conversation: a `/pattern-search` floating window plus a model-invokable `pattern_search` session tool. Search assistant text, reasoning, user messages and tool results with a regular expression, and get match statistics plus a paginated, highlighted detail table. Built to make behaviors like the model's "Actually, wait, let me …" phrasings countable and observable.

## Install

```bash
dsh plugin --profile web add github:yzhangjy/dsh-pattern-search
```

Restart `dsh web` and hard-refresh the browser.


## Update

```bash
dsh plugin --profile web up dsh-pattern-search
```

Restart `dsh web` and hard-refresh the browser. If the profile pins a commit, reinstall instead:

```bash
dsh plugin --profile web remove dsh-pattern-search
dsh plugin --profile web add github:yzhangjy/dsh-pattern-search
```

## Features

- **`/pattern-search` command** — a client-owned '/' trigger source: opens a floating window, **no host round-trip, no session-log records, nothing model-visible** (leaves no trace).
- **Regex with flags** — `i` / `s` / `m` toggles (`g` always on), inline errors for invalid patterns, explicit Search button (never auto-searches while typing).
- **Stats** — total matches, unique matched strings, hit turns / hit messages with window denominators, message-based hit rate, per-source and per-turn breakdowns (hover ⓘ explains each metric).
- **Paginated table** — bordered table with header, 10/20/50/100 rows per page, `<mark>`-highlighted matches with ±60-char context.
- **Partial toggle** — include the in-flight streaming output (a snapshot at search time).
- **Theme-native** — every color resolves from the dsh web `--dsw-alias-*` tokens, so the window follows the app's day/night theme.
- **`pattern_search` session tool** — the same search logic as a host-side tool the model can invoke on the current session's durable event log, for in-session self-observation.


## Usage

**In the GUI:** type `/pattern-search` + Enter → the window opens → paste a pattern (e.g. `Actually,?\\s*wait,?\\s*let me\\b` — `i` is on by default) → click **Search**.

**By the model:** call the `pattern_search` tool:

```json
{ "pattern": "Actually,?\\s*wait,?\\s*let me\\b", "flags": "i", "source": "assistant", "context": 60, "limit": 20 }
```

## Stat semantics

- **窗口内轮数 / 窗口内消息数** — the client snapshot keeps only a recent *window* of the conversation; early turns of a long session are outside it and not counted.
- **命中率 = 命中消息数 ÷ 窗口内消息数** — message-based, window-scoped.
- **去重匹配串** — distinct matched strings, counted once each, **case-sensitive** (with `i` on, `wait`/`Wait`/`WAIT` still count separately).

## Development

```bash
npm install          # dev deps (tsdown, typescript, react types, dsh type packages)
npm run build        # tsdown → lib/index.js (host) + lib/client.js (browser bundle)
npm test            # vitest (shared search core, extraction, worker parity)
npm run register     # dsh plugin --profile web add . (after build)
```

Rebuilt client bundles are served by the running app immediately — a hard refresh (Cmd+Shift+R) is enough; no server restart is needed for client-only changes. Host-half changes (the tool) need a restart.

## Architecture

```
src/
├── host/
│   ├── index.ts        # registers the pattern_search session tool (defineTool)
│   └── search.ts       # core search over the session event log
└── client/
    ├── index.ts        # client plugin body: command + window registration
    ├── command.ts      # /pattern-search inputTriggers source
    ├── store.ts        # window/result state + page size
    ├── extract.ts      # ConversationSnapshot → searchable text segments
    ├── search.ts       # regex execution (client side)
    ├── stats.ts        # statistics (window-scoped)
    ├── i18n.ts         # zh/en dictionaries
    └── ui/             # PatternWindow + ResultList (theme-native)
```

The design document lives in [PRD.md](./PRD.md).

## License

MIT
