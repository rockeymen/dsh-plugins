# dsh-plugin-lmstudio

Use a model served by [LM Studio](https://lmstudio.ai) as a chat model inside the
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) web GUI.

LM Studio exposes an OpenAI-compatible endpoint (`http://127.0.0.1:1234/v1` by
default). This plugin seeds DSH's built-in `llm-pi-ai` adapter with that route,
so the model picker shows your local model — no cloud API quota consumed.

[中文说明](README.zh.md) · MIT

## Requirements

- DSH CLI + pnpm (see the DSH docs)
- LM Studio with **Developer → Start Server** running (default port `1234`)
- At least one model loaded in LM Studio

## Install

```sh
dsh plugin --profile web add dsh-plugin-lmstudio
```

The package declares `dsh.bundle`, so `dsh plugin` automatically adds it to the
profile's bundle layers. Then restart the web app (`dsh web`) and refresh
http://127.0.0.1:3080.

## Configuration

The plugin ships a default provider route under the `lm-studio` provider key:

| Field | Default | Meaning |
|---|---|---|
| `baseURL` | `http://127.0.0.1:1234/v1` | LM Studio OpenAI-compatible endpoint |
| `api` | `openai-completions` | Wire protocol |
| `models` | one example model | Replace with what you actually load |

The bundled route is a **base layer**: anything you write under the
`llm-pi-ai:` section of `$DSH_HOME/settings.yaml` merges over it per provider,
so your own models and endpoints win. No API key is required for a local LM
Studio server; if you enable key auth in LM Studio, add `apiKeyEnv` or an
`Authorization` header in your settings layer.

### Point it at your actual model

1. In LM Studio, load the model you want.
2. Find the exact model id: `curl http://127.0.0.1:1234/v1/models` and read the
   `id` field (usually `owner/name`, e.g. `qwen/qwen3.5-9b`).
3. Either edit the route in **Settings → Models** (the "ask the endpoint"
   button discovers models for you), or override it in `$DSH_HOME/settings.yaml`:

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

`settings.yaml` hot-reloads — no `dsh web` restart needed.

## Usage

Refresh the page, open the model picker above the composer, and choose your
LM Studio model (it appears under "LM Studio (本地)"). Traffic goes to
`127.0.0.1:1234` only; your DeepSeek API balance is untouched.

> Tip: for plain conversation without any agent tools, create a "chat" agent
> preset (an empty `agent.cordis.yml`) and pick it on the new-session screen —
> that applies to every model, local or cloud.

## License

MIT
