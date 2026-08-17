![local-shell-mcp 标志](docs/assets/logo.svg)

#local-shell-mcp

**支持 ChatGPT 的 MCP 控制平面，用于 shell、文件、浏览器自动化、文件链接和远程计算机。**

[文档](https://fwerkor.github.io/local-shell-mcp/) · [快速入门](https://fwerkor.github.io/local-shell-mcp/getting-started/quickstart/) · [运行时选择](https://fwerkor.github.io/local-shell-mcp/guides/deployment/) · [ChatGPT 连接器](https://fwerkor.github.io/local-shell-mcp/getting-started/chatgpt-connector/) · [DSH 插件](https://fwerkor.github.io/local-shell-mcp/clients/deepseek-harness/) · [工具](https://fwerkor.github.io/local-shell-mcp/reference/tools/) · [发布](https://github.com/fwerkor/local-shell-mcp/releases)]

`local-shell-mcp` 为 ChatGPT 开发者模式和其他 MCP 客户端提供对真实执行环境的受控访问。它公开了一个专用工作区，其中包含 shell、持久 shell、文件系统、搜索、补丁、Playwright、审计、带有可选目标计划的持久逻辑会话、公共文件链接和出站远程工作人员访问。 Git 是通过普通的 shell 命令而不是并行包装器 API 来处理的。

```text
Runtime: Docker / VS Code extension / binary / Python / stdio
  -> exposure: localhost, HTTPS proxy/tunnel, or stdio pipe
  -> client: ChatGPT or another MCP client
  -> controlled workspace at /workspace or configured root
  -> optional remote workers connected over outbound HTTP(S)
```

预期的安全边界是容器或虚拟机，而不是主机。

## 为什么使用它

### 能力 · 它能实现什么
- **功能**：真实终端访问 · **它支持什么**：运行测试、构建项目、检查日志以及使用持久 shell 会话进行调试。
- **功能**：工作区感知文件工具 · **它的功能**：在受控根目录下读取、写入、修补、搜索和查看文件。
- **功能**：Git 工作流程支持 · **它支持什么**：通过 shell 工具运行标准 Git CLI，无需第二个、不完整的 Git 抽象。
- **功能**：浏览器自动化 · **它的功能**：提取页面文本、捕获 PNG/PDF 证据或运行完整的 Playwright 脚本。
- **功能**：远程工作人员 · **它的功能**：控制只能向外连接的 NAT、防火墙、HPC、NPU 或实验室机器。
- **功能**：代理技能 · **它支持什么**：通过三个固定工具发现、加载和读取可重用的 `SKILL.md` 工作流程，而无需更改 MCP 工具列表。
- **功能**：ChatGPT 连接器支持 · **它支持什么**：OAuth 2.1、`/mcp`、发现控件和 ChatGPT 兼容工具架构。
- **功能**：DeepSeek Harness 插件 · **它的功能**：将此存储库安装为 DSH 捆绑包，并公开完整的 LSM 工具表面，包括远程工作人员。
- **功能**：ChatGPT 实时工作区 · **它支持什么**：在 ChatGPT 内渲染本机 MCP 应用程序，用于实时活动、终端、文件、差异、作业、远程、审计和直接人员/代理协作。
- **功能**：更安全的操作 · **它支持什么**：工作区范围、shell 超时、输出限制、环境过滤、审核日志和秘密扫描。

## 快速开始

当您需要主机运行时时，安装官方启动器或 Python 包：

```bash
npx local-shell-mcp --help
pipx install local-shell-mcp
lsm --help
```

npm 和 Python 发行版都公开了 `local-shell-mcp`；安装的软件包还将 `lsm` 作为短命令公开。 npm 发行版只是匹配的独立版本二进制文件的经过验证的启动器，而不是第二个服务器实现。

克隆存储库并准备配置：

```bash
git clone https://github.com/fwerkor/local-shell-mcp.git
cd local-shell-mcp
cp .env.example .env
```

在 `.env` 中至少设置以下值：

```env
LOCAL_SHELL_MCP_PUBLIC_BASE_URL=https://your-public-host.example.com
LOCAL_SHELL_MCP_AUTH_MODE=oauth
LOCAL_SHELL_MCP_OAUTH_ADMIN_PIN=change-me-long-random-pin
LOCAL_SHELL_MCP_OAUTH_JWT_SECRET=change-me-64-hex-random-secret
CLOUDFLARE_TUNNEL_TOKEN=
```

启动服务器：

```bash
mkdir -p workspaces/default
docker compose up -d
curl -i http://127.0.0.1:8765/healthz
```

当您需要公共 HTTPS 访问时，启动捆绑的 Cloudflare Tunnel sidecar：

```bash
docker compose --profile tunnel up -d
```

公共 MCP 端点是：

```text
https://your-public-host.example.com/mcp
```

完整的设置说明位于[文档](https://fwerkor.github.io/local-shell-mcp/)。运行时选择与客户端连接分开记录。

## 人机界面

该服务包括两个兼容的人机界面，由相同的经过身份验证的 API 和状态支持：

- **Web UI** 是一个本机浏览器仪表板，用于显示系统运行状况、机器、工作负载、最近的 MCP 活动和警报。
- **OpenTUI** 是完整的面向终端的界面，包括仪表板、文件、终端、遥控器和审核屏幕。它仍然可以在浏览器中作为可选择的控制台和本机 `local-shell-mcp tui` 命令使用。

在服务源端打开浏览器界面：

```text
http://127.0.0.1:8765/ui
```

OAuth 屏幕允许您在授权前选择 Web UI 或 OpenTUI。登录后，可以随时通过界面选择器切换模式。本机 Web UI 路由使用 URL 哈希（例如 `#/overview` 和 `#/console`），因此可以为选定的模式或页面添加书签。 OpenTUI 控制台保留了现有的经过身份验证的 xterm.js/PTY 传输、鼠标交互、自动调整大小、重新连接、全屏模式和移动快捷方式行。

独立版本的可执行文件嵌入本机 OpenTUI 运行时，而 Docker 映像在映像内提供它。启动服务，然后在没有人工登录提示的情况下启动它：

```bash
local-shell-mcp tui
```

文件仍然是 OpenTUI 中本地和远程计算机的 LSM 原生三窗格文件管理器。它呈现有界的 PNG/JPEG/GIF/WebP 缩略图，并通过共享服务 API 提供一致的文件操作。通过任一人机界面输入的手动操作均不包括在 MCP 审核日志中；活动、审计和终端审计轨道显示模型发起的 MCP 活动。

请参阅[人机界面指南](https://fwerkor.github.io/local-shell-mcp/guides/human-interface/)。

## ChatGPT 设置

对于完整的 shell、文件系统、远程工作人员和 Playwright 工具，请使用 ChatGPT 开发人员模式或其他完整的 MCP 客户端。 ChatGPT是客户端连接；首先选择并启动一个运行时。

`session_manage` 为座席工作提供持久的逻辑任务上下文。会话故意独立于机器和工作目录：它存储任务目标、语义进度报告、最近的执行活动、代理运行历史记录和可选计划。稍后的 ChatGPT 运行可以调用 `session_manage(action="resume", session_id=..., takeover=true)` 来继承该上下文；接管取代仍然活跃的旧运行，因此过时的代理无法继续改变同一会话。代理应使用 `session_manage(action="report", ...)` 报告有意义的检查点，而不是将每个工具结果复制到会话摘要中。

当客户端支持 MCP 应用程序时，`workspace_open` 将当前会话的执行视图作为浮动 MCP 应用程序打开，并且可以扩展到全屏。 v3 名称 `open_live_workspace` 仍然是具有缓存收件人的 ChatGPT 客户端的隐藏、非枚举兼容性别名；新集成仅查看和使用 `workspace_open`。实时工作区是可重新连接的视图和协作传输，而不是任务状态的所有者：关闭它、重新连接 MCP 或将会话移交给另一个 ChatGPT 运行不会丢弃会话进度或其计划。普通的 MCP 工具仍然是执行 API，而应用程序添加了实时操作活动、持久终端、文件/差异检查、作业、远程、审计数据和活动会话 ID。不渲染 MCP 应用程序的客户端将继续使用正常的工具表面而不改变。

`plan_manage` 可选择在当前会话上启用**目标模式**，以进行大量的多步骤工作。活动计划是目标：其步骤可以随着执行的变化而修改，并且在附加实时工作区时，应用程序可以在没有代理工具活动的情况下在 15 分钟后请求继续。自动继续的上限为 10 次继续尝试（接受或拒绝），并在继续之前恢复同一会话。阻止、完成和取消的计划状态永远不会被轻移；步骤全部完成或跳过的活动计划仍然有资格继续清理，因此恢复的代理可以调用​​ `plan_manage(action="finish")`。会议不需要计划。

1.通过HTTPS公开服务器。
2. 保持 OAuth 启用。
3. 添加MCP端点：`https://your-public-host.example.com/mcp`。
4. 完成OAuth授权流程。
5. 从有界任务开始，并在需要时检查审核日志。

阅读专用的[ChatGPT 连接器指南](https://fwerkor.github.io/local-shell-mcp/getting-started/chatgpt-connector/)。

## DeepSeek Harness 插件

存储库根也是