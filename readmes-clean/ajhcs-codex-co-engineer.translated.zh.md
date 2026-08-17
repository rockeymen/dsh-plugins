#Codex-Co-Engineer

Codex-Co-Engineer 是一个公共的、Codex 优先的独立控制平面
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 和
官方[Grok 构建 CLI](https://docs.x.ai/build/cli/headless-scripting)。法典是
总工程师和操作员；这些是有界的同伴工作者。
工人类型正是`deepseek_agent`和`grok_build`；版本2没有
Prime Intellect 集成或运行时依赖性。

稳定插件和 MCP 标识符是 `plumbob-harness-control`。公众
产品名称为**Codex-Co-Engineer**。保持技术标识符稳定
允许在不中断服务器名称的情况下迁移现有 Codex 配置。

## 发布内容

```text
plugins/plumbob-harness-control/   Codex plugin, MCP facade, skill, and tests
plugins/cursor-cloud-control/      Typed Cursor Cloud Agents API v1 control plane
config/                            non-secret configuration examples
docs/                              target, preflight, data, and release policy
examples/                          redacted contract and receipt examples
scripts/                           dependency-free release validation
.github/workflows/                 CI and package checks
```

公共树不包含生成的 DSH 包、模型注册表、
会话日志、提供商凭证或个人 Codex 配置。保留
那些位于单独的私人目录或秘密管理器中的内容。根忽略
策略有意针对 `Secrets/`、本地状态进行故障关闭，并生成
运行时。

## 快速开始

1. 安装 Node.js 24 或更高版本。
2. 使用其上游文档安装和配置 DeepSeek Harness
   使用 DeepSeek 作业。对于 Grok Build，安装官方 CLI 并
   单独验证（`grok login` 或设备验证）； MCP服务器
   从不自动安装/登录或接受 xAI 凭据作为工具
   论据。
3. 克隆此存储库并注册
   `plugins/plumbob-harness-control` 作为本地 Codex 插件。
4. 在MCP服务器中设置提供者凭证和运行时工作空间
   环境。模板位于
   [`config/configuration.example.json`](config/configuration.example.json)。
5. 在调度之前针对确切目标运行 MCP Inspector 预检
   工作。

示例环境（在本地替换占位符；从不提交值）：

```bash
export MODEL_API_KEY='provided-by-your-secret-manager'
export XAI_API_KEY='optional-xai-key-for-grok-cli'
export DSH_HOME='/absolute/path/to/dsh-profile-home'
export CODEX_CO_ENGINEER_RUNTIME_WORKSPACE='/absolute/path/to/default/git-workspace'
export CODEX_CO_ENGINEER_ALLOWED_ROOTS='/absolute/path/to/checkouts'
export CODEX_CO_ENGINEER_STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/codex-co-engineer"
```

`CODEX_CO_ENGINEER_RUNTIME_WORKSPACE` 仅在明确目标时使用
合约选择`mode: "default"`。它不是提示派生的目标权限。
一份工作必须有一份严格的目标合同和绝对的cwd，
预期的 Git 根和 HEAD、允许的路径、角色以及调用者提供的预期
指纹。提示级别`cd`从来不具有权威性，并且无效
显式目标永远不会退回到默认工作区。

对于 Grok Build，服务器直接调用配置的 `grok` 可执行文件
（`CODEX_CO_ENGINEER_GROK_COMMAND` 可以选择管理员批准的二进制文件）
具有类型化模型、会话、推理、沙箱、权限、工具和规则
选项。无头提示使用 `-p`（官方 `--single` 别名）。它默认为
`--no-auto-update`和`streaming-json`；原始argv，
shell 字符串、环境映射、提示文件/提示 JSON 输入、
恢复/工作树/引用控件、调试文件、领导者套接字、登录/更新
命令、代理包、原始输出模式和系统提示覆盖
没有暴露。结构化 JSON 支持有界类型 `json_schema` 输入
输出； ACP (`grok agent stdio`) 已记录，但有意推迟到
它可以保留相同的目标和生命周期保证。

## 联合工程师工具

该插件公开了六个稳定的 MCP 工具：

- `preflight` 证明目标、配置摘要、协议和工具集。
- `status` 报告 DeepSeek、Grok、凭证存在、UI 和最近作业状态。
- `runtime` 启动或停止可选插件拥有的环回 DeepSeek UI。
- `run` 准确调度 `deepseek_agent` 或 `grok_build`。
- `jobs` 列出、检查、等待或光标页面管理的作业。
- `cancel` 取消了一项确切的插件拥有的作业。

每次调度都需要版本控制的目标合约，调用者提供的目标
指纹、稳定的请求 ID 和有限的超时。请参阅
[插件 README](plugins/plumbob-harness-control/README.md#mcp-tool-calls) 用于
完整的调用方式和示例。

## 可靠性合约

在执行之前，MCP 检查员收据必须包括：

- 目标指纹
- 解决了工作空间和cwd
- 配置摘要
- 传输和协议版本
- 服务器身份
- 可用的工具

长时间运行的作业只暴露一个生命周期：

`accepted → started → working → completed | failed | cancelled | timeout`

进度通知是大约每 15 秒一次的有界心跳。
绝对期限不能因进展而延长。客户端重试重用
稳定的请求ID和指纹，防止重复调度
运输是不确定的。超时、取消、协议、工具、进程启动、
客户的失败仍然很明显。

看：

- [`plugins/plumbob-harness-control/README.md`](plugins/plumbob-harness-control/README.md)
- [`plugins/cursor-cloud-control/README.md`](plugins/cursor-cloud-control/README.md)
- [`docs/target-contract.md`](docs/target-contract.md)
- [`docs/preflight-inspector.md`](docs/preflight-inspector.md)
- [`docs/configuration.md`](docs/configuration.md)
- [`docs/data-handling.md`](docs/data-handling.md)
- [`SECURITY.md`](SECURITY.md)

## 发展

```bash
cd plugins/plumbob-harness-control
npm test
cd ../..
cd plugins/cursor-cloud-control
npm test
cd ../..
node scripts/validate-release.mjs
```

测试使用本地设备和临时 Git 存储库。 CI 不得发送
存储库内容或提示给外部模型提供者。

Cursor Cloud Control 仅使用官方 Cursor Cloud Agents API v1 至
MCP 型工具。凭证保留在 MCP 进程环境或
仅限所有者的文件；创建默认为计划模式、新分支、无 PR。