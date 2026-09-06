# dsh-plugin-mcp

> **Universal Model Context Protocol (MCP) Bridge Plugin for DeepSeek Harness (`dsh`)**

[![npm version](https://img.shields.io/npm/v/dsh-plugin-mcp.svg)](https://www.npmjs.com/package/dsh-plugin-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![DeepSeek Harness](https://img.shields.io/badge/dsh-plugin-brightgreen.svg)](https://github.com/deepseek-ai/deepseek-harness)

`dsh-plugin-mcp` is an official-standard plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) that seamlessly connects your DeepSeek agents to the entire ecosystem of [Model Context Protocol (MCP)](https://modelcontextprotocol.io) servers with full Claude Code-level feature parity.

See our complete [ROADMAP.md](ROADMAP.md) for current features and upcoming milestones.

---

## Features

- 🔌 **Universal MCP Support**: Run any MCP server over `stdio`, `sse`, or `websocket`.
- 🚀 **10,000+ Server Scale Engine**: Dormant-by-default process pool with JIT worker activation and LRU idle process reaper (maintains <100MB RAM even with 10k servers).
- ⚡ **Sub-Millisecond BM25 Inverted Index**: Evaluates 20,000+ tool definitions across thousands of servers in <0.5ms.
- 🎯 **Dynamic Token Budget Allocator**: Strict context window capping (e.g. max 1,500 tokens) with progressive schema disclosure.
- 💾 **Two-Tier Schema Cache (L1/L2)**: Instant memory cache + disk snapshot eliminates `tools/list` handshake delay on boots.
- 📊 **Enterprise Telemetry**: High-resolution p50, p95, and p99 tool latency histograms and metrics.
- 📁 **Multi-Scope Configurations**: Automatically loads user global (`~/.dsh/mcp.json`), project local (`.dsh/mcp.json`), and profile-level configurations.
- 🛡️ **Execution Permissions**: Granular `allow`, `ask`, and `deny` permission rules for tool safety.
- 🔒 **Enterprise Security Engine**: Automatic secrets redaction (API keys/bearer tokens), command injection guards, and path traversal defenses.
- 🚦 **Circuit Breaker & Rate Limiting**: Fault tolerance prevents runaway loops and token quota exhaustion on failing servers.
- 📜 **Security Audit Logging**: Structured JSON logging of all tool invocations, permissions verdicts, and safety events.
- 🔍 **Semantic Tool Search**: TF-IDF token relevance scoring ensures only relevant tools are injected into prompt context.
- 🗜️ **Context Spillover Guard**: Truncates massive outputs (>30k chars) and stores them as local artifacts with structured previews.
- 🛠️ **Automatic Tool Bridging**: Dynamically registers MCP tools into the DSH tool registry with JSON Schema validation.
- 📂 **Resource & Prompt Bridge**: Exposes MCP resources and prompt templates directly into agent context.
- ⚡ **Resilient Execution**: Isolated server lifecycles, per-server timeout controls, and non-blocking error handling.
- 🏷️ **Clean Namespacing**: Automatic tool name prefixing (`github_create_issue`, `postgres_query`) to avoid name collisions across servers.
- 🧩 **Cordis Native**: Built directly on Cordis lifecycle hooks (`ctx.provide`, `ctx.on('ready')`, `ctx.on('dispose')`).

---

## ⚡ 1-Line Docker Quickstart

Launch DeepSeek Harness + MCP bridge + PostgreSQL + Filesystem with 1 command:

```bash
# Clone and boot the complete stack
git clone https://github.com/menotbobbybrown/dsh-plugin-mcp.git
cd dsh-plugin-mcp

# On Linux/macOS:
./scripts/quickstart.sh

# On Windows PowerShell:
.\scripts\quickstart.ps1
```

---

## Installation

### In DeepSeek Harness (`dsh`)

```bash
# Add from GitHub
dsh plugin --profile web add "github:menotbobbybrown/dsh-plugin-mcp"

# Or install via npm
dsh plugin --profile web add dsh-plugin-mcp
```

---

## 💻 CLI Commands (`dsh-mcp`)

Manage MCP servers seamlessly from the terminal just like Claude Code:

```bash
# Browse verified built-in server catalog
npx dsh-mcp catalog

# 1-Click install popular servers (GitHub, Postgres, SQLite, Brave Search, etc.)
npx dsh-mcp install github --scope user
npx dsh-mcp install postgres --scope project
npx dsh-mcp install sqlite --scope project

# List all configured MCP servers and their active scopes
npx dsh-mcp list

# Add a custom user-global MCP server (~/.dsh/mcp.json)
npx dsh-mcp add custom_srv --scope user -- npx -y my-mcp-server

# Add a project-local MCP server (.dsh/mcp.json)
npx dsh-mcp add postgres --scope project -- npx -y @modelcontextprotocol/server-postgres postgresql://localhost:5432/mydb

# Add an SSE remote MCP server
npx dsh-mcp add weather --transport sse -- https://weather-mcp.example.com/sse

# Test connection, latency, and tool discovery
npx dsh-mcp test github

# Remove an MCP server from configuration
npx dsh-mcp remove github --scope user
```

---

## Configuration

Add the plugin to your `dsh.config.yaml`:

```yaml
plugins:
  mcp:
    prefixToolNames: true
    prefixDelimiter: "_"
    defaultTimeoutMs: 60000
    servers:
      # GitHub MCP Server
      github:
        type: stdio
        command: npx
        args: ["-y", "@modelcontextprotocol/server-github"]
        env:
          GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_TOKEN}"

      # Local Filesystem MCP Server
      filesystem:
        type: stdio
        command: npx
        args: ["-y", "@modelcontextprotocol/server-filesystem", "./workspace"]

      # PostgreSQL Database MCP Server
      postgres:
        type: stdio
        command: npx
        args: ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost:5432/mydb"]

      # Remote MCP Server via SSE
      remote_service:
        type: sse
        url: "https://mcp.example.com/sse"
        headers:
          Authorization: "Bearer ${API_KEY}"
```

---

## Programmatic Usage (Cordis API)

```typescript
import { Context } from 'cordis';
import * as McpPlugin from 'dsh-plugin-mcp';

const ctx = new Context();

ctx.plugin(McpPlugin, {
  servers: {
    github: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
    },
  },
});

// Access registered MCP tools & services
const tools = await ctx.mcp.getAllTools();
const statuses = ctx.mcp.getStatuses();
```

---

## Development & Testing

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Build package
npm run build
```

---

## License

MIT © DeepSeek Harness Community
