[English](README.md) | [简体中文](README.zh-CN.md)

# dsh-file-panel-left

**A "files-only workbench" sidebar for DSH Web** — file explorer, editor, and previewer in one panel. Left tree, right content: browse, edit, reference, and open files from the chat, all in a single surface.

It is a trimmed-down fork of the community plugin [`dsh-better-sidebar`](https://github.com/omdsh-dev/DSH-better-sidebar) by [omdsh-dev](https://github.com/omdsh-dev), keeping only file-related capabilities (file tree / editor / preview / @-references / opening chat files) and removing everything unrelated: terminal, browser, Git, task management, tabs, downloads, and the plugin market. Formerly named `dsh_left_bar`, renamed and released independently in 2026.

**中文简介**：DeepSeek Harness Web 的「纯文件工作台」左侧边栏插件 —— 文件资源管理器、编辑器、预览器一体，左树右内容，支持 @引用与聊天文件打开，按会话隔离。精简自社区插件 `dsh-better-sidebar`（作者 [omdsh-dev](https://github.com/omdsh-dev)，[仓库](https://github.com/omdsh-dev/DSH-better-sidebar)，MIT 许可），只保留文件相关能力（文件树 / 编辑器 / 预览 / @引用 / 聊天文件打开），已删除终端、浏览器、Git、任务管理、标签栏、下载与插件市场。完整中文文档见 [README.zh-CN.md](README.zh-CN.md)。

## Features

**A files-only workbench**

- Split layout with the file tree always docked on the left (search / refresh) and opened files on the right; a placeholder shows until a file is selected
- Terminal, browser, Git, task management, tab bar, downloads, and plugin market are removed to keep the focus on file work

**File tree**

- Lazy directory loading (one level at a time) — large folders stay responsive
- Symlink support: link targets are resolved to their real kind, and broken links are flagged
- UNC network paths work
- Global file-name search (300 ms debounce, abortable); truncated results are reported
- Refresh button; a tree-header “+” and a row-hover “+” create new files (inline input, Enter to create / Esc to cancel; new files are not auto-opened)
- Single click opens a file; clicking blank space selects a directory (as the target for new files), with selection highlighting
- Right-click to copy relative or absolute paths

**CodeMirror 6 editor**

- Syntax highlighting for 20+ languages: JS/TS/JSX, JSON, Python, HTML, CSS, Markdown, XML, YAML, SQL, Java, C/C++, C#, Kotlin, Swift, Rust, Go, PHP, Shell, TOML, INI, nginx, Dockerfile, properties, and more (including a custom INI highlighter)
- Ctrl/Cmd+F search panel, bracket matching, code folding, auto-indent, active-line highlighting, Alt+drag column selection
- One-click JSON/JSONC formatting (Ctrl/Cmd+Shift+F)
- Ctrl/Cmd+S to save; an auto-save poller also writes every second (only when there are unsaved changes)

**6 built-in file viewers**

- Image / PDF / Markdown / HTML / Code (catch-all) / binary notice
- Markdown has preview and edit modes; previews render Mermaid diagrams
- HTML previews run inside a sandboxed iframe (no access to GUI data or local files) with a “Refresh preview” button
- Oversized files are truncated (first 512 KB shown); unsupported binary types get a clear notice

**@-references (plugin “Add to conversation” + DSH's official source)**

- Select code in the editor and release the mouse — the “Add to conversation” popup inserts a pure reference line `@relative/path L12-L25` (real line numbers, no selection text copied — token-friendly; single-line selections become `@path L12`, unresolved ranges fall back to a bare `@path`)
- Line numbers are trustworthy: read straight from CodeMirror (edit mode) or two-level back-matching in the markdown preview (rather fall back to a bare reference than emit wrong numbers)
- The draft shows a blue capsule; hover its left edge and click the × to remove it; clicking the capsule opens the file in the sidebar editor
- DSH's official `@` source (0.1.1-rc.2+, file chips without line numbers) coexists in the same menu; the plugin never touches official chips (no ×, no interception)
- Ships a `file-line-reading` skill that teaches the AI to read only the referenced line range

**Context menu**

- Copy relative path / copy absolute path / rename / delete
- Rename pre-checks for duplicates and invalid characters; delete asks for confirmation and moves to the system Recycle Bin / Trash (Windows / macOS); the session root cannot be deleted

**Smart layout**

- Collapse/expand button: every expand action (button, opening a file from the chat, opening a file) restores 65% of the viewport width for comfortable reading
- The content-area “Close” (X) button collapses the display page and narrows the panel to just the tree; selecting a file again restores 65%
- Both the panel width and the tree-column width are draggable (tree column 240–480 px, default 280 px) and persisted per session

**Chat integration**

- File links in the chat (tool rows, the official produced-files row, prose mentions) open in the sidebar instead of the system default app
- The produced-files row is rendered by DSH's official `ui-deliverables` (0.1.1-rc.2+); this plugin intercepts its open action so produced files and inline-code mentions open in the sidebar — the one remaining differentiation

**Extensibility & localization**

- External plugins can register sidebar tabs and file viewers through the `ctx.betterSidebar` service
- UI copy is bilingual (Chinese/English) and follows the DSH language setting live
- Session isolation: each conversation has its own working directory and panel state; layout preferences persist

**Platform fit**

- Windows title-bar compatibility mode (reserves space for the native title bar in frameless windows)
- Deployments without a settings service fall back to `~/.dsh/dsh-file-panel-left-prefs.json` for preferences

## Installation

> Requirements: Node.js ≥ 20 and DSH Web (with the `dsh` CLI). Peer dependencies (React 18, Cordis, and the `@deepseek-ai/dsh-*` family) are provided by the DSH runtime — nothing to install manually.

### Published release (npm)

```bash
dsh plugin --profile web add dsh-file-panel-left
```

- One command installs and mounts the plugin: the bundle patch declared in the package (`cordis.patch.yml`) makes the CLI register it in the profile's bundle stack automatically — no config file edits
- After installation, restart DSH and hard-refresh the browser (Ctrl+Shift+R / Cmd+Shift+R) to see the sidebar
- Pin a version: `dsh plugin --profile web add dsh-file-panel-left@<version>`
- Uninstall: `dsh plugin --profile web remove dsh-file-panel-left`
- If the profile previously mounted the plugin manually (a mount line in its `cordis.patch.yml`), remove that line before switching to the CLI channel to avoid double-mounting (two sidebars)

### Local development (file: dependency)

Add the local dependency in the profile directory (e.g. `~/.dsh/profiles/web`) `package.json`:

```json
"dependencies": {
  "dsh-file-panel-left": "file:<local-path>/dsh-file-panel-left"
}
```

Mount the plugin row in the profile's `cordis.patch.yml` (choose this or the CLI channel — not both):

```yaml
- insert:
    - id: dsh-file-panel-left
      name: 'dsh-file-panel-left'
```

Then install:

```bash
cd ~/.dsh/profiles/web
pnpm install
```

Note: pnpm `file:` dependencies are **copied**, not symlinked. After every source change, delete the stale copy under `node_modules/dsh-file-panel-left` in the profile and reinstall, or the browser keeps loading the old build:

```powershell
Remove-Item -LiteralPath "$env:USERPROFILE\.dsh\profiles\web\node_modules\dsh-file-panel-left" -Recurse -Force
cd $env:USERPROFILE\.dsh\profiles\web; pnpm install
```

## Usage

- **File tree**: single-click a file to open it; use the tree-header or folder-row “+” to create files (Enter creates / Esc cancels); the search box filters by name; right-click a row to copy its path, rename, or delete
- **Editor**: code and config files open in the CodeMirror editor; `Ctrl/Cmd+S` saves and the auto-save poller writes every second; `Ctrl/Cmd+F` searches; code/config files get folding, bracket matching, and column selection; JSON files show a format button (`Ctrl/Cmd+Shift+F`)
- **Preview**: Markdown files toggle between Preview and Edit (Mermaid diagrams render in preview); HTML files render in a sandboxed iframe with a refresh control; images and PDFs preview directly; unsupported binary types show a notice
- **Context menu**: copy relative path, copy absolute path, rename (duplicates are rejected), delete (confirmed, then moved to the Recycle Bin)
- **@-reference**: select code in the editor and release the mouse, then click “Add to conversation” in the popup — the draft gets a blue `@relative/path L12-L25` capsule (hover its left edge and click the × to remove it). DSH's official `@` source (no line numbers) is also available in the same menu

## Configuration

The plugin has **no settings page** — behavior is built-in by design:

- Expanding the panel = 65% of the viewport width (drag to fine-tune; remembered per session)
- Auto-save: polls every 1 second, writes only when there are unsaved changes; cannot be disabled
- Chat file-open interception: always on (tool rows, produced files, mentions all open in the sidebar); no toggle
- Delete: confirmed, then moved to the system Recycle Bin / Trash (Windows 10/11 and macOS)
- HTML preview: sandboxed by default (no access to GUI data or local files)
- Preferences (e.g. title-bar compatibility) persist through the settings service; deployments without one fall back to a local file

## Platform support

| Platform | Status |
| --- | --- |
| Windows 10 / 11 | Fully supported: delete moves to the Recycle Bin (via PowerShell's Microsoft.VisualBasic.FileIO — zero extra dependencies); title-bar compatibility mode available |
| macOS | Fully supported: delete moves to the Trash (via osascript invoking Finder — zero extra dependencies); title-bar compatibility does not apply |
| Linux | All file features (browse / edit / preview) work, plus DSH's built-in `@` references; **delete is permanent** (Linux has no system Recycle Bin — deletion asks for a second confirmation and cannot be undone) |

## Known limitations

- Files are classified by extension and a NUL-byte probe of the head: **UTF-16 / UTF-32 encoded text is reported as binary** (the head contains `0x00` bytes) and shows the binary notice instead of the editor — re-encode as UTF-8 to view it. Detect-by-encoding would require reading the whole file first.

## Development

```bash
pnpm install
pnpm build        # type-checked build via tsc, then bundled by tsdown into lib/
pnpm typecheck    # type-check only (tsc --noEmit)
```

Iteration loop: `pnpm build` → force-sync into the profile (see “Local development”) → restart DSH for host changes, hard-refresh the browser for client changes → verify in the browser.

## Tech stack & architecture

- **Host (Node)**: a Cordis plugin exposing API routes for file tree / read / write / search / Recycle-Bin delete / rename, plus preference persistence (settings service or local-file fallback)
- **Client (browser)**: React 18 + CSS Modules; file tree, split layout, and the viewer registry
- **Editor**: CodeMirror 6, with language packages and extensions loaded on demand
- **Lazy chunks**: heavy modules (Mermaid, the editor) are loaded as chunks only when the first matching file is opened
- **Service base**: the `ctx.betterSidebar` service lets external plugins register tabs and viewers
- **i18n**: wired to the DSH locale service — Chinese/English, switching live
- **Session isolation**: per-conversation working directory and panel state; preferences persist in localStorage (key `dsh_left_bar:v1`)

## License

[MIT](./LICENSE)

## Credits

A trimmed-down fork of the community plugin **dsh-better-sidebar** by [omdsh-dev](https://github.com/omdsh-dev) ([DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar), MIT license — previously named `dsh_left_bar`, renamed in 2026). Thanks to the upstream design and implementation; the upstream copyright notice is retained in [LICENSE](./LICENSE).
