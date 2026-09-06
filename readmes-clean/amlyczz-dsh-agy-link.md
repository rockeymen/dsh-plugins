# 🛰️ dsh-agy-link

  DeepSeek Harness × Google Antigravity — 多账号智能池化与官方 agy CLI 驱动桥接 / Multi-Account Pool & Native agy CLI Bridge for DSH

  🌐 Language / 语言：

# 中文

把 **Google Antigravity 模型接入 DeepSeek Harness（DSH）** —— 支持**多账号智能池化轮换**、**官方双 Bucket 配额监控（5小时滚动 + 7天周额度）**、**浏览器免粘贴一键登录**与**浅色/深色主题高对比度自适应**，由官方未修改的 `agy` CLI 驱动，完整支持流式输出、思考折叠（thinking）、原生工具卡片与精确 token 用量。

  ![Antigravity 管理控制台 - 多账号池化与配额监控](./docs/assets/dashboard.png)
    
  ![DSH 模型选择器中的 Antigravity 模型列表](./docs/assets/model-picker.png)

> 🚨 **【国内用户核心前置：必须开启系统代理 / TUN 模式！】**
>
> Google Antigravity 服务及 OAuth 登录需要直连 Google 海外官方服务器（`oauth2.googleapis.com`、`cloudcode-pa.googleapis.com` 等）。
>
> 1. **推荐方式（最稳妥）**：开启代理工具（Clash / Surge / v2rayA / Sing-box / Loon 等）的 **TUN 虚拟网卡模式（或系统代理全局接管）**，确保终端命令、后台 Node.js 进程及浏览器均能顺畅访问 Google 网络。
> 2. **终端代理环境变量**：若终端未被代理自动接管，启动 DSH 或运行命令前请在终端中执行：
>    ```bash
>    export HTTPS_PROXY=http://127.0.0.1:7890 HTTP_PROXY=http://127.0.0.1:7890 ALL_PROXY=socks5://127.0.0.1:7890
>    ```
>    *(注：端口 `7890` 请替换为你本地代理软件的实际端口)*
> 3. **GUI 单账号独立代理**：进入 DSH「设置 → Antigravity」或点击顶部 `AGY` 徽标，点击卡片上的「🌐 代理」按钮，可为特定账号单独配置专属代理 URL（如 `http://127.0.0.1:7890`），实现多账号不同 IP 出口隔离。

## 🌟 核心亮点：多账号池化与智能轮换

你拥有多个 Google Antigravity / Gemini 账号？**dsh-agy-link 让多账号管理变得极致简单与自动化**：

- 👥 **多账号池化管理 (Account Pool)**：在 DSH 内添加任意数量的 Google 账号（主账号 + 备用账号群），每个账号拥有独立的 HOME 目录沙箱与凭证隔离。
- 🔄 **顺序耗尽故障转移 (Sequential Drain)**：当前账号额度用尽（触发 429 限流或 5h / 周额度耗尽）时，系统**自动平滑接力至下一个可用账号**，对话完全不中断！
- 📊 **官方双 Bucket 配额监控 (Dual-Bucket Quota)**：直接调用 Antigravity 官方专用的 `v1internal:retrieveUserQuotaSummary` 接口，同时展示 **5小时滚动额度** 与 **7天周额度** 真实数据及精准重置倒计时。
- 🔑 **GUI 内浏览器免粘贴登录 (In-GUI Zero-Paste OAuth)**：点击「➕ 添加账号」自动调起系统浏览器，本地回环监听自动捕获授权凭证，**全程无需手动复制粘贴授权码**。
- 🎨 **多主题高对比度自适应 (Light & Dark Themes)**：原生适配 DSH 浅色/深色主题，告别发暗发灰与看不清文字，UI 视觉清晰锐利。
- 🌐 **独立账号网络代理 (Per-Account Proxy)**：支持为每个账号独立绑定 HTTP(S) / SOCKS 代理，避免多账号同 IP 引起风控。
- ⚡ **分模型族独立冷却 (Family-Scoped Cooldown)**：Gemini 与 Claude / GPT-OSS 速率限制独立计算，某个模型族受限不影响其他模型族正常调用。

## ✨ 全功能特性一览

### 能力 · 说明
- **能力**: 👥 **多账号池化轮换** · **说明**: 支持主账号 + 多个备用账号；遇到 429 或配额耗尽自动平滑切换，模型族独立冷却
- **能力**: 📊 **官方双 Bucket 配额监控** · **说明**: 实时拉取官方端点，同时呈现 **5h 滚动额度** 与 **7d 周额度** 双进度条与倒计时，单模型明细可展开
- **能力**: 🔑 **浏览器一键登录** · **说明**: 点击添加账号自动唤起 Google 授权页，本地回环自动捕获，全程无需复制粘贴任何代码
- **能力**: 🎨 **多主题高对比 UI** · **说明**: 浅色、深色主题自适应变色，纯矢量 SVG 图标（无 Emoji），字迹清晰不发暗
- **能力**: 🌐 **独立账号代理** · **说明**: 每个账号支持独立配置 HTTP(S) 代理，隔离 IP 出口
- **能力**: 🔌 **原生模型路由** · **说明**: 在 DSH 模型配置中注册 `antigravity` 提供方，`/model` 选择器随心切换 Gemini / Claude / GPT-OSS
- **能力**: 🌊 **完整流式映射** · **说明**: 文本、思考过程（thinking turn）与工具活动均无损映射到 DSH 原生流协议
- **能力**: 🃏 **原生工具卡片** · **说明**: agy 执行的终端命令（`run_command`）、文件修改（inline diff）均以 DSH 原生卡片渲染
- **能力**: 🔗 **会话上下文保真** · **说明**: DSH 会话与 agy 原生会话绑定（`--conversation`），由 agy 管理完整历史，每轮仅发送增量
- **能力**: 📊 **精确 Token 统计** · **说明**: 输入 / 输出 / 思考 / 缓存读取 token 完整计入 DSH 用量统计，全面适配 1M 上下文
- **能力**: 🎛 **顶部控制台徽标** · **说明**: 顶部栏 `AGY (n)` 徽标一键弹出控制台，直观查看账号池、配额进度条与代理状态
- **能力**: 🖼 **图片多模态** · **说明**: 支持多模态图片传入，自动落盘本地媒体目录并通过 `--add-dir` 安全授权给 agy 查看
- **能力**: 🤝 **`agy_ask` 辅助工具** · **说明**: 允许任意 DSH 模型把单次任务委托给 Antigravity 模型（AskAntigravity 协作模式）
- **能力**: ⌨️ **`/agy` 快捷命令族** · **说明**: `status` / `auth` / `models` / `mode` / `effort` / `workspace` / `clear` / `doctor` / `help`

## 📋 前置要求

在安装本插件前，请确保具备以下环境：

### 前置项 · 说明 / 验证方式
- **前置项**: **1. 系统网络代理** · **说明 / 验证方式**: **【必须开启】**（推荐开启 Clash / Surge / v2rayA 的 TUN 模式或设置 `HTTPS_PROXY` 环境变量，确保可流畅连接 Google 服务）
- **前置项**: **2. DeepSeek Harness (DSH)** · **说明 / 验证方式**: 你正在使用的 DSH 客户端；`dsh --version` 可验证
- **前置项**: **3. Node.js ≥ 24** · **说明 / 验证方式**: DSH 依赖环境；`node --version` 验证
- **前置项**: **4. Google Antigravity `agy` CLI** · **说明 / 验证方式**: 按 [Google 官方安装文档](https://antigravity.google/docs/cli/install) 安装（支持 macOS / Linux / Windows）。`agy --version` 能输出版本号即表示安装成功

> 💡 **提示**：即使你的 agy 尚未登录，也可以直接安装插件！在 DSH 界面顶部点击 `AGY` 徽标或进入「设置 → Antigravity」，点击「➕ 添加账号」即可直接在浏览器中完成登录。

## 🚀 快速上手

```bash
# 0. 确保系统代理 / TUN 模式已开启（国内网络必需）：
export HTTPS_PROXY=http://127.0.0.1:7890 HTTP_PROXY=http://127.0.0.1:7890

# 1. 安装插件（npm 官方包，无需编译构建）：
dsh plugin --profile web add dsh-agy-link

# 升级到最新版：
# dsh plugin --profile web add dsh-agy-link@latest --registry https://registry.npmjs.org

# 2. 启动 DSH Web GUI，在输入框中检查状态：
#   /agy status

# 3. 登录与添加账号：
#   方式 A：点击顶部导航栏的 "AGY (n)" 徽标，点击 "➕ 添加账号"，浏览器一键登录；
#   方式 B：输入框执行 /agy auth 为主账号发起登录。

# 4. 在 /model 选择器中挑选 Antigravity 模型，立即开启对话！
```

## ⚙️ 配置说明

插件配置可在 `/plugin`、设置面板或环境变量中灵活调整：

### 键名 · 环境变量 · 默认值 · 作用说明
- **键名**: `enabled` · **环境变量**: `DSH_AGY_ENABLED` · **默认值**: `true` · **作用说明**: 插件主开关
- **键名**: `agyBin` · **环境变量**: `DSH_AGY_BIN` · **默认值**: 自动探测 · **作用说明**: 显式指定 `agy` 二进制路径
- **键名**: `permissionMode` · **环境变量**: `DSH_AGY_MODE` · **默认值**: `skip` · **作用说明**: 权限模式：`skip`（免审批推荐）/ `plan`（只读）/ `accept-edits`
- **键名**: `defaultModel` · **环境变量**: `DSH_AGY_DEFAULT_MODEL` · **默认值**: `(agy 默认)` · **作用说明**: 默认模型 slug
- **键名**: `defaultEffort` · **环境变量**: `DSH_AGY_DEFAULT_EFFORT` · **默认值**: `(模型默认)` · **作用说明**: 思考预算：`low` / `medium` / `high`
- **键名**: `timeoutMs` · **环境变量**: `DSH_AGY_TIMEOUT_MS` · **默认值**: `600000` · **作用说明**: 单轮活跃看门狗超时（毫秒）
- **键名**: `workspaceRoot` · **环境变量**: `DSH_AGY_WORKSPACE_ROOT` · **默认值**: 会话 cwd · **作用说明**: agy 工作区根目录（默认跟随当前会话工作区）

## 🧩 架构与工作原理

1. **短生命周期进程驱动**：每一轮 DSH 对话启动一个独立的官方 `agy -p --output-format stream-json` 进程，解析 NDJSON 事件流。
2. **多账号沙箱机制**：除主账号沿用系统默认 Keychain / HOME 外，所有备用账号在插件私有目录下建立专属 HOME 隔离区，独立写入 agy 格式的标准 OAuth 凭证。
3. **双 Bucket 官方配额汇总**：插件定时后台静默轮询官方 `v1internal:retrieveUserQuotaSummary`，精准掌控每个账号的 5h 滚动削峰水位与 7d 账号阶梯周额度。
4. **会话级无缝故障转移**：当遭遇 HTTP 429、额度耗尽或凭证异常时，号池调度器自动标记当前账号家族进入冷却，并无缝将后续请求路由到池内下一个有效账号。

## 🙏 参考与致谢

- [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) — Antigravity 公开 OAuth 客户端与回环回调登录范式
- [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) — opencode 平台的多账号实践
- [OmniRoute](https://github.com/diegosouzapw/OmniRoute) — Antigravity 端点分发与配额语义
- [pi-mono](https://github.com/badlogic/pi-mono) — Antigravity 轮换与桥接设计参考

## ⚠️ 免责声明

本插件仅通过调用用户本地官方安装的未修改 `agy` CLI 进程进行交互。使用本插件需遵循 Google Antigravity 服务条款。

## 许可证

MIT License.

# English

Bring **Google Antigravity models into DeepSeek Harness (DSH)** — featuring **Multi-Account Pooling & Automatic Rotation**, **Official Dual-Bucket Quota Tracking (5h Rolling + 7d Weekly)**, **Zero-Paste In-GUI OAuth Login**, and **Theme-Adaptive High-Contrast UI**, powered by the official unmodified `agy` CLI.

  ![Antigravity Management Console - Multi-Account Pool & Quota Monitor](./docs/assets/dashboard.png)
    
  ![Antigravity Model Lineup in DSH Model Picker](./docs/assets/model-picker.png)

> 🚨 **【Important: System Proxy / VPN / TUN Mode Required in Restricted Regions】**
>
> Google Antigravity services and Google OAuth require access to Google servers (`oauth2.googleapis.com`, `cloudcode-pa.googleapis.com`, etc.).
>
> 1. **Recommended**: Enable **TUN mode / System Proxy** in your VPN or proxy client (Clash, Surge, Sing-box, etc.) so that all terminal commands, Node.js background processes, and browser calls route through your proxy.
> 2. **Terminal Proxy Export**: If your terminal does not inherit proxy automatically, export the environment variables before starting DSH:
>    ```bash
>    export HTTPS_PROXY=http://127.0.0.1:7890 HTTP_PROXY=http://127.0.0.1:7890 ALL_PROXY=socks5://127.0.0.1:7890
>    ```
> 3. **Per-Account Dedicated Proxy**: You can also configure a dedicated proxy URL per account directly in DSH Settings → Antigravity by clicking the "🌐 Proxy" button on the account card (e.g. `http://127.0.0.1:7890`).

## 🌟 Core Feature: Multi-Account Pool & Smart Rotation

Have multiple Google Antigravity / Gemini accounts? **dsh-agy-link makes multi-account orchestration seamless and automated**:

- 👥 **Multi-Account Pooling**: Manage unlimited Google accounts (Primary + Secondary pool) with fully isolated HOME sandbox environments and credentials.
- 🔄 **Sequential Drain Failover**: When an account reaches its rate limits (429) or runs out of 5h/weekly quotas, requests **automatically and smoothly fail over to the next available account** without interrupting your conversation!
- 📊 **Official Dual-Bucket Quota Tracking**: Direct integration with Antigravity's official `v1internal:retrieveUserQuotaSummary` endpoint, providing real-time visibility for both **5-Hour Rolling Limit** and **7-Day Weekly Limit** with live countdowns.
- 🔑 **In-GUI Zero-Paste OAuth**: One-click "Add Account" opens your browser and automatically captures OAuth tokens via local loopback — **no copying and pasting of authorization codes required**.
- 🎨 **Theme-Adaptive High-Contrast UI**: Seamlessly adapts to Light and Dark DSH themes with crystal clear typography and crisp contrast.
- 🌐 **Per-Account Proxy**: Configure dedicated HTTP(S) / SOCKS proxy for each individual account to isolate IP addresses.
- ⚡ **Family-Scoped Cooldowns**: Gemini, Claude, and GPT-OSS rate limits are calculated independently, preventing one exhausted model from blocking others.

## ✨ Features Overview

### Feature · Description
- **Feature**: 👥 **Multi-Account Pool** · **Description**: Primary + unlimited spare accounts with automatic Sequential Drain rotation upon rate limits
- **Feature**: 📊 **Dual-Bucket Quota HUD** · **Description**: Real-time dual progress bars for both **5h rolling** and **7d weekly** quota limits with exact reset countdowns
- **Feature**: 🔑 **Zero-Paste Browser Login** · **Description**: Automatic browser-based Google OAuth login with loopback callback handler
- **Feature**: 🎨 **Theme-Adaptive UI** · **Description**: Dynamic light/dark theme switching, pure SVG vector marks (no emojis), high contrast
- **Feature**: 🌐 **Per-Account Proxy** · **Description**: Dedicated HTTP(S) proxy per account slot
- **Feature**: 🔌 **Native Model Routing** · **Description**: Registers `antigravity` provider in DSH; choose Gemini / Claude / GPT-OSS in `/model` picker
- **Feature**: 🌊 **Full Streaming Protocol** · **Description**: Native streaming for text, thinking turn annotations, and tool calls
- **Feature**: 🃏 **Native Tool UI Cards** · **Description**: Command runs and inline diffs render as clean, native DSH tool cards
- **Feature**: 🔗 **Session Continuity** · **Description**: Binds DSH sessions to native agy conversations (`--conversation`) for zero-redundancy context
- **Feature**: 📊 **Accurate Token Metering** · **Description**: Input, output, thinking, and cacheRead tokens are fully reported to DSH with 1M context support
- **Feature**: 🎛 **Top Header Console Badge** · **Description**: Click the `AGY (n)` badge in the header to instantly open the management console
- **Feature**: 🖼 **Multimodal Images** · **Description**: Stages images to local storage and passes safe absolute paths via `--add-dir`
- **Feature**: 🤝 **`agy_ask` Delegation** · **Description**: Allows other DSH models to delegate subtasks to Antigravity models
- **Feature**: ⌨️ **`/agy` Commands** · **Description**: Full command suite: `status`, `auth`, `models`, `mode`, `effort`, `workspace`, `clear`, `doctor`, `help`

## 📋 Prerequisites

### Requirement · Details
- **Requirement**: **1. System Proxy / VPN** · **Details**: **【Required in restricted regions】** (TUN mode or `HTTPS_PROXY` environment variable to ensure Google endpoints are reachable)
- **Requirement**: **2. DeepSeek Harness (DSH)** · **Details**: Your current DSH environment (`dsh --version`)
- **Requirement**: **3. Node.js ≥ 24** · **Details**: Required runtime (`node --version`)
- **Requirement**: **4. Google Antigravity `agy` CLI** · **Details**: Installed per [Google's official guide](https://antigravity.google/docs/cli/install). Verified with `agy --version`

## 🚀 Quick Start

```bash
# 0. Ensure System Proxy / TUN mode is active (required for Google connectivity):
export HTTPS_PROXY=http://127.0.0.1:7890 HTTP_PROXY=http://127.0.0.1:7890

# 1. Install plugin:
dsh plugin --profile web add dsh-agy-link

# Upgrade to latest:
# dsh plugin --profile web add dsh-agy-link@latest --registry https://registry.npmjs.org

# 2. Start DSH Web GUI, test status:
#   /agy status

# 3. Add accounts:
#   Click "AGY (n)" badge in the top header, click "➕ Add Account" and complete browser login.

# 4. Select an Antigravity model in /model and start chatting!
```

## ⚙️ Configuration

### Key · Environment Variable · Default · Description
- **Key**: `enabled` · **Environment Variable**: `DSH_AGY_ENABLED` · **Default**: `true` · **Description**: Master switch
- **Key**: `agyBin` · **Environment Variable**: `DSH_AGY_BIN` · **Default**: auto-detected · **Description**: Path to `agy` binary
- **Key**: `permissionMode` · **Environment Variable**: `DSH_AGY_MODE` · **Default**: `skip` · **Description**: `skip` (recommended) / `plan` (read-only) / `accept-edits`
- **Key**: `defaultModel` · **Environment Variable**: `DSH_AGY_DEFAULT_MODEL` · **Default**: `(agy default)` · **Description**: Default model slug
- **Key**: `defaultEffort` · **Environment Variable**: `DSH_AGY_DEFAULT_EFFORT` · **Default**: `(model default)` · **Description**: Thinking budget: `low` / `medium` / `high`
- **Key**: `timeoutMs` · **Environment Variable**: `DSH_AGY_TIMEOUT_MS` · **Default**: `600000` · **Description**: Activity watchdog timeout in milliseconds
- **Key**: `workspaceRoot` · **Environment Variable**: `DSH_AGY_WORKSPACE_ROOT` · **Default**: session cwd · **Description**: Working directory root

## ⚠️ Disclaimer

This plugin operates strictly by invoking the official, unmodified `agy` CLI binary installed on your local system. Use of this plugin is subject to Google Antigravity's Terms of Service.