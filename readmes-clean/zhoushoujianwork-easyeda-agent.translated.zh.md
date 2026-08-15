![easyeda-agent logo](docs/assets/easyeda-agent-logo.png)

# easyeda-agent

  面向 EasyEDA(嘉立创EDA专业版)的 AI 原生自动化层

![easyeda-agent workflow](docs/assets/easyeda-agent-workflow.svg)

`easyeda-agent` 把官方 EasyEDA 扩展 API 变成一套**有类型、可观测、Skill 友好**的系统。EasyEDA 插件保持极薄——它连到本地 agent、只执行被批准的动作;Go CLI/daemon 掌管协议、状态、产物、校验和面向用户的工作流。

## 为什么做这个

上游 `run-api-gateway` 证明了关键入口:代码能跑在 EasyEDA 内、访问官方 `eda` 对象。但它把「裸 JavaScript 执行」当作主工作流——强大,但对 AI agent 太脆弱。

本项目的连接器是真实可用的:daemon **固定监听单端口 `60832`(`0xEDA0`,"EDA" 写进十六进制;0.15.0 起弃用与官方 gateway 冲突的 49620)**(不外溢、被占用时自动接管旧 easyeda daemon)、连接器锁定该端口、校验握手、**自愈重连**、把一套**有类型的动作目录**分发到官方 `eda.*` API。裸 JS 仅作为需二次确认的 `debug.exec_js` 逃生口保留。

- **Skill** 描述专家工作流和护栏;
- **Go CLI/daemon** 暴露稳定的 typed actions;
- **EasyEDA 连接器插件** 只做到官方 `eda.*` 的桥接;
- 产物、截图、DRC 结果、审计日志都是一等输出。

## 工作原理

- Skill 或人跑一条 `easyeda` 命令;
- Go CLI 校验输入、把 typed action 提交给本地 daemon;
- daemon 跟踪已连接的 EasyEDA 窗口、经 WebSocket 路由每个动作、记录审计日志/产物/校验结果;
- 连接器扩展跑在 EasyEDA 内、调用官方 `eda.*` API;
- 结构化结果回流到 CLI 和 Skill,下一步基于**真实编辑器状态**来规划。

动作目录已覆盖原理图、PCB、文档导航、板级绑定、产物导出、诊断。完整清单与路线图见 [docs/FEATURES.md](docs/FEATURES.md)。

## 站在巨人的肩膀上

我们不重造轮子,而是把**成熟的一层层能力叠起来**,让 AI agent 直接可用:

- **官方 `eda.*` API** —— 嘉立创 EDA 专业版自己暴露的 86 个命名空间,是真正的能力底座;
- **上游 `run-api-gateway`** —— 证明了「代码能跑在 EasyEDA 内、访问 `eda` 对象」这条关键入口;
- **成熟的 AI Agent Skill 范式** —— 用 Skill 描述专家工作流 + 护栏,用 typed action 让每一步**可观测、可验收、可回放**,而不是把「裸 JS 执行」丢给模型硬扛。

在这三层之上,easyeda-agent 补齐了工程化的中间层:自愈连接器、有类型的动作目录、真实 bbox 校验、门控设计流程,以及下面这个**核心特色**——电路块库。

## 核心能力 & 特色

**能力总览**(完整清单见 [docs/FEATURES.md](docs/FEATURES.md)):

### 能力域 · 做什么
- **能力域**: **电路块库(旗舰特色)** · **做什么**: 社区共建、署名可追的**成熟外设电路库**:CH340 USB 串口、ESP32 自动下载、按键去抖、USB-HUB、降压…**照抄拓扑、只重绑引脚网络**即可复用
- **能力域**: 原理图 · **做什么**: 库优先放件(真实 LCSC/JLC 器件)、编组、布线、netflag/netport、`sch check`/`layout-lint` 真实 bbox 校验
- **能力域**: PCB · **做什么**: 自动布局、板框、禁布区、规则感知短线布线、4 层电源平面、铺铜、丝印避让、DRC/`pcb check`
- **能力域**: 设计流程 · **做什么**: 从**客户口吻需求**到成品的门控主脊(S0–S6 + P0–P10),里程碑确认,存盘检查点
- **能力域**: 产物 · **做什么**: BOM(补 LCSC C 号)、网表、导出、原生截图、审计日志、录制→回放

### 特色:电路块库(一次贡献,永久收益)

**固定模块的外设电路可以直接照抄。** ESP32 自动下载电路、CH340 USB 烧录、按键去抖、
USB-HUB…这些电路的**内部拓扑是死的**,每次重画等于重趟坑。电路块库把它们
沉淀成**验证过的、可复用的电路块**——你只需重绑对外的几根线(ports)到主控网络,
引脚用**功能名**引用所以**零改号**,器件直接指回标准器件库(BOM 就绪)。

- **社区共建 + 署名可追**:每个块带 `author`/`contributors`,**一次学习贡献、永久收益**;
- **验证门禁**:块必须跑过 `place → wire → check → DRC=0` 才入库,不是「看着对」的散文堆;
- **三维知识**:器件(可替换选择)+ 原理图链接注意 + PCB 布局电气特性,一块讲全;
- **AI 直接消费**:agent 放外设前先查块库,命中即抄,省掉一整个模块的选型与接线。

> 库目录 [`references/blocks/`](skills/easyeda-agent/references/blocks)(一块一文件) ·
> 浏览 `blocks.py ls/show` · 贡献指南
> [`standard-blocks-contributing.md`](skills/easyeda-agent/references/standard-blocks-contributing.md)

## 安装

> **完整上手 & 使用注意事项见 [快速开始 →](docs/quick-start.md)** —— 四件套
> (CLI / 连接器 `.eext` / Skill / EasyEDA)的安装、版本对齐、启动 daemon、升级纪律
> 与常见卡点速查,一页讲清。下面是精简版。

easyeda-agent 是一套**四件套**,四者需**同版本、同时在位**:CLI/daemon、连接器
`.eext` 插件、`easyeda-agent` Skill、开启「允许外部交互」的 EasyEDA Pro。**升级时
三方(CLI + 连接器 + Skill)要一起升到同一版本**,否则 `easyeda daemon health` 会把
落后的连接器标成 stale。

先装 `easyeda` CLI/daemon,再装 EasyEDA 连接器 —— 两条通道任选:安装器会打印**与 CLI 严格同版**的 GitHub Release `.eext` 下载地址(导入即用),或从[**立创官方插件市场**](https://jlc-ext.com/item/zhoushoujian/easyeda-agent-connector)一键安装(平台可原地自动更新,但市场版本可能滞后 CLI,严格四件套同版时以 Release `.eext` 为准):

> **ℹ️ 插件更名说明(2026-08)**:应市场管理规范要求,插件**显示名**改为
> **EDA Agent Connector**(不再含 "easyeda" 字样)。经与市场管理员确认,内部包名
> `easyeda-agent-connector` 与 uuid 均**保持不变**,同一条目重新上传即可 ——
> 已装用户的原地自动更新不受影响,无需任何操作。

```bash
curl -fsSL https://raw.githubusercontent.com/zhoushoujianwork/easyeda-agent/main/install.sh | sh
```

一键脚本会：安装/更新 `easyeda` CLI/daemon;自动检测已安装的客户端并把 `easyeda-agent` skill 安装/更新到对应目录 —— Codex(`~/.codex/skills/easyeda-agent`)、Claude Code(`~/.claude/skills/easyeda-agent`);打印连接器 `.eext` 导入地址。

**装过之后升级不必再跑脚本 —— 用 `easyeda update`:**

```bash
easyeda update              # CLI 二进制(sha256 校验 + 原子替换)+ skill 目录 → latest
easyeda update --check      # 只读:cli / skill / connector 三方版本对齐表
easyeda update --check --exit-code   # 有落后退出码 10(CI/agent 可 gate)
easyeda update --version 0.25.0      # 钉版本;--skill-only / --cli-only 缩范围
```

连接器 `.eext` 不在自动升级范围内(侧载无原地更新)—— `update` 会**报出**它落后并打印重导地址。
dev 构建(git-describe 版本号)默认不覆盖,`--force` 才强升;二进制在 root 目录时用 `sudo easyeda update`。

可用环境变量控制 skill 安装:

```bash
EASYEDA_INSTALL_SKILLS=codex,claude curl -fsSL .../install.sh | sh  # 指定目标
EASYEDA_INSTALL_SKILLS=none          curl -fsSL .../install.sh | sh  # 跳过 skill
EASYEDA_SKILL_PRESERVE=1             curl -fsSL .../install.sh | sh  # 保留本地改动
EASYEDA_VERSION=v0.18.2              curl -fsSL .../install.sh | sh  # 指定版本(跳过 API 查询)
```

**遇到 `403` / GitHub API 限流**:脚本默认要调一次 `api.github.com` 解析 latest
release,匿名调用每个 IP 每小时只有 60 次 —— 公司出口 / NAT / CI 很容易撞满。两条
出路(脚本报错时也会打印):

```bash
export GITHUB_TOKEN=<token>   # 或 GH_TOKEN;已登录 gh CLI 时会自动取 `gh auth token`
gh auth login                 # 等价做法,额度提升到 5000/小时

EASYEDA_VERSION=v0.18.2 curl -fsSL .../install.sh | sh   # 或者直接锁版本,完全不碰 API
```

可用 tag 见 [Releases](https://github.com/zhoushoujianwork/easyeda-agent/releases)。

Skill slug 为 `easyeda-agent`(后缀有意为之,区分于官方 EasyEDA 工具)。只从 registry 装 skill:

```bash
# ClawHub(make release 时自动同步发布,版本与 repo 对齐)
clawhub install easyeda-agent
```

> 国内用户注意:skillhub.cn 目前是纯网页社区,未实现 CLI 安装接口
> (`/api/cli/v1` 返回的是网页而非 API),`skillhub install --registry
> https://skillhub.cn` 无法工作。请改用上面的一键脚本,或从 GitHub Release
> 下载 `skills.tar.gz` 解压到 `~/.claude/skills/` 或 `~/.codex/skills/`。

> EasyEDA 需开启「**允许外部交互**」,连接器的 WebSocket 才能连到本地 daemon。

### 可选:MCP 接入

仓库内的 [`mcp/`](mcp) 是一个本地 stdio MCP 适配层,方便 Codex 等支持 MCP 的
agent 直接发现并调用 `easyeda_*` 工具。它复用现有 `easyeda` CLI/daemon,不会绕过
typed action、审计、workflow gate 或官方 `eda.*` API;任意 JavaScript 的
`debug.exec_js` 域不会通过 MCP 暴露。

```bash
npm --prefix mcp ci --ignore-scripts
codex mcp add easyeda-agent \
  --env EASYEDA_BIN="$(command -v easyeda)" \
  -- node "$(pwd)/mcp/src/server.mjs"
```

重启 agent 客户端后即可使用。其他 MCP 客户端使用同一 stdio command/env 配置;
详细工具清单与开发验证见 [`mcp/README.md`](mcp/README.md)。

## 效果演示

> **完整实战案例:[一份需求文档 → AI 全自动画完 ESP32-S3 四层板](docs/showcase-esp32-mini.md)** ——
> 19 器件原理图 + 四层 PCB(GND 内电层/VCC 电源层/天线禁铜/四角 M3),
> `pcb drc` Connection/Clearance 双归零、`pcb check` 0、`layout-lint` 100/100,附原生截图与全流程复盘。

下面两段录屏来自真实 EasyEDA 画布:AI 从空白页开始生成原理图,再切到 PCB 完成布局、板框、铺铜和丝印。它不是生成一张电路图图片,而是在编辑器里一步步执行 typed actions:

### 原理图从空白页生成 · PCB 布局与铺铜
- **原理图从空白页生成**: ![AI 在 EasyEDA 中从空白页生成原理图](docs/assets/demo-schematic-generation.gif) · **PCB 布局与铺铜**: ![AI 在 EasyEDA 中完成 PCB 布局、板框和铺铜](docs/assets/demo-pcb-layout.gif)

下面这块板由 agent 驱动完整 PCB 流程产出——**自动布局 → 板框贴合 → 规则感知布线 → 4 层电源平面 → 丝印碰撞避让**——并在真实 EasyEDA 画布上验证(DRC 31 → 3、No-Connection 归零):

  ![ESP32-S3 成品板:4层电源平面 + 圆角板框 + 位号对齐](docs/assets/demo-esp32-board.png)

几个单步的真机前后对比(同一块板):

### `pcb outline-fit` 板框贴合(利用率 17% → 71%) · `pcb silk-align` 丝印碰撞避让
- **`pcb outline-fit` 板框贴合(利用率 17% → 71%)**: ![前:板框过大](docs/assets/demo-outline-before.png) → ![后:板框贴合器件](docs/assets/demo-outline-after.png) · **`pcb silk-align` 丝印碰撞避让**: ![前:位号散乱重叠](docs/assets/demo-silk-before.png) → 对齐后见上方成品板

> 上面 GIF 和截图都来自回归板真机流程(原理图 → 导入 PCB → 4 层叠层 → 布局 → GND 内电层/VCC 信号 plane → 天线禁区+检查 → 丝印/LED 极性 → 挖槽),非 mockup。这也是项目的固定端到端回归用例(拿原始需求从零跑),见 [esp32MiniRequire.md](esp32MiniRequire.md)。

### 原理图自动放置:两个引擎(模板 vs 官方)

同一个 ESP32-S3R8 最小系统块,两种放置引擎的真机对比(都 `sch check` 0 悬空导线、已连线):

### `--engine template`(默认,推荐) · `--engine official`(官方 autoLayout 兜底)
- **`--engine template`(默认,推荐)**: ![模板引擎:功能分组、去耦贴芯片、紧凑可读](docs/assets/demo-sch-template.png) · **`--engine official`(官方 autoLayout 兜底)**: ![官方引擎:连通性放射状散布、已连线](docs/assets/demo-sch-official.png)
- **`--engine template`(默认,推荐)**: 块 `schematic_layout` 模板驱动:**去耦帽贴电源脚一字排开、上拉靠引脚、晶振/FLASH 分列**,信号流左入右出,**功能分组、紧凑可读**;原点自动避碰、落后真实 bbox 自检 · **`--engine official`(官方 autoLayout 兜底)**: 平台 `eda.sch_Document.autoLayout()`(@beta):**连通性聚类放射状**,较散、留白大;是**破坏性**长操作(移件不移线),封装加了安全管线(已连线守卫/吸附 5 格/`--rewire` 重连/`sch check` 自检)

两版都能用、都还有少量重叠(模板版当前还会碰标题栏右下角,官方版散件间距不均),**放置的正确性由机械门禁保证**:`sch layout-lint`(真实 bbox 查重叠)+ `sch check`/`bridge-check`(查断线/短路)。多页工程/长操作用 `--doc ` flag **机制性地钉住目标页**,不再靠人工切页(避免长命令落错页)。

> 官方引擎在真正调用 `autoLayout()` 前会二次核对同一页的部件姿态、sheet 与全部 connectivity（wire/bus/net marker），并在启动变异的同一个 JS action 内再锁一次 document/input；`--rewire` 还核对完整网表，输入漂移立即拒绝。bus 目前无法可靠重建，即使 `--rewire` 也拒绝。后续 snap/重连/save 继续钉在同一 UUID；几何回读、`sch check`、重连或持久化任何一步不可用，或残留 overlap / pin 重合 / dangling 等结构性问题，都会非零退出。官方 API 没有事务回滚，因此 post-check 失败表示“页面已变但未过门”，必须先修复或撤销。

> **优先级铁律**:命中电路块 → `sch block-apply` 模板;有 S0 分区 spec → `--engine template`;都没有才 `--engine official` 兜底。功能分组的模板版是首选,官方引擎只作未建模页面的起点。**下版优化**:放置避让标题栏 keep-out、分区区域线 + 文本注释(`sch zone-draw` 已提供,待接入自动放置流程)。

## 能力清单(已支持)

均以 typed CLI 子命令暴露(`easyeda <domain> <verb>`),每项都在固定的 ESP32-S3 回归板上真机验证过。

**原理图** — 完整功能地图(已支持 40+ 子命令按功能域 + 待支持路线)见 **[docs/cli/schematic.md](docs/cli/schematic.md)**(CLI 功能索引:[docs/cli/](docs/cli/README.md));摘要:
- **器件与库**:从立创/LCSC 库按 uuid 放**真实器件**、换型号(`replace`)、符号/封装重绑、C 号确定性解析(`resolve-lcsc`);`modify` 属性 **merge 语义**(只 patch 顶层字段不再清空自定义属性,#175)。
- **连线**:`connect`/`autoconnect`(**打分器**自选方向——碰撞/穿件