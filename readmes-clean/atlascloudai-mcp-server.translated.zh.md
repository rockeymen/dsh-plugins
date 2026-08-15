![阿特拉斯云](https://www.atlascloud.ai/logo.svg)

# 阿特拉斯云 MCP 服务器

  在Claude Code、Codex、Gemini CLI、Cursor、Cline等中使用[Atlas Cloud](https://www.atlascloud.ai?utm_source=github&utm_campaign=mcp-server)的300+图像/视频/LLM模型。通过标准 MCP 工具生成图像、视频和聊天。

## 支持的型号

- 🎬 **视频** (175) — Seedance 2.5 · MiniMax H3 · Youchuan V8.2 · Seedance 2.0 Mini · HappyHorse-1.1 · Gemini Omni Flash
- 🎨 **图像** (117) — Seedream v5.0 Pro · Qwen Image 3.0 · Reve 2.1 · Youchuan V8.2
- 🧊 **3D** (7) — Seed3D 2.0 · 浑源 3D Rapid · 浑源 3D Pro · Tripo H3.1
- 💬 **LLM** (64) — Grok 4.6 · DeepSeek V4 Flash 0731 · Qwen3.8 Max · Kimi K3
- 🔊 **音频（TTS·音乐·ASR）** (18) — Seed Audio 1.0·xAI TTS v1·ElevenLabs v3·Suno chirp-v4-5-all

- 📚 **探索更多** — [所有 397 个现场模特 »](https://www.atlascloud.ai/models?utm_source=github&utm_campaign=mcp-server)

## 你可以做什么

用简单的语言询问你的人工智能助手——它会发现正确的模型，构建参数，并提交作业：

- 🎨 **“为这篇博文制作一张英雄图片”** — Nano Banana Pro、GPT Image 2、Flux 2、Seedream、Imagen 之间的文本到图像转换...
- 🎬 **“将此产品照片变成 5 秒广告”** — 使用 Kling 3、Seedance 2、Veo 3.1、Sora 2 进行图像到视频转换...
- 🧊 **“根据这张照片制作 3D 模型”** — 使用 Hunyuan 3D 进行图像转 3D / 文本转 3D（GLB/OBJ/USDZ 输出）
- 🔊 **“大声朗读此脚本”** — 使用 Seed Audio、ElevenLabs、xAI TTS 进行文本转语音
- 🎵 **“为我的应用程序写一首主题曲”** — 使用 Suno、MiniMax Music 生成音乐
- 📝 **“转录此会议录音”** — 使用 Seed ASR、xAI STT 进行语音转文本
- 🎞️ **“将这个脚本分成 6 个镜头”** — 链式 LLM → 图像 → 一次对话中的视频
- ✏️ **“编辑此图像 - 添加帽子”** - 上传本地文件，然后运行图像编辑模型
- 💸 **“还剩多少信用额，这个月我花了什么？”** — 检查余额、使用情况和成本明细
- 💬 **“使用 DeepSeek 总结此 PDF”** — 与 Claude、GPT、DeepSeek、Qwen、GLM 进行 OpenAI 兼容的 LLM 聊天...

在底层：模型发现、动态每个模型参数模式（在每个请求之前进行验证，因此无效参数会快速失败而无需花费积分）、媒体上传、一步式快速生成、帐户余额和使用以及文档搜索 - 所有这些都作为标准 MCP 工具公开（请参阅[可用工具](#available-tools)]）。

## 快速入门

### 先决条件

- Node.js >= 18
- Atlas Cloud API 密钥 — [在 atlascloud.ai](https://www.atlascloud.ai/console/api-keys?utm_source=github&utm_campaign=mcp-server) 免费获取一个

要设置的环境变量请参见[`.env.example`](./.env.example)]。

### CLI 代理（单行安装）

最快的路径 - 这些 AI 编码代理使用单个命令添加服务器：

```bash
# Claude Code
claude mcp add atlascloud -- npx -y atlascloud-mcp

# OpenAI Codex CLI
codex mcp add atlascloud -- npx -y atlascloud-mcp

# Gemini CLI
gemini mcp add atlascloud -- npx -y atlascloud-mcp

# Goose CLI
goose mcp add atlascloud -- npx -y atlascloud-mcp
```

> 首先在 shell 中设置 `ATLASCLOUD_API_KEY` 环境变量。

### IDE、编辑器和扩展（JSON 配置）

将其添加到您客户端的 MCP 配置中 — 适用于每个 MCP 兼容客户端：

```json
{
  "mcpServers": {
    "atlascloud": {
      "command": "npx",
      "args": ["-y", "atlascloud-mcp"],
      "env": {
        "ATLASCLOUD_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 客户端 · 添加到哪里
- **客户端**：[光标](https://cursor.com) · **添加位置**：设置 → MCP → 添加服务器
- **客户端**：[Cline](https://github.com/cline/cline) · **添加位置**：MCP 市场 → 添加服务器
- **客户端**：[继续](https://continue.dev) · **在哪里添加**：`config.yaml` → MCP
- **客户端**：[Windsurf](https://codeium.com/windsurf) · **添加位置**：设置 → MCP → 添加服务器
- **客户端**：[VS Code（副驾驶）](https://code.visualstudio.com) · **添加位置**：`.vscode/mcp.json` 或设置 → MCP
- **客户端**：[Trae](https://trae.ai) · **在哪里添加**：设置 → MCP → 添加服务器
- **客户端**：[JetBrains IDEs](https://www.jetbrains.com) · **添加位置**：设置 → 工具 → AI 助手 → MCP
- **客户端**：[ChatGPT Desktop](https://openai.com/chatgpt/desktop) · **在哪里添加**：设置 → MCP
- **客户端**：[Amazon Q Developer](https://aws.amazon.com/q/developer/) · **添加位置**：MCP 配置
- **客户端**：[Roo Code](https://github.com/RooCodeInc/Roo-Code) · **在哪里添加**：设置 → MCP → 添加服务器

### 更喜欢技能？

如果您更愿意使用技能而不是 MCP，我们还为 Claude Code 和其他技能兼容的代理提供 [Atlas Cloud Skills](https://github.com/AtlasCloudAI/atlas-cloud-skills) 包。

## 可用工具

### 工具·说明
- **工具**：`atlas_search_docs` · **描述**：通过关键字搜索Atlas Cloud文档和模型
- **工具**：`atlas_list_models` · **描述**：列出所有可用型号，可选择按类型过滤（文本/图像/视频/音频）
- **工具**：`atlas_get_model_info` · **描述**：获取详细的模型信息，包括 API 架构、参数和使用示例
- **工具**：`atlas_generate_image` · **描述**：使用任何支持的图像模型生成图像和 3D 模型（图像到 3D / 文本到 3D）
- **工具**：`atlas_generate_video` · **描述**：使用任何支持的视频模型生成视频
- **工具**：`atlas_generate_audio` · **描述**：使用任何支持的音频模型生成音频 — 语音 (TTS) 和音乐/歌曲（Suno、MiniMax Music）
- **工具**：`atlas_transcribe_audio` · **描述**：将语音转录为文本 (ASR) — 会议、采访、语音笔记
- **工具**：`atlas_quick_generate` · **描述**：一步生成图像/视频/音频——通过关键字自动查找模型，构建参数并提交
- **工具**：`atlas_upload_media` · **描述**：上传本地文件以获取用于图像编辑/图像到视频模型的 URL
- **工具**：`atlas_chat` · **描述**：与LLM模型聊天（OpenAI兼容格式）
- **工具**：`atlas_get_prediction` · **描述**：检查图像/视频/音频/3D生成任务的状态和结果
- **工具**：`atlas_get_balance` · **描述**：获取您的API密钥的账户余额和信用摘要
- **工具**：`atlas_get_model_usage` · **描述**：获取某个日期范围内的每日模型使用情况（请求、令牌、图像/视频计数）
- **工具**：`atlas_get_model_costs` · **描述**：获取某个日期范围内的每日模型成本（支出）桶

## 用法示例

### 搜索型号

>“在Atlas Cloud中搜索视频生成模型”

您的AI助手将使用`atlas_search_docs`或`atlas_list_models`来查找相关型号。

### 生成图像

>“使用 Seedream 生成太空猫的图像”

助理将：
1.使用`atlas_list_models`查找Seedream图像模型
2.使用`atlas_get_model_info`获取模型参数
3、正确参数使用`atlas_generate_image`

### 生成视频

>“使用 Kling v3 创建火箭发射视频”

助理将：
1.找到Kling视频型号
2. 获取其架构以了解所需参数
3.使用`atlas_generate_video`并配合适当的参数

### 上传本地图片进行编辑或视频生成

>“编辑此图片 /Users/me/photos/cat.jpg 以添加帽子”

助理将：
1.使用`atlas_upload_media`上传本地文件并获取URL
2. 寻找图像编辑模型
3.使用`atlas_generate_image`和上传的URL

> **注意**：上传的文件仅供 Atlas Cloud 生成任务临时使用。文件可以定期清理。请勿将其用作永久文件托管 - 滥用可能会导致 API 密钥暂停。

### 生成语音 (TTS)

>“用种子音频大声朗读这句话：欢迎来到 Atlas Cloud”

助理将：
1.使用`atlas_list_models`和`type="Audio"`查找TTS模型
2.使用`atlas_generate_audio`与文字合成
3.使用`atlas_get_prediction`检索生成的音频URL

### 生成音乐

>“使用 Suno 为我的产品演示制作 30 秒欢快的合成波曲目”

音乐模型（Suno Chirp、MiniMax Music）是音频类型模型，因此助手使用带有歌曲描述（以及可选歌词）的 `atlas_generate_audio`，然后通过 `atlas_get_prediction` 检索音频 URL。

### 转录音频（语音到文本）

>》抄录本次采访录音：https://example.com/interview.mp3"

助手将 `atlas_transcribe_audio` 与语音转文本模型（例如 `bytedance/seed-asr-2.0`）和 `audio_url` 结合使用，然后通过 `atlas_get_prediction` 检索文字记录。对于本地文件，它首先调用`atlas_upload_media`来获取URL。

### 生成 3D 模型

> “用浑源3D把这张产品照片变成3D模型”

3D模型是图像类型模型，因此助手使用带有`image`参数的`atlas_generate_image`，并通过`atla检索GLB/OBJ/USDZ文件