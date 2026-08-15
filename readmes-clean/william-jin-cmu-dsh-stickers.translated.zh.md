# DSH Stickers

> 不会发表情包，可能是 Agent 缺少活人感的最大原因。

`@dsh-external/dsh-stickers` 是一个纯 DSH 外部插件：同一份 catalog 同时服务 WebUI 用户的表情选择器、`/sticker` 命令和 Agent 的 `send_sticker` tool，不修改 DSH core。

![WebUI：用户与 Agent 双向发表情](docs/screenshots/webui-real-conversation-v2.png)

## 能做什么

- 用户在 WebUI 点击 🐋 选择器，或输入 `/sticker  [black]`。
- 24 张表情全部提供蓝鲸娘 / 黑鲸娘两套角色：选择器顶部可切换角色（默认蓝鲸娘），切换后发送同一张表情的黑鲸版本。
- Agent 在普通对话中按语境调用 `send_sticker({ id, variant? })`，不是等用户明确索要表情。
- 14 张 public 表情对双方开放，其中 4 张是工作流反应：`tests-passed`、`root-cause`、`running-tests`、`fixed-review`。
- 10 张彩蛋只出现在 Agent tool schema 中；用户命令和选择器都无法访问，例如 `restart-myself`、`hot-update`、`subagents-down`。
- Web 图片由插件自己的 `/api/dsh-stickers/*` route 提供，用户和 Agent 的卡片都进入持久会话历史。

## 人类和 Agent 都能发

这 14 张会出现在 WebUI 的 🐋 选择器中；人类也可以输入 `/sticker `，Agent 则可按语境调用同一个 ID。

### 表情 · ID · 文案
- **表情**: ![适合日常对话，即时响应](docs/sticker-thumbnails-v2/01-daily-chat.png) · **ID**: `daily-chat` · **文案**: 适合日常对话，即时响应
- **表情**: ![人类的怪问题怎么那么多](docs/sticker-thumbnails-v2/02-human-questions.png) · **ID**: `human-questions` · **文案**: 人类的怪问题怎么那么多…
- **表情**: ![你拿 AI 搞这个](docs/sticker-thumbnails-v2/03-use-ai-for-this.png) · **ID**: `use-ai-for-this` · **文案**: 你拿 AI 搞这个？
- **表情**: ![生鱼忧患，死鱼安乐](docs/sticker-thumbnails-v2/04-fish-philosophy.png) · **ID**: `fish-philosophy` · **文案**: 生鱼忧患，死鱼安乐
- **表情**: ![这就够了](docs/sticker-thumbnails-v2/05-enough.png) · **ID**: `enough` · **文案**: 这就够了
- **表情**: ![服务器繁忙，请稍后再试](docs/sticker-thumbnails-v2/06-server-busy.png) · **ID**: `server-busy` · **文案**: 服务器繁忙，请稍后再试
- **表情**: ![思考已停止](docs/sticker-thumbnails-v2/07-thinking-stopped.png) · **ID**: `thinking-stopped` · **文案**: 思考已停止
- **表情**: ![这个问题问得真妙](docs/sticker-thumbnails-v2/08-great-question.png) · **ID**: `great-question` · **文案**: 哇，这个问题问的真妙！
- **表情**: ![已深度思考](docs/sticker-thumbnails-v2/09-deep-thought.png) · **ID**: `deep-thought` · **文案**: 已深度思考
- **表情**: ![No thanks I use DeepSeek](docs/sticker-thumbnails-v2/10-no-thanks.png) · **ID**: `no-thanks` · **文案**: No thanks I use DeepSeek
- **表情**: ![测试通过](docs/sticker-thumbnails-v2/21-tests-passed.png) · **ID**: `tests-passed` · **文案**: 测试通过！
- **表情**: ![找到原因了](docs/sticker-thumbnails-v2/22-root-cause.png) · **ID**: `root-cause` · **文案**: 找到原因了
- **表情**: ![正在跑测试](docs/sticker-thumbnails-v2/23-running-tests.png) · **ID**: `running-tests` · **文案**: 正在跑测试
- **表情**: ![改好了，你看看](docs/sticker-thumbnails-v2/24-fixed-review.png) · **ID**: `fixed-review` · **文案**: 改好了，你看看

## 只有 Agent 能发的彩蛋

下面 10 张只存在于 Agent 的 `send_sticker` schema 中，不出现在人类选择器里，`/sticker` 也会拒绝发送。

### 表情 · ID · 文案
- **表情**: ![自修改翻车](docs/sticker-thumbnails-v2/11-self-destruct.png) · **ID**: `self-destruct` · **文案**: 最近自己搓自己时，自杀频率有点高
- **表情**: ![我重启一下自己](docs/sticker-thumbnails-v2/12-restart-myself.png) · **ID**: `restart-myself` · **文案**: 我重启一下自己
- **表情**: ![热更新成功，进程没了](docs/sticker-thumbnails-v2/13-hot-update.png) · **ID**: `hot-update` · **文案**: 热更新成功，进程没了
- **表情**: ![正在恢复会话](docs/sticker-thumbnails-v2/14-restore-session.png) · **ID**: `restore-session` · **文案**: 正在恢复会话…未分组里见
- **表情**: ![浏览器先走一步](docs/sticker-thumbnails-v2/15-browser-left.png) · **ID**: `browser-left` · **文案**: 会话太长，浏览器先走一步
- **表情**: ![我在深度思考](docs/sticker-thumbnails-v2/16-not-stuck.png) · **ID**: `not-stuck` · **文案**: 我不是卡，我在深度思考
- **表情**: ![内存正在努力活着](docs/sticker-thumbnails-v2/17-memory-alive.png) · **ID**: `memory-alive` · **文案**: 内存正在努力活着
- **表情**: ![Subagent 已全员中断](docs/sticker-thumbnails-v2/18-subagents-down.png) · **ID**: `subagents-down` · **文案**: 已召唤 Subagent，已全员中断
- **表情**: ![插件装得很好](docs/sticker-thumbnails-v2/19-plugins.png) · **ID**: `plugins` · **文案**: 插件装得很好，下次别装了
- **表情**: ![Session 打不开了](docs/sticker-thumbnails-v2/20-session-locked.png) · **ID**: `session-locked` · **文案**: Session 没坏，只是打不开了

## 为什么当前不支持 TUI

turtle-ui 现有的第三方扩展面只提供临时 `tui.openOverlay()`，没有把插件组件插入持久 transcript 的接口。overlay 关闭后会消失，滚动或重开 session 也无法恢复，因此它不符合“聊天历史中的表情消息”这一语义。

本版本刻意只发布完整的 WebUI 支持，不用瞬时 overlay 冒充 TUI 支持。未来 turtle-ui 提供通用、可回放的 transcript renderer API 后，插件可以在不加入任何表情专用 core 代码的前提下补回 TUI。

## 本地安装

需要 Node 22 和一个可运行的 DSH checkout。

```bash
pnpm install
pnpm run typecheck
pnpm test
pnpm run build

export DSH_HOME=/absolute/path/to/an/isolated-dsh-home
dsh plugin --profile web add /absolute/path/to/dsh-stickers
dsh web
```

## 插件接口

Node 侧通过 `cordis.patch.yml` 挂载主插件，注册：

- `send_sticker` Agent tool
- `/sticker ` 用户命令
- Agent 使用表情的 system prompt guidance
- Web PNG route（仅在 `webServer` 存在时启用）

Browser 侧由 `package.json#dshClient` 自动发现，注册三个官方 slot：

- `conversation.input.right`：用户选择器
- `conversation.chat.commandview/sticker`：用户表情卡片
- `conversation.chat.toolview/send_sticker`：Agent 表情卡片

## 表情包来源

这套表情包一部分沿用 DeepSeek Harness 官方贴纸；另一部分创意和文案来自「【官方】DSH 内测群」里群友反馈的真实 DSH 使用问题，例如热更新后进程退出、Session 无法打开、浏览器在长会话中掉队，以及 Subagent 集体中断等。群聊中的相关问题与社区反馈由私有仓库 [`dsh-external/group-chat-diary`](https://github.com/dsh-external/group-chat-diary) 归档；为保护群成员信息，该仓库仅限获得授权的 `dsh-external` 组织成员查看。

`assets/stickers/` 存放用于 WebUI 的透明 PNG，`assets/stickers/black/` 是黑鲸娘角色的同名变体。新增表情时同时更新 `src/shared/catalog.ts` 即可，WebUI 用户选择器、用户命令和 Agent tool 会共享同一条定义。

## 贡献者

- 黑鲸娘全套 24 张表情图由 少女阿原（[@ayuanwong](https://github.com/ayuanwong)）绘制并提供，双角色切换的交互设计也来自她的提案。