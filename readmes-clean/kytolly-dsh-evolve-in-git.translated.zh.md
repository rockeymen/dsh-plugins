#dsh-evolve-in-git

适用于 DeepSeek Harness 的 Git 支持的长期记忆和进化插件。

## 它的作用

该插件将用户选择或预先配置的 Git 存储库视为内存存储。
它可以将会话注释、特定于分支的记录和可重用的技能草稿写入该存储库，然后将它们作为普通的 Git 历史记录提交。

## 安装

```sh
# example: install into the web profile
 dsh plugin --profile web add github:Kytolly/dsh-evolve-in-git
```

该捆绑包使用插件默认值插入一行 `dsh-evolve-in-git`。
后续的配置文件补丁可以覆盖 `repoPath`、`repoUrl`、`auth` 和存储根。

## 配置

- `repoPath` - 存储内存和技能的本地 Git 签出。默认为 `~/.dsh-evolve-in-git/remote-memory`。
- `repoUrl` - 远程内存存储库。默认为 `https://github.com/Kytolly/dsh-remote-memory.git`。
- `auth` - 用于私人访问的 Git 身份验证设置。默认配置文件是 SSH 优先且支持令牌。
- `memoryRoot` - 写入内存记录的位置，默认`.dsh-evolve/memory`。
- `skillsRoot` - 编写技能草稿的地方，默认`.dsh-evolve/skills`。
- `defaultBranch` - 创建新分支时演化的分支，默认 `main`。
- `remoteName` - 远程获取和推送，默认 `origin`。
- `autoCommit` - 是否写入自动提交，默认`true`。

### 授权

- `auth.mode: "ssh"` - 使用 `ssh` 或定制 `sshCommand`。
- `auth.mode: "token"` - 使用 `token` 或来自 `tokenEnv` 的令牌和 GitHub 样式的 `Authorization` 标头。

## 线束入口点 (`v0.1.2`)

该插件针对当前 Harness `0.1.0-rc.8` 主机合约的命令，
工具、系统提示符和不变量。将其安装到配置文件中，然后重新启动
该配置文件因此组成了束层。

工具：

- `evolve_connect`
- `evolve_status`
- `evolve_remember`
- `evolve_branches`
- `evolve_help`

人类命令：

- `/evolve connect`
- `/evolve status`
- `/evolve branches`
- `/evolve remember <kind> <title> :: <content>`
- `/evolve help`

安装后，在启动长期配置文件之前验证组成：

```sh
dsh --profile web --dump-config
dsh --profile web
```

第一个命令应显示插件包中的 `evolve-git` 行。的
第二个命令启动配置文件；加载后，模型会看到五个
`evolve_*` 工具和 UI 命令注册表公开了 `/evolve`。

## 当前切片

`v0.1.2` 使该插件可以直接从 Harness 中使用。
它添加了第一个工具和命令界面，但仍然为以后的版本留下了技能提升策略、安全回滚、同步提醒和时间线视图。

## 限制

- 还没有自动提示注入。
- 还没有合并/冲突解决程序。
- 尚未同步到 DSH 技能注册表。
- 尚无分支切换、差异或恢复命令界面。