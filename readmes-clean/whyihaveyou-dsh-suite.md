# dsh-suite

**别再翻 `dsh-plugin` topic 了，这里都是还能跑的插件。**

`dsh-suite` 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）插件的**活目录**——**每小时自动刷新、每日兼容实测**——外加 DSH 内置**插件商店**、`create-dsh-plugin` 脚手架和几个自研插件。

[![dsh-suite 目录网站](https://whyihaveyou.github.io/dsh-suite/preview/2026-08-14/home-zh.png)](https://whyihaveyou.github.io/dsh-suite/zh.html)

## 为什么做 dsh-suite

DSH 发布时没有官方插件 registry。现在找插件只能翻 GitHub 的 `dsh-plugin` topic（50+ 个零散小插件）和当天冒出来的几个静态 awesome-list——而 DSH 自己还在发**破坏性变更**（breaking changes）。

所以我们做了四件事：

1. **一个「活」目录**——880+ 精选插件，CI **每小时**刷新数据、**每天**把收录的包真实装进临时 profile 重测兼容性。
2. **一个内置插件商店**——`@dsh-suite/plugin-manager` 在 DSH Web UI 的设置页里加一个 **Store** 标签：逛目录、搜索、看徽章、一键安装，全程不用离开 DSH。
3. **一个脚手架**——`npm create dsh-plugin` 一条命令生成可跑的 `dsh.bundle` + Cordis 骨架。官方没给脚手架，而「怎么迁移我的插件」是社区呼声最高的需求之一。
4. **几个自研插件**——不是纯搬运，有第一方产出。

## 快速开始

```bash
# 1. 逛目录网站
open https://whyihaveyou.github.io/dsh-suite/zh.html

# 2. 把插件商店装进你的 DSH Web UI
npx @deepseek-ai/dsh plugin --profile web add @dsh-suite/plugin-manager
#    → 重启 Web UI，然后 设置 → Plugins → Store

# 3.（开发者）造一个自己的插件
npm create dsh-plugin@latest my-plugin
```

![DSH Web UI 里的插件商店 Store 标签页](site/assets/store-tab.png)

## 📚 插件目录

### ⭐ 精选

### 插件 · ⭐ · 兼容 · 描述
- **插件**: [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) · **⭐**: 2055 · **兼容**: ⚪ unknown · **描述**: DSH Web UI 插件与皮肤合集：任务板、Git 面板等
- **插件**: [DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **⭐**: 827 · **兼容**: ⚪ unknown · **描述**: 侧边栏完整工作台：文件渲染/终端/Git/子代理
- **插件**: [dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) · **⭐**: 641 · **兼容**: ⚪ unknown · **描述**: DSH Web 鲸鱼娘皮肤系列（深海女仆工坊）
- **插件**: [dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) · **⭐**: 357 · **兼容**: ⚪ unknown · **描述**: 给纯文本模型加视觉：图片问答、长截图 OCR、UI 还原
- **插件**: [dsh_workflow](https://github.com/icetomoyo/dsh_workflow) · **⭐**: 54 · **兼容**: ⚪ unknown · **描述**: 把 Claude Code 的 UltraCode 模式带给 DSH，多 Agent 调度可治理
- **插件**: [dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) · **⭐**: 43 · **兼容**: ⚪ unknown · **描述**: 对话回退：回滚会话与工作区状态
- **插件**: [mstar-harness](https://github.com/btspoony/mstar-harness) · **⭐**: 43 · **兼容**: ⚪ unknown · **描述**: Skill 驱动的 Harness/Loop 工程工作流插件
- **插件**: [ui-status-label](https://github.com/alingalingling/ui-status-label) · **⭐**: 31 · **兼容**: ⚪ unknown · **描述**: 自定义「鲸鱼娘」思考状态的显示
- **插件**: [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) · **⭐**: 23 · **兼容**: ⚪ unknown · **描述**: Monaco 编辑器创建沙箱 JS 工具
- **插件**: [dsh-share](https://github.com/hellodigua/dsh-share) · **⭐**: 17 · **兼容**: ⚪ unknown · **描述**: DSH 对话分享插件
- **插件**: [distill](https://github.com/LoserFox/distill) · **⭐**: 15 · **兼容**: ⚪ unknown · **描述**: 自动对话蒸馏：后台 subagent 反省 + 技能更新
- **插件**: [all (全家桶)](https://github.com/whyihaveyou/dsh-suite) · **⭐**: 15 · **兼容**: 🟢 ok · **描述**: 全家桶聚合包：一次安装带入第一方全家桶——插件商店、IM 通知、会话导出、多 agent 任务板。
- **插件**: [dsh-acp-for-bitfun](https://github.com/bobleer/dsh-acp-for-bitfun) · **⭐**: 9 · **兼容**: ⚪ unknown · **描述**: BitFun 与 DSH ACP 交互对接
- **插件**: [plugin-manager](https://github.com/whyihaveyou/dsh-suite) · **⭐**: 7 · **兼容**: 🟢 ok · **描述**: DSH Web UI 内置插件商店：浏览 dsh-suite 目录、搜索/筛选/排序、兼容徽章、一键安装——设置页插件区的 Store 标签页。
- **插件**: [plugin-team-board](https://github.com/whyihaveyou/dsh-suite) · **⭐**: 7 · **兼容**: 🟢 ok · **描述**: 多 agent 会话共享任务看板：跨 subagent 创建/认领/更新/查询任务，基于 append-only 会话日志持久化。
- **插件**: [plugin-session-export](https://github.com/whyihaveyou/dsh-suite) · **⭐**: 3 · **兼容**: 🟢 ok · **描述**: 把 append-only 会话日志导出成人读的 Markdown / HTML，按来源分组渲染（系统提示 / 思维链 / 工具调用 / 子agent）。
- **插件**: [create-dsh-plugin](https://github.com/whyihaveyou/dsh-suite) · **⭐**: 3 · **兼容**: 🟢 ok · **描述**: 一键脚手架生成 DeepSeek Harness (DSH) 插件：tool / events / webui 三套模板、next 标签版本锁定、内置 --verify 冒烟测试。
- **插件**: [plugin-notify](https://github.com/whyihaveyou/dsh-suite) · **⭐**: 3 · **兼容**: 🟢 ok · **描述**: 回合完成 / 出错 / 待审批时，把通知推到 IM webhook（飞书 / 企业微信 / 钉钉 / Slack / Discord / 自定义）+ 本机系统通知。
- **插件**: [themes (皮肤中心)](https://github.com/whyihaveyou/dsh-themes) · **⭐**: 1 · **兼容**: 🟢 ok · **描述**: 皮肤中心：151 款昼夜成对皮肤一包打尽——网格预览、搜索、DSH Web UI 内一键试穿。

### 🧰 工具

### 插件 · ⭐ · 兼容 · 描述
- **插件**: [open-managed-agents](https://github.com/openma-ai/open-managed-agents) · **⭐**: 235 · **兼容**: ⚪ unknown · **描述**: Claude Managed Agents API 的开源自托管平台（Cloudflare Workers）
- **插件**: [role-model](https://github.com/try-works/role-model) · **⭐**: 101 · **兼容**: ⚪ unknown · **描述**: 按任务把请求路由到「正确的模型」（本地/云）
- **插件**: [irmia_devkit_open](https://github.com/irmia2026/irmia_devkit_open) · **⭐**: 39 · **兼容**: ⚪ unknown · **描述**: Python 开发工具包（无描述）
- **插件**: [HoloGram](https://github.com/834063245-creator/HoloGram) · **⭐**: 23 · **兼容**: ⚪ unknown · **描述**: 3D 代码依赖拓扑图生成器（14 语言）
- **插件**: [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) · **⭐**: 23 · **兼容**: ⚪ unknown · **描述**: Monaco 编辑器创建沙箱 JS 工具
- **插件**: [dsh-acp-for-bitfun](https://github.com/bobleer/dsh-acp-for-bitfun) · **⭐**: 9 · **兼容**: ⚪ unknown · **描述**: BitFun 与 DSH ACP 交互对接
- **插件**: [fabric](https://github.com/omdsh-dev/fabric) · **⭐**: 9 · **兼容**: ⚪ unknown · **描述**: 类似 MC Fabric 的 hook 处理器
- **插件**: [dsh-git-identity](https://github.com/LoserFox/dsh-git-identity) · **⭐**: 7 · **兼容**: ⚪ unknown · **描述**: git 提交固定使用环境作者身份
- **插件**: [Hypr-Agent-Protal](https://github.com/gfhdhytghd/Hypr-Agent-Protal) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: Hyprland 的 Computer Use MCP
- **插件**: [telegram](https://github.com/LoserFox/telegram) · **⭐**: 6 · **兼容**: ⚪ unknown · **描述**: Telegram Bot API 桥接（长轮询）
- **插件**: [agent-knock-knock](https://github.com/scotthuang/agent-knock-knock) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: OpenClaw 插件：共享 tmux 控制本地 Codex/Claude Code
- **插件**: [dsh-bash-encoding](https://github.com/lhh010/dsh-bash-encoding) · **⭐**: 7 · **兼容**: ⚪ unknown · **描述**: bash 输出编码自动识别（UTF-16LE/UTF-8/GBK）
- **插件**: [dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) · **⭐**: 20 · **兼容**: ⚪ unknown · **描述**: 连数据库、写 SQL 的插件
- **插件**: [dsh-doctor](https://github.com/coppynight/dsh-doctor) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: flutter-doctor 风格诊断与安全自动修复
- **插件**: [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) · **⭐**: 26 · **兼容**: ⚪ unknown · **描述**: 跨实例消息/事件交接插件
- **插件**: [dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) · **⭐**: 24 · **兼容**: ⚪ unknown · **描述**: OpenBiliClaw 内容推荐 Agent 接入 DSH
- **插件**: [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) · **⭐**: 17 · **兼容**: ⚪ unknown · **描述**: 扫描插件仓库清单协议/patch 格式/构建陷阱
- **插件**: [dsh-security-audit](https://github.com/omdsh-dev/dsh-security-audit) · **⭐**: 10 · **兼容**: ⚪ unknown · **描述**: 本机安全审计：配置/插件来源/会话/网络暴露面
- **插件**: [dsh-tool-csv](https://github.com/omdsh-dev/dsh-tool-csv) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: CSV 解析/查询/统计/转换工具
- **插件**: [dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit) · **⭐**: 16 · **兼容**: ⚪ unknown · **描述**: 零依赖工具包合集（time/encoding/json/csv/regex）
- **插件**: [atomstudio](https://github.com/AtomicsLaboratory/atomstudio) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: 可执行文档工程环境
- **插件**: [dsh-cc-connect](https://github.com/whiteguo233/dsh-cc-connect) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: 通过 cc-connect 远程使用 DSH
- **插件**: [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) · **⭐**: 18 · **兼容**: ⚪ unknown · **描述**: Mnemon 三层记忆体深度集成
- **插件**: [dsh-paseo](https://github.com/renat3u/dsh-paseo) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: DSH 的 paseo 插件扩展支持
- **插件**: [dsh-plugin-dev](https://github.com/omdsh-dev/dsh-plugin-dev) · **⭐**: 10 · **兼容**: ⚪ unknown · **描述**: DSH 插件开发踩坑档案（skill+文档）
- **插件**: [dsh-tool-calculator](https://github.com/omdsh-dev/dsh-tool-calculator) · **⭐**: 6 · **兼容**: ⚪ unknown · **描述**: 安全数学表达式求值器
- **插件**: [dsh-tool-diff](https://github.com/omdsh-dev/dsh-tool-diff) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: 文本/JSON/CSV/Markdown 结构化 diff
- **插件**: [dsh-tool-encoding](https://github.com/omdsh-dev/dsh-tool-encoding) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: base64/hex/url 编解码 + 哈希工具
- **插件**: [dsh-tool-json](https://github.com/omdsh-dev/dsh-tool-json) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: JMESPath JSON 查询工具
- **插件**: [dsh-tool-markdown](https://github.com/omdsh-dev/dsh-tool-markdown) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: HTML↔Markdown 转换、GFM 表格规范化
- **插件**: [dsh-tool-regex](https://github.com/omdsh-dev/dsh-tool-regex) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: 正则测试/捕获/安全替换工具
- **插件**: [dsh-tool-schema](https://github.com/omdsh-dev/dsh-tool-schema) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: JSON Schema 验证工具
- **插件**: [dsh-tool-stat](https://github.com/omdsh-dev/dsh-tool-stat) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: 描述统计/百分位/相关性工具
- **插件**: [dsh-tool-time](https://github.com/omdsh-dev/dsh-tool-time) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: ISO 8601/时区/日历运算时间工具
- **插件**: [dsh-trace](https://github.com/vibeinging/dsh-trace) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: DSH 遥测后端：导出轮次/步骤/工具
- **插件**: [sandbox-micro](https://github.com/omdsh-dev/sandbox-micro) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: microsandbox 支持
- **插件**: [zotero-harvest](https://github.com/Fisfzy/zotero-harvest) · **⭐**: 5 · **兼容**: ⚪ unknown · **描述**: Zotero 文献采集入库插件（OpenAlex/arXiv/Crossref）
- **插件**: [dsh-harness-ops](https://github.com/fakechris/dsh-harness-ops) · **⭐**: 9 · **兼容**: ⚪ unknown · **描述**: DSH 运维工具箱：每日快照 A/B 双槽轮换、一键回滚
- **插件**: [dsh-inspect](https://github.com/omdsh-dev/dsh-inspect) · **⭐**: 5 · **兼容**: ⚪ unknown · **描述**: 检查→修复→复查的对抗式闭环插件
- **插件**: [dsh-openmaic](https://github.com/THU-MAIC/dsh-openmaic) · **⭐**: 6 · **兼容**: ⚪ unknown · **描述**: OpenMAIC：课堂/幻灯片/交互式组件
- **插件**: [dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) · **⭐**: 13 · **兼容**: ⚪ unknown · **描述**: MineRU 文档解析工具
- **插件**: [dsh-prompt-studio](https://github.com/Moeblack/dsh-prompt-studio) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: 编辑用户与内置系统提示段（实时预览）
- **插件**: [dsh-scholar](https://github.com/lzszq/dsh-scholar) · **⭐**: 15 · **兼容**: ⚪ unknown · **描述**: dsh-scholar（文献相关）
- **插件**: [dsh-ssh](https://github.com/UynajGI/dsh-ssh) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: SSH 远程执行：ProxyJump 链、SFTP
- **插件**: [dsh-tool-search](https://github.com/vibeinging/dsh-tool-search) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: 按 agent 按需工具发现与渐进 schema 披露
- **插件**: [dsh-webbridge](https://github.com/bill9109/dsh-webbridge) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: DSH 结合 Kimi WebBridge
- **插件**: [ego-browser](https://github.com/Fisfzy/ego-browser) · **⭐**: 13 · **兼容**: ⚪ unknown · **描述**: 把 ego-lite 浏览器接入 DSH（给 Agent 用的 Chromium）
- **插件**: [math-lean](https://github.com/Fisfzy/math-lean) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: Lean 内核验证的数学推理插件
- **插件**: [plugin-template](https://github.com/omdsh-dev/plugin-template) · **⭐**: 5 · **兼容**: ⚪ unknown · **描述**: 官方 turtle ui 仓库派生的插件模板
- **插件**: [Qwen-MM-Plugins](https://github.com/omdsh-dev/Qwen-MM-Plugins) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: Qwen-MM-Plugins 支持
- **插件**: [sandbox-mxc](https://github.com/omdsh-dev/sandbox-mxc) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: 微软跨平台沙盒支持
- **插件**: [sandbox-nono](https://github.com/omdsh-dev/sandbox-nono) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: nono 沙盒支持
- **插件**: [web-components](https://github.com/omdsh-dev/web-components) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: web-components 支持
- **插件**: [zotero-wave-rag](https://github.com/Fisfzy/zotero-wave-rag) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: 面向 Zotero 论文库的浪潮式 RAG 检索
- **插件**: [modsearch](https://github.com/liustack/modsearch) · **⭐**: 94 · **兼容**: ⚪ unknown · **描述**: DeepSeek Harness 的联网搜索插件。
- **插件**: [dsh-browser](https://github.com/Lum1104/dsh-browser) · **⭐**: 99 · **兼容**: ⚪ unknown · **描述**: Chrome 侧边栏扩展，让 DSH 操控浏览器。
- **插件**: [dsh-openapi](https://github.com/Degurechaff57/dsh-openapi) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: 安全 OpenAPI 3.x 发现与 API 调用工具。
- **插件**: [dsh-better-browser](https://github.com/titanwings/dsh-better-browser) · **⭐**: 7 · **兼容**: ⚪ unknown · **描述**: 通过 Kimi WebBridge 让 agent 操作用户已登录浏览器。
- **插件**: [dsh-worktree](https://github.com/FlashingChen/dsh-worktree) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: Codex 风格永久 git worktree 插件。
- **插件**: [graycode-for-dsh](https://github.com/Komeiji-Shiki/graycode-for-dsh) · **⭐**: 5 · **兼容**: ⚪ unknown · **描述**: graycode 编码工具。
- **插件**: [dsh-expression](https://github.com/yyh-001/dsh-expression) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: 找得到、发得出 —— DSH 表情包插件：语义搜图，只发真实文件，走 companion QQ 通道
- **插件**: [dsh-director-toolkit](https://github.com/lhmd/dsh-director-toolkit) · **⭐**: 7 · **兼容**: ⚪ unknown · **描述**: dsh-director-toolkit — DSH 插件（工具）
- **插件**: [codex-plugin-dsh](https://github.com/wingoo/codex-plugin-dsh) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: codex-plugin-dsh — DSH 插件（工具）
- **插件**: [dsh-prompt-persona](https://github.com/Xilin3/dsh-prompt-persona) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: dsh-prompt-persona — DSH 插件（工具）
- **插件**: [dsh-tool-policy](https://github.com/Drifter-yh/dsh-tool-policy) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: dsh-tool-policy — DSH 插件（工具）
- **插件**: [dsh-plugin-graph](https://github.com/erduotong/dsh-plugin-graph) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: 一个Deepseek Harness的插件关系图谱可视化插件
- **插件**: [dsh-research-notes](https://github.com/fff122/dsh-research-notes) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: dsh-research-notes — DSH 插件（工具）
- **插件**: [nowledge-mem-deepseek-harness](https://github.com/nowledge-co/nowledge-mem-deepseek-harness) · **⭐**: 5 · **兼容**: ⚪ unknown · **描述**: nowledge-mem-deepseek-harness — DSH 插件（工具）
- **插件**: [dsh-vsc-integration](https://github.com/HarcoChen/dsh-vsc-integration) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: dsh-vsc-integration — DSH 插件（工具）
- **插件**: [dsh-safe-delete](https://github.com/Qintsg/dsh-safe-delete) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: dsh-safe-delete — DSH 插件（工具）
- **插件**: [dsh-plugins](https://github.com/HackSing/dsh-plugins) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: dsh-plugins — DSH 插件（工具）
- **插件**: [dsh-report-html](https://github.com/hccccc01333/dsh-report-html) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: dsh-report-html — DSH 插件（工具）
- **插件**: [dsh-openai-codex-auth](https://github.com/yoke233/dsh-openai-codex-auth) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: dsh-openai-codex-auth — DSH 插件（工具）
- **插件**: [dsh-github-connector](https://github.com/kaziii/dsh-github-connector) · **⭐**: 4 · **兼容**: ⚪ unknown · **描述**: dsh-github-connector — DSH 插件（工具）
- **插件**: [deepseek-pet](https://github.com/keleus/deepseek-pet) · **⭐**: 9 · **兼容**: ⚪ unknown · **描述**: 在你的deepseek-harness上养一只吃白饭的大蓝鲸
- **插件**: [dsh-index](https://github.com/Sunrisepeak/dsh-index) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: dsh-index — DSH 插件（工具）
- **插件**: [dsh-web-search-firecrawl](https://github.com/yangzhe1003/dsh-web-search-firecrawl) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: dsh-web-search-firecrawl — DSH 插件（工具）
- **插件**: [dsh-plugin-template](https://github.com/bugmaker2/dsh-plugin-template) · **⭐**: 12 · **兼容**: ⚪ unknown · **描述**: dsh-plugin-template — DSH 插件（工具）
- **插件**: [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: dsh-composer-history — DSH 插件（工具）
- **插件**: [dsh-fun-ticker](https://github.com/omdsh-dev/dsh-fun-ticker) · **⭐**: 3 · **兼容**: ⚪ unknown · **描述**: DSH 行情跑马灯插件：可自选标的的加密/汇率/A股/指数/港美股跑马灯，免 key 数据源，宿主代理+缓存
- **插件**: [jumpserver-dsh](https://github.com/jumpserver-east/jumpserver-dsh) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: jumpserver-dsh — DSH 插件（工具）
- **插件**: [dsh-browser](https://github.com/ben7am1n/dsh-browser) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: dsh-browser — DSH 插件（工具）
- **插件**: [dsh-dev-actions](https://github.com/skitse/dsh-dev-actions) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: dsh-dev-actions — DSH 插件（工具）
- **插件**: [dsh-plugin-doctor](https://github.com/lin-cheng-lab/dsh-plugin-doctor) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: DSH 插件体检：安装前检查 peer 版本兼容性，防止 rc 不匹配崩溃 🩺
- **插件**: [deepseek-harness-background](https://github.com/czzzlq/deepseek-harness-background) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: deepseek-harness-background — DSH 插件（工具）
- **插件**: [task-passport](https://github.com/dongsheng123132/task-passport) · **⭐**: 5 · **兼容**: ⚪ unknown · **描述**: task-passport — DSH 插件（工具）
- **插件**: [dsh-prompt-presets](https://github.com/fff122/dsh-prompt-presets) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: dsh-prompt-presets — DSH 插件（工具）
- **插件**: [dsh-hub](https://github.com/coderPerseus/dsh-hub) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: dsh-hub — DSH 插件（工具）
- **插件**: [dsh-plugin-colorscheme](https://github.com/Civitasv/dsh-plugin-colorscheme) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: dsh-plugin-colorscheme — DSH 插件（工具）
- **插件**: [dsh-scout](https://github.com/omdsh-dev/dsh-scout) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: 面向 DeepSeek Harness 的只读环境探测插件，为智能体提供运行环境、软件版本、系统资源、端口、服务、硬件及工作区信息。
- **插件**: [dsh-screenshot-diff](https://github.com/PangYiMing/dsh-screenshot-diff) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: dsh-screenshot-diff — DSH 插件（工具）
- **插件**: [dsh-turn-index](https://github.com/Simon314620/dsh-turn-index) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: deepseek harness的侧边栏对话轮次索引插件
- **插件**: [dsh-mobile-control](https://github.com/PangYiMing/dsh-mobile-control) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: dsh-mobile-control — DSH 插件（工具）
- **插件**: [dsh-hub](https://github.com/coderPerseus/dsh-hub) · **⭐**: 2 · **兼容**: ⚪ unknown · **描述**: dsh-hub — DSH 插件（工具）
- **插件**: [dsh-tool-monitor](https://github.com/yoke233/dsh-tool-monitor) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: dsh-tool-monitor — DSH 插件（工具）
- **插件**: [dsh-suggest-prompt](https://github.com/studyzy/dsh-suggest-prompt) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: dsh-suggest-prompt — DSH 插件（工具）
- **插件**: [dsh-cloudflare-browser-run](https://github.com/RealAlexandreAI/dsh-cloudflare-browser-run) · **⭐**: 1 · **兼容**: ⚪ unknown · **描述**: dsh-cloudflare-browser-run — DSH 插件（工具）
- **插件**: [safe-find-dsh-plugins](https://github.com/Jinsong-Zho