# dsh-deepseek-usage

A DeepSeek Harness plugin that shows **real-time DeepSeek API usage**.

- 💰 **Account balance** — polls the DeepSeek `/user/balance` endpoint (default every 30s): total / granted / topped-up balance and availability
- 📊 **Usage stats** — real-time request counts and tokens (input / output / cache-read / cache-write / reasoning) via the `llm/stream` waterfall, in three windows: total / today / last-60s
- 💸 **Estimated cost** — per-model pricing (built-in `deepseek-chat` / `deepseek-reasoner` table, overridable via config)
- 🖥️ **Web UI dock** — a live stats line under the composer (`conversation.composer.dock`), auto-refresh + manual refresh
- ⚠️ **Low-balance alerts** — dock turns amber below the threshold (default 20) and red below threshold/5, with one browser notification per threshold crossing (only when notification permission is already granted)
- 📋 **Settings usage panel** — `settings.section` seat: balance card, three-window usage, per-model pricing table, and a **per-session usage table** (with session titles)
- 🛠️ **Model tool** — `deepseek_usage`, so the agent can query balance and usage on demand

## Install

### From GitHub (recommended)

```sh
dsh plugin --profile web add github:yyb16yyb-hub/dsh-deepseek-usage
```

⚠️ **First install requires build authorization**: pnpm ≥ 10 refuses to run `prepare` scripts of git-hosted dependencies (the plugin builds `lib/` from source at install time). The first `add` fails with a hint — copy the exact package key pnpm prints into that profile's `pnpm-workspace.yaml`, then re-run:

```yaml
allowBuilds:
  dsh-deepseek-usage: true
```

Pin a commit for reproducible installs: `dsh plugin --profile web add github:yyb16yyb-hub/dsh-deepseek-usage#<sha>`.

### Local directory / tarball

```sh
dsh plugin --profile web add /path/to/dsh-deepseek-usage     # local dir (pre-built lib/)
dsh plugin --profile web add ./dsh-deepseek-usage-0.1.0.tgz  # pnpm pack output
```

**Restart `dsh web`** after installing — the client module table is scanned at boot.

Uninstall:

```sh
dsh plugin --profile web remove dsh-deepseek-usage
```

## Configuration

The API key is resolved in this order (re-resolved on every poll, so changes take effect immediately):

1. Plugin config `apiKey`
2. **The dsh credentials seam** (`ctx.credentials`): process env → `~/.dsh/.credentials.yaml` → project `.env` → user `.env`. A DeepSeek key entered on the Web Settings → Models page lands in `~/.dsh/.credentials.yaml`, which this plugin picks up automatically — **no extra config needed**
3. A stored `apiKey` in the registered `llm-deepseek` settings section (if any)

Override the plugin row in the profile's `cordis.patch.yml` to configure:

```yaml
- id: deepseek-usage
  config:
    apiKeyEnv: DEEPSEEK_API_KEY
    pollIntervalMs: 60000      # balance poll interval (ms, min 5000)
    showBalance: true
    showTokens: true
    showCost: true
    alertThreshold: 20         # low-balance alert threshold (account currency; 0 = off)
    maxSessions: 200           # max sessions kept in the per-session drill-down
    pricing:
      deepseek-chat:
        input: 2               # ¥ / 1M tokens
        output: 3
        cacheRead: 0.5
      deepseek-reasoner:
        input: 4
        output: 16
        cacheRead: 1
```

> Cost is an **estimate**: the built-in pricing table reflects common public pricing — always check the latest official DeepSeek prices, and override via `pricing`.

## Web UI

- **Composer dock** — balance · today's requests · tokens · estimated cost · last-updated time, auto-refresh every 30s (follows the host `pollIntervalMs`), with a manual refresh button.
- **Low-balance alert** — below `alertThreshold` the dock turns amber with a ⚠ mark, below threshold/5 it turns red; crossing the threshold fires one browser notification (only when `Notification.permission === 'granted'` — the plugin never prompts for permission).
- **Settings → "DeepSeek usage" panel** (open the settings panel from the sidebar): balance card (total/granted/topped-up/status), three-window usage, per-model pricing & usage table, and a **per-session usage table** (session title, requests, input/output/cache tokens, last used).

Data comes from the same-origin endpoint `GET /dsh-deepseek-usage` (`?refresh=1` forces a balance re-poll). The API key stays on the host side and never reaches the browser.

## Model tool

The agent can call `deepseek_usage`:

- no arguments: balance + usage summary for all windows
- `scope`: `total` / `today` / `rolling` to pick a window

## Development

```sh
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm build       # esbuild → lib/index.js (host half) + lib/client.js (browser half)
```

### Structure

```
src/
├── index.ts        # host half: apply(), llm/stream hook, deepseek_usage tool, HTTP route
├── balance.ts      # DeepSeek /user/balance client + poller
├── stats.ts        # usage tracking (total/today/rolling windows, per-model, per-session)
├── config.ts       # schemastery config schema
└── client/
    ├── index.ts    # browser half: locale + composer.dock / settings.section registration
    ├── api.ts      # shared: payload types, fetch, formatters, alert level
    ├── UsageDock.tsx            # composer dock (with low-balance alert)
    ├── UsageSettingsSection.tsx # settings usage panel (balance/usage/pricing/sessions)
    └── locales.ts  # zh/en dictionaries
```

### Build notes

- The host half keeps `@deepseek-ai/*` external so they resolve from the profile's `node_modules` (single cordis runtime identity)
- The browser half externals match the platform module table in `packages/client/web/src/platform.ts` (react, cordis, slots, …); everything else is inlined, and the artifact is wrapped in `window.__ModuleLoader__.load({ id, factory })` for the web shell's module loader

## Security

Balance polling uses the same API key as LLM requests; the key is never sent to the browser. As with any third-party plugin, review the source before installing.