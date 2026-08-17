# dsh-config-form

One settings page for every plugin that opts in. An adopting plugin declares its fields; this plugin renders the form, stores the values, serves the browser, and enforces the route's admission check.

If Fabric's split is the analogy: dsh already ships the *Mod Menu* part — the Settings shell, the Plugins section, and the `settings.plugins.tab` slot. What was missing is *Cloth Config*: a declarative form API. That is this.

Status: **complete, verified, and packaging-ready.** One tab in Settings → Plugins: adopting plugins on the left, the selected one's form on the right. Set the LICENSE copyright holder before you publish.

## Why opt-in and not auto-discovery

The first design was a page that auto-discovered every plugin's configuration. It was measured and abandoned, because the premise did not hold.

Twelve third-party plugins were installed and inspected. **One** registers a settings namespace. Six ship their own settings page but keep configuration outside the seam — four in browser `localStorage`, the rest in files they write themselves. So `ctx.settings.describe()` sees almost nothing of the ecosystem, and a schema-driven renderer would have had ~12 official namespaces to render, which the in-tree hand-written cards already cover.

The bottleneck was never the wire allowlist (bypassing it gained exactly one namespace). It is that nobody adopted the seam — because adopting it does not, by itself, get you a page.

What the survey *did* show is demand: every plugin with a settings page hand-writes the same four things.

| Each plugin hand-rolls | What adopting this gives instead |
|---|---|
| A React form (12 of 12, including the one storing correctly) | A declaration; the renderer is shared |
| Storage — `localStorage` that is lost on cache clear, or a path that ignores `DSH_HOME` | `ctx.settings`: layered resolution, revision fencing, external-edit reload |
| An HTTP route plus its security check | One shared route with the check written once |
| Secret handling | `ctx.credentials`, values in `.credentials.yaml` |

That third row is not convenience. Of the seven surveyed plugins exposing their own route, **two check same-origin, two check loopback, none check both** — and some of those routes write files.

## Adopting it

Everything an adopting plugin writes. No React, no route, no storage, no admission check, no knowledge of the settings or credentials seams:

```ts
export const inject = ['configForm']

export function apply(ctx: Context) {
  const cfg = ctx.configForm.declare<GitSettings>(ctx, {
    id: 'demo-git',                          // becomes the settings namespace
    title: { zh: 'Git', en: 'Git' },
    groups: [
      { title: { zh: '常规', en: 'General' }, fields: [
        { kind: 'text', key: 'defaultBranch', label: { zh: '默认分支', en: 'Default branch' },
          default: 'main', pattern: '^[^\\s]+$' },
        { kind: 'boolean', key: 'signCommits', label: { zh: '签名提交', en: 'Sign commits' }, default: false },
      ] },
      { title: { zh: '高级', en: 'Advanced' }, collapsed: true, fields: [
        { kind: 'number', key: 'fetchDepth', label: { zh: '抓取深度', en: 'Fetch depth' }, default: 0, min: 0, step: 1 },
        { kind: 'select', key: 'conflictStyle', label: { zh: '冲突风格', en: 'Conflict style' },
          default: 'merge', options: [{ value: 'merge', label: 'merge' }, { value: 'diff3', label: 'diff3' }] },
      ] },
      { title: { zh: '凭据', en: 'Credentials' }, fields: [
        { kind: 'secret', key: 'token', label: { zh: '访问令牌', en: 'Access token' }, ref: 'DEMO_GIT_TOKEN' },
      ] },
    ],
  })

  cfg.get().defaultBranch                    // resolved: default → base → user
  cfg.watch(next => { /* the user saved; apply it */ })
  await cfg.secret('token')                  // resolved only at the operation boundary
}
```

The context is passed explicitly because it decides **ownership**: the settings registration and the form's row both unwind with the declaring plugin's fiber, so unloading removes the form and a hot reload can re-declare the same id.

`declare` is a hard dependency (`inject: ['configForm']`), matching Cloth Config: without the base plugin there is nowhere to render.

`base` carries a deployment layer, so a plugin with its own `cordis.yml` config passes it and a user's reset returns to the deployed value:

```ts
ctx.configForm.declare(ctx, spec, { base: { defaultBranch: config.defaultBranch }, applies: 'live' })
```

## Two properties the design guarantees

**Secrets cannot reach the settings document.** A `secret` field is compiled *out* of the schema and routed to `ctx.credentials`. The settings section therefore contains no `role('secret')` node, which is what makes the seam's incomplete redaction inapplicable: `redactSecrets` walks only `object`/`dict`/`array`, so a secret behind a `union`, `intersect`, `transform`, or `lazy` node is returned verbatim with nothing recording the miss (`TODO(settings-wire-redaction)`, `packages/settings/settings/src/redact.ts:86`). `src/redaction-guard.ts` re-walks exactly those relations and withholds values for any namespace it cannot clear — it should never fire for a compiled declaration, and stays as the guard for a future escape hatch accepting a raw schema. It also strips `meta.default` from secret nodes, closing the separate leak where a declared fallback rides the schema after values were redacted.

**A write can only touch declared value fields.** Edits travel as path ops under a revision fence, never as a whole-section replace: a page holds a partial view by construction, and rebuilding a section from it deletes what the response never carried — the defect that removed a stored `apiKey` when an editor saved `{baseURL, reasoning}` ([config-plane boundaries](../.agents/notes/implemented/architecture/2026-07-30-config-plane-boundaries.md)). An undeclared key, or a secret key, is refused before the seam is touched.

## Security

`dsh-host-webserver` applies **no TLS, auth, or origin policy**, so a route registered on it inherits none of the built-in face's enforcement. `src/admission.ts` requires all three:

1. a loopback peer address;
2. a loopback `Host` header — a rebound DNS name resolving to 127.0.0.1 fails here, which the peer check alone does not stop;
3. same-origin provenance for any state-changing method.

This follows the harness's own conclusion that reading configuration is exactly as privileged as writing it.

## HTTP face

| Request | Effect |
|---|---|
| `GET <route>/api/forms` | The list pane: one row per adopting plugin |
| `GET <route>/api/forms/<id>` | The detail pane: declaration, values, `base`/`user` layers, `revision`, secret states |
| `POST <route>/api/forms/<id>` | `{ revision, set, unset }` → fenced path-op write; answers with the re-read state |
| `PUT <route>/api/forms/<id>/secret/<key>` | `{ value }` → store through the credential seam |
| `DELETE <route>/api/forms/<id>/secret/<key>` | Remove that credential |
| `GET <route>/api/namespaces` | Audit view over EVERY namespace, adopting or not, with its redaction verdict |

Config: `route` (default `/config-form`).

## Run it

Requires a built checkout and **Node satisfying the repo's `engines` (`^22.19.0 || >=24.0.0`)**. On 22.17.x, `tsdown` resolves its config loader to `unrun` — an optional peer nobody installs — instead of Node's native TypeScript support, and `pnpm run build` fails; `NODE_OPTIONS=--experimental-strip-types` works around it, but upgrading Node is the fix. `pnpm run build`'s `build:web` step shells out to `pnpm`, so it needs `pnpm` on `PATH` even when the outer run came through corepack.

```sh
pnpm pack                                            # in this package
dsh plugin --profile web add ./dsh-config-form-0.1.0.tgz
dsh web --patch <abs-path>/cordis.dev.yml
curl http://127.0.0.1:3080/config-form/api/forms
```

**Install the tarball, not `link:`.** A `link:` install resolves through the link's
realpath, which leaves the Harness home tree, so the plugin's `@deepseek-ai/*`
imports never reach the 195 links `dsh` provisions at
`$DSH_HOME/profiles/node_modules/@deepseek-ai/` — the mechanism behind "in-box
bundle names always resolve from the dsh installation itself". Under a source
launch tsx resolves it anyway and the breakage is invisible; under the built CLI it
fails with `Cannot find package '@deepseek-ai/schemastery'`. A tarball unpacks into
`$DSH_HOME/profiles/<name>/node_modules/`, one level below those links, so it
resolves under both launches. Re-pack after each edit.

`cordis.dev.yml` names TypeScript source with an absolute **`file://` URL**: the loader hands `name` to `import()`, so on Windows a bare `G:/...` parses as a URL with scheme `g:` and fails with `ERR_UNSUPPORTED_ESM_URL_SCHEME`.

`examples/demo-git-plugin.ts` is a worked adopter that the dev overlay loads, so the page has something to list.

The service is published with `ctx.provide()` rather than as a `Service` subclass on purpose: a subclass binds this package to one `@deepseek-ai/cordis` module instance, and an out-of-tree plugin cannot guarantee it resolves the copy the host loaded — the host may run its source plane while an installed package resolves built `lib`. Every other import here is a pure function or an erased type.

## Verified

```sh
node --import tsx/esm dsh-config-form/tests/guard.check.ts    # 12 checks
node --import tsx/esm dsh-config-form/tests/dsl.check.ts      # 19 checks
node --import tsx/esm dsh-config-form/tests/client.check.ts   # 16 checks
```

The declaration language rejects, at declare time: a non-kebab-case id, no groups, a duplicate key across groups, a non-identifier key, a non-POSIX credential reference, a select with no options / repeated values / an undeclared default, and an unparseable pattern. A compiled schema omits secrets, keeps value fields, resolves defaults, and refuses an out-of-range number, an undeclared select value, and a pattern violation.

The audit clears object- and dict-nested secrets, catches a secret behind a `union` or `transform`, withholds on an unrecognized envelope, and strips a secret's fallback while preserving a non-secret's.

Exercised against the running server:

| Check | Result |
|---|---|
| Write two fields with the current revision | 200; `revision` 0 → 1; `user` layer holds exactly those two keys |
| Write with a stale revision | **409 `conflict`** |
| Write an undeclared key | **400 `undeclared-field`** |
| Write the secret key into the settings section | **400 `undeclared-field`** |
| `PUT` a secret | 200; `configured: true`, `source: file` |
| `PUT` a blank secret | **400** — a blank draft is not a removal |
| `PUT`/`DELETE` an undeclared secret | **400 `undeclared-field`** |
| Secret value present in any response | **no** |
| `settings.yaml` after both writes | `demo-git: { defaultBranch: develop, fetchDepth: 50 }` — no secret |
| `.credentials.yaml` after both writes | `DEMO_GIT_TOKEN: sk-…` |
| `DELETE` the secret, then `unset` both fields | credential removed; values back to schema defaults; `user` empty |
| `Host: evil.example.com` | **403 `host-not-loopback`** |
| `POST` with neither `Sec-Fetch-Site` nor `Origin` | **403 `cross-origin`** |

The browser half is checked in jsdom against a stubbed HTTP face: the artifact registers under its package id, declares `['slots', 'locale']`, registers exactly one `settings.plugins.tab`, lists every adopter, auto-selects the first, renders a stored value, renders a `collapsed` group as a disclosure, renders a secret as an empty write-only box leaking neither value nor reference, badges an overridden field, and — on save — posts `{revision, set, unset}` rather than a whole section.

Wiring is checked against the running server: the injected route reaches `index.html`, the plugin joins the boot graph, and `/plugins/dsh-config-form/client.js` serves the artifact.

## The browser half

`lib/client.js` is hand-written in the loader's artifact format — `window.__ModuleLoader__.load({id, factory})`, externals through the injected `require`, `React.createElement` instead of JSX — so no bundler pipeline is reproduced out of tree. `react` is a platform seed module, so it resolves through the same table.

It registers exactly ONE `settings.plugins.tab`, holding the list and the form. Not one card per adopter: that would re-scatter what this exists to unify.

The route prefix reaches the page through `webServer.tapIndex()`, because the client cannot read plugin config and the prefix is a deployment choice. Colors come only from tokens `ui-theme`'s `design-platform.css` declares — text is `--dsw-alias-label-*`; there is no `--dsw-alias-text-*`, and naming an undeclared token silently resolves to its light-mode fallback, which is how the in-tree Models editor once shipped a light-only surface under the dark theme.

**The base plugin must be installed as a package, not loaded by path.** The client scanner looks for `dsh.client` on enabled entries' PACKAGES, so an entry named by a `file://` URL loads the host half only — the browser tab simply never appears. Install the packed tarball (see above); a `link:` install additionally needs the profile on the same drive, because a cross-drive relative path does not exist and pnpm mangles the absolute form into a broken link whose only symptom is `dsh: warning: … declares no dsh.bundle`.

## Publishing

```sh
pnpm run build      # tsdown transpiles src/ -> lib/index.js; also the `prepare` hook
pnpm run check      # the three check suites
pnpm pack           # or: pnpm publish
```

The build transpiles without type checking or project references, so it is self-contained: a git install runs `prepare` with only this package's devDependencies present — no sibling monorepo, and none of the `@deepseek-ai/*` peers, whose types a dts pass would demand. `turtle-ui` is the shipped precedent. Types instead ship as source: `exports['.'].types` points at `src/index.ts`, which an adopting plugin can compile because it already has those peers.

`clean: false` in `tsdown.config.ts` is load-bearing — `lib/client.js` is the hand-written browser artifact, and the default clean would delete it.

**Verified against the packed tarball**, installed into a fresh profile and booted with the BUILT CLI under plain Node (no tsx), which is what a user actually runs:

| Check | Result |
|---|---|
| `dsh plugin add <tarball>` | appends `dsh-config-form` to `dsh.profile.bundles` |
| `GET /api/forms` | 200, lists the adopter |
| `GET /api/forms/<id>` | values resolved, secret reported unconfigured/writable |
| `index.html` | carries the injected route |
| `/plugins/dsh-config-form/client.js` | 200 |
| `POST` a field | lands; `user` layer holds only that key |
| `pnpm publish --dry-run` | runs `prepare`, resolves `dsh-config-form@0.1.0` |

The tarball contains `LICENSE`, `README.md`, `cordis.patch.yml`, `lib/{index,client}.js`, `package.json`, and `src/*.ts` — no tests, examples, or build config.

`publint` reports one warning: `exports['./client']` is CJS-shaped while `"type": "module"` makes it ESM. It is a false positive for this artifact class. `lib/client.js` is never imported — the Node half resolves that export to a PATH and serves the file, and the browser loads it as a classic script through `window.__ModuleLoader__`. Renaming it `.cjs` would diverge from every in-tree and third-party client artifact.

## Next

1. **Field types beyond the five.** Arrays of objects and dictionaries are the obvious gaps; add an escape hatch accepting a raw schemastery node for exotic cases, at which point the redaction audit stops being belt-and-braces.
2. **Per-field validation messages.** A rejected save reports the Host's first message; mapping it onto the offending control is unstarted.
3. **Adopters.** A base plugin's value is its adopters, and today there is one demo. The pitch to the six surveyed plugins that hand-wrote a settings page is that adopting deletes their React bundle, their storage, their route, and their security check.

## Found while building this

Two upstream defects worth reporting:

- **`dsh plugin` breaks on a BOM.** `readProfileManifest` (`packages/boot/app-boot/src/profile.ts:272`) calls `JSON.parse` without stripping a UTF-8 BOM, so one dependency shipping a BOM-prefixed `package.json` fails the whole command. `dsh-mcp-manager` ships one; Node and npm both tolerate it. One-line fix.
- **`dsh-global-rules` ignores `DSH_HOME`.** It resolves `join(homedir(), '.dsh', 'AGENTS.md')` and never reads `DSH_HOME`, so it edits the real home no matter how the harness was pointed. `dsh-myrules`, `dsh-plugin-toggle`, and `dsh-mcp-manager` all read it.
