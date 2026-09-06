![DeepCode — a harness-first desktop workspace for agentic coding](docs/user/deepcode/assets/deepcode-banner.png)

# ![](./apps/desktop/src/chrome/icon.png) DeepCode

  Use it like Codex. Inspect it like a lab. Extend it like Harness.

  A DeepSeek-native Agent Workbench for Windows, powered by DeepSeek Harness.

DeepCode turns [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) into a complete Windows product: install it, connect DeepSeek, choose a workspace, and let an agent inspect, edit, browse, run tools, and explain its work. Harness remains the only runtime and source of session, model, credential, permission, tool, memory, compaction, and plugin state.

**Unofficial product:** DeepCode is not affiliated with or endorsed by DeepSeek. The upstream Harness runtime and official Web UI are DeepSeek's work.

## Download

### Platform · Download · Requirements
- **Platform**: Windows · **Download**: [Download the installer](https://github.com/See-Sol-Lab/DeepCode/releases/download/v1.0.0/DeepCode-Setup-1.0.0.exe) · **Requirements**: Windows 10/11, x64

DeepCode installs for the current Windows user without administrator rights and includes its own Harness runtime, Node.js, and pnpm.

Or download the latest installer and checksum from PowerShell with [GitHub CLI](https://cli.github.com/):

```powershell
gh release download --repo See-Sol-Lab/DeepCode --pattern 'DeepCode-Setup-*.exe' --pattern 'SHA256SUMS.txt' --clobber
```

DeepCode V1 is not code-signed, so Windows SmartScreen may show an unknown-publisher warning. Download [`SHA256SUMS.txt`](https://github.com/See-Sol-Lab/DeepCode/releases/download/v1.0.0/SHA256SUMS.txt) from the same release and verify the installer before running it:

```powershell
Get-FileHash .\DeepCode-Setup-1.0.0.exe -Algorithm SHA256
```

Continue only when the printed hash matches the release manifest exactly, then run `Start-Process .\DeepCode-Setup-1.0.0.exe`. See the [installation and troubleshooting guide](docs/user/deepcode/data-troubleshooting.md#windows-smartscreen-blocks-the-installer).

## Quick start

1. Install and launch DeepCode.
2. Open **Settings → Models** and enter your DeepSeek API key.
3. Select a model. Choose an image-capable model when the task includes screenshots or other visual input.
4. Return to the home page and choose a workspace folder.
5. Start a session and give the agent one concrete outcome.
6. Review tool approvals and the resulting file changes.

The [DeepCode quick-start guide](docs/user/deepcode/quickstart.md) walks through the complete first session.

## Why DeepCode

###  · 
- **Harness-native** · Profiles, sessions, tools, credentials, permissions, memory, compaction, hooks, and plugins stay in the native Harness composition. DeepCode does not create a second agent runtime.
- **DeepSeek-first** · DeepSeek models, reasoning, image input, and Harness behavior are first-class product paths rather than compatibility afterthoughts.
- **A real Windows product** · One-click current-user installation, resident tray, model settings, DSH Terminal, updates, feedback, diagnostics, and an uninstall data choice.
- **Observable and recoverable** · Live Harness status, explicit targets, redacted diagnostics, last-known-good Profile recovery, and protected plugin changes make failures understandable and reversible.
- **Safer execution** · Sandbox is the recommended default, approvals remain owned by Harness, Full Access always carries an explicit warning, and browser submissions require approval.
- **Programmable** · Use arbitrary compatible Harness Profiles and Cordis plugins, inspect the active composition, and keep the official DSH CLI close at hand.

## Product tour

![A completed DeepCode coding task that creates and runs a JavaScript file](docs/user/deepcode/assets/workbench-overview.png)

### Work with code, files, and images

Choose a workspace, resume durable sessions, attach images to a vision-capable model, stream results, and review tool activity without leaving the desktop application.

![A DeepCode vision session correctly describing an attached interface screenshot](docs/user/deepcode/assets/vision-response.png)

### Give the agent a real browser

DeepCode's built-in browser uses visible Microsoft Edge, checks navigation targets and redirects against SSRF rules, keeps physical mouse and keyboard control with the user, and routes sensitive submissions through Harness approval.

![A DeepCode session using the built-in browser to inspect a public webpage](docs/user/deepcode/assets/browser-panel.png)

### Inspect and control the Harness

Switch Managed or Existing Homes, select Profiles, inspect effective plugin state, manage compatible plugins through the official CLI path, and recover a failed change without hiding what happened.

![DeepCode Settings with general, model, plugin, and agent preset controls](docs/user/deepcode/assets/settings-panel.png)

## What ships in V1

- Windows 10/11 x64 installer and portable unpacked build.
- DeepSeek and custom model configuration through Harness settings.
- Text and image input for models that advertise the corresponding modality.
- Workspace-based coding sessions with native Harness tools and approvals.
- Managed and Existing Harness Homes with Profile discovery and switching.
- Plugin Manager with target confirmation, streamed output, post-checks, and protected recovery.
- Built-in real-browser tools and a visible Browser Panel.
- Sandbox, Full Access, Read-only, and Custom permission reporting.
- DSH Terminal with private runtime shims and no system PATH modification.
- Update verification, local diagnostics export, feedback, system tray, and bilingual Chinese/English desktop copy.

DeepCode V1 is tested on Windows x64. It is not code-signed and does not ship macOS or Linux builds, an account system, automatic startup, or a plugin marketplace.

## Documentation

### Guide · What it covers
- **Guide**: [Quick start](docs/user/deepcode/quickstart.md) · **What it covers**: Install, connect DeepSeek, choose a workspace, and finish the first session.
- **Guide**: [Models and vision](docs/user/deepcode/models.md) · **What it covers**: API keys, model selection, image input, and custom providers.
- **Guide**: [Workspaces and sessions](docs/user/deepcode/workspaces-sessions.md) · **What it covers**: Workspace scope, durable sessions, attachments, review, and tray behavior.
- **Guide**: [Profiles and plugins](docs/user/deepcode/profiles-plugins.md) · **What it covers**: Managed/Existing Homes, Profile switching, plugin operations, and recovery.
- **Guide**: [Permissions and approvals](docs/user/deepcode/permissions.md) · **What it covers**: Sandbox, Full Access, approvals, Existing Home behavior, and browser permissions.
- **Guide**: [Desktop tools](docs/user/deepcode/desktop-tools.md) · **What it covers**: Browser, DSH Terminal, updates, diagnostics, feedback, and lifecycle.
- **Guide**: [Data and troubleshooting](docs/user/deepcode/data-troubleshooting.md) · **What it covers**: Data locations, privacy, uninstall behavior, common failures, and support.

The documentation website also retains the upstream Harness development tutorials and reference material for plugin authors and advanced users.

## Data and privacy

DeepCode stores its Managed Harness Home under `%APPDATA%\DeepCode\dsh`. Credentials, settings, sessions, Profiles, and plugins stay in that Home unless the configured model provider or a tool transmits content required by the task.

Service logs redact credential-shaped text. Diagnostics bundles are created locally and never uploaded automatically. Review crash dumps before sharing them because they can still contain local paths or memory fragments.

Uninstall asks whether to remove `%APPDATA%\DeepCode`. Keeping it preserves credentials, settings, sessions, and Profiles for a later reinstall.

## Build from source

### Run DeepCode Desktop from source

DeepCode development requires the Node.js version declared by the repository and pnpm:

```sh
git clone https://github.com/See-Sol-Lab/DeepCode.git
cd DeepCode
pnpm install
pnpm run build
pnpm run dev:desktop
```

Build the Windows distribution with:

```sh
pnpm run build:desktop-dist
```

See [DeepCode Desktop](apps/desktop/README.md) for engineering details and packaging verification.

### Run Harness from npm

Install Node.js, then start the upstream Web UI with:

```sh
npx @deepseek-ai/dsh web
```

The command opens `http://127.0.0.1:3080` for a local launch.

### Run Harness from source

The public DeepCode tree contains the upstream Harness source used by the desktop build:

```sh
pnpm install
pnpm run build
pnpm dsh web
```