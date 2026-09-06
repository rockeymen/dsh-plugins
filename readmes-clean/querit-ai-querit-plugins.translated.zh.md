#querit-plugins

适用于自动化和 AI 代理平台的官方 [Querit](https://www.querit.ai) 搜索集成。

[Querit](https://www.querit.ai) 为 LLM 申请提供实时、权威的网络搜索结果和干净的页面内容。此存储库中的每个集成都将一个平台连接到 Querit API (`/v1/search` + `/v1/contents`)，以进行实时 Web 搜索和页面获取 - 具有引用的来源、域/区域/语言/时间范围过滤器以及始终被视为不受信任的 Web 数据的输出。

### 平台·软件包·安装
- **平台**：[Pi](https://github.com/earendil-works/pi) · **软件包**：`pi-querit` · **安装**：`pi install npm:pi-querit`
- **平台**：[DeepSeek Harness](https://www.npmjs.com/package/@deepseek-ai/cordis) · **软件包**：`dsh-querit` · **安装**：`dsh plugin --profile web add dsh-querit`
- **平台**：[OpenCode](https://opencode.ai) · **软件包**：`opencode-querit` · **安装**：`"plugin": ["opencode-querit"]`
- **平台**：[Claude Code](https://code.claude.com/docs/en/plugins) · **软件包**：`claude-code-querit` · **安装**：`/plugin marketplace add querit-ai/querit-plugins`
- **平台**：[n8n](https://n8n.io) · **软件包**：`n8n-nodes-querit` · **安装**：作为n8n社区节点安装

此存储库中还有另外两个集成，但尚未普遍可用：

### 平台·目录·状态
- **平台**：[Zapier](https://zapier.com) · **目录**：`zapier-querit/` · **状态**：完整且经过本地验证；等待注册和 Zapier 公众审查
- **平台**：[Browserbase](https://www.browserbase.com) · **目录**：`browserbase-querit-demo/` · **状态**：参考演示，不是发布的包

每个集成如何读取 API 密钥和搜索默认值将在下面的相应部分中介绍。

## 获取 API 密钥

注册 [Querit.ai](https://www.querit.ai) 即可获取 API 密钥，**每月可进行 1,000 次免费 API 调用** — 无需信用卡。相同的密钥适用于所有集成。

## pi-querit — Pi

将 `web_search` 和 `fetch_content` 注册为一流工具的 Pi 扩展。每当答案需要实时网络时，您的代理就会自动呼叫他们。

**安装**

```bash
pi install npm:pi-querit
```

**API 密钥**

在 Pi 中运行一次交互式设置向导：

```text
/querit-setup
```

该向导会验证密钥，然后让您配置持久搜索默认值（结果计数、时间范围、国家/地区、语言、域白名单/黑名单）和可选的固定模型自动摘要工作流程。除了 API 密钥之外的所有内容都可以跳过。

- **密钥所在位置：** `~/.pi/agent/querit-search.json`（尊重 `PI_CODING_AGENT_DIR`），在 POSIX 上使用 `0600` 模式编写。
- **CI / 临时替代方案：** 设置 `QUERIT_API_KEY` 环境变量。当两者都存在时，环境变量优先。
- **切勿将密钥放入聊天或日志中：**扩展程序会屏蔽密钥输入并从每个错误表面编辑密钥。

请参阅 [pi-querit README](./pi-querit/README.md) 以获取完整的工具参考。

## dsh-querit — DeepSeek Harness

DeepSeek Harness `ctx.web` 功能接缝的提供程序包。它不注册面向模型的`web_search`工具；代理预设可以。默认情况下，它重用官方 `applyWebFetchTool` 帮助程序来注册 `web_fetch`，并通过 Querit 支持的提供程序路由这两个工具。

**安装**

```bash
dsh plugin --profile web add dsh-querit
```

然后将其连接到配置文件的 `cordis.patch.yml` 中：

```yaml
- insert:
    - id: web-search-querit
      name: 'dsh-querit'
      config:
        apiKeyEnv: QUERIT_API_KEY
- id: web
  config:
    searchProvider: querit
    fetchProvider: querit
```

**API 密钥** — 按优先级顺序解析每个操作：

1. 在启动环境中导出`QUERIT_API_KEY`，或者
2. 凭证存储 `$DSH_HOME/.credentials.yaml`（`QUERIT_API_KEY: <key>`，热重载），或者
3. `web-search-querit` 行上的文字 `apiKey`（最不推荐的 — 秘密不应存在于组合文件中）。

搜索默认值（`count`、`timeRange`、`countries`、`languages`、`includeDomains`、`excludeDomains`、`includeContent`、`chunksPerDoc`、获取格式/超时）在插件行或热重载的 `$DSH_HOME/settings.yaml` `web-search-querit:` 部分中配置。

有关完整的配置表，请参阅 [dsh-querit README](./dsh-querit/README.md)]。

## opencode-querit — OpenCode

一个 OpenCode 插件，将 `web_search` 和 `web_fetch` 注册为内置工具旁边的自定义工具。附加：OpenCode 自己的 `websearch`/`webfetch` 保持可用。

**安装**

将插件添加到`opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-querit"]
}
```

然后重新启动 OpenCode。

**API 密钥** — 按优先级顺序解析每个工具调用：

1. `QUERIT_API_KEY` 环境变量（默认；通过 `apiKeyEnv` 重命名），或者
2. 插件选项元组中的 `apiKey` （最不推荐的 — 秘密不应存在于配置文件中）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    ["opencode-querit", { "count": 8, "timeRange": "m3", "languages": ["english"] }]
  ]
}
```

搜索默认值和获取行为的配置方式相同（`count`、`timeRange`、`countries`、`languages`、`includeDomains`、`excludeDomains`、`includeContent`、`chunksPerDoc`、`fetchFormat`、`fetchCrawlTimeout`、`fetchMaxChars`、`maxOutputChars`）。

请参阅 [opencode-querit README](./opencode-querit/README.md) 以获取完整的配置表和本地测试说明。

## 克劳德代码查询 — Claude Code

一个 Claude Code 插件，捆绑了一个 stdio MCP 服务器，公开了 `web_search` 和 `fetch_content`，以及用于基于来源的答案和引用的 `/querit-ai:research` 技能。

**安装**

```text
/plugin marketplace add querit-ai/querit-plugins
/plugin install querit-ai@querit
```

**API key** - 插件仅读取 `QUERIT_API_KEY` 环境变量，MCP 服务器进程从启动 Claude Code 的环境继承该变量。故意没有产品内密钥选项：一个变量涵盖本地开发、CI 和 UI 安装。

- **永远不要**将密钥放在 `.mcp.json`、源文件、shell 历史记录、聊天或日志中。工具错误在克劳德看到活动密钥之前对其进行了编辑。

当未设置所需选项时，Claude Code 不会启动插件的 MCP 服务器，因此在期望 Querit 工具出现在 `/mcp` 中之前配置 `api_key`。

有关完整的工具参考和安全限制，请参阅 [claude-code-querit README](./claude-code-querit/README.md)。

## n8n-nodes-querit — n8n

一个 n8n 社区节点，具有 **搜索 Web** 和 **获取内容** 操作、本机配对项和 `Continue On Fail` 处理以及 AI 工具支持。

通过 n8n 的社区节点界面安装 `n8n-nodes-querit`，然后创建 **Querit API** 凭证并粘贴 API 密钥。 n8n 将其存储为加密凭证；节点永远不会将其写入工作流 JSON 或执行数据。操作细节和开发说明请参见【n8n-nodes-querit README](./n8n-nodes-querit/README.md)】。

## zapier-querit — Zapier

Zapier 平台 CLI 与一个搜索操作集成，**查找 Web 搜索结果**。身份验证是一种屏蔽的自定义 API 密钥字段，使用固定的单一结果 `POST /v1/search` 进行测试。

该集成尚未发布到 Zapier 的应用程序目录中。注册、私试推送、公开审核都需要公司自有的Zapier开发者账号； [zapier-querit README](./zapier-querit/README.md) 包含完整的切换清单。

## browserbase-querit-demo — Browserbase

参考演示，而不是可安装的包：它使用 Querit 进行搜索，然后通过 Playwright `connectOverCDP` 在 Browserbase 云浏览器中打开顶部结果，并保存屏幕截图作为证据。它在环境中同时需要 `QUERIT_API_KEY` 和 `BROWSERBASE_API_KEY`，并且故意不读取 `.env` 文件。请参阅 [browserbase-querit-demo README](./browserbase-querit-demo/README.md)。

## 存储库布局

每个目录都是一个独立的npm包，有自己的版本、CI和
发布周期。没有根工作区：集成具有独立的
依赖树，因此每个包都保留自己的 `package.json`，
锁定文件和 `node_modules`。

```text
querit-plugins/
├── .claude-plugin/            # Claude Code marketplace catalog
├── pi-querit/                 # Pi extension (TypeScript, no build step)
├── dsh-querit/                # DeepSeek Harness provider package (compiled lib/ committed)
├── opencode-querit/           # OpenCode plugin (compiled lib/ committed)
├── claude-code-querit/        # Claude Code plugin (installable payload in plugin/)
├── n8n-nodes-querit/          # n8n community node (compiled for publishing)
├── zapier-querit/             # Zapier CLI integration (not published)
└── browserbase-querit-demo/   # Browserbase reference demo (not published)
```

## 发展

在包目录中工作； root 没有 sc