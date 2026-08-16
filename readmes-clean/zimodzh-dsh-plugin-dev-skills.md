# dsh-plugin-dev

  <samp>
    English ·
  </samp>

An [Agent Skills](https://agentskills.io)–compliant skill that teaches agents how to develop plugins for [**DeepSeek Harness (DSH)**](https://github.com/deepseek-ai/deepseek-harness).

DeepSeek Harness is a plugin-based SDK for building agent harnesses: model adapters, the tool registry, the session log, even the agent loop itself — everything is a Cordis plugin that can be swapped from configuration. This skill distills the [official DSH documentation](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) into one executable standard for writing those plugins, so any agent that loads it develops DSH plugins the same way every time.

> **Note:** This is a community-maintained skill. It is not affiliated with, sponsored by, or officially endorsed by DeepSeek.

## What's inside

```
dsh-plugin-dev/
├── SKILL.md      # entry point: frontmatter, 8 hard rules, 6 scenario workflows,
│                 # decision tables, and a pre-completion checklist
├── references/   # 12 detailed standards, loaded on demand (progressive disclosure)
├── examples/     # two minimal, copy-and-run example plugins
│   ├── hello-plugin/
│   └── greet-tool/
└── evals/        # trigger-evaluation set and methodology for the description
```

The reference library covers: plugin anatomy & lifecycle · services & dependency injection · all five event dispatch modes · plugin configuration · Context/Fiber/registry APIs · three-role capability design (Definition/Provider/Consumer) · tool development · the LLM adapter protocol · plugin form extensions (tool/hook/UI/protocol bridge) · packaging & installation · in-repo workspace packages · the complete capability-seam catalog.

## Installation

The skill name is `dsh-plugin-dev`, and Agent Skills requires the containing folder to be named the same. This repository is called `dsh-plugin-dev-skills` — clone it directly into a folder named `dsh-plugin-dev`:

```bash
git clone https://github.com/zimodzh/dsh-plugin-dev-skills.git ~/.claude/skills/dsh-plugin-dev
```

Adjust the target directory as needed for your agent (see the table below). Prefer downloading a release tarball instead? Extract it and rename the folder to `dsh-plugin-dev`.

No build step, no script dependencies, no configuration — for the skill itself. Developing DSH plugins, however, assumes a working DSH environment: Node.js, pnpm, and `dsh` (used by the examples).

### Agent · Project-level · User-level
- **Agent**: DeepSeek Harness · **Project-level**: `/.dsh/skills/` (rank 100) or `/.agents/skills/` (rank 200) · **User-level**: `~/.dsh/skills/` (rank 400)
- **Agent**: Claude Code · **Project-level**: `/.claude/skills/` · **User-level**: `~/.claude/skills/`
- **Agent**: Codex · **Project-level**: `/.codex/skills/` · **User-level**: `~/.codex/skills/`
- **Agent**: VS Code Copilot · **Project-level**: `/.agents/skills/` · **User-level**: `~/.agents/skills/`
- **Agent**: Other compatible agents · **Project-level**: follow that agent's skill-directory convention · **User-level**: same

To verify: ask the agent "开发一个 DSH 插件" or "write a DSH tool" — the skill should trigger. In DSH you can also load it directly with the `skill(dsh-plugin-dev)` tool.

## Version tracking

The content was distilled from the [official DeepSeek Harness documentation site](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) (snapshot dated 2026-08) and follows the project's own principle: when the skill disagrees with the repository's generated references, **the generated references win**. If you hit a discrepancy, please [open an issue or PR](https://github.com/zimodzh/dsh-plugin-dev-skills/issues).

## Trigger evals

[`evals/trigger-queries.json`](evals/trigger-queries.json) is the regression set for the skill's description (12 should-trigger + 9 should-not-trigger queries). Before changing the description, run the evals and record pass rates — [`evals/README.md`](evals/README.md) explains the methodology, including train/validation splits to avoid overfitting.

## Examples

- `examples/hello-plugin` — a minimal plugin in bundle format. Run `dsh plugin --profile demo add ./examples/hello-plugin`, then `dsh --profile demo`: you should see `[hello-plugin] plugin loaded!` and a heartbeat every 5 seconds, cleaned up automatically on unload.
- `examples/greet-tool` — a minimal model-facing tool. After installing it, ask the agent: "Use the greet tool to greet Ada." It should reply "Hello, Ada!".

See [examples/README.md](examples/README.md) for the full walkthroughs.

## Scope

This skill covers **file-based** DSH plugin development: plugin packages, cordis.yml rows, patch overlays, tools, adapters, bundles, profiles, and in-repo workspace packages. Out of scope: in-session dynamic plugins (the `cordis_define`/`cordis_run` flow) and agent-preset composition editing — those are handled by each deployment's own dedicated skills and tools.