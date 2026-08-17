# ARGP — DeepSeek Harness 的 0-LLM 确定性上下文压缩

ARGP (**A**tomic **R**eference **G**raph **P**runing) 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) 的第三方 `CompactionEngine`，它压缩对话上下文**没有任何 LLM 调用**：它不是将历史记录重写为摘要，而是选择性地忘记。

- **压缩阶段 0 LLM** — 纯图形规则，确定性和收敛性。
- **选择性遗忘，而不是重写** - 修剪的内容保留在仅附加会话日志中，并且可通过内置 `recall_pruned` 工具检索。
- **与发动机无关的接缝** — 通过标准 `CompactionEngine` 接口安装为 `compaction-basic` 的直接替代品。

> 状态：研究/验证阶段。完整的管道（挂载 → 修剪 → 召回、事务不变量）在带有 DeepSeek v4-flash 的 dsh `0.1.0-rc.6` 上进行验证（请参阅 [Re Produce](#reproduce)）。声明性生产安装 (P4) 正在进行中。

## 为什么

基于 Summarizer 的压缩（例如 `compaction-basic`）在压缩时用 LLM 重写历史：成本随上下文变化，信息有损，压缩率不可控。 ARGP 采用相反的路线：在对话发生时从结构上捕获依赖性（每回合一个小的注释），并且压缩仅以引用图的逆拓扑顺序“驱逐”原子 - 每个原子的标记计数是已知的，修剪是确定性的，并且退化链收敛到预算。

## 核心机制

1. **原子化** — 历史被分解为原子（用户/助手/工具-结果）。 dsh 的表面没有独立的工具/调用节点，因此调用块位于辅助原子内部。
2. **图形构建** - 确定性边缘（助手→其工具结果，通过 `toolCallId`）加上助手在其输出中声明的引用前缀的语义边缘（`{"cites": [...]}`）。
3. **拓扑剪枝** — 重复驱逐入度为 0 的原子，按边缘级别 → 有效重要性 → 最后参考轮排序。对修剪原子的引用将其解锁（动态有效入度，每次传递）。 `U`（用户）原子和墓碑永远不会被修剪。
4. **闭包生命周期** - 已完成的任务闭包（根锚定在任务类型用户原子上）可以被整个驱逐，并通过墓碑来提供召回指数。
5. **Recall** — `recall_pruned(seq)` 从日志中检索修剪后的原子； `list_pruned` 显示修剪节点索引。预算：≤3次呼叫/回合，≤每次呼叫5%窗口，≤10%总计。
6. **版本重复数据删除** — 精确重复的辅助原子/同一发行者工具结果成对修剪（设计的 θ=0.8 链重复数据删除的简化形式）。

设计细节、不变量以及实现与设计偏差在 [`docs/`](docs/).

## 存储库布局

### 路径·内容
- **路径**：`src/argp-graph-engine.ts` · **内容**：主引擎（图构建、剪枝、闭包生命周期、召回/列表工具）
- **路径**：`src/argp-t1-engine.ts` · **内容**：早期的单交易验证引擎
- **路径**：`src/recall-engine.ts` / `src/probe-engine.ts` · **内容**：召回/探测助手
- **路径**：`test/` · **内容**：节点测试套件（`argp-graph-engine.test.ts`、`chain-unlock.test.ts`）
- **路径**：`spike/` · **内容**：重现/验证脚本（每个 `node spike/NN-*.ts` 都是独立的）
- **路径**：`docs/` · **内容**：设计（v1.0）、迁移设计、路线图、实验记录、设计↔impl Trace

## 快速开始

```bash
npm install
npm run check        # typecheck + local smoke + unit tests
```

DeepSeek 支持的验证需要 dsh API 凭证（标准 dsh 凭证位置）并运行：

```bash
npm run smoke:deepseek   # 10a + 10b + 10d single-turn smokes
```

## 重现

运行关键验证（所有工件仅限本地；已提交脚本）：

### 运行 · 命令 · 它验证什么
- **运行**：50 转 t-long（高思维） · **命令**：`ARGP_DEEPSEEK_THINKING=enabled node spike/06-tlong.ts` · **它验证什么**：L1/L2/L3 不变量、7/7 锚、7/7 针（通过调用）
- **运行**：生产规模 · **命令**：`ARGP_DEEPSEEK_THINKING=enabled ARGP_WINDOW_TOKENS=100000 ARGP_RETAIN_TOKENS=33000 ARGP_MAX_PASSES=256 node spike/06-tlong.ts` · **它验证什么**：大事务修剪（每个事务 34–35 个原子）
- **运行**：基线（压缩基本） · **命令**：`node spike/07-baseline.ts` · **它验证什么**：与库存摘要器执行相同的任务以进行对比
- **运行**：合成 0-LLM · **命令**：`npm run spike8a` · **它验证什么**：零 LLM 调用的 28 原子单事务修剪

实验结果和声明记录在[`docs/experiment-2026-08-16-separated-contract-probe.md`](docs/experiment-2026-08-16-separated-contract-probe.md)；每个数字都带有其工件路径。

## 已知平台差距（反馈给dsh）

开发非法学硕士压实后端时，压实缝中出现了三个可扩展性缺口。详细信息和重现脚本在[`docs/dsh-api-feedback-2026-08-17.md`](docs/dsh-api-feedback-2026-08-17.md)：

1. **没有关于工具/结果替换的结构化元数据通道** - 占位符必须克隆原始消息并且只能交换内容。
2. **`compaction/prune` 位于事务不变状态机之外** — 没有用于算法驱逐的本机事件类型；第三方引擎必须借用带有伪字段的 `summary` 语义。
3. **无头测试组件默默地禁用压力路径** - `mountAgentLoopTestDependencies` 未注册 `tokenMeter`，并且前置步骤捕获会吞掉错误。