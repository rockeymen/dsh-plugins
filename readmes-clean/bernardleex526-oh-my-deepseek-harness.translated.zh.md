# oh_my_deepseek_harness

> DeepSeek Harness 多智能体编排模式 — 灵感来自 [oh-my-opencode-slim](https://github.com/alvinunreal/oh-my-opencode-slim)

以 **Orchestrator** 为控制平面，调度 **Explorer / Librarian / Observer /
Oracle / Designer / Fixer** 六个职责严格隔离的专职子代理，在 DeepSeek
Harness 中实现“调查 → 判断 → 执行 → 验证”的完整工作流。

本插件是一个 **DSH agent preset（可切换的模式）**：安装后可在 Web 界面
的 Agent preset 选择器中与 `standard`（标准模式）、`code`、`minimal`、
`cordis` 并列选择，随时切换，互不影响。

## 更新记录（简要）

> 详细变更见 [CHANGELOG.md](CHANGELOG.md)。自 `6a252cd` 起共四轮更新：

- **v0.1.4（2026-08-16）** — 融合 dsh-anchored-standard 的**锚定首请求**：
  新会话首个模型请求仅暴露控制平面工具，首个信号后自动晋升完整委派面；
  `$DSH_ORCHESTRATION_BOOTSTRAP` 可关闭/自定义。
- **v0.1.3（2026-08-16）** — 完成门禁 + 审查闭环 + pytest 分层减量 +
  `broker_route` 路由工具：任务状态自动派生
  （PLANNED → RUNNING → IMPLEMENTED → VERIFIED → COMPLETE），Oracle 复审
  BLOCKED 机械阻断该任务后续委派；测试 receipt 支持
  `[risk=R0-R3,exit,counts,fail]` 注解、同 fingerprint 重复验证机械标记、
  每任务 receipt 预算；Fixer 内置 R0-R3 风险分层 / 变更测试选择 / 失败分类
  规则，Observer 不再重跑 Fixer 已验命令。
- **v0.1.2（2026-08-16）** — P1/P2：ArtifactStore 持久化（结果/状态落盘，
  崩溃恢复与任务 replay）、workspace fingerprint、测试 receipt 提取与去重
  查询、自定义角色注册（`roles.json`）、预算环境变量配置、
  `npm run status` / `npm run metrics` CLI。
- **v0.1.1（2026-08-15）** — 机械编排运行时（OrchestrationBroker）：单写者
  锁改为 workspace 粒度并修复 ask 审批洞、TASK_ID 协议、每任务预算机械
  强制、envelope 结果门禁（坏信封被 block）、`broker_status` 报告工具；
  构建/安装适配（YAML 安全、force 整目录替换）。

## 灵感来源

本项目是对 [oh-my-opencode-slim](https://github.com/alvinunreal/oh-my-opencode-slim)
（opencode 平台的精简多智能体套件）在 DeepSeek Harness 上的移植与适配。

### 概念 · oh-my-opencode-slim（opencode） · 本项目（DeepSeek Harness）
- **概念**: 模式/Agent 定义 · **oh-my-opencode-slim（opencode）**: `opencode.json` + markdown 模式文件 · **本项目（DeepSeek Harness）**: `agent.cordis.yml` 组合文件 + `prompts/*.md`
- **概念**: 子代理 · **oh-my-opencode-slim（opencode）**: 内置 `task` 工具 + 模式切换 · **本项目（DeepSeek Harness）**: `@deepseek-ai/dsh-tool-subagent` 委派工具 × 6
- **概念**: 权限隔离 · **oh-my-opencode-slim（opencode）**: 每模式 `allow`/`deny` 工具列表 · **本项目（DeepSeek Harness）**: 每子代理 `toolFilter` → 编译为 `tools.restrict()`
- **概念**: 委托深度限制 · **oh-my-opencode-slim（opencode）**: 角色内配置 · **本项目（DeepSeek Harness）**: 宿主 `maxDepth` 机制
- **概念**: 模型混用 · **oh-my-opencode-slim（opencode）**: 每 Agent 指定 model · **本项目（DeepSeek Harness）**: `agentOptions`（provider/model/maxTokens）
- **概念**: 宿主 · **oh-my-opencode-slim（opencode）**: opencode · **本项目（DeepSeek Harness）**: DeepSeek Harness（零侵入，纯增量 preset）

设计文档中的角色分工（Orchestrator 路由、信息生产者/决策者/执行者分离、
envelope 返回协议）均与 oh-my-opencode-slim 一脉相承，并利用 DSH 的
原生能力做了机械化的权限强制。

## 特性

- 🎛️ **Orchestrator 控制平面**：理解目标、拆解任务、路由调度、整合结果、向用户汇报
- 🔍 **Explorer**：仓库静态事实（文件、符号、调用链、结构、已有模式）
- 📚 **Librarian**：外部知识（官方文档、第三方库、API、版本、标准）
- 👀 **Observer**：运行事实（测试输出、日志、截图、UI、复现）
- 🧠 **Oracle**：深度技术推理（根因、架构权衡、并发、安全、性能）
- 🎨 **Designer**：视觉/交互判断（UI/UX、布局、可访问性、规范输出）
- 🔧 **Fixer**：执行修改（唯一拥有 write/edit 的代理）
- 🛡️ **权限隔离**：工具面由 `toolFilter` 机械强制，非仅提示词约束。**只有 Fixer 拥有 write/edit 工具**；Explorer 与 Observer 仍保留可执行 shell（`bash`/`pwsh`），因为 DSH 权限层**无法表达只读 shell**——它们“只读”完全依赖 prompt 纪律，并非权限层强制。所以不要用无条件的“只有 Fixer 能修改”来描述：可执行 shell 的代理在技术上仍可经 shell 写文件，只是被 prompt 禁止
- 🚫 **禁止代理图**：`maxDepth: 1` + 过滤器双重保证 specialist 无法再生成代理
- ⚙️ **模型混用**：每个 specialist 可独立配置 provider / model / maxTokens
- 🔌 **零侵入**：不修改宿主任何文件，卸载即删目录
- 🧮 **机械编排运行时（OrchestrationBroker）**：workspace 粒度单写者锁（审批期间保持）、每 TASK_ID 预算（12 委派 / 3 尝试 / 3 连续失败硬停）、envelope 结果门禁（坏信封被 block）、`broker_status` 只读报告——全部在真实工具链上机械强制
- ✅ **完成门禁 + 审查闭环**：broker 按记录自动派生任务状态 `PLANNED → RUNNING → IMPLEMENTED → VERIFIED → COMPLETE`；完成前必须 Fixer SUCCESS + Observer SUCCESS +（咨询过 Oracle 时）Oracle SUCCESS；**Oracle 复审 BLOCKED 会机械阻断该 TASK_ID 的全部后续委派**
- 🧭 **`broker_route` 路由工具**：Orchestrator 可随时把子问题文本交给与提示词同源的评分模型，拿到建议角色与候选（advisory，不强制）
- ⚓ **锚定首请求（anchored bootstrap）**：融合 [dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard) 的机制——新会话的**第一个模型请求只暴露控制平面工具**（read/grep/glob/ask/todo/broker_*，8 个），首个回复或首次工具调用后自动晋升完整 16 工具面（含全部委派工具），首轮成为干净的"理解任务"回合；恢复会话与 one-shot 子代理恒不锚定。`$DSH_ORCHESTRATION_BOOTSTRAP=0` 关闭，JSON 数组自定义
- 🧾 **测试 receipt 分层与去重**：VERIFICATION/OBSERVED 支持 `[risk=R0-R3,exit,counts,fail]` 注解；Fixer/Observer 先查 `broker_status` 避免重跑相同命令；**同 fingerprint 的重复验证被机械标记**；每任务报告式 receipt 预算（默认 12 条）；风险分层/变更测试选择/失败分类规则内嵌 Fixer prompt
- 💾 **持久化（可选）**：设置 `$DSH_ORCHESTRATION_HOME` 后，每次委派的结果全文与解析元数据、会话状态（预算/结果/receipts/fingerprint/任务状态）自动落盘——支持崩溃恢复、任务 replay 与质量统计
- 🧩 **自定义角色（本地构建）**：`roles.json` 声明新 specialist，`npm run build:local` 合并为额外的委派工具，隔离保证与内置六角色一致
- 📊 **状态/指标 CLI**：`npm run status` / `npm run metrics` 从存储渲染运行状态（含任务状态与 receipt 分层）与历史质量指标
- 🎛️ **多模型子代理**：每个 specialist（含自定义角色）可经 `model-routing.json` 独立配置 provider / model / maxTokens——Explorer 用轻量快模型、Oracle/Fixer 用强模型，互不影响

## 快速开始

### 环境要求

- DeepSeek Harness（Web 界面，默认 http://127.0.0.1:3080）
- Node.js ≥ 22（仅构建/安装脚本需要，运行时不需要）

### 安装

**方式一：直接使用已构建的 preset（推荐，无需构建）**

```powershell
# 把 preset 目录复制到 DSH 用户目录
$dsHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { "$env:USERPROFILE\.dsh" }
Copy-Item -Recurse .\preset\orchestrator "$dsHome\.agent-presets\orchestrator"
```

**方式二：通过脚本安装（自动构建 + 复制）**

```powershell
node scripts/build.mjs        # 从 src/ + prompts/ 生成 preset/orchestrator/
node scripts/install.mjs      # 复制到 $DSH_HOME/.agent-presets/orchestrator/
```

**方式三：npm 包（需先将包发布到 npm registry 后方可使用）**

```bash
npm pack dsh-multi-agent-orchestrator   # 或 clone 仓库
tar -xzf dsh-multi-agent-orchestrator-*.tgz
node package/scripts/install.mjs
```

### 启用与切换（Web 界面）

安装后无需重启，Web 界面实时读取 `$DSH_HOME/.agent-presets/`。两种启用路径：

1. **按会话启用**：打开“新会话”界面（composer 上方），在 **Agent preset**
   选择 chip（位于 workspace 选择旁边）中点击，选择 **多智能体编排**，
   然后开始会话。该选择只影响这一个会话。
2. **设为默认**：设置（Settings）→ General → **Agent preset** → 选择
   **多智能体编排** → 点击 **Set as default**。之后新建的会话默认使用该模式。

切换回标准模式：同样路径选择 **标准模式（standard）** 即可。

> **注意**：preset 在会话创建时固定。已产生内容的会话不能中途切换 preset
> （工具目录会与历史日志不一致）；空白会话可在创建后、首次输入前切换。

### 卸载

```powershell
$dsHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { "$env:USERPROFILE\.dsh" }
Remove-Item -Recurse "$dsHome\.agent-presets\orchestrator"
```

删除目录即完成卸载，宿主恢复原样，不影响任何其他模式。

### 验证安装

```powershell
node scripts/validate.mjs     # 真实 loader 方言解析 + 行名解析 + 过滤器校验
node --test tests/            # 测试套件（含真实挂载集成测试）
node scripts/smoke-mount.mjs  # 真实启动 harness 并挂载 preset 的集成验证
```

## 详细使用说明

### 1. 工作流

Orchestrator 强制执行：

```
facts before decisions
decisions before actions
actions before verification
verification before completion
```

1. **理解** — 复述目标，仅对用户拥有的选择提问
2. **调查** — 并行委派 Explorer / Librarian / Observer
3. **决策** — 根因/设计复杂时，先把证据交给 Oracle（技术）或 Designer（视觉）
4. **执行** — 目标明确后委派 Fixer（携带问题、文件、根因、期望行为、约束、验收标准、验证步骤）
5. **验证** — Fixer 完成后由 Observer 或测试确认
6. **汇报** — 总结发现、变更、验证、不确定性、下一步

### 2. 委派协议（envelope）

每个 specialist 返回统一信封：

```text
STATUS: SUCCESS | PARTIAL | BLOCKED | NOT_APPLICABLE
SUMMARY:
FINDINGS:
EVIDENCE:
UNCERTAINTIES:
RECOMMENDED_NEXT_STEP:
```

- **Fixer** 追加 `CHANGES:` / `VERIFICATION:`
- **Observer** 追加 `OBSERVED:` / `EXPECTED:` / `DIFFERENCE:`
- **Designer** 输出可交给 Fixer 的 `SPECIFICATION:`（组件、当前问题、期望
  行为、布局、间距、排版、响应式规则、交互、无障碍、验收标准）
- 信息不足返回 `UNKNOWN`/`BLOCKED`，禁止编造；Fixer 发现根因与输入不符时
  停止扩大修改并以 `STATUS: BLOCKED` 返回，附 `REASON:` 字段说明为何被阻塞

### 3. 权限矩阵

每个代理的工具面（allow 列表；未列出的一律不可见）：

### Agent · Read · Search · Web · Shell · Edit · Jobs · Ask user
- **Agent**: Orchestrator · **Read**: read, read_image · **Search**: grep, glob · **Web**: web_search · **Shell**: — · **Edit**: — · **Jobs**: — · **Ask user**: ask_user_question
- **Agent**: Explorer · **Read**: read, read_image · **Search**: grep, glob · **Web**: — · **Shell**: bash/pwsh\* · **Edit**: — · **Jobs**: — · **Ask user**: —
- **Agent**: Librarian · **Read**: — · **Search**: — · **Web**: web_search · **Shell**: — · **Edit**: — · **Jobs**: — · **Ask user**: —
- **Agent**: Observer · **Read**: read, read_image · **Search**: grep, glob · **Web**: web_search · **Shell**: bash/pwsh\* · **Edit**: — · **Jobs**: job_\* · **Ask user**: —
- **Agent**: Oracle · **Read**: read, read_image · **Search**: grep, glob · **Web**: web_search · **Shell**: — · **Edit**: — · **Jobs**: — · **Ask user**: —
- **Agent**: Designer · **Read**: read, read_image · **Search**: grep, glob · **Web**: web_search · **Shell**: — · **Edit**: — · **Jobs**: — · **Ask user**: —
- **Agent**: Fixer · **Read**: read, read_image · **Search**: grep, glob · **Web**: web_search · **Shell**: bash/pwsh · **Edit**: **write, edit** · **Jobs**: job_\* · **Ask user**: —

\* Explorer 与 Observer 的 shell 是“只读纪律”：DSH 无法在权限层表达只读
shell（属已知限制），它们的 prompt 硬性限制为非变更/观测命令；可变更工具
（write/edit）在权限层被移除。Designer 与 Oracle 无 shell。

要点：

- 只有 **Fixer** 拥有 write/edit 工具；Explorer 与 Observer 拥有 shell，但
  仅凭 prompt 纪律保持只读（DSH 权限层无法表达只读 shell，属已知限制）；
  只有 **Orchestrator** 拥有 `subagent_*` 委派工具与 `ask_user_question`
- 边界安装失败时 **fail-closed**：`agent/created` 监听内同步 throw 会否决
  该代理发布——工具注册表不可用时拒绝创建根代理，绝不 fail-open 运行
- 所有过滤器均为 **allow 白名单**（deny-by-default）
- `bash` 仅在非 Windows 注册、`pwsh` 仅在 Windows 注册；含 shell 的过滤器
  生成 `!!js process.platform === 'win32' ? [...] : [...]` 表达式，由 loader
  激活时求值，避免 `tools.restric