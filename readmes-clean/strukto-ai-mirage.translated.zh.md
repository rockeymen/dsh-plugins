![Mirage：AI Agent 的统一虚拟文件系统](assets/mirage-og-light@2x.png)

Mirage 是**一种用于 AI 代理的统一虚拟文件系统**：它将 S3、Google Drive、Slack、Gmail 和 Redis 等服务和数据源并排安装为一个文件系统。任何已经了解 bash 的法学硕士都可以开箱即用地读取、grep 和通过管道传输每个后端，并且新词汇量为零。

```python
ws = Workspace(
    {
        "/tmp":   (RAMResource(), MountMode.EXEC),
        "/redis": (RedisResource(url=redis_url), MountMode.WRITE),
        "/slack": (SlackResource(SlackConfig(token=slack_bot_token)), MountMode.EXEC),
    },
    # monty captures python, so scripts run sandboxed inside the workspace
    runtimes=[MontyRuntime(captures=["python", "python3"]), "vfs"],
)

# one grep sweeps every source
await ws.execute("grep -rln session /redis /tmp")

# run a script that lives in Slack, file the report into Redis
await ws.execute(
    "python3 /slack/channels/general__C0.../files/example__F0....py > /redis/report.txt"
)

# install a typed CLI under a head word: dispatched by name, not by path,
# and discoverable through `man`, `type` and `which` like any other program
ws.register_cli("slack", SLACK, {"token": slack_bot_token})
await ws.execute('slack send-message --channel general --text "report is up"')
```

## 关于

- **一个接口，而不是 N 个 SDK 和 M 个 MCP。** 每个服务都使用相同的文件系统语义，管道跨服务组成就像在本地磁盘上一样自然。
- **大约 50 个内置后端：** RAM、Disk、Redis、S3 / R2 / OCI / Supabase / GCS、Gmail / GDrive / GDocs / GSheets / GSlides、GitHub / Linear / Notion / Trello、Slack / Discord / Email、MongoDB / GridFS / Postgres / LanceDB / Qdrant、SSH 等并排安装在单个后端下根。
- **便携式工作区：** 克隆、快照和版本化工作区；代理运行在机器之间移动，无需重新启动或重新配置系统。
- **可嵌入：** Python 和 TypeScript SDK 在 FastAPI、Express、浏览器应用程序或任何异步运行时内运行；不需要单独的过程。
- **代理集成：** OpenAI Agents SDK、Vercel AI SDK、LangChain、Pydantic AI、CAMEL 和 OpenHands 通过 SDK；通过本机适配器、可安装插件、MCP 或 FUSE 进行编码代理。

## 架构



    ![Mirage 架构：AI 代理和应用程序 → Mirage Bash 和 VFS → 调度程序和缓存 → 基础设施和远程](assets/mirage-arch-light.svg)


## 安装

- `mirage-ai` 包和 `mirage` CLI 的 **Python** ≥ 3.11
- 对于 TypeScript SDK，**Node.js** ≥ 20
- **macOS** 或 **Linux**（基于 FUSE 的安装需要平台支持）

###Python

```bash
uv add mirage-ai    # installs the `mirage` library and the `mirage` CLI binary
```

### 打字稿

```bash
npm install @struktoai/mirage-node      # Node.js servers and CLIs
npm install @struktoai/mirage-browser   # browser / edge runtimes
npm install @struktoai/mirage-agents    # OpenAI / Vercel AI / LangChain / Mastra adapters
```

两个运行时包都会自动引入 `@struktoai/mirage-core`。

### 命令行界面

```bash
curl -fsSL https://strukto.ai/mirage/install.sh | sh
# or
npm install -g @struktoai/mirage-cli
# or
uvx mirage-ai
# or
npx @struktoai/mirage-cli
```

## 快速入门

###Python

```python
from mirage import Workspace
from mirage.resource.ram import RAMResource
from mirage.resource.s3 import S3Config, S3Resource

ws = Workspace({
    "/data": RAMResource(),
    "/s3":   S3Resource(S3Config(bucket="my-bucket")),
})

await ws.execute("cp /s3/report.csv /data/report.csv")
await ws.execute("grep alert /s3/data/log.jsonl | wc -l")

await ws.snapshot("demo.tar")
```

### 打字稿

```ts
import { Workspace, RAMResource, S3Resource } from '@struktoai/mirage-node'

const ws = new Workspace({
  '/data': new RAMResource(),
  '/s3':   new S3Resource({ bucket: 'my-bucket' }),
})

await ws.execute('cp /s3/report.csv /data/report.csv')
await ws.execute('grep alert /s3/data/log.jsonl | wc -l')

await ws.snapshot('demo.tar')
```

### 命令行界面

```bash
mirage workspace create ws.yaml --id demo
mirage execute   --workspace_id demo --command "cp /s3/report.csv /data/report.csv"
mirage provision --workspace_id demo --command "cat /s3/data/large.jsonl"
mirage workspace snapshot demo demo.tar
mirage workspace load demo.tar --id demo-restored
```

## 代理框架

Mirage 作为沙箱或工具层插入代理框架。 POSIX 操作（例如 `read`）也可以根据资源和文件类型进行自定义：Mirage 不附带文件类型渲染器，因此无论您如何注册它，都会呈现一种格式，并且为一个资源和扩展注册的命令胜过通用资源和扩展。

### · 集成
- Python · **集成**：[OpenAI Agents SDK](https://docs.mirage.strukto.ai/python/agents/openai-agents)、[LangChain](https://docs.mirage.strukto.ai/python/agents/langchain)、[Pydantic AI](https://docs.mirage.strukto.ai/python/agents/pydantic-ai)、[CAMEL](https://docs.mirage.strukto.ai/python/agents/camel)、[OpenHands](https://docs.mirage.strukto.ai/python/agents/openhands)、[Agno](https://docs.mirage.strukto.ai/python/agents/agno)]
- TypeScript · **集成**：[Vercel AI SDK](https://docs.mirage.strukto.ai/typescript/agents/vercel)、[OpenAI 代理 SDK](https://docs.mirage.strukto.ai/typescript/agents/openai)、[LangChain](https://docs.mirage.strukto.ai/typescript/agents/langchain)、[Mastra](https://docs.mirage.strukto.ai/typescript/agents/mastra)]
- 编码代理 · **集成**：[Claude Code](https://docs.mirage.strukto.ai/python/agents/claude-code)、[Codex](https://docs.mirage.strukto.ai/typescript/agents/codex)、[DeepSeek Harness](https://docs.mirage.strukto.ai/typescript/agents/dsh)、[Grok Build](https://docs.mirage.strukto.ai/typescript/agents/grok-build)、[OpenCode](https://docs.mirage.strukto.ai/typescript/agents/opencode)、[Pi](https://docs.mirage.strukto.ai/typescript/agents/pi)]

## 缓存

每个 `Workspace` 都有一个两层缓存，因此对远程后端的重复工作会影响本地状态而不是网络：

- **索引缓存：**列表和元数据。第一个目录遍历访问 API；后面的服务从索引中提供，直到 TTL 过期（默认 10 分钟）。
- **文件缓存：**对象字节。第一个从原点读取流；稍后的管道从缓存中读取（默认 512 MB）。

两层均默认使用零设置的进程内 RAM。 Redis 存储在工作进程、进程和机器之间共享缓存状态：

```ts
import { RedisFileCacheStore, S3Resource, Workspace } from '@struktoai/mirage-node'

const ws = new Workspace(
  { '/s3': new S3Resource({ bucket: 'my-bucket' }) },
  {
    cache: new RedisFileCacheStore({ url: 'redis://localhost:6379/0', cacheLimit: '8GB' }),
    index: { type: 'redis', url: 'redis://localhost:6379/0', ttl: 600 },
  },
)
```

有关完整的未命中/命中生命周期，请参阅[缓存文档](https://docs.mirage.strukto.ai/home/cache)。