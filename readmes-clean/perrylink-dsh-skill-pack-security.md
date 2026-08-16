# dsh-skill-pack-security

  Security-audit methodology for DeepSeek Harness — eight agent skills, zero runtime code.
  secret scanning · dependency audit · supply-chain review · prompt-injection review · audit orchestration · threat modeling · vuln intel · incident response

  [English](README.md) ·

## What is this?

A **pure skill pack** for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) — the "everything is a plugin" agent harness built on [Cordis](https://github.com/cordiverse/cordis). It ships eight security methodologies as `SKILL.md` bundles that the model discovers in its session catalog and loads on demand with the `skill` tool.

> Repository: https://github.com/PerryLink/dsh-skill-pack-security

**Zero runtime code.** No tools are registered, no services are registered, no session behavior changes. The only executable is the optional `provider/` plugin — a packaging demo — and the pack works identically without it.

Every skill is **executable by a model**: each step is a real command (`gitleaks`, `trivy`, `pnpm audit`, `npm view`, `git …`) with an expected-output sample, an exit-code criterion, and false-positive criteria. No unverifiable assertions.

## Why skills, not tools?

### Shape · What it does · What it cannot do
- **Shape**: Tool plugin (e.g. security scanners) · **What it does**: *Executes* scans, returns findings · **What it cannot do**: Interpret alerts, tier false positives, write redacted reports
- **Shape**: Protocol layer · **What it does**: *Constrains* a protocol · **What it cannot do**: Generalize across repos and agents
- **Shape**: **Skill pack (this repo)** · **What it does**: *Teaches methodology*: triage, reporting, remediation order · **What it cannot do**: Execute scans itself

Installed together with a tool-type security plugin, the two compose: the tool runs the scan, the skill drives interpretation, triage, and the report — the model follows this pack's methodology while calling the tool plugin's tools.

The Claude Code ecosystem's 3000+ skills prove the distribution value of this shape. DSH's `SKILL.md` frontmatter (`name`, `description`, `whenToUse`) is format-compatible with CC skills; this pack uses only the common subset and its content is entirely original.

## The eight skills

### Skill · One-line purpose · When to use
- **Skill**: `security-audit` · **One-line purpose**: Five-phase audit flow: scope → inventory → risk tiering → verification → report template · **When to use**: Whole-repo audits, audit reports, planning
- **Skill**: `secret-scan` · **One-line purpose**: Credential audit: gitleaks/trivy usage, false-positive tiers, redacted reports, remediation order · **When to use**: Secret scanning, alert triage, leak reports
- **Skill**: `dependency-audit` · **One-line purpose**: Supply-chain audit: pnpm/npm audit reading, licenses, typosquat risk, lockfile drift · **When to use**: Dependency review, audit-report interpretation
- **Skill**: `supply-chain-review` · **One-line purpose**: Quick PR/new-dependency review: dangerous install scripts, typosquat, reproducible builds · **When to use**: Reviewing PRs that add dependencies
- **Skill**: `prompt-injection-review` · **One-line purpose**: Injection-surface review for agent projects: AGENTS.md, skills, tool descriptions, MCP, web · **When to use**: Reviewing model-context injection surfaces
- **Skill**: `threat-model` · **One-line purpose**: Design-stage threat modeling: trust boundaries, STRIDE table, attack trees, mitigations · **When to use**: Modeling new features, design-stage security review
- **Skill**: `vuln-intel` · **One-line purpose**: Vulnerability intelligence: NVD/CISA-KEV/GHSA/OSV lookups with verdict criteria · **When to use**: Given a CVE/GHSA id, checking impact and exploitation
- **Skill**: `incident-response` · **One-line purpose**: Agent-environment incident response: contain → evidence → recover → postmortem · **When to use**: Suspected security incidents in DSH/agent setups

Each bundle: main file ≤ 300 lines (progressive disclosure; details live in `references/`), `description` self-contained about "when to use / when not to use", and `whenToUse` with precise triggers.

**Two language editions.** Every skill ships with identical names and metadata in two editions: `skills/` (Chinese) and `skills-en/` (English). Install one language per root — same-name skills in one root resolve by rank, so only one edition enters the session catalog. See [docs/release-checklist.md](docs/release-checklist.md) for the language-edition rules.

## Quick start

DSH's local skill provider scans four roots by rank — lower rank wins same-name conflicts within a layer:

### Rank · Root · Scope
- **Rank**: 100 · **Root**: `/.dsh/skills` · **Scope**: Project-scoped, travels with the repo
- **Rank**: 200 · **Root**: `/.agents/skills` · **Scope**: Project-scoped, shared agent directory
- **Rank**: 400 · **Root**: `<dshHome>/skills` (`$DSH_HOME` or `~/.dsh`) · **Scope**: User-scoped, DSH-only
- **Rank**: 500 · **Root**: `<agentsHome>/skills` (`$DSH_AGENTS_HOME` or `~/.agents`) · **Scope**: User-scoped, cross-agent

Ranks (lower wins same-name conflicts within a layer): `project-dsh 100 < project-agents 200 < custom 300 < user-dsh 400 < user-agents 500`. Custom rank 300 is plugin-registered (such as this pack's optional `provider/`), not a disk root.

One-command install (PowerShell, Windows):

```powershell
./scripts/install.ps1 -Target user-agents -Language zh   # Target: project-dsh | project-agents | user-dsh | user-agents; Language: zh (default) | en
```

Or bash (macOS/Linux/CI):

```sh
bash ./scripts/install.sh --target user-agents --language en
```

Or copy by hand (Windows PowerShell shown; any shell works — use `skills-en\` for the English edition):

```powershell
Copy-Item -Recurse .\skills\* "$HOME\.agents\skills\"
```

The catalog appears in the next DSH session. Skill bodies hot-reload — edit `SKILL.md` and the next `skill` load reads the new body; no restart. Uninstall = run the installer with `-Uninstall` / `--uninstall` (it removes exactly what its manifest recorded) or delete the copied directories by hand.

Optional: mount the whole pack without copying via the `provider/` plugin — `language: zh|en` picks the edition (see [provider/README.md](provider/README.md)). The provider is published on npm as [`@perrylink/dsh-skill-pack-security-provider`](https://www.npmjs.com/package/@perrylink/dsh-skill-pack-security-provider): `dsh plugin add @perrylink/dsh-skill-pack-security-provider` mounts it with one command.

## What's inside

### Path · What it is
- **Path**: `skills/<name>/SKILL.md` · **What it is**: The eight skills (Chinese edition); frontmatter follows the official `dsh-skill-filesystem` contract
- **Path**: `skills-en/<name>/SKILL.md` · **What it is**: The eight skills (English edition); same names and metadata as the Chinese edition
- **Path**: `skills/<name>/references/` · **What it is**: Progressive-disclosure detail: command matrices, triage tables, templates
- **Path**: `scripts/install.ps1` · **What it is**: One-command Windows installer for all four roots (both language editions); records a manifest, supports `-Uninstall`/`-DryRun`/`-Force`
- **Path**: `scripts/install.sh` · **What it is**: The POSIX equivalent (`--uninstall`/`--dry-run`/`--force`)
- **Path**: `provider/` · **What it is**: Optional npm-installable provider bundle (declares `dsh.bundle`; embeds both editions in `pack/` via `prepack`; `language: zh\ · en`); registered via `ctx.effect()`, fails loud on a bad `skillsDir`
- **Path**: `package.json` · **What it is**: Root bundle manifest: declares `dsh.bundle.patch` (→ `provider/cordis.patch.yml`) and `dshWorkshop` intake facts, so `dsh plugin add github:PerryLink/dsh-skill-pack-security` mounts the pack through the published provider
- **Path**: `verify/verify-skill-pack.mts` · **What it is**: Headless verification against the official parser and the real `skill` tool — 19 checks across both editions
- **Path**: `VERSION` · **What it is**: Single version source; every SKILL.md `metadata.version` and `provider/package.json` must match it (CI-enforced)
- **Path**: `docs/ecosystem-conflict-check.md` · **What it is**: GitHub topic/name conflict snapshot of the `dsh-plugin` ecosystem
- **Path**: `docs/release-checklist.md` · **What it is**: Release flow: version sync points, language-edition rules, tagging
- **Path**: `docs/improvement-plan.md` · **What it is**: Improvement plans with per-item evidence and acceptance criteria (1.2.0 record + 1.3.0 record)
- **Path**: `CHANGELOG.md` / `SECURITY.md` / `CONTRIBUTING.md` · **What it is**: Release history, vulnerability reporting policy, and contribution/verification rules
- **Path**: `.github/workflows/verify.yml` · **What it is**: CI: 19-check verification + install.sh/install.ps1 exercise + provider build/pack smoke, on Ubuntu and Windows against a pinned harness commit
- **Path**: `.github/dependabot.yml` · **What it is**: Weekly dependency updates for the provider and GitHub Actions
- **Path**: `LICENSE` · **What it is**: Apache License 2.0

## Verification

`verify/verify-skill-pack.mts` imports the **official** `dsh-skill-filesystem` parser and the **real** `skill` tool from a local `deepseek-harness` checkout and asserts 19 checks over both language editions:

1. Layout: both editions present, 8 directory bundles each, no stray flat skills, frontmatter `name` matches directory, ≤ 300 lines, `references/` wired, `metadata.version` synced to the `VERSION` file
2. No name conflicts with the official `.agents/skills/` skills (derived from the checkout at run time) or known community skill packs
3–6. Per edition (Chinese `skills/`, English `skills-en/`): registry discovery through the official provider, full `ctx.skills.get()` loads, the real `skill` tool returning `<skill_content>` (unknown/invalid names rejected), and the session catalog containing `name` + `description` only — `whenToUse` stays out of the model catalog (official design)
7. 13 bad-frontmatter fixtures exercise the official fail-closed rules (missing fields, legacy camel-case keys, non-boolean values, non-kebab names, nested dirs, name mismatch); flat-file skills load and nested `**/SKILL.md` is not discovered
8. The optional provider plugin mounts the Chinese and the English edition via `ctx.effect()`, disposes cleanly, and rejects misconfiguration (empty or nonexistent `skillsDir`)
9–15. Self-hardening checks: zh↔en structural parity, references wiring (no dangling/orphan files), provider version sync, documented skill-root ranks vs the official constants, POSIX-portable `grep -E` patterns, secret self-check, UTF-8-safe release checklist

```powershell
# local: auto-resolves the harness checkout beside the pack, or point it explicitly
$env:DSH_HARNESS_CHECKOUT = 'D:\deepseek-harness'
& D:\deepseek-harness\node_modules\.bin\tsx.CMD verify\verify-skill-pack.mts
# All 19 checks passed for dsh-skill-pack-security.
```

The same 19 checks run on GitHub on every push via `.github/workflows/verify.yml` (badge above) — on Ubuntu and Windows — plus an `install.sh`/`install.ps1` exercise and a standalone provider build/pack smoke that asserts the tarball carries both embedded editions and the bundle patch (`provider` job). The harness checkout is pinned to a commit for reproducible verification.

## Roadmap

- `dsh-skill-pack-data-engineering` — data pipelines, data quality, ETL checklists (same template)
- `dsh-skill-pack-oss-collab` — PR etiquette, issue triage, maintainer workflows
- `dsh-skill-pack-performance` — profiling methodology, benchmark criteria, regression checklists
- More skills inside this pack (same pure-skill boundary): `sbom-lifecycle` (SBOM generation/aging/import workflows), `pen-test-review` (authorized-engagement scoping and report review; re-check the ecosystem snapshot for name clashes before shipping), `compliance-audit` (ASVS/NIST-CSF walkthroughs)
- Provider bundle published on npm as `@perrylink/dsh-skill-pack-security-provider` (`dsh plugin add` ready); keep it in sync with each release via `docs/release-checklist.md`

## Topics

If you host this pack on GitHub, set the repository topics: **`dsh`**, **`dsh-plugin`**, **`deepseek-harness`**, **`skill-pack`**, **`skills`**, **`security`**, **`security-audit`**, **`supply-chain`**, **`supply-chain-security`**, **`prompt-injection`**. The `dsh` / `dsh-plugin` badges above reflect that identity, and `provider/package.json` carries the same values in `keywords`.

## Boundaries

No tool-type security-audit plugin (deliberately complementary to scanner plugins), no skill marketplace, no copied CC skill content — format-compatible, content-original.