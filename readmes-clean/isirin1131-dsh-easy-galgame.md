# dsh-easy-galgame — Easy Galgame 模式

一个 DSH 插件：把 agent 变成 **Galgame 引擎兼编剧**，游戏本体是**一个文件**——角色卡 + 世界书 +
剧本 + 规则 + 状态全部塞进这一串提示词里。引擎（游玩）与编辑器（改卡面）共用同一个文件，
游戏结束把状态写回文件，接着就改文件。

```text
┌────────────────────────────────────────────────────────────┐
│ galgame.md（一个文件 = 整个游戏）                            │
│   # 雨夜旅店 — galgame card                                 │
│   ## [rules]      画面/选择/人设/结局纪律                    │
│   ## [characters] ### 角色卡：白鸟琉璃 …                     │
│   ## [worldbook]  世界设定条目                                │
│   ## [scenario]   章节与结局                                 │
│   ## [state]      进度/好感度/持有物/flags（写回位置）        │
└────────────────────────────────────────────────────────────┘
```

## 它提供什么

### 能力 · 说明
- **能力**: **模式系统提示词** · **说明**: 注入「开机协议 → 玩/不玩 → 引擎模式 → 结束写回 → 编辑模式」的完整流程约束
- **能力**: `galgame_read` · **说明**: 加载卡面文件（默认 `galgame.md`）；不存在时返回内置 starter 供创建
- **能力**: `galgame_write` · **说明**: 全量写回卡面文件：编辑改卡面与游玩写状态共用这一个入口；校验首行 `# 标题`
- **能力**: `galgame_ask` · **说明**: 向玩家提问/呈现选择（游戏内选项按钮、模式询问、存档确认）

三个工具自包含（宿主平面），依赖已有的 `ctx.tools` / `ctx.systemPrompt` / `ctx.userQuestions`
（web 配置文件自带 UI 提问面板），无其它运行时依赖。

## 模式流程（插件注入的系统提示词）

1. **开机协议**：每个新会话第一步先用 `galgame_read` 加载卡面；不存在则展示 starter 并询问是否创建。
2. **询问**：开始游戏，还是编辑？以用户意图为准，不强行推销。
3. **引擎模式**：严格按角色卡/世界书/剧本演绎；`galgame_ask` 给 2–4 个选项；维护好感/flag/进度。
4. **结束**：用户喊「结束/存档/到结局」或到达结局 → 先把最新 `[state]` 完整写回，再汇报并问是否进入编辑模式。
5. **编辑模式**：agent 当编剧，讨论并修改整串提示词（角色卡、世界书、剧本、规则、状态），
   每次实质修改立即 `galgame_write` 写回（先读后写），改完可提议立刻试玩。

## 文件契约

```text
# 标题（首行必须是 # 开头）
## [rules]        规则
## [characters]   角色卡，条目为 ### 角色卡：名字
## [worldbook]    世界设定
## [scenario]     章节与结局
## [state]        一行一字段：进度 / 好感度 / 持有物 / flags / 上次游玩
```

- 写回时保留段落骨架，内容自由演进；
- `galgame_write` 拒绝空文本与缺少标题行的内容，缺段落只警告不阻断。

## 安装

### 运行时热装（推荐开发态）

```powershell
dev_inject_plugin D:\dsh\dsh-easy-galgame
```

### 官方装配（重启后由 bundles 接管）

```powershell
dsh plugin --profile web add D:\dsh\dsh-easy-galgame
# 或从 tgz / GitHub Releases 安装
dsh plugin --profile web add dsh-easy-galgame-0.1.0.tgz
```

### 手动

1. `DSH_CHECKOUT=<dsh-checkout> bash scripts/build.sh` 产出 `lib/`；
2. `npm pack` 得到 tgz，走上面任一安装路径。

## Agent preset 版（提示词驱动，零构建）

本模式另有 **DSH agent preset** 形态（`preset/` 目录）：**没有特制工具**，
整个预设就是一段 persona 提示词（告诉 agent 这是干嘛的：卡面契约、引擎/编剧
双角色、分批读素材的上下文纪律）+ 常规工具面（`read` / `write` / `edit` /
`glob` / `grep` / `bash` / `web_search` / `ask_user_question` / `todo`）。
卡面是普通 Markdown 文件，素材也是；引擎与编剧切换只发生在提示词层面。

```powershell
# 安装：拷到用户预设根目录，新开会话选「Galgame 模式」
mkdir -p ~/.dsh/.agent-presets/galgame
cp -R preset/* ~/.dsh/.agent-presets/galgame/
```

与插件版的差异：模式说明在提示词里而非插件注入；工具无特制（早期版本的
galgame_read/write/ask 已废弃——大批素材时特制工具反而限制自己，没有通用
读文件工具、读原文只能整段塞上下文）。卡面文件**固定 `galgame.md`**（工作区
根目录，提示词约定；常规 read/write/edit 操作），开局第一步直接读它，不用找。
详见 [`preset/README.md`](preset/README.md)。

## 配置

```powershell
dsh plugin --profile web set dsh-easy-galgame file "我的galgame/雨夜旅店.md"
```

或每次调用时用 `file` 参数临时指定（`galgame_read` / `galgame_write` 均支持）。

## 示例

- `examples/starter.galgame.md` —— 内置 starter（雨夜旅店），第一张卡的起点；
- 卡面不存在时 `galgame_read` 的返回里就带 starter 全文，确认后 `galgame_write` 一次写入。

## 开发

```bash
DSH_CHECKOUT=/path/to/deepseek-harness bash scripts/build.sh   # src/ → lib/
bash scripts/build.sh                                          # 自动探测常见 checkout 路径
node --check lib/index.js                                      # 语法检查
```