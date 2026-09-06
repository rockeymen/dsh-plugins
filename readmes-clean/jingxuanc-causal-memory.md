# causal-memory

> **An agent memory system with a causal core — and the only one that models inhibition.**
>
> Facts, temporal state, and `decision → outcome` causal edges on one SQLite store,
> powered by a hippocampus-style engine: typed spreading activation (excitatory
> *and* inhibitory), Hebbian co-occurrence reinforcement, Q-value dynamics, and
> immutable SWR consolidation. Agents recall *what* happened, *when* it was true,
> *why* it worked — and *what would happen if* they acted differently.

## Why

Every agent forgets *why* it made past decisions after a few context compactions.
It re-fixes the same bug the same wrong way, re-debates the same architecture
choice, relearns the same lesson.

This happens because **causal information is the most fragile type under text
compaction**. Real-LLM benchmark (grok-build's production compaction prompt):

### Compactions (k) · Textual recall · Causal-table recall
- **Compactions (k)**: 1 · **Textual recall**: 100% · **Causal-table recall**: 100%
- **Compactions (k)**: 2 · **Textual recall**: 85% · **Causal-table recall**: 100%
- **Compactions (k)**: 3 · **Textual recall**: 55% · **Causal-table recall**: 100%
- **Compactions (k)**: 5 · **Textual recall**: **45%** · **Causal-table recall**: **100%**

The causal table survives because it lives **outside the agent's context window** —
compaction cannot touch it.

## Demo

A 21-second hands-on demo (real memory store, no mocks): pre-action warning
(`intervention_query` → DANGER chain) → experience recall (`search_causal`)
→ counterfactual comparison (`counterfactual_query`) → write loop
(`record_decision` → immediately searchable).

     external <video> never plays on the repo page. An animated GIF goes
     through the camo image proxy and plays inline. Click for the mp4. -->
[![21-second demo](docs/demo/causal-memory-demo.gif)](docs/demo/causal-memory-demo.mp4)

[Download video](docs/demo/causal-memory-demo.mp4) ·
[Warning-scene screenshot](docs/demo/demo_intervention.png) ·
[Brand card](docs/demo/demo_card.png) ·
Regenerate: `scripts/render_demo.py`

## Benchmarks

### CausalEval — the causal memory benchmark (primary)

Most agent-memory benchmarks (LoCoMo, LongMemEval, Memora) test **fact recall**
("what is the user's preference"). causal-memory's differentiators — typed
causal edges, inhibition, intervention prediction, cross-task transfer — are
invisible on those suites. **CausalEval** measures them.

**Design: the causal graph is the answer key.** Typed DAGs are generated
deterministically; conversations are narrated from the graph; gold answers are
derived from graph structure — zero hand annotation, zero ambiguity.

**CausalEval v13 (soft supersession) — 140 questions, 20 graphs** (same LLM,
same judge; v12 baseline was 70q/10 graphs; mem0 comparison ran on the 70q
protocol):

### Capability · causal-memory · v12 (70q) · mem0 (70q) · What it tests
- **Capability**: **C7 Update** · **causal-memory**: **100%** · **v12 (70q)**: 50% · **mem0 (70q)**: 80% · **What it tests**: Supersede old belief after falsification (soft `superseded_by` annotation)
- **Capability**: C3 Counterfactual · **causal-memory**: **95%** · **v12 (70q)**: 90% · **mem0 (70q)**: 80% · **What it tests**: Choosing between alternatives with known outcomes
- **Capability**: C2 Intervention · **causal-memory**: **75%** · **v12 (70q)**: 70% · **mem0 (70q)**: 40% · **What it tests**: Forward prediction: "if X again, what happens?"
- **Capability**: C4 Inhibition · **causal-memory**: **80%** · **v12 (70q)**: 90% · **mem0 (70q)**: 50% · **What it tests**: Distinguishing root-cause fix vs blast-radius limiter (`prevented` edges)
- **Capability**: C1 Attribution · **causal-memory**: 85% · **v12 (70q)**: 90% · **mem0 (70q)**: 90% · **What it tests**: Backward causal chain → root cause
- **Capability**: C5 Temporal-causal · **causal-memory**: 90% · **v12 (70q)**: 100% · **mem0 (70q)**: 90% · **What it tests**: Ordering on a causal chain
- **Capability**: C6 Lesson transfer · **causal-memory**: 20% · **v12 (70q)**: 20% · **mem0 (70q)**: 30% · **What it tests**: Cross-task analogy via meta edges (open limitation)
- **Capability**: **Overall** · **causal-memory**: **78%** · **v12 (70q)**: 81% · **mem0 (70q)**: 65% · **What it tests**: 

**Key result: C7 update 50% → 100% (+50pp, 20/20 questions) and it holds at
doubled sample size.** Soft supersession annotates superseded edges
(`superseded_by`) instead of hiding them — the falsification signal reaches
the answer model while the old lesson stays retrievable for counterfactuals
(C3 unharmed at 95%). The C6 gap (20% vs mem0 30%) is the remaining open
limitation; C1/C4/C5 dips vs v12 are within re-distillation variance and
new-graph difficulty (v12 and v13 do not share a distilled corpus).

### Fact-recall benchmarks (not our strong suit)

On traditional fact-recall suites, causal-memory performs competitively but
**does not beat mem0** — this is expected, because fact recall is mem0's
specialty and not where causal-memory adds value.

### Benchmark · causal-memory · mem0 · Note
- **Benchmark**: LoCoMo (strict judge) · **causal-memory**: 79.1% · **mem0**: 91.6% · **Note**: mem0's home turf
- **Benchmark**: LongMemEval-S (full pipeline, deepseek-chat) · **causal-memory**: **76.4%** @ 11.5K tok/q · **mem0**: 94.4% @ 6.8K tok/q (official) · 73.8% (ind. repro) · **Note**: single-model stack vs platform stack; see docs/benchmarks/longmemeval.md
- **Benchmark**: Memora MPA · **causal-memory**: 67.4% · **mem0**: 71.8% · **Note**: −4.4pp
- **Benchmark**: Compaction survival · **causal-memory**: 100% · **mem0**: 45% · **Note**: External table = immune to compaction
- **Benchmark**: Agent repeat-mistake · **causal-memory**: 33% · **mem0**: 67% · **Note**: −34pp on trap-world

### Capability tests (322 across the workspace)

These test capabilities that **no fact store (mem0, Zep, Letta) can offer**.

### Capability · What it proves · Tests
- **Capability**: **Prevented-edge warning** · **What it proves**: `prevented` edge spreads −0.3 activation (GABA analogue) · **Tests**: 2
- **Capability**: **Trace-cause attribution** · **What it proves**: Backward CSR traversal finds root cause · **Tests**: 2
- **Capability**: **Multi-hop causal chain** · **What it proves**: Forward K-hop spreading reaches 2-3 hop outcomes · **Tests**: 2
- **Capability**: **Inhibitory filtering** · **What it proves**: Prevented outcomes appear as negative, not false positives · **Tests**: 1
- **Capability**: **Intervention comparison** · **What it proves**: Same outcome has +0.9 for "skip tests" and −0.3 for "add tests" · **Tests**: 4
- **Capability**: **SWR consolidation** · **What it proves**: LTP strengthens replayed edges, LTD weakens unvisited, GC forgets dormant · **Tests**: 5
- **Capability**: **Q-value dynamics** · **What it proves**: Good decisions rank higher; Bellman propagates to parents · **Tests**: 3
- **Capability**: **Novelty entropy** · **What it proves**: Diverse experience triggers consolidation; uniform does not · **Tests**: 3
- **Capability**: **Meta-edge mining** · **What it proves**: Cross-session pattern discovery (similar_to / repeated) · **Tests**: 3
- **Capability**: **Hebbian co-occurrence** · **What it proves**: Repeated co-activation strengthens connection · **Tests**: 3

## What makes it different

### Capability · causal-memory · mem0 · Zep · Letta · HeLa-Mem
- **Capability**: Typed causal semantics (caused/enabled/prevented) · **causal-memory**: ✅ · **mem0**: ❌ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌
- **Capability**: **prevented negative spread (inhibitory)** · **causal-memory**: ✅ · **mem0**: ❌ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌
- **Capability**: Hebbian co-occurrence edges (excitatory) · **causal-memory**: ✅ · **mem0**: ❌ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ✅
- **Capability**: Immutable consolidation (delta + clone) · **causal-memory**: ✅ · **mem0**: ❌ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌
- **Capability**: Q-value dynamic utility · **causal-memory**: ✅ · **mem0**: ❌ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌
- **Capability**: Forward simulation (intervention_query) · **causal-memory**: ✅ · **mem0**: ❌ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌
- **Capability**: SWR offline consolidation (LTP/LTD/GC) · **causal-memory**: ✅ · **mem0**: ❌ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌
- **Capability**: Novelty-entropy consolidation trigger · **causal-memory**: ✅ · **mem0**: ❌ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌
- **Capability**: Meta-edge cross-session pattern mining · **causal-memory**: ✅ · **mem0**: ❌ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌
- **Capability**: Compaction survival evidence · **causal-memory**: ✅ +20.8pp · **mem0**: ❌ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌
- **Capability**: One graph unifying all memory types · **causal-memory**: ✅ · **mem0**: ❌ · **Zep**: ⚠️ · **Letta**: ❌ · **HeLa-Mem**: ⚠️
- **Capability**: Write-time gatekeeping (raw → session_logs) · **causal-memory**: ✅ · **mem0**: ✅ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌
- **Capability**: Local ONNX embedding (offline) · **causal-memory**: ✅ · **mem0**: ✅ · **Zep**: ❌ · **Letta**: ❌ · **HeLa-Mem**: ❌

**Core innovation: the excitatory/inhibitory duality.** HeLa-Mem (ACL 2026) builds
the excitatory side (Hebbian co-activation, positive spread). causal-memory adds
the inhibitory side (`prevented` edges spread **negative** activation — a GABA
analogue). A complete memory needs both: "what caused this" *and* "what prevents
this from happening again."

## Architecture

![architecture](docs/architecture.png)

*Interactive version: [docs/architecture.html](docs/architecture.html)*

```
  ┌───────────────────────────────────────────────┐
  │           causal-memory (Rust, MCP)            │
  │                                                │
  │  14 tools ← Agent (stdio / HTTP)                 │
  │    ↓                                           │
  │  Write-time gatekeeping                        │
  │    raw turns → session_logs (audit only)       │
  │    distill → facts + causal edges (searchable) │
  │    ↓                                           │
  │  Unified retrieval (RRF fusion)                │
  │    BM25 + semantic cosine → RRF merge          │
  │    Fact layer (BM25 + embeddings)              │
  │    ↓                                           │
  │  ┌──── Hippocampus engine ──────────────────┐  │
  │  │ CSR graph + spreading activation          │  │
  │  │  caused (+1.0)   enabled (+0.5)           │  │
  │  │  prevented (−0.3) ← GABA inhibitory       │  │
  │  │  fact (+0.8)     meta (+0.6)              │  │
  │  │  co_occurrence (Hebbian, dynamic)         │  │
  │  │                                            │  │
  │  │ DG: SimHash pattern separation             │  │
  │  │ CA3: K-hop spreading (forward + reverse)   │  │
  │  │ CA1: Novelty entropy trigger               │  │
  │  │ SWR: LTP/LTD/GC (immutable delta + clone)  │  │
  │  │ Q-value: Bellman dynamics (MemRL-style)    │  │
  │  └────────────────────────────────────────────┘  │
  │    ↓                                           │
  │  SQLite (causal.db) — never compacted          │
  └───────────────────────────────────────────────┘
```

The `causal_edges` table is never compacted — it lives outside the agent's context
window. That's the entire point.

## Edge types

### Edge type · Spread coeff · Biological analogue · Meaning
- **Edge type**: `caused` · **Spread coeff**: +1.0 · **Biological analogue**: Glutamate (strong excitatory) · **Meaning**: "Doing X caused Y"
- **Edge type**: `fact` · **Spread coeff**: +0.8 · **Biological analogue**: Semantic association · **Meaning**: "User is/has Z"
- **Edge type**: `meta` · **Spread coeff**: +0.6 · **Biological analogue**: Cortical top-down · **Meaning**: Cross-task pattern link
- **Edge type**: `enabled` · **Spread coeff**: +0.5 · **Biological analogue**: Weak excitatory · **Meaning**: "Doing X enabled Y"
- **Edge type**: `co_occurrence` · **Spread coeff**: dynamic · **Biological analogue**: Hebbian LTP · **Meaning**: "X and Y frequently co-occur"
- **Edge type**: **`prevented`** · **Spread coeff**: **−0.3** · **Biological analogue**: **GABA (inhibitory)** · **Meaning**: **"Doing X prevented Y"**
- **Edge type**: `no_effect` · **Spread coeff**: 0.0 · **Biological analogue**: — · **Meaning**: No causal relationship

## Quick start

```bash
git clone https://github.com/JingxuanC/causal-memory.git
cd causal-memory
cargo build --release
```

### MCP integration (Claude Code, Cursor, grok-build, etc.)

```json
{
  "mcpServers": {
    "causal-memory": {
      "command": "/path/to/causal-memory/target/release/causal-memory",
      "env": {
        "CAUSAL_MEMORY_DB": "~/.local/share/causal-memory/causal.db"
      }
    }
  }
}
```

### HTTP transport (remote agents, multi-agent shared memory)

```bash
./target/release/causal-memory http --port 9938   # MCP Streamable HTTP
```

Observability endpoints on the same port (UNAUTHENTICATED — do not expose
to the public internet):

```
GET /metrics                    Prometheus text (RED + recall metrics)
GET /healthz / /readyz          liveness / readiness (readiness probes the store)
GET /debug/recall?query=...     run a recall now, return the full JSON trace
                                (seeds, hop summary, per-result provenance)
GET /debug/recalls              newest-first recall audit rows (persisted,
                                schema v13 recall_audit table; survives restarts)
```

Structured JSON logs on stderr: `CAUSAL_MEMORY_LOG_FORMAT=json`.

### With local embeddings (no API key needed)

```bash
cargo build --release --features local-embed
# Uses BAAI/bge-small-en-v1.5 (384 dims, ~130MB, downloads once then offline)
```

### With HTTP embeddings (OpenAI/ZhiPu/etc.)

```bash
export CAUSAL_MEMORY_EMBED_API=https://open.bigmodel.cn/api/paas/v4
export CAUSAL_MEMORY_EMBED_KEY=your-key
export CAUSAL_MEMORY_EMBED_MODEL=embedding-3
```

### Python bindings (PyO3)

All 14 memory operations are also available as a Python package, built on the
same `causal_memory::memory::Memory` facade the MCP server uses:

```bash
cd crates/causal-memory-py
pip install maturin
maturin develop          # builds and installs into the active venv
```

```python
from causal_memory import CausalMemory

mem = CausalMemory("~/.local/share/causal-memory/causal.db")  # or CausalMemory.in_memory()
mem.record_decision("used Redis mutex for cache stampede protection",
                    "deadlock under load", "caused", "concurrency")
print(mem.search_causal(query="cache stampede protection"))
print(mem.intervention_query("skip the test suite before shipping"))
```

Methods mirror the 14 MCP tools one-to-one and return the same text. Embedding
and LLM features use the same `CAUSAL_MEMORY_EMBED_*` / `CAUSAL_MEMORY_LLM_*`
environment variables; without them the bindings degrade gracefully to
BM25-only retrieval. Smoke tests: `maturin develop && pytest tests/`.

> **macOS note:** always build the bindings through maturin. Plain
> `cargo build -p causal-memory-py --release` fails to link — the Xcode CLT
> Python ships no `libpython3.9` dylib (this is why the py crate sits outside
> the workspace `default-members`).

## Fourteen MCP tools

### Tool · When to call · What it does
- **Tool**: `record_decision` · **When to call**: After acting on a decision · **What it does**: Logs `decision → outcome` as a causal edge with relation type
- **Tool**: `remember` · **When to call**: After any meaningful exchange · **What it does**: Zero-friction alternative: paste conversation text, LLM auto-extracts facts/lessons/causal edges
- **Tool**: `search_causal` · **When to call**: Before a non-trivial decision · **What it does**: BM25 + semantic retrieval of past causal episodes
- **Tool**: `record_fact` · **When to call**: When learning a stable fact · **What it does**: Records flat facts with scope + confidence; idempotent
- **Tool**: `search_facts` · **When to call**: When you need "what is" info · **What it does**: BM25 + semantic retrieval over the fact layer
- **Tool**: `search_memory` · **When to call**: When unsure which type · **What it does**: Unified: facts + causal lessons fused by RRF
- **Tool**: `trace_cause` · **When to call**: When something fails · **What it does**: Single-hop reverse: which decision caused this outcome
- **Tool**: `trace_cause_chain` · **When to call**: Deep failure analysis · **What it does**: Multi-hop backward traversal through the causal graph
- **Tool**: `invalidate_decision` · **When to call**: When a lesson is wrong · **What it does**: Soft-invalidate (hidden from search, kept for audit)
- **Tool**: `search_patterns` · **When to call**: To recall cross-task lessons · **What it does**: Mined meta edges: similar_to / repeated / contradicts / refines
- **Tool**: `causal_directory` · **When to call**: Pinned in system prompt · **What it does**: L0 compact pointer list of what the agent knows
- **Tool**: `intervention_query` · **When to call**: **Before taking an action** · **What it does**: Forward simulation: predicts outcomes (safe/warning/danger)
- **Tool**: `counterfactual_query` · **When to call**: When choosing between options · **What it does**: Contrastive: compares recorded outcomes of two alternatives
- **Tool**: `reconstruct_lesson` · **When to call**: When you want the distilled lesson · **What it does**: Reconstructive retrieval: Markov-blanket subgraph → coherent narrative, with optional N-way calibration

## Sleep consolidation

```bash
causal-memory sleep --dry-run   # preview what would change
causal-memory sleep             # run consolidation cycle
```

Immutable SWR 2.0: produces a delta + clone (original graph untouched), with full
audit log. Triple-criterion GC (weak AND dormant AND zero-access). Triggers
automatically when novelty entropy exceeds threshold.

## Causal distill pipeline

The distiller extracts structured memories from raw conve