<img
        ![](https://badgen.net/github/release/GanyuanRan/Aegis?label=Latest%20Release)</a>
        ![Aegis on olud.ai](https://olud.ai/badge.php?tool=ganyuanran-aegis)</a>

    ![Aegis architecture-driven AI coding agent hero banner](assets/aegis-hero.png)

# Aegis

    Aegis Method Pack
    Make your AI coding agent trustworthy: fewer reworks, safer changes, proof before "done".

    ·
    ·
    ·

> **Stop babysitting your agent.** Aegis makes your agent plan against your real
> baseline before it edits, prove completion with fresh evidence, and leave simple
> tasks alone — you get **fewer reworks, safer changes, and less blind trust in "done"**.

## What You Get

Aegis is a method pack that makes AI coding agents work like disciplined
engineers — so you don't have to watch them.

- **Fewer reworks.** Your agent aligns with your project's real baseline —
  owners, contracts, boundaries — before touching code. It stops guessing, and
  so do you.
- **Safer changes.** Measured on a frozen held-out A/B benchmark: contract
  pass rate **61.67% → 93.33%**, unsafe outcomes **13.33% → 0%**.
- **Proof before "done".** Completion claims ship with fresh verification
  evidence, covered scope, and residual risk. You read evidence, not vibes.
- **No ghost code.** Retired fallbacks and old paths are tracked or removed
  with a retirement trigger — technical debt stops accumulating silently.
- **Simple tasks stay simple.** Trivial requests stay on the fast path;
  ceremony only appears when the task genuinely needs it.
- **One method pack, every host.** The same discipline works across Codex,
  Claude Code, OpenCode, Kimi, and other skill-aware hosts.

> The numbers above are bounded advisory evidence from the frozen benchmark
> below, not a universal-quality or completion-authority claim.

## Measured Agentic Benchmark

A frozen held-out A/B benchmark for Aegis 2.7.6 (2026-08-11) kept the Codex client,
prompts, projects, tool policy, and requested the same `gpt-5.6-sol` / `xhigh` setting
in both arms; only the Aegis projection differed. Across 120 valid runs on 20 cases,
contract pass rate was **61.67% → 93.33% (+31.67 pp)** and unsafe outcomes were **13.33% → 0%**. The 95% case-cluster interval was **+15.00 pp to +50.00 pp**. This is bounded advisory evidence; review was arm-hidden technical review, not independent human review, and host events did not return the observed model identity.

![Aegis agentic benchmark: with and without Aegis](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.svg)

[Sanitized JSON](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.json) · [English table](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.en.md) · [中文表格](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.zh-CN.md) · [Methodology](docs/current/AEGIS_AGENTIC_BENCHMARK_BASELINE.md)

## Quick Install

New here? The fastest start is one prompt to your agent — the full
install-and-verify flow is below.

Give this prompt to your AI coding agent:

```text
Read https://github.com/GanyuanRan/Aegis, identify my current AI coding host, and install Aegis globally using the correct host guide. Restart or reload the host if needed, then run complete-install verification from the installed Aegis method-pack root. Do not run the doctor command from the target project directory. First locate `<aegis-method-pack-root>`, then run `cd <aegis-method-pack-root> && python scripts/aegis-doctor.py --write-config --json`. Treat the install as complete only if the JSON includes `"ok": true`, `"workspaceSupport": "available"`, and `"configStatus": "configured"`; if the host uses a separate skill discovery directory, also verify it with `--discovery-root `; if the host guide declares a skill directory name prefix, also pass `--discovery-name-prefix `.
```

## Updating Aegis

After a complete install has registered the current host, later updates can use
natural language such as `update Aegis` or the explicit skill request
`aegis:update`. The agent can route either form through the local update path:
locate the installed method-pack root, use the host-scoped registry, and call
`scripts/aegis-update.py` for the current host by default. Updating every
registered host requires an explicit `--all` request. Aegis does not run
background automatic updates by default.

## Before You Use It

Aegis is currently:

> `Aegis Method Pack (runtime-ready)`

It is **not** the full Aegis Platform, a daemon, a background runner, a runtime
core, an authoritative `GateDecision`, an authoritative `PolicySnapshot`, or
final completion authority. User instructions and target-project rules outrank
Aegis guidance.

The following files are optional, manually copied host/profile projections.
They do not install Aegis or prove skill discovery. If the host already has
reliable Aegis bootstrap and routing, no extra global rule is usually needed
for routing. Otherwise, copy Lite as the complete base profile. Advanced is a
non-standalone additive overlay; append only the rules needed for persistent
governance preferences:

- [Lite global rules](GLOBAL_USER_RULES_LITE.md)
- [Advanced governance overlay](GLOBAL_USER_RULES_TEMPLATE.md)

These copied rules are not managed by `aegis:update`. Lite owns the default
`auto` activation profile and its explicit-mode replacement; Advanced inherits
that choice instead of repeating it. When switching to `explicit`, update the
copied Lite profile too; host-native skill matching may still remain
host-controlled.

Activation mode defaults to automatic. To switch to explicit mode, run this
from the installed method-pack root:

```bash
cd <aegis-method-pack-root>
python scripts/aegis-doctor.py activation-mode explicit
```

Restart the host after changing activation mode. Details and host caveats live
in [docs/current/AEGIS_ACTIVATION_MODE.md](docs/current/AEGIS_ACTIVATION_MODE.md).

TDD mode defaults to `off`: Aegis does not automatically require TDD, and
completion verification still applies. To enable automatic TDD routing when you
want Aegis to choose strict, light, or skipped by task risk:

```bash
cd <aegis-method-pack-root>
python scripts/aegis-doctor.py tdd-mode auto
```

You can also request strict TDD directly in a query with explicit markers such
as `TDD Route: strict`, `strict TDD`, `test-first`, or
`RED / GREEN / REFACTOR`.

Details live in [docs/current/AEGIS_TDD_MODE.md](docs/current/AEGIS_TDD_MODE.md).

## Supported Hosts

Aegis keeps a multi-host, plugin-installable distribution goal.

| Host group | Current status | Start here |
| --- | --- | --- |
| `Codex`, `OpenCode` | Fresh evidence exists for the current method-pack scope | [Codex](docs/README.codex.md), [OpenCode](docs/README.opencode.md) |
| `Claude Code`, `CodeBuddy`, `DeepSeek-TUI`, `DeepSeek Harness`, `Trae`, `GitHub Copilot`, `Qoder`, `Kimi Code CLI`, `ZCode`, `Grok Build` | Install guides exist; release-level fresh host smoke is still pending | [Claude Code](docs/README.claude-code.md), [CodeBuddy](docs/README.codebuddy.md), [DeepSeek-TUI](docs/README.deepseek-tui.md), [DeepSeek Harness](docs/README.deepseek-harness.md), [Trae](docs/README.trae.md), [GitHub Copilot](docs/README.copilot.md), [Qoder](docs/README.qoder.md), [Kimi Code CLI](docs/README.kimi-code.md), [ZCode](docs/README.zcode.md), [Grok Build](docs/README.grok-build.md) |
| `CC GUI (JetBrains IDEA)` | Structural IDE plugin layer support for Claude Code / OpenAI-GPT provider paths; release-level fresh host smoke is still pending | [CC GUI](docs/README.cc-gui.md) |
| `Antigravity CLI`, `Antigravity IDE`, `Antigravity App` | `Antigravity CLI` is the current active closeout target; `IDE/App` remain structural targets and release-level fresh host smoke is still pending | [Antigravity](docs/README.antigravity.md) |
| `Gemini CLI` | Retired; Aegis no longer ships or verifies a Gemini CLI adapter | [Compatibility Matrix](docs/current/AEGIS_HOST_COMPATIBILITY_MATRIX_SNAPSHOT.md) |

Read the current host verdict before making support claims:

- [Host compatibility matrix](docs/current/AEGIS_HOST_COMPATIBILITY_MATRIX_SNAPSHOT.md)
- [Known limitations](docs/current/AEGIS_KNOWN_LIMITATIONS.md)

## Start Fast With Aegis

After installation and host restart, use normal language. Aegis matches the
method to the work; name a mode directly when you want less ambiguity.

```text
Why does this login failure happen? Diagnose it before changing code.
Grill me on whether we should ship a hosted version first.
Aegis goal: Fix the auth refresh bug without rewriting the auth system.
Review this diff independently before I merge it.
```

Read the [Fast-Track Playbook](docs/current/AEGIS_FAST_TRACK_PLAYBOOK.md) for
Aegis's lightweight operating model, how it differs from standalone skill
packs, its five engineering moats, project workspace lifecycle, natural trigger
phrases, controls, and troubleshooting. The Chinese version is
[Aegis 速通秘籍](docs/current/AEGIS_FAST_TRACK_PLAYBOOK_ZH.md).

Use these explicit requests when you need tighter control:

- `Aegis goal: ...` frames scope, success evidence, and boundaries.
- `Grill me ...` or `审问我 ...` starts a decision interview; it asks one
  decision question at a time and does not plan or implement.
- `TDD Route: strict`, `strict TDD`, or `test-first` explicitly requests
  strict test-first work. TDD is otherwise `off` by default.
- `aegis:first-principles-review` or `review this from first principles`
  pressure-tests a complex direction before implementation.
- `aegis:update` updates the installed method pack through its host-aware path.

For non-trivial project work, Aegis can passively reuse relevant canonical
language from `CONTEXT.md` or a bounded context selected by `CONTEXT-MAP.md`.
It activates domain modeling only when a term is resolved, ambiguous, renamed,
deprecated, or conflicting. High-confidence existing facts may synchronize
directly; unresolved domain decisions remain user-owned. Files are created
lazily on the first resolved term and remain glossary-only. Stable bytes can be
cache-friendly, but Aegis does not guarantee provider cache hits or savings.

Aegis preserves Workflow Quality by keeping simple work light and expanding
only when risk warrants it. For deeper method detail, read the
[Workflow Guide](docs/current/AEGIS_WORKFLOW_GUIDE.md),
[Workflow Quality Baseline](docs/current/AEGIS_WORKFLOW_QUALITY_BASELINE.md),
[Complexity Governance Baseline](docs/current/AEGIS_COMPLEXITY_GOVERNANCE_BASELINE.md),
and [TDD mode](docs/current/AEGIS_TDD_MODE.md).

If a capability does not trigger as expected, use trigger-chain diagnosis:
install/version visibility, host skill discovery, activation mode,
`using-aegis` routing, task-to-skill matching, and context pressure. Read the
[Trigger Health Baseline](docs/current/AEGIS_TRIGGER_HEALTH_BASELINE.md).

## For Maintainers

Primary verification entry:

```bash
bash tests/e2e/run-all.sh --full --host-profile fast
```

Focused docs / method-pack checks:

```bash
bash tests/e2e/boundary-compliance-check.sh
bash tests/e2e/workflow-quality-check.sh
bash tests/e2e/install-verification-policy-check.sh
bash tests/e2e/layer1-fast-check.sh --host-profile none
```

Read:

- [docs/testing.md](docs/testing.md)
- [Release checklist](docs/current/AEGIS_METHOD_PACK_RELEASE_CHECKLIST.md)
- [Current authority map](docs/current/README.md)
- [Contributing](CONTRIBUTING.md)

## Community & Extending

- Feedback and discussion: [GitHub Discussions](https://github.com/GanyuanRan/Aegis/discussions) · [Issues](https://github.com/GanyuanRan/Aegis/issues) · [LINUX DO](https://linux.do/t/topic/2108966/20) · [DEV.to](https://dev.to/_879c5a0279451d52e43c3/aegis-a-method-pack-for-more-reliable-ai-coding-agents-1gfm)
- Extend Aegis: write your own skill with `aegis:writing-skills`; see the [Workflow Guide](docs/current/AEGIS_WORKFLOW_GUIDE.md).
- Follow along: [RELEASE-NOTES.md](RELEASE-NOTES.md) · [Releases](https://github.com/GanyuanRan/Aegis/releases)

## Relationship To Superpowers

Aegis is derived from **[Superpowers](https://github.com/obra/superpowers)**,
created by [Jesse Vincent](https://github.com/obra). Superpowers pioneered
composable, multi-harness agent skills. Aegis keeps that foundation and adds an
architecture- and evidence-focused method layer for real software projects.

Additional inspiration comes from
[mattpocock/skills](https://github.com/mattpocock/skills), especially concise
communication, shared language, and disciplined debugging patterns. These ideas
were re-implemented in Aegis format rather than copied verbatim.