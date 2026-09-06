# dsh-stability-audit (plugin stability audit)

Scan installed DeepSeek Harness (dsh) plugins and get a **stability risk grade + fix suggestion** before they break your harness — static analysis, optional isolated install verification, and machine-readable output for any agent to surface problems and remedies fast.

> **Built from real incidents**: every grading rule comes from actual dsh ecosystem failures — barricade's hooks killing the whole tool chain, codegraph freezing the event loop at startup, trailmap's version conflict breaking the tool layer, dsh-tools single-instance corruption, doc-guard/secret-guard missing-inject boot crashes, 7 unbuilt plugins crashing on load, memento/taskboard undeclared deps (Cannot find package)... The rules are the troubleshooting manual, codified.

> Community plugins are often young projects. This plugin answers one question: **will installing/keeping this plugin hurt my dsh?** Each installed plugin gets a 🔴/🟡/🟢 grade, evidence, and a 🔧 fix suggestion, so you decide on facts, not vibes.

## Why

- One plugin can kill the **entire tool layer** (hook surface — barricade incident; dsh-tools single-instance — trailmap incident)
- Startup scans can **freeze the event loop** for minutes on big workspaces (codegraph incident)
- Bad plugin config makes dsh **silently half-activate** plugins (preflight failure)
- @deepseek-ai/* version conflicts can **kill the whole tool pipeline**
- **Every failure period pollutes active sessions** (dangling tool-calls) that need cleanup after recovery

These are the real failure modes this plugin statically detects — before you step on them.

## Install

```sh
# Option 1: npm (recommended — prebuilt, skips allowBuilds approval)
dsh plugin --profile web add dsh-stability-audit

# Option 2: GitHub source
dsh plugin --profile web add github:chunfenxiazhi-collab/dsh-stability-audit
```

After restarting dsh web, agents can call the `stability_audit` tool (just say "run the plugin stability audit"); or use the CLI:

```sh
git clone https://github.com/chunfenxiazhi-collab/dsh-stability-audit.git
cd dsh-stability-audit && npm test
node cli.mjs                    # scan the real web profile
node cli.mjs --dynamic          # also run isolated install verification (~2s/plugin)
node cli.mjs --json             # machine-readable output (for other agents)
node cli.mjs --remote owner/repo          # remote plugin static pre-audit (clone to temp dir, no install)
node cli.mjs --remote owner/repo --dynamic  # full remote pre-audit (clone + isolated install smoke)
node cli.mjs --remote owner/repo --json    # remote pre-audit JSON output
```

## Grading dimensions

### Signal · Grade · Case
- **Signal**: Tool hook / middleware registration (pre/post-execute) · **Grade**: red · **Case**: can intercept the whole tool chain (barricade)
- **Signal**: Top-level sync scan / indexing at startup · **Grade**: red · **Case**: blocks the event loop (codegraph)
- **Signal**: Load-time sync service access missing from inject · **Grade**: red · **Case**: boot crash (doc-guard/barricade incidents)
- **Signal**: main points to unbuilt source (TS/missing file) · **Grade**: red · **Case**: load-time crash (7 unbuilt plugins)
- **Signal**: Preflight report critical · **Grade**: red · **Case**: flagged by dsh at boot
- **Signal**: setInterval polling · **Grade**: yellow · **Case**: normal for update checks; watch frequency
- **Signal**: >=10 global event listeners · **Grade**: yellow · **Case**: every broadcast event gets slower
- **Signal**: No dsh.bundle manifest · **Grade**: yellow · **Case**: installed but never activated (research-plugins)
- **Signal**: >50 dependencies · **Grade**: yellow · **Case**: dependency-tree pollution risk
- **Signal**: Non-build install scripts (prepare etc.) · **Grade**: yellow · **Case**: npm lifecycle runs arbitrary code
- **Signal**: Deferred service access missing from inject · **Grade**: yellow · **Case**: may be undefined at runtime (cron-style)
- **Signal**: @deepseek-ai/* range excludes host synced pkg version · **Grade**: yellow · **Case**: pnpm hoists old build -> tools dead (trailmap)
- **Signal**: **Isolated install + boot smoke** · **Grade**: pass/fail · **Case**: temp DSH_HOME, dsh plugin add, headless boot, no loader errors
- **Signal**: Entry imports undeclared deps (missing-dep) · **Grade**: red · **Case**: Cannot find package after install (taskboard/memento)
- **Signal**: No main and no candidate entry (no-entry) · **Grade**: red · **Case**: loader fails importing by package name (verify)
- **Signal**: Data exfiltration (process.env via fetch/WebSocket) · **Grade**: red · **Case**: OpenClaw 341 malicious-skill top pattern
- **Signal**: Hardcoded remote endpoints (URL/WebSocket) · **Grade**: yellow · **Case**: for human review (normal API calls common)

Every hit carries a **🔧 fix suggestion** (executable command or manual action) that can be handed to the user or another agent.

**Batch testing**: `--remote` accepts multiple specs (comma- or space-separated) to pre-audit a batch of online plugins in one run (clone → static → isolated install smoke, host untouched). Verified sample: [docs/audit-report.md](./docs/audit-report.md) (18 plugins, post-verification verdicts).

## How it works

1. Collect plugins from ~/.dsh/profiles/<name>/package.json (node_modules + plugin-src)
2. Static scan: entry file + package.json signals (regex-based, zero dependencies, no AST)
3. Optional dynamic check (lib/dyncheck.js): temp DSH_HOME -> isolated dsh plugin add -> headless boot -> loader-error scan -> cleanup
4. Optional remote pre-audit (lib/remote.js): git shallow clone to temp dir -> static rules -> (optional) isolated install smoke -> cleanup
5. Render report: Markdown (human) or JSON (`--json`, schema `dsh-stability-audit/v1`, agent-readable)

**Principles**: read-only, never runs the audited plugin, zero side effects. Grades are suggestions for human confirmation, not verdicts.

## JSON output (for agents)

```sh
node cli.mjs --json
```

Per plugin: name / version / grade / source / dynamic / findings[], each finding carries `ruleId` / `severity` / `desc` / `evidence` / `fix` (remedy). Other agents can act on it directly.

## Known limitations (honest list)

- Static analysis cannot measure runtime behavior (hook throws, real stall duration) — red means "needs a look", not "definitely broken"
- Isolated boot uses a headless profile: plugins depending on web-only services (e.g. storageDomain) show ❌ in isolation but may be fine in web — treat as an environment-dependency hint
- Runtime probes (event-loop latency, hook timing) are on the v2 roadmap
- Fix suggestions are **hints, not auto-applied**: environments differ (junction/overrides fixes depend on the specific mechanism), agents should confirm before executing

### Isolated test vs real environment (what it can and cannot catch)

Isolated testing (temp DSH_HOME + headless smoke) answers: **"can this plugin install on its own and boot cleanly?"** — filtering out ~80% of the failure modes (unbuilt entry, missing inject, dependency conflicts, load crashes).

### Dimension · Isolated env · Real web profile · Impact
- **Dimension**: Services · **Isolated env**: headless boot · **Real web profile**: web services + all host services · **Impact**: plugins depending on webServer/webRuntime stay pending in isolation; real behavior not observable
- **Dimension**: Co-installed plugins · **Isolated env**: only the audited one · **Real web profile**: many plugins interacting · **Impact**: inter-plugin conflicts not caught (hooks stepping on each other, service overrides)
- **Dimension**: Config · **Isolated env**: empty · **Real web profile**: real config (API keys, models, paths) · **Impact**: config-dependent plugin paths untested
- **Dimension**: Credentials/network · **Isolated env**: no API key · **Real web profile**: model APIs available · **Impact**: LLM-dependent features only smoke, never execute
- **Dimension**: Data · **Isolated env**: empty storage · **Real web profile**: real sessions/libraries · **Impact**: data-migration plugins untested
- **Dimension**: Runtime duration · **Isolated env**: seconds of boot smoke · **Real web profile**: days of residency · **Impact**: setInterval leaks, memory growth not caught
- **Dimension**: Permissions/build · **Isolated env**: same machine, same permissions · **Real web profile**: same machine, same permissions · **Impact**: ✅ identical

**Suggested usage**: use isolated testing as bulk screening — exclude red/fail targets; for plugins you actually want, install manually and observe. Automatically testing plugins against the real environment is not recommended — plugins have real destructive power (see the dsh-troubleshooting incidents).

## Releases

- Release flow: see [RELEASE.md](./RELEASE.md) (GitHub + npm + Release, three channels in sync)
- npm: https://www.npmjs.com/package/dsh-stability-audit
- GitHub Releases (with tarball assets): https://github.com/chunfenxiazhi-collab/dsh-stability-audit/releases