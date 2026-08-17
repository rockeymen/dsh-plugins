#dsh-balance-monitor

[中文](#english) | [中文](#中文)

一个 DeepSeek Harness 插件，用于监控您的 DeepSeek API 帐户余额：官方 `/user/balance` 快照、会话中查询、北京时间**高峰/非高峰定价状态**以及**矩阵/本机双样式侧边栏徽章**。

### Matrix CRT风格·dsh 皇室风格
- **Matrix CRT 风格**： ![Matrix CRT 风格 ](assets/screenshot-matrix.png) · **dsh 哺乳风格**： ![dsh 哺乳风格 ](assets/screenshot-native.png)

## 英语

### 特点

### 能力·描述
- **功能**：💬会话内查询 · **描述**：`ds_balance`工具：代理可以随时获取官方余额快照（`force: true`绕过缓存）
- **功能**：🔄可选的每回合注入 · **描述**：可以在每回合之前将新的平衡注入到模型上下文中（默认关闭 - 徽章 + `ds_balance` 工具已经覆盖它；仅缓存读取，永远不会阻止对话）
- **功能**：🖥️ 侧边栏徽章 · **描述**：矩阵绿磷 CRT 样式：`▸ 余额 CNY ¥32.81 · 连接正常`、`刷新` 按需刷新按钮、30 秒自动轮询、导轨状态折叠成状态灯
- **功能**：🔐零配置密钥 · **描述**：重用 dsh 凭证服务中的 `DEEPSEEK_API_KEY`（从未写入磁盘，从未记录）
- **功能**：💱 多币种 · **描述**：人民币/美元均列出（人民币优先，按货币呈现 `$`/`€`/`£`）；金额保持字符串端到端，没有浮点数学
- **功能**：⛰️高峰/非高峰定价 · **说明**：在状态栏中显示 `高峰 HH:MM:SS` / `空闲`；高峰时段倒计时至下一个非高峰时段（北京时间）。在 2026 年 8 月 17 日之前，会预览相同的窗口，并在工具提示中显示正式计费开始。
- **功能**：💰 会话成本· **描述**：侧边栏徽章还显示当前对话的估计累计成本（`本会话 ¥xx.xx`），根据官方 DeepSeek V4 高峰/非高峰定价计算得出；它会自动跟随当前选定的会话
- **功能**：🎨 UI 风格切换 · **描述**：`原生`/`矩阵` 按钮在 Matrix CRT 徽章和本机 dsh 外观之间切换
- **功能**：🛡️ 速率限制友好 · **描述**：30 秒 TTL 缓存 + 请求序列化（最多 1 个正在进行的请求）+ 5 秒超时

### 安装

```sh
# Option 1: install from npm (recommended)
dsh plugin --profile web add @rainronin/dsh-balance-monitor

# Option 2: install straight from GitHub
dsh plugin --profile web add github:Rainronin/dsh-balance-monitor

# Option 3: clone and link-install locally (instant reload while developing)
git clone https://github.com/Rainronin/dsh-balance-monitor.git
cd dsh-balance-monitor
dsh plugin --profile web add .

# host-side changes require a restart
dsh web
```

> 如果 pnpm 阻止 git 托管插件的 `prepare` 构建脚本，请添加
> 在 `$DSH_HOME/profiles/web/pnpm-workspace.yaml` 中打印 `allowBuilds` 的密钥
> 并重新运行。

该插件自动加入`dsh.profile.bundles`。检查组合树：

```sh
dsh --profile web --dump-config
```

### 用法

**会话中查询** — 只需询问客服人员：

```
查一下 DeepSeek 余额 / check my DeepSeek balance
```

**侧边栏徽章** - 位于设置旁边的侧边栏页脚：`刷新` 强制刷新
经过缓存；轮询遵循主机配置的间隔（默认为 30 秒）；
折叠（导轨）状态显示单个状态灯（绿色 = `连接正常`，
琥珀色=降级）。 `原生`/`矩阵` 按钮在 Matrix CRT 徽章之间切换
以及原生的dsh风格；该选择被记住在 `localStorage` 中。当一个
选择对话后，徽章还显示 `本会话 ¥xx.xx` — 估计
该对话的累积成本，根据官方 DeepSeek V4 计算
高峰/非高峰定价；切换对话会自动切换成本。

### 配置

### 键·默认·含义
- **密钥**：`apiKeyEnv` · **默认**：`DEEPSEEK_API_KEY` · **含义**：凭证引用（环境变量名称）；更改为不同的帐户
- **密钥**：`cacheTtlMs` · **默认**：`30000` · **含义**：缓存生命周期（以毫秒为单位）
- **按键**：`pollIntervalMs` · **默认**：`30000` · **含义**：后台轮询间隔（以毫秒为单位）
- **按键**：`injectEveryTurn` · **默认**：`false` · **含义**：是否每回合将余额注入上下文（选择加入；徽章和 `ds_balance` 工具默认打开）
- **密钥**：`requestTimeoutMs` · **默认**：`5000` · **含义**：官方API请求超时（以毫秒为单位）

在配置文件的 `cordis.patch.yml` 中覆盖：

```yaml
- id: balance-monitor
  config:
    cacheTtlMs: 10000
    pollIntervalMs: 10000
```

### 错误语义

### 状态·行为
- **状态**：未配置 API 密钥 · **行为**：工具返回中文提示；徽章显示琥珀色 `未配置密钥`
- **状态**：API 失败 + 陈旧缓存 · **行为**：返回最后一个快照，标记为“快照过期 Ns（上次刷新失败，重试）”
- **状态**：API失败+无缓存 · **行为**：真正的失败（HTTP状态/网络/超时/不良响应）浮出水面；徽章显示琥珀色 `无信号`
- **状态**：API 密钥无效或被拒绝 · **行为**：工具返回真正原因；徽章显示琥珀色 `未配置密钥`
- **状态**：注入时 API 失败 · **行为**：静默降级：没有注入任何内容，对话不受影响

### 高峰/非高峰定价状态

官方定价页面将高峰时段定义为 **北京时间 09:00-12:00，
14:00-18:00**；所有其他时间均为非高峰时间。新定价生效时间为
**北京时间2026年8月17日00:00**。主机计算当前相位和
徽章显示：

### 阶段·状态文本
- **阶段**：高峰 · **状态文本**：`高峰 02:14:23` — 倒计时至非高峰时段
- **阶段**：非高峰 · **状态文本**：`空闲`
- **阶段**：2026-08-17 之前 · **状态文本**：预览相同的窗口；工具提示将 `2026-08-17 00:00` 标记为计费开始

### 架构

```
host half (Node)
  BalanceRemoteService (service key `balance`; loader mounts the default-exported class)
  ├─ credential lookup → GET https://api.deepseek.com/user/balance → 30s TTL cache + serialization
  ├─ ds_balance tool + optional agent/pre-step injection + configurable polling
  ├─ peak/off-peak pricing state computed on Beijing time (09:00-12:00, 14:00-18:00 peak)
  ├─ balance/sessionCost: scans the selected session's event log and estimates cumulative
  │   cost using official DeepSeek V4 peak/off-peak prices
  └─ typert/typert-host.js: hand-written TYPERT strict manifest (exported as ./typert,
      registered by typert-loader; api-gateway claims /api/balance/* via the strict definition)

browser half (client.tsx → lib/client.js, wrapped in the official __ModuleLoader__ shell)
  ├─ sidebar.footer.action slot: Matrix/native dual-style badge (wide/rail states)
  └─ data channel: direct calls over the official RPC protocol (POST /api/balance/<method>,
      client-request envelope), host-configured polling + `刷新` force refresh + phase-transition refresh
```

第三方Typert Remote客户端路径（`$mount`贡献→命名空间
service）在实践中默默失败，因此徽章与官方 RPC 线路进行通信
直接协议（dsh-host-apiproxy fetch-Carrier Envelope），而主机
方保持官方TYPERT严格注册。

### 发展

```sh
npm install            # toolchain (typescript/pnpm + type deps)
npm run build          # clean + tsc (host ESM/client CJS) + wrap-client + RPC/typert self-checks
node scripts/diagnose.mjs # local cordis integration diagnosis (mock services)
dsh plugin --profile web add .   # link install
```

构建说明：`npm run build` 首先清理 `lib/`，将主机一半编译为 ESM
浏览器相当于CommonJS，将客户端与`scripts/wrap-client.mjs`包装成
官方`window.__ModuleLoader__.load`外壳（与官方形状相同
dsh-client-ui-* 工件，由 dsh-client-modules 提供
`/plugins//client.js`），然后运行`scripts/verify-client.mjs`（捆绑注册，
插槽安装、RPC 包络和 `rpcId` 回声）和 `scripts/verify-typert.mjs`（严格
编解码器正/负情况）。

### 进一步阅读

- [`docs/UI设计构思.md`](docs/UI设计构思.md)（中文）：矩阵视觉规范（荧光体 CRT 代币系统）

## 中文

DeepSeek Harness 插件：DeepSeek API 账户余额监测——官方 `/user/balance` 接口快照 + 会话内查询 + 北京时间峰谷计价状态 + Matrix/ 原创双风格侧边栏徽章。

### 功能

### 能力 · 说明
- **能力**: 💬 会话内查询 · **说明**: `ds_balance` 工具：agent 随时可查官方余额快照（`force: true` 穿透缓存）
- **能力**: 🔄 每轮注入（可选） · **说明**: 默认关闭。开启后每轮对话前自动把最新余额放进模型上下文（只读缓存，绝不阻塞对话）——徽章与工具已默认覆盖该信息
- **能力**: 🖥️ 侧边栏徽章 · **说明**: Matrix 绿磷光 CRT 风格：`▸ 余额 CNY ¥32.81 · 连接正常`，`刷新` 按钮手动穿透刷新，30s 自动轮询，折叠态退化为状态灯
- **能力**: 🔐 零配置密钥 · **说明**: 复用 dsh 凭证服务里的 `DEEPSEEK_API_KEY`（不落盘、不打印、不缓存）
- **能力**: 💱 多币种 · **说明**: CNY/USD 全列（CNY 优先，USD/EUR/GBP 显示对应货币符号），金额全程字符串透传，无浮点运算
- **能力**: ⛰️ 峰谷计价状态 · **说明**: 状态栏显示 `高峰 HH:MM:SS` / `空闲`；高峰期实时倒计时到空闲阶段（北京时间）。2026-08-17 前按同一窗口预览，tooltip 标注正式计费生效时间
- **能力**: 💰 单会话费用 · **说明**: 侧边栏徽章额外显示当前会话累计估算费用（`本会话 ¥xx.xx`），按 DeepSeek 官方 V4 峰谷价格计算，切换会话时自动跟随当前会话
- **能力**: 🎨 UI 风格切换 · **说明**: `原生`/`矩阵` 按钮在 Matrix CRT 与