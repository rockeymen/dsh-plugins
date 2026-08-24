![dsh.fish logo](frontend/public/icons/whale-brand.png)
  # dsh.fish
  The plugin registry for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).Discover, trust, and install plugins — from the web, the terminal, or your agent.









    ![dsh.fish catalog home page](.github/assets/home-light.png)


DeepSeek Harness is built on "everything is a plugin" but ships no registry — its
README asks authors to tag repositories with the `dsh-plugin` topic and leaves
discovery there. dsh.fish turns that topic into a searchable, multilingual
catalog with a shared, machine-executable install plan.

## Features

- **Typed catalog** — bundles, profiles, skills, MCP servers, agent presets and hook bridges, classified by probing what the harness can actually load, not by self-declared tags.
- **Transparent trust signals** — every artifact carries a public, reproducible quality score (S/A/B/C), a maintenance status, and 7d/30d star velocity. The formula is served at [`GET /api/v1/scoring`](https://dsh.fish/api/v1/scoring), not buried in a blog post.
- **Rising, not just popular** — per-sweep metrics snapshots power a `rising` sort that surfaces what is gaining stars this week.
- **One install plan, three surfaces** — the same domain-owned plan renders as a copy-pasteable command on the web, executes in the CLI, and runs inside the harness via the hub plugin. They cannot drift apart.
- **Commit-pinned provenance** — each artifact shows the exact commit it was indexed at, linked back to GitHub.
- **Community ratings from the harness** — a 1–5 scale with comments, written only from the dsh CLI or hub plugin (`dsh-fish rate`, `hub_rate`) where the rater actually used the artifact. The web renders the average, the distribution and every comment read-only, and republishes the aggregate as `aggregateRating` structured data.
- **A real API** — versioned REST endpoints plus a full-catalog snapshot with an ETag sync contract for mirrors and bots.
- **Six languages, first-class** — per-locale SSR pages and Atom feeds, hreflang and structured data on every plugin page, machine-translated READMEs, per-plugin OG cards and shields-style README badges.

## Screenshots

  ![Browsing the catalog sorted by rising](.github/assets/browse-rising-light.png)
  Browse by kind, category, popularity — or what is rising right now.
  ![A plugin detail page with score, install panel and README badge](.github/assets/plugin-detail-light.png)
  Every plugin page: quality score, install panel, commit provenance, and a copyable README badge.

## Quick start

**Browse** the catalog at **[dsh.fish](https://dsh.fish)** — search, filter by kind
and category, read the install plan, copy the command.

**Terminal** — the CLI applies the plan for you:

```sh
npx @dsh-fish/cli add <artifact-id>
```

`add` / `find` / `list` / `remove` / `update` match the [skills CLI](https://github.com/vercel-labs/skills)
vocabulary and actually write skills, MCP rows, presets and hook bridges into
`$DSH_HOME`.

**Inside the harness** — add the hub plugin once:

```sh
dsh plugin --profile web add @dsh-fish/hub
```

It registers `hub_search`, `hub_show`, `hub_install`, `hub_list`, `hub_remove`,
`hub_update` and `hub_account`, so an agent can discover and install artifacts
without leaving the session. Signing in uses the OAuth device flow.

`` is whichever profile the harness boots. A desktop build has its own:
[Local DSH](https://github.com/stvlynn/local-dsh) runs `local-dsh`, so use its
bundled launcher and name that profile.

```sh
dsh plugin --profile local-dsh add @dsh-fish/hub
```

**Publishing a plugin?** Tag your repository with the **`dsh-plugin`** topic. The
hourly crawl inspects its `package.json`, `SKILL.md` or `agent.cordis.yml` and
classifies what the harness can actually load. MCP servers and hook bridges are
declared in `package.json` as `dsh.hub.kind` with a `dsh.hub.mcp` or
`dsh.hub.hook` block — see
[docs/project/architecture.md](docs/project/architecture.md#how-a-repository-becomes-a-row)
for the manifest shape.

## What it indexes

### Kind · What it is · How it installs
- **Kind**: **Bundle** · **What it is**: npm package declaring `dsh.bundle.patch` · **How it installs**: `dsh plugin --profile  add <spec>`
- **Kind**: **Profile** · **What it is**: ordered `dsh.profile.bundles` stack · **How it installs**: one `add` per bundle, in order
- **Kind**: **Skill** · **What it is**: `SKILL.md` bundle or flat Markdown · **How it installs**: files written under `$DSH_HOME/skills`
- **Kind**: **MCP server** · **What it is**: external server declared via `dsh.hub.mcp` · **How it installs**: a `dsh-mcp-client` row in the profile patch
- **Kind**: **Agent preset** · **What it is**: directory holding one `agent.cordis.yml` · **How it installs**: written to `$DSH_HOME/.agent-presets/`
- **Kind**: **Hook bridge** · **What it is**: Claude Code / Codex bridge declared via `dsh.hub.hook` · **How it installs**: a bridge plugin row in the profile patch

## Repository layout

```
backend/    Domain-Driven Design: domain, application, infrastructure, interfaces
frontend/   Feature-Sliced Design: app, pages, widgets, features, entities, shared
packages/
  dsh-plugin-hub/   `@dsh-fish/hub` — the bundle users install into their harness
  dsh-cli/          `@dsh-fish/cli` — `npx @dsh-fish/cli add `
docs/       architecture, layer conventions, operations, ADRs
```

Both halves deploy as **one Cloudflare Worker**: Hono at `/api/*`, React Router
SSR everywhere else, D1 for the catalog, KV for sessions, and a Cron Trigger
that re-crawls every hour.

## Development

```sh
pnpm install
pnpm run dev    # http://localhost:5173
```

Quality gates: `pnpm run typecheck && pnpm run test && pnpm run test:e2e && pnpm run build`.

Deployment, bindings and secrets: [`docs/operations/deployment.md`](docs/operations/deployment.md).
Conventions and architecture: [`AGENTS.md`](AGENTS.md), [`docs/project/architecture.md`](docs/project/architecture.md), [`docs/decisions/`](docs/decisions/README.md).

## Community

- **Source and issues** — [github.com/stvlynn/dsh.fish](https://github.com/stvlynn/dsh.fish)
- **Discord** — [discord.gg/PwZDHH4mv3](https://discord.gg/PwZDHH4mv3)