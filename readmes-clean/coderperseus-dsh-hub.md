# DSH Hub

**发现、比较和安装 DeepSeek Harness 社区插件。**

[浏览插件](https://dshhub.org) · [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) · [开发文档](docs/development.md) · [目录流水线](docs/catalog-pipeline.md)

  ![DSH Hub plugin catalog](docs/assets/dsh-hub-catalog.png)

## 关于 DSH Hub

DSH Hub 是 DeepSeek Harness 社区插件的发现入口。它持续扫描 GitHub 上可安装的插件，整理能力分类、项目说明、兼容性线索和安装命令，让使用者和 Agent 更快找到适合当前任务的扩展。

你可以在 DSH Hub：

- 按能力分类、关键词、stars、更新时间和兼容状态查找插件；
- 在详情页查看插件用途、安装方式、使用说明和来源仓库；
- 复制安装命令，回到 DeepSeek Harness 中启用插件；
- 从网页、公共 API、CLI 或 DSH 原生工具访问同一份目录；
- 提交自己的插件，让社区更容易发现它。

## 开始使用

DSH Hub 提供两种使用方法。

### 方法一：给人使用

打开 [dshhub.org](https://dshhub.org)，搜索想要的能力，或从下方分类进入完整列表。进入插件详情页后，可以查看用途、兼容性依据、来源仓库和安装命令。

也可以通过 CLI 在终端中搜索和查看详情：

```bash
# 搜索插件
npx -y @dshhubs/cli@0.1.0 search "跨会话记忆" --limit 10

# 查看某个搜索结果的详情
npx -y @dshhubs/cli@0.1.0 plugin owner/repository
```

需要让脚本处理结果时加上 `--json`。

### 方法二：给 Agent 使用

在 DeepSeek Harness 中安装 DSH Hub 搜索插件：

```bash
npx -p @deepseek-ai/dsh dsh plugin --profile web add @dshhubs/plugin-search
```

安装后，Agent 会获得两个只读工具：

- `search_dsh_plugins`：根据能力、分类和兼容状态搜索插件；
- `get_dsh_plugin`：读取候选插件的兼容性依据、使用说明和安装命令。

你可以直接告诉 Agent：

> 帮我找一个能实现跨会话记忆的 DSH 插件，比较兼容性后给出安装命令。

Agent 会先搜索并检查候选项，不会自动安装搜索结果。仓库中的 `find-dsh-plugins` Skill 提供同一套工作流，并在原生工具不可用时回退到 CLI。详细接口见[开发文档](docs/development.md#agent-与开发者入口)。

## Explore plugins by category

Discover **9403 community plugins** across 11 categories. Each category highlights five plugins; open the category to search and browse the complete list.

### agents · 2865

### Plugin · Description · Stars · Evidence
- **Plugin**: [@dshhubs/plugin-search](https://github.com/coderPerseus/dsh-hub/tree/c3c80405693d4edbc341315cb5143be36f7a8b31/packages/dsh-plugin) · **Description**: DeepSeek Harness tools for finding and inspecting plugins in the dshhub catalog · **Stars**: ★ 1 · **Evidence**: declared
- **Plugin**: [@open-design/dsh-runtime](https://github.com/nexu-io/open-design/tree/eee03776fbffc24e40f8278b38ef6e95c011f870/packages/dsh-runtime) · **Description**: DeepSeek Harness profile runtime for Open Design · **Stars**: ★ 87709 · **Evidence**: declared
- **Plugin**: [dsh-plugin-reactive-resume](https://github.com/amruthpillai/reactive-resume/tree/ab811b5f10296871ede5c6cf913050269239f11c/packages/dsh-plugin) · **Description**: DeepSeek Harness plugin for Reactive Resume: bridges your resumes and job applications into a Harness session over MCP. · **Stars**: ★ 40988 · **Evidence**: declared
- **Plugin**: [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **Description**: DSH web plugin: a VSCode-like right sidebar (explorer / editor / terminal / git / browser), isolated per conversation session. Exposes a service for other plug… · **Stars**: ★ 1712 · **Evidence**: declared
- **Plugin**: [@wxg-prc-cpg/browser-skill-dsh-plugin](https://github.com/Tencent/BrowserSkill/tree/a9489282fa614d105e30fd131ed2692cd71308a6/packages/dsh-plugin-browserskill) · **Description**: DeepSeek Harness tool plugin that exposes BrowserSkill (bsk) browser automation to the model · **Stars**: ★ 1135 · **Evidence**: declared

[View all 2865 agents plugins →](https://dshhub.org/?category=agents)

### development · 1469

### Plugin · Description · Stars · Evidence
- **Plugin**: [@open-design/dsh-runtime](https://github.com/nexu-io/open-design/tree/eee03776fbffc24e40f8278b38ef6e95c011f870/packages/dsh-runtime) · **Description**: DeepSeek Harness profile runtime for Open Design · **Stars**: ★ 87709 · **Evidence**: declared
- **Plugin**: [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **Description**: DSH web plugin: a VSCode-like right sidebar (explorer / editor / terminal / git / browser), isolated per conversation session. Exposes a service for other plug… · **Stars**: ★ 1712 · **Evidence**: declared
- **Plugin**: [@open-pets/dsh](https://github.com/alvinunreal/openpets/tree/042844d8e3cd43d8984a2742865d100c3a7be4a4/packages/dsh) · **Description**: Local first, desktop companion platform with animated pets, plugin SDK and coding-agent integrations. · **Stars**: ★ 1078 · **Evidence**: declared
- **Plugin**: [aegis](https://github.com/GanyuanRan/Aegis) · **Description**: Make AI coding agents architecture-aware: baseline-first, evidence-verified, drift-checked, and safe across long tasks. · **Stars**: ★ 1032 · **Evidence**: declared
- **Plugin**: [dsh-deja](https://github.com/vshulcz/deja-vu/tree/659019f2f845d0de31116785035a0548a0229358/packages/dsh-deja) · **Description**: Brings the session history of nineteen other coding agents into DeepSeek Harness: recall, session digest and per-file history tools over a local index, plus op… · **Stars**: ★ 656 · **Evidence**: declared

[View all 1469 development plugins →](https://dshhub.org/?category=development)

### finance · 538

### Plugin · Description · Stars · Evidence
- **Plugin**: [dsh-damage-pulse](https://github.com/wssfk12138/dsh-damage-pulse) · **Description**: DeepSeek Harness balance monitor with cache-aware damage-number animations for every token charge. · **Stars**: ★ 24 · **Evidence**: declared
- **Plugin**: [@feiyang666/dsh-usage-plugin](https://github.com/feiyang-dev/dsh-usage-plugin) · **Description**: DeepSeek Harness usage & cost tracker plugin: per-call token/cache-hit stats, peak/off-peak billing, DeepSeek balance query, CSV/JSON/PNG export with custom de… · **Stars**: ★ 22 · **Evidence**: declared
- **Plugin**: [@pinkbanana/dsh-balance](https://github.com/crazywoola/dsh-balance) · **Description**: DeepSeek Harness plugin that shows API balances and models in Settings, with balance below the chat composer · **Stars**: ★ 19 · **Evidence**: declared
- **Plugin**: [dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) · **Description**: DSH 上下文注入审计插件：统计 AGENTS.md 指令链 / 技能目录 / 工具 schema / MCP 工具的 token 成本，检测重复与冲突；原生 Context Doctor 面板 + context_audit 工具。 · **Stars**: ★ 12 · **Evidence**: declared
- **Plugin**: [dsh-opencode-go-usage](https://github.com/Xenia0922/dsh-opencode-go-usage) · **Description**: OpenCode Go 用量与花费面板 — DeepSeek Harness 插件:可拖拽缩放的悬浮仪表盘,实时展示 OpenCode Go 配额、逐请求用量与花费 · **Stars**: ★ 10 · **Evidence**: declared

[View all 538 finance plugins →](https://dshhub.org/?category=finance)

### integrations · 1058

### Plugin · Description · Stars · Evidence
- **Plugin**: [dsh-plugin-reactive-resume](https://github.com/amruthpillai/reactive-resume/tree/ab811b5f10296871ede5c6cf913050269239f11c/packages/dsh-plugin) · **Description**: DeepSeek Harness plugin for Reactive Resume: bridges your resumes and job applications into a Harness session over MCP. · **Stars**: ★ 40988 · **Evidence**: declared
- **Plugin**: [@open-pets/dsh](https://github.com/alvinunreal/openpets/tree/042844d8e3cd43d8984a2742865d100c3a7be4a4/packages/dsh) · **Description**: Local first, desktop companion platform with animated pets, plugin SDK and coding-agent integrations. · **Stars**: ★ 1078 · **Evidence**: declared
- **Plugin**: [@agentrq/dsh-plugin-agentrq](https://github.com/agentrq/agentrq/tree/b63a82b6228e61034a9a6cc37f551b2e912f1aa5/plugins/deepseek-harness) · **Description**: AgentRQ task manager for DeepSeek Harness: create, manage, and auto-pull AgentRQ tasks without leaving the harness · **Stars**: ★ 1074 · **Evidence**: declared
- **Plugin**: [dsh-deja](https://github.com/vshulcz/deja-vu/tree/659019f2f845d0de31116785035a0548a0229358/packages/dsh-deja) · **Description**: Brings the session history of nineteen other coding agents into DeepSeek Harness: recall, session digest and per-file history tools over a local index, plus op… · **Stars**: ★ 656 · **Evidence**: declared
- **Plugin**: [@vibeinging/dsh-canvas-tools](https://github.com/vibeinging/dsh-desktop/tree/3e647be1e946f17227647b2154208e7a521173eb/packages/dsh-canvas-tools) · **Description**: Session-scoped versioned Canvas and local Site tools over productHost · **Stars**: ★ 621 · **Evidence**: declared

[View all 1058 integrations plugins →](https://dshhub.org/?category=integrations)

### interface · 2565

### Plugin · Description · Stars · Evidence
- **Plugin**: [@open-design/dsh-runtime](https://github.com/nexu-io/open-design/tree/eee03776fbffc24e40f8278b38ef6e95c011f870/packages/dsh-runtime) · **Description**: DeepSeek Harness profile runtime for Open Design · **Stars**: ★ 87709 · **Evidence**: declared
- **Plugin**: [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **Description**: DSH web plugin: a VSCode-like right sidebar (explorer / editor / terminal / git / browser), isolated per conversation session. Exposes a service for other plug… · **Stars**: ★ 1712 · **Evidence**: declared
- **Plugin**: [@open-pets/dsh](https://github.com/alvinunreal/openpets/tree/042844d8e3cd43d8984a2742865d100c3a7be4a4/packages/dsh) · **Description**: Local first, desktop companion platform with animated pets, plugin SDK and coding-agent integrations. · **Stars**: ★ 1078 · **Evidence**: declared
- **Plugin**: [@agentrq/dsh-plugin-agentrq](https://github.com/agentrq/agentrq/tree/b63a82b6228e61034a9a6cc37f551b2e912f1aa5/plugins/deepseek-harness) · **Description**: AgentRQ task manager for DeepSeek Harness: create, manage, and auto-pull AgentRQ tasks without leaving the harness · **Stars**: ★ 1074 · **Evidence**: declared
- **Plugin**: [@vibeinging/dsh-canvas-tools](https://github.com/vibeinging/dsh-desktop/tree/3e647be1e946f17227647b2154208e7a521173eb/packages/dsh-canvas-tools) · **Description**: Session-scoped versioned Canvas and local Site tools over productHost · **Stars**: ★ 621 · **Evidence**: declared

[View all 2565 interface plugins →](https://dshhub.org/?category=interface)

### memory · 516

### Plugin · Description · Stars · Evidence
- **Plugin**: [@mindmemos/deepseek-harness-plugin](https://github.com/mindscale-noah/MindMemOS/tree/0c2fdb1ed41d09c7446f809d00bc11821e96cb24/plugins/deepseek-harness-plugin) · **Description**: DeepSeek Harness (dsh) plugin that recalls and writes MindMemOS memories through the mindmemos CLI. · **Stars**: ★ 938 · **Evidence**: declared
- **Plugin**: [dsh-deja](https://github.com/vshulcz/deja-vu/tree/659019f2f845d0de31116785035a0548a0229358/packages/dsh-deja) · **Description**: Brings the session history of nineteen other coding agents into DeepSeek Harness: recall, session digest and per-file history tools over a local index, plus op… · **Stars**: ★ 656 · **Evidence**: declared
- **Plugin**: [graph-memory](https://github.com/adoresever/graph-memory) · **Description**: Knowledge graph memory for DeepSeek Harness and OpenClaw — cross-session recall, PageRank, communities, and vector search · **Stars**: ★ 563 · **Evidence**: declared
- **Plugin**: [dsh-mnemon](https://github.com/Grivn/dsh-mnemon) · **Description**: Three-tier memory control plane for DeepSeek Harness: persistent runtime context, searchable project documents, pluggable long-term memory, smart routing, supe… · **Stars**: ★ 156 · **Evidence**: declared
- **Plugin**: [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) · **Description**: Three-tier memory system for DeepSeek Harness with nine pluggable providers, smart routing, independent task Agents, WebUI, and headless tools. · **Stars**: ★ 60 · **Evidence**: declared

[View all 516 memory plugins →](https://dshhub.org/?category=memory)

### notifications · 333

### Plugin · Description · Stars · Evidence
- **Plugin**: [dsh-notification](https://github.com/omdsh-dev/dsh-notification) · **Description**: Browser desktop notifications when the DeepSeek Harness finishes a turn: configurable per-outcome toggles and include/exclude keyword rules, shown through the… · **Stars**: ★ 55 · **Evidence**: declared
- **Plugin**: [dsh-notifier](https://github.com/THEWOLFWALKER/dsh-notifier) · **Description**: DSH 统一通知推送插件：一个 notify() API 打天下 + 多渠道 adapter；远程审批/远程会话支持 telegram/feishu/qq/wxpusher/wechat/dingtalk 六通道双向回传；移动指挥中心（长任务心跳 / 疑似卡住提醒 / 通知按钮停止任务）；开放事件源（其他插件经 no… · **Stars**: ★ 31 · **Evidence**: declared
- **Plugin**: [dsh-lark-bot](https://github.com/PlutoKeating/dsh-lark-bot) · **Description**: Bridge DeepSeek Harness (dsh) into Feishu / Lark with streaming cards, project workspaces, approvals and scheduling · **Stars**: ★ 18 · **Evidence**: declared
- **Plugin**: [@dsh-external/dsh-ui-progress](https://github.com/lhh010/dsh-ui-progress) · **Description**: DSH Web UI 会话进度插件：输入框停靠区常驻会话进度条（todos 真实进度 / 无投影默认 100% / 中断橘红态 / 实时 token 生成速率），零核心改动。 · **Stars**: ★ 8 · **Evidence**: declared
- **Plugin**: [dsh-memoir](https://github.com/Qinling-Melon-Farmers/dsh-memoir) · **Description**: Project persistent memory and session-lessons distillation for DeepSeek Harness (DSH): an agent records a session's work summary, lessons learned, and next-act… · **Stars**: ★ 8 · **Evidence**: declared

[View all 333 notifications plugins →](https://dshhub.org/?category=notifications)

### other · 2356

### Plugin · Description · Stars · Evidence
- **Plugin**: [dshmarket](https://github.com/dsh-market/dsh-market) · **Description**: Visual plugin market inside DeepSeek Harness — browse, search, and one-click install community plugins. · DSH 可视化插件市场：逛一逛，点一下，装好。 · **Stars**: ★ 637 · **Evidence**: declared
- **Plugin**: [anime-find](https://github.com/cocofhu/anime-find) · **Description**: DeepSeek Harness 插件：对话内多源搜番，卡片详情、磁力复制与规则流媒体在线播放 · **Stars**: ★ 131 · **Evidence**: declared
- **Plugin**: [@nanmicoder/dsh-auto-mode](https://github.com/NanmiCoder/dsh-auto-mode) · **Description**: Sandbox-first automatic permission policy for DeepSeek Harness · **Stars**: ★ 74 · **Evidence**: declared
- **Plugin**: [deepseek-idesign](https://github.com/Devin-AXIS/deepseek-design/tree/0781cb6f619bd617b6b64512d168fa47de6da88c/packages/deepseek-idesign) · **Description**: iPolloWork Design Studio and its curated design templates as a native DeepSeek Harness conversation view. · **Stars**: ★ 67 · **Evidence**: declared
- **Plugin**: [zat-dsh-engine](https://github.com/mishibeikejie/zat-dsh-engine) · **Description**: Zat-DSH Engine — the visual plugin marketplace for DeepSeek Harness. Browse, search, install, update and uninstall community plugins from GitHub's dsh-plugin t… · **Stars**: ★ 64 · **Evidence**: declared

[View all 2356 other plugins →](https://dshhub.org/?category=other)

### productivity · 2217

### Plugin · Description · Stars · Evidence
- **Plugin**: [dsh-plugin-reactive-resume](https://github.com/amruthpillai/reactive-resume/tree/ab811b5f10296871ede5c6cf913050269239f11c/packages/dsh-plugin) · **Description**: DeepSeek Harness plugin for Reactive Resume: bridges your resumes and job applications into a Harness session over MCP. · **Stars**: ★ 40988 · **Evidence**: declared
- **Plugin**: [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **Description**: DSH web plugin: a VSCode-like right sidebar (explorer / editor / terminal / git / browser), isolated per conversation session. Exposes a service for other plug… · **Stars**: ★ 1712 · **Evidence**: declared
- **Plugin**: [@wxg-prc-cpg/browser-skill-dsh-plugin](https://github.com/Tencent/BrowserSkill/tree/a9489282fa614d105e30fd131ed2692cd71308a6/packages/dsh-plugin-browserskill) · **Description**: DeepSeek Harness tool plugin that exposes BrowserSkill (bsk) browser automation to the model · **Stars**: ★ 1135 · **Evidence**: declared
- **Plugin**: [@agentrq/dsh-plugin-agentrq](https://github.com/agentrq/agentrq/tree/b63a82b6228e61034a9a6cc37f551b2e912f1aa5/plugins/deepseek-harness) · **Description**: AgentRQ task manager for DeepSeek Harness: create, manage, and auto-pull AgentRQ tasks without leaving the harness · **Stars**: ★ 1074 · **Evidence**: declared
- **Plugin**: [dsh-tongflow](https://github.com/tong-io/tongflow/tree/a5f2bac33f963d950a1721c3b3e59951a8f01e3e/packages/dsh-tongflow) · **Description**: TongFlow studio plugin for DeepSeek Harness (dsh): film-crew style project model, agent-authored TongFlow workflows, deterministic media generation, embedded c… · **Stars**: ★ 859 · **Evidence**: declared

[View all 2217 productivity plugins →](https://dshhub.org/?category=productivity)

### skills · 916

### Plugin · Description · Stars · Evidence
- **Plugin**: [@dshhubs/plugin-search](https://github.com/coderPerseus/dsh-hub/tree/c3c80405693d4edbc341315cb5143be36f7a8b31/packages/dsh-plugin) · **Description**: DeepSeek Harness tools for finding and inspecting plugins in the dshhub catalog · **Stars**: ★ 1 · **Evidence**: declared
- **Plugin**: [@open-design/dsh-runtime](https://github.com/nexu-io/open-design/tree/eee03776fbffc24e40f8278b38ef6e95c011f870/packages/dsh-runtime) · **Description**: DeepSeek Harness profile runtime for Open Design · **Stars**: ★ 87709 · **Evidence**: declared
- **Plugin**: [dsh-plugin-reactive-resume](https://github.com/amruthpillai/reactive-resume/tree/ab811b5f10296871ede5c6cf913050269239f11c/packages/dsh-plugin) · **Description**: DeepSeek Harness plugin for Reactive Resume: bridges your resumes and job applications into a Harness session over MCP. · **Stars**: ★ 40988 · **Evidence**: declared
- **Plugin**: [@wxg-prc-cpg/browser-skill-dsh-plugin](https://github.com/Tencent/BrowserSkill/tree/a9489282fa614d105e30fd131ed2692cd71308a6/packages/dsh-plugin-browserskill) · **Description**: DeepSeek Harness tool plugin that exposes BrowserSkill (bsk) browser automation to the model · **Stars**: ★ 1135 · **Evidence**: declared
- **Plugin**: [aegis](https://github.com/GanyuanRan/Aegis) · **Description**: Make AI coding agents architecture-aware: baseline-first, evidence-verified, drift-checked, and safe across long tasks. · **Stars**: ★ 1032 · **Evidence**: declared

[View all 916 skills plugins →](https://dshhub.org/?category=skills)

### vision · 660

### Plugin · Description · Stars · Evidence
- **Plugin**: [dsh-tongflow](https://github.com/tong-io/tongflow/tree/a5f2bac33f963d950a1721c3b3e59951a8f01e3e/packages/dsh-tongflow) · **Description**: TongFlow studio plugin for DeepSeek Harness (dsh): film-crew style project model, agent-authored TongFlow wo