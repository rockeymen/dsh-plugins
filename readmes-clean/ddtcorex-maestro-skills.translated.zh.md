# 大师技能 (`maestro-skills`)

一个用于 AI 编码代理的统一技能库，打包为 **DeepSeek Harness (DSH)**、**Claude Code**、**Codex CLI**、**OpenCode** 和 **GitHub Copilot** 的通用插件 - 两个部分合二为一：

- **领域技能 (11)** — **Govard** 开发环境编排及其支持的 Web 框架（**Magento 2**、Laravel）：架构、linting、性能审计、安全扫描、代码审查、Hyvä/Luma 前端、后端 API。
- **流程技能 (14)** — 完整的 [**超级能力 **](https://github.com/obra/superpowers) 方法论从 v6.3.0（麻省理工学院，© Jesse Vincent）逐字分叉：集思广益、测试驱动开发、系统调试、编写/执行计划、子代理驱动开发、代码审查协作等等。有关许可证和同步策略，请参阅 `THIRD-PARTY-NOTICES.md`。

每项技能都遵循开放的[代理技能标准](https://agentskills.io)（带有 `name`/`description` frontmatter 的 `SKILL.md` 文件），所有主要 AI 代理工具都可以理解。

> **与 [Govard](https://github.com/ddtcorex/govard) 配合使用效果最佳。** 领域技能中的大多数命令示例都假定 Govard 管理的开发环境（`govard sh -c "..."`、`govard tool magerun ...`） - 如果没有它，您需要将它们调整为您自己的容器/CLI 设置。一行安装：`curl -fsSL https://raw.githubusercontent.com/ddtcorex/govard/master/install.sh | bash`。

## 📂 目录结构

每项技能都位于 `skills/<name>/SKILL.md` 之下——这是所有受支持的 AI 工具和平台的单一事实来源：

````
maestro-skills/
├── README.md # 全球文档和指南
├── package.json # NPM 包和 DSH Cordis 插件清单 (@ddtcorex/maestro-skills)
├── THIRD-PARTY-NOTICES.md # Superpowers 分叉归属 + MIT 许可文本
├── 脚本/
│ └──sync-superpowers.sh # 从上游刷新superpowers fork
├── tsconfig.json # TypeScript 编译器配置
├── src/ # DSH Cordis插件源码
│ ├── index.ts # Cordis插件入口点：提供打包技能+安装DSH代理预设
│ └── dsh-types.d.ts # DSH 类型定义
├── .dsh-plugin/ # DeepSeek Harness 代理预设定义
│ ├──preset.yml # Web GUI预设显示元数据（“Maestro Skills”）
│ └── agent.cordis.yml # DSH Agent预设组成
├── .claude-plugin/ # Claude Code 插件清单
├── .codex-plugin/ # Codex CLI 插件清单
├── .agents/plugins/ # Codex 市场清单
│
└──技能/#共26个技能
    ├── 🧠 流程技能（从 obra/superpowers v6.3.0 分叉）
    │ ├── 头脑风暴/ # 带有批准门的苏格拉底式设计细化
    │ ├── 测试驱动开发/ # 红绿重构铁律
    │ ├── Systems-debugging/ # 4阶段根本原因过程
    │ ├── verify-before-completion/ # 成功声明前的证据
    │ ├── 写作计划/ + 执行计划/
    │ ├── 子代理驱动开发/ + 调度并行代理/
    │ ├── 请求/接收代码审查/
    │ ├── using-git-worktrees/ + 整理-a-development-branch/
    │ ├──writing-skills/ # 如何创作新技能
    │ └── using-superpowers/ # 技能系统介绍（+DSH工具图）
    │
    ├── 📦 核心标准和架构
    │ └── magento2-dev-core/ # Magento 2 核心指南（DI、存储库、安全）
    ├── 🛠️ 质量保证和审核
    │ ├── magento2-linter/ # PHPCS、PHPStan、PHPMD 质量检查
    │ ├── magento2-performance-audit/ # Web 生命体、基础设施和数据库分析
    │ ├── magento2-security-scan/ # 静态漏洞代码扫描
    │ └── magento2-code-review/ # PR/模块/主题/项目审核编排
    ├── 🎨 前端和后端框架
    │ ├── magento2-hyva-dev/ # Alpine.js、Tailwind CSS、CSP 支付页面
    │ ├── magento2-frontend-dev/ # Luma Knockout.js，LESS，RequireJS
    │ └── magento2-backend-dev/ # REST、GraphQL 解析器、Cron、队列
    └── 🔧 开发环境和 CLI 工具 (Govard

堆栈）
        ├── govard-toolbox/ # 基础容器编排工具箱
        ├── govard-magento/ # Magento 特定的开发环境命令
        ├── govard-laravel/ # Laravel 特定的开发环境命令
        └── review-in-worktree/ # 分离评审工作树中的 Govard 命令
````

## 🤖 技能兼容性矩阵

所有 26 项技能在每个列出的工具上的工作原理都是相同的。

### 组 · 技能 · Claude Code · Codex CLI · OpenCode · GitHub Copilot · DeepSeek Harness
- **组**：流程（超级能力分叉）· **技能**：集思广益、调度并行代理、执行计划、完成开发分支、接收代码审查、请求代码审查、子代理驱动开发、系统调试、测试驱动开发、使用 git 工作树、使用超级能力、完成前验证、编写计划、编写技能 · **Claude Code**： ✅ · **Codex CLI**： ✅ · **OpenCode**： ✅ · **GitHub 副驾驶**： ✅ · **DeepSeek Harness**： ✅
- **组**：核心和标准 · **技能**：[magento2-dev-core](skills/magento2-dev-core/SKILL.md) · **Claude Code**： ✅ · **Codex CLI**：✅ · **OpenCode**：✅ · **GitHub Copilot**：✅ · **DeepSeek Harness**：✅
- **组**：代码检查和审核 · **技能**：[magento2-linter](skills/magento2-linter/SKILL.md)、[magento2-performance-audit](skills/magento2-performance-audit/SKILL.md)、[magento2-security-scan](skills/magento2-security-scan/SKILL.md)、[magento2-code-review](skills/magento2-code-review/SKILL.md)] · **Claude Code**：✅ · **Codex CLI**：✅ · **OpenCode**：✅ · **GitHub 副驾驶**： ✅ · **DeepSeek Harness**： ✅
- **组**：框架 · **技能**：[magento2-hyva-dev](skills/magento2-hyva-dev/SKILL.md)、[magento2-frontend-dev](skills/magento2-frontend-dev/SKILL.md)、[magento2-backend-dev](skills/magento2-backend-dev/SKILL.md)] · **Claude Code**： ✅ · **Codex CLI**： ✅ · **OpenCode**： ✅ · **GitHub Copilot**： ✅ · **DeepSeek Harness**： ✅
- **组**：工具链 (Govard) · **技能**：[govard-toolbox](skills/govard-toolbox/SKILL.md)、[govard-magento](skills/govard-magento/SKILL.md)、[govard-laravel](skills/govard-laravel/SKILL.md)、[review-in-worktree](skills/review-in-worktree/SKILL.md)] · **Claude Code**： ✅ · **Codex CLI**： ✅ · **OpenCode**：✅ · **GitHub 副驾驶**： ✅ · **DeepSeek Harness**： ✅

## 💾 安装

### 1. DeepSeek Harness (DSH) — 作为插件（推荐）

一个命令就是完整安装 - 该插件本身提供所有 26 个打包技能**并**在启动时将 **“Maestro Skills”** 代理预设到 `~/.dsh/.agent-presets/maestro-skills/` 中：

```bash
dsh plugin --profile web add github:ddtcorex/maestro-skills
```

然后重新启动 `dsh web` 并在 Web GUI 代理选择器中选择 **Maestro Skills**。不需要 install.sh。

该软件包通过其 `prepare` 脚本在安装时自行构建。 pnpm ≥ 10 会阻止 git-dependency 构建脚本，直到您允许它们 - 如果第一个添加报告忽略构建，请将关键的 pnpm 打印复制到配置文件的 `pnpm-workspace.yaml` 中并重新运行：
```yaml
allowBuilds:
  '@ddtcorex/maestro-skills': true
```

要从手写补丁层引用插件，该行必须命名真实的包：
```yaml
- insert:
    - id: maestro-skills
      name: '@ddtcorex/maestro-skills'
```

替代方案：通过安装程序释放技能文件（无插件）

```bash
curl -fsSL https://raw.githubusercontent.com/ddtcorex/maestro-skills/master/install.sh | bash -s -- --target dsh
```
将所有技能链接到`~/.dsh/skills/`，并将代理预设复制到`~/.dsh/.agent-presets/maestro-skills/`。

### 2. Claude Code — 作为插件
```bash
/plugin marketplace add ddtcorex/maestro-skills
/plugin install maestro-skills@ddtcorex
```
更新：`/plugin marketplace update ddtcorex`。

### 3. Codex CLI — 作为插件
```bash
codex plugin marketplace add ddtcorex/maestro-skills
codex plugin add maestro-skills@ddtcorex
```
更新：`codex plugin marketplace upgrade ddtcorex`。

### 4. OpenCode & GitHub Copilot，或直接技能文件
```bash
curl -fsSL https://raw.githubusercontent.com/ddtcorex/maestro-skills/master/install.sh | bash
```

### 工具·扫描（项目范围）·扫描（个人范围）
- **工具**：Claude Code · **扫描（项目范围）**：`.claude/skills/` · **扫描（个人范围）**：`~/.claude/skills/`
- **工具**：DeepSeek Harness (DSH) · **扫描（项目范围）**：`.dsh/skills/` · **扫描（个人范围）**：`~/.dsh/skills/`
- **工具**：OpenCode · **扫描（项目范围）**：`.opencode/skills/` · **扫描（个人范围）**：`~/.config/opencode/skills/`
- **工具**：Codex CLI · **扫描（项目范围）**：`.agents/skills/` · **扫描（个人范围）