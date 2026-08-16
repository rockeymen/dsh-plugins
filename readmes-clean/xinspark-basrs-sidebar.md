# Basic Right Sidebar

A right sidebar plugin for **DeepSeek Harness**: a two-level navigation column (Functions / Sessions) with panel switching, a workspace/session breadcrumb in the session topbar, session overview with log download, the native trajectory view, and configurable topbar decluttering.

## Design Philosophy

Basic Right Sidebar is a **UI-only enhancement** for DSH: it introduces no new capabilities — it surfaces DSH's native features inside the right sidebar, and is meant to be the **foundation plugin** every feature-enhancing right sidebar builds on.

Two breadcrumbs were designed by comparing the native UI and other right-sidebar implementations:

- **Session topbar · Workspace/Session breadcrumb** — lets you switch sessions and workspaces while the native left sidebar is collapsed.
- **Sidebar header · Functions/Overview breadcrumb** — lets you switch between the sidebar's multiple views.

Navigation structure (one-level categories, each with its own panels):

### Level 1 · Panels
- **Level 1**: Sessions (会话管理) · **Panels**: Overview
- **Level 1**: Functions (功能区) · **Panels**: Overview · Trajectory

## Screenshots

Right sidebar UI in the session view:

**Function area / Overview (non-fullscreen)**

![Function area / Overview](docs/screenshots/image-7.png)

**Function area / Trajectory (non-fullscreen)**

![Function area / Trajectory](docs/screenshots/image-8.png)

**Session management / Overview (non-fullscreen)**

![Session management / Overview](docs/screenshots/image-9.png)

**Function area / Trajectory (fullscreen)**

![Function area / Trajectory (fullscreen)](docs/screenshots/image-10.png)

**Right sidebar collapsed**

![Right sidebar collapsed](docs/screenshots/image-11.png)

**Plugin configuration UI**

![Plugin configuration UI](docs/screenshots/image-12.png)

![Plugin configuration UI (continued)](docs/screenshots/image-13.png)

## Features

- **Two-level navigation** — Functions / Sessions menus switch panels (Overview · Trajectory / Overview).
- **Workspace/session breadcrumb** — switch workspaces and sessions right from the session topbar.
- **Session overview** — session meta info, log stats (time span, event counts, size) and log download (zip).
- **Native trajectory view** — pixel-identical with the DSH native trajectory UI; no system source changes required.
- **Sidebar controls** — expand/collapse and fullscreen from the topbar.
- **Configurable topbar decluttering** — hide duplicated topbar elements individually: session log, session mode, subagents, background jobs, chat/trajectory tab bar.
- **Open by default** — auto-expand the sidebar after load; a manual collapse is always respected.
- **Built-in foundations** — an icon library (native-first) and a reusable component library ship with the plugin for easy extension.

## Installation

`basrs-sidebar` is a **bundle** (a config layer packaged as an npm package, see the [official plugin docs](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)). Install it into a profile with the `dsh plugin` command — it links the package and appends it to `dsh.profile.bundles` automatically:

```sh
# from an npm registry
dsh plugin --profile web add basrs-sidebar

# or a local directory / packed tarball
dsh plugin --profile web add ./basrs-sidebar
dsh plugin --profile web add ./basrs-sidebar-1.0.0.tgz

# or straight from git (no build step needed — this plugin ships plain JS)
dsh plugin --profile web add github:xinspark/basrs-sidebar#<sha>
```

Then start the web UI: `dsh web` (or `dsh --profile web`). The first `add` initializes the profile with `@deepseek-ai/dsh-base` automatically.

To remove it: `dsh plugin --profile web remove basrs-sidebar` (removes both the dependency and the bundle layer).

The plugin's bundle patch (`cordis.patch.yml`) registers the host and client rows automatically. The browser half is served per-request, so client-side changes only need a page refresh; host-side changes need a restart.

## Configuration

Open **Settings → Plugins → Basic Right Sidebar**:

### Option · Description
- **Option**: Open right sidebar by default · **Description**: Auto-expand the sidebar on load; manual collapse is never overridden.
- **Option**: Hide duplicated session topbar elements · **Description**: Master switch; when on, choose which of the following to hide: **session log · session mode · subagents · background jobs · chat/trajectory tab bar**.
- **Option**: Show workspace/session breadcrumb · **Description**: The breadcrumb on the left of the session topbar; off restores the native topbar.

Settings persist to `$DSH_HOME/plugins/basrs-sidebar/settings.json`. The plugin ships its own persistence endpoint (`/bsrs-settings`): DSH's settings wire only exposes an allowlisted set of namespaces, so third-party namespaces cannot use it.

## Development

- **`index.js`** — host half: session log stats, last-todos snapshot, and settings persistence (`GET/POST /bsrs-settings`).
- **`lib/client.js`** — browser half (UMD, registered into DSH `clientModules`). Structure, top to bottom:
  1. Vendored official trajectory view (lazy-loaded; normally you don't touch it).
  2. **Icon library** (`createIconLibrary`) — native icons preferred; add new icons per the rules at the top of the library.
  3. **Component library** (`createComponentLibrary`) — `SectionCard`, dropdown menus, `Tag`, `StateDot`, `TodoList`/`TodoGlyph`/`ProgressGlyph`, task-status normalization, time formatting, shared CSS.
  4. `apply(ctx)` — registers the slots: `details` (sidebar), `conversation.session.header.actions` (breadcrumb), `conversation.session.header.utilities` (sidebar toggle), `settings.plugin.item` (config card); ships built-in zh/en dictionaries that follow DSH's language switch.

Extension cheatsheet:

- **Add a panel** — add an entry to the `panels` list in `apply` and write the render component.
- **Add copy** — add a key to `BSR_ZH` / `BSR_EN`.
- **Add an icon** — register it in the icon library (native first, custom fallback).