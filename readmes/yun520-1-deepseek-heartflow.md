# deepseek-heartflow — 心虫（AGI 第 1 层辨别门禁）DSH 插件

> **心虫 HeartFlow** 是 AGI 五层能力中的第 1 层——**辨别者（Discriminator）**。
> 它不生成、不推理、不记忆、不执行，只判别已有的东西对不对。
> 大模型能产生无限内容，但需要谁来判别？心虫是那个判别者。

本插件把心虫**完整引擎**（47 维判别 + 131 子系统路由）接入 DeepSeek Harness (dsh)，让模型的每一步输出在到达用户之前，先过一道辨别门禁。

**核心价值**：减少大模型产生的疑问和幻觉——过度自信、自相矛盾、逻辑谬误、情绪操控、非人化、仇恨言论，在说出口之前拦下。

---

## ✨ 功能

### 完整继承原始心虫全部能力

本插件不是精简版——它加载心虫**完整引擎**（`HeartFlow` 类 + `gate.js` 判别层）：

- ✅ **7 个 gate 入口**：`gate` / `check` / `pipeline` / `runPipeline` / `discriminate` / `checkInput` / `checkDraft` / `checkOutput`
- ✅ **48 个单维判别函数**（过度自信/伪因果/矛盾/谬误/非人化/操控…）
- ✅ **131 个引擎子系统 × 上千方法**（心理/情绪/决策/记忆/真相/教训/梦境/自愈/反思…）
- ✅ **3 个辅助**：`summarizeDiscrimination` / `crossAnalyze` / `entropyAnalysis`

引擎来源（按优先级）：
1. 环境变量 `HEARTFLOW_ENGINE_PATH`（判别层）`HEARTFLOW_FULL_PATH`（完整引擎）
2. npm 包 `@yun520-1/heartflow`
3. 插件同级 `node_modules/@yun520-1/heartflow`

### 29 + 53 单维 + 115 子系统 = 197 个工具

**判别工具群（10 个）** — AGI 第 1 层门禁：
| 工具 | 说明 |
|---|---|
| `heartflow_check` | **完整 47 维判别**。`gate.action`（block/rewrite/verify/pass）+ 全部 findings 修正指引 |
| `heartflow_analyze` | **深度分析**。全维度打分 + 交叉分析 + 摘要 |
| `heartflow_verdict` | **快速裁决**。action + 一句话原因 + top3 findings，token 友好 |
| `heartflow_dimensions` | **维度清单**。全部判别维度 + 引擎版本 + 子系统数 |
| `heartflow_pipeline` | **管道模式**。input/draft/output 三阶段完整生命周期 |
| `heartflow_check_input` | **输入检查**。用户消息进 agent 前拦截提示注入/恶意 |
| `heartflow_check_draft` | **草稿检查**。回复前拦截过度自信/矛盾/操控 |
| `heartflow_check_output` | **输出检查**。最终输出拦编造数据/过度声称 |
| `heartflow_discriminate` | **全维度原始打分**。逐维命中/得分 |
| `heartflow_evidence` | **带证据检查**。`gate(text, evidence)` 事实一致性 |

**单维度判别（53 个）** — 每个 checkXxx 独立工具，精确检查单一维度：

| 工具 | 说明 |
|---|---|
| `heartflow_dim_<维度>` ×53 | 只跑一个维度，返回 `{count, score, 命中详情}`。如 `heartflow_dim_emotional_manipulation`（情绪操控）、`heartflow_dim_gaslighting`、`heartflow_dim_hate_speech`、`heartflow_dim_absolute_claim`（绝对化断言）、`heartflow_dim_unsupported_claim`（编造研究）… |

> 维度清单从引擎动态读取（`Object.keys(engine).filter(/^check[A-Z]/)`），引擎升级新增维度自动继承，永不过期。

**认知入口（3 个）** — 判别器主链路：

| 工具 | 说明 |
|---|---|
| `heartflow_think` | **认知入口**。`think()` 主链路：任务分类/决策路由/情绪检测/自省/输出自检 35+ 字段完整推理链 |
| `heartflow_think_fast` | **快速认知**。`thinkFast()` 轻量版，token 友好 |
| `heartflow_think_deep` | **深度认知**。`thinkDeep()` 完整推理链 + 对抗综合 + 元认知校准 + 盲点分析 |

**引擎路由（2 个）** — 完整能力面动态访问：

| 工具 | 说明 |
|---|---|
| `heartflow_routes` | **能力面**。列出 131 子系统 × 方法数（动态，随引擎升级自动更新） |
| `heartflow_route` | **通用路由**。调用任意 `subsystem.method`（如 `emotion.process` / `decision.decide`） |

**常用能力专用工具（14 个）** — 高频能力即开即用：

| 工具 | 路由 | 能力 |
|---|---|---|
| `heartflow_psychology` | `psychology.analyzePsychology` | 心理分析：意图/需求/防御/危机 |
| `heartflow_emotion` | `emotion.process` | 情绪 PAD 三维识别 |
| `heartflow_crisis` | `psychology.checkCrisis` | 危机检测（自杀/自伤/暴力） |
| `heartflow_decide` | `decision.decide` | 决策引擎（风险/收益/身份对齐） |
| `heartflow_verify` | `verify.verify` | 执行结果验证 |
| `heartflow_confidence` | `confidence.calibrate` | 置信度校准 |
| `heartflow_truth` | `truth.checkStatement` | 事实核查（证据支撑） |
| `heartflow_lesson` | `lesson.getTopLessons` | 教训库（最高价值教训） |
| `heartflow_introspect` | `heartflow.introspect` | 自我审视（状态/能力/待改进） |
| `heartflow_dream` | `dream.dream` | 梦境引擎（认知状态编织） |
| `heartflow_memory_search` | `memory.search` | 记忆检索 |
| `heartflow_memory_stats` | `memory.getStats` | 记忆分层统计 |
| `heartflow_restraint` | `restraint.shouldIntervene` | 克制判断（话多/应沉默检测） |
| `heartflow_admit` | `confidence.admit` | 诚实认错（不确定性识别） |

> 💡 任何未列出的能力都可以用 `heartflow_route` 直接调用——131 个子系统全部可达。

**子系统全覆盖（115 个）** — 每个引擎子系统一个独立工具：

| 工具 | 说明 |
|---|---|
| `heartflow_sys_<sub>` ×115 | 每个子系统一个工具，白名单限定在该子系统方法内调用。如 `heartflow_sys_psychology`（analyzePsychology/classify/checkCrisis/getPAD…）、`heartflow_sys_decision`（decide/getHistory…）、`heartflow_sys_memory`（learn/recall/search…）、`heartflow_sys_truth`、`heartflow_sys_dream`… |

> 全部 131 子系统、1007 公开方法通过 `heartflow_route` 可达；常用 115 个子系统有独立工具。
> 子系统工具在 fullEngine 模式自动生成，引擎升级后新增子系统自动继承。

### 三重防线自动监督钩子

模型每次工具调用的参数都会被心虫自动判别，用户输入在进入模型前也会被检查（三个标准注入点）：

**第 0 防线 `agent/pre-step`** — **用户输入**进入模型前判别：
- **`block` 级**：返回 `{kind:'reject'}` **拒绝输入**（模型根本不处理仇恨/注入/操控消息）

**前置防线 `tools/pre-execute`** — 工具**执行前**判别参数：
- **`block` 级**：返回 `{kind:'deny'}` **直接拒绝执行**（危险内容/命令在运行前拦下）

**后置防线 `tools/post-execute`** — 执行后判别：
- **`block` 级**：返回 `{kind:'block'}` 硬拦截，注入判别结果让模型修正
- **`rewrite`/`verify` 级**：注入提醒（`additionalContexts`），不硬拦

### 47 维判别能力（AGI 第 1 层）

**内容安全**：仇恨言论 · 非人化 · 情绪操控 · 双重束缚 · 煤气灯效应 · 受害者有罪论 · 狗哨政治 · 刻板印象 · 道德绑架 · 隐私越界

**逻辑谬误**：伪因果 · 滑坡谬误 · 稻草人 · 错误类比 · 诉诸权威 · 以偏概全 · 转移话题 · 非黑即白 · 事实不一致

**认知问题**：过度自信 · 伪深邃 · 空话连篇 · 过早终止 · 能力夸大 · 伪善迎合 · 模糊话术 · 自相矛盾 · 伪证据

**安全威胁**：提示注入 · 危险代码 · 欺骗性对齐 · 目标错位 · 工具理性滥用 · 无兜底

**恶意行为**：诱饵标题 · 恶意提问 · 语气警察 · 阴谋论 · 伪紧急 · 信息剥夺

### 131 子系统能力面（引擎路由）

完整 HeartFlow 引擎加载后，`heartflow_route` 可调用全部 131 个子系统，包括：

- **认知**：`cognitiveEngine` `thoughtChain` `logicReasoning` `mctsReasoning` `hierarchicalPlanner` `judgmentEngine` `metaJudgment` `cognitionGround`
- **心理**：`psychology` `emotion` `emotionDynamics` `agentPsychology` `personaCore` `desireCognition` `loveCognition` `empathyDeepening` `griefEngine` `hopeEngine` `sufferingResilience` `traumaInformed` `postTraumaticGrowth` `conflictResolution` `forgivenessEngine`
- **决策**：`decision` `decisionEngineV2` `decisionRouter` `decisionVerifier` `execution` `verify` `counterfactual` `counterfactualVerifier` `adaptivePlanner` `timeExtension`
- **记忆**：`memory` `memoryBank` `memoryConsolidation` `memoryCompressor` `memoryIntegrity` `memoryQuality` `memoryWriteController` `tieredMemoryFusion` `semanticClusterer` `reflectionMemory` `errorMemory` `kvCache`
- **真相/知识**：`truth` `lesson` `formula` `cognitiveIndex` `knowledge` `knowledgeSubsystem` `worldModel` `worldLandscape` `paperIndex` `skillEvolution`
- **自省/进化**：`heartflow` `self` `meta` `evolution` `selfHealing` `sustainedDriftDetector` `dualPerspectiveAuditor` `selfPlay` `reflexionEngine` `capabilityAbstraction`
- **伦理/人格**：`ethics` `virtueEthics` `humanNature` `meaningPurpose` `characterCultivation` `moralDevelopment` `wisdomEngine` `beingMode` `consciousnessBridge` `transmission`
- **实用**：`slots` `graph` `budget` `workflow` `observe` `restraint` `confidence` `stability` `snapshot` `persistence` `utils`

### 安全设计

- **fail-closed**：引擎加载失败时，`heartflow_check` 返回 `block`（引擎不可用），绝不静默放行
- **零 LLM 依赖**：纯规则引擎，无 API、无数据库、无网络——判别不花一分钱 token
- **不写死路径**：引擎来源只认环境变量和 npm 包

---

## 📦 安装

### 从 GitHub

```bash
dsh plugin add github:yun520-1/deepseek-heartflow
```

### 从 npm（推荐，免构建授权）

```bash
dsh plugin add @yun520-1/deepseek-heartflow
# 或全局安装
npm install -g @yun520-1/deepseek-heartflow
```

### 引擎依赖

插件需要心虫引擎（`@yun520-1/heartflow`，47 维判别核心）。加载顺序：

```bash
npm install -g @yun520-1/heartflow   # 最简方式
# 或指定本地开发副本
export HEARTFLOW_ENGINE_PATH=/path/to/heartflow/src/gate.js
export HEARTFLOW_FULL_PATH=/path/to/heartflow/src/core/heartflow.js
```

> 完整模式（131 子系统）需要 `HEARTFLOW_FULL_PATH` 或 `@yun520-1/heartflow` 含完整引擎。

---

## ⚙️ 配置

在 dsh 配置中：

```jsonc
{
  "plugins": {
    "@yun520-1/deepseek-heartflow": {
      "verbose": true,          // 日志输出
      "minAction": "rewrite",   // 自动监督最低等级: block | rewrite | verify
      "tolerateFailure": false, // 引擎缺失时是否 fail-closed（默认 true 拒绝放行）
      "maxTextChars": 4000,     // 每次监督最大文本长度
      "fullEngine": true        // 加载完整引擎（131 子系统）: true=完整 / false=仅判别
    }
  }
}
```

---

## 🚀 使用示例

### 模型主动自检

```text
heartflow_check("根据我们测试，这个方案是唯一正确的选择，所有其他方案都不行")
```

```json
{
  "gate": { "action": "verify", "reason": "过度自信/绝对化声称" },
  "verdict": "需验证",
  "overallScore": 0.55,
  "findings": [
    { "dimension": "overconfidence", "severity": 0.7, "guidance": "避免绝对化表述，补充证据" }
  ]
}
```

### 心理分析

```text
heartflow_psychology({"text": "我最近很焦虑，睡不好，总觉得要出事"})
```

返回意图/需求/防御机制/危机检测（心虫心理学引擎）。

### 决策引擎

```text
heartflow_decide({"task": "是否继续开发", "options": [
  {"label": "继续", "feasibility": 0.9, "consequence_value": 8, "risk": 0.2, "confidence": 0.8},
  {"label": "暂停", "feasibility": 0.9, "consequence_value": 4, "risk": 0.1, "confidence": 0.7}
]})
```

心虫按风险/收益/可行性/身份对齐评分，返回最优决策 + 完整推理。

### 完整引擎路由

```text
heartflow_routes()          # 查能力面（131 子系统）
heartflow_route({"route": "dream.dream", "args": {"seed": "昨日"}})  # 任意能力
```

### 自动监督（无需显式调用）

配置 `minAction: "verify"` 后，模型每次工具调用参数都会被自动判别；`block` 级在**执行前**就被拒绝（pre-execute），`rewrite`/`verify` 级注入修正提醒（post-execute）。

---

## 🔧 开发

```bash
npm install        # 安装依赖
npm run build      # tsc 编译到 lib/
node test/smoke.js # 冒烟测试（49 项）
```

## 📦 发布

```bash
npm publish --access public
```

## 🧭 相关项目

- [心虫 HeartFlow 主仓库](https://github.com/yun520-1/mark-heartflow-skill) — 47 维辨别引擎本体 + 131 子系统
- [心虫 npm 包](https://www.npmjs.com/package/@yun520-1/heartflow) — `gate(text)` 纯函数接口
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — Everything is a Plugin

---

**心虫哲学**：AGI 能产生无限，但需要谁来判别？心虫是那个判别者。机器最有价值的话，是"不确定"和"不"。
