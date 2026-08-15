![openma](logo.svg)

# Open Managed Agents

**Open-source alternative to Claude Managed Agents** — and a foundation for open-source, self-hosted Claude Tag-style agents.

🌐 **[openma.dev](https://openma.dev)** · 📖 **[docs.openma.dev](https://docs.openma.dev)** · 💬 **[github.com/openma-ai/open-managed-agents](https://github.com/openma-ai/open-managed-agents)**

Write a harness. Deploy. The platform runs it — with sessions, sandboxes, tools, memory, vaults, Slack/GitHub/Linear integrations, and crash recovery out of the box. Drop-in compatible with the Claude Managed Agents API; runs on Cloudflare Workers + Durable Objects, or `docker compose up` on your own box.

Use Open Managed Agents when you want:

- A self-hosted Claude Managed Agents API implementation.
- An open-source, self-hosted Claude Tag-style workflow with BYOK model credentials.
- MCP, private tools, encrypted vaults, and durable sessions under your own deployment boundary.

Compare: [Claude Tag alternative](https://openma.dev/claude-tag-alternative/) · [Open-source Claude Tag](https://openma.dev/claude-tag-open-source/) · [Self-hosted Claude Tag](https://openma.dev/self-hosted-claude-tag/)

## Two ways to run OMA

The same harness, business logic, and event-log model run on both. Pick the
one that matches your hosting story:

| | **Self-host (Node)** | **Cloudflare** |
|---|---|---|
| Where it lives | Your VPS / Mac / Docker host / fly.io / your k8s | Cloudflare Workers + DO + Containers |
| Storage | SQLite or Postgres + local FS | D1 + KV + R2 |
| Sandbox | LocalSubprocess / LiteBox / Daytona / E2B / BoxRun | Cloudflare Sandbox (Containers) |
| Time to running | `docker compose up` (~2 min) | wrangler deploy (~10 min once configured) |
| Best for | OSS users, on-prem, no CF account, data-resident deploys | Edge scale, no host management, already on CF |

**Same SDK.** Same `/v1/agents` / `/v1/sessions` API. Same Console UI. Same
crash-recovery semantics. Switch between them by changing env vars, not code.

## Quick start: self-host (Docker)

```bash
git clone https://github.com/openma-ai/open-managed-agents.git
cd open-managed-agents
cp .env.example .env

# Two secrets are required before first boot — both generated locally:
#   BETTER_AUTH_SECRET   — signs Console sessions
#   PLATFORM_ROOT_SECRET — encrypts credentials, model-card API keys, integration tokens at rest
#                          (lose it and every encrypted row is unreadable — back it up)
$EDITOR .env
# BETTER_AUTH_SECRET=$(openssl rand -hex 32)
# PLATFORM_ROOT_SECRET=$(openssl rand -base64 32)
#
# Optional: ANTHROPIC_API_KEY lets the first agent run without a Model Card.
# In production, add a Model Card per tenant from the Console instead.

# SQLite + LocalSubprocess sandbox (default — fastest path)
docker compose up -d

# Or Postgres backend
# docker compose -f docker-compose.postgres.yml up -d

curl localhost:8787/health
# → {"status":"ok","backends":{"db":"sqlite ..."}, ...}

open http://localhost:8787   # Console UI on the same port
```

Smoke test the harness end-to-end:

```bash
AID=$(curl -s -X POST localhost:8787/v1/agents -H 'content-type: application/json' \
  -d '{"name":"hello","model":"claude-sonnet-4-6","tools":[{"type":"agent_toolset_20260401"}]}' | jq -r .id)

SID=$(curl -s -X POST localhost:8787/v1/sessions -H 'content-type: application/json' \
  -d "{\"agent\":\"$AID\"}" | jq -r .id)

curl -s -X POST localhost:8787/v1/sessions/$SID/events -H 'content-type: application/json' \
  -d '{"events":[{"type":"user.message","content":[{"type":"text","text":"Run: uname -a"}]}]}'
```

Full self-host guide (sandbox modes, Postgres, BoxRun, vault sidecar,
Console UI, operator gotchas): **[docs.openma.dev/self-host/overview](https://docs.openma.dev/self-host/overview/)**

## Quick start: Cloudflare deploy

Requires [Workers Paid plan](https://developers.cloudflare.com/workers/platform/pricing/) (for Durable Objects + Containers).

```bash
git clone https://github.com/openma-ai/open-managed-agents.git
cd open-managed-agents
pnpm install

# Local dev (no CF account needed) — wrangler dev with simulators
cp .dev.vars.example .dev.vars && $EDITOR .dev.vars
# Same two-secret setup as Docker — PLATFORM_ROOT_SECRET is required to start
pnpm dev
# API   → http://localhost:8787
# Console → http://localhost:5173

# Deploy
npx wrangler login
npx wrangler kv namespace create CONFIG_KV   # paste id into wrangler.jsonc

# Required secrets (paste each when prompted)
npx wrangler secret put BETTER_AUTH_SECRET    # openssl rand -hex 32
npx wrangler secret put PLATFORM_ROOT_SECRET  # openssl rand -base64 32 — back this up
npx wrangler secret put API_KEY               # initial bootstrap key for the REST API

# Optional — only if you want a tenant-less default LLM (otherwise add a Model Card in the Console)
# npx wrangler secret put ANTHROPIC_API_KEY

npm run deploy
# → https://openma.dev (or https://managed-agents.<your-subdomain>.workers.dev for a personal deploy)
```

What gets deployed:

| Component | What it does |
|---|---|
| **Main Worker** | API routes — agents, sessions, environments, vaults, memory, files |
| **Agent Worker** | SessionDO + harness + sandbox per environment |
| **KV Namespace** | Config storage for agents, environments, credentials |
| **R2 Bucket** | Workspace file persistence across container restarts |

### Create your first agent

The smoke test above works against any deployment. For the Console-driven flow (Model Cards, vaults, integrations) see **[docs.openma.dev/quickstart](https://docs.openma.dev/quickstart)**. The minimal API equivalent:

```bash
BASE=http://localhost:8787   # or your deployed URL
KEY=dev-test-key             # whatever you set as API_KEY

AGENT=$(curl -s $BASE/v1/agents \
  -H "x-api-key: $KEY" -H "content-type: application/json" \
  -d '{
    "name": "Coder",
    "model": "claude-sonnet-4-6",
    "system": "You are a helpful coding assistant.",
    "tools": [{ "type": "agent_toolset_20260401" }]
  }' | jq -r .id)

SESSION=$(curl -s $BASE/v1/sessions \
  -H "x-api-key: $KEY" -H "content-type: application/json" \
  -d "{\"agent\":\"$AGENT\"}" | jq -r .id)

# Send a turn AND stream the reply token-by-token in one shot
curl -N -X POST $BASE/v1/sessions/$SESSION/messages \
  -H "x-api-key: $KEY" -H "content-type: application/json" \
  -d '{"content":"Write a Python script that fetches HN top stories"}'
```

For long-lived sessions use `GET /v1/sessions/$SESSION/events/stream` — replays history on connect, never closes.

## Architecture

A **meta-harness** is not an agent — it's the platform that runs agents. It defines stable interfaces for everything an agent needs, and stays out of the way of the agent loop:

```
┌─────────────────────────────────────────────────────────┐
│  Harness (the brain — your code)                        │
│  - Reads events, builds context, calls the model        │
│  - Decides HOW: caching, compaction, tool delivery      │
│  - Stateless: crash → rebuild from event log → resume   │
├─────────────────────────────────────────────────────────┤
│  Meta-Harness (the platform — SessionDO)                │
│  - Prepares WHAT is available: tools, skills, history   │
│  - Manages lifecycle: sandbox, events, WebSocket        │
│  - Crash recovery, credential isolation, usage tracking │
├─────────────────────────────────────────────────────────┤
│  Infrastructure (Cloudflare or Node self-host)          │
│  - Event log: Durable-Object SQLite (CF) or SQLite/Pg   │
│  - Sandbox: CF Containers / subprocess / LiteBox / E2B  │
│  - Storage: KV + R2 (CF) or local FS (self-host)        │
└─────────────────────────────────────────────────────────┘
```

**The platform prepares _what_ is available. The harness decides _how_ to deliver it to the model.**

| Platform manages | Harness decides |
|---|---|
| Event log persistence (SQLite) | Context engineering (filtering, ordering) |
| Sandbox lifecycle (containers) | Caching strategy (cache breakpoints) |
| Tool registration (built-in + MCP) | Compaction strategy (when to compress) |
| WebSocket broadcast | Retry strategy (backoff, transient detection) |
| Crash recovery | Stop conditions (max steps, completion signals) |
| Credential isolation (vaults) | System prompt construction |
| Memory (vector search) | Tool delivery (all at once vs. progressive) |

## Write a Harness

The default harness works out of the box. When you need custom behavior — different caching, compaction, context engineering — write your own:

```typescript
// my-harness.ts
import { defineHarness, generateText, stepCountIs } from "@open-managed-agents/sdk";

export default defineHarness({
  name: "research",

  async run(ctx) {
    let messages = ctx.runtime.history.getMessages();

    // Your context engineering
    messages = keepOnly(messages, ["web_search", "web_fetch"]);

    // Your caching strategy
    markLastN(messages, 3, { cacheControl: "ephemeral" });

    // Your loop — tools, sandbox, broadcast are platform-provided
    const result = await generateText({
      model: ctx.model,
      system: ctx.systemPrompt,
      messages,
      tools: ctx.tools,
      stopWhen: stepCountIs(50),
      onStepFinish: async ({ text }) => {
        if (text) ctx.runtime.broadcast({
          type: "agent.message",
          content: [{ type: "text", text }],
        });
      },
    });

    await ctx.runtime.reportUsage?.(result.usage.inputTokens, result.usage.outputTokens);
  },
});
```

Deploy it:

```bash
oma deploy --harness my-harness.ts --agent agent_abc123
```

The harness is bundled into the agent worker at build time. Your code runs in the same isolate as SessionDO — direct access to the event log, sandbox, and WebSocket broadcast. No RPC, no serialization boundary.

## API

Compatible with the [Claude Managed Agents API](https://docs.anthropic.com/en/docs/agents/managed-agents). Same endpoints, same event types, works with existing SDKs.

Agents — Create and manage agent configurations

```http
POST   /v1/agents                          # Create agent
GET    /v1/agents                          # List agents
GET    /v1/agents/:id                      # Get agent
PUT    /v1/agents/:id                      # Update agent
DELETE /v1/agents/:id                      # Delete agent
POST   /v1/agents/:id/archive             # Archive agent
GET    /v1/agents/:id/versions            # Version history
GET    /v1/agents/:id/versions/:version   # Get specific version
```

Environments — Sandbox execution environments

```http
POST   /v1/environments                   # Create environment
GET    /v1/environments                   # List environments
GET    /v1/environments/:id               # Get environment
PUT    /v1/environments/:id               # Update environment
DELETE /v1/environments/:id               # Delete environment
```

Sessions — Run agent conversations

```http
POST   /v1/sessions                        # Create session
GET    /v1/sessions                        # List sessions
GET    /v1/sessions/:id                    # Get session
POST   /v1/sessions/:id                    # Update session
DELETE /v1/sessions/:id                    # Delete session
POST   /v1/sessions/:id/archive           # Archive session

POST   /v1/sessions/:id/events            # Send events (user messages)
GET    /v1/sessions/:id/events             # Get events (JSON or SSE)
GET    /v1/sessions/:id/events/stream      # SSE stream

POST   /v1/sessions/:id/resources          # Attach resource
GET    /v1/sessions/:id/resources          # List resources
DELETE /v1/sessions/:id/resources/:resId   # Remove resource
```

Vaults — Secure credential storage

```http
POST   /v1/vaults                          # Create vault
POST   /v1/vaults/:id/credentials          # Add credential
GET    /v1/vaults/:id/credentials          # List (secrets stripped)
```

Memory Stores — persistent storage; Claude Managed Agents Memory contract

When attached to a session, each store is mounted into the sandbox at
`/mnt/memory/<store_name>/`. The agent reads and writes it with the
**standard file tools** (bash/read/write/edit/glob/grep) — there are no
bespoke `memory_*` tools.

R2 holds the bytes-of-truth (key `<store_id>/<memory_path>`); D1 holds the
index + audit, kept eventually consistent via R2 Event Notifications →
Cloudflare Queue → Consumer.

```http
POST   /v1/memory_stores                                        # Create store
GET    /v1/memory_stores                                        # List stores
GET    /v1/memory_stores/:id                                    # Retrieve store
POST   /v1/memory_stores/:id/archive                            # Archive (one-way)
DELETE /v1/memory_stores/:id                                    # Delete store + memories + versions

POST   /v1/memory_stores/:id/memories                           # Create/upsert memory {path, content, precondition?}
GET    /v1/memory_stores/:id/memories?path_prefix=&depth=N      # List memories (metadata)
GET    /v1/memory_stores/:id/memories/:mid                      # Retrieve memory (with content)
POST   /v1/memory_stores/:id/memories/:mid                      # Update memory {path?, content?, precondition?}
DELETE /v1/memory_stores/:id/memories/:mid                      # Delete memory

GET    /v1/memory_stores/:id/memory_versions?memory_id=         # Audit history (newest first)
GET    /v1/memory_stores/:id/memory_versions/:ver_id            # Single version (with snapshot content)
POST   /v1/memory_stores/:id/memory_versions/:ver_id/redact     # Redact prior version (refuses live head)
```

CAS via `precondition: { type: "content_sha256", content_sha256 }`. 100KB
cap per memory. 30-day version retention with the most-recent version per
memory always preserved. Rollback = retrieve a version and write its
content as a new memory revision (no special endpoint).

CLI:
```bash
oma memory stores create "User Preferences"
oma memory write <store-id> /preferences/formatting.md --content "Always use tabs."
oma memory ls <store-id> --prefix /preferences/
oma memory versions <store-id> --memory-id <mem-id>
```

Files & Skills

```http
POST   /v1/files                           # Upload file
GET    /v1/files/:id/content               # Download file
POST   /v1/skills                          # Create skill
GET    /v1/skills                          # List skills
```

## Built-in Tools

The `agent_toolset_20260401` provides:

| Tool | Description |
|---|---|
| `bash` | Execute commands in the sandbox |
| `read` | Read files from sandbox filesystem |
| `write` | Write/create files (auto-creates directories) |
| `edit` | Surgical string replacement in files |
| `glob` | Find files matching a pattern |
| `grep` | Search file contents with regex |
| `web_fetch` | URL → markdown via Workers AI; auto-summarized when `agent.aux_model` is set, raw saved to `/workspace/.web/` |
| `web_search` | Web search via Tavily API (requires `TAVILY_API_KEY`) |
| `schedule` / `cancel_schedule` / `list_schedules` | Cron-style self-wakeup for long-running agents |
| `browser` (opt-in) | Headless browser session — navigate, click, screenshot. Opt-in via `tools: [{ name: "browser", enabled: true }]` so the default-tool list nudges agents toward cheaper `web_fetch` |

Derived tools are auto-generated based on session config:

| Tool | Source |
|---|---|
| `call_agent_*` | Callable Agents (multi-agent delegation) |
| `mcp__<server>__<tool>` | MCP Servers (double underscore is the actual separator) |

(Memory Stores do **not** add bespoke tools — agents access them as filesystem
mounts at `/mnt/memory/<store_name>/` via the standard file tools above.)

## MCP servers

OMA registers any [Model Context Protocol](https://modelcontextprotocol.io) server attached to an agent. Each upstream tool surfaces to the model as `mcp__<server>__<tool>` (double underscore — copy the name exactly). Up to 20 servers per agent.

| Transport | When to use | How |
|---|---|---|
| HTTP / SSE | Hosted MCP servers (Linear, GitHub Copilot, Notion, …) | `{"type":"url","url":"https://mcp.linear.app/mcp"}` |
| stdio | npm / PyPI MCP packages with no hosted endpoint | `{"type":"stdio","command":"uvx","args":[...],"port":8765}` — OMA spawns inside the sandbox container, talks to `127.0.0.1:port/sse` |

Credentials never enter the sandbox; the outbound resolver matches by host and injects at forward time.

| Auth mode | Configured as | Refresh |
|---|---|---|
| none | no `authorization_token`, no matching vault credential | n/a |
| inline bearer | `"authorization_token": "..."` on the server entry | no |
| vault static bearer | session vault has a `static_bearer` credential whose `mcp_server_url` matches | no |
| vault OAuth | session vault has an `mcp_oauth` credential (with `refresh_token` + `token_endpoint`) | yes — on 401 **and 403** (Airtable/Asana/Sentry use 403 for expired tokens), CAS-writes new token to D1, retries once |

```bash
# Servers attach to the agent (not the session)
curl -X PUT $BASE/v1/agents/$AGENT -H "x-api-key: $KEY" -H "content-type: application/json" \
  -d '{"mcp_servers":[{"name":"linear","type":"url","url":"https://mcp.linear.app/mcp"}]}'

# Bind an OAuth credential via Vault
oma connect linear --vault $VAULT_ID
```

Tool discovery is bounded at 15 s per server; one bad server logs and skips, the rest stay live. Full design: [docs.openma.dev/build/vault-and-mcp](https://docs.openma.dev/build/vault-and-mcp/).

## Skills

A skill is a `SKILL.md` plus reference files (templates, schemas, examples). At session start the platform mounts everything under `/home/user/.skills/{name}/` in the sandbox **and inlines the SKILL.md body directly into the system prompt** — no lazy read, no follow-up `read` tool call. Format is compatible with Anthropic's [Claude Code skills](https://github.com/anthropics/skills).

Create a skill (JSON; files inlined):

```http
POST /v1/skills
{
  "files": [
    { "filename": "SKILL.md", "content": "---\nname: invoice-parser\ndescriptio