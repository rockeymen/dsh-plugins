![DeepJIT banner](assets/banner.jpeg)

# DeepJIT

A JIT compiler plugin for [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (dsh).

## Overview

DeepJIT watches agent execution traces, mines recurring "hot" workflows, and
compiles them with an LLM into reusable **skills** (markdown) or **flows**
(step templates) — then feeds them back into the running harness, no restart.
It is for anyone who repeats similar multi-tool workflows and wants dsh to
turn them into fast, reusable assets.

```
traces ──► SQLite ──► hot-path mining ──► LLM compile ──► skills / flows ──► dsh
```

- Artifacts live under `~/.dsh/deepjit/` and hot-reload into dsh.
- JIT never compiles its own tools, so it can't feed on itself.
- Lifecycle (compiler-style): an AOT pass validates flows against the live tool
  registry and constant-folds literal args; tiering promotes hot, reliable
  skills to flows and deoptimizes unreliable flows; GC prunes stale artifacts.

## Compatibility

### Item · Value
- **Item**: DSH version · **Value**: `@deepseek-ai/dsh` `0.1.0-rc.7` (runtime-verified)
- **Item**: DSH mainline · **Value**: `99f6f02f` (static-checked 2026-08-17; used APIs unchanged)
- **Item**: Verified commit · **Value**: `5869674` (2026-08-13)
- **Item**: Node · **Value**: `^22.19 \ · \ · >=24`
- **Item**: Profiles · **Value**: `headless`, `web`

dsh is pre-release; APIs may drift. Pins `@deepseek-ai/*` to `0.1.0-rc.6`.

## Install / Uninstall

```sh
# install (git, no npm release needed)
dsh plugin --profile web add github:fly3366/DeepJIT

# disable for one profile
dsh plugin --profile web remove deepjit

# fully remove local data
rm -rf ~/.dsh/deepjit
```

## Quick start

```sh
dsh plugin --profile headless add github:fly3366/DeepJIT
DEEPSEEK_API_KEY=... dsh --profile headless "read package.json and tsconfig.json, then summarize"
# repeat similar tasks; deepjit mines and compiles hot flows automatically
dsh --profile headless "use deepjit_status to list compiled artifacts"
```

## Configuration

Override in `cordis.patch.yml` or a profile patch. Key options (full list in
[`src/config.ts`](src/config.ts)):

### Key · Default · Description
- **Key**: `enabled` · **Default**: `true` · **Description**: master switch
- **Key**: `summarizeIntervalMs` · **Default**: `600000` · **Description**: JIT cycle (mine + compile)
- **Key**: `minRepeat` · **Default**: `3` · **Description**: min occurrences for a hot sequence
- **Key**: `argumentAware` · **Default**: `false` · **Description**: include sorted arg-key signatures in mined sequences
- **Key**: `minFlowSteps` · **Default**: `2` · **Description**: min tool steps a flow must have to be compiled
- **Key**: `minPatternValue` · **Default**: `6` · **Description**: min value score (`count × steps`) to justify a compile
- **Key**: `flushBatchSize` · **Default**: `200` · **Description**: trace rows per batched SQLite write
- **Key**: `maxPendingCalls` · **Default**: `10000` · **Description**: cap for in-memory pending/raw maps (bounds memory)
- **Key**: `minerMaxRows` · **Default**: `20000` · **Description**: max trace rows read per session per mining cycle
- **Key**: `transcriptMaxRows` · **Default**: `2000` · **Description**: max tool rows read per compile transcript
- **Key**: `gcEnabled` / `gcStaleMs` / `gcProtectMs` · **Default**: `true` / 14d / 1d · **Description**: GC: disable artifacts unused beyond `gcStaleMs` after a `gcProtectMs` grace
- **Key**: `dryRun` · **Default**: `false` · **Description**: publish artifacts as disabled; enable manually via `deepjit_status`
- **Key**: `traceRetentionMs` / `patternRetentionMs` · **Default**: 7d / 7d · **Description**: prune trace rows / stale uncompiled patterns older than this
- **Key**: `deoptMinUses` / `deoptMaxSuccessRate` · **Default**: `5` / `0.5` · **Description**: disable a flow used ≥N times with success rate ≤ this (deoptimization)
- **Key**: `qualityMinUses` / `minQuality` · **Default**: `5` / `0` · **Description**: disable active artifacts used ≥N times whose quality score < minQuality (0 = off)
- **Key**: `promoteMinUses` / `promoteMinSuccessRate` · **Default**: `5` / `0.8` · **Description**: recompile a hot, reliable skill's pattern as a flow (promotion)
- **Key**: `llmProvider` / `llmModel` · **Default**: `deepseek-official` / (session) · **Description**: compile model; empty = reuse session model
- **Key**: `locale` · **Default**: `auto` · **Description**: `en` / `zh` / `auto` (dsh locale → `LANG` → English)

Sensitive: no keys are stored. The compile call uses dsh's credential service
or the launching environment's `DEEPSEEK_API_KEY`.

## Permissions & data

- **Files**: writes only under `~/.dsh/deepjit/` (SQLite traces, skills, flows, log);
  reads session JSONL via `ctx.sessionPersistence` for compile drill-down.
- **Network**: LLM calls go through dsh's `ctx.llm` (DeepSeek provider); no other network access.
- **Credentials**: none stored; resolved by dsh or the environment.
- **User data**: stores compact execution traces (tool args/results, message text).
- **Tools**: flow steps run through `ctx.tools.execute` and the normal permission gates.
- **Observability**: dsh's OTel telemetry covers agent sessions only; DeepJIT keeps its
  own counters (traces flushed, compiles, LLM latency, GC/deopt/promote) and emits
  **GenAI semantic-convention spans** (`gen_ai.*`: system/model/usage tokens) for each
  LLM call. Read counters via `deepjit_status {action:"metrics"}`; spans export via
  [dsh-o11y-plugin](https://github.com/fly3366/dsh-o11y-plugin) when present.

## Troubleshooting

- Log: `~/.dsh/deepjit/deepjit.log`. Database: `~/.dsh/deepjit/deepjit.db`.
- `MISSING_CREDENTIAL` → export `DEEPSEEK_API_KEY` or store it in dsh's Models page.
- `TRANSPORT`/`NO_ADAPTER` on compile → usually a transient LLM call failure; deepjit retries and falls back to the next cycle.
- Roll back: `dsh plugin --profile  remove deepjit`, then `rm -rf ~/.dsh/deepjit`.

## Development

```sh
npm install && npm test     # node:test, run natively via Node type stripping
npm run typecheck && npm run build
```

See [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md).