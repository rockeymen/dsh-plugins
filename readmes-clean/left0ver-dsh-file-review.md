# DSH File Review

**Review every file an agent just changed—without leaving DeepSeek Harness Web.**

## How to use

  💬 Chat  →  ✨ Generate  →  📄 Click a changed file  →  🔍 Review

## Preview

![leftover](./assests/preview.png)

## Features

1. A diff panel for instantly reviewing every file the agent just changed.
2. Undo support for reverting the agent's changes from the current turn.

## Quick start

### 1. Install the plugin

```sh
dsh plugin --profile web add dsh-file-review
```

### 2. Start DSH Web

```sh
dsh web
```

### 3. Enjoy it

## Install from source

```sh
git clone https://github.com/left0ver/dsh-file-review.git
cd dsh-file-review
pnpm install
pnpm run build
dsh plugin --profile web add ${PWD}
```

## Install from GitHub repository

```sh
dsh plugin --profile web add github:left0ver/dsh-file-review
```

## Update the plugin

```sh
dsh plugin --profile web update dsh-file-review
```

## Uninstall the plugin

```sh
dsh plugin --profile web remove dsh-file-review
```

## Friendly Links

[LINUX DO](https://linux.do/) — A new ideal community