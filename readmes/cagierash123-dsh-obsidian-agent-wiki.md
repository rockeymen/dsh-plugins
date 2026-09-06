# dsh-obsidian-agent-wiki

SQLite-indexed Obsidian memory for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — gives the agent a **searchable** view of a local Obsidian vault, with no frontend (browse and edit notes in Obsidian itself).

Built on Node 22's built-in `node:sqlite` — zero runtime dependencies.

## Why

Plain file-system memory plugins scan every file linearly and can't filter by directory. This plugin indexes the vault into an in-memory SQLite table at startup and keeps it fresh on every write, so the agent can:

- full-text search any substring (including 2-character Chinese words),
- filter by `path` / `category` / `project` / `tag`,
- get results ranked by match count.

## Install

```sh
dsh plugin add dsh-obsidian-agent-wiki
# or from source:
dsh plugin add CagierAsh123/dsh-obsidian-agent-wiki
```

## Configure

Point the plugin at your vault in your profile's `cordis.patch.yml`:

```yaml
- id: dsh-obsidian-agent-wiki
  name: dsh-obsidian-agent-wiki
  config:
    vaultPath: B:/path/to/your/vault
```

Or set the `OBSIDIAN_VAULT_PATH` env var. Restart dsh.

## Tools

| Tool | Parameters | Purpose |
|------|-----------|---------|
| `wiki_read` | `file_path` | Read a note |
| `wiki_list` | `path?` | List a directory |
| `wiki_write` | `file_path`, `content` | Write / overwrite, then re-index |
| `wiki_append` | `file_path`, `content` | Append, then re-index |
| `wiki_search` | `query`, `path?`, `category?`, `project?`, `tag?`, `limit?` | Indexed full-text + structured search |

`wiki_search` returns `path`, `title`, `category`, `project`, `matches`, and a `snippet` for each hit, ordered by match count.

## Vault layout

`category` and `project` are inferred from each note's path:

- `代码Wiki/<topic>/<note>.md` → category `代码Wiki` (shared technical notes)
- `项目Wiki/<project>/<note>.md` → category `项目Wiki`, project `<project>`

`tag` filtering matches the frontmatter `tags:` value.

## How indexing works

- **At startup** the plugin scans the vault (skipping `.obsidian`/`.git`/`node_modules`/`.trash`) and builds the in-memory index.
- **On `wiki_write` / `wiki_append`** the touched note is re-indexed immediately.
- Manual edits made in Obsidian are picked up on the next dsh restart.

Full-text matching uses `LIKE '%query%'` rather than FTS5 trigram because trigram returns zero hits for queries shorter than 3 characters — which would drop the 2-character Chinese words that dominate a Chinese vault. At tens-to-hundreds of notes, a `LIKE` scan is sub-millisecond.

## Requirements

- Node ≥ 22.5 (for `node:sqlite`)
- dsh ≥ 0.1.1-rc.2

## License

MIT
