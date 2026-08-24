# DSH 插件中心

适用于版本化 DeepSeek Harness 的社区注册表、发布者控制台和 CLI
插件和配置文件。该项目是独立且非官方的。

[访问DSH插件中心](https://dshpluginhub.ai)·
[浏览插件](https://dshpluginhub.ai/plugins)·
[探索简介](https://dshpluginhub.ai/profiles)·
[安装 CLI](https://www.npmjs.com/package/@dsh-plugin-hub/cli)

DSH插件中心让用户发现DSH插件，共享完整的版本锁定
配置文件，通过 `dsh-hub` CLI 应用它们，并回滚到可恢复的
本地修订。从 [dshpluginhub.ai](https://dshpluginhub.ai) 开始。

## 安装

直接使用 CLI：

```bash
npm install --global @dsh-plugin-hub/cli
dsh-hub --help
```

或者将 Hub 工具添加到 DSH 配置文件中：

```bash
dsh plugin --profile web add @dsh-plugin-hub/dsh-plugin
```

## 实现了什么

- 公共插件搜索、详细信息页面、屏幕截图、兼容性和确切的安装规范
- 可编辑的个人资料草稿和不可变的、内容寻址的个人资料发布
- 用于包、版本和配置文件的 JSON 注册表 API
- `dsh-hub` CLI 用于捕获、共享、精确应用、便携式导入和回滚
- DSH 插件工具和用于确认计划/应用自动化的代理技能
- WorkOS AuthKit 发布者帐户
- 自动 npm 发现、清单验证和版本历史记录同步
- 公开一次性包提交和登录立即同步
- 可选的GitHub应用程序存储库声明和列表管理
- 不可变的发布版本；列表副本可以独立刷新
- Cloudflare Workers 上的 Vinext SSR/RSC Web shell
- 区域设置感知的公共 HTML 和 Hub API 边缘缓存
- 同源缓存 Gravatar 插件图标
- Cloud Run 上的 Go Hub 后端具有 PostgreSQL 持久性

## 工作区

```text
app/                 vinext / Next.js routes and publisher UI
components/          shared server and client UI modules
lib/                 Hub adapters, auth, i18n, SEO and edge policy
packages/schemas/    shared Zod wire and manifest schemas
packages/registry/   version and profile-order resolution
packages/cli/        dsh-hub command-line client
examples/             copyable, schema-tested starter bundles
```

Web shell 保留在 vinext 上，因此它部署为 Cloudflare Worker。便携式
注册表逻辑位于工作区包中，并且不依赖于 Cloudflare。
参见[`docs/adr/0001-retain-vinext-cloudflare-worker.md`](docs/adr/0001-retain-vinext-cloudflare-worker.md)。
当前的运行时映射和所有权规则位于
[`docs/architecture.md`](docs/architecture.md)。

## 本地开发

要求：Node.js `>=22.13.0` 和 pnpm `10.33.0`。

```bash
pnpm install
cp .env.example .env
pnpm dev
```

运行所有门：

```bash
pnpm check
```

全套套件构建了 Worker 和便携式软件包并运行 Web、适配器、
身份验证、模式、注册表和 CLI 测试。

## 集线器 API

```text
GET /api/v1/packages?q=vision&limit=20
GET /api/v1/packages/resolve?name=dsh-conversation-exporter
GET /api/v1/profiles?limit=20
GET /api/v1/profiles/{slug}
GET /api/v1/profiles/{slug}/releases/{version}/download
```

响应包括确切的源元数据、兼容性、HMR 行为和
订购的配置文件包。公共读取可缓存 60 秒且陈旧
重新验证。 Go 后端拥有这些端点；浏览器请求使用
web shell 的同源 `/api/*` 适配器。

## 命令行界面

```bash
dsh-hub init my-plugin --repository your-name/my-plugin
dsh-hub validate my-plugin
dsh-hub search vision
dsh-hub info dsh-conversation-exporter --version latest
dsh-hub install dsh-conversation-exporter --profile web
dsh-hub profile search team
dsh-hub profile apply  --profile web
dsh-hub profile share <slug> --profile web --version 1.0.0
dsh-hub profile import ./team-profile-1.0.0.dshprofile --profile web
dsh-hub profile history --profile web
dsh-hub profile rollback --profile web
```

安装执行使用参数数组而不是 shell。申请成功
保持官方 Profile 目录干净并将 Hub 状态写入
`~/.dsh/.hub/installations//current.json`。释放锁定确切的
DSH 运行时、插件版本、来源、完整性和顺序。应用构建一个
暂存配置文件，通过固定的验证其结构和组合配置
官方 DSH CLI，然后自动切换目标。以前的完整个人资料
目录仍然可用于回滚。

`.dshprofile` 下载是一个包含发布元数据的便携式配方，
`package.json` 和 `cordis.patch.yml`。它从不嵌入插件代码、凭据、
输入值、会话数据或日志。参见[`docs/profile-v1.md`](docs/profile-v1.md)
对于 V1 合约和 V2 边界。

`dsh-hub init` 创建一个三文件、模式有效的捆绑启动器并拒绝
覆盖现有文件。 npm名称时添加`--name @scope/my-plugin`
与目标目录不同。

`dsh-hub validate` 检查包身份、确切版本、列出元数据、
GitHub 存储库和本地 Cordis 补丁在任何内容到达 npm 之前。

## 出版

1. 将包含有效 DSH 捆绑包或配置文件声明的包发布到 npm。
2. 等待自动发现，或将其包名称粘贴到公共目录中。
3. 如果您想立即获得结果，请登录 `/dashboard` 并选择“立即同步”。
4.通过GitHub App连接软件包存储库以声明和编辑其列表。

中心读取每个已发布的版本，验证每个清单并记录
npm 的确切 tarball URL 和完整性。关键词只发现候选者；一个
有效的 `dsh.bundle` 或 `dsh.profile` 清单控制目录准入。枢纽
保留历史版本并将 npm 中缺失的版本标记为已撤回。
它不托管 tarball。

有关清单和安全性，请参阅 [`docs/publishing.md`](docs/publishing.md)
合同。完整的最小包可在
[`examples/example-hello`](examples/example-hello)。

新队友应该从[`docs/architecture.md`](docs/architecture.md)开始。

## 分期

登台使用 Worker `deepseek-harness-plugin-hub-staging`（共享集线器）
由`HUB_API_ORIGIN`配置的后端原点，以及
`https://staging.dshpluginhub.ai`。

```bash
pnpm deploy:staging
```

秘密名称记录在 `.env.example` 中。与`wrangler secret
put`一起存放；永远不要承诺他们的价值观。

Worker 和 Go Hub 共享一个内部持有者凭证。仅旋转它
下面的协调零停机命令；它举办了第二次Cloud Run
token、更新Cloudflare、推广新版本、验证公众
在删除过渡令牌之前进行探测：

```bash
pnpm rotate:internal-token
```

该命令需要经过身份验证的 `gcloud` 和 `wrangler` 会话
添加 Secret Manager 版本和更新两个生产服务的权限。
`GET /api/internal-auth/health`是一款无存储、无副作用的可操作
probe: `204` 表示当前的Worker Secret被Hub接受； `503`
意味着这两个部署需要关注。
生产部署会在 Wrangler 完成后自动运行此探测器，因此
秘密不匹配在部署结果中可见，而不是在下一个用户中可见
登录。探针可容忍长达约 30 秒的 Worker 传播，同时
持续的非 204 和网络响应仍然失败。

使用 AuthKit 托管 UI 时，将 `/sign-in` 配置为 WorkOS 登录
端点 (`initiate_login_uri`) 并将 AuthKit 外部登录 URI 留空。
外部登录字段是为提供自己的应用程序保留的
身份验证 UI 并完成 `external_auth_id` 流程。

## 安全不变量

- WorkOS 会话保护仪表板和管理 API。
- Web shell没有数据库绑定；所有产品持久性属于
  转到 Hub 后端。
- npm 响应绑定到请求的包名称和确切的清单版本。
- npm 搜索关键字仅创建候选； DSH 舱单是入场口。
- 公共清单仅包含与安装相关的包字段； npm 用户，
  维护者和操作元数据在存储之前被丢弃。
- npm tarball 源是 HTTPS URL，并保留 npm 完整性元数据（如果存在）。
- 自动发现的包裹开始无人认领。
- 通过 GitHub 应用程序访问存储库证明了发布者的声明。
- 已发布的包版本是不可变的。
- GitHub 集成是可选的。
- GitHub OAuth 状态是 HMAC 签名的、短暂的、用户绑定的和随机数绑定的。
- 只有当前GitHub用户可以后才接受回调`installation_id`
  列出该安装及其存储库。
- GitHub 用户访问令牌和安装令牌永远不会存储。
- GitHub 应用程序私钥和 OAuth 客户端机密是工作人员机密。
- 公共出版物不包括私人存储库。
- 滥用报告使用 Turnstile，并由 Hub 后端进行验证和保存。