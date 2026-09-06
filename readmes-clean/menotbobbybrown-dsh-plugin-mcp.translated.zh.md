#dsh-plugin-mcp

> **适用于 DeepSeek Harness (`dsh`) 的通用模型上下文协议 (MCP) 桥接插件**

`dsh-plugin-mcp` 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的官方标准插件，可将您的 DeepSeek 代理无缝连接到 [模型上下文协议 (MCP)](https://modelcontextprotocol.io) 服务器的整个生态系统，并具有完整的 Claude Code 级功能奇偶校验。

请参阅我们完整的 [ROADMAP.md](ROADMAP.md)，了解当前功能和即将到来的里程碑。

## 特点

- 🔌 **通用 MCP 支持**：在 `stdio`、`sse` 或 `websocket` 上运行任何 MCP 服务器。
- 🚀 **10,000+ 服务器规模引擎**：默认休眠进程池，具有 JIT 工作激活和 LRU 空闲进程收割机（即使有 10k 服务器，也保持 <100MB RAM）。
- ⚡ **亚毫秒级 BM25 倒排索引**：在 <0.5 毫秒内评估数千台服务器上的 20,000 多个工具定义。
- 🎯 **动态代币预算分配器**：严格的上下文窗口上限（例如最多 1,500 个代币）以及渐进式模式披露。
- 💾 **两层架构缓存 (L1/L2)**：即时内存缓存 + 磁盘快照消除了 `tools/list` handshake 启动延迟。
- 📊 **企业遥测**：高分辨率 p50、p95 和 p99 工具延迟直方图和指标。
- 📁 **多范围配置**：自动加载用户全局（`~/.dsh/mcp.json`）、项目本地（`.dsh/mcp.json`）和配置文件级别配置。
- 🛡️ **执行权限**：针对工具安全的细粒度 `allow`、`ask` 和 `deny` 权限规则。
- 🔒 **企业安全引擎**：自动秘密编辑（API 密钥/不记名令牌）、命令注入防护和路径遍历防御。
- 🚦 **断路器和速率限制**：容错可防止故障服务器上的失控循环和令牌配额耗尽。
- 📜 **安全审核日志记录**：所有工具调用、权限判定和安全事件的结构化 JSON 日志记录。
- 🔍 **语义工具搜索**：TF-IDF 标记相关性评分确保仅将相关工具注入提示上下文中。
- 🗜️ **Context Spillover Guard**：截断大量输出（>30k 字符）并将其存储为具有结构化预览的本地工件。
- 🛠️ **自动工具桥接**：通过 JSON 架构验证将 MCP 工具动态注册到 DSH 工具注册表中。
- 📂 **资源和提示桥**：将 MCP 资源和提示模板直接公开到代理上下文中。
- ⚡ **弹性执行**：独立的服务器生命周期、每个服务器的超时控制和非阻塞错误处理。
- 🏷️ **干净的命名空间**：自动工具名称前缀（`github_create_issue`、`postgres_query`）以避免跨服务器的名称冲突。
- 🧩 **Cordis Native**：直接构建在 Cordis 生命周期挂钩（`ctx.provide`、`ctx.on('ready')`、`ctx.on('dispose')`）上。

## ⚡ 1 行 Docker 快速入门

使用 1 个命令启动 DeepSeek Harness + MCP 桥 + PostgreSQL + 文件系统：

```bash
# Clone and boot the complete stack
git clone https://github.com/menotbobbybrown/dsh-plugin-mcp.git
cd dsh-plugin-mcp

# On Linux/macOS:
./scripts/quickstart.sh

# On Windows PowerShell:
.\scripts\quickstart.ps1
```

## 安装

### 在 DeepSeek Harness (`dsh`)

```bash
# Add from GitHub
dsh plugin --profile web add "github:menotbobbybrown/dsh-plugin-mcp"

# Or install via npm
dsh plugin --profile web add dsh-plugin-mcp
```

## 💻 CLI 命令 (`dsh-mcp`)

就像Claude Code一样，从终端无缝管理MCP服务器：

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

## 配置

将插件添加到您的 `dsh.config.yaml`：

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

## 编程使用（Cordis API）

``打字稿
从“cordis”导入{上下文}；
从“dsh-plugin-mcp”导入 * 作为 McpPlugin；

const ctx = new Context();

ctx.plugin(McpPlugin, {
  服务器：{
    github：{
      命令：'npx'，
      args: ['-y', '@modelcontextprotocol/server-github'],
    },
  },
});

// 访问注册的MCP工具和服务
const 工具 = 等待 ctx.mcp.getAllTools();
const statuses = ctx.mcp.getStatuses();
```

## Development & Testing

```bash
# 安装依赖项
npm 安装

# 运行单元测试
npm测试

# 构建包
npm 运行构建
````