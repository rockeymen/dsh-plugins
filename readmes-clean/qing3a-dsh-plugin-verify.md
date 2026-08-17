# dsh-plugin-verify — Verified DSH Plugins

> DSH 插件**判定站**：每个插件经过同一套运行时验证（7/7 waterfall + tools/result），通过才给 ✅ Verified 徽标。**与 awesome-dsh-plugins（全量分级观测）互补：它做 L0-L4 全量观测分级，我们把 L4 运行实测做深（7/7 waterfall + tools/result）。**

- **找可信插件**：按场景浏览，每个插件带 Verified 徽标 + 验证日期 + 可复现报告——证据可复现的运行时验证（7/7 waterfall + tools/result）
- **装得放心**：徽标 = 通过了完整 agent 循环审查；附带安装指引与安全提示
- **给插件做判定**：插件作者一条命令跑验证拿徽标；顺带帮你发现真实 bug

## 📑 门户导航

**快速路由**——按你的身份/目标直达：

### 你的目标 · 跳转入口
- **你的目标**: 找一个可信插件 · **跳转入口**: [场景目录](#-场景目录)
- **你的目标**: 不知道装什么、想按场景选型 · **跳转入口**: [场景目录](#-场景目录)
- **你的目标**: 投稿你的插件（2 分钟上架） · **跳转入口**: [插件作者：投稿](#插件作者投稿你的插件2-分钟上架)
- **你的目标**: 看懂徽标/状态 · **跳转入口**: [状态体系](#状态体系)
- **你的目标**: 安全安装插件 · **跳转入口**: [使用者：如何安全安装](#使用者如何安全安装)
- **你的目标**: 想了解判定凭什么 · **跳转入口**: [判定规则](#判定规则透明公开)
- **你的目标**: 浏览全部资源（方法论/报告/文章/工具） · **跳转入口**: [资源中心](#资源中心)
- **你的目标**: 提交/维护 · **跳转入口**: [贡献者](#贡献者)
- **你的目标**: 了解边界 · **跳转入口**: [边界与免责](#边界与免责)

**资源总览**——本项目全部资产的陈列入口：

### 资产 · 内容 · 入口
- **资产**: **判定站主页** · **内容**: 分类目录 + 数字卡片 + 投稿 CTA（GitHub Pages） · **入口**: [index.html](index.html)
- **资产**: **验证 CLI** · **内容**: 一条命令跑运行时验证（mock-llm + waterfall + rules[]） · **入口**: `npx dsh-plugin-verify <插件路径> --repo <DSH checkout>`
- **资产**: **验证方法论** · **内容**: 无 API Key 验证 waterfall 行为：mock-llm / headless / dump 完整路径 · **入口**: [docs/runtime-validation.md](docs/runtime-validation.md) · [Discussion 462](https://github.com/deepseek-ai/deepseek-harness/discussions/462)
- **资产**: **插件规范建议** · **内容**: 《DSH 插件开发与设计规范建议 v0.1》（每条带依据与踩坑记录） · **入口**: [docs/plugin-standards.md](docs/plugin-standards.md)
- **资产**: **评审清单** · **内容**: 人工评审层：官方 defensive-patterns + postmortem 检查点 · **入口**: [docs/review-checklist.md](docs/review-checklist.md)
- **资产**: **审核标准** · **内容**: 评审标准总纲 v0.1.0：P（插件必检）/D（dsh-desktop 基线）/C（官方贡献）三集规则，钉定 mainline `47f94385`，含版本规程与溯源修正 · **入口**: [docs/review-standards.md](docs/review-standards.md)
- **资产**: **验证报告** · **内容**: 14 份可复现报告（插件 commit · mainline commit · 验证日期） · **入口**: [reports/](#资源中心)
- **资产**: **报告 Schema** · **内容**: 验证报告机器可读规范 v1（fullName 映射键 · verifiedBy · schemaVersion · security，市场/索引/CI 可消费） · **入口**: [schema/report.schema.json](schema/report.schema.json)
- **资产**: **文章** · **内容**: 从零拆解 / 踩坑全记录 / 验证实战 / 判定站从零到跑通（4 篇） · **入口**: [posts/](#文章)
- **资产**: **投稿系统** · **内容**: Agent 友好的 6 步投稿 Skill + 自检 gate · **入口**: [skills/submission/SKILL.md](skills/submission/SKILL.md)

> [!IMPORTANT]
> **Verified 徽标 ≠ 官方背书。** 判定基于当日 mainline、证据可复现；DSH 每天更新，插件可能漂移，安装前请查看验证日期与插件自身 README。

## ✅ 状态体系

### 徽标 · 状态 · 含义 · 它不说明什么
- **徽标**: ✅ **Verified** · **状态**: 已验证 · **含义**: 通过完整运行时验证（7/7 waterfall + tools/result），证据可复现 · **它不说明什么**: 非官方背书、非全功能测试、非安全审计
- **徽标**: ⏳ **未验证** · **状态**: 未验证 · **含义**: 已收录但尚未运行时验证 · **它不说明什么**: 不代表坏，只是还没测
- **徽标**: ⓘ **环境边界** · **状态**: 静态通过、运行时未激活 · **含义**: headless 判定环境缺其依赖服务（web 重依赖/特定注入），属判定方法边界而非插件缺陷 · **它不说明什么**: 不代表坏；在完整 web profile 下可能工作正常，需换环境复验
- **徽标**: ❌ **验证失败** · **状态**: 失败 · **含义**: 运行时验证发现问题（有报告） · **它不说明什么**: 不代表永远不可用，修复后可复测

> 每个判定附带四项：**插件 commit · mainline commit · 验证日期 · 报告**。缺一项即降低信任等级。

## 🧭 场景目录

> 更新于 2026-08-16 · 判定方法：[dsh-plugin-verify CLI](#插件作者投稿你的插件2-分钟上架)
>
> 判定站已验证插件与社区推荐候选的**统一选型目录**（基于 YELEBAI 2890 插件 / 0xsline 989 插件 / awesome 等生态数据建模，2026-08-16）。每行「状态」三态：**✅ 已验证**（通过 7/7 waterfall + tools/result 运行时复验，报告可复现）· **ⓘ 环境边界**（headless 判定环境缺其依赖服务，属判定方法边界而非插件缺陷，需 web profile 复验）· **候选**（尚未经判定站验证，标注 ⭐ 的为核查时点实测 Star 数，会随生态漂移）。完整状态语义见[状态体系](#-状态体系)。

**选型原则**：先装"管理基建"，再按你最痛的一两个场景补，别一次装很多。

### 🖥 界面与体验（UI & Experience）

*生态第一大场景：侧栏工作台、对话导航、UI 渲染、输入增强——用得顺手*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **状态**: ⓘ · **说明**: 服务化侧栏框架：右侧栏+底部面板双工作台（文件/编辑预览/内嵌浏览器/真实终端/Git/后台任务）；`ctx.betterSidebar` 服务开放给第三方插件注册 tab/viewer；只注册 `settings.section`（未碰 single 槽） · **验证日期**: 2026-08-15 复验 · **报告**: —
- **插件**: [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) · **状态**: ⓘ · **说明**: 任务看板、Git 关系图、皮肤中心、桌面宠物、token 统计一站式合集（生态最高星 ⭐2.4k）；重度 web 前端包 · **验证日期**: 2026-08-16 · **报告**: —
- **插件**: [dsh-navbar](https://github.com/vlln/dsh-navbar) · **状态**: ✅ · **说明**: 对话节点导航条：右侧缘节点串快速跳转任意 user 消息节点（长对话不用滚屏） · **验证日期**: 2026-08-16 · **报告**: [view](reports/navbar-2026-08-16.json)
- **插件**: [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) · **状态**: ✅ · **说明**: Codex 风格 @path 引用：对话里 `@路径` 解析为文件上下文（agent/pre-step 瀑布注入），客户端注入 ui-input-trigger/ui-slots · **验证日期**: 2026-08-15 · **报告**: [view](reports/at-file-2026-08-15.json)
- **插件**: [dsh-genui](https://github.com/omdsh-dev/dsh-genui) · **状态**: ✅ · **说明**: ```dsh-ui fence 生成 UI：模型用 DSL 声明界面，client 渲染器 + settings.section 注册 · **验证日期**: 2026-08-15 · **报告**: [view](reports/genui-2026-08-15.json)

### 👁 视觉（Vision）

*让纯文本模型"看得见"：图片问答、OCR、UI 还原——生态第二梯队热点（modlens 2208★）*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [ModLens](https://github.com/liustack/modlens) · **状态**: ✅ · **说明**: 首个 DSH 视觉插件：聊天直接粘贴图片 → 文本模型获得视觉（image→文本引擎），注入 tools/agents/attachments/llm（入口走 package.json `exports` 而非 `main`，实测加载正常） · **验证日期**: 2026-08-15 · **报告**: [view](reports/modlens-2026-08-15.json)
- **插件**: [dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) · **状态**: 候选（⭐405） · **说明**: 图片问答、长截图 OCR、UI 还原、像素对比，适合前端/视觉任务 · **验证日期**: — · **报告**: —

### 🔍 搜索与联网（Search & Web）

*搜得到：网页搜索、抓取、带引用证据——与视觉组成"看+搜"组合*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [modsearch](https://github.com/liustack/modsearch) · **状态**: ✅ · **说明**: 搜索网页和 X，返回带引用的结构化证据；注入 tools/web（与 ModLens 组成"看+搜"组合） · **验证日期**: 2026-08-16 · **报告**: [view](reports/modsearch-2026-08-16.json)
- **插件**: [anweat/dsh-web-search-pro](https://github.com/anweat/dsh-web-search-pro) · **状态**: 候选 · **说明**: 多引擎+缓存的搜索后端增强 · **验证日期**: — · **报告**: —
- **插件**: [TonyDua/dsh-web-search-exa](https://github.com/TonyDua/dsh-web-search-exa) · **状态**: 候选 · **说明**: 零配置 Exa 搜索后端 · **验证日期**: — · **报告**: —

### 💻 编码与开发（Coding & Dev）

*git 集成、代码审查、CLI 适配、测试——写代码的帮手（生态最大类）*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [dsh-repo-context](https://github.com/qing3a/dsh-repo-context) · **状态**: ✅ · **说明**: 把 git 状态与仓库规范动态注入 system prompt（section/context/variable，官方缝隙插件） · **验证日期**: 2026-08-14 · **报告**: [view](reports/repo-context-2026-08-14.json)
- **插件**: [falsify-dsh](https://github.com/shi275773124/falsify-dsh) · **状态**: ✅ · **说明**: Falsify CLI 适配器：裁决收据（lint / review --json / gate） · **验证日期**: 2026-08-14 · **报告**: [view](reports/falsify-2026-08-14.json)

### ⚙️ 自动化（Automation）

*事件驱动唤醒、定时循环、断线续跑——把人工盯守交给机器*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [dsh-sentinel](https://github.com/fuhefei/dsh-sentinel) · **状态**: ✅ · **说明**: 事件驱动唤醒：文件/命令/HTTP/进程/Webhook 触发（v0.10.0，按判定站建议修复 webServer 必选注入 + heartbeat unref；修复后作者即用 dsh-plugin-verify 复测通过，判定站独立复验一致） · **验证日期**: 2026-08-16 · **报告**: [view](reports/sentinel-2026-08-16.json)
- **插件**: [dsh-automation](https://github.com/titanwings/dsh-automation) · **状态**: ⓘ · **说明**: 定时/自动化任务调度：cron 触发、并发限制、人工审批门、历史回放；`automationDomainSpec` 数据域（依赖 zod/luxon，非 zero-dep） · **验证日期**: 2026-08-15 复验 · **报告**: —
- **插件**: [dsh-loop](https://github.com/vlln/dsh-loop) · **状态**: 候选 · **说明**: `/loop` 定时循环 · **验证日期**: — · **报告**: —
- **插件**: [dsh-auto-continue](https://github.com/HsiangNianian/dsh-auto-continue) · **状态**: 候选 · **说明**: 网络波动/超时导致回合失败后自动发"继续"续跑，无人值守必备 · **验证日期**: — · **报告**: —

### 💾 记忆与上下文（Memory & Context）

*长期记忆、记忆主权、上下文优化——跨会话经验累积*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) · **状态**: ✅ · **说明**: 纯插件五轨长期记忆 + 技能自进化，零核心修改、卸载即净（注入 tools/systemPrompt/agents/settings 等 8 服务，headless 全激活） · **验证日期**: 2026-08-16 · **报告**: [view](reports/memory-evolve-2026-08-16.json)
- **插件**: [dsh-mneme](https://github.com/modusensus/dsh-mneme) · **状态**: 候选 · **说明**: SQLite + 可人工编辑的 Markdown 镜像，记忆透明可改（"记忆主权"派） · **验证日期**: — · **报告**: —

### 🛠 调试与诊断（Debug & Diagnostics）

*事件审计、会话诊断——让插件作者/开发者看清 harness 内部发生了什么*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [dsh-event-auditor](https://github.com/qing3a/dsh-event-auditor) · **状态**: ✅ · **说明**: harness 事件流审计面板：事件类型/分发模式/计数；settings 热改 + /audit 命令 + headless dump · **验证日期**: 2026-08-14 · **报告**: [view](reports/event-auditor-2026-08-14.json)

### 🔔 通知与提醒（Notification & Reminder）

*回合完成通知、任务进度、系统托盘——长任务不用盯屏*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [dsh-notification](https://github.com/omdsh-dev/dsh-notification) · **状态**: ✅ · **说明**: 回合完成桌面通知：成功/失败/关键词过滤，长任务不用盯屏 · **验证日期**: 2026-08-16 · **报告**: [view](reports/notification-2026-08-16.json)
- **插件**: [dsh-task-status](https://github.com/vlln/dsh-task-status) · **状态**: ⓘ · **说明**: 后台任务进度 + 实时输出 tail 显示在对话页，构建/下载/测试时不用干瞪眼；必选注入 `webServer`，headless 未激活 · **验证日期**: 2026-08-16 · **报告**: —
- **插件**: [dsh-tray](https://github.com/qing3a/dsh-tray) · **状态**: ✅ · **说明**: Windows 系统托盘（trayicon exe 宿主，无 native 编译）：菜单/通知/headless 降级 · **验证日期**: 2026-08-14 · **报告**: [view](reports/tray-2026-08-14.json)

### 💰 成本与用量（Cost & Usage）

*Token 消耗、账户余额、预算——成本与资源可见性*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [dsh-balance](https://github.com/TwotwoPiggy/dsh-balance) · **状态**: ✅ · **说明**: Web 聊天框实时 Token 消耗估算 + DeepSeek 账户余额（纯 JS，ctx.inject 动态注入） · **验证日期**: 2026-08-14 · **报告**: [view](reports/balance-2026-08-14.json)

### 🔒 安全与权限（Security & Permissions）

*密钥扫描、权限规则、恶意模式检测——装第三方插件前建议先有*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [dsh-security-scan](https://github.com/ben7am1n/dsh-security-scan) · **状态**: ✅ · **说明**: Secret & dangerous-pattern scanner（zero deps） · **验证日期**: 2026-08-14 · **报告**: [view](reports/security-scan-2026-08-14.json)
- **插件**: [dsh-plugin-vetting](https://github.com/truelove-dreamer/dsh-plugin-vetting) · **状态**: 候选 · **说明**: 装插件前静态扫描恶意模式（外传/凭据/混淆），覆盖供应链检查 · **验证日期**: — · **报告**: —
- **插件**: [dsh-mcpguard](https://github.com/ChenLaoshiYF/dsh-mcpguard) · **状态**: 候选 · **说明**: 扫描 skill 与 MCP 配置中的提示注入、同形字、危险 shell · **验证日期**: — · **报告**: —
- **插件**: [dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) · **状态**: 候选 · **说明**: Claude Code 风格声明式权限规则（allow/deny/ask） · **验证日期**: — · **报告**: —

### 🏗 管理基建（Infrastructure）

*插件市场、管理入口、备份——插件多了之后的底座*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [dsh-hub-panel](https://github.com/jiangxingfan1-coder/dsh-hub-panel) · **状态**: ✅ · **说明**: Settings 页插件商店 UI（dual-face，client slot 注册 + fetch 行为）——首个通过运行时验证的双面插件（v0.1.0） · **验证日期**: 2026-08-16 · **报告**: [view](reports/hub-panel-2026-08-16.json)
- **插件**: [dsh-id](https://github.com/jiangxingfan1-coder/dsh-id) · **状态**: ✅ · **说明**: 个人身份同步层（host 常驻：patch + 定时器 + 工具注册，v0.7.0） · **验证日期**: 2026-08-16 · **报告**: [view](reports/dsh-id-2026-08-16.json)
- **插件**: [dsh-market](https://github.com/dsh-market/dsh-market) · **状态**: 候选 · **说明**: 官方社区推荐的插件市场：设置页内浏览/搜索/分类筛选/一键安装，已装插件一目了然 · **验证日期**: — · **报告**: —
- **插件**: [plugin-registry](https://github.com/vlln/plugin-registry) · **状态**: 候选 · **说明**: 可视化插件管理入口 + `make-dsh-plugin` 开发引导，新手首选 · **验证日期**: — · **报告**: —
- **插件**: [dsh-backup](https://github.com/xiaoyuyu6420/dsh-backup) · **状态**: 候选 · **说明**: 一键备份/恢复 DSH 用户数据，定时自动备份，装插件多了之后是救命稻草 · **验证日期**: — · **报告**: —

### 🌐 远程与访问（Remote & Access）

*局域网访问、反向代理、远程控制——生态热点（149 插件），待收录*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: *待收录* · **状态**: — · **说明**: 生态已有 dsh-lan-access / dsh-full-remote / dsh-web-access 等热点插件，验证后收录于此 · **验证日期**: — · **报告**: —

### ⌨️ 终端与 TUI（Terminal & TUI）

*终端界面、命令行增强——高星集中（dsh-TUI 1441★），待收录*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: *待收录* · **状态**: — · **说明**: 生态已有 dsh-TUI / dsh-bash-terminal 等热点插件，验证后收录于此 · **验证日期**: — · **报告**: —

### 🧠 模型与编排（Models & Orchestration）

*子代理委派、模型切换/回退、桥接——让模型编排更灵活*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [dsh-subagent-max](https://github.com/aaravarr/dsh-subagent-max) · **状态**: ✅ · **说明**: 双面插件：`subagent_with_model` 工具（每次调用可指定子代理的 model/provider）+ 多面板实时子代理查看器（host 面已验证，client 面 web UI 不在 headless 判定范围） · **验证日期**: 2026-08-17 · **报告**: [view](reports/subagent-max-2026-08-17.json)
- **插件**: [dsh-llm-fallbacks](https://github.com/omdsh-dev/dsh-llm-fallbacks) · **状态**: ✅ · **说明**: 基于角色的模型重试与备用策略：LLM 请求持续失败（重试耗尽/鉴权/配额/限流）时自动走 provider/model 回退链（v0.2.1，纯挂载 + 自带 gateway） · **验证日期**: 2026-08-17 · **报告**: [view](reports/llm-fallbacks-2026-08-17.json)

### 📦 导入与迁移（Import & Migration）

*从 Claude Code/Codex/ChatGPT 等迁移会话——硬需求，待收录*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: *待收录* · **状态**: — · **说明**: 生态已有 dsh-claude-move / dsh-chat-import（13 源全保真导入）等，验证后收录于此 · **验证日期**: — · **报告**: —

### 🎮 乐子与皮肤（Fun & Themes）

*桌面宠物、摸鱼游戏、皮肤美化——按需*

### 插件 · 状态 · 说明 · 验证日期 · 报告
- **插件**: [whale-girl](https://github.com/vlln/whale-girl) · **状态**: 候选 · **说明**: 桌面宠物 · **验证日期**: — · **报告**: —
- **插件**: [dsh-minigames](https://github.com/lhh010/dsh-minigames) · **状态**: 候选 · **说明**: 18 款摸鱼小游戏 · **验证日期**: — · **报告**: —
- **插件**: [dsh-MusicPlayer](https://github.com/xiekai886/dsh-MusicPlayer) · **状态**: 候选 · **说明**: 网易云音乐播放器 · **验证日期**: — · **报告**: —

> **选型建议**：不用一次装很多。从 **[dsh-market](https://github.com/dsh-market/dsh-market) + [dsh-backup](https://github.com/xiaoyuyu6420/dsh-backup)** 起步，再加你当前最痛的一两个场景（纯文本模型就上 modlens+modsearch；总盯着长任务就上 dsh-task-status+dsh-notification），用几天再扩。

> ⚠️ **注意**：候选 = 未经判定站验证。这些全是第三方插件，会在你机器上运行代码。装之前看一眼仓库的源码、许可证和最近更新情况，优先装 Star 高、活跃维护的。安装方式一般是 `dsh plugin add <GitHub 仓库>` 或在市场里一键安装。**推荐 ≠ 判定站 Verified**——想让场景目录里哪个插件拿到 ✅ 徽标，走[投稿流程](#插件作者投稿你的插件2-分钟上架)，判定站免费帮你跑一遍运行时验证。

> **收录批次**：2026-08-16 第三批次（2 个，全部 ✅）：dsh-hub-panel（dual-face 双面插件，v0.1.0）· dsh-id（host 常驻，v0.7.0）——dsh-hub-index（jiangxingfan1-coder）试点验证对象，报告已可作其 verified 晋级证据。2026-08-16 第二批次（4 个候选）：dsh-memory-evolve ✅ + modsearch ✅（均 7/7 waterfall 通过，报告已附）；dsh-task-status ⓘ + dsh-web-ui ⓘ（依赖 web 环境服务，headless 无法激活——task-status 必选注入 `webServer`，web-ui 为重度 web 前端包，均属判定方法边界，非插件缺陷）。2026-08-16 收录批次（3 个，全部 ✅）：dsh-sentinel（v0.10.0）· dsh-navbar（v0.3.0）· dsh-notification（v0.1.1）——sentinel 的修复正是判定站 #4 建议的产物（webServer 移出必选 inject + heartbeat unref），形成"验证 → 作者采纳 → 生态受益"完整闭环。2026-08-15 收录批次（5 个）：at-file/genui/modlens 通过升级 ✅，automation/better-sidebar 标 ⓘ（依赖 web 环境服务，headless 判定模式无法激活，需浏览器级验证通道，非插件缺陷）。

> 你的插件还没在？[拿徽标只要 2 分钟](#插件作者投稿你的插件2-分钟上架)。

## 🔬 判定规则（透明公开）

**为什么是运行时判定**：静态检查只能证明"能加载"，证明不了"不破坏行为"。waterfall 监听器漏调 `next()` 会静默吞掉 agent 的默认行为——这类 bug 只有真实循环才暴露。

**判定流程**（mock-llm 触发完整 agent 循环，`tool_call_success` → 平台 shell 工具调用——Windows 用 `pwsh`、非 Windows 用 `bash`，见 `docs/runtime-validation.md` 平台边界）：

```
system-prompt/assemble → agent/pre-step → agent/request → llm/stream
→ tools/pre-execute → tools/execute → tools/post-execute → tools/result
```

**通过标准**：7/7 waterfall 链完整 + `tools/result` 收尾（零副作用）+ **R3**（目标工具真实执行成功——`tools/result` 载荷 `isError:false`；目标工具本身 `UNKNOWN_TOOL` 判失败，postmortem 0002 教训）。**R4**（功能冒烟，附加证据）——mock 触发的工具参数真实到达执行层，证明"能装且能用"而非仅"能加载"；R4 不并入总 pass（兼容工具未触发的合法场景），通过时报告标注。

**报告怎么读**（`verify-report.json`）：

```json
{ "pass": true, "waterfallFound": [7/7 事件], "waterfallMissing": [],
  "rules": [{"name":"R1-entry-shape","pass":true,...},{"name":"R2-patch-yaml","pass":true,...},{"name":"R3-tools-result","pass":true,...},{"name":"R4-function-smoke","pass":true,...}],
  "detail": "捕获事件: 13 | tools/result: 是" }
```

- `pass: true` + `missing: []` + `rules[]` 全 `pass` = ✅ 通过
- `missing` 列出哪段链没出现 → 定位插件哪个 waterfall 监听器有问题
- `rules[]`：R1（入口形态，postmortem 0001 unwrapExports 陷阱）、R2（`!!js` 只在 config 子树，postmortem 0002）、R3（`UNKNOWN_TOOL` 运行时判失败，postmortem 0002 快照教训）、R4（工具参数到达断言，功能冒烟）——静态规则是确定性信号，最终以运行时判定为准
- 每份报告含插件路径、DSH checkout、日期 → 可复现
- 人工评审层：`docs/review-checklist.md`（官方 defensive-patterns 7 条 + postmortem 检查点）

## 📦 资源中心

本项目一切资产的陈列与索引。主页（index.html）是给读者的目录，这里是给开发者/作者的完整资源清单。

### 方法论文档

### 文档 · 用途
- **文档**: [docs/runtime-validation.md](docs/runtime-validation.md) · **用途**: 完整验证方法论：mock-llm / headless / dump 环境变量、平台边界（Windows pwsh vs bash）、"recovered ≠ 工具成功"警示
- **文档**: [docs/plugin-standards.md](docs/plugin-standards.md) · **用途**: 《DSH 插件开发与设计规范建议 v0.1》：官方源码分析提炼，每条带依据与踩坑
- **文档**: [docs/review-checklist.md](docs/review-checklist.md) · **用途**: 人工评审层：官方 defensive-patterns 7 条 + postmortem 0001-0004 检查点
- **文档**: [docs/review-standards.md](docs/review-standards.md) · **用途**: **评审标准总纲 v0.1.0**：P（插件必检）/D（dsh-desktop 基线）/C（官方贡献）三集规则；R1/R2/R3 的统一索引；钉定 mainline `47f94385`；含规则生命周期与版本规程
- **文档**: [docs/source/dsh-design-conventions.md](docs/source/dsh-design-conventions.md) · **用途**: 《DSH 设计规范整理》溯源源稿（复制入库，40 条依据路径已逐条对照源码验证）
- **文档**: [Discussion 462](https://github.com/deepseek-ai/deepseek-harness/discussions/462) · **用途**: 官方 Show and tell：无 API Key 验证 waterfall 行为的方法论帖（含完整命令与实证）

### 验证报告（reports/）

每份报告含插件 commit / mainline commit / 验证日期，可复现。**验证日期久于一周需谨慎——DSH 每天更新。**

### 插件 · 报告 · 状态
- **插件**: dsh-event-auditor · **报告**: [reports/event-auditor-2026-08-14.json](reports/event-auditor-2026-08-14.json) · **状态**: ✅
- **插件**: dsh-tray · **报告**: [reports/tray-2026-08-14.json](reports/tray-2026-08-14.json) · **状态**: ✅
- **插件**: dsh-security-scan · **报告**: [reports/security-scan-2026-08-14.json](reports/security-scan-2026-08-14.json) · **状态**: ✅
- **插件**: dsh-balance · **报告**: [reports/balance-2026-08-14.json](reports/balance-2026-08-14.json) · **状态**: ✅
- **插件**: dsh-repo-context · **报告**: [reports/repo-context-2026-08-14.json](reports/repo-context-2026-08-14.json) · **状态**: ✅
- **插件**: falsify-dsh · **报告**: [reports/falsify-2026-08-14.json](reports/falsify-2026-08-14.json) · **状态**: ✅
- **插件**: dsh-at-file · **报告**: [reports/at-file-2026-08-15.json](reports/at-file-2026-08-15.json) · **状态**: ✅
- **插件**: dsh-genui · **报告**: [reports/genui-2026-08-15.json](reports/genui-2026-08-15.json) · **状态**: ✅
- **插件**: ModLens · **报告**: [reports/modlens-2026-08-15.json](reports/modlens-2026-08-15.json) · **状态**: ✅
- **插件**: dsh-sentinel · **报告**: [reports/sentinel-2026-08-16.json](reports/sentinel-2026-08-16.json) · **状态**: ✅
- **插件**: dsh-navbar · **报告**: [reports/navbar-2026-08-16.json](reports/navbar-2026-08-16.json) · **状态**: ✅
- **插件**: dsh-notification · **报告**: [reports/notification-2026-08-16.json](reports/notification-2026-08-16.json) · **状态**: ✅
- **插件**: modsearch · **报告**: [reports/modsearch-2026-08-16.json](reports/modsearch-2026-08-16.json) · **状态**: ✅
- **插件**: dsh-memory-evolve · **报告**: [reports/memory-evolve-2026-08-16.json](reports/