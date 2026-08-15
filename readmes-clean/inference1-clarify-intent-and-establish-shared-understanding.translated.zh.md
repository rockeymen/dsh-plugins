#clarify-intent-and-establish-shared-understanding

## 🚀 快速入门

### 选项 1：请您的代理安装

只需告诉您的代理人：

`Install the clarify-intent-and-establish-shared-understanding skill from https://github.com/Inference1/clarify-intent-and-establish-shared-understanding for this project.`

### 选项 2：使用 `npx skills` 安装

最简单的命令行方法是 [`skills`](https://github.com/vercel-labs/skills) CLI。

**交互式安装**

```bash
npx skills add Inference1/clarify-intent-and-establish-shared-understanding
```

安装程序将让您选择目标代理和安装范围。

**为特定代理安装**

```bash
npx skills add Inference1/clarify-intent-and-establish-shared-understanding -a claude-code
```

将 `claude-code` 替换为所需的代理标识符，例如 `codex`、`cursor`、`github-copilot` 或 `gemini-cli`。

为该代理全局安装：

```bash
npx skills add Inference1/clarify-intent-and-establish-shared-understanding -a claude-code -g
```

**为所有支持的代理安装**

项目级：

```bash
npx skills add Inference1/clarify-intent-and-establish-shared-understanding --all
```

全球：

```bash
npx skills add Inference1/clarify-intent-and-establish-shared-understanding --all -g
```

默认为项目级安装； `-g` / `--global` 使技能可以跨项目使用。

### 选项 3：手动安装

从 GitHub 下载 ZIP 存储库，或克隆它：

```bash
git clone https://github.com/Inference1/clarify-intent-and-establish-shared-understanding.git
```

然后将存储库文件夹复制到代理的**项目级**或**全局**技能目录中。将 `SKILL.md` 保存在 Skill 文件夹中：

```text
<skills-directory>/
└── clarify-intent-and-establish-shared-understanding/
    └── SKILL.md
```

以 Claude Code 为例：

```text
# Project-level
/.claude/skills/clarify-intent-and-establish-shared-understanding/SKILL.md

# Global
~/.claude/skills/clarify-intent-and-establish-shared-understanding/SKILL.md
```

常见的代理地点包括：

### 代理·项目级·全球
- **代理**：Claude Code · **项目级**：`.claude/skills/` · **全球**：`~/.claude/skills/`
- **代理**：Codex · **项目级**：`.agents/skills/` · **全球**：`~/.codex/skills/`
- **代理**：光标 · **项目级**：`.agents/skills/` · **全局**：`~/.cursor/skills/`
- **代理**：GitHub 副驾驶 · **项目级**：`.agents/skills/` · **全球**：`~/.copilot/skills/`
- **代理**：Gemini CLI · **项目级**：`.agents/skills/` · **全球**：`~/.gemini/skills/`

对于其他特工，请使用其记录的技能目录或让 `npx skills add` 自动选择正确的位置。

`skills` CLI 当前将项目范围记录为默认值，`-g/--global` 用于用户范围安装，`-a/--agent` 用于针对特定代理，`--all` 用于将所有发现的技能安装到所有支持的代理。 ([GitHub][2])

[1]：https://github.com/Inference1/clarify-intent-and-establish-shared-understanding“GitHub - 推论1/clarify-intent-and-establish-shared-understanding：系统地阐明意图，挑战假设，解决矛盾，并调整目标、约束、风险和成功标准。·GitHub”
[2]：https://github.com/vercel-labs/skills《GitHub - vercel-labs/skills：开放代理技能工具 - npx技能·GitHub》

## ✨ 简介

人工智能代理经常面临“自主-交互困境”：当用户提供模糊的提示或指令时，高度自主的系统可能会在没有充分交互的情况下长时间运行。因此，他们可能会生成与用户期望大相径庭的深度研究报告，或者对代码进行不当修改。这样的结果不仅会影响任务质量，还会导致不必要的计算资源和时间支出。因此，在自主执行和及时的用户交互之间实现适当的平衡对于提高代理性能至关重要。

**慢思考的价值**在于在代理启动任务执行之前引入一个深思熟虑的 `/clarify-intent-and-establish-shared-understanding` 步骤。通过主动澄清用户意图并建立共同理解，此步骤有助于将代理对任务的解释与用户的预期含义和预期结果保持一致。因此，该机制提供了一种实用且侵入性最小的方法来减轻幻觉并减少特工与人类之间的错位。

**核心洞察**：在复杂的开放世界环境中，通信本身可以作为一种有效的计算形式。代理可能会从扩展交互中受益更多，而不是试图通过不断扩展搜索空间来预测用户的潜在需求。在采取行动之前，他们可以进行多轮对话，以引出并逐步阐明用户意图。这种交互优先的策略可以为**目标锻造、任务执行和代理循环**提供更有效的方法。

## ✅️ 这个技能有什么作用？什么时候触发？

技能 `clarify-intent-and-establish-shared-understanding` 在采取相应行动之前系统地检查和完善用户的计划、决策、目标、策略、建议或想法。其目的是对用户的意图、目标、约束、优先级、假设、依赖性、风险、权衡和可衡量的成功标准建立精确和共同的理解。它通过适应性和逐渐深入的提问来实现这一目标，一次只提出一个高影响力、以决策为中心的问题。在整个过程中，它区分事实、假设、假设和未知；识别矛盾和信息差距；直接验证现有事实；并定期综合新兴的共同理解。

当用户明确请求严格审查时，例如**盘问、挑战、压力测试、交叉询问、红队审查、事前分析或决策审计**，技能就会被触发。该过程一直持续到推理是连贯的、基于现有证据、响应相关约束、通过明确的风险评估提供信息、可操作并得到用户确认为止。

## 💓 为什么有这个技能？

当结果的质量取决于在采取行动之前准确定义问题时，这项技能尤其有价值。它适用于决策、计划、战略、建议和目标设定过程，其中模糊的目标、隐含的假设、相互冲突的约束、证据不足、被忽视的依赖性或不充分的风险评估可能会导致代价高昂的错误。

该技能不是不加批判地接受用户的初始框架，而是通过有针对性和适应性的提问来系统地评估其有效性。该过程形成了对基本目标、优先事项、约束、假设、权衡、风险和成功衡量标准的共同理解。它还将已确定的事实与假设和未解决的不确定性区分开来，识别矛盾，并在可能的情况下直接验证相关信息。通过防止过早采取行动并在早期阶段识别弱点，该过程将模棱两可或支持不足的推理转变为连贯的、基于证据的、约束敏感的和可操作的目标锻造框架。