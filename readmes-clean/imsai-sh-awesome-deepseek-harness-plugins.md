# DSH 1024Store

面向 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness)（`dsh`）生态的社区插件目录，共收录 **262** 个插件、11 个分类。

这里主要展示可安装的插件。每个插件由各自作者独立开发和维护，收录仅表示其符合目录的基础格式要求。

[在线网站](https://deepseek1024.com/) · [英文目录](catalog/README.md) · [提交插件](CONTRIBUTING.md) · [结构化目录数据](catalog/generated/plugins.json)

> 如果这个目录帮你找到好用的插件，欢迎点个 [⭐ Star](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/stargazers)，让更多 DeepSeek Harness 用户看到它。

## 安装插件并计入统计

网站现在优先提供开源包装 CLI；它会调用官方 DeepSeek Harness 插件命令、校验 profile 的真实安装结果，并把匿名安装结果可靠地上报到排行榜：

```bash
npx @dsh-1024store/cli add <owner>/<repository> --profile web
```

仓库标识和 `--profile` 之外的参数会原样传给官方 CLI；参数可能与包装器冲突时可放到 `--` 后，例如 `... -- --ignore-scripts --reporter append-only`。透传参数不会写入遥测或本地 receipt。

统计身份是保存在 `$DSH_HOME/.dsh-1024store/` 的随机安装实例 ID，不是实名用户或账号。CLI 不上传命令输出、路径、用户名、环境变量、会话内容或原始错误；可用 `npx @dsh-1024store/cli telemetry disable`、`DO_NOT_TRACK=1` 或 `DSH_1024STORE_TELEMETRY=0` 关闭。直接使用官方 `dsh plugin` 命令仍然可用，但不会计入 DSH 1024Store 安装统计。详细字段、口径、存储和部署方式见 [安装统计设计](docs/install-analytics.md)，CLI 源码见 [`apps/cli`](apps/cli)。

## 提交插件

### 使用 Agent Skill 提交（推荐）

如果你使用 Codex、Claude Code、Cursor 或其他兼容 Agent Skills 的编程助手，可以安装本仓库提供的提交 Skill：

```bash
npx skills add imsai-sh/awesome-deepseek-harness-plugins --skill submit-dsh-plugin -g
```

安装后告诉助手：

```text
使用 $submit-dsh-plugin 检查并提交我的 DeepSeek Harness 插件。
```

该 Skill 会检查插件仓库、生成唯一允许提交的目录 JSON、验证变更范围，并在获得授权后创建 PR。静态审查通过的非草稿 PR 会自动合并；贡献者不需要修改 README 或生成的 registry。查看 [Skill 源码](skills/submit-dsh-plugin/SKILL.md)。

### 手动提交

欢迎把你的 DeepSeek Harness 插件提交到本目录。请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，通过 PR 提交一个新的结构化插件文件；自动审查将验证提交范围和最基础的 DeepSeek Harness 插件配置，通过后自动合并。

安装命令：`npx @dsh-1024store/cli add <owner>/<repository> --profile web`。

## 项目定位

本项目与 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 都服务于 DeepSeek Harness 插件生态。在继承其目录数据与社区整理思路的基础上，本项目重点补充两类能力：

- **自动发现与校验**：定期扫描 GitHub 上带有 `dsh-plugin` topic 的仓库，校验根目录 `package.json`、`dsh.bundle` 及插件补丁路径，并以结构化 JSON、确定性生成和自动审查维护目录。
- **在线插件市场**：提供功能较完整的 [deepseek1024.com](https://deepseek1024.com/) 网站，支持搜索、分类筛选、排行榜、插件详情及 GitHub 活跃度数据浏览。

## 项目结构

```text
catalog/plugins/    插件元数据（每个插件一个 JSON）
catalog/generated/  生成的公开目录数据
skills/             面向贡献者的可安装 Agent Skills
apps/web/src/       React + Vite 前端
apps/web/worker/    Cloudflare Worker API 与数据刷新
packages/dsh-1024store/  1024 品牌的 DSH 设置页内插件市场
scripts/            插件发现、校验和测试脚本
```

## 本地运行与部署

需要 Node.js 22+、npm 10+。本地开发：

```bash
npm ci
cd apps/web
npx wrangler d1 migrations apply dsh-store-star-history --local
cd ../..
npm run dev
```

浏览器访问 <http://127.0.0.1:5173>。如需完整 GitHub 数据，可在 `apps/web/.dev.vars` 中配置 `GITHUB_TOKEN`；本地接收安装事件还需要一个至少 32 字符的 `INSTALL_CLIENT_HASH_SECRET`。

部署到 Cloudflare Workers：

```bash
cp apps/web/.env.example apps/web/.dev.vars
# 在 apps/web/.dev.vars 中填写 GITHUB_TOKEN 和 INSTALL_CLIENT_HASH_SECRET
npx wrangler login
npm run build
cd apps/web
npx wrangler d1 migrations apply dsh-store-star-history --remote
npx wrangler deploy --secrets-file .dev.vars
```

`wrangler.jsonc` 已声明 KV、D1、Durable Object、Cron 定时任务和静态资源配置。生产环境要先执行 `npm run db:migrate:remote`，再部署 Worker；完整顺序、GitHub API 限额和费用估算见 [Cloudflare 插件发现运维文档](docs/plugin-discovery.md)。请勿提交 `.dev.vars`。

## 致谢

感谢以下项目为本目录提供基础与参考：

- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)：提供插件系统、`dsh.bundle` 规范和插件开发文档。
- [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)：提供初始插件目录数据和社区目录设计参考。

## 插件分类

- [UI 增强](#ui) (57)
- [主题与外观](#theme) (2)
- [会话与消息](#session) (18)
- [记忆](#memory) (13)
- [工具与能力](#tools) (70)
- [技能包](#skill) (2)
- [工作流与自动化](#workflow) (19)
- [通知与集成](#notify) (14)
- [模型与账号接入](#model) (7)
- [开发与运行时](#dev) (43)
- [娱乐](#fun) (17)

## UI 增强

- [deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) - Rust/ratatui 终端客户端，直接使用 DSH SDK JSON-RPC 协议，支持独立运行或作为 profile bundle 加载。
- [ds-api-usage](https://github.com/Sev7een/ds-api-usage) - 在设置页展示 DeepSeek API 余额与最近 24 小时用量，包括估算消费、Token、请求次数和按小时时间线。
- [dsh-101](https://github.com/bill9109/dsh-101) - DSH 文档阅读模式。
- [dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) - 选中文字→批注→随消息发送，回复按批注逐条对照。
- [dsh-answer-pet](https://github.com/Nanki-nn/dsh-answer-pet) - 蓝鲸桌面宠物：按会话实时展示回答进度、模型动作与工具调用轨迹、token、输出速率与耗时，并支持多会话状态卡片展开和收起。
- [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) - Codex 风格的 `@file` 文件引用，输入框里直接搜索并引用工作区文件。
- [dsh-auto-continue](https://github.com/HsiangNianian/dsh-auto-continue) - DSH Web 请求中断自动续跑：网络、超时或宿主崩溃等非人为失败后自动发送「继续」，支持错误分类、自适应退避、模板化继续文本与浏览器通知。
- [dsh-balance-meter](https://github.com/Ghost011118/dsh-balance-meter) - 输入框 dock 显示 DeepSeek 账户余额与会话花费，自动拉取官方定价，支持高峰/低谷计价。
- [dsh-balance-plugin](https://github.com/stevenx65/dsh-balance-plugin) - dsh 网页侧边栏的 DeepSeek 余额与 token 用量监控：今日/累计切换，并按 provider 过滤其他厂商。
- [DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) - 侧边栏完整工作台：内置文件渲染编辑、终端、Git 与子代理，支持三方插件注册新 Tab。
- [dsh-builtin-toggles](https://github.com/Starfie1d1272/dsh-builtin-toggles) - 为 DSH Web 添加官方内置插件目录、搜索与状态说明，并提供经过审核的安全 UI 插件开关。
- [dsh-calculator](https://github.com/bobcat848/dsh-calculator) - 右侧面板展示 DeepSeek API 费用（当前会话 + 全部会话累计）与账户余额，内置官方计价与峰谷计价支持。
- [dsh-chat-outline](https://github.com/liliuCourier/dsh-chat-outline) - 对话栏左侧常驻大纲：按轮次列出提问与最后回复，支持关键词过滤与一键跳转。
- [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) - 会话与当日 API 费用统计、预算图框（已用%）、官方余额、历史看板，支持峰谷计价与官方价格一键同步。
- [dsh-cost-meter](https://github.com/Sttrevens/dsh-cost-meter) - Web UI 美元成本徽标：头部显示会话总成本、每条回复结尾显示该轮成本，悬停看分项。
- [dsh-deeplink](https://github.com/qyw233/dsh-deeplink) - `?session=` / `?workspace=` 深链直达指定项目对话。
- [dsh-deepseek-billing](https://github.com/Jolly-J/dsh-deepseek-billing) - 在 Web UI 侧边栏显示 DeepSeek 账户余额和当前会话费用估算。
- [dsh-diff-viewer](https://github.com/lehhair/dsh-diff-viewer) - PiUI 风格 diff 查看器，替换 write/edit 工具调用的默认 DiffBlock。
- [dsh-drag-and-drop](https://github.com/AKIRACOD/dsh-drag-and-drop) - 拖放 fork：文档以可删除「文件芯片」挂在输入框上方，不打字也能发送。
- [dsh-drag-and-drop](https://github.com/bill9109/dsh-drag-and-drop) - 跨平台文件拖拽与原始路径插入，无需复制文件。
- [dsh-file-mentions](https://github.com/a903067276-rgb/dsh-file-mentions) - DSH 回复中的文件路径可点击：Codex 风格行内打开、文件管理器定位、回合尾部文件 chip 列表。
- [dsh-file-uploads](https://github.com/l541402398/dsh-file-uploads) - 从 Web 输入框上传任意本地文件，以待发送卡片展示，并在设置中管理已存文件。
- [dsh-files](https://github.com/taxueseek/dsh-files) - 文件上传（彩色附件卡片、会话隔离存储、sha256 去重、TTL 清扫）+ 内容嗅探的 read_document 文档读取（PDF/DOCX/XLSX/TXT）。
- [dsh-focus-chat](https://github.com/dingyi222666/dsh-focus-chat) - 「聚焦会话」精简视图，只关注最终产出结果。
- [dsh-genui](https://github.com/omdsh-dev/dsh-genui) - 助手回复内渲染交互式 UI 组件：布局、图表、表单、测验、mermaid、3D 场景与回传事件循环。
- [dsh-hud](https://github.com/a903067276-rgb/dsh-hud) - HUD 状态面板：Git 状态、MCP 服务器、技能列表、模型与 token 用量，悬浮侧栏一览无余。
- [dsh-message-preview](https://github.com/asukasec/dsh-message-preview) - 右侧用户消息导航条，根据消息数量与可用高度自适应排布导航块，并支持悬停预览、键盘操作与点击跳转。
- [dsh-mic-input](https://github.com/QT-Chen/dsh-mic-input) - 输入框麦克风语音输入：浏览器 Web Speech API 实时转写，自动去重/续听、智能标点，支持语言与自动发送设置。
- [dsh-milestone](https://github.com/SnowCrescenter-tech/dsh-milestone) - 右侧圆点时间轴导航条，点击跳转到任意用户消息。
- [dsh-navbar](https://github.com/vlln/dsh-navbar) - 对话节点导航条，右缘节点串快速跳转 user 消息。
- [dsh-opencode-go-usage](https://github.com/v587d/dsh-opencode-go-usage) - 在输入框上方 dock 显示 OpenCode Go 订阅用量（5h 滚动/每周/每月窗口与重置倒计时），内置凭据编辑器。
- [dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) - OpenPencil 设计预览与编辑插件。
- [dsh-pet](https://github.com/zealot00/dsh-pet) - DSH Web UI 桌面宠物：精灵图动画、agent 状态联动、拖拽、闹钟（每天/一次）与番茄钟，皮肤下拉选择 + 预览。
- [dsh-plugin-deepseek-balance](https://github.com/fishxcode/dsh-plugin-deepseek-balance) - 在 DSH Web 设置中展示 DeepSeek API 余额、余额趋势与每日用量图表。
- [dsh-plugin-hub](https://github.com/Noob-stupid/dsh-plugin-hub) - 插件管理面板：已安装插件一键启用/停用，内置 GitHub dsh-plugin 插件市场，支持详情查看与一键安装。
- [dsh-side-panel](https://github.com/ccq1/dsh-side-panel) - 侧边栏集成文件浏览器、终端和 Git 审查，方便预览文件。
- [dsh-spend](https://github.com/nonewind/dsh-spend) - DSH Web 用量与费用统计插件：右下角悬浮窗，按模型/按天/按会话多维聚合与预计花费。
- [dsh-spotlight](https://github.com/0xsline/dsh-spotlight) - 键盘优先的命令面板（command palette）。
- [dsh-sticky-disclosure](https://github.com/Han-1413141/dsh-sticky-disclosure) - 一键收起会话中所有展开的区块（Think、工具卡等），常驻计数按钮 + 自定义快捷键。
- [dsh-sticky-note](https://github.com/Meredith2328/dsh-sticky-note) - 编辑框工具栏便签，随手记点子和 TODO，自动保存为 Markdown，一键发送到对话。
- [dsh-task-dag](https://github.com/LeemanCheung/dsh-task-dag) - 将会话子代理与持久工作流运行展示为实时 DAG，支持状态展示、节点导航与重启后历史恢复。
- [dsh-task-status](https://github.com/vlln/dsh-task-status) - 后台任务状态条：对话页任务进度 + 实时输出 tail。
- [dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) - DeepSeek Harness 的终端 UI（TUI）。
- [dsh-token-usage](https://github.com/LaoYueHanNi/dsh-token-usage) - 按请求持久化模型 token 用量，Web 设置「Token 用量」统计页：按日趋势图、按模型明细表、日期/模型筛选。
- [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) - Claude Code 风格全屏终端 UI：像素鲸鱼顶栏、实时工作状态行、思考流式展开。
- [dsh-turn-navigator](https://github.com/vibeinging/dsh-turn-navigator) - 对话轮次导航。
- [dsh-ux](https://github.com/jiangnanquan/dsh-ux) - Solarized 浅色主题、紧凑布局、思考/工具链折叠胶囊，以及余额、本轮成本与用量看板的 DSH Web 界面增强插件。
- [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) - 对话内生成式 UI：模型把交互式 HTML 卡片直接画进会话流，带流式预览与沙箱渲染。
- [dsh-web-archive](https://github.com/renat3u/dsh-web-archive) - 折叠对话中的 Think、Bash 等「无用消息」。
- [dsh-web-attention-badge](https://github.com/Luaphes/dsh-web-attention-badge) - 会话需要你时三处同时亮起：角标、标签页标题计数、按状态换色的鲸鱼 favicon。
- [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) - DSH Web UI 插件与皮肤合集：任务看板、git 图、右侧面板、远程移动端 UI、桌宠、实时 token 统计与皮肤中心。
- [dsh-whale-animation](https://github.com/LeemanCheung/dsh-whale-animation) - DSH Web 状态文字旁的持久化黑色鲸鱼深潜动画，提供减少动态效果回退与无缝闭环。
- [dsh-workspace-search](https://github.com/tsonglew/dsh-workspace-search) - VS Code 式工作区关键词搜索 Tab（better-sidebar 扩展）：同时匹配文件名与文件内容，结果按文件分组带行号，点击在侧栏编辑器打开。
- [ex-setting](https://github.com/omdsh-dev/ex-setting) - DSH 的设置扩展。
- [ui-status-label](https://github.com/alingalingling/ui-status-label) - 把鲸鱼娘思考时的 "deep diving" 状态文案自定义成任意你想要的样子。
- [web-components](https://github.com/omdsh-dev/web-components) - Web Components 支持。
- [widget-dock](https://github.com/MorGogh/widget-dock) - 对话两侧空白区的可拖动卡片工作台：余额、Token 用量、会话统计、目标、成本估算等小组件，支持 S/M/L/XL 尺寸档位与官方定价成本估算。

## 主题与外观

- [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) - DSH Web 鲸鱼娘皮肤系列（深海女仆工坊 maid-atelier）。
- [dsh-skin](https://github.com/KinGao294/dsh-skin) - Codex 风格皮肤切换器 + 自定义壁纸层，可调透明度与模糊。

## 会话与消息

- [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) - 把 Claude Code / Codex / ChatGPT / Cursor / Gemini / Reasonix / opencode 的聊天记录全保真导入为可续聊的 DSH 会话。
- [dsh-conversation-share](https://github.com/bill9109/dsh-conversation-share) - 分享任意段落的对话。
- [dsh-crosstalk](https://github.com/Jesse-njx/dsh-crosstalk) - 跨会话消息：本机任意会话都可像 Claude Code 一样列出并互发消息，基于本地心跳注册表与收件箱。
- [dsh-explain](https://github.com/yuezengwu/dsh-explain) - 本地优先学习模式：跨会话全局学习线程、按来源讲解。
- [dsh-file-claim](https://github.com/Nwflower/dsh-file-claim) - 同一工作区并行多会话的文件认领与写入保护（claim/release、心跳 stale 接管、pending 三路合并）。
- [dsh-inline-images](https://github.com/3403473060/dsh-inline-images) - 对话内联图片：LLM 回复中输出的本地图片路径在消息正文直接渲染为图片（9 种格式、点击放大灯箱、可调尺寸）。
- [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) - 跨实例互联：经 interconnect 服务在多个 DSH 实例间转发消息与事件。
- [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) - 基于分支的消息编辑、reroll、重试与版本时间线。
- [dsh-peer-link](https://github.com/czm15053/dsh-peer-link) - 让 dsh 和 Claude Code 会话直接互发消息，附带可点击的会话列表卡片（搜索/刷新/弹窗发送）。
- [dsh-prompt-stash](https://github.com/Wine-Red/dsh-prompt-stash) - 本地、按会话隔离的 LIFO 输入暂存：临时收起未完成的输入，之后安全恢复并继续编辑。
- [dsh-prompt-studio](https://github.com/Moeblack/dsh-prompt-studio) - 带实时预览的用户/内置 system prompt 分节编辑器。
- [dsh-session-export](https://github.com/bwndlct/dsh-session-export) - 把当前会话导出为可移植、带 schema 版本的 Markdown 与 JSON 文件，提供 `session_export` 工具与斜杠命令两种入口，文件名跨平台安全。
- [dsh-share](https://github.com/hellodigua/dsh-share) - 一键分享你的对话。
- [dsh-side-chat](https://github.com/heartmove/dsh-side-chat) - 选中对话片段，在右侧面板的侧边聊天中提问（按会话隔离）；AI 回复可原文或摘要后带回主会话。
- [dsh-sidechain](https://github.com/Buyi-wsgzg/dsh-sidechain) - `/side` 持续性侧会话与 `/btw` 一次性侧问，在临时 fork 中运行、不写入主会话历史。
- [dsh-token-usage](https://github.com/LeemanCheung/dsh-token-usage) - 持久化记录每个会话的 Token 用量，在设置页提供 provider/model 统计与最近 52 周活跃度热力图。
- [dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) - 对话回退：基于持久 Change Ledger 回滚会话与工作区状态。
- [task-passport](https://github.com/dongsheng123132/task-passport) - 通过机器可读检查点与乐观锁，在 DeepSeek Harness、WorkBuddy、Claude Code 和 Codex 之间交接持久任务状态。

## 记忆

- [distill](https://github.com/LoserFox/distill) - 自动对话蒸馏：后台 subagent 反省 + 技能 create/update。
- [dsh-file-memory](https://github.com/ICCuse/dsh-file-memory) - 文件型工作记忆：memorize/recall 把关键前提逐字保存在会话笔记文件，无损挺过上下文压缩。
- [dsh-knowledge](https://github.com/ICCuse/dsh-knowledge) - 全局知识库桥：kb_add/kb_search/kb_show/kb_timeline 读写与 Codex 共享的 D:\knowledge（格式逐字节兼容）。
- [dsh-memento](https://github.com/PerryLink/dsh-memento) - 有界、分层、带审批门、可审计的跨会话记忆：`ctx.memory` 服务 + 零依赖 SQLite 存储 + `memory` 工具与冻结快照注入；写入必过审批门，模型可见内容可自会话日志重建。
- [dsh-memory](https://github.com/Jesse-njx/dsh-memory) - 基于 DSH 无损会话日志的引用式记忆：蒸馏出的事实带 `(sessionId, eventRange)` 引用，可随时展开回原始日志片段。
- [dsh-memory-meow](https://github.com/Phant0Meow/dsh-memory-meow) - 项目级跨会话记忆：PROJECT.md 快照注入首条用户消息（缓存友好）+ memory_remember 工具 + ReAct 任务结束自动反思；各项目独立记忆文件，互不互通。
- [dsh-memory-vault](https://github.com/flymysql/dsh-memory) - 跨会话记忆库：remember / recall / forget 工具、每轮提示注入与设置页条目浏览。
- [dsh-mneme](https://github.com/modusensus/dsh-mneme) - 跨会话记忆：SQLite + 可人工编辑的 Markdown 镜像，后台自动巩固（去重/合并/冲突裁决），提供 6 个记忆工具。
- [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) - Mnemon 深度集成：本地三层记忆（Runtime Memory、可检索 Documents、受监督 Memory Spaces）。
- [dsh-plugin-asmemory](https://github.com/Xplore-LAB/dsh-plugin-asmemory) - 动作-状态时序记忆：记录类型化的状态与动作，做趋势、异常与因果关联分析。
- [dsh-premise-guard](https://github.com/ICCuse/dsh-premise-guard) - 压缩后前提漂移守卫：摘要丢失关键字面锚点时注入一次性提醒。
- [nowledge-mem-deepseek-harness](https://github.com/nowledge-co/nowledge-mem-deepseek-harness) - 给所有 AI 工具和 Agent 共用的一层记忆：注入 Context Bundle、提示时检索、MCP 工具与回合结束 DSH 线程捕获。
- [sgme](https://github.com/freehul/sgme) - 拾光记忆引擎（SGME）桥接：多智能体共享长期记忆（HTTP）—— L0/L1/L1.5/L2 分层提炼、按场景注入、统一检索、主动关怀信号（memory_search / wiki_search / signal_pull / signal_claim / signal_ack），npm 包名 `dsh-sgme`。

## 工具与能力

- [@zhaoolee/dsh-notes](https://github.com/zhaoolee/notes) - 将 DSH 对话导出为锤子便签风格 PNG，或在配置的账号工作区中新建和更新 Markdown 便签。
- [argo](https://github.com/taxueseek/argo) - 专为 agent 打造的搜索工具：多语言，覆盖中文/英文/学术/代码/购物/金融/新闻/百科。
- [blender](https://github.com/CheshireJCat/blender) - Blender 3D 生产插件：提供 30 个建模/重建 Skill、13 个运行时工具和 26 个确定性 Helper，覆盖参考图拟合、渲染、验证、动画与可移植格式导出；npm 包名 `dsh-blender`。
- [dsh-adb](https://github.com/SamXiaBing/dsh-adb) - ADB 设备·台架运维工具集：设备发现、结构化 logcat（后台采集）、apk 安装、文件 pull/push、性能快照。
- [dsh-adhd-copilot](https://github.com/zimai233/dsh-adhd-copilot) - ADHD 行为辅导技能：任务拆解、事项过载管理、启动仪式与失败重启。
- [dsh-apple-mode](https://github.com/jihongboo/dsh-apple-mode) - DSH 的 Xcode AI 集成：26 个 Xcode MCP 工具（mcpbridge）+ Apple 平台技能 + Xcode Intelligence 风格 persona（agent preset 或全局 bundle）。
- [dsh-backup](https://github.com/xiaoyuyu6420/dsh-backup) - 一键备份 DSH 用户数据：/backup 命令、定时自动备份、sha256 校验与自动轮换。
- [dsh-bash-terminal](https://github.com/MAXeaglet/dsh-bash-terminal) - 一个 shell 工具：Windows 上统一执行 PowerShell / Git Bash / WSL，外加交互式 PTY 终端，默认终端由用户在设置中选择。
- [dsh-browser](https://github.com/Lum1104/dsh-browser) - Chrome 侧边栏扩展，让 DSH 直接操控你的浏览器，无需视觉能力。
- [dsh-code-intel](https://github.com/lonelymoon87/dsh-code-intel) - 用 Tree-sitter 建立工作区符号索引，提供词法或可选 embedding 辅助的代码检索。
- [dsh-computer-use](https://github.com/Anionex/dsh-computer-use) - macOS 电脑控制：Accessibility 观测、过期状态拒绝、作用域权限与安全输入。
- [dsh-context-proxy](https://github.com/EvilIrving/dsh-context-proxy) - 按需取回薄层：context_query / context_slice / context_grep 三个工具读取已持久化的历史，引用可回放。
- [dsh-continual-evolve](https://github.com/ZK-Andy/dsh-continual-evolve) - 持续自进化：从会话轨迹沉淀版本化、可审计、可回滚的 harness 状态（提示词/记忆/技能/子代理规格），带审查门禁与技能热加载。
- [dsh-cowork](https://github.com/Jesse-njx/dsh-cowork) - doc_read/doc_write：以有界、单元格寻址的方式读写 xlsx / pdf / docx / pptx / ipynb，另附 MCP 服务器与 CLI。
- [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) - 用 Monaco 编辑器创建和管理沙箱化的自定义 JavaScript 工具。
- [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) - 让 AI 帮你连数据库、写 SQL。
- [dsh-docker](https://github.com/Jesse-njx/dsh-docker) - 类型安全、带护栏的容器控制：ps/logs/inspect/exec/start/stop 与 compose up/down，JSON 输出、项目感知定位、破坏性操作需审批。
- [dsh-exam-countdown](https://github.com/zimai233/dsh-exam-countdown) - 查询 64 场中国考试（高考/考研/四六级/CPA/法考…）的规则日期（第二个周六、第一个周日）与倒计时。
- [dsh-excel-chat](https://github.com/hccccc01333/dsh-excel-chat) - 在 DeepSeek Harness 里对话完成 Excel 工作：建表、编辑、修复公式、图表校验，每次编辑后自动体检公式。
- [dsh-figma-to-lottie](https://github.com/zimai233/dsh-figma-to-lottie) - 将 SVG 路径与关键帧参数编译成自包含的 Lottie JSON 动画文件。
- [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin) - 会话内直接找插件：按关键词/分类搜索本精选 registry，返回描述与可直接执行的安装命令。
- [dsh-fleet-audit](https://github.com/LeslieWylie/dsh-fleet-audit) - 只读的 agent 机群凭据卫生审计：检查凭据文件权限、git remote 内嵌凭据（输出脱敏）与 provider token 字面量计数；零依赖、确定性。
- [dsh-hdc-bridge](https://github.com/1na-ko/dsh-hdc-bridge) - 鸿蒙设备桥：hdc 截图/装包/日志/崩溃/UI 自动化闭环（配 read_image 看图），官方优先版本化 API 知识层（SDK .d.ts + 离线随包文档），以及 DevEco CLI 构建/签名/lint 通道。
- [dsh-image-search](https://github.com/zimai233/dsh-image-search) - 多引擎反向识图聚合：Google Lens、百度、Yandex、TinEye、SauceNAO、IQDB、Ascii2d。
- [dsh-kb-sieve](https://github.com/omdsh-dev/dsh-kb-sieve) - 从 md/txt/docx/pdf 构建可审计知识库包（SQLite FTS5），确定性检索与原文阅读。
- [dsh-market](https://github.com/dsh-market/dsh-market) - 装在 DSH 里的插件市场：设置页内逛/搜全部社区插件，按分类筛选，确认后一键安装，已装插件一目了然。
- [dsh-md-preview](https://github.com/LeslieWylie/dsh-md-preview) - 把 Markdown 渲染为自包含的独立 HTML 页面：提供在 headless 配置下同样可用的 `md_html_render` 工具，以及在网页端浏览、预览、编辑并导出本地 `.md` 文件的抽屉；两个入口共用同一个渲染器，无运行时依赖。
- [dsh-mobile-gui-agent](https://github.com/kunjinkao-os/dsh-mobile-gui-agent) - Android GUI Agent：ADB 截图、压缩 UI hierarchy 定位、逐步动作验证、审批和 Mobile Web 视图。
- [dsh-net-proxy](https://github.com/mafeis/dsh-net-proxy) - 让 agent 的网络请求走本机 HTTP/CONNECT/SOCKS5 代理。
- [dsh-openmaic](https://github.com/