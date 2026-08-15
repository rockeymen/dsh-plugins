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

### 能力·描述
- **功能**： 🎯 **一键认证** · **描述**：`/lark setup` 扫描二维码创建飞书（自动订阅消息事件+群聊+反应）。 30 秒上手，无需摆弄开放平台
- **功能**：🧠 **多模式代理** · **描述**：PTC / 标准 / 最小 / 创建者预设； `/mode` 显示一张**单选卡** — 点击切换（默认 PTC：标准工具 + 代码模式，一次性多步执行）
- **功能**：🎛 **权限级别** · **描述**：只读/工作区写入/**完全访问权限**； `/permission`卡即时切换（默认完全访问）
- **功能**：🎨 **基于卡片的命令** · **描述**：`/mode` `/permission` `/model` 都是 **单选按钮卡片** — 点击，无需打字；按提供商分组的模型
- **功能**：💬 **意图确认** · **描述**：模型问题（`ask_user_question`）落地为**飞书意图确认卡**（选项按钮+自定义文本）；应答并且代理恢复
- **能力**：😊 **反应收据** · **描述**：入站时随机“明白”反应； **完成 ✅** 完成后（仅限飞书验证的表情符号）
- **功能**： 💪 **零消息丢失** · **描述**：持久发件箱（JSONL + 至少一次 + 幂等性 + 每通道并行 + 故障隔离），在终止/重启后恢复
- **功能**： 🛡 **自愈连接** · **描述**：探针驱动控制重连 + QuotaGovernor 断路器 + 漏报补偿；自动避免代理环境
- **功能**：🔀 **3层命令路由** · **描述**：桥接命令→桥接； DSH 命令→本机； `/goal`，未知 `/xxx`，纯文本 → 逐字注入（无门）。 **技能不需要前缀** - 只需描述任务
- **功能**：📎 **入站媒体** · **描述**：飞书图像→ **视觉模型**（附件支持）；文件 → 有界文本提取
- **功能**：📤 **出站媒体** · **描述**：模型通过 `lark_send_local_file` 发送本地文件/图像（工作区白名单 + 大小/格式检查）
- **功能**：🩺 **一键诊断** · **描述**：`/doctor` → **ZIP 捆绑包**（完整的 DSH 会话日志 + 已清理的配置 + ISSUE.md）返回聊天
- **功能**：✍️ **Markdown 渲染** · **描述**：回复自动渲染为 CardKit 卡片（标题/列表/代码/表格）；纯文本保持简单
- **功能**： 🆕 **会话管理** · **描述**：`/new` 在当前工作空间中打开一个新的会话； `/workspace `开关（与`~`配合）；会话 ID 在重新启动后仍然存在
- **功能**：🖥 **重用 DSH Web GUI** · **描述**：桥接代理是本机 DSH 会话；对话会自动分组到他们的工作区下
- **功能**：🔓 **默认完全访问

lt** · **描述**：沙箱完全访问权限 + 永不要求批准

## 🚀 快速入门

```bash
dsh plugin --profile web add dsh-lark-link --ignore-scripts
dsh web
/lark setup          # scan QR (30s)
/lark start
```

打开飞书，找到你的机器人，发送任何内容——反应回执+完整回复=端到端。 **群聊不需要@-提及。**

## ⌨️命令（飞书端）

- **选择器**（单选卡）：`/mode` `/permission` `/model`
- **状态**：`/status` `/sessions` `/help`
- **会话**：`/new` `/stop` `/workspace `
- **诊断**：`/doctor`（带有会话日志的 ZIP）
- **热重载**：`/lark-config key=value`
- **DSH 命令** 本机运行：`/goal` `/compact` …
- **媒体**：将图像/文件发送到机器人
- **意向确认**作为卡片自动到达

## 🛠 发展

```bash
npm run dev:link && npm run check && npm test && npm run build
```

## 📄 许可证

MIT — 免费使用、修改和分发。