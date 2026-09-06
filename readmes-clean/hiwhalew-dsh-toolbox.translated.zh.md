![DSH 总机显示本地配置文件运行状况检查、待处理的捆绑包计划、捆绑包库存和最近的活动](docs/assets/dsh-switchboard-gui.png)

# DSH 工具箱

  DeepSeek Harness 的本地优先工具箱。
  产品研究、上下文切换、插件预检和兼容性监控都集中在一个以安全为中心的可视化控制面板中。

  ·
  ·

> [!注意]
> 在线版本是一个安全的演示：运行状况检查、捆绑切换、更改计划、活动和回滚在当前浏览器的内存中进行模拟，并在刷新时重置。它永远不会连接到访问者的计算机或读取 DSH 配置文件、API 凭据或 SQLite 数据。安装本地版本以连接到真实的 DSH 工作流程。

> [!重要]
> **实验性 MVP · 仅限非商业用途。** DeepSeek Harness 仍处于开发者预览版中，升级可能会影响 Profile Bundle 兼容性。该项目是独立开发的，不隶属于 DeepSeek，也不受 DeepSeek 认可。

## DSH 工具箱是什么？

DSH Toolbox 是 DeepSeek Harness 的配套产品，适用于个人、本地优先的工作流程。四个插件作为本机 DSH 配置文件包运行。 DSH Switchboard 在活动 Harness 进程之外运行，以检查配置文件、运行运行状况检查、预览捆绑包更改、创建备份以及安全回滚更改。

默认情况下，没有帐户、托管后端、行为分析、遥测、后台注册表检查或自动升级。真实的运行时数据保留在本地 SQLite 中。配置文件更改总是从计划开始，在写入之前需要用户确认，并留下可审计的交易记录。

## 五个组成部分

### 组件·日常使用·工具
- **组件**：[`@dsh-toolbox/product-research-workbench`](packages/product-research-workbench) · **日常使用**：导入 URL 或文本证据、组织调查结果、评估机会、备份项目以及生成 Markdown/HTML 报告。 · **工具**：12
- **组件**：[`@dsh-toolbox/context-switchboard`](packages/context-switchboard) · **日常使用**：将任务路由到有界上下文中，激活本机运行时上下文，并支持回滚。 · **工具**：10
- **组件**：[`@dsh-toolbox/plugin-preflight`](packages/plugin-preflight) · **日常使用**：在安装之前检查本地捆绑包的包语义、功能、策略、SBOM 数据和指纹。 · **工具**：2
- **组件**：[`@dsh-toolbox/compatibility-radar`](packages/compatibility-radar) · **日常使用**：发现捆绑包，将它们与目标运行时进行比较，保存并比较快照，并生成升级报告。 · **工具**：7
- **组件**：[`@dsh-toolbox/dsh-switchboard`](packages/dsh-switchboard) · **日常使用**：发现 DSH 配置文件、检查捆绑包、计划和验证更改、创建备份和报告以及安全回滚。 · **工具**：CLI/控制平面

前四个组件是可独立安装的 DSH 配置文件包。五是本地统一控制平面。 Product Research Workbench 和相关报告支持 Markdown 和 HTML 输出，而运行时数据默认存储在 SQLite 中。

## 在线演示与本地安装

### 功能 · 在线演示 · 本地安装
- **功能**：探索四个视图和固定活动侧边栏 · **在线演示**：可用 · **本地安装**：可用
- **功能**：切换配置文件、过滤活动和审查捆绑计划 · **在线演示**：在浏览器内存中模拟 · **本地安装**：连接到真实的本地数据
- **能力**：运行`dsh --dump-config`健康检查 · **在线演示**：模拟成功结果 · **本地安装**：真实命令执行
- **功能**：写入配置文件、创建备份、回滚并生成报告 · **在线演示**：无写入；刷新时重置 · **本地安装**：计划确认后真正执行
- **功能**：数据目的地 · **在线演示**：当前浏览器内存 · **本地安装**：用户计算机上的 SQLite 和私有目录

## 要求

- Node.js `^22.19.0 || >=24.0.0`（`node:sqlite` 是内置的）
- npm，用于打包本地包
- `@deepseek-ai/dsh@0.1.1-rc.2`
- 允许您修改的本地 DSH 配置文件

只读交换机检查无需 `PATH` 上的 DSH CLI 即可进行。默认情况下，应用或回滚更改需要 CLI，因为成功的 `dsh --profile <name> --dump-config` 是运行时安全门。

测试的运行时组合是：

### 组件·测试版本
- **组件**：DeepSeek Harness · **测试版本**：`0.1.1-rc.2`
- **组件**：DSH 工具 · **测试版本**：`0.1.1-rc.2`
- **组件**：Cordis · **测试版本**：`4.0.1`
- **组件**：Node.js · **测试版本**：`24.x` 和声明的 `22.19+` 范围

CI 在 Ubuntu 上使用 Node.js `22.19.0` 和 `24.x` 运行完整的检查和打包试运行矩阵。单独的 `windows-latest` 作业验证 Switchboard 是否可以检测并执行 npm 安装的 `dsh.cmd` 垫片，而无需启用 shell 执行。

如果固定的 DSH CLI 尚不可用，请安装它：

```sh
npm install --global @deepseek-ai/dsh@0.1.1-rc.2
dsh --version
```

## 五分钟安装

克隆源代码，创建四个 npm tarball，并将它们安装到一个 DSH 配置文件中：

```sh
git clone https://github.com/HiWhaleW/dsh-toolbox.git
cd dsh-toolbox

mkdir -p dist
npm pack --workspace @dsh-toolbox/product-research-workbench --pack-destination dist
npm pack --workspace @dsh-toolbox/context-switchboard --pack-destination dist
npm pack --workspace @dsh-toolbox/plugin-preflight --pack-destination dist
npm pack --workspace @dsh-toolbox/compatibility-radar --pack-destination dist

dsh plugin --profile toolbox add ./dist/dsh-toolbox-product-research-workbench-0.2.1.tgz
dsh plugin --profile toolbox add ./dist/dsh-toolbox-context-switchboard-0.2.1.tgz
dsh plugin --profile toolbox add ./dist/dsh-toolbox-plugin-preflight-0.2.1.tgz
dsh plugin --profile toolbox add ./dist/dsh-toolbox-compatibility-radar-0.2.1.tgz

dsh --profile toolbox --dump-config
```

最终命令应显示所有四个捆绑层。使用相同的配置文件启动 DSH：

```sh
dsh --profile toolbox
```

您可以只安装您需要的 tarball。打包不执行插件代码，也不需要安装存储库依赖项。在存储库根目录中的 `npm install` 之后也可以直接签出路径安装，但 tarball 与 npm 打包语义匹配，并且是经过验证的可移植流程。

每个包都固定可靠的树外安装所需的小型 DSH 工具定义运行时。没有安装生命周期脚本。

### 打开DSH总机GUI

DSH总机是DeepSeek Harness的本地设置应用程序。它显示安装了哪些配置文件和配置文件包，检查配置文件是否可以启动，预览每个更改，并保留备份以便可以安全地回滚更改。

导航在中心面板中打开四个工作视图：

- **DSH 配置文件** — 检查配置文件，运行其 DSH 运行状况检查，检查已安装的捆绑包，并计划启用/禁用更改。
- **插件** — 查看捆绑包清单及其兼容性状态。
- **活动** — 检查本地计划、验证、应用的更改和回滚。
- **设置** — 查看检测到的 DSH 运行时和本地数据位置。

当您在视图之间移动时，最近的活动在右侧仍然可见。长列表在自己的面板内滚动，因此整个应用程序框架保持固定和可读。

本地备份对话框还具有明确的“立即备份”操作。这些手动配置文件快照可以稍后恢复；在恢复快照之前，Switchboard 首先将当前配置文件保存为新的恢复点，然后恢复选定的快照并运行 DSH 配置验证。如果验证失败，它会尝试自动返回到该恢复点。

从存储库签出：

```sh
pnpm install --frozen-lockfile
pnpm switchboard:gui
```

然后打开`http://127.0.0.1:4173/`。服务器仅侦听本地计算机。它从 `$DSH_HOME/profiles` 读取配置文件，从不显示 API 凭证值，并且在写入配置文件文件之前需要执行审查步骤。

### 从命令行使用DSH总机

Switchboard 目前是源分布式技术预览版，不是任何 DSH 配置文件的 npm 依赖项。从结账处运行它：

```sh
npm run switchboard -- detect
npm run switchboard -- profiles
npm run switchboard -- inspect toolbox
npm run switchboard -- health toolbox
npm run switchboard -- backup toolbox
```

`backup` 命令立即将当前配置文件的可恢复快照保存在 Switchboard 的私有本地数据目录中。恢复手动快照首先创建一个新的恢复点，并使用 DSH 验证恢复的配置文件。

突变命令是计划优先的，除非存在 `--apply`，否则不会进行更改：

````嘘
npm run switchboard -- 捆绑禁用工具箱 @dsh-toolbox/context-switchboard
npm run switchboard -- 捆绑禁用工具箱 @dsh-toolbox/context-switch