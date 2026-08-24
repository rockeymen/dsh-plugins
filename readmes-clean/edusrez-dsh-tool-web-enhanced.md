# dsh-tool-web-enhanced

A **drop-in replacement for the stock `web_search` tool that is modular by sections**: the native search results stay as the first section, and you attach additional search modules — each contributing its own section — such as a local SearXNG instance and RAG databases (local markdown sources). The native behaviour is unchanged; everything else is optional.

## What it is

`dsh-tool-web-enhanced` is a drop-in replacement for DeepSeek Harness' stock `web_search` tool. When no modules are configured, `web_search` behaves **exactly** like stock: the native results are the only section. Turn on a module and it contributes its own section to the same search response:

- the **native** DeepSeek search results remain the first section, unchanged;
- you can **attach additional search modules**, each rendered as its own section — a local **SearXNG** instance, **RAG databases** (local markdown sources), and more;
- the extension point is a clean module interface (`SearchSection`) plus a config surface (`sections:`), so adding a new section type is a small, documented, code-level step (fork or PR the repo).

Everything is **optional**: with no modules configured, `web_search` is exactly stock.

## Features

- **Modular per-section architecture** — each search source is a `SearchSection` registered under `sections:`. Native results stay first; every additional module renders as its own section.
- **Built-in modules** — a **SearXNG** section (rendered as `SearXNG results`), a **RAG** section over local markdown databases (one `RAG — <dbName>` block per database), and a **Parallel** section (Parallel Web Systems Search API, rendered as `Parallel results`).
- **Alternative `web_fetch` provider** — an **opt-in** `parallel-extract` fetch provider (Parallel Web Systems Extract API) that returns a URL's full document as markdown. Registered into `ctx.web`; selected by the deployment profile's `fetchProvider: 'parallel-extract'`.
- **Optional `topic` and `sources` parameters** — `topic` forwards a vertical hint to modules that support it; `sources` picks any combination of native / SearXNG / RAG / Parallel (`native`, `searxng`, `rag`, `parallel`, or `all`).
- **Silent degradation** — a module that is absent, disabled, or unreachable is simply omitted, never an error; results degrade to the remaining sections.
- **Self-contained drop-in** — the bundle registers the enhanced tools and disables the stock `tool-web` row automatically on install.

## Install

```bash
npm install dsh-tool-web-enhanced
```

This is a DSH bundle: `package.json` carries `dsh.bundle.patch = ./cordis.patch.yml`, which inserts the enhanced plugin row and disables the stock `tool-web` row in one install. Installing the package is the whole swap for CLI profiles — no manual profile edit required. For preset-realm web surfaces, the preset still disables its own `tool-web` row.

```yaml
# cordis.patch.yml (bundled with this package)
- insert:
    - id: tool-web-enhanced
      name: dsh-tool-web-enhanced
      config:
        search: true
        fetch: true
        sections:
          searxng:
            enabled: true
            url: 'http://127.0.0.1:8080'
          parallel:
            enabled: true
            apiKeyEnv: PARALLEL_API_KEY
            apiKey: ''
          rag:
            enabled: true
            storePath: ''
            embeddings:
              provider: auto
              apiKeyEnv: EMBEDDING_API_KEY
              apiKey: ''
            databases: []
          # Parallel Extract fetch provider — OPT-IN (enabled: false by default).
          parallelExtract:
            enabled: false
            apiKeyEnv: PARALLEL_API_KEY
            apiKey: ''
            extractMode: full
            timeoutMs: 60000

- id: tool-web
  disabled: true
```

Installing self-disables the stock `tool-web` row, so this package is the entire web-search swap.

## Configuration

The enhanced behaviour lives under one unified `sections:` container. Keys are neutral parameter names. Stock `search` / `fetch` keys keep their existing names and defaults.

### Key · Type · Default · Description
- **Key**: `search` · **Type**: boolean · **Default**: `true` · **Description**: Register `web_search`.
- **Key**: `fetch` · **Type**: boolean · **Default**: `true` · **Description**: Register `web_fetch` (unchanged).
- **Key**: `sections.searxng.enabled` · **Type**: boolean · **Default**: `true` · **Description**: Enable the SearXNG section.
- **Key**: `sections.searxng.url` · **Type**: string · **Default**: `http://127.0.0.1:8080` · **Description**: Base URL of the local SearXNG JSON API.
- **Key**: `sections.parallel.enabled` · **Type**: boolean · **Default**: `true` · **Description**: Enable the Parallel (Parallel Web Systems Search API) section.
- **Key**: `sections.parallel.apiKeyEnv` · **Type**: string · **Default**: `PARALLEL_API_KEY` · **Description**: Env var holding the Parallel API key.
- **Key**: `sections.parallel.apiKey` · **Type**: string · **Default**: `''` · **Description**: Literal Parallel API key (wins over `apiKeyEnv`).
- **Key**: `sections.parallel.mode` · **Type**: string · **Default**: `fast` · **Description**: Parallel search mode: `turbo` / `fast` / `basic` / `advanced`.
- **Key**: `sections.parallel.maxResults` · **Type**: number · **Default**: `10` · **Description**: Max results returned by the section (`≤10`, no pagination).
- **Key**: `sections.rag.enabled` · **Type**: boolean · **Default**: `true` · **Description**: Enable the RAG section + `rag_index` tool.
- **Key**: `sections.rag.storePath` · **Type**: string · **Default**: `''` (auto) · **Description**: Search-index store path; empty → a default under the data home.
- **Key**: `sections.rag.embeddings.provider` · **Type**: string · **Default**: `auto` · **Description**: Embedding selection: `auto` / `local` / `remote`. `auto` → remote when a key is set, else local.
- **Key**: `sections.rag.embeddings.apiKeyEnv` · **Type**: string · **Default**: `EMBEDDING_API_KEY` · **Description**: Env var holding the remote provider's key.
- **Key**: `sections.rag.embeddings.apiKey` · **Type**: string · **Default**: `''` · **Description**: Literal remote provider key (wins over `apiKeyEnv`).
- **Key**: `sections.rag.embeddings.model` · **Type**: string · **Default**: `(a multilingual embedding model)` · **Description**: Remote embedding model.
- **Key**: `sections.rag.embeddings.baseURL` · **Type**: string · **Default**: `(your embeddings endpoint)` · **Description**: Remote embeddings API base URL (embeddings-API-compatible).
- **Key**: `sections.rag.embeddings.localModel` · **Type**: string · **Default**: `(a small local embedding model)` · **Description**: Local embedding model (downloaded on first use).
- **Key**: `sections.rag.databases[].name` · **Type**: string · **Default**: — · **Description**: Database (section) name.
- **Key**: `sections.rag.databases[].path` · **Type**: string · **Default**: — · **Description**: Directory of markdown files to index.
- **Key**: `sections.rag.databases[].topK` · **Type**: number · **Default**: `5` · **Description**: Results returned per database.
- **Key**: `parallelExtract.enabled` · **Type**: boolean · **Default**: `false` · **Description**: Register the Parallel Extract fetch provider (`ctx.web`). **OPT-IN.**
- **Key**: `parallelExtract.apiKeyEnv` · **Type**: string · **Default**: `PARALLEL_API_KEY` · **Description**: Env var holding the Parallel API key (same key as `sections.parallel`).
- **Key**: `parallelExtract.apiKey` · **Type**: string · **Default**: `''` · **Description**: Literal Parallel API key (wins over `apiKeyEnv`).
- **Key**: `parallelExtract.extractMode` · **Type**: string · **Default**: `full` · **Description**: `full` → the complete markdown document; `snippets` → excerpts only.
- **Key**: `parallelExtract.timeoutMs` · **Type**: number · **Default**: `60000` · **Description**: Per-call timeout (ms); the Extract API is slow (1–20s).

The stock `search` / `fetch` keys are kept unchanged for drop-in compatibility.

## Usage

`web_search` accepts the stock `query` plus two optional parameters:

### Param · Required · Description
- **Param**: `query` · **Required**: yes · **Description**: The search query.
- **Param**: `topic` · **Required**: no · **Description**: Vertical hint, forwarded to sections that support it (e.g. SearXNG categories): `general`, `news`, `science`, `it`, `files`, `social media`, `images`, `videos`, `map`, `music`.
- **Param**: `sources` · **Required**: no · **Description**: Comma-separated tokens — `native` plus each enabled section id. Default `all`. Examples: `native,searxng`, `searxng,rag`, or `searxng,parallel`.

The output shape carries the native results plus a `sections` array — one entry per module that returned results:

```jsonc
{
  "content": "...",                 // optional native answer
  "sources": [ { "url": "...", "title": "...", "snippet": "..." } ],  // native
  "truncated": false,
  "sections": [
    {
      "name": "SearXNG results",
      "sources": [ { "url": "...", "title": "...", "snippet": "...", "score": 0.9 } ]
    },
    {
      "name": "RAG — my-docs",
      "sources": [ { "url": "...", "title": "...", "path": "...", "score": 0.72 } ]
    },
    {
      "name": "Parallel results",
      "sources": [ { "url": "...", "title": "...", "snippet": "..." } ]
    }
  ]
}
```

## Connecting SearXNG

The SearXNG section is **optional**, and the plugin only talks to a SearXNG instance over its local **JSON** API (`format=json`). Point `sections.searxng.url` at the base URL of any instance that exposes JSON output:

```
GET {sections.searxng.url}/search?q=<query>&format=json[&categories=<topic>]
```

The simplest way to stand one up is a Docker Compose service exposing the JSON API on a local port. Having no running instance is fine: the SearXNG section is **silently omitted** when it is disabled, unreachable, or empty.

> **Guarantee**: when a module is absent, disabled, or unreachable, `web_search` never errors — the section is simply omitted and results degrade to whatever remains (down to native-only, exactly stock).

## Parallel section

The Parallel section queries the [Parallel Web Systems Search API](https://api.parallel.ai/v1/search) (a declarative-semantic web search built for AI agents) and renders the sources as a `Parallel results` block under the native results. It calls `POST https://api.parallel.ai/v1/search` with an `x-api-key` header (not a bearer token) and a body of `{ objective, search_queries, mode }`:

```
POST {https://api.parallel.ai/v1/search}
Headers: x-api-key: <key>
Body: { "objective": "<query>", "search_queries": ["<query>"], "mode": "fast" }
```

The section needs a key to do anything — set `sections.parallel.apiKeyEnv` to an env var (default `PARALLEL_API_KEY`) or `sections.parallel.apiKey` to a literal key. With **no resolvable key the section is silently inert** (returns `undefined` and never calls the API). It is thus entirely **opt-in**: shipping the default config enables it, but nothing is fetched or sent until a key is present in the environment. The key is never committed to any repo file.

By default it requests the fast (`mode: fast`) tier and caps results at `sections.parallel.maxResults` (default `10`, the API's per-call maximum — the API has no pagination). Failures (network, timeout, non-2xx, malformed response) degrade silently to `undefined`, exactly like the SearXNG section.

## Parallel Extract fetch provider

The `web_fetch` tool retrieves a URL through a provider selected by the web seam's `fetchProvider` config (default: the stock HTTP provider). This package registers an **opt-in alternative**: `parallel-extract`, backed by the [Parallel Web Systems Extract API](https://api.parallel.ai/v1/extract). It calls `POST https://api.parallel.ai/v1/extract` with an `x-api-key` header and a body of `{ urls: [<url>], advanced_settings: { full_content:  } }`, and maps the returned document to the fetch result's markdown text body.

```
POST https://api.parallel.ai/v1/extract
Headers: x-api-key: <key>, Content-Type: application/json
Body: { "urls": ["<url>"], "advanced_settings": { "full_content": true } }
```

It is **fully opt-in and inert by default**: `parallelExtract.enabled` defaults to `false`, so the provider is never registered and the stock `web_fetch` is never displaced. To use it:

1. Enable the provider: `parallelExtract.enabled: true` (with `apiKeyEnv` defaulting to `PARALLEL_API_KEY`, or a literal `apiKey`).
2. **Pin the web seam to it** in the deployment profile (this package does not, and must not, set the seam config): `fetchProvider: 'parallel-extract'` (or `$DSH_WEB_FETCH_PROVIDER=parallel-extract`).

Without a resolvable key the provider reports itself unavailable (its `available()` is `false`) and a direct call fails cleanly with a structured `WebError`. Failures (non-2xx, malformed response, no result / `errors[]`, timeout) also surface as clean `WebError`s following the other fetch providers' contract — never a misleading result.

`parallelExtract.extractMode` controls what comes back:

- `full` (default): requests `advanced_settings.full_content = true` and returns the complete markdown document (`results[].full_content`), falling back to the joined excerpts when the API returns `null`.
- `snippets`: leaves `full_content` off and returns the joined `results[].excerpts` — cheaper and faster if you only need fragments.

The API accepts up to 20 URLs per request and charges $1 per 1000 URLs; the provider sends one URL per `web_fetch` call, enforcing the per-request cap in `buildParallelExtractBody`.

## RAG section

The RAG module indexes local markdown databases into an on-machine store and, on every search, retrieves the most similar chunks per database — one `RAG — <dbName>` section per configured database.

**The embedding step** is used in two places: to index each chunk, and to embed the query on every search. With the **local** path (no key configured) indexing and query data stay on the machine; a **remote** provider is used only if you configure one — nothing is sent unless a provider is configured.

When RAG is enabled with at least one database, a **`rag_index`** tool is registered. It rebuilds the local RAG index for all configured databases and returns the number of chunks indexed per database. The index is also built automatically (async, non-blocking) on startup.

## Adding your own section

The whole point of this package is that `web_search` is modular **by sections**. To add a new search source you write a small, self-contained module — no changes to the core tool:

1. **Define a `SearchSection`** — give it an `id` (used as a `sources` token), an `enabled` flag, and a `run(query, ctx)` method that returns the section's result blocks (`SectionBlock[]`).
2. **Add its config slice** under `sections:` in `cordis.patch.yml` — any parameters the module needs.
3. **Wire it into `buildSections`** — register the new module alongside the built-in ones so it is instantiated when enabled.

That's it — roughly fifteen lines. The module contract lives in `src/modules.ts` (the `SearchSection` interface and `buildSections` composition point). Because modules are an isolated list, the package is fork/PR-friendly: a new section type is a small, documented, code-level addition that composes with the native-first output shape and the `sources` selection.

## Output shape

See [Usage](#usage) above: `web_search` returns the canonical stock fields (`content`, `sources` for native, `truncated`) plus a `sections[]` array — one entry per module that returned results, each with a `name` and its own `sources[]`. A module with no results is omitted entirely.

## Development

- `npm run build` — compiles `src/` to `lib/` with `tsc` (NodeNext).
- `node --test` — runs the unit tests in `test/` against the built `lib/`.
- Smoke-test in a DSH profile — install the local checkout into an isolated development profile, then inspect the composed configuration:

  ```bash
  dsh plugin --profile dev add /path/to/dsh-tool-web-enhanced
  dsh --profile dev --dump-config
  ```

  The dumped tree must show the `tool-web-enhanced` row plus the disabled `tool-web` row. Exercise `web_search` end-to-end in that profile afterward.