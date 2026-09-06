# Agent Sidecar

[Latest release](https://github.com/shendeguize/AgentSideCar/releases/latest) ·
[Website/demo](https://shendeguize.github.io/AgentSideCar/)

Agent Sidecar is a local-first CLI for observing AI-agent sessions. It
discovers persisted session metadata, infers lifecycle state, follows
normalized events, and presents the result as text, JSON, or a terminal
dashboard. It can also aggregate read-only `list` and `status` snapshots over
SSH, concurrently follow local and remote events, and, when explicitly
authorized, start an experimental local headless resume to send a message. An
optional HTTP panel and API expose read-only daemon data on local IPv4 loopback.

The observation commands do not edit agent transcripts, configuration, or
hooks. `send` is a separate mutating boundary: the resumed native agent may
contact its provider, run tools, and modify agent-owned state. The daemon writes
its own socket and PID file, bounded ephemeral private temporary snapshots, and
rotating private diagnostics. Only when HTTP is explicitly enabled does it also
retain a private `http.token` and own a transient `http.port` record while
running. Send-audit files are written by the mutating CLI `send` path, not by
daemon observation. Those daemon and audit bookkeeping files do not themselves
edit transcripts or agent configuration; a resumed native agent can do so as
described above. The release installer writes only the selected executable and
optional skill bundle; the checkout installer creates integration symlinks.

Local installation and tooling for version 0.6.0 require Python 3.9+ and have
no runtime Python dependencies. The remote observation payload accepts Python
3.8+ on SSH targets. DSH event watching additionally requires an external
`zstd` executable.

## Version 0.6.0

Version 0.6.0 provides concurrent local/remote `watch --all --remote`, durable
private send auditing and request-ID idempotency, and the opt-in
numeric-loopback HTTP panel. It also includes a deterministic executable
zipapp, package metadata suitable for `pipx`, an explicit macOS user
LaunchAgent, bounded private daemon diagnostics with log rotation, immutable
private status snapshots, and recoverable serialized release installation.
New in 0.6.0 are exact Kimi Code 0.38.0 protected ACP resume, composite
session binding for `send`, bounded DSH durable discovery and cold-resume
injection, and the native dsh Agent Center plugin 0.3.0 with filtering,
timeline observability, and accessible modal navigation.

![Agent Sidecar read-only panel showing synthetic sessions and events](site/assets/shots/panel.png)

## Support matrix

### Environment · Support boundary
- **Environment**: macOS · **Support boundary**: Primary platform and full quality-gate target. Local observation, remote monitoring, the daemon and HTTP panel, deterministic zipapps, experimental local `send`, and the user LaunchAgent are supported.
- **Environment**: Linux · **Support boundary**: Portable observation, remote monitoring, daemon/HTTP, TUI, and packaging paths are exercised in CI. The macOS LaunchAgent is unavailable, and experimental `send` fails closed before execution because its required Darwin `kqueue` descendant containment is unavailable. Linux support is best-effort where agent-owned persistence formats or desktop integrations differ.
- **Environment**: Windows · **Support boundary**: Unsupported. The current runtime and security contracts require POSIX permissions, file locking, process groups, Unix sockets, and related primitives.
- **Environment**: Python · **Support boundary**: Local installation and tooling require Python 3.9 or newer; the remote observation payload accepts Python 3.8 or newer on SSH targets. CI exercises the local product on Python 3.9 and 3.13; Agent Sidecar has zero runtime Python dependencies.

Support for an operating system does not imply support for every observed
agent on that system. The source-specific boundaries below and the mutating
`send` restrictions remain authoritative.

## Supported local sources

The agent names below are also the exact values accepted by `list --agent`:

- `cursor-ide`: Cursor IDE JSONL transcripts and associated terminal metadata.
  Session discovery, inferred status, event watching, and known subagent
  relationships are supported.
- `cursor-cli`: Cursor CLI `store.db` and its WAL are normally copied into
  bounded private temporary snapshots before decoding. A metadata fallback may
  instead open the live main database with SQLite `mode=ro&immutable=1`; that
  fallback does not read the WAL or take SQLite locks. Discovery, inferred
  status, history replay, and new normalized events are supported.
- `claude`: Claude Code project JSONL transcripts, including known sidechain
  and subagent relationships.
- `codex`: Codex CLI rollout JSONL plus read-only native status SQLite when
  available.
- `copilot`: GitHub Copilot CLI `workspace.yaml` metadata only. It has no event
  source in v0.6.0 and is reported as `idle`.
- `dsh`: DeepSeek DSH projection-cache metadata for listing and status, with
  bounded durable-session discovery as a fallback for cache-missing headless
  runs, plus compressed transcript events for watching. `DSH_HOME` selects an
  independent absolute DSH storage root. Cache-backed listing and status work
  without `zstd`; durable fallback discovery and watching require it. Durable
  fallback binds regular transcript files before decoding, requires canonical
  top-level metadata with a nonempty absolute `cwd`, and fails closed on an
  incomplete 4,096-entry scan or duplicate session identity. It decodes at
  most 256 candidates, rejects compressed inputs over 64 MiB, and enforces a
  3.5-second per-candidate hard limit inside one five-second whole-scan
  deadline. Its `zstd` command is resolved and bound once per adapter instance,
  then reused across scans: Linux launches through the fixed no-follow
  descriptor, while macOS launches a private descriptor-sourced snapshot.
  Replacing the resolved path therefore cannot change the program that runs.
  The binding is explicitly closeable and has finalizer cleanup; failure to
  create it leaves projection-cache discovery available. A bounded
  device/inode/size/mtime/ctime header cache stores only successful or
  deterministic-invalid decodes; transient failures are retried.
- `kimi`: Kimi Code session index, state, and wire JSONL, including discovered
  subagents. `KIMI_CODE_HOME` is honored; otherwise `~/.kimi-code` is used.

All support is best-effort against local, tool-owned persistence formats.
Adapter failures are isolated so one unreadable source does not prevent other
agents from being listed.

## Installation

Choose one CLI installation method. Agent Sidecar is not documented as
published on PyPI, so do not assume that `pipx install agent-sidecar` resolves
to this project.

The recommended release channel is the root installer. Download it from the
protected `main` branch, inspect the complete file, and only then run the local
copy:

```sh
installer="$(mktemp)"
curl --fail --location --proto '=https' --tlsv1.2 --output "$installer" \
  https://raw.githubusercontent.com/shendeguize/AgentSideCar/main/install.sh
${PAGER:-less} "$installer"
sh "$installer" --version v0.6.0
rm "$installer"
```

Omit `--version v0.6.0` to resolve the latest stable GitHub Release. The script
parses release metadata with Python, requires the exact versioned zipapp and
`SHA256SUMS` assets, verifies the checksum with `shasum -a 256` on macOS or
`sha256sum` on Linux, and only then atomically replaces
`~/.local/bin/agent-sidecar`. Use `--prefix ` for another prefix and
`--with-skill` to install both agent skill files. It never reads or sends
credentials.

For convenience only, the compact form below downloads the same installer and
executes it immediately:

```sh
curl -fsSL --proto '=https' --tlsv1.2 \
  https://raw.githubusercontent.com/shendeguize/AgentSideCar/main/install.sh | sh
```

This one-liner trusts the current protected `main` content over TLS without
giving you a local review step. Prefer download-inspect-run above. The release
artifact is still checksum-verified by the script; that checksum does not
authenticate the installer bytes themselves.

### Install with pipx

Install the console command from an existing Git checkout:

```sh
pipx install .
```

Or install directly from Git:

```sh
pipx install 'git+https://github.com/shendeguize/AgentSideCar.git'
```

For a released, immutable revision, append its tag, for example `@v0.6.0`, to
the Git URL after that tag is available. Both forms create an isolated
environment and install `agent-sidecar`; the package has no runtime Python
dependencies.

### Install a GitHub Release zipapp

For manual installation, GitHub Releases publish the executable zipapp and its
checksum file. For version 0.6.0:

```sh
version=0.6.0
curl -fLO "https://github.com/shendeguize/AgentSideCar/releases/download/v${version}/agent-sidecar-${version}.pyz"
curl -fLO "https://github.com/shendeguize/AgentSideCar/releases/download/v${version}/SHA256SUMS"
shasum -a 256 -c SHA256SUMS
chmod +x "agent-sidecar-${version}.pyz"
./agent-sidecar-${version}.pyz --version
```

Use the matching checksum file from the same release. To expose the verified
artifact as `agent-sidecar` without a package installation:

```sh
mkdir -p "$HOME/.local/bin"
install -m 0755 "agent-sidecar-${version}.pyz" "$HOME/.local/bin/agent-sidecar"
agent-sidecar --version
```

Ensure `~/.local/bin` is on `PATH`. The release workflow verifies the zipapp on
macOS before publication and attaches build provenance. Release artifacts do
not represent a PyPI publication.

### Build the deterministic zipapp

Build through the active Agent Sidecar command:

```sh
agent-sidecar package build --output dist/agent-sidecar.pyz
```

From a checkout, `./agent-sidecar package build --output
dist/agent-sidecar.pyz` is equivalent.

The command atomically creates a mode-`0755` executable and prints its path,
SHA-256 digest, and size. It packages the active installed `sidecar` package:
checkout sources when run through that checkout, installed site-packages when
run through pipx or a wheel environment, and the embedded package when run from
an existing zipapp. It does not implicitly package the shell's current working
directory. Repeated builds from identical active package content are
deterministic. Run it directly or through isolated Python:

```sh
./dist/agent-sidecar.pyz --version
python3 -I dist/agent-sidecar.pyz --version
```

If an artifact lost its executable bit during transfer, restore it with
`chmod +x agent-sidecar.pyz` before using it to start a background daemon or
install a service.

### Use a repository checkout

From the repository root:

```sh
sh scripts/install-skill.sh
```

The installer creates symlinks at:

- `~/.local/bin/agent-sidecar`
- `~/.cursor/skills/agent-sidecar`
- `~/.claude/skills/agent-sidecar`
- `~/.dsh/skills/agent-sidecar`

Ensure `~/.local/bin` is on `PATH`. The links point into this checkout, so keep
the repository in place or rerun the installer after moving it. Reinstalling is
idempotent for links into this repository; the script refuses to overwrite
unrelated files, directories, or symlinks. See [Uninstall](#uninstall) to
remove only links owned by this checkout.

This checkout installer is retained for users who want the CLI and the agent
skill links to follow a working tree. It is an alternative to a `pipx` CLI
install because both normally use `~/.local/bin/agent-sidecar`.

Installation is optional. Run directly from the repository instead:

```sh
./agent-sidecar --version
./agent-sidecar status
```

Every example below also works by replacing `agent-sidecar` with
`./agent-sidecar`.

`daemon start` resolves the active pipx console script, executable `.pyz`, or
checkout shim to a stable absolute command before detaching. The daemon
therefore starts independently of the shell's current working directory. Keep
a checkout or zipapp at the resolved location while it is in use; follow the
service update procedure below before moving or removing it.

## Uninstall

Use only the steps that match how Agent Sidecar was installed. Stop persistent
processes before removing the executable they use:

```sh
agent-sidecar service uninstall
agent-sidecar daemon stop
```

`service uninstall` applies only to the macOS LaunchAgent. It retains the
private runtime directory, diagnostics, HTTP token, and any send-audit files.
For a zipapp installed by the root release installer, rerun the inspected
script with the same prefix:

```sh
sh /path/to/inspected/install.sh --uninstall
```

It removes only a regular zipapp with the Agent Sidecar package signature and
valid embedded version metadata, and refuses an unrelated file or symlink. Add
`--with-skill` to remove only recognized copied skill bundles or checkout
skill links. For a `pipx` installation:

```sh
pipx uninstall agent-sidecar
```

For links created by the checkout installer, run this from that checkout:

```sh
sh scripts/install-skill.sh --uninstall
```

For a release zipapp copied manually to the exact path shown above, remove that
file only after verifying it is the Agent Sidecar artifact you installed:

```sh
rm "$HOME/.local/bin/agent-sidecar"
```

Deleting `~/.agent_sidecar` is not part of normal uninstall. It can destroy
diagnostics, the HTTP token, send-audit records, and request-ID idempotency
history. Do not use `audit reset` as an uninstall command.

## Commands

Version and session discovery:

```sh
agent-sidecar --version
agent-sidecar list
agent-sidecar list --all
agent-sidecar list --agent cursor-ide --agent claude
agent-sidecar list --all --json
agent-sidecar list --remote
agent-sidecar list --remote --host <host-alias> --json
agent-sidecar list --remote --remote-python /usr/bin/python3.11 --json
```

`list` shows sessions updated in the last 48 hours by default. `--all` removes
that age filter. `--agent NAME` is repeatable, exact, and case-insensitive.
`--json` emits a JSON array.

Process and active-status views:

```sh
agent-sidecar ps
agent-sidecar ps --json
agent-sidecar status
agent-sidecar status --json
agent-sidecar status --remote
agent-sidecar status --remote --host <host-alias> --json
agent-sidecar status --remote --remote-python /usr/bin/python3.11 --json
```

`ps` reports supported local agent executables; process presence is supporting
evidence and is not reliably attributable to one session. `status` includes
only `working` and `waiting` sessions.

### Remote list and status

`list --remote` and `status --remote` merge the local snapshot with eligible
hosts from DSH Center inventory. `--host <host-alias>` is repeatable,
case-insensitive, and valid only with `--remote`; it limits the remote targets
but never removes local rows. `--remote-python <absolute-path>` is also valid
only with `--remote` and pins one interpreter path across every selected host
for that invocation. This is a fleet-wide option; there is no per-host remote
interpreter configuration.

Remote human output adds a `HOST` column. Remote JSON adds `host` to every row:
`local` marks local provenance, while each remote row carries its
inventory-provided host alias. Local commands without `--remote` retain the
original session schema and do not add `host`.

Inventory is obtained from `dshc ls --json` when available, with the DSH Center
config/state files under `DSHC_HOME` or `~/.dsh_center` as a strict fallback.
Only enabled, nonlocal, non-orphaned hosts in an eligible phase are queried.
Remote `list` uses the same 48-hour default as local `list`; `--all` requests
the full available history from both.
The sidecar builds a bounded zipapp from its active installed `sidecar` package
and streams it over noninteractive SSH. That source is the checkout when run
there, installed site-packages under pipx or a wheel, or the embedded package
under a zipapp. No remote installation or third-party Python package is
required. Before transfer, the target is probed in this exact bounded order:
`python3`, `python3.14`, `python3.13`, `python3.12`, `python3.11`,
`python3.10`, `python3.9`, and `python3.8`. The first available candidate
running Python 3.8 or newer is used. Candidate names are resolved with the
`PATH` visible to the remote noninteractive SSH shell, which may differ from
an interactive login's `PATH`.

Interpreter selection has strict precedence: `--remote-python`, then
`AGENT_SIDECAR_REMOTE_PYTHON`, then the bounded default candidates. The
environment variable has the same fleet-wide scope and is read only by
remote-enabled `list`, `status`, and `watch`; non-remote calls ignore it. An
explicit value must be a nonempty absolute path no longer than 1024 characters,
use only `[A-Za-z0-9._+/-]`, and contain no `..` path segment. Invalid CLI or
environment values exit `2` locally before any SSH connection is attempted.

SSH requires an already trusted host key and working noninteractive
authentication. It does not enroll host keys or fall back to an interactive
prompt. The probe uses `sh -c` to fix the inner candidate loop to POSIX syntax,
but the outer command string is still parsed by the remote login shell. The
existing multiline bootstrap already establishes this shell boundary; remote
execution is not shell-independent. For bounded default discovery, the
validated executable path returned by the qualifying interpreter is reused
only for the bootstrap within that same host session. Every invocation probes
afresh, with no local or remote cache or persistence. The transient zipapp is
executed with that interpreter and removed after the snapshot. If the bounded
candidate list is exhausted, the host retains the stable `python_too_old`
failure code; no new error code is introduced.

An explicit interpreter is passed as one argv token to the same fixed probe
script; user data is never inserted into the script text. The explicit path is
the probe's one-element candidate list and