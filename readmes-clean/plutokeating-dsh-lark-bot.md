# dsh-lark-bot

  把 DeepSeek Harness 接入飞书 | Bridge DeepSeek Harness into Feishu / Lark

让 **DeepSeek Harness（`dsh`）** 成为你飞书里的一员：在手机、群聊、话题里指挥本机 coding agent，把对话、任务、卡片和**项目工作区**都收进同一个协作流。

*Turn **DeepSeek Harness (`dsh`)** into a member of your Feishu / Lark workspace — drive your local coding agent from mobile, group chats and topics, and fold conversations, tasks, cards and **project workspaces** into one collaborative flow.*

## 项目介绍 | What & Why

**用在什么场景？** 你在飞书 / Lark（私聊、群聊、话题）里指挥本机 DeepSeek Harness（`dsh`）
coding agent：发消息就收流式卡片与工具调用过程，把项目工作区、并行任务、会话归档都收进同一
个协作流。适合需要多项目隔离、角色分工、并行任务与故障自愈的开发者与团队。

**Where does it fit?** Drive your local DeepSeek Harness (`dsh`) coding agent from Feishu /
Lark — DMs, group chats and topics — with streaming cards, isolated project workspaces,
parallel tasks, session archival and self-healing when things break.

**功能亮点（以下六项为 dsh-lark-bot 全网独有组合）| Highlights (exclusive to dsh-lark-bot)**：

- 🆘 **Guardian 安全网守护 —— “永远叫得应”**：DSH 进程一崩，其他方案的机器人就变成死号，只能回
  服务器手动重启；dsh-lark-bot 的守护进程在 DSH 崩溃后**仍然会在飞书回复你**——告诉你引擎已挂、
  可进入仅核心安全模式，直接在飞书对话里发控制信号把它重启。**唯一“出故障时用户不会失联”的项目。**
  *When DSH crashes, this bot still answers in Feishu: enter core-only safe mode and send a
  control signal to restart it. The only project where users never lose contact.*
- 👥 **多角色 Agent —— “一个机器人，一整个团队”**：在飞书里用 `/role` 切换或指派 PM / 开发 /
  文档等角色，每个角色有持久化的人设、模型偏好与规则。
  *Switch or assign PM / dev / docs personas in chat with `/role` — each with its own
  persisted persona. One bot, a whole team.*
- ⚡ **并行多任务 —— “不用排队”**：同一群里可以**同时跑多个任务**，各自会话隔离；其他方案同聊
  串行，上一个没跑完下一个只能等。
  *Run multiple tasks in the same chat simultaneously with isolated sessions — no queueing.*
- 🗂 **会话归档与清理 —— “会话列表不会烂掉”**：`/archive` 归档旧任务、`/retention` 配置自动保留
  策略；长期使用也不会越积越多。
  *Archive old tasks and auto-prune with retention policies — your session list stays clean.*
- 📣 **跨会话主动通知 + @人 —— “活干完了它会来找你”**：Agent 在 A 群跑完任务，可以**主动发消息到
  B 群或私聊并 @ 你**；而不是“你问它答”。
  *Agents proactively report to other chats or DMs and @mention you when work finishes.*
- 🔑 **对话内管理模型和密钥 —— “不用离开飞书”**：`/providers` `/provider` `/key` 直接在聊天里
  查看、切换供应商、热更新密钥，全程闭环。
  *View providers, switch vendors and hot-update API keys entirely in chat — no server-side
  edits.*

## 快速开始 | Quick Start（普通用户先看这里 | for end users）

### 1. 安装（唯一路径）| Install (the only path)

本项目以 **dsh 标准 profile bundle** 交付：一行命令把它装进一个 dsh profile，dsh 启动时以
标准插件方式加载桥接引擎（`dsh.bundle.patch` 已声明，`dsh plugin add` 可直接安装）。

This project ships as a **standard dsh profile bundle**: one command installs it into a dsh
profile, and dsh loads the bridge engine as a standard plugin on boot (the package declares
`dsh.bundle.patch`, so `dsh plugin add` works directly).

```bash
# 唯一安装命令（无需先全局安装任何东西）| the only install command (no prior global install)
npx dsh-lark-bot@latest setup --profile dsh-lark
```

`setup` 会自动完成：发现本机 dsh → 预批准 pnpm 构建策略 → 执行标准的
`dsh plugin --profile dsh-lark add dsh-lark-bot`。

`setup` automatically: locates your dsh install → pre-approves pnpm's build policy → runs the
standard `dsh plugin --profile dsh-lark add dsh-lark-bot`.

### 2. 启动并扫码绑定 | Start and bind with one scan

```bash
dsh --profile dsh-lark
```

首次启动会在终端打印二维码：用飞书 / Lark App 扫码创建或选择 PersonalAgent 应用，绑定后
dsh-lark-bot 的桥接引擎即在 dsh 进程内运行（飞书通道、会话/工作区、卡片、通知回调），
私聊直接发消息，群聊 / 话题里 `@bot`。常驻与守护由 dsh 自己负责。

On first boot the terminal prints a QR code: scan it with the Feishu / Lark app to create or
choose a PersonalAgent app. After binding, the bridge engine runs **inside the dsh process**
(Feishu channel, sessions/workspaces, cards, notify callback); message it directly in private
chat, or use `@bot` in groups/topics. dsh owns the daemon lifecycle.

已有 PersonalAgent 应用时可在 profile 环境变量中直接提供凭据跳过扫码（见「配置」）：

With an existing PersonalAgent app, provide credentials via profile env to skip the QR step
(see Configuration):

```bash
DSH_LARK_APP_ID=cli_xxx DSH_LARK_APP_SECRET=<secret> DSH_LARK_TENANT=feishu \
  dsh --profile dsh-lark
```

> 卸载：`dsh plugin --profile dsh-lark remove dsh-lark-bot`。
> Uninstall: `dsh plugin --profile dsh-lark remove dsh-lark-bot`.

### 4. 基本使用 | Basic usage

在飞书里向 bot 发送普通消息即可开始工作，常用命令：

Just send a normal message to the bot in Feishu to get started. Common commands:

### 命令 Command · 作用 Description
- **命令 Command**: `/new` `/reset` · **作用 Description**: 开始新会话Start a new session
- **命令 Command**: `/cd ` · **作用 Description**: 切换工作目录并重置会话Change working directory and reset the session
- **命令 Command**: `/ws list` · **作用 Description**: 查看命名工作空间List named workspaces
- **命令 Command**: `/ws save <name>` · **作用 Description**: 保存当前工作空间Save the current workspace
- **命令 Command**: `/ws use <name>` · **作用 Description**: 切换到命名工作空间Switch to a named workspace
- **命令 Command**: `/ws remove <name>` · **作用 Description**: 删除命名工作空间Remove a named workspace
- **命令 Command**: `/status` · **作用 Description**: 查看当前状态Show current status
- **命令 Command**: `/resume` · **作用 Description**: 查看当前会话最近上下文Show the session's recent context
- **命令 Command**: `/stop` · **作用 Description**: 终止当前任务Stop the current task
- **命令 Command**: `/timeout [N\ · **作用 Description**: off\ · default]` · 查看或设置当前会话运行超时View or set the current session run timeout
- **命令 Command**: `/concurrency [N\ · **作用 Description**: default]` · 查看或设置当前 scope 并行任务数（默认 2）View or set the concurrent-run limit for this scope (default 2)
- **命令 Command**: `/role list`、`/role show ` · **作用 Description**: 查看角色列表 / 详情List roles / show a role
- **命令 Command**: `/role set `、`/role clear` · **作用 Description**: 为当前 scope 绑定 / 解除角色Bind / unbind a role for this scope
- **命令 Command**: `/role save  <name> [--persona 文案] [--model ] [--tools <csv>] [--rules 文案]` · **作用 Description**: 创建 / 更新角色（管理员）Create / update a role (admin)
- **命令 Command**: `/role remove ` · **作用 Description**: 删除角色（管理员）Remove a role (admin)
- **命令 Command**: `/notify <scope\ · **作用 Description**: chatId> <text>` · 跨会话发送通知（管理员）Push a cross-session notification (admin)
- **命令 Command**: `/notify list` · **作用 Description**: 查看 bridge 已注册的 scopeList scopes known to the bridge
- **命令 Command**: `/retention [N\ · **作用 Description**: default]` · 查看或设置保留消息条数（超出自动归档）View or set the live message retention window (overflow is archived)
- **命令 Command**: `/archive [note]`、`/archive list [N]`、`/archive clean` · **作用 Description**: 手动归档 / 查看 / 清理会话记录Archive / list / clean session transcripts
- **命令 Command**: `/density [compact\ · **作用 Description**: standard\ · detailed]` · 查看或设置卡片密度View or set card density
- **命令 Command**: `/model` · **作用 Description**: 查看当前模型、dsh 默认模型与可用模型列表View current model, dsh default model and available models
- **命令 Command**: `/model use ` · **作用 Description**: 热切换当前会话模型（下一轮生效，无需重启）Hot-switch the current session model (effective next message, no restart)
- **命令 Command**: `/model default ` · **作用 Description**: 写入 dsh 默认模型 `agent-default-model`（管理员）Write the dsh default model `agent-default-model` (admin)
- **命令 Command**: `/model add\ · **作用 Description**: remove  <modelId>` · 添加 / 删除 provider 的模型（管理员）Add / remove a provider model (admin)
- **命令 Command**: `/providers` · **作用 Description**: 查看 dsh 已配置 providers、模型与凭据状态View configured dsh providers, models and credential status
- **命令 Command**: `/provider add\ · **作用 Description**: update\ · remove ` · 管理 provider（管理员；deepseek-official 与自定义 pi-ai）Manage providers (admin; deepseek-official and custom pi-ai)
- **命令 Command**: `/key set\ · **作用 Description**: remove\ · list <引用名>` · 管理 dsh 凭据（set / remove 需管理员）Manage dsh credentials (set / remove require admin)
- **命令 Command**: `/ask <问题>` · **作用 Description**: 发送问答卡，回答写入会话上下文Send a Q&A card; the answer is written back to session context
- **命令 Command**: `/invite user\ · **作用 Description**: admin\ · group `、`/invite list`、`/invite remove user\ · group ` · 管理访问白名单Manage the access allowlist
- **命令 Command**: `/help` · **作用 Description**: 查看帮助Show help

飞书消息中的图片会下载到本地 media 目录并传给 dsh；文本类文件会读取内容并注入任务上下文。

Images in Feishu messages are downloaded to the local media directory and passed to dsh; text files are read and their content is injected into the task context.

同一 scope（私聊 / 群聊 / 话题）默认允许 **2 个任务并行**（`DSH_LARK_SCOPE_CONCURRENCY` 或
`/concurrency` 调整）：连续发来的多条消息会以独立 run 并行推进，每个 run 使用独立的 dsh
session 与独立 runId，`/status` 展示全部运行中的 run，`/stop` 一次性终止全部任务。

Each scope (DM / group / topic) runs up to **2 tasks in parallel** by default (adjust with
`DSH_LARK_SCOPE_CONCURRENCY` or `/concurrency`): successive messages become independent runs,
each with its own dsh session and run id. `/status` lists every active run and `/stop` interrupts
them all.

**多角色 Agent**：管理员用 `/role save  <name> --persona <文案> [--model ] [--tools
<csv>] [--rules <文案>]` 定义 PM / 开发 / 文档等角色（persona、模型偏好、工具指引、角色规则），
`/role set ` 把角色绑定到当前 scope：下一轮起该 scope 的每个 run 都携带角色 persona 与
规则，并优先使用角色模型（角色模型 < 每会话 `/model use`）。角色定义持久化在
`~/.dsh-lark/profiles//roles.json`。

**Multi-role agents**: admins define roles (PM / dev / docs / …) with `/role save  <name>
--persona <text> [--model ] [--tools <csv>] [--rules <text>]` — persona, model preference,
tool guidance and role rules — then bind one to the current scope with `/role set `. Every
run in that scope carries the role instructions, and the role model wins below the per-session
`/model use` override. Role definitions persist in
`~/.dsh-lark/profiles//roles.json`.

**出站 @ 提及与跨会话通知**：bridge 出站契约支持 `mentions`（@ 提及）与跨 chat/thread 发送；
`/notify <scope|chatId> <text>` 可向其他会话推送汇报（管理员）。agent 侧还内置 `lark_notify`
dsh 工具（SDK / ACP 两种 runtime 均可装配）：agent 完成任务后可主动向其他群 / 话题发消息并
@ 指定成员，桥接进程通过 127.0.0.1 本地回调端口 + 随机 token 校验，不暴露公网。

**Outbound mentions & cross-session notify**: the outbound contract supports `mentions` and
cross-chat/thread sends; `/notify <scope|chatId> <text>` pushes a report to another session
(admin). The agent also gets a built-in `lark_notify` dsh tool (wired into both SDK and ACP
runtime profiles): after a task finishes it can push messages to other groups/topics and @mention
members. The bridge listens on 127.0.0.1 with a random per-boot token — nothing is exposed to the
public network.

**安全网守护（Safe-mode guardian）**：可选安装一个独立于 dsh 进程、系统级常驻的最小守护进程
（Linux systemd user unit / macOS LaunchAgent / Windows 启动项）。dsh 正常运行时守护保持静默；
一旦 dsh 进程下线或无法 boot（例如某个第三方插件破坏了整个 profile 组合），守护自动接管飞书
通道，用户无需接触命令行即可发送控制信号自救：

- `/safemode`：进入**仅核心安全模式**——守护创建 `~/.dsh/profiles/-safe`（仅
  `dsh-base` + `dsh-headless` 两个官方核心 bundle，**不加载任何第三方插件**），后续消息经
  守护转发给该核心 dsh 逐条对话，配合代码执行能力定位 / 修复 / 禁用损坏插件；
- `/safemode plugins`：列出故障 profile 已安装的插件清单（自愈诊断）；
- `/safemode status`：查看守护 / dsh / 安全模式状态；
- `/safemode exit`：退出安全模式，守护重启完整 profile 并把飞书通道交还给正常形态；

全程不需要命令行；dsh 恢复后守护自动断开并回归静默。安装：

```bash
npx dsh-lark-bot@latest setup --profile dsh-lark --guardian
# 或已安装后单独安装：dsh-lark-bot guardian install
```

**Safety-net guardian**: optionally install a minimal system-level resident process that is
independent of the dsh process. While dsh runs, the guardian stays silent; once dsh goes down or
fails to boot (e.g. a third-party plugin breaks the whole profile composition), the guardian
takes over the Feishu channel so you can self-heal without touching the command line:

- `/safemode`: enter **core-only safe mode** — the guardian provisions
  `~/.dsh/profiles/-safe` with only the two official core bundles (`dsh-base` +
  `dsh-headless`, **no third-party plugins**) and proxies a restricted conversation to that core
  dsh so you can locate / fix / disable the offending plugin;
- `/safemode plugins`: list the plugins installed into the broken profile;
- `/safemode status`: show guardian / dsh / safe-mode state;
- `/safemode exit`: leave safe mode — the guardian relaunches the full profile and hands the
  Feishu channel back;

No command line is needed for the whole rescue flow; once dsh is back, the guardian releases the
channel automatically. Install:

```bash
npx dsh-lark-bot@latest setup --profile dsh-lark --guardian
# or later: dsh-lark-bot guardian install
```

### 模型 / Provider / 凭据管理 | Models / Providers / Credentials

模型与 provider 的配置以 dsh 官方方式持久化（与 dsh Web **Settings → Models** 页面完全相同的
存储协议），改动在下一个请求生效，无需重启 bot：

Model and provider configuration is persisted the official dsh way (the exact storage protocol
used by the dsh Web **Settings → Models** page); changes take effect on the next request without
restarting the bot:

- `/model use `：按会话热切换模型，下一轮消息即用新模型。
- `/model default `：写入 dsh 的 `agent-default-model`，作为新会话的默认模型。
- `/providers`：展示 dsh 已配置的 provider、模型与凭据状态（DeepSeek 官方 + 自定义 pi-ai）。
- `/provider add|update|remove`：管理自定义 provider（`llm-pi-ai`）或 `deepseek-official`；
  自定义 provider 需要 `--api`（`openai-completions` / `openai-responses` / `anthropic-messages`）、
  `--base-url` 与至少一个 `--model`，与官方 schema 一致。
- `/key set|remove|list`：读写 `~/.dsh/.credentials.yaml`（0600）。settings 只保存 `apiKeyEnv`
  引用，字面密钥不进入 settings 或聊天记录。

- `/model use `: hot-switch the model for this session; the next message uses it.
- `/model default `: write the dsh `agent-default-model` as the default for new sessions.
- `/providers`: show configured providers, models and credential status (official DeepSeek + custom pi-ai).
- `/provider add|update|remove`: manage custom providers (`llm-pi-ai`) or `deepseek-official`;
  a custom provider needs `--api` (`openai-completions` / `openai-responses` / `anthropic-messages`),
  `--base-url` and at least one `--model`, matching the official schema.
- `/key set|remove|list`: read / write `~/.dsh/.credentials.yaml` (0600). Settings keep only
  `apiKeyEnv` references; literal keys never enter settings or chat history.

安全提醒：在飞书会话里输入密钥会对该会话的可见成员暴露密钥，建议仅在私聊中使用，或优先用
`--api-key-env` 引用已配置的环境变量 / dsh Web 页面录入。bot 不会在任何回复中回显密钥值。

Security note: typing a key in a Feishu conversation exposes it to everyone who can see that
chat; prefer private chats, `--api-key-env` references to existing environment variables, or the
dsh Web UI. The bot never echoes key values in any reply.

## 安装与卸载 | Install & Uninstall

### 安装 | Install

唯一安装方式（标准 dsh profile bundle）：

The only install path (a standard dsh profile bundle):

```bash
npx dsh-lark-bot@latest setup --profile dsh-lark
```

`setup` 自动完成：定位本机 dsh → 预批准 pnpm 构建策略（protobufjs）→ 执行标准
`dsh plugin --profile dsh-lark add dsh-lark-bot`。加 `--guardian` 会同时安装「安全网守护」
（见「安全网守护」一节）。已安装时重复执行即升级到最新版。

`setup` locates your dsh, pre-approves pnpm's build policy (protobufjs) and runs the standard
`dsh plugin --profile dsh-lark add dsh-lark-bot`. Adding `--guardian` also installs the
safety-net guardian (see "Safety-net guardian" above). Re-running it upgrades to the latest version.

### 升级 | Upgrade

- 插件本体：重跑 `setup`（或 `dsh plugin --profile <name> add dsh-lark-bot`）拉取 npm 最新版。
- CLI 工具（可选）：`npm i -g dsh-lark-bot@latest`；使用 `npx` 时无需全局安装。
- 升级后重启 profile：`dsh --profile dsh-lark`。

- Plugin: re-run `setup` (or `dsh plugin --profile <name> add dsh-lark-bot`) to pull the latest
  npm release.
- CLI tool (optional): `npm i -g dsh-lark-bot@latest`; not needed when using `npx`.
- Restart the profile after upgrading: `dsh --profile dsh-lark`.

### 禁用 | Disable

保持插件加载但停止桥接引擎：启动 profile 前导出 `DSH_LARK_DISABLED=1`。彻底移除见下节。

Keep the plugin loaded but stop the bridge engine: export `DSH_LARK_DISABLED=1` before booting
the profile. For full removal see the next subsection.

### 卸载 | Uninstall

```bash
dsh plugin --profile dsh-lark remove dsh-lark-bot
```

卸载后 profile 不再加载本插件。本地状态（配置 / 会话 / 归档 / 角色）保留在 `~/.dsh-lark`；
如需清除，先备份再删除该目录。

Removal unloads the plugin from the profile. Local state (config / sessions / archives / roles)
stays in `~/.dsh-lark`; back it up before deleting it.

更详细的安装、状态目录、日志和排障说明见 [`docs/QUICK_START.md`](docs/QUICK_START.md)。

See [`docs/QUICK_START.md`](docs/QUICK_START.md) for installation details, state directories,
logs and troubleshooting.

## 关键词 | Keywords

`dsh` · `deepseek` · `deepseek harness` · `feishu` · `lark` · `bridge` · `bot`

## 这是什么 | What it is

**dsh-lark-bot** 是一个轻量桥接工具，把本机的 DeepSeek Harness（`dsh`）接入飞书 / Lark，复刻当年 OpenCode Telegram Bot / MiMoCode Telegram Bot 的体验——在 IM 里与 coding agent 对话、收流式卡片、审阅 diff，并在此基础上叠加**完整的项目工作区管理**。

**dsh-lark-bot** is a lightweight bridge that connects your local DeepSeek Harness (`dsh`) into Feishu / Lark, recreating the beloved OpenCode / MiMoCode Telegram-bot experience — chat with your coding agent, receive streaming cards, review diffs — and adds **full project workspace management** on top.

**适合谁 / Who it is for**：在飞书 / Lark（私聊、群聊、话题）里指挥本机 dsh coding agent 的
开发者与团队，尤其是需要多项目隔离、角色分工、并行任务与会话归档的协作场景。

Developers and teams who drive a local dsh coding agent from Feishu / Lark (DMs, groups,
topics) — especially those needing multi-project isolation, role-based collaboration, parallel
tasks and session archival.

## 目标 | Goals

- **一条命令安装部署**：`npx dsh-lark-bot@latest setup --profile dsh-lark` 装进 dsh profile，
  随后 `dsh --profile dsh-lark` 启动并扫码，桥接引擎作为标准插件在 dsh 进程内运行。
- **飞书原生体验**：流式卡片、交互按钮、图片 / 文件，全程双语（文档评论为规划中能力）。
- **完整工作区管理**：多项目隔离、git worktree、项目级规则注入、上下文持久化。

- **One-command install & deploy**: `npx dsh-lark-bot@latest setup --profile dsh-lark`, then
  `dsh --profile dsh-lark` and scan once — the bridge engine runs as a standard plugin inside
  the dsh process.
- **Native Feishu experience**: streaming cards, interactive buttons, images / files, doc comments.
- **Full workspace management**: multi-project isolation, git worktrees, per-project rules, persistent context.

## 兼容性 | Compatibility

- **DeepSeek Harness（`dsh`）**：已验证 **dsh 0.1.0-rc.6**（最后验证 2026-08-15：SDK JSON-RPC / ACP runtime 握手 +
  真实任务流式验证），通过官方 `@deepseek-ai/dsh-sdk-client` / `@deepseek-ai/dsh-acp` 接入；
  具体锁定版本、升级政策与自动化探测见 [`docs/COMPATIBILITY.md`](docs/COMPATIBILITY.md)，
  adapter 接入细节见 [`docs/adapter-notes.md`](docs/adapter-notes.md)。
- **运行时**：Node.js ≥ 22.19（见 `package.json` engines）。
- **平台**：Linux / macOS / Windows（飞书 WebSocket 出站长连接，免公网服务器 / 域名 / 内网穿透）。
- 默认 adapter 为官方 **`@deepseek-ai/dsh-sdk-client`**（SDK JSON-RPC runtime，原生 session 续跑 +
  token 级流式事件）；`DSH_LARK_ADAPTER=acp` 切到官方 **ACP server**（审批卡）；`headless` 保留旧版
  子进程 fallback。首次启动自动在 `~/.dsh/pr