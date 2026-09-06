![AgentDebugX 标志](docs/assets/logo.png)

#AgentDebugX

**用于代理人工智能系统的本地优先调试框架：诊断故障、确定根本原因、通过证据进行恢复，并通过重新运行验证修复。**

AgentDebugX 将失败的代理运行转变为结构化、可审核的调试
文物。它摄取实时或导出的轨迹，检测可见的故障
发出信号，将其归因于负责的步骤或代理，建议恢复
操作，并准备受控重新运行，以便可以验证修复而不是
猜到了。

该项目专为研究人员和工程师构建复杂的法学硕士而设计
代理：多代理系统、使用工具的代理、使用计算机的代理、基准
跑步者和本地代理开发工作流程。 AgentDebugX 是本地优先的
默认：跟踪保留在您的计算机上，共享是选择加入的，并且恢复建议
将明确的策略和批准元数据带入重新运行边界。

## 📰 新闻

- 🔌 **2026-08-25** — 已发布
  [`dsh-agentdebugx` v0.1.0](https://www.npmjs.com/package/dsh-agentdebugx)，
  DeepSeek Harness 的 AgentDebugX 插件。
- 📄 **2026-07-31** — 发布
  [CUADebug](https://arxiv.org/abs/2608.02643)，我们的诊断框架
  以及修复计算机使用代理故障。
- 📄 **2026-07-21** — 发布了
  [AgentDebugX论文](https://arxiv.org/abs/2607.18754)，介绍我们的
  用于故障可观察性、归因、恢复和恢复的开源工具包
  在 LLM 代理中重新运行。
- 📦 **2026-05-16** — 发布于 AgentDebugX
  [PyPI](https://pypi.org/project/agentdebugx/)。
- 📄 **2025-09-29** — 发布
  [LLM代理失败的地方以及他们如何从失败中学习](https://arxiv.org/abs/2509.25370)，
  介绍 AgentErrorTaxonomy、AgentErrorBench 和 AgentDebug。

## 系统概述

  ![AgentDebugX系统概述](docs/assets/overview.png)

AgentDebugX 遵循项目论文中使用的两阶段循环：

```text
Diagnose = Detect -> Attribute -> Recover
Rerun    = checkpoint -> retry directive -> branch execution -> evaluation
```

`Diagnose` 解释了失败的原因以及失败的原因。 `Rerun` 测试是否建议
恢复实际上改善了代理的行为。

## 为什么是AgentDebugX

追踪工具显示发生了什么。 AgentDebugX重点关注调试步骤
通常接下来是：

- 哪个早期决定导致了明显的失败？
- 哪个代理、工具调用、内存读取、切换或 GUI 操作负责？
- 什么证据支持该诊断？
- 应该尝试哪些具体的恢复措施？
- 重新运行分支是否改善了结果？

输出是可在本地 UI 中检查的便携式诊断报告，
由 CLI 工作流程使用，存储在错误中心捆绑包中，或从
代理技能。

## 核心能力

- **便携式跟踪模式**：与框架无关的轨迹、事件、发现和
  诊断报告模型。
- **摄取适配器**：标准化原始 JSON、LangGraph、CrewAI、OpenAI Agents SDK、
  OpenTelemetry、GAIA/Open Deep Research、OSWorld 和其他导出的跟踪。
- **检测**：确定性分析器、清单支持的规则包、LLM 判断
  模式、GUI 感知信号和分类归纳支持。
- **属性**：启发式归因、一次性分析、逐步分析
  本地化、二分搜索、反事实归因、MOE 本地化、
  和深度调试。
- **恢复**：反射、批评、自我优化、自动手动、DeepDebug 恢复、
  和传奇回滚风格的策略。
- **重新运行**：仅用于计划/导出、标记模拟或
  观察应用程序拥有的进程或持久 HTTP 运行程序中的执行情况。
- **本地检查 UI**：无需构建 FastAPI 仪表板，用于跟踪、报告、
  CUA 视觉效果之前/之后、调试器讨论、保存的案例、调试分支、
  以及从事件重新运行的工作流程。
- **错误中心**：用于回归测试的已清理、可共享的故障包，
  基准语料库和团队调试内存。
- **代理集成**：生成主机运行时资产，例如调试技能
  用于外部代理工具。

## 安装

```bash
pip install agentdebugx
```

可选附加功能：

```bash
pip install "agentdebugx[ui]"             # local FastAPI dashboard
pip install "agentdebugx[langgraph]"      # LangGraph adapter
pip install "agentdebugx[crewai]"         # CrewAI adapter
pip install "agentdebugx[openai-agents]"  # OpenAI Agents SDK adapter
pip install "agentdebugx[otel]"           # OpenTelemetry ingest
pip install "agentdebugx[gui]"            # screenshot decoding for GUI RCA
pip install "agentdebugx[all]"            # all optional integrations
```

计算机使用/OSWorld GUI 根本原因分析 (`agentdebug.gui`) 附带
核心安装，不需要额外的。 `gui`额外只增加了`pillow`，
RCA 工具用于解码屏幕截图。同一包装的两个较重的层放置
他们自己的附加功能背后：`gui-memory` 用于课程/情景记忆堆栈，以及
`gui-app` 用于提供程序适配器、批处理管道 (`python -m
agentdebug.gui`) 和 Streamlit 注释应用程序。

该软件包安装为 `agentdebugx` 并导入为 `agentdebug`：

```python
import agentdebug
```

## DeepSeek Harness 插件

AgentDebugX 也可用作
[`dsh-agentdebugx`](https://www.npmjs.com/package/dsh-agentdebugx) 插件
DeepSeek Harness。它诊断当前和已保存的线束轨迹并
仅在需要时启动 Python 桥和本地仪表板。

```bash
pip install "agentdebugx[ui]>=0.3.1,<0.4"
dsh plugin --profile web add dsh-agentdebugx
```

请参阅[插件文档](integrations/dsh-agentdebugx/README.md)
配置、命令、保存的会话发现和深度诊断。

## 快速入门：Python API

记录轨迹并在本地分析：

```python
from agentdebug import AgentDebug, EventType

debugger = AgentDebug()

with debugger.trace(
    goal="Book a refundable NYC to SFO flight",
    framework="my-agent",
) as trace:
    trace.record(
        EventType.PLAN,
        agent_name="planner",
        step_index=1,
        output="Search for the cheapest fares.",
    )
    trace.record(
        EventType.TOOL_RESULT,
        agent_name="browser",
        step_index=3,
        error="Checkout failed: refund_policy is required.",
    )

    report = trace.analyze()

print(report.summary)
for finding in report.findings:
    print(finding.failure_mode.mode_id, finding.step_index, finding.evidence)
```

该报告定位了负责的上游步骤，而不仅仅是报告
最终的可见错误。

## 快速入门：CLI

CLI 支持完整的诊断 -> 重新运行工作流程。网络控制台是
可选，并且对于跟踪转换、诊断、归因不是必需的，
恢复计划，或重新运行准备。

### 1. 标准化外部迹线

AgentDebugX可以自动检测常见的JSON和JSONL导出：

```bash
agentdebug ingest raw_trace.json --format auto --out trace.json
```

当来源已知时使用 `--format`，例如 `messages`，
`openai_agents_spans`、`crewai_events`、`langgraph_callbacks`、`claude_code`、
或`osworld`。

处理独立 JSON 文件的目录或文件中的每个非空行
JSONL 数据集：

```bash
agentdebug batch ingest AgentProcessBench/gaia_dev/test.jsonl \
  --out-dir data/agentprocessbench/gaia_dev
```

批量诊断规范化每条记录并独立写入可重新运行
轨迹和报告：

```bash
agentdebug batch diagnose AgentProcessBench/gaia_dev/test.jsonl \
  --mode judge \
  --attributor all-at-once \
  --recovery self-refine \
  --out-dir runs/agentprocessbench/gaia_dev
```

每批写入`batch-summary.json`。无效记录被隔离并执行
不丢弃成功的输出；部分失败的 CLI 批处理退出并带有代码
`3`。

### 2. 运行完全本地诊断

确定性管道不需要 API 密钥：

```bash
agentdebug diagnose trace.json \
  --mode heuristic \
  --attributor heuristic \
  --recovery reflexion \
  --out report.json
```

呈现与面向级联的回溯相同的诊断：

```bash
agentdebug diagnose trace.json \
  --mode heuristic \
  --attributor heuristic \
  --recovery reflexion \
  --traceback
```

### 3.启用LLM支持的诊断

保存一次 OpenAI 兼容端点：

```bash
agentdebug config set-llm \
  --base-url "https://<openai-compatible-host>/v1" \
  --api-key "<secret>" \
  --model "<model>"
```

然后选择诊断、归因和恢复实施
明确地：

```bash
agentdebug diagnose trace.json \
  --mode judge \
  --attributor all-at-once \
  --recovery self-refine \
  --out report.json
```

对于困难的多步骤或不明确的故障，DeepDebug 会运行完整的
诊断工作流程并自动将其有证据支持的修复打包为
标准重试指令：

```bash
agentdebug diagnose trace.json \
  --mode deepdebug \
  --out report.json
```

`--recovery deepdebug` 可以明确选择该封装。现有脚本
使用 `--attributor none --recovery none` 的设备保持兼容；明确的
`--recovery none` 禁用标准恢复