#dsh-plugin-manager

一个独立的 DeepSeek Harness 插件，添加**设置 → 插件 → 管理插件**。

它可以：

- 启用或禁用活动 Web 配置文件中的可变条目，包括已发送的条目；
- 删除其自己的显式覆盖以将条目返回到组合配置文件默认值；
- 安装和热安装安全单入口 DSH 捆绑包，无需重新启动 DSH Web 进程；
- 将 `$DSH_HOME/profiles/web/cordis.patch.yml` 的其余部分逐字节保留在一个明确标记的托管块之外。

## 安全模型

所有状态和突变都使用在 `authority: loopback` 上注册的插件拥有的 Connection RPC 通道。服务器强制执行此边界；通过 LAN 或 Tailscale 主机名打开 Web UI 会显示只读访问消息，而不是公开生命周期或包操作。

管理器拒绝禁用自身或 Web 传输/UI/实时配置文件重新加载主干。它还拒绝活动 Web 配置文件树之外的不明确的重复补丁 ID 和条目。

热安装程序仅接受带有可选版本或 dist-tag 的 npm 注册表包名称。它解析具体的 pnpm 可执行文件（包括常见的直接可执行文件和节点入口点 Windows 垫片），通过 DSH 的公共子进程服务在没有 shell 的情况下生成它，依赖于该服务的凭据清理子环境，禁用包生命周期脚本，限制捕获的输出，并在取消或超时时执行有界进程树终止和验证。

> **运行时信任边界：** 禁用生命周期脚本不会对已安装的插件进行沙箱处理。成功安装后，会立即将该软件包加载到 DSH 主机中，并具有与 DSH 相同的用户权限。仅安装来自经过审查、值得信赖的发行商的精确版本。环回权限限制网络可达性，但不是主叫认证；本地同一用户进程、可变包管理器可执行文件、支持 SSRF 的浏览器内容以及忽略共享 DSH 锁的配置文件编写器仍保留在本地信任边界内。

## 热重载行为

现有的条目切换将保留到 Web 配置文件补丁中，然后通过公共 Loader `Entry.update()` API 立即应用，因此它们不依赖于文件系统观察程序的行为。 UI 在报告成功之前验证有效的 Loader 状态。删除管理器覆盖被报告为持久性操作，只是因为无法单独从管理层安全地推断出生成的组合默认值；在同一会话中删除覆盖时，首先设置所需的实时状态。

安装路径故意与 `dsh plugin add` 不同，其捆绑列表在进程启动时只读：

1. 在pnpm启动之前获取管理器事务锁并持久化非链接预写日志；
2. 拒绝配置文件中已存在的包——热版本更新需要官方 CLI 并重新启动，因为未更改的 Loader 行无法证明模块重新导入；
3. 将新的注册表包安装为**可选依赖项**，并禁用生命周期脚本，并在日志中记录 pnpm 准确保存的规范；
4. 验证其 `dsh.bundle.patch` 确实是一个独立的直接插入，没有受保护或冲突的 ID、保留的管理器标记或链接的补丁文件；
5. 在执行包代码之前将经过验证的插入持久保存在管理器拥有的配置文件补丁中，因此每个启动或挂起的条目都有一个重新启动持久的安全记录；
6. 通过公共内存中 Loader 组 API 创建它，并等待生命周期结算直至固定范围。活动条目报告立即成功；非结算条目保持可见的管理和待定状态，而不是无限期地阻止管理器 HMR 拆卸。

Public Loader 生命周期等待时间限制为 15 秒（以及失败时的有限清理尝试）；超时切换保留其请求的持久覆盖，而超时安装保留其托管补丁，因此不会跟踪正在执行的条目。管理器绝不会针对另一个 CLI 可能正在编辑的配置文件包文件运行破坏性的自动回滚。如果 pnpm 更改配置文件然后失败、取消到达、验证失败或补丁提交无法继续，则日志在 UI 中保持可见。仅当保存的依赖项规范仍然与记录的 pnpm 后状态匹配时，重试相同的规范才会前滚；任何不明确或外部更改的状态都会被拒绝，并且必须通过官方 CLI 解决。在旧插件生成退出之前，HMR 处理会中止并耗尽正在运行的包工作。

新安装的包的浏览器包实时进入主机图，但已经打开的页面无法通过 DSH 当前的公共 API 注册新的图行。刷新页面一次即可加载新的浏览器扩展 - 无需重新启动 DSH 进程。

复杂或多行的捆绑将被拒绝，而不是部分安装。通过官方 CLI 安装这些并在方便时重新启动 DSH Web。

## 安装

将预构建的 GitHub 版本 tarball 安装到 Web 配置文件中：

```powershell
dsh plugin --profile web add https://github.com/leonardoxr/dsh-plugin-manager/releases/download/v0.2.0/leonardoxr-dsh-plugin-manager-0.2.0.tgz
```

要从源代码构建相同的包：

```powershell
pnpm install
pnpm run check
pnpm pack
```

该软件包遵循官方 [DeepSeek Harness 插件和捆绑指南](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/)：它声明了一个函数形式插件、其公共服务依赖项、一个 `dsh.bundle` 补丁、一个用于 Git 安装的独立 `prepare` 构建以及显式生命周期清理。

还支持源安装，但 pnpm 10 需要明确的权限才能运行包的 `prepare` 构建。固定已审核的标签并按照 DSH/pnpm 打印的确切 `allowBuilds` 补救措施进行操作，然后重试：

```powershell
dsh plugin --profile web add github:leonardoxr/dsh-plugin-manager#v0.2.0
```

```yaml
# $DSH_HOME/profiles/web/pnpm-workspace.yaml
allowBuilds:
  '@leonardoxr/dsh-plugin-manager': true
```

预构建的发布 tarball 是首选，因为它不需要安装时构建权限。

管理器本身需要一次初始 DSH Web 重新启动，因为配置文件包添加是在启动范围内的。之后，普通切换和支持的全新直接安装使用公共内存中 Loader 生命周期 API 以及持久配置文件补丁；它们不需要重新启动另一个进程。

## 托管文件

生命周期覆盖和经过验证的直接安装补丁写入 `$DSH_HOME/profiles/web/cordis.patch.yml`。成功的软件包安装还会通过 pnpm 更新 Web 配置文件的 `package.json`、`pnpm-lock.yaml` 和 `node_modules`。

补丁更改使用乐观 SHA-256 修订版、`withFileLock`、`writeFileAtomic` 以及锁定获取之后和提交之前的取消检查。管理器标记块之外的现有注释和用户创作的行将被保留。包事务在 pnpm 和补丁提交之间持有管理器生成锁，并使用持久的前滚日志，而不是整个文件快照或不安全的比较后删除回滚。

## 发展

```powershell
pnpm run typecheck
pnpm run build
pnpm run test
pnpm run pack:check
```