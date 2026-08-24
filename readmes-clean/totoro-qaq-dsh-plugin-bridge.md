# dsh-plugin-bridge

  ![dsh-plugin-bridge moves a locked session to a new preset through a previewable five-part handoff](./assets/cover/cover-en.png)

Halfway through a task and need another tool preset? Switching the produced session in place would leave tool history that belongs to the old assembly. Bridge previews a bounded five-part handoff, opens a clean target, and leaves the original session untouched.

  ![A real Bridge migration in the official DeepSeek Harness WebUI](https://raw.githubusercontent.com/Totoro-qaq/dsh-plugin-bridge/main/assets/bridge-demo.en.gif)

[Quick start](#quick-start) · [Why Bridge](#why-bridge) · [Evidence](#evidence-at-a-glance) · [Decisions](#migration-decisions) · [Compatibility](#compatibility)

## Quick start

Install from npm:

```bash
dsh plugin --profile web add dsh-plugin-bridge
# restart dsh web once
```

Pinned GitHub fallback:

```bash
dsh plugin --profile web add github:Totoro-qaq/dsh-plugin-bridge#v0.2.10
```

Then type in the official WebUI:

```text
/bridge                       list target presets
/bridge --doctor              check the host contract after a DSH upgrade
/bridge code                  preview the handoff; change nothing
/bridge code --go             migrate, restate, then wait
/bridge code --go --continue  restate and start work in the same target request
```

The preview is editable. Correct a number or path in the printed summary file, then run:

```text
/bridge code --go --file
```

Uninstall with `dsh plugin --profile web remove dsh-plugin-bridge`, then restart `dsh web`.

## Why Bridge

### Promise · What it means
- **Promise**: **Preview before execution** · **What it means**: `/bridge ` creates no target and changes no source session. Review or edit the five-section handoff first.
- **Promise**: **Move state, not tool traces** · **What it means**: Decisions, paths, current state, and next steps move to a clean preset. Incompatible calls from the old tool assembly do not.
- **Promise**: **Fail closed** · **What it means**: The target goal is paused before kickoff. If that cannot be guaranteed, Bridge clears/cancels the target and sends no model request.

Installing Bridge adds **zero prompt tokens** to ordinary sessions. It is a host slash command, not a model tool or skill.

## Evidence at a glance

The release gate is intentionally small and reproducible; these are regression results, not population guarantees.

### Gate · Result
- **Gate**: Five-part summary facts · **Result**: **30/30**
- **Gate**: Target restatement / first useful work facts · **Result**: **60/60 · 60/60**
- **Gate**: Critical facts / obsolete-value resurrection · **Result**: **90/90 · 0**
- **Gate**: Existing image evidence / unresolved raw image · **Result**: **5/5 · 5/5**
- **Gate**: Confirm / `--continue` target request shape · **Result**: **2 · 1** to first useful work
- **Gate**: Confirm extra, paired nominal median · **Result**: **+8.1%** vs `--continue`
- **Gate**: Summary worker share of clean acceptance components · **Result**: **20.74% nominal**

The token percentage varies widely with preset, response length, and cache state. The worker share is composition, not causal overhead versus no Bridge; the stable product claim is one additional confirmation request. Read the [design and evidence boundaries](docs/design.md), [full release report](reports/v0.2.3-e2e-report.md), and [vision report](reports/v0.2.6-rc11-vision-report.md).

## How it works

```text
fold history -> five-part handoff -> preview/edit -> clean target session
             -> pause stored goal -> inject -> restate -> wait or continue
image history -> verbatim assistant evidence; unresolved originals use the attachment gateway
```

The five sections are Goal, Current state, Key decisions and conventions, Key files, and Next step. The original session is never rewritten; archive the target and return to the source if the handoff is unsatisfactory.

## Migration decisions

### Situation · Bridge behavior · Cost / fidelity effect
- **Situation**: Plugin installed, no `/bridge` call · **Bridge behavior**: No prompt injection or model tool · **Cost / fidelity effect**: **0 Bridge prompt tokens**
- **Situation**: `/bridge code` · **Bridge behavior**: One bounded summary worker; preview only · **Cost / fidelity effect**: No target session is created
- **Situation**: Default `--go` · **Bridge behavior**: Target restates and waits · **Cost / fidelity effect**: One explicit confirmation request before useful work
- **Situation**: `--go --continue` · **Bridge behavior**: Restate and work in one target request · **Cost / fidelity effect**: Lower request count; no background goal round
- **Situation**: Image already has assistant analysis · **Bridge behavior**: Copy that response verbatim · **Cost / fidelity effect**: No raw image is resent by default
- **Situation**: Image is unresolved and target accepts images · **Bridge behavior**: Copy the original attachment and preserve the source VLM · **Cost / fidelity effect**: Vision pricing comes from the selected provider
- **Situation**: Image is unresolved and target is text-only · **Bridge behavior**: Prompt admission rejects the image; Bridge sends a visible text fallback · **Cost / fidelity effect**: No hidden local VLM and no silent claim of visual understanding

## Compatibility

### DSH baseline · Text handoff · Raw unresolved image · Verification boundary
- **DSH baseline**: 0.1.0-rc.6 / rc.7 · **Text handoff**: Yes · **Raw unresolved image**: Optional gateway unavailable · **Verification boundary**: Narrow RPC contract and text compatibility tests
- **DSH baseline**: 0.1.0-rc.8 · **Text handoff**: Yes · **Raw unresolved image**: Host-dependent · **Verification boundary**: Real install, restart, command lifecycle, and migration baseline
- **DSH baseline**: 0.1.1-rc.2 · **Text handoff**: Yes · **Raw unresolved image**: Yes · **Verification boundary**: Official WebUI migration with `deepseek-v4-flash-vision-exp`, 13/13 doctor methods, and 5/5 vision gates

CI covers Node.js 22 and 24. Run `/bridge --doctor` after every Harness upgrade; it names missing required gateway methods instead of failing vaguely.

Current limits:

- installation needs one WebUI restart;
- Bridge prints the created title and session ID because stable plugin-driven session navigation is not yet available;
- preview normally takes 20–60 seconds and is bounded by `previewTimeoutMs`;
- text-only models cannot inspect unresolved images;
- each release-acceptance cell currently has one run, so the tables are release evidence rather than statistical guarantees.

The server command stays the compatibility core. A native migration card is technically possible through official client modules and slots, but is intentionally deferred until that prerelease contract is stable; see the [feasibility note](docs/native-webui-feasibility.md).

## Documentation

- [Design, safety, image policy, cost, and evidence](docs/design.md)
- [Chinese install, configuration, rollback, and FAQ](docs/guide.zh.md)
- [Release acceptance report](reports/v0.2.3-e2e-report.md)
- [Vision migration report](reports/v0.2.6-rc11-vision-report.md)
- [Historical compression benchmark](docs/benchmark.md)

## Development

```bash
npm ci
npm run verify
```

`verify` builds and type-checks the project, runs 125 fake-host tests, checks generated `lib/` and datasets, then packs, installs, and imports the actual npm tarball. Tests spend no model tokens. `prepublishOnly` runs the same gate; GitHub releases also require the tag to match `package.json` before trusted npm publishing.

Community listings: [Awesome DSH Plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) · [Awesome DeepSeek Harness](https://github.com/Dominic789654/awesome-deepseek-harness)