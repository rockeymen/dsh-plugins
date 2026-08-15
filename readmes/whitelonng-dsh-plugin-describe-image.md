# dsh-plugin-describe-image

English | [中文](README.zh.md)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin: the model-facing `describe_image` tool, which gives a **text-only model** (DeepSeek V4 and friends) image understanding.

The tool loads one image — a local file path, an http(s) URL, or a durable attachment reference — and asks a vision-language model at an **OpenAI-compatible endpoint** (Qwen-VL, GLM-4V, GPT-4o, a local Ollama endpoint…) to describe it. Only the returned **text** crosses into the conversation; the image itself never enters the session log.

## Features

- **Three input forms**: local path, http(s) URL, or the JSON of an `[image attachment …]` note (resolved through the harness attachment service — copy the note verbatim into `image`).
- **Live configuration card**: the Web GUI's Settings → Plugins → "Image understanding" card edits `baseURL`, `model`, and the API key (via the credential seam) with immediate effect — no restart.
- **Per-call API key resolution**: inline `apiKey` → credential seam (`apiKeyEnv`, default `VISION_API_KEY`) → launch environment.
- **Security and bounds**: redirects refused on every request, `maxBytes` / `maxOutputTokens` / `timeoutMs` bounds, magic-byte media-type gate, bounded error excerpts, secrets never logged.
- **Companion harness changes** (shipped in the harness repo, not this subtree): the DeepSeek text-only route flattens image blocks into the copyable `[image attachment …]` notes, and the host accepts image prompts on text-only routes — together they close the "send an image to a text-only model" loop.

## Quick start (in a DeepSeek Harness checkout)

```yaml
# cordis.yml
- id: describe-image
  name: '@deepseek-ai/dsh-tool-describe-image'
  config:
    baseURL: https://dashscope.aliyuncs.com/compatible-mode/v1
    model: qwen-vl-max
    apiKey: !!js process.env.VISION_API_KEY
```

## Repository layout

```
packages/vision/
├── README.md                  # vision capability family
└── tool-describe-image/       # the plugin package (source + tests + docs)
```

This repository holds the plugin subtree **as it lives inside** `deepseek-harness`: package dependencies stay `workspace:^`, and building, type-checking, and testing happen inside a harness checkout (see [INTEGRATION.md](INTEGRATION.md)). The harness tree is the build environment, not this repo. Keep the two in sync with:

```sh
git subtree push --prefix packages/vision dsh-describe-image main   # from the harness checkout
```

## Acknowledgments

- [LINUX DO](https://linux.do) — This project is continuously shared and discussed in the LINUX DO community.

## License

[MIT](LICENSE)
