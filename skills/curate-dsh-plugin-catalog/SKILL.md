---
name: curate-dsh-plugin-catalog
description: Refresh, clean, translate, name, classify, and quality-check the curated DeepSeek Harness plugin directory sourced from GitHub topic dsh-plugin. Use when Codex needs to perform a periodic DSH plugin catalog sync, add newly discovered plugins, refresh GitHub stars and metadata, prefer repository-provided Chinese READMEs, translate missing Chinese project documentation, create concise Chinese product-style names and summaries, remove README noise or malformed markup, or audit plugins-data.js and readmes-clean for publication.
---

# Curate the DSH plugin catalog

## 给其他 Agent 的使用说明

这是 DSH 插件收集整理 skill 的项目内副本。先阅读本文，再根据任务阅读 `references/` 中的数据约定与内容整理规则。无需安装 Codex；其他 Agent 可以直接按 Markdown 指令执行。

本文命令均在项目根目录运行，需要 Node.js。`scripts/refresh_catalog.mjs` 和 `scripts/audit_catalog.mjs` 是本 skill 自带的编排与审计工具；文中其他 `scripts/` 路径均相对于项目根目录，依赖本项目现有的采集、翻译和页面生成脚本。迁移到其他项目时需提供这些项目脚本和下述数据文件，并检查项目脚本所需的网络、认证及运行环境。

只需参考规则时，阅读文件即可。实际收集更新从 “Run the refresh” 开始；只检查现有数据使用 `--audit-only`。`agents/openai.yaml` 是可选的 Codex 界面元数据，其他 Agent 可忽略。

Refresh the catalog incrementally as a two-layer pipeline: lightweight list synchronization first, editorial generation only for newly discovered repositories. Preserve project facts and technical terms; never invent capabilities.

## Locate and inspect the project

Work in the repository containing all of these files:

- `scripts/fetch-dsh-data.mjs`
- `scripts/translate-missing-readmes.mjs`
- `plugins-data.js`
- `plugin-stars.js`
- `plugin-star-history.js`
- `readmes/`
- `readmes-clean/`

Read both project scripts completely before changing their behavior. Read [references/data-contract.md](references/data-contract.md) before changing fields or file paths. Read [references/curation-rules.md](references/curation-rules.md) before editing Chinese names, summaries, translations, or README cleaning.

## Run the refresh

Run the bundled orchestrator from the catalog repository:

```bash
node skills/curate-dsh-plugin-catalog/scripts/refresh_catalog.mjs --project "$PWD" --strict
```

The orchestrator refuses a dirty Git worktree by default because the project scripts overwrite generated catalog files. Use `--allow-dirty` only after inspecting and preserving the user's changes. Useful modes:

```bash
# Audit current output without network requests or rewrites
node skills/curate-dsh-plugin-catalog/scripts/refresh_catalog.mjs --project "$PWD" --audit-only --strict

# Re-run Chinese curation from an existing GitHub snapshot
node skills/curate-dsh-plugin-catalog/scripts/refresh_catalog.mjs --project "$PWD" --skip-fetch --allow-dirty --strict
```

Do not commit, push, deploy, or schedule the refresh unless the user asks for that action.

## Keep weekly refreshes incremental

Build the lightweight comparison list from the union of two GitHub topic searches, deduplicated by lowercase `owner/repository` identity:

- the 500 repositories with the most GitHub stars for topic `dsh-plugin`;
- the 300 most recently updated repositories for topic `dsh-plugin`.

Each list item must include the stable repository identity and current star count. Preserve the ranked-search item when a repository appears in both lists so the merge is deterministic. Report the top-list count, recent-list count, overlap, and unique candidate count separately.

For a repository already present in `plugins-data.js`:

- update only its `pluginStars[id]` entry in `plugin-stars.js`;
- preserve every other metadata field;
- do not fetch its README;
- do not rewrite `plugins-data.js` when no repositories are new;
- do not clean, translate, summarize, rename, recategorize, regenerate SEO pages, or rewrite its detail files.
- record only changed star values in the dated incremental snapshot inside `plugin-star-history.js` so the public Trending page can compare refreshes.
- seed newly admitted repository IDs into the history baseline at their current star count and exclude them from that run's dated delta; a new catalog entry has no measured growth until a later refresh.

For a repository not yet present:

- require repository-level evidence of DeepSeek Harness or DSH compatibility in its name, description, supporting topics, or README; the bare `dsh-plugin` topic alone is not sufficient because unrelated repositories can add it;
- record rejected topic-only repositories in the sync report and do not add their metadata, stars, README files, translations, or detail pages;
- fetch complete metadata and README content;
- run Chinese README discovery, cleaning, translation, summary, naming, and classification;
- write new raw and cleaned README files;
- add its ID to `logs/last-sync.json` so the translation stage processes only that repository.

Treat `plugin-stars.js` as the volatile current ranking layer, `plugin-star-history.js` as the compact historical-delta layer, and `plugins-data.js` plus README/detail files as the stable editorial layer. The homepage and detail pages must join stars by stable plugin ID at runtime. A stars-only scheduled run may change only those two star files; it must not force content or detail-page regeneration. Keep at most 104 dated deltas (roughly one year at Monday/Thursday frequency), and replace rather than duplicate a snapshot when a refresh is repeated on the same UTC date.

Keep repositories that disappear from the current top list. Append them unchanged after the current list rather than deleting their record or detail files. Use an explicit, repository-scoped force-refresh workflow when an existing project's details genuinely need regeneration.

## Apply the editorial pipeline

After collection finishes, curate in this order:

1. Confirm every record refers to an actual `dsh-plugin` repository and all seven categories remain represented.
   Also confirm every newly discovered repository contains real DSH evidence beyond the topic label itself.
2. Prefer a repository-owned Chinese README such as `README.zh-CN.md`, `README_ZH.md`, `README_zh.md`, `README_CN.md`, or a linked Chinese Markdown document.
3. If no usable Chinese README exists, translate the cleaned English README. Preserve code, commands, URLs, file names, model names, API names, and product names.
4. Remove GitHub-facing noise: badges, workflow status, star requests, contribution instructions, license boilerplate, contributor lists, star-history charts, language switchers, and table-of-contents navigation.
5. Preserve user-facing project content: what the project is, what problem it solves, core features, supported platforms, setup, usage, screenshots, architecture, limitations, and meaningful examples.
6. Write one Chinese summary that explains the project itself in roughly one to two lines. Do not use “来自 GitHub 的…”, “属于某分类”, or unsupported claims.
7. Create a product-style Chinese display name, not a marketing sentence or description. Keep the GitHub repository name separately in `name`.
8. Add genuinely ambiguous or high-value exceptions to the project's `contentOverrides` or `titleOverrides`; do not weaken global rules to fix one repository.
9. Run `scripts/curate-english-metadata.mjs` after Chinese curation. English card titles and summaries must be product-focused, English-only, and free of slogans, release labels, warnings, licenses, README navigation, or arbitrary first-sentence extraction.
10. If `scripts/generate-seo-pages.mjs` exists, regenerate localized plugin landing pages, `sitemap.xml`, `llms.txt`, and `llms-full.txt` only when new or explicitly re-curated content exists. Never run it for a stars-only refresh.

## Name projects consistently

Derive the Chinese display name from, in priority order:

1. The official Chinese project name.
2. The project type and primary function stated in the README overview.
3. A concise noun phrase built from the main object plus product type.

Prefer names such as `架构可视化技能`, `DSH 模型配置器`, `跨会话记忆插件`, and `开源设计工作台`. Reject sentence-like names such as `为纯文本模型“看图”设计更好的视觉工具箱`, generic labels such as `一个 DeepSeek Harness 插件`, and category restatements.

Allow established English product names and acronyms such as DSH, MCP, Codex, OAuth, TUI, VS Code, Godot, OpenAPI, and Telegram. Keep names compact enough to scan in a card; use the summary for explanation.

## Audit and inspect

The bundled audit checks schema completeness, duplicate IDs and repositories, malformed HTML/entities, generic Chinese copy, sentence-like or overlong titles, missing README files, Chinese-source metadata, and category coverage.

After the automated audit:

1. Review every reported error and warning.
2. Manually inspect newly added repositories and at least the top 10 by stars.
3. Open representative detail pages in both Chinese and English.
4. Confirm Chinese mode loads repository Chinese README first and translated Chinese only as fallback.
5. Confirm English mode shows English content only.
6. Confirm images resolve, tables render as readable blocks, modal content scrolls, and raw HTML/entities are absent.
7. Re-run the strict audit after fixes.
8. Open the Trending page and confirm its latest values match `plugin-stars.js`, its growth values come from `plugin-star-history.js`, and a repeated same-day refresh does not create duplicate history entries.

For English mode, compare the repository name, `displayNameEn`, and `summaryEn` separately. The repository name is identity; the display name explains the product type; the summary explains the purpose and main benefit. If an English field contains substantial Chinese text or README noise, treat it as a publication defect.

## Report the refresh

Return a compact report containing:

- repository count and category counts;
- top-500 count, recent-300 count, overlap, and unique candidate count;
- newly added, stars-updated, and retained-outside-list repository counts;
- whether the run was stars-only and whether stable content files remained untouched;
- current star records and incremental star-history snapshot count;
- repository-provided Chinese versus translated README counts;
- audit errors and warnings resolved or remaining;
- files changed;
- whether commit, push, deploy, or scheduling was intentionally left undone.
