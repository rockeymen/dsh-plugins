# DeepSeek Harness External Migration

Safely migrate configuration signals and session history from Codex, Claude Code, Qoder (`qcoder` is accepted as an alias), and OpenCode into DeepSeek Harness.

The plugin provides three model-facing tools:

- `external_migration_scan`: read-only inventory; no transcript bodies, no returned credentials, and no writes.
- `external_migration_preview`: read-only parsing with short transcript previews.
- `external_migration_import`: requires `confirm=true`, writes native Harness sessions, and exports a reviewable configuration bundle.

Source files are never modified. Credentials are never copied. MCP secrets are replaced with environment-variable references, and generated MCP configuration is not applied automatically.

## Install

```sh
dsh plugin --profile web add /absolute/path/deepseek-harness-external-migration-0.1.0.tgz
```

The package declares a `dsh.bundle.patch`, so `dsh plugin` activates it as a profile layer. Restart the profile after installation.

Then ask Harness to scan, preview, and finally import the desired sources. The default configuration review bundle is written below `$DSH_HOME/migrations/external-agents/`.

See [README.zh-CN.md](./README.zh-CN.md) for the full support matrix, security behavior, root overrides, limitations, and examples.

## Validate

```sh
npm install
npm test
npm pack --dry-run
```

Requires DeepSeek Harness `0.1.0-rc.5` or a compatible later release and Node.js `22.19+` or `24+`.
