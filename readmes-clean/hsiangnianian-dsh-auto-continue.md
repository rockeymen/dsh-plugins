![dsh-auto-continue](docs/banner.svg)
  

# dsh-auto-continue

  DSH Web UI plugin — when a request is interrupted by a network error or any other non-human cause, it automatically types 「继续」 and sends it for you.

  

## What It Does

For [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh web`): whenever a request in the web GUI gets interrupted by a **non-human cause**, the plugin simulates the user typing **「继续」** and sends it, so the agent keeps working without manual intervention. The message enters the session log exactly like a manual prompt — the model sees it, and the interrupted work resumes.

![demo](docs/demo.svg)

**Smart recovery** (all configurable):

- **Error classification** — transient failures (network / timeout / 5xx / 429…) are auto-resumed; permanent ones are **skipped** and notified, because retrying them never helps. A failure counts as permanent when its HTTP status is 401/403 or its code/message matches auth, credential/API-key, balance/quota, unknown-model, or context-length/overflow keywords. Turn classification off to resume everything
- **Adaptive backoff** — consecutive failures wait longer each time (cooldown × factor: 20s → 40s → 80s…), capped at the max backoff, instead of hammering a broken upstream
- **Templated continue text** — `continueText` supports `{code}` `{message}` `{status}` `{tool}` `{turn}` placeholders, so the resume message can carry the failure context ("继续 (git push failed: UPSTREAM)")
- **Browser notifications** — optional alerts when auto-continue fires, gives up, or hits a permanent error; the browser asks for permission on first use, and nothing is shown again after a denial

It watches the live event streams and reacts to:

### Event · Meaning
- **Event**: `turn/end` → `error` · **Meaning**: Turn failed (model / network / timeout, …)
- **Event**: `turn/end` → `interrupted` · **Meaning**: Crash-orphaned turn left behind by a host restart
- **Event**: `turn/end` → `max-tokens` · **Meaning**: Output token ceiling reached
- **Event**: `host/agent-error` · **Meaning**: Agent failure with no turn position

**Never auto-continues:** user-aborted turns (`aborted`) or policy rejections (`blocked`); sessions the host already resumed itself; running sessions or sessions with queued messages; subagent sessions; anything inside the cooldown / consecutive-cap windows (configurable in the settings card, below).

## How It Works

The plugin opens two extra SSE streams in the browser — `events.mux` (session events) and `events.host` (host events). The host supports multiple consumers, so this never interferes with the built-in runtime. On an interruption it waits a **grace period** (default 3 s) — if the host starts a new turn by itself (`turn/start`), the auto-continue is cancelled — then calls `sessions.prompt` in `queue` mode with the configured text.

On page load / reconnect it also scans the most recently updated sessions: a session whose last turn ended with a non-human reason **within the scan window** (default 15 minutes), with no later `turn/start` or user message, gets resumed automatically too (e.g. the host crashed while the browser was closed).

With the page open in several tabs, a localStorage mutex plus a shared per-session cooldown stamp guarantee exactly one tab sends — no duplicated 「继续」.

All knobs live in the plugin's settings card — see [Configuration](#configuration).

## Quick Start

DSH plugins install into a **profile** (`dsh web` → `web` profile). Install, restart `dsh web`, done.

### From npm (recommended)

Published as [`dsh-client-auto-continue`](https://www.npmjs.com/package/dsh-client-auto-continue):

```bash
dsh plugin --profile web add dsh-client-auto-continue
dsh web
```

### Directly from GitHub (no clone needed)

Installs straight from the repository's default branch — built artifacts are committed, so no local clone or build step:

```bash
dsh plugin --profile web add github:HsiangNianian/dsh-auto-continue
dsh web
```

> This tracks the `main` branch rather than released tags — great for trying the latest changes, while the npm method above is the stable choice. Switching between install sources is just re-running `dsh plugin --profile web add <other-spec>`; the profile dependency is replaced in place.

### From this repository

Requires Node.js ≥ 18.

```bash
git clone https://github.com/HsiangNianian/dsh-auto-continue.git
cd dsh-auto-continue
npm install
npm run build

# the package carries its own cordis.patch.yml (dsh.bundle.patch),
# so the plugin row registers itself
dsh plugin --profile web add link:$(pwd)

dsh web
```

### Manual (no pnpm / dsh plugin needed)

```bash
ln -sfn "$(pwd)" ~/.dsh/profiles/node_modules/dsh-client-auto-continue
# then append to ~/.dsh/profiles/web/cordis.patch.yml:
#   - insert:
#       - id: auto-continue
#         name: 'dsh-client-auto-continue'
dsh web
```

> Switching from a manual install to `dsh plugin add`? Remove the manual `insert` entry first — the bundle patch registers the row and a duplicate would conflict.

> **Known DSH limitation (0.1.0-rc.6):** the web settings surface only exposes
> namespaces on a hardcoded allowlist in the installed `@deepseek-ai/dsh-host-apiproxy`
> bundle. Until upstream moves exposure into `settings.register()`, one idempotent
> vendor patch makes exposure **registry-driven** — every namespace a plugin
> registers (this one or any other) becomes visible, with no plugin-specific
> strings anywhere. Run it once, and re-run after reinstalling dsh:
>
> ```sh
> node node_modules/dsh-client-auto-continue/scripts/patch-expose.mjs
> dsh web
> ```
>
> The patch script ships inside the npm package (no repo clone needed) and
> covers every reachable dsh installation: the profile-linked copy, a global
> `npm i -g @deepseek-ai/dsh` install, and the invoking directory's own. The
> auto-continue engine itself works without this patch — it only gates the
> GUI settings section.

### Verify & uninstall

```bash
dsh --profile web --dump-config | grep auto-continue   # config layer mounted
```

In the browser console (Ctrl/Cmd+Shift+I): `[auto-continue] 已启动(文本="继续", …)` — every detection and auto-send is logged.

```bash
dsh plugin --profile web remove dsh-client-auto-continue   # npm / repo install
# or remove the symlink + the insert entry                  # manual install
dsh web
```

## Configuration

Everything is configurable from the GUI — no file or console edits needed. Open **Settings → Auto continue** — the plugin's own section, placed right after **Agent presets**.

**How the card works:**

- Edits are **staged** — nothing reaches the disk until you hit **Save**; an unsaved badge marks the card while drafts are pending, and **Discard** drops them
- A field you changed shows an **Overridden** badge with a per-field **Reset to default** button that restores the built-in value
- Boolean fields are **tri-state**: *Inherit* (use the default) / *On* / *Off*
- Invalid drafts (non-numbers, values below the minimum) block the save with a hint
- In a read-only deployment the card shows the stored values but disables every control
- Changes apply immediately after Save and persist in `~/.dsh/settings.yaml` (uninstalling the plugin leaves the section behind — harmless, delete it by hand if you like)

### Field · Default · Description
- **Field**: Continue text · **Default**: `继续` · **Description**: Text automatically sent after an interruption
- **Field**: Grace period (ms) · **Default**: `3000` · **Description**: Wait after an interruption; cancelled if the host recovers on its own
- **Field**: Cooldown (ms) · **Default**: `20000` · **Description**: Min interval between auto-continues per session (failed attempts count too)
- **Field**: Max consecutive · **Default**: `3` · **Description**: Max consecutive auto-continues; stops until a user intervenes or a turn completes
- **Field**: Scan on load / reconnect · **Default**: `on` · **Description**: Scan recently interrupted sessions on load / reconnect
- **Field**: Scan limit · **Default**: `8` · **Description**: Max sessions scanned (running / subagent sessions excluded)
- **Field**: Scan window (ms) · **Default**: `900000` · **Description**: Scan only considers interruptions inside this window
- **Field**: Reconnect scan delay (ms) · **Default**: `5000` · **Description**: Delay before scanning after a reconnect
- **Field**: Reconnect backoff (ms) · **Default**: `3000` · **Description**: SSE reconnect backoff
- **Field**: Verbose logs · **Default**: `on` · **Description**: `[auto-continue]` console logs
- **Field**: Classify errors · **Default**: `on` · **Description**: Auto-resume transient failures only; auth / balance / model errors are skipped and notified
- **Field**: Backoff factor · **Default**: `2` · **Description**: Cooldown multiplier per consecutive failure (2 = 20s → 40s → 80s…)
- **Field**: Max backoff (ms) · **Default**: `300000` · **Description**: Cap on the adaptive backoff interval
- **Field**: Browser notifications · **Default**: `off` · **Description**: Notify when auto-continue fires, gives up, or hits a permanent error

`continueText` accepts the placeholders `{code}`, `{message}`, `{status}`, `{tool}` (last tool call before the failure) and `{turn}` — e.g. `继续 ({tool}: {code})` becomes `继续 (git push: UPSTREAM)`.

## Privacy & permissions

The plugin is browser-only and touches **no files, credentials, or network beyond the dsh host**:

- It opens the same two read-only event streams the web UI already uses (no extra server, no third-party endpoints)
- The only write it ever performs is `sessions.prompt` — the same call the Send button makes — with the text you configured
- Browser storage is limited to small `localStorage` keys for cross-tab coordination
- Browser notifications are opt-in (`notify` setting) and permission is requested on first use only

## Development

```bash
npm run typecheck   # tsc --noEmit
npm run build       # lib/client.js + lib/index.js + lib/types
npm run watch       # rebuild on change; host HMR hot-reloads without a page refresh
npm run test        # node tests/simulate.mjs — 12 behavioral scenarios
```

While `npm run watch` runs, the profile's client-hmr row polls `lib/client.js` every 500 ms and hot-reloads the plugin in the browser — no server restart needed for code changes.

## Activity

[![HsiangNianian/dsh-auto-continue GitStock K-Line Chart](https://gitstock.org/HsiangNianian/dsh-auto-continue/stock.svg)](https://gitstock.org/HsiangNianian/dsh-auto-continue)

## Links

- **Repository**: [github.com/HsiangNianian/dsh-auto-continue](https://github.com/HsiangNianian/dsh-auto-continue)
- **LINUX DO**: [linux.do](https://linux.do)
- **DeepSeek Harness**: [github.com/deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)