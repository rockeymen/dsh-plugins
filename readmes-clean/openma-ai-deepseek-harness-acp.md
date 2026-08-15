![Agent Client Protocol × DeepSeek Harness](assets/acp-x-deepseek.svg)

# deepseek-harness-acp

  Use <a href="https://github.com/deepseek-ai/deepseek-harness">DeepSeek Harness</a> from

The adapter composes the harness **in-process** and maps its session-event log
onto the full ACP vocabulary: streamed text and reasoning, tool calls with
diffs and display terminals, plans, permission requests, session modes,
config options, slash commands, skills, and MCP servers. Credentials never
touch your editor config — it reuses the key you saved in the dsh Web UI, or
`dsh-acp login` saves one to the same store.

## Two ways to plug it in

| | **A · Standalone server** | **B · dsh profile plugin** |
|---|---|---|
| Best for | Getting started in one command | Living inside your dsh setup |
| Install | `npm i -g @openma/deepseek-harness-acp` | `dsh plugin --profile acp add -w @openma/deepseek-harness-acp` |
| Zed runs | `dsh-acp` | `dsh --profile acp` |
| Harness | Your installed dsh — or the vendored fallback when none exists | The dsh that owns the profile |
| Composition | dsh-base + this bundle (profile machinery booted in-process) | dsh-base + this bundle + your profile's own patches |

Both shapes share `$DSH_HOME`: the same credential store, settings, presets,
and session logs as `dsh web` — conversations started in the Web UI can be
listed and loaded from the editor.

### A · Standalone server

```bash
npm install -g @openma/deepseek-harness-acp
dsh-acp login        # interactive; or save the key in the dsh Web UI
```

```jsonc
// Zed settings.json
{
  "agent_servers": {
    "DeepSeek Harness": { "command": "dsh-acp" }
  }
}
```

Self-contained: it finds your DeepSeek Harness via `--dsh-path` / `DSH_PATH`,
its own tree, `./node_modules`, `dsh` on PATH, or `npm root -g` — and ships a
vendored harness runtime as the **last** candidate, so it works out of the box
and always prefers the dsh you installed. When a real
`$DSH_HOME/profiles/acp` exists, that profile owns the composition.

### B · dsh profile plugin

```bash
npm install -g @deepseek-ai/dsh
dsh web                                                  # save your API key once
dsh plugin --profile acp add -w @openma/deepseek-harness-acp
```

```jsonc
// Zed settings.json
{
  "agent_servers": {
    "DeepSeek Harness": { "command": "dsh", "args": ["--profile", "acp"] }
  }
}
```

This creates `$DSH_HOME/profiles/acp` and registers the package's
`dsh.bundle` patch: the bridge mounts over `@deepseek-ai/dsh-base` — the same
product baseline as `dsh web`, with the module-reload watcher off. Extend the
profile in `$DSH_HOME/profiles/acp/cordis.patch.yml` like any other dsh
profile.

## Authentication

No keys in editor config, no ACP-mediated secrets. In order:

1. **Harness credential store** — `$DSH_HOME/.credentials.yaml` (mode 600),
   the file the dsh Web UI writes; hot-reloaded. Save a key with
   `dsh-acp login`, the Web UI (Settings → Models), or `/login <key>` in chat.
2. **Process environment** — `DEEPSEEK_API_KEY` / `DEEPSEEK_BASE_URL` in the
   environment that launches the agent.

The initialize handshake advertises **Terminal Auth** (`dsh-acp login`), so
registry-driven clients can run the interactive setup for you.

## Features

- **Streaming** — assistant text and reasoning deltas; assembled-message fallback.
- **Tool calls** — ACP kinds, human titles, file locations, real diffs from fs-tool hunks, raw input/output; command output on a **display terminal** when the client supports one, fenced output otherwise.
- **Permission presets as session modes** — `read-only` / `workspace-write` / `danger-full-access`, each a named `{sandbox, approval}` pair recorded as a durable session fact (also exposed as a config option for clients that only render those).
- **Agent presets** — `standard` / `code` / `minimal` / `cordis` as a config option; switching rebuilds the agent live with history preserved.
- **Live model catalog** — providers × models from the running composition (third-party providers added in the Web UI appear immediately), plus reasoning-effort selection that follows your product default.
- **Slash commands** — adapter built-ins (`/status`, `/login`, `/logout`, `/model`) plus the harness command registry (`/compact`, `/goal`, `/permission`, `/plan`, …) executed without a model turn, plus **skills** (`/skill-name` — the harness's own invocation gesture).
- **Plans & usage** — `todo_write` snapshots as ACP plans; token accounting as `usage_update` and per-turn usage.
- **Sessions** — `session/load` with full history replay, `session/list`, silent restore when a client prompts an old session after an agent restart, titles as `session_info_update`.
- **MCP servers** — per-session `mcpServers` mount `@deepseek-ai/dsh-mcp-client` instances (stdio + streamable HTTP); tools join as `mcp__<server>__<tool>`; a failing server never takes the session down.
- **Real cancellation** — `session/cancel` interrupts the live turn through the harness agent.

## Configuration

Flags win over environment variables, which win over defaults. All optional —
with no flags, sessions follow your product defaults (`settings.yaml`).

| Flag | Env | Default | Purpose |
|---|---|---|---|
| `--dsh-path` | `DSH_PATH` | auto-detect | DeepSeek Harness installation |
| `--provider` | `DSH_PROVIDER` | product default | Provider route override |
| `--model` | `DSH_MODEL` | product default | Model override |
| `--max-tokens` | `DSH_MAX_TOKENS` | provider default | Per-request output-token cap |
| `--permission-mode` | `DSH_PERMISSION_MODE` | `workspace-write` | Initial permission preset |
| `--reasoning-effort` | `DSH_REASONING_EFFORT` | product default | `off` / `high` / `max` |
| — | `DEEPSEEK_API_KEY` | — | API credential (fallback to the credential store) |
| — | `DEEPSEEK_BASE_URL` | DeepSeek endpoint | OpenAI-compatible endpoint override |
| — | `DSH_ACP_DEBUG` | off | Verbose stderr diagnostics |

Subcommands: `dsh-acp login [api-key]` (interactive when omitted; input never
echoes), `dsh-acp update` (self-update via npm).

## Permissions and sandboxing

Sessions start in `workspace-write`: bash and file mutations are confined to
the session's `cwd` (plus shared temp roots), and a model retry requesting
wider access raises an ACP permission request. **Always allow (this
session)** flips the approval policy to `never` for that session.
`danger-full-access` disables both the sandbox and the prompts — use it only
in disposable checkouts or containers. Each level is one durable preset
(sandbox + approval together), the same three the Web UI offers.

## Architecture

```
ACP client (Zed, …)
   │  ACP JSON-RPC over stdio
   ▼
dsh-acp
   ├─ src/profile-boot.ts     boots the harness's own profile machinery
   │                          (dsh-base + this bundle + $DSH_HOME layers)
   ├─ src/harness.ts          host discovery (DSH_PATH → cwd → PATH → npm -g → vendored)
   └─ src/bridge/             the ACP bridge (a cordis plugin)
        ├─ index.ts           sessions, prompts, cancel, modes, options,
        │                     commands, credentials, MCP mounts
        ├─ translate.ts       session-event → ACP update projection (pure)
        ├─ history.ts         stored-log replay for session/load (pure)
        └─ prompt.ts          ACP prompt blocks → harness content blocks (pure)
   ▼
your @deepseek-ai/dsh installation   (agent spine, llm, persistence, sandbox,
                                      tools, presets, skills, compaction, …)
```

The bridge consumes the harness `session/event` firehose — the same
append-only log persistence stores — so live streaming, history replay, and
`session/list` agree by construction. All harness modules, including cordis
itself, load from one host tree: plugin and service identity is never split
across copies.

## Development

```bash
npm install         # dev deps include the harness packages (types + tests)
npm run typecheck   # tsc --noEmit
npm test            # vitest: unit + e2e smoke (boots the real composition; no model calls)
npm run build       # esbuild → dist/
```

To also run the e2e suite against a standalone host install:

```bash
npm install --prefix /tmp/dsh-host @deepseek-ai/dsh
DSH_ACP_TEST_HOST=/tmp/dsh-host npm test
```

### Live iteration: paired profiles

Keep the profile your editor uses on the published package, and point a
second profile at this worktree via a pnpm symlink:

```bash
dsh plugin --profile acp add -w @openma/deepseek-harness-acp   # stable
dsh plugin --profile acp-test add -w "link:$PWD"               # dev (symlink)
```

The dev loop is `npm run build` + restart — `dist/` and `cordis.patch.yml`
are read through the link. (pnpm treats `file:` as a copy install and caches
same-version tarballs; `link:` avoids both.)

```jsonc
{
  "agent_servers": {
    "DeepSeek Harness": { "command": "dsh", "args": ["--profile", "acp"] },
    "DeepSeek Harness (dev)": { "command": "dsh", "args": ["--profile", "acp-test"] }
  }
}
```