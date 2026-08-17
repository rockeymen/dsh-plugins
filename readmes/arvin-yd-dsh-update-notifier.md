# dsh-update-notifier

Persistent version badge for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

A quiet badge in the sidebar footer **always shows your installed version**
(e.g. `v0.1.0-rc.6`). Clicking it opens a modal with current → latest and last-checked time:
"up to date" when current, or — when npm
[`@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh) `latest` is newer — a red
`StateDot` plus copy-the-update-command / ignore / snooze actions.

**This is a community plugin, not an official DeepSeek product.**

## How it works

- **Host half** (`src/index.js`): resolves your installed DSH version once at startup,
  polls the npm registry (default: first check 10s after startup, then every 6h),
  and serves the cached decision on `GET /dsh-update-check` (with an `updateHint` that
  matches your install mode: `npm exec @deepseek-ai/dsh@latest web` for npx-cache installs,
  `npm install -g @deepseek-ai/dsh@latest` otherwise) via the optional `webServer` service.
  Headless compositions are unaffected.
- **Browser half** (`client/client.js`): registers a persistent `sidebar.footer.action` slot
  entry rendered with the official `ui-primitives` (`StateDot` / `Button` / `Modal`).
  Badge states: red dot = update available, green dot = current, amber = checking / error /
  unknown. "Ignore" persists in `localStorage` until a newer version appears; "Later" hides
  the red dot until the next fresh check result.

## Display logic

**Badge** — always visible in the sidebar footer (official `sidebar.footer.action` slot).
The shell stacks footer actions above the Settings row by design; this plugin measures the
Settings row height at runtime and pulls the badge onto its **right side** with a
compensating negative margin (re-measured on wide/rail toggles). In the collapsed rail it
renders as a centered dot.

| Dot color | Meaning |
|---|---|
| 🔴 red (`error`) | an update is available, not ignored and not snoozed |
| 🟢 green (`done`) | installed version is current |
| 🟡 amber (`warning`) | first check pending, check failed, installed version unknown, or an available update is currently ignored/snoozed |

Label: `v<current>` normally · `…` while the first check is pending · `—` when the installed
version cannot be resolved.

**Modal** — clicking the badge opens it; content depends on the host-reported state:

| Host state | Modal content |
|---|---|
| `checking` | 检查中… |
| `update-available` | current → latest, last-checked time, [立即更新] (primary, two-click confirm), copy-the-update-command box, footer: [忽略此版本] [稍后再说] |
| `up-to-date` | current → latest, "已是最新版本 ✓", footer: [立即检查] |
| `error` | current → latest, "检查失败：\<reason\>", footer: [立即检查] |
| `unknown` | current → latest, "无法识别本地 dsh 版本", footer: [立即检查] |

**One-click update** — [立即更新] → confirm → the host half executes the update for your
install mode:

- **npx-cache installs** (`npm exec @deepseek-ai/dsh web`): it spawns a detached
  `npm exec --yes @deepseek-ai/dsh@latest web` (fetching the new version) and exits the
  current process so the new server can bind the port. The page disconnects for roughly
  10–60s; refresh when it comes back.
- **Global npm installs**: it runs `npm install -g @deepseek-ai/dsh@latest` and reports the
  result; you still restart `dsh web` yourself.

A restart always ends the current process — in-flight conversations survive on disk
(`~/.dsh/sessions`).

**Check cadence** — host: first check 10s after startup, then every `checkIntervalMs`
(default 6h) against the npm registry (5s timeout); browser: polls `/dsh-update-check`
every 5 minutes and on tab focus; [立即检查] / `?force=1` re-checks immediately (2s cooldown).
"Ignore this version" is stored in `localStorage` and lifts only when a newer version
appears; "Later" lifts when the next fresh check result arrives.

## Compatibility

- Verified against **dsh 0.1.0-rc.5** (monorepo dev clone, full web boot + endpoint E2E) and
  **0.1.0-rc.6** (npm-installed, host boots, load-level headless test clean).
  Last verified: **2026-08-15**.
- Tracks the npm `latest` dist-tag of `@deepseek-ai/dsh`, so it stays version-agnostic;
  no pin to a specific dsh commit is required.

## Install / Uninstall

Install (npm by name, git URL, or local dir all work):

```sh
dsh plugin --profile web add dsh-update-notifier
dsh plugin --profile web add https://github.com/arvin-yd/dsh-update-notifier.git
dsh plugin --profile web add /path/to/this/repo
```

Uninstall / remove:

```sh
dsh plugin --profile web rm dsh-update-notifier
```

The plugin activates at the next `dsh web` start (a restart is required after install).

## Quick start

1. Install into the `web` profile (above) and restart: `dsh --profile web --port <port>`.
2. Sanity-check the host half:

   ```sh
   curl http://127.0.0.1:<port>/dsh-update-check
   # {"state":"up-to-date","current":"0.1.0-rc.6","latest":"0.1.0-rc.6","fetchedAt":...,"error":null,"updateHint":"..."}
   ```

3. The sidebar footer badge always shows your installed version (green dot = current).
   When npm `latest` exceeds it, the dot turns red; the modal offers
   copy-update-command / ignore / snooze.

## Config

Defaults live in `cordis.patch.yml`; override in `$DSH_HOME/profiles/web/cordis.patch.yml`:

```yaml
- id: dsh-update-notifier
  config:
    checkIntervalMs: 21600000   # host re-check interval (default 6h)
    timeoutMs: 5000             # registry fetch timeout (ms)
```

## Permissions & data

- Reads: your dsh install location (to resolve the installed version), the npm public
  registry over HTTPS (`registry.npmjs.org` — metadata only, no credentials sent).
- Writes: nothing on disk; the browser half stores only the ignored-version string in
  `localStorage` (`dsh-update-notifier.ignoredVersion`).
- **One-click update action**: only after your explicit two-click confirmation, the host
  runs npm commands under your user account (see "One-click update") and — for npx installs —
  ends the dsh process to let the new version bind the port. No credentials are read or
  forwarded; the update endpoint only accepts requests while an update is actually available.
- No telemetry, no analytics, no third-party calls beyond the npm registry.

## Troubleshooting

- **Badge never appears** — expected when you are on the latest version; verify via the
  endpoint above (`state` must be `update-available`).
- **`current` is `null` / state `unknown`** — run dsh through its normal entrypoint
  (`dsh web` / `npm exec @deepseek-ai/dsh web`); the version probe walks up from the
  running bin, plugin directory, and enclosing `@deepseek-ai/dsh*` package.
- **state `error`** — registry fetch failed (offline/blocked); check the dsh host log for
  `[dsh-update-notifier] check failed: ...`; it retries every `checkIntervalMs`.
- **Rollback** — `dsh plugin --profile web rm dsh-update-notifier` removes the plugin.

## Development

```sh
pnpm install
pnpm test
```

## License & security

MIT. To report a security issue privately, use GitHub's
[private vulnerability reporting](https://github.com/arvin-yd/dsh-update-notifier/security/advisories/new).
