![DSH Skills Manager](assets/branding/dsh-banner.png)

  # DSH Skills Manager

  **在 DeepSeek Harness 中安全管理本地技能，并查看公共 Agent 技能**

  [English](README.md) · [Apache-2.0](LICENSE)

> DSH Skills Manager 是社区维护的 DeepSeek Harness（DSH）插件，并非 DeepSeek AI 官方产品。

## 功能概览

- 在「设置 → 技能」中按分类筛选或搜索，查看 DSH 本地技能与公共 Agent 技能。
- 对 DSH 本地技能执行启用、停用、上传、覆盖和删除。
- 公共 Agent 技能始终只读，不改写共享的全局元数据。
- 使用系统文件选择器导入包含 `SKILL.md` 的插件目录，并对同名覆盖强制确认。
- 可把一句话复制到 DSH、Codex 或 WorkBuddy，让对方代装到本机 DSH。

## 界面预览

在「设置 → 技能」中按分类筛选或搜索。DSH 本地技能可启用、停用和删除；公共 Agent 技能只读：

![技能管理设置页面](assets/screenshots/skills-manager.png)

本地 DSH 技能为空时，公共 Agent 技能仍然可见：

![未安装本地技能时仍可查看公共 Agent 技能](assets/screenshots/skills-public.png)

紧凑上传弹窗支持选择 `SKILL.md`、选择插件目录，或直接拖放文件：

![上传插件弹窗](assets/screenshots/upload-plugin.png)

启用 DSH 本地技能后，聊天输入框会恢复对应的 `/` 命令：

![启用本地技能后的斜杠命令](assets/screenshots/slash-command.png)

## DSH 产品生态

本产品既可以独立安装，也可以随桌面端或 Web 套件一起使用。它们共享同一个 DSH 核心，但面向不同的使用方式：

### 产品 · 与本产品的关系
- **产品**: [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) · **与本产品的关系**: 本产品的运行宿主，提供模型、会话、工具和插件系统
- **产品**: [DSH Codex Desktop](https://github.com/MichengAI/dsh-codex-desktop) · **与本产品的关系**: 下载安装即用的桌面产品，已内置本产品和其他 5 个功能产品
- **产品**: [DSH Codex Suite](https://github.com/MichengAI/dsh-codex-ui/tree/main/packages/dsh-codex-suite) · **与本产品的关系**: 面向已有 DSH Web 环境的一键套件，会安装本产品和其他 5 个功能产品
- **产品**: 6 个功能产品 · **与本产品的关系**: [Codex UI](https://github.com/MichengAI/dsh-codex-ui) · [IM Connect](https://github.com/MichengAI/dsh-im-connect) · [Automation](https://github.com/MichengAI/dsh-automation) · [Skills Manager](https://github.com/MichengAI/dsh-skills-manager) · [Archive Manager](https://github.com/MichengAI/dsh-archive-manager) · [Agency Agents](https://github.com/MichengAI/dsh-agency-agents)

## 前置条件

- 已可正常运行 DeepSeek Harness Web，且可在 PowerShell 中使用 `dsh`。
- 以下示例使用 `web` profile；请替换为实际目标 profile。
- 从源码安装或二次开发需要 Node.js 20+；仅从 npm 安装无需在任意目录执行 `npm install`。

## 安装

`dsh plugin add` 会转发到 profile 目录里的 `pnpm add`。不写版本、不指定官方源时，本机镜像和最短发布间隔可能让你停在旧版。

### 交给其他 Agent 一句话安装

本插件运行在 DeepSeek Harness Web 里。把下面其中一句复制到 DSH、Codex 或 WorkBuddy，让它代你安装到本机 `web` profile。

从 npm 安装：

```text
请把 DSH 插件 @michengai/dsh-skills-manager 最新版装进本机 web profile，使用官方 npm 源执行：dsh plugin --profile web add @michengai/dsh-skills-manager@latest --registry=https://registry.npmjs.org/。装完执行 dsh --profile web --dump-config，确认已挂载 skills-manager，并提醒我重启 DSH Web 后硬刷新浏览器。
```

从源码安装：

```text
请从 https://github.com/MichengAI/dsh-skills-manager 安装 DSH 插件：克隆仓库，执行 npm install 和 npm test，再在该目录执行 dsh plugin --profile web add .。不要只复制 lib。然后执行 dsh --profile web --dump-config，确认已挂载 skills-manager，并提醒我重启 DSH Web 后硬刷新浏览器。
```

### 产品 · 怎么用
- **产品**: DSH · **怎么用**: 把上面其中一句发给当前会话。
- **产品**: Codex · **怎么用**: 把上面其中一句发给 Codex，让它在本机执行安装。
- **产品**: WorkBuddy · **怎么用**: 把上面其中一句发给 WorkBuddy；源码安装也可同时粘贴仓库地址 `https://github.com/MichengAI/dsh-skills-manager`。

Codex 和 WorkBuddy 只负责代装；装好后仍要打开 DSH Web 使用「设置 → 技能」。

也可以自己执行同一条 npm 命令：

```powershell
dsh plugin --profile web add @michengai/dsh-skills-manager@latest --registry=https://registry.npmjs.org/
```

未把 `dsh` 装进 PATH 时，把开头的 `dsh` 换成 `npx --yes @deepseek-ai/dsh`。

### 从官方 npm 安装最新版

在任意 PowerShell 目录执行：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile web add @michengai/dsh-skills-manager@latest --registry=https://registry.npmjs.org/
dsh --profile web --dump-config
```

需要钉死某一版时，把 `@latest` 换成具体版本，例如 `@0.1.23`。

配置输出中应包含 `skills-manager`。安装后重启 DSH Web 并在浏览器硬刷新。不要手工复制客户端文件，`dsh plugin add` 会同时应用 `cordis.patch.yml`。

### 从源码安装

适用于调试或使用未发布改动。克隆后的本地路径就是插件安装路径：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location D:\Repository\deepseek-harness-plugin
git clone https://github.com/MichengAI/dsh-skills-manager.git
Set-Location .\dsh-skills-manager
npm install
npm test
dsh plugin --profile web add .
dsh --profile web --dump-config
```

完成后重启 DSH Web 并硬刷新浏览器。`dsh plugin ... add .` 会读取当前目录的包信息和 `cordis.patch.yml`；不要改为直接复制 `lib` 目录。

## 使用

打开「设置 → 技能」，再按下表操作：

### 目标 · 操作 · 范围
- **目标**: 搜索或筛选 · **操作**: 用「分类」和「搜索」按目录、名称、形态或简介收窄列表。 · **范围**: DSH 与公共 Agent 技能
- **目标**: 查看技能 · **操作**: 查看名称、形态、说明和调用状态。 · **范围**: DSH 与公共 Agent 技能
- **目标**: 启用或停用 · **操作**: 点击「启用」或「停用」。它会同步控制模型调用和 `/` 手动命令。 · **范围**: 仅 DSH 本地技能
- **目标**: 上传插件 · **操作**: 点击「上传插件」，选择插件目录内的 `SKILL.md`。完整目录、脚本和资源都会被复制。 · **范围**: 仅 DSH 本地技能
- **目标**: 改选插件目录 · **操作**: 所选文件无可用路径时，选择包含 `SKILL.md` 的目录。 · **范围**: 仅 DSH 本地技能
- **目标**: 覆盖或删除 · **操作**: 同名时确认覆盖；使用「删除」移除不再需要的本地技能。 · **范围**: 仅 DSH 本地技能
- **目标**: 查看公共技能 · **操作**: 查看公共 Agent 技能，不修改其元数据。 · **范围**: 只读

![删除插件确认框](assets/screenshots/delete-plugin.png)

> 删除 DSH 本地技能需要确认，删除后无法恢复。

按 ESC 只关闭最上层上传框或确认框，设置页会保持打开。

## 权限与安全边界

## 二次开发

当前仓库未提供 `src` 源目录，`lib` 是直接维护的运行源码；这是当前仓库的实现方式，不是新插件的推荐布局。新插件建议使用 `src` 开发并构建到 `lib`：

- [lib\index.js](lib/index.js)：Host 服务与本地技能文件操作入口。
- [lib\client.js](lib/client.js)：设置页、上传和确认交互。
- `test\core-test.mjs`：文件操作、权限和导入边界测试。
- `test\locale-test.mjs`：界面词条测试。

修改后运行测试、检查发布内容并以本地目录安装验证：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
npm test
npm run pack:check
dsh plugin --profile web add .
```

修改文件写入逻辑时必须保留路径校验、临时目录复制和公共技能只读限制。

## 验证

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
npm test
npm run pack:check
```

`prepublishOnly` 会在发布前自动执行核心测试。

## 项目文档与许可证

项目状态、使用边界、技术架构和迭代记录从[文档交接入口](docs/00-交接入口/00-阅读导航.md)开始。详细操作说明见 `docs\02-产品与业务\01-使用说明.md`。

本项目采用 [Apache License 2.0](LICENSE)。

## 更新日志

最近五个发布版本见 [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)。