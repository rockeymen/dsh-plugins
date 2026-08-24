DeepSeek CLI is an open-source coding agent powered by DeepSeek that runs locally in your terminal.

  ![DeepSeek CLI terminal preview](.github/deepseek-cli-splash.png)

9 interface languages · 6 theme palettes · Agentic coding from plan to execution

  ![DeepSeek CLI theme colors: DeepSeek, Cosmic Orange, Mist Blue, Sage, Lavender, and Deep Blue](.github/deepseek-cli-theme-swatches.svg)

**Note:** This is DeepSeek Harness CLI. We keep iterating in sync with the official [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), and we look forward to your forks and stars.

## Quickstart

### Install

macOS or Linux:

```sh
curl -fsSL https://raw.githubusercontent.com/peiyuwang54/deepseek-harness-cli/master/apps/cli/install/install.sh | sh
```

The command starts the Web UI at `http://127.0.0.1:3080` by default and opens it in the default browser for a local launch. An SSH launch only prints the host URL because the SSH client or editor owns the local forwarded address. Pass `--no-open` to run the server without opening a browser. See [Web UI guide](docs/user/guide/index.md).

Windows:

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://raw.githubusercontent.com/peiyuwang54/deepseek-harness-cli/master/apps/cli/install/install.ps1 | iex"
```

You can also install DeepSeek CLI with the following package managers:

```sh
# Install using npm
npm install -g @peiyu_wang/deepseek-harness-cli
```

```sh
# Install using Homebrew
brew install --cask peiyuwang54/dsh/deepseek-harness-cli
```

Then open a project directory and run `deepseek` to get started. The shorter `dsh` alias is also available:

```sh
deepseek
# or
dsh
```

Run a non-interactive task for scripts and CI with `deepseek exec`:

```sh
deepseek exec "run the tests"
deepseek exec --json "review this repository"
deepseek exec resume --last "continue"
```

On first launch, paste your DeepSeek API key into the masked prompt. The key is stored by the shared credential provider and never added to chat history. Use `/credentials` to inspect its source, replace it, or remove the saved value.

For automation, set `DEEPSEEK_API_KEY` before launch (`$env:DEEPSEEK_API_KEY="your-key"` in PowerShell). An inherited environment value is read-only inside the CLI.

### Permission modes

```sh
deepseek
deepseek --full-auto
deepseek --yolo
```

Use `/permissions` during a session, or pass `--sandbox` and `--ask-for-approval` for exact controls. `--yolo` disables both confinement and approval prompts, so use it only in an isolated environment. See the [CLI behavior reference](apps/cli/reference/README.md#terminal-front-door) and [permission presets](packages/interaction/permission-presets/README.md).

### MCP servers

```sh
deepseek mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem .
deepseek mcp list
```

Use `/mcp` in a running session to inspect connected servers. For HTTP OAuth, run `deepseek mcp auth <name>`. See [MCP server management](apps/cli/reference/README.md#mcp-server-management) and the [MCP client reference](packages/mcp/mcp-client/README.md) for transports, credentials, reloads, and capability details.

Diagnose an installation without starting a profile, or install shell completion for both command names:

```sh
deepseek doctor
deepseek doctor --json
deepseek completion zsh > ~/.zsh/completions/_deepseek
```

`doctor` also checks shipped profile overlays and presets, the optional Web frontend asset, installation channel, sandbox runner, truecolor, mouse input, clipboard support, and every enabled managed MCP connection. MCP probes start the configured server with a 5000 ms per-request timeout; `--mcp-timeout-ms` changes it. Optional server failures and host capability checks are warnings; a required MCP server failure, missing runtime asset, or unsupported Node version is blocking.

Inspect and validate a profile's installed plugin bundles without starting it:

```sh
deepseek plugin --profile tui list
deepseek plugin --profile tui verify --json
deepseek plugin --profile tui source
deepseek plugin --profile tui disable
deepseek plugin --profile tui enable
deepseek plugin --profile tui install
deepseek plugin --profile tui update
```

`source` shows the package directory and declared repository. `enable` and `disable` change the active Cordis bundle list and take effect on the next launch; `install`, `update`, and `remove` use pnpm for dependency resolution.

## What it includes

- Code reading, editing, shell tools, web search, skills, MCP, and subagents.
- Persistent sessions with resume, plan, goal, queued messages, and automatic context compaction.
- A Codex-style terminal UI with six theme palettes and English, Simplified Chinese, Traditional Chinese, Arabic, French, Russian, Spanish, Japanese, and Korean.
- Plugin-based profiles for terminal, headless automation, and the Web UI.

## Run from source

```sh
git clone https://github.com/peiyuwang54/deepseek-harness-cli.git
cd deepseek-harness-cli
pnpm install --frozen-lockfile
pnpm run build
pnpm dsh
```

Source builds require Node.js `^22.19` or `>=24` and pnpm `11.7.0`.

`pnpm run build` prepares the repository artifacts. `pnpm dsh web` uses those built artifacts without rebuilding.

## Docs

- [CLI commands and profiles](apps/cli/reference/README.md)
- [Terminal UI and slash commands](packages/ui/tui/README.md)
- [Configuration reference](docs/config-catalog.md)
- [Architecture](docs/architecture.md)
- [Development](docs/development.md)

Report bugs in [GitHub Issues](https://github.com/peiyuwang54/deepseek-harness-cli/issues).

## Community

- LinuxDo — <https://linux.do>