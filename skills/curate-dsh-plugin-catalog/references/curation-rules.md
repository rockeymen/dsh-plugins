# Chinese curation rules

## README source priority

1. Use an explicitly linked Chinese README from the default README.
2. Try common names including `README.zh-CN.md`, `README.zh.md`, `README.cn.md`, `README-zh.md`, `README_ZH.md`, `README_zh.md`, `README_CN.md`, `docs/lang/README_ZH.md`, and `docs/i18n/README.zh-CN.md`.
3. Reject candidate responses that are HTML pages rather than Markdown.
4. Translate the cleaned source README only when no meaningful upstream Chinese file exists.
5. Treat an upstream Chinese file with fewer than 20 meaningful CJK characters as unusable and generate a translated fallback instead.

## Translation

- Preserve fenced code, inline code, commands, URLs, Markdown link targets, repository names, and technical product terms.
- Translate prose for meaning, not word-for-word syntax.
- Keep installation commands unchanged.
- Do not translate proper nouns unless the project supplies an official localized name.
- Remove untranslated navigation fragments, HTML tags, and entities such as `&nbsp;`.
- Never represent a generated translation as repository-provided content.

## README cleaning

Remove:

- badges and workflow/build status;
- star/follow/sponsor requests;
- language switchers and duplicated navigation;
- contribution, contributor, acknowledgements, changelog, license, and star-history sections;
- empty HTML wrappers and raw GitHub-oriented markup;
- broken or decorative images that do not explain the project.

Preserve:

- project overview and positioning;
- primary capabilities and supported environments;
- meaningful screenshots with resolvable URLs and useful alt text;
- installation and basic usage;
- architecture and workflow explanations;
- limitations, compatibility notes, and security constraints;
- concise code and command examples.

Convert Markdown tables into readable titled bullet blocks if the site renderer cannot render tables reliably. Resolve relative image and link URLs against `readmeBase`.

## Summary

Write the summary for a person deciding whether to open or install the project.

- Start with what it is or what it does.
- Mention the main user benefit or environment.
- Use one or two sentences, normally 20–90 Chinese characters.
- Prefer concrete nouns and capabilities over praise.
- Do not repeat the display name merely to fill space.
- Do not say “来自 GitHub 的…”, “属于技能分类”, “优秀/强大/最佳”, or “这是一个 DSH 插件” without explaining the actual function.
- Do not infer features from the repository name alone when README evidence is available.

## Chinese display name

Use a compact project/product noun phrase, ideally 4–18 Chinese characters excluding retained technical terms.

Good patterns:

- object + product type: `架构可视化技能`, `网页搜索工具`;
- platform + capability: `DSH 模型配置器`, `Telegram 智能体中继`;
- core function + form: `跨会话记忆插件`, `用量与成本面板`;
- official brand + form: `Godot 游戏控制桥`, `腾讯会议 CLI`.

Avoid:

- full descriptive sentences;
- commands or slogans;
- “为……打造/设计的……” constructions;
- vague adjectives such as “更好的”, “强大的”, “下一代”;
- raw README headings such as “Quick start”, “Status”, or “Overview”;
- category-only labels such as “技能”, “工具”, or “插件”;
- names longer than a card can scan quickly.

If automatic extraction remains ambiguous, read the overview and feature list, then add a narrow repository-specific override. Preserve the evidence-backed summary beside the override so future refreshes remain understandable.

## English list metadata

Treat the English card title and summary as editorial content, not raw README excerpts.

- Use a compact product-style English noun phrase for `displayNameEn`; the exact GitHub repository name remains separately visible in `name`.
- Prefer an evidence-backed English GitHub description for `summaryEn` when it is clear and genuinely English.
- When the source description is Chinese, mixed-language, generic, or noisy, translate the curated Chinese name and summary into natural English.
- Reject slogans, release labels, warnings, license lines, badges, table-of-contents text, star requests, and headings such as “Features”, “Quick setup”, or “Status”.
- Keep summaries to one or two readable sentences and remove duplicated repository names from the beginning.
- Add a repository-specific bilingual override when automated extraction remains ambiguous or the project is prominent enough to merit editorial review.
- Audit both English fields for Chinese leakage, raw markup, entities, sentence-like titles, and summaries that are too short to explain the project.
