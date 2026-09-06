![AgentDebugX logo](docs/assets/logo.png)

# AgentDebugX

**A local-first debugging framework for agentic AI systems: diagnose failures, attribute root causes, recover with evidence, and validate fixes through reruns.**

AgentDebugX turns failed agent runs into structured, auditable debugging
artifacts. It ingests a live or exported trajectory, detects visible failure
signals, attributes them to responsible steps or agents, proposes recovery
actions, and prepares controlled reruns so fixes can be validated instead of
guessed.

The project is designed for researchers and engineers building complex LLM
agents: multi-agent systems, tool-using agents, computer-use agents, benchmark
runners, and local agent development workflows. AgentDebugX is local-first by
default: traces stay on your machine, sharing is opt-in, and recovery proposals
carry explicit policy and approval metadata into the Rerun boundary.

## 📰 News

- 🔌 **2026-08-25** — Released
  [`dsh-agentdebugx` v0.1.0](https://www.npmjs.com/package/dsh-agentdebugx),
  the AgentDebugX plugin for DeepSeek Harness.
- 📄 **2026-07-31** — Released
  [CUADebug](https://arxiv.org/abs/2608.02643), our framework for diagnosing
  and repairing computer-use agent failures.
- 📄 **2026-07-21** — Released the
  [AgentDebugX paper](https://arxiv.org/abs/2607.18754), presenting our
  open-source toolkit for failure observability, attribution, recovery, and
  rerun in LLM agents.
- 📦 **2026-05-16** — Released AgentDebugX on
  [PyPI](https://pypi.org/project/agentdebugx/).
- 📄 **2025-09-29** — Released
  [Where LLM Agents Fail and How They Can Learn From Failures](https://arxiv.org/abs/2509.25370),
  introducing AgentErrorTaxonomy, AgentErrorBench, and AgentDebug.

## System Overview

  ![AgentDebugX system overview](docs/assets/overview.png)

AgentDebugX follows the two-stage loop used by the project paper:

```text
Diagnose = Detect -> Attribute -> Recover
Rerun    = checkpoint -> retry directive -> branch execution -> evaluation
```

`Diagnose` explains what failed and why. `Rerun` tests whether the proposed
recovery actually improves the agent behavior.

## Why AgentDebugX

Tracing tools show what happened. AgentDebugX focuses on the debugging step that
usually comes next:

- Which earlier decision caused the visible failure?
- Which agent, tool call, memory read, handoff, or GUI action was responsible?
- What evidence supports that diagnosis?
- What concrete recovery should be tried?
- Did the rerun branch improve the outcome?

The output is a portable diagnostic report that can be inspected in a local UI,
used by a CLI workflow, stored in an Error Hub bundle, or invoked from an
agentic skill.

## Core Capabilities

- **Portable trace schema**: framework-agnostic trajectory, event, finding, and
  diagnostic report models.
- **Ingest adapters**: normalize raw JSON, LangGraph, CrewAI, OpenAI Agents SDK,
  OpenTelemetry, GAIA/Open Deep Research, OSWorld, and other exported traces.
- **Detect**: deterministic analyzers, manifest-backed rule packs, LLM judge
  mode, GUI-aware signals, and taxonomy induction support.
- **Attribute**: heuristic attribution, all-at-once analysis, step-by-step
  localization, binary search, counterfactual attribution, MOE localization,
  and DeepDebug.
- **Recover**: Reflexion, CRITIC, Self-Refine, AutoManual, DeepDebug recovery,
  and saga rollback style strategies.
- **Rerun**: three explicit modes for plan/export only, labeled simulation, or
  observed execution in an application-owned process or persistent HTTP runner.
- **Local inspection UI**: no-build FastAPI dashboard for traces, reports,
  before/after CUA visuals, debugger discussions, saved cases, debug branches,
  and rerun-from-event workflows.
- **Error Hub**: scrubbed, shareable failure bundles for regression tests,
  benchmark corpora, and team debugging memory.
- **Agent integrations**: generate host-runtime assets such as debugging skills
  for external agent tools.

## Install

```bash
pip install agentdebugx
```

Optional extras:

```bash
pip install "agentdebugx[ui]"             # local FastAPI dashboard
pip install "agentdebugx[langgraph]"      # LangGraph adapter
pip install "agentdebugx[crewai]"         # CrewAI adapter
pip install "agentdebugx[openai-agents]"  # OpenAI Agents SDK adapter
pip install "agentdebugx[otel]"           # OpenTelemetry ingest
pip install "agentdebugx[gui]"            # screenshot decoding for GUI RCA
pip install "agentdebugx[all]"            # all optional integrations
```

Computer-use / OSWorld GUI root-cause analysis (`agentdebug.gui`) ships with the
core install and needs no extra. The `gui` extra only adds `pillow`, which the
RCA tools use to decode screenshots. Two heavier layers of the same package sit
behind their own extras: `gui-memory` for the lesson/episodic memory stack, and
`gui-app` for the provider adapters, the batch pipeline (`python -m
agentdebug.gui`) and the Streamlit annotation app.

The package is installed as `agentdebugx` and imported as `agentdebug`:

```python
import agentdebug
```

## DeepSeek Harness Plugin

AgentDebugX is also available as the
[`dsh-agentdebugx`](https://www.npmjs.com/package/dsh-agentdebugx) plugin for
DeepSeek Harness. It diagnoses current and saved Harness trajectories and
starts the Python bridge and local dashboard only when they are needed.

```bash
pip install "agentdebugx[ui]>=0.3.1,<0.4"
dsh plugin --profile web add dsh-agentdebugx
```

See the [plugin documentation](integrations/dsh-agentdebugx/README.md) for
configuration, commands, saved-session discovery, and deep diagnosis.

## Quick Start: Python API

Record a trajectory and analyze it locally:

```python
from agentdebug import AgentDebug, EventType

debugger = AgentDebug()

with debugger.trace(
    goal="Book a refundable NYC to SFO flight",
    framework="my-agent",
) as trace:
    trace.record(
        EventType.PLAN,
        agent_name="planner",
        step_index=1,
        output="Search for the cheapest fares.",
    )
    trace.record(
        EventType.TOOL_RESULT,
        agent_name="browser",
        step_index=3,
        error="Checkout failed: refund_policy is required.",
    )

    report = trace.analyze()

print(report.summary)
for finding in report.findings:
    print(finding.failure_mode.mode_id, finding.step_index, finding.evidence)
```

The report localizes the responsible upstream step rather than only reporting
the final visible error.

## Quick Start: CLI

The CLI supports the complete Diagnose -> Rerun workflow. The web console is
optional and is not required for trace conversion, diagnosis, attribution,
recovery planning, or rerun preparation.

### 1. Normalize an external trace

AgentDebugX can auto-detect common JSON and JSONL exports:

```bash
agentdebug ingest raw_trace.json --format auto --out trace.json
```

Use `--format` when the source is known, for example `messages`,
`openai_agents_spans`, `crewai_events`, `langgraph_callbacks`, `claude_code`,
or `osworld`.

Process a directory of independent JSON files or every non-empty line in a
JSONL dataset:

```bash
agentdebug batch ingest AgentProcessBench/gaia_dev/test.jsonl \
  --out-dir data/agentprocessbench/gaia_dev
```

Batch diagnosis normalizes each record and writes independently rerunnable
trajectories and reports:

```bash
agentdebug batch diagnose AgentProcessBench/gaia_dev/test.jsonl \
  --mode judge \
  --attributor all-at-once \
  --recovery self-refine \
  --out-dir runs/agentprocessbench/gaia_dev
```

Every batch writes `batch-summary.json`. Invalid records are isolated and do
not discard successful outputs; a partially failed CLI batch exits with code
`3`.

### 2. Run a fully local diagnosis

The deterministic pipeline does not require an API key:

```bash
agentdebug diagnose trace.json \
  --mode heuristic \
  --attributor heuristic \
  --recovery reflexion \
  --out report.json
```

Render the same diagnosis as a cascade-oriented traceback:

```bash
agentdebug diagnose trace.json \
  --mode heuristic \
  --attributor heuristic \
  --recovery reflexion \
  --traceback
```

### 3. Enable LLM-backed diagnosis

Save an OpenAI-compatible endpoint once:

```bash
agentdebug config set-llm \
  --base-url "https://<openai-compatible-host>/v1" \
  --api-key "<secret>" \
  --model "<model>"
```

Then select the diagnosis, attribution, and recovery implementations
explicitly:

```bash
agentdebug diagnose trace.json \
  --mode judge \
  --attributor all-at-once \
  --recovery self-refine \
  --out report.json
```

For difficult multi-step or ambiguous failures, DeepDebug runs the complete
diagnosis workflow and automatically packages its evidence-backed fix as a
standard retry directive:

```bash
agentdebug diagnose trace.json \
  --mode deepdebug \
  --out report.json
```

`--recovery deepdebug` can select this packaging explicitly. Existing scripts
that use `--attributor none --recovery none` remain compatible; explicit
`--recovery none` disables the standard recovery payload.

Environment variables can be used instead of saved configuration:

```bash
export AGENTDEBUG_LLM_BASE_URL="https://<openai-compatible-host>/v1"
export AGENTDEBUG_LLM_API_KEY="<secret>"
export AGENTDEBUG_LLM_MODEL="<model>"
```

Use `agentdebug config show` to inspect masked configuration and
`agentdebug config doctor` to test the configured endpoint.

### 4. Execute the Rerun stage

For repeated, Docker, or remote reruns, keep the application's complete Agent
environment running as an HTTP runner service. Implement a project callback,
then start and configure it once:

```bash
agentdebug runner serve my_project.runner:run_agent \
  --name my-agent \
  --framework langgraph \
  --host 0.0.0.0 \
  --port 8765 \
  --token-env MY_RUNNER_TOKEN

agentdebug config set-runner my-agent \
  --url http://127.0.0.1:8765 \
  --token-env MY_RUNNER_TOKEN \
  --default

agentdebug config doctor-runner my-agent
```

Then run the original agent framework from the beginning of the task:

```bash
agentdebug rerun report.json \
  --trajectory trace.json \
  --out rerun.live.json
```

To branch from a specific trajectory event, pass its 1-based event number:

```bash
agentdebug rerun report.json \
  --trajectory trace.json \
  --start-event 4 \
  --out rerun.from-event.json
```

`--start-event N` resolves the Nth event to its stable event ID and sends a
`from_event` checkpoint to plan, simulation, and live runner modes. The selected
runner must support restoring or continuing from event checkpoints.

The service owns the framework, real model, tools, credentials, environment,
job lifecycle, and trajectory recorder. A chat-completions URL alone is not an
Agent environment. Submissions are idempotent, transient failures use bounded
retries, and unfinished remote jobs are cancelled best-effort. See
[the runner specification](src/agentdebug/rerun/RUNNER_SPEC.md).

For local scripts and CI, the process compatibility transport remains available:

```bash
agentdebug rerun report.json \
  --trajectory trace.json \
  --runner-command "python path/to/project_rerun_runner.py" \
  --out rerun.json
```

Use `--plan-only` for trajectory-only uploads; the plan reports why real
execution is unavailable and which runtime capabilities are missing.

Export the same request as a pending actor task dataset when another system
will perform the rollout:

```bash
agentdebug rerun report.json \
  --trajectory trace.json \
  --plan-only \
  --actor-task-format jsonl \
  --out rerun-tasks.jsonl
```

Parquet is also supported with `--actor-task-format parquet` after installing
`pyarrow`. These rows contain actor inputs and provenance, not responses or
training labels. See
[the actor task specification](src/agentdebug/rerun/ACTOR_TASK_SPEC.md).

For prompt experiments only, `--simulate` enables the previous LLM-generated
trajectory flow. It returns a workflow JSON with `status=simulated`, a validated
`hypothetical_trajectory`, and model-generated events explicitly marked as
simulated. It executes no tools and is not evidence that the recovery fixed the
task. See
[the simulation specification](src/agentdebug/rerun/SIMULATION_SPEC.md).

### 5. Work with stored traces

The CLI can query SQLite or JSONL stores created by instrumented runs or the
local console:

```bash
agentdebug list --store-sqlite .agentdebug/traces.sqlite
agentdebug show  --store-sqlite .agentdebug/traces.sqlite
agentdebug diagnose  \
  --store-sqlite .agentdebug/traces.sqlite \
  --mode heuristic \
  --attributor heuristic \
  --recovery reflexion
```

### 6. Package and integrate debugging workflows

Publish a scrubbed failure bundle to a local Error Hub:

```bash
agentdebug hub push  \
  --store-sqlite .agentdebug/traces.sqlite \
  --to local:./agentdebug-hub
```

Generate a debugging skill for a supported host runtime:

```bash
agentdebug integrations skill --platform claude --target .claude/skills
```

### Optional: launch the local console

Install the UI extra only when a visual inspection workflow is useful:

```bash
pip install "agentdebugx[ui]"
agentdebug serve \
  --store-sqlite .agentdebug/traces.sqlite \
  --host 127.0.0.1 \
  --port 7777
```

## CLI Reference

### Command · Purpose
- **Command**: `agentdebug ingest` · **Purpose**: Normalize an external trace export into AgentDebugX schema
- **Command**: `agentdebug diagnose` · **Purpose**: Run detection, attribution, and recovery planning
- **Command**: `agentdebug batch ingest` · **Purpose**: Normalize every JSON file or independent JSONL record
- **Command**: `agentdebug batch diagnose` · **Purpose**: Normalize and diagnose a JSON/JSONL collection
- **Command**: `agentdebug rerun` · **Purpose**: Execute a real framework runner or build a capability-aware plan
- **Command**: `agentdebug runner serve` · **Purpose**: Expose an application callback through the live runner protocol
- **Command**: `agentdebug list` / `agentdebug show` · **Purpose**: Inspect traces in a local store
- **Command**: `agentdebug config` · **Purpose**: Manage and test LLM endpoints and persistent HTTP runners
- **Command**: `agentdebug hub` · **Purpose**: Package, scrub, push, and pull Error Hub bundles
- **Command**: `agentdebug integrations` · **Purpose**: Generate external runtime integration assets
- **Command**: `agentdebug act` · **Purpose**: Compatibility namespace for Hub and integration actions
- **Command**: `agentdebug serve` / `agentdebug inspect` · **Purpose**: Launch the optional local web console
- **Command**: `agentdebug doctor` · **Purpose**: Report optional dependency and configuration status
- **Command**: `agentdebug analyze` · **Purpose**: Compatibility entry point for heuristic diagnosis
- **Command**: `agentdebug convert` · **Purpose**: Compatibility alias for `agentdebug ingest`

Run `agentdebug <command> --help` for version-specific flags.

## Architecture

The repository mirrors the paper-level workflow:

```text
src/agentdebug/schema/       portable trajectory, event, report, and taxonomy contracts
src/agentdebug/runtime/      storage, LLM clients, event bus, and plugin registry
src/agentdebug/ingest/       live capture APIs and offline trace importers
src/agentdebug/diagnose/     Detect -> Attribute -> Recover pipeline
src/agentdebug/rerun/        rerun plans, requests, branch comparison, and executors
src/agentdebug/inspect/      traceback renderer and local inspection UI
src/agentdebug/hub/          scrubbed failure bundle packaging and backends
src/agentdebug/integrations/ host skill and runtime integration generators
src/agentdebug/gui/          computer-use / OSWorld GUI root-cause analysis
examples/                    runnable examples and demo traces
docs/                        architecture, schema, and project assets
```

Detailed references:

- [Architecture](docs/ARCHITECTURE.md)
- [Trace schema](docs/TRACE_SCHEMA.md)
- [System overview PDF](docs/assets/overview.pdf)

## Component Model

Diagnose components use manifest-backed discovery:

- Detect components and rule packs declare metadata under
  `src/agentdebug/diagnose/component_manifests/detect/` and
  `src/agentdebug/diagnose/detect/rules/packs/`.
- Attribute components declare metadata under
  `src/agentdebug/diagnose/component_manifests/attribute/`.
- Recover components declare metadata under
  `src/agentdebug/diagnose/component_manifests/recover/`.

The shared registry exposes:

```python
from agentdebug.diagnose import list_components, load_component

for component in list_components():
    print(component.id, component.stage, component.capabilities)
```

This keeps the implementation extensible without turning the CLI or UI into
business-logic containers.

## Local UI

The inspection UI is a local FastAPI application with a no-build HTML/CSS/JS
frontend. It is intentionally a surface layer:

- routes live in `inspect/ui/routes.py`
- rendering lives in `inspect/ui/views.py`
- UI-facing services live in `inspect/ui/services.py`
- local case and branch stores live in `inspect/ui/branch_store.py`
- `inspect/ui/server.py` remains a compatibility import path

### Launch from the CLI

Install the optional UI dependencies, then point the server at an existing
AgentDebugX trace store:

```bash
pip install "agentdebugx[ui]"

agentdebug serve \
  --store-sqlite .agentdebug/traces.sqlite \
  --host 127.0.0.1 \
  --port 7777
```

Open [http://127.0.0.1:7777](http://127.0.0.1:7777) in a browser. For a JSONL
store, replace `--store-sqlite` with
`--store-jsonl .agentdebug/traces.jsonl`. Keep the default loopback host unless
the UI is deployed behind appropriate authentication and transport security.
Place native trajectory and diagnostic-report JSON files under
`.agentdebug/imports/`, then use **Sync imports** in the workspace to import
new or changed files. Set `AGENTDEBUG_IMPORT_DIR` to use another server-owned
directory.

![AgentDebugX local inspection UI](docs/assets/UI.png)

The UI can inspect traces, save typical error cases, prepare debug
continuations, and invoke a server-