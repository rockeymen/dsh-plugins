# @tencent-connect/dsh-qqbot

基于 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) 的 QQ Bot IM 插件，将 QQ 消息平台作为 dsh agent 的前端协议驱动。

中文 | [English](./README_EN.md)

## 架构

```
QQ 用户 → QQ WebSocket → dsh-im-qqbot → ctx.agents → dsh agent loop → LLM
                                 ↑                           │
                                 └── session/event ──────────┘
                                       (assistant reply → QQ sendMarkdown)
```

## 安装

### 方式一：手动执行

```bash
# 安装到 profile
dsh plugin --profile qqbot add @tencent-connect/dsh-qqbot

# 启动
dsh --profile qqbot
```

首次启动时，插件检测到凭据未配置会自动进入扫码引导：终端输出二维码 → 手机 QQ 扫码绑定 → 凭据自动保存到 profile，后续启动无需再次扫码。

### 方式二：本地路径安装

```bash
# 构建
cd /path/to/dsh-qqbot
pnpm install && pnpm build

# 安装到 profile（本地路径）
dsh plugin --profile qqbot add /path/to/dsh-qqbot

# 启动
export QQBOT_APPID="你的AppID" QQBOT_SECRET="你的AppSecret"
dsh --profile qqbot
```

### 方式三：--patch 开发模式

```bash
cd /path/to/deepseek-harness
export QQBOT_APPID="你的AppID" QQBOT_SECRET="你的AppSecret"
pnpm dsh web --patch /path/to/dsh-qqbot/cordis.dev.yml
```

## 配置项

### 配置 · 类型 · 默认值 · 说明
- **配置**: `appId` · **类型**: string · **默认值**: **必填** · **说明**: QQ Bot AppID（或通过 `QQBOT_APPID` 环境变量）
- **配置**: `appSecret` · **类型**: string · **默认值**: **必填** · **说明**: QQ Bot AppSecret（或通过 `QQBOT_SECRET` 环境变量）
- **配置**: `provider` · **类型**: string · **默认值**: `deepseek-official` · **说明**: LLM 提供商名称
- **配置**: `model` · **类型**: string · **默认值**: `deepseek-chat` · **说明**: 模型名称
- **配置**: `preset` · **类型**: string · **默认值**: - · **说明**: Agent preset id
- **配置**: `cwd` · **类型**: string · **默认值**: `process.cwd()` · **说明**: Agent 工作目录
- **配置**: `requireMention` · **类型**: boolean · **默认值**: `true` · **说明**: 群聊是否需要 @bot 才触发
- **配置**: `groupPrompt` · **类型**: string · **默认值**: - · **说明**: 群聊额外 system prompt
- **配置**: `directPrompt` · **类型**: string · **默认值**: - · **说明**: 私聊额外 system prompt
- **配置**: `textChunkLimit` · **类型**: number · **默认值**: `4500` · **说明**: 单条消息最大字符数
- **配置**: `sessionIdleTimeout` · **类型**: number · **默认值**: `1800000` · **说明**: 会话闲置超时(ms)，默认 30 分钟
- **配置**: `debug` · **类型**: boolean · **默认值**: `false` · **说明**: 调试模式

## 内置命令

### 命令 · 说明
- **命令**: `/bot-reset` · **说明**: 重置当前会话（清除上下文）
- **命令**: `/bot-model` · **说明**: 查看或切换模型
- **命令**: `/bot-status` · **说明**: 查看当前会话状态
- **命令**: `/bot-help` · **说明**: 查看所有指令

## 核心模块

```
src/
├── index.ts                    # Cordis 插件入口（async apply）
├── config.ts                   # 配置 Schema
├── types.ts                    # 全局类型定义
├── setup.ts                    # 凭据绑定（扫码）
├── transport/                  # 传输层
│   ├── inbound.ts              # QQ 入站消息 → agent.followup()
│   ├── outbound.ts             # session/event → QQ sendMarkdown
│   ├── outbound-buffer.ts      # 流式缓冲
│   └── chunker.ts              # Markdown 文本切分
├── session/                    # 会话管理层
│   ├── session-manager.ts      # QQ peer → Agent 映射
│   └── idle-evictor.ts         # 闲置回收
├── model/                      # 模型路由层
│   ├── model-resolver.ts       # 路由解析
│   ├── prefs-store.ts          # per-peer 偏好持久化
│   └── settings-reader.ts      # settings.yaml 只读
├── shared/                     # 共享工具
│   ├── utils.ts                # 通用函数
│   ├── scope.ts                # scope/peer 提取
│   └── send-helper.ts          # 分块发送
├── commands/                   # 斜杠命令
└── typings/                    # 外部模块声明
```

## 会话路由

sessionKey: `qqbot:${appId}:${scope}:${peerId}`，由 SHA-256 确定性派生 SessionId，重启后可恢复。

解析策略：进程内复用 → 持久化恢复 → 全新创建。

## 设计原则

- **纯 Cordis 插件** — 遵循 dsh "Plugins, not loop changes" 原则
- **声明式依赖** — `inject = ['agents']`，不直接耦合其他插件
- **会话隔离** — 每个 QQ 私聊用户/群聊各一个独立 Agent
- **Preset 支持** — 可通过 `agent-presets` 服务挂载预设（工具集、prompt 等）
- **闲置回收** — 超时自动 dispose Agent，防止内存泄漏
- **Markdown 输出** — 回复以 Markdown 格式发送，支持代码块/表格感知切分

## 本地开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 开发模式（watch）
pnpm dev

# 用 --patch 方式调试（在 dsh monorepo 中）
cd /path/to/deepseek-harness
export QQBOT_APPID="xxx" QQBOT_SECRET="xxx"
pnpm dsh web --patch /path/to/dsh-qqbot/cordis.dev.yml
```