![ReMe Logo](docs/figure/reme_logo.png)

  A local-first, self-evolving personal knowledge base for AI agents.

> Previous versions: [0.3.x](https://github.com/agentscope-ai/ReMe/tree/reme_v3) ·
> [0.2.x](https://github.com/agentscope-ai/ReMe/tree/v0.2.0.6) ·
> [MemoryScope](https://github.com/agentscope-ai/ReMe/tree/memoryscope_branch)

## ✨ Why ReMe?

🧠 ReMe turns conversations and resources into readable, editable, searchable, and interconnected Markdown memory. Agents
such as QwenPaw, OpenClaw, Hermes, and Claude Code can share the same workspace to retrieve, maintain, and evolve
knowledge, while users retain control of the durable files.

- **Memory as File, File as Memory**: ReMe stores durable memory as ordinary Markdown with frontmatter and wikilinks.
  Users and agents can inspect, edit, move, sync, and back it up with familiar tools, while indexes and generated
  metadata remain rebuildable.
- **Self-evolving knowledge base**: ReMe progressively turns conversations and resources into daily notes and long-term
  knowledge, preserving sources while refining facts, preferences, procedures, and relationships over time.
- **Recall is precise and context-aware.** BM25, optional embeddings, and wikilink expansion retrieve relevant
  line-level passages and their relationships without loading the entire knowledge base into the agent context.
- **One memory workspace works across agents.** Personal assistants, coding agents, and other agent runtimes can share
  the same local workspace through native integrations, SKILL.md, CLI, HTTP, MCP, or Python APIs.

  ![ReMe Design Philosophy](docs/figure/design-philosophy.svg)

## 📰 Latest Updates

- [2026.08] - Published [`@agentscope-ai/reme`](https://www.npmjs.com/package/@agentscope-ai/reme), providing a native
  ReMe memory integration for DeepSeek Harness.
- [2026.08] - Published the [ReMe blog](https://agentscope-ai.github.io/ReMe/?doc=en-reme-blog), an end-to-end introduction to its local-first memory
  architecture, self-evolving workflows, hybrid search, proactive discovery, and benchmark results.
- [2026.08] - [Experience-driven enhancement method](https://reme.agentscope.io/?doc=toolmemory-en) of agent tool-use execution built
  on ReMe is available on [arXiv:2608.03403](https://arxiv.org/abs/2608.03403).
- [2026.07] - Introduced optional plugins: [Daily Paper](https://reme.agentscope.io/?doc=daily-paper-en) for paper discovery and
  analysis, and [Auto Fin](https://reme.agentscope.io/?doc=auto-fin-en) for researching the latest 24 hours of topic-related CLS news
  with local-memory search and validated historical wikilinks.
- [2026.07] - Our
  paper [Remember Me, Refine Me: A Dynamic Procedural Memory Framework for Experience-Driven Agent Evolution](https://aclanthology.org/2026.findings-acl.829/)
  has been accepted to Findings of ACL 2026.

## 🚀 Quick Start

### Installation

ReMe requires Python 3.11+.

Install from pip:

```bash
pip install "reme-ai[core]"
```

Install from source:

```bash
git clone https://github.com/agentscope-ai/ReMe.git
cd ReMe
pip install -e packages/reme_ai_studio -e ".[core]"
cd website
npm ci
npm run build:static
cd ..
```

The static build requires Node.js 22.13 or newer and makes Studio available from the source tree.

### Start the Service

```bash
reme start
```

The default service address is `127.0.0.1:2333`. If the port is occupied, specify another port:

```bash
reme start service.port=8181
# reme start workspace_dir=/tmp/reme-demo service.port=8181
```

```bash
reme version
reme health_check
reme help
curl -s http://127.0.0.1:2333/version -H 'Content-Type: application/json' -d '{}'
```

### 5-Minute Memory Demo

With the service running, write a memory node, let ReMe index it, then retrieve it:

```bash
reme write \
  path=digest/wiki/quick-start-demo \
  name="Quick Start Demo" \
  description="A first ReMe memory node" \
  content="# Quick Start Demo

ReMe stores agent memory as readable Markdown.

Related: [[digest/wiki/memory-as-file.md]]"

reme search query="agent memory markdown" limit=5
reme read path=digest/wiki/quick-start-demo start_line=1 end_line=20
```

The generated file is ordinary Markdown with frontmatter:

```markdown
name: Quick Start Demo
description: A first ReMe memory node

# Quick Start Demo

ReMe stores agent memory as readable Markdown.

Related: [[digest/wiki/memory-as-file.md]]
```

### ReMe Studio (Optional)

The `core` installation includes Studio. After starting ReMe, open <http://127.0.0.1:2333/> to browse, edit, and search
the workspace. To add Studio to a base installation, use `pip install "reme-ai[web]"`. See the
[ReMe Studio guide](https://reme.agentscope.io/?doc=studio-en) for source builds, configuration, and development.

### Optional Model Configuration

Configure environment variables when you want LLM-powered memory evolution or embedding retrieval. Embeddings are
disabled by default, so the default setup does not start an embedding model or require an embedding API key.

```bash
cat > .env <<'EOF'
# Optional: used only after embedding components are explicitly enabled in the config.
# EMBEDDING_API_KEY=sk-xxx
# EMBEDDING_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# Required for auto_memory, auto_resource, and auto_dream.
LLM_API_KEY=sk-xxx
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
EOF
```

Basic file operations, BM25 search, wikilink traversal, and reading proactive topics can run without LLM credentials.

> [!NOTE]
> To enable embedding-based semantic retrieval, uncomment `components.as_embedding` and
> `components.embedding_store` in [`reme/config/default.yaml`](reme/config/default.yaml), then change
> `components.file_store.default.embedding_store` from `""` to `default`. See the
> [memory search guide](docs/en/memory_search.md) for details.

## 🤝 Use ReMe with Your Agent

ReMe can run as a local memory service accessed through the CLI, HTTP API, or MCP server, or it can be embedded in the
host process through its Python API. Host integrations can add memory guidance, recall, and capture to the agent
lifecycle according to the capabilities of each runtime.

### Agent · Recommended path · Available after integration
- **Agent**: **DeepSeek Harness** · **Recommended path**: Install [`@agentscope-ai/reme`](packages/typescript/README.md#deepseek-harness) with `dsh plugin --profile web add @agentscope-ai/reme`. · **Available after integration**: Long-term memory guidance, the `reme_search` tool, and automatic capture of completed main-agent turns.
- **Agent**: **OpenClaw** · **Recommended path**: Install [`@agentscope-ai/reme`](packages/typescript/README.md#openclaw) with `openclaw plugins install @agentscope-ai/reme`. · **Available after integration**: Native memory tools, recall before user-triggered runs, and automatic turn capture.
- **Agent**: **QwenPaw** · **Recommended path**: Embed ReMe in-process through its Python API. · **Available after integration**: Reuse the host lifecycle and model config while keeping memory local and file-based.
- **Agent**: **Claude Code** · **Recommended path**: Start the streamable HTTP MCP service and install [the ReMe plugin](integrations/claude_code/reme). · **Available after integration**: MCP recall tools, the `reme-memory` skill, and a Stop hook that records sessions automatically.
- **Agent**: **Hermes** · **Recommended path**: Start the HTTP service and install [the ReMe provider](integrations/hermes_agent). · **Available after integration**: Recall before model calls and asynchronous `auto_memory` after each completed turn.
- **Agent**: **Codex and other CLI agents** · **Recommended path**: Install or copy the [ReMe Memory skill](skills/reme_memory/SKILL.md). · **Available after integration**: Search, read, and write memory through the CLI; automatic capture requires host lifecycle integration.

Integration demos

  
    
    Auto Memory
    Auto Dream
  
  
    QwenPaw
    
      ![QwenPaw Auto Memory demo](docs/figure/qwenpaw-auto-memory.gif)
    
    
      ![QwenPaw Auto Dream demo](docs/figure/qwenpaw-auto-dream.gif)
    
  
  
    Claude Code
    
      ![Claude Code Auto Memory demo](docs/figure/cc-auto-memory.gif)
    
    
      ![Claude Code Auto Dream demo](docs/figure/cc-auto-dream.gif)
    
  

## 🧠 How ReMe Works

> Memory as File, File as Memory.

ReMe treats **memory as files**, progressively processing filtered conversation source records and external resources
from `session/` and `resource/` into `daily/`, then `digest/`. The default workspace is `.reme/` under the current
directory; `workspace_dir=...` selects a different user-owned location.

### Workspace Layout

```text
<workspace_dir>/
├── metadata/       # Rebuildable indexes, graphs, catalogs, and caches
├── session/        # Conversation source records and agent sessions
│   ├── dialog/
│   │   └── <session_id>.jsonl  # Source messages saved by auto_memory
│   └── claude_code/
│       └── <session_id>.jsonl  # ReMe copy used by auto_memory_cc
├── mem_session/    # Generated agent-wrapper sessions/config, not user memory
│   ├── agentscope/
│   ├── claude_config/
│   └── codex/
├── resource/            # External raw materials
│   ├── <resource>.<ext>  # Root-level files enter today's daily layer
│   └── YYYY-MM-DD/
│       └── <resource>.<ext>
├── daily/               # Lightly processed memory: daily facts, conversation summaries, resource readings
│   ├── YYYY-MM-DD.md
│   └── YYYY-MM-DD/
│       ├── <generated_name>.md  # Topic-named conversation or resource card
│       └── interests.yaml
└── digest/              # Long-term memory: personal facts, procedural experience, knowledge nodes
    ├── personal/
    │   └── {topic/event}.md
    ├── procedure/
    │   └── {topic/event}.md
    └── wiki/
        └── {topic/event}.md
```

  ![ReMe file-based memory system overview](docs/figure/reme-overview.svg)

### Memory Lifecycle

ReMe follows a capture → index → consolidate → recall loop. Workspace files remain the durable source of truth;
everything under `metadata/` is rebuildable.

### Capability · Entry point · What it does · Output
- **Capability**: [`auto_memory`](docs/en/auto_memory.md) · **Entry point**: Agent hook or `reme auto_memory` · **What it does**: Distills useful conversation facts while preserving a filtered conversation source record. · **Output**: `session/dialog/*.jsonl`, `daily/<date>/<generated-name>.md`
- **Capability**: [`auto_resource`](docs/en/auto_resource.md) · **Entry point**: Resource watcher or `reme auto_resource` · **What it does**: Turns files under `resource/` into source-linked, content-named daily cards. · **Output**: `daily/<date>/<resource-card>.md`
- **Capability**: [`auto_index`](docs/en/memory_search.md) · **Entry point**: Background watcher or `reme reindex` · **What it does**: Live-indexes Markdown in `daily/` and `digest/`; a full rebuild also scans `resource/` and JSONL. · **Output**: Searchable chunks, BM25, wikilink graph, and optional vectors
- **Capability**: [`auto_dream`](docs/en/auto_dream.md) · **Entry point**: `dream_cron` or `reme auto_dream` · **What it does**: By default, extracts up to five reusable units from changed files in the latest two-day window, then creates, corroborates, refines, or corrects digest nodes. · **Output**: `digest/**`, `daily/<date>/interests.yaml`
- **Capability**: [`proactive`](docs/en/proactive.md) · **Entry point**: `reme proactive` before an agent decides to act · **What it does**: Reads topics generated by `auto_dream`; the host agent decides whether and how to mention them. · **Output**: Structured topics from `daily/<date>/interests.yaml`

  
    
      ![Memory as File](docs/figure/memory-as-file.svg)
    
    
      ![Auto Memory and Resource](docs/figure/auto-memory-resource.svg)
    
  
  
    
      ![Auto Dream and Proactive](docs/figure/auto-dream-and-proactive.svg)
    
    
      ![Auto Index and Memory Search](docs/figure/auto-index-and-memory-search.svg)
    
  

Search returns matching chunks with line ranges and bounded wikilink neighbors. Optional vector results are fused with
BM25 through reciprocal rank fusion (RRF).

> [!IMPORTANT]
>
> `proactive` only reads and exposes interest topics produced by Auto Dream. It does not independently browse the web,
> send notifications, or rewrite the knowledge base; the host agent decides whether and how to act on a topic.

## 📊 Benchmarks

ReMe evaluates multi-session and long-context memory with agentic search-and-read workflows. The figures below are the
published reference runs in this repository; model, prompt, dataset, and judging details are documented with each
benchmark.

### Benchmark · Setting · Sample size · Agentic score · Focus
- **Benchmark**: **[LongMemEval cleaned-s](https://reme.agentscope.io/?doc=longmemeval-en)** · **Setting**: **Overall** · **Sample size**: **500 questions** · **Agentic score**: **89.4%** · **Focus**: Cross-session retrieval, knowledge updates, and temporal reasoning
- **Benchmark**: [BEAM](https://reme.agentscope.io/?doc=beam-en) · **Setting**: 100K context · **Sample size**: 20 cases / 400 questions · **Agentic score**: 66.1% · **Focus**: Ten types of long-context memory tasks
- **Benchmark**: [BEAM](https://reme.agentscope.io/?doc=beam-en) · **Setting**: 1M context · **Sample size**: 35 cases / 700 questions · **Agentic score**: 65.0% · **Focus**: Ultra-long conversation settings

ReMe also achieved a **0.580 PROC score across five user personas** in the repository's
[π-Bench evaluation](https://reme.agentscope.io/?doc=pibench-en), 2.4% above NanoBot under the same test-model configuration. PROC
measures proactive handling of hidden intent, clarification, cross-session preferences and conventions, task
dependencies, and underspecified requests.

## 🧩 Extensions and Workflows

Plugins are optional Python distributions that contribute Component, Step, or Job backends and configuration. They are
installed separately and enabled explicitly by configuration. Daily Paper and Auto Fin are independently packaged
plugins; their source distributions live under [`plugins/`](plugins/README.md).

### Plugin · Capability
- **Plugin**: [Daily Paper](https://reme.agentscope.io/?doc=daily-paper-en) · **Capability**: Discover and rank papers, analyze PDFs with an agent, and generate file-native notes and a five-minute brief.
- **Plugin**: [Auto Fin](https://reme.agentscope.io/?doc=auto-fin-en) · **Capability**: Fetch topic-related CLS news, search ReMe history, and generate wikilink-backed Markdown reports.

See [Plugin Management](docs/en/plugin_management.md) to install, inspect, validate, enable, and uninstall ReMe plugins.

## 📚 Documentation

These guides cover the main user workflows and the runtime contracts implemented by the current code.

### Guide · What you will learn
- **Guide**: [Quick Start](docs/en/quick_start.md) · **What you will learn**: Install ReMe, start the service, and run the first file and memory operations.
- **Guide**: [Memory as File](docs/en/memory_as_file.md) · **What you will learn**: Understand workspace layers, frontmatter, wikilinks, chunks, and the file-as-source-of-truth model.
- **Guide**: [Auto Memory](docs/en/auto_memory.md) · **What you will learn**: Preserve source conversations and distill reusable daily memory cards.
- **Guide**: [Auto Resource](docs/en/auto_resource.md) · **What you will learn**: Import supported text resources and turn them into source-linked daily cards.
- **Guide**: [Auto Dream](docs/en/auto_dream.md) and [Auto Link](docs/en/auto_link.md) · **What you will learn**: Consolidate daily notes into evolving digest nodes and readable wikilink relationships.
- **Guide**: [Memory Search](docs/en/memory_search.md) · **What you will learn**: Use BM25, optional vectors, RRF fusion, line-range recall, and progressive link expansion.
- **Guide**: [Proactive](docs/en/proactive.md) · **What you will learn**: Read interest topics safely and integrate them into a host agent's decision flow.
- **Guide**: [Agent Integration Scenarios](docs/en/reme_scene.md) · **What you will learn**: Choose among CLI/SKILL.md, HTTP, MCP, and embedded Python integration.
- **Guide**: [Framework](docs/en/framework.md) · **What you will learn**: Understand Application, Job, Step, Component, service, configuration, and lifecycle boundaries.
- **Guide**: [ReMe Blog](https://agentscope-ai.github.io/ReMe/?doc=en-reme-blog) · **What you will learn**: Read the product story, design rationale, examples, and benchmark summary.

## 🛠️ Common Commands

Run `reme help` for the full job list. Common workspace and maintenance commands are:

### Command · Purpose
- **Command**: `reme status` · **Purpose**: Show stateful data-component memory estimates and process RSS.
- **Command**: [`reme search`](docs/en/memory_search.md) · **Purpose**: Retrieve memory with BM25 and wikilinks by default, plus vectors when enabled.
- **Command**: `reme read` / `reme write` / `reme edit` · **Purpose**: Inspect and maintain Markdown memory files.
- **Command**: `reme traverse` / `reme graph_snapshot` · **Purpose**: Explore wikilink neighborhoods or the category-rooted digest graph.
- **Command**: `reme chat` · **Purpose**: Stream a read-only, workspace-aware agent conversation. Requires LLM credentials.
- **Command**: `reme reindex` · **Purpose**: Rebuild search and wikilink indexes from existing files.

## 🤝 Community and Contributing

- **Issues, requests, and help**: Check [Open Issues](https://github.com/agentscope-ai/ReMe/issues) first. If there is no
  related discussion, open one with the background, expected behavior, and impact scope.
- **Code contributions**: Before making changes, read
  the [contribution guide](https://docs.agentscope.io/reme/latest/en/contribution). Source, schemas, and tests are the
  authoritative architecture and extension guide.
- **Documentation contributions**: Submit user-facing documentation changes to the
  [unified documentation repository](https://githu