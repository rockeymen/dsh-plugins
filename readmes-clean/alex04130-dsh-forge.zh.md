# 工具描述规范（中文化）

我们插件注册的模型工具（function call）的 description 与参数说明统一使用中文，理由：
- deepseek 系列模型的中文理解不弱于英文，中文描述不会造成准确性损失；
- 中文 token 密度更高，工具描述每轮进入系统提示，中文化持续节省 30–50% token；
- 用户与对话语境是中文，术语（提权/审批/子代理/会话）与上下文一致。

## 保留英文原样的部分

- 工具名（`session_send`、`spawn_model_subagent`…）、参数名（`provider`、`wake`…）
- 枚举值（`claimed | in_progress | completed | failed | cancelled`）
- 代码标识符（`childId`、`pluginId`、`agent-preset/selected`、`byModel`）
- 技术缩写与专名（LLM、API、id、token、ESM、Host、Client、GUI、web profile）
- 设置项名（`llm-pi-ai`）、技能名（`cross-session-mailbox` 等）
- 已知例外：`dev_stop_dyn_plugin` 的 description 整体保留英文（应急停止工具，面向救援场景；其参数说明仍为中文）。

## 术语对照表

### 英文 · 中文
- **英文**: subagent / child · **中文**: 子代理 / 子会话
- **英文**: spawn · **中文**: 派发
- **英文**: continuable · **中文**: 可续
- **英文**: escalation · **中文**: 提权
- **英文**: approval · **中文**: 审批
- **英文**: agent preset / mode · **中文**: 模式
- **英文**: composition · **中文**: 组合
- **英文**: capability face · **中文**: 能力面
- **英文**: provider · **中文**: 供应商（供应商路由）
- **英文**: reasoning effort · **中文**: 思考强度
- **英文**: tier / series · **中文**: 档位 / 系列
- **英文**: session · **中文**: 会话
- **英文**: inbox · **中文**: 收件箱
- **英文**: durable queue · **中文**: 持久排队
- **英文**: live / offline / persisted · **中文**: 在线 / 离线 / 已持久化
- **英文**: cold-resume / wake · **中文**: 冷启动 / 强制唤醒
- **英文**: team / captain / member · **中文**: 团队 / 队长 / 成员
- **英文**: task / dependency / claim · **中文**: 任务 / 依赖 / 认领
- **英文**: skill / progressive disclosure / always inject · **中文**: 技能 / 渐进式披露 / 默认注入
- **英文**: delegate model · **中文**: 被借调模型
- **英文**: billing / credential store · **中文**: 计费 / 凭据存储
- **英文**: roster / clamp / cap · **中文**: 名册 / 钳制 / 上限
- **英文**: steer · **中文**: 实时插入（steer）

## 必须保留的语义（翻译不得丢失）

- `model_call`：一次性文本补全；非任务委派、非子代理；被借调模型一个回合、不能调工具。
- `spawn_model_subagent` / `team_add_member`：默认继承父级（队长）；显式传参才覆盖该维度；提权（更高档位 / 跨系列 / 能力面超集 / sandbox 写权限比父级更宽）弹审批，未允许则取消。
- `session_find` 优先于 `session_list`（省上下文）。
- `wake: true` 消耗目标会话模型回合；仅主会话可用（子代理被拒），同一目标 60 秒内最多 3 次。