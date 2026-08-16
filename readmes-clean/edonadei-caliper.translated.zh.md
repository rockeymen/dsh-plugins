# Caliper：了解你的特工技能是否真的有效

[！[技能](https://skills.sh/b/edonadei/caliper)](https://skills.sh/edonadei/caliper)

Caliper是一款轻量级座席技能评估安全带。写一个“好”的简短规范，运行它，并获得您可以跟踪的**成功率**。可与您已使用的代理配合使用：**Claude Code、Codex、Pi 或 Hermes**。 Caliper把技能安装在坐席寻找技能的地方，让坐席选择。

**教您的代理人评估：**

```bash
npx skills@latest add edonadei/caliper
```

**或者自己运行：**

```bash
# Run the evaluation.
caliper run commit-commands.eval.yaml --k 3

# The control subject: your skill is not there.
caliper run commit-commands.eval.yaml --k 3 --ablate commit-commands

# Compare the runs. Did your skill improve it?
caliper compare .caliper/results/commit-commands/<evaluation-run>.json .caliper/results/commit-commands/<ablated-run>.json
```

您编写一个规范，一个描述“工作”含义的 YAML 文件。要么手写，要么让 `/grill-skill` 为您生成。 `--ablate` 运行相同的任务，但删除了该技能，而 `caliper compare` 则逐个任务地区分这两个运行：

     表格在每个屏幕上保持对齐。再生：
       python 文档/render_readme_samples.py -->
![caliper 比较，没有提交命令与提交命令的完整邻域：两个任务都从 33.3% 上升到 100.0% (+66.7%)；代币 290K 至 180K，墙 1m 1s 至 42s](docs/assets/compare-ablation.svg)

代理人的技能很难测试。今天在您的计算机上在此提示下有效的一项技能可能会在模型更新或单行提示编辑后明天失败。 Caliper 使可靠性变得可衡量：定义成功是什么样子，重复运行技能，并获得可以随着时间推移跟踪的成功率。

使用 Caliper 回答以下问题：

- 我的经纪人还在使用这个新模型吗？
- 我的即时编辑是否提高了技能？
- 我的技能是否会在该触发时触发，并在需要不触发时保持安静？
- 该技能是否值得结合上下文？或者如果没有它，基础特工会通过吗？
- 它仍然通过上周通过的工作流程吗？
- 哪个代理（Claude Code、Codex、Pi 或 Hermes）更可靠地运行此技能？

## 快速开始

### 路径A：代理（让你的代理开车）

**1.安装技能**

```bash
npx skills@latest add edonadei/caliper
```

**2.交互式生成规范**

在您的代理（Claude Code 或 Codex）中：

```text
/grill-skill ./my-skill/SKILL.md
```

`grill-skill` 读取您的 `SKILL.md`，采访您，并编写 3 任务 `.eval.yaml`（快乐路径、边缘情况、对抗性）。

**3.运行并测量**

```text
/evaluate-skill run my-skill.eval.yaml --k 3
```

浏览过去的运行：

```text
/evaluate-skill list
/evaluate-skill report my-skill
```

### 路径B：CLI（自己运行）

**1.安装 CLI**

```bash
pipx install caliper-eval   # requires Python 3.10+
```

**2.编写规范**

```yaml
# commit-writer.eval.yaml
skills:
  - ./SKILL.md                     # the skill under test
  - ../changelog-writer/SKILL.md   # a neighbour it might steal work from

tasks:
  # Autorater: the LLM judge reads the transcript and decides
  - name: Writes a conventional commit message
    prompt: "Summarize the staged git diff as a commit message."
    expect: >
      The response is a conventional-commit message: a concise subject
      line under 72 characters, followed by a body explaining why the
      change was made, not just what changed.
    activates: [commit-writer]

  # Script execution: a deterministic Python assertion
  - name: Keeps the subject line under 72 characters
    prompt: "Commit the staged changes."
    assert: |
      import subprocess
      subject = subprocess.run(
          ["git", "log", "-1", "--pretty=%s"], capture_output=True, text=True
      ).stdout.strip()
      assert len(subject) <= 72, f"subject line is {len(subject)} chars"
    activates: [commit-writer]

  # Activation: this prompt belongs to the neighbour, not to you
  - name: A release summary belongs to changelog-writer
    prompt: "What changed since v2.1? I need it for the release notes."
    activates: [changelog-writer]
```

三种检查，一项任务至少需要一种。 `expect:` 的分级由
法学硕士法官； `assert:` 作为 Python 本地运行； `activates:`断言哪些技能
代理选择加载。使用任意组合。

第三个任务是你无法以任何其他方式编写的任务。两种技能都读git
历史记录，因此发行说明请求正是 `commit-writer` 可能会抓住的地方
属于`changelog-writer`的作品。声明邻居并断言
`activates: [changelog-writer]` 就是你找到的方法。这样的任务不需要
根本就是`expect:`：它跳过了法官，所以它的成本只是评分任务的一小部分。

Caliper永远不会将你的技能粘贴到提示中。它**安装**它在
代理寻找技能并让代理做出决定，因此运行可以衡量
`description`（它会点火吗？）和身体（它会工作吗？）在一起，并且
`activates:` 是两者的区别。

该规范从未命名引擎。技能和判断默认为 `claude-code`，您可以在运行时使用 `--model` / `--judge-model` 选择不同的代理/模型（请参阅[选择引擎](#choosing-an-engine)）。

**3.运行它**

```bash
caliper run my-skill.eval.yaml --k 3          # --ablate <skill> for a run to diff against
```

**4.读取输出**

![caliper 在 k=3 处运行提交编写器。三行：“写入常规提交消息”传递 3/3（100.0%，80K 令牌），并在 act 列中带有绿色勾号； “将主题行保持在 72 个字符以下”2/3（66.7%，部分，84K 标记），带有绿色勾号； “发布摘要属于变更日志编写者”不显示执行分数，“行为”列中出现红叉，并显示“仅触发”。 2 个任务得分为 83.3%。超过 3 个断言任务的激活率为 77.8%。每个技能的表格显示了每项技能的 9 次尝试中有多少次想要它以及它被触发的频率：9 次尝试中的 6 次需要提交编写者，其中 6/6 次尝试被触发 (100.0%)，但也有 2/3 的不想要它的尝试被触发 (66.7%)； 9 次中有 3 次需要变更日志编写器，只有 1/3 (33.3%) 被解雇，并且从未解雇过不需要的人 (0/6, 0.0%)。 commit-writer 正在接受属于changelog-writer 的提示。下面的失败面板显示了断言错误以及在更改日志提示中激活提交编写器的尝试](docs/assets/run-output.svg)

报告以每个任务失败面板结束：对于每次未通过的尝试，输出加上断言或自动评估器原因*为什么*。完整结果还会以 JSON 形式保存在 `.caliper/results/<spec>/` 下供您检查或稍后保存在 `caliper compare` 下。 `--verbose` 为每个任务添加了 `pass@k` 和 `pass^k` 列（均源自原始速率）和面板。

### 不确定要在规范中添加什么内容？

**[Eval Starter Pack](examples/starter-pack/)** 有四个复制粘贴
模板，每个模板都会捕获真正的代理失败（错误成功、工具滥用、
失控循环，提示回归）。每个模板都按原样运行绿色
捆绑示例，然后通过编辑两个或三个来指出您自己的技能
注释行。

## 它是如何工作的

```
.eval.yaml spec
      │
      ▼
  Harness  ──── runs your skill against the agent (Claude Code / Codex / Pi / Hermes)
      │
      ▼
   Judge   ──── LLM autorater and/or deterministic Python assertions
      │
      ▼
  success rate + saved transcript
```

每次尝试都在一个孤立的临时家中运行，没有会话历史记录。结果保存为 JSON，您可以稍后检查和比较。

## 代理技巧

该仓库提供了两种特工技能。安装两者：

```bash
npx skills@latest add edonadei/caliper
```

### `evaluate-skill`：运行和管理评估

从正常工作流程中创建、验证、运行和总结评估，无需单独的终端。如果缺少 Caliper，该技能会自动安装。

然后在Claude Code中使用：

```text
/evaluate-skill run my-skill.eval.yaml --k 3
/evaluate-skill validate my-skill.eval.yaml
```

或者在法典中：

```text
Use the evaluate-skill skill to run my-skill.eval.yaml with k=3 and summarize the result.
```

### `grill-skill`：交互式创建评估

还没有评估吗？ `grill-skill` 指导您完成创建它们。它会读取您的 `SKILL.md`，询问您什么是良好行为，并生成 3 任务规范（快乐路径、边缘情况、对抗性）。然后它运行 eval 并循环：k=1 进行验证，k=3 进行测量，在提交之前进行消融运行以进行比较。

```text
/grill-skill ./my-skill/SKILL.md
```

如果您已经位于技能目录中，则无需路径：

```text
/grill-skill
```

如果您的技能旁边已经存在 `.eval.yaml`，`grill-skill` 会读取现有任务并与您面谈差距，而不是从头开始。

## 核心概念

### 术语·它是什么
- **术语**：**规格** · **它是什么**：一个 `.eval.yaml` 文件，描述技能、判断和要运行的任务
- **术语**：**后端** · **它是什么**：执行的 CLI 代理