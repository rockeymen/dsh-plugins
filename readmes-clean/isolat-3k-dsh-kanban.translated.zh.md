# DSH Kanban 看板插件

为 DeepSeek Harness（DSH）实现的 Hermes 风格看板插件：9 列任务流转 + 拖拽 + 评论 + 事件时间线 + 多看板 + **定时列自动流转**，并支持把「就绪」任务**派发给 DSH 子代理真实执行**（Ready → Running → Done 自动流转、**心跳监控**与**实时进度**回显、结果摘要回写）。

> 原型：Hermes 桌面端看板插件（`apps/desktop/src/plugins/kanban/`，功能分析见同目录《看板插件功能报告.md》）。
> 实现形式：**静态插件包 `dsh-kanban`，宿主平面挂载（不经任何 Agent 预设）**。插件以 ES 模块包（`plugin/`，Host 半 + dsh.client 客户端 bundle）落地，由 web profile 的补丁层 `~/.dsh/profiles/web/cordis.patch.yml`（`insert` 一行）挂载进宿主组合；进程启动即生效，任意预设的会话都自动获得看板工具与「看板」标签页。**看板数据永久落盘于 `kanban-store.json`。**

## 界面预览

![看板主界面](界面截图.png)

## 文件布局

```
DSH-kanban/
├── 看板插件功能报告.md      # Hermes 原版功能分析（只读参考）
├── 界面截图.png             # 看板主界面截图（README「界面预览」引用）
├── kanban-store.json        # 看板数据（任务/评论/事件/运行记录，自动生成与维护）
├── runs/                    # 派发任务的子代理进度文件（<任务ID>.progress，自动生成与维护，已 gitignore）
├── plugin/                  # 静态包 dsh-kanban（真实 ESM / 浏览器 bundle）
│   ├── package.json         # 包清单：exports ./client、dsh.client 声明（platform: web）
│   ├── index.js             # 包根再导出（兼容按目录候选 index.js 的解析路径）
│   ├── host.js              # Host 半：JSON 存储 + 14 个 RPC + 子代理派发/终止 + 事件循环（定时/心跳/进度）+ 10 个 Agent 工具 + 运行时 skill 注册 + webServer 路由 /kanban/rpc + WebSocket 下行通道 /kanban/events
│   ├── skill.js             # 运行时 skill「kanban」的内容（宿主启动时注册进 skills 注册表）
│   └── client.js            # Client bundle：window.__ModuleLoader__.load 注册，看板 UI（conversation.view「看板」标签页），fetch /kanban/rpc + WebSocket /kanban/events 订阅
└── README.md                # 本文档
```

## 安装（一次性）

1. 包解析 junction（把 `dsh-kanban` 暴露给 profile 引导的 node_modules 解析）：

   ```powershell
   New-Item -ItemType Junction `
     -Path  C:\Users\<用户>\.dsh\profiles\node_modules\dsh-kanban `
     -Target D:\WorkSpace\DSH-kanban\plugin
   ```

2. 补丁层（在 web profile 的宿主组合里插入挂载行），编辑 `C:\Users\<用户>\.dsh\profiles\web\cordis.patch.yml`：

   ```yaml
   - insert:
       - id: kanban
         name: dsh-kanban
   ```

3. 重启 `npx @deepseek-ai/dsh web` 并刷新页面。所有会话——无论选择哪个预设——都自动获得插件（看板标签页 + 10 个 `kanban_*` 工具 + skill 目录中的 `kanban`）。需要对所有 profile 生效时，把同一段补丁放进家级补丁层 `<DSH_HOME>\cordis.patch.yml`。

## 更新流程

- **改 Host（`plugin/host.js`）**：重启 `npx @deepseek-ai/dsh web` 后生效（补丁层随进程启动重新加载）。
- **改 Client（`plugin/client.js`）**：保存后刷新页面即可（bundle 由 `/plugins/dsh-kanban/client.js` 按请求从磁盘读取，no-cache）。
- 数据文件 `kanban-store.json` 与上述更新无关，始终保留。

## 停止 / 移除

- 停用：在补丁层给 kanban 行加 `disabled: true`（或删除 insert 行）后重启；数据文件保留。
- 移除：删除 junction `C:\Users\<用户>\.dsh\profiles\node_modules\dsh-kanban`，并删除 `DSH-kanban/` 目录（数据随 `kanban-store.json` 一起删除）。

## 功能清单

- **9 列泳道**：待细化 → 待办 → 定时 → 就绪 → 运行中 → 阻塞 → 审核 → 完成 → 归档（配色沿用 Hermes `COLUMN_META`）；空列自动收窄为竖条（含竖排列名），点列头可手动折叠/展开（手动收放过的列按选择记忆，localStorage 按看板分键）；归档列默认隐藏可切换显示
- **任务卡片**：标题（两行截断）、正文摘要、优先级徽章、负责人、定时徽章（「还剩xx · 绝对时间」）、评论数、运行中标记、卡片年龄、按列着色左边条
- **拖拽换列**：HTML5 原生拖放（与 Hermes board.tsx 同模式）
- **Ctrl/Cmd 多选 + 批量操作条**：批量移动状态 / 批量删除
- **按列筛选**：标题 / 正文 / ID 全文过滤
- **定时列自动化**（新定时模型）：任务带 `schedule` 放入「定时」列后按设定自动激活进「就绪」——**interval 间隔重复**（每 N 分钟，到点激活记录 `by: 'interval'`，本轮完成后自动回排定时列等下一轮）、**daily 每天固定时刻**（`by: 'daily'`）、**父卡片门禁**（设了父卡片的卡在父卡片完成/归档前不会被自动派发——任何列生效；父卡片被删除视为完成）。激活由每任务一个 `ctx.timeout` 驱动（不再全局扫描）；无 schedule 的定时任务保持纯停放
- **详情抽屉**：当前状态只读展示（彩色圆点 + 状态名）、标题/描述/负责人/优先级/定时方式（间隔/每天/父卡片）**实时保存**（字段变化 600ms 防抖自动保存，无「保存」按钮，关闭抽屉自动 flush）、评论线程、完整事件时间线、执行控制台（运行信息 + 最近活动 + 实时进度 + 结果摘要/错误）
- **多看板**：创建 / 切换 / 删除看板
- **DSH 代理自动派发**（核心）：**「待办/就绪」两列常驻自动派发**——建卡、拖入、定时激活、重启后的存量，凡在这两列、无活跃运行、且父卡片（若有）已完成/归档的卡，事件循环 10s 内自动启动 DSH 子代理执行（Agent 工具渠道挂靠当前发起代理；UI 渠道优先挂靠最近有会话活动的根代理，其次第一个根）→ 完成后自动转「完成」并回写结果摘要；失败转「阻塞」并记录错误（无存活会话等瞬态失败留在原列自动重试）；**派发按钮已移除**，「■ 停止运行」把任务移回**「待细化」**（避免被自动派发立即重跑）；只想记录不执行的卡放「待细化」
- **运行心跳**（事件循环）：子会话日志活动（`session/event`）与进度文件更新都会刷新 `heartbeat_at`；超过 30 分钟无任何信号 → 终止运行并转「阻塞」（原因：心跳丢失），杜绝"假运行"卡片；超时可用环境变量 `DSH_KANBAN_HEARTBEAT_MS`（毫秒）覆盖
- **实时进度**（事件循环）：派发提示词要求子代理向 `DSH-kanban/runs/<任务ID>.progress` 追加进度行，循环读取并在抽屉「执行」区显示最近 50 行
- **Agent 渠道（10 个工具 + skill 引导）**：Host 注册运行时 skill `kanban`（进入会话 skill 目录，模型可主动加载，用户可 `/kanban` 注入），并注册 10 个模型工具——读：`kanban_list_boards` / `kanban_list_tasks` / `kanban_get_task`；写：`kanban_create_task` / `kanban_update_task` / `kanban_add_comment` / `kanban_create_board`；执行：`kanban_dispatch_task` / `kanban_stop_task` / `kanban_delete_task`。全部与 UI 操作走同一套校验（含父卡片环检测）、事件与落盘逻辑；省略 `board` 的定位类工具会在所有看板中查找任务 id。工具调用在对话中以 `presentCall`/`presentResult` 渲染为文字提示卡片（不做自定义富卡片）
- **结算提醒（纯文字）**：客户端帧级浮层（`shell.overlay` 槽位）WebSocket 快照 diff——任务完成/失败弹 6s 文字 toast；页面刷新不回放历史结算（WS 断线时退回 5s 轮询兜底）
- **持久化**：每次变更 250ms 防抖落盘；刷新页面、重跑插件、重启 DSH 数据都不丢

## 入口

- 会话视图中的「看板」标签页（`conversation.view` 插槽，id=kanban）；关闭 = 切回「聊天」标签。

## 数据格式（kanban-store.json）

```jsonc
{
  "schemaVersion": 1,
  "boards": [{
    "slug": "main", "name": "主看板", "created_at": 1786642238696,
    "tasks": [{
      "id": "t_xxx", "title": "…", "body": "…",
      "status": "triage|todo|scheduled|ready|running|blocked|review|done|archived",
      "assignee": null | "标签", "priority": 0|1|2,
      "schedule": null | {
        "kind": "interval" | "daily" | null,   // interval=间隔重复，daily=每天固定时刻；null 且无 parentId 时纯停放
        "intervalMinutes": 30,                  // kind=interval 时：间隔分钟（1-10080，最长 7 天）
        "dailyMinutes": 540,                    // kind=daily 时：当天第几分钟（如 09:00 → 540）
        "parentId": null | "t_xxx",             // 可选父卡片（全局门禁）：父完成/归档/被删除前不自动派发；不设则不门禁
        "base": 1786642238696,                  // kind=interval 时：整倍数网格锚点（编辑保留，回排不随运行时长漂移）
        "nextAt": 1786642238696 | null          // 下一次激活时间（epoch 毫秒）；激活后置 null，重复任务在完成后回排
      },
      "created_at": …, "updated_at": …,
      "comments": [{ "id": "c_xxx", "author": "user" | "agent", "body": "…", "created_at": … }],
      "events":  [{ "id": 1, "kind": "created|edited|moved|commented|dispatched|completed|terminated|blocked", "payload": {}, "created_at": … }],
      "run": null | { "provider": "…", "runId": "…", "seq": 1, "started_at": …, "ended_at": …,
        "outcome": "done|error|terminated", "summary": "…", "error": "…",
        "heartbeat_at": …, "progress": ["…"], "progressLineCount": 0 }
    }]
  }]
}
```

## RPC 面（Host webServer 路由 `POST /kanban/rpc`，Client 经 fetch 调用）

`getStore`（内存缓存）`reload`（丢弃缓存强制重读磁盘，刷新按钮用）`listModels` `createBoard` `deleteBoard` `createTask` `patchTask` `moveTask` `bulkMove` `bulkDelete` `deleteTask` `addComment` `dispatch` `terminate`

## 实时推送（WebSocket 下行通道 `GET /kanban/events`）

Host 经 `webServer.registerUpgrade` 注册 `/kanban/events` 升级路由，客户端以浏览器原生 WebSocket 连接。任何来源的 store 变更（UI 操作、Agent 工具、定时激活、运行进度/心跳、任务结算）都会在 Host 端防抖 100ms 合并后广播一帧**全量快照**给所有连接：

```json
{ "type": "snapshot", "boards": [ …与 getStore 相同… ], "now": 1786642238696 }
```

- **零依赖**：服务端握手用 `node:crypto` 自实现（RFC 6455，仅下行文本帧），不新增 npm 依赖；客户端无任何依赖。
- **下行专用**：客户端发文本/二进制帧按 1008（downlink only）关闭，仅接受 close/ping（pong 静默忽略）——与 harness 自带下行通道同语义。
- **安全**：握手前同源校验（Origin 与 Host 不一致 → 403），与 `/kanban/rpc` 一致。
- **保活**：服务端每 30s 发 ping；客户端据此察觉死连接并重连。
- **容错**：客户端断线按 1s 起指数退避重连（上限 15s）；断开期间界面退回 5s 轮询兜底，重连后自动恢复推送。旧版 Host（无此路由）时客户端同样始终轮询。
- **粒度**：任务卡片/状态/评论/结算类事件 <1s 送达；运行进度受 10s 事件循环读取进度文件的节奏约束（子代理按步骤写进度行，粒度匹配）。
- 快照推送为全量覆盖式（本地单机工具、数据量小），不做增量 diff；多标签页各持一条连接，全部实时同步。

## 与 Hermes 原版的差异（有意取舍）

### Hermes · 本插件
- **Hermes**: 60s 调度器自动派发 Ready 任务 · **本插件**: **待办/就绪两列自动派发**（事件循环 10s 内；父卡片门禁等待；想记录不执行放待细化）
- **Hermes**: scheduled 列仅停放（时间归 cron，唤醒靠 agent 执行 `kanban unblock`） · **本插件**: **任务级 schedule**：interval / daily 每任务一个 `ctx.timeout` 到点激活；父卡片为全局门禁
- **Hermes**: 运行中的代理可轮询新评论 · **本插件**: 评论仅记录；运行期间新评论不实时送达（重跑时经【追加评论】随任务正文带入）
- **Hermes**: 代理心跳 + 超时回收（`last_heartbeat_at`） · **本插件**: 子会话日志活动 + 进度文件双重信号刷新心跳；30 分钟无信号 → 终止并转「阻塞」
- **Hermes**: WebSocket 事件流（每事件即推） · **本插件**: **WebSocket 全量快照推送**（`/kanban/events`，防抖合并；断线退回 5s 轮询兜底）
- **Hermes**: 父/子任务门禁、附件、工作量预估、编排设置、四语言 i18n · **本插件**: 未实现（列为后续可选扩展）
- **Hermes**: `~/.hermes/kanban.db` SQLite · **本插件**: 单文件 JSON（工作区内，跨重启持久）

## 派发提示词结构（Host `buildPrompt`）

派发给 DSH 子代理的提示词按以下结构组装（无对应数据的区块自动省略）：

```
你被派发执行一个看板任务（DeepSeek Harness kanban dispatch）。

【任务标题】<title>
【任务描述】（有则输出）
【补充要求】（派发时给出则输出）

【进度汇报】
看板会通过工作区文件 DSH-kanban/runs/<任务ID>.progress 实时展示你的执行进度。
每完成一个重要步骤（例如完成一次检查、写完一个文件、完成一次验证），请向该文件
追加一行简短的中文进度说明。只追加、不覆盖、不删除该文件，也不要写入时间戳
（看板会自动记录时间）。若某个步骤需要长时间执行，请在该步骤开始与结束时各追加一行。

【追加评论】…（有评论时：`- <author> MM-DD HH:mm：内容` 逐行列出，author 为 user 或 agent）
【上次运行】…（有运行记录时：结果/摘要/错误）

【看板协作】
若你的会话中提供看板工具（kanban_add_comment 等），可以用它们向本任务追加评论（供看板
界面的人阅读），但不要用任何工具修改本任务的状态或字段：任务状态由看板的结算逻辑自动管理。

【完成要求】
请在当前工作区中完成该任务。完成后，用一段简短的总结说明你做了什么、结果如何、
以及遗留事项（如有）。这段总结将作为任务的完成摘要写回看板。
```

## Agent 工具清单（Host `KANBAN_TOOLS`）

### 工具 · 作用 · 定位方式（省略 board 时）
- **工具**: `kanban_list_boards` · **作用**: 列出全部看板与各列负载 · **定位方式（省略 board 时）**: —
- **工具**: `kanban_list_tasks` · **作用**: 按 status/priority_min/assignee/query/limit 过滤列任务（按优先级降序） · **定位方式（省略 board 时）**: 第一个看板
- **工具**: `kanban_get_task` · **作用**: 任务全量：字段/评论(近20)/事件(近20)/最近运行(结果、摘要、错误、进度尾 50 行) · **定位方式（省略 board 时）**: 所有看板搜索 id
- **工具**: `kanban_create_task` · **作用**: 建卡（title 必填；body/status/priority/assignee/schedule 可选） · **定位方式（省略 board 时）**: 第一个看板
- **工具**: `kanban_update_task` · **作用**: patch 改字段（title/body/priority/assignee/schedu