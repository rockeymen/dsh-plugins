# dsh-plugin-lmstudio

在 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）Web
界面上，把 [LM Studio](https://lmstudio.ai) 本地部署的模型当作对话模型使用。

LM Studio 提供 OpenAI 兼容端点（默认 `http://127.0.0.1:1234/v1`）。本插件把
DSH 内置的 `llm-pi-ai` 适配器指向该端点，模型选择器随即出现本地模型——
不消耗云端 API 额度。

[English](README.md) · MIT

## 前置条件

- DSH CLI + pnpm（见 DSH 文档）
- LM Studio 已开启 **Developer → Start Server**（默认端口 `1234`）
- LM Studio 里至少加载了一个模型

## 安装

```sh
dsh plugin --profile web add dsh-plugin-lmstudio
```

本包声明了 `dsh.bundle`，`dsh plugin` 会自动把它加进 profile 的 bundle 层。
然后重启 `dsh web` 并刷新 http://127.0.0.1:3080。

## 配置

插件内置一条 `lm-studio` provider 路由：

### 字段 · 默认值 · 含义
- **字段**: `baseURL` · **默认值**: `http://127.0.0.1:1234/v1` · **含义**: LM Studio OpenAI 兼容端点
- **字段**: `api` · **默认值**: `openai-completions` · **含义**: 传输协议
- **字段**: `models` · **默认值**: 一个示例模型 · **含义**: 替换为你实际加载的模型

内置路由是**组合 base**：你在 `$DSH_HOME/settings.yaml` 的 `llm-pi-ai:`
分节里写的内容会按提供方覆盖它，因此你自己的模型与端点优先。本地 LM
Studio 无需 API Key；若你在 LM Studio 里开启了 Key 认证，请在 settings
层补上 `apiKeyEnv` 或 `Authorization` 头。

### 指向你实际的模型

1. 在 LM Studio 里加载想用的模型。
2. 查确切模型 id：`curl http://127.0.0.1:1234/v1/models`，读 `id` 字段
   （通常是 `厂商/模型名`，如 `qwen/qwen3.5-9b`）。
3. 在 **设置 → 模型** 里编辑该路由（"询问端点"按钮可自动发现模型），或直接
   在 `$DSH_HOME/settings.yaml` 覆盖：

```yaml
llm-pi-ai:
  providers:
    lm-studio:
      models:
        - id: qwen/qwen3.5-9b
          name: Qwen3.5 9B (LM Studio)
          contextWindow: 8192
          maxTokens: 4096
```

`settings.yaml` 热加载，无需重启 `dsh web`。

## 使用

刷新页面，打开输入框上方的模型选择器，选择 LM Studio 模型（显示在
"LM Studio (本地)" 下）。流量只走 `127.0.0.1:1234`，DeepSeek API 余额不受影响。

> 小贴士：只想纯聊天（不使用任何 agent 工具）时，可创建一个"聊天模式"
> agent preset（空的 `agent.cordis.yml`），在新会话界面选择它——对所有
> 模型（本地或云端）都适用。