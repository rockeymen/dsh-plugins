# DSH File Review

**Review every file an agent just changed—without leaving DeepSeek Harness Web.**

> **Zero configuration:** install the plugin, restart the Web profile, and use DeepSeek Harness as usual.

# How to use

  💬 Chat &nbsp;→&nbsp; ✨ Generate &nbsp;→&nbsp; 📄 Click a changed file &nbsp;→&nbsp; 🔍 Review

# Preview
![leftover](./assests/preview.png)

## Quick start

### 1. Install the plugin

```sh
dsh plugin --profile web add dsh-file-review
```

### 2. Start DSH Web

```sh
dsh web
```

### 3. Review the next completed turn

Ask the agent to create or edit files. When the turn finishes:

1. Find the produced-file chips below the final response.
2. Click a file to open its diff.
3. Inspect the changes, expand hidden context, copy the diff, or open the file in your editor.

```text
Agent edits files  →  Turn completes  →  Click a file chip  →  Review the diff
```

## Install from source

```sh
git clone https://github.com/left0ver/dsh-file-review.git
cd dsh-file-review
pnpm install
pnpm run build
dsh plugin --profile web add ${PWD}
```

## Uninstall the plugin

```sh
dsh plugin --profile web remove dsh-file-review
```

## Friendly Links

[LINUX DO](https://linux.do/) — A new ideal community