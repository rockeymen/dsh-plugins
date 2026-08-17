# dsh-cybernetics

给 DeepSeek Harness（dsh）的 agent 装一套**控制论运行时**：让它在自主调用工具时具备
自我观测、风险拦截、失败率感知和自动降速的能力。

一句话：**防止 agent 在工具循环里跑飞**——重复调用、无限重试、不可逆误操作，
在它发生之前拦下，在它发生之后感知并收紧。

灵感与术语对照《工程控制论》（钱学森/宋健·第三版），但每一处都是可运行的工程机制，
不是概念装饰。

---

## 一、它解决什么问题

LLM agent 的工具调用循环本质是一个**开环系统**：模型决定调什么、调几次，没有人审核。
开环系统的经典故障在 agent 身上一一对应：

| 开环故障 | agent 上的表现 | 本插件的对策 |
|---|---|---|
| 无反馈 | 工具失败了照样重试，错上加错 | 反馈回路：估计失败率，超阈值自动收紧 |
| 无保护 | `rm -rf`、`git push --force` 直接执行 | 前馈拦截：不可逆操作先 block，要确认 |
| 无稳定边界 | 一轮里调几十次工具，上下文爆炸 | 稳定阀：每轮调用计数，超限警告收敛 |
| 无自检 | 任务需要的工具根本不存在，空转半天 | 能控性检查：开干前先验证工具齐备 |
| 振荡 | 同一命令成功/失败反复横跳 | 振荡检测：结果翻转率过高即告警 |
| 空转 | 相同参数的工具反复调用 | 冗余检测 + 工具分布熵度量 |

## 二、工作原理（做法）

按经典控制回路的四个部件实现，全部挂在 dsh 的 Cordis 插件事件上：

```
                ┌──────────────────────────────────────────┐
                │              agent 工具调用循环            │
                └──────────────────────────────────────────┘
   调用前                          调用后                     下一轮请求组装前
      │                              │                            │
      ▼                              ▼                            ▼
 tools/pre-execute            tools/result                  agent/pre-step
 ┌───────────────┐          ┌───────────────┐          ┌───────────────────┐
 │ 前馈控制        │          │ 反馈校正        │          │ 警告注入 + 计数重置  │
 │ · 规则表拦截    │          │ · delta(成败)   │          │ · pendingWarns     │
 │ · 本轮计数      │          │ · EMA 滤波 pHat │          │   合并为一条 user   │
 │ · 观测收集      │          │ · 控制律调档     │          │   消息注入上下文    │
 └───────────────┘          └───────────────┘          └───────────────────┘
```

### 1. 观测器（Observer）

每次工具调用（`tools/pre-execute`）时记录：工具名、参数哈希、时间戳；同时把见过的
工具名加入「已知工具集」并持久化到 `observed_tools.json`。所有事件追加写入
`state_log.ndjson`（JSONL，可复盘）。观测失败不阻断主流程——观测器自身永远不能
成为故障源。

### 2. 前馈控制（Feedforward）

调用**执行前**用规则表匹配，命中即 `block`：

- 规则 = 工具名白名单 + 参数正则 + 处置策略
- 默认两条：`network-unstable`（git/npm/curl/wget/pnpm → retry+timeout）、
  `irreversible-write`（rm/mv/shred/git push 等 → dry-run+confirm）
- 工具名白名单先行，正则只匹配参数——避免「命令文本里出现 rm 字样」的全文本误伤

前馈的本质：**已知扰动在影响系统之前就补偿掉**，不等出错再反馈。

### 3. 反馈校正（Feedback）

`tools/result` 把每次执行结果转成误差信号 `delta`（失败=1，成功=0），然后：

- **EMA 滤波**：`pHat = (1-α)·pHat + α·delta`，一阶递归估计真实失败率
  （α 默认 0.2）——不用单次成败做判断，抗噪
- **档位自适应**（负反馈控制律）：
  - `pHat ≥ 0.6` → 升档收紧：fast → deep → conservative
  - `pHat ≤ 0.15` 且连续 5 次 → 降档放松（滞环防抖，防止边界抖动）
  - 档位决定稳定阀阈值：fast=5 次/轮，deep=4，conservative=3
- **发散检测**：连续失败 ≥3 次 → 判定发散倾向，注入告警
- **振荡检测**：最近 10 次结果 0/1 翻转率 ≥0.7 → 判定自激振荡，注入告警

告警不直接打断执行，而是排队后在下一轮请求组装前（`agent/pre-step`）合并成一条
user 消息注入上下文——既让模型感知，又不破坏消息角色交替约束。

### 4. 稳定阀（Stability Valve）

每轮（每个请求）工具调用计数，超过当前档位阈值时注入收敛提示。设计上有意**降级
为警告而非硬切断**：v3 的教训是硬切断 + 跨轮累计会锁死会话（积分饱和），所以
v4 改为每轮重置 + 交互/观测工具豁免 + 超限只提醒一次。

### 5. 能控性 / 能观性自检（Controllability & Observability）

`cybernetics_check` 工具：给定目标和所需工具清单，对照当前已知工具集判定
`controllable / not-controllable`。关键设计：

- 已知工具 = 插件注册工具 ∪ 历史观测记忆 ∪ 本次会话实测
  （dsh 沙箱里 `ctx.tools.schemas()` 按插件 scope 过滤，看不到宿主工具，
  只能用被动观测法收集）
- 语义分层：**未观测 ≠ 缺失**。上次会话见过但本次没实测的工具标
  「caution 提示」，不直接判不可控——消除冷启动误报
- 能观性指标：`观测完整率 = result 事件数 / pre-execute 事件数`，
  反馈回路自身的健康度

### 6. 信息论度量（P2）

- 窗口内（默认 20 次）相同「工具+参数」调用 → 冗余计数
- 工具分布香农熵 → 调用多样性度量，熵塌陷 = agent 陷入单一循环

## 三、三个工具（执行器）

| 工具 | 作用 |
|---|---|
| `cybernetics_snap` | 状态快照写入日志；`mode` 参数可手动临时切档（60 秒后恢复自适应） |
| `cybernetics_status` | 读最近 N 条日志，输出 pHat / 档位 / 发散 / 振荡 / 熵 / 观测完整率摘要 |
| `cybernetics_check` | 能控性自检：目标 + 所需工具 → missing / controllable / advice |

三个工具均豁免稳定阀计数（观测行为不应消耗控制预算）。

## 四、安装

```bash
dsh plugin --profile web add github:boomzikazita/dsh-cybernetics
```

**关键**：插件的 `node_modules` 必须软链到 dsh 全局宿主的 node_modules，
**绝不要自己 pnpm 装依赖**——否则 `@deepseek-ai/dsh-tools` 出现两个副本，
module-level Symbol（`TOOL_RUNTIME_SCHEDULER`）不匹配，所有工具调度崩溃。

## 五、配置（cordis.patch.yml）

```yaml
- insert:
    - id: cybernetics
      name: 'dsh-cybernetics'
      config:
        stateLog: '~/.dsh/cybernetics/state_log.ndjson'
        feedforward:           # 追加/覆盖前馈规则
          - id: 'my-rule'
            tools: ['bash']
            pattern: '\\b(docker|systemctl)\\b'
            action: { strategy: 'dry-run+confirm', dryRun: true, confirm: true }
        stability:
          maxToolCallsPerTurn: 5
        control:
          alpha: 0.2              # EMA 系数，越大越灵敏
          escalateAt: 0.6         # 升档失败率阈值
          deescalateAt: 0.15      # 降档失败率阈值
          divergenceStreak: 3     # 连续失败判发散
          oscillationWindow: 10   # 振荡检测窗口
```

## 六、开发教训（为什么长这样）

1. **依赖副本冲突是头号坑**：插件自装宿主包 → Symbol 不匹配 → 全崩。软链解。
2. **waterfall 监听器必须 `return next()`**，光调不返回会断链。
3. **告警注入要在 `agent/pre-step` 做**，在 `tools/pre-execute` 里注入会破坏
   消息角色交替（TRANSPORT 报错）。
4. **稳定阀不能硬切断**：计数器必须随轮重置，必须留恢复路径——v3 的积分饱和
   锁死是血泪教训。
5. **控制律要自适应 + 滞环**：固定阈值不是过松就是过紧；反馈信号要滤波，
   否则单次失败就触发抖档。

## License

MIT
