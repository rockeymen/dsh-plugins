# dsh-orchestrate

> **One prompt. A team of agents.** ｜ 一句话，一支 Agent 队伍。

![dsh-orchestrate 概念图](./docs/concept.png)

让 DeepSeek Harness（dsh）的主 Agent 在合适时候**主动、积极**地调用子 Agent 完成并行任务：
`orchestrate_delegate` 并行拆分、`orchestrate_review` 对抗审查、`orchestrate_explore` 多样性探索，
`orchestrate_status` / `orchestrate_stop` / `orchestrate_converge` 跟踪、中止与收敛；
附 `orchestration:policy` 决策注入（**仅根 Agent 可见**），教模型判断"何时该派、何时不该派"。

> ⚠️ 第三方插件，非官方出品。构建于官方 `subagent` 能力族（`ctx.subagents`）之上，只做
> 决策层 + 编排模式层 + 收敛层。

## 为什么

- 官方已有完整的 subagent 底层（spawn/continuable/toolFilter/structured output），但模型只有
  "可以派"的能力，没有"何时主动派、怎么拆、怎么等、怎么收"的编排层。
- 一个 Agent 的能力有上限：长任务串行、方案没有第二视角、多方向只能拍脑袋。
- 本插件把 Proma `agent-collaboration` 的协作方法论（并行拆分/对抗审查/多样性探索）工程化。

**真实 API 验证（Spike C，2026-08-16）**：10 个应编排任务 **100% 主动触发**编排，
10 个对照任务 **0% 误触发**（deepseek-v4-flash）。触发率依赖任务书自包含——与插件设计一致。

## 安装

```sh
# 从当前 checkout 安装；provider 版本必须与宿主 DSH 匹配
# 0.1.0-rc.6 是本项目当前验证过的组合
dsh plugin --profile demo add \
  @deepseek-ai/dsh-subagent-spawn-in-process@0.1.0-rc.6 .

# 从 npm 安装同一组合
dsh plugin --profile demo add \
  @deepseek-ai/dsh-subagent-spawn-in-process@0.1.0-rc.6 \
  dsh-orchestrate@0.3.1
```

插件默认使用 `spawn` provider；官方 provider 必须由 DSH profile 单独安装，且版本要与宿主 DSH 匹配。
本仓库当前验证组合是 `0.1.0-rc.6`；`fork`/`acp` 需要用户自行安装并验证对应 provider。

## 使用

在 dsh Web UI 里对 Agent 说：

```
并行调研这三个方向：① SQLite vs DuckDB 存储，② RAG chunk 策略，③ 索引方案。
```

Agent 会主动调用 `orchestrate_delegate`，返回：

```
🧩 编排完成（run run-8ca117bf，3/3 成功）
  [0] ✅ SQLite 更适合小规模…
  [1] ✅ 512-token 重叠 10%…
  [2] ✅ HNSW 优于 IVF…
```

长任务可后台化：`run_in_background: true` 立即返回 runId，稍后用 `orchestrate_converge` 收敛。

### 工具

### 工具 · 作用
- **工具**: `orchestrate_delegate` · **作用**: 并行拆分：`tasks`（任务书数组）/ `task`（单任务）/ `template`（模板引用：`delegations/.yml` + `templateArgs` 占位符填充）；并发默认 4、超时默认 10 分钟；支持 `run_in_background`（后台化）、`converge.mode: all/any`、`retryFailed`、`role`、`model`（per-run 模型）、`maxTokens`（软预算）；返回结构化汇总（每个结论标注来源子会话）
- **工具**: `orchestrate_review` · **作用**: 对抗式审查：spawn 多个只读审查者子 Agent 挑毛病，返回风险/假设挑战/边界/建议的机械汇总；父 Agent 逐条评估；支持 `aspects`/`reviewers`（1-5）/`model`/`maxTokens`
- **工具**: `orchestrate_explore` · **作用**: 多样性探索：spawn 多个只读调研者子 Agent 沿独立方向探索，返回带置信度的发现报告；支持 `directions`（上限 6，超限截断提示）/`model`/`maxTokens`
- **工具**: `orchestrate_converge` · **作用**: 收敛后台编排：按 `runId` 阻塞等待全部子会话完成并返回完整汇总（可重复读）
- **工具**: `orchestrate_status` · **作用**: 查询编排任务与子会话状态（含后台 run 的完成比例）
- **工具**: `orchestrate_stop` · **作用**: 中止进行中的编排任务（子会话以 aborted 收尾）

> 后台模式（`run_in_background: true`）忽略 `converge.mode=any` 与 `retryFailed`（语义不适用，调用时在 note 提示）。

### 角色（persona）

子 Agent 可指定 `role`（`orchestrate_delegate` 参数；review/explore 内定角色）：

### role · 视角 · 结构化输出
- **role**: `executor`（默认） · **视角**: 独立完成子任务并汇报 · **结构化输出**: `{ summary, findings[], open_questions[] }`
- **role**: `reviewer` · **视角**: 对抗式审查：风险/假设/边界/建议 · **结构化输出**: `{ verdict, risks[], assumptions_challenged[], edge_cases[], suggestions[] }`
- **role**: `researcher` · **视角**: 方向探索，标注置信度 · **结构化输出**: `{ summary, findings[], confidence, evidence[] }`
- **role**: `devil` · **视角**: 刁难压力测试：反面论点与推演 · **结构化输出**: `{ challenge, counterpoints[], what_if[] }`

### 行为细节

- **子 Agent 结构化输出**：按角色强制对应 schema（官方 `structured_output` 机制）。
- **防递归**：每个子 Agent 自动隐藏 `orchestrate_*` 工具（Spike B 验证 one visibility），
  且子请求显式传 `maxDepth=1`；toolFilter 降级时深度上限仍生效。
- **决策注入方案 C**：`orchestration:policy` 段按 delegationDepth 过滤——**仅根 Agent 可见**，
  子 Agent 的 prompt 里完全没有该段（2026-08-16 落地）。
- **只读**：依赖官方部署 sandbox 默认 `read-only`（若部署改为 workspace-write，子 Agent 将继承写权限）。
- **失败语义**：子会话失败（error/refusal/max-tokens）标记为 failed，partial output 保留；
  `retryFailed` 只重试非中止类失败；`mode=any` 在成功数不足但所有任务已结束时返回失败汇总，不会永久等待。
- **成本控制**：`converge.timeoutMs` 超时中止在途子会话；`maxTokens` 软预算（按输出长度
  估算 token，超限中止余下子会话，估算值返回在 `costTokens`）；任务数上限 20。
- **取消**：用户/模型取消当前回合时，在途子会话一并中止（父级信号接入）。

### 使用限制

- `task` 路径不自动拆分（等价单任务）；请先自行将父任务拆成任务书数组。
- 编排状态存于进程内，重启后需重新编排（跨重启恢复未实现）。
- `costTokens` 为估算值（输出长度近似），非官方 token 计数。
- 后台 run 受 `timeoutMs` 兜底；收敛语义依赖官方 one-shot 子会话（未用 continuable 后台）。

## 配置

### 键 · 默认 · 含义
- **键**: `provider` · **默认**: `spawn` · **含义**: in-process spawn provider 名
- **键**: `auto` · **默认**: `true` · **含义**: 是否注入 `orchestration:policy` 决策段（`false` = 只被动响应）
- **键**: `denyTools` · **默认**: `orchestrate_*` · **含义**: 子 Agent 需隐藏的工具名列表
- **键**: `maxDepth` · **默认**: `1` · **含义**: 子 Agent 递归深度上限
- **键**: `templatesDir` · **默认**: 包内 `delegations/` · **含义**: 任务书模板目录（可挂载外部模板库）
- **键**: `registryCapacity` · **默认**: `100` · **含义**: registry 保留编排记录上限（超出时淘汰最旧记录）

## 模板库

`delegations/` 提供 10 个任务书模板（调研对比/代码审查/竞品分析/bug 排查等），
可通过 `orchestrate_delegate` 的 `template` 参数直接引用（模式插件化）：

```
调用 orchestrate_delegate，template=code-review-multi，templateArgs={ module: ['src/a', 'src/b'] }
```

模板约定：`templateArgs` 中值为字符串数组的参数（如 `module`/`items`/`competitor`）
每个元素展开为一条独立任务，其余字符串参数作为公共上下文注入。
欢迎 PR 贡献新模板（对标 dsh-bench 的 `datasets/`）。

## 评测（collab 套件）

**Collab real 扩展集（2026-08-17）**：开发期间的 27 条任务全量运行与分批复测显示，显式应编排任务 11/12（91.7%），隐式自主编排 1/5（20.0%），应编排合计 12/17（70.6%），对照任务 0/10 误触发。该评测数据来自宿主项目开发环境，不随 standalone 仓库或 npm 包发布。

## Roadmap

- [x] M1：`delegate` / `status` / `stop` + 决策注入 + 模板库（16 测试）
- [x] M2：`review` / `explore` / persona / per-run 模型（30 测试）
- [x] M3：模板参数化、后台化（`converge`）、决策注入方案 C、collab 套件、Spike C（54 + 37 测试）
- [x] `0.3.0`：首次公开发布到 npm；entry 使用命名导出并在 release build 中禁用 workspace path aliases
- [x] `0.3.1`：修复 `mode=any` 零成功时的收敛挂起；standalone 文档、CI、LICENSE 与发布元数据同步
- [ ] UI 卡片

## Development

```sh
pnpm install
pnpm test       # 55 tests
pnpm typecheck
pnpm build
```