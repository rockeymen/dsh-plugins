# 🌊 dsh-usage

A **persistent floating dock**, a **fully customizable balance / token-usage panel**, an **activity heatmap**, and a **dual-channel usage comparison** for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI (`dsh web`).

## ✨ Feature tour

### 🌊 Persistent dock

Your key numbers stay visible at all times — balance glows green (red only when out of credit), rows are separated by hairlines, and a settings gear plus one-click refresh sit in the corner. When the sidebar collapses, the dock folds into a tiny balance pill.

![dsh-usage dock](docs/images/dock.png)

- 🟢 **Balance** — green when healthy, red when drained
- 📊 **Today / Month / Cache hit** — glanceable token stats
- ⚙ **Gear** opens the panel · ↻ refresh re-queries instantly
- 🧲 **Mirrors your pins** — every change applies immediately

### 🎛️ Detail panel — all seven widgets

A two-column card layout; every widget has a detail and a compact form, and can be drag-reordered, collapsed, hidden, or pinned.

### Widget · What it does
- **Widget**: 💳 **Balance** · **What it does**: Big number on the left, available / topped-up / granted rows on the right; provider switchable
- **Widget**: 📊 **Today** · **What it does**: Today's tokens plus input / output / cache-read breakdown
- **Widget**: 📈 **This month** · **What it does**: Monthly tokens plus the same breakdown
- **Widget**: 🎯 **Cache hit** · **What it does**: Today's and all-time cache hit rates
- **Widget**: ↔️ **Channel share** · **What it does**: DSH channel vs Claude Code channel ratio bar
- **Widget**: 📜 **Usage log** · **What it does**: Last 14 days per-day list, click to drill into per-model detail
- **Widget**: 🔥 **Activity heatmap** · **What it does**: 28-day × 6-band dot grid (dates across, 0–24h down)

![dsh-usage panel](docs/images/panel.png)

### 🎨 Everything customizable

Accent (presets + color picker), background, and panel opacity are adjustable live. Drag-reorder, pin, collapse, hide — every number presents your way, echoing DeepSeek Harness's "everything is a plugin" spirit.

![dsh-usage customizer](docs/images/customizer.png)

## At a glance

###  · Feature · Notes
- 💳 · **Feature**: Persistent dock · **Notes**: Pinned compacts always visible; collapses into a balance pill when the sidebar folds
- 🎨 · **Feature**: Everything customizable · **Notes**: Widgets: pin / collapse / hide / drag-reorder with a dashed placeholder and glide animation; accent, background, opacity; persisted in localStorage
- 📊 · **Feature**: Balance & usage panel · **Notes**: Provider picker, balance breakdown, today/month totals in k/M/B units, cache hit, usage log with per-model drilldown
- 🔥 · **Feature**: Activity heatmap · **Notes**: GitHub-style dots: 28 days × 6 four-hour bands with date labels
- ↔️ · **Feature**: Channel share · **Notes**: DSH channel vs Claude Code channel (incremental JSONL aggregation of `~/.claude/projects`)
- 🔄 · **Feature**: Background refresh · **Notes**: Refresh at startup, then every 5 minutes: balances, DSH tokens, Claude Code aggregation
- 🔒 · **Feature**: Local-only security · **Notes**: Three loopback-only GET endpoints; credentials resolved server-side; upstream forced HTTPS with DNS pinning; Claude logs aggregate numbers only — message text never leaves the machine

UI supports Chinese and English. Credentials come from Harness's `~/.dsh/.credentials.yaml`; the plugin never reads, caches, or echoes secrets.

## Quick start

Requires a DeepSeek Harness `web` profile (`@deepseek-ai/dsh >= 0.1.0-rc.6`).

```bash
dsh plugin --profile web add "github:Aisland-SJL/dsh-usage"
```

Restart `dsh web`, hard-refresh the browser, and the dock appears at the bottom-left. Update / remove:

```bash
dsh plugin --profile web update dsh-usage
dsh plugin --profile web remove dsh-usage
```

## Credentials

Balance providers read credential references from `~/.dsh/.credentials.yaml`:

```yaml
DEEPSEEK_API_KEY: sk-your-key-here            # official DeepSeek route
OPENROUTER_MANAGEMENT_KEY: sk-or-v1-...       # OpenRouter account (Management Key, not the inference key)
ZAI_API_KEY: your-zai-key                     # Z.ai open platform
```

Moonshot / Kimi profiles under `llm-pi-ai` are discovered automatically and reuse their `apiKeyEnv`. Providers without a public balance API show an explicit "no public balance interface" state — never a guess.

## Supported providers

### Provider · Upstream endpoint · Default credential ref
- **Provider**: DeepSeek · **Upstream endpoint**: `GET {origin}/user/balance` · **Default credential ref**: `DEEPSEEK_API_KEY`
- **Provider**: OpenRouter · **Upstream endpoint**: `GET {origin}/api/v1/credits` · **Default credential ref**: `OPENROUTER_MANAGEMENT_KEY`
- **Provider**: Moonshot / Kimi · **Upstream endpoint**: `GET {origin}/v1/users/me/balance` · **Default credential ref**: pi-ai provider `apiKeyEnv`
- **Provider**: Z.ai / GLM · **Upstream endpoint**: `GET {origin}/api/paas/v4/balance` · **Default credential ref**: `ZAI_API_KEY`

## API

### Method · Path · Response
- **Method**: `GET` · **Path**: `/api/usage/providers` · **Response**: Provider list, balance scheme, and status summary
- **Method**: `GET` · **Path**: `/api/usage/balance?provider=` · **Response**: Unified balance snapshot; `refresh=1` forces an upstream query
- **Method**: `GET` · **Path**: `/api/usage/usage` · **Response**: Per-day/per-model token aggregates, cache hit rates, 24-hour buckets (`days[].hours`), and the Claude Code channel (`claude`)

Non-GET requests get `405`, non-loopback callers get `403`; every response is JSON with `Cache-Control: no-cache`.

## Development & testing

```bash
npm install           # react/react-dom/jsdom for offline tests only
npm run check         # syntax checks for every module and script
npm test              # 81 offline tests: balance schemes, token folding, server boundary, client, e2e flows, Claude aggregation
```

Tests are fully offline — no network, and the real `~/.dsh` is never touched (server tests redirect `DSH_HOME` to a temp dir). Dry-run the real Claude data: `node scripts/validate-claude.mjs`.

## Privacy & security

- API keys never enter browser responses, plugin caches, or logs; they are resolved at request time through Harness's credentials seam.
- Upstream balance queries: HTTPS enforced, DNS pre-resolved and private/loopback ranges rejected, connections pinned to the checked address (DNS-rebinding defense), 1 MiB response cap, 15 s timeout.
- Usage caches under `~/.dsh/storages/` hold only aggregated token numbers and fold cursors — no prompts, no replies.
- Claude Code logs are parsed line-by-line and discarded; only aggregated numbers reach the cache.
- Do not expose these endpoints through a reverse proxy to LAN or the public internet.

## Credits

- [Ychris12138/dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) (MIT): reference for balance schemes, token folding semantics, bundle plugin structure, and the security boundary.