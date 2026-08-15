# @deepseek-ai/dsh-llm-wechat

中文 | [English](README.en.md)

> 独立公开仓库：本插件从项目内独立维护，源码位于 `dsh-llm-wechat` 仓库。

DeepSeek Harness 的**微信网关适配插件**：让 DSH 把微信小程序「Coding Plan」的 Deepseek-v4-flash（chatapi.weixin.qq.com）当作官方 DeepSeek 使用——思考进思考块、工具调用正常、正文无标签。

复用官方 `dsh-llm-deepseek` 的 `DeepSeekAdapter`（请求序列化、错误映射、模型解析、重试策略全部继承），只在响应侧加了一层**流式转译**。**不修改任何 DSH / pi-ai 源码。**

## 为什么需要这个插件

微信网关的返回有三个官方 DeepSeek 没有的怪癖，DSH 原生解析器无法处理：

| 微信的怪癖 | 插件处理 |
|---|---|
| 思考内容不放 `reasoning_content`，而是连同 `</think>` 标签**整个塞进 `content`** | 流式拦截器把 `</think>` 之前的文本剥离并重排进 `reasoning_content`，正文只留纯净答案 |
| 工具调用流式 delta 的后续片段**显式发 `id: null` / `name: null`**，覆盖首个 delta 的正确值 | 只接受非空字符串更新 id/name |
| DSH 的工具结果以 `tool-result` 块存放，序列化时需展开为 `role: tool` 消息 | 对齐官方完整版（含 `(no output)` 兜底） |

## 工作原理

```
微信流:  "We need answer... final.  </think>141.3717"   （思考+标签全在 content）
              │
              ▼  WechatAdapter.request（拦截器：parseSse 与 translate 之间）
DSH 流:   reasoning_content: "We need answer... final."
          content:           "141.3717"                （标准格式，DSH 上层无感）
```

- **请求侧**：微信端点协议与官方 DeepSeek 完全一致（OpenAI 兼容），原样透传，仅映射思考档位 `off/high/max` → `thinking: {type}` + `reasoning_effort`。
- **响应侧**：`translate` 前插入 `ThinkTagSplitter` 状态机（处理标签跨 chunk 被切开、思考含尖括号、思考未闭合兜底等边界）。
- **system 增强**：微信模型对"工具只能通过 run_code 调用"的遵循较弱，插件在 system 末尾追加一段强约束（仅 wechat 通道生效）。

## 安装

### 方式一：dsh plugin（推荐，官方规范）

```sh
# 在包含 dsh-llm-wechat 目录的位置执行
dsh plugin --profile web add ./dsh-llm-wechat
```

`dsh plugin add` 会把包以 `link:` 方式装进 profile，并把 `dsh.bundle` 声明的 patch 层（`cordis.patch.yml`）追加到 `dsh.profile.bundles`——**无需手动改任何文件**。

发布到 npm 后（待发布）：

```sh
dsh plugin --profile web add @deepseek-ai/dsh-llm-wechat
```

### 方式二：手动

1. 把包复制到 DSH 安装树的 `node_modules/@deepseek-ai/dsh-llm-wechat`；
2. 在 `$DSH_HOME/profiles/web/package.json` 的 `dependencies` 加 `"@deepseek-ai/dsh-llm-wechat": "link:<绝对路径>"`，跑 `pnpm install`（生成 lock）；
3. 在 `$DSH_HOME/profiles/web/cordis.patch.yml` 加：

```yaml
- insert:
    - id: llm-wechat
      name: '@deepseek-ai/dsh-llm-wechat'
```

### 配置 credentials

在 `$DSH_HOME/.credentials.yaml` 存微信 Token（也可以在启动环境导出 `WECHAT_API_KEY`）：

```yaml
WECHAT_API_KEY: <微信 Coding Plan 的 API Token>
```

## 配置（settings.yaml）

重启 DSH 后，在 `$DSH_HOME/settings.yaml` 加 `llm-wechat:` 段（热加载，无需重启）：

```yaml
llm-wechat:
  apiKeyEnv: WECHAT_API_KEY              # credentials 引用
  baseURL: https://chatapi.weixin.qq.com/openai/v1
  thinking: enabled                      # enabled | disabled（disabled 锁死 off 档）
  reasoningEffort: high                  # off | high | max，默认 high
  maxTokens: 48000                       # 微信 maxOutput 上限 48000
  defaultContextWindow: 200000           # 微信 maxInput 上限 200000
  models:
    - id: Deepseek-v4-flash
      name: WeChat Deepseek-V4-Flash
      contextWindow: 200000
      maxTokens: 48000
  stripThinkingTags: true                # 是否剥离 </think> 标签（默认 true）
  streamIdleTimeoutMs: 300000            # 流式空闲超时，默认 5 分钟
  retryPolicy:                           # 可选；默认有界重试
    mode: always
    backoff:
      initialDelayMs: 500
      maxDelayMs: 10000
      jitterRatio: 0.1
```

配置字段与官方 `dsh-llm-deepseek` 对齐（`thinking`/`reasoningEffort`/`models`/`retryPolicy` 等），另加 `stripThinkingTags`。模型选择器里会出现 **WeChat → Deepseek-V4-Flash**，思考强度可选 off / high / max。

> 注意：插件注册的 provider route 是 `wechat`。如果之前在 `llm-pi-ai.providers.weixin` 配过微信，**必须删除**该段，否则 `DUPLICATE_ADAPTER` 冲突。


## 推理等级自动暴露

**装了这个插件，wechat 供应商的模型在模型选择器里会自动出现推理等级下拉（off / high / max），无需任何额外配置。**

原理：DSH 的模型选择器只要检测到模型元数据里有 `reasoning.efforts` 就会渲染等级下拉。插件注册的 `wechat` route 的 `resolveModel` **无条件返回**：

```js
reasoning: {
  efforts: [{ id: "off" }, { id: "high" }, { id: "max" }],
  defaultEffort: "high"   // 跟随 settings 的 reasoningEffort
}
```

链路：装插件（注册 wechat route）→ DSH 读取元数据 → 返回 `reasoning.efforts` → **UI 自动显示等级下拉**。

> 对比：如果你之前用 pi-ai 或其他通道配 wechat，模型元数据里没有 `reasoning.efforts`（pi-ai 需要手动配置 `reasoningEfforts` 映射才暴露），所以 UI 里看不到等级。插件把这个写死在元数据里，**开箱即用**。

### 档位说明

| 档位 | 效果 | 建议 |
|---|---|---|
| `off` | `thinking: {type: "disabled"}`，不思考 | 简单问题/省 token |
| `high` | `thinking: {type: "enabled"}` + `reasoning_effort: high` | **日常推荐** |
| `max` | `thinking: {type: "enabled"}` + `reasoning_effort: max` | 思考最长，但易撞微信 60s 网关超时 |

只暴露这三档是因为**微信网关只认 off/high/max**（传其他值报 `UNSUPPORTED_REASONING_EFFORT`），与官方 DeepSeek 行为一致。

### 给第三方用户的快速接入清单

1. 安装插件（`dsh plugin --profile web add ./dsh-llm-wechat`）；
2. 在 `$DSH_HOME/.credentials.yaml` 存 `WECHAT_API_KEY`；
3. （可选）在 `$DSH_HOME/settings.yaml` 加 `llm-wechat:` 段设置默认档位（默认 high）；
4. 重启 dsh web；
5. 模型选择器 → **WeChat → Deepseek-V4-Flash** → 选择推理等级（off/high/max）→ 开聊。

> 如果你之前用 `llm-pi-ai.providers.weixin`（或其他方式）配过微信，**删除旧配置**再装插件，避免选择器里出现两组重复且旧组无等级。

## 已知限制

### 微信网关固有问题（插件无法解决）

- **60 秒请求超时**：`max` 档思考很长（实测可达 19k+ 字符），容易撞网关 60s 掐断 → `TIMEOUT` / 408。**建议日常用 `high` 档**；`max` 档需配合更大的 `maxTokens` 并接受较高失败率。
- **限流**：每 5 小时约 1200 请求配额；并发上限 6。DSH agent 的多步工具循环会快速消耗配额，触发 `RATE_LIMIT`（429）。
- **模型对工具规则遵循不稳定**：偶发直接调用 collapsed 工具（`glob`/`pwsh` 等）导致 `unknown tool`。插件已在 system 末尾追加强约束缓解，但无法 100% 消除。
- **`reasoning_content` 字段恒空**：思考只在 content 里（已由插件剥离解决）。

### 插件自身

- 复制了官方 `dsh-llm-deepseek` 的 `translate`/`parseSse`/`serializeRequest`（模块私有无法 import）——**官方升级不会自动同步**，DSH 大版本升级后需重新对齐。
- peerDependencies 已放宽为 `*`（不锁版本），但 **DSH 接口变化仍可能破坏插件**——升级 DSH 后需回归测试（运行时兼容性不受 npm 检查保护）。
- 只支持文本；微信本身不支持图像输入，无影响。

## 错误码

与官方 adapter 一致（`LlmError`）：`AUTH`（401/403）、`RATE_LIMIT`（429）、`TIMEOUT`（408/超时）、`QUOTA`、`CONTEXT_WINDOW_EXCEEDED`、`TRANSPORT`、`STREAM_CLOSED`（无 `[DONE]`）、`MALFORMED_RESPONSE`、`EMPTY_RESPONSE`、`MISSING_CREDENTIAL`、`UNSUPPORTED_REASONING_EFFORT`。

## 开发与测试

```sh
node --check lib/index.js && node --check lib/wechat-translate.js   # 语法
# 转译器单测（ThinkTagSplitter 状态机）：见 test/ 目录
# 真实微信流式集成：node test/live-stream.test.mjs（需要有效 Token）
```

## 发布规范

遵循 [deepseek-harness 插件发布指南](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)：

- `dsh.bundle.patch` 声明 bundle 层（本包自带 `cordis.patch.yml`）
- `publishConfig.access: public`（scope 包）
- `files` 白名单：`lib/**`、`cordis.patch.yml`、`README.md`
- 版本对齐 DSH 的 `0.1.0-rc.x`；发布前需测试 DSH 升级兼容
