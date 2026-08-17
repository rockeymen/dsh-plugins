![DSH 船员](./docs/images/dsh-crew-logo.png)

# DSH 船员

  [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件：从 Claude Code / Codex 将工作分派给 DSH 代理，而不放弃主机的本机子代理 UI。
  <sub>本机进度 UI • 层策略和升级 • 主机内 DSH 会话 • 视觉和图像生成 • 一键安装</sub>

  <sub>npm：`@zseven-w/dsh-crew` · 当前插件版本：`0.1.0-rc.1` · 使用 DSH `0.1.0-rc.6` 进行测试</sub>

  ![DSH 船员 — 设置页面](./docs/images/dsh-crew-overview.png)

<sub>DSH Crew 设置页面 — 主机集成、调度策略、执行和多式联运桥</sub>

## 为什么选择 DSH Crew

DSH Crew 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) - 开源代理工具的插件。它使 DSH 代理可以从 Claude Code 和 Codex 调度：协调器保留自己的模型，工作在真正的 DSH 代理上运行，并具有该工具、沙箱、预设和会话历史记录，并且主机仍然将其显示为具有实时进度的本机子代理。

运行该工作的是 DSH 代理，而不是裸模型调用。层 (`flash` / `pro`) 选择代理从线束的配置名册（今天的 DeepSeek V4 Flash 和 V4 Pro）中获得多少功能，因此 DSH 中的模型更改无需更改。

### 🧵 原生进度 UI

工作人员在 Claude Code / Codex 中显示为常规子代理 - 调度计数、运行步骤、工具调用和令牌使用情况都显示在主机自己的任务面板中，以及 claude-hud 状态行段：`⚙dsh 1▶pro 2m14s 21.7k/606 ✓3`。

### 🎚️ 层级政策和升级

`flash`用于机械工作，`pro`用于推理，`effort`从`off`到`max`。 `tier_policy` 可以将每个调度限制在工具层的一层，并且 `escalate_on_failure` 在 pro 上重试一次失败的闪存运行 — 基于证据，而不是基于预先猜测难度。

### 🏛️ 主持人 DSH 会议

将捆绑包安装在 DSH 配置文件中后，每个工作线程都是一流的 DSH 会话：在 Web UI 中可见，按工作目录分组，安装有您为每层选择的代理预设。如果没有运行 DSH，调度将回退到独立的 DSH 运行时，因此 CI 和无头环境仍然可以工作。

### 👁️ 视觉和图像生成

DSH 的型号仅包含文本。 `describe_image` 和 `generate_image` 借用了您已有的 CLI（Claude、Codex、Grok、Antigravity）或您配置的任何 OpenAI 兼容 API 的眼睛和画笔。粘贴的图像在对话中保持可见，并以文本形式到达模型。

### 🔌 定制提供商

带上您自己的端点（基本 URL + API 密钥 + 模型）或本地命令模板。每个提供商都会进行连接测试，检查可达性和身份验证，然后进行一次真正的视觉调用，以便您立即发现，而不是在任务进行中。

### 📦 一键安装

设置页面会为您安装和更新 Claude Code 插件和 Codex 角色文件 - 市场注册、许可名单、HUD 接线、为本机呈现的绝对路径 - 并同样轻松地恢复它们。首先备份每个设置文件。

## 它是如何工作的

```
Claude Code / Codex (orchestrator, keeps its own model)
  └─ ds-flash / ds-pro  ← native subagent shell (progress shows in the host's task UI)
       └─ MCP: dsh_run_worker(tier, effort, cwd)
            ├─ hub reachable → session inside DSH (visible in the Web UI, grouped by cwd)
            └─ otherwise     → dsh-jsonrpc-agent runtime (worker.cordis.yml)
                 └─ DeepSeek V4 Flash / Pro (DSH SDK, event stream → progress and token stats)
```

## 一次运行，两种视图

派出粉丝。下面，十八个工作人员并行翻译此自述文件：主机将它们视为自己的子代理，而线束将它们作为真实会话运行。

  ![Claude Code](./docs/images/dsh-crew-host.png)

<sub>Claude Code 将 dsh-crew 工作人员视为本机子代理，并通过状态行段跟踪运行层、已用时间和令牌。</sub>

  ![DSH 船员](./docs/images/dsh-crew-jobs.png)

<sub>DSH Crew 面板从线束端看到相同的运行：哪个主机调度了每个作业、其层级和工作量、实时进度和令牌使用情况。</sub>

## 安装

从 npm 安装到 DSH 配置文件中：

```bash
dsh plugin --profile web add @zseven-w/dsh-crew@latest
dsh web
```

或者，直接从源树进行本地开发：

```bash
dsh plugin --profile web add link:/path/to/dsh-crew
dsh web
```

`link:` 协议将配置文件依赖项符号链接到此存储库，因此重建立即可见。

### 配置 DeepSeek 凭据（仅限独立版）

在集线器模式下（上面的安装），工作人员在 DSH 实例内运行并使用已配置的 DeepSeek 凭据。没有其他需要设置的。

只有独立后备需要一个自己的密钥：从 Claude Code / Codex 调度而不运行 DSH 实例，将工作运行时作为单独的进程启动。从[platform.deepseek.com](https://platform.deepseek.com)获取API密钥并将其写入`~/.config/dsh-crew/.env`：

```
DEEPSEEK_API_KEY=sk-...
```

### 验证

```bash
node scripts/smoke.mjs
```

冒烟测试通过任何可用路径（DSH 实例运行时为集线器，否则为独立路径）分派一项廉价作业，并打印它使用的作业。大约十秒内您应该会看到 `smoke test passed — configuration OK`。失败时会打印原因，范围仅限于测试的路径。

然后打开设置 → DSH Crew 并一键安装 Claude Code / Codex 集成。

## 背景和术语

- **DSH** (DeepSeek Harness)：DeepSeek 的开源代理工具，Web UI 形式的代码代理，与 Claude Code 类似，但驱动 DeepSeek 模型。
- **MCP**（模型上下文协议）：Anthropic 的 AI 工具集成协议，使 LLM 能够安全地调用外部工具和数据源。
- **Cordis捆绑**：DSH的插件格式；该项目可以作为 MCP 服务独立运行，也可以作为集线器模式安装到 DSH Web 中。
- **tier**：功能层 - 工作人员获得 DSH 配置模型名册的哪个位置。 `flash` 快速且便宜（简单任务），`pro` 原因更困难（复杂问题）。如今，它们映射到 DeepSeek V4 Flash 和 V4 Pro；交换 DSH 中的型号，这里没有任何变化。
- **worker**：执行工作的 DSH 代理 - 具有自己的工具、沙箱和预设的完整会话，而不是裸模型调用。
- **努力**：推理强度，`off` = 无推理，`high` = 高推理投入，`max` = 最大推理投入。

## Claude Code

### 安装

一键安装（选择一项）：

- **DSH设置页面**（安装集线器模式时）：设置→DSH Crew→“安装到Claude Code”
- **命令行**：`node src/install/cli.mjs all`

两者都做同样的事情：注册本地市场（父目录 `dsh-plugins/` 作为市场根）+ `claude plugin install` + MCP 工具权限白名单 + claude-hud 工作状态段配置（更改前自动备份 settings.json，幂等）。 **安装后重新启动会话以使更改生效。**

### 用法

- 直接在对话中说“dispatch X to ds-flash”或“dispatch X to ds-pro”，子代理就会执行任务
- Claude Code任务UI中显示调度计数和实时进度
- **HUD状态行段**：`⚙dsh 1▶pro 2m14s 21.7k/606 ✓3`（当前层/已用时间/令牌使用/完成计数）
  - 对于本地开发，可独立集成`statusline/statusline.sh`或`statusline/worker-segment.sh`
- **长时间运行的任务**：CC 对 MCP 调用有超时限制（`MCP_TOOL_TIMEOUT` 可调），长时间任务可以让协调器使用 `dsh_spawn_worker` + `dsh_worker_result(wait_seconds)` 轮询
- **本地开发调试**：`claude --plugin-dir /path/to/dsh-crew`暂时加载

### 会话命令

这些仅覆盖当前会话的全局默认值，并且在工具层强制执行，而不是通过提示：

### 命令·它的作用
- **命令**：`/dsh-crew:config` · **作用**：显示或设置此会话的默认值：`tier=flash\ · pro`、`effort=off\ · high\ · max`、`mode=auto\ · hub\ · standalone`、`timeout=<seconds>`、`policy=auto\ · flash-only\ · pro-only`、`escalate=true\ · false`、`reset`
- **命令**：`/dsh-crew:on` · `/dsh-crew:off` · **它的作用**：打开或关闭此会话的调度（关闭是硬开关：工具拒绝）
- **命令**：`/dsh-crew:status` · **它的作用**：工作人员作业的实时状态：层、进度、令牌、当前工具

## 法典

### 安装

推荐使用安装程序（自动渲染本机的路径，复制 `/dsh-config`、`/dsh-status` 命令）：

```bash
node src/install/cli.mjs codex
```

或者手动复制（复制后需要手动修改路径）：

```bash
cp codex/agents/*.toml ~/.codex/agents/    # global or project-level .codex/agents/
```

角色文件预先配置有：

- MCP服务器安装配置
- `默认_