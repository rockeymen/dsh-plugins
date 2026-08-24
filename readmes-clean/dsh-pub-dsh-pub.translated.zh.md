# DSH 酒馆

[dsh.pub](https://dsh.pub) 是 DeepSeek Harness 插件的双语、源支持的注册表
生态系统。它对当前的内置模块进行了分类，解释了运行时和 UI 功能，以及
分离原子模块、内置配置文件层和固定到公共源的社区包。

```text
DeepSeek Harness source
        │ pinned catalog sync
        ▼
219 source packages ──► 170 loadable plugins ──► Astro pages in English + Chinese
        │
        └── 3 manifest-declared bundles ──► built-in profile activation layers

Browser submission ──► Turnstile ──► Worker + D1 ──► Cloudflare Workflow
                                                        │
                                                        └─► GitHub App ──► submission PR
                                                                                  │
                                      Cloudflare Workers ◄── main deploy ◄── automatic merge
        │
        └── community Git bundle ──► dshpub CLI ──► native dsh plugin add
                                                                └─► D1 completed-install count
```

## 工作区

```text
apps/
├── web/       Astro static registry
├── server/    Cloudflare Worker install API and locale routing
├── cli/       GitHub bundle installer (`dshpub`)
└── dsh-plugin/ In-DSH bilingual visual directory
packages/
└── catalog/   generated Harness snapshot and typed access
migrations/    D1 event and aggregate schema
```

## 本地开发

```bash
npm install
npm run build:og
npm run build
npm run dev --workspace @dsh-pub/web
```

要在生产版本中启用 Google Analytics（分析），请提供公共 GA4 衡量 ID：

```bash
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run build
```

该构建在 `/sitemap-index.xml` 发出双语站点地图索引，爬虫策略在
`/robots.txt`，以及规范、hreflang、Open Graph、Twitter Card 和 JSON-LD 元数据
可索引页面。

Web 应用程序在 `http://127.0.0.1:4321` 上运行。要在本地运行完整的 Worker 边界：

```bash
npx wrangler d1 migrations apply dsh-pub --local
npx wrangler dev --local --port 8787
```

## 目录同步

生成的目录固定到已知的 DeepSeek Harness 提交并拒绝脏源
结帐。

```bash
node scripts/sync-harness-catalog.mjs
```

仅当有意验证另一个本地路径时才覆盖默认的相邻结帐：

```bash
node scripts/sync-harness-catalog.mjs --source /path/to/deepseek-harness
```

## 命令行界面

```bash
npx dshpub add owner/repo \
  --path packages/my-bundle \
  --profile web
```

该命令将公共 GitHub 引用解析为精确提交，验证所选包
声明 `dsh.bundle.patch`，删除验证签出，并传递持久提交固定
Git 规范为 `dsh plugin --profile … add …`。只有成功的本机安装才会报告完成。
遥测是尽力而为的，可以通过 `DO_NOT_TRACK=1` 或 `DISABLE_TELEMETRY=1` 禁用。

当前的三个 Harness 捆绑包是内置的 monorepo 配置文件层，而不是独立的 Git
软件包：它们的 `workspace:` 依赖项需要 Harness 工作区。因此目录
将它们显示为**内置配置文件层**，无需安装命令或安装计数。

## DSH插件目录

该存储库还附带 `@dsh-pub/plugin-directory`，这是 DSH 内的只读视觉目录
设置。它捆绑了与站点相同的公共插件和捆绑表面，支持双语
搜索、八个功能主题、出处/运行时/分发/类型过滤器和确定性
无需加载第三方代码即可排序。

```bash
npx dshpub add dsh-pub/dsh-pub --path apps/dsh-plugin --profile web
```

其更新和验证流程参见【`apps/dsh-plugin/README.md`](apps/dsh-plugin/README.md)】。

## 提交插件

使用双语提交页面：[dsh.pub/submit](https://dsh.pub/en/submit/)。浏览器发送
一个公共 GitHub 存储库 URL 和一个给 Worker 的 Turnstile 令牌。核实后，工人
在 D1 中存储提交作业，启动 Cloudflare 工作流程，并立即返回状态 URL。
该页面轮询该 URL，同时工作流使用存储库范围的 dsh.pub GitHub 应用程序来创建
或者找到对应的`submissions/*.json`分支和Pull Request。用户不需要
fork 存储库或单击 GitHub 的 **建议更改** 操作。

可信的 GitHub Actions 提交工作流程从确切的 Pull 请求中读取提交的文件
提交而不签出或执行不受信任的插件代码。它解决了插件存储库的问题
当前公共默认分支提交，验证其提交的捆绑合同，并运行完整的
dsh.pub 质量门。传递的拉取请求与合并提交合并，然后是可信的 `main`
工作流程重新生成并提交目录。现有的 Cloudflare Workers Git 集成
自动部署`main`。任何人都可以提名公共存储库；提交者未得到处理
作为经过验证的发布者，并且现有的存储库/包路径坐标不能被覆盖
通过这个流程。

Web 提交页面还会生成 Markdown 和 HTML 徽章片段。实时徽章报告
`not listed` 直到部署注册表提交，然后更改为 `listed`（带有短缓存）。
Pull 请求和签入的提交文件提供了公共审计跟踪。

存储库自动化通过两个范围狭窄的令牌使用相同的 GitHub 应用程序。请求请求
基本漂移恢复请求仅 `pull_requests: write`；仅可信目录集成请求
`contents: write`，并且仅在 lint、测试、E2E 和构建通过之后。配置存储库
变量 `DSH_PUB_APP_CLIENT_ID` 和存储库秘密 `DSH_PUB_APP_PRIVATE_KEY_PKCS8`
工作流程。该应用程序必须仅安装在 `dsh-pub/dsh-pub` 上，并读取内容和拉取请求
和写访问权限。这些操作名称故意与 Worker 的 `GITHUB_APP_*` 不同
绑定，因为 GitHub 保留 `GITHUB_` 前缀。拉取请求验证永远不会收到
应用程序秘密或令牌。

使用两个活动存储库规则集保护 `main`。 `main-pr-gate` 需要 Pull 请求并列出
仅 dsh.pub GitHub 应用程序集成作为 `always` 旁路参与者，允许受信任的目录作业
进行经过审核的快进提交。 `main-ref-integrity` 没有旁路参与者并阻止删除
和非快进更新。将这些控件分开可以防止应用程序、存储库
管理员和 GitHub 绕过删除或强制推送保护的操作；不要添加
管理员角色或 GitHub 操作集成到任一绕过列表。

`dsh-plugin` GitHub主题每天01:00亚洲/上海同步。工作流程需要一个
截止快照，固定每个公共默认分支提交，验证根捆绑合同，无需
执行第三方代码，更新目录和可安装注册表以及接受和记录
`packages/catalog/src/topic-analysis.generated.json` 中拒绝的结果。添加的存储库或
截止后更新将推迟到下一次运行。如果之后Topic连接仍然漂移
三次完整的分页尝试，分析记录了未解决的覆盖范围并保留了未见过的内容
先前快照中的记录，而不是将它们视为已删除。上市仅证明
固定的公共捆绑合同和所需提交的文件通过了自动检查；它不是一个
人工审核、安全审核、运行时冒烟测试、质量评分、发布者身份检查或
官方认可。标记为 `community-reviewed` 的较旧记录保留其历史记录
出处。

公共指标意味着 **CLI 报告的已完成安装**。它不是独特的用户，GitHub克隆
流量、活跃使用情况或直接通过 Git 或本机 DSH 命令执行的安装。

公共安装程序是 npm 上的 `dshpub` 包。使用`npx dshpub`运行它。

## 质量门

```bash
npm run lint
npm run test
npx playwright install chromium
npm run e2e
npm run build
```

一次性 Playwright 安装使目录过滤器 E2E 独立于机器系统
浏览器。 CI 安装相同的 Chromium 版本及其所需的操作系统依赖项。

`npm run eval` 保持独立，因为它可能调用真实模型并使用凭证。

## Cloudflare 部署

Worker 将 `apps/web/dist` 作为静态资产，并且首先仅针对 `/` 和 `/api/*` 运行。插件
源代码和文档位于 GitHub。 D1商店安装事件计数器并提交作业状态；
它从不存储 GitHub 应用程序私钥、安装令牌或工作流程步骤凭据。
生产工人构建监视 `dsh-pub/dsh-pub` `main` 上的每条路径，运行 `npm run build`，并且
在一个 Worker 中部署静态资产、HTTP API、D1 绑定和 `PluginSubmissionWorkflow`。

插件提交所需的运行时绑定是：

### 约束·目的
- **绑定**：`TURNSTILE_SITE_KEY` · **用途**：返回到提交页面的公共站点密钥
- **装订**：`TURNSTILE_SECRET_KEY` · **紫色