# 沙基安全带

AI 代理的本地优先运行时。会话、沙盒工具、内存、
凭证、审计跟踪和内置控制台 - 全部运行在您的
机器或您自己的基础设施中。

```bash
git clone --branch v0.3.1 --depth 1 https://github.com/sandbaseai/sandbase-harness.git
cd sandbase-harness
npm ci
npm run build
mkdir ../my-agents && cd ../my-agents
node ../sandbase-harness/dist/index.js init
node ../sandbase-harness/dist/index.js start
# open http://127.0.0.1:3000/dashboard
```

当您需要的不仅仅是模型循环时，请选择 SandBase Harness：

### 需要 · Harness 提供什么
- **需要**：安全运行生成的代码 · **Harness 提供什么**：本地、Docker、Kubernetes 和自托管工作沙箱
- **需要**：检查长时间运行的代理 · **Harness 提供什么**：持久会话、可恢复事件流、审核和重播
- **需要**：控制工具访问 · **Harness 提供什么**：MCP 工具集、凭证库、权限策略和批准
- **需要**：操作任何模型 · **Harness 提供的**：OpenAI、Anthropic 和 OpenAI 兼容提供商，包括 DeepSeek V4
- **需要**：保留您的基础设施 · **Harness 提供什么**：本地优先的 SQLite 和文件存储，无需托管控制平面

## 为什么

代理 SDK 处理模型循环。生产代理商更需要：坚持
会话、工具治理、沙箱边界、凭证处理、内存、
可审计性，以及供人们检查发生情况的用户界面。 `managed-agents`
是运行时层——不是可视化工作流构建器，也不是另一个模型 SDK。

## 特点

- Claude Managed Agents 风格的 `/v1` API 和本地控制台
- SQLite 支持的代理、会话、环境、凭证库、内存
  存储、文件、技能和 API 密钥 — 默认情况下 SQLite 元数据
- 存储在工作空间状态目录中的本地文件/技能字节
- 用于会话重放和调试的可恢复服务器发送事件
- 通过设置 V2 配置一个活动模型提供者边界
- 沙箱后端：本地进程、Docker（每会话容器）、Kubernetes
  (kubectl exec/cp)，自托管工作队列
- 设置 V2：一个工作区模型供应商、循环引擎、存储、内存、
  沙箱 — 具有验证、表单/JSON 模式和重启流程
- MCP工具集、权限策略、内置工具和技能包
- DeepSeek Harness 通过 MCP stdio 桥接，用于代理、会话、流式轮流、
  伪影和取消
- `managed-agents/sdk` 的 TypeScript SDK
- 释放门：`npm run release:check`

## 截图

### 控制台概述 · 设置 · API 参考
- **控制台概述**： ![概述](docs/assets/dashboard-overview.png) · **设置**： ![设置](docs/assets/dashboard-settings-models.png) · **API 参考**： ![api-ref](docs/assets/dashboard-api-reference.png)

## 要求

- Node.js 22+
- npm 10+
- 模型提供者 API 密钥（OpenAI、Anthropic 或 OpenAI 兼容端点）
- Docker（可选，适用于 Docker 支持的沙箱）

## DeepSeek Harness

作为 DSH 插件运行此项目，而不是将 `dsh-plugin` 视为发现
仅元数据。将捆绑包安装到 DSH 配置文件中，启动 `managed-agents`，
然后启动该配置文件：

```bash
export MANAGED_AGENTS_URL=http://127.0.0.1:3000
dsh plugin --profile web add managed-agents
dsh web
```

该补丁通过 stdio 启动 `managed-agents-mcp`。 DSH 然后可以列出代理，
创建和运行会话，检查结果和工件，并通过以下方式停止工作
原生 `mcp__sandbase__*` 工具。参见
[`examples/deepseek-harness`](examples/deepseek-harness/README.md) 为全
工具列表和经过身份验证的运行时配置。

对 DSH 配置文件、插件组合、工具策略或会话语义不熟悉？的
独立【DeepSeek Harness手册](https://github.com/sandbaseai/deepseek-harness-handbook)
提供基于源代码的快速入门、架构图和故障排除
此集成使用的运行时层。

## 快速入门

```bash
git clone --branch v0.3.1 --depth 1 https://github.com/sandbaseai/sandbase-harness.git
cd sandbase-harness
npm ci
npm run build
mkdir ../my-agents && cd ../my-agents
node ../sandbase-harness/dist/index.js init
node ../sandbase-harness/dist/index.js start
```

打开`http://127.0.0.1:3000/dashboard`，转到**设置>模型**，粘贴您的
API 密钥，然后您就可以运行了。

npm 上无范围的 `managed-agents` 名称不是这个项目。直到一个
官方范围的软件包在此存储库中发布，仅从
标记为 GitHub 的源代码版本如上所示。不要运行 `npx managed-agents` 或
`npm install managed-agents`。

六工具 MCP 桥还具有最小的容器定义。开始
利用 API，从标记的源结帐构建图像，然后添加此
发送至 MCP 客户端的 stdio 命令：

```bash
docker build -f Dockerfile.mcp -t sandbase-harness-mcp:0.3.1 .
docker run --rm -i \
  -e MANAGED_AGENTS_URL=http://host.docker.internal:3000 \
  sandbase-harness-mcp:0.3.1
```

对于经过身份验证的远程运行时，还需传递 `MANAGED_AGENTS_API_KEY`。的
容器镜像仅包含 MCP 桥；代理会话和沙箱工作
保留在连接的 Harness 运行时中。

对于从最新的 `main` 分支进行的开发：

```bash
git clone https://github.com/sandbaseai/sandbase-harness.git
cd sandbase-harness && npm ci && npm run build
cd .. && mkdir my-agents-dev && cd my-agents-dev
node ../sandbase-harness/dist/index.js init
node ../sandbase-harness/dist/index.js start
```

## 工作区布局

```text
my-agents/
├── agents/                  # Seed agent definitions (YAML)
│   └── assistant.yaml
├── skills/                  # Seed skill packages
│   └── example-skill/
│       └── SKILL.md
└── .managed-agents/         # Runtime state (gitignored)
    ├── config.yaml          # Workspace configuration
    ├── data.db              # SQLite metadata
    ├── logs/runtime.log
    ├── files/               # Uploaded file bytes
    ├── skills/              # Uploaded skill packages
    ├── snapshots/           # Session workspace snapshots
    └── sandbox/             # Local session sandboxes
```

## 配置

`.managed-agents/config.yaml`：

```yaml
model:
  provider: openai
  api_key: ${OPENAI_API_KEY}

storage:
  metadata: { provider: sqlite, options: {} }
  artifacts: { provider: local, options: { base_path: files } }
```

代理选择具体型号 ID（`gpt-4o`、`claude-sonnet-4-20250514`、
`openai/gpt-5.5`）。工作区配置仅说明如何访问模型
服务。

对于 DeepSeek V4 Pro/Flash 配置，包括最大推理工作，
参见[DeepSeek V4](docs/deepseek-v4.md)。

## 命令行界面

```bash
managed-agents init
managed-agents start [--host 127.0.0.1] [--port 3000]
managed-agents list
managed-agents reload
managed-agents chat <agent-id> --message "hello"
managed-agents template list | install <name> | create <name>
```

## API 示例

创建代理：

```bash
curl -X POST http://127.0.0.1:3000/v1/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incident commander",
    "model": "gpt-4o",
    "system": "You are an on-call incident commander.",
    "tools": [{ "type": "agent_toolset_20260401" }]
  }'
```

创建环境（本地沙箱）：

```bash
curl -X POST http://127.0.0.1:3000/v1/environments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Default local",
    "config": { "hosting_type": "local", "sandbox_provider": "local" }
  }'
```

创建 Docker 隔离的环境：

```bash
curl -X POST http://127.0.0.1:3000/v1/environments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Docker sandbox",
    "config": {
      "sandbox_provider": "docker",
      "image": "node:22-slim",
      "resources": { "memory": "1g", "cpu": 1 }
    }
  }'
```

开始会话：

```bash
curl -X POST http://127.0.0.1:3000/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "agent_...",
    "environment_id": "env_...",
    "title": "Triage SENTRY-123"
  }'
```

发送消息：

```bash
curl -X POST http://127.0.0.1:3000/v1/sessions/SESSION_ID/messages \
  -H "Content-Type: application/json" \
  -d '{ "content": "Investigate the alert." }'
```

恢复事件流：

```bash
curl -N http://127.0.0.1:3000/v1/sessions/SESSION_ID/events/stream \
  -H "Last-Event-ID: 42"
```

## SDK

```typescript
import { ManagedAgentsClient } from 'managed-agents/sdk';

const client = new ManagedAgentsClient({
  baseUrl: 'http://127.0.0.1:3000',
});

const session = await client.sessions.create({
  agent: 'agent_...',
  environment_id: 'env_...',
});

for await (const event of client.sessions.chat(session.id, 'Hello')) {
  if (event.type === 'agent.message_chunk') {
    process.stdout.write(event.delta ?? '');
  }
}
```

`/v1` API 遵循 Claude Managed Agents 资源形状，因此您还可以
将 Anthropic SDK 指向本地运行时：

``打字稿
从“@anthropic-ai/sdk”导入 Anthropic；

const 客户端 = new Anthropic({
  apiKey: process.env.MANAGED_AGENTS_API_KEY ?? '本地开发密钥',
  基本 URL: 'http://