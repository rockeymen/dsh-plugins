# dsh-legion：面向 DeepSeek Harness 的多智能体编排与 LLM 模型路由

[English](README.md) · **简体中文**

**dsh-legion** 是一个使用 TypeScript 开发的 [DeepSeek Harness（DSH）](https://github.com/deepseek-ai/deepseek-harness)多智能体编排插件。它能将单个 AI Coding Agent 转变为有边界的智能体团队：可配置的 AI Agent Profile、精确 LLM 模型路由、声明式 Team 与 Strategy、结构化结果，以及受控深度的 Subagent 委派——同时无需替代 DSH 运行时。

## TL;DR

- **它是什么。** 一个面向 DeepSeek Harness 的多智能体委派策略插件，而不是独立的智能体框架。
- **它带来什么。** 一个模型可见的 `legion` 工具，其选项是 `quick`、`deep`、`review` 这类语义化 Profile；每个 Profile 背后是部署者掌控的模型路由、Subagent 后端、Persona、工具过滤、深度与结果契约。
- **好处在哪。** 协调 Agent 选择的是意图而不是模型 ID；Prompt 永远无法放宽 Profile 背后的策略；把 `deep` 换成另一个模型，不需要改任何 Prompt。
- **成本多少。** 用户自有 Agent Preset 里的一行配置。不引入额外的 Scheduler、Session Store、数据库或 Agent 运行时。
- **适合谁。** 已经在运行 DSH、希望多智能体委派可审查、可复用的开发者与部署者。

> **重要：** Legion 是 DSH 插件，不是独立的智能体框架或应用。Agent、Session、模型适配器、Subagent 运行时、沙箱、审批机制和 Web GUI 均由兼容版本的 DeepSeek Harness 提供。

## 快速开始

~~~bash
# 1. 将插件安装到某个 DSH Host Profile（追加 #<commit-sha> 可锁定具体版本）
dsh plugin --profile web add github:wxxb789/dsh-legion

# 2. 把 Legion 配置行复制到用户自有的 Agent Preset，然后开启一个新 Session
#    模板：examples/legion.agent.cordis.fragment.yml

# 3. 在正式依赖它之前，先验证路由策略
dsh-legion doctor examples/legion.config.yml --providers examples/providers.fixture.yml
~~~

协调 Agent 随后只会看到一个 `legion` 工具，其 `profile` 取值就是你自己的语义化委派选项。详细步骤参见[安装](#安装)与[创建 Legion Agent Preset](#创建-legion-agent-preset)。

## 这个项目有什么用？

当一个 AI Coding Agent 需要按照明确、可复用的策略，把不同类型的工作委派给不同子智能体时，Legion 会很有用。

- **按任务类型路由。** 将提取、格式化和摘要交给快速模型，将架构设计、复杂调试交给能力更强的模型。
- **执行独立审查。** 为 Reviewer 配置只读工具、独立 Persona，以及结构化的 `review-v1` 结果。
- **构建多智能体流程。** 定义有边界的 Team，以及计划/执行/审查、研究 Fanout 等声明式 Strategy。
- **限制工作量与风险。** 限制深度、并发数、参与者、截止时间、输出大小、工具和可用路由。这些边界能够约束部分成本驱动因素，但 Legion 不提供总 Token 或费用准入上限。
- **统一委派语义。** 即使底层模型或 Subagent 后端发生变化，也能继续使用稳定的 Profile 名称。
- **运行前验证策略。** 使用显式 Provider 能力 Fixture 检查配置并解释最终生效的 Profile。
- **无需 Fork 即可扩展。** 通过 Catalog Layer 添加、替换、禁用或恢复 Profile、Team 和 Strategy。

Legion 面向已经使用 DSH、希望获得可配置多智能体委派能力，但不希望再引入另一套 Scheduler、Session Store 或 Agent Runtime 的开发者与部署者。

## dsh-legion 与独立多智能体框架对比

像 LangGraph、CrewAI 和 AutoGen 这类独立多智能体框架都自带运行时、状态模型和进程生命周期，因此采用它们等于在你已经在运行的 Coding Agent 旁再引入第二个编排器。Legion 则采取完全相反的做法：它完全不引入运行时，而是将委派策略编译为原生 DSH Subagent。

###  · dsh-legion · 独立智能体框架
- 你所采用的内容 · **dsh-legion**: 面向你已有 Agent 的委派策略 · **独立智能体框架**: 第二个运行时、状态模型与进程生命周期
- 谁掌控 Agent Loop · **dsh-legion**: DeepSeek Harness · **独立智能体框架**: 框架
- Session、沙箱、审批、模型适配器 · **dsh-legion**: 由 DSH 所有且保持不变 · **独立智能体框架**: 由框架所有，与你的 Agent 并行
- 模型选择 · **dsh-legion**: 每个 Profile 拥有有序的精确 Provider/Model 候选路由 · **独立智能体框架**: 通常在代码中按 Node 或按 Agent 绑定
- 采用成本 · **dsh-legion**: 用户自有 Preset 中的一行配置 · **独立智能体框架**: 新的依赖树、服务或进程
- Prompt 权限 · **dsh-legion**: Prompt 选择 Profile，但永远无法放宽该 Profile 的模型、工具、Persona 或深度 · **独立智能体框架**: 因框架而异
- 何时不适用 · **dsh-legion**: 你没有运行 DSH · **独立智能体框架**: 你需要一个单体自包含编排器

如果你没有运行 DeepSeek Harness，Legion 就不是合适的工具，独立框架会更适合。

## 主要能力

### 能力 · 说明
- **能力**: 语义化 Profile · **说明**: 使用 `quick`、`deep`、`review` 等命名策略，而不是在每次 Prompt 中选择原始模型。
- **能力**: 精确模型路由 · **说明**: 每个 Profile 最多配置 8 个有序 Provider/Model 候选，并支持静态上下文和输出预算约束。
- **能力**: 多种 Subagent 后端 · **说明**: 每个 Profile 可使用 `spawn`、`fork`、`codex`、`claude-code` 或其他 DSH Provider。
- **能力**: 工具与 Persona 策略 · **说明**: 限制子智能体工具、添加专属指令、控制深度及前台/后台默认行为。
- **能力**: 结构化结果 · **说明**: 支持版本化的 `text`、`findings-v1` 和 `review-v1` 前台结果契约。
- **能力**: 自定义 Team · **说明**: 声明引用现有 Profile 的有边界 Member Slot。
- **能力**: 声明式 Strategy · **说明**: 将类型化 Artifact Graph 编译为冻结的 DSH 委派原语。
- **能力**: 硬性执行限制 · **说明**: 限制每次 Team Run 的 Agent 数、并发数、截止时间和可接受输出大小。
- **能力**: Catalog 自定义 · **说明**: 分层添加、替换、禁用和恢复用户或第三方条目。
- **能力**: Prompt Fragment · **说明**: 从部署者控制的 Root 加载受约束、不可变的 UTF-8 Prompt 资源。
- **能力**: 可解释策略 · **说明**: 提供稳定 Digest、确定性诊断、路由证据和 JSON Explain 输出。
- **能力**: 运行时重配置 · **说明**: 可选：Host 挂载 Settings Provider 后，可通过 `legion` 命名空间修改同一份配置并即时重新发布，无需重启。参见[运行时重配置](docs/settings.md)。
- **能力**: Web 设置卡片 · **说明**: DSH「设置 → 插件」页中的插件卡片，支持暂存编辑与覆盖标记。参见[设置卡片](docs/settings-card.md)。
- **能力**: ACP 委派 · **说明**: 可选 Profile，通过 DSH 的 ACP 后端委派给 Codex、Claude Code、oh-my-pi、Kimi Code、Grok Build、Pi、GitHub Copilot CLI、Hermes 与 ZCode。参见 [ACP 委派](docs/acp-delegation.md)。
- **能力**: 原生 DSH 生命周期 · **说明**: Continuation、取消、结算通知、Provider 生命周期和 HMR 注册仍由 DSH 管理。

## 工作原理

~~~text
Catalog Layers
  ├─ Profiles   -> 模型路由、后端、Persona、工具、结果契约
  ├─ Teams      -> 引用 Profile 的有边界 Member Slot
  └─ Strategies -> 类型化 Artifact Graph + 硬性限制
                         │
                         ▼
                冻结的 DSH Primitive IR
                         │
                         ▼
                  原生 DSH Subagent
~~~

一个典型的模型侧 Profile 调用很简单：

~~~json
{
  "profile": "quick",
  "description": "summarize findings",
  "prompt": "Summarize the investigation and preserve source paths.",
  "run_in_background": true
}
~~~

协调 Agent 只选择语义化 Profile；Prompt 无法改变该 Profile 背后由部署者控制的模型、工具、Persona、深度或结果策略。

Legion 不接管 Agent Loop、Session、持久化、模型适配器、凭据、沙箱、审批、Subagent Registry 或 Web GUI。它只使用 DSH 的公开 `ctx.subagents`、`ctx.tools` 和 `ctx.systemPrompt` 接口，从而确保运行时和生命周期只有一个所有者。

### 底层机制：从工具调用到子智能体

**激活阶段**，即 DSH 在 Cordis Fiber 上挂载插件时：

1. Legion 用严格 Schema 校验配置，文档中任意位置出现未知字段都会被拒绝。
2. Catalog Layer 按顺序合并：后面的层按名称替换前面的条目，Tombstone 可禁用继承来的条目，而之后任何同名定义都会将其恢复。
3. Profile 引用的 Prompt Fragment 只读取一次，受每个 Profile 的字节预算约束，并以带内容 Digest 的不可变快照形式固定下来。
4. Legion 观察 Host 当前注册了哪些 Subagent 后端与哪些 LLM 适配器。
5. 每个 Profile 基于该观察结果编译；只有当其配置的后端确实能满足该 Profile 的策略——执行模式、工具过滤、Persona、深度与结构化输出——它才会成为**活跃 Profile**。
6. 委派工具随之发布，其参数 Schema 由活跃 Profile 推导而来，同时向 System Prompt 贡献一份对应的路由表。
7. 如果没有任何活跃 Profile，工具会被撤销，提示内容渲染为空。后端或适配器发生变化时，整个流程会重新执行。

**单次委派**，即从协调 Agent 发起工具调用到拿到结果之间：

8. 参数完成校验，并解析为**恰好一个** Profile：调用中指定的那个，或配置的 `defaultProfile`。
9. 如果该 Profile 声明了 `routes`，Legion 会读取每个候选的精确模型元数据，并选中你所写顺序中第一个不与静态事实冲突的候选。
10. 参与判断的只有静态事实，例如上下文窗口与输出预算。元数据读不到的候选仍然可选；只有当所有候选都被明确排除时，调用才会失败。
11. Legion 通过 Host 的 Subagent API **只启动一个**子智能体，并施加该 Profile 的固定策略；当该子智能体或其 Provider 失败时，绝不重试、也不切换路由。
12. 后台调用会立即返回可续接的子智能体 ID；前台调用则等待结果，按契约重新校验结构化结果，并重建为全新的纯数据后返回。

这套设计带来两个值得明说的性质。编译后的 Team / Strategy IR 是深度冻结且 detached 的：它不持有你配置对象的任何引用，也不携带函数。编译后的 Strategy Plan 还会按对象身份记录在进程级 Registry 中，因此执行阶段只接受由本进程编译出的 Plan——即便内容与 Digest 完全一致，重建或反序列化得到的副本同样会被拒绝。

## 安装

### 前置条件

- 已安装兼容版本的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)。
- `pnpm` 已加入 `PATH`；`dsh plugin` 会将包管理操作转发给 pnpm。
- 一个用于安装插件的 DSH Host Profile，例如默认的 `web`。
- 已配置至少一个 DSH Subagent Provider，以及 Legion Profile 所引用的 LLM Provider 和 Model。
- 本地开发需要 Node.js `^22.19.0 || >=24.0.0` 和 pnpm `11.21.0`。

### 从 GitHub 安装

把默认分支安装到 `web` Profile：

~~~bash
dsh plugin --profile web add github:wxxb789/dsh-legion
~~~

如果插件应安装到其他 DSH Host Profile，请替换 `web`。

该命令只在**安装那一刻**解析一次 `main`。`dsh plugin` 会把操作转发给 pnpm，由 pnpm 把解析出的 Commit 记录到 Host Profile 的 Lockfile 中；在你显式升级之前，已安装版本不会跟随后续提交漂移。

#### 锁定具体版本

Git 安装会在你的机器上执行 Legion 的 `prepare` 构建，且不在 Agent 运行的任何沙箱之内。当已安装代码需要可审计、可复现时——生产 Profile、共享机器，或需要审查「允许哪些代码执行构建」的部署——请追加不可变版本：

~~~bash
dsh plugin --profile web add github:wxxb789/dsh-legion#<commit-sha>
~~~

当前尚未发布 Release Tag。将来 [GitHub Releases](https://github.com/wxxb789/dsh-legion/releases) 出现正式版本后，对应 Tag 同样是不可变的安装版本。

Git 依赖会执行 Legion 的 `prepare` 构建。pnpm 10+ 可能会拒绝第一次安装，并要求显式允许构建。请把 pnpm 输出的**完整 Key**加入 `$DSH_HOME/profiles/web/pnpm-workspace.yaml`，然后重新执行安装：

~~~yaml
allowBuilds:
  dsh-legion: true
~~~

如果 pnpm 输出的是带来源限定的 Key，请原样使用，不要替换为短名称。

### 从本地源码安装

~~~bash
git clone https://github.com/wxxb789/dsh-legion.git
cd dsh-legion
pnpm install --frozen-lockfile
pnpm run build
dsh plugin --profile web add .
~~~

本地 Checkout 必须先生成 `lib/` 构建产物，而跳过构建的后果已经变了：Bundle Patch 使 `dsh-legion` 成为 Host Loader 条目，Host 的客户端模块注册表会扫描它，缺失 `lib/client.js` 不再只是没有卡片，而会让整个 Host 激活失败。安装本地 Checkout 前请先执行 `pnpm run build`。安装操作仍然不会向整个进程自动注入模型工具——委派工具留在 Agent 平面，由 Preset 显式声明。Bundle Patch 现在会挂载一行 Host 平面配置行（`id: legion-settings`，`role: settings`），使 `legion` 设置命名空间及其 Web 卡片归属于整个进程，而不再只在使用该 Preset 的 Session 存活期间存在。

## 创建 Legion Agent Preset

只安装 Package 还不够；还需要由 Agent Preset 加载 Legion。

### 推荐方式：扩展现有 Preset

1. 打开 DSH Web GUI。
2. 将 DSH 自带的 `standard` Preset 复制为用户自有的 `legion` Preset。
3. 把[示例 Fragment](examples/legion.agent.cordis.fragment.yml)中的 Legion 配置行追加到副本。
4. 根据实际部署调整 Provider 名称、Model ID、工具和限制。
5. 使用 `legion` Preset 创建一个**新 Session**。

不要直接修改 DSH 自带的 `standard` Preset。

### 备选方式：复制完整 Preset

将 [presets/legion](presets/legion) 复制到 `$DSH_HOME/.agent-presets/legion`。其中包含一组专注于编码工作的工具，以及 `deep`、`quick`、`review` 示例 Profile。

复制后的 Preset 是一个版本化模板，不会自动继承 DSH 或 Legion 的后续改动。已有内容的 Session 也不能切换已记录的 Preset，因此修改组合后需要创建新 Session。

## 升级

### 升级 GitHub 安装

分支安装可以通过 pnpm 的 Update 命令重新解析到当前 `main` 提交，DSH 会转发该命令：

~~~bash
dsh plugin --profile web update dsh-legion
~~~

锁定版本的安装按设计会停留在已记录的版本上。需要升级时，请添加新的精确版本；将来的 Release Tag 用法完全相同：

~~~bash
dsh plugin --profile web add github:wxxb789/dsh-legion#<new-commit-sha>
~~~

升级后请：

1. 阅读 [CHANGELOG.md](CHANGELOG.md)。
2. 将用户自有 Preset 与最新示例进行比较；Legion 不会自动覆盖 Preset。
3. 重启受影响的 DSH 进程；如果 Preset 组合发生变化，请创建新 Session。

### 升级本地源码

~~~bash
cd dsh-legion
git pull --ff-only
pnpm install --frozen-lockfile
pnpm run build
dsh plugin --profile web add .
~~~

## 卸载

需要从所有安装过 Legion 的 DSH Host Profile 中分别卸载：

1. 从用户自有 Agent Preset 中移除或禁用 `name: dsh-legion` 配置行。下一步删除 Package 时会一并移除贡献 `legion-settings` 配置行的 Bundle Layer；若该配置行是手工复制进已合成的 `cordis.yml` 的，需要自行在那里删除。
2. 删除已安装的 Package：

   ~~~bash
   dsh plugin --profile web remove dsh-legion
   ~~~

3. 如果不再需要，可删除 `$DSH_HOME/.agent-presets/legion` Preset 副本。
4. 重启受影响的 DSH 进程。

删除 Package 不会自动删除用户自有 Preset 或配置。

## 使用方式

### 通过 Profile 委派

协调 Agent 会看到一个 `legion` 工具以及当前可用 Profile 的描述：

~~~json
{
  "profile": "review",
  "description": "review the authentication change",
  "prompt": "Inspect the diff for correctness and security issues. Cite files and lines.",
  "run_in_background": false
}
~~~

如果配置了 `defaultProfile`，调用时可以省略 `profile`。并行的同级调用使用 DSH 原生并行工具执行能力。

### 运行 Strategy

Strategy 默认不会暴露给模型。部署者必须显式设置 `enableStrategies: true`，同一个工具才会接受严格的 Strategy 请求：

~~~json
{
  "kind": "strategy",
  "strategy": "independent-review",
  "objective": "Review the implementation and return evidence-backed findings.",
  "limits": { "deadlineMs": 60000 }
}
~~~

一个请求不能混用 Profile 和 Strategy 字段；调用级限制只能收紧编译后的 Strategy 限制。

## 配置参考

最小 Agent Preset 配置如下：

~~~yaml
- id: tool-legion
  name: dsh-legion
  config:
    configVersion: 2
    toolName: legion
    defaultProfile: quick
    profiles:
      quick:
        description: Fast exploration, extraction, and summaries.
        subagentProvider: spawn
        agentOptions:
          provider: your-llm-provider
          model: your-fast-model
          maxTokens: 8192
        maxDepth: 2
        defaultRunInBackground: true

      review:
        description: Independent correctness and security review.
        subagentProvider: spawn
        agentOptions:
          provider: your-llm-provider
          model: your-review-model
        toolFilter:
          deny: [write, edit]
        maxDepth: 2
        defaultRunInBackground: false
        result: review-v1
~~~

请使用当前部署中真实有效的 Provider 和 Model ID。更多内容参见[完整 Preset Fragment](examples/legion.agent.cordis.fragment.yml)与[独立配置示例](examples/legion.config.yml)。

当 Host 挂载了 Settings Provider 时（DSH 0.1.0-rc.7 起会服务每一个已注册的命名空间），`legion` 设置命名空间由 Bundle Patch 安装的 Host 平面配置行持有，并发布同一份 Schema。上面的 Preset 行仍是它自身委派能力的 base 层：它会把用户层保存的 Section 叠加在自己的 Entry 之上，提交后即时重新发布该工具，无需重启 DSH。没有 Settings Provider 的组合则行为不变。参见[运行时重配置](docs/settings.md)与[设置卡片](docs/settings-card.md)。

若要委派给外部编码 Agent（Codex、Claude Code、Kimi Code、GitHub Copilot CLI 等），为每个 Agent 挂载一次 DSH 的 ACP 后端，并追加生成好的 Catalog Layer。参见 [ACP 委派](docs/acp-delegation.md)与 `examples/legion.acp.fragment.yml`。

### 顶层字段

### 字段 · 默认值 · 含义
- **字段**: `role` · **默认值**: `delegation` · **含义**: 该配置行的组合角色，只从配置行自身的 Entry 读取，绝不取自设置层。`settings` 行只注册 `legion` 命名空间，不提供其他任何内容——没有工具、没有 Prompt Section、没有 Projection、没有 Service。
- **字段**: `configVersion` · **默认值**: `2` · **含义**: 当前配置契约。省略该字段或写 `1` 都会被接受并归一化为 `2`；但 v1 文档一旦使用 `catalogLayers`、`teams`、`strategies`、`enableStrategies` 或 Durable Run，会在激活时被拒绝，而不是自动升级。
- **字段**: `toolName` · **默认值**: `legion` · **含义**: 暴露给模型的工具名称。
- **字段**: `profiles` · **默认值**: 必填 · **含义**: 语义化 Profile Map。
- **字段**: `defaultProfile` · **默认值**: 无 · **含义**: 调用未指定 `profile` 时使用的 Profile。
- **字段**: `enableRunInBackground` · **默认值**: `true` · **含义**: 是否暴露后台委派。
- **字段**: `enableStrategies` · **默认值**: `false` · **含义**: 是否显式向模型暴露生效的 Strategy。
- **字段**: `guidance` · **默认值**: 无 · **含义**: 追加给协调 Agent 的说明。
- **字段**: `resourceRoots` · **默认值**: `{}` · **含义**: Prompt Fragment 的部署者相对 Root。
- **字段**: `maxResourceBytes` · **默认值**: `65536` · **含义**: 每个 Profile 的 Fragment 字节预算，硬上限为 4 MiB。
- **字段**: `catalogLayers` · **默认值**: `[]` · **含义**: 有序第三方或项目策略层。
- **字段**: `teams` · **默认值**: `{}` · **含义**: 最终部署层的 Team。
- **字段**: `strategies` · **默认值**: `{}` · **含义**: 最终部署层的 Strategy。

Profile 名称必须匹配 `^[a-z][a-z0-9-]*$`。

### Profile 字段

### 字段 · 默认值 · 含义
- **字段**: `description` · **默认值**: 必填 · **含义**: 向协调 Agent 展示的任务适用说明。
- **字段**: `subagentProvider` · **默认值**: `spawn` · **含义**: DSH Subagent 后端，不是 LLM Provider。
- **字段**: `agentOptions` · **默认值**: 继承 · **含义**: 固定的 `provider`、`model`、`maxTokens`；不能与 `routes` 同时使用。
- **字段**: `routes` · **默认值**: 无 · **含义**: 最多 8 个有序精确 Route Candidate。
- **字段**: `persona` · **默认值**: 继承 · **含义**: 子智能体 Persona/System Policy 覆盖。
- **字段**: `toolFilter.allow` / `deny` · **默认值**: 无 · **含义**: 子智能体工具可见性限制。
- **字段**: `maxDepth` · **默认值**: `3` · **含义**: 子智能体深度；外部 One-shot 产品可使用 `provider-managed`。
- **字段**: `defaultRunInBackground` · **默认值**: `true` · **含义**: 默认启动可继续交互的后台子智能体。
- **字段**: `result` · **默认值**: `text` · **含义**: `text`、`findings-v1` 或 `review-v1`。
- **字段**: `promptFiles` · **默认值**: 无 · **含义**: 验证后按顺序加载的 Prompt Fragment。

对于 `codex`、`claude-code` 这类外部产品，Model 选择由产品自身管理，通常应设置 `maxDepth: provider-managed` 和 `defaultRunInBackground: false`。

如果目标 Agent 支持 Agent Client Protocol，更推荐走 DSH 的通用 ACP 后端：Legion 会按上述约束自动生成 Profile 与挂载行，无需手写。参见 [ACP 委派](docs/acp-delegation.md)与 `examples/legion.acp.fragment.yml`。

### 精确 Route Candidate

~~~yaml
routes:
  - id: primary
    provider: your-llm-provider
    model: your-deep-model
    maxTokens: 16384
    constraints:
      minContextTokens: 65536
      minEffectiveOutputTokens: 8192
  - id: fast-static
    provider: your-llm-provider
    model: your-fast-model
    constraints:
      minContextTokens: 32768
~~~

在启动子智能体前，Legion 会观察已注册的 DSH Adapter 和精确 Model Metadata，并选择第一个没有已知静态冲突的候选。缺失的 Metadata 会保持为 Unknown 且仍可接受，Legion 不会将信息缺失误报为健康状态。

Legion 最多启动一个子智能体；如果已选子智能体因 Provider、认证、Quota、网络或执行错误而失败，不会自动重试其他 Route。

### Catalog Layer、Team 与 Strategy

Config v2 可以对 Profile、Team、Strategy 进行分层。后出现的同名定义会替换前者；Tombstone 可以禁用条目；更后面的定义可以重新启用它。Root Map 是最终部署层。

~~~yaml
configVersion: 2
teams:
  coding:
    description: One executor and one reviewer.
    members:
      executor: { profile: deep }
      reviewer: { profile: review }
strategies:
  reviewed:
    description: Execute and review.
    team: coding
    stages:
      - kind: delegate
        id: execute
        member: executor
        inputs: [{ artifact: objective, contract: objective-v1 }]
        output: { artifact: execution, contract: text }
        prompt: Execute and return evidence.
      - kind: delegate
        id: review
        member: reviewer
        inputs: [{ artifact: execution, contract: text }]
        output: { artifact: review, contract: review-v1 }
        prompt: Review the evidence independently.
    completion: { artifact: review, contract: review-v1 }
    limits:
      maxAgents: 2
      maxConcurrent: 1
      deadlineMs: 900000
      maxOutputBytes: 524288
    memberFailure: fail
~~~

Legion 会验证 Artifact Graph，并将合法 Stage 降低为分离、深度冻结的 DSH Primitive IR。它是 DSH One-shot Subagent 的适配器，不是持久化 Scheduler。Default Catalog 以普通可替换数据提供 `independent-review`、`research-panel` 和 `plan-execute-review`，但默认不会暴露给模型。

确定性协议 Gate 和独立的真实模型证据要求参见 [benchmarks/README.md](benchmarks/README.md)。

### Prompt Fragment、结构化结果与信任边界

Prompt Fragment 是显式部署资源，不是任意 Workspace 文件读取。Legion 将相对路径限制在配置的 Root 下，并拒绝链接、非法 UTF-8、NUL、缺失文件和超出字节预算的内容。修改资源后需要重新激活 Plugin 或 Preset。

结构化前台结果契约有意保持精简：

- `findings-v1`：摘要、有证据的发现、决策、验证和未解决风险；
- `review-v1`：结论、带严重级别的发现、建议和验证；
- 后台 Continuation 保持文本与 Session 语义。

Preset、Catalog Layer、Plugin Package、Resource Root 和 Prompt Fragment 都属于受信的部署配置。Tool Filter 与路径约束用于受信部署中的策略和完整性控制，**不是**隔离恶意 Preset 或不可信 Plugin 的安全沙箱。参见 [SECURITY.md](SECURITY.md)。

### Tool Presentation（Code Mode / PTC 模式）

**随包发布的 Preset 运行在 Code Mode。** 模型看到的是全部工具 Schema（`native`）、只有 `run_code` 加一份生成的 TypeScript SDK（`code`——Web 客户端将其标注为 **PTC 模式**），还是两者兼有，由官方 `@deepseek-ai/dsh-agent-tool-presentation` 行决定，未声明时回落到部署的 `dsh-tools` 默认值。协调编排正是 Code Mode 最擅长的工作：一段 `run_code` 程序可以同时发起多个委派、把它们当作值来等待、并在不为每个子 Agent 各走一次模型往返的前提下归并结果——Legion 注入的那句 guidance（"start independent delegations together"）在 `native` 下只是建议，在这里就是一个普通的 `Promise.all`。

Legion 是通过**组合那一行**来选择它的，而不是重新实现，自身源码不持有该机制的任何部分——因此它始终运行当前的官方 Code Mode，没有任何版本可以 pin 住或落后。这里刻意不提供 Legion 配置项：插件级开关会与官方行争夺同一个决定。

被委派的子 Agent 继承同一 Presentation。`dsh-agent-presets` 会把子 Agent 的 Scope 重新挂到父 Agent 所在 Preset 的 standing scope 上，注册表沿这条链解析模式——所以 PTC 模式协调者的子 Agent 自身也在 PTC 模式，SDK 段按该子 Agent 自己的可见工具重新生成。

Profile 的 `toolFilter` 在 Code Mode 下含义不变。SDK binding table 由调用方 Agent 的**可见**集合构建，因此被拒绝的能力不会出现在生成的 SDK 中，从 `run_code` 内部按名调用它仍然解析为 `UNKNOWN_TOOL`：`review` Profile 对 `write`/`edit` 的拒绝在两种 Presentation 下都成立。有两条边界属于 Host 的设计而非 Legion——`run_code` 本身永远不能被拒绝，且 Filter 只约束子 Agent**继承**到的表面，不约束该子 Agent 自身 Scope 注册的工具（它的 report 与结构化输出工具）。

你走哪条安装路径，决定这一行放在哪里。随包 Preset（[`presets/legion`](presets/legion)）拥有完整 composition，因此携带该行。追加式 Fragment（[`examples/legion.agent.cordis.fragment.yml`](examples/legion.agent.cordis.fragment.yml)）不携带，因为一个 composition 只选择一种 Presentation，第二次声明会被拒绝而非合并——把它追加到官方 `code` Preset 就得到 PTC 模式，追加到 `standard` 就是 `native`，Legion 两者都跟随。

该行会等待宿主的 `codeRuntime` 而非假定其存在，因此未组装 TypeScript 运行时的部署会在**挂载时**失败并指名该行，而不是等到第一次请求。这应当读作*去装运行时*，而不是*把 Code Mode 关掉*：Legion 是面向开发的协调者，这正是它为之设计的模式。运行时属于 host plane——Preset 只能选择 Presentation，永远无法自带运行时——所以修复位置在你的 **Host** composition（`cordis.yml`）：

~~~yaml
- id: code-runtime
  name: '@deepseek