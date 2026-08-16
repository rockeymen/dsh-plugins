# dsh-AuthInOne

![dsh-AuthInOne cover](docs/assets/cover.png)

dsh-AuthInOne is a DeepSeek Harness plugin for Provider login, API and custom OpenAI-compatible Provider setup, model switching, optional vision fallback for text-only models, token usage analytics, and cost tracking inside DSH's native **Models** and **Usage** settings.

OpenAI Codex uses browser OAuth with state, S256 PKCE, and a loopback callback. Kimi Code opens the Provider's complete authorization link backed by an RFC 8628 device flow; the link carries the short code, so the user normally only signs in and confirms. xAI Grok, Anthropic, GitHub Copilot, Command Code, Cursor, Google Antigravity, and Kiro are explicitly marked **Experimental compatibility**. Installed-Host validation reached each Provider's authorization boundary and stopped before user consent; mock/fixture tests cover exchange or polling, refresh rotation, denial, timeout, cancellation, logout, route activation, and secret redaction.

> **Alpha `v0.2.0-alpha.4`** · exact compatibility target: official DSH `47f9438` · the self-contained bootstrap uses the official DSH plugin CLI and returns Web on its original port · [release notes](docs/releases/v0.2.0-alpha.4.md) · MIT · community-maintained and not a DeepSeek or OpenAI product.

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 install --profile web
```

The command is owned by this package. It validates the running standard DSH Host, calls the official `dsh plugin` add path, then replaces that Host on the same URL. It does not require a patched DSH core, a manual profile edit, a second Web instance, or a temporary port. See [Install, upgrade, and remove](#30-second-install-upgrade-and-remove) for source-checkout and non-default-port forms.

If AuthInOne is useful to you, a [Star on GitHub](https://github.com/Stormycry-cryp/dsh-AuthInOne) is a welcome way to support the project.

Open DSH, then go to **Settings → Models** or **Settings → Usage**. The browser receives aggregated usage, redacted status, an authorization URL, and where required a user code. OAuth verifier, authorization code, device code, access token, and refresh token stay on the Host; the plugin never imports `~/.codex/auth.json`, OpenCodex state, cookies, browser storage, OTPs, or another product's credentials.

Agent instruction: **Run the documented `pnpm dlx … install --profile web` command as one operation. Do not split it into a manual `dsh plugin add` plus an improvised restart. The AuthInOne bootstrap must verify the listener, install through the official DSH plugin CLI, return the original URL, and report `ready` before UI acceptance. Never start a second Web instance, choose a temporary port, patch DSH, edit profile YAML, or read credentials. If the bootstrap rejects an unknown launcher or DSH owner fingerprint, stop and show that error instead of guessing.**

## Use this plugin when

- you want OpenAI Codex or Kimi Code login inside DSH, or knowingly opt into a labeled compatibility flow;
- you manage API-key or custom OpenAI-compatible Providers in DSH's native Models page;
- you switch the future-session default model without replacing DSH's per-session selector;
- you want a separately configured vision model to describe images only when the selected main model explicitly declares text-only input;
- you need reconstructable Provider/model/tool token usage and auditable calculated cost.

![DeepSeek Harness Models settings with Provider state and OpenAI Codex account authorization](docs/assets/models-dark-desktop.png)

![DeepSeek Harness Usage settings with token activity, model usage, and cost analytics](docs/assets/usage-light-desktop.png)

Additional real DSH captures: [Auth login dialog](docs/assets/auth-login-dark.png), [Models action area](docs/assets/models-auth-actions-dark.png), [dark Usage](docs/assets/usage-dark-desktop.png), [light narrow Usage](docs/assets/usage-light-narrow.png), [dark narrow Usage](docs/assets/usage-dark-narrow.png), and [second-precision time range](docs/assets/usage-time-range-light.png).

## Verified capabilities

### Capability · Status · Verification · Minimum DSH
- **Capability**: OpenAI Codex browser account authorization · **Status**: **Verified to user-confirmation boundary** · **Verification**: Real navigation reached `auth.openai.com`; mock issuer covers callback, state/PKCE, exchange, refresh, denial, expiry, cancellation, logout, revocation, and redaction · **Minimum DSH**: Official DSH `47f9438` with the bundled compat owner
- **Capability**: Kimi Code authorization connection · **Status**: **Experimental; verified to user-confirmation boundary** · **Verification**: Installed Host returned the complete Kimi authorization link without returning the Host-only device code; the UI does not ask users to re-enter a short code already embedded in that link · **Minimum DSH**: Official DSH `47f9438` with bundled compat owner
- **Capability**: Seven compatibility account flows · **Status**: **Experimental; verified to user-confirmation boundary** · **Verification**: xAI, Anthropic, GitHub Copilot, Command Code, Cursor, Antigravity, and Kiro each reached their expected authorization boundary; mocked completion registers and later disposes the corresponding model route · **Minimum DSH**: Official DSH `47f9438` with bundled compat owner
- **Capability**: Provider subscription quota · **Status**: **Best effort where upstream data exists** · **Verification**: Codex, Kimi, xAI, Anthropic, Cursor, and Antigravity have token-free Remote projections; the Models page omits the quota block when the upstream response is missing, incomplete, unsupported, or cannot yield a reliable percentage · **Minimum DSH**: Official DSH `47f9438` with bundled compat owner
- **Capability**: Plan/API presets · **Status**: **Available with vendor limits shown** · **Verification**: OpenAI, xAI, Gemini, Anthropic, Kimi Code, GLM Coding Plan, and ModelStudio/Qwen presets write credentials through DSH; GLM and Qwen usage restrictions remain visible · **Minimum DSH**: Official DSH `47f9438` with bundled compat owner
- **Capability**: DeepSeek API-key Provider and live model call · **Status**: **API-key only** · **Verification**: Native Provider remained connected; a real DeepSeek call populated Usage without exposing the key · **Minimum DSH**: DSH `0.1.0-rc.6`
- **Capability**: Custom OpenAI-compatible Base URL, headers, model mapping · **Status**: **Native DSH capability** · **Verification**: AuthInOne preserves the native Models cards and reads their public Provider projection · **Minimum DSH**: DSH `0.1.0-rc.6`
- **Capability**: Future-session default model and connection test · **Status**: **Verified** · **Verification**: Models contribution and Host/Remote route exercised in the installed Web profile · **Minimum DSH**: Official DSH `47f9438` with bundled compat owner
- **Capability**: Vision fallback for text-only main models · **Status**: **Verified** · **Verification**: PNG/JPEG/WebP/GIF use DSH `ImageBlock` references; multi-image, native multimodal pass-through, disabled fallback, failure, resume, and fork paths have keyless coverage · **Minimum DSH**: Official DSH `47f9438` with bundled compat owner
- **Capability**: Cross-session Usage and cost analytics · **Status**: **Verified** · **Verification**: Real DSH session logs rebuilt 26,383 Token into KPI, heatmap, model, Provider, bucket, and cost projections · **Minimum DSH**: DSH `0.1.0-rc.6`
- **Capability**: Usage navigation icon · **Status**: **Verified** · **Verification**: The bundled generic owner projects a keyed icon seat; AuthInOne contributes a 16 px three-bar `currentColor` icon and unknown sections retain the native fallback · **Minimum DSH**: Official DSH `47f9438` with the bundled compat owner

### Account-login support matrix

### Provider · Flow · Stability · Authorization boundary verified · Refresh/logout/model route · Quota
- **Provider**: OpenAI Codex · **Flow**: Browser OAuth, state + S256 PKCE + loopback · **Stability**: Stable · **Authorization boundary verified**: `auth.openai.com` · **Refresh/logout/model route**: Yes / Yes / Yes · **Quota**: Primary and secondary windows, best effort
- **Provider**: Kimi Code · **Flow**: Complete authorization link backed by RFC 8628 · **Stability**: Experimental · **Authorization boundary verified**: `www.kimi.com` · **Refresh/logout/model route**: Yes / local logout / Yes · **Quota**: Best effort
- **Provider**: xAI Grok · **Flow**: Device login · **Stability**: Experimental · **Authorization boundary verified**: `accounts.x.ai` · **Refresh/logout/model route**: Yes / Yes / Yes · **Quota**: Weekly or monthly, best effort
- **Provider**: Anthropic · **Flow**: Browser/manual compatibility login · **Stability**: Experimental compatibility · **Authorization boundary verified**: `claude.ai` · **Refresh/logout/model route**: Yes / local logout / Yes · **Quota**: Best effort
- **Provider**: GitHub Copilot · **Flow**: Device login · **Stability**: Experimental compatibility · **Authorization boundary verified**: `github.com` · **Refresh/logout/model route**: Yes / local logout / Yes · **Quota**: Not exposed
- **Provider**: Command Code · **Flow**: Browser loopback compatibility login · **Stability**: Experimental compatibility · **Authorization boundary verified**: `commandcode.ai` · **Refresh/logout/model route**: Refresh via returned account credential / local logout / Yes · **Quota**: Not exposed
- **Provider**: Cursor · **Flow**: Browser PKCE compatibility login · **Stability**: Experimental compatibility · **Authorization boundary verified**: `cursor.com` · **Refresh/logout/model route**: Yes / local logout / Yes · **Quota**: Best effort
- **Provider**: Google Antigravity · **Flow**: Browser PKCE compatibility login · **Stability**: Experimental compatibility · **Authorization boundary verified**: `accounts.google.com` · **Refresh/logout/model route**: Yes / local logout / Yes · **Quota**: Best effort
- **Provider**: Kiro · **Flow**: Builder ID device login · **Stability**: Experimental compatibility · **Authorization boundary verified**: `view.awsapps.com` · **Refresh/logout/model route**: Yes / local logout / Yes · **Quota**: Not exposed
- **Provider**: Qwen account OAuth · **Flow**: Discontinued · **Stability**: Unsupported · **Authorization boundary verified**: No start action · **Refresh/logout/model route**: No · **Quota**: No

“Local logout” means the plugin deletes its DSH credential and unregisters the model route when the observed compatibility protocol exposes no reviewed revoke endpoint. The browser never receives the stored credential. Stability labels describe implementation risk; they do not imply Provider sponsorship or certification.

## 30-second install, upgrade, and remove

Install or upgrade the immutable tag with the package-owned bootstrap:

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 install --profile web
```

The bootstrap discovers the single listener at `http://127.0.0.1:3080/`, verifies that it is a standard DSH Host, checks the exact supported DSH owner artifacts, invokes the official DSH plugin add command, and schedules a detached same-port replacement. The install command returns before the old Host stops; the browser may disconnect briefly, then the same URL must return.

For a non-default loopback port, provide the exact current URL:

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 install --profile web --url http://127.0.0.1:3090/
```

When DSH runs from a source checkout, the bootstrap normally infers that checkout from the listener working directory. An operator may make it explicit:

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 install --profile web --source-root /path/to/deepseek-harness
```

Inspect the detached handoff after the URL returns:

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 status --profile web
```

Remove the plugin through the same self-contained path:

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 uninstall --profile web
```

The bootstrap only supports a credential-free loopback HTTP origin and a standard DSH launcher: an installed `dsh` executable or an explicit/inferred DSH source root. Automatic listener verification currently supports macOS and Linux and requires `lsof`. Ambiguous ports, unrelated listener processes, unknown owner artifacts, and unsupported launch provenance fail before the Host is stopped. It never falls back to another port. Owner-only restart status is written under the selected profile without environment values or credentials.

The official DSH CLI still owns the profile dependency and Bundle row. Do not copy `lib/`, create a workspace link, edit profile YAML, or apply the patch by hand. Removal unloads the page, Models contributions, Remote namespace, Host service, styles, and listeners. It intentionally preserves DSH sessions, plugin settings, and credential references; data deletion is a separate explicit action. The exact lifecycle and failure behavior are documented in [Self-contained installer and same-port restart](docs/design/self-contained-installer.md).

## Models and authentication

DSH's native Provider cards remain the only place to add, edit, or remove an API-key Provider. They own custom Base URLs, request headers, protocol choice, model mappings, and endpoint model discovery. AuthInOne adds a compact connection/default-route projection, a full-width **Add Auth login** action, and an **Add Plan / API Key** action above the two native add-Provider buttons. Per-session switching stays in DSH's conversation model selector.

The Models summary contains configured API/Plan/custom Providers and persisted Auth accounts only. The Auth catalog stays in the Add Auth login dialog; cancelled, failed, expired, and never-started entries do not create placeholder cards. A connected account refreshes the summary immediately, and Auth instances use their model adapter and logout flow instead of the generic Base URL probe.

Every Auth entry uses the same Host transaction surface: start, redacted status, cancel, optional one-time input, refresh, logout, and disposal. Browser/loopback flows keep state and PKCE verifier in the Host. Device flows keep the device code in the Host and expose only the verification URL and user code. A successful credential is written through DSH credentials before its model adapter is registered; terminal refresh failure or logout unregisters the route. Cancellation during a pending write compensates by deleting the credential. Remote revocation is bounded and best effort after local deletion.

OpenAI Codex protocol values were checked against OpenAI's public Codex sources for the [login server](https://github.com/openai/codex/blob/main/codex-rs/login/src/server.rs), [auth manager](https://github.com/openai/codex/blob/main/codex-rs/login/src/auth/manager.rs), and [PKCE helper](https://github.com/openai/codex/blob/main/codex-rs/login/src/pkce.rs). Kimi device polling follows RFC 8628 pending and `slow_down` semantics. Compatibility entries use reviewed Provider/public-client behavior and remain labeled Experimental.

The Plan/API action includes OpenAI API, xAI API, Google Gemini API, Anthropic API, Kimi Code subscription keys, GLM Coding Plan, and ModelStudio/Qwen Coding Plan. GLM and Qwen presets retain the vendor's supported-tool or interactive-use restrictions. API keys are a separate connection method and never count as account Auth.

The connection test calls the configured OpenAI-compatible `/models` endpoint from the Host. It rejects redirects before a credential-bearing request can reach another origin and incrementally caps response bytes. The Client receives only success, latency, model ids, or a sanitized failure category; it never receives request headers, upstream response bodies, or credentials.

## Vision fallback

Vision fallback is off by default under **Settings → Models**. Choose an active Provider and a model whose DSH adapter explicitly declares `image` input, then enable and save it. The fallback runs only when the main model explicitly omits image capability; a main model that declares image input receives the original request unchanged, and unknown capability is not silently treated as text-only.

For a text-only main model, the plugin records the exact DSH attachment references, fallback route, prompt version, result, and provider-reported usage as ordinary durable DSH messages with plugin provenance. It then replaces image blocks only in the provider-bound main request with the recorded textual description. Resume and fork reuse that recorded result; switching the fallback route affects new images, not already-described history.

Supported inputs are exactly DSH's version-one raster formats: PNG, JPEG, WebP, and GIF. The feature does not accept audio, video, PDF, image generation, browser object URLs, host paths, or plugin-owned base64 storage. DSH attachment storage owns the bytes and verifies them before an adapter reads them. Provider adapters resolve credentials through DSH Host credentials; AuthInOne never receives a credential in the vision settings RPC.

Successful auxiliary calls appear separately as **Vision-assist calls** and **Vision-assist Token** while retaining their actual Provider/model route. Missing provider usage remains unknown, and a missing price remains unpriced. A failed or credential-less fallback does not call the text-only main model with an unusable image request; it returns a recoverable `VISION_FALLBACK_FAILED` result and keeps upstream response details out of the session log.

## Usage filters and accounting

- Time, Provider, and output-price filters share one query context and drive every KPI, heatmap point, ranking, Token bucket, and cost value.
- Time is an inclusive local `YYYY-MM-DD HH:mm:ss` range in the displayed IANA timezone. The Host converts it to a deterministic UTC `[start, en