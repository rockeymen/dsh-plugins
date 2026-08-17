# ⏪ dsh-checkpoint-rewind

**统一的 DeepSeek Harness 检查点 —— 会话 + 工作区 + 配置三态快照，一键回滚。**

*Claude Code Checkpoints 的等价物，作为能力接缝（capability-seam）插件实现：每次变更前捕获，用一条经批准的命令恢复三种状态中的任意一个。*

## 兼容性

### 方面 · 状态
- **方面**: Harness · **状态**: DeepSeek Harness `0.1.0-rc.6`（peer 依赖锁定在 `0.1.0-rc.6`）
- **方面**: Node · **状态**: `^22.19.0 \ · \ · >=24.0.0`
- **方面**: 平台 · **状态**: 全部（宿主命令 + 监听器；通过 settings 能力提供可选设置页时间线）
- **方面**: 模型 · **状态**: 任意（不调用模型 —— 快照与恢复是确定性的）

## 你能获得什么

`dsh-checkpoint-rewind` 捕获一个**三态统一检查点**——工作区、会话游标与插件配置——并用一条经批准的命令恢复其中一个或全部：

1. **三态记录** —— 每个检查点保存工作区状态（git 树 SHA，或副本清单）、会话事件游标（`seq` + 轮次边界）与配置快照，并按来源标记（`manual` / `auto` / `guard` / `mutation`）。
2. **四种捕获触发** —— 在每次变更工具执行前（`fs/write-intent`、`fs/edit-intent`、`tools/pre-execute`）、自动间隔（`autoCheckpoint`，默认每步）、手动（`/checkpoint` 与 `checkpoint` 工具）、以及每次回退前的守护检查点。
3. **git 优先的 provider** —— `git stash create` / `commit-tree` 生成未引用快照对象，绝不触碰工作树、索引或历史；恢复仅限工作树且路径显式。非 git 目录（以及尚无 HEAD 的仓库）降级为带硬链接复用的增量 `copy` provider。
4. **一键回滚** —— `/rewind workspace|session|config|all <target>` 恢复所选状态；`preview` 是只读影响报告，`diff <a> ` 比较两个检查点，`clear` 删除它们。
5. **种子重放式会话回退** —— 会话回退通过官方 `sessions.create` 种子 API 将事件重放到检查点边界，生成新的子会话；原会话保留其完整历史。
6. **设置页时间线** —— `Plugins → Checkpoints` 标签页渲染会话的检查点，并附带两两之间的逐行 diff。

## 为什么还需要另一个 rewind 插件？

### 插件 · 卖点 · 恢复文件？ · 回退会话？
- **插件**: **dsh-checkpoint-rewind**（本插件） · **卖点**: git 对象快照 + 三态回滚 + 一键恢复 · **恢复文件？**: ✅ 完整工作区状态 · **回退会话？**: ✅ 种子重放子会话
- **插件**: [Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) · **卖点**: 每变更增量的持久 Change Ledger · **恢复文件？**: ✅ 通过重放逆增量 · **回退会话？**: ✅ 自有 ledger 模型
- **插件**: [LingLambda/dsh-undo](https://github.com/LingLambda/dsh-undo) · **卖点**: 纯上下文回退到上一步完成 · **恢复文件？**: ❌ · **回退会话？**: ✅ 仅上下文
- **插件**: [Mongfayi/dsh-recall](https://github.com/Mongfayi/dsh-recall) · **卖点**: 消息撤回（移除某轮及其后所有内容） · **恢复文件？**: ❌（明确） · **回退会话？**: ✅ 轮次移除

一句话区别：**dsh-checkpoint-rewind 在每次变更前用无副作用的 git 原语捕获*工作区状态*，并把“回到第 N 步”变成一条经批准的命令——先守护检查点，再恢复文件，再恢复配置，再重放会话，每一阶段都有日志。**没有会漂移的增量记账，没有消息级编辑（那属于另一个插件），没有跨设备同步。

## 快速开始

```sh
# 1. 将 bundle 安装到你的 profile
dsh plugin --profile web add "github:PerryLink/dsh-checkpoint-rewind#main"

# 或从 npm 安装（已发布版本）
dsh plugin --profile web add dsh-checkpoint-rewind

# 2. 重启并验证该行
dsh --profile web --dump-config | grep -A4 'id: checkpoint-rewind'
```

检查点通过 `storageDomain` 服务持久化。未组合它时插件照常挂载、绝不阻塞 profile 启动——checkpoint/rewind 命令会返回结构化错误并指明要添加的行。一次性组合存储栈即可启用检查点：

```yaml
- insert:
    - id: checkpoint-rewind-storage
      name: '@deepseek-ai/dsh-storage'
    - id: checkpoint-rewind-storage-json
      name: '@deepseek-ai/dsh-storage-json'
      config:
        root: !!js dshHomePath('checkpoint-rewind/storage')
    - id: checkpoint-rewind-storage-domain
      name: '@deepseek-ai/dsh-storage-domain'
      config:
        backend: json
```

该包是纯 ESM，无构建步骤——`index.mjs` 与 `lib/` 即发布产物。工作区变更现在会自动创建检查点；运行 `/rewind` 列出它们：

```text
rewind: 3 checkpoints (newest last):
#a1b2c3d4 · (git) · turn 2 step 1 · 2026-08-14 12:00:01 (3 min ago) · trigger: bash · 4 files · 1.2 MiB
#b2c3d4e5 · (git) · turn 2 step 3 · 2026-08-14 12:00:41 · trigger: str_replace_editor · 2 files · 310 KiB
#c3d4e5f6 · (copy) · turn 3 step 1 · 2026-08-14 12:01:10 · trigger: write · 1 file · 90 KiB
run "/rewind " to restore files and fork the session from that checkpoint
```

通过唯一 id 前缀、步骤号或 `latest` 来定位检查点：

```text
/rewind b2c3d4e5
/rewind step 2
/rewind latest
/rewind preview b2c3d4e5   # 只读：显示哪些文件会变化，不触碰任何内容
/rewind clear              # 确认删除本会话的检查点（文件不受影响）
```

`preview` 使用相同的定位方式解析并打印影响，不请求确认，也不写入任何内容。

## 安装与卸载

- **git 渠道**（最新 `main`）：`dsh plugin --profile web add "github:PerryLink/dsh-checkpoint-rewind#main"` —— 纯 ESM，无需 `prepare` 或 `allowBuilds` 步骤。
- **npm 渠道**（已发布版本）：`dsh plugin --profile web add dsh-checkpoint-rewind`。
- **tarball 渠道**：在本仓库执行 `npm pack`，然后 `dsh plugin --profile web add ./dsh-checkpoint-rewind-<version>.tgz`。
- **存储栈**（检查点必需，挂载不必需）：`@deepseek-ai/dsh-storage` + `@deepseek-ai/dsh-storage-json`（配置 `root`）+ `@deepseek-ai/dsh-storage-domain`（配置 `backend: json`）——见快速开始；未组合时插件仍可挂载，每条命令都会说明修复方法。
- **卸载**：`dsh plugin --profile web remove dsh-checkpoint-rewind` —— 快照文件保留，直到你删除 `$DSH_HOME/dsh-checkpoint-rewind`；git 对象会被垃圾回收。

## 配置

所有可调项都是 Schemastery `Config` 字段（可在 cordis.yml 中修改）。没有任何硬编码。

### 键 · 默认值 · 含义
- **键**: `enabled` · **默认值**: `true` · **含义**: 总开关；为 `false` 时完全移除命令、监听器与 provider
- **键**: `provider` · **默认值**: `auto` · **含义**: 快照 provider：`auto`（有 git 则 git，否则 copy）· `git` · `copy`
- **键**: `gitBin` · **默认值**: `git` · **含义**: Git 可执行文件路径
- **键**: `snapshotDir` · **默认值**: `$DSH_HOME/dsh-checkpoint-rewind`（`$DSH_HOME` 未设置时回退 `~/.dsh/dsh-checkpoint-rewind`） · **含义**: copy provider 快照根目录
- **键**: `maxSnapshots` · **默认值**: `50` · **含义**: 每个会话保留的检查点数（最旧优先清理）
- **键**: `maxSnapshotBytes` · **默认值**: `536870912`（512 MiB） · **含义**: 全局增量字节软配额（每会话最新一条总是保留）
- **键**: `pruneOnTurnEnd` · **默认值**: `true` · **含义**: 轮次结束时执行配额清理
- **键**: `mutationTools` · **默认值**: `['bash','write','edit','str_replace_editor','pwsh','terminal_send']` · **含义**: 在 `tools/pre-execute` 上视为变更型的工具
- **键**: `excludeGlobs` · **默认值**: `['node_modules','.git','.dsh','dist','build']` · **含义**: copy provider 跳过的 glob 模式
- **键**: `confirmVia` · **默认值**: `auto` · **含义**: 确认通道：`auto`（优先 userQuestions）· `userQuestions` · `approval`
- **键**: `listLimit` · **默认值**: `10` · **含义**: 无参 `/rewind` 显示的检查点数
- **键**: `preRewindCheckpoint` · **默认值**: `warn` · **含义**: 恢复前的守护检查点：`warn` · `require` · `off`
- **键**: `verifyByHash` · **默认值**: `false` · **含义**: copy provider 的内容哈希比对与恢复校验
- **键**: `autoCheckpoint.enabled` · **默认值**: `true` · **含义**: `step/start` 上的自动间隔快照
- **键**: `autoCheckpoint.intervalMinutes` · **默认值**: `0` · **含义**: 间隔；`0` = 每步
- **键**: `workspaceRestore` · **默认值**: `restore` · **含义**: 工作区回滚：`restore`（安全覆盖）· `reset-hard`（CC 风格，需显式开启）
- **键**: `promptSection` · **默认值**: `true` · **含义**: 注入一句角色陈述式提示词段落
- **键**: `checkpointTool` · **默认值**: `true` · **含义**: 注册 `checkpoint` 模型工具

```yaml
- insert:
    - id: checkpoint-rewind
      name: dsh-checkpoint-rewind
      config:
        provider: auto
        maxSnapshots: 50
        maxSnapshotBytes: 536870912
        pruneOnTurnEnd: true
        confirmVia: auto
        preRewindCheckpoint: warn
```

## 工具与界面

### 界面 · 类型 · 说明
- **界面**: `/rewind` · **类型**: 命令 · **说明**: `[workspace\ · session\ · config\ · all] \ · latest>` · `diff <a> ` · `preview <target>` · `clear`
- **界面**: `/checkpoint` · **类型**: 命令 · **说明**: `[note <text>\ · list\ · diff <a> ]` —— 捕获手动检查点
- **界面**: `checkpoint` · **类型**: 工具 · **说明**: 捕获带可选备注的手动检查点
- **界面**: `fs/write-intent` · `fs/edit-intent` · `tools/pre-execute` · **类型**: 监听器 · **说明**: 变更前捕获（prepend 直通；绝不抢占策略槽）
- **界面**: `session/event` · **类型**: 监听器 · **说明**: 轮次/步骤跟踪、自动间隔、边界补记、轮次结束清理
- **界面**: `checkpoints` 投影 · **类型**: 会话投影 · **说明**: 由会话日志折叠出的时间线条
- **界面**: 设置页时间线 · **类型**: 客户端 · **说明**: `Plugins → Checkpoints` 标签页，附两两 diff

## 安全模型

- **Git 历史不可触碰。** git provider 只运行白名单内的无副作用原语——`stash create`、`commit-tree`、`restore --worktree`、`ls-tree`、`diff-tree`、`ls-files`、`status`、`rev-parse`——由运行时断言强制，且对象引用在传给 git 前被校验为十六进制 id（被篡改的记录无法注入 git 选项）。**默认绝不 `reset --hard`、绝不 `clean`、绝不改写索引或历史**（见下文 `workspaceRestore`）。
- **覆盖式回滚，绝不删除。** 恢复只覆盖已捕获的文件，且 git provider 恢复**显式路径**（`git restore … -- .` 会删除检查点之后 `git add` 过的文件）。检查点之后新建的文件（未跟踪**或**已暂存）会被*报告*并原样保留。
- **不写穿链接、不路径穿越。** copy provider 在将检查点引用拼入快照目录路径前会校验它们，并拒绝通过已变为符号链接的目标（或其祖先）恢复——因此恢复永远不会跟随链接跑出工作区。
- **恢复必须经批准。** 覆盖用户文件始终经过带 `ask` 语义的确认接缝；缺失、抛错或回答“否”的 answerer **失败关闭**。`/rewind preview` 是先行查看影响的只读方式。
- **回滚可逆。** 恢复前会先捕获当前状态的守护检查点；恢复该守护检查点即可撤销本次回滚。当无法捕获守护检查点时，`preRewindCheckpoint: require` 会中止回滚。
- **固定顺序事务。** 先守护、再工作区、再配置、再会话重放；每一阶段都有日志；恢复失败时文件、检查点与会话均保持原样。
- **`workspaceRestore: 'reset-hard'` 等价于 CC，且需显式开启。** 它运行 `git reset --hard <snapshot commit>`（分支头移动到快照提交；快照前的历史仍可通过 reflog 恢复；未跟踪文件不受影响）。默认关闭。
- **模型可见 ⟺ 落盘。** 用户或模型看到的一切都能从 `command/run` + `command/done`（以及宿主认识它们之后的 `checkpoint/*` 事件）加上持久化的 `checkpoints` 领域重建。

## 工作原理

```text
capture ── fs/write-intent · fs/edit-intent · tools/pre-execute (prepend, pass-through)
        ── step/start auto interval ── /checkpoint · checkpoint tool ── pre-rewind guard
             │
             ▼  ProviderRegistry.resolve(auto)  →  git: stash create / commit-tree
             │                                     copy: incremental dir + hardlinks
             ▼
        checkpoints storage domain (SQLite rows / JSON file)  +  checkpoint/* event (adaptive gate)

/rewind <target> ── confirm (userQuestions / approval, fail-closed) ──▶ guard checkpoint
             ├─ workspace: provider.restore(ref)  (restore | reset-hard)
             ├─ config:   settings namespace write-back (persisted)
             └─ session:  sessions.create(seed replay) → new child session (original untouched)
```

完整决策记录、事件词汇表与 provider 接缝契约：[ARCHITECTURE.md](ARCHITECTURE.md)。

## 会话事件（rc.6 说明）

该插件将 `checkpoint/snapshot`、`checkpoint/bound`、`checkpoint/prune` 与 `checkpoint/rewind` 声明为仅日志的 `SessionEventMap` 成员。Harness rc.6 **没有插件事件注册面**，且 `Session.append` 会静默丢弃未知选项键，因此追加未知类型会让会话在重新加载时无法读取。该插件因此通过**自适应门**追加：运行时探测（在一个分离的、永不持久化的会话存储上）检测宿主的 `append` 是否会盖章 `ignorable` 信封——在 rc.6 上门保持关闭；在支持它的宿主上，`checkpoint/*` 事件会自动以 `ignorable: true` 追加。在那之前，权威审计链是 `command/run` + `command/done`（宿主已知）加上持久化的 `checkpoints` 存储领域。

## Web UI 锚点

插件在命令结果中返回新会话 id（`session: `），Web shell 可以跳转过去。**会话投影单元 `checkpoints` 已随附**：每当 `ctx.sessionProjections` 存在时，插件通过 `ctx.inject` 注册该单元（把 `checkpoint/snapshot|bound|prune|rewind` 折叠成整值列表）——在 rc.6 宿主上它保持空列表，直到某个 harness 版本随附 `checkpoint/*` 词汇表或 `ignorable` 信封，届时零插件改动即可填充。

## FAQ

**这会不会取代 git？** 不会——在可用时会*使用* git。在 git 仓库中，你得到字节级精确、去重、不触碰历史的快照对象；在任何其他目录中，copy provider 用普通文件实现同样的效果。常规提交仍是你长期的历史。

**为什么默认不用 `git reset --hard`？** 因为破坏状态不是安全网该干的事。默认情况下，插件只创建未引用对象并执行仅工作树、路径显式的恢复，因此糟糕的回滚永远不会丢失历史、索引或检查点之后创建的文件。`reset-hard` 在 `workspaceRestore: 'reset-hard'` 之后可用，供明确想要 CC 对齐的用户使用。

**能回退到某一轮中间的某一步吗？** 文件恢复是步骤级精确的（`/rewind step <N>` = ≤ N 的最近快照）。但会话重放遵循 harness 的重放粒度：子会话被种子填充到检查点的轮次边界。

**如果没人能回答确认会怎样？** 不触碰任何内容——插件失败关闭（`unavailable`/`rejected`），保留检查点，并返回解释性错误。在 rc.6 上使用 `confirmVia: approval` 时，消息会提示挂载 userQuestions，因为 approval 需要开放的轮次，而命令在轮次之间运行。

**能撤销一次回滚吗？** 能——每次经批准的回滚都会先捕获回滚前状态的守护检查点；结果会打印 `rewind guard: `，`/rewind <guard-id>` 会恢复该状态。

**如何定位检查点？** 唯一 id 前缀（列表中的 8 位短 id 即可）、`/rewind step <N>`、`/rewind latest`，或 `/rewind clear` 删除本会话的检查点（文件不受影响）。`/rewind preview <target>` 用相同的定位方式显示影响，不做任何更改。

**`preview` 做什么——又不做什么？** 它解析检查点，然后运行只读比较：哪些文件会被覆盖（或重建）、哪些已经一致、以及检查点之后创建的哪些文件会原样保留。它从不提示、从不写入、从不 fork，也不记录 `checkpoint/rewind` 事件——批准门只在真正的 `/rewind ` 上运行。

## 演示

一次真实的组装式 headless 集成运行（`npm run test:integration`）驱动完整流程：代理在两个轮次中修改文件，然后 `/rewind preview` 以只读方式查看影响（无确认门、无写入），`/rewind ` 恢复文件并把会话重放进新的子会话。该运行断言文件内容、重放后的子上下文、保护检查点，以及检查点之后创建的文件得以保留 —— 覆盖 copy 与 git 两种 provider 流程（git 流程还断言 `HEAD` 与 reflog 未被触碰）。驱动脚本位于 `test/integration/rewind-headless.mjs`。

## 权限与数据

- **权限**：workshop 清单声明 `workspace:read`、`workspace:write`、`git:read`、`git:write`、`snapshot-storage:write`、`session-log:read`、`settings:write` 与 `network:none`。
- **数据**：检查点记录位于 `checkpoints` 存储域（SQLite 行或 JSON 文件）；copy 快照位于 `snapshotDir`。完全本地——无网络、无凭据。
- **会话日志**：`checkpoint/*` 事件经自适应门追加；权威审计链是 `command/run` + `command/done` 加上持久化领域。

## 安全边界

- **Git 历史不可触碰。** 白名单内的无副作用原语；`reset --hard` 仅在显式开启的 `workspaceRestore: 'reset-hard'` 模式之后。绝无 `git clean`。
- **覆盖式回滚，绝不删除。** 恢复只覆盖已捕获的文件；检查点之后创建的文件会被报告并原样保留。
- **不写穿链接、不路径穿越。** copy 的 `ref` 会作为快照 id 校验；恢复拒绝跟随符号链接跑出工作区。
- **恢复必须经批准。** 缺失或拒绝的 answerer 失败关闭。
- **回滚可逆。** 先捕获回滚前状态的守护检查点。

## 已知限制

- 在 rc.6 上，`checkpoint/*` 会话事件被自适应门抑制；在宿主随附该词汇表或 `ignorable` 信封之前，审计链由 `command/run` + `command/done` 加存储领域承担。
- `confirmVia: approval` 需要开放的轮次，而命令在轮次之间运行——在 rc.6 上请挂载 userQuestions（或设 `confirmVia: userQuestions`）。
- 会话回退会从检查点边界创建一个**新的子会话**；它绝不改写或截断原会话。
- `workspaceRestore: 'reset-hard'` 会把分支头移动到快照提交；默认关闭。
- 在任何已关闭轮次之前捕获的检查点没有重放边界——此时会话回退会创建一个上下文为空的崭新子会话。

## 故障排查

### 症状 · 原因 / 修复
- **症状**: `/rewind ` 提示 `rewind cancelled: no confirmation answerer` · **原因 / 修复**: 没有挂载 userQuestions/approval 通道——插件失败关闭。请在 Web UI 中运行（或挂载一个提问 provider）；`confirmVia` 选择通道。
- **症状**: `/rewind ` 提示 `approval requires an open turn …` · **原因 / 修复**: 命令在轮次之间运行，而 approval 需要轮次——挂载 userQuestions 或设 `confirmVia: userQuestions`。
- **症状**: `rewind: checkpoint registry unavailable` · **原因 / 修复**: `checkpoints` 存储域无法打开。要么 `storageDomain` 服务未组合（按「快速开始」添加存储栈三行：`@deepseek-ai/dsh-storage` + `@deepseek-ai/dsh-storage-json`（配置 `root`）+ `@deepseek-ai/dsh-storage-domain`（配置 `backend: json`）），要么后端本身出错；检查 harness 日志。
- **症状**: 某检查点显示为 `fork: pending (turn not closed)` · **原因 / 修复**: 它的轮次还没有 `turn/end`；文件仍可恢复，但会话重放要等轮次关闭。
- **症状**: `files restored … but the session was NOT replayed` · **原因 / 修复**: 事务的会话阶段失败（没有已关闭边界，或重放被拒）。文件保持已恢复；用打印出的 `rewind guard: ` 撤销。
- **症状**: `rewind: aborted — the pre-rewind guard checkpoint could not be captured` · **原因 / 修复**: `preRewindCheckpoint: require` 因守护捕获失败而拒绝回滚；修复存储（或设 `warn`/`off`）。
- **症状**: 某检查点显示为 `(copy)`，尽管目录是仓库 · **原因 / 修复**: 尚无 HEAD（没有初始提交）：git 快照原语需要 HEAD，因此插件在首次提交前降级为 `copy`。
- **症状**: headless 运行中 `MISSING_CREDENTIAL` · **原因 / 修复**: 与本插件无关：模型 provider 未配置 `DEEPSEEK_API_KEY`。
- **症状**: 快照存储增长 · **原因 / 修复**: 每次快照后及 `turn/end`（`pruneOnTurnEnd`）都会清理；调低 `maxSnapshots` / `maxSnapshotBytes`、运行 `/rewind clear`，或卸载后删除 `$DSH_HOME/dsh-checkpoint-rewind`。

## 开发

```sh
npm install               # peer 依赖：@deepseek-ai/dsh-session@0.1.0-rc.6、schemastery、zod
npm test                  # node --test test/**/*.test.mjs（含 provider 套件）
npm run test:integration  # 组装式 headless 验证（test/integration/）
```

无构建步骤：纯 ESM——`index.mjs`/`lib/` 即发布产物。

## 主题

`deepseek-harness`, `dsh`, `dsh-plugin`, `rewind`, `checkpoint`, `snapshot`, `session-replay`, `session-fork`, `config-restore`, `workspace-safety`, `undo`, `cordis-plugin`

## 贡献者

- [@PerryLink](https://github.com/PerryLink) —— 创建者与维护者：三态检查点模型、git/copy provider 接缝、三阶段回滚事务、设置页时间线、文档、CI/CD 与发布。

## PerryLink DSH 插件家族

本项目是由 [PerryLink](https://github.com/PerryLink) 维护的 DeepSeek Harness 插件之一。如果这个对你有帮助，其他的很可能也会：

### 插件 · 一句话
- **插件**: [dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel) · **一句话**: 只读 MCP 运行时面板：/mcp 命令 + 带状态、工具与错误的 Settings 标签页
- **插件**: [dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) · **一句话**: 工程纪律守护：需求盘问、测试关卡、对抗式评审
- **插件**: [dsh-background-agents](https://github.com/PerryLink/dsh-background-agents) · **一句话**: 带 Web UI 侧栏、消息与中断的持久后台子代理
- **插件**: [dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions) · **一句话**: 通过语言服务器的 LSP 诊断、格式化、补全、代码操作与重命名
- **插件**: [dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) · **一句话**: Claude Code outputStyles 等价物的运行时样式切换
- **插件**: **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** · **一句话**: Claude Code /rewind 等价物：快照、会话 fork、一键恢复
- **插件**: [dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) · **一句话**: Claude Code 风格的声明式 allow/deny/ask 权限规则，带审计
- **插件**: [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) · **一句话**: 批准链上的第二个模型自动评审，默认失败关闭
- **插件**: [dsh-memento](https://github.com/PerryLink/dsh-memento) · **一句话**: 批准门控的跨会话记忆：ctx.memory 接缝 + SQLite + memory 工具
- **插件**: [dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) · **一句话**: 安全审计技能包：密钥扫描、依赖与供应链审查
- **插件**: [dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) · **一句话**: 在 Web 侧栏固定会话，带持久排序
- **插件**: [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) · **一句话**: Web 编辑器终端式输入历史：方向键、Ctrl+R 搜索
- **插件**: [dsh-github](https://github.com/PerryLink/dsh-github) · **一句话**: DSH 的 GitHub PR/issues 集成，每次写入都经批准门控
- **插件**: [dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide) · **一句话**: 作为按需代理技能的插件开发知识库
- **插件**: [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) · **一句话**: 把 Claude Code 会话、记忆、技能与 CLAUDE.md 迁移到 DSH

## 许可证

[Apache License 2.0](LICENSE) © 2026 dsh-checkpoint-rewind contributors