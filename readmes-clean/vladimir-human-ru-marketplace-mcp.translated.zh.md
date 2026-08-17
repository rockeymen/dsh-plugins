#ru-marketplace-mcp

**适用于俄罗斯和中国市场的 MCP 服务器。** 价格、可用性、
来自 Wildberry、Ozon、Yandex Market、的卖家的评级、评论和详细信息
Detsky Mir、Avito、淘宝、Megamarket、Lamoda、DNS 和 Citylink。加号
一次通话即可比较所有来源的价格。

只读。不需要 API 密钥、令牌和注册 - 具有严格要求的网站
反机器人程序会读取您自己的 Chrome。一种可选的例外情况：
可选的 MPStats 需要付费令牌 (`MPSTATS_MP_AUTH`) - 没有它的一切
其余的工作和以前一样。

[英文版如下](#english-version)·[架构](docs/ARCHITECTURE.md)·
[如何添加来源](docs/ADDING_A_SOURCE.md) · [关于反bot](docs/ANTI_BOT.md)

## 里面有什么

### 服务器 · 工具 · 你需要阅读什么 · 你可以做什么
- **服务器**：**Wildberry** · **工具**：9 · **您需要阅读的内容**：匿名 HTTP · **它可以做什么**：搜索、卡片、评论、有关产品的问题、卖家详细信息、目录和类别产品
- **服务器**：**Yandex Market** · **工具**：3 · **您需要阅读的内容**：匿名 HTTP · **它可以做什么**：来自不同卖家的价格、星级评分细目、评论
- **服务器**：**儿童世界** · **工具**：4 · **您需要阅读的内容**：匿名 HTTP · **它可以做什么**：儿童产品、线下商店的可用性、类别
- **服务器**：**Ozon** · **工具**：4 · **您需要阅读的内容**：您的 Chrome；来自家庭 IP 经常没有它 · **它可以做什么**：搜索、卡片、评论
- **服务器**：**Avito** · **工具**：4 · **您需要阅读的内容**：您的 Chrome + 俄罗斯家庭 IP 和按顺序请求 - 否则会被 IP 阻止 · **它可以做什么**：搜索广告、卡片、卖家声誉
- **服务器**：**淘宝** · **工具**：3 · **您需要阅读的内容**：已登录淘宝的 Chrome · **它可以做什么**：搜索和卡片，人民币价格
- **服务器**：**Megamarket** · **工具**：3 · **您需要阅读的内容**：主动登录的 Chrome - 匿名会话 API 返回空 · **它可以做什么**：通过移动 API 进行搜索和卡片
- **服务器**：**Lamoda** · **工具**：3 · **您需要阅读的内容**：匿名卡片 (GraphQL)、搜索 - 您的 Chrome · **它可以做什么**：搜索、具有尺寸的卡片
- **服务器**：**DNS** · **工具**：3 · **您需要阅读的内容**：您的 Chrome (Qrator) · **它可以做什么**：搜索和电子卡
- **服务器**：**Citylink** · **工具**：3 · **您需要阅读的内容**：您的 Chrome (Qrator) · **它可以做什么**：搜索和电子卡
- **服务器**：**比较** · **工具**：2 · **您需要阅读的内容**：轮询列出的所有内容 · **它可以做什么**：“哪里更便宜？”一通电话
- **服务器**：**MPStats** · **工具**：3 · **您需要阅读的内容**：MPStats 付费帐户、cookie `mp_auth`（可选） · **它可以做什么**：按 SKU Ozon/WB 划分的 30 天销售/剩余/图表，按仓库划分的余额 (FBS/FBO)

无需浏览器即可匿名阅读：Wildberry、Yandex Market、Children's World 和
拉莫达卡。其余的需要您登录 Chrome (CDP)。淘宝和
大型市场还需要主动登录网站本身 - 没有淘宝
遇到登录墙，Megamarket 给出了一个空的答案。 Avito 也阻止
通过IP：从数据中心地址来看，这是一个彻底的失败，从俄罗斯家庭地址来看，它可以工作，
如果你不经常提出请求。对 CDP 源的请求无序：队列
连续丢掉，没有停顿（DNS和淘宝在检查中已经降级了），所以
连接器在通话之间会暂停。您的会话的确切状态
将显示 `marketplace-mcp doctor`。

MPStats 脱颖而出：它是唯一的**付费**来源。没有
`MPSTATS_MP_AUTH` 服务器启动，但工具响应 `auth_missing` -
因此它是可选的，可以随意连接到其他十二个
它不会以任何方式影响服务器。

公共运行时 `mcp-core` 上的 12 个服务器中共有 33 个工具。加上组合
`marketplace-mcp`，一次安装所有内容 - 客户端配置中的一个条目
而不是十二个。他添加了他的工具 `marketplace_sources`（该工具连接
上升了，哪些下降了以及原因），所以里面有 34 种乐器：33
安装加上这个。

## 快速开始

需要 **Python 3.12+** 和 [uv](https://docs.astral.sh/uv/)。

```bash
git clone https://github.com/Vladimir-Human/ru-marketplace-mcp.git
cd ru-marketplace-mcp
uv sync --all-packages
uv run pytest -q -m "not live and not cdp"   # 1182 офлайн-тестов, сеть не нужна
```

检查实时端点：

```bash
uv run python -c "
import asyncio
from wb_connector.server import wb_selfcheck
print(asyncio.run(wb_selfcheck()).status)   # ждём success
"
```

## 连接MCP客户端

每个服务器都是一个控制台命令，因此配置中的路径不是硬连线的。

克劳德桌面 - `claude_desktop_config.json`

窗户：`%APPDATA%\Claude\claude_desktop_config.json`
苹果系统：`~/Library/Application Support/Claude/claude_desktop_config.json`

最简单的方法是连接**一条记录** - 合并的服务器安装所有内容
立即来源，但仪器的名称（`wb_search`，`avito_seller`，...）不是
改变：

```jsonc
{
  "mcpServers": {
    "marketplace": {
      "command": "uv",
      "args": ["run", "--directory", "C:/путь/к/ru-marketplace-mcp", "marketplace-mcp"],
    },
  },
}
```

如果需要单独的服务器，`marketplace-mcp install claude`将打印
准备插入块。您的结帐路径已插入其中：存根
`/path/to/ru-marketplace-mcp` 不必用手操纵。从轮子安装时
控制台命令不是打印路径，而是打印在 PATH 上。未知客户名称
（允许 `claude`、`claude-code`、`cursor`、`dsh`）该命令被拒绝并给出解释
返回代码 2 - 她无法默默地用块替换克劳德。最低
手动选项：

```jsonc
{
  "mcpServers": {
    "wildberries": {
      "command": "uv",
      "args": ["run", "--directory", "C:/путь/к/ru-marketplace-mcp", "wb-mcp"],
    },
    "ozon": {
      "command": "uv",
      "args": ["run", "--directory", "C:/путь/к/ru-marketplace-mcp", "ozon-mcp"],
    },
    "compare-prices": {
      "command": "uv",
      "args": ["run", "--directory", "C:/путь/к/ru-marketplace-mcp", "compare-mcp"],
    },
  },
}
```

使用正斜杠 `/` 或双反斜杠 `\\` 写入路径。完整列表
团队 - `wb-mcp`、`ozon-mcp`、`yandex-mcp`、`detmir-mcp`、`avito-mcp`、
`taobao-mcp`、`megamarket-mcp`、`lamoda-mcp`、`dns-mcp`、`citilink-mcp`、
`compare-mcp`、`marketplace-mcp`。

Claude Code

```bash
claude mcp add wildberries -- uv run --directory /путь/к/ru-marketplace-mcp wb-mcp
claude mcp add yandex-market -- uv run --directory /путь/к/ru-marketplace-mcp yandex-mcp
claude mcp add detsky-mir -- uv run --directory /путь/к/ru-marketplace-mcp detmir-mcp
claude mcp add ozon -- uv run --directory /путь/к/ru-marketplace-mcp ozon-mcp
claude mcp add compare-prices -- uv run --directory /путь/к/ru-marketplace-mcp compare-mcp
```

光标-`.cursor/mcp.json`

```jsonc
{
  "mcpServers": {
    "compare-prices": {
      "command": "uv",
      "args": ["run", "--directory", "/путь/к/ru-marketplace-mcp", "compare-mcp"],
    },
  },
}
```

另一个 stdio 客户端

运行 `uv run --directory /путь/к/репозиторию <команда>`，其中命令是以下之一
`wb-mcp`、`ozon-mcp`、`yandex-mcp`、`detmir-mcp`、`compare-mcp`。服务员说话
JSON-RPC 通过 stdin 和 stdout，诊断信息写入 stderr。可选
`mpstats-mcp` 以相同的方式启动，环境中有 `MPSTATS_MP_AUTH`。

DeepSeek Harness (dsh) - 插件捆绑包

在 dsh 中，这不是 `mcpServers` 条目，而是配置文件层。该捆绑包位于子目录中
[`dsh/`](dsh/README.md) 并由常规插件管理器安装（PATH 上需要 `pnpm`）：

```console
dsh plugin --profile web add github:Vladimir-Human/ru-marketplace-mcp#path:/dsh
```

安装后，立即出现 13 个技能和**不是一个** MCP-工具：两者都有
行 MCP 被禁用，直到变量 `RU_MARKETPLACE_MCP_DIR` 的路径为
克隆。这样做是因为安装的服务器在每个请求中都会付费：
推荐的比价模式约需 0900 代币，全套约需 13000 代币。
[dsh/README.md](dsh/README.md)]中描述了开启和完整模式。

连接后，重新启动客户端并运行`marketplace-mcp doctor`。他
触发每个连接器的金丝雀并响应 `success`、`drift_detected` 或
`inconclusive`。

## 工具

Canary `*_selfcheck` 故意不包含在此列表中：它们未发布
通过 MCP，因为操作员诊断将花费模型大约 7500 个代币
每一个请求。通过命令一次性启动它们 `marketplace-mcp doctor`
线。

### 野莓 — `wb_*`

### 工具·它的作用
- **工具**：`wb_search(query, page)` · **它的作用**：文本搜索，每页最多 100 个产品，包含价格和库存
- **工具**：`wb_card(nm_ids)` · **它的作用**：批量请求最多 100 个已知 SKU
- **工具**：`wb_root_info(nm_id)` · **它的作用**：查找 `imt_id`（评论所需）和颜色