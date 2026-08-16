# @claude-code-tips/dsh-plugin

[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-zh.svg)](https://dsh.market/)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) plugin bundle for the web profile. It replaces the static **Deep diving...** turn-status label with rotating, Claude Code-style **loading words** — the original 56-word set — while a turn is running. The elapsed-time clock next to the status is preserved.

## What it changes

Before:

```
Deep diving... 12s
```

After (rotates every few seconds):

```
Thinking...  12s
```

The implementation is a small browser-side client plugin: it watches the chat DOM and rewrites only the status text node. No server code, no model prompt changes, no fork of DSH.

The full 56-word rotation list:

```
Accomplishing, Actioning, Actualizing, Baking, Brewing, Calculating,
Cerebrating, Churning, Clauding, Coalescing, Cogitating, Computing,
Conjuring, Considering, Cooking, Crafting, Creating, Crunching,
Deliberating, Determining, Doing, Effecting, Finagling, Forging,
Forming, Generating, Hatching, Herding, Honking, Hustling, Ideating,
Inferring, Manifesting, Marinating, Moseying, Mulling, Mustering,
Musing, Noodling, Percolating, Pondering, Processing, Puttering,
Reticulating, Ruminating, Schlepping, Shucking, Simmering, Smooshing,
Spinning, Stewing, Synthesizing, Thinking, Transmuting, Vibing, Working
```

## Install

Requires the `web` profile and a DSH version that supports out-of-tree bundles (`dsh` 0.1.0-rc.6 or newer).

```sh
# from this directory
dsh plugin --profile web add .
```

Or install from a git checkout:

```sh
dsh plugin --profile web add github:your-name/dsh-claude-code-tips
```

Then start the web UI:

```sh
dsh --profile web
```

## Verify

1. Start the web UI and open a session.
2. Send a message.
3. While the model is working, the status line should show rotating loading words such as `Thinking...`, `Pondering...`, or `Musing...` instead of `Deep diving...`.

To disable without uninstalling, add to the profile's `cordis.patch.yml`:

```yaml
- id: claude-code-tips
  disabled: true
```

## Development

The plugin has no build step. `client.js` is the browser half loaded by DSH's client module system; `cordis.patch.yml` inserts it into the web profile.