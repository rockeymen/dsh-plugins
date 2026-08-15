# @xilin3/dsh-prompt-persona

一个 **DeepSeek Harness（DSH）插件**：在 Web 设置页里可视化编辑系统提示词（`deployment:persona`），并实时预览改动效果。即「给 Harness 加系统提示词」的**方法 1 —— 改部署 persona**。

> 在 Harness 的系统提示词组装模型里，`deployment:persona` 是唯一一段「由配置/部署作者撰写」的片段（order `0`）。本插件接管这段片段，把它变成设置页里可直接编辑、可预览、可持久化的内容，而无需改动 Harness 本体或手写 `cordis.patch.yml`。

## 特性

- 🎛️ **可视化编辑**：设置页新增「系统提示词」区块，直接写 persona 文本。
- 🔀 **三种注入模式**：`replace`（替换）/ `append`（追加）/ `off`（关闭）。
- 👁️ **当前提示词**：实时显示当前生效的**完整系统提示词**（persona + harness 身份 + 工具引导等所有 section）。
- ✨ **添加效果（预览）**：把草稿应用到一份副本上，点「预览效果」即可看到**保存后的完整提示词**，不落盘、不污染当前状态。
- 💾 **乐观并发保存**：基于 settings revision 的冲突检测（`SETTINGS_CONFLICT` → HTTP 409），避免覆盖他人同时的修改。
- 🧩 **模板变量**：persona 支持 `{{model}}` / `{{cwd}}` / `{{provider}}` 严格插值。

## 界面

设置页（Settings）里会多出一个「系统提示词」section，包含：

### 区块 · 说明
- **区块**: 注入模式 · **说明**: 下拉选择 替换 / 追加 / 关闭
- **区块**: 自定义提示词 · **说明**: 多行文本域，persona 内容，支持模板变量
- **区块**: 保存并应用 / 预览效果 · **说明**: 持久化到 `settings.yaml`；或仅预览草稿效果
- **区块**: 当前提示词 · **说明**: 当前生效的完整系统提示词（只读）
- **区块**: 添加效果（预览） · **说明**: 草稿应用后的完整提示词（点击「预览效果」后出现）

## 工作原理

```text
settings.yaml                    HTTP 路由
  prompt-persona ──────────────► /_dsh/prompt-persona/settings
       │  (persona, mode)              ▲
       ▼                               │ GET snapshot / POST preview|save
system-prompt/assemble waterfall ──────┘
       │  把 persona 写入 deployment:persona section
       ▼
完整系统提示词（每步动态组装）
```

1. **宿主插件**（`lib/index.js`）注册 settings namespace `prompt-persona`，并监听全局 `system-prompt/assemble` waterfall；每次组装完成后，把设置里的 persona 按 mode 写入 `deployment:persona` section。
2. **HTTP 后端**（`lib/web.js`）在同源挂一个路由，向浏览器提供当前提示词、预览、保存三个能力。
3. **浏览器插件**（`lib/client.js`）通过 `settings.section` slot 注入 React 设置面板。

## 安装

把插件加入 web profile（`$DSH_HOME/profiles/web/`，Windows 默认 `C:\Users\<你>\.dsh\profiles\web\`）。

**方法 A：命令行**（推荐）

```bash
dsh plugin --profile web add github:xilin3/dsh-prompt-persona
```

然后把 `@xilin3/dsh-prompt-persona` 追加到该 profile `package.json` 的 `dsh.profile.bundles` 里（见方法 B 的完整示例），最后重启 `dsh web`。

**方法 B：手动编辑 profile 的 `package.json`**

```json
{
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "@xilin3/dsh-prompt-persona"
      ]
    }
  },
  "dependencies": {
    "@xilin3/dsh-prompt-persona": "github:xilin3/dsh-prompt-persona"
  }
}
```

然后在 profile 目录执行：

```bash
pnpm install
```

最后重启 `dsh web`（前端/Host 改动**不会**热更新，必须重启进程并刷新浏览器）。

> 本地开发也可用 `"file:../path/to/dsh-prompt-persona"`，或把源码复制到 profile 目录后用 `"file:dsh-prompt-persona"` 相对路径挂载。

## 注入语义

`mode` 决定 persona 如何作用于 `deployment:persona` section（该 section 的原始文本记为 **当前 persona**）：

### `replace`（默认）

整段替换：

```text
当前 persona:
  你是一个 DeepSeek 助手。

保存 persona:
  你是一名资深数据分析师，工作目录是 {{cwd}}。

结果 deployment:persona:
  你是一名资深数据分析师，工作目录是 {{cwd}}。
```

### `append`

追加到现有 persona 之后（空行分隔）：

```text
当前 persona:
  你是一个 DeepSeek 助手。

保存 persona:
  请始终用简体中文回答。

结果 deployment:persona:
  你是一个 DeepSeek 助手。

  请始终用简体中文回答。
```

### `off`

不注入，保留 deployment 默认 persona。

## 模板变量

persona 是模板，保存/渲染时执行**严格插值**（未注册的变量会报错）。可用变量：

### 变量 · 含义
- **变量**: `{{model}}` · **含义**: 当前模型（agent-default-model 或运行时变量）
- **变量**: `{{provider}}` · **含义**: 当前 provider
- **变量**: `{{cwd}}` · **含义**: 进程工作目录

## 配置参考

持久化在 `$DSH_HOME/settings.yaml`，namespace 为 `prompt-persona`：

```yaml
prompt-persona:
  persona: |
    你是一名资深数据分析师。
    工作目录是 {{cwd}}，模型是 {{model}}。
  mode: replace        # replace | append | off
```

### 字段 · 类型 · 默认 · 说明
- **字段**: `persona` · **类型**: string · **默认**: `""` · **说明**: 自定义 persona 文本（模板）
- **字段**: `mode` · **类型**: enum · **默认**: `"replace"` · **说明**: `replace` / `append` / `off`

非法 `mode` 会被归一化为 `replace`；`persona` 会做 `trim`。

## HTTP API

浏览器设置页使用的同源路由 `/_dsh/prompt-persona/settings`：

### 方法 · 请求体 · 说明
- **方法**: `GET` · **请求体**: — · **说明**: 返回 `{ settings: {value, revision, applies}, currentPrompt }`
- **方法**: `POST` · **请求体**: `{ action: "preview", persona, mode }` · **说明**: 返回 `{ previewPrompt }`
- **方法**: `POST` · **请求体**: `{ action: "save", persona, mode, expectedRevision }` · **说明**: 保存；返回新的 snapshot

保存带 `expectedRevision`（乐观锁）：revision 不匹配时返回 HTTP `409`（`code: "settings-conflict"`），客户端需重新加载后重试。

## 依赖（peerDependencies，由 DSH 宿主提供）

### 包 · 用途
- **包**: `@deepseek-ai/dsh-settings` · **用途**: settings namespace 注册 / 读写 / revision 并发控制
- **包**: `@deepseek-ai/dsh-system-prompt` · **用途**: `PERSONA_SECTION`、`renderPrompt`、assemble waterfall
- **包**: `@deepseek-ai/dsh-host-webserver`（可选） · **用途**: 挂载同源 HTTP 路由
- **包**: `@deepseek-ai/dsh-client-runtime` / `-ui-settings` / `-ui-slots` · **用途**: 浏览器端 `slots` 服务与 `settings.section` slot
- **包**: `schemastery` · **用途**: 配置 schema
- **包**: `cordis` / `react` · **用途**: 运行时由宿主注入