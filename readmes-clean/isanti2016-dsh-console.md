# dsh-console

Console commands for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): manage the web service, the SSH tunnel, one-shot questions, and an optional console TUI — straight from the slash-command plane.

## Quick start

```sh
# 1. install the bundle
dsh plugin --profile web add dsh-console

# 2. restart dsh web, then use the commands
/web status
/tunnel status
```

Out of the box, `/web` and `/tunnel status` work with zero config (the plugin auto-detects the running dsh entry). Configure the tunnel host and the console TUI path in the profile's `cordis.patch.yml`:

```yaml
- id: dsh-console
  config:
    tunnelHost: '192.168.1.100'        # your SSH server
    tunnelUser: 'root'
    tunnelKey: 'C:\\Users\\you\\.ssh\\id_rsa'
    consoleCommand: 'python C:\\tools\\dsh-tui\\main.py'
```

Then `dsh plugin --profile web` again + restart, and `/tunnel start` / `/console` are live.

## Commands

### Command · Description
- **Command**: `/web status` · **Description**: Is the web UI up? (port + PID)
- **Command**: `/web start` · **Description**: Background-start the web UI (`node <dshBin> web --port <webPort>`)
- **Command**: `/web stop` · **Description**: Stop the web UI process
- **Command**: `/web restart` · **Description**: Restart it
- **Command**: `/tunnel status` · **Description**: Is the SSH tunnel up?
- **Command**: `/tunnel start` · **Description**: Start the SSH tunnel (needs `tunnelHost`)
- **Command**: `/tunnel stop` · **Description**: Stop the tunnel
- **Command**: `/ask <问题>` · **Description**: One-shot question through the headless profile (timeout-bounded)
- **Command**: `/console` · **Description**: Launch the console TUI (needs `consoleCommand`)

## Configuration

All keys carry sensible defaults; set them in the profile's `cordis.patch.yml` (or a `--patch` overlay), overriding the row this bundle adds:

```yaml
- id: dsh-console
  config:
    webPort: 3080            # dsh web UI port
    dshBin: ''               # path to apps/cli/lib/bin.js; empty = auto-detect
    tunnelHost: '192.168.1.100'
    tunnelUser: 'root'
    tunnelKey: 'C:\\Users\\you\\.ssh\\id_rsa'
    tunnelLocalPort: 3081
    tunnelRemotePort: 3080
    askTimeout: 150
    consoleCommand: 'python C:\\tools\\dsh-tui\\main.py'
```

### Key · Default · Meaning
- **Key**: `webPort` · **Default**: `3080` · **Meaning**: The dsh web UI listens on `127.0.0.1:3080` by default; `/web start` spawns it there.
- **Key**: `dshBin` · **Default**: auto · **Meaning**: Absolute path to your checkout's `apps/cli/lib/bin.js`. Empty = detected from the running process (`process.argv[1]`), so a from-source `dsh` usually needs no config.
- **Key**: `tunnelHost` · **Default**: `''` · **Meaning**: SSH server host. Empty disables `/tunnel start`.
- **Key**: `tunnelUser` · **Default**: `root` · **Meaning**: SSH user on the server.
- **Key**: `tunnelKey` · **Default**: `''` · **Meaning**: Absolute path to your SSH private key (`-i`). Omit for agent/other auth.
- **Key**: `tunnelLocalPort` · **Default**: `3081` · **Meaning**: Local listen port of the tunnel (`127.0.0.1:3081`).
- **Key**: `tunnelRemotePort` · **Default**: `3080` · **Meaning**: Remote port the tunnel forwards to (`127.0.0.1:3080` on the server).
- **Key**: `askTimeout` · **Default**: `150` · **Meaning**: Seconds before `/ask` is killed.
- **Key**: `consoleCommand` · **Default**: `''` · **Meaning**: Shell command launching your console TUI.

### How the tunnel is wired

```
your machine                     SSH server (tunnelHost)
127.0.0.1:3081  ──ssh -L──▶  127.0.0.1:3080
   ▲                               ▲
   │  /tunnel start binds here     │  dsh web runs here (or any service)
```

`/tunnel start` runs `ssh -N -L <tunnelLocalPort>:127.0.0.1:<tunnelRemotePort> <tunnelUser>@<tunnelHost>` (with `-i <tunnelKey>` when set) as a detached process. `/tunnel stop` finds and kills the listener on `tunnelLocalPort`.

### Typical setups

- **Local launcher (CLI/headless profile)** — manage the web UI from a terminal:
  `/web start` → open `http://127.0.0.1:3080`; `/web stop` → stop it.
- **Remote web (this machine reaches another host)** — point `tunnelHost` at the remote, browse `http://127.0.0.1:<tunnelLocalPort>`.
- **In the web profile itself** — `/web status` and `/tunnel status` are safe; `/web stop|restart` kill the process serving the current UI — manage deliberately.

## Security notes

- `/web stop` / `/web restart` kill the process serving the current UI when run from the web profile.
- `/tunnel start` runs `ssh` with your configured key — only configure keys from sources you trust.
- `/ask` runs the headless profile and consumes model quota; results are rendered by the command plane and never enter model history.

## Development

```sh
npm test          # node test of the backend primitives (read-only)
pnpm pack         # build the installable tarball
```

The bundle has no build step: plain ESM, ships `index.js` + `lib/` + `cordis.patch.yml`.