◯ ─────────── ◯
  
  ![Ouroboros](./docs/images/ouroboros.png)
  
  O U R O B O R O S
  
  ◯ ─────────── ◯
  

  让 Agent 自己变聪明，边界由我们来划定。
  
  <sub>不用手写 prompt，它跑起来、失败、一代比一代聪明。评分命令和期望结果不会进入我们交给它的成功契约。</sub>
  
  <sub>面向可重放 AI 编码工作流的 Agent OS</sub>

```bash
curl -fsSL https://raw.githubusercontent.com/Q00/ouroboros/main/scripts/install.sh | OUROBOROS_INSTALL_REF=readme-hero-zh bash
```

<sub>一行命令完成安装。然后在你的编码 agent 里运行一次 `ooo setup`，详见[快速开始](#快速开始)。</sub>

<sub>四次各自独立的运行，四个宿主。任务不同是故意的——共享的是引擎，不是提示词</sub>

![Terminal recording of the ouroboros CLI interview reporting an ambiguity score](./docs/images/ooo-interview.gif)<sub>终端 CLI — 待办管理 CLI 任务，`ouroboros init start` 追问顺序与范围，然后报出模糊度分数</sub>
![Screen recording of the ChatGPT app calling Ouroboros as an integration](./docs/images/host-codex.gif)<sub>ChatGPT (Codex) — 视频发布流水线任务，作为 integration 被调用：提问、顾问轨、模糊度台账都在同一屏</sub>

![Screen recording of Claude Code running six Ouroboros interview advisory lanes in parallel](./docs/images/host-claude.gif)<sub>Claude Code — YouTube 自动化任务，六条顾问轨并行跑完，访谈才提交结果</sub>
![Screen recording of a Discord bot running the Ouroboros interview and reporting a final ambiguity of 0.15](./docs/images/host-hermes.gif)<sub>Hermes (Discord) — 卡丁车游戏任务跑在聊天机器人里，收在 `Final ambiguity: 0.15`</sub>

**把一个模糊的想法，跨 Claude Code、Codex CLI、OpenCode、Hermes、Gemini、Kiro、Copilot、Pi、Zcode、Goose、GJC、Antigravity 和 Grok，变成一份经过验证、可运行的代码库。**

Ouroboros 是面向 AI 编码的 Agent OS：一层本地优先的运行时，把非确定性的 agent 工作转换成一份可重放、可观测、受策略约束的执行契约。它用一套结构化的、规约优先的工作流取代东拼西凑的 prompt：访谈、定型、执行、评估、演化。

## Ouroboros Agent OS 技术栈

和任何操作系统一样，Ouroboros 分成三层：一层稳定的、提供原语的 **OS 层**，一层承载领域工作流的**应用层**，还有一个人真正坐在前面的 **shell**。三个仓库，一个技术栈：

### 层级 · 仓库 · 职责 · 你得到什么
- **层级**: **Shell**（终端客户端） · **仓库**: [`Ouro-labs/ourocode`](https://github.com/Ouro-labs/ourocode) · **职责**: 原生终端 UI，在一个会话里跨 Claude / Codex / Gemini CLI 运行 `ooo` 工作流 · **你得到什么**: TUI、wonderTool 决策选择器、MCP 面板状态、命令发现
- **层级**: **Apps**（领域工作流） · **仓库**: [`Ouro-labs/ouroboros-plugins`](https://github.com/Ouro-labs/ouroboros-plugins) · **职责**: UserLevel 插件契约 —— 把核心原语组合成可安装的领域程序（PR 操作、Jira 同步、故障处理、发布） · **你得到什么**: 插件清单、按范围授权、审计与溯源、参考插件
- **层级**: **OS**（本仓库） · **仓库**: [`Q00/ouroboros`](https://github.com/Q00/ouroboros) · **职责**: Agent OS 内核 —— Seed、Ledger、Runtime、MCP、安全边界 · **你得到什么**: `ooo` 命令、规约优先的工作流引擎、多运行时适配

**它们怎么连起来：**

```
  ourocode  ──►  ooo / ouroboros-plugins  ──►  ouroboros core (Seed · Ledger · MCP · Runtime)
   shell             user-level apps                        kernel
```

- **内核**（`ouroboros`）持有契约：不管最终由哪个 LLM 执行，每一个动作都会变成一个绑定 seed、记入 ledger、可回放的事件。
- **插件**（`ouroboros-plugins`）针对这份契约声明自己需要的能力范围，所以领域工作流（review 一个 PR、分诊一张 Linear 工单、跑一次发布）始终是可审计、受策略约束的，而不是一次性的 prompt。
- **Ourocode** 是终端 shell：它把 MCP 状态、访谈问题、wonderTool 决策都做成一等公民的 TUI 元素，让你不用离开键盘、也不用在多个 CLI 之间来回切换就能驱动这套 OS。

你可以只用 `ouroboros` 配任意受支持的 CLI；需要领域工作流时叠加插件；想要一个统一的终端驾驶舱时再装 `ourocode`。

> **免责声明。** Ouroboros 项目及其社区**与任何加密货币、代币、meme 币或交易社群均无关联** —— 包括但不限于 pump.fun 及其他发射平台上任何名为 "ouroboros" 的代币。这是一个开源开发者工具。我们不发行、不背书、也不持有任何代币。任何声称与本项目有关联的代币都是未经授权的。

> **命名说明。** 还有一个同名为 "Ouroboros" 的独立开源项目，与本项目无关 —— 是 Anton Razzhigaev 开发的自我修改型、持久记忆 agent（`github.com/razzant/ouroboros`）。两者不共享代码，也没有任何关联。本项目在执行前锁定规约，不会重写自己的架构 —— 如果你要找的是会改写自身代码的 agent，那是另一个项目。

## 为什么选 Ouroboros？

绝大多数 AI 编码失败在**输入**，不在输出。瓶颈不是 AI 能力不够，而是人没把事情想清楚。

### 问题 · 实际发生的情况 · Ouroboros 的解法
- **问题**: 提示词太模糊 · **实际发生的情况**: AI 靠猜，你不停返工 · **Ouroboros 的解法**: 苏格拉底式访谈把隐藏的假设挖出来
- **问题**: 没有规约 · **实际发生的情况**: 写到一半架构开始飘 · **Ouroboros 的解法**: 不可变的 seed 规约在写代码前先锁住意图
- **问题**: 全靠手工 QA · **实际发生的情况**: "看起来还行"不算验证 · **Ouroboros 的解法**: 三阶段自动评估关卡

## 快速开始

**安装** —— 一条命令，环境自动识别：

```bash
curl -fsSL https://raw.githubusercontent.com/Q00/ouroboros/main/scripts/install.sh | OUROBOROS_INSTALL_REF=readme-zh bash
```

**第一条命令** —— 打开你的 AI 编码 agent，按顺序运行：

```
> ooo setup
> ooo interview "I want to build a task management CLI"
```

`ooo setup` 只需运行一次，用来配置运行环境；`ooo interview` 才是安装后
启动第一个工作流的命令。

也可以不经过 agent 宿主，直接在终端里跑：

```
$ ouroboros init start --orchestrator "I want to build a task management CLI tool"
```

  <sub>本页顶部的录屏就是这条命令。放在最前面，是为了让你在安装之前先看到它。</sub>

  ![终端录制：ouroboros setup refresh 安装 Codex 规则与技能、Hermes 技能、OpenCode 插件与说明文件、Pi 和 GJC 的 bridge，最后输出 Refreshed runtime artifacts: codex, hermes, opencode, pi, gjc](./docs/images/ooo-setup-refresh.gif)

  <sub>在一台机器上跑 `ouroboros setup refresh`。它只装进这台机器真正有的宿主，各按各自的形态：Codex 装规则和技能，Hermes 装技能，OpenCode 装插件和 `AGENTS.md`，Pi 和 GJC 装 bridge。你的机器上会出现 13 个里你装了的那些。</sub>

> 支持 Claude Code、Codex CLI、GitHub Copilot CLI、OpenCode、Hermes、Gemini、Kiro CLI、Pi CLI、Zcode、Goose、GJC、Antigravity CLI 和 Grok Build CLI。安装程序会自动检测可用的运行时，并在宿主支持的情况下注册 MCP server。如需显式选择运行时，安装后执行 `ouroboros setup --runtime <opencode|kiro|copilot|gemini|pi|zcode|goose|gjc|antigravity|grok>`。Copilot CLI 运行时会通过 GitHub Copilot models API 实时获取模型列表，并在配置过程中让你选择默认模型。

Codex 插件快速开始

需要 `codex` 在 `PATH` 中，并且主机上有 `uvx`（插件的 MCP 描述符用它启动
server）。可用 `pipx install uv`、`pip install --user uv` 或 `brew install uv`
安装。

```bash
codex plugin marketplace add Q00/ouroboros
codex plugin add ouroboros@ouroboros
```

打开一个新的 Codex 会话，按顺序运行：

```
ooo setup
ooo interview "Build a task management CLI"
```

`ooo setup` 只需运行一次，用来准备运行环境。准备就绪后，它会沿用 Codex
当前的默认模型；只有在需要为某个流水线阶段固定特定模型时，才选择**直接配置模型**。

Kiro CLI 快速开始

```bash
pipx install 'ouroboros-ai[mcp]'       # 或者：uv tool install 'ouroboros-ai[mcp]'
ouroboros setup --runtime kiro         # 检测 Kiro CLI、注册 MCP server，并把
                                        # OUROBOROS_RUNTIME=kiro 写入
                                        # ~/.kiro/settings/mcp.json（受信任的、由
                                        # setup 管理的位置——项目内的 .env 属于不受信任
                                        # 输入，这个键在那里会被忽略）
```

之后就可以在 Kiro CLI 会话中使用 `ooo` 命令。

GitHub Copilot CLI 快速开始

```bash
gh auth login                                # 一次性 GitHub 认证（用于实时获取模型列表）
pipx install 'ouroboros-ai[mcp]'             # 或者：uv tool install 'ouroboros-ai[mcp]'
ouroboros setup --runtime copilot            # 实时获取模型列表并选择默认模型，
                                             # 在 ~/.copilot/mcp-config.json 中注册 MCP server
```

重新启动 Copilot CLI 会话后，即可在会话中使用 `ooo` 命令。**模型 ID 映射的覆盖范围比看上去要窄**：静态映射表只覆盖 `claude-opus-4-6` 和 `claude-sonnet-4-5`；已经包含 `.` 的 ID 会原样通过；连字符转点号的兜底逻辑会替换**每一个**连字符，因此当前默认值 `claude-opus-4-8` 会变成 `claude.opus.4.8` 而匹配失败。请让各角色模型保持未设置，由 setup 写入发现到的 ID；或显式设置一个 Copilot 可用的点号格式 ID。参见 [#1995](https://github.com/Q00/ouroboros/issues/1995) 与 [Copilot 运行时指南](./docs/runtime-guides/copilot.md)。

完整说明见 [GitHub Copilot CLI 运行时指南](./docs/runtime-guides/copilot.md)。

其他安装方式

**仅安装 Claude Code 插件**（无需安装 Python 包或全局 Python；主机唯一的
前置条件是 uv。uv 提供启动 MCP server 的 `uvx`，并可为插件技能配置
Python >= 3.12。兼容的全局 `python3` 或 `python` 只是可选的快速路径；
缺失或版本过旧时，技能会使用 uv 管理的解释器）：
```bash
claude plugin marketplace add Q00/ouroboros && claude plugin install ouroboros@ouroboros
```
然后在 Claude Code 会话里跑一次 `ooo setup`。

**pip / uv / pipx**：
```bash
pip install ouroboros-ai                # 基础
pip install 'ouroboros-ai[claude]'        # + Claude Code 依赖
pip install 'ouroboros-ai[litellm]'       # + LiteLLM 多 provider；Python 3.12-3.13
pip install 'ouroboros-ai[mcp]'           # + MCP server / client 支持
pip install 'ouroboros-ai[tui]'           # + Textual 终端 UI
pip install 'ouroboros-ai[all]'           # Claude + LiteLLM + TUI + dashboard（不含 MCP 2）；Python 3.12-3.13
ouroboros setup                         # 配置运行时
```

`[claude]` 与 `[mcp]` 必须保持隔离：Claude Agent SDK 使用 MCP 1.x，而协议 server 使用 MCP 2。需要 MCP 的 host 应通过 `uvx --isolated --python '>=3.12' --from 'ouroboros-ai[mcp]' ...` 或 `pipx run --spec 'ouroboros-ai[mcp]' ...` 启动独立进程，不要把两个 extra 安装到同一环境。

基础包和非 LiteLLM 安装支持 Python 3.12-3.14。包含 LiteLLM 的安装（`[litellm]`、`[all]`、source `--all-extras`）支持 Python 3.12-3.13；当前示例优先使用 Python 3.13。详见 [Platform Support](./docs/platform-support.md#python-profile-matrix)。

历史兼容：在 extras 迁移期间，`ouroboros-ai[dashboard]` 仍然作为兼容别名保留。

**Homebrew（macOS/Linux）**：
```bash
brew tap q00/tap
brew install ouroboros-ai
ouroboros setup                         # 配置运行时
```
自托管 tap，尚未进入 homebrew-core。安装的是与 PyPI 相同的包。

各运行时指南：[Claude Code](./docs/runtime-guides/claude-code.md) · [Codex CLI](./docs/runtime-guides/codex.md) · [Hermes](./docs/runtime-guides/hermes.md) · [OpenCode](./docs/runtime-guides/opencode.md) · [Kiro CLI](./docs/runtime-guides/kiro.md) · [Gemini CLI](./docs/runtime-guides/gemini.md) · [GitHub Copilot CLI](./docs/runtime-guides/copilot.md) · [Zcode](./docs/runtime-guides/zcode.md) · [Pi JSON mode](https://pi.dev/docs/latest/json) · [Goose](./docs/runtime-guides/goose.md) · [GJC](./docs/runtime-guides/gjc.md) · [Antigravity CLI](./docs/runtime-guides/antigravity.md) · [Grok Build CLI](./docs/runtime-guides/grok.md)

卸载

```bash
ouroboros uninstall
```

清掉所有配置、MCP 注册和数据。详情见 [UNINSTALL.md](./UNINSTALL.md)。

> **需要 Python >= 3.12**。包含 LiteLLM 的 profile 支持 Python 3.12-3.13。详见 [Platform Support](./docs/platform-support.md#python-profile-matrix) 和 [pyproject.toml](./pyproject.toml)。
>
> **作为 MCP 服务器安装时请用 0.51.1 或更新的版本。** 更早的版本在已有环境遮蔽 `[mcp]` profile 时会启动失败，报 `Failed to reconnect to plugin:ouroboros:ouroboros: -32000`（[#2012](https://github.com/Q00/ouroboros/issues/2012)）。如果你不是从 PyPI 而是从发行版软件包安装，尤其要注意——那边的版本可能落后。

  <sub>大多数人是在审到第三个文件的时候，才发现自己当初没说清楚。
  如果这种感觉很熟悉，请给 [GitHub 上的 Q00/ouroboros](https://github.com/Q00/ouroboros) 点个 Star，让下一个遇到同样问题的人更容易找到它。</sub>

## 你能得到什么

跑完一轮 Ouroboros 循环之后，一个模糊的想法会变成一份经过验证的代码库：

### 阶段 · 之前 · 之后
- **阶段**: **Interview** · **之前**: *"帮我做个 task CLI"* · **之后**: 12 条隐藏假设被挖出来，模糊度打分到 0.19
- **阶段**: **Seed** · **之前**: 没规约 · **之后**: 不可变规约：明确写出验收标准、本体、约束
- **阶段**: **Evaluate** · **之前**: 人肉 review · **之后**: 三阶段关卡：Mechanical（免费）→ Semantic → Multi-Model Consensus

刚才发生了什么？

```
interview  ->  苏格拉底式提问揭示了 12 条隐藏假设
seed       ->  把回答凝结成不可变规约（Ambiguity: 0.15）
run        ->  按 Double Diamond 分解执行
evaluate   ->  三阶段验证：Mechanical -> Semantic -> Consensus
```

> 在你的 AI 编码 agent 会话里用 `ooo <cmd>`，或者在终端里直接用 `ouroboros init start`、`ouroboros run seed.yaml` 等命令。

衔尾蛇完成了一次循环。每一圈，它都比上一圈知道得更多。

## 与现有方案对比

AI 编码工具本身很强 —— 但当输入不清晰时，它们解的是**错的问题**。

###  · 普通 AI 编码 · Ouroboros
- **模糊提示词** · **普通 AI 编码**: AI 自己猜意图，基于假设往下做 · **Ouroboros**: 苏格拉底式访谈在写代码*之前*强制澄清
- **规约校验** · **普通 AI 编码**: 没有规约 —— 写到一半架构开始飘 · **Ouroboros**: 不可变的 seed 规约锁住意图；没有显式 force 时，模糊度门槛（≤ 0.2）会拦下提前进入 code 的尝试
- **评估** · **普通 AI 编码**: "看起来还行" / 人肉 QA · **Ouroboros**: 三阶段自动关卡：Mechanical → Semantic → Multi-Model Consensus
- **返工率** · **普通 AI 编码**: 高 —— 错误假设到后期才暴露 · **Ouroboros**: 低 —— 假设在访谈阶段就暴露，而不是等到 PR review

## 循环

衔尾蛇 —— 一条吞食自己尾巴的蛇 —— 不是装饰。它*就是*这个架构本身：

```
    Interview -> Seed -> Execute -> Evaluate
        ^                           |
        +---- Evolutionary Loop ----+
```

每一次循环不是简单重复 —— 它在**演化**。评估阶段的输出会作为下一代的输入，直到系统真正知道自己在做什么。

### 阶段 · 做什么
- **阶段**: **Interview** · **做什么**: 用苏格拉底式提问揭示隐藏假设
- **阶段**: **Seed** · **做什么**: 把回答凝结成一份不可变规约
- **阶段**: **Execute** · **做什么**: Double Diamond：Discover → Define → Design → Deliver
- **阶段**: **Evaluate** · **做什么**: 三阶段关卡：Mechanical（$0）→ Semantic → Multi-Model Consensus
- **阶段**: **Evolve** · **做什么**: Wonder *("我们还有什么没搞清楚？")* → Reflect → 进入下一代

> *"这就是衔尾蛇吞食尾巴的地方：评估的输出，*
> *变成下一代 seed 规约的输入。"*
> —— `reflect.py`

当本体相似度 ≥ 0.95 时收敛 —— 系统已经把自己问得足够清楚了。

### Ralph：永不停歇的循环

`ooo ralph` 跨会话边界持续地跑这个演化循环，直到收敛为止。每一步都是**无状态**的：EventStore 会重建完整的演化谱系，所以即便机器重启，衔尾蛇也能从断点继续。

```
Ralph Cycle 1: evolve_step(lineage, seed) -> Gen 1 -> action=CONTINUE
Ralph Cycle 2: evolve_step(lineage)       -> Gen 2 -> action=CONTINUE
Ralph Cycle 3: evolve_step(lineage)       -> Gen 3 -> action=CONVERGED
                                                +-- Ralph 停止。
                                                    本体已经稳定。
```

## 命令

在 AI 编码 agent 会话里用 `ooo <cmd>` 技能，在终端里用 `ouroboros` CLI。

### 技能（`ooo`） · 等效 CLI · 作用
- **技能（`ooo`）**: `ooo setup` · **等效 CLI**: `ouroboros setup` · **作用**: 注册运行时并配置项目（一次性）
- **技能（`ooo`）**: `ooo interview` · **等效 CLI**: `ouroboros init start` · **作用**: 苏格拉底式提问 —— 把隐藏假设挖出来
- **技能（`ooo`）**: `ooo auto` · **等效 CLI**: `ouroboros auto` · **作用**: 从一个目标 → A 级 Seed → 在有界循环里完成执行交接
- **技能（`ooo`）**: `ooo seed` · **等效 CLI**: *(由 interview 生成)* · **作用**: 凝结为不可变规约
- **技能（`ooo`）**: `ooo run` · **等效 CLI**: `ouroboros run seed.yaml` · **作用**: 用 Double Diamond 分解执行
- **技能（`ooo`）**: `ooo evaluate` · **等效 CLI**: *(经由 MCP)* · **作用**: 三阶段验证关卡
- **技能（`ooo`）**: `ooo evolve` · **等效 CLI**: *(经由 MCP)* · **作用**: 演化循环，直到本体收敛
- **技能（`ooo`）**: `ooo unstuck` · **等效 CLI**: *(经由 MCP)* · **作用**: 卡住时，5 个横向思维人格替你换个角度
- **技能（`ooo`）**: `ooo status` · **等效 CLI**: `ouroboros status executions` / `ouroboros status execution ` · **作用**: 会话跟踪 +（仅 MCP）漂移检测
- **技能（`ooo`）**: `ooo resume-session` · **等效 CLI**: `ouroboros resume` · **作用**: 列出进行中的会话并给出重新接入命令
- **技能（`ooo`）**: `ooo cancel` · **等效 CLI**: `ouroboros cancel execution [\ · **作用**: --all]` · 取消卡住或孤儿态的执行
- **技能（`ooo`）**: `ooo ralph` · **等效 CLI**: *(经由 MCP)* · **作用**: 持续循环直到通过验证
- **技能（`ooo`）**: `ooo tutorial` · **等效 CLI**: *(交互式)* · **作用**: 交互式动手学习
- **技能（`ooo`）**: `ooo help` · **等效 CLI**: `ouroboros --help` · **作用**: 完整命令参考
- **技能（`ooo`）**: `ooo pm` · **等效 CLI**: *(经由 MCP)* · **作用**: 面向 PM 的访谈 + PRD 生成
- **技能（`ooo`）**: `ooo qa` · **等效 CLI**: *(经由 skill)* · **作用**: 通用 QA 评判，可用于任意产物
- **技能（`ooo`）**: `ooo update` · **等效 CLI**: `ouroboros update` · **作用**: 检查更新 + 升级到最新版
- **技能（`ooo`）**: `ooo brownfield` · **等效 CLI**: *(经由 skill)* · **作用**: 扫描并管理 brownfield 仓库 / worktree 默认值
- **技能（`ooo`）**: `ooo publish` · **等效 CLI**: *(skill / 运行时；底层用 `gh` CLI)* · **作用**: 把 Seed 发布成 GitHub Epic / Task issue，用于团队协作

> Claude Code 将 `/run`、`/status`、`/help` 和 `/config` 保留为内置命令。
> 直接调用 Ouroboros skill 时请使用 `/ouroboros:ouroboros-run`、
> `/ouroboros:ouroboros-status`、`/ouroboros:ouroboros-help` 和
> `/ouroboros:ouroboros-config`；原有的 `ooo run`、`ooo status`、
> `ooo help` 和 `ooo config` 文本入口仍然受支持。

> 不是所有技能都有直接对应的 CLI 子命令。其中一些（`evaluate`、`evolve`、`unstuck`、`ralph`、`publish`）通过 agent 技能、运行时规则或 MCP 工具暴露，而不是 `ouroboros <subcommand>` 这种 shell 命令。
> `/resume` 是 Claude Code 内置的会话选择器保留指令；要恢复 Ouroboros 进行中的会话，请使用 `ooo resume-session`。

完整细节见 [CLI 参考](./docs/cli-reference.md)。

## 九种心智

九个 agent，每一个对应一种思维模式。按需加载，不预加载：

### Agent · 角色 · 核心问题
- **Agent**: **Socratic Interviewer** · **角色**: 只问问题。从不动手做。 · **核心问题**: *"你正在假设什么？"*
- **Agent**: **Ontologist** · **角色**: 找本质，不看表象 · **核心问题**: *"这东西到底*是*什么？"*
- **Agent**: **Seed Architect** · **角色**: 把对话凝结成规约 · **核心问题**: *"够完整、够清楚了吗？"*
- **Agent**: **Evaluator** · **角色**: 三阶段验证 · **核心问题**: *"我们做出来的，真的是该做的吗？"*
- **Agent**: **Contrarian** · **角色**: 对每一个假设提出质疑 · **核心问题**: *"如果反过来呢？"*
- **Agent**: **Hacker** · **角色**: 找非常规路径 · **核心问题**: *"哪些约束其实是真的？"*
- **Agent**: **Simplifier** · **角色**: 移除复杂度 · **核心问题**: *"能跑起来的最简方案是什么？"*
- **Agent**: **Researcher** · **角色**: 停下编码，去做调查 · **核心问题**: *"我们手里到底有什么证据？"*
- **Agent**: **Architect** · **角色**: 找结构性根因 · **核心问题**: *"如果从头再来，我们还会这么搭吗？"*

## 内部结构

架构总览 —— Python >= 3.12

```
src/ouroboros/
+-- bigbang/        Interview、模糊度打分、brownfield 探查
+-- routing/        PAL Router —— 三档成本优化（1x / 10x / 30x）
+-- execution/      Double Diamond、分层 AC 分解
+-- evaluation/     Mechanical -> Semantic -> Multi-Model Consensus
+-- evolution/      Wonder / Reflect 循环、收敛判定
+-- resilience/     四种停滞模式检测、5 个横向思维人格
+-- observability/  三要素漂移度量、自动复盘
+-- persistence/    Event sourcing（SQLAlchemy + aiosqlite）、检查点
+-- orchestrator/   运行时抽象层（Claude Code、Codex CLI、OpenCode、Hermes）
+-- core/           类型、错误、seed、本体、安全
+-- providers/      LiteLLM 适配器（100+ 模型）
+-- mcp/            MCP 客户端 / 服务端集成
+-- plugin/         插件系统（技能 / agent 自动发现）
+-- tui/            终端 UI 仪表盘
+-- cli/            基于 Typer 的 CLI
```

**关键内部细节：**
- **PAL Router** —— Frugal（1x）→ Standard（10x）→ Frontier（30x），失败自动升级，成功自动降级
- **Drift** —— Goal（50%）+ Constraint（30%）+ Ontology（20%）加权度量，阈值 ≤ 0.3
- **Brownfield** —— 自动识别多种语言生态的配置文件
- **Evolution** —— 最多 30 代，本体相似度 ≥ 0.95 时收敛
- **Stagnation** —— 检测打转、震荡、无漂移、收益递减四种模式
- **Agent OS runtime** —— 跨能力发现、策略、指令、事件日志、agent 进程的可重放执行契约
- **Runtime backends** —— 可插拔抽象层（`orchestrator.runtime_backend` 配置），原生支持 Claude Code、Codex CLI、OpenCode、Hermes；同一份工作流规约，跑在不同执行引擎上

完整设计文档见 [Architecture](./docs/architecture.md)（英文）。中文文档：

- [评估流水线指南（Evaluation Pipeline）](./docs/guides/evaluation-pipeline.zh-CN.md) —— 三阶段关卡的完整参考：每个阶段验什么、阈值和配置项、失败模式与排查、以及事件审计轨迹

## 从 Wonder 到本体论

Ouroboros 背后的哲学引擎

> *Wonder -> "该怎么活？" -> "'活'到底*是*什么？" -> 本体论*
> —— 苏格拉底

每一个好问题都会带出更深的问题 —— 而那个更深的问题，永远是**本体论**层面的：不是*"我该怎么做？"*，而是*"这东西到底*是*什么？"*

```
   Wonder                          本体论
"我想要什么？"     ->    "我想要的那个东西，到底是什么？"
"做个 task CLI"    ->    "task 是什么？priority 是什么？"
"修一下登录 bug"   ->    "这是根因，还是只是症状？"
```

这不是为了抽象而抽象。当你回答*"task 是什么？"* —— 是可删除还是可归档？单人用还是团队用？—— 你就一次性消除了一整类返工。**本体论问题，恰恰是最实用的问题。**

Ouroboros 通过 **Double Diamond** 把这套思路嵌进了架构里：

```
    * Wonder          * Design
   /  (发散)         /  (发散)
  /    探索          /    创造
 /                 /
* ------------ * ------------ *
 \                 \
  \    定义         \    交付
   \  (收敛)         \  (收敛)
    * 本体论          * 评估
```

第一颗钻石是**苏格拉底式**：先发散成问题，再收敛成清晰的本体。第二颗是**实用层面**：先发散出设计选项，再收敛到经过验证的交付物。每一颗钻石都依赖前一颗 —— 没理解清楚的东西，是设计不出来的。

模糊度分数：Wonder 与代码之间的关卡

Interview 不会因为你"觉得差不多了"就结束 —— 而是要等**数学**说差不多了才结束。Ouroboros 把模糊度量化为加权清晰度的反值：

```
Ambiguity = 1 - Σ(clarity_i * weight_i)
```

每个维度由 LLM 在 0.0–1.0 区间打分（temperature 设为 0.1 以保证可复现），然后按权重加和：

### 维度 · Greenfield · Brownfield
- **维度**: **目标清晰度** —— *目标够具体吗？* · **Greenfield**: 40% · **Brownfield**: 35%
- **维度**: **约束清晰度** —— *边界定义清楚了吗？* · **Greenfield**: 30% · **Brownfield**: 25%
- **维度**: **成功标准** —— *结果是可衡量的吗？* · **Greenfield**: 30% · **Brownfield**: 25%
- **维度**: **上下文清晰度** —— *现有代码库摸清了吗？* · **Greenfield**: — · **Brownfield**: 15%

**阈值：Ambiguity ≤ 0.2。** 高于这个值会挡住 Seed 生成。绕过它的办法是显式传入 `force`，CLI 会把这个选项和继续、取消并排放在屏幕上。这道门槛是一个可以被反驳的默认值，不是锁。

```
示例（Greenfield）：

  Goal: 0.9 * 0.4  = 0.36
  Constraint: 0.8 * 0.3  = 0.24
  Success: 0.7 * 0.3  = 0.21
  Clarity             = 0.81
  Ambiguity = 1 - 0.81 = 0.19  <= 0.2 -> 可以进入 Seed
```

为什么是 0.2？因为在加权清晰度达到 80% 时，剩下的那点不确定性已经小到可以靠代码层面的判断来收尾。再高的话，你还在凭感觉定架构。

本体收敛：衔尾蛇何时停下

演化循环不会无限跑下去。当连续几代输出本体上等价的 schema 时，循环就停。相似度按 schema 字段加权比较：

```
Similarity = 0.5 * name_overlap + 0.3 * type_match + 0.2 * exact_match
```

#