# Malong LiuHe（码龙·六合工具）

**LLM-Native Code Operations Toolkit** — Code tooling reinvented for the LLM that has no hands, no eyes, and no memory.

[![wulun811/LiuHe MCP server](https://glama.ai/mcp/servers/wulun811/LiuHe/badges/score.svg)](https://glama.ai/mcp/servers/wulun811/LiuHe)

**Malong LiuHe** is a toolkit built for LLMs rather than humans. It ships two components:
- **`malong/`** — an MCP toolset (44 tools): symbol read/write, indexing, impact analysis, reference tracing, call graphs, dead-code detection, code review, security scanning, atomic batch editing, test orchestration, pipeline verification — served to the LLM over MCP (JSON-RPC over stdio).
- **`malong-parse/`** — a Rust parsing service: a tree-sitter-based multi-language symbol extraction engine (JavaScript/TypeScript/TSX/Python/Go/Rust/C/C++/Java/Bash), talking to the toolset over a Unix socket, with an LRU tree cache and batched parallel extraction.

## Core Idea

Traditional tools (git, sed, IDE) assume a user with hands, eyes, and memory. An LLM has none of these. Malong LiuHe is redesigned around that fact:

### Missing · Design Consequence
- **Missing**: **No hands** · **Design Consequence**: Operations must be atomic, undoable, retryable (`edit_transaction` with rollback and undo journal)
- **Missing**: **No eyes** · **Design Consequence**: Output must be structured and self-explanatory (JSON for direct consumption; errors carry `suggestion`/`next_action`)
- **Missing**: **No memory** · **Design Consequence**: Every call is self-contained (takes `workspace_dir`); optimistic concurrency with version anchors (`read_symbol` → `write_symbol(base_version)` conflict state machine)

## Performance (Measured)

### Metric · Value · Note
- **Metric**: Small-file read P95 · **Value**: **1ms** · **Note**: 50 runs, warmed
- **Metric**: Small-file write P95 · **Value**: **7ms** · **Note**: 30 runs, incl. post-write re-index
- **Metric**: `repo_map` · **Value**: **98ms** · **Note**: down from tens of seconds (SQLite index + Rust parsing)
- **Metric**: Memory · **Value**: **RSS 134MB / 26%** · **Note**: under a real docker `--memory=512m` cgroup limit
- **Metric**: Concurrency · **Value**: **128 concurrent / 256 in-flight requests, zero OOM** · **Note**: 32-way mixed read+write on one hot file, no tearing, DB `integrity_check` PASS
- **Metric**: Throughput · **Value**: **~588 calls/s** · **Note**: single-threaded ceiling — 60–600× real LLM demand
- **Metric**: Token savings · **Value**: **↓65.3%** · **Note**: same task 7673 → 2662 est. (primitives)
- **Metric**: Call reduction · **Value**: **↓50.0%** · **Note**: 6 calls (legacy) → 3 calls (primitives)
- **Metric**: Tool-description compression · **Value**: **44 tools ≈ 1.33k tokens** · **Note**: tiered: core kept, low-freq ≤70 chars, verbose ≤230; detail flows via next_step hints
- **Metric**: Index throughput · **Value**: **538 files / 7s** · **Note**: scoped reindex, measured
- **Metric**: dry_run fidelity · **Value**: **47/47** · **Note**: golden-hash comparison across 3 languages, 100%
- **Metric**: Concurrent writes to same symbol · **Value**: **16/16** · **Note**: exactly one winner + one conflict, zero silent overwrites

## Language Support

### Language · Symbol Extraction · Reference Extraction
- **Language**: JavaScript / TypeScript / TSX / JSX / MTS / CTS · **Symbol Extraction**: ✓ · **Reference Extraction**: ✓
- **Language**: Python · **Symbol Extraction**: ✓ · **Reference Extraction**: ✓
- **Language**: Go · **Symbol Extraction**: ✓ · **Reference Extraction**: ✓
- **Language**: Rust (impl blocks / trait / enum semantics) · **Symbol Extraction**: ✓ · **Reference Extraction**: ✓
- **Language**: C / C++ (incl. headers) · **Symbol Extraction**: ✓ · **Reference Extraction**: ✓
- **Language**: Java · **Symbol Extraction**: ✓ · **Reference Extraction**: ✓
- **Language**: Bash · **Symbol Extraction**: ✓ · **Reference Extraction**: ✓

## Tool Overview

### Category · Tools
- **Category**: **I/O primitives** · **Tools**: `read_symbol` (symbol read + version), `write_symbol` / `write_symbols` (safe write: conflict state machine + atomic write + undo)
- **Category**: **Index & search**
- **Category**: **Analysis** · **Tools**: `impact_analysis` (blast radius + risk), `call_chain`, `references`, `dep_graph`, `inspect` (outline + refs + call chain in one), `trace_symbol` (constant tracing + hardcoded copies)
- **Category**: **Editing** · **Tools**: `edit_batch`, `edit_transaction` (atomic txn + rollback + cross-session lock), `edit_collision_guard` (write conflict detection), `edit_sandbox` (pre-write validation), `diff_facts` (symbol changes + test sync), `rename_symbol` (atomic cross-file rename), `git_worktree` (isolated branch + verify + merge)
- **Category**: **Quality gates** · **Tools**: `code_review`, `security_review` (regex security patterns), `code_quality` (5-dim probe), `style_sniffer`, `guard_patterns`, `naming_consistency`, `exception_guard`, `config_drift`, `dependency_gatekeeper`, `fix_imports`, `sweep_dead_code`, `mock_sync` — all pure regex/AST, zero LLM calls, deterministic
- **Category**: **Engineering** · **Tools**: `test_bridge` (run/suggest/discover), `find_tests`, `verify_pipeline` (lint/test/typecheck stages), `debug_runner` (error analysis), `patch_parser` (SEARCH/REPLACE), `tsc_check`, `spec_gen`, `active_todos`
- **Category**: **System** · **Tools**: `health`, `gc`, `feedback`

## Architecture

```
┌─────────────────────────┐     ┌──────────────────────────────┐
│  LLM Client (MCP)       │     │  malong-parse (Rust daemon)  │
│  malong/ 44 tools       │◄───►│  tree-sitter, 10 languages   │
│  SQLite index (per ws)  │     │  LRU tree cache 50MB / batch │
│  Unix socket client     │     │  catch_unwind crash recovery │
└─────────────────────────┘     └──────────────────────────────┘
```

- All parsing is done by the Rust service (zero tree-sitter bindings on the Node side)
- Index is SQLite (WAL mode, multi-process safe), isolated per workspace
- LRU tree cache (50MB / 5min TTL), batched extraction 50 files/batch
- Daemon multi-session safety: circuit breaker + liveness probe + cross-session coordinated restart (O_EXCL lock) — a slow request in one session never stalls others

## Self-Hosting (Dogfooding)

30+ rounds of "Malong reviews Malong": the toolset audits and fixes its **own** code, with dozens of real bugs fixed and locked by tests — including directory-scope filtering gaps, false dead-code reports for registration patterns, lost constant read-sites, and SQL parameterization cleanup. Every round grew the assertion count (now 2231 across 86 JS test files, full chain 0 failures, measured 2026-08-24).

## Scan Boundaries (limits acknowledged; committed within)

Deterministic scanners only — regex pattern matching and reference graphs. **No control-flow, data-flow, or cross-module semantic coverage.** 0 findings ≠ clean; high scores ≠ healthy.

- `security_review` scans: injection (eval/Function-ctor, exec/spawn string building, template `${}`, `$()` substitution, SQL concat), XSS, hardcoded secrets, CORS *, timing/insecure compare, dotenv. **Not scanned**: SSRF, XXE, deserialization, auth/logic flaws, control-flow defects.
- `sweep_dead_code` reference scope: import graph + fixed text-ref fallback (.sh/.json/.md etc.); CLI-string references count as alive (miss-over-delete). **Not scanned**: dynamic/reflection wiring.
- Commitment: issues in scope get fixed; covered patterns are test-locked; new rules must stay within committed categories.

## Quick Start

### Standard install (default — recommended)

`npm ci` installs `better-sqlite3` (the full SQLite backend); this is the default recommended path:

```bash
# 1) Get the parsing daemon — download a prebuilt binary from releases/, or build:
cd malong-parse && cargo build --release && cp target/release/malong-parse ~/.local/bin
malong-parse &                                   # start the daemon (Unix socket)

# 2) Install the toolset (npm ci installs the full better-sqlite3 backend)
cd ../malong && npm ci

# 3) Register the MCP server (works with any MCP client, e.g. opencode / Claude Desktop)
#    opencode (project-root opencode.json; Windows paths use double backslashes, Linux/macOS forward slashes):
#    {
#      "mcp": {
#        "malong": {
#          "type": "local",
#          "command": ["node", "--max-old-space-size=512", "N:\\repo\\liuhe\\malong\\mcp-server.js", "--workspace", "N:\\repo\\liuhe"],
#          "enabled": true
#        }
#      }
#    }
#    Claude Desktop (verified on Windows: %APPDATA%\Claude\claude_desktop_config.json):
#    {
#      "mcpServers": {
#        "malong": { "command": "node", "args": ["/path/to/malong/mcp-server.js"] }
#      }
#    }

# 4) Ask your LLM: "search for the symbol 'handle' in my workspace"

#    DeepSeek Harness (dsh web) — auto session-workspace convenience (extra, optional):
#    Run once on the dsh host (Linux/macOS):
#      Option A (npm, one line — full backend + platform binary included):
#        dsh plugin --profile web add @jieai/dsh-malong-bridge
#        pkill -f "dsh web"; dsh web --port 3456 --host 0.0.0.0 --trusted-host <LAN IP>
#      Option B (script, points at a checkout of this repo):
#        bash malong/dsh/install-dsh.sh         # idempotent; edits ~/.dsh/profiles/web/cordis.patch.yml with backup
#    The bridge registers all 44 tools as malong__* and auto-fills workspace_dir from the
#    current conversation's workspace (no per-call path needed; explicit paths still win).
#    Full guide incl. index rules: malong/dsh/DSH-INTEGRATION.md
#    Troubleshooting: if EVERY malong__* call hangs until timeout, the bridge's
#    mcp-server subprocess is gone. The bridge now auto-restarts it (exponential
#    backoff, pending calls fail fast with "restarting — retry shortly"); if that
#    keeps failing, restart dsh web: kill <dsh web pid> && dsh web --port 3456 ...
```

> **SQL backend note:** the default is the full `better-sqlite3` backend. If `npm install` fails (offline / no build toolchain / Node < 20), the server automatically degrades to the **vendored sql.js WASM sandbox backend** (`malong/vendor/`, zero-dependency, no network) — the startup log shows which backend is active and the upgrade command. Data files are fully compatible between backends (both are SQLite).

### Zero-build deployment (degraded path: sandbox / offline environments)

For environments with **Node >= 20 and no npm access** (no `npm ci`, no native
compilation), everything runs from the repo files as-is (Linux/Windows — the
prebuilt binaries are `linux-x86_64` and `windows-x86_64`). On this path SQLite
runs on the sql.js sandbox backend (degraded):

```bash
# 0) Clone, then enter the toolset directory:
git clone <repo-url> liuhe && cd liuhe/malong

# 1) Parse daemon — prebuilt binary from releases/ (no cargo needed):
mkdir -p ~/.local/bin
tar -xzf ../releases/malong-liuhe-0.4.7-linux-x86_64.tar.gz
cp malong-parse/target/release/malong-parse ~/.local/bin
malong-parse &                                   # start the daemon (socket: /tmp/malong-parse-$UID.sock)

# 2) Run the toolset — zero npm install:
node --max-old-space-size=4096 mcp-server.js --workspace /path/to/project
# vendored SQLite (sql.js WASM) auto-enabled when better-sqlite3 is unavailable

# 3) Self-check (30s, optional):
node tests/test-db-adapter.js   # 22 assertions: sql.js backend + persistence
node tests/test-mcp-server.js   # 25 assertions: MCP stdio + daemon round-trip
```

> **Windows users:** use `releases/malong-liuhe-0.4.7-windows-x86_64.tar.gz` (contains `malong-parse.exe`), extract and put it on PATH; the MCP server auto-starts the daemon, so step 1's `malong-parse &` is not required. The `mkdir -p`/`tar -xzf` above are Unix syntax — on Windows use any extractor (`tar -xzf` works on Win10+).

> Note: if the daemon is not running, parse-dependent tools (symbol extraction
> etc.) degrade; the SQLite-backed tools (repo-map / code-index / health-check)
> still work.

- See `THIRD_PARTY_NOTICES.md` for the vendored component.

What the LLM sees back:

```json
{
  "results": [
    { "name": "handle", "type": "function", "start_line": 6, "end_line": 12, "file": "app.js" },
    { "name": "handle_login", "type": "function", "start_line": 5, "end_line": 9, "file": "src/auth.py" }
  ],
  "count": 2,
  "next_step": "Before modifying found symbols, check blast radius: impact_analysis(...)"
}
```

### Build the Rust parsing service

```bash
cd malong-parse
cargo build --release
cp target/release/malong-parse ~/.local/bin/   # or add to PATH
malong-parse &                                   # daemon (Unix socket: /tmp/malong-parse-$(id -u).sock)
```

Prebuilt binaries for Linux x86_64 are committed under
[`releases/`](releases/) (with `.sha256` checksums) — pick one up instead of building if you prefer.

**Platforms:** Linux and macOS use the Unix socket; on **Windows** the daemon listens on TCP `127.0.0.1:31001` (set `MALONG_PORT` to override) — the MCP server probes and auto-starts `malong-parse.exe` on startup, so no manual launch is needed (if you use the parse-client API directly outside MCP, start it manually). Set `MALONG_SOCKET` to override the Unix socket path.

### Install the toolset

```bash
cd malong
npm ci
npm test          # 2231 assertions (daemon must be running)
```

### Start the MCP server

```bash
cd malong
node --max-old-space-size=512 mcp-server.js --workspace /path/to/project
```

Register the MCP server with any MCP-capable LLM client and the tools become available. For **opencode**, register in the project root `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "malong": {
      "type": "local",
      "command": ["node", "--max-old-space-size=512", "malong/mcp-server.js", "--workspace", "."],
      "enabled": true
    }
  }
}
```

> Windows note: relative paths in `--workspace` and `malong/mcp-server.js` resolve against the directory where opencode is launched; pass absolute paths (escape backslashes as `\\` in JSON) if you start it elsewhere. The daemon is auto-started by the MCP server — no need to launch `malong-parse.exe` manually.

### Configuration (environment variables)

All optional — sensible defaults apply when unset.

### Variable · Default · Purpose
- **Variable**: `MALONG_STATE_DIR` · **Default**: `~/.config/malong` · **Purpose**: Where usage / feedback / edit-stats files are written. Override to redirect state (tests, sandboxed hosts). Reads fall back to the legacy `~/.config/opencode/` so pre-0.3.37 data is not lost.
- **Variable**: `MALONG_SOCKET` · **Default**: `/tmp/malong-parse-$(id -u).sock` · **Purpose**: Unix socket path to the parse daemon (Linux / macOS).
- **Variable**: `MALONG_PORT` · **Default**: `31001` · **Purpose**: TCP port for the parse daemon (Windows).
- **Variable**: `MALONG_PARSE_BIN` · **Default**: npm platform pkg / `~/.local/bin` · **Purpose**: Binary used when the client auto-starts the daemon. Resolution order: this env → `@jieai/malong-parse-<os>-<arch>` npm platform package (installed as an optional dependency of `@jieai/dsh-malong-bridge`) → `~/.local/bin/malong-parse` → `malong-parse/target/release` (dev tree).
- **Variable**: `MALONG_PARSE_MODE` · **Default**: rust-service · **Purpose**: Parse transport. Only `rust-service` is supported (`builtin` / `shadow` are rejected).
- **Variable**: `MALONG_WS_GC_DAYS` · **Default**: `14` · **Purpose**: Days a workspace index cache may sit untouched before `health cleanup` prunes it; `0` disables.

### Suppressing security false positives

`security_review` is deliberately conservative, so benign patterns (a hash used as a cache key, `process.exit` in a CLI entry) can trip it. Two explicit, auditable suppression mechanisms exist — neither ever auto-suppresses injection rules.

**Inline** — append `malong-ignore` to a line to suppress all findings on it, or `malong-ignore[eval,exec-cmd]` for specific rules (a reason after `:` is encouraged):

```js
const id = crypto.createHash('md5').update(p).digest('hex') // malong-ignore: cache-dir name, not security
```

**Config** — add a `securityIgnore` array to `.ai-patterns.json` (the same file `guard_patterns` reads). Each entry takes `files` (`*` / `**` globs) and/or `rules`; omit one side to match all:

```json
{ "securityIgnore": [ { "files": ["**/mcp-server.js"], "rules": ["process-exit"] } ] }
```

Suppressed findings are dropped from the score but counted in the summary's `suppressed` field, so nothing is hidden silently. Injection rules (eval / exec / SQL / spawn) are only ever suppressed by an explicit marker or entry you authored — never heuristically.

### Journal auto-cleanup

Every safe write (`write_symbol` / `write_symbols` / `edit_batch`) leaves an undo journal under `.malong/journal/`. Terminal transactions (`committed` / `rolled_back` / `abandoned` / `failed`) older than a TTL (default **24h**, configurable) are pruned automatically — throttled to at most one scan per hour per workspace, so it costs nothing. In-flight (`created` / `staged`) and `needs_review` (external change awaiting human review) journals are **never** auto-deleted. This only ever touches the tool's own rollback backups — never your source files.

### Using with Claude Code

Verified end-to-end with Claude Code 2.x. The MCP layer is standard JSON-RPC over
stdio, so any MCP client (Claude Code, codex, opencode, Claude Desktop…) connects
the same way.

**1) Prerequisites** — Node >= 20 and the parsing daemon running (see the
*Zero-build deployment* or *Build the Rust parsing service* sections above).

**2) Install Claude Code**

```bash
npm install -g @anthropic-ai/claude-code
```

**3) Point Claude Code at an Anthropic-compatible provider**

Claude Code needs an LLM backend. Any Anthropic-compatible endpoint works — set the
variables below (or manage them with [`cc-switch`](https://www.npmjs.com/package/@cc-switch/cli)):

```bash
export ANTHROPIC_BASE_URL="https://your-provider/anthropic