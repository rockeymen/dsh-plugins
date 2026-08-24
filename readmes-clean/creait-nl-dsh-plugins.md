# dsh-plugins

Plugins for [DeepSeek Harness](https://github.com/deepseek-ai). One repo, seven
packages, published independently under `@creait`. They came out of running dsh
against self-hosted models, and each closes a gap the harness leaves open.

### Package · What it does · Why
- **Package**: **[hookkit](./hookkit)**`@creait/dsh-hookkit` · **What it does**: Config-driven lifecycle hooks, **including context injection**. Declare `event → handler → outcome` in YAML. · **Why**: dsh has the seams (`agent/pre-step`, `tools/pre-execute`, …) but reaching them means writing a plugin. This turns them into config.
- **Package**: **[gen-limit](./gen-limit)**`@creait/dsh-gen-limit` · **What it does**: Per provider/model concurrency cap, enforced at subagent spawn and at the stream, with a settings card. · **Why**: One self-hosted GPU has a real ceiling; a fan-out of subagents will find it. Denying the spawn beats letting the child die opaquely.
- **Package**: **[web-search-searxng](./web-search-searxng)**`@creait/dsh-web-search-searxng` · **What it does**: Points `web_search` at a self-hosted SearXNG instance instead of the native route. · **Why**: Search without handing every query to a third party.
- **Package**: **[web-fetch](./web-fetch)**`@creait/dsh-web-fetch` · **What it does**: A guarded local fetch provider behind `ctx.web`, with SSRF blocking on the resolved address. · **Why**: dsh implements `web_fetch` in full but ships no provider, so the tool is present and every call fails.
- **Package**: **[research-mode](./research-mode)**`@creait/dsh-research-mode` · **What it does**: Deep research as an agent **mode**: a fixed, reviewed loop that plans, researches in adaptive parallel rounds, synthesises and reviews. · **Why**: A loop the model rewrites per call re-earns the same mistakes per call. Shipping it as a preset also keeps it out of every session that is not research.
- **Package**: **[think-level](./think-level)**`@creait/dsh-think-level` · **What it does**: A reasoning effort per provider and model, plus one control to change it for the session you are in. · **Why**: dsh's effort dropdown is per session and remembered nowhere, so "this model should think hard" is re-typed in every new conversation. Subagents are never asked at all.
- **Package**: **[tool-disclosure](./tool-disclosure)**`@creait/dsh-tool-disclosure` · **What it does**: Progressive tool disclosure: a deferred group of tools costs one catalog line until the model loads it with `tool_search`. · **Why**: dsh advertises every mounted tool on every request. An MCP server's 24 browser schemas are ~4.4k tokens charged to every session, including the ones that never open a browser.

hookkit is the general-purpose one: a small engine that ships **no hooks of its
own** — 13 lifecycle events × 3 handler kinds (in-process tool, shell, HTTP) ×
3 outcomes (inject context, deny the call, fire-and-forget). It is what makes
something like memory recall a config change rather than a plugin. The rest are
single-purpose. web-search-searxng and web-fetch are both providers for the same
`ctx.web` seam and compose: together they give an agent search and page reading
without a third-party round trip. research-mode wants web-fetch mounted —
without it, its researchers are capped at search snippets.

## Install

Each package installs on its own — you do not need the others:

```sh
dsh plugin --profile web add @creait/dsh-hookkit
```

Every package ships its own bundle patch, so that command mounts the row rather
than only recording the dependency. Mounting is not the same as switching on:
the two `ctx.web` providers register themselves and then wait to be pointed at
something, and hookkit mounts with no hooks declared. Each README says which
keys finish the job.

## Develop

The packages resolve their dsh peer dependencies from the harness you have
installed, not from the registry, so you are always building against the
version you actually run:

```sh
DSH="$(npm root -g)/@deepseek-ai/dsh/node_modules/@deepseek-ai"
mkdir -p node_modules/@deepseek-ai
for p in cordis dsh-llm dsh-settings dsh-web schemastery; do
  ln -sfn "$DSH/$p" "node_modules/@deepseek-ai/$p"
done
```

Then:

```sh
pnpm test        # 531 tests across the seven packages
```

Do not run `pnpm install` at the root — it would replace those symlinks with
published copies that may not match your harness.

To run a checkout against a live harness, link the package directory into a
profile:

```jsonc
// ~/.dsh/profiles/web/package.json
"dependencies": {
  "@creait/dsh-hookkit": "link:/path/to/dsh-plugins/hookkit"
}
```

then `pnpm install` in the profile and restart `dsh web`. The boot manifest is
built at startup, so adding a plugin needs the restart — editing a linked one
does not.

## Release

Versions are independent; publish only what changed:

```sh
cd hookkit && npm publish --access public
```

`pnpm publish-all` does every package that has a new version. Scoped packages
default to restricted, so `--access public` matters on a package's first
publish.

## Caveat

All seven bind to pre-1.0 internal dsh seams with no compatibility guarantee.
`peerDependencies` pins the versions each was built against; a harness upgrade
can move them. Each README has a "What breaks this" section.