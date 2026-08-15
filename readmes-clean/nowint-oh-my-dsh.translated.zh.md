# Oh-My-DSH — DeepSeek Harness Plugin Ecosystem

> **Data source:** GitHub `dsh-plugin` topic + `deepseek-harness` keyword search, as of 2026-08-15
> **数据来源：** GitHub `dsh-plugin` topic + `deepseek-harness` 关键词搜索，截至 2026-08-15
> The `dsh-plugin` topic contains **2,700+** repositories; this is a curated subset organized by category and stars.
> `dsh-plugin` topic 共 **2,700+** 个仓库，以下为按类别和 Star 精选的子集。

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

### Metric / 指标 · Value / 数值
- **Metric / 指标**: `dsh-plugin` topic total / 话题总仓库数 · **Value / 数值**: **2,700+**
- **Metric / 指标**: Curated & validated entries / 精选收录 · **Value / 数值**: **~700+**
- **Metric / 指标**: Data sources scanned / 扫描数据源 · **Value / 数值**: **6** (GitHub · GitLab · Hacker News · Lobsters · Stack Exchange · Reddit)
- **Metric / 指标**: Update frequency / 更新频率 · **Value / 数值**: **Hourly** (LaunchAgent, 3600s interval)
- **Metric / 指标**: Validation classification / 验证分级 · **Value / 数值**: **4-tier**: validated · probable · lead · rejected
- **Metric / 指标**: Highest-starred plugin / 最高 Star 插件 · **Value / 数值**: [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) ⭐ 2.1k
- **Metric / 指标**: Primary languages / 主要语言 · **Value / 数值**: TypeScript · JavaScript · Python
- **Metric / 指标**: Categories covered / 覆盖类目 · **Value / 数值**: **19** (see Table of Contents)
- **Metric / 指标**: Last full scan / 最近扫描 · **Value / 数值**: 2026-08-15 · **+19 new** resources across 8 categories, **~25** star counts refreshed

## 🏆 Why Oh-My-DSH? / 为什么选择我们

### Feature / 特性 · NoWint/Oh-My-DSH · LaplaceYoung/oh-my-dsh · like-study1/Oh-My-DSH · AdamPlatin123/awesome-dsh-plugins
- **Feature / 特性**: Multi-source scanning / 多源扫描 · **NoWint/Oh-My-DSH**: ✅ **6 sources** · **LaplaceYoung/oh-my-dsh**: ❌ GitHub only · **like-study1/Oh-My-DSH**: ❌ GitHub only · **AdamPlatin123/awesome-dsh-plugins**: ❌ GitHub only
- **Feature / 特性**: Evidence-based validation / 证据验证 · **NoWint/Oh-My-DSH**: ✅ 4-tier system · **LaplaceYoung/oh-my-dsh**: ❌ None · **like-study1/Oh-My-DSH**: ❌ None · **AdamPlatin123/awesome-dsh-plugins**: ❌ None
- **Feature / 特性**: Auto-update / 自动更新 · **NoWint/Oh-My-DSH**: ✅ **Hourly** · **LaplaceYoung/oh-my-dsh**: ❌ Manual · **like-study1/Oh-My-DSH**: ✅ Every 8h · **AdamPlatin123/awesome-dsh-plugins**: ❌ Manual
- **Feature / 特性**: Cross-platform sources / 跨平台 · **NoWint/Oh-My-DSH**: ✅ HN · RE · SE · Lobsters · **LaplaceYoung/oh-my-dsh**: ❌ · **like-study1/Oh-My-DSH**: ❌ · **AdamPlatin123/awesome-dsh-plugins**: ❌
- **Feature / 特性**: Bilingual (EN/ZH) / 双语 · **NoWint/Oh-My-DSH**: ✅ · **LaplaceYoung/oh-my-dsh**: ❌ ZH only · **like-study1/Oh-My-DSH**: ❌ ZH only · **AdamPlatin123/awesome-dsh-plugins**: ❌ ZH only
- **Feature / 特性**: Test suite / 测试套件 · **NoWint/Oh-My-DSH**: ✅ **7 test files** · **LaplaceYoung/oh-my-dsh**: ❌ · **like-study1/Oh-My-DSH**: ❌ · **AdamPlatin123/awesome-dsh-plugins**: ❌
- **Feature / 特性**: GitOps safety / Git 操作安全 · **NoWint/Oh-My-DSH**: ✅ lock + rollback · **LaplaceYoung/oh-my-dsh**: ❌ · **like-study1/Oh-My-DSH**: ❌ · **AdamPlatin123/awesome-dsh-plugins**: ❌
- **Feature / 特性**: Star count / Star 数 · **NoWint/Oh-My-DSH**: ⭐ 4 · **LaplaceYoung/oh-my-dsh**: ⭐ 43 · **like-study1/Oh-My-DSH**: ⭐ 16 · **AdamPlatin123/awesome-dsh-plugins**: ⭐ 641

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

### Stars · Repo · Description / 描述
- **Stars**: ⭐ 92.4k · **Repo**: [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) · **Description / 描述**: Official core: **Everything is a Plugin.** Plugin-based agent harness powered by [Cordis](https://github.com/cordiverse/cordis). / 官方核心：**万物皆可插件。** 基于 Cordis 的插件化 agent 框架。
- **Stars**: ⭐ 1.04k · **Repo**: [xiaobright/dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) · **Description / 描述**: Two-phase DSH preset: Minimal-aligned bootstrap, then full Standard tooling (Project2 98/99). / 两阶段 DSH 预设：Minimal 对齐引导，再切换到完整 Standard 工具集（Project2 98/99）。

## 📂 Awesome Lists / 精选列表

### Stars · Repo · Description / 描述
- **Stars**: ⭐ 873 · **Repo**: [AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) · **Description / 描述**: Radar: auto-scans all dsh plugin candidates; verified ones moved to curated index. / 雷达：自动扫描所有 dsh 插件候选，经测试移入精选目录。
- **Stars**: ⭐ 1.44k · **Repo**: [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) · **Description / 描述**: Curated plugin list for DeepSeek Harness. / DeepSeek Harness 精选插件列表。
- **Stars**: ⭐ 384 · **Repo**: [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) · **Description / 描述**: DSH ecosystem: curated plugins, tools & infrastructure from dsh-external/hub and public dsh-plugin topic. / DSH 生态精选：来自 dsh-external/hub 及公开 dsh-plugin topic 的插件、工具与基础设施。
- **Stars**: ⭐ 47 · **Repo**: [Alex-Yanggg/awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) · **Description / 描述**: Meticulously curated list of plugins, extensions, tools & dev resources for DSH. / 精心编排的 DSH 插件、扩展、工具与开发资源列表。
- **Stars**: ⭐ 32 · **Repo**: [libukai/awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) · **Description / 描述**: The Ultimate Guide to DeepSeek Harness: QuickStart, Resources, Plugins & Toolkit. / DeepSeek Harness 终极指南：快速入门、资源推荐、精选插件与实用工具。
- **Stars**: ⭐ 92 · **Repo**: [bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) · **Description / 描述**: Find your DSH plugin in 30 seconds — not just a list, tells you what problem it solves. / 30 秒找到适合你的 DSH 插件：不只是列表，告诉你解决什么问题。
- **Stars**: ⭐ 30 · **Repo**: [Dominic789654/awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) · **Description / 描述**: Curated plugins, skills, MCP servers, orchestrators & UIs for DSH. / DSH 精选插件、Skills、MCP Server、Orchestrator 与 UI。
- **Stars**: ⭐ 45 · **Repo**: [LaplaceYoung/oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) · **Description / 描述**: 700+ plugin ecosystem, registered only via extension seams, never modifying the agent-loop skeleton. / 700+ 插件生态，只通过扩展接缝注册，不修改 agent-loop 骨架。
- **Stars**: ⭐ 22 · **Repo**: [like-study1/Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) · **Description / 描述**: Community-maintained Oh-My-DSH mirror: auto-synced dsh-plugin catalog every 8 hours. / 社区维护的 Oh-My-DSH 镜像：每 8 小时自动同步 dsh-plugin 生态精选。
- **Stars**: ⭐ 7 · **Repo**: [kejixiaoliang/awesome-dsh-plugins](https://github.com/kejixiaoliang/awesome-dsh-plugins) · **Description / 描述**: DeepSeek Harness plugin curated directory — 14 categories, 280+ community plugins across MCP / Skill / TUI / Multi-Agent / Memory / Skins. / DSH 插件精选目录，14 类 280+ 社区插件，覆盖 MCP/Skill/TUI/多Agent/记忆/皮肤分类索引。
- **Stars**: ⭐ 11 · **Repo**: [zp-home/dsh-recommend](https:

//github.com/zp-home/dsh-recommend) · **描述/描述**：DSH插件生态系统透明排名：每日自动扫描dsh-插件主题、公开评分模型、排名列表等