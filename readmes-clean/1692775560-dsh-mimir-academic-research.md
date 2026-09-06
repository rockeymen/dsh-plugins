![Mimir — open-source AI research workspace](docs/media/mimir-cover.png)

# Mimir

The research-lifecycle copilot inside [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness):
literature · experiments & remote GPUs · figures · LaTeX writing → compile → preview · group-meeting decks — one workbench, driven by your agent.

## What it is

Mimir is a single npm package (`dsh-mimir`) that plugs into dsh and gives you:

- **Eight-view web workbench** (sidebar toggle → overlay, dark/light, 中/EN):
  **Overview** pipeline & stats · **Paper** Overleaf-style LaTeX studio (edit → compile → PDF preview, one-click AI fix) · **Library** arXiv + web search, AI relevance scoring, fullscreen PDF reader · **Experiments** metric charts, one-click paper figures · **Figures** upload/organize/insert into the paper · **Meetings** one-click group-meeting PPT (real paper figures + optional AI illustrations) · **Servers** GPU fleet probes + remote jobs · **Ledger** growth-record timeline + one-click progress report
- **Agent tools & slash commands**: `/research-idea` `/research-plan` `/research-review` `/paper-write` `/paper-compile`, plus `arxiv_search`, `web_search`, `wiki_note`, `figure_save`, `latex_compile`, `meeting_deck`
- **Nine bundled research skills** (literature review, novelty check, experiment planning, citation audit, rebuttal…) that teach the agent the workflow — no setup needed

### Overview · Paper · Library · Experiments
- **Overview**: ![Overview](docs/screenshots/tab-overview.png) · **Paper**: ![Paper](docs/screenshots/tab-paper.png) · **Library**: ![Library](docs/screenshots/tab-papers.png) · **Experiments**: ![Experiments](docs/screenshots/tab-experiments.png)

### Figures · Meetings · Servers · Ledger
- **Figures**: ![Figures](docs/screenshots/tab-figures.png) · **Meetings**: ![Meetings](docs/screenshots/tab-meetings.png) · **Servers**: ![Servers](docs/screenshots/tab-servers.png) · **Ledger**: ![Ledger](docs/screenshots/tab-ledger.png)

▶ [Full MP4 demo](https://raw.githubusercontent.com/1692775560/dsh-Mimir-Academic-research/main/docs/media/mimir-demo.mp4) (22 MB)

## Quickstart

Prerequisites: Node.js ≥ 22, the dsh CLI (`npm install -g @deepseek-ai/dsh`), and a `DEEPSEEK_API_KEY` for agent sessions.

```sh
dsh plugin --profile web add dsh-mimir@latest   # installs and self-activates
dsh web                                          # then open http://127.0.0.1:3080
```

Got an old version (e.g. 0.11.x/0.12.x)? dsh's plugin store uses pnpm, which holds back freshly published releases by default. Pin the exact version instead: `dsh plugin --profile web remove dsh-mimir && dsh plugin --profile web add dsh-mimir@0.14.1`

Click **Mimir** in the sidebar footer. The wiki persists at `~/.dsh/storages/research_wiki.json`; artifacts land under `./.research`.

Optional capabilities:

- **Paper compilation** — install a LaTeX engine (`brew install tectonic` is easiest), or set `latex.engine` to a binary path
- **Web search** — the sxng CLI ships with the package; give it a SearXNG server with one command (Docker-free, local venv):
  ```sh
  bash scripts/setup-web-search.sh
  ```
- **Zotero** — set `zotero.apiKey` / `zotero.userId` in the plugin config (keys at zotero.org/settings/keys)

## Configuration

All keys are optional; set them in the profile's `cordis.patch.yml` (full commented example: [examples/mimir-agent/cordis.yml](examples/mimir-agent/cordis.yml)).

### Key · Default · Meaning
- **Key**: `workspaceDir` · **Default**: `.research` · **Meaning**: Research workspace root (artifacts, backups)
- **Key**: `latex.engine` · **Default**: `auto` · **Meaning**: `latexmk` / `tectonic` probe, or absolute binary path
- **Key**: `search.command` · **Default**: `auto` · **Meaning**: Web search: `auto` uses `sxng` from PATH or the bundled copy
- **Key**: `reviewer.maxRounds` · **Default**: `3` · **Meaning**: Per-project review-round budget
- **Key**: `backup.enabled` / `intervalMinutes` / `keep` · **Default**: `true` / `60` / `24` · **Meaning**: Scheduled wiki snapshots
- **Key**: `skills.enabled` · **Default**: `true` · **Meaning**: Register the nine bundled research skills

## Troubleshooting

- **Plugin not found** — dsh resolves plugin names from the profile directory; install with `dsh plugin --profile web add dsh-mimir@latest`, not from your cwd.
- **LaTeX engine not found** — `brew install tectonic`, or point `latex.engine` at an absolute path. First tectonic compile downloads packages; raise `latex.timeoutMs` if it times out.
- **arXiv fails** — export `HTTPS_PROXY` before starting dsh when behind a proxy.
- **Web search unavailable** — run `bash scripts/setup-web-search.sh` (local SearXNG), or `sxng init` against your own instance, then restart dsh.

## Community

Questions, ideas, or show-and-tell — join the WeChat group (QR updated when it expires):

![Mimir WeChat group](docs/wechat-group.jpg)