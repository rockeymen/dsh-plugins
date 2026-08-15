#OpenGuardrails

**用于人工智能代理安全的供应商中立协议以及对供应商进行排名的中立基准。**

将安全与保障集成一次，在每个代理和法学硕士中强制实施，而不是手动将每个供应商连接到每个工具。

Apache-2.0 · [openguardrails.com](https://openguardrails.com)

这个 monorepo 是 **OpenGuardrails (OGR) 规范及其规范的所在地
参考集成**。本说明书为规范性合同
集成和探测器说话；集成、基准、示例、技能、
和网站并存，因此可以一起审查和测试更改。

OGR **不是护栏产品**：它定义了电线并裁判了
排行榜。供应商在通用插头的检测质量上展开竞争；用户
获得一种方法来配置和构建每个代理的安全保障
跑。

- 我们定义 **wire** — 会话/回合/步骤/调用模型、事件、判决、
  组成、分类。
- 我们**裁判**基准。
- 我们**不**构建检测能力——供应商在合同背后进行竞争。

## 模型

代理在循环中工作，OGR 名称以代理线束的方式循环：
一次**会话**（一次对话）举行**轮次**（一条指令 →
静止，有原因关闭），一回合保持**步骤**（一个模型调用
每个），并且步骤的响应包含**调用**（该工具调用所要求的模型
为）。一个步骤被报告为两个事件——模型之前的 `step/request`
调用，`step/response` 在它之后和代理执行之前 - 每个事件都会得到
目前的判决整合仍然可以拒绝。

```
  agent-direct integrations          gateway integrations
  (a plugin in the harness, or       (an LLM proxy: Higress, …)
   the harness calling the API       sees one model call at a time;
   itself — declares session/        the runtime derives the
   turn/step, reports turn ends)     coordinates server-side
        │                                  │
        ▼                                  ▼
   ┌───────────────────────────────────────────┐
   │  OGR core contract                        │
   │  GuardEvent · Verdict ·                   │
   │  composition · taxonomy                   │
   └───────────────────────────────────────────┘
                       ▲
                       │
                detector plugins
               (config rules OR model/classifier)
```

## 为什么要制定标准

如果没有 OGR，保护代理的安全就是一个 `N × M × L` 集成问题：每个
代理、每个探测器供应商、每个 LLM 协议都成对连接。 OGR崩溃
其为 `N + M + L` — 根据合同集成一次。

## 两层：API → 插件

**没有 SDK 层。** API 是集成表面 - 两个 POST
端点和两个规范配方 - 和代理开发人员通过以下方式集成
直接调用它：

### 层·它是什么·在哪里
- **层**：**API** · **它是什么**：运行时（PDP）公开的线路合约：`POST /v1/evaluate`、`POST /v1/ingest`、心跳、健康状况 - 携带 `GuardEvent` 并返回 `Verdict` - 加上两个 [集成配方](specification/runtime-api.md#the-two-integration-recipes)。 · **其中**：[运行时 API 绑定](specification/runtime-api.md) + [JSON 架构](schema/)
- **层**：**插件** · **它是什么**：用于一个表面（代理线束或网关）的挂钩，用于观察步骤、构建事件并强制执行判决，直接使用 API。 · **哪里**：[`integrations/`](integrations/)

## 规范组成部分

### 组件 · 它的定义是什么 · OTel 模拟
- **组件**：[概述](specification/overview.md) · **它定义了什么**：会话/回合/步骤/呼叫模型和两个集成点 · **OTel 模拟**： —
- **组件**：[GuardEvent](specification/guard-event.md) · **它定义什么**：在集成点观察到的类型化单元 · **OTel 模拟**：跨度/日志记录
- **组件**：[Verdict](specification/verdict.md) · **它定义什么**：运行时关于事件的决定 · **OTel 类似物**： —
- **组件**：[组合](specification/composition.md) · **它定义了什么**：多个探测器的答案如何组合成一个决策 · **OTel 模拟**： —
- **组件**：[降级模式](specification/degraded-mode.md) · **它定义了什么**：当运行时无法访问时集成会做什么 · **OTel 类似**： —
- **组件**：[运行时 API](specification/runtime-api.md) · **它定义了什么**：运行时公开的 HTTP 绑定，以及两个集成配方 · **OTel 类似**：OTLP/HTTP

风险类别位于 [分类法](specification/taxonomy.md)（`safety.*` 和
`security.*`），版本化且可交换 - 合约引用类别 ID，但
对“不安全”保持中立。

## 两个域名，一份合约

- **安全** — 有害*内容/行为*（毒性、自残、CSAM、品牌、
  主题）。主要是在内容 I/O 边界处进行分类器判断。
- **安全** — *系统妥协*（提示注入、数据泄露、
  恶意命令、SSRF、秘密泄露、供应链）。根据行动来判断
  和数据流——工具调用将要做的事情。

合同是统一的；管道和执行点不同。开始于
[概述](specification/overview.md)。

## 一致性和基准

- 如果检测器接受 `GuardEvent` 并返回
  针对 [JSON Schemas](schema/).] 有效的 `Verdict`。请参阅[CONFORMANCE.md](CONFORMANCE.md)。
- [benchmark](benchmarks/) 评估共享语料库上的一致性检测器
  并公布排行榜。

## Monorepo 布局

### 路径·它包含什么
- **路径**：[`specification/`](specification/) 和 [`schema/`](schema/) · **它包含什么**：规范协议、模式（JSON 模式 + OpenAPI）、分类、一致性和治理。
- **路径**：[`integrations/`](integrations/) · **它包含什么**：代理和网关集成，每个都直接讲 API。
- **路径**：[`benchmarks/`](benchmarks/) · **它包含什么**：中性探测器基准和排行榜。
- **路径**：[`examples/`](examples/) · **它包含什么**：可运行的示例和集成索引。
- **路径**：[`skills/openguardrails/`](skills/openguardrails/) · **它包含什么**：代理起草和执行政策的技能。
- **路径**： — · **它包含什么**：[openguardrails.com](https://openguardrails.com) 位于单独的存储库中；该存储库包含协议并插入其文档。

### 集成状态

v0.6 SDK 包（PyPI 上的 `openguardrails`、`@openguardrails/core` 上的
npm）以及基于它们构建的插件**在 v0.7 中退役** - API 是
现在集成表面。集成按插件原样返回插件
针对 v0.7 合约重写：

### 类别·目标·状态
- **类别**：**网关** · **目标**：Higress (Go/WASM) · **状态**：[`integrations/gateway/higress`](integrations/gateway/higress/) — **v0.7 参考网关集成（配方 B）**
- **类别**：**代理** · **目标**：DeepSeek Harness (`dsh`) · **状态**：[`integrations/agent/dsh`](integrations/agent/dsh/) — **v0.7 参考代理直接集成（配方 A）**
- **类别**：· **目标**：Claude Code·Codex·opencode·OpenClaw·Hermes·LangGraph·**状态**：v0.6-stale，待 v0.7 重写
- **类别**：**网关** · **目标**：OpenAI/Anthropic 示例 · mitmproxy · **状态**：v0.6-stale，待 v0.7 重写

## 发展

```bash
# benchmark tests
python -m pip install pytest && python -m pytest

# higress plugin
cd integrations/gateway/higress && go test ./...

# dsh plugin (npm workspace)
npm install && npm run build && npm test
```

## 原则

1. **中立。** 该协议是开放的并且由基金会管理；基准是
   裁判员，不是参赛者。
2. **标准化边界，而不是大脑。** 检测保持竞争力。
3. **按照安全带的方式命名循环。** Session、turn、step、call — 一个
   集成永远不应该翻译自己的词汇来表达
   电线。
4. **声明的节拍派生。** 拥有其循环的集成会标记
   坐标；运行时仅针对无法获得的有利位置进行重建
   知道，并说出你得到的答案。

## 状态

当前协议版本：**v0.7**（请参阅 [CHANGELOG.md](CHANGELOG.md)
协议版本）。 v1 之前的次要版本在发布之间仍可能会中断；
每次中断都会被记录下来。参见
[GOVERNANCE.md](GOVERNANCE.md) 了解规范如何演变。欢迎贡献——
[贡献.md](CONTRIBUTING.md)。