#dsh-obsidian-agent-wiki

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)] 的 SQLite 索引黑曜石内存 — 为代理提供了本地黑曜石保险库的**可搜索**视图，没有前端（在黑曜石本身中浏览和编辑注释）。

基于 Node 22 的内置 `node:sqlite` 构建 - 零运行时依赖性。

## 为什么

普通文件系统内存插件线性扫描每个文件，并且无法按目录过滤。该插件在启动时将保管库索引到内存中的 SQLite 表中，并在每次写入时保持最新状态，因此代理可以：

- 全文搜索任何子字符串（包括2个字符的中文单词），
- 按 `path` / `category` / `project` / `tag` 过滤，
- 获取按比赛次数排名的结果。

## 安装

```sh
dsh plugin add dsh-obsidian-agent-wiki
# or from source:
dsh plugin add CagierAsh123/dsh-obsidian-agent-wiki
```

## 配置

将插件指向您个人资料 `cordis.patch.yml` 中的保管库：

```yaml
- id: dsh-obsidian-agent-wiki
  name: dsh-obsidian-agent-wiki
  config:
    vaultPath: B:/path/to/your/vault
```

或者设置 `OBSIDIAN_VAULT_PATH` 环境变量。重启dsh。

## 工具

### 工具·参数·目的
- **工具**：`wiki_read` · **参数**：`file_path` · **用途**：阅读说明
- **工具**：`wiki_list` · **参数**：`path?` · **用途**：列出目录
- **工具**：`wiki_write` · **参数**：`file_path`、`content` · **用途**：写入/覆盖，然后重新索引
- **工具**：`wiki_append` · **参数**：`file_path`、`content` · **用途**：追加，然后重新索引
- **工具**：`wiki_search` · **参数**：`query`、`path?`、`category?`、`project?`、`tag?`、`limit?` · **用途**：索引全文+结构化搜索

`wiki_search` 针对每次命中返回 `path`、`title`、`category`、`project`、`matches` 和 `snippet`，按匹配计数排序。

## 金库布局

`category` 和 `project` 是从每个音符的路径推断出来的：

- `代码Wiki/<topic>/<note>.md` → 类别 `代码Wiki`（共享技术说明）
- `项目Wiki//<note>.md` → 类别 `项目Wiki`，项目``

`tag` filtering matches the frontmatter `tags：` value.

## How indexing works

- **At startup** the plugin scans the vault (skipping `.obsidian`/`.git`/`node_modules`/`.trash`) and builds the in-memory index.
- **On `wiki_write` / `wiki_append`** the touched note is re-indexed immediately.
- Manual edits made in Obsidian are picked up on the next dsh restart.

Full-text matching uses `LIKE '%query%'` rather than FTS5 trigram because trigram returns zero hits for queries shorter than 3 characters — which would drop the 2-character Chinese words that dominate a Chinese vault. At tens-to-hundreds of notes, a `LIKE` scan is sub-millisecond.

## Requirements

- Node ≥ 22.5 (for `node:sqlite`)
- dsh≥0.1.1-rc.2