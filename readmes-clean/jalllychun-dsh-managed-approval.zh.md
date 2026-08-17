# dsh-managed-approval

这是一个为 DeepSeek Harness（DSH）提供 Codex 风格模型代审的插件。它在
DSH 原生的 Read Only、Workspace Write 和 Full Access 之外增加第四个权限
preset：**Approve for me**，中文可以理解为“帮我批准”。

选择 **Approve for me** 后，一个不能调用工具的单次 reviewer 会结合操作风险
和用户可信授权上下文判断是否执行。允许的操作只放行一次；确定性策略或模型拒绝
会直接阻止工具调用，并要求 Agent 采用实质上更安全的方案；只有 reviewer 超时、
异常或返回格式错误等基础设施故障，才回落到 DSH 原生人工审批。

> 这是一个独立社区项目，与 DeepSeek、OpenAI 不存在隶属、背书或维护关系。
> 当前版本仍是 beta，并将 DSH peer dependencies 固定在 `0.1.0-rc.6`。

## 为什么选择这个插件

DSH 已有多个减少审批打断的社区插件。本项目面向希望使用无工具 reviewer，并在
DSH 已有审批和 MCP 调用上获得 Codex-inspired 决策语义的用户，而不是提供无限制
自动放行，或只维护 Shell 命令白名单：

- 底层 sandbox 保持不变；
- 明确只读的搜索和检查通常继续执行，疑似产生副作用或无法判断的 MCP 可以被提升到
  审批链；
- 自动许可一律是 `allowed-once`；
- 策略或 reviewer 明确拒绝时会停止操作，并要求 Agent 改走实质上更安全的方案；
- reviewer 超时、格式错误、route 缺失或其他基础设施故障才回落到 DSH 原生人工审批。

“接近 Codex”描述的是交互和决策目标，不代表官方兼容。Codex 可以依据工具
annotations 和配置的 approval mode 判断哪些 MCP 需要审批；DSH rc.6 会在本插件的
hook 之前丢弃这些 annotations，所以当前实现只能使用保守的工具名判断和用户规则
作为兼容层。参见官方 [Codex Auto-review 文档](https://learn.chatgpt.com/docs/sandboxing/auto-review)
和 [MCP 审批配置](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)。

### 应该安装哪个审批插件？

下表基于链接中的已发布版本或仓库 revision，并于 2026-08-17 完成核对。社区项目
后续可能变化，安装前应复查最新 release notes。同一个 DSH profile 建议只安装
一个权限代审插件，避免出现重复 preset 或多个 approval answerer 竞争。
[awesome-dsh-plugin 精选目录](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
还收录了其他审批和权限工具；下表只比较最接近的自动代审方案。

### 插件 · 自动代审边界 · 拒绝与故障行为 · 更适合
- **插件**: **`dsh-managed-approval`（本项目）** · **自动代审边界**: DSH 已有审批，以及经风险分类提升的疑似副作用或未知 MCP；DSH 原生工具保留自身策略 · **拒绝与故障行为**: 明确拒绝会停止操作并要求改走实质更安全的方案；reviewer 故障转人工；连续拒绝三次中止当前 turn · **更适合**: 想要低配置、会话级、覆盖 MCP 的 Codex-inspired 体验
- **插件**: [`dsh-auto@eb40940`](https://github.com/simon300000/dsh-auto/tree/eb409400843e195886edb45d9a75d2188120a2b6) · **自动代审边界**: 处理已有 `approval/request`；每次请求启动受限 reviewer，并允许有限次数的 `read`、`glob`、`grep` 调查 · **拒绝与故障行为**: 模型拒绝和 reviewer 基础设施故障都会阻止请求；连续拒绝三次中止当前 turn · **更适合**: 需要有界只读调查，以及结构化风险和用户授权判断
- **插件**: [`dsh-auto-review@0.5.0`](https://github.com/PerryLink/dsh-auto-review/tree/v0.5.0) · **自动代审边界**: 通过逐工具 `ai` / `human` / `never` 策略选择已有审批；reviewer 可使用只读检查工具 · **拒绝与故障行为**: 拒绝会阻止操作；reviewer 故障按可配置 fallback 处理，默认拒绝；拒绝熔断可配置 · **更适合**: 需要细粒度工具路由、持久审计事件、Web review 面板，以及下一次同工具复审的一次性授权上下文
- **插件**: [`dsh-auto-classifier@0.1.14`](https://github.com/PAKIKNOWLEDGE/dsh-auto-classifier/tree/44550f8c38c857b7e05f0440af988fdba486523c) · **自动代审边界**: 在 `auto` preset 下，确定性 `tools/pre-execute` 规则分类每个工具调用；未匹配的 pre-execute 调用可选用 LLM judge，sandbox escalation 则使用规则和默认决策 · **拒绝与故障行为**: deny 规则命中会阻止；未匹配调用和 judge 故障使用 `defaultDecision`，其默认值为 `allow` · **更适合**: 需要面向无人值守的规则驱动运行、可选语义判断、拒绝上限和 Git snapshot
- **插件**: [`dsh-approve-for-me@0.1.0-beta.3`](https://www.npmjs.com/package/dsh-approve-for-me/v/0.1.0-beta.3) · **自动代审边界**: 已有的 Shell / PowerShell sandbox escalation，且必须匹配配置的 literal command prefix；默认正向列表为空 · **拒绝与故障行为**: 未匹配、高风险、reviewer 拒绝和 reviewer 故障均转人工 · **更适合**: 想维护明确命令边界，并需要 Web 设置卡片或 Headless 支持
- **插件**: [`dsh-auto-approve@0.4.3`](https://www.npmjs.com/package/dsh-auto-approve/v/0.4.3) · **自动代审边界**: 已有 `approval/request`，先经过危险模式，再由二元 `approve` / `ask` 分类器判断 · **拒绝与故障行为**: 所有非 `approve` 结果均转人工 · **更适合**: 想少配置地分类已有审批，并需要内存态 `/auto-report`
- **插件**: [`dsh-approval-llm@0.1.3`](https://www.npmjs.com/package/dsh-approval-llm/v/0.1.3) · **自动代审边界**: 已有 `approval/request`，支持精确工具名 allow / deny / human-only 列表 · **拒绝与故障行为**: `DENY` 会拒绝；`ESCALATE` 和 reviewer 故障转人工 · **更适合**: 想按精确工具名路由、使用三态 reviewer 和自带配置 skill

这不是 Codex 的完整复刻。目前还没有 Codex 的精确动作 `/approve` 单次重试、滚动
10/50 拒绝熔断，以及 reviewer 的只读辅助检查。

## 兼容性

### 目标 · 状态 · 说明
- **目标**: DSH `0.1.0-rc.6` · **状态**: 已验证 · **说明**: peer dependencies 精确固定在该 rc。
- **目标**: DSH Web profile · **状态**: 已验证 · **说明**: 已覆盖 Host 审批逻辑和 Web 权限菜单图标。
- **目标**: macOS · **状态**: 已验证 · **说明**: 本地 Web 流程在 macOS 上完成验证。
- **目标**: Linux · **状态**: 未验证 · **说明**: 理论上可运行，但不在当前发布测试矩阵内。
- **目标**: Windows · **状态**: 未验证 · **说明**: 不在当前发布测试矩阵内。
- **目标**: Headless profile · **状态**: 未验证 · **说明**: 当前 bundle 和交互体验以 Web profile 为目标。
- **目标**: Node.js `^22.19.0` 或 `>=24.0.0` · **状态**: 已声明 · **说明**: 本地发布验证使用 Node 24。

DSH 后续 rc 可能改变 permission preset、profile patch、审批 hook 或浏览器模块
加载机制。升级 DSH 前，应重新验证插件兼容性。

## 安装

要求：DSH `0.1.0-rc.6`、受支持的 Node.js，以及 `PATH` 中可用的 pnpm。
beta 发布到 npm 后，将插件加入 Web profile：

```sh
dsh plugin --profile web add dsh-managed-approval@beta
```

重启 DSH Web Host，在会话输入栏的权限菜单中选择 **Approve for me**。不需要
手写 profile YAML，也不需要单独配置 reviewer。bundle 会挂载 Host 插件、添加
第四个 preset，并加载只负责“盾牌 + 闪光”图标的轻量 Web client。

检查安装状态：

```sh
dsh plugin --profile web list dsh-managed-approval
```

### 升级

```sh
dsh plugin --profile web up dsh-managed-approval@beta
```

升级后重启 Web Host，确保 Host 插件和浏览器模块来自同一个版本。

### 卸载

```sh
dsh plugin --profile web remove dsh-managed-approval
```

卸载后重启 Web Host。依赖被移除时，bundle 增加的 preset 也会消失；原来选择
该 preset 的会话需要改用 DSH 剩余的权限模式。

### pnpm store 不一致

如果 DSH 报 `ERR_PNPM_UNEXPECTED_STORE`，说明 profile 现有的 `node_modules`
来自另一个 pnpm store。应让插件命令使用创建该 profile 时的同一个 store，不要
直接重装或迁移共享 profile。例如本仓库隔离实验使用：

```sh
npm_config_store_dir="$PWD/.pnpm-store" \
  dsh plugin --profile web add dsh-managed-approval@beta
```

## 哪些操作会进入代审

默认的 `risk-based` 策略在 DSH rc.6 当前 hook 能力内尽量接近 Codex：

- DSH 本身已经发起的审批请求会先交给 reviewer，而不是立刻弹给用户。
- 明确只读的 search、fetch、list、get、find、inspect 类 MCP 通常不增加审批。
- 可能产生副作用的 create、update、delete、write、send、publish、upload，或把
  本地媒体交给外部服务处理的 MCP，会被提升到 DSH 原生审批流。
- 无法判断读写属性的 MCP 默认进入 reviewer。
- DSH 原生工具保留自身 sandbox 和 policy gate。
- 其他 DSH 策略已经给出的 `ask` 或 `deny` 不会被本插件降级。
- 自动批准一律是 `allowed-once`，不会生成持久授权。

### Reviewer 结果 · DSH 行为
- **Reviewer 结果**: 允许 low / medium risk · **DSH 行为**: 单次放行
- **Reviewer 结果**: 允许 high risk，且判断用户授权为 medium / high · **DSH 行为**: 单次放行
- **Reviewer 结果**: Host hard rule 或模型拒绝 · **DSH 行为**: 拒绝，注入理由和“不得绕过”指令
- **Reviewer 结果**: 超时、格式错误、参数或 route 缺失及其他 reviewer 故障 · **DSH 行为**: 回落到 DSH 原生人工审批

同一个 turn 连续被 reviewer 拒绝三次后，熔断器会取消当前 turn，同时保留队列
中的上下文；下一个用户 turn 重新计数。这些额外逻辑只在 **Approve for me**
下生效，DSH 原生三档行为不变。

## Reviewer 模型

默认情况下，reviewer 继承当前会话记录的 provider、model 和 reasoning effort。
它只发起一次、不能使用工具的模型请求，并严格解析 JSON。只有用户消息和 workspace
instructions 属于可信授权上下文；工具名、参数和 reason 都作为不可信输入隔离，
常见 token、密码和私钥格式会在进入模型前脱敏。

如果希望 reviewer 使用独立账号或模型，需要同时配置 `reviewerProvider` 和
`reviewerModel`：

```yaml
- id: approve-for-me
  config:
    managedPreset: approve-for-me
    reviewerProvider: reviewer-zai
    reviewerModel: glm-5.2
    reviewerReasoningEffort: high
    reviewerTimeoutMs: 60000
    reviewerMaxTokens: 768
    maxInputChars: 32768
    maxContextChars: 12000
    toolPolicy: risk-based
    toolRules: []
    unknownMcpAction: review
```

provider 仍在 DSH 正常的 LLM settings 中配置，凭证应放在环境变量或 DSH
credential store，不能写入 profile patch 或 npm 包。如果当前会话没有完整模型
route，或指定 reviewer 不可用，则回落到人工审批。

DSH rc.6 会整体替换命中插件 row 的 `config`，不会深度合并。因此用户 patch
必须重复所有希望保留的非默认字段。

### 自定义工具策略

`toolPolicy` 支持：

### 值 · 行为
- **值**: `risk-based` · **行为**: 默认；提升疑似副作用操作，明确只读操作继续执行。
- **值**: `off` · **行为**: 只处理 DSH 本身已经发起的审批。
- **值**: `all` · **行为**: 提升所有原本允许的工具调用；适合测试，日常使用会很吵。

`toolRules` 是按顺序匹配的 glob 规则，首个命中项生效，action 支持 `allow`、
`review` 和 `deny`：

```yaml
- id: approve-for-me
  config:
    managedPreset: approve-for-me
    toolPolicy: risk-based
    unknownMcpAction: review
    toolRules:
      - pattern: mcp__example__search_*
        action: allow
      - pattern: mcp__example__send_message
        action: review
      - pattern: mcp__example__delete_*
        action: deny
```

规则不能削弱其他 DSH 策略层的 `ask` 或 `deny`。规则级 `deny` 会在调用 reviewer
前阻止操作。`unknownMcpAction` 支持相同的三个 action，默认是 `review`。

## 已知限制

- DSH rc.6 在该 hook 之前丢弃了 MCP `readOnlyHint` 和 `destructiveHint`。
  当前风险分类是保守的词法兼容层，可能误报或漏报。
- Web UI 还没有“人工覆盖 reviewer 对这一个精确操作的拒绝”入口。
- 熔断器只覆盖单个 turn 内连续三次拒绝，尚未实现跨 turn 的滚动阈值。
- DSH rc.6 没有第三方 permission preset i18n API。为与官方三项保持一致，
  UI 固定显示英文 **Approve for me**；Web client 仍识别 beta.1 的旧中文标签，
  避免升级后图标丢失。
- Linux、Windows 和 Headless profile 尚未通过发布烟测。
- 模型代审只能减少审批负担，不等同于 sandbox 安全边界。应继续启用 DSH
  sandbox，并认真检查回落到人工的审批请求。

## 从旧版本迁移

- **0.4.0-beta.0：**不要使用。它的浏览器模块仍注册旧的本地插件 id，会导致
  DSH 报 bundle 已加载但没有注册 `dsh-managed-approval`。
- **0.4.0-beta.1：**可以正常升级。beta.2 把可见名称改成 **Approve for me**，
  同时保留对旧中文标签的图标兼容。
- **0.4.0-beta.2：**可以正常升级。beta.3 增加公开的选择指南和 npm 定位说明，
  Host 与 Web 运行逻辑没有变化。
- **0.4.0-beta.3：**可以正常升级。beta.4 增加公开仓库和安全报告元数据，
  Host 与 Web 运行逻辑没有变化。
- **0.4.0-beta.4：**可以正常升级。beta.5 将中文说明移到 `docs/`，确保 npm
  包首页默认显示英文；Host 与 Web 运行逻辑没有变化。
- **本地 0.3.0 原型：**安装 npm 包前，删除手写的 `approve-for-me` 插件 row
  和 permission preset；不要删除无关 provider、MCP 或官方权限设置。

完整版本记录见 [CHANGELOG.md](../CHANGELOG.md)。

## 本地开发和打包

```sh
npm ci
npm test
npm pack --dry-run
npm pack
```

从仓库根目录安装生成的 beta.5 tarball：

```sh
dsh plugin --profile web add \
  "$PWD/dsh-managed-approval-0.4.0-beta.5.tgz"
```

npm 包包含编译后的 Host 代码、Web client、`cordis.patch.yml` 和 license；用户
安装时不需要构建。`prepack` 会在生成 tarball 前运行 Host build、client 语法
检查和测试。

## 每次 beta 发布清单

1. 确认公开源码 commit、release tag 与候选包完全对应。
2. 按 [SECURITY.md](../SECURITY.md) 确认 GitHub private vulnerability reporting 已启用。
3. 从干净 checkout 运行测试并检查 `npm pack --dry-run` 内容。
4. 在已验证矩阵上走通干净 profile 安装、重启、审批、升级和卸载。
5. 首次 beta 使用开启 2FA 的 npm 账号发布；后续配置 trusted publishing 和 provenance。
6. 从公开 npm registry 重新安装 `dsh-managed-approval@beta` 并复跑烟测，再公告。

npm 上的 `dsh-approve-for-me` 属于另一个独立项目，本项目使用
`dsh-managed-approval`，避免冒充和升级混淆。npm 包元数据必须始终存在
`latest` dist-tag。由于本项目首次公开版本就是 beta、目前还没有稳定版，
registry 将 `latest` 指向了最初的 prerelease。安装和升级请始终显式使用
`dsh-managed-approval@beta`；后续 prerelease 只推进 `beta`，稳定版通过发布
gate 后，再让 `latest` 指向稳定版。

## 安全边界

审批逻辑全部运行在 Host。浏览器 client 只装饰 DSH 原生权限菜单，不提供审批
RPC；工具参数来自 Host 执行链，而不是浏览器。模型或策略拒绝会阻止调用，只有
reviewer 基础设施故障才委托给 DSH 原生人工 answerer。

漏洞报告方式和受支持版本策略见 [SECURITY.md](../SECURITY.md)。