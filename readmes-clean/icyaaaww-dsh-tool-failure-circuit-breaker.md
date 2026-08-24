# dsh-tool-failure-circuit-breaker

A DeepSeek Harness guard plugin that stops an agent from dispatching the same tool with identical arguments after that call has already failed repeatedly. It saves tool latency, network requests, command execution, and provider cost when a model retries an unchanged operation that cannot succeed.

The plugin is deliberately narrower than the official `@deepseek-ai/dsh-repeat-tool-reminder`: the official plugin advises on every repeated call but never blocks one. This plugin observes only authoritative failed `tools/result` outcomes and denies the next identical dispatch after a configured threshold.

The package targets and has been composed against DeepSeek Harness `0.1.1-rc.2`.

## Install

From this checkout's parent directory:

```sh
dsh plugin --profile web add ./dsh-tool-failure-circuit-breaker
```

For a source checkout of Harness, replace `dsh` with `pnpm dsh`.

## Configuration

The included bundle inserts this row:

```yaml
- id: tool-failure-circuit-breaker
  name: dsh-tool-failure-circuit-breaker
  config:
    maxFailures: 2
    include: []
    exclude: []
    errorPreviewChars: 300
```

- `maxFailures`: completed identical failures allowed before the next attempt is denied. Default: `2`.
- `include`: `*` wildcard tool-name patterns to guard. Empty guards every tool.
- `exclude`: `*` wildcard tool-name patterns that bypass the guard.
- `errorPreviewChars`: maximum characters from the latest failure repeated in the denial. Default: `300`.

Use `exclude` for tools whose intended contract requires unchanged polling calls.

## Behavior

Failure chains are isolated per live agent and keyed by tool name plus canonical JSON arguments. Object key order does not change identity. A successful tool result, a new user message, or a failed call with different arguments opens the previous circuit. Calls made without an agent are ignored.

The guard listens at `tools/pre-execute`, so a denied retry never reaches the tool body. It observes the immutable `tools/result` event and does not count its own denial as another operational failure.

When open, the model sees its original tool error. Once blocked, it receives:

```text
The identical <tool> call already failed <count> consecutive times. Last failure: <message>. Change the arguments or approach, inspect external state, or ask the user instead of retrying unchanged.
```

The denial is recorded as the normal tool result, so replay and model history remain consistent with Harness behavior. The plugin adds no tool schema and no tokens until it blocks a call.

## Test

```sh
npm test
```

## Limitations

- State is in memory and resets when the process or plugin restarts.
- Already-dispatched parallel calls may all fail before the threshold can block a later call.
- Exact canonical argument matching does not detect near-identical retries.
- Blocking is opt-in by installing the bundle; choose exclusions for legitimate repeated probes.