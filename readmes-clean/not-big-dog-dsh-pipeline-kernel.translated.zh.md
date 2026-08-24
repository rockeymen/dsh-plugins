# pipeline-kernel

> DeepSeek Harness (DSH) 插件（Cordis）｜ 多 Agent 管线管理内核：任务板 / 台账 / 部署 / 注册表 / 巡检 / 打包复用 / 控制面板
> A DSH (DeepSeek Harness) Cordis plugin — the management kernel for multi-agent pipelines: task board / ledger / deployment / registry / watchdog / packaging & reuse / control panel.

**pipeline-kernel 是管线无关的管理内核**：管线 = 配置数据（`pipelines` 表一行，用 `pipeline_define` 定义），内核不绑定任何具体业务。默认**无预置管线**，由使用者自行定义与部署。

**The kernel is pipeline-agnostic**: a pipeline is just a config row (defined via `pipeline_define`); no business is baked in. There is **no preset pipeline** — define and deploy your own.

[English](#english) · [中文](#中文)

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

### 文档 · 内容
- **文档**: `docs/管线定义规范.md` · **内容**: 管线定义字段与拓扑规范（roles/chain/gates/entry…）
- **文档**: `docs/内核接口文档.md` · **内容**: 内核工具与端点清单（pipeline_* / HTTP 路由）
- **文档**: `docs/内核设计文档.md` · **内容**: 架构与职责划分
- **文档**: `docs/UI-方案-K7-边栏设计.md` · **内容**: 控制面板 UI 方案

## English

### Positioning

- **内核 = 与管道无关的管理**（通信/账本/UI — 参见 `docs/`）； **管道 = 数据（配置行）**
- 业务功能（图像生成、视频等）属于管道内部，而不是内核
- 双语：UI和文档遵循DSH语言设置（中文/英语）

### 安装

```jsonc
// C:\Users\<you>\.dsh\profiles\web\package.json → dependencies
"dsh-pipeline-kernel": "link:"
// add "dsh-pipeline-kernel" to the bundles list
```

或者`dsh plugin --profile web add `。重新启动 dsh Web 后，**新会话**将获取 `pipeline_*` 工具（现有会话保留其固定工具目录 - 重新创建它们）。

> **依赖项要求 (v0.9+)：主机 `deepseek-harness 0.1.0-rc.8` 或更新版本**（此插件固定 `^0.1.0-rc.8` 本身；cordis 4.x）。开发/CI 使用 `pnpm install --frozen-lockfile`。

### 快速开始

1.定义一个管道：`pipeline_define {id:"my-pipe", roles:{supervisor:{preset:"pipeline-supervisor"}, ...}, chain:["supervisor",...], gates:{...}}`
2. 部署：`pipeline_deploy {pipelineId:"my-pipe"}`
3.种子角色会话：`pipeline_seed {pipelineId:"my-pipe"}`（为未注册角色创建会话，写入注册表）
4.推送任务：`pipeline_push {title, description, tags:["target:<role>","task:","attempt:1"]}`
5.流程：`pipeline_list`→`pipeline_claim`→`pipeline_done {result:"done route:<role|UID> artifacts:..."}`（自动路由到下一个链路）
6、概述：`pipeline_status`

### 控制面板（Web UI）

右下角的 **管道** 药丸扩展为全高侧边栏：

- **活动**：每个管道运行摘要（角色状态/正在进行的任务/最近完成/顶部失败）
- **管道**：作为一流实体的管道（图表缩略图/KPI/包）；单击任务将打开任务检查器
- **新建**：定义一个新管道（需要工作文件夹，通过系统目录选择器选择）
- **归档**：冷存储——归档永远不会删除数据并且是可逆的；永久删除仅存在于存档中，需要管道 ID 确认

### 看门狗

**自 v0.8 起默认开启**（无需配置）：每 5 分钟重新唤醒开放任务（每个任务 10 分钟冷却时间），自我修复僵尸任务（已完成，但路由从未完成），并在 30 分钟后向主管报告停滞的链。零噪音，没有管道/任务。在`cordis.patch.yml`中调整或禁用：

```yaml
# c:\users\<you>\.dsh\profiles\web\cordis.patch.yml
pipeline-kernel:
  watchdogEnabled: false          # turn watchdog off (default true)
  watchdogIntervalMs: 300000      # tick interval (default 5 min)
  watchdogStallMs: 1800000        # chain-stall threshold (default 30 min)
  watchdogWakeCooldownMs: 600000  # per-task wake cooldown (default 10 min)
  watchdogReportCooldownMs: 1800000
```

### 文档

### 文档·内容
- **文档**：`docs/管线定义规范.md` · **内容**：管道定义架构和拓扑（角色/链/门/入口...）
- **文档**：`docs/内核接口文档.md` · **内容**：内核工具和端点参考（`pipeline_*` / HTTP 路由）
- **文档**：`docs/内核设计文档.md` · **内容**：架构和职责
- **文档**：`docs/UI-方案-K7-边栏设计.md` · **内容**：控制面板UI设计