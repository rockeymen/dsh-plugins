# J-Space Cognition Suite V3.7

[![Concept DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21971181.svg)](https://doi.org/10.5281/zenodo.21971181)

J-Space Cognition Suite is a model-agnostic inference-time control system for deep reasoning, long-horizon work, tool use, verification, and recovery.

It is packaged as a Skill for cross-platform use, selective loading, and low-friction integration.

The suite organizes an agent's accessible working representations into a deliberately managed workspace. It operates through a single entry, nine selectively loaded modules, four supporting references, and an optional standard-library controller for durable task state.

J-Space operates at inference time. Model weights and training remain unchanged.

## Quick start

### Option A — manual installation

1. Download or clone this repository.
2. Locate the user-level Skills directory used by your AI host.
3. Copy the complete [`j-space/`](j-space/) directory into it so that the installed entry is `<skills-directory>/j-space/SKILL.md`.
4. Run the integrity check with an available Python 3 interpreter:

   ```text
    <skills-directory>/j-space/scripts/verify_suite.py
   ```

   Replace `` with the Python 3 command available on the host, commonly `python`, `python3`, or `py -3`.

5. Reload the host if it discovers Skills at startup.

- The directory must remain intact because `SKILL.md` routes to relative paths under `modules/`, `references/`, and `scripts/`.

- The repository-level `LICENSE` and `THIRD_PARTY_NOTICES.md` remain part of the distribution.
- Include copies of both when redistributing `j-space/` as a standalone package.

### Option B — ask an AI agent to install it

Copy the following prompt into an agent that can access files and this repository:

```text
Install J-Space Cognition Suite from
https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.7 into this environment's user-level Skills directory.

First inspect the host configuration or documentation to locate the correct Skills directory. Install the complete j-space/ directory as j-space/, preserving SKILL.md, modules/, references/, and scripts/. If a j-space target already exists, compare it and ask before replacing anything. Run scripts/verify_suite.py with an available Python 3 interpreter after installation.

When finished, report the installed path and verification result, then tell me how this host invokes the Skill. Briefly explain fast, full, and loop, and explain that the optional controller records long-task state rather than choosing solutions. If this host has no native Skill loader, explain the selective system/developer-instruction integration instead of reporting an installation.
```

### Use it

Invoke the Skill through the mechanism provided by your host—such as its Skill picker,
`/j-space`, `$j-space`, or a direct request:

```text
Use j-space for this task. Audit this repository, preserve its architecture,verify every finding, and keep the work consistent across all affected files.
```

The entry gate selects the lightest suitable pass automatically.

## Operating modes

### Pass · Suitable work · What loads
- **Pass**: `fast` · **Suitable work**: One step, or a result checkable in one glance · **What loads**: Nothing extra
- **Pass**: `full` · **Suitable work**: Several dependent steps and one bounded deliverable · **What loads**: One or two relevant modules; `ship` before delivery
- **Pass**: `loop` · **Suitable work**: Multiple stages, files, turns, tools, or persistent state · **What loads**: Ledger, seams, checkpoints, register audit, and recovery

A request for brevity changes the outer response length while verification remains aligned with the task's floor. Short work stays light; long work receives durable state only when it needs it.

## Core mechanisms

### Mechanism · Function
- **Mechanism**: Selective workspace loading · **Function**: Keeps one or two load-bearing ideas active and externalizes the rest
- **Mechanism**: Broadcast hub · **Function**: Gives dependent branches one shared source for names, values, constraints, and style anchors
- **Mechanism**: Dense Track · **Function**: Carries long internal chains in compact, decodable notation before returning to clean outer language
- **Mechanism**: Bridge-before-conclusion reasoning · **Function**: Makes required intermediates explicit before a conclusion consumes them
- **Mechanism**: Metacognitive control · **Function**: Routes confidence, inconsistency, and failure signals into a concrete next action
- **Mechanism**: Empirical escape and verification · **Function**: Converts stalled derivation into bounded tests with a named verifier and coverage
- **Mechanism**: First-person agency and functional echo · **Function**: Uses `I`, `we`, `let's`, and `we need` to bind workspace state to later actions and checks

The mechanisms are selectively loaded. They are not a fixed checklist for every request.

## Optional controller

[`j-space/scripts/jspace.py`](j-space/scripts/jspace.py) externalizes `loop` state into
`.jspace/` in the current task workspace. Invoke it by its resolved Skill path while keeping the task workspace as the current directory.

### Command · Purpose
- **Command**: `note --goal "..." --next "..."` · **Purpose**: Open the ledger and define done plus the first action
- **Command**: `note --next "..."` · **Purpose**: Replace the single next action after a checkpoint or seam
- **Command**: `note --core "name — defining fact"` · **Purpose**: Record a hub entry
- **Command**: `note --core "name — defining fact" --core-slot 1` · **Purpose**: Swap a selected live hub entry
- **Command**: `note --check "..." --by "..."` · **Purpose**: Append a checkpoint with verifier and coverage
- **Command**: `note --open "..." --settled-by "..."` · **Purpose**: Record a question and what would settle it
- **Command**: `note --close N --check "..." --by "..."` · **Purpose**: Close question `N` against a new recorded checkpoint
- **Command**: `seam` · **Purpose**: Re-read current state and report recent movement
- **Command**: `ship FILE` · **Purpose**: Inspect outgoing text for register leakage and failure signatures
- **Command**: `resume` · **Purpose**: Reload the premise, invariants, and full ledger after a long gap

```text
 <skill-root>/scripts/jspace.py note --goal "what done means" --next "first action"
 <skill-root>/scripts/jspace.py note --open "does the parser preserve state?" --settled-by "unit tests over all ledger sections and edge inputs"
 <skill-root>/scripts/jspace.py note --close 1 --check "the parser preserves state" --by "unit tests over all ledger sections and edge inputs"
 <skill-root>/scripts/jspace.py seam
 <skill-root>/scripts/jspace.py ship OUTPUT_FILE
 <skill-root>/scripts/jspace.py resume
```

The controller records and reports state. Solution choice remains with the model. It uses the Python standard library and writes working state only under the task's `.jspace/` directory.

## Generic model integration

An environment with a native Skill loader can install `j-space/` directly. For a chat or API environment, provide [`j-space/SKILL.md`](j-space/SKILL.md) as a system- or developer-level instruction and expose `modules/` and `references/` through file or retrieval tools.

Selected files should be retrieved on demand. Selective loading is part of the operating design.

## Benchmark

### 1. Main table

### Benchmark · DeepSeek V4-Flash-Vision-Exp · DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7** · GLM-5.3 · Opus-4.8 · Fable 5 (w/ fallback)
- **Benchmark**: HLE (w/o tools) · **DeepSeek V4-Flash-Vision-Exp**: *37.8 · **DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7****: **37.8** · **GLM-5.3**: — · **Opus-4.8**: 49.8 · **Fable 5 (w/ fallback)**: 53.3
- **Benchmark**: HLE (w/ tools) · **DeepSeek V4-Flash-Vision-Exp**: *51.5 · **DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7****: **51.9** · **GLM-5.3**: 62.5 · **Opus-4.8**: 57.9 · **Fable 5 (w/ fallback)**: 63.0
- **Benchmark**: Terminal Bench 2.1 · **DeepSeek V4-Flash-Vision-Exp**: 83.9 · **DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7****: **85.5** · **GLM-5.3**: 88.2 · **Opus-4.8**: 85.0 · **Fable 5 (w/ fallback)**: 88.0
- **Benchmark**: NL2Repo · **DeepSeek V4-Flash-Vision-Exp**: 57.7 · **DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7****: **60.4** · **GLM-5.3**: 58.0 · **Opus-4.8**: 69.7 · **Fable 5 (w/ fallback)**: —
- **Benchmark**: CyberGym · **DeepSeek V4-Flash-Vision-Exp**: 75.3 · **DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7****: **77.8** · **GLM-5.3**: 84.5 · **Opus-4.8**: 78.3 · **Fable 5 (w/ fallback)**: 83.1
- **Benchmark**: DeepSWE · **DeepSeek V4-Flash-Vision-Exp**: 59.3 · **DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7****: **61.8** · **GLM-5.3**: 66.9 · **Opus-4.8**: 58.0 · **Fable 5 (w/ fallback)**: 70.0
- **Benchmark**: Toolathlon-Verified · **DeepSeek V4-Flash-Vision-Exp**: 75.9 · **DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7****: **77.4** · **GLM-5.3**: 73.0 · **Opus-4.8**: 76.2 · **Fable 5 (w/ fallback)**: 77.9
- **Benchmark**: Agents' Last Exam · **DeepSeek V4-Flash-Vision-Exp**: 27.3 · **DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7****: **28.3** · **GLM-5.3**: 28.5 · **Opus-4.8**: 25.7 · **Fable 5 (w/ fallback)**: 23.8
- **Benchmark**: AutomationBench (Public) · **DeepSeek V4-Flash-Vision-Exp**: 25.7 · **DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7****: **27.6** · **GLM-5.3**: 48.2 · **Opus-4.8**: 27.2 · **Fable 5 (w/ fallback)**: 29.1
- **Benchmark**: ***Average** · **DeepSeek V4-Flash-Vision-Exp**: 56.99 · **DeepSeek V4-Flash-Vision-Exp **+ J-Space V3.7****: **58.61** · **GLM-5.3**: 64.54 · **Opus-4.8**: 58.33 · **Fable 5 (w/ fallback)**: 62.13

\* HLE scores were not disclosed and follow DeepSeek V4-Flash-0731. The average covers the 7 rows where all 5 columns have values.

### 2. Speed and token efficiency

### Benchmark · Wall-clock τ · Speedup · Output tokens · Total tokens · **Score per unit time** · Cost per successful task
- **Benchmark**: HLE (w/o tools) · **Wall-clock τ**: *1.02 · **Speedup**: −2% · **Output tokens**: −10% · **Total tokens**: +5% · ****Score per unit time****: **0.98×** · **Cost per successful task**: +5%
- **Benchmark**: HLE (w/ tools) · **Wall-clock τ**: 0.88 · **Speedup**: +14% · **Output tokens**: −22% · **Total tokens**: +3% · ****Score per unit time****: **1.15×** · **Cost per successful task**: +2%
- **Benchmark**: Terminal Bench 2.1 · **Wall-clock τ**: 0.79 · **Speedup**: +27% · **Output tokens**: −28% · **Total tokens**: −3% · ****Score per unit time****: **1.29×** · **Cost per successful task**: −5%
- **Benchmark**: DeepSWE · **Wall-clock τ**: 0.78 · **Speedup**: +28% · **Output tokens**: −28% · **Total tokens**: −3% · ****Score per unit time****: **1.34×** · **Cost per successful task**: −7%
- **Benchmark**: Toolathlon-Verified · **Wall-clock τ**: 0.86 · **Speedup**: +16% · **Output tokens**: −25% · **Total tokens**: +2% · ****Score per unit time****: **1.19×** · **Cost per successful task**: +0%
- **Benchmark**: AutomationBench (Public) · **Wall-clock τ**: 0.76 · **Speedup**: +32% · **Output tokens**: −31% · **Total tokens**: −5% · ****Score per unit time****: **1.41×** · **Cost per successful task**: −12%

\* For HLE (w/o tools) τ=1.02 is **intentionally positive** (i.e., slower): on single-turn tasks the Skill entry is a net overhead.

**See: [DeepSeek V4 × J-Space Capability Realization Report](https://github.com/Tiger3807861189/DeepSeek-V4-J-Space-Capability-Realization-Report).**

## Cross-model compatibility

The operating effects have been reproduced across the DeepSeek, Qwen, GLM, GPT, and Claude model families. Effect size varies with base capability, context policy, tool harness, sampling configuration, and benchmark implementation.

The portable unit is the protocol: workspace loading, selective routing, state externalization, verification, and recovery. It is independent of a vendor-specific tokenizer or model API.

## Project structure

```text
J-Space-Cognition-Suite-V3.7/
├── .github/workflows/verify.yml    # three-platform integrity and regression checks
├── CITATION.cff                    # machine-readable citation metadata
├── CONTRIBUTING.md                 # contribution and provenance requirements
├── LICENSE                         # Apache License 2.0
├── README.md                       # English engineering guide
├── THIRD_PARTY_NOTICES.md          # attribution and license boundaries for source material
├── tests/test_jspace.py            # standard-library controller regression tests
└── j-space/
    ├── SKILL.md                    # single entry, gate, routing, and invariants
    ├── modules/                    # nine selectively loaded protocols
    ├── references/                 # evidence, induction, problem modeling, and worked exemplars
    └── scripts/
        ├── jspace.py               # optional loop controller
        ├── workspace-ledger.md     # ledger template and contract
        └── verify_suite.py         # authoring-time integrity check
```

`SKILL.md` is the only registered entry. Modules and references are loaded on demand so the control system does not become its own source of context pressure.

Maintainers can verify the package from its root:

```text
 j-space/scripts/verify_suite.py
 -m unittest discover -s tests -v
```

## Technical basis and scope

J-Space uses the operational workspace terminology established by Anthropic's related interpretability research. Within this suite, first-person language is treated as control grammar: accessible state descriptions are bound to explicit actions, checks, and settles.

The suite focuses on observable functional properties—reportability, deliberate maintenance, intermediate computation, broadcast, monitoring, and causal sensitivity. Detailed research interpretation, terminology, evidence boundaries, and sources are maintained in
[`j-space/references/j-space-science.md`](j-space/references/j-space-science.md).

Design principle:

> **Dense on the inside, decodable on demand, clean on the outside.**

Use only the machinery the task earns.

## Release history

J-Space has progressed through:

**V1 → V1.5 → V1.8 → V2 → V2.5 → V2.6 → V3 → V3.1 → V3.2 → V3.5 → V3.5Turbo → V3.6 → V3.7**

The V3.7 package contains one entry, nine focused modules, four supporting references, an optional runtime controller, an authoring-time verifier, standard-library regression tests, three-platform CI, Apache-2.0 licensing, and machine-readable citation metadata.

V3.7's problem-model routing incorporates the pull request opened by [@lanting200](https://github.com/lanting200), including commit contributions from [@afeer123](https://github.com/afeer123).