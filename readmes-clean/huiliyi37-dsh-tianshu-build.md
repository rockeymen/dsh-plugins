# Tianshu Harness (天枢)

Tianshu Harness (`tianshu`) is a full-capability open-source coding agent: an agent harness with vision, cross-session memory, verification gates, agent routing, semantic + graph code retrieval, file rewind, and a full-screen terminal UI — all composed as plugins.

It is a friendly fork of [DeepSeek Harness](https://github.com/deepseek-ai) (`dsh`, MIT) released under the **Apache License 2.0**. The fork point is the 2026-08 baseline; this line evolves independently and does not track upstream. See [NOTICE](NOTICE) for the full attribution.

It keeps the upstream architecture where **everything is a plugin**.

## Install

Run it straight from npm:

```sh
npx @huiliyi37/dsh-tianshu tui
```

Or install globally:

```sh
npm i -g @huiliyi37/dsh-tianshu
tianshu tui
```

For development (or to hack on the harness itself), run from a repository checkout — requires `git`, Node `^22.19 || >=24`, and `pnpm`:

```sh
git clone https://github.com/huiliyi37/dsh-tianshu-build.git
cd dsh-tianshu-build
pnpm install
pnpm run build
pnpm tianshu web
```

## What the full build adds

Beyond the upstream baseline (files, shell/PTY, skills, tasks/goals/plans, subagents and workflows, sandboxing and approvals, resumable sessions, LSP, web access, context compaction, loop-hygiene guards), this monorepo ships the differentiated capability set:

### Capability · Package · What it does
- **Capability**: Vision bridge · **Package**: `@huiliyi37/dsh-vision-bridge` · **What it does**: A text-only primary still reads user images: a dedicated vision model describes attachments and injects the description at `agent/pre-step`.
- **Capability**: Vision co-pilot · **Package**: `@huiliyi37/dsh-vision-ask` · **What it does**: Session-scoped image registry + `ask_image` tool: the main model re-interrogates any retained image, any number of times, without the user re-sending it.
- **Capability**: Project memory · **Package**: `@huiliyi37/dsh-memory` · **What it does**: Cross-session recall (BM25 hybrid over structured claims and knowledge notes) with a quality gate on writes; `/memory`, `/remember`.
- **Capability**: Evidence gate · **Package**: `@huiliyi37/dsh-evidence-gate` · **What it does**: RED→GREEN discipline for bugfix tasks: edits gated on a failing-first verification account.
- **Capability**: Agent router · **Package**: `@huiliyi37/dsh-agent-router` · **What it does**: Base metrics → routing algorithm → MoE-style dispatch onto native subagents.
- **Capability**: Pheromone · **Package**: `@huiliyi37/dsh-pheromone` · **What it does**: File-level stigmergy: session-scoped spatial memory via exponential-decay signals (fragile / entry-point / …).
- **Capability**: Semantic index · **Package**: `@huiliyi37/dsh-semantic-index` · **What it does**: Workspace retrieval: file-level BM25 (CJK-bigram aware) over definition-aligned chunks, optional vector layer fused via RRF; powers `semantic_search`.
- **Capability**: Meridian · **Package**: `@huiliyi37/dsh-meridian` · **What it does**: Codebase graph index (tree-sitter → sqlite): repo map, impact analysis, flow queries, behavior signals; powers `repo_graph`.
- **Capability**: File rewind · **Package**: `@huiliyi37/dsh-fs-snapshot` · **What it does**: Pre-write snapshots of every file a write tool touches, backing `/rewind`'s code/both granularity.
- **Capability**: Git seam · **Package**: `@huiliyi37/dsh-git` · **What it does**: Typed git capability service (`GitLocal` CLI provider, typed `GitError`s) consumed by tools and UI.
- **Capability**: Terminal UI · **Package**: `@huiliyi37/dsh-tui` · **What it does**: Full-screen TUI on the Tianshu (opencode-tui) render core — Apache-2.0 provenance chain preserved.
- **Capability**: Spark anchors · **Package**: `@huiliyi37/dsh-spark-anchors` · **What it does**: Pairs with reasoning-truncating provider routes: re-injects excluded paths so the model does not re-derive ruled-out options.

## Use Tianshu

### Web UI

For the recommended local interface, start the Web UI from the npm install (`tianshu web`) or from a built checkout:

```sh
pnpm run build
pnpm tianshu web
```

The Web UI is served at `http://127.0.0.1:3080` by default.

### Profiles

`tianshu` boots profiles — ordered stacks of plugin-bundle patch layers under your own overrides in `$DSH_HOME/profiles/<name>`:

```sh
tianshu --profile web                       # the browser UI (same as: tianshu web)
tianshu plugin --profile tui add   # install a plugin into a custom profile
tianshu --profile tui                       # boot it
```

The [CLI contract](apps/cli/README.md#profiles) describes profile layout, layer semantics, and config dump commands.

### Terminal UI

Start the full-screen terminal interface:

```sh
tianshu tui          # or: tianshu --profile tui
```

The TUI is a port of the Tianshu (opencode-tui) render core adapted to the harness seams. Type `/` to open the command menu — ↑↓ to select, Tab to accept, Enter to submit, Esc to close. Press `Ctrl+.` any time for the shortcut map.

**Slash commands**

### Command · Effect
- **Command**: `/session` · **Effect**: session management (list / switch)
- **Command**: `/fork [directive]` · **Effect**: fork the current session (history copied) and switch; optional first message
- **Command**: `/branch` · **Effect**: alias of `/fork`
- **Command**: `/model [provider/model]` · **Effect**: view or switch the model (hot-swaps the live session; `spark-flash` / `spark-pro` aliases switch to DeepSeek Spark)
- **Command**: `/theme [name]` · **Effect**: switch themes
- **Command**: `/clear` · **Effect**: clear the current conversation's scrollback
- **Command**: `/compact` · **Effect**: compact the current session's context
- **Command**: `/steer <text>` · **Effect**: mid-turn steering (redirect without interrupting)
- **Command**: `/status` · **Effect**: status panel (5-domain projection snapshot)
- **Command**: `/config` · **Effect**: settings panel (settings / permission / credentials)
- **Command**: `/skills` · **Effect**: skill browser panel
- **Command**: `/subagents` · **Effect**: delegation-tree panel
- **Command**: `/workflow` · **Effect**: running-workflow panel
- **Command**: `/tasks` · **Effect**: task panel (background tasks)
- **Command**: `/goal` · **Effect**: goal management (create / pause / resume / complete / block)
- **Command**: `/memory` · **Effect**: memory browser (list / filter / delete / preview)
- **Command**: `/remember <text>` · **Effect**: save a memory
- **Command**: `/rewind` · **Effect**: two-phase rollback (message list → granularity)
- **Command**: `/btw <question>` · **Effect**: side-question to the background agent
- **Command**: `/doctor` · **Effect**: terminal diagnostics with fix guidance
- **Command**: `/mcp` · **Effect**: list connected MCP servers and tools
- **Command**: `/export [path]` · **Effect**: export the current session's transcript to a Markdown file
- **Command**: `/density` · **Effect**: toggle compact tool-card rendering
- **Command**: `/permission` · **Effect**: switch the permission preset (workspace-write / danger-full-access)

**Keyboard shortcuts**

### Key · Effect
- **Key**: `Ctrl+N` · **Effect**: new session
- **Key**: `Ctrl+S` · **Effect**: resume the most recent session
- **Key**: `Ctrl+Q` · **Effect**: quit
- **Key**: `Ctrl+P` · **Effect**: command palette
- **Key**: `Ctrl+.` · **Effect**: shortcut map overlay
- **Key**: `Ctrl+F` · **Effect**: history search (n/N jump)
- **Key**: `Ctrl+O` · **Effect**: open the input line in `$EDITOR`
- **Key**: `Ctrl+T` · **Effect**: mid-turn steer
- **Key**: `Ctrl+V` · **Effect**: paste the system-clipboard image (clipboard-text fallback when the clipboard holds no image)
- **Key**: `Alt+W` · **Effect**: copy the selection to the system clipboard (OSC52)
- **Key**: `Shift+Tab` · **Effect**: cycle mode: normal → plan → always-approve
- **Key**: `Tab` · **Effect**: `@`-path completion; accept a slash-menu selection
- **Key**: `↑/↓` · **Effect**: input history (menu selection while the slash menu is open)
- **Key**: `PageUp/PageDown` · **Effect**: page the slash menu
- **Key**: `Esc` · **Effect**: close the slash menu or overlays

**Interaction**

Tool approvals prompt inline as `⚠ 允许执行 …？[y/N]` with a unified diff preview above the prompt. Subagent runs appear as spinner lines in the live region and settle into ✓/✗/◌ scrollback entries on completion. The bottom three rows are the input line (with a bottom-edge line colored by mode), the footer (mode badges + shortcut hints), and the metrics row (model / token usage / cache hit rate).

**Image paste and terminal preview**

`Ctrl+V` (or right-click / terminal-menu paste) reads the system clipboard image — macOS `osascript`, Linux `wl-paste`/`xclip`, Windows PowerShell — and attaches it; pasting text that looks like an image path loads the file as an attachment instead. Attached images render as a `📎 N images` marker above the input line and, on submit, as inline terminal graphics (kitty / iTerm2 protocols) under the user bubble. The bubble carries a vision hint: an image-capable primary sees the image directly; a text-only primary with a vision bridge configured gets the image described by the vision model first; with neither, the TUI warns that the image was not sent (and does not submit it).

**Vision bridge (optional)**

`dsh-vision-bridge` lets a text-only primary still read user images: at `agent/pre-step` it describes image attachments through a dedicated vision model and injects the description as a plugin-source user message (model-visible ⟺ logged; bridge failure degrades to a visible note, never a failed turn). Enable by adding the plugin with a vision-capable provider/model:

```yaml
# cordis.yml
- id: vision-bridge
  name: '@huiliyi37/dsh-vision-bridge'
  config:
    provider: deepseek-official   # any registered llm route that can see images
    model: <vision-capable model>
```

and set the TUI's `vision` state (in the `tui-runner` bundle config) so the bubble hint reflects the bridge: `supportsVision: false`, `bridgeEnabled: true`.

**Vision co-pilot (`ask_image`, optional)**

`dsh-vision-ask` goes one step further than the bridge: every image the user attaches is registered in a session-scoped registry under a short id (`img_1`, …), and the `ask_image` tool lets the main model re-interrogate any retained image — different questions, different angles — without the user re-sending it. A multimodal primary gets the original image forwarded back; a text-only primary gets a vision-model answer about the image. See [`packages/tui/vision-ask`](packages/tui/vision-ask/README.md) for configuration.

**DeepSeek Spark mode**

The `deepseek-spark` provider route truncates assistant reasoning to the tail N tokens on the wire (flash 300 / pro opt-in), keeping the model's context lean; `dsh-spark-anchors` pairs with it, re-injecting the excluded paths so the model does not re-derive ruled-out options. Enable once — settings hot-reload, no restart:

```yaml
# settings.yaml
llm-deepseek:
  spark:
    enabled: true
```

then switch with `/model spark-flash` or `/model spark-pro` (aliases for `deepseek-spark/deepseek-v4-flash` / `deepseek-spark/deepseek-v4-pro`). Spark shares the DeepSeek API key — no extra configuration. `dsh-spark-anchors` mounts with the `tui` bundle, so the anchor compensation is live once a session runs on the `deepseek-spark` route; a self-assembled profile adds it explicitly (see the [package README](packages/context/spark-anchors/README.md)).

### Headless

Run one task, print the final answer, and exit:

```sh
tianshu run "summarize this workspace"
```

### Automation and SDKs

From a source checkout with `DEEPSEEK_API_KEY` in the environment or its root `.env`, start the ACP automation server:

```sh
pnpm run demo:acp
```

The [Python SDK](python/README.md) drives a bundled JSON-RPC runtime. The [examples](examples/README.md) cover the runnable headless, ACP, JSON-RPC, Code Mode, and self-referential compositions.

## Architecture

- **Everything is a plugin.** Models, tools, policies, storage, context management, and interfaces are composable [Cordis plugins](docs/user/develop/basic/index.md), so deployments can extend or replace behavior without forking the agent loop. See the [architecture](docs/architecture.md) for the underlying design.
- **Runs are reconstructable.** Anything visible to the model is logged in the authoritative session stream; persistence, resume/fork/query, replay, telemetry, and UIs derive from the same events. See the [session-log architecture](docs/architecture.md#session-log).
- **Code Mode (opt-in).** It exposes a `run_code` tool and a generated TypeScript SDK; only program output re-enters model context. See [Code Mode](packages/core/tools/README.md#code-mode).
- **Self-referential Cordis tools are opt-in.** They let the agent inspect its live runtime and mount or unmount plugins while it runs. See the [Cordis tools](packages/self-modification/tool-cordis/README.md).

## Telemetry

Disabled by default — nothing is uploaded anywhere. To stream session telemetry to your **own** OTLP/HTTP collector, set `DSH_TELEMETRY_OTLP_URL` (e.g. `https://collector.example.com/v1/logs`). A non-empty `DSH_TELEMETRY_DISABLED` force-disables it regardless of other settings.

## Relationship with upstream `dsh`

This project forked from DeepSeek Harness (MIT) at the 2026-08 baseline and evolves independently — it does not track upstream releases, and its packages live under the `@huiliyi37/*` npm scope (CLI: `@huiliyi37/dsh-tianshu`, bin `tianshu`) so the two lines never collide. The repository is licensed under the Apache License 2.0; upstream attribution is preserved in [NOTICE](NOTICE), and the TUI package carries its own Apache-2.0 provenance chain ([LICENSE](packages/tui/tui/LICENSE) / [NOTICE](packages/tui/tui/NOTICE) / [SOURCE-MAP](packages/tui/tui/SOURCE-MAP.md)). The plugin-only distribution (`dsh-tianshu-tui` as an upstream-`dsh` plugin) is paused for now; this full monorepo is the maintained line.

## Development

Start with the [development guide](docs/development.md) and read the [architecture](docs/architecture.md) before changing packages.

For agents, follow [AGENTS.md](AGENTS.md).