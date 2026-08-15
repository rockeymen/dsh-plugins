# Engramory

**An opinionated, zero-infrastructure memory *protocol* for small-scale, local,
file-based agent memory** — a strict curation discipline plus a validator
(`tools/engramory_doctor.py`), loaded as **standing rules** (`CLAUDE.md` /
`AGENTS.md` / your host's rules file). It is not a database, a framework, or a
relevance-loaded skill. Memory is a folder of small, human-readable markdown files
plus one always-loaded index. No database, no embeddings, no server — just
plain-text files you can open, read, edit, and diff in any editor (the live store
itself stays git-ignored).

> *Engramory* — coined from *engram* (the physical trace a memory leaves in the
> brain) + *memory*. Here: one file = one fact.

> 🤖 **Are you an AI agent, asked to install or check this?** Start at
> **[AGENT-SETUP.md](AGENT-SETUP.md)**, not at the install steps below. It is the
> procedure for working out what your host can actually enforce, whether a store
> already exists, what you must not touch, and what to tell the user — the parts
> agents reliably get wrong when improvising.

> **Status: 0.7.0 — experimental.** The hard index cap (a `PreToolUse` hook) is
> deterministic for the matched direct-edit tools (`Edit | Write | MultiEdit`) but
> NOT a global write guard (shell tools — Bash, PowerShell, a background Monitor
> command — plus MCP file tools, external editors, and sync clients bypass it);
> the discipline loads as standing rules the model follows, so it's
> best-effort, not guaranteed on every task (see [SKILL.md](SKILL.md) §8). Assumes a
> single writer / serialized writes. Don't rely on it as a "mandatory, reliable,
> cross-agent" memory layer yet.

## What this is — and is NOT

Engramory is **not a new memory architecture**. The "markdown files + a small index
loaded into context + the model curates it" pattern is now the mainstream shape
for agent memory, and it ships in several places already. Engramory stands on:

- **Claude Code native auto-memory** — the same markdown-`MEMORY.md`-index +
  lazy detail-file pattern; its system prompt even uses the same
  `user | feedback | project | reference` type vocabulary (per
  [anthropics/claude-code#58840](https://github.com/anthropics/claude-code/issues/58840);
  the *public docs* describe only the index + topic files). Engramory is a
  disciplined superset of this default.
- **[basic-memory](https://github.com/basicmachines-co/basic-memory)** — markdown
  source-of-truth, YAML frontmatter `type`, `[[wikilink]]` graph, local-first.
- **[obsidian-second-brain](https://github.com/eugeniughelbur/obsidian-second-brain)**,
  **[claude-memory-compiler](https://github.com/coleam00/claude-memory-compiler)**
  ("a loaded index beats vector search at personal scale"), and the broader family
  of markdown-memory skills.

What Engramory contributes is the **opinionated bundle + the discipline**, not the
primitives. Do not claim novelty on markdown, frontmatter, wikilinks, a loaded
index, one-file-per-fact notes, or curation hygiene — all are prior art.

## What's actually differentiated

1. **A role/purpose ontology, headed by `feedback` = procedural memory.** The
   semantic / episodic / **procedural** split is established prior art — the CoALA
   taxonomy, and a named procedural type in LangMem and mem0 — so Engramory does not
   claim the category. What it does is make procedural `feedback` the *spine* of a
   deliberately tiny, hand-authored, human-readable set, with required **Why:** /
   **How to apply:** lines, instead of auto-extracting it into a vector/graph store.
   The contribution is the packaging and discipline, not the ontology.

2. **The curation contract as concrete behaviour** the protocol applies (model-followed, not a hard gate): dedup-before-write,
   update-don't-duplicate, delete-when-wrong, and a negative-scope rule ("don't
   store what git/CLAUDE.md/the code already records"). Surveys consistently name
   *modify/delete/forget* as the most under-implemented memory operation — Engramory
   makes it the spine.

3. **A bounded index designed not to silently rot.** The index loads every session and
   Claude Code reads the first 200 lines / 25 KB (documented behavior), so an unbounded index silently
   drops memories off the end. Engramory warns at 150 lines / 20 KB, compacts-or-asks
   before 200 / 25 KB, and ships a hard `PreToolUse` hook backstop (it blocks only
   *growth* past the cap — shrinking/compaction edits always pass). Both the line and
   byte caps apply — whichever is hit first triggers (an index can be under the line
   count yet over on bytes when the lines run long).

   Claude Code has since followed up on this natively: v2.1.186 (released
   2026-06-22) reminds the agent to compact the index when it nears the cap, and
   v2.1.210 (released 2026-07-14) turned an over-cap write into an explicit error
   instead of a silent truncation. Both are after-the-fact alerts, though — the
   write still lands, and entries past the cap stay invisible until someone
   compacts. Engramory's hook denies the write *before* it happens, so a write
   through the matched edit tools never leaves the index over-cap in the first
   place (writes outside them — a shell, an MCP file tool — are not gated; see the
   status note above and SKILL.md §8). The native alerts validate the direction
   and make a welcome second layer — and older versions and other hosts still
   have neither.

## How it compares

###  · storage · recall · human-readable · typed ontology · curation discipline · bounded index · infra
- **Engramory** · **storage**: md files · **recall**: loaded index → open file · **human-readable**: ✅ · **typed ontology**: ✅ role-based (4) · **curation discipline**: ✅ contract (model-run) · **bounded index**: ✅ 150/200 + hook · **infra**: none
- CC auto-memory · **storage**: md files · **recall**: loaded index → open file · **human-readable**: ✅ · **typed ontology**: ✅ same 4 types · **curation discipline**: partial (auto) · **bounded index**: ~200-line window* · **infra**: none (built-in)
- basic-memory · **storage**: md + SQLite · **recall**: semantic/FTS search · **human-readable**: ✅ · **typed ontology**: ✅ freeform type · **curation discipline**: schema + overwrite checks · **bounded index**: ❌ (no loaded index) · **infra**: SQLite + embeddings
- obsidian-second-brain · **storage**: md vault · **recall**: index-first + search · **human-readable**: ✅ · **typed ontology**: folder-typed · **curation discipline**: ✅ reconcile/lint · **bounded index**: partial · **infra**: none
- mem0 / Zep · **storage**: vector/graph DB · **recall**: semantic · **human-readable**: ❌ (DB) · **typed ontology**: typed (prefs/episodic/proc.; Zep custom) · **curation discipline**: auto-extract · **bounded index**: n/a · **infra**: DB + embeddings
- [agentmemory](https://github.com/rohitg00/agentmemory) · **storage**: SQLite + vector index (+opt. graph) · **recall**: hybrid BM25+vector (+opt. graph), RRF · **human-readable**: ❌ (DB/engine) · **typed ontology**: ✅ 4-tier lifecycle (work./epis./sem./proc.) · **curation discipline**: auto (capture + dedup + decay) · **bounded index**: n/a · **infra**: iii engine (local) + opt. embeddings

Engramory's lane: **minimalism + actionable role typing + curation discipline, zero
infra.** It does *not* try to out-search basic-memory, out-scale mem0, or
out-capture agentmemory — those solve a different problem (auto-capture /
auto-ingest at volume) at a different cost point. agentmemory is the closest
heavyweight foil: also local-first, but it bets on automatic capture (lifecycle
hooks) + hybrid retrieval (BM25 + vectors + optional graph) on a SQLite/`iii`
engine, where Engramory bets on hand-curation + a tiny always-loaded index and
ships no engine at all.

\* Claude Code's [memory docs](https://docs.claude.com/en/docs/claude-code/memory)
document this exactly: *"the first 200 lines of `MEMORY.md`, or the first 25KB,
whichever comes first, are loaded at the start of every conversation."* Other hosts
vary, so the window stays configurable via the hook's env vars.

## Where it fits — and the goal

Engramory is a **portable memory *discipline*, not a product** — not a database, not a
framework, not a relevance-loaded skill, not a Claude-Code-only plugin. The plumbing it rides on (a markdown index +
one-file-per-fact notes, the `user | feedback | project | reference` types, a bounded loaded index)
is increasingly shipped *natively* by the host — Claude Code's built-in auto-memory
already does it. So Engramory's value is the part hosts **don't** ship: the explicit
curation contract (dedup-before-write, delete-when-wrong, don't-store-what-the-repo-
already-has), procedural `feedback` notes with required Why/How, and a portable way to
enforce the size cap.

**The goal is the same discipline on *any* agent — by riding the real cross-agent rails,
not by inventing a new standard.** Paste [`rules-snippet.md`](rules-snippet.md) into the
host's always-loaded rules so the discipline fires every task. On a host that only gives
you a flat rules file or a raw file store, that is a real upgrade; on a host that already
ships structured memory, Engramory is a thin discipline layer on top — and says so.

**On MCP: deliberately not the route for a host that can already read files and
load standing rules.** Serving memory over MCP would (a) open a *second write
channel* that bypasses the pre-write hook — the single deterministic guarantee
this project has, and one that already lists MCP file tools among the things that
slip past it — and (b) demote recall from an index the host loads *every session*
to a tool the model has to remember to call, i.e. back to the weakest rung in
§8. For a host that lacks files or standing rules, an MCP entry point is the only
way in and is worth adding as a **supplement**; it is not a replacement for the
protocol, and it is not the cross-agent plan.

## Continuity without a second handoff store

Engramory uses **one canonical store**. It does not add a `handoff` type or a
parallel handoff folder. A live `project` note may hold the current goal, status,
decisions, constraints, blockers, and next concrete step needed to resume an
unfinished task. A `feedback` note is narrower: only a correction or workflow
that should be reused beyond that task.

Before a deliberate compact, clear, or move to a new thread, the agent performs
one continuity sync: scan the task, dedup/update existing notes, refresh project
state, promote reusable feedback, keep durable reference pointers, retire stale
or completed transient state, run the size check plus doctor, and verify that a
cold-started agent could continue from the repo and memory alone. Continuity
never duplicates code or git: a note may keep a **stable** pointer (branch name,
issue/PR number, file path) to re-check, and may record a **settled fact**
("2.0 shipped on 2026-01-15"), but never **current state** — the version you are
on now, the tip commit, the current test count. It records where to read those.

After a write, the agent reports what was added, updated, archived, and skipped
(with reasons, identifying any deletion under archived), plus the index size and
check result. Host lifecycle hooks can remind, mark a task dirty, or gate a
manual transition; they do **not** perform or guarantee this semantic sync.

## Install

> Requires **Python 3.9+** for the hook and the `tools/` scripts (`python3` on
> most systems).

### Claude Code
1. **Load the discipline as standing rules (primary):** paste
   [`rules-snippet.md`](rules-snippet.md) into your always-loaded rules —
   `~/.claude/CLAUDE.md` (all projects) or the project `CLAUDE.md` — so the protocol
   fires on every task, not just when a skill happens to load by relevance.
2. **(Optional) register the full spec as a skill:** copy or symlink this folder
   into your Claude Code skills directory as `engramory/`, so [`SKILL.md`](SKILL.md)
   is available on demand as the detailed reference (path in `hooks/INSTALL.md`).
3. **Add the hard-cap hook:** register the hook from `hooks/` in your `settings.json`
   (snippet in `hooks/settings.snippet.json`).
4. Point `<MEMORY_ROOT>` at your memory directory; ensure it's `.gitignore`d if
   inside a repo.

### Codex

Use the Codex init helper to wire the discipline into `AGENTS.md`, create the
memory template, optionally install the full protocol as a Codex skill, and add a
`.gitignore` entry when the store lives inside the project:

```sh
python tools/engramory_init.py codex --project-root /path/to/project --install-skill
```

Optional Codex lifecycle assistance can also be installed with
`--install-hooks --mode explicit` (default), or `--mode assisted` to ask for the
same agent-run sync at meaningful milestones. Neither mode silently creates a
semantic summary; review/trust project hooks and confirm them with `/hooks`.
The hook's bounded `.engramory-codex-state.json` stores only synchronization
bookkeeping, never prompts, transcripts, or note bodies.

By default this creates `/.engramory-memory/`. Pass `--memory-root` to
use an existing folder. Keep this store separate from Codex native Memories:
Codex Memories are generated state, while Engramory is a user-auditable plain
folder and the canonical store for the Engramory protocol. Full Codex notes,
including explicit sync versus optional lifecycle-hook assistance, are in
[adapters/codex/README.md](adapters/codex/README.md).

### Read-only readers (recall another agent's memory)

Point **any** host at a store **another agent owns and writes** (e.g. Claude Code's native
auto-memory) so a delegated run is grounded in the same project memory — read-only, so the
owner stays the sole writer (Engramory assumes a single writer; many readers are fine):

```sh
python tools/engramory_init.py codex-reader   --project-root ~/.codex \
  --memory-root ~/.claude/projects//memory
# same shape for any host — it lands in that host's own rules file:
python tools/engramory_init.py cursor-reader  --project-root /path/to/repo --memory-root <store>
```

Reader hosts: `codex-reader` and `dsh-reader` (both dogfooded) plus `claude-reader`,
`cursor-reader`, `kiro-reader`, `cline-reader`, `windsurf-reader`, `openclaw-reader`,
`hermes-reader` (wired from each host's documented rules-file format, printed with an
"unverified" note). It creates no store and never
writes; `--memory-root` must be an existing store. See
[adapters/reader/README.md](adapters/reader/README.md) (incl. the tested-host table + data-egress note).

### OpenClaw

Use the OpenClaw init helper (defaults to the workspace `~/.openclaw/workspace`):

```sh
python tools/engramory_init.py openclaw --install-skill
```

It writes a marked Engramory block into the workspace `AGENTS.md` (auto-loaded every
session), installs the protocol under `.agents/skills/engramory` (OpenClaw
auto-discovers it), and keeps a separate `.engramory-memory/` store. The index cap on
OpenClaw is rules + `engramory_check.py`, **not** a deterministic deny hook (that would
need a `before_tool_call` plugin) — see
[adapters/openclaw/README.md](adapters/openclaw/README.md).

### Kiro

Kiro (AWS's agentic IDE/CLI) is a strong host — always-loaded steering files, an agent
that reads/writes workspace markdown, and a real pre-write deny hook. Wiring is manual
(no init helper yet): copy
[`adapters/kiro/steering-engramory.md`](adapters/kiro/steering-engramory.md) to
`.kiro/steering/engramory.md` (it is `inclusion: always` and pulls in the live index via
`#[[file:.engramory-memory/MEMORY.md]]`), and keep your notes in a **non-steering**
`.engramory-memory/` folder.

> ⚠️ **Do not drop notes into `.kiro/steering/`.** A steering file with no `inclusion`
> front-matter defaults to `inclusion: always`, so every note would load into every
> request and **blow up your context** — the #1 Kiro install mistake. Only the index
> belongs in always-loaded steering; notes stay in `.engramory-memory/` and open on
> demand. Cap is rules + `engramory_check.py` for now (a deterministic Kiro `PreToolUse`
> hook is possible but not yet shipped/tested). Full notes:
> [adapters/kiro/README.md](adapters/kiro/README.md).

### DeepSeek Harness (dsh)

Use the dsh init helper (defaults to `$DSH_HOME`, i.e. `~/.dsh`):

```sh
python tools/engramory_init.py dsh --install-skill
```

It writes a marked Engramory block into `$DSH_HOME/AGENTS.md` — dsh's `agent-instructions`
plugin loads a hardcoded `["AGENTS.md", "CLAUDE.md"]` candidate list at the start of every
session — installs the protocol under `<DSH_HOME>/skills/engramory` (dsh's **user skill
root**; *not* `.agents/skills` beneath it, which is not one of the roots it scans there —
install into the wrong one and the copy lands but is never listed), and keeps a separate
`.engramory-memory/` store. The index cap here is rules + `engramory_check.py`, **not** a
deterministic deny hook: dsh's is `ctx.tools.guard()`, a TypeScript seam whose refusal is
monotonic — a good seam, but not one the Python hook drops into.

Wiring *and* model behavior were dogfooded against `deepseek-v4-flash`: the block arrives
as a `<system-reminder>`, a question answerable only from a stored note made the model open
that note unprompted, and one durable fact came back as a conforming note plus index
pointer. See [adapters/dsh/README.md](adapters/dsh/README.md).

### Any other agent (Hermes, Cursor, Cline, Windsurf, …)
Engramory is model-agnostic (DeepSeek, GPT, Llama, …) and rides on the host's own
memory store. Full wiring is in **[PORTING.md](PORTING.md)**; in short: paste
[`rules-snippet.md`](rules-snippet.md) into the host's always-loaded rules (so the
discipline is always-on, not just a by-relevance skill), import [`SKILL.md`](SKILL.md)
if the host supports skills, point `<MEMORY_ROOT>` at the host's memory dir **when
that dir is plain files you control** (against a host that manages its own memory —
Codex, OpenClaw, Hermes — use a separate folder instead), and
wire the size cap at the strongest 