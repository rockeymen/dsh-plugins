# dsh-minimal-v3

一个面向 DeepSeek V4 Pro 的 **Windows 友好的全极简 agent preset**：以官方
`minimal` 为底座，保留其"固定完整 persona、无自动注入、无上下文压缩"的干净
特征，同时把官方 minimal 的纯 `bash` 持久终端换成**平台自适应 shell**
（Windows → `pwsh`，Linux/macOS → `bash`），并带入 `standard` 的少数常用
文件/搜索工具。

这是社区项目，并非 DeepSeek 官方 preset，不代表 DeepSeek 的认可或背书。

> **为什么它有用**：DeepSeek V4 Pro 会强烈依赖 API 可见的工具目录。官方
> `minimal` 在评测中能拿到 `99/96`（参考 [modeltest](https://github.com/xiaobright/modeltest)），
> 但只在 Linux + 持久 bash 上可用，Windows 上没 bash 会直接失效。本 preset
> 保留 minimal 的"纯净"心智，却让它在 Windows 上同样可用，且带上了真正做工程
> 需要的 `read/write/edit/glob/grep` 等工具，而不是只有两个。

## 与官方 minimal 的区别

### 维度 · 官方 minimal · dsh-minimal-v3
- **维度**: persona · **官方 minimal**: `complete` 完整 prompt · **dsh-minimal-v3**: 相同（`You are a helpful software engineer assistant.`，`complete: true`，`includeRuntimeContext: false`）
- **维度**: shell · **官方 minimal**: 持久 `bash`（Windows 不可用） · **dsh-minimal-v3**: 平台自适应：Windows→`pwsh`，其他→`bash`（非持久）
- **维度**: 自动注入 · **官方 minimal**: 无 · **dsh-minimal-v3**: 无（不加载 AGENTS.md/CLAUDE.md/local overlay）
- **维度**: 上下文压缩 · **官方 minimal**: 无 · **dsh-minimal-v3**: 无
- **维度**: 工具 · **官方 minimal**: 仅 `bash` + `str_replace_editor` · **dsh-minimal-v3**: `pwsh · bash`、`read`、`write`、`edit`、`read_image`、`glob`、`grep`、`ask_user_question`、`todo_write`
- **维度**: subagent/workflow/goals/skills/web · **官方 minimal**: 无 · **dsh-minimal-v3**: 无（保持极简）

## Windows / Linux 下的最终工具清单

- **Windows**：`pwsh`, `read`, `write`, `edit`, `read_image`, `glob`, `grep`,
  `ask_user_question`, `todo_write`
- **Linux/macOS**：`bash`, `read`, `write`, `edit`, `read_image`, `glob`,
  `grep`, `ask_user_question`, `todo_write`

全程恒定，不做两阶段切换。

## 兼容范围

开发和验证版本：

- DeepSeek Harness（DSH）`0.1.0-rc.6`
- Node.js ≥ 22.19（用于本地自测）

DeepSeek Harness 目前仍是开发者预览版，官方明确允许破坏性变更。本 preset
引用的插件 `@deepseek-ai/dsh-persona`、`dsh-tool-bash`、`dsh-tool-pwsh`、
`dsh-tool-fs`、`dsh-tool-fs-search`、`dsh-tool-ask-user`、`dsh-tool-todo`
均来自官方包；升级 Harness 后如遇加载失败，请先核对上游这些包的名称是否变化。

## 安装

克隆本仓库，将整个 `preset` 目录复制到用户 preset 根目录，并将目标目录命名为
`minimal-v3`。

PowerShell（Windows）：

```powershell
$target = Join-Path $env:USERPROFILE '.dsh\.agent-presets\minimal-v3'
if (Test-Path -LiteralPath $target) { throw "Preset already exists: $target" }
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
Copy-Item -Recurse -LiteralPath '.\preset' -Destination $target
```

Linux/macOS：

```sh
dsh_home="${DSH_HOME:-$HOME/.dsh}"
mkdir -p "$dsh_home/.agent-presets/minimal-v3"
cp -R preset/. "$dsh_home/.agent-presets/minimal-v3/"
```

完整重启 DeepSeek Harness，新建空会话，在预设选择器中选择
**Minimal V3**。不要在已经产生内容的会话中途切换 preset。

## 使用建议

- 建议搭配 **DeepSeek V4 Pro** 使用（该比较优势主要针对 Pro 对工具目录的
  敏感性；V4 Flash 各 harness/思维链表现本就稳定）。
- 首次请求可先让它 `read` 一个文件来"锚定"轨迹，再交付正式任务。
- 本 preset 不含 `skill` 工具：如果你需要 open-design 等自定义 skill 能力，
  请改用完整 preset 或自行在副本中加回 `tool-skill`。
- 因为禁用了指令自动注入，项目里的 AGENTS.md/CLAUDE.md **不会**自动加载，
  需由你显式让模型读取，或直接写在对话里。这正符合"极简纯净"的意图。

## 验证加载

本地零依赖自测：

```sh
npm test
```

若要确认导入后能被发现，可在 DSH 环境外跑：

```js
import { discoverPresets } from "@deepseek-ai/dsh-agent-presets/lib/types/discovery.js";
const presets = await discoverPresets([{ path: "~/.dsh/.agent-presets", trust: "user" }]);
console.log(presets.map(p => ({ id: p.id, broken: p.broken ?? false })));
```

`minimal-v3` 应出现且 `broken === false`。

更完整的运行期验证：导出会话 JSONL，检查 `request/header` 的 `tools`
应只含上述清单，且 `user/message` 中**没有** `<system-reminder>` 形式的
AGENTS.md / skills 注入。

## 重要行为

- 第一次模型响应若没有调用工具，后续工具目录**不会变化**（本 preset 本就
  恒定，无两阶段晋升）。
- 工具调用即使失败，模型仍然可继续调用其余工具。
- preset 与 shell 具有相同信任等级，安装前请自行审阅
  `preset/agent.cordis.yml`。
- 本 preset 不会发起任何网络请求，也无遥测。

## 官方生态要求

DeepSeek 当前建议社区插件发布在自己的 GitHub 项目中，并添加
[`dsh-plugin`](https://github.com/topics/dsh-plugin) topic 便于被找到。官方
仓库目前不接受外部 PR，也不强制社区插件仓库模板。原文见官方
[`CONTRIBUTING.zh.md`](https://github.com/deepseek-ai/deepseek-harness/blob/47f943859bef60e4160492346772ded9b24f765a/CONTRIBUTING.zh.md)。