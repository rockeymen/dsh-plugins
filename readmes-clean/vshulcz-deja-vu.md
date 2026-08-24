![deja-vu](assets/logo.svg)


Memory for coding agents, starting with the history you already have.

Your agent is about to re-debug something you fixed in March. deja indexes the
sessions Claude Code, Codex, Cursor and every other agent on this machine already wrote to
disk, and hands the right one back when it is needed.

![The same question put to the same agent twice: without memory it has no record of it, with deja it answers with the decision from eight months earlier](assets/demo.gif)

<sub>Nobody searched anything — the agent called deja itself. Every line is quoted from two real sessions.</sub>

Every memory tool starts empty and records forward. deja starts full.

85.3% hit@1 on LongMemEval-S &middot; 69.6% on LoCoMo &middot; sub-millisecond lookups over 5 GB of history
<sub>Both harnesses ship in this repo and run on the public datasets in minutes &middot;

[Docs](https://vshulcz.github.io/deja-vu/) &middot; [Benchmarks](https://vshulcz.github.io/deja-vu/guide/benchmarks.html) &middot; [How it compares](https://vshulcz.github.io/deja-vu/guide/compare.html)

## Install

```sh
curl -fsSL https://raw.githubusercontent.com/vshulcz/deja-vu/main/install.sh | sh
deja install --auto
```

![What deja prints after the first index: the mark, the agents it found, and a query taken from your own history](assets/banner.png)

Ten seconds to install, about ten to index, and it is useful. The second command wires MCP
recall into every agent it finds, turns on session-start recall where the agent supports
it, and builds the first index so the next session does not pay for it.

Start a new agent session and ask it something you worked on months ago:

> have we dealt with jwt refresh rotation before? check your memory

It does not have to be asked, either — with auto-recall the agent already knows what you
solved in that project when the session opens.

Other ways to install, and what to do if you want less than all of it

`brew install vshulcz/tap/deja-vu`, `go install github.com/vshulcz/deja-vu/cmd/deja@latest`,
or `npx @vshulcz/deja-vu "query"` to try it without installing anything. Desktop apps that
take MCP servers as bundles can open the `.mcpb` from the
[latest release](https://github.com/vshulcz/deja-vu/releases/latest); it carries the binary.

Claude Code, Codex, Cursor, Qwen, OpenClaw and Copilot can take the same plugin bundle from
their own marketplaces instead:

```sh
claude plugin marketplace add vshulcz/deja-vu && claude plugin install deja-vu@deja-vu
```

On Windows the install script exits with `unsupported OS` — it is a shell script. Take
`deja-vu_<version>_windows_amd64.zip` from the
[latest release](https://github.com/vshulcz/deja-vu/releases/latest) and put `deja.exe` on
your `PATH`, e.g. in `%USERPROFILE%\.local\bin`.

The binary alone is a complete install for searching: index, search, `show`, `ctx`, `blame`,
`--json` and redaction need nothing else. `deja install` is what wires MCP into your agents
and turns on session-start recall — worth having, and optional. On a binary-only setup
`deja doctor` reports every MCP target as `not-wired`, which is that setup working as
intended. `deja warmup` also leaves a skill at `~/.agents/skills/deja-search/SKILL.md`
that teaches an agent the CLI contract — `deja search --json`, `ctx`, `blame`, how to read
`tier` and `total` — so it knows history is searchable without MCP. The copy in the repo is
[`skills/deja-search/SKILL.md`](skills/deja-search/SKILL.md).

`deja install --all` is `--auto` without the session-start recall: agents answer from memory
when they decide to call it, rather than starting each session with it. The
[agent setup guide](https://vshulcz.github.io/deja-vu/guide/agents.html) covers what each
harness supports, aider's read-only context file, and the Windows `cmd /c deja mcp` wrapper.

What gets written into each agent's own guidance file

Install also writes user-level guidance for the harnesses it detects: Claude Code, Codex, opencode, Gemini CLI, Antigravity, Qwen, Kimi Code, pi, Copilot, Cursor, Goose, OpenClaw, Hermes, Roo Code, omp, DeepSeek Harness and Zed each get it in their own guidance file (or under the configured `XDG_CONFIG_HOME`). Re-run rewrites deja's skill or marked block without changing surrounding user content. Use `deja install --all --no-guidance` to opt out; Grok gets `~/.grok/GROK.md`, which it reads only when a project has no `.grok/GROK.md` of its own. Cursor has no user-level instructions file, so it gets a skill at `~/.cursor/skills/` instead, read only when something looks relevant rather than every session.

## What you get

**Solve it in Codex. Claude remembers.** Twenty coding agents write every conversation
to local files, and deja turns those files into one memory layer all of them read.

###  ·
- **Retroactive search** · `deja "connection pool exhausted"` over gigabytes, including everything from before you installed deja. Natural-language questions fall back to a relevance tier. Time is a hint, not a filter.
- **Cross-agent recall** · The MCP `recall` tool answers *"we fixed this three weeks ago"* in whichever agent asks, whoever solved it originally.
- **It survives compaction** · Measured over 43 compactions: the summary keeps 77% of the decisions and 0.2% of the commands you ran. deja hands back the other 99.8%.
- **Recall at the point of action** · Before an agent edits a file or runs a command, deja names that file's prior decision or that command's working invocation, from a `PreToolUse` hook. When a command fails, a `PostToolUse` hook answers with what followed that same error here before — the pair an agent never thinks to ask for.
- **It indexes the work, not just the talk** · The files each turn opened, the commands that ran with their exit status, and the exact spans an edit replaced. That is the part every summary throws away.

Four more: rejected decisions, staleness, sync and handoff, redaction

###  ·
- **It knows what held** · `deja promote  --state rejected --note "why"` marks a decision you reverted. Every later hit for that session shows it was tried and rejected, with the reason. Nothing is deleted, and `--state accepted` takes the mark back.
- **It says when the ground moved** · A hit reports *4 files this session touched have changed since*, and says nothing when it cannot tell. It never claims anything is unchanged.
- **Sync and handoff** · `deja sync ssh laptop` moves memory between machines, append-only, no cloud in the middle. `deja handoff --to codex` packages the live context so you can continue in another agent.
- **Redaction** · Keys, tokens, JWTs and private key blocks are stripped at index time, so the cache is safe to keep.

### Your own work, wrapped

`deja stats --card` draws it in the terminal; give it a filename and it writes an
SVG for a profile README.

![deja stats card: a year of agent sessions as a heatmap, the agents they came from, and the longest one](docs/assets/stats-card-demo.svg)

The full feature reference lives in the [docs](https://vshulcz.github.io/deja-vu/).

## Privacy

Indexing and search are local. The network is used only by `deja update`, `deja sync ssh`,
and the version check in `deja doctor`.

Credentials are redacted at index time: AWS keys, `api_key=` and `token=` assignments,
bearer tokens and raw JWTs, PEM private key blocks, provider tokens, `scheme://user:pass@host`
URLs, and high-entropy values for shapes no pattern knows. The value becomes
`[redacted:<kind>]` and the surrounding text stays searchable. `deja share` and
`deja sync export` re-apply redaction on the way out.

`deja forget` removes sessions from a rebuilt index and writes tombstones, so a later
`deja index` cannot restore them from the source history. `--unforget` lifts a tombstone.
Project exclusions are one pattern per line in `~/.config/deja/exclude`.

The [security model](docs/SECURITY-MODEL.md) documents data flows, redaction limits, trust
assumptions and release verification.

## CLI

```text
$ deja "jwt refresh token"
[claude] api        · Jul 8 · 8f31c0a9 — 2 matches
  login started failing after refresh token rotation; jwt kid mismatch in tests
  fixed by reloading jwks cache after rotateKey and adding a clock-skew test
[codex]  web        · Jul 1 · b77d91e2 — 1 match
  refresh token cookie needed SameSite=Lax in local callback flow
```

**Ask your history**

### Command · What it does
- **Command**: `deja <query>` · **What it does**: Search every history. Multi-word is AND and quoted phrases require contiguous text; a query with no exact match then tries word forms and close spellings, which is where a substring reaches its word (`code` finds `opencode`).
- **Command**: `deja` · **What it does**: With an index and a terminal: today's sessions, recalls served, a question you asked in more than one session, and a wall your agents keep hitting.
- **Command**: `deja blame ` · **What it does**: Which sessions discussed a file, what was decided, and why.
- **Command**: `deja files <topic>` · **What it does**: The other direction: which files the work on a subject actually touched.
- **Command**: `deja how <tool>` · **What it does**: How this machine actually runs a thing, with the real flags, from what agents ran before.
- **Command**: `deja fix <error>` · **What it does**: What this machine ran after that same error before, when the error did not come back.
- **Command**: `deja friction` · **What it does**: Errors that hit three or more separate sessions, with the harnesses named.

Using what it finds, and moving it between machines

**Use what it finds**

### Command · What it does
- **Command**: `deja ctx <query>` · **What it does**: Markdown digest of the best match, ready to pipe into a prompt.
- **Command**: `deja resume ` · **What it does**: Reopen a found session in its native harness.
- **Command**: `deja restore ` · **What it does**: Hand back a span an agent replaced, from the `old_string` its edit recorded. Never writes over the original.
- **Command**: `deja promote ` · **What it does**: Distill a session into a curated note with provenance, tags and a lifecycle state. Notes outrank raw transcripts.
- **Command**: `deja share ` · **What it does**: A sanitized session digest for a colleague, with secrets already scrubbed.

**Move it and check it**

### Command · What it does
- **Command**: `deja sync export/import/ssh` · **What it does**: Move memory between machines. Watermarked, append-only, idempotent.
- **Command**: `deja view` · **What it does**: Your whole memory as one local HTML file. No server, nothing leaves the machine.
- **Command**: `deja stats` · **What it does**: Your agent work, wrapped. `--card` draws it in the terminal, `--card <file>.svg` writes one for a profile, `--html` a browsable timeline.
- **Command**: `deja doctor [--deep]` · **What it does**: Self-diagnosis, and with `--deep`, proof of the index against the sources.
- **Command**: `deja mcp` · **What it does**: The stdio MCP server, which is what `deja install` wires in.

Full reference: [commands](https://vshulcz.github.io/deja-vu/guide/commands.html) and
[JSON output](docs/json-output.md).

### MCP tools

The server exposes `recall`, `recall_context`, `blame`, `fix`, `how` and `remember`.
`deja install` wires them in, so this is only needed to configure an agent by hand.

Arguments and return shapes

### Tool · Arguments · Returns
- **Tool**: `recall` · **Arguments**: `query`, `harness?`, `limit?`, `offset?` · **Returns**: Dense matching snippets, capped at 4KB.
- **Tool**: `recall_context` · **Arguments**: `query`, `harness?` · **Returns**: Markdown digest of the best-matching session.
- **Tool**: `blame` · **Arguments**: `path`, `harness?`, `project?`, `since?`, `limit?`, `all?` · **Returns**: Sessions that discussed a file.
- **Tool**: `fix` · **Arguments**: `error`, `project?`, `limit?` · **Returns**: What this machine ran after that same error before.
- **Tool**: `how` · **Arguments**: `what`, `project?`, `limit?` · **Returns**: The real invocation, from what agents ran here.
- **Tool**: `remember` · **Arguments**: `text`, `project?`, `tags?` · **Returns**: Stores a durable decision for later recall.

## Supported harnesses

Claude Code &middot; Cline &middot; Codex CLI &middot; opencode &middot; aider &middot; Gemini CLI &middot; Cursor &middot; Antigravity &middot; Grok Build &middot; Hermes &middot; Goose &middot; Qwen Code &middot; Kimi Code &middot; pi &middot; omp (Oh My Pi) &middot; OpenClaw &middot; Copilot CLI &middot; Roo Code &middot; DeepSeek Harness &middot; Zed.

What each one supports

### Harness · MCP recall · Auto-recall · Skill · Command · Resume · Handoff · Needs
- **Harness**: Claude Code · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: —
- **Harness**: Cline · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: —
- **Harness**: Codex CLI · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: —
- **Harness**: opencode · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: sqlite3
- **Harness**: aider · **MCP recall**: ⚠ · **Auto-recall**: ✅ · **Skill**: ✕ · **Command**: ⚠ · **Resume**: ✕ · **Handoff**: ✅ · **Needs**: deja aider
- **Harness**: Gemini CLI · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: —
- **Harness**: Cursor · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: sqlite3 (IDE chats)
- **Harness**: Antigravity · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: —
- **Harness**: Grok Build · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ? · **Handoff**: ✅ · **Needs**: sqlite3 (grok-dev store)
- **Harness**: Hermes · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: paste · **Needs**: sqlite3
- **Harness**: Goose · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: deja goose
- **Harness**: Qwen Code · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: —
- **Harness**: Kimi Code · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: —
- **Harness**: pi · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: —
- **Harness**: omp (Oh My Pi) · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: —
- **Harness**: OpenClaw · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: paste · **Needs**: —
- **Harness**: Copilot CLI · **MCP recall**: ✅ · **Auto-recall**: ✕ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✅ · **Handoff**: ✅ · **Needs**: —
- **Harness**: Roo Code · **MCP recall**: ✅ · **Auto-recall**: ⚠ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✕ · **Handoff**: paste · **Needs**: —
- **Harness**: DeepSeek Harness · **MCP recall**: ✅ · **Auto-recall**: ✅ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✕ · **Handoff**: paste · **Needs**: zstd
- **Harness**: Zed · **MCP recall**: ✅ · **Auto-recall**: ✕ · **Skill**: ✅ · **Command**: ✅ · **Resume**: ✕ · **Handoff**: paste · **Needs**: sqlite3 + zstd

✅ works &middot; — possible, not built yet &middot; ✕ the harness has no such mechanism &middot; ⚠ blocked by an upstream bug &middot; ? not investigated

Custom store locations go through `DEJA_*_ROOT` variables, and each agent's own relocation
variable is honored too. The
[session format registry](https://vshulcz.github.io/deja-vu/registry/README.html) documents
the observed paths, record schemas and role mapping per harness, with synthetic fixtures
keeping those descriptions checked against the parsers.

### Harnesses with a package of their own

`deja install --auto` wires all five of these like every other harness, and
that stays the shortest path. They also have a package in their own ecosystem,
for people who install extensions there rather than from a CLI:

### Harness · Package · Install
- **Harness**: opencode · **Package**: npm `opencode-deja` · **Install**: `opencode plugin opencode-deja`
- **Harness**: DeepSeek Harness · **Package**: npm `dsh-deja` · **Install**: `dsh plugin add dsh-deja`
- **Harness**: Zed · **Package**: `deja-context-server` · **Install**: Zed → Extensions → deja
- **Harness**: Kimi Code · **Package**: plugin `deja` · **Install**: `/plugins install https://github.com/vshulcz/deja-vu`
- **Harness**: Codex CLI · **Package**: plugin `deja-vu` · **Install**: `codex plugin marketplace add https://github.com/vshulcz/deja-vu` then `codex plugin add deja-vu@deja-vu`
- **Harness**: Grok Build · **Package**: plugin `deja` · **Install**: `grok plugin marketplace add xai-org/plugin-marketplace` then `grok plugin install deja`

Either path is enough on its own, and having both is not a problem: the
opencode, dsh, Kimi, Grok and Codex packages read what `deja install` wrote and
contribute only what is missing, and in Zed both halves use one server id, so
there is nothing to have twice whichever order you install in.

Each uses the deja you already have; the copy it bundles is only the fallback.

## Semantic recall (optional)

Point `deja embed` at a local Ollama, LM Studio or OpenAI-compatible endpoint with
`DEJA_EMBED_URL` and rephrased queries still hit. Without a reachable runtime, lexical
search and MCP recall continue unchanged.

Where the vectors live and what they cost

The sidecar sits beside the index as `.vectors.bin`, not inside `index.db`. Float32 ve