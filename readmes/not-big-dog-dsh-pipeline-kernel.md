# pipeline-kernel

> DeepSeek Harness (DSH) 插件（Cordis）｜ 多 Agent 管线管理内核：任务板 / 台账 / 部署 / 注册表 / 巡检 / 打包复用 / 控制面板
> A DSH (DeepSeek Harness) Cordis plugin — the management kernel for multi-agent pipelines: task board / ledger / deployment / registry / watchdog / packaging & reuse / control panel.

**pipeline-kernel 是管线无关的管理内核**：管线 = 配置数据（`pipelines` 表一行，用 `pipeline_define` 定义），内核不绑定任何具体业务。默认**无预置管线**，由使用者自行定义与部署。

**The kernel is pipeline-agnostic**: a pipeline is just a config row (defined via `pipeline_define`); no business is baked in. There is **no preset pipeline** — define and deploy your own.

[English](#english) · [中文](#中文)

---

## 中文

### 定位

- **内核 = 管线无关的管理能力**（通讯 / 台账 / UI 三大职责，见 `docs/`）；**管线 = 数据（配置行）**
- 业务能力（生图、视频等）是管线内部设置，不进内核
- 多语言：UI 与文档自动跟随 DSH 语言设置（中文 / English）

### 安装

```jsonc
// C:\Users\<you>\.dsh\profiles\web\package.json → dependencies
"dsh-pipeline-kernel": "link:<本包路径>"
// bundles 列表加入 "dsh-pipeline-kernel"
```

或 `dsh plugin --profile web add <本包路径>`。重启 dsh web 后，**新会话**带 `pipeline_*` 工具（存量会话工具目录固定，需重建会话）。

> **依赖要求（v0.9+）：宿主 `deepseek-harness 0.1.0-rc.8` 及以上**（本插件自身锁定 `^0.1.0-rc.8`，cordis 4.x）。开发/CI 用 `pnpm install --frozen-lockfile`。

### 快速开始

1. 定义管线：`pipeline_define {id:"my-pipe", roles:{supervisor:{preset:"pipeline-supervisor"}, ...}, chain:["supervisor",...], gates:{...}}`
2. 起链：`pipeline_deploy {pipelineId:"my-pipe"}`
3. 播种角色会话：`pipeline_seed {pipelineId:"my-pipe"}`（按定义给未注册角色创建会话，自动写注册表）
4. 投任务：`pipeline_push {title, description, tags:["target:<角色>","task:<编号>","attempt:1"]}`
5. 流转：`pipeline_list` → `pipeline_claim` → `pipeline_done {result:"done route:<角色|UID> 产物:..."}`（内核自动路由下一环）
6. 看全景：`pipeline_status`

### 控制面板（Web UI）

右下角 **pipeline** 胶囊按钮 → 展开右侧全高侧栏：

- **活动**：各管线运行摘要（角色状态 / 进行中任务 / 最近完成 / 失败置顶）
- **管线**：管线一等实体（Graph 缩略图 / KPI / 打包产物）；点击任务展开 Task Inspector
- **新建**：定义新管线（工作文件夹必选，走系统目录选择器）
- **归档**：冷存储——归档不删除数据，可恢复；永久删除仅在归档箱内、需输入管线 id 确认

### 巡检（watchdog）

v0.8 起 **默认开启**（无需配置）：每 5 分钟扫描 open 任务补唤醒（同任务 10 分钟冷却）、done 但路由未完成（僵尸）自愈补投、全链静止 30 分钟汇报主管。无管线/无任务时零噪音。如需调整或关闭，在 `cordis.patch.yml` 覆写：

```yaml
# c:\users\<you>\.dsh\profiles\web\cordis.patch.yml
pipeline-kernel:
  watchdogEnabled: false          # 关闭巡检（默认 true）
  watchdogIntervalMs: 300000      # 巡检周期（默认 5 分钟）
  watchdogStallMs: 1800000        # 全链静止判定（默认 30 分钟）
  watchdogWakeCooldownMs: 600000  # 同任务补唤醒冷却（默认 10 分钟）
  watchdogReportCooldownMs: 1800000
```

### 文档索引

| 文档 | 内容 |
|---|---|
| `docs/管线定义规范.md` | 管线定义字段与拓扑规范（roles/chain/gates/entry…） |
| `docs/内核接口文档.md` | 内核工具与端点清单（pipeline_* / HTTP 路由） |
| `docs/内核设计文档.md` | 架构与职责划分 |
| `docs/UI-方案-K7-边栏设计.md` | 控制面板 UI 方案 |

### License

MIT

---

## English

### Positioning

- **Kernel = pipeline-agnostic management** (communication / ledger / UI — see `docs/`); **pipeline = data (a config row)**
- Business capabilities (image generation, video, …) belong inside the pipeline, not the kernel
- Bilingual: the UI and docs follow the DSH language setting (中文 / English)

### Install

```jsonc
// C:\Users\<you>\.dsh\profiles\web\package.json → dependencies
"dsh-pipeline-kernel": "link:<path-to-this-package>"
// add "dsh-pipeline-kernel" to the bundles list
```

Or `dsh plugin --profile web add <path-to-this-package>`. After restarting dsh web, **new sessions** get the `pipeline_*` tools (existing sessions keep their fixed tool catalog — recreate them).

> **Dependency requirement (v0.9+): host `deepseek-harness 0.1.0-rc.8` or newer** (this plugin pins `^0.1.0-rc.8` itself; cordis 4.x). Dev/CI use `pnpm install --frozen-lockfile`.

### Quick start

1. Define a pipeline: `pipeline_define {id:"my-pipe", roles:{supervisor:{preset:"pipeline-supervisor"}, ...}, chain:["supervisor",...], gates:{...}}`
2. Deploy: `pipeline_deploy {pipelineId:"my-pipe"}`
3. Seed role sessions: `pipeline_seed {pipelineId:"my-pipe"}` (creates sessions for unregistered roles, writes the registry)
4. Push a task: `pipeline_push {title, description, tags:["target:<role>","task:<id>","attempt:1"]}`
5. Flow: `pipeline_list` → `pipeline_claim` → `pipeline_done {result:"done route:<role|UID> artifacts:..."}` (auto-routes to the next link)
6. Overview: `pipeline_status`

### Control panel (Web UI)

The **pipeline** pill at the bottom-right expands into a full-height sidebar:

- **Activity**: per-pipeline run summary (role states / in-progress tasks / recently completed / failures on top)
- **Pipelines**: pipelines as first-class entities (graph thumbnail / KPI / packs); clicking a task opens the Task Inspector
- **New**: define a new pipeline (working folder required, picked via the system directory picker)
- **Archive**: cold storage — archiving never deletes data and is reversible; permanent deletion lives only in the archive, requiring the pipeline id to confirm

### Watchdog

**On by default since v0.8** (no config needed): every 5 minutes it re-wakes open tasks (10-minute cooldown per task), self-heals zombie tasks (done but routing never finished), and reports stalled chains to the supervisor after 30 minutes. Zero noise with no pipelines/tasks. Tune or disable in `cordis.patch.yml`:

```yaml
# c:\users\<you>\.dsh\profiles\web\cordis.patch.yml
pipeline-kernel:
  watchdogEnabled: false          # turn watchdog off (default true)
  watchdogIntervalMs: 300000      # tick interval (default 5 min)
  watchdogStallMs: 1800000        # chain-stall threshold (default 30 min)
  watchdogWakeCooldownMs: 600000  # per-task wake cooldown (default 10 min)
  watchdogReportCooldownMs: 1800000
```

### Docs

| Doc | Content |
|---|---|
| `docs/管线定义规范.md` | Pipeline definition schema & topology (roles/chain/gates/entry…) |
| `docs/内核接口文档.md` | Kernel tool & endpoint reference (`pipeline_*` / HTTP routes) |
| `docs/内核设计文档.md` | Architecture & responsibilities |
| `docs/UI-方案-K7-边栏设计.md` | Control panel UI design |

### License

MIT
