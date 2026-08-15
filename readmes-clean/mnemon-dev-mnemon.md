![Mnemon Logo](docs/logo/logo.svg)

# Mnemon

**English** | [中文](docs/zh/README.md)

**LLM-supervised persistent memory for AI agents.**

[![Go Report Card](https://goreportcard.com/badge/github.com/mnemon-dev/mnemon)](https://goreportcard.com/report/github.com/mnemon-dev/mnemon)

LLM agents forget everything between sessions. Context compaction drops critical decisions, cross-session knowledge vanishes, and long conversations push early information out of the window.

Mnemon gives your agent persistent, cross-session memory — a four-graph knowledge store with intent-aware recall, importance decay, and automatic deduplication. The `mnemon` memory path remains one local binary with zero API keys and one setup command.

Mnemon ships one executable with two separate surfaces. Memory stays at the
`mnemon` root; [Agency Preview](docs/AGENCY.md) lives at `mnemon agency ...` and adds
durable, project-local responsibility and effect admission to an existing Pi
agent. Agency does not replace Memory or the Agent Runtime.

> **Claude Max / Pro subscriber?** Mnemon works entirely through your existing subscription — no separate API key required. Your LLM subscription *is* the intelligence layer. Two commands and you're done.

### Why Mnemon?

Most memory tools embed their own LLM inside the pipeline. Mnemon takes a different approach: **your host LLM is the supervisor.** The binary handles deterministic computation (storage, graph indexing, search, decay); the LLM makes judgment calls (what to remember, how to link, when to forget). No middleman, no extra inference cost.

### Pattern · LLM Role · Representative
- **Pattern**: **LLM-Embedded** · **LLM Role**: Executor inside the pipeline · **Representative**: Mem0, Letta
- **Pattern**: **File Injection** · **LLM Role**: None — reads file at session start · **Representative**: Claude Code Memory
- **Pattern**: **MCP Server** · **LLM Role**: Tool provider via MCP protocol · **Representative**: claude-mem
- **Pattern**: **LLM-Supervised** · **LLM Role**: External supervisor of a standalone binary · **Representative**: **Mnemon**

Mnemon also addresses a gap in the protocol stack. MCP standardizes how LLMs discover and invoke tools. ODBC/JDBC standardizes how applications access databases. But how LLMs interact with databases using memory semantics — this layer has no protocol. Mnemon's three primitives — `remember`, `link`, `recall` — form an intent-native protocol: command names map to the LLM's cognitive vocabulary (`remember` not INSERT, `recall` not SELECT), and output is structured JSON with signal transparency rather than raw database rows.

  ![LLM-Supervised Architecture — three patterns compared, with Mnemon hooks, protocol boundary, and deterministic memory engine](docs/diagrams/llm-supervised-concept.jpg)
  
  <sub>The LLM-Supervised pattern: hooks drive the lifecycle, the host LLM makes judgment calls, the binary handles deterministic computation.</sub>

Memory has a **compound interest effect** — the longer it accumulates, the greater its value. LLM engines iterate constantly, skill files cost nearly nothing to write, but memory is a private asset that grows with the user. It is the only component in the agent ecosystem worth deep investment.

  ![Knowledge Graph — 87 insights connected by temporal, entity, semantic, and causal edges](docs/diagrams/10-knowledge-graph.jpg)
  
  <sub>A real knowledge graph built by Mnemon — 87 insights, 2150 edges across four graph types.</sub>

See [Design & Architecture](docs/DESIGN.md) for details.

## Quick Start

### Install

**Homebrew Cask** (macOS):

```bash
brew install --cask mnemon-dev/tap/mnemon
```

**Go install** (macOS / Linux / Windows):

```bash
go install github.com/mnemon-dev/mnemon@latest
```

Windows supports the core Memory commands. Agency remains unavailable on
Windows until its local authority boundary has native Windows security.

**From source** (macOS / Linux):

```bash
git clone https://github.com/mnemon-dev/mnemon.git && cd mnemon
make install
```

**Verify installation**:

```bash
mnemon --version
mnemon agency --version
```

### Agency (Preview · Pi-first)

```bash
mnemon agency setup --runtime pi --project-root .
```

Set up each project once, then use Pi normally. Agency is available on macOS
and Linux and remains independent from Memory: `mnemon setup --target pi --yes`
enables Memory, while the command above enables Agency. See the
[Agency guide](docs/AGENCY.md) for its operating model, Preview compatibility
boundary, and optional peers.

### [Claude Code](https://github.com/anthropics/claude-code)

```bash
mnemon setup
```

`mnemon setup` auto-detects Claude Code, then interactively deploys skill, hooks, and behavioral guide. Start a new session — memory just works.

### [Codex](https://github.com/openai/codex)

```bash
mnemon setup --target codex --yes
```

One command deploys the mnemon skill, prompt files, and Codex lifecycle hooks
(`SessionStart`, `UserPromptSubmit`, `Stop`) in `.codex/hooks.json`.

### [Cursor](https://cursor.com/)

```bash
mnemon setup --target cursor --yes
```

One command deploys the mnemon skill, prompt files, and Cursor lifecycle hooks
to `.cursor/`. The integration primes new agent sessions with Mnemon guidance
and memory status, then nudges for durable-memory writeback after responses.

### [TRAE](https://www.trae.ai/) (TRAE Work)

```bash
mnemon setup --target trae --yes
```

One command deploys the mnemon skill, prompt files, and TRAE native hooks for
both TRAE IDE and TRAE Work to `.trae/`. The integration uses `SessionStart`,
`UserPromptSubmit`, and `Stop` hooks in `.trae/hooks.json`.

### [Qoder](https://qoder.com/) (QoderWork)

```bash
mnemon setup --target qoder --yes
mnemon setup --target qoderwork --yes
```

Qoder deploys the mnemon skill, prompt files, and native hooks to `.qoder/`
or `~/.qoder/`. QoderWork uses its native user config at `~/.qoderwork/`.
Both integrations register `SessionStart`, `UserPromptSubmit`, and `Stop`
hooks in `settings.json`.

### [CodeBuddy](https://www.codebuddy.cn/)

```bash
mnemon setup --target codebuddy --yes
```

CodeBuddy deploys the mnemon skill, prompt files, and native hooks to
`.codebuddy/` or `~/.codebuddy/`. The integration registers `SessionStart`,
`UserPromptSubmit`, and `Stop` hooks in `settings.json`.

### [WorkBuddy](https://www.codebuddy.cn/work/)

```bash
mnemon setup --target workbuddy --yes
```

WorkBuddy deploys the mnemon skill, prompt files, and native hooks to
`.workbuddy/` or `~/.workbuddy/`. The integration registers `SessionStart`,
`UserPromptSubmit`, and `Stop` hooks in `settings.json`.

### [Kimi Code](https://github.com/MoonshotAI/kimi-code)

```bash
mnemon setup --target kimi --yes
```

Kimi Code deploys the mnemon skill, prompt files, and native lifecycle hooks to
`~/.kimi-code/` or `$KIMI_CODE_HOME/`. The integration registers
`SessionStart`, `UserPromptSubmit`, and `Stop` hooks in `config.toml`.

### [OpenCode](https://opencode.ai/)

```bash
mnemon setup --target opencode --yes
```

OpenCode deploys the mnemon skill to `.opencode/skills/`, registers the
generated guide through `opencode.json` instructions, and installs a native
plugin in `.opencode/plugins/`. The plugin injects recall context before chat
requests and adds Mnemon guidance to session compaction.

### [OpenClaw](https://github.com/openclaw/openclaw)

```bash
mnemon setup --target openclaw --yes
```

One command deploys skill, hook, plugin, and behavioral guide to `~/.openclaw/`. Restart the OpenClaw gateway to activate.

### [Pi](https://pi.dev)

```bash
mnemon setup --target pi --yes
```

One command deploys the mnemon skill, prompt files, and a Pi TypeScript extension
to `.pi/`. The extension maps Mnemon's lifecycle reminders onto Pi events
(`resources_discover`, `before_agent_start`, `agent_end`,
`session_before_compact`). Start a new Pi session or run `/reload` to activate.

### [Hermes Agent](https://github.com/NousResearch/hermes-agent)

```bash
mnemon setup --target hermes --yes
```

One command deploys the mnemon skill, prompt files, and Hermes shell hooks to
`~/.hermes/`. The integration uses Hermes' native lifecycle hooks:
`on_session_start`, `pre_llm_call`, `post_llm_call`, and optional
`on_session_finalize`. Hermes may prompt once to approve the installed shell
hooks.

### [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)

DeepSeek Harness (DSH) integrates through the [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) plugin, which layers DSH's runtime memory, managed project documents, and Mnemon's long-term memory spaces into one supervised three-tier memory system.

With `mnemon` installed on the host (see [Install](#install)), add the plugin and restart your DSH Web profile:

```bash
dsh plugin --profile web add dsh-mnemon
dsh --profile web
```

The Mnemon repository is also a direct GitHub installation source. Unreleased
plugin builds can still be installed from the dedicated repository, and local
development checkouts use an absolute path:

```bash
dsh plugin --profile web add github:mnemon-dev/mnemon
dsh plugin --profile web add "github:omdsh-dev/dsh-mnemon"
dsh plugin --profile web add "link:/absolute/path/to/dsh-mnemon"
```

Then open DSH's Settings → Plugin Config → Mnemon to pick a storage scope, and use the Memory System tab in a session to create or activate memory spaces. Recall reads only from active memory spaces; durable writes go through supervised sub-agents.

### [NanoClaw](https://github.com/qwibitai/nanoclaw)

NanoClaw runs agents inside Linux containers. Use the `/add-mnemon` skill to integrate:

1. Install mnemon on the host (see above)
2. In your NanoClaw project, run `/add-mnemon` — Claude Code will modify the Dockerfile, add a container skill, and set up volume mounts
3. Each WhatsApp group gets its own isolated memory store, with optional global shared memory (read-only)

The skill is available at `.claude/skills/add-mnemon/` in the NanoClaw repo.

### [Nanobot](https://github.com/HKUDS/nanobot)

```bash
mnemon setup --target nanobot --global --yes
```

One command writes a skill file to `~/.nanobot/workspace/skills/mnemon/SKILL.md`. Memory is shared across all Nanobot sessions and projects. Use `--global` (recommended) because Nanobot discovers skills from the global workspace directory.

### Uninstall

```bash
mnemon setup --eject
```

## How it works

Once set up, Memory operates through lightweight runtime projections: a
runtime-specific `SKILL.md` teaches commands, a shared `guide.md` (by default
`~/.mnemon/prompt/guide.md`) carries judgment guidance, and native hooks or
extensions surface reminders at supported lifecycle boundaries. The `mnemon`
binary executes deterministic memory operations, while `mnemon setup` installs
the closest native mapping for each supported runtime.

```text
Session starts
    |
    v
  Prime   -> make skill, guide, and active store visible
    |
    v
User prompt arrives
    |
    v
  Remind  -> decide whether recall could change this task
    |
    v
Agent works and calls Mnemon only when useful
    |
    v
  Nudge   -> decide whether durable writeback is justified
    |
    v
Before context compaction
    |
    v
  Compact -> preserve only critical continuity
```

The four hook phases are reminders, not a hard workflow. **Prime** makes the
skill, guide, and active store visible. **Remind** prompts a recall
decision. **Nudge** prompts a writeback decision. **Compact** preserves only
critical continuity before context compression.

You don't run mnemon commands yourself. The agent does when the guide says
memory is useful.

## Features

- **Zero user-side operation** — install once; supported runtimes can use hooks, minimal runtimes can use persistent rules
- **LLM-supervised** — the host LLM decides what to remember, update, and forget; no embedded LLM, no API keys
- **Multi-framework support** — Claude Code, Codex, Cursor, TRAE/TRAE Work, Qoder/QoderWork, CodeBuddy, WorkBuddy, Kimi Code, OpenCode, and Hermes Agent (hooks/plugins), OpenClaw (plugins), Pi (extensions), Nanobot (skills), DeepSeek Harness (via the dsh-mnemon plugin), and more
- **Runtime-native integration** — runtime-specific `SKILL.md`, shared `guide.md`, and supported hooks or extensions
- **Four-graph architecture** — temporal, entity, causal, and semantic edges, not just vector similarity
- **Intent-native protocol** — three primitives (`remember`, `link`, `recall`) map to the LLM's cognitive vocabulary, not database syntax; structured JSON output with signal transparency
- **Intent-aware recall** — graph traversal + optional vector search (RRF fusion), enabled by default for all queries
- **Built-in deduplication** — `remember` auto-detects duplicates and conflicts; skips or auto-replaces
- **Retention lifecycle** — importance decay, access-count boosting, and garbage collection
- **Privacy-safe receipts** — export hashed operation receipts for memory-boundary audits without raw memory contents or queries
- **Optional embeddings** — works fully without Ollama; add local [Ollama](https://ollama.ai) for enhanced vector+keyword hybrid search

## Vision

All your local agentic AIs — across sessions and frameworks — sharing one pool of live memory.

```
  Claude Code ──┐
                │
  Codex ────────┤
                │
  Cursor ───────┤
                │
  TRAE ─────────┤
                │
  TRAE Work ────┤
                │
  Qoder ────────┤
                │
  QoderWork ────┤
                │
  CodeBuddy ────┤
                │
  WorkBuddy ────┤
                │
  Kimi Code ────┤
                │
  Hermes Agent ─┤
                │
  OpenClaw ─────┤
                │
  Pi ───────────┤
                │
  Nanobot ──────┤
                │
  NanoClaw ─────┤
                ├──▶  ~/.mnemon  ◀── shared memory
  OpenCode ─────┤
                │
  Gemini CLI ───┘
```

The foundation is in place: a single `~/.mnemon` database that any agent can
read and write. Claude Code, Codex, Cursor, TRAE/TRAE Work, Qoder/QoderWork,
CodeBuddy, WorkBuddy, Kimi Code, OpenCode, and Hermes Agent setup automate hook/plugin installation;
OpenClaw can use plugin hooks; Pi integrates via native skills and TypeScript
lifecycle extensions; Nanobot integrates via skill files; NanoClaw integrates
via container skills and volume mounts. The same integration bundle can be installed in any
LLM CLI that supports skills, rules, system prompts, or event hooks.

The longer-term direction is a **memory gateway**: protocol decoupled from storage engine. The current SQLite backend is the first adapter; the protocol surface (`remember / link / recall`) can sit on top of PostgreSQL, Neo4j, or any graph database. Agent-side optimization (when to recall, what to remember) and storage-side optimization (indexing, graph algorithms) evolve independently. See [Future Direction](docs/design/08-decisions.md#82-future-direction) for details.

## FAQ

**Do different sessions share memory?**
Yes. By default, all sessions use the same `default` store — a decision remembered in one session is available in every future session.

**Can I isolate memory per project or agent?**
Yes. Use named stores to separate memory:

```bash
mnemon store create work        # create a new store
mnemon store set work           # set as default
MNEMON_STORE=work mnemon recall "query"  # or use env var per-process
```

Different agents/processes can use different stores via the `MNEMON_STORE` environment variable — no global state contention.

**Local or global mode?**
`mnemon setup` defaults to **local** (project-scoped `.claude/`), recommended for most users. **Global** (`mnemon setup --global`, installed to `~/.claude/`) activates mnemon across all projects — convenient if you want other frameworks (e.g., OpenClaw) to share memory by forwarding requests through Claude Code CLI, but may add maintenance overhead.

**How do I customize the behavior?**
Edit the generated guideline (`~/.mnemon/prompt/guide.md` in current setup
flows). Skill files should stay focused on command syntax.

**What is sub-agent delegation?**
Sub-agent delegation is optional. When a runtime supports it, the main agent can
decide *what* to remember and ask a cheaper or isolated worker to execute
`mnemon remember`. It is a useful execution strategy, not a required part of the
Mnemon architecture.

## Configuration

### Environment Variable · Default · Description
- **Environment Variable**: `MNEMON_DATA_DIR` · **Default**: `~/.mnemon` · **Description**: Base data directory
- **Environment Variable**: `MNEMON_STORE` · **Default**: *(active file or `default`)* · **Description**: Named memory store for data isolation

**Ollama-specific** (only relevant if using embeddings):

### Environment Variable · Default · Description
- **Environment Variable**: `MNEMON_EMBED_ENDPOINT` · **Default**: `http://localhost:11434` · **Description**: Ollama API endpoint
- **Environment Variable**: `MNEMON_EMBED_MODEL` · **Default**: `nomic-embed-text` · **Description**: Embedding model name

## Development

```bash
make build          # build the single mnemon executable
make install        # build + install to $GOBIN
make test           # run deterministic CI tests
make test-integration  # opt-in CLI E2E and Agency boundary tests
mnemon setup        # interactive setup
mnemon setup --eject  # remove all integrations
make help           # show all targets
```

**Dependencies**: Go 1.24+, `modernc.org/sqlite`, `spf13/cobra`, `google/uuid`

See [Development and Deployment](docs/DEPLOYMENT.md) for Docker, Compose, Ollama embedding, and release setup.

## Documentation

- [Agency Preview](docs/AGENCY.md) — maturity boundary, Pi setup, operating model, completion semantics, and optional peers
- [Go Engineering Standard](docs/development/go-engineering-standard.md) — maintainability, concurrency, persistence, testing, and review thresholds
- [Design & Architecture](docs/DESIGN.md) — current engine architecture, algorithms, integration