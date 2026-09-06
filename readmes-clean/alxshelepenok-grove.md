![Grove](.github/assets/hero.png)
  

<h3 align="center">
  Code grows. Context windows don't. Plant a Grove 🌳
</h3>

***G**raph-driven **R**easoning **O**ver **V**erified **E**vidence. A formal workflow protocol that keeps AI coding agents on track through machine-enforced invariants, verified evidence, and structured context. Designed to keep deep, long-running projects coherent across sessions, agents, and months.*

> **We no longer just write code.**   
> **We hold the reins of a train running at 20 commits a day, making sure it doesn't derail.**

**What this gives you:**
- **Atomic progress:** every task is mechanically proven, not just claimed.
- **Hierarchy over compression:** context is strictly structured, never lossily summarized.
- **Absolute reproducibility:** every action is recorded, so any step, decision, or assumption can be replayed and retraced.
- **Continuity across agents:** if an agent stops mid-goal, another agent on another client or model resumes from verified state.
- **Total ownership:** every goal, decision, task, question, and assumption is stored in a persistent historical graph that belongs entirely to you.

Grove enforces rules as deterministic invariants stored in a single checksummed lockfile. The agent cannot declare work done without falsifiable evidence, start unready tasks, or hallucinate progress.

Instead of lossy prompt compression or summarization, Grove structures project state into a typed reasoning graph with machine-checkable edges. It routes exactly the execution packet needed for the current step, and nothing more.

Works with Claude Code, Codex, Gemini CLI, Cursor, Windsurf, Cline, GitHub Copilot, and any other agent. **Grove includes a CLI, a built-in MCP server, and a drop-in agent skill bundle** so you can integrate it into your workspace immediately.

> [!IMPORTANT]
> A note on the desktop app shown below. It exists to make the graph, the evidence, and the health of a project visible at a glance, but it is still experimental and has not been tested on macOS yet. The CLI and the MCP server are the stable, tested interfaces. The UI is implemented without any JavaScript framework, mostly plain HTML, CSS, and Tauri, which keeps it fast, and the graph is rendered with WebGL.

  
    
    ![Overview](.github/assets/overview.png)
  

  <colgroup>
    <col style="width: 33.3333%">
    <col style="width: 33.3333%">
    <col style="width: 33.3333%">
  </colgroup>
  
    
      
        
        ![Interactive graph view](.github/assets/graph.png)
      
    
    
      
        
        ![Graph with archived nodes included](.github/assets/graph_archived.png)
      
    
    
      
        
        ![Execution packet of a work item](.github/assets/packet.png)
      
    
  
  
  
    
      The reasoning graph, explored live.
    
    
      The same view at 143 nodes, history included.
    
    
      All an agent needs for one work item, nothing more.
    
  
  
  
    
      
        
        ![Work items with DoR and status](.github/assets/work.png)
      
    
    
      
        
        ![Areas with goals, work, and content health](.github/assets/areas.png)
      
    
    
      
        
        ![Themes and the critical path](.github/assets/themes.png)
      
    
  
  
  
    
      Work items tracked from proposal to done.
    
    
      Goals, work, and content health per area.
    
    
      Work grouped by theme, with the critical path.
    
  

## Agents lose context as projects grow

Long-running agents suffer from context amnesia. Decisions, assumptions, and dependencies drift out of view as the session grows. A related failure is **unreliable self-reporting**: the agent declares work complete without sufficient evidence. This happens not out of deception, but because nothing in the environment prevents it.

Standard task trackers inherently trust the executor. When a human checks a box in Jira, the work is assumed done. That is a reasonable default for humans. For autonomous agents it is a silent failure mode. Premature "done" declarations compound across long sessions into structural errors, until the codebase no longer matches what anyone believes it to be, and nobody can say why a given line exists.

This is not theoretical. Grove evolved from a crude Markdown hypothesis into a protocol that today manages Merlin Guild, a closed-source production project of 200k+ lines of Rust and TypeScript, heavy on blockchain and cryptography. It scales because the protocol does not rely on the agent remembering or obeying the workflow correctly.

## Structure instead of compression

The obvious response to context amnesia is more tooling: summarization, compaction, retrieval. All of these compress context, and compression loses information while hoping the loss does not matter.

**Grove does not compress context. It structures it.**

As a project evolves, its work is continuously organized into areas, goals, questions, assumptions, decisions, and executable work items. This hierarchy gives the agent a way to identify the context relevant to the current step instead of repeatedly carrying the entire project history into its context window.

The result is not just better continuity; it also reduces token usage. The agent no longer loads unrelated project context simply to recover where it is and why the current task exists.

## Map the entire codebase in a single prompt

What happens when you point a frontier model at a raw codebase with Grove attached?

Without a protocol, an agent skims the files, hallucinates a quick summary, and loses the plot after a few steps. With Grove, it maps the territory. In a real-world test on a complex codebase, a single prompt initiated a 5-hour autonomous Discovery session.

The agent burned through its context window limit, but the result was a fully populated reasoning graph: **44 Areas, 47 Goals, and 89 Work items** targeting test coverage gaps and logic bugs. It didn't just dump a flat to-do list; it formally declared its open unknowns as Questions and grouped related efforts into Themes.

Here is the exact prompt used to bootstrap the project:

> Load the Grove skill and connect to the MCP server. Study the skill fully to understand the protocol constraints.
>
> Your objective is to run a complete Discovery phase across the entire codebase. Do not write implementation code yet, your job is project analysis and graph construction.
>
> 1. Break the project down into Areas. Note that a single package may contain multiple logical areas.
> 2. Iterate through each Area and create Goals to address missing test coverage and explicit logic bugs.
> 3. For each Goal, create Work items strictly formatted according to the Grove protocol.
> 4. Group related work into Themes.
> 5. Declare open unknowns as Questions and formalize architectural choices as Decisions where necessary.

Because Grove enforces a Definition of Ready (DoR), the agent couldn't fake progress. Over the next day, the agent systematically executed the delivery phase, turning **75 tasks to Done**. The remaining tasks correctly stalled in `proposed` or `ready` states, waiting for human answers to the blocking Questions the agent had raised.

  
    
    ![](.github/assets/demo.png)
  

## One project state, multiple interfaces

> The unit of memory is not the conversation. It is the project.  
> The unit of progress is not the agent's claim. It is verified evidence.

Grove replaces polite prompt instructions with a strict, mechanically enforced protocol. Agents interact with project state through the CLI, MCP, and desktop interfaces. The protocol itself enforces the rules:

- A work item cannot be marked done without an evidence record.
- Work cannot start until every precondition is machine-verified.
- Goal progress cannot be updated by hand; fitness deltas are applied atomically at close time or not at all.

The state either satisfies the protocol, or Grove refuses to advance it. An agent cannot advance protocol state by merely claiming that work is complete.

## Give agents only the context they need

Grove forces the agent to decompose the product into a strict typed hierarchy. Instead of a raw list of tasks, every piece of planning context lives explicitly in a node taxonomy. Nothing hides in side documents or the agent's internal state:

### Node · ID · What it holds
- **Node**: **Area** · **ID**: `A-NN` · **What it holds**: Permanent scope skeleton above goals; never archived.
- **Node**: **Goal** · **ID**: `G-NN` · **What it holds**: Outcome with a measurable fitness function.
- **Node**: **Theme** · **ID**: `T-NN` · **What it holds**: Optional grouping of related work items.
- **Node**: **Work** · **ID**: `W-NN` · **What it holds**: Executable unit with Definition of Ready + Definition of Done.
- **Node**: **Decision** · **ID**: `D-NN` · **What it holds**: ADR: immutable once accepted, superseded only with recorded rationale.
- **Node**: **Question** · **ID**: `Q-NN` · **What it holds**: Open unknown, declared instead of pretended away.
- **Node**: **Assumption** · **ID**: `B-NN` · **What it holds**: Falsifiable hypothesis with a validation method and result.
- **Node**: **Discovery** · **ID**: `Y-NN` · **What it holds**: Reusable, evidence-backed knowledge distilled from finished work.

Typed edges connect these nodes into a graph, with blocks remaining acyclic. This structure lets Grove answer both **why does this task exist?** and **what breaks if I change it?** without relying on the agent's internal state.

Once this graph exists, the routing promised above becomes mechanical. `grove next` picks the current step; `grove packet` emits exactly its context. Nothing irrelevant enters the context window.

Before touching a line of code, the agent queries the **causality cone**. `grove packet W-NN --cone` maps the backward cone (everything that must finish first, in topological contraction order), the forward cone (the blast radius if this item changes), and a fragility score per affected goal.

  
    
    ![The Grove loop: on the left, the Discovery track chains Questions into Assumptions into Discoveries; on the right, the Project holds areas, each chaining Goals into Work into Evidence. Dotted edges close the loop: questions are asked against goals, assumptions target work, discoveries guide goals, and evidence distills back into discoveries.](.github/assets/diagram.png)
  

## Turn reasoning into reusable knowledge

Grove introduces a unified methodology for AI-driven software development, informed by Dual-Track Agile, Hypothesis-Driven Development, ADRs, Continuous Discovery, Cynefin, and the Mikado method. These influences are integrated into a single workflow designed around the constraints of autonomous LLM agents and enforced through machine-checkable invariants.

Most AI workflows are tiny waterfalls: specify everything, then build everything. Grove runs discovery and delivery in parallel, each track feeding the other:

- **Discovery** takes open unknowns and operationalizes them. A question becomes a falsifiable assumption; validated outcomes become curated discoveries.
- **Delivery** executes ready work items and writes verified code on top of those assumptions.

The joints are mechanical. Questions are asked against goals; assumptions target work and gate it; discoveries guide the next goals; finished work distills back into discoveries. When a test falsifies an assumption, the plan reshapes at once; dependent work cannot proceed on a broken foundation.

### Knowledge has a lifecycle

Grove does not treat distilled knowledge as permanent truth. Discoveries can become stale as the project evolves; reactivating one requires a fresh anchor. Distillation debt is tracked rather than silently accumulating, while goal fitness is re-derived on every close.

The dashboard reflects actual protocol state after every mutation, not intended state. Grove assumes that a project keeps moving: knowledge changes, assumptions are invalidated, and unfinished reasoning accumulates. The protocol makes those changes visible instead of letting them disappear into project history.

### Ideas behind the protocol

- Discovery and Delivery run in parallel (Dual-Track Agile, Cagan). A work item cannot enter Delivery until every open question and unvalidated assumption that blocks it is resolved in Discovery.
- Every executable unit has explicit acceptance criteria before code is written (HDD, Definition of Ready). The DoR is not a checklist anyone can override; it is a boolean conjunction the CLI evaluates on every `status=progress` transition.
- Long-lived design choices are first-class artifacts (ADR, Nygard). Decisions are immutable once accepted. They cannot be quietly revised; they can only be superseded by a new decision with a recorded rationale.
- Open unknowns are first-class artifacts; agents declare them rather than pretend to know (Continuous Discovery; Cynefin). A question tagged `chaotic` halts the agent and requires human resolution.
- Assumptions are falsifiable gates, not comments. An assumption in state `invalidated_blocking` prevents any dependent work item from becoming ready. The agent cannot proceed by ignoring it.
- Refactoring uses a Mikado-style dependency graph distinguishing causation, sequencing, implementation, and inquiry. This makes the blast radius of a change explicit before the first line is touched.
- Verified goals archive only after distillation: their validated assumptions, answered questions, and accepted decisions become Discoveries (Y), curated domain axioms that are never archived and that feed future packets.
- Areas (A) are a permanent scope skeleton above goals. Every goal belongs to exactly one area, enforced by the CLI at creation (I₁₃); areas are never archived, so the structure outlives any single goal.

## Beyond spec-driven development

Spec-driven development makes specifications explicit. Grove goes one step further: it makes the development process itself executable and verifiable.

A specification describes what the system should do. Grove additionally models the state of the work around it: what is proven, what is assumed, what is blocked, what is ready, what is done, and on what evidence. These are not instructions for the agent to follow; they are protocol state that gates what the agent is allowed to do next.

This changes the workflow from document-driven execution to state-driven execution. There is no single specification to regenerate the project from and no fixed waterfall per feature. Discovery and delivery run continuously, and when an assumption is falsified, the graph and the execution plan change
with it. Every state transition is mechanically gated rather than relying on the agent to follow the process correctly.

Specifications remain useful. In Grove, they can live as decisions, acceptance criteria, and other structured project knowledge attached to the work. What changes is what enforces them: the specification describes the intended outcome; the protocol determines whether the project is allowed to advance.

## Let evidence decide when work is done

A task cannot even start until a Definition of Ready passes. This is a strict boolean conjunction evaluated by the protocol on every `status=progress` transition, not a checklist anyone can override. Once ready, Grove emits an execution packet: exactly the context the step needs (the work item, its acceptance criteria, its open questions, its assumption chain, and the decisions that constrain it) and nothing more.

Closing requires **falsifiable** evidence: test outputs, commit hashes, build logs. A self-reported `finished` is not accepted. The transition to `done` is **atomic**; goal fitness deltas and status re-derivation are applied in the same write, or not at all.

## Versioned reasoning, not just versioned code

All state lives in `.grove/state.lock`, a single line-oriented text file with a SHA-256 checksum rewritten on every mutation. Any manual edit, rogue script, or bad merge is detected on the next protocol operation, and all state transitions are blocked until the file is repaired.

The lockfile can live **inside** the project repository, so the history of project reasoning evolves alongside the code, or **outside** it in a separate directory or repository. Both topologies are supported. When committed to version control, the lockfile's history becomes the history of the project's reasoning, not just its code.

### Merge conflicts and race conditions

A typical race occurs when two branches advance project state independently:

1. Branch `A` merges into `main` and advances the project state.
2. Branch `B` was created earlier and still contains the previous state checksum.
3. Merging the branches produces a checksum mismatch.

Grove detects the divergence instead of silently accepting inconsistent state.

Resolution is mechanical:

1. Resolve textual conflicts, keeping records from both sides.
2. Run `grove repair --confirm` to re-canonicalize and re-checksum the state.
3. Run `grove check` to surface any invariant violations.
4. Run `grove renumber` if ID collisions occurred between branches.

### Parallel work

For parallel worktrees, `grove init --id-stride/--id-offset` allocates disjoint ID ranges so collisions do not happen in the first place.

On a single machine, concurrent mutations are protected by an exclusive `flock`, while claimed work is protected by session tokens.

Multi-machine writes to a single lockfile are out of scope by design. Remote state transitions must be routed through a single canonical writer, such as a primary CI agent.

## Executable history, not just an audit trail

Git versions code. Grove versions the reasoning that produced it. Most agent harnesses and SDD (Spec-Driven Development) tools lose the "why" the moment a task is closed. Grove records every action into a persistent, executable journal, giving you something unprecedented: a full undo and replay at 