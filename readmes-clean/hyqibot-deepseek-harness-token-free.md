![DeepSeek Harness 桌面端](assets/desktop-hero-zh.jpg)

### 为 DeepSeek Harness (DSH) 生态打造的全免 Token 费桌面端

### 立即下载 macOS / Windows

> **公开仓说明**：桌面安装包与更新见 [Releases](https://github.com/hyqibot/DeepSeek-Harness-Token-Free/releases)。**要使用免 Token（Zero-Token）功能，必须安装 Releases 里的桌面版**（内含预编译网关）；公开源码无法自行构建完整 Zero-Token 网关。

## 主要功能

  
    
      ### Desktop
      把官方 DeepSeek Harness 的本地 Web UI 带到原生桌面。应用自动启动和管理本地 Harness 服务，集成系统托盘与桌面窗口，无需安装 Node.js 或执行命令。
    
    
      ### 手机远程控制
      Telegram、Discord、飞书、微信与局域网 PWA 共用一套配对码。用手机 Bot 或把 PWA 添加到主屏幕，即可向本机 Agent 发任务。Web UI 仍锁在 127.0.0.1。
    
  
  
    
      ### 插件市场
      托盘 Marketplace 按官方 `dsh plugin add` 安装目录插件，不预装未审计的 dshmarket。服务管理、系统集成与市场都是 Cordis Host 行，可随 profile 组合。
    
    
      ### Channels
      IM 通道在 Host 进程内配对后即可遥控 Agent。Zero Token 网关也在同一进程监听 localhost：官方 API key 免激活码；可选的Zero Token可实现免Token费使用，需激活码授权。
    
  

## 插件生态

DeepSeek Harness 基于 [Cordis](https://github.com/cordiverse/cordis) 构建，并采用“一切皆插件”的架构。模型适配器、工具注册表、会话日志和 Agent Loop 等核心能力都以插件参与运行，可以通过配置自由组合或替换；外部插件也可以通过 profile 与 bundle 接入现有运行时。详见官方的[架构说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)和[插件管理文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md#plugin-management)。

Desktop 已经按官方 Cordis 插件机制组织：窗口与托盘（`desktop-shell`）、服务与 pnpm（`desktop-pnpm` / `desktop-profiles`）、系统集成（`desktop-terminal` / `desktop-updates`）、IM 遥控（`desktop-channels`）、局域网手机壳（`desktop-mobile`）、Zero Token 网关（`desktop-zero-token`）和插件市场（`desktop-marketplace`）都作为 Host 行挂进 profile，可用 `dsh plugin add` 同样的组合方式接入。

## 声明

本项目基于 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 构建。

本项目基于 DeepSeek Harness 和 Cordis 插件思想的实现，旨在为大家构建快速上手的 DeepSeek Harness 桌面体验， 同时提供可选的免token费接入各大模型， 降低ai应用的使用门槛。

## 社区交流

可选择常用的平台参与讨论，交流使用问题、插件开发和项目进展。

  
    
      微信群
      钉钉群
    
  
  
    
      ![DeepSeek-Harness-Token-Free 微信群二维码](assets/community-wechat-group.png)
      ![DeepSeek-Harness-Token-Free 钉钉群二维码](assets/community-qq-group.jpg)
    
  

## 从源码运行

公开仓可用于本地体验 **桌面端**（`yarn dev`）与 **官方 / API Key 模型**。

> **限制**：本仓库不含 Zero-Token 网关完整源码与预编译 sidecar，**无法**通过源码本地使用网页免 Token；请安装 [Releases](https://github.com/hyqibot/DeepSeek-Harness-Token-Free/releases) 桌面版。

**环境要求**

- Node.js 22.19+ 或 24+（含 Corepack）
- [Git](https://git-scm.com/download/win)（Windows 必装）

**1. 克隆与安装**

```bash
git clone --recurse-submodules https://github.com/hyqibot/DeepSeek-Harness-Token-Free.git
cd DeepSeek-Harness-Token-Free
corepack enable
yarn install
```

**2. 启动桌面端**

```bash
yarn dev
```

在设置中配置官方 API Key 后即可聊天。网页 Zero-Token（无官方 Key）**仅 Releases 安装包可用**。

**说明**

- 公开仓 **不含** `dsh-plugin-desktop/vendor/copaw-zero-token/python/`，本地 `yarn dist:win` / `yarn dist:mac` **不能**产出含完整 Zero-Token 网关的安装包。