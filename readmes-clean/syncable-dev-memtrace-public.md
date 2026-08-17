![Memtrace — structural memory for AI coding agents](docs/memtrace-hero.svg)

# Your agents deserve structural memory.

  Memtrace turns your codebase into a live knowledge graph that AI coding agents can query in milliseconds — every function, class, call edge, and version, across every session, without re-reading files or breaking things they can't see.

  Get your fleet on shared structural memory in under 90 seconds.

  Structural · zero LLM calls  ·  Bi-temporal · time-travel queries  ·  Replay-aware · zero blind refactors

## DeepSeek Harness

Memtrace runs as a [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin. Install Harness first (`npm install -g @deepseek-ai/dsh` — that is the `dsh` command), then add Memtrace:

```sh
npx -y @deepseek-ai/dsh plugin --profile web add github:syncable-dev/dsh-plugin-memtrace
```

Then ask the agent to index the workspace and pull blast radius, evolution, or an architecture briefing. Details: [syncable-dev/dsh-plugin-memtrace](https://github.com/syncable-dev/dsh-plugin-memtrace).

## What it does

**Three things, every release.**

🧭   **Run a fleet of coding agents on the same repo without merge hell.**
Each agent reads the same call graph, sees the same blast radius, inherits the same temporal history. No collisions. No stale context.

🔁   **Replay any refactor with full causal awareness.**
Agents see exactly what depends on what, and what changed when. No more *"I refactored a function and 14 tests broke that nobody saw."*

⚡   **Index a 50k-file repo in under 90 seconds.**
Rust + Tree-sitter, $0 in API costs, 20+ languages plus framework-aware scanners (Vapor, Lapis, Kong, GitHub Actions, Terraform, RLS policies, …), fully local. Your code never leaves your machine.

🆕   **LeanCTX Native — compressed reads, smart trees, and a value ledger.**
Four new compression modes on `get_source_window`, single-call directory maps, real-time token-savings dashboard, and an opt-in adaptive learner that beats the static table by ~14%. Full breakdown: [`docs/leanctx-native.md`](docs/leanctx-native.md). Available in v0.3.57+.

https://github.com/user-attachments/assets/e7d6a1e9-c912-4e65-a421-bd0256dffa5a

## Numbers

### Operation · Memtrace · Best alternative · Δ
- **Operation**: Index 1,500 files · **Memtrace**: **1.5s · $0** · **Best alternative**: Mem0: 31 min · $10–50 · **Δ**: **~1,200× faster**
- **Operation**: Exact symbol query (acc@1, lat) · **Memtrace**: **96.6% · 0.07 ms** · **Best alternative**: GitNexus: 97.0% · 8.95 ms · **Δ**: 128× lower latency
- **Operation**: Graph callers recall (Django) · **Memtrace**: **81.6%** · **Best alternative**: GitNexus: 5.3% · **Δ**: **15.4×**
- **Operation**: Incremental re-index p95 · **Memtrace**: **42.5 ms** · **Best alternative**: CodeGrapher: 613.7 ms · **Δ**: 14.4×
- **Operation**: Hybrid acc@1 (Django, 3K cases) · **Memtrace**: **73.9%** · **Best alternative**: GitNexus: 38.6% · **Δ**: 1.91×
- **Operation**: PR code-review F1 (50 PRs) · **Memtrace**: **0.7268** · **Best alternative**: Cubic v2: 0.6077 · **Δ**: **+19.60%**
- **Operation**: RSS / process · **Memtrace**: **26 MB** · **Best alternative**: ChromaDB: 1,060 MB · **Δ**: **41× tighter**
- **Operation**: Languages · **Memtrace**: **16+** (Tree-sitter) · **Best alternative**: varies · **Δ**: —

Reproducible benchmark suite: [`benchmarks/`](benchmarks/README.md). Same machine, same corpora, same adapter contract. Ground truth from Python's `ast` and `pyright` LSP — never from any tool's own index. **No system gets a home-field advantage in the dataset.**

Detailed breakdowns: [BENCHMARKS-v0.3.22.md](BENCHMARKS-v0.3.22.md) · [BENCHMARKS-v0.3.29.md](BENCHMARKS-v0.3.29.md) · [Code reviewer benchmark](docs/code-reviewer.md#offline-benchmark-snapshot)

## GitHub Star Growth

  
    
    
    ![](https://api.star-history.com/chart?repos=syncable-dev/memtrace-public&type=date&legend=top-left)
  

## Get access

Memtrace is in **private beta**. We're rolling out access in batches to keep the feedback loop tight — every cohort lands in a Discord channel where we ship fixes from real bug reports inside a week.

→ **Join the waitlist at [memtrace.io](https://memtrace.io).**

Already have access? `npm install -g memtrace` and you're indexing in 90 seconds. Full setup below.

> 🔒 **Privacy.** Memtrace runs entirely on your machine. Source code never leaves it. The only network traffic is license validation, aggregate node/edge counts, and opt-out crash telemetry — no source, no file paths, no symbol names. Full breakdown: [PRIVACY.md](PRIVACY.md), [TELEMETRY.md](TELEMETRY.md). Disable telemetry with `MEMTRACE_TELEMETRY=off`.

## Why Memtrace exists

Good code-intelligence tools already exist. GitNexus and CodeGrapherContext build AST-based graphs that work for *"what's in my repo right now."*

**Memtrace is a bi-temporal episodic structural knowledge graph.** It builds on the same AST foundation and adds two dimensions:

- **Temporal memory** — every symbol carries its full version history. Six scoring algorithms (impact, novelty, recency, directional, compound, overview) let agents ask different temporal questions: *"what changed?"*, *"what's unexpected?"*, *"what'll break?"*.
- **Cross-service API topology** — Memtrace maps HTTP call graphs *between* repositories, detecting which services call which endpoints across your architecture.

On top of that, the structural layer is comprehensive:

###  · 
- **Symbols are nodes** · functions, classes, interfaces, types, endpoints
- **Relationships are edges** · `CALLS`, `IMPLEMENTS`, `IMPORTS`, `EXPORTS`, `CONTAINS`
- **Community detection** · Louvain algorithm identifies architectural modules automatically
- **Hybrid retrieval** · Tantivy BM25 + vector embeddings + Reciprocal Rank Fusion + cross-encoder rerank
- **Rust-native** · compiled binary, no Python/JS runtime overhead, sub-8 ms p95 query latency

The agent doesn't just search your code. **It remembers it.**

## Memtrace vs. general memory systems (Mem0, Graphiti)

Mem0 and Graphiti are strong conversational memory engines designed for tracking entity knowledge (e.g. `User -> Likes -> Apples`). They excel at that. For code intelligence specifically, the tradeoff is that they rely on LLM inference to build their graphs — which adds cost and time when processing thousands of source files.

**Graphiti** processes data through `add_episode()`, which triggers multiple LLM calls per episode — entity extraction, relationship resolution, deduplication. At ~50 episodes/minute ([source](https://github.com/getzep/graphiti)), ingesting 1,500 code files takes **1–2 hours**.

**Mem0** processes data through `client.add()`, which queues async LLM extraction and conflict resolution per memory item ([source](https://mem0.ai)). Bulk ingestion with `infer=True` (default) means every file passes through an LLM pipeline. Throughput is bounded by your LLM provider's rate limits.

**Both** accumulate $10–50+ in API costs for large codebases because every relationship is inferred rather than parsed.

**Memtrace takes a different approach:** it indexes 1,500 files in 1.2–1.8 seconds for $0.00 — no LLM calls, no API costs, no rate limits. Native Tree-sitter AST parsers resolve deterministic symbol references (`CALLS`, `IMPLEMENTS`, `IMPORTS`) locally. The tradeoff is that Memtrace is purpose-built for code — it doesn't handle conversational entity memory the way Mem0 and Graphiti do.

## 25+ MCP tools

Memtrace exposes a full structural toolkit via the Model Context Protocol.

**Search & Discovery**
- `find_code` — hybrid BM25 + semantic + RRF
- `find_symbol` — exact / fuzzy with Levenshtein

**Relationships**
- `analyze_relationships` — callers, callees, hierarchy, imports
- `get_symbol_context` — 360° view in one call

**Impact Analysis**
- `get_impact` — blast radius with risk rating
- `detect_changes` — diff-to-symbols scope mapping

**Code Quality**
- `find_dead_code` — zero-caller detection
- `find_most_complex_functions` — complexity hotspots
- `calculate_cyclomatic_complexity`
- `get_repository_stats`

**Temporal Analysis**
- `get_evolution` — 6 scoring modes
- `get_timeline` — full version history
- `detect_changes` — diff-based scope

**Graph Algorithms**
- `find_bridge_symbols` — betweenness centrality
- `find_central_symbols` — PageRank / degree
- `list_communities` — Louvain modules
- `list_processes` / `get_process_flow`

**API Topology**
- `get_api_topology` — cross-repo HTTP graph
- `find_api_endpoints`
- `find_api_calls`

**Indexing & Watch**
- `index_directory` — parse, resolve, embed
- `watch_directory` — live incremental
- `execute_cypher` — direct graph queries

## 17 agent skills

Memtrace ships skills/guidance that teach agents how to use the graph. They fire automatically based on what you ask — no prompt engineering required.

### Skill · You say…
- **Skill**: `memtrace-search` · **You say…**: "find this function", "where is X defined"
- **Skill**: `memtrace-relationships` · **You say…**: "who calls this", "show class hierarchy"
- **Skill**: `memtrace-evolution` · **You say…**: "what changed this week", "how did this evolve"
- **Skill**: `memtrace-impact` · **You say…**: "what breaks if I change this", "blast radius"
- **Skill**: `memtrace-quality` · **You say…**: "find dead code", "complexity hotspots"
- **Skill**: `memtrace-graph` · **You say…**: "show me the architecture", "find bottlenecks"
- **Skill**: `memtrace-api-topology` · **You say…**: "list API endpoints", "service dependencies"
- **Skill**: `memtrace-index` · **You say…**: "index this project", "parse this codebase"
- **Skill**: `memtrace-cochange` · **You say…**: "what else changes with this", "hidden coupling"

Plus 8 workflow skills that chain multiple tools with decision logic: `memtrace-first`, `codebase-exploration`, `change-impact-analysis`, `incident-investigation`, `refactoring-guide`, `continuous-memory`, `episode-replay`, and `session-continuity`.

## Temporal Engine

Six scoring algorithms for different temporal questions:

### Mode · Best for
- **Mode**: `compound` · **Best for**: General-purpose "what changed?" — weighted blend of impact, novelty, recency
- **Mode**: `impact` · **Best for**: "What broke?" — ranks by blast radius (`in_degree^0.7 × (1 + out_degree)^0.3`)
- **Mode**: `novel` · **Best for**: "What's unexpected?" — anomaly detection via surprise scoring
- **Mode**: `recent` · **Best for**: "What changed near the incident?" — exponential time decay
- **Mode**: `directional` · **Best for**: "What was added vs removed?" — asymmetric scoring
- **Mode**: `overview` · **Best for**: Quick module-level summary

Uses **Structural Significance Budgeting** to surface the minimum set of changes covering ≥80% of total significance.

## Compatibility

### Editor / Agent · MCP Tools (25+) · Skills / Guidance · Install
- **Editor / Agent**: Claude Code · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: ✅ · **Install**: `npm install -g memtrace` — fully automatic
- **Editor / Agent**: Claude Desktop · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: ✅ · **Install**: Automatic — shared with Claude Code
- **Editor / Agent**: DeepSeek Harness · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: ✅ · **Install**: `npx -y @deepseek-ai/dsh plugin --profile web add github:syncable-dev/dsh-plugin-memtrace`
- **Editor / Agent**: Cursor (v2.4+) · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: ✅ · **Install**: `npm install -g memtrace` — fully automatic
- **Editor / Agent**: Codex CLI · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: ✅ · **Install**: `npm install -g memtrace` — fully automatic
- **Editor / Agent**: Windsurf · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: ✅ · **Install**: `npm install -g memtrace` — fully automatic
- **Editor / Agent**: VS Code (Copilot) · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: ✅ · **Install**: `npm install -g memtrace` — fully automatic
- **Editor / Agent**: Hermes · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: ✅ · **Install**: `npm install -g memtrace` — fully automatic
- **Editor / Agent**: OpenCode · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: ✅ · **Install**: `npm install -g memtrace` — fully automatic
- **Editor / Agent**: Kiro · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: Steering · **Install**: `npm install -g memtrace` — fully automatic
- **Editor / Agent**: Cline / Roo Code · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: — · **Install**: Add MCP server manually
- **Editor / Agent**: Any MCP client · **MCP Tools (25+)**: ✅ · **Skills / Guidance**: — · **Install**: Add MCP server manually

Skills are workflow prompts that teach the agent how to chain tools. Kiro does not use `SKILL.md`, so Memtrace writes equivalent auto steering files instead.

## Setup

### DeepSeek Harness

`dsh` comes from `@deepseek-ai/dsh`, not from Memtrace.

```sh
npm install -g @deepseek-ai/dsh
dsh plugin --profile web add github:syncable-dev/dsh-plugin-memtrace
```

Or without a global CLI:

```sh
npx -y @deepseek-ai/dsh plugin --profile web add github:syncable-dev/dsh-plugin-memtrace
```

That bundle registers Memtrace's skills and starts `memtrace mcp` inside the Harness profile. First launch may fetch the Memtrace binary via `npx`; pin a local install with `npm install -g memtrace` and `MEMTRACE_BIN=memtrace`.

### Claude Code + Claude Desktop

```bash
npm install -g memtrace
```

Handles everything — binary, 17 skills, MCP server, plugin, marketplace. One command, both editors.

For manual setup:

```bash
claude plugin marketplace add https://github.com/syncable-dev/memtrace-public.git
claude plugin install memtrace-skills@memtrace --scope user
claude mcp add memtrace -- memtrace mcp
```

### Cursor

`npm install -g memtrace` handles everything automatically. Cursor v2.4+ reads the same `SKILL.md` format as Claude.

For project-local install (skills travel with your repo):

```bash
npx memtrace-skills install --only cursor --local
```

### Codex, Windsurf, VS Code, Hermes, OpenCode, and Kiro

The installer also writes skills/guidance and MCP configuration for the newer agent surfaces:

### Agent · Global skills / guidance · Global MCP config · Project-local support
- **Agent**: Codex · **Global skills / guidance**: `~/.agents/skills/` · **Global MCP config**: `~/.codex/config.toml` · **Project-local support**: `.agents/skills/`, `.codex/config.toml`
- **Agent**: Windsurf · **Global skills / guidance**: `~/.codeium/windsurf/skills/` · **Global MCP config**: `~/.codeium/windsurf/mcp_config.json` · **Project-local support**: `.windsurf/skills/`; MCP remains user-level
- **Agent**: VS Code / Copilot · **Global skills / guidance**: `~/.copilot/skills/` · **Global MCP config**: VS Code user `mcp.json` · **Project-local support**: `.github/skills/`, `.vscode/mcp.json`
- **Agent**: Hermes · **Global skills / guidance**: `~/.hermes/skills/` · **Global MCP config**: `~/.hermes/config.yaml` · **Project-local support**: user-level only
- **Agent**: OpenCode · **Global skills / guidance**: `~/.config/opencode/skills/` · **Global MCP config**: `~/.config/opencode/opencode.json` · **Project-local support**: `.opencode/skills/`, `opencode.json`
- **Agent**: Kiro · **Global skills / guidance**: `~/.kiro/steering/` · **Global MCP config**: `~/.kiro/settings/mcp.json` · **Project-local support**: `.kiro/steering/`, `.kiro/settings/mcp.json`

Install only selected integrations:

```bash
npx memtrace-skills install --only codex,windsurf,vscode,hermes,opencode,kiro
```

Install project-local config where supported:

```bash
npx memtrace-skills install --only codex,vscode,opencode,kiro --local
```

### Other MCP clients

For Cline, Roo Code, or any client that only needs MCP tools, add this server manually:

```json
{
  "mcpServers": {
    "memtrace": {
      "command": "memtrace",
      "args": ["mcp"],
      "env": {}
    }
  }
}
```

### Editor · Config file
- **Editor**: Windsurf · **Config file**: `~/.codeium/windsurf/mcp_config.json`
- **Editor**: VS Code (Copilot) · **Config file**: `.vscode/mcp.json` in your project root
- **Editor**: Codex · **Config file**: `~/.codex/config.toml` or `.codex/config.toml`
- **Editor**: Hermes · **Config file**: `~/.hermes/config.yaml`
- **Editor**: OpenCode · **Config file**: `~/.config/opencode/opencode.json` or project `opencode.json`
- **Editor**: Kiro · **Config file**: `~/.kiro/settings/mcp.json` or `.kiro/settings/mcp.json`
- **Editor**: Cline · **Config file**: Cline MCP settings in the extension panel

### Uninstall

```bash
memtrace uninstall      # removes skills, MCP server, plugin, settings
npm uninstall -g memtrace
```

Already ran `npm uninstall` first? The cleanup script is at `~/.memtrace/uninstall.js`:

```bash
node ~/.memtrace/uninstall.js
```

### Install troubleshooting

`npm install -g memtrace` ships a small main package + a platform-specific binary (one of `@memtrace/darwin-arm64`, `@memtrace/linux-x64`, `@memtrace/win32-x64`). If `memtrace start` ever says *"Could not find binary for your platform"*:

```bash
# Re-run install, asking npm to keep optional deps
npm install -g memtrace --include=optional

# Or refresh from latest
memtrace install         # built-in self-update
npm install -g memtrace@latest --force

# Or install the platform binary directly (Apple Silicon shown — swap for your platform)
npm install -g @memtrace/darwin-arm64
```

This typically only happens on machines where npm is configured to skip optional dependencies (corporate npmrc, certain CI caches).

## Languages

**Programming:** Rust · Go · TypeScript · JavaScript · Python · Java · C · C++ · C# · Swift · Kotlin · Ruby · PHP · Dart · Scala · Perl · **Lua** — full AST: functions, classes, types, calls, complexity.

**Infrastructure & config:** **YAML** · **HCL / Terraform** · **JSON** · **TOML** · **SQL** (including PostgreSQL `CREATE POLICY` for RLS, with cross-language edges from policies to Drizzle / Prisma / TS schema symbols).

**Framework-aware scanners** on top of the AST layer: