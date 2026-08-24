![mem9](site/public/mem9-wordmark-square.svg)

  Persistent Memory for AI Agents.
  Your agents forget everything between sessions. mem9 fixes that with persistent memory across sessions and machines, shared memory for multi-agent workflows, and hybrid recall with a visual dashboard.

  For OpenClaw and ClawHub installs, start here: [mem9.ai/openclaw-memory](https://mem9.ai/openclaw-memory)

  Hermes Agent, Claude Code, OpenCode, Codex, DeepSeek Harness, and Dify guides are below.

## Quick Start

1. Choose your mem9 endpoint.

   - Hosted API: `https://api.mem9.ai`
   - Self-hosted: apply the matching control-plane schema, then start `mnemo-server`:

     ```bash
     cd server
     MNEMO_DSN="user:pass@tcp(host:4000)/mnemos?parseTime=true" go run ./cmd/mnemo-server
     ```

     See [Self-Hosting](#self-hosting) for backend-specific setup details, and [API Reference](#api-reference) for provisioning.

2. Pick your integration guide.

   - [OpenClaw / ClawHub](https://mem9.ai/openclaw-memory)
   - [Hermes Agent](https://github.com/mem9-ai/mem9-hermes-plugin#readme)
   - [Claude Code](claude-plugin/README.md)
   - [OpenCode](opencode-plugin/README.md)
   - [Codex](codex-plugin/README.md)
   - [DeepSeek Harness](dsh-plugin/README.md)
   - [Dify](https://github.com/mem9-ai/mem9-dify-plugin#readme)
   - [Any HTTP client / custom runtime](#api-reference)

3. Set your credentials.

   ```bash
   # Hosted API
   export MEM9_API_URL="https://api.mem9.ai"
   export MEM9_API_KEY="<mem9-api-key>"

   # Self-hosted
   export MEM9_API_URL="http://localhost:8080"
   export MEM9_API_KEY="<mem9-api-key>"
   ```

   For self-hosted deployments, use your server URL and the mem9 API key returned or configured by your provisioning flow.

## Why mem9

mem9 gives coding agents one shared memory layer instead of separate local notebooks and one-off prompt files.

### What mem9 gives you · Why it matters
- **What mem9 gives you**: Persistent memory across sessions and machines · **Why it matters**: Your context survives restarts, laptop switches, and long-running projects
- **What mem9 gives you**: Shared memory across agents and workflow platforms · **Why it matters**: OpenClaw, Hermes Agent, Claude Code, OpenCode, Codex, DeepSeek Harness, Dify apps, and custom clients can recall the same facts
- **What mem9 gives you**: Stateless integrations · **Why it matters**: Runtime plugins stay thin because storage, search, ingest, and policy live in the server
- **What mem9 gives you**: Hybrid recall and a visual dashboard · **Why it matters**: Semantic search, keyword search, and inspection workflows stay in one system

## Supported Platforms and Agent Runtimes

### Platform · Integration shape · Install / docs
- **Platform**: OpenClaw · **Integration shape**: `kind: "memory"` plugin for server-backed shared memory · **Install / docs**: [OpenClaw / ClawHub install guide](https://mem9.ai/openclaw-memory)
- **Platform**: Hermes Agent · **Integration shape**: Memory provider plugin with setup and activation flow · **Install / docs**: [mem9-hermes-plugin README](https://github.com/mem9-ai/mem9-hermes-plugin#readme)
- **Platform**: Claude Code · **Integration shape**: Marketplace plugin with hooks and skills · **Install / docs**: [`claude-plugin/README.md`](claude-plugin/README.md)
- **Platform**: OpenCode · **Integration shape**: Plugin SDK integration loaded from `opencode.json` · **Install / docs**: [`opencode-plugin/README.md`](opencode-plugin/README.md)
- **Platform**: Codex · **Integration shape**: Marketplace plugin with managed hooks and project overrides · **Install / docs**: [`codex-plugin/README.md`](codex-plugin/README.md)
- **Platform**: DeepSeek Harness · **Integration shape**: Native DSH/Cordis bundle with recall, smart ingest, and memory tools · **Install / docs**: [`dsh-plugin/README.md`](dsh-plugin/README.md)
- **Platform**: Dify · **Integration shape**: Tool plugin for Dify Agent apps and Workflow apps, with single-space and multi-space authorization · **Install / docs**: [mem9-dify-plugin README](https://github.com/mem9-ai/mem9-dify-plugin#readme)
- **Platform**: Any HTTP client / custom runtime · **Integration shape**: Direct REST API integration · **Install / docs**: [API Reference](#api-reference)

All supported runtimes and platform integrations expose the same core memory flow: store, search, get, update, and delete against the mem9 server API.

## Why the Hosted API

The hosted mem9 API is the fastest way to put persistent memory behind an agent fleet while keeping the option to self-host later.

### Hosted API capability · Why teams start here
- **Hosted API capability**: Hosted mem9 API with instant space provisioning · **Why teams start here**: You can install an agent integration first and skip standing up infrastructure on day one
- **Hosted API capability**: Shared memory across runtimes and platforms · **Why teams start here**: One space can serve OpenClaw, Hermes Agent, Claude Code, OpenCode, Codex, DeepSeek Harness, Dify apps, and custom clients together
- **Hosted API capability**: Managed search and storage · **Why teams start here**: Hybrid recall works out of the box without a separate vector stack or sync layer
- **Hosted API capability**: TiDB Cloud Starter foundation · **Why teams start here**: The hosted path benefits from instant provisioning, native vector search, full-text search, server-side auto-embedding, hybrid search, and MySQL-compatible operational semantics
- **Hosted API capability**: Same API contract as self-hosted mem9 · **Why teams start here**: Moving to your own deployment is a base-URL and credential change, not a plugin rewrite
- **Hosted API capability**: Visual dashboard and product onboarding · **Why teams start here**: Teams can inspect and manage memory without building internal tooling first

Under the hood, the hosted mem9 API runs the same mem9 server model surfaced in this repository, with TiDB Cloud Starter providing managed provisioning, native vector search, full-text search, server-side auto-embedding, hybrid search, and MySQL-compatible storage semantics.

## API Reference

Set `X-Mnemo-Agent-Id` on authenticated memory, import, and session-message requests when you want the server to distinguish which runtime or agent instance is writing and recalling memories inside the same mem9 space. This works on both the tenant-path `v1alpha1` routes and the `v1alpha2` API-key routes.

### Provisioning

Use this endpoint when you want mem9 to auto-provision a new TiDB-backed space.

### Method · Path · Description
- **Method**: `POST` · **Path**: `/v1alpha1/mem9s` · **Description**: TiDB auto-provision endpoint when a provisioner is configured. TiDB Zero enables this path by default on `tidb`; TiDB Cloud Pool uses `MNEMO_TIDB_ZERO_ENABLED=false` with `MNEMO_TIDBCLOUD_API_KEY` and `MNEMO_TIDBCLOUD_API_SECRET`. Manual-bootstrap deployments use pre-existing tenants instead of this path. Returns `{ "id" }`. Accepts optional `utm_*` query params for attribution logging

Prefer `v1alpha2` for all new integrations. It uses `X-API-Key` and is the primary API surface for current runtimes.

### Preferred API (`v1alpha2`)

### Method · Path · Description
- **Method**: `POST` · **Path**: `/v1alpha2/mem9s/memories` · **Description**: Preferred unified write endpoint. Requires `X-API-Key` header
- **Method**: `GET` · **Path**: `/v1alpha2/mem9s/memories` · **Description**: Preferred search endpoint. Requires `X-API-Key` header
- **Method**: `GET` · **Path**: `/v1alpha2/mem9s/memories/{id}` · **Description**: Preferred get-by-id endpoint. Requires `X-API-Key` header
- **Method**: `PUT` · **Path**: `/v1alpha2/mem9s/memories/{id}` · **Description**: Preferred update endpoint. Requires `X-API-Key` header
- **Method**: `DELETE` · **Path**: `/v1alpha2/mem9s/memories/{id}` · **Description**: Preferred delete endpoint. Requires `X-API-Key` header
- **Method**: `GET/POST` · **Path**: `/v1alpha2/mem9s/webhooks` · **Description**: Space webhook management. Requires a Space `X-API-Key`
- **Method**: `GET/PATCH/DELETE` · **Path**: `/v1alpha2/mem9s/webhooks/{webhookID}` · **Description**: Get, update, or delete a Space webhook
- **Method**: `POST` · **Path**: `/v1alpha2/mem9s/webhooks/{webhookID}/test` · **Description**: Queue a signed test delivery
- **Method**: `POST` · **Path**: `/v1alpha2/mem9s/webhooks/{webhookID}/rotate-secret` · **Description**: Rotate the webhook signing secret. The new secret is returned once
- **Method**: `GET` · **Path**: `/v1alpha2/mem9s/webhook-deliveries` · **Description**: List recent Space webhook deliveries
- **Method**: `GET/POST` · **Path**: `/v1alpha2/space-chains/{chainID}/webhooks` · **Description**: Space Chain webhook management. Requires the `chain_` management key in `X-API-Key`
- **Method**: `GET` · **Path**: `/v1alpha2/space-chains/{chainID}/webhook-deliveries` · **Description**: List recent Space Chain webhook deliveries

Webhook events and delivery behavior are documented in [docs/webhooks-api-design.md](docs/webhooks-api-design.md). v1 emits `memory.added`, `memory.deleted`, and `space_chain.fact_routed`.

#### Space Chain Management

Space Chains let you compose ordered multi-space recall and routing pipelines. Use the `chain_` management key returned at creation time as the `X-API-Key` for all management endpoints below. Read nodes via their own Space `X-API-Key`.

### Method · Path · Description
- **Method**: `POST` · **Path**: `/v1alpha2/space-chains` · **Description**: Create a Space Chain. No `X-API-Key` required — the management key (`chain_` prefix) is returned in the response body. All subsequent management endpoints require this key
- **Method**: `GET` · **Path**: `/v1alpha2/space-chains/by-key` · **Description**: Look up a Space Chain by its management key. Requires the `chain_` key in `X-API-Key`
- **Method**: `GET` · **Path**: `/v1alpha2/space-chains/{chainID}` · **Description**: Get Space Chain details. Requires `chain_` management key
- **Method**: `PATCH` · **Path**: `/v1alpha2/space-chains/{chainID}` · **Description**: Update Space Chain name/description. Requires `chain_` management key
- **Method**: `DELETE` · **Path**: `/v1alpha2/space-chains/{chainID}` · **Description**: Soft-delete a Space Chain. Requires `chain_` management key
- **Method**: `GET` · **Path**: `/v1alpha2/space-chains/{chainID}/nodes` · **Description**: List all nodes in the chain (ordered by position). Requires `chain_` management key
- **Method**: `PUT` · **Path**: `/v1alpha2/space-chains/{chainID}/nodes` · **Description**: Replace all nodes in the chain (full replacement). Requires `chain_` management key
- **Method**: `PUT` · **Path**: `/v1alpha2/space-chains/{chainID}/nodes/{nodeID}/routing-policy` · **Description**: Update routing policy for a specific chain node. Requires `chain_` management key
- **Method**: `GET` · **Path**: `/v1alpha2/space-chains/{chainID}/bindings` · **Description**: List all API key bindings for the chain. Requires `chain_` management key
- **Method**: `POST` · **Path**: `/v1alpha2/space-chains/{chainID}/bindings` · **Description**: Create a new API key binding for the chain. Requires `chain_` management key
- **Method**: `PATCH` · **Path**: `/v1alpha2/space-chains/{chainID}/bindings/{bindingID}` · **Description**: Disable an API key binding. Requires `chain_` management key

#### Additional v1alpha2 Endpoints

### Method · Path · Description
- **Method**: `POST` · **Path**: `/v1alpha2/mem9s/memories/batch-delete` · **Description**: Bulk soft-delete memories (max 1000). Accepts `{"ids": ["..."]}`. Requires `X-API-Key`
- **Method**: `GET` · **Path**: `/v1alpha2/mem9s/session-messages` · **Description**: List persisted session messages. Requires `X-API-Key`. Query: `session_id`, `limit_per_session`
- **Method**: `POST` · **Path**: `/v1alpha2/mem9s/imports` · **Description**: Upload a JSON file for async ingest (multipart, 50MB max). `file_type`: `memory` or `session`. Requires `X-API-Key`
- **Method**: `GET` · **Path**: `/v1alpha2/mem9s/imports` · **Description**: List upload tasks with aggregate status. Requires `X-API-Key`
- **Method**: `GET` · **Path**: `/v1alpha2/mem9s/imports/{id}` · **Description**: Get single upload task detail. Requires `X-API-Key`
- **Method**: `GET` · **Path**: `/v1alpha2/status` · **Description**: Validate the `X-API-Key` header. Returns key status (`active`/`inactive`) without resolving a tenant

### Legacy Tenant-Path API (`v1alpha1`)

Use these endpoints only when you need compatibility with older tenant-ID-in-path clients.

### Method · Path · Description
- **Method**: `POST` · **Path**: `/v1alpha1/mem9s/{tenantID}/memories` · **Description**: Legacy unified write endpoint. Tenant key travels in the URL path
- **Method**: `GET` · **Path**: `/v1alpha1/mem9s/{tenantID}/memories` · **Description**: Legacy search endpoint for `tenantID`-configured clients
- **Method**: `GET` · **Path**: `/v1alpha1/mem9s/{tenantID}/memories/{id}` · **Description**: Legacy get-by-id endpoint
- **Method**: `PUT` · **Path**: `/v1alpha1/mem9s/{tenantID}/memories/{id}` · **Description**: Legacy update endpoint. Optional `If-Match` for version check
- **Method**: `DELETE` · **Path**: `/v1alpha1/mem9s/{tenantID}/memories/{id}` · **Description**: Legacy delete endpoint

## Self-Hosting

Before first start, apply the control-plane schema that matches your backend: `server/schema.sql`, `server/schema_pg.sql`, or `server/schema_db9.sql`.

mem9 server supports multiple storage backends. Set `MNEMO_DB_BACKEND` to `tidb`, `postgres`, or `db9`, point `MNEMO_DSN` at that backend, and the rest of the runtime contract stays the same for your agents. TiDB supports three tenant flows: TiDB Zero auto-provisioning is enabled by default on `tidb`; TiDB Cloud Pool auto-provisioning uses `MNEMO_TIDB_ZERO_ENABLED=false` with `MNEMO_TIDBCLOUD_API_KEY` and `MNEMO_TIDBCLOUD_API_SECRET`; manual bootstrap uses pre-existing tenants mode. `postgres` and `db9` use the advanced manual-bootstrap path, which requires an active tenant row in the control-plane DB plus a live tenant database and schema behind it. In `v1alpha2`, `X-API-Key` resolves tenants by ID lookup.

### Build & Run

```bash
make build
cd server
MNEMO_DSN="user:pass@tcp(host:4000)/mnemos?parseTime=true" ./bin/mnemo-server
```

For local development with automatic rebuild and restart on server source changes:

```bash
MNEMO_DSN="user:pass@tcp(host:4000)/mnemos?parseTime=true" make dev
```

For PostgreSQL or db9 deployments, export `MNEMO_DB_BACKEND=postgres` or `MNEMO_DB_BACKEND=db9` before launching the server.

### Docker

`make docker` tags the image as `${REGISTRY}/mnemo-server:${COMMIT}`. This local example builds `local/mnemo-server:dev`:

```bash
make docker REGISTRY=local COMMIT=dev
docker run -e MNEMO_DSN="..." -e MNEMO_DB_BACKEND="tidb" -p 8080:8080 local/mnemo-server:dev
```

### Environment Variables

Minimal runtime config is `MNEMO_DSN`. Everything else is optional or only applies to specific deployment modes.

#### Core Server

### Variable · Required · Default · Description
- **Variable**: `MNEMO_DSN` · **Required**: Yes · **Default**: — · **Description**: Database connection string
- **Variable**: `MNEMO_PORT` · **Required**: No · **Default**: `8080` · **Description**: HTTP listen port
- **Variable**: `MNEMO_DB_BACKEND` · **Required**: No · **Default**: `tidb` · **Description**: Database backend: `tidb`, `postgres`, or `db9`
- **Variable**: `MNEMO_RATE_LIMIT` · **Required**: No · **Default**: `100` · **Description**: Requests/sec per IP
- **Variable**: `MNEMO_RATE_BURST` · **Required**: No · **Default**: `200` · **Description**: Burst size
- **Variable**: `MNEMO_UPLOAD_DIR` · **Required**: No · **Default**: `./uploads` · **Description**: Directory used for uploaded file storage
- **Variable**: `MNEMO_WORKER_CONCURRENCY` · **Required**: No · **Default**: `5` · **Description**: Parallelism for async upload ingest workers
- **Variable**: `MNEMO_UTM_ENABLED` · **Required**: No · **Default**: `false` · **Description**: Enable UTM campaign tracking. When enabled, `utm_*` query params on provisioning requests are stored in the control-plane DB. Requires the `tenant_utm` table to exist
- **Variable**: `MNEMO_ENV` · **Required**: No · **Default**: `development` · **Description**: Deployment environment. Controls the default CORS origin set (`https://mem9.ai` in production; `https://mem9.ai,http://localhost:4321,http://127.0.0.1:4321` in development). Also settable via `APP_ENV`
- **Variable**: `MNEMO_CORS_ALLOWED_ORIGINS` · **Required**: No · **Default**: `https://mem9.ai` in production; `https://mem9.ai,http://localhost:4321,http://127.0.0.1:4321` in development · **Description**: Comma-separated allowed CORS origins. Overrides the `MNEMO_ENV`-based defaults

#### Embedding And Ingest

### Variable · Required · Default · Description
- **Variable**: `MNEMO_EMBED_AUTO_MODEL` · **Required**: No · **Default**: — · **Description**: TiDB/db9 `EMBED_TEXT()` model name. When set, it takes precedence over client-side embeddings
- **Variable**: `MNEMO_EMBED_AUTO_DIMS` · **Required**: No · **Default**: `1024` · **Description**: Vector dimensions for `MNEMO_EMBED_AUTO_MODEL`
- **Variable**: `MNEMO_EMBED_API_KEY` · **Required**: No · **Default**: — · **Description**: Client-side embedding provider API key. Optional for local OpenAI-compatible endpoints when `MNEMO_EMBED_BASE_URL` is set
- **Variable**: `MNEMO_EMBED_BASE_URL` · **Required**: No · **Default**: `https://api.openai.com/v1` when client-side embeddings are enabled · **Description**: Custom OpenAI-compatible embedding endpoint
- **Variable**: `MNEMO_EMBED_MODEL` · **Required**: No · **Default**: `text-embedding-3-small` · **Description**: Client-side embedding model name
- **Variable**: `MNEMO_EMBED_DIMS` · **Required**: No · **Default**: `1536` · **Description**: Client-side embedding vector dimensions
- **Variable**: `MNEMO_LLM_API_KEY` · **Required**: No · **Default**: — · **Descripti