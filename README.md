# dsh-plugins

The curated directory for DeepSeek Harness plugins.

## Run locally

This is a dependency-free static site. Serve the repository root with any static server:

```bash
python3 -m http.server 4173
```

The plugin snapshot is curated from the [GitHub `dsh-plugin` topic](https://github.com/topics/dsh-plugin). Stars and repository previews reflect the snapshot date shown in the site.

## Data sync

Run the public GitHub topic synchronizer to refresh the static catalogue:

```bash
node scripts/fetch-dsh-data.mjs
```

The synchronizer is incremental. It first fetches the ranked repository list and writes current star counts to the independent `plugin-stars.js` snapshot. A stars-only refresh does not rewrite `plugins-data.js`, README files, translations, summaries, display names, or static detail pages. Newly discovered repositories receive full metadata, README cleaning, Chinese discovery or translation, summaries, display names and detail files. A separate English editorial pass creates product-style English names and summaries, preferring clean repository descriptions and rejecting README slogans, release labels, warnings, markup and mixed-language copy. Repositories that fall outside the current ranked list remain in the catalogue. A new-project run manifest is written to `logs/last-sync.json` only when new IDs need editorial processing.

After curation, `scripts/generate-seo-pages.mjs` generates bilingual, crawlable plugin landing pages under `plugin/` and `en/plugin/`, plus `sitemap.xml`, `llms.txt`, and `llms-full.txt` for search and AI discovery.

The synchronizer stores stable repository metadata in `plugins-data.js`, volatile GitHub star counts in `plugin-stars.js`, keeps the original README in `readmes/`, and writes a user-facing cleaned version to `readmes-clean/`. The homepage and generated detail pages load the star snapshot at runtime. The cleaned version removes badges, GitHub workflow/contribution boilerplate and noisy navigation blocks. README files are loaded only when a plugin detail is opened, then rendered with the site's safe Markdown subset. This keeps the homepage fast while preserving project introductions, headings, links, images, lists, quotes and code blocks in the detail view.
