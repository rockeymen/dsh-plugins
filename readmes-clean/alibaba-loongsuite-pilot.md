# LoongSuite Pilot

[Quick Start](#quick-start) | [Documentation](#documentation) | [Agent Onboarding](docs/agent-onboarding.md) | [License](#license)

LoongSuite Pilot is a local telemetry collector for AI coding agents. It discovers supported agents on a developer machine, installs the required hooks or plugins, normalizes activity into a shared GenAI event schema, and exports logs or traces to your chosen backends.

  ![LoongSuite Pilot local dashboard](docs/_assets/img/dashboard.png)
  
  Built-in local dashboard — multi-agent token usage, sessions, requests, tools, models, providers, and repository activity at a glance.

## Why LoongSuite Pilot?

Development teams often use more than one AI coding agent, and each agent records activity in a different local format. Pilot gives teams one local collector that can discover those agents, collect their activity, normalize the data, and send it to destinations that are useful for analysis, audit, and observability.

Pilot is designed to answer practical questions:

- Which agents are being used?
- What model, session, turn, and tool activity happened?
- How much token usage is available from each agent?
- Where should the data be exported: local files, SLS, HTTP, or traces?
- How should sensitive prompts, tool arguments, and secrets be controlled before export?

## Core Capabilities

### Capability · What Pilot Does
- **Capability**: Agent discovery · **What Pilot Does**: Detects supported agents from local paths and commands.
- **Capability**: Collection deployment · **What Pilot Does**: Installs hooks or plugins and reads local logs, sessions, or data files.
- **Capability**: Unified event schema · **What Pilot Does**: Normalizes agent-native events into a shared GenAI schema.
- **Capability**: Multi-destination output · **What Pilot Does**: Exports to JSONL, Alibaba Cloud SLS, HTTP, and OTLP trace backends.
- **Capability**: Privacy controls · **What Pilot Does**: Supports per-agent content capture policy and secret masking before output.
- **Capability**: Local operations · **What Pilot Does**: Provides service status, restart, rollback, and a built-in local dashboard.

## Supported Agents

### Agent · Integration · Trace Export · Log Export · Token Usage · Conversation / Tool Calls
- **Agent**: Claude Code · **Integration**: Hook · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Codex · **Integration**: Hook · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Cursor · **Integration**: Hook · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Cursor CLI · **Integration**: Shared Cursor hook · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Hermes Agent · **Integration**: Native directory plugin · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Kiro CLI · **Integration**: Hook / session polling · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: No · **Conversation / Tool Calls**: Yes
- **Agent**: MiMo Code · **Integration**: Plugin injection · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: OpenClaw · **Integration**: Plugin injection · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: OpenCode · **Integration**: Plugin injection · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Pi Coding Agent · **Integration**: Extension injection · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Qoder · **Integration**: Hook · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Qoder CN · **Integration**: Hook · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Qoder for JetBrains · **Integration**: Detection-only · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Qoder CLI · **Integration**: Hook / session polling · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Qoder Work · **Integration**: Hook / local data polling · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Qoder Work CN · **Integration**: Hook / local data polling · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Qwen Code CLI · **Integration**: Hook · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: Wukong · **Integration**: CLI API polling · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes
- **Agent**: WorkBuddy · **Integration**: Hook wakeup + local transcript watch/poll fallback · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes

OpenClaw integration requires OpenClaw 2026.5.12 or later.

### Documented Windows Agent Support

The table above describes Pilot's general integration capabilities; it does not imply that every agent is supported on every operating system. The following agents are currently explicitly documented as supported on Windows:

### Agent · Windows Integration · Trace Export · Log Export · Token Usage · Conversation / Tool Calls · Requirement
- **Agent**: Claude Code · **Windows Integration**: Hook · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes · **Requirement**: —
- **Agent**: Cursor · **Windows Integration**: Hook · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes · **Requirement**: —
- **Agent**: Qoder Work · **Windows Integration**: Hook / local data source · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: No · **Conversation / Tool Calls**: Yes · **Requirement**: User edition
- **Agent**: Qoder CLI · **Windows Integration**: Hook · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: No · **Conversation / Tool Calls**: Yes · **Requirement**: —
- **Agent**: Qoder IDE · **Windows Integration**: Hook / local data source · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes · **Requirement**: Qoder 1.10.0 or later, User edition
- **Agent**: OpenCode · **Windows Integration**: Plugin injection · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes · **Requirement**: —
- **Agent**: WorkBuddy · **Windows Integration**: Hook wakeup + local transcript · **Trace Export**: Yes · **Log Export**: Yes · **Token Usage**: Yes · **Conversation / Tool Calls**: Yes · **Requirement**: WorkBuddy Desktop 5.3.5.0; Windows 11 installed-product E2E

Agents omitted from this Windows table do not currently have an explicit Windows support statement; omission does not necessarily mean that the agent cannot run on Windows. See the [Alibaba Cloud AI Coding Agent access guide](https://help.aliyun.com/zh/cms/cloudmonitor-2-0/ai-application-access-ai-coding-agent/) for the source support matrix and [Installation](docs/installation.md) for Windows prerequisites and setup.

Agent definitions live in `agents.d/`. You can add new agents without changing the deployment framework; see [Agent Onboarding](docs/agent-onboarding.md).

## Quick Start

Prerequisites:

- Node.js 18 or later
- `npm`
- `curl` or `wget`
- PowerShell 5.1 or later on Windows

Install from the public package on Linux or macOS:

```bash
curl -fsSL https://loongcollector-community-edition.oss-cn-shanghai.aliyuncs.com/loongsuite-pilot/installer.sh -o /tmp/loongsuite-pilot-installer.sh && bash /tmp/loongsuite-pilot-installer.sh install
```

Install from the public package on Windows:

```powershell
$installer = "$env:TEMP\loongsuite-pilot-installer.ps1"
Invoke-WebRequest `
  -Uri "https://loongcollector-community-edition.oss-cn-shanghai.aliyuncs.com/loongsuite-pilot/installer.ps1" `
  -OutFile $installer
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $installer install
```

Verify the service:

```bash
loongsuite-pilot status
loongsuite-pilot info
```

Local JSONL output is enabled by default under `~/.loongsuite-pilot/logs/output/` on Linux/macOS and `%USERPROFILE%\.loongsuite-pilot\logs\output\` on Windows.

For installer options, uninstall commands, and source builds, see [Installation](docs/installation.md).

## Configure Pilot

Configuration is loaded in this order: environment variables, then `~/.loongsuite-pilot/config.json`, then built-in defaults.

Start with the guide that matches what you want to change:

### Task · Guide
- **Task**: Choose agents and content capture policy · **Guide**: [Agent Configuration](docs/agents.md)
- **Task**: Write local JSONL logs · **Guide**: [Local JSONL Output](docs/local-jsonl-output.md)
- **Task**: Report logs to SLS · **Guide**: [SLS Output](docs/sls-output.md)
- **Task**: Report OTLP traces · **Guide**: [Trace Output](docs/trace-output.md)
- **Task**: POST events to HTTP · **Guide**: [HTTP Output](docs/http-output.md)
- **Task**: Mask secrets before output · **Guide**: [Data Masking](docs/masking.md)
- **Task**: See global config loading and retention settings · **Guide**: [Configuration Guide](docs/configuration.md)

### Upstream Trace Linking (optional)

Link collected agent spans to an **upstream** trace so each turn's span tree reparents under the upstream span. Disabled by default, and fully fail-open (never affects normal collection/reporting).

### Setting · Values · Default
- **Setting**: `LOONGSUITE_PILOT_UPSTREAM_LINK` (env) · `upstreamLink.enabled` (config.json) · **Values**: `true` / `1` to enable; unset, `false`, or `0` to disable · **Default**: disabled
- **Setting**: `LOONGSUITE_PILOT_UPSTREAM_LINK_PROPAGATE_TO_TOOLS` (env) · `upstreamLink.propagateToTools` (config.json) · **Values**: propagate the first-turn upstream context to supported CLI tool calls · **Default**: disabled
- **Setting**: `LOONGSUITE_PILOT_UPSTREAM_LINK_TTL_MS` (env) · `upstreamLink.ttlMs` (config.json) · **Values**: cleanup TTL in ms for `acp-correlate` files · **Default**: `86400000` (24h)

When enabled, the upstream `traceparent` reaches Pilot via one of two schemes and is stamped onto collected records (`trace_id` on the turn, `parent_span_id` on the user-input event):

- **Correlation file** (per-turn): the caller writes `{sessionId, contentHash, contentPrefix, traceparent}` to `~/.loongsuite-pilot/acp-correlate/<sessionId>.jsonl` when it sends a prompt. Linking is protocol-agnostic — the only requirement is that `sessionId` matches the `gen_ai.session.id` Pilot collects for that turn, and the content (hash or prefix) matches the collected user text. ACP clients satisfy this naturally (the `session/new` id flows into collection), so ACP is the primary case.
- **Environment** (`TRACEPARENT` on the agent process): applied to the session's first turn, via the agent's hook. Use this when the caller cannot obtain a per-turn `sessionId` up front.

For Claude Code, enabling both upstream linking and `propagateToTools` also passes the first turn's context into main-agent `Bash` calls. Pilot's `PreToolUse(Bash)` hook reserves the TOOL span id, prepends `TRACEPARENT` (and valid `TRACESTATE`, when present) to the Bash command, then reuses that id when the Stop hook builds the TOOL span. The downstream CLI must read these environment variables and configure its own trace exporter. This initial scope is fail-open and does not cover subagents, PowerShell, MCP tools, later turns, or resumed sessions with a newly supplied context.

## Output Data

### Backend · Use Case
- **Backend**: JSONL · **Use Case**: Local backup and easy inspection. Enabled by default.
- **Backend**: SLS · **Use Case**: Alibaba Cloud Log Service reporting. Supports WebTracking, AK, and API Key modes.
- **Backend**: HTTP · **Use Case**: POST batches to a custom endpoint.
- **Backend**: OTLP Trace · **Use Case**: Export GenAI activity as OpenTelemetry traces.

LoongSuite Pilot emits a normalized GenAI event schema across all supported agents. See [Output Event Schema](docs/output-event-schema.md) for event names, field definitions, provider values, finish reasons, and sensitivity notes for opt-in content fields.

## Operate Pilot

Use the `loongsuite-pilot` command after installation:

```bash
loongsuite-pilot start
loongsuite-pilot stop
loongsuite-pilot restart
loongsuite-pilot status
loongsuite-pilot info
loongsuite-pilot token-usage
loongsuite-pilot rollback
```

The local dashboard starts and stops with the collector. Open
`http://127.0.0.1:8765/`; no separate monitor command is required. It reads the
collector-owned `logs/metrics-summary.json` file directly.

macOS menu bar app:

On macOS, Pilot automatically runs a menu bar app after installation — no extra command needed. It shows live token, session, request, and tool counts, plus per-agent and per-provider breakdowns, so you can keep an eye on activity without opening the dashboard.

  ![LoongSuite Pilot macOS menu bar app](docs/_assets/img/menubar.jpg)

To disable it, set `LOONGSUITE_PILOT_ENABLE_STATUS_BAR_APP=false` or add `"enableStatusBarApp": false` to `~/.loongsuite-pilot/config.json`.

## Documentation

[User Manual](docs/README.md) - Complete guide to installing, configuring, operating, and extending Pilot

[Installation Guide](docs/installation.md) - Install from package, verify service, uninstall, and run from source

[Configuration Reference](docs/configuration.md) - Global config loading, runtime switches, retention, and links to output and privacy setup

[Output Schema](docs/output-event-schema.md) - Normalized event names, fields, provider values, and finish reasons

[Developer Guide](docs/agent-onboarding.md) - Add support for a new AI coding agent

## Build From Source

```bash
git clone https://github.com/alibaba/loongsuite-pilot.git
cd loongsuite-pilot
npm install
npm run build
node scripts/postinstall.js
node dist/index.js
```

For local development:

```bash
npm install
npm run build
npm run typecheck
npm test
```

For packaging and service installation from a local build, see [Installation](docs/installation.md).

## Community

We are looking forward to your feedback and suggestions. Scan the QR code below to join the LoongSuite Pilot DingTalk group.

### LoongSuite Pilot SIG
- **LoongSuite Pilot SIG**: ![](docs/_assets/img/loongsuite-pilot-sig-dingtalk.jpg)

### Related Projects

- [LoongCollector](https://github.com/alibaba/loongcollector) - Universal node agent for log, metric and eBPF-based collection
- [LoongSuite JS](https://github.com/alibaba/loongsuite-js) - OpenTelemetry instrumentation plugins for JS-based AI coding agents
- [LoongSuite Python](https://github.com/alibaba/loongsuite-python) - Process agent for Python applications
- [LoongSuite Go](https://github.com/alibaba/loongsuite-go) - Process agent for Golang with compile-time instrumentation
- [LoongSuite Java](https://github.com/alibaba/loongsuite-java) - GenAI telemetry utility library for Java applications