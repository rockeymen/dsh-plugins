![DSH Noema](./docs/images/dsh-noema-logo.png)

# DSH Noema

  Long-term memory for DeepSeek Harness — durable, inspectable agent memory backed by Noema.
  <sub>Recall Before Work &bull; Import From 9 Agent Tools &bull; Settings-Page Memory Management &bull; Crash Keep-Alive &bull; Hot Reload</sub>

  <sub>npm: [`@zseven-w/dsh-noema`](https://www.npmjs.com/package/@zseven-w/dsh-noema) · Current plugin release: `0.1.0-rc.1` · Tested with DSH `0.1.0-rc.6`</sub>

  ![DSH Noema — memory settings page](./docs/images/dsh-noema-overview.png)

<sub>The Noema Memory settings page — import sources, memory management, and live server status</sub>

## Why DSH Noema

DSH Noema connects [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) with [Noema](https://github.com/ZSeven-W/noema) — a local-first, non-vector memory system for coding agents — so an Agent keeps durable knowledge across sessions instead of starting every conversation from zero.

### 🧠 Durable Recall

Memories persist as inspectable Markdown files under `NOEMA_ROOT` (default `~/.agent-memory/`). `noema_recall` loads relevant context at the start of a session; `noema_search`, `noema_browse`, `noema_catalog`, and `noema_recall_graph` cover lookup, exploration, and auditing.

### 📥 Import From Other Tools

`noema_import` reads the memory files of nine other AI coding tools — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder — splits them into sections, and saves each as a durable memory. A content-keyed ledger deduplicates across runs and across tools that share files.

### 🛠️ Settings-Page Management

The Noema Memory settings page configures the server command, memory root, budgets, idle/call timeouts, and the guidance section — and a Manage memories card searches, browses, adds, reviews, and deletes stored memories directly.

### 🩺 Keep-Alive

The memory server stays up: idle timeout defaults to never, and a keep-alive loop restarts the `noema-mcp` child in the background when it crashes or exits, with a configurable check interval and restart backoff.

### 🔍 Smart Entity Extraction

Noema's extraction engine combines jieba word segmentation with high-precision signals — English proper nouns, CJK names and technical terms, quoted topics, and repetition — with stopword and path filters, so the PageIndex topic catalog stays clean.

### ⚡ Hot Reload

After the first boot, the plugin never needs a restart again: `pnpm run build` hot-reloads the host plugin through Cordis HMR, and `ppnpm run build:client` hot-swaps the browser bundle over the client-hmr SSE channel.

## Install into DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

Or, for local development straight from the source tree:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

The `link:` protocol symlinks the profile dependency to this repository, so rebuilds are visible immediately and Cordis HMR can watch the compiled output.

The plugin bundles the `noema-mcp` binary through per-platform optional npm packages. To build it yourself instead, run `cargo build --release -p noema-mcp` inside the bundled `noema` submodule, or point the Server command setting at any `noema-mcp` build.

## Memory Tools

The model-facing tools mirror the Noema MCP surface:

### Tool · What it does
- **Tool**: `noema_recall` · **What it does**: Recall relevant memories for a query, with a token budget.
- **Tool**: `noema_search` · **What it does**: Full-text search over stored memories.
- **Tool**: `noema_browse` · **What it does**: Browse the PageIndex catalog for a topic or entity.
- **Tool**: `noema_catalog` · **What it does**: Render the full memory catalog as markdown.
- **Tool**: `noema_recall_graph` · **What it does**: Multi-hop recall through links and shared entities.
- **Tool**: `noema_neighbors` · **What it does**: One graph hop from a memory.
- **Tool**: `noema_explain` · **What it does**: Explain why a memory was or was not recalled.
- **Tool**: `noema_remember` · **What it does**: Save a durable fact, decision, constraint, or preference.
- **Tool**: `noema_review_list` · **What it does**: List pending review candidates.
- **Tool**: `noema_review_decide` · **What it does**: Accept, reject, edit, or merge a candidate.
- **Tool**: `noema_forget` · **What it does**: Tombstone or hard-delete a memory.
- **Tool**: `noema_policy_get` / `noema_policy_set` · **What it does**: Read or update the write policy.
- **Tool**: `noema_status` · **What it does**: Server and tenant status: counts, index health, storage root.
- **Tool**: `noema_import` · **What it does**: Import memories from other AI coding tools.

Each tool returns a uniform envelope `{ ok, tool, text }` where `text` carries the full server output.

## Import memories from other tools

### Source id · Global files · Workspace files
- **Source id**: `codex` · **Global files**: `~/.codex/AGENTS.md` + the Codex memory pipeline: `~/.codex/memories/MEMORY.md`, `memory_summary.md`, `rollout_summaries/*.md`, `extensions/ad_hoc/notes/*.md` (`raw_memories.md` skipped — it is the uncurated feed) · **Workspace files**: `AGENTS.md`, `AGENTS.local.md`
- **Source id**: `claude-code` · **Global files**: `~/.claude/CLAUDE.md`, `~/.claude/CLAUDE.local.md`, `~/.claude/MEMORY.md` · **Workspace files**: `CLAUDE.md`, `CLAUDE.local.md`, `MEMORY.md`
- **Source id**: `opencode` · **Global files**: `~/.config/opencode/AGENTS.md` · **Workspace files**: `AGENTS.md`
- **Source id**: `cursor` · **Global files**: `~/.cursor/rules/*.mdc`, `~/.cursorrules` · **Workspace files**: `.cursor/rules/*.mdc`, `.cursorrules`
- **Source id**: `grok` · **Global files**: `~/.grok/AGENTS.md` + the Grok cross-session memory: `~/.grok/memory/MEMORY.md`, per-project `MEMORY.md`, and `sessions/*.md` summaries · **Workspace files**: `AGENTS.md`
- **Source id**: `workbuddy` · **Global files**: `~/.codebuddy/CODEBUDDY.md` (WorkBuddy memory file), `~/.workbuddy/AGENTS.md`, `~/.workbuddy/memory.md`, `~/.config/workbuddy/AGENTS.md`, `~/Library/Application Support/WorkBuddy/AGENTS.md` · **Workspace files**: `AGENTS.md`, `CODEBUDDY.md`
- **Source id**: `antigravity` · **Global files**: `~/.antigravity/AGENTS.md`, `~/.config/antigravity/AGENTS.md`, `~/Library/Application Support/Antigravity/AGENTS.md` (best-effort; no documented global memory store yet) · **Workspace files**: `AGENTS.md`, `AGENTS.local.md`
- **Source id**: `trae` · **Global files**: `~/.trae/AGENTS.md`, `~/.trae/memory/`, `~/.trae/rules/` (plus the `~/.trae-cn` variants) · **Workspace files**: `AGENTS.md`, `.trae/rules/`
- **Source id**: `qoder` · **Global files**: `~/.qoder-cn/AGENTS.md`, `~/.qoder-cn/rules/`, the auto-memory roots `~/.qoder-cn/memory/` and `~/.qoder-cn/projects/*/memory/` (plus `~/.qoder` variants) · **Workspace files**: `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/`

- The `source` argument selects one tool, or omit it to run every source enabled in settings.
- The `path` argument selects the workspace root for project-scoped files (defaults to the session workspace; workspace files only load when the Import workspace files setting is on).
- Imports are deduplicated through a ledger at `$DSH_HOME/storages/dsh-noema-imports.json`, keyed by file path + section content — when several tools share one project `AGENTS.md`, each section is imported exactly once. `force: true` re-imports everything.
- The settings page exposes per-source checkboxes, an import-on-startup toggle, a file-size cap, and an Import now button with a last-run summary.

## Settings

Open **Settings → Noema Memory**:

### Setting · Default · Meaning
- **Setting**: Enable memory · **Default**: on · **Meaning**: Master switch for the `noema_*` tools.
- **Setting**: Memory guidance · **Default**: on · **Meaning**: System-prompt section teaching memory usage.
- **Setting**: Start server at boot · **Default**: on · **Meaning**: Spawn at DSH start instead of first use.
- **Setting**: Auto-accept new memories · **Default**: on · **Meaning**: `noema_remember` persists immediately.
- **Setting**: Server command · **Default**: `bundled` · **Meaning**: Bundled `noema-mcp` binary or a custom executable path/command.
- **Setting**: Working directory · **Default**: — · **Meaning**: cwd for the server (needed for `cargo run`).
- **Setting**: Memory root (NOEMA_ROOT) · **Default**: — · **Meaning**: Where memories are stored; empty = `~/.agent-memory`.
- **Setting**: Recall token budget · **Default**: 1200 · **Meaning**: Default `budget_tokens` for `noema_recall`.
- **Setting**: Idle timeout (ms) · **Default**: 0 · **Meaning**: Stop the server after idle; 0 = never.
- **Setting**: Keep alive · **Default**: on · **Meaning**: Restart the server in the background when it crashes or exits.
- **Setting**: Keep-alive interval (ms) · **Default**: 5000 · **Meaning**: Minimum delay between background health checks.
- **Setting**: Call timeout (ms) · **Default**: 30000 · **Meaning**: Per-tool-call deadline.
- **Setting**: Restart delay (ms) · **Default**: 1000 · **Meaning**: Backoff between a stop/crash and the next start.

The status card shows server health with restart/stop actions, and the import section manages the nine memory sources.

## Hot reload

DSH's HMR machinery is fully usable once the plugin has been loaded once:

- **Host plugin** — enable the Cordis HMR entry in the profile patch with its watch root pointed at this package's `lib/` output, and keep the `link:` dependency. Run `pnpm run build` and the running DSH reloads the plugin entry automatically (the Noema server child is restarted by the reload) — no server restart.

  ```yaml
  # ~/.dsh/profiles//cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **Client bundle** — `ppnpm run build:client` rewrites `lib/client.js`; the client-hmr node half stat-polls every graph bundle (default 500ms) and broadcasts a `rebuilt` frame over the `/plugins/events` SSE channel, and the browser hot-swaps the module without a page refresh.
- **Settings** — every change made on the Noema Memory settings page applies live through the settings service.

The one thing hot-reload cannot do is load a plugin that was never in the booted tree: the running composition neither watches the profile patch layer (the web app does not wire `watchUserPatches`) nor exposes a loader mutation API (the plugin inventory RPC is read-only). A fresh plugin therefore needs exactly one server restart, after which the loop above is fully hot.

## Develop

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

The e2e test runs against `noema/target/debug/noema-mcp` when present (it is skipped otherwise).