# 琥珀协议

![琥珀协议](./assets/readme/amber-protocol-banner.png)

**状态：** 稳定 | **版本：** 1.6.0 · [里程碑和测试状态→](./ROADMAP.md)

**使人工智能编码会话可审查、门控且准备好交接。**

[入门](./docs/user-guide/getting-started.md) · [CLI参考](./docs/CLI_REFERENCE.md) · [治理模型](./docs/architecture/governance-model.md) · [dsh](./dsh/README.md) · [示例](./docs/examples/README.md) · [路线图](./ROADMAP.md)]

## 什么是琥珀？

Amber 协议是人工智能辅助工程的存储库本地治理层。当团队让人工智能代理在存储库中工作时，困难的部分不再只是编写代码。困难的部分是知道做了什么、保存是否安全、如何移交以及如何证明它经过了审查。

Amber 使这些部分变得明确：它准备面向代理的上下文，记录批准和关卡，通过只读检查验证状态，并生成移交和审计工件作为存储库中的文件。

这是故意保守的。 Amber 创建审核工件、试运行计划和批准记录。它**不**运行动态工作流程、调用实时子代理、执行项目的命令或重写现有文档。

## 为什么是琥珀色？

当工作流程留下可检查的证据时，人工智能编码工作变得更容易信任：

- **默认情况下可审阅：** 计划、门、账本和交接位于存储库中，而不是聊天记录中。
- **先试运行：** 设置、审核、路由和循环命令在更改状态之前公开意图。
- **人为控制保持明确：**批准是审阅者可以检查的记录，而不是隐藏的运行时假设。
- **代理上下文是本地的：** `AGENTS.md`、wiki 文件、功能计划和会话切换随代码库一起移动。

## 生命周期图

```text
audit -> init -> governance report -> next -> plan -> gate -> verify -> approve -> handoff bundle -> handoff validate
```

### 阶段 · 命令 · 你会得到什么
- **阶段**：检查 · **命令**：`amber audit --target <repo> --summary` · **您得到什么**：只读准备情况调查结果
- **阶段**：安装 · **命令**：`amber init --target <repo>` · **您将得到什么**：不覆盖的启动器治理文件
- **阶段**：分数 · **命令**：`amber governance report --target <repo>` · **你得到什么**：准备情况分数、风险和结构化的下一步行动
- **阶段**：有效性 · **命令**：`amber workflow assess --target <repo>` · **您得到什么**：工作流程有效性维度（与准备情况分开；ADR-0008）
- **阶段**：计划 · **命令**：`amber plan --target <repo> --feature F001 --title "..."` · **您得到什么**：功能计划和审查界面
- **阶段**：门 · **命令**：`amber next --target <repo>` · **你得到什么**：下一个安全生命周期命令
- **阶段**：验证 · **命令**：`amber doctor --target <repo>` · **您得到的**：检查所需的面向代理的表面
- **阶段**：上下文·**命令**：`amber context request --target <repo> --page `·**您得到什么**：合同驱动的蒸馏：将会话证据转化为来源支持的知识页面（ADR-0009）
- **阶段**：交接 · **命令**：`amber handoff bundle --target <repo>` · **您得到什么**：另一个人或代理可以继续的便携式延续包

## 存储库工件

Amber 旨在作为文件进行检查：

```text
AGENTS.md
CLAUDE.md
feature_list.json
PROGRESS.md
session-handoff.md
clean-state-checklist.md
docs/wiki/
.workflow/continuous-improvement/state.json
```

## 安装

### 来自 npm （推荐）

```bash
npm install -g amber-protocol
amber --version
```

### 来自来源

```bash
git clone https://github.com/Bandersnatch0x/amber-protocol.git
cd amber-protocol
npm install
node scripts/amber.js --version
```

### 来自 GitHub 套件

Amber Protocol 也作为 GitHub Packages 上的范围包发布
（`@bandersnatch0x/amber-protocol`）。消耗它需要一次性`.npmrc`
设置：

```bash
# 1. Create a GitHub PAT with read:packages scope at https://github.com/settings/tokens

# 2. Copy the template and replace the token
cp .github/npmrc-github-packages .npmrc
# Edit .npmrc: replace ${GITHUB_TOKEN} with your PAT

# 3. Install
npm install -g @bandersnatch0x/amber-protocol
amber --version
```

其他 `@bandersnatch0x/*` 包（如果有作为依赖项添加）也将
自动从 GitHub 包解析。

对于 CI（GitHub 操作），`secrets.GITHUB_TOKEN` 自动可用 —
发布工作流程 (`.github/workflows/publish-github-packages.yml`) 构建
`.npmrc` 飞行中。

## 与DeepSeek Harness一起使用

Amber 列在官方 [`dsh-plugin`](https://github.com/topics/dsh-plugin) 主题下。将其作为本机 dsh 捆绑包安装 - 无需手动路径编辑：

```bash
# Install once; dsh adds the Amber bundle layer to your profile
dsh plugin --profile web add dsh-amber-protocol

# Ordinary startup loads Amber after install (no repeated --patch flag)
dsh --profile web
```

在 Windows 上，默认端口 `3080` 通常被保留 - 如果侦听失败，则传递 `--port 13080`。

**未发布的签出后备：** 如果您正在开发 Amber 本身并且捆绑包尚未发布，请改用覆盖补丁。编辑 `dsh/amber-full.patch.yml`，用此结帐替换 `/path/to/amber-protocol`，然后覆盖而不更改您的个人资料：

```bash
dsh --profile web --patch /path/to/amber-protocol/dsh/amber-full.patch.yml
```

完整捆绑包和覆盖说明：[dsh/README.md](./dsh/README.md)。

## 快速入门

将 Amber 放入现有存储库并生成一个可供切换的交付包：

```bash
# 1. Read-only audit of the target repo (changes nothing)
amber audit --target my-project --summary

# 2. Install Amber starter files (skips anything that already exists)
amber init --target my-project

# 3. Verify the repo now has the expected agent-facing surfaces
amber doctor --target my-project

# 4. Score the delivery loop and risks
amber governance report --target my-project

# 5. Ask Amber what to do next: it reads live state and prints one command
amber next --target my-project

# 6. Produce and validate the portable handoff bundle
amber handoff bundle --target my-project
amber handoff validate --target my-project
```

`init` 和 `wiki` 永远不会覆盖现有文件。默认帮助显示旅程和核心治理命令； `amber --all`展示了完整的兼容面。请参阅 [CLI 参考](./docs/CLI_REFERENCE.md)。

### `amber governance report` - 准备得分和下一步行动

`amber governance report` 是主要产品循环报告。它对治理、证据、
连续性、安全性和维护；指出风险；并发出准确的结构化下一步行动
命令和预期结果。

```bash
amber governance report --target .
amber governance report --target . --output docs/quality/amber-governance-report.md --confirm
```

### `amber workflow` — 工作流程有效性 (ADR-0008)

`amber workflow` 是与治理准备情况**独立的**只读评估。得了五分
琥珀色维度（上下文充分性、生命周期规则、验证覆盖范围、交付完整性、
来自存储库证据和可选会话观察的改进循环）。诊断转至
**标准错误**； stdout 保持解析器安全的 JSON（或 Markdown）。永远不会合并到准备情况的总体分数中。

```bash
# Assess the target (stdout JSON; sessions included by default)
amber workflow assess --target .
amber workflow assess --target . --format markdown
amber workflow assess --target . --output-dir .amber/workflow-reports
amber workflow assess --target . --no-sessions

# Operate on a saved report
amber workflow findings --target . --report path/to/report.json
amber workflow plan --target . --report path/to/report.json --finding ca-1-feature-observable
amber workflow compare --target . --baseline path/to/old.json --current path/to/new.json
```

`plan` 仅进行空运行（计划输入或维护建议草案）。仅`assess`接受
`--output-dir`。完整标志列表：[CLI 参考 — 工作流程命令](./docs/CLI_REFERENCE.md#workflow-commands)。

### `amber learnings` — 接受后知识检查点

在 `amber accept` 之后，`amber learnings` 检查（只读）已接受的作品是否达到强制要求
知识回写触发器 - 模式、合约或基础路径 - 和 `--reviewed` 预订审核
在功能条目上。琥珀色检测并提醒；回写本身由操作员保留。

```bash
amber learnings --target . --feature F001                          # inspect triggers read-only
amber learnings --target . --feature F001 --reviewed --surface docs/specs/f001.md
```

### `amber handoff bundle`-随身续神器

`amber handoff bundle` 编写完整的交接目录，其中包含会话摘要、验证
证据、风险、下一步行动、恢复命令和清单。 `handoff validate` 检查
在另一个人或代理继续之前，捆绑已完成。

````bash
安布