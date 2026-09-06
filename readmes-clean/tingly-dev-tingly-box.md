![Tingly Box Web UI Demo](./docs/hero.png)

> **Announcement:** Here is [fault record](https://github.com/tingly-dev/tingly-box/discussions/626). Please update to the latest version to resolve known issues. Thank you for your continued support.

# Tingly Box

Tingly Box **serves agents, coordinates AI models, optimizes context, and routes requests** for maximum efficiency — with built-in **remote control and secure, customizable integrations**.

![Tingly Box Web UI Demo](./docs/images/output.gif)

## Key Features

- **Agent-First Model Gateway** – Unified endpoint for agents — seamlessly bridge OpenAI, Anthropic, Google Gemini, and more with automatic protocol translation and native agent compatibility
- **Agent Integration** – One-click config for Claude Code, OpenCode, Codex, Xcode, and more — transparent proxying for SDKs and CLI tools
- **Agent Profiles** - Run agent like Claude Code with individual profiles, each profile can work with different model and agent config
- **Remote Control via IM Bots** – Control AI agents remotely through Telegram, DingTalk, Feishu, Lark, Weixin, WeCom, Slack, and Discord
- **Multi-Tenant API Tokens** – Isolate data per user with dedicated API tokens — each user gets their own usage tracking, provider access, and configuration
- **Smart Routing Engine** – Intelligently route requests across models and tokens based on cost, speed, or custom policies — far beyond simple load balancing
- **Flexible Authentication** – Support for both API keys and OAuth providers (Claude.ai, Codex, etc.) — use your existing quotas anywhere
- **Visual Control Plane** – Intuitive web UI to manage providers, routes, aliases, models, and remote bots at a glance — no config files needed
- **Client-Side Usage Analytics** – Track token consumption, latency, cost estimates, and model selection per request — directly from your client
- **Blazing Fast Performance** – Adds typically **< 1ms** of overhead — get flexibility without latency tax

## Quick Start

[English](https://github.com/tingly-dev/tingly-box/issues/678#issuecomment-4273812882) | [中文](https://github.com/tingly-dev/tingly-box/issues/678#issue-4244345496)

### Install

**From npm / npx (recommended)**

```bash
# Install and run (auto restart, migrate and open webui while run without any args)
# A golang binary release but npx to wrap cli for convenience
npx tingly-box@latest

# or -y for convenience
npx -y tingly-box@latest

# if any network trouble, try bundle with binary built-in
npx -y tingly-box-bundle@latest

# npm mirror is supported for CN (one of below)
npx --registry=https://registry.npmmirror.com -y tingly-box-bundle@latest
npx --registry=https://mirrors.huaweicloud.com/repository/npm/ -y tingly-box-bundle@latest
npx --registry=http://mirrors.tencent.com/npm/ -y tingly-box-bundle@latest
```

> if any trouble, please check tingly-box output, or call for an issue to help.

**Install Node & NPX**

```
# MacOS & Linux
## Install Node.js LTS via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

## Restart terminal or load nvm
source ~/.nvm/nvm.sh

## Install Node.js LTS
nvm install --lts

## Verify installation
node -v
npx -v
```

```
# Windows
## Powershell with Winget
winget install OpenJS.NodeJS.LTS

## Restart terminal, then verify installation
node -v
npx -v

## Or download and install Node.js LTS manually:
https://nodejs.org/en/download
```

**From Docker (GitHub Host)**

```bash
mkdir tingly-data
docker run -d \
  --name tingly-box \
  -p 12580:12580 \
  -v `pwd`/tingly-data:/home/tingly/.tingly-box \
  ghcr.io/tingly-dev/tingly-box
```

**From Docker Compose (Recommend for isolated env)**

```bash
# Build and start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f tingly-box

# Stop services
docker-compose down

# Access Web UI at http://localhost:12581
# (Note: Port 12581 is used to avoid conflict with host tingly on 12580)
```

### Integration Guide

Agent Integration - Claude Code / Claude Desktop / OpenCode / Codex / Xcode / VSCode / OpenClaw

- Claude Code (support 1-click config)
- OpenCode (support 1-click config)
- Xcode (require manual config)
- ……

Any application is ready to use.

> We've provided detailed config guide in application

![Agent Integration Demo](./docs/images/5-claude-code.png)

DeepSeek Best Compatibility

DeepSeek is optimized for mainstream agent workflows, offering broad compatibility across protocol adapters, agent clients, extended context, vision, web search, and cache optimization.

### Module · Status · What It Solves
- **Module**: Model List · **Status**: ✅ Supported · **What It Solves**: Keeps the official model list up to date in real time
- **Module**: Protocol Adaptation · **Status**: ✅ Supported · **What It Solves**: Supports official Anthropic/OpenAI APIs with bidirectional conversion
- **Module**: Reasoning Capability · **Status**: ✅ Supported · **What It Solves**: Provides compatibility with Thinking workflows
- **Module**: Cache Hit Optimization · **Status**: ✅ Supported · **What It Solves**: Improves cache hit rates for DeepSeek requests
- **Module**: Vision Proxy · **Status**: ✅ Supported · **What It Solves**: Enables DeepSeek to understand and process images
- **Module**: Web Search · **Status**: ✅ Supported · **What It Solves**: Calls official Web tools through the Anthropic endpoint
- **Module**: 1M Context Window · **Status**: ✅ Supported · **What It Solves**: Enables one-click setup for 1M context
- **Module**: Codex Adaptation · **Status**: ✅ Supported · **What It Solves**: Ensures compatibility with mainstream agent workflows
- **Module**: Claude Code / Desktop Adaptation · **Status**: ✅ Supported · **What It Solves**: Ensures compatibility with mainstream agent workflows

Supports one-click configuration where available. For applications that require manual setup, detailed in-app configuration guides are provided.

Any compatible application is ready to use.

> Detailed configuration guides are available inside each application.

Remote Control Agent via IM Bots - TG / DingTalk / Feishu / Lark / Weixin / WecCom

Tingly Box now supports remote control through popular IM platforms. Interact with your AI agents remotely without direct server access.

**Supported Platforms**

- ✅ Telegram
- ✅ DingTalk
- ✅ Feishu
- ✅ Lark
- ✅ Weixin
- ✅ WeCom

**Quick Setup**

1. Open Web UI like `http://localhost:12580`
2. Navigate to **Remote** section
3. Configure your preferred IM platform bot
4. Start interacting with your agents remotely

**Use Cases**

- Execute tasks and queries from your phone or any device
- Team collaboration with shared agent access
- Monitor and control agents while away from your workstation

![Remote Control Demo](./docs/images/7-remote.png)

OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-tingly-model-token",
    base_url="http://localhost:12580/tingly/openai/v1"
)

response = client.chat.completions.create(
    model="tingly-gpt",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response)
```

Anthropic SDK

```python
from anthropic import Anthropic

client = Anthropic(
    api_key="your-tingly-model-token",
    base_url="http://localhost:12580/tingly/anthropic"
)

response = client.messages.create(
    model="tingly",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)
print(response)
```

> Tingly Box proxies requests transparently for SDKs and CLI tools.

Using OAuth Providers

You can also add OAuth providers (like Claude Code) and use your existing quota in any OpenAI-compatible tool:

```bash
# 1. Add Claude Code via OAuth in Web UI (http://localhost:12580)
# 2. Configure your tool with Tingly Box endpoint
```

Requests route through your OAuth-authorized provider, using your existing Claude Code quota instead of requiring a separate API key.

This works with any tool that supports OpenAI-compatible endpoints: Cherry Studio, VS Code extensions, or custom AI agents.

![OAuth Provider Demo](./docs/images/3-connect-ai.png)

Web Management UI

Launch the web management interface:

```bash
npx tingly-box@latest
```

Then open `http://localhost:12580` in your browser.

![Dashboard](./docs/images/1-dashboard.png)

## Documentation

**[User Manual](./docs/user-manual.md)** – Installation, configuration, and operational guide

**[Guardrails](./docs/guardrails.md)** – Policy-based safety checks, built-in protections, and protected credential masking

**[MCP Web Tools](./docs/mcp-web-tools.md)** – Local stdio MCP server for `web_search` / `web_fetch`

### Prerequisites

### Tool · Version · Install
- **Tool**: Go · **Version**: 1.26+ · **Install**: https://go.dev/doc/install
- **Tool**: Node.js · **Version**: 20+ · **Install**: https://nodejs.org/
- **Tool**: pnpm · **Version**: latest · **Install**: `npm install -g pnpm`
- **Tool**: task · **Version**: latest · **Install**: `go install github.com/go-task/task/v3/cmd/task@latest` or https://taskfile.dev/installation/

> Tip: you can also copy individual shell commands out of `Taskfile.yml` and run them directly if you prefer not to install `task`.

### 1. Clone and init submodules

```bash
git clone https://github.com/tingly-dev/tingly-box.git
cd tingly-box
git submodule update --init --recursive
```

### 2. Frontend development

The frontend is a React + Vite app located in `frontend/`. You can work on it independently of the Go backend.

> **Login token:** the frontend requires an auth token to log in. When the backend starts it prints the full login URL (e.g. `Web UI: http://localhost:12580/login/<token>`). If you need to retrieve it later, run:
> ```bash
> tingly-box token view auth --reveal
> ```

**Mock mode** – no running backend required, uses built-in fixture data:

```bash
task web:mock
# or directly:
cd frontend && pnpm install && pnpm dev:mock
```

Open http://localhost:9245 in your browser. Use the token obtained above to log in.

**Dev mode** – proxies API calls to a local backend (start the backend first, see step 3):

```bash
task web
# or directly:
cd frontend && pnpm install && pnpm dev
```

### 3. Backend development

Run the Go server (hot-reload via `go run`):

```bash
task start
# or directly:
go run ./cli/tingly-box --verbose start --debug --port 12580 --browser=false
```

Open http://localhost:12580 in your browser (serves the last built frontend bundle).

### 4. Full build (frontend + backend binary)

Builds the frontend, embeds it into the binary, then compiles Go:

```bash
task build
```

The output binary is written to `./build/tingly-box`.

### 5. GUI binary (Wails) *(optional)*

> The GUI build is not yet publicly released. Skip this step unless you are specifically working on the desktop app.

```bash
task wails:build
```

### Other useful commands

```bash
task swagger        # Regenerate openapi.json from Go source
task codegen        # Regenerate frontend API client from openapi.json
task go:test        # Run Go unit tests
```

## Support

### Telegram · Wechat
- **Telegram**: ![](https://github.com/user-attachments/assets/56022b70-97da-498f-bf83-822a11668fa7) · **Wechat**: ![](https://github.com/user-attachments/assets/30d24cc5-666c-425a-b8d2-5f353af453de)
- **Telegram**: https://t.me/+V1sqeajw1pYwMzU1 · **Wechat**: tingly-box

## Early Contributors

Special badges are minted to recognize the contributions from following contributors:

  
    
      ![](https://github.com/user-attachments/assets/ee8bfa35-3c19-4ddb-8e2d-cb0416f3f7b7)
    
    
      ![](https://github.com/user-attachments/assets/91d2fed3-158a-4dd9-9f8c-9ac552d4dc22)
    
    
      ![](https://github.com/user-attachments/assets/9e485b5c-dc2d-4d4e-be69-f8559bbb830c)
    
    
      ![](https://github.com/user-attachments/assets/8450f42c-61e4-4cce-8025-95956146fc35)
    
    
      ![](https://github.com/user-attachments/assets/1b216610-6fe3-4567-8066-dbc5249b2cbc)
    
  

## ❤️ Support Tingly Box

If Tingly Box has been useful to you, consider supporting its development.

**Donations are optional.** A ⭐ on GitHub or a contribution is just as appreciated.

### WeChat Pay · Alipay
- **WeChat Pay**: ![WeChat Pay](docs/donation/wechat.jpg) · **Alipay**: ![Alipay](docs/donation/alipay.jpg)