◯ ─────────── ◯
  
  ![Ouroboros](./docs/images/ouroboros.png)
  
  O U R O B O R O S
  
  ◯ ─────────── ◯
  

  It gets smarter on its own. We just hold the line.
  
  <sub>Skip the prompt engineering. The agent runs, fails, and gets smarter every generation. The grading command and expected result never make it into the success contract we hand it.</sub>
  
  <sub>The Agent OS for replayable AI coding workflows</sub>

```bash
curl -fsSL https://raw.githubusercontent.com/Q00/ouroboros/main/scripts/install.sh | OUROBOROS_INSTALL_REF=readme-hero bash
```

<sub>One command installs it. Then run `ooo setup` once inside your coding agent — details in [Quick Start](#quick-start).</sub>

<sub>Four separate runs, four hosts. Different tasks on purpose — the engine is what is shared, not the prompt</sub>

![Terminal recording of the ouroboros CLI interview reporting an ambiguity score](./docs/images/ooo-interview.gif)<sub>Terminal CLI — a task-management CLI: `ouroboros init start` asking about ordering and scope, then reporting an ambiguity score</sub>
![Screen recording of the ChatGPT app calling Ouroboros as an integration](./docs/images/host-codex.gif)<sub>ChatGPT (Codex) — called as an integration, on a video-publishing harness: the interview, its advisory lanes, and the ambiguity ledger</sub>

![Screen recording of Claude Code running six Ouroboros interview advisory lanes in parallel](./docs/images/host-claude.gif)<sub>Claude Code — a YouTube automation task, with the six advisory lanes running in parallel before the interview submits</sub>
![Screen recording of a Discord bot running the Ouroboros interview and reporting a final ambiguity of 0.15](./docs/images/host-hermes.gif)<sub>Hermes (Discord) — a kart-racing game, run as a chat bot, ending at `Final ambiguity: 0.15`</sub>

**Turn a vague idea into a verified, working codebase -- across Claude Code, Codex CLI, OpenCode, Hermes, Gemini, Kiro, Copilot, Pi, Zcode, Goose, GJC, Antigravity, and Grok.**

Ouroboros is an **Agent OS** for AI coding: a local-first runtime layer that
turns non-deterministic agent work into a replayable, observable, policy-bound
execution contract. It replaces ad-hoc prompting with a structured
specification-first workflow: interview, crystallize, execute, evaluate,
evolve.

## The Ouroboros Agent OS Stack

Like any OS, Ouroboros is split into a stable **OS layer** of primitives, an
**application layer** of domain workflows, and a **shell** that humans actually
sit in front of. Three repos, one stack:

### Layer · Repo · Role · What it gives you
- **Layer**: **Shell** (terminal client) · **Repo**: [`Ouro-labs/ourocode`](https://github.com/Ouro-labs/ourocode) · **Role**: Native terminal UI for running `ooo` workflows across Claude / Codex / Gemini CLIs in one session · **What it gives you**: TUI, wonderTool decision pickers, MCP pane state, command discovery
- **Layer**: **Apps** (domain workflows) · **Repo**: [`Ouro-labs/ouroboros-plugins`](https://github.com/Ouro-labs/ouroboros-plugins) · **Role**: UserLevel plugin contract — composes core primitives into installable domain programs (PR ops, Jira sync, incidents, releases) · **What it gives you**: Plugin manifest, scoped permissions, audit/provenance, reference plugins
- **Layer**: **OS** (this repo) · **Repo**: [`Q00/ouroboros`](https://github.com/Q00/ouroboros) · **Role**: Agent OS core — Seed, Ledger, Runtime, MCP, safety boundaries · **What it gives you**: `ooo` commands, spec-first workflow engine, multi-runtime adapter

**How they connect:**

```
  ourocode  ──►  ooo / ouroboros-plugins  ──►  ouroboros core (Seed · Ledger · MCP · Runtime)
   shell             user-level apps                        kernel
```

- The **kernel** (`ouroboros`) owns the contract: every action becomes a
  Seed-bound, ledger-recorded, replayable event — regardless of which LLM
  executes it.
- **Plugins** (`ouroboros-plugins`) declare scoped capabilities against that
  contract, so domain workflows (review a PR, triage a Linear ticket, run a
  release) stay auditable and policy-bound instead of being one-off prompts.
- **Ourocode** is the terminal shell: it surfaces MCP state, interview
  questions, and wonderTool decisions as first-class TUI elements, so you can
  drive the OS without leaving the keyboard or switching between CLIs.

Use `ouroboros` alone with any supported CLI, layer plugins on for domain
workflows, or install `ourocode` when you want a unified terminal cockpit.

> **Disclaimer.** The Ouroboros project and community are **not affiliated with
> any cryptocurrency, token, memecoin, or trading community** — including, but
> not limited to, any "ouroboros" tickers on pump.fun or other launchpads. This
> is an open-source developer tool. We do not issue, endorse, or hold any
> coins. Any token claiming association with this project is unauthorized.

> **Naming note.** A separate, unaffiliated open-source project also uses the
> name "Ouroboros" — Anton Razzhigaev's self-modifying, autonomous-memory agent
> at `github.com/razzant/ouroboros`. No shared code, no relationship. This
> project locks a specification before executing rather than rewriting its own
> architecture; if you're looking for the latter, that's the other one.

## Why Ouroboros?

Most AI coding fails at the **input**, not the output. The bottleneck is not AI capability -- it is human clarity.

### Problem · What Happens · Ouroboros Fix
- **Problem**: Vague prompts · **What Happens**: AI guesses, you rework · **Ouroboros Fix**: Socratic interview exposes hidden assumptions
- **Problem**: No spec · **What Happens**: Architecture drifts mid-build · **Ouroboros Fix**: Immutable seed spec locks intent before code
- **Problem**: Manual QA · **What Happens**: "Looks good" is not verification · **Ouroboros Fix**: 3-stage automated evaluation gate

## Quick Start

**Install** — one command, everything auto-detected:

```bash
curl -fsSL https://raw.githubusercontent.com/Q00/ouroboros/main/scripts/install.sh | OUROBOROS_INSTALL_REF=readme bash
```

**First command** — open your AI coding agent and run these in order:

```
> ooo setup
> ooo interview "I want to build a task management CLI"
```

`ooo setup` is a one-time configuration step. `ooo interview` is the first
workflow command and starts the Socratic interview. After setup, Codex follows
its currently selected model and Claude Code starts with its recommended model
settings. Choose **Directly configure models** only when you want to pin a
stage to a specific model; it opens the local settings screen in your browser.
You can return to those settings any time with `ooo config`.

Or from a plain terminal, without an agent host:

```
$ ouroboros init start --orchestrator "I want to build a task management CLI tool"
```

  <sub>That recording is this exact command. It is at the top of this page so you can see the tool before installing it.</sub>

  ![Terminal recording of ouroboros setup refresh installing Codex rules and skills, Hermes skills, the OpenCode plugin and instruction guide, and the Pi and GJC bridges, ending with the line Refreshed runtime artifacts: codex, hermes, opencode, pi, gjc](./docs/images/ooo-setup-refresh.gif)

  <sub>`ouroboros setup refresh` on one machine. It installs into the hosts that machine actually has, each in the shape that host expects: rules and skills for Codex, skills for Hermes, a plugin and an `AGENTS.md` for OpenCode, bridges for Pi and GJC. Your machine will show whichever of the thirteen you have installed.</sub>

> Works with Claude Code, Codex CLI, GitHub Copilot CLI, OpenCode, Hermes, Gemini, Kiro CLI, Pi CLI, Zcode, Goose, GJC, Antigravity CLI, and Grok Build CLI. The installer detects available runtimes and registers the MCP server where the host supports it. For explicit selection, run `ouroboros setup --runtime <opencode|kiro|copilot|gemini|pi|zcode|goose|gjc|antigravity|grok>` after installation. The Copilot CLI runtime live-discovers its model catalog via the GitHub Copilot models API and lets you pick a default during setup.

> **DeepSeek support.** Ouroboros speaks DeepSeek two ways. Point the interview/Seed/QA pipeline at DeepSeek's own models with `--llm-backend dsh` (`ouroboros mcp serve --llm-backend dsh`, or `OUROBOROS_LLM_BACKEND=dsh`) — this drives [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)'s ACP server under the hood. Or go the other way: mount the Ouroboros MCP server straight into a DeepSeek Harness `cordis.yml` (`@deepseek-ai/dsh-mcp-client`) and type `ooo interview` / `ooo auto` directly in the DeepSeek Harness chat — the same `ouroboros_interview` / `ouroboros_auto` tools run natively inside it, Socratic questions and all.

Codex plugin quick start

Needs `codex` on your `PATH` and `uvx` on the host (the plugin's MCP descriptor
launches the server with it). Install uv with `pipx install uv`,
`pip install --user uv`, or `brew install uv`.

```bash
codex plugin marketplace add Q00/ouroboros
codex plugin add ouroboros@ouroboros
```

Start a new Codex session, then run these commands in order:

```
ooo setup
ooo interview "Build a task management CLI"
```

`ooo setup` is the one-time runtime preparation. Once ready, Ouroboros follows
Codex's current default model; choose **Directly configure models** only when
you want to pin a specific model for a pipeline stage.

Kiro CLI quick start

```bash
pipx install 'ouroboros-ai[mcp]'       # or: uv tool install 'ouroboros-ai[mcp]'
ouroboros setup --runtime kiro         # detects Kiro CLI, registers MCP server, and
                                        # writes OUROBOROS_RUNTIME=kiro into
                                        # ~/.kiro/settings/mcp.json (the trusted,
                                        # setup-managed location -- a project .env
                                        # is untrusted input and this key is ignored there)
```

Then use `ooo` commands inside a Kiro CLI session.

GitHub Copilot CLI quick start

```bash
gh auth login                                # one-time GitHub auth (used for live model discovery)
pipx install 'ouroboros-ai[mcp]'             # or: uv tool install 'ouroboros-ai[mcp]'
ouroboros setup --runtime copilot            # discovers models live, picks a default,
                                             # registers MCP server in ~/.copilot/mcp-config.json
```

Restart your Copilot CLI session, then use `ooo` commands inside it. Model-ID mapping is narrower than it looks: the static map covers `claude-opus-4-6` and `claude-sonnet-4-5`, any ID already containing a `.` passes through unchanged, and the hyphen-to-dot fallback rewrites *every* hyphen, so the current default `claude-opus-4-8` becomes `claude.opus.4.8` and misses. Leave role models unset so setup writes a discovered ID, or set a Copilot-valid dotted ID explicitly. See [#1995](https://github.com/Q00/ouroboros/issues/1995) and the [Copilot runtime guide](./docs/runtime-guides/copilot.md).

See the [GitHub Copilot CLI runtime guide](./docs/runtime-guides/copilot.md) for full details.

Other install methods

**Claude Code plugin only** (no Python package or global Python to install; the
host needs uv, which provides both `uvx` for the MCP server and the skills'
Python >= 3.12 fallback):
```bash
claude plugin marketplace add Q00/ouroboros && claude plugin install ouroboros@ouroboros
```
Then run `ooo setup` inside a Claude Code session.

**pip / uv / pipx**:
```bash
pip install ouroboros-ai                # base
pip install 'ouroboros-ai[claude]'        # + default Claude Agent SDK profile (MCP 1.x)
pip install 'ouroboros-ai[claude-cli]'    # + dependency-free Claude CLI worker profile
pip install 'ouroboros-ai[claude-sdk]'    # + explicit alias for the Claude SDK profile
pip install 'ouroboros-ai[litellm]'       # + LiteLLM multi-provider; Python 3.12-3.13
pip install 'ouroboros-ai[mcp]'           # + MCP server/client support
pip install 'ouroboros-ai[tui]'           # + Textual terminal UI
pip install 'ouroboros-ai[all]'           # MCP 1.x app bundle; excludes the MCP 2 server
ouroboros setup                         # configure runtime
```

Core and non-LiteLLM installs support Python 3.12-3.14. LiteLLM-bearing installs (`[litellm]`, `[all]`, and source `--extra all`) support Python 3.12-3.13; use Python 3.13 for current examples. See [Platform Support](./docs/platform-support.md#python-profile-matrix).

`[claude]` preserves the in-process Agent SDK and its MCP 1.x dependency graph;
`[claude-sdk]` is its explicit alias. The MCP 2 server runs from a separate
`[mcp]` environment and selects the `[claude-cli]` subprocess worker when
Claude is the host. Never install `[mcp,claude]`, `[mcp,claude-sdk]`, or
`[all,mcp]` in one interpreter. See the [package compatibility and migration matrix](./docs/platform-support.md#mcp-2-and-claude-package-profiles).

`pip install 'ouroboros-ai[mcp]'` is valid for embedding the MCP client/server library in an already isolated Python environment, but host registration requires `uvx --isolated --python '>=3.12'` or `pipx`. Use `pipx install 'ouroboros-ai[mcp]'` or `uv tool install 'ouroboros-ai[mcp]'` before `ouroboros setup --runtime <kiro|copilot|hermes>`; setup exits without changing runtime configuration when neither isolated launcher is available.

Legacy compatibility: `ouroboros-ai[dashboard]` is still accepted as a compatibility alias/no-op; it does not install dashboard runtime payload. `ouroboros-ai[all]` includes that no-op alias only for compatibility.

**Homebrew (macOS/Linux)**:
```bash
brew tap q00/tap
brew install ouroboros-ai
ouroboros setup                         # configure runtime
```
Self-hosted tap, not yet in homebrew-core. Installs the same package published to PyPI.

See runtime guides: [Claude Code](./docs/runtime-guides/claude-code.md) · [Codex CLI](./docs/runtime-guides/codex.md) · [Hermes](./docs/runtime-guides/hermes.md) · [OpenCode](./docs/runtime-guides/opencode.md) · [Kiro CLI](./docs/runtime-guides/kiro.md) · [Gemini CLI](./docs/runtime-guides/gemini.md) · [GitHub Copilot CLI](./docs/runtime-guides/copilot.md) · [Zcode](./docs/runtime-guides/zcode.md) · [Pi JSON mode](https://pi.dev/docs/latest/json) · [Goose](./docs/runtime-guides/goose.md) · [GJC](./docs/runtime-guides/gjc.md) · [Antigravity CLI](./docs/runtime-guides/antigravity.md) · [Grok Build CLI](./docs/runtime-guides/grok.md)

Uninstall

```bash
ouroboros uninstall
```

Removes all configuration, MCP registration, and data. See [UNINSTALL.md](./UNINSTALL.md) for details.

> **Python >= 3.12 required.** LiteLLM-bearing profiles support Python 3.12-3.13. See [Platform Support](./docs/platform-support.md#python-profile-matrix) and [pyproject.toml](./pyproject.toml).
>
> **Installing as an MCP server: use 0.51.1 or later.** Earlier versions can fail at startup with `Failed to reconnect to plugin:ouroboros:ouroboros: -32000` when an existing environment shadows the `[mcp]` profile ([#2012](https://github.com/Q00/ouroboros/issues/2012)). This matters if you install through a downstream package rather than PyPI, since those can lag.

  <sub>Most people find out they were unclear about three files into the review.
  If that feels familiar, star [Q00/ouroboros on GitHub](https://github.com/Q00/ouroboros) so the next person it could save can find it.</sub>

## What You Get

After one loop of the Ouroboros cycle, a vague idea becomes a verified codebase:

### Step · Before · After
- **Step**: **Interview** · **Before**: *"Build me a task CLI"* · **After**: 12 hidden assumptions exposed, ambiguity scored to 0.19
- **Step**: **Seed** · **Before**: No spec · **After**: Immutable specification with acceptance criteria, ontology, constraints
- **Step**: **Evaluate** · **Before**: Manual review · **After**: 3-stage gate: Mechanical (free) -> Semantic -> Multi-Model Consensus

What just happened?

```
interview  ->  Socratic questioning exposed 12 hidden assumptions
seed       ->  Crystallized answers into an immutable spec (Ambiguity: 0.15)
run        ->  Executed via Double Diamond decomposition
evaluate   ->  3-stage verification: Mechanical -> Semantic -> Consensus
```

> Use `ooo <cmd>` inside your AI coding agent session, or `ouroboros init start`, `ouroboros run seed.yaml`, etc. from the terminal.

The serpent completed one loop. Each loop, it knows more than the last.

## How It Compares

AI coding tools are powerful -- but they solve the **wrong problem** when the input is unclear.

###  · Vanilla AI Coding · Ouroboros
- **Vague prompt** · **Vanilla AI Coding**: AI guesses intent, builds on assumptions · **Ouroboros**: Socratic interview forces clarity *before* code
- **Spec validation** · **Vanilla AI Coding**: No spec -- architecture drifts mid-build · **Ouroboros**: Immutable seed spec locks intent; ambiguity gate (<= 0.2) blocks premature code without explicit `force`
- **Evaluation** · **Vanilla AI Coding**: "Looks good" / manual QA · **Ouroboros**: 3-stage automated gate: Mechanical -> Semantic -> Multi-Model Consensus
- **Rework rate** · **Vanilla AI Coding**: High -- wrong assumptions surface late · **Ouroboros**: Low -- assumptions surface in the interview, not in the PR review

## The Loop

The ouroboros -- a serpent devouring its own tail -- is not decoration. It IS the architecture:

```
    Interview -> Seed -> Execute -> Evaluate
        ^                           |
        +---- Evolutionary Loop ----+
```

Each cycle does not repeat -- it **evolves**. The output of evaluation feeds back as input for the next generation, until the system truly knows what it is building.

### Phase · What Happens
- **Phase**: **Interview** · **What Happens**: Socratic questioning exposes hidden assumptions
- **Phase**: **Seed** · **What Happens**: Answers crystallize into an immutable specification
- **Phase**: **Execute** · **What Happens**: Double Diamond: Discover -> Define -> Design -> Deliver
- **Phase**: **Evaluate** · **What Happens**: 3-stage gate: Mechanical ($0) -> Sem