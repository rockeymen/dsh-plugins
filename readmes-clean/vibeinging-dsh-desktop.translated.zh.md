# DSH Desktop

  以官方 DSH Web 为核心的插件化桌面工作台。
  精选社区 Bundle、离线 Profile、Git Worktree、文件附件与受控原生能力，组合在一个 Electron 应用中。

  ![DSH Desktop 中通过官方 Profile 加载的社区任务看板](docs/images/readme/dsh-community-task-board.png)

DSH Desktop 是社区维护的 Electron 发行版。它固定并运行官方 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) npm 运行时，把 `dsh-web-app`、Session、Agent、Tool、Skill、MCP 与 Profile Bundle 组成可直接运行的本地桌面环境。项目不修改 DSH 源码，不另存一套插件状态，也不用私有 Chat 替换官方 Web。

这个仓库做的是“桌面发行层”：从社区中选择值得默认安装的 Bundle，固定它们的来源、版本、依赖、权限和许可，然后在真实 Profile 与 Electron 中验证安装、停用、卸载、重启和恢复。用户得到的不是一堆手工配置，而是一个可组合、可移除、可复现的 DSH 工作台。

## 我们坚持的桌面路线

### 原则 · 产品承诺 · 直接收益
- **原则**: 官方 Web 是唯一主界面 · **产品承诺**: 主窗口直接加载官方 Client 图，桌面能力也以 `dshClient` Bundle 加入 · **直接收益**: 跟随 DSH 会话、设置与 Slot 演进，不等第二套界面重写
- **原则**: Profile 是插件状态的唯一权威 · **产品承诺**: 市场、设置和 CLI 读写同一个 Profile；更新不补回用户已卸载的 Bundle · **直接收益**: 不会出现“页面说已安装，DSH 实际没加载”的双状态
- **原则**: 社区实现优先 · **产品承诺**: 任务看板、插件市场和附件输入直接采用独立社区 Bundle · **直接收益**: 社区插件可同时服务官方 Web 与桌面发行版，不被锁在本项目里
- **原则**: 默认组合可复现 · **产品承诺**: 新 Profile 从固定 tarball、SHA-256 和随包 pnpm 离线原子初始化 · **直接收益**: 无需临时从 npm 拼装默认环境，安装失败不会留下半个 Profile
- **原则**: 原生能力按最小权限开放 · **产品承诺**: 窗口、文件、Browser Workspace 和更新只通过 Session 绑定的方法白名单暴露 · **直接收益**: 第三方 Client 不能直接获取 Electron、Node 或通用 IPC
- **原则**: 失败必须可诊断、可恢复 · **产品承诺**: Profile 或 Client 启动失败时进入本地恢复页，保留原 Profile · **直接收益**: 不用白屏、无限重启或静默改配置掩盖问题

这套路线适合想使用官方 DSH Web，同时需要社区插件、桌面原生能力、可控默认组合和清晰权限边界的用户与插件作者。

## 主要能力



      ### 官方 DSH Web 桌面化
      Electron 启动本地 DSH Web Profile，并管理窗口、服务启动、退出和恢复。主窗口直接加载官方 Client 图，不使用旧 Renderer 或产品 preload。


      ### 默认插件市场
      `dshmarket@1.17.1` 挂在官方设置 Slot 内，提供发现、兼容性诊断、安装、更新和卸载。市场、设置页和命令行读写同一个 Profile。




      ### 任务、附件与社区能力
      社区 task-board 提供五列任务看板，附件 Bundle 在官方输入 Slot 中增加文件和文件夹选择，dshmarket 负责发现更多标准 Bundle。


      ### 工作区与产出工具
      Git Worktree、Project、Conversation、Canvas/Site、Structured UI、Office 和模型继承分属独立 Bundle。用户可按需移除，插件作者也可复用其中的 portable 能力。




      ### 窄原生 Host
      窗口、文件授权、Browser Workspace 和更新能力只通过方法白名单与 Session 绑定开放。第三方 Client 不能取得 Electron、Node 或通用 IPC。


      ### 离线初始化与失败恢复
      新 Profile 使用固定产物和随包 pnpm 原子初始化；已有 Profile 在更新时不被重写。启动失败进入恢复页，而不是显示白屏或静默补回用户已卸载的插件。



## 运行方式

```mermaid
flowchart LR
  A[Electron 桌面壳] --> B[官方 DSH 运行时]
  B --> C[web Profile]
  C --> D[官方 dsh-web-app]
  C --> E[社区与 portable Bundles]
  C --> F[desktop-adapter Bundles]
  F --> G[窄 Native Host]
  G --> H[macOS / Windows]
```

官方 DSH 运行时负责 Agent、Session、Tool、Skill、MCP、Profile 和 Web UI。社区与 portable Bundle 只使用公开 DSH 服务，因此可安装到兼容的官方 Web Profile。`desktop-adapter` Bundle 才能调用桌面 Host，而且只能使用已声明、按 Session 绑定的有限方法。

这个分层使“在官方 Web 中可用”和“在 DSH Desktop 中可用”不再是两套插件体系：普通 UI、Tool 和工作流优先保持 portable，只有文件对话框、窗口或内置浏览器等操作系统能力需要桌面适配。

## 当前界面

### 官方会话、问题与审批

![官方 DSH Web 会话](docs/images/readme/dsh-official-web-session-loopback.png)

会话、问题卡片、工具审批、消息排队和历史回放都留在官方 Session 中。截图使用真实 DeepSeek-V4-Flash 对话；密钥只注入当次临时进程，不写入 Profile 或截图。

### 官方设置中的插件市场

![官方 Web 设置中的默认插件市场](docs/images/readme/dsh-plugin-market.png)

在“设置 → 插件市场”中可以搜索、查看兼容性与权限，并对当前 Profile 执行安装、更新和卸载。市场是普通 Client Bundle，不替换官方设置容器。

### 官方 Workspace 中的 Git Worktree

![官方 Web 中的 Git Worktree Bundle](docs/images/readme/dsh-worktree-official-web.png)

Git Worktree Bundle 从当前 Session 的 `cwd` 识别主检出，在侧边栏和工作区中管理隔离 worktree，并为新工作区创建官方 Session。它只使用 DSH Workspace 与 Slot，可作为独立 portable Bundle 安装或移除。

## 开始使用

从 [GitHub Releases](https://github.com/vibeinging/dsh-desktop/releases/latest) 下载 macOS Apple Silicon 安装包。该版本使用 Developer ID 签名并完成 Apple 公证，已经包含官方 DSH npm 运行时和默认 Bundle，不需要另外安装或修改 DSH 源码。Windows x64 安装包仍在完成真实打包验收，本次版本暂不提供。

### 下载桌面版

- macOS Apple Silicon：下载 `.dmg`，打开后将 `DSH Desktop` 拖入“应用程序”；
- Windows x64、macOS Intel 和其他平台：当前没有正式安装包，可以从源码运行。

### 从源码运行

需要 Node.js 24 或更高版本：

```bash
git clone https://github.com/vibeinging/dsh-desktop.git
cd dsh-desktop
npm install
npm run doctor
npm run dev:electron
```

### 构建 macOS Apple Silicon App

```bash
npm run package:mac:dir
open "release/mac-arm64/DSH Desktop.app"
```

该命令生成本地未签名 App，只用于开发。面向用户的安装包以 GitHub Release 页面为准。

## 插件生态

DSH Profile 是插件状态的唯一权威。新 Profile 通过官方 `dsh plugin --profile web` 原子安装默认 Bundle；已有 Profile 在应用更新时保持只读，不会补回、删除或重写用户选择。用户停用或卸载的 Bundle 在重启和升级后仍保持停用或卸载。

普通用户可以直接打开“设置 → 插件市场”。命令行使用同一套 Profile：

```bash
dsh plugin --profile web add -w @<exact-version> --save-exact --ignore-scripts
dsh plugin --profile web remove
```

新 Profile 默认安装固定的 `dshmarket@1.17.1`。发行包携带经过审查的固定 tarball、完整运行依赖闭包和 SHA-256；默认初始化不需要 npm 网络，也不执行上游生命周期脚本。浏览市场会访问社区目录，安装与更新可能访问 npm 或 GitHub；WebDAV 和 Gist 只有用户主动配置后才会使用。市场内展示的插件并不等于已经内置或通过发行审查。

新 Profile 也默认安装 `dsh-multimedia-webui-input@0.1.0`。它通过官方 `conversation.input.left`、`conversation.input.dock`、`conversation.input.overlay` 和 `settings.section` Slot 增加文件/文件夹选择按钮；文件只在发送时复制到当前 Session 工作区。官方 DSH 继续负责图片粘贴和拖拽，内置版去掉上游通用拖拽监听，防止图片被两条通道重复接收。它不修改官方 Chat，也不取得 Electron 或通用 IPC。与其他附件输入插件同时启用可能出现重复按钮或重复上传，默认 Profile 只保留这一套附件入口。

桌面侧的 `@vibeinging/dsh-desktop-profile-host` 只提供 `desktopProfiles` 和 `desktopPnpm` 两个公开结构服务。市场把用户确认的操作交给随包 pnpm 和官方 DSH CLI；它不能自行取得 Electron 权限或重启应用。

### 插件信任级别

### 级别 · 用户体验 · 发行版责任
- **级别**: 市场可发现 · **用户体验**: 用户在市场中查看并主动安装 · **发行版责任**: 市场展示不等于本发行版审查、内置或背书
- **级别**: 已记录候选 · **用户体验**: 目录会显示兼容性、权限、冲突和已知阻塞 · **发行版责任**: 固定上游来源和审查结论，但不进入默认 Profile
- **级别**: 随包但可选 · **用户体验**: 无网络也能从本地固定产物安装 · **发行版责任**: 保留许可证、哈希、依赖和安装/卸载证据
- **级别**: 随包且默认 · **用户体验**: 新 Profile 原子安装，用户仍可停用或卸载 · **发行版责任**: 在当前 DSH、源码 Profile、打包 Electron、断网启动和卸载恢复中逐项验证

这个分级把“社区里存在”、“可以自行安装”和“适合作为发行默认值”分开。新增默认 Bundle 不会被应用更新静默补到旧 Profile，已有用户始终保留自己的组合。

查看新 Profile 默认安装的 13 个 Bundle

### 默认 Bundle · 类型 · 声明权限 · 官方管理方式 · 来源
- **默认 Bundle**: `@vibeinging/dsh-work-product-host-ipc` · **类型**: desktop-adapter · **声明权限**: dsh-work-parent-ipc、browser-workspace-host、file-dialog-host、window-host · **官方管理方式**: 桌面基础服务，不提供卸载 · **来源**: [本地包](packages/dsh-work-product-host-ipc)
- **默认 Bundle**: `@vibeinging/dsh-desktop-profile-host` · **类型**: desktop-adapter · **声明权限**: dsh-profile-filesystem、controlled-pnpm-runtime、dsh-cli-runtime · **官方管理方式**: 桌面基础服务，不提供卸载 · **来源**: [本地包](packages/dsh-desktop-profile-host)
- **默认 Bundle**: `@vibeinging/dsh-desktop-chrome` · **类型**: desktop-adapter · **声明权限**: 无 Host 权限 · **官方管理方式**: `dsh plugin --profile web remove @vibeinging/dsh-desktop-chrome` · **来源**: [本地包](packages/dsh-desktop-chrome)
- **默认 Bundle**: `@vibeinging/dsh-project-tools` · **类型**: desktop-adapter · **声明权限**: product-host · **官方管理方式**: `dsh plugin --profile web remove @vibeinging/dsh-project-tools` · **来源**: [本地包](packages/dsh-project-tools)
- **默认 Bundle**: `@vibeinging/dsh-canvas-tools` · **类型**: desktop-adapter · **声明权限**: product-host · **官方管理方式**: `dsh plugin --profile web remove @vibeinging/dsh-canvas-tools` · **来源**: [本地包](packages/dsh-canvas-tools)
- **默认 Bundle**: `@vibeinging/dsh-structured-ui-tools` · **类型**: desktop-adapter · **声明权限**: product-host · **官方管理方式**: `dsh plugin --profile web remove @vibeinging/dsh-structured-ui-tools` · **来源**: [本地包](packages/dsh-structured-ui-tools)
- **默认 Bundle**: `@vibeinging/dsh-model-inheritance` · **类型**: portable · **声明权限**: 无 Host 权限 · **官方管理方式**: `dsh plugin --profile web remove @vibeinging/dsh-model-inheritance` · **来源**: [本地包](packages/dsh-model-inheritance)
- **默认 Bundle**: `@vibeinging/dsh-product-bridge` · **类型**: desktop-adapter · **声明权限**: product-host · **官方管理方式**: `dsh plugin --profile web remove @vibeinging/dsh-product-bridge` · **来源**: [本地包](packages/dsh-product-bridge)
- **默认 Bundle**: `@vibeinging/dsh-office-tools` · **类型**: desktop-adapter · **声明权限**: office-artifact-host · **官方管理方式**: `dsh plugin --profile web remove @vibeinging/dsh-office-tools` · **来源**: [本地包](packages/dsh-office-tools)
- **默认 Bundle**: `@vibeinging/dsh-client-ui-worktree` · **类型**: portable · **声明权限**: 无 Host 权限 · **官方管理方式**: `dsh plugin --profile web remove @vibeinging/dsh-client-ui-worktree` · **来源**: [本地包](packages/dsh-worktree)
- **默认 Bundle**: `@linxin666/dsh-client-ui-task-board` · **类型**: portable · **声明权限**: 读取当前 DSH Session、Workspace 与完成历史、在 DSH_HOME 写入任务账本和执行记录、按用户操作或 Host cron 启动 DSH Session 任务、可选启动固定的跨平台防休眠 helper · **官方管理方式**: `dsh plugin --profile web remove @linxin666/dsh-client-ui-task-board` · **来源**: [上游仓库](https://github.com/zhu1090093659/dsh-web-ui)
- **默认 Bundle**: `dsh-multimedia-webui-input` · **类型**: portable · **声明权限**: 读取用户主动选择的文件和文件夹、向当前 Session 工作区的 .dsh/tmp/attachments 写入附件、按用户

二次确认清理带插件所有权标记的附件目录 · **官方管理方式**: `dsh plugin --profile web remove dsh-multimedia-webui-input` · **来源**: [上游仓库](https://github.com/LCYLYM/dsh-attachments)
- **默认 Bundle**: `dshmarket` · **类型**: portable · **声明权限**: 读取和修改当前 DSH Profile 的依赖、Bundle 顺序和启停状态、通过受控 pnpm 安装、更新和卸载用户确认的插件、访问插件目录、npm、GitHub 以及用户配置的 WebDAV 或 Gist、导出或导入包含 Profile 配置的备份 · **官方管理方式**: `dsh plugin --profile web remove dshmarket` · **来源**: [上游仓库](https://github.com/dsh-market/dsh-market)

## 插件兼容性

DSH Desktop 按能力边界识别两类 Bundle：

- `portable` Bundle 只使用官方 DSH 服务，可以安装到兼容的官方 Web Profile；
- `desktop-adapter` Bundle 使用 DSH Desktop 提供的窄 Host 合同，离开桌面宿主时应直接报告缺少能力。

与当前官方 DSH Web 兼容的标准 Bundl