# Upstash 代理 Skills

skills 的集合，用于与 Upstash SDK 配合使用的 AI 编码代理。 Skills 是扩展代理功能的打包指令和资源。

此存储库可用作 [Agent Skills](https://agentskills.io/) 存储库、[Claude Code 插件](https://code.claude.com/docs/en/plugins)、[光标插件](https://cursor.com/docs/plugins)]、[OpenAI Codex 插件](https://developers.openai.com/codex/plugins/build) 和 [DeepSeek Harness 捆绑包](https://github.com/deepseek-ai/deepseek-harness)]。

## 可用 Skills

### 技能·描述
- **技能**：[upstash](skills/upstash/) · **描述**：涵盖所有 Upstash SDK 的组合技能。
- **技能**：[upstash-box-js](skills/upstash-box-js/) · **描述**：带有 AI 代理、shell、文件系统和 git 的沙盒云容器。
- **技能**：[upstash-qstash-js](skills/upstash-qstash-js/) · **描述**：通过 HTTP 端点进行无服务器消息传递和调度。
- **技能**：[upstash-ratelimit-js](skills/upstash-ratelimit-js/) · **描述**：使用 Redis Rate Limit TypeScript SDK 进行速率限制。
- **技能**：[upstash-redis-js](skills/upstash-redis-js/) · **描述**：Serverless Redis — 缓存、会话、排行榜、全文搜索。
- **技能**：[upstash-search-js](skills/upstash-search-js/) · **描述**：全文搜索快速入门、核心概念和 TypeScript SDK。
- **技能**：[upstash-vector-js](skills/upstash-vector-js/) · **描述**：矢量数据库功能、SDK 使用和框架集成。
- **技能**：[upstash-workflow-js](skills/upstash-workflow-js/) · **描述**：持久工作流程 - 定义、触发和管理多步骤流程。

## 安装

### Claude Code 插件

```bash
# Add the marketplace
/plugin marketplace add upstash/skills

# Install the plugin
/plugin install upstash@upstash
```

### 光标插件

我们正在等待这个插件被官方接受
[光标市场](https://cursor.com/marketplace)。列出后即可安装
从光标侧栏中的**自定义**。

### OpenAI Codex 插件

```bash
# Add the marketplace
codex plugin marketplace add upstash/skills

# Install the plugin
codex plugin add upstash@upstash
```

### Context7 CLI

```bash
npx ctx7 skills install upstash/skills
```

### 代理Skills CLI

```bash
npx skills add upstash/skills
```

### DeepSeek Harness

一步安装 skills **和** [Upstash MCP 服务器](#mcp-server)。需要
`pnpm` 在您的 `PATH` 上。

```bash
# Install into a profile (`web` is the one `dsh web` boots)
dsh plugin --profile web add github:upstash/skills

# Start the harness
dsh web
```

然后从会话中存储您的 Upstash 凭据：

```
/upstash-login YOUR_EMAIL YOUR_API_KEY
```

凭证存储在 `~/.dsh/.credentials.yaml` 中，MCP 服务器作为连接
两者都设置好后。 skills 无需它们即可工作。

## MCP 服务器

要完全访问 Upstash API（创建数据库、发布消息、查询向量等），您还可以设置 [`@upstash/mcp-server`](https://www.npmjs.com/package/@upstash/mcp-server)：

Claude Code

```bash
claude mcp add upstash -- npx -y @upstash/mcp-server@latest --email YOUR_EMAIL --api-key YOUR_API_KEY
```

光标

添加到`.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "upstash": {
      "command": "npx",
      "args": ["-y", "@upstash/mcp-server@latest", "--email", "YOUR_EMAIL", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

DeepSeek Harness

已包含在捆绑包中 - 请参阅上面的 [DeepSeek Harness](#deepseek-harness)。

## 进行更改

### 更新现有技能

1.编辑个人技能文件夹中的文件（例如`skills/upstash-qstash-js/`）。
2.运行`npm run build`重新生成`skills/upstash/`。
3. 提交源更改和重新生成的输出。

### 添加新技能

1. 在`skills/`下创建一个新文件夹（例如`skills/upstash-redis-js/`）。
2. 添加带有标准 frontmatter（`name` 和 `description`）和任何支持文件的 `SKILL.md`。
3.运行`npm run build` — 新技能将自动拾取。
4. 承诺一切。

### 更改组合技能标题

`skills/upstash/SKILL.md` 的前言和介绍性文本来自 `scripts/header.md`。编辑该文件，然后运行 ​​`npm run build`。

### 更新插件版本

发布时，在 `.claude-plugin/plugin.json`、`.cursor-plugin/plugin.json` 和 `.codex-plugin/plugin.json` 中增加 `version` 字段。

## 脚本

### 脚本·命令·描述
- **脚本**：`build` · **命令**：`npm run build` · **描述**：从所有单独的 skills 重新生成 `skills/upstash/`。
- **脚本**：`check` · **命令**：`npm run check` · **描述**：运行构建，如果存在 git diff，则失败 - 在 CI 中使用以确保提交生成的输出。

## CI

GitHub 操作工作流程 (`.github/workflows/check.yml`) 在每次推送和 PR 时运行 `npm run check`。如果在推送之前忘记运行 `npm run build`，CI 将失败。