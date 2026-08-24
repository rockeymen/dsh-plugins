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

### 插件 · 描述 · 星星 · 证据
- **插件**：[@dshhubs/plugin-search](https://github.com/coderPerseus/dsh-hub/tree/c3c80405693d4edbc341315cb5143be36f7a8b31/packages/dsh-plugin) · **描述**：用于在 dshhub 目录中查找和检查插件的 DeepSeek Harness 工具 · **星星**： ★ 1 · **证据**：声明
- **插件**：[@open-design/dsh-runtime](https://github.com/nexu-io/open-design/tree/eee03776fbffc24e40f8278b38ef6e95c011f870/packages/dsh-runtime) · **描述**：用于开放设计的 DeepSeek Harness 配置文件运行时 · **星星**：★ 87709 · **证据**：声明
- **插件**：[dsh-plugin-reactive-resume](https://github.com/amruthpillai/reactive-resume/tree/ab811b5f10296871ede5c6cf913050269239f11c/packages/dsh-plugin) · **描述**：用于响应式简历的 DeepSeek Harness 插件：将您的简历和工作申请桥接到 MCP 上的 Harness 会话中。 · **星星**：★ 40988 · **证据**：声明
- **插件**：[dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **描述**：DSH Web插件：类似VSCode的右侧边栏（资源管理器/编辑器/终端/git/浏览器），每个对话会话隔离。公开其他插件的服务... · **星星**：★ 1712 · **证据**：声明
- **插件**：[@wxg-prc-cpg/browser-skill-dsh-plugin](https://github.com/Tencent/BrowserSkill/tree/a9489282fa614d105e30fd131ed2692cd71308a6/packages/dsh-plugin-browserskill) · **描述**：向模型公开 BrowserSkill (bsk) 浏览器自动化的 DeepSeek Harness 工具插件 · **星星**： ★ 1135 · **证据**：声明

[查看所有2865代理插件→](https://dshhub.org/?category=agents)

### 发展·1469

### 插件 · 描述 · 星星 · 证据
- **插件**：[@open-design/dsh-runtime](https://github.com/nexu-io/open-design/tree/eee03776fbffc24e40f8278b38ef6e95c011f870/packages/dsh-runtime) · **描述**：用于开放设计的 DeepSeek Harness 配置文件运行时 · **星星**：★ 87709 · **证据**：声明
- **插件**：[dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **描述**：DSH Web插件：类似VSCode的右侧边栏（资源管理器/编辑器/终端/git/浏览器），每个对话会话隔离。公开其他插件的服务... · **星星**：★ 1712 · **证据**：声明
- **插件**：[@open-pets/dsh](https://github.com/alvinunreal/openpets/tree/042844d8e3cd43d8984a2742865d100c3a7be4a4/packages/dsh) · **描述**：本地优先的桌面伴侣平台，具有动画宠物、插件 SDK 和编码代理集成。 · **星星**：★ 1078 · **证据**：声明
- **插件**：[aegis](https://github.com/GanyuanRan/Aegis) · **描述**：使 AI 编码代理具有架构意识：基线优先、证据验证、偏差检查以及长时间任务的安全性。 · **星星**：★ 1032 · **证据**：声明
- **插件**：[dsh-deja](https://github.com/vshulcz/deja-vu/tree/659019f2f845d0de31116785035a0548a0229358/packages/dsh-deja) · **描述**：将其他 19 个编码代理的会话历史记录带入 DeepSeek Harness：本地索引上的召回、会话摘要和每个文件历史记录工具，以及操作... · **星星**： ★ 656 · **证据**：声明

[查看全部1469个开发插件→](https://dshhub.org/?category=development)

### 金融·538

### Plugin · Description · Stars · Evidence
- **Plugin**: [dsh-damage-pulse](https://github.com/wssfk12138/dsh-damage-pulse) · **Description**: DeepSeek Harness balance monitor with cache-aware damage-number animations for every token charge. · **Stars**: ★ 24 · **Evidence**: declared
- **Plugin**: [@feiyang666/dsh-usage-plugin](https://github.com/feiyang-dev/dsh-usage-plugin) · **Description**: DeepSeek Harness usage & cost tracker plugin: per-call token/cache-hit stats, peak/off-peak billing, DeepSeek balance query, CSV/JSON/PNG export with custom de… · **Stars**: ★ 22 · **Evidence**: declared
- **Plugin**: [@pinkbanana/dsh-balance](https://github.com/crazywoola/dsh-balance) · **Description**: DeepSeek Harness plugin that shows API balances and models in Settings, with balance below the chat composer · **Stars**: ★ 19 · **Evidence**: declared
- **Plugin**: [dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) · **Description**: DSH 上下文注入审计插件：统计 AGENTS.md 指令链 / 技能目录 / 工具 schema / MCP 工具的 token 成本，检测重复与冲突；原生 Context Doctor 面板 + context_audit 工具。 · **Stars**: ★ 12 · **Evidence**: declared
- **Plugin**: [dsh-opencode-go-usage](https://github.com/Xenia0922/dsh-opencode-go-usage) · **Description**: OpenCode Go 用量与花费面板 — DeepSeek Harness 插件:可拖拽缩放的悬浮仪表盘,实时展示 OpenCode Go 配额、逐请求用量与花费 · **Stars**: ★ 10 · **Evidence**: declared

[View all 538 finance plugins →](https://dshhub.org/?category=finance)

### integrations · 1058

### 插件 · 描述 · 星星 · 证据
- **插件**：[dsh-plugin-reactive-resume](https://github.com/amruthpillai/reactive-resume/tree/ab811b5f10296871ede5c6cf913050269239f11c/packages/dsh-plugin) · **描述**：用于响应式简历的 DeepSeek Harness 插件：将您的简历和工作申请桥接到 MCP 上的 Harness 会话中。 · **星星**：★ 40988 · **证据**：声明
- **插件**：[@open-pets/dsh](https://github.com/alvinunreal/openpets/tree/042844d8e3cd43d8984a2742865d100c3a7be4a4/packages/dsh) · **描述**：本地优先的桌面伴侣平台，具有动画宠物、插件 SDK 和编码代理集成。 · **星星**：★ 1078 · **证据**：声明
- **插件**：[@agentrq/dsh-plugin-agentrq](https://github.com/agentrq/agentrq/tree/b63a82b6228e61034a9a6cc37f551b2e912f1aa5/plugins/deepseek-harness) · **描述**：DeepSeek Harness 的 AgentRQ 任务管理器：创建、管理和自动拉取 AgentRQ 任务，无需离开线束 · **星星**： ★ 1074 · **证据**：声明
- **插件**：[dsh-deja](https://github.com/vshulcz/deja-vu/tree/659019f2f845d0de31116785035a0548a0229358/packages/dsh-deja) · **描述**：将其他 19 个编码代理的会话历史记录带入 DeepSeek Harness：本地索引上的召回、会话摘要和每个文件历史记录工具，以及操作… · **星星**： ★ 656 · **证据**：声明
- **插件**：[@vibeinging/dsh-canvas-tools](https://github.com/vibeinging/dsh-desktop/tree/3e647be1e946f17227647b2154208e7a521173eb/packages/dsh-canvas-tools) · **描述**：产品主机上的会话范围版本化画布和本地站点工具 · **星星**：★ 621 · **证据**：声明

[查看所有 1058 个集成插件 →](https://dshhub.org/?category=integrations)

###接口·2565

### 插件 · 描述 · 星星 · 证据
- **插件**：[@open-design/dsh-runtime](https://github.com/nexu-io/open-design/tree/eee03776fbffc24e40f8278b38ef6e95c011f870/packages/dsh-runtime) · **描述**：用于开放设计的 DeepSeek Harness 配置文件运行时 · **星星**：★ 87709 · **证据**：声明
- **插件**：[dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) · **描述**：DSH Web插件：类似VSCode的右侧边栏（资源管理器/编辑器/终端/git/浏览器），每个对话会话隔离。公开其他插件的服务... · **星星**：★ 1712 · **证据**：声明
- **插件**：[@open-pets/dsh](https://github.com/alvinunreal/openpets/tree/042844d8e3cd43d8984a2742865d100c3a7be4a4/packages/dsh) · **描述**：本地优先的桌面伴侣平台，具有动画宠物、插件 SDK 和编码代理集成。 · **星星**：★ 1078 · **证据**：声明
- **插件**：[@agentrq/dsh-plugin-agen