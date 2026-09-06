# xiaotaozi-dsh

小桃子 DSH：Desktop + xtz CLI 两个主产品，共用一套 DeepSeek Harness 插件能力。

  dsh-providers · dsh-memory · dsh-im · dsh-hello · dsh-sidebar · dsh-market · dsh-agent-teams · dsh-context

  设置 → 模型 · 小桃子 · 记忆 · 侧栏 → IM机器人

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 从 Git 或 npm 装插件。本仓库是 **xiaotaozi-dsh**：两个主产品是 [`apps/desktop/`](apps/desktop/) 的 Mac 客户端，以及 [`apps/cli/`](apps/cli/) 的 `xtz` 命令；`plugins/` 是两者共用的能力层。根目录不是插件，不要对它执行 `dsh plugin add`。

出了问题，或还缺某个插件？[提个 issue](https://github.com/kedoupi/xiaotaozi-dsh/issues)。

## 特性

- **两个入口，同一套正式环境。** 用户使用 Desktop；熟悉终端和配置的人也可以用 `xtz`。当前 CLI 只读检查由 Desktop 管理的 `~/.dsh` / 3080；生命周期和任务命令要等共享安全能力落地。双持不改变插件所有权。
- **一个包做一件事。** 模型、记忆、IM 机器人、小桃子工作台各自安装。Git 安装一律是 `github:kedoupi/xiaotaozi-dsh#path:plugins/<slug>`。
- **两套家目录。** 测试走测试，正式走正式。改插件和 `pnpm tauri dev` 用 `.dsh-home`（`pnpm dev`，3081）。已安装的小桃子DSH.app 走 `~/.dsh`（3080）。不要混。
- **默认 Host，有 UI 再 mixed。** `pnpm new` 默认 host。只有设置页、Slot、主题才加 `src/client`。
- **Git 路径安装在用户机器上构建。** 每个插件把 `prepare` / `tsdown.config.ts` 留在包内，这样 `github:…#path:plugins/<slug>` 不必依赖整个 workspace 也能编过。

## `xtz` CLI

第一版 `xtz` 是只读安全基础，运行时精确固定为 Node.js `22.19.0` 和 DSH `0.1.1-rc.2`。用 npm、bun 或安装脚本装（它们只负责装包，运行仍是 Node）：

```bash
curl -fsSL https://raw.githubusercontent.com/kedoupi/xiaotaozi-dsh/main/apps/cli/scripts/install.sh | sh
npm install -g xiaotaozi-dsh-cli
bun add -g xiaotaozi-dsh-cli
xtz --help
xtz version
xtz status
xtz config path
xtz plugin list
xtz doctor
```

## 插件

###  · 包 · 占用 · 做什么

## 关联（git submodule）

只读的上游 pin。我们 fork 进 `plugins/`，**只装 fork**。不打算 fork 并安装的项目不要加 submodule。不要对 `externals/` 跑 `link-plugin` 或 `dsh plugin add`。克隆时加 `--recurse-submodules`，或事后 `git submodule update --init`。规范：[docs/conventions.zh.md](docs/conventions.zh.md)「Externals」。

作者有更新：`git submodule update --remote externals/<name>`，对照 `plugins/<slug>/src`，把要的改动迁进 fork。不要 `#path:externals/…`。

### 检出 · 上游 · 我们的 fork（真正要装的）
- **检出**: [`externals/dsh-agent-teams`](externals/dsh-agent-teams) · **上游**: [NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) · **我们的 fork（真正要装的）**: [`plugins/agent-teams`](plugins/agent-teams)（`dsh-agent-teams`）
- **检出**: [`externals/dsh-context`](externals/dsh-context) · **上游**: [bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context) · **我们的 fork（真正要装的）**: [`plugins/context`](plugins/context)（`dsh-context`）

## 安装

选一个包装，不要装仓库根目录。

**先选安装模式。** 下面的 Git 路径命令是给 Node / 开发沙箱用的（`.dsh-home`、端口 3081）。正式 `~/.dsh` / 3080 的桌面产品线不要用 GitHub、npm 或 `link:` 安装；桌面端使用内置插件和验签后的插件包。

**第一步 — 把一个插件加到沙箱的 `web` profile。**

```bash
dsh plugin --profile web add github:kedoupi/xiaotaozi-dsh#path:plugins/providers
dsh web
```

**第二步 — 打开这个插件占用的页面或入口。** 模型：**设置 → 模型**；记忆：**设置 → 记忆**；工作台：**设置 → 小桃子**；IM：侧栏 **新会话** 下方 → **IM机器人**；市场：侧栏 **新会话** 下方 → **小桃子市场**；Agent Teams：对话和活动面板；Context：会话 **上下文** Tab 或 `/context`。欢迎弹框由工作台插件管理。

每个插件都是这种 Git 路径：

```text
github:kedoupi/xiaotaozi-dsh#path:plugins/<slug>
```

## 用法

装好之后从对应页面用（模型 / 记忆 / 小桃子走设置，IM 走侧栏「新会话」下方，记忆还可以在对话里用）。`dsh plugin add` 之后没有额外命令。

### 你想… · 安装 · 然后
- **你想…**: 登录 Codex / Claude / Grok / 通义灵码 / Kimi，或存 API Key · **安装**: `dsh-providers` · **然后**: 设置 → **模型**
- **你想…**: 让模型跨会话还能想起来 · **安装**: `dsh-memory` · **然后**: 对话里说「记住……」，或设置 → **记忆**
- **你想…**: 从飞书、微信、Slack 等跟本机 Harness 说话 · **安装**: `dsh-im` · **然后**: 侧栏「新会话」下方 → **IM机器人**
- **你想…**: 浏览插件和工作流包 · **安装**: `dsh-market` · **然后**: 侧栏「新会话」下方 → **小桃子市场**；搜索/筛选后排队安装或移除
- **你想…**: 打开或关闭小桃子壳功能 · **安装**: `dsh-hello` · **然后**: 设置 → **小桃子**
- **你想…**: 用右侧文件 / Git / 终端面板 · **安装**: `dsh-sidebar` · **然后**: 设置 → **Side card**
- **你想…**: 让张老板带队干活 · **安装**: `dsh-agent-teams` · **然后**: 对话，或 `/agent-teams <目标>`
- **你想…**: 看模型窗口里现在有什么 · **安装**: `dsh-context` · **然后**: 会话 **上下文** Tab，或 `/context`

## 截图

Web 打开时的欢迎弹框，点确定关掉。

![小桃子 DSH 欢迎弹框](plugins/hello/docs/welcome.png)

设置 → 模型：左侧已接上的服务商，右侧登录或填密钥。

![设置 → 模型](plugins/providers/docs/models.jpg)

还没接上的服务商在「添加服务商」。

![添加服务商](plugins/providers/docs/add-provider.jpg)

侧栏「新会话」下方 → IM机器人：扫码、贴 App Manifest，或填机器人凭据。

![侧栏 → IM机器人](plugins/im/docs/imbot.png)

## 结构

```text
plugins/<slug>/     可发布的插件，包名 dsh-<slug>
apps/desktop/       小桃子DSH Tauri 客户端（不是 pnpm workspace 成员）
apps/cli/           xtz CLI（独立、可发布的 pnpm workspace）
externals/          上游插件的 git submodule（不进 pnpm workspace）
templates/          `pnpm new` 用的 host / mixed 模板
scripts/            new / link-plugin / 沙箱启动 / manifest / path-install / doctor
docs/               规范 + 流程
apps/website/       独立的 VitePress 官网 workspace
.dsh-home/          gitignore 掉的沙箱 Harness 家目录（端口 3081）
```

根包不要声明 `dsh.bundle` 或 `dsh.profile`。
dsh RC、Node、Python、pnpm、桌面应用和 CLI 版本只有一个机器可读规范源：[`versions.json`](versions.json)。各清单仍写普通字面值，不让 `package.json` 动态引用 JSON；`pnpm check` 负责拒绝漂移。

###  · 官网 / 用户桌面端 · 沙箱
- 家目录 · **官网 / 用户桌面端**: `~/.dsh` · **沙箱**: `<仓库>/.dsh-home`（gitignore）
- 命令 · **官网 / 用户桌面端**: 小桃子DSH.app 或正式 `dsh web`；首版 `xtz` 仅只读检查 · **沙箱**: `pnpm dev`
- 端口 · **官网 / 用户桌面端**: **3080** · **沙箱**: **3081**
- 插件 · **官网 / 用户桌面端**: 第一次启动拷预打好的 tarball · **沙箱**: `link:` 到本仓库

### 要做什么 · 用哪套
- **要做什么**: 改插件源码、设置页、`link-plugin`、debug `pnpm tauri dev` · **用哪套**: 沙箱 **3081**
- **要做什么**: pack 落地、公证、已安装的小桃子DSH.app · **用哪套**: 正式 `~/.dsh` **3080**
- **要做什么**: 发出去的 `.dmg` · **用哪套**: 正式 `~/.dsh` **3080**

`pnpm tauri dev` 只在 debug（沙箱 **3081**）。release 绝不探 3081。不要在已安装的小桃子DSH.app 里验证 `link:` 的插件。`link-plugin` 和 `pnpm dev` 会把 `DSH_HOME` 设成 `.dsh-home`。不要把工作区插件挂到 `~/.dsh`。`pnpm check-home`（`node scripts/doctor.mjs`）只诊断并列出误挂项，绝不自动编辑 profile 或修复。

## 开发

规范：[docs/conventions.zh.md](docs/conventions.zh.md)。步骤：[docs/workflow.zh.md](docs/workflow.zh.md)。硬性规则：[AGENTS.md](AGENTS.md)。和我一起开发时走 `/dsh-plugin`。

需要 Node.js `>= 22.19`，以及全局 CLI `@deepseek-ai/dsh@0.1.1-rc.2`（`@next`）。先克隆：

```bash
git clone --recurse-submodules https://github.com/kedoupi/xiaotaozi-dsh.git
cd xiaotaozi-dsh
pnpm install
```

克隆后先安装依赖，再运行任何构建或检查。

### 门禁 · 保证什么
- **门禁**: `pnpm check` · **保证什么**: 版本/文档/清单策略、类型检查、插件测试和脚本测试；不证明已经生成 `lib/`
- **门禁**: `pnpm check:build` · **保证什么**: 构建全部插件，再强制检查生成的 `lib/`，保证 Git path 安装所需产物安全
- **门禁**: `pnpm check:path` · **保证什么**: 按隔离的 Git `#path:` 形态安装每个插件并验证包内自构建
- **门禁**: `pnpm check:desktop` · **保证什么**: 桌面脚本测试、前端构建、Rust 格式/lint/测试/check；不发布，也不生成正式安装包
- **门禁**: `pnpm check:cli` · **保证什么**: 独立安装、类型检查、构建并测试 `apps/cli`；不启动正式服务

```bash
pnpm new greet                 # 或：pnpm new sidebar --kind mixed
# 把 greet 样例换成真实逻辑，然后：
pnpm --filter dsh-greet test
pnpm --filter dsh-greet build
node scripts/link-plugin.mjs --profile dsh-dev greet
pnpm check-home   # 日常 ~/.dsh 不能挂本仓
```

要在 Web UI 里用：挂到沙箱的 `web`，再 `pnpm dev`（端口 3081）。改插件时不要对 `~/.dsh` 跑 `dsh web`。`pnpm tauri dev` 走同一套沙箱 :3081。

```bash
node scripts/link-plugin.mjs --profile web <slug>
pnpm dev   # 只停验证为本仓启动的 :3081，再监视插件；未知监听者会拒绝启动
```

## 文档

### 文档 · 什么时候看
- **文档**: [规范](docs/conventions.zh.md) · **什么时候看**: 包身份、两套 home、各项检查查什么
- **文档**: [流程](docs/workflow.zh.md) · **什么时候看**: 创建、安装、优化、提交
- **文档**: [AGENTS.md](AGENTS.md) · **什么时候看**: 本仓库给 agent 的硬性规则
- **文档**: [externals/dsh-agent-teams](externals/dsh-agent-teams) · **什么时候看**: 上游 pin（不要装）
- **文档**: [externals/dsh-context](externals/dsh-context) · **什么时候看**: 上游 pin（不要装）