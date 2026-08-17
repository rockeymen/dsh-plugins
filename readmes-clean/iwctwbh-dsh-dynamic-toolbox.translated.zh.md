#dsh-dynamic-toolbox

> [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness): 1 个框架 + 21 个工具插件作为动态 Cordis 插件的会话工具箱 · MIT 许可证
>
> 中文文档见下方[中文部分](#中文文档)。

![工具箱抽屉·实时流程Tab](docs/screenshot.png)

每个插件都通过 **磁盘加载存根** 进行安装：有效负载约为 0.9KB 存根，实现位于磁盘上，因此只需重新运行插件即可使代码编辑生效 - 无需重新定义，无需重新批准。

## 特点

- **框架插件（tbx）**：主机端工具注册表+RPC，客户端抽屉/选项卡栏/共享HTML面板外壳（tb-设计系统）
- **实时流程（流程）**：抽屉的默认选项卡 - 具有子代理分支、并行呼叫组和向下钻取的实时会话流程图（请参阅下面的重点）
- **项目工具**：Jira（查询/归档）、Git（历史/差异）、工作区文件树
- **实用程序**：跟踪、HTTP 客户端、端口、计算 5 合 1（编解码器 / 正则表达式 / cron / 文本差异 / 生成器）、配额（跨提供商的 API 使用）、flowedit（工作流程文档）
- **会话洞察**：令牌使用、系统提示组装、上下文窗口、工具列表、全文搜索、谱系树
- **AI 工具**：aiassist 7 合 1（询问/翻译/提示优化/审查/提交消息/摘要/比较）+ 使用分类账 — 全部通过共享 `makeLlmHelper` 路由
- **自检**：自检（屏幕截图/语义快照/ui_*模型工具）
- **引导重建**：框架在启动时自动定义并启动 `plugins.json` 中所有缺失的插件（幂等，所有 22 个插件约为 0.3 秒），尊重每个插件启用内存
- **零模型调用自动启动**（可选）：`host-bootstrap/` 在会话打开时自动启动框架 — 0 次模型调用、1 次批准点击、任何模式
- **合同冒烟测试**：`node smoke.mjs` 使用模拟的 ctx/services 针对真实的插件实现运行 14 个模拟套件

## 为什么是动态的（框架优势）

- **会话拥有，而不是进程全局** - 每个会话都有自己的插件集；停止或中断一个而不触及其他插件（静态插件是一个进程范围的实例）
- **热重载** — 实现位于磁盘上约 0.9KB 存根后面：重新运行以应用编辑，无需重新定义，无需重新批准，无需重新启动进程
- **保留批准门** - 浏览器代码仍然每个进程询问一次；在安装时没有任何东西会变得无条件信任
- **不可变版本** — 包共存；更新翻转指针，回滚只需一次调用，失败的更新永远不会丢失工作版本
- **自引导重建** - 动态插件无法在重新启动后继续存在，因此框架在大约 0.3 秒内重新定义了 `plugins.json` 中缺少的所有内容；可选的 `host-bootstrap/` 触发器将其简化为“一键打开会话”
- **AI-native** — `cordis_define` / `cordis_run` 是模型工具：代理可以在运行时为自己构建和安装工具

## 开发自己的工具

耦合故意缩小：工具插件只需要 `ctx.get('toolboxRegistry').register(desc, handler)` 加上 HTML 面板协议 - 三个步骤，大约 15 行框架，仅主机工具没有客户端代码。完整指南：[`PLUGIN-DEV.md`](PLUGIN-DEV.md)。

## 焦点：Live Flow（流程）

抽屉的默认选项卡将**当前会话变成活动流程图**，每 2 秒自动刷新一次（可通过实时切换暂停）：

- **三车道布局** — 中央行李箱自上而下引导用户/助理台阶；每个工具调用都通过其输入卡 ▶ 向右分支，并通过其输出卡 ◀ 向左返回（绿色表示成功，红色表示错误，虚线表示运行中）
- **子代理分支** — 生成的子会话在与启动它的主干卡同一行上生长自己的左列分支（入口/步骤/出口），步骤从子进程自己的会话日志中采样
- **向下钻取** — 在子代理分支上点击「进入 →」以打开该子会话自己的流程图；面包屑逐层往回走，嵌套无限
- **并行组** — 一步中同时进行的工具调用被包裹在一个虚线的「玩具×N」框架中；正在运行的呼叫会突出显示，因此您始终可以准确地看到座席正在进行的步骤
- **零跳转详细信息** — 单击工具卡以获取其完整参数/结果，单击消息卡以获取包含模型 + 令牌元数据的完整内容；详细信息在侧面覆盖中打开，而不是扩大流程，因此展开/折叠永远不会移动您的滚动位置

## 快速入门（作为用户）

先决条件：DeepSeek Harness 在动态插件 (Cordis) 支持下运行；工作区目录（存储库根 = 工作区根，或克隆为其子目录的存储库）。

**路径A·自动启动（您自己的机器，安装一次 - 推荐）**

```text
1. pwsh host-bootstrap/install.ps1     # idempotent; uninstall with -Uninstall
2. Restart DSH
3. Open any session in any mode → first-time ask card → approve once
   → the framework auto-bootstraps all 22 plugins (selfview asks for one more approval)
```

**Path B · zero-install (AI-driven, nothing persisted in DSH)**

```text
1. Switch the session to 「创造模式」(Creative mode — the only preset mounting cordis_define/cordis_run)
2. In the session: cordis_define ← plugins/toolbox/payload.json
3. cordis_run and approve once → the framework auto-bootstraps the rest
```

Either way: daily rebuild/rerun/toggle afterwards works in **any mode** — the drawer manage view and the Cordis panel drive the process-global runner directly. Credentials (e.g. Jira) live in the Harness credential store or environment variables — never in this repo. Full guide: [`REBUILD.md`](REBUILD.md), plugin authoring: [`PLUGIN-DEV.md`](PLUGIN-DEV.md).

# 中文文档

> DSH 工具箱（动态 Cordis 插件集）· MIT License

> 运行在 DeepSeek Harness 上的会话级工具箱：1 个框架插件 + 21 个工具插件，
> 全部以「磁盘加载桩」方式挂载——payload 是 ~0.9KB 的桩，实现全在磁盘，改代码重跑即生效。

## 使用（把本仓库装进你的 DSH）

前置：已安装并运行 DeepSeek Harness（支持动态 Cordis 插件）；仓库根作为工作区打开（或 clone 为工作区的一级子目录）。

**方式 A · 自动自举（自己的机器，装一次——推荐）**

```text
1. pwsh host-bootstrap/install.ps1     # 幂等；卸载加 -Uninstall
2. 重启 DSH
3. 任何模式开新会话 → 首次弹「工具箱自举」询问卡（记住/仅本次/别再问）→ 批准卡点允许
   → 框架自动补齐全部 22 个插件（selfview 会再弹一张批准卡）
   （注册表按仓库分键：同一仓库已有框架实例时新会话跳过自举，直接共享；不同仓库各自自举并行共存）
3. 多工作区并存：同一 DSH 进程内多个工作区可并行（抽屉跟随当前工作区切换，v6.3 multiplex）；
   需要进程级隔离时再走「每项目一个独立 DSH 实例」——均见 `REBUILD.md` → **多工作区并存**小节。
```

**方式 B · 零安装（AI 驱动，DSH 里不留任何东西）**

```text
1. 会话切到「创造模式」（唯一挂载 cordis_define/cordis_run 的 preset）
2. 会话中：cordis_define  ←  plugins/toolbox/payload.json
3. cordis_run，批准一次 → 框架自动补齐其余插件
```

两条路互不冲突、随时互切：bootstrapper 幂等跳过已定义，框架 doRebuild 幂等补齐缺失。跑起来之后，日常补齐/重跑/启停在**任何模式**都能进行——抽屉管理视图与 Cordis 面板直驱进程级全局 runner，不经过模型工具。

- 启动集合遵循启停记忆 `<工作区>/.dsh-dynamic-toolbox/toolbox-plugins.json`
- 主题插件（青绿/暖橙）只 define 不启动，互斥按需激活
- 凭据（Jira 等）走 Harness 凭据存储或环境变量，**不写入本仓库任何文件**
- 手动逐条路径、启停记忆、headless 注意事项等完整细节见 [`REBUILD.md`](REBUILD.md)

## 框架优势（为什么全动态）

- **会话级归属**：每个会话独立一份插件集，改砸/停掉互不影响（静态插件是进程全局单份）
- **桩热重载**：实现全在磁盘、payload 仅 ~0.9KB 桩；点「重跑」即生效，不重启进程、不重新批准
- **批准闸门保留**：浏览器代码每进程仍过一次手，不存在"安装即永久信任"
- **不可变多版本**：Package 并存，update 切指针、失败不丢旧版、回滚一条命令
- **自举重建**：动态插件不跨进程——框架启动自动补齐缺失（~0.3s）；配 host-bootstrap 则开会话即重建
- **AI 原生**：`cordis_define` / `cordis_run` 是模型工具，智能体能在运行时自己造工具装上用

## 扩展：开发自己的工具插件

耦合面只有两条——`ctx.get('toolboxRegistry').register(desc, handler)` 和 HTML 面板协议。新插件三步：建 `plugins/<key>/tool.js` → `make-payloads.mjs` 的 PLUGINS 表加一行 → `node make-payloads.mjs` 后 define+run；骨架约 15 行，Host-only 不用写 Client 代码。完整指南（面板契约/踩坑/主题/冒烟）：[`PLUGIN-DEV.md`](PLUGIN-DEV.md)。

## 插件清单（22）

### 分组 · 插件
- **分组**: 框架 · **插件**: toolbox（Host 注册表 + Client 抽屉/Tab/面板壳）
- **分组**: 项目工具 · **插件**: jira（查询/归档）、git（历史/diff）、files（文件树）
- **分组**: 主题 · **插件**: theme-teal / theme-amber（互斥，按需激活）
- **分组**: 实用工具 · **插件**: trace、http、ports、calc 5 合一（编解码/正则/Cron/文本对比/生成器）、quota（API 配额）、flowedit（工作流文档）
- **分组**: 会话洞察 · **插件**: flow（实时流程图）、usage、prompt、context、tools、search、lineage
- **分组**: AI 工具 · **插件**: aiassist 7 合一（问答/翻译/优化/评审/提交信息/摘要/对比）、aiusage（台账）
- **分组**: 界面自查 · **插件**: selfview（截屏/语义快照/ui_* 模型工具）

## 亮点：实时流程（流程 Tab）

抽屉默认 Tab，把**当前会话实时画成流程图**，每 2s 静默自刷（live 开关可暂停）：

- **三列泳道**：中列主干自上而下走「用户/助手」步骤；工具调用右出输入卡 ▶、左回输出卡 ◀（成功绿色、错误红色、进行中虚线）
- **子代理分支**：子会话在左列长出独立支线（入口/支线/出口），与触发它的主干卡同行不留空白，支线步骤取自子会话自己的日志
- **钻取**：点分支上的「进入 →」打开该子会话自己的流程图，「← 返回」逐级退回，嵌套不限层数
- **并行分组**：同一步的多个并行调用用虚线框 +「并行 ×N」角标圈成一组；进行中的调用高亮脉冲，一眼看到智能体正跑到哪一步
- **零跳跃详情**：点工具卡看完整传入/返回，点消息卡看完整内容（含模型/tokens 元信息）；详情挂右侧浮层、不撑高流程内容，展开收起滚动位置不动

## 日常迭代

```text
改 plugins/<key>/tool.js（或 framework、shared、loader）
  → 抽屉齿轮「重跑」该行即生效（不用重新 define/批准）
  → 批量改完点「全部重跑」
插件增减/改 inject → 编辑 make-payloads.mjs 的 PLUGINS 表
  → node make-payloads.mjs 重新生成 + 语法检查
改 shared/framework/面板协议 → 必跑 node smoke.mjs
```

## 数据与隐私约定

以下内容**不入库**（见 `.gitignore`）：

### 路径 · 内容
- **路径**: `.dsh-dynamic-toolbox/` · **内容**: 运行状态与历史：Jira 查询记录、AI 台账、启停记忆、自举偏好、自动补齐报告
- **路径**: `.dsh-dynamic-toolbox/data/` · **内容**: 内容产物：Jira 工单归档（issue.md/json + 附件）
- **路径**: `.scratch/` · **内容**: 开发草稿/一次性脚本

## 文档索引

- [`REBUILD.md`](REBUILD.md) — 目录结构、重建（含零模型调用自举）、迭代、数据与凭据
- [`PLUGIN-DEV.md`](PLUGIN-DEV.md) — 新插件三步、impl 骨架、面板契约
- [`插件.md`](插件.md) — 心智模型与真实坑清单