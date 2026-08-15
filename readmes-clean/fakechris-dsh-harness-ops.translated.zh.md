# dsh-harness-ops — DeepSeek Harness 运维工具箱（自愈 + 版本轮换）

> **升级、重启、故障——都变成"不用操心"的事**。给 DSH 用户 / 插件开发者 / 部署运维者。
>
> **① 官方每天发新快照，升级怎么不翻车？** A/B 双槽轮换：新快照进隔离槽，旧插件自动迁移、
> 构建 + 扩展测试 + web 冒烟全过才原子切换；任何一步失败不动生产，**一键回滚**。升级有退路，
> 永远有一个验证过的旧版本兜底。
>
> **② 开发/运维要重启 web，工作会断吗？** 双层自愈：守护 10 秒内自动拉起 web，agent 从
> **被打断的那一步**自动续接、带着完整上下文继续。重启是**无人值守**的，工作流不被打断。
>
> **③ web 彻底起不来、连 agent 都没有了，怎么办？** out-of-band 医生 `dsh-doctor`——纯终端、
> 零 web 依赖，一条命令：九项诊断 → 机械修复已知配置故障 → LLM **深度检测修复**（完整推理
> 过程实时展示，不是黑盒）→ 拉起 web 并验证。故障从"求助"变成"**自助**"。
>
> **组件**（自愈 + 版本轮换的完整拼图）：
>
> | 组件 | 类型 | 管什么 |
> |---|---|---|
> | **`skills/dsh-snapshot-ab`** | skill | 官方每日快照 A/B 双槽轮换 —— 升级"切对版本" |
> | **`skills/dsh-web-guard`** | skill | 自愈守护 —— web 死后 10s 自动拉起 |
> | **`skills/dsh-session-recovery`** | skill | 会话丢失诊断 —— “0 sessions”/日志损坏时的定位与无损修复 |
> | **`skills/dsh-web-doctor`** | skill | out-of-band 医生 —— web/A/B 全挂时终端一键诊断→修复→拉起 |
> | **`plugins/dsh-restart-recover`** | cordis 插件 | 重启续接 —— 被中断的 turn 自动继续 |
>
> 合起来回答五个问题：**web 挂了谁拉起？拉起后工作继续吗？会话看起来丢了怎么办？官方发新版本怎么安全切换？A/B 都挂了怎么一键救？**
> 三者互补：`ab.sh switch/rollback` 杀 web → `dsh-web-guard` 拉起 → `dsh-restart-recover` 续接；
> 全挂兜底走 `dsh-web-doctor`（终端 `dsh-doctor --fix --restart`）。
>
> > 曾用名 `dsh-skill-snapshot-ab`（2026-08-11 更名）—— 仓库从"纯 AB 轮换 skill"长成了
> > "skill + 插件"混合工具箱，名字不再贴切。skill 目录名 `dsh-snapshot-ab` 保持不变
> > （它是 skill 触发名 + ab.sh 安装路径，改了破坏机制）。
>
> 本 README 是**人读的操作手册**（场景化，含每条命令）。Agent 读各 skill 的 `SKILL.md`。

## 📦 能力地图

```
dsh-harness-ops（本仓库）
├── skills/dsh-snapshot-ab/        AB 轮换：官方快照 A/B 双槽，旧版保底、验收后原子切换
│   └── scripts/ab.sh              主命令（status/discover/notes/prepare/verify/switch/confirm/rollback）
├── skills/dsh-web-guard/          自愈守护：launchd/systemd 托管，端口空闲 10s 内拉起 web
│   └── scripts/install.sh         跨平台安装（macOS launchd / Linux systemd）
├── skills/dsh-session-recovery/  会话丢失诊断：0 sessions/日志损坏 → 定位 → 无损修复 → 重启
│   └── scripts/                   validate-sessions / repair-session-log / check-all-sessions / repair-unknown-events
├── skills/dsh-web-doctor/        out-of-band 医生：web/A/B 全挂时终端一键诊断→修复→拉起
│   └── scripts/                   doctor.sh / doctor-tui.py / session-last-activity.mjs
└── plugins/dsh-restart-recover/   重启续接插件：agent/created 检测 interrupted → 自动注入续接
    └── src/index.ts               cordis 插件（监听 agent/created，零 dsh-track 依赖）
```

**日常用得最多的入口**：
- 看状态：`$AB status`
- 每日分析（官方改了啥）：`$AB discover` / `$AB notes`（官方 changelog）→ 见「场景 C′」
- 每日升级：`$AB discover → prepare → switch --yes → confirm`
- 自愈验证：`kill $(lsof -ti :3080)` → 10s 内自动拉起 → 会话自动继续（无需手动）

## 🚑 全挂兜底：dsh-web-doctor（web/A/B 全挂时的一键救火）

> 为什么有它：2026-08-11 两次事故（切换后 web 起不来、扩展链接被外部清理）现场修复耗了数小时——
> 每一步（查 session 最后事件 → 找根因 → 修 relink → 修会话 → 拉起 web）其实都能脚本化，缺的
> 是一个**不依赖 web 的一键入口**。完整动机与事故链见 [`docs/web-doctor-motivation.md`](docs/web-doctor-motivation.md)。

**什么时候用**：web（3080）挂了 / 起不来 / A/B 双槽都坏 / GUI 和 agent 都不可用
（agent 由 web 托管，web 挂 = 没有 agent 可用）。它是 **out-of-band** 的：纯终端 + 本机工具
（node/zstd/jq/curl/ps/lsof），**不依赖 web 进程、不加载任何扩展**。

**怎么用**（用户角度，不用记参数）：

```sh
dsh-doctor                    # 交互菜单（默认英文，菜单里选 6 切中文）
dsh-doctor --guide            # mini TUI 引导模式：逐步确认每个修复（人机协同）
```

```
=============================================================
  dsh web Doctor — one-shot rescue        // dsh web 医生 — 一键救火
  web(:3080): ✅ healthy                  // 当前 web: ✅ 正常
=============================================================
  1) Quick check (diagnose only)          // 快速体检（只读）
  2) Fix config issues (mechanical)      // 修复配置问题（机械，不依赖 LLM）：relink/
     incl. relaunch web                  //   插件依赖/launcher/session/LLM 凭据等
                                          //   已知配置故障
  3) LLM repair (recommended)            // LLM 修复（推荐）：LLM 读诊断+日志推理根因，
                                          //   发现/修复任意插件问题（含核心不兼容、
                                          //   插件配置被改乱）
  4) Deep LLM check & repair (always)   // LLM 深度检测和修复（每次都跑，不因诊断
                                          //   全绿跳过；完整思维链实时展示）
  5) Mini TUI (guided)                   // 全屏交互终端：自动修复 + LLM
                                          //   对话（看完整 CoT，随时打断指引）
  6) Switch language 中文                 // 切换语言
  7) Exit                                 // 退出
  choose [1-7]:
```

**LLM 深度检测/修复时**，`[llm]` 流式输出**完整思维链**——它怎么想（推理全文）、决定跑什么
命令（工具 + 完整命令）、得到什么结果，全程可见，不是黑盒。

### mini TUI：设计与使用（`dsh-doctor --guide` / 菜单 5）

**为什么是 TUI**（2026-08-13 教训）：一次无人值守的 `--agent` 长跑失败——被误报带偏、超时
被杀、什么都没修成。**没有人 guide 的 doctor 长任务不靠谱**。mini TUI 是"有人看着的自愈"：
LLM 自动干活，你看着它怎么想，觉得不对就打断。

**三条设计原则**：

1. **LLM 自动判断、自动修复**——已知问题确定性自动修复（无逐项确认）；0 问题自动只读验收
   （输出"✅ 验收通过"+证据清单）；残留问题 LLM 自动诊断根因并修复。
2. **交互 = 看清完整 CoT + 随时打断**——完整推理链 markdown 实时渲染；**Ctrl-C 打断运行中的
   agent**，输入指引后回车，agent 按指引继续（上下文跨轮携带）。
3. **只有 LLM 真正卡住/需要决策时才问用户**（缺 API key、不确定的破坏性操作）——否则绝不把
   决策扔给你。全绿跑完自动出结论，5 秒后自动退出。

**界面**（python3+curses，零第三方依赖；无终端时自动回退逐步模式）：

```
┌ doctor-tui | web:200 | phase:llm | agent:thinking ⠋ | current:slot-b | PgUp/Dn=scroll ┐
│ ── 自动运行：LLM 自愈/验收（CoT 实时渲染）──                                             │
│ 让我理解当前任务：1. 我是 dsh web 的 out-of-band 自愈 agent …（CoT markdown 流式）       │
│ [tool] skill {"name":"dsh-web-doctor"}                                                  │
│ **健康。** web（:3080 返回 200）、扩展 relink 全部完好…（终答 markdown 渲染）             │
│ ✅ 验收通过：web 正常、无残留问题 — 无需任何操作                                          │
│ ✅ 无问题 — 5 秒后自动退出（按任意键取消）                                                │
└ you → agent (Enter=send ^C=interrupt /help) > _                                        ┘
```

**使用流程**：

```sh
dsh-doctor --guide          # 或菜单 5
```

1. **诊断**先在普通终端流式输出（一行行可见，绝不黑屏）
2. 进 TUI：已知问题**确定性自动修复**（relink/插件依赖/launcher/会话，可逆带备份）
3. **LLM 自动运行**：0 问题 → 只读交叉验证出"✅ 验收通过"；有残留 → 自动诊断修复
4. **收尾**：全绿 → 5 秒倒计时自动退出（按任意键取消，继续对话）；有问题 → 明确提示继续或退出

**按键**：

### 键 · 作用
- **键**: 输入 + Enter · **作用**: 给 LLM 发消息/指引（agent 运行中会先打断）
- **键**: Ctrl-C · **作用**: 打断运行中的 agent（空闲时退出）
- **键**: ←/→ Home/End · **作用**: 输入光标移动（行内编辑，中文安全）
- **键**: ⌫ / Delete · **作用**: 删除光标前/后
- **键**: PgUp/PgDn · **作用**: 滚动回看完整 CoT
- **键**: Ctrl-L · **作用**: 清屏
- **键**: `/help` `/quit` `/lang` · **作用**: 按键帮助 / 退出 / 切换语言（en⇄zh，默认 en，也可 `DSH_DOCTOR_LANG=zh`）

**渲染**：CoT/prompt/终答按 **markdown** 渲染（标题/粗体/斜体/行内代码/代码块/列表/引用），
工具调用显示为 `[tool]` 行；agent 运行时状态栏有 `thinking ⠋` 动态指示。**中文（CJK）
输入/编辑完整支持**（UTF-8 locale、宽字符列宽、行内光标编辑）。

**分层设计**（为什么这样）：
- **确定性层**（菜单 2）：传感器+执行器——秒级、零 LLM 成本、web 挂得再彻底也能跑；
  覆盖已知配置故障（relink/插件依赖/launcher/session/LLM 凭据）；诊断全绿时自动跳过修复
- **LLM 大脑**（菜单 3/4）：`dsh --profile headless` 起 one-shot agent，读报告+日志推理根因，
  **能发现/修复确定性规则想不到的问题**（DSH 核心不兼容改动、插件配置被改乱、新故障模式）；
  headless 不加载 web 的扩展 bundle，所以扩展故障不影响它；菜单 4 强制深度检测（全绿也跑）
- **引导模式**（菜单 5）：确定性 + LLM 的**人机协同入口**——LLM 自动判断修复，
  用户看完整 CoT 随时打断指引；适合不放心无人长跑的场景

**诊断 9 项**：web 健康 / launcher 链 / 扩展 relink / 槽可启动 / session 文件层（逐日志校验）/
web.log（分类历史残留 vs 当前故障）/ profile bundles 依赖（任意插件，子路径按 exports map
解析）/ LLM 配置（.env key）/ 最近会话最后发生的事。

**官方改动提炼（每日分析）**：官方仓库没有 CHANGELOG 文档，但**强制**每个非平凡改动写一篇
**Agent Note**（`.agents/notes/implemented/<class>/yyyy-mm-dd-<topic>.md`，class ∈ feature /
bug-fix / simplification / architecture / process / testing，每篇带 `.zh.md` + `.i18n.yaml`，
内容为 Problem / Decision / Consequences / Alternatives）。因此**两个快照之间新增的笔记就是
官方对该快照的 changelog**。`ab.sh discover`（候选更新时自动打印）+ `ab.sh notes`（单独查看）
把这段 changelog 直接列出来——先读官方"为什么"，再读代码 diff 验证，产出
`snapshot-diff-report-YYYYMMDD.md`。

## 0. 先懂一个心智模型（AB 轮换）

```
~/.local/bin/dsh  (PATH launcher)
   └─> ~/.dsh/source/current   ← 符号链接，指向"当前生效的槽"
            └─> slot-a/  ── 旧版（20260809 快照 + 本地 fix）    ← 当前生产
            └─> slot-b/  ── 新版（20260810 快照，已构建+验收）  ← 候选
```

- **生产（http://127.0.0.1:3080）永远只跑 `current` 指向的那个槽。**
- 切换 = 一次原子 `ln -sfn current <槽>` + 重启 `dsh web`。
- A/B 是**槽位身份**（目录名固定），**内容每天互换**：旧版占一个槽，新快照进另一个槽。
- 两个槽都能"同时起进程"（不同端口），但共享 `~/.dsh` 的 sessions/storages ——
  **一个生产实例常驻，另一个槽只用于验收/临时查看（只读、看完就关）**，详见场景 E。

约定：下文 `$AB` 指 `~/.dsh/skills/dsh-snapshot-ab/scripts/ab.sh`（装好 skill 后就在）。

## 1. 安装

```sh
# 一键安装：4 个 skill 进 ~/.dsh/skills + dsh-restart-recover bundle 进 web profile
git clone https://github.com/dsh-external/dsh-harness-ops.git
cd dsh-harness-ops
bash scripts/install.sh

# 可选：自愈守护（launchd/systemd，web 死后 10s 自动拉起）
bash skills/dsh-web-guard/scripts/install.sh
#   v0.3.1 起判活只认 LISTEN 态 socket（-sTCP:LISTEN）——浏览器页面挂着的连接
#   不会再把端口误判为"被占用"，web 死后守护必定拉起

# 配置（首次会自动读，示例见 skills/dsh-snapshot-ab/references/ab-config.example.json）
# 通常只需确认 ab-config.json 里的 extensions（扩展仓库路径）与 web 端口
vi ~/.dsh/source/ab-config.json

# 验证
$AB status
```

> **版本与发布**：仓库是发布单元（GitHub 即分发）——skills（目录机制）不进 npm；
> bundle 插件 `@fakechris/dsh-restart-recover` 已发 **npm**（官方立场见
> [`docs/RELEASE.md`](docs/RELEASE.md)）。版本 = 根目录 `VERSION` + git tag `vX.Y.Z` +
> [`CHANGELOG.md`](CHANGELOG.md)（SemVer）。
> **更新不需要手工打包**：`bash scripts/update.sh` 一条命令完成
> `git pull → 重建插件 lib → 重装 skills/bundle`（v0.3.2 起自动解析工具链槽位 +
> 自愈插件构建软链，轮换到 npm profile 布局槽位不再断链）。

```sh
# 之后每次更新
cd dsh-harness-ops && bash scripts/update.sh
```

`ab-config.json` 关键字段：`upstream`（官方仓库）、`extensions[]`（扩展列表：repo/relink/构建命令）、
`web.port`（staging 冒烟端口，