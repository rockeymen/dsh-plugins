![CloudBase AI Toolkit](https://raw.githubusercontent.com/TencentCloudBase/CloudBase-AI-Toolkit/main/mcp/icon.png)

# CloudBase AI Toolkit

**AI 写代码，CloudBase 管后端。**

面向 AI 编程工具的 CloudBase 接入层：用 Plugin 装好工具，用 Skills 约束写法，用 MCP 在对话里操作数据库、云函数、存储与部署。

**简体中文** · [English](./README.md) · [文档][docs] · [更新日志][changelog] · [Issues][github-issues-link]

[![][npm-version-shield]][npm-link]
[![][npm-downloads-shield]][npm-link]
[![][github-stars-shield]][github-stars-link]
[![][github-forks-shield]][github-forks-link]
[![][github-issues-shield]][github-issues-link]
![][github-license-shield]
![][github-contributors-shield]
[![][cnb-shield]][cnb-link]
[![][deepwiki-shield]][deepwiki-link]

## 最近更新

**v2.32.x**（2026-08）

- 小程序：新增 `queryMessagePush` / `manageMessagePush`，支持事件与消息类型订阅（虚拟支付默认事件、声明式幂等、可选 appid）
- 小程序：消息推送支持云函数/云托管模式识别与切换（`ensureContainerMode` / `setContainerCallback`，订阅前校验函数存在）
- 网关：`manageGateway` 在创建自定义域名/路由前校验 HTTP 服务，并支持证书自动选择与更清晰的 DNS 指引
- Skills：补充消息推送/客服参考，并为 miniprogram-development 做分层中文化

**v2.31.x**（2026-08）

- 云托管：`getDeployLog` 遇 CODING 未登录 / 镜像部署无构建时，改写为 `getProcessLog` / `getDeployRecords` 建议，不再暴露原始英文报错

[Releases][changelog] · [Star][github-stars-link] · Watch → Releases

## 它是什么

AI IDE（Cursor、Claude Code、Codex、CodeBuddy 等）擅长生成代码。真正卡住的往往是后端：库表、权限、函数、存储、环境与发布。

[CloudBase](https://docs.cloudbase.net/) 是腾讯云的 AI 原生后端一体化平台（数据库、存储、身份认证、云函数、云托管等）。本仓库提供把这套后端接到 AI 工具里的 Toolkit：

### 组件 · 作用
- **组件**: **Plugin** · **作用**: 一次安装 MCP Server、Agent Skills 与 Hooks，减少按 IDE 分别配置
- **组件**: **Agent Skills** · **作用**: 场景化技能（Web / 小程序 / 数据库 / 认证 / 云函数等），约束可落地的 CloudBase 实践
- **组件**: **MCP** · **作用**: 在对话中登录环境、查改数据、管理函数与托管、读日志排障

本仓库同时发布 npm 包 `@cloudbase/cloudbase-mcp`、Skills 与 AI 插件。

你仍需要：开通自己的云开发环境，并在 IDE 中确认 AI 发起的敏感操作。Toolkit 提供能力与路径，不替代判断。

### 相关仓库

发布与同步仓集中在 [TencentCloudBase](https://github.com/TencentCloudBase) 组织。与本 Toolkit 直接相关的如下：

### 仓库 · 内容 · 常用入口
- **仓库**: [CloudBase-AI-Toolkit](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit)（本仓库） · **内容**: MCP Server 源码；Claude Code / Codex 等原生 marketplace 来源 · **常用入口**: `npx @cloudbase/cloudbase-mcp@latest`
- **仓库**: [cloudbase-plugin](https://github.com/TencentCloudBase/cloudbase-plugin) · **内容**: Open Plugin Spec 发布仓（由本仓库 CI 同步）：MCP + Skills + Hooks · **常用入口**: `npx plugins add TencentCloudBase/cloudbase-plugin`
- **仓库**: [cloudbase-sites-plugin](https://github.com/TencentCloudBase/cloudbase-sites-plugin) · **内容**: Sites 插件：Vite Web 创建与部署 · **常用入口**: `npx plugins add TencentCloudBase/cloudbase-sites-plugin`
- **仓库**: [cloudbase-skills](https://github.com/TencentCloudBase/cloudbase-skills) · **内容**: Agent Skills 合集 · **常用入口**: `npx skills add TencentCloudBase/cloudbase-skills`
- **仓库**: [skills](https://github.com/TencentCloudBase/skills) · **内容**: 可按单个 skill 安装的目录（亦用于 [skills.sh](https://skills.sh)） · **常用入口**: `npx skills add tencentcloudbase/skills --skill <name>`
- **仓库**: [awesome-cloudbase-examples](https://github.com/TencentCloudBase/awesome-cloudbase-examples) · **内容**: 云开发案例与示例集合 · **常用入口**: 浏览 / 克隆示例
- **仓库**: [OpenVibeCoding](https://github.com/TencentCloudBase/OpenVibeCoding) · **内容**: 基于 CloudBase 的 vibecoding 模板 · **常用入口**: 作为项目起点使用

优先用 Plugin 拿齐全套；只需知识约束时可只装 Skills。marketplace 类 IDE 请用本仓库，不要与 `npx plugins add` 对同一工具重复安装。

## 快速开始

### 最快上手（推荐）

复制下面的 AI Prompt，粘贴到你的 AI IDE。Agent 会读取 skill.md 完成接入：

```
帮我把 CloudBase 接好，按下面做：
1. 打开 https://docs.cloudbase.net/skill.md，按说明完成接入。
2. 接入完成后告诉我，并建议最相关的下一步。
```

按你的工具选一条默认路径（Plugin / CLI / MCP）

### 你的工具 · 建议做法
- **你的工具**: Claude Code / Codex（原生 marketplace） · **建议做法**: 添加本仓库为 marketplace，再安装 `cloudbase` 插件（见[插件文档](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ai-agent-plugins)）
- **你的工具**: 支持 Open Plugin Spec 的工具 · **建议做法**: `npx plugins add TencentCloudBase/cloudbase-plugin`
- **你的工具**: 希望 CLI 统一配置多种工具 · **建议做法**: [CloudBase AI CLI](https://docs.cloudbase.net/cli-v1/ai/introduce)：`npm i -g @cloudbase/cli && tcb ai`
- **你的工具**: CodeBuddy / WorkBuddy / ZCode（已内置） · **建议做法**: 使用 IDE 内置的 CloudBase 插件或连接器；CodeBuddy 也可通过[插件市场安装](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codebuddy)
- **你的工具**: 其他支持 MCP 的 IDE · **建议做法**: 仅配置 MCP（见下方）

#### Plugin

```bash
npx plugins add TencentCloudBase/cloudbase-plugin
```

说明与各 IDE 差异见 [AI 插件文档](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ai-agent-plugins)。

#### 仅配置 MCP

```json
{
  "mcpServers": {
    "cloudbase": {
      "command": "npx",
      "args": ["@cloudbase/cloudbase-mcp@latest"]
    }
  }
}
```

托管 HTTP、自建 Cloud Mode、按插件裁剪工具集见 [安装与连接](#安装与连接)。

### 首次对话

```
登录云开发
```

```
使用 CloudBase Skills 开发一个带登录的待办应用，包含数据库与权限，并部署
```

Skills 负责写法与结构；MCP 负责环境与资源操作。完成后应能在自己的环境中验证数据与接口，而不只是得到一段本地代码。

### 支持的 AI IDE

![](https://raw.githubusercontent.com/TencentCloudBase/CloudBase-AI-Toolkit/main/scripts/assets/ide-support-grid.png)

### 工具 · 平台 · 指引
- **工具**: [CloudBase AI CLI](https://docs.cloudbase.net/cli-v1/ai/introduce) · **平台**: CLI · **指引**: [指引](https://docs.cloudbase.net/cli-v1/ai/introduce)
- **工具**: [OpenClaw](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/openclaw) · **平台**: CLI · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/openclaw)
- **工具**: [WorkBuddy](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/workbuddy) · **平台**: 独立 IDE · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/workbuddy)
- **工具**: [ZCode](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/zcode) · **平台**: 独立 IDE（≥ 3.4.1 内置插件） · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/zcode)
- **工具**: [Codex App](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codex) · **平台**: 独立应用 · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codex)
- **工具**: [Cursor](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/cursor) · **平台**: 独立 IDE · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/cursor)
- **工具**: [WindSurf](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/windsurf) · **平台**: 独立 IDE / 插件 · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/windsurf)
- **工具**: [CodeBuddy](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codebuddy) · **平台**: 独立 IDE（已内置） · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codebuddy)
- **工具**: [CLINE](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/cline) · **平台**: VS Code 插件 · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/cline)
- **工具**: [GitHub Copilot](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/github-copilot) · **平台**: VS Code 插件 · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/github-copilot)
- **工具**: [Trae](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/trae) · **平台**: 独立 IDE · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/trae)
- **工具**: [通义灵码](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/tongyi-lingma) · **平台**: IDE / 插件 · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/tongyi-lingma)
- **工具**: [RooCode](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/roocode) · **平台**: VS Code 插件 · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/roocode)
- **工具**: [文心快码](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/baidu-comate) · **平台**: 插件 · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/baidu-comate)
- **工具**: [Augment Code](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/augment-code) · **平台**: 插件 · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/augment-code)
- **工具**: [Claude Code](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/claude-code) · **平台**: CLI · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/claude-code)
- **工具**: [Gemini CLI](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/gemini-cli) · **平台**: CLI · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/gemini-cli)
- **工具**: [Codex CLI](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/openai-codex-cli) · **平台**: CLI · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/openai-codex-cli)
- **工具**: [OpenCode](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/opencode) · **平台**: CLI · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/opencode)
- **工具**: [Qwen Code](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/qwen-code) · **平台**: CLI · **指引**: [指引](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/qwen-code)

完整配置见 [IDE 配置指南](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/)。

## 能力

接入后，AI 可以在你的环境中完成典型后端工作（需你确认关键步骤）：

- **数据库**：PostgreSQL 与文档型库、数据模型、CRUD、权限与安全规则
- **计算**：云函数与云托管的编写、部署、调用与日志
- **身份与存储**：登录方式、对象存储、与业务数据的权限联动
- **发布与排障**：静态托管 / 小程序发布；根据日志定位问题并再部署

适用形态包括 Web、微信小程序与后端服务。平台能力总览见 [CloudBase 文档](https://docs.cloudbase.net/)。

### 评测说明

在受控条件下，以同一待办（Todo）应用需求与同一前端脚手架为输入，比较两类后端实现路径：传统云主机（自行搭建运行时、进程与网络暴露）与 CloudBase（托管数据库、匿名登录等后端能力）。评测由 AI Agent 端到端完成开发与验证；在给定模型与任务设定下，CloudBase 路径在完成时延、Token 用量与工具调用次数上更优。上述结果受模型、Agent 框架与任务定义约束，不宜外推为一般性结论。

方法、数据与边界条件见：[传统云主机与 CloudBase 同任务评测报告](https://docs.cloudbase.net/solutions/vibe-coding-platform/vm-vs-cloudbase-comparison)

## 安装与连接

### 前置条件

- Node.js v18.15.0+
- 已开通 [云开发环境](https://tcb.cloud.tencent.com/dev)
- 已安装支持 Plugin / Skills / MCP 的 AI 工具

### 配置方式

1. **Plugin**（推荐，能装插件时）  
   `npx plugins add TencentCloudBase/cloudbase-plugin`
2. **CloudBase AI CLI**  
   `npm i -g @cloudbase/cli && tcb ai`
3. **手动 MCP**（按 IDE 写入配置文件）

Cursor（.cursor/mcp.json）

```json
{
  "mcpServers": {
    "cloudbase": {
      "command": "npx",
      "args": ["@cloudbase/cloudbase-mcp@latest"]
    }
  }
}
```

WindSurf（.windsurf/settings.json）

```json
{
  "mcpServers": {
    "cloudbase": {
      "command": "npx",
      "args": ["@cloudbase/cloudbase-mcp@latest"]
    }
  }
}
```

CodeBuddy

已内置 CloudBase（含 MCP / Skills），一般无需再手写配置。

也可通过插件市场安装：见 [CodeBuddy 配置指南](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codebuddy)。

其他 IDE：[完整配置指南](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/)。

### MCP 连接模式

**本地模式**（默认）：本机 `npx` 启动，功能最全（含依赖本地文件系统的上传、模板等）。

**托管模式**：IDE 通过 HTTP 连接腾讯云上的 MCP，无需本机 Node；部分本地文件能力不可用。

```json
{
  "mcpServers": {
    "cloudbase": {
      "type": "http",
      "url": "https://tcb-api.cloud.tencent.com/mcp/v1?env_id=<env_id>",
      "headers": {
        "X-TencentCloud-SecretId": "<腾讯云 Secret ID>",
        "X-TencentCloud-SecretKey": "<腾讯云 Secret Key>"
      }
    }
  }
}
```

托管 URL 可用 `site`（`domestic` / `intl`）指定登录站点（国内站新加坡需 `site=domestic`），也可用 `enable_plugins` / `disable_plugins` 裁剪工具集。名称以 `mcp/src/server.ts` 为准。

**自建 Cloud Mode**：在自有服务器部署时设置 `CLOUDBASE_MCP_CLOUD_MODE=true`（或 `MCP_CLOUD_MODE=true`），禁用本地文件与本地进程类工具，避免远程调用方操作宿主机。

### 场景 · 建议
- **场景**: 个人开发 · **建议**: 本地 `npx`
- **场景**: 团队 / 免运维 · **建议**: 腾讯云托管 HTTP
- **场景**: 自建 MCP 服务 · **建议**: 必须开启 Cloud Mode

## 案例

**双人在线五子棋**：需求描述后生成 Web + 云数据库与实时能力并部署。  
体验：[五子棋](https://cloud1-5g39elugeec5ba0f-1300855855.tcloudbaseapp.com/gobang/#/) · 更多：[教程与案例](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/tutorials)

## 文档

- [MCP 工具说明](doc/mcp-tools.md)（[tools.json](scripts/tools.json)）
- [快速开始](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/getting-started)
- [IDE 配置](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/)
- [AI 插件](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ai-agent-plugins)
- [模板](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/templates)
- [FAQ](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/faq)

## 常见问题

和 Vercel / Netlify 这类部署平台有何不同？

它们侧重把前端或容器发布出去。CloudBase 提供数据库、认证、函数等后端能力；Toolkit 让 AI 工具在对话里使用这些能力。部署只是链路的一部分。

没有图形界面 IDE 也能用吗？

可以。凡能配置 MCP Server 或安装对应 Plugin / Skills 的工具均可，包括 Claude Code、Gemini CLI、OpenCode 等。[支持列表](#支持的-ai-ide)

代码会到哪里？

部署目标是你自己的云开发环境。本地模式下 MCP 跑在本机；主动部署前代码不必离开本机。云端通信使用 HTTPS。

自建 MCP 服务是否安全？

本地 `npx` 等同于你在本机执行工具。远程部署务必设置 `CLOUDBASE_MCP_CLOUD_MODE=true`，以禁用本地文件与进程类工具。腾讯云托管 HTTP 模式已带该保护。

费用？

Toolkit（含 MCP）开源，MIT。云开发环境有免费额度；超出后按量计费，见 [计费说明](https://cloud.tencent.com/document/product/876/39095)。

登录提示环境不存在？

确认已在 [控制台](https://tcb.cloud.tencent.com/) 开通且环境状态正常，然后再次「登录云开发」选择正确环境。

## 社区

![微信群二维码](https://7463-tcb-advanced-a656fc-1257967285.tcb.qcloud.la/mcp/toolkit-qrcode.png)

<sub>微信技术交流群</sub>

###  · 
- 文档 · [docs.cloudbase.net](https://docs.cloudbase.net/)
- Issues · [GitHub Issues](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/issues)
- Releases · [更新日志][changelog]

## 项目活跃度

![Repo Activity](https://repobeats.axiom.co/api/embed/6cd6ed00da4384e43b24805c197f584626946dda.svg "Repobeats analytics image")