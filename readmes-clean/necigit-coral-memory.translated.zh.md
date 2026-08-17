# 脑珊瑚 · Coral Memory (Brain Coral)

> **A heat-aware persistent memory layer for LLM agents** — 面向 LLM Agent 的记忆层中间件：
> 三级存储（热/温/冷）、多路融合检索、热度生命周期淘汰、配置热加载、推理线索链路（永不遗忘的跨聊天协作）、DSH Harness 插件集成。
>
> *Origin: started as a ComfyUI prompt-manager idea, grew into a memory layer. 本来只想管提示词，结果长成了一片珊瑚礁。*
>
> **EN**: Coral Memory is a heat-aware persistent memory layer for LLM agents —
> three-tier storage (hot/warm/cold), multi-fusion retrieval, heat-based lifecycle eviction,
> config hot-reload, and a zero-dependency MCP stdio bridge so any MCP-capable client
> (DSH Harness, Claude Desktop, Cline, ...) gets `memory_search` / `memory_insert` tools.
> Embedding models are fetched on first run from HuggingFace — never committed to the repo.

## Author — Mr. Code Muggle (@Ne)

Mr. Code Muggle — hi guys, I made something fun to play with: fork it, break it, rebuild it — just maybe mention me (lol).
The coral remembers what I can't. Questions? 📮 751286928@qq.com
Shoutout to every open-source maker out there 🌱

## 功能区

脑珊瑚的 DSH Harness 插件 GUI（设置 →「脑珊瑚 Coral」）三大功能区一览：

### 任务栏演示 · 统计窗口 · 设置窗口
- **任务栏演示**: ![任务栏演示](webui/screenshots/taskbar.png) · **统计窗口**: ![统计窗口](webui/screenshots/settings-main.png) · **设置窗口**: ![设置窗口](webui/screenshots/settings-config.png)

- **任务栏**：推理线索链路（Thread）的看板——活跃链路标题 / 状态 / 步数 / 最近推进者，跨聊天协作的全局视图
- **统计窗口**：缓存占用（热/温/冷/线程/磁盘）+ 记忆按天分布（近 14 天）+ 即将被淘汰的冷记忆 Top5 + 缓存文件地址
- **设置窗口**：容量上限 / 检索条数 / 最低分数 / 去重阈值 / 磁盘配额 / 热区保留时长 / 时间衰减，热加载即时生效

## 这是什么 / 不是什么

**是什么**：给 LLM Agent 用的"记忆层"——记住该记住的（你的偏好、说过的话），
忘掉该忘掉的（没用的旧记忆，按热度淘汰），并在需要时只捞最相关的几条给你。
不占上下文窗口，跨会话不丢失。

**不是什么**：
- 不是 RAG 框架（不负责分块、文档摄取、生成）；
- 不是向量数据库（无 ANN 索引，单机 ~20 万条以内的内存全量打分）；
- 不是缓存插件（缓存是"别重复计算"，它是"别重复交代"）；
- 它不产生答案，它只负责"记得"——所以单独看它确实看不出名堂，
  接上应用（翻译助手 / 客服 / Agent）才显现价值。

**起源**：最初只是想管理 ComfyUI 的提示词，做着做着发现
"提示词管理"的本质是"该记住什么、该忘掉什么、该在什么场景召回什么"，
越想越离谱，最后长成了一个记忆系统。

## 对用户的价值（玩家视角）

**"它让 AI 记住你的习惯和说过的话，每次只挑最相关的几条回忆出来用——不用你重复交代，也不用把整个聊天记录塞给 AI。"**

### 玩家问题 · 答案（标注前提与来源）
- **玩家问题**: **能提升命中率吗？** · **答案（标注前提与来源）**: **确定性基准下能，真实场景不承诺**。合成语料 + hash 嵌入 + 固定 seed 的基准里：冷启动 0%→100% 有结果、recall@5 与 precision@5 均达 1.0——这是**能力上限演示**，不是典型预期。真实语料/真实模型下命中率大概率更低，随语料分布与模型质量波动；接入前请用自有数据复测（`benchmarks/bench_cross_project.py` 可替换语料重跑）
- **玩家问题**: **能省上下文吗？** · **答案（标注前提与来源）**: **理论可行，实测不好说**。省多少取决于用法——前提是把"全量会话历史"替换为"Top-5 相关记忆"注入；但 HARNESS 太强了测不出稳定的效果，大概可能有效哈哈。前提不满足则没有任何节省
- **玩家问题**: **会越用越卡吗？** · **答案（标注前提与来源）**: **默认配置下不会**。热度淘汰自动清理低热度旧记忆；实测 2 万条写入 83.7s、检索 12ms/次、stats()≈0ms（本机 8C/16T，hash 嵌入，`stress/stress_20k.py` 可复现）。但延迟随池规模上升：容量调大、单条记忆变长都会变慢——这是**无 ANN 索引的全量打分检索**的固有特性
- **玩家问题**: **要重新说一遍吗？** · **答案（标注前提与来源）**: **多数情况下不用**。文本相似度达到阈值（默认 Jaccard ≥ 0.7）时重复偏好自动合并，命中过的记忆热度更高、更难淘汰（200 轮压测实测去重 18 次）。但**换种说法或细节不同就不会合并**，会并存为两条——它不是语义级去重

> ⚠️ **预期管理（写给集成者，不夸张承诺）**：本表数字全部来自仓库内**确定性基准**（合成语料、hash 嵌入、固定 seed），
> 脚本已随仓库发布（`benchmarks/`、`tests/`、`stress/`），可自行复现。
> 它们证明的是**能力上限**，不是任何真实场景的承诺。真实效果取决于：嵌入模型
> （生产默认 `BAAI/bge-small-zh-v1.5`，中文比基准用的 hash 嵌入更准，但仍是向量相似度、不是语义理解）、
> 语料分布、查询措辞、应用如何注入记忆。**模糊召回是概率性的：测试语料越接近你的真实数据，
> 数字才越有参考价值；记忆池小、语料杂、模型弱时，命中率可能远低于基准。**
> 记忆层不产生答案、不保证命中——它只提供"记住"的机制。

## 架构：三级存储与数据流

```
insert → embed → 热区（内存列表） →（TTL 过期）→ 温区（内存 + JSON） →（超 max_warm）→ 冷区
热区超 max_hot 时直接 LRU 落冷（不经温区，避免中间层堆积）

冷区：coral_cold.jsonl（追加写；检索只读尾部最新 N 行，流式读）
向量区：coral_vectors.npy（float32 矩阵 + id 索引，与文本并行维护）
```

- **热区**（内存）：最快；按 `hot_ttl_hours` 过期进温区；超 `max_hot_entries` 时**直接 LRU 落冷**（不经过温区，避免中间层堆积——沿用旧版踩坑后的设计）；
- **温区**（内存 + `coral_warm.json`）：每次治理写盘，热度统计随写盘持久化；
- **冷区**（JSONL 追加）：`_dump_cold` 逐行追加零开销；检索用**尾部流式读**（向后分块，只读最后 64KB×N，不读全文件）；
- **向量区**：float32 矩阵独立存 `.npy` + id 索引 `.json`，与文本并行增删；**启动时清理孤儿向量**（热区不落盘，重启后其向量无主）。

**插入流程**：嵌入（锁外）→ 热/温查重（Jaccard ≥ `sim_threshold_hot` 则合并访问统计）→ 写向量 → 入热区 → 治理检查。
**检索流程**：查询嵌入（锁外）→ 热/温全量 + 冷区尾部打分 → 融合排序 → Top-K → 命中条目热度 +1（冷库记入待折叠增量）。

## 核心算法

**多路融合检索**（`retrieval.weights`，默认 0.6/0.2/0.2）：

```
score = 0.6·cos(vec(q), vec(m)) + 0.2·Jaccard(q, m) + 0.2·exp(-ΔT / τ)      # τ 默认 7 天
```

- 向量：整池一次 `np.stack` + BLAS 矩阵乘（GIL 外，2000 条 ~2ms）；
- Jaccard：2048-bit 哈希位图 + `numpy.bitwise_count` 一次向量化，位图跨查询缓存（基准下稳态 **12-13×** 加速，2000~2 万条实测）；
- 时间衰减：`exp(-ΔT/τ)`，ΔT 为记忆年龄。

**热度分**（`heat.weights`，默认 0.4/0.3/0.3）：

```
H = 0.4·log2(1+c)/log2(1+scale) + 0.3·exp(-Δt/τ) + 0.3·importance
```

- 频率用对数刻度（避免线性饱和），淘汰/蒸馏时按**池内最大访问数归一化**（跨池可比）；
- 冷库热度增量（检索命中）节流折叠回 JSONL（`cold_fold_interval_seconds`，默认 30s），重启不丢。

**容量治理**（`capacity_threshold` + `governance_headroom`）：

```
触发：total > capacity + headroom     # headroom = max(10, min(容量/10, 200))，0 可显式覆盖
步骤：先蒸馏（LLM 压缩相似簇，需配置 llm 段；未配置则跳过聚类）→ 淘汰最低热度至容量
```

蒸馏：相似记忆簇（Jaccard ≥ `distill_sim_threshold`、簇 ≥ `distill_min_cluster`）交给 LLM 压缩成
一条 ≤80 字摘要（继承簇的热度/重要性），碎片记忆自动收敛。端点走 OpenAI 兼容
`/chat/completions`（urllib 零依赖），配置 `llm` 段（见[配置参考](#配置参考coral_configjson)）即启用；
未配置或调用失败时优雅降级为"不蒸馏"，绝不阻断治理。注意：推理模型（如 deepseek-v4-*）的
思考过程也占 `max_tokens`，本实现已用 1024 保证摘要必出。

治理余量让超容后的淘汰**批量发生**，而非每次 insert 全量治理（2 万压测：307.8s → 3.4s，90×）。

**磁盘配额**（`storage.max_bytes`，0 = 不限制）：

```
超 warn_ratio(0.8)·max → 节流告警一次
超 max_bytes → 按热度淘汰冷库，回落到 hard_ratio(0.85)·max
振荡带 [hard, max] 是刻意设计：触发于 ~max，回落于 hard
```

向量字节用**投影值**（`len(store)×dim×4`，dim 为嵌入模型维度）：向量是节流落盘的，读磁盘文件会低估真实占用，配额保护的是"最终要写盘的量"。

## 嵌入模型（模型不随仓库分发，按需自取）

### 模型 · 维度 · 中文语义 · 说明
- **模型**: `sentence-transformers/all-MiniLM-L6-v2`（默认） · **维度**: 384 · **中文语义**: 一般 · **说明**: 小快；纯本地
- **模型**: `BAAI/bge-small-zh-v1.5`（推荐中文） · **维度**: 512 · **中文语义**: 明显更准 · **说明**: 首次运行自动从 HuggingFace 下载（~95MB，缓存于用户目录 `.cache/huggingface`），**不入仓库**

**指路**：[bge-small-zh-v1.5 on HuggingFace](https://huggingface.co/BAAI/bge-small-zh-v1.5) · [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)

配置：`coral_config.json` 的 `embedding.model_name` / `embedding.dim` 两处，改完重启服务。

**换模型后必须重建向量**（旧维度向量与新维度不匹配会自动丢弃，检索会失去向量分）：

```bash
# 1. 先停掉正在运行的 coral 进程（DSH 会自动重连）
# 2. 修改 coral_config.json 的 model_name / dim
python migrate_bge.py   # 修订+重嵌入+重建向量区+检索验证，一步到位
```

## 推理线索链路（Thread）—— 永不遗忘的跨聊天协作

> **一句话**：聊天 A 说"我要干啥"（宏观路径），聊天 B/C/D/E/F 各自看到并推进——链路把"到哪了"
> 用几句话记死，任何聊天一进来 `thread_status` 就知道全局。

**与普通记忆的本质区别**：普通记忆（热/温/冷池）按热度淘汰、超容治理、磁盘配额；
链路存独立文件 `memory_data/coral_threads.json`，**不参与任何淘汰/治理/配额**——"永不遗忘"。
每条链路 = 标题（短短语）+ 摘要（宏观路径，可不断更新）+ 步骤链（谁在何时推进了什么，
每条步骤带全局唯一 `step_id`）+ 父子链接（线索链串联）。

**多进程一致性**（跨聊天的地基）：
- 变更落盘**节流**（250ms 突发合并，真实操作间隔远大于此，仍即时落盘）+ `flush()`/进程退出强制；
- 写入用**锁文件**（O_EXCL + 10s stale 检测）串行化多进程写者，`os.replace` 带退避重试（防 Windows 撞文件）；
- 写前按文件指纹 (mtime+size) 检测外部变更并**按 `step_id` 合并远端步骤**——
  3 进程并发各推 30 步实测 **90/90 零丢失**（`stress/stress_threads.py` 可复现）；
- 压测：300 链路 × 20 推进 = 6000 操作 **0.08s**（8 万推进/秒），重启加载完全一致。

**跨聊天协作流程**：

```text
聊天A: thread_create("发布 v2.0", "升级嵌入模型并优化检索性能", by="聊天A")
聊天B: thread_status                          # 一进来就看到宏观路径
聊天B: thread_advance(, "migrate_bge.py 已跑通", done=True, by="聊天B")
聊天C: thread_status(thread_id=)   # 看到步骤链，接着推进
聊天C: thread_advance(, "向量重建完成，检索验证通过", by="聊天C")
聊天A: thread_interrupt(, reason="等上游依赖")   # 暂停
聊天A: thread_resume()             # 恢复
聊天A: thread_archive()            # 归档（永不遗忘，只是不在活跃总览）
```

**MCP 工具**（DSH 中为 `mcp__coral__thread_*`）：`thread_create` / `thread_status` /
`thread_advance` / `thread_interrupt` / `thread_archive` / `thread_resume` / `thread_link`。
`thread_status` 不带参数返回全部活跃链路总览（含子链路归属），Agent 直接在聊天里渲染成看板。

> **💡 DLC · 大工程协同**：想直接体验"线程即项目中枢"的多聊天并行协作？
> 仓库自带了指挥官 agent 预设 [`dlc/big-project-coordinator/`](dlc/big-project-coordinator/README.md)——
> 开场"Hi，有什么大工程要我解决吗？"，自动建链路、拆子任务、派多个子聊天并行推进并写回进度，
> 任何会话可接手。安装见 DLC 内 README。

## 管理上下文缓存（配置工具）

三个 MCP 工具让 Agent/用户在聊天里直接管理记忆层配置（热加载即时生效 + 持久化）：

- `coral_stats()` —— 体检：热/温/冷占用、线程数、磁盘与配额比例；
- `coral_config_get(path?)` —— 查看配置，支持点分路径（如 `memory.capacity_threshold`）；
- `coral_config_set(key_path, value)` —— 改配置并原子写回 `coral_config.json`（重启保持）。
  改 `memory.capacity_threshold` 会立即触发一次容量治理；`retrieval.top_k` / `retrieval.min_score` /
  `storage.max_bytes` 等随改随生效。**受保护路径**：`paths.*` / `threads.*`（改路径会脱离数据目录）、
  `embedding.*`（换模型/维度需 `migrate_bge.py` 重建向量）。

```text
coral_stats()                              # 看占用
coral_config_set memory.capacity_threshold 2000   # 容量调大
coral_config_get retrieval.weights         # 查检索权重
```

## 存储格式与持久化语义

- 单条记忆 ≈ 文本 JSONL ~250B + 向量 1536B ≈ **1.8KB**（10 万条 ≈ 180MB）；
- `item_id = md5(content)[:16]`：重复内容共享向量、跨库去重；
- 原子写：`np.save` → `.tmp` + `os.replace`；冷区单行追加；
- 向量**节流落盘**（默认 5s）+ `flush()` 强制：崩溃最多丢一个节流窗口的向量，检索时按内容**懒重建**；
- 重启语义：热区不落盘（设计如此）；温区随治理写盘；冷区热度折叠后持久；孤儿向量启动清理。

## 并发与性能模型（面向 2020 前后消费级 i5/i7，6C/12T ~ 8C/16T）

### 环节 · 做法 · 实测
- **环节**: 嵌入 · **做法**: 锁外执行 + 合批窗口（`embed_batch_window_ms`，真实模型建议 4-8ms） · **实测**: 8 路并发检索 5.4×
- **环节**: 打分 · **做法**: 整池一次 BLAS 矩阵乘 + 位图 Jaccard 一次向量化（**不要把 numpy 调用套进 Python 循环**） · **实测**: 2000 条 4ms/查询
- **环节**: 治理 · **做法**: headroom 批量淘汰，向量/温存节流落盘 · **实测**: 超容治理 90×
- **环节**: `stats()` · **做法**: 缓存计数，O(1) · **实测**: 21ms → ~0ms
- **环节**: 线程 · **做法**: `torch.set_num_threads(物理核数)`；Python 侧打分**不要加线程池**（GIL） · **实测**: —

## 快速开始

```bash
pip install numpy
python -c "import three_dog_coral; print(three_dog_coral.__version__)"   # 0.1.0
```

```pyth