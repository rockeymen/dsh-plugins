![Abu — Your AI Desktop Office Assistant](website/assets/readme-cover.en.jpg)

# Abu

**Your AI Desktop Office Assistant — Just Leave It to Abu**

A locally-run AI desktop assistant inspired by Claude Code's Cowork mode.
Tell Abu what you need — it reads files, runs commands, writes docs, and builds reports, all on your machine.

[Download](#download) · [Quick Start](#quick-start) · [Features](#features) · [User Guide](docs/User-Guide.md) · [Build from Source](#build-from-source)

> 🚧 **Multi-Harness integration in progress:** Abu is evolving toward pluggable agent runtimes, with [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) among the first integration targets. Stable releases currently use Abu's native harness.

## Why Abu?

### Feature · Abu · Regular AI Chat · Traditional Automation
- **Feature**: Autonomous planning & task execution · **Abu**: :white_check_mark: · **Regular AI Chat**: :x: · **Traditional Automation**: :x:
- **Feature**: Read/write local files, run commands · **Abu**: :white_check_mark: · **Regular AI Chat**: :x: · **Traditional Automation**: :white_check_mark:
- **Feature**: Natural language interaction · **Abu**: :white_check_mark: · **Regular AI Chat**: :white_check_mark: · **Traditional Automation**: :x:
- **Feature**: 29 built-in skills + self-evolving (Abu grows its own) · **Abu**: :white_check_mark: · **Regular AI Chat**: :x: · **Traditional Automation**: :x:
- **Feature**: Multi-conversation Project aggregation · **Abu**: :white_check_mark: · **Regular AI Chat**: :x: · **Traditional Automation**: :x:
- **Feature**: Scheduled tasks & event triggers · **Abu**: :white_check_mark: · **Regular AI Chat**: :x: · **Traditional Automation**: :white_check_mark:
- **Feature**: IM bot (Lark/DingTalk/WeCom/Slack) · **Abu**: :white_check_mark: · **Regular AI Chat**: :x: · **Traditional Automation**: Partial
- **Feature**: Multi-agent parallel execution · **Abu**: :white_check_mark: · **Regular AI Chat**: :x: · **Traditional Automation**: :x:
- **Feature**: Browser & computer control · **Abu**: :white_check_mark: · **Regular AI Chat**: :x: · **Traditional Automation**: Partial
- **Feature**: 100% local data, privacy-safe · **Abu**: :white_check_mark: · **Regular AI Chat**: :x: · **Traditional Automation**: :white_check_mark:

## What's New

**[Download the latest stable release](https://github.com/PM-Shawn/Abu-Cowork/releases/latest)** · [Read the full changelog](CHANGELOG.md)

Recent highlights: **Workspace file tree + code canvas** (browse / preview / edit files in the side panel, CodeMirror source editing with auto-save, preview auto-refresh, version snapshots with rollback), **declarative progress panel** (the model declares its own plan steps and status via `report_plan`), **inline visualization widgets** (charts / HTML / Mermaid rendered inline in chat), **multi-endpoint provider presets** (Volcengine / Bailian / Zhipu access plans as curated presets + a unified add/edit modal), **per-model capabilities** (vision / tools / reasoning / token limits declared per model), plus **doc comment-to-chat**, **full internationalization**, and **signed + notarized macOS builds**.

> Full changelog per release: see [Releases](https://github.com/PM-Shawn/Abu-Cowork/releases).

## Preview

> Clean interface, powerful capabilities

WelcomeNatural language input — conversation is the command![](website/assets/screenshot-welcome.en.png)
Task ExecutionAutonomous planning & tool invocation for complex tasks![](website/assets/screenshot-execution.en.png)

Web Pages · Live PreviewGenerate a site and preview it live, side by side![](website/assets/screenshot-web-pages.en.png)
Content Creation · Live PreviewDraft documents with a real-time Markdown preview![](website/assets/screenshot-doc-edit.en.png)

Plan ModeHigh-risk tasks show a plan first — runs only after you confirm![](website/assets/screenshot-plan-mode.en.png)
Interactive QuestionsAbu pops an option card when it needs you to decide (single / multi-select)![](website/assets/screenshot-ask-question.en.png)

Multi-Agent ParallelUp to 5 background agents working at once, progress in real time![](website/assets/screenshot-multi-agent.en.png)
Desktop Pet · Activity TrayA floating pet on your desktop, its tray showing Abu's live status![](website/assets/screenshot-pet.en.png)

Theme · DarkA polished, low-glare dark theme![](website/assets/screenshot-theme.en.png)
Theme · LightSwitch between light / dark / follow-system![](website/assets/screenshot-theme-light.en.png)

LabsIn-progress features, off by default, opt-in (currently hosting: Desktop Pet)![](website/assets/screenshot-labs.en.png)

Permission ControlFile access requires user authorization![](website/assets/screenshot-permission.en.png)
IM Channel Chat@Abu in Lark/DingTalk to interact![](website/assets/screenshot-im-chat.en.png)

Skills29 built-in skills + self-evolving + custom![](website/assets/screenshot-skills.en.png)
MCP ConnectorsOne-click integration with Playwright, GitHub & more![](website/assets/screenshot-mcp.en.png)

Scheduled TasksCron-based scheduling for automated workflows![](website/assets/screenshot-schedule-create.en.png)
Triggers / WatchHTTP, file changes, IM messages auto-trigger tasks![](website/assets/screenshot-triggers.en.png)

AI Service ManagementMulti-provider management with health checks![](website/assets/screenshot-settings-ai.en.png)
IM Channel ConfigConnect Lark, DingTalk, WeCom & more![](website/assets/screenshot-settings-im.en.png)

Personal MemoryRemembers your preferences and work habits![](website/assets/screenshot-memory.en.png)
Security SandboxSeatbelt sandbox + network isolation for privacy![](website/assets/screenshot-security.en.png)

Soul (Personality)3 proactivity presets + custom SOUL.md for tone & style![](website/assets/screenshot-soul.en.png)
Diagnostic PanelOne-click self-check across AI / MCP / skills / network + bundle export![](website/assets/screenshot-diagnostic.en.png)

Expert AgentsA library of expert agents you can summon by @name![](website/assets/screenshot-agents.en.png)
Usage StatsRequests, tokens, cache hits, and per model / skill usage![](website/assets/screenshot-usage.en.png)

Projects & WorkspacesGroup work into projects, each with its own skills & MCP![](website/assets/screenshot-project.en.png)

Content Safety ScanThree permission modes (Request Approval / Smart Review / Full Autonomy) + scan agents / skills / memory for prompt injection & dangerous instructions![](website/assets/screenshot-security-scan.en.png)

## Features

### Core Capabilities

- **Autonomous Agent** — More than chat: plans, invokes tools, reads/writes files, executes commands, and completes complex tasks end-to-end
- **Plan Mode** — For high-risk steps (delete / overwrite / send / install), Abu first presents a step-by-step plan and waits for you to click "Confirm & run"; only read-only ops run while awaiting approval
- **Interactive questions** — When Abu needs you to decide (pick an approach, provide a parameter), it pops an option card above the composer; single or multi-select, with an "Other" free-text row
- **Per-conversation settings** — Permission mode (Request Approval / Smart Review / Full Autonomy) and model can be switched per conversation without bleeding across chats
- **Soul Personality System** — Three proactivity presets (Quiet / Buddy / Butler) decide when Abu speaks up; customize tone, address, reply style, and boundaries via `SOUL.md`
- **Self-Evolving Skills** — After you run a multi-step complex flow, Abu proactively offers "want to crystallize this into a skill?" — one click drafts it, you review, you accept. Next time, just name the skill; no need to re-explain
- **Smart Notification System** — Menubar unread count / sidebar badge / system notification auto-routed; notices queued to inbox while you're in fullscreen / DnD, surfaced via badges once you're back; audit trail kept for 180 days
- **Projects** — Promote a workspace into a Project: conversations in the same direction auto-aggregate; each project gets its own default model, skill set, and MCP connectors
- **Multi-Agent Parallel Execution** — Run up to 5 background agents simultaneously, each executing tasks independently with real-time progress tracking
- **Desktop Pet** (Labs) — Transparent floating window; left-click opens main window, right-click menu, drag-to-edge dock; **activity tray** shows Abu's live status (working / awaiting approval / done) and lets you reply inline while it waits
- **Theme switching** — Light / dark / system, via Settings → Appearance
- **Labs** — In-progress features, off by default, opt-in, may change or be removed (currently hosting: Desktop Pet)
- **Conversation Sharing** — Export any conversation to JSON in one click; API keys and local paths are auto-redacted before sharing
- **29 Built-in Skills** — PDF/PPTX/DOCX/Excel generation, frontend design, canvas design, algorithmic art, Mermaid/SVG/infographics, Abu's built-in browser, optional Chrome bridge, deep research, Agent self-reflection (reflect), workflow automation, and more — one-click install, fully customizable
- **MCP Protocol** — Connect to databases, search engines, GitHub, and other external services via Model Context Protocol
- **Browser Automation** — Zero-setup built-in browser for ordinary web tasks, plus an optional Chrome extension bridge for existing tabs and signed-in sessions
- **Computer Use** — Screenshot + mouse/keyboard control for desktop-level tasks, with sensitive app blocking, dangerous key interception, and a 5-minute session timeout
- **HTTP Fetch** — Built-in safety gateway: URL length cap, embedded credential blocking, cloud metadata endpoint blocking, 10 MB download limit, 60-second timeout — no more raw `curl` blind spots

### AI Services & Models

- **12+ Cloud Providers** — Anthropic Claude, OpenAI, DeepSeek, Qwen (Bailian), Doubao (Volcengine), Moonshot, Zhipu GLM, MiniMax, SiliconFlow, Qiniu, OpenRouter, and more
- **Local Models** — Zero-config Ollama integration with automatic local model discovery
- **Custom Endpoints** — Connect any OpenAI-compatible or Anthropic-compatible API
- **Provider Management** — Add, edit, delete, reorder providers with connection health checks and latency detection
- **Model Selector** — Switch models on-the-fly during conversations with capability badges (vision, tool use, web search, thinking, image generation, long context)
- **Favorites & History** — Star frequently used models, quickly switch between recent ones
- **Image Generation** — Built-in DALL-E 2 / DALL-E 3 support, plus any custom image-generation endpoint

### Web Search

- **Multiple Search Engines** — Bing, Brave, Tavily, SearXNG (self-hosted, no API key needed)
- **Independent Configuration** — Search engine settings decoupled from main AI service

### Automation & Triggers

- **Scheduled Tasks** — Cron-based scheduling (e.g., daily AI news digest at 9 AM); runs missed while the app was closed are replayed in time order on next launch
- **Trigger System** — Multiple event sources to automatically invoke agents:
  - **File Watcher** — Monitor file create/modify/delete events with glob patterns
  - **HTTP Webhook** — Auto-generated POST endpoints for external callbacks
  - **IM Messages** — Trigger tasks on specific incoming messages
  - **Cron Schedule** — Periodic execution on a time-based plan
- **Trigger Permission Model** — Four capability levels (read-only → safe tools → full access → custom whitelist) for fine-grained control

### IM Channel Integration

Turn Abu into your team bot — just @Abu in your chat:

- **Supported Platforms** — D-Chat, Feishu (Lark), DingTalk, WeCom, Slack
- **Session Management** — Auto-isolate conversations by user/group/thread, auto-archive on timeout, "continue last" recovery
- **Security Controls** — User allowlist, workspace path restrictions, capability level enforcement
- **Response Modes** — Mention-only or all-messages

### Memory & Context

- **Three-tier file-based memory (Memdir architecture)**:
  - **Personal Memory** — `~/.abu/memory/` multi-file directory, applies across all projects, auto-organized by topic with `MEMORY.md` index injected into the prompt
  - **Project Memory** — `~/.abu/projects/<workspace>/memory/` auto-isolated per workspace, each entry is a separate `.md` file for easy reading, search, and pruning
  - **Auto-migration** — Legacy `~/.abu/agents/abu/memory.md` and `{workspace}/.abu/MEMORY.md` are migrated automatically on startup
- **Project Rules** (hand-written):
  - `~/.abu/ABU.md` — User-level rules (cross-project)
  - `{workspace}/.abu/ABU.md` — Project-level rules
  - `{workspace}/.abu/rules/*.md` — Modular rules (loaded alphabetically, max 20 files)
- **Project Aggregation** — Promote a workspace into a Project to aggregate its conversations; older conversations auto-backfilled with `projectId` on startup. Each project can independently configure default model, skill set, and MCP connectors
- **Session Memory** — Large tool outputs automatically persisted to disk; compact summaries kept in-context to prevent context explosion
- **Persistent Todos** — Per-conversation `todo_write` plans persisted to disk and survive app restarts
- **Auto-Compaction** — Intelligently compresses long conversation history while preserving key context

### Security & Privacy

- **Three Permission Modes** — **Request Approval** (free read/write inside workspace; out-of-bounds writes and dangerous commands need confirmation; default) / **Smart Review** (out-of-bounds ops go to an AI reviewer: allow low-risk, block high-risk, ask only when unsure) / **Full Autonomy** (everything runs automatically except hard system red-lines); global default in Settings → Sandbox, also switchable per conversation via the chip above the composer
- **Content Safety Scan** — Scans agent-authored skills / memory entries to catch dangerous instructions, prompt injection, hardware commands, and 120+ other risk patterns
- **OS Sandbox** — macOS Seatbelt (`sandbox-exec`) / Windows PowerShell ConstrainedLanguage isolates shell command file access
- **Network Isolation** — Local proxy + domain whitelist + private-network toggle to control every outbound request
- **Path & Command Safety** — Sensitive directories (system folders, SSH keys, etc.) blocked by default; dangerous commands (`rm -rf /`, etc.) caught statically
- **Computer Use Safeguards** — 15+ blocked sensitive apps (Keychain, System Settings, WeChat, Slack, etc.), dangerous key interception (Cmd+Q, Cmd+Tab, Force Quit), session-level window hiding, 5-minute timeout
- **Encrypted API Key Storage** — Windows DPAPI / macOS AES-256-GCM with a hardware-UUID-derived key; keys are no longer written to localStorage in plaintext
- **Local-First** — Your data stays local, your API keys stay local — nothing goes through third-party servers
- **Cross-Platform** — Supports macOS (Apple Silicon / Intel) and Windows

### Diagnostics & Troubleshooting

- **One-Click Self-Check** — Settings → Diagnostic, runs through AI service connectivity, data & permissions, MCP, skills, network, app environment
- **Diagnostic Bundle Export** — When something breaks, package logs / config / version info in one click (API keys and paths auto-redacted) and send it to the maintainer

> For detailed feature documentation, see the [User Guide](docs/User-Guide.md)

## Download

Head to [GitHub Releases](https://github.com/PM-Shawn/Abu-Cowork/releases) to download the latest version:

### Platform · File
- **Platform**: macOS (Apple Silicon) · **File**: `Abu-x.x.x-mac-arm64.dmg`
- **Platform**: macOS (Intel) · **File**: `Abu-x.x.x-mac-x64.dmg`
- **Platform**: Windows x64 · **File**: `Abu-x.x.x-windows-x64-setup.exe`

> Official macOS packages are signed and notarized. The Windows installer is current-user only and does not need administrator rights, but remains Authenticode-unsigned; SmartScreen may require **More info → Run anyway**. See the [Installation Guide](docs/Installation-Guide.md).

## Quick Start

### 1. Configure AI Service

Open Abu → Settings → **AI Service Management**:

- **Quickest setup**: Choose a provider (e.g., DeepSeek, Anthropic), enter your API Key, click verify
- **Local models**: Install [Ollama](https://ollama.com) — Abu auto-discovers local models, no API key needed
- **Custom endpoint**: Enter any OpenAI-compatible API's Base URL and Key

### 2. Start Chatting

Return to the main screen, use the model selector to pick your preferred model, and start chatting.

**Try these prompts:**

```
Organize the files on my desktop by type
```
```
Extract the tables from this PDF and generate an Excel file
```
```
Every morning at 9 AM, search for the latest AI news and generate a daily digest
```
```
Use the frontend design skill to create a product landing page
```
```
Create a weekly report PPT for this week
```

### 3. Level Up

- **Install skills**: Settings → Customize → Skill Store — install PDF, PPT, frontend design, and more
- **Connect MCP**: Settings → MCP Connectors — one-click integration with GitHub, Playwright, etc.
- **Set up schedules**: Have Abu automatically search news, run data, send reports daily
- **Connect IM**: Settings → IM Channels — let your team @Abu directly in Lark/DingTalk

> For more use cases, see the [User Guide](docs/User-Guide.md)

## Built-in Skills (29 total)

### Category · Skills
- **Category**: Document Generation · **Skills**: PDF, PPTX, DOCX, XLSX
- **Category**: Design & Creative · **Skills**: Frontend Design, Canvas Design, Algorithmic Art, SVG Diagram, Mermaid Diagram, Infographic, Slack GIF Creator, HTML Widget
- **Category**: Browser Automation · **Skills**: **Abu-Browser** (built-in, isolated session), **Abu-Chrome-Bridge** (optional Chrome extension for existing tabs and sign-in state)
- **Category**: Developer Tools · **Skills**: Claude API, MCP Builder, Web Artifacts Builder, Webapp Testing (Playwright)
- **Category**: Content Writing · **Skills**: Doc Co-authoring, Br