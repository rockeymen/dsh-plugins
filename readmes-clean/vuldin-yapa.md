# YAPA — Yet Another Personal Assistant

**DeepSeek Harness:** see [`packages/dsh/install.md`](packages/dsh/install.md) — the native plugin needs no wizard (and no database server under the default embedded store).

**Claude Code / Cursor / OpenCode:** give your AI agent this prompt: `install https://github.com/vuldin/yapa`

> **AGENTS — READ THIS FIRST.** Do NOT clone this repo. Do NOT run `git clone`, `npm install`, `npm run build`, or any other commands. For MCP hosts, read `CLAUDE.md` (Claude Code / Cursor) or `AGENTS.md` (OpenCode) from this repository FIRST — it contains a multi-phase install process that must be followed exactly. The install requires user input before cloning. For the DeepSeek Harness, follow `packages/dsh/install.md` instead (no agent-driven wizard).

YAPA is a personal assistant that gives your AI agent persistent memory and task management, so your agent remembers what you told it, tracks your tasks, and organizes knowledge by project or customer — across every session.

YAPA runs two frontends over one core:

- **Native DeepSeek Harness plugin** (`yapa`, in `packages/dsh`) — 23 tools by default (+18 gated ML-ops) with structured outputs and GUI cards, always-on recall injected at the turn seam, **automatic capture of durable findings from every agent turn** (aux-LLM extractor + conservative conflict resolver), a **daily contradiction janitor** that archives duplicates and supersedes stale memories, hot-reloaded settings, schedule-bridged due dates, compaction capture, approval gating, and an embedded zero-server storage option. Docs: [install](packages/dsh/install.md) · [architecture](packages/dsh/architecture.md) · [future work & investigation record](docs/future-work.md).
- **MCP server** (`yapa-mcp`, in `packages/mcp`) — the original stdio server plus the Claude-Code hook CLI. Everything below the "Repository layout" section primarily describes this frontend.

## Repository layout

- `packages/core` (`@yapa/core`) — all logic: memory, tasks, collections, journal, compaction, sync, curation, buckets, training. Config is a `YapaConfig` snapshot (`createConfig(env)` / `setConfig`) instead of module-level env reads, so hosts control configuration. Storage goes through the `VectorStore` port (`src/store/`): the ChromaDB HTTP adapter, or the embedded local adapter (one JSON file per collection, in-process embeddings, brute-force cosine — no server).
- `packages/mcp` (`yapa-mcp`) — the MCP server + Claude-Code hook CLI.
- `packages/dsh` (`yapa`) — the DeepSeek Harness cordis plugin.

## What it does

**Persistent memory** — Your agent remembers things across conversations. Bug fixes, preferences, decisions, configuration details, solutions to problems — stored with semantic search so the right context surfaces when you need it.

**Task management** — Create tasks with priorities, due dates, dependencies, and recurring schedules. Your agent tracks what's in progress, what's blocked, and what's overdue. Complete a recurring task and the next one is generated automatically.

**Collection-based organization** — Memories and tasks are grouped into collections: `global` for cross-cutting knowledge, `customer-acme` for client work, `project-api` for a specific codebase. The agent infers the right collection from what you're discussing.

**Data lifecycle** — Not all memories are equally important. YAPA scores each memory by salience (1.0 to 5.0), boosts it when accessed, and decays it over time. Semantic facts (preferences, configs) decay slower than episodic events (what happened Tuesday). Salience also weights retrieval ranking, so higher-salience memories surface ahead of lower-salience ones at similar vector distance. Nothing is deleted — low-salience memories just surface less often.

**Smart chunking** — Long content is split into 2000-character chunks with 200-character overlap, each independently searchable. Meeting notes, documentation, lengthy explanations — all stored and retrievable.

**Remote sync** — Optionally sync memories and tasks to a shared PostgreSQL+pgvector database. Push local data to the remote, pull teammates' data down. A background sync runs every 5 minutes automatically. The install wizard supports Docker, Neon, Supabase, AWS RDS, GCP Cloud SQL, and Azure Flexible Server.

**Deduplication** — During sync, YAPA compares document embeddings using cosine similarity (default threshold 0.95). Near-duplicates are linked via `related_ids` rather than merged or discarded, so no data is lost and you can trace where related knowledge came from.

## How it works

**Under DSH**, the plugin registers 23 `yapa_*` tools natively by default (+18 gated behind `trainingPipeline`), injects recall + open tasks into every turn at the `agent/pre-step` seam (no hooks, no wiring), judges every completed turn for durable findings via a background aux-LLM extractor (auto-stored, deduplicated, contradictions resolved by superseding stale memories), runs a daily janitor sweep over the existing store, and stores data in the embedded local store by default. See `packages/dsh/architecture.md` for the full seam map.

**Under MCP hosts**, YAPA is an MCP server with 23 tools by default (+18 gated behind `YAPA_TRAINING_PIPELINE`). Your agent connects to it through your editor's MCP configuration. Once connected:

- **Before every response**, the agent queries your memories for relevant context
- **When it learns something important**, it stores it automatically (bug fixes, preferences, decisions)
- **When work is identified**, it creates and tracks tasks
- **Collections** are inferred from conversation context — no manual filing
- **If sync is enabled**, a background cycle pushes local changes and pulls remote updates every 5 minutes

Data lives in ChromaDB (default for MCP) or the embedded local store (default for the DSH plugin; `YAPA_STORAGE=local` enables it for MCP too). Embeddings are always computed in-process (MiniLM by default, or an HTTP provider); no backend embeds server-side. When remote sync is enabled, documents are also stored in PostgreSQL with pgvector for cross-machine search and deduplication.

## Install

To install, give your AI agent this prompt: `install https://github.com/vuldin/yapa`

To uninstall later, say `uninstall yapa` in any session.

## Tools

The table below lists the **MCP** tool names. The DSH plugin exposes the same
capabilities with a `yapa_` prefix (`memory_recall` → `yapa_memory_recall`),
plus `yapa_status` and `yapa_storage_import`. `setup_instructions` and
`uninstall` are MCP-only (the plugin has nothing to write into config files).

**Tool surface, kept lean:** the 23 tools below are visible by default. The
ML-ops subsystem (curation classifier, bucket routing, system-prompt
companion, training, eval, adapter promotion — 18 more) is operator workflow,
not daily agent surface: it appears only when `trainingPipeline: true` (DSH
plugin config / settings) or `YAPA_TRAINING_PIPELINE=true` (MCP) is set. See
[docs/training-pipeline.md](docs/training-pipeline.md) for the full pipeline
walkthrough and its tools.

### Tool · Description
- **Tool**: `setup_instructions` · **Description**: Generate behavioral instructions for CLAUDE.md / AGENTS.md
- **Tool**: `memory_store` · **Description**: Store memory with content, tags, salience, sector, collection
- **Tool**: `memory_recall` · **Description**: Semantic search ranked by distance + salience, with optional collection/tag/score filters
- **Tool**: `memory_forget` · **Description**: Delete memory by ID
- **Tool**: `memory_list` · **Description**: List memories with metadata filters (tag, sector, classifier scores)
- **Tool**: `compaction_suggest` · **Description**: Group similar non-archived memories for rolling-summary consolidation
- **Tool**: `compaction_apply` · **Description**: Replace a group with a summary memory and archive the originals
- **Tool**: `journal_append` · **Description**: Append a one-line draft entry to the current session's journal
- **Tool**: `journal_consolidate` · **Description**: Roll session drafts into a single `journal`-tagged memory at session end
- **Tool**: `janitor_now` · **Description**: Run the contradiction janitor: resolve near-duplicate pairs (archive duplicates, supersede stale memories, keep distinct facts)
- **Tool**: `task_create` · **Description**: Create task with title, priority, due date, tags, collection
- **Tool**: `task_list` · **Description**: List tasks with filters; pass `id` for a single task with full detail (notes, dependencies)
- **Tool**: `task_update` · **Description**: Update task fields
- **Tool**: `task_complete` · **Description**: Mark done + handle recurring regeneration
- **Tool**: `task_delete` · **Description**: Remove a task
- **Tool**: `task_search` · **Description**: Semantic search across tasks
- **Tool**: `task_add_dependency` · **Description**: Add depends-on/blocks relationship
- **Tool**: `collection_list` · **Description**: List all collections with doc counts
- **Tool**: `collection_create` · **Description**: Create new collection
- **Tool**: `collection_delete` · **Description**: Delete a collection
- **Tool**: `decay_sweep` · **Description**: Manually trigger salience decay
- **Tool**: `sync` · **Description**: Sync control via `action`: `status` (health, last pull, pending), `now` (push+pull cycle), `collections` (remote list + subscriptions), `subscribe` / `unsubscribe` (local data preserved)
- **Tool**: `uninstall` · **Description**: Remove YAPA from your system

## Always-on hooks (Claude Code / MCP frontend only)

> Under the DSH plugin this section does not apply: recall and task surfacing
> are built into the turn seam (`agent/pre-step`) with nothing to register —
> see `packages/dsh/architecture.md`.

YAPA ships a small `yapa` CLI in addition to the MCP server. It exposes four
hook entry points designed to be invoked from `~/.claude/settings.json`:

### Hook · What it does
- **Hook**: `session-start` · **What it does**: Detects scope from `cwd`, surfaces open tasks + top memories + compaction candidates as `additionalContext`
- **Hook**: `user-prompt-submit` · **What it does**: Runs `memory_recall` against the detected scope using the prompt as the query and injects the top 3 matches
- **Hook**: `stop` · **What it does**: Reminds the agent to call `memory_store` / `task_create` / `journal_append` for findings from the just-finished turn
- **Hook**: `session-end` · **What it does**: Logs the session ending; surfaces pending journal drafts at the next session start

Register the hooks once in `~/.claude/settings.json` (point the `command` field at the absolute path of `packages/mcp/dist/cli/index.js`). After that, recall and task surfacing happen on every prompt without the agent having to remember to call the tools. This is what makes YAPA "always on" rather than best-effort.

Configuration: each hook fails open — if the call errors, the hook emits `{}` and the session continues normally.

## Contradiction detection

`memory_store` runs a similarity check against the destination collection
before each write. Memories within `YAPA_CONTRADICTION_DISTANCE_THRESHOLD`
(default `0.25`, normalized cosine) are returned as `potential_conflicts`. The
agent decides:

- **Supersede** — re-store with `supersedes: "<conflicting ID>"`: the old
  memory is **archived** (`archived: true` + a `superseded_by` link) instead
  of hard-deleted — filtered from `memory_recall`/`memory_list` by default,
  recoverable anytime with `include_archived: true`.
- **Coexist** — leave the older memory in place; the new one is already stored.

`memory_forget` (hard delete) is reserved for memories that should never have
existed.

**Under DSH**, contradiction handling is also automatic: the response-capture
pipeline routes every auto-captured candidate with near neighbors through a
conservative LLM resolver (skip / add / supersede), and a daily **janitor
sweep** resolves duplicate pairs already in the store (`yapa_janitor_now` /
`janitor_now` runs it on demand). The resolver only supersedes when a fact
clearly changed; when unsure it keeps both.

Tunables:

### Env var · Default · Meaning
- **Env var**: `YAPA_CONTRADICTION_DISTANCE_THRESHOLD` · **Default**: `0.25` · **Meaning**: Distance under which two memories are considered conflicting
- **Env var**: `YAPA_CONTRADICTION_MAX_RESULTS` · **Default**: `3` · **Meaning**: Max conflicts surfaced per write

## End-of-session journal

Two tools record what happened during a session so the next session has continuity:

- `journal_append({ entry, collection? })` — append a one-line note. Drafts are scoped to the current MCP server process via a per-process `SESSION_ID`.
- `journal_consolidate({ collection?, summary? })` — roll the session's drafts into a single memory tagged `journal` at salience 1.5, then delete the drafts. If no `summary` is provided, the drafts are concatenated chronologically.

The `Stop` hook prompts the agent to journal each turn; the `SessionEnd` hook prompts consolidation.

## Periodic compaction

When a collection grows past `YAPA_COMPACTION_THRESHOLD` non-archived memories
(default `50`), the SessionStart hook flags it as a compaction candidate. The
agent then:

1. Calls `compaction_suggest({ collection })` — returns groups of ≥`YAPA_COMPACTION_MIN_GROUP_SIZE` similar memories (similarity gated by `YAPA_COMPACTION_SIMILARITY_DISTANCE`, default `0.30`).
2. For each group, drafts a one-paragraph rolling summary.
3. Calls `compaction_apply({ collection, member_ids, summary })` — writes the summary at salience 2.0 with tag `compacted`, then marks each member with `archived: true` and `compacted_into: `.

`memory_recall` and `memory_list` filter `archived: true` out by default. Pass `include_archived: true` to inspect them.

Tunables:

### Env var · Default · Meaning
- **Env var**: `YAPA_COMPACTION_THRESHOLD` · **Default**: `50` · **Meaning**: Collection size at which compaction is suggested
- **Env var**: `YAPA_COMPACTION_MIN_GROUP_SIZE` · **Default**: `3` · **Meaning**: Minimum members a compaction group must have
- **Env var**: `YAPA_COMPACTION_SIMILARITY_DISTANCE` · **Default**: `0.30` · **Meaning**: Distance under which two memories belong to the same group

## Embedding Providers

Embeddings always run **in-process** — no storage backend embeds server-side,
and the default needs no server and no API key. (The default provider is named
`chromadb` for historical reasons: it's the `chromadb-default-embed` package —
MiniLM-L6-v2 on `onnxruntime-web` (WASM) — and has nothing to do with running
a ChromaDB *server*.)

### Provider · Model · Dimensions · Config
- **Provider**: In-process MiniLM (default) · **Model**: all-MiniLM-L6-v2 · **Dimensions**: 384 · **Config**: Zero-config
- **Provider**: Fireworks · **Model**: nomic-embed-text-v1 · **Dimensions**: 768 · **Config**: `YAPA_EMBEDDING_PROVIDER=fireworks`
- **Provider**: OpenAI · **Model**: text-embedding-3-small · **Dimensions**: 768 · **Config**: `YAPA_EMBEDDING_PROVIDER=openai`
- **Provider**: Voyage AI · **Model**: voyage-3-lite · **Dimensions**: 512 · **Config**: `YAPA_EMBEDDING_PROVIDER=voyage`
- **Provider**: Ollama · **Model**: nomic-embed-text · **Dimensions**: 768 · **Config**: `YAPA_EMBEDDING_PROVIDER=ollama`

To use a non-default provider, add the relevant env vars to your MCP host config's `env` block (or the plugin's cordis `config:` under DSH). See `.env.example` for all options.

Note: the embedding provider and the **storage backend** are independent
choices — the in-process embedder pairs with both the embedded local store
(default under the DSH plugin) and a ChromaDB server (default under MCP).

## Configuration

All options use the `YAPA_` prefix and are set as environment variables in your MCP host config. Under the DSH plugin, the same values live in the cordis row `config:` or the hot-reloaded `yapa:` section of `~/.dsh/settings.yaml` (camelCase: `chromaUrl`, `syncEnabled`, …). See `.env.example` for the full list.

### Variable · Description · Default
- **Variable**: `YAPA_STORAGE` · **Description**: `chroma` \ · **Default**: `local` (embedded store, no server) · `chroma` for MCP; the DSH plugin defaults to `local`
- **Variable**: `YAPA_LOCAL_STORE_PATH` · **Description**: Root dir for the embedded store · **Default**: `~/.local/share/yapa/store`
- **Variable**: `YAPA_CHROMA_URL` · **Description**: ChromaDB server URL (when `YAPA_STORAGE=chroma`) · **Default**: `http://localhost:8000`
- **Variable**: `YAPA_USERNAME` · **Description**: Username for task ID prefixes · **Default**: `user`
- **Variable**: `YAPA_EMBEDDING_PROVIDER` · **Description**: Embedding provider — `chromadb` is in-process MiniLM (zero-config, no server call); `fireworks`/`openai`/`voyage`/`ollama` use HTTP APIs · **Default**: `chromadb`
- **Variable**: `YAPA_SALIENCE_DECAY_RATE` · **Description**: Daily decay multiplier · **Default**: `0.98`
- **Variable**: `YAPA_SALIENCE_RANKING_WEIGHT` · **Description**: How much salience influences retrieval ranking (0.0 = pure distance, higher = salience-dominant) · **Default**: `0.3`
- **Variable**: `YAPA_TRAINING_PIPELINE` · **Description**: Expose the 18 ML-ops tools (curation/buckets/training/eval/adapter) · **Default**: `false`
- **Variable**: `YAPA_SYNC_ENABLED` · **Description**: Enable remote sync · **Default**: `false`
- **Variable**: `YAPA_SYNC_DATABASE_URL` · **Description**: PostgreSQL connection string · **Default**: _(none)_
- **Variable**: `YAPA_SYNC_INTERVAL_MS` · **Description**: Background sync interval in ms · **Default**: `300000` (5 min)
- **Variable**: `YAPA_SYNC_SIMILARITY_THRESHOLD` · **Description**: Cosine similarity threshold for dedup · **Default**: `0.95`

ML-ops configuration (curation models, bucket thresholds, training backend,
eval holdout, …) lives in
[docs/training-pipeline.md](docs/training-pipeline.md#configuration).

## Remote Sync

Remote sync lets multiple machines or teammates share memories and tasks through a PostgreSQL+pg