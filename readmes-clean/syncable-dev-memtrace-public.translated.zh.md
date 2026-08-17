![Memtrace — AI 编码代理的结构记忆](docs/memtrace-hero.svg)

# 你的智能体值得结构记忆。

  Memtrace 将您的代码库转变为实时知识图，AI 编码代理可以在几毫秒内查询每个会话中的每个函数、类、调用边缘和版本，而无需重新读取文件或破坏他们看不到的内容。

  在 90 秒内让您的车队使用共享结构内存。

  结构性 · 零 LLM 调用 · 双时态 · 时间旅行查询 · 重放感知 · 零盲重构

## DeepSeek Harness

Memtrace 作为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件运行。首先安装 Harness（`npm install -g @deepseek-ai/dsh` — 即 `dsh` 命令），然后添加 Memtrace：

```sh
npx -y @deepseek-ai/dsh plugin --profile web add github:syncable-dev/dsh-plugin-memtrace
```

然后要求代理索引工作空间并拉动爆炸半径、演变或架构简报。详细信息：[syncable-dev/dsh-plugin-memtrace](https://github.com/syncable-dev/dsh-plugin-memtrace)。

## 它的作用

**每次发布都要注意三件事。**

🧭 **在同一个存储库上运行一组编码代理，无需合并地狱。**
每个代理读取相同的调用图，看到相同的爆炸半径，继承相同的时间历史。没有碰撞。没有陈旧的上下文。

🔁 **以充分的因果意识重放任何重构。**
代理可以准确地看到什么取决于什么，以及什么时候发生了什么变化。不再 *“我重构了一个函数，14 个测试失败了，但没有人看到。”*

⚡ **在 90 秒内为 50k 文件存储库建立索引。**
Rust + Tree-sitter，API 成本为 0 美元，20 多种语言以及框架感知扫描仪（Vapor、Lapis、Kong、GitHub Actions、Terraform、RLS 策略等），完全本地化。您的代码永远不会离开您的机器。

🆕 **LeanCTX Native — 压缩读取、智能树和价值分类账。**
`get_source_window` 上的四种新压缩模式、单次调用目录映射、实时令牌节省仪表板以及比静态表高约 14% 的选择加入自适应学习器。完整细分：[`docs/leanctx-native.md`](docs/leanctx-native.md)。在 v0.3.57+ 中可用。

https://github.com/user-attachments/assets/e7d6a1e9-c912-4e65-a421-bd0256dffa5a

## 数字

### 操作 · Memtrace · 最佳替代方案 · Δ
- **操作**：索引 1,500 个文件 · **Memtrace**：**1.5s · $0** · **最佳替代**：Mem0：31 分钟 · $10–50 · **Δ**：**~1,200× 更快**
- **操作**：精确符号查询 (acc@1, lat) · **Memtrace**：**96.6% · 0.07 ms** · **最佳替代**：GitNexus：97.0% · 8.95 ms · **Δ**：延迟降低 128 倍
- **操作**：图形调用者回忆 (Django) · **Memtrace**：**81.6%** · **最佳替代**：GitNexus：5.3% · **Δ**：**15.4×**
- **操作**：增量重新索引 p95 · **Memtrace**：**42.5 ms** · **最佳替代**：CodeGrapher：613.7 ms · **Δ**：14.4×
- **操作**：混合 acc@1（Django，3K 例） · **Memtrace**：**73.9%** · **最佳替代**：GitNexus：38.6% · **Δ**：1.91×
- **操作**：PR 代码审查 F1（50 个 PR） · **Memtrace**：**0.7268** · **最佳替代**：Cubic v2：0.6077 · **Δ**：**+19.60%**
- **操作**：RSS / 进程 · **Memtrace**：**26 MB** · **最佳替代**：ChromaDB：1,060 MB · **Δ**：**41× 更紧**
- **操作**：语言· **Memtrace**：**16+**（树保姆）· **最佳替代**：变化· **Δ**：—

可重现的基准测试套件：[`benchmarks/`](benchmarks/README.md)。相同的机器，相同的语料库，相同的适配器合约。来自 Python 的 `ast` 和 `pyright` LSP 的基本事实 - 从未来自任何工具自己的索引。 **没有系统在数据集中获得主场优势。**

详细细分： [BENCHMARKS-v0.3.22.md](BENCHMARKS-v0.3.22.md) · [BENCHMARKS-v0.3.29.md](BENCHMARKS-v0.3.29.md) · [代码审查基准](docs/code-reviewer.md#offline-benchmark-snapshot)

## GitHub 明星成长




    ![](https://api.star-history.com/chart?repos=syncable-dev/memtrace-public&type=date&legend=top-left)


## 获取访问权限

Memtrace 处于**私人测试版**。我们正在分批推出访问权限，以保持反馈循环的紧密——每个群组都会进入 Discord 频道，我们会在一周内根据真实的错误报告发布修复程序。

→ **加入 [memtrace.io](https://memtrace.io) 的候补名单。**

已经有访问权限？ `npm install -g memtrace`，您将在 90 秒内建立索引。完整设置如下。

> 🔒 **隐私。** Memtrace 完全在您的计算机上运行。源代码永远不会离开它。唯一的网络流量是许可证验证、聚合节点/边缘计数和选择退出崩溃遥测 - 没有源、没有文件路径、没有符号名称。完整细分：[PRIVACY.md](PRIVACY.md)，[TELEMETRY.md](TELEMETRY.md)。使用 `MEMTRACE_TELEMETRY=off` 禁用遥测。

## 为什么 Memtrace 存在

好的代码智能工具已经存在。 GitNexus 和 CodeGrapherContext 构建基于 AST 的图表，适用于 *“我的存储库中现在有什么。”*

**Memtrace 是一个双时态情景结构知识图。** 它建立在相同的 AST 基础上并添加了两个维度：

- **时间记忆** — 每个符号都带有其完整的版本历史记录。六种评分算法（影响力、新颖性、新近度、方向性、复合性、概述）让代理提出不同的时间问题：*“发生了什么变化？”*、*“什么是意外的？”*、*“什么会破坏？”*。
- **跨服务 API 拓扑** — Memtrace 在*存储库之间映射 HTTP 调用图，检测哪些服务调用架构中的哪些端点。

最重要的是，结构层是全面的：

### ·
- **符号是节点** · 函数、类、接口、类型、端点
- **关系是边缘** · `CALLS`、`IMPLEMENTS`、`IMPORTS`、`EXPORTS`、`CONTAINS`
- **社区检测** · Louvain算法自动识别架构模块
- **混合检索** · Tantivy BM25 + 向量嵌入 + 倒数排名融合 + 交叉编码器重新排名
- **Rust-native** · 编译的二进制文件，无 Python/JS 运行时开销，低于 8 毫秒的 p95 查询延迟

代理不仅仅搜索您的代码。 **它记得它。**

## Memtrace 与通用内存系统（Mem0、Graphiti）

Mem0 和 Graphiti 是强大的会话内存引擎，旨在跟踪实体知识（例如 `User -> Likes -> Apples`）。他们在这方面表现出色。具体来说，对于代码智能来说，权衡是他们依赖 LLM 推理来构建图表，这在处理数千个源文件时增加了成本和时间。

**Graphiti** 通过 `add_episode()` 处理数据，每集触发多个 LLM 调用 - 实体提取、关系解析、重复数据删除。以大约 50 集/分钟的速度（[来源](https://github.com/getzep/graphiti)），摄取 1,500 个代码文件需要 **1-2 小时**。

**Mem0** 通过 `client.add()` 处理数据，该 `client.add()` 对每个内存项的异步 LLM 提取和冲突解决进行排队（[source](https://mem0.ai)）。使用 `infer=True`（默认）进行批量摄取意味着每个文件都会通过 LLM 管道。吞吐量受到 LLM 提供商的速率限制的限制。

**两者**都会为大型代码库累积 10-50 美元以上的 API 成本，因为每个关系都是推断而不是解析的。

**Memtrace 采用不同的方法：** 它在 1.2-1.8 秒内索引 1,500 个文件，费用为 0.00 美元 - 没有 LLM 调用，没有 API 成本，没有速率限制。本机 Tree-sitter AST 解析器在本地解析确定性符号引用（`CALLS`、`IMPLEMENTS`、`IMPORTS`）。代价是 Memtrace 是专门为代码而构建的——它不像 Mem0 和 Graphiti 那样处理会话实体内存。

## 25+ MCP 工具

Memtrace 通过模型上下文协议公开完整的结构工具包。

**搜索与发现**
- `find_code` — 混合 BM25 + 语义 + RRF
- `find_symbol` — 使用 Levenshtein 进行精确/模糊

**关系**
- `analyze_relationships` — 调用者、被调用者、层次结构、导入
- `get_symbol_context` — 一次通话 360° 视图

**影响分析**
- `get_impact` — 具有风险等级的爆炸半径
- `detect_changes` — 差异到符号范围映射

**代码质量**
- `find_dead_code` — 零呼叫者检测
- `find_most_complex_functions` — 复杂性热点
- `calculate_cyclomatic_complexity`
- `get_repository_stats`

**时间分析**
- `get_evolution` — 6 种计分模式
- `get_timeline` — 完整版本历史记录
- `detect_changes` — 基于 diff 的范围

**图算法**
- `find_bridge_symbols` —介数中心性
- `find_central_symbols` — PageRank / 程度
- `list_communities` — Louvain 模块
- `list_processes` / `get_process_flow`

**API拓扑**
- `get_api_topology` — 跨存储库 HTTP 图
- `find_api_endpoints`
- `find_api_calls`

**索引和观看**
- `index_directory` — 解析、解析、嵌入
- `watch_directory` — 实时增量
- `execute_cypher` — 直接图形查询

## 17个特工技能

Memtrace 提供了教导代理如何使用图表的技能/指南。它们会根据您的要求自动触发——无需立即进行工程设计。

###技能·你说……
- **技能**：`memtrace-search` · **你说…**：“找到这个函数”，“X在哪里定义”
- **技能**：`memtrace-relationships` · *