<div align="center">

<img src="assets/brand-icon.png" width="72" height="72" alt="dshplugin.me icon">

# dsh-plugin-radar

**Find · Vet · Install — DSH plugins, with a security scan before anything touches your profile.**

[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue)](LICENSE)
[![DSH bundle](https://img.shields.io/badge/DSH-bundle%20%2B%20skill-0d9488)](#install)
[![Indexed plugins](https://img.shields.io/badge/indexed-118%20plugins-0f172a)](#indexed-plugins)
[![dshplugin.me](https://dshplugin.me/badge.svg)](https://dshplugin.me)

English | [简体中文](README.zh.md)

<img src="assets/banner.png" alt="dsh-plugin-radar banner" width="720">

</div>

Ask DSH *"is there a plugin that can…"* and this plugin searches the live [`dsh-plugin` GitHub topic](https://github.com/topics/dsh-plugin) with server-side keyword filtering, cross-checks candidates against two curated registries, then runs a **pre-install security scan** — lifecycle scripts, external domains, subprocesses, credential reads, prompt injection — reports findings either way, and only installs after you say go.

It also works in reverse: already eyeing a plugin? Ask *"is XX safe to install?"* and it runs the same checklist and hands you the report.

## Install

### As a DSH bundle (recommended)

```sh
cd <your-dsh-source-checkout>
pnpm dsh plugin --profile <profile> add 'github:dshplugin-me/dsh-plugin-radar'
```

Plain JavaScript, zero build step — no `allowBuilds` entry needed. The plugin registers the `plugin-radar` skill at runtime.

### As a plain skill

Copy `skills/plugin-radar/` into any skill discovery root:

| Scope | Destination |
| --- | --- |
| Global | `$DSH_HOME/skills/plugin-radar/` |
| Current project | `<project>/.dsh/skills/plugin-radar/` |
| Shared agents root | `${DSH_AGENTS_HOME:-~/.agents}/skills/plugin-radar/` |

The directories are watched — it takes effect on placement, no restart.

Or just tell DSH:

```text
Install the plugin-radar skill from https://github.com/dshplugin-me/dsh-plugin-radar
```

## How it differs from other find-style skills

1. **Server-side filtered search.** It queries `topic:dsh-plugin <keywords>` sorted by stars — a few KB of relevant repos, not the whole topic (4,000+ repos) dumped into context. GitHub search has a hard 1,000-result window; when a result set is truncated, the output says `truncated: true` instead of presenting a slice as the full picture.
2. **Two curated registries cross-checked.** Roughly a third of the topic pool is placeholder or topic-squatting repos. Candidates are checked against the human-gated [awesome-dsh-plugin](https://awesome-dsh-plugin.com) list and [dshplugin.me](https://dshplugin.me) plugin profiles (use cases, limitations, dependency pre-scan, alternatives) before falling back to reading the repo directly.
3. **The security scan is a pipeline step, not a footnote.** Bundles get a code-attack-surface checklist; skills get an instruction-layer checklist (prompt injection, exfiltration). Reports quote suspicious source verbatim and always close with *"no findings does not mean no risk"* — [public research](https://github.com/NVIDIA/SkillSpector) found 26.1% of agent skills contain vulnerabilities and 5.2% show likely malicious intent, so this step is not optional.

## Badge for plugin authors

Is your plugin listed below? Add the badge to your README — it links readers to your plugin's profile page (use cases, limitations, security signals):

```markdown
[![Indexed on dshplugin.me](https://dshplugin.me/badge.svg)](https://dshplugin.me/plugins/<your-slug>/)
```

[![Indexed on dshplugin.me](https://dshplugin.me/badge.svg)](https://dshplugin.me)

Find your slug via the search box on [dshplugin.me](https://dshplugin.me) — it's the last path segment of your profile URL.

## Submit your plugin

Missing from the list? We index public GitHub repos that:

- are a real, working DeepSeek Harness plugin or skill (a `dsh.bundle` declaration in `package.json`, a mountable Cordis plugin, or a `SKILL.md` bundle) — not a placeholder or a README-only repo;
- carry the [`dsh-plugin` topic](https://github.com/topics/dsh-plugin) on GitHub;
- have a description that says what the plugin does, without marketing superlatives.

[**Open an issue**](https://github.com/dshplugin-me/dsh-plugin-radar/issues/new?title=Submit%3A%20owner%2Frepo&body=Repo%3A%20https%3A%2F%2Fgithub.com%2F%3Cowner%3E%2F%3Crepo%3E%0AWhat%20it%20does%3A%20) with your repo link, or send a PR editing the list below. Every submission gets the same security review this plugin performs before install; findings are shared in the issue.

## Indexed plugins

118 plugins verified alive and indexed on [dshplugin.me](https://dshplugin.me), grouped by primary category, sorted by stars. Each entry links to its profile page with use cases, limitations, and security signals.

### Developer Tools

- [titanwings/dsh-automation](https://github.com/titanwings/dsh-automation) — DSH 自动化插件：让 Coding 任务按计划在全新 Agent Session 中运行，并由用户或 Agent 创建和管理定时任务。 / Run coding tasks in fresh Agent sessions and manage schedules from DSH Web or an Agent. [↗ profile](https://dshplugin.me/plugins/dsh-automation/)
- [Sqhao-O/dsh-docs](https://github.com/Sqhao-O/dsh-docs) — Fully local document intelligence for DeepSeek Harness. Parse PDF, Office files, images, and scanned documents with offline OCR. | DeepSeek Harness 全本地文档智能插件，支持 PDF、Office、图片与离线 OCR. [↗ profile](https://dshplugin.me/plugins/dsh-docling/)
- [omdsh-dev/fabric](https://github.com/omdsh-dev/fabric) — 一种类似MC Fabric的hook处理器. [↗ profile](https://dshplugin.me/plugins/fabric/)
- [dingkaihu63/dsh-robotic-harness](https://github.com/dingkaihu63/dsh-robotic-harness) — Robotic Harness: embodied-intelligence research tools for DeepSeek Harness - robot asset inspection, MuJoCo pick-place simulation with fault injection, evidence-based diagnostics, and reproducible experiment bundles. [↗ profile](https://dshplugin.me/plugins/dsh-robotic-harness/)
- [Dasooul03/dsh-plugin-deepseek-pricing](https://github.com/Dasooul03/dsh-plugin-deepseek-pricing) — DSH Price Monitor（价格监控）· DeepSeek 实时定价、峰谷自动切换与会话费用监控的 dsh 插件. [↗ profile](https://dshplugin.me/plugins/dsh-plugin-deepseek-pricing/)
- [bujue600-arch/dsh-testgen](https://github.com/bujue600-arch/dsh-testgen) — Automated unit-test generation for DeepSeek Harness: /testgen command + generate_tests tool that scaffold, run, and fix unit tests until they pass. [↗ profile](https://dshplugin.me/plugins/dsh-testgen/)
- [baidd1011/dsh-code-impact](https://github.com/baidd1011/dsh-code-impact) — 面向 DeepSeek Harness 的只读 TypeScript/JavaScript 代码变更影响分析插件 Read-only TypeScript/JavaScript change impact analysis plugin for DeepSeek Harness. [↗ profile](https://dshplugin.me/plugins/dsh-code-impact/)
- [reina4xa/dsh-plugin-reload](https://github.com/reina4xa/dsh-plugin-reload) — Deepseek harness plugin for reloading your deepseek harness plugin (e.g. mcp-client). [↗ profile](https://dshplugin.me/plugins/dsh-plugin-reload/)
- [SnowAmberX/dsh-role-router](https://github.com/SnowAmberX/dsh-role-router) — Role-based model routing plugin for DeepSeek Harness: planner/subagent roles plus a settings card and composer summary. [↗ profile](https://dshplugin.me/plugins/dsh-role-router/)
- [SailingLoong/loongport-dsh](https://github.com/SailingLoong/loongport-dsh) — LoongPort npm setup CLI for DeepSeek Harness (dsh) OpenAI-compatible routes. [↗ profile](https://dshplugin.me/plugins/loongport-dsh/)
- [MicroHEROX/dsh-koboldcpp-hands](https://github.com/MicroHEROX/dsh-koboldcpp-hands) — KoboldCpp for DeepSeek Harness - a tool plugin that lets the harness online model hand repetitive text and vision (OCR) labor to a local KoboldCpp (llama.cpp) server. [↗ profile](https://dshplugin.me/plugins/dsh-koboldcpp-hands/)
- [samecorner/dsh-git-graph](https://github.com/samecorner/dsh-git-graph) — GitKraken/vscode-git-graph style commit graph for dsh web: server-side git tools + interactive commit DAG and diff card rendered in the conversation. [↗ profile](https://dshplugin.me/plugins/dsh-git-graph/)

### UI & Productivity

- [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) ⭐2850 — Plugin and skin collection for DeepSeek Harness (DSH) Web UI - task board, git graph, right-side panel, remote mobile UI, pet, live token stats, and skin center. [↗ profile](https://dshplugin.me/plugins/dsh-web-ui/)
- [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) ⭐1346 — 一个侧边栏的完整工作台，支持三方拓展注册新侧边栏页面。内置文件渲染编辑/终端/Git/子代理. [↗ profile](https://dshplugin.me/plugins/dsh-better-sidebar/)
- [ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) ⭐1325 — DSH 官方公众号收录的 TUI 补位插件：Claude Code 风，鲸鱼顶栏/实时状态/流式思考/双击 Esc 回滚/上下文进度+TPS。npm 一键装。 DSH official WeChat featured TUI plugin — Claude Code style: whale bar, live status, streaming thoughts, double-Esc rollback, context bar + TPS. npm one-click. [↗ profile](https://dshplugin.me/plugins/dsh-cc-tui/)
- [Nagi-ovo/dsh-ads](https://github.com/Nagi-ovo/dsh-ads) ⭐422 — 把 DSH 变成 2005 年门户网站｜Parody ads, fake games, and popups for the DSH Web UI. [↗ profile](https://dshplugin.me/plugins/dsh-ads/)
- [dsh-market/dsh-market](https://github.com/dsh-market/dsh-market) ⭐338 — The plugin market inside DeepSeek Harness — browse, search, one-click install · DSH 可视化插件市场. [↗ profile](https://dshplugin.me/plugins/dsh-market/)
- [omdsh-dev/dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) ⭐230 — Codex-style @file mentions for DeepSeek Harness: search workspace files in the composer and attach their contents to prompts. [↗ profile](https://dshplugin.me/plugins/dsh-at-file/)
- [huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) ⭐175 — dsh-tianshu-tui — DeepSeek Harness terminal UI +harness workflow。是官方 DeepSeek Harness 上的交互式终端 UI 插件。渲染核心从本仓库自研的harness agent Tianshu-Tui 演进而来，在官方的基础上增加了TDD、证据门、视觉图像模块等工作流。. [↗ profile](https://dshplugin.me/plugins/dsh-tianshu-tui/)
- [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) ⭐126 — 在 DSH 对话中生成交互式可视化｜Render model-generated interactive cards inside DSH conversations. [↗ profile](https://dshplugin.me/plugins/dsh-visualize/)
- [Sanqi-normal/dsh-webui-market-plugin](https://github.com/Sanqi-normal/dsh-webui-market-plugin) — dsh Web GUI 社区插件市场：浏览 awesome-dsh-plugin.com 插件目录，一键安装/卸载到 profile。Community plugin market for the DeepSeek Harness (dsh) web GUI: browse, install and uninstall plugins into a profile. [↗ profile](https://dshplugin.me/plugins/dsh-webui-market-plugin/)
- [bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context) — A DeepSeek Harness plugin for Context insight dashboard — showing what the model's context window is made of and how it evolves. [↗ profile](https://dshplugin.me/plugins/dsh-context/)
- [HsiangNianian/dsh-auto-continue](https://github.com/HsiangNianian/dsh-auto-continue) — DSH Web UI plugin: auto-sends 「继续」 to resume requests interrupted by network errors or other non-human causes — error classification, adaptive backoff, templated continue text, browser notifications, all configurable from the settings card. [↗ profile](https://dshplugin.me/plugins/dsh-auto-continue/)
- [tianji-qingtian/dsh-composer-polish](https://github.com/tianji-qingtian/dsh-composer-polish) — DeepSeek Harness plugin: one-click ✨ polish for composer drafts — flash rewrite, auto fill-back · DeepSeek Harness 插件：输入框草稿一键 ✨ 润色，flash 改写、自动回填. [↗ profile](https://dshplugin.me/plugins/dsh-composer-polish/)
- [LiangYin233/dsh-provider-model-configurator](https://github.com/LiangYin233/dsh-provider-model-configurator) — DSH 模型 Pro:为 DSH WebUI 提供将 pi-ai 预设或任意已配置提供商的模型上下文、输出上限、推理档位与兼容开关一键应用到目标提供商,并集中查看、新建、编辑、复制与删除各提供商模型条目的能力。. [↗ profile](https://dshplugin.me/plugins/dsh-provider-model-configurator/)
- [bpc-oss/dsh-web-billing](https://github.com/bpc-oss/dsh-web-billing) — RMB/USD token-billing plugin for DeepSeek Harness (dsh web): official-policy auto pricing with peak/off-peak hours, per-message ledger, account balance, locale-driven currency display. 人民币/美元 token 计费插件. [↗ profile](https://dshplugin.me/plugins/dsh-web-billing/)
- [Starfie1d1272/dsh-builtin-toggles](https://github.com/Starfie1d1272/dsh-builtin-toggles) — Evidence-backed built-in capability inspector with fail-closed controls for DeepSeek Harness Web. [↗ profile](https://dshplugin.me/plugins/dsh-builtin-toggles/)
- [610la/dsh-notification-center](https://github.com/610la/dsh-notification-center) — DSH 通知中心插件：对话/任务完成、报错、等待批准等事件触发浏览器通知 + 21 种匹配音效. [↗ profile](https://dshplugin.me/plugins/dsh-notification-center/)
- [orxz/deepseek-harness-themes](https://github.com/orxz/deepseek-harness-themes) — A collection of UI themes for deepseek-harness. [↗ profile](https://dshplugin.me/plugins/deepseek-harness-themes/)
- [HuanLinOTO/dsh-plugin-aigc-canvas](https://github.com/HuanLinOTO/dsh-plugin-aigc-canvas) — provider-agnostic AIGC HTTP 桥 + 无限画布 + ffmpeg 后处理，13 个工具含画布连边/reroll/媒体编辑 | Provider-agnostic AIGC HTTP bridge + infinite canvas + ffmpeg post-processing; 13 tools incl. canvas linking/reroll/media-edit. [↗ profile](https://dshplugin.me/plugins/dsh-plugin-aigc-canvas/)
- [juhe291/dsh-token-panel](https://github.com/juhe291/dsh-token-panel) — A corner HUD for DeepSeek Harness that shows your session's token pressure, per-model cost, and daily/monthly usage at a glance, with an editable budget and balance that tracks spending for you. 右下角常驻的 Token 仪表盘：实时看会话压力、按模型估算花费。预算和余额点一下就能改，每天每月用了多少都有记录。. [↗ profile](https://dshplugin.me/plugins/dsh-token-panel/)
- [0xsline/dsh-spotlight](https://github.com/0xsline/dsh-spotlight) — Keyboard-first command palette for DeepSeek Harness Web. [↗ profile](https://dshplugin.me/plugins/dsh-spotlight/)
- [ltao0829/dsh-task-notify](https://github.com/ltao0829/dsh-task-notify) — DeepSeek Harness task-completion reminder plugin. [↗ profile](https://dshplugin.me/plugins/dsh-task-notify/)
- [sanshanya/better-model-provider](https://github.com/sanshanya/better-model-provider) — Per-model capability declaration for DeepSeek Harness: reasoning-effort levels (wire spellings) + request modalities (vision) for OpenAI-compatible providers. Settings section, zero runtime harness deps, no YAML. [↗ profile](https://dshplugin.me/plugins/better-model-provider/)
- [a903067276-rgb/dsh-hud](https://github.com/a903067276-rgb/dsh-hud) — HUD status panel plugin for DeepSeek Harness (dsh) web: git status, MCP servers, skills, model & token usage in a floating panel. [↗ profile](https://dshplugin.me/plugins/dsh-hud/)
- [qichuang321/dsh-plugin-browser](https://github.com/qichuang321/dsh-plugin-browser) — A DSH plugin that inventories plugins loaded in the current profile through an agent tool and a web settings page. [↗ profile](https://dshplugin.me/plugins/dsh-plugin-browser/)
- [luoyu-xingu/dsh-background](https://github.com/luoyu-xingu/dsh-background) — DeepSeek Harness Web 背景图片插件:本地图片路径替换网页背景,外观设置行 + 实时预览. [↗ profile](https://dshplugin.me/plugins/dsh-background/)
- [quan2005/dsh-plugin-jinji](https://github.com/quan2005/dsh-plugin-jinji) — 把「记忆」带进 DeepSeek Harness：极简文本记忆系统，双轨记忆（流水日志 + 人物/产品实体画像），大模型为核心驱动。无需安装其他软件，无需编译，无第三方依赖。. [↗ profile](https://dshplugin.me/plugins/dsh-plugin-jinji/)
- [0xKcyzz/dsh-plugin-store](https://github.com/0xKcyzz/dsh-plugin-store) — DeepSeek Harness 插件商店：浏览、搜索、筛选并一键安装 dsh-plugin 生态插件. [↗ profile](https://dshplugin.me/plugins/dsh-plugin-store-w769721503/)
- [wuwuzhige-sudo/dsh-terminal-panel](https://github.com/wuwuzhige-sudo/dsh-terminal-panel) — A manual Terminal tab for the DeepSeek Harness (dsh) web UI — run commands on the host machine, persistent cwd, sudo password prompt, command history.现在可以在web界面内直接执行命令行了. [↗ profile](https://dshplugin.me/plugins/dsh-terminal-panel/)
- [lco117/dsh-think-any-lang](https://github.com/lco117/dsh-think-any-lang) — DeepSeek Harness (DSH) plugin: a "Thinking Language" selector under Settings → General that tells the model which language to reason in (chain of thought) via a system-prompt section. Zero extra calls, zero latency, 12 languages. [↗ profile](https://dshplugin.me/plugins/dsh-think-any-lang/)
- [sundusk/dsh-waterball-pet](https://github.com/sundusk/dsh-waterball-pet) — A floating water-ball pet plugin for the DeepSeek Harness Web UI. [↗ profile](https://dshplugin.me/plugins/dsh-waterball-pet/)
- [Frost-Reed/blocker-notify](https://github.com/Frost-Reed/blocker-notify) — dsh-blocker-notify — Real-time attention alerts for DeepSeek Harness: a global banner + flashing workspace entries when the agent is blocked (approval request / sandbox denial). [↗ profile](https://dshplugin.me/plugins/blocker-notify/)
- [beijingwahw/dsh-conv-export](https://github.com/beijingwahw/dsh-conv-export) — dsh-conv-export（对话导出）— export the current DeepSeek Harness conversation as Markdown, PDF, or a long PNG image. [↗ profile](https://dshplugin.me/plugins/dsh-conv-export/)
- [Niuniu-Sir/dsh-data-ledger](https://github.com/Niuniu-Sir/dsh-data-ledger) — 数据台账：DeepSeek Harness 本地数据统一看板——对话/账本/技能/记忆/日志的来源、位置与内容摘要，回收站删除、浏览器存储清理（dsh-plugin）. [↗ profile](https://dshplugin.me/plugins/dsh-data-ledger/)
- [KekuKase/dsh-deepseek-status](https://github.com/KekuKase/dsh-deepseek-status) — DSH 侧边栏实时显示 DeepSeek 官方服务状态（status.deepseek.com）| Live DeepSeek official service status in the DSH sidebar. [↗ profile](https://dshplugin.me/plugins/dsh-deepseek-status/)
- [Blackspace2/dsh-math-copy](https://github.com/Blackspace2/dsh-math-copy) — 在 dsh web 中复制数学公式. [↗ profile](https://dshplugin.me/plugins/dsh-math-copy/)
- [TableRogue/dsh-message-navigator](https://github.com/TableRogue/dsh-message-navigator) — 消息导航条 Message Navigator: DeepSeek Harness 网页聊天界面右侧的垂直消息索引(动态 Cordis 插件). [↗ profile](https://dshplugin.me/plugins/dsh-message-navigator/)
- [bilbillm/dsh-motion](https://github.com/bilbillm/dsh-motion) — Restrained, semantic interface motion for DeepSeek Harness. [↗ profile](https://dshplugin.me/plugins/dsh-motion/)
- [Luaphes/dsh-plugins-market](https://github.com/Luaphes/dsh-plugins-market) — An installable DeepSeek Harness marketplace UI for discovering, filtering, and installing DSH plugins from GitHub. [↗ profile](https://dshplugin.me/plugins/dsh-plugins-market/)
- [jilian-dsh/dsh-rules-manager](https://github.com/jilian-dsh/dsh-rules-manager) — Rules & commands manager for DeepSeek Harness: /rules command + settings panel + custom commands. [↗ profile](https://dshplugin.me/plugins/dsh-rules-manager/)
- [pineapple880066/dsh-webUI-pets](https://github.com/pineapple880066/dsh-webUI-pets) — Codex-style desktop pets for the DeepSeek Harness Web UI / 类似 Codex 的 DeepSeek Harness Web UI 桌宠. [↗ profile](https://dshplugin.me/plugins/dsh-webui-pets/)
- [oceanxuikun/dsh-eva-theme-plugin](https://github.com/oceanxuikun/dsh-eva-theme-plugin) — Evangelion-inspired theme plugin for DSH WebUI, featuring Unit-00, Unit-01, and Unit-02 themes with immersive backgrounds and mecha-style UI effects. [↗ profile](https://dshplugin.me/plugins/dsh-eva-theme-plugin/)
- [ByronLeeeee/dsh-legal-dashboard](https://github.com/ByronLeeeee/dsh-legal-dashboard) — Matter-aware legal workspace dashboard and document agent tools for DeepSeek Harness. [↗ profile](https://dshplugin.me/plugins/dsh-legal-dashboard/)
- [YohtHill/dsh-plugin-greeter](https://github.com/YohtHill/dsh-plugin-greeter) — A DeepSeek Harness (dsh) plugin that greets you at the start of every session with varied wording, and remembers your name. [↗ profile](https://dshplugin.me/plugins/dsh-plugin-greeter/)
- [woshi-Tom/dsh-status-plugin](https://github.com/woshi-Tom/dsh-status-plugin) — dsh status plugin；可以方便的查看宿主机的运行状态，故障时方便排查. [↗ profile](https://dshplugin.me/plugins/dsh-status-plugin/)
- [xiaoso456/dsh-turn-navigator](https://github.com/xiaoso456/dsh-turn-navigator) — Jump between conversation turns in the DeepSeek Harness web UI. [↗ profile](https://dshplugin.me/plugins/dsh-turn-navigator/)
- [ChengChe106/dsh-web-auto-open](https://github.com/ChengChe106/dsh-web-auto-open) — DSH plugin: auto-open the default browser when `dsh web` starts — cross-platform (Windows/macOS/Linux). [↗ profile](https://dshplugin.me/plugins/dsh-web-auto-open/)
- [leaveimagination/dsh-qwen-voice](https://github.com/leaveimagination/dsh-qwen-voice) — Voice control and multi-session task dispatch for DeepSeek Harness, powered by Qwen Audio Agent. [↗ profile](https://dshplugin.me/plugins/dsh-qwen-voice/)
- [yuanzehui313/dsh-workspace-enhance](https://github.com/yuanzehui313/dsh-workspace-enhance) — DeepSeek Harness workspace & session enhancement plugin: recycle bin, cross-workspace drag, ungrouped sessions, multi-folder roots, session merge. [↗ profile](https://dshplugin.me/plugins/dsh-workspace-enhance/)

### Skills & Workflows

- [multica-ai/dsh-multica-runtime](https://github.com/multica-ai/dsh-multica-runtime) — Support dsh runtime on Multica. [↗ profile](https://dshplugin.me/plugins/dsh-multica-runtime/)
- [Nwflower/dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) — 从Claude Code、Codex、Reasonix等Agent工具导入迁移历史消息，并在DeepSeek Harness(DSH)中继续对话. [↗ profile](https://dshplugin.me/plugins/dsh-chat-import/)
- [lire1131/dsh-undo-plugin](https://github.com/lire1131/dsh-undo-plugin) — DSH crash-rescue plugin: undo config & plugin-code changes, secret-safe snapshots, one-click SAFE MODE, plus offline CLI/GUI that work even when DSH won't boot. [↗ profile](https://dshplugin.me/plugins/dsh-undo-plugin/)
- [fuhefei/dsh-sentinel](https://github.com/fuhefei/dsh-sentinel) — Condition-driven wakeup for DeepSeek Harness: durable file/command/http/process/webhook watches that wake the agent, with dock, sidebar branch, and a global dashboard. [↗ profile](https://dshplugin.me/plugins/dsh-sentinel/)
- [imetn/dsh-lark-bridge](https://github.com/imetn/dsh-lark-bridge) — Bidirectional Lark/Feishu controller for DeepSeek Harness. [↗ profile](https://dshplugin.me/plugins/dsh-lark-bridge/)
- [hyqhyq3/dsh-mcp-manager](https://github.com/hyqhyq3/dsh-mcp-manager) — MCP server manager plugin for DeepSeek Harness: Settings → MCP page, OAuth (PKCE + dynamic client registration) or static-token auth, tools registered as mcp__<name>__*. [↗ profile](https://dshplugin.me/plugins/dsh-mcp-manager/)
- [fakechris/dsh-track](https://github.com/fakechris/dsh-track) — DSH Track Bridge 插件：嵌入式任务管理引擎——决策点协议、念头捕获墙、Linear 形 issue 存储（bundle），AI 与人之间的任务轨道. [↗ profile](https://dshplugin.me/plugins/dsh-track/)
- [sliverp/DeepSeek-harness-wecom](https://github.com/sliverp/DeepSeek-harness-wecom) — WeCom AI Bot text and image bridge for DeepSeek Harness. [↗ profile](https://dshplugin.me/plugins/deepseek-harness-wecom/)
- [dpskh/dsh-a2a](https://github.com/dpskh/dsh-a2a) — Agent2Agent mesh for the Harness. [↗ profile](https://dshplugin.me/plugins/dsh-a2a/)
- [ziyou979/dsh-llm-oauth](https://github.com/ziyou979/dsh-llm-oauth) — DeepSeek Harness plugin: OAuth / subscription-plan LLM providers (Grok, GitHub Copilot, OpenAI Codex, Anthropic, OpenRouter). [↗ profile](https://dshplugin.me/plugins/dsh-llm-oauth/)
- [PerryLink/dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) — Claude Code /rewind for DeepSeek Harness — git-first workspace snapshots before every mutation, turn-boundary session forks, one-shot /rewind restore. A dsh-plugin capability seam. [↗ profile](https://dshplugin.me/plugins/dsh-checkpoint-rewind/)
- [jkrandom-sudo/dsh-ci-doctor](https://github.com/jkrandom-sudo/dsh-ci-doctor) — CI failure, diagnosed before you open the logs — DeepSeek Harness plugin that watches GitHub Actions for new failures and turns raw logs into structured diagnosis cards · CI 失败，打开日志前就完成诊断 —— DSH 插件：监视 GitHub Actions 新失败，原始日志转结构化诊断卡，签名账本识别复发问题. [↗ profile](https://dshplugin.me/plugins/dsh-ci-doctor/)
- [xiaoxiaosrm/dsh-mattpocock-skills](https://github.com/xiaoxiaosrm/dsh-mattpocock-skills) — Unofficial DSH port of mattpocock/skills — Engineering (18) + Productivity (7) skills as a DeepSeek Harness bundle plugin. MIT, © Matt Pocock. Star the upstream repo!. [↗ profile](https://dshplugin.me/plugins/dsh-mattpocock-skills/)
- [xwh-01/dsh-mediacrawler](https://github.com/xwh-01/dsh-mediacrawler) — Installable DeepSeek Harness profile bundle and bounded MCP adapter for MediaCrawler. [↗ profile](https://dshplugin.me/plugins/dsh-mediacrawler/)
- [Letter2025/dsh-model-failover](https://github.com/Letter2025/dsh-model-failover) — Two-level model circuit breaker with failover for DeepSeek Harness: trip a model or a whole provider after repeated request failures and route the next request to a configured fallback. [↗ profile](https://dshplugin.me/plugins/dsh-model-failover/)
- [bwndlct/dsh-session-export](https://github.com/bwndlct/dsh-session-export) — Export DeepSeek Harness (DSH) sessions to portable Markdown and JSON — dsh plugin. [↗ profile](https://dshplugin.me/plugins/dsh-session-export/)
- [YLifeOnlyOnce/dsh-smarthome](https://github.com/YLifeOnlyOnce/dsh-smarthome) — Home Assistant control for DeepSeek Harness agents — approval-gated lights, switches, climate. 给 DeepSeek Harness agent 的 Home Assistant 控制插件，一键接入智能家居，一键接入智能生活。. [↗ profile](https://dshplugin.me/plugins/dsh-smarthome/)
- [TtTRz/dsh-wecom](https://github.com/TtTRz/dsh-wecom) — WeCom AI Bot channel for DeepSeek Harness — every chat runs a persistent, preset-backed agent with real tools. [↗ profile](https://dshplugin.me/plugins/dsh-wecom/)
- [2303572348/deepseek-harness-memory](https://github.com/2303572348/deepseek-harness-memory) — A DeepSeek Harness long-term memory plugin using Markdown files, MEMORY.md indexes, prompt injection, and a memory management tool. [↗ profile](https://dshplugin.me/plugins/deepseek-harness-memory/)
- [dpskh/dsh-checkpoint](https://github.com/dpskh/dsh-checkpoint) — Mark an exploration start in the session; pairs with rewind to fold the exploration out of context. [↗ profile](https://dshplugin.me/plugins/dsh-checkpoint/)
- [PerryLink/dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) — Double-check before you ship: grill the requirements, test the implementation, prove the delivery. An engineering-discipline bundle for DeepSeek Harness. [↗ profile](https://dshplugin.me/plugins/dsh-doublecheck/)
- [dpskh/dsh-rewind](https://github.com/dpskh/dsh-rewind) — Fold everything since the last checkpoint mark into an auto-generated report, replacing it in context while keeping the full log. [↗ profile](https://dshplugin.me/plugins/dsh-rewind/)
- [wly8691-jpg/knowlp-rag](https://github.com/wly8691-jpg/knowlp-rag) — KnowLP-RAG: dual knowledge-graph RAG for Markdown notes — dsh plugin add @eqman00003/knowlp-rag · MCP + native Cordis plugin for DeepSeek Harness (dsh) & Claude Code. [↗ profile](https://dshplugin.me/plugins/knowlp-rag/)
- [Temoa/dsh-rules-paths](https://github.com/Temoa/dsh-rules-paths) — Claude Code-style paths: rule injection for DeepSeek Harness (DSH). [↗ profile](https://dshplugin.me/plugins/dsh-rules-paths/)
- [ParticleLight/dsh-ultracode](https://github.com/ParticleLight/dsh-ultracode) — DeepSeek Harness agent preset that adds an UltraCode working mode focused on deep reasoning, plan–execute–verify, and parallel subagent orchestration. [↗ profile](https://dshplugin.me/plugins/dsh-ultracode/)
- [YangCazz/CazzPatent](https://github.com/YangCazz/CazzPatent) — AI patent disclosure drafting plugin for DeepSeek Harness - 8-stage pipeline, LaTeX to OMML, diagram generation, self-improving memory. [↗ profile](https://dshplugin.me/plugins/cazzpatent/)
- [kirkchinese/Claudecode--DSH](https://github.com/kirkchinese/Claudecode--DSH) — To hell with ClaudeCode!. [↗ profile](https://dshplugin.me/plugins/claudecode-dsh/)
- [hccccc01333/dsh-eval](https://github.com/hccccc01333/dsh-eval) — Agent evaluation platform for DeepSeek Harness: benchmark YAML, headless dsh orchestration, trace-based metrics, LLM judge, paired A/B, keyless replay, and cross-harness import. [↗ profile](https://dshplugin.me/plugins/dsh-eval/)
- [XuezuoYS/dsh-IamDeepSeekV4ga](https://github.com/XuezuoYS/dsh-IamDeepSeekV4ga) — 一个基于玄学的让 deepseek 思维链模仿灰测神必模型的 deepseek harness 娱乐插件. [↗ profile](https://dshplugin.me/plugins/dsh-iamdeepseekv4ga/)
- [flymysql/dsh-memory](https://github.com/flymysql/dsh-memory) — Persistent cross-session memory plugin for DeepSeek Harness with agent tools, prompt injection, durable storage, and a browser management page. [↗ profile](https://dshplugin.me/plugins/dsh-memory/)
- [jasper-zsh/dsh-plugin-llm-codex](https://github.com/jasper-zsh/dsh-plugin-llm-codex) — 让 DeepSeek Harness（DSH） 通过 ChatGPT/Codex 订阅调用 openai-codex 模型，无需配置 OpenAI API Key。. [↗ profile](https://dshplugin.me/plugins/dsh-plugin-llm-codex/)
- [truelove-dreamer/dsh-plugin-recall](https://github.com/truelove-dreamer/dsh-plugin-recall) — DeepSeek Harness plugin: cross-session memory for the model. Full-text search all past sessions (SQLite FTS5 via ctx.sessionQuery) and bring the strongest matching excerpts back into the current context — recall earlier decisions, commands, and mistakes. [↗ profile](https://dshplugin.me/plugins/dsh-plugin-recall/)
- [Thomas-key/dsh-skill-manager](https://github.com/Thomas-key/dsh-skill-manager) — Manage DeepSeek Harness skills: list and toggle filesystem skills instantly. [↗ profile](https://dshplugin.me/plugins/dsh-skill-manager/)
- [openHacking/pptkit-presentation](https://github.com/openHacking/pptkit-presentation) — End-user presentation workflows, preview application, and Agent Skill powered by PPTKit. [↗ profile](https://dshplugin.me/plugins/pptkit-presentation/)

### Browser & Web

- [huey1in/reef](https://github.com/huey1in/reef) — DSH 插件全家桶:浏览器自动化 + MCP Server + GitHub/GitLab 自动评审 + 原生嵌入面板 | One install, five modules for DeepSeek Harness: browser automation, MCP server, GitHub & GitLab automation, native in-app panel. [↗ profile](https://dshplugin.me/plugins/trio/)

### Vision

- [liustack/modlens](https://github.com/liustack/modlens) ⭐2001 — The first vision plugin for DeepSeek Harness, and the vision bridge for every text-only coding agent. Paste an image, get structured JSON evidence (OCR, layout, semantics). | 全网第一个 DeepSeek Harness 视觉插件，为 DeepSeek、GLM 等纯文本模型外挂视觉能力，粘贴图片即得结构化 JSON 证据（OCR、版面、语义）。. [↗ profile](https://dshplugin.me/plugins/modlens/)
- [Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) ⭐448 — 让纯文本模型更好地做视觉任务的DeepSeek Harness插件：带意图的图片问答、长截图 OCR、UI 还原等｜DeepSeek Harness-native integration for agent-vision-toolkit: image Q&A, long-screenshot OCR, UI restoration, grounding, pixel diff, Artifacts, and Web UI. [↗ profile](https://dshplugin.me/plugins/dsh-vision-toolkit/)
- [ysr666/dsh-vision-router](https://github.com/ysr666/dsh-vision-router) ⭐175 — Eyes for text-only DeepSeek Harness agents: built-in free vision chain (no key) + pixel-level vision tools (Q&A, grounding, crop, pixel diff, colors, OCR, SVG trace, cutout, screenshots). One-command install, no Python, image turns work like ordinary tool-calling turns. [↗ profile](https://dshplugin.me/plugins/dsh-vision-router/)
- [jyh20030112/dsh-visual-plugin](https://github.com/jyh20030112/dsh-visual-plugin) — Dsh-visual-plugin.Give your text-only model eyes: forward user images to any OpenAI-compatible vision model and see the results in a Web UI right panel. [↗ profile](https://dshplugin.me/plugins/dsh-visual-plugin/)
- [akqwpeter-prog/dsh-media-skills](https://github.com/akqwpeter-prog/dsh-media-skills) — Free vision & image generation for DeepSeek Harness — paste an image into any chat, even text-only sessions. GLM-4V-Flash / Qwen3-VL / Gemini failover chain, ModLens-style structured evidence, Kolors generation. 免费读图·生图 · 三引擎容错 · 无 Key 入库. [↗ profile](https://dshplugin.me/plugins/dsh-media-skills/)
- [PixLunaLab/dsh-pixluna](https://github.com/PixLunaLab/dsh-pixluna) — dsh-plugin-pixluna | 让 DSH 自己看涩图！. [↗ profile](https://dshplugin.me/plugins/dsh-plugin-pixluna/)
- [Sorwcyra/ds-vision-plugin](https://github.com/Sorwcyra/ds-vision-plugin) — Paste images into DeepSeek Harness with a four-model vision race, OCR, and an automatic text bridge. [↗ profile](https://dshplugin.me/plugins/ds-vision-plugin/)
- [cwbcheng/dsh-knowledge-graph](https://github.com/cwbcheng/dsh-knowledge-graph) — DSH Cordis plugin: turn any source text into an AI knowledge graph (facts/inferences/concepts/definitions/examples/counter-examples/rules) with two-way linking between the graph and the original text. [↗ profile](https://dshplugin.me/plugins/dsh-knowledge-graph/)
- [me9rez/dsh-vlm-bridge](https://github.com/me9rez/dsh-vlm-bridge) — DeepSeek Harness (dsh) bundle plugin: vision_analyze tool lets text-only LLM agents read images via SenseNova VLM, with Schemastery config and single-source credentials. [↗ profile](https://dshplugin.me/plugins/dsh-vlm-bridge/)
- [mindcarver/dsh-codex-canvas](https://github.com/mindcarver/dsh-codex-canvas) — DeepSeek Harness plugin: image_gen tool backed by Codex CLI (gpt-image-2). [↗ profile](https://dshplugin.me/plugins/dsh-codex-canvas/)
- [qizhen2021/dsh-plugin-vision](https://github.com/qizhen2021/dsh-plugin-vision) — A DeepSeek Harness vision tool that converts images into text-only OCR, ASCII layout art, and vision-model descriptions. [↗ profile](https://dshplugin.me/plugins/dsh-plugin-vision/)

### Security & Policy

- [BlockRunAI/dsh-clawrouter](https://github.com/BlockRunAI/dsh-clawrouter) — A safety gate for DeepSeek Harness: a stronger model reviews dangerous tool calls before they run. Plus vision and 67 models from one wallet, paid per request over x402. [↗ profile](https://dshplugin.me/plugins/dsh-clawrouter/)
- [Letter2025/dsh-approval-llm](https://github.com/Letter2025/dsh-approval-llm) — Model-based permission approval (approve-for-me) for DeepSeek Harness: an approval/request answerer backed by a separate reviewer model. [↗ profile](https://dshplugin.me/plugins/dsh-approval-llm/)
- [Yuuz12/dsh-webui-auth](https://github.com/Yuuz12/dsh-webui-auth) — WebUI 身份认证：HTTP/传输层强制登录（资源、插件 bundle、/api、WebSocket 四层防护），服务端会话 + HttpOnly Cookie。. [↗ profile](https://dshplugin.me/plugins/dsh-webui-auth/)
- [PerryLink/dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) — Claude Code-style declarative permission rules for DeepSeek Harness: ordered allow/deny/ask rules with tool-name, argument (glob/regex), and workspace-path matching on the tools/pre-execute waterfall, session-log audit, and HMR reload. [↗ profile](https://dshplugin.me/plugins/dsh-permission-rules/)
- [khiqwq/dsh-system-proxy](https://github.com/khiqwq/dsh-system-proxy) — DSH host plugin - smart outbound HTTP(S) routing: named proxies (http/https/socks4/4a/5/5h), per-host/provider/plugin rules, direct-first fallback with health memory (global fetch + node http/https). [↗ profile](https://dshplugin.me/plugins/dsh-system-proxy/)
- [Ox0400/dsh-vault](https://github.com/Ox0400/dsh-vault) — Encrypted credential vault for DeepSeek Harness — AES-256-GCM + TOTP, model tools + Settings UI. [↗ profile](https://dshplugin.me/plugins/dsh-vault/)
- [StyxNether/dsh-auto-approval-plugin](https://github.com/StyxNether/dsh-auto-approval-plugin) — Trusted Auto: a middle permission tier for DeepSeek Harness between workspace-write and danger-full-access, auto-approving harmless commands and trusted-area targets. [↗ profile](https://dshplugin.me/plugins/dsh-auto-approval/)
- [Yee-h/dsh-zen-proxy](https://github.com/Yee-h/dsh-zen-proxy) — dsh plugin: in-process proxy that injects official OpenCode Zen client headers, enabling Zen free models in dsh without the 429 FreeUsageLimitError. [↗ profile](https://dshplugin.me/plugins/dsh-zen-proxy/)

### Remote Execution

- [flymysql/dsh-remote](https://github.com/flymysql/dsh-remote) — Remote-work assistant for DeepSeek Harness (DSH): connect via SSH (key or password), pick a remote workspace, operate with rw_* tools, and SFTP-mirror it into a real local DSH workspace. [↗ profile](https://dshplugin.me/plugins/dsh-remote/)
- [hi-wenw/dsh-telegram-channel](https://github.com/hi-wenw/dsh-telegram-channel) — DeepSeek Harness Telegram mobile remote: bind live Web sessions (Codex-style). Install: dsh plugin add github:hi-wenw/dsh-telegram-channel. [↗ profile](https://dshplugin.me/plugins/dsh-telegram-channel/)
- [yuko0331/DSH-telegram](https://github.com/yuko0331/DSH-telegram) — 通过 Telegram 私聊远程使用和查看 DeepSeek Harness. [↗ profile](https://dshplugin.me/plugins/dsh-telegram/)
- [wikkd/dsh-remote-access-web](https://github.com/wikkd/dsh-remote-access-web) — Installable DeepSeek Harness web-profile bundle for reverse-tunnel remote access, pairing authentication, and remote workspace selection. [↗ profile](https://dshplugin.me/plugins/dsh-remote-access-web/)
## License

[BSD-3-Clause](LICENSE). The plugin list data is free to reuse.
