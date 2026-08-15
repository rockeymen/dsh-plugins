# Oh-My-DSH — DeepSeek Harness Plugin Ecosystem

> **Data source:** GitHub `dsh-plugin` topic + `deepseek-harness` keyword search, as of 2026-08-15
> **数据来源：** GitHub `dsh-plugin` topic + `deepseek-harness` 关键词搜索，截至 2026-08-15
> The `dsh-plugin` topic contains **2,300+** repositories; this is a curated subset organized by category and stars.
> `dsh-plugin` topic 共 **2,300+** 个仓库，以下为按类别和 Star 精选的子集。

> **🏆 The only automated, multi-source DSH plugin discovery engine on GitHub.**
> **GitHub 上唯一的多源自动化 DSH 插件发现引擎。**

## ⚡ Quick Start / 快速开始

```sh
# Clone & install the hourly discovery agent
git clone https://github.com/NoWint/Oh-My-DSH.git
cd Oh-My-DSH/Oh-My-DSH
cp .env.example .env   # add your GITHUB_TOKEN (optional but recommended)
chmod 600 .env
./scripts/install-hourly-discovery.sh install
```

That's it. Every hour the pipeline scans 6 data sources, validates plugins against evidence rules, and updates this README automatically.

> **只需一条命令**：克隆 → 复制 `.env` → 安装 LaunchAgent，之后全自动运行。

## 📊 Ecosystem at a Glance / 生态总览

| Metric / 指标 | Value / 数值 |
|---|---|
| `dsh-plugin` topic total / 话题总仓库数 | **2,700+** |
| Curated & validated entries / 精选收录 | **~627+** |
| Data sources scanned / 扫描数据源 | **6** (GitHub · GitLab · Hacker News · Lobsters · Stack Exchange · Reddit) |
| Update frequency / 更新频率 | **Hourly** (LaunchAgent, 3600s interval) |
| Validation classification / 验证分级 | **4-tier**: validated · probable · lead · rejected |
| Highest-starred plugin / 最高 Star 插件 | [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) ⭐ 1.9k |
| Primary languages / 主要语言 | TypeScript · JavaScript · Python |
| Categories covered / 覆盖类目 | **19** (see Table of Contents) |
| Last full scan / 最近扫描 | 2026-08-15 · **+32 new** resources across 9 categories, 13 star counts refreshed |

## 🏆 Why Oh-My-DSH? / 为什么选择我们

| Feature / 特性 | NoWint/Oh-My-DSH | LaplaceYoung/oh-my-dsh | like-study1/Oh-My-DSH | AdamPlatin123/awesome-dsh-plugins |
|---|:---:|:---:|:---:|:---:|
| Multi-source scanning / 多源扫描 | ✅ **6 sources** | ❌ GitHub only | ❌ GitHub only | ❌ GitHub only |
| Evidence-based validation / 证据验证 | ✅ 4-tier system | ❌ None | ❌ None | ❌ None |
| Auto-update / 自动更新 | ✅ **Hourly** | ❌ Manual | ✅ Every 8h | ❌ Manual |
| Cross-platform sources / 跨平台 | ✅ HN · RE · SE · Lobsters | ❌ | ❌ | ❌ |
| Bilingual (EN/ZH) / 双语 | ✅ | ❌ ZH only | ❌ ZH only | ❌ ZH only |
| Test suite / 测试套件 | ✅ **7 test files** | ❌ | ❌ | ❌ |
| GitOps safety / Git 操作安全 | ✅ lock + rollback | ❌ | ❌ | ❌ |
| Star count / Star 数 | ⭐ 4 | ⭐ 43 | ⭐ 16 | ⭐ 641 |

> **核心差异**：其他 oh-my-dsh 项目是**静态 README 列表**，Oh-My-DSH 是**活的发现引擎**——自动扫描、自动验证、自动更新目录。

## 📋 Table of Contents / 导航索引

- [⚡ Quick Start / 快速开始](#-quick-start--快速开始)
- [📊 Ecosystem at a Glance / 生态总览](#-ecosystem-at-a-glance--生态总览)
- [🏆 Why Oh-My-DSH? / 为什么选择我们](#-why-oh-my-dsh--为什么选择我们)
- [🤝 Contributing / 贡献](#-contributing--贡献)
- [🏠 Core / 核心](#-core)
- [📂 Awesome Lists / 精选列表](#-awesome-lists)
- [🖥️ Desktop Clients / 桌面客户端](#-desktop-clients)
- [⌨️ Terminal TUI / 终端 TUI](#-terminal-tui)
- [👁️ Vision & Multimodal / 视觉与多模态](#-vision--multimodal)
- [🌐 Browser & Web Enhancements / 浏览器与 Web 增强](#-browser--web-enhancements)
- [🛠️ Development Tools / 开发工具](#-development-tools)
- [🔧 Utility Toolkit / 实用工具集](#-utility-toolkit)
- [💬 Communications & IM Bridges / 通讯与 IM 桥接](#-communications--im-bridges)
- [🧠 Memory & Persistence / 记忆与持久化](#-memory--persistence)
- [🤖 Multi-Agent & Workflows / 多 Agent 与工作流](#-multi-agent--workflows)
- [🎨 Skins & Desktop Pets / 皮肤与桌宠](#-skins--desktop-pets)
- [🔔 Notifications & Status / 通知与状态](#-notifications--status)
- [📊 Data & Finance / 数据与金融](#-data--finance)
- [🎮 Entertainment / 娱乐与趣味](#-entertainment)
- [📚 Tutorials & Guides / 教程与手册](#-tutorials--guides)
- [🔌 Infrastructure / 基础设施](#-infrastructure)
- [🎙️ Voice & Audio / 语音与音频](#-voice--audio)
- [⚡ Skills & Methodologies / 技能与方法论](#-skills--methodologies)
- [🔬 Advanced & Experimental / 高级与实验性](#-advanced--experimental)
- [📥 Installation / 安装](#-installation--安装)

## 🏠 Core / 核心

| Stars | Repo | Description / 描述 |
|-------|------|---------------------|
| ⭐ 92.4k | [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) | Official core: **Everything is a Plugin.** Plugin-based agent harness powered by [Cordis](https://github.com/cordiverse/cordis). / 官方核心：**万物皆可插件。** 基于 Cordis 的插件化 agent 框架。 |

## 📂 Awesome Lists / 精选列表

| Stars | Repo | Description / 描述 |
|-------|------|---------------------|
| ⭐ 847 | [AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | Radar: auto-scans all dsh plugin candidates; verified ones moved to curated index. / 雷达：自动扫描所有 dsh 插件候选，经测试移入精选目录。 |
| ⭐ 1.23k | [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | Curated plugin list for DeepSeek Harness. / DeepSeek Harness 精选插件列表。 |
| ⭐ 384 | [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | DSH ecosystem: curated plugins, tools & infrastructure from dsh-external/hub and public dsh-plugin topic. / DSH 生态精选：来自 dsh-external/hub 及公开 dsh-plugin topic 的插件、工具与基础设施。 |
| ⭐ 47 | [Alex-Yanggg/awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) | Meticulously curated list of plugins, extensions, tools & dev resources for DSH. / 精心编排的 DSH 插件、扩展、工具与开发资源列表。 |
| ⭐ 32 | [libukai/awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) | The Ultimate Guide to DeepSeek Harness: QuickStart, Resources, Plugins & Toolkit. / DeepSeek Harness 终极指南：快速入门、资源推荐、精选插件与实用工具。 |
| ⭐ 92 | [bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) | Find your DSH plugin in 30 seconds — not just a list, tells you what problem it solves. / 30 秒找到适合你的 DSH 插件：不只是列表，告诉你解决什么问题。 |
| ⭐ 30 | [Dominic789654/awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) | Curated plugins, skills, MCP servers, orchestrators & UIs for DSH. / DSH 精选插件、Skills、MCP Server、Orchestrator 与 UI。 |
| ⭐ 44 | [LaplaceYoung/oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) | 700+ plugin ecosystem, registered only via extension seams, never modifying the agent-loop skeleton. / 700+ 插件生态，只通过扩展接缝注册，不修改 agent-loop 骨架。 |
| ⭐ 22 | [like-study1/Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) | Community-maintained Oh-My-DSH mirror: auto-synced dsh-plugin catalog every 8 hours. / 社区维护的 Oh-My-DSH 镜像：每 8 小时自动同步 dsh-plugin 生态精选。 |
| ⭐ 7 | [kejixiaoliang/awesome-dsh-plugins](https://github.com/kejixiaoliang/awesome-dsh-plugins) | DeepSeek Harness plugin curated directory — 14 categories, 280+ community plugins across MCP / Skill / TUI / Multi-Agent / Memory / Skins. / DSH 插件精选目录，14 类 280+ 社区插件，覆盖 MCP/Skill/TUI/多Agent/记忆/皮肤分类索引。 |
| ⭐ 11 | [zp-home/dsh-recommend](https://github.com/zp-home/dsh-recommend) | DSH plugin ecosystem transparent ranking: daily auto-scan of dsh-plugin topic, public scoring model, ranked lists, and static recommendation site. / DSH 插件生态透明排行：每日自动抓取 dsh-plugin 话题 + 公开评分模型 + 排行推荐插件与静态站。 |
| ⭐ 7 | [white0dew/awesome-dsh-plugins](https://github.com/white0dew/awesome-dsh-plugins) | Awesome DSH Plugins: a public GitHub directory for DSH plugins, install commands, and ecosystem tools. / DSH 插件公共 GitHub 目录，含安装命令与生态工具。 |
| ⭐ 4 | [billLiao/awesome-dsh-plugin](https://github.com/billLiao/awesome-dsh-plugin) | A curated list of plugins for DeepSeek Harness (dsh). / DeepSeek Harness 精选插件列表。 |
| ⭐ 5 | [YYTbit/awesome-dsh-bridges](https://github.com/YYTbit/awesome-dsh-bridges) | Bridge your favorite AI coding tools into DeepSeek Harness. / 将各 AI 编码工具桥接到 DSH。 |
| ⭐ 3 | [calderbuild/awesome-deepseek-harness](https://github.com/calderbuild/awesome-deepseek-harness) | Curated DeepSeek Harness resources: docs, concepts, packages, plugins, and write-ups. / DSH 精选资源：文档/概念/包/插件/写作。 |
| ⭐ 9 | [the-beating-light-of-the-nail/dsh-meme-hub](https://github.com/the-beating-light-of-the-nail/dsh-meme-hub) | The meme side of DeepSeek Harness — 贪玩蓝鲸/QQ2006/whale girls/mini-games curated tour. / DSH 梗文化精选：蓝鲸/QQ2006/鲸鱼娘/小游戏导览。 |
| ⭐ 2 | [uyq/awesome-dsh](https://github.com/uyq/awesome-dsh) | The community ecosystem and plugin directory for DeepSeek Harness. / DeepSeek Harness 社区生态与插件目录。 |
| ⭐ 2 | [cccakeee/awesome-dsh-plugins](https://github.com/cccakeee/awesome-dsh-plugins) | Evidence-led curated DSH plugin directory with verified loadable extensions. / 证据驱动的 DSH 插件精选目录：可验证加载的扩展。 |
| ⭐ 2 | [vvlife/awesome-deepseek-harness-plugins](https://github.com/vvlife/awesome-deepseek-harness-plugins) | Curated list of plugins, tools, skins, and extensions for DSH. / DSH 精选插件/工具/皮肤/扩展列表。 |
| ⭐ 1 | [HackSing/dsh-plugins](https://github.com/HackSing/dsh-plugins) | Bilingual, continuously maintained directory of DSH plugins. / 双语持续维护的 DSH 插件目录。 |
| ⭐ 1 | [tmstack/awesome-harness-plugins](https://github.com/tmstack/awesome-harness-plugins) | Awesome DeepSeek Harness Plugin. / DSH 精选插件。 |
| ⭐ 1 | [dshworks/awesome-dsh-themes](https://github.com/dshworks/awesome-dsh-themes) | Registry of DeepSeek Harness themes and --dsw-* token skins. / DSH 主题与 token 皮肤注册表。 |
| ⭐ 15 | [ZASENJC/dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store) | Auto-collected static catalog site for GitHub dsh-plugin topic — auto-categorizes and indexes plugins. / 自动收录分类 GitHub dsh-plugin Topic 项目的静态目录网站。 |
| ⭐ 8 | [Noob-stupid/dsh-plugin-hub](https://github.com/Noob-stupid/dsh-plugin-hub) | DSH plugin management panel: one-click enable/disable + GitHub dsh-plugin marketplace with plugin details and one-click install. / DSH 插件管理面板：一键启用/停用 + GitHub dsh-plugin 插件市场，带插件详情与一键安装。 |
| ⭐ 2 | [loguhan/dsh-workshop](https://github.com/loguhan/dsh-workshop) | Steam Workshop–style plugin store for DeepSeek Harness Web UI: browse 850+ community plugins, rating, one-click install. / Steam Workshop 风格 DSH Web UI 插件商店：浏览 850+ 社区插件，评分排序，一键安装。 |
| ⭐ 2 | [imlishiyuan/deepseek-harness-zh-cn](https://github.com/imlishiyuan/deepseek-harness-zh-cn) | Chinese-first plugin for DeepSeek Harness — translates the entire Web UI and agent interaction flow into simplified Chinese. / DSH 中文优先插件：将完整 Web UI 和 Agent 交互流程本地化为简体中文。 |

## 🖥️ Desktop Clients / 桌面客户端

| Stars | Repo | Description / 描述 |
|-------|------|---------------------|
| ⭐ 1.96k | [anywhere-labs/deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) | Electron desktop app deeply adapted for macOS & Windows — best out-of-the-box DSH experience. / 深度适配 macOS 和 Windows 的 Electron 桌面端，最佳开箱即用体验。 |
| ⭐ 326 | [PM-Shawn/Abu-Cowork](https://github.com/PM-Shawn/Abu-Cowork) | Open-source alternative to Claude Cowork — local-first AI agent desktop app with self-evolving skills, multi-model, privacy-first, and multi-Harness roadmap. / 本地优先 AI Agent 桌面应用：自进化技能、多模型、隐私优先，支持多 Harness 路线图。 |
| ⭐ 159 | [dataelement/dsh-desktop](https://github.com/dataelement/dsh-desktop) | Desktop for DeepSeek Harness. / DeepSeek Harness 桌面客户端。 |
| ⭐ 76 | [myYangyunfan/dsh_desktop](https://github.com/myYangyunfan/dsh_desktop) | Windows desktop client — bundled Node.js + dsh CLI, one-click launch. / Windows 桌面客户端，内置 Node.js + dsh CLI，一键启动。 |
| ⭐ 52 | [ChisaAlter/Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) | Electron desktop shell. / Electron 桌面壳。 |
| ⭐ 25 | [vibeinging/dsh-work](https://github.com/vibeinging/dsh-work) | Local-first AI workbench: Agent sessions + project files + data analysis + web research + MCP + Office. / Local-first AI 工作台：Agent 会话 + 项目文件 + 数据分析 + Web 研究 + MCP + Office。 |
| ⭐ 65 | [Ruler4396/dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | Lightweight Windows launcher: silent autostart + WebView2 window. / 轻量 Windows 启动器：静默开机自启 + WebView2 窗口。 |
| ⭐ 18 | [bruc3van/dsh-desktop](https://github.com/bruc3van/dsh-desktop) | Community-maintained third-party desktop client; auto-reuses local official instance. / 社区维护非官方桌面客户端，自动复用本机官方实例。 |
| ⭐ 20 | [CCMu04/DSHDesktop](https://github.com/CCMu04/DSHDesktop) | Unofficial Windows desktop client. / 非官方 Windows 桌面客户端。 |
| ⭐ 11 | [sleep2agi/DeepSeek-Harness-Desktop](https://github.com/sleep2agi/DeepSeek-Harness-Desktop) | Unofficial community desktop shell. / 非官方社区桌面壳。 |
| ⭐ 6 | [omdsh-dev/deepseek-harness-desktop](https://github.com/omdsh-dev/deepseek-harness-desktop) | DSH desktop app. / DSH 桌面应用。 |
| ⭐ 5 | [ding7015869-alt/dsh-web-desktop](https://github.com/ding7015869-alt/dsh-web-desktop) | Windows desktop client — WebView2 + tray mode. / Windows 桌面客户端，WebView2 + 托盘模式。 |
| ⭐ 11 | [openguardrails/dsh-tui](https://github.com/openguardrails/dsh-tui) | Claude Code-style terminal UI for DeepSeek Harness agents, as an out-of-tree dsh plugin bundle. / DSH 插件 bundle：Claude Code 风格终端 UI。 |
| ⭐ 7 | [whitelonng/dshcode](https://github.com/whitelonng/dshcode) | Community desktop companion — one-click Electron app for macOS & Windows. / 社区桌面伴侣，一键 Electron 应用（macOS/Windows）。 |
| ⭐ 3 | [longyu065/dsh-desktop](https://github.com/longyu065/dsh-desktop) | Desktop shell — auto-installs dsh, native macOS tray, packaged macOS & Windows. / 桌面壳，自动安装 dsh，原生 macOS 托盘，打包 macOS & Windows。 |
| ⭐ 3 | [Void0312Aurora/dsh-desktop-electron](https://github.com/Void0312Aurora/dsh-desktop-electron) | Cross-platform Electron shell, tray-resident standalone window. / 跨平台 Electron 壳，tray 常驻独立窗口。 |
| ⭐ 5 | [RZX00/deepseek-harness-desktop](https://github.com/RZX00/deepseek-harness-desktop) | DeepSeek Harness Windows desktop build: Electron shell over dsh web profile, packaged as installer. / DSH Windows 桌面版：Electron 封装官方 Web 配置文件，打包为安装程序。 |
| ⭐ 2 | [SnowCrescenter-tech/dsh-desktop](https://github.com/SnowCrescenter-tech/dsh-desktop) | Native Windows desktop shell: frameless window / tray / native notifications / single-instance / auto-launch. / 原生 Windows 桌面壳：无边框窗口/托盘/原生通知/单实例/开机自启。 |
| ⭐ 2 | [chyra-moon/deepseek-harness-desktop](https://github.com/chyra-moon/deepseek-harness-desktop) | 1:1 replica of the official Web UI as a Windows desktop app. / 1:1 复刻官方 Web UI 的 Windows 桌面应用。 |
| ⭐ 2 | [zsyu9779/dsh-desktop](https://github.com/zsyu9779/dsh-desktop) | Unofficial Wails (Go) desktop shell wrapping the dsh web UI in Codex-style native app. / 非官方 Wails (Go) 桌面壳，Codex 风格原生应用。 |
| ⭐ 2 | [SnowCrescenter-tech/dsh-launcher](https://github.com/SnowCrescenter-tech/dsh-launcher) | One-click portable launcher — no Node.js, no pnpm, no CLI needed. / 一键便携启动器：免 Node.js/pnpm/CLI。 |
| ⭐ 2 | [HaoyueQin/deepseek-harness-desktop](https://github.com/HaoyueQin/deepseek-harness-desktop) | Native-feeling, always-on desktop shell wrapping the official dsh web UI. / 原生质感、常驻后台的桌面应用壳。 |
| ⭐ 1 | [KhanZou/Deepseek-Harness-as-Desktop](https://github.com/KhanZou/Deepseek-Harness-as-Desktop) | Codex-style desktop app: WebView2 shell, system tray, auto-start, toast, skin center. / Codex 风格桌面应用：WebView2 + 系统托盘 + toast + 皮肤中心。 |
| ⭐ 1 | [SZMY-haruhi/dsh-desktop-shell](https://github.com/SZMY-haruhi/dsh-desktop-shell) | Pure Electron shell for DeepSeek Harness — no bundled code, spawns npx @deepseek-ai/dsh@latest web, loads 127.0.0.1:3080, transparent to all plugins. / 纯 Electron 壳：不捆绑代码，调用 npx 启动 dsh web，加载 127.0.0.1:3080，对所有插件透明。 |
| ⭐ 1 | [KnCRJVirX/dsh-desktop](https://github.com/KnCRJVirX/dsh-desktop) | Electron desktop wrapper for DeepSeek Harness. / DeepSeek Harness 的 Electron 桌面封装。 |
| ⭐ 1 | [kyorakuyk/dsh-desktop](https://github.com/kyorakuyk/dsh-desktop) | Desktop shell for DSH. / DSH 桌面壳。 |
| ⭐ 1 | [czzzlq/deepseek-harness-desktop](https://github.com/czzzlq/deepseek-harness-desktop) | deepseek-harness desktop client. / deepseek-harness 桌面端。 |
| ⭐ 1 | [fengzhiyushui/dsh-desktop-window](https://github.com/fengzhiyushui/dsh-desktop-window) | Desktop window for DSH. / DSH 桌面窗口。 |
| ⭐ 1 | [Asaiuta/dsh-session-hub](https://github.com/Asaiuta/dsh-session-hub) | Aggregate and natively control multiple remote DSH servers' sessions from one official Web UI. / 多服务器 DSH 会话聚合与原生操控 — hub gateway + 官方 UI 桥接。 |
| ⭐ 1 | [tttnny/DSH-Launcher](https://github.com/tttnny/DSH-Launcher) | macOS menu bar app managing the DSH web service via launchd. / macOS 菜单栏应用，通过 launchd 管理服务。 |
| ⭐ 1 | [SeverusZh/dsh-notify-windows](https://github.com/SeverusZh/dsh-notify-windows) | Windows notification plugin. / Windows 通知插件。 |
| ⭐ 2 | [starf233-2/DeepSeek-Harness-Desktop](https://github.com/starf233-2/DeepSeek-Harness-Desktop) | DeepSeek Harness Desktop packages DeepSeek's agent harness into a double-clickable Windows portable. / DSH Windows 便携桌面包。 |
| ⭐ 2 | [TMLX1453/DeepSeek-Harness-Desktop](https://github.com/TMLX1453/DeepSeek-Harness-Desktop) | Codex-packaged DeepSeek Harness desktop client. / Codex 打包 DSH 桌面端。 |
| ⭐ 2 | [qingyu321/dsh-gui](https://github.com/qingyu321/dsh-gui) | DeepSeek Harness self-contained desktop GUI — Electron shell, iframe-embedded official webui, portable single exe + NSIS. / DSH 自包含桌面 GUI（Electron 壳，iframe 嵌入官方 webui，便携单 exe + NSIS 安装包）。 |
| ⭐ 1 | [zneoxlab/deepseek-harness-app](https://github.com/zneoxlab/deepseek-harness-app) | DeepSeek Harness Desktop — a native desktop app for DSH. / DSH 原生桌面应用。 |
| ⭐ 1 | [MoneShadow/DeepSeek-Harness-linux-](https://github.com/MoneShadow/DeepSeek-Harness-linux-) | Linux desktop DSH based on official WebUI — bundled vision plugin, 4 iterations. / 基于官方 WebUI 二改的 Linux 桌面端。 |
| ⭐ 1 | [Aetik-yue/whalecode](https://github.com/Aetik-yue/whalecode) | DeepSeek Harness WebUI desktop wrapper (Electron): one-click launch, auto-update, official whale icon. / DSH WebUI Electron 桌面封装：一键启动，自动更新。 |
| ⭐ 1 | [jenokagong-dotcom/dsh-webui-launcher](https://github.com/jenokagong-dotcom/dsh-webui-launcher) | One-click Windows launcher for DeepSeek Harness Web UI: auto-starts service, opens browser. / 一键 Windows 启动器。 |
| ⭐ 1 | [FUOQL/DeepSeek-Launcher](https://github.com/FUOQL/DeepSeek-Launcher) | Windows launcher for DeepSeek Harness Agent. / DSH Windows 启动器。 |
| ⭐ 1 | [qzhqzh/dsh-quickstart](https://github.com/qzhqzh/dsh-quickstart) | Desktop launcher for DeepSeek Harness — start dsh w