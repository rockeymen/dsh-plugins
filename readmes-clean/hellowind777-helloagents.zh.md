![HelloAGENTS](./readme_images/01-hero-banner.svg)

# HelloAGENTS

**面向 AI 编码 CLI 的工作流层：技能、知识库、交付检查、更安全的配置写入，以及可恢复的执行流程。**

> [!IMPORTANT]
> 如果你在找 `v2.x`，旧的 Python 版本已经迁到 [helloagents-archive](https://github.com/hellowind777/helloagents-archive)。`v3` 是基于 Node.js、Markdown 规则、skills 和轻量运行时脚本的完全重写版本。

> 🏅 此项目已链接认可 [LINUX DO](https://linux.do) 社区。

## HelloAGENTS 做什么

AI 编码 CLI 写代码能力很强，但常见问题也很明显：停在建议不肯动手、跳过检查步骤、丢失项目上下文、遇到困难推卸责任、没做完就报告完成。

HelloAGENTS 叠加在 Claude Code、Gemini CLI、Grok Build、Cursor 和 Codex CLI 之上，将模型锚定为高能力执行者，阻断推责模式，帮助模型选择合适流程、使用任务相关的质量技能、维护项目知识库，并在交付前完成验证。

**没有 HelloAGENTS**

![Without HelloAGENTS](./readme_images/08-demo-snake-without-helloagents.png)

**使用 HelloAGENTS**

![With HelloAGENTS](./readme_images/07-demo-snake-with-helloagents.png)

### 问题 · 没有 HelloAGENTS · 使用 HelloAGENTS
- **问题**: 结束过早 · **没有 HelloAGENTS**: 停在建议 · **使用 HelloAGENTS**: 继续实现、验证和收尾
- **问题**: 模型推责 · **没有 HelloAGENTS**: 拒绝难任务，建议换工具/模型 · **使用 HelloAGENTS**: 穷尽替代路径，持续执行到底
- **问题**: 质量不稳定 · **没有 HelloAGENTS**: 很依赖提示词 · **使用 HelloAGENTS**: 按任务类型激活 14 个质量技能
- **问题**: 上下文分散 · **没有 HelloAGENTS**: 方案散落在聊天记录里 · **使用 HelloAGENTS**: 项目知识和方案文件落在磁盘上
- **问题**: 完成态模糊 · **没有 HelloAGENTS**: 自然语言说“完成” · **使用 HelloAGENTS**: 按状态、证据和验证结果交付
- **问题**: 配置容易漂移 · **没有 HelloAGENTS**: CLI 文件可能不一致 · **使用 HelloAGENTS**: 安装、更新、清理和 doctor 会检查受管文件

## 核心功能

### 1）14 个内置工作流技能

HelloAGENTS 内置 14 个技能。技能只在当前阶段需要时读取，因此简单任务不会被额外流程拖慢，复杂任务则会得到更完整的检查。

### 技能 · 关注点
- **技能**: `hello-ui` · **关注点**: UI 规划、设计契约、实现映射、视觉验收
- **技能**: `hello-api` · **关注点**: API 设计、校验、错误格式、兼容性
- **技能**: `hello-security` · **关注点**: 认证、密钥、权限、注入风险
- **技能**: `hello-test` · **关注点**: TDD、覆盖率、边界用例、测试结构
- **技能**: `qa-review` · **关注点**: 统一质量审查、命令验证、阻断修复、交付证据、收尾
- **技能**: `helloagents` · **关注点**: 命令路由、工作流阶段规则、项目知识和状态协调
- **技能**: `hello-errors` · **关注点**: 错误处理、日志、重试和恢复
- **技能**: `hello-perf` · **关注点**: 性能、缓存、查询和渲染风险
- **技能**: `hello-data` · **关注点**: 数据库、迁移、事务、索引
- **技能**: `hello-arch` · **关注点**: 架构、边界、代码体积、可维护性
- **技能**: `hello-debug` · **关注点**: 问题诊断和卡住时的升级处理
- **技能**: `hello-subagent` · **关注点**: 子代理分工和结果整合
- **技能**: `hello-write` · **关注点**: 文档、报告和文字交付
- **技能**: `hello-reflect` · **关注点**: 可复用经验和知识更新

所有 UI 任务都会先受共享的 UI 质量基线约束。
在宿主全局模式、已初始化项目或明确的 UI 工作流里，`hello-ui` 会在该基线之上补充设计契约执行、设计系统映射与视觉验收。
当需要视觉证据时，HelloAGENTS 会写入当前会话的 `artifacts/visual.json`。

### 2）面向不同工作方式的命令

命令在 AI CLI 对话中使用，以 `~` 开头。HelloAGENTS 会直接读取对应 command skill；无关技能不会提前加载，除非后续流程确实需要。

### 命令 · 用途
- **命令**: `~ask` · **用途**: 交互式需求澄清：一问一答厘清目标、方向、范围与约束；不写文件
- **命令**: `~auto` · **用途**: 自动选择主路径，并持续推进到交付或真实阻塞
- **命令**: `~plan` · **用途**: 需求、方案、任务拆分和方案包
- **命令**: `~build` · **用途**: 按当前请求或现有方案实现
- **命令**: `~prd` · **用途**: 通过逐维度讨论生成现代产品需求文档
- **命令**: `~loop` · **用途**: 长任务入口；在 Codex 中优先走 `/goal -> ~auto -> ~qa`
- **命令**: `~init` · **用途**: 初始化项目工作流并同步项目知识库
- **命令**: `~test` · **用途**: 为指定模块或最近变更编写测试
- **命令**: `~qa` · **用途**: 运行统一质量闭环：审查、验证命令、修复失败并收尾
- **命令**: `~commit` · **用途**: 生成规范化提交信息并同步知识库
- **命令**: `~clean` · **用途**: 归档已完成方案，清理临时运行文件
- **命令**: `~help` · **用途**: 显示命令和当前设置

兼容别名：

- `~do` → `~build`
- `~design` → `~plan`
- `~review` → `~qa`
- `~idea` → `~ask`（逐步废弃）

`~ask` 适合厘清需求、比较方向、判断价值、收缩范围——纯对话，不创建文件。

### 3）项目知识库

HelloAGENTS 可以在 `.helloagents/` 下创建和维护项目知识库。

知识库让后续对话不用反复重新理解同一批项目事实。它可以包含：

### 文件或目录 · 用途
- **文件或目录**: `context.md` · **用途**: 项目概览、技术栈、架构、模块索引
- **文件或目录**: `guidelines.md` · **用途**: 从仓库推断出的非显而易见编码约定
- **文件或目录**: `verify.yaml` · **用途**: lint、test、build 等验证命令
- **文件或目录**: `CHANGELOG.md` · **用途**: 项目级变更记录
- **文件或目录**: `DESIGN.md` · **用途**: UI 项目的稳定设计契约
- **文件或目录**: `modules/*.md` · **用途**: 模块级说明和经验
- **文件或目录**: `plans/<feature>/` · **用途**: 活跃方案包
- **文件或目录**: `archive/` · **用途**: 已归档方案包

`~init` 用来初始化项目工作流：写入项目级 `HELLOAGENTS_PROFILE: full` 标记、准备项目状态，并创建或更新知识库。

### 4）结构化方案包

复杂任务不再只依赖聊天里的几段说明，而是可以落成方案包。

`~plan` 使用：

- `requirements.md`
- `plan.md`
- `tasks.md`
- `contract.json`

`~prd` 还会生成 PRD 文件，例如：

- `prd/00-overview.md`
- `prd/01-user-stories.md`
- `prd/02-functional.md`
- `prd/03-ui-design.md`
- `prd/04-technical.md`
- `prd/05-nonfunctional.md`
- `prd/06-i18n-l10n.md`
- `prd/07-accessibility.md`
- `prd/08-content.md`
- `prd/09-testing.md`
- `prd/10-deployment.md`
- `prd/11-legal-privacy.md`
- `prd/12-timeline.md`

`contract.json` 会影响 `qaMode`、`qaFocus`、可选 advisor 检查和可选视觉验收。

`tasks.md` 还会保留 Codex `/goal` 执行入口。长程 Codex 任务应使用这个已拆分入口，不要把原始产品文档直接交给 `/goal`。默认链路是 `/goal -> ~auto -> ~qa`：`/goal` 负责长程续跑，`~auto` 负责执行 AFK 任务，`~qa` 负责最终质量闭环与收尾前验收。

### 5）状态与恢复

长任务需要一个小型恢复快照，但多个对话共用一个状态文件并不安全。

HelloAGENTS 现在只从 `state_path` 解析当前状态文件：

- 宿主提供稳定会话标识或可复用会话标识时：`.helloagents/sessions/<workspace>/<session>/STATE.md`
- 暂时还拿不到可复用会话标识时：`.helloagents/sessions/<workspace>/default/STATE.md`

`<workspace>` 是当前 Git 分支、detached HEAD 的 `detached-<sha>`，或非 Git 项目的 `workspace`。`<session>` 是当前项目本地会话标识。`.helloagents/sessions/active.json` 只保留最近一次活跃的工作区/会话映射和 alias 桥接，这样同一个 CLI 会话会稳定落在同一个目录里，`/resume` 也能复用它。

对于项目本地会话目录，HelloAGENTS 会优先使用稳定宿主标识，如 `sessionId`、`conversationId`、`threadId` 或 `HELLOAGENTS_NOTIFY_SESSION_ID`。如果宿主只能提供 `WT_SESSION`、`TERM_SESSION_ID`、`WINDOWID` 这类窗口或终端标识，HelloAGENTS 只把它们当作轻量 alias 桥接，并优先复用已映射的会话目录，而不是继续分裂出重复目录。如果一个会话启动时还拿不到稳定宿主标识，HelloAGENTS 可以先落到 `default`，等同一个 CLI 会话后续拿到稳定标识时，仍继续复用这个活动目录，而不是再拆出第二个会话目录。

`STATE.md` 只记录当前工作流做到哪里，不承担所有对话的统一记忆。Codex `/goal` 也不替代 `state_path`、`turn-state` 或本地证据文件；它只负责 Codex 侧的长程续跑。

### 6）验证与交付证据

HelloAGENTS 不把“命令通过”和“任务完成”简单画等号。交付还可能要求需求覆盖、任务清单、审查证据、advisor 证据和视觉证据。

运行态现在尽量收敛，只保留真正有用的文件：

- `.helloagents/sessions/<workspace>/<session>/STATE.md`
- `.helloagents/sessions/<workspace>/<session>/runtime.json`
- `.helloagents/sessions/active.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/qa-review.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/advisor.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/visual.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/closeout.json`
- 可选 `.helloagents/sessions/<workspace>/<session>/events.jsonl`
- 仅用于 Codex 原生收尾去重的 `~/.codex/.helloagents/notify-state.json`

`STATE.md` 只保留给人看的恢复快照。`runtime.json` 只给机器用，只保存极少量运行态。`artifacts/*.json` 只保留结构化收据。`events.jsonl` 仍是可选 trace 输出，默认不写。
项目本地 `STATE.md` 现在会更晚创建。

标准运行态证据和临时运行态现在默认 72 小时过期。只有工作流明确需要的长程 Codex goal 链路，才继续保留 720 小时上限。

交付门控、守卫和 QA 门禁提示使用执行性表述，例如处理路径、收尾动作和视觉验收动作。阻塞流程会说明下一步要做什么，而不是把可执行步骤写成泛化建议。最终回复还会强制只保留一个 HelloAGENTS 外层块，避免同一条回复重复输出完成标题。
这个外层格式现在只保留给直接面向最终用户的终局交付。中间汇报、委派任务结果和子代理回复都保持自然输出；子代理结束钩子也会拦截错误的外层收尾格式。

### 7）更安全的安装、更新、清理和诊断

CLI 显式管理宿主文件：

- `install` 只写入指定目标，除非使用 `--all`
- `update` 刷新指定目标或全部目标
- `cleanup` 删除受管注入和链接
- `uninstall` 在移除包前执行对应清理
- `doctor` 检查规则文件、链接、hooks、配置项、插件根目录、缓存副本、版本漂移，以及 Claude / Gemini / Grok 是否真的装上了全局插件、扩展或 marketplace 插件；对 Codex 还会在可用时附带原生 `codex doctor` 结果
- Codex 受管 `notify = ["helloagents-js", "codex-notify"]` 会继续保持可移植；`doctor`、`cleanup` 和 `uninstall` 也能识别 Codex App / Computer Use 使用的 `--previous-notify` 包装链
- 单 CLI 模式记录只会在宿主安装成功后写入；如果原生全局清理失败，也会继续保留 `global` 记录，而不是悄悄叠加 standby
- 直接执行 `switch-branch` 时，会先清掉陈旧的 `HELLOAGENTS*` 生命周期环境变量；包级 `preuninstall` 在没有显式宿主参数时固定回退到 `--all`，避免残留 shell 环境把切分支或卸载清理错误缩窄到旧目标
- Windows 下的 `.cmd` / `.bat` 生命周期调用现在统一走显式命令包装，不再出现 Node `DEP0190` shell 弃用警告
- Claude Code、Gemini CLI、Grok Build、Cursor 和 Codex CLI 的配置写入、更新、清理、卸载、模式切换与分支切换，现在按一条完整生命周期链路验证，而不是分散的“尽量覆盖”

## 快速开始

### 1）安装包

```bash
npm install -g --allow-scripts=helloagents helloagents
```

如果系统里已经有别的 `helloagents` 可执行文件，可以使用稳定的受管入口别名：

```bash
helloagents-js
```

默认情况下，`postinstall` 会安装包命令、初始化 `~/.helloagents/helloagents.json`，并把运行时文件同步到 `~/.helloagents/helloagents`。如果希望 npm 在安装或更新后直接部署，设置 `HELLOAGENTS=目标[:模式]`，例如 `HELLOAGENTS=codex:global`。

如果你使用的是 npm 11 或更高版本，建议在直接安装或升级包时保留 `--allow-scripts=helloagents`，这样 npm 会直接放行受管 `postinstall`，不再弹出审批警告。若你仍在使用 npm 10 或更早版本，可以省略这个参数。

### 2）部署到目标 CLI

想按项目显式激活，使用标准模式：

```bash
helloagents install codex --standby
helloagents install --all --standby
```

想在所有项目默认启用完整规则，使用全局模式：

```bash
helloagents --global
helloagents install --all --global
```

重装、刷新或切换模式后，请重启对应 AI CLI 或新开会话；已运行会话不会自动重载注入规则。

### 3）在 AI CLI 里验证

输入：

```text
~help
```

应能看到可用对话命令和当前设置。

### 4）创建项目知识

初始化项目工作流：

```text
~init
```

## CLI 管理

### Shell 命令

```bash
helloagents --standby
helloagents --global
helloagents install codex --standby
helloagents install --all --global
helloagents update codex
helloagents cleanup claude --global
helloagents uninstall gemini
helloagents switch-branch beta
helloagents switch-branch beta claude --global
helloagents doctor
helloagents doctor codex --json
helloagents codex goals status
helloagents codex goals enable
```

支持的目标：

- `claude`
- `gemini`
- `grok`
- `cursor`
- `codex`
- `--all`

省略 `--standby` 或 `--global` 时，HelloAGENTS 会先复用该 CLI 已记录或检测到的模式，再回退到 `standby`。

### npm 和一键脚本入口

当你不想依赖更新过程中的 `helloagents` 可执行文件时，用 npm 或一键脚本。`HELLOAGENTS=目标[:模式]` 中，目标支持 `all`、`claude`、`gemini`、`grok`、`cursor`、`codex`；模式支持 `standby`、`global`。用于安装时，省略模式按 `standby` 处理；用于更新、清理、卸载和切换分支时，省略模式会原样下传，让 HelloAGENTS 先复用该 CLI 已记录或检测到的模式。如果未提供 `HELLOAGENTS`，一键安装脚本现在会保持“只装包/只升级包”的默认语义，不会自动部署任何宿主 CLI。若要安装自定义 tarball 或包规格，用 `HELLOAGENTS_PACKAGE`，不要写 `HELLOAGENTS_BRANCH`。对于已经装好的包，如需确保宿主一定刷新，优先在包命令后显式执行一次 `npm explore -g helloagents -- npm run sync-hosts -- ...`。Shell 和 PowerShell 一键脚本会自动识别 npm 11+，只在宿主支持时追加 `--allow-scripts=helloagents`。

宿主配置使用稳定的 `helloagents-js` 入口和运行根目录 `~/.helloagents/helloagents`，Node 全局包路径变化不会破坏受管 hooks 或 Codex `notify`。Codex hooks 使用独立 `~/.codex/hooks.json`，不把大段配置写入 `config.toml`；Codex 全局插件根目录和插件缓存也会回链到这个稳定运行根目录。Claude Code 的 global 安装使用独立本地 marketplace 投影 `~/.helloagents/host-projections/claude-marketplace`，Gemini 的 global 扩展使用 `~/.helloagents/host-projections/gemini`，Grok Build 的 global 安装使用实体化 marketplace 投影 `~/.helloagents/host-projections/helloagents-grok-marketplace`，Cursor 的 global 安装使用精简本地插件投影 `~/.helloagents/host-projections/cursor-local-plugin/helloagents`，并把真实插件目录复制到 `~/.cursor/plugins/local/helloagents`，这样宿主专用打包链路不再污染共享运行根，也不依赖仅靠符号链接解析的插件加载。

#### npm 命令

macOS / Linux：

```bash
# 安装到 Codex，标准模式
HELLOAGENTS=codex npm install -g --allow-scripts=helloagents helloagents

# 安装到 Codex，全局模式
HELLOAGENTS=codex:global npm install -g --allow-scripts=helloagents helloagents

# 先更新包，再刷新 Claude，标准模式
npm install -g --allow-scripts=helloagents helloagents@latest
npm explore -g helloagents -- npm run sync-hosts -- claude --standby

# 先切到 beta 分支，再刷新全部 CLI，标准模式
npm install -g --allow-scripts=helloagents https://github.com/hellowind777/helloagents/archive/refs/heads/beta.tar.gz
npm explore -g helloagents -- npm run sync-hosts -- --all --standby

# 卸载包前清理 Gemini 集成
npm explore -g helloagents -- npm run uninstall -- gemini --standby
npm uninstall -g helloagents
```

Windows PowerShell：

```powershell
# 安装到 Codex，标准模式
$env:HELLOAGENTS="codex"; npm install -g --allow-scripts=helloagents helloagents

# 安装到 Codex，全局模式
$env:HELLOAGENTS="codex:global"; npm install -g --allow-scripts=helloagents helloagents

# 先更新包，再刷新 Claude，标准模式
npm install -g --allow-scripts=helloagents helloagents@latest
npm explore -g helloagents -- npm run sync-hosts -- claude --standby

# 先切到 beta 分支，再刷新全部 CLI，标准模式
npm install -g --allow-scripts=helloagents https://github.com/hellowind777/helloagents/archive/refs/heads/beta.tar.gz
npm explore -g helloagents -- npm run sync-hosts -- --all --standby

# 卸载包前清理 Gemini 集成
npm explore -g helloagents -- npm run uninstall -- gemini --standby
npm uninstall -g helloagents
```

包已安装后，也可以直接调用包内 npm scripts：

```bash
npm explore -g helloagents -- npm run deploy:global
npm explore -g helloagents -- npm run sync-hosts -- --all --standby
npm explore -g helloagents -- npm run cleanup-hosts -- codex --standby
npm explore -g helloagents -- npm run uninstall -- --all
```

首次安装仍然可以直接用 `HELLOAGENTS=目标[:模式]`。但对于更新、切换分支或强制重同步已安装包，以上显式 `npm run sync-hosts` 路径更确定。

#### 一键脚本

macOS / Linux：

```bash
# 安装
HELLOAGENTS=codex curl -fsSL https://raw.githubusercontent.com/hellowind777/helloagents/main/install.sh | sh

# 更新
HELLOAGENTS=claude:standby HELLOAGENTS_ACTION=update curl -fsSL https://raw.githubusercontent.com/hellowind777/helloagents/main/install.sh | sh

# 切换分支
HELLOAGENTS=all:global HELLOAGENTS_ACTION=switch-branch HELLOAGENTS_BRANCH=beta curl -fsSL https://raw.githubusercontent.com/hellowind777/helloagents/main/install.sh | sh

# 只清理宿主集成，不卸载包
HELLOAGENTS=codex:standby HELLOAGENTS_ACTION=cleanup curl -fsSL https://raw.githubusercontent.com/hellowind777/helloagents/main/install.sh | sh

# 卸载
HELLOAGENTS=gemini HELLOAGENTS_ACTION=uninstall curl -fsSL https://raw.githubusercontent.com/hellowind777/helloagents/main/install.sh | sh
```

Windows PowerShell：

```powershell
# 安装
$env:HELLOAGENTS="codex"; irm https://raw.githubusercontent.com/hellowind777/helloagents/main/install.ps1 | iex

# 更新
$env:HELLOAGENTS="claude:standby"; $env:HELLOAGENTS_ACTION="update"; irm https://raw.githubusercontent.com/hellowind777/helloagents/main/install.ps1 | iex

# 切换分支
$env:HELLOAGENTS="all:global"; $env:HELLOAGENTS_ACTION="switch-branch"; $env:HELLOAGENTS_BRANCH="beta"; irm https://raw.githubusercontent.com/hellowind777/helloagents/main/install.ps1 | iex

# 只清理宿主集成，不卸载包
$env:HELLOAGENTS="codex:standby"; $env:HELLOAGENTS_ACTION="cleanup"; irm https://raw.githubusercontent.com/hellowind777/helloagents/main/install.ps1 | iex

# 卸载
$env:HELLOAGENTS="gemini"; $env:HELLOAGENTS_ACTION="uninstall"; irm https://raw.githubusercontent.com/hellowind777/helloagents/main/install.ps1 | iex
```

Shell 和 PowerShell 一键脚本现在都会先解析一次 `HELLOAGENTS`；未指定目标时保持普通包安装/升级语义；在更新、切分支和卸载前清掉生命周期环境变量，然后只走一条显式同步或清理链路。

### 分支切换

`switch-branch` 会先安装指定 npm/GitHub ref，再通过 npm 脚本同步宿主 CLI，避免依赖更新过程中的 `helloagents` 可执行文件：

```bash
helloagents switch-branch beta
helloagents switch-branch beta claude --global
helloagents branch beta --all --standby
```

直接执行 `helloagents switch-branch ...` 时，也会在内部 npm 安装和宿主同步之前先清理陈旧的 `HELLOAGENTS*` 生命周期环境变量。

如果只想切换包本身，暂不同步宿主 CLI，可以直接使用 npm：

```bash
npm install -g --allow-scripts=helloagents https://github.com/hellowind777/helloagents/archive/refs/heads/beta.tar.gz
npm install -g --allow-scripts=helloagents helloagents@latest
npm explore -g helloagents -- npm run uninstall -- --all
npm uninstall -g helloagents
```

### 标准模式文件

### CLI · 写入或更新的文件 · 清理行为
- **CLI**: Claude Code · **写入或更新的文件**: `~/.claude/CLAUDE.md`、`~/.claude/settings.json`、`~/.claude/helloagents -> ~/.helloagents/helloagents` · **清理行为**: 删除受管标记块、HelloAGENTS hooks / 权限和符号链接
- **CLI**: Cursor · **写入或更新的文件**: `~/.cursor/hooks.json`、`~/.cursor/helloagents -> ~/.helloagents/helloagents` · **清理行为**: 删除受管 Cursor hooks 和运行时符号链接
- **CLI**: Gemini CLI · **写入或更新的文件**: `~/.gemini/GEMINI.md`、`~/.gemini/settings.json`、`~/.gemini/helloagents -> ~/.helloagents/helloagents` · **清理行为**: 删除受管标记块、HelloAGENTS hooks 和符号链接
- **CLI**: Grok Build · **写入或更新的文件**: `~/.grok/AGENTS.md`、`~/.grok/hooks/helloagents.json`、`~/.grok/helloagents -> ~/.helloagents/helloagents` · **清理行为**: 删除受管标记块、受管 Grok hooks 文件和符号链接
- **CLI**: Codex CLI · **写入或更新的文件**: `~/.codex/AGENTS.md`、`~/.codex/config.toml`、`~/.codex/hooks.json`、`~/.codex/helloagents -> ~/.helloagents/helloagents`、受管备份 · **清理行为**: 删除受管标记块、受管配置键、受管 hooks、符号链接和最近一次受管备份

### 全局模式文件

### CLI · 安装方式 · 涉及文件
- **CLI**: Claude Code · **安装方式**: 原生插件安装 · **涉及文件**: `~/.helloagents/host-projections/claude-marketplace`，以及由 Claude Code 宿主管理的插件元数据 / 缓存
- **CLI**: Cursor · **安装方式**: 原生本地插件安装 · **涉及文件**: `~/.helloagents/host-projections/cursor-local-plugin/helloagents`，再实体化复制到 `~/.cursor/plugins/local/helloagents`
- **CLI**: Gemini CLI · **安装方式**: 原生扩展安装 · **涉及文件**: `~/.helloagents/host-projections/gemini`、`~/.gemini/extensions/helloagents`
- **CLI**: Grok Build · **安装方式**: 原生 marketplace + 插件安装 · **涉及文件**: `~/.helloagents/host-projections/helloagents-grok-marketplace`、`~/.grok/config.toml`、`~/.grok/installed-plugins/registry.json`，以及由 Grok 宿主管理的插件缓存
- **CLI**: Codex CLI · **安装方式**: 原生本地插件流程 · **涉及文件**: `~/.agents/plugins/marketplace.json`、`~/plugins/helloagents/ -> ~/.helloagents/helloagents`、`~/.codex/plugins/cache/local-plugins/helloagents/local/ -> ~/.helloagents/helloagents`、`~/.codex/config.toml`、`~/.codex/hooks.json`、`~/.codex/helloagents -> ~/.helloagents/helloagents`

全局模式下，HelloAGENTS 会自动尝试宿主原生命令。Claude Code 走本地 marketplace 投影，Gemini 走本地 extension 投影，Grok Build 走实体化的本地 marketplace 投影，Cursor 会刷新 `~/.cursor/plugins/local/helloagents` 下的真实本地插件副本，Codex 继续回链同一个稳定运行根，因此安装、更新、切分支、切模式、清理和卸载都会围绕同一份运行时副本刷新。若宿主命令不可用，再手动执行：

```text
/plugin marketplace add "~/.helloagents/host-projections/claude-marketplace"
/plugin install helloagents@helloagents
gemini extensions link "~/.helloagents/host-projections/gemini"
grok plugin marketplace add "~/.helloagents/host-projections/helloagents-grok-marketplace"
grok plugin install "~/.helloagents/host-projections/helloagents-grok-marketplace/plugins/helloagents" --trust
```

对于 Cursor，把 `~/.helloagents/host-projections/cursor-local-plugin/helloagents` 里的内容复制到 `~/.cursor/plugins/local/helloagents`。在 Windows 上，不要依赖指向 `~/.cursor` 之外目录的符号链接或 junction。

Claude Code 会自动尝试等价的 `claude plugin marketplace add ...` 和 `claude plugin install ...` 命令。marketplace 名称和插件名称都是 `helloagents`，所以安装目标是 `helloagents@helloagents`。全局安装后需要重启宿主 CLI。

当你把 Claude、Gemini 或 Grok 从全局模式切回标准模式时，HelloAGENTS 会先移除原生插件、扩展或 marketplace 插件。如果这一步失败，会继续把该宿主记录为 `global`，而不是静默叠加 standby。

Codex 全局模式由 HelloAGENTS 通过本地插件路径自动安装。

## 对话命令

### 常见流程

### 目标 · 使用
- **目标**: 厘清需求、比较方向、判断价值与范围 · **使用**: `~ask "should this become a full platform or just a thin wedge?"`
- **目标**: 让 HelloAGENTS 自己选路并持续推进 · **使用**: `~auto "add JWT login"`
- **目标**: 先审查方案再实现 · **使用**: `~plan "refactor payment module"`
- **目标**: 按明确请求或活跃方案实现 · **使用**: `~build "finish task 2 in the plan"`
- **目标**: 生成完整产品需求文档 · **使用**: `~prd "modern dashboard for operations team"`
- **目标**: 用 `/goal -> ~auto -> ~qa` 跑一个长程 Codex 任务 · **使用**: `~loop "finish the auth refactor"`
- **目标**: 初始化或刷新项目工作流 · **使用**: `~init`
- **目标**: 验证当前工作 · **使用**: `~qa`
- **目标**: 生成提交信息并同步知识库 · **使用**: `~commit`

### 项目初始化与宿主全局部署

标准模式下，未初始化的项目只获得轻量规则和显式 `~command` 入口。执行 `~init` 后，项目级规则文件会写入 `<!-- HELLOAGENTS_PROFILE: full -->`，项目才进入已初始化状态。

全局模式下，HelloAGENTS 会在宿主层默认启用完整规则。

## 项目知识库

### 本地模式

默认情况下，项目