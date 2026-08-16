# DSH 盒子

**托管 DeepSeek Harness 桌面运行时** — 在您自己的计算机上运行、隔离和扩展多个 DeepSeek Harness 环境，无需浏览器选项卡。

DSH Box 是一个使用 [Tauri 2](https://tauri.app) 构建的轻量级桌面 shell，可安装、启动和管理独立的 DSH **容器** — 每个容器都有自己的 DSH 版本、配置文件、插件、技能、工作区和日志 — 并将它们呈现在嵌入式 WebView 中。

![](https://github.com/user-attachments/assets/26a17954-b864-43f4-ba19-36f85db738ae)

## 亮点

- **独立的 DSH 容器** — 并排安装多个 DSH 版本并为每个项目创建独立的容器。每个容器都有自己的配置文件（`web` / `headless` /自定义）、工作区、插件集和主机进程，因此实验永远不会交叉污染。
- **嵌入式 WebView，无需浏览器** — DSH 前端在由 DSH Box 管理的本机 WebView 窗口中打开。没有端口转发，没有复制粘贴 URL，没有选项卡混乱。
- **零依赖安装** - 每个版本都捆绑了一个私有 Node、npm 和 pnpm 运行时。没有系统节点，没有手动工具链设置，没有路径黑客。
- **内置版本管理器** — 从 `deepseek-ai/deepseek-harness` 浏览 DSH 版本，一键安装或卸载任何标签，并为每个容器固定一个版本。
- **扩展和技能存储库** — 从 GitHub URL、本地目录或 tarball 导入插件和技能，然后只需单击一下即可将它们安装到任何容器的配置文件中。技能会自动分类到容器的技能根中。
- **捆绑（整合包）工作流程** — 将插件和技能的任意组合分组到命名捆绑中，然后以两种方式导出：
  - **快速导出**：GitHub 来源的条目保留为 URL，从而保持存档很小。
  - **完全导出**：所有内容都打包到一台便携式 `.tar.gz` 中。
  - 捆绑包可以重新导入（在名称冲突时选择*覆盖*或*保留*）并安装到任何容器中 - 插件会出现在配置文件中，技能会自动排序。
- **智能后台任务** — 每个长时间操作（安装、启动、重建、导入、导出）都作为可见的排队任务运行，具有实时滚动日志、取消/重试/删除和历史分页。没有什么感觉就像“冻结了”。
- **网络友好** — GitHub 克隆的自动代理检测、可配置的 GitHub 镜像以及用于 DSH 内部安装的 npm 注册表镜像。
- **后台服务和托盘** — 一个小型 `dshboxd` 边车让一切保持整洁，系统托盘图标让您无需保持主窗口打开即可控制它。
- **轻量级设计** — 基于 Tauri，因此安装程序很小，并且内存占用量远低于 Electron 替代品。
- **双语用户界面** — 英语和简体中文，可在“设置”中切换。

＃＃ 安装

从此存储库的 **Releases** 页面下载适合您平台的安装程序：

### 平台·神器·笔记
- **平台**：Windows (x64) · **工件**：`dshbox-<version>-x64-setup.exe` · **注释**：NSIS 安装程序、每用户和每机器模式
- **平台**：Linux (x64) · **工件**：`dshbox-<version>-amd64.deb` · **注释**：Debian/Ubuntu 软件包
- **平台**：macOS (arm64) · **神器**：`dshbox-<version>-arm64.dmg` · **注释**：Apple Silicon

> 从 [发布页面](https://github.com/Nexus-Aethra/DSHBox/releases)] 获取最新版本 - 工件名称遵循 `-<version>-<arch>` 约定，并且每个版本可能有所不同。其他格式（`.msi`、`.rpm`、`.AppImage`）根据支持的版本生成。

没有运行时先决条件 - 捆绑的 Node/npm/pnpm 运行时在安装程序内运行。

## 快速开始

1. **启动 DSH Box** 并在出现提示时选择一个可写的*运行时目录*（所有 DSH 数据都位于此处）。
2、打开**DSH版本**→**加载版本**→安装你想要的DSH标签。
3. 打开**DSH 容器** → 创建容器（名称、配置文件、DSH 版本）。
4. 按 **开始** — DSH Box 根据需要构建前端（或直接启动缓存的构建），然后在嵌入式 WebView 中打开 DSH UI。
5. 前往**插件存储库**导入插件/技能或组装捆绑包，然后将它们添加到任何容器中。

### 托盘

该应用程序在关闭时最小化到系统托盘。使用托盘菜单打开窗口或启动/停止/重新启动`dshboxd`后台服务。

## 技术

### 层·堆栈
- **层**：桌面外壳 · **堆栈**：Tauri 2、Rust（`src-tauri/` 下的 Cargo 工作区）
- **层**：UI · **堆栈**：React 18、TypeScript、Vite
- **层**：后台服务 · **堆栈**：`dshboxd` sidecar
- **层**：捆绑运行时 · **堆栈**：Node / npm / pnpm（每个平台存档）
- **层**：目标 · **堆栈**：Windows x64/arm64、Linux x64/arm64、macOS x64/arm64

Rust 代码库被组织为集中包（`box-foundation`、`box-scheduler`、`box-runtime`、`box-toolchains`、`box-dsh-versions`、`box-containers`、`box-extensions`、`box-state`、`box-server-core`）的工作区，具有薄桌面适配器层 - 任务调度、扩展传输和容器生命周期逻辑是无框架的并经过单元测试。

## 从源代码构建

先决条件：[Node.js](https://nodejs.org) 20+ 和 pnpm，以及适合您平台的 [Tauri 2 先决条件](https://v2.tauri.app/start/prerequisites/)。

```bash
pnpm install
pnpm runtime:prepare    # fetch the bundled Node/pnpm runtime manifest
pnpm server:prepare     # build the dshboxd sidecar
pnpm tauri dev          # run in development
```

发布捆绑包（每个平台）：

```bash
pnpm bundle:windows     # Windows NSIS installer
pnpm bundle:linux       # Linux .deb
pnpm bundle:macos       # macOS .dmg
```

运行测试套件：

```bash
cd src-tauri && cargo test --workspace
```

## 存储库布局

```
src/                       React/TypeScript management UI
src-tauri/                 Rust workspace + Tauri shell
  crates/                  focused, framework-free crates
  src/desktop/app/         domain modules (containers, extensions, tasks, …)
docs/HANDOFF.md            architecture & operation notes
```