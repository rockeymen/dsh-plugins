# dsh-generative-ideas

**Roadmap ideation for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)** — generate, simulate, and compare distinct roadmap options via headless agent runs; pick the one that fits, export as `goal.md`, dispatch to an agent in the chosen workspace.

> 路线图构想：通过后台 agent 生成多个不同战略立场的路线图，对比后选出最合适的，导出为 goal.md 并发送到指定工作区的 agent。

## Install

```sh
dsh plugin --profile web add dsh-generative-ideas
```

Restart the `dsh web` process. An **Ideas** entry appears in the sidebar.

## The flow

1. **Context** — enter your focus, pick a target workspace, set horizon and constraints
2. **Deep Research toggle** (default ON) — the generation agent must research **12+ competitors, GitHub open-source repos, and `.refs/` curated references** before producing options; every thesis names what the best-in-class competitor does differently
3. **Generating** — the host spawns a background headless agent (30-90s); the sidebar icon pulses while running; close the panel and come back — results persist
4. **Compare** — 4 genuinely distinct roadmap options as bleed-row cards: name, thesis, phases with acceptance items, risks, effort, differentiator
5. **Pre-flight actions** (on the compare step): **Reroll** (fresh options, same focus), **Push** (force deep research ON and regenerate), **Discuss** (close panel, talk in chat)
6. **Chosen** — pick one, **Export goal.md** to the workspace root

## Deep research doctrine

When the toggle is ON (or Push is pressed), the generation prompt mandates:
- Minimum **12 competitors** studied with concrete methods captured
- **GitHub open-source repos** in the space — READMEs, design docs, issue trackers
- **`.refs/` directory** curated research references
- Options **grounded in specific evidence** — competitor names in theses, real patterns in phases, actual risks others encountered

## Architecture

```
src/host.js            Node half — /api/rich-ideas/{state,generate,export} routes.
                       Generation runs as a background dsh --profile headless call;
                       state persists across panel close/reopen.
src/client.bundle.js   Browser half — sidebar entry + stepper overlay panel.
```

## License

[MIT](LICENSE)
