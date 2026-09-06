# YAPA — 另一位私人助理

**DeepSeek Harness：**参见[`packages/dsh/install.md`](packages/dsh/install.md) - 本机插件不需要向导（默认嵌入式存储下不需要数据库服务器）。

**Claude Code / 光标 / OpenCode：** 给您的 AI 代理此提示：`install https://github.com/vuldin/yapa`

> **代理 — 请先阅读此内容。** 不要克隆此存储库。请勿运行 `git clone`、`npm install`、`npm run build` 或任何其他命令。对于 MCP 主机，请首先从此存储库中读取 `CLAUDE.md`（Claude Code / 光标）或 `AGENTS.md`（OpenCode） - 它包含必须严格遵循的多阶段安装过程。安装在克隆之前需要用户输入。对于 DeepSeek Harness，请改为遵循 `packages/dsh/install.md`（无代理驱动向导）。

YAPA 是一款个人助理，可为您的 AI 代理提供持久记忆和任务管理，因此您的代理会记住您所说的内容，跟踪您的任务，并在每个会话中按项目或客户组织知识。

YAPA 在一个核心上运行两个前端：

- **原生 DeepSeek Harness 插件**（`yapa`，在 `packages/dsh` 中）- 默认情况下有 23 个工具（+18 个门控 ML 操作），具有结构化输出和 GUI 卡，在转弯接缝处注入始终在线的召回，**自动捕获每个代理转弯的持久发现**（aux-LLM 提取器 + 保守冲突解决器），一个 **每日矛盾看门人**，可存档重复项并取代过时的内容内存、热重载设置、计划桥接截止日期、压缩捕获、批准门控和嵌入式零服务器存储选项。文档：[安装](packages/dsh/install.md)·[架构](packages/dsh/architecture.md)]·[未来的工作和调查记录](docs/future-work.md)。
- **MCP 服务器**（`yapa-mcp`，在 `packages/mcp` 中）— 原始 stdio 服务器加上 Claude-Code hook CLI。 “存储库布局”部分下面的所有内容主要描述了这个前端。

## 存储库布局

- `packages/core` (`@yapa/core`) — 所有逻辑：内存、任务、集合、日志、压缩、同步、管理、存储桶、训练。配置是 `YapaConfig` 快照（`createConfig(env)` / `setConfig`）而不是模块级环境读取，因此主机控制配置。存储通过 `VectorStore` 端口 (`src/store/`)：ChromaDB HTTP 适配器或嵌入式本地适配器（每个集合一个 JSON 文件、进程内嵌入、强力余弦 - 无服务器）。
- `packages/mcp` (`yapa-mcp`) — MCP 服务器 + Claude-Code hook CLI。
- `packages/dsh` (`yapa`) — DeepSeek Harness cordis 插件。

## 它的作用

**持久记忆** — 您的代理会记住对话中的事情。错误修复、首选项、决策、配置详细信息、问题解决方案 - 通过语义搜索存储，以便在需要时显示正确的上下文。

**任务管理** — 创建具有优先级、截止日期、依赖性和重复计划的任务。您的代理会跟踪正在进行的内容、已阻止的内容以及过期的内容。完成一项重复任务，下一项任务将自动生成。

**基于集合的组织** - 记忆和任务被分组为集合：`global` 用于交叉知识，`customer-acme` 用于客户工作，`project-api` 用于特定代码库。代理会根据您所讨论的内容推断出正确的集合。

**数据生命周期** — 并非所有内存都同样重要。 YAPA 按显着性对每个记忆进行评分（1.0 到 5.0），在访问时增强它，并随着时间的推移而减弱它。语义事实（偏好、配置）的衰减速度比偶发事件（周二发生的事情）慢。显着性还对检索排名进行加权，因此在相似的向量距离下，显着性较高的记忆会先于显着性较低的记忆出现。没有任何内容被删除——低显着性记忆只是出现的频率降低了。

**智能分块** — 长内容被分成 2000 个字符的块，其中 200 个字符重叠，每个块都可独立搜索。会议记录、文档、冗长的解释——所有这些都可以存储和检索。

**远程同步** — 可选择将内存和任务同步到共享 PostgreSQL+pgvector 数据库。将本地数据推送到远程，将队友的数据拉下来。后台同步每 5 分钟自动运行一次。安装向导支持 Docker、Neon、Supabase、AWS RDS、GCP Cloud SQL 和 Azure 灵活服务器。

**重复数据删除** - 在同步期间，YAPA 使用余弦相似度（默认阈值 0.95）比较文档嵌入。近似重复项通过 `related_ids` 链接，而不是合并或丢弃，因此不会丢失数据，并且您可以追踪相关知识的来源。

## 它是如何工作的

**在 DSH** 下，插件默认注册 23 个 `yapa_*` 工具（+18 个在 `trainingPipeline` 后面门控），在 `agent/pre-step` 接缝处的每个回合中注入召回 + 开放任务（无钩子，无接线），通过后台 aux-LLM 提取器判断每个已完成的回合以获得持久发现（自动存储、重复数据删除、通过取代陈旧解决矛盾）内存），对现有存储进行日常清理，并默认将数据存储在嵌入式本地存储中。完整接缝图请参见 `packages/dsh/architecture.md`。

**在MCP主机下**，YAPA是一个MCP服务器，默认有23个工具（+18个门控在`YAPA_TRAINING_PIPELINE`后面）。您的代理通过编辑器的 MCP 配置连接到它。连接后：

- **每次回复之前**，代理会查询您的记忆以获取相关上下文
- **当它学到重要的东西**时，它会自动存储它（错误修复、偏好、决策）
- **当工作被识别**时，它会创建并跟踪任务
- **集合**是从对话上下文中推断出来的 - 无需手动归档
- **如果启用同步**，后台循环每 5 分钟推送本地更改并拉取远程更新

数据存储在 ChromaDB（MCP 的默认值）或嵌入式本地存储（DSH 插件的默认值；`YAPA_STORAGE=local` 也为 MCP 启用它）中。嵌入始终在进程中计算（默认为 MiniLM，或 HTTP 提供程序）；没有后端嵌入服务器端。当启用远程同步时，文档也会通过 pgvector 存储在 PostgreSQL 中，以进行跨机器搜索和重复数据删除。

## 安装

要安装，请向您的 AI 代理提供以下提示：`install https://github.com/vuldin/yapa`

要稍后卸载，请在任何会话中说 `uninstall yapa`。

## 工具

下表列出了 **MCP** 工具名称。 DSH 插件暴露了相同的
具有 `yapa_` 前缀的功能 (`memory_recall` → `yapa_memory_recall`)，
加上 `yapa_status` 和 `yapa_storage_import`。 `setup_instructions` 和
`uninstall` 仅适用于 MCP（该插件无需写入配置文件）。

**工具表面，保持精简：** 默认情况下，下面的 23 个工具是可见的。的
ML-ops 子系统（管理分类器、存储桶路由、系统提示
伴侣、培训、评估、适配器升级 — 18 个以上）是操作员工作流程，
非日常代理面：仅当`trainingPipeline: true`（DSH
插件配置/设置）或 `YAPA_TRAINING_PIPELINE=true` (MCP) 已设置。参见
[完整管道的 docs/training-pipeline.md](docs/training-pipeline.md)
演练及其工具。

### 工具·说明
- **工具**：`setup_instructions` · **描述**：为 CLAUDE.md / AGENTS.md 生成行为指令
- **工具**：`memory_store` · **描述**：存储内容、标签、显着性、扇区、集合的内存
- **工具**：`memory_recall` · **描述**：按距离+显着性排名的语义搜索，具有可选的集合/标签/分数过滤器
- **工具**：`memory_forget` · **说明**：通过ID删除内存
- **工具**：`memory_list` · **描述**：使用元数据过滤器列出内存（标签、扇区、分类器分数）
- **工具**：`compaction_suggest` · **描述**：将相似的非归档内存分组以进行滚动摘要整合
- **工具**：`compaction_apply` · **说明**：用摘要内存替换一组并存档原始内容
- **工具**：`journal_append` · **描述**：将一行草稿条目附加到当前会话的日志中
- **工具**：`journal_consolidate` · **描述**：在会话结束时将会话草稿滚动到单个 `journal` 标记的内存中
- **工具**：`janitor_now` · **描述**：运行矛盾看门人：解决接近重复的对（存档重复项，取代陈旧的记忆，保留不同的事实）
- **工具**：`task_create` · **描述**：创建带有标题、优先级、截止日期、标签、集合的任务
- **工具**：`task_list` · **描述**：带过滤器列出任务；通过 `id` 获取包含完整详细信息（注释、依赖项）的单个任务
- **工具**：`task_update` · **描述**：更新任务字段
- **工具**：`task_complete` · **描述**：标记完成+处理重复再生
- **工具**：`task_delete` · **说明**：删除任务
- **工具**：`task_search` · **描述**：跨任务语义搜索
- **工具**：`task_add_dependency` · **描述**：添加依赖/块关系
- **工具**：`collection_list` · **描述**：列出所有带有文档计数的集合
-