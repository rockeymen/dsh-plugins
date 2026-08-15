# DeepSeek Harness QQBot

中文 | [English](README.md)

这是一个树外 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 通道插件，通过 QQ 官方 Gateway 把 QQ 智能机器人连接到可持久化的 Harness agent。

## 功能

- 使用官方 `@tencent-connect/qqbot-nodejs` SDK
- 支持 QQ 私聊和群聊文本收发
- 接收 PNG、JPEG、WebP、GIF 图片并保存为 Harness 持久附件
- 当前模型不支持图片输入时自动降级为文本元数据，不让整轮失败
- 接收语音转写和非图片附件元数据，并向模型提供 QQ 临时下载地址
- 发送 agent 生成的文本、图片和工作目录内的本地文件
- 提供仅当前 QQ 回合可用的 `qq_send_file` 工具，并校验工作目录范围和文件大小
- 默认以 QQ Markdown 格式发送回复
- 每个私聊或群聊对应一个独立、可恢复的 Harness 会话
- 挂载 Harness agent preset，使 QQ 会话与网页会话使用相同的工具、提示词和技能组合
- 网页已打开同一会话时安全复用 live agent，不创建第二个 session writer
- 通过 QQ 主动推送仅限回合发起人操作的“允许一次”和“拒绝”批准按钮
- 批准超时自动拒绝、发送失败回退其他已组合批准通道，且后续工具调用不继承提权
- 输入状态提示、长回复拆分、同会话消息串行处理、消息排重、发送重试和超时保护
- 私聊/群聊可分别配置开放、白名单或禁用
- 内置 `/bot-ping`、`/bot-image-test`、`/bot-file-test`、`/bot-help`、`/bot-status`、`/bot-cancel`
- Secret 通过 Harness 凭据服务解析，不进入插件配置
- 未配置 AppID 或 AppSecret 时保持休眠，单独安装插件不会阻断 DSH 启动

## 环境要求

- Node.js 22.19 或更高版本
- pnpm 10.33.4
- DeepSeek Harness 0.1.0-rc.6 或更高版本
- 已开启私聊和/或群聊消息事件的 QQ 机器人 AppID、AppSecret；QQ 批准按钮还需要 Inline Keyboard 权限

## 安装

从 GitHub 安装到 web profile：

```sh
pnpm dsh plugin --profile web add github:sliverp/DeepSeek-harness-qqbot
```

从本地检出安装：

```sh
pnpm dsh plugin --profile web add /absolute/path/to/DeepSeek-harness-qqbot
```

## 配置

AppID 由启动环境提供，AppSecret 保存到 `QQBOT_APP_SECRET` 凭据引用。开发时也可以直接通过环境变量注入：

```sh
export QQBOT_APP_ID='your-app-id'
export QQBOT_APP_SECRET='your-app-secret'
pnpm dsh --profile web
```

组合包会读取 `QQBOT_APP_ID`，通过 `ctx.credentials` 解析 `QQBOT_APP_SECRET`，并默认让 agent 使用启动目录作为工作目录。可以用 `DSH_QQBOT_CWD` 覆盖工作目录。

安装组合包后不必立即配置凭据。AppID 为空，或引用的 AppSecret 不存在/为空时，通道会记录“未配置、保持休眠”的日志并允许 DSH 正常完成启动；补齐两项配置后重载或重启 DSH 即可连接。非空但错误的凭据仍会在 QQ 鉴权阶段报错。

长期使用时，建议把 `QQBOT_APP_ID` 放到 `~/.dsh/.env`，并通过 Harness 凭据设置界面保存 `QQBOT_APP_SECRET`。不要把任何真实凭据提交到 Git。

如需修改权限策略或限制，在 `~/.dsh/profiles/web/cordis.patch.yml` 覆盖该插件行：

```yaml
- id: qqbot-channel
  name: deepseek-harness-qqbot
  config:
    appId: !!js process.env.QQBOT_APP_ID
    appSecretRef: QQBOT_APP_SECRET
    cwd: !!js process.env.DSH_QQBOT_CWD ?? process.cwd()
    agentPreset: standard
    c2cPolicy: allowlist
    c2cAllowFrom: [你的用户-openid]
    groupPolicy: open
    requireMentionInGroup: true
    imageInputMode: auto
    markdownSupport: true
    approvalTimeoutMs: 120000
    maxOutboundFileBytes: 104857600
```

`imageInputMode` 默认为 `auto`：支持视觉的模型会收到持久图片块；纯文本模型会收到图片元数据和临时来源 URL，避免整轮失败。只有确认模型支持图片时才使用 `always`；使用 `never` 可强制文本降级。

`markdownSupport` 默认为 `true`，与腾讯官方 QQBot 通道插件保持一致。开启后，QQ SDK 会把 agent 文本作为 `msg_type=2` 发送，使标题、列表、链接、强调、表格和代码块可在 QQ 中渲染。只有机器人尚未获得 QQ Markdown 权限时才设置为 `false`，否则 QQ API 会拒绝 Markdown 消息。

`agentPreset` 默认使用当前 Harness 部署选择的默认 preset（通常是 `standard`）。插件会把 preset 写入会话头，并在恢复时重新挂载，使 QQ 会话获得与网页新建会话相同的工具、提示词和技能组合。旧版本创建的会话使用 `qqbot-v1-` 命名空间；修复后会在 `qqbot-v2-` 下新建正确组合的会话，旧历史保留不动。

QQ 发起的回合需要 Harness 批准时，插件会主动推送带“允许一次”和“拒绝”按钮的 QQ 消息。只有发起该回合的 QQ 用户可以操作，群聊中同样如此。允许结果只覆盖当前这一次操作；Harness 没有持久的“始终允许”结果。QQ 范围内的提示要求后续每次工具调用先使用当前沙箱，只有某项操作刚被沙箱拒绝后，才可在该操作的原样重试中使用 `sandbox_permissions`。`approvalTimeoutMs` 默认为 120,000 毫秒，超时未选择会拒绝操作。批准消息发送失败时，请求会交给网页等其他已组合的批准通道；网页发起的回合仍直接使用网页批准。

当前 QQ 用户要求接收或下载文件时，agent 可以调用会话范围内的 `qq_send_file` 工具。相对路径从 `cwd` 解析，绝对路径也必须位于 `cwd` 内。插件会先解析符号链接，只接受普通文件，并拒绝超过 `maxOutboundFileBytes` 的文件；默认值也是 QQ 协议上限 104,857,600 字节（100 MiB）。

文件工具只在插件处理当前 QQ 消息期间生效；从网页继续同一个持久会话时，不能向上一次 QQ 目标发送文件。如果网页已经打开同一个持久会话，QQ bridge 会借用该 agent、等待当前活动结束，不会尝试恢复第二个写入者。只要工作目录含有非公开数据，就应使用 `allowlist` 访问策略，因为白名单内的 QQ 用户也能使用所选 agent preset 提供的其他工具。

## 验证

日志出现 `QQ Gateway connected` 后，在 QQ 中向机器人发送 `/bot-ping`，应收到：

```text
pong — DeepSeek Harness QQBot 已连接。
```

然后发送普通文本或图片。插件会把消息追加到对应的 Harness 持久会话，并把当前默认模型的回复发回 QQ。

发送 `/bot-image-test` 可以直接验证 QQ 官方图片上传和图片出站接口，不依赖模型生成图片。机器人应先发送一张蓝色 PNG，再回复发送成功。

发送 `/bot-file-test` 可以在不调用模型的情况下验证 QQ 官方文件上传接口。机器人应先发送 `qqbot-file-test.txt`，再回复发送成功。随后可以要求 agent 发送工作目录中已有的文件，例如“把 README.md 作为文件发给我”；对应会话中应出现 `qq_send_file` 调用，QQ 应收到附件。

验证批准路由时，选择会在沙箱提权前询问的权限 preset，再要求 agent 执行需要更高权限的操作。QQ 应主动收到“允许一次”和“拒绝”按钮；点击后同一回合应继续执行，网页不再显示这次批准。

## 开发

```sh
pnpm install
pnpm run check
```

## 许可证

MIT