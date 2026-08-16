#dsh-acp-gateway

**独立的第三方 DeepSeek Harness 代理通过代理客户端
协议 (ACP v1)** — 任何 ACP 兼容的基于 stdio 的完整 ACP 代理
客户端（Zed、VS Code ACP、Claude Code，...）可以直接启动。它是一个
仅官方自动化的超集
[`@deepseek-ai/dsh-acp`](https://github.com/deepseek-ai/deepseek-harness/tree/main/packages/acp/acp)：
每个 ACP 会话都是一个真正的 DSH 代理，具有相同的工具访问权限、预设、
会话和设置作为 Web GUI。

> **注册表式条目**（请参阅 [ACP 注册表](https://agentclientprotocol.com/get-started/registry)）：
>
> |领域|价值|
> |---|---|
> |名称 | `dsh-acp-gateway` |
> |版本 | 3.10.0 |
> |交通 | stdio（JSON-RPC 2.0，换行符分隔）|
> |协议| ACP v1 |
> |命令 | `npx -y dsh-acp-gateway` |
> |注册表 JSON | https://raw.githubusercontent.com/devloom1024/dsh-acp-gateway/main/registry.json |
> |能力|流、工具调用、会话（列表/加载/删除）、图像/音频、斜线命令、会话模式（代理预设）、配置选项（模型/思想级别/权限）|

## 快速入门

```bash
# One command — the package brings the full @deepseek-ai/dsh runtime, so no
# separate server, no global install. First launch downloads ~330 MB once.
npx -y dsh-acp-gateway
```

**Zed** — `settings.json`：

```json
{
  "agent": {
    "acp": {
      "command": "npx",
      "args": ["-y", "dsh-acp-gateway"]
    }
  }
}
```

首次启动大约需要 15-20 秒（完整的 DSH 实例启动）；每个代理窗口都是其
随窗口退出的自己的进程。会话在 `~/.dsh` 中持续存在
（`DSH_ACP_HOME` 隔离），因此 `session/load` 稍后恢复它们。设置模型
提供商的 API 密钥环境变量（例如 `OPENCODE_GO_API_KEY` 或 `DEEPSEEK_API_KEY`）。

## 自托管 ACP 注册表

该存储库还发布了一个自托管 ACP 注册表项：

```text
https://raw.githubusercontent.com/devloom1024/dsh-acp-gateway/main/registry.json
```

它是具有 `npx` 发行版的标准 ACP 注册表 JSON：

```json
{
  "distribution": {
    "npx": {
      "package": "dsh-acp-gateway@3.10.0"
    }
  }
}
```

支持自定义 ACP 注册表 URL 的客户端可以使用原始 GitHub URL
上面。该图标存储在[`assets/dsh-acp-icon.svg`](assets/dsh-acp-icon.svg)。
CI运行`npm run check:registry`以保留`registry.json`和`package.json`
版本同步。

＃＃ 特征

### 能力·细节
- **功能**： ✅ 代币级流式传输 · **细节**：`assistant/chunk` 文本增量 → `agent_message_chunk`
- **功能**： ✅ 工具调用通知 · **详细信息**：`tool_call`（待定）→ `tool_call_update`（已完成/失败）
- **功能**： ✅ 完整的工具访问权限 · **详细信息**：安装选定的代理预设：bash、fs、web、技能、子代理...
- **功能**： ✅ `session/list` / `session/load` / `session/delete` · **细节**：通过历史重播恢复持久会话
- **功能**：✅ `usage_update` · **详细信息**：`assistant/message` 的代币使用情况
- **功能**： ✅ 图片/音频提示内容 · **详细**：图片 → DSH 附件；音频 → 文字参考
- **功能**：✅ 斜杠命令 · **详细信息**：`available_commands_update` + `/cmd` 执行（包括 `/plan`、`/plan off` — Web GUI 的 Plan 芯片使用的通道相同）
- **功能**：✅ 会话模式 · **详细信息**：**代理预设**（Web GUI 模式：标准/代码（PTC）/最小/创建者/您的自定义预设），`session/set_mode` 重新组合代理，`current_mode_update`
- **功能**： ✅ `user_message_chunk` · **详细**：回显接受的提示
- **功能**： ✅ 嵌入资源内容 · **详细**：`resource` 块扩展为提示文本
- **功能**：✅ 会话配置选项 · **详细信息**：ACP v1 `configOptions`（选择）用于 `mode`（代理预设）、`model` (`provider/model`)、`thought_level`、`permission`（只读/工作区写入/危险完全访问）
- **功能**： ✅ 权限审批流程 · **细节**：workspace-write 通过 `session/request_permission` 向客户端请求变异工具（编辑/删除/移动/执行）
- **能力**： ✅ 启发· **细节**：DSH `ask_user_question` 表面为 ACP `elicitation/create` 形式；答案作为工具结果反馈
- **能力**： ✅ 思维流 · **细节**：来自 DSH 推理块的 `agent_thought_chunk`
- **能力**： ✅ 代理计划 · **详情**：`exit_plan_mode` 降价 → ACP `plan` 通知（条目）
- **功能**：✅ 会话信息 · **详细信息**：标题更改时的 `session_info_update` — 确定性后备占位符被抑制，因此会话的标题通知一次（或实际更改时）并保持固定

## 架构

```
ACP client (Zed / VS Code ACP / ...)
   │  stdio  (launches `dsh-acp-gateway` / `dsh-acp-agent` / `dsh-acp-server`)
   ▼
dsh-acp-gateway process (full DSH instance)
   │  agents.create() → real DSH agent (selected preset, full tools)
   ▼
DSH agent engine (same as the Web GUI)
```

- **直接模式（编辑器默认）**：客户端自行启动服务器
  over stdio — stdio是ACP通道，当客户端连接时进程退出
  关闭（1:1 生命周期，无孤儿）。
- **桥接模式**：`dsh-acp-agent` 是一个薄 stdio 桥接器，连接到长期运行的
  `dsh-acp-server`（端点发现：`DSH_ACP_URL` → `~/.dsh/acp/endpoint`
  → `http://127.0.0.1:3080`);一台服务器可以为多个客户端/会话提供服务。
- 每个 ACP 会话映射到一个真实的 DSH 代理/会话（持久、可通过
  `session/load`）。

## 安装

### 1.零安装：`npx`（编辑推荐）

请参阅[快速入门](#quick-start)。套餐取决于完整的
`@deepseek-ai/dsh` 运行时，因此它是独立的 - 无需全局安装
dsh应用程序，没有单独的服务器进程，没有手动生命周期。

### 2.离线存档（无npm，无网络）

构建一个具有完整依赖闭包的独立 tarball，已发布的
预设和便携式供应商锚点。预计系统为 `node >= 20`
（`--embed-node` 捆绑了一个 Node 二进制文件）：

```bash
bash scripts/package-offline.sh               # → dist-offline/dsh-acp-gateway-<ver>.tar.gz
bash scripts/package-offline.sh out --embed-node   # embed a Node runtime (~156 MB)
```

提取任意位置并将 ACP 客户端指向捆绑的启动器：

```json
{
  "agent": { "acp": { "command": "/path/to/extracted/dsh-acp", "args": [] } }
}
```

> 闭包包含特定于平台的本机预构建（node-pty 等），因此
> 在每个目标平台上构建存档。

### 3. 作为 DSH 部署中的插件进行部署

```bash
npm install dsh-acp-gateway
# or clone this repo and: npm link
```

添加到您的部署 `cordis.yml`（主机平面）：

```yaml
- id: acp-gateway
  name: 'dsh-acp-gateway'
  config: {}
```

需要标准主机服务（`agents`、`webServer`、`fs`、`shell`、
`agentDefaultModel`、`approval`、`agentPresets`、`commands`、`attachments`、
`sessionQuery`）。启动时插件将 stdio 桥写入
`~/.dsh/acp/dsh-acp-agent.js`（端点嵌入式）。

## 客户端设置

**Zed** — `settings.json`：

```json
{
  "agent": {
    "acp": {
      "command": "npx",
      "args": ["-y", "dsh-acp-gateway"]
    }
  }
}
```

**VS Code (vscode-acp)** — `settings.json`：

```json
{
  "acp.agent": {
    "command": "npx",
    "args": ["-y", "dsh-acp-gateway"]
  }
}
```

**任何其他 ACP 客户端** — 将其指向 `npx -y dsh-acp-gateway`，或指向
本地安装（`npm i -g ./dsh-acp-gateway-<ver>.tgz` 然后
`dsh-acp-gateway`），或在提取的离线启动器中
（`/path/to/dsh-acp`）。

## 用法

### 命令

### 命令·目的
- **命令**：`dsh-acp-gateway` · **目的**：ACP代理本身（stdio直接模式）
- **命令**：`dsh-acp-server` · **用途**：上述的别名
- **命令**：`dsh-acp-agent` · **用途**：stdio 桥接到长时间运行的服务器（桥接模式）
- **命令**：`dsh-acp-client` · **目的**：脚本化测试客户端

```bash
npx dsh-acp-gateway
# --provider opencode-go --model deepseek-v4-flash (defaults, env-overridable)
```

默认情况下，服务器**共享您的部署主目录 (`~/.dsh`)**：预设
（包括本地创作的，如`anchored-standard`），设置（默认
模型、默认预设、权限）、会话和凭据正是
Web GUI 使用的那些。设置 `DSH_ACP_HOME`（例如 `~/.dsh-acp`）以获得完全
孤立的实例。

### 会话模式 = 代理预设

ACP 会话模式是 **代理预设** - 与 Web GUI 相同的“模式”
提供（标准/代码/最小/创建者，加上您的自定义预设）。的
当前模式遵循部署默认值（`agent-presets.default`
设置）； `session/set_mode` 或 `mode` 配置选项切换预设：
尚未开始的会话将就地重组（并且切换为
记录在其日志中），已启动的会话将在下一个提示时重新组合。计划
模式 **不是** 模式：它通过 `/plan` 和 `/plan off` 切换
斜杠命令，与 Web GUI 的 Plan 芯片完全相同。

### 测试客户端

````bash
npx dsh-acp-client # 交互式，通过