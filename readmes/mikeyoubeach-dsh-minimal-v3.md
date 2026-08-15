# dsh-minimal-v3

A **Windows-friendly, full-minimal** agent preset for DeepSeek V4 Pro. It starts
from the official `minimal` preset and keeps everything that makes minimal clean
— a fixed `complete` persona, no automatic instruction injection, no context
compaction — but swaps minimal's pure `bash` persistent terminal for a
**platform-adaptive shell** (Windows → `pwsh`, Linux/macOS → `bash`), and brings
in a handful of `standard`'s common file/search tools.

This is a community project. It is not an official DeepSeek preset and is not
affiliated with or endorsed by DeepSeek.

> **Why this matters**: DeepSeek V4 Pro conditions strongly on the API-visible
> tool catalog. Official `minimal` scores well in evaluations (see
> [modeltest](https://github.com/xiaobright/modeltest)) but only runs on Linux +
> persistent bash — on Windows it breaks because bash is absent. This preset
> keeps minimal's "purist" character while working on Windows too, and includes
> the tools you actually need for engineering (`read/write/edit/glob/grep`)
> instead of leaving you with just two.

## Compared to official minimal

| Dimension | Official minimal | dsh-minimal-v3 |
|---|---|---|
| persona | `complete` prompt | same (`You are a helpful software engineer assistant.`, `complete: true`, `includeRuntimeContext: false`) |
| shell | persistent `bash` (unusable on Windows) | platform-adaptive: Windows→`pwsh`, others→`bash` (non-persistent) |
| auto-injection | none | none (does NOT load AGENTS.md/CLAUDE.md/local overlay) |
| context compaction | none | none |
| tools | only `bash` + `str_replace_editor` | `pwsh\|bash`, `read`, `write`, `edit`, `read_image`, `glob`, `grep`, `ask_user_question`, `todo_write` |
| subagent/workflow/goals/skills/web | none | none (kept minimal) |

## Final tool catalog

- **Windows**: `pwsh`, `read`, `write`, `edit`, `read_image`, `glob`, `grep`,
  `ask_user_question`, `todo_write`
- **Linux/macOS**: `bash`, `read`, `write`, `edit`, `read_image`, `glob`,
  `grep`, `ask_user_question`, `todo_write`

Constant for the whole session — no two-phase bootstrap/promotion.

## Compatibility

Developed and verified against:

- DeepSeek Harness (DSH) `0.1.0-rc.6`
- Node.js ≥ 22.19 (only needed for the local self-test)

DeepSeek Harness is currently a developer preview and explicitly permits
breaking changes. This preset references official packages
`@deepseek-ai/dsh-persona`, `dsh-tool-bash`, `dsh-tool-pwsh`, `dsh-tool-fs`,
`dsh-tool-fs-search`, `dsh-tool-ask-user`, `dsh-tool-todo`; if a newer Harness
fails to load it, double-check whether any of those package names changed.

## Install

Clone this repository, then copy the `preset` directory into the user preset
root under the id `minimal-v3`.

PowerShell (Windows):

```powershell
$target = Join-Path $env:USERPROFILE '.dsh\.agent-presets\minimal-v3'
if (Test-Path -LiteralPath $target) { throw "Preset already exists: $target" }
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
Copy-Item -Recurse -LiteralPath '.\preset' -Destination $target
```

Linux/macOS:

```sh
dsh_home="${DSH_HOME:-$HOME/.dsh}"
mkdir -p "$dsh_home/.agent-presets/minimal-v3"
cp -R preset/. "$dsh_home/.agent-presets/minimal-v3/"
```

Fully restart DeepSeek Harness, create a blank session, and select **Minimal V3**
in the preset picker. Do not switch an active session from a different preset.

## Usage notes

- Best paired with **DeepSeek V4 Pro** (the edge here is mostly about Pro's
  sensitivity to the tool catalog; V4 Flash is already stable across harnesses
  and thinking modes).
- On the first request, consider having it `read` a file first to anchor the
  trajectory before giving it the real task.
- This preset has no `skill` tool: if you need open-design-style custom skills,
  use a full preset or add `tool-skill` back in your own copy.
- Because auto-injection is off, project AGENTS.md/CLAUDE.md are **not** loaded
  automatically — read them explicitly or write the rules into the conversation.
  That is intentional ("pure minimal").

## Verify

Local zero-dependency self-test:

```sh
npm test
```

To confirm the preset is discoverable (outside the running Harness):

```js
import { discoverPresets } from "@deepseek-ai/dsh-agent-presets/lib/types/discovery.js";
const presets = await discoverPresets([{ path: "~/.dsh/.agent-presets", trust: "user" }]);
console.log(presets.map(p => ({ id: p.id, broken: p.broken ?? false })));
```

`minimal-v3` should appear with `broken === false`.

For deeper runtime verification, export the session JSONL and check that the
`request/header` `tools` match the catalog above, and that `user/message`
contains **no** `<system-reminder>` AGENTS.md / skills injection.

## Important behavior

- If the first model response makes no tool call, nothing changes (this preset
  is constant; there is no two-phase promotion).
- A failed tool execution does not stop the model from calling the others.
- The preset carries the same trust level as shell access — review
  `preset/agent.cordis.yml` before installing.
- This preset performs no network requests and adds no telemetry.

## Official ecosystem guidance

DeepSeek currently asks community plugin authors to publish plugins in their own
GitHub projects and add the [`dsh-plugin`](https://github.com/topics/dsh-plugin)
topic for discovery. The official repo does not currently accept external PRs
and does not mandate a community template. See the official
[`CONTRIBUTING.md`](https://github.com/deepseek-ai/deepseek-harness/blob/47f943859bef60e4160492346772ded9b24f765a/CONTRIBUTING.md).

## License

MIT. `preset/agent.cordis.yml` was written following the shape of the official
DeepSeek Harness `minimal` preset; original copyright and MIT notice are retained
in [`NOTICE`](./NOTICE).
