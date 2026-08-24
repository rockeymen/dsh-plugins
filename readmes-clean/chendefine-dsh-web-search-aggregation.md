# dsh-web-search-aggregation

An aggregated web-search provider for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH): the built-in `web_search` tool is served through **one prioritized queue over AnySearch / TinyFish / Tavily / Brave / Exa / Firecrawl / Jina / SerpApi / Serper** — each provider can hold a pool of API keys that rotate per request, every failed attempt falls through to the next provider or key, and the first success wins.

## Features

- **Prioritized queue, ordered fallback** — entries are tried top-down per request; the first one that returns wins, and a failed entry falls through to the next. Order is edited live in the settings card; each provider kind can be queued at most once.
- **Multi-key pools with rotation** — every provider reads exactly one credential (`ANYSEARCH_API_KEY` / `TINYFISH_API_KEY` / `TAVILY_API_KEY` / `BRAVE_SEARCH_API_KEY` / `EXA_API_KEY` / `FIRECRAWL_API_KEY` / `JINA_API_KEY` / `SERPAPI_API_KEY` / `SERPER_API_KEY`) whose value holds all of that provider's keys joined by `,`. Within one entry the keys are tried in rotating order (round-robin per successful request), spreading load and quota across the pool.
- **Works out of the box** — AnySearch allows anonymous access, so the queue answers searches before any key is configured. The shipped defaults simply enable all nine kinds — the order is whatever you arrange in the card; the key-required entries fall through until their credential is set.
- **Budget-aware** — each attempt gets its own deadline (default 10 s, 1–60 s), so one hung upstream cannot eat the tool-level budget; five to six full fallbacks still fit inside 60 s.
- **Transparent failures** — when every attempt fails, the error reports each one (`[2] tavily/TAVILY_API_KEY#1: 401 unauthorized; …`). An empty queue raises `WEB_PROVIDER_UNAVAILABLE`; caller cancellation raises `WEB_ABORTED` immediately.
- **Secret hygiene** — key literals are never logged and never appear in failure records (which cite `REF` / `REF#N` labels only); the settings card shows keys as masked tags and never echoes stored values back.
- **Live configuration** — the settings card (设置 → 插件 → 插件配置 → *聚合网页搜索 / Aggregated web search*) edits the queue, keys, endpoints, and timeout; a committed change reaches the next search without a restart.

## How it works

### Half · Location · Responsibility
- **Half**: Host (server) · **Location**: `src/` · **Responsibility**: Registers the search provider (id `aggregated`) into `ctx.web`; `cordis.patch.yml` pins the web seam's `searchProvider` to it and inserts the plugin row carrying the default queue.
- **Half**: Browser (client) · **Location**: `src/client/` · **Responsibility**: Registers the *Aggregated web search* configuration card, which stages the queue and writes changes through the settings + credentials services.

```
web_search (tool-web)
   └─ ctx.web.searchProvider = aggregated
        ├─ queue (top-down, first success wins — order user-arranged):
        │     anysearch · tavily · tinyfish · brave · exa · firecrawl · jina · serpapi · serper
        │       │   keys = credential split on ','   ← pool per provider
        │       │   anonymous attempt allowed for key-less AnySearch
        │       └─ rotation cursor per entry (resets when the endpoint changes)
        ├─ per attempt: adapter request under its own deadline (default 10 s)
        └─ all failed → WEB_PROVIDER_ERROR with a per-attempt summary
```

Nine adapters ship today; another upstream is one adapter module plus one registry row.

### Kind · Auth · Default endpoint · Notes
- **Kind**: `anysearch` · **Auth**: Bearer, optional · **Default endpoint**: `https://api.anysearch.com/v1/search` · **Notes**: anonymous access allowed; `data.results[]` envelope
- **Kind**: `tavily` · **Auth**: Bearer · **Default endpoint**: `https://api.tavily.com/search` · **Notes**: sends `max_results`; the generated answer rides `content`
- **Kind**: `tinyfish` · **Auth**: `X-API-Key` · **Default endpoint**: `https://api.search.tinyfish.ai` · **Notes**: `GET ?query=…`; no count control, the seam's `maxResults` truncates
- **Kind**: `brave` · **Auth**: `X-Subscription-Token` · **Default endpoint**: `https://api.search.brave.com/res/v1/web/search` · **Notes**: `GET ?q=…&count=…` (count clamped to 1–20, decorations off); `page_age` → `publishedAt`
- **Kind**: `exa` · **Auth**: Bearer · **Default endpoint**: `https://api.exa.ai/search` · **Notes**: sends `numResults` (1–100) and `contents.highlights`; the first highlight is the snippet
- **Kind**: `firecrawl` · **Auth**: Bearer · **Default endpoint**: `https://api.firecrawl.dev/v2/search` · **Notes**: sends `limit` (1–100); no `scrapeOptions` — plain results, no per-page scrape cost
- **Kind**: `jina` · **Auth**: Bearer · **Default endpoint**: `https://s.jina.ai` · **Notes**: `POST /` with `{"q"}`; `X-Respond-With: no-content` keeps it SERP-only (no per-page fetch); `num` (1–20) only when the request carries a count; `description` → snippet, `publishedTime` → `publishedAt`; EU mirror via `https://eu.s.jina.ai`
- **Kind**: `serpapi` · **Auth**: `api_key` query param · **Default endpoint**: `https://serpapi.com/search.json` · **Notes**: `GET ?engine=google&q=…&api_key=…` — the key rides the URL because the API rejects it in headers/bodies; `num` (1–100) only when the request carries a count (num-bearing calls are documented as more CAPTCHA-prone); `snippet` → snippet, `date` → `publishedAt`; a body whose only payload is a top-level `error` string — even at HTTP 200 — fails the attempt so the queue falls through
- **Kind**: `serper` · **Auth**: `X-API-KEY` header · **Default endpoint**: `https://google.serper.dev/search` · **Notes**: `POST {"q": …}` with the key in the `X-API-KEY` header; `num` clamped into the API's documented 10–100 window and only sent when the request carries a count (below 10 clamps up — the seam truncates to `maxResults`); `link` → url, `snippet` → snippet, `date` (Google's displayed date) → `publishedAt`; non-2xx `{"message": …}` bodies (e.g. 403 keyless) surface their message

## Requirements

- DSH web profile (`dsh web`), Node.js ≥ 22.19 — the same floor as DSH itself (`^22.19.0 || >=24`). Source installs from GitHub run the `prepare` build, which needs the same range.
- At least one reachable upstream: the default queue works with no credentials (AnySearch anonymous); Tavily / TinyFish / Brave / Exa / Firecrawl / Jina / SerpApi / Serper entries need their API keys to contribute.

## Installation

From the npm registry (prebuilt — no build permission needed):

```sh
dsh plugin --profile web add dsh-web-search-aggregation
```

From a GitHub repository (source — pnpm runs the `prepare` build; allowlist the package in `profiles/web/pnpm-workspace.yaml` if pnpm blocks the build script):

```sh
dsh plugin --profile web add github:chendefine/dsh-web-search-aggregation
```

Or through the DSH plugin marketplace (设置 → DSH插件市场) — the repo carries the `dsh-plugin` topic and is indexed automatically.

After a bundle plugin is added to the profile layer stack, **restart `dsh web`** for it to load; uninstall with `dsh plugin --profile web remove dsh-web-search-aggregation` and restart again.

## Configuration

The settings card (设置 → 插件 → 插件配置 → *Aggregated web search*) edits the `web-search-aggregation` settings section live:

![plugin configuration card](./search-plugin-config.png)

### Field · Default · Description
- **Field**: `providers` · **Default**: nine enabled entries — one per kind · **Description**: The prioritized queue. Each entry: provider kind (each kind at most once), enabled toggle (a disabled entry stays configured but is skipped), and an optional endpoint base URL overriding the adapter's default. The shipped order carries no meaning; arrange it however you like.
- **Field**: `attemptTimeoutMs` · **Default**: `10000` · **Description**: Per-attempt deadline in ms (1000–60000). One attempt is cut off after this long and the queue moves to the next key or entry.

API keys are managed on each entry as **masked tags**: add one key at a time (`+` or Enter), reorder by dragging tags off/on — tag order is the order a save writes and the runtime reads. Stored keys are never read back; a save replaces the whole pool, and closing every tag before saving clears the credential. Each provider's keys live in one fixed credential:

### Credential · Provider · Required · Value format
- **Credential**: `ANYSEARCH_API_KEY` · **Provider**: AnySearch · **Required**: no — anonymous access works · **Value format**: one key bare, or several joined by `,`
- **Credential**: `TAVILY_API_KEY` · **Provider**: Tavily · **Required**: yes, for the entry to serve · **Value format**: same pool format
- **Credential**: `TINYFISH_API_KEY` · **Provider**: TinyFish · **Required**: yes, for the entry to serve · **Value format**: same pool format
- **Credential**: `BRAVE_SEARCH_API_KEY` · **Provider**: Brave Search · **Required**: yes, for the entry to serve · **Value format**: same pool format
- **Credential**: `EXA_API_KEY` · **Provider**: Exa · **Required**: yes, for the entry to serve · **Value format**: same pool format
- **Credential**: `FIRECRAWL_API_KEY` · **Provider**: Firecrawl · **Required**: yes, for the entry to serve · **Value format**: same pool format
- **Credential**: `JINA_API_KEY` · **Provider**: Jina Search · **Required**: yes — the Search API rejects anonymous calls · **Value format**: same pool format
- **Credential**: `SERPAPI_API_KEY` · **Provider**: SerpApi · **Required**: yes — the API rejects keyless calls · **Value format**: same pool format (64-hex keys, no prefix)
- **Credential**: `SERPER_API_KEY` · **Provider**: Serper · **Required**: yes — the API rejects keyless calls (403) · **Value format**: same pool format (keys carry no prefix)

### Combining with other provider plugins

A bundle patch replaces the web seam row's **whole** config, so the layer applied last determines the final `searchProvider` / `fetchProvider` pair. This plugin's patch states only `searchProvider: aggregated` — it owns the search selection and nothing else. Two consequences:

- With `dsh-web-fetch-playwright` installed *before* this plugin (or without it entirely), nothing needs adjusting: an unconfigured `fetchProvider` resolves to the single registered fetch provider automatically.
- If another plugin's layer is applied *after* this one and resets `searchProvider`, pin the combined selection in your profile's own `profiles/web/cordis.patch.yml` — the user layer wins over every bundle layer:

  ```yaml
  - id: web
    config:
      searchProvider: aggregated
      fetchProvider: playwright
  ```

## Development

```sh
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest run (103 unit tests, no network)
pnpm build       # tsc declarations + tsdown (host ESM + client module-registration bundle)
```

Repository layout:

```
src/
├── index.ts               # host entry: registers provider + settings section
├── config.ts              # schemastery schema, defaults, queue normalization
├── provider.ts            # AggregatedSearchProvider: queue walk, rotation, deadlines
├── keys.ts                # ','-joined key-pool vocabulary (parse/format/mask)
├── types.ts               # queue entry, config, per-attempt failure records
├── adapters/              # AnySearch / Tavily / TinyFish / Brave / Exa / Firecrawl / Jina / SerpApi / Serper adapters + shared HTTP
└── client/                # browser half: settings card, form model, locales
tests/                     # config, keys/adapters, provider, client-controller
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development and release workflow, and [SECURITY.md](./SECURITY.md) for the security model and reporting policy.

## Security

Search queries and API keys leave the machine only toward the endpoints configured per queue entry (the nine providers' official APIs by default). Keys are stored in the DSH credentials domain — never in the settings file, never logged, never echoed back to the client. Failure records and logs cite masked references (`TAVILY_API_KEY#2`), not literals. No result data is retained beyond the session that requested it.