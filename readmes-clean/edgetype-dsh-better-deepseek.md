# dsh-better-deepseek

DeepSeek Harness bridge plugin for [Better DeepSeek](https://github.com/EdgeTypE/better-deepseek) Chrome extension integration. Provides an HTTP handshake endpoint and session-filtered SSE event streams over `webServer`.

## Installation

### Via DSH (npm)
```bash
dsh plugin --profile web add -w dsh-better-deepseek
```

or

```bash
npx @deepseek-ai/dsh --profile web add -w dsh-better-deepseek
```

```powershell
irm https://raw.githubusercontent.com/EdgeTypE/dsh-better-deepseek/main/scripts/install.ps1 | iex
``` -->

## Plugin

`BetterDeepSeekBridgeService` registers `/api/better-deepseek/*` endpoints on `ctx.webServer`.

### Endpoint · Method · Purpose
- **Endpoint**: `/api/better-deepseek/ping` · **Method**: GET · **Purpose**: Handshake and health check
- **Endpoint**: `/api/better-deepseek/events` · **Method**: GET · **Purpose**: Server-Sent Events (SSE) live stream
- **Endpoint**: `/api/better-deepseek/session.create` · **Method**: POST · **Purpose**: Initialize an agent session with cwd
- **Endpoint**: `/api/better-deepseek/session.prompt` · **Method**: POST · **Purpose**: Submit a task/prompt to the session
- **Endpoint**: `/api/better-deepseek/session.result` · **Method**: GET · **Purpose**: Fetch final Markdown report and status
- **Endpoint**: `/api/better-deepseek/session.cancel` · **Method**: POST · **Purpose**: Cancel a running task

### Config · Default · Meaning
- **Config**: `enableCors` · **Default**: `true` · **Meaning**: Enables Access-Control-Allow-Origin headers for cross-origin browser extension requests.