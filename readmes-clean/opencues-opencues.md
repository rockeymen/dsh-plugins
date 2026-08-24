assets/ at a pinned commit (jsDelivr tested faster/more reliable than
     repo-relative paths on GitHub — keep the CDN, don't switch to relative).
     The ART is still placeholder: when final artwork lands, replace the SVG
     file CONTENTS (same filenames), commit, and bump the @<sha> in these
     URLs to that new commit. -->

#

[![](assets/associations.svg)](#)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/mod.svg)](https://www.reddit.com/user/inventor_black/)![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/open-source-irl.svg)](https://luma.com/OpenSourceIRL)![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/anthropic-ambassador.svg)](https://wilfred.md)![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/cerebras-ambassador.svg)](https://wilfred.md)

**Turn any text field into a two-way LLM channel.** It reads what you write and fills what you ask: catching a slip as you type, or answering the moment you end a line with `_`. A drop-in for Claude Code, OpenCode, Gemini CLI, your shell, and Chrome. Model-agnostic, output you review before it sends, an open standard with no chat window.

The model comes to your cursor, both ways. **Cues** react to what you've already written and surface a fix or a sharper line inline, unprompted. **Blanks** act on demand: end a line with `_` and the model fills in the rest. No chat window, no copy-paste, no context switch.

     GitHub-hosted asset (renders inline): ![demo](https://github.com/opencues/opencues/assets/.../demo.mp4)
     YouTube (GitHub won't inline-embed it — link a thumbnail instead):
     [![Demo](assets/hero-thumb.png)](https://youtu.be/VIDEO_ID) -->

OpenCues is platform, model, and provider agnostic, engineered from the ground up to enable native inline AI.

### You type · You get
- **You type**: let's ship it Thursday the 19th · **You get**: ↳ the 19th is a Friday
- **You type**: we should probably go ahead and refactor this · **You get**: ↳ we should refactor this
- **You type**: hey can u send me that report when u get a sec make this formal _ · **You get**: Could you please send me that report at your earliest convenience?
- **You type**: 4 + 4 = _ · **You get**: 4 + 4 = 8
- **You type**: hello world translate to japanese _ · **You get**: こんにちは世界
- **You type**: draft an email to my landlord asking for a rent reduction _ · **You get**: (the email, written)
- **You type**: ffmpeg command to convert a video to web-ready mp4 _ · **You get**: ffmpeg -i input.mov -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 128k -movflags +faststart output.mp4

Rows with `_` are **blanks**: you ask, the model fills in. Rows without are **cues**: the model speaks up on what you wrote, no prompt.

#

[![](assets/license.svg)](LICENSE)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Ownership-05.svg)](spec/README.md)![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Ownership-06.svg)](spec/blank-spec.md)![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Ownership-07.svg)](spec/cue-spec.md)

# Quickstart

```bash
npm install -g opencues              # needs Node 22+ and git
opencues set-key cerebras csk-...    # cerebras.ai — free tier, lowest latency
opencues install claude-code         # or: opencode | gemini-cli | chrome | shell | dsh
claude-cues                          # launch — native `claude` is untouched
```

Full walkthrough, prerequisites, and per-host detail: [`docs/install.md`](docs/install.md). `opencues doctor` diagnoses anything that looks wrong.

     real embed once available. -->

#

[![](assets/opencues-cli.svg)](docs/guides/cli-reference.md#the-5-youll-actually-use)[![](assets/features.svg)](docs/features/README.md)

# Integrations

### Host · Status · Install
- **Host**: Claude Code · **Status**: Available · **Install**: `opencues install claude-code`
- **Host**: OpenCode · **Status**: Available · **Install**: `opencues install opencode`
- **Host**: Gemini CLI · **Status**: Beta · **Install**: `opencues install gemini-cli`
- **Host**: Chrome · **Status**: Beta · **Install**: `opencues install chrome`
- **Host**: Shell · **Status**: Beta · **Install**: `opencues install shell`
- **Host**: DeepSeek Harness · **Status**: Beta · **Install**: `dsh plugin --profile web add @opencues/dsh`

Each pins its own upstream fork and never touches your native host install.
DeepSeek Harness is the exception: it has a real plugin system, so there is no
fork to pin and no OpenCues CLI step — see
[`integrations/dsh/README.md`](integrations/dsh/README.md).

> ⚠️ **Windows**: not supported natively, run inside WSL2 (see [`docs/install.md`](docs/install.md)).

#

[![](assets/supports.svg)](#integrations)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@62dc0d205460b8610dd4825be196e01ef281dc7a/assets/Supports-09.svg)](integrations/opencode/README.md)![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Supports-10.svg)](integrations/claude-code/README.md)![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Supports-11.svg)](integrations/gemini-cli/README.md)![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[![](assets/chrome.svg)](integrations/chrome/README.md)[![](assets/shell.svg)](integrations/shell/README.md)

# What you get

### Feature · What it does
- **Feature**: **Blanks** · **What it does**: Type `_` for free-form generation, translation, formatting, full rewrites, or keyword-bound system actions (`volume _`, `weather _`).
- **Feature**: **Sentence rewrites** · **What it does**: Cycle a whole sentence to a different register (formal, concise, ...) seamlessly, no `_` needed.
- **Feature**: **Word cues** · **What it does**: Navigate to a single word and cycle a smaller LLM-suggested alternative.
- **Feature**: **Live actuators** · **What it does**: `volume _` reads the real level and leaves a knob you can turn: `Ctrl+Alt+↑/↓` or a bare `_` moves it, and the device follows.
- **Feature**: **Dismissing a cue** · **What it does**: A cue that only tells you something can be silenced from its own note: `_` once quiets it for a while, `_` again forgets it for good. `opencues dismissals` lists what you forgot and turns any of it back on.
- **Feature**: **Session-contradiction cues** (opt-in) · **What it does**: Flags a draft that goes against a decision made earlier in the same coding session, on any host with a transcript.
- **Feature**: **Ask-cues** (opt-in) · **What it does**: Turns a vague sentence into an inline question with cyclable answers, using the assistant's own clarifying prompt.
- **Feature**: **Personal + ambient context** (opt-in) · **What it does**: `my email _` substitutes your real address; fluid lookups can read the page you're on.
- **Feature**: **Hot-reload** · **What it does**: Every `.md` config picks up edits in ~2s, no restart.

Full feature catalogue (44 concepts): [`docs/features/README.md`](docs/features/README.md).
Running a lot of these at once? `opencues usage` prices every LLM call your
hosts have made, across features, so the total isn't a guess.

     comment with the real embed once available. -->

# Configuration & LLM providers

Config lives at `~/.cues/` — one `OPENCUES.md` for runtime settings, plus per-surface source folders. Seven providers supported; set an env key or `opencues set-key` and you're done.

Full reference: [`docs/configuration.md`](docs/configuration.md) · [`docs/guides/llm-providers.md`](docs/guides/llm-providers.md) (switching provider/model, free mode, failover).

#

![](assets/providers.svg)[![](assets/cerebras-systems.svg)](https://cloud.cerebras.ai)[![](assets/groq.svg)](https://groq.com)[![](assets/gemini.svg)](https://ai.google.dev)[![](assets/anthropic.svg)](https://www.anthropic.com)[![](assets/openai.svg)](https://openai.com)

# Security

OpenCues has no tool handlers or exec layer for LLM output — no MCP-tool execution, no agentic actions, no side-effect channel. Worst-case, an LLM response lands as user-visible text in the buffer you review before submitting. That single invariant is what keeps prompt injection a UX failure instead of a data-exfiltration channel, across every surface below.

23 of 27 tracked attack classes closed, 3 closed-with-caveat, 1 tracked for the future pack registry ([full audit table](docs/architecture/security-audit.md)).

### Defense · What it covers
- **Defense**: Sandbox isolation · **What it covers**: Third-party blank JS runs in a real V8 isolate (`isolated-vm`) — its own realm, own intrinsics, no sandbox-escape via constructor-chain pivots
- **Defense**: Capability gates · **What it covers**: A blank only gets `network`/`llm`/`storage`/`secrets` access if declared; secrets without a matching host binding are refused at load time
- **Defense**: Resource quotas · **What it covers**: Sliding-window caps on fetches, LLM calls, and storage writes — no polling hammer, no runaway LLM burn
- **Defense**: Output sanitization · **What it covers**: Blank output is stripped of HTML/script tags, zero-width chars, and bidi overrides before it reaches the buffer

Check a pack before trusting it:

```bash
opencues review ./untrusted-pack/
```

Full threat model: [`docs/architecture/security-audit.md`](docs/architecture/security-audit.md). Reporting a vulnerability: [`SECURITY.md`](SECURITY.md).

### What · Where
- **What**: New host integration · **Where**: [`docs/guides/adding-an-integration.md`](docs/guides/adding-an-integration.md)
- **What**: New cue/blank · **Where**: [`docs/guides/adding-a-cue-blank.md`](docs/guides/adding-a-cue-blank.md)
- **What**: Working on the reference runtime · **Where**: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- **What**: New to the terms · **Where**: [`docs/glossary.md`](docs/glossary.md)

Join the community — questions, feedback, and the people building alongside you. We're also part of [OpenSourceIRL](https://luma.com/OpenSourceIRL), a community for people building in the open.

#

![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Community-12.svg)![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[![](assets/contributors.svg)](https://github.com/opencues/opencues/graphs/contributors)[![](assets/x-twitter.svg)](https://x.com/openCues_)[![](assets/reddit.svg)](https://www.reddit.com/r/OpenCues/)[![](assets/instagram.svg)](https://www.instagram.com/opencues/)