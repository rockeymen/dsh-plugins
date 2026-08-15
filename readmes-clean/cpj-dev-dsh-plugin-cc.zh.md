# dsh-plugin-cc

一个连接 Claude Code 与 **DeepSeek Harness**（`dsh`）的插件市场项目。它提供代码审查、对抗式设计评审、任务委派、后台运行，以及可恢复的多轮 dsh 会话。

本项目基于 [`@deepseek-ai/dsh@0.1.0-rc.6`](https://www.npmjs.com/package/@deepseek-ai/dsh) 开发（开发者预览；本插件需要的 SDK JSON-RPC server 已单独发布为 [`@deepseek-ai/dsh-sdk-jsonrpc-server`](https://www.npmjs.com/package/@deepseek-ai/dsh-sdk-jsonrpc-server)，不在 CLI 依赖闭包里）。依赖的具体行为记录在 [DSH 兼容性契约](docs/dsh-compat.md) 中；升级 dsh 前必须重新验证。

> 英文文档是技术事实的权威版本。中文文档覆盖安装、命令、排障、贡献和安全流程；命令名、参数、环境变量、路径和 JSON 字段保持英文，以确保兼容性。

## 快速开始

插件命令需要 Node >= 20 和 `DEEPSEEK_API_KEY`。通过 `/dsh:setup` 安装 dsh 还需要 Node >= 22.19（Harness 下限）、`npm`，以及 `pnpm`（`corepack enable`），因为 `dsh plugin add` 会转发给 pnpm。

```bash
# 1. 安装插件
/plugin marketplace add cpj-dev/dsh-plugin-cc
/plugin install dsh@deepseek-dsh

# 2. 首次执行一键安装
#    从 npm 安装 @deepseek-ai/dsh@0.1.0-rc.6，并把 SDK JSON-RPC server
#    （及其 peers）加入多轮 cc profile
/dsh:setup

# 3. 在任意 Git 仓库中检查并审查
/dsh:check
/dsh:review
```

已有**已构建**的 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 源码目录时，可运行 `/dsh:setup --harness `（目录必须已经执行过 `pnpm install` 和 `pnpm run build:lib`）。之后再跑无参数的 `/dsh:setup` 会迁移到 npm pin；要继续用源码目录需再次传入 `--harness`。已有可执行的 `dsh` 时，可通过 `DSH_BINARY` 指定；普通 `/dsh:setup` 仍会从固定版本的 npm 包装入 `cc` profile。卸载：删除插件、插件数据目录（npm prefix 在其中）以及 `~/.dsh/profiles/cc`。

## 命令

### 命令 · 作用 · 是否需要 setup
- **命令**: `/dsh:check` · **作用**: 检查 dsh、npm pin / 源码检出、凭据、profile 和 broker · **是否需要 setup**: 否
- **命令**: `/dsh:setup` · **作用**: 安装/链接固定版本的 npm CLI（或 `--harness <已构建源码目录>`），并创建多轮 `cc` profile · **是否需要 setup**: —
- **命令**: `/dsh:review [focus]` · **作用**: 以只读模式审查本地改动 · **是否需要 setup**: 否
- **命令**: `/dsh:critique [focus]` · **作用**: 执行结构化对抗式设计评审 · **是否需要 setup**: 否
- **命令**: `/dsh:run <task>` · **作用**: 执行一次性或可恢复任务 · **是否需要 setup**: `--session`/`--resume` 需要
- **命令**: `/dsh:delegate <task>` · **作用**: 在后台委派任务 · **是否需要 setup**: 否
- **命令**: `/dsh:import` · **作用**: 将当前对话摘要导入可恢复会话 · **是否需要 setup**: 是
- **命令**: `/dsh:runs [id]` · **作用**: 列出运行或查看状态 · **是否需要 setup**: 否
- **命令**: `/dsh:show [id]` · **作用**: 查看已完成运行的结果 · **是否需要 setup**: 否
- **命令**: `/dsh:stop [id]` / `--broker` · **作用**: 停止运行进程树或共享 broker · **是否需要 setup**: 否

完整参数见[中文命令参考](docs/zh-CN/commands.md)，安装和运行问题见[中文排障指南](docs/zh-CN/troubleshooting.md)。

## 文档

- [中文文档索引](docs/zh-CN/README.md)
- [英文完整文档索引](docs/README.md)
- [架构设计（英文）](docs/architecture.md)
- [DSH 兼容性契约（英文）](docs/dsh-compat.md)
- [开发与测试（英文）](docs/development.md)

## 已知限制

- 不支持运行中的交互式审批；权限在启动前通过 `--write` 确定。
- 只有 broker 支持的运行（`--session`、`--resume`、`/dsh:import`）可恢复，而且会话仅在对应 broker 进程存活期间有效。
- DSH SDK 没有单轮取消接口；停止 broker 中的任务会终止 broker，并丢失该工作区的内存会话。
- `/dsh:import` 导入的是压缩文本摘要，不是原生历史回放。
- v1 仅支持 POSIX 系统，不支持 Windows。

## 社区与支持

- 提交变更前阅读[贡献指南](CONTRIBUTING.zh-CN.md)。
- 使用[支持说明](SUPPORT.zh-CN.md)确认支持范围和求助渠道。
- 安全漏洞必须按[安全策略](SECURITY.zh-CN.md)私下报告。
- 参与社区即表示同意遵守[行为准则](CODE_OF_CONDUCT.zh-CN.md)。

## 许可证

本项目采用 MIT 许可证，见 [LICENSE](LICENSE)。设计来源说明见 [NOTICE](NOTICE)；法律文本仅以英文原文为准。