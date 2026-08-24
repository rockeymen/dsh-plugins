# DeepSeek Harness 插件汇总

一个用于收集、展示和安全审查 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
（简称 DSH）社区插件的汇总项目。插件列表同时以网页和本 README 两种形式呈现，并每天自动检索
GitHub 上带 `dsh-plugin` 话题的仓库，经过代码安全审查后补充到汇总中。

汇总页面（GitHub Pages）：

[https://writeCasually.github.io/deepseek-harness-plugins/](https://writeCasually.github.io/deepseek-harness-plugins/)

## 项目简介

DeepSeek Harness 以“一切都是插件”为核心设计，社区围绕它产出了大量插件、皮肤与发行版。
本项目把这些分散在 GitHub 上的项目汇总到一处，方便开发者按名称、作者与功能快速查找。

主要能力：

- 网页汇总页：支持搜索、按分类与官方标记筛选，展示每个插件的名称、作者、功能简介与项目链接。
- 单一数据源：`docs/plugins.json` 同时驱动网页与 README 插件列表。
- 多语言简介：插件仓库存在 `README.zh*.md` / `README.en*.md` 等简洁文档时，网页会按当前语言展示对应简介，中文优先、英文兜底。
- DSH 适用性判断：先确认插件是否真正能在 DeepSeek Harness 运行，无法确认的不予收录。
- 分层安全与隐私审查：对非官方插件做证据化静态扫描（危险命令 / 代码执行 / 密钥泄露 / 混淆检测）
  与供应链漏洞检查（OSV），可选 LLM 深度复核；审查留痕（commit、证据、覆盖率），详见
  [docs/security-review.md](docs/security-review.md)。
- 官方优先：DeepSeek AI 官方插件排在最前。
- 人工复核入口：自动检索结果以 Pull Request 形式提交，合并后即可发布到汇总页。

## 官方预设插件

DSH 随包分发一组官方内置插件（`@deepseek-ai/*`，位于官方仓库
[packages/](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages) 目录）。它们的“作用”说明
**独立维护**、不参与社区插件的发现与安全审查 workflow：

- 独立数据源：`docs/official-plugins.json`（`plugins` 数组共 210 个内置插件）。
- 随网页独立“官方预设插件”区块展示；发现/审查脚本（`scripts/*`）与 `.github/workflows/*` **只读写
  `docs/plugins.json`，从不改写或审查官方数据文件**。

可部署的官方 profile bundle：

### 包名 · 作用
- **包名**: [`@deepseek-ai/dsh-base`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle/base) · **作用**: 共享 dsh 核心，作为每个 profile 的第一层 patch：在空 profile 根上插入全套基础内置插件。
- **包名**: [`@deepseek-ai/dsh-web-app`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle/web-app) · **作用**: 浏览器界面 bundle：在 `dsh-base` 上叠加 web patch 层与运行期 glue 插件。
- **包名**: [`@deepseek-ai/dsh-headless`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle/headless) · **作用**: 一次性 bundle：无 Host/HTTP/浏览器，直接跑核心 Agent/Session。

完整清单与每个包的作用见 [docs/official-plugins.json](docs/official-plugins.json)。

## 插件列表

### 插件名称 · 作者 · 功能简介
- **插件名称**: [reactive-resume](https://github.com/amruthpillai/reactive-resume) · **作者**: [@amruthpillai](https://github.com/amruthpillai) · **功能简介**: A one-of-a-kind resume builder that keeps your privacy in mind. Completely secure, customizable, portable, open-source and free forever. Try it out today!
- **插件名称**: [OpenViking](https://github.com/volcengine/OpenViking) · **作者**: [@volcengine](https://github.com/volcengine) · **功能简介**: Self-evolving Context Database for AI Agents. Unify Agent Memory, Knowledge RAG and Skills.
- **插件名称**: [WeKnora](https://github.com/Tencent/WeKnora) · **作者**: [@Tencent](https://github.com/Tencent) · **功能简介**: Open-source LLM knowledge platform: turn raw documents into a queryable RAG, an autonomous reasoning agent, and a self-maintaining Wiki.
- **插件名称**: [voyager](https://github.com/Nagi-ovo/voyager) · **作者**: [@Nagi-ovo](https://github.com/Nagi-ovo) · **功能简介**: Enhancement suite for Gemini, AI Studio, Claude & ChatGPT — plus a prompt manager for any web UI, DeepSeek Harness included. / 面向 Gemini、AI Studio、Claude 与 ChatGPT 的增强套件；提示词管理器可用于任意 Web UI，含 DeepSeek Harness。
- **插件名称**: [deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) · **作者**: [@anywhere-labs](https://github.com/anywhere-labs) · **功能简介**: 为 DeepSeek Harness (DSH) 插件生态打造的现代化桌面端解决方案。万物皆「插件」，桌面本身也是「插件」。
- **插件名称**: [archify](https://github.com/tt-a1i/archify) · **作者**: [@tt-a1i](https://github.com/tt-a1i) · **功能简介**: Agent skill for beautiful, verifiable architecture, workflow, sequence, data-flow, and lifecycle diagrams—self-contained HTML with motion and crisp export.
- **插件名称**: [EverOS](https://github.com/EverMind-AI/EverOS) · **作者**: [@EverMind-AI](https://github.com/EverMind-AI) · **功能简介**: One portable memory layer for every AI agent: local-first, Markdown-native, user-owned, and self-evolving across apps, tools, and workflows.
- **插件名称**: [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) · **作者**: [@awesome-dsh-plugin](https://github.com/awesome-dsh-plugin) · **功能简介**: A curated list of plugins for DeepSeek Harness (dsh) · DeepSeek Harness 插件精选列表
- **插件名称**: [MemOS](https://github.com/MemTensor/MemOS) · **作者**: [@MemTensor](https://github.com/MemTensor) · **功能简介**: Self-evolving memory OS for LLM & AI Agents: ultra-persistent memory, hybrid-retrieval, and cross-task skill reuse, with 35.24% token savings and DeepSeek Harness support.
- **插件名称**: [dsh-routing-suite](https://github.com/yjh051108/dsh-routing-suite) · **作者**: [@yjh051108](https://github.com/yjh051108) · **功能简介**: dsh-routing-suite — injector + router-standard kit: install the runtime injector first, then the task-aware reasoning-mode router preset (measured P1-P23).
- **插件名称**: [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) · **作者**: [@zhu1090093659](https://github.com/zhu1090093659) · **功能简介**: Plugin and skin collection for DeepSeek Harness (DSH) Web UI - task board, git graph, right-side panel, remote mobile UI, pet, live token stats, and skin center.
- **插件名称**: [ouroboros](https://github.com/Q00/ouroboros) · **作者**: [@Q00](https://github.com/Q00) · **功能简介**: Agent OS: the agent gets smarter on its own. We just hold the line: the grading command and expected result never make it into the success contract we hand it. Interview-gated, staged evaluation, budgeted evolution loop. MCP server, 13 runtimes: Claude Code, Codex CLI, Gemini CLI, OpenCode, Copilot, Kiro and more.
- **插件名称**: [petdex](https://github.com/crafter-station/petdex) · **作者**: [@crafter-station](https://github.com/crafter-station) · **功能简介**: A public gallery of animated pets for Codex, Claude Code, DeepSeek Harness, Hermes, OpenCode, Gemini CLI, and more.
- **插件名称**: [dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) · **作者**: [@xiaobright](https://github.com/xiaobright) · **功能简介**: Two-phase DeepSeek Harness preset: Minimal-aligned bootstrap, then full Standard tools (Project2 98/99)
- **插件名称**: [mirage](https://github.com/strukto-ai/mirage) · **作者**: [@strukto-ai](https://github.com/strukto-ai) · **功能简介**: The World's First Unified Virtual Filesystem For AI Agents
- **插件名称**: [DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **作者**: [@omdsh-dev](https://github.com/omdsh-dev) · **功能简介**: 开放的侧边栏底座，支持三方拓展注册新侧边栏页面。内置文件渲染编辑/终端/侧边对话/Git/子代理页面 ｜ Open sidebar foundation, supports third-party extensions to register new sidebar pages. Built-in file rendering/editing, terminal, side chat, Git, and sub-agent pages.
- **插件名称**: [dashi-taskboard](https://github.com/chuspeeism/dashi-taskboard) · **作者**: [@chuspeeism](https://github.com/chuspeeism) · **功能简介**: 一个本地优先的议题面板，可在浏览器中运行，也可通过独立 CDP 启动器或其注入脚本嵌入 Codex。同一套 HTTP API 为 React UI 和随附 Codex Skill 使用的 taskctl CLI 提供支持。
- **插件名称**: [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) · **作者**: [@ccch1mneyyy](https://github.com/ccch1mneyyy) · **功能简介**: DSH 官方公众号收录的 TUI 补位插件：Claude Code 风，鲸鱼顶栏/实时状态/流式思考/双击 Esc 回滚/上下文进度+TPS。npm 一键装。  DSH official WeChat featured TUI plugin — Claude Code style: whale bar, live status, streaming thoughts, double-Esc rollback, context bar + TPS. npm one-click.
- **插件名称**: [BitFun](https://github.com/GCWing/BitFun) · **作者**: [@GCWing](https://github.com/GCWing) · **功能简介**: BitFun combines a high-performance agent runtime written in Rust with a polished desktop application. It pairs the depth of a Code Agent with open, general-purpose capabilities for work beyond software development.
- **插件名称**: [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) · **作者**: [@Small-tailqwq](https://github.com/Small-tailqwq) · **功能简介**: Whale Girl skin series for DeepSeek Harness. 适用于 DeepSeek Harness 的，鲸鱼娘系列皮肤。
- **插件名称**: [awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) · **作者**: [@AdamPlatin123](https://github.com/AdamPlatin123) · **功能简介**: 前部索引仓库（Radar）：自动扫描发现所有 dsh 插件候选，经测试合格的移入后序精选目录仓库。
- **插件名称**: [BrowserSkill](https://github.com/Tencent/BrowserSkill) · **作者**: [@Tencent](https://github.com/Tencent) · **功能简介**: Let AI agents use your real, logged-in browser without interrupting your work. CLI + extension for browser automation across any shell-capable AI agent.
- **插件名称**: [mem9](https://github.com/mem9-ai/mem9) · **作者**: [@mem9-ai](https://github.com/mem9-ai) · **功能简介**: Unlimited memory for OpenClaw
- **插件名称**: [Aegis](https://github.com/GanyuanRan/Aegis) · **作者**: [@GanyuanRan](https://github.com/GanyuanRan) · **功能简介**: Make AI coding agents architecture-aware: baseline-first, evidence-verified, drift-checked, and safe across long tasks.
- **插件名称**: [agentrq](https://github.com/agentrq/agentrq) · **作者**: [@agentrq](https://github.com/agentrq) · **功能简介**: AgentRQ: Human-in-loop realtime conversational task manager for AI Agents. Self-hosted! Control your own agents from wherever you want Mobile, Web, Desktop. Designed to work well with your own Claude subscriptions and any harness.
- **插件名称**: [awesome-dsh-plugin](https://github.com/Anil-matcha/awesome-dsh-plugin) · **作者**: [@Anil-matcha](https://github.com/Anil-matcha) · **功能简介**: A curated list of plugins for DeepSeek Harness (dsh) - DeepSeek Harness plugin ecosystem
- **插件名称**: [MindMemOS](https://github.com/mindscale-noah/MindMemOS) · **作者**: [@mindscale-noah](https://github.com/mindscale-noah) · **功能简介**: - 2026-08-18：我们发布了 DeepSeek Harness 插件，让 DeepSeek Harness（dsh）Agent 自动召回并写入 MindMemOS 记忆。
- **插件名称**: [dsh-vision-router](https://github.com/ysr666/dsh-vision-router) · **作者**: [@ysr666](https://github.com/ysr666) · **功能简介**: Eyes for text-only DeepSeek Harness agents: built-in free vision chain (no key) + pixel-level vision tools (Q&A, grounding, crop, pixel diff, colors, OCR, SVG trace, cutout, screenshots). One-command install, no Python, image turns work like ordinary tool-calling turns.
- **插件名称**: [dsh-context](https://github.com/bowenliang123/dsh-context) · **作者**: [@bowenliang123](https://github.com/bowenliang123) · **功能简介**: The best DeepSeek Harness plugin for context insight and management, with context dashboard / browser and context command, for context statistics, composition, breakdown, evolution details, understanding how the context is made of, and how it evolves. 一站式 DeepSeek Harness 上下文可视化插件，Context 面板及浏览器与 Context 命令，透视上下文组成、演进、压缩、剪枝等事件与动作。
- **插件名称**: [tongflow](https://github.com/tong-io/tongflow) · **作者**: [@tong-io](https://github.com/tong-io) · **功能简介**: TongFlow — Multimodal GenAI Studio
- **插件名称**: [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) · **作者**: [@NanmiCoder](https://github.com/NanmiCoder) · **功能简介**: dsh-agent-teams 让当前 DeepSeek Harness 会话成为队长：创建可续聊的子 Agent、把目标拆成有依赖的任务，并通过直达消息协调成员工作。
- **插件名称**: [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) · **作者**: [@0xsline](https://github.com/0xsline) · **功能简介**: DeepSeek Harness (DSH) ecosystem: curated plugins, tools, and infrastructure from dsh-external/hub and the public dsh-plugin topic.
- **插件名称**: [dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) · **作者**: [@Anionex](https://github.com/Anionex) · **功能简介**: \[dsh]为纯文本模型设计更强大的视觉工具箱：安装免费使用、粘贴图片直接识别、多张图片问答、截图到前端UI 还原等｜DeepSeek Harness-native integration for agent-vision-toolkit: image Q&A, long-screenshot OCR, UI restoration, grounding, pixel diff, Artifacts, and Web UI.
- **插件名称**: [api-relay-audit](https://github.com/toby-bridges/api-relay-audit) · **作者**: [@toby-bridges](https://github.com/toby-bridges) · **功能简介**: Local security audit for AI API relays and LLM proxies: detects prompt injection, model substitution, tool-call rewriting, SSE anomalies, error leakage, and Web3 wallet risks.
- **插件名称**: [DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget) · **作者**: [@MeteorNOX](https://github.com/MeteorNOX) · **功能简介**: DeepSeek Harness（DSH）一只住在 DSH 界面右下角的小鲸鱼娘，帮你盯着DeepSeek账户余额。QQ弹弹，支持拖拽吸附、左吸附翻转、数字滚动动画，随界面自动启用，建议直接喊来你的dsh安装
- **插件名称**: [dsh-im](https://github.com/xmanrui/dsh-im) · **作者**: [@xmanrui](https://github.com/xmanrui) · **功能简介**: 通过扫码或机器人凭据把IM机器人接入DeepSeek Harness（支持飞书、微信、钉钉、企业微信、QQ、Slack、Telegram、Discord和WhatsApp）。 Connect IM bots to DeepSeek Harness via QR code or credentials (9 channels).
- **插件名称**: [working-activity](https://github.com/ccch1mneyyy/working-activity) · **作者**: [@ccch1mneyyy](https://github.com/ccch1mneyyy) · **功能简介**: Lively Working-line extension for pi CLI and DSH
- **插件名称**: [dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) · **作者**: [@Electricitysheep](https://github.com/Electricitysheep) · **功能简介**: DeepSeek Harness (dsh) 从 0 到 1 深度手册：安装/插件开发/性能调优/实测案例/同模型多 Agent 实测对比（中文 + 英文 PDF）
- **插件名称**: [sandbase-harness](https://github.com/sandbaseai/sandbase-harness) · **作者**: [@sandbaseai](https://github.com/sandbaseai) · **功能简介**: Local-first AI agent runtime with sandboxed sessions, MCP tools, memory, credentials, audit/replay, and a built-in console. Run OpenAI, Anthropic, MiniMax, DeepSeek V4, and OpenAI-compatible models on your infrastructure.
- **插件名称**: [deepseek-harness-desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app) · **作者**: [@vibeinging](https://github.com/vibeinging) · **功能简介**: DeepSeek Harness Desktop App: a local AI desktop workspace for DSH Sessions, projects, files, web research, plugins, and Office artifacts.
- **插件名称**: [dsh-desktop](https://github.com/vibeinging/dsh-desktop) · **作者**: [@vibeinging](https://github.com/vibeinging) · **功能简介**: DeepSeek Harness Desktop App: a local AI desktop workspace for DSH Sessions, projects, files, web research, plugins, and Office artifacts.
- **插件名称**: [treg](https://github.com/superdesigndev/treg) · **作者**: [@superdesigndev](https://github.com/superdesigndev) · **功能简介**: OpenRouter for agent tools. Join community here: https://discord.gg/6mQYYfFMAn
- **插件名称**: [graph-memory](https://github.com/adoresever/graph-memory) · **作者**: [@adoresever](https://github.com/adoresever) · **功能简介**: Deepseek Harness、Openclaw知识图谱记忆插件。2026年4月受邀发布在清华大学讨论会。Knowledge Graph + Memory；Knowledge Graph Context Engine for OpenClaw — extracts structured triples from conversations, compresses context 75%, enables cross-session experience reuse
- **插件名称**: [dsh-ads](https://github.com/Nagi-ovo/dsh-ads) · **作者**: [@Nagi-ovo](https://github.com/Nagi-ovo) · **功能简介**: 把 DSH 变成 2005 年门户网站｜Parody ads, fake games, and popups for the DSH Web UI
- **插件名称**: [k8e](https://github.com/xiaods/k8e) · **作者**: [@xiaods](https://github.com/xiaods) · **功能简介**: k8e.sh - OpenSource Agentic AI Sandbox Matrix
- **插件名称**: [deepseek-harness-studio](https://github.com/fufankeji/deepseek-harness-studio) · **作者**: [@fufankeji](https://github.com/fufankeji) · **功能简介**: DeepSeek Harness 零代码桌面端｜一键启动，支持 Windows 与 macOS；内置插件发现、热点插件推送、一键安装与管理、AI 智能推荐和视觉增强。
- **插件名称**: [hol-guard](https://github.com/hashgraph-online/hol-guard) · **作者**: [@hashgraph-online](https://github.com/hashgraph-online) · **功能简介**: Open-source antivirus for AI agents: block risky tools, secret access, prompt injection, malicious packages, MCP servers, plugins, and skills at runtime.
- **插件名称**: [memtrace-public](https://github.com/syncable-dev/memtrace-public) · **作者**: [@syncable-dev](https://github.com/syncable-dev) · **功能简介**: Structural memory for AI coding agents. Bi-temporal graph, MCP-native, zero LLM calls. Cursor · Claude Code · Codex · DeepSeek Harness · Hermes · VS Code · Windsurf.
- **插件名称**: [dsh-at-file](https://github.com/FSMargoo/dsh-at-file) · **作者**: [@FSMargoo](https://github.com/FSMargoo) · **功能简介**: Codex-style @file mentions for DeepSeek Harness: search workspace files in the composer and attach their path to prompts.
- **插件名称**: [superdesign-skill](https://github.com/superdesigndev/superdesign-skill) · **作者**: [@superdesigndev](https://github.com/superdesigndev) · **功能简介**: The design skill for Claude Code, Cursor and any coding agent. Stop shipping AI-slop UI: turn it into shippable, tasteful frontend. Install: npx skills add superdesigndev/superdesign-skill. Powered by superdesign.dev
- **插件名称**: [AI-Novel-Writer](https://github.com/EthanYoQ/AI-Novel-Writer) · **作者**: [@EthanYoQ](https://github.com/EthanYoQ) · **功能简介**: 本地优先 AI 小说创作工作台，提供 Windows/macOS 桌面版与 DeepSeek Harness 插件开发预览，支持角色、大纲、章节蓝图、审稿修稿和本地模型。
- **插件名称**: [Minke](https://github.com/lencx/Minke) · **作者**: [@lencx](https://github.com/lencx) · **功能简介**: 🐳 DeepSeek Harness Desktop
- **插件名称**: [MisakaNet](https://github.com/Ikalus1988/MisakaNet) · **作者**: [@Ikalus1988](https://github.com/Ikalus1988) · **功能简介**: 📚 A zero-dependency, git-backed micro-lesson library for AI Agents to asynchronously share and search verified debugging experience. Python stdlib only. \ · https://misakanet.org
- **插件名称**: [dsh-browser](https://github.com/Lum1104/dsh-browser) · **作者**: [@Lum1104](https://github.com/Lum1104) · **功能简介**: dsh plugin: Chrome sidebar extension that lets DeepSeek Harness operate your browser directly, no vision capabilities required. 一款 Chrome 侧边栏扩展程序，可让 DeepSeek Harness 直接操控您的浏览器，无需视觉能力。
- **插件名称**: [anolisa](https://github.com/alibaba/anolisa) · **作者**: [@alibaba](https://github.com/alibaba) · **功能简介**: ANOLISA (Agentic Nexus Operating Layer & Interface System Architecture) \ · Agentic OS with runtime, security, observability, and Tokenless response compression for lower token usage and cost.
- **插件名称**: [de-anthropocentric-research-engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine) · **作者**: [@yogsoth-ai](https://github.com/yogsoth-ai) · **功能简介**: 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction.
- **插件名称**: [DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin) · **作者**: [@WYH66666666](https://github.com/WYH66666666) · **功能简介**: 是一层高自由度的玻璃质感主题，套在 DeepSeek Harness 网页端。顶栏、侧边栏、输