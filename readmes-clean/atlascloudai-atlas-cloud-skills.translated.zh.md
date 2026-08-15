# Atlas云技能

> 🎬 **Seedance 2.0 现已上线 Atlas Cloud！** 字节跳动旗舰视频模型——原生音视频联合生成、最长 15 秒影院输出、最高 1440P、多模态参考（最多 9 个图像 + 3 个视频 + 3 个音频片段）、导演级摄像机控制。现已推出：[文本到视频](https://www.atlascloud.ai/models/bytedance/seedance-2.0/text-to-video?utm_source=github&utm_campaign=atlas-cloud-skills)·[图像到视频](https://www.atlascloud.ai/models/bytedance/seedance-2.0/image-to-video?utm_source=github&utm_campaign=atlas-cloud-skills)]·[参考视频](https://www.atlascloud.ai/models/bytedance/seedance-2.0/reference-to-video?utm_source=github&utm_campaign=atlas-cloud-skills)·[快速变体](https://www.atlascloud.ai/models/bytedance/seedance-2.0-fast/text-to-video?utm_source=github&utm_campaign=atlas-cloud-skills)，起价**$0.076/s**。
>
> 🔓 **需要全功能构建？** **无限制/全功能管道** — 更少的护栏、更广泛的主题范围、最大保真度输出 — 可通过 [Atlas Cloud Workflow](https://www.atlascloud.ai/console/workflow?utm_source=github&utm_campaign=atlas-cloud-skills).通过相同的 API 密钥将其直接连接到您的技能中。

在Claude Code、Codex、Gemini CLI和其他AI编码代理中使用Atlas Cloud](https://www.atlascloud.ai?utm_source=github&utm_campaign=atlas-cloud-skills)的300多个图像/视频/LLM模型。通过策划的技能生成图像、视频和聊天。

> **[→ 获取免费的 Atlas Cloud API 密钥](https://www.atlascloud.ai/console/api-keys?utm_source=github&utm_campaign=atlas-cloud-skills)** — 300 多种型号，一键，兼容 OpenAI。

## 支持的型号

- 🎬 **视频** (174) — Seedance 2.5 · MiniMax H3 · Youchuan V8.2 · Seedance 2.0 Mini · HappyHorse-1.1 · Gemini Omni Flash
- 🎨 **图像** (116) — Seedream v5.0 Pro · Qwen Image 3.0 · Reve 2.1 · Youchuan V8.2
- 🧊 **3D** (7) — Seed3D 2.0 · 浑源 3D Rapid · 浑源 3D Pro · Tripo H3.1
- 💬 **LLM** (64) — Grok 4.6 · DeepSeek V4 Flash 0731 · Qwen3.8 Max · Kimi K3
- 🔊 **音频（TTS·音乐·ASR）** (18) — Seed Audio 1.0·xAI TTS v1·ElevenLabs v3·Suno chirp-v4-5-all

- 📚 **探索更多** — [所有 395 名现场模特 »](https://www.atlascloud.ai/models?utm_source=github&utm_campaign=atlas-cloud-skills)

## 特色食谱

不要从空白提示开始——从工作流程开始。首先尝试三个：

- 🛍️ [**产品渲染 → 30 秒广告**](library/motion/product-render-to-ad.md) — 将产品静态图片变成简短的广告剪辑
- 🎭 [**角色表→多镜头AI戏剧**](library/motion/character-to-drama.md) — 一个角色，跨镜头一致
- 📱 [**长视频 → 垂直短视频**](library/social/long-to-vertical-short.md) — 为 TikTok/Reels/Shorts 重新构建 + 动画

**[浏览库中的所有 25 个食谱 »](library/README.md)** — 跨越🎨视觉·🎬运动·✂️编辑·📱社交。

## 可用技能

### 阿特拉斯云

快速将Atlas Cloud API集成到您的项目中。该技能提供：

- 完整的图像生成、视频生成、LLM聊天、媒体上传和快速生成的API参考
- 记录了所有 9 个 MCP 工具：`atlas_list_models`、`atlas_search_docs`、`atlas_get_model_info`、`atlas_generate_image`、`atlas_generate_video`、`atlas_quick_generate`、`atlas_chat`、`atlas_get_prediction`、`atlas_upload_media`
- Python、Node.js/TypeScript 和 cURL 中的即用型代码模板
- 带有定价信息的热门型号 ID
- LLM模型的OpenAI SDK兼容性指南
- 错误处理、重试策略和最佳实践

### Seedance-2-5-技能

用于可控 Seedance 视频的模型特定子技能，位于 `atlas-cloud` 之上。当工作需要拍摄计划而不是单个提示时使用它：

- **首先选择路径** — 文本到视频、故事板图像到视频、资产参考到视频、第一帧和最后一帧或扩展现有剪辑
- **参考规则** - 如何分配人物/产品/场景/风格/音频参考，以便在镜头中保持身份
- **拍摄工艺** — 相机、灯光和构图词汇、过渡模式、长视频连续性、真人处理
- **编辑和扩展** — 重写现有视频的一部分、更改灯光或风格、扩展短片
- **执行** — 通过 Atlas Cloud（MCP、CLI 或 REST）提交并在计费运行之前验证模型可用性
- 每个参考资料均以英文和简体中文提供；中文请求遵循专门的中文工作流程

当同一份简报需要在多个型号上运行时，可与 [`universal-video-prompt-skill`](#universal-video-prompt-skill) 配合使用。此模型的提示库：[awesome-seedance-2.5-prompts-skills](https://github.com/AtlasCloudAI/awesome-seedance-2.5-prompts-skills)

### 通用视频提示技能

`seedance-2-5-skill` 的型号不可知伴侣。它会编写一个提示**规范**（范围、锁定、暂存、最终状态），与表达它的方言分开，然后为您实际可以调用的任何视频模型编译该规范。在以下情况下使用它：

- 同一个简报必须在多个模型上运行，或者目标模型尚不可用，工作必须在其他地方进行
- 您正在构建模型比较矩阵，并且需要提示仅因方言而异
- 提示必须在模型交换后保留下来，而不是被重写

每个模型都带有测量的配置文件（参考语法、限制、时序遵守、默认偏差行为）；该技能会探测它不知道的内容，将规范降级为模型支持的内容，并报告每次降级。全文参考英文+简体中文。

## 安装

### 一行安装

```bash
npx skills add AtlasCloudAI/atlas-cloud-skills
```

### 外壳脚本

```bash
curl -fsSL https://raw.githubusercontent.com/AtlasCloudAI/atlas-cloud-skills/main/install.sh | sh
```

### 手册

将`atlas-cloud/`复制到`~/.claude/skills/atlas-cloud/`，并将`skills/`下的任何子技能复制到`~/.claude/skills/<name>/`。

### 仅安装一项技能

```bash
curl -fsSL https://raw.githubusercontent.com/AtlasCloudAI/atlas-cloud-skills/main/install.sh | sh -s atlas-cloud
curl -fsSL https://raw.githubusercontent.com/AtlasCloudAI/atlas-cloud-skills/main/install.sh | sh -s seedance-2-5-skill
curl -fsSL https://raw.githubusercontent.com/AtlasCloudAI/atlas-cloud-skills/main/install.sh | sh -s universal-video-prompt-skill
```

`seedance-2-5-skill` 引用了 `universal-video-prompt-skill`，因此如果您需要跨模型提示规范，请安装两者。

## 设置

1. 在【Atlas云控制台](https://www.atlascloud.ai/console/api-keys?utm_source=github&utm_campaign=atlas-cloud-skills)】获取API Key
2.设置环境变量：

```bash
export ATLASCLOUD_API_KEY="your-api-key-here"
```

有关可立即复制的模板，请参阅 [`.env.example`](.env.example)。

## 你可以做什么

### 能力·端点·示例模型
- **功能**：**图像生成** · **端点**：`POST /api/v1/model/generateImage` · **示例模型**：Nano Banana 2、Seedream v5.0、Z-Image
- **功能**：**视频生成** · **端点**：`POST /api/v1/model/generateVideo` · **示例模型**：Seedance 2.0、Kling v3.0、Vidu Q3
- **功能**：**音频 — TTS 和音乐** · **端点**：`POST /api/v1/model/generateAudio` · **示例模型**：Seed Audio 1.0、Suno Chirp v5、MiniMax Music
- **功能**：**语音转文本 (ASR)** · **端点**：`POST /api/v1/model/generateAudio` · **示例模型**：Seed ASR 2.0、xAI STT
- **功能**：**3D生成** · **端点**：`POST /api/v1/model/generateImage` · **示例模型**：Seed3D 2.0、Hunyuan 3D（图像/文本转3D）
- **功能**：**LLM 聊天** · **端点**：`POST /v1/chat/completions` · **示例模型**：Qwen3.5、Kimi K2.5、DeepSeek V3.2、GLM 5
- **功能**：**上传媒体** · **端点**：`POST /api/v1/model/uploadMedia` · **示例模型**：上传本地文件以获取公共 URL
- **功能**：**快速生成** · **端点**：自动模型搜索+提交 · **示例模型**：通过关键字一步生成
- **功能**：**搜索模型** · **端点**：按关键字模糊搜索 · **示例模型**：按名称、类型或提供商查找模型

## MCP 服务器

为了获得更原生的体验，请安装[Atlas Cloud MCP Server](https://www.npmjs.com/package/atlascloud-mcp)：

### CLI 工具（单行安装）

```bash
# Claude Code
claude mcp add atlascloud -- npx -y atlascloud-mcp

# Gemini CLI
gemini mcp add atlascloud -- npx -y atlascloud-mcp

# OpenAI Codex CLI
codex mcp add atlascloud -- npx -y atlascloud-mcp
```

### IDE 和编辑器（JSON 配置）

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

支持 Cursor、Windsurf、VS Code (Copilot)、Trae、Zed、JetBrains、Claude Desktop、ChatGPT Desktop、Amazon Q Developer、Cline、Roo Code、Continue 以及所有 MCP 兼容客户端。

## 更多 Atlas 云工具

- 🧰想用它