# dsh-managed-approval

Codex-inspired managed approval for DeepSeek Harness (DSH). The plugin adds a
fourth session-level preset, **Approve for me**, to DSH's native permission menu
while leaving Read Only, Workspace Write, and Full Access unchanged.

When **Approve for me** is selected, a tool-free, one-shot reviewer evaluates a
pending operation against its risk and the user's trusted authorization context.
An accepted operation receives a one-time grant. A policy or model denial rejects
the call and directs the agent toward a materially safer approach. Reviewer
infrastructure failures fall back to DSH's native human approval prompt.

> This is an independent community project. It is not affiliated with, endorsed
> by, or maintained by DeepSeek or OpenAI. The package is currently a beta and is
> pinned to DSH `0.1.0-rc.6`.

## Why this plugin

Several DSH plugins reduce approval interruptions. This package is for users who
want a tool-free reviewer and Codex-inspired decision semantics across both
existing DSH approval requests and MCP calls, rather than a blanket auto-approve
mode or only a Shell command allowlist:

- the underlying sandbox stays in place;
- likely read-only search and inspection continue without added review, while
  side-effecting or unknown MCP calls can be promoted into the approval path;
- every automatic grant is `allowed-once`;
- an explicit policy or reviewer denial stops the action and tells the agent to
  find a materially safer path;
- reviewer timeouts, malformed output, missing routes, and other infrastructure
  failures fall back to DSH's native human prompt.

"Codex-inspired" describes the interaction and decision target, not official
compatibility. Codex uses tool annotations and configured approval modes to
decide which MCP calls require review; DSH rc.6 discards those annotations before
this plugin's hook, so this package uses a conservative tool-name and user-rule
compatibility layer instead. See the official [Codex Auto-review documentation](https://learn.chatgpt.com/docs/sandboxing/auto-review)
and [MCP approval configuration](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

### Which approval plugin should I install?

The comparison below is based on the published releases or repository revisions
linked here, verified on 2026-08-17. These community projects can evolve, so
check their current release notes before installing. Use one permission-review
plugin per DSH profile to avoid duplicate presets or competing approval
answerers. The curated [awesome-dsh-plugin catalog](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
contains additional approval and permission tools; this table focuses on the
closest automatic-review designs.

### Package · Automatic-review boundary · Denial and failure behavior · Best fit
- **Package**: **`dsh-managed-approval` (this package)** · **Automatic-review boundary**: Existing DSH asks plus risk-based promotion of side-effecting or unknown MCP calls; native DSH tools keep their own policy · **Denial and failure behavior**: Explicit denial rejects and requests a materially safer path; reviewer failure goes to the human; three consecutive denials abort the turn · **Best fit**: Codex-inspired session behavior with MCP-aware review and minimal setup
- **Package**: [`dsh-auto@eb40940`](https://github.com/simon300000/dsh-auto/tree/eb409400843e195886edb45d9a75d2188120a2b6) · **Automatic-review boundary**: Existing `approval/request` events; each request starts a restricted reviewer with bounded `read`, `glob`, and `grep` investigation · **Denial and failure behavior**: Model denials and reviewer infrastructure failures reject the request; three consecutive denials interrupt the turn · **Best fit**: Bounded read-only investigation with structured risk and user-authorization decisions
- **Package**: [`dsh-auto-review@0.5.0`](https://github.com/PerryLink/dsh-auto-review/tree/v0.5.0) · **Automatic-review boundary**: Existing asks selected by per-tool `ai` / `human` / `never` policies; the reviewer may use read-only inspection tools · **Denial and failure behavior**: Denials reject; reviewer failures follow a configurable fallback that defaults to rejection; rejection breakers are configurable · **Best fit**: Per-tool routing, durable audit events, a Web review panel, and single-use authorization context for the next same-tool review
- **Package**: [`dsh-auto-classifier@0.1.14`](https://github.com/PAKIKNOWLEDGE/dsh-auto-classifier/tree/44550f8c38c857b7e05f0440af988fdba486523c) · **Automatic-review boundary**: In the `auto` preset, deterministic `tools/pre-execute` rules classify every tool call; unmatched pre-execute calls can use an optional LLM judge, while sandbox escalations use rules and a default decision · **Denial and failure behavior**: Deny-rule matches reject; unmatched calls and judge failures use `defaultDecision`, which defaults to `allow` · **Best fit**: Unattended rule-driven operation with optional semantic review, denial caps, and Git snapshots
- **Package**: [`dsh-approve-for-me@0.1.0-beta.3`](https://www.npmjs.com/package/dsh-approve-for-me/v/0.1.0-beta.3) · **Automatic-review boundary**: Existing Shell and PowerShell sandbox escalations that match configured literal command prefixes; the positive list is empty by default · **Denial and failure behavior**: Unmatched, high-risk, reviewer-denied, and failed reviews all go to the human · **Best fit**: Explicit command boundaries, a Web settings card, and Headless support
- **Package**: [`dsh-auto-approve@0.4.3`](https://www.npmjs.com/package/dsh-auto-approve/v/0.4.3) · **Automatic-review boundary**: Existing `approval/request` events, filtered by danger patterns and a binary `approve` / `ask` classifier · **Denial and failure behavior**: Every non-`approve` result goes to the human · **Best fit**: Low-configuration classification and an in-memory `/auto-report`
- **Package**: [`dsh-approval-llm@0.1.3`](https://www.npmjs.com/package/dsh-approval-llm/v/0.1.3) · **Automatic-review boundary**: Existing `approval/request` events with exact tool-name allow, deny, and human-only lists · **Denial and failure behavior**: `DENY` rejects; `ESCALATE` and reviewer failures go to the human · **Best fit**: Exact tool-name routing, a three-state reviewer, and a bundled configuration skill

This is not a complete Codex clone. In particular, it does not yet implement
Codex's exact-action `/approve` retry, rolling 10-of-50 rejection breaker, or
reviewer read-only helper checks.

## Compatibility

### Target · Status · Notes
- **Target**: DSH `0.1.0-rc.6` · **Status**: Verified · **Notes**: DSH peer dependencies are pinned to this release candidate.
- **Target**: DSH Web profile · **Status**: Verified · **Notes**: Host approval logic and the Web permission-menu icon are covered.
- **Target**: macOS · **Status**: Verified · **Notes**: The local Web workflow was exercised on macOS.
- **Target**: Linux · **Status**: Unverified · **Notes**: Expected to run, but not included in the current release test matrix.
- **Target**: Windows · **Status**: Unverified · **Notes**: Not included in the current release test matrix.
- **Target**: Headless profile · **Status**: Unverified · **Notes**: The release bundle and user experience currently target the Web profile.
- **Target**: Node.js `^22.19.0` or `>=24.0.0` · **Status**: Declared · **Notes**: Node 24 is used by the local release harness.

Future DSH release candidates may change permission presets, profile patching,
approval hooks, or client loading. Upgrade DSH and this plugin independently only
after checking their compatibility.

## Install

Requirements: DSH `0.1.0-rc.6`, a supported Node.js version, and pnpm on `PATH`.
After the beta is published, install it into the Web profile:

```sh
dsh plugin --profile web add dsh-managed-approval@beta
```

Restart the DSH Web Host, open a conversation, and select **Approve for me** from
the permission menu. No profile YAML or reviewer configuration is required. The
package bundle mounts the Host plugin, adds the fourth permission preset, and
loads the small Web client that supplies its shield-and-spark icon.

Verify the installed package:

```sh
dsh plugin --profile web list dsh-managed-approval
```

### Update

```sh
dsh plugin --profile web up dsh-managed-approval@beta
```

Restart the Web Host after updating so both the Host plugin and browser module
come from the same version.

### Remove

```sh
dsh plugin --profile web remove dsh-managed-approval
```

Restart the Web Host after removal. Removing the dependency also removes the
bundle layer and its permission preset. Conversations that selected it must use
one of DSH's remaining permission modes.

### pnpm store mismatch

If DSH reports `ERR_PNPM_UNEXPECTED_STORE`, the profile's existing `node_modules`
was linked from a different pnpm store. Run the plugin command with the same
store directory used to create that profile; do not blindly reinstall or move a
shared profile. For example, this repository's isolated lab uses:

```sh
npm_config_store_dir="$PWD/.pnpm-store" \
  dsh plugin --profile web add dsh-managed-approval@beta
```

## What gets reviewed

The default `risk-based` policy approximates Codex's interaction model within
the hooks exposed by DSH rc.6:

- Approval requests already raised by DSH are routed to the reviewer instead of
  immediately prompting the human.
- Read-only search, fetch, list, get, find, and inspect-style MCP tools normally
  continue without an extra prompt.
- MCP actions that appear to create, update, delete, write, send, publish,
  upload, or externally process local media are promoted into DSH's native
  approval flow.
- Unknown MCP actions default to review.
- Native DSH tools keep their existing sandbox and policy gates.
- A decision already returned as `ask` or `deny` by another DSH layer is never
  weakened.
- Every automatic grant is `allowed-once`; the plugin creates no persistent
  permission.

Reviewer outcomes follow this matrix:

### Review result · DSH outcome
- **Review result**: Model allows low or medium risk · **DSH outcome**: Grant once
- **Review result**: Model allows high risk with medium or high user authorization · **DSH outcome**: Grant once
- **Review result**: Host hard rule or model denial · **DSH outcome**: Reject with rationale and a no-circumvention instruction
- **Review result**: Timeout, malformed output, missing arguments or route, or another reviewer failure · **DSH outcome**: Ask the human through DSH's native approval UI

After three consecutive reviewer denials in one turn, a circuit breaker cancels
that turn while preserving queued context. A later user turn starts with a fresh
counter. The additional routing runs only in **Approve for me**; DSH's three
built-in modes retain their original behavior.

## Reviewer model

By default, the reviewer inherits the provider, model, and reasoning effort
recorded by the current conversation. It performs a tool-free, one-shot model
call and parses a strict JSON contract. Only user-authored messages and workspace
instructions are treated as trusted authorization context. Tool names,
arguments, and reasons are isolated as untrusted data, and common credential
forms are redacted before model review.

To use a separate account or model, configure both `reviewerProvider` and
`reviewerModel` in the profile's user patch:

```yaml
- id: approve-for-me
  config:
    managedPreset: approve-for-me
    reviewerProvider: reviewer-zai
    reviewerModel: glm-5.2
    reviewerReasoningEffort: high
    reviewerTimeoutMs: 60000
    reviewerMaxTokens: 768
    maxInputChars: 32768
    maxContextChars: 12000
    toolPolicy: risk-based
    toolRules: []
    unknownMcpAction: review
```

Configure the referenced provider through normal DSH LLM settings. Keep its
credential in an environment variable or DSH's credential store, never in the
profile patch or package. If the active session has no complete model route, or
the explicit reviewer is unavailable, the request falls back to the human.

DSH rc.6 replaces a matched plugin row's whole `config` object instead of
deep-merging it. A user patch must therefore repeat every non-default field it
wants to retain.

### Tool-policy overrides

`toolPolicy` accepts:

### Value · Behavior
- **Value**: `risk-based` · **Behavior**: Default. Promote likely side-effect tools and leave likely read-only tools alone.
- **Value**: `off` · **Behavior**: Review only approval requests already raised by DSH.
- **Value**: `all` · **Behavior**: Promote every otherwise-allowed tool call. Useful for testing, usually noisy.

`toolRules` is an ordered list of glob patterns with an `allow`, `review`, or
`deny` action. The first matching rule wins:

```yaml
- id: approve-for-me
  config:
    managedPreset: approve-for-me
    toolPolicy: risk-based
    unknownMcpAction: review
    toolRules:
      - pattern: mcp__example__search_*
        action: allow
      - pattern: mcp__example__send_message
        action: review
      - pattern: mcp__example__delete_*
        action: deny
```

Rules cannot weaken another DSH policy layer's `ask` or `deny`. A rule-level
`deny` stops the call before model review. `unknownMcpAction` accepts the same
three actions and defaults to `review`.

## Known limitations

- DSH rc.6 discards MCP `readOnlyHint` and `destructiveHint` metadata before this
  hook. Risk classification is therefore a conservative lexical compatibility
  layer and can produce false positives or false negatives.
- There is no dedicated Web action to manually override one exact operation
  rejected by the reviewer.
- The circuit breaker covers three consecutive denials in one turn; it does not
  yet implement a rolling multi-turn threshold.
- Third-party permission presets have no i18n API in DSH rc.6. The UI label is
  intentionally the static English text **Approve for me**, matching the three
  built-in entries. The Web client still recognizes the old beta.1 Chinese label
  so an upgrade does not lose its icon.
- Linux, Windows, and the Headless profile have not yet passed the release smoke
  suite.
- Model review reduces approval fatigue; it is not a security boundary equivalent
  to a sandbox. Keep DSH's sandbox enabled and inspect human prompts carefully.

## Migrating from older builds

- **0.4.0-beta.0:** do not use it. Its browser module registered the old local
  plugin id, causing DSH to report that the bundle loaded without registering
  `dsh-managed-approval`.
- **0.4.0-beta.1:** update normally. beta.2 changes the visible preset label to
  **Approve for me** and retains icon compatibility with the old label.
- **0.4.0-beta.2:** update normally. beta.3 adds the public selection guide and
  npm positioning; Host and Web runtime behavior is unchanged.
- **0.4.0-beta.3:** update normally. beta.4 adds public repository and security
  metadata; Host and Web runtime behavior is unchanged.
- **0.4.0-beta.4:** update normally. beta.5 moves the Chinese documentation
  below `docs/` so npm uses the root English README; Host and Web runtime
  behavior is unchanged.
- **Local 0.3.0 prototype:** remove the hand-written `approve-for-me` plugin row
  and permission preset before installing this package. Do not remove unrelated
  providers, MCP servers, or built-in permission settings.

See [CHANGELOG.md](./CHANGELOG.md) for the release history.

## Develop and pack locally

```sh
npm ci
npm test
npm pack --dry-run
npm pack
```

Install the generated beta.5 tarball from the repository root:

```sh
dsh plugin --profile web add \
  "$PWD/dsh-managed-approval-0.4.0-beta.5.tgz"
```

The package ships compiled Host output, the Web client, `cordis.patch.yml`, and
the license. Consumers do not build during installation. `prepack` runs the Host
build, client syntax check, and test suite before npm creates a tarball.

## Beta publishing checklist

For each public beta:

1. Confirm the public source commit and release tag match the package candidate.
2. Confirm GitHub private vulnerability reporting is enabled as described in
   [SECURITY.md](./SECURITY.md).
3. Run tests and inspect `npm pack --dry-run` from a clean checkout.
4. Exercise clean-profile install, restart, approval, update, and remove on the
   verified compatibility matrix.
5. Publish the first beta with an npm account protected by 2FA; configure trusted
   publishing and provenance for subsequent releases.
6. Install `dsh-managed-approval@beta` back from the public npm registry and
   repeat the smoke test before announcing the release.

The package name `dsh-approve-for-me` belongs to an unrelated npm project. This
project deliberately publishes as `dsh-managed-approval` to avoid impersonation
or upgrade confusion. npm package metadata always includes a `latest` dist-tag.
Because this project's first public release was a beta and no stable version
exists yet, the registry assigned `latest` to the initial prerelease. Always
install and update with `dsh-managed-approval@beta`; subsequent prereleases
advance only the `beta` tag. After the stable release gates pass, point `latest`
to the stable release.

## Security boundary

Approval logic runs on the Host. The browser client only decorates the native
permission menu and exposes no approval RPC. Tool arguments come from the Host
execution path, not the browser. Model and policy denials reject the call;
reviewer infrastructure failures delegate to DSH's native human answerer.

For vulnerability reporting and supported-version policy, read
[SECURITY.md](./SECURITY.md).