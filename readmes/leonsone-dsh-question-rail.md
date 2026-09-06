# dsh-question-rail

**English** | [中文](README.zh-CN.md)

<div align="center">
  <a href="https://www.npmjs.com/package/dsh-question-rail"><img alt="npm version" src="https://img.shields.io/npm/v/dsh-question-rail" /></a>
  <a href="https://www.npmjs.com/package/dsh-question-rail"><img alt="npm downloads" src="https://img.shields.io/npm/dm/dsh-question-rail" /></a>
  <a href="https://github.com/LeonSone/dsh-question-rail/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/LeonSone/dsh-question-rail" /></a>
  <a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>
  <a href="https://github.com/LeonSone/dsh-question-rail"><img alt="GitHub tag" src="https://img.shields.io/github/v/tag/LeonSone/dsh-question-rail" /></a>
  <a href="https://github.com/topics/dsh"><img alt="GitHub topics" src="https://img.shields.io/github/topics/LeonSone/dsh-question-rail" /></a><br /><br />
  <a href="https://www.npmjs.com/package/@deepseek-ai/dsh?activeTab=versions"><img alt="支持的 DSH 版本：0.1.0-rc.8 · 0.1.1-rc.1 · 0.1.1-rc.2" src="https://img.shields.io/badge/DSH-0.1.0--rc.8_%C2%B7_0.1.1--rc.1_%C2%B7_0.1.1--rc.2-4d6bfe" /></a>
  <a href="https://github.com/topics/dsh-plugin"><img alt="插件生态：GitHub topic dsh-plugin" src="https://img.shields.io/badge/%E6%8F%92%E4%BB%B6%E7%94%9F%E6%80%81-topic%20dsh--plugin-4d6bfe" /></a><br /><br />
  <img alt="问题条" src="https://img.shields.io/badge/-问题条-4d6bfe" />
  <img alt="对话导航" src="https://img.shields.io/badge/-对话导航-4d6bfe" />
  <img alt="轮次定位" src="https://img.shields.io/badge/-轮次定位-4d6bfe" />
  <img alt="右缘悬浮" src="https://img.shields.io/badge/-右缘悬浮-4d6bfe" />
  <img alt="仅对话视图" src="https://img.shields.io/badge/-仅对话视图-4d6bfe" />
  <img alt="性能优化" src="https://img.shields.io/badge/-性能优化-4d6bfe" />
</div>

<br />

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

| Layer | What happens |
|---|---|
| **Node half** (`lib/index.js`) | Empty `apply()` — just enough to be an active cordis loader entry so `dsh-client-modules` publishes `/plugins/dsh-question-rail/client.js`. |
| **Browser half** (`lib/client.js`) | Registers via `window.__ModuleLoader__.load`, then `apply(ctx)` injects the rail into the `shell.overlay` slot (frame-wide, additive, click-through until the entry opts in). |
| **Data** | Reads the current session's `ConversationSnapshot.nodes` (full list, not the windowed `chat.order`), extracts `user`/`steering` turns, and maps each `seq` → chat `key` for scroll anchors. |
| **View gating** | `ctx.slots.entries("conversation.session") → resolveStore(handle, sessionId) → store.getSnapshot().view` — the authoritative source DSH's own header tabs use. Renders only when `view === "chat"`. |

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

| Interaction | Behavior |
|---|---|
| Move mouse near the right edge | The strip widens, revealing each round's question as a single line (12px, right-aligned, trailing tick). |
| Hover a single question | A detail box appears on the left showing the **full question text** (scrollable up to 50vh). |
| Click a question | The chat scrolls smoothly to that turn and flashes a highlight ring. |
| Switch to 轨迹 / 上下文 / Design / PPT | The rail hides instantly (chat-view gate). |
| Empty / home screen | Nothing renders. |

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

## License

MIT
