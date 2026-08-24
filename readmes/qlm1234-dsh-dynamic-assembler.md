# dsh-plugin-dynamic-assembler

**Natural-language driven, security-gated dynamic assembly for [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness).**

Tell your dsh agent what you want to *build* in plain language — it discovers the plugins it needs at **runtime** (official-first, third-party optional), generates an assembly plan, asks for your confirmation, then loads them through the Cordis runtime. Any **unofficial plugin passes a built-in static security audit before it is ever loaded**.

> For self-evolving agents, security gates are not a feature — they are a prerequisite.

> 📦 **Published on npm** — `npm i dsh-plugin-dynamic-assembler` (v0.3.5)

---

## Why

dsh is built on "everything is a plugin". The natural next step is **self-assembly**: an agent that can compose its own toolchain from what's installed — which is exactly the "self-evolving agent harness" direction DeepSeek's [spatiotemporal composability paper](https://github.com/cordiverse/paper) calls out as the next validation target.

This plugin makes that practical **and safe**:

- **Runtime discovery** — available plugins are read from `ctx.registry` at runtime. No hardcoded plugin lists to maintain.
- **Official-first** — `@deepseek-ai/*` plugins are preferred for any capability; third-party plugins are only considered when no official plugin matches.
- **User consent, not silence** — plans that involve third-party plugins surface them explicitly and require your `allow_unofficial` confirmation (policy configurable: `ask` / `allow` / `deny`).
- **Audit before load** — every unofficial plugin is statically scanned (dangerous patterns + metadata) and scored 0-100. `red` (<60) plugins are rejected by default.

## Features

| | |
|---|---|
| 🧭 Runtime discovery | `ctx.registry` traversal — see everything loaded, nothing hardcoded |
| 🥇 Official-first policy | Prefer `@deepseek-ai/*`; third-party only as fallback, always surfaced |
| 🔐 Third-party gate | `unofficialPolicy: ask` (default) / `allow` / `deny` |
| 🛡️ Built-in security audit | `assemble_inspect` — pattern scan + metadata check → score → green / yellow / red |
| ⚠️ Sensitive-op confirmation | Network / fs / shell / subagent / MCP / code / credentials require explicit confirm |
| 🗑️ Cascade unload | Everything dynamically loaded is disposed when the plugin unloads (Cordis time-composability) |
| 🧩 8 tools | `assemble_inspect` · `assemble_discover` · `assemble_plan` · `assemble_execute` · `assemble_unload` · `assemble_freeze` · `assemble_auto` · `assemble_compare` (v0.3.3 same-class compare; v0.3.4 fixed Star/feature/audit-column render; v0.3.5 fixed audit-column pipeline root cause; v0.3.6 added `assemble_inspect` `github_repo` release audit; v0.3.8 wired release audit into compare table + placeholder detection) |

## Install

```bash
# install from npm (recommended); dsh auto-discovers it, no local path needed:
npm i dsh-plugin-dynamic-assembler
# or, managed by dsh profile:
pnpm dsh plugin --profile web add dsh-plugin-dynamic-assembler
# restart the web service afterwards
pnpm dsh web
```

### Config (optional)

Add to your profile's `cordis.patch.yml` (new entries must be wrapped in `- insert:`):

```yaml
- insert:
    - id: dynamic-assembler
      name: dsh-plugin-dynamic-assembler
      config:
        denyList: []                  # capability name substrings never assembled
        unofficialPolicy: ask         # ask | allow | deny
        pluginSources: []             # third-party plugins to consider (npm name or local dir)
```

`pluginSources` is how you tell the assembler about **not-yet-loaded** third-party plugins:

```yaml
      config:
        pluginSources:
          - my-dsh-plugin            # npm package name
          - /path/to/local-plugin    # local directory
```

Already-loaded plugins (official or third-party) are discovered automatically — no config needed.

## Tools

| Tool | What it does | Key parameters |
|------|--------------|----------------|
| `assemble_inspect` | Audit a plugin package (official or not): pattern scan + metadata → score & grade. **v0.3.6** adds `github_repo` — for GitHub-Releases-only community plugins (not on npm), pass `owner/repo` to run a release-artifact audit instead of a dead-red "unresolvable". **v0.3.8** wires this release audit into the `assemble_compare` table's audit column + placeholder-package detection | `plugin`, `github_repo?` |
| `assemble_plan` | Analyze a natural-language requirement, discover matching capabilities (official-first), produce an assembly plan (loads nothing) | `requirement` |
| `assemble_execute` | Load and start the planned plugins via Cordis. Requires confirmation; unofficial plugins require `allow_unofficial`; `red` audits require `force` | `names`, `confirm`, `confirm_sensitive`, `allow_unofficial`, `force?`, `configs?` |
| `assemble_unload` | Dispose everything this plugin dynamically loaded (safety rollback) | — |

### Example conversation

> User: *"I need a robot that can search the web and turn results into a Markdown document."*

1. Model calls `assemble_plan({ requirement: "search the web and write a Markdown document" })`
   → runtime discovers loaded plugins, matches capabilities **official-first**, returns plan + recommended order.
2. User confirms; model calls
   `assemble_execute({ names: ["tool-web","web-search-deepseek"], confirm: true, confirm_sensitive: true, allow_unofficial: false })`
   → loaded plugins are activated; unloaded official plugins are dynamically imported by convention name `@deepseek-ai/dsh-<name>`.
3. Rollback anytime: `assemble_unload()`.

## Security model

`assemble_inspect` performs a **static audit** with two layers:

1. **Metadata** — npm scope (official vs third-party), license, repository, `install`/`postinstall` scripts (high risk), peer dependency completeness.
2. **Source** — the entry file (plus adjacent source files, size-capped) is scanned for dangerous patterns:

| Severity | Patterns |
|----------|----------|
| 🔴 high | `eval` / `new Function`, `child_process`/exec/spawn, install scripts, hardcoded secrets |
| 🟡 medium | fs write/delete, network requests, dynamic import, base64 decode, char obfuscation |
| 🔵 info | `process.env` access, pre-release version, missing license/repo, non-official scope |

**Scoring**: start at 100, subtract per finding → `green ≥ 80` / `yellow ≥ 60` / `red < 60`.

- `green` — loadable.
- `yellow` — loadable with visibility (still requires `allow_unofficial` for third-party).
- `red` — **rejected by default**; only a deliberate `force: true` (high risk) can override.

> ⚠️ **Boundary — read this.** A static audit is a **risk signal, not a security guarantee**. Plugins are JS modules: once `ctx.plugin()` loads one, it has full Node process privileges, and malicious code can trivially evade regex scanning. Only install plugins from sources you trust, and stay alert with third-party plugins. Isolated sandbox execution is planned as a v2 direction.

## Extending the capability dictionary

The intent-to-capability mapping lives in `CAPABILITY_RULES` (`src/dynamic-assembler.ts`). Each rule maps natural-language keywords → candidate plugin-name substrings:

```ts
{ keywords: ['搜索', 'search', '联网', 'fetch', '网页', '抓取'],
  label: '联网搜索/抓取',
  match: ['tool-web', 'web-search', 'web-fetch-http', 'web'],
  dependsOn: ['web'],
  sensitive: true }
```

- `match` entries are plugin-name substrings matched against runtime-discovered plugins (official-first).
- Unmatched, unloaded official plugins are dynamically imported via the convention name `@deepseek-ai/dsh-<name>`.
- `sensitive: true` requires explicit confirmation before loading.
- Open a PR to add rules — the dictionary is a heuristic, never a hardcoded list.

## Development

```bash
npm install
npm test        # node --test (ESM strip-types) — audit engine + official-first logic + regressions
```

- `src/inspect.ts` — pure audit engine (no cordis dependency, fully unit-testable)
- `src/dynamic-assembler.ts` — plugin entry, 4 tools, official-first planning
- `test/` — node:test suites (cordis/dsh-tools stubbed; they only exist inside the dsh monorepo)

## License

[MIT](./LICENSE) © 2026 Lishu (黎叔玩AI)
