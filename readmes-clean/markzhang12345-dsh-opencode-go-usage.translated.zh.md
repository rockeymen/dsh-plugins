#dsh-opencode-go-usage

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 插件，将您的 **OpenCode Go** 编码计划使用情况显示为聊天编辑器坞中的实时、仅数字读数 - `OpenCode Go  5h 39%  Weekly 15%  Monthly 13%` - 每 60 秒刷新一次。它自动启用**每个会话**：每个会话的小部件仅在该会话的模型提供程序为 `opencode-go` 时呈现，否则隐藏。

## 特点

- 聊天编辑器码头带 (`conversation.composer.dock`) 中的实时读数：5 小时滚动/每周/每月百分比，悬停时重置时间
- 每 60 秒刷新一次
- 自动启用**每个会话**：每个聊天会话的小部件仅在该会话的模型提供程序为 `opencode-go` 时显示（在并发会话之间独立）
- 没有进度条，只有简单的数字

## 安装

在您的 `dsh` 个人资料中（此处为 `web`）：

```sh
dsh plugin --profile web add
```

将插件行添加到您的配置文件的补丁层 (`$DSH_HOME/profiles/web/cordis.patch.yml`)：

```yaml
- insert:
    - id: opencode-go-usage
      name: 'dsh-opencode-go-usage'
```

重新启动 `dsh web`，以便拾取主机部分和所服务的客户端包。

## 配置

主机端可调参数位于 `cordis.yml` 的插件行中：

```yaml
- id: opencode-go-usage
  name: dsh-opencode-go-usage
  config:
    baseUrl: https://opencode.ai/zen/go/v1/usage   # default
    timeoutMs: 15000                                # default
```

### 键·默认·含义
- **密钥**：`baseUrl` · **默认**：`https://opencode.ai/zen/go/v1/usage` · **含义**：使用端点。
- **按键**：`timeoutMs` · **默认**：`15000` · **含义**：获取超时（以毫秒为单位）。

## 使用端点

```http
GET https://opencode.ai/zen/go/v1/usage
Authorization: Bearer <API_KEY>
```

`<API_KEY>` 是 Anthropic 兼容的 OpenCode Go 密钥 (`sk-opencode-…`)。端点返回：

```json
{
  "usage": {
    "rolling": { "status": "ok", "percent": 39, "resetsAt": "2026-08-17T12:30:33.430Z" },
    "weekly":  { "status": "ok", "percent": 15, "resetsAt": "2026-08-24T00:00:00.430Z" },
    "monthly": { "status": "ok", "percent": 13, "resetsAt": "2026-09-01T04:14:25.430Z" }
  }
}
```

`percent`为0~100； `resetsAt` 是 ISO-8601。该端点尚未出现在 OpenCode 的公共文档中。

## API 密钥解析顺序

1. DSH 凭证接缝/环境 `OPENCODE_GO_API_KEY` — 也是模型页面填写的内容 (`deriveKeyRef("opencode-go")`)，因此在设置 → 模型下添加 opencode-go 时无需额外设置。
2. OpenCode `~/.local/share/opencode/auth.json` → `opencode-go` 条目（后备 `opencode`）和 `type: "api"`。

## 它是如何工作的

双面插件。主机部分发布 `opencodeUsage` Typert Remote 服务（它仅解析密钥并获取与会话无关的使用数据）；客户端捆绑包安装它并通过 `/api` RPC 载体呈现底座读数。每个会话的可见性由客户端决定：每个停靠小部件读取其自己的会话的模型目录 (`ctx.modelDirectories`) 并隐藏，除非该会话的提供程序是 `opencode-go`。

### 文件·角色
- **文件**：`index.js` · **角色**：主机一半 — `OpencodeUsageGateway`（`TypertRemoteService`，服务密钥 `opencodeUsage`）
- **文件**：`typert.host.js` · **角色**：手写的Typert主机清单，通过`exports["./typert"]`注册
- **文件**：`client.js` · **角色**：`window.__ModuleLoader__.load` 格式的浏览器捆绑包 — 安装遥控器、注册扩展坞条目、呈现读数

## 发展

该插件是普通的 ESM，没有构建步骤。主机文件导入`@deepseek-ai/*`同行；客户端包是以惰性 CJS 格式手写的，harness 客户端加载程序在 `/plugins` 下提供服务。

## 已知限制

- 使用端点没有记录并且可能会改变；解析是防御性的，非 200 响应表现为友好状态而不是崩溃。
- 配额限制/重置时间来自响应；端点漂移得到妥善处理。
- 当当前提供程序不是 `opencode-go`（无占位符行）时，停靠小部件将完全隐藏。