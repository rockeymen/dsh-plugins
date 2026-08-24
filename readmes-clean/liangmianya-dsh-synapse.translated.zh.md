# dsh-synapse

**A visual, non-linear conversation workspace plugin for DeepSeek Harness.**

把同一工作区里的会话、追问与分支变成一张可浏览、可拖拽、可放大的对话地图，同时保留 DSH 原生的对话能力。

[中文](#中文) | [English](#english)

![Synapse workspace canvas](docs/images/synapse-ui.png)

## 中文

### 简介

`dsh-synapse` 是一个独立的 DeepSeek Harness Web 插件。它不替代 DSH 的模型、工具、会话或权限逻辑，而是在原生对话界面上增加一个可视化工作台，将同一工作区内的会话、追问和分支呈现为可浏览的对话地图。

复杂任务往往不是一条直线：你需要保留某个方案、回到第二轮问题尝试另一条路径，或在多个会话之间快速定位上下文。Synapse 让这些关系留在同一张画布上，同时继续使用 DSH 原有的会话能力。

### 功能特性

###  · 功能 · 说明
- 🗺️ · **功能**: 会话地图 · **说明**: 在 DSH 原生对话与可视化画布之间切换
- 🌿 · **功能**: 分支可见 · **说明**: 通过 DSH 原生 session fork 创建分支，并按真实分叉点连接节点
- 📁 · **功能**: 工作区映射 · **说明**: 读取 DSH 工作区与目录归属，便于在正确的项目上下文中创建会话
- 📥 · **功能**: 持续投影 · **说明**: 用户消息和助手回复投影到对应卡片；流式回复在详情中持续更新
- 🔧 · **功能**: 工具过程折叠 · **说明**: 工具调用与结果按 `callId` 配对，折叠进对应助手回复卡，不再单独成卡
- ⚡ · **功能**: 会话同步 · **说明**: 原生对话与会话地图双向同步当前会话——任一侧切换，另一侧跟随高亮
- 🎨 · **功能**: 画布交互 · **说明**: 拖动画布、缩放视图（最高 4×）、移动卡片（位置自动保存）、展开/折叠后续对话子树、一键定位当前会话，卡片内平滑滚动
- 🔒 · **功能**: 原生会话不变 · **说明**: 打开、追问、创建和归档仍由 DSH 会话系统完成；Synapse 只提供另一种查看与组织方式

![Native dialogue and Synapse toggle](docs/images/native-webui.png)

### 快速开始

```powershell
corepack pnpm dsh plugin --profile web add github:liangmianya/dsh-synapse
corepack pnpm dsh web
```

打开 `http://127.0.0.1:3080/`，点击顶部"会话地图"即可进入。

### 安装

前提：已安装支持 `dsh plugin` profile 插件机制的 DeepSeek Harness（2026-08 及之后版本），且 Node.js 版本不低于 `22.19`。

> [!NOTE]
> 本插件**仅支持 `web` profile**：它的 patch 只向 Web 组合插入自身，复用 DSH 现有 Web 服务，不启动第二个应用进程。

#### 从 GitHub 安装

```powershell
corepack pnpm dsh plugin --profile web add github:liangmianya/dsh-synapse
```

GitHub 安装会执行本项目的 `prepare` 脚本（`node --check` 语法校验）。

> [!IMPORTANT]
> pnpm ≥10 默认阻止 git 依赖的构建脚本。若安装被拦截，请把 **pnpm 打印的确切键**（包名加其拉取的 tarball 地址，内含 commit，**不是裸包名**）复制进 DSH profile 的 `pnpm-workspace.yaml`：

```yaml
allowBuilds:
  "dsh-synapse@https://codeload.github.com/liangmianya/dsh-synapse/tar.gz/<commit>": true
```

然后重新执行安装命令。在 pnpm 10.x 上裸包名匹配不到 git 依赖；上游推送新 commit 后该键会变化，届时复制 pnpm 新打印的键即可。

#### 本地开发安装

```powershell
corepack pnpm dsh plugin --profile web add link:E:\path\to\dsh-synapse
```

`link:` 形式会直接链接你的本地 checkout，改代码即时生效。

#### 启动

```powershell
corepack pnpm dsh web                # 默认 http://127.0.0.1:3080
corepack pnpm dsh web --port 0       # 3080 被占用时，自动分配空闲端口
```

### 卸载

```powershell
corepack pnpm dsh plugin --profile web remove dsh-synapse
```

> [!NOTE]
> `remove` 只移除插件依赖与 profile 激活层，**不会删除画布数据**（`$DSH_HOME\synapse\workspaces.json`）。重装后旧数据会自动迁移恢复。
>
> 彻底清理：手动删除 `$DSH_HOME\synapse\` 目录；`pnpm-workspace.yaml` 中残留的 allowBuilds 键无害，可一并删掉。

### 配置

插件通过 profile 的 `cordis.patch.yml` 注入，以下键可在你自己的 patch 中按行 id `synapse` 覆盖（整体替换 `config`）：

### 键 · 默认值 · 说明
- **键**: `dataFile` · **默认值**: `$DSH_HOME/synapse/workspaces.json` · **说明**: 画布元数据持久化路径
- **键**: `autoProjection` · **默认值**: `true` · **说明**: 是否自动把已提交的 DSH 会话事件投影为画布卡片
- **键**: `projectionWorkspaceTitle` · **默认值**: `DSH 任务` · **说明**: 投影工作区的标题
- **键**: `trustedHosts` · **默认值**: `[]` · **说明**: 额外放行的 Host（主机名或 主机:端口）；`localhost` 与 `127.0.0.1` 始终放行。局域网访问需在此加入你的主机

```yaml
# 在 profile 的 cordis.patch.yml 中覆盖（需重述全部键）
- id: synapse
  config:
    dataFile: !!js dshHomePath('synapse/my-workspaces.json')
    autoProjection: true
    projectionWorkspaceTitle: 我的任务
```

### 使用方式

1. 在 DSH 中选择工作目录，或打开一个已有会话。
2. 点击顶部"会话地图"进入画布。
3. 浏览画布卡片：点击卡片或侧边栏会话即可切换当前会话（原生页同步跟随）；"分支"操作保留一条替代路径。
4. 点击卡片底部"详情"查看完整对话记录；点击顶部"对话"切换或卡片"在 DSH 中打开"，回到原生对话。

### 数据与边界

- 画布元数据保存在 DSH Home 的 `synapse/workspaces.json`（当前 schema v4，自动迁移旧版数据）。
- 单条消息投影上限 **8000 字符**，超出截断并标注"—…（详情查看全文）"。
- 会话内容仍由 DSH session log 保存和管理。
- 本插件不启动第二个 Web 服务、不创建第二套 Agent，也不改变 DSH 的模型或工具执行行为。

### 模型影响

无直接模型影响：插件只读取**已提交**的会话事件并渲染成画布，不向任何模型请求添加系统提示、工具 schema 或请求上下文，也不影响 KV 缓存复用。

### 已知限制与后续

- 仅支持 `web` profile。
- 画布元数据与会话日志分离：删除 `workspaces.json` 会丢失画布布局与分支锚点，但不会丢失会话。
- 两个 `dsh web` 实例共享同一 profile 时会写同一个 `workspaces.json`：运行时已加跨进程写锁与外部修改警告，但最后写入覆盖的风险仍在——请只运行单个实例。
- 旧版（v3）数据迁移时工具卡片按**顺序**配对（每条调用配下一条结果）；实时事件按 `callId` 配对。

## English

`dsh-synapse` is a standalone DeepSeek Harness Web plugin. It does not replace DSH models, tools, sessions, or permissions. Instead, it adds a visual workspace on top of the native conversation UI, turning related sessions, follow-ups, and forks into an explorable conversation map.

Complex work is rarely linear. You may need to preserve one approach, return to an earlier turn, and explore another path without losing context. Synapse keeps those relationships on one canvas while leaving DSH's native session behavior intact.

### Features

### · 功能 · 描述
- 🗺️ · **功能**：会话图 · **描述**：在本机 DSH 聊天和可视画布之间切换
- 🌿 · **功能**：可见分支 · **描述**：通过 DSH 原生会话分叉创建分叉，并在实际分支转弯处连接它们
- 📁 · **功能**：工作空间感知 · **描述**：创建或浏览会话时反映 DSH 工作空间和目录所有权
- 📥·**功能**：实时投影·**描述**：将用户消息和助理回复投影到卡片中，并在详细视图中进行流式更新
- 🔧 · **功能**：折叠工具流程 · **描述**：工具调用和结果通过 `callId` 配对并折叠到助手回复卡中，而不是成为独立卡
- ⚡·**功能**：会话同步·**描述**：本机聊天和会话地图双向同步当前会话 - 切换一侧会突出显示另一侧
- 🎨·**功能**：画布交互·**描述**：平移、缩放（最大 4 倍）、移动卡片（位置保持不变）、展开或折叠后代子树、一键聚焦当前会话以及在每张卡片内平滑滚动
- 🔒·**功能**：本机会话保持本机状态·**描述**：打开、提示、创建和存档会话仍归 DSH 所有； Synapse 仅改变它们的查看和组织方式

### 快速开始

```powershell
corepack pnpm dsh plugin --profile web add github:liangmianya/dsh-synapse
corepack pnpm dsh web
```

打开 `http://127.0.0.1:3080/` 并使用顶部的“Session Map”开关。

### 安装

先决条件：具有 `dsh plugin` 配置文件插件机制的 DeepSeek Harness（2026-08 或更高版本）和 Node.js `>= 22.19`。

> [!注意]
> 此插件 **仅支持 `web` 配置文件**：其补丁插入到 Web 组合中并重用现有的 DSH 服务器，而不是运行第二个应用程序进程。

#### 从 GitHub 安装

```powershell
corepack pnpm dsh plugin --profile web add github:liangmianya/dsh-synapse
```

GitHub 安装运行此包的 `prepare` 脚本（`node --check` 语法验证）。

> [!重要]
> pnpm ≥10 会阻止 git 依赖项的构建脚本，直到明确允许为止。如果安装被阻止，请将**打印的精确密钥 pnpm**（包名称加上其获取的 tarball URL，其中嵌入提交，**不是裸包名称**）复制到 DSH 配置文件的 `pnpm-workspace.yaml` 中：

```yaml
allowBuilds:
  "dsh-synapse@https://codeload.github.com/liangmianya/dsh-synapse/tar.gz/<commit>": true
```

然后重新运行安装命令。在 pnpm 10.x 上，裸包名称与 git 托管的依赖项不匹配；当上游存储库推送新的提交时，密钥会发生变化，因此请复制新打印的密钥。

#### 安装本地结账

```powershell
corepack pnpm dsh plugin --profile web add link:E:\path\to\dsh-synapse
```

`link:` 表单指向您的本地结帐处，因此编辑会立即生效。

#### 启动

```powershell
corepack pnpm dsh web                # default http://127.0.0.1:3080
corepack pnpm dsh web --port 0       # pick a free port when 3080 is taken
```

### 卸载

```powershell
corepack pnpm dsh plugin --profile web remove dsh-synapse
```

> [!注意]
> `remove` 只去除依赖和profile激活层；它**不会**删除画布数据（`$DSH_HOME\synapse\workspaces.json`）。重新安装会恢复并迁移旧数据。
>
> 如需完全清理，请手动删除 `$DSH_HOME\synapse\` 目录； `pnpm-workspace.yaml` 中剩余的allowBuilds 密钥是无害的，也可以删除。

### 配置

该插件是通过配置文件的 `cordis.patch.yml` 注入的。通过定位行 ID `synapse` 覆盖您自己的补丁中的任何键（整个 `config` 被替换）：

### 键·默认值·说明
- **密钥**：`dataFile` · **默认**：`$DSH_HOME/synapse/workspaces.json` · **描述**：画布元数据持久路径
- **按键**：`autoProjection` · **默认**：`true` · **描述**：自动将提交的 DSH 会话事件投影到画布卡中
- **按键**：`projectionWorkspaceTitle` · **默认**：`DSH 任务` · **描述**：投影工作空间的标题
- **密钥**：`trustedHosts` · **默认**：`[]` · **描述**：`/synapse` 主机检查接受的额外权限（主机或主机:端口）； `localhost` 和 `127.0.0.1` 始终允许。 LAN访问必须在这里添加你的主机

````yaml
# 在配置文件的 cordis.patch.yml 中覆盖（重述每个键）
- ID：突触
  配置：