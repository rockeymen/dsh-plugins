# Dashr: RLM Plugin for `dsh`

## ⚡ Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/fgm-builds/dashr/main/install.sh | bash
```

### Alternative: `dsh` Plugin CLI (`npm`)

```bash
dsh plugin --profile web add --config.auto-install-peers=false dsh-rlm-mode
# then copy the preset files (install.sh does this for you):
#   /node_modules/dsh-rlm-mode/preset/rlm-mode/*  →  ~/.dsh/.agent-presets/rlm-mode/
```

> After installation, launch `dsh web` and select the **RLM Mode** agent preset.

## 📖 Overview

[DeepSeek Harness (`dsh`)](https://github.com/deepseek-ai/deepseek-harness): Everything is a plugin (万物皆插件, Cordis framework).
[Prime Agent](https://github.com/primeintellect-ai/prime): RLM paradigm (递归自调用), Context as variables (上下文即变量).
**Why not both?** That's `dsh` in RLM mode — that's **Dashr**.

  ![Dashr (RLM mode) running in DeepSeek Harness Web UI](./docs/dsh-webUI-with-rlm-mode.png)

**Dashr** is an open-source plugin for the [DeepSeek Harness (`dsh`)](https://github.com/deepseek-ai/deepseek-harness) agent runtime. It brings **RLM（Recursive Language Models：递归自调用）** and the **Context as Variables（上下文即变量）** paradigm to `dsh`, registering a dedicated `rlm-mode` agent preset upon installation.

Instead of paying massive token costs on every round-trip tool call in standard multi-turn chat, Dashr equips the agent with a **stateful, persistent Python kernel（持久化内核）**. The agent writes self-contained Python programs per cell, manipulating context, tools, and memory as native variables via the **Python Kernel Unified Tool Calling（统一的代码化工具调用）**.

## 💡 RLM（Recursive Language Models：递归自调用）

Reference: *Recursive Language Models* (MIT/Stanford/Open MIND, 2025, [arXiv:2512.24601](https://arxiv.org/abs/2512.24601))

1. **Context Scaling Up to 100x**:
   250K context LLMs effectively process **10M+ token** inputs beyond physical context windows while avoiding context rot（上下文腐化/退化）.
2. **Recursive Sub-Agent Task Decomposition** *(not from the reference)*:
   Recursive sub-agent/sub-task delegation aligns with granular locality and task complexity in open-world settings; delegation and receipt naturally form a doer-verifier pair.
3. **Resilience on Information-Dense Benchmarks**:
   Excels on complex multi-hop reasoning tasks (e.g. *OOLONG-Pairs*), standard frontier LLMs fail catastrophically.
4. **Token & Cost Efficiency**:
   Outperforms standard long-context ingestion and summarization baselines by up to **2× performance**.

### Architecture

#### 1. Context as Variables（上下文即变量，Stateful Kernel）
在标准代理循环中，读取大文件或计算复杂的有效负载会将原始输出直接转储到对话历史记录中。在Dashr中：
- 状态和计算保留在实时 IPython 内核会话中。
- 中间变量可以跨单元格保存，无需重新输入提示。
- **Python内核统一工具调用（统一的代码化工具调用）**：工具公开为一流的Python函数（`tools.<name>()`）。中间执行数据永远不会通过提示来回传输。

#### 2.递归子代理（`rlm()`）
**RLM**的核心机制：
- 对于大量令牌或探索性子任务，代理会生成子代理 (`handle = rlm("Investigate repository history")`)。
- 子代理在它们自己的隔离上下文循环中递归操作。
- 完成后，`rlm_await(handle)` 仅将最终的摘要收集回父内核。

#### 3. Global Context Recency Window（全局上下文时效窗口）
- 即使没有生成子代理，Dashr 也可以通过滑动窗口压缩在最近的轮次中维持有界的**全局上下文新近度窗口**。
- 防止上下文退化（上下文中断）并消除长工作流程中的上下文窗口饱和。

#### 4. Compaction & Summarization（上下文压缩与提炼）
- 位于活动滑动窗口之外的早期回合会自动压缩为结构化摘要 (`compact()`)。
- 高级别进度、关键决策和操作指南保留在动态线束 (`refine()`) 中，并重新注入提示中。

## 📊 RLM 模式（Dashr）与代码模式（`dsh` 内置）

虽然 **RLM 模式 (Dashr)** 和 `dsh` 的内置 **代码模式** 都为编程工具编排提供了代码优先接口，但它们在语言生态系统、内核持久性和递归功能方面存在根本区别：

### 维度 · RLM 模式（Dashr 插件） · 代码模式（`dsh` 内置） · 亮点与优势
- **维度**：**接口标准化** · **RLM 模式（Dashr 插件）**：主机工具集注册表架构 · **代码模式（`dsh` 内置）**：主机工具集注册表架构 · **亮点和优势**： 🤝 两者都动态公开从同一主机注册表生成的类型化 SDK 绑定 (`tools.*`)。
- **维度**：**触发和编排** · **RLM 模式（Dashr 插件）**：程序化代码执行 · **代码模式（`dsh` 内置）**：程序化代码执行 · **亮点和优势**： 🤝 两者都将多个顺序工具调用折叠为单个代码执行步骤。
- **维度**：**执行语言** · **RLM模式（Dashr插件）**：**Python**（IPython 3.10+） · **代码模式（`dsh`内置）**：TypeScript / JavaScript · **亮点和优势**： 🐍 完全访问Python的数据科学、AST分析和AI工具生态系统（`pandas`、`numpy`等）。
- **维度**：**后端和内核层** · **RLM 模式（Dashr 插件）**：**持久 IPython 内核**（ZeroMQ + Jupyter 协议） · **代码模式（`dsh` 内置）**：临时 Node.js 沙箱/一次性运行器 · **亮点和优势**：⚡ Dashr 在每个会话中维护一个专用的持久内核。变量、导入和对象可以跨轮生存。
- **维度**：**函数式递归委托** · **RLM模式（Dashr插件）**：**原生`rlm()`函数调用，任意递归深度）** · **代码模式（`dsh`内置）**：框架级子代理工具调用 · **亮点与优势**： 🔀 标准化为零摩擦Python函数（`rlm()`）。子代理可以递归地生成任意深度的 2 级以上子代理，并将结果直接返回到 Python 变量中。
- **维度**：**状态快照和恢复** · **RLM 模式（Dashr 插件）**：**完整命名空间快照（`dill`）** · **代码模式（`dsh` 内置）**：重新启动之间无状态 · **亮点和优势**：💾 内核状态可以在会话重新启动时序列化和恢复。

## ✨ 特点

- 💬 **A2A 代理消息传递（智能体间直接通信）** — 跨家谱和兄弟姐妹的直接代理到代理消息传递通道，结果/消息分离。
- 🔀 **内核内递归子代理** — 调用 `rlm(task)` 生成并行子代理，调用 `rlm_await(id)` 收集 Python 代码内的结果。
- 🪟 **全局上下文近期窗口（全局上下文近期窗口）** — 滑动窗口压缩，保留最近的回合，同时压缩较旧的历史记录。
- 🧠 **动态线束和压实** — 内置 `refine()` 用于操作内存，`compact()` 用于在压力下减少环境。
- 💾 **状态快照与恢复（状态快照与环境多重）** — 跨会话保存和恢复内核命名空间。

## 🔒 安全模型

- **工具治理**：对 `tools.*` 的调用通过 `dsh` 的主机工具管道运行，其中批准和沙箱策略通常适用。
- **内核代码执行**：单元格内的Python代码以运行`dsh`的本地用户的权限执行。在您信任代理针对您的用户帐户执行代码的环境中运行 Dashr（或在容器内运行 `dsh`）。

## 📚 参考文献和学分

Dashr 的设计建立在递归代理执行和持久提示利用方面的突破性研究之上：

1. **递归语言模型（RLM）**
   *递归语言模型*，2025。
   论文：[arXiv:2512.24601](https://arxiv.org/abs/2512.24601)
   *建立超长上下文和有界提示管理的递归分解和子代理执行范例。*

2. **持续利用和及时改进**
   *自主代理的持续利用*，2026 年。
   论文：[arXiv:2605.09998](https://arxiv.org/abs/2605.09998)
   *动态提示细化和循环压缩的公式。*

## 🙏 致谢与归属

Dashr 是作为 [DeepSeek Harness (`dsh`)](https://github.com/deepseek-ai/deepseek-harness) 的开源插件而构建的。

虽然 Dashr 的代码库是为 `dsh` 插件生态系统从头开始独立开发的，但其核心设计和理念深受 Prime Intellect 的 **[Prime Agent](https://github.com/primeintellect-ai/prime)** 的开创性工作的启发。我们向他们提出的**Context as Variables（上下文即变量）**范式和**Recursive Language Model（RLM：静脉自调用）**执行模型致敬，这激励我们将这些突破性的能力带到`dsh`代理社区。

### ⚖️ 许可与兼容性
**Dashr** 和上游灵感 **Prime Agent** 均根据许可 **[MIT 许可证](https://opensource.org/licenses/MIT)** 获得许可。 Dashr 完全开源且符合许可证，无需 IP 或许可证