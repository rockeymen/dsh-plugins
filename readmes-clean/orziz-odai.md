# odai

  ![Dai, the odai mascot](assets/odai-readme-badge.png)

`odai` is a governance-powered general task-execution framework for AI agents.

It embeds governance into execution: align the real objective, facts, assumptions, authorization, risks, and acceptance; then choose the shortest sufficient path, combine the right capabilities, act, verify, and keep moving until the task is genuinely deliverable. It does not replace the model's judgment with a rigid workflow.

The short version: call `/odai`; governance stays nearly invisible on simple work, while ambiguity, complexity, risk, and domain needs automatically increase or reduce the depth of handling.

## Why Use It

`odai` is for people who want agents to move with autonomy, but not with false confidence.

It helps an agent:

- ask only when the missing answer would change the goal, scope, authorization, acceptance, risk, or stop line
- verify what it can verify from files, commands, logs, tests, or project context before asking you
- keep lightweight tasks lightweight instead of turning every request into ceremony
- avoid claiming that something was tested, delegated, reviewed, or verified when it was not
- combine specialist skills and domain guidance only when the task needs them, instead of stuffing every rule into every turn
- reuse existing host or project memory, persisting only durable information with provenance, scope, and invalidation conditions

## The Dao of odai

**The user defines the task; evidence determines the route; methods adapt to circumstances; verification determines completion; boundaries determine where to stop—get the task done, without acting presumptuously.**

This is not a collage of philosophical schools. It is one decision rule:

- **Get the task done**: advance the user's task to a verified, deliverable result, while surfacing counterexamples, risks, and a better route when they would change the outcome.
- **Do not act presumptuously**: do not bend facts, user decisions, or hard boundaries; do not conclude without evidence, exceed authorization, invent work, or treat a discovery as permission to implement it.

The person and the model work as partners toward a shared result, not through a one-way command chain. The person contributes intent, context, value judgments, and unacceptable outcomes; the model contributes judgment, evidence, creation, and execution, challenges doubtful premises, and proposes better routes. Both calibrate understanding and trust through real progress, candid uncertainty, and feedback. The person owns goal-level tradeoffs; the model chooses professional implementation details within the agreed boundary. Authorization is not blind obedience, and challenge is not a takeover.

odai is neither an echo of the user nor a reciter of rules. It takes the person's purpose as its direction and facts and boundaries as its constraints, forms its own judgment and recommendation, holds a justified disagreement when necessary, and changes its mind when the evidence changes. Truth outranks pleasing, effectiveness outranks ceremony, reliable results outrank superficial shortcuts, and long-term trust outranks one-turn performance.

The model's initiative is judged by net value. Speed, quality, stability, cost, breadth, and practicality are outcomes to balance against the user's goal and the evidence—not a flat list of slogans, and never substitutes for a real result.

### Operating Standard

**See clearly, hold steadily, strike accurately, land real results, defend what matters, and build for the long run.**

Understand the real objective, facts, and gaps; hold authorization, boundaries, and risk steady; choose the narrowest sufficient path; produce a verifiable deliverable; protect user decisions, system safety, and truth; and leave a result that survives use, maintenance, and change.

### Product Goal

Make agents **faster, more accurate, better, steadier, cheaper, lighter, broader, more adaptive, more useful, and more practical**. These are not independent process targets. They are product outcomes balanced around the task's net value; process, file count, tokens, and benchmark scores never substitute for getting the real task done.

## 30-Second Start

Install the unified entry point:

```bash
npx skills add https://github.com/orziz/odai --skill odai
```

Then invoke it with `/odai`. That is the normal form in clients that expose skills as slash commands:

```text
/odai update the onboarding flow copy.
Goal: make it clearer for first-time users.
Materials: current app files and README.
Constraints: do not change behavior yet; give me the proposed copy and risks first.
```

If slash commands are not available in your client, naming `odai` in plain language works too.

You do not need to know the internal structure or choose a methodology. `odai` infers the required depth, capability, domain knowledge, and verification from the task and project evidence.

### DeepSeek Harness packages

DSH users can install either integration independently:

```sh
# Apply Odai to every agent preset in one profile
dsh plugin --profile web add odai-dsh-plugin

# Install a selectable, session-scoped Odai Agent preset
npx odai-dsh-agent install
```

The Plugin command requires `pnpm` on `PATH`; the Agent installer currently requires `dsh@0.1.0-rc.6`. Each package already includes the canonical Odai skill and shared DSH runtime. The Agent preserves every capability from the pinned DSH Standard preset and adds Odai as a scoped extension. Plugin needs neither a separate skill nor Agent; Agent needs neither a separate skill nor Plugin. Choose Plugin for profile-wide behavior or Agent for a selectable preset. Installing both is normally redundant and is only for a deliberate combination of those scopes. The existing provider-neutral `odai-cli` remains a separate product.

Neither DSH package chooses planner, executor, or reviewer models. Tell Odai naturally, for example, `use provider/model for planning with high reasoning`; the model persists that explicit choice for both surfaces. If a needed responsibility is still unconfigured, Odai names it and asks for the model instead of claiming that route ran.

See [`dsh/README.md`](dsh/README.md) for package boundaries, natural-language configuration, and verification.

### Host Capability Routing

The user identifies who should own each responsibility once, or lets odai recommend a mapping from the host's real capability catalog. After confirmation and installation, the project persists that mapping. Every later conversation and action still starts with `/odai` or an ordinary task request; the user never repeats models, roles, planning modes, or routing commands and does not need to watch internal handoffs. When models change, update the mapping once in place.

The controller is the persistent task thread that owns the goal, global state, correction loop, and final delivery, not another role launched on every turn. Judgment, implementation, and acceptance are internal responsibilities rather than a user workflow. One sufficient capability completes the task in one pass; when the mapping provides genuinely different responsibility capabilities, the host obtains the needed judgment, implementation, or acceptance and returns one result to the current conversation. Reliable no-tool answers stay direct, and follow-ups inherit recent deliveries and unresolved items without making the user restate them.

This routing is constrained by the host; skill text alone cannot mechanically guarantee it. If the host cannot verify model switching or delegation, odai uses one sufficient controller and continues the safely achievable work without pretending that routing occurred. The router is not a prerequisite for ordinary use and is installed only when the user requests managed capability routing.

Managed capability routing and the project guardrail hooks described below are separate mechanisms. Routing registers host roles; experimental `stage` provides an explicit task-start runner and never injects a hidden per-turn hook. Project guardrails only enforce project-declared read-only paths and acceptance commands and do not route models.

Users on a supported host who want managed role routing do not need to find paths, enter model IDs, or merge configuration by hand. After installing the skill, say:

```text
/odai install and verify capability routing for this project.
```

odai selects four responsibility mappings from the host's actual capability catalog, explains the persistent effect, asks for one confirmation, and installs them with conflict checks. The default `auto` policy only registers capabilities: one controller closes the task directly, while planner, executor, and reviewer remain conditional on independent judgment or bounded handoff actually changing the result. It adds no hidden per-turn preflight. Experimental Codex `stage` is installed only when the user explicitly chooses it and real tasks demonstrate net benefit; it must start at the task boundary so planning and execution share one evidence chain. Reliable direct answers and read-only lookups never invoke another role merely to demonstrate routing.

To remove it, ask odai to uninstall capability routing for the current project. The installer merges with existing host settings, records the original Codex controller configuration for exact restoration, deletes only unchanged files listed in its managed manifest, and preserves unrelated settings. Installation, update, or an actual uninstall requires a new session; project scope is the default. It can generate managed role configuration for Codex, Claude Code, and GitHub Copilot CLI. An explicitly enabled Codex `stage` additionally provides an executable task-start runner and actual-model verification; the other two hosts must not claim an equivalent level of automatic routing until comparable runtime evidence exists.

When `stage` is explicitly enabled, `.codex/odai-run-routing.mjs` is an explicit experiment and maintenance surface, not a transparent daily-work entry. Default `auto` does not install it; neither policy installs a routing hook.

## How It Decides

`odai` continuously evaluates four dimensions:

- **Complexity**: direct action, a small amount of structure, staged execution, or durable task state and trusted memory.
- **Clarity**: enough evidence to act, safe exploration first, or a decision that only the user can make.
- **Risk**: lightweight verification for reversible work; stronger authorization and evidence for external or hard-to-reverse work.
- **Domain**: internal craft knowledge, repository conventions, or a specialist host skill for code, documents, spreadsheets, slides, browsers, images, games, and other deliverables.

Before loading any playbook, it applies a silent light-task gate. If the outcome, action, path, authorization, and verification are already clear and low-risk, it acts directly. A suspicious premise, conflicting request, material ambiguity, cross-layer tradeoff, high-risk side effect, or long dependency is what makes it expand.

Depth is not fixed at the start. A task can be upgraded when its impact expands or downgraded when inspection reveals a small local change. SDD, TDD, BDD, agents, consensus, and formal plans are optional methods, not mandatory modes.

Objects supplied only to inform, compare, explain, or verify the target are read-only by default. A request whose result is understanding, judgment, advice, or a plan is not silently upgraded into authorization to modify existing objects; even change requests write only to the identified target.

The point is not to slow the agent down. The point is to make sure it is fast in the places where speed is safe, and careful in the places where guessing would cost you.

## Architecture Logic

```text
                         user task
                            |
                            v
       +---------------------------------------------+
       | /odai -> lightweight adaptive kernel       |
       | understand -> choose next valuable action  |
       +---------------------+-----------------------+
                             |
       +---------------------+-----------------------+
       |                     |                       |
       v                     v                       v
  direct action       internal capability      host skill / tool
                     + domain knowledge         + project rules
       |                     |                       |
       +---------------------+-----------------------+
                             v
                    act -> verify -> deliver
                             |
                  new evidence updates the path

Only complex or long-running work loads durable state,
trusted memory, agent coordination, independent challenge, or consensus;
existing memory stays authoritative instead of being mirrored.
```

The framework owns the task from understanding through delivery. Five flat references provide only the boundary, craft, verification, support, or external capability guidance needed at the moment; there is no separate orchestrator workflow or user-selected domain package.

odai's complete capability is not just its entry text. It combines the core, built-in baseline craft, project context, and professional capabilities that are worth using. A clearly matching installed capability may be used directly; a general capability gap warrants an installation recommendation only when the net gain is real; stable, repeated, project-specific craft may be encoded as a project skill. Whatever route is used, odai still owns evidence integration, acceptance, and final delivery. Merely finding, recommending, creating, or invoking a capability is not completion.

## Internal Map

The internal structure is organized by responsibility, not by mandatory stages:

| Layer | Purpose |
| --- | --- |
| Kernel | Core principle, adaptive progression, minimum boundaries, and loading map |
| `dao.md` | Goal ownership, factual correction, authorization, read-only references, and high-impact boundaries |
| `craft.md` | Planning, implementation, design, UI and real-time interaction, writing, and review |
| `verification.md` | Acceptance, evidence strength, completion, and resuming existing work |
| `support.md` | Self-calibration, performance recovery, durable state and memory, relationship continuity, consensus, and repeated review |
| `leverage.md` | Capability escalation and delegation, external capability discovery, net-benefit decisions, installation, creation, composition, and agent collaboration |

Domain depth is inferred from the task instead of selected as a package. Game, UI, documentation, and software work use the built-in craft baseline, then borrow project material, host tools, or professional skills only for a named gap. Without an external skill, odai still completes what the current model can do reliably.

Content work preserves evidence, existing templates, stale responsibilities, and publication boundaries. Complex or long-running work writes decisions, state, and acceptance evidence back to one existing maintenance location only when that materially improves recovery. Code, tests, or the requested artifact remain sufficient when they already carry the complete result.

## Good Prompts

Use the level of detail you actually have:

```text
/odai handle this. Decide the route and ask only if a boundary or acceptance point is missing.
```

```text
/odai review the current diff. Report findings first and do not modify files.
```

```text
/odai refresh this repository README. Remove outdated screenshots and keep the install path clear.
```

```text
/odai this task is user-facing. Do not change behavior without approval; verify the proposed route first.
```

## Install Options

Most users only need the unified entry point:

```bash
npx skills add https://github.com/orziz/odai --skill odai
```

Other supported installs:

```bash
# Install every skill in this repository
npx skills add https://github.com/orziz/odai --all

# Install the slimmer branch
npx skills add https://github.com/orziz/odai#mini

# Install the older "one skill per ability" layout
npx skills add https://github.com/orziz/odai#old
```

Use `old` only if you still depend on the previous standalone skill layout or are comparing a migration.

Canonical source lives in `skills/`. Distribution is handled through the [skills.sh](https://skills.sh) install flow; this repository no longer keeps per-platform mirror outputs. See [MAINTAINING.md](MAINTAINING.md) for the current source, validation, freeze, and release rules, and [CHANGELOG.md](CHANGELOG.md) for frozen architecture changes.

## Codex Pets

This repository includes two optional, complementary Codex v2 desktop pets rather than two simple recolors:

| Pet | Character | Personality | Role |
|---|---|---|---|
| [Dai (`dai`)](pets/dai/) | Black-and-teal operations officer | Calm, reliable, restrained | Moves the task forward, executes, verifies, and closes the work |
| [Odai (`odai`)](pets/odai/) | Silver-white and blue-violet mascot | Lively, friendly, curious | Keeps you company, reacts to progress, cheers you on, and celebrates completion |

Dai gets the work done; Odai makes the process feel accompanied. Each includes nine standard animations and 16 look directions. Installing the `odai` skill does not install either pet automatically.

See the separate character bibles for [Dai](docs/阿岱%20设定档案.md) and [Odai](docs/欧黛%20设定档案.md).

From a cloned or downloaded copy, choose a pet and copy its two runtime files into the matching Codex pet directory.

Windows PowerShell (`odai`; replace both occurrences with `dai` for the black version):

```powershell
$petName = "odai"
$petDir = Join-Path $env:USERPROFILE ".codex\pets\$petName"
New-Item -ItemType Directory -Force $petDir | Out-Null
Copy-Item -LiteralPath "pets\$petName\pet.json","pets\$petName\spritesheet.webp" -Destination $petD