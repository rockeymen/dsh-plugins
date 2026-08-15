![dsh-lark-link mascot](assets/mascot.png)

# 🪶 dsh-lark-link

  DeepSeek Harness × 飞书/Lark 双向桥接 — 把你的 DSH 智能体装进飞书，扫码 30 秒上线，随时随地对话

# 中文

> 全网统一昵称：**小斯syzs** · B站 [@小斯syzs](https://space.bilibili.com/390211071) · 抖音 · 小红书 · 快手（全网同名）

**DeepSeek Harness × 飞书/Lark 双向桥接插件** —— 把你的 DSH 智能体（DeepSeek Harness）装进飞书：扫码 30 秒上线、消息零丢失、卡片化交互、每飞书会话独立 Agent。

## ✨ 特性

### 能力 · 说明
- **能力**: 🎯 **一键认证** · **说明**: `/lark setup` 扫码创建飞书应用（自动订阅消息事件 + 群聊全量 + 表情权限），**30 秒上线**，无需手搓开放平台
- **能力**: 🧠 **多模式 Agent** · **说明**: PTC / 标准 / 极简 / 创造四种 preset，飞书发 `/mode` 出**单选卡片**即切（默认 PTC：标准工具 + Code Mode 一次执行，更快更省）
- **能力**: 🎛 **权限分级** · **说明**: 只读 / 工作区写 / **Full access** 三种权限，`/permission` 卡片即切；默认 Full access 全放行
- **能力**: 🎨 **卡片化命令** · **说明**: `/mode` `/permission` `/model` 全部是**单选按钮卡片**——点一下即切换，不用记命令拼写；模型选择按供应商分组展示
- **能力**: 💬 **意图确认转发** · **说明**: 模型提问（`ask_user_question`）→ **飞书意图确认卡片**（选项按钮 + 自定义输入），答完模型继续，飞书里完成完整交互闭环
- **能力**: 😊 **表情回执** · **说明**: 收到消息随机表情"已收到"；回复完成 / 命令完成打 **DONE ✅**（只使用飞书实测有效 emoji）
- **能力**: 💪 **消息零丢失** · **说明**: 持久 Outbox（JSONL + at-least-once + 幂等键 + 分航道并行 + 失败离队不阻塞），kill 重启自动续投
- **能力**: 🛡 **连接自愈** · **说明**: probe 驱动受控重连 + QuotaGovernor 配额熔断 + 断连补偿；环境代理自动规避
- **能力**: 🔀 **命令三级分流** · **说明**: 桥特有命令桥处理；DSH 注册命令原生执行；`/goal`、未知 `/xxx`、普通消息原样注入 Agent（无拦截无门禁）；**skill 无前缀**——直接描述任务，模型自动加载
- **能力**: 📎 **入站多媒体** · **说明**: 飞书图片 → **视觉模型看图**（attachment 存储）；文件 → 有界文本提取进提示词
- **能力**: 📤 **出站多媒体** · **说明**: 模型经 `lark_send_local_file` 主动回传本地图片/文件（工作区白名单 + 大小校验 + 格式自动降级）
- **能力**: 🩺 **一键诊断** · **说明**: `/doctor` → **ZIP 诊断包**（含当前会话完整 DSH session log + 脱敏配置 + ISSUE.md），发回飞书，贴给 AI 即可定位
- **能力**: ✍️ **Markdown 渲染** · **说明**: 回复自动检测 markdown → **CardKit 卡片**渲染（标题/列表/代码块/表格），纯文本走文本消息
- **能力**: 🆕 **会话管理** · **说明**: `/new` 当前工作区新起会话（不进 Agent）；`/workspace <路径>` 切换工作区（`~` 展开）；重启后会话 id 持久化，**不丢会话行**
- **能力**: 🖥 **复用 DSH Web GUI** · **说明**: 桥 Agent = 原生 DSH session，聊天/流式/工具卡/设置全由 GUI 呈现；会话自动归入对应工作区（不再"未分组"）
- **能力**: 🔓 **默认 Full access** · **说明**: 沙箱全访问 + 审批 never，零打扰

## 🚀 快速开始

**标准方式（官方 `dsh plugin` 机制，无侵入）**——包以官方 bundle 格式分发（`package.json` 的 `dsh.bundle` + `cordis.patch.yml`），安装后自动并入 profile 的 `dsh.profile.bundles` 层：

```bash
# 1. 安装插件（npm 官方包，装预构建产物，无需构建许可）：
dsh plugin --profile web add dsh-lark-link --ignore-scripts

#   或本地 tarball（先用 npm pack 生成，离线/内网友好）：
#   npm pack
#   dsh plugin --profile web add ./dsh-lark-link-0.2.0.tgz --ignore-scripts
#   或 GitHub 源码（需 prepare 构建 + allowBuilds 许可）：
#   dsh plugin --profile web add github:amlyczz/dsh-lark-link
```

> `--ignore-scripts`：飞书 SDK 的传递依赖 protobufjs 带一个可忽略的 postinstall，pnpm 11 安全策略会拦截并返回非零退出码；加此参数跳过（protobufjs 不执行 postinstall 完全可用）。若你的 pnpm 已全局放行，可不加。
>
> `--profile web`：指定安装到哪个 profile（web / tui / headless）。`dsh plugin` 是 pnpm 的转发命令，用法为 `dsh plugin --profile <name> `。

```bash
# 2. 启动 DSH Web GUI
dsh web

# 3. 在 GUI 的输入框（或终端 CLI）执行：
/lark setup       # 扫码创建飞书应用（30 秒，面板显示二维码）
/lark start       # 启动桥接
```

然后**飞书搜索你的机器人，发任意消息**——收到表情回执 + 完整回复即端到端连通。群聊**免 @**，直接说话即可。

## ⌨️ 命令

### DSH 侧（GUI 或终端）

```
/lark setup            扫码一键建应用（或 DSH_LARK_APP_ID/SECRET 手动通道）
/lark start|stop|restart|status   桥接生命周期与全链路健康
/lark uninstall-clean  清除凭据与状态目录
```

### 飞书侧（卡片化单选，无需记忆拼写）

### 类别 · 命令 · 行为
- **类别**: 选择类 · **命令**: `/mode` `/permission` `/model` · **行为**: **单选按钮卡片**，点选即切换
- **类别**: 状态类 · **命令**: `/status` `/sessions` `/help` · **行为**: 全链路健康 / 会话列表 / 帮助卡片
- **类别**: 会话类 · **命令**: `/new` `/stop` `/workspace <路径>` · **行为**: 新会话 / 停当前任务 / 切工作区
- **类别**: 诊断 · **命令**: `/doctor` · **行为**: ZIP 诊断包（session log + 配置 + ISSUE.md）
- **类别**: 热改 · **命令**: `/lark-config key=value` · **行为**: 热改配置（如 `groupPolicy=open`、`agentPreset=code`）
- **类别**: DSH 命令 · **命令**: `/goal` `/compact` 等 · **行为**: 原生执行，结果回飞书
- **类别**: 多媒体 · **命令**: 发图片/文件 · **行为**: 图片→视觉模型；文件→文本提取
- **类别**: 意图确认 · **命令**: 模型提问 · **行为**: 自动转**飞书意图确认卡片**，选项或输入作答

> 命令无拦截、无门禁：一切 `/` 消息要么桥处理，要么原样交 DSH——绝不停默丢弃。skill 无前缀，直接说任务即可。

## 🛠 开发者

```bash
npm run dev:link   # 链接本地 DSH checkout（类型检查/测试需要）
npm run check      # tsc --noEmit
npm test           # 122 项单元 + 集成测试
npm run build      # tsdown → dist/（宿主 ESM + client bundle）
npm pack           # 产出可分发 tarball
```

**架构**：桥 = Cordis 插件（`dsh.bundle` 格式），分层清晰：
`host`（SDK 适配/认证）→ `inbound`（传输/群触发/断连补偿）→ `application`（命令路由/消息编排/诊断）→ `outbound`（Outbox/事件转发/卡片）→ `sessions`（每会话 Agent 管理）。

## 📄 许可

MIT — 自由使用、修改、分发。

# English

  ![dsh-lark-link mascot](assets/mascot.png)

**DeepSeek Harness × Feishu/Lark bridge** — put your DSH agent inside Feishu. Scan a QR code and go live in 30 seconds; chat from anywhere.

## ✨ Features

### Capability · Description
- **Capability**: 🎯 **One-click auth** · **Description**: `/lark setup` scans a QR to create the Feishu app (auto-subscribes message events + group-all + reactions). 30-second onboarding, no Open Platform fiddling
- **Capability**: 🧠 **Multi-mode Agent** · **Description**: PTC / Standard / Minimal / Creator presets; `/mode` shows a **single-select card** — tap to switch (default PTC: standard tools + Code Mode, one-shot multi-step execution)
- **Capability**: 🎛 **Permission tiers** · **Description**: Read-only / workspace-write / **Full access**; `/permission` card switches instantly (Full access by default)
- **Capability**: 🎨 **Card-based commands** · **Description**: `/mode` `/permission` `/model` are all **single-select button cards** — tap, no typing; models grouped by provider
- **Capability**: 💬 **Intent confirmation** · **Description**: Model questions (`ask_user_question`) land as **Feishu intent-confirmation cards** (option buttons + custom text); answer and the agent resumes
- **Capability**: 😊 **Reaction receipts** · **Description**: Random "got it" reaction on inbound; **DONE ✅** on completion (only Feishu-validated emojis)
- **Capability**: 💪 **Zero message loss** · **Description**: Persistent Outbox (JSONL + at-least-once + idempotency + per-lane parallel + failure quarantine), resumes after kill/restart
- **Capability**: 🛡 **Self-healing connection** · **Description**: Probe-driven controlled reconnect + QuotaGovernor circuit breaker + missed-message compensation; auto-avoids proxy env
- **Capability**: 🔀 **3-tier command routing** · **Description**: Bridge commands → bridge; DSH commands → native; `/goal`, unknown `/xxx`, plain text → injected verbatim (no gates). **Skills need no prefix** — just describe the task
- **Capability**: 📎 **Inbound media** · **Description**: Feishu images → **visual model** (attachment-backed); files → bounded text extraction
- **Capability**: 📤 **Outbound media** · **Description**: Model sends local files/images via `lark_send_local_file` (workspace whitelist + size/format checks)
- **Capability**: 🩺 **One-click diagnostics** · **Description**: `/doctor` → **ZIP bundle** (full DSH session log + sanitized config + ISSUE.md) back to the chat
- **Capability**: ✍️ **Markdown rendering** · **Description**: Replies auto-render as CardKit cards (headings/lists/code/tables); plain text stays plain
- **Capability**: 🆕 **Session management** · **Description**: `/new` opens a fresh session in the current workspace; `/workspace ` switches (with `~`); session ids persist across restarts
- **Capability**: 🖥 **Reuses DSH Web GUI** · **Description**: Bridge agents are native DSH sessions; conversations auto-group under their workspace
- **Capability**: 🔓 **Full access by default** · **Description**: Sandbox full access + never-ask approvals

## 🚀 Quickstart

```bash
dsh plugin --profile web add dsh-lark-link --ignore-scripts
dsh web
/lark setup          # scan QR (30s)
/lark start
```

Open Feishu, find your bot, send anything — reaction receipt + full reply = end-to-end. **Group chats need no @-mention.**

## ⌨️ Commands (Feishu side)

- **Selectors** (single-select cards): `/mode` `/permission` `/model`
- **Status**: `/status` `/sessions` `/help`
- **Sessions**: `/new` `/stop` `/workspace `
- **Diagnostics**: `/doctor` (ZIP with session log)
- **Hot reload**: `/lark-config key=value`
- **DSH commands** run natively: `/goal` `/compact` …
- **Media**: send images/files to the bot
- **Intent confirmations** auto-arrive as cards

## 🛠 Development

```bash
npm run dev:link && npm run check && npm test && npm run build
```

## 📄 License

MIT — free to use, modify, and distribute.