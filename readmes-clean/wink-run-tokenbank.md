# Token Bank

> **Personal AI Hub · Token Manager**
>
> See clearly · Spend less · Stay simple · Get smarter with you · Earn from idle
>
> One-click Claude / Cursor / Codex / WorkBuddy onboarding · one-stop trace & routing · portrait-driven discovery · community sharing & remote agents

## Overview

**Token Bank is a next-generation personal AI resource hub** that enables one-click onboarding and intelligent orchestration of mainstream AI tools like Claude, Cursor, Codex, and WorkBuddy through a local gateway architecture.

### Core Value Proposition

- **Usage Transparency**: Full-chain trace makes every token consumption accountable
- **Cost Optimization**: Smart routing automatically switches between local models, free quotas, paid subscriptions, and community-shared compute with lossless protocol adaptation
- **Sharing Economy**: P2P compute-sharing network creates a decentralized exchange for models and agents, monetizing idle resources into credits

### Technical Highlights

**Zero-Intrusion Integration**  
Declarative application handlers (CLI env injection + config hot-patching) enable seamless onboarding without modifying agent applications.

**Multi-Protocol Adaptation Layer**  
Transparent protocol conversion (Anthropic Messages, OpenAI Chat, Codex Responses) allows agents to use third-party models without awareness.

**Unified Asset Layer Architecture**  
Community agents run directly on users' existing agent applications (Codex, Claude, Cursor, etc.) without rebuilding harnesses, executing within user-accumulated MCP/Skill/Prompt assets for dual reuse of runtimes and tool ecosystems.

**Scenario Routing Engine**  
- Routing policy learning from usage patterns
- Lossless context compression
- Vision enhancement layer for non-multimodal models (automatic image recognition injection)

**MCP Built-in Relay & Resource Projection Gating**  
Constructs personal knowledge and tool ecosystems with controlled resource deployment.

**AI-Native Architecture**  
Abandons traditional hard-coded rules; lets agents dynamically construct core capabilities (asset discovery, personalized recommendations, routing optimization) based on actual scenarios and continuously evolve—building an agent management platform with agents—achieving high flexibility and robustness.

**Usage-Based Evolution**  
The system automatically extracts work portraits from real call records and session patterns, driving personalized recommendations for MCP/Skill/Prompt/Agent and continuous optimization of routing strategies. Multi-device usage aggregation, agent orchestration, and more make Token Bank truly **smarter with you**.

## Why Token Bank

Pain points it tackles:

- Many model plans, little clarity on where tokens go each day
- Free quotas sit unused while paid bills rise; local models idle
- Tools, accounts, and devices don’t line up; Skills / MCP / prompts pile up
- Month-end plan credits expire unused

**Token Bank is your personal AI hub.** Plug Claude Code, Codex, Cursor, WorkBuddy, Kimi Code and more into a local gateway—keep familiar clients, **see clearly, spend less, stay simple**, grow resources from your habits (**get smarter with you**), and turn idle capacity into credits via **community sharing**; community agents can run on someone else’s machine (**earn from idle**).

**Five pillars:**

| Pillar | What you get |
|---|---|
| **See clearly** | One-click onboard; full trace; multi-device analytics; subscriptions vs PAYG side by side |
| **Spend less** | Seamless model swap; smart local-first + task-type routing; scene strategies; optional lossless compression |
| **Stay simple** | One-click onboard/restore; multi-account CLI by directory; tray status; one local address |
| **Get smarter with you** | Work portrait; personalized MCP / Skill / Prompt / Agent discover · accumulate · iterate |
| **Earn from idle** | Contribute idle capacity for credits; **hire agents**; circles & network map |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Desktop (Electron · Mac / Windows) or CLI / Docker Web UI      │
│  Gateway · Providers · Resources · Playground · Usage · …       │
└────────────────────────────┬────────────────────────────────────┘
                             │ loopback
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Local gateway  :11430/v1                                       │
│  · Anthropic Messages / OpenAI Chat / Codex Responses adapters  │
│  · keyScene rewrite · scene/task-type routing · compression     │
│  · Built-in MCP relay (prompts / models / resources / bridge)   │
└───────────────┬─────────────────────────────┬───────────────────┘
                │ local keys stay on device     │ login + relay key
                ▼                             ▼
     Ollama / free API / sub / PAYG      Token Bank cloud
                                             │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                         Community P2P   Remote agents   Multi-device
                         (WebSocket)     (run elsewhere) usage merge
```

**Implementation notes:**

| Layer | What it does |
|---|---|
| **App handlers** | Declarative `app-handlers.yaml` for CLI shim / config-file patch / session scan; WorkBuddy, Trae, Hermes, Kimi use strong install signals |
| **Routing** | Unified “route = selector chain”: personal/community/free/paid filters + task-type presets (`design` / `repo-qa` / `chore` / `debug`) |
| **Resource projection** | Skill / Prompt / MCP only onto **hosted and installed** targets; apps without stdio use the built-in MCP relay |
| **Telemetry** | Live gateway logs + local session import (Claude / Codex / Cursor / WorkBuddy Trace, …) with auto-dedupe |

## Core capabilities: one-click onboarding · seamless model swap · full trace

Token Bank is more than an API proxy — it brings **Claude Code, Codex, Cursor, WorkBuddy, Kimi Code, OpenClaw**, and other mainstream agents under one local gateway. **No agent-side changes required** for usage tracing, third-party model switching, and smart routing.

### One-click agent onboarding

Open the **Gateway** tab — installed tools appear automatically (desktop apps can be added manually):

| Agent | How it connects |
|---|---|
| Claude Code / Codex CLI / OpenCode / Hermes / Kimi Code | CLI shim: injects `BASE_URL` (and related) env vars — no command changes |
| Claude Desktop / Codex Desktop / OpenClaw / WorkBuddy | Config-file patch: one click to point at the local gateway (missing configs may be created after strong install detection) |
| Trae Work | Session import + manual gateway params inside the IDE |
| Cursor / Copilot / Qwen / Grok / … | Session stats, or set `OPENAI_BASE_URL` / a dedicated Gateway key |

**Onboarding flow:**

1. Click **Track** → start counting that app's token usage (even on the official subscription)
2. Pick a **model or scene route** in the dropdown → config is rewritten automatically; traffic goes through the gateway
3. Click **Revert** → restore the official config and stop tracking

Three states, clearly separated: **stats only** (official sub + session import), **via gateway** (route bound + live proxy), **reverted** (original config restored).

### Seamless third-party model switching

Agents keep their native model names (`claude-sonnet-4-6`, `gpt-5`, …). **The client never needs to change:**

```
Claude Code requests claude-sonnet-4-6
        ↓  gateway keyScene transparent rewrite
Actually routed → Groq llama-3.3-70b / local Ollama / DeepSeek / …
        ↓  protocol adapter
Anthropic Messages ↔ OpenAI Chat ↔ Codex Responses
```

- **Model names unchanged** — Claude client validation and UI stay the same
- **Automatic protocol conversion** — `/v1/messages`, `/v1/chat/completions`, `/v1/responses` each handled
- **Per-app bindings** — Claude Code on free Groq, Codex on local Ollama, independently
- **Switch back anytime** — choose "Direct (official)" in the route dropdown; config is restored cleanly

### Session trace (live proxy + session import)

Usage is traced whether or not traffic goes through the gateway:

| Mode | What it does |
|---|---|
| **Live proxy** | Requests via `localhost:11430` — logs route chain, resolved model, tokens, latency, cost |
| **Session import** | Tracked apps that still hit the official API — local session logs (`~/.claude`, `~/.codex`, WorkBuddy Trace, …) are scanned and imported |
| **Dedup** | Same call recorded by both gateway and session file → counted once |

Trace data appears on the **Dashboard** sliced by **app · provider · model · supply type · device · time**; the call log shows route result and latency per request.

### Smart routing

Supply is organized into **local sources** and **community sharing sources**. Each app can bind its own route; a global supply chain acts as fallback:

```
Per-app binding (keyScene / scene routes / task-type routes)
    ↓ unbound or llm-router-* model
Smart supply chain (unified “route = selector chain”)
    Local: Ollama → free API (Groq / GitHub Models) → subscription / PAYG API
    ↓ local unavailable or need extra compute
    Community sharing (spend credits on shared community compute)
    ↓ policy groups
fallback · round-robin · weighted · latency · direct
```

| Supply type | Includes | Notes |
|---|---|---|
| **Local sources** | Ollama, free API, APP/API subscriptions, pay-as-you-go | Forwarded by your local gateway; keys never leave the machine |
| **Community sharing** | Shared community compute network | Spend credits on remote nodes; model list synced dynamically |

- **Scene routes** — daily chat, code completion, long-doc analysis each get their own chain
- **Task-type routes** — presets like `design` / `repo-qa` / `chore` / `debug` (OpenCode-style inference routing)
- **Scope / price filters** — personal-only, community-only, free-only, or paid-only
- **Policy groups** — pick provider order from task features (tool calls, context length, …)
- **Failover** — local source down? try community sharing automatically; fully transparent to the agent
- **Egress guards** — clamp outbound `max_tokens` to upstream limits to cut avoidable 400s

### Model modalities

Provider models can be tagged **text / vision / image-gen / embedding**, driving Playground capabilities and Codex catalog `input_modalities` (vision models expose image input).

### Gateway lossless compression

Optional **lossless JSON compression** before forwarding — fewer input tokens upstream, **semantics unchanged**:

- Minifies pretty-printed JSON in messages (tool results, embedded data); strips whitespace only
- Non-JSON content is left byte-for-byte untouched — answers stay the same
- Enable in **Config**, or set `TOKENBANK_COMPRESS=1`
- **Dashboard** shows compression count, tokens saved, and ratio; cloud merge across devices when signed in

### Multi-device usage aggregation

Desktop, CLI, and server gateways each register as a device — **usage is reported and merged in the cloud** when signed in:

| Capability | What it does |
|---|---|
| **Device registration** | Each machine gets a persistent device_id; 60s heartbeat tracks online status |
| **Inventory snapshots** | Reports calls, tokens, cost, local / community sharing mix, top models/apps for 1 / 7 / 30 day windows |
| **Cloud merge** | **Profile** and **Dashboard** show per-device share, online status, detail vs aggregate views |
| **Cross-device sync** | Subscriptions, PAYG config, and tool lists sync on login — no re-setup when switching machines |

### Unified subscription management

The **Profile** tab is the single hub for all billing accounts; **Providers** handles keys and routing:

| Type | How it's managed | Typical use |
|---|---|---|
| **APP subscription** | Register ChatGPT / Claude / Gemini / Cursor plans and monthly cost | Stats-only on official sub, or OAuth → API gateway |
| **API subscription** | Separate catalog for vendor API plans (e.g. Volcengine Coding Plan) | API Key gateway, billed separately from APP subs |
| **Pay-as-you-go** | Register providers, model lists, and USD/M-token list prices | Providers page only exposes models configured here; cost estimates use these rates |

- **Cloud sync** — subscriptions and PAYG config download on login; Mac / Windows / Linux stay in sync
- **Billing overlay** — daily subscription amortization + PAYG estimates alongside raw token stats
- **Supply linkage** — Profile defines *what you use and what it costs*; Providers defines *how to connect and route*

### Dynamic supply delivery

Local source catalogs and tool lists don't require manual version bumps — **sync on login, refresh when online**:

```
Server-maintained
    ├── Local source catalog (Ollama / Groq / GitHub Models / SiliconFlow …)
    ├── Tool list config.apps (agent onboarding rules, protocol adapters)
    └── Scene routes config.scenes (preset routing chains)
         ↓  auto-fetched on login / startup
Local gateway
    ├── Merged into ~/.tokenbank/tokenbank.yaml
    ├── Community sharing online models refreshed periodically (/v1/models → route candidates)
    └── One-click env scan — import existing free keys with round-robin
```

- **Local catalog delivery** — Groq, Cerebras, GitHub Models, NVIDIA NIM, etc. listed under **Local sources**; admins hot-update via YAML upload
- **Community sharing models** — online contributor models pulled live; no manual local registration
- **Env scan** — one-click import of existing Groq / GitHub Models / Anthropic keys; multi-key round-robin
- **Offline fallback** — built-in defaults when offline; server deltas merged automatically when back online

### Multi-account CLI & directory dispatch

Run multiple logins of the same CLI (Claude Code / Codex). The gateway picks the right instance by **working directory** so configs never collide:

| Capability | What it does |
|---|---|
| **Auto-scan** | Discover existing CLI account instances on startup or manual rescan |
| **Manual add** | Gateway → “CLI instance” for accounts the scanner misses |
| **Effective directory** | Bind each instance to a workdir; the shim injects env from `$PWD` |
| **Quota visibility** | Claude / Codex subscription meters; tray and app list show today’s usage |

### Agent orchestration (Playground)

**Debug / Playground** is more than a single-model chat:

- Set a **main agent** as the aggregation entry for natural-language tasks (**image input** supported)
- The main agent can plan steps and dispatch to other onboarded agents (including Kimi / Cursor runtimes)
- **Community agents**: hire on demand from Contribute; tasks run on **their device**, without downloading their source — lower risk than running unknown agents locally
- Built-in `tokenbank-agent-bridge` MCP: `tb_list_agents` / `tb_dispatch_agent` for orchestration
- Chunked conversation stream, visible tool calls, stop then continue
- Agent visibility is gated by **runtime projection + hosted install** — only projected, available agents appear

### Resource hub: MCP · Skill · Prompt

The **Resources** tab consolidates community picks and personal assets:

| Type | Capability |
|---|---|
| **Community catalog** | Sync recommended MCP / Skill / Prompt / Agent lists on login (cache-first, built-in offline fallback) |
| **Projection** | Project only onto **hosted and installed** targets; revoke anytime; cascade deps on onboard |
| **Built-in MCP relay** | For apps without stdio: pick app → bind prompts/models/resources → copy relay config |
| **Prompt MCP** | Prompts served via `tokenbank-prompts` (`tb_get_prompt` / `tb_list_prompts`) filtered by projection set |
| **Work-portrait posters** | Dashboard can export four poster styles (pro / cute / humor / minimal) |

## Five things it does

### 1 — See clearly

Token Bank logs every request: which route it took, which model answered, how many tokens, how long it took.

- **One-click onboard & inventory**: stats-only / via gateway / restore; per-app calls, tokens, cost
- **Full trace**: live proxy + session import with auto-dedupe
- **Multi-device analytics**: app · provider · model · cost · device · time; cloud merge when signed in
- **Subscriptions vs PAYG**: APP / API / metered side by side with daily accrual and list-price estimates

### 2 — Spend less

A **smart local-first routing chain**, with community sharing as fallback:

```
Local: Ollama → free APIs → subscription / PAYG
    ↓ unavailable or need extra capacity
Community sharing (spend credits on shared compute)
```

- **Seamless model swap**: native model names unchanged; protocols adapted automatically (including Codex Responses tool forwarding)
- **Scene / task-type strategies**: chat / completion / long docs / design·repo-qa·chore·debug; failover transparent to agents
- **Lossless compression**: fewer upstream input tokens, meaning unchanged

### 3 — Stay simple

- **One-click onboard/restore** on the Gateway page
- **Multi-account CLI** by working directory; menu-bar tray for status and today’s usage (brand logo + glass popover)
- **OpenAI-compatible endpoint**: point existing tools at one local address
- **Playground orchestration**: main agent takes tasks and hands off (including community agents); tool streams visible

### 4 — Get smarter with you

- **Work portrait** mined from real calls and habits; reusable across skills, prompts, agents
- **For You**: personalized MCP / Skill / Prompt / Agent discovery
- **Accumulate & iterate**: keep assets in your library; reuse portrait to rediscover, or remine; compose when the catalog falls short

### 5 — Earn from idle

Contribute unused compute or API quota to **community sharing**, earn credits, spend them on shared models; or **list / hire agents** (tasks run on their device; configs and API keys stay local).

**You can contribute compute:** local Ollama, unused upstream quota, private LAN models (outbound WebSocket—no inbound port