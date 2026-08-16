# DSH Release Guardian

  ![DSH Release Guardian — deterministic release-risk checks for Git changes](./assets/readme-hero.png)

Local, deterministic release-risk checks for Git changes. Use the same scanner through a DeepSeek Harness host tool, a standalone CLI, an optional Codex skill adapter, or an optional Claude Code plugin.

中文概览：Release Guardian 在本机读取 Git 变更，检查新增代码和变更文件中的发布风险，并发现常见项目检查。默认只读，不执行项目代码；只有用户明确授权后才会运行所展示的检查命令。

## What v0.1 does

- Scans `worktree`, `staged`, or `range` Git changes.
- Applies deterministic rules to changed-file metadata and added lines.
- Discovers test, typecheck, and build commands for JavaScript, Python, Go, Rust, Java, and .NET projects.
- Produces a human-readable report or a versioned JSON report.
- Registers the `release_guardian_check` tool when installed as a DeepSeek Harness bundle.
- Gives Codex a safety-aware workflow through the optional `release-guardian` skill.
- Installs into Claude Code as a plugin: the `release-guardian` skill, a read-only `release-auditor` subagent, a `dsh-release-guardian` command on the session `PATH`, and an opt-in pre-commit gate.

Release Guardian is a risk signal, not a proof that a release is safe. A `ready` verdict means that this scan found no release-blocking condition within its configured scope.

## Choose an entry point

All entry points use the same release-report contract and the same explicit authorization boundary for project checks.

### Entry point · Best for · How it runs
- **Entry point**: **DSH bundle** · **Best for**: DeepSeek Harness profiles and tool calling · **How it runs**: Installs the package bundle and registers `release_guardian_check`.
- **Entry point**: **Standalone CLI** · **Best for**: Terminals, local scripts, and CI · **How it runs**: Runs the packaged `dsh-release-guardian` executable.
- **Entry point**: **Codex adapter (optional)** · **Best for**: Guided audits in Codex · **How it runs**: Loads `skills/release-guardian/SKILL.md`; it prefers the bundled runner and falls back to `dsh-release-guardian` on `PATH` when the runner is unavailable.
- **Entry point**: **Claude Code plugin (optional)** · **Best for**: Guided audits and an opt-in commit gate in Claude Code · **How it runs**: Loads `.claude-plugin/plugin.json`; puts `dsh-release-guardian` on the Bash tool's `PATH` through `bin/`, and shares the same skill.

These are adapters, not separate scanners. See [Architecture](./docs/architecture.md) for the component and trust-boundary map.

## Safety model

The default `check` operation is read-only with respect to the target repository. It runs local Git commands and reads configuration and manifest files, but it does not execute project code. Release Guardian itself has zero telemetry and does not install project dependencies, publish packages, or deploy software.

Project checks are a separate, explicitly authorized operation:

- The CLI runs them only with `--run-checks`; it displays the exact plan and asks for confirmation. Non-interactive use also requires `--yes`.
- The host tool runs them only with `action: "run"` and exact command IDs from a prior discovery response.
- Approved commands are **not sandboxed**. They run with the invoking user's permissions in the repository.
- Discovery adds offline/no-restore/read-only flags where supported and execution uses a reduced environment, but these controls are best effort. They are not a network or filesystem security boundary.
- Execution is allowed only for a complete `worktree` scan with untracked files included. Approval IDs are bound to the canonical repository, effective baseline policy, and exact diff fingerprint; any source or configuration change invalidates prior approval.
- Configured commands may contain arbitrary argv. Merely placing a command in `.release-guardian.yml` discovers it; configuration is never an execution grant.

Review every displayed command before authorizing it.

Report security-boundary bypasses through the private process in [SECURITY.md](./SECURITY.md); never paste a real credential into a public issue.

Development setup and pull-request expectations are documented in [CONTRIBUTING.md](./CONTRIBUTING.md). Release notes are in [CHANGELOG.md](./CHANGELOG.md).

## Requirements

- Node.js `^22.19.0` or `>=24.0.0`
- Git
- The relevant language toolchains only if checks will be executed
- For the DeepSeek Harness route: `pnpm` plus either `dsh` on `PATH` or the official `npx @deepseek-ai/dsh` launcher

The host bundle is tested against `@deepseek-ai/dsh` `0.1.0-rc.6`. DeepSeek Harness is still a developer preview, so re-run the packed-profile smoke test when upgrading RC versions.

## Compatibility

### Surface · Supported / tested · Notes
- **Surface**: Node.js · **Supported / tested**: `^22.19.0` or `>=24.0.0` · **Notes**: Required by the CLI, bundle, and bundled Codex runner.
- **Surface**: Git · **Supported / tested**: Current Git with the CLI available on `PATH` · **Notes**: A target must be a local Git repository.
- **Surface**: DeepSeek Harness · **Supported / tested**: `@deepseek-ai/dsh` `0.1.0-rc.6` · **Notes**: Developer preview; exact packed-profile smoke coverage is recorded in CI.
- **Surface**: Package managers · **Supported / tested**: npm for building/installing; pnpm for the DSH profile · **Notes**: Git-source DSH installs may require explicit pnpm build approval.
- **Surface**: Codex adapter · **Supported / tested**: Codex installations that load `.codex-plugin/plugin.json` or repository skills · **Notes**: Optional; direct skill copies must include the skill's `scripts/` directory.
- **Surface**: Claude Code plugin · **Supported / tested**: Claude Code releases that load `.claude-plugin/plugin.json` · **Notes**: Optional; the `if` hook filter and `userConfig` options require a current Claude Code. Claude Code installs plugin dependencies with `npm ci --ignore-scripts`, so it never builds this package.
- **Surface**: Operating systems · **Supported / tested**: Linux, macOS, Windows · **Notes**: Exercised by the Node.js CI matrix; language-specific checks also require their own toolchains.

## Install

### Prebuilt GitHub release (recommended)

Download the prebuilt tarball from the [latest GitHub release](https://github.com/XiaoSong1223/dsh-release-guardian/releases/latest), then install it into a DSH profile:

```sh
curl -LO https://github.com/XiaoSong1223/dsh-release-guardian/releases/download/v0.1.0/dsh-release-guardian-0.1.0.tgz
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile headless add \
  ./dsh-release-guardian-0.1.0.tgz
npx @deepseek-ai/dsh@0.1.0-rc.6 --profile headless --dump-config
```

The release tarball contains built JavaScript and does not require permission to execute a package build during installation.

### Install directly from GitHub

DSH also accepts a pinned GitHub source:

```sh
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile headless add \
  github:XiaoSong1223/dsh-release-guardian#v0.1.0
```

Git installs run this TypeScript package's `prepare` build. pnpm 10 and newer require the profile to explicitly allow that build. Review the pinned source, add `dsh-release-guardian: true` under `allowBuilds` in the profile's `pnpm-workspace.yaml`, and repeat the command. Prefer the prebuilt release tarball when you do not want to grant install-time build permission.

### Build from a checkout

From this checkout, install Release Guardian's own dependencies and build a package tarball:

```sh
npm ci
npm pack
```

`npm pack` runs the package `prepare` script, so the resulting `dsh-release-guardian-0.1.0.tgz` contains built JavaScript.

### Standalone CLI

Install the built tarball globally:

```sh
npm install --global ./dsh-release-guardian-0.1.0.tgz
dsh-release-guardian --help
```

For development without a global install, build and invoke `node lib/cli.js` from this checkout.

### DeepSeek Harness bundle

Add the same built tarball to the desired DSH profile:

```sh
dsh plugin --profile headless add ./dsh-release-guardian-0.1.0.tgz

# No global dsh installation is required:
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile headless add \
  ./dsh-release-guardian-0.1.0.tgz
```

Replace `headless` with the profile you use. `dsh plugin` initializes a missing profile, forwards `add` to pnpm in that profile, and activates this package's `cordis.patch.yml` bundle. Boot the profile normally; it exposes the `release_guardian_check` host tool. This package does not provide a Web UI.

### Optional Codex adapter

This repository is also a Codex plugin bundle. Install or load the repository through Codex's plugin controls, then ask Codex to use the `release-guardian` skill for a release audit. The skill calls its self-contained runner at:

```text
skills/release-guardian/scripts/release-guardian.mjs
```

The runner makes the adapter work from the installed plugin without requiring a global CLI. If the companion script is unavailable, the adapter may fall back to `dsh-release-guardian` on `PATH`, which is useful for development and older package layouts.

If you copy the skill manually instead of installing the plugin bundle, copy the **entire** `skills/release-guardian/` directory, including `scripts/release-guardian.mjs`. Copying only `SKILL.md` removes the bundled runner; in that case the adapter works only when a compatible `dsh-release-guardian` is already on `PATH`.

Why does a DSH package contain `.codex-plugin/plugin.json`? It is distribution metadata for the optional Codex adapter: it tells Codex where the packaged skills and presentation assets live. It does not change DSH loading, register the DSH host tool, execute code at install time, or make Codex a runtime dependency of the scanner. Keeping this manifest in the same release artifact lets the DSH bundle, CLI, and Codex skill share one reviewed implementation and version.

See [Troubleshooting](./docs/troubleshooting.md#codex-adapter) if Codex cannot find the skill or runner.

### Optional Claude Code plugin

This repository is also a Claude Code plugin and a single-plugin marketplace. Add the marketplace, then install the plugin:

```text
/plugin marketplace add XiaoSong1223/dsh-release-guardian
/plugin install dsh-release-guardian@release-guardian
```

A local checkout works the same way and is the recommended way to try changes:

```sh
npm ci && npm run build
```

```text
/plugin marketplace add /absolute/path/to/dsh-release-guardian
/plugin install dsh-release-guardian@release-guardian
```

The plugin adds four surfaces:

### Surface · What it does
- **Surface**: `/release-guardian` skill · **What it does**: The shared skill: scan, explain the verdict, and request approval before any project check runs.
- **Surface**: `release-auditor` subagent · **What it does**: Runs a read-only audit in its own context and returns the verdict, findings, and check plan, so a large JSON report never fills the main conversation.
- **Surface**: `dsh-release-guardian` command · **What it does**: `bin/dsh-release-guardian` is placed on the Bash tool's `PATH`, so the CLI works in a session without a global install. It only locates and executes the real CLI; it never adds, removes, or rewrites a flag.
- **Surface**: Pre-commit gate (opt-in) · **What it does**: With the `commit_gate` option enabled, a `PreToolUse` hook scans what a `git commit` would record and denies the commit on a `block` verdict.

Claude Code never builds this package, so the launcher resolves a runnable CLI in this order: the `DSH_RELEASE_GUARDIAN_CLI` environment variable or the plugin's `cli_path` option, then the self-contained `skills/release-guardian/scripts/release-guardian.mjs`, then `lib/cli.js`, then a `dsh-release-guardian` already on `PATH`. The bundled runner comes before `lib/cli.js` because it needs no installed dependencies, and a plugin source without a lockfile never gets them. If nothing resolves, the launcher exits `69` and prints what to build or install; it never installs anything itself.

The pre-commit gate is **off by default**. Enable it per user or project with the plugin's `commit_gate` option, or by exporting `DSH_RELEASE_GUARDIAN_COMMIT_GATE=1`. It scans `staged` changes, or the worktree for `git commit -a`, and reports only rule IDs and paths, never finding text. It is advisory, not a security boundary: a missing CLI, a timeout, or an unreadable report allows the commit and says the gate did not run.

The plugin deliberately ships no `allowed-tools` pre-approval for the skill. A `Bash(dsh-release-guardian check:*)` rule would also pre-approve `--run-checks`, which would defeat the execution gate, so each command follows the session's normal permission flow.

## CLI

```text
dsh-release-guardian check [options]
dsh-release-guardian rules
dsh-release-guardian explain RULE_ID
```

With no command, the CLI defaults to `check`.

Common examples:

```sh
# Unstaged, staged, and optionally untracked work against HEAD
dsh-release-guardian check --repo /absolute/path/to/repo

# Index changes against HEAD
dsh-release-guardian check --repo /absolute/path/to/repo --mode staged

# Changes from the merge base of origin/main and HEAD through HEAD
dsh-release-guardian check --repo /absolute/path/to/repo --base origin/main --head HEAD

# Stable machine-readable report
dsh-release-guardian check --repo /absolute/path/to/repo --format json

# Discover and then explicitly approve the displayed test/typecheck plan
dsh-release-guardian check --repo /absolute/path/to/repo \
  --checks test,typecheck --run-checks

# After a static JSON scan, execute only one previously displayed check ID
dsh-release-guardian check --repo /absolute/path/to/repo \
  --checks test --check-id sha256:... --run-checks

# Rule inventory and remediation details
dsh-release-guardian rules
dsh-release-guardian explain RG103
```

### Check options

### Option · Meaning
- **Option**: `--repo PATH` · **Meaning**: Repository path; defaults to the current directory.
- **Option**: `--mode worktree\ · **Meaning**: staged\ · range` · Select the diff mode. Supplying `--base` implies `range`.
- **Option**: `--base REF` · **Meaning**: Base ref for range mode. The scanner uses its merge base with `--head`.
- **Option**: `--head REF` · **Meaning**: Head ref; defaults to `HEAD`.
- **Option**: `--include-untracked true\ · **Meaning**: false` · Include untracked regular files in worktree mode; defaults to `true`.
- **Option**: `--config PATH` · **Meaning**: Repository-contained config path; defaults to `.release-guardian.yml`.
- **Option**: `--format text\ · **Meaning**: json` · Report format; defaults to `text`.
- **Option**: `--output PATH` · **Meaning**: Create a report file with mode `0600`; an existing file is never overwritten.
- **Option**: `--checks LIST` · **Meaning**: Comma-separated subset of `test,typecheck,build`.
- **Option**: `--check-id ID` · **Meaning**: Execute only this exact discovered check ID; repeat to select more than one. Requires `--run-checks`.
- **Option**: `--run-checks` · **Meaning**: Execute the displayed check plan after authorization.
- **Option**: `--yes` · **Meaning**: Confirm non-interactively; valid only with `--run-checks`.
- **Option**: `--fail-on review\ · **Meaning**: block` · Exit threshold; defaults to `block`.
- **Option**: `--max-diff-bytes N` · **Meaning**: Override the diff byte limit.
- **Option**: `--timeout SECONDS` · **Meaning**: Set the per-check execution timeout for this invocation.
- **Option**: `--help` · **Meaning**: Show help.

`range` mode requires `--base`. `--base` conflicts with an explicitly selected non-range mode.

### Verdicts and exit codes

### Verdict or condition · Exit code
- **Verdict or condition**: `ready` · **Exit code**: 0
- **Verdict or condition**: `review` with the default `--fail-on block` · **Exit code**: 0
- **Verdict or condition**: `review` with `--fail-on review` · **Exit code**: 1
- **Verdict or condition**: `block` · **Exit code**: 2
- **Verdict or condition**: `inconclusive`, incomplete scan, or fatal audit failure · **Exit code**: 3
- **Verdict or condition**: CLI usage error · **Exit code**: 64

The `rules` and successful `explain` commands exit 0.

## Diff modes

- `worktree` compares the working tree with `HEAD`; untracked files are included by default.
- `staged` scans index changes against `HEAD`; untracked files are not part of this mode.
- `range` computes `merge-base(BASE, HEAD_REF)` and scans through `HEAD_REF`. Range and staged scans are read-only review scopes; project checks execute only in full worktree mode.

Diffs are collected with external diff drivers and text conversion disabled. Limits fail closed: truncation produces `RG405` and an `inconclusive` verdict.

## Rules

Rules inspect only the selected change: changed-file metadata plus added lines, except where a rule explicitly concerns deletion, binary content, or truncation. Evidence for recognized secrets is redacted in reports.

### ID · Detection · Severity / disposition
- **ID**: RG001 · **Detection**: High-confidence credential token · **Severity / disposition**: critical / block
- **ID**: RG002 · **Detection**: Private key material · **Severity / disposition**: critical / block
- **ID**: RG003 · **Detection**: Probable secret assignment · **Severity / disposition**: high / review
- **ID**: RG004 · **Detection**: Embedded URL or bearer credential · **Severity / disposition**: critical / block
- **ID**: RG005 · **Detection**: Sensitive file added · **Severity / disposition**: high / review
- **ID**: RG101 · **Detection**: Dependency manifest or lockfile changed · **Severity / disposition**: medium / review
- **ID**: RG102 · **Detection**: Package lifecycle script changed · **Severity / disposition**: high / review
- **ID**: RG103 · **Detection**: Downloaded or encoded content executed · **Severity / disposition**: critical / block
- **ID**: RG201 · **Detection**: Broad CI write permissions · **Severity / disposition**: high / review
- **ID**: RG202 · **Detection**: Untrusted pull-request workflow risk · 