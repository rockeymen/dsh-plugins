![Awesome DeepSeek Harness](assets/banner.jpg)

# Awesome DeepSeek Harness [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

	DeepSeek Harness (DSH) 生态精选：插件、工具与基建（数据源：dsh-external/hub catalog + GitHub 公开 dsh-plugin Topic）。

> 注意：GitHub 的 [`dsh-plugin` Topic](https://github.com/topics/dsh-plugin) 是公开的；部分 `dsh-external` 仓库链接仍可能需要组织访问权限。

## Install

先安装 Node.js，再运行官方运行时：

```sh
npx @deepseek-ai/dsh web
```

安装外部 profile bundle 前，确保 `pnpm` 已在 `PATH` 中：

```sh
dsh plugin --profile web add "github:owner/repo#ref"
```

`dsh plugin` 会把包管理操作转发给 pnpm，因此支持 npm、Git/GitHub、本地路径、`file:` 和 `link:` 包规格。只有声明了 `dsh.bundle.patch` 的包才会成为 active profile layer；普通依赖会安装但不会激活。安装或更新 bundle 后，重启 `dsh --profile web`。

旧的 `&path:` 子路径写法和 Repository Plugin 安装方式已不属于当前官方 bundle 流程；请使用声明了 `dsh.bundle.patch` 的可安装包。

管理面板：设置 → 「插件」。

## Core

- [dsh-deepresearch](https://github.com/dsh-external/dsh-deepresearch) - deepresearch 插件（cordis）。
- [dsh-plan-execute](https://github.com/dsh-external/dsh-plan-execute) - plan/execute 双模型路由：规划模型思考、执行模型干活
- [dsh-toolkit](https://github.com/dsh-external/dsh-toolkit) - 零依赖工具套件（calculator/csv/diff/encoding/json/markdown/regex/time）
- [dsh-deep-research](https://github.com/dsh-external/dsh-deep-research) - 自适应深度研究编排器（workflow 引擎）
- [dsh-101](https://github.com/dsh-external/dsh-101) - DSH 文档阅读模式
- [dsh-client-ui-plan-execute](https://github.com/dsh-external/dsh-client-ui-plan-execute) - Web 设置页「规划/执行模型」配置行

- [dsh_workflow](https://github.com/dsh-external/dsh_workflow) - Dynamic Workflow for dsh（占位）。
- [dsh-equip-engine](https://github.com/wuykjl/dsh-equip-engine) - 任务驱动插件配装引擎：双路检索（人工精选规则 + LLM 语义）、组合评分（协同/冲突/成本/信任）、冲突检测与安装命令导出。

## Agents & Orchestration

- [dsh-collaboration](https://github.com/Socialist-Sister/dsh-collaboration) - 多智能体协同套件：用户可配置的专家名册 + 持久专家实例（可多分身）按需雇佣、星型拓扑追问/中转、团队状态面板、模型对比与多模态视觉桥。
- [dsh-plans](https://github.com/Optim-Agent/dsh-plans) - 计划先行 Agent 预设：把仓库变更调研沉淀为 dsh-plans/ 下可追溯的 Markdown 计划，经 reviewer/criticizer 子代理多轮打磨，再作为 DSH goal 按验证清单执行。
- [dsh-agent-team-gui](https://github.com/toolclub/agent_team_gui) - 可复用 Agent 小队：每个成员独立配置 provider/model 路由与工具策略，支持串行/并行派单、spawn/fork/chain 上下文模式和 Web 管理面板。

## Context & Search

- [dsh-context](https://github.com/bowenliang123/dsh-context) - 上下文洞察面板：一眼看清模型上下文窗口的组成与变化——构成对照窗口大小、按请求历史趋势、压缩/注入事件、消息级 token 统计。
- [dsh-bookmarks](https://github.com/penguin-oo/dsh-bookmarks) - 收藏已定稿的 AI 回复（备注/标签），跨会话收藏中心支持搜索、标签筛选、跳回会话与一键导出 Markdown（Alt+B 开关面板）。
- [context-vista](https://github.com/GooodWei/context-vista) - 为 DeepSeek Harness 提供右侧悬浮栏以及 /context 命令，用环形图实时展示当前上下文 token 用量与分配及消费估算
- [dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) - 看清模型每个请求到底背着多少上下文：指令链/技能目录/工具 schema 的 token 成本逐项量化，自动检测重复与冲突，给出可执行裁剪建议（Web 圆环面板 + context_audit 工具，全程只读）。
- [dsh-mcp-lens](https://github.com/labmimors/dsh-mcp-lens) - 渐进披露 MCP 网关：通过两个稳定入口检索大型远程工具目录，再用精确 schema 调用选中工具，并采用惰性连接与有界缓存。
- [dsh-cot-summary](https://github.com/dsh-external/dsh-cot-summary) - 外置 Summary-CoT 插件工作区。
- [dsh-explain](https://github.com/dsh-external/dsh-explain) - 学习模式插件，解释 agent 的每一步（WIP）。
- [dsh-file-mount](https://github.com/acefun29/dsh-file-mount) - 文件增量挂载与重复读取去重：已挂载行范围不重复进上下文，磁盘变化自动失效重挂，附「挂载文件」标签页与 token 节省统计。
- [dsh-learn-everything](https://github.com/cendaifeng/dsh-learn-everything) - 费曼学习法插件：讲解 → 复述 → 判定 → 回讲教学闭环，富 HTML 教学卡片（mermaid 图 + shiki 代码高亮）。
- [dsh-memory-vault](https://github.com/flymysql/dsh-memory) - 跨会话记忆库：memory_remember / memory_recall / memory_forget 三工具，最新条目自动注入系统提示词，设置页（记忆库 / Memory）管理。
- [dsh-session-search](https://github.com/dsh-external/dsh-session-search) - 跨 dsh/Codex/Claude Code/pi/OpenCode 会话只读搜索，无索引
- [cross-harness-cite](https://github.com/dsh-external/cross-harness-cite) - 跨 harness 引用历史对话
- [task-passport](https://github.com/dongsheng123132/task-passport) - 通过机器可读检查点与乐观锁，在 DeepSeek Harness、WorkBuddy、Claude Code 和 Codex 之间交接持久任务状态。
- [dsh-session-cluster](https://github.com/dsh-external/dsh-session-cluster) - 会话聚类
- [session-chatlog](https://github.com/dsh-external/session-chatlog) - 会话聊天记录
- [dsh-memoria](https://github.com/jiayan-xu/dsh-memoria) - Memoria 记忆后端：为 dsh agent 提供 observe/remember/search/recall 四个工具，支持向量+图记忆、命名空间隔离、自动写入与配置热重载。
- [dsh-memory-evolve](https://github.com/dsh-external/dsh-memory-evolve) - 跨会话长期记忆 + 后台自我进化（五轨记忆/Git 分支感知/技能进化）
- [dsh-memory-gate](https://github.com/GIT121995/dsh-memory-gate) - 有界本地长期记忆：CBDC（Claim→Belief→Decision→Consumption）权威门控 + SQLite/FTS5，检索到≠注入，use/verify/ignore 可解释决策与完整审计，/memory 命令管理，每次最多注入 3 条 1200 字符，不增加模型调用。
- [dsh-engram-relay](https://github.com/dsh-external/dsh-engram-relay) - 内置 <1B 模型实现 100k 等效长记忆，因果图精准唤醒
- [dsh-mneme](https://github.com/modusensus/dsh-mneme) - 跨会话记忆且主权归用户：SQLite + 可人工编辑的 Markdown 双写、autoDream 后台记忆巩固、完全离线语义检索（本地向量 / 精排 / 聚类）、198 个测试护航。
- [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) - Mnemon 驱动的本地记忆系统：三层记忆（运行时热记忆/项目档案 Documents/长期记忆体 Memory Spaces），受监督写回、检索工具与 Web UI
- [zotero-harvest](https://github.com/dsh-external/zotero-harvest) - Zotero 文献库接入
- [url-manager](https://github.com/Piccolo123/url-manager) - Agent 先行链接收藏与知识管理：从任意平台保存链接，自动分类/打标签，全文搜索，共享分类，并以魔法链接卡片交付结果。零配置——Agent 首次使用自动注册。
- [url-manager-mcp](https://github.com/Piccolo123/url-manager-mcp) - url-manager 的 MCP 服务端：21 个工具（mcp__url_manager__*），支持收藏/搜索/分类/共享与魔法链接交付，支持 stdio 与 streamable-http。
- [zotero-wave-rag](https://github.com/dsh-external/zotero-wave-rag) - Zotero RAG 检索
- [dsh-data-agent](https://github.com/dsh-external/dsh-data-agent) - 让 AI 连数据库、写 SQL
- [dsh-easy-ctx-manager](https://github.com/dsh-external/dsh-easy-ctx-manager) - 上下文管理：上下文节省等（cordis）
- [dsh-kb-sieve](https://github.com/dsh-external/dsh-kb-sieve) - knowledge-base 插件：构建可审计 KB 包（references + SQL）
- [dsh-payload-capture](https://github.com/moeblack/dsh-payload-capture) - 捕捉每一次上行模型 API payload 存为 JSON（调试与观测）
- [dsh-memento](https://github.com/PerryLink/dsh-memento) - 有界、分层、带审批门、可审计的跨会话记忆：ctx.memory 服务、零依赖 SQLite、memory 工具与冻结快照注入。
- [dsh-news-plugin](https://github.com/canghai666x/dsh-news-plugin) - RSS 新闻采集工具：抓取 10+ 中英文源为结构化条目（标题/链接/来源/时间/摘要），逐源超时，供模型评分筛选与编排简报（cordis）。
- [dsh-news-briefing](https://github.com/canghai666x/dsh-news-briefing) - 新闻早晚报 Skill：五维评分筛选（故事性/时代感/深度性/趣味性/独特性）、反标题党铁律、Tier 内容偏好、去 AI 味中文写作规范。
- [dsh-web-novel-research](https://github.com/canghai666x/dsh-web-novel-research) - 中文网文剧情检索 Skill：免费转载站工作流（GBK 解码、跨卷同名章节消歧、多源断更验证），不依赖起点等付费站。
- [dsh-web-search-exa](https://github.com/TonyDua/dsh-web-search-exa) - 零配置 Exa 网页搜索提供方：无 key 走匿名 MCP 兜底（mcp.exa.ai/mcp），配 key 自动切 REST，接入 ctx.web 接缝。
- [dsh-web-search-pro](https://github.com/anweat/dsh-web-search-pro) - DSH 增强型、可持久化的网页搜索：多引擎路由（DeepSeek/Exa/DDG/Bing/Jina + GitHub/B站/YouTube/V2EX/小红书/Twitter/Reddit/RSS）、SQLite+LRU 缓存、userscript 风格抽取、Playwright 渲染。
- [dsh-session-archive](https://github.com/lbh1nb/dsh-plugins/tree/main/packages/dsh-session-archive) - 设置页查看归档会话并两步确认永久删除死会话（运行中会话锁定）。

## Input & Editing

- [dsh-better-sidebar-plugin-office](https://github.com/dsh-external/dsh-better-sidebar-plugin-office) - better-sidebar 的 Office 集成。
- [dsh-message-edit](https://github.com/dsh-external/dsh-message-edit) - 分支式消息编辑 / reroll / retry / 版本时间线
- [dsh-prompt-studio](https://github.com/dsh-external/dsh-prompt-studio) - 系统提示词分段编辑 + 实时预览
- [dsh-paste-input](https://github.com/dsh-external/dsh-paste-input) - Ctrl+V 粘贴文件 / 拖拽 / 选择
- [dsh-drag-and-drop](https://github.com/dsh-external/dsh-drag-and-drop) - 跨平台拖拽插入原始路径
- [dsh-file-uploads](https://github.com/l541402398/dsh-file-uploads) - 从 Web 输入框上传任意本地文件，以待发送卡片展示，并在设置中管理已存文件。
- [dsh-input-history](https://github.com/dsh-external/dsh-input-history) - 输入历史
- [dsh-multimedia-webui-input](https://github.com/dsh-external/dsh-multimedia-webui-input) - 多媒体文件/文件夹输入
- [dsh-office](https://github.com/dsh-external/dsh-office) - Office 文件读写 bundle：模型读写 Office 文件，docx/pdf 预览
- [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) - 全保真导入 13 款编码 Agent 的历史会话（Claude Code / Codex / ChatGPT / Cursor / Gemini / Reasonix / opencode / ZCode / Grok Build / OpenClaw / Pi / Hermes / Kimi），导入后可在 DSH 续聊，并支持反向导出/同步回 Claude Code
- [dsh-file-claim](https://github.com/Nwflower/dsh-file-claim) - 同一工作区并行多会话的文件认领与写入保护（claim/release、心跳 stale 接管、pending 三路合并）
- [dsh-sticky-note](https://github.com/Meredith2328/dsh-sticky-note) - 输入框工具栏快速便签：点子/感想/TODO，Markdown 预览、自动保存、一键发送到对话。
- [dsh-plugin-quote-reply](https://github.com/yangYzc/dsh-plugin-quote-reply) - 在会话中划选文字，一键「引用回复」插入输入框，或「新窗口回复」开新会话并预填引用。
- [@picgo/dsh-plugin](https://github.com/PicGo/dsh-plugin) - PicGo 官方插件：把本地文件传到图床拿到公网链接，复用你已在 PicGo 配好的图床与上传器插件。

- [dsh-suggested-replies](https://github.com/dsh-external/dsh-suggested-replies) - DSH Web 输入框上方的预测回复插件。
- [dsh-wordbox](https://github.com/arcmosin/dsh-wordbox) - 输入框旁的常驻常用词/句面板，支持全局/当前项目双桶与一键插入。
- [dsh-voice-webspeech](https://github.com/anweat/dsh-voice-webspeech) - DSH 浏览器 Web Speech API 语音输入：零服务端、零密钥、零模型下载（Edge=Azure 语音、Chrome=Google 语音）。
- [dsh-plugin-anydoc](https://github.com/beancookie/dsh-plugin-anydoc) - 该插件封装了一个可复用的函数，通过 @firecrawl/anydoc 提取文件内容（支持文件路径或 Buffer 输入），并返回 GitHub‑Flavored Markdown（GFM）。同时提供可选的配置项（如输出目录、是否覆盖已有文件）。
- [dsh-attachment-upload](https://github.com/lbh1nb/dsh-plugins/tree/main/packages/dsh-attachment-upload) - 输入框「📎 附件」按钮：上传文件到当前工作区 .dsh-attachments 并把路径插入草稿。
- [dsh-steer-button](https://github.com/lbh1nb/dsh-plugins/tree/main/packages/dsh-steer-button) - 输入框常驻「插话」按钮：一键把草稿注入运行中的轮次（等同 Ctrl/Cmd+Enter）。

## UI & Experience

- [dsh-spotlight](https://github.com/0xsline/dsh-spotlight) - DeepSeek Harness Web 的键盘优先命令面板。
- [dsh-better-model-selector](https://github.com/Khellendros97/dsh-better-model-selector) - 将输入框模型选择器拆成「可搜索 + 收藏」的下拉选单和「推理强度滑动条」两个独立控件，支持 Ctrl+P / Ctrl+T 快速切换。
- [dsh-catppuccin](https://github.com/zhijun-dai/Catppuccin-dsh-theme) - Catppuccin 主题插件：为 DSH Web 主题运行时提供 Latte / Frappé / Macchiato / Mocha 四套皮肤。
- [solarized-dsh-theme](https://github.com/zhijun-dai/Solarized-dsh-theme) - Solarized + Selenized 主题插件：向 DSH Web 主题运行时注册四套忠实色板。
- [arcana](https://github.com/GooodWei/arcana) - DeepSeek Harness 的悬浮命令甲板：把所有斜杠命令列成可执行按钮，悬停看介绍，按使用次数排序。
- [dsh-aigc-canvas](https://github.com/dsh-external/dsh-aigc-canvas) - AIGC 画布插件（cordis）。
- [dsh-deepcel](https://github.com/dsh-external/dsh-deepcel) - Deepcel 电子表格皮肤与独立分发仓库。
- [dsh-deepseek-quota](https://github.com/yingjunnan/dsh-deepseek-quota) - DSH Web 页面右下角悬浮卡片展示 DeepSeek API 余额（自动刷新 + 手动刷新）。
- [dsh-diff-viewer](https://github.com/dsh-external/dsh-diff-viewer) - PiUI 风格 Web diff 查看器，替换默认 diff 视图。
- [dsh-mobile](https://github.com/dsh-external/dsh-mobile) - 手机端插件（cordis + dsh.plugin.json）。
- [dsh-openpencil](https://github.com/dsh-external/dsh-openpencil) - OpenPencil 设计预览与编辑插件。
- [dsh-design-studio](https://github.com/Sal7one/DSH-Design-Studio) - Design Studio 标签页：将设计简报转化为 html/css/js 原型，实时预览、元素选取、设计代理对话与视觉审查、身份预设、zip 导出。
- [dsh-pin-recall](https://github.com/kerwin2046/dsh-pin-recall) - 在 Web 助手消息操作条钉住回复，再通过 `/pin` `/recall` 召回进下一轮模型上下文（可一键唤醒）。
- [dsh-turn-navigator](https://github.com/dsh-external/dsh-turn-navigator) - DSH Web turn 导航插件。
- [dsh-ultra-ui](https://github.com/dsh-external/dsh-ultra-ui) - ultra-ui 插件（cordis）。
- [dsh-web-billing](https://github.com/bpc-oss/dsh-web-billing) - DSH Web 人民币/美元 token 计费插件：官方政策自动计价（含峰谷时段）、逐条消息费用账本、账号余额、按界面语言切换币种。
- [dsh-balance-meter](https://github.com/Ghost011118/dsh-balance-meter) - DeepSeek 账户余额与当前会话成本显示在 DSH Web 编辑器 dock 中（自动获取官方价格，支持峰时/非峰时计价）。
- [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) - 会话与当日 API 费用统计、预算图框（已用%）、官方余额、历史看板，支持峰谷计价与官方价格一键同步。
- [dsh-cost-meter](https://github.com/Sttrevens/dsh-cost-meter) - Web UI 美元成本徽标：头部显示会话总成本、每条回复结尾显示该轮成本，悬停看分项（token 用量 × 可配置价格表）。
- [dsh-plugin-cost](https://github.com/yweilai77-dev/dsh-plugin-cost) - DSH Web 聊天框底部的会话费用估算：token 四桶 × 可配置价格表，一键刷新官方价格（估算非账单）。
- [dsh-spend](https://github.com/nonewind/dsh-spend) - DSH Web 用量与预计费用统计：右下角悬浮窗，按模型/按天/按会话多维聚合，内置供应商知识库自动识别计费计划。
- [dsh-balance-tide](https://github.com/huanyuLv/dsh-balance-tide) - 输入框下方显示 DeepSeek 账户余额与本会话花费，余额前带峰/谷价格徽章（北京时间）与距切换倒计时，悬停查看两档单价明细与使用建议。
- [dsh-live-stats](https://github.com/dsh-external/dsh-live-stats) - 实时 token 估算与生成 TPS
- [dsh-view-modes](https://github.com/NigelYao/dsh-view-modes) - DSH Web 输出模式插件：提供详尽、普通和摘要视图，按语义分组工具调用与思考，并显示实时执行状态。
- [dsh-tps](https://github.com/dsh-external/dsh-tps) - TPS 仪表
- [dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) - 创意工坊式 DSH 插件浏览器：搜索、热度/最新/近 7-90 天飙升榜、中文关键词映射、描述与 README 机翻、插件特征过滤、一键安装/更新/卸载，内置已安装插件管理。
- [dsh-cc-tui](https://github.com/dsh-external/dsh-cc-tui) - Claude Code 风格全屏 TUI（流式展开/双击 Esc 回滚）
- [dsh-grok-tui](https://github.com/chen-001/dsh-grok-tui) - grok-build TUI
- [deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) - Rust/ratatui 终端客户端，直接使用 DSH SDK JSON-RPC 协议，支持独立运行或作为 profile bundle 加载
- [DSH-better-sidebar](https://github.com/dsh-external/DSH-better-sidebar) - 侧边栏：文件渲染/终端/Git/子代理/自定义 API
- [dsh-web-panel](https://github.com/dsh-external/dsh-web-panel) - 内嵌终端 dock + Git Review + 文件视图
- [dsh-web-review](https://github.com/CanglongCl/dsh-web-review) - 隔离网页预览，通过元素批注和可视化调整指导源码修改
- [dsh-mobileweb-adapter](https://github.com/dsh-external/dsh-mobileweb-adapter) - 手机浏览器/PWA 移动版式 + 局域网 WebSocket 修复
- [dsh-subagent-tree](https://github.com/dsh-external/dsh-subagent-tree) - 子代理树可视化
- [dsh-web-workflow-visualizer](https://github.com/dsh-external/dsh-web-workflow-visualizer) - workflow 可视化
- [dsh-split-panes](https://github.com/dsh-external/dsh-split-panes) - 分栏
- [dsh-ui-progress](https://github.com/dsh-external/dsh-ui-progress) - 进度
- [dsh-skins](https://github.com/dsh-external/dsh-skins) - Web UI 皮肤
- [dsh-skin](https://github.com/KinGao294/dsh-skin) - Codex 风格换肤 + 自定义背景插件：内置多套 --dsw-alias-* 配色，支持透明度/模糊调节的半透明壁纸层。
- [dsh-chat-thumb](https://github.com/dsh-external/dsh-chat-thumb) - Chat 缩略图（cordis）
- [show-bash-command](https://github.com/dsh-external/show-bash-command) - 显示命令具体内容而非描述
- [turtle-ui](https://github.com/dsh-external/turtle-ui) - 官方 UI 插件参考实现
- [@zhaoolee/dsh-notes](https://github.com/zhaoolee/notes) - 将 DSH 对话导出为锤子便签风格 PNG，或在配置的账号工作区中新建和更新 Markdown 便签。
- [dsh-pi-tui](https://github.com/lqhl/dsh-pi-tui) - 基于 pi-tui 的 DeepSeek Harness 终端前端：流式 Markdown、thinking 折叠、工具卡片、slash 命令、审批/提问交互与 Web 会话共享
- [deepseek-harness-desktop](https://github.com/chyra-moon/deepseek-harness-desktop) - Windows 原生桌面外壳:一比一加载官方 Web UI,内置服务器托管、托盘驻留与掉线自动恢复
- [Harness Desktop](https://github.com/baiyuscc13724-max/deepseek-harness-desktop) - 官方 DSH Web UI 的 Windows 桌面版，提供中文安装版和免安装版、快速换肤、应用内插件市场、主模型与子代理选择和校验更新。
- [dsh-desktop](https://github.com/foolgry/dsh-desktop) - 开箱即用的 Electron 桌面版（macOS/Windows 安装包）：无需 Node.js 和命令行，自动跟随上游 `@deepseek-ai/dsh` 发版，内置 Web UI 与自动更新
- [deepseek-harness-desktop](https://github.com/fendouai/deepseek-harness-desktop) - 基于 Tauri 2 的 DeepSeek Harness 桌面发行版，集成完整 Web UI、受监管的本地 sidecar 与内置 Node.js 24 运行时（macOS/Linux/Windows）。
- [dsh-milestone](https://github.com/SnowCrescenter-tech/dsh-milestone) - 右侧圆点时间轴导航栏，快速跳转到任意用户消息。
- [dsh-turn-index](https://github.com/Simon314620/dsh-turn-index) - 轮次索引侧边栏：每条索引对应一轮用户提问，点击跳转并闪烁高亮，滚动时自动高亮当前轮次。
- [dsh-outline](https://github.com/urzeye/dsh-outline) - DSH Web 会话页实时大纲面板：用户问题 + Markdown 标题（1~6 级）大纲树，流式生成实时更新，点击节点定位高亮，支持展开层级调节、搜索与会话级收藏。
- [dsh-web-attention-badge](https://github.com/Luaphes/dsh-web-attention-badge) - 关注提醒：会话等待输入或后台完成未打开时，左上角角标、标签页标题 (N) 计数与鲸鱼 favicon 换色三处联动。
- [dsh-plugin-description](https://github.com/MysaDC/dsh-plugin-description) - 为 Web 设置插件列表页的每张插件卡片补上中英文功能说明，并提供 `pluginDescriptions` 服务供其他插件注册自己的说明。
- [dsh-builtin-toggles](https://github.com/Starfie1d1272/dsh-builtin-toggles) - DSH Web 官方内置插件的人类可读目录，提供状态解释与经过审核的安全 UI 开关。
- [dsh-hud](https://github.com/a903067276-rgb/dsh-hud) - HUD 状态面板：Git 状态、MCP 服务器、技能列表、模型与 token 用量，悬浮侧栏一览无余。
- [dsh-file-mentions](https://github.com/a903067276-rgb/dsh-file-mentions) - 回复中的可点击文件路径：Codex 风格内联打开、📂 文件管理器显示、回合末尾的文件提及 chip 列表。
- [dsh-auto-continue](https://github.com/HsiangNianian/dsh-auto-continue) - DSH Web 请求中断自动续跑：网络/超时/宿主崩溃等非人为失败后自动发送「继续」，支持错误分类、自适应退避、模板化继续文本与浏览器通知；全部参数可在插件设置卡片中调整。
- [dsh-trajectory-debug](https://github.com/devmom/dsh-trajectory-debug) - DeepSeek Harness 轨迹瀑布流、确定性回放、断点、改参重跑、分叉对比与性能分析。
- [dsh-plugin-colorscheme](https://github.com/Civitasv/dsh-plugin-colorscheme) - Web UI 配色方案插件：在设置里一键切换并持久化主题，内置 8 款开源预设，支持自定义主题。
- [dsh-plugin-setting-mcp](https://github.com/Ceelog/dsh-plugins/tree/main/src/plugins/dsh-plugin-setting-mcp) - 在 Web 设置面板中添加、编辑、删除、启用或停用 MCP 服务器，保存后热重载。
- [dsh-theme-plugin](https://github.com/BeiZi6/dsh-theme-plugin) - DSH Web GUI 主题工作室：5 套内置预设 + 完全可自定义的浅/深配色（强调色、背景、前景、UI 与代码字体、半透明侧栏、对比度），即时热切换并持久化到 localStorage。
- [dsh-opencodego-usage](https://github.com/BeiZi6/dsh-opencodego-usage) - OpenCodeGo 剩余额度监视器：输入框右下角呼吸指示灯（按剩余额度绿/黄/红），液态玻璃面板显示滚动/周/月用量窗口与重置时间，每 30 秒自动刷新；API Key 自动读取 DSH 凭据。
- [dsh-smooth-stream](https://github.com/SpookySandwich/dsh-smooth-stream) - 给 DeepSeek Harness 加入更好的流式文字动画。

## IDE & Clients

- [dsh4vscode](https://github.com/DoggyHU/dsh4vscode) - 基于 DSH agent 的 VS Code 聊天窗口：OpenCode 式独立会话、模型自动路由（Flash/Pro/Pro Max）。
- [dsh-plugin-open-editor](https://github.com/Civitasv/dsh-plugin-open-editor) - 从会话页头一键用本地编辑器（VS Code / Cursor / JetBrains / Vim 等）打开当前项目。
- [DSH-for-VSC](https://github.com/yauntyour/DSH-for-VSC) - 把 DSH 的 WebUI 搬进 VS Code：编辑器内嵌面板 + 侧边栏控制台（服务状态/一键启停），离线自动拉起、日志随时可查、状态栏常驻指示。
- [dsh-gui](https://github.com/xuboboo/dsh-gui) - DeepSeek Harness 第三方 Windows 桌面客户端：原生窗口、品牌主题与启动动画、启动崩溃修复、Token 用量统计。

## Browser & Remote

- [dsh-browser-panel](https://github.com/dsh-external/dsh-browser-panel) - WebUI 内嵌有头浏览器，模型实时操控（Codex 式，0 视觉依赖）
- [dsh-builtin-browser](https://github.com/wqty123/dsh-browser) - DSH 共享真实浏览器：用户可见、可随时接管的浏览器窗口，由 agent 通过 CDP 驱动（snapshot/execute/content/多标签管理）。
- [dsh-browser](https://github.com/dsh-external/dsh-browser) - Chrome 侧边栏扩展
- [dsh-deeplink](https://github.com/dsh-external/dsh-deeplink) - 通过 URL 参数直接打开 DSH WebUI 会话或工作区。
- [dsh-remote](https://github.com/flymysql/dsh-remote) - 多机远程工作区：管理多个 SSH 主机，在原生 Add-workspace 流程中选择本地或远程工作区（系统文件夹/路径浏览），把远程工作区镜像到本地真实文件夹，用 rw_* 工具操作。
- [dsh-lan-access](https://gith