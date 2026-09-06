# create-dsh-app

> **1-Line AI Agent Generator for DeepSeek Harness (`dsh`)**

Scaffold a production-ready, autonomous AI agent powered by **DeepSeek Harness** in seconds with pre-wired MCP tools, long-term memory, and web browsing.

## ⚡ Quickstart

```bash
# 1-Line Scaffolding
npx create-dsh-app my-agent

# Enter project directory
cd my-agent

# Install dependencies and start
npm install
cp .env.example .env
npm start
```

## 🧩 Included Out-of-the-Box

Each generated project comes pre-configured with:
- 🔌 **`dsh-plugin-mcp`**: Universal Model Context Protocol tools & 1-click server catalog (GitHub, Postgres, SQLite, Brave Search, etc.)
- 🧠 **`dsh-plugin-memory`**: Persistent long-term knowledge graph & user preference recall
- 🌐 **`dsh-plugin-browser`**: Native headless web browser navigation & Markdown extraction
- ⚡ **TypeScript & Cordis Lifecycle**: Clean architecture with fast hot-reloading (`tsx`)

## Options

```bash
# Exclude specific plugins if not needed:
npx create-dsh-app my-minimal-agent --no-browser --no-memory
```