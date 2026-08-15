# Awesome DeepSeek Harness Plugins [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A curated index of plugins, starters, tools, and primary resources for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness).

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) is DeepSeek AI's open-source, plugin-first agent harness: models, tools, skills, sessions, sandboxes, filesystems, loops, orchestration, and UI can all be composed as plugins.

```mermaid
flowchart LR
  User["Developer / User"] --> Web["DSH Web UI or CLI"]
  Web --> Runtime["DeepSeek Harness runtime"]
  Runtime --> Agent["Agent loop"]
  Agent --> Model["Model provider"]
  Agent --> Tools["Tools & skills"]
  Runtime -. loads .-> Plugins["Plugins"]
  Plugins --> Tools
  Plugins --> UI["Web UI extensions"]
  Plugins --> State["Sessions, settings & services"]

  classDef core fill:#0b65c2,color:#fff,stroke:#084c94;
  classDef plugin fill:#e6f4ff,color:#083b66,stroke:#4fa3e3;
  class Runtime,Agent core;
  class Plugins,UI,State plugin;
```

## Quick Tutorial — Install DSH and Write Your First Plugin

### 1. Install and run DeepSeek Harness

Install a current [Node.js](https://nodejs.org/) release, then run:

```sh
npx @deepseek-ai/dsh web
```

Open `http://127.0.0.1:3080`. In **Settings → Models**, add a DeepSeek API key; then select a workspace before starting a session. The official [Web UI guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/index.md) explains the next steps.

### 2. Create a minimal plugin from source

Plugin development currently starts from an official DSH checkout:

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
mkdir -p scratch-plugin/src
```

Create `scratch-plugin/src/hello-plugin.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello-plugin'

export function apply(ctx: Context) {
  console.log('[hello-plugin] loaded')
}
```

Then create `scratch-plugin/cordis.yml`. Replace the path with the absolute path printed by `pwd` in the DSH checkout:

```yaml
- insert:
    - id: hello
      name: '/absolute/path/to/deepseek-harness/scratch-plugin/src/hello-plugin.ts'
```

Run the development overlay:

```sh
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

When DSH starts, the terminal should show `[hello-plugin] loaded`. This is the smallest valid DSH plugin: export `apply(ctx)` and register capabilities through the Cordis context. To add an agent-callable tool, declare `export const inject = ['tools']` and register it with the documented DSH tool API. Follow the official [first plugin](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md) and [tool-plugin](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/tool.md) tutorials for the complete, current API.

### 3. How the plugin mechanism works

```mermaid
flowchart TD
  Overlay["cordis.yml overlay"] -->|loads| Module["Plugin module"]
  Module --> Contract["name · inject · apply(ctx, config)"]
  Contract --> Inject["inject: wait for required services"]
  Contract --> Config["Config schema: validate settings and defaults"]
  Contract --> Apply["apply: register capabilities"]
  Apply --> Capabilities["Tools · commands · events · UI · services"]
  Capabilities --> Runtime["Cordis / DSH runtime"]
  Runtime --> Effects["Lifecycle-managed effects"]
  Effects --> Cleanup["Unload or HMR: registrations are cleaned up"]
```

DSH is built on **Cordis**, a runtime composition framework. A plugin is not merely an npm dependency: it is a module that DSH loads into a live context. The plugin declares a `name`, optionally declares `inject` dependencies such as `['tools']`, and exports `apply(ctx, config)`. Cordis waits until injected services are ready, validates any exported `Config` schema and defaults, then invokes `apply`.

Inside `apply`, the plugin can register a tool for the agent, a human command, a settings schema, event listeners, Web UI components, or a service for other plugins. Registrations are lifecycle-managed effects: on unload or hot replacement after a config edit, Cordis removes old registrations automatically. Use `ctx.effect()` only when your plugin owns a resource needing explicit cleanup, such as a timer or network connection. See the official [configuration guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/config.md), [service guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/framework/service.md), and [capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md).

### 4. What this awesome list includes

```mermaid
flowchart TB
  Discover["GitHub discovery\n(recent public candidates)"] --> Verify["Source-level DSH verification"]
  Verify -->|"Manifest/package + documented DSH seam"| Plugin["Verified DSH plugin"]
  Verify -->|"Explicit, inspectable DSH integration"| Resource["Client, launcher, example, or dev resource"]
  Verify -->|"Topic/name/claim only"| Exclude["Excluded\n(not a DSH plugin)"]
  Plugin --> List["Plugin categories in this list"]
  Resource --> List
  List --> Daily["Daily review\nOnly real changes are committed"]
```

The list distinguishes verified DSH plugins from useful but non-plugin resources such as launchers, clients, and ecosystem directories. See the full [inclusion policy](docs/INCLUSION_POLICY.md) for the evidence required before a new entry is added.

### 5. One runtime, different compositions

DSH profiles are plugin compositions rather than separately maintained products. The official base bundle includes model adapters, tools, persistence, sandbox and approval policy, settings, credentials, and telemetry; Web and headless bundles add different entry surfaces. An agent preset can then give a session a different capability set.

```mermaid
flowchart TB
  Base["dsh-base\nmodels · tools · persistence · sandbox\napproval · settings · telemetry"]
  Base --> WebProfile["Web profile\nbrowser application"]
  Base --> HeadlessProfile["Headless profile\none-shot runner"]
  Base --> Preset["Agent preset\nper-session capability composition"]
  Preset --> Loop["Agent loop"]
  Preset --> Toolset["Toolset"]
  Preset --> Providers["LLM / filesystem / subagent providers"]
  Preset --> Policy["Permission & sandbox policy"]
```

This makes a “mode” primarily a selected plugin graph and policy set. It does not guarantee that every composition is stable or suitable for every task; DSH is still a developer preview.

### 6. Tool calls use one guarded execution pipeline

```mermaid
flowchart LR
  Call["Model emits tool call"] --> LoggedCall["Log tool/call"]
  LoggedCall --> Pre["tools/pre-execute\nhooks · permission · sandbox"]
  Pre --> Ask{"Approval needed?"}
  Ask -->|approved| Guards["Monotonic guards"]
  Ask -->|denied / unavailable| Denied["Skip tool body"]
  Guards --> Execute["tools/execute\ntimeout · retry · metrics"]
  Execute --> Body["Tool execute()"]
  Body --> Post["tools/post-execute\naccept · block · replace"]
  Denied --> Post
  Post --> Result["Finalize & log tool/result"]
  Result --> UI["UI result card"]
  Result --> Next["Next model request"]
```

Plugins can insert policy, observability, timeout, or result-handling behavior at documented stages without editing the Agent Loop. The official pipeline also routes Code Mode's dispatched sub-calls through this same path, preserving the approval, sandbox, and logging boundaries.

### 7. Agent turns, steps, and the append-only session log

```mermaid
sequenceDiagram
  participant U as User
  participant A as Agent loop
  participant P as Prompt assembler
  participant M as Model
  participant T as Tool pipeline
  participant L as Append-only session log
  U->>A: followup(message)
  A->>L: turn/start + user/message
  A->>P: assemble prompt sections + tool schemas
  P->>M: request
  M-->>L: assistant/chunk*
  M-->>L: assistant/message
  M->>T: tool/call*
  T-->>L: tool/result*
  A->>L: step/end
  alt more input or tool results are owed
    A->>P: next step
  else no pending work
    A->>L: turn/end
  end
```

The session log is the model-context source of truth: durable events record turns, messages, tool calls/results, and raw stream chunks. Forking, resuming, replay, transcripts, telemetry, and persistence derive from that stream; model-visible content must be reconstructable from it.

### 8. Multi-agent and workflow extension points

```mermaid
flowchart TB
  Parent["Parent agent\nplans, delegates, aggregates"] --> Subagent["Subagent capability seam"]
  Subagent --> Fresh["Fresh child agent"]
  Subagent --> Fork["Forked / continued session"]
  Subagent --> External["External product provider\n(e.g. ACP-backed)"]
  Parent --> Workflow["Workflow capability"]
  Workflow --> Parallel["Parallel branches"]
  Workflow --> Pipeline["Pipeline stages"]
  Workflow --> Background["Background work"]
  Fresh --> Events["subagent/* + session/event"]
  Fork --> Events
  External --> Events
  Workflow --> Events
  Events["Durable session events + live agent events"] --> Inspect["UI, trajectory, replay, telemetry"]
```

DSH provides a hierarchy-oriented delegation surface and workflow components; providers behind the subagent seam can vary. The key architectural point is replaceability and shared observability, not a claim that DSH has invented a new multi-agent paradigm.

## Start Here — Official DSH Resources

- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) - Official source repository; the primary reference for releases, issues, and compatibility.
- [Documentation guide](https://deepseek-harness.github.io/deepseek-harness/guide) - Official documentation portal supplied by the DSH project.
- [Run DSH](https://github.com/deepseek-ai/deepseek-harness#run) - Start the local Web UI with `npx @deepseek-ai/dsh web`.
- [Architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) - How the plugin-first DSH runtime is structured.
- [Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md) - Extension boundaries for DSH capabilities.
- [Cordis primer](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md) - Introduction to the underlying composability framework.
- [Development guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/development.md) - Build DSH from source and contribute upstream.
- [Defensive patterns](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/defensive-patterns.md) - Official guidance for safer extensions.
- [Testing](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/testing.md) - DSH testing approaches.
- [Examples](https://github.com/deepseek-ai/deepseek-harness/tree/master/examples) - Official headless, JSON-RPC, MCP-memory, scheduled-web, and Cordis examples.
- [DeepSeek Harness Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions) - Official feedback and community forum.
- [DeepSeek Harness Discord](https://discord.gg/UZ7VEPkDUn) - Community chat linked by the official repository.

## Install and Discover Plugins

- [GitHub topic: `dsh-plugin`](https://github.com/topics/dsh-plugin) - The official recommended GitHub topic for DSH plugin repositories.
- [Plugin registry](https://github.com/vlln/plugin-registry) - A lightweight repository-plugin console and `make-dsh-plugin` development guide.
- [Plugin workshop](https://github.com/omdsh-dev/dsh-hub-workshop) - Community plugin-marketplace and registry workshop.

### Curation policy

The `dsh-plugin` topic, a `dsh-` repository name, or a README claim alone is **not enough** for an entry in this list. Every new plugin must meet the source-level verification policy in [INCLUSION_POLICY.md](docs/INCLUSION_POLICY.md): a real DSH plugin manifest/package or a verifiable, official DSH extension seam. Discovery runs daily over projects from the previous 48 hours; candidates also undergo static security triage of scripts, dependencies, entrypoints, workflows, and sensitive operations. Only candidates that pass both checks are added. This is not a complete security audit or a compatibility guarantee.

## Productivity & Agent Workflow

- [dsh-worktree](https://github.com/FlashingChen/dsh-worktree) - Permanent Codex-style Git worktrees, agent tools, `/worktree`, and per-repository manifests.
- [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) - Codex-style `@file` mentions that search a workspace and attach file contents to prompts.
- [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) - Open a DSH workspace directly in VS Code from the Web UI.
- [dsh-plannotator](https://github.com/titanwings/dsh-plannotator) - Anchored plan annotations and structured agent feedback.
- [dsh-daily-progress](https://github.com/omdsh-dev/dsh-daily-progress) - Daily-progress workflow plugin.
- [dsh-revive](https://github.com/omdsh-dev/dsh-revive) - Resume interrupted sessions with a command, tool, and browser control.
- [dsh-book2skill](https://github.com/omdsh-dev/dsh-book2skill) - Five-stage book-to-skill workflow with human approval gates.
- [dsh-loop](https://github.com/vlln/dsh-loop) - Scheduled loops with a `/loop` command, tool, and activity bar.
- [dsh-automation](https://github.com/titanwings/dsh-automation) - Run coding tasks in fresh agent sessions on a schedule.
- [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) - AgentTeams integration for DSH.
- [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) - Cross-instance message and event handoff service plus tools.
- [dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) - Restore conversation and workspace state through a persistent change ledger.
- [dsh-undo](https://github.com/LingLambda/dsh-undo) - Context undo/redo around the last completed agent step.
- [dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) - OpenBiliClaw client integration with recommendation and agent-bridge tools.
- [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) - Import full-fidelity conversation histories from 13 coding agents (Claude Code / Codex / ChatGPT / Cursor / Gemini / Reasonix / opencode / ZCode / Grok Build / OpenClaw / Pi / Hermes / Kimi) as resumable DeepSeek Harness sessions, with reverse export/sync back to Claude Code.

## Context, Memory & Observability

- [dsh-compaction-instant](https://github.com/KitDoesIt/dsh-compaction-instant) - Offline, deterministic replacement for DSH's basic compaction seam, with recall tools for the append-only session log.
- [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) - Per-session and daily API cost, budget, and official-balance tracking for the DSH Web UI, with a history dashboard and one-click official price sync (built against the current dsh web bundle).
- [dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) - Cross-session memory, branch awareness, session search, and self-evolving skills.
- [Nowledge Mem for DSH](https://github.com/nowledge-co/nowledge-mem-deepseek-harness) - Community memory-plugin bundle built around Nowledge Mem.
- [dsh-session-search](https://github.com/Tieboyh/dsh-session-search) - Index-free cross-agent session search.
- [dsh-session-health](https://github.com/omdsh-dev/dsh-session-health) - Read-only diagnostics for multi-frame zstd session files.
- [dsh-postmortem](https://github.com/zzh-newlearner/dsh-postmortem) - Local-first failure postmortems for DSH sessions.
- [dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) - Audit instruction, skill, and tool-schema token cost, duplication, and conflicts.
- [dsh-trace](https://github.com/vibeinging/dsh-trace) - Export DSH turns, model steps, and tool calls to yiTrace over HTTP.
- [dsh-sentinel](https://github.com/fuhefei/dsh-sentinel) - Durable file, command, HTTP, process, and webhook watches that wake an agent.
- [dsh-explain](https://github.com/yuezengwu/dsh-explain) - Local-first learning mode with global learning threads and explainable context.
- [dsh-telemetry-redactor](https://github.com/030611/dsh-telemetry-redactor) - Redacts supported secret patterns from the exported `session-telemetry/record` copy without changing the canonical session log; audited against DSH commit `47f943859bef60e4160492346772ded9b24f765a` and tested with `dsh-session-telemetry` rc.6.
- [dsh-verification-receipt](https://github.com/030611/dsh-verification-receipt) - Writes local JSONL summaries of per-turn tool outcomes and heuristic verification signals without storing prompts, tool arguments, or result text; audited against DSH commit `47f943859bef60e4160492346772ded9b24f765a` and tested with `dsh-session` rc.6.

## Tools, Integrations & Automation
- [dhicoc/dsh-reverse-skill](https://github.com/dhicoc/dsh-reverse-skill) - Complete reverse-skill pack (85 SKILL.md) as a DeepSeek Harness Cordis plugin: reverse engineering, authorized pentesting and security-research skill router.

- [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) - Create and manage sandboxed JavaScript tools with a Monaco-based editor.
- [dsh-tool-search](https://github.com/vibeinging/dsh-tool-search) - On-demand tool discovery and progressive schema disclosure.
- [dsh-ssh](https://github.com/UynajGI/dsh-ssh) - Remote execution, SFTP filesystem, ProxyJump, subprocess, and PTY support over SSH.
- [dsh-openmaic](https://github.com/THU-MAIC/dsh-openmaic) - OpenMAIC classrooms, slides, interactive widgets, and Socratic teaching.
- [dsh-deep-research](https://github.com/omdsh-dev/dsh-deep-research) - Adaptive deep-research orchestration workflow.
- [dsh-openai-codex-auth](https://github.com/yoke233/dsh-openai-codex-auth) - OpenAI Codex OAuth login and usage-card integration.
- [dsh-plugin-claude-bridg