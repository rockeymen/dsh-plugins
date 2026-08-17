![EverOS banner](https://github.com/user-attachments/assets/806e9d7f-c861-4b89-9141-11e38f8753e3)

  <kbd>Table of Contents</kbd>

- [Why Ever OS](#why-ever-os)
- [Quick Start](#quick-start)
- [Use Cases](#use-cases)
- [Documentation](#documentation)
- [EverMind Ecosystems](#evermind-ecosystems)
- [Contributing](#contributing)

## Why Ever OS

EverOS is a Python library and local-first memory runtime for agents and
makers. It gives one portable memory layer across coding assistants, apps,
devices, and workflows from day one. It stores conversations, files, and agent
trajectories as readable Markdown, then syncs local SQLite and LanceDB indexes
for fast retrieval and self-evolving reuse.

Title
EverOS
Other Agent Memory Libraries

Markdown source of truth
✅ Canonical `.md` files that are readable, editable, diffable, and Git-versioned
❌ Usually API, vector, graph, dashboard, or database state

Direct file editing
✅ Edit `.md` files; cascade watcher syncs
❌ Usually SDK, API, dashboard, or backend update paths

Local three-part stack
✅ Markdown + SQLite + LanceDB; no MongoDB, Elasticsearch, or Redis required
❌ Often depends on managed services, vector DBs, graph DBs, or server stacks

User + agent tracks
✅ User `episodes/profile` and agent `cases/skills` are separate first-class surfaces
❌ Usually centered on chat history, profiles, entities, facts, or retrieval records

Orthogonal retrieval
✅ Search by `user_id`, `agent_id`, `app_id`, `project_id`, and `session_id`
❌ Usually app, namespace, tenant, thread, or graph scoped

Knowledge Wiki
✅ Editable, source-backed Markdown knowledge pages with taxonomy, CRUD APIs, and topic search
❌ Usually separate from memory, trapped in a dashboard, or not tied back to source files

Reflection
✅ Offline memory evolution that merges episode clusters and refines profiles and skills between sessions
❌ Usually retrieval-only memory with little background consolidation or long-horizon improvement

## Quick Start

> One OpenRouter API key is enough to start EverOS, write durable memories,
> and retrieve them with keyword search.

### Prerequisites

- Python 3.12+
- One [OpenRouter API key](https://openrouter.ai/keys)

### 1. Install

```bash
uv pip install everos
# or: pip install everos
```

### 2. Try the standalone demo — no key required

No API key or server setup required—run one command to quickly experience how
EverOS stores and recalls memory:

```bash
# If you installed EverOS as a package:
everos demo

# If you cloned or forked this repository and have not activated .venv:
uv run everos demo
```

Enter something EverOS should remember, then ask a related question to watch
the memory move through ingest -> extract -> index -> recall.

<https://github.com/user-attachments/assets/98cb8e1e-2ca8-4504-b0a6-0b9a040a0a5c>

### 3. Initialize and add your OpenRouter key

```bash
everos init
```

This creates `~/.everos/everos.toml` and `~/.everos/ome.toml`. Open
`~/.everos/everos.toml`; the generated model and OpenRouter URL are already
correct, so replace only the empty `api_key`:

```toml
[llm]
model = "openai/gpt-4.1-mini"
api_key = "<OPENROUTER_API_KEY>"
base_url = "https://openrouter.ai/api/v1"
```

This is the smallest Tier 1 setup: memory add, flush, Markdown persistence,
cascade indexing, and keyword search.

Use `everos init --root ` if you want a different memory root. Pass the
same `--root ` to subsequent commands.

### 4. Start EverOS

```bash
everos server start
```

Keep the server running, then open a second terminal and check it:

```bash
curl http://127.0.0.1:8000/health
```

Look for `"status":"ok"`. With this one-key setup, `capabilities.llm` is
`true`; embedding and rerank remain `false` until you configure them.

### 5. Add and retrieve your first memory

> [!NOTE]
> Business endpoints live under `/api/v2`. The older `/api/v1` prefix still
> resolves to the same handlers so existing integrations keep working, but it
> is a legacy alias that may be removed in a future major release — write new
> code against `/api/v2`.

Add a tiny conversation:

```bash
TS=$(($(date +%s)*1000))

curl -X POST http://127.0.0.1:8000/api/v2/memory/add \
  -H 'Content-Type: application/json' \
  -d "{
    \"session_id\": \"demo-001\",
    \"app_id\": \"default\",
    \"project_id\": \"default\",
    \"messages\": [
      {\"sender_id\": \"alice\", \"role\": \"user\", \"timestamp\": $TS, \"content\": \"I love climbing in Yosemite every spring.\"},
      {\"sender_id\": \"alice\", \"role\": \"user\", \"timestamp\": $((TS+10000)), \"content\": \"My favorite coffee shop is Blue Bottle in SOMA.\"}
    ]
  }"
```

Flush the memory at the end of the session:

```bash
curl -X POST http://127.0.0.1:8000/api/v2/memory/flush \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"demo-001","app_id":"default","project_id":"default"}'
```

Search it back:

```bash
curl -X POST http://127.0.0.1:8000/api/v2/memory/search \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "alice",
    "app_id": "default",
    "project_id": "default",
    "query": "Where do I like to climb?",
    "method": "keyword",
    "top_k": 5
  }'
```

You should see the Yosemite memory in the response. Keep
`"method": "keyword"` in this one-key setup because the API defaults to hybrid
search, which requires an embedding provider.

> [!TIP]
> **First memory unlocked.**
> You just gave EverOS a fact, flushed it into durable Markdown-backed memory,
> and searched it back through the local index. That is the core loop.
> Want to see the source of truth? Open `~/.everos` and inspect the generated
> Markdown files.

For annotated responses and the Markdown files EverOS creates, see
[QUICKSTART.md](QUICKSTART.md).

### What works with one key?

The OpenRouter one-key setup is EverOS Tier 1. It supports server startup,
memory add and flush, durable Markdown storage, cascade indexing, and keyword
search. Add optional providers only when you need the features below:

### Configuration · Adds
- **Configuration**: `[llm]` only · **Adds**: Core memory flow and keyword search
- **Configuration**: Add `[embedding]` · **Adds**: Vector/user hybrid search, reflection, and skill extraction
- **Configuration**: Add `[rerank]` too · **Adds**: Agentic search, default agent hybrid search, and Knowledge Wiki
- **Configuration**: Add `[multimodal]` and parser extra · **Adds**: Image, PDF, audio, and office-file ingestion

Missing optional capabilities are reported by `/health` and return a clear
HTTP 422 if you request a feature that needs them.

> [!NOTE]
> `everos demo --live` is different from the standalone demo in step 2: it
> connects to a running server and uses the real add/flush/search flow. It uses
> hybrid search, so add an embedding provider before you run it.

### Optional: Ingest Multimodal Files

To ingest non-text content (image / pdf / audio / office documents)
through `/api/v2/memory/add` `content` items, install the optional
extra:

```bash
uv pip install 'everos[multimodal]'   # or: pip install 'everos[multimodal]'
```

This pulls in `everalgo-parser` (with the `[svg]` bundle for SVG support via
cairosvg). Configure the `[multimodal]` section in `everos.toml`; its default
model is `google/gemini-3-flash-preview` via OpenRouter.

**Office document support requires LibreOffice as a system dependency.**
The parser shells out to `soffice` (LibreOffice's headless renderer) to
convert `.doc` / `.docx` / `.ppt` / `.pptx` / `.xls` / `.xlsx` to PDF
before feeding the result into the multimodal LLM. Without LibreOffice,
office uploads return HTTP 415 with a clear error message; PDF / image
/ audio / HTML / email parsing is unaffected.

Install on the host before serving office documents:

```bash
brew install --cask libreoffice              # macOS
sudo apt-get install -y libreoffice          # Debian / Ubuntu
```

### For Contributors

```bash
git clone https://github.com/EverMind-AI/EverOS.git
cd EverOS
uv sync                              # creates ./.venv and installs deps
uv run everos demo --plain           # try the local educational demo; no API keys needed
uv run everos init                   # add one OpenRouter key to ~/.everos/everos.toml

uv run everos --help
make test
```

## Use Cases

Now that you have had your first successful EverOS moment, explore what people
are building with persistent memory across agents, apps, and community
integrations.

Use cases show what persistent memory makes possible in real products and
workflows. Some examples are packaged in this repository; others point to
external demos or integrations you can study and adapt.

[![banner-gif](https://github.com/user-attachments/assets/840470d7-a838-4c05-8685-dd797d4e9cdf)](https://evermind.ai/usecase_reunite)

#### Reunite - Find With EverOS

Parents describe what they remember. Children describe what they recall. Reunite uses semantic memory to surface the connections.

[Learn more](https://evermind.ai/usecase_reunite)

[![banner-gif](https://github.com/user-attachments/assets/7282b38b-56bf-4356-aa7b-06a845e7683d)](https://github.com/tt-a1i/hive)

#### Hive Orchestrator

Browser-native hive-mind for CLI coding agents - Claude Code, Codex, Gemini, and OpenCode collaborate as real PTY processes via a team protocol.

[Code](https://github.com/tt-a1i/hive)

[![banner-gif](https://github.com/user-attachments/assets/867d9329-ce9a-496f-ab1e-15c77974e5fa)](https://github.com/tt-a1i/evermemos-mcp)

#### AI Coding Assistants With EverOS

Universal long-term memory layer for AI coding assistants, powered by EverOS.

[Code](https://github.com/tt-a1i/evermemos-mcp)

[![banner-gif](https://github.com/user-attachments/assets/a4f0fd86-1c81-4445-bebc-e51eb5e33b30)](https://github.com/yuansui123/AI-Data-Technician-EverMemOS)

#### AI Data Technician

An agentic AI system that learns from scientist interaction to inspect, analyze, and classify high-dimensional time series data - with persistent memory that improves across sessions.

[Code](https://github.com/yuansui123/AI-Data-Technician-EverMemOS)

![banner-gif](https://github.com/user-attachments/assets/650b901b-c9ba-4001-bac7-626b009df830)

#### Rokid AI Assistant With EverOS

Connect to EverOS within Rokid Glasses enabling long-term memory for all of your smart activities.

Coming soon

![banner-gif](https://github.com/user-attachments/assets/85b338b2-e48e-4a65-9f30-0bc6998df872)

#### Creative Assistant With Memory

Creative assistant with long-term memory, so your creative context stays available across sessions.

Coming soon

[![banner-gif](https://github.com/user-attachments/assets/f30617a1-adc0-4271-bc0e-c3a0b28cb903)](https://github.com/xunyud/Earth-Online)

#### Earth Online Memory Game

Earth Online is a memory-aware productivity game that turns everyday planning into a living quest log.

[Code](https://github.com/xunyud/Earth-Online)

[![banner-gif](https://github.com/user-attachments/assets/57d8cda7-35a5-4561-b794-5520dffc917b)](https://github.com/golutra/golutra)

#### Multi-Agent Orchestration Platform

Golutra presents a multi-agent workforce for engineering teams, extending the IDE model from a single assistant to coordinated agents.

[Code](https://github.com/golutra/golutra)

[![banner-gif](https://github.com/user-attachments/assets/75f19db5-30f6-4eed-9b1e-c9c6a0e6b7de)](https://github.com/Yangtze-Seventh/taste-verse)

#### Your Personal Tasting Universe

Record, visualize, and explore your tasting journey through an immersive 3D star map.

[Code](https://github.com/Yangtze-Seventh/taste-verse)

[![banner-gif](https://github.com/user-attachments/assets/93ac2a68-4f18-4fcb-8d87-80aeb00a9d7c)](https://github.com/kellyvv/OpenHer)

#### EverOS Open Her

Build AI that feels. Open-source persona engine - personality emerges from neural drives, not prompts. Inspired by Her.

[Code](https://github.com/kellyvv/OpenHer)

[![banner-gif](https://github.com/user-attachments/assets/550071c1-dc39-4964-9f67-ffdfad792345)](https://chromewebstore.google.com/detail/ruminer-browser-agent/lbccjohfpdpimbhpckljimgolndfmfif)

#### Browser Agent For Personal Memory

Ruminer brings persistent memory to a browser agent so it can carry personal context across web tasks.

[Plugin](https://chromewebstore.google.com/detail/ruminer-browser-agent/lbccjohfpdpimbhpckljimgolndfmfif)

[![banner-gif](https://github.com/user-attachments/assets/c258a6c4-fe70-497a-98d1-3dade4a932f6)](https://github.com/nanxingw/EverMem)

#### EverMem Sync With EverOS

One command to connect any AI coding CLI to EverMemOS long-term memory.

[Code](https://github.com/nanxingw/EverMem)

[![banner-gif](https://github.com/user-attachments/assets/39274473-ceb3-48fb-a031-e22230decbe2)](https://github.com/mco-org/mco)

#### MCO - Orchestrate AI Coding Agents

MCO equips your primary agent with an agent team that can work together to solve complex tasks.

[Code](https://github.com/mco-org/mco)

[![banner-gif](https://github.com/user-attachments/assets/314c9126-8e08-4688-bbbb-8555ad58cf67)](https://github.com/onenewborn/StudyBuddy-public)

#### Study Buddy With Self-Evolving Memory

Study proactively with an agent that has self-evolving memory.

[Code](https://github.com/onenewborn/StudyBuddy-public)

[![banner-gif](https://github.com/user-attachments/assets/21da76aa-9a8b-48e0-9134-42429d7390e7)](https://github.com/TonyLiangDesign/MemoCare)

#### Alzheimer's Memory Assistant

Empowering individuals with advanced memory support and daily assistance.

[Code](https://github.com/TonyLiangDesign/MemoCare)

[![banner-gif](https://github.com/user-attachments/assets/e2428df3-ea11-4e88-8f9c-dad437dd8998)](https://github.com/AlexL1024/NeuralConnect)

#### Memory-Driven Multi-Agent NPC Experience

An iOS sci-fi mystery game where players explore and uncover the truth.

[Code](https://github.com/AlexL1024/NeuralConnect)

[![banner-gif](https://github.com/user-attachments/assets/e6eaf308-a874-483f-8874-6934bf95a78f)](https://github.com/elontusk5219-prog/Mobi)

#### Mobi Companion

An iOS app where users create, nurture, and live with a personalized AI companion called Mobi.

[Code](https://github.com/elontusk5219-prog/Mobi)

[![banner-gif](https://github.com/user-attachments/assets/9aabcaa9-f97a-49d2-9109-0b5bb696ed41)](https://github.com/JaMesLiMers/EvermemCompetition-Spiro)

#### AI Wearable With Memory

A context-native AI wearable that listens to everyday life and converts conversations into memory.

[Code](https://github.com/JaMesLiMers/EvermemCompetition-Spiro)

[![banner-gif](https://github.com/user-attachments/assets/df9677ec-386f-4c56-a428-08bca25c54dc)](docs/migration-to-1.0.0.md)

#### Legacy OpenClaw Agent Memory

Archived pre-1.0.0 plugin reference. New integrations should use the current EverOS API.

[Learn more](docs/migration-to-1.0.0.md)

[![banner-gif](https://github.com/user-attachments/assets/3a2357a1-c0c3-464a-8979-0d1cdfc9b0d4)](https://github.com/TEN-framework/ten-framework/tree/04cb80601374fa9e35b4e544b2dbd23286ca7763/ai_agents/agents/examples/voice-assistant-with-EverMemOS)

#### Live2D Character With Memory

Add long-term memory to a real-time Live2D character, powered by [TEN Framework](https://github.com/TEN-framework/ten-framework).

[Code](https://github.com/TEN-framework/ten-framework/tree/04cb80601374fa9e35b4e544b2dbd23286ca7763/ai_agents/agents/examples/voice-assistant-with-EverMemOS)

[![banner-gif](https://github.com/user-attachments/assets/c36bdc04-97d3-4fe9-97d9-4b93b475595a)](https://screenshot-analysis-vercel.vercel.app/)

#### Computer-Use With Memory

Run screenshot-based analysis with computer-use and store the results in memory.

[Live Demo](https://screenshot-analysis-vercel.vercel.app/)

[![banner-gif](https://github.com/user-attachments/assets/54a7cf8f-62c4-4fbc-9d50-b214d034e051)](use-cases/game-of-throne-demo)

#### Game Of Thrones Memories

A demonstration of AI memory infrastructure through an interactive Q&A experience with *A Game of Thrones*.

[Code](use-cases/game-of-throne-demo)

[![banner-gif](https://github.com/user-attachments/assets/af37c1f6-7ba5-430c-b99d-2a7e7eac618f)](use-cases/claude-code-plugin)

#### Claude Code Plugin

Persistent memory for Claude Code. Automatically saves and recalls context from past coding sessions.

[Code](use-cases/claude-code-plugin)

[![banner-gif](https://github.com/user-attachments/assets/d521d28c-0ccd-44ff-aecc-828245e2f973)](https://main.d2j21qxnymu6wl.amplifyapp.com/graph.html)

#### Memory Graph Visualization

Explore stored entities and relationships in a graph interface. Frontend demo; backend integration is in progress.

[Live Demo](https://main.d2j21qxnymu6wl.amplifyapp.com/graph.html)

## Documentation

- [docs/everos-demo.md](docs/everos-demo.md) — Demo scope and TUI source layout
- [docs/how-memory-works.md](docs/how-memory-works.md) — Markdown, SQLite, LanceDB, and recall flow
- [docs/use-cases.md](docs/use-cases.md) — Full use-case gallery and integration examples
- [docs/engineering.md](docs/engineering.md) — Contributor engineering reference: build, test, CI, conventions
- [docs/migration-to-1.0.0.md](docs/migration-to-1.0.0.md) — Legacy API migration notes
- [CHANGELOG.md](CHANGELOG.md) — Release notes
- [CONTRIBUTING.md](CONTRIBUTING.md) — How to contribute

## EverMind Ecosystems

EverMind is an open-source ecosystem for long-term memory, self-evolving
agents, AI-native interfaces, and memory evaluation.

EverMind Open-Source Ecosystem

Memory Runtime
[EverOS](https://github.com/EverMind-AI/EverOS) - the local memory operating system and research-backed runtime for agent and user memory.

Self-Improving Agent Harness
[Raven](https://github.com/EverMind-AI/Raven) - the self-improving agent harness that brings memory, proactivity, context control, and skill evolution into terminal-native agents.

Algorithm Engine
[EverAlgo](https://github.com/EverMind-AI/EverAlgo) - stateless extraction, ranking, parsing, and memory operators that power EverOS.

Hypergraph Memory
[HyperMem](https://github.com/EverMind