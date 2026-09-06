# dsh-plugin-monitor

An event monitor for [DeepSeek Harness](https://deepseek.com/harness/en/): arm a background
watch — a shell command or a WebSocket — and every stdout line (or text frame) is delivered to
the owning agent session as an asynchronous event. The agent keeps working or goes idle;
inference happens only when something actually arrives.

Modeled on Claude Code's `Monitor` tool. It covers the cases where an agent needs to react to
something as it happens rather than at the end: a dev server or test watcher reporting as it
recompiles, a log or queue the agent should respond to mid-task, a long build whose failures
should interrupt rather than wait, a socket feeding it messages. Without it the options are to
block on a command until it exits, or to poll on a timer — which spends a model turn on every
empty check and delays each event by up to a full interval.

## Status

Working, and verified end to end against a real dsh profile. Both producers are covered:

- **command** — per-line delivery, batching, labels, rate limiting and auto-kill, `job_kill`,
  and recovery of clipped output via `job_output`
- **websocket** — one event per text frame, multi-line frames kept intact, binary frames
  reported with their size, close codes and timeouts surfaced as job outcomes

74 unit tests, gated in CI on Linux and locally on macOS. The acceptance runs are recorded in
[`docs/design.md`](./docs/design.md).

## What dsh already has, and what this adds

The dsh background-job runtime (`ctx.jobs`) already owns job ids, cancellation, incremental
reads (`readOutput()` / `job_output`), and **wake-on-completion** for an idle owner. Separately,
`agent.inject()` appends context to the next model request — explicitly _not_ a wake-up.

This plugin extends that from completion-only to **per-output event**. Delivery is
`agent.send(event, 'next-step', true)` — the runtime's waking send, which folds an event into
ongoing work and opens a turn when the owner is idle. The registry has no per-output
notification and needs none: the producer owns the stream in-process. Around that sit the
operational details that make it survivable:

- line/frame granularity — each output line is one event
- short-window batching (~200ms) so multi-line bursts arrive as one notification
- rate limiting with auto-kill on firehoses
- a per-monitor label carried in every notification
- timeout by default, opt-in session-length persistence, stoppable via `job_kill`

## Development

Bun + Biome for local development (the published package is plain JS in `dist/`, so this is
invisible to consumers):

```sh
bun install
bun run build     # tsc → dist/
bun run check     # biome
```

Install into a dsh profile from a local checkout — note `dsh plugin add` forwards to **pnpm**
on the consumer side, and git installs need the `prepare` script allowlisted in the consumer's
`pnpm-workspace.yaml`; neither constrains this repo's own tooling:

```sh
dsh plugin --profile dev add /path/to/dsh-plugin-monitor
```

Add it to the profile you actually **boot** — the web UI runs the `web` profile, so installing
into `dev` and then launching the web UI is a correct command aimed at the wrong target. Verify
before launching:

```sh
dsh --dump-config | grep monitor
```

### Tuning the delivery budgets

Optional. The defaults are the policy for almost everyone; override only if a
source legitimately needs more headroom, as a `config:` block on the profile entry:

```yaml
- id: monitor
  name: dsh-plugin-monitor
  config:
    maxEventBytes: 32768 # bytes in one delivered event (default 16 KiB)
    throttleBytes: 262144 # bytes per 10s before throttling (default 128 KiB)
    killBytes: 1048576 # bytes per 10s before the monitor is stopped (default 512 KiB)
    spillBytes: 524288 # capacity for event-clipped output (default 256 KiB)
```

Config is validated at load, so a mistyped budget fails the boot rather than the
first overflowing event. Output clipped from an event is recoverable with
`job_output `; the event says how many bytes were delivered and which spill
block holds the rest.

## If tool calls start failing after installing a plugin

```
Cannot read properties of undefined (reading 'prepare')
```

Every tool call in the profile fails, including ones unrelated to the plugin you just added. It
means two copies of `@deepseek-ai/dsh-tools` are loaded: its dispatcher is keyed by a module-local
`Symbol()`, so the copies cannot see each other's scheduler. It is a dsh packaging issue rather
than a plugin bug — see deepseek-harness discussion
[#1849](https://github.com/deepseek-ai/deepseek-harness/discussions/1849). This package declares
the harness packages as peers and ships no runtime dependencies, so it should not introduce a
second copy; to find one that did:

```sh
ls $DSH_HOME/profiles/<name>/node_modules/@deepseek-ai
```

## Layout

- `src/index.ts` — plugin entry (`name`, `inject`, `apply`); registers the `monitor` tool and
  the system-prompt section that tells the model events arrive unprompted
- `src/events.ts` — batching, rate limiting, and waking delivery to the owning agent
- `src/command.ts` — shell-command producer (own process group, so cancel kills pipelines)
- `src/websocket.ts` — WebSocket producer (one event per text frame)
- `src/lines.ts` — line splitting across chunk boundaries
- `cordis.patch.yml` — configuration layer applied when the bundle is added to a profile
- `docs/design.md` — design notes and open questions

## References

- [Plugin development guide](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/)
- [Tool authoring](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/tool)
- [Tool authoring cookbook (background work)](https://deepseek-harness.github.io/deepseek-harness/en/reference/cookbook/adding-a-tool)
- [Background job runtime design note](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/architecture/2026-06-20-generic-long-running-tool-runtime.md)