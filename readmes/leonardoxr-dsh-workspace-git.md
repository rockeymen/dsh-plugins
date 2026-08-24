# dsh-workspace-git

Add a DeepSeek Harness workspace directly from a Git URL.

The plugin extends Harness's existing **Add workspace** flow. Opening it shows two tabs:

- **Existing folder** — choose a folder normally or enter its absolute path.
- **Clone Git repository** — enter the Git URL, existing parent folder, and new repository folder name.

The host runs `git clone` without a shell and hands the completed path back to Harness's standard workspace creation flow. Cloning happens in a private staging directory, so a failed clone never removes or overwrites an existing destination.

## Requirements

- DeepSeek Harness `0.1.1-rc.2` or a compatible release
- Node.js 22+
- `git` available on the Harness host's `PATH`

## Install from a checkout

```sh
pnpm install
pnpm pack
dsh plugin --profile default add /absolute/path/to/dsh-workspace-git-0.1.1.tgz
```

With Harness `0.1.1-rc.2` on Windows, a local package path containing spaces may be split while it is forwarded to pnpm. If necessary, copy the tarball to a space-free path such as `$env:TEMP\dsh-workspace-git-0.1.1.tgz` before running `dsh plugin add`.

Restart `dsh web` with that profile and refresh the Web UI. Client package metadata is scanned at startup, so installing the package while the GUI is running is not enough.

## Install from Git

This package follows the [official Harness plugin packaging guide](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/) and includes the `prepare` script required for a Git install:

```sh
dsh plugin --profile default add github:YOUR_ORG/dsh-workspace-git#COMMIT_SHA
```

pnpm 10 blocks dependency build scripts by default. If the first install asks for build approval, add the exact package key it reports to the profile's `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  dsh-workspace-git: true
```

Then repeat the install. Only allow and pin code you trust: `prepare` executes during installation.

## Configuration

Both fields are available in **Settings → Plugins → Git workspaces**. Changes are staged until Save, persist through DSH Settings, and take effect after DSH Web restarts. The profile row remains the base configuration beneath saved user overrides.

The bundle adds one `workspace-git` row. Override it in the profile patch to tune that base configuration:

```yaml
- insert:
    - id: workspace-git
      name: dsh-workspace-git
      config:
        timeoutMs: 600000
        maxOutputBytes: 65536
```

- `timeoutMs` — clone timeout; default 10 minutes, range 1 second–60 minutes.
- `maxOutputBytes` — maximum captured Git output returned on failure; default 64 KiB, range 1 KiB–64 MiB.

Interactive Git prompts are disabled so a request cannot hang waiting for terminal input. SSH agents and configured credential helpers still work. The clone route accepts same-origin JSON requests only in normal browser operation.

## Development

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

The package is dual-face:

- `src/index.ts` is the Host Cordis plugin and clone endpoint;
- `src/client/index.ts` occupies the two standard Add workspace directory-flow slots with the tabbed folder/Git dialog;
- `package.json#dsh.client` and the `./client` export let Harness discover `lib/client.js`;
- `cordis.patch.yml` enrolls the package in a profile.

For the complete browser integration, install or link the built package into a profile. A source-only `--patch` row loads only the Host half because the client-module registry discovers browser bundles from package manifests.
