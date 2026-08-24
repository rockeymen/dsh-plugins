# dsh-router-standard

> # ⚠️⚠️⚠️ 重要勘误与道歉（必读） ⚠️⚠️⚠️
>
> ## 我不需要被造神，也不配被造神
>
> 这篇 README 顶部必须放这段话：**我错了，而且错得很有代表性。**
>
> - **论文不撤回**，但其中**理论解释部分（双吸引子假设 A1–A4 及"god/ghost"、"自路由不可能"等强归因）已正式标注作废**。
> - **心路历程**：我最初把 "We need / Let me" 的差异当成"官方刻意设计的双模式"；后来才意识到那更可能是**一条原生深度路径 + 一条后压未收敛的极简路径**之间的**断层/断裂带**。这个断层**本身就像一层路由层**——我们实际做的是把它当路由层用，实现了 "Let me / We need" 自路由。
> - **我们做对了一件事，也请记住这件事**：**利用后训练的一个小缺陷（断层/断裂带），我们实现了 V4 Flash 能力的可复现提升**——这不是我聪明，是那个缺陷恰好可被工程利用。
> - **Pro 是另一场完全不同的硬仗**：雷霆大思考、工具面敏感、内部路由不稳定。**我已经找到方向**（黑盒 logprobs / 嵌入向量层逆向 / 语义锚点指纹），初步数据已在仓库。这条路我会继续用实测走，而不是用叙事走。
>
> 📄 完整勘误声明：[docs/statement.md](docs/statement.md) ｜ 道歉函：[docs/apology.md](docs/apology.md)

## 当前状态（v1.8.0，2026-08-22 · 研发线，尚未发布）

**Router Standard 已进入「渐进式披露套装」研发线**（五轮真实会话实测驱动；发布与否以研发定稿为准）：

- **渐进披露**：四阶段解锁 + 两档预放（阶段 0 即用 write/edit）+ 直达语义（调用哪档工具就跳到哪档）+ 交付全量开放；
- **二级注册表**：`tools_catalog`（全量索引 + 阶段标记 + 参数名/类型/上限速览）/ `tools_help`（完整 schema）；
- **PTC 底座**：run_code 阶段化 SDK（39K → 阶段可见签名），工具面注意力税大幅下降；
- **页面验证内置**：`dev_page_check` = 截图 + DOM smoke + **console/pageerror/title/selector/scale**；`{js:…}` 模式 = 本地 JS 引擎（语法检查+纯逻辑单测，零外部 node 依赖）；
- **描述 ⇄ 行为对齐**：`presentation=code|native` 自检、阶段文案只说真话、平台事实（win32 仅 pwsh、node 入 PATH）；
- **压力感应**：真实事件通道 + 模型自适应 + 自检信号语义清楚（不是停手命令）。

配套预设：**router-react（v17）/ router-spec（v10）**（基于标准模式的两大执行预设，均支持 v4-flash-vision-exp 首轮读图——`read_image` 首轮面）。router-pro 线已退役删除。
完整演进：见 [CHANGELOG.md](CHANGELOG.md) 与 [docs/STANDARD-PLAN.md](docs/STANDARD-PLAN.md)。

**【历史文档 · v0.3 时代】** Task-aware reasoning-mode router for DeepSeek Harness. One preset, two
**routing modes** (v0.2.0 naming), plus the measured three-band axis behind them:

### routing mode · first request · thinking shape
- **routing mode**: **standard（标准路由预设）** · **first request**: 分类 persona（spec/react/weak）+ 完整 prompt sections + 分带首轮工具面 · **thinking shape**: 按分类带行动：react 直接产出、spec 先读后改、weak 内路由（每轮近距离引导）
- **routing mode**: **spec（spec 路由预设）** · **first request**: 分类 persona（spec/react/weak）+ 完整 prompt sections · **thinking shape**: **雷霆大思考**：首轮超长思维链（101K 推理 0 行动是其特征，不是缺陷）

> 选择：安装两个预设之一（Router Standard / Router Spec，见 Usage）。
> `dev_router_status` 显示当前路由模式。

> This is a research artifact. It encodes a measured property of DeepSeek V4
> Pro / V4 Flash: model behavior along the persona axis is **not a continuum**
> — it collapses into a few stable regions separated by phase transitions.
> The router therefore quantizes to the stable regions instead of pretending
> the axis is continuously tunable.

## v0.3.0 — real-assembly-chain fixes

v0.2.x shipped routing logic that was validated against bare-API probes but
was broken on the REAL DeepSeek Harness assembly chain. v0.3.0 fixes all of it,
verified against `@deepseek-ai/dsh-agent-loop` (0.1.0-rc.7) event ordering:

- **首轮路由实际上有效**（问题＃13）：循环声明收件箱
  在组装系统提示符之前，`inbox.claim()` 会发出
  代理范围的 `agent/inbox/claimed` 事件同步 — 路由器捕获
  第一条真实用户消息（仅限 `source.kind === 'user'`），因此
  第一个请求被分类，而不是无条件落入弱类。
  （捕获的文本已分类，未馈送到 bandOf raw — 旧的捕获
  路径默默地将每条捕获的消息映射到规格带。）
- **近场指导移至 `agent/pre-step`**（问题#34/#36/#55）：
  `session/event` 永远不会在代理平面预设内触发（dsh 范围过滤器
  它超出了入口本地领域），因此旧收件箱重新附加从未送达
  指导——无论它在哪里触发，`next-step` 附加都会迫使第二次
  每个用户消息的模型请求（2× API 调用峰值）。指南现在是
  插入到 `decision.messages` 的 `agent/pre-step` 中：与
  用户消息、近场、缓存中立、零额外往返。
- **修复**：两个引导文件中缺少 `extractText`/`bandOf` 导入
  (#11) — `session/event` 处理程序在任何时候都会因 ReferenceError 崩溃
  他们确实开火了； `sessionMode` 固定时忽略插件来源消息
  乐队； `router.test.mjs`导入路径； preset.yml YAML 引用 (#53)；
  子代理会话跳过 (#5)；会话选择的模型来自
  `assembled.variables` (#9);现在规格预设的 RL 标准模式
  在第一个工具/调用之后返回原样的程序集 (#44)。
- **新**：`router.integration.test.mjs` 重播真实主张 → 组装 →
  根据实际引导代码进行预步骤排序。

## 它的作用

**路由器标准**：读取会话的第一条真实用户消息，进行分类
任务（构建→反应/修复→规格/模糊→弱），并且在第一个
模型请求注入匹配的角色，同时保留完整的提示
部分；第一圈取芯工具表面跟随带材
（spec=读/编辑/glob/grep，react=读/写/编辑，weak=读/写/编辑，每个
加上平台外壳）。弱频段会话还获得近场路由
与每个真实用户消息相同的请求中的指南。

**路由器规格**：具有深度思考优先品牌的相同路由核心；保持
v0.2.0 双模式代码路径 (`routerMode`)，因此配置的副本
`routerMode: standard` 仍然获得 RL 接口第一回合（RL 语句 +
shell/str_replace_editor)，在第一个持久之后恢复完整部分
工具/调用。

在第一个持久工具调用之后，完整的标准目录就会公开，并且
路由器停止接触任何东西。该模式源自持久会话
事件，因此恢复/重新加载会保留它。保留计划模式提示部分，
因此计划边界不会重置模型的焦点。

## 三个测量的行为范围

细粒度探测（21个模式点×n=2，官方API，reasoning_effort=max）
在 V4 Pro 上显示沿角色轴的行为折叠成**三个带**：

###频段·模式·测量行为
- **频带**：`spec` · **模式**：0 – 0.19 · **测量行为**：稳定的计划集体（`We` 轨迹，让我 ≈ 0）
- **频带**：`mixed` · **模式**：0.2 – 0.49 · **测量的行为**：**过渡陷阱**：`We`/`The`/`Let` 的不稳定混合
- **频段**：`react` · **模式**：0.5 – 1.0 · **测量行为**：稳定的行动者（`The`/`Let` 第一人称，我们 ≈ 0） - 11 个模式值表现相似

V4 Flash 类似于阈值（所有规格方面均为 0–0.5，在 0.75+ 时跳跃）。数字
`dev_router_mode` 接口保留，但它量化为三个频段 -
过渡带永远不会自动选择。

## 为什么：双吸引子强化学习策略

跨项目的证据（参见 `docs/paper.md` 和 `docs/experiments.md`）：

- **同一型号**在规格条件下达到最高分数
  维护基准（项目2：最低99/96，锚定98/99）及以下
  在绿地构建任务上反应/代码条件（马里奥：10/10），而
  错误模式得分分别为 91 / 6 — 与提示相差约 10 分
  单独的调节（“神/鬼二元性”）。
- 角色是主要触发因素（一句话交换翻转轨迹）；
  工具模式表面是次要条件；用户消息中的目录文本
  没有影响。
- 行为是路径提交的：一旦锚定，就扩展工具目录
  最多干扰一个推理块并且永远不会翻转模式。
- 中间角色是**分布外**（训练-分布
  间隙），这是测量的不稳定带。

模型不能自路由：P3（相同角色，任务交换→轨迹
不变），P5（路由器角色 → 行动者吸引子吸收指令）和
P8（域重叠扫描）显示唯一的内部路由窗口是弱的
角色+少镜头路由指令（精益，不翻转；歧视
+2.3..+3.3)。会话中途切换模式没有奖励信号，并且
行为阶段转换意味着模型在第一个请求时提交。
**模式选择必须来自外部**——一个人（“主播”）、一个
启发式分类器，或学习路由器。该预设是自动的
该外部路由的版本。

## 用法

**两个预设**（v0.3.0；router-pro 系列已退役）：在 `~/.dsh/.agent-presets/` 下安装一个或多个：

```powershell
# 标准路由预设（RL 接口还原，默认推荐）
$target = Join-Path $env:USERPROFILE '.dsh\.agent-presets\router-standard'
Copy-Item -Recurse .\preset\router-standard $target

# spec 路由预设（深度思考优先）
$target = Join-Path $env:USERPROFILE '.dsh\.agent-presets\router-spec'
Copy-Item -Recurse .\preset\router-spec $target
```

**免重启安装（推荐）**：装好 [dsh-super-injector](https://github.com/yjh051108/dsh-super-injector)
后（见套件 `scripts/install-injector.ps1`），改预设代码不再需要换文件名/重启：

```
dev_reload_preset router-standard   # 预设热更新：?v=N query 绕 ESM 缓存，新会话立即用新代码
```

**注意事项（实测血泪）**：

1. **ESM 缓存**：loader 按 URL 缓存模块——原地覆盖文件内容不生效（改代码必须
   `dev_reload_preset` 或换文件名）。
2. **首次会话必须新开**：路由模式在首个请求锁定（路径承诺），中途切 GUI 模型/
   改配置不影响已运行会话。
3. **子代理不路由**：`parentSession` 会话跳过路由层（社区 #5 修复），shell-less
   子代理不再崩溃。
4. **引导注入通道**（v0.3.0）：近场引导走 `agent/pre-step`，每个真实用户消息
   注入一条（weak 模式）；rc.6 起 `session/event` 在 standing scope 收不到事件，
   旧版本引导是死的。
5. **首轮真实分类**（issue #3/#13）：首轮路由读 `agent/inbox/claimed` 的原始
   消息文本并经 `classifyTask` 分类——首轮即真实 band