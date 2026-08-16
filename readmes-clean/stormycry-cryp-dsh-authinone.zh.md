# dsh-AuthInOne

[English](README.md) | 简体中文

![dsh-AuthInOne 封面](docs/assets/cover.png)

dsh-AuthInOne 是 DeepSeek Harness 的 Provider 与用量插件，把账号登录、API 与自定义 OpenAI-compatible Provider、模型切换、仅面向纯文本主模型的可选视觉兜底、Token 用量和费用统计放进 DSH 原生的「模型」与「用量」设置页。

模型越接越多，登录方式和账单也越攒越乱，dsh-AuthInOne 把这些麻烦收进 DSH 的「模型」和「用量」两页里，让蓝色大肥鱼安心开饭，也让你看清每一次调用花了多少。

OpenAI Codex 使用带 state、S256 PKCE 与 loopback callback 的浏览器 OAuth。Kimi Code 打开 Provider 返回的完整授权链接，底层仍是 RFC 8628 device flow；短码已在链接内，用户通常只需登录并确认授权。xAI Grok、Anthropic、GitHub Copilot、Command Code、Cursor、Google Antigravity 与 Kiro 均明确标为实验性兼容。本机安装后的 Host 已逐项到达相应授权边界并停在用户确认之前；mock／fixture 测试覆盖换取凭据或轮询、refresh token 轮换、拒绝、超时、取消、登出、模型路由和凭据脱敏。

> **Alpha `v0.2.0-alpha.4`** · 精确兼容目标为官方 DSH `47f9438` · 自包含引导程序内部调用官方 DSH 插件命令，并让 Web 回到原端口 · [Release notes](docs/releases/v0.2.0-alpha.4.md) · MIT · 社区维护，不代表 DeepSeek 或 OpenAI。

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 install --profile web
```

这条命令由本包自己提供。它会先核验正在运行的标准 DSH Host，再调用官方 `dsh plugin` 安装路径，最后让 Host 在同一个 URL 上完成替换。无需修改 DSH 核心、手改 profile、另开第二个 Web 实例或使用临时端口。源码 checkout 和非默认端口写法见[安装、升级与卸载](#30-秒安装升级与卸载)。

如果 AuthInOne 对你有帮助，欢迎在 [GitHub 仓库](https://github.com/Stormycry-cryp/dsh-AuthInOne)点一个 Star，支持项目继续完善。

启动后进入**设置 → 模型**或**设置 → 用量**。浏览器只接收聚合用量、脱敏状态、授权链接和流程需要的用户码。OAuth verifier、授权码、device code、access token 与 refresh token 只留在 Host；插件不会导入 `~/.codex/auth.json`、OpenCodex 状态、Cookie、浏览器存储、OTP 或其他产品的凭据。

给 Agent 的指令　**把文档里的 `pnpm dlx … install --profile web` 当成一个完整操作执行，不要拆成手工 `dsh plugin add` 加自创重启。AuthInOne 引导程序必须完成监听进程核验、官方安装、原 URL 恢复，并报告 `ready` 后再验收 UI。不得另开第二个 Web 实例、改临时端口、修改 DSH、手改 profile YAML 或读取凭据。如果引导程序拒绝未知启动方式或 DSH owner 指纹，停止并展示原错误，不要猜。**

## 适合这些场景

- 想在 DSH 内使用 OpenAI Codex 或 Kimi Code 登录，或明确选择带风险标识的兼容登录。
- 需要继续使用 DSH 原生模型页管理 API Key 或自定义 OpenAI-compatible Provider。
- 想切换未来会话的默认模型，又不替换 DSH 的单会话模型选择器。
- 希望只在当前主模型明确声明为纯文本输入时，用独立配置的视觉模型描述图片。
- 需要可重建的 Provider／模型／工具 Token 用量与可审计费用。

![DSH 模型设置中的 Provider 状态与 OpenAI Codex 官方账号授权](docs/assets/models-dark-desktop.png)

![DSH 用量设置中的 Token 活动、模型消耗与费用统计](docs/assets/usage-light-desktop.png)

其他真实 DSH 截图包括 [Auth 登录弹窗](docs/assets/auth-login-dark.png)、[模型页操作区](docs/assets/models-auth-actions-dark.png)、[深色用量页](docs/assets/usage-dark-desktop.png)、[浅色窄屏](docs/assets/usage-light-narrow.png)、[深色窄屏](docs/assets/usage-dark-narrow.png)与[秒级时间范围](docs/assets/usage-time-range-light.png)。

## 已验证能力

### 能力 · 状态 · 验证方式 · 最低 DSH 环境
- **能力**: OpenAI Codex 浏览器账号授权 · **状态**: **已验证到用户确认边界** · **验证方式**: 真实导航到 `auth.openai.com`；本地 mock issuer 覆盖 callback、state／PKCE、换取凭据、刷新、拒绝、过期、取消、登出、撤销与脱敏 · **最低 DSH 环境**: 官方 DSH `47f9438` 加包内 compat owner
- **能力**: Kimi Code 授权连接 · **状态**: **实验性，已验证到用户确认边界** · **验证方式**: 安装后的 Host 返回 Kimi 完整授权链接，不会把 Host 内的 device code 交给浏览器；短码已在链接中时，界面不再要求用户重复输入 · **最低 DSH 环境**: 官方 DSH `47f9438` 加包内 compat owner
- **能力**: 七种账号兼容流程 · **状态**: **实验性，已验证到用户确认边界** · **验证方式**: xAI、Anthropic、GitHub Copilot、Command Code、Cursor、Antigravity 与 Kiro 分别到达预期授权边界；mock 完成后会注册并在登出时释放对应模型路由 · **最低 DSH 环境**: 官方 DSH `47f9438` 加包内 compat owner
- **能力**: Provider 套餐额度 · **状态**: **上游可取时 best effort** · **验证方式**: Codex、Kimi、xAI、Anthropic、Cursor 与 Antigravity 只向 Remote 投影无凭据用量；上游无返回、字段不完整、不支持或无法可靠算出百分比时，模型页不渲染额度区域 · **最低 DSH 环境**: 官方 DSH `47f9438` 加包内 compat owner
- **能力**: 套餐／API 预设 · **状态**: **可用，并显示厂商限制** · **验证方式**: OpenAI、xAI、Gemini、Anthropic、Kimi Code、GLM Coding Plan 与 ModelStudio／Qwen 预设通过 DSH 写入凭据；GLM 与 Qwen 的使用范围提示仍在页面显示 · **最低 DSH 环境**: 官方 DSH `47f9438` 加包内 compat owner
- **能力**: DeepSeek API Key 与真实模型调用 · **状态**: **仅 API Key** · **验证方式**: 原生 Provider 保持连接；真实 DeepSeek 调用进入用量页，浏览器未接触密钥 · **最低 DSH 环境**: DSH `0.1.0-rc.6`
- **能力**: 自定义 OpenAI-compatible Base URL、请求头与模型映射 · **状态**: **DSH 原生能力** · **验证方式**: 插件保留原生模型卡片，只读取公开 Provider 投影 · **最低 DSH 环境**: DSH `0.1.0-rc.6`
- **能力**: 未来会话默认模型与连接测试 · **状态**: **已验证** · **验证方式**: 安装后的模型页 contribution 与 Host／Remote 链路完成实测 · **最低 DSH 环境**: 官方 DSH `47f9438` 加包内 compat owner
- **能力**: 纯文本主模型的视觉兜底 · **状态**: **已验证** · **验证方式**: PNG/JPEG/WebP/GIF 沿用 DSH `ImageBlock` 引用；多图、原生多模态直通、关闭兜底、失败、恢复与分叉均有无密钥覆盖 · **最低 DSH 环境**: 官方 DSH `47f9438` 加包内 compat owner
- **能力**: 跨会话用量与费用 · **状态**: **已验证** · **验证方式**: 真实 DSH session log 重建出 26,383 Token 的 KPI、热力图、模型、Provider、Token 桶与费用 · **最低 DSH 环境**: DSH `0.1.0-rc.6`
- **能力**: 用量页导航图标 · **状态**: **已验证** · **验证方式**: 包内通用 owner 投影 keyed icon seat；插件注入 currentColor 16 px 三竖线，未知 section 仍使用原生回退 · **最低 DSH 环境**: 官方 DSH `47f9438` 加包内 compat owner

### 账号登录支持矩阵

### Provider · 流程 · 稳定性 · 已验证授权边界 · 刷新／登出／模型路由 · 套餐额度
- **Provider**: OpenAI Codex · **流程**: 浏览器 OAuth，state + S256 PKCE + loopback · **稳定性**: Stable · **已验证授权边界**: `auth.openai.com` · **刷新／登出／模型路由**: 有／有／有 · **套餐额度**: primary 与 secondary window，best effort
- **Provider**: Kimi Code · **流程**: 基于 RFC 8628 的完整授权链接 · **稳定性**: Experimental · **已验证授权边界**: `www.kimi.com` · **刷新／登出／模型路由**: 有／本地登出／有 · **套餐额度**: best effort
- **Provider**: xAI Grok · **流程**: 设备登录 · **稳定性**: Experimental · **已验证授权边界**: `accounts.x.ai` · **刷新／登出／模型路由**: 有／有／有 · **套餐额度**: 周或月窗口，best effort
- **Provider**: Anthropic · **流程**: 浏览器／手动输入兼容登录 · **稳定性**: Experimental compatibility · **已验证授权边界**: `claude.ai` · **刷新／登出／模型路由**: 有／本地登出／有 · **套餐额度**: best effort
- **Provider**: GitHub Copilot · **流程**: 设备登录 · **稳定性**: Experimental compatibility · **已验证授权边界**: `github.com` · **刷新／登出／模型路由**: 有／本地登出／有 · **套餐额度**: 未提供
- **Provider**: Command Code · **流程**: 浏览器 loopback 兼容登录 · **稳定性**: Experimental compatibility · **已验证授权边界**: `commandcode.ai` · **刷新／登出／模型路由**: 按返回的账号凭据刷新／本地登出／有 · **套餐额度**: 未提供
- **Provider**: Cursor · **流程**: 浏览器 PKCE 兼容登录 · **稳定性**: Experimental compatibility · **已验证授权边界**: `cursor.com` · **刷新／登出／模型路由**: 有／本地登出／有 · **套餐额度**: best effort
- **Provider**: Google Antigravity · **流程**: 浏览器 PKCE 兼容登录 · **稳定性**: Experimental compatibility · **已验证授权边界**: `accounts.google.com` · **刷新／登出／模型路由**: 有／本地登出／有 · **套餐额度**: best effort
- **Provider**: Kiro · **流程**: Builder ID 设备登录 · **稳定性**: Experimental compatibility · **已验证授权边界**: `view.awsapps.com` · **刷新／登出／模型路由**: 有／本地登出／有 · **套餐额度**: 未提供
- **Provider**: Qwen 账号 OAuth · **流程**: 已停止 · **稳定性**: Unsupported · **已验证授权边界**: 不提供启动操作 · **刷新／登出／模型路由**: 无 · **套餐额度**: 无

“本地登出”表示当前核验到的兼容协议没有可用 revoke endpoint，插件会先删除自己的 DSH credential 并注销模型路由。浏览器不会拿到保存的凭据。稳定性标签描述实现风险，不代表厂商赞助、认证或合作。

## 30 秒安装、升级与卸载

使用包内引导程序安装或升级不可变 tag。

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 install --profile web
```

引导程序会发现 `http://127.0.0.1:3080/` 的唯一监听进程，确认它是标准 DSH Host，校验精确支持的 DSH owner 产物，通过官方 DSH 插件命令完成 add，再安排一个脱离当前 Host 的同端口替换进程。安装命令会在旧 Host 停止前返回；浏览器可能短暂断开，但必须由原 URL 恢复。

当前 DSH 使用非默认 loopback 端口时，传入准确 URL。

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 install --profile web --url http://127.0.0.1:3090/
```

DSH 从源码 checkout 启动时，引导程序通常会从监听进程的工作目录自动识别；运维人员也可以显式传入。

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 install --profile web --source-root /path/to/deepseek-harness
```

原 URL 恢复后可读取脱离进程的状态。

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 status --profile web
```

卸载也走同一条自包含路径。

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 uninstall --profile web
```

引导程序只接受不含凭据的 loopback HTTP origin，以及标准 DSH 启动方式：已安装的 `dsh` 可执行文件，或显式／自动识别的 DSH 源码根目录。自动监听核验目前支持 macOS 与 Linux，并要求系统提供 `lsof`。端口存在多个监听进程、监听进程不是 DSH、owner 产物未知或启动来源无法核实时，会在停止 Host 前明确失败；不会换到另一个端口。脱离进程的状态文件只写在所选 profile 下，不序列化环境变量或凭据。

profile dependency 与 Bundle row 仍由官方 DSH CLI 维护。不要复制 `lib/`、创建 workspace link、手改 profile YAML 或手动应用 patch。卸载会释放页面、模型页 contribution、Remote namespace、Host service、样式与监听器。DSH session、插件 settings 与 credential reference 会保留，删除数据必须另行明确执行。完整生命周期和失败规则见[自包含安装与同端口重启设计](docs/design/self-contained-installer.md)。

## 模型页与官方 Auth

API Key Provider 的新增、编辑与删除仍在 DSH 原生卡片完成。自定义 Base URL、请求头、协议、模型映射和端点模型发现也归原生页面。AuthInOne 补充紧凑的连接与默认路由区域，并在两个原生新增 Provider 按钮上方放置全宽的**添加 Auth 登录**和**添加套餐／API Key**。单会话切换仍使用 DSH 会话模型选择器。

模型摘要只显示已经配置的 API／套餐／自定义 Provider 与已持久化的 Auth 账号。Auth 目录只留在「添加 Auth 登录」弹窗；取消、失败、过期或从未开始的条目不会生成占位卡。账号连接后摘要会立即刷新，Auth 实例使用自身模型 adapter 与退出流程，不会误走通用 Base URL 测试。

每个 Auth 入口共用一套 Host 登录事务，覆盖开始、脱敏状态、取消、可选一次性输入、刷新、登出与 dispose。浏览器／loopback 流程把 state 与 PKCE verifier 留在 Host。设备流程把 device code 留在 Host，只展示验证链接和 user code。凭据先写入 DSH credentials，随后才注册模型 adapter；终止性刷新失败或登出会注销路由。取消若撞上凭据写入，会补偿删除。远端撤销在本地删除以后 best effort 执行，并受超时限制。

OpenAI Codex 的协议值对照其公开 [login server](https://github.com/openai/codex/blob/main/codex-rs/login/src/server.rs)、[auth manager](https://github.com/openai/codex/blob/main/codex-rs/login/src/auth/manager.rs)和 [PKCE helper](https://github.com/openai/codex/blob/main/codex-rs/login/src/pkce.rs)。Kimi 设备轮询遵循 RFC 8628 的 pending 与 `slow_down` 语义。其余兼容流程沿用经过核验的 Provider／公开客户端行为，并保持 Experimental 标识。

套餐／API 入口包含 OpenAI API、xAI API、Google Gemini API、Anthropic API、Kimi Code 套餐 Key、GLM Coding Plan 与 ModelStudio／Qwen Coding Plan。GLM 与 Qwen 预设保留厂商的支持工具或交互用途限制。API Key 是独立连接方式，永远不会算作账号 Auth。

连接测试由 Host 请求已配置 OpenAI-compatible 端点的 `/models`。带凭据请求会拒绝重定向，响应正文按流式字节上限读取。Client 只收到成功状态、延迟、模型 id 或经过归类的失败信息，不会收到请求头、上游响应正文或凭据。

## 视觉兜底

视觉兜底默认关闭，入口位于**设置 → 模型**。用户只能选择已经激活、且 DSH 适配器明确声明支持 `image` 输入的 Provider 与模型。仅当主模型明确不包含图片能力时兜底才运行；主模型声明支持图片时原请求保持直通，能力未知也不会被插件擅自判成纯文本。

面对纯文本主模型，插件把原始 DSH 附件引用、兜底路由、提示版本、返回描述与 Provider 实报 usage 记录为带插件来源的普通 DSH 持久消息；真正发往主模型的请求只把图片块替换成已经记录的文字描述。恢复与分叉复用该描述；切换兜底模型只影响之后的新图片，不重跑已有历史。

本期输入范围与 DSH 第一版图片附件完全一致：PNG、JPEG、WebP 与 GIF。不支持音频、视频、PDF、图片生成、浏览器 object URL、Host 路径或插件自有 base64 存储。图片字节由 DSH 附件存储持有和校验，Provider 适配器通过 DSH Host credentials 解析凭据；视觉设置 RPC 不接收凭据。

视觉辅助调用在用量页单独显示为“视觉辅助调用”和“视觉辅助 Token”，同时保留真实 Provider／模型归属。Provider 没有返回可靠 usage 时保持未知，没有价格时保持未定价。无凭据或上游失败时不会继续把不可用图片请求交给纯文本主模型，而是返回可恢复的 `VISION_FALLBACK_FAILED`，且不把上游响应细节写入会话日志。

## 用量筛选与统计口径

- 时间、Provider 与输出价格共享同一查询上下文，驱动 KPI、热力图、模型 Token 消耗、榜单、Token 桶和费用。
- 时间采用界面所示 IANA 时区内的 `YYYY-MM-DD HH:mm:ss` 闭区间。Host 转成确定的 UTC `[start, endExclusive)` 查询。近 7 天、近 15 天与近 30 天只填充范围，仍由用户点击应用。
- 输出价格只读取 USD／1M output Token 目录桶。区间为 `[0,1)`、`[1,5)`、`[5,15)`、`[15,+∞)`与未定价，互不重叠。缺价或非 USD 都归入未定价，不做静默换汇。
- 刷新保留全部筛选。失败会留在页面上，不会用空结果覆盖最后一次成功数据。
- 每日 Token 活动固定以最近 365 个日期组成七行日历；没有匹配调用的日期仍保留空格，每周与累计模式沿用既有聚合语义。
- 模型调用按实际事件时间统计；工具调用是另一个维度。当前 DSH 并不为每条工具事件记录权威 owner plugin，页面只显示持久工具名，不猜插件归属。
- 总 Token 等于 uncached input、output、cache read 与 cache write 之和。reasoning 单独显示，避免 Provider 已把它计入 output 时重复计算。缺失桶保持未知。
- 低于 1M 的 Token 使用 locale 千分位，1M 到 1B 使用 `M`，1B 以上使用 `B`，完整数值仍保留在 title 与无障碍标签中。

内置 `deepseek-usd-2026-08-14` 目录只包含 2026-08-14 从 [DeepSeek 官方价格页](https://api-docs.deepseek.com/quick_start/pricing)核验的 DeepSeek-V4-Flash 与 DeepSeek-V4-Pro 美元记录。每行都有来源 URL、核验／更新时间、生效日期、币种和明确 Token 桶费率。拿不到可靠价格时显示未知或部分费用，不伪造 0，也不会借用另一个 Provider 的价格。

## 安全与数据边界

AuthInOne 不创建独立数据库。统计（含视觉辅助来源与 Provider 实报 usage）从 DSH session 重建，非敏感覆盖项写入插件自己的 DSH settings namespace，OAuth 与 API 凭据继续归 DSH credentials。图片字节留在 DSH 附件存储，不会复制进插件 settings。插件不扫描用户目录、浏览器存储、Keychain、Codex／OpenCodex 文件、`.env` 或无关数据库。

授权 URL 与 device user code 是当前登录事务的公开操作指引。Remote DTO 没有 verifier、authorization code、device code、access token、refresh token、原始身份、上游正文或 credential value。自动测试会检查这些字段不会进入 Remote 或日志。仓库截图不包含授权 URL、账号、token、user code 或 API Key。

Provider 响应同时受请求超时和流式字节上限约束。带凭据的连接测试拒绝重定向。alpha.2 安全 diff scan 完整检查 74 个新增或修改项，发现两项中危网络边界问题，并在发布前用 Node 24 复现与定向测试确认修复。

## 兼容性

### DSH 环境 · Host／用量页 · 模型状态与默认路由 · 添加 Auth 登录 · 用量图标
- **DSH 环境**: 官方 DSH `47f9438`，标准添加一次 AuthInOne · **Host／用量页**: 可用 · **模型状态与默认路由**: 可用 · **添加 Auth 登录**: 可用 · **用量图标**: 三竖线插件图标
- **DSH 环境**: 未知／新版 DSH owner artifact · **Host／用量页**: 安装明确失败 · **模型状态与默认路由**: 不挂载 · **添加 Auth 登录**: 不挂载 · **用量图标**: 不挂载
- **DSH 环境**: 卸载插件后 · **Host／用量页**: 消失 · **模型状态与默认路由**: 仅原生页面 · **添加 Auth 登录**: 消失 · **用量图标**: 消失

官方 DSH `47f9438` 没有暴露模型页与设置导航所需的三项通用组合 seat。本包因此携带官方 Settings General 与 Models 两个 runtime owner 的精确 47f 衍生版本。Bundle patch 只禁用这两个官方 row，并从同一个 AuthInOne 包挂载兼容 owner；新增内容仅为 `settings.models.insights`、`settings.models.actions` 与 keyed `settings.section.icon` 投影。Auth、Provider、用量与视觉业务仍由独立的 AuthInOne registration 持有。

Host 会在创建插件状态前核对官方 owner 的版本和 client SHA-256，Client 也会拒绝已经存在的 seam。Owner 变化或 DSH 已有原生 seam 时会明确报 `AUTH_IN_ONE_COMPAT_UNSUPPORTED_DSH`，不会静默覆盖或重复注册。卸载后，Bundle 覆盖层与兼容 row 一起消失，官方 owner 自动恢复。全程不 patch DOM、不使用 `--patch`、不手改 profile，也不修改 DSH checkout。DeepSeek MIT 声明与精确来源见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

[架构与插件边界不变量](docs/architecture.md)记录了插件自持内容、core 唯一允许的通用 seam、dispose、降级与自动门禁。

## 本插件没有声称什么

- 它不是 DeepSeek、OpenAI 或任何模型厂商的官方产品，也不代表厂商背书。
- 它没有声称每种兼容登录都稳定或得到厂商背书。七个入口明确标为 Experimental，Qwen 账号 OAuth 已停止且不可用。
- 它不替换 Models 业务、附件管线、session log 或会话模型选择器；仅在精确 DSH `47f9438` 上用源码衍生 compat owner 替换两个 Settings owner row，从同一 Bundle 保留原生行为并增加通用 seat。
- 当适配器没有提供模态元数据时，它不推断模型支持或不支持视觉。
- 它不把图片理解范围扩展到音频、视频、PDF 或图片生成。
- 它不会伪造缺失 Token、价格、币种换算、工具归属或登录成功。

## 本地开发

使用 Node `^22.19` 或 `>=24` 与锁定的 pnpm 项目。

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
DSH_SOURCE_ROOT=/path/to/deepseek-harness pnpm verify:boundaries
pnpm build
pnpm pack --dry-run
```

仓库提交 `lib/`，因为 GitHub 安装不会运行构建。本包没有 `prepare`，安装时不需要 lifecycle script 权限。

## 来源与许可证审计

AuthInOne 业务逻辑、credential representation、settings 字段、测试、README 文案与产品交互文案均为本仓库独立编写。兼容 owner runtime 是官方 DSH `47f9438` Settings General／Models 源码的明确归因 MIT 衍生版本，见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。本机 OpenCodex 源码只用于职责与失败状态对照，详情见 [clean-room 对照](docs/design/opencodex-auth-comparison.md)与 [alpha.2 来源审计](docs/provenance.md)。

以下仓库只用于能力碰撞与公开 seam 研究　[usage-report](https://github.com/csiroqa/dsh-plugin-usage-report)、[openai-codex-auth](https://github.com/yoke233/dsh-openai-codex-auth)、[codex-provider](https://github.com/Hu9956/dsh-codex-provider)、[polyglot](https://github.com/Jesse-njx/dsh-polyglot)、[usage-meter](https://github.com/cute-baobao/dsh-usage-meter)、[cost-ledger](https://github.com/suimi8/dsh-cost-ledger)与 [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)。没有复制或 vendoring 它们的源码、README、CSS、组件结构、schema 或测试。

运行时依赖为 Zod（MIT）。构建期 Provider transport 依赖为 `@earendil-works/pi-ai` 0.82.1（MIT），它被打入已提交的 Host artifact，不会进入 DSH profile 的运行时依赖。Cursor 兼容流程使用 `@cursor/sdk` 1.0.24，遵循 Cursor SDK License 与 Terms of Service；它被打入 Host artifact，并保持 Experimental。开发工具还包括 React、tsdown、Vitest 与 Testing Library（MIT）、TypeScript（Apache-2.0）和 Lightning CSS（MPL-2.0）。本仓库使用 [MIT](LICENSE)。

DeepSeek、OpenAI、Codex 与其他 Provider 名称和商标归各自权利人所有。页面中的名称只说明兼容性，不代表赞助、认证或背书。