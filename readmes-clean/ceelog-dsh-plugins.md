# dsh-plugins

Out-of-tree DeepSeek Harness plugins workspace.

## Plugins

### Plugin · Description · Demo
- **Plugin**: [`@opendsh/dsh-plugin-scheduled-tasks`](src/plugins/dsh-plugin-scheduled-tasks/README.md) · **Description**: Per-project scheduled tasks with prompts, executed as headless agent sessions in the project directory, with durable run history. · **Demo**: ![](./src/plugins/dsh-plugin-scheduled-tasks/docs/demo.png)
- **Plugin**: [`@opendsh/dsh-plugin-setting-mcp`](src/plugins/dsh-plugin-setting-mcp/README.md) · **Description**: Manage MCP servers from the settings panel — view, edit, remove, enable/disable — with hot reload on save. · **Demo**: ![](./src/plugins/dsh-plugin-setting-mcp/docs/demo.png)

## Workspace layout

```
src/plugins/
├── dsh-plugin-scheduled-tasks   (@opendsh/dsh-plugin-scheduled-tasks)
└── dsh-plugin-setting-mcp       (@opendsh/dsh-plugin-setting-mcp)
```

### Command · Meaning
- **Command**: `pnpm install` · **Meaning**: Install workspace tooling (TypeScript 7, Biome, …).
- **Command**: `pnpm build` · **Meaning**: Build every plugin package.
- **Command**: `pnpm test` · **Meaning**: Run every plugin's vitest suite.
- **Command**: `pnpm lint` · **Meaning**: Biome check across the workspace.

## Toolchain

- **TypeScript 7** (the native compiler) for typechecking and server emit.
- **tsdown** for the browser client bundle, wrapped in the DSH
  `window.__ModuleLoader__.load` handoff (see each plugin's
  `scripts/wrap-client.mjs`).
- **vitest** for unit tests, **Biome** for lint/format.