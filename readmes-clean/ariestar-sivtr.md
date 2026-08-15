![sivtr logo](editors/vscode/icon.png)

# sivtr

  一个面向智能体和人的统一的记忆空间
  
  让智能体和终端共享同一个上下文
  
  你的 Agent 记忆，不必是一套笨重的知识系统。

  简体中文
  ·
  ·
  ·

  ![](https://github.com/user-attachments/assets/4a7ce0b4-c0f6-49dc-94f9-1b4a6ded4b90)

## 为什么需要 sivtr？

开发者和 Agent 经常浪费时间重建已经存在的上下文：终端报错、测试输出、工具日志、之前的 AI 会话。`sivtr` 把这些本地工作变成可搜索的记忆，但不要求你引入一套很重的知识系统。

有了 `sivtr`，你可以：

- 让 Agent 修复最近一次失败，而不用自己粘贴日志；
- 几秒钟找回昨天的测试输出、构建报错或关键决策；
- 从摘要跳回当时那条命令输出或 Agent 回复；
- 把一组有用结果保存成 `@failures` 这样的变量，在下一条命令里继续用。

> [!IMPORTANT]
> Agent 工作流建议安装 `sivtr` CLI，用 `sivtr mcp install` 注册 MCP，并可选用内置 `sivtr-memory` skill。MCP 是 Agent 读取本地证据的主路径；skill 负责教它何时、如何调用。

## 特性

- **MCP 优先的 Agent 记忆**：一次 `sivtr mcp install`，Agent 直接调用 `sivtr_search` / `sivtr_show` / `sivtr_zoom` / `sivtr_filter` / `sivtr_status`，不用你粘贴日志。
- **带输出的 shell history**：记录 Bash、Zsh、PowerShell、Nushell 里的命令、stdout/stderr、退出码、目录和耗时。
- **一个搜索面覆盖本地工作**：终端输出 + 所有已注册 Agent provider（Codex / Claude Code / Cursor / Hermes / OpenCode / OpenClaw / Grok / Pi …）——MCP 或 CLI 都能用。
- **精确证据，而不是摘要**：每个命中都落到稳定 ref，可 show / zoom / filter，或交给下一个 Agent。
- **命名记忆变量**：把结果保存成 `@failures`，复用 `@last`，管道用 `@`，也可 `@failures[1,3..5]` 取子集。
- **跨设备访问**：只读分享 workspace，用 `desk:...` ref 像读本地一样浏览另一台设备。
- **一键安装与诊断**：`sivtr setup` 装 hooks + MCP；`sivtr doctor --fix` 自动修复。
- **人用 CLI 仍然在**：search / show / filter / nav，以及 TUI 浏览器——有用，但不是主叙事。

## 快速开始

安装预编译 CLI（无需 Rust 工具链）：

```bash
cargo binstall sivtr
```

Linux 上 `cargo binstall` 默认安装静态 musl 构建（不依赖系统 GLIBC 版本），与 `install.sh` 同源。

其它方式：

```bash
cargo install sivtr                  # 从源码编译（需要 Rust）
curl -fsSL https://raw.githubusercontent.com/Ariestar/sivtr/main/install.sh | sh   # Linux/macOS/WSL 一行安装
```

Windows（PowerShell）：

```powershell
irm https://raw.githubusercontent.com/Ariestar/sivtr/main/install.ps1 | iex
```

升级：

```bash
sivtr update    # 下载最新 release，SHA256 校验后原地替换
```

首次安装（hooks + MCP 宿主）：

```bash
sivtr setup             # hooks + MCP 宿主 + sivtr-memory skill（缺失时安装）
# 或分步：
sivtr init powershell   # 或 bash、zsh、nushell
sivtr mcp install       # 检测已装宿主；或 -p claude,cursor,codex,opencode,openclaw,grok,hermes,pi
npx skills add Ariestar/sivtr --skill sivtr-memory -g -y
sivtr doctor
```

> [!NOTE]
> 在 Windows 上，如果 `sivtr init powershell` 提示 profile 没有加载，执行一次 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 把当前用户的执行策略调高即可。sivtr 不会修改注册表——hook 只写在你的 PowerShell profile 里。

## Agent 记忆（MCP）

这是主路径。`sivtr mcp install` 之后，Agent 通过结构化工具读写本地终端与 AI session 记忆：

### 工具 · 用途
- **工具**: `sivtr_search` · **用途**: 找最近失败、决策、命令
- **工具**: `sivtr_show` · **用途**: 打开命中背后的精确 record/part
- **工具**: `sivtr_zoom` · **用途**: 展开前后上下文
- **工具**: `sivtr_filter` · **用途**: 缩小结果集
- **工具**: `sivtr_status` · **用途**: workspace / remote / origin 状态

可选 skill（教 Agent 何时调用这些工具）：

```bash
npx skills add Ariestar/sivtr --skill sivtr-memory -g
```

然后直接说：

```text
修复最近的终端报错。先用 sivtr。
```

Agent 应先搜本地证据、打开原文、改代码并验证——而不是让你粘贴日志。

需要自己查时，CLI 仍然可用：

```bash
sivtr s terminal --status failure --latest 5 --refs
sivtr s agent -m "TODO|decision|failed" --since today -f timeline
```

## 示例

更多完整玩法见 [Playbooks / 玩法实例](https://sivtr.pages.dev/zh-cn/playbooks/)。

### 场景 · 你怎么用 · 演示
- **场景**: 修复最近的终端报错 · **你怎么用**: 对 Agent 说（MCP）：`修复最近的终端报错。先用 sivtr。` · **演示**: ![用 sivtr 修复最近终端报错](docs-site/public/demo/1.gif)
- **场景**: 中断后继续 · **你怎么用**: 对 Agent 说：`继续。先用 sivtr memory。` · **演示**: ![中断后用 sivtr 记忆继续](docs-site/public/demo/5.gif)
- **场景**: 给下一个 Agent 写交接 · **你怎么用**: 对 Agent 说：`给下一个 Agent 写一份带证据的交接。` · **演示**: ![生成有证据的 Agent 交接](docs-site/public/demo/6.gif)
- **场景**: 生成最近工作时间线 · **你怎么用**: `sivtr s agent --since today --sort oldest -f timeline``sivtr s terminal --since today --sort oldest -f timeline` · **演示**: ![生成最近工作时间线](docs-site/public/demo/3.gif)
- **场景**: 把结果保存成变量并继续处理 · **你怎么用**: `sivtr s terminal -m "panic" --save failures``sivtr filter @failures --status failure --refs` · **演示**: ![链式使用已保存的记忆变量](docs-site/public/demo/4.gif)

## 核心概念

### 概念 · 含义
- **概念**: WorkRecord · **含义**: 一个有用的工作事件：终端命令、Agent turn、工具调用或捕获输出块。
- **概念**: WorkPart · **含义**: Record 里的命令、输出、assistant 回复、tool output 或 error。只想拿有用片段而不是整个事件时用它。
- **概念**: WorkRef · **含义**: 某段精确记忆的稳定地址，例如 `pi/<session>/3/p1`。适合引用、复现和交接。
- **概念**: WorkSet · **含义**: `@last`、`@failures` 这类记忆变量背后的数据：一组有顺序的 refs，可以筛选、保存、切片、管道传递、导航、扩展和展示。

记忆变量：

### 句柄 · 用途
- **句柄**: `@last` · **用途**: 最近一次搜索或投影结果。
- **句柄**: `@name` · **用途**: 通过 `--save name` 或 `sivtr var set name` 创建的命名变量，例如 `@failures`。
- **句柄**: `@name[1,3..5]` · **用途**: 从已保存变量中只取几项。
- **句柄**: `@` · **用途**: 使用管道里上一条命令传来的结果。

## 命令概览

### 命令 · 用途
- **命令**: `sivtr` · **用途**: TTY 打开 workspace 浏览器；管道 stdin 打开单缓冲浏览器。
- **命令**: `sivtr pipe` · **用途**: 读取 stdin 并打开输出浏览器。
- **命令**: `sivtr run <command>` · **用途**: 执行命令、捕获输出并浏览。
- **命令**: `sivtr copy` · **用途**: 复制最近终端命令块。
- **命令**: `sivtr copy ` · **用途**: 从任意已注册 Agent provider 复制内容（registry 驱动：Codex、Claude、Cursor、OpenCode、OpenClaw、Hermes、Grok、Pi…）。
- **命令**: `sivtr search` / `sivtr s` · **用途**: 搜索终端和 Agent memory；命中结果保存为 `@last`。
- **命令**: `sivtr filter ` · **用途**: 对 source 或管道传入的 WorkSet 应用统一过滤。
- **命令**: `sivtr var` · **用途**: 列出、保存、删除、合并、移除或清空命名 WorkSet 变量。
- **命令**: `sivtr nav  <motion>` · **用途**: 用 `<`、`>N`、`+N`、`-N`、`[A..B]`、`~` 确定性移动 anchors。
- **命令**: `sivtr work sessions` · **用途**: 列出当前 workspace 的 terminal 和 Agent sessions。
- **命令**: `sivtr work records ` · **用途**: 把 sessions 或已保存变量转成事件级 refs。
- **命令**: `sivtr work parts ` · **用途**: 从匹配事件里抽出真正有用的输入/输出片段。
- **命令**: `sivtr show <ref-or-workset>` · **用途**: 打印 refs、`@last`、`@name` 或管道结果背后的内容。也支持远程 ref，如 `desk:terminal/...`。
- **命令**: `sivtr zoom ` · **用途**: 给搜索命中补上前后 record 上下文。
- **命令**: `sivtr diff <left> <right>` · **用途**: 对比最近命令块。
- **命令**: `sivtr serve` · **用途**: 启动/停止本机 remote-memory daemon。
- **命令**: `sivtr share` · **用途**: 显式分享本机 workspace 给远端。
- **命令**: `sivtr remote` · **用途**: 把远端 share 挂到当前 workspace（`add`/`list`/`remove`/`test`）。
- **命令**: `sivtr workspace` / `sivtr ws` · **用途**: 列出本机已知 workspace（`name:body` 的 origin 标签）。
- **命令**: `sivtr mcp` · **用途**: MCP server 与宿主安装（`serve` / `install` / `uninstall` / `print-config`）。
- **命令**: `sivtr doctor` · **用途**: 诊断 binary、config、session logs、hooks、providers、clipboard；有新版本时提示。
- **命令**: `sivtr update` · **用途**: 从 GitHub Releases 自更新到最新版本。
- **命令**: `sivtr init <shell>` · **用途**: 安装 shell integration；也支持 `show` 和 `uninstall`。
- **命令**: `sivtr config` · **用途**: 管理 TOML 配置文件。
- **命令**: `sivtr history` · **用途**: 列出、搜索、查看捕获输出历史。
- **命令**: `sivtr hotkey` · **用途**: 管理 Windows AI session picker 全局热键守护进程。

## 远程访问

两台装了 sivtr 的设备可以像读本地一样互相读取 workspace 的 session——用于协同开发：想看队友的终端输出或 AI 会话时，不用离开自己的机器。

ref 统一为 `origin:body`：

```text
codex/4                 # 本机当前 workspace
docs:codex/4            # 本机另一个 workspace（按目录名）
desk:terminal/...       # remote add 得到的远端名
alice/sivtr:hermes/...  # device/workspace 坐标
```

在持有 workspace 的设备上：

```bash
sivtr share                   # 交互选择 workspace（Enter = 当前）；只创建 share
sivtr share invite <name>     # 签发单次 invite（stdout = bare key）
sivtr ws list                 # 查看本机 workspace origin 标签
```

在另一台设备上：

```bash
sivtr remote add desk    # 粘贴 `sivtr share invite` 输出的 bare key
sivtr s desk:terminal --status failure --latest 5 --refs
sivtr show desk:terminal/session_42/3
sivtr zoom desk:terminal/session_42/3 -C 2
sivtr nav desk:terminal/session_42/3 +1 --refs
sivtr copy desk:terminal/session_42/3 --print
```

分享是 opt-in、只读，默认在数据离开本机前脱敏常见密钥。远程传输走加密 iroh；需要时会自动启动 daemon。未登记的 origin 会报错——用 `sivtr remote add` 登记 remote，或用 `sivtr ws` 查看本机 workspace。

## 支持来源

### Source · 支持内容
- **Source**: Terminal · **支持内容**: Bash、Zsh、PowerShell、Nushell shell hooks；pipe 和 run capture。
- **Source**: Codex · **支持内容**: 本地 rollout/session JSONL files。
- **Source**: Claude Code · **支持内容**: 本地 transcript/session files。
- **Source**: Cursor · **支持内容**: 本地 Cursor agent transcript JSONL。
- **Source**: OpenCode · **支持内容**: 本地 session 数据库。
- **Source**: OpenClaw · **支持内容**: 本地 OpenClaw agent SQLite（+ legacy JSONL）。
- **Source**: Hermes · **支持内容**: 本地 Hermes `state.db`（`sessions/` 下 JSONL 为 residual）。
- **Source**: Grok · **支持内容**: 本地 Grok agent sessions（`~/.grok`，可用 `GROK_HOME`）。
- **Source**: Pi · **支持内容**: 本地 Pi agent session logs。

## 文档

- 文档：[https://sivtr.pages.dev/](https://sivtr.pages.dev/)
- 中文文档：[https://sivtr.pages.dev/zh-cn/](https://sivtr.pages.dev/zh-cn/)
- Playbooks：[https://sivtr.pages.dev/zh-cn/playbooks/](https://sivtr.pages.dev/zh-cn/playbooks/)
- CLI Reference：[docs-site/src/content/docs/reference/cli.md](docs-site/src/content/docs/reference/cli.md)
- Memory skill：[skills/sivtr-memory](skills/sivtr-memory)

## 开发

环境、PR 约定与编码指南见 [CONTRIBUTING.md](CONTRIBUTING.md)。

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```

文档站：

```bash
cd docs-site
bun install --frozen-lockfile
bun run build
```

仓库结构：

```text
crates/sivtr-core/  core model、provider parsers、search、history、config
src/                CLI commands、TUI、shell hooks、hotkey integration
docs-site/          Astro/Starlight documentation site
editors/vscode/     AI session picker 的 VS Code bridge
skills/             bundled agent skills
```