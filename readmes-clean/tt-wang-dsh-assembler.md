# dsh-assembler — Vibe Assembly for DSH

**Assemble a working AI agent from one sentence — and be able to hand it over.**

`dsh-assembler` is a [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) plugin. You describe the agent you want in plain language ("build me a support bot that can look up orders, open tickets, and hand off to a human"); the assembler matches parts from a **capability catalog**, emits an **agent preset**, and then **proves it works by running it in a real session**. New sessions pick that preset from the roster and go.

The catalog grows through an **induction pipeline**: open-source libraries, public APIs, a client's own HTTP interfaces, and a client's documents all enter through one command each — and only past a quality gate. No glue code, only configuration.

> **No graduation penalty(毕业不受惩罚):** unlike low-code platforms — whose known failure mode is the last-mile wall plus vendor lock-in (customizations deepen dependence until exit means rebuilding) — everything here is real, inspectable artifacts: parts are ordinary processes with pinned provenance, a delivered agent is a git-diffable text composition plus its BOM, and the execution layer is framework-agnostic. Outgrow the assembler and you keep everything: the parts keep running, the presets keep mounting, nothing is held hostage.

> **Identity (2026-08-23, measured then ruled):** the assembler is the **search engine of the parts ecosystem** — it supplies facts (BM25-ranked part search with per-part price tags & evidence), deterministic emission with every gate intact, an independent black-box examiner, and the evidence ledger. The **thinking belongs to the main agent** you talk to: it designs the architecture, selects parts from search results, writes the persona/schema, and makes every retry decision. This search form is the **default** (`DSH_ASSEMBLER_MODE` unset); the classic one-shot pipeline described below survives behind `DSH_ASSEMBLER_MODE=pipeline` as the automation/regression lane. Why: a four-form head-to-head measured the search form **40% faster end-to-end with assembler-side LLM thinking cut from 114.5k to 7.8k tokens at equal quality** — see `docs/campaigns/forms-bcdf-8.md`, `docs/ab-orchestrated-mode.md`, and `docs/ROADMAP.md`.

## Scale today

###  · Measured · Where to verify
- Catalog · **Measured**: **84 MCP servers / 229 registered tools / 83 parts** · **Where to verify**: `index/catalog.yml`, `capabilities.yml`
- Part mix · **Measured**: 62 library-backed + 17 service-backed + 4 first-party · **Where to verify**: `node scripts/catalog-report.mjs`
- Assembly wall time · **Measured**: typical **30–90s** single agent; multi-agent solution ~5–10 min · **Where to verify**: `progress.log` per preset
- Market campaign · **Measured**: **84 real-world requirements** across 4 batches — single agents, composite agents, adversarial prompts, and multi-agent FDE suites · **Where to verify**: `docs/campaigns/`

## What it does

- **Two entry points** — the `/assemble <requirement>` command (human shortcut) and an `assemble` tool (agent-native: the whole call renders in the conversation).
- **Assemble-then-verify** — after emitting a preset, the assembler derives an acceptance probe, runs it in a **real session bound to that preset**, and judges the reply against content-bearing marks. A FAIL triggers one re-selection with the failure fed back, then re-probes. `find → assemble → **verify**`, on by default. The probe fails fast and honestly: an agent that asks the (absent) user for help is scored FAIL with the question quoted back, and every probe turn narrates its tool actions live.
- **Multi-turn scenario probes** — the deriver picks the probe shape itself: one turn for pure-compute agents, a 2–4 turn scenario when the requirement implies work that outlives a turn (bookkeeping, filing, tracking). Scenario turns run in **one session**, and a later turn queries what an earlier turn wrote. Judgement stays black-box: replies only, never the trajectory.
- **Multi-agent solutions (the FDE unit of delivery)** — one `assemble` builds one agent; **`assemble_solution` builds an entire team** plus a delivery document. Give it a list of agents and it assembles each on the same verified pipeline, then **grows a `HANDOVER.md` out of the artifacts themselves** — per-agent verdicts, shared tables, credential checklist, supply-chain BOM. Pass a `sharedSchema` and every agent's SQLite default DB is pinned to **one shared solution database**, so the customer-service agent and the reconciliation agent read and write the *same* orders — a real team, not a pile of separate bots. (A CLI, `scripts/solution.mjs`, drives the same delivery for non-agent batch use.)
- **Gap work orders** — when selection reports a capability the catalog cannot yet cover, the assembler writes an actionable work order to `/gaps/`: the spec, the real induction-pipeline commands to build the missing part, and the exact re-assemble command that closes the loop. The writing of the missing part is handed to the **calling agent** (which has a full coding harness); the assembly spine stays deterministic, and the verdict always comes from the assembler's own black-box probe.
- **Assembly console (live)** — every assembly dual-writes its action chain to `/progress.log`; a live console page (`/assembler/ui/_console`) polls it so a slow assembly is a visible, timestamped trail — "stuck or working?" answered at a glance — not a silent spinner. Selection, emission, probe rounds, per-turn tool actions and a 20s heartbeat all scroll there.
- **Solution packs (the FDE unit of delivery)** — `solutions/<name>/solution.yml` declares an entire engagement: which agents, which catalog, deployment parameters, client knowledge. `solution apply` assembles them all, each through verification; `solution handover` **grows a delivery report out of the artifacts themselves**. Multi-tenant is `--param` plus a different credential set — never a forked manifest.
- **Knowledge packs (`via: knowledge`)** — a client's manuals, SOPs and product catalogues enter as **static teaching material**, past a **retrieval-hit gate** (a probe question whose expected snippet cannot be found is refused), and are **copied into the preset's `kb/`** at assembly time. The handover is one self-contained directory.
- **Credential contract (interface first, key later)** — parts **declare** the environment variable they need and what it is for; the **value never enters a preset**. Unconfigured, a part still starts, `listTools` still succeeds, and a call returns an **actionable error** (which variable, what for, where to get it). On the assembly side: assembly succeeds, the probe degrades to **SKIPPED** with configuration guidance. Optional credentials (GitHub public reads, polite-pool mailtos) take the anonymous path and do not hold verification back.
- **Client-private catalogs** — `catalogs/<client>/` carries its own `generated/`, `index/`, `capabilities.yml` and `knowledge/`. One client's parts **cannot** surface in another's assembly, because isolation is by **separate files**, not by a filter someone can forget.
- **Service-backed parts** — 13 live data services are wired in (weather, FX, geocoding, holidays, macro data, SEC filings, scholarly search, wiki facts, research graph, package intel, Feishu, Slack, GitHub Issues). A library part pins `repo@rev`; a service has no bytes to pin, so it pins **terms + rate limit + data licence** instead — and those travel into the BOM, because a client's compliance desk asks about them first.
- **Parts BOM** — every assembly emits `parts.lock.yml` beside the preset: per part its origin, licence, verified status and the serverName actually mounted, plus knowledge sources with versions and the pending-credential list.
- **Federation cache** — each part's tool list is cached under (connection config + adapter file fingerprint): cold ~5s, **warm 0.002s**.
- **persona lint** — mechanical checks on the persona text: every tool it names must be in the mounted surface, step-numbered choreography is rejected, length is bounded.
- **Design notes** — [DESIGN.md](DESIGN.md) (Chinese) states what the assembler does, what it deliberately does not, and where the boundary sits.

## Every assembly ships a web UI

Assembly does not stop at the preset — every agent also gets an **operable web frontend**, served same-origin by the assembler on the host (`/assembler/ui/`). The page speaks the host's public wire (session.create / session.prompt / events.mux) and shares the same agent and the same durable workspace as the DSH conversation view; it pulls current state on open.

Each screenshot below is the **real product of a single `/assemble` command** (real assembly, real data, real capture — verdict lines quoted verbatim):

> `任务管理助手 … 要一个可以拖拽的任务看板页面` → 自动验证:PASS · 前端验收:页面门+环路门 PASS

![Kanban (dark)](docs/frontends/kanban.png)

![Approval desk](docs/frontends/approval-desk.png)

![Data desk](docs/frontends/data-desk.png)

![Chat console](docs/frontends/chat-console.png)

How it works:

- **Frontend template parts (`via: frontend`)** — 7 templates: chat console (default for **every** preset), form desk, data desk, dashboard, drag-and-drop kanban, approval desk, file desk; the matcher picks exactly one by interaction shape
- **Look** — built on [Franken UI](https://github.com/franken-ui/ui) (the no-build HTML port of shadcn/ui, MIT), **vendored locally** — zero CDN dependency for offline/intranet delivery; auto light/dark
- **Page↔agent contract** — pages embed a ```json fence contract in their prompts (no persona coupling); replies render as boards/tables/stat cards
- **Frontends are verified too** — assemble-then-verify gains two frontend gates: **page gate** (HTTP 200 + slots filled) and **loop gate** (a real session opened with the page's exact parameters must echo a token); carried runs re-run the page gate only
- **One durable ledger** — the equipment lane pins the default database (workspace `data.db`) and pre-builds its schema, so frontend sessions and DSH conversations write the **same** store

## Architecture

```
┌───────── Induction pipeline (supply chain) ────────────────────────────┐
│ OSS library / public API / client OpenAPI / client documents           │
│   → slice capabilities → MCP adapter → gate (smoke / retrieval) → catalog │
└───────────────────────────────────────────────────────────────────────┘
                              ↓
┌───────── Assembly (capability consumption) ───────────────────────────┐
│ capabilities.yml (public or client) + parallel federation → LLM match  │
│   → emit preset + BOM + copy knowledge into kb/                       │
│   → verify: derive probe (single-turn or scenario) → real session → PASS/FAIL │
└───────────────────────────────────────────────────────────────────────┘
                              ↓
┌───────── Delivery (FDE) ──────────────────────────────────────────────┐
│ solution apply (assemble every agent in the manifest)                 │
│   → solution handover: report (verdicts / params / pending secrets /  │
│     knowledge / BOM / rebuild command)                                │
└───────────────────────────────────────────────────────────────────────┘
                              ↓
┌───────── Runtime (the harness's territory) ───────────────────────────┐
│ session picks the preset → DSH mounts each row → agent calls the parts │
└───────────────────────────────────────────────────────────────────────┘
```

The assembler is a Cordis plugin and its output is a Cordis composition manifest (one preset row = one plugin instance); parts are external MCP server processes bridged by `@deepseek-ai/dsh-mcp-client`. **The assembler exists only at assembly time** — once a session is running its process is gone and nothing changes.

## Quick start

### 1. Install

Add the plugin to a DSH profile's patch layer (e.g. `~/.dsh/profiles/web/cordis.patch.yml`):

```yaml
- insert:
    - id: dsh-assembler
      name: '@dsh-external/dsh-assembler'
```

Dependency: `"@dsh-external/dsh-assembler": "link:/path/to/dsh-assembler"`.

Some service parts need the operator's contact details (SEC mandates a contactable User-Agent; Crossref/OpenAlex polite pools want a mailto). Copy `.env.example` to `.env` and fill in your own — **not credentials, but not anyone else's address either**.

### 2. Assemble one agent

```
/assemble build a support bot that looks up customers, opens tickets, and hands off to a human [--name customer-service-bot] [--param timezone=Asia/Shanghai]
```

Or simply say it in any session — the agent calls the `assemble` tool on its own, and reasoning, tool card and result all render inline.

### 3. Deliver a whole team (the FDE path)

Just ask for a suite of agents in one session — "give me a set of ops agents: one for support, one for reconciliation, one for inventory, one for content, all sharing the same product/order data, plus a handover doc" — and the agent calls **`assemble_solution`** on its own. It splits the request into focused agents, assembles and verifies each, pins them to one shared database, and writes a `HANDOVER.md`. No manifest to hand-edit.

For non-agent batch delivery, the CLI drives the same pipeline:

```bash
npm run solution -- init acme-service --client acme     # manifest skeleton
# edit the agents list in solutions/acme-service/solution.yml
npm run solution -- apply solutions/acme-service/solution.yml --port 3096
npm run solution -- handover solutions/acme-service/solution.yml
```

`HANDOVER.md` lists what was delivered with each verdict, the shared tables, the deployment parameters, the **pending-credential checklist**, knowledge packs with source and version, the supply-chain BOM, and the rebuild command — assembled from the artifacts, with **nothing hand-filled**. Anything that can be forgotten does not belong in a handover.

## Layout

```
dsh-assembler/
├── src/
│   ├── index.ts            # assembly core: catalog, matching, emission, BOM, params, secrets, knowledge
│   ├── verify.ts           # assemble-then-verify: probe derivation (single/scenario) + real-session driver
│   ├── persona-lint.ts     # mechanical persona checks
│   ├── frontend.ts         # frontend lane: template emission + same-origin route + live console
│   ├── solution.ts         # multi-agent solution delivery + HANDOVER from artifacts
│   ├── solution-tool.ts    # the assemble_solution agent tool
│   ├── assemble-tool.ts    # the assemble agent tool
│   └── client/             # browser half: assembly console tab in the DSH sidebar
├── capabilities.yml        # ★ public catalog: capability entries + mcp-servers + requiredSecrets
├── index/                  # ★ public part index (origin/licence/terms) + smoke reports
├── generated/              # ★ part library: 78 MCP adapter servers, one directory each
├── catalogs/<client>/      # ★ client-private catalog: its own generated/ index/ capabilities.yml knowledge/
├── solutions/<name>/       # ★ solution pack: solution.yml + last-apply.json + HANDOVER.md
├── bench/results/          # assembly-quality ledgers (run-tagged, committed)
├── presets/
│   └── agent-template.yml  # preset template ({{persona}}/{{packageRows}}/{{extraRows}}/{{param:k}})
└── scripts/
    ├── index-add.mjs       # ★ induction pipeline CLI
    ├── solution.mjs        # ★ solution pack CLI
    ├── assembly-bench.mjs  # 45-item assembly benchmark
    └── link-dsh.mjs        # link DSH peer packages
```

## The capability catalog

Four kinds of capability:

### `via` · Source · Example
- **`via`**: `package` · **Source**: a tool from this repo / an own plugin package · **Example**: `crm-query`
- **`via`**: `harness` · **Source**: a DSH built-in tool · **Example**: `content-search`
- **`via`**: `mcp` · **Source**: MCP server tools (federated at assembly time) · **Example**: `mcp-weather-forecast-current-weather`, 229 of them
- **`via`**: `knowledge` · **Source**: client teaching material (copied into `kb/`) · **Example**: `acme-policies-kb`

**78 parts / 215 tools** — 61 library-backed, 13 service-backed, 4 first-party.

### Service-backed parts — live data and external systems

### Part · Tools · Source · Licence / terms · Credentials
- **Part**: **package-registry** · **Tools**: `package-info` `package-versions` `check-license` · **Source**: npm + PyPI registries · **Licence / terms**: registry ToS · **Credentials**: none
- **Part**: **weather-forecast** · **Tools**: `current-weather` `daily-forecast` · **Source**: Open-Meteo · **Licence / terms**: CC-BY-4.0 · **Credentials**: none
- **Part**: **currency-rates** · **Tools**: `latest-rates` `historical-rate` `convert-amount` · **Source**: Frankfurter (ECB data) · **Licence / terms**: Public-Domain-ECB · **Credentials**: none
- **Part**: **geocode** · **Tools**: `geocode-address` `reverse-geocode` · **Source**: OpenStreetMap Nominatim · **Licence / terms**: ODbL-1.0 · **Credentials**: none
- **Part**: **public-holidays** · **Tools**: `list-holidays` `is-workday` `available-countries` · **Source**: Nager.Date · **Licence / terms**: MIT · **Credentials**: none
- **Part**: **worldbank-data** · **Tools**: `country-indicator` `common-indicators` · **Source**: World Bank Open Data · **Licence / terms**: CC-BY-4.0 · **Credentials**: none
- **Part**: **sec-filings** · **Tools**: `lookup-cik` `company-filings` · **Source**: U.S. SEC EDGAR · **Licence / terms**: Public-Domain-US-Gov · **Credentials**: none
- **Part**: **scholar-search** · **Tools**: `search-published` `search-preprints` `doi-lookup` · **Source**: Crossref + arXiv · **Licence / terms**: CC0-1.0 / arXiv terms · **Credentials**: none
- **Part**: **wiki-facts** · **Tools**: `page-summary` `search-entity` `entity-facts` · **Source**: Wikimedia (Wikipedia + Wikidata) · **Licence / terms**: CC-BY-SA-4.0 · **Credentials**: none
- **Part**: **research-graph** · **Tools**: `search-works` `work-citations` `author-works` · **Source**: OpenAlex · **Licen