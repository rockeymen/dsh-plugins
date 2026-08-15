# dsh-subagent-max

> Multi-panel live subagent viewer for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/DeepSeek-Harness), plus a `subagent_with_model` tool for per-call model/provider override.

## Screenshots

**Subagents tab** — a card grid grouped into active / inactive and sorted by last activity.

![Subagents tab](docs/subagents-tab.png)

**Floating viewer panel** — a draggable panel streaming a subagent's live output: task, reasoning, tool calls, and text.

![Floating viewer](docs/viewer-panel.png)

A two-face DSH plugin:

- **Host face** (`lib/index.js`) — a Cordis plugin that registers the `subagent_with_model` tool, a thin wrapper over `ctx.subagents` that forwards `model` / `provider` into the child's `agentOptions`.
- **Client face** (`lib/client.js`) — a Web UI that renders every subagent as a draggable, resizable floating panel with live token-by-token output, plus a **Subagents** tab with a card grid.

## Features

- **Per-call model / provider override** — delegate to a subagent and pick its model explicitly.
- **Multi-panel live viewer** — open several subagent panels at once; each streams output in real time.
- **Rich block rendering** — prompt block, reasoning (think) blocks, tool-call cards with input/output, streaming shimmer, markdown.
- **Subagents tab** — card grid grouped into active / inactive and sorted by last activity; shows model, tokens, steps, context % and relative update time.
- **Drag to pop out** — drag a card onto the canvas to open its panel exactly where you drop it (with a ghost preview).
- **Notifications** — side-top toasts when a subagent starts or receives a message.
- **i18n** — zh / en, switchable from DSH settings.

## Install

```sh
dsh plugin --profile web add @aaravarr/dsh-subagent-max
```

or, manually, place the package under `/node_modules/@aaravarr/dsh-subagent-max/` and add the entry to `cordis.patch.yml` (see [Config](#config)).

## Config

```yaml
- insert:
    - id: dsh-subagent-max
      name: '@aaravarr/dsh-subagent-max'
      config:
        subagentProvider: spawn        # spawn | fork | acp
        toolName: subagent_with_model
        backgroundMode: continuable    # one-shot | continuable
        maxDepth: 3
```

### Field · Type · Default · Description
- **Field**: `subagentProvider` · **Type**: string · **Default**: `spawn` · **Description**: Subagent transport provider.
- **Field**: `toolName` · **Type**: string · **Default**: `subagent_with_model` · **Description**: Model-facing tool name; must be unique among loaded tools.
- **Field**: `backgroundMode` · **Type**: string · **Default**: `one-shot` · **Description**: `continuable` returns a durable subagent id; `one-shot` runs foreground.
- **Field**: `maxDepth` · **Type**: number · **Default**: `3` · **Description**: Absolute delegation-depth cap for children (`0` forbids further delegation).

## Usage

Ask the model to delegate with an explicit model:

> Start a subagent with `deepseek-v4-flash` to review this repo's test coverage.

Tool parameters:

### Arg · Type · Required · Notes
- **Arg**: `model` · **Type**: string · **Required**: yes · **Notes**: Child model id (e.g. `deepseek-v4-pro`, `deepseek-v4-flash`, `k3-256k`).
- **Arg**: `provider` · **Type**: string · **Required**: no · **Notes**: LLM provider route; omitted = inherit the parent's provider.
- **Arg**: `description` · **Type**: string · **Required**: yes · **Notes**: Short (3-5 word) task label.
- **Arg**: `prompt` · **Type**: string · **Required**: yes · **Notes**: Complete, self-contained task.
- **Arg**: `run_in_background` · **Type**: bool · **Required**: no · **Notes**: Background routing; default follows `backgroundMode`.

## Known Limitations

- Model display is derived from the session's `request/header`; it can be absent for some children.
- Last-activity time is tracked client-side and cached in `localStorage`; the first open after a fresh load may fall back to the session's `updatedAt`.
- Client UI targets the web platform only.

## Development

```sh
pnpm install
node --check lib/index.js lib/client.js
```