# dshx

**The missing companion CLI for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).**

Manage MCP servers, skills, and agent memory with one command — dry-run connection checks before anything is written, secret-safe config output, and one-shot migration of your existing Claude Code / Codex setup (MCP servers, skills, and global memory). Ships with a `SKILL.md` so the dsh agent itself knows how to use it, and a `/mcp` command with an interactive card in dsh Web.

![How dshx validates an MCP server before writing it into dsh: a stdio command or an HTTP URL goes through dshx, which performs the MCP handshake and tools/list; only a server that answers is written into dsh, while a 403 or crashing server is rejected.](assets/dshx-mcp-flow.webp)

```sh
npm install -g @why913/dshx

dshx mcp add everything -- npx -y @modelcontextprotocol/server-everything
# 连接测试 everything … 通过（2133ms，发现 13 个工具: echo, get-env, …）
# 已写入 ~/.dsh/profiles/web/cordis.patch.yml（id: mcp-everything）

dshx mcp import --yes
# discovers every MCP server in ~/.claude.json, ./.mcp.json and
# ~/.codex/config.toml, connection-tests each one, writes the ones that work
```

## Why

dsh's MCP client is solid (stdio + streamable-http, auto-reconnect, hot reload) — but the only way to configure it is hand-editing `cordis.patch.yml`. In our timed test, an experienced agent needed **6 min 24 s** to add one server by hand (finding the file, learning the patch-layer semantics, dodging the `[]`-placeholder YAML trap). Claude Code does the same job in one command. dshx closes that gap:

###  · hand-editing · dshx
- Add one server · **hand-editing**: ~6 min, YAML traps · **dshx**: one command
- Broken server · **hand-editing**: discovered at boot, silently mounts zero tools · **dshx**: **refused before writing** (dry-run handshake + `tools/list`)
- Secrets · **hand-editing**: pasted into YAML · **dshx**: `$VAR` → `!!js process.env.VAR` references
- Migrating from Claude Code / Codex · **hand-editing**: re-type everything · **dshx**: `dshx mcp import --yes`, or one click

One real import run on a machine with 12 servers across Claude Code and Codex configs: **10 migrated, 2 correctly rejected** (one endpoint returning 403, one server crashing on startup) — before either could pollute the config. Note that `npx` is what downloads and runs the package; dshx checks that the result speaks MCP, and writes only when it does.

## Install

```sh
npm install -g @why913/dshx        # CLI
```

Optional — mount it as a dsh plugin too, so the agent gets `mcp_add` / `mcp_list` / `mcp_remove` / `mcp_test` / `mcp_import` as native tools, plus the `/mcp` command and its card:

```sh
dsh plugin --profile web add @why913/dshx
```

Recommended — install the skill so the agent reaches for dshx on its own:

```sh
dshx skill add ./skills/dshx       # records the source, so `skill update` works later
```

dsh hot-watches the skills directory; no restart needed. In our test, the agent picked the skill up live, called `mcp_list` / `mcp_test` / `mcp_import` itself, and finished the whole task in 16 seconds.

## Commands

```text
dshx mcp add <name> -- <command> [args...]     add a local stdio server
dshx mcp add --transport http <name> <url>     add a remote streamable-http server
dshx mcp list                                  list managed servers
dshx mcp rm <name>                             remove a server
dshx mcp test <name>                           dry-run handshake + tool listing
dshx mcp import [--yes]                        migrate servers from Claude Code / Codex

dshx skill list                                list skills with validity checks
dshx skill add <owner/repo[/subdir] | path>    install a SKILL.md package (source + commit recorded)
dshx skill rm <name>                           remove a dshx-installed skill
dshx skill update <name>                       re-fetch from the recorded source
dshx skill import [--yes]                      migrate skills from ~/.claude/skills

dshx memory import [--yes]                     migrate ~/.claude/CLAUDE.md + ~/.codex/AGENTS.md
                                               into $DSH_HOME/AGENTS.md (idempotent marker blocks)
```

Notes: the skills directory is hot-watched by dsh, so `skill add`/`import` take effect immediately. Project-level CLAUDE.md needs no migration — dsh reads it natively. Imports preview by default and require `--yes` to write; a `$VAR` value becomes a reference, but a source config holding a literal token migrates that literal.

Shared flags:

### Flag · Meaning
- **Flag**: `--profile <name>` · **Meaning**: target profile (default `web`)
- **Flag**: `--global` · **Meaning**: write to `$DSH_HOME/cordis.patch.yml` (all profiles)
- **Flag**: `--env KEY=$VAR` · **Meaning**: env var for stdio servers; `$VAR` form is stored as a `!!js process.env.VAR` reference — no secret lands in the file
- **Flag**: `--header 'K: V'` · **Meaning**: header for http servers (values support `$VAR` too)
- **Flag**: `--timeout <ms>` · **Meaning**: connection-test timeout (default 30000)
- **Flag**: `--no-test` · **Meaning**: skip the dry-run connection test
- **Flag**: `--force` · **Meaning**: overwrite an existing server of the same name
- **Flag**: `--agents` · **Meaning**: install skills into `~/.agents/skills` instead

## Design guarantees

- **Dry-run before write.** `add` and `import` perform a real MCP handshake plus `tools/list`; an unreachable server is refused, not written. Same on every path — CLI, agent tool, card button.
- **Idempotent.** Re-adding an existing `serverName` fails loudly (`--force` to replace). `rm` only ever touches rows dshx manages.
- **Comment-preserving YAML edits.** Your `cordis.patch.yml` comments survive every edit; removing the last server restores the pristine `[]` placeholder.
- **No secrets in files.** `$VAR`-form env/header values are written as `!!js process.env.VAR` references, dsh's own idiom.
- **Never restarts anything.** Changes apply on the next dsh reload; dshx tells you instead of killing your sessions.
- **Skills checked before install.** A missing `name`/`description`, a non-kebab-case name, or the old `disableModelInvocation` camelCase key is refused — better than failing silently inside dsh.

## As a dsh plugin

Mounted via `dsh plugin --profile web add @why913/dshx`, the agent gets five native tools (`mcp_list`, `mcp_add`, `mcp_remove`, `mcp_test`, `mcp_import`) with the same guarantees — so "connect me to the GitHub MCP server" is something the agent can just do, test included. Configure the target profile on the plugin row:

```yaml
- id: dshx
  name: '@why913/dshx'
  config:
    profile: web
```

## In dsh Web

The same plugin adds `/mcp`, whose result renders as an interactive card:

```text
/mcp

  MCP 服务器 · 9/10 连通                                    [全部重测]
   ✓ codex           2 tools · 322ms                           [重测]
   ✓ playwright     24 tools · 7942ms                           [重测]
   ✗ node_repl      连接失败 · 60ms                             [重测]
       MCP error -32000: Connection closed

/mcp import

  可迁移 2 个 · 已管理 10 个                                [全部迁移]
   + openai-docs   claude-user · streamable-http · https://…     [迁移]
   + obsidian      claude-user · stdio · node …\main.js          [迁移]
   = codex         已管理
```

### Form · What it does
- **Form**: `/mcp` · **What it does**: check every configured server, one row each
- **Form**: `/mcp <server>` · **What it does**: recheck one server and list its tool names
- **Form**: `/mcp import` · **What it does**: list what is importable, already filtered against what dshx manages
- **Form**: `/mcp import <server>` / `/mcp import all` · **What it does**: migrate, connection-tested first
- **Form**: `/mcp help` · **What it does**: the forms above

Buttons replay the command, so a recheck or an import lands as a fresh card — the command log is append-only. Without the client half installed, the same command still renders as plain text.

## Limitations

- **Slash commands are Web-only.** The shipped `headless` CLI forwards its whole positional input to the model, so `dsh --profile headless "/mcp"` reaches the model, not the command registry. In a terminal, use `dshx mcp …`.
- **dsh's live connection state is not exposed to third-party plugins**, so `/mcp` opens its own diagnostic connection and reports that — it cannot show dsh's runtime connection or reconnect state.
- **No OAuth-authenticated MCP servers** until dsh exposes an API for it.
- **Config edits need a dsh reload**; dshx never restarts anything for you.
- **Editing one field** of an existing server means re-adding it with `--force`.

## Roadmap

- `/dshx migrate`: skills and global memory alongside MCP servers in one card
- Skill/memory management as model-facing plugin tools (`skill_add`, `memory_import`, …)
- OAuth-authenticated MCP servers (see [dsh-mcp-manager](https://github.com/hyqhyq3/dsh-mcp-manager) for a Web-UI approach)

## Compatibility

DeepSeek Harness is in developer preview and its internals change fast. dshx only touches documented surfaces (patch files, the `@deepseek-ai/dsh-mcp-client` config schema, `ctx.commands`, and the `conversation.chat.commandview` slot) and is tested against `@deepseek-ai/dsh` 0.1.0-rc.6. `@deepseek-ai/dsh-tools` is a peer dependency, supplied by the host. Node ≥ 22.19.

An unofficial community project, not affiliated with DeepSeek.