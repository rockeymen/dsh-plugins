# DSH for VS Code 🐳

Use the [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) web UI right inside VS Code: click a sidebar icon to embed DSH, which auto-starts (or reuses) the `dsh web` service — code and AI interface side by side, no more switching between terminal, browser, and IDE.

## 📸 Screenshot

![DSH for VS Code screenshot](docs/screenshots/overview.png)

## ✨ Features

- 🖱️ **One-click open**: a DSH whale icon in both the left Activity Bar and the right Secondary Side Bar — click either to embed the DSH page in that sidebar;
- 🚀 **Automatic service management**: auto-detects the port — reuses an already-running `dsh web`, otherwise starts one silently in the background and loads it once ready;
- 🔄 **Live status sync**: four-state status bar indicator (running green / starting yellow / failed red / stopped gray); click it to toggle the panel;
- 🛟 **Error fallbacks**: port occupied, `dsh` missing, start timeout, crash/disconnect — each has a dedicated page with one-click reconnect, never a blank screen;
- 🌐 **Bilingual UI**: copy follows the VS Code display language — Chinese for `zh-*`, English otherwise;
- 🧹 **Clean exit**: closing the window stops the auto-started service, no zombie processes; manually started services are never touched;
- 🔒 **Security boundary**: loopback addresses only (127.0.0.1 / localhost / [::1]); no credentials are read.

## 📥 Installation

**Option 1: Marketplace (recommended)**

Search for `DSH` (publisher Fengze233) in the VS Code Extensions view, or run:

```bash
code --install-extension Fengze233.dsh-vscode-panel
```

Marketplace page: <https://marketplace.visualstudio.com/items?itemName=Fengze233.dsh-vscode-panel>

**Option 2: .vsix package**

1. Download the latest `dsh-vscode.vsix` from [Releases](https://github.com/Fengze233/dsh-vscode/releases);
2. In VS Code press `Ctrl+Shift+P` → run `Extensions: Install from VSIX...` → select the file;
3. Reload the window (`Developer: Reload Window`).

**Option 3: Build from source**

```bash
git clone https://github.com/Fengze233/dsh-vscode.git
cd dsh-vscode
npm install
npm run package        # produces dsh-vscode.vsix, then install as in Option 2
```

**Prerequisite**: the `dsh` CLI from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) must be installed and on your PATH (the extension detects it and shows a hint if missing).

## 🚀 Usage

1. After installation, a DSH whale icon appears in both the left Activity Bar and the right Secondary Side Bar;
2. Click either icon: the extension auto-starts (or reuses) `dsh web` and embeds the DSH page in that sidebar;
   - Click the **right** icon → the panel opens on the right, leaving the file explorer untouched;
3. Panel title bar buttons: `Open in Browser` `Restart Service` `Stop Service` `Copy URL` `Show Logs`;
4. The bottom status bar shows the service status; click it to toggle the panel.

### Command palette (prefixed `DSH:`)

### Command · Description
- **Command**: `DSH: Open Panel` · **Description**: Open the left panel
- **Command**: `DSH: Open in Secondary Side Bar` · **Description**: Open the right panel
- **Command**: `DSH: Open in Browser` · **Description**: Open the DSH page in the system browser
- **Command**: `DSH: Restart Service` · **Description**: Restart the extension-managed service
- **Command**: `DSH: Stop Service` · **Description**: Stop the extension-started service
- **Command**: `DSH: Copy URL` · **Description**: Copy the DSH page URL
- **Command**: `DSH: Show Logs` · **Description**: Open the extension log output channel
- **Command**: `DSH: Retry Bridge Install` · **Description**: Reinstall the bridge and restart the service
- **Command**: `DSH: Uninstall Bridge` · **Description**: Remove the bridge package and restore `cordis.patch.yml`

## 🔗 Bridge integration

After installation, the extension installs its own bridge package `dsh-vscode-bridge` into DSH's official client-plugin extension point under your DSH user directory, enabling two integrations:

- 🔗 **External links**: clicking a link in the panel opens it in your system browser (instead of being trapped inside the iframe);
- 📂 **File jumps**: clicking a file path in the panel opens the file in VS Code.

### Install / uninstall mechanism (transparency disclosure)

To let the DSH page communicate with VS Code, the extension will:

1. Install its bridge package `dsh-vscode-bridge` into your DSH user directory (`$DSH_HOME/profiles/web`, default `~/.dsh/profiles/web`) via DSH's official client-plugin extension point;
2. Write a marked `insert:` entry (wrapped in `# dsh-vscode-bridge: begin` / `# dsh-vscode-bridge: end`) into `cordis.patch.yml`, registering the bridge as a DSH client plugin — writing only to the user directory and never touching the DSH installation directory.

To remove: run `DSH: Uninstall Bridge` — the extension deletes the marked entry and the bridge directory, restoring the original `cordis.patch.yml` (your own content is untouched).

### Bridge-related settings (`dsh.*`)

### Setting · Default · Description
- **Setting**: `dsh.bridge.enabled` · **Default**: `true` · **Description**: Enable the bridge (when off: no install, no injection, no warning; the two integrations are unavailable)
- **Setting**: `dsh.workspaceRootIndex` · **Default**: `0` · **Description**: For multi-root workspaces: which root to use as the `dsh web` process working directory (out-of-range falls back to the first)
- **Setting**: `dsh.bridge.silenceWarning` · **Default**: `false` · **Description**: Suppress the bridge degradation warning

### Degradation behavior

The bridge only works inside the panel. If it is inactive (e.g. you open the DSH page in a browser, or the install failed), the panel remains **fully usable** — only the two integrations above are unavailable; a one-time startup warning (with "Retry Install" / "Don't Show Again") is shown.

## ⚙️ Settings (`dsh.*`)

### Setting · Default · Description
- **Setting**: `dsh.port` · **Default**: `3080` · **Description**: Desired port (used for both detection and startup)
- **Setting**: `dsh.host` · **Default**: `127.0.0.1` · **Description**: Service address (loopback only)
- **Setting**: `dsh.autoStart` · **Default**: `true` · **Description**: Auto-start the service when it is not running
- **Setting**: `dsh.stopOnExit` · **Default**: `true` · **Description**: Stop the extension-started service when the last window closes
- **Setting**: `dsh.extraArgs` · **Default**: `[]` · **Description**: Extra arguments appended when starting `dsh web`

## 🌍 Localization

UI copy follows the VS Code display language (`Configure Display Language`): `zh-*` → Simplified Chinese, anything else → English.

## 🧑‍💻 Development

Requirements: Node.js ≥ 22, VS Code ≥ 1.91.

```bash
npm install
npm run test          # 75 unit/integration tests (including a full real dsh web flow)
npm run compile       # builds out/extension.js
npm run watch         # watch build
npm run typecheck     # type check
npm run package       # package .vsix
```

Debugging: open this folder in VS Code and press `F5` to launch the Extension Development Host.

```
src/
├── extension.ts          # entry: assembly and command registration
├── i18n.ts               # runtime copy dictionary (zh-* Chinese / otherwise English)
├── config.ts             # settings normalization (loopback whitelist)
├── service/
│   ├── detect.ts         # port probing (DSH marker detection)
│   ├── process.ts        # cross-platform subprocess wrapper (dsh / dsh.cmd)
│   └── manager.ts        # service manager state machine (core)
├── bridge/               # bridge: installer, handshake host, message handling, status
├── panel/
│   ├── html.ts           # panel page templates (minimal CSP)
│   └── provider.ts       # WebviewViewProvider (iframe + placeholder pages)
├── workspaceRoot.ts      # multi-root workspace resolution
└── statusbar.ts          # status bar controller
```

## 🧭 Known limitations

- The colored icon on the "Get Started with DSH" walkthrough card comes from Marketplace gallery data and only appears after the extension is published (the card itself works regardless);
- VS Code platform rule: the left icon opens the left panel, the right icon opens the right panel — the left icon cannot open the right panel.

## 🌐 Community

This is a DeepSeek Harness community plugin (topic: [`dsh-plugin`](https://github.com/topics/dsh-plugin)).

- DSH official repo: <https://github.com/deepseek-ai/deepseek-harness>
- Issue tracker: <https://github.com/Fengze233/dsh-vscode/issues>
- DSH community discussions: <https://github.com/deepseek-ai/deepseek-harness/discussions>

## 📄 License

[MIT](./LICENSE) © 2026 Fengze233