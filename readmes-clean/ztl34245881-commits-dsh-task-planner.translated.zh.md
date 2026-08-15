#dsh-task-planner

**体验肌肉记忆** [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) 的任务规划。

给出任务 → 代理回忆**过去的类似解决方案**（条件反射），评估它们是否适合，并生成与其功能相匹配的动态计划 - **绝不是硬编码组合**。每个计划都会自动起草一个教训进入经验库；当任务结束时，代理会更新结果。你工作得越多，反应就越聪明。

## 特点

- 🧠 **经验库** (`task_memory save/recall/list`)：带有签名关键字的普通 Markdown 持续课程。 Recall 使用 2-3 个字符的滑动窗口分词器，因此“每周报告”仍然符合“每日报告”课程。
- ⚡ **条件反射计划** (`plan_task`)：回忆 → LLM 评估适合性（重用和改进，或解释为什么不进行更新）→ 具有能力匹配的分解步骤 → 风险 → 下一步行动。
- 🤖 **LLM 驱动，而不是规则驱动**：模型决定每个任务使用什么；该插件仅提供上下文（过去的经验+可选的功能目录）。
- ✍️ **De-AI 可交付标准**：任何文本输出步骤（文档/表格/幻灯片/副本/脚本）必须在交付前包含人性化然后审查的过程。
- 🗂️ **自动坚持**：`plan_task` 自动起草课程（状态：`draft`）；代理将其标记为 `verified`，结果处于循环关闭状态。
- 🔒 **零键，零绝对路径**：一切都是可配置的；经验库默认位于`~/.dsh/planner-lessons`。

## 安装

```sh
dsh plugin --profile web add github:<your-user>/dsh-task-planner
```

或者复制存储库并将其添加为本地包：

```sh
dsh plugin --profile web add /path/to/dsh-task-planner
```

## 配置（可选，在您的个人资料的 `cordis.patch.yml` 中）

```yaml
- id: dsh-task-planner
  name: dsh-task-planner
  config:
    lessonsDir: /path/to/your/lessons   # default: ~/.dsh/planner-lessons
    capabilityFile: /path/to/capability-map.md  # optional catalog fed to the LLM
```

将 `capabilityFile` 指向您的技能/插件的降价目录（例如很棒的列表），`plan_task` 将匹配它的每个步骤。

## 用法

- `plan_task { task, goal?, constraints? }` — 在开始复杂的工作之前做好计划。
- `task_memory save { task, plan, outcome }` — 坚持一堂课（由草稿的 plan_task 自动调用）。
- `task_memory recall { task }` — 条件反射查找。
- `task_memory list` — 显示所有课程。

### 课程生命周期

1、`plan_task`自动写草稿课（`status: draft`）。
2. 当任务关闭时，代理会使用结果 (`status: verified`) 更新它。
3. 课程成功重复使用3× → 升级为正式技能。课程被拒绝 2× → 标记为过时。

## 注释

- 需要 `llm`、`shell`、`tools` 服务（全部存在于标准线束中）。
- 模型调用使用线束默认模型（`agentDefaultModel`）；推理模型需要慷慨的`maxTokens`（内部使用8k）。
- 课程是简单的 Markdown — 人工可编辑、可 grep 、可移植。