# dsh-plugin-cc

A Claude Code plugin marketplace that bridges to the **DeepSeek Harness** (`dsh`) agent: code review, adversarial critique, task delegation, background runs, and multi-turn resumable dsh sessions — all from Claude Code slash commands.

Built against [`@deepseek-ai/dsh@0.1.0-rc.6`](https://www.npmjs.com/package/@deepseek-ai/dsh) (developer preview; the SDK JSON-RPC server this plugin needs is published separately as [`@deepseek-ai/dsh-sdk-jsonrpc-server`](https://www.npmjs.com/package/@deepseek-ai/dsh-sdk-jsonrpc-server) and is outside the CLI dependency closure). The exact DSH behaviors this plugin depends on are pinned in [docs/dsh-compat.md](docs/dsh-compat.md); re-verify that table when upgrading dsh.

## Quick start

Plugin commands require Node >= 20 and a `DEEPSEEK_API_KEY`. Installing dsh via `/dsh:setup` also needs Node >= 22.19 (harness floor), `npm`, and `pnpm` (`corepack enable`) because `dsh plugin add` forwards to pnpm.

```bash
# 1. Install the plugin
/plugin marketplace add cpj-dev/dsh-plugin-cc
/plugin install dsh@deepseek-dsh

# 2. One command, one time: /dsh:setup does everything
#    Installs @deepseek-ai/dsh@0.1.0-rc.6 from npm, then adds the SDK
#    JSON-RPC server (and its peers) to the multi-turn cc profile.
/dsh:setup

# 3. In any git repository:
/dsh:check          # readiness probe
/dsh:review         # read-only review of your local changes
```

Have your own built [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) checkout? `/dsh:setup --harness ` uses it instead of npm (the directory must already be `pnpm install`'d and `pnpm run build:lib`'d). A later `/dsh:setup` with no args migrates that machine to the npm pin; pass `--harness` again to keep the checkout. Have a built `dsh` already? `DSH_BINARY` selects that executable; plain `/dsh:setup` still creates the `cc` profile from the pinned npm SDK-server package. Uninstalling: remove the plugin, the plugin data directory (the npm prefix lives there), and `~/.dsh/profiles/cc`.

## Commands

### Command · What it does · Needs setup?
- **Command**: `/dsh:check` · **What it does**: Readiness probe (dsh, npm pin / checkout, credentials, profile, broker) · **Needs setup?**: no
- **Command**: `/dsh:setup` · **What it does**: Install/link the pinned npm CLI (or `--harness `) and create the multi-turn `cc` profile · **Needs setup?**: —
- **Command**: `/dsh:review [focus]` · **What it does**: Read-only code review of local changes · **Needs setup?**: no
- **Command**: `/dsh:critique [focus]` · **What it does**: Structured adversarial design critique · **Needs setup?**: no
- **Command**: `/dsh:run <task>` · **What it does**: Run a task (read-only by default; `--write`, `--session`, `--resume`, `--model`, `--effort`, `--background`) · **Needs setup?**: only for `--session`/`--resume`
- **Command**: `/dsh:delegate <task>` · **What it does**: Background delegation via the `dsh-delegate` subagent · **Needs setup?**: no
- **Command**: `/dsh:import` · **What it does**: Transfer this conversation into a resumable dsh session · **Needs setup?**: yes
- **Command**: `/dsh:runs [id]` · **What it does**: List runs / one run's status · **Needs setup?**: no
- **Command**: `/dsh:show [id]` · **What it does**: Stored result of a finished run · **Needs setup?**: no
- **Command**: `/dsh:stop [id]` / `--broker` · **What it does**: Kill a run's process tree / the shared broker · **Needs setup?**: no

Full command semantics: [docs/commands.md](docs/commands.md). Installation and runtime failures are covered in [docs/troubleshooting.md](docs/troubleshooting.md).

## Project scope — what each part is and how to use it

```
.claude-plugin/marketplace.json   Marketplace manifest. Users point /plugin marketplace add here.
plugins/dsh/                      The single plugin this marketplace ships.
  .claude-plugin/plugin.json      Plugin identity; bump `version` on every release.
  commands/*.md                   Slash-command surfaces. Each file = one /dsh:* command; the body
                                  tells Claude exactly which bridge invocation to run and how to
                                  present the output. Edit these to change UX wording, never logic.
  agents/dsh-delegate.md          Background-delegation subagent. Claude invokes it for substantial
                                  tasks; it drives the bridge and reports the run id/result.
  skills/                         Internal skills (progressive disclosure for Claude itself):
    dsh-delegate-runtime/         the bridge call contract — read by the agent before first use
    dsh-run-output/               presentation rules for bridge results
  hooks/hooks.json                SessionStart/SessionEnd wiring. Start exports DSH_CC_SESSION_ID /
                                  DSH_CC_TRANSCRIPT_PATH via CLAUDE_ENV_FILE; End cancels this
                                  session's runs. No edits needed unless Claude Code's hook API moves.
  scripts/dsh-bridge.mjs          The only entry point commands call. One subcommand per capability;
                                  stdout is user-facing. Run `node scripts/dsh-bridge.mjs` for usage.
  scripts/dsh-broker.mjs          Per-workspace daemon owning one live `dsh --profile cc` SDK runtime
                                  — the only way DSH sessions can span multiple turns. Started on
                                  demand by the bridge; never start it manually.
  scripts/session-lifecycle-hook.mjs  Hook implementation behind hooks.json.
  scripts/lib/                    Implementation layers; dsh.mjs is the only file that knows how to
                                  invoke DeepSeek Harness, broker-client.mjs the only one that talks
                                  to the broker. Everything else is plumbing (state, jobs, git, render).
  prompts/*.md                    Prompt templates ({{VAR}} interpolation) for critique and import.
  schemas/review-output.schema.json  JSON contract embedded into critique prompts.
docs/                             The documentation set (see reading order below).
tests/                            node:test suite with a fake `dsh` fixture; `npm test`.
```

## Documentation — progressive disclosure

Read in this order; stop at the layer you need.

1. **This README** — what exists and how to invoke it.
2. [docs/commands.md](docs/commands.md) — full user-facing command semantics and flags.
3. [docs/troubleshooting.md](docs/troubleshooting.md) — setup, credentials, profile, broker, and timeout recovery.
4. [docs/architecture.md](docs/architecture.md) — the two drive paths (one-shot headless vs broker) and why each design decision was forced by a DSH fact.
5. [docs/dsh-compat.md](docs/dsh-compat.md) — the pinned DSH behavior table; the first thing to re-verify on a dsh upgrade.
6. Deep dives: [docs/broker.md](docs/broker.md), [docs/state-and-jobs.md](docs/state-and-jobs.md).
7. Contributing: [docs/development.md](docs/development.md), [docs/testing.md](docs/testing.md).

[docs/README.md](docs/README.md) is the maintained index with per-document ownership rules. Simplified Chinese user documentation starts at [docs/zh-CN/README.md](docs/zh-CN/README.md).

## Known limitations (v1)

- No mid-run approvals: permissions are decided before launch (`--write` or not). DSH's interactive approval seam needs a UI the plugin doesn't have.
- Fresh one-shot runs are not resumable; only broker-backed runs (`--session`, `--resume`, `/dsh:import`) record session ids, and those sessions live only as long as the broker process.
- Stop = kill: the DSH SDK wire has no per-turn cancel; stopping a mid-turn broker run discards the broker's in-memory sessions.
- `/dsh:import` is a weak import (compressed text digest), not a native history replay.
- POSIX only (unix sockets, pgrep); Windows is out of scope for v1.

## Community and support

- Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
- Use [SUPPORT.md](SUPPORT.md) for support boundaries and help channels.
- Report vulnerabilities through the private process in [SECURITY.md](SECURITY.md).
- Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).