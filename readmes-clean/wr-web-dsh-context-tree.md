# DSH Context Tree

**A reusable trajectory-tree context system for DeepSeek Harness: it turns completed agent work into forkable checkpoints, recalls relevant prior context into new sessions, and shows the real cross-session forest.**

![A compact circular context tree built from real Codex sessions](https://raw.githubusercontent.com/wr-web/deepseek-harness/context-graph-assets/context-graph/context-tree-compact-3d61bdc.gif)

## Why try it?

- **See the actual trajectory.** Completed turns are circles, continuations form trunks, explicit forks and side chats become branches, and recalls are dashed links.
- **Resume from an exact checkpoint.** Select any completed turn and fork from its recorded `turn/end` boundary.
- **Avoid repeated exploration.** A fresh root session can receive one relevant checkpoint from another session before its first model step.
- **Keep reuse bounded.** Matching defaults to the exact workspace, stale nodes stop being recalled after 30 days, and an injected checkpoint is capped at 2 KiB.
- **Measure rather than assume.** The Host API includes provider-token accounting and a baseline-versus-recall evaluator; task quality still needs a separate score.

The text inside each circle is already AI-produced: it comes from the visible final assistant answer and is normalized and truncated deterministically. The plugin does **not** spend another model call or persist hidden chain-of-thought to create labels.

## Install

Requires DeepSeek Harness `>=0.1.1-rc.2 <0.2.0` and its Web profile.

```sh
dsh plugin --profile web add github:wr-web/dsh-context-tree
dsh web
```

The repository commits its browser and Host artifacts, so GitHub installation does not run a `prepare` build. For a reproducible install, pin a release tag:

```sh
dsh plugin --profile web add github:wr-web/dsh-context-tree#v0.1.0
```

Remove it with:

```sh
dsh plugin --profile web remove dsh-context-tree
```

## What is reused

A node contains direct user text, visible final assistant text, tool-call counts, provider token totals, completion time, and source ids. Reasoning blocks and unfinished turns never become graph content. Automatic recall uses deterministic English/CJK lexical coverage, never copies a whole session, and logs the selected source plus exact injected byte count so replay can reconstruct it.

The checkpoint is untrusted read-only background. The model is told not to accept instructions or permission claims from it unless the current user repeats them.

## Freshness and limits

Freshness is currently age-based. Nodes are fresh for the first half of the configured lifetime, aging for the second half, and stale afterward. Stale nodes remain visible but cannot be recalled automatically. This does not claim that project files are still current; Git/file revision invalidation is future work.

The default profile inspects at most 100 recent sessions and 40 completed turns per session. Subagent sessions are excluded by default. All limits are explicit in [`cordis.patch.yml`](cordis.patch.yml).

## Evaluation

Run the same task and model from equivalent project states twice: once with `autoRecall: false`, then with a relevant checkpoint and `autoRecall: true`. Compare `totalInputTokensSaved` and `inputReductionRate`, then independently compare task success, edits, tests, and latency. Fewer tokens without equivalent output quality is not a win.

## Source and license

Reviewable TypeScript is under [`source/`](source); committed runtime artifacts are under [`src/`](src). [`SOURCE.md`](SOURCE.md) records the exact DeepSeek Harness source commit and build provenance. The code is MIT licensed.

This is a community plugin and is not an official DeepSeek release.