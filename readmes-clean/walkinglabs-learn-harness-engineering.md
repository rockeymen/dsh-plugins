# Learn Harness Engineering

A project-based course on building the environment, state management, verification, and control mechanisms that make AI coding agents work reliably.

> 🌍 This course is available in **15 languages**: English, 简体中文, 繁體中文, 日本語, 한국어, Español, Français, Русский, Deutsch, العربية, Tiếng Việt, Oʻzbekcha, Türkçe, Portuguese (BR), Українська. Choose your language from the badges above.

## 🆕 What's New — August 2026

**Graph Engineering Update — 1 new lecture, 1 new project**

### What · Details
- **What**: **Lecture 14** · **Details**: [From Single Loops to Graph Engineering](docs/en/lectures/lecture-14-graph-engineering/index.md) — Why a single loop grows into a graph: the four stacked layers (prompt → context → loop → graph) and where harness sits in that stack, the four parts of a graph (nodes, edges, shared state, routing), why in-loop checkpoints can't fix the three structural failures at scale (Goodhart, blindness upward, conflict), a framework-agnostic six-step walkthrough for building your first graph, graph vs. workflow, anchors, which open-source "graph engineering" projects existed before the name vs. after it, the orchestration tax, and when a graph is actually worth drawing.
- **What**: **Project 08** · **Details**: [Draw Your Workflow as a Graph](docs/en/projects/project-08-graph-engineering-first-graph/index.md) — Three progressive experiments: draw your maker-checker loop as an explicit graph, add a parallel fan-out/fan-in node, then add a conditional rollback edge and a human-approval node.

**Key idea:** A loop is a graph with one node. When your task needs specialization, parallelism, shared state, verification, and recovery — it has stopped being a loop. It's a graph.

## 🆕 What's New — July 2026

**Loop Engineering Update — 1 new lecture, 1 new project**

### What · Details
- **What**: **Lecture 13** · **Details**: [Why You Need to Stop Prompting Your Agent](docs/en/lectures/lecture-13-loop-engineering/index.md) — From `/goal` to the six primitives of loop engineering (automations, worktrees, skills, connectors, sub-agents, external state), the generator/evaluator split, four silent costs, and a step-by-step guide to building your first loop.
- **What**: **Project 07** · **Details**: [Build Your First Automated Loop](docs/en/projects/project-07-loop-engineering-first-loop/index.md) — Three progressive experiments: goal loop, timer loop, and maker-checker loop. Compare manual vs. automated, measure intervention reduction, and learn to step outside the loop.
- **What**: **Code templates** · **Details**: `goal-template.md`, `loop-state-template.md`, `maker-prompt.md`, `checker-prompt.md` — drop-in templates for building loops immediately.
- **What**: **All 15 languages** · **Details**: Full translation coverage across all supported languages.

**Key idea:** Harness engineering builds the vehicle. Loop engineering designs the road it drives on — and you design the road from outside the car.

Learn Harness Engineering is a course dedicated to the engineering of AI coding agents. We have deeply studied and synthesized the most advanced Harness Engineering theories and practices in the industry. Our core references include:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **Quick start?** The [`skills/harness-creator/`](./skills/harness-creator/) skill can help you scaffold a production-grade harness (AGENTS.md, feature lists, init.sh, verification workflows) for your own project in minutes.

## ✨ Visual Preview

### 🏠 Course Homepage
> A comprehensive course outline and introduction to core philosophies, providing a clear path to get started.

![Course homepage preview](./docs/public/screenshots/readme/en-home.png)

### 📖 Immersive Lectures
> Deep dives into real-world pain points and hands-on projects (like Project 01) for an immersive learning experience.

![Course lecture preview](./docs/public/screenshots/readme/en-lecture-01.png)

### 🗂️ Ready-to-Use Resource Library
> Templates and reference configurations designed to solve common pitfalls in multi-turn AI agent development, such as context loss and premature task completion.

![Resource library preview](./docs/public/screenshots/readme/en-resources.png)

## PDF Coursebooks

The repository now includes a PDF build pipeline for the course content.

- Run `npm run pdf:build` to generate the currently configured PDF coursebooks locally.
- Output files are written to `artifacts/pdfs/`.
- Run `npm run screenshots:readme` if you want to refresh the README preview images.
- GitHub Actions workflow [`release-course-pdfs.yml`](./.github/workflows/release-course-pdfs.yml) can build the PDFs and publish them to GitHub Releases.

## The Model Is Smart, The Harness Makes It Reliable

There's a hard truth most people learn the hard way: **the strongest model in the world will still fail on real engineering tasks if you don't build a proper environment around it.**

You've probably seen this yourself. You give Claude or GPT a task in your repo. It starts well — reads files, writes code, looks productive. Then something goes wrong. It skips a step. It breaks a test. It says "done" but nothing actually works. You spend more time cleaning up than if you'd done it yourself.

This isn't a model problem. It's a harness problem.

The evidence is clear. Anthropic ran a controlled experiment: same model (Opus 4.5), same prompt ("build a 2D retro game editor"). Without a harness, it spent $9 in 20 minutes and produced something that didn't work. With a full harness (planner + generator + evaluator), it spent $200 in 6 hours and built a game you could actually play. The model didn't change. The harness did.

OpenAI reported the same thing with Codex: in a well-harnessed repository, the same model goes from "unreliable" to "reliable." Not a marginal improvement — a qualitative shift.

**This course teaches you how to build that environment.**

```text
                    THE HARNESS PATTERN
                    ====================

    You --> give task --> Agent reads harness files --> Agent executes
                                                        |
                                              harness governs every step:
                                              |
                                              +--> Instructions: what to do, in what order
                                              +--> Scope:        one feature at a time, no overreach
                                              +--> State:        progress log, feature list, git history
                                              +--> Verification: tests, lint, type-check, smoke runs
                                              +--> Lifecycle:    init at start, clean state at end
                                              |
                                              v
                                         Agent stops only when
                                         verification passes
```

## What Harness Engineering Actually Means

Harness engineering is about building a complete working environment around the model so it produces reliable results. It's not about writing better prompts. It's about designing the system the model operates inside.

A harness has five subsystems:

```text
    ┌────────────────────────────────────────────────────────────────┐
    │                          THE HARNESS                           │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
    │   │ Instructions │  │    State     │  │   Verification     │   │
    │   │              │  │              │  │                    │   │
    │   │ AGENTS.md    │  │ progress.md  │  │ tests + lint       │   │
    │   │ CLAUDE.md    │  │ feature_list │  │ type-check         │   │
    │   │ feature_list │  │ git log      │  │ smoke runs         │   │
    │   │ docs/        │  │ session hand │  │ e2e pipeline       │   │
    │   └──────────────┘  └──────────────┘  └────────────────────┘   │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │    Scope     │  │         Session Lifecycle            │   │
    │   │              │  │                                      │   │
    │   │ one feature  │  │ init.sh at start                     │   │
    │   │ at a time    │  │ clean-state checklist at end         │   │
    │   │ definition   │  │ handoff note for next session        │   │
    │   │ of done      │  │ commit only when safe to resume      │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                │
    └────────────────────────────────────────────────────────────────┘

    The MODEL decides what code to write.
    The HARNESS governs when, where, and how it writes it.
    The harness doesn't make the model smarter.
    It makes the model's output reliable.
```

Each subsystem has one job:

- **Instructions** — Tell the agent what to do, in what order, and what to read before starting. Not one giant file; a progressive disclosure structure the agent navigates on demand.
- **State** — Track what's been done, what's in progress, and what's next. Persisted to disk so the next session picks up exactly where the last one left off.
- **Verification** — Only a passing test suite counts as evidence. The agent cannot declare victory without runnable proof.
- **Scope** — Constrain the agent to one feature at a time. No overreach. No half-finishing three things. No rewriting the feature list to hide unfinished work.
- **Session Lifecycle** — Initialize at the start. Clean up at the end. Leave a clean restart path for the next session.

## Why This Course Exists

The question isn't "can models write code?" They can. The question is: **can they reliably complete real engineering tasks inside real repositories, over multiple sessions, without constant human supervision?**

Right now, the answer is: not without a harness.

```text
    WITHOUT HARNESS                            WITH HARNESS
    ==============                             ============

    Session 1: agent writes code               Session 1: agent reads instructions
               agent breaks tests                         agent runs init.sh
               agent says "done"                          agent works on one feature
               you fix it manually                        agent verifies before claiming done
                                                          agent updates progress log
    Session 2: agent starts fresh                         agent commits clean state
               agent has no memory
               of what happened before         Session 2: agent reads progress log
               agent re-does work                         agent picks up exactly where it left off
               or does something else entirely            agent continues the unfinished feature
               you fix it again                           you review, not rescue

    Result: you spend more time                Result: agent does the work,
            cleaning up than if you                    you verify the result
            did it yourself
```

The questions this course actually cares about:

- Which harness designs improve task completion rates?
- Which designs reduce rework and incorrect completions?
- Which mechanisms keep long-running tasks progressing steadily?
- Which structures keep the system maintainable after multiple agent runs?

## Course Curriculum & Documentation

For the full course materials, please visit the **[Documentation Website](https://walkinglabs.github.io/learn-harness-engineering/)**.

The curriculum is divided into three parts:

1. **Lectures**: 13 conceptual units explaining the theory behind harness engineering.
2. **Projects**: 7 hands-on projects where you build an agentic workspace from scratch.
3. **Resource Library**: Copy-ready templates (`AGENTS.md`, `feature_list.json`, `init.sh`, etc.) to use in your own repositories today.

## Quick Start: Improve Your Agent Today

You don't need to read all 14 lectures before you start getting value. If you're already using a coding agent on a real project, here's how to improve it right now.

The idea is simple: instead of just writing prompts, give your agent a set of structured files that define what to do, what's been done, and how to verify the work. These files live inside your repo, so every session starts from the same state.

```text
    YOUR PROJECT ROOT
    ├── AGENTS.md              <-- the agent's operating manual
    ├── CLAUDE.md              <-- (alternative, if using Claude Code)
    ├── init.sh                <-- runs install + verify + start
    ├── feature_list.json      <-- what features exist, which are done
    ├── claude-progress.md     <-- session progress (historical filename; agent-agnostic)
    └── src/                   <-- your actual code
```

Grab the starter templates from the [Resource Library](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) and drop them into your project. That's it. Four files, and your agent sessions will already be significantly more stable than running on prompts alone.

`claude-progress.md` is a generic, repository-local session progress log; the
name is retained for compatibility with the course examples. It is not tied to
Claude Code and is not updated automatically by any agent. Codex, OpenHands,
Antigravity, and other coding agents can use the same file when their root
instructions tell them to read it at startup and update it before handoff.

## Capstone Project: A Real App

All six course projects revolve around the same product: **an Electron-based personal knowledge base desktop app**.

```text
    ┌──────────────────────────────────────────────────────┐
    │             Knowledge Base Desktop App               │
    │                                                      │
    │  ┌──────────────┐  ┌──────────────────────────────┐  │
    │  │ Document List│  │       Q&A Panel              │  │
    │  │              │  │                              │  │
    │  │ doc-001.md   │  │  Q: What is harness eng?     │  │
    │  │ doc-002.md   │  │  A: The environment built    │  │
    │  │ doc-003.md   │  │     around an agent model... │  │
    │  │ ...          │  │     [citation: doc-002.md]   │  │
    │  └──────────────┘  └──────────────────────────────┘  │
    │                                                      │
    │  ┌─────────────────────────────────────────────────┐ │
    │  │ Status Bar: 42 docs | 38 indexed | last sync 3m │ │
    │  └─────────────────────────────────────────────────┘ │
    └──────────────────────────────────────────────────────┘

    Core features:
    ├── Import local documents
    ├── Manage a document library
    ├── Process and index documents
    ├── Run AI-powered Q&A over imported content
    └── Return grounded answers with citations
```

This project was chosen because it combines strong practical value, enough real-world product complexity, and a good setting for observing before/after harness improvements.

Each course project's starter/solution is a complete copy of this Electron app at that evolutionary stage. P(N+1)'s starter is derived from P(N)'s solution — the app evolves as your harness skills grow.

## Learning Path

The course is designed to be done in order. Each phase builds on the last.

```text
    Phase 1: SEE THE PROBLEM              Phase 2: STRUCTURE THE REPO
    ========================              ==========================

    L01  Strong models ≠ reliable         L03  Repository as single
         execution                              source of truth
    L02  What harness actually means
                                          L04  Split instructions across
         |                                     files, not one giant file
         v
    P01  Prompt-only vs.                       |
         rules-first comparison                v
                                               P02  Agent-readable workspace

    Phase 3: CONNECT SESSIONS             Phase 4: FEEDBACK & SCOPE
    ==========================            =========================

    L05  Keep context alive               L07  Draw clear task boundaries
         across sessions
                                          L08  Feature lists as harness
    L06  Initialize before every               primitives
         agent session
                                               |
         |                                     v
         v                                     P04  Runtime feedback to
    P03  Multi-session continuity                   correct agent behavior

    Phase 5: VERIFICATION                 Phase 6: PUT IT ALL TOGETHER
    =====================                 ============================

    L09  Stop agents from                 L11  Make agent's runtime
         declaring victory early               observable

    L10  Full-pipeline run =              L12  Clean handoff at end of
         real verification                      every session

         |                                     |
         v                                     v
    P05  Agent verifies its own work      P06  Build a complete harness
                                               (capstone project)

    Phase 7: AUTOMATE THE LOOP
    ===================