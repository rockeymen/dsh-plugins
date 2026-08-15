# dsh-tianshu-tui — DeepSeek Harness coding 终端

[![dshfind](https://dshfind.com/api/badge/huiliyi37/dsh-tianshu-tui?lang=zh)](https://dshfind.com/zh/plugins/huiliyi37/dsh-tianshu-tui?ref=badge)

![dsh-tianshu-tui](docs/tui-screenshot.jpg)

**dsh-tianshu-tui**（`@huiliyi37/dsh-tianshu-tui`）是官方 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 上的交互式终端 UI 插件。渲染核心从 [天枢 Tianshu-Tui](https://github.com/huiliyi37/Tianshu-Tui) 演进而来（Apache-2.0；逐文件来源见 [SOURCE-MAP.md](SOURCE-MAP.md)）。UI 是纯展示层：所有 agent 状态都来自会话事件流。并做了harness工程层的个性化改造。比如TDD驱动的工作流，证据门，图像和视觉桥接，代码智能检索等功能。

## 安装

本包不是独立程序。须先有官方 CLI [`@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh)（`0.1.0-rc.6`）。只 `npm i` 本包跑不起来。

### 1. 准备环境

- [Node.js](https://nodejs.org/) `^22.19 || >=24`
- PATH 上有 [`pnpm`](https://pnpm.io/installation)（`dsh plugin` 会转发给它）

**不要直接敲 `dsh`。** 若 PATH 上已有旧的 `dsh`（例如 `~/.local/bin/dsh`，`dsh --version` 不是 `0.1.0-rc.6`），会走到本地 staging，出现 `ERR_FS_EISDIR` / `Path is a directory .../@deepseek-ai/dsh`。请始终用下面的 `npx` 命令。

### 2. 把本插件装进 tui profile

```sh
npx -y @deepseek-ai/dsh plugin --profile tui add @huiliyi37/dsh-tianshu-tui
```

pnpm 可能提示 peer missing，可忽略：peer 由官方 `dsh` 宿主提供，不必另装。

从 npm 安装后，每次启动会对照 npm `latest`：有新版本就写入 profile，提示重启后生效。不想联网检查时设 `DSH_TUI_SKIP_UPDATE=1`。`github:` / `link:` 安装不会改写成 npm 包。

也可以从 Git 装：`npx -y @deepseek-ai/dsh plugin --profile tui add github:huiliyi37/dsh-tianshu-tui`（仓库已包含 `lib/index.js`，不必再打包）。

### 3. 启动

```sh
npx -y @deepseek-ai/dsh --profile tui
```

看到欢迎页品牌 **dsh-tianshu-tui** 即成功。`Ctrl+Q` 或 `/exit` 退出。

已全局安装官方 CLI 且 `dsh --version` 为 `0.1.0-rc.6` 时，把上面的 `npx -y @deepseek-ai/dsh` 换成 `dsh` 即可。

若 `npx` 仍报 `ERR_FS_EISDIR`，是 `~/.dsh/profiles/node_modules` 里旧的安装 fallback 与官方 CLI 冲突。换干净目录再启动：

```sh
DSH_HOME=/tmp/dsh-tianshu npx -y @deepseek-ai/dsh plugin --profile tui add @huiliyi37/dsh-tianshu-tui
DSH_HOME=/tmp/dsh-tianshu npx -y @deepseek-ai/dsh --profile tui
```

不要在 DeepSeek Harness 工作区根目录对本包跑 tsdown：会把未发布的 `@deepseek-ai/dsh-root` 写进 bundle，加载必失败。

需要图片再询问能力时，再装配同仓伴生包 `vision-ask/`。

## 更新说明

当前 npm `latest`：[`@huiliyi37/dsh-tianshu-tui@0.1.2-rc.7`](https://www.npmjs.com/package/@huiliyi37/dsh-tianshu-tui)（[GitHub Release](https://github.com/huiliyi37/dsh-tianshu-tui/releases/tag/v0.1.2-rc.7)）。

### 0.1.2-rc.7（2026-08-15）

功能核查大修：视觉桥可探测、服务缺失不再静默、投影层接线出轮次摘要；平台降级全部可见化。

- 主模型不识图且未注入 vision 配置时，按宿主 `visionBridge` 服务存在性自动探测识图桥（桥插件契约见装配节）
- 缺 goal/subagent 插件时整个 TUI 不再静默不启动（goals/subagents 改为可选服务）
- `/tasks` `/subagents` `/workflow` `/status` `/config` `/skills` 面板与 plan 模式在 backing 服务缺失时回显 ⚠ 警告，不再空白无提示
- `/clear` 真清屏（此前只清内部缓冲）；`Ctrl+.` 键位表补全到 20 条并修窄宽破版
- 投影层接线：回合结束落 `turn N · 读X 改Y · 耗时` 摘要行；`/status` 新增会话汇总段（宿主投影服务缺失时仍有数据）
- 平台降级可见化：剪贴板读图工具链缺失、外部编辑器启动失败、OSC52 终端不支持、自更新失败均有明确提示
- 修复：切会话/退出时挂起的审批与提问正确结算；fiber 重挂载不再抛 DUPLICATE_PROVIDER（组合测试拦截）
- 工程：构建两段化（tsc → tsdown，杜绝旧产物重打包）、typecheck 门禁、CI、vision-ask 对齐 rc.6 类型面

已装 `0.1.x-rc.6` 的用户下次启动会自动写入 profile。看到「插件已更新到 …，请重启 dsh 后生效」后重启即可。

### 0.1.2-rc.6（2026-08-14）

退出时恢复终端光标并把 TTY 还给 shell；新增 `/exit`。

- `Ctrl+Q` / `/exit` 退出后恢复硬件光标，经宿主退出把终端还给 shell（[#22](https://github.com/huiliyi37/dsh-tianshu-tui/issues/22)）
- 无 launcher 宿主服务时 TUI 不再静默卡死
- 全屏 overlay 不再被流式输出盖住；Esc/Ctrl+C 关闭命令面板时不误提交
- 空闲空输入需连按两次 Ctrl+C 才退出；等待回复提示不再在回合结束后误显示

已装 `0.1.1-rc.6` 的用户下次启动会自动写入 profile。看到「插件已更新到 …，请重启 dsh 后生效」后重启即可。

### 0.1.1-rc.6（2026-08-14）

启动时对照 npm `latest`，把 profile 里的本包升到新版本，提示重启后生效。

**从 `0.1.0-rc.6` 升级：** 那一版还没有自更新，需要手动加一次才会带上新逻辑：

```sh
npx -y @deepseek-ai/dsh plugin --profile tui add @huiliyi37/dsh-tianshu-tui
npx -y @deepseek-ai/dsh --profile tui
```

之后再发新版本，启动时会自动写入 profile。看到「插件已更新到 …，请重启 dsh 后生效」后重启即可。不想联网检查时设 `DSH_TUI_SKIP_UPDATE=1`。`github:` / `link:` 安装不会改写成 npm 包。

本版本还包含此前已上 `main` 的显示层对齐：

- 创建会话写入 `meta.cwd`，Web UI 能列出 TUI 会话
- 欢迎页 / 状态行按 credentials 分层判断 API key
- `/model` 后 footer glance 与视觉能力跟实际模型走
- `Ctrl+S` 可恢复磁盘上的会话

第一版本基线见 [docs/BASELINE-v0.1.0-rc.6.md](docs/BASELINE-v0.1.0-rc.6.md)。

## 亮点

- **终端内的完整会话工作区** — 实时渲染、只增滚动转录、启动时会话恢复、`/fork` 探索分支、`/rewind` 回退（会话截断 + 可选文件回退）、`/export` 导出 Markdown 转录、中轮转向（`/steer` / `Ctrl+T`）。
- **图片端到端** — 剪贴板粘贴（`Ctrl+V` / 终端菜单粘贴）、以终端图形协议内联渲染（kitty / iTerm2）、经 harness 附件服务投递、让具备视觉能力的模型真正看见——主模型不识图时自动经独立视觉模型把图片转成描述（视觉桥）。
- **完整输入面** — grok 风格 slash 下拉菜单（模糊前缀匹配、MRU 排序、ghost 预览）、`@`-路径 Tab 补全与 `@mention` 展开、bracketed paste、可选 vim 键位、外部编辑器（`Ctrl+E`）、历史搜索（`Ctrl+F`）——`Ctrl+.` 随时调出完整键位表。
- **终端内交互面** — 结构化提问面板（数字键选择、plan-review 反馈模式）、带内联 `diff` 预览的挂起审批卡片、模式循环（`Shift+Tab`：normal → plan → always-approve）、命令面板，以及 status / config / skills / tasks / 委派树 / workflow 实时面板。
- **推理过程可视化** — think 通道以实时头行流动、在滚动区折叠为紧凑行（`✻ 思考 (3.2s) · 12 行`）、`Ctrl+O` 原位展开（对标竞品：默认折叠）。
- **个性化 harness 集成** — `/doctor` 终端诊断、`/memory` 项目记忆浏览器、`/btw` 后台 agent 侧问、`/model` + `/effort` 热切换（当前会话立即生效）。
- **构造上可审计** — TUI 自身不注册任何 prompt、工具或上下文面；用户输入成为普通日志消息，所有渲染状态都派生自会话事件。
- **与 harness 协同演化** — 在 2026-08-09 基线快照之上与 harness 侧能力同步开发（250+ 提交）：图片/视觉链路、DeepSeek Spark 模型工程、会话持久化与文件快照、记忆、验证门与失败路由、代码智能、git 工具。见下一节。

## 与 harness 协同演化的能力（2026-08-09 基线以来）

终端 UI 从 [天枢 Tianshu-Tui](https://github.com/huiliyi37/Tianshu-Tui) 演进而来（Apache-2.0；逐文件来源见 [SOURCE-MAP.md](SOURCE-MAP.md)）。本 bundle 随后在 DeepSeek Harness 基线快照 `snapshots/20260809T140917Z` 之上与 harness 侧工作同步开发——2026-08-10 至 2026-08-13 共 250+ 提交。下列能力位于宿主 harness（独立包，不随本 bundle 分发）；TUI 是它们的主要交互面：

- **图片链路与视觉桥** — `image` ContentBlock 加入 merge-extensible 内容词汇，`dsh-llm-deepseek` 把用户图片 block 序列化为 OpenAI 风格 `image_url` content parts——用户图片端到端可达 wire（剪贴板 → 输入行 → 会话 → 模型请求）。模型经 `supportsVision` 声明识图能力（`LlmModelInfo` + llm-deepseek catalog）。`dsh-vision-bridge` 覆盖 text-only 主控：`agent/pre-step` 时经独立视觉模型描述图片附件（`visionAutoBridge` 在未指定 provider/model 时自动选首个识图模型；备用模型 fallback + data URL 校验；prompt 按 UI/报错关键词在通用结构与 OCR 级精确转写间自动选择），描述作为 plugin-source user message 注入——Model-visible ⟺ logged；桥失败降级为可见提示，绝不整轮 failed。
- **DeepSeek Spark 别名** — 官方 API 没有 `spark` 模型，本宿主也不注册 `deepseek-spark` provider。`/model spark-flash` / `spark-pro` 映射到已注册的 `deepseek-official` 路由，wire 模型分别为 `deepseek-v4-flash` / `deepseek-v4-pro`。
- **会话持久化与文件快照** — `Session.truncate` 回卷事件日志并重置派生状态；持久化后端新增 `deleteFrom` 与 truncate 协调器，回滚跨重载存活；`dsh-fs-snapshot` 移植 FileHistory（trackEdit / rewindToBoundary），在写入工具执行前快照。TUI 入口：`/rewind`（会话截断 + 可选文件回退）。
- **记忆** — `dsh-memory`（MemoryService + Markdown 文件后端、非 git 兜底）与 `tool-memory`（`memory_save` / `memory_search` + 记忆摘要注入）提供跨会话召回。TUI 入口：`/memory`、`/remember`。
- **验证门与失败路由** — `dsh-evidence-gate` 强制执行 RED-first 验证：义务状态机、编辑/验证计数、TDD 门（`enforce` 模式）、探针建议 + 冷却、L2 终审门，原生接入 `str_replace_editor` 与 headless-agent 装配。`dsh-agent-router` 依据回合历史预测步骤失败并路由工作——含验证子代理调度与按 profile 工具限制——带真实回合 e2e 覆盖。
- **代码智能与检索** — `dsh-semantic-index`（BM25 + salience/RRF/向量融合、增量更新）以 `semantic_search` 工具暴露；`dsh-meridian` 代码索引（node:sqlite schema、TypeScript/Python/Go 三语言 tree-sitter 解析器、graph/impact/flow 查询、行为信号、后台回填）以 `repo_graph` 与 `<codebase-index>` 摘要暴露；`dsh-pheromone` 文件级信息素 + 原子 JSON 持久化，经 `file_info` 与 read 工具 `focus` 语义上屏。
- **Git 服务与工具** — `dsh-git` 服务接缝（GitLocal CLI provider，服务类即插件）+ `dsh-tool-git` 面向模型的单一 git 工具（operation 判别：status / diff / log / commit），装配进 base bundle。

## 功能

### 会话管理

### 能力 · 说明
- **能力**: `/session new\ · **说明**: list\ · switch` · 新建、列出、切换会话；恢复时经同一渲染桥重放完整转录
- **能力**: 恢复面板 · **说明**: 启动时把可恢复会话列表写入滚动区
- **能力**: `/fork [directive]` · `/branch` · **说明**: 分叉当前会话（历史复制到新子会话），可选带起始指令
- **能力**: `/rewind` · **说明**: 回退到指定消息——会话截断和/或文件回退到边界前快照
- **能力**: `/export` · **说明**: 把当前会话转录导出为 Markdown 文件
- **能力**: `/clear` · **说明**: 清空当前会话滚动区视图

### 输入面

- **Slash 命令菜单** — 输入 `/` 打开下拉菜单：模糊前缀匹配、`↑↓` / `PageUp` / `PageDown` 选择、`Tab` 接受、`Enter` 提交、MRU 排序、参数占位 ghost 与输入行 ghost 预览。
- **剪贴板与图片粘贴** — `Ctrl+V` 读取剪贴板图片（回退到文本）；终端菜单粘贴检测图片；看起来像图片的粘贴路径按附件加载；`Alt+W` / vim yank 经 OSC52 把选区复制到系统剪贴板。
- **图片提交** — 附件图片显示 `📎 N images` 标记，提交时在用户气泡下方以内联图形渲染，并经附件服务到达模型；气泡携带识图提示（已转发 / 经视觉模型桥接 / 未发送）。超大图发送前自适应压缩：长边 1568px 封顶（PNG 保留透明），逐级 JPEG 0.82 → 0.55 → 1024px + 0.55 直到低于 provider 上限，全程只缩不放。
- **编辑** — vim 键位（可选）、外部编辑器（`Ctrl+E`）、Tab 文件补全、`@mention` 展开、输入历史、多行输入、bracketed paste（多行/长文本粘贴整段进输入行，不逐行提交）；输入行绘制为完整圆角框体。
- **图片再询问** — 同仓伴生插件 `@deepseek-ai/dsh-vision-ask` 登记已发送图片，并经 `ask_image` 回答模型的定向问题（见 [vision-ask](vision-ask/README.md)）。

### 渲染与投影

- **对话流** — markdown 渲染、工具族着色 + 逐工具计时、并行工具调用折叠为组。
- **工具卡实时结算** — 已结算的工具结果按 harness presenter 意图渲染为滚动区卡片：`diff` 结果渲染结构化红/绿文件差异（与审批预览共用）、`terminal` 结果带命令标题 + cwd + 退出/信号徽标、其余折叠为文本卡片。
- **推理通道** — 思考中实时 shimmer 头行、段末折叠滚动行、`Ctrl+O` 在 live 区展开全文。
- **流利度折叠** — 重复的例行工具流量在 quiet 策略下折叠；compact 模式（`/density`）只保留头行。
- **轮次状态** — braille spinner + 阶段文本状态行、workflow 运行汇总、委派树、任务窗格、config/skills 面板作为 live-region 面板；turn 结束（非中断）且有工具调用时落 dim 摘要行（`turn N · 读X 改Y · 耗时`）。
- **Subagent 运行** — 每个运行一条 live spinner 行；终态以 `✓`/`✗`/`◌` 条目落入滚动区。
- **窗口 chrome** — 欢迎页（品牌头、友好会话短 id、环境检查行）、顶部栏（cwd + git 分支 + 模型）、底部三行区：输入行（底边线随模式着色）→ footer（模式徽标 + 快捷键提示）→ metrics 行（模型 / token 用量 / 缓存命中率）。
- **主题** — 内置调色板 + `custom:<name>`；自动终端检测与 16 色降级。

### 交互面板

- **结构化提问** — 数字键选择、`Esc` 取消、重叠保护；plan-review 反馈模式（`f` 进入、`Enter` 提交 Keep planning + 自定义反馈）。
- **审批卡片** — `y`/`N`/`Ctrl+C`