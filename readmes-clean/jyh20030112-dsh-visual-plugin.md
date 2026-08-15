# dsh-visual-plugin

  ![DeepSeek neon pixel whale](https://raw.githubusercontent.com/jyh20030112/dsh-visual-plugin/main/assets/deepseek_neon_pixel_whale_transparent.svg)

  

  Give your text-only model eyes: forward user images to any OpenAI-compatible
  vision model and see the results in a Web UI right panel.

A plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

## Features

- **Automatic description** — the wrapper adapter recursively describes uploaded images and image-bearing tool results in a model-bound copy while the visible chat keeps the originals.
- **In-conversation lifecycle cards** — automatic analysis appears immediately below its source image and settles in place as success or failure; one logical analysis produces one card.
- **Intent-aware prompts** — send an image *with a question* and the description is generated from your own words.
- **`vision_describe` tool** — the model can answer a later follow-up question when the automatic description lacks the requested detail.
- **Right-side panel** — configure endpoint / model / key, test the connection, watch one latest description per image with thumbnails (2s auto-refresh), read remaining balance.
- **Secrets stay secret** — the API key lives in the harness credentials seam (write-only, never echoed).

## How it works

  ![Animated demo of the vision bridge in dsh web: the user sends an image, the vision bridge auto-describes it, and the main model answers from the description](https://raw.githubusercontent.com/jyh20030112/dsh-visual-plugin/main/assets/vision-bridge-flow.svg)

```
image in composer or tool result → wrapper finds it at any content depth → visible message keeps the image
  → adapter stream → readImage → vision API → "[视觉描述] …" in the private model request only
  → text-only model answers → /vision-bridge/recent → panel thumbnail + description (2s poll)
```

Unconfigured or failed calls degrade to a `[视觉描述失败] <reason>` placeholder, so the conversation never breaks.

## Quick start

```sh
dsh plugin --profile web add dsh-visual-plugin   # or: github:jyh20030112/dsh-visual-plugin
```

Restart `dsh web`, then:

1. Open the panel from the sidebar footer (**视觉桥接 / Vision Bridge**).
2. Configure the endpoint URL, a vision model name, and the API key; click **保存配置** → **测试连接**.
3. In the model picker, select provider **DeepSeek (Vision)** — the plugin's wrapper adapter declares image input so the gateway admits uploads.
4. Send an image (optionally with a question). The model answers from the generated description and the panel shows the thumbnail + description within ~2s.

### Reference local model

This project is developed and tested with a locally deployed
[Empero AI Qwythos-9B](https://huggingface.co/empero-ai/Qwythos-9B-Claude-Mythos-5-1M)
as the vision backend. Its SGLang deployment can expose an OpenAI-compatible
`/v1` endpoint; enter the endpoint URL and the server's registered model name
(for example, `Qwythos`) in the Vision Bridge panel. The plugin is not tied to
Qwythos-9B and can use any compatible vision model.

## Uninstall

```sh
dsh plugin --profile web remove dsh-visual-plugin
```

Restart `dsh web`. The command forwards to `pnpm remove` inside the profile, and the bundle layer list reconciles to drop the plugin automatically.

## Project layout

```
src/
  index.ts      host plugin: vision orchestration + vision_describe + HTTP routes
  vision.ts     OpenAI-compatible vision calls (describe / test / balance)
  model-messages.ts  model-bound image rewrite + per-attachment cache
  description-policy.ts  intent-first prompt + low-information retry
  config.ts     settings namespace `vision-bridge` + schema
  adapter.ts    deepseek-vision wrapper adapter (admission + private rewrite boundary)
  client/       browser half: panel / sidebar toggle / automatic + tool cards / locales / css
cordis.patch.yml  bundle patch layer
```

## Build

```sh
npm run bootstrap && npm run typecheck && npm run build   # needs a local harness checkout
```

Prebuilt `lib/` is committed, so consumers never build.

## CI/CD

`ci.yml` verifies artifacts and the pack contents on every push/PR. `release.yml` (tag `v*`) checks the version, packs, creates a GitHub Release, and publishes to npm.

## Resources

- [Qwythos-9B on Hugging Face](https://huggingface.co/empero-ai/Qwythos-9B-Claude-Mythos-5-1M) · [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)