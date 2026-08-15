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

### # · Plugin · Description · ⭐
- **#**: 1 · **Plugin**: [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) · **Description**: DSH Web UI 插件与皮肤集合：任务看板、Git 图谱、右侧面板、移动端远程、皮肤中心 · **⭐**: 1880
- **#**: 2 · **Plugin**: [deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) · **Description**: 现代化 DeepSeek Harness 桌面端体验 · **⭐**: 1596
- **#**: 3 · **Plugin**: [modlens](https://github.com/liustack/modlens) · **Description**: DSH 首个视觉插件：粘贴图片返回结构化 JSON 证据（OCR/布局/语义） · **⭐**: 1261
- **#**: 4 · **Plugin**: [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) · **Description**: Claude Code 风格全屏交互终端：像素鲸鱼顶栏、流式思考展开、双击 Esc 回滚、上下文/TPS 仪表 · **⭐**: 876
- **#**: 5 · **Plugin**: [DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **Description**: 侧边栏完整工作台：文件渲染编辑/终端/Git/子代理，支持三方注册 Tab · **⭐**: 740
- **#**: 6 · **Plugin**: [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) · **Description**: DSH Web 鲸鱼娘皮肤系列（深海女仆工坊） · **⭐**: 574
- **#**: 7 · **Plugin**: [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) · **Description**: 2005 中文站点风格整活广告（侧栏/信息流/弹窗，素材全虚构） · **⭐**: 328
- **#**: 8 · **Plugin**: [dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) · **Description**: 纯文本模型的视觉工具箱：图片问答、长截图 OCR、UI 还原、定位、像素对比、Artifacts · **⭐**: 323
- **#**: 9 · **Plugin**: [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) · **Description**: AgentTeams 多智能体团队协作 · **⭐**: 244
- **#**: 10 · **Plugin**: [oh-dsh](https://github.com/hust-open-atom-club/oh-dsh) · **Description**: 一站式社区发行版：TUI、桌面端与 Web UI 三种形态统一体验 · **⭐**: 165

## 📊 Stats

### Metric · Value
- **Metric**: Plugins listed · **Value**: **280+** entries (250+ unique)
- **Metric**: Categories · **Value**: **14** top-level
- **Metric**: Ecosystem reference · **Value**: `dsh-plugin` topic ~505 repos · seed data 334 · compat radar 286+

## 🗂 Categories

### # · Category · Description · File
- **#**: 1 · **Category**: 🛠️ [Tools](plugins/tools.md) · **Description**: deterministic tools, git, test runners, safe delete · **File**: `plugins/tools.md`
- **#**: 2 · **Category**: 🧩 [Skills](plugins/skills.md) · **Description**: engineering discipline, skill migration, book-to-skill · **File**: `plugins/skills.md`
- **#**: 3 · **Category**: 🔌 [MCP](plugins/mcp.md) · **Description**: MCP server management, webfetch, vision MCP · **File**: `plugins/mcp.md`
- **#**: 4 · **Category**: 🎨 [UI / Skins / Themes](plugins/ui-themes.md) · **Description**: skins, themes, generative UI, input enhancements · **File**: `plugins/ui-themes.md`
- **#**: 5 · **Category**: 🖥️ [Desktop / TUI / Mobile](plugins/desktop-tui-mobile.md) · **Description**: desktop shells, terminal TUI, mobile, companions · **File**: `plugins/desktop-tui-mobile.md`
- **#**: 6 · **Category**: 🤖 [Agent Orchestration / Multi-Agent](plugins/agent-orchestration.md) · **Description**: agent teams, plan/execute, A2A, cross-session messaging · **File**: `plugins/agent-orchestration.md`
- **#**: 7 · **Category**: 🧠 [Context / Memory](plugins/context-memory.md) · **Description**: long-term memory, context compression/audit, session control · **File**: `plugins/context-memory.md`
- **#**: 8 · **Category**: 👁️ [Multimodal / Vision](plugins/multimodal.md) · **Description**: image Q&A, OCR, screenshots, computer use · **File**: `plugins/multimodal.md`
- **#**: 9 · **Category**: 🔁 [Workflow / Automation](plugins/workflow-automation.md) · **Description**: deep research, cron, condition wakeup, review loops · **File**: `plugins/workflow-automation.md`
- **#**: 10 · **Category**: 📡 [Notifications / Channels / Remote](plugins/notifications-channels.md) · **Description**: Telegram/WeChat/Feishu bots, SSH, desktop notify · **File**: `plugins/notifications-channels.md`
- **#**: 11 · **Category**: 🌐 [Browser / Search](plugins/browser-search.md) · **Description**: browser control, scraping, search providers · **File**: `plugins/browser-search.md`
- **#**: 12 · **Category**: 🏗️ [Infra / Plugin Mgmt / Dev Tools](plugins/infrastructure-dev.md) · **Description**: plugin managers, health checks, sandboxes, telemetry · **File**: `plugins/infrastructure-dev.md`
- **#**: 13 · **Category**: 🎮 [Fun / Other](plugins/fun-other.md) · **Description**: games, pets, stickers, learning, design · **File**: `plugins/fun-other.md`
- **#**: 14 · **Category**: 🏛️ [Official & Meta](plugins/official-meta.md) · **Description**: core repo, awesome lists, compat radar, community hub · **File**: `plugins/official-meta.md`

## 📚 Browse All Plugins

Expand any category to browse all plugins inline — no need to leave this page.

🛠️ Tools · 30

### Plugin · Description · ⭐ · Install
- **Plugin**: [dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit) · **Description**: 零依赖工具十件套（time/encoding/json/calculator/csv/regex/markdown/diff/stat/schema）一键安装 · **⭐**: 15 · **Install**: `dsh plugin add @deepseek-ai/dsh-toolkit`
- **Plugin**: [dsh-tool-calculator](https://github.com/omdsh-dev/dsh-tool-calculator) · **Description**: 安全的数学表达式求值器，零依赖递归下降解析器 · **⭐**: 6 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-calculator`
- **Plugin**: [dsh-tool-csv](https://github.com/omdsh-dev/dsh-tool-csv) · **Description**: CSV 解析/查询/统计/转换（RFC 4180） · **⭐**: 4 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-csv`
- **Plugin**: [dsh-tool-diff](https://github.com/omdsh-dev/dsh-tool-diff) · **Description**: 文本/JSON/CSV/Markdown 结构化比较与 unified diff · **⭐**: 3 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-diff`
- **Plugin**: [dsh-tool-encoding](https://github.com/omdsh-dev/dsh-tool-encoding) · **Description**: base64/url/hex 编解码、常用哈希、UUID 生成 · **⭐**: 3 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-encoding`
- **Plugin**: [dsh-tool-json](https://github.com/omdsh-dev/dsh-tool-json) · **Description**: JMESPath 子集 JSON 查询 · **⭐**: 3 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-json`
- **Plugin**: [dsh-tool-markdown](https://github.com/omdsh-dev/dsh-tool-markdown) · **Description**: HTML↔Markdown 转换、GFM 表格规范化、目录生成 · **⭐**: 3 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-markdown`
- **Plugin**: [dsh-tool-regex](https://github.com/omdsh-dev/dsh-tool-regex) · **Description**: 正则测试/提取/安全替换/静态解释（不执行代码） · **⭐**: 3 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-regex`
- **Plugin**: [dsh-tool-schema](https://github.com/omdsh-dev/dsh-tool-schema) · **Description**: JSON Schema 验证：validate/paths/explain/normalize · **⭐**: 3 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-schema`
- **Plugin**: [dsh-tool-stat](https://github.com/omdsh-dev/dsh-tool-stat) · **Description**: 描述统计/百分位数/频数分布/相关性 · **⭐**: 4 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-stat`
- **Plugin**: [dsh-tool-time](https://github.com/omdsh-dev/dsh-tool-time) · **Description**: 严格 ISO 8601 解析、IANA 时区、UTC 日历运算 · **⭐**: 4 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-time`
- **Plugin**: [dsh-tool-git](https://github.com/lxj808624/dsh-tool-git) · **Description**: 结构化 Git 工具（status/diff/log/branch/stage/commit/stash/show）+ 危险命令守卫 · **⭐**:  · **Install**: `dsh plugin add dsh-tool-git`
- **Plugin**: [dsh-test-runner](https://github.com/suimi8/dsh-test-runner) · **Description**: 结构化 test_run：自动探测 vitest/jest/pytest/node:test 并解析失败摘要 · **⭐**: 1 · **Install**: `dsh plugin add dsh-test-runner`
- **Plugin**: [dsh-security-scan](https://github.com/ben7am1n/dsh-security-scan) · **Description**: 密钥/危险模式扫描（API key/token/私钥脱敏，零依赖） · **⭐**: 1 · **Install**: `dsh plugin add dsh-security-scan`
- **Plugin**: [dsh-tool-search](https://github.com/vibeinging/dsh-tool-search) · **Description**: 按 agent 的按需工具发现 + 渐进式 schema 披露 · **⭐**: 1 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-search`
- **Plugin**: [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) · **Description**: 用 Monaco 编辑器创建/管理沙箱化自定义 JS 工具 · **⭐**: 22 · **Install**: `dsh plugin add dsh-custom-tool`
- **Plugin**: [dsh-bash-encoding](https://github.com/lhh010/dsh-bash-encoding) · **Description**: 自动识别并解码 Bash 输出编码（UTF-16LE/UTF-8/GBK），修中文乱码 · **⭐**:  · **Install**: 
- **Plugin**: [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) · **Description**: Codex 风格 `@file` 文件引用，输入框里直接搜索并引用工作区文件 · **⭐**: 126 · **Install**: `dsh plugin add dsh-at-file`
- **Plugin**: [dsh-wikilink](https://github.com/zhaoscsc/dsh-wikilink) · **Description**: Obsidian 风格 `[[wikilink]]` 提及：模糊搜索笔记标题并附加内容 · **⭐**: 2 · **Install**: `dsh plugin add dsh-wikilink`
- **Plugin**: [dsh-safe-delete](https://github.com/Qintsg/dsh-safe-delete) · **Description**: 安全删除：移入回收站/暂存区而非永久删除，支持恢复 · **⭐**:  · **Install**: 
- **Plugin**: [dsh-bisect-debug](https://github.com/PangYiMing/dsh-bisect-debug) · **Description**: 二分法定位 bug 根因（代码/边界/commit） · **⭐**: 1 · **Install**: `dsh plugin add dsh-bisect-debug`
- **Plugin**: [dsh-payload-capture](https://github.com/Moeblack/dsh-payload-capture) · **Description**: 捕捉每次上行模型 API payload 落盘 JSON（调试/可观测） · **⭐**: 1 · **Install**: `dsh plugin add dsh-payload-capture`
- **Plugin**: [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) · **Description**: 让 AI 帮你连数据库、写 SQL · **⭐**: 18 · **Install**: `dsh plugin add @deepseek-ai/dsh-data-agent`
- **Plugin**: [dsh-openapi](https://github.com/Degurechaff57/dsh-openapi) · **Description**: Safe OpenAPI 3.x 发现与 API 调用工具 · **⭐**: 4 · **Install**: `dsh plugin add dsh-openapi`
- **Plugin**: [dsh-plugin-interpreters](https://github.com/HuanLinOTO/dsh-plugin-interpreters) · **Description**: 暴露 run_python / run_node 工具，可配置解释器路径 · **⭐**: 2 · **Install**: `dsh plugin add @huanlin/dsh-plugin-interpreters`
- **Plugin**: [dsh-cowork](https://github.com/Jesse-njx/dsh-cowork) · **Description**: doc_read/doc_write：以有界、单元格寻址方式读写 xlsx/pdf/docx/pptx/ipynb · **⭐**: 2 · **Install**: 
- **Plugin**: [dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) · **Description**: 向模型暴露 MineRU 文档解析工具 · **⭐**: 10 · **Install**: `dsh plugin add @huanlin/dsh-plugin-mineru`
- **Plugin**: [dsh-plugin-sleep](https://github.com/HuanLinOTO/dsh-plugin-sleep) · **Description**: 暴露单个 `sleep` 工具，让模型按需暂停（支持取消） · **⭐**: 2 · **Install**: `dsh plugin add @huanlin/dsh-plugin-sleep`
- **Plugin**: [dsh-port-guard](https://github.com/PangYiMing/dsh-port-guard) · **Description**: 端口占用处置（复用/切换/精确 kill） · **⭐**: 1 · **Install**: `dsh plugin add dsh-port-guard`
- **Plugin**: [dsh-scout](https://github.com/omdsh-dev/dsh-scout) · **Description**: 只读环境探测：运行环境/版本/资源/端口/服务/硬件/工作区 · **⭐**: 1 · **Install**: `dsh plugin add @deepseek-ai/dsh-tool-scout`

🧩 Skills · 16

### Plugin · Description · ⭐ · Install
- **Plugin**: [dsh-review-skills](https://github.com/ben7am1n/dsh-review-skills) · **Description**: 工程纪律技能包：code-review/simplify/plan-then-execute/test-first/resolve-conflict · **⭐**: 1 · **Install**: `dsh plugin add dsh-review-skills`
- **Plugin**: [dsh-skillport](https://github.com/Jesse-njx/dsh-skillport) · **Description**: 把已有 Agent Skills（Claude/Codex/Cursor/Gemini 的 SKILL.md）带进 DSH，渐进式索引 + 按需加载 · **⭐**: 2 · **Install**: `dsh plugin add @dsh-skillport/bundle`
- **Plugin**: [dsh-find-skill](https://github.com/Moximxxx/dsh-find-skill) · **Description**: 桥接 vercel-labs/skills 生态：LLM 驱动技能搜索/安装/生命周期管理 · **⭐**: 1 · **Install**: `dsh plugin add dsh-find-skill`
- **Plugin**: [dsh-plugin-skills](https://github.com/omdsh-dev/dsh-plugin-skills) · **Description**: 构建与测试 DSH 插件的 Agent 技能（脚手架到测试分层） · **⭐**:  · **Install**: 
- **Plugin**: [dsh-book2skill](https://github.com/omdsh-dev/dsh-book2skill) · **Description**: 五阶段「书→技能」长任务（抓取→解析→理解→生成→安装）+ 3 个人工关卡 · **⭐**: 1 · **Install**: `dsh plugin add dsh-book2skill`
- **Plugin**: [dsh-superpowers](https://github.com/codeAnqiang-ma/dsh-superpowers) · **Description**: Superpowers（obra/superpowers）作为 DSH 插件：方法论技能 + 会话引导 · **⭐**: 2 · **Install**: `dsh plugin add dsh-superpowers`
- **Plugin**: [dsh-plugin-code-review](https://github.com/YYTbit/dsh-plugin-code-review) · **Description**: 结构化代码审查技能（YYTbit 系列） · **⭐**: 1 · **Install**: `dsh plugin add dsh-plugin-code-review`
- **Plugin**: [dsh-review-loop](https://github.com/wuxiangru915/dsh-review-loop) · **Description**: 增量 diff 审查：checkpoint 队列 + Web 面板 + 审查意见注入 agent · **⭐**: 2 · **Install**: `dsh plugin add @dsh-plugin/dsh-review-loop`
- **Plugin**: [dsh-skill-manager](https://github.com/bitterSmilezzz/dsh-skill-manager) · **Description**: 在 Web 设置页管理（列出/禁用启用/编辑）skills · **⭐**: 1 · **Install**: `dsh plugin add dsh-skill-manager`
- **Plugin**: [dsh-plugin-claude-bridge](https://github.com/YYTbit/dsh-plugin-claude-bridge) · **Description**: 把 Claude Code 记忆/技能/配置桥接进 DSH · **⭐**: 2 · **Install**: `dsh plugin add dsh-plugin-claude-bridge`
- **Plugin**: [dsh-plugin-codex-bridge](https://github.com/YYTbit/dsh-plugin-codex-bridge) · **Description**: 把 Codex skills/config 桥接进 DSH · **⭐**: 2 · **Install**: `dsh plugin add dsh-plugin-codex-bridge`
- **Plugin**: [dsh-plugin-opencode-bridge](https://github.com/YYTbit/dsh-plugin-opencode-bridge) · **Description**: 把 OpenCode skills/config 桥接进 DSH · **⭐**: 2 · **Install**: `dsh plugin add dsh-plugin-opencode-bridge`
- **Plugin**: [dsh-plugin-pi-bridge](https://github.com/YYTbit/dsh-plugin-pi-bridge) · **Description**: 把 pi skills/config 桥接进 DSH · **⭐**: 2 · **Install**: `dsh plugin add dsh-plugin-pi-bridge`
- **Plugin**: [Code2Skill](https://github.com/leechen298/Code2Skill) · **Description**: 从现有代码生成 Function、MCP、Agent Skill 和离线测试包，并作为可安装的 DSH Bundle 分发 · **⭐**: 1 · **Install**: `dsh plugin add github:leechen298/Code2Skill#v1.1.3`
- **Plugin**: [dsh-reverse-skill](https://github.com/dhicoc/dsh-reverse-skill) · **Description**: 逆向工程、授权渗透测试与安全研究技能路由包（85 个 SKILL.md，仅限授权测试） · **⭐**: 2 · **Install**: `dsh plugin add github:dhicoc/dsh-reverse-skill`
- **Plugin**: [dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) · **Description**: 帮 DSH 搜索、安装并验证 GitHub 插件的 Skill · **⭐**: 68 · **Install**: `dsh plugin add github:Nagi-ovo/dsh-find-plugins`

🔌 MCP · 9

### Plugin · Description · ⭐ · Install
- **Plugin**: [dsh-mcp-manager](https://github.com/hyqhyq3/dsh-mcp-manager) · **Description**: MCP 服务器管理：Settings 页 OAuth(PKCE) 或静态 token 认证，工具注册为 `mcp__*` · **⭐**: 2 · **Install**: `dsh plugin add dsh-mcp-manager`
- **Plugin**: [dsh-mcp-proxy](https://github.com/ben7am1n/dsh-mcp-proxy) · **Description**: 省上下文的惰性 MCP 访问 · **⭐**: 1 · **Install**: `dsh plugin add dsh-mcp-proxy`
- **Plugin**: [deepseek-harness-plugin-mcp](https://github.com/bobleer/deepseek-harness-plugin-mcp) · **Description**: 让任意 agent 发现/安装/运行 DSH 插件的 MCP server · **⭐**: 2 · **Install**: `dsh plugin add deepseek-harness-plugin-mcp`
- **Plugin**: [dsh-webfetch](https://github.com/withlovehub/dsh-webfetch) · **Description**: 零依赖 webfetch MCP server（干净文本/markdown/HTML/JSON，robots.txt 合规，SSRF 防护） · **⭐**:  · **Install**: 
- **Plugin**: [dsh-search-mcp](https://github.com/gxpppp/dsh-search-mcp) · **Description**: 用搜索 MCP（Tavily/Brave/Exa/Perplexity/DuckDuckGo）替换内置搜索 · **⭐**: 1 · **Install**: `dsh plugin add dsh-search-mcp`
- **Plugin**: [dsh-oauth-mcp-client](https://github.com/springbrand-lab/dsh-oauth-mcp-client) · **Description**: 连接支持 OAuth 2.1 的 Streamable HTTP MCP 服务 · **⭐**:  · **Install**: 
- **Plugin**: [shadow-vision](https://github.com/WardLu/shadow-vision) · **Description**: 开源 MCP 视觉 server，给纯文本 LLM 图片理解/OCR/UI 检查 · **⭐**:  · **Install**: 
- **Plugin**: [mcp-bridge](https://github.com/WongJingGitt/mcp-bridge) · **Description**: MCP 浏览器桥接，让网页端 AI 调用 MCP 工具 · **⭐**:  · **Install**: 
- **Plugin**: [dsh-acp-for-bitfun](https://github.com/bobleer/dsh-acp-for-bitfun) · **Description**: BitFun 与 DSH 的 ACP 交互对接 · **⭐**: 9 · **Install**: `dsh plugin add dsh-acp-for-bitfun`

🎨 UI / Skins / Themes · 38

### Plugin · Description · ⭐ · Install
- **Plugin**: [dsh-skins](https://github.com/Moeb