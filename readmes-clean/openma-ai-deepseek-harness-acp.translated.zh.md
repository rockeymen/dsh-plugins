![代理客户端协议 × DeepSeek Harness](assets/acp-x-deepseek.svg)

#deepseek-harness-acp

  使用[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)从

适配器在进程中组成线束并映射其会话事件日志
完整的 ACP 词汇：流文本和推理、工具调用
差异和显示终端、计划、权限请求、会话模式、
配置选项、斜杠命令、技能和 MCP 服务器。凭据从不
触摸您的编辑器配置 - 它会重用您在 dsh Web UI 中保存的密钥，或者
`dsh-acp login` 将一个保存到同一商店。

## 两种插入方式

### · **A · 独立服务器** · **B · dsh 配置文件插件**
- 最适合 · ****A · 独立服务器****：通过一个命令开始 · ****B · dsh 配置文件插件****： 生活在您的 dsh 设置中
- 安装·****A·独立服务器****：`npm i -g @openma/deepseek-harness-acp`·****B·dsh配置文件插件****：`dsh plugin --profile acp add -w @openma/deepseek-harness-acp`
- Zed 运行 · ****A · 独立服务器****：`dsh-acp` · ****B · dsh 配置文件插件****：`dsh --profile acp`
- 线束 · ****A · 独立服务器****：您安装的 dsh — 或者当不存在时供应商的后备 · ****B · dsh 配置文件插件****：拥有该配置文件的 dsh
- 组成·****A·独立服务器****：dsh-base +此捆绑包（配置文件机器在进程中启动）·****B·dsh配置文件插件****：dsh-base +此捆绑包+您的配置文件自己的补丁

两种形状共享 `$DSH_HOME`：相同的凭证存储、设置、预设、
会话日志为 `dsh web` — 在 Web UI 中启动的对话可以
列出并从编辑器加载。

### A · 独立服务器

```bash
npm install -g @openma/deepseek-harness-acp
dsh-acp login        # interactive; or save the key in the dsh Web UI
```

```jsonc
// Zed settings.json
{
  "agent_servers": {
    "DeepSeek Harness": { "command": "dsh-acp" }
  }
}
```

独立：它通过 `--dsh-path` / `DSH_PATH` 找到您的 DeepSeek Harness，
它自己的树，PATH 上的 `./node_modules`、`dsh` 或 `npm root -g` — 并提供
供应商的线束运行时作为**最后**候选者，因此它可以开箱即用
并且始终更喜欢您安装的 dsh。当真正的
`$DSH_HOME/profiles/acp` 存在，该配置文件拥有该组合。

### B·dsh 配置文件插件

```bash
npm install -g @deepseek-ai/dsh
dsh web                                                  # save your API key once
dsh plugin --profile acp add -w @openma/deepseek-harness-acp
```

```jsonc
// Zed settings.json
{
  "agent_servers": {
    "DeepSeek Harness": { "command": "dsh", "args": ["--profile", "acp"] }
  }
}
```

这将创建 `$DSH_HOME/profiles/acp` 并注册包的
`dsh.bundle` 补丁：桥安装在 `@deepseek-ai/dsh-base` 上 — 相同
产品基线为 `dsh web`，模块重新加载观察程序关闭。延长
`$DSH_HOME/profiles/acp/cordis.patch.yml` 中的配置文件与其他 dsh 一样
简介。

## 身份验证

编辑器配置中没有密钥，没有 ACP 介导的秘密。按顺序：

1. **Harness 凭证存储** — `$DSH_HOME/.credentials.yaml`（模式 600），
   dsh Web UI 写入的文件；热重装。保存密钥
   `dsh-acp login`、Web UI（设置 → 模型）或聊天中的 `/login <key>`。
2. **流程环境** — `DEEPSEEK_API_KEY` / `DEEPSEEK_BASE_URL` 中
   启动代理的环境。

初始化handshake广告**终端认证**（`dsh-acp login`），所以
注册表驱动的客户端可以为您运行交互式安装。

## 特点

- **流媒体** — 辅助文本和推理增量；组装消息后备。
- **工具调用** — ACP 类型、人类标题、文件位置、与 fs 工具块的实际差异、原始输入/输出；当客户端支持时，命令输出在 **显示终端** 上，否则为受保护的输出。
- **权限预设为会话模式** - `read-only` / `workspace-write` / `danger-full-access`，每个命名的 `{sandbox, approval}` 对记录为持久会话事实（也作为仅呈现这些事实的客户端的配置选项公开）。
- **代理预设** — `standard` / `code` / `minimal` / `cordis` 作为配置选项；切换会重建代理并保留历史记录。
- **实时模型目录** — 提供程序 × 正在运行的组合中的模型（在 Web UI 中添加的第三方提供程序立即出现），以及遵循产品默认值的推理工作选择。
- **斜线命令** - 适配器内置命令（`/status`、`/login`、`/logout`、`/model`）加上线束命令注册表（`/compact`、`/goal`、`/permission`、`/plan`，...）无需模型转动即可执行，加上**技能**（`/skill-name` -利用自己的调用手势）。
- **计划和使用** — `todo_write` 快照作为 ACP 计划；代币记账为 `usage_update` 和每回合使用情况。
- **会话** — `session/load` 具有完整历史记录重播、`session/list`、代理重新启动后客户端提示旧会话时的静默恢复，标题为 `session_info_update`。
- **MCP 服务器** — 每个会话 `mcpServers` 安装 `@deepseek-ai/dsh-mcp-client` 实例（stdio + 可流传输的 HTTP）；工具加入为`mcp__<server>__<tool>`；发生故障的服务器永远不会中断会话。
- **真正取消** — `session/cancel` 通过线束代理中断实时转弯。

## 配置

标志战胜了环境变量，环境变量战胜了默认值。全部可选 —
如果没有标志，会话将遵循您的产品默认值 (`settings.yaml`)。

### 标志·环境·默认·目的
- **标志**：`--dsh-path` · **环境**：`DSH_PATH` · **默认**：自动检测 · **用途**：DeepSeek Harness 安装
- **标志**：`--provider` · **环境**：`DSH_PROVIDER` · **默认**：产品默认值 · **用途**：提供商路由覆盖
- **标志**：`--model` · **环境**：`DSH_MODEL` · **默认**：产品默认 · **用途**：模型覆盖
- **标志**：`--max-tokens` · **环境**：`DSH_MAX_TOKENS` · **默认**：提供商默认值 · **用途**：每个请求输出令牌上限
- **标志**：`--permission-mode` · **环境**：`DSH_PERMISSION_MODE` · **默认**：`workspace-write` · **用途**：初始权限预设
- **标志**：`--reasoning-effort` · **环境**：`DSH_REASONING_EFFORT` · **默认**：产品默认值 · **用途**：`off` / `high` / `max`
- **标志**： — · **环境**：`DEEPSEEK_API_KEY` · **默认**： — · **用途**：API 凭证（回退到凭证存储）
- **标志**： — · **Env**：`DEEPSEEK_BASE_URL` · **默认**：DeepSeek 端点 · **用途**：OpenAI 兼容端点覆盖
- **标志**： — · **环境**：`DSH_ACP_DEBUG` · **默认**：关闭 · **用途**：详细 stderr 诊断

子命令：`dsh-acp login [api-key]`（省略时交互；从不输入
echoes），`dsh-acp update`（通过npm自我更新）。

## 权限和沙箱

会话从 `workspace-write` 开始：bash 和文件突变仅限于
会话的 `cwd`（加上共享临时根）和模型重试请求
更广泛的访问会引发 ACP 许可请求。 **始终允许（这
session)** 将该会话的批准策略翻转为 `never`。
`danger-full-access` 禁用沙箱和提示——仅使用它
放在一次性收银台或容器中。每个级别都是一个持久的预设
（沙箱+批准一起），Web UI 提供相同的三个。

## 架构

```
ACP client (Zed, …)
   │  ACP JSON-RPC over stdio
   ▼
dsh-acp
   ├─ src/profile-boot.ts     boots the harness's own profile machinery
   │                          (dsh-base + this bundle + $DSH_HOME layers)
   ├─ src/harness.ts          host discovery (DSH_PATH → cwd → PATH → npm -g → vendored)
   └─ src/bridge/             the ACP bridge (a cordis plugin)
        ├─ index.ts           sessions, prompts, cancel, modes, options,
        │                     commands, credentials, MCP mounts
        ├─ translate.ts       session-event → ACP update projection (pure)
        ├─ history.ts         stored-log replay for session/load (pure)
        └─ prompt.ts          ACP prompt blocks → harness content blocks (pure)
   ▼
your @deepseek-ai/dsh installation   (agent spine, llm, persistence, sandbox,
                                      tools, presets, skills, compaction, …)
```

桥梁消耗线束 `session/event` 消防水带 — 相同
仅附加日志持久性存储 - 因此实时流媒体、历史重播和
`session/list` 施工同意。所有线束模块，包括cordis
本身，从一棵主机树加载：插件和服务身份永远不会分割
跨副本。

## 发展

```bash
npm install         # dev deps include the harness packages (types + tests)
npm run typecheck   # tsc --noEmit
npm test            # vitest: unit + e2e smoke (boots the real composition; no model calls)
npm run build       # esbuild → dist/
```

要针对独立主机安装运行 e2e 套件：

```bash
npm install --prefix /tmp/dsh-host @deepseek-ai/dsh
DSH_ACP_TEST_HOST=/tmp/dsh-host npm test
```

### 实时迭代：配对配置文件

将您的编辑器使用的配置文件保留在已发布的包上