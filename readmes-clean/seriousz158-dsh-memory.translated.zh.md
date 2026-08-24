#dsh-memory

`dsh-memory` 是一个本地的、Git 支持的长期内存插件，适用于 [DeepSeek Harness (DSH)](https://www.npmjs.com/package/@deepseek-ai/dsh)。

它添加了一个持久设置、一个用于清除内存的安全设置页面工作流程以及一个可选的空闲会话同步器。仅当 `memory.enabled` 为 true 时，主机插件才会注入内存指导； UI 插件允许用户检查存储库状态、切换设置并通过有意的两步确认来清除学习记忆。

## 它的作用

- 将持久内存存储在本地 Git 存储库中，而不是存储在此源存储库或托管服务中。
- 立即注册`memory`设置命名空间，因此`memory.enabled`在下一次模型调用时生效，而无需重新启动DSH。
- 在 DSH 设置中显示长期内存行，其中包含存储库状态和双重确认**删除内存**操作。
- 在清除 `summary.md`、`handbook/`、`rollouts/` 和 `archive/` 之前保留 Git 恢复点：干净的存储库重用其现有的 HEAD，而脏目标路径则获得专用的检查点提交；下一次提交记录清除状态。
- 在清除操作期间拒绝不安全的存储库布局、符号链接转义、非存储库根和路径竞争。
- 可以通过可选的无头同步器仅处理空闲的本地会话日志。同步器默认为 `workspace-write`，从不静默安装 DSH，并且仅转发列入白名单的环境。

## v0.2：事务同步、审计、结构化内存和回滚

> 历史：v0.2 引入了事务同步。 v0.3（下）添加了运行
> 序列化、运行状况报告和中断运行恢复。

v0.2 使每个自动写入事务化：

- 同步器将有效负载树复制到隔离的暂存工作树中；
  无头 DSH 只会看到并写入该暂存副本。
- 为整合而创建的一次性无头会话将在
  每次运行的私有临时根，不是用户正常的 DSH 会话存储，所以
  自动同步不会创建需要手动存档的对话。
- 主机验证暂存的差异（路径、只读引用、live-root
  并发）并将其应用到具有自己的实时内存存储库
  `recovery` + `apply` 提交对。该模型从不运行 Git。
- 每次运行都记录在 `.sync/runs/<run-id>.json` 和 `last-run.json` 下
  作为当前状态；该期刊只保存元数据，不保存成绩单，
  提示或凭据。 `.last-sync` 申请成功后才可晋级。
- 新的内存记录使用 Markdown 前面的内容（`schema_version: 1`、`id`、
  `type`、`status`、`confidence`、日期、标签、`source_rollouts`）。旧文件
  无前置事项继续工作，按`status()`计数，可
  使用 `dsh-memory-migrate --dry-run` / `--apply` 增量迁移。
- 最新的日志同步运行可以通过整体回滚
  `memory.rollback()`（与`ROLLBACK_MEMORY`确认）或设置
  用户界面。回滚创建一个新的提交；它永远不会重置或重写历史。
- `memory.status()` 现在报告 `schemaVersion`、`legacyFileCount`、
  `pendingMigration`和`lastRun`； `memory.runs({ limit })` 列出期刊。

`dsh-memory-sync --dry-run` 报告候选差异（添加/修改/删除
路径、拒绝的文件和原因）而不触及活动根、日志，
Git，或者水印。

清除操作保留其现有语义：它保留 `.sync`，
`.last-sync`、`README.md`和`scripts/`，并且在清除日志后仍然
存在，以便操作员可以看到发生了什么。清除报告后回滚
`rollback-conflict` 因为较新的内存写入取代了运行。

## v0.3：序列化同步运行、运行状况和中断运行恢复

v0.3 强化了同步管道，以防止并发运行和崩溃：

- 主机端操作锁（`<root>/.sync/operation.lock`）串行化同步和
  回滚操作。运行时的第二次同步会干净地退出
  `operation-in-progress`；死进程的陈旧锁通过以下方式恢复
  mtime/pid 检查。
- 主动运行记录 (`<root>/.sync/active-run.json`) 跟踪
  当前运行。如果主机进程在运行中终止，则下一次同步会检测到终止进程
  pid 并将中断的运行恢复到日志中（`status: interrupted`）
  在开始新的工作之前。
- 运行日志记录现在携带 `phase`
  (`staging`/`validating`/`applying`/`finalizing`/`complete`)、`duration_ms`、
  `rejected_file_count`、`changed_path_count` 和 `staging_digest`。
- `memory.health()` 报告锁定/活动运行/中断运行/日志状态和
  `needsManualRecovery` 标志。 `memory.runs()` 接受 `operation` 和 `status`
  过滤器，`memory.status()` 报告最新的待定预览。
- 分阶段有效负载在应用前根据硬限制进行验证：每个 1 MiB
  文件，添加了 50 个文件，总更改字节为 5 MiB。超大或二进制文件
  拒绝 `file-too-large`、`too-many-files`、`change-too-large` 或
  `binary-file` 代码而不是被应用。
- 失败的申请会被记录（`status: failed`、`error_code`），因此每个
  尝试的运行是可审计的，并且日志提交从不记录成绩单，
  提示或凭据。
- 在暂存之前检查重复的 ID，并在模型编辑之后再次检查；的
  诊断包括两条路径，并且永远不会默默地进行重复数据删除。锁
  争用仅写入`.sync/lock-rejections.log`。
- 子、分段、差异和应用失败使用仅元数据重试密钥
  一小时指数退避（最长 24 小时）、三故障哨兵，以及
  `--retry-failed`逃生舱口。抑制重试保存在`.sync/runs/`中
  但切勿替代`last-run.json`。
- 每次实际运行最多提供 10 个空闲会话和 8 MiB 输入。一个有上限的
  批处理保留私有光标并保持 `.last-sync` 不变，直到
  处理剩余的候选者，避免重复的提供者调用。
- 在孩子开始之前，主持人将每个候选人过滤并编辑为
  仅临时分期转录。该模型永远不会收到实时会话
  路径或实时内存根路径；转录本在 diff 之前被删除。

`dsh-memory-sync --dry-run` 保持只读：它报告候选差异
无需触及活动根、锁、日志、Git 或水印。

## v0.3.1：应用前预览

v0.3.1 允许操作员在应用候选同步之前对其进行检查：

- `dsh-memory-sync --preview ` 捕获候选差异（基线加上
  模型编辑）作为 `<root>/.sync/previews/` 下的待定预览，带有
  7 天有效期，无需涂抹任何东西。
- `dsh-memory-sync --apply-preview ` 正常应用待定预览
  同步事务（恢复+应用提交），消耗预览，并且
  记录 `operation: preview` 下的运行。
- `dsh-memory-sync --discard-preview ` 删除待处理的预览。
- `dsh-memory-sync --dry-run --json` 发出单个机器可解析的 JSON
  报告（`dryRun`、`candidateSessions`、`changedPaths`、`added`、`modified`、
  `deleted`、`changedBytes`），所有进度线均从标准输出中抑制。
- `memory.previews()`、`memory.applyPreview()` 和 `memory.discardPreview()`
  向设置 UI 公开相同的流程，其中显示挂起的预览
  应用/放弃操作。

## v0.4：命名空间记录、出处和本地搜索

v0.4 扩展了记录模式并添加了本地搜索功能：

- 记录 ID 可以使用单个 `/` 进行命名空间（`project/codegen`、
  `user/preferences`）；每段为`[a-z0-9][a-z0-9-]*`。
- Front Matter 获得可选来源字段：`source_hash`、`created_by`、
  `review_after` 和 `expires_at`。 `expires_at` 是一个惰性到期投影：
  过期记录将被排除在搜索和冲突解决之外，而无需
  重写他们的前言。
- 确定性冲突解决：共享主题键的记录
  (`type:namespace`) 按状态优先顺序排序，然后是最新的
  `updated_at`，那么最小的id——不需要模型判断。
- `memory.search({ query, limit })` 进行本地全文搜索
  有效负载记录，对标题和正文进行评分并返回一个片段。

## v0.5：备份、兼容性和发布强化

v0.5 添加了围绕内存存储的操作工具：

- `dsh-memory-backup export ` 创建一个独立的 Git 包
  完整的内存历史记录加上清单 sidecar（头、提交计数、有效负载
  文件列表）；现场商店从未被修改。
- `dsh-memory-backup import  [--target <root>]` 将捆绑包恢复为
  作为完整的 Git 工作树的新目录（永远不会覆盖现有的
  存储库），保留恢复/应用/日志/回滚历史记录。
- `docs/compatibility.md` 记录了 DSH 运行时矩阵（rc.6 声明
  对等，rc.7 验证基线，支持 macOS / 预期 Linux / Windows
  不支持）和集成工具默认值。
- 发布清单现在会在发布前验证备份往返。

## v0.6：库支持的遗产