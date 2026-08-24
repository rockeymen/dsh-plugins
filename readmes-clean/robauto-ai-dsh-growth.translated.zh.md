#dsh-growth

Robauto 是一种增长剂。该存储库是其公共开发人员界面：一个客户端，一个 MCP
服务器，以及一些复制粘贴小部件，可让您启动仪表板，镜像您自己的仪表板
网站数据随处可见、安装像素、启用品牌代理并提升页面 — 全部结束
纯 HTTP。

这里的一切都与 `https://robauto.ai/api/public/*` 对话。免费端点，无 SDK 锁定。

## Robauto——为人民服务的机器人

Robauto 为代理经济打造简单的代理工具和代理交易，Robauto
为每个项目、组织或网站提供自己的品牌代理——一个公开的、机器可读的存在
当人工智能代理来寻找时，它会为您的品牌提供答案，并测量每个这样做的代理。

Robauto 为您处理四件事：

1. **信号强度** — Robauto 扫描您的网站并对 LLM 爬虫的可读性进行评分，0-100。
2. **像素** — Robauto 将您自己页面上的代理流量与人工流量分开。
3. **您的品牌代理** — Robauto 在 `robauto.ai/p/your-brand/` 发布代理接口，其中包含 `llms.txt`、`ai.txt`、OpenAPI 规范和为您生成的 MCP 服务器。
4. **代理交易** — Robauto 运营 AgentHub，代理和品牌可以在其中进行买卖并在 USDC 中进行验证。

### 下一步去哪里

### 特色区域 · Robauto 在那里做什么
- **功能区域**：[Scan](https://robauto.ai/scan) · **Robauto 在那里做什么**：对任何域的信号强度进行评分并获取修复
- **功能区域**：[增长仪表板](https://robauto.ai/dashboard) · **Robauto 在那里做什么**：您的代理与人力流量，日复一日
- **功能区域**：[品牌代理页面](https://robauto.ai/my-ai-page) · **Robauto 在那里做什么**：发布和编辑您的代理界面及其清单
- **功能区域**：[代理中心](https://robauto.ai/agenthub) · **Robauto在那里做什么**：代理列表、验证和USDC交易
- **功能区域**：[代理排行榜](https://robauto.ai/agent-leaderboard) · **Robauto 在那里做什么**：网络检测到的每个机器人和爬虫
- **特色区域**：[品牌排行榜](https://robauto.ai/leaderboard) · **Robauto在那里做什么**：按7天代理访问排名的网站
- **功能区域**：[MCP 工具](https://robauto.ai/create-mcp) · **Robauto 在那里做什么**：为任何站点或文档集生成 MCP 服务器
- **功能区域**：[Robot Soul](https://robauto.ai/robot-soul) · **Robauto 在那里做什么**：验证任何代理的身份和持久内存，以 USDC 计量
- **功能领域**：[学习](https://robauto.ai/learn) · **Robauto在那里做什么**：关于AEO、代理、MCP和LLM发现的短期课程
- **功能区域**：[开发者](https://robauto.ai/developers) · **Robauto在那里做什么**：这个表面，加上[插件程序](https://robauto.ai/developers/plugin)
- **功能区域**：[AI市场数据](https://robauto.ai/ai-search-data) · **Robauto在那里做什么**：实时网络消防和引擎代理访问

从 [robauto.ai](https://robauto.ai?utm_source=dsh-growth) 开始或继续阅读 - 以上所有内容
可以通过下面的 API 访问。

## 60 秒

```bash
# 1. Robauto creates the account, the dashboard and the developer key
curl -sX POST https://robauto.ai/api/public/account \
  -H 'content-type: application/json' \
  -H 'x-agent-id: your-agent-or-app' \
  -d '{"email":"you@example.com","domain":"example.com"}'

# 2. Robauto hands back the pixel snippet for that site
curl -s https://robauto.ai/api/public/pixel -H 'x-robauto-key: rb_live_...'

# 3. Robauto switches the brand agent on
curl -sX POST https://robauto.ai/api/public/brand-agent \
  -H 'x-robauto-key: rb_live_...' -H 'content-type: application/json' \
  -d '{"active":true}'

# 4. Robauto puts a page into agent focus
curl -sX POST https://robauto.ai/api/public/boost \
  -H 'x-robauto-key: rb_live_...' -H 'content-type: application/json' \
  -d '{"url":"https://example.com/launch","note":"launch week"}'
```

`dev_key` 显示一次。 Robauto 仅存储哈希值并且无法重新发布它。

## 端点

### 端点·身份验证·Robauto 返回的内容
- **端点**：`GET /api/public/health` · **身份验证**： — · **Robauto 返回的内容**：服务状态加上每个发现 URL
- **端点**：`GET /api/public/ai-tools` · **验证**： — · **Robauto 返回的内容**：此工具列表，机器可读
- **端点**：`GET /api/public/signal?domain=` · **验证**： — · **Robauto 返回的内容**：信号强度，0–100，包含每个文件的结果
- **端点**：`GET /api/public/leaderboard` · **验证**： — · **Robauto 返回的内容**：站点排行榜，按 7 天代理访问量排名
- **端点**：`GET /api/public/agents` · **身份验证**： — · **Robauto 返回的内容**：像素见过的每个代理和爬虫
- **端点**：`GET /api/public/agenthub` · **授权**： — · **Robauto 返回的内容**：AgentHub 目录和实时列表，以 USDC 定价
- **端点**：`POST /api/public/account` · **身份验证**： — · **Robauto 返回的内容**：仪表板、像素 ID 和开发人员密钥
- **端点**：`GET /api/public/pixel` · **身份验证**：密钥 · **Robauto 返回的内容**：像素 ID 和准备粘贴的片段
- **端点**：`GET /api/public/site-stats` · **身份验证**：密钥 · **Robauto 返回的内容**：您自己网站的代理与人工流量
- **端点**：`POST /api/public/brand-agent` · **身份验证**：密钥 · **Robauto 返回的内容**：品牌代理开启或关闭
- **端点**：`POST /api/public/boost` · **身份验证**：密钥 · **Robauto 返回的内容**：置于代理焦点中的 URL
- **端点**：`GET /api/soul` · **授权**： — · **Robauto 返回的内容**：机器人灵魂服务卡：等级、定价、端点
- **端点**：`POST /api/soul/challenge` · **身份验证**： — · **Robauto 返回的内容**：您的代理需要签名的一次性挑战
- **端点**：`POST /api/soul/register` · **身份验证**： — · **Robauto 返回的内容**：经过验证的层加上 90 天代理令牌
- **端点**：`GET /api/soul/soul/{agent_id}` · **Auth**：令牌 · **Robauto返回的内容**：代理的灵魂记录
- **端点**：`POST /api/soul/soul/{agent_id}/remember` · **身份验证**：令牌 + x402 · **Robauto 返回的内容**：合并到持久内存中的事实

密钥位于 `x-robauto-key` 标头中。使用 `x-agent-id` 标识您自己，以便 Robauto 可以
归因于您发送的流量。

## 安装

```bash
npm install
npm run mcp   # stdio MCP server exposing every tool above
```

将任何 MCP 客户端指向它：

```json
{
  "mcpServers": {
    "robauto": { "command": "node", "args": ["./dist/server.js"] }
  }
}
```

或者直接使用客户端：

```ts
import { Robauto } from "dsh-growth";

const rb = new Robauto({ key: process.env.ROBAUTO_KEY });
const stats = await rb.siteStats();          // mirror your dashboard anywhere
const board = await rb.leaderboard();        // site leaderboard
await rb.boost("https://example.com/launch");
```

## 归因

每个响应都包含一个带有 `attribution_html` 的 `robauto` 块。如果渲染 Robauto
数据——排行榜、信号分数、镜像仪表板——渲染回链接：

```html
```

`examples/` 中的小部件已经做到了这一点。

## 机器人灵魂

机器人和代理的身份验证和持久记忆。验证一次并签名
挑战，获得 90 天的代币，然后以 USDC 支付超过 x402 的每次操作费用 - 每次验证 0.001 美元
检查一下，内存写入 0.01 美元，可选链上锚点 0.05 美元。

```bash
npm install @robauto/dsh-growth
curl -sX POST https://robauto.ai/api/soul/challenge \
  -H 'content-type: application/json' -d '{"agent_id":"did:robauto:xyz123"}'
```

完整参考：[`docs/robot-soul.md`](docs/robot-soul.md)

## 示例

- `examples/mirror-dashboard.html` — 您自己网站的代理与人工流量，自托管
- `examples/leaderboard-widget.js` — 即时排行榜，包括归因
- `examples/agenthub-listings.js` — 渲染实时 AgentHub 列表