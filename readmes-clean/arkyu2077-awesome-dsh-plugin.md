![dshplugin.dev logo](https://dshplugin.dev/assets/dsh-plugin-icon-192.png)

# Awesome DSH Plugin

A user handbook and plugin navigator for DeepSeek Harness.

  English ·

Understand what a plugin does and what access it needs, then open its complete page on [dshplugin.dev](https://dshplugin.dev/). You can also click the logo above to visit the website.

## What this handbook is for

DeepSeek Harness, or DSH, follows an “Everything is a Plugin” model. Community plugins can add development tools, automation, browser interaction, interface design, session management, model integrations, security controls, and storage.

This repository is written for people who want to use those products. It is not an API reference, architecture guide, or plugin-development manual. It helps you answer four practical questions:

1. Which kind of plugin matches my goal?
2. What should I inspect before installation?
3. Where can I find the latest plugin information?
4. What should I do when permissions or compatibility cause problems?

Every published plugin name opens an internal `dshplugin.dev` detail page. The repository also keeps the complete 1,488-record discovery snapshot visible, including candidates and records withheld from publication. Only the 87-page public baseline verified on 2026-08-17 receives a detail-page link, so visibility is never confused with publication or recommendation.

> [!IMPORTANT]
> `dshplugin.dev` is an independent community directory. It is not an official DeepSeek website, and a listing is not an endorsement by DeepSeek or the publisher. A public repository, star count, or recent update does not prove safety, compatibility, or maintenance quality.

## Start here

### What you want to do · Recommended page
- **What you want to do**: Search by plugin name or use case · **Recommended page**: [Complete plugin directory](https://dshplugin.dev/)
- **What you want to do**: Install a DSH plugin for the first time · **Recommended page**: [Installation and verification guide](https://dshplugin.dev/guides/install-deepseek-harness-plugins)
- **What you want to do**: See projects newly admitted to the public catalog · **Recommended page**: [New releases](https://dshplugin.dev/collections/new-releases)
- **What you want to do**: Find projects with recent source updates · **Recommended page**: [Recently updated](https://dshplugin.dev/collections/recently-updated)
- **What you want to do**: Use GitHub stars as an initial signal · **Recommended page**: [Most starred](https://dshplugin.dev/collections/most-starred)
- **What you want to do**: Browse the work of an author or team · **Recommended page**: [Publisher directory](https://dshplugin.dev/publishers)
- **What you want to do**: Understand inclusion and correction rules · **Recommended page**: [Editorial policy](https://dshplugin.dev/editorial-policy)
- **What you want to do**: Review ecosystem size and category trends · **Recommended page**: [Ecosystem report](https://dshplugin.dev/reports/deepseek-harness-plugin-ecosystem)

## Complete ecosystem inventory

Nothing in the 2026-08-17 snapshot is hidden. Open the [complete inventory](inventory/README.md) to browse all **1,488 records** by publication status:

### Inventory · Records · What you can do
- **Inventory**: Published · **Records**: 87 · **What you can do**: Open the plugin's complete product page on `dshplugin.dev`.
- **Inventory**: Candidate · **Records**: 1,166 · **What you can do**: Review the name, category, summary, language, and license while human publication review is pending.
- **Inventory**: Quarantined · **Records**: 216 · **What you can do**: See records kept for audit because the available evidence is incomplete.
- **Inventory**: Rejected · **Records**: 19 · **What you can do**: See records that failed a hard publication gate.

Candidate, quarantined, and rejected names are deliberately not linked to individual website pages because they are not part of the controlled public baseline. Some transitional URLs may still resolve while website cleanup is in progress. This keeps the full collected inventory visible without treating unstable pages as published destinations.

## Choose by use case

The category files below are the clickable 87-page public catalog. The [complete inventory](inventory/README.md) separately exposes all 1,488 collected records without treating every discovery as published.

### Category · Use it when you need · Snapshot · Complete catalog
- **Category**: Developer Tools · **Use it when you need**: Code, terminal, file, debugging, API, or local-workflow improvements · **Snapshot**: 46 · **Complete catalog**: [Browse baseline](catalog/developer-tools.md)
- **Category**: Automation · **Use it when you need**: Repeatable tasks, agent coordination, orchestration, or integrations · **Snapshot**: 10 · **Complete catalog**: [Browse baseline](catalog/automation.md)
- **Category**: Browser · **Use it when you need**: Navigation, research, extraction, testing, or browser bridges · **Snapshot**: 9 · **Complete catalog**: [Browse baseline](catalog/browser.md)
- **Category**: UI & Design · **Use it when you need**: Interfaces, themes, visualization, design, or preview workflows · **Snapshot**: 6 · **Complete catalog**: [Browse baseline](catalog/ui-design.md)
- **Category**: Models · **Use it when you need**: Model adapters, routing, fallback, or inference providers · **Snapshot**: 2 · **Complete catalog**: [Browse baseline](catalog/models.md)
- **Category**: Sessions · **Use it when you need**: History, memory, context, summaries, or conversation workflows · **Snapshot**: 9 · **Complete catalog**: [Browse baseline](catalog/sessions.md)
- **Category**: Security · **Use it when you need**: Permissions, sandboxing, policy, secrets, or defensive controls · **Snapshot**: 5 · **Complete catalog**: [Browse baseline](catalog/security.md)
- **Category**: Storage · **Use it when you need**: Persistence, databases, caches, or artifact storage · **Snapshot**: 0 · **Complete catalog**: [Baseline status](catalog/storage.md)

## How publication status works

Discovery and publication are separate decisions. Automated crawling can identify a project, but it cannot promote that project into this public catalog.

### Status · What it means for users
- **Status**: Public baseline · **What it means for users**: The historical cohort verified as indexed in Search Console. It is linked here to preserve stable URLs, but this does not prove a fresh manual review or safety certification.
- **Status**: Candidate · **What it means for users**: Passed initial automated checks and is waiting for human review. It is visible in the complete inventory but has no detail-page link.
- **Status**: Quarantined · **What it means for users**: Evidence is incomplete or does not yet establish a substantive DSH plugin. It is visible for audit but remains outside the public catalog.
- **Status**: Rejected · **What it means for users**: Archived, inaccessible, empty, or otherwise failed a hard gate. It remains visible in the audit inventory but should not be revived by a later crawl.

The wider ecosystem report can contain discovery and audit totals that are larger than this catalog. That difference is intentional: quality and stable indexation take priority over publishing every discovered repository.

Live website categories:

- [Developer Tools](https://dshplugin.dev/categories/developer-tools)
- [Automation](https://dshplugin.dev/categories/automation)
- [Browser](https://dshplugin.dev/categories/browser)
- [UI & Design](https://dshplugin.dev/categories/ui-design)
- [Models](https://dshplugin.dev/categories/models)
- [Sessions](https://dshplugin.dev/categories/sessions)
- [Security](https://dshplugin.dev/categories/security)
- [Storage](https://dshplugin.dev/categories/storage)

## A safer way to use community plugins

### 1. Run the base Harness first

For a first run, start the official Web UI with:

```sh
npx @deepseek-ai/dsh web
```

The documented default address is `http://127.0.0.1:3080`. Confirm that the base product works before adding third-party code. This gives you a clean baseline when something later fails.

### 2. Review the website detail page

Before installing, check:

- whether the plugin solves the problem you actually have;
- whether the complete install command comes from current publisher documentation;
- the intended profile, DSH version, operating system, and prerequisites;
- the latest update, open issues, and maintenance notes;
- whether the license fits personal, team, or commercial use;
- external services, accounts, secrets, or paid APIs it requires;
- screenshots, demos, or reproducible output supporting its claims.

### 3. Inspect permissions before granting them

A plugin is third-party code. Pause and read the source and publisher explanation if it can:

- read or write local files, or execute terminal commands;
- control a browser, inspect pages, or use an authenticated session;
- access the network, upload content, or call external APIs;
- read environment variables, credentials, sessions, or chat history;
- change model routing, approval policy, or security settings.

If a detail page has no install command or permission explanation, treat it as informational. Do not invent a command from the repository name.

### 4. Verify one capability at a time

1. Keep the publisher's profile, branch, tag, and version information intact.
2. Refresh or restart the intended profile and check for load or approval errors.
3. Run the smallest reversible example in the documentation.
4. Grant only the permissions the advertised capability needs.
5. Record the repository and installed revision so you can reproduce or reverse the change.

## How to compare two plugins

Do not use star count alone.

### Dimension · Question to ask
- **Dimension**: Need fit · **Question to ask**: Does the plugin solve your exact problem, or does it only mention DSH?
- **Dimension**: Installation clarity · **Question to ask**: Does it provide a complete command, target profile, and prerequisites?
- **Dimension**: Compatibility · **Question to ask**: Does it name supported DSH versions, systems, and known limitations?
- **Dimension**: Permission scope · **Question to ask**: Are requested capabilities proportional to the feature?
- **Dimension**: Verifiable evidence · **Question to ask**: Is there a screenshot, demo, sample output, or test procedure?
- **Dimension**: Maintenance · **Question to ask**: Are updates recent, issues answered, and breaking changes documented?
- **Dimension**: License · **Question to ask**: Can you use it in your personal, team, or commercial setting?
- **Dimension**: Exit path · **Question to ask**: Can you disable, remove, or roll it back cleanly?

## Troubleshooting

### The plugin does not appear after installation

Recheck the profile, package name, branch, or tag. Then inspect the Harness interface and publisher issues for a load error. Avoid installing several new plugins at once, because that makes the failing change harder to isolate.

### It stopped working after an update

DeepSeek Harness is still changing quickly, and the official project warns about compatibility-breaking changes. Compare the Harness version, the plugin's last update, and the publisher's compatibility notes. Return to a recorded working version when necessary.

### It requests broad access

Stop before approving it. Confirm that each permission is directly connected to the feature, then inspect the source, rationale, and issue history. Unexplained file, browser, network, or secret access should not be granted.

### Does a listing mean the plugin is recommended or certified?

No. A listing means the directory found and normalized public-source information. It is not a security audit, compatibility certificate, quality guarantee, or official recommendation.

## Data scope and updates

- Snapshot date: 2026-08-17
- Complete discovery snapshot visible in this repository: 1,488 records
- Controlled public baseline in this repository: 87 plugin pages
- Publication review queues: 1,166 candidates, 216 quarantined, and 19 rejected
- Categories represented in the baseline: 7, plus an empty Storage status page
- Sources: public GitHub repositories, npm metadata, and publisher pages
- Live status: [Ecosystem report](https://dshplugin.dev/reports/deepseek-harness-plugin-ecosystem)
- Inclusion method: [Editorial policy](https://dshplugin.dev/editorial-policy)

Plugin names, descriptions, licenses, and activity can change. The complete inventory preserves the audit snapshot; the category files remain the controlled clickable catalog. For a published plugin, use its website detail page and publisher source to verify current status.

## Submit or correct a listing

Plugin authors can publish a clear public repository, add the `dsh-plugin` GitHub topic, and follow the [submission guide](https://dshplugin.dev/submit). Discovery creates a review candidate; it does not automatically publish a listing.

For a correction or missing project, provide public-source evidence through the [contact page](https://dshplugin.dev/contact) or a repository issue. See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution rules.

## Independent status

This repository and [dshplugin.dev](https://dshplugin.dev/) are independent community projects. They are not affiliated with DeepSeek and are not endorsed by DeepSeek or any listed publisher. DeepSeek, DeepSeek Harness, plugin names, logos, and trademarks belong to their respective owners.