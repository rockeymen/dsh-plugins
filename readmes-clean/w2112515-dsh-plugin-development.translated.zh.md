# DSH插件开发

DSH 插件开发是一种便携式代理技能，用于设计、实现、打包、审查和诊断 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件。相同的规范技能目录适用于 Codex、Claude Code 和 DSH。可选的 DSH 捆绑适配器添加了配置文件范围内的安装和可逆删除，而无需创建工作流程的另一个副本。

> 测试版和非官方版本。该社区项目不隶属于 DeepSeek，也不受其认可。 DeepSeek Harness 处于开发人员预览阶段，因此当前的存储库指令、可执行约束、类型、清单和加载器行为仍然具有权威性。

## 项目形状

### 部分·目的
- **部分**：[`skills/dsh-plugin-development`](skills/dsh-plugin-development) · **目的**：规范便携式技能及其按需参考和脚本。
- **部分**：[`skills/dsh-plugin-development/agents/openai.yaml`](skills/dsh-plugin-development/agents/openai.yaml) · **目的**：可选的 Codex UI 元数据；它不会分叉技能指令。
- **部分**：[`index.js`](index.js) 和 [`cordis.patch.yml`](cordis.patch.yml) · **用途**：薄可选适配器，用于在 DSH 配置文件中注册规范技能。
- **部分**：`.codex-plugin` / `.claude-plugin` · **目的**：故意缺席。两个主机都不需要插件来使用技能。

该技能在应用特定于模式的规则之前区分实时动态 Cordis 插件、源支持的 DSH 工作区包和树外可安装包。它不添加 MCP 服务器、帐户、凭证或远程服务依赖项。

## 法典

安装或链接规范目录：

- `~/.codex/skills/dsh-plugin-development` 的个人技能；或
- `<repo>/.agents/skills/dsh-plugin-development` 的存储库技能。

您还可以要求 `$skill-installer` 安装此 GitHub 目录：

```text
https://github.com/w2112515/dsh-plugin-development/tree/main/skills/dsh-plugin-development
```

使用 `$dsh-plugin-development` 显式调用它，或者让其描述触发它以匹配 DSH 插件工作。不需要 Codex 插件。

## Claude Code

安装或链接相同的规范目录：

- `~/.claude/skills/dsh-plugin-development` 的个人技能；或
- `<repo>/.claude/skills/dsh-plugin-development` 的存储库技能。

用`/dsh-plugin-development`调用它，或者让Claude自动加载它以进行匹配工作。该目录使用可移植的代理技能 frontmatter 子集，并且不依赖于 Claude-only 参数、shell 注入、子代理字段或路径变量。不需要 Claude Code 插件。

## DeepSeek Harness

DSH可以直接从以下位置发现相同的目录：

——`<repo>/.dsh/skills/dsh-plugin-development`；
- `<repo>/.agents/skills/dsh-plugin-development`；或
- `<dshHome>/skills/dsh-plugin-development`。

存储库 `.agents/skills` 位置由 Codex 和 DSH 共享，因此这两台主机可以使用一份签入的副本。

### 可选 DSH 捆绑适配器

仅当您希望 `dsh plugin` 拥有配置文件范围内的安装、版本控制、组合和删除时才使用该捆绑包：

以下命令安装当前的 `v0.2.0-beta.1` 适配器。之前的 `v0.1.0-beta.1` 版本保持不变。

```sh
dsh plugin --profile web add https://github.com/w2112515/dsh-plugin-development/releases/download/v0.2.0-beta.1/dsh-plugin-development-0.2.0-beta.1.tgz
dsh --profile web --dump-config
```

转储的配置应包含 `dsh-plugin-development` 层和行 ID `dsh-plugin-development-skill`。适配器从打包的规范技能中读取元数据和指令，通过 `ctx.skills` 进行注册，并在删除时处理该注册。

对于本地适配器开发：

```sh
dsh plugin --profile web add .
```

Git 安装也不需要 `prepare` 或 pnpm `allowBuilds`，因为该包附带纯 JavaScript 和 Markdown：

```sh
dsh plugin --profile web add github:w2112515/dsh-plugin-development#v0.2.0-beta.1
```

使用经过审查的提交 SHA 而不是可移动分支来实现更高保证的 Git 安装。

## 便携式兼容性合同

规范目录遵循[代理技能规范](https://agentskills.io/specification)：

- `SKILL.md` 仅使用共享的 `name` 和 `description` frontmatter 字段；
- 目录名称与技能名称匹配；
- 引用和脚本使用相对于 Skill 目录的路径；
- 详细的模式指导按需加载；和
- 主机特定的 UI 元数据不会改变工作流程。

格式兼容性不会导致出现不可用的工具。动态运行时工作仍然需要实时 Cordis 检查、定义和运行工具。如果没有它们，技能必须停止在源支持的设计或诊断上，并报告激活未经验证。

## 技能涵盖的内容

### DSH插件模式·典型请求·完成证据
- **DSH 插件模式**：动态运行时 Cordis 插件 · **典型请求**：使用实时 Cordis 工具定义进程本地主机或客户端行为 · **完成证据**：实时提供程序和插槽检查、定义/运行状态和最终诊断
- **DSH 插件模式**：DSH 工作区插件 · **典型请求**：添加或修改 DSH 存储库中提供的包 · **完成证据**：当前存储库权限、重点测试、真实 Loader 组成、生命周期证明和产品可见时的快照
- **DSH 插件模式**：可安装的 DSH 捆绑包 · **典型请求**：使用 `dsh.bundle` 和 `cordis.patch.yml` 发送外部包 · **完成证据**：打包文件、隔离配置文件安装、`--dump-config`、打包启动和清理证据

该工作流程还涵盖加载程序导出失败、服务定义/提供商/消费者所有权、模型可见日志记录、客户端插槽、CLI 界面、配置、生命周期处置、配置文件优先级、Git 构建风险和仅审核授权。

## 优先级和生命周期

直接项目技能仍遵循主持人的正常发现和优先规则。在 DSH 中，项目本地条目可以按名称覆盖可选的运行时注册。删除捆绑包仅处理其注册；它不会删除单独安装的个人或项目技能目录。

## 验证

运行独立检查并检查包装好的 DSH 适配器：

```sh
npm test
npm pack --dry-run
```

Codex 维护者还可以针对规范目录运行内置技能验证器：

```sh
python path/to/skill-creator/scripts/quick_validate.py skills/dsh-plugin-development
```

运行时消费者检查接受内置的 DeepSeek Harness 签出，并执行直接文件系统发现和可选的捆绑包注册：

```sh
node scripts/verify-dsh-runtime.mjs path/to/deepseek-harness
```

要获得发布证据，请将精确打包的 tarball 安装到隔离的 DSH 主目录中，检查 `--dump-config`，加载已安装的条目，并验证注册、处置和删除。静态检查永远不会取代这些消费者路径。

打包的只读帮助器为插件作者提供了两个早期检查：

```sh
node skills/dsh-plugin-development/scripts/check-artifact.mjs workspace-function path/to/index.ts
node skills/dsh-plugin-development/scripts/check-artifact.mjs bundle path/to/package
```

## 可发现性

该存储库使用 GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) 和代理技能主题。它不声明项目未定义的单独 DSH 注册表的成员资格。

## 社区

- [LINUX DO](https://linux.do/) — 社区讨论和开源共享。

＃＃ 常问问题

### 这是技能还是DSH插件？

维护的产品是一种便携式特工技能。该存储库还为喜欢配置文件管理安装的用户提供了可选的 DSH 捆绑适配器。

### 是否有单独的 Codex、Claude Code 和 DSH 版本？

不会。这三个都使用相同的 `skills/dsh-plugin-development` 源。仅发现路径、可选 UI 元数据和 DSH 安装适配器不同。

### 安装是否执行包构建脚本？

否。DSH 适配器没有 `prepare`、`install` 或 `postinstall` 脚本。安装前务必检查第三方来源和确切的工件。

### 应如何报告兼容性问题？

使用主机和版本、DSH 版本或提交、选定的插件模式、目标条目路径、确切的请求或命令、观察到的结果以及不可用的证据提出问题。请勿包含凭据或私有运行时数据。