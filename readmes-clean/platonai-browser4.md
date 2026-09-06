# 🤖 Browser4

**Table of Contents**
- [🤖 Browser4](#-browser4)
  - [🌟 Introduction](#-introduction)
    - [✨ Key Capabilities](#-key-capabilities)
  - [Quick Start](#quick-start)
  - [🧭 Tool Selection Guide](#-tool-selection-guide)
    - [How to Interact with a Page](#how-to-interact-with-a-page)
    - [How to Extract Data](#how-to-extract-data)
    - [How to Process at Scale](#how-to-process-at-scale)
    - [How to Turn HTML into Spreadsheets — Zero Tokens](#how-to-turn-html-into-spreadsheets--zero-tokens)
  - [📦 Installation](#-installation)
  - [💡 CLI Guide for Humans](#-cli-guide-for-humans)
    - [Quick start](#quick-start-1)
    - [Mental model](#mental-model)
    - [Global options](#global-options)
    - [Key concepts before the command list](#key-concepts-before-the-command-list)
    - [Complete command reference](#complete-command-reference)
    - [Timeout environment variables](#timeout-environment-variables)
    - [State persistence](#state-persistence)
  - [🚀 Build from Source](#-build-from-source)
  - [Architecture](#architecture)
  - [📦 Modules Overview](#-modules-overview)
  - [🧪 Test Fixture Server (MockSite)](#-test-fixture-server-mocksite)
  - [🤝 Support & Community](#-support--community)
  - [📜 Documentation](#-documentation)
  - [🔧 Proxy Configuration](#-proxy-configuration---unblock-website-access)
  - [License](#license)

## 🌟 Introduction

💖 **Browser4 — an AI-native browser engine for autonomous agents, intelligent extraction, and large-scale web automation.** 💖

### ✨ Key Capabilities

* 🤖 **Agent Browser** — Enable AI agents to browse, interact, and automate real-world websites.
* 🧠 **ML-Powered Extraction** — Learn page structures and extract structured data without LLM token costs.
* ⚡ **High-Performance Runtime** — Coroutine-safe architecture supporting 100k–200k complex page visits per machine per day.
* 🧬 **Hybrid Intelligence** — Combine LLM, ML, X-SQL, and selectors for robust extraction and experience reuse.
* 📦 **Enterprise-Scale Automation** — Swarm crawling, CDP-native control, batch jobs, stateful sessions, plugins, extensions, and more.

## Quick Start

Paste the following instruction to your favorite AI agent like claude, codex, workbuddy or openclaw and run it:

```
Read https://browser4.io/SKILL.md and install browser4-cli (if not installed) for browser automation to perform the following task:

1. Open the browser in headed mode (`open --headed`) so the window is visible — this is a human-facing demo
2. go to amazon.com
3. search for pens to draw on whiteboards
4. compare the first 4 ones
5. write the result to a markdown file
```

## DeepSeek Harness integration

https://github.com/platonai/dsh-browser4

```
dsh plugin --profile web add dsh-browser4                  # npm registry
dsh plugin --profile web add github:platonai/dsh-browser4  # GitHub
```

## 🧭 Tool Selection Guide

Choosing the right tool for your task:

### How to Interact with a Page

Use `snapshot -i --boxes` to see clickable/typeable elements with refs like `e15`, then `click <ref>`, `fill <ref> "<text>"`, `type`/`press`, `select`, `hover`/`drag`/`scroll`, and `wait` to drive the page. All interaction commands accept CSS selectors too. Chain multiple steps efficiently with `batch`.

Typical interactive flow:

```bash
# Humans usually want to see the browser — open it headed
browser4-cli open --headed https://example.com/login
browser4-cli snapshot -i --boxes
browser4-cli fill e3 "user@example.com"
browser4-cli fill e4 "secret" --submit
browser4-cli wait --load networkidle
browser4-cli snapshot -i
```

### How to Extract Data

```
Need to extract data from a page?
├─ Interactive page (click, fill, scroll first)? → snapshot + refs, then extract
├─ Static page, one field? → htmlsnapshot get text "<selector>"
├─ Static page, all matches of one field? → htmlsnapshot get all text "<selector>"
├─ Static page, multiple correlated fields (title+price+url per item)?
│  → htmlsnapshot query --sql @query.sql
├─ Live JS / complex DOM logic? → eval --json
├─ Natural language ("find the product price")? → extract (needs LLM key)
└─ High volume, many pages? → crawl or swarm with --sql
```

### How to Process at Scale

```
Need to process multiple pages?
├─ Single list page (search results)? → htmlsnapshot query with DOM_LOAD_AND_SELECT
├─ List of known URLs (in a file)? → crawl --seed-file urls.txt --depth 0 --sql @query.sql
├─ Crawl from a start URL (follow links)? → crawl <url> --out-link-selector "..." --depth N
├─ Need parallel execution (high throughput)? → swarm create → swarm query --seed-file ...
├─ Repeated monitoring (check every hour)? → loop -- eval "..." -i 3600
└─ Just a few URLs in a shell script?
   → browser4-cli open --headed "https://first-url"   # humans: open once, visibly
   → for url in ...; do browser4-cli goto "$url"; ... done
```

### How to Turn HTML into Spreadsheets — Zero Tokens

[WebMiner](https://github.com/platonai/web-miner) runs ML clustering on downloaded HTML files to produce structured spreadsheets and interactive reports — **no LLM tokens, everything runs locally.** webminer is a first-class Browser4 CLI citizen: `browser4-cli webminer install` + `browser4-cli webminer all <html-dir>` runs the whole pipeline without PowerShell.

```
Have HTML files and want structured data — without tokens?
├─ < 20 pages? → browser4-cli crawl --seed-file urls.txt --depth 0 --sql @query.sql
├─ < 1,000 pages (small to medium)? → WebMiner Free (SMILE ML engine)
│  browser4-cli webminer install
│  browser4-cli webminer all ./pages/
│  → Interactive HTML report + Excel spreadsheets — local, zero cost
├─ > 1,000 pages (production scale)? → WebMiner Commercial (Apache Spark ML)
│  Same encode → cluster → views pipeline, distributed across machines
└─ Need to acquire pages first?
   ├─ Single pages: browser4-cli htmlsnapshot export
   ├─ Bulk download: browser4-cli crawl --seed-file urls.txt --depth 0
   └─ High throughput: browser4-cli swarm create → swarm query --seed-file ...
       Then feed the HTML directory to WebMiner
```

> **Pipeline:** `encode` (HTML → feature vectors → CSV) → `cluster` (KMeans, auto-detected K) → `views` (HTML report + Excel). Free tier uses the [SMILE](https://haifengl.github.io/) ML library for single-machine clustering (< 1,000 pages). Requires JDK 17+ (auto-detected). See [web-miner](https://github.com/platonai/web-miner) and `browser4-cli help webminer` for usage.

## 📦 Installation

Manually installation is optional since your AI agent is smart enough to install it after reading the SKILL.

Install browser4-cli globally using npm (requires Node.js):

```shell
npm install -g browser4-cli
browser4-cli install
```

Or bootstrap the native binary directly with a single command. The scripts
also install the Browser4 backend (runtime bundle) afterwards — running
`browser4-cli install` on a fresh machine, or `browser4-cli upgrade` when a
backend is already present (pass `--skip-backend` to skip this step):

**Windows (PowerShell):**
```powershell
irm https://browser4.oss-cn-beijing.aliyuncs.com/scripts/install-browser4-cli.ps1 | iex
```

**Linux / macOS (bash):**
```bash
curl -fsSL https://browser4.oss-cn-beijing.aliyuncs.com/scripts/install-browser4-cli.sh | bash
```

## 💡 CLI Guide for Humans

`browser4-cli` is a human-usable browser automation shell, not just an agent backend. You can drive a real browser, inspect state, extract structured data, run X-SQL, orchestrate crawl/swarm jobs, manage server plugins and skills, and hand long-running work to built-in AI features.

If you want the embedded agent-facing instructions, see [skills/browser4-cli/SKILL.md](skills/browser4-cli/SKILL.md). This section is the human reference.

### Quick start

```bash
# Open a visible browser session (humans usually want to see the window;
# agents should prefer the default headless mode — see SKILL.md)
browser4-cli open --headed https://browser4.io

# Inspect the page and get element refs
browser4-cli snapshot --boxes

# Interact using a ref from the snapshot
browser4-cli click e15
browser4-cli fill e16 "Browser4" --submit

# Extract data from the live page
browser4-cli get text "h1"

# Capture a static DOM snapshot for repeated extraction
browser4-cli htmlsnapshot
browser4-cli htmlsnapshot get text "#main-content"
browser4-cli htmlsnapshot query --sql @query.sql

# Save output
browser4-cli screenshot --full-page --filename page.jpg
browser4-cli pdf --filename page.pdf
```

### Mental model

1. **Session-oriented**: commands work against the current browser session; use `-s <name>` for isolated named sessions.
2. **Two page views**: `snapshot` is for interactive work with element refs like `e15`; `htmlsnapshot` is for DOM/X-SQL extraction with CSS selectors.
3. **Interactive vs static extraction**: use `click`, `fill`, `type`, `press`, `wait` when the page must be manipulated first; use `htmlsnapshot query` when you need structured extraction from the DOM.
4. **Synchronous vs async jobs**: `agent`, `swarm`, `crawl`, and async chat-style commands return task IDs you poll later.

### Global options

These flags can appear before any command.

### Flag · Meaning
- **Flag**: `-h`, `--help [command\ · **Meaning**: category]` · Show top-level help, category help, or detailed command help
- **Flag**: `--help-json` · **Meaning**: Emit the machine-readable command reference
- **Flag**: `-v`, `--version` · **Meaning**: Print the CLI version
- **Flag**: `-s`, `--session <name>` · **Meaning**: Use a named session instead of the default session
- **Flag**: `--server <url>` · **Meaning**: Override the Browser4 server URL
- **Flag**: `--timeout <seconds>` · **Meaning**: Override the HTTP timeout for the current command
- **Flag**: `--proxy <url>` · **Meaning**: Proxy used for runtime downloads/install operations
- **Flag**: `--json` · **Meaning**: Emit machine-readable JSON only
- **Flag**: `--pretty` · **Meaning**: Pretty-print JSON output
- **Flag**: `-q`, `--quiet` · **Meaning**: Suppress normal human-readable output
- **Flag**: `-tip`, `--show-tip` · **Meaning**: Show a relevant tip on stderr after commands

### Key concepts before the command list

#### Element refs vs CSS selectors

- `snapshot` returns accessibility-tree refs such as `e5`, `e12`, `e42`
- most interaction commands accept either a snapshot ref or a CSS selector
- `htmlsnapshot` commands use CSS selectors, not accessibility refs

#### `snapshot` vs `htmlsnapshot`

### Tool · Best for · Input model · Output model
- **Tool**: `snapshot` · **Best for**: clicking, typing, finding interactive elements · **Input model**: live accessibility tree · **Output model**: refs like `e15`
- **Tool**: `htmlsnapshot` · **Best for**: DOM inspection, CSS extraction, X-SQL · **Input model**: stored HTML snapshot · **Output model**: CSS selectors and query results

#### LLM configuration

AI-powered commands such as `extract`, `summarize`, `chat`, `agent run`, and X-SQL `llm_*` functions require an LLM provider key.

### Provider · Environment variables
- **Provider**: DeepSeek · **Environment variables**: `DEEPSEEK_API_KEY`
- **Provider**: OpenRouter · **Environment variables**: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL_NAME`, `OPENROUTER_BASE_URL`
- **Provider**: Volcengine · **Environment variables**: `VOLCENGINE_API_KEY`, `VOLCENGINE_MODEL_NAME`, `VOLCENGINE_BASE_URL`
- **Provider**: OpenAI-compatible · **Environment variables**: `OPENAI_API_KEY`, `OPENAI_MODEL_NAME`, `OPENAI_BASE_URL`
- **Provider**: Aliyun Qwen · **Environment variables**: `OPENAI_API_KEY`, `OPENAI_MODEL_NAME`, `OPENAI_BASE_URL`

```bash
export DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### Complete command reference

#### Session lifecycle and server administration

### Command · Description
- **Command**: `open [url]` · **Description**: Open a browser session or reconnect to an existing one. **Headless by default.** Supports `--headed` (visible window), `--headless`, `--profile `, `--profile-mode <DEFAULT\ · SYSTEM_DEFAULT\ · SEQUENTIAL\ · TEMPORARY>`, `--interact-level <FASTEST\ · FAST\ · DEFAULT>`.
- **Command**: `attach` · **Description**: Attach to an existing browser via CDP or the Browser4 extension. Supports `--cdp <url\ · port\ · channel>` and remote endpoint options.
- **Command**: `close` · **Description**: Close the active browser session.
- **Command**: `list` · **Description**: List browser sessions with their status and next-open behavior. Supports `--all`.
- **Command**: `session-default <name>` · **Description**: Make a named session become the default unnamed session.
- **Command**: `close-all` · **Description**: Close all sessions without stopping the backend.
- **Command**: `kill-all` · **Description**: Force-stop the backend and Browser4-managed browser processes.
- **Command**: `stop` · **Description**: Gracefully stop the Browser4 server.
- **Command**: `status` · **Description**: Show server version, port, and health.
- **Command**: `doctor` · **Description**: Run diagnostics: build info, LLM status, stale daemon cleanup, optional repair. Supports `--verbose` and `--fix`.
- **Command**: `doctor log [name]` · **Description**: List, view, tail, or grep backend log files. Supports `--tail`, grep-style flags, and `doctor log <name> grep `.
- **Command**: `doctor metrics [filter]` · **Description**: List, filter, or grep backend metrics. Supports `doctor metrics grep `.
- **Command**: `delete-data` · **Description**: Delete session data.
- **Command**: `install` · **Description**: Install the Browser4 runtime bundle. Supports `--tag <version>` and `--force`.
- **Command**: `upgrade` · **Description**: Upgrade the CLI/runtime bundle. Supports `--tag <version>` and `--force`.
- **Command**: `uninstall` · **Description**: Remove global installs and runtime data. Supports `-y`, `--yes`, and `--dry-run`.

```bash
browser4-cli open --headed https://example.com
browser4-cli attach --cdp chrome
browser4-cli doctor --verbose
browser4-cli doctor log server.log --tail
browser4-cli doctor metrics grep request
```

#### Navigation

### Command · Description
- **Command**: `goto <url>` · **Description**: Navigate to a URL; auto-opens/reconnects a session if needed.
- **Command**: `go-back` · **Description**: Go back in browser history.
- **Command**: `go-forward` · **Description**: Go forward in browser history.
- **Command**: `reload` · **Description**: Reload the current page.

#### Core interaction

All interaction commands accept a snapshot ref such as `e15` or a CSS selector unless noted otherwise. Most of them also support `--no-snapshot` to skip the automatic post-action accessibility snapshot.

### Command · Description
- **Command**: `click <ref> [button]` · **Description**: Click an element. Supports `--modifiers`, `--follow`, `--auto-dismiss-dialogs`.
- **Command**: `dblclick <ref> [button]` · **Description**: Double-click an element. Supports `--modifiers`, `--follow`, `--auto-dismiss-dialogs`.
- **Command**: `hover <ref>` · **Description**: Hover over an element.
- **Command**: `fill <ref> <text>` · **Description**: Clear and fill text into an editable field. Supports `--submit`, `--verify`.
- **Command**: `type <text> [ref]` · **Description**: Type text into the focused element or a target element. Supports `--submit`, `--verify`, `--focus`, `--interactable-timeout`.
- **Command**: `press <key> [ref]` · **Description**: Press a key on the focused element or a target element. Supports `--verify`, `--follow`.
- **Command**: `select <ref> <value>` · **Description**: Select a dropdown value. Supports `--verify`.
- **Command**: `check <ref>` · **Description**: Check a checkbox or radio button.
- **Command**: `uncheck <ref>` · **Description**: Uncheck a checkbox or radio button.
- **Command**: `drag <startRef> <endRef>` · **Description**: Drag and drop from one element to another.
- **Command**: `wait [target]` · **Description**: Wait for a selector/ref, duration, text, URL pattern, page-load state, or JavaScript expression. Supports `--timeout`, `--text`, `--url`, `--load`, `--fn`.

`wait --load` accepts `domcontentloaded`, `load`, and `networkidle`.

```bash
browser4-cli click e8 --follow
browser4-cli fill e4 "john@example.com" --submit
browser4-cli type "Browser4" e7 --verify
browser4-cli wait --text "Success"
browser4-cli wait --load networkidle
```

#### Keyboard and mouse

### Command · Description
- **Command**: `keydown <key>` · **Description**: Press and hold a key.
- **Command**: `keyup <key>` · **Description**: Release a held key.
- **Command**: `mousemove <x> <y>` · **Description**: Move the mouse to screen/page coordinates.
- **Command**: `mousedown [button]` · **Description**: Press a mouse button.
- **Command**: `mouseup [button]` · **Description**: Release a mouse button.
- **Command**: `mousewheel <dx> <dy>` · **Description**: Scroll using a wheel delta.
- **Command**: `scroll <direction> ` · **Description**: Scroll the page `up`, `down`, `left`, or `right`.

#### Page inspection and live extraction

### Command · Description
- **Command**: `snapshot` · **Description**: Capture an accessibility-tree snapshot. Supports `--boxes`, `-i/--interactive`, `-u/--urls`, `-c/--compact`, `--no-compact`, `-d/--depth`, `-l/--limit`, `-s/--selector`, `--raw`, `--stdout`, `-vp/--viewport`, `--filename`.
- **Command**: `snapshot grep ` · **Description**: Search saved/current snapshot YAML with grep-style flags such as `-i`, `-v`, `-c`, `-l`, `-F`, `-w`, `-A`, `-B`, `-C`, `--selector`, `--page`, `--page-size`, `--all`.
- **Command**: `snapshot list` · **Description**: List saved snapshot files with timestamps and sizes.
- **Command**: `snapshot clean` · **Description**: Remove old snapshot files. Supports `--dry-run`.
- **Command**: `get <mode> <selector> [name]` · **Description**: Extract `text`, `html`, `box`, `styles`, `property`, or `attr` from a live page element.
- **Command**: `eval [expression] [ref]` · **Description**: Evaluate JavaScript on the page or an element. Supports 