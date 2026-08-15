![Awesome DSH Plugin](https://beancookie.github.io/awesome-dsh-plugin/logo.png)

# Awesome DeepSeek Harness (DSH) Plugin

> [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）插件精选列表。

DeepSeek Harness 是 DeepSeek 开源的 agent harness——既是可直接运行的 Coding Agent（提供 Web 与 headless 两种形式），底层又是一套「一切皆插件」的框架：模型、工具、沙箱、会话存储、UI、乃至 Agent Loop 本身都是插件。插件既可以扩展官方 Coding Agent，也可以替换其核心部件，甚至组装出完全不同的东西。

**275** 个插件 · 欢迎 [PR](#贡献)

本项目积极支持并感谢 [LINUX DO](https://linux.do) 社区——一个欢迎技术爱好者的温馨空间。

## 插件

### 🎨 UI 增强
- [zealot00/dsh-pet](https://github.com/zealot00/dsh-pet) — DSH Web UI 桌面宠物：精灵图动画、agent 状态联动、拖拽、闹钟（每天/一次）与番茄钟，皮肤下拉选择 + 预览。

- [huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) — DeepSeek Harness 的终端 UI（TUI）。
- [openma-ai/deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) — Rust/ratatui 终端客户端，直接使用 DSH SDK JSON-RPC 协议，支持独立运行或作为 profile bundle 加载。
- [omdsh-dev/dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) — Codex 风格的 `@file` 文件引用，输入框里直接搜索并引用工作区文件。
- [alingalingling/ui-status-label](https://github.com/alingalingling/ui-status-label) — 把鲸鱼娘思考时的 "deep diving" 状态文案自定义成任意你想要的样子。
- [ZSeven-W/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) — OpenPencil 设计预览与编辑插件。
- [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) — 对话内生成式 UI：模型把交互式 HTML 卡片直接画进会话流，带流式预览与沙箱渲染。
- [ccq1/dsh-side-panel](https://github.com/ccq1/dsh-side-panel) — 侧边栏集成文件浏览器、终端和 Git 审查，方便预览文件。
- [dingyi222666/dsh-focus-chat](https://github.com/dingyi222666/dsh-focus-chat) — 「聚焦会话」精简视图，只关注最终产出结果。
- [omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui) — 助手回复内渲染交互式 UI 组件：布局、图表、表单、测验、mermaid、3D 场景与回传事件循环。
- [omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) — 选中文字→批注→随消息发送，回复按批注逐条对照。
- [vlln/dsh-navbar](https://github.com/vlln/dsh-navbar) — 对话节点导航条，右缘节点串快速跳转 user 消息。
- [asukasec/dsh-message-preview](https://github.com/asukasec/dsh-message-preview) — 右侧用户消息导航条，根据消息数量与可用高度自适应排布导航块，并支持悬停预览、键盘操作与点击跳转。
- [vlln/dsh-task-status](https://github.com/vlln/dsh-task-status) — 后台任务状态条：对话页任务进度 + 实时输出 tail。
- [renat3u/dsh-web-archive](https://github.com/renat3u/dsh-web-archive) — 折叠对话中的 Think、Bash 等「无用消息」。
- [0xsline/dsh-spotlight](https://github.com/0xsline/dsh-spotlight) — 键盘优先的命令面板（command palette）。
- [bill9109/dsh-101](https://github.com/bill9109/dsh-101) — DSH 文档阅读模式。
- [bill9109/dsh-drag-and-drop](https://github.com/bill9109/dsh-drag-and-drop) — 跨平台文件拖拽与原始路径插入，无需复制文件。
- [l541402398/dsh-file-uploads](https://github.com/l541402398/dsh-file-uploads) — 从 Web 输入框上传任意本地文件，以待发送卡片展示，并在设置中管理已存文件。
- [qyw233/dsh-deeplink](https://github.com/qyw233/dsh-deeplink) — `?session=` / `?workspace=` 深链直达指定项目对话。
- [lehhair/dsh-diff-viewer](https://github.com/lehhair/dsh-diff-viewer) — PiUI 风格 diff 查看器，替换 write/edit 工具调用的默认 DiffBlock。
- [omdsh-dev/ex-setting](https://github.com/omdsh-dev/ex-setting) — DSH 的设置扩展。
- [omdsh-dev/web-components](https://github.com/omdsh-dev/web-components) — Web Components 支持。
- [vibeinging/dsh-turn-navigator](https://github.com/vibeinging/dsh-turn-navigator) — 对话轮次导航。
- [SnowCrescenter-tech/dsh-milestone](https://github.com/SnowCrescenter-tech/dsh-milestone) — 右侧圆点时间轴导航条，点击跳转到任意用户消息。
- [Ghost011118/dsh-balance-meter](https://github.com/Ghost011118/dsh-balance-meter) — 输入框 dock 显示 DeepSeek 账户余额与会话花费，自动拉取官方定价，支持高峰/低谷计价。
- [v587d/dsh-opencode-go-usage](https://github.com/v587d/dsh-opencode-go-usage) — 在输入框上方 dock 显示

OpenCode Go 订阅用量（5h 滚动/每周/每月窗口与重置倒计时），内置凭据编辑器。
- [Han-1413141/dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) — 会话与当日 API 费用统计、预算图框（已用%）、官方余额、历史看板，支持峰谷计价与官方价格一键同步。
- [fishxcode/dsh-plugin-deepseek-balance](https://github.com/fishxcode/dsh-plugin-deepseek-balance) — 在 DSH Web 设置中展示 DeepSeek API 余额、余额趋势与每日用量图表。
- [Sev7een/ds-api-usage](https://github.com/Sev7een/ds-api-usage) — 在设置页展示 DeepSeek API 余额与最近 24 小时用量，包括估算消费、Token、请求次数和按小时时间线。
- [nonewind/dsh-spend](https://github.com/nonewind/dsh-spend) — DSH Web 用量与费用统计插件：右下角悬浮窗，按模型/按天/按会话多维聚合与预计花费。
- [ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) — Claude Code 风格全屏终端 UI：像素鲸鱼顶栏、实时工作状态行、思考流式展开。
- [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) — 侧边栏完整工作台：内置文件渲染编辑、终端、Git 与子代理，支持三方插件注册新 Tab。
- [Han-1413141/dsh-sticky-disclosure](https://github.com/Han-1413141/dsh-sticky-disclosure) — 一键收起会话中所有展开的区块（Think、工具卡等），常驻计数按钮 + 自定义快捷键。
- [Meredith2328/dsh-sticky-note](https://github.com/Meredith2328/dsh-sticky-note) — 编辑框工具栏便签，随手记点子和 TODO，自动保存为 Markdown，一键发送到对话。
- [Luaphes/dsh-web-attention-badge](https://github.com/Luaphes/dsh-web-attention-badge) — 会话需要你时三处同时亮起：角标、标签页标题计数、按状态换色的鲸鱼 favicon。
- [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) — DSH Web UI 插件与皮肤合集：任务看板、git 图、右侧面板、远程移动端 UI、桌宠、实时 token 统计与皮肤中心。
- [Starfie1d1272/dsh-builtin-toggles](https://github.com/Starfie1d1272/dsh-builtin-toggles) — 为 DSH Web 添加官方内置插件目录、搜索与状态说明，并提供经过审核的安全 UI 插件开关。
- [jiangnanquan/dsh-ux](https://github.com/jiangnanquan/dsh-ux) — Solarized 浅色主题、紧凑布局、思考/工具链折叠胶囊，以及余额、本轮成本与用量看板的 DSH Web 界面增强插件。
- [a903067276-rgb/dsh-hud](https://github.com/a903067276-rgb/dsh-hud) — HUD 状态面板：Git 状态、MCP 服务器、技能列表、模型与 token 用量，悬浮侧栏一览无余。
- [wsxwj123/dsh-plugins#turn-scrubber](https://github.com/wsxwj123/dsh-plugins/tree/main/packages/turn-scrubber) — 右侧紧凑回合刻度条，悬停显示回合摘要，点击跳转到对应用户回合。
- [Sttrevens/dsh-cost-meter](https://github.com/Sttrevens/dsh-cost-meter) — Web UI 美元成本徽标：头部显示会话总成本、每条回复结尾显示该轮成本，悬停看分项。
- [a903067276-rgb/dsh-file-mentions](https://github.com/a903067276-rgb/dsh-file-mentions) — DSH 回复中的文件路径可点击：Codex 风格行内打开、文件管理器定位、回合尾部文件 chip 列表。
- [bobcat848/dsh-calculator](https://github.com/bobcat848/dsh-calculator) — 右侧面板展示 DeepSeek API 费用（当前会话 + 全部会话累计）与账户余额，内置官方计价与峰谷计价支持。

- [Jolly-J/dsh-deepseek-billing](https://github.com/Jolly-J/dsh-deepseek-billing) — 侧边栏底部 DeepSeek 账户余额显示与会话费用估算卡片。
- [AKIRACOD/dsh-drag-and-drop](https://github.com/AKIRACOD/dsh-drag-and-drop) — 拖放 fork：文档以可删除「文件芯片」挂在输入框上方，不打字也能发送。
- [GooodWei/context-vista](https://github.com/GooodWei/context-vista) — 右侧悬浮面板，环形图实时展示上下文 token 用量与费用。
- [dsh-paste-input](https://github.com/dsh-external/dsh-paste-input) — Ctrl+V 粘贴文件 / 拖拽 / 选择。
- [bpc-oss/dsh-web-billing](https://github.com/bpc-oss/dsh-web-billing) — 人民币/美元 token 计费，官方政策计价与逐条消息费用账本。
- [lqhl/dsh-pi-tui](https://github.com/lqhl/dsh-pi-tui) — 差分渲染 TUI 前端：流式 Markdown 与工具卡片。
- [dsh-web-panel](https://github.com/dsh-external/dsh-web-panel) — 内嵌终端 dock + Git Review + 文件视图。
- [CanglongCl/dsh-web-review](https://github.com/CanglongCl/dsh-web-review) — 隔离网页预览，通过元素批注指导源码修改。
- [yyyyukari/dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) — 创意工坊式插件浏览器：一键安装/更新/卸载。
- [Simon314620/dsh-turn-index](https://github.com/Simon314620/dsh-turn-index) — 轮次索引侧边栏，滚动时自动高亮当前轮次。
- [MysaDC/dsh-plugin-description](https://github.com/MysaDC/dsh-plugin-description) — 为 Web 设置页插件卡片补上中英文功能说明。
- [BeiZi6/dsh-opencodego-usage](https://github.com/BeiZi6/dsh-opencodego-usage) — OpenCodeGo 剩余额度监视器：输入框右下角呼吸指示灯（按剩余额度绿/黄/红），液态玻璃面板显示滚动/周/月用量窗口与重置时间，每 30 秒自动刷新，API Key 自动读取 DSH 凭据。
- [Lanxing6480/dsh-galgame](https://github.com/Lanxing6480/dsh-galgame) — DSH Web 聊天界面 GalGame 演出层：立绘差分、流式思考气泡、打字机对话框与 GalGame 式提问/审批选项框，可随时切回普通聊天。

### 🎭 主题与外观

- [KinGao294/dsh-skin](https://github.com/KinGao294/dsh-skin) — Codex 风格皮肤切换器 + 自定义壁纸层，可调透明度与模糊。
- [Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) — DSH Web 鲸鱼娘皮肤系列（深海女仆工坊 maid-atelier）。
- [wsxwj123/dsh-plugins#theme-gallery](https://github.com/wsxwj123/dsh-plugins/tree/main/packages/theme-gallery) — 15 个精选主题家族，浅深配色完整，跟随 DSH 原生浅色/深色/跟随系统模式。
- [dsh-skins](https://github.com/dsh-external/dsh-skins) — Web UI 皮肤。
- [BeiZi6/dsh-theme-plugin](https://github.com/BeiZi6/dsh-theme-plugin) — DSH Web GUI 主题工作室：5 套内置预设 + 完全可自定义的浅/深配色（强调色、背景、前景、UI 与代码字体、半透明侧栏、对比度），即时热切换并持久化到 localStorage。

### 💬 会话与消息

- [Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) — 对话回退：基于持久 Change Ledger 回滚会话与工作区状态。
- [Jesse-njx/dsh-crosstalk](https://github.com/Jesse-njx/dsh-crosstalk) — 跨会话消息：本机任意会话都可像 Claude Code 一样列出并互发消息，基于本地心跳注册表与收件箱。
- [hellodigua/dsh-share](https://github.com/hellodigua/dsh-share) — 一键分享你的对话。
- [Moeblack/dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) — 基于分支的消息编辑、reroll、重试与版本时间线。
- [Buyi-wsgzg/dsh-sidechain](https://github.com/Buyi-wsgzg/dsh-sidechain) — `/side` 持续性侧会话与 `/btw` 一次性侧问，在临时 fork 中运行、不写入主会话历史。
- [bill9109/dsh-conversation-share](https://github.com/bill9109/dsh-conversation-share) — 分享任意段落的对话。
- [yuezengwu/dsh-explain](https://github.com/yuezengwu/dsh-explain) — 本地优先学习模式：跨会话全局学习线程、按来源讲解。
- [Moeblack/dsh-prompt-studio](https://github.com/Moeblack/dsh-prompt-studio) — 带实时预览的用户/内置 system prompt 分节编辑器。
- [czm15053/dsh-peer-link](https://github.com/czm15053/dsh-peer-link) — 让 dsh 和 Claude Code 会话直接互发消息，附带可点击的会话列表卡片（搜索/刷新/弹窗发送）。
- [Nwflower/dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) — 把 Claude Code / Codex / ChatGPT / Cursor / Gemini / Reasonix / opencode 的聊天记录全保真导入为可续聊的 DSH 会话。
-