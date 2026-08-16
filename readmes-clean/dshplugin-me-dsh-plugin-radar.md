![dshplugin.me icon](assets/brand-icon.png)

# dsh-plugin-radar

**Find · Vet · Install — DSH plugins, with a security scan before anything touches your profile.**

[![dshplugin.me](https://dshplugin.me/badge.svg)](https://dshplugin.me)

![dsh-plugin-radar banner](assets/banner.png)

Ask DSH *"is there a plugin that can…"* and this plugin searches the live [`dsh-plugin` GitHub topic](https://github.com/topics/dsh-plugin) with server-side keyword filtering, cross-checks candidates against two curated registries, then runs a **pre-install security scan** — lifecycle scripts, external domains, subprocesses, credential reads, prompt injection — reports findings either way, and only installs after you say go.

It also works in reverse: already eyeing a plugin? Ask *"is XX safe to install?"* and it runs the same checklist and hands you the report.

## Install

### As a DSH bundle (recommended)

```sh
cd <your-dsh-source-checkout>
pnpm dsh plugin --profile  add 'github:dshplugin-me/dsh-plugin-radar'
```

Plain JavaScript, zero build step — no `allowBuilds` entry needed. The plugin registers the `plugin-radar` skill at runtime.

### As a plain skill

Copy `skills/plugin-radar/` into any skill discovery root:

### Scope · Destination
- **Scope**: Global · **Destination**: `$DSH_HOME/skills/plugin-radar/`
- **Scope**: Current project · **Destination**: `/.dsh/skills/plugin-radar/`
- **Scope**: Shared agents root · **Destination**: `${DSH_AGENTS_HOME:-~/.agents}/skills/plugin-radar/`

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
- [jilian-dsh/dsh-rules-manager](https://github.com/jilian-dsh/dsh-rules-manager) — Rules & commands manager for DeepSeek Harness: /rules command + settings panel + custom commands. [↗ profil