#dsh-voice

DeepSeek Harness Web GUI 的语音输入有两种模式，每种模式都有自己的
提供商后备链。

**听写** — 按下麦克风，说话，文本就会在您输入时出现在作曲器中
go：语音在静音时被切割成短语，每个短语都被转录在其对应的位置上
拥有。再按一次停止；发送留在您手中。

**语音消息** — 按挥手按钮，录制，再按一次。成绩单
在短暂的取消窗口后插入并发送给代理。

两种模式都可以跨提供商回退，因此一次中断或速率限制不会
丢失你的录音。 API 密钥永远不会到达浏览器：音频被发布到
插件自己的路由和主机与提供商的对话。

## 安装

```bash
# From npm:
dsh plugin --profile web add @goodandready/dsh-voice

# Locally from a checkout:
dsh plugin --profile web add file:/path/to/dsh-voice
```

之后重新启动 Web UI，然后硬刷新浏览器。

## 提供商

### 密钥 · 服务 · 默认模型 · 凭证
- **密钥**：`browser` · **服务**：浏览器自带的语音识别 · **默认模型**： — · **凭证**：无，不向主机上传任何内容
- **密钥**：`deepgram` · **服务**：Deepgram · **默认模型**：`nova-2` · **凭证**：`DEEPGRAM_API_KEY`
- **密钥**：`groq` · **服务**：Groq · **默认型号**：`whisper-large-v3-turbo` · **凭证**：`GROQ_API_KEY`
- **密钥**：`hf` · **服务**：HuggingFace 推理 · **默认模型**：`openai/whisper-large-v3` · **凭证**：`HF_TOKEN`
- **密钥**：`local-whisper` · **服务**：本地whisper.cpp服务器 · **默认模型**：服务器启动时给出的模型 · **凭证**：无，完全离线

密钥通过 DSH 凭证服务读取（设置 → 凭证，或
`$DSH_HOME/.credentials.yaml`），回退到流程环境。一个
没有密钥的提供者会被跳过，但不是致命的。

### 现成的提供商

已经填写了六个提供商 - 将名称放入链中并添加密钥：

### 姓名·型号·凭证
- **名称**：`openai` · **型号**：`whisper-1` · **凭证**：`OPENAI_API_KEY`
- **名称**：`siliconflow` · **型号**：`FunAudioLLM/SenseVoiceSmall` · **凭证**：`SILICONFLOW_API_KEY`
- **名称**：`deepinfra` · **型号**：`openai/whisper-large-v3-turbo` · **凭证**：`DEEPINFRA_API_KEY`
- **名称**：`fireworks` · **型号**：`whisper-v3-turbo` · **凭证**：`FIREWORKS_API_KEY`
- **名称**：`mistral` · **型号**：`voxtral-mini-latest` · **凭证**：`MISTRAL_API_KEY`
- **名称**：`openrouter` · **型号**：`google/gemini-2.5-flash` · **凭证**：`OPENROUTER_API_KEY`

```yaml
- id: dsh-voice
  config:
    message:
      chain:
        - provider: openai
        - provider: local-whisper
```

每个端点在被记录之前都在没有密钥的情况下进行了探测：所有六个端点都回答了 `401`，这是一条存在且需要凭证的路径的答案。模型 ID 是起点 - 覆盖链行中的 `model` 来更改它。

预设与填写字段的自定义提供程序的形式相同，因此同名下的 `customProviders` 条目会直接替换它。

### 您自己的提供商

任何 OpenAI 兼容的 API 都可以添加为提供者并在链中使用
在内置的旁边。两个模板，因为这些 API 不同意如何
音频已发送：

### 模板 · 端点 · 请求 · 读取的脚本
- **模板**：`openai-transcriptions` · **端点**：`{baseURL}/audio/transcriptions` · **请求**：多部分：文件、模型、语言 · **读取自的脚本：`text`
- **模板**：`openai-chat-audio` · **端点**：`{baseURL}/chat/completions` · **请求**：带有 `input_audio` 的 JSON：base64 和格式 · **读取自的脚本：`choices[0].message.content`

OpenRouter 根本没有 `/audio/transcriptions` 端点 - 使用聊天
那里的模板：

```yaml
- id: dsh-voice
  config:
    customProviders:
      - key: openrouter
        template: openai-chat-audio
        baseURL: https://openrouter.ai/api/v1
        model: google/gemini-2.5-flash
        keyEnv: OPENROUTER_API_KEY
    message:
      chain:
        - provider: openrouter
        - provider: local-whisper
```

字段：`key` 是链引用的名称（它不能隐藏内置的
一）、`keyEnv`命名持有API密钥的凭证（空表示没有
授权头），并且`prompt`覆盖与发送的指令
聊天模板中的音频。链中的行仍可能覆盖 `model`。

聊天模板仅接受WAV和MP3，而浏览器记录
webm/opus — 该插件使用 ffmpeg 进行转换，与本地耳语的方式相同
提供商这样做，因此 **`openai-chat-audio`** 需要 ffmpeg。

## 三种说话方式

### 手势 · 会发生什么
- **手势**：点击麦克风 · **发生什么**：听写：语音在暂停时被切断，每个短语都会附加到作曲家
- **手势**：单击波浪 · **会发生什么**：语音消息：录音会一直运行，直到您停止为止，然后在取消窗口后发送文本
- **手势**：**按住挥手** · **发生什么**：仅在按住时记录；释放发送它，将指针移离按钮丢弃
- **手势**：**按住`Ctrl`** · **会发生什么**：同样，无需触及鼠标； `Escape` 丢弃

设置中的热键是 `hotkey` - 修饰符名称（`Control`、`Alt`、`Shift`）或 `KeyboardEvent` 代码。空则将其关闭。

## 浏览器中的识别

将 `browser` 放在链中的第一位，浏览器本身就会识别语音：没有密钥，没有上传到该主机，并且文本出现**当您仍在说话时** - 录音栏中的临时标题，每个完成的短语都会进入作曲家。

```yaml
- id: dsh-voice
  config:
    dictation:
      chain:
        - provider: browser
        - provider: local-whisper   # если браузер не умеет — обычный путь
```

选择之前需要了解两件事：

- **Chrome 将音频发送给 Google。** Firefox 根本没有这样的 API。该插件中的其他所有内容都会在您的浏览器和您自己的主机之间保留音频，因此该提供程序是一个例外 - 除非您自己将其放入链中，否则永远不会使用它。
- 它需要一个安全的上下文（HTTPS 或本地主机），就像麦克风本身一样。

在其后面放置一个普通的提供程序：如果浏览器无法执行此操作，则记录会像往常一样回落到链中。

## 配置（Web GUI）

设置 → **插件 → 插件设置 → 语音** — 插件自己的
插件选项卡中的可折叠卡；侧边栏没有为其保留单独的行。
该卡有四个块：

- **听写** — 后备链（提供者 + 每行可选模型，顺序为
  尝试的顺序）、语言以及结束的沉默阈值
  短语（`vadSilenceMs`，默认 700 毫秒）。
- **语音消息** — 有自己独立的链、语言和取消
  发送消息之前的窗口（`autoSendMs`，默认 4000 毫秒）。
- **您自己的提供商** — 每张卡一个 OpenAI 兼容的 API：名称、模板、
  基本 URL、模型、凭证名称。该名称在两个链中都可以选择
  一旦填写完毕。
- **常规** — 本地耳语端点、二进制、模型、自动启动。

速度对于听写和消息的准确性很重要，这就是连锁店的原因
是分开的：一个合理的对是 Deepgram → Groq → local 用于听写和
Groq → HuggingFace → 本地消息。

## 本地耳语.cpp

本地提供商需要一个正在运行的 [whisper.cpp](https://github.com/ggerganov/whisper.cpp)
服务器：

```bash
whisper-server -m /path/to/ggml-medium-q8_0.bin --host 127.0.0.1 --port 8001
```

设置 `whisperModel`（如果不在 `PATH` 中，则设置 `whisperBin`）和插件
当 `autoStart` 开启时启动服务器本身。而 `whisperModel` 是
空，自动启动保持关闭状态。

**此提供程序需要 ffmpeg。** tweet.cpp 仅接受 WAV 并且
拒绝浏览器记录的 webm/opus，因此主机会转换每个记录
转发之前将其转换为 16 kHz 单声道 WAV。如果是，则将 `ffmpegBin` 指向您的二进制文件
不在`PATH`中。

## 工具

该插件还注册了 `transcribe_audio(file_path, language?)`
代理，使用语音消息链。对于录音和采访很有用
磁盘上已有文件。

## 路线

### 路线·目的
- **路线**：`POST /dsh-voice/transcribe` · **目的**：`{dataBase64, mimeType, mode}` → `{ok, text, provider, tookMs}`
- **路线**：`GET /dsh-voice/status` · **目的**：whisper服务器状态和有效链

## 结构

```
lib/index.js       host: config, routes, transcribe_audio, whisper autostart
lib/providers.js   the four providers, pure functions (network injected)
lib/chain.js       fallback walk over a chain
lib/wav.js         webm/opus → WAV 16 kHz mono via ffmpeg
lib/client.js      browser: composer buttons, recording, settings page
test/              node --test units for the chain and the providers
```

使用 `npm test` 运行测试（无依赖项，Node 的内置运行器）。

## 要求

- DeepSeek Harness 带有 Web GUI
- 节点 20+
- ffmpeg，用于本地耳语提供商
- 可从浏览器访问的麦克风（HTTPS 或