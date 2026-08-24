#dsh-vision-bridge

**通用视觉桥**，适用于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) — `dsh-vision-router` 的独立替代品。

当聊天模型**没有视觉**（例如 `deepseek-v4-flash`）并且消息包含图像时，图像永远不会到达纯文本模型。相反，插件选择 **如何** 来处理它 - 取决于配置的 **模式**：

- **`hybrid`**（默认）——使用视觉模型自动将图像块重写为文本描述；工具仍可用于明确的后续行动。与旧版 v0.1.x 行为相同。
- **`llm`** — 仅通过视觉模型自动重写（纯文本模型永远不会看到原始图像）；工具仍然可调用。
- **`tools`** — 自动重写已**关闭**。文本模型必须显式调用 `describe_image`（或其他工具），否则适配器在原始图像上失败。当您希望模型决定*是否*进行视觉调用时很有用。

另外，**多通道端点**：您可以链接 `dsh-catalog`、`openai-compatible`、`ollama` 和 `custom`（基于模板）端点，而不是通过一个 DSH 目录模型进行路由 - 顺序回退、每通道冷却、完全故障时的可选占位符以及零配置 Ollama 发现。

- **`describe_image`** 工具 — 向视觉模型询问图像（附件 ID 或本地路径）。
- **描述缓存** — LRU 按图像字节 + 提示 + 模型 + 模式。相同的图像、相同的提示、相同的型号 → 0 次网络调用。
- **设置 → 愿景** — 选择模型、模式、策略、升级策略和渠道列表。用于实时健康检查的测试视力按钮。

## 安装

```bash
# From npm:
dsh plugin --profile web add @goodandready/dsh-vision-bridge

# From GitHub:
dsh plugin --profile web add github:GooDAnDReaDY/dsh-vision-bridge

# Locally from a checkout:
dsh plugin --profile web add /path/to/dsh-vision-bridge
```

重新启动Web UI，打开**设置→视觉**。

## 它是如何工作的

1. 图像（来自您或来自 `generate_image` 等工具）进入聊天并由 UI 显示。
2. **针对每个 LLM 请求**，在两点：
   - `agent/pre-step`，它查看从收件箱中声明的消息 - 即**您**附加的图像。在这里重写它们会将描述放入会话历史记录中，因此模型在以后的回合中仍然会记住该图像。
   - `llm/stream`，它看到**整个传出请求**。这是其他一切之下的网络：工具结果直接附加到会话中，并且永远不会通过 `pre-step`，因此工具生成的图像将不受影响地到达适配器，并导致 `does not support image input` 失败。
3. **模式门** (`hybrid` / `llm` / `tools`) 决定重写是否运行。在 `tools` 模式下，模型必须调用 `describe_image` 本身。
4. **通道选择**：按顺序尝试`config.channels`。如果某个通道返回 4xx/超时/失败，则会进入 60 秒的冷却时间并尝试下一个通道。对于 `autoLocalOllama: true`（默认），`http://localhost:11434` 在启动时被探测，并在可达时预先考虑。
5. **视觉模型**产生描述。使用 `escalation: auto-escalate`，复杂图像在替换之前会触发第二次更深的传递。
6. **缓存**（默认情况下 LRU 256 条目）由 `sha256(bytes) + prompt + model + mode` 键入。相同的图像+不同的提示或模型→缓存未命中（正确）。
7. 文本模型读取文本，而不是像素。 `UNSUPPORTED_CONTENT` 转弯永远不会失败。
8. **`describe_image`** 保持精确跟进。

## 设置

**设置 → 愿景**（顶层部分）：

- **模式** — `hybrid` / `llm` / `tools`（见上文）
- **描述策略** — `auto` / `llm` / `ocr-local` / `cache-only`。 `ocr-local` 和 `cache-only` 保留用于 v2.0 本地 OCR 后端。
- **升级** — `simple-only`（默认，一次传递）或 `auto-escalate`（复杂图像的第二次更深传递：密集文本、代码、UI、表格、图表）
- **视觉提供者/模型** — 显式覆盖；空=从配置的通道中自动选择第一个具有视觉功能的模型
- **通道** — 按顺序尝试的视觉端点列表；保存时键入允许列表和字段验证；用于关键存在的每个通道状态点
- **测试视觉** — 针对当前通道设置运行一次真实调用并报告 `OK (NNNms)` 或失败原因

在`settings.yaml`中：

````yaml
dsh-vision-bridge：
  # 模式（混合=遗留行为；工具=无自动重写）
  模式：混合动力

  # 策略（auto = Vision LLM；ocr-local / 仅缓存为 v2.0 保留）
  描述策略：自动

  # 升级（自动升级=复杂图像的第二遍）
  升级：仅简单

# 旧版单通道 (dsh-catalog) 快捷方式 — 相当于通道: [{type: 'dsh-catalog',provider,model}]
  VisionProvider: "" # 空 = 自动选择第一个具有视觉功能的
  VisionModel: "" # 空=自动选择

  # 频道列表 — 空 = 上面传统的自动选择
  频道：[]

  # 每个通道的行为
  ChannelFallback: 顺序 # 顺序 |平行种族
  通道超时时间：30000
  channelCooldownMs: 60000 # 跳过失败的通道 60 秒
  ChannelFailureMode: 占位符 # 占位符 |错误
  autoLocalOllama: true # 启动时探测 http://localhost:11434/v1
  keysFromEnv: # 当通道没有 apiKey 时尝试的 env-var 名称
    - VISION_API_KEY
    - DASHSCOPE_API_KEY
    - OPENAI_API_KEY
    - 智普AI_API_KEY

  # 消毒+限制
  sanitizeImages: true # 遗留字段，由 mode=tools 控制
  cacheEnabled: true # LRU描述缓存
  缓存最大条目数：256
  最大图像字节数：20971520
  超时时间：120000
```

### Channel examples

`channels` is an ordered list. The first successful response wins; subsequent channels are tried only on failure or 4xx.

```yaml
dsh-vision-bridge：
  渠道：
    # 1.免费本地Ollama（无钥匙，图像永远不会离开机器）
    - 类型： olama
      基本网址：http://localhost:11434/v1
      型号：<OLLAMA_VL_MODEL> # 例如llava:13b — 选择本地安装的一个

    # 2. OpenAI兼容端点（任何OpenAI格式的baseURL）
    - 类型：openai 兼容
      baseURL: https:///v1 # OpenRouter / vLLM / Ollama-cloud / 等。
      apiKey: "" # 空=从keysFromEnv解析
      型号：
      协议：openai-聊天# openai-聊天| openai-回应

    # 3. 自定义模板（占位符替换；见下文）
    - 类型：定制
      基本网址：https://<CUSTOM_HOST>/vision
      api 密钥：“”
      型号：<CUSTOM_MODEL>
      请求模板： |
        {“模型”：{{模型}}，“消息”：[{“角色”：“用户”，“内容”：[{“类型”：“image_url”，“image_url”：{“url”：{{dataUrl}}}}，{“类型”：“文本”，“文本”：{{提示}}}]}]，“max_tokens”：1024}
      响应路径：choices.0.message.content
```

Custom-template placeholders are substituted unquoted — the plugin wraps them with `JSON.stringify`. Available: `{{model}}`, `{{prompt}}`, `{{image}}` (base64 only, no `data:` prefix), `{{dataUrl}}` (full `data:image/...;base64,...`), `{{mime}}`.

## Replacing `dsh-vision-router`

This does the same job but under your control and with your own vision model. If `dsh-vision-router` is installed, remove it:

```sh
dsh 插件 --profile web 删除 dsh-vision-router
````

## 结构

```
dsh-vision-bridge/
├── package.json            # dsh bundle/plugin metadata + peerDependencies
├── cordis.patch.yml        # bundle layer: inserts the plugin row
├── lib/index.js            # host: agent/pre-step sanitizer + describe_image + channels driver + /config, /channels, /test routes
├── lib/channels.js         # multi-channel endpoint driver (dsh-catalog / openai-compatible / ollama / custom) — pure stdlib
├── lib/cache.js            # LRU description cache + composite key derivation
├── lib/client.js           # browser: top-level Settings → Vision section (mode, strategy, escalation, channels, test)
├── README.md
└── LICENSE                 # MIT
```

## 兼容性说明

- **默认行为与 v0.1.4 相同。** 现有用户升级后不会看到任何变化，除非他们切换模式、添加频道或更改策略/升级。
- 该插件注册顶级设置部分 (`Vision`)、`composer.action` 插槽注入（尽力而为；优雅地回退到旧版 DSH）以及 HTTP 路由 `/dsh-vision-bridge/config`、`/dsh-vision-bridge/channels`、`/dsh-vision-bridge/models`、`/dsh-vision-bridge/test`。
- **没有新的对等依赖项。** 通道驱动程序使用 Node 22 的本机 `fetch` 和 `AbortController`。