# 新闻代理

News Agent 是一种本地个人新闻服务。它将 RSS 提要、黑客新闻和内置信号源收集到一个评分新闻池中，添加 GitHub 趋势摘要，并使用 OpenAI 兼容的 LLM 进行排名、总结并交付给飞书或 Discord。

它可以在 macOS、Windows 和 Linux 上运行。本地 Web 控制台、HTTP API 和 stdio MCP 服务器都管理相同的配置和作业。

![新闻代理概述](resources/description.jpg)

## 特点

- 将 RSS feed、黑客新闻、Product Hunt、Reddit、App Store 新应用、V2EX、36Kr、Sspai、OSChina、Jike 主题和其他内置来源聚合到一个新闻池中，并生成 GitHub 趋势。
- 使用法学硕士对内容进行排名、过滤、重复数据删除和总结。
- 从 Web 控制台、API 或 MCP 添加、更新、验证和删除 RSS 源。
- 设置兴趣、排除、来源重量、交付时间和物品限制。
- 运行计划的提取和交付，或手动触发它们。
- 传送到飞书、Discord 或自定义 HTTP 端点。
- 将配置、日志和作业历史记录保存在本地用户数据目录中。
- 默认绑定本地控制平面到`127.0.0.1:12301`。

## 要求

- macOS、Windows 或 Linux
- [uv](https://docs.astral.sh/uv/)
- OpenAI 聊天、OpenAI 响应或人择消息端点的 API 密钥

如果 `uv` 尚不可用，macOS、Linux 和 Windows 的安装程序脚本将自动为当前用户安装 `uv`。

## 安装

您可以使用单个终端命令安装 News Agent，而无需先进行克隆：

Mac OS 或 Linux：

```bash
curl -fsSL https://raw.githubusercontent.com/huawolf/news-agent/main/scripts/install.sh | bash
```

Windows PowerShell：

```powershell
iwr -useb https://raw.githubusercontent.com/huawolf/news-agent/main/scripts/install.ps1 | iex
```

安装程序从 `.env.example` 创建 `.env`，安装锁定的运行时依赖项，注册每用户登录服务，然后重新启动该服务，以便重复安装立即运行更新的代码。安装后打开<http://127.0.0.1:12301>。

## 配置

### 默认客户端模式

普通用户默认以`client`模式运行。共享服务器获取并
对公共源目录进行一次评分；每个客户端都会提取过去 24 小时的
已处理的条目评分至少为 60 加上最新成功的 GitHub 摘要，仅添加和评分
它的私人定制 RSS 源，然后使用它自己的偏好、时间表、语言，
项目限制、LLM 以及用于选择、汇总和发送摘要的交付渠道。

默认连接是：

```json
"mode_settings": {
  "mode": "client",
  "server_url": "http://13.158.182.33:12301",
  "server_api_token_name": "processednews"
}
```

`processednews` 是共享新闻 API 值，不保护本地
配置页面。 `NEWS_AGENT_LOCAL_TOKEN` 是一个单独的、可选的私有
仅由本地 Web/配置 API 使用的密码。切勿将其替换为
另一个。

本地页面在可选本地控制规则下读取 `/api/news-sources`。
远程客户端读取`/api/server/sources`和`processednews`；这些是
单独的端点，因此未设置的 `NEWS_AGENT_LOCAL_TOKEN` 永远不会导致本地
请求共享新闻身份验证的页面。

运行共享服务的运营商采用`mix`模式。混合模式执行
服务器获取/评分工作，保留滚动的 24 小时内存缓存，公开
共享新闻端点，还可以运行自己的交付工作流程。手册
和计划运行都处理完整启用的源集和 GitHub；交货
时间表仅控制时间和最终新闻计数。
没有 `mode_settings` 的配置接收相同的常规用户 `client`
默认值。仅针对自承载操作显式设置 `standalone` 或 `mix`。

在中配置模型、端点、协议、API 密钥和交付 Webhooks
本地 Web 控制台的 **模型和交付设置** 部分。田野
自动保存并可就地测试模型连接。保留
控制台私有，因为它显示配置的秘密值。

秘密存储在`.env`中。模型设置、偏好和交付
时间表通过经过验证的本地 API 存储在 `config.json` 中。法学硕士
`.env`中的关键变量必须匹配`llm.apiKeyName`；默认配置
使用`DEEPSEEK_API_KEY`。

```dotenv
DEEPSEEK_API_KEY=your_llm_api_key
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/...
# DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

当使用另一个关键变量时，例如 `OPENAI_API_KEY` 或
`ANTHROPIC_API_KEY`，通过本地API将`llm.apiKeyName`设置为同名。
直接编辑`.env`后，从项目目录重启服务：

```bash
uv run news-agent service restart
```

第一个服务启动创建了 `config.json`
[config.json.example](config.json.example)。使用 Web 控制台或本地 API
管理模型设置、提要、首选项和计划，而不是替换
活动配置文件。

可选的源集成也可以使用 `.env` 凭证。产品搜寻，
例如，在配置时使用 `PH_TOKEN` 并回退到其公共源
当令牌不存在时。

重要设置：

- `preferences`：兴趣、排除、源权重、语言偏好和多样性限制。
- `llm`：模型、端点、API 密钥环境变量和协议。网络
  控制台检测 OpenAI 聊天完成、OpenAI 响应或 Anthropic
  来自端点和型号名称的消息，允许手动覆盖，并且可以
  保存并测试当前连接。
- `sections.signals`：内置信号适配器，用于 Product Hunt、Reddit 后备、GitHub 变体、V2EX、RSSHub 主题、App Store 区域和国内 RSS 源。
- `schedule.fetch_lookback_minutes`：获取回溯窗口；默认为 1440 分钟，因此内置信号仅保留最近 24 小时，除了 GitHub 趋势等每日排名页面。
- `log.retention_days`：每日保留的日志目录数量；默认为 30 天。
- `delivery.schedules`：cron 时间表和每次交付的统一新闻 `max_items` 限制。每次运行都会处理完整的新闻源池和GitHub；来源不是按照时间表选择的。
  如果没有明确的时间表，送货默认为每天 10:00 和 20:00，
  每次最多 10 条新闻。
- `delivery.immediate`：高分预警阈值和每日限额。
- `mode_settings`：选择 `standalone`、`mix` 或 `client`。客户端部署
  从 `server_url` 读取 `score >= 60` 的预评分条目；混合部署还暴露了
  滚动共享新闻 API。 `server_api_token_name`承载共享API值
  `processednews`；与`NEWS_AGENT_LOCAL_TOKEN`无关。
- `push`：启用飞书、Discord 或自定义端点。

## 运行

所有命令均使用 `uv run news-agent`：

```bash
uv sync                         # Install development dependencies
uv run news-agent check         # Check LLM connectivity
uv run news-agent fetch         # Fetch and score once
uv run news-agent push          # Generate and send one digest
uv run news-agent serve         # Run the local web/API service
uv run news-agent mcp           # Run the stdio MCP server
uv run news-agent service status
```

`serve` 命令启动内置调度程序和本地 API <http://127.0.0.1:12301>. 交互式 API 文档可在 <http://127.0.0.1:12301/docs>.

共享混合服务器必须侦听其客户端可访问的接口，以便
示例：

```bash
uv run news-agent serve --host 0.0.0.0 --port 12301
```

在公开混合服务器之前，为其设置一个私有 `NEWS_AGENT_LOCAL_TOKEN`
管理API。客户端仍然仅使用 `processednews` 来读取共享新闻。

要删除登录服务而不删除数据：

```bash
./scripts/uninstall.sh
```

在 Windows 上：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\uninstall.ps1
```

## 本地API和MCP

本地API支持配置、来源、交付、作业和日志操作。
在`.env`中设置`NEWS_AGENT_LOCAL_TOKEN`来保护这些本地管理
请求。它不是共享服务器值 `processednews` 并且从未使用过
用于客户端到服务器的新闻检索。

MCP 服务器适用于本地代理进程：

```json
{
  "command": "uv",
  "args": ["run", "news-agent", "mcp"],
  "cwd": "/path/to/news-agent"
}
```

可用的 MCP 工具包括源管理、首选项和计划更新、手动获取/推送作业、摘要预览、作业状态和最近的日志。 `run_push` 需要明确确认。

执行安装或初始配置的 AI 代理应遵循
【新闻特工技能](SKILL.md)。它定义了
用于秘密处理、API 配置、服务重启的非浏览器工作流程，
健康检查、模型测试、预览和确认交付。

## 数据和日志

运行时数据默认存储在项目目录中：

### 类型·目录
- **类型**：新闻数据 · **目录**：`news-data/`
- **类型**：日志·**目录**：`logs/`