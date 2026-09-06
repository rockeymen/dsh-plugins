# dsh-pr-checks

[DSH](https://github.com/deepseek-ai/deepseek-harness) plugin (host + web client) that shows, in the sidebar footer, the **status and progress of the checks** (GitHub Actions) of the open PRs, grouped by **Workspace → Project → PR**.

- Progress bar per PR (`done/total`), colored dots per check (tooltip with the name) and a "PR checks" header.
- Only PRs with checks **still running** (`IN_PROGRESS`/`QUEUED`/`PENDING`) are shown: when they finish, the PR drops out of the list — and with nothing running, the whole widget **hides** (it comes back when a check starts running again).
- Hidden when the sidebar is collapsed.
- **Durable**: complete profile plugin, no patch to the DSH runtime files — survives DSH updates.

## Installation

The package is a DSH **bundle** (manifest `dsh.bundle`): it ships its own `cordis.patch.yml` layer, so installing it also registers the plugin row. Published on npm as `dsh-pr-checks`. To install it in a profile:

```bash
dsh plugin --profile <name> add dsh-pr-checks
# or directly from the git repository:
# dsh plugin --profile <name> add github:pauloapoloni/dsh-pr-checks
```

Alternatively, install the package directly (e.g. for an existing manual setup):

```bash
cd ~/.dsh/profiles/web
npm install github:pauloapoloni/dsh-pr-checks
```

and register the entry in the profile's `cordis.patch.yml` (only needed when not using the bundle layer):

```yaml
- insert:
    - id: dsh-pr-checks
      name: dsh-pr-checks
      config:
        cacheMs: 10000            # response cache (ms)
        includeAllAuthors: false  # true = all open PRs, not only yours
```

> If you previously added the entry manually and switch to the bundle install, remove the manual insert to avoid a duplicate row.

Restart `dsh web` and reload the GUI.

> Prerequisite: `gh` CLI authenticated with `repo`/`workflow` scopes.

## Config

### Key · Default · Description
- **Key**: `cacheMs` · **Default**: `10000` · **Description**: Endpoint response cache (ms)
- **Key**: `includeAllAuthors` · **Default**: `false` · **Description**: `true` = all open PRs, not only yours
- **Key**: `authors` · **Default**: — · **Description**: Logins to filter by (default: the authenticated `gh` user)
- **Key**: `repos` · **Default**: — · **Description**: Extra repositories outside the workspaces (e.g. `["org/repo"]`)

## How it works

- **Host** (`lib/index.js`): cordis plugin exposing `GET /api/pr-checks`. It discovers the git repositories in the DSH workspaces (`~/.dsh/storages/workspace.json`), queries the open PRs via `gh pr list` and returns `{ generatedAt, workspaces: [{ id, title, projects: [{ name, repo, prs: [{ number, title, url, draft, headRefName, checks: [{name,status,conclusion}], done, total }] }] }] }`.
- **Client** (`lib/client.js`): client bundle (in the `window.__ModuleLoader__.load` format) that registers the widget into the stock `sidebar.footer.action` slot — no patch to the sidebar bundle is required. It polls `/api/pr-checks` every 30s.

Layout detail: the `sidebar.footer.action` slot is a flex row; the bundle injects a CSS rule that enables `flex-wrap` on the container's hashed class (`.hHd-Xa_footerActions`), so the widget takes the full row and the icons (e.g. the cordis panel) wrap to the next line. If a DSH update renames that class, the widget keeps rendering — just without the wrap.

## Development

- The entry is applied from `cordis.patch.yml` (config HMR). Changes to the **code** in `lib/*.js` require a `dsh web` restart (the loader does not reload already-imported modules; the client-modules registry caches resolution failures per process).