# dsh-plugin-background-tasks

> 让长命令不再卡死对话：短命令即时返回结果，长命令自动转入后台，跑完主动汇报——复刻 Google Antigravity 的 `run_command` 工作流体验。

## 简介

对话式开发里最影响手感的事，莫过于一条构建、训练或下载命令把整个会话挂住。本插件把 Antigravity 的「超时竞争」工作流带到 DeepSeek Harness：

1. **长命令异步化** — 命令先同步等待 10 秒：跑完直接给结果；没跑完就整体转入后台，对话立即释放，你继续干别的，互不打断。
2. **完成主动汇报** — 后台命令结束时自动推送结果摘要（退出码 + 输出尾部），零轮询、不用催。
3. **状态随时可查可控** — 每个后台任务有 ID；列表、读输出、终止都是现成工具，与宿主原生后台任务共用同一套界面。
4. **安全不越界** — 命令走宿主统一执行通道：会话沙箱策略与审批管线照常生效；万一被策略拦下，会明确告诉你如何合规重试。
5. **开箱即用** — 自带「后台任务模式」预设：新建会话选它即得单入口体验；Windows / Linux / macOS 全平台。

> 参数命名对齐 Antigravity 官方的 `run_command` 合约（`CommandLine` / `Cwd` / `WaitMsBeforeAsync`），模型侧习惯零成本迁移。

### 安全边界（必读）

- 命令经由 DSH 的 `ctx.shell` 执行器运行，**受会话沙箱模式约束**：confining executor 在位的部署中，越界文件操作以 `[sandbox: file access denied under <mode> mode]` 标记呈现（升级面在位的组合还会附带与原生 shell 工具逐字一致的同轮升级提示）；`danger-full-access` 会话不设限是该模式自身的语义，不是插件旁路。注意该词汇表约束的是**写效果**——读操作在任何模式下都不受限。
- 加宽请求走 `ctx.approval` 审批管线：审批禁用的会话中升级会被**自动拒绝**（fail-closed），不存在绕过路径。
- 后台任务按 owner 会话隔离：跨会话不可见、不可收集、不可杀；owner 销毁时任务被取消并等待结算。
- `ctx.jobs` 未组合时工具直接报错（fail loud）：每个 `run_command` 调用都必须保持可收集、可停止。

## 配置（Config）

可在 profile 的 `cordis.patch.yml` 或主配置中通过条目的 `config` 字段覆盖；非法类型在**加载时即抛错**（fail loud）。为保证树外 link/path 挂载时的最小运行时依赖，校验由插件内置安全实现。

### 字段 · 类型 · 默认值 · 说明
- **字段**: `waitMsBeforeAsync` · **类型**: int ≥ 0 · **默认值**: `10000` · **说明**: 同步等待毫秒数（对齐 Antigravity 10 秒标准）；设为 `0` 则直接后台启动

```yaml
# cordis.patch.yml 覆盖配置示例
- insert:
    - id: dsh-plugin-background-tasks
      name: dsh-plugin-background-tasks
      config:
        waitMsBeforeAsync: 10000   # 统一标准：10 秒
```

## 提供的工具 (Tools)

### `run_command`

通过挂载的 DSH shell 执行器运行系统命令（Windows 为 PowerShell 家族，Linux/macOS 为 bash）。

### 参数 · 类型 · 必填 · 默认值 · 描述
- **参数**: `command` · **类型**: `string` · **必填**: 是 · **默认值**: - · **描述**: 待执行的完整命令行字符串
- **参数**: `cwd` · **类型**: `string` · **必填**: 否 · **默认值**: 会话工作区 · **描述**: 命令执行的工作目录；相对路径按会话身份解析
- **参数**: `description` · **类型**: `string` · **必填**: 否 · **默认值**: - · **描述**: 任务简短说明（同时作为 job 列表标签）
- **参数**: `sandbox_permissions` · **类型**: `string` · **必填**: 否 · **默认值**: - · **描述**: 仅限对刚发生的沙箱拒绝做一次性同轮加宽重试；需配 `justification` 并经用户审批（仅 confining 组合广告此参数）
- **参数**: `justification` · **类型**: `string` · **必填**: 否 · **默认值**: - · **描述**: 与 `sandbox_permissions` 成对出现的给用户的一句话理由

> 同步等待窗口是**部署级配置**（`waitMsBeforeAsync`，默认 10 秒），模型侧没有时机参数——这是刻意设计：时机决策权属于操作者。窗口内完成则内联返回；超窗或调用中止自动转入后台，结果经完成通知送达。

- **同步完成**：返回退出码 + 合并输出（executor 负责输出预算与 spill 文件标注）；启动失败以 `killed` 结算并在 stderr 带错误，绝不悬挂。
- **转入后台**：返回 `[Command moved to background]` 与 `JobId`（`command-N`）；此后用原生 `job_*` 工具管控，完成通知由 jobs 消费面自动投递。

## 安装与注册方式

### 方式一：从 GitHub 安装（发布后的标准姿势）

```powershell
dsh plugin --profile web add github:yaopushen/dsh-plugin-background-tasks
```

编译产物 `lib/` 随库提交，GitHub 直装免构建。

### 方式二：本地开发挂载（link）

本插件遵循标准 DSH Bundle 规范，自带 `dsh.bundle` 补丁声明与随包预设：

```powershell
# 1. 注册安装到指定 profile（例如 web profile）
dsh plugin --profile web add "dsh-plugin-background-tasks@link:D:/DEEPSEEK/dsh-plugin-background-tasks" -w

# 2. 检查配置层生效状态（权威诊断，应显示 - id: dsh-plugin-background-tasks）
dsh --profile web --dump-config | Select-String background

# 3. 启动 DSH Web
dsh web
```

**组合前提**：profile 需组合 `ctx.shell` 执行器（缺省 fail loud）、`@deepseek-ai/dsh-jobs-local` + `@deepseek-ai/dsh-tool-jobs`（jobs 缺省时调用即报错）；confining executor 在位时需 `ctx.sandboxPolicy`（缺失则加载即抛错，与原生 shell 工具同一判据）。

**树外路径挂载的依赖解析**：插件以绝对路径挂载在宿主工作区之外时，Node 需要能从本目录解析 `@deepseek-ai/*` 运行时包。运行 `scripts/link-deps.ps1` 一次即可幂等建立指向 harness 工作区的 junction（要求 harness 已构建）。

### 零提示词的“无感化”使用体验（后台任务预设）

插件加载时会自动把 `preset/background-shell/` 释放到 `$DSH_HOME/.agent-presets/background-shell/`：
- 在 Web GUI 新建会话时，选择预设 **「后台任务模式」** 即可。
- 该预设继承标准编程模式的全部功能（文件读写、检索、工作流、计划等），唯一区别在于**移除了代理面的 pwsh/bash 解禁行**，模型在面对任何终端操作时将天然以 `run_command` 为唯一单入口，无需在系统提示词中增加说教规则。
- 注意：安装器幂等且**跳过已存在的目标目录**——更新随包预设后需手动同步 `$DSH_HOME` 下的副本（或删除该目录让安装器重建）。

## Model Experience

### `run_command` tool schema

#### What the model sees

The tool's name, description (with configured wait window), parameters (`command`, `cwd`, `wait_ms`, `description`, plus the escalation pair only when a confining executor is mounted), and the string output contract.

#### Token effect

Fixed while the plugin is mounted: one tool schema entry per prompt assembly.

#### KV Cache effect

Prefix-stable: schema text is identical across turns unless deployment overrides `waitMsBeforeAsync` or the composition's confinement changes which parameters are advertised.

### Dialect-guidance prompt section

#### What the model sees

A standing system-prompt section (`tool:run_command`) teaching the failure classes observed in the wild on bare compositions: verbatim script-fragment semantics (never whole-command quoting), SINGLE-quote wrapping for SSH remote arguments (bash-style `\"` nesting mangles silently), and byte-truth file comparison idioms using built-ins (`fc.exe /b`, `Get-FileHash`, CRLF counting) with Compare-Object's set-semantics caveat.

#### Token effect

Fixed while the plugin is mounted: roughly 100 tokens per prompt assembly.

#### KV Cache effect

Prefix-stable.

### Background completion notification

#### What the model sees

Delivered natively by the jobs consumer (`tool-jobs`), not by this plugin: an episodic user-role system message with job id, label, terminal status/detail, and the output tail capped by the registry.

#### Token effect

Conditional: proportional to the output tail, once per promoted job that finishes non-killed and unreported.

#### KV Cache effect

仅附加：每个通知作为普通用户角色消息进入会话日志，并且永远不会替换先前的内容。

## 已知限制和延期工作

- **促销在注册表预检之前预启动** — 实时进程竞赛本质上在 `jobs.start` 运行其预检之前启动；被拒绝的注册会终止部分启动，但该进程确实会在该失败窗口中短暂存在于注册表之外。
- **需要组合作业运行时** - 没有 `@deepseek-ai/dsh-jobs-local` (+ `tool-jobs`) 每个调用都会失败；不存在仅同步降级，因为超过其轮次的命令必须保持可收集状态。
- **等待窗口是部署固定的** — `waitMsBeforeAsync` 属于运营商所有；模型不能在每次调用时延长或跳过它（根据设计 - 计时决策导致模型阻塞自己的回合数分钟）。长时间运行的守护进程每次启动时都会为整个窗口付费一次；窗口内没有执行程序超时，因为释放路径是提升而不是终止。
- **限制完整性继承已安装的后端** - 执行质量（例如 Windows ACL 限制令牌运行程序）是执行者的合同，而不是此插件的合同。
- **预设安装程序会跳过现有目录** — 如果没有手动同步，打包的预设编辑不会传播到已安装的副本。
- **退出标准** — 该插件存在是因为本机 shell 工具缺乏自动升级语义。如果上游吸收了它们，这个插件的外壳面应该退休。

## 文档

- **发布面**：本README即发布文档，自行可用。
- **内部研发报告**（设计决策记录、验收报告、历史归档）与**版本史**：[`dev/`](dev/README.md)，不随npm包发布。

## 开源许可

麻省理工学院