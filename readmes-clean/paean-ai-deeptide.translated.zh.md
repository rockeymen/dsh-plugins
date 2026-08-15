![DeepTide 标志](./assets/logo.svg)

#DeepTide

  由 DeepSeek 为 DeepSeek 构建。
  人工智能编码代理会像潮水一样流经您的代码库。
  <sub>名称：DeepSeek + 潮汐（终端IDE）。</sub>

## 三种口味，同一团队

### · DeepTide 适用于 macOS · DeepTide CLI (`deeptide`) · DeepTide CLI Rust (`deeptide-rs`)
- **外形规格** · **DeepTide for macOS**：本机 macOS 应用程序 · **DeepTide CLI (`deeptide`)**：跨平台终端 CLI · **DeepTide CLI Rust (`deeptide-rs`)**：跨平台终端 CLI **+ 本机桌面 GUI** ([`--gui`](#desktop-gui-deeptide-rs))
- **运行时** · **DeepTide for macOS**：Swift 6 本机二进制文件，约 15 MB 空闲 · **DeepTide CLI (`deeptide`)**：Bun，约 50 MB 驻留 · **DeepTide CLI Rust (`deeptide-rs`)**：本机 Rust 二进制文件，磁盘上约 10 MB，无运行时
- **平台** · **DeepTide 适用于 macOS**：macOS 15+ · **DeepTide CLI (`deeptide`)**：Linux · Windows · macOS · **DeepTide CLI Rust (`deeptide-rs`)**：Linux · Windows · macOS
- **安装** · **DeepTide 适用于 macOS**：`curl -fsSL https://deeptide.sh/install.sh \ · **DeepTide CLI (`deeptide`)**: sh` · **DeepTide CLI Rust (`deeptide-rs`)**：`bun add -g deeptide`（此软件包） · `npm install -g deeptide-rs`
- **CLI 名称** · **DeepTide 适用于 macOS**：DeepTide.app · **DeepTide CLI (`deeptide`)**：`deeptide`、`tide` · **DeepTide CLI Rust (`deeptide-rs`)**：`deeptide-rs`
- **谱系** · **DeepTide for macOS**：100% 由 DeepSeek V4 编写 · **DeepTide CLI (`deeptide`)**：由开源 [Zero CLI](https://github.com/a8e-ai/zero-cli) · **DeepTide CLI Rust (`deeptide-rs`)**：创作于[本仓库中的 `crates/`](./crates)
- **最适合** · **DeepTide 适用于 macOS**：想要调整本机体验的 macOS 用户 · **DeepTide CLI (`deeptide`)**：现有用户；最丰富的插件界面 · **DeepTide CLI Rust (`deeptide-rs`)**：无头 CI、缓慢的笔记本电脑、单一二进制部署

这个存储库是所有三个的**社区前门** - 文档、常见问题解答、
问题跟踪 — 是两个 npm 包的所在地：

- [`deeptide`](./package.json) — 当前的 TypeScript/Bun CLI（转发到
  [`@paean-ai/zero-cli`](https://www.npmjs.com/package/@paean-ai/zero-cli))
- [`deeptide-rs`](./npm/deeptide-rs) - Rust CLI（提供本机二进制文件
  通过 GitHub 发布安装后）

这两个 CLI 包**不冲突** — 它们公开不同的二进制文件
名称（`deeptide`/`tide` 与 `deeptide-rs`），以便您可以同时安装和
当我们成熟 Rust 端口时，可以在它们之间自由切换。

Rust 端口位于 [`crates/`](./crates)。它的目的是成长
随着时间的推移进入规范的跨平台 CLI，但 `deeptide` 包
只要用户发现其中的价值，就会一直可用——没有
被迫迁移。

它还包含开源本机本地推理运行时
[`native/`](./native)：硬分叉的`ds4` DeepSeek V4 Flash Metal引擎加上
`dsgo`，本地 OpenAI/Anthropic 兼容网关，旨在与
DeepTide。

## 在 macOS 上安装（推荐）

对于 Mac 用户，推荐的路径是本机 Deeptide 构建
[deeptide.sh](https://deeptide.sh/)。它会下载您的签名版本
Mac 架构并安装 `deeptide` 和较短的 `tide` 命令：

```bash
curl -fsSL https://deeptide.sh/install.sh | sh
```

然后开始：

```bash
tide auth login   # Paean OAuth, multimodal-aware
tide login        # or save a DeepSeek API key directly
tide              # launch the REPL
tide doctor       # diagnose install + network
```

如果您想要本机 Mac 终端与 Deeptide 配对，也可以尝试
[Clide](https://clide.app/) — 带有文件浏览器的现代 macOS 终端，
多窗格布局、拖放和本机语音输入。

## 在 Linux / Windows 上安装（零 CLI 别名）

> **先决条件：** [Bun](https://bun.com/) 必须安装并打开
> 路径。 CLI 运行时需要它（与底层匹配
> [零 CLI](https://github.com/a8e-ai/zero-cli))。包子没有
> 替换您的 Node 安装 — 它位于旁边。

在非 Mac 系统上，此 npm 包是跨平台 DeepTide 风格的
由 [Zero CLI](https://github.com/a8e-ai/zero-cli) 提供支持的入口点。它
为接近 Deeptide 的工作流程安装 `deeptide` 和 `tide` 别名，
但它不是 `deeptide.sh` 的 Swift 原生 macOS 版本。

```bash
# bun (recommended, fastest install)
bun add -g deeptide

# npm (works too; bun is still required at runtime)
npm install -g deeptide

# pnpm
pnpm add -g deeptide
```

安装了两个命令；选择您喜欢的手指：

```bash
tide                          # interactive REPL (preferred — short)
deeptide                      # same thing, full name
tide -p "explain this repo"   # one-shot mode
tide --help                   # all options
```

您也可以直接安装上游包：

```bash
bun add -g @paean-ai/zero-cli
```

## 从源代码构建 macOS 本机应用程序

macOS 本机构建已开源，位于
[paean-ai/deeptide](https://github.com/paean-ai/deeptide)（斯威夫特）。大多数用户
应该从 [deeptide.sh](https://deeptide.sh/) 安装，但源代码构建者可以
当需要修改本机时，从源代码树检查和构建
运行时或本地推理组件。

## 快速入门 (CLI)

DeepTide CLI 默认与 **DeepSeek API** 对话（匹配
DeepTide 本机应用程序），还可以驱动任何与 Anthropic 协议兼容的
通过 BYOK 的端点——Zhipu GLM、Volcengine、Paean、Qwen、Moonshot、
自托管网关等。

```bash
# Default path — DeepSeek
export DEEPSEEK_API_KEY="sk-..."
tide

# BYOK to another provider
tide --base-url https://open.bigmodel.cn/api/anthropic --api-key <GLM_KEY>

# One-shot, non-interactive
tide -p "Explain the auth middleware"
```

对于完整的配置界面（settings.json schema、hooks、
权限、MCP 服务器、子代理、模型别名）请参阅上游
[零 CLI README](https://github.com/a8e-ai/zero-cli#readme)，这是
权威参考。

## 桌面图形用户界面 (`deeptide-rs`)

Rust 端口提供了一个 **本机桌面应用程序** — 一个 Rust 二进制文件（egui，没有
Electron/webview）是 CLI 使用的同一引擎上的一个薄窗口。它
**完全共享 CLI 的配置、会话历史记录和整个工具
set** — 没有单独的配置需要维护：

- **相同配置** — 读取相同的 `~/.config/tide/settings.json` （并且
  项目`.deeptide/settings.json`）；设置您的提供商/型号/API 密钥一次并
  CLI 和 GUI 都会接收到它。
- **相同会话** — 对话保存到同一个磁盘存储中，因此聊天
  在 GUI 中启动可以从终端 `deeptide-rs --resume` 启动，并且 CLI
  会话显示在 GUI 的侧栏中，只需单击一下即可恢复。
- **相同的工具** — 完整的代理工具集（读/写/编辑、Bash、Glob/Grep、
  WebFetch、MCP 服务器、子代理等）同样可用。

它的作用：使用**markdown渲染**进行流式聊天，实时**推理**
（“💭 思考”）和**工具调用卡**、**交互式工具批准**（带有
用于写入/编辑的彩色差异预览），**会话侧边栏**（恢复过去
聊天）、**提供者/模型选择器**、**新聊天**、**停止/中断**和
**成本/使用栏**（↑/↓ 代币·缓存·$）。

### 启动

```bash
# Via the CLI launcher (execs the desktop binary, sharing this config/cwd):
deeptide-rs --gui

# …or run the GUI binary directly:
deeptide-gui
```

### 从源代码构建

```bash
# From the repo root (the Rust workspace under crates/):
cargo run -p deeptide-gui            # dev run
cargo build -p deeptide-gui --release # release binary at target/release/deeptide-gui
```

配置模型的方式与 CLI 相同 - 例如`export DEEPTIDE_API_KEY=…`
（或在 `settings.json` 中设置）启动前。没有凭证的 GUI
以安全的本地回显模式打开并显示“无 API 密钥”横幅。指向它
非默认提供商，请使用应用内选择器或 `export DEEPTIDE_PROVIDER=…`
（例如 `deepseek`、`ollama`、`openai`、`gemini`）。

## 内置功能

DeepTide 是一个**代理**编码助手 - 模型计划、调用
工具、观察结果并进行调整。开箱即用：

- **多轮代理循环** — 计划→工具→观察→适应
- **流式响应** — 查看模型实时思考和行动
- **30 多个内置工具** — 文件 I/O、shell、web、任务、MCP、调度、子代理
- **25+ 斜杠命令** — `/status`、`/cost`、`/diff`、`/init`、`/permission`、`/hooks`，...
- **权限模式** — 默认·接受编辑·计划·绕过
- **Hooks 引擎** — 前/后工具、用户提示、会话、压缩 shell 挂钩
- **内存系统** — 跨会话的持久项目内存
- **来自 markdown 的子代理** — 在项目中定义自定义代理
- **来自 markdown 的自定义斜线命令** — 将 `<name>.md` 放在下面
  `.deeptide/commands/`（或`~/.deeptide/commands/`）并将其运行为`/<name>`；
  主体变为 `$ARGUMENTS` / `$1`…`$11` 替换的提示符。内置
  命令始终优先。
- **计划模式** — 在编码之前进行设计，在执行之前获得批准