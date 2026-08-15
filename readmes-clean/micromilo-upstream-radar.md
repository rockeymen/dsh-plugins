![Upstream Radar watches a dependency graph, highlights one affected path, and routes one signal to a DSH Agent.](docs/assets/upstream-radar-hero.jpg)
  

# Upstream Radar

Always-on vulnerability and breaking-change radar for DeepSeek Harness plugins.

A vulnerability feed stops at “package X is affected.” Upstream Radar keeps going: it identifies the exact installed dependency path, maintains one durable incident, and wakes a [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Agent with the project evidence needed for a useful investigation.

```text
OSV advisory or npm release
  -> exact installed plugin path
  -> new / updated / resolved incident
  -> project-specific DSH Agent analysis task
```

**No matching installed path means no Agent wake-up.** Version matching and compatibility facts are calculated by code; the model handles only repository-specific judgment.

## See one incident

If an advisory affects only one of two installed `parser` versions, Radar reports the path that actually matched:

```text
[HIGH][NEW] Dependency vulnerability
Project: Payments API (payments-api)
Plugin: plugin@1.0.0
Affected: parser@2.9.0
Advisory: GHSA-demo-2026-parser / CVE-2026-1234
Paths:
  plugin@1.0.0 -> logger@4.0.2 -> parser@2.9.0
Fixed versions: 3.0.0
Route: payments-platform via feishu:payments-security
```

That incident becomes a plugin-originated DSH notice. It is not copied into a generic chatbot prompt.

### Upstream signal · Radar proves deterministically · DSH Agent investigates
- **Upstream signal**: Vulnerability or malicious package · **Radar proves deterministically**: affected `name@version`, every installed path, fixed versions, incident state · **DSH Agent investigates**: whether project code reaches it, attacker input can reach it, and the least disruptive fix
- **Upstream signal**: Candidate npm release · **Radar proves deterministically**: version boundary and Node.js, peer, export, entrypoint, bundle, and dependency changes · **DSH Agent investigates**: which APIs or Cordis configuration would break and what migration is appropriate

## Install in DSH

Upstream Radar is an npm-published DSH bundle, so no install-time build permission is required:

```bash
dsh plugin --profile web add upstream-radar@latest
```

Point the bundle at an explicit project inventory, choose a durable state file, then boot the profile:

```bash
export UPSTREAM_RADAR_CONFIG=/absolute/path/radar-config.json
export UPSTREAM_RADAR_STATE=/absolute/path/radar-state.json
export UPSTREAM_RADAR_INTERVAL_SECONDS=1800

dsh --profile web --dump-config
dsh --profile web
```

Start from [the example inventory](examples/radar/config.json). If `UPSTREAM_RADAR_CONFIG` is not set, the bundle stays dormant and performs no polling.

Once running, Radar polls OSV and npm, persists incident state before delivery, and submits only changed incidents to the first live root DSH Agent.

## Run the proof

Boot a real DSH `headless` profile with the packed Upstream Radar bundle installed:

```bash
git clone https://github.com/MicroMilo/upstream-radar.git
cd upstream-radar
corepack enable
pnpm install --frozen-lockfile
pnpm run try:dsh
```

No DeepSeek API key is required. The paid model endpoint is replaced by a deterministic local DeepSeek-compatible stub; the Cordis loader, DSH Agent, Session, persistence stack, bundle installation, and plugin delivery are real.

The command fails unless DSH proves all four facts:

```json
{
  "bundleInstalled": true,
  "radarTaskReachedModel": true,
  "pluginSourcePreserved": true,
  "pendingTasksAfterDelivery": 0
}
```

This proof runs in CI on Node.js 22. See the executable [showcase contract](examples/dsh/README.md) and its checked-in [result](examples/dsh/reports/headless-smoke.json). Run `pnpm run try:dsh:live` to include a current OSV and npm poll before the DSH handoff.

## How the loop works

1. Read the project inventory and exact installed npm graph.
2. Query OSV with every installed `name@version` pair.
3. Watch npm releases for the installed plugin and DSH/Cordis packages.
4. Create or update one durable incident with the exact dependency path.
5. Persist a constrained analysis task before delivery.
6. Send a plugin-originated follow-up to the first live root DSH Agent.
7. Keep the task on disk when no Agent is available; cancel it when the incident resolves.

The handoff uses `ctx.agents.roots()[0].followup(...)` with:

```json
{
  "kind": "plugin",
  "plugin": "upstream-radar",
  "form": "notice"
}
```

It is a native DSH lifecycle integration—not a chat bridge or a remote-control bot.

## Why package-name alerts are not enough

Given this installed graph:

```text
plugin@1.0.0
├── framework@2.4.7
│   ├── parser@3.2.1
│   └── archive@1.8.0
└── logger@4.0.2
    └── parser@2.9.0
```

an advisory affecting `parser@2.9.0` matches only the `plugin -> logger -> parser` branch. The unaffected `parser@3.2.1` remains a distinct physical node instead of becoming a package-name false positive.

## Vulnerabilities are only half the upstream problem

Upstream Radar also watches candidate releases for compatibility boundaries that matter to DSH plugins:

- Node.js engine exclusions;
- incompatible `@deepseek-ai/dsh-*` or `@deepseek-ai/cordis` peer ranges;
- changed `main`, `exports`, or DSH bundle patch paths;
- removed dependencies;
- major and pre-1.0 breaking version boundaries;
- publisher-declared breaking changes in supplied release notes.

These are signals for project analysis, not automatic claims that an upgrade is broken.

## The model gets judgment, not control of the facts

Upstream Radar determines facts that a model must not guess:

```text
parser@2.9.0 is reported as affected
plugin -> logger -> parser is the installed path
the project runs Node.js 22
the candidate requires Node.js >=24
the installed DSH peer is outside the candidate range
```

The DSH Agent answers the repository-specific questions:

```text
is the vulnerable feature reachable here?
can attacker-controlled input reach it?
which API or Cordis configuration would the upgrade disturb?
what is the least disruptive project-specific action?
```

Advisories, release notes, links, package names, and repository strings remain untrusted data. The generated task requires read-only analysis, project evidence, explicit uncertainty, and a fixed [result schema](schemas/analysis-result.schema.json).

## What works today

- npm lockfile graphs with duplicate versions and bounded dependency paths;
- exact-version OSV vulnerability and malicious-package matching;
- npm release monitoring for plugins and DSH/Cordis packages;
- durable incident state with current-task replacement and resolution;
- native DSH bundle installation, startup polling, `agent/created` retry, and plugin-source attribution;
- compatibility signals for Node.js, peers, exports, entrypoints, bundle paths, dependencies, and version boundaries;
- network-free Radar and real DSH runtime showcases.

The bounded pre-install scanner remains available as a supporting collector:

```bash
upstream-radar scan /path/to/dsh-plugin
upstream-radar inspect npm:dsh-cloudflare-browser-run@0.1.1 --deep
```

## Current boundaries

- Project inventory is explicit JSON; active DSH profile discovery is not implemented yet.
- npm lock graphs are supported; pnpm and Yarn graph adapters are not implemented.
- OSV and npm `latest` are the live sources; GitHub release and migration-guide ingestion are deferred.
- Delivery currently targets the first live root Agent rather than a project-specific session.
- Agent conclusions stay in the DSH Session; Radar does not ingest them back into incident state yet.
- No Issue, branch, Pull Request, dependency override, or merge is created automatically.

Upstream Radar is alpha software built for the developer-preview DSH ecosystem. Event schemas and adapter boundaries can change.

## Project guide

- [Architecture](docs/architecture.md)
- [DSH headless showcase](examples/dsh/README.md)
- [Radar showcase walkthrough](docs/showcase.md)
- [Product vision（中文）](docs/vision.zh-CN.md)
- [Checks and evidence（中文）](docs/checks.zh-CN.md)
- [Threat model](docs/threat-model.md)
- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Release process](docs/releasing.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

If DSH plugins are part of your stack, star the repository to follow the upstream safety loop as it grows. Questions and design feedback are welcome in [GitHub Discussions](https://github.com/MicroMilo/upstream-radar/discussions).

<sub>Community project for DeepSeek Harness. Not an official DeepSeek product. Apache-2.0 licensed.</sub>