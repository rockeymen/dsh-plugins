#iPolloWork

  英文 · [简体中文](./translated_readmes/README_ZH.md) · [繁体中文](./translated_readmes/README_ZH_hk.md) · [日本语](./translated_readmes/README_JA.md)

**本地优先的视觉 AI 工作台，可将一个目标转化为可编辑的代码、文档、演示文稿、网站、设计和视频 - Codex 和 Claude Code 的开放替代方案。**

https://github.com/user-attachments/assets/201b561a-22ec-4c8e-a4e8-f34172cf0aa3

iPolloWork 为代理提供了一个存储库、本地文件、浏览器任务、文档、演示文稿、网站、设计和视频的工作空间。描述结果；代理人计划并执行；您检查工作、批准操作并在同一位置继续编辑结果。

Codex 风格的编码只是起点。当输出是幻灯片、网页、视觉设计或视频时，iPolloWork 会保持其可编辑性，而不是向您提供完成的文件或聊天记录。

## 是什么让它与众不同

- **代理优先执行** — 计划工作、使用工具、读取和修改文件、运行命令并从当前状态继续。
- **可编辑结果** — 从代码转移到文档、网站、演示文稿、设计和视频；生成后不断更改文本、图像、布局和场景。
- **本地控制** — 在您的计算机上运行，​​带上您自己的模型或提供程序，批准权限，并通过技能、插件、MCP 服务器和浏览器自动化扩展工作区。
- **两个代理生态系统，一个工作流程** - 原生[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)子代理协作正在积极开发中，旨在让iPolloWork将重点工作委托给DSH，同时双方保留自己的技能和插件。

## DeepSeek Harness 分代理合作

iPolloWork 正在集成 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 作为可选的子代理运行时。该集成正在积极开发中，尚未包含在最新的稳定版本中。

协作模型将 iPolloWork 作为主要工作区：任务可以在有用时将有限的工作委托给 DSH 子代理，然后将结构化结果带回到同一任务中。 iPolloWork 和 DSH 保留了自己的技能和插件生态系统，因此用户可以从两者中受益，而无需更换任何一个运行时。

## 安装iPolloWork

### 下载桌面应用程序

官方安装程序发布在[GitHub Releases](https://github.com/Devin-AXIS/iPolloWork/releases)。如果您更喜欢手动下载，请选择与您的操作系统和 CPU 匹配的文件：

### 系统·CPU·使用的安装程序
- **系统**：macOS · **CPU**：Apple Silicon（M 系列）· **要使用的安装程序**：`ipollowork-mac-arm64-<version>.dmg`
- **系统**：macOS · **CPU**：Intel · **要使用的安装程序**：`ipollowork-mac-x64-<version>.dmg`
- **系统**：Windows · **CPU**：Intel/AMD 64 位 · **要使用的安装程序**：`ipollowork-win-x64-<version>.exe`
- **系统**：Windows · **CPU**：ARM64 · **要使用的安装程序**：`ipollowork-win-arm64-<version>.exe`
- **系统**：Linux · **CPU**：Intel/AMD 64 位 · **要使用的安装程序**：`ipollowork-linux-x64-<version>.AppImage`
- **系统**：Linux · **CPU**：ARM64 · **要使用的安装程序**：`ipollowork-linux-arm64-<version>.AppImage`

macOS `.zip` 和 Linux `.tar.gz` 文件是可移植/更新工件；大多数用户应该选择`.dmg`、`.exe`或`.AppImage`。如果“发布”页面尚未包含适用于您的系统的安装程序，请从下面的源代码运行或打包应用程序。

下载后安装：

- **macOS：**打开`.dmg`，然后将**iPolloWork**拖到应用程序中。
- **Windows：** 运行 `.exe` 安装程序。本地构建的未签名安装程序可能会触发 Microsoft Defender SmartScreen。
- **Linux：** 使用 `chmod +x ipollowork-*.AppImage` 使 AppImage 可执行，然后运行它。 `.tar.gz`包无需安装即可解压运行。

### 源码开发和打包的要求

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download) 22 或更高版本
- pnpm 11，通过带有 `corepack enable` 的 Corepack 启用
- [Bun](https://bun.sh/docs/installation) 1.3.10 或更高版本，用于构建本地 Orchestrator sidecar
- macOS：Xcode 命令行工具 (`xcode-select --install`)
- Windows：[Visual Studio 2022 构建工具](https://visualstudio.microsoft.com/visual-cpp-build-tools/)，带有**使用 C++ 进行桌面开发**和 Windows SDK；使用 PowerShell 或命令提示符
- Linux：标准 Electron 构建环境，带有 C/C++ 工具链、Python 3、`pkg-config` 以及 Electron 所需的桌面库；发布版本使用 Ubuntu 22.04

在第一个桌面构建过程中，OpenCode 将被下载并准备为单独的 sidecar。 iPolloWork不会fork或重写OpenCode，OpenCode可以继续独立升级。

## 从源头开始

### macOS 和 Linux

```bash
git clone https://github.com/Devin-AXIS/iPolloWork.git
cd iPolloWork
corepack enable
./ipollowork setup
./ipollowork dev
```

### Windows PowerShell

```powershell
git clone https://github.com/Devin-AXIS/iPolloWork.git
Set-Location iPolloWork
corepack enable
.\ipollowork.cmd setup
.\ipollowork.cmd dev
```

setup 命令安装锁定的工作区依赖项。 dev 命令准备 OpenCode 和 Orchestrator sidecar，启动 UI，并打开 Electron 桌面客户端。开发模式使用隔离的iPolloWork/OpenCode状态，不会覆盖用户正常的OpenCode配置。

### 开发命令

### 目的 · macOS / Linux · Windows
- **用途**：启动桌面应用程序 · **macOS / Linux**：`./ipollowork dev` · **Windows**：`.\ipollowork.cmd dev`
- **用途**：仅启动浏览器 UI · **macOS / Linux**：`./ipollowork dev:ui` · **Windows**：`.\ipollowork.cmd dev:ui`
- **用途**：连接本地云 · **macOS / Linux**：`./ipollowork dev:cloud http://localhost:3100` · **Windows**：`.\ipollowork.cmd dev:cloud http://localhost:3100`
- **目的**：类型检查和桌面测试 · **macOS / Linux**：`./ipollowork check` · **Windows**：`.\ipollowork.cmd check`
- **用途**：生产版本 · **macOS / Linux**：`./ipollowork build` · **Windows**：`.\ipollowork.cmd build`

Windows 开发版本不注册生产 `ipollowork://`
自动处理程序。通过外部浏览器测试云登录时，
使用存储库的协议切换器并在以下情况下恢复生产处理程序
你完成了。参见【Windows协议切换](docs/windows-protocol-switcher.md)。

## 构建并打包

共有三种不同的构建级别：

### 命令·结果
- **命令**：`build` · **结果**：编译生产 UI、服务器、Electron shell 和 sidecar；不创建安装程序
- **命令**：`package:dir` · **结果**：创建用于本地验证的最快解压桌面应用程序；不改变发布版本
- **命令**：`package` · **结果**：运行检查，推进客户端版本，然后为当前系统和 CPU 创建本机安装程序和可移植/更新工件，而不发布它们

### macOS 和 Linux

```bash
./ipollowork check
./ipollowork package:dir
./ipollowork package
```

### Windows PowerShell

```powershell
.\ipollowork.cmd check
.\ipollowork.cmd package:dir
.\ipollowork.cmd package
```

所有输出均写入 `apps/desktop/dist-electron/`：

`package` 为本地释放命令。它使应用程序、桌面、Orchestrator 和服务器版本保持同步，并使用序列 `0.1.0` 到 `0.99.0`，然后是 `1.0.0`（源签出从未发货的基线 `0.0.0` 开始）。使用 `./ipollowork package --dry-run` 检查下一个版本，或仅在检查已通过时使用 `--skip-check`。本地打包从不提交、标记、推送或发布版本。

- **macOS：** `.dmg`、`.zip` 和未包装的 `.app`
- **Windows：** NSIS `.exe` 和 `win-unpacked/`
- **Linux：** `.AppImage`、`.tar.gz` 和 `linux-unpacked/`

本地打包针对机器当前的操作系统和CPU架构。使用 GitHub 发布工作流程为 macOS ARM64/x64、Windows ARM64/x64 和 Linux ARM64/x64 生成完整的签名/公证矩阵。除非提供适当的 Apple 或 Windows 签名凭据，否则本地包不会被签名；它们适合开发测试，但不应作为正式版本提供。

## 连接到 iPolloCloud

首先启动本地 iPolloCloud 控制平面，然后运行：

```bash
./ipollowork dev:cloud http://localhost:3100
```

此命令创建一个独立的开发配置文件，将身份验证和云 API 指向提供的 URL，并需要云登录。它不会更改正常的本地 iPolloWork 配置文件。远程或自托管云 URL 的工作方式相同：

```bash
./ipollowork dev:cloud https://cloud.example.com
```

## 架构边界

```text
iPolloWork desktop/UI ── local API ──> iPolloWork server ──> OpenCode
          │
          └── optional account/control requests ──> iPolloCloud
```

- 代理执行和流媒体保持在