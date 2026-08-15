# IllusionAgent

*Where fantasy meets functionality. The best of many worlds, refined into one intelligent agent.*

## 📖 Introduction

IllusionAgent is an open-source AI agent platform. It unifies a multi-provider
LLM gateway, a bilingual (Chinese/English) CLI, a browser-based Web UI, and
a flexible extension ecosystem into a single intelligent agent — at home
on Windows, macOS, and Linux.

Whether you prefer the discipline of the terminal or the ease of the browser,
IllusionAgent resonates with your workflow: 35 built-in tools, 7 specialized sub-agents, 2 compaction methods, MCP server support, hooks, plugins, and
a cron scheduler for unattended automation — spanning Feishu, WeChat, and QQ.

> Standing on the shoulders of giants — Claude Code prompts, OpenHarness
> architecture, OpenClaw scheduling, kimi-cli infrastructure, hermes-agent
> channels, cc-switch routing.

### Core Features

- 🤖 **Multi AI Provider Support** - Anthropic, OpenAI, Copilot, Codex, and any compatible endpoint
- 🧠 **Multi-Agent Collaboration** - 7 built-in specialized Agents
- 🛠️ **Rich Toolset** - 35 built-in tools (31 base + 4 channel) + MCP dynamic tool extension
- 📦 **Context Compaction** - Microcompact (clear old tool results) + full compaction (LLM summary), auto-triggered as context fills
- 🌐 **Web UI Interface** - Browser-based chat interface with `illusion web`, independently usable alongside the terminal
- 🌍 **Bilingual Interface** - Chinese/English auto-switch via `ui_language` setting
- 📝 **Comprehensive Markdown Rendering** - Tables, code blocks, rich text
- 🔌 **Flexible Extension System** - Plugins, hooks, skills, MCP servers
- 🔐 **Comprehensive Permission Control** - Three modes + fine-grained rules
- 🎯 **Reasoning Effort Control** - low/medium/high/xhigh/max levels
- 🪟 **Deep Windows Optimization** - Auto-detect Git, PowerShell support
- 🖥️ **Zero Terminal Flicker** - Stable rendering based on Ink Static component
- 📦 **Desktop Edition** - Electron shell with bundled Python/Node.js, portable builds for Windows/macOS/Linux, zero environment setup

### Interface Preview

  Welcome screen & rich text rendering
  ![IllusionAgent welcome screen](docs/images/image1.png)
  ![IllusionAgent rich text rendering](docs/images/image2.png)

  Demo video
    ![Click to watch demo video](docs/images/illusion-agent-en.png)
  [📺 Watch demo on YouTube](https://www.youtube.com/watch?v=ExrzKVjWPls)

## 🚀 Quick Start

### Requirements

- Python >= 3.10
- Supports Windows, macOS, Linux
- Node.js 18+ (only for source install; `pip install illusion-agent` does not require Node.js)

### Installation

```bash
# Recommended: pip install from PyPI (no Node.js required)
pip install illusion-agent

# Alternative: from source (requires Node.js 18+)
git clone https://github.com/YunTaiHua/illusion-agent.git
cd illusion-agent
pip install .
```

### Desktop Edition

Prefer a desktop app without installing Python or Node.js? Download the portable
build for your platform — extract and run, zero environment setup:

### Platform · Download
- **Platform**: Windows · **Download**: `IllusionAgent-<version>-win-x64.zip`
- **Platform**: macOS · **Download**: `IllusionAgent-<version>-arm64.dmg`
- **Platform**: Linux · **Download**: `IllusionAgent-<version>.AppImage`

👉 [Download from GitHub Release](https://github.com/YunTaiHua/illusion-agent/releases/latest)

The desktop edition bundles Python 3.12 and Node.js 20 runtimes internally.
See [Desktop Edition docs](docs/en/desktop.md) for details.

### Basic Usage

```bash
# First-time: configure authentication and working directory
illusion auth login

# Start interactive session (recommended)
illusion

# Launch Web UI in browser
illusion web

# Non-interactive print mode
illusion -p "Analyze the structure of this project"

# Set or update working directory
illusion set "E:\Projects\my-project"
```

### Print Mode Notes

`-p` / `--print` runs a single non-interactive request and exits:

```bash
# Read-only analysis (safe, default permission mode)
illusion -p "Analyze the structure of this project"

# Allow file writes / command execution without interactive approval
illusion --permission-mode full_auto -p "Fix the failing tests"

# Resume after the process exits with code 2 (pending question/permission/plan)
illusion -c -p "Y"

# Specify model and effort for print mode
illusion -m env_1.model_2 -e high -p "Refactor this module"
```

Important details:

- The prompt value must be the **last argument** because typer parses `-p` greedily.
- In default permission mode, mutating tools exit with code **2** and persist a pending approval; answer it with `illusion -c -p "Y"`, `"F"`, or `"N"`.
- Exit codes: `0` success, `1` error, `2` waiting for cross-turn input.

### Interface Notes

The terminal (`illusion`) and Web UI (`illusion web`) are two independent, first-class interfaces. They share the same backend runtime, settings, and session storage — use whichever fits your workflow.

## 📚 Detailed Documentation

### Topic · English · 中文
- **Topic**: Introduction · **English**: [docs/en/introduction.md](docs/en/introduction.md) · **中文**: [docs/zh-CN/introduction.md](docs/zh-CN/introduction.md)
- **Topic**: Getting Started · **English**: [docs/en/getting-started.md](docs/en/getting-started.md) · **中文**: [docs/zh-CN/getting-started.md](docs/zh-CN/getting-started.md)
- **Topic**: Commands · **English**: [docs/en/commands.md](docs/en/commands.md) · **中文**: [docs/zh-CN/commands.md](docs/zh-CN/commands.md)
- **Topic**: Settings & Credentials · **English**: [docs/en/settings.md](docs/en/settings.md) · **中文**: [docs/zh-CN/settings.md](docs/zh-CN/settings.md)
- **Topic**: Project Files & Memory · **English**: [docs/en/project-files.md](docs/en/project-files.md) · **中文**: [docs/zh-CN/project-files.md](docs/zh-CN/project-files.md)
- **Topic**: Extensions (MCP, Plugins, Skills, Hooks) · **English**: [docs/en/extensions.md](docs/en/extensions.md) · **中文**: [docs/zh-CN/extensions.md](docs/zh-CN/extensions.md)
- **Topic**: Architecture · **English**: [docs/en/architecture.md](docs/en/architecture.md) · **中文**: [docs/zh-CN/architecture.md](docs/zh-CN/architecture.md)
- **Topic**: Token Metering & Compaction · **English**: [docs/en/token-metering.md](docs/en/token-metering.md) · **中文**: [docs/zh-CN/token-metering.md](docs/zh-CN/token-metering.md)
- **Topic**: Messaging Channels · **English**: [docs/en/channels.md](docs/en/channels.md) · **中文**: [docs/zh-CN/channels.md](docs/zh-CN/channels.md)
- **Topic**: Desktop Edition · **English**: [docs/en/desktop.md](docs/en/desktop.md) · **中文**: [docs/zh-CN/desktop.md](docs/zh-CN/desktop.md)

## 📄 License

This project is open-sourced under the [MIT](LICENSE) license.

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!