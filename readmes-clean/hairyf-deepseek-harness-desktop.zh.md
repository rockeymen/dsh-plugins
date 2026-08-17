![DeepSeek Harness Desktop](public/favicon.svg)

# DeepSeek Harness 桌面版

  在桌面上一键运行 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) ——
  无需 Node.js、无需 pnpm、无需 Docker，下载即用。

  <samp>[English](./README.md) · 中文</samp>

![预览](docs/preivew.png)

## 功能

- **零环境** — 首次启动自动装配内置 Node 运行时与 Harness 内核；本机已有兼容 Node / Pnpm 时直接复用，不碰你的系统环境。
- **内核自愈** — 每次启动自动同步上游最新 Harness 版本，上游修复无需重新安装，打开即跟上。
- **纯本地 · 隐私默认** — 运行在 `127.0.0.1:3080`，profile / 会话 / 设置全部留在本机，默认关闭遥测。
- **原生轻量** — Tauri 2 外壳（非 Electron）：更小的安装包、更低的内存占用、原生窗口。Windows / macOS / Linux，中英双语界面。
- **命令行集成** — 安装后自动注册 `dsh` 命令（`*/bin`），新开终端即用。

## 快速开始

从 [Releases](https://github.com/hairyf/deepseek-harness-desktop/releases) 下载对应平台安装包，安装后启动即可。

首次运行会下载 Node 运行时与 Harness 内核（合计约几百 MB），随后直接进入 `http://127.0.0.1:3080` 的 Harness 界面；此后完全本地运行，无需联网。

**系统要求：** Windows 10+（64 位）· macOS 10.15+ · Linux（AppImage）· 首次运行需要网络

## 开发与构建

```bash
pnpm install      # 安装依赖
pnpm tauri dev    # 本地开发
pnpm tauri build  # 构建安装包
```

需要 Node.js 20+、Rust 1.77+、pnpm 9+，以及平台编译工具链（MSVC + WebView2 / Xcode CLT / WebKit2GTK）。

## 工作原理

```text
┌──────────────────────────────────────────────┐
│ Tauri WebView (React)                        │
│   安装状态机 → 下载进度 → iframe              │
│   加载 dsh Web 界面 + 侧边栏控制              │
└──────────────────────┬───────────────────────┘
                       │ invoke 命令 + 事件
┌──────────────────────┴───────────────────────┐
│ Tauri Rust 后端                              │
│   service/download  安装器 + 解压             │
│   service/workflow  dsh 进程生命周期          │
│   task              dsh 健康检查              │
└──────┬───────────────────────────┬───────────┘
       │                           │
  runtime/ (Node.js v22.22.0)   dependencies/dsh/ (发行版)
       └─────────────┬─────────────┘
                     ▼
   dsh --profile web --host 127.0.0.1 --port 3080
                     │  DSH_HOME=<app-data>/data/dsh
                     ▼
        http://127.0.0.1:3080/  ← 内嵌界面
```

Harness 发行版由 [deepseek-harness-pkg](https://github.com/hairyf/deepseek-harness-pkg) 构建发布（发布契约见 [docs/PKG-CONTRACT.md](docs/PKG-CONTRACT.md)）。每次启动都会对比最新发行版，本地过期时自动重新下载；GitHub 不可达时保留本地安装。完整架构见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

## 说明

- **开发预览** — 上游 `dsh` 仍在快速迭代，存在破坏性变更；本项目同步跟随。
- **macOS Gatekeeper** — 应用未公证，首次启动需在系统设置 → 隐私与安全性 → 仍要打开 放行一次。
- **安全声明** — `dsh` 具备本地代码执行能力。仅供学习 / 研究 / 测试，请在可信、隔离的环境中使用。

## 相关项目

- [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) — 上游 `dsh` agent 平台
- [deepseek-harness-pkg](https://github.com/hairyf/deepseek-harness-pkg) — 打包好的 Harness 发行版（本应用下载源）
- [dsh-market](https://github.com/dsh-market/dsh-market) — 插件市场，首次启动时作为推荐预装插件提供
- [n8n-desktop](https://github.com/tangtao646/n8n-desktop) — 参考实现