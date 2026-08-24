retrieval, evaluation, export, and plugin layer behind it. -->

![SkillCorpus banner](https://github.com/user-attachments/assets/2ef7e877-275d-4115-8ddf-f9b49de8ff5d)

## What SkillCorpus gives you

SkillCorpus is EverMind's open-source pipeline for turning scattered `SKILL.md` files from public
repositories into reliable agent context. It aggregates sources, applies safety and license gates,
evaluates quality, and matches task-specific skills before the agent answers.

You can use the live [SkillHub](https://evermind.ai/skillhub) without cloning this repository. Clone
SkillCorpus when you want the open-source machinery behind that experience:

- **Build your own skill layer** — point the pipeline at your own source registry, apply the
  curation, safety, and license gates, and export a corpus for your agents.
- **Change the behavior** — modify the taxonomy, quality and dedup rules, retrieval recipe, export
  schema, evaluation suites, or host plugins.
- **Keep control of deployment** — self-host the released retrieval models and connect your own
  agent host instead of using the hosted SkillHub API.

The core code is Apache-2.0 licensed (`match/` and `evaluate/` are MIT); each skill retains its
upstream license. The public 1,000-skill demo, three agent benchmarks, and live SkillHub show the
result.

https://github.com/user-attachments/assets/4d9a3241-df13-4b20-9798-fb7920069995

## Stronger agents, one turn at a time

At answer time, the practical difference is a retrieval layer: SkillHub selects vetted procedural
knowledge for the task and puts it into the agent's context.

Dimension
Without SkillCorpus
With SkillCorpus

Context
Model knowledge plus a manually maintained prompt.
Task-specific, license-audited `SKILL.md` retrieved on every turn.

Execution
Generic workflows can miss exact steps, edge cases, or supporting scripts.
Procedures, references, and optional scripts arrive before execution.

Integration
Each host maintains its own collection of task instructions.
One curated skill layer serves OpenClaw, Hermes, Raven, WorkBuddy, DeepSeek Harness, and other hosts.

The result is the same agent with better task-specific procedures available at the moment it needs
them — stronger execution without asking users to memorise skill names or wire up tool calls.

## Results

Pass rate with no skills → with SkillCorpus, same harness, same backbone
([paper, Table 1](https://arxiv.org/abs/2607.15557)):

### Harness × backbone · SkillsBench · GDPVal · QwenClawBench
- **Harness × backbone**: OpenClaw × Qwen3.5-27B · **SkillsBench**: 8.8 → **13.0** · **GDPVal**: 81.2 → **83.1** · **QwenClawBench**: 65.2 → **66.7**
- **Harness × backbone**: OpenClaw × Qwen3.5-397B · **SkillsBench**: 11.1 → **16.9** · **GDPVal**: 82.2 → **84.0** · **QwenClawBench**: 65.7 → **67.0**
- **Harness × backbone**: Raven × Qwen3.5-27B · **SkillsBench**: 10.0 → **16.5** · **GDPVal**: 82.6 → **83.8** · **QwenClawBench**: 66.9 → **70.8**
- **Harness × backbone**: Raven × Qwen3.5-397B · **SkillsBench**: 9.2 → **22.6** · **GDPVal**: 84.0 → **85.2** · **QwenClawBench**: 68.8 → **73.2**
- **Harness × backbone**: **Pooled ∆** · **SkillsBench**: **+7.5**±2.3 (z=3.2) · **GDPVal**: **+1.51**±0.49 (z=3.1) · **QwenClawBench**: **+2.79**±0.70 (z=4.0)

The gain is largest where the task needs procedural knowledge the model does not already have
(SkillsBench), and smallest on open-ended economic tasks it can already do (GDPVal).

## SkillHub integrations

SkillHub brings per-turn skill retrieval to the five agent platforms below. Choose a platform to open its
plugin guide:

[![DeepSeek Harness](https://avatars.githubusercontent.com/u/148330874?s=200&v=4)DeepSeek Harness](skillcorpus_plugin/engine-typescript/README.md)
[![Hermes](https://github.com/user-attachments/assets/477eebc4-e615-4425-921e-368d7667e491)Hermes](skillcorpus_plugin/plugin-hermes/README.md)
[![OpenClaw](https://github.com/user-attachments/assets/01d948fe-1e2b-48e8-9b32-b8057cb3f336)OpenClaw](skillcorpus_plugin/plugin-openclaw/README.md)
[![Raven](https://github.com/user-attachments/assets/27e1ea63-69d4-48b3-a884-7f0355926907)Raven](skillcorpus_plugin/plugin-raven/README.md)
[![WorkBuddy](https://github.com/user-attachments/assets/ab2157dc-90fc-4196-bbf3-87066820f7b4)WorkBuddy](skillcorpus_plugin/plugin-workbuddy/README.md)

Retrieval runs every turn, before the model answers: no tool call, no skill names to memorise,
no host patch. The packaged Raven plugin is ready to install, but it will claim the `skills`
stage once Raven merges its upstream `context_segments` slot; Raven's built-in retrieval keeps
working today.

> Install SkillCorpus Plugins following https://github.com/EverMind-AI/SkillCorpus/blob/main/skillcorpus_plugin/INSTALL.agent.md

Paste that line to your agent and it installs itself. Per-host setup, the five settings you
will actually touch, what each turn costs and what leaves your machine —
**[`skillcorpus_plugin/`](skillcorpus_plugin)**.

## Public artifacts

This is the concrete inventory of what is public today.

###  · Artifact · What · Link
- 🌐 · **Artifact**: **SkillHub** · **What**: the current 114,190-skill catalog + the two models, hosted as an API — no install · **Link**: [evermind.ai/skillhub](https://evermind.ai/skillhub)
- 📚 · **Artifact**: **Corpus** *(demo)* · **What**: the downloadable 1,000-skill sample — `skills.parquet` + `attachments.tar.zst` + dataset card; the full catalog is served by SkillHub · **Link**: [🤗 demo-1k](https://huggingface.co/datasets/EverMind-AI/skillcorpus-demo-1k)
- 🔡 · **Artifact**: **Retrieval models** · **What**: a bi-encoder and a reranker, fine-tuned from `Qwen3-Embedding-0.6B` and `Qwen3-Reranker-0.6B` · **Link**: [🤗 bi-encoder](https://huggingface.co/EverMind-AI/skillcorpus-embedding-0.6b) · [reranker](https://huggingface.co/EverMind-AI/skillcorpus-reranker-0.6b)
- 🛠️ · **Artifact**: **Code** · **What**: this repo — the pipeline that builds the corpus and trains the two models (`aggregate` · `curate` · `match` · `evaluate` · `export`) · **Link**: [GitHub](https://github.com/EverMind-AI/SkillCorpus)
- 🔌 · **Artifact**: **Plugins** · **What**: packaged host adapters for OpenClaw · Hermes · WorkBuddy · Raven, plus DeepSeek Harness and an HTTP adapter · **Link**: [`skillcorpus_plugin/`](skillcorpus_plugin)

*Open source today: the code, 1,000-skill demo corpus, and retrieval models. The hosted SkillHub
service is closed, and the full hosted catalog is not yet published as a downloadable dataset.*

![16-class distribution over the 96,401 active skills](docs/assets/taxonomy.png)

The 96,401-skill snapshot measured in the paper, organised by a 16-class taxonomy and three quality facets
(utility / robustness / safety), with 1024-dim retrieval embeddings. Column contract:
[`docs/corpus-schema.md`](docs/corpus-schema.md).

## Query the API directly

[SkillHub](https://evermind.ai/skillhub) serves the corpus in three tiers — discover
(metadata), read (`skill_md`), download (zip with `scripts/`). Most skills are pure
instructions, so the read tier is usually sufficient.

```bash
curl "https://skillhub.evermind.ai/openapi/v1/skills?q=extract+tables+from+a+PDF"
```

Take an `id` from the results, fetch its `skill_md`, and inject it into your agent's
prompt. [`examples/skillhub_demo.py`](examples/skillhub_demo.py) runs all three tiers:

```bash
# search + read the bodies — stdlib only, no install, no API key
python examples/skillhub_demo.py "extract tables from a scanned PDF invoice"

# also fetch the bundled scripts of the top hit
python examples/skillhub_demo.py --install ./skills "convert a PDF to images"

# retrieve AND run the task — any OpenAI-compatible LLM (OpenAI, OpenRouter, local vLLM, …)
export OPENAI_API_KEY=...                                # OpenRouter / vLLM: also set
# export OPENAI_BASE_URL=https://openrouter.ai/api/v1   # OPENAI_BASE_URL + --model openai/gpt-4o-mini
python examples/skillhub_demo.py --ask "extract tables from a scanned PDF invoice"
```

```
task: extract tables from a scanned PDF invoice

[1/2] search  → 2 hit(s), metadata only
  1. ocr-and-documents   q=0.808  DOC-PROC  MIT
     Extract text from PDFs/scans (pymupdf, marker-pdf).
  2. document-workflows  q=0.86   DOC-PROC  MIT
     Build end-to-end document processing workflows and pipelines …

[2/2] detail  → fetching skill_md for 2 skill(s)
  ocr-and-documents: 4916 chars  u=8 r=7 s=9  files=4  flags=['no_steps']
  document-workflows: 31628 chars  u=9 r=9 s=9  files=7

→ built a prompt of 36,742 chars with the skill bodies injected
```

Endpoints, response envelope, status codes and rate limits:
[`docs/integrations.md`](docs/integrations.md).

## Self-host the models

To avoid depending on the hosted endpoint, run selection yourself. The corpus and both
retrieval models are released: load the data, serve the two models, and run your own
encode → top-k → rerank.

```python
# the data — a 1,000-skill demo for now; the full 114,190-skill corpus follows
from datasets import load_dataset
skills = load_dataset("EverMind-AI/skillcorpus-demo-1k", split="train")   # 1,000 demo skills
# or read the file directly with pandas (no `datasets`):  pip install pandas
import pandas as pd; skills = pd.read_parquet("skills.parquet")
```

Attachments (`scripts/`, `references/`) ship as a sibling `attachments.tar.zst`.

```bash
# install the serving deps (torch, transformers, …), then point the two env vars at
# the released checkpoints (the script's defaults are training outputs absent from a
# fresh clone) and serve both models behind one endpoint  ->  /embed + /score
pip install -r skillcorpus/match/requirements.txt
EMBEDDING_MODEL= RERANKER_MODEL=<reranker checkpoint dir> \
  bash skillcorpus/match/scripts/run_server.sh
```

This endpoint speaks `/embed` + `/score`
([`skillcorpus/match/` → Serving](skillcorpus/match/README.md#serving)) — it is **not** a
drop-in for SkillHub's hosted-only `/openapi/v1/skills` API. So:

- `examples/skillhub_demo.py` and the section-C integrations talk only to the **hosted**
  SkillHub; a self-hosted setup runs its own selection directly over `/embed` + `/score`.
- It is also the embedding endpoint the producer's dedup uses — set
  `embedding.provider: skillrouter_remote` to [build your own corpus](#build-your-own) with it.

To curate **your own** sources instead, see [Build your own corpus](#build-your-own).

## How it works

![SkillCorpus: curated skills are matched to a task and injected into an agent before execution](docs/assets/pipeline.png)
The collection pipeline is the foundation; the payoff is task-specific skill retrieval before the agent acts.

```
skillcorpus/
├── core/       data models · SQLite/faiss store · LLM & embedding clients
├── aggregate/  source registry + multi-repo clone
├── curate/     parse · safety · license · classify · quality · dedup + full-library passes
├── export/     corpus writer (parquet + attachments + dataset card)
├── match/      the 2 released models + training recipe                 ← isolated deps
├── evaluate/   skillsbench · qwenclawbench · gdpval benchmarks          ← isolated deps
└── cli.py      build · stats · export
```

`cli build` runs the whole curation chain
(`ingest → quality_pass → dedup_pass → license_audit → export.corpus`). LLM classification and
quality scoring degrade gracefully to rules when no model endpoint is reachable, so the pipeline
always runs end to end.

`match/` and `evaluate/` are standalone toolkits with their own `requirements.txt`
(torch / transformers, per benchmark); they are **not** pulled in by `pip install` of the producer.

- **Retrieval** — [`skillcorpus/match/`](skillcorpus/match) is **the two released models**:
  a bi-encoder fine-tuned from `Qwen3-Embedding-0.6B` for candidate recall, and a reranker
  fine-tuned from `Qwen3-Reranker-0.6B` that scores the top candidates. SkillHub serves both;
  to run them yourself see [Serving](skillcorpus/match/README.md#serving) (`serve.py` +
  `run_server.sh`). The directory also holds the training
  recipe (synthetic queries → InfoNCE → listwise CE) and `eval_compare.py` for the retrieval
  metrics (nDCG / MRR / Hit / Recall).
- **Benchmarks** — [`skillcorpus/evaluate/`](skillcorpus/evaluate): `skillsbench`,
  `qwenclawbench`, `gdpval` — each self-contained with its own README and dependencies.

## Build your own corpus

Only needed if you want to curate **your own** sources. Requires an LLM endpoint for
classification / quality scoring and an embedding endpoint for dedup — see
[`docs/running.md`](docs/running.md).

```bash
git clone https://github.com/EverMind-AI/SkillCorpus.git skillcorpus && cd skillcorpus
python3 -m venv .venv && source .venv/bin/activate
python -m pip install --upgrade pip && pip install -e .

python -m skillcorpus.cli build     # 4 demo sources -> curate -> export
python -m skillcorpus.cli stats     # counts by source / category / license
python -m skillcorpus.cli export --out ./corpus
```

Only skills from GREEN-licensed **sources** are exported (the demo trusts the whitelist in
`audit/license_safe_sources.json` wholesale; production gates per source-repo SPDX). The per-row
`license` is each skill's declared value, so a demo corpus can still carry non-GREEN `license`
strings. Use `--sources-config your.yaml` for your own registry, or `--source <name>` for one source.

```bash
pip install -e ".[dev]"
python -m pytest skillcorpus/tests -p no:cacheprovider --import-mode=importlib
```

## Roadmap

- [x] Curation pipeline: 16-class taxonomy, 3-facet quality, per-source license audit
- [x] Fine-tuned retrieval stack + three-benchmark evaluation
- [x] Public SkillHub endpoint
- [x] Retrieval models (bi-encoder + reranker) and a 1k demo corpus on HuggingFace
- [ ] Full 114,190-skill corpus on HuggingFace
- [x] Deployment script for the two retrieval models (self-hosting `match/`)
- [x] Plugins for WorkBuddy · Hermes · OpenClaw · DeepSeek Harness (+ HTTP adapter for any other host)
- [ ] Raven plugin — packaged, waiting on the upstream `context_segments` slot

## EverMind Ecosystem

EverMind is an open-source ecosystem for long-term memory, self-evolving agents, AI-native interfaces, and memory evaluation.

EverMind Open-Source Ecosystem

Memory Runtime
[EverOS](https://github.com/EverMind-AI/EverOS) — the local memory operating system and research-backed runtime for agent and user memory.

Self-Improving Agent Harness
[Raven](https://github.com/EverMind-AI/Raven) — the self-improving agent harness that brings memory, proactivity, context control, and skill evolution into terminal-native agents.

Agent Skills & Retrieval
[SkillCorpus](https://github.com/EverMind-AI/SkillCorpus) — open curation and retrieval tooling, a public [1K demo corpus](https://huggingface.co/datasets/EverMind-AI/skillcorpus-demo-1k), [SkillHub](https://evermind.ai/skillhub), agent integrations, and benchmarks.

Algorithm Engine
[EverAlgo](https://github.com/EverMind-AI/EverAlgo) — stateless extraction, ranking, parsing, and memory operators that power EverOS.

Hypergraph Memory
[HyperMem](https://github.com/EverMind-AI/HyperMem) — hypergraph memory for long-term conversations, with its own benchmark-backed topic → episode → fact retrieval method.

Benchmarks
[EverMemBench](https://github.com/EverMind-AI/EverMemBench) · [EvoAgentBench](https://github.com/EverMind-AI/EvoAgentBench) — evaluation suites for conversational memory and agent self-evolution.

Long-Context Research
[MSA](https://github.com/EverMind-AI/MSA) — Memory Sparse Attention for scalable latent memory and 100M-token contexts.

Personal Memory Layer
[EverMe](https://github.com/EverMind-AI/EverMe) — CLI and agent plugin suite for cross-device, cross-agent personal memory.

Developer Integrations
[evermem-claude-code](https://github.com/EverMind-AI/evermem-claude-code) · [everos-plugins](https://github.com/EverMind-AI/everos-plugins) — plugins, skills, and migration tooling for AI coding agents.

Together, these repositories form EverMind's research-to-runtime stack: new memory methods, reusable algorithms, benchmark evidence, and practical agent integrations.

## Citation

```bibtex
@article{wang2026skillcorpus,
  title         = {SkillCorpus: Consolidating and Evaluating the Open Skill Ecosystem for Real-World LLM Agents},
  author        = {Wang, Yanze and Yao, Pengfei and Sun, Tianyi and Hu, Chuanrui and Xiao, Yan and Luo, Xiaotian and Han, Yunyun and Chen, Yifan and Sun, Jun and Deng, Yafeng},
  year          = {2026},
  eprint        = {2607.15557},
  archivePrefix = {arXiv},
  url           = {https://arxiv.org/abs/2607.15557}
}
```