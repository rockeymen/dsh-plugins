# dsh-llm-qwen-local

DeepSeek Harness LLM adapter plugin for a **locally deployed Qwen model** (e.g. Qwen3.8) served by **vLLM** behind its OpenAI-compatible `/v1/chat/completions` endpoint.

Two deployment-specific knobs are first-class:

- **Per-model multimodal switch** (`multimodal: true/false`) — declares whether the deployment serves the model with vision.
- **Fully configurable reasoning efforts** — every selectable level, its display name, its `reasoning_effort` wire spelling, the default level, and how `off` is expressed on the wire all come from configuration, matching whatever vocabulary your vLLM build accepts.

Plus, since the 0.1.1-rc.2 harness upgrade:

- **One-generation call binding** — the adapter overrides `LlmAdapter.prepareCall` to snapshot connection facts (endpoint, catalog, budgets) once and bind both model metadata and the eventual dispatch to that snapshot, so a settings commit between preparation and dispatch can never combine two configuration generations.
- **Request-image pipeline** — image bytes go through the durable attachment service's `readImageRequest` projection (deterministic pixel/byte budgets, cached variants) when the mounted provider implements it, falling back to the normalized master bytes otherwise.

```yaml
- id: llm-qwen-local
  name: dsh-llm-qwen-local
  config:
    baseURL: http://127.0.0.1:8000/v1
    models:
      - id: qwen3.8
        name: Qwen3.8 (local)
        multimodal: true
        reasoning:
          efforts:
            - { id: off, wire: none }
            - { id: low, wire: low }
            - { id: medium, wire: medium }
            - { id: xhigh, wire: xhigh }
          defaultEffort: xhigh
```

## Requirements

- An installed `dsh` (the CLI) **0.1.1-rc.2 or newer** (the adapter uses the
  `LlmAdapter.prepareCall` seam and the harness-side text-only image
  projection introduced there), and a vLLM instance serving your Qwen model
  with the OpenAI-compatible API.
- Node.js with global `fetch` (18+).
- A profile whose composition mounts `@deepseek-ai/dsh-attachment` — the
  standard `web` and `headless` profiles do, via `dsh-base`. The adapter
  resolves the attachment service lazily at request time (a text-only
  deployment never touches it), but the module import itself is resolved at
  plugin load, so a composition without the package fails to load.

## Install

```sh
# install from git (the prepare script builds lib/ on install):
dsh plugin --profile web add github:starefinger/dsh-llm-qwen-local

# or from a local checkout (same prepare build runs on install):
dsh plugin --profile web add ./path/to/qwen3.8-LLM-plugin

# or from a packed tarball (prebuilt — no build step on install):
dsh plugin --profile web add ./dsh-llm-qwen-local-0.3.0.tgz

# verify the contributed layer, then start:
dsh --profile web --dump-config
dsh --profile web
```

### Version-pinned install (tag)

Each compatibility snapshot is tagged with the dsh version it targets (`dsh-<dsh-version>`). To install a specific snapshot, append `#<tag>` to the git URL — pnpm resolves the tag to the exact commit, so the install is reproducible and independent of `main`'s current state:

```sh
# install the snapshot pinned to dsh 0.1.1-rc.2:
dsh plugin --profile web add "git+https://github.com/starefinger/dsh-llm-qwen-local.git#dsh-0.1.1-rc.2"
```

Pick the tag matching your dsh version (`dsh --version`). After upgrading dsh, remove and re-add with the tag for the new version:

```sh
dsh plugin --profile web remove dsh-llm-qwen-local
dsh plugin --profile web add "git+https://github.com/starefinger/dsh-llm-qwen-local.git#dsh-<new-dsh-version>"
```

Tags are immutable snapshots: a fix for an already-published tag ships as a new tag, never by moving an existing one.

Git and local-path installs run the package's `prepare` script (→ `pnpm build`) to produce `lib/` during install. pnpm v10 blocks dependency build scripts until they are allowed: if the first install fails with a "blocked build scripts" notice, add the exact key pnpm printed under `allowBuilds` in the profile's `pnpm-workspace.yaml`, then re-run the same `dsh plugin add` command. The tarball install is prebuilt and never needs this.

The bundle's `cordis.patch.yml` inserts a baseline `llm-qwen-local` line (model `qwen3.8`, `multimodal: true`, `off/low/medium/xhigh` efforts, default `xhigh`). Select the model in the Web UI's model selector once installed; the adapter advertises it through `listModels()`.

To change anything, override the line from your profile's `cordis.patch.yml` by `id: llm-qwen-local` — a patch replaces the target line's **entire** `config` (no deep merge), so restate every key you keep.

## Configuration reference

All fields except `models` are optional in `cordis.yml`; schema defaults fill the rest.

### Field · Default · Meaning
- **Field**: `baseURL` · **Default**: `http://127.0.0.1:8000/v1` · **Meaning**: Endpoint base; `/chat/completions` is appended.
- **Field**: `apiKeyEnv` · **Default**: — (no auth header) · **Meaning**: Environment-variable name holding an optional bearer token, read per request. Absent/unset/blank = no `Authorization` header.
- **Field**: `models` · **Default**: **required** · **Meaning**: At least one model entry.
- **Field**: `defaultContextWindow` · **Default**: `262144` · **Meaning**: Context capacity used when a model has no exact value.
- **Field**: `maxTokens` · **Default**: `32768` · **Meaning**: Per-request output cap fallback; explicit request values and a model's own cap win.
- **Field**: `streamIdleTimeoutMs` · **Default**: `300000` · **Meaning**: Maximum provider idle time while one stream read is outstanding.
- **Field**: `maxRequestImageBytes` · **Default**: — (keep every image) · **Meaning**: Total inlined base64 image payload bound per request; when exceeded, the **oldest** images are replaced with a deterministic text placeholder before serialization (the harness `offloadRequestImages` policy), so a history-heavy vision request still fits the endpoint's input cap.

### Model entries

### Field · Default · Meaning
- **Field**: `id` · **Default**: **required** · **Meaning**: Wire model id vLLM accepts.
- **Field**: `name` · **Default**: `id` · **Meaning**: Selector label.
- **Field**: `description` · **Default**: — · **Meaning**: Selector detail for similar variants.
- **Field**: `contextWindow` · **Default**: route default · **Meaning**: This model's combined request/response capacity.
- **Field**: `maxTokens` · **Default**: route default · **Meaning**: This model's per-request output cap.
- **Field**: `multimodal` · **Default**: `false` · **Meaning**: The vision switch (below). Qwen3.8-27B is a native vision-language model — set `true` for it.
- **Field**: `preserveThinking` · **Default**: `true` · **Meaning**: Whether the deployment keeps historical thinking blocks (Qwen3.8's `preserve_thinking`, template default on). `false` sends `chat_template_kwargs: { preserve_thinking: false }` and the adapter stops replaying assistant reasoning into history.
- **Field**: `imageMaxPixels` · **Default**: `640000` · **Meaning**: Request-image pixel budget (width × height) after aspect-preserving projection — the harness canonical default shared with the official adapters. Raise it for detail-critical vision work; blank = default.
- **Field**: `imageMaxBytes` · **Default**: `1048576` · **Meaning**: Per-request-image encoded-byte cap before base64 inlining.
- **Field**: `reasoning` · **Default**: — · **Meaning**: Reasoning capability; absent = the model exposes no selectable efforts.

### The multimodal switch

`multimodal` is a **claim about your endpoint, not a check of it** — nothing interrogates vLLM for what it accepts. Since the 0.1.1-rc.2 harness upgrade, the harness LLM runtime itself handles the under-claim case:

- `false` (default): the model is advertised text-only (`inputModalities: ['text']`). The harness runtime now **projects** images into a deterministic text placeholder (`[image omitted because this model accepts text only; attachment sha256:…]`) **before the adapter sees them** — the request proceeds text-only instead of being refused. The adapter keeps its own `UNSUPPORTED_CONTENT` gate at serialization time for direct (non-runtime) use and for history assembled outside the runtime projection.
- `true`: the model is advertised with `['text', 'image']`. Image bytes are resolved through the durable attachment service (`ctx.attachments`); a composition without that service refuses any image with `UNSUPPORTED_CONTENT` instead of guessing a source.

The two wrong answers do not cost the same: **over-claiming** admits an image the provider then rejects **mid-turn**, after the message is durable in the session log — that session will keep re-sending the failing image. Recovery is a new session, a fork before the image, or a different model; rolling an unconsumed image message back out of a failed send is deferred. **Under-claiming** no longer fails loud: the image silently becomes the placeholder above — the model still answers, but cannot see the image (recovery: flip the switch, then re-ask). The direct-adapter gate (`UNSUPPORTED_CONTENT`, naming the model) still fires for callers that bypass the runtime projection.

Image bytes are inlined as `image_url` parts with `data:<mediaType>;base64,…` values, projected through the attachment service's request-image pipeline when available (`readImageRequest`; the harness canonical policy: up to `imageMaxPixels` pixels, `imageMaxBytes` encoded bytes, cached per variant) with a fallback to the normalized master bytes (`readImage`) for providers that refuse projection with `ATTACHMENT_PROJECTION_UNSUPPORTED`.

### Reasoning efforts

```yaml
reasoning:
  efforts:
    - { id: off, wire: none }      # vLLM's canonical no-thinking spelling
    - { id: low, wire: low }       # any wire spelling your vLLM accepts
    - { id: high, wire: high }
  defaultEffort: high              # optional; absent = vLLM's own default
  offMode: chat-template-kwargs    # optional; 'chat-template-kwargs' | 'omit'
```

- **Qwen3.8-27B's official levels**: `xhigh` (the model's default), `medium`, `low` — the bundle baseline declares exactly these plus `off`. vLLM's accepted `reasoning_effort` vocabulary is `none` / `minimal` / `low` / `medium` / `high` / `xhigh`; `off` as a wire value is a 400, so `off` maps to `wire: none` (verified against a live Qwen3.8 vLLM build). Thinking is ON by default, so omitting the parameter entirely (no `defaultEffort`, or `offMode: omit` without an effort) keeps the deployment's thinking default.
- `efforts` (required, display order) — the authoritative selectable list. Each `id` is an opaque value the harness carries per request; `name` (default `id`) is what selectors show. A level not declared is not offered. `id` is unique per model. The `off` level is **optional**: it is the adapter's own "no thinking" selector. Omit it for a deployment with no way to disable thinking — then effort selection can never turn thinking off, and `session-title` calls keep the ordinary default instead of forcing `off`.
- `wire` — the exact spelling sent as `reasoning_effort`. `off` uses `none` by convention and is the only level allowed `null` (send nothing — the pre-parameter escape hatch; the offMode kwargs still carry the expression); every other level must name a non-empty wire value. Rename freely (`{ id: max, wire: high }`) — the harness never sees wire spellings.
- `defaultEffort` — materialized into requests when the caller omits an effort. Absent preserves vLLM's own default.
- `offMode` — the template-side expression of `off`, sent alongside its wire value:
  - `chat-template-kwargs` (default): also sends `chat_template_kwargs: { enable_thinking: false }` — the model's documented non-thinking mode (thinking is ON by default, so the effort value alone leaves the template's gate open; the kwarg closes it).
  - `omit`: sends nothing extra — use for deployments where `none` alone already means no thinking.
- Per-request selection takes precedence over `defaultEffort`. A request naming a level the model does not declare fails with `UNSUPPORTED_REASONING_EFFORT` before any network I/O — never clamped.
- `session-title` auxiliary calls are forced to `off`: a short title never needs thinking.

## Wire dialect (vLLM + Qwen3.8)

Request: `model`, `messages` (system first; multimodal user messages as `content` part arrays of `text` / `image_url` data-URL parts; tool results as `role: 'tool'`), `tools`, `stream: true`, `stream_options: { include_usage: true }`, plus `reasoning_effort` and `chat_template_kwargs` when they deviate from template defaults, `temperature`, `max_tokens`, `stop` when set.

Response: SSE `data:` payloads, `data: [DONE]` sentinel. `delta.reasoning_content` (and the `delta.reasoning` spelling some frameworks emit) → harness `reasoning` blocks (Qwen thinking channel); `delta.content` → `text` blocks; `delta.tool_calls` → `tool-call` blocks with raw-JSON `argumentsDelta`. `finish_reason`: `stop`/`content_filter` → `stop`, `length` → `max-tokens`, `tool_calls` → `tool-calls`, anything else → an `error` finish. Usage arrives attached to the finish chunk and/or as a trailing usage-only chunk; both are buffered and flushed after all `block-end`s and before `finish` (nothing is emitted after `finish`).

History replay: with `preserve_thinking` at its template default (ON), assistant reasoning is replayed as `reasoning_content` on tool-call-free turns — the exact reconstruction the official Qwen3.8 example performs; tool-call turns and `preserveThinking: false` models send no reasoning. Tool calls replay as `tool_calls` with `content: ""` (never `null`).

## Model parameters (Qwen3.8-27B, verified against the model card)

### Fact · Value · Where it lands in this plugin
- **Fact**: Architecture · **Value**: `Qwen3_5ForConditionalGeneration` — **native vision-language model** (image + video) · **Where it lands in this plugin**: baseline `multimodal: true`
- **Fact**: Context length · **Value**: **262,144 native**, extensible to ~1M via YaRN / `--max-model-len` · **Where it lands in this plugin**: `DEFAULT_CONTEXT_WINDOW = 262144`; raise `contextWindow` per model when your vLLM runs 1M
- **Fact**: Thinking default · **Value**: **ON**; disable per request with `chat_template_kwargs: { enable_thinking: false }` · **Where it lands in this plugin**: `off` level (wire `none`) + `offMode: chat-template-kwargs` (default)
- **Fact**: `reasoning_effort` levels · **Value**: **`xhigh` (default), `medium`, `low`** (vLLM accepts `none` / `minimal` / `low` / `medium` / `high` / `xhigh`; `off` is a 400) · **Where it lands in this plugin**: baseline `efforts` (`off` → `wire: none`) + `defaultEffort: xhigh`
- **Fact**: `preserve_thinking` · **Value**: **ON by default**; retains historical thinking blocks · **Where it lands in this plugin**: reasoning replay as `reasoning_content`; `preserveThinking: false` sends the kwarg
- **Fact**: Recommended sampling · **Value**: thinking: `temperature=1.0, top_p=0.95, top_k=20`; non-thinking: `temperature=0.7, top_p=0.8, top_k=20, presence_penalty=1.5` · **Where it lands in this plugin**: only `temperature` is harness-exposable; the rest rides your deployment defaults (vLLM's generation defaults match the thinking set)
- **Fact**: Recommended output budget · **Value**: reasoning 262,144 / final 131,072 when split limits are available on a 1M context · **Where it lands in this plugin**: `maxTokens` per model / per request
- **Fact**: Images · **Value**: `image_url` parts (URL or data URL) · **Where it lands in this plugin**: `multimodal: true` path (data URL inlined)
- **Fact**: Video · **Value**: `video_url` parts · **Where it lands in this plugin**: not supported — the harness has no video content block

**Required vLLM serve flags** (per the official vLLM recipe): `--reasoning-parser qwen3` is effectively mandatory — without it the whole reasoning block lands in `message.content` — plus `--enable-auto-tool-choice --tool-call-parser qwen3_coder` for tool calling and `--max-model-len 262144` (or higher).

## Framework compatibility

Every wire field the adapter sends or reads, and where it comes from:

### Field · Origin · vLLM · SGLang · llama.cpp / Ollama
- **Field**: `model`/`messages`/`stream`/`stream_options` · **Origin**: OpenAI standard · **vLLM**: yes · **SGLang**: yes · **llama.cpp / Ollama**: yes
- **Field**: `temperature`/`max_tokens`/`stop` · **Origin**: OpenAI standard · **vLLM**: yes · **SGLang**: yes · **llama.cpp / Ollama**: yes
- **Field**: `tools`/`tool_calls` · **Origin**: OpenAI standard · **vLLM**: yes · **SGLang**: yes · **llama.cpp / Ollama**: yes
- **Field**: `image_url` (data URL, request-projected) · **Origin**: OpenAI standard · **vLLM**: yes · **SGLang**: yes · **llama.cpp / Ollama**: VL builds
- **Field**: `reasoning_effort` · **Origin**: OpenAI-family, documented by Qwen · **vLLM**: yes · **SGLang**: yes · **llama.cpp / Ollama**: no (ignored or 400)
- **Field**: `chat_template_kwargs` · **Origin**: **vLLM extension** · **vLLM**: yes · **SGLang**: yes · **llama.cpp / Ollama**: no
- **Field**: `delta.reasoning_content` (+ `reasoning` fallback) · **Origin**: Qwen template dialect, not framework-bound · **vLLM**: `--reasoning-parser qwen3` · **SGLang**: Qwen3 parser · **llama.cpp / Ollama**: `--reasoning-format deepseek`
- **Field**: `usage` (detail fields optional) · **Origin**: OpenAI standard · **vLLM**: yes · **SGLang**: yes · **llama.cpp / Ollama**: tolerated when absent

The only vLLM-specific extension is `chat_template_kwargs`, and it appears in exactly two configurable places: `offMode: chat-template-kwargs` and `preserveThinking: false`. Everything else is OpenAI-standard or **Qwen template-level** (`enable_thinking`, `preserve_thinking`, the `reasoning_content` channel are the model's chat-template vocabulary, so any framework that implements the Qwen3.8 template correctly understands them).

- **vLLM** — f