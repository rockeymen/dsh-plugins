# dsh-paste-path

A [DSH (DeepSeek Harness)](https://github.com/deepseek-ai/deepseek-harness) plugin: **copy a file in Windows Explorer, paste it into the DSH chat input, and its real absolute path is inserted automatically** — the Codex-style file reference flow, without leaving the browser.

> ⚠️ **This is NOT an npm package.** You cannot `npm install` it, and it cannot be mounted in `cordis.yml`. The two files under `plugin/` are **function bodies** for DSH's `cordis_define` tool (a dynamic Cordis plugin). To install, follow [Install & use](#install--use) below.

## Why this exists

Browsers never expose the real absolute path of a pasted file — `clipboardData.files[].name` only gives the basename, by security design. Codex can show full paths because it runs in a terminal, not a browser.

This plugin works around that with a simple trick: at paste time, the **host half reads the Windows clipboard's file drop list** (`Get-Clipboard -Format FileDropList` via PowerShell). When you `Ctrl+C` a file in Explorer, the clipboard keeps the full path list — so the host can recover the real absolute paths and send them back to the browser.

## Requirements

| Thing | Requirement |
| --- | --- |
| OS | Windows (uses PowerShell `Get-Clipboard`) |
| Browser | Chromium-based (Edge / Chrome) |
| DSH | Web GUI running on the same machine & Windows session as the files |
| Note | DSH backend must be on the same PC as the browser (localhost setup works) |

## Install & use

This is a **dynamic Cordis plugin** — no npm install needed; it lives for the current session (reload after a DSH restart if you need it again).

**🪄 Zero-manual-install option**: open a DSH chat, paste the contents of `plugin/host-half.js` and `plugin/client-half.js`, and say: *"Install this dynamic plugin: `code.host` from the first file, `code.client` from the second, then run it."* The agent defines and runs it for you.

1. In the DSH web GUI, call the `cordis_define` tool:
   - paste `plugin/host-half.js` content into `code.host`
   - paste `plugin/client-half.js` content into `code.client`
   - any `idPrefix` (e.g. `fpst`) and a name/purpose
2. Call `cordis_run` and **approve the Run** in the UI (the client half needs browser authorization).
3. Done. In Explorer, `Ctrl+C` a file (or folder / multiple files), then `Ctrl+V` into the DSH input box:
   - a single file → `D:\work\report.docx`
   - a folder → its full path
   - multiple files → each path, space separated
   - a path containing spaces → wrapped in double quotes

> Tip: pasting a **screenshot** (no file list on the clipboard) keeps DSH's original behavior — it's attached as an image, not turned into text.

## How it works

```
Explorer Ctrl+C (file)  ──►  clipboard holds CF_HDROP file list
Browser Ctrl+V (composer)
        │  window 'paste' listener (capture phase) takes over
        ▼
host.call('paste-paths', { files: [{name,size,type}] })
        │
        ▼  host half runs (unconfined, read-only command):
        │  Get-Clipboard -Format FileDropList  ──►  real absolute paths
        ▼
paths inserted at the caret (space-separated, quoted when needed)
```

Edge cases handled:

- **Screenshot / image paste** — clipboard has no file list → the plugin re-dispatches the paste so DSH's own image-attachment flow runs unchanged.
- **Name mismatch** (e.g. non-ASCII names through the pipe) — the pasted name filter is a preference, not a gate; the raw clipboard list is used when nothing matches.
- **Clipboard read failure** — falls back to inserting just the file names.

## Sandbox note

The clipboard query runs with `danger-full-access`. The dynamic host half hangs under the host root context (it has no session object), so it cannot resolve a session-scoped sandbox policy; the ACL sandbox runner cannot start for the agentless fallback workspace root (its temp dir sits inside the fallback workspace). The command is **fixed and read-only** (pure clipboard read, no filesystem access), so running it unconfined is safe. If you want a session-scoped policy instead, resolve the policy with your session and pass `sandboxPolicy` explicitly.

## Limitations / roadmap

- **Windows only** — the clipboard trick relies on PowerShell `Get-Clipboard`. macOS (`osascript`/`pbpaste`) and Linux (`xclip`) support could be added on the same host half.
- **Dynamic lifetime** — as shipped, the plugin is session-scoped and disappears on a DSH restart. A durable host-composition install is possible but currently **blocked upstream**: a static plugin's client half needs the client→host RPC channel (`@Remote` / `ctx.remote`), and that assembly requires an explicit `/remote` value import inside the DSH web composition — a build-time coupling only DSH maintainers can open for third-party packages. If that changes, an installable npm form (with `dsh.client` metadata) becomes a straightforward follow-up.
- **Chromium only** — the client half uses `DataTransfer`/`ClipboardEvent` and a capture-phase listener.

## License

[MIT](LICENSE)
