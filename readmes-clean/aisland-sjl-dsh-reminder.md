# dsh-reminder 🔔

**A cross-window reminder plugin for DeepSeek Harness** — while you work in any other window, it taps you on the shoulder the moment a task **finishes** or **waits for your approval**. Codex / WorkBuddy style.

![Toast preview](assets/toast-preview.svg)

## ✨ Features

### 🎯 · Feature · Description
- **🎯**: 🟢 · **Feature**: Completion · **Description**: Pops "Task completed" on every turn end, with session · duration and a green check icon
- **🎯**: 🟡 · **Feature**: Approval · **Description**: Pops "Waiting for your approval" with the tool name and an amber alert icon
- **🎯**: 🎯 · **Feature**: Pops in any window · **Description**: Notifies even while you work in other apps
- **🎯**: 🖱️ · **Feature**: Click to return · **Description**: Clicking focuses the DSH window and opens the session
- **🎯**: ⏱️ · **Feature**: Auto-dismiss · **Description**: Gone in 3-5 s (adjustable)
- **🎯**: 🎵 · **Feature**: Soft chime · **Description**: A gentle two-note chime (D4→A4) — nothing startling
- **🎯**: 🔁 · **Feature**: Deduplicated · **Description**: Never pops twice for the same event
- **🎯**: 🛡️ · **Feature**: Reminds, never acts · **Description**: Never approves on your behalf

## 🤔 Why

- 😴 *Nobody calls you for approvals* — the agent waits while you are away; now an amber popup tells you
- 👀 *Nobody tells you it's done* — no completion signal before; now a green popup tells you

## 🚀 Quick start

1. **Install**: `dsh plugin --profile web add <dsh-reminder>` (or `npm i dsh-reminder`), register `dsh-reminder` in the profile bundle list, restart the DSH web process
2. **Grant permission**: Settings → Reminders → "Enable & test notifications" → Allow — a test popup arrives instantly
3. **Enjoy**: Switch away and work — the popups come to you

## ⚙️ Settings

### Setting · Default · Description
- **Setting**: Notification permission · **Default**: unset · **Description**: One-click grant + test popup
- **Setting**: Approval reminders · **Default**: On · **Description**: Off = no approval popups
- **Setting**: Completion reminders · **Default**: On · **Description**: Off = no completion popups
- **Setting**: Duration · **Default**: 3-5 s · **Description**: Seconds before auto-dismiss
- **Setting**: Failure alerts · **Default**: Off (reserved) · **Description**: Planned for v0.3

## 🏗️ Architecture

One package ships the **host Cordis plugin** and the **web client**:

- **host**: registers the settings namespace plus a plugin-owned Typert Remote (`reminder/getSettings` · `updateSettings`) — plugin namespaces sit outside the web settings allowlist
- **client**: subscribes to the session list and conversation snapshots (turn/end, approval/requested arrive over the mux stream), pops via the Notification API with a Web Audio chime
- **Read-only**: never mutates DSH core behavior

## 🔧 Development

```bash
pnpm install
pnpm run typecheck   # tsc --noEmit
pnpm test            # node tests/unit/*.test.cjs (16 tests)
pnpm run build       # esbuild: host ESM + single-file client CJS (ModuleLoader handshake) + tsc d.ts
```

- Artifacts: `lib/index.js` (host ESM), `lib/client.js` (client), `lib/types/` (.d.ts)
- Offline dev: no new dependencies; @deepseek-ai/* types and local esbuild/typescript come from `03_local/codes` (not in git)

## ⚠️ Known limits

- Chrome page notifications reject `actions` (ServiceWorker persistent notifications only) — dismiss via auto-close or the hover ✕
- Permission must be requested from a user gesture (browser policy) — the settings button does it in one click
- The chime unlocks on the first click (autoplay policy)

## 📄 License

[MIT](LICENSE)