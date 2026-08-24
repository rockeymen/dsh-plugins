**English** · [**简体中文**](README-CN.md)

# dsh-stats-hud

A sci-fi HUD for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): the session's stats become game-style level bars in a **vertical column fixed to the far right edge** of the web UI — without touching the original stats line.

![screenshot](docs/screenshot.png)

## Instruments (all-English, LLM terminology)

### Instrument · Data · Full scale · Past full scale
- **Instrument**: `CLOCK` badge · **Data**: Local time (24h) + `DS API PEAK` / `DS API OFF PEAK` rate · **Full scale**: Peak = Mon–Fri Beijing 09:00-12:00 / 14:00-18:00 (i.e. Mon–Fri 01:00-04:00 / 06:00-10:00 UTC); weekends and all other hours are OFF-PEAK (half price) · **Past full scale**: PEAK orange tint, OFF-PEAK green tint
- **Instrument**: `STEPS / TURN` rolling rows · **Data**: Steps / turns as odometer drums (like the CONTEXT rows) · **Full scale**: — · **Past full scale**: Drums spin up on mount, roll on change
- **Instrument**: `LLM / TOOLS` dual bar · **Data**: Two columns (labels over values), bar segments = raw LLM:TOOLS time ratio · **Full scale**: No cap — 2:1 time means 2:1 bar · **Past full scale**: —
- **Instrument**: `THROUGHPUT` gauge · **Data**: tokens/s (throughput), centered title, combined centered readout (`146 tok/s`) · **Full scale**: Redline auto-scales 200→300→400… (arc ticks follow) · **Past full scale**: —
- **Instrument**: `CONTEXT USAGE` bar · **Data**: Context-window usage % with 3 segments: Sys Prompt (gray) / Tools (blue) / Messages (purple) by token ratio · **Full scale**: 0-100% · **Past full scale**: ≥80% whole bar turns solid red; hover shows the three token counts
- **Instrument**: `CACHE HIT` bar · **Data**: Cache-hit % · **Full scale**: 0-100% · **Past full scale**: <50% red, <80% yellow, ≥80% green
- **Instrument**: `CONTEXT` rolling counter · **Data**: Three odometer rows: CACHE HIT (green) / CACHE MISSED (orange) / OUTPUT (pink) · **Full scale**: Drums spin up from 0 on mount; digits roll up on increase (carry 9→0), down on decrease · **Past full scale**: —

While the agent is running the whole panel breathes and bars pulse.

Hovering the `CONTEXT USAGE` bar pops up a tooltip with the token breakdown:

![hover tooltip](docs/mouse_over.png)

## Responsive layout

The HUD adapts to the free space right of the chat column (measured live with a ResizeObserver, so sidebar drags, the details drawer and window resizes all count):

### Tier · Condition · Shows
- **Tier**: `full` · **Condition**: Window ≥ 800px and free space ≥ 180px · **Shows**: Everything
- **Tier**: `mini` · **Condition**: Window ≥ 800px and free space < 180px · **Shows**: Clock (short PEAK/OFF PEAK badge) + compact rolling rows (Step/Turn/HIT/MISS/OUT)
- **Tier**: `hidden` · **Condition**: Window < 800px · **Shows**: Nothing (element stays mounted, `display:none`)

The window width is a hard floor: below 800px the panel hides even with room to spare, and only the measured space decides `full` vs `mini` (the full panel needs 164px + 12px margin). `mini` may slightly overlap the chat on narrow windows — safe because the panel is click-through. If the chat column can't be measured, the panel falls back to `full`.

The `mini` tier in a narrow window:

![mini tier](docs/mini.png)

## Requirements

- DeepSeek Harness `dsh` (tested on 0.1.0-rc.6, macOS)
- pnpm (for plugin management)

## Install

```sh
# from a local checkout
dsh plugin --profile web add /path/to/dsh-stats-hud

# or straight from GitHub
dsh plugin --profile web add https://github.com/lauytgary/dsh_hud_plugin
```

Then **restart `dsh web`** (loader entries are scanned at boot) and refresh the page. The package is installed as a `link:` dependency — after editing `lib/client.js` locally, only a restart is needed, no reinstall.

The plugin then shows up in **Settings → Plugins**:

![dsh-stats-hud in the plugin list](docs/plugin_eng.png)

## Uninstall

```sh
dsh plugin --profile web remove dsh-stats-hud
```

## How it works

- Registers into the `conversation.composer.dock` slot (id `dsh-stats-hud`, order 1) — **only to receive the session-scoped hooks** (`useSession`/`useProjection`); the panel itself is `position: fixed`, takes no layout space, and the stock stats line stays untouched.
- Data comes from the same projections the stock UI uses: `useProjection("sessionStats")`, `useProjection("tokenUsage")`, `useProjection("contextPressure")` and `useProjection("contextBreakdown")` — zero host-side changes.
- `exports.inject = ["slots"]` is mandatory: DSH's ctx is a strict proxy, and accessing an undeclared service throws (`cannot get property "locale" without inject`).
- The panel is `pointer-events: none` (click-through); only the CONTEXT USAGE bar re-enables pointer events so its hover tooltip works.

## Files

```
dsh-stats-hud/
├── package.json          # dsh.bundle (patch layer) + dsh.client (browser entry)
├── cordis.patch.yml      # inserts the plugin into loader entries
├── lib/
│   ├── index.js          # host-side no-op (pure browser plugin)
│   └── client.js         # browser bundle: HUD components + slot registration
└── test/
    └── format.test.js    # pure-function unit tests (node:test, zero deps)
```

`lib/client.js` is a hand-written loader bundle (`window.__ModuleLoader__.load`) — no build step needed.

## Development & testing

```sh
npm test   # pure-function unit tests (node:test, no dependencies; Node ≥ 18)
```

The tests load `lib/client.js` in a Node VM with a stubbed loader (no DOM
needed) and exercise the pure helpers — `formatTokens`, `formatDuration`,
`formatTps`, `tierOf`, `billedInputTokens`, `cacheHitPercent`. The test-only
`__test` export is gated behind the `DSH_HUD_TEST` env var, so the browser
bundle is unaffected.

## Tuning

All constants live in `lib/client.js`:

- Labels: the `L` object (all-English LLM terminology)
- Peak hours: `LocalClock` delegates to `isDsApiPeak(date)`, which checks the Beijing (UTC+8) weekday `bjDow >= 1 && bjDow <= 5` (Mon-Fri) together with `bjMin >= 540 && bjMin < 720` (9-12h) / `>= 840 && < 1080` (14-18h), where `bjMin`/`bjDow` come from `new Date(date.getTime() + 8*3600e3)` — weekends are always off-peak
- `MissionRolling`: rolling drums for steps/turns (no full scale)
- `ChannelBar`: segment ratio = `llmMs / (llmMs + toolMs)` (no cap)
- `SpeedGauge`'s `redline = 200` (initial; auto-scales in 100 tok/s steps)
- `ContextUsageBar`: segment colors and the ≥80% solid-red threshold; the hover tooltip reads `systemTokens` / `toolsTokens` / `messageTokens` from the `contextBreakdown` projection
- Rolling counter: `DRUM` (3× 0-9), `DRUM_H = 15` (px per digit), `RollingValue`'s carry/borrow formula and mount spin-up
- CSS: `position:fixed; right:12px`; tiers in `tierOf(space, width)` — `width < 800` → `hidden` (window-width floor), `space >= 180` → `full`, else `mini` (measurement failure falls back to `full`) — plus the `.gsh-root.gsh-*` rules; `@media (prefers-reduced-motion: reduce)` disables pulses and transitions

## Publishing to npm (optional)

```sh
# remove "private": true from package.json, then
npm publish
# users install with:
dsh plugin --profile web add dsh-stats-hud
```

## Contact

Questions, ideas or issues? Open a discussion on GitHub:

- [Discussions](https://github.com/lauytgary/dsh_hud_plugin/discussions)