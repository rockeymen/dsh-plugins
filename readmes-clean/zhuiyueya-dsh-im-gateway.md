# 🐋 dsh-im-gateway

### 把 DeepSeek Harness 接入你常用的每一个聊天软件
Aggregated IM gateway for DeepSeek Harness (dsh) — drive your coding agents from WeChat, Feishu, Telegram, Discord, QQ and 20+ chat platforms, with unified sessions, remote approvals and one-command setup.

## ⚡ 一键安装：把提示词发给你的 dsh 即可

> 任选一种方式，把下面整段提示词发给你的 dsh（Web GUI 聊天框 / `dsh --profile headless "…"` / 已接入的 IM 聊天），agent 会**自动完成下载、构建、安装**——不用手动敲命令。

方式 A · GitHub 克隆安装（最稳妥，推荐）

```text
请帮我安装 dsh-im-gateway 插件（DeepSeek Harness 的聚合 IM 网关）：
1. 执行 git clone --depth 1 https://github.com/zhuiyueya/dsh-im-gateway.git /tmp/dsh-im-gateway
2. 执行 cd /tmp/dsh-im-gateway && npm install && npm run build
3. 执行 dsh plugin --profile web add /tmp/dsh-im-gateway
4. 汇报结果；如果提示需要重启，提醒我重启 dsh web。
```

方式 B · 远程仓库直装（无需 clone，已实测可用）

```text
请安装 dsh-im-gateway 插件：dsh plugin --profile web add https://github.com/zhuiyueya/dsh-im-gateway.git
装完提醒我重启 dsh web（首次安装依赖约 1-2 分钟）。
```

方式 C · 本机已有项目目录

```text
请把本机项目 dsh-im-gateway 安装为 dsh 插件：
1. 进入项目目录执行 npm install && npm run build
2. 执行 dsh plugin --profile web add <项目绝对路径>
3. 提醒我重启 dsh web。
```

装好后：**打开 dsh Web GUI → 设置 ⚙️ → 🐋 IM 网关 → 点选渠道连接**（微信/WhatsApp 扫码即连，其余填凭据即可）。

## ✨ Highlights

- 🌐 **24+ 渠道全覆盖** — 对齐 OpenClaw 的渠道面：微信、飞书、Telegram、Discord、Slack、QQ、WhatsApp、Signal、Teams、LINE、Matrix、Mattermost、IRC、Twitch、Nostr、Zalo、iMessage、内置 WebChat 网页……
- 🔁 **每聊天一个 agent 会话** — 群里聊天 = 驱动 agent，回复实时回推；`/new` 换新会话，`/bind` 绑定现有会话
- ✅ **远程审批桥** — agent 请求工具批准时推送到 IM，聊天里回一句「批准 / 拒绝」即可，超时自动转回本机批准体系
- 📱 **手机多段输入合并** — `..` 表示还有后续，`!!` 立即提交，裸文本 5 秒合并窗口，崩溃后自动恢复
- ✂️ **长回复智能分片** — 按各渠道上限切分，优先在换行/句号断行，带 `（i/n）` 序号且收敛
- 🛡️ **白名单安全默认** — 默认拒绝一切未知用户；审批应答强制校验会话归属
- 🔑 **扫码登录 + 免扫码恢复** — 微信 / WhatsApp 扫码登录链接自动落盘；登录态（bot_token + 轮询游标）持久化，**重启自动恢复连接，无需重复扫码**
- 🖼️ **媒体收发** — 微信渠道完整支持图片/语音（服务端转文字）/文件/视频（CDN AES-128-ECB 加密），agent 可用 `im_send_file` 工具把工作区文件发给聊天
- 📦 **一条命令安装 + 可视化连接** — 标准 `dsh.bundle` 插件；Web GUI 设置面板点选渠道、扫码/填凭据即连，无需重启
- 🎯 **小白友好** — 微信/WhatsApp 点一下直接弹二维码；其余渠道表单引导，状态实时显示

## 🏗 Architecture

```
   IM 渠道 (Telegram / 微信 / 飞书 / Discord / …)              DSH agent
        │  adapter 归一化入站                                    ▲
        ▼                                                       │
┌─────────────────────────┐      ┌────────────────────────┐    │
│  ChannelAdapter          │◄────►│  ImGateway (核心网关)    │────┘
│  · 每渠道一个适配器       │      │  · 会话路由 (per-chat)   │
│  · 收: 轮询/WebSocket/   │      │  · 白名单 & IM 命令      │
│     webhook → ImMessage  │      │  · 审批桥 (approval/    │
│  · 发: send(chatId,text) │      │    request waterfall)   │
└─────────────────────────┘      │  · 分片 / 合并 / 格式化   │
        ▲                        └────────────────────────┘
        │  session/event · assistant/message · turn/end
        └────────────────────────────────────────────────────
```

```
用户消息 → 渠道 adapter → 网关(白名单→合并→会话路由) → agent.followup()
agent 回复 ← 网关(按渠道分片) ← session/event(assistant/message) ← agent
工具批准 → approval/request → 推送到聊天 → 「批准」→ allowed-once
```

## 📡 Supported Channels

### 渠道 · 状态 · 接收方式 · 需要
- **渠道**: **WebChat**（内置网页） · **状态**: ✅ 完整 · **接收方式**: 本地 HTTP + SSE · **需要**: 无（零账号！）
- **渠道**: **Telegram** · **状态**: ✅ 完整 · **接收方式**: Bot API 长轮询 · **需要**: @BotFather token
- **渠道**: **Discord** · **状态**: ✅ 完整 · **接收方式**: Gateway WebSocket · **需要**: Bot token
- **渠道**: **Slack** · **状态**: ✅ 完整 · **接收方式**: Socket Mode · **需要**: xoxb- + xapp- token
- **渠道**: **飞书 / Lark** · **状态**: ✅ 完整 · **接收方式**: 官方 SDK 长连接 · **需要**: App ID + Secret
- **渠道**: **微信** · **状态**: ✅ 完整* · **接收方式**: iLink 扫码登录（官方协议） · **需要**: 专用小号 ⚠️
- **渠道**: **QQ 机器人** · **状态**: ✅ 完整 · **接收方式**: 官方 WebSocket · **需要**: AppID + Secret
- **渠道**: **LINE** · **状态**: ✅ 完整 · **接收方式**: REST + webhook · **需要**: Channel token
- **渠道**: **Matrix** · **状态**: ✅ 完整 · **接收方式**: 客户端同步 · **需要**: Homeserver + token
- **渠道**: **Mattermost** · **状态**: ✅ 完整 · **接收方式**: WebSocket + REST · **需要**: Server URL + token
- **渠道**: **IRC** · **状态**: ✅ 完整 · **接收方式**: 原生 socket · **需要**: 服务器地址
- **渠道**: **Twitch** · **状态**: ✅ 完整 · **接收方式**: WebSocket IRC · **需要**: OAuth token
- **渠道**: **Signal** · **状态**: ✅ 完整 · **接收方式**: signal-cli 子进程 · **需要**: 本机 signal-cli
- **渠道**: **Nextcloud Talk** · **状态**: ✅ 完整 · **接收方式**: REST 轮询 · **需要**: 实例账号
- **渠道**: **Synology Chat** · **状态**: ✅ 完整 · **接收方式**: webhook · **需要**: Incoming webhook
- **渠道**: **Zalo** · **状态**: ✅ 完整 · **接收方式**: REST + webhook · **需要**: OA token
- **渠道**: **iMessage** · **状态**: ✅ 完整* · **接收方式**: imsg / osascript · **需要**: macOS
- **渠道**: **WhatsApp** · **状态**: 🔄 动态依赖 · **接收方式**: Baileys 扫码 · **需要**: `npm i @whiskeysockets/baileys`
- **渠道**: **Nostr** · **状态**: 🔄 动态依赖 · **接收方式**: NIP-04 私信 · **需要**: `npm i @noble/curves`
- **渠道**: **Teams** · **状态**: 🧪 实验性 · **接收方式**: Bot Framework · **需要**: Azure 注册
- **渠道**: **Google Chat** · **状态**: 🧪 实验性 · **接收方式**: webhook · **需要**: 公网地址
- **渠道**: **Tlon / 元宝 / 语音** · **状态**: 🧪 骨架 · **接收方式**: — · **需要**: 基础设施

✅ 完整 = 收发可用 ｜ 🔄 动态依赖 = 未装 SDK 时提示安装 ｜ 🧪 实验性 = 需公网/专用基础设施 ｜ \*微信 = 官方 iLink 协议（媒体收发 + 语音转文字 + typing）

## 🚀 Quick Start

### 1. 安装（一次）

```bash
cd dsh-im-gateway
npm install && npm run build

dsh plugin --profile web add /path/to/dsh-im-gateway
dsh web    # 重启 dsh（安装插件后需要重启一次）
```

### 2. 连接渠道（之后所有操作都在网页里，无需再碰配置）

打开 dsh Web GUI（默认 http://localhost:3080）→ **设置 ⚙️ → 「🐋 IM 网关」**：

- **微信 / WhatsApp**：点「连接（扫码）」→ 页面直接弹出**二维码**，手机扫码确认即连 ✅
- **飞书 / Telegram / QQ 机器人 / Discord / Slack …**：点「填写凭据」→ 按提示粘贴 token → 「保存并连接」✅
- **WebChat 网页**：点「一键开启」→ 浏览器打开给出的地址，直接和 agent 对话 ✅

连接后无需重启，状态实时显示（等待扫码 / 已连接 / 异常）。**重启 dsh 后所有已配置渠道自动重连**（微信登录态已持久化，无需重复扫码）。

> 🔧 **断开 vs 删除配置**：已连接渠道卡片上有两个按钮——「断开」只是临时停用（重启自动恢复）；「删除配置」会移除凭据（重启不再连接，需重新配置）。

> 💡 手动配置方式（可选）：在 `~/.dsh/profiles/web/cordis.patch.yml` 写配置，凭据也可用环境变量，见下文「Configuration」。

### 3. 开始使用

在连接好的聊天软件里给机器人发消息：

```
/help        ← 可用命令
你好，帮我看看当前工作区    ← 直接聊天 = 驱动 agent
```

> 🔔 **首次使用需要授权**（安全默认）：第一次发消息会收到"未授权"提示，同时 dsh 设置 → IM 网关 面板顶部出现 **「有用户请求访问」** 横幅——点「允许」后即可正常使用，无需手动找用户 ID。

agent 回复实时回推；需要批准时在聊天里回「批准 / 拒绝」；agent 还可以用 `im_send_file` 把文件（截图/报告）直接发到聊天。

## 💬 IM Commands

### 命令 · 说明
- **命令**: `/help` · **说明**: 帮助
- **命令**: `/status` · **说明**: 当前会话 / 待批准数
- **命令**: `/new` · `/clear` · **说明**: 开启全新会话（per-chat 模式）
- **命令**: `/bind <session-id>` · **说明**: 绑定已有 DSH 会话（bound 模式）
- **命令**: `/unbind` · **说明**: 解绑
- **命令**: `/channels` · **说明**: 各渠道连接状态
- **命令**: `批准` / `拒绝` · **说明**: 应答待批准请求（也支持 yes / no / 同意）
- **命令**: 普通文本 · **说明**: 发给 agent；结尾 `..` 表示还有后续，`!!` 立即提交

## ⚙️ Configuration

所有配置写在 profile 的 `cordis.patch.yml` 的 `im-gateway` 行；凭据也可用环境变量（见下表）。

### 通用配置

```yaml
- id: im-gateway
  config:
    sessionMode: per-chat          # per-chat（默认）| bound
    cwd: /path/to/workspace        # agent 工作目录
    provider: deepseek-official    # LLM provider（默认跟随 dsh）
    model: deepseek-v4-flash       # 模型（默认跟随 dsh）
    allowAllUsers: true            # 默认放行所有用户（开箱即用）；管控时改 false
    allowedUserIds:                # 白名单：按渠道（allowAllUsers=false 时生效）
      telegram: ['123456789']
      '*': ['u-common']            # 跨渠道通用
    mergeTimeoutSecs: 5            # 手机多段输入合并窗口
    approvalTimeoutSecs: 120       # 审批超时，超时转回本机批准
    summaryOnTurnEnd: true         # 每轮结束推送 [✅ 完成] 摘要
    stateDir: ''                   # 状态目录（默认 $DSH_HOME/dsh-im-gateway）
```

### 渠道凭据速查

### 渠道 · 配置字段 · 环境变量
- **渠道**: telegram · **配置字段**: `token` · **环境变量**: `DSH_TELEGRAM_TOKEN`
- **渠道**: discord · **配置字段**: `token` · **环境变量**: `DSH_DISCORD_TOKEN`
- **渠道**: slack · **配置字段**: `token` + `appToken` · **环境变量**: `DSH_SLACK_TOKEN` / `DSH_SLACK_APP_TOKEN`
- **渠道**: feishu · **配置字段**: `appId` + `appSecret` · **环境变量**: `DSH_FEISHU_APP_ID` / `DSH_FEISHU_APP_SECRET`
- **渠道**: qqbot · **配置字段**: `appId` + `appSecret` · **环境变量**: `DSH_QQ_APP_ID` / `DSH_QQ_APP_SECRET`
- **渠道**: signal · **配置字段**: `cli` + `phone` · **环境变量**: `DSH_SIGNAL_CLI` / `DSH_SIGNAL_PHONE`
- **渠道**: line · **配置字段**: `channelToken` + `channelSecret` · **环境变量**: `DSH_LINE_TOKEN` / `DSH_LINE_SECRET`
- **渠道**: matrix · **配置字段**: `homeserver` + `accessToken` · **环境变量**: `DSH_MATRIX_HOMESERVER` / `DSH_MATRIX_ACCESS_TOKEN`
- **渠道**: mattermost · **配置字段**: `serverUrl` + `token` · **环境变量**: `DSH_MATTERMOST_URL` / `DSH_MATTERMOST_TOKEN`
- **渠道**: irc · **配置字段**: `server` + `nick` + `channels` · **环境变量**: `DSH_IRC_SERVER`
- **渠道**: twitch · **配置字段**: `botName` + `token` · **环境变量**: `DSH_TWITCH_BOT_NAME` / `DSH_TWITCH_TOKEN`
- **渠道**: nostr · **配置字段**: `privateKey` + `relays` · **环境变量**: `DSH_NOSTR_PRIVATE_KEY` / `DSH_NOSTR_RELAYS`
- **渠道**: nextcloud · **配置字段**: `serverUrl` + `user` + `password` · **环境变量**: `DSH_NEXTCLOUD_URL` 等
- **渠道**: synology · **配置字段**: `webhookUrl` · **环境变量**: `DSH_SYNOLOGY_WEBHOOK_URL`
- **渠道**: zalo · **配置字段**: `accessToken` · **环境变量**: `DSH_ZALO_TOKEN`
- **渠道**: imessage · **配置字段**: `enabled` + `imsgPath` · **环境变量**: `DSH_IMSG_PATH`
- **渠道**: wechat · **配置字段**: `enabled: true` · **环境变量**: — （iLink 扫码）
- **渠道**: whatsapp · **配置字段**: `enabled: true` · **环境变量**: — （Baileys 扫码）
- **渠道**: webchat · **配置字段**: `enabled: true` + `port` · **环境变量**: —

## 🔐 Security

- **微信为腾讯官方 iLink Bot 协议**（与 OpenClaw 官方插件 `@tencent-weixin/openclaw-weixin` 同协议，2026 年官方开放）：仅私聊、一个账号一个 poller，建议使用**专用小号**；使用即表示同意《微信ClawBot功能使用条款》
- **白名单默认拒绝一切未知用户**；审批应答强制校验会话归属（pending approval id 一一对应）
- 实验性/骨架渠道（Teams、Google Chat、Tlon、元宝、语音）启用前请阅读源码
- 第三方插件即第三方代码——安装前请审阅源码，建议先在隔离环境试用

## 🧪 Development

```bash
npm install
npm run build          # tsc 构建到 lib/
npm test               # node --test（31 个用例：分片/合并/审批/网关）
```

**新增一个渠道只需 4 步**：

1. 在 `src/channels/` 新建 `yourchannel.ts`，实现 `ChannelAdapter`（6 个方法）
2. 在 `src/channels/index.ts` 注册
3. 在 `src/index.ts` 的 Config 里补配置字段
4. 在 README 渠道表加一行 ✨

```typescript
export function createYourChannel(config, log): ChannelAdapter | undefined {
  if (!config.token) return undefined          // 未配置凭据 → 不启动
  return {
    id: 'yourchannel', label: 'YourChannel', maxMessageLength: 2000,
    start() { /* 连接 / 轮询 / 扫码 */ },
    stop() { /* 释放 */ },
    async send(chatId, text) { /* 发消息 */ },
    setMessageHandler(h) { /* 入站回调 */ },
    status() { return 'running' },
  }
}
```

## 🤝 Contributing

- 修 bug、补渠道、完善文档都欢迎！
- 请先 `npm test` 保证 31 个用例全绿
- 给仓库加 `dsh-plugin` 和 `deepseek-harness` topic 可以进 awesome 插件列表

## 📄 License

[MIT](./LICENSE) © zhuiyueya

Made with 🐋 for the DeepSeek Harness ecosystem