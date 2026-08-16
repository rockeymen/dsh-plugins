![EchoBird](docs/icon.png)

# EchoBird

AI deployment, no more chicken-and-egg.
<sub>AI 部署,不再是先有鸡还是先有蛋。</sub>

> **Note** — This repository is just one of several download channels
> and an issue tracker. For product information, announcements, and
> commercial inquiries, visit [echobird.ai](https://echobird.ai).

## 💜 Sponsors

  
    
    
    
      Thanks to CompShare (优云智算) for sponsoring EchoBird! CompShare is UCloud's AI cloud platform, offering stable, comprehensive access to domestic and overseas model APIs through a single API key. Its flagship Coding Plan (monthly or pay-per-call) delivers great value and supports GLM5.2, alongside officially-proxied stable overseas models. Plug it into Claude Code, Codex, or call the API directly — with enterprise-grade concurrency, 24/7 support, and self-service invoicing. Sign up via [this link](https://passport.compshare.cn/register?referral_code=LlOJAWughXiDXtP9v1Srra) to get a ¥5 free platform credit!
    
  

## What is EchoBird?

Friends kept asking me to install **Claude Code**, **OpenClaw**, **Hermes Agent**… every machine was different, and some refused to pay for an LLM. Setup and explanations took forever. So I built **EchoBird** — an Agent inspired by **Songbird**, the genius netrunner from _Cyberpunk 2077_ who solves any tech problem for V…

  ![EchoBird — My AI Career dashboard](https://github.com/user-attachments/assets/162f0428-a44d-4e83-9e10-c6b580ef0120)

## Highlights

EchoBird offers **4 scenarios** sharing a **unified model data hub** — **configure once, used everywhere**.

### 4 scenarios

- **Install & Repair Agent** — let an AI install and fix mainstream tools (Claude Code, OpenClaw, Hermes Agent, …); works locally and remotely
- **One-click local LLM** — bundled vLLM / SGLang / llama.cpp runtimes; pick a quant, hit START
- **My AI Projects** — onboard and manage your own vibe-coded apps and games inside EchoBird
- **App Manager** — one-click launch and management for every AI / Agent app & game

### Shared foundation

- **Model Nexus** — a unified data hub for OpenAI / Anthropic / local LLMs / API Routers; configure once and all 4 scenarios pick it up; one-click latency check before you commit

**Cross-platform** — Windows, macOS, Linux (x64 + arm64)

## Supported tools — install & switch models in one click

EchoBird bundles the install references and **writes each tool's native config
file**, so you install from one place and — crucially — **switch the model
with a single click**. Configure a provider once in Model Nexus, then point
any supported tool at it; no manual TOML / JSON editing, no per-CLI re-login.
This is the part most "model switcher" repos leave you to figure out alone.

### One-click install + one-click model switch

The tools below support **both** — install _and_ model switching — which is
the core of what EchoBird is for:

**Coding CLIs** — Claude Code · Codex CLI (OpenAI) · Grok Build (xAI) ·
Kimi Code (Moonshot) · Qwen Code · Aider · OpenCode · MiMo Code (Xiaomi) · Kilo Code ·
ZCode (Z.AI) · OpenClaw · Pi · OpenScience · Vibe-Trading

**Desktop apps** — Claude Desktop (3P profile) · ChatGPT desktop ·
OpenCode Desktop · WorkBuddy (Tencent CodeBuddy)

> Searching GitHub for "switch model for Grok Build" or "switch model for
> Kimi Code"? Those are first-class here — pick the model in Model Nexus,
> hit switch, and EchoBird rewrites `~/.grok/config.toml` or
> `~/.kimi-code/config.toml` for you.

### One-click install & launch

These are detected, installed, and managed by EchoBird, but model switching
is handled by the app itself (vendor-locked or no model config):

Hermes Desktop · Claude Science · Trae / Trae CN · Cursor · VS Code ·
Gemini Desktop · Coffee CLI

## Screenshots

### AI News & Star Projects — your daily AI brief

> Day & night, side by side — the rest of the screenshots below follow your GitHub theme.

  ![AI News (Light)](docs/screenshots/news-en-light.png)
  ![AI News (Dark)](docs/screenshots/news-en-dark.png)

  <sub>☀️ Light theme</sub>
  <sub>🌙 Dark theme</sub>

### Model Nexus — the unified model data hub, configure once

  
  ![](docs/screenshots/model-en-light.png)

### App Manager — one-click launch and management for every AI / Agent app

  
  ![](docs/screenshots/app-en-light.png)

### Local LLM — run models on your own machine

  
  ![](docs/screenshots/localllm-en-light.png)

### Install & Repair Agent — chat-driven setup and troubleshooting

  
  ![](docs/screenshots/agent-en-light.png)

## Install

### One-line install

**Windows** (PowerShell)

```powershell
irm https://echobird.ai/install.ps1 | iex
```

**macOS / Linux**

```sh
curl -fsSL https://echobird.ai/install.sh | sh
```

The script auto-detects your OS, downloads the right package, and skips if you're already on the latest version.

### Or download a package

Latest release → <https://github.com/edison7009/EchoBird/releases/latest>

### Platform · Asset
- **Platform**: Windows x64 · **Asset**: `EchoBird_<ver>_Windows_x64-setup.exe`
- **Platform**: macOS (Apple Silicon) · **Asset**: `EchoBird_<ver>_macOS_arm64.dmg`
- **Platform**: Linux x64 · Debian/Ubuntu · **Asset**: `EchoBird_<ver>_Linux_x64.deb`
- **Platform**: Linux arm64 · Debian/Ubuntu · **Asset**: `EchoBird_<ver>_Linux_arm64.deb`
- **Platform**: Linux x64 · Fedora/RHEL · **Asset**: `EchoBird_<ver>_Linux_x64.rpm`
- **Platform**: Linux arm64 · Fedora/RHEL · **Asset**: `EchoBird_<ver>_Linux_arm64.rpm`