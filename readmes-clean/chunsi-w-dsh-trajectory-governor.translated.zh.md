# dsh-trajectory-governor

### ！！！在 DeepSeek pro 模型使用比较好

面向 DeepSeek Harness 的**闭环 Agent 轨迹控制平面**。它不是继续增强一句 persona，也不是把会话永久分成 spec/react，而是围绕真实事件流维护：

- Task Episode 与连续性关系；
- 当前工作阶段；
- 结构化信息增益；
- 修改后的验证债务；
- 重复调用与无新信息轨迹；
- scoped 工具能力面；
- 可选的自适应 reasoning effort；
- 本地、非模型可见的决策账本。

本项目是对 `dsh-mode-boost` 的 clean-sheet 重构，不依赖 preset fork，也不依赖 super-injector。

## 已实现的闭环

```text
真人消息被 inbox claim
  -> 在第一次 prompt assembly 前建立 Task Contract
  -> 判断 new / continuation / extension / correction / review / conversation
  -> 必要时通过 agent.ctx.tools.restrict() 暂时隐藏 write/edit
  -> agent/pre-step 在同一个请求内追加可重建的近场 policy message
  -> Native tool 或 Code Mode SDK 子调用产生 durable 事件
  -> 计算 observation novelty / mutation / verification
  -> 修改产生 Verification Debt
  -> readback + test/build/check 清偿债务
  -> 模型准备结束但债务未清时，最多自动追加有限验证步
```
## 安装

要求：

- Node.js `^22.19.0 || >=24.0.0`；
- DeepSeek Harness `0.1.0-rc.5` 或 `0.1.0-rc.6`。

从当前目录安装：

```sh
npm run build
dsh plugin --profile web add .
dsh --profile web --dump-config
```

从 npm 安装（推荐）：

```sh
dsh plugin --profile web add @chunsi-m/dsh-trajectory-governor
dsh --profile web --dump-config
```

如需固定版本：

```sh
dsh plugin --profile web add @chunsi-m/dsh-trajectory-governor@0.1.0
```

安装 tarball：

```sh
npm run pack:release
dsh plugin --profile web add ./chunsi-m-dsh-trajectory-governor-0.1.0.tgz
```

包已经声明正式的：

```json
{
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
}
```

所以 `dsh plugin --profile web add ...` 会把它加入 `web` profile 的 bundle 层，而不是只安装成无效普通依赖。

## 配置

`cordis.patch.yml` 默认配置：

```yaml
- insert:
    - id: trajectory-governor
      name: '@chunsi-m/dsh-trajectory-governor'
      config:
        mode: active
        adaptiveReasoning: false
        restrictBeforeEvidence: true
        autoVerify: true
        maxAutomaticContinuations: 1
        exposeStatusTool: true
        ledger: true
```

### 字段 · 默认 · 说明
- **字段**: `mode` · **默认**: `active` · **说明**: `off` / `shadow` / `active`；shadow 只决策和记账，不改请求
- **字段**: `adaptiveReasoning` · **默认**: `false` · **说明**: inspect/design/recover 阶段选择模型声明的最深 effort；阶段结束后恢复 provider default
- **字段**: `restrictBeforeEvidence` · **默认**: `true` · **说明**: fix/continuation 等任务在观察前临时隐藏已知专用写工具
- **字段**: `autoVerify` · **默认**: `true` · **说明**: 有验证债务时允许 `agent/turn-stopping` 追加验证步骤
- **字段**: `maxAutomaticContinuations` · **默认**: `1` · **说明**: 每个 turn 最多自动验证续步数；可设 0
- **字段**: `noInformationLimit` · **默认**: `3` · **说明**: 重复调用或相同结果达到阈值后进入 recovery
- **字段**: `exposeStatusTool` · **默认**: `true` · **说明**: 注册只读 `trajectory_policy_status` 工具
- **字段**: `ledger` · **默认**: `true` · **说明**: 写入本地 policy ledger，不进入模型历史
- **字段**: `ledgerPath` · **默认**: `$DSH_HOME/trajectory-governor/decisions.jsonl` · **说明**: 自定义账本路径
- **字段**: `maxHintChars` · **默认**: `1200` · **说明**: 单条 model-visible policy hint 上限

### 推荐上线顺序

先使用 shadow mode：

```yaml
mode: shadow
ledger: true
```

确认 relation/phase 判断符合真实会话后，再切换：

```yaml
mode: active
```

`adaptiveReasoning` 默认关闭，因为改变 reasoning effort 会改变 request header 与缓存形状。应在具体 provider/model 上完成校准后再启用。

## Task Episode

当前确定性 relation：

```text
new-objective
continuation
extension
correction
clarification
review
conversation
```

它综合：

- 指代与连续性词；
- 文件名和 artifact 重合；
- 与上一 objective 的词面相似度；
- fix/build/review 语义；
- 寒暄与短确认。

第一条消息是“你好”不会永久关闭插件；下一条真实任务会建立新的 objective。

## 能力面控制

当前版本只把明确的 `write`、`edit` 视为专用 mutation 工具。`str_replace_editor` 是读写混合工具，只有在仍有独立 `read` 时才会被暂时隐藏。

这使它不会把 Minimal preset 变成零观察能力，同时在 Code Mode 下 restriction 会自动改变生成的 TypeScript SDK，而不会删除保留 transport `run_code`。

限制是：`bash`/`pwsh` 可以同时读写，当前版本不会把未知 shell 命令当作硬 mutation。Governor 是轨迹策略，不是安全边界；真正权限仍由官方 sandbox/approval 执行。

## Verification Debt

成功的 `write/edit/str_replace_editor mutation` 会创建验证债务：

- 源代码：需要 readback + test/build/check；
- 文档：需要 readback；
- 未知 artifact：需要可执行验证。

以下 shell 命令会被识别为 verification：

```text
npm/pnpm/yarn/bun test|build|lint|typecheck|check
pytest / vitest / jest / mocha / tsc
cargo test / go test / dotnet test / mvn test / gradle test / make test
```

债务未清时，Governor 最多按配置追加有限验证步；到达上限后不会无限循环。

## Native 与 Code Mode

Governor 同时观察：

- Native：`tool/call` / `tool/result`；
- Code Mode：`tool/code-dispatch-start` / `tool/code-dispatch`。

因此 `run_code` 内部的 read/write/edit 也会更新信息增益、释放 restriction、创建并清偿验证债务。

## 状态工具

```text
trajectory_policy_status
```

返回当前调用 Agent 自己的：

- episode / human round；
- relation / kind / phase / risk；
- artifacts；
- observed / mutated artifacts；
- 当前 restriction；
- no-information 与 repeated-call 计数；
- open verification debt；
- 最终 assembly hash。

实现严格使用 `exec.agent`，不会读取“最后组装请求的另一个会话”。

## 决策账本与隐私

默认路径：

```text
$DSH_HOME/trajectory-governor/decisions.jsonl
```

账本保存：

- session/message id；
- 原消息 SHA-256，不保存原文；
- relation、phase、risk、complexity；
- restriction；
- tool effect、artifact、错误、novelty；
- open verification debt；
- request assembly hash；
- turn stop reason。

账本失败永远不会阻断 Agent。当前版本尚未实现日志轮转，长期运行部署应自行轮转或关闭 ledger。

## 构建与测试

```sh
npm install
npm run check
```

当前测试覆盖：

- Task Episode 关系；
- 寒暄后真实任务；
- correction / extension continuity；
- artifact 提取；
- tool semantics；
- verification debt；
- Minimal 防失能；
- Code Mode restriction；
- 首次请求前捕获输入；
- 同请求近场 policy；
- runtime context 保留；
- 观察后释放写工具；
- 自动验证续步上限；
- adaptive reasoning 选择与恢复；
- 多会话状态隔离；
- shadow mode 请求不干预。

## 当前限制

- relation engine 是可解释规则基线，不是 learned classifier；
- artifact graph 目前以路径和工具参数为主；
- shell 命令语义只能保守识别；
- 没有自动 subagent evaluator；
- 没有 contextual bandit；
- 没有 workspace counterfactual fork runner；
- 外部插件尚无官方 custom durable SessionEvent 注册面，所以研究决策存在 sidecar，而不是伪造未知 session event；
- Governor 不替代测试、sandbox、approval 或人工评审。

## 代码结构

```text
src/core.ts       Task Episode、PolicyPlan、工具语义、Verification Debt 纯逻辑
src/index.ts      Harness runtime hooks 与闭环控制
src/ledger.ts     本地 append-only sidecar
cordis.patch.yml  官方 DSH bundle 层
tests/            纯逻辑与真实 AgentLoop 集成测试
```