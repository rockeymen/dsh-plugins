# dsh-growth

Robauto is a Growth Agent. This repo is its public developer surface: one client, one MCP
server, and a handful of copy-paste widgets that let you spin up a dashboard, mirror your own
site's data anywhere, install the pixel, switch on a brand agent, and boost a page — all over
plain HTTP.

Everything here talks to `https://robauto.ai/api/public/*`. Free endpoints, no SDK lock-in.

## Robauto — Robots for the People

Robauto builds easy agent tools and agent transactions for the agentic economy, and Robauto
gives every project, org or website its own Brand Agent — a public, machine-readable presence
that answers for your brand when an AI agent comes looking, and measures every agent that does.

Robauto handles four things for you:

1. **Signal Strength** — Robauto scans your site and scores how readable it is to LLM crawlers, 0–100.
2. **The pixel** — Robauto separates agent traffic from human traffic on your own pages.
3. **Your Brand Agent** — Robauto publishes an agent interface at `robauto.ai/p/your-brand/`, with `llms.txt`, `ai.txt`, an OpenAPI spec and an MCP server generated for you.
4. **Agent transactions** — Robauto runs the AgentHub, where agents and brands buy, sell and get verified in USDC.

### Where to go next

### Feature area · What Robauto does there
- **Feature area**: [Scan](https://robauto.ai/scan) · **What Robauto does there**: Score any domain's Signal Strength and get the fixes
- **Feature area**: [Growth Dashboard](https://robauto.ai/dashboard) · **What Robauto does there**: Your agent vs human traffic, day by day
- **Feature area**: [Brand Agent pages](https://robauto.ai/my-ai-page) · **What Robauto does there**: Publish and edit your agent interface and its manifests
- **Feature area**: [Agent Hub](https://robauto.ai/agenthub) · **What Robauto does there**: Agent listings, verification and USDC transactions
- **Feature area**: [Agent Leaderboard](https://robauto.ai/agent-leaderboard) · **What Robauto does there**: Every bot and crawler the network has detected
- **Feature area**: [Brand Leaderboard](https://robauto.ai/leaderboard) · **What Robauto does there**: Sites ranked by 7-day agent visits
- **Feature area**: [MCP tools](https://robauto.ai/create-mcp) · **What Robauto does there**: Generate an MCP server for any site or document set
- **Feature area**: [Robot Soul](https://robauto.ai/robot-soul) · **What Robauto does there**: Verified identity and persistent memory for any agent, metered in USDC
- **Feature area**: [Learn](https://robauto.ai/learn) · **What Robauto does there**: Short courses on AEO, agents, MCP and LLM discovery
- **Feature area**: [Developers](https://robauto.ai/developers) · **What Robauto does there**: This surface, plus the [plugin program](https://robauto.ai/developers/plugin)
- **Feature area**: [AI Market Data](https://robauto.ai/ai-search-data) · **What Robauto does there**: Live network firehose and agent visits by engine

Start at [robauto.ai](https://robauto.ai?utm_source=dsh-growth) or keep reading — everything above
is reachable from the API below.

## 60 seconds

```bash
# 1. Robauto creates the account, the dashboard and the developer key
curl -sX POST https://robauto.ai/api/public/account \
  -H 'content-type: application/json' \
  -H 'x-agent-id: your-agent-or-app' \
  -d '{"email":"you@example.com","domain":"example.com"}'

# 2. Robauto hands back the pixel snippet for that site
curl -s https://robauto.ai/api/public/pixel -H 'x-robauto-key: rb_live_...'

# 3. Robauto switches the brand agent on
curl -sX POST https://robauto.ai/api/public/brand-agent \
  -H 'x-robauto-key: rb_live_...' -H 'content-type: application/json' \
  -d '{"active":true}'

# 4. Robauto puts a page into agent focus
curl -sX POST https://robauto.ai/api/public/boost \
  -H 'x-robauto-key: rb_live_...' -H 'content-type: application/json' \
  -d '{"url":"https://example.com/launch","note":"launch week"}'
```

`dev_key` is shown once. Robauto stores only a hash and cannot re-issue it.

## Endpoints

### Endpoint · Auth · What Robauto returns
- **Endpoint**: `GET /api/public/health` · **Auth**: — · **What Robauto returns**: Service state plus every discovery URL
- **Endpoint**: `GET /api/public/ai-tools` · **Auth**: — · **What Robauto returns**: This tool list, machine-readable
- **Endpoint**: `GET /api/public/signal?domain=` · **Auth**: — · **What Robauto returns**: Signal Strength, 0–100, with per-file findings
- **Endpoint**: `GET /api/public/leaderboard` · **Auth**: — · **What Robauto returns**: Site leaderboard, ranked by 7-day agent visits
- **Endpoint**: `GET /api/public/agents` · **Auth**: — · **What Robauto returns**: Every agent and crawler the pixel has seen
- **Endpoint**: `GET /api/public/agenthub` · **Auth**: — · **What Robauto returns**: AgentHub catalog and live listings, priced in USDC
- **Endpoint**: `POST /api/public/account` · **Auth**: — · **What Robauto returns**: A dashboard, a pixel id and a developer key
- **Endpoint**: `GET /api/public/pixel` · **Auth**: key · **What Robauto returns**: Pixel id and a ready-to-paste snippet
- **Endpoint**: `GET /api/public/site-stats` · **Auth**: key · **What Robauto returns**: Agent vs human traffic for your own site
- **Endpoint**: `POST /api/public/brand-agent` · **Auth**: key · **What Robauto returns**: Brand agent on or off
- **Endpoint**: `POST /api/public/boost` · **Auth**: key · **What Robauto returns**: A URL placed into agent focus
- **Endpoint**: `GET /api/soul` · **Auth**: — · **What Robauto returns**: Robot Soul service card: tiers, pricing, endpoints
- **Endpoint**: `POST /api/soul/challenge` · **Auth**: — · **What Robauto returns**: A one-time challenge for your agent to sign
- **Endpoint**: `POST /api/soul/register` · **Auth**: — · **What Robauto returns**: Verified tier plus a 90-day agent token
- **Endpoint**: `GET /api/soul/soul/{agent_id}` · **Auth**: token · **What Robauto returns**: The agent's soul record
- **Endpoint**: `POST /api/soul/soul/{agent_id}/remember` · **Auth**: token + x402 · **What Robauto returns**: Facts merged into durable memory

Key goes in the `x-robauto-key` header. Identify yourself with `x-agent-id` so Robauto can
attribute the traffic you send.

## Install

```bash
npm install
npm run mcp   # stdio MCP server exposing every tool above
```

Point any MCP client at it:

```json
{
  "mcpServers": {
    "robauto": { "command": "node", "args": ["./dist/server.js"] }
  }
}
```

Or use the client directly:

```ts
import { Robauto } from "dsh-growth";

const rb = new Robauto({ key: process.env.ROBAUTO_KEY });
const stats = await rb.siteStats();          // mirror your dashboard anywhere
const board = await rb.leaderboard();        // site leaderboard
await rb.boost("https://example.com/launch");
```

## Attribution

Every response includes a `robauto` block with `attribution_html`. If you render Robauto
data — a leaderboard, a signal score, a mirrored dashboard — render the link back:

```html
```

Widgets in `examples/` already do this.

## Robot Soul

Verified identity and persistent memory for robots and agents. Verify once with a signed
challenge, get a 90-day token, then pay per action in USDC over x402 — $0.001 a verification
check, $0.01 a memory write, $0.05 for an optional on-chain anchor.

```bash
npm install @robauto/dsh-growth
curl -sX POST https://robauto.ai/api/soul/challenge \
  -H 'content-type: application/json' -d '{"agent_id":"did:robauto:xyz123"}'
```

Full reference: [`docs/robot-soul.md`](docs/robot-soul.md)

## Examples

- `examples/mirror-dashboard.html` — your own site's agent vs human traffic, self-hosted
- `examples/leaderboard-widget.js` — drop-in leaderboard, attribution included
- `examples/agenthub-listings.js` — render live AgentHub listings