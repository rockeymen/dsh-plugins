# CLAT

**cl + at = command-line agent** · [Homepage](https://cl.at.cn)

CLAT is a local-first coding agent foundation shipped as one Rust binary. It
can inspect a repository, edit files, run commands, use external tools, and
keep durable conversations without requiring a JavaScript or Python runtime.
That guarantee covers the shipped CLAT core; optional MCP servers and the DSH
adapter may declare their own runtimes.

The project is built by dogfooding real repository work and turning recurring
needs into reusable, provider-neutral capabilities.

## Quick start

```bash
# Open the terminal UI in the current repository.
clat

# Then run /model once to choose a preset and enter an API key.

# Headless use: positional text is the instruction; piped input is context.
clat exec "explain this repository in one sentence"
git diff | clat exec "review this diff"

# Deterministic offline proof of the model -> tool -> model loop.
clat demo

# Check whether a signed upgrade is available.
clat upgrade --check
```

Run `clat --help` for the complete command-line surface.

## Interfaces

### Interface · Best for · Entry point
- **Interface**: Terminal UI · **Best for**: Daily interactive repository work · **Entry point**: `clat`
- **Interface**: Headless runner · **Best for**: Scripts, CI, git hooks, editor integrations · **Entry point**: `clat exec`
- **Interface**: Web workbench · **Best for**: An installable local PWA and HTTP+SSE clients · **Entry point**: `clat serve`
- **Interface**: DSH client · **Best for**: Using CLAT's TUI with a local DeepSeek Harness host · **Entry point**: `clat dsh`
- **Interface**: Offline demo · **Best for**: Verifying the core loop without credentials · **Entry point**: `clat demo`

`clat serve` binds only to `127.0.0.1:2691` by default. API access uses a
persistent `~/.clat/web-token` Bearer credential; the token is never placed in
the URL. The same binary serves the responsive three-panel PWA.

## What is included

- **Agent workflow** — an unbounded model → tool → model loop, in-run
  steering, user questions, per-session todos, automatic titles, and context
  compaction that preserves the original journal.
- **Models** — built-in DeepSeek, GLM, Qwen, and Kimi presets; named custom
  profiles; OpenAI Responses and OpenAI-compatible protocols; reasoning,
  usage, cache, context, and quota telemetry.
- **Native tools** — bounded file listing, reading, searching, atomic writing,
  exact editing, and process-tree-owned command execution.
- **Permissions** — Read Only, Project Write, and Full Access modes; complete
  argument review; project trust; path fences; fail-closed headless behavior.
- **Sessions** — crash-resilient, append-only, DSH-compatible journals under
  `~/.clat`, with local replay and per-project resume state.
- **Extensions** — MCP over stdio or Streamable HTTP, sandboxed WebAssembly
  components, and an adapter for DSH leaf plugins.
- **Client-neutral core** — the TUI, headless runner, local server, and future
  clients consume the same Application facade and event vocabulary.

## Install

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/artec/clat/main/install.sh | sh
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/artec/clat/main/install.ps1 | iex
```

The installers prefer prebuilt release artifacts and fall back to a source
build when an artifact is unavailable. Prebuilt binaries cover macOS arm64 and
x86_64, Windows x86_64 and arm64, and Linux x86_64 and aarch64 with glibc
2.39+. Older Linux systems can build from source with the stable Rust
toolchain. See [release signing](docs/releasing.md) for the trust model and
platform baselines.

Prebuilt installs go to `~/.local/bin/clat` on macOS/Linux and
`%LOCALAPPDATA%\clat\bin\clat.exe` on Windows; the installer prints a PATH hint
when needed. A source fallback uses Cargo's bin directory, normally
`~/.cargo/bin`. To uninstall, remove that executable. User state under
`~/.clat` is deliberately left intact unless you remove it separately.

## Documentation

Start with the document that matches your task:

### Goal · Document
- **Goal**: Use the TUI, `exec`, `serve`, or `dsh` · **Document**: [Using CLAT](docs/usage.md)
- **Goal**: Configure a preset or custom model · **Document**: [Model editor](docs/model-editor.md)
- **Goal**: Understand approvals, modes, and path boundaries · **Document**: [Permissions](docs/permissions.md)
- **Goal**: Configure MCP servers · **Document**: [MCP integration](docs/mcp.md)
- **Goal**: Install or author a WASM component · **Document**: [WASM plugins](docs/wasm.md)
- **Goal**: Port a DSH leaf plugin · **Document**: [DSH plugin porting guide](docs/dsh-plugins.md)
- **Goal**: Understand core boundaries and lifecycle · **Document**: [Architecture](docs/architecture.md)
- **Goal**: Understand provider adapters and retry behavior · **Document**: [Providers](docs/providers.md)
- **Goal**: Understand files, journals, and recovery · **Document**: [Persistent state](docs/storage.md)
- **Goal**: Build and publish a release · **Document**: [Release signing](docs/releasing.md)
- **Goal**: Run credentialed smoke tests · **Document**: [Live-model validation](docs/live-validation.md)

The DSH adapter package also has standalone
[English](sdk/dsh-adapter/README.md) and

## Development

Prerequisites are Git and the current stable Rust toolchain:

```bash
git clone https://github.com/artec/clat.git
cd clat
cargo test --all-targets --all-features
cargo build
./target/debug/clat demo
```

Useful repository paths:

### Path · Purpose
- **Path**: `src/` · **Purpose**: Rust core and frontends
- **Path**: `web/` · **Purpose**: Zero-build assets embedded by `clat serve`
- **Path**: `wit/` · **Purpose**: WASM plugin contract
- **Path**: `sdk/clat-plugin/` · **Purpose**: Rust SDK for WASM plugin authors
- **Path**: `sdk/dsh-adapter/` · **Purpose**: npm adapter for DSH plugin authors
- **Path**: `plugins/` · **Purpose**: WASM examples and pilot plugins

Live provider checks are intentionally separate from the normal test suite
because they require user credentials and may incur charges. Follow
[live-model validation](docs/live-validation.md) when provider behavior is in
scope. Contributors and coding agents should also read the project
constitution in [AGENTS.md](AGENTS.md).

## Principles

Local first · one binary · model agnostic · MCP native · project aware ·
permission first · dogfood driven · generalize, never special-case.