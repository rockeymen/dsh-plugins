# 🐋 Awesome DeepSeek Harness Plugins

**DeepSeek Harness（`dsh`）插件精选目录：14 类 280+ 个插件，每条附 ⭐ star 与 `dsh plugin add` 安装命令。双语（英文主 + 中文）、机器可读数据、自动同步 CI。**

**中文** · [English](README.md)

[快速开始](#快速开始) · [热门插件](#热门插件) · [分类目录](#分类目录) · [全部插件](#全部插件) · [总索引](INDEX.md) · [贡献](CONTRIBUTING.md)

## 🧭 这是什么

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 是 DeepSeek 开源的 agent harness——既是可直接运行的 Coding Agent，底层又是一套「**一切皆插件**」的框架：模型、工具、沙箱、会话存储、UI、乃至 Agent Loop 本身都是插件。

本仓库是一个**社区维护的插件索引**，只做一件事：**把散落在 GitHub 上的 DSH 插件按分类整理好，让你直接在仓库里浏览、点击跳转到对应仓库**。不做站点、不做运行时，纯粹是一份可读、可跳转、可贡献的目录。

- ✅ 官方安装：`dsh plugin --profile <name> add `（转发 pnpm，支持 npm / git / tarball）
- ✅ 官方发现渠道：npm + GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic（**无官方内置市场**）

## ✨ 为什么选这个目录

已经有多个 `awesome-dsh-*` 列表，本目录的不同在于：

- **14 个手选自研分类**，边界清晰（见 [分类定义](docs/taxonomy.md)），不是一锅乱炖
- **每条附 star + 安装命令**，一眼判断热度、一键安装
- **双语**（英文主 + 中文），一键切换
- **README 内折叠浏览**，不用跳转就能看完全部分类
- **机器可读数据**（[data/plugins.json](data/plugins.json)）+ 生成脚本 + 自动同步 CI

## ⚡ 快速开始

三种用法，任选其一：

1. **浏览**：展开下方任意分类（或点进分类文件），每条插件点链接直达 GitHub 仓库。
2. **搜索**：在仓库页按 `t`（或 `Ctrl+F`）搜关键词，如 `mcp`、`记忆`、`TUI`、`飞书`、`多Agent`。
3. **机器消费**：直接读 [`data/plugins.json`](data/plugins.json)（334 条结构化数据，字段说明见 [data/README.md](data/README.md)）。

## 🔥 热门插件

按 GitHub star 排序的社区热门：

| # | 插件 | 描述 | ⭐ |
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

## 📊 统计

| 指标 | 数值 |
|---|---|
| 收录插件条目 | **280+** 条（去重后 250+ 个插件） |
| 分类 | **14** 个一级分类 |
| 生态规模参考 | topic `dsh-plugin` 约 505 仓库 · 本仓库种子数据 334 · 兼容雷达追踪 286+ |

## 🗂 分类目录

| # | 分类 | 说明 | 文件 |
|---|---|---|---|
| 1 | 🛠️ [工具类 Tools](plugins/tools.md) | 确定性工具集、git、测试、安全删除等 | `plugins/tools.md` |
| 2 | 🧩 [技能类 Skills](plugins/skills.md) | 工程纪律、技能迁移、书转技能等 | `plugins/skills.md` |
| 3 | 🔌 [MCP 接入](plugins/mcp.md) | MCP 服务器管理、webfetch、视觉 MCP 等 | `plugins/mcp.md` |
| 4 | 🎨 [Web UI / 皮肤 / 主题](plugins/ui-themes.md) | 皮肤、主题、生成式 UI、输入增强等 | `plugins/ui-themes.md` |
| 5 | 🖥️ [桌面端 / TUI / 移动端](plugins/desktop-tui-mobile.md) | 桌面壳、终端 TUI、移动端、桌宠等 | `plugins/desktop-tui-mobile.md` |
| 6 | 🤖 [Agent 编排 / 多 Agent](plugins/agent-orchestration.md) | 多 Agent 团队、工作流、跨会话消息等 | `plugins/agent-orchestration.md` |
| 7 | 🧠 [上下文 / 记忆](plugins/context-memory.md) | 长期记忆、上下文压缩/审计、蒸馏等 | `plugins/context-memory.md` |
| 8 | 👁️ [多模态 / 视觉](plugins/multimodal.md) | 视觉工具箱、OCR、截图对比、电脑控制等 | `plugins/multimodal.md` |
| 9 | 🔁 [工作流 / 自动化](plugins/workflow-automation.md) | 深度研究、定时任务、条件唤醒等 | `plugins/workflow-automation.md` |
| 10 | 📡 [通知 / 渠道 / 远程](plugins/notifications-channels.md) | Telegram/微信/飞书机器人、SSH 等 | `plugins/notifications-channels.md` |
| 11 | 🌐 [浏览器 / 搜索](plugins/browser-search.md) | 浏览器操控、网页抓取、搜索提供方等 | `plugins/browser-search.md` |
| 12 | 🏗️ [基础设施 / 插件管理 / 开发工具](plugins/infrastructure-dev.md) | 插件管理器、健康检查、沙箱、遥测等 | `plugins/infrastructure-dev.md` |
| 13 | 🎮 [娱乐 / 其他](plugins/fun-other.md) | 小游戏、桌宠、股票、教学、设计等 | `plugins/fun-other.md` |
| 14 | 🏛️ [官方核心与元项目](plugins/official-meta.md) | 核心仓库、awesome 列表、兼容雷达、hub | `plugins/official-meta.md` |

## 📚 全部插件

展开任意分类即可在当前页面浏览该分类下的所有插件，无需跳转。

🛠️ 工具类 Tools · 30

| 插件 | 描述 | ⭐ | 安装命令 |
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

🧩 技能类 Skills · 16

| 插件 | 描述 | ⭐ | 安装命令 |
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

🔌 MCP 接入 · 9

| 插件 | 描述 | ⭐ | 安装命令 |
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

🎨 Web UI / 皮肤 / 主题 · 38

| 插件 | 描述 | ⭐ | 安装命令 |
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
| [dsh-model-selector](https://github.com/bitterSmilezzz/dsh-model-selector) | provider 分组折叠 + 名称搜索的模型选择器增强 | 1 | `dsh plugin add dsh-model-selector` |
| [dsh-local-filetree](https://github.com/Mongfayi/dsh-local-filetree) | 右侧详情列显示当前会话工作区文件树（懒加载、只读） | 2 | `dsh plugin add dsh-local-filetree` |
| [dsh-sticky-disclosure](https://github.com/Han-1413141/dsh-sticky-disclosure) | 把滚出屏幕的折叠标签（Think/工具卡）钉在视口顶部 | 2 | `dsh plugin add dsh-sticky-disclosure` |
| [dsh-token-usage](https://github.com/hashdiana/dsh-token-usage) | 更美观的 Token 用量条：上下文占用/输入输出/缓存分解/首字延迟 | 2 | `dsh plugin add dsh-token-usage` |
| [dsh-model-config-sync](https://github.com/LiangYin233/dsh-model-config-sync) | 高级模型配置器：把 pi-ai 预设一键应用到自定义提供商 | 2 | `dsh plugin add dsh-model-config-sync` |
| [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) | DSH Web UI 插件与皮肤集合：任务看板、Git 图谱、右侧面板、移动端远程、皮肤中心 | 1880 | `dsh plugin add dsh-web-ui` |
| [dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) | 对话内生成式 UI：模型把交互式 HTML 卡片直接画进会话流，带流式预览 | 82 | `dsh plugin add @dsh-external/dsh-visualize` |
| [dsh-genui](https://github.com/omdsh-dev/dsh-genui) | 助手回复内渲染交互式 UI 组件：布局、图表、表单、测验、mermaid、3D 场景 | 73 | `dsh plugin add @omdsh-dev/dsh-genui` |
| [web-components](https://github.com/omdsh-dev/web-components) | Web Components 支持 | 2 | `dsh plugin add @deepseek-ai/dsh-client-web-component` |
| [dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) | OpenPencil 设计预览与编辑（Agent 操作真实设计画布） | 66 | `dsh plugin add @zseven-w/dsh-openpencil` |

🖥️ 桌面端 / TUI / 移动端 · 25

| 插件 | 描述 | ⭐ | 安装命令 |
|---|---|---|---|
| [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | Claude Code 风格全屏交互终端：像素鲸鱼顶栏、流式思考展开、双击 Esc 回滚、上下文/TPS 仪表 | 876 | `dsh plugin add dsh-cc-tui` |
| [dsh-tianshu-tui](https: