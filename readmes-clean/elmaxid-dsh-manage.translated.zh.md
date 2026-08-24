#dsh-manage

在线安装和管理**DeepSeek Harness (dsh)**
命令。控制 DSH Web 服务器的生命周期 — 安装、
启动、停止、更新和查询状态——幂等地和
坚固耐用。

设计用于在开发位置进行复制并在
在用户的 `node24` 树中隔离安装 DSH。

## 命令

### 命令·它的作用
- **命令**：`install` · **作用**：在 `node24` 树中全局安装 `@deepseek-ai/dsh`
- **命令**：`plugins-install [profile]` · **它的作用**：在配置文件中安装批准的插件堆栈（dev/security/ops） - 默认 `web`
- **命令**：`service-install` · **它的作用**：安装 systemd 看门狗（`dsh.service`、`Restart=always`） - 需要 root
- **命令**：`start` · **它的作用**：如果尚未侦听（幂等），则启动 Web 服务器
- **命令**：`stop` · **它的作用**：停止侦听端口的进程
- **命令**：`update` · **它的作用**：`uninstall` + `install` 清理最新版本并保持运行
- **命令**：`status` · **它的作用**：显示是否有东西侦听端口、pidfile 陈旧并警告是否有更新
- **命令**：`version` · **它的作用**：显示已安装的版本
- **命令**：`check-update` · **它的作用**：将已安装的版本与 npm 中发布的最后一个版本进行比较
- **命令**：`--version`、`-V` · **它的作用**：管理脚本本身的版本（不是 `dsh`） — 请参阅 [CHANGELOG](CHANGELOG.md)

```
dsh-manage start
dsh-manage status
dsh-manage version
dsh-manage check-update
dsh-manage update
dsh-manage stop
```

### 新职位，从头开始到准备编码

```bash
dsh-manage install            # bootstrap de Node (si falta) + @deepseek-ai/dsh
dsh-manage plugins-install    # stack de ~18 plugins homologado (profile 'web')
dsh-manage service-install    # watchdog systemd, deja dsh siempre arriba
```

三个步骤，每个步骤都是幂等的，并且只有在前一个步骤失败时才可以重新执行 -
无需从头开始重试所有内容。

### `check-update` 和 `status`

`check-update` 检查 npm 注册表并显示是否有更新版本：

```
instalada:  0.1.1-rc.2
ultima:     0.1.1-rc.3
hay actualizacion disponible (0.1.1-rc.2 -> 0.1.1-rc.3)
corre: dsh-manage update
```

- 没有网络或者 npm 没有响应 → 报告它无法查询（脚本不会失败）。
- `status` 包含可用更新的简短通知，如果您处于最新状态或没有网络，则不会发出噪音。

### `plugins-install`：批准的插件堆栈

在指定的配置文件中安装约 18 个插件集（默认 `web`）
社区成员真实立场一一评价——干净启动
已验证，无 `id` 碰撞，无中文用户文本无
翻译。每个评估的完整列表和详细信息位于
[`docs/PLUGIN-HOMOLOGATION.md`](docs/PLUGIN-HOMOLOGATION.md)；的来源
消耗命令的真相是[`plugins/manifest.json`](plugins/manifest.json)。

```bash
dsh-manage plugins-install          # profile 'web' (default)
dsh-manage plugins-install headless # otro profile
```

它的作用（按顺序）：

1.检查`dsh`是否已经安装（如果没有，先停止并建议`install`）。
2、如果没有的话准备`pnpm`和`corepack`（`node24`是自带的，但是没有
   直到第一次需要时才激活）。
3. **合并，永不覆盖**：如果配置文件已经有 `package.json` /
   `pnpm-workspace.yaml` 手动安装插件，保留为
   其中 - 清单仅添加了缺少的内容。运行两次是
   安全（已验证：重新安装已存在的插件不会重复任何内容）。
4.从清单中复制`.patch`（`pnpm patch`已应用，版本控制）
   无需踩到您自定义的具有相同文件名的文件。
5. `pnpm install --allow-scripts` + `pnpm approve-builds` 仅限
   真正需要它的本机插件（`cpu-features`、`ssh2`、
   `node-pty` — 来自 `dsh-ssh` 和 `dsh-better-sidebar`）。 `better-sqlite3`用途
   它是官方预构建的，从未被批准编译。
6. 重启dsh（如果`dsh.service`存在则通过`systemctl`，否则通过
   `stop`+`start`）并检查真实启动：端口侦听 + grep from
   日志中的 `duplicate`/`failed to load`/`EADDRINUSE` — 不仅如此
   命令已退出，代码为 0。

包含三个翻译补丁（参见 `plugins/patches/`）：两个插件
他们带来了中文的固定用户消息，没有英文的替代方案
(`dsh-restart-recover`, `dsh-secret-guard`) — 之前被翻译成英文
进入清单，与bug修复相同的`pnpm patch`机制
`dsh-plugin-verify`。

故意将堆栈排除在外：`dsh-doublecheck`（与
DSH 的此版本 — 无法解析、永远无法达到的确切对等版本
已激活）和`dsh-chat-recovery`（已评估但未达到安装
可验证的完整性）。该项目MCP（`engram`、`code-review-graph`、
等）也不输入：它特定于每个位置，通过编辑添加
`cordis.patch.yml`由单独的型材组成。

### `service-install`：看门狗systemd

写入并激活`dsh.service`（`Restart=always`，如果重启只需3秒）
进程死亡）加上修复回归的防御性 `ExecStartPre`
每次启动时都知道 pnpm，而不会启动失败。需要根。

```bash
sudo dsh-manage service-install
```

一旦激活，请使用 `systemctl {status,stop,restart} dsh.service` 代替
来自 `dsh-manage {start,stop}` — 两种机制管理相同的端口并且
你不必混合它们。

## 要求

- **Linux** 带有 `ss` (iproute2) 和 `npm`。
- **以拥有 DSH 进程的用户身份运行**（通常是 `root`）：
  PID检测使用`ss -ltnp`，仅暴露socket pid
  您有权限的。

## 安装

### 一行（推荐用于开发职位）

从存储库下载 `dsh-manage.sh` 并将其保留在 `/usr/local/bin/dsh-manage`：

```bash
curl -fsSL https://raw.githubusercontent.com/elmaxid/dsh-manage/main/install.sh | bash
```

安装程序显示计划，验证下载的内容是否是有效的 bash 脚本
(shebang) 并在安装前要求确认。选项：

### 标志 · 它的作用
- **标志**：`-y, --yes` · **它的作用**：不要求确认
- **标志**：`-v, --verbose` · **它的作用**：详细显示每个步骤
- **标志**：`--prefix <dir>` · **它的作用**：安装目录（默认`/usr/local/bin`）
- **标志**：`--ref <git-ref>` · **它的作用**：要下载的版本/分支/标签（默认 `main`）
- **标志**：`--no-color` · **它的作用**：禁用颜色

```bash
# silencioso para automatizar
curl -fsSL https://raw.githubusercontent.com/elmaxid/dsh-manage/main/install.sh | bash -s -- -y

# inspeccionar antes de ejecutar (más seguro)
curl -fsSL https://raw.githubusercontent.com/elmaxid/dsh-manage/main/install.sh -o install.sh
less install.sh
bash install.sh
```

> 安装程序**不**安装 DSH 本身，仅安装管理器。然后你跑
> `dsh-manage install` 安装 `@deepseek-ai/dsh`。

### 手册

```bash
sudo cp dsh-manage.sh /usr/local/bin/dsh-manage
sudo chmod +x /usr/local/bin/dsh-manage
```

或者，直接从回购协议进行交易：`./dsh-manage.sh <comando>`。

## 配置

一切都有合理的默认值，并被环境变量覆盖：

### 变量·默认值·描述
- **变量**：`DSH_NODE` · **默认**：`$HOME/.local/dsh-node/node24/bin` · **描述**：节点/npm/dsh二进制文件的目录
- **变量**：`DSH_MANAGE_HOME` · **默认**：`$HOME/dsh-test` · **描述**：此脚本**的工作目录、日志和pid文件**
- **变量**：`DSH_HOME` · **默认**：`$HOME/.dsh` · **描述**：`dsh`二进制文件的真实配置（配置文件，`cordis.patch.yml`） - **不要与`DSH_MANAGE_HOME`混淆**
- **变量**：`DSH_PORT` · **默认**：`3080` · **描述**：DSH 监听的端口
- **变量**：`DSH_START_TIMEOUT` · **默认**：`180` · **描述**：等待端口的秒数
- **变量**：`DSH_ALLOW_SCRIPTS` · **默认**：本机 dsh 插件列表 · **描述**：npm 允许脚本的包
- **变量**：`DSH_PKG` · **默认**：`@deepseek-ai/dsh` · **描述**：要安装的 npm 包的名称
- **变量**：`DSH_NPM_CACHE` · **默认**：`$DSH_MANAGE_HOME/.npm-cache` · **描述**：用于版本查询的npm缓存
- **变量**：`DSH_NODE_VERSION` · **默认**：`v24.19.0` · **描述**：如果缺少则要下载的节点版本
- **变量**：`DSH_MANIFEST` · **默认**：脚本旁边的 `plugins/manifest.json` · **描述**：要安装的插件堆栈的清单
- **变量**：`DSH_PNPM_VERSION` · **默认**：`11.22.0` · **描述**：要通过 corepack 准备的 pnpm 版本
- **变量**：`DSH_SERVICE_USER` · **默认**：当前用户 · **描述**：运行 systemd 单元的用户

> ⚠️ **`DSH_HOME` 与 `DSH_MANAGE_HOME`**：它们是故意不同的变量。
> `DSH_HOME` 与内部使用 `dsh` 二进制文件来定位的相同
> `profiles/`； `plugins-install` 和`服务安装