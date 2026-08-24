> 面向 AI 编程协作者：开始任何工作前，请先阅读本目录的 `AI_AGENTS.md`，并遵循其中的同步/检查/上报流程。

# Dseam World — DSH-Hotplug-Hub

**DSH-Hotplug-Hub** is the plugin manager for **Dseam World** — a Windows desktop application (WebView2 + C# WinForms) that manages DSH plugins, Skills, and MCP servers, with global memory. It works **alongside** DSH Desktop, without touching the DSH Desktop installation directory, by installing everything into the unified official profile at `~/.dsh/profiles/web`.

## About

A hot-plug package manager for [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness). It introduces the concept of a **hotpack** — a versioned, portable bundle of plugins that can be imported, activated, deactivated, or removed without modifying the host. Built on the same mechanism as [dsh-hub](https://github.com/ARFCON/dsh-hub-DSH): `typert` Remote API + web page + atomic profile writes + `link` assembly.

## Current Version

###  ·
- **Release** · **v1.0.1**
- Releases page · <https://github.com/ARFCON/dsh-hotplug-hub/releases/tag/v1.0.1>
- Windows installer · `DSH-Hotplug-Hub-win-x64-setup-v1.0.1.exe`
- Windows portable · `DSH-Hotplug-Hub-win-x64-portable-v1.0.1.zip`
- Linux installer · `DSH-Hotplug-Hub-linux-x64-setup-v1.0.1.sh`
- Linux portable · `DSH-Hotplug-Hub-linux-x64-portable-v1.0.1.tar.gz`
- macOS installer · `DSH-Hotplug-Hub-macos-x64-setup-v1.0.1.command`
- macOS portable · `DSH-Hotplug-Hub-macos-x64-portable-v1.0.1.zip`

## Key Features

- **插件管理** — 安装/禁用/卸载插件和插件包。
- **技能管理** — 扫描固定源目录（默认 `%APPDATA%\reasonix\skills`，可通过 `DSH_SKILL_SOURCE_DIR` 覆盖）查找所有 `SKILL.md` 文件，然后单击安装/禁用。由 `dseam-skillmcp` CLI 支持。
- **MCP 管理** — 添加/删除/禁用 `STDIO` 和 `streamable-http` MCP 服务器，统一写入 `dseam-skillmcp` 管理器模块。
- **全局内存** — 通过内置内存功能查看/编辑/删除每个项目的条目。当AI需要关键信息（偏好/规则/约束/注释/记忆/项目目标）时，它会触发记忆提示，并且绝不会让AI自行编辑或删除记忆。
- **捆绑技能/MCP 管理器** — `dseam-skillmcp`（源自 `dsh-skill-mcp-panel`，MIT），随安装程序/EXE 一起提供，自动安装到配置文件中；无需单独下载。
- **版本一致性** — `dseam-skillmcp` 和 `dsh-hub` 嵌入安装程序/便携式应用程序中，并随每个版本自动更新；没有重复下载。
- **托盘驻留** — 靠近系统托盘；后台进程持续运行；双击该图标重新打开现有窗口。
- **自我检查和自我修复** - 启动时，自动检查 Node / pnpm / profile / plugins / config；如果需要，自动安装或修复环境。

## 5 个选项卡

### 选项卡·说明
- **选项卡**：**插件管理** · **描述**：导入热包 JSON（粘贴或选择文件）、预览、下载、激活/停用/删除、显示存储状态。
- **选项卡**：**插件市场** · **描述**：按主题标签划分的真实 GitHub 市场；一键安装条目。
- **选项卡**：**AI汇编器** · **描述**：由真正的LLM（DeepSeek / OpenCode / OpenRouter / Sensetime / Moonshot /zhipu / MiniMax，OpenAI兼容端点）驱动的对话式汇编（角色切换+自然语言）；验证 hotpack 清单 + README，一键编写 hotpack JSON。
- **选项卡**：**全局内存** · **说明**：显示 `~/.dsh/memory` 全局内存目录路径和存储条目数。
- **选项卡**：**自检** · **描述**：运行`check()`远程服务；显示 Node/pnpm 版本、配置文件状态、补丁状态、插件冲突、打包/存储状态。

## 安装

### 选项 1 — 安装程序（推荐）

1. 从发布页面下载 `DSH-Hotplug-Hub-win-x64-setup-v1.0.1.exe`。
2. 双击并选择安装位置（默认`%LOCALAPPDATA%\Programs\DseamWorld`）。
3. 安装程序会自动创建桌面/开始菜单快捷方式并在完成后启动。

静默安装：

```powershell
DSH-Hotplug-Hub-win-x64-setup-v1.0.1.exe --silent
DSH-Hotplug-Hub-win-x64-setup-v1.0.1.exe --silent --dir "D:\MyApps\DseamWorld"
```

### 选项 2 — 便携式

- **Windows**：解压 `DSH-Hotplug-Hub-win-x64-portable-v1.0.1.zip`，然后双击 `DSH-Hotplug-Hub.exe`（WebView2 运行时 DLL 包含在同一目录中）。
- **Linux**：`tar -xzf DSH-Hotplug-Hub-linux-x64-portable-v1.0.1.tar.gz`，然后运行 ​​`./dsh-hotplug-hub`。
- **macOS**：解压 `DSH-Hotplug-Hub-macos-x64-portable-v1.0.1.zip`，然后双击 `Start-DSH-Hotplug-Hub.command`。

### 选项 3 — 来自源头

需要 Node.js 18+（推荐 LTS）、pnpm 和 `dsh` CLI。

```bash
./install.sh          # auto-detect desktop / web / headless profile
./install.sh web      # target a specific profile
```

## 热包格式

```json
{
  "hotpack": "1.0",
  "id": "pack.research",
  "name": "Research hotpack",
  "version": "1.0.0",
  "description": "Literature + mind-map + note sync",
  "tags": ["research", "study"],
  "plugins": [
    { "id": "literature", "name": "@dsh-community/dsh-tool-literature", "version": "1.2.3", "source": { "type": "npm" } },
    { "id": "mine", "name": "my-plugin", "source": { "type": "path", "path": "~/dev/my-plugin" } },
    { "id": "team", "name": "team-tool", "source": { "type": "github", "repo": "owner/team-tool", "ref": "v1.0.0" } }
  ]
}
```

支持的来源：

- `npm` — 需要确切的版本； `pnpm add --save-exact`进入配置文件，共享pnpm全局存储。
- `path` — 直接链接本地目录（与`graph-memory`相同）；支持`~`和`$DSH_HOME`扩展。
- `github` — zip → `~/.dsh/hotplug-store/<name>@<ref>` → 链接；首先加载官方代码，然后加载 `ghfast.top` / `gh-proxy` / `ghproxy` 镜像。

## 目录结构

```text
dsh-hotplug-hub-test/              # repo root
├── packages/shared-core/          # shared core: contracts / types / shared logic
├── release/                       # build EXE, installer, WebView2 DLLs, embedded C# contracts
├── scripts/                       # team scripts: sync / check / test / install
├── launcher/                      # Node CLI: assemble / check / launch / heal / status
├── dsh-hotplug-hub/               # hotplug-hub plugin + dsh-pack-hub
├── vendor/dseam-skillmcp/         # Skill/MCP manager source (MIT)
├── installer/                     # historical installer factories
├── uninstaller/                   # uninstaller factories
├── assembly/                      # assembly packs (hotpack 1.0, dshpack single-entry)
├── sandbox/                       # temporary profile sandboxes
├── 开发文档/                       # team docs & conventions
├── README.md                      # this file
└── LICENSE                        # MIT License
```

## 发展

````powershell
# 编辑之前 — 同步存储库
pwsh -文件脚本/sync-repo.ps1

# 提交之前 — 全面检查
pwsh -文件脚本/check-before-upload.ps1

# After each change — record to global memory
pwsh -File scripts/remember-doc.ps1 -DocPath README.md
```

Team conventions live in `AI_AGENTS.md` and `开发文档/团队/`.

# Dseam 世界（DSH-Hotplug-Hub）

**DSH-Hotplug-Hub** 是 **Dseam 世界** 的插件管理器——一款 Windows 桌面应用（WebView2 + C# WinForms），用于管理 DSH 的插件、Skill 与 MCP 服务器，并提供全局记忆。它与 DSH Desktop **并存运行**，不改动 DSH Desktop 安装目录，而是把所有内容统一安装到官方 profile `~/.dsh/profiles/web`，随 DSH 自行加载。

## 关于（About）

面向 [DeepSeek Harness（dsh）](https://github.com/deepseek-ai/deepseek-harness) 的热插拔包管理器。核心概念是 **hotpack**——一个带版本、可移植的插件集合，可以导入、激活、停用、移除，全程不动宿主。与 [dsh-hub](https://github.com/ARFCON/dsh-hub-DSH) 共用同一套机制：`typert` Remote API + 网页 + profile 原子写入 + `link` 装配。

## 当前版本

###  ·
- **正式版** · **v1.0.1**
- 发布页 · <https://github.com/ARFCON/dsh-hotplug-hub/releases/tag/v1.0.1>
- Windows 安装版 · `DSH-Hotplug-Hub-win-x64-setup-v1.0.1.exe`
- Windows 便携版 · `DSH-Hotplug-Hub-win-x64-portable-v1.0.1.zip`
- Linux 安装版 · `DSH-Hotplug-Hub-linux-x64-setup-v1.0.1.sh`
- Linux 便携版 · `DSH-Hotplug-Hub-linux-x64-portable-v1.0.1.tar.gz`
- macOS 安装版 · `DSH-Hotplug-Hub-macos-x64-setup-v1.0.1.command`
- macOS 便携版 · `DSH-Hotplug-Hub-macos-x64-portable-v1.0.1.zip`

## 主要功能

- **插件管理**——安装 / 停用 / 卸载插件与插件集合。
- **Skill 管理**——扫描固定源目录（默认 `%APPDATA%\reasonix\skills`，可用 `DSH_SKILL_SOURCE_DIR` 覆盖）下的所有 `SKILL.md`，一键安装 / 停用；由 `dseam-skillmcp` CLI 支撑。
- **MCP 管理**——支持 `STDIO` 与 `streamable-http` 两类 MCP 服务器的添加 / 删除 / 停用，统一写入 `dseam-skillmcp` 管理模块。
- **全局记忆**——通过内置记忆功能按项目查看 / 编辑 / 删除条目；当 AI 需要关键信息（偏好 / 规则 / 约束 / 备注 / 记忆 / 项目目标）时触发记忆提示，且**不允许 AI 自行修改 / 删除记忆**。
- **内置 Skill/MCP 管理器**——`dseam-skillmcp`（源自 `dsh-skill-mcp-panel`，MIT License），随安装包 / EXE 内置，自动装入 profile，无需单独下载。
- **版本一致**——`dseam-skillmcp`、`dsh-hub` 已内嵌进安装包 / 便携包，每次发版同步更新，无需重复下载。
- **托盘常驻**——关闭后最小化到系统托盘，后台进程继续运行；重复打开只唤起已有窗口。
- **自检自愈**——启动时自动自检（Node / pnpm / profile / 插件 / 配置），自动安装或修复运行环境。

## 五大页面标签

### 标签 · 说明
- **标签**: **插件管理** · **说明**: 导入 hotpack JSON（粘贴或选文件），预览 / 下载，激活 / 停用 / 移除，展示 store 状态。
-