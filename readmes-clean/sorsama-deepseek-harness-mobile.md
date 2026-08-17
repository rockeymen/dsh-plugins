![DSH Mobile — the DeepSeek Harness in your pocket](docs/images/banner.jpg)

# DSH Mobile — DeepSeek Harness Remote

  An open-source Android companion that puts your DeepSeek Harness in your pocket.
  Drive sessions, review plans and goals, answer approvals and questions, and get notified
  when the harness finishes — from your phone, over your local network.

DSH Mobile is an **unofficial companion app** for the
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (MIT), mirroring its web GUI
feature-for-feature in the harness's own visual language. Android only, Kotlin + Jetpack Compose.

The [**wiki**](https://github.com/sorsama/deepseek-harness-mobile/wiki) is the user-facing guide:
[getting started](https://github.com/sorsama/deepseek-harness-mobile/wiki/Getting-Started),
[connecting](https://github.com/sorsama/deepseek-harness-mobile/wiki/Connecting),
[troubleshooting](https://github.com/sorsama/deepseek-harness-mobile/wiki/Troubleshooting),
a [feature tour](https://github.com/sorsama/deepseek-harness-mobile/wiki/Feature-Tour) and an
[FAQ](https://github.com/sorsama/deepseek-harness-mobile/wiki/FAQ).

## Screenshots

### Connect · Chat · Trajectory
- **Connect**: ![Connect screen: recent harnesses with live reachability, discovery, manual entry and auto-connect toggles](docs/images/home.png) · **Chat**: ![Chat: streamed turns with per-tool icons, tool cards, goal dock and composer](docs/images/chat.png) · **Trajectory**: ![Trajectory: a per-turn ledger with usage totals](docs/images/trajectory.png)
- **Connect**: Recent harnesses with live reachability, LAN discovery, manual `host:port`, auto-connect. · **Chat**: Streamed turns, a glyph per tool, expandable tool cards, permission picker. · **Trajectory**: The same session as a per-turn ledger with usage totals.

### Session details · Subagents
- **Session details**: ![Details panel: context breakdown, goal, plan mode, jobs, queue, subagents, host information](docs/images/session-info.png) · **Subagents**: ![Subagent catalog with continuable children](docs/images/subagent.png)
- **Session details**: Context breakdown, goal, plan mode, background jobs, queued turns, host info, session-log export. · **Subagents**: The subagent catalog — open a child's transcript, follow up, or interrupt it.

## Features

- **Connect effortlessly** — auto-discovers a harness on your Wi-Fi (active subnet scan +
  readiness handshake), remembers hosts and probes them for liveness on the way in, supports
  manual `host:port` entry, loopback for same-device setups, and auto-connect toggles
  (last used / LAN / same device).
- **Discord-style navigation** — swipe right from the left edge to open the workspace-grouped
  chat list, swipe left to close it, swipe left from the right edge for the session details panel.
- **Full chat experience** — streamed turns with reasoning disclosure, markdown,
  terminal/diff/read/search/web tool cards, queue dock (edit / remove / steer), history paging,
  image attachments.
- **Slash commands and skills** — the composer adjudicates a `/` line against the session's own
  command catalog and runs it through the harness's command gateway; anything the catalog does not
  claim is sent as a prompt, which is how skills are invoked.
- **Everything the GUI does** — goals (phases, rounds, pause/resume/edit), plan mode + plan review,
  permission approvals, user questions, todo dock, subagents (catalog, follow-ups, interrupt),
  background jobs, workflow runs, skills, model selection, agent presets, session search,
  trajectory ledger, session export, message feedback.
- **Notifications** — turn complete, goal complete / blocked, review or question waiting for you;
  background connection via a foreground service.
- **Looks like the harness** — the exact DeepSeek Harness design tokens (colors, type, radii,
  disclosure rows, shimmer, ink buttons) with light / dark / system themes.
- **11 languages** — English, 中文, हिन्दी, Español, Français, العربية, বাংলা, Português, Русский,
  اردو, ไทย (RTL aware).

## Requirements

- Android 8.0+ (minSdk 26).
- A running [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
  (tested against `0.1.0-rc.5`).

## Quick start

1. Install the latest APK from
   [Releases](https://github.com/sorsama/deepseek-harness-mobile/releases/latest).
2. On your computer, make the harness reachable from your phone:
   - **USB / emulator:** `dsh web`, then `adb reverse tcp:3080 tcp:3080` — in the app connect to
     `127.0.0.1:3080`.
   - **Wi-Fi:** apply the one-file LAN patch described in
     [`harness/README.md`](harness/README.md), restart `dsh web`, then tap **Scan network**
     in the app.
3. Pick a session, chat, and get notified when the harness is done.

If a connect attempt fails, the app names the cause; the wiki's
[Troubleshooting](https://github.com/sorsama/deepseek-harness-mobile/wiki/Troubleshooting) page is
keyed on that exact sentence.

## Compatibility & security

- See [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) for the harness version matrix and
  loopback-only surfaces.
- **Read [docs/SECURITY.md](docs/SECURITY.md) first** — the harness has no authentication; only
  use LAN mode on trusted networks. The app says so on the connect screen for the same reason.

## Building

```sh
./gradlew :app:assembleDebug      # debug APK
./gradlew :app:assembleRelease    # release APK (signed when keystore env is set)
```

The shipped version comes from the git tag: the release workflow exports `DSH_VERSION_NAME` from
the tag name, and `versionCode` is derived from it. A local build falls back to the literal in
`app/build.gradle.kts`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development loop against a real harness, the module
layout, and the release workflow.

## Repository

### Path · What
- **Path**: `core/` · **What**: Pure-JVM protocol core: wire DTOs, RPC client, WebSocket downlinks, reconnect loop, session folding, notification classifier
- **Path**: `app/` · **What**: Android UI: screens, discovery/connection, foreground service, notifications, i18n
- **Path**: `mock-harness/` · **What**: Ktor mock of the harness `/api` server for tests
- **Path**: `tools/capture/` · **What**: Records real harness traffic into conformance fixtures
- **Path**: `harness/` · **What**: Companion patch + guide for LAN mode
- **Path**: `docs/` · **What**: [Architecture](docs/ARCHITECTURE.md), [protocol notes](docs/PROTOCOL.md), [compatibility](docs/COMPATIBILITY.md), [security](docs/SECURITY.md)