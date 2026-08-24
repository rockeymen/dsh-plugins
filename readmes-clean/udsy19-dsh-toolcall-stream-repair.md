# dsh-toolcall-stream-repair

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin that repairs malformed
**streaming tool-call deltas** from OpenAI-compatible gateways — before they assemble into a call the
harness cannot dispatch.

If you have seen `unknown tool ""`, a session that refuses to resume after a tool call, or two tool calls
whose arguments got concatenated into one unparseable blob, this plugin targets that failure at its
source.

## What actually goes wrong

The harness assembles a streamed assistant message with `BlockAssembler`
(`packages/llm/llm/src/assembler.ts`). Two lines make a malformed gateway response permanently corrupting:

```ts
// assembler.ts:71 — unconditional: a later empty id overwrites a good one
partial.toolCallId = chunk.id

// assembler.ts:112-117 — the intended fallback cannot fire for the EMPTY STRING
case 'tool-call': return {
  type: 'tool-call',
  id: partial.toolCallId ?? CallId(`call-${index}`),
  name: partial.toolCallName ?? '',
  arguments: partial.toolCallArguments,
}
```

`??` catches `null` and `undefined`, not `''`. And the shipped pi-ai adapter produces exactly `''` when a
gateway omits an id or a name (`packages/llm/llm-pi-ai/src/stream.ts:160-161`,
`partial?.type === 'toolCall' ? partial.id : ''`). So an absent identity becomes an empty identity,
survives every guard, and reaches the session log as a tool call with `name: ""`.

This plugin sits on the `llm/stream` waterfall, which runs **between the adapter and the assembler**
(`packages/core/agent-loop/src/agent.ts:346-352`). That position matters: the agent loop appends each
post-waterfall chunk to the session log as `assistant/chunk` *before* assembly, so repairing here fixes
the durable replay record too — not just the in-memory message.

```
adapter → [ llm/stream: this plugin ] → agent loop → assistant/chunk log → BlockAssembler → assistant/message
```

## Install

```sh
dsh plugin --profile <name> add dsh-toolcall-stream-repair
```

Then restart the profile — bundle membership is fixed at profile start
(`apps/cli/reference/README.md:55`).

> **Pin your harness packages.** The `latest` dist-tag on several `@deepseek-ai/dsh-*` packages points at
> a stale `0.0.1-rc.1` placeholder while the real release sits on `next` (verified 2026-08-23:
> `@deepseek-ai/dsh-llm` `latest → 0.0.1-rc.1`, `next → 0.1.1-rc.2`). This package therefore declares
> harness packages as **peer** dependencies with explicit `||` ranges and never as `dependencies` — a
> duplicate Cordis would give the plugin a different, empty service registry.

## Configure

Defaults are in `cordis.patch.yml`; override them in your profile's `cordis.patch.yml`.

### Key · Default · Meaning
- **Key**: `onUnrecoverableToolCall` · **Default**: `fail-request` · **Meaning**: A tool call that never received a name cannot be dispatched. `fail-request` replaces the response with a terminal `error` finish, which the loop reports through `agent/request-error` — so `dsh-llm-retry` can retry it — instead of logging an undispatchable call. `passthrough` restores stock behaviour.
- **Key**: `splitOnIdCollision` · **Default**: `true` · **Meaning**: Give a second call announced at an already-occupied block index its own block, instead of letting its arguments bleed into the first.
- **Key**: `closeTruncatedStream` · **Default**: `true` · **Meaning**: Emit a terminal `error` finish when the upstream stream ends with no terminal chunk at all.
- **Key**: `logRepairs` · **Default**: `true` · **Meaning**: Log each applied repair at debug level with its stable code.

## What it handles

Every row has a fixture in `tests/fixtures/` and a **negative control** — a test that asserts the
corruption is present without the fix. Remove a repair and its paired assertion flips.

### Code · Malformed shape · Without this plugin · With it
- **Code**: `unrecoverable-name` · **Malformed shape**: Gateway sends no `function.name` on any frame · **Without this plugin**: Assembles `name: ""` → `unknown tool ""`, logged and unresumable · **With it**: Terminal `error` finish; nothing corrupt is logged; retryable
- **Code**: `synthesized-id` · **Malformed shape**: Gateway sends no `id` on any frame · **Without this plugin**: Assembles `id: ""`; result cannot be paired with its call · **With it**: Mints `call-`, the value `assembler.ts:114` already intended
- **Code**: `empty-id-clobber` · **Malformed shape**: A continuation delta carries `id: ""` after a good one · **Without this plugin**: `assembler.ts:71` overwrites the good id with `""` · **With it**: Keeps the established id
- **Code**: `id-collision-split` · **Malformed shape**: Two distinct calls share one `tool_calls[].index` · **Without this plugin**: One block; arguments concatenated into invalid JSON; one call lost · **With it**: Two blocks, correct ids/names, each `arguments` separately parseable
- **Code**: `corrected-block-end` · **Malformed shape**: Terminal frame carries a weaker id/name than the deltas did · **Without this plugin**: The authoritative `block-end` overwrites good identity with `""` · **With it**: Restores identity from the deltas
- **Code**: `synthesized-block-start` · **Malformed shape**: Deltas arrive with no opening block · **Without this plugin**: Fails the harness's own stream grammar · **With it**: Synthesizes the opening block
- **Code**: `duplicate-block-start` · **Malformed shape**: An index is opened twice · **Without this plugin**: Fails the harness's own stream grammar · **With it**: Duplicate suppressed
- **Code**: `straggler-dropped` · **Malformed shape**: A delta arrives after its block closed · **Without this plugin**: Fails the harness's own stream grammar · **With it**: Dropped, matching what the assembler already does
- **Code**: `synthesized-block-end` · **Malformed shape**: Terminal finish arrives with a tool-call block still open · **Without this plugin**: Fails the harness's own stream grammar · **With it**: Corrected `block-end` synthesized first
- **Code**: `truncated-stream` · **Malformed shape**: Upstream iterator ends with no terminal chunk · **Without this plugin**: `LlmRuntime.adapterStream` returns without one (`index.ts:958-961`); the assembler reports a clean `stop` for a half-written call · **With it**: Terminal `error` finish
- **Code**: `recovered-name` · **Malformed shape**: A continuation delta omits `name` · **Without this plugin**: (Harmless — the assembler already guards this at `:72`) · **With it**: Reuses the established name

"Fails the harness's own stream grammar" means `validateStream`
(`packages/llm/llm/src/invariant.ts:36-84`) reports a violation. That validator is installed on
`llm/stream` with `{ global: true, prepend: true }`, i.e. as the **outermost** waterfall listener — so it
validates what this plugin emits. The test suite asserts every repaired fixture produces **zero**
violations against a transcription of that exact grammar.

Two control fixtures assert that a **well-formed** stream passes through byte-identically with zero
repairs reported.

## What it does **not** handle

Stated plainly, because a repair tool that overstates its reach is worse than none.

- **It cannot invent a tool name.** If no frame in the whole response names the tool, the call is
  unrecoverable. The plugin converts silent corruption into a loud, retryable error — it does not
  reconstruct the call. Nothing can.
- **Two nameless, id-less calls at one index are indistinguishable.** The split relies on a *non-empty*
  id changing. With no ids at all, there is no signal that a second call started, and the arguments still
  concatenate.
- **`max-tokens` truncation is deliberately left alone.** `BlockAssembler` already drops tool calls under
  `max-tokens` (`assembler.ts:136-138`); this plugin only closes the block so the stream stays
  well-formed.
- **Mid-stream adapter *failures* were already handled.** `LlmRuntime.adapterStream` converts an adapter
  throw into a terminal error finish (`packages/llm/llm/src/index.ts:940, 955`). The
  `truncated-stream` repair covers the narrower case of an iterator that ends **silently**, which that
  code path returns from without synthesizing a finish. For the shipped pi-ai adapter — which throws
  `STREAM_CLOSED` instead — this repair will not fire.
- **A consumer that ignores an `error` finish still sees the partial.** On `fail-request`, deltas already
  forwarded remain in the stream. The agent loop never reads `blocks()` after an error finish
  (`agent.ts:372-390`) and the supported partial read, `interruptedBlocks()`, omits tool calls by
  contract (`assembler.ts:161-178`). A custom consumer that calls `blocks()` on an errored stream anyway
  will still see the malformed block.
- **It does not repair sessions that are already broken.** This is prevention only. For repair of
  existing logs, see the projects below.
- **It does not touch text or reasoning content**, tool *results*, or the `session/*` event vocabulary.
- **No Web UI.** Host-side only; no `dsh.client` half.
- **It cannot help a gateway that is malformed at the HTTP level** — this plugin sees the adapter's chunk
  stream, not raw SSE bytes.

## Prior art — this is not the only tool in this space

Three existing projects address a weaker version of this problem. Check whether one of them fits you
better:

- **[Yukari316/dsh-toolcall-compat](https://github.com/Yukari316/dsh-toolcall-compat)** — the closest
  overlap: fixes tool-call JSON-schema misparsing for custom providers. In-band like this one, with one
  test file.
- **[Whning0513/deepseek-protocol-doctor](https://github.com/Whning0513/deepseek-protocol-doctor)** — a
  protocol *checker* with a test suite and CI, primarily a Python CLI. It diagnoses; it does not repair
  in band.
- **[jhuanxx44/dsh-sseye](https://github.com/jhuanxx44/dsh-sseye)** — an SSE debug console for inspecting
  what a gateway actually sent. Complementary: use it to capture the shape, this to fix it.

Related, adjacent: **[lokic7123-star/dsh-route-resilience](https://github.com/lokic7123-star/dsh-route-resilience)**.

For sessions that are **already** corrupt, the repair niche is well served — see
[`xiaoshenming/dsh-session-surgeon`](https://github.com/xiaoshenming/dsh-session-surgeon) (a spec-driven
repairer with 14 diagnostic codes) and
[`mayf3/dsh-session-doctor`](https://github.com/mayf3/dsh-session-doctor), among others. This plugin is
upstream of all of them: it tries to stop the log from breaking in the first place.

What this plugin offers that the above do not, as far as we could verify: a fixture corpus of malformed
gateway streams with a negative control per repair, and assertions against the harness's real
`BlockAssembler` and its real stream grammar rather than against a mock.

## Development

```sh
npm ci
npm run typecheck
npm run build
npm test          # 37 tests, fixture-driven, with negative controls
npm run test:built # loads lib/ under plain node and drives the real waterfall
```

Fixtures live in two families:

- `tests/fixtures/sse/*.sse` — OpenAI `chat.completion.chunk` frames, the format you capture from a
  gateway proxy. `tests/support/sse.ts` translates them the way an OpenAI-compatible adapter does. These
  are **authored to reproduce the shapes described in the linked reports**, not captured from a live
  gateway; the translator is a faithful model of the shipped adapter's observable behaviour
  (empty-string identity, 1:1 index mapping), not a copy of its internals.
- `tests/fixtures/chunks/*.json` — harness `StreamChunk` sequences, for malformations that arise at the
  adapter protocol level rather than on the wire. Each file documents the shape it covers and what
  produces it.

A test asserts the fixture list on disk matches the list the suite exercises, so a fixture cannot be
added and silently left untested.

## Compatibility

Developer preview: the harness states **"THERE WILL BE COMPATIBILITY-BREAKING CHANGES"** (`README.md:11`)
and there is no semver or deprecation policy at `0.1.1-rc.2`. Peer ranges use `||` unions across `-rc`
versions accordingly. Verified against deepseek-harness `b150a551b` (`release(dsh): 0.1.1-rc.2`).

## Licence

MIT.