# Runbook

**A Jupyter-shaped research surface for DeepSeek Harness (DSH).**

Vibe-coded research projects accumulate scripts, figures, JSON files, terminal
logs, and half-finished directories faster than a person can reconstruct the
story. Runbook gives that work one persistent, Git-backed surface: the research
question stays visible, a script keeps one stable place, every run becomes an
execution record, and every output remains traceable as Evidence.

Runbook is deliberately not a file browser, a second chat transcript, or a
magic project summary. It is a small projection layer over facts that already
exist in DSH, Git, the project documents, and observed files.

## The central idea

The unit of work is not a new folder or a filename such as `final_v7`.

| Research meaning | Runbook projection | Source of truth |
| --- | --- | --- |
| What are we trying to decide? | Question / Decision / Open Question compass | Authored `README.md` and `STATUS.md` |
| What can we change? | Stable Attempt cell | The script path and its current Git worktree |
| What happened? | Execution history | DSH run facts and session lineage |
| What did it produce? | Evidence generation | Observed output path, metadata, and optional hash |
| Which version is this? | Branch, commit, and agent author | Git |

Re-running an existing script adds an execution and an output generation to the
same cell. It does not create another notebook page or encourage another date
directory. Git remains the version system; filenames remain addresses, not
versions.

## What the current surface contains

- **Research compass** — the question, the current answer, and the next
  discriminating step, with the authored source still visible.
- **Living notebook cells** — one readable cell per stable script. Each cell
  keeps the current source, the relevant session context, outputs, and prior
  executions together.
- **Recent visual results** — the latest images, PDFs, and HTML outputs from the
  active session lineage sit directly below the compass for quick comparison.
- **Turn-local artifacts** — images and PDFs produced by a conversation turn are
  shown beside that turn, so an answer does not become detached from its figure.
- **One evidence thread** — the structural backbone, session runs, Git commits,
  subagents, and provenance facts expand in place when investigation needs more
  detail. There are no competing graph pages.
- **Safe rerun** — Runbook prepares a manifest, shows a review, and requires a
  short-lived confirmation before executing a supported script.

## A normal research loop

1. Open **Runbook / 运行本** in a DSH conversation.
2. Read the compass before opening the long evidence trail.
3. Improve the existing Attempt cell when the question is the same; start a
   new branch only when the question, data, environment, or output contract is
   genuinely different.
4. Run the whole supported entrypoint, review the plan, and confirm it.
5. Compare the new Evidence beside the previous generations and beside the
   conversation turn that produced it.
6. Save the meaningful checkpoint to Git. An agent can author its own commit;
   the human integrator can remain the committer.

## How the projection is built

```text
authored README.md / STATUS.md ─┐
DSH session + ancestors         ├─► one research workspace
observed executions / outputs  ┤       compass → Attempts → Evidence
Git branch / commits / authors  ┤       + one expandable evidence thread
bounded scan + optional PIPELINE ┘
```

The project fact pool is durable, but the default notebook is lineage-aware:
the current DSH session sees its own executions and ancestors; sibling sessions
are retained but folded away. Two sessions that point at the same `cwd` still
share the physical worktree and project fact pool. True simultaneous file
isolation requires Git worktrees or separate DSH workspace targets.

## Install

From GitHub:

```bash
dsh plugin --profile web add zhan-tz/dsh-plugin-runbook
```

Restart the selected DSH surface, then open a conversation and choose
**Runbook / 运行本**.

For local development:

```bash
git clone https://github.com/zhan-tz/dsh-plugin-runbook.git
cd dsh-plugin-runbook
dsh plugin --profile web add link:"$PWD"
npm test
npm run check
```

The package declares `dsh.bundle.patch`, so normal DSH plugin installation
mounts the required Cordis layer automatically.

## Safety and boundaries

- The browser never calls an arbitrary file-serving or shell HTTP route. RPC
  requests are bound to a persisted DSH session, and paths are contained inside
  that session's workspace.
- Text and media previews are bounded. Inline media currently has a 6 MiB
  limit; unsupported or larger files stay visible and can be opened in the
  system application.
- Reruns use the host's runner and session workspace, an environment allowlist,
  output/time bounds, and one-time confirmation. Runbook does not expose an
  arbitrary browser shell or execute fragments cut from a `# %%` file.
- Terminal text is only a fallback observation. Perfect producer/consumer
  provenance requires DSH tools or runners to emit structured artifact events.
- Static I/O inspection and an optional `PIPELINE.md` backbone are hints, not a
  proof of arbitrary dynamic I/O.

## v0.18.0

This release turns the recent notebook work into a coherent public surface:

- one integrated research workspace with a Question → Decision → Open Question
  compass;
- stable whole-script Attempt cells and immutable output generations;
- current-session-plus-ancestors projection, with sibling runs folded away;
- readable step titles while retaining exact paths for auditability;
- agent-aware Git authorship without overwriting the human/integrator identity;
- recent visual results and turn-local image/PDF artifacts restored at the two
  places where a researcher actually looks for them;
- session-bound preview, Git/structure inspection, native DSH subagent facts,
  and prepare → review → confirm reruns.

## 中文说明

Runbook 不是把文件夹再画一遍，也不是把聊天记录压缩成一张“当前态”卡片。它把
DSH 的会话、Git、项目文档和实际观测到的输出，投影成一个适合反复实验的研究工作面：

- 顶部先回答“研究什么、现在判断是什么、下一步怎么判别”；
- 同一个脚本稳定占据同一个 Attempt 格子，重跑只增加历史和 Evidence 代；
- 当前 session 及祖先组成工作线，旁支事实保留但默认收起；
- 最近图片/PDF 在罗盘下方可见，生成它的回合旁边也有缩略图；
- 需要追溯时再展开同一条证据脉络，看运行、Git、subagent 和文件关系；
- 大文件、未知格式或暂时无法内联的结果不会消失，而是交给系统打开。

它鼓励 agent 先复用现有脚本、输出和 Git 历史，但不禁止真正独立的问题另开分支。

## License

MIT
