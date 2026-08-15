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

The synchronizer stores lightweight repository metadata in `plugins-data.js` and keeps each repository's original README in `readmes/`. README files are loaded only when a plugin detail is opened, then rendered with the site's safe Markdown subset. This keeps the homepage fast while preserving headings, links, images, lists, quotes and code blocks in the detail view.
