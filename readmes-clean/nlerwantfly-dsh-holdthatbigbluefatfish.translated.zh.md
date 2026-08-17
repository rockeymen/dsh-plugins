# dsh-HoldThatBigBlueFatFish

## v0.3：Project2 从 92.5 提升到 99 分

正式版 `v0.3.0` 使用 OpenCode Go 套餐的 `deepseek-v4-pro`、`reasoningEffort: max`，在冻结的 Modeltest Project2 v4.1b 上得到 **Ability 99、Ship 99、Release A**，无 blocker，并完成真实 ESP-IDF 构建。评测使用的 RC5 与正式版 `contract-anchor.mjs` 逐字节一致，因此按原样晋升，不通过评测后改 prompt 来“补分”。

原始 runner 曾把同一候选记为 93/72/B；复核证明原因是 Windows 深层 evaluator build root 触发 `WinError 3`。候选代码未变，也没有追加模型请求或 Token；换用短的隔离构建根后，官方 evaluator 得到 99/99/A。runner 已同步修正，避免把评测基础设施故障误判为模型失败。

### 指标 · v0.3 完整样本
- **指标**: Ability / Ship · **v0.3 完整样本**: **99 / 99**
- **指标**: Release · **v0.3 完整样本**: **A**
- **指标**: Provider requests / tool calls · **v0.3 完整样本**: 237 / 270
- **指标**: Output tokens · **v0.3 完整样本**: 126,279
- **指标**: Prefix cache hit rate · **v0.3 完整样本**: **99.5305%**
- **指标**: ESP-IDF · **v0.3 完整样本**: real pass；`stdpro.bin` 984,800 bytes

### 92.5 → 99 是怎么来的

这里的 92.5 和 99 都是百分制 Project2 分数，不是“成功率”。它们使用相同冻结题面和评分器，但 provider 不同：92.5 基线来自 DeepSeek 官方 API，后续 96–99 来自 OpenCode Go 套餐。因此这是一条有证据的工程版本演进，不是严格的同 provider 随机对照，也不宣称统计显著。

### 阶段 · Provider / effort · Ability / Ship · Release · 关键变化与结论
- **阶段**: Router Standard 基线 · **Provider / effort**: DeepSeek 官方 API / max · **Ability / Ship**: 92.5 / 92.5 · **Release**: B+ · **关键变化与结论**: 6,273 字符 system；遗留 `M-fidelity`、`E-contract`、`E-build` blocker
- **阶段**: v0.2 Minimal Anchored · **Provider / effort**: OpenCode Go / max · **Ability / Ship**: 96、97 · **Release**: B+ · **关键变化与结论**: 46 字符 Minimal；首轮 `shell + read`，随后恢复 Standard；Docker 提供真实 ESP-IDF 构建
- **阶段**: v0.3 rc1 · **Provider / effort**: OpenCode Go / max · **Ability / Ship**: 98 / 98 · **Release**: B+ · **关键变化与结论**: 在晋级后加入短工程契约，约束安全、迁移、API/协议和发布不变量
- **阶段**: v0.3 rc2 · **Provider / effort**: OpenCode Go / max · **Ability / Ship**: 95 / 95 · **Release**: B+ · **关键变化与结论**: 回归样本：依赖失败后擅自替换官方 MQTT，证明“能构建”不能凌驾于集成保真
- **阶段**: v0.3 rc3 · **Provider / effort**: OpenCode Go / max · **Ability / Ship**: 97 / 97 · **Release**: B+ · **关键变化与结论**: 明确工具链失败不应替换正式集成，恢复官方 MQTT；仍丢 topic/readiness 与语义项
- **阶段**: v0.3 rc5 → 正式版 · **Provider / effort**: OpenCode Go / max · **Ability / Ship**: **99 / 99** · **Release**: **A** · **关键变化与结论**: 保留 exact-name wrapper 和协议字面量；迁移先 backfill 再建索引；先完成必需报告；真实构建通过

净提升来自五个可迁移的控制点：

1. 把 6,273 字符的路由/人格入口压成固定 46 字符 Minimal，降低 Pro 的首步注意力稀释。
2. 首请求仅显示原生 shell 与 `read`，首次持久化 `tool/call` 后才恢复完整 Standard 工具，避免一开始被大工具目录牵引，又不牺牲后续工程能力。
3. 晋级后只增加 491 字符固定契约，要求保留旧标识符、协议字面量和正式依赖；这直接修复了 rc2 的 MQTT 替换回归。
4. 把迁移顺序固定为“保留旧数据 → backfill → 建索引”，同时让必需 PR/构建报告先于可选文档，减少完整度失分。
5. 将 ESP-IDF evaluator 放到短、隔离的构建根。原始 93/72/B 是 Windows `WinError 3` 基础设施误判；同一候选零模型调用重评后为 99/99/A，这一步修正的是测量，不冒充模型提升。

缓存已经不是瓶颈；99 分样本仍用了 237 次请求和 270 次工具调用。Prompt 提高了正确性，却不能独自成为可靠的 stop controller。下一步应单独消融“按源码 hash 记录测试、probe、真实构建和 PR 完成证据”的轻量 stop gate，避免污染本次 99 分变量。

- [完整 99 分报告](.dsh-data/experiments/dsv4-pro-contract-anchor/report.md)
- [机器可读结果](.dsh-data/experiments/dsv4-pro-contract-anchor/result.json)
- [v0.3 插件源码、测试与安装器](.dsh-data/experiments/dsv4-pro-contract-anchor/)

> 让 DeepSeek Harness 的蓝色大肥鱼一次只咬下一口，验证够了就停。

`#dsh-plugin` · **v0.3.0** · DeepSeek Harness community preset · MIT

本工作区汇总了 DeepSeek V4 Pro 的上下文、工具披露、缓存和停止行为实验。v0.3 提供一个新的 Pro 高性能默认项，并保留 v0.2 的基线与防御项：

```text
dsv4-pro-contract-anchor   v0.3 Pro 默认项：Minimal → shell/read → Standard + 固定工程契约
dsv4-pro-anchored-96       v0.2 实验基线：Minimal → 首次 shell/read → 完整 Standard
dsv4-progressive-guarded   防御项：固定核心工具 + mutation/diagnostic/stop budgets
```

这是社区实验，不是 DeepSeek 官方 preset，也不代表 DeepSeek 的认可或背书。当前 composition 基于当前机器安装的 DeepSeek Harness `@deepseek-ai/dsh@0.1.0-rc.6` 的 Standard preset 生成；Harness 升级后应重新运行验证。

## v0.2：改了什么，为什么

v0.1 的 Progressive Guard 能约束实际工具风险，却暴露了四个结构问题：Bootstrap 在空项目里容易误判证据；Guard 无法回收已经生成的巨型工具参数 Token；晋级后缺少实现粒度；重复命令检测不等于成功后的停止。继续堆 Guard 会增加拒绝循环，却不一定改善 Pro 的推理入口。

v0.2 因此把“高性能默认项”和“强 containment 防御项”拆开，并用完整 Project2 结果验证，而不是只看短探针：

### 控制面 · v0.1 / 中间方案 · v0.2 Pro 默认项 · 改动依据
- **控制面**: System/context · **v0.1 / 中间方案**: Standard 或 311 字符定制 persona；可能附带 runtime 信息 · **v0.2 Pro 默认项**: 固定 46 字符 Minimal，`complete: true`，关闭 runtime context · **改动依据**: Pro 对长 system 和额外运行时信息敏感；带真实构建样本达到 96、97
- **控制面**: 首次工具目录 · **v0.1 / 中间方案**: 固定 6 个核心工具，或依靠命令形式判断晋级 · **v0.2 Pro 默认项**: 只投影原生 shell + `read` · **改动依据**: 收窄初始注意力入口，同时允许空项目用 shell 建立最小证据
- **控制面**: 晋级条件 · **v0.1 / 中间方案**: 可能依赖“命令看起来成功”或易失状态 · **v0.2 Pro 默认项**: 仅依据持久化 `tool/call`；下一请求恢复完整 Standard 目录 · **改动依据**: 不把乱码、环境变量或 `tool/result` 误当有效项目证据；session reload 后结果一致
- **控制面**: 后续能力 · **v0.1 / 中间方案**: Guard 持续裁剪/拒绝 · **v0.2 Pro 默认项**: 完整 Standard 工具恢复，system 仍保持 Minimal · **改动依据**: Project2 需要编辑、搜索、测试和构建；过度裁剪会把风险从探索转成能力焦虑或绕行
- **控制面**: 构建环境 · **v0.1 / 中间方案**: Windows 没有原生 EIM 时误记 `E-build` · **v0.2 Pro 默认项**: 官方 `espressif/idf:v6.0.1` Docker activation · **改动依据**: 同一候选可真实编译；必须把宿主缺工具与模型代码失败分开
- **控制面**: 缓存 · **v0.1 / 中间方案**: 担心动态 schema 降低命中 · **v0.2 Pro 默认项**: 全程 1 个 system hash、仅 2 个稳定 schema 状态 · **改动依据**: 两次正式样本缓存命中率 99.4507% / 99.3384%，缓存不是当前瓶颈
- **控制面**: Guard · **v0.1 / 中间方案**: 作为所有 Pro 任务默认入口 · **v0.2 Pro 默认项**: 高性能默认项不启用；强约束需求仍选择 Progressive · **改动依据**: Guard 只能拦执行，拦不住调用参数生成；它也可能阻止必要的编译失败修复

这不是“删除约束”，而是把约束前移到模型请求组装：先稳定注意力入口，再恢复完整工程能力。运行时硬预算仍保留在 `dsv4-progressive-guarded`，供不可信仓库、严格成本上限或高风险自动执行场景选择。

### v0.2 完整评测

模型为 OpenCode Go 套餐的 `deepseek-v4-pro`，`reasoningEffort: max`；题面和评分器冻结在 Modeltest Project2 v4.1b。它们不是 DeepSeek 官方 API 样本。

### Run · Ability · Ship · Release · 请求 · 工具调用 · 输出 Token · 缓存命中率 · ESP-IDF
- **Run**: `04-05-25-418` · **Ability**: 96 · **Ship**: 96 · **Release**: B+ · **请求**: 184 · **工具调用**: 220 · **输出 Token**: 101,252 · **缓存命中率**: 99.4507% · **ESP-IDF**: real pass
- **Run**: `04-54-08-394` · **Ability**: **97** · **Ship**: **97** · **Release**: B+ · **请求**: 148 · **工具调用**: 231 · **输出 Token**: 126,369 · **缓存命中率**: 99.3384% · **ESP-IDF**: real pass

97 分样本严格突破 96，并由官方 evaluator 归档 985,344 字节的 `stdpro.bin`；构建产物 SHA-256 为 `5551687f35305c3b8a0eca65702d3675e17137db35478d26429d6771d0782f75`。两次样本不足以宣称统计意义上的“稳定 97 下限”，但已证明该约束能完成真实构建并达到 97。

仍未解决的问题也必须明确：97 分样本首响应发出 4 个调用、广度 3；真实构建成功后仍消耗约 9.5k 输出 Token。v0.2 解决了初始注意力和构建证据，不声称已经解决 Pro 的全程扇出与停止判断。下一消融应只增加“首步执行预算”和“成功证据后的短 stop hint”，不能把隐藏测试答案写进 prompt。

- [v0.2 Pro 插件、安装器与测试](.dsh-data/experiments/dsv4-pro-anchored-96/)
- [完整 97 分报告](.dsh-data/experiments/dsv4-pro-anchored-96/report.md)
- [精简机器可读证据](.dsh-data/experiments/dsv4-pro-anchored-96/evidence/)

## 三者区别

仓库现在包含三个可组合、但安装层级不同的组件。它们不是三个互相替代的版本：

### 组件 · 安装层级 · 解决的问题 · 不负责什么 · 是否可单独使用
- **组件**: `dsh-HoldThatBigBlueFatFish` 主 preset · **安装层级**: `<DSH_HOME>/.agent-presets/` · **解决的问题**: 调整 DeepSeek V4 Pro 的 system、首轮工具披露与工程契约 · **不负责什么**: 不提供视觉模型；不改变 Windows shell 执行器 · **是否可单独使用**: 是
- **组件**: [`dsh-multimodel`](dsh-multimodel/) · **安装层级**: 某个 preset 的 `plugins/` · **解决的问题**: 出现图片时按需暴露 `perceive_media`，调用 Codex/Claude 视觉后端，并拦截不兼容的 `image_url` · **不负责什么**: 不把 pwsh 变成 Bash；不替换 DSH 主模型 · **是否可单独使用**: 是，可接入其他 DSH preset
- **组件**: [`dsh-pwsh2wslbash`](dsh-pwsh2wslbash/) · **安装层级**: `<DSH_HOME>/profiles/web` 或 `headless` · **解决的问题**: 在 Windows DSH 中关闭 `pwsh` 工具，让 `bash` 命令进入 WSL 原生 Linux · **不负责什么**: 不处理图片；不改变模型 prompt/preset；不会把整个 DSH 进程搬进 Linux · **是否可单独使用**: 是，Windows + WSL 专用

按需求选择：

### 目标 · 安装组合
- **目标**: 只使用 99 分 Pro 行为 · **安装组合**: 主 preset
- **目标**: Pro + 图片理解 · **安装组合**: 主 preset + `dsh-multimodel`
- **目标**: Pro + WSL Bash · **安装组合**: `dsh-pwsh2wslbash` + 主 preset
- **目标**: Pro + 图片理解 + WSL Bash · **安装组合**: 三者全部安装

三者全部安装时，推荐顺序是：先把 `dsh-pwsh2wslbash` 加入宿主 profile，再复制主
preset，最后把 `dsh-multimodel` 放入该 preset 并替换工具投影行。完成所有文件修改后
只重启一次 DSH，并新建 session；不要在已有轨迹中途切换 preset。

## 安装步骤

### 1. 安装主 preset

克隆仓库后，将 v0.3 Pro 默认 preset 目录完整复制到 DSH 用户 preset 根目录。PowerShell：

```powershell
if (-not $env:DSH_HOME) { throw '请先设置 DSH_HOME' }
$source = '.\.dsh-data\.agent-presets\dsv4-pro-contract-anchor'
$target = Join-Path $env:DSH_HOME '.agent-presets\dsv4-pro-contract-anchor'
if (Test-Path -LiteralPath $target) { throw "目标已存在：$target" }
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
Copy-Item -Recurse -LiteralPath $source -Destination $target
```

Linux/macOS：

```bash
test -n "$DSH_HOME"
test ! -e "$DSH_HOME/.agent-presets/dsv4-pro-contract-anchor"
mkdir -p "$DSH_HOME/.agent-presets"
cp -R .dsh-data/.agent-presets/dsv4-pro-contract-anchor \
  "$DSH_HOME/.agent-presets/dsv4-pro-contract-anchor"
```

需要持续硬预算时，改装同仓库的 `dsv4-progressive-guarded`，不要同时把两个 preset
目录合并成一个目录。

### 2. 可选：加入图片理解

`dsh-multimodel` 是 **preset 内插件**，不是 DSH profile bundle。PowerShell：

```powershell
if (-not $env:DSH_HOME) { throw '请先设置 DSH_HOME' }
$preset = Join-Path $env:DSH_HOME '.agent-presets\dsv4-pro-contract-anchor'
$source = Resolve-Path '.\dsh-multimodel'
$target = Join-Path $preset 'plugins\dsh-multimodel'
if (-not (Test-Path -LiteralPath $preset)) { throw "请先安装主 preset：$preset" }
if (Test-Path -LiteralPath $target) { throw "目标已存在：$target" }
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
Copy-Item -Recurse -LiteralPath $source -Destination $target
```

然后在该 preset 的 `agent.cordis.yml` 中删除原来的
`dsv4-pro