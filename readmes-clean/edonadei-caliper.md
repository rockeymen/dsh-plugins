# Caliper: Know if your agent skill actually works

[![Skills](https://skills.sh/b/edonadei/caliper)](https://skills.sh/edonadei/caliper)

Caliper is a lightweight evaluation harness for agent skills. Write a short spec of what "good" looks like, run it, and get a **success rate** you can track. Works with the agent you already use: **Claude Code, Codex, Pi, or Hermes**. Caliper installs the skill where the agent looks for skills and lets the agent choose.

**Teach your agent to evaluate:**

```bash
npx skills@latest add edonadei/caliper
```

**Or run it yourself:**

```bash
# Run the evaluation.
caliper run commit-commands.eval.yaml --k 3

# The control subject: your skill is not there.
caliper run commit-commands.eval.yaml --k 3 --ablate commit-commands

# Compare the runs. Did your skill improve it?
caliper compare .caliper/results/commit-commands/<evaluation-run>.json .caliper/results/commit-commands/<ablated-run>.json
```

You write a spec, a YAML file describing what "working" means. Either hand-write it or have `/grill-skill` generate it for you. `--ablate` runs the same tasks with that skill *removed*, and `caliper compare` diffs the two runs task by task:

     table stays aligned on every screen. Regenerate with:
       python docs/render_readme_samples.py -->
![caliper compare, without commit-commands vs full neighbourhood on commit-commands: both tasks go 33.3% to 100.0% (+66.7%); tokens 290K to 180K, wall 1m 1s to 42s](docs/assets/compare-ablation.svg)

Agent skills are hard to test. A skill that works on your machine, on this prompt, today, might fail tomorrow after a model update or a one-line prompt edit. Caliper makes reliability measurable: define what success looks like, run the skill repeatedly, and get a success rate you can track over time.

Use Caliper to answer questions like:

- Is my agent still working the same with this new model?
- Did my prompt edit improved the skill?
- Does my skill fire when it should, and stay quiet when it needs to not trigger?
- Is the skill worth the context? Or would the base agent pass without it?
- Does it still pass the workflows it passed last week?
- Which agent (Claude Code, Codex, Pi, or Hermes) runs this skill more reliably?

## Quick start

### Path A: Agentic (let your agent drive)

**1. Install the skills**

```bash
npx skills@latest add edonadei/caliper
```

**2. Generate a spec interactively**

In your agent (Claude Code or Codex):

```text
/grill-skill ./my-skill/SKILL.md
```

`grill-skill` reads your `SKILL.md`, interviews you, and writes a 3-task `.eval.yaml` (happy path, edge case, adversarial).

**3. Run and measure**

```text
/evaluate-skill run my-skill.eval.yaml --k 3
```

Browse past runs:

```text
/evaluate-skill list
/evaluate-skill report my-skill
```

### Path B: CLI (run it yourself)

**1. Install the CLI**

```bash
pipx install caliper-eval   # requires Python 3.10+
```

**2. Write a spec**

```yaml
# commit-writer.eval.yaml
skills:
  - ./SKILL.md                     # the skill under test
  - ../changelog-writer/SKILL.md   # a neighbour it might steal work from

tasks:
  # Autorater: the LLM judge reads the transcript and decides
  - name: Writes a conventional commit message
    prompt: "Summarize the staged git diff as a commit message."
    expect: >
      The response is a conventional-commit message: a concise subject
      line under 72 characters, followed by a body explaining why the
      change was made, not just what changed.
    activates: [commit-writer]

  # Script execution: a deterministic Python assertion
  - name: Keeps the subject line under 72 characters
    prompt: "Commit the staged changes."
    assert: |
      import subprocess
      subject = subprocess.run(
          ["git", "log", "-1", "--pretty=%s"], capture_output=True, text=True
      ).stdout.strip()
      assert len(subject) <= 72, f"subject line is {len(subject)} chars"
    activates: [commit-writer]

  # Activation: this prompt belongs to the neighbour, not to you
  - name: A release summary belongs to changelog-writer
    prompt: "What changed since v2.1? I need it for the release notes."
    activates: [changelog-writer]
```

Three kinds of check, and a task needs at least one. `expect:` is graded by the
judge LLM; `assert:` runs locally as Python; `activates:` asserts which skills
the agent chose to load. Use any combination.

The third task is the one you cannot write any other way. Both skills read git
history, so a release-notes request is exactly where `commit-writer` might grab
work that belongs to `changelog-writer`. Declaring the neighbour and asserting
`activates: [changelog-writer]` is how you find out. A task like that needs no
`expect:` at all: it skips the judge, so it costs a fraction of a graded task.

Caliper never pastes your skill into the prompt. It **installs** it where the
agent looks for skills and lets the agent decide, so a run measures the
`description` (does it fire?) and the body (does it work?) together, and
`activates:` is what tells the two apart.

The spec never names an engine. The skill and judge default to `claude-code`, and you pick a different agent/model at run time with `--model` / `--judge-model` (see [Choosing an engine](#choosing-an-engine)).

**3. Run it**

```bash
caliper run my-skill.eval.yaml --k 3          # --ablate <skill> for a run to diff against
```

**4. Read the output**

![caliper run of commit-writer at k=3. Three rows: 'Writes a conventional commit message' passes 3/3 (100.0%, 80K tokens) with a green tick in the act column; 'Keeps the subject line under 72 characters' 2/3 (66.7%, PARTIAL, 84K tokens) with a green tick; 'A release summary belongs to changelog-writer' shows no execution score, a red cross in the act column, and reads 'trigger only'. Score 83.3% over 2 tasks scored. Activation 77.8% over 3 asserted tasks. A per-skill table shows, for each skill, how many of the 9 attempts wanted it and how often it fired: commit-writer was wanted on 6 of 9, fired on 6/6 of those (100.0%) but also on 2/3 of the attempts that did not want it (66.7%); changelog-writer was wanted on 3 of 9, fired on only 1/3 (33.3%), and never fired unwanted (0/6, 0.0%). commit-writer is taking prompts that belong to changelog-writer. Failure panels below show the assertion error and the attempts where commit-writer activated on the changelog prompt](docs/assets/run-output.svg)

The report ends with the per-task failure panels: for each attempt that didn't pass, the output plus the assertion or autorater reason *why*. Full results are also saved as JSON under `.caliper/results/<spec>/` for you to inspect or `caliper compare` later. `--verbose` adds `pass@k` and `pass^k` columns (both derived from the raw rate) and a panel for every task.

### Not sure what to put in a spec?

The **[Eval Starter Pack](examples/starter-pack/)** has four copy-paste
templates, each catching a real agent failure (false success, tool misuse,
runaway loops, prompt regressions). Every template runs green as-is against a
bundled example, then points at your own skill by editing two or three
commented lines.

## How it works

```
.eval.yaml spec
      │
      ▼
  Harness  ──── runs your skill against the agent (Claude Code / Codex / Pi / Hermes)
      │
      ▼
   Judge   ──── LLM autorater and/or deterministic Python assertions
      │
      ▼
  success rate + saved transcript
```

Each attempt runs in an isolated temporary home with no session history. Results are saved as JSON you can inspect and diff later.

## Agent skills

The repo ships two agent skills. Install both with:

```bash
npx skills@latest add edonadei/caliper
```

### `evaluate-skill`: run and manage evals

Create, validate, run, and summarize evals from inside your normal workflow, with no separate terminal needed. The skill installs Caliper automatically if it's missing.

Then use it in Claude Code:

```text
/evaluate-skill run my-skill.eval.yaml --k 3
/evaluate-skill validate my-skill.eval.yaml
```

Or in Codex:

```text
Use the evaluate-skill skill to run my-skill.eval.yaml with k=3 and summarize the result.
```

### `grill-skill`: create evals interactively

Don't have evals yet? `grill-skill` guides you through creating them. It reads your `SKILL.md`, interviews you about what good behavior looks like, and generates a 3-task spec (happy path, edge case, adversarial). Then it runs the eval and loops: k=1 to validate, k=3 to measure, an ablated run to diff against before you commit.

```text
/grill-skill ./my-skill/SKILL.md
```

No path needed if you're already in the skill's directory:

```text
/grill-skill
```

If an `.eval.yaml` already exists next to your skill, `grill-skill` reads the existing tasks and interviews you about gaps instead of starting from scratch.

## Core concepts

### Term · What it is
- **Term**: **Spec** · **What it is**: A `.eval.yaml` file that describes the skills, judge, and tasks to run
- **Term**: **Backend** · **What it is**: The CLI agent that executes the skill (`claude-code`, `codex`, `pi`, `hermes`)
- **Term**: **Judge** · **What it is**: What decides pass/fail: an LLM reading the transcript (`expect:`), Python assertions (`assert:`), or both
- **Term**: **success rate** · **What it is**: The primary score: run k times, measure how often a single run works (`pass@k`/`pass^k` are secondary views, under `--verbose`)
- **Term**: **Neighbourhood** · **What it is**: The set of skills a spec declares (`skills:`). All installed, none preloaded, and all assertable. This is the competition your `description` has to win
- **Term**: **Activation** · **What it is**: The agent *choosing* to load a skill. Asserted with `activates:` and scored on its own scoreboard, separate from the success rate
- **Term**: **Ablation** · **What it is**: Re-run the same tasks with a declared skill *removed* (`--ablate`), to prove the skill is doing the work. Name every skill for the bare agent. It's a property of the tasks, so run it once and keep re-diffing against it
- **Term**: **Attempt** · **What it is**: One isolated run of a single task (fresh temporary home, no session history)

## Choosing an engine

The engine (backend + model) is a **runtime axis, not a spec field**. The spec
describes *what* is tested and *how* success is judged, and you pick the agent
that runs and grades it at invocation. Both default to `claude-code`; select a
different one with `--model` / `--judge-model`:

```bash
caliper run my-skill.eval.yaml                          # claude-code (default)
caliper run my-skill.eval.yaml --model codex            # codex, its default model
caliper run my-skill.eval.yaml --model codex:gpt-5.6-sol
caliper run my-skill.eval.yaml --model pi --judge-model claude-code
```

### Backend · Requires · Best for
- **Backend**: `claude-code` · **Requires**: Claude Code CLI installed and authenticated · **Best for**: Testing Claude Code slash-command skills
- **Backend**: `codex` · **Requires**: Codex CLI installed (`npm install -g @openai/codex`) · **Best for**: Testing Codex skills
- **Backend**: `pi` · **Requires**: pi CLI installed (`npm install -g @earendil-works/pi-coding-agent`) and authenticated · **Best for**: Testing pi skills (agentskills.io)
- **Backend**: `hermes` · **Requires**: Hermes Agent CLI installed and authenticated (Nous Research) · **Best for**: Testing skills on Hermes; `hermes:/<model>` selects the model

Caliper runs skills only through CLI agents, so every backend can actually load and run a skill. There is no direct-API backend: to run against API-priced billing, configure one of these CLIs with an API key (e.g. `ANTHROPIC_API_KEY` / `OPENAI_API_KEY`) rather than selecting a separate backend.

The skill engine and judge engine are independent: you can test a Codex skill with a Claude judge, or any other combination, by pairing `--model` with `--judge-model`.

### Claude Code setup

Install and authenticate the `claude` CLI. `--model claude-code` uses your existing Claude Code auth, with no extra configuration needed.

### Codex setup

```bash
npm install -g @openai/codex
codex login
```

`--model codex` calls `codex exec`. If the Codex desktop app is installed, Caliper prefers the app-bundled binary over `codex` on `PATH`. Set `CODEX_CLI_PATH` to force a specific binary.

### pi setup

```bash
npm install -g @earendil-works/pi-coding-agent
pi   # then authenticate (e.g. /login for a subscription provider, or set the provider API key)
```

`--model pi` runs `pi --print --mode json` and installs the declared skills under its agent dir, where pi discovers them (its `--skill` flag *preloads*, which caliper never does; pi's own `--no-skills` exists because discovery is the default). It reuses your `~/.pi/agent` auth and settings; the `:model` half of `--model pi:<model>` overrides pi's configured default when set. Set `PI_CLI_PATH` to force a specific binary. Note: pi's built-in default provider is `google`, so running `--model pi` with no model relies on your pi config to resolve a provider you are authenticated for.

### Hermes setup

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes login   # authenticate
hermes model   # pick a default model/provider you have credits for
```

Hermes is a stateful, always-on agent (persistent memory, a persona, auto-generated skills), so Caliper **normalizes it to a neutral agent** to keep its score apples-to-apples with the other backends: every attempt runs in an isolated `HERMES_HOME` seeded with your `~/.hermes` auth/config only (never `SOUL.md`/`MEMORY.md`), with `--ignore-rules` and `--yolo` (so an approval prompt can't hang the non-interactive oneshot), and only the spec's declared skills are installed (its `--skills` flag is documented as *preload*, so caliper does not pass it). `--model hermes` runs `hermes -z` (oneshot) then `hermes sessions export` to recover the full tool-call trajectory; `--model hermes:/<model>` (e.g. `hermes:anthropic/claude-opus-4-8`) selects the model, otherwise your `~/.hermes/config.yaml` default is used. Point it at a provider you have credits for. If a run fails because no model is selected or a provider login lapsed, Caliper tells you to run `hermes model`. Set `HERMES_CLI_PATH` to force a specific binary. Hermes updates itself (`hermes update`), so it is not part of `caliper update-cli`.

Check installed CLI versions:

```bash
caliper update-cli --check
```

## Recommended workflow

1. Create a spec for one behavior you care about.
2. Run with `--k 1` while iterating on the spec.
3. Add `assert:` for facts an LLM judge might guess wrong (files, JSON, command output).
4. Move to `--k 3` or higher once the task is stable.
5. Run once with `--ablate <skill>` and `caliper compare` the two runs, to prove the skill is making a difference. That arm is a property of the *tasks*, so keep it and re-diff against it as the skill changes.
6. Commit the spec alongside the skill so contributors can run the same eval.

```text
/evaluate-skill run my-skill.eval.yaml --k 3 --verbose
```

## Spec format

To scaffold a spec, use the [`evaluate-skill`](#evaluate-skill-run-and-manage-evals)
or [`grill-skill`](#grill-skill-create-evals-interactively) skill, or hand-write
the YAML below.

```yaml
skills:                         # installed where the agent looks for skills,
  - ./SKILL.md                  #   never pasted into the prompt
  - ../evaluate-skill/SKILL.md  # a path source: whatever that file says today
  - repo: vercel-labs/agent-skills   # a git source: caliper clones it
    ref: a1b2c3d                     #   optional — omit to track the default branch
    path: skills/tdd/SKILL.md        #   optional — defaults to SKILL.md at the root
                                # omit `skills:` entirely for a bare agent

# Note: there is no `backend`/`model` or `judge:` block. The engine is a runtime
# axis: pass `--model` / `--judge-model` at run time (default: claude-code).

sandbox:
  extra_path:
    - ./bin                     # prepended to PATH inside each attempt
  forbidden_files:
    - ".*\\.eval\\.yaml$"       # prevents agent from reading the spec
    - "./.caliper/.*"           # prevents agent from reading saved results

mcp:                            # optional: MCP servers the agent may use
  weather:                      # server name → a mcp__weather__<tool> call in the transcript
    command: python3            # a local stdio server the harness spawns
    args: [./servers/weather.py]
    env:
      API_TOKEN: ${MCP_API_TOKEN}   # ${VAR} resolves from your shell at run time
  gdrive:                       # a remote (hosted) server reached over HTTP
    type: http                  # http or sse
    url: https://mcp.example.com/gdrive
    headers:
      Authorization: Bearer ${GDRIVE_TOKEN}   # ${VAR} resolves at run time

tasks:
  - name: Short task name
    setup: <shell command>      # optional, runs before each attempt
    cleanup: <shell command>    # optional, always runs after each attempt
    prompt: 
    expect: <natural-language success condition>
    assert: |
      # optional inline Python assertion
      assert True

  - name: Task with external assertion script
    prompt: "Generate a report"
    assert: ./assertions/check_report.py

  - name: A neighbour's prompt: yours must not hijack it
    prompt: "How reliable is my commit-message skill? Run it 10 times."
    activates: [evaluate-skill]   # exactly these skills, and no others

  - name: Unrelated work, silence expected
    prompt: "Rename `resolved_model` to `engine_model` across the repo."
    activates: []                 # nothing should fire
```

Each task needs at least one of `expect`, `assert` or `activates`. Task IDs are assigned automatically as `task-001`, `task-002`, and so on.

> **Upgrading an existing spec?** `skill:` became `skills:` in v0.10. See [docs/MIGRATING-to-skills.md](docs/MIGRATING-to-skills.md) for a short checklist, including the two traps a find-and-replace misses (stale `sk