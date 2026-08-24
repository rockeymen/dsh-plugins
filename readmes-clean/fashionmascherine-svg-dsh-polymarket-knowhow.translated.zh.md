#dsh-polymarket-knowhow

**一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件，为您的代理提供完整、经过验证的 Polymarket 超级能力**：跨每个 Polymarket API（Gamma、CLOB、Data API、Perps、Combos/RFQ、Bridge）的实时市场数据工具、选择加入的经过身份验证的交易工具、WebSocket 市场流服务以及从官方文档中提取的捆绑*专有技术*技能 - 因此该模型永远不会幻觉端点、参数或授权流程。

建立在 [`atompilot/polymarket-skill`](https://github.com/atompilot/polymarket-skill) (MIT) 的知识库之上，并根据当前官方 OpenAPI 规范 **和实时 API 响应** 重新验证。

## 为什么要使用这个插件

### · 这个插件 · 原始文档 / MCP 服务器
- 离线工作以获取专业知识（捆绑技能 + `polymarket_knowledge` 工具） · **此插件**：✅ · **原始文档/MCP 服务器**：❌
- 具有类型化模式和有界输出的实时工具 · **此插件**： ✅ · **原始文档/MCP 服务器**：部分
- 涵盖端到端的身份验证流程（L1 EIP-712 → L2 HMAC → 构建器标头） · **此插件**：✅ · **原始文档/MCP 服务器**：部分
- 新的 2026 表面：**Perps**（56 个操作）和 **Combos/RFQ** · **此插件**：✅ 记录 + 阅读工具 · **原始文档/MCP 服务器**：分散
- 端点漂移校正（`volume24hr` 排序、扁平批量有效负载、地理块主机、合约移动）· **此插件**：✅ 实时验证· **原始文档/MCP 服务器**：❌

## 能力

四个独立的 Cordis 行（在后面的补丁层中通过 id 禁用其中任何一个）：

### 行 id · 提供
- **行 ID**：`polymarket-service` · **提供**：`ctx.polymarket` 服务：每个 Polymarket API（Gamma、CLOB、Data、Perps、RFQ、Bridge、Relayer）一个配置的客户端，具有超时/重试/地理块感知 HTTP
- **行 ID**：`polymarket-tools` · **提供**：约 22 个始终在线的市场数据工具 + 选择加入账户/交易工具 + Perps 工具 + `polymarket_knowledge`
- **行id**：`polymarket-skills` · **提供**：通过`ctx.skills`嵌入运行时技能`polymarket`（16个知识模块作为资源）
- **行 ID**：`polymarket-stream` · **提供**：可选的市场通道 WebSocket 桥接器发出 `polymarket/market-event` Cordis 事件

### 模型工具（始终注册）

- Discovery：`polymarket_search`、`polymarket_events_list`（偏移+键集分页）、`polymarket_event_get`、`polymarket_markets_list`、`polymarket_market_get`、`polymarket_tags_list`
- CLOB 数据：`polymarket_orderbook`（单笔/批量）、`polymarket_price`（单笔/批量）、`polymarket_quote`（中间+点差+最后一次调用）、`polymarket_price_history`、`polymarket_token_info`（报价单位、负风险、代币→市场分辨率）
- 数据API：`polymarket_positions`、`polymarket_trades_public`、`polymarket_activity`、`polymarket_holders`、`polymarket_leaderboard`、`polymarket_open_interest`、`polymarket_live_volume`、`polymarket_portfolio_value`
- 元：`polymarket_geoblock_check`、`polymarket_combo_markets`、`polymarket_knowledge`

### 选择加入工具（仅在配置时注册）

- `trading.enabled` + L2 凭证 → `polymarket_account_orders`、`polymarket_account_trades`、`polymarket_cancel_orders`、`polymarket_balance_allowance`、`polymarket_heartbeat`、`polymarket_api_keys`、`polymarket_place_order`*
- `perps.enabled` + Perps 凭证 → `polymarket_perps_market_data`、`polymarket_perps_account`

\* 下单标志通过官方【`@polymarket/clob-client`](https://www.npmjs.com/package/@polymarket/clob-client) SDK】可解析（参见【交易设置](#trading-setup)）。其他一切都使用零依赖节点加密。

## 安装

```sh
# From GitHub (pin a commit for reproducibility)
dsh plugin --profile my-profile add github:fashionmascherine-svg/dsh-polymarket-knowhow#<sha>

# From a local checkout
dsh plugin --profile my-profile add ./dsh-polymarket-knowhow

# From a tarball
pnpm pack && dsh plugin --profile my-profile add ./dsh-polymarket-knowhow-0.2.0.tgz
```

该软件包提供独立的 `prepare` 版本。 git install 获取源代码，因此 pnpm ≥10 要求您允许构建一次 - 将 pnpm 打印的包密钥复制到您的配置文件的 `pnpm-workspace.yaml` 中：

```yaml
allowBuilds:
  dsh-polymarket-knowhow: true
```

然后开机：`dsh --profile my-profile`。所有四行均激活；除非您启用交易/perps，否则只有安全的只读工具可见。

## 用于Claude Code

同一存储库也是一个 [Claude Code](https://claude.com/claude-code) 插件。它捆绑了：

- **`polymarket` 技能** — `skills/polymarket/references/` 下的 15 个知识模块（从 `knowledge/` 生成，单一事实来源）；
- **只读 MCP 服务器** (`scripts/mcp-server.mjs`) 公开实时市场数据工具（搜索、事件、订单簿、价格、报价、价格历史记录、头寸、交易、排行榜、未平仓合约、永续市场数据等）。交易/账户工具永远不会暴露——服务器构建时禁用了凭证解析，并在顶部设置了拒绝名单防护。

从该存储库的捆绑市场安装：

```
/plugin marketplace add fashionmascherine-svg/dsh-polymarket-knowhow
/plugin install polymarket-knowhow@fashionmascherine-svg-polymarket
```

或者仅将 MCP 服务器连接到任何 MCP 客户端：

```sh
claude mcp add polymarket-knowhow -- node /path/to/dsh-polymarket-knowhow/scripts/mcp-server.mjs
```

预构建的 `lib/` 已提交，因此两条路径都可以开箱即用；触摸 `src/` 后运行 `npm run build` 并提交重建的 `lib/`。编辑`knowledge/*.md`后，用`npm run sync:claude-skill`重新生成技能副本。

## 配置

默认值是合理的（公共端点、无凭据、权衡）。覆盖您的个人资料 `cordis.patch.yml` 中的任何字段：

```yaml
- id: polymarket-service
  config:
    timeoutMs: 20000
    maxRetries: 3
    trading:
      enabled: true
      # Explicit creds… (or leave empty to read POLY_API_KEY / POLY_SECRET /
      # POLY_PASSPHRASE / POLY_ADDRESS from the environment)
      apiKey: ''
      secret: ''
      passphrase: ''
      address: ''        # funder/proxy wallet address
      signatureType: 2   # 0 EOA · 1 POLY_PROXY · 2 GNOSIS_SAFE
    perps:
      enabled: false     # reads POLYMARKET_PROXY / POLYMARKET_SECRET env
    stream:
      enabled: false
      assetIds: []       # CLOB token ids to subscribe at startup
    skills: true         # register the embedded knowhow skill

- id: polymarket-stream
  disabled: false         # rows can be toggled individually
```

### 交易设置

1. 创建一次 L2 API 凭证（任何方法）：
   - `py-clob-client`：`ClobClient(host, key=pk, chain_id=137).create_or_derive_api_creds()`，或
   - 将 `@polymarket/clob-client` 安装到配置文件中并使用其 `createOrDeriveApiKey()`。
2. 将这四个值放入 config 或 `POLY_*` 环境变量中。
3. 对于下单，还要使SDK可解析并设置`POLY_PRIVATE_KEY`：

```sh
dsh plugin --profile my-profile add @polymarket/clob-client
```

只读账户工具（订单、交易、取消、余额、心跳）无需 SDK 即可工作 — 它们使用 Node 的内置 HMAC（L2 标头 `POLY_ADDRESS/SIGNATURE/TIMESTAMP/API_KEY/PASSPHRASE`）签署请求。

> ⚠️ 交易是真钱。心跳在超过 10 秒后取消所有未平仓订单； FOK/FAK 买入 `amount` 是美元，卖出是股票。先读`knowledge/order-patterns.md`。

## 使用其他插件的服务

```ts
export const inject = ['polymarket']

export function apply(ctx) {
  const { gamma, clob, dataApi } = ctx.polymarket
  const events = await ctx.polymarket.gamma.listEvents({ active: true, limit: 10 })
  const book = await clob.getBook(tokenId)
  ctx.on('polymarket/market-event', (event) => { /* stream.enabled */ })
}
```

## 知识模块（捆绑）

`SKILL.md`（条目）·`api-endpoints`（完整验证库存）·`authentication`·`order-patterns`·`market-data`·`websocket`·`concepts`·`ctf-operations`·`fees`·`bridge`·`gasless`·`error-codes`·`rate-limits` · `geoblock` · `perps` · `combos-rfq`

通过 `skill` 工具（名称：`polymarket`）或直接使用 `polymarket_knowledge`（主题或自由文本搜索）加载。

## 验证方法

- 每个 REST 表面都根据从 docs.polymarket.com 获取的官方 OpenAPI 规范进行了交叉检查。
- 然后对端点进行**实时**（读取路径）——捕获了真正的漂移：camelCase排序字段（`volume_24hr` → 422）、扁平批量有效负载（`params`包装器返回`[]`）、`/live-volume?id=`（不是`?event=`）、存在于`polymarket.com/api/geoblock`上的地理块以及移动的交换合约地址。
- `tests/unit`（28 项测试）：硬编码的 HMAC 黄金向量、本地服务器上的重试/重试后/错误映射、通过存根提取执行工具，包括。取消快乐路径和失败传播。
- `tests/live`（11 项测试）：针对 Gamma/CLOB/Data-API/Perps 的生产烟雾测试。

```sh
npm test        # unit suite (builds first)
npm run test:live  # hits the real APIs, read-only
```

## 存储库布局

````
├── cordis.patch.yml # 捆绑补丁：4 plu