<div align="center">

# dsh-plugin-chatcut

**Edit videos with AI, right inside DeepSeek Harness.**

Bring [ChatCut](https://chatcut.io) — the agent-native video editor — to [DSH (DeepSeek Harness)](https://github.com/deepseek-ai) as a first-class MCP plugin: 50 editing tools + 15 craft skills, with one-time OAuth setup and fully automatic token refresh.

[中文文档](README.zh.md) · [Quick start](#quick-start) · [How it works](#how-it-works)

`#dsh-plugin` `#mcp` `#video-editing` `#chatcut`

![demo: agent removes filler words, timeline ripples closed](assets/demo.gif)

</div>

---

## What you get

Ask your DSH agent, in plain language:

- 🎙️ **Talking-head cleanup** — "remove all filler words and awkward pauses" (transcript-based editing: the agent edits *text*, the timeline follows)
- ✂️ **Highlight cuts** — "make a 30s version about pricing", "keep the best take"
- 💬 **Captions** — styled, bilingual, word-level karaoke highlight
- 🎨 **Motion graphics** — generated from JSX code, or from ChatCut's template library
- 🔍 **Zoom, transitions, LUTs, sound effects** — from the built-in library
- 🖼️ **AI generation** — images (GPT Image), video (Seedance), music, TTS, voice clone
- 📤 **Export** — mp4 / audio / SRT / **NLE XML** (Premiere · DaVinci · FCP) / transparent-background MG ProRes

Everything lands on a real multi-track NLE timeline you can also edit by hand at [chatcut.io](https://chatcut.io) — the agent and you share the same project, live.

## Why this plugin

ChatCut officially ships plugins for **Claude Code** and **Codex** only. This project adapts it to DSH:

| Official plugin | This adapter |
|---|---|
| MCP server (streamable-http + OAuth) | bridged via `@deepseek-ai/dsh-mcp-client` (stdio bridge) |
| `claude mcp login` handles OAuth | `chatcut-login.mjs` — standard PKCE + dynamic registration |
| Host keeps tokens fresh | `chatcut-bridge.mjs` auto-refreshes on 401 and persists tokens |
| 15 craft skills (SKILL.md) | installed into `$DSH_HOME/skills/` unchanged, plus a DSH host-adapter skill |

**Configure the token once. Never think about it again.** The bridge refreshes the access token with the rotating refresh token and stores it locally (`0600`).

## Quick start

Prereqs: a [ChatCut account](https://chatcut.io) (free tier works), DSH Desktop, network access to `api.chatcut.io`.

```sh
git clone https://github.com/nigedazhima/dsh-plugin-chatcut.git
cd dsh-plugin-chatcut
```

**1. Log in (one time)** — opens your browser for ChatCut OAuth:

```sh
# macOS with DSH Desktop (no separate Node needed):
ELECTRON_RUN_AS_NODE=1 "/Applications/DSH Desktop.app/Contents/MacOS/DSH Desktop" scripts/chatcut-login.mjs
# or, with Node >= 18:
node scripts/chatcut-login.mjs
```

Tokens are written to `scripts/.tokens.json` (git-ignored, mode 0600).

**2. Install the skills:**

```sh
cp -R skills/chatcut "$HOME/Library/Application Support/dsh-desktop/harness/skills/"
```

**3. Mount the MCP server** — copy `cordis-patch-example.yml` into your `$DSH_HOME/cordis.patch.yml`, replacing `<REPO>` with this repo's absolute path.

**4. Restart DSH Desktop.** In a new session, ask: *"list your mcp__chatcut__ tools"* — you should see ~50 tools.

## How it works

```
DSH agent ──(stdio MCP)── chatcut-bridge.mjs ──(streamable-http + Bearer)── api.chatcut.io
                              │
                              ├─ 401? → refresh_token → new access_token → persist
                              └─ .tokens.json (0600, git-ignored)
```

- The bridge reuses the official `@modelcontextprotocol/sdk` already bundled with DSH — zero npm installs on macOS.
- Skills are the official ChatCut craft skills (talking-head guide, motion graphics, captions, export, …) plus a thin DSH host-adapter that maps Claude-Code-isms (tool prefixes, login commands, browser panes) to DSH equivalents.
- Transcript-first editing: the killer workflow is `read_script` → edit a markdown file with ~~strikethrough~~ → `apply_script`. Deleting a sentence in text deletes it on the timeline.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| No `mcp__chatcut__*` tools in session | Bridge failed to start — check `$DSH_HOME` harness log; usually missing `.tokens.json` (run login) |
| Bridge says refresh_token invalid | Re-run `chatcut-login.mjs` (one browser round) |
| `api.chatcut.io` timeouts | Region-dependent; set `HTTPS_PROXY` for the login script, and add it to the bridge `env` in the cordis patch |
| Tools listed but calls fail | Check you're signed into the same ChatCut account in the browser editor |

## Security notes

- No credentials ship with this repo. `.tokens.json` is created locally by you and git-ignored.
- The OAuth client is registered dynamically (RFC 7591); no shared client secrets.
- Token file is chmod 0600; refresh tokens rotate on every refresh.

## License

GPL-3.0-only — same as the upstream [ChatCut agent-plugin](https://github.com/ChatCut-Inc/agent-plugin), from which the `skills/chatcut/resources/` are redistributed unchanged.

## Credits

- [ChatCut](https://chatcut.io) for the editor and the official agent plugin
- [DeepSeek Harness](https://github.com/deepseek-ai) for the pluggable agent runtime

*If this saved you an editing afternoon, a ⭐ helps others find it.*
