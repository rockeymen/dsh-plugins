# dsh-enhanced-plugins

An enhancement suite for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness): **six independently installable Cordis bundles plus one Windows companion**.

- Does not modify DSH core; every Web feature uses public plugin extension points.
- Installs everything in one pass or keeps only the independently packaged features you select.
- Keeps Host, Web Client, and Windows Companion lifecycles and security boundaries separate.

[Features](#features) · [Quick start](#quick-start) · [Feature guide](#feature-guide) · [Compatibility and migration](#compatibility-and-migration) · [Configuration](#configuration) · [Development](#development-and-verification)

## Features

The installer only needs the stable “feature ID.” Every feature also has a self-contained selective package.

### Feature · Feature ID · Selective package · Platform and entry point · What it adds
- **Feature**: [Windows Launcher](#1-windows-launcher) · **Feature ID**: `windows-launcher` · **Selective package**: `dsh-enhanced-windows-launcher` · **Platform and entry point**: Windows Start menu · **What it adds**: Tray controls for Web, Headless, profiles, source builds, and diagnostics
- **Feature**: [Desktop alerts and pet](#2-desktop-alerts-and-pet) · **Feature ID**: `notification` · **Selective package**: `dsh-enhanced-notification` · **Platform and entry point**: Windows; Settings → Desktop Pet · **What it adds**: Task sounds, a custom WAV library, and a native animated pet
- **Feature**: [Plugin Community](#3-plugin-community) · **Feature ID**: `plugin-market` · **Selective package**: `dsh-enhanced-plugin-market` · **Platform and entry point**: Web; Settings → Plugin Community · **What it adds**: Search, safely preflight, install, and uninstall community plugins
- **Feature**: [MCP server manager](#4-mcp-server-manager) · **Feature ID**: `mcp-server-manager` · **Selective package**: `dsh-enhanced-mcp-server-manager` · **Platform and entry point**: Web; Settings → Plugins · **What it adds**: Manage stdio / Streamable HTTP servers and import local configuration
- **Feature**: [pi-ai model request types](#5-pi-ai-model-request-types) · **Feature ID**: `model-input-types` · **Selective package**: `dsh-enhanced-model-input-types` · **Platform and entry point**: Web; Settings → Plugins · **What it adds**: Declare whether a model accepts text-only or image requests
- **Feature**: [Edit last message](#6-edit-last-message) · **Feature ID**: `edit-last-message` · **Selective package**: `dsh-enhanced-edit-last-message` · **Platform and entry point**: Web; latest user message · **What it adds**: Change that turn and regenerate in the same session
- **Feature**: [Product subagents](#7-product-subagents) · **Feature ID**: `sub-agent` · **Selective package**: `dsh-enhanced-sub-agent` · **Platform and entry point**: Web; Settings → Subagents · **What it adds**: Enable or disable Claude Code / Codex tools in real time

The historical aggregate package is `dsh-enhanced-plugins`. Launcher-managed installs now express “all” as every independent Profile package plus the required global Launcher, so any one Profile feature can later be removed without changing the others.

## Quick start

### Requirements

- Node.js 22.19.x, or Node.js 24 and later.
- A recent DSH Web profile that runs from source; see the [DSH Web UI quickstart](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart).
- This repository is verified against DSH [`0.1.1-rc.2`](https://github.com/deepseek-ai/deepseek-harness/tree/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e), with local ABI baseline commit `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e`.
- Windows Launcher, native sounds, and the desktop pet require Windows 10 or later and Windows PowerShell 5.1. The remaining features are cross-platform.

> [!IMPORTANT]
> DSH remains a developer preview. If a DSH upgrade causes compatibility issues, check the verified version and commit above first.

> [!CAUTION]
> **Check the DSH/plugin repository layout before copying an install command:**
>
> - **Sibling-directory install:** both repositories share the **same parent directory**; use the commands below as written.
> - **Different-directory install:** the repositories have **different parent directories**; add `-DshCheckout "absolute path to the DSH source"` to the command.

### Install every feature

When both repositories share a parent directory, run this from the root of this repository:

```text
<workspace>/
├── deepseek-harness/
└── dsh-enhanced-plugins/
```

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\migrate-to-enhanced-plugin.ps1
```

Omitting `-Features`, or passing `-Features all`, installs the six **independent** Cordis packages and the required Windows Launcher; it no longer uses the root aggregate package to represent “all.” The launcher is deployed to `%LOCALAPPDATA%\DeepSeekHarness\Launcher` and creates a Start menu shortcut. Add `-CreateLauncherDesktopShortcut` if you also want a desktop shortcut. Running the installer directly only installs or updates the program files; it does not start or open Launcher. An update initiated inside Launcher still performs the required version restart and readiness check.

If the DSH checkout is not a sibling, provide its location explicitly:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\migrate-to-enhanced-plugin.ps1 `
  -DshCheckout "E:\projects\deepseek-harness"
```

### Install selected features

List the stable feature IDs exposed by this version:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\migrate-to-enhanced-plugin.ps1 -ListFeatures
```

Then pass the final set you want to keep. For example, install desktop alerts, MCP management, and message editing only:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\migrate-to-enhanced-plugin.ps1 `
  -Features notification,mcp-server-manager,edit-last-message
```

Common combinations can replace the `-Features` value in that command:

### Goal · Feature set
- **Goal**: Windows desktop experience · **Feature set**: `windows-launcher,notification`
- **Goal**: Agent and model enhancements · **Feature set**: `mcp-server-manager,model-input-types,edit-last-message,sub-agent`
- **Goal**: Plugin discovery and integration management · **Feature set**: `plugin-market,mcp-server-manager`

`-Features` is not an additive list. It describes the **final project feature set** that the target Profile should retain. Windows Launcher is a required global component: it is added by the backend, is not written in the list, and cannot be removed through feature selection. `-Features none` removes this project's Profile packages while keeping Launcher. The installer:

1. Installs dependencies and builds every selected feature.
2. Installs and verifies that every selected bundle or companion loads.
3. Only then removes the aggregate package, unselected sibling features, and declared legacy conflicts.
4. Detects and cleans up the retired file-reference plugin.

### Launcher plugin management

The source installer records the DSH checkout, this repository's source path, Git remote/ref, source revision, and each managed Profile's desired set in `%LOCALAPPDATA%\DeepSeekHarness\Launcher\install-state.json`. The control center's **Plugin Management** page then provides:

- a dynamic feature catalog generated from `packages/*/package.json`, so normal new features do not require Launcher changes;
- first-use default selection, per-Profile desired state, individual install/removal, and aggregate-package migration;
- safe Git `fetch`/`pull --ff-only`, or an exact-commit source ZIP when Git is unavailable; an extracted source directory or manual source ZIP can be bound when the network is unavailable;
- `npm ci`, a production `npm run build`, and runtime-entry validation in a persistent isolated `sources/runtime-*` snapshot only when the source revision or desired feature set changed; Profiles always link to a retained active snapshot, while snapshots no longer referenced by any Profile are safely removed; repository-wide development typechecks remain a source-checkout concern so sibling DSH type paths do not block an isolated install; native stderr warnings remain in the log while failure is determined by the real process exit code; Launcher-owned DSH is stopped only after these checks pass;
- an external coordinator that switches Launcher versions only when the executable hash changes, waits for readiness, rolls back failures, and restores DSH when appropriate; restoration is reported successful only after DSH remains Launcher-owned for 15 consecutive seconds;
- recovery of a still-running or interrupted coordinator after Launcher restarts, plus preservation and partial reconstruction when install state is damaged.

The first version supports only a local DSH source checkout and source installs of this repository. It does not support npx, a global `dsh`, npm-published packages, or GitHub Releases. A dirty, ahead, or diverged Git checkout is never reset, rebased, or overwritten.

If a prerequisite step fails, the installer does not dismantle the previously working combination. Restart the current Web profile once after a successful install if DSH is already running.

## Feature guide

### 1. Windows Launcher

`windows-launcher` · **Start → DeepSeek Harness Launcher** · Windows 10+

![DeepSeek Harness Windows Launcher overview](assets/readme/windows-launcher.png)

A Windows control center outside the Cordis plugin tree for local DSH users who do not want to keep a terminal open.

- **Web control:** inspect status, start, open, restart, or stop Web; identify services already bound to the port without taking ownership of them.
- **Tasks and profiles:** run one-shot Headless tasks and background profiles with unified UTF-8 results and logs.
- **Source maintenance:** run `git pull --ff-only` against the bound DSH checkout and only run `pnpm run build` after a successful update; explicitly allow build-only operation when Git is unavailable.
- **Diagnostics:** collect command, port, working directory, status, and log information, with a dedicated DSH Source page.
- **Desktop behavior:** system tray, optional login startup, a centered vertical layout at every window size, per-monitor DPI scaling, and multi-monitor bounds protection.

Process ownership, exit, and background behavior

Launcher only stops DSH process trees that it started. A service already using the configured port is shown as an external Web service: the page can be opened, but Launcher will not take it over, restart it, or terminate it.

The tray exposes two exit paths. “Exit Launcher Only” leaves DSH running; “Exit Launcher” first requests a safe stop of Launcher-owned services. If the service is external or the stop times out, exit is cancelled with a reason.

Tasks and profiles run in no-console child processes. User task content travels through a UTF-8 request file to the PowerShell command engine and is never concatenated into `cmd.exe`. Hiding the main window stops foreground polling while the tray and background services continue running.

Login startup, deployment, and source binding

Login startup is off by default. You can start Launcher in the tray only, or start Launcher and launch DSH Web in the background after a 30-second initialization delay. The modes are mutually exclusive and can both remain disabled.

Versioned deployment directories keep Start menu and login-startup entries pointed at the current release without depending on profile `node_modules`. The installer preserves an explicitly configured DSH command. For a local DSH checkout, it generates and verifies a safe direct CLI entry and records that checkout as the only permitted source-build root.

Settings, runtime state, install state, update requests, and logs live under `%LOCALAPPDATA%\DeepSeekHarness\Launcher`. Launcher remains selected and required in the management UI. The control center does not self-uninstall; run `migrate-to-enhanced-plugin.ps1 -UninstallLauncher` from this repository to remove the program files, shortcuts, and login-startup entry. Logs and user settings are preserved by default.

### 2. Desktop alerts and pet

`notification` · **Settings → Desktop Pet** · Sounds and pet require Windows 10+

![Desktop alerts, custom sound library, and pet settings](assets/readme/desktop-notifications.png)

- Confirmation, completion, and blocked events can each be disabled or mapped to two built-in sounds or a custom WAV.
- Changing a sound previews it automatically, with a manual preview button as well. Shared gain ranges from 0–100%; 100% is approximately +6 dB, with soft limiting for near-peak PCM / IEEE Float WAV files.
- Each file is limited to 2 MiB and the shared library to 64 files, all stored in the current DSH profile.
- The pet switches live between the Flat Whale, 3D Whale, and Whale Girl characters.

### Aggregate state · Pet behavior
- **Aggregate state**: Idle · **Pet behavior**: Sleeping loop; mouse contact or dragging triggers an interaction, with optional non-topmost idle mode
- **Aggregate state**: Working · **Pet behavior**: Focused swimming or operating a task panel
- **Aggregate state**: Confirmation · **Pet behavior**: Surprise, head turn, or question-mark cue; highest priority
- **Aggregate state**: Completed · **Pet behavior**: A short celebration for top-level tasks only
- **Aggregate state**: Blocked · **Pet behavior**: A short tired or concerned response for top-level tasks only

The pet can be dragged across monitors and stores normalized per-monitor positions. Resolution, scale, work-area, or display-topology changes remap it into a visible area; changing the startup corner clears the drag record. Windows “Show animations” accessibility preferences reduce every state to a representative still frame when animations are disabled.

Both the resident pet and short-lived sound processes are owned by the DSH subprocess service and exit cooperatively when disabled. A known retired pet ID is migrated to Flat Whale on the next launch; other unknown values continue to fail validation.

### 3. Plugin Community

`plugin-market` · **Settings → Plugin Community**

![Plugin Community page](assets/readme/plugin-community.png)

1. The first visit uses a bundled snapshot. “Sync latest index” uses ETags to fetch a schema-validated snapshot published by GitHub Actions every six hours, retrying temporary 429/502/503/504 responses.
2. Search by repository, package, description, or topic. A live preflight checks repository identity, commit, and distribution shape before installation.
3. One-click install is offered only for matching npm bundles with no install lifecycle scripts. Verifiable build-free source bundles can be installed at a pinned commit after confirmation; every other path links to its installation guide.
4. Install and uninstall run as cancellable background jobs. The target profile, bundle patch, and composition are verified afterward, with automatic rollback on failure.
5. The Installed tab separates market-managed plugins from externally managed ones. Only the former can be removed from this page.

Index publishing, network proxies, and credentials

The [`.github/workflows/update-plugin-index.yml`](.github/workflows/update-plugin-index.yml) workflow publishes the `market-index` branch. It enumerates the complete topic, revalidates only new or changed repositories, and refuses to overwrite the last result after an abnormal shrink or failed build. This project is also a built-in verified channel contribution, so it remains discoverable before the remote mirror catches up and is not duplicated afterward.

Neither the bundled snapshot nor automated index sync requires a GitHub token. The Host recognizes `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`, and `NO_PROXY`, including lowercase variants. If install preflight hits GitHub API limits, Settings can store a read-only, short-lived fine-grained token. It is sent only to the local DSH Host and stored through the credentials service.

The page displays index generation time. An index older than 24 hours receives an explicit warning while the last usable snapshot remains available.

### 4. MCP server manager

`mcp-server-manager` · **Settings → Plugins → Plugin configuration → MCP Servers**

![MCP server manager](assets/readme/mcp-server-manager.png)

1. Add a unique name and choose `stdio` or Streamable HTTP.
2. Configure command, arguments, working directory, and environment for `stdio`; configure an HTTP(S) URL and headers for HTTP.
3. The Host can import local Claude Code and Codex configurations in one pass. Duplicates are skipped and unsafe conversions report a reason.
4. Review the format audit at the top of the card and save. The Host starts, updates, or unloads each connection independently.

Environment and header values are masked when existing servers reach the browser. Unchanged secrets are not reconstructed from, or overwritten by, redacted snapshots.

### 5. pi-ai model request types

`model-input-types` · **Settings → Plugins → Plugin configuration → pi-ai model request types**

![pi-ai model request type settings](assets/readme/model-input-types.png)

Add pi-ai model overrides on the DSH Models page or in `settings.yaml`, then choose Provider default, Text only, or Text and images for each model. Changes save immediately.

The card appears only when the official `llm-pi-ai` settings namespace is available. It stores a capability declaration and does not probe the endpoint; verify that the provider truly accepts images before declaring Text and images.

### 6. Edit last message

`edit-last-message` · **Latest editable user-message bubble in the current session**

![Edit and resend the latest user message](assets/readme/edit-last-message.png)

1. Wait for the current session to finish, or stop it first.
2. Select Edit last mes