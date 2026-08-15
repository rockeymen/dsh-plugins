# Treg (OpenRouter 工具)

![treg — 您的代理的工具目录](docs/assets/treg-hero.png)

**OpenRouter，但用于代理工具而不是模型。** 使用一个令牌将代理指向一个基本 URL
它可以完成这项工作：**~40 个提供商的~2,600 个编目端点** - SEO 和反向链接，
社交和趋势、人员和公司充实、广告、抓取 — **按每次通话定价，一美分起**，
无需提供商注册。加上您自己团队的按键、技能和 CLI，每个队友都可以调用
没有凭证的代理永远不会离开服务器。

**要求任务，而不是工具。** 您不需要知道哪个供应商出售反向链接数据，或者
在他们那里持有账户。搜索您想要做的事情，阅读价格，然后致电。

专为 Superdesign 团队打造，位于 [treg.to](https://treg.to) - 任何人都可以自行托管。

## 为什么它存在

代理实际工作所需的工具位于没有人一次性购买的订阅后面 -
Semrush 139 美元/月，Moz 99 美元/月，Crunchbase 99 美元/月，Apollo 59 美元/席位——在注册墙后面，或者没有
完全公开 API（仅限邀请、仅限合作伙伴、仅限应用程序审核）。 treg 承载这些帐户并
每次通话费用不到一美分。

## 两种工具，一种代币

- **目录** — 外部端点 treg 可以**在其自己的密钥上**提供服务，根据您的计量
  团队的预付余额（**每个新团队免费 1.00 美元**）。无需提供商帐户。
- **您自己的工具** - 队友注册的任何东西：付费 API 帐户、OAuth 连接、
  供应商 CLI，`SKILL.md`。 **您自己的密钥始终胜过 treg 的密钥，并且这些调用永远不会
  计量。**

后半部分的词汇：

- **工具** = 注册中心要求您使用组织的凭据提供的东西。两种：
  - **端点** — 上游 `base_url` + 凭证 **绑定**（每个绑定注入一个
  请求中的秘密；一个请求可以携带多个，例如OAuth 持有者 *和*
  `developer-token` 标头）。
  - **CLI** — 供应商二进制文件（`stripe`、`gh`、`vercel`，...）使用注入的凭据运行。
- **技能/捆绑** = 配方（`SKILL.md`）+其秘密+其工具，一起注册。

**一条规则：**代理 **中继，从不建模**上游，并 **注入身份验证服务器端**
- 因此它可以在上游 API 更改中幸存下来，并且调用者永远不会持有密钥。

# 第 1 部分·使用注册表

访问 [**treg.to**](https://treg.to)（托管在 Render 上）- 仪表板，
登录，下面的每个 URL 都在那里。

## 快速入门

与仪表板的 **入门** 指南相同的流程：

````bash
# 1. 安装 CLI — 也将其指向注册表
卷曲-fsSL https://treg.to/install.sh |嘘

# 2. 登录（GitHub 默认 · --email 用于一次性代码 · --token 用于代理/CI）
treg 登录

# 3.立即做一些有用的事情——没有钥匙，没有注册任何东西
treg 目录搜索“域的反向链接”# 通过其功能查找工具
treg 调用 tikhub.tiktok.user.profile --query uniqueId=tiktok
treg 余额 # 到底花费多少

#（或 `treg onboard` 用于指导演练）
```

Your token identifies you on every call (`X-Treg-Token` header) and is the same for all tools.
Discover what your team has shared: `treg tool ls` · check credential health: `treg health`.

### Or install it as a Claude Code plugin

```
/插件市场添加 superdesigndev/treg
/插件安装treg@treg
```

Installs with no token and no configuration. The skill loads as `treg:treg` and, on its first run,
walks your agent through the rest — the CLI, sign-in, then `treg mcp install` — so you end up with
the command line **and** treg's tools. Other agents: `npx skills add superdesigndev/treg -s treg`
(the `-s` matters — without it you also get this repo's internal dev skills).
See [docs/CLAUDE-PLUGIN.md](docs/CLAUDE-PLUGIN.md).

## Call a tool you don't have a key for

The catalog is grouped by what endpoints **do**: keyword and rank tracking, backlinks and authority,
AI visibility, trending and discovery, publishing to socials, people and company enrichment, ads
management and creative, measurement.

```bash
treg目录#每个平台，最忙的在前
treg 目录搜索“查找工作电子邮件”# 按工作，而不是供应商
treg 目录获取 Hunter.people.email.find # 参数、价格、响应示例
treg 呼叫 Hunter.people.email.find --query domain=reddit.com --query full_name="Alexis Ohanian"
```

**How a catalogued call is served** — the credential ladder, in order:

1. your team registered its own tool for that provider → that tool, that key;
2. your team stored a secret for the provider → injected through a virtual tool;
3. neither → **treg's own key**, billed to the team's prepaid balance.

Your own credential always beats treg's, so connecting a key you already pay for makes those calls
free of the balance rather than duplicating them. An endpoint treg has no published price for is
**refused**, not served free — you are told to connect your own key instead. Where several providers
serve one capability, `treg catalog search` shows them side by side with prices; **choosing is
yours** — treg does not silently pick or fail over for you.

```bash
treg 余额 # 剩余积分、飞行中通话、最近支出
treg topup #添加资金，或者设置自动充值
“`

Out of balance is an HTTP **402** carrying `balance_micro`, `estimated_cost_micro` and a `topup_url”，
这样代理人就可以在不阅读散文的情况下采取行动。

## 分享和使用您自己的工具

零思考路径 — 将 treg 指向一个项目，它会找出可共享的内容：

```bash
treg scan     # read-only preview: the keys, skills & CLIs upload would register
treg upload   # register them (encrypted server-side); idempotent, --replace to update
```

`treg upload` 扫描 `.env`（将密钥与 ~80 个已知提供商进行匹配），每项技能
子目录和已安装的目录 CLI。三种类型的东西进入注册表——具体方法如下
共享和使用每个：

### 1. 端点（HTTP API）

**共享** — 可使用存储的密钥调用一个上游 URL，或从 `.env` 批量调用：

```bash
treg secret add STRIPE_KEY --value sk_live_123
treg add stripe --base-url https://api.stripe.com --secret STRIPE_KEY

treg upload env --select openai,stripe,resend     # or straight from the .env
```

**使用** - 代理本机方式：构建**真正的**上游请求并使用代理作为前缀。
treg 通过主机解析工具，注入凭证，并忠实地中继其他一切
（你的 `X-Treg-Token` 在上游看到它之前就被剥离了）：

```
Real request:   GET https://api.intercom.io/conversations?per_page=5
Through treg:   GET https://treg.to/call/https://api.intercom.io/conversations?per_page=5
                    header:  X-Treg-Token: <your token>
```

或者 CLI 简写 — 以及审计日志的 `treg calls`：

```bash
treg call intercom conversations --query per_page=5
treg call stripe v1/balance
```

### 2. CLI

**共享** — 自动：`treg upload` 检测已安装的目录 CLI（`stripe`、`gh`、`vercel`，...）
并登记它们；仅配方目录 CLI 技能（例如 `stripe-cli`）也自动变得可运行。

**使用** — `treg run` 执行供应商 CLI **并注入组织的凭据**，因此您永远不会
按住按键或登录：

```bash
treg run stripe -- get /v1/balance
treg run gh -- pr list
treg run --server agentmail-cli inboxes list   # runs on the registry server: the key never reaches you
```

`--local`（默认）在您的机器上运行； `--server` 在注册表上运行并将输出流返回。
对于整个会话，`treg shell start` 打开一个子 shell，每个注册的 CLI 都会注入
自动 — 只需正常使用 `stripe`、`gh`...； `exit` 恢复。 `treg runs`是审计日志。

### 3.技能

**分享** — 技能是一种整体能力（`SKILL.md` 配方 + 它的秘密 + 它的工具），
一起注册，以便整个团队运行相同的技能，并在一个地方维护：

```bash
treg upload skills --dir ~/.claude/skills --all   # register a folder of skills in one pass
```

**使用** — 将任何共享技能引入您的代理；它的 API 调用通过 treg 使用您的令牌进行，
所以关键留在服务器上，而不是技能中：

```bash
treg skill install seo-blog-writer      # writes into ./.claude/skills/  (--all for the library)
```

### 手动注册——当启发法无法找出工具时

````bash
# 多凭证工具（例如 google-ads：OAuth 持有者 + 开发者令牌标头）
treg 工具添加 google-ads --base-url https://googleads.googleapis.com \
  --bind "secret=<oauth-id>,injector=oauth" \
  --bind "secret=<dev-id>,name=developer-token,format={secret}"

# 一技之长，循序渐进
treg技能init --dir ./my-skill #草稿treg.json（猜测base_url，发现秘密）
treg技能添加--dir ./my-skill #自动注册配方+秘密+工具

# 通过浏览器进行 OAuth（生成第一个令牌，treg 保留它并自动刷新）
treg oauth 连接 gsc --client-secret client_secret.json \
  --范围 https