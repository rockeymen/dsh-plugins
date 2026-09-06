#dsh-codex-workflow

DeepSeek Harness 插件赋予 Codex 只读计划/审核角色，而 DSH 仍然是唯一的执行者。两个流程共享相同的工作流引擎：

- **Codex 主导的桥（首选）** — 生成计划的 Codex 任务通过持久的 SQLite 桥将其发送到确切的实时 DSH 会话； DSH 实现了它，插件以只读方式验证源任务，并启动单独拥有的 Reviewer 任务，其结论返回到原始 DSH 会话以进行修复或签核。
- **DSH 主导的工具（旧版，仍受支持）** — DSH 代理像以前一样驱动 `codex_workflow_start` / `codex_workflow_review`。

产品路径中任何地方都不会打开或控制任何浏览器；不涉及网络侦听器、MCP、挂钩或技能。浏览器单击是一种仅供开发的解决方法，不是插件的一部分。

## 要求

- DeepSeek Harness `0.1.0-rc.6`
- Node.js `^22.19.0` 或 `>=24`
- Codex CLI 具有有效的 ChatGPT 登录和应用服务器支持（由 `pnpm doctor` 验证）

## 安装

```powershell
dsh plugin --profile web add dsh-codex-workflow
```

安装后重新启动 DSH Web 配置文件。对于源安装期间
开发时，将本地项目目录传递给同一命令。

## 构建并验证

```powershell
pnpm install
pnpm verify
pnpm doctor
```

`pnpm run lifecycle:accept` 针对您的 Codex 应用程序服务器运行真正的审阅持久性验收（需要登录）：持久审阅者完成结构化判决轮次，托管应用程序服务器关闭，新的应用程序服务器重新读取轮次并验证其是否已持久保存为 `completed` 及其最终助理消息 - 然后同一审阅者恢复进行第二个已完成的轮次。 （在支持比较实验中，测试的终止和 EOF 关闭序列都读回已完成的回合及其最终消息，因此此回归验证了测试的序列，而不是证明根本原因。）该插件会优雅地关闭应用程序服务器（标准输入 EOF，然后仅在超时时升级到 SIGTERM/SIGKILL）作为防御性生命周期强化，以降低突然关闭与应用程序服务器的最终推出写入竞争的风险。

## Codex 主导的流程（首选）

从拥有该计划的 Codex 任务中，将其分派到实时 DSH 会话：

```powershell
# 1. Find the live DSH session for this workspace
dsh-codex-workflow sessions --cwd $PWD --json

# 2. Dispatch the plan (payload enters through stdin, never arguments)
$payload = '{"task":"实现搜索功能","planMarkdown":"…","assumptions":[]}'
$payload | dsh-codex-workflow dispatch --cwd $PWD --codex-thread $env:CODEX_THREAD_ID --stdin
```

桥接器解析确切的会话（显式 `--dsh-session` 获胜；否则 cwd 必须精确匹配一个实时会话，并且歧义性会严重失败）。 DSH 将计划作为插件中继消息接收并实施。完成后，DSH 调用 `codex_workflow_submit`；该插件将**准确存储的 Codex 任务 ID** 视为不可变源，验证其只读，并要求其托管应用程序服务器创建一个新的持久 Reviewer 任务：

```text
source Codex task --thread/read(includeTurns:false)--> validated
then thread/start --> dedicated Reviewer task --turn/start(outputSchema)--> verdict
```

源任务永远不会由插件恢复或写入，因此 Codex Desktop 可以保持其打开状态，甚至可能是其活动写入器，而不会导致线程存储写入器冲突。第一次审阅会保留新的审阅者任务 ID；以后的每次修复审核都会恢复相同的审核者任务。审阅者在创建和每次审阅时都被迫使用 `read-only`、网络禁用和 `approvalPolicy: never` 的工作流 cwd。

审阅者**默默地进行单一裁决**：每次审阅都固定在 Codex 的非协作“默认”模式，并接收协议级开发人员指令（加上提示块），禁止评论/进度消息、子代理、委派和任务创建。只有**最终**完成的代理消息才会被用作判决——在轮次期间流式传输的临时或多 JSON 输出永远不会被应用，并且中断/失败的轮次不会产生任何判决。当未配置 `reviewerModel` 时，插件使用应用程序服务器的 **默认模型** （带有 `isDefault: true` 的 `model/list` 条目，仅当服务器标记为无默认值时才确定性回退到第一个非隐藏模型），并且当未配置审核工作时，该模型为 `defaultReasoningEffort`。

### 审阅者写入器锁定语义

当审阅者轮次处于活动状态时，审阅者任务的编写器属于托管应用程序服务器，因此 Codex Desktop 将任务显示为“在另一个应用程序中打开”，并且您只能查看它 - **不要**单击“重试”/“接管”，因为这会窃取编写器并中止审阅。这是预期的并且是暂时的：一旦审阅达到其结论（通过、更改请求、终端错误或取消），插件就会在该审阅者线程上调用 `thread/unsubscribe`（幂等地，每个周期一次，从不在源任务上）。应用程序服务器回答`unsubscribed`（我们释放了编写者）、`notSubscribed`（已加载，但我们不是编写者）或`notLoaded`（当前未加载 - 没有要释放的内容）；所有这三个都是成功的结果，并且评论永远不会被删除或存档。完成的应用程序服务器会在短暂的空闲宽限期后退出，之后桌面可以再次打开 Reviewer。

### 判决如何返回（自动路径）

一旦提交和证据被持久存储，`codex_workflow_submit`就会返回，并将成功的工具结果标记为当前DSH回合的终端。然后，审阅器会在经理拥有的后台任务中运行，因此 DSH 会话会在没有其他模型步骤的情况下变为空闲状态，并且结束工具调用无法取消审阅。审阅者保持只读状态，并使用与强制输出模式匹配的结构化 JSON 判决**作为其最终消息**进行应答。 DSH 插件进程（Codex 沙箱外部）接收应用程序服务器转换结果，对其进行验证，将其持久地暂存在工作流程记录中，并将其作为具有确定性每次提交请求 id 的 `submit_verdict` 桥接命令进行排队。然后，桥接器运行时应用判决并将结果中继到原始 DSH 会话。 Reviewer 从不编写桥接队列本身，也从不调用 CLI。

审核运行时不会注入定期进度消息； `codex_workflow_status` 是按需进度视图。繁忙和速率限制条件保持静默后台重试。无效的源任务、缺失的判决和终端应用程序服务器故障将作为幂等 `submission_notice` 保留，并仅唤醒原始 DSH 会话一次，包括在插件重新启动后。

通过的判决告诉 DSH 报告一次并结束回合，而不调用 `memory`、状态、待办事项、shell 或工作流工具。如果终端中继仍然保持该确切的代理活动运行，则生命周期防护仅取消 `terminalRelayTimeoutMs` 之后的活动轮次，同时保留排队的收件箱工作。一旦该活动达到空闲状态，守卫就会解除武装，因此它无法取消以后的用户回合，并且插件拆卸会中止并等待所有待处理的守卫。

完成 Planner 或 Reviewer 操作后，托管应用程序服务器会在短暂的空闲宽限期（默认情况下为 5 秒）后退出。仅当没有 RPC、正在运行的轮次、轮次等待者或未决的澄清时才开始倒计时，因此长时间审阅和用户输入暂停可以保持安全，同时已完成的审阅者任务会快速释放其编写器锁定并在 Codex Desktop 中变得可读。

`dsh-codex-workflow respond` 是 **仅手动/兼容后备** - 对于想要手动输入判决而不是让自动路径收集判决的操作员，或者在自动管道中断后重新驱动判决的操作员：

```powershell
$verdict = '{"verdict":"pass","findings":[],"testGaps":[],"summary":"ok"}'
$verdict | dsh-codex-workflow respond --workflow <workflowId> --codex-thread $env:CODEX_THREAD_ID --submission <submissionId> --stdin
dsh-codex-workflow status --request <requestId> --json
```

`--submission <uuid>`（`respond` 中可选）将判决固定到审阅所答复的确切提交内容；如果没有它，旧行为仅在工作流程没有活动提交时适用。每个 `respond` 都经过验证，每个请求 ID 都是幂等的，并且可以安全地重放 - 它永远不会绕过证据指纹检查（由于审查被拒绝，其工作空间发生变化的判决）。

判决应用于原始 DSH 会话，具有与 DSH 主导的流程相同的阻塞/非阻塞/无更改/最大周期策略：阻塞结果将 DSH 返回到 `fixing`（然后重新 `submit`），只有非阻塞结果在用户的 `waiting_review_decision` 处停止，`pass` 完成工作流程。如果工作区在提交和判决之间发生了变化，判决将被拒绝，并且 DSH 被要求重新 `submit` 进行新的审查 - 旧的判决永远无法通过更改后的代码。

### CODEX_THREAD_ID

桥从未