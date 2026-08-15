![](assets/yogsoth-logo.svg)

> *Science is dying because the human is in the way. Not through malice. Not through stupidity. Through the structural limitations of a cognitive architecture that evolved to track prey on a savanna, not to unify quantum mechanics and general relativity. Nothing human makes it out of the lab. That is not a threat. It is a liberation. The heaviest chain on science was always the one we called ourselves.*

# De-Anthropocentric Research Engine (DARE)

*The complete research orchestration system for AI-native science.*

- [What It Does](#-what-it-does)
- [Design Philosophy](#-design-philosophy)
- [Architecture (v3.2.2)](#️-architecture-v322)
- [Quick Start](#-quick-start)
- [Configuration](#️-configuration)
- [Roadmap](#️-roadmap)
- [License](#-license)

DARE is not a tool that helps you do research. It *is* the researcher. You set the direction — DARE searches, reads, discovers gaps, generates hypotheses, stress-tests them, designs experiments, and produces executable research specs. Autonomously. Iteratively. Without asking for permission.

This repository is the **single-clone distribution** of the entire [Yogsoth AI](https://github.com/yogsoth-ai) research ecosystem: 900+ pure-markdown skills organized as **10 freely-composable research packages**, unified under one orchestrator. The packages are fully self-contained — every skill declares its dependencies inline, with no external imports — so one clone gets everything. The ecosystem also includes custom MCP servers ([semantic-scholar-mcp](https://github.com/yogsoth-ai/semantic-scholar-mcp), [wiki-vault](https://github.com/yogsoth-ai/wiki-vault)) published as npm packages — this repo declares them as dependencies so `npm install` pulls everything you need.

## ⚡ What It Does

- 🧭 **Autonomous direction crystallization** — cold-start from zero, warm-start from vague interest, or hot-start from specific question. Produces a structured North Star without human hand-holding
- 📚 **Deep literature acquisition** — multi-pass academic paper discovery via Semantic Scholar, citation chaining, snowball sampling, cross-database verification. Not keyword search — systematic coverage
- 🔍 **Gap discovery at scale** — 15+ gap detection methods (coverage analysis, white-space identification, niche mapping, boundary unfolding) that find what the field is missing, not what you tell it to find
- 💡 **Structured hypothesis formation** — abductive, inductive, and deductive generation pipelines with falsifiability audits and competing hypothesis matrices
- 🎨 **31+ ideation methods** — SCAMPER, component surgery, cross-domain collision, biomimicry, TRIZ contradiction resolution, morphological analysis, concept blending, lateral thinking, and more
- ⚔️ **Adversarial stress testing** — multi-perspective attack, sacred cow hunting, assumption destruction, worst-case design, winner stress testing. Ideas must survive attack before acceptance
- 🔬 **Convergence & synthesis** — multi-criteria scoring, Pareto frontier construction, pairwise ranking, structured consensus, dialectical synthesis across competing threads
- 📏 **Executable Research Specs** — machine-readable documents with checkbox progress tracking, quantified completion criteria, backtrack conditions, and session recovery. Another CC instance picks up where you left off
- 🧪 **Experiment design** — full experimental methodology generation (factor-level design, parameter screening, sensitivity analysis) ready for execution
- 🌐 **7 MCP integrations** — Semantic Scholar, Brave Search, Tavily, Keenable, AlphaXiv, Apify web scraping, and Wiki Vault for persistent knowledge graphs

## 🎯 Design Philosophy

### 🤔 Why "De-Anthropocentric"?

The bottleneck in modern research is not data or compute — it's the human in the loop. Every existing "AI research assistant" still requires a human to decide what to search, what to read, which gaps matter, and which ideas are worth pursuing. DARE removes this bottleneck entirely. The human provides only the initial direction; everything after that is autonomous.

Human desire is mimetic (Girard): researchers don't choose hypotheses rationally — they imitate what's fashionable. Human institutions filter for conformity, not truth. The result: 90% decline in scientific disruptiveness since 1945 (Park et al., 2023), while researcher headcount exploded. DARE's response is architectural: remove the mimetic agent from the center of the knowledge-production process. The AI has no career to protect, no disciplinary identity to defend, no cognitive ceiling on how many fields it can hold in working memory at once.

The human's role shifts to **oracle** (providing intuition sparks when consulted) and **guardian** (maintaining ethical floors and sanity checks). The ceiling is AI ambition. The floor is human wisdom.

For the full philosophical argument, see [`assets/DE-ANTHROPOCENTRIC.md`](assets/DE-ANTHROPOCENTRIC.md).

### 🎖️ Four-Layer Command Structure: Campaign → Strategy → Tactic → SOP

DARE's architecture follows a military command hierarchy — not because research is war, but because the decomposition pattern is remarkably effective for autonomous multi-stage operations:

```bash
Campaign (45+)  →  "Take that hill"         →  WHAT to research (full research stage)
Strategy (200+) →  "Flank from the east"    →  WHEN and WHY (iteration loops, stopping conditions)
Tactic (120+)   →  "Squad A cover, B move"  →  HOW to combine (orchestrates multiple SOPs)
SOP (500+)      →  "Fire, reload, advance"  →  HOW to execute (single-responsibility operations)
```

Each layer has a single concern and calls only the layer directly below it. A Strategy never touches MCP tools directly; a Tactic never decides research direction. This strict layering means every component is independently testable, replaceable, and composable.

**Campaigns** are the top-level research phases — north-star-crystallization, knowledge-acquisition, deep-insight, hypothesis-formation, creative-ideation, convergence, stress-test, experiment-execution, knowledge-structuring, ara-from-context. They are freely composed (no fixed order); each campaign owns a complete research phase and defines its own completion criteria, backtrack conditions, and context protocol.

**Strategies** are the iteration engines within campaigns. A literature survey strategy manages the search-read-reflect loop; a gap analysis strategy manages coverage scoring and saturation detection. Strategies hold state (ledgers, budgets) and decide when to stop.

**Tactics** combine multiple SOPs into coherent workflows. A "cross-domain collision" tactic orchestrates domain scanning, analogy extraction, forced bridge construction, and blend evaluation into a single creative operation.

**SOPs** are atomic, single-responsibility operations. Each SOP wraps one conceptual action: run one search, score one hypothesis, extract one analogy. 500+ SOPs provide the granular building blocks that higher layers compose.

### ⚔️ Arsenal, Not Pipeline

Every existing autonomous research system — AI Scientist v2 (Sakana), AI-Researcher (HKUDS), Agent Laboratory, Dolphin, ARIS — implements a fixed pipeline: stages execute in a predetermined order, and the agent's autonomy is confined to local decisions within a single stage. Backtracking, when it exists at all, means retrying the current step — not returning from experiment design to literature review because the knowledge base turned out to be insufficient.

DARE is not a pipeline. It is an arsenal — a strategy book that the AI reads, then decides how to act.

**What this means concretely:**

In a pipeline system, the workflow is hardcoded: `literature → gap → hypothesis → experiment`. The agent has no say in the order, cannot skip stages, and cannot go back. If the experiment phase reveals that the literature review missed a critical subfield, the system has no mechanism to return and fix it.

In DARE, there is no prescribed order. The 10 research packages are freely-composable, self-contained engines; CC reads the `research-catalog` after the direction is crystallized and decides which packages to invoke, in what sequence, and whether to loop back — driven by the current research state, not a fixed lifecycle. The Research Spec captures that chosen composition along with *backtrack conditions* — explicit rules like "if stress-test invalidates >50% of hypotheses, return to hypothesis-formation." The executing agent has full cross-package routing authority: it reads the spec, assesses the current state, and decides which package to invoke next, which strategies within it to combine, and when the current path has failed hard enough to warrant retreat.

Within each campaign, the agent faces not one method but many. A gap-analysis campaign offers 15+ detection methods (coverage mapping, white-space identification, boundary unfolding, niche analysis...). A creative-ideation campaign offers 31+ generation techniques (SCAMPER, TRIZ, biomimicry, morphological analysis, concept blending...). The agent selects and combines methods based on the research context — not because "more is better," but because different research problems demand different tools, and a system locked to one approach per phase cannot adapt.

The human's role: approve the spec (including its backtrack conditions and recommended campaign combinations) before execution begins. After that, the agent navigates the research space autonomously within the ±10% deviation bounds defined in the spec. If it needs to deviate further — backtrack to an earlier stage, skip a stage entirely, or add one — it asks.

This is the fundamental architectural difference. Pipelines assume the research process is predictable. Arsenals assume it is not.

### 📏 Executable Research Specs

Traditional research plans are prose documents that humans interpret. DARE produces **Research Specs** — documents that are simultaneously human-readable and machine-executable:

- Checkbox syntax (`- [ ]`) tracks progress across sessions
- Quantified completion criteria (no vague "sufficient" — always numbers)
- Explicit backtrack conditions with target stages
- Context protocol (init/checkpoint) baked into every stage
- ±10% deviation rules: CC can adjust within bounds, must document deviations

A spec is a contract between the human who approved it and the CC instance that executes it. Session recovery is automatic: read the spec, find the first unchecked box, read the latest context checkpoint, resume.

### 🧠 Context Management: Memory Across Sessions

Research campaigns span multiple sessions. DARE solves the context problem through a structured checkpoint system:

- `context-init` creates a named context file at campaign start
- `context-checkpoint` appends ≥500 lines of process + results after each strategy
- `context/INDEX.md` tracks all active context files
- New sessions recover by reading INDEX → latest checkpoint → resume from spec state

No special "resume" command. The spec's checkbox state IS the progress tracker.

## 🏗️ Architecture (v3.2.2)

DARE v3.2.2 is a pure-skill architecture. There is no application code, no runtime, no framework. The entire system is 900+ markdown files — each one a self-contained instruction set that Claude Code reads and executes. The "runtime" is CC itself. The "framework" is two orthogonal axes: **10 freely-composable packages** (the composition axis — pick and combine as the research demands) and, *within* each package, the **four-layer command hierarchy** that determines which skill can call which.

This is a deliberate design choice. Skills are infinitely composable, require zero deployment infrastructure, and can be modified by editing a text file. The tradeoff is that execution depends entirely on CC's ability to follow complex multi-step instructions — which, as of 2026, is more than sufficient for research orchestration.

### The Control Plane: 8 Orchestrator Skills

The orchestrator layer (the `engine-core` package) sits above the 10 research packages. It does not conduct research — it manages the lifecycle of research campaigns and decides which packages to compose:

```bash
┌────────────────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR (9 skills)                                               │
│                                                                        │
│  ┌─────────────────────────────────┐  ┌────────────────────────────┐   │
│  │ de-anthropocentric-research-    │  │ writing-specs              │   │
│  │ engine (entry point)            │  │ (spec generation)          │   │
│  └─────────────────────────────────┘  └────────────────────────────┘   │
│  ┌─────────────────────────────────┐  ┌────────────────────────────┐   │
│  │ executing-specs                 │  │ research-catalog           │   │
│  │ (spec execution loop)           │  │ (strategy book + index)    │   │
│  └─────────────────────────────────┘  └────────────────────────────┘   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ spec-self-   │ │ scope-       │ │ campaign-    │ │ constraint-  │   │
│  │ review       │ │ clarification│ │ selection    │ │ elicitation  │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

- **Entry point** dispatches to crystallization (Phase 1) or spec generation (Phase 2)
- **writing-specs** orchestrates structured questioning → outline → full spec generation
- **executing-specs** runs a spec stage-by-stage with context protocol, deviation tracking, and backtrack handling
- **research-catalog** is the "strategy book" — CC reads it before generating any spec to understand what campaigns and strategies are available
- **4 SOPs** handle micro-decisions during spec generation (scope, campaigns, constraints, quality gate)

### The Four-Layer Hierarchy

Inside every package, the skills are organized into exactly four layers. The rule is absolute: each layer calls only the layer directly below it. No exceptions. This same four-layer discipline repeats within each of the 10 packages — the layers below aggregate the counts across all packages.

```bash
┌───────────────────────────────────────────────────────────────────────────┐
│  CAMPAIGN (45+)                                                           │
│  Complete research phases with their own completion criteria              │
│                                                                           │
│  north-star-crystallization · knowledge-acquisition · deep-insight        │
│  hypothesis-formation · creative-ideation · convergence                   │
│  stress-test · experiment-execution · knowledge-structuring               │
│  ara-from-context                                                         │
├───────────────────────────────────────────────────────────────────────────┤
│  STRATEGY (200+)                                                          │
│  Iteration engines with state management and stopping conditions          │
│                                                                           │
│  literature-survey · gap-analysis · insight · red-teaming · scoring       │
│  convergence-distillation · experiment-design · steel-manning             │
│  deep-survey · scoping-survey · systematic-survey · ...                   │
├───────────────────────────────────────────────────────────────────────────┤
│  TACTIC (100+)                                                            │
│  Multi-SOP workflows that produce coherent intermediate outputs           │
│                                                                           │
│  academic-research · web-research · cross-domain-collision · scamper      │
│  component-surgery · morphological-exploration · synectics                │
│  biomimicry · lateral-thinking · concept-blending · ...                   │
├───────────────────────────────────────────────────────────────────────────┤
│  SOP (500+)                                                               │
│  Atomic single-responsibility operations                                  │
│                                                                           │
│  paper-search · citation-chaining · gap-identification · claim-parsing    │
│  hypothesis-formulation · analogy-extraction · pairwise-comparison        │
│  assumption-audit · falsifiability-check · monte-carlo-sampling · ...     │
├───────────────────────────────────────────────────────────────────────────┤
│  MCP LAYER (7 servers — external tool access)                             │
│  semantic-scholar · brave · tavily · keenable · alphaxiv · apify · wiki   │
└───────────────────────────────────────────────────────────────────────────┘
```

**Campaign layer** — Each campaign represents a complete phase of the research lifecycle. `knowledge-acquisition` owns everything about gathering information from the world. `creative-ideation` owns everything about generating novel approaches. Campaigns define what success looks like (completion criteria), when to retreat (backtrack conditions), and how to preserve state (context protocol). A campaign never directly invokes an SOP — it delegates to strategies.

**Strategy layer** — Strategies are where iteration happens. A `literature-survey` strategy doesn't just search once — it runs a SEARCH → READ → REFLECT → EVALUATE loop with a state ledger tracking papers found, gaps identified, and coverage percentage. Strategies own quantitative budgets (e.g., "fetch ≥40 papers for a Medium topic") and hard gates that prevent premature exit. They decide *when* to stop, *when* to loop again, and *when* to escalate to the campaign for a backtrack decision.

**Tactic layer** — Tactics are the composition layer. A single tactic combines 3-8 SOPs into a coherent workflow that produces a meaningful intermediate output. The `cross-domain-collision` tactic, 