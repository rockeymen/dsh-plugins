![DSH Codex UI](assets/branding/dsh-banner.png)

  # DSH Codex UI

  **Rebuild the DeepSeek Harness Web sidebar, workspace tree, search, and turn navigation in a Codex-style layout**

> DSH Codex UI is a community-maintained DeepSeek Harness (DSH) plugin, not an official DeepSeek AI product. It uses public DSH slots only and does not modify host source code or conversation data.

## Features

- Replace the default sidebar through the official `sidebar` slot and keep `sidebar.workspaces`, `sidebar.settings`, and `sidebar.footer.action`.
- Provide a Codex-style header with brand wordmark, sidebar collapse, and global search.
- List workspaces and conversations with expand/collapse, drag reorder, project pinning, unread dots, and running-state indicators.
- Add project and conversation menus for rename, pin, unread, archive, fork, open folder, copy, and delete.
- Restyle the conversation column and composer card, and add a compact turn navigator on the current session.
- Show companion-plugin status in **Settings → About**, and install the missing pieces from npm.

## Screenshots

Light theme: Codex-style sidebar, workspace tree, and conversation column.

![Light theme conversation](assets/screenshots/conversation-light.png)

Dark theme: the same layout with Codex dark tokens.

![Dark theme conversation](assets/screenshots/conversation.png)

Conversation menu: rename, pin, unread, archive, fork, copy, and delete.

![Conversation menu](assets/screenshots/session-menu.png)

**Settings → About** lists the companion plugins and their install state.

![About page and companion plugins](assets/screenshots/settings-about.png)

## Prerequisites

- A working DeepSeek Harness Web installation with `dsh` available in PowerShell.
- Examples use the `web` profile; replace it with the target profile.
- Source installation and development require Node.js 22+ and pnpm. Installing from npm does not require running `pnpm install` in an arbitrary directory.

## Plugin combo

`@michengai/dsh-codex-suite` is the one-click combo. It installs these six plugins into the same profile:

### Plugin · npm package · Role
- **Plugin**: Codex UI · **npm package**: `@michengai/dsh-codex-ui` · **Role**: Codex-style sidebar, workspace tree, search, and turn navigation
- **Plugin**: Expert management · **npm package**: `@michengai/dsh-agency-agents` · **Role**: Settings page opened from **Experts**
- **Plugin**: Skill management · **npm package**: `@michengai/dsh-skills-manager` · **Role**: Settings page opened from **Skills**
- **Plugin**: Archive management · **npm package**: `@michengai/dsh-archive-manager` · **Role**: Permanent deletion and archived-session management
- **Plugin**: IM Assistant · **npm package**: `@michengai/dsh-im-connect` · **Role**: IM settings and the **Channels** tab
- **Plugin**: Scheduled tasks · **npm package**: `@michengai/dsh-automation` · **Role**: Scheduled-task settings and the **Schedule** tab

`dshmarket` stays optional. When it is installed, **Plugins** opens the market first.

Do not install the suite and the individual plugins in the same profile. The two patch sets conflict.

## DSH product ecosystem

Codex UI can be installed independently or used through the desktop app or Web suite. They share the same DSH core but serve different ways of working:

### Product · Relationship to Codex UI
- **Product**: [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) · **Relationship to Codex UI**: The host runtime that provides models, sessions, tools, and the plugin system
- **Product**: [DSH Codex Desktop](https://github.com/MichengAI/dsh-codex-desktop) · **Relationship to Codex UI**: A ready-to-install desktop product with Codex UI and the other five feature products built in
- **Product**: [DSH Codex Suite](https://github.com/MichengAI/dsh-codex-ui/tree/main/packages/dsh-codex-suite) · **Relationship to Codex UI**: A one-click suite for existing DSH Web environments that installs Codex UI and the other five feature products
- **Product**: Six feature products · **Relationship to Codex UI**: [Codex UI](https://github.com/MichengAI/dsh-codex-ui) · [IM Connect](https://github.com/MichengAI/dsh-im-connect) · [Automation](https://github.com/MichengAI/dsh-automation) · [Skills Manager](https://github.com/MichengAI/dsh-skills-manager) · [Archive Manager](https://github.com/MichengAI/dsh-archive-manager) · [Agency Agents](https://github.com/MichengAI/dsh-agency-agents)

## Installation

`dsh plugin add` forwards to `pnpm add` in the profile directory. Without a version and official registry, a local mirror or minimum-release-age policy can leave you on an older build.

### Ask another agent to install the suite

Copy one of the sentences below into DSH, Codex, or WorkBuddy and let that agent install the combo into your local `web` profile.

From npm:

```text
Install the latest DSH plugin suite @michengai/dsh-codex-suite into my local web profile using the official npm registry: dsh plugin --profile web add @michengai/dsh-codex-suite@latest --registry=https://registry.npmjs.org/. Then run dsh --profile web --dump-config, confirm codex-ui, agency-agents, skills-manager, archive-manager, im-connect, and dsh-automation are mounted, and remind me to restart DSH Web and hard-refresh the browser.
```

UI only:

```text
Install the latest DSH plugin @michengai/dsh-codex-ui into my local web profile using the official npm registry: dsh plugin --profile web add @michengai/dsh-codex-ui@latest --registry=https://registry.npmjs.org/. Then run dsh --profile web --dump-config, confirm codex-ui is mounted, and remind me to restart DSH Web and hard-refresh the browser.
```

### Product · How to use it
- **Product**: DSH · **How to use it**: Send one of the sentences above to the current session.
- **Product**: Codex · **How to use it**: Send one of the sentences above to Codex and let it install locally.
- **Product**: WorkBuddy · **How to use it**: Send one of the sentences above to WorkBuddy.

If `dsh` is not on PATH, replace the leading `dsh` with `npx --yes @deepseek-ai/dsh`.

### Install the complete suite

This is the one-click combo. Run it from any PowerShell directory:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile web add @michengai/dsh-codex-suite@latest --registry=https://registry.npmjs.org/
dsh --profile web --dump-config
```

To pin a release, replace `@latest` with a version such as `@0.1.0`.

Restart DSH Web and hard-refresh the browser. If the profile already has any of the six plugins installed individually, uninstall those plugins first.

### Install Codex UI only

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile web add @michengai/dsh-codex-ui@latest --registry=https://registry.npmjs.org/
dsh --profile web --dump-config
```

The plugin takes over the default sidebar through `cordis.patch.yml`. Uninstalling restores the default sidebar.

### Install from source

Use this for debugging or unpublished changes. The cloned directory becomes the plugin source path:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location D:\Repository\deepseek-harness-plugin
git clone https://github.com/MichengAI/dsh-codex-ui.git
Set-Location .\dsh-codex-ui
pnpm install --frozen-lockfile
pnpm build
dsh plugin --profile web add .
dsh --profile web --dump-config
```

Restart DSH Web and hard-refresh the browser. Do not copy `dist` manually; local installation reads both package metadata and `cordis.patch.yml`.

## Usage

Open DSH Web. The left navigation is rendered by this plugin.

### Goal · Action
- **Goal**: Start a conversation · **Action**: Select **New task**, or use a workspace **+** / **New conversation** action.
- **Goal**: Find a conversation or setting · **Action**: Use the header search field and choose a session, Settings page, or quick action.
- **Goal**: Collapse the sidebar · **Action**: Use the header panel button. The expand control stays on the collapsed rail.
- **Goal**: Pin a workspace · **Action**: Drag it into **Pinned**, or use **Pin project** in the project menu.
- **Goal**: Manage a conversation · **Action**: Open the conversation menu to rename, pin, mark unread, archive, fork, copy, or delete.
- **Goal**: Jump between turns · **Action**: Use the turn marks on the left of the current conversation.
- **Goal**: Inspect connectors · **Action**: Open **Settings → Connectors**. Addresses, commands, and credentials are never shown.
- **Goal**: Check companion plugins · **Action**: Open **Settings → About** to install or update the combo plugins.

Deleting a workspace registration does not delete its folder or conversation records. Pinned and unread state is stored only in the current browser.

## Persistence and safety limits

### Data · Storage · Scope
- **Data**: Pinned workspaces · **Storage**: Host profile file with a `localStorage` cache · **Scope**: Survives DSH restarts and Desktop tray reloads
- **Data**: Pinned conversations · **Storage**: `localStorage` key `dsh.session-pins.v1` · **Scope**: Current browser only
- **Data**: Unread conversations · **Storage**: `localStorage` key `dsh.session-unread.v1` · **Scope**: Current browser only
- **Data**: Conversation records · **Storage**: DSH host services · **Scope**: Unchanged by this plugin

- The plugin uses only public DSH slots and services.
- It does not modify host source code or the conversation data model.
- Permanent deletion of archived conversations is provided by `@michengai/dsh-archive-manager`.
- The Connectors directory never exposes addresses, commands, or credentials.

## Secondary development

- [src\index.ts](src/index.ts): host entry and the non-sensitive Connectors directory endpoint.
- [src\client\index.ts](src/client/index.ts): client entry for sidebar, workspace tree, turn navigation, and Settings sections.
- [src\client\CodexSidebar.tsx](src/client/CodexSidebar.tsx): sidebar shell, search panel, and visual styles.
- [src\client\CodexWorkspaceBrowser.tsx](src/client/CodexWorkspaceBrowser.tsx): workspace and conversation interactions.
- `tests\*.assert.ts` and `tests\*.spec.ts`: interaction, visual, and runtime integration checks.

After changing `src`, rebuild, test, and install from the local directory:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm build
pnpm test
dsh plugin --profile web add .
```

New features should reuse existing DSH slots and public services. Do not depend on private host DOM or write conversation records.

## Verification

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm build
pnpm test
```