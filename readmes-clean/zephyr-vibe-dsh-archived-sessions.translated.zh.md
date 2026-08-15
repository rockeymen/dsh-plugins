# dsh-archived-sessions

A DSH web plugin: a **Session Manager** in Settings — manage every conversation on this machine in one place.

一个 DSH Web 插件：在「设置」中提供**会话管理**，统一管理本机上的所有对话。

## Features（功能）

### English

- **Two tabs**: **All conversations** (non-archived) and **Archived**
- **View modes**: **flat list** or **grouped by workspace** (sessions without a workspace fall back to "Ungrouped")
- Browse conversations by title + relative time, newest first
- Checkbox / drag-to-select / select-all / batch **archive** (records kept) / batch **delete** (permanent, with a confirmation modal)
- **Unarchive** from the Archived tab (move back to All conversations)
- **Open record folder** button: opens the selected session's record directory in your OS file manager — cross-platform via `explorer` / `open` / `xdg-open`
- Expand each row for details (collapsed by default): size on disk, last update, produced/downloaded files, parent and child (fork) sessions
- **Subagent sessions** are shown nested under their parent conversation (indented, with a "subagent" badge); when the parent is deleted or missing they surface as top-level rows
- **Deleting a parent session does NOT cascade**: subagent children, forks, and downloaded/produced files are kept unless you explicitly select them — nothing is lost accidentally
- The currently open session shows a **Current** badge and **cannot be deleted**

### 中文

- **双标签页**：**所有对话**（未归档）与**归档会话**
- **视图切换**：**单列表**或**按工作区分组**（无工作区归属的会话兜底归入「未分组」）
- 按标题 + 相对时间浏览对话，最近的排在最前
- 勾选 / 拖动批量勾选 / 全选 / 批量**归档**（记录保留）/ 批量**删除**（永久删除，带确认弹窗）
- 归档页支持**移出归档**（回到所有对话）
- **打开记录文件夹**按钮：在系统文件管理器中打开所选会话的记录目录，跨平台（`explorer` / `open` / `xdg-open`）
- 每行可展开详情（默认收起）：占用空间、最后更新、产出/下载文件、父会话与子会话（分叉）
- **子代理会话**嵌套显示在父会话下方（缩进 + 「子代理」徽标）；父会话被删除或缺失时自动浮出为顶层行
- **删除父会话不会级联**：子代理、分叉、下载/产出文件均保留，除非你显式勾选它们——避免误删
- 当前打开的会话显示「当前会话」徽标，且**不可删除**

## Install（安装）

### 方式一：直接 tarball 安装

Option 1: Direct tarball install.

```sh
dsh plugin --profile web add https://codeload.github.com/Zephyr-vibe/dsh-archived-sessions/tar.gz/refs/heads/main
```

如果 pnpm 拦截构建脚本，在命令末尾加 `--ignore-scripts`：

If pnpm blocks build scripts, append `--ignore-scripts`:

```sh
dsh plugin --profile web add https://codeload.github.com/Zephyr-vibe/dsh-archived-sessions/tar.gz/refs/heads/main --ignore-scripts
```

### 方式二：让 agent 安装

Option 2: Let an agent install it — tell your DSH agent:

```text
帮我把这个项目安装为插件：https://github.com/Zephyr-vibe/dsh-archived-sessions
```

The agent downloads the repo, places it into the profile's `node_modules`, and registers it in `dsh.profile.bundles`.

agent 会下载项目、放入 profile 的 `node_modules` 并注册到 `dsh.profile.bundles`。

安装后重启 web 端，即可在「设置」中看到「会话管理」入口。

After installing, restart the web app — the Session Manager appears in Settings automatically.

## 兼容性（兼容性 / 零配置）

零配置——无需设置，也无需核心补丁。该插件在库存线束上开箱即用。

零配置：除去任何设置，拆除线束开箱即用。

- **零配置**：会话记录目录是从官方 DSH 布局 (`$DSH_HOME/sessions//<session-id>/`) 自动派生的，因此该插件可以在未修改的 Harness 上运行 - 无需核心补丁。
- **存档/取消存档**：适用于库存线束，使用与官方 `archiveSession` 相同的注册表状态原语。
- **删除**：插件分离工作区记帐，删除存档集条目，并通过其物理位置删除会话目录。在已经提供 `workspaceRegistry.deleteSession` / `sessionPersistence.remove` 的 Harness 构建上，它会使用这些。删除是有意的**非级联**：除非明确选择，否则子代理、分叉和文件不会受到影响。实时运行的会话被拒绝并显示友好消息 (409)；库存线束上的打开但空闲会话会要求您首先切换或重新启动（与官方侧边栏删除相同的限制，因为没有公共“处置代理”API）。
- **打开记录文件夹**：用操作系统文件管理器（`explorer` / `open` / `xdg-open`）打开目录，跨平台。
- **环回绑定 API**：插件的 JSON API 仅信任环回请求 (127.0.0.1 / localhost / ::1)。使用 `--host 0.0.0.0` 或 LAN 地址启动 Web 应用程序会导致会话管理器不可用（所有请求均以 403 拒绝）。（API 唯一信任本机回环请求：用 `--host 0.0.0.0` 或邻居地址启动 web 端时，「会话管理」不可用，所有请求返回 403。）
- **删除当前会话**：UI 禁止删除当前打开的会话，并且 DSH 的主机端未公开公开的“当前会话”API，因此 API 本身无法拒绝它。任何可以到达环回 API 的本地进程都可以直接删除它（与官方删除端点相同的行为）——运行会话 409 防护仍然适用。（UI 禁止删除当前会话；DSH 主机端无公开的「当前会话」API，因此接口本身无法拒绝。任何可访问本机 API 的本地进程仍可直接删除当前会话——与官方删除接口行为一致；运行中会话的 409 保护仍然有效。）
- **并发归档/取消归档**：插件序列化自己的归档集突变，删除会清除孤立的归档条目，但插件队列和核心 `archiveSession` 队列（相同毫秒归档 + 取消归档/删除交错）之间的极端竞争仍然可能会丢失更新； （插件自身对归档集变更做了串联化，删除了孤儿归档条目；但插件队列与核心 `archiveSession` 队列之间极端数组（同一同一内归档与取消归档/删除交错）仍可能丢失一次更新，刷新后 UI 自动。）
- 仅使用官方公共 API（`workspaceRegistry`、`sessionPersistence`、`agents`/`sessions` 服务及其自己的受防护 HTTP 路由）——不修改 DSH 核心文件。

### 0.1.2

- **搜索框**：按标题或ID实时过滤会话列表
- 详细信息面板中的**活动统计数据**：转弯、步数、用户/助理消息、工具调用分布和获取历史记录
- **更安全的文件删除**：只能删除会话生成的文件（目录被拒绝），并带有确认对话框和所有已解决的错误摘要
- 批量操作现在以 **20 个** 的批次运行 - 选择数百个会话不再淹没浏览器
- 孤立子代理会话（父级已删除）在工作区视图中再次可见
- 详细血统不再列出相同的子代理两次；失败的工作区不再阻止整个删除
- 相对时间戳自动刷新；键盘（Tab + Enter/空格）选择；在窗口外释放后，拖动选择不再粘住
- 打开记录文件夹现在适用于没有工作目录的会话（`_no-cwd` 布局）；删除丢失的会话返回 404
- 详细响应是有限的（文件 ≤ 200，获取 ≤ 50），因此大型会话保持快速
- 自述文件记录了仅环回 API 和当前会话删除限制

### 0.1.1

- 子代理会话现在**默认折叠**并在单击时展开（父行上的展开/折叠箭头）
- 子代理跟随其父代理进入正确的**工作空间组**（不再转储到“未分组”中）
- 删除父会话现在是**非级联**：除非明确选择，否则子代理、分叉和文件将被保留
- 打开记录文件夹按钮；批量归档/取消归档/删除并确认；当前会话保护
- 库存 Harness 上的 **零配置** — 仅官方 API，无核心补丁

### 0.1.0

- 初始版本：两个选项卡（所有对话/已存档）、平面/按工作空间视图、批量存档和删除、详细信息扩展、子代理嵌套