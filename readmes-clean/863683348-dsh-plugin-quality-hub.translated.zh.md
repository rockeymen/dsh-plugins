# DSH 插件质量中心

DeepSeek Harness (DSH) 插件生态系统的独立评级和安全信号 - “哪些插件实际上值得安装？”

**实时站点：** GitHub 页面 (docs/) — 将页面源设置为 **主分支 / 文档** 文件夹。

**全栈应用程序（推荐）：** `app/` — Next.js 14 App Router + Prisma + Neon PostgreSQL + next-intl 双语。使用 **Root Directory = app** 在 Vercel 上部署。

## 页数

- **最高评分** — 0-100 分、A-D 等级、按星级排名前 100 名
- **热门** — 最近活跃且明星最多
- **安全观察** - 危险的安装脚本，缺少 dsh.bundle（标签农业），存档存储库
- **DSH Weekly** — 每周英文摘要（以 `weekly/` 发布草稿）

## 它是如何工作的

1. `scripts/fetch-data.mjs` — 提取 `dsh-plugin` 主题（星号降序，前 100 名），探测 npm 注册表（版本、发布日期、**dsh.bundle 声明、安装脚本**、每周下载），从很棒的列表中标记精选条目，然后使用 [dsh-audit](https://github.com/863683348/dsh-plugin-audit) 的纯评分引擎对每个插件进行评分。
2. `scripts/build-site.mjs` — 零依赖静态生成器：`dist/*.html` + `dist/plugin/<name>.html` 详细信息页面。

```bash
npm run all      # fetch + build
npm run fetch    # refresh data only
npm run build    # rebuild site from data/catalog.json
```

评分模型（权重：维护 30 / 文档 25 / npm 30 / 生态系统 15；安全标志否决评分）记录在网站的方法部分。

## 每日评估流程（v1.1）

`.github/workflows/daily-evaluate.yml` **每天 02:00 UTC**（北京 10:00）运行，加上手动 `workflow_dispatch`：

- **发现**：真正的GitHub搜索API（主题：dsh-插件+dsh.bundle关键字查询，上限30/天）
- **填充**：确定性合成池达到 `TARGET_NEW`（默认 60 个/天）——保证每天 50-100 个新插件
- **重新评估更改**：现有 github 来源的插件**仅当** star / lastPush / archived / npmVersion 更改时重新评分（更改触发，而不是完全重新扫描）。 ScoreLog 保留历史记录
- **写入**：通过 `DATABASE_URL`/`DIRECT_URL` 密钥直接发送到 Neon（无服务器往返）

所需的回购秘密：`DATABASE_URL`、`DIRECT_URL`、`GITHUB_TOKEN`（具有 `repo` 范围的经典 PAT，公共回购搜索未经身份验证即可工作，但令牌提高了速率限制）。

脚本：`app/scripts/daily-evaluate.mts`（本地：`cd app && npm run evaluate:daily`）。插件上的快照字段：`npmVersion`、`evalSource`、`lastEvalAt`、`evalMeta`。

## 时事通讯

DSH Weekly是每周的英语文摘（草稿为`weekly/`）。将 `subscribe.html` 连接到 Buttondown / Substack / Mailchimp 即可上线。

## 会员资格（v1.2 — Google 登录 + waffo 付款）

`app/` 包括完整的会员堆栈（所有双语 `en`/`zh`）：

- **登录** — Google OAuth（官方代码流程，无第三方 SDK）。会话是通过 `AUTH_SECRET` 签名的 JWT（`dsh_session` httpOnly cookie，30d）。路线：`/api/v1/auth/google`、`/api/v1/auth/logout`、`/api/v1/me`。
- **付款** — [waffo](https://waffo.com) 记录商户：计划 `pro_monthly`（9 美元/月）和 `pro_yearly`（98 美元/年，清单 108 美元）。签出`/api/v1/waffo/checkout`，webhook `/api/v1/waffo/webhook`（RSA签名验证，事件id幂等），取消`/api/v1/waffo/cancel`。计费由 waffo 处理；卡的详细信息永远不会影响我们。
- **内容门** — `Tutorial`/`Example` (`free`|`pro`) 上的层字段。 SSG仅输出前1/4的专业内容；全文仅通过 `/api/v1/content/*` 向专业会员提供。门控是路线图驱动的（路线①：当前内容保持`free`，门控已构建并准备就绪）。
- **页面** - `/pricing`（每月/每年切换+比较+常见问题解答），`/login`（Google按钮），`/account`（订阅状态，管理/取消）。页眉/页脚显示登录状态和定价链接。

所需环境（参见 `app/.env.example`）：`AUTH_SECRET`、`GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`、`WAFFO_API_KEY`、`WAFFO_PRIVATE_KEY`、`WAFFO_PUBLIC_KEY`、`WAFFO_MERCHANT_ID`、`WAFFO_ENV`、`RESEND_API_KEY`（电子邮件，保留）。

架构：`User`、`Subscription`、`Payment` 型号 + `tier` 内容。迁移`20260819010000_add_membership_models`（适用于`npx prisma migrate deploy`）。

## 注释

- 仅限启发式 - 不能替代代码审查，尤其是对于长尾插件。
- 数据是每周快照；全主题深度扫描（带有静态安全扫描）由[dsh-audit](https://github.com/863683348/dsh-plugin-audit).
- 不隶属于 DeepSeek。