# Catalog data contract

## Files

- `plugins-data.js`: generated JavaScript assignment, `const plugins = [...]`.
- `plugin-stars.js`: volatile star snapshot, `const pluginStars = {"<id>": <stars>, ...}`. This is the only scheduled-refresh file that stores stars.
- `plugin-star-history.js`: compact star history, `const pluginStarHistory = {version, baseline, snapshots}`. `baseline.stars` is one complete starting snapshot; each dated item in `snapshots` stores only IDs whose star count changed since the previous snapshot.
- `readmes/<id>.md`: untouched upstream README snapshot.
- `readmes-clean/<id>.md`: cleaned source-language README.
- `readmes-clean/<id>.zh.md`: cleaned repository-provided Chinese README.
- `readmes-clean/<id>.translated.zh.md`: translated Chinese fallback.
- `logs/last-sync.json`: incremental sync manifest containing `newIds`, `retainedIds`, counts, and generation time.

Never replace the raw README with a cleaned or translated copy. The raw snapshot is evidence for future reprocessing.

## Required record fields

Identity and discovery:

- `id`: stable lowercase owner-repository slug.
- `name`: exact GitHub repository name.
- `owner`: exact GitHub owner login.
- `repo`: canonical GitHub repository URL.
- `topics`: GitHub topics.
- `category`: one of `skills`, `tools`, `model-adapters`, `enterprise`, `productivity`, `devops`, `themes`.

Localized presentation:

- `displayNameZh`, `displayNameEn`: card/detail display names. Never overwrite `name`.
- `summaryZh`, `summaryEn`: concise project summaries.
- `description`: current Chinese summary used by the site.
- `descriptionEn`: curated English summary used by the site; it must contain English prose only.

README routing:

- `readmeRawPath`: upstream snapshot.
- `readmeCleanPath`: cleaned source README.
- `readmeZhPath`: repository Chinese file or translated fallback.
- `readmeZhSource`: `repository` or `translated`.
- `readmeHasChinese`: whether upstream content contains meaningful Chinese.
- `readmeBase`: raw-content base URL used to resolve relative assets.

Repository metadata:

- `forks`, `updated`, `createdAt`, `pushedAt`, `defaultBranch`.
- `homepage`, `language`, `license`.
- `command`: generated DSH install command.
- `icon`, `tone`: stable directory presentation tokens.

## Invariants

- Keep one record per canonical repository URL and one unique `id` per record.
- Do not admit a new repository from the `dsh-plugin` topic unless its name, description, supporting topics, or README explicitly mentions DeepSeek Harness, `dsh`, or the official `@deepseek-ai/dsh` package.
- Preserve repository names and factual metadata exactly.
- Never show Chinese and English README bodies simultaneously.
- English list metadata must receive the same editorial treatment as Chinese metadata. Never derive `displayNameEn` from a slogan, release line, warning, license heading, navigation label, or arbitrary first README sentence.
- Set `readmeZhSource=repository` only for upstream Chinese content.
- Set `readmeZhSource=translated` only for generated fallback content.
- Keep all seven categories represented; investigate rule regressions rather than fabricating entries.
- Treat stars as ranking signals, not editorial ratings or claims of quality.
- Keep stars out of `plugins-data.js`; join `pluginStars[id]` into records only at runtime or generation time.
- On scheduled refreshes with no new repositories, update only `plugin-stars.js` and, when values changed, `plugin-star-history.js`. Do not rewrite `plugins-data.js`, README files, localized metadata, SEO pages, `llms.txt`, or `llms-full.txt`.
- Keep star-history dates in ascending `YYYY-MM-DD` UTC order. Store at most one snapshot per date and at most 104 delta snapshots. The reconstructed latest history state must equal `plugin-stars.js`.
- When admitting a new ID, seed its current value into `baseline.stars` and omit it from the same run's delta. Trending growth must represent change between observed refreshes, not the repository's lifetime stars at admission.
- Generate details only for new IDs. Write `logs/last-sync.json` only when new IDs need downstream editorial processing.
- Retain records that disappear from the current ranked list unless the user explicitly requests removal.
- Form each scheduled candidate set from the deduplicated union of the 500 highest-starred and 300 most recently updated `dsh-plugin` repositories. Existing records in either list receive star-only updates; only new, repository-verified records enter the editorial pipeline.
