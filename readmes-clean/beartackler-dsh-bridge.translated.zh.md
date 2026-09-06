```
██████╗ ███████╗██╗  ██╗  ██████╗ ██████╗ ██╗██████╗  ██████╗ ███████╗
██╔══██╗██╔════╝██║  ██║  ██╔══██╗██╔══██╗██║██╔══██╗██╔════╝ ██╔════╝
██║  ██║███████╗███████║  ██████╔╝██████╔╝██║██║  ██║██║  ███╗█████╗
██║  ██║╚════██║██╔══██║  ██╔══██╗██╔══██╗██║██║  ██║██║   ██║██╔══╝
██████╔╝███████║██║  ██║  ██████╔╝██║  ██║██║██████╔╝╚██████╔╝███████╗
╚═════╝ ╚══════╝╚═╝  ╚═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝  ╚═════╝ ╚══════╝
```

**熟悉 DeepSeek Harness 的线束命令，首先审核每个插件。**

![dsh-bridge 连接器流程：凭证检测解析为屏蔽检测矩阵，然后是 @liustack/modlens 的信任报告卡，显示 B 级文件和行证据。](site/demo/connect-demo.gif)

根据规格渲染，而不是根据运行版本渲染。剧照：
[检测矩阵](site/demo/connect-matrix-dark.png)（[光](site/demo/connect-matrix-light.png)]）·
[信任卡](site/demo/trust-card-dark.png)（[light](site/demo/trust-card-light.png)）。

## 什么

dsh-bridge 是一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件，适用于来自 Claude Code、Codex CLI、OpenCode 或 Jcode 的人员。它将您已经知道的斜线命令移植到 DSH 原生接缝上，添加引导连接器流程，并拒绝推荐社区插件，直到对抗性评论对其进行评分。

## 为什么

- **语言。** DSH 插件生态系统偏向非英语。这里的目录和命令界面是英语优先的。
- **信任。** 插件是任意代码。每项建议都会附有一份报告卡，其中引用了您可以重新检查的文件和行证据。
- **肌肉记忆。** `/model`、`/resume`、`/memory`、`/mcp`、`/review` 的行为方式与您以前的安全带教您的方式相同。

## 安装

路径上需要 [pnpm](https://pnpm.io) 10 或更高版本（`dsh plugin` 通过它管理配置文件依赖项）。

```bash
dsh plugin --profile web add github:beartackler/dsh-bridge
```

该存储库提供了编译后的 `dist/` 输出，因此安装时不会在您的计算机上构建任何内容，并且 dsh 不需要构建脚本权限。为了确保以后的推送不会默默地更改运行的内容，请固定提交：

```bash
dsh plugin --profile web add "github:beartackler/dsh-bridge#<commit-sha>"
```

然后启动并在DSH内部使用`/bridge-help`：

```bash
dsh --profile web        # serves http://127.0.0.1:3080
```

已针对 `@deepseek-ai/dsh` 0.1.1-rc.2 进行验证：从 git checkout 进行的全新安装会激活捆绑包，不会出现任何警告，并且所有 17 个命令都会注册（[这是如何验证的 ](docs/research/live-mount-report.md)）。

## 验证目录

[docs/catalog/INDEX.md](docs/catalog/INDEX.md) 列出了已完成信任审核的每个插件，以及经过审核的提交和链接的报告卡。

等级： **A** 经验证干净 · **B** 安全，有记录的行为 · **C** 使用时有意识 · **D** 有风险 · **F** 请勿安装。等级是对一项固定提交的有证据支持的意见，而不是安全保证。

![@liustack/modlens 的信任报告卡：B 级，具有主题提交、sha512 完整性、npm 证明、MIT 许可证以及网络、执行、遥测、凭证和文件系统写入的每项功能调查结果。](site/demo/trust-card-dark.png)

## 命令

所有 17 个命令均根据 `@deepseek-ai/dsh` 0.1.1-rc.2 进行端到端实施和验证（42 个实时调用，请参阅[验证报告](docs/research/e2e-verification.md)]）。

### 命令·执行
- **命令**：[`/help`](docs/specs/commands/help.md) · **执行**：列出桥接表面和每个命令的 DSH 本地等效项。
- **命令**：[`/init`](docs/specs/commands/init.md) · **执行**：载入存储库并生成其指令文件。
- **命令**：[`/connect`](docs/specs/commands/connect.md) · **执行**：检测现有的提供商凭据，配置路由，对其进行冒烟测试。
- **命令**：[`/model`](docs/specs/commands/model.md) · **执行**：切换活动模型或路线，无需编辑配置文件 YAML。
- **命令**：[`/status`](docs/specs/commands/status.md) · **执行**：报告已知的会话、配置文件和路由状态。探测不到任何东西。
- **命令**：[`/doctor`](docs/specs/commands/doctor.md) · **执行**：运行环境运行状况检查并仅打印实际观察到的内容。
- **命令**：[`/memory`](docs/specs/commands/memory.md) · **执行**：读取和编辑持久用户和项目内存。
- **命令**：[`/compact`](docs/specs/commands/compact.md) · **执行**：按需压缩对话上下文。
- **命令**：[`/resume`](docs/specs/commands/resume.md) · **执行**：选择最近的会话来恢复或分叉。
- **命令**：[`/review`](docs/specs/commands/review.md) · **执行**：审查工作树或拉取请求更改。
- **命令**：[`/improve`](docs/specs/commands/improve.md) · **执行**：对选定的代码提出并应用有针对性的改进。
- **命令**：[`/mcp`](docs/specs/commands/mcp.md) · **执行**：添加、检查和删除 MCP 服务器。
- **命令**：[`/browse`](docs/specs/commands/browse.md) · **执行**：使用等级和信任过滤器浏览经过验证的目录。
- **命令**：[`/trust`](docs/specs/commands/trust.md) · **执行**：打印插件的信任报告卡及其证据。
- **命令**：[`/install`](docs/specs/commands/install.md) · **执行**：安装插件，首选经过验证的版本并需要明确的风险同意。
- **命令**：[`/suggest`](docs/specs/commands/suggest.md) · **执行**：处理死胡同：搭建尚不存在的插件。
- **命令**：[`/refactor`](docs/specs/commands/refactor.md) · **执行**：计划并应用行为保留重组，测试绿色门控。

命名警告：交付的名称将是 `/bridge:<name>` 或 `/bridge-<name>`，等待开放的 DSH 解析器问题。

## 文档

- [Architecture](docs/architecture.md) — 插件如何位于 Cordis 内核上。
- [信任管道](docs/trust/pipeline-architecture.md) - 分级范围、启发式、出处检查。
- [命令规范](docs/specs/commands) · [插件作者指南](docs/plugin-author-guide.md) · [词汇表](docs/glossary.md) · [FAQ](docs/faq.md)]
- [宪章](CHARTER.md) · [贡献](CONTRIBUTING.md) · [安全](SECURITY.md) · [路线图](ROADMAP.md)

## 状态

正在积极开发中。研究和审计工件在生成时落在 `docs/` 中。

### 里程碑·状态
- **里程碑**：能力研究 · **状态**：正在进行中
- **里程碑**：DSH 内置程序的对抗性审计 · **状态**：正在进行中
- **里程碑**：MVP 插件（命令、连接器） · **状态**：已发货 - 在 dsh 0.1.1-rc.2 中经过 e2e 验证的 17 个命令
- **里程碑**：信任报告卡管道 · **状态**：已发货 - 24 个插件分级（7 B、16 C、1 D）
- **里程碑**：入门向导 UI · **状态**：计划中

## 原则

1. 信任胜过速度。每项安全声明都会引用证据。
2. 英语优先，国际化。
3. 最少的代码。最短的正确实现，没有推测功能。
4. 你拥有你的机器。如果没有选择加入，则无法进行遥测。

## 出处

按设计进行交叉审查：对抗性审查是由未编写正在审查的工件的模型执行的。质量门记录在 CONTRIBUTING.md 中。

不隶属于 DeepSeek。怀着感激之情建立在麻省理工学院许可的基础之上。