# dsh-compaction-instant

Instant, near-lossless context compaction for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — a **drop-in replacement for `@deepseek-ai/dsh-compaction-basic`** that replaces LLM summarization with the deterministic conversation-compiler principle of [lllyasviel/VCC](https://github.com/lllyasviel/VCC).

A compaction compresses a shadowed history span in **milliseconds, with zero model calls**, keeping **original tokens only** — no paraphrase, no hallucination, no summarizer cost. Everything that is cut is still recoverable through `(seq N)` pointers into the durable session log.

## Key features

- **LLM-free** — compaction never invokes a model. No summarizer prompt, no inference latency, no token spend; the compile is deterministic text processing, so a million-token history compresses in milliseconds.
- **Near-lossless** — output contains only original tokens; every cut is marked and points at its durable `seq`, and prior checkpoints are copied verbatim.
- **Instant** — a single deterministic pass over the shadowed nodes; no network, no model, no KV-cache concerns.
- **Contract-exact drop-in** — same seam, events, provenance and failure vocabulary as `compaction-basic`; every built-in preset loads it unchanged (alias install).

## Example

A region containing a user request, an assistant text + tool call, and its result compiles to:

```
[user]
please fix the bug
[assistant]
on it
* read "a.js" (seq 2 -> result 3)
[user]
next question
```

Every tool call is ONE line: the key argument for whitelisted tools (`toolArgTools`), name-only for the rest (`* job_kill (seq 9 -> result 10)`), nothing at all for `hideTools` rows. Tool results never occupy entries — the `-> result N` pointer keeps them one `recall(type:"result")` away. Long user/assistant text is truncated to its budget with `...(truncated from seq N)`; every elision names the durable event that still holds the full content.

## Recall: the lossless read-back layer

The package also ships the counterparts that close the near-lossless loop — **same-session recall** for the agent and the human. Because the session log is append-only, every token the compiler ever elided is still recoverable:

### Entry point · Module · What it does
- **Entry point**: `recall` **tool** (model-facing) · **Module**: `dsh-compaction-instant/tool` · **What it does**: Typed restore: `type:"seq"` with `(seq N)`/`(seqs A-B)` markers, `type:"result"` with the `result N` pointer, `type:"checkpoint"` with a `[checkpoint N]` ordinal — restores exact original content into the current tool result
- **Entry point**: `search` **tool** (model-facing, grep) · **Module**: `dsh-compaction-instant/tool` · **What it does**: Keyword/regex search over the whole durable log — including content elided by compaction — returning matching events with their `(seq N)` pointers, ready for `recall`
- **Entry point**: `/recall` **command** (human, grep) · **Module**: `dsh-compaction-instant/command` · **What it does**: `/recall <keyword · regex>` appends a durable `form: "recall"` user message with the matching events and their seq pointers, so the next model turn sees them
- **Entry point**: Shared cores · **Module**: `dsh-compaction-instant/recall` + `dsh-compaction-instant/search` · **What it does**: Seq parsing (`12`, `3-7`, `seq 12` / `seqs 3-7`), log expansion, budgets, projection; regex compilation and hit rendering

Recall keeps **everything**: text, reasoning, raw tool-call arguments, nested tool-result content; log-only events render as labeled data dumps; missing seqs are reported; a `maxRecallTokens` budget (default **16000**) cuts with a provenance marker and counts the skipped remainder; searches cap shown hits (`maxSearchHits`, default **50**). Both plugins are separate rows, so they can be mounted next to **any** compaction backend — they only read the durable log.

Every checkpoint also frames a short **RECALL guide** at its head, telling the model exactly how to use `recall` / `search` to recover elided content. When a prior checkpoint is elided under cap pressure it never vanishes silently: it leaves a single `[checkpoint N]` line (N = compaction ordinal, 1 = oldest), which `recall(type:"checkpoint", id:"N")` restores in full.

## Configuration

All fields optional; defaults shown.

### Key · Default · Meaning
- **Key**: `thresholdRatio` · **Default**: `0.5` · **Meaning**: Fraction of the routed model's context window that triggers automatic compaction
- **Key**: `retainRatio` · **Default**: `0.05` · **Meaning**: Fraction of the context window kept verbatim at the surface tail
- **Key**: `retainTokens` · **Default**: — · **Meaning**: Exact tail budget; mutually exclusive with `retainRatio`
- **Key**: `manualRetainRatio` · **Default**: `0.05` · **Meaning**: Fraction of the measured surface kept verbatim by a manual `/compact` (so the recent conversation is never compiled away)
- **Key**: `manualRetainTokens` · **Default**: — · **Meaning**: Exact manual tail budget; mutually exclusive with `manualRetainRatio`
- **Key**: `auto` · **Default**: `true` · **Meaning**: Register `agent/pre-step` pressure and `agent/request-error` overflow recovery
- **Key**: `maxTokens` · **Default**: `8192` · **Meaning**: Floor of the total cap for one compiled checkpoint (density-aware tokens)
- **Key**: `checkpointScale` · **Default**: `0.1` · **Meaning**: The effective cap is `max(maxTokens, shadowed × checkpointScale)`, ceilinged at `checkpointCap` — a large span never crushes every entry into a sliver
- **Key**: `checkpointCap` · **Default**: `65536` · **Meaning**: Absolute ceiling of the scaled checkpoint cap
- **Key**: `textTokens` · **Default**: `512` · **Meaning**: Budget per assistant text block
- **Key**: `userTextTokens` · **Default**: `1024` · **Meaning**: Budget per user text block
- **Key**: `toolCallTokens` · **Default**: `128` · **Meaning**: Budget per tool-call one-liner (never rescaled — see the elision rules)
- **Key**: `toolResultExcerptTokens` · **Default**: `256` · **Meaning**: Accepted for compatibility; **inert** — tool results no longer occupy entries
- **Key**: `includeReasoning` · **Default**: `false` · **Meaning**: Keep reasoning blocks in the checkpoint
- **Key**: `stripNoiseXml` · **Default**: `true` · **Meaning**: Strip configured noise wrappers from user text
- **Key**: `noisePatterns` · **Default**: see compiler · **Meaning**: Noise XML regex sources, applied with the `s` flag
- **Key**: `toolKeyFields` · **Default**: built-ins · **Meaning**: Extra tool-name → argument-field map for one-liners
- **Key**: `toolArgTools` · **Default**: see compiler · **Meaning**: Whitelist whose key argument renders in the one-liner (`read`/`write`/`edit`/`glob`/`grep`/`bash`/`shell`/`web_search`/`skill`/`subagent`/…); every other tool is name-only
- **Key**: `hideTools` · **Default**: — · **Meaning**: Bookkeeping tools dropped from the checkpoint entirely
- **Key**: `modelPolicies` · **Default**: — · **Meaning**: Per provider/model overrides of `thresholdRatio`/`retain*` (basic-compatible shape)
- **Key**: `compactionRetries` / `maxOverflowRetries` · **Default**: `1` / `1` · **Meaning**: Retry budgets, same semantics as basic
- **Key**: `summarizationProvider` / `summarizationModel` · **Default**: — · **Meaning**: Accepted for config drop-in compatibility; **inert** — this backend never routes a model

The tool and command plugins each take their own `{ maxRecallTokens?: 16000, maxSearchHits?: 50 }` config.

> **Cordis config gotcha:** the plugin row's config passes through the schemastery schema, whose `~standard` adapter injects **`[]` for every absent array key** (`toolArgTools`, `hideTools`, `noisePatterns`, `toolKeyFields`, `modelPolicies`). The resolver treats an empty list as *unset* and falls back to the defaults — so a missing `toolArgTools` keeps the built-in whitelist (never disable it by writing `toolArgTools: []`; empty means default). `debug: true` writes per-compile diagnostics to the configured `debugLogPath` (default `$DSH_HOME/compaction-debug.log`).

Budgets are enforced twice — by token count and by a `budget × 4` character ceiling — so pathological unbroken runs (base64 blobs, minified files) cannot bypass them. Tool calls are **always one line**: they are never rescaled, and the cap loop shrinks only the conversation-text budgets (floor **32 tokens** each). If the compiled region still exceeds the (scaled) cap, the oldest **tool rows** are removed first (`[N tool/result entries elided: seqs a-b]`), and only then the oldest remaining entries (`[N earlier entries elided: seqs a-b]`) — tool calls can never squeeze the dialogue out. The newest content always survives.

### Browser settings card (Settings → Plugins)

Since 0.1.4 the engine exposes a **user-owned settings namespace** (`compaction-instant`) on every deployment that composes the settings domain (the standard web/desktop profiles do). The editable subset, persisted to `settings.yaml` and layered **over** the plugin row's cordis config:

### Field · Meaning
- **Field**: `checkpointScale` · **Meaning**: Checkpoint budget = shadowed tokens × this ratio
- **Field**: `checkpointCap` · **Meaning**: Absolute ceiling of the scaled budget
- **Field**: `maxTokens` · **Meaning**: Total compiler-token cap for one checkpoint
- **Field**: `auto` · **Meaning**: Register automatic between-step compaction
- **Field**: `debug` · **Meaning**: Write engine debug lines to the log file
- **Field**: `debugLogPath` · **Meaning**: Debug log path (empty = `$DSH_HOME/compaction-debug.log`)

Everything else (`modelPolicies`, `toolArgTools`, …) stays cordis-config-only. The settings layer never breaks the engine: every settings write is re-validated by the full config resolver before it is persisted, and non-exposed entry fields keep their composed values. Without a settings service the engine behaves exactly as before (composition entry only). The card is registered on the client bundle, so it appears without touching any deployment config beyond installing the package — restart `dsh web` once so the boot graph picks up the `dsh.client` bundle.

### Tokenizer and multilingual behavior

The tokenizer is a character-class heuristic: ASCII letter runs and digit runs count as one token each, punctuation is per-character, whitespace is free, and every other code unit is its own token. Concretely:

### Content · Tokens
- **Content**: CJK (`你好，世界！`) · **Tokens**: 1 per code point (6)
- **Content**: Cyrillic / Arabic · **Tokens**: 1 per code unit
- **Content**: Accented Latin (`café`) · **Tokens**: ASCII runs stay grouped (`caf` + `é`)
- **Content**: Emoji (`😀`) · **Tokens**: 2 (surrogate pair)

Every truncation, excerpt, and cap cut is taken at a **code-point boundary** — a slice never leaves a lone surrogate half, so emoji and other astral characters always reach the model intact (pinned by `test/multilang.test.js`). The character-density ceiling uses UTF-16 length, which is the conservative side for astral content.

The harness token meter (used for the shrink guarantee and `/compact` reporting) is a separate `chars / 4 + block overhead` estimator; the two deliberately coexist — see the top-level design notes.

## Guarantees

- **Instant** — the compile is a single deterministic pass over the shadowed nodes; no network, no model, no KV-cache concerns.
- **Near-lossless** — output contains only original tokens; every cut is marked and points at its durable `seq`; prior checkpoints are copied verbatim.
- **Contract-exact drop-in** — identical seam, events, provenance, pricing (via the singleton `ctx.tokenMeter`), and failure vocabulary as `compaction-basic`, including the shrink guarantee (a checkpoint that would not reduce the surface is rejected).
- **Optional pruner compatible** — consumes the optional `toolResultPruner` service exactly like basic (it helps the *retained tail*; the compiler collapses the *shadowed* region).

## Measured compression (real sessions, no drops)

Rates measured on real session logs (this project's own development sessions), compiled **without dropping a single entry** — every row survives, only per-entry truncation and one-line tool rows apply. Percentages are of the original token count.

### Load · Raw tokens · Compiled · Retained · Compressed
- **Load**: Tool-dense session, full (3,181 nodes: 1,438 tool calls + 1,540 results) · **Raw tokens**: 2,523,012 · **Compiled**: 226,205 · **Retained**: **9.0%** · **Compressed**: 91.0%
- **Load**: Another session, full (864 nodes) · **Raw tokens**: 685,088 · **Compiled**: 62,705 · **Retained**: **9.2%** · **Compressed**: 90.8%
- **Load**: Same tool-dense session, recent 800 messages · **Raw tokens**: 625,927 · **Compiled**: 45,031 · **Retained**: **7.2%** · **Compressed**: 92.8%
- **Load**: Pure text only (same session minus all tool rows) · **Raw tokens**: 160,963 · **Compiled**: 109,945 · **Retained**: **68.3%** · **Compressed**: 31.7%

Where the ratio comes from (no drops):

- **Tool results cost nothing** — results never produce entries; the `-> result N` pointer keeps each one one `recall` away. That is the biggest win.
- **Tool calls are one line** — each call collapses to a single row (≤ 128 tokens; ~100 on average).
- **Reasoning text is not retained** — reasoning deltas are elided entirely (marked, never silent).
- **Conversation text is nearly lossless** — the pure-text control retained 68.3%; the ~1.5x on text is mostly JSON wrapper stripping plus truncation of only the longest blocks.

Budget scan (same 2.5M-token tool-dense session): dropping starts at a cap of ~226K tokens (9% of the raw size — close to the default `checkpointScale` of 0.1, but the 64K hard cap cuts it short). Below that the cost is a cliff, not a slope:

### Cap · Compiled · Retained · Entries · Dropped
- **Cap**: 8,192 · **Compiled**: 8,243 · **Retained**: 0.33% · **Entries**: 111 · **Dropped**: 2,090
- **Cap**: 32,768 · **Compiled**: 22,263 · **Retained**: 0.88% · **Entries**: 232 · **Dropped**: 1,969
- **Cap**: 65,536 (deployment default) · **Compiled**: 55,737 · **Retained**: 2.2% · **Entries**: 325 · **Dropped**: 1,876
- **Cap**: 65,536 · **Compiled**: 55,737 · **Retained**: 2.2% · **Entries**: 325 · **Dropped**: 1,876
- **Cap**: 131,072 · **Compiled**: 131,047 · **Retained**: 5.2% · **Entries**: 1,142 · **Dropped**: 1,058
- **Cap**: 226,205 (no-drop threshold) · **Compiled**: 226,205 · **Retained**: 9.0% · **Entries**: 2,199 · **Dropped**: 0

## Installation

All three methods below install the package (published to npm as `dsh-compaction-instant`) with the harness's own plugin manager (which runs pnpm inside the profile directory, making the package resolvable to both the host composition and every agent preset):

```bash
dsh plugin --profile web add <spec>
```

`dsh-command-compact` (`/compact`) is backend-independent, so it keeps working unchanged in every method.

### Method 1 — Drop-in replace the built-in engine (alias)

```bash
dsh plugin --profile web add "@deepseek-ai/dsh-compaction-basic@npm:dsh-compaction-instant"
```

**dsh currently has no way to choose the compaction engine**, and the built-in agent presets (`standard`, `code`, `cordis`) pin the package name `@deepseek-ai/dsh-compaction-basic` in their compositions. To use this engine inside those built-in presets you therefore **masquerade as the built-in plugin**: preset rows resolve bare package names from the profile's `node_modules` (which outranks the harness installation), so installing our package under the built-in name makes every built-in preset load this engine automatically — no preset files are touched, and preset upgrades keep working.

The masquerade is safe by construction: this engine is a contract-exact drop-in — the same `ctx.compaction` seam, the **identical inject list** (`llm`, `tokenMeter`, `sessions`), the same event protocol and error vocabulary, and its `Config` accepts every key of basic's configuration surface. Removing the alias dependency restores the real basic.

This install is **not** recognized as a bundle (the harness resolves the name `@deepseek-ai/dsh-compaction-basic` from its own installation, which declares no `dsh.bundle`), so nothing is automatic — add the recall tools and `/recall` command to the profile's `cordis.patch.yml` yourself (new rows ride an `insert` list; the file hot-reloads, no restart needed). Row names must use the **alias package name**, the only one resolvable in this install; the engine row is optional, needed only as a host fallback for presets without compaction (e.g. `minimal`):

```yaml
- id: compaction-basic
  disabled: true                     # host-level swap (optional fallback)
- insert:
    - id: compaction-instant
      name: '@deepseek-ai/dsh-compaction-basic'   # host fallback for presets without compaction
    - id: tool-recall
      name: '@deepseek-ai/dsh-compaction-basic/tool'
    - id: command-recall
      name: '@deepseek-ai/dsh-compaction-basic/command'
```

### Method 2 — Direct install + AI-authored preset copy (dsh authoring mode)

```bash
dsh plugin --profile web add dsh-compaction-instant
```

Then open a session with the preset-authoring preset (the shipped `cordis` preset, "creation mode") and ask the AI to:

> Copy the `standard` preset and swap its compaction engine row to `dsh-compaction-instant`.

The AI uses `agentPresets.copy('standard', '')` to create a locally authored preset, swaps the compaction row's `name` in the copy, mount-validates it with `standingKeyFor('')`, and can set it as the default by patching the `agent-presets` row (`config.default: `). The new preset appears in the UI picker; the built-in presets stay untouched.

Since v0.1.1 the package also declares `dsh.bundle`, so the direct install registers itself as a **profile layer automatically**: the built-in summarizer row is disabled and the instant engine + recall tools are inserted host-side (see `cordis.patch.yml` in the package). No manual patch rows neede