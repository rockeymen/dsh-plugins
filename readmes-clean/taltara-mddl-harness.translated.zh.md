# mddl 线束

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的视觉编排器。将模型和工具拖到画布上，然后导出真实的 `cordis.patch.yml` 叠加层。

这**不是** `dsh` 的分支，**不是** `npx @deepseek-ai/dsh` 的子进程包装器。 Upstream 已经发布了网络配置文件、Cordis 补丁和 `session/event` 遥测。我们将图表编译为叠加格式，以便稍后可以将作品安装为 `dsh-plugin`。

![工作室：Bash、DeepSeek V4 Flash、Web 搜索和文件系统连接到代理循环中，检查器显示代理默认模型行](docs/studio.png)

将模型和工具拖到画布上，将它们连接到代理循环中，然后导出
覆盖层。 `pnpm dev` 打开于 <http://localhost:5173>.

## 为什么这个堆栈

### PDF 计划·我们实际做什么
- **PDF 计划**：Next.js App Router · **我们实际做的事情**：Vite + React SPA。 DSH服务静态距离； RSC 是自重。
- **PDF 计划**：虚构的 `dsh.yaml` · **我们实际做的**：`cordis.patch.yml`（`id` 替换 + `insert`）
- **PDF 计划**：通过 Socket.io 生成 `dsh run` · **我们实际上做了什么**：稍后：Cordis 插件监听 `session/event` / `agent/*`
- **PDF计划**：扩展节点内的配置· **我们实际做的**：哑节点+检查器（保持XYFlow在60fps）
- **PDF 计划**：节点内的 xterm.js · **我们实际做的事情**：仅限停靠预览。终端属于后来的主机插件。

## 套餐

- `@mddl/graph-schema` — 图表 IR 和发货的 DSH 行目录
- `@mddl/compiler` — 图 → Cordis 补丁 YAML，加上覆盖 linting
- `@mddl/studio` — 可视化编辑器
- `dsh-blueprint` — DSH Web 客户端内的 **Blueprint** 选项卡（[readme](packages/blueprint/README.md)）
- `dsh-overlay-check` — 对于写入配置的任何内容，自行进行覆盖安全检查，无依赖性（[readme](packages/overlay-check/README.md)）

## 运行

```sh
pnpm install
pnpm dev
```

工作室：`http://localhost:5173`

```sh
pnpm lint       # biome check
pnpm format     # biome check --write
pnpm test
pnpm typecheck
```

CI 在每次推送时运行 lint、类型检查、测试和构建。

当您编辑时，画布会保存到 `localStorage`，因此重新加载会保留您的图表。
标题中的 **重置** 可恢复起始图。

按名称、行 ID、包或描述在选项板中查找模块。新闻
`/` 跳转到搜索，**不在画布上**隐藏您已经放置的内容。

应用导出的叠加层。 `--patch` 是从您的**终端 cwd** 解析的，而不是工作室。从 `~` 运行 `./cordis.patch.yml` 会查找 `/Users/<you>/cordis.patch.yml`。

**导出**后（典型的 macOS 下载）：

```sh
npx @deepseek-ai/dsh web --patch "$HOME/Downloads/cordis.patch.yml"
```

或者使用此存储库中的启动器覆盖（来自存储库根目录）：

```sh
npx @deepseek-ai/dsh web --patch "$PWD/examples/cordis.patch.yml"
```

## 第一阶段不做什么

实时线束执行、配置文件安装或 DSH 客户端插槽。 “预览遥测”是证明发光/边缘路径的本地动画。实际运行状态来自后期的`session/event`。

## 能力披露

在写入覆盖行之前，预检会报告每个插入的内容
包声明它可以使用 [capmark](https://github.com/taltara/capmark)
如果包裹运送的话，请注明：

```
warning  capability-high-risk  "build-helper" declares fs:read, proc:spawn.
                               proc:spawn hands over broad control — read its
                               manifest before applying.
```

这是运行时门无法做出的唯一决定。插件的 `apply()` 运行
在加载行时，在任何工具之前，处于进程内，具有完整的节点权限
调用存在，因此写入是最后一点，安装它仍然是一个
选择。它报告并且从不阻止：今天几乎没有插件带有清单，
拒绝他们将使支票对真实的个人资料毫无用处。

`dsh-overlay-check` 保持无依赖性；这住在`dsh-blueprint`。

## 路线图

在 `dsh-blueprint` 0.5.0 中发布：读取实时加载器树，检查
您实际启动的配置，在标记分隔后面写入覆盖层
块，拒绝写入会停止线束启动的行，快照
通过一键恢复，将运行配置导入到画布上，以及
编译为代理预设，以便画布更改会话实际获取的内容。
接下来，按顺序：

1. 将 `session/event` 映射到画布遥测上，替换本地动画。
2.英语和中文都是一流的。
3. 对附带的 DeepSeek 适配器之外的行进行建模。

## 如果线束无法启动

命名配置文件无法加载的包的行会停止线束启动
彻底地，而不是禁用一个条目。 `dsh-blueprint`拒绝写一个，
但如果您通过其他路线到达那里，有两件事会有所帮助：

- `dsh --profile <name> --dump-default-config` 在跳过时读取捆绑包
  配置文件和家庭用户层，因此当覆盖层为
  问题。在 rc.7 上确认：一行写入配置文件的 `cordis.patch.yml`
  在 `--dump-config` 中显示，在 `--dump-default-config` 中不存在。
- [DSH 手册的恢复操作手册](https://sandbaseai.github.io/deepseek-harness-handbook/invalid-overlay-boot-failure.html)
  由sandbaseai 人员撰写的关于从
  这包括哪个用户层拥有哪个文件。

＃＃ 地位

早期的。 DSH 本身就是一个开发者预览版，在发布之间有重大变化
候选者，因此这里的行 ID 和补丁形状跟踪移动目标。已验证
对抗 `@deepseek-ai/dsh` `0.1.0-rc.7` 和 `0.1.1-rc.2`。

`0.1.1-rc.2` 无法解决的一件事是：在覆盖层中设置的 `agent-presets.roots` 是
在启动时替换为附带的根目录，并且 `--dump-config` 仍然打印您的
值，因为覆盖是在打印合成之后应用的。参见
[deepseek-harness#403](https://github.com/deepseek-ai/deepseek-harness/discussions/403)。
`dsh-overlay-check` 对其发出警告，而不是让覆盖层声明它
默默地。