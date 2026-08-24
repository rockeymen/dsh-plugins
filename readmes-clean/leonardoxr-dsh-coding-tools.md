# dsh-coding-tools

A [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/) host plugin with a narrowly scoped Settings card that adds compact, bounded coding tools without modifying DSH:

- `code_read` — UTF-8 code windows with exact-byte version tokens
- `edit_ranges` — atomic, observed-range edits with operator-configurable approval
- `ast_grep` — pinned ast-grep CLI over one provider-read file snapshot, with pagination and read-only process confinement
- `lsp` — persistent read-only language-server queries with bounded JSON-RPC
- Fresh diagnostic summaries after plugin-owned edits when the matching LSP server is already active

`ast_edit` and DAP debugging are deliberately **not registered** in the secure initial release. The browser bundle is limited to the Coding tools Settings card.

## Requirements

- Node.js 22.19+ or 24+
- DeepSeek Harness 0.1.1-rc.2 or compatible public service contracts
- A DSH profile that supplies `tools`, `fs`, `sandboxPolicy`, `sandbox`, `approval`, `spillStore`, `subprocess`, and `settings` (the stock Web profile does)
- Optional absolute-path language server executables configured by the profile operator

## Install

Build a local checkout, then enroll it in a DSH profile with the supported profile command:

```powershell
pnpm install
pnpm check
dsh plugin --profile web add "C:\absolute\path\to\dsh-coding-tools"
```

The package contributes [`cordis.patch.yml`](cordis.patch.yml), which inserts the package-prefixed row `dsh-coding-tools`. Restart the Web profile after host plugin changes. A raw source patch alone is not package enrollment.

For a published or Git install, pin a release or commit instead of a floating branch.

## Configuration

An expandable **Coding tools** card appears in **Settings → Plugins → Plugin configuration**. It provides switches for `code_read`, `edit_ranges`, `ast_grep`, and `lsp`, plus separate **Require edit approval** and **Require process-start approval** controls. Approval prompts default on. Advanced limits and language-server plans remain profile configuration. Saved settings persist in DSH's user layer and apply live: disabled tools are unregistered, enabled tools are registered, and process-backed resources are stopped or recreated without restarting DSH Web. Reconfiguration cancels in-flight reads and queries, drains edits that may already have committed, and invalidates existing cursors and `code_read` version tokens.

Profile patch layers can replace the inserted row with explicit base configuration:

```yaml
- insert:
    - id: dsh-coding-tools
      name: 'dsh-coding-tools'
      config:
        inlineMaxBytes: 8192
        approvals:
          editRanges: true
          processStart: true
        codeRead:
          enabled: true
          defaultLines: 200
          maxLines: 2000
          maxBytes: 262144
          snapshotMaxBytes: 67108864
        versionedEdit:
          enabled: true
          requireObservedRanges: true
          maxOperations: 100
          maxChangedBytes: 1048576
          diagnosticsOnWrite: true
        ast:
          grepEnabled: true
          executable: '' # empty = pinned @ast-grep/cli binary
          maxFileBytes: 2097152
          maxMatchesPerPage: 50
          maxTotalMatches: 5000
          timeoutMs: 30000
        lsp:
          enabled: true
          servers:
            clangd:
              command: '/absolute/path/to/clangd'
              args: ['--background-index=false']
              extensions: ['.c', '.cc', '.cpp', '.h', '.hpp']
              languageId: 'cpp'
              env: {}
          maxOpenDocuments: 64
          maxDocumentBytes: 16777216
          maxDiagnosticBytes: 4194304
        debug:
          enabled: false
```

Executable paths in configuration must be absolute. Repository files never select a binary or inject command-line arguments. Environment entries are explicit; DSH's subprocess provider removes ambient credential-shaped and `DSH_*` variables before applying them.

See [Configuration reference](docs/CONFIGURATION.md).

## Tool workflow

### Exact reads and edits

1. Call `code_read` with `file`, and optional one-indexed `offset` / `limit`.
2. Retain the returned `version`.
3. Call `edit_ranges` with that exact `file`, `version`, and non-overlapping operations.
4. Under a read-only session, retry the denied call once with `sandbox_permissions: workspace-write` and a sentence in `justification`; sandbox escalation always requires its own one-call approval. Under an already-writable session, the ordinary mutation prompt is required only when `approvals.editRanges` is enabled.

Disabling ordinary edit approval does not widen sandbox policy. The standard DSH escalation fields do, for one call only, and always retain approval; they are advertised only when the mounted filesystem reports sandbox enforcement. A bare filesystem cannot escalate and fails closed under read-only policy. Source-changing operations must refer only to line ranges returned by `code_read` for the same owner, canonical target, and exact version. `append` is the sole observed-range exception, but still requires an observed version. All operations validate before one provider-version-guarded atomic write.

Line operation semantics:

- `replace`: replace inclusive whole lines and preserve the following line separator
- `delete`: remove inclusive whole lines
- `insert_before` / `insert_after`: insert line-shaped text using the file's dominant separator
- `append`: append text, adding one dominant separator when the file lacks a final separator

BOM, existing untouched line endings, and UTF-8 bytes are preserved. Invalid UTF-8 and NUL-bearing binary files fail closed. Successful publication always returns `applied: true`; `intendedVersion` is always identified, while `newVersion` is present only after a verified landed read. `landedExact` and `postWriteWarning` make any post-commit verification or diagnostic problem explicit so callers do not retry a committed write blindly.

### Structural search

`ast_grep` accepts a pattern, exactly one regular workspace file in `paths`, a required language, optional strictness, a page limit, and an owner-scoped cursor. Before launch it:

- resolves the file through `ctx.fs` and proves canonical workspace containment
- rejects explicit symlinks and directories
- performs a stable, byte-bounded provider read
- passes that immutable snapshot to ast-grep over stdin, never as a process path
- enforces result, capture, cursor, output, and time caps
- asks once for that process launch when `approvals.processStart` is enabled and always forces full read-only DSH confinement

Broad directory scans are deliberately gated off. DSH does not currently expose an atomic process read-whitelist/open-handle contract, so passing workspace paths to a later process would leave a read-side TOCTOU race. Incomplete coverage is reported with explicit `limitReasons` or `parseErrors`.

### Language servers

`lsp` supports `hover`, `definition`, `references`, `symbols`, and `diagnostics`. A configured server starts lazily, requesting one-shot approval when `approvals.processStart` is enabled, remains scoped to owner + canonical workspace + profile, and stops on idle timeout or plugin disposal.

The client advertises no edit or command capability. Server requests for `workspace/applyEdit` are explicitly rejected; dynamic capabilities, terminal launch, workspace commands, and unknown server requests never execute. Results outside the session workspace are discarded.

Diagnostics are marked fresh only when a server-supplied version corresponds to the current synchronized document version. Versionless diagnostics are never certified as fresh; they may be returned as stale evidence with incomplete coverage. Diagnostics are deduplicated and ordered error-first.

## Security

Read [Security model](docs/SECURITY.md) and [Public contract matrix](docs/PUBLIC_CONTRACTS.md). Approval prompts are enabled by default. An operator may explicitly disable ordinary edit and process-start prompts independently; exact-version observation, atomic provider writes, absolute executable plans, bounded execution, and full read-only process confinement remain mandatory. Sandbox escalation approval is never bypassed.

## Development

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm pack --dry-run
```

This repository is independent from the DSH source checkout. Never patch DSH to mount it.