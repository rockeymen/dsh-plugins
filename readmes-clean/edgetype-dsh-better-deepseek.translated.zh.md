#dsh-better-deepseek

DeepSeek Harness 桥接插件，用于 [更好的 DeepSeek](https://github.com/EdgeTypE/better-deepseek) Chrome 扩展集成。通过 `webServer` 提供 HTTP handshake 端点和会话过滤的 SSE 事件流。

## 安装

### 通过 DSH (npm)
```bash
dsh plugin --profile web add -w dsh-better-deepseek
```

或

```bash
npx @deepseek-ai/dsh --profile web add -w dsh-better-deepseek
```

```powershell
irm https://raw.githubusercontent.com/EdgeTypE/dsh-better-deepseek/main/scripts/install.ps1 | iex
``` -->

## 插件

`BetterDeepSeekBridgeService` 在 `ctx.webServer` 上注册 `/api/better-deepseek/*` 端点。

### 端点·方法·目的
- **端点**：`/api/better-deepseek/ping` · **方法**：GET · **目的**：Handshake和健康检查
- **端点**：`/api/better-deepseek/events` · **方法**：GET · **目的**：服务器发送事件（SSE）直播
- **端点**：`/api/better-deepseek/session.create` · **方法**：POST · **目的**：使用cwd初始化代理会话
- **端点**：`/api/better-deepseek/session.prompt` · **方法**：POST · **目的**：向会话提交任务/提示
- **端点**：`/api/better-deepseek/session.result` · **方法**：GET · **目的**：获取最终的 Markdown 报告和状态
- **端点**：`/api/better-deepseek/session.cancel` · **方法**：POST · **目的**：取消正在运行的任务

### 配置 · 默认 · 含义
- **配置**：`enableCors` · **默认**：`true` · **含义**：为跨源浏览器扩展请求启用 Access-Control-Allow-Origin 标头。