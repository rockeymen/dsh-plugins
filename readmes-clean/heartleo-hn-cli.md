# hn

A terminal client for Hacker News.

![demo](docs/demo.gif)

## Features

- 📰 **Story browser** — Top, New, Best, Ask HN, Show HN with tab switching
- 💬 **Comment threads** — navigate with `j/k`, fold/unfold, lazy-load reply trees
- 🌐 **Translation** — translate a title with `t`, all visible titles with `T`, or a selected comment
- 🔄 **Soft refresh** — refresh stories or comments without restarting
- 🎨 **Themes** — hn, mocha, dracula, tokyo, nord, gruvbox
- ⚡ **Progressive loading** — visible range loads first, more fetched as you scroll

## Install

**Homebrew** (macOS / Linux):

```bash
$ brew install heartleo/tap/hn
```

**winget** (Windows):

```powershell
$ winget install heartleo.hn
```

**curl** (macOS / Linux):

```bash
$ curl -fsSL https://raw.githubusercontent.com/heartleo/hn-cli/main/install.sh | sh
```

No `sudo` needed — the binary is installed under your home directory. The install
directory is picked from the first of these that is set:

### Source · Value
- **Source**: `HN_INSTALL_DIR` · **Value**: used as-is
- **Source**: `XDG_BIN_HOME` · **Value**: used as-is
- **Source**: `XDG_DATA_HOME` · **Value**: `$XDG_DATA_HOME/../bin`
- **Source**: *(default)* · **Value**: `$HOME/.local/bin`

To install somewhere else:

```bash
$ curl -fsSL https://raw.githubusercontent.com/heartleo/hn-cli/main/install.sh | HN_INSTALL_DIR=~/bin sh
```

The script warns if the install directory is not on your `$PATH`, and prints the
`export PATH=...` line to add to your shell profile.

The script never calls `sudo`. To install system-wide, run it as root yourself:

```bash
$ curl -fsSL https://raw.githubusercontent.com/heartleo/hn-cli/main/install.sh -o install.sh
$ sudo env HN_INSTALL_DIR=/usr/local/bin sh install.sh
```

**Prebuilt binaries** — download from [GitHub Releases](https://github.com/heartleo/hn-cli/releases)

**Go install** (requires Go 1.25+):

```bash
$ go install github.com/heartleo/hn-cli/cmd/hn@latest
```

**Build from source:**

```bash
$ git clone https://github.com/heartleo/hn-cli
$ cd hn
$ go build -o hn ./cmd/hn
```

## Claude Code Plugin

This repo also ships [**hn**](plugins/hn), a Claude Code plugin that brings Hacker News to Claude.

```
/plugin marketplace add heartleo/hn-cli
/plugin install hn@hn-cli
```

### Skill · What it does
- **Skill**: `hn-digest` · **What it does**: Scan the front page — today's themes, hot discussions, industry mix

Then just ask: `what's on HN today`. Ask in any language and the digest comes back in that language. See the [plugin README](plugins/hn) for details.

The digest is also published daily at [hndigest.heartleo.dev](https://hndigest.heartleo.dev).

## DeepSeek Harness Plugin

For [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/) there is [**hacker-news**](plugins/hacker-news), a plain-ESM plugin that reads the public Hacker News APIs directly. It needs neither an HN API key nor a local terminal client.

### Install from npm

The published package is [`dsh-hacker-news`](https://www.npmjs.com/package/dsh-hacker-news). It is also listed in the [awesome-dsh-plugin community registry](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin). DSH profiles are pnpm workspace roots, so keep the `-w` flag:

```sh
dsh plugin --profile <name> add -w dsh-hacker-news
```

If your npm mirror has not indexed the latest release, run the installation against the public registry:

```powershell
$env:npm_config_registry = 'https://registry.npmjs.org/'
dsh plugin --profile <name> add -w dsh-hacker-news
```

Start or restart the same profile, then verify that the composed configuration includes `dsh-hacker-news`:

```sh
dsh --profile <name>
dsh --profile <name> --dump-config
```

### Install from source

This form follows the repository's `main` branch and is intended for development or trying unreleased changes:

```sh
dsh plugin --profile <name> add -w github:heartleo/hn-cli#path:/plugins/hacker-news
```

After installation, ask naturally, for example: `what's popular on HN?`, `search HN for sqlite`, or `read HN item 49322107 and summarize the discussion`.

### Tool · What it does
- **Tool**: `hn_stories` · **What it does**: Ranked feeds — top / new / best / ask / show / job
- **Tool**: `hn_item` · **What it does**: An item plus its reply tree in reading order
- **Tool**: `hn_search` · **What it does**: Algolia search, by relevance or date
- **Tool**: `hn_user` · **What it does**: Karma, account age, bio, submission count

See the [plugin README](plugins/hacker-news) for configuration.

## Quick Start

```bash
$ hn        # top stories
$ hn new    # new stories
$ hn best   # best stories
```

## Commands

### Browse

![browse demo](docs/demo-browse.gif)

Opens the interactive TUI. Defaults to Top stories; switch tabs with `←/→`.

```bash
$ hn        # top stories (default)
$ hn top
$ hn new
$ hn best
$ hn ask
$ hn show
```

### Comments

![comments demo](docs/demo-comments.gif)

Press `Enter` on any story to open its comment thread.

- navigate with `↑/↓` or `k/j`
- press `Enter` to expand or collapse a reply tree
- press `Space` to fold or unfold the selected comment
- press `C` / `E` to fold or unfold all
- press `r` to jump to the root comment
- press `R` to soft refresh
- press `Esc` to go back

### Translation

Translates via any OpenAI-compatible chat completions API. See [Configuration](#translation-1) to set up an API key.

```
t   translate selected story title (toggle cached translation)
T   translate all visible titles in one batch request
t   translate selected comment (in comment view)
```

### theme

```bash
$ hn theme          # show current
$ hn theme nord     # set globally
```

Available: `hn` · `mocha` · `dracula` · `tokyo` · `nord` · `gruvbox`

## Keys

### Story List

### Key · Action
- **Key**: `Enter` · **Action**: Open comment thread
- **Key**: `o` · **Action**: Open in browser
- **Key**: `t` · **Action**: Translate selected title
- **Key**: `T` · **Action**: Translate all visible titles
- **Key**: `←` / `→` · **Action**: Switch tab
- **Key**: `r` · **Action**: Refresh
- **Key**: `?` · **Action**: Toggle help
- **Key**: `q` / `Ctrl+C` · **Action**: Quit

### Comment Thread

### Key · Action
- **Key**: `j` / `↓` · **Action**: Next comment
- **Key**: `k` / `↑` · **Action**: Previous comment
- **Key**: `gg` · **Action**: Back to top
- **Key**: `r` · **Action**: Jump to root comment
- **Key**: `Enter` · **Action**: Expand / collapse replies
- **Key**: `Space` · **Action**: Fold / unfold selected comment
- **Key**: `C` / `E` · **Action**: Fold / unfold all
- **Key**: `t` · **Action**: Translate selected comment
- **Key**: `R` · **Action**: Soft refresh
- **Key**: `o` · **Action**: Open story in browser
- **Key**: `Esc` · **Action**: Back to list
- **Key**: `?` · **Action**: Toggle help
- **Key**: `Q` / `Ctrl+C` · **Action**: Quit

## Configuration

`hn` reads `~/.config/hn/config.json`. A `.env` file in the working directory is also loaded automatically; environment variables take precedence over the config file.

### Translation

### Variable · Default · Description
- **Variable**: `HN_TRANSLATE_API_URL` · **Default**: `https://api.openai.com/v1` · **Description**: API base URL
- **Variable**: `HN_TRANSLATE_API_KEY` · **Default**: — · **Description**: API key
- **Variable**: `HN_TRANSLATE_MODEL` · **Default**: `gpt-4o-mini` · **Description**: Model name
- **Variable**: `HN_TRANSLATE_LANG` · **Default**: `Chinese` · **Description**: Target language

Example `.env`:

```bash
HN_TRANSLATE_API_KEY=sk-...
HN_TRANSLATE_LANG=Chinese
```

### Theme

### Variable · Description
- **Variable**: `HN_THEME` · **Description**: Override theme without editing config

Example `~/.config/hn/config.json`:

```json
{
  "theme": "mocha",
  "translate": {
    "api_url": "https://api.openai.com/v1",
    "api_key": "sk-...",
    "model": "gpt-4o-mini",
    "language": "Chinese"
  }
}
```