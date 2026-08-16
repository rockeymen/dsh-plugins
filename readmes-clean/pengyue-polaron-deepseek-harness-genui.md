# DeepSeek Harness GenUI

![A task becomes an interface, saved choices return to the task, and later actions wait for approval](assets/hero-en.png)

DeepSeek Harness GenUI is a runtime interface layer for Agent tasks. When text gets in the way, the Agent can make the current task grow a focused UI—to explain a difficult relationship, collect a complex decision, or operate a connected tool.

  
    Built for the taskGenerated from the current context and shown Inline, in Canvas, or on localhost. No separate app to design or deploy.
    Choices return to the taskSaved selections, inputs, drafts, and progress remain available for a later Agent turn to read.
    Connected to real toolsCalls to declared Harness/MCP tools and declared credential-free public HTTPS endpoints run only after task-scoped approval.
  

> **The interface is not the output. It is part of the conversation.**

In that conversation, the UI can be Agent output, structured user input, and—after approval—an entry point to real tools.

## What Changes

###  · What it creates · What happens next
- App builder · **What it creates**: A standalone app to keep or share · **What happens next**: The app becomes the product
- MCP Apps · **What it creates**: A prepared UI shipped by a tool author · **What happens next**: The UI stays attached to that tool
- DeepSeek Harness GenUI · **What it creates**: The interface missing from the current task · **What happens next**: Saved state returns to the Agent, and approved tools can continue the work

## When an Interface Helps

It does two jobs: make difficult relationships visible, and turn awkward text-based choices into direct manipulation.

  
    Pick calendar slotsTurn candidate availability into a short list of useful 90-minute writing blocks.The interface saves the three choices to the task. A later calendar action remains separate and asks for approval.
    ![English interface for choosing three writing slots](screenshots/en/calendar-planner.png)
  
  
    Explore photosynthesisMove light, carbon dioxide, temperature, and stomatal controls to find the limiting step.The diagram changes with the controls, making each variable's effect easier to explore than to describe.
    ![English interactive photosynthesis model with four causal controls](screenshots/en/photosynthesis-explorer.png)
  
  
    Trace a code pathAsk from the CLI for a source-grounded explanation of a real project flow.The result is a local explorer with files, functions, branches, and the path selected by the user.
    ![English source-grounded code path explorer returned from a CLI request](screenshots/en/code-path-explorer.png)
  

Plain questions, rewriting, summaries, and simple lists stay in prose.

## Inline & Canvas

The same app can sit inside the answer or open beside the conversation.

### Inline · Canvas
- **Inline**: ![An interactive code path shown inline in a DeepSeek Harness conversation](screenshots/en/code-path-inline.png) · **Canvas**: ![The DeepSeek Harness sidebar, conversation, and code-path explorer visible together in the right-side Canvas](screenshots/en/code-path-canvas.png)
- **Inline**: A compact control or focused choice. · **Canvas**: More room without covering the conversation.

Inline, Canvas, full screen, and localhost read and write the same task state. Selections and inputs saved by the interface remain available to later Agent turns.

## CLI Example

The terminal profile returns a localhost app. A follow-up can refer to the path already selected in that app.

```text
❯ Explain how a generated app reaches the permission-gated runtime in this
  repository. Build an interactive code-path explorer and return a localhost URL.

  I mapped src/tools.ts → src/artifacts/builder.ts → src/runtime/server.ts
  → src/artifacts/registry.ts.

  http://127.0.0.1:/genui/app/<task-app>

❯ Where does the path I selected stop?

  It reaches the permission check in src/runtime/server.ts, then stops before
  the connected tool runs because access has not been allowed.
```

## How It Works

1. The Agent keeps the explanation in the conversation and creates one focused interface when interaction adds value.
2. It writes React + TypeScript and declares only the exact connected Harness/MCP/Skill tools or credential-free public HTTPS prefixes it needs; the plugin then builds and checks the interface.
3. The interface saves semantic values—selections, form answers, drafts, and progress—to the task. When the user follows up, the Agent can read those values instead of asking them to repeat the result.
4. Later edits update the same app without replacing a working version with a failed one.

Before the first use of each declared capability, Harness asks for task-scoped approval; undeclared calls are blocked. In Web, access can be reviewed or revoked from the app card. MCP credentials never enter generated code, while direct API requests are limited to credential-free public HTTPS.

## Design MD

Visual direction lives in `DESIGN.md`. Four profiles are included:

### Profile · Best fit
- **Profile**: `editorial-workbench` · **Best fit**: Reading, planning, forms, and content-heavy work
- **Profile**: `ledger-grid` · **Best fit**: Comparisons, schedules, evidence, and shortlists
- **Profile**: `field-atlas` · **Best fit**: Scientific, causal, and spatial explanations
- **Profile**: `kinetic-signal` · **Best fit**: Changing data, connected tools, and user-triggered actions

Open **Settings → Plugins → Plugin configuration** to use automatic selection, choose a profile, import a `DESIGN.md`, or export one as a starting point. The choice applies to new apps without adding design controls to them.

## Install

Use Node.js `^22.19.0 || >=24`. This release is tested with DeepSeek Harness `0.1.0-rc.6`.

```sh
dsh plugin --profile web add dsh-plugin-genui
dsh plugin --profile web exec playwright install chromium
dsh --profile web
```

The Web profile supports Inline, Canvas, full screen, and localhost links. For a terminal profile, replace `web` with `tui`; TUI returns localhost links and does not embed Canvas. Connect MCP servers to the same profile as usual.

## Safety

Generated code runs in a sandbox. Tool calls and public HTTPS routes must be declared, scoped, and approved. Temporary links and grants expire after 7 days; saved task state expires 7 days after its last update. Return to the app card in the task to review or remove access.

The plugin uses DeepSeek Harness + Cordis, React 18 + TypeScript, esbuild, Playwright, and Vitest.

## Development

Building from source requires pnpm 11.

```sh
pnpm install
pnpm run typecheck
pnpm test
pnpm run package:plugin
```

[Acceptance scenarios](examples/real-user-scenarios.md) · [Screenshot guide](docs/CAPTURE_GUIDE.zh-CN.md) · [Contributing](CONTRIBUTING.md) · MIT