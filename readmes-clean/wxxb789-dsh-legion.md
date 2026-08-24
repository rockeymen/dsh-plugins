# dsh-legion: Multi-Agent Orchestration and LLM Model Routing for DeepSeek Harness

**dsh-legion** is a TypeScript multi-agent orchestration plugin for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness). It turns one AI coding agent into a bounded agent team: configurable AI agent Profiles, an exact LLM model router, declarative Teams and Strategies, structured results, and depth-limited subagent delegation — without replacing the DSH runtime.

## TL;DR

- **What it is.** A DeepSeek Harness plugin for multi-agent delegation policy — not a standalone agent framework.
- **What it adds.** One model-facing `legion` tool whose choices are semantic Profiles such as `quick`, `deep`, and `review`. Each Profile carries a deployment-owned model route, subagent backend, persona, tool filter, depth, and result contract.
- **Why it helps.** The coordinating agent picks intent instead of model IDs, a prompt can never widen the policy behind a Profile, and changing the model behind `deep` rewrites no prompts.
- **What it costs.** One configuration row in a user-owned agent preset. No extra scheduler, session store, database, or agent runtime.
- **Who it is for.** Developers and deployment owners already running DSH who want reviewable, reusable multi-agent delegation.

> **Important:** Legion is a DSH plugin, not a standalone agent framework or application. DeepSeek Harness supplies the Agent, Session, model adapters, subagent runtime, sandbox, approvals, and Web GUI.

## Quick start

~~~bash
# 1. Install the plugin into a DSH host profile (append #<commit-sha> to pin a revision)
dsh plugin --profile web add github:wxxb789/dsh-legion

# 2. Copy the Legion row into a user-owned agent preset, then start a NEW session
#    template: examples/legion.agent.cordis.fragment.yml

# 3. Validate the routing policy before you depend on it
dsh-legion doctor examples/legion.config.yml --providers examples/providers.fixture.yml
~~~

The coordinator now sees one `legion` tool whose `profile` values are your semantic delegation choices. Step-by-step instructions are in [Install](#install) and [Set up a Legion agent preset](#set-up-a-legion-agent-preset).

## What is dsh-legion used for?

Legion is useful when one AI coding agent should delegate different kinds of work under explicit, reusable policy.

- **Route work by task type.** Send extraction or summaries to a fast model and architecture or debugging to a deeper model.
- **Run independent reviews.** Give a reviewer read-only tools, a separate persona, and a structured `review-v1` result.
- **Build multi-agent workflows.** Define bounded Teams and declarative plan/execute/review or research fanout Strategies.
- **Bound workload and risk.** Limit depth, concurrency, participants, deadlines, output size, tools, and eligible routes. These bounds constrain cost drivers, but Legion does not provide aggregate token or monetary-cost admission.
- **Standardize delegation.** Keep semantic Profile names stable when the underlying model or backend changes.
- **Validate policy before runtime.** Diagnose configuration against explicit provider capability fixtures.
- **Customize without forking.** Add, replace, disable, or revive Profiles, Teams, and Strategies through Catalog Layers.

Legion is for developers and deployment owners who already use DSH and want configurable multi-agent delegation without adopting another scheduler, session store, or agent runtime.

## dsh-legion vs standalone multi-agent frameworks

Standalone multi-agent frameworks such as LangGraph, CrewAI, and AutoGen ship their own runtime, state model, and process lifecycle, so adopting one places a second orchestrator beside the coding agent you already run. Legion takes the opposite approach: it adds no runtime at all and compiles delegation policy down to native DSH subagents.

###  · dsh-legion · A standalone agent framework
- What you adopt · **dsh-legion**: Delegation policy for an agent you already run · **A standalone agent framework**: A second runtime, state model, and process lifecycle
- Who owns the agent loop · **dsh-legion**: DeepSeek Harness · **A standalone agent framework**: The framework
- Sessions, sandbox, approvals, model adapters · **dsh-legion**: DSH-owned and unchanged · **A standalone agent framework**: Framework-owned, parallel to your agent's
- Model selection · **dsh-legion**: Ordered exact provider/model Route Candidates per Profile · **A standalone agent framework**: Usually wired per node or per agent in code
- Cost to adopt · **dsh-legion**: One configuration row in a user-owned preset · **A standalone agent framework**: A new dependency tree, service, or process
- Prompt authority · **dsh-legion**: A prompt selects a Profile and can never widen that Profile's model, tools, persona, or depth · **A standalone agent framework**: Varies by framework
- Wrong tool when · **dsh-legion**: You do not run DSH · **A standalone agent framework**: You want one self-contained orchestrator

If you are not running DeepSeek Harness, Legion is not the right tool, and a standalone framework is the better fit.

## Capabilities

### Capability · What it provides
- **Capability**: Semantic Profiles · **What it provides**: Named policies such as `quick`, `deep`, and `review` instead of raw model choices in every prompt.
- **Capability**: Exact model routing · **What it provides**: Up to eight ordered provider/model candidates with static context and output-budget constraints.
- **Capability**: Multiple backends · **What it provides**: Use `spawn`, `fork`, `codex`, `claude-code`, or another DSH-registered subagent provider per Profile.
- **Capability**: Tool and persona policy · **What it provides**: Restrict child tools, add Profile instructions, set depth, and choose foreground/background defaults.
- **Capability**: Structured results · **What it provides**: Versioned `text`, `findings-v1`, and `review-v1` foreground result contracts.
- **Capability**: Custom Teams · **What it provides**: Declare bounded Member Slots that reference existing Profiles.
- **Capability**: Declarative Strategies · **What it provides**: Compile typed artifact graphs to frozen DSH delegation primitives.
- **Capability**: Hard limits · **What it provides**: Bound agents, concurrency, deadline, and accepted output size for each Team Run.
- **Capability**: Catalog customization · **What it provides**: Layer, replace, disable, and restore user or third-party catalog entries.
- **Capability**: Prompt Fragments · **What it provides**: Load confined, immutable UTF-8 prompt resources from deployment-owned roots.
- **Capability**: Explainable policy · **What it provides**: Stable digests, deterministic diagnostics, route evidence, and JSON explain output.
- **Capability**: Live reconfiguration · **What it provides**: Optional: when the Host mounts a settings provider, edit the same config through the `legion` namespace and republish without a restart.
- **Capability**: Web settings card · **What it provides**: A plugin card on the DSH Settings → Plugins tab, with staged edits and override badges. See [the settings card](docs/settings-card.md).
- **Capability**: ACP delegation · **What it provides**: Optional Profiles for Codex, Claude Code, oh-my-pi, Kimi Code, Grok Build, Pi, GitHub Copilot CLI, Hermes, and ZCode over DSH's ACP backend. See [ACP delegation](docs/acp-delegation.md).
- **Capability**: Native DSH lifecycle · **What it provides**: Continuations, cancellation, settlement, providers, and HMR-safe registration remain DSH-owned.

## How it works

~~~text
Catalog Layers
  ├─ Profiles   -> model routes, backend, persona, tools, result contract
  ├─ Teams      -> bounded Member Slots referencing Profiles
  └─ Strategies -> typed artifact graph + hard limits
                         │
                         ▼
                frozen DSH primitive IR
                         │
                         ▼
                 native DSH subagents
~~~

A typical model-facing Profile call is small:

~~~json
{
  "profile": "quick",
  "description": "summarize findings",
  "prompt": "Summarize the investigation and preserve source paths.",
  "run_in_background": true
}
~~~

The coordinator chooses a semantic Profile; the prompt cannot change that Profile's deployment-owned model, tools, persona, depth, or result policy.

Legion intentionally does **not** own the agent loop, sessions, persistence, model adapters, credentials, sandbox, approvals, subagent registry, or Web GUI. It uses DSH's public `ctx.subagents`, `ctx.tools`, and `ctx.systemPrompt` seams so there is only one runtime and lifecycle owner.

### Under the hood: from tool call to child agent

**Activation**, when DSH mounts the plugin on a Cordis fiber:

1. Legion validates the configuration against a strict schema that rejects unknown fields anywhere in the document.
2. Catalog Layers merge in order: a later layer replaces an earlier entry by name, a tombstone disables an inherited one, and any later definition of that name revives it.
3. Prompt Fragments referenced by Profiles are read once, under a per-Profile byte budget, and captured as an immutable snapshot with a content digest.
4. Legion observes which subagent backends and which LLM adapters the Host currently has registered.
5. Each Profile is compiled against that observation and becomes **active** only if its configured backend can actually satisfy the Profile's policy: execution mode, tool filtering, persona, depth, and structured output.
6. The delegation tool is published with a parameter schema derived from the active Profiles, and a matching routing table is contributed to the system prompt.
7. If no Profile is active, the tool is withdrawn and the guidance renders empty. The whole sequence reruns whenever backends or adapters change.

**One delegation**, between the coordinator's tool call and the returned result:

8. Arguments are validated and resolved to exactly one Profile: the one named, or the configured `defaultProfile`.
9. If that Profile declares `routes`, Legion reads each candidate's exact-model metadata and takes the first candidate in your authored order that no static fact contradicts.
10. Only static facts participate, such as context window and output budget. A candidate whose metadata cannot be read stays eligible; the call fails only when every candidate is positively ruled out.
11. Legion starts exactly one child through the Host's subagent API with the Profile's fixed policy applied, and never retries or switches routes when that child or its provider fails.
12. A background call returns a continuable child id immediately; a foreground call waits, revalidates a structured result against its contract, and rebuilds it as fresh plain data before returning.

Two properties follow from that design and are worth stating plainly. Compiled Team and Strategy IR is deep-frozen and detached: it holds no reference to your configuration objects and carries no functions. A compiled Strategy plan is also tracked by object identity in a process-wide registry, so execution accepts only a plan this process compiled — a reconstructed or deserialized copy is rejected even when its contents and digest are identical.

## Install

### Prerequisites

- A compatible [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) installation.
- `pnpm` on `PATH`; `dsh plugin` forwards package operations to pnpm.
- A DSH host profile, such as the default `web` profile.
- A configured DSH subagent provider and the LLM provider/model routes referenced by your Profiles.
- For local development: Node.js `^22.19.0 || >=24.0.0` and pnpm `11.21.0`.

### Install from GitHub

Install the default branch into the `web` profile:

~~~bash
dsh plugin --profile web add github:wxxb789/dsh-legion
~~~

Replace `web` if Legion should be available in another DSH host profile.

This resolves `main` **once, at install time**. `dsh plugin` forwards to pnpm, which records the resolved commit in the host profile's lockfile, so the installed revision does not follow later pushes until you upgrade explicitly.

#### Pin a revision

A git install runs Legion's `prepare` build on your machine, outside any sandbox the agent runs under. Append an immutable revision whenever the installed code has to stay auditable and reproducible — production profiles, shared machines, or a deployment where you review what you allow to build:

~~~bash
dsh plugin --profile web add github:wxxb789/dsh-legion#<commit-sha>
~~~

No release tag is published yet. After a version appears on [GitHub Releases](https://github.com/wxxb789/dsh-legion/releases), that release's tag is an immutable installation spec too.

Git dependencies run Legion's `prepare` build. pnpm 10+ may reject the first install until the package is explicitly allowed. Add the **exact key printed by pnpm** to `$DSH_HOME/profiles/web/pnpm-workspace.yaml`, then repeat the install:

~~~yaml
allowBuilds:
  dsh-legion: true
~~~

If pnpm prints a source-qualified key, use that exact key instead of the short name.

### Install from a local checkout

~~~bash
git clone https://github.com/wxxb789/dsh-legion.git
cd dsh-legion
pnpm install --frozen-lockfile
pnpm run build
dsh plugin --profile web add .
~~~

A local checkout needs built `lib/` artifacts, and the consequence of skipping the build has changed: because the bundle patch makes `dsh-legion` a Host loader entry, the Host's client module registry now scans it, and a missing `lib/client.js` fails Host activation loudly rather than merely leaving the card out. Run `pnpm run build` before installing a checkout. Installation still injects no process-global model tool — the delegation tool stays on the agent plane, where a preset asks for it. The bundle patch now mounts one Host-plane row, `id: legion-settings` with `role: settings`, so the `legion` settings namespace and its Web card belong to the process instead of existing only while a session using the preset is alive.

## Set up a Legion agent preset

Installing the package is only the first step. Legion must also be loaded by an agent preset.

### Recommended: extend your existing preset

1. Open the DSH Web GUI.
2. Copy the shipped `standard` preset to a user-owned preset named `legion`.
3. Append the Legion row from [the example fragment](examples/legion.agent.cordis.fragment.yml).
4. Adjust provider names, model IDs, tools, and limits for your deployment.
5. Start a **new session** with the `legion` preset.

Do not edit DSH's shipped `standard` preset directly.

### Alternative: copy the bundled preset

Copy [presets/legion](presets/legion) to `$DSH_HOME/.agent-presets/legion`. It contains a focused coding tool set and example `deep`, `quick`, and `review` Profiles.

A copied preset is a versioned template. It does not automatically inherit later DSH or Legion changes. Existing nonblank sessions also cannot change their recorded preset, so start a new session after changing composition.

## Upgrade

### GitHub installation

A branch installation re-resolves to the current `main` commit through pnpm's update command, which DSH forwards:

~~~bash
dsh plugin --profile web update dsh-legion
~~~

A pinned installation stays on its recorded revision by design. Move it by adding the new exact revision — a later release tag works the same way:

~~~bash
dsh plugin --profile web add github:wxxb789/dsh-legion#<new-commit-sha>
~~~

After upgrading:

1. Review [CHANGELOG.md](CHANGELOG.md).
2. Compare your user-owned preset with the current example; Legion never overwrites presets automatically.
3. Restart the affected DSH process. If the preset composition changed, start a new session.

### Local checkout

~~~bash
cd dsh-legion
git pull --ff-only
pnpm install --frozen-lockfile
pnpm run build
dsh plugin --profile web add .
~~~

## Uninstall

Remove Legion from every DSH host profile where it was installed:

1. Remove or disable the `name: dsh-legion` row in user-owned agent presets. Removing the package in the next step removes the bundle layer that contributes the `legion-settings` row; a row you copied by hand into a composed `cordis.yml` is yours to remove there.
2. Remove the package:

   ~~~bash
   dsh plugin --profile web remove dsh-legion
   ~~~

3. Optionally delete `$DSH_HOME/.agent-presets/legion` if that copied preset is no longer needed.
4. Restart the affected DSH process.

Package removal does not delete user-owned presets or configuration.

## Usage

### Delegate through a Profile

The coordinator sees one `legion` tool plus active Profile descriptions:

~~~json
{
  "profile": "review",
  "description": "review the authentication change",
  "prompt": "Inspect the diff for correctness and security issues. Cite files and lines.",
  "run_in_background": false
}
~~~

If `defaultProfile` is configured, `profile` may be omitted. Concurrent sibling calls use DSH's normal parallel tool execution.

### Run a Strategy

Strategies are hidden by default. A deployment must explicitly set `enableStrategies: true`. The same tool then accepts a strict Strategy request:

~~~json
{
  "kind": "strategy",
  "strategy": "independent-review",
  "objective": "Review the implementation and return evidence-backed findings.",
  "limits": { "deadlineMs": 60000 }
}
~~~

Profile and Strategy fields cannot be mixed. Invocation limits may only narrow compiled Strategy limits.

## Configuration

A minimal agent-preset row:

~~~yaml
- id: tool-legion
  name: dsh-legion
  config:
    configVersion: 2
    toolName: legion
    defaultProfile: quick
    profiles:
      quick:
        description: Fast exploration, extraction, and summaries.
        subagentProvider: spawn
        agentOptions:
          provider: your-llm-provider
          model: your-fast-model
          maxTokens: 8192
        maxDepth: 2
        defaultRunInBackground: true

      review:
        description: Independent correctness and security review.
        subagentProvider: spawn
        agentOpt