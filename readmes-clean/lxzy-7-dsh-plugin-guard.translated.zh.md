#dsh-plugin-guard

> 为[DeepSeek Harness](https://github.com/deepseek-ai/dsh)]安装安全网：预安装快照、一键/自动回滚、受保护的启动以及自动触发代理分析的事件报告。
>
> DeepSeek Harness 的插件安装安全网：安装前自动快照、一键/自动回退、启动、事故报告自动触发代理分析。

## 英语

### 它的作用

错误的插件安装可能会导致应用程序无法启动，而手动修复它通常意味着挖掘配置文件。该插件使整个链自动化：

```
Install a plugin (any method)
   │  tools.guard hook: automatic snapshot BEFORE the install (in-process)
   ▼
Guarded boot (boot-guard script)
   │  snapshot before boot → start dsh web → health check
   ├─ healthy ─────────────────────────────► passes through untouched
   └─ unhealthy ─► auto-rollback to last good snapshot → retry once
                   → write an incident report + set a pending marker
                   → the next session's prompt tells the agent to analyze it
                   → after fixing, call `incident_resolved` to clear the marker
```

### 它如何检测问题（理解很重要）

守卫不会静态检查插件代码，也不会尝试单独“测试”插件。检测在三个层面上进行：

1. **快照是纯粹的文件副本。** 拍摄快照仅复制 5 个配置文件（`package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`cordis.yml`、`cordis.patch.yml`）。不运行任何插件，不评估任何行为。

2. **引导级检测确实会在加载插件的情况下运行该工具。** `boot-guard` 脚本启动整个 `dsh web` 进程（加载每个已安装的插件，包括您刚刚添加的插件），然后在超时内对 HTTP `/` 进行运行状况检查。如果插件中断启动 - 加载错误、启动崩溃、服务器无响应 - 检查失败，并且防护程序会自动杀死树，回滚到最后一个良好的快照，然后重试一次。所以**是**：要捕获破坏启动的插件，线束（以及该插件）必须实际启动。这就是“运行插件”是检测的一部分的时刻。

3. **在安装时不会检测到仅运行时的问题。** 如果插件安装并启动正常，但后来行为异常（在特定操作下崩溃、损坏状态等），则没有通用防护可以在不运行实际工作负载的情况下预测这一点。当发生此类事件时，`dsh_rollback action=incident` 会构建问题本地化报告（上次启动日志、服务器 stderr 以及配置文件配置与上次良好快照的差异）并设置待处理标记，以便下一个会话自动专注于诊断它。而且由于快照总是在任何突变之前拍摄，因此您始终可以在突变之后手动回滚。

简而言之：守卫永远不会“判断”插件是否“好”。它保证 (a) 每个突变都是可逆的，(b) 启动失败自动回滚，以及 (c) 事件得到分析，而不是默默地破坏您的设置。

### 安装

```sh
# From GitHub source (current):
dsh plugin --profile web add github:lxzy-7/dsh-plugin-guard

# From the tarball stored in the repo:
dsh plugin --profile web add https://raw.githubusercontent.com/lxzy-7/dsh-plugin-guard/main/dist/dsh-plugin-guard-0.2.2.tgz
```

重新启动`dsh web`。这是一个标准的**捆绑插件**：它加入配置文件层堆栈并自动生效。 （一旦发布到 npm，`dsh plugin --profile web add dsh-plugin-guard` 也可以工作。）

**启用受保护的启动（强烈推荐）：**通过 `scripts/boot-guard.ps1` (Windows) 或 `scripts/boot-guard.sh` (macOS/Linux) 启动，而不是直接运行 `dsh web`。 Windows 上的示例，位于启动器内：

```cmd
@echo off
set DSH_HOME=%~dp0.dsh-home
cd /d %~dp0
powershell -NoProfile -ExecutionPolicy Bypass -File node_modules\dsh-plugin-guard\scripts\boot-guard.ps1
```

**可选的 CLI shim（涵盖手动终端安装）：** 该软件包附带一个 `dsh-guard` bin (`scripts/guard-cli.js`)。将其放在您的 PATH 中，并从终端在 `dsh plugin add ` 之前运行 `dsh-guard snapshot`，或者用它包装您自己的 `dsh` 包装器。这涵盖了不通过进程内 `tools.guard` 挂钩的安装。

**一键手动回滚 (Windows)：** 该软件包还附带 `scripts/rollback.cmd`。安装后，它位于 `$DSH_HOME/profiles//node_modules/dsh-plugin-guard/scripts/rollback.cmd` — 右键单击​​ → *创建快捷方式*（或将文件复制到任何位置），然后双击它以恢复每个配置文件的最后一个良好快照并重新运行 `pnpm install --frozen-lockfile`。回滚还会删除 `node_modules` 中留下的任何孤立的捆绑插件符号链接（pnpm 永远不会删除过时的 `link:` 条目 - “已经是最新的” - 因此防护措施直接针对恢复的 `package.json` 执行此操作）。即使应用程序无法启动，它也可以工作，并且当环境未设置它时，它会自推导 `DSH_HOME`。

### 用法

**设置面板 — 备份管理（备份管理器）。** 在 Web UI 中，打开 **设置（设置）→ 备份管理**：每个环境快照列表、**加载特定备份**、**创建手动快照**以及**设置每个环境保留多少快照（最少 2 个）**。

**代理工具**（为配置文件中的每个会话注册）：

### 工具·目的
- **工具**：`dsh_snapshot` · **用途**：手动快照一个配置文件或所有配置文件
- **工具**：`dsh_rollback` · **用途**：列表/回滚/状态/事件（基于节点，跨平台）
- **工具**：`incident_resolved` · **目的**：在分析/修复后将待处理事件标记为已解决

**CLI**（`dsh-guard`，即使应用程序无法启动也可用）：

```
snapshot  [--profile X] [--tag T] [--reason R] [--force]
list      [--profile X]
rollback  [--profile X] [--id I | --good] [--skip-install]
keep      [N]                     # show or set the per-profile cap (min 2)
health    [--port N]
incident  [--kind K] [--no-marker]
resolve
profiles
```

### 配置

`$DSH_HOME/guard/config.json`（首次写入时自动创建；全部可选）：

```json
{
  "keepSnapshots": 10,
  "port": 3080
}
```

- `keepSnapshots` — 每个配置文件保留多少快照（限制为 2–100，默认 10）。修剪去除较旧的。
- `port` — 运行状况检查/事件报告使用的 Web 端口（默认 3080）。如果您的 `dsh web` 在另一个端口上运行，请设置它。您还可以将 `--port` 传递给 CLI。

每个路径都锚定在 `$DSH_HOME`（当环境变量未设置时默认为 `~/.dsh`）：

```
$DSH_HOME/rollbacks//<stamp>/    snapshots (5 config files + manifest.json)
$DSH_HOME/guard/logs/                     boot/server logs, incident reports, last-boot.txt
$DSH_HOME/guard/pending-incident.json     pending incident marker
$DSH_HOME/guard/config.json               guard settings (keepSnapshots, port)
```

### 回滚语义

- 回滚 = 恢复 4 个配置文件 + `pnpm install --frozen-lockfile` 以准确重现 `node_modules`。
- pnpm解析顺序：快照清单中记录的绝对路径（与安装时的环境相同，与当前PATH无关）→ `DSH_GUARD_PNPM` env var→当前PATH→harness-local `node_modules/.bin`。
- 每次回滚都会首先写入`pre-rollback`快照，因此**回滚本身是可逆的**。
- “最后的好” = 未标记 `pre-boot`/`pre-rollback` 的最新快照。

### 平台支持

### 组件 · Windows · macOS / Linux
- **组件**：插件（工具/挂钩/提示注入） · **Windows**：✅ · **macOS / Linux**：✅
- **组件**：`dsh-guard` CLI · **Windows**：✅ · **macOS / Linux**：✅
- **组件**：受保护的启动脚本 · **Windows**：PowerShell · **macOS / Linux**：bash

### 安全说明

- 该插件仅读取/写入配置文件配置文件和快照；它从不执行第三方代码。 `pnpm install --frozen-lockfile` 仅恢复快照中记录的锁定依赖关系。
- 快照和事件报告是没有凭据的本地文件（凭据位于 `$DSH_HOME` 下的其他位置，而不是在此目录布局中）。
- 仅当启动健康检查失败时才会发生自动回滚；在正常运行时，守卫永远不会默默地更改配置。

### 已知限制

- 事件自动分析涵盖**启动失败类**事件；对于中间会话错误，请手动运行 `dsh_rollback action=incident` 以生成相同的报告。
- 捆绑插件更改需要重新启动网络才能生效。
- 损坏的会话日志是数据问题，超出了回滚范围。

### 发展

```sh
node scripts/smoke-test.js    # engine smoke test (throwaway DSH_HOME, no side effects)
node scripts/guard-cli.js help
```

### 发布

该软件包已获得 MIT 许可，可以发布到 npm（名称：`dsh-plugin-guard`）。它提供零运行时依赖性，并在每次发布之前自动运行引擎冒烟测试 (`prepublishOnly`)，因此永远不会发布损坏的构建。发布：

```sh
npm login     # once, on your machine
npm publish   # runs npm test first, then publishes with public access
```

`repository` / `homepage` 可选 — 添加