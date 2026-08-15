# 🐋 Awesome DeepSeek Harness Plugins

**A curated directory of 280+ [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugins across 14 categories — every entry with ⭐ stars and a `dsh plugin add` command. Bilingual (EN + 中文), machine-readable data, auto-sync CI.**

[Quick Start](#quick-start) · [Hot Plugins](#hot-plugins) · [Categories](#categories) · [Browse All](#browse-all-plugins) · [Full Index](INDEX.md) · [Contributing](CONTRIBUTING.md)

## 🧭 What is this

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) is DeepSeek's open-source agent harness — a ready-to-run coding agent whose core is an "**everything is a plugin**" framework: models, tools, sandboxes, session storage, the UI, and even the agent loop itself are plugins.

This repository is a **community-maintained plugin index**: it organizes DSH plugins scattered across GitHub into browsable categories. No website, no runtime — just a readable, clickable, contributable directory.

- ✅ Official install: `dsh plugin --profile <name> add ` (forwards to pnpm; npm / git / tarball)
- ✅ Official discovery: npm + the GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic (**no built-in marketplace**)

## ✨ Why this directory

Several `awesome-dsh-*` lists already exist. This one is different:

- **14 hand-curated categories** with clear boundaries ([taxonomy](docs/taxonomy.md)) — not a flat name dump
- **Star counts + install commands** on every entry — judge popularity and install in one glance
- **Bilingual** (English primary + 中文) with a one-click toggle
- **Inline collapsible browsing** — expand every category right here in the README
- **Machine-readable data** ([data/plugins.json](data/plugins.json)) + generation scripts + auto-sync CI

## ⚡ Quick Start

Three ways to use this directory:

1. **Browse** — expand any category below (or jump into a category file); each entry links straight to its GitHub repo.
2. **Search** — press `t` (or `Ctrl+F`) on the repo page and search keywords like `mcp`, `memory`, `TUI`, `multi-agent`.
3. **Consume programmatically** — read [`data/plugins.json`](data/plugins.json) (334 structured entries; field docs in [data/README.md](data/README.md)).

## 🔥 Hot Plugins

Top community plugins by GitHub stars:

| # | Plugin | Description | ⭐ |
|---|---|---|---|
| 1 | [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) | DSH Web UI 插件与皮肤集合：任务看板、Git 图谱、右侧面板、移动端远程、皮肤中心 | 1880 |
| 2 | [deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) | 现代化 DeepSeek Harness 桌面端体验 | 1596 |
| 3 | [modlens](https://github.com/liustack/modlens) | DSH 首个视觉插件：粘贴图片返回结构化 JSON 证据（OCR/布局/语义） | 1261 |
| 4 | [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | Claude Code 风格全屏交互终端：像素鲸鱼顶栏、流式思考展开、双击 Esc 回滚、上下文/TPS 仪表 | 876 |
| 5 | [DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) | 侧边栏完整工作台：文件渲染编辑/终端/Git/子代理，支持三方注册 Tab | 740 |
| 6 | [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | DSH Web 鲸鱼娘皮肤系列（深海女仆工坊） | 574 |
| 7 | [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) | 2005 中文站点风格整活广告（侧栏/信息流/弹窗，素材全虚构） | 328 |
| 8 | [dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) | 纯文本模型的视觉工具箱：图片问答、长截图 OCR、UI 还原、定位、像素对比、Artifacts | 323 |
| 9 | [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | AgentTeams 多智能体团队协作 | 244 |
| 10 | [oh-dsh](https://github.com/hust-open-atom-club/oh-dsh) | 一站式社区发行版：TUI、桌面端与 Web UI 三种形态统一体验 | 165 |

## 📊 Stats

| Metric | Value |
|---|---|
| Plugins listed | **280+** entries (250+ unique) |
| Categories | **14** top-level |
| Ecosystem reference | `dsh-plugin` topic ~505 repos · seed data 334 · compat radar 286+ |

## 🗂 Categories

| # | Category | Description | File |
|---|---|---|---|
| 1 | 🛠️ [Tools](plugins/tools.md) | deterministic tools, git, test runners, safe delete | `plugins/tools.md` |
| 2 | 🧩 [Skills](plugins/skills.md) | engineering discipline, skill migration, book-to-skill | `plugins/skills.md` |
| 3 | 🔌 [MCP](plugins/mcp.md) | MCP server management, webfetch, vision MCP | `plugins/mcp.md` |
| 4 | 🎨 [UI / Skins / Themes](plugins/ui-themes.md) | skins, themes, generative UI, input enhancements | `plugins/ui-themes.md` |
| 5 | 🖥️ [Desktop / TUI / Mobile](plugins/desktop-tui-mobile.md) | desktop shells, terminal TUI, mobile, companions | `plugins/desktop-tui-mobile.md` |
| 6 | 🤖 [Agent Orchestration / Multi-Agent](plugins/agent-orchestration.md) | agent teams, plan/execute, A2A, cross-session messaging | `plugins/agent-orchestration.md` |
| 7 | 🧠 [Context / Memory](plugins/context-memory.md) | long-term memory, context compression/audit, session control | `plugins/context-memory.md` |
| 8 | 👁️ [Multimodal / Vision](plugins/multimodal.md) | image Q&A, OCR, screenshots, computer use | `plugins/multimodal.md` |
| 9 | 🔁 [Workflow / Automation](plugins/workflow-automation.md) | deep research, cron, condition wakeup, review loops | `plugins/workflow-automation.md` |
| 10 | 📡 [Notifications / Channels / Remote](plugins/notifications-channels.md) | Telegram/WeChat/Feishu bots, SSH, desktop notify | `plugins/notifications-channels.md` |
| 11 | 🌐 [Browser / Search](plugins/browser-search.md) | browser control, scraping, search providers | `plugins/browser-search.md` |
| 12 | 🏗️ [Infra / Plugin Mgmt / Dev Tools](plugins/infrastructure-dev.md) | plugin managers, health checks, sandboxes, telemetry | `plugins/infrastructure-dev.md` |
| 13 | 🎮 [Fun / Other](plugins/fun-other.md) | games, pets, stickers, learning, design | `plugins/fun-other.md` |
| 14 | 🏛️ [Official & Meta](plugins/official-meta.md) | core repo, awesome lists, compat radar, community hub | `plugins/official-meta.md` |

## 📚 Browse All Plugins

Expand any category to browse all plugins inline — no need to leave this page.

🛠️ Tools · 30

| Plugin | Description | ⭐ | Install |
|---|---|---|---|
| [dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit) | 零依赖工具十件套（time/encoding/json/calculator/csv/regex/markdown/diff/stat/schema）一键安装 | 15 | `dsh plugin add @deepseek-ai/dsh-toolkit` |
| [dsh-tool-calculator](https://github.com/omdsh-dev/dsh-tool-calculator) | 安全的数学表达式求值器，零依赖递归下降解析器 | 6 | `dsh plugin add @deepseek-ai/dsh-tool-calculator` |
| [dsh-tool-csv](https://github.com/omdsh-dev/dsh-tool-csv) | CSV 解析/查询/统计/转换（RFC 4180） | 4 | `dsh plugin add @deepseek-ai/dsh-tool-csv` |
| [dsh-tool-diff](https://github.com/omdsh-dev/dsh-tool-diff) | 文本/JSON/CSV/Markdown 结构化比较与 unified diff | 3 | `dsh plugin add @deepseek-ai/dsh-tool-diff` |
| [dsh-tool-encoding](https://github.com/omdsh-dev/dsh-tool-encoding) | base64/url/hex 编解码、常用哈希、UUID 生成 | 3 | `dsh plugin add @deepseek-ai/dsh-tool-encoding` |
| [dsh-tool-json](https://github.com/omdsh-dev/dsh-tool-json) | JMESPath 子集 JSON 查询 | 3 | `dsh plugin add @deepseek-ai/dsh-tool-json` |
| [dsh-tool-markdown](https://github.com/omdsh-dev/dsh-tool-markdown) | HTML↔Markdown 转换、GFM 表格规范化、目录生成 | 3 | `dsh plugin add @deepseek-ai/dsh-tool-markdown` |
| [dsh-tool-regex](https://github.com/omdsh-dev/dsh-tool-regex) | 正则测试/提取/安全替换/静态解释（不执行代码） | 3 | `dsh plugin add @deepseek-ai/dsh-tool-regex` |
| [dsh-tool-schema](https://github.com/omdsh-dev/dsh-tool-schema) | JSON Schema 验证：validate/paths/explain/normalize | 3 | `dsh plugin add @deepseek-ai/dsh-tool-schema` |
| [dsh-tool-stat](https://github.com/omdsh-dev/dsh-tool-stat) | 描述统计/百分位数/频数分布/相关性 | 4 | `dsh plugin add @deepseek-ai/dsh-tool-stat` |
| [dsh-tool-time](https://github.com/omdsh-dev/dsh-tool-time) | 严格 ISO 8601 解析、IANA 时区、UTC 日历运算 | 4 | `dsh plugin add @deepseek-ai/dsh-tool-time` |
| [dsh-tool-git](https://github.com/lxj808624/dsh-tool-git) | 结构化 Git 工具（status/diff/log/branch/stage/commit/stash/show）+ 危险命令守卫 |  | `dsh plugin add dsh-tool-git` |
| [dsh-test-runner](https://github.com/suimi8/dsh-test-runner) | 结构化 test_run：自动探测 vitest/jest/pytest/node:test 并解析失败摘要 | 1 | `dsh plugin add dsh-test-runner` |
| [dsh-security-scan](https://github.com/ben7am1n/dsh-security-scan) | 密钥/危险模式扫描（API key/token/私钥脱敏，零依赖） | 1 | `dsh plugin add dsh-security-scan` |
| [dsh-tool-search](https://github.com/vibeinging/dsh-tool-search) | 按 agent 的按需工具发现 + 渐进式 schema 披露 | 1 | `dsh plugin add @deepseek-ai/dsh-tool-search` |
| [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) | 用 Monaco 编辑器创建/管理沙箱化自定义 JS 工具 | 22 | `dsh plugin add dsh-custom-tool` |
| [dsh-bash-encoding](https://github.com/lhh010/dsh-bash-encoding) | 自动识别并解码 Bash 输出编码（UTF-16LE/UTF-8/GBK），修中文乱码 |  |  |
| [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) | Codex 风格 `@file` 文件引用，输入框里直接搜索并引用工作区文件 | 126 | `dsh plugin add dsh-at-file` |
| [dsh-wikilink](https://github.com/zhaoscsc/dsh-wikilink) | Obsidian 风格 `[[wikilink]]` 提及：模糊搜索笔记标题并附加内容 | 2 | `dsh plugin add dsh-wikilink` |
| [dsh-safe-delete](https://github.com/Qintsg/dsh-safe-delete) | 安全删除：移入回收站/暂存区而非永久删除，支持恢复 |  |  |
| [dsh-bisect-debug](https://github.com/PangYiMing/dsh-bisect-debug) | 二分法定位 bug 根因（代码/边界/commit） | 1 | `dsh plugin add dsh-bisect-debug` |
| [dsh-payload-capture](https://github.com/Moeblack/dsh-payload-capture) | 捕捉每次上行模型 API payload 落盘 JSON（调试/可观测） | 1 | `dsh plugin add dsh-payload-capture` |
| [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) | 让 AI 帮你连数据库、写 SQL | 18 | `dsh plugin add @deepseek-ai/dsh-data-agent` |
| [dsh-openapi](https://github.com/Degurechaff57/dsh-openapi) | Safe OpenAPI 3.x 发现与 API 调用工具 | 4 | `dsh plugin add dsh-openapi` |
| [dsh-plugin-interpreters](https://github.com/HuanLinOTO/dsh-plugin-interpreters) | 暴露 run_python / run_node 工具，可配置解释器路径 | 2 | `dsh plugin add @huanlin/dsh-plugin-interpreters` |
| [dsh-cowork](https://github.com/Jesse-njx/dsh-cowork) | doc_read/doc_write：以有界、单元格寻址方式读写 xlsx/pdf/docx/pptx/ipynb | 2 |  |
| [dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) | 向模型暴露 MineRU 文档解析工具 | 10 | `dsh plugin add @huanlin/dsh-plugin-mineru` |
| [dsh-plugin-sleep](https://github.com/HuanLinOTO/dsh-plugin-sleep) | 暴露单个 `sleep` 工具，让模型按需暂停（支持取消） | 2 | `dsh plugin add @huanlin/dsh-plugin-sleep` |
| [dsh-port-guard](https://github.com/PangYiMing/dsh-port-guard) | 端口占用处置（复用/切换/精确 kill） | 1 | `dsh plugin add dsh-port-guard` |
| [dsh-scout](https://github.com/omdsh-dev/dsh-scout) | 只读环境探测：运行环境/版本/资源/端口/服务/硬件/工作区 | 1 | `dsh plugin add @deepseek-ai/dsh-tool-scout` |

🧩 Skills · 16

| Plugin | Description | ⭐ | Install |
|---|---|---|---|
| [dsh-review-skills](https://github.com/ben7am1n/dsh-review-skills) | 工程纪律技能包：code-review/simplify/plan-then-execute/test-first/resolve-conflict | 1 | `dsh plugin add dsh-review-skills` |
| [dsh-skillport](https://github.com/Jesse-njx/dsh-skillport) | 把已有 Agent Skills（Claude/Codex/Cursor/Gemini 的 SKILL.md）带进 DSH，渐进式索引 + 按需加载 | 2 | `dsh plugin add @dsh-skillport/bundle` |
| [dsh-find-skill](https://github.com/Moximxxx/dsh-find-skill) | 桥接 vercel-labs/skills 生态：LLM 驱动技能搜索/安装/生命周期管理 | 1 | `dsh plugin add dsh-find-skill` |
| [dsh-plugin-skills](https://github.com/omdsh-dev/dsh-plugin-skills) | 构建与测试 DSH 插件的 Agent 技能（脚手架到测试分层） |  |  |
| [dsh-book2skill](https://github.com/omdsh-dev/dsh-book2skill) | 五阶段「书→技能」长任务（抓取→解析→理解→生成→安装）+ 3 个人工关卡 | 1 | `dsh plugin add dsh-book2skill` |
| [dsh-superpowers](https://github.com/codeAnqiang-ma/dsh-superpowers) | Superpowers（obra/superpowers）作为 DSH 插件：方法论技能 + 会话引导 | 2 | `dsh plugin add dsh-superpowers` |
| [dsh-plugin-code-review](https://github.com/YYTbit/dsh-plugin-code-review) | 结构化代码审查技能（YYTbit 系列） | 1 | `dsh plugin add dsh-plugin-code-review` |
| [dsh-review-loop](https://github.com/wuxiangru915/dsh-review-loop) | 增量 diff 审查：checkpoint 队列 + Web 面板 + 审查意见注入 agent | 2 | `dsh plugin add @dsh-plugin/dsh-review-loop` |
| [dsh-skill-manager](https://github.com/bitterSmilezzz/dsh-skill-manager) | 在 Web 设置页管理（列出/禁用启用/编辑）skills | 1 | `dsh plugin add dsh-skill-manager` |
| [dsh-plugin-claude-bridge](https://github.com/YYTbit/dsh-plugin-claude-bridge) | 把 Claude Code 记忆/技能/配置桥接进 DSH | 2 | `dsh plugin add dsh-plugin-claude-bridge` |
| [dsh-plugin-codex-bridge](https://github.com/YYTbit/dsh-plugin-codex-bridge) | 把 Codex skills/config 桥接进 DSH | 2 | `dsh plugin add dsh-plugin-codex-bridge` |
| [dsh-plugin-opencode-bridge](https://github.com/YYTbit/dsh-plugin-opencode-bridge) | 把 OpenCode skills/config 桥接进 DSH | 2 | `dsh plugin add dsh-plugin-opencode-bridge` |
| [dsh-plugin-pi-bridge](https://github.com/YYTbit/dsh-plugin-pi-bridge) | 把 pi skills/config 桥接进 DSH | 2 | `dsh plugin add dsh-plugin-pi-bridge` |
| [Code2Skill](https://github.com/leechen298/Code2Skill) | 从现有代码生成 Function、MCP、Agent Skill 和离线测试包，并作为可安装的 DSH Bundle 分发 | 1 | `dsh plugin add github:leechen298/Code2Skill#v1.1.3` |
| [dsh-reverse-skill](https://github.com/dhicoc/dsh-reverse-skill) | 逆向工程、授权渗透测试与安全研究技能路由包（85 个 SKILL.md，仅限授权测试） | 2 | `dsh plugin add github:dhicoc/dsh-reverse-skill` |
| [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | 帮 DSH 搜索、安装并验证 GitHub 插件的 Skill | 68 | `dsh plugin add github:Nagi-ovo/dsh-find-plugins` |

🔌 MCP · 9

| Plugin | Description | ⭐ | Install |
|---|---|---|---|
| [dsh-mcp-manager](https://github.com/hyqhyq3/dsh-mcp-manager) | MCP 服务器管理：Settings 页 OAuth(PKCE) 或静态 token 认证，工具注册为 `mcp__*` | 2 | `dsh plugin add dsh-mcp-manager` |
| [dsh-mcp-proxy](https://github.com/ben7am1n/dsh-mcp-proxy) | 省上下文的惰性 MCP 访问 | 1 | `dsh plugin add dsh-mcp-proxy` |
| [deepseek-harness-plugin-mcp](https://github.com/bobleer/deepseek-harness-plugin-mcp) | 让任意 agent 发现/安装/运行 DSH 插件的 MCP server | 2 | `dsh plugin add deepseek-harness-plugin-mcp` |
| [dsh-webfetch](https://github.com/withlovehub/dsh-webfetch) | 零依赖 webfetch MCP server（干净文本/markdown/HTML/JSON，robots.txt 合规，SSRF 防护） |  |  |
| [dsh-search-mcp](https://github.com/gxpppp/dsh-search-mcp) | 用搜索 MCP（Tavily/Brave/Exa/Perplexity/DuckDuckGo）替换内置搜索 | 1 | `dsh plugin add dsh-search-mcp` |
| [dsh-oauth-mcp-client](https://github.com/springbrand-lab/dsh-oauth-mcp-client) | 连接支持 OAuth 2.1 的 Streamable HTTP MCP 服务 |  |  |
| [shadow-vision](https://github.com/WardLu/shadow-vision) | 开源 MCP 视觉 server，给纯文本 LLM 图片理解/OCR/UI 检查 |  |  |
| [mcp-bridge](https://github.com/WongJingGitt/mcp-bridge) | MCP 浏览器桥接，让网页端 AI 调用 MCP 工具 |  |  |
| [dsh-acp-for-bitfun](https://github.com/bobleer/dsh-acp-for-bitfun) | BitFun 与 DSH 的 ACP 交互对接 | 9 | `dsh plugin add dsh-acp-for-bitfun` |

🎨 UI / Skins / Themes · 38

| Plugin | Description | ⭐ | Install |
|---|---|---|---|
| [dsh-skins](https://github.com/Moeblack/dsh-skins) | Web UI 皮肤合集（含 harbor 夕港黄昏皮肤） | 1 | `dsh plugin add @dsh-external/dsh-web-skins` |
| [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) | DSH Web 鲸鱼娘皮肤系列（深海女仆工坊） | 574 |  |
| [dsh-qq2006](https://github.com/LaplaceYoung/dsh-qq2006) | QQ2006 复古皮肤 |  |  |
| [dsh-miku-skin](https://github.com/stushansusu/dsh-miku-skin) | 初音未来主题（蓝紫渐变/毛玻璃/亮暗双主题） | 1 | `dsh plugin add @deepseek-ai/dsh-client-ui-skin-miku` |
| [dsh-deepcel](https://github.com/Small-tailqwq/dsh-deepcel) | 模仿 Excel 的皮肤 |  |  |
| [dsh-tonghuashun](https://github.com/AdamPlatin123/dsh-tonghuashun) | 同花顺行情终端风格皮肤 + 代码量 K 线面板 |  |  |
| [dsh-plugin-colorscheme](https://github.com/Civitasv/dsh-plugin-colorscheme) | 配色方案插件 |  |  |
| [dsh-custom-css](https://github.com/AnacondaKC/dsh-custom-css) | 自定义 CSS | 1 | `dsh plugin add dsh-custom-css` |
| [dsh-web-background](https://github.com/BruceWu1126/dsh-web-background) | Web UI 背景自定义 |  |  |
| [dsh-plugin-background](https://github.com/gameswu/dsh-plugin-background) | Web UI 壁纸自定义 |  |  |
| [dsh-chat-width](https://github.com/chen-001/dsh-chat-width) | 调整回复宽度（终端宽度感知） |  |  |
| [deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin) | 换肤系统：21 套内置皮肤 + 一图生成整套配色 | 24 |  |
| [DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) | 侧边栏完整工作台：文件渲染编辑/终端/Git/子代理，支持三方注册 Tab | 740 | `dsh plugin add dsh-better-sidebar` |
| [dsh-side-panel](https://github.com/ccq1/dsh-side-panel) | 侧边栏集成文件浏览器、终端和 Git 审查 | 17 | `dsh plugin add @dsh-external/dsh-side-panel` |
| [dsh-focus-chat](https://github.com/dingyi222666/dsh-focus-chat) | 「聚焦会话」精简视图，只关注最终产出结果 | 13 | `dsh plugin add @dingyi222666/dsh-focus-chat` |
| [ui-status-label](https://github.com/alingalingling/ui-status-label) | 把鲸鱼娘思考时的 "deep diving" 状态文案自定义 | 30 | `dsh plugin add dsh-ui-status-label` |
| [dsh-navbar](https://github.com/vlln/dsh-navbar) | 对话节点导航条，右缘节点串快速跳转 user 消息 | 17 | `dsh plugin add @dsh-external/dsh-navbar` |
| [dsh-task-status](https://github.com/vlln/dsh-task-status) | 后台任务状态条：对话页任务进度 + 实时输出 tail | 8 | `dsh plugin add @dsh-external/dsh-task-status` |
| [dsh-web-archive](https://github.com/renat3u/dsh-web-archive) | 折叠对话中的 Think、Bash 等「无用消息」 | 5 | `dsh plugin add dsh-web-archive` |
| [dsh-milestone](https://github.com/SnowCrescenter-tech/dsh-milestone) | 会话里程碑导航条：像 Git 提交图定位每条提问 | 11 | `dsh plugin add dsh-milestone` |
| [dsh-spotlight](https://github.com/0xsline/dsh-spotlight) | 键盘优先的命令面板（command palette） | 5 | `dsh plugin add @dsh-external/dsh-spotlight` |
| [dsh-deeplink](https://github.com/qyw233/dsh-deeplink) | `?session=` / `?workspace=` 深链直达指定项目对话 | 1 | `dsh plugin add @dsh-community/dsh-deeplink` |
| [dsh-diff-viewer](https://github.com/lehhair/dsh-diff-viewer) | PiUI 风格 diff 查看器，替换 write/edit 的默认 DiffBlock | 7 | `dsh plugin add @dsh-external/dsh-diff-viewer` |
| [dsh-drag-and-drop](https://github.com/bill9109/dsh-drag-and-drop) | 跨平台文件拖拽与原始路径插入，无需复制文件 | 4 | `dsh plugin add @bill9109/dsh-drag-and-drop` |
| [ex-setting](https://github.com/omdsh-dev/ex-setting) | DSH 的设置扩展 | 2 | `dsh plugin add @deepseek-ai/dsh-ex-setting` |
| [dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) | 选中文字→批注→回车随消息发送，回复按批注逐条对照 | 40 | `dsh plugin add @omdsh-dev/dsh-annotation` |
| [dsh-prompt-studio](https://github.com/Moeblack/dsh-prompt-studio) | 带实时预览的用户/内置 system prompt 分节编辑器 | 2 | `dsh plugin add dsh-prompt-studio` |
| [dsh-prompt-persona](https://github.com/Xilin3/dsh-prompt-persona) | 从设置页编辑系统提示词（deployment persona），带实时预览 | 2 | `dsh plugin add @xilin3/dsh-prompt-persona` |
| [dsh-model-selector](https://github.com/bitt