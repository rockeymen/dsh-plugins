# dsh-plugin-memory

English | [中文](README.zh.md)

Session distillation memory for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): a `dsh-plugin` bundle that distills completed turns into durable knowledge entries and surfaces each entry to the model as a `memory-<slug>` skill. The mechanism ports a prior task-distillation design (distill on completion, `merge_with`-driven fusion, one Markdown entry per memory plus an index).

## What it does

- On every `turn/end` with reason `completed`, collects the turn's direct human question, final assistant answer, and tool calls. Answers whose tail asks the user for more input are skipped.
- One auxiliary model call distills the question/answer into strict JSON — `title`, `answer`, `sources`, and optionally `merge_with`, the slug of an existing entry the model judges same-topic. A reported `merge_with` triggers a second fusion call over the existing entry plus the fresh distill; a failed fusion keeps the fresh distill but still supersedes the old entry.
- Entries land in the memory directory (default `<DSH_HOME>/memory`): one `<slug>.md` Markdown file per entry plus a `_index.json` mapping slugs to records. Index writes are atomic (temp file + rename); entry writes serialize through one promise chain. Slugs are lowercase ASCII `[a-z0-9-]` (CJK titles fall back to a 12-hex SHA-1 digest), and model-reported slugs are validated before any path join.
- Every completed auxiliary call appends a log-only `memory/distill-call` session event (purpose, route, output cap, complete output blocks, optional usage), and every committed write appends a log-only `memory/distilled` event.
- When a `ctx.skills` service is mounted, the plugin registers the `memory` skill provider: one `memory-<slug>` candidate per entry at rank 550, below every hand-authored skill root. Loading a candidate returns the entry Markdown body as the skill content.

## Requirements

The plugin uses vocabulary shipped by the DeepSeek Harness memory change (`purpose: 'memory'` in `dsh-llm` and the `memory/*` session events): it requires a Harness build that includes that change. Older builds still load the plugin and distill correctly; only the DeepSeek thinking-disable mapping and the `memory/distill-call` replay vocabulary are lost.

## Install

From npm (prebuilt, no build permission needed):

```sh
dsh plugin --profile <name> add dsh-plugin-memory
```

From GitHub (sources; pnpm runs the package's `prepare` build after install):

```sh
dsh plugin --profile <name> add github:<owner>/dsh-plugin-memory
```

pnpm ≥10 requires allowlisting the git dependency's build script; copy the exact key `dsh` prints into the profile's `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  dsh-plugin-memory: true
```

From a local tarball:

```sh
pnpm pack
dsh plugin --profile <name> add ./dsh-plugin-memory-0.1.0.tgz
```

Then boot: `dsh --profile <name>`.

## Config

| Key | Type | Default | Meaning |
|---|---|---|---|
| `autoDistill` | boolean | `true` | Distill completed turns automatically. |
| `memoryDir` | string | `<DSH_HOME>/memory` | Memory directory. |
| `distillProvider` | string | session route | Explicit distill provider; must pair with `distillModel`. |
| `distillModel` | string | session route | Explicit distill model; must pair with `distillProvider`. |
| `maxTokens` | number | `3000` | Output token cap per distill or fusion call. |

Override the row by `id: memory` in your profile's `cordis.patch.yml`, e.g.:

```yaml
- id: memory
  name: dsh-plugin-memory
  config:
    autoDistill: false
```

## Service API

The service registers as `ctx.memory`:

- `list(): Promise<MemoryIndex>` — the current index, or an empty one when absent or corrupt.
- `readEntry(slug: string): Promise<string | undefined>` — one entry's Markdown body.
- `settled(session: Session): Promise<void>` — resolves once every distillation pending for the session settles.

The optional invariant companion (`dsh-plugin-memory/invariant`) validates the `memory/*` event payloads through `ctx.invariants`; harness builds that know this plugin may mount it as a separate row.

## Known Limitations and Deferred Work

- No content-safety policy equivalent to the reference implementation's pre-write filter; distilled answers are stored as produced.
- The incomplete-answer filter is marker-based and can both miss and misfire.
- One memory directory serves every session; per-workspace or per-agent scoping is deferred.
- The catalog lists every entry; there is no per-session cap or size-based eviction.

## Publishing

The GitHub repository should carry the [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic so marketplaces and aggregators discover it.

## License

MIT — [LICENSE](LICENSE). The plugin ports code from the MIT-licensed [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) repository.
