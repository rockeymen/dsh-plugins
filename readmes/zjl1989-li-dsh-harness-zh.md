# dsh-harness-zh

[![npm version](https://img.shields.io/npm/v/dsh-harness-zh.svg)](https://www.npmjs.com/package/dsh-harness-zh)
[![npm downloads](https://img.shields.io/npm/dm/dsh-harness-zh.svg)](https://www.npmjs.com/package/dsh-harness-zh)
[![License](https://img.shields.io/npm/l/dsh-harness-zh.svg)](LICENSE)

**DeepSeek Harness 中文汉化插件** —— 在运行时把 DSH 的全部系统提示词、工具描述与运行时上下文翻译成中文。

这是一个**纯运行时**插件：它通过 DSH 的 `system-prompt/assemble` 瀑布钩子，在每次组装提示词后把模型可见的英文文本替换为中文，**不修改任何 DSH 源码**。卸载插件即完全还原英文。

当前内置 **1788 条翻译**，覆盖系统提示 sections、运行时上下文、全部工具描述与参数描述，以及 cordis 完整 API 目录（55 服务 + 56 事件）。

## 特性

- ✅ **零源码修改**：不碰 `node_modules`，升级 DSH 后依然有效
- ✅ **覆盖面广**：系统提示 sections、运行时上下文 contexts、工具描述与参数描述、cordis API 目录全部汉化
- ✅ **协议安全**：`[exit code: N]`、`[killed by signal: X]`、`[sandbox: ...]`、`[stderr]` 等被 DSH 或前端解析的机器协议标记**保留原样**，不破坏下游解析
- ✅ **可开关**：`sections / contexts / tools` 三类翻译可分别关闭
- ✅ **即插即用**：作为普通 DSH 插件加载，卸载即还原

## 安装

### 方式一：npm 包（推荐）

```bash
npm install dsh-harness-zh
# 或
pnpm add dsh-harness-zh
```

### 方式二：从 GitHub 安装

```bash
npm install git+https://github.com/zjl1989-li/dsh-harness-zh.git
```

### 方式三：本地开发（直接引用本仓库）

```bash
npm install <本仓库路径>
```

## 启用

### 方式一：UI 插件管理（推荐）

在 DSH Web GUI 的 **设置 → 插件管理** 中添加 `dsh-harness-zh`，重启后生效。UI 会正确登记 bundle 并持久化配置。

### 方式二：profile bundle 列表

在 profile 的 `package.json` 的 `dsh.profile.bundles` 列表中加入（`cordis.yml` 是自动生成文件，请勿直接编辑）：

```json
{
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "dsh-harness-zh"
      ]
    }
  }
}
```

### 方式三：cordis.patch.yml

在 DSH profile 的 `cordis.patch.yml` 中追加插件条目：

```yaml
- $plugin: dsh-harness-zh
  config:
    includeSections: true
    includeContexts: true
    includeTools: true
```

重启 DSH 后生效。**无需改动任何 DSH 源码。**

## 配置

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `includeSections` | boolean | `true` | 翻译系统提示词 sections（身份、工具指导等） |
| `includeContexts` | boolean | `true` | 翻译运行时上下文 contexts（沙箱策略、审批策略、委托声明等） |
| `includeTools` | boolean | `true` | 翻译工具描述与参数描述 |
| `verbose` | boolean | `false` | 调试日志 |

## 工作原理

DSH 在每次模型请求前通过 `ctx.systemPrompt.assemble()` 组装提示词，组装过程会触发 `system-prompt/assemble` 瀑布事件。本插件在该瀑布的 `next()` 之后：

1. 遍历 `assembly.sections`，将每个 section 的 `text` 经 `translate()` 汉化；
2. 遍历 `assembly.contexts`，汉化每个动态上下文文本；
3. 遍历 `assembly.tools`，汉化工具 `description` 并递归汉化 `parameters` 中的 `description` 字段。

`translate()` 使用 `dict/` 目录下的 JSON 字典，匹配顺序：

1. **精确匹配**：整句文本与字典 `en` 完全一致时直接替换；
2. **空白折叠匹配**：将连续空白折叠为单个空格后比较，容忍源码拼接处的空格差异（如 `base + background` 的边界）；
3. **模板正则**：对含路径、数字、模式名等动态部分的文本，用 `template: true` 条目做整体正则替换（`$1`、`$2` 引用捕获组）。

机器协议标记与代码标识符一律保留。

## 翻译字典

所有译文集中存放在 [`dict/`](./dict) 目录，当前 5 个字典共 **1788 条**：

| 字典 | 条目数 | 覆盖内容 |
| --- | --- | --- |
| `core.json` | 23 | 身份行、沙箱/审批策略、委托声明、工作区指令 |
| `tools-fs-bash.json` | 39 | read/write/edit/bash 工具与参数 |
| `tools-fs-core.json` | 221 | pwsh/fs/cordis 工具、plan-mode、sandbox 等 |
| `tools-web-jobs-goal.json` | 264 | web/jobs/goal/ralph/workflow/subagent 等 |
| `cordis-api.json` | 1241 | cordis 完整 API 目录（55 服务 + 56 事件 + 方法/参数/返回值） |

字典格式：

```json
{
  "包名:键名": {
    "kind": "section | context | tool | param | render | command | const",
    "en": "英文原文（整句），或模板正则（当 template: true）",
    "zh": "中文译文，模板中可用 $1、$2 引用捕获组",
    "template": true
  }
}
```

### 收录规范

- **只收模型可见文本**：经工具输出、结果渲染、停止原因错误回传给模型的完整句子；纯内部校验/配置错误不收
- **动态纯数据字符串不收**：如 job_list 行格式、presentCall 直接显示的标题
- **术语统一**：agent→代理、job→任务、session→会话、provider→提供方、fiber→纤程
- **机器协议原样保留**：`[status: ...]`、`[exit code: N]`、`[sandbox: ...]`、`<system-reminder>` 等标记本身不动，仅译内部说明文字
- **代码标识符保留**：工具名、参数名、`${...}`、`{{...}}`、反引号代码片段不译

欢迎通过 PR 补充或修正译文。

## 发布

- **npm**: [dsh-harness-zh](https://www.npmjs.com/package/dsh-harness-zh)
- **GitHub**: [zjl1989-li/dsh-harness-zh](https://github.com/zjl1989-li/dsh-harness-zh)

## 社区收录

本插件已通过 GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic 加入 DSH 社区插件生态：

- **dsh-plugin-marketplace**（设置 → 插件 的市场标签页）：实时同步 `dsh-plugin` topic，仓库已自动收录，用户可直接搜索 `harness-zh` 一键安装
- **awesome-dsh-plugin**：符合收录要求（`dsh.bundle` manifest + `cordis.patch.yml`），可提交 PR 加入精选列表
- **awesome-deepseek-harness**、**dshfind** 等社区列表均可提交

## 许可证

MIT
