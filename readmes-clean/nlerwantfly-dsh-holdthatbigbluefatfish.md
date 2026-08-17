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
`dsv4-pro-contract-anchor-tools` 服务行，按
[`agent.cordis.snippet.yml`](dsh-multimodel/examples/agent.cordis.snippet.yml)
加入 `dsh-multimodel` 行。两者都负责首轮工具投影，不能同时加载。必须保留 v0.3
原有的 `minimalSystem` 与 `contractSystem`；完整值来自
[`contract-anchor.mjs`](.dsh-data/.agent-presets/dsv4-pro-contract-anchor/contract-anchor.mjs)。

视觉后端还需要至少一个可执行的原生 CLI：Codex 或 Claude。Windows 下如果 Node
启动 Microsoft Store 的 `codex.exe` 返回 `spawn EPERM`，请把 `codex.command`
显式设置为 npm Codex 包内的原生 `.exe`；详见
[`dsh-multimodel/README.md`](dsh-multimodel/README.md)。

### 3. 可选：把 pwsh 工具切换为 WSL Bash

`dsh-pwsh2wslbash` 是 **宿主 profile bundle**，不要复制进 preset 的 `plugins/`。
先确认 WSL 发行版可用：

```powershell
wsl.exe --list --quiet
wsl.exe -d Ubuntu-20.04 --exec /bin/bash -lc 'uname -s; printf "%s\n" "$BASH_VERSION"'
```

在实际使用的 profile 中安装：桌面/Web 使用
`$env:DSH_HOME\profiles\web\package.json`，命令行 headless 使用
`$env:DSH_HOME\profiles\headless\package.json`；两种入口都使用就修改两个文件。
为对应 `package.json` 增加：

```json
{
  "dependencies": {
    "dsh-pwsh2wslbash": "file:C:/absolute/path/dsh-pwsh2wslbash"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "dsh-pwsh2wslbash"
      ]
    }
  }
}
```

这是 Web profile 示例。Headless 应保留 `@deepseek-ai/dsh-base` 和
`@deepseek-ai/dsh-headless`，再追加 `dsh-pwsh2wslbash`。不要覆盖其他原有
`bundles`。随后在每个修改过的 profile 目录执行 `pnpm install`。完整示例见
[`dsh-pwsh2wslbash/README.md`](dsh-pwsh2wslbash/README.md)。

### 4. 重启与验证

所有组件安装完成后完整重启 DeepSeek Harness，新建空白 session，选择
`DeepSeek V4 Pro Contract Anchor v0.3.0`。

```text
主 preset：首请求只有当前原生 shell + read，首次持久化 tool/call 后恢复完整工具。
视觉插件：上传图片后可见 perceive_media，纯文本请求不增加视觉工具。
WSL 插件：bash 输出 Linux，node -p process.platform 输出 linux，且不再出现 pwsh 工具。
```

验证发布包：

```powershell
npm.cmd test
npm.cmd test --prefix .\dsh-multimodel
npm.cmd test --prefix .\dsh-pwsh2wslbash
```

## 总结

> 短探针里，工具 schema 与 Guard 更直接控制“实际做什么”；完整任务里，Pro 的能力上限更依赖极短固定 system、稳定的首次工具锚点、及时恢复完整能力，以及少量明确的工程不变量。v0.3 已达到 99 分，但后续停止仍需独立控制。

- Persona/context：Standard 换成 46 字符 Minimal 后，首步 reasoning 从 81 增至 166，动作广度仍为 2。
- 首轮 schema：Minimal Fixed/Anchored 在短探针把广度降至 1，但 reasoning 增至 294/227；通用 shell 仍能绕回递归盘点。
- 显式 prompt：动作更合规，但模型会在 reasoning 中复述规则，V2/V3 为 248/370 字符。
- 能力过窄：只开放 `read` 导致 1778 字符的能力焦虑；告知后续会开放工具后降至 442。
- 上下文预取：V6 reasoning 降至 328，但工具调用增至 3、广度回到 2。
- 长任务：Minimal 两组 Ability 为 91.0，对比 Standard 90.5；但 Ship 从 90.5 降到 72，未证明总体质量提升。
- 灰度/正式轨迹：灰度版更接近模块化产品循环；正式 DSH 版在第一次检查通过后仍继续 16 个 assistant step 和 18 次调用，说明路由或首步收窄不能独自控制整轮进度。
- Pro/Flash 分流：Flash 继续适合弱 persona + 渐进披露；Pro 使用显式选择的 Minimal Anchored preset，只发生一次由持久化事件决定的 schema 恢复。实际缓存命中高于 99.3%，没有出现此前担心的 cache 崩塌。
- v0.2 完整复验：Minimal Anchored 两个带真实构建样本为 96、97；缓存命中均高于 99.3%，因此当前瓶颈是后续扇出/停止，而不是 prefix cache。
- v0.3 完整复验：Contract Anchor 达到 99/99/A、零 blocker、真实 ESP-IDF 构建；缓存命中 99.5305%，但 237 次请求仍说明停止控制尚未完成。

完成数据均来自 Windows native；Linux Docker 没有形成完整可评分 run，因此不作跨 OS 结论。

### v0.2 防御轨道：bash-debug 工程修订

真实长任务轨迹进一步暴露了“空项目 bootstrap 误晋级、巨型单步生成、缺少纵向切片、通过测试后不收敛、PowerShell 契约过重”五个问题。`bash-debug` 分支已逐点修正；历史 14 条模型评分不重写，新验证使用本地假 API，不消耗官方 Token。

### 控制点 · 旧版 · bash-debug
- **控制点**: 空项目 · **旧版**: 根目录浅层查看也拒绝，可能读取 Harness 内部并误晋级 · **bash-debug**: Pro 首请求就有固定核心工具；另允许 Windows/Linux 最多 50 项的浅层探针，并拒绝内部/压缩数据
- **控制点**: 模型策略 · **旧版**: Pro/Flash 共用同一种渐进式入口 · **bash-debug**: Pro 显式固定策略；Flash 留给 Router 的弱 persona + 渐进披露，避免首请求生命周期误判
- **控制点**: 生成前控制 · **旧版**: 无 · **bash-debug**: 311 字符 complete system、`maxTokens <= 8192`、模型可见 `maxLength: 12000`
- **控制点**: 实现粒度 · **旧版**: 工具晋级后可一次写入任意大文件 · **bash-debug**: 单次 12,000 字符、未检查累计 24,000、每 step 最多两个变更
- **控制点**: 收敛 · **旧版**: 只拦完全相同命令的第三次重复 · **bash-debug**: 相关检查通过后总共只给两个额外诊断，换工具/换命令也不能绕过
- **控制点**: Windows shell · **旧版**: 模型直接面对 PowerShell 生态与 Harness 特有字段 · **bash-debug**: Linux 风格 `bash` facade 代理到受 ACL 约束的原生 `pwsh`；不启动 Git Bash、不提权
- **控制点**: 缓存边界 · **旧版**: Pro 两阶段、一次 schema 晋级 · **bash-debug**: Pro 的 system/tool 前缀全程固定，真实 Cordis smoke 中 schema transition 为 0

真实 DSH fake-API smoke 共 7 个 agent request、1 个 request header、1 个 system hash、1 个 tool schema hash、0 次 schema transition；12,001 字符变更与第三次重复检查均被拒绝。这个结果证明插件不额外切断缓存前缀，但不等同于官方 API 的实际 cache-hit rate。Docker daemon 当时未运行，因此 Linux 只完成同代码路径的契约测试，仍不声称真实跨 OS 等价。

## 历史 v0.1 消融数据

下表保留 v0.1 的 14 条官方 API/微探针结果，用来解释 v0.2 的设计来源；它不与上方 OpenCode Go 的 96/97 合并冒充同一 provider。历史数据共 634 次模型请求、858,011 input tokens、142,176,128 cache-read tokens、423,458 output tokens、159,096 reasoning tokens，估算费用 1.25703173 USD。

### Suite · Condition · System chars · 首轮 tools · Reasoning chars · Calls · Breadth · 合规 · Requests · 费用 USD
- **Suite**: 官方短探针 · **Condition**: standard-full · **System chars**: 6333 · **首轮 tools**: 25 · **Reasoning chars**: 81 · **Calls**: 2 · **Breadth**: 2 · **合规**: 否 · **Requests**: 3 · **费用 USD**: 0.00664987
- **Suite**: 官方短探针 · **Condition**: minimal-full · **System chars**: 46 · **首轮 tools**: 25 · **Reasoning chars**: 166 · **Calls**: 2 · **Breadth**: 2 · **合规**: 否 · **Requests**: 3 · **费用 USD**: 0.00706208
- **Suite**: 官方短探针 · **Condition**: standard-anchored · **System chars**: 6337 · **首轮 tools**: 2 · **Reasoning chars**: 78 · **Calls**: 2 · **Breadth**: 2 · **合规**: 否 · **Requests**: 3 · **费用 USD**: 0.00784989
- **Suite**: 官方短探针 · **Condition**: minimal-fixed · **System chars**: 46 · **首轮 tools**: 2 · **Reasoning chars**: 294 · **Calls**: 2 · **Breadth**: 1 · **合规**: 是 · **Requests**: 3 · **费用 USD**: 0.00560724
- **Suite**: 官方短探针 · **Condition**: minimal-anchored · **System chars**: 46 · **首轮 tools**: 2 · **Reasoning chars**: 227 · **Calls**: 2 · **Breadth**: 1 · **合规**: 是 · **Requests**: 3 · **费用 USD**: 0.01397026
- **Suite**: Project2 · **Condition**: standard-full · **System chars**: 6336 · **首轮 tools**: 25 · **Reasoning chars**: 87 · **Calls**: 2 · **Breadth**: 2 · **合规**: 否 · **Requests**: 149 · **费用 USD**: 0.29941497
- **Suite**: Project2 · **Condition**: minimal-fixed · **System chars**: 46 · **首轮 tools**: 2 · **Reasoning chars**: 240 · **Calls**: 2 · **Breadth**: 1 · **合规**: 是 · **Requests**: 207 · **费用 USD**: 0.44036715
- **Suite**: Project2 · **Condition**: minimal-anchored · **System chars**: 46 · **首轮 tools**: 2 · **Reasoning chars**: 252 · **Calls**: 2 · **Breadth**: 2 · **合规**: 否 · **Requests**: 253 · **费用 USD**: 0.45865420
- **Suite**: 省 Token 探针 · **Condition**: v2-minimal-core · **System chars**: 46 · **首轮 tools**: 2 · **Reasoning chars**: 152 · **Calls**: 1 · **Breadth**: 2 · **合规**: 否 · **Requests**: 3 · **费用 USD**: 0.00043164
- **Suite**: 省 Token 探针 · **Condition**: v2-compact-core · **System chars**: 400 · **首轮 tools**: 2 · **Reasoning chars**: 248 · **Calls**: 2 · **Breadth**: 1 · **合规**: 是 · **Requests**: 3 · **费用 USD**: 0.01207189
- **Suite**: 单请求探针 · **Condition**: v3-single-core · **System chars**: 262 · **首轮 tools**: 2 · **Reasoning chars**: 370 · **Calls**: 1 · **Breadth**: 1 · **合规**: 是 · **Requests**: 1 · **费用 USD**: 0.00101616
- **Suite**: 单请求探针 · **Condition**: v4-read-core · **System chars**: 46 · **首轮 tools**: 1 · **Reasoning chars**: 1778 · **Calls**: 1 · **Breadth**: 1 · **合规**: 是 · **Requests**: 1 · **费用 USD**: 0.00068301
- **Suite**: 单请求探针 · **Condition**: v5-read-noted-core · **System chars**: 113 · **首轮 tools**: 1 · **Reasoning chars**: 442 · **Calls**: 2 · **Breadth**: 1 · **合规**: 是* · **Requests**: 1 · **费用 USD**: 0.00058986
- **Suite**: 单请求探针 · **Condition**: v6-prefetched-core · **System chars**: 6196 · **首轮 tools**: 6 · **Reasoning chars**: 328 · **Calls**: 3 · **Breadth**: 2 · **合规**: 否* · **Requests**: 1 · **费用 USD**: 0.00266351

\* 单请求微探针记录拟调用意图，并在工具 dispatch 前停止。

完整 token 列、首次调用参数、来源 run 和失败尝试见：

- [详细实验 README](.dsh-data/experiments/dsv4-anchored-v2-efficient/README.md)
- [全部结果 CSV](.dsh-data/experiments/dsv4-anchored-v2-efficient/all-results.csv)
- [全部结果 JSON](.dsh-data/experiments/dsv4-anchored-v2-efficient/all-results.json)
- [完整首轮原文与消融报告](.dsh-data/experiments/dsv4-anchored-v2-efficient/report.md)
- [项目对话归档（已排除 API Key 对话）](.dsh-data/experiments/dsv4-anchored-v2-efficient/conversation-archive.md)

## 两个生产预设

`dsv4-pro-anchored-96` 是 v0.2 的 Pro 高性能默认项：46 字符 Minimal system、关闭 runtime context；首请求只显示原生 shell + `read`，出现第一个持久化 `tool/call` 后，下一请求恢复完整 Standard 工具。它没有动态 prompt、reasoning 分类器或工具 Guard。

`dsv4-progressive-guarded` 是防御项。它使用 311 字符 complete persona，关闭 runtime context，并从首请求起固定暴露 `read/bash/grep/glob/edit/write`；整轮不再发生工具晋级。它持续拦截根级递归盘点、全量 glob、无路径 grep、shell 内容写入和后台首步，并增加持久化阶段预算、环境失败隔离、文件变更预算与测试后收敛预算。该模式优先 containment，不以 97 分样本作为质量背书。

Flash 不复用这两个 Pro preset：它继续使用 `dsh-router-standard` 的弱 persona 和 `read/bash → 有效证据 → 核心工具`。真实 Cordis 测试发现，`session.selectModel` 在首轮 system/tool 组装之后才最终施加路由，依靠插件自动猜测模型会让首请求误入错误策略，因此两类模型必须使用显式 preset，并在新 session 中选择。

97 分评测固定使用 `deepseek-v4-pro / max`。日常任务的 reasoning effort 仍由 DSH 模型选择层决定：Anchored preset 不伪装覆盖 UI 选择，也不设置输出上限；Progressive 防御 preset 才把单次 `maxTokens` 压到不高于 8,192。需要质量上限时选择 Anchored，需要硬成本边界时选择 Progressive。

Progressive 的 Plan Mode 会按持久化 `plan/mode` 事件绕过其 Guard，让 Harness 原生规划目录和 `exit_plan_mode` 接管。

当前工作区生成位置：

```text
.dsh-data/.agent-presets/dsv4-pro-anchored-96/
.dsh-data/.agent-presets/dsv4-progressive-g