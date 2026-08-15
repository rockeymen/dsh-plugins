![Atlas Cloud](https://www.atlascloud.ai/logo.svg)

# Atlas Cloud MCP Server

  Use [Atlas Cloud](https://www.atlascloud.ai?utm_source=github&utm_campaign=mcp-server)'s 300+ image / video / LLM models in Claude Code, Codex, Gemini CLI, Cursor, Cline and more. Generate images, videos & chat via standard MCP tools.

## Supported Models

- 🎬 **Video** (186) — Seedance 2.5 · MiniMax H3 · Youchuan V8.2 · Wan 2.7 Spicy · Seedance 2.0 Mini · HappyHorse-1.1
- 🎨 **Image** (117) — Seedream v5.0 Pro · Qwen Image 3.0 · Reve 2.1 · Youchuan V8.2
- 🧊 **3D** (7) — Seed3D 2.0 · Hunyuan 3D Rapid · Hunyuan 3D Pro · Tripo H3.1
- 💬 **LLM** (63) — Grok 4.6 · DeepSeek V4 Flash 0731 · Qwen3.8 Max · Kimi K3
- 🔊 **Audio (TTS · Music · ASR)** (18) — Seed Audio 1.0 · xAI TTS v1 · ElevenLabs v3 · Suno chirp-v4-5-all

- 📚 **Explore more** — [all 408 live models »](https://www.atlascloud.ai/models?utm_source=github&utm_campaign=mcp-server)

## What You Can Do

Ask your AI assistant in plain language — it discovers the right model, builds the parameters, and submits the job:

- 🎨 **"Make a hero image for this blog post"** — text-to-image across Nano Banana Pro, GPT Image 2, Flux 2, Seedream, Imagen…
- 🎬 **"Turn this product photo into a 5-second ad"** — image-to-video with Kling 3, Seedance 2, Veo 3.1, Sora 2…
- 🧊 **"Make a 3D model from this photo"** — image-to-3D / text-to-3D with Hunyuan 3D (GLB/OBJ/USDZ output)
- 🔊 **"Read this script aloud"** — text-to-speech with Seed Audio, ElevenLabs, xAI TTS
- 🎵 **"Write a theme song for my app"** — music generation with Suno, MiniMax Music
- 📝 **"Transcribe this meeting recording"** — speech-to-text with Seed ASR, xAI STT
- 🎞️ **"Storyboard this script into 6 shots"** — chain LLM → image → video inside one conversation
- ✏️ **"Edit this image — add a hat"** — upload a local file, then run an image-editing model
- 💸 **"How much credit is left, and what did I spend this month?"** — check balance, usage, and cost breakdowns
- 💬 **"Summarize this PDF with DeepSeek"** — OpenAI-compatible LLM chat with Claude, GPT, DeepSeek, Qwen, GLM…

Under the hood: model discovery, dynamic per-model parameter schemas (validated before every request so invalid params fail fast without spending credits), media upload, one-step quick-generate, account balance & usage, and documentation search — all exposed as standard MCP tools (see [Available Tools](#available-tools)).

## Quick Start

### Prerequisites

- Node.js >= 18
- Atlas Cloud API Key — [Get one free at atlascloud.ai](https://www.atlascloud.ai/console/api-keys?utm_source=github&utm_campaign=mcp-server)

See [`.env.example`](./.env.example) for the environment variable to set.

### CLI agents (one-line install)

The fastest path — these AI coding agents add the server with a single command:

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

> Set the `ATLASCLOUD_API_KEY` environment variable in your shell first.

### IDEs, editors & extensions (JSON config)

Add this to your client's MCP configuration — works with every MCP-compatible client:

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

### Client · Where to add it
- **Client**: [Cursor](https://cursor.com) · **Where to add it**: Settings → MCP → Add Server
- **Client**: [Cline](https://github.com/cline/cline) · **Where to add it**: MCP Marketplace → Add Server
- **Client**: [Continue](https://continue.dev) · **Where to add it**: `config.yaml` → MCP
- **Client**: [Windsurf](https://codeium.com/windsurf) · **Where to add it**: Settings → MCP → Add Server
- **Client**: [VS Code (Copilot)](https://code.visualstudio.com) · **Where to add it**: `.vscode/mcp.json` or Settings → MCP
- **Client**: [Trae](https://trae.ai) · **Where to add it**: Settings → MCP → Add Server
- **Client**: [JetBrains IDEs](https://www.jetbrains.com) · **Where to add it**: Settings → Tools → AI Assistant → MCP
- **Client**: [ChatGPT Desktop](https://openai.com/chatgpt/desktop) · **Where to add it**: Settings → MCP
- **Client**: [Amazon Q Developer](https://aws.amazon.com/q/developer/) · **Where to add it**: MCP Configuration
- **Client**: [Roo Code](https://github.com/RooCodeInc/Roo-Code) · **Where to add it**: Settings → MCP → Add Server

### Prefer Skills?

If you'd rather use Skills than MCP, we also ship an [Atlas Cloud Skills](https://github.com/AtlasCloudAI/atlas-cloud-skills) package for Claude Code and other skill-compatible agents.

## Available Tools

### Tool · Description
- **Tool**: `atlas_search_docs` · **Description**: Search Atlas Cloud documentation and models by keyword
- **Tool**: `atlas_list_models` · **Description**: List all available models, optionally filtered by type (Text/Image/Video/Audio)
- **Tool**: `atlas_get_model_info` · **Description**: Get detailed model info including API schema, parameters, and usage examples
- **Tool**: `atlas_generate_image` · **Description**: Generate images and 3D models (image-to-3D / text-to-3D) with any supported Image model
- **Tool**: `atlas_generate_video` · **Description**: Generate videos with any supported video model
- **Tool**: `atlas_generate_audio` · **Description**: Generate audio — speech (TTS) and music/songs (Suno, MiniMax Music) — with any supported audio model
- **Tool**: `atlas_transcribe_audio` · **Description**: Transcribe speech to text (ASR) — meetings, interviews, voice notes
- **Tool**: `atlas_quick_generate` · **Description**: One-step image/video/audio generation — auto-finds model by keyword, builds params, and submits
- **Tool**: `atlas_upload_media` · **Description**: Upload local files to get a URL for use with image-edit / image-to-video models
- **Tool**: `atlas_chat` · **Description**: Chat with LLM models (OpenAI-compatible format)
- **Tool**: `atlas_get_prediction` · **Description**: Check status and result of image/video/audio/3D generation tasks
- **Tool**: `atlas_get_balance` · **Description**: Get the account balance and credit summary for your API key
- **Tool**: `atlas_get_model_usage` · **Description**: Get daily model usage (requests, tokens, image/video counts) over a date range
- **Tool**: `atlas_get_model_costs` · **Description**: Get daily model cost (spend) buckets over a date range

## Usage Examples

### Search for models

> "Search Atlas Cloud for video generation models"

Your AI assistant will use `atlas_search_docs` or `atlas_list_models` to find relevant models.

### Generate an image

> "Generate an image of a cat in space using Seedream"

The assistant will:
1. Use `atlas_list_models` to find Seedream image models
2. Use `atlas_get_model_info` to get the model's parameters
3. Use `atlas_generate_image` with the correct parameters

### Generate a video

> "Create a video of a rocket launch using Kling v3"

The assistant will:
1. Find the Kling video model
2. Get its schema to understand required parameters
3. Use `atlas_generate_video` with appropriate parameters

### Upload a local image for editing or video generation

> "Edit this image /Users/me/photos/cat.jpg to add a hat"

The assistant will:
1. Use `atlas_upload_media` to upload the local file and get a URL
2. Find an image-editing model
3. Use `atlas_generate_image` with the uploaded URL

> **Note**: Uploaded files are for temporary use with Atlas Cloud generation tasks only. Files may be cleaned up periodically. Do not use this as permanent file hosting — abuse may result in API key suspension.

### Generate speech (TTS)

> "Read this sentence aloud with Seed Audio: Welcome to Atlas Cloud"

The assistant will:
1. Use `atlas_list_models` with `type="Audio"` to find the TTS model
2. Use `atlas_generate_audio` with the text to synthesize
3. Use `atlas_get_prediction` to retrieve the generated audio URL

### Generate music

> "Make a 30-second upbeat synthwave track for my product demo with Suno"

Music models (Suno Chirp, MiniMax Music) are Audio-type models, so the assistant uses `atlas_generate_audio` with a song description (and optionally lyrics), then retrieves the audio URL via `atlas_get_prediction`.

### Transcribe audio (speech-to-text)

> "Transcribe this interview recording: https://example.com/interview.mp3"

The assistant uses `atlas_transcribe_audio` with a speech-to-text model (e.g., `bytedance/seed-asr-2.0`) and the `audio_url`, then retrieves the transcript via `atlas_get_prediction`. For local files, it first calls `atlas_upload_media` to get a URL.

### Generate a 3D model

> "Turn this product photo into a 3D model with Hunyuan 3D"

3D models are Image-type models, so the assistant uses `atlas_generate_image` with the `image` parameter and retrieves a GLB/OBJ/USDZ file via `atlas_get_prediction`.

### Chat with an LLM

> "Ask Qwen to explain quantum computing"

The assistant will use `atlas_chat` with the Qwen model.

### Check balance and usage

> "How much Atlas Cloud credit do I have left, and what did I spend this month?"

The assistant will use `atlas_get_balance` for the current balance and `atlas_get_model_costs` for the spend breakdown.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev
```

## More Atlas Cloud Tools

- 🧰 **Want to use it from the terminal?** → [atlascloud-cli](https://github.com/AtlasCloudAI/cli)
- 🤖 **Want to use it in Claude Code / Cursor?** → [Atlas Cloud MCP Server](https://github.com/AtlasCloudAI/mcp-server)
- 🎬 **Want it as a Claude Code / Codex / Gemini CLI Skill?** → [atlas-cloud-skills](https://github.com/AtlasCloudAI/atlas-cloud-skills)
- 🎨 **ComfyUI nodes** → [atlascloud_comfyui](https://github.com/AtlasCloudAI/atlascloud_comfyui)
- 🔁 **n8n nodes** → [n8n-nodes-atlascloud](https://github.com/AtlasCloudAI/n8n-nodes-atlascloud)
- 💬 **Join our Discord** → [discord.gg/MWmMr4q9es](https://discord.gg/MWmMr4q9es)
- 🌐 **Website** → [atlascloud.ai](https://www.atlascloud.ai?utm_source=github&utm_campaign=mcp-server)