# DSH Telegram Bot

通过 Telegram 私聊远程使用和查看 DeepSeek Harness。

## 功能

- 与 DSH 对话并接收回复
- 查看工作区和实时会话
- 在指定工作区创建会话
- 查看正在运行的任务
- 取消当前任务
- 仅允许一个指定的 Telegram 用户操作

## 安全说明

- 只接受配置的 Telegram 数字 User ID。
- 只接受私聊，不支持群聊控制。
- Bot Token 通过 DSH 凭据系统读取，不写入插件配置。
- Telegram 不能代替你批准敏感工具操作。
- 插件只能切换和控制自己创建的会话。

## 安装

从 GitHub 安装到 DSH Web profile：

```bash
dsh plugin --profile web add git+ssh://git@github.com/yuko0331/DSH-telegram.git
```

也可以安装本地仓库：

```bash
dsh plugin --profile web add /Users/yuko/xxcode/dsh-telegram-bot
```

确认插件已经加入配置：

```bash
dsh --profile web --dump-config
```

输出中应包含 `telegram-bot`。

## 配置

### 1. 创建 Telegram Bot

在 Telegram 中联系 [@BotFather](https://t.me/BotFather)，执行 `/newbot` 并取得 Bot Token。

不要把 Token 发到聊天中，也不要提交到 Git。

### 2. 获取 Telegram User ID

通过 `@userinfobot` 等机器人查询自己的数字 User ID，例如：

```text
123456789
```

### 3. 启动 DSH

```bash
export DSH_TELEGRAM_BOT_TOKEN='你的 Bot Token'
export DSH_TELEGRAM_ADMIN_USER_ID='你的数字 User ID'
dsh --profile web
```

安装插件后，需要重启正在运行的 DSH 进程。未配置这两个环境变量时，DSH Web 仍会启动，但 Telegram 插件保持禁用。

## 使用

向 Telegram Bot 私聊发送：

| 命令 | 用途 |
|---|---|
| `/help` | 查看帮助 |
| `/workspaces` | 查看工作区 |
| `/new <工作区ID>` | 创建并选择会话 |
| `/sessions` | 查看实时会话 |
| `/use <会话ID>` | 切换机器人创建的会话 |
| `/status` | 查看运行状态 |
| `/tasks` | 查看正在运行的任务 |
| `/stop` | 取消当前任务 |

发送其他普通文本，会进入当前 DSH 会话。

首次使用：

```text
/workspaces
/new <工作区ID>
你好，请检查当前项目状态
```

## 开发验证

```bash
pnpm install
pnpm run check
```

`pnpm run check` 会执行类型检查、测试和构建。

## 当前限制

- 只支持文字消息和长轮询。
- 不支持群聊、语音、文件和按钮操作。
- `/tasks` 显示正在运行的 DSH 会话，不读取浏览器任务看板。
- 插件重启后需要重新选择会话。