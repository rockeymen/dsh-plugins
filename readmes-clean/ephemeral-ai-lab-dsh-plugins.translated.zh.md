# 🧩 DSH 线束插件

  ![鲸鱼男孩图标](./assets/whale-boy.png)

  小型、专注的插件，使 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 更强大、更具表现力、更易于使用。

> 🧠 为您的 DSH 会议提供更好的工具、持久的工作流程以及从想法到执行的更清晰的路径。

## ⚡ 快速启动

已发布的插件可通过一个命令直接安装到 DSH 配置文件中。的
以下示例针对 `web` 配置文件；将 `web` 替换为您使用的配置文件。

### 🐚 法典终端

```powershell
# With the DSH CLI:
dsh plugin --profile web add dsh-codex-terminal@0.1.3

# Without the `dsh` CLI:
npm install dsh-codex-terminal@0.1.3
```

### 🔐 Codex 编码计划

重用 DSH 模型页面中现有的文件支持的 `codex login`：

```powershell
dsh plugin --profile web add ./coding-plan/codex

# Grok Coding Plan models from the existing `grok login`
dsh plugin --profile web add ./coding-plan/grok
```

### ⏰ 循环

```powershell
# With the DSH CLI:
dsh plugin --profile web add dsh-loop@0.1.3

# Without the `dsh` CLI:
npm install dsh-loop@0.1.3
```

### 🧪 模拟 — 不稳定

`dsh-mock` 已发布用于早期测试。它的命令、API 和 UI 可以
在稳定版本发布之前进行更改。

```powershell
# With the DSH CLI:
dsh plugin --profile web add dsh-mock@0.1.0

# Without the `dsh` CLI:
npm install dsh-mock@0.1.0
```

### 🧭 会议

使用当前会话工具检查、创建、读取 DSH 会话并发送消息：

```powershell
# With the DSH CLI:
dsh plugin --profile web add dsh-sessions@0.1.1

# Without the `dsh` CLI:
npm install dsh-sessions@0.1.1
```

安装插件后重启DSH并创建新会话。如果 `dsh` 不是
在您的 PATH 上，从 DeepSeek Harness 源签出运行相同的命令
改为 `pnpm dsh`。

直接 npm 安装会下载包供您的项目使用。 DSH
当您希望DSH加载插件时，仍然需要安装profile
个人资料的一部分。

## 📦 套餐

### 包·状态·添加内容·文档
- **软件包**：[`dsh-codex-coding-plan`](./coding-plan/codex/) · **状态**：🧪本地 · `0.1.0` · **添加内容**：通过现有的 `openai-codex` pi-ai 提供商重用文件支持的 Codex ChatGPT 登录。 · **文档**：[`README`](./coding-plan/codex/README.md)
- **软件包**：[`dsh-grok-coding-plan`](./coding-plan/grok/) · **状态**：🧪本地 · `0.1.0` · **它添加了什么**：通过现有的 `xai` pi-ai 提供商重用文件支持的 Grok 订阅登录。 · **文档**：[`README`](./coding-plan/grok/README.md)
- **软件包**：[`dsh-codex-terminal`](./codex-terminal/) · **状态**：✅ 已发布 · `0.1.3` · **添加内容**：具有持久命令会话的 Codex 兼容 `exec_command` 和 `write_stdin` 工具。 · **文档**：[`README`](./codex-terminal/README.md) · [npm](https://www.npmjs.com/package/dsh-codex-terminal)
- **软件包**：[`dsh-loop`](./loop/) · **状态**：✅ 已发布 · `0.1.3` · **它添加了什么**：会话范围的重复警报、循环工具、斜线命令和 Web UI。 · **文档**：[`README`](./loop/README.md) · [npm](https://www.npmjs.com/package/dsh-loop)
- **软件包**：[`dsh-mock`](./mock/) · **状态**：⚠️ 不稳定 · ✅ 已发布 · `0.1.0` · **它添加了什么**：确定性模拟模型转动并重播通过真实 DSH AgentLoop 和 ToolRuntime 路由的命令。 · **文档**：[`README`](./mock/README.md) · [`SPEC`](./mock/SPEC.md) · [npm](https://www.npmjs.com/package/dsh-mock)
- **软件包**：[`dsh-sessions`](./sessions/) · **状态**：✅ 已发布 · `0.1.1` · **添加内容**：通过会话工具和 `/sessions` 进行会话发现、有界读取、创建和交付。 · **文档**：[`README`](./sessions/README.md) · [`SPEC`](./sessions/SPEC.md) · [npm](https://www.npmjs.com/package/dsh-sessions)

### 🐚 `dsh-codex-terminal`

像 Codex 风格的代理一样运行 shell 命令：启动长时间运行的进程，
轮询输出，并将输入发送到持久会话。使用 PTY 传输
默认情况下，当 PTY 分配不可用时，使用配置的管道回退。

### ⏰ `dsh-loop`

创建持久的、会话本地的重复提示，可以通过以下方式进行管理
代理工具、`/loop` 命令和 Web UI。循环随会话恢复
并使每个警报独立于其他警报。

### 🧪 `dsh-mock`

练习确定性模拟模型经过`/mock run`和`/mock replay`
同时保留真实的DSH AgentLoop、ToolRuntime、策略和事件流。

> ⚠️ **不稳定：** 发布为 `dsh-mock@0.1.0` 进行早期测试。命令，
> API 和 UI 界面可能会在稳定版本发布之前发生变化。

使用一条命令将其安装到 DSH `web` 配置文件中：

```powershell
dsh plugin --profile web add dsh-mock@0.1.0
```

## 🛠️ 发展

每个插件都可以独立安装和测试。例如：

```powershell
cd loop
pnpm install
pnpm test
pnpm build
```

源树有意保留在 DeepSeek Harness 存储库之外；
DSH 通过配置文件范围的安装和补丁层来组成插件。

## 📚 文档

- [Codex 终端文档](./codex-terminal/README.md)
- [编码计划 core](./coding-plan/core/)
- [法典编码计划文档](./coding-plan/codex/README.md)
- [Grok 编码计划文档](./coding-plan/grok/README.md)
- [循环文档](./loop/README.md)
- [模拟文档](./mock/README.md)
- [模拟实现规范](./mock/SPEC.md)
- [会话文档](./sessions/README.md)
- [会话规范](./sessions/SPEC.md)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)

### 利用架构和操作指南

- [项目指南](./docs/project.md)
- [工具参考](./docs/tools.md)
- [临时AI线束预设](./docs/ephemeral_ai_harness_preset.md)
- [操作指南](./docs/how-to/)

## 🤝 贡献

欢迎提出问题、想法和拉取请求。保持插件集中，文档
他们的运行时契约，包括对工具更改、持久性的测试，
或用户界面行为。

## 📄 许可证

根据 [MIT 许可证 ](./LICENSE) 发布。