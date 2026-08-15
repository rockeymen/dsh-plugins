#dsh-sentinel

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的条件驱动唤醒：代理注册手表，进入睡眠状态 - 甚至关闭会话 - 当条件发生时哨兵将其唤醒。每次订阅和每次触发都是用户可见的会话事件，浏览器底座会显示正在值班的内容。

![哨兵坞面板，展开](docs/preview/sentinel-panel.png)

## 它是如何工作的

节点一半拥有一个服务器生命周期运行时，它将插件拥有的 sidecar 日志 (`$DSH_HOME/sentinel.jsonl`) 折叠到实时订阅中，在共享的 5 秒心跳上探测每个传感器，并通过官方后续通道提供唤醒 - 在需要时首先恢复休眠会话的代理。因此，订阅可以在进程重新启动以及服务器在下一次探测中延迟关闭时变为真实的条件中幸存下来。

监视是常驻进程关注的问题：探测和触发传递仅在长期运行的 dsh 进程（通常为 `dsh web`）启动时运行。无头一次性运行会加载插件，并可以创建、列出和取消监视，但进程退出后不会进行任何探测 - 一旦常驻进程启动，这些监视就会变为活动状态。

每个 `$DSH_HOME` 一个职责所有者：租赁文件 (`sentinel.lease`) 使第一个进程自己进行探测和交付；同一个 home 上的第二个 dsh 进程保持被动（工具工作，写入持续到共享 sidecar），并在所有者死亡后的一个租约 TTL 内接管。所有者每次心跳都会重新读取 sidecar，因此会自动采用在被动实例上创建的监视。传递至少一次：在下次启动时从其 `delivered` 水印重新排队之前，记录了火灾但未传递崩溃。

浏览器部分是作曲家（`conversation.input.dock` 系列）上方的扩展坞卡，列出了会话的活动监视 - 传感器、目标、实时探测状态、火力预算、下一次探测倒计时 - 以及展开时的最近火力历史记录。它轮询只读状态路由，并且当会话没有监视时不渲染任何内容。

两个表面使服务器全局监视集可见。侧边栏分支会在每个具有活动监视的会话行下生长（`sidebar.workspaces.sessionRow.branch`，所有行的一个共享轮询器） - 折叠后它是 `👁` 计数，展开时它会列出会话的监视和仪表板链接。仪表板是每个会话中每个监视的独立表格：会话（活动/休眠）、传感器、目标、模式、火力预算、上一个探测状态、下一个探测。

### 侧边栏分支 · 全局仪表板
- **侧边栏分支**： ![侧边栏分支](docs/preview/sentinel-sidebar-branch.png) · **全局仪表板**： ![仪表板](docs/preview/sentinel-dashboard.png)

## 传感器

### 种类 · 引擎 · 点火
- **种类**：`file` · **引擎**：路径快照 + inotify 推送 · **触发**：快照更改（亚秒）； FS事件加速
- **种类**：`command` · **引擎**：只读 shell 行，每隔一段时间探测一次 · **触发**：输出/退出代码更改
- **种类**：`http` · **引擎**：按时间间隔探测 URL · **触发**：状态/正文更改
- **种类**：`process` · **引擎**：`pgrep -f` 模式，按一定时间间隔进行探测 · **触发**：匹配设置更改
- **种类**：`port` · **引擎**：TCP 连接到 `[host:]port`，按一定时间间隔进行探测 · **触发**：可达性更改（打开/关闭/超时）
- **种类**：`webhook` · **引擎**：纯推送 · **触发**：对返回的钩子 URL 进行任何 POST

使用 `pattern`，探针类型会在正则表达式的不匹配→匹配边缘上触发，并且 webhooks 仅接受匹配的有效负载；如果没有它，探针类型会在基线之后的任何变化上触发。

## 配置

所有部署可调旋钮都位于插件的配置模式中（默认值在括号中）；在您的个人资料的 `cordis.patch.yml` 中的捆绑行上覆盖它们：

```yaml
- id: dsh-sentinel
  name: '@dsh-external/dsh-sentinel'
  config:
    heartbeatMs: 5000            # probe round interval
    probeConcurrency: 8          # in-flight probes per round
    maxSubscriptionsPerSession: 16
    maxPendingWakeups: 8         # queued wakeups per session before dropping oldest
    defaultIntervalSeconds: 30   # when a watch does not specify one (5–86400)
    defaultCooldownSeconds: 60
    dutyLeaseTtlMs: 30000        # passive-instance takeover window after the owner dies
    notifyWebhookUrl: ''         # optional: POST every fire here as JSON
```

无效值导致插件加载失败，并出现模式错误，而不是在运行时行为不当。

`notifyWebhookUrl` 以 JSON POST (`{plugin, event, sessionId, id, kind, target, note, fireNumber, maxFires, summary, after}`) 的形式将线束中的所有火焰扇出——将其指向 Lark/WeCom/Slack 机器人或任何接收器。传递至多一次：失败的 POST 会在日志中发出警告，并且永远不会阻止线束内唤醒。

## 工具

- `sentinel_watch` — 注册手表：`kind`、`target`、可选 `pattern`、`interval`（1–3600 秒，默认 30）、`note`（每次唤醒时逐字传递）、`maxFires`（默认 1：一次性）、`cooldown`（默认） 60s），可选`ttl`。
- `sentinel_list` — 具有实时探测状态的主动手表。
- `sentinel_cancel` — 通过 ID 取消一只手表。

## 路线

- `GET /plugins/dsh-sentinel/state?sessionId=…` — 停靠栏和侧边栏分支的只读状态（对于每个会话省略 `sessionId`）。
- `GET /plugins/dsh-sentinel/dashboard` — 服务器全局观察表。
- `POST /plugins/dsh-sentinel/hook?id=watch-N&s=<sessionId>` — webhook 条目；将 `curl` 放入 CI 作业、git hook 或另一台机器的脚本中以唤醒代理。监视 ID 是针对每个会话的，因此 `s` 限定符可以防止两个会话的 `watch-1` 挂钩发生冲突（该工具会分发完整的 URL）。没有 `s` 的 URL 仍然有效并解析为第一个匹配的 webhook 监视。
- `POST /plugins/dsh-sentinel/cancel?sessionId=…&id=watch-N` — 手动取消。仪表板表和每个 UI 行都带有一个 ✕ 来调用此功能，因此始终可以手动停止手表 - 包括会话（和代理）早已消失的孤立手表；主机没有会话删除事件，因此这是最后的终止开关。
- 所有四个路由都强制执行浏览器信任围栏：浏览器标记的跨站点请求（恶意页面可以通过 POST 方式发送到本地主机）和 DNS 重新绑定尝试（命名 DNS 主机的主机/源）得到 403。无标头客户端（例如 `curl` 和 CI 作业）不受影响。状态路由还报告每个会话的 `duty`（租用心跳期限）和 `droppedWakeups`（按 `maxPendingWakeups` 上限丢弃的排队唤醒）。

第一个探针语义：无模式手表吸收其第一次观察作为基线（不触发），而目标已经匹配的模式手表在第一个探针上触发 - 条件已经成立。

## 安装

通过官方捆绑渠道一行（构建工件已提交，因此 git-source 安装不运行构建）：

```sh
dsh plugin --profile web add "github:fuhefei/dsh-sentinel#v0.10.0"
```

或者，通过发布的基础上的补丁列表配置手动添加一半节点：

```yaml
# cordis.patch.yml
- insert:
    - id: dsh-sentinel
      name: '@dsh-external/dsh-sentinel'
```

浏览器的一半在同一个包 (`./client`) 中提供，并由 Web UI 的插件加载器注入。

### 侧边栏分支先决条件

扩展坞和仪表板在库存主机上工作。侧边栏分支需要会话行扩展孔，官方树尚未声明；将捆绑补丁应用到您的 DSH 源签出并重建 `ui-workspace`：

```sh
git apply /path/to/dsh-sentinel/patches/session-row-holes.patch
```

该补丁将 `sidebar.workspaces.sessionRow` 和 `sidebar.workspaces.sessionRow.branch` 声明为 **root** 范围内的 **list** 洞（每个注册者按顺序渲染）（侧边栏行在任何会话绑定之外渲染；该行通过所有者属性传递其 `sessionId`）。 [dsh-subagent-tree](https://github.com/dsh-external/dsh-subagent-tree) 为具有不同语义（键控/会话）的相同孔名称提供了补丁；应用其中之一，而不是同时应用两者。

### 更好的侧边栏集成（可选）

当 [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) 安装在同一配置文件中时，哨兵通过 better-sidebar 记录的 `ctx.betterSidebar.registerTab` 扩展表面将其全局监视表注册为侧边栏选项卡（`dsh-sentinel:watches`，在 **+** 菜单中）：每个监视服务器范围内的实时探测状态、火灾预算和最近的火灾历史记录，由一个共享轮询器提供。无需配置；如果没有更好的侧边栏，注册将被默默地跳过，码头/分支/仪表板将继续像以前一样工作。

![better-sidebar 工作台内的 Sentinel 选项卡](docs/preview/sentinel-better-sidebar-tab.png)

### 玩得很好

与哨兵一起安装 [dsh-notification](https://github.com/omdsh-dev/dsh-notification)，整个唤醒循环到达您的桌面：哨兵唤醒代理，代理进行轮次工作，轮次完成后会触发桌面通知 - 无集成