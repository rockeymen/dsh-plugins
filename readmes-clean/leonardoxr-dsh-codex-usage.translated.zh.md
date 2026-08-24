#dsh-codex-usage

用于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI] 的精美 OpenAI Codex 计划使用指示器。

该插件保留了标准的设置齿轮和标签，同时在最右侧添加了上下文计样式的环。该环包含 OpenAI 标记，并在悬停或键盘焦点时打开详细的配额面板。

## 特点

- 使用与对话上下文表相同的 28 px 几何形状和 DSH 设计标记的原生使用环。
- 每个 Codex 限制桶的完整配额详细信息：滚动窗口、使用百分比、重置时间、计划类型、积分、支出控制和重置积分。
- 默认情况下五分钟轮询，可通过捆绑行进行配置。
- 新鲜的悬停数据，具有 250 毫秒去抖、一个正在进行的请求、共享的五分钟轮询缓存、更短的强制悬停缓存和故障限制。
- 最后良好的回退，因此临时提供商或网络故障不会删除有用的数据。
- 无浏览器凭据：OAuth 和凭据刷新保留在官方 Codex 应用程序服务器进程内。
- 仅环回 API 路由和白名单规范化器，可删除电子邮件、ID、令牌和未知提供商字段。
- Windows、macOS 和 Linux 命令启动，包括 Windows npm PowerShell 垫片。

## 要求

- Node.js 20 或更高版本
- PNPM 10
- DeepSeek Harness 0.1.1-rc.2或兼容
- 最近的 OpenAI Codex CLI 具有稳定的应用程序服务器 API（使用 Codex CLI 0.149.0 进行测试）
- 使用 ChatGPT 计划登录 Codex（运行 Codex 登录）

## 从这个结帐处安装

构建包：

~~~嘘
即插即用安装
pnpm 运行检查
~~~

从此目录将其添加到 DSH 配置文件中：

~~~嘘
dsh插件--配置文件网页添加。
dsh --配置文件网络 --dump-config
dsh 网页
~~~

DSH主机重启后刷新现有Web页面。客户端包由DSH的客户端模块系统加载；单独的 Vite 服务器既不需要也没有用。

删除它：

~~~嘘
dsh 插件 --profile web 删除 dsh-codex-usage
~~~

### 安装打包的工件

tarball 附带预构建的主机和惰性 CJS 客户端工件，避免安装时构建批准：

~~~嘘
PNPM 包
dsh插件--配置文件网页添加./dsh-codex-usage-0.1.5.tgz
~~~

对于 Git 主机安装，pnpm 10 需要配置文件来允许此包的准备脚本。固定提交并遵循 DSH/pnpm 打印的确切的allowBuilds指令。

## 配置

所有四个字段均可在 **设置 → 插件 → Codex 使用** 中找到。更改在本地暂存直至保存，通过 DSH 设置保留，并在 DSH Web 重新启动后生效。配置文件行仍然是保存的用户覆盖下方的基本配置。

该捆绑包插入此行：

~~~yaml
- id：法典用法
  名称：dsh-codex-usage
  配置：
    刷新间隔：300000
    悬停刷新最小年龄：30000
    请求超时时间：15000
    codex命令：codex
~~~

覆盖配置文件的 cordis.patch.yml 中的整行以更改组合层基础。后面的层替换一行的完整配置值；保存的设置 UI 值会覆盖该基础。

### 字段·默认值·含义
- **字段**：refreshIntervalMs · **默认**：300000 · **含义**：后台轮询间隔；至少 60 秒。
- **字段**：hoverRefreshMinAgeMs · **默认**：30000 · **含义**：再次悬停刷新之前的最小年龄；至少 5 秒。
- **字段**：requestTimeoutMs · **默认**：15000 · **含义**：每个 Codex JSON-RPC 请求的超时。
- **字段**：codexCommand · **默认**：codex · **含义**：Codex 可执行文件名称或绝对路径。

## 它是如何工作的

1、Host插件注入DSH的webServer服务并注册GET /api/plugins/codex-usage。
2. 第一次读取时，它会启动一个托管 codex app-server --listen stdio:// 进程。
3.它执行initialize/initialized，然后调用稳定方法account/rateLimits/read和account/read。
4. 严格规范化器将仅限配额的数据返回到环回浏览器路由。
5. 浏览器在 sidebar.footer.action 中注册一个独立的操作，在“设置”行的右边缘保留空间，并保持内置“设置”按钮及其行为不变。
6. 浏览器轮询配置的节奏，并在 250 毫秒悬停去抖后请求合并刷新。

客户端神器不是普通的浏览器ESM。 tsdown.config.ts 发出 DSH 所需的惰性 CJS 注册。 React 和 DSH UI 包保持外部状态并通过 DSH 的客户端模块表进行解析，从而防止重复的 React 运行时。

## 安全和隐私

- 该插件从不读取 ~/.codex/auth.json 并且从不直接处理 OAuth 令牌。
- Codex 拥有凭证存储、密钥环支持、令牌刷新和帐户选择。
- Web 路由仅接受来自环回客户端的 GET，并拒绝跨站点 Origin、Referer 和 Fetch Metadata 信号。
- 响应忽略电子邮件、帐户/工作区 ID、用户 ID、访问令牌、刷新令牌、原始提供程序有效负载和未知字段。
- 错误状态仅保留标准化的最后良好快照。
- 提供者路由不可配置，避免任意经过身份验证的代理。

## 发展

~~~嘘
pnpm 运行类型检查
pnpm 运行测试
pnpm 运行构建
pnpm 运行包：检查
~~~

默认套件会跳过实时提供商测试。安装并登录 Codex 后运行它：

~~~powershell
$env:CODEX_LIVE = '1'
pnpm exec vitest 运行测试/codex-live.spec.ts
~~~

## 参考文献

- [DSH：你的第一个插件](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/)
- [DSH：打包并安装](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/publish)
- [DSH：添加设置卡](https://deepseek-harness.github.io/deepseek-harness/en/reference/cookbook/adding-a-settings-card)
- [DSH：客户端模块](https://deepseek-harness.github.io/deepseek-harness/en/reference/subsystems/client-modules)
- [Codex 应用程序服务器文档](https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md)
- [法典速率限制响应](https://github.com/openai/codex/blob/main/codex-rs/app-server-protocol/schema/typescript/v2/GetAccountRateLimitsResponse.ts)
- [法典快照类型](https://github.com/openai/codex/blob/main/codex-rs/app-server-protocol/schema/typescript/v2/RateLimitSnapshot.ts)