# dsh-plugin-dynamic-assembler

**面向 [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness) 的自然语言驱动、安全闸门式动态组装插件。**

用自然语言告诉 dsh Agent 你想"组装"什么——它在**运行时**发现所需插件（官方优先、第三方可选），生成组装方案，经你确认后通过 Cordis 动态加载。任何**非官方插件在加载前都会先通过内置静态安全审查**。

> 对自进化 Agent 而言，安全闸门不是功能，是前提。

> 📦 **已发布到 npm** — `npm i dsh-plugin-dynamic-assembler`（v0.3.5）

## 为什么做

dsh 的核心是"一切皆插件"。自然的下一步是**自我组装**：Agent 根据需求组合自己的工具链——这正是官方[时空可组合性论文](https://github.com/cordiverse/paper)点名的下一个验证方向：自进化 Agent Harness。

本插件让这件事**既可行又安全**：

- **运行时发现**：可用插件通过 `ctx.registry` 运行时遍历，无任何硬编码插件清单。
- **官方优先**：任何能力优先选 `@deepseek-ai/*` 官方插件；官方无匹配才考虑第三方。
- **用户知情同意**：涉及第三方插件的方案会显式标注并要求 `allow_unofficial` 确认（策略可配：`ask` / `allow` / `deny`）。
- **加载前审查**：每个非官方插件先做静态扫描（危险模式 + 元数据），0-100 评分。`red`（<60 分）默认拒绝。

## 特性

###  ·
- 🧭 运行时发现 · `ctx.registry` 遍历——全量可见，零硬编码
- 🥇 官方优先 · 优先 `@deepseek-ai/*`；第三方仅作兜底且全程可见
- 🔐 第三方闸门 · `unofficialPolicy: ask`（默认）/ `allow` / `deny`
- 🛡️ 内置安全审查 · `assemble_inspect`——模式扫描 + 元数据检查 → 评分 → 绿/黄/红
- ⚠️ 敏感确认 · 联网/文件/命令/子代理/MCP/代码/凭据类能力必须显式确认
- 🗑️ 级联卸载 · 动态加载的插件在本插件卸载时全部 dispose（Cordis 时间可组合性）
- 🧩 八个工具 · `assemble_inspect` · `assemble_discover` · `assemble_plan` · `assemble_execute` · `assemble_unload` · `assemble_freeze` · `assemble_auto` · `assemble_compare`（v0.3.3 同类候选横向对比，v0.3.4 修复 Star/功能要点/审计列渲染缺陷，v0.3.5 修复审计列管线层根因：npm 未发布候选跳过 inspect 置 N/A，v0.3.6 新增 `assemble_inspect` 的 `github_repo` 发行物审计路径，v0.3.8 将该发行物审计接入对比表审计列 + 占位包语义识别）
- 🔭 外源发现（重装版） · `assemble_discover` + `discoveryMode` 配置：主动把 GitHub dsh-plugin 生态的社区插件纳入候选（只发现不裁决，经双重兜底）
- 🤖 全自动模式（重装版） · `assemble_auto`：说一句需求 → 自动规划并装载「官方+非敏感+策略允许」插件，失败自动回滚；敏感/未授权非官方自动跳过并回显需确认清单（绝不静默放行）

## 安装

```bash
# 从 npm 安装（推荐）。安装后 dsh 自动发现，无需指向本地目录：
npm i dsh-plugin-dynamic-assembler
# 或由 dsh profile 托管：
pnpm dsh plugin --profile web add dsh-plugin-dynamic-assembler
# 之后重启 web 服务
pnpm dsh web
```

### 配置（可选）

在 profile 的 `cordis.patch.yml` 中追加（新条目必须用 `- insert:` 包裹）：

```yaml
- insert:
    - id: dynamic-assembler
      name: dsh-plugin-dynamic-assembler
      config:
        denyList: []                  # 永不被组装的能力名子串
        unofficialPolicy: ask         # ask | allow | deny
        pluginSources: []             # 未加载的第三方插件候选（npm 包名或本地目录）
        discoveryMode: github-topic   # github-topic | awesome-list | off（重装版外源发现开关）
```

`pluginSources` 用于声明**尚未加载**的第三方插件；已加载的插件（官方或第三方）由运行时自动发现，无需配置。

## 工具

### 工具 · 作用 · 关键参数
- **工具**: `assemble_inspect` · **作用**: 审查插件包（官方/非官方）：模式扫描 + 元数据 → 评分与分级；**v0.3.6 新增** `github_repo` 参数——仅发 GitHub Releases、未上 npm 的社区插件传 `owner/repo` 走发行物审计路径，产出有意义报告而非死红"无法定位"；**v0.3.8** 该发行物审计算法已接入 `assemble_compare` 对比表 · **关键参数**: `plugin`, `github_repo?`
- **工具**: `assemble_discover` · **作用**: （重装版）主动刷新社区插件索引：拉取 GitHub dsh-plugin 生态候选并缓存 · **关键参数**: `force?`
- **工具**: `assemble_plan` · **作用**: 分析自然语言需求，发现匹配能力（官方优先 + 社区索引），生成方案（不加载） · **关键参数**: `requirement`
- **工具**: `assemble_execute` · **作用**: 经 Cordis 动态加载并启动插件。需确认；非官方需 `allow_unofficial`；red 审查需 `force` · **关键参数**: `names`, `confirm`, `confirm_sensitive`, `allow_unofficial`, `force?`, `configs?`
- **工具**: `assemble_unload` · **作用**: 卸载本插件动态加载的所有插件（安全回滚） · **关键参数**: —
- **工具**: `assemble_freeze` · **作用**: 把确认过的方案固化为 agent.cordis.yml preset（重启不丢、可版本管理） · **关键参数**: `names`, `preset_name?`, `base_dir?`, `configs?`
- **工具**: `assemble_auto` · **作用**: （重装版）一句话全自动组装：自动规划 + 安全分层自动装载（敏感/未授权非官方跳过并回显） · **关键参数**: `requirement`
- **工具**: `assemble_compare` · **作用**: （v0.3.3）同类候选横向对比：Star/版本/发布日期/安装包大小/校验文件/npm 发布核实/核心功能/静态审计分；可显式点名或复用索引。仅信息呈现，不改信任闸门。**v0.3.4 修复**：补 repo 详情请求补全 Star/Fork/描述、支持 README 异构特性形态（bullet/HTML-h3/加粗段首）、审计列未发布代码显示 N/A（无 npm 包）而非 0/100 · **关键参数**: `repos?`, `max_candidates?`

### 示例对话

> 用户：*"我需要一个能联网搜索并整理成 Markdown 文档的机器人。"*

1. 模型调用 `assemble_plan({ requirement: "联网搜索并整理成 Markdown 文档" })`
   → 运行时发现已加载插件，**官方优先**匹配能力，返回方案与推荐顺序。
2. 用户确认后，模型调用
   `assemble_execute({ names: ["tool-web","web-search-deepseek"], confirm: true, confirm_sensitive: true, allow_unofficial: false })`
   → 已加载的标记可用；未加载的官方插件按约定包名 `@deepseek-ai/dsh-<name>` 动态 import。
3. 随时回滚：`assemble_unload()`。

## 安全模型

`assemble_inspect` 执行两层**静态审查**：

1. **元数据**——npm scope（官方/第三方）、license、仓库、`install`/`postinstall` 脚本（高危）、peer 依赖完整性。
2. **源码**——入口文件（及邻近源码文件，限制大小）扫描危险模式：

### 级别 · 模式
- **级别**: 🔴 高危 · **模式**: `eval` / `new Function`、`child_process`/exec/spawn、安装脚本、疑似硬编码密钥
- **级别**: 🟡 中危 · **模式**: 文件写/删、网络请求、动态导入、base64 解码、字符混淆
- **级别**: 🔵 提示 · **模式**: `process.env` 访问、预发布版本、缺 license/仓库、非官方 scope

**评分**：100 分起步逐项扣减 → `green ≥ 80` / `yellow ≥ 60` / `red < 60`。

- `green`：可加载。
- `yellow`：可加载但需知晓（第三方仍要求 `allow_unofficial`）。
- `red`：**默认拒绝**；仅 `force: true`（高风险）可强制覆盖。

> ⚠️ **边界声明（务必知晓）**：静态审查是**风险提示，不是安全保证**。插件本质是 JS 模块，`ctx.plugin()` 加载后即拥有完整 Node 进程权限，恶意代码可轻易绕过正则扫描。请只安装可信来源的插件。隔离沙箱执行列为 v2 方向。

## 扩展能力词典

意图→能力映射在 `CAPABILITY_RULES`（`src/dynamic-assembler.ts`）。每条规则把自然语言关键词映射到候选插件名子串：

```ts
{ keywords: ['搜索', 'search', '联网', 'fetch', '网页', '抓取'],
  label: '联网搜索/抓取',
  match: ['tool-web', 'web-search', 'web-fetch-http', 'web'],
  dependsOn: ['web'],
  sensitive: true }
```

- `match` 是插件名子串，在运行时发现结果中匹配（官方优先）。
- 未加载的官方插件按约定名 `@deepseek-ai/dsh-<name>` 动态 import。
- `sensitive: true` 要求显式确认。
- 欢迎 PR 补充规则——词典只是启发式，绝不是硬编码清单。

## 开发

```bash
npm install
npm test        # node --test（ESM strip-types，审查引擎 + 官方优先逻辑 + 回归）
```

- `src/inspect.ts` —— 纯审查引擎（不依赖 cordis，可独立单测）
- `src/discovery.ts` —— 重装版外源发现（GitHub 生态索引纯逻辑，可单测）
- `src/dynamic-assembler.ts` —— 插件入口、七个工具、官方优先规划 + 全自动安全分层
- `test/` —— node:test 测试（cordis/dsh-tools 用 stub，它们只存在于 dsh monorepo 内）

## 当前能力边界（轻量版 vs 完全体）

本项目当前是 **「完全体 v0.3.5」**：外源发现（阶段一）+ 信任增强（阶段三）+ 全自动模式（阶段四）+ **语义级组合编排蓝图（阶段二）+ 会话粒度事件日志（尾款①）+ 同类候选横向对比 `assemble_compare`（黎叔实测驱动，v0.3.4 修复 Star/功能要点/审计列渲染三项缺陷，v0.3.5 修复审计列管线层根因）** 全部落地。

### 维度 · 现在能做的（v0.3.5 已落地） · 完全体后续增强
- **维度**: 插件发现 · **现在能做的（v0.3.5 已落地）**: 运行时发现已加载插件 + `pluginSources` 点名的包 + **GitHub dsh-plugin 生态社区索引**（`assemble_discover` / `discoveryMode`） · **完全体后续增强**: 同左（对接型，不重造搜索引擎）
- **维度**: 同类候选对比 · **现在能做的（v0.3.5 已落地）**: **`assemble_compare`（v0.3.3）**：Star/版本/发布日期/安装包大小/校验文件/npm 发布核实（幻影名标"仅 GitHub 发行物"）/核心功能/静态审计分横向对比；`assemble_plan` 同类≥2 候选自动附精简引导 · **完全体后续增强**: 历史对比趋势 / 自动刷新
- **维度**: 任务→能力 · **现在能做的（v0.3.5 已落地）**: 关键词/真实工具信号 → 官方优先 + 依赖拓扑排序 + **语义级组合编排蓝图**（角色分工 / 执行步骤 / 能力竞争预警） · **完全体后续增强**: 同左
- **维度**: 第三方信任 · **现在能做的（v0.3.5 已落地）**: 静态审计 + `unofficialPolicy` 闸门 + 社区候选双重兜底 + Cordis 版本兼容提示 · **完全体后续增强**: 信任评分 / 沙箱预演 / 签名校验
- **维度**: 非专业体验 · **现在能做的（v0.3.5 已落地）**: **`assemble_auto`：说目标 → 自动装好安全插件并兜底回滚**（敏感/未授权非官方自动跳过并回显需确认） · **完全体后续增强**: 同一体验 + 社区插件信任评分后也可纳入自动
- **维度**: 事件日志 · **现在能做的（v0.3.5 已落地）**: 会话级 scope 粒度（`scopeFromExec` 安全提取，恢复真实会话标识；守卫对象兜底 `<global>`） · **完全体后续增强**: 同左

**对非专业用户**：你只需用自然语言描述「想让 Agent 做什么」，本插件会挑出合适的官方插件、排出装载顺序、做安全检查并**自动装载安全部分**；敏感操作或未经授权的第三方插件会自动停下、列清单请你确认，而不是默默装错东西或悄悄放行危险操作。

**不会重复造轮子**：官方若推出官方插件市场/商店，本插件会改为「对接」而非「重造」；本插件的价值护城河在**安全编排层**（敏感闸门、供应链审计、失败回滚），这部分官方通常不会替你做。