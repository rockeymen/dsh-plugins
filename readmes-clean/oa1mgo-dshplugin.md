# DSHPlugin

**Everything is a plugin.**

A community-built discovery index for the DeepSeek Harness plugin ecosystem.

> [!NOTE]
> DSHPlugin is an independent community project. It is not an official DeepSeek product and is not endorsed by DeepSeek.

## Why DSHPlugin?

DeepSeek Harness is intentionally extensible, but discovering useful plugins should not require searching through scattered repositories. DSHPlugin brings GitHub discovery, canonical source links, current star counts, and installable bundle metadata into one focused registry.

The project is built in public so plugin authors, DSH users, security researchers, and translators can improve the ecosystem together.

Explore the production registry at **[dshplugin.org](https://dshplugin.org)**.

## What is included

- Searchable, paginated plugin registry with direct links to canonical repositories
- English, Simplified Chinese, Japanese, Korean, and Spanish interfaces
- Light, dark, and system themes
- Cross-platform DSH installation commands
- Scheduled discovery from GitHub's [`dsh-plugin` topic](https://github.com/topics/dsh-plugin), plus [`awesome-dsh-plugins`](https://github.com/AdamPlatin123/awesome-dsh-plugins)
- GitHub star counts refreshed with every scheduled scan and used as the default ranking
- Official `dsh.bundle.patch` structure checks, canonical repository resolution, and commit-pinned install commands
- A cached same-origin catalog proxy so scheduled index updates reach the live registry without rebuilding the Worker
- D1-backed plugin submissions and abuse reports
- Cloudflare Access-protected moderation UI with server-side JWT verification

## Agent Skills

Bring the registry into an AI coding agent with two open, portable skills:

- [`find-dsh-plugins`](skills/find-dsh-plugins) performs semantic matching exclusively against the DSHPlugin catalog. It never falls back to GitHub Search, web search, or another marketplace.
- [`audit-dsh-plugin-security`](skills/audit-dsh-plugin-security) resolves a plugin through DSHPlugin first, then performs a read-only review of the cataloged repository at its indexed commit.

Each skill directory contains a standard `SKILL.md`, Codex UI metadata, and a small catalog client. The client caches one catalog download for six hours, revalidates with ETags, and returns only a short candidate set to the agent. The homepage provides a copy-ready installation prompt and a direct source link for both skills.

## Index model

The index combines two public discovery paths:

- repositories carrying the [`dsh-plugin` topic](https://github.com/topics/dsh-plugin) with a valid root `dsh.bundle.patch` declaration;
- canonical public repositories collected by [`awesome-dsh-plugins`](https://github.com/AdamPlatin123/awesome-dsh-plugins).

GitHub stars are a discovery signal, not a security or quality guarantee. DSHPlugin links to the original repository and shows installation commands only when an installable bundle structure is present.

## Architecture

```text
React + Vite registry
        │
Cloudflare Worker ── static assets and API routing
        │
Cloudflare D1 ────── submissions and reports
        │
Cloudflare Access ── /admin and /api/admin/*
```

The public source contains the application and deployment examples. Production account identifiers, Access configuration, database IDs, domains, and local secrets are deliberately excluded.

## Quick start

Requirements: Node.js 20 or newer.

```bash
git clone https://github.com/oa1mgo/dshplugin.git
cd dshplugin
npm ci
npm run dev
```

The Vite development server is enough for registry UI work. To run the complete Worker and D1 flow locally:

```bash
cp wrangler.example.jsonc wrangler.jsonc
cp .dev.vars.example .dev.vars
npm run build
npx wrangler d1 migrations apply dshplugin-moderation --local
npx wrangler dev
```

Use example values locally. Never commit `.dev.vars`, `.env` files, or your real `wrangler.jsonc`.

## Useful commands

```bash
npm test                    # catalog and localization tests
npm run build               # production frontend and Worker package
npm run test:sites          # Worker API and packaging tests
npm run verify              # complete local checks
npm run check:catalog-links # live GitHub repository validation
npm run sync:catalog        # refresh GitHub topic and Awesome DSH snapshots
```

## Deploying your own instance

DSHPlugin runs on Cloudflare Workers with a D1 binding.

1. Copy `wrangler.example.jsonc` to the ignored `wrangler.jsonc`.
2. Create your own D1 database and replace the placeholder database ID.
3. Store `ADMIN_EMAIL`, `CF_ACCESS_AUD`, and `CF_ACCESS_ISSUER` with `wrangler secret put` or in the Cloudflare dashboard—never in Git.
4. Apply the migrations in `migrations/`.
5. Protect both `/admin*` and `/api/admin/*` with your own Cloudflare Access application and allow policy.
6. Add your own routes or custom domains only in the ignored deployment configuration.
7. Run `npm run deploy`.

Every fork must use its own Cloudflare account, database, Access policy, and identity provider. The repository does not grant access to the production DSHPlugin infrastructure.

## Security

Please do not disclose vulnerabilities in a public issue. Follow [SECURITY.md](SECURITY.md) and use GitHub private vulnerability reporting.