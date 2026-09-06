# Vibe Mathematics — 多代理数学问题求解与验证框架（四架构）

> 运行在 **DeepSeek Harness** 内的一组 **agent preset**（`vibe-math-v1` / `vibe-math-v2` / `vibe-math-v3` / `vibe-math-v4`），
> 用多代理协作自动求解数学问题并对结论做多代理交叉验证。四个预设共享「**断点续跑**、
> **中途人工干预**、**进度汇报**、**自然语言驱动**」底座能力，但采用四代不同的求解架构：
> **💡 `vibe-math-v2` 与 `vibe-math-v3` 同级主推**——两者都是成熟可用、正在维护的主推架构，根据你的实际需求自行选择（详见下方「怎么选」）；`vibe-math-v4` 是最新的「常驻自组织合作研究」架构（实验性）。
>
> - **`vibe-math-v1`（经典流水线）⚠️ 将弃用**：「广度探索 → 深度迭代 → 交叉验证 → 知识沉淀」闭环；
> - **`vibe-math-v2`（概率驱动 · JSON 数据层）✅ 主推**：`qs.json` 问题清单 + `Propos/` 命题库 + 概率驱动调度 + 代码启发式调度；
> - **`vibe-math-v3`（第三代 · 论文式 md + 规划代理 + 方法库）✅ 主推**：全部知识以 **Markdown 论文/研究报告式** 存储与续写（`Problems/` 问题清单+依赖+来源动机、`Progress/` 研究日志、`Propos/` 命题库、`Methods/` 通用理论发明库、`Verified/` 绝对可信）；调度前由**规划代理**自主制定接下来 N 步计划；解决过程中发明的理论/框架/工具/方法/思想由 **Method Keeper** 沉淀为可复用方法体系（如发明群论、泛函分析那样）。
> - **`vibe-math-v4`（第四代 · 常驻自组织合作研究）🧪 实验性**：一组**持久化常驻子代理**互相**留言 + 开会**，自主决定一切任务安排（无中央调度）；各自沉淀进度/命题/方法/子问题库并互相查阅；验证**仅当全体常驻一致（真 或 假）**才写入 `Verified/`，否则留库附概率；上下文达阈值自动 `/compact`；仅当全体一致认为原问题已解决才停止。

安装本插件包（或手动复制预设）后，DSH 的预设选择器里会出现**四个** agent preset。

## 🧩 架构图（v1 + v2 + v3）

> 静态架构图；完整流程说明见 [docs/架构图.md](docs/架构图.md)；可编辑生成脚本：[v1](docs/generate_framework_diagram.py) / [v2](docs/generate_framework_diagram_v2.py) / [v3](docs/generate_framework_diagram_v3.py)。

### Vibe Math V1（经典流水线）⚠️ 早期架构 · 将弃用 · 不建议新项目使用

![Vibe Math V1 架构图](示例图/框架图-v1.png)

**一句话流水线**：`qs.csv` → Brainstorm 拆方向 → 每方向一个 Solver 多轮迭代（卡死则 Derive 派生新方向）→ 输出拆成最小验证单元 → ≥3 个 Verifier 独立审查 → 辩论 → 裁决 → 通过晋升 `Verified/` → Decider 回写 `qs.csv`；全程状态落盘 `VibeMath_State/`，`resume` 断点续跑，`manual` 模式在派发/裁决/晋升处挂起人工决策。

### Vibe Math V2（概率驱动 · JSON 数据层）✅ 主推

![Vibe Math V2 架构图](示例图/框架图-v2.png)

**一句话流水线**：`qs.json` 按优先级取问题 → Explorer 拆方向（全死路则重派生）→ 每方向一个 Solver 多轮迭代（引理进 `Propos/`、解法回 `qs.json`，概率均 <1）→ 调度器选 r（命题 / 命题+证明·证伪 / 问题+解法）派 ≥3 验证器独立审查→辩论→裁决 → 概率=1 自动收口（问题 solved、命题 1/0，优先级置 `never`）；全程状态落盘，`resume` 断点续跑，`reportMode` 可 file/push/both 汇报。

### Vibe Math V3（论文式 md + 规划代理 + 方法库）✅ 主推

![Vibe Math V3 架构图](示例图/框架图-v3.png)

**一句话流水线**：全部知识以 **Markdown 论文/研究报告式**存储与续写（`Problems/` 问题清单含依赖/后生问题来源动机、`Progress/` 研究日志按方向按轮续写、`Propos/` 命题库、`Methods/` 通用理论发明库、`Verified/` 绝对可信）→ 调度前调度器构造状态简报并调用**规划代理**，规划代理一次性安排接下来 N 步（spawn solver/verifier/explorer/method-keeper、interrupt、promote、wait），代码校验后执行（超出并发的动作排队跨 tick 消费；规划失败自动回退 v2 式启发式）→ 验证器独立审查→辩论→**近共识裁决**（同侧且均值 ≥0.85/≤0.15 取均值，修复 v2 flat 误判）→ 概率=1 收口并生成 `Verified/` 卡 → 求解器的 `methods_used`/`new_inventions` 上报由 **Method Keeper** 沉淀/完善方法库（可组成体系层级、跨项目复用）。

### Vibe Math V4（常驻自组织合作研究）🧪 实验性

![Vibe Math V4 架构图](示例图/框架图-v4.png)

**一句话流水线**：起始产生 N 个**常驻子代理**（continuable，持久上下文）先各自头脑风暴、产出初始见解/方向 → 此后**所有任务安排由它们互相留言 + 集体开会自主决定**（框架只做消息总线/会议/任务板/产物沉淀，**绝不分配任务**）；每个常驻把有价值的产物按**价值程度 / 动机用途计划 / 自身概率估计**沉淀到**自己**的 `Progress//`、`Propos//`、`Methods//`、`Subproblems//` 库，并**可互相阅读**；验证由它们**自行商议**发起，**仅当全体常驻一致（真或假）**才写入 `Verified/`，否则留库附概率；常驻上下文量达阈值（默认 66%）自动 `/compact`；**仅当全体一致认为原问题已解决**才停止；可随时人工干预/增开/关闭常驻，支持断点续跑。

> 说明：V4 去掉 v3 的中央规划器与确定性角色（explorer/solver/verifier/planner/method-keeper），把"研究者"本身作为主体。详见 `vibe-math-v4/实现方案.md`。
>
> 🔧 **v1.3.2 审计修复**：修复上下文压缩按占比失效（`contextPct` 单位错配，现按百分比保存）、常驻工具按"调用者身份"路由（各常驻库归属正确）、`vibe_v4_read_progress` 真正返回文本、跨进程断点续跑重建常驻、`message(all)` 广播真正投递、`addMember` 增开无 id 碰撞。详见 `vibe-math-v4/实现方案.md` §17。
>
> 🔧 **v1.3.3 审计修复**：非全票验证把平均概率写回源卡（兑现"留库附概率"）、方法型验证标 `类型: 方法`（不再误标命题）、同进程 abort→resume 重建常驻、记录命题也触发自动同步会议、唤醒信号改用 `activityTimeoutMs`、`verdictMaxRounds`/`meetingKeepEvery` 可调且展示。详见 §18。
>
> 🔧 **v1.3.4 和谐修复**：重排 `框架图-v4.png` 消除文字/箭头重叠遮挡（子标签不再溢出框、`/compact` 移入独立的"上下文"能力块、底部"产物沉淀·断点续跑"居中排布）；补齐 `agent.cordis.yml` 常驻描述中的"deadlines"一词（v4 并无截止机制），并移除 `实现方案.md` 中不存在的 `vibe_v4_inject`（实际用 `vibe_v4_message`）。
>
> 🔧 **v1.3.5 边界 A 落地 + 真实 `/compact`**：`maxParallel` 真正限流（在途上限），`activityTimeoutMs` 作为**心跳门控**（空闲超时才触发 CHECKPOINT 唤醒，推动收敛/停止而非无限烧 token）；并用 DSH 真实 `ctx.compaction.compactIfNeeded(常驻 agent, 'pressure', signal)` 压缩常驻自身上下文（回退到自述指令）。详见 §19。
>
> 🔧 **v1.3.6 修复 v4 preset 选择后跳回原 preset**：v4 插件的 `apply` 读取 `ctx.subagents/agents/fs/tools/commands` 却**未声明 `inject`**，被 DSH 守卫以"未声明依赖"拒绝 → 组合无法挂载 → 选择后自动回退。已补 `export const inject = [...]`，并把心跳定时器从全局 `setTimeout/clearTimeout`（插件沙箱里不存在）改为 **`timer` 服务（`ctx.timeout`）**。
>
> 🔧 **v1.3.7 哲学回归（清晰提示词 + 真实交流群 + 直接写文件）**：常驻首轮注入完整 `contextBrief`（背景/使命、工作模式、文件与格式、工具、规则）；会议把其他常驻实际发言（input）转给每个人看，常驻日常轮的 `input` 经 `relayToGroup` 转发到其它常驻邮箱（像群聊）；常驻**直接用 fs 写自己的 md**；去固定约束改为团队讨论涌现。详见 §20。
>
> 🔧 **v1.3.8 基于真实测试的诊断修复**：**① 共识验证真正"全体一致"**——`finalizeVerify` 现在要求**全体在册常驻都投了票**才可判"一致"，否则辩论或保留为未定论（实测曾出现 2/4 投票却被判"全体一致为真"，已修）；**② 会议必须全体发言**——`continueMeetingRound` 按"是否已发言"收口，`allSolved`（stop）要求全员发言+全票 true，杜绝缺席成员被带偏；**③ 背景只在首轮讲一次**——`contextBrief` 只在 `brainstormPrompt`（首轮）注入完整版，后续 normal/meeting/verify/CHECKPOINT 用极简当前状态，不再每轮重复长背景（省上下文）；**④ 验证目标按提出者精确定位**（`targetOwner` + `findSourceRel` 优先提出者库，避免同名 id 撞车）；**⑤ 主代理放权**——persona 明确"让常驻自组织（hands-off）"，不注议程/优先级/分工/验证决定，只 read status/report，用户明确要求或明显僵死时才 message/meeting 且只促成不决定。详见 §21。

## ✨ 功能特色

- **多代理自动求解**：主代理把问题交给调度器，调度器派发 explorer / solver / verifier（v1/v2/v3）与 **planner（规划代理，v3）**、**method-keeper（方法整理代理，v3）** 等子代理协同求解，**你无需逐节点手操**。
- **多代理交叉验证**：每个结论交给 ≥3 个「严苛审稿人」**独立审查 → 辩论（交流群）→ 裁决**（v3 默认**近共识裁决**：同侧且均值 ≥0.85/≤0.15 取均值，避免"0.9 vs 1"被误判成 0.5）。
- **论文式 Markdown 知识库（v3）**：问题清单（含问题间依赖、后生问题产生原因与计划）、研究日志、命题、方法库全部以 md 论文/研究报告式书写与续写（方向重派生时旧方向的日志自动归档保留）；**只有 `Verified/` 与验证器判真/假的对象绝对可信**，其余 md（含方法库未验证断言）仅作经验参考。
- **通用理论发明库（v3）**：解决过程中发明的理论体系/框架/工具/方法/思想（含经验性总结）经 `methods_used`/`new_inventions` 上报，由 **Method Keeper** 沉淀为 `Methods/` 方法卡（可组成体系层级、跨项目复用），像"解决方程时发明群论"一样形成系统化方法理论体系。
- **规划代理调度（v3）**：调度前调用规划代理，根据实际情况（问题依赖/存活率/可验证对象/并发预算/上次计划结果）自主选择最优调度方案，**一次安排接下来 N 步**各代理任务；规划失败自动回退启发式。
- **知识沉淀**：验证通过的结论晋升进 `Verified/` 可信知识库（v2/v3 另有 `Propos/` 命题库），供后续方向复用。
- **断点续跑**：调度状态、任务栈、代理注册表、决策队列、验证器历史准确率等全部落盘；重启后 `resume` 即可恢复（v2/v3 用进程纪元区分"同进程暂停→恢复"与"跨进程重启"；v3 的 md 本身即叙事断点）。
- **中途人工干预（并继续）**：`auto / manual` 模式随时切换；manual 在关键节点挂起决策等你 approve/reject/override（v3 新增**计划审批门**与**方法晋升门**）；可对任意子代理发消息 / 中断。
- **按项目隔离**：每个数学问题一个独立项目文件夹，互不干扰，可随时切换。
- **多会话并行隔离**：DSH 的 agent preset 是 standing mount（同一 preset 的所有会话共享一个插件实例），插件内部按**根会话 id** 隔离全部运行状态——两个会话可以同时各跑一个项目，各自的子代理会正确挂在自己会话名下，调度器 / 参数 / 决策队列 / 当前项目互不干扰（v3 另有**项目锁**，同一项目同一时刻只被一个会话调度）。当前项目按会话分别持久化（`VibeMath/current.<会话id>.json`）。
- **子代理权限可调控**：可限制子代理允许/禁止的工具、每轮外部工具调用上限，并明确告知其可读 `Verified/`、`Propos/`、`Methods/`、`Reliable/` 与进度日志。
- **可配置**：`vibe_math_setting.json`（含注释）自定义默认参数；`/vibe setup` 交互式问答配置。
- **自然语言控制**：主代理充当「助手 + 汇报者」，你把需求说成人话，它自己调用工具、汇报进度、配置参数。

## 🚀 安装

两种安装方式，任选其一（也可并存）：

### 方式 A：作为插件包一键安装（推荐，同时装出三个预设）

```sh
dsh plugin --profile <你的 profile> add dsh-vibe-math
# 或从 GitHub 直装：
dsh plugin --profile <你的 profile> add github:ChongCyrus/Vibe-Mathematics
```

安装时插件会自动把三个 preset 写入 `~/.dsh/.agent-presets/`：`vibe-math-v1/`、`vibe-math-v2/` 与 `vibe-math-v3/`。
之后新建会话，预设选择器里选择 **Vibe Math V3**（v3，**主推**）、**Vibe Math V2**（v2，**主推**）或 **Vibe Math**（v1）即可——v2 与 v3 同级主推，按实际需求自选（见「怎么选」）；v1 作为早期架构保留兼容，**可能在将来版本中被遗弃、不再维护**。
**升级包版本后重启 DSH，未手动改过的 preset 文件会自动更新到新版本**（细节见文末「v2/v3」安装器说明）。

### 方式 B：作为 agent preset 手动安装

1. 把本仓库对应目录的文件复制到 preset 目录：

   ```
   C:\Users\<你>\.dsh\.agent-presets\vibe-math-v1\   ← 复制 vibe-math-v1/ 下的 agent.cordis.yml / preset.yml / vibe-math.js
   C:\Users\<你>\.dsh\.agent-presets\vibe-math-v2\   ← 复制 vibe-math-v2/ 下的 agent.cordis.yml / preset.yml / vibe-math-v2.js
   C:\Users\<你>\.dsh\.agent-presets\vibe-math-v3\   ← 复制 vibe-math-v3/ 下的 agent.cordis.yml / preset.yml / vibe-math-v3.js
   ```

2. 新建一个会话，在 preset 选择器里选 **「Vibe Math」** / **「Vibe Math V2」** / **「Vibe Math V3」**。
3. 会话启动后即可使用：工具列表里会出现 `vibe_math_*` 工具，输入框键入 `/vibe` 有自动补全。

> 修改 preset 文件后需**重启 DSH 进程**再开新会话（preset 的 standing mount 会缓存到进程退出）。

### DSH 版本适配与依赖

- **形态依赖**：三个 preset 依赖 DSH 的标准 **agent-preset 机制**（`~/.dsh/.agent-presets//` + preset picker）与 **bundle patch 机制**（`cordis.patch.yml` 注入安装器）。
- **宿主插件行**：`agent.cordis.yml` 引用宿主提供的 `@deepseek-ai/dsh-*` 插件行（persona、agent-instructions、tool-bash/pwsh、tool-fs/fs-search、tool-jobs、skill-filesystem、tool-skill、tool-goal、plan-mode、compaction、subagent/workflow、ask-user、todo、web 等，约 21 个唯一包名）。宿主缺行会导致 preset 挂载失败（会话启动时报错）。
- **宿主服务 API**：预设插件消费 `subagents`（startContinuable / followup / interrupt）、`agents`（roots）、`tools`（register）、`commands`（register）、`fs`（resolve/stat/readText/writeText/listDir）、可选 `subprocess` / `sandboxPolicy`。这些 API 形状随 DSH 版本演进；本项目**已充分测试并确认适配 `dsh-v0.1.1-rc.2`**（`package.json` 的 `dsh.testedVersion`；`minVersion` 为 `0.1.0-rc.7`）。**注意：v3 需要 DSH 0.1.1 起的 fs API 形状**（`fs.resolve` 返回 `{targetKey, displayPath}` 对象；v1/v2 亦兼容 0.1.0-rc.7+）。
- **运行时自检**：安装器（bundle 插件）每次启动时对上述服务与关键 API 做**能力自检**（DSH 不暴露版本号，故按能力而非版本检测；含 `fs.resolve` 返回形状检测）；不满足时打 warning 并提示升级 DSH。preset 挂载失败时先看 DSH 日志里的自检 warning。
- **升级路径**：DSH 升级后无需重装本包；升级本包用 `dsh plugin update dsh-vibe-math`，重启 DSH 后安装器会自动把 preset 更新到新版本（见上文「安装」说明）。

## 🧭 三个预设怎么选

> **💡 `vibe-math-v2` 与 `vibe-math-v3` 同级主推，按你的实际需求自行选择：**
>
> - **选 `vibe-math-v2`（概率驱动 · JSON 数据层）**，如果你：
>   - 偏好**结构化 JSON 数据**（`qs.json` / `Propos/<分类>_Propos.json` / `Verified/` 卡），方便程