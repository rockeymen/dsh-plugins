#dsh-workspace-scope-selection

DeepSeek Harness 会话的第四个权限选项：**已选择
工作区写入**。内置选项是严格的——会话只能写入
在其工作空间内 (`workspace-write`) 或任何地方 (`danger-full-access`)。
该插件添加了一个中间立场：选择选项，打开工作区
目录树，并准确切换代理可以写入的目录，
除了工作区本身。

## 你得到什么

- 作曲家许可芯片和 `/permission` 弹出窗口获得第四名
  选项，**选定的工作空间写入**。
- 选择访问芯片中的选项可直接打开范围编辑器**
  — 没有中间栏或通知。
- 当会话在选项下运行时，会出现一个小的 **编辑范围** 按钮
  位于作曲家中的访问芯片旁边并打开相同的
  编辑。
- 编辑器遍历目录树（面包屑导航到文件系统
  root，因此您还可以授予工作区之外的目录）并切换
  包括哪些目录。检查目录——以及所有内容
  在它们下面 - 可由代理写入。工作区本身是
  始终可写。
- 选择是持久会话状态：它在重新启动后仍然存在（重播
  来自会话日志（如 `sandbox/mode`），与会话保持一致，并且是
  由文件系统工具和 shell/终端沙箱强制执行。

## 它是如何工作的

线束核心知道三种沙箱模式并通过自己的方式强制执行它们
词汇（`SandboxMode`、`writableRoots`、fs fence、bash 提供程序）。
该插件在运行时扩展了该词汇表，而无需触及
安装的软件包：

### Piece · 插件的作用
- **Piece**：模式 · **插件的作用**：添加 `selected-workspace-write` 作为会话切换，由现有的仅记录 `sandbox/mode` 事件携带。
- **Piece**：预设 · **插件的作用**：在 `ctx.permissionPresets.presets` (`sandbox: selected-workspace-write` + `approval: ask`) 中注册选项，因此作曲家芯片、`/permission` 弹出窗口和 `/permission` 命令都提供并显示它 - `permissions` 投影从预设表中派生选项。
- **Piece**：选择状态 · **插件的作用**：一个仅记录 `workspace-scope/selection` 事件，携带整个根数组（最后一个获胜），在恢复时折回； `workspace-scope` 会话投影将其推送​​到浏览器。
- **Piece**：策略解析 · **插件的作用**：当解析的模式是新模式时，修补 `ctx.sandboxPolicy.resolve()` 以附加 `extraWritableRoots`；修补 `sandbox:policy` 提示贡献，以便模型看到新模式的文本（核心渲染器抛出未知模式）。
- **Piece**：文件系统强制执行 · **插件的作用**：修补 `ctx.fs.checkedTarget`（进程内栅栏）以包含工作区/临时根 **加上** 选定根下的写入，具有相同的结构化 `FS_SANDBOX_DENIED` 拒绝和相同的升级提示。
- **Piece**：流程执行 · **插件的作用**：修补 `ctx.sandbox.confine`（单一提供程序 bash、持久终端和 pwsh 全部环绕）：新模式被转换为 `workspace-write` 以获得基础工作空间/临时授权，然后将额外的根拼接到所选运行程序的方言中 — bwrap `--bind` 对、Landlock `--rw` 授权，安全带`(subpath …)`形式。
- **片**：升级· **插件的作用**：加宽阶梯（`WIDER_MODES`）：在新模式下，被拒绝的操作仍然可以通过普通审批流程升级到`danger-full-access`。
- **Piece**：写入路径 · **插件的作用**：`/workspace-scope` 命令 (`set` / `clear` / `info` / `list`) 验证、规范化、重复数据删除和限制根（最多 128），并用作主机端目录列表后备。

### 执法范围

- **文件系统工具**（`write` / `edit`）：工作区下的完全遏制+
  选定的根部+平台温度区域。
- **Bash 一次性命令和后台作业**（Linux 上的 bwrap / Landlock，
  macOS 上的安全带）：工作区 + 选定的根目录可写，其他所有内容
  只读。
- **持久终端**：与 bash 相同的受限 argv 路径。
- **Windows（ACL 运行程序）和自定义 `runnerCommand` 部署**：
  工作区和临时区域保持可写；额外选择的根被**拒绝**
  （失败关闭）— 选项降级为 `workspace-write`。
- **危险完全访问升级**在新模式下仍然有效。

## 安装

从本地结帐，使用 **`file:` 协议** - 这很重要：

```sh
dsh plugin --profile web add file:/path/to/dsh-workspace-scope-selection
```

该插件导入harness自己的包（`@deepseek-ai/dsh-fs`，
`@deepseek-ai/dsh-sandbox`），通过共享解决
`$DSH_HOME/profiles/node_modules` 后备 — 并且该后备仅有效
当插件的模块位于配置文件树*内部*时。搭配`file:`
协议，pnpm 的提升链接器将包具体化为真实目录
（硬链接到您的结帐，因此编辑仍然会传播）在个人资料的内部
`node_modules`，所以进口解决。裸机`dsh plugin add /path`（无
`file:`) 记录了一个 `link:` 依赖项——一个指向回的符号链接
您的结帐 - 然后 Node 解析来自结帐实际的导入
位置，启动时失败并显示 `ERR_MODULE_NOT_FOUND`。如果你已经
就这样安装了，修复：

```sh
dsh plugin --profile web remove dsh-workspace-scope-selection
dsh plugin --profile web add file:/path/to/dsh-workspace-scope-selection
```

然后**重新启动Web服务器**（停止`dsh web`进程并运行`dsh web`
再次），因此加载程序会选择新的插件行和客户端捆绑包。

## 用法

1. 打开一个对话，点击composer中的权限芯片（或运行
   `/permission`），然后选择**选定的工作区写入**。
2. 范围编辑器立即打开。遍历目录树——树
   从会话的工作区开始，面包屑可让您导航
   直到任何父级，因此可以授予工作区之外的目录
   也是。
3. 检查代理可能写入的目录。取消选中目录
   将其从选择中删除；仅被“覆盖”的目录
   选中的祖先显示“通过父级”标记 - 取消选中祖先
   删除整个子树。
4. **完成**。代理对选定目录的下一次写入成功，无需
   批准；工作区之外的任何内容和选择仍然需要
   批准门控升级，与 `workspace-write` 完全相同。
5. 稍后，使用旁边的 **编辑范围** 按钮重新打开编辑器
   访问作曲家中的芯片。

每个会话都会保留该选择。切换会话
选择的工作区写入会保留存储的选择，因此返回到
选项恢复它。

## 卸载

```sh
dsh plugin --profile web remove dsh-workspace-scope-selection
```

并重新启动`dsh web`。已经切换到该模式的会话停止
获得额外的根（事件保留在日志中，但没有任何内容折叠）
他们不再是了）。

## 限制和注释

- **安装 `dsh-invariants` 的部署**：附带的配置文件不
  编写不变的注册表，因此扩展模式可以自由通过。一个
  显式安装它的部署必须将沙箱策略列入黑名单
  同伴（`invariants.package_blocklist: ['^@deepseek-ai/dsh-sandbox-policy$']`），
  因为核心同伴根据封闭的验证 `sandbox/mode`
  三模词汇。
- **常规设置权限行**（*新*会话的默认设置）是
  模式绑定并仍然列出三个内置选项；新选项是
  通过 Composer 芯片、`/permission` 弹出窗口进行每个会话切换，或者
  `/permission selected-workspace-write`。
- **根是一个包含列表，而不是拒绝列表**：你不能表达“一切
  除了这个子目录”。取消选中父级将删除其整个子树。
- **符号链接**在选择根和目标时解析
  检查，因此授予的路径是规范的（与核心围栏相同的策略）。
- **Windows** 目前仅授予此模式的工作区 + 临时区域
  （ACL 运行者实现一项工作空间授予；额外的根被拒绝）。
- 该插件在加载时修补服务实例并在卸载时恢复它们；
  这个插件的 HMR 会干净地重新加载。

## 发展

主机逻辑被分成一个无依赖性模块（`lib/core.js`），因此
单元测试在没有线束模块图的情况下运行：

```sh
node --test test/core.test.mjs
```

`lib/client.js` 是一个手写的模块加载程序包（无构建步骤），
遵循与 `dsh-in-convo-mode-change` / `dsh-rewind` 相同的模式。它
仅需要 `react` 和 `react-dom`（均为壳静力学）。编辑是
传送至 `document.body`，因为作曲家座椅粘在其内部
自己的堆叠上下文 - 就地固定覆盖层将被剪切或掩埋。