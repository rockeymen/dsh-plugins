# 🛡️ dsh-permission-rules

**Claude Code-style declarative permission rules for DeepSeek Harness.**

*Rules decide what is known. A reviewer model decides what is not.*

## Compatibility

### Surface · Status
- **Surface**: Harness · **Status**: DeepSeek Harness `0.1.1-rc.2`
- **Surface**: Node · **Status**: `^22.19.0 ·  · >=24.0.0`
- **Surface**: Platforms · **Status**: All (host + web settings client)
- **Surface**: Model · **Status**: Any (deny/ask reasons surface through tool results)

## What you get

`dsh-permission-rules` puts an ordered **`allow` / `deny` / `ask`** rule list in front of every tool call on the `tools/pre-execute` waterfall — deterministic, instant, auditable, and written by you in plain YAML:

- **`deny`** blocks the call; the rule's `reason` becomes the model-visible error.
- **`ask`** rides the official approval seam (mount `dsh-auto-review` for a second-model answerer, or a human answers; with neither, the harness fails closed).
- **`allow`** (and no-match) strictly delegates via `next()` — downstream listeners are never short-circuited.

Every hit **and** every passthrough is audit-logged as a `permissionRules/decision` session event (log-only — nothing extra is injected into the model context).

- **Rich matching** — tool-name globs (including `mcp__*`), agent-identity selectors (`main` / `subagent` / `preset:*`), argument key/value globs **or** regexes (with `!pattern` negation and an `absent` key dimension), workspace-relative path globs at **any nesting depth**, and `when` host conditions (env vars, platform).
- **Hierarchical rule files** — optional `searchUp` merges every `.dsh/rules.yaml` from the session cwd to the filesystem root, nearest first.
- **Dry-run rollout** — `enforce: false` audits what the policy *would* do while passing every call through.
- **Hot reload** — Chokidar watch with debounce; a broken edit keeps the previous rules, never crashes.
- **Fail loud** — invalid YAML, unknown actions/fields, bad globs/regexes, backtracking-prone patterns, or more than `maxRules` rules fail the load.

## Rule syntax

```yaml
# /.dsh/rules.yaml
rules:
  - match: { tools: [bash, pwsh], params: { command: "git push*" }, paths: ["**/secrets/**"] }
    action: deny
    reason: "No pushes from protected paths"

  - match: { tools: [edit, write] }
    action: ask
    reason: "File writes need confirmation"
```

- **Match dimensions** — `tools` (globs, incl. `mcp__*`), `agents` (`main` / `subagent` / `preset:<name>`; unknown identity never matches — fail closed), `params` (key/value globs or regexes, `!pattern` negation, `absent` key dimension), `paths` (workspace-relative globs extracted at any nesting depth), `when` (`env` var globs/regexes + a closed `platform` list), and `network` (`domains` / `ips` / `ports` / `schemes` — globs, wildcards, CIDRs, port ranges).
- **Actions** — `allow` / `deny` / `ask`, evaluated in file order, first match wins.
- **Rule metadata** — `enabled: false` (visible but inert), `description`, `tags`; unknown fields fail the load.
- **Schema** — a JSON Schema ships at [docs/rules-format.schema.json](docs/rules-format.schema.json) (editor completion via `# yaml-language-server: $schema=...`); the full vocabulary and a 5-rule security baseline live in [docs/rules-format.en.md](docs/rules-format.en.md).

## Network policy

A Codex-style **process-level network policy**: shell subprocess traffic flows through a built-in local **HTTP/CONNECT proxy**, and every connection is decided by ordered network rules or by three modes mapped onto the official sandbox presets:

- **`deny-all`** — the read-only sandbox preset: block all outbound.
- **`whitelist`** — the workspace-write preset: allow listed targets, `unlisted: ask` (or `deny`) for the rest.
- **`allow-all`** — the danger-full-access preset: allow everything.
- **`auto`** (default) — follows the sandbox preset; on hosts without the sandbox-policy service it resolves to `autoFallback` (`allow-all`).

- **Matching** — `match.network` with `domains` / `ips` / `ports` / `schemes` (globs, wildcards, CIDRs, port ranges; numeric YAML ports are accepted). URL-candidate extraction on the `tools/pre-execute` hot path fires on web-tool arguments and URLs embedded in bash/pwsh command text; loopback targets can short-circuit rules per `loopback` policy.
- **Audit** — denied connections append `permissionRules/network` to the owning session (same adaptive `ignorable` gate), with block counters and recent interceptions in `/rules network` and the settings page.

## Quick start

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add "github:PerryLink/dsh-permission-rules#main"

# or from npm (published releases)
dsh plugin --profile web add dsh-permission-rules

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A4 'id: permission-rules'
```

## Install & uninstall

- **git channel** (latest `main`): `dsh plugin --profile web add "github:PerryLink/dsh-permission-rules#main"` — the `prepare` script builds with production dependencies only.
- **npm channel** (published releases): `dsh plugin --profile web add dsh-permission-rules`.
- **tarball channel**: `pnpm pack` in this repo, then `dsh plugin --profile web add ./dsh-permission-rules-<version>.tgz`.
- **uninstall**: `dsh plugin --profile web remove dsh-permission-rules`.

## Configuration

All tunables are Schemastery `Config` fields (changeable from cordis.yml). An id-targeted override replaces the whole row — restate every key you need.

### Key · Default · Meaning
- **Key**: `rulesFile` · **Default**: `.dsh/rules.yaml` · **Meaning**: Rule file location; relative = resolved against the calling session's cwd, absolute = global and validated at mount
- **Key**: `fallbackPath` · **Default**: *(none)* · **Meaning**: Rule file used when per-cwd discovery finds nothing; validated at mount
- **Key**: `badFilePolicy` · **Default**: `fail` · **Meaning**: Bad rule file: `fail` errors the pending tool call loudly; `ignore-with-warning` warns and continues empty
- **Key**: `maxRules` · **Default**: `256` · **Meaning**: Hard cap on rule count across the effective source chain
- **Key**: `maxCachedWorkspaces` · **Default**: `512` · **Meaning**: Hard cap on cached per-workspace rule loads (LRU eviction)
- **Key**: `patternMode` · **Default**: `glob` · **Meaning**: `params`/`paths`/`when.env` pattern flavor: `glob` or `regex` (tool names are always globs)
- **Key**: `watch` · **Default**: `true` · **Meaning**: Chokidar watch + reload on change
- **Key**: `watchStabilityThresholdMs` · **Default**: `200` · **Meaning**: Reload debounce window (ms)
- **Key**: `language` · **Default**: `en` · **Meaning**: `/rules` output language: `en`, `zh`, `es`, `pt`, `hi`
- **Key**: `caseInsensitivePaths` · **Default**: *(win32)* · **Meaning**: `paths` patterns and workspace-root comparison ignore ASCII case; `true` on Windows
- **Key**: `audit` · **Default**: `all` · **Meaning**: Audit granularity: `all` logs every hit AND passthrough; `hits` skips passthrough events
- **Key**: `searchUp` · **Default**: `false` · **Meaning**: Walk parent directories from the session cwd and merge every found rule file, nearest first
- **Key**: `maxGlobStars` · **Default**: `2` · **Meaning**: Hard cap on unbounded `*`/`**` quantifiers per glob pattern
- **Key**: `enforce` · **Default**: `true` · **Meaning**: `false` = dry-run mode: deny/ask hits are audit-logged with a `dryRun` marker and every call passes through
- **Key**: `allowUnmarkedAudit` · **Default**: `false` · **Meaning**: Pre-marker hosts drop the `ignorable` marker; the plugin disables session-log audit with a warning. Set `true` to opt back in
- **Key**: `network.enabled` · **Default**: `true` · **Meaning**: Master switch for the proxy, env injection, and web-tool mode defaults
- **Key**: `network.mode` · **Default**: `auto` · **Meaning**: Policy mode: `auto` follows the sandbox preset, or `deny-all` / `whitelist` / `allow-all`
- **Key**: `network.autoFallback` · **Default**: `allow-all` · **Meaning**: Mode used when `auto` has no sandbox-policy service
- **Key**: `network.unlisted` · **Default**: `ask` · **Meaning**: Whitelist-mode handling of targets no rule matched: `ask` or `deny`
- **Key**: `network.proxyBind` · **Default**: `127.0.0.1` · **Meaning**: Local proxy bind address (loopback only)
- **Key**: `network.proxyPort` · **Default**: `0` · **Meaning**: Local proxy port; `0` picks a free ephemeral port
- **Key**: `network.proxyMaxRecent` · **Default**: `100` · **Meaning**: Cap on recent-block records kept for the settings page
- **Key**: `network.loopback` · **Default**: `allow` · **Meaning**: Loopback targets: `allow` (Codex parity) or `policy`
- **Key**: `network.injectEnv` · **Default**: `true` · **Meaning**: Whether proxy environment variables are injected for subprocesses
- **Key**: `network.noProxy` · **Default**: `clear` · **Meaning**: Subprocess NO_PROXY handling: `clear` enforces the policy or `preserve`

## Tools & surfaces

### Surface · Kind · Notes
- **Surface**: `tools/pre-execute` · **Kind**: listener · **Notes**: First-match allow/deny/ask rules + network URL-candidate extraction
- **Surface**: `/rules` · **Kind**: command · **Notes**: `list` · `reload` · `decisions [n]` · `test <tool> <json>`
- **Surface**: `permissionRules/decision` · **Kind**: event · **Notes**: Log-only audit for every hit and passthrough
- **Surface**: `permissionRules/network` · **Kind**: event · **Notes**: Proxy-layer audit for blocked connections
- **Surface**: HTTP/CONNECT proxy · **Kind**: service · **Notes**: Built-in local proxy governing shell subprocess traffic
- **Surface**: settings page · **Kind**: client · **Notes**: Network-mode editor, rule editor, block counters, recent interceptions

```
/rules                        list the active rules, their source files, and any last-reload error
/rules list                   explicit alias for the bare listing
/rules reload                 re-read the rule-file chain for this workspace
/rules decisions [n]          show the last n permission decisions of this session (default 10)
/rules test <tool> <json>     dry-evaluate the rules against a hypothetical call
```

`/rules test` also accepts leading flags: `--cwd <dir>`, `--env KEY=VALUE` (repeatable), `--agent <selector>` (repeatable), and `--platform <name>`. In multi-file chains (e.g. `searchUp`), every listed rule line is attributed to its own source file.

## Permissions & data

- **Permissions**: declares `files:read`, `files:watch`, `files:write`, `session:append`, and `network:outbound` in its workshop manifest. `ask` decisions ride the official approval seam — nothing is re-implemented or bypassed.
- **Data**: rule files are read from disk; no rule data is written. No model calls, no reviewer subagents.
- **Session log**: `permissionRules/decision` is never injected into the model context and is appended with the envelope's `ignorable: true` marker so any harness build loads the log.

## Security boundaries

- **Policy, not a kernel.** `paths` candidates come only from a documented set of argument keys (at any nesting depth, depth-capped), and only workspace-relative paths match.
- **No reviewer here.** The plugin never spawns subagents or calls models — producing an `ask` decision is the end of its work.
- **No sandbox changes.** OS-level sandbox policy belongs to the sandbox seam, not this plugin.
- **Loud misconfiguration.** Unknown YAML fields, unknown actions, and bad patterns are rejected at load.
- **Backtracking bounds.** Glob patterns are capped at `maxGlobStars` unbounded star expansions; regex-mode patterns reject nested unbounded quantifiers and quantified overlapping literal alternations.

## Known limitations

- **Audit marker on pre-marker hosts.** `permissionRules/decision` is appended with `ignorable: true`; hosts whose `Session.append` predates the marker (the `0.1.0-rc.6` line) silently drop it, so the runtime disables session-log audit with a one-time warning. Set `allowUnmarkedAudit: true` to opt back in; repair already-written logs with `scripts/repair-session-logs.mjs`.
- **Path candidates are heuristic.** Only the documented argument keys feed path matching, and workspace-relative matching is ASCII-case-insensitive only when `caseInsensitivePaths` is on.
- **Globs are a conservative subset.** No brace expansion — write two patterns, or use regex mode.
- **The regex backtracking guard is structural, not exhaustive.** Prefer glob mode for untrusted files.

## Collaborating with dsh-auto-review

- `dsh-permission-rules` produces `ask`; `dsh-auto-review` answers on the `approval/request` waterfall with a read-only second-model verdict (or delegates to humans). Mount both for the full closed loop.
- Integration-tested: `permissionRules/decision` → `approval/asked` → `autoReview/verdict` → `approval/decided`, with the reviewer replaced by a scripted mock.
- The `never` approval policy and every fail-closed guarantee of the official harness stay untouched.

## Session log repair

Session logs written before the `ignorable` marker existed can be refused by newer harness builds (`SessionFormatUnsupportedError`). The shipped `scripts/repair-session-logs.mjs` rewrites only the targeted audit rows to carry `ignorable: true`, frame-preserving, with backups:

```sh
node scripts/repair-session-logs.mjs scan [--home DIR]      # report foreign rows, change nothing
node scripts/repair-session-logs.mjs repair [--home DIR] [--dry-run]
```

`--home` defaults to `$DSH_HOME/sessions` (or `~/.dsh/sessions`).

## Development

```sh
pnpm install            # node ^22.19 || >=24
pnpm run typecheck      # tsc, src + tests
pnpm run lint           # eslint, src + tests + scripts
pnpm test               # vitest: 236 tests, 20 files
pnpm run test:coverage  # coverage gate (90/80/90/90)
pnpm run build          # tsc declarations + tsdown bundles (lib/)
pnpm run pack:check     # build + pack (the published artifact)
node scripts/check-readme-sync.mjs   # five-language README sync gate (also in CI)
```

See [VERIFICATION.md](VERIFICATION.md) for the headless end-to-end verification record.

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `permission`, `policy`, `allow-deny-ask`, `approval`, `safety`, `network`, `network-policy`, `proxy`

## PerryLink DSH Plugin Family

This project is one of the [15 DeepSeek Harness plugins](https://github.com/PerryLink) maintained by [PerryLink](https://github.com/PerryLink). If this one helps you, the others likely will too:

### Plugin · One-liner
- **Plugin**: [dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel) · **One-liner**: Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors
- **Plugin**: [dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) · **One-liner**: Engineering-discipline guard: requirements grill, test gates, adversary review
- **Plugin**: [dsh-background-agents](https://github.com/PerryLink/dsh-background-agents) · **One-liner**: Durable background child agents with a Web UI sidebar, messaging and interrupt
- **Plugin**: [dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions) · **One-liner**: LSP diagnostics, formatting, completion, code actions and rename over language servers
- **Plugin**: [dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) · **One-liner**: Claude Code outputStyles-equivalent runtime style switching
- **Plugin**: [dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) · **One-liner**: Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore
- **Plugin**: **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** · **One-liner**: Claude Code-style declarative allow/deny/ask permission rules with audit
- **Plugin**: [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) · **One-liner**: Second-model auto-review on the approval chain, fail-closed by default
- **Plugin**: [dsh-memento](https://github.com/PerryLink/dsh-memento) · **One-liner**: Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool
- **Plugin**: [dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) · **One-liner**: Security-audit skill pack: secret scan, dependency and supply-chain review
- **Plugin**: [dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) · **One-liner**: Pin sessions in the Web sidebar with durable ordering
- **Plugin**: [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) · **One-liner**: Terminal-style input history for the web composer: arrows, Ctrl+R search
- **Plugin**: [dsh-github](https://github.com/PerryLink/dsh-github) · **One-liner**: GitHub PR/issues integration for DSH, every write gated by approval
- **Plugin**: [dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide) · **One-liner**: Plugin-development knowledge base as an on-demand agent skill
- **Plugin**: [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) · **One-liner**: Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH