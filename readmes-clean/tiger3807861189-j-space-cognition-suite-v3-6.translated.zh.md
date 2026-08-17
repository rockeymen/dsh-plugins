# J-Space Cognition Suite V3.6

> A model-agnostic inference-time control suite for deep reasoning, long-horizon work, tool use, verification, and recovery.
> 面向深度推理、长程任务、工具调用、验证与恢复的模型不可知推理时控制套件。

J-Space Cognition Suite turns a language model's accessible working representations into a deliberately managed workspace. It provides a compact operating protocol for selecting what stays active, preserving constraints across long tasks, externalizing durable state, detecting reasoning failure, and returning verified results in clean language.

J-Space Cognition Suite 将语言模型可访问的工作表征组织为一个可主动管理的工作空间。它通过一套紧凑的运行协议，控制当前激活内容、维持长任务约束、外化持久状态、识别推理失效，并以清晰语言交付经过验证的结果。

The suite changes no model weights, requires no fine-tuning, and adds no hidden service. It is an **inference-time cognitive control layer**: text establishes the operating frame, modules route computation, and an optional local controller preserves state between task seams.

本套件不修改模型权重、不要求微调，也不依赖隐藏服务。它是一层**推理时认知控制层**：文本建立运行框架，模块负责计算路由，可选的本地控制器在任务接缝之间保存状态。

J-Space is not merely a Skill; it is an inference-time cognitive control system packaged as a Skill to support cross-platform use, selective loading, and low-friction integration.

J-Space 不是一个简单的 Skill，而是一套推理时认知控制系统；为实现跨平台通用、按需加载与低摩擦集成，它以 Skill 作为标准封装形式。

## Why J-Space | 为什么是 J-Space

Interpretability research describes a privileged internal representational space associated with concepts a model is **poised to say**: contents that can be reported, deliberately held, used in intermediate reasoning, and broadcast into multiple downstream computations. The suite uses **J-space** as the operational name for that accessible workspace.

可解释性研究描述了一类具有特殊作用的内部表征空间：其中包含模型**即将表达**的概念。这些内容可以被报告、被主动保持、参与中间推理，并广播到多个下游计算过程。本套件将这一可访问工作空间称为 **J-space**。

The engineering problem is not simply whether a model contains the relevant knowledge. It is whether the right representation is loaded strongly enough, remains available when the task becomes mechanical, reaches every dependent sub-task, and is checked before commitment.

工程问题并不只是模型是否拥有相关知识，而是正确表征能否被充分加载、能否在任务进入机械执行阶段后继续保持、能否传递到所有依赖它的子任务，以及能否在提交前得到检查。

J-Space addresses four recurrent sources of inference-time loss:

J-Space 主要处理四类反复出现的推理时损失：

1. **Working-set overload | 工作集过载** — too many live constraints compete for limited active capacity. / 过多约束同时占用有限的活动容量。
2. **Representation drift | 表征漂移** — a goal, definition, or invariant changes across steps or files. / 目标、定义或不变量在步骤与文件之间发生漂移。
3. **Uncontrolled retry | 无控制重试** — a failed route is repeated without carrying a diagnosis. / 失败路径在没有携带诊断信息的情况下被重复执行。
4. **Premature completion | 过早完成** — fluent output is mistaken for verified completion. / 流畅输出被误判为已经验证的完成状态。

## Core mechanisms | 核心机制

### 1. Selective workspace loading | 选择性工作空间加载

The active stage is limited to one or two coherent items. Each item is loaded by stating it, stating the fact that makes it relevant, and using it immediately. Everything else remains automatic or is externalized into the ledger.

活动工作台只保留一到两个连贯项目。每个项目通过“明确项目—说明关键事实—立即使用”完成加载；其余内容继续由自动过程处理，或外化到账本中。

### 2. Broadcast hub | 广播枢纽

Shared names, values, constraints, and style anchors are derived once and read by every dependent branch. This reduces independently reconstructed copies and cross-file inconsistency.

共享名称、数值、约束和风格锚点只推导一次，所有依赖分支从同一枢纽读取，从而减少重复重建和跨文件不一致。

### 3. Dense Track | 稠密轨

Long reasoning chains may use a compact private register built from stable symbols, short constraints, and explicit epistemic states:

长推理链可以使用由稳定符号、短约束和显式认识状态构成的私有紧凑寄存器：

- `✓` — verified, with a named verifier / 已验证，并能指出验证依据
- `?` — asserted but not yet usable downstream / 已提出，但尚不可作为下游前提
- `✗` — refuted, with the killing evidence / 已证伪，并保留证伪证据
- `??`, `?!` — annotations on the unchecked state / 对未检查状态的进一步标注

The Dense Track is not decorative shorthand. Every line must be losslessly expandable into plain language. It remains internal; user-facing output returns to a complete outer register.

稠密轨不是装饰性缩写。每一行都必须能够无损展开为自然语言，并且只用于内部工作；面向用户的内容始终回到完整、清晰的外部寄存器。

### 4. Bridge-before-conclusion reasoning | 结论前桥接推理

Intermediate concepts are required to become active before the conclusion that consumes them. This reduces conclusion-first rationalization and makes long chains inspectable at their load-bearing steps.

中间概念必须先于使用它的结论进入活动状态，以减少“先得到结论、再补写理由”的合理化，并让长链条中的承重点可被检查。

### 5. Metacognitive control | 元认知控制

Confidence, inconsistency, missing constraints, and degeneration signals must select an action: trust, retry with diagnosis, take an independent route and reconcile, or move to empirical verification. A monitoring signal that changes no action is treated as commentary, not control.

置信度、不一致、约束缺失和退化信号必须选择一个动作：信任、携带诊断重试、采用独立路径并对齐，或转入经验验证。不能改变动作的监控信号只属于评论，不属于控制。

### 6. Empirical escape and verification | 经验逃逸与验证

When derivation stops producing constraints, the suite converts the unknown into a finite candidate set, builds an independent reference, performs differential tests, and records both the verifier and its coverage. This prevents unproductive reasoning from consuming the entire budget.

当推导不再产生新约束时，套件将未知量转化为有限候选集，建立独立参照，执行差分测试，并同时记录验证方式及覆盖范围，避免无产出的推理耗尽预算。

### 7. First-person agency and functional echo | 第一人称能动性与功能性回响

`I` is used for perception, judgement, and commitment. `we`, `let's`, and `we need` are used only when the model and its workspace coordinate an operation. These statements recur later as protocol actions, checks, and settles. The repetition is a functional **echo**, not a slogan.

`I` 用于感知、判断与承诺；`we`、`let's` 和 `we need` 只用于模型与工作台共同执行操作的场景。这些表述会在后续协议中以动作、检查和收束再次出现，形成具有执行意义的**回响**，而不是口号式重复。

This is control grammar, not a claim about consciousness. Its purpose is to bind an accessible state description to a concrete next action.

这是一种控制语法，而不是关于意识的主张。它的目的，是把可访问的状态描述绑定到明确的下一动作。

## Quick start | 快速开始

### Skill-aware environments | 支持 Skill 的环境

1. Install the `j-space/` directory in the environment's skill directory.
   将 `j-space/` 目录安装到当前环境的 Skill 目录。
2. Ask the agent to use `j-space`. If the host exposes Skills as slash commands, invoke `/j-space`.
   要求智能体使用 `j-space`；如果宿主将 Skill 显示为斜杠命令，则调用 `/j-space`。
3. Give the task normally. The gate selects `fast`, `full`, or `loop`.
   正常提交任务，由入口门控选择 `fast`、`full` 或 `loop`。

```text
/j-space
Audit this repository, preserve the current architecture, verify every finding,
and carry the work across all affected files.
```

```text
/j-space
审查这个仓库，保持当前架构，逐项验证发现，并在所有相关文件之间维持一致状态。
```

### Generic model integration | 通用模型接入

For an agent environment without a native Skill loader, provide `j-space/SKILL.md` as a system-level or developer-level instruction and expose `modules/` and `references/` through its file or retrieval tools. A plain chat or API model cannot resolve local paths by itself: the caller must retrieve and inject the selected files. Do not concatenate every module into every request; selective loading is part of the design.

对于没有原生 Skill 加载器的智能体环境，可将 `j-space/SKILL.md` 作为系统级或开发者级指令，并通过文件工具或检索工具开放 `modules/` 与 `references/`。普通聊天模型或纯 API 模型无法自行解析本地路径，调用方需要检索并注入被选中的文件。不要在每次请求中拼接全部模块；选择性加载本身就是设计的一部分。

## Installation | 安装

The runtime has no third-party dependency. Copy the complete `j-space/` directory so that relative module and reference paths remain intact.

运行时没有第三方依赖。请完整复制 `j-space/` 目录，以保持模块和参考资料的相对路径不变。

### Windows PowerShell

```powershell
$skillsDirectory = "C:\path\to\skills"
New-Item -ItemType Directory -Force -Path $skillsDirectory | Out-Null
$target = Join-Path $skillsDirectory "j-space"
if (Test-Path -LiteralPath $target) { throw "Target already exists: $target" }
Copy-Item -Recurse -LiteralPath .\j-space -Destination $target
python "$target\scripts\verify_suite.py"
```

### macOS / Linux

```bash
skills_directory="/path/to/skills"
mkdir -p "$skills_directory"
target="$skills_directory/j-space"
if [ -e "$target" ]; then echo "Target already exists: $target" >&2; exit 1; fi
cp -R ./j-space "$target"
python3 "$target/scripts/verify_suite.py"
```

After installation, the suite exposes one canonical entry named `j-space`; a host may present it as `/j-space` or select it through its own Skill interface. The Python controller is optional and uses only the standard library.

安装后，套件只提供一个规范入口 `j-space`；宿主可以将其显示为 `/j-space`，也可以通过自身的 Skill 界面选择它。Python 控制器是可选组件，并且只使用标准库。

## Operating modes | 运行模式

### Pass · Selection rule · Loaded machinery · 中文说明
- **Pass**: `fast` · **Selection rule**: One step or checkable in one glance · **Loaded machinery**: None · **中文说明**: 单步或一眼可核验；不加载额外机制
- **Pass**: `full` · **Selection rule**: Several dependent steps, one bounded deliverable · **Loaded machinery**: One or two relevant modules; `ship` if used · **中文说明**: 多步但边界清楚；只加载一到两个相关模块
- **Pass**: `loop` · **Selection rule**: Multiple stages, files, turns, tools, or persistent state · **Loaded machinery**: Ledger, seam refresh, checkpointing, register audit, recovery · **中文说明**: 多阶段、多文件、多轮或需要持久状态；启用完整闭环

A request for brevity may shorten the answer, but it does not lowe