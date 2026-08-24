# dsh-plugins

[中文](#中文) | [English](#english)

Community client-UI plugins for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) — 社区开发的 DeepSeek Harness 客户端 UI 插件。

## 中文

五个即装即用的 Web UI 插件。当前从 GitHub 源码安装（npm 包稍后发布）：

```sh
git clone https://github.com/Horizon215/dsh-plugins.git
cd dsh-plugins
pnpm install && pnpm build
dsh plugin --profile web add file:./packages/prompt-templates file:./packages/token-stats file:./packages/quest-mascot file:./packages/previously-on file:./packages/mode-switcher
```

装完重启 `dsh web` 即可（插件声明了 `dsh.bundle`，会自动装配进 profile，无需手动改配置）。

### 📊 dsh-token-stats —— Token 用量与成本统计

![每轮用量条](assets/token-stats-chip.png)

- **每轮用量条**：每轮对话末尾显示 `输入 · 输出 | 缓存命中率 | 耗时 | ≈成本`
- **本会话徽章**：侧栏底部（设置按钮上方）实时显示当前会话 tokens + ≈成本 + 缓存命中率，附「今天 · 全部会话」全局一行
- **汇总仪表盘**（设置 → 用量与成本）：后台扫描器覆盖**全部会话**（含从未打开过的），四格指标 + 缓存命中率 + 估算成本 + 总请求数，可一键重扫；清空统计不会被扫描复活
- **一个时间范围管全部**：今天 / 近 7 天 / 近 30 天 / 全部 同时驱动仪表盘、趋势图、模型表
- **按天下钻**：点击趋势图任意一天，看当天每个会话各烧了多少
- **使用趋势图**：累计用量面积图，随对话动态增长；切换范围有描绘动画
- **按模型统计**：分模型的 请求数 / tokens / ≈成本 / 单次均价，按事件真实时间归属
- **价格预设**：内置 DeepSeek V4-Flash / V4-Pro / Kimi K3（人民币与美元）刊例价，可选手动微调；改价后所有展示实时重算

![设置页](assets/token-stats-settings.png)

![按天下钻](assets/token-stats-drill.png)

![侧栏本会话徽章](assets/token-stats-sidebar-badge.png)

### 📝 dsh-prompt-templates —— 提示词模板库

![模板管理](assets/prompt-templates-modal.png)

- 输入框右侧新增模板按钮，保存常用提示词
- 一键**插入**到草稿（自动空行拼接）或**插入并发送**
- 模板增删改查，两步删除防误触；首次使用自带三条起步模板（可删）
- 数据保存在浏览器 localStorage，不上传任何服务器

### 🐳 dsh-quest-mascot —— 打工鲸伙伴

![鲸鱼娘趴在输入框上](assets/qm-v2-persona-whale.png)

  ![经典鲸 · 标准模式](assets/qm-v2-persona-whale.png)
  ![极客鲸 · PTC 模式](assets/qm-v2-persona-tech.png)
  ![素素鲸 · 极简模式](assets/qm-v2-persona-plain.png)
  ![星光鲸 · 创造模式](assets/qm-v2-persona-starry.png)

- **四套皮肤同一只鲸**：标准=经典鲸 / PTC=极客鲸 / 极简=素素鲸 / 创造=星光鲸，跟随会话模式自动换装；右键可手动钉皮肤或恢复跟随
- **摸头杀**：单击脸红冒爱心，连击有彩蛋（7 连击放烟花庆祝），双击转圈，悬停歪头；键盘 Enter 也能摸
- 跟着任务实时变脸：规划 📋 → 阅读 📖 → 思考 💭 → 打工 🔨 → 收工 🎉，卡住会晕圈，泡泡同步播报步骤+耗时
- 闲置久了**趴着打瞌睡**（1/5/15 分钟可调），点一下唤醒；**安静模式**只留表情不要语音
- 闲暇吐泡泡：上轮战报、今日统计（**联动 token-stats 播报 ≈成本**）、小贴士、四套性格俏皮话轮换
- 设置页「打工伙伴」：逐模式皮肤、安静模式、打瞌睡延迟；44 帧 512px AI 贴纸无损 WebP 内联，中英双语、尊重 reduced-motion

  ![摸头脸红](assets/qm-v2-poke.png)
  ![连击庆祝](assets/qm-v2-combo.png)
  ![打瞌睡](assets/qm-v2-sleeping.png)

### 🎬 dsh-previously-on —— 前情提要 + 交接单

![前情提要卡](assets/previously-on-v2-card.png)

- 打开旧会话，输入框上方淡出**美剧片头式回顾**：目标 · 轮数/步数 · 最后活跃 · 未完成 TODO · 你上次说的话
- **📋 复制交接单**：把目标 / 进展 / 待办 / 最近发言 / **涉及文件**（从工具调用参数折叠）生成零 LLM 的 Markdown 交接单，一键进剪贴板
- **🚀 带去新会话**：在**同一工作区**、以**同一智能体模式**新建会话并自动跳过去，交接单作为第一条消息排入队列——长任务轻装续跑
- 约 14 秒自动淡出；按会话记忆已读轮数，有新进展或静默 2 小时后才再次播报
- **零 LLM 消耗**：全部由会话日志与官方投影确定性折叠；人类消息按来源过滤，不会把上下文注入当成你的发言

![交接单带入新会话](assets/previously-on-v2-carried.png)

### 🎛️ dsh-mode-switcher —— 模式切换器

![模式胶囊条](assets/mode-switcher-bar.png)

- **输入框上方一排模式胶囊**：`Plan` · `审查` · `快答`，点一下切换、再点退出，激活常亮
- **驱动官方 Plan 模式而非重造**：Plan 胶囊走 `/plan` 命令通道，官方 Plan 芯片、输入框占位文案、`exit_plan_mode` 流程全部跟随
- **审查模式**：改编自 OpenAI Codex 的审查 rubric（Apache-2.0）——只读审查、发现按 `[P0]`–`[P3]` 分级、结尾一行总体结论
- **快答模式**：改编自 Codex 默认协作模式——先给答案、合理假设优于追问、最少工具调用
- **状态只落日志**：`modeswitch/mode` 会话事件最后一条生效，刷新/恢复/分叉后模式都在；提示词段注入可在会话日志 `request/header` 里验证
- 也支持斜杠命令：`/mode review` `/mode quick` `/mode off`

![Plan 模式联动](assets/mode-switcher-plan.png)

![审查模式实战](assets/mode-switcher-review.png)

### 兼容性

- 需要 dsh ≥ `0.1.0-rc.5`（在 `0.1.0-rc.5` / `0.1.0-rc.6` 上验证通过）
- 仅 Web UI（`dsh web`），TUI/headless 不受影响
- 所有数据仅存浏览器本地；成本为估算值，以供应商账单为准

### 卸载

```sh
dsh plugin --profile web remove @your-scope/dsh-prompt-templates @your-scope/dsh-token-stats @your-scope/dsh-quest-mascot @your-scope/dsh-previously-on @your-scope/dsh-mode-switcher
```

### 本地开发

```sh
pnpm install
pnpm typecheck   # 类型检查（对齐官方 monorepo 的严格度）
pnpm build       # 产出 packages/*/lib/client.js
```

构建预设 `build/client-bundle.mjs` 提取自官方仓库的 `packages/client/tsdown.client.ts`（MIT），
包含模块表 externals、纯净性检查和 CSS Modules 内联，与官方插件的构建产物结构完全一致。

## English

Five drop-in client-UI plugins for the DeepSeek Harness web UI. Install from source (npm packages coming soon):

```sh
git clone https://github.com/Horizon215/dsh-plugins.git
cd dsh-plugins
pnpm install && pnpm build
dsh plugin --profile web add file:./packages/prompt-templates file:./packages/token-stats file:./packages/quest-mascot file:./packages/previously-on file:./packages/mode-switcher
```

Restart `dsh web` afterwards — the packages declare `dsh.bundle`, so they join the profile automatically (no manual config edits).

### dsh-token-stats — token usage & cost

- **Per-turn chip** under each completed turn: `input · output | cache hit | duration | ≈cost`
- **This-session badge** at the sidebar foot (above Settings): tokens + ≈cost + cache-hit detail, plus a "today · all sessions" line
- **Aggregate dashboard** (Settings → Usage & Cost): a background scanner covers **every session** (even never-opened ones) via the same loopback RPC the UI uses — four-bucket cards, cache-hit bar, estimated cost + request count, one-click rescan; reset survives rescanning
- **One range scopes everything**: Today / 7d / 30d / All drives dashboard, trend chart and model table together
- **Day drill-down**: click any day in the trend chart for that day's per-session breakdown
- **Usage trend**: cumulative area chart, growing live as turns complete
- **Price presets**: DeepSeek V4-Flash / V4-Pro / Kimi K3 list prices (CNY & USD), freely editable; every display reprices live

### dsh-prompt-templates — prompt template library

- Composer 工具栏按钮打开管理器模式：创建/编辑/删除模板
- **插入**追加到草稿中（空行加入）； **插入并发送**立即触发
- 三个入门预设 (zh) 一次播种到一个空库中 - 删除永远不会复活它们
- 模板保留在浏览器本地存储中——没有任何东西离开机器

### dsh-quest-mascot — 任务鲸鱼伴侣

- Q 版鲸鱼连帽衫女孩**栖息在作曲家身上** — 始终在视野中，从不妨碍
- 实时反应：思考💭→工作🔨→完成烟花🎉（或卡住时头晕）
- 闲置约 8 秒后缓慢吹出**喷出气泡**：任务报告和今日统计数据（**≈通过代币统计价格配置的成本**）、提示、俏皮话
- 中英文遵循UI语言环境；仅在内存中，未上传任何内容

### dsh-previously-on —“以前...”回顾+交接

- 重新打开旧会话，**电视风格的回顾卡**会在作曲家上方淡入：目标·回合/步骤·最后一个活动·待办事项·你的遗言
- **📋复制交接** - 将目标/进度/TODO/最后一句话/**触及的文件**（来自工具调用参数）折叠到零LLM Markdown交接文档中，直接到剪贴板
- **🚀 转移到新会话** — 使用**相同的代理预设**在**同一工作区**中创建一个新会话，跳过并将文档作为其第一条消息进行排队：长任务继续轻量级，不会使旧会话的上下文膨胀
- 约 14 秒后自动消失；每次会话的解雇记忆仅在进行时或安静 2 小时后重新显示
- **零法学硕士成本** - 根据会话日志和官方预测确定性折叠；按消息源类型过滤的人类语音

### dsh-mode-switcher — 协作模式胶囊

- **作曲家上方的一键模式胶囊**：`Plan` · `Review` · `Quick` — 单击切换，再次单击离开
- **驱动官方计划模式**，不是重新实现：`/plan` `/plan off`通过命令通道，主机投影回读；胶囊隐藏在没有计划模式的部署中
- **评审模式** — 改编自 OpenAI Codex 评审准则 (Apache-2.0)：只读审稿人立场，结果标记为 `[P0]`–`[P3]`，一行判决
- **快速模式** — 改编自 Codex 的默认协作模式：首先回答、对问题进行假设、最少的工具
- **仅记录状态**：最后一个 `modeswitch/mode` 事件获胜 - 重新加载/恢复/分叉后仍然存在；注入的提示部分可在会话日志的 `request/header` 中验证
- 斜线命令：`/mode review` `/mode quick` `/mode off`

### 兼容性和隐私

- 需要 dsh ≥ `0.1.0-rc.5`（在 rc.5/rc.6 上验证），仅限 Web UI
- 所有数据都保留在浏览器本地存储中；成本为估算值——您的提供商发票胜出

### 发展

```sh
pnpm install && pnpm typecheck && pnpm build
```

构建预设 (`build/client-bundle.mjs`) 是从上游存储库中提取的
`packages/client/tsdown.client.ts` (MIT) — 模块表外部，捆绑纯度
包含门和 CSS 模块内联，生成字节结构相同的工件
到第一方插件。