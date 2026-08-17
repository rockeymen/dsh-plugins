![Reasonix](docs/logo-ghost-wave-effect.svg)

  English
   · 
   · 
   · 
   · 
   · 
   · 
   · 
  [Discord](https://discord.gg/XF78rEME2D)

Open source · MIT · a single Go binary
### A coding agent you can leave running.
One local engine, four ways in — terminal, desktop app, browser, or your editor over ACP. Plan mode, permissions, a workspace sandbox and per-turn checkpoints keep a long autonomous run something you can still read and undo.

  <video src="https://github.com/user-attachments/assets/ab2f3878-e224-4931-8254-060e7695cfb9" controls preload="metadata" width="560"></video>

> [!IMPORTANT]
> **Community · 加入社区** — bilingual Discord for setup help (`#help` / `#求助`), workflow showcases, and feature ideas. → **<https://discord.gg/XF78rEME2D>**

## Features

- **Config-driven.** Providers, the agent, enabled tools, and plugins are all
  declared in `reasonix.toml`. No hardcoded models.
- **Multi-model & composable.** DeepSeek ships as a preset; any
  OpenAI-compatible endpoint is a config entry, not new code. Optionally run
  two models together (executor + planner) in separate, cache-stable sessions.
- **Plugin-driven.** MCP servers contribute tools, prompts, and resources;
  Extension Protocol v1 sidecars can also intercept runtime events, contribute
  Providers and structured UI, and ship versioned plugin packages.
- **Cache-aware context maintenance.** Startup injects a small stable environment
  summary, stale tool output is snipped/pruned before summary compaction, and the
  built-in tool schema contract is documented for regression review.
- **Zero-friction distribution.** `CGO_ENABLED=0` single binary; cross-compile
  to six targets with one command. The result is a fully self-contained static
  binary — nothing to install on the target machine beyond the binary itself.

## Install

Choose the path that matches how you want to use Reasonix. The CLI/TUI,
desktop app, and VS Code extension all use the same local Reasonix engine.

### Path A: CLI / TUI

Install the native binary through npm on any supported platform, or use
Homebrew on macOS:

```sh
npm i -g reasonix                  # any OS; pulls the prebuilt native binary
brew install esengine/reasonix/reasonix   # macOS
```

Prebuilt archives (`darwin|linux|windows × amd64|arm64`) and `SHA256SUMS` are on
every [GitHub release](https://github.com/esengine/DeepSeek-Reasonix/releases).

### Path B: Desktop app

Use the [official download page](https://reasonix.io/?download=desktop#start)
for the latest desktop build.

### Platform · Package · Architecture
- **Platform**: macOS · **Package**: Universal `.dmg` or `.zip` · **Architecture**: Apple Silicon / Intel
- **Platform**: Windows · **Package**: Installer `.exe` or portable `.zip` · **Architecture**: x64 / ARM64
- **Platform**: Linux · **Package**: `.deb` or `.tar.gz` · **Architecture**: x64

Windows installers are code-signed through [SignPath.io](https://signpath.io/)
with a free certificate provided by the [SignPath Foundation](https://signpath.org/).

### Path C: VS Code extension

Complete Path A first. The extension does not bundle the CLI; it starts your
local `reasonix acp` backend and adds native chat, editor context, tool-call
approvals, model selection, and workspace sessions.

- **VS Code:** [install from Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=SivanLiu.reasonix-agent)
- **VSCodium / Eclipse Theia:** [install from Open VSX Registry](https://open-vsx.org/extension/SivanLiu/reasonix-agent)
- **Extension ID:** `SivanLiu.reasonix-agent` · [source and usage guide](https://github.com/SivanCola/reasonix-vscode)

### Path D: Build from source

Clone the repository first:

```sh
git clone https://github.com/esengine/DeepSeek-Reasonix.git
cd DeepSeek-Reasonix
```

#### CLI

The CLI build requires **Go 1.25+**. The module pins a `toolchain` directive;
keep `GOTOOLCHAIN=auto` so Go downloads the pinned toolchain, or install it.

```sh
make build      # -> bin/reasonix(.exe)
make cross      # -> dist/ (darwin|linux|windows × amd64|arm64)
```

#### Desktop

The desktop build additionally requires:

- **Node 24+ and pnpm 10** (`npm install -g pnpm@10`) for the frontend
- **Wails CLI** matching the shared `.wails-version` pin

```sh
make wails-install
cd desktop
wails build
```

See the [desktop build guide](desktop/README.md#prerequisites) for platform
webview dependencies and Linux build tags.

## Quick start

### CLI / TUI

These commands are for the CLI/TUI installed through Path A:

```sh
reasonix setup                      # configure a provider and model
reasonix                            # start an interactive session
reasonix run "implement the TODOs in main.go"
```

In an interactive session, run `/init` when you want Reasonix to create project
instructions.

### Desktop app

Download the installer for your platform from the
[official download page](https://reasonix.io/?download=desktop#start), install
and launch Reasonix, then configure a provider and model in the app. The CLI
commands above are not required for the desktop app.

For advanced CLI usage and configuration, see the **[CLI reference](./docs/CLI.md)**,
**[Guide](./docs/GUIDE.md)**, and
**[configuration paths](./docs/CONFIG_PATHS.md)**.

## Documentation

- **Getting started:** [Guide](./docs/GUIDE.md) · [CLI reference](./docs/CLI.md) ·
  [Configuration paths](./docs/CONFIG_PATHS.md) · [ACP editor integration](./docs/ACP.md)
- **Features & troubleshooting:** [Subagent profiles](./docs/SUBAGENT_PROFILES.md) ·
  [Context Engine v2](./docs/SESSION_MEMORY_RETRIEVAL.md) ·
  [Capability diagnostics](./docs/CAPABILITY_DIAGNOSTICS.md) ·
  [Recovery and updates](./docs/RECOVERY.md) · [Bot guide](./docs/BOT_GUIDE.md) ·
  [Checkpoints & rewind](./docs/CHECKPOINTS.md)
- **Engineering & migration:** [Spec](./docs/SPEC.md) ·
  [Task contracts & pause policy](./docs/TASK_CONTRACT.md) ·
  [Tool contract](./docs/TOOL_CONTRACT.md) · [Migrating from 0.x](./docs/MIGRATING.md)
- **Extension development:** [Extensions](./docs/EXTENSIONS.md) ·
  [Plugin packages and Manifest v1](./docs/PLUGIN_PACKAGES.md) ·
  [Extension Protocol](./docs/EXTENSION_PROTOCOL.md) ·
  [Go SDK and starter](./sdk/go/README.md)