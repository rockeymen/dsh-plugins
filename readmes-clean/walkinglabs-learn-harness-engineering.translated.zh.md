# 学习线束工程

基于项目的课程，介绍如何构建使 AI 编码代理可靠工作的环境、状态管理、验证和控制机制。

> 🌍 本课程提供 **15 种语言**：英语、简体中文、繁体中文、日本语、한국어、西班牙语、法语、Русский、德语、巴利语、Tiếng Việt、O´zbekcha、Türkçe、葡萄牙语（巴西）、 Українська。从上面的徽章中选择您的语言。

## 🆕 新消息 — 2026 年 8 月

**图形工程更新 - 1 个新讲座，1 个新项目**

### 什么·详细信息
- **内容**：**第 14 讲** · **详细信息**：[从单循环到图工程](docs/en/lectures/lecture-14-graph-engineering/index.md) — 为什么单个循环会成长为图：四个堆叠层（提示 → 上下文 → 循环 → 图）以及线束在该堆栈中的位置、图的四个部分（节点、边、共享状态、路由）、为什么环内检查点无法大规模修复三个结构性故障（Goodhart、向上盲目性、冲突）、与框架无关的六步演练，用于构建您的第一个图形、图形与工作流程、锚点、名称之前存在哪些开源“图形工程”项目与名称之后、编排税以及何时真正值得绘制图形。
- **内容**：**项目 08** · **详细信息**：[将您的工作流程绘制为 Graph](docs/en/projects/project-08-graph-engineering-first-graph/index.md) — 三个渐进实验：将您的制造商检查器循环绘制为显式图，添加并行扇出/扇入节点，然后添加条件回滚边缘和人工批准节点。

**关键思想：** 循环是具有一个节点的图。当你的任务需要专业化、并行性、共享状态、验证和恢复时——它就不再是一个循环。这是一个图表。

## 🆕 新消息 — 2026 年 7 月

**循环工程更新 - 1 个新讲座，1 个新项目**

### 什么·详细信息
- **内容**：**第 13 讲** · **详细信息**：[为什么您需要停止提示您的代理](docs/en/lectures/lecture-13-loop-engineering/index.md) — 从 `/goal` 到循环工程的六个基元（自动化、工作树、技能、连接器、子代理、外部状态）、生成器/评估器分割、四个静默成本以及构建第一个循环的分步指南。
- **内容**：**项目 07** · **详细信息**：[构建您的第一个自动循环](docs/en/projects/project-07-loop-engineering-first-loop/index.md) — 三个渐进实验：目标循环、计时器循环和制造者检查器循环。比较手动与自动，衡量干预减少情况，并学会跳出循环。
- **内容**：**代码模板** · **详细信息**：`goal-template.md`、`loop-state-template.md`、`maker-prompt.md`、`checker-prompt.md` — 用于立即构建循环的嵌入式模板。
- **内容**：**所有 15 种语言** · **详细信息**：所有支持语言的完整翻译覆盖范围。

**关键思想：** 线束工程制造车辆。环路工程设计其行驶的道路，而您则从汽车外部设计道路。

Learn Harness Engineering 是一门致力于人工智能编码代理工程的课程。我们深入研究并综合了行业内最先进的线束工程理论和实践。我们的核心参考包括：

- [OpenAI：利用工程：在代理优先的世界中利用 Codex](https://openai.com/index/harness-engineering/)
- [Anthropic：长期运行特工的有效安全带](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic：用于长期运行的应用程序开发的线束设计](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [真棒线束工程](https://github.com/walkinglabs/awesome-harness-engineering)

> **快速入门？** [`skills/harness-creator/`](./skills/harness-creator/) 技能可以帮助您在几分钟内为您自己的项目构建生产级工具（AGENTS.md、功能列表、init.sh、验证工作流程）。

## ✨ 视觉预览

### 🏠 课程主页
> 全面的课程大纲和核心理念介绍，提供清晰的入门路径。

![课程主页预览](./docs/public/screenshots/readme/en-home.png)

### 📖 沉浸式讲座
> 深入研究现实世界的痛点和实践项目（如项目 01），以获得身临其境的学习体验。

![课程讲座预览](./docs/public/screenshots/readme/en-lecture-01.png)

### 🗂️ 即用型资源库
> 模板和参考配置旨在解决多回合 AI 代理开发中的常见陷阱，例如上下文丢失和过早完成任务。

![资源库预览](./docs/public/screenshots/readme/en-resources.png)

## PDF 教材

该存储库现在包含课程内容的 PDF 构建管道。

- 运行`npm run pdf:build`在本地生成当前配置的PDF课本。
- 输出文件写入`artifacts/pdfs/`。
- 如果您想刷新 README 预览图像，请运行 `npm run screenshots:readme`。
- GitHub 操作工作流程 [`release-course-pdfs.yml`](./.github/workflows/release-course-pdfs.yml) 可以构建 PDF 并将其发布到 GitHub 版本。

## 模型很智能，线束使其可靠

大多数人都通过艰难的方式了解到一个残酷的事实：**如果您不围绕它构建适当的环境，世界上最强大的模型仍然会在实际工程任务中失败。**

您可能自己见过这个。您在存储库中为 Claude 或 GPT 分配了一项任务。它开始得很好——读取文件，编写代码，看起来很有成效。然后出了问题。它跳过了一步。它破坏了测试。它说“完成”，但实际上没有任何作用。你花在清理上的时间比你自己清理的时间要多。

这不是模型问题。是线束问题。

证据很清楚。 Anthropic 进行了一项对照实验：相同的模型（Opus 4.5），相同的提示（“构建 2D 复古游戏编辑器”）。在没有安全带的情况下，它在 20 分钟内花费了 9 美元，但生产出来的东西却不起作用。借助完整的工具（规划器 + 生成器 + 评估器），它在 6 小时内花费了 200 美元，构建了一款您可以实际玩的游戏。模型没有改变。安全带做到了。

OpenAI 在 Codex 中报告了同样的情况：在一个精心利用的存储库中，相同的模型从“不可靠”变为“可靠”。不是边际进步，而是质的转变。

**本课程教您如何构建该环境。**

````文本
                    背带图案
                    ===================

您--> 给出任务--> 代理读取线束文件--> 代理执行
                                                        |
                                              安全带控制着每一步：
                                              |
                                              +--> 说明：做什么，按什么顺序
                                              +--> 范围：一次一项功能，不得超出范围
                                              +--> 状态：进度日志、功能列表、git 历史记录
                                              +--> 验证：测试、lint、类型检查、冒烟
                                              +--> 生命周期：开始时初始化，结束时清理状态
                                              |
                                              v
                                         代理仅在以下情况下停止
                                         验证通过
```

## What Harness Engineering Actually Means

Harness engineering is about building a complete working environment around the model so it produces reliable results. It's not about writing better prompts. It's about designing the system the model operates inside.

A harness has five subsystems:

```文字
    ┌──────────────────────────────────────────────────────────────┐
    │ 安全带 │
    │ │
    │ ┌────────────┐ ┐──────────────┐ ┌──────────────────┐ │
    │ │ 使用说明 │ │ 状态 │ │ 验证 │ │
    │ │ │ │ │ │ │ │
    │ │ AGENTS.md │ │ Progress.md │ │ 测试 + lint │ │
    │ │ CLAUDE.md │ │ feature_list │ │ 类型检查 │ │
    │ │ feature_list │ │ git log │ │ 烟雾运行 │ │
    │ │ 文档/ │ │ 会话手 │ │ e2e 管道 │ │
    │ └──────────────┘ └──────────────┘ └──────────────────┘ │
    │ │
    │ ┌────────────┐ ┐──────────────────────────────────┐ │
    │ │ 范围 │ │ 会话生命周期 │ │
    │ │ │ │ │ │
    │ │ 一项功能 │ │ 启动时的 init.sh │ │
    │ │ 一次 │ │ 结束时的清洁状态检查表 │ │
    │ │ 定义 │ │ 下一步的交接说明