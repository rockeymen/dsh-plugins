[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/banner-zh.png)](https://awesome-dsh-plugin.com/zh/)

[English](README.md) | 中文

> [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）插件精选列表。

DeepSeek Harness 是 DeepSeek 开源的 agent harness——既是可直接运行的 Coding Agent（提供 Web 与 headless 两种形式），底层又是一套「一切皆插件」的框架：模型、工具、沙箱、会话存储、UI、乃至 Agent Loop 本身都是插件。插件既可以扩展官方 Coding Agent，也可以替换其核心部件，甚至组装出完全不同的东西。

本列表收录可通过 `dsh plugin add` 安装的社区插件（均声明了 `dsh.bundle` manifest）。欢迎 [PR](#贡献)。

> 🛒 **推荐安装 [dsh-market](https://github.com/dsh-market/dsh-market#readme)**（可选）——DeepSeek Harness 里的插件市场，本列表的插件都在里面。界面简单好上手，一键安装、升级插件，一键切换主题：

```sh
dsh plugin --profile web add dshmarket
```

> 💡 更喜欢对话式？装 [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin#readme)，想要什么插件直接问 agent（`dsh plugin --profile web add dsh-find-plugin`）。

> [!WARNING]
> 安装插件等于在你的机器上跑第三方代码，权限和你本人一样大——能读你的文件、用你的凭据、访问网络，工具审批管不到插件自己的代码。收录不等于做过安全审查：装之前先看一眼源码，不熟的插件尽量放在没有密钥、没有重要资料的环境里试。完整免责声明见页面底部。

## 插件

### 🎨 UI 增强

- [1624318455/dsh-plugin-tts](https://github.com/1624318455/dsh-plugin-tts) — 用免费 Edge TTS 朗读 AI 回复：消息朗读按钮、自动朗读开关与语音设置面板。
- [x2802490130-prog/dsh-client-ui-writing](https://github.com/x2802490130-prog/dsh-client-ui-writing) — Web 客户端「写作」面板：项目分卷与统计、书库与全文检索、设定演化版本链 diff、线索 SVG 图谱，仅在写作预设会话显示。
- [badai147/dsh-global-rules](https://github.com/badai147/dsh-global-rules) — 在设置面板中编辑 ~/.dsh/AGENTS.md 全局规则，保存后实时生效。
- [AcidGr/dsh-web-mobile-fix](https://github.com/AcidGr/dsh-web-mobile-fix) — Web UI 移动端布局修复：窄屏下设置面板全屏化、插件导航单行排满、侧边栏全屏、弹层居中、会话日志按钮图标化。
- [mexiaosqwq/dsh-web-mobile](https://github.com/mexiaosqwq/dsh-web-mobile) — DSH Web UI 移动端适配：窄屏下侧边栏变为贴合内容的 overlay 抽屉、会话独占全宽，设置面板改为近全宽 sheet。

- [AcidGr/dsh-web-lan-access](https://github.com/AcidGr/dsh-web-lan-access) — Web UI 局域网/远程访问：为纯 HTTP 非安全上下文注入 crypto.randomUUID polyfill，局域网/Tailscale IP 直连时前端不再崩溃。

- [Bernardxu123/dsh-mobile-gate](https://github.com/Bernardxu123/dsh-mobile-gate) — 局域网手机访问网关：独立子进程反向代理 + 首次访问审批 + 设备令牌绑定 + 限流 + 手机端紧凑排版注入（输入区权限/模型小胶囊、randomUUID polyfill）。

- [Noob-stupid/dsh-plugin-hub](https://github.com/Noob-stupid/dsh-plugin-hub) — 插件管理面板：已安装插件一键启用/停用，内置 GitHub dsh-plugin 插件市场，支持详情查看与一键安装。

- [Make0209/dsh-usage-stats](https://github.com/Make0209/dsh-usage-stats) — GitHub 风格用量热力图看板：按工作区统计使用次数与 Token 花费（含缓存命中率）、DeepSeek 账户余额查询、工作区别名管理。
- [Ychris12138/dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) — 多供应商用量看板：按供应商/模型统计 Token 与日期下钻，统一展示账户余额，并追踪 OpenCode Go / Z.ai 订阅额度。
- [V-dev-388/dsh-usage-meter](https://github.com/V-dev-388/dsh-usage-meter) — 设置页用量仪表盘：按服务商/模型汇总全部会话 token 用量，含今日/近 7 天/近 30 天趋势柱状图与缓存命中率。
- [zoumutou/dsh-cost-balance](https://github.com/zoumutou/dsh-cost-balance) — 输入框下方的 iOS 风格统计条：一键展开查看会话花费、DeepSeek 账户余额、缓存命中率与 Token 用量。

- [bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context) — 上下文洞察面板：一眼看清模型上下文窗口的组成与变化——构成对照窗口大小、按请求历史趋势、压缩/注入事件、消息级 token 统计。

- [wjy9902/dsh-web-default-session](https://github.com/wjy9902/dsh-web-default-session) — 点「新会话」默认打开绑定宿主启动目录的「默认目录」工作区（无需选文件夹），工作区选择菜单中也可选该项。

- [Fishsb/dsh-prompt-enhancer](https://github.com/Fishsb/dsh-prompt-enhancer) — 一键提示词增强：独立 LLM 调用把模糊草稿改写为更强的提示词，不满意可撤回。

- [huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) — DeepSeek Harness 的终端 UI（TUI）。

- [openma-ai/deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) — Rust/ratatui 终端客户端，直接使用 DSH SDK JSON-RPC 协议，支持独立运行或作为 profile bundle 加载。

- [WhitePlusMS/dsh-input-plus](https://github.com/WhitePlusMS/dsh-input-plus) — 在组合框中使用 `@` 搜索并插入工作区文件和目录路径，并通过 `/h` 菜单复用当前会话的问题。
- [omdsh-dev/dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) — Codex 风格的 `@file` 文件引用，输入框里直接搜索并引用工作区文件。
- [alingalingling/ui-status-label](https://github.com/alingalingling/ui-status-label) — 把鲸鱼娘思考时的 "deep diving" 状态文案自定义成任意你想要的样子。
- [LeemanCheung/dsh-whale-animation](https://github.com/LeemanCheung/dsh-whale-animation) — DSH Web 状态文字旁的持久化黑色鲸鱼深潜动画，提供减少动态效果回退与无缝闭环。
- [01Virex/dsh-status-rotator](https://github.com/01Virex/dsh-status-rotator) — 把回合状态那句 "Deep diving..." 替换成更有梗的自定义文案，按阶段轮换，支持打字机与流动渐变。
- [ZSeven-W/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) — OpenPencil 设计预览与编辑插件。
- [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) — 对话内生成式 UI：模型把交互式 HTML 卡片直接画进会话流，带流式预览与沙箱渲染。
- [ccq1/dsh-side-panel](https://github.com/ccq1/dsh-side-panel) — 侧边栏集成文件浏览器、终端和 Git 审查，方便预览文件。
- [openAGFS/dsh-agfs](https://github.com/openAGFS/dsh-agfs) — 文件浏览器 Web 应用：React 前端与 REST API 由宿主 webserver 托管，/dsh-agfs 命令自动定位当前工作区，附 browse_files 模型工具。
- [dingyi222666/dsh-focus-chat](https://github.com/dingyi222666/dsh-focus-chat) — 「聚焦会话」精简视图，只关注最终产出结果。
- [omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui) — 助手回复内渲染交互式 UI 组件：布局、图表、表单、测验、mermaid、3D 场景与回传事件循环。
- [omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) — 选中文字→批注→随消息发送，回复按批注逐条对照。
- [vlln/dsh-navbar](https://github.com/vlln/dsh-navbar) — 对话节点导航条，右缘节点串快速跳转 user 消息。
- [asukasec/dsh-message-preview](https://github.com/asukasec/dsh-message-preview) — 右侧用户消息导航条，根据消息数量与可用高度自适应排布导航块，并支持悬停预览、键盘操作与点击跳转。
- [jjxjjjjiik-bot/dsh-chat-timeline](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline) — 1:1 复刻 DeepSeek 官网右侧对话导航栏（ScrollNav）：悬停展开面板、阅读位置高亮、点击跳转。
- [vlln/dsh-task-status](https://github.com/vlln/dsh-task-status) — 后台任务状态条：对话页任务进度 + 实时输出 tail。
- [Nanki-nn/dsh-answer-pet](https://github.com/Nanki-nn/dsh-answer-pet) — 蓝鲸桌面宠物：按会话实时展示回答进度、模型动作与工具调用轨迹、token、输出速率与耗时，并支持多会话状态卡片展开和收起。
- [renat3u/dsh-web-archive](https://github.com/renat3u/dsh-web-archive) — 折叠对话中的 Think、Bash 等「无用消息」。
- [0xsline/dsh-spotlight](https://github.com/0xsline/dsh-spotlight) — 键盘优先的命令面板（command palette）。
- [GooodWei/arcana](https://github.com/GooodWei/arcana) — DeepSeek Harness 的悬浮命令甲板：把所有斜杠命令列成可执行按钮，悬停看介绍，按使用次数排序。
- [GooodWei/context-vista](https://github.com/GooodWei/context-vista) — 为 DeepSeek Harness 提供右侧悬浮栏以及 /context 命令，用环形图实时展示当前上下文 token 用量与分配及消费估算。
- [bill9109/dsh-101](https://github.com/bill9109/dsh-101) — DSH 文档阅读模式。
- [bill9109/dsh-drag-and-drop](https://github.com/bill9109/dsh-drag-and-drop) — 跨平台文件拖拽与原始路径插入，无需复制文件。
- [GLFzr/dsh-drop-file-to-path](https://github.com/GLFzr/dsh-drop-file-to-path) — Codex 式拖拽：把任意文件拖入 DSH Web 界面，文件存入 ~/.dsh-dropbox，路径以整块蓝色 chip 插入输入框。
- [taxueseek/dsh-files](https://github.com/taxueseek/dsh-files) — 文件上传（彩色附件卡片、会话隔离存储、sha256 去重、TTL 清扫）+ 内容嗅探的 read_document 文档读取（PDF/DOCX/XLSX/TXT）。
- [l541402398/dsh-file-uploads](https://github.com/l541402398/dsh-file-uploads) — 从 Web 输入框上传任意本地文件，以待发送卡片展示，并在设置中管理已存文件。
- [qyw233/dsh-deeplink](https://github.com/qyw233/dsh-deeplink) — `?session=` / `?workspace=` 深链直达指定项目对话。
- [lehhair/dsh-diff-viewer](https://github.com/lehhair/dsh-diff-viewer) — PiUI 风格 diff 查看器，替换 write/edit 工具调用的默认 DiffBlock。
- [omdsh-dev/ex-setting](https://github.com/omdsh-dev/ex-setting) — DSH 的设置扩展。
- [omdsh-dev/web-components](https://github.com/omdsh-dev/web-components) — Web Components 支持。
- [vibeinging/dsh-turn-navigator](https://github.com/vibeinging/dsh-turn-navigator) — 对话轮次导航。
- [SnowCrescenter-tech/dsh-milestone](https://github.com/SnowCrescenter-tech/dsh-milestone) — 右侧圆点时间轴导航条，点击跳转到任意用户消息。
- [Ghost011118/dsh-balance-meter](https://github.com/Ghost011118/dsh-balance-meter) — 输入框 dock 显示 DeepSeek 账户余额与会话花费，自动拉取官方定价，支持高峰/低谷计价。
- [v587d/dsh-opencode-go-usage](https://github.com/v587d/dsh-opencode-go-usage) — 在输入框上方 dock 显示 OpenCode Go 订阅用量（5h 滚动/每周/每月窗口与重置倒计时），内置凭据编辑器。
- [GLFzr/dsh-opencode-go-quota](https://github.com/GLFzr/dsh-opencode-go-quota) — 模型选择器左侧的 OpenCode Go 额度圆环：点击循环切换 5 小时/每周/每月用量窗口，按紧急程度着色（绿/蓝/橙/红），悬停显示百分比与重置倒计时。
- [Han-1413141/dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) — 会话与当日 API 费用统计、预算图框（已用%）、官方余额、历史看板，支持峰谷计价与官方价格一键同步。
- [fishxcode/dsh-plugin-deepseek-balance](https://github.com/fishxcode/dsh-plugin-deepseek-balance) — 在 DSH Web 设置中展示 DeepSeek API 余额、余额趋势与每日用量图表。
- [Sev7een/ds-api-usage](https://github.com/Sev7een/ds-api-usage) — 在设置页展示 DeepSeek API 余额与最近 24 小时用量，包括估算消费、Token、请求次数和按小时时间线。
- [nonewind/dsh-spend](https://github.com/nonewind/dsh-spend) — DSH Web 用量与费用统计插件：右下角悬浮窗，按模型/按天/按会话多维聚合与预计花费。
- [stevenx65/dsh-balance-plugin](https://github.com/stevenx65/dsh-balance-plugin) — dsh 网页侧边栏的 DeepSeek 余额与 token 用量监控：今日/累计切换，并按 provider 过滤其他厂商。
- [LemCAE/dsh-balance](https://github.com/LemCAE/dsh-balance) — 顶栏徽章与设置卡片展示 DeepSeek 账户余额与当前会话预估花费：暂停感知的自动刷新、可编辑官方价格表、`deepseek_balance` 模型工具与中英文界面。
- [huanyuLv/dsh-balance-tide](https://github.com/huanyuLv/dsh-balance-tide) — 输入框下方显示 DeepSeek 账户余额与本会话花费，余额前带峰/谷价格徽章（北京时间）与距切换倒计时，悬停看两档单价明细与使用建议。
- [ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) — Claude Code 风格全屏终端 UI：像素鲸鱼顶栏、实时工作状态行、思考流式展开。
- [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) — 侧边栏完整工作台：内置文件渲染编辑、终端、Git 与子代理，支持三方插件注册新 Tab。
- [tsonglew/dsh-workspace-search](https://github.com/tsonglew/dsh-workspace-search) — VS Code 式工作区关键词搜索 Tab（better-sidebar 扩展）：同时匹配文件名与文件内容，结果按文件分组带行号，点击在侧栏编辑器打开。
- [tsonglew/dsh-media-preview](https://github.com/tsonglew/dsh-media-preview) — better-sidebar 音视频预览器：原生播放器内联播放 mp4/webm/mkv/mov 等视频与 mp3/flac/wav 等音频，自带支持 HTTP Range 拖动的流式媒体路由。
- [Han-1413141/dsh-sticky-disclosure](https://github.com/Han-1413141/dsh-sticky-disclosure) — 一键收起会话中所有展开的区块（Think、工具卡等），常驻计数按钮 + 自定义快捷键。
- [Meredith2328/dsh-sticky-note](https://github.com/Meredith2328/dsh-sticky-note) — 编辑框工具栏便签，随手记点子和 TODO，自动保存为 Markdown，一键发送到对话。
- [Luaphes/dsh-web-attention-badge](https://github.com/Luaphes/dsh-web-attention-badge) — 会话需要你时三处同时亮起：角标、标签页标题计数、按状态换色的鲸鱼 favicon。
- [zhu1090093659/dsh-web-ui#packages/dsh-web-ui-all](https://github.com/zhu1090093659/dsh-web-ui/tree/main/packages/dsh-web-ui-all) — DSH Web UI 插件与皮肤合集：任务看板、git 图、右侧面板、远程移动端 UI、桌宠、实时 token 统计与皮肤中心。
- [zealot00/dsh-pet](https://github.com/zealot00/dsh-pet) — DSH Web UI 桌面宠物：精灵图动画、agent 状态联动、拖拽、闹钟（每天/一次）与番茄钟，皮肤下拉选择 + 预览。
- [sereinmono/dsh-desktop-pet](https://github.com/sereinmono/dsh-desktop-pet) — DeepSeek Harness 桌面宠物：完全支持 Codex 桌宠格式，可使用 hatch-pet Skill 创建宠物，或通过 Petdex 导入宠物。
- [Starfie1d1272/dsh-builtin-toggles](https://github.com/Starfie1d1272/dsh-builtin-toggles) — 为 DSH Web 添加官方内置插件目录、搜索与状态说明，并提供经过审核的安全 UI 插件开关。
- [jiangnanquan/dsh-ux](https://github.com/jiangnanquan/dsh-ux) — Solarized 浅色主题、紧凑布局、思考/工具链折叠胶囊，以及余额、本轮成本与用量看板的 DSH Web 界面增强插件。
- [a903067276-rgb/dsh-hud](https://github.com/a903067276-rgb/dsh-hud) — HUD 状态面板：Git 状态、MCP 服务器、技能列表、模型与 token 用量，悬浮侧栏一览无余。
- [wsxwj123/dsh-plugins#turn-scrubber](https://github.com/wsxwj123/dsh-plugins/tree/main/packages/turn-scrubber) — 右侧紧凑回合刻度条，悬停显示回合摘要，点击跳转到对应用户回合。
- [Sttrevens/dsh-cost-meter](https://github.com/Sttrevens/dsh-cost-meter) — Web UI 美元成本徽标：头部显示会话总成本、每条回复结尾显示该轮成本，悬停看分项。
- [a903067276-rgb/dsh-file-mentions](https://github.com/a903067276-rgb/dsh-file-mentions) — DSH 回复中的文件路径可点击：Codex 风格行内打开、文件管理器定位、回合尾部文件 chip 列表。
- [bobcat848/dsh-calculator](https://github.com/bobcat848/dsh-calculator) — 右侧面板展示 DeepSeek API 费用（当前会话 + 全部会话累计）与账户余额，内置官方计价与峰谷计价支持。

- [Jolly-J/dsh-deepseek-billing](https://github.com/Jolly-J/dsh-deepseek-billing) — 侧边栏底部 DeepSeek 账户余额显示与会话费用估算卡片。
- [AKIRACOD/dsh-drag-and-drop](https://github.com/AKIRACOD/dsh-drag-and-drop) — 拖放 fork：文档以可删除「文件芯片」挂在输入框上方，不打字也能发送。
- [HsiangNianian/dsh-auto-continue](https://github.com/HsiangNianian/dsh-auto-continue) — DSH Web 请求中断自动续跑：网络、超时或宿主崩溃等非人为失败后自动发送「继续」，支持错误分类、自适应退避、模板化继续文本与浏览器通知。
- [liliuCourier/dsh-chat-outline](https://github.com/liliuCourier/dsh-chat-outline) — 对话栏左侧常驻大纲：按轮次列出提问与最后回复，支持关键词过滤与一键跳转。
- [LaoYueHanNi/dsh-token-usage](https://github.com/LaoYueHanNi/dsh-token-usage) — 按请求持久化模型 token 用量，Web 设置「Token 用量」统计页：按日趋势图、按模型明细表、日期/模型筛选。
- [QT-Chen/dsh-mic-input](https://github.com/QT-Chen/dsh-mic-input) — 输入框麦克风语音输入：浏览器 Web Speech API 实时转写，自动去重/续听、智能标点，支持语言与自动发送设置。
- [LeemanCheung/dsh-task-dag](https://github.com/LeemanCheung/dsh-task-dag) — 将会话子代理与持久工作流运行展示为实时 DAG，支持状态展示、节点导航与重启后历史恢复。
- [MorGogh/widget-dock](https://github.com/MorGogh/widget-dock) — 对话两侧空白区的可拖动卡片工作台：余额、Token 用量、会话统计、目标、成本估算等小组件，支持 S/M/L/XL 尺寸档位与官方定价成本估算。
- [qjcnmd/dsh-reasoning-slider](https://github.com/qjcnmd/dsh-reasoning-slider) — Codex 风格推理等级滑块，内嵌于模型选择器，拖动切换推理档位。
- [Semidia/dsh-sampling-sliders](https://github.com/Semidia/dsh-sampling-sliders) — 对话输入区的模型采样滑杆（temperature / maxTokens）：通过 agent/request 钩子对所有供应商的每次请求生效，支持热调/持久化两种模式。
- [causebefore/dsh-pomodoro](https://github.com/causebefore/dsh-pomodoro) — DSH Web 番茄钟：提供可配置专注/休息循环、可拖动迷你面板，以及站内提醒、提示音和浏览器通知。

- [siberiah2o/dsh-plugin-terminal](https://github.com/siberiah2o/dsh-plugin-terminal) — 底部多标签终端面板（node-pty + xterm.js）：贴底全宽，输入框始终在终端上方。
- [urzeye/dsh-outline](https://github.com/urzeye/dsh-outline) — DSH Web 会话页实时大纲面板：「用户问题 + Markdown 标题（1~6 级）」大纲树，流式生成时实时更新，点击节点滚动定位并高亮，支持展开深度调节、搜索与会话级收藏。
- [283Gawin/dsh-heatmap](https://github.com/283Gawin/dsh-heatmap) — DSH Web 侧边栏活动热力图：GitHub 风格网格展示每日提交、Token 用量与估算花费，今日统计行显示全会话 Token 总量、缓存命中率与按模型自动计价的花费。
- [Max-Samson/dsh-usage-chart](https://github.com/Max-Samson/dsh-usage-chart) — 输入框下方的用量/成本/余额仪表盘：实时指标指示器 + 零依赖 SVG 用量图表，按轮次统计用量、估算成本并实时查询 DeepSeek 账户余额。
- [RAFOLIE/dsh-desktop-windowos#plugin](https://github.com/RAFOLIE/dsh-desktop-windowos/tree/main/plugin) — DSH 的 Windows 托盘桌面壳：自动从 GitHub Releases 安装 exe、创建桌面快捷方式，并提供 desktop_launch 工具在对话中一键启动。
- [ZichengGurrr/dsh-window#plugin](https://github.com/ZichengGurrr/dsh-window/tree/main/plugin) — DSH 的 Windows 原生窗口（WebView2）：一键安装，自动从 GitHub Releases 下载应用 zip、创建桌面快捷方式，并提供 desktop_launch 工具在对话中一键启动。
- [yyyyukari/dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) — 创意工坊式插件浏览器：侧栏常驻入口，搜索/最热/最新/近 7-90 天飙升榜、中文关键词映射、描述与 README 机翻、插件特征验证过滤、一键安装/更新。
- [zoumutou/dsh-web-preview](https://github.com/zoumutou/dsh-web-preview) — 侧边网页预览面板：本地静态托管、Markdown/代码/图片预览、非静态项目一键运行（Cargo/npm/Go/Python）实时日志、网页元素标记批注、链接点击接管到侧边预览。
- [FengHuoLinShan/dsh-plugin-llm-balance](https://github.com/FengHuoLinShan/dsh-plugin-llm-balance) — 可拖动的 API 余额/配额悬浮卡片：自动显示最近使用的 provider 余额/配额（DeepSeek/Moonshot/Kimi For Coding），按余额分档变色、实时刷新。
- [x2802490130-prog/dsh-balance-float](https://github.com/x2802490130-prog/dsh-balance-float) — Web UI 右上角悬浮窗：实时显示 DeepSeek 余额，支持手动刷新与一键优雅退出（Y/N 快捷键确认）。
- [Semidia/dsh-session-manager](https://github.com/Semidia/dsh-session-manager) — 会话行右键菜单与侧边栏会话管理：置顶、重命名、归档、分叉、导出、复制工作目录/会话 ID/深链，在资源管理器或新窗口打开。
- [x2802490130-prog/dsh-lan-pass](https://github.com/x2802490130-prog/dsh-lan-pass) — Web UI 局域网密码门禁：同网手机/平板输共享密钥登录，会话与电脑实时同步，内置 randomUUID polyfill。
- [magicOF2/dsh-turn-marks](https://github.com/magicOF2/dsh-turn-marks) — 会话左侧消息标记条：每发一条消息多一根条条，点击跳转到该消息、悬停预览内容，当前消息对应的条条变白。
- [magicOF2/dsh-chat-width-customizer](https://github.com/magicOF2/dsh-chat-width-customizer) — 会话标题栏按钮循环切换对话宽度（748–1600px），消息区、输入框、用户气泡同步加宽。
- [luokai-demo/dsh-plugins#plugins/dsh-balance-plugin](https://github.com/luokai-demo/dsh-plugins/tree/main/plugins/dsh-balance-plugin) — 侧边栏底部的 DeepSeek 钱包余额：信用卡图标配余额数字，按剩余额度着色（≥ ¥2 绿色、¥0–2 黄色、≤ ¥0 红色），挂载时、每轮对话结束和点击时刷新；余额变动时带符号差额上飘淡出。
- [Ceelog/dsh-plugins#dsh-plugin-setting-mcp](https://github.com/Ceelog/dsh-plugins/tree/main/src/plugins/dsh-plugin-setting-mcp) — 在 Web 设置面板中查看、添加、编辑、删除、启用或停用 MCP 服务器，保存后热重载。
- [BeiZi6/dsh-opencodego-usage](https://github.com/BeiZi6/dsh-opencodego-usage) — OpenCodeGo 剩余额度监视器：输入框右下角呼吸指示灯（按剩余额度绿/黄/红），液态玻璃面板显示滚动/周/月用量窗口与重置时间，每 30 秒自动刷新，API Key 自动读取 DSH 凭据。
- [SpookySandwich/dsh-smooth-stream](https://github.com/SpookySandwich/dsh-smooth-stream) — 给 DeepSeek Harness 加入更好的流式文字动画。
- [ook826092-cloud/dsh-mobile-css](https://github.com/ook826092-cloud/dsh-mobile-css) — DSH Web UI 移动端适配：紧凑排版、全宽输入卡（含光标修复）、抽屉式侧边栏（点击遮罩关闭）、两页式设置流程、响应式表格与统计、安全触控目标。
### 🎭 主题与外观

- [KinGao294/dsh-skin](https://github.com/KinGao294/dsh-skin) — Codex 风格皮肤切换器 + 自定义壁纸层，可调透明度与模糊。
- [Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) — DSH Web 鲸鱼娘皮肤系列（深海女仆工坊 maid-atelier）。
- [wsxwj123/dsh-plugins#theme-gallery](https://github.com/wsxwj123/dsh-plugins/tree/main/packages/theme-gallery) — 15 个精选主题家族，浅深配色完整，跟随 DSH 原生浅色/深色/跟随系统模式。
- [PAKIKNOWLEDGE/dsh-client-ui-skin-claude](https://github.com/PAKIKNOWLEDGE/dsh-client-ui-skin-claude) — Claude 风格皮肤：暖黑画布、陶橙点缀、衬线 UI，跟随原生亮/暗主题。
- [tianyhjg-lab/dsh-font](https://github.com/tianyhjg-lab/dsh-font) — DSH Web GUI 字体切换器：99 个界面字体与 31 个代码字体，中西文自动搭配，即选即生效，localStorage 持久化。
- [starslittle/dsh-blue-whale](https://github.com/starslittle/dsh-blue-whale) — 复刻 DeepSeek Chat 蓝鲸配色的皮肤：主色 #4D6BFE，亮色/深色跟随系统外观。
- [chinaRXQ/dsh-wallpaper](https://github.com/chinaRXQ/dsh-wallpaper) — DSH Web 壁纸皮肤：图片背景，可调透明度、压暗遮罩与模糊。
- [SamizuHM/dsh-client-ui-theme-xp](https://github.com/SamizuHM/dsh-client-ui-theme-xp) — Windows XP Luna 桌面化主题：浮动窗口管理器（任务栏、桌面图标）加上还原度很高的 Luna 皮肤。
- [Tommy00748/dsh-theme-cyberpunk2077](https://github.com/Tommy00748/dsh-theme-cyberpunk2077) — Cyberpunk 2077 / 夜之城主题：NC 黄 × 霓虹青配色、CRT 扫描线、Kiroshi 悬停锁定、战斗状态 HUD、合成打字机与消息音效，以及隐藏彩蛋（relic / johnny）。
- [Tkingxiao/dsh-any-background](https://github.com/Tkingxiao/dsh-any-background) — 自定义外观插件：换背景图（可调大小和位置）、用色轮自定义主题色，主界面和设置界面的透明度都能单独调。
- [BeiZi6/dsh-theme-plugin](https://github.com/BeiZi6/dsh-theme-plugin) — DSH Web GUI 主题工作室：5 套内置预设 + 完全可自定义的浅/深配色（强调色、背景、前景、UI 与代码字体、半透明侧栏、对比度），即时热切换并持久化到 localStorage。

- [zhijun-dai/Catppuccin-dsh-theme](https://github.com/zhijun-dai/Catppuccin-dsh-theme) — Catppuccin 主题插件：为 DSH Web 主题运行时提供 Latte、Frappé、Macchiato、Mocha 四套皮肤。
- [zhijun-dai/Solarized-dsh-theme](https://github.com/zhijun-dai/Solarized-dsh-theme) — Solarized 与 Selenized 主题插件：向 DSH Web 主题运行时注册四套忠实色板。

### 💬 会话与消息

- [fredalxin/dsh-solo-thinking](https://github.com/fredalxin/dsh-solo-thinking) — 可视化分支头脑风暴：为每个方向创建独立 Session，自动处理父子继承、兄弟感知、进展与回传 Handoff，并提供完整树形 Tab 与可选 Better Sidebar 右栏。
- [ishuowang/dsh-agent-team-room](https://github.com/ishuowang/dsh-agent-team-room) — 面向独立 DSH Agent 会话的持久化协作房间，支持显式成员管理、定向与广播消息、任务跟踪和共享 Web 时间线。
- [cindyguyuehu123/dsh-webchatlike](https://github.com/cindyguyuehu123/dsh-webchatlike) — 更贴近 deepseek 网页版/App 的聊天体验：原位编辑提问、重新生成回复、每条消息带  版本翻页器（树状版本模型，跨对话保持稳定）。
- [penguin-oo/dsh-bookmarks](https://github.com/penguin-oo/dsh-bookmarks) — 收藏 AI 回复（备注/标签），跨会话收藏中心（搜索/筛选/跳回会话），一键导出 Markdown。

- [An