```
██████╗ ███████╗██╗  ██╗  ██████╗ ██████╗ ██╗██████╗  ██████╗ ███████╗
██╔══██╗██╔════╝██║  ██║  ██╔══██╗██╔══██╗██║██╔══██╗██╔════╝ ██╔════╝
██║  ██║███████╗███████║  ██████╔╝██████╔╝██║██║  ██║██║  ███╗█████╗
██║  ██║╚════██║██╔══██║  ██╔══██╗██╔══██╗██║██║  ██║██║   ██║██╔══╝
██████╔╝███████║██║  ██║  ██████╔╝██║  ██║██║██████╔╝╚██████╔╝███████╗
╚═════╝ ╚══════╝╚═╝  ╚═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝  ╚═════╝ ╚══════╝
```

**Familiar harness commands for DeepSeek Harness, with every plugin audited first.**

![dsh-bridge connectors flow: credential detection resolves into a masked detection matrix, then a trust report card for @liustack/modlens showing grade B with file-and-line evidence.](site/demo/connect-demo.gif)

Rendered from the specs rather than a running build. Stills:
[detection matrix](site/demo/connect-matrix-dark.png) ([light](site/demo/connect-matrix-light.png)) ·
[trust card](site/demo/trust-card-dark.png) ([light](site/demo/trust-card-light.png)).

## What

dsh-bridge is a [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin for people arriving from Claude Code, Codex CLI, OpenCode, or Jcode. It ports the slash commands you already know onto DSH-native seams, adds a guided connectors flow, and refuses to recommend a community plugin until an adversarial review has graded it.

## Why

- **Language.** The DSH plugin ecosystem skews non-English. The catalog and command surface here are English-first.
- **Trust.** Plugins are arbitrary code. Every recommendation ships a report card citing file-and-line evidence you can re-check.
- **Muscle memory.** `/model`, `/resume`, `/memory`, `/mcp`, `/review` behave the way your previous harness taught you.

## Install

Requires [pnpm](https://pnpm.io) 10 or newer on your PATH (`dsh plugin` manages profile dependencies through it).

```bash
dsh plugin --profile web add github:beartackler/dsh-bridge
```

The repository ships its compiled `dist/` output, so nothing builds on your machine at install time and dsh asks for no build-script permission. To make sure a later push cannot silently change what runs, pin a commit:

```bash
dsh plugin --profile web add "github:beartackler/dsh-bridge#<commit-sha>"
```

Then boot and use `/bridge-help` inside DSH:

```bash
dsh --profile web        # serves http://127.0.0.1:3080
```

Verified against `@deepseek-ai/dsh` 0.1.1-rc.2: a fresh install from a git checkout activates the bundle with no warnings and all 17 commands register ([how this was verified](docs/research/live-mount-report.md)).

## Verified catalog

[docs/catalog/INDEX.md](docs/catalog/INDEX.md) lists every plugin that has completed a trust review, with the audited commit and a linked report card.

Grades: **A** verified-clean · **B** safe with documented behavior · **C** use with awareness · **D** risky · **F** do not install. A grade is an evidence-backed opinion over one pinned commit, not a safety guarantee.

![Trust report card for @liustack/modlens: grade B, with subject commit, sha512 integrity, npm attestation, MIT license, and per-capability findings for network, exec, telemetry, credentials, and filesystem writes.](site/demo/trust-card-dark.png)

## Commands

All seventeen commands are implemented and verified end-to-end against `@deepseek-ai/dsh` 0.1.1-rc.2 (42 live invocations, see [the verification report](docs/research/e2e-verification.md)).

### Command · Does
- **Command**: [`/help`](docs/specs/commands/help.md) · **Does**: Lists the bridge surface and the DSH-native equivalent of each command.
- **Command**: [`/init`](docs/specs/commands/init.md) · **Does**: Onboards a repository and generates its instruction file.
- **Command**: [`/connect`](docs/specs/commands/connect.md) · **Does**: Detects existing provider credentials, configures routes, smoke-tests them.
- **Command**: [`/model`](docs/specs/commands/model.md) · **Does**: Switches the active model or route without editing profile YAML.
- **Command**: [`/status`](docs/specs/commands/status.md) · **Does**: Reports session, profile, and route state already known. Probes nothing.
- **Command**: [`/doctor`](docs/specs/commands/doctor.md) · **Does**: Runs environment health checks and prints only what it actually observed.
- **Command**: [`/memory`](docs/specs/commands/memory.md) · **Does**: Reads and edits persistent user and project memory.
- **Command**: [`/compact`](docs/specs/commands/compact.md) · **Does**: Compacts conversation context on demand.
- **Command**: [`/resume`](docs/specs/commands/resume.md) · **Does**: Picks a recent session to resume or fork.
- **Command**: [`/review`](docs/specs/commands/review.md) · **Does**: Reviews working-tree or pull-request changes.
- **Command**: [`/improve`](docs/specs/commands/improve.md) · **Does**: Proposes and applies targeted improvements to selected code.
- **Command**: [`/mcp`](docs/specs/commands/mcp.md) · **Does**: Adds, inspects, and removes MCP servers.
- **Command**: [`/browse`](docs/specs/commands/browse.md) · **Does**: Browses the verified catalog with grade and trust filters.
- **Command**: [`/trust`](docs/specs/commands/trust.md) · **Does**: Prints a plugin's trust report card with its evidence.
- **Command**: [`/install`](docs/specs/commands/install.md) · **Does**: Installs a plugin, preferring verified builds and requiring explicit risk consent.
- **Command**: [`/suggest`](docs/specs/commands/suggest.md) · **Does**: Handles the dead end: scaffolds the plugin that does not exist yet.
- **Command**: [`/refactor`](docs/specs/commands/refactor.md) · **Does**: Plans and applies behavior-preserving restructuring, tests-green gated.

Naming caveat: shipped names will be either `/bridge:<name>` or `/bridge-<name>`, pending an open DSH parser question.

## Docs

- [Architecture](docs/architecture.md) — how the plugin sits on the Cordis kernel.
- [Trust pipeline](docs/trust/pipeline-architecture.md) — grading bands, heuristics, provenance checks.
- [Command specs](docs/specs/commands) · [Plugin author guide](docs/plugin-author-guide.md) · [Glossary](docs/glossary.md) · [FAQ](docs/faq.md)
- [Charter](CHARTER.md) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Roadmap](ROADMAP.md)

## Status

Under active development. Research and audit artifacts land in `docs/` as they are produced.

### Milestone · State
- **Milestone**: Capability research · **State**: in progress
- **Milestone**: Adversarial audit of DSH built-ins · **State**: in progress
- **Milestone**: MVP plugin (commands, connectors) · **State**: shipped - 17 commands e2e-verified in dsh 0.1.1-rc.2
- **Milestone**: Trust report card pipeline · **State**: shipped - 24 plugins graded (7 B, 16 C, 1 D)
- **Milestone**: Onboarding wizard UI · **State**: planned

## Principles

1. Trust over speed. Every security claim cites evidence.
2. English-first, i18n-ready.
3. Minimal code. Shortest correct implementation, no speculative features.
4. You own your machine. No telemetry without opt-in.

## Provenance

Cross-reviewed by design: adversarial reviews are performed by models that did not write the artifact under review. Quality gates are documented in CONTRIBUTING.md.

Not affiliated with DeepSeek. Built on their MIT-licensed groundwork with gratitude.