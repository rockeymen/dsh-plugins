# dsh-question-rail

A [DeepSeek Harness](https://github.com/deepseek-ai/dsh) web plugin that adds a **right-edge question rail** like the deepseek.com chat — a narrow strip of ticks on the right edge that expands on hover to list **every user turn in the current conversation**, and jump-scrolls back to that turn when clicked.

- **One rendering, two states** — the collapsed tick column and the expanded list are the *same* `.qrl_item` elements. Collapsed shows only each item's right-edge tick; hovering widens the panel to reveal the text. Identical style, identical spacing, identical right reference line.
- **Jump to any round** — click a question, and the chat scrolls smoothly to that turn (`data-chat-anchor-key` anchor) with a brief highlight ring.
- **Conversation-only** — reads the live per-session chat store (`view` from `ctx.slots.entries("conversation.session")` + `resolveStore`), so it renders only on the **chat** view and hides instantly on 轨迹 / 上下文 / Design / PPT or the empty home.
- **Full history** — DSH conversation history is windowed (`hasMore`). The rail auto-calls `session.loadOlder()` in a loop until `hasMore === false`, so it lists **all** rounds, not just the loaded window.
- **Performance-tuned** — `useSessions` selects only `current`; the rail subscribes to a **render signature** (question set + active view) instead of the whole conversation snapshot, so streaming output / tool calls don't re-render the list. Skip-free typing, stable handlers, signature-memoized items.
- **Theme-aware** — panel text & the hover detail box follow `body[data-ds-dark-theme]` (dark: white text on transparent; light: black text). The panel itself is transparent (no card, no border).
- **Keyboard accessible** — each question is `role="button"` with `tabIndex=0`, Enter/Space triggers.
- **Zero runtime dependencies** — the node half is intentionally empty (it only makes the loader discover the package); the browser half uses only `react` / `react/jsx-runtime` seed words.

## How it works

### Layer · What happens
- **Layer**: **Node half** (`lib/index.js`) · **What happens**: Empty `apply()` — just enough to be an active cordis loader entry so `dsh-client-modules` publishes `/plugins/dsh-question-rail/client.js`.
- **Layer**: **Browser half** (`lib/client.js`) · **What happens**: Registers via `window.__ModuleLoader__.load`, then `apply(ctx)` injects the rail into the `shell.overlay` slot (frame-wide, additive, click-through until the entry opts in).
- **Layer**: **Data** · **What happens**: Reads the current session's `ConversationSnapshot.nodes` (full list, not the windowed `chat.order`), extracts `user`/`steering` turns, and maps each `seq` → chat `key` for scroll anchors.
- **Layer**: **View gating** · **What happens**: `ctx.slots.entries("conversation.session") → resolveStore(handle, sessionId) → store.getSnapshot().view` — the authoritative source DSH's own header tabs use. Renders only when `view === "chat"`.

## Installation

```powershell
# From a local checkout (dev / link mode — source edits take effect on hard-refresh)
dsh plugin --profile web add link:D:/path/to/dsh-question-rail

# Or straight from GitHub (requires git + a GitHub token on this machine)
dsh plugin --profile web add github:LeonSone/dsh-question-rail
```

`dsh plugin add` adds the package to the profile's `dependencies`; because the package declares `dsh.bundle`, it is automatically appended to `dsh.profile.bundles`.

> **New client packages need a restart.** `dsh.client` discovery scans only at boot for *new* packages (bundle *content* changes hot-reload). After first install, restart `dsh web` (or the headless runner), then **hard-refresh** the browser (`Cmd/Ctrl+Shift+R`).

## Usage

Once installed, a narrow strip of ticks appears along the right edge of an active chat conversation:

### Interaction · Behavior
- **Interaction**: Move mouse near the right edge · **Behavior**: The strip widens, revealing each round's question as a single line (12px, right-aligned, trailing tick).
- **Interaction**: Hover a single question · **Behavior**: A detail box appears on the left showing the **full question text** (scrollable up to 50vh).
- **Interaction**: Click a question · **Behavior**: The chat scrolls smoothly to that turn and flashes a highlight ring.
- **Interaction**: Switch to 轨迹 / 上下文 / Design / PPT · **Behavior**: The rail hides instantly (chat-view gate).
- **Interaction**: Empty / home screen · **Behavior**: Nothing renders.

## Development

```
lib/client.js          browser half (ModuleLoader bundle, injects into shell.overlay)
lib/index.js           node half (empty apply; discovery only)
cordis.patch.yml       bundle patch (mounts the node half)
test/*.mjs             headless contract & extraction tests
```

Run the checks:

```sh
node test/bundle-contract.test.mjs   # __ModuleLoader__.load / apply / inject / shell.overlay registration
node test/bind-fix.test.mjs          # closure-bound getSnapshot/subscribe (no lost-this crash)
node test/extract.test.mjs           # full-list extraction: user/steering only, anchor mapping
node test/loadolder.test.mjs         # loadOlder loop until hasMore=false (full history)
```