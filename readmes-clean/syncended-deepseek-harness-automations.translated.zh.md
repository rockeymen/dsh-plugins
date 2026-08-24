# DeepSeek Harness 自动化

用于持久、可配置的 cron 作业的 DeepSeek Harness 插件。每次发生都会在选定的工作空间中启动一个新的持久化 Harness Agent，并具有显式模型路径、代理预设和权限预设。

> **状态：** `@deepseek-ai/dsh` `0.1.1-rc.2` 的 MVP。当前的worker是单主机。 Cron 入场和运行历史是持久的；主机崩溃后，故意**不**重试已经开始的运行。

## 什么有效

- 具有 `UTC` 或 IANA 时区的标准五字段 cron 表达式。
- 每个作业的工作空间、提供者/模型、推理工作、代理预设、权限预设和超时。
- 启用/禁用、立即运行、编辑、删除、取消和最近运行历史记录，从主**自动化**侧边栏操作打开的完整中心工作区，或从**设置→自动化**。
- 重叠政策：
  - `skip` — 在作业排队/运行时记录并跳过发生的事件。
  - `queue` — 序列化同一作业的事件。
  - `allow` — 允许并发发生，受全局并发限制限制。
- 失火政策：
  - `skip` — 将逾期事件记录为已跳过。
  - `run-once` — 将错过的事件合并到最晚的到期时间。
- 默认情况下 `$DSH_HOME/automations/state.json` 下的原子所有者私有状态。
- 不可变的执行快照和发生键，用于重放安全准入。
- 可扩展的执行器注册表：MVP 附带 `agent`；未来的 `workflow` 和任务图执行器不需要更改调度程序。

内置的 `@deepseek-ai/dsh-schedule` 插件仍然是附加到一个实时会话的提醒的正确工具。该插件拥有部署级作业，可以在没有打开聊天的情况下启动新的工作区会话。

## 安装

要求：Node.js 22+ 和有效的 `dsh web` 配置文件。

来自 npm：

```bash
dsh plugin --profile web add @syncended/dsh-automations
```

或者通过此结账：

```bash
pnpm install
pnpm check
pnpm build

dsh plugin --profile web add .
```

该包声明了一个 DSH 捆绑包，因此 `dsh plugin` 会自动将其附加到 Web 配置文件中。初始安装后重新启动正在运行的 Web Harness，然后刷新页面。从主侧边栏打开完整的**自动化**工作区，或使用**设置→自动化**。

要删除它：

```bash
dsh plugin --profile web remove @syncended/dsh-automations
```

## 配置作业

### 字段·含义
- **字段**：名称· **含义**：人类可读的作业名称。
- **字段**：时间表· **含义**：选择分钟、每小时、每天、工作日或每周并调整其简单控件。 Custom 通过内联字段指南公开原始五字段 cron (`minute hour day-of-month month day-of-week`)。
- **字段**：时区 · **含义**：在选择器中按城市或地区搜索，或输入 `UTC` / IANA 名称，例如 `Europe/Berlin`。显示当前 UTC 偏移量； DST 由 `cron-parser` 处理。
- **字段**：工作空间 · **含义**：选择现有的 Harness 工作空间或手动输入绝对目录。它的规范文件系统身份成为会话 cwd 和 `workspace-write` 根。
- **字段**：提示 · **含义**：发送给新 Harness Agent 的用户消息。
- **字段**：提供商/型号 · **含义**：在可搜索选择器中选择已配置的提供商或输入未列出的适配器路由，然后选择或输入其型号。将两者留空以解决调度时的当前线束默认设置。
- **字段**：推理工作 · **含义**：选择 `Default` 或适配器公布的精确模型工作。如果功能查找不可用，则通用 ID 将显示为建议后备；自定义 ID 保持可编辑状态，并在运行开始时进行验证。
- **字段**：代理预设 · **含义**：将当前 Harness 默认值留空，或选择特定的合成。
- **字段**：权限预设 · **含义**：捆绑DSH沙箱和审批策略。默认值：`workspace-write`。
- **字段**：超时 · **含义**：挂钟运行限制。取消是通过代理循环进行协作的。
- **字段**：重叠/失火· **含义**：如上所述的准入行为。

该表单将常见设置分为 **任务**、**计划** 和 **代理和访问**。作业 ID、超时、重叠和失火仍可在折叠的**高级**部分中找到。暂停的作业仍可以通过 **立即运行** 启动。

## 插件配置

默认值适用于本地 Web 配置文件。需要时覆盖配置文件的 `cordis.patch.yml` 中的捆绑行：

```yaml
- id: automations
  config:
    maxConcurrentRuns: 2
    historyLimit: 1000
    misfireGraceMs: 60000
    maxOutputChars: 65536
    allowedProjectRoots:
      - /home/me/projects
    # Optional; otherwise $DSH_HOME/automations/state.json
    # statePath: /absolute/private/path/state.json
```

`allowedProjectRoots: []` 表示该插件接受 Harness 主机帐户可以解析的任何现有目录。当 Web 表面暴露在受信任的本地计算机之外时，配置一个或多个根。

## 持久语义

1. 调度程序声明发生并在**相同原子状态突变**中推进其持久 `nextRunAt` 水印。
2. 承认的运行固定完整的作业版本并获取唯一的出现键。
3. 重启后调度`queued`运行。
4. 在任何代理工作开始之前，运行标记为 `running`。
5. 重新启动时，孤立的 `running` 记录将变为 `interrupted` 并且不会自动重试，从而避免静默重复文件/网络影响。
6. 利用会话持久性仍然是代理记录的真实来源；自动化状态存储编排元数据和有界的最终文本摘要。

这不是一次性执行。恰好一次的外部副作用需要任务本身或目标系统具有幂等性。

## 安全

- 状态文件以 `0600` 模式自动替换；创建的目录使用 `0700`。
- 工作空间路径通过`realpath`解析；根据该规范身份检查可选的允许根。
- 后台工作使用正常的DSH权限预设。 `workspace-write`不能默默地扩大自己；无人值守的批准失败仍然会失败。
- 仅当作业作者选择授予它的已配置预设时，`danger-full-access` 才故意可用。
- 管理 API 需要 JSON 加上自定义的同源突变标头。它继承了 DSH Web 服务器的信任边界，该服务器没有独立的身份验证层。
- 提示、运行元数据、最终摘要和会话记录是本地敏感数据。

威胁模型参见【`docs/security.md`](docs/security.md)】。

## 发展

```bash
pnpm typecheck
pnpm test
pnpm check
```

Host插件是`src/`中的TypeScript。浏览器部分故意采用 `lib/client.js` 中的纯 JavaScript，匹配外部 DSH 客户端插件加载器格式，并避免对仅限 monorepo 的前端构建工具的依赖。

## 架构和路线图

参见[`docs/architecture.md`](docs/architecture.md)。简而言之，cron只是一个触发器。持久运行调用`task.kind`选择的执行器；下一个实现阶段在 `ctx.workflowEngine` 上添加一个 `workflow` 执行器，然后是带有租约、重试、子代理引用和可恢复代码步骤的持久任务图。