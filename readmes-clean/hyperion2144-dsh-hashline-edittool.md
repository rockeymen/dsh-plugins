# dsh-hashline-edittool

  Line-anchored edit tool for DeepSeek Harness
  Powered by `<line>#<hash>` positioning — chained edits skip the re-read, fewer tokens, more context space for real work.

  English ·

  Forked from [Rianico/dsh-better-edit](https://github.com/Rianico/dsh-better-edit) — maintained independently from here on.

> *"The harness — not the model — is the bottleneck."*
> — Can Bölük, [*The Harness Problem*](https://stencil.so/blog/the-harness-problem)

Most edit tools ask the model to echo the old code **token-for-token** before it can change anything
— and that's exactly where agents fail: 46–51% patch-format failure rates for several models with
replace-style edits. **dsh-hashline-edittool** goes deeper. Every line of a file gets a
unique `<line>#<hash>` marker (absolute line number + 3-char content hash), and edits target
those markers. The old text is never echoed, the hash half survives edits above, and every
resolved range is verified against exactly what the model saw — wrong-line edits cannot silently
land, and the post-edit `Shift:` block lets the model chain the next edit without a re-read.

## Why you need this

`str_replace` makes the model re-type the code it's replacing — pure transcription cost (output tokens, billed ~5-6× input), and where agents fail most: 46–51% patch failures on real models, worse on bigger blocks, each failure costing a re-read and a retry.

Hashline sends two `<line>#<hash>` anchors instead of the old text — **26% fewer edit tokens** (24–45% on multi-line ranges) — and verifies every range against what the model saw: an edit lands where you meant, or fails loudly with fresh anchors. Anchors are content addresses that survive edits above; chained edits skip the re-read by reading the post-edit `Shift:` block — and a leaner context keeps the model's attention on the code, not on re-transcribing it.

Not for one-line touch-ups (near parity) or new files (`write`). It pays off in long sessions and structural edits — anywhere an edit must not land on the wrong line.

## Quick Start

### Install

```sh
npx @deepseek-ai/dsh plugin --profile web add github:hyperion2144/dsh-hashline-edittool   # from github
npx @deepseek-ai/dsh plugin --profile web add dsh-hashline-edittool   # from npm
npx @deepseek-ai/dsh plugin --profile web add /path/to/dsh-hashline-edittool   # from a local checkout
```

The profile's next session runs with the hashline tools installed. To verify the layer is active:

```sh
dsh --profile <name> --dump-config   # shows a "# == dsh-hashline-edittool" layer
```

### Requirement · 
- **Requirement**: Node · `^22.19.0 \ · \ · >=24.0.0` (dsh's requirement; the store uses `node:sqlite`)
- **Requirement**: Profile · a dsh profile (`dsh plugin` initializes one on first use)
- **Requirement**: Backends · sandboxed / remote filesystems supported (writes go through `ctx.fs`)

`read` returns every line as `<line>#<hash>:<content>` — the absolute line number (1-indexed) plus a 3-char content-derived hash. The response opens with a `ANCHOR:FILELINE` header that separates the marker column from the verbatim file content:

```text
ANCHOR:FILELINE
 3#ve7:function hello() {
 4#szJ:  console.log("world");
 5#kQm:}
```

`edit` targets one or more ranges of `line#hash` anchors via an `edits:[]` array, each with an `op` semantic (`ins` / `del` / `replace`). The contract is **exact**:

- `replace` requires **both** anchors; a single-line replace passes the same marker twice (`anchor_start === anchor_end`), and `lines` must contain **exactly one entry per range line** — mismatched counts are rejected (`E_LINE_COUNT_MISMATCH`) instead of silently duplicating or deleting lines.
- `ins` inserts into the **gap after** its anchor line (the anchor line's content is untouched) and may anchor on **another hunk's range END line** (half-open `N ∉ [hs, he)`) — never its start or interior.
- `del` deletes the range (lines must be empty).

Three canonical templates cover every block rewrite in one call:

### intent · edits[]
- **intent**: equal rewrite · **edits[]**: `replace` with matching counts
- **intent**: shrink N→M · **edits[]**: `replace` the first M lines + `del` the rest
- **intent**: expand M→N · **edits[]**: `replace` the M-line range + `ins` at the range's last line

A single-line replace:

```json
{
  "path": "src/main.ts",
  "edits": [
    { "op": "replace", "anchor_start": "4#szJ", "anchor_end": "4#szJ", "lines": ["  console.log('hi');"] }
  ]
}
```

and produces a diff with fresh anchors **plus** a `Shift:` block that describes how absolute line numbers below the edit moved — the next edit chains from there without a re-read:

```text
ANCHOR:FILELINE
+ 4#a3m:  console.log('hi');
- 4#szJ:  console.log("world");

Shift: lines > 5 shift by +1. Use newLine=5#kQm to edit the next row without re-reading.
```

## Configuration

The plugin reads a `hashline` namespace from the dsh settings service (persisted to `~/.dsh/settings.yaml`). All keys are optional; live edits to settings.yaml take effect immediately (the hash shape recompiles, tools switch output format on the next call).

```yaml
hashline:
  separator: ":"         # column separator between the marker and the content (default ":")
  hash_length: 3         # anchor hash length, 1..6 (default 3; hash space = 62^len)
  output_format: text    # "text" (hashline rows) | "json" (pure JSON)
  context_lines: 3       # context rows echoed around stale anchors / diffs / grep (default 3, 0..20)
```

### text output (default)

Every read/grep/diff/echo starts with a header row (`ANCHOR:FILELINE`) describing the row format, the left `line#hash` edit anchor, and that the text after the separator is the verbatim file content — including the rule: to modify the file, pass the content after the separator, never the anchor part.

### json output

Set `output_format: json` for pure-JSON tool outputs — the model parses the JSON directly:

- **read** returns `{path, offset, totalLines, lines: {anchor: content}}` — each `lines` key is a `<line>#<hash>` edit anchor, each value is the verbatim file content.
- **grep** returns `{total, truncated, files: [{path, matches: [{anchor, text, contextBefore, contextAfter}]}]}`.
- **edit** returns `{ok: true, path, diff: [{kind: "+" | "-" | " ", anchor, content}], hints, warnings, errors: []}` on success — `diff` is the text diff json-ified row by row (kind mirrors the diff prefix, anchors are final line#hash markers usable for follow-up edits, context rows inherit `context_lines`). **Rejected edits fail loudly (throw, isError) in json mode exactly as in text mode** — the model receives the `E_` code + message through the failure channel.

Legacy `│`-separated rows still parse in both modes.

## Configuring Guidance per Preset

The `tool:read` / `tool:edit` / `tool:undo_last_edit` / `tool:grep` guidance sections are
plain-markdown files, overridable per agent preset. Override files live in the plugin's shared
home — never the workspace store:

```
$DSH_HOME/plugins/dsh-hashline-edittool//.md
```

(default home `~/.dsh`, so `~/.dsh/plugins/dsh-hashline-edittool/`). The section table:

### File · Section · Default order
- **File**: `read.md` · **Section**: `tool:read` · **Default order**: 130
- **File**: `edit.md` · **Section**: `tool:edit` · **Default order**: 131

| `undo_last_edit.md` | `tool:undo_last_edit` | 132 |

On first boot the plugin seeds the four shipped presets — `standard/`, `code/`,
`minimal/`, `cordis/` — each with the compiled guidance as editable files (plus
`order` front-matter), so every preset's guidance starts editable rather than
blank. A `README.md` at the plugin-home root documents the scheme. Files are
seeded once and never rewritten, so your edits survive — a reset is the one
exception (see *Reset / restore defaults* below). A preset directory may
hold only the sections you want to override — the rest fall through to the
compiled defaults.

A file is pure prose unless it opens with an `order` front-matter fence, which moves the section in
the assembled system prompt:

```md
order: 150

```

Per section, resolution reads `/.md`, else the compiled
default. Files are read once per agent at session-start, so edits apply to new
sessions — never mid-session. A preset with no seeded directory (e.g. a
user-authored one) falls back to the compiled defaults unless you copy a seeded
dir to its name. A deployment without the `agentPresets` service (no preset
roster) keeps the compiled defaults and never touches these files; presets are
never required.

### Reset / restore defaults

Emptying or deleting an override file restores that section's compiled default
guidance and order: the default renders at session-start, and the file re-seeds
at next boot.

- **Reset = delete the file, or empty it AND remove the front-matter fence.** A whitespace-only file with no fence means "I want the default" — the compiled default renders, and the file re-seeds at next boot for any preset dir, shipped or custom.
- **Blank on purpose = keep a valid fence.** Any well-formed `---` fence — even a keyless `---\n---\n`, even an empty body — is a deliberate-intent signal: the file is explicit content and is never reset or re-seeded.
- **Broken fence = fast fail.** A `---` fence that does not parse (missing closing `---`, non-integer `order`, unknown key) is rejected: the malformed text is never injected into the context, the compiled default renders, a warning names the file and the reason, and the file is left untouched on disk for repair.
- **Shipped vs custom.** Shipped preset files (`standard`, `code`, `minimal`, `cordis`) re-seed at boot; a deleted custom-preset override stays absent — absence is no override. Deleting a whole `/` directory re-seeds all four section files at boot (shipped presets).
- **Reset restores the current bundle defaults** — a plugin upgrade yields new defaults.

Re-seeding happens at boot, never mid-session.

## Why Hashline

**Token-saving.** An edit call carries `anchor_start` / `anchor_end` (two `<line>#<hash>` markers)
plus the replacement text — it never echoes the text being replaced. A `str_replace` call must
reproduce that text verbatim. On a 12-edit session over a realistic file this is **26% fewer output
tokens** (24–45% on multi-line ranges) — and these are *output* tokens, billed at ~5-6× the input
rate. See the [benchmark](#benchmark).

**But this was never about “fewest tokens.”** Savings scale with the replaced text — near parity
on the shortest one-line touch-ups — and a compact patch language like
[@oh-my-pi/hashline](#how-it-compares) can emit a lighter payload still (42–53% on the same
session). The point is the *right* kind of edit call: no re-typing old code, and nothing for the
model to track except two stable content addresses (the hash half stays the same across edits;
the line half shifts in the `Shift:` block, with `newLine#oldHash` for the next anchor).

**Correctness.** Every resolved edit range is verified against the exact lines the model was shown.
A stale, never-served, or ambiguous range is hard-rejected **before anything is written**, and the
current range is echoed back as fresh anchors (reject-and-serve) — the retry needs no `read`.

**A modern edit pattern for agents.** Content-addressed anchors (the 3-char hash) survive edits
above; the `line#hash` form additionally pins the line's absolute position. Every hunk in one
`edit` call resolves its anchors against the same file snapshot, so multiple non-overlapping
edits apply atomically in a single pass; overlapping ranges are rejected up front
(`[E_BATCH_CONFLICT]`). The post-edit diff rows carry final line numbers and hashes, and each
hunk's `Shift:` block maps its original range to its final position (`Shift: edits[1] lines 5..6
moved to lines 7..9 (+2)`), so follow-up edits copy the markers straight from the diff.

### How It Compares

###  · hashline `edit` · `str_replace` (Claude Code / Codex) · @oh-my-pi/hashline patch
- Replaced text never echoed in the call · **hashline `edit`**: ✅ 2 hashes only · **`str_replace` (Claude Code / Codex)**: ❌ verbatim · **@oh-my-pi/hashline patch**: ✅ `+` rows only
- Lines addressed by · **hashline `edit`**: line number + content hash · **`str_replace` (Claude Code / Codex)**: text match · **@oh-my-pi/hashline patch**: number + file-content tag
- Verified against what the model saw · **hashline `edit`**: ✅ every line · **`str_replace` (Claude Code / Codex)**: ❌ first match wins · **@oh-my-pi/hashline patch**: ~ file version only
- Stale file detected · **hashline `edit`**: ✅ rejects, fresh anchors · **`str_replace` (Claude Code / Codex)**: ❌ may match wrong spot · **@oh-my-pi/hashline patch**: ✅ tag mismatch → refuse or 3-way merge
- Anchors survive edits above · **hashline `edit`**: ✅ content-addressed (hash) + Shift block (line) · **`str_replace` (Claude Code / Codex)**: ✅ content-based · **@oh-my-pi/hashline patch**: ❌ renumber + new tag
- Chained edits without re-reads · **hashline `edit`**: ✅ Shift block + newLine#oldHash · **`str_replace` (Claude Code / Codex)**: ~ · **@oh-my-pi/hashline patch**: ~ via edit-response numbers
- Unambiguous when text repeats · **hashline `edit`**: ✅ boundary anchors verified · **`str_replace` (Claude Code / Codex)**: ❌ first occurrence · **@oh-my-pi/hashline patch**: ~ position, unverified per line
- Wrong-line edit never lands silently · **hashline `edit`**: ✅ every line verified · **`str_replace` (Claude Code / Codex)**: ❌ first match wins · **@oh-my-pi/hashline patch**: ~ possible in principle (tag checks version, not lines)
- Block ops / registers / `MV` / `REM` · **hashline `edit`**: ❌ · **`str_replace` (Claude Code / Codex)**: ❌ · **@oh-my-pi/hashline patch**: ✅
- One document per change · **hashline `edit`**: ❌ per-edit call · **`str_replace` (Claude Code / Codex)**: ❌ per-edit call · **@oh-my-pi/hashline patch**: ✅ multi-hunk patch
- Runtime · **hashline `edit`**: ✅ Node (dsh) · **`str_replace` (Claude Code / Codex)**: — · **@oh-my-pi/hashline patch**: ⚠️ Bun only
- Undo · **hashline `edit`**: ✅ persisted · **`str_replace` (Claude Code / Codex)**: ❌ · **@oh-my-pi/hashline patch**: ❌ not in scope

> `~` = occasionally / inconsistently. `@oh-my-pi/hashline` is a compact line-anchored patch language
> ([npm](https://www.npmjs.com/package/@oh-my-pi/hashline), [repo](https://github.com/can1357/oh-my-pi/tree/main/packages/hashline)):
> `[path#tag]` headers bind each hunk to a full-file content hash, `PUT N.=M:` addresses lines by
> number, and every edit renumbers — take the next numbers and tag from the edit response or a fresh `read`.

**Different jobs, same lineage.** Both descend from the
[harness-problem](https://stencil.so/blog/the-harness-problem) insight that the model should never
re-type old code. `@oh-my-pi/hashline` is a **patch-language library** — payload-light (42% saved
per edit, 53% in a single batch document, see [benchmark](#benchmark)), with syntactic block ops
(`PUT N*:`), registers, `REM`/`MV`, multi-hunk documents, a pluggable filesystem for any backend,
and session-aware 3-way-merge recovery on stale tags. This plugin is a **dsh tool pair**: `read`
hands the model 3-char content hashes, `edit` takes two of them, and every resolved line is verified
against the served state — no line numbers to renumber, no tag to re-fetch, a wrong anchor can never
land on the wrong line, and `undo_last_edit` survives restarts. Its trade-offs: a JSON envelope per
edit costs a little payload, there are no block ops, and it lives inside dsh (Node) rather than as a
standalone patcher (Bun). Pick hashline-the-library for a cross-backend patch format; pick
hashline-the-tool for verified, content-addressed edits in your agent.

### Correctness in edge cases

The token benchmark measures the payload the model emits — it assumes the model gets every
address right, for free. Correctness is where the two hashline implementations actually diverge.
These are the real failure modes from the harness-problem literature (wrong-line edits, drift,
repeated text), and what each tool does when they hit:

### Edge case · hashline `edit` (this plugin) · @oh-my-pi/hashline patch
- **Edge case**: Wrong address (off-by-one anchor / line number) · **hashline `edit` (this plugin)**: **Impossible** — anchors resolve to specific lines; every resolved line is verified against served state, rejected **before** anything is written · **@oh-my-pi/hashline patch**: **Possible** — a wrong line number against a current tag applies **silently** at the wrong place; the tag proves the file version, never the lines
- **Edge case**: File changed on disk after the model's view · **hashline `edit` (this plugin)**: Hard reject + fresh anchors echoed (reject-and-serve); retry needs no `read` · **@oh-my-pi/hashline patch**: Tag mismatch → refuse **or best-effort 3-way merge** onto unknown current content
- **Edge case**: An edit above shifts the file · **hashline `edit` (this plugin)**: Nothing shifts — anchors are content addresses; the diff serves fresh anchors · **@oh-my-pi/hashline patch**: **Every edit renumbers** — “RE-GROUND AFTER EVERY EDIT” is the format's own #1 rule; the model carries the bookkeeping
- **Edge case**: Repeated / identical text · **hashline `edit` (this plugin)**: Per-line hashes are unique (collision-resolved); ambiguity → `[E_AMBIGUOUS_ANCHOR]` · **@oh-my-pi/hashline patch**: Position-based, so repeats don't confuse it — but the position itself is unverified
- **Edge case**: Lines never shown to the model · **hashline `edit` (this plugin)**: `[E_RANGE_UNSERVED]` — hard reject with fresh anchors · **@oh-my-pi/hashline patch**: Undisplayed hunks rejected — same reliance on the model knowing what it saw
- **Edge case**: Mid-expression / wrong block node · **hashline `edit` (this plugin)**: Irrelevant — any verified line range is valid · **@oh-my-pi/hashline patch**: Grammar rules + `PUT N*:` node choice; mispointing (anchoring `def` orphans its decorator) silently lands wro