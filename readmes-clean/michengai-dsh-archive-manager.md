![DSH Archive Manager](assets/icon.png)

# DSH Archive Manager

  An npm-installable DeepSeek Harness Web plugin for managing archived sessions.

  · [View on npm](https://www.npmjs.com/package/@michengai/dsh-archive-manager)

  ![Archived Sessions settings page](assets/screenshots/archived-sessions.png)

> DSH Archive Manager is a community-maintained plugin. It is not an official DeepSeek AI product.

## What it provides

- **Archived Sessions settings page** — placed directly after Connectors and grouped by workspace.
- **Dark session cards** — show the session title and update time with explicit restore and delete actions.
- **Safe unarchive** — restores a session to its original workspace position.
- **Permanent deletion** — removes the transcript, workspace accounting, archive marker, and projection-cache record after confirmation.
- **Immediate sidebar cleanup** — deleted cold sessions emit the standard removal event, so they do not reappear under Recent.

## Quick start

You need a working DeepSeek Harness Web installation. Do not run `npm install` in an arbitrary directory: install the published package into the DSH Web profile instead.

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile web add @michengai/dsh-archive-manager
```

Restart DSH Web and hard-refresh the browser after installing or upgrading. No source checkout is required.

If a package mirror has not synchronized the latest version yet, append `--registry=https://registry.npmjs.org/` to the install command.

## Use Archived Sessions

1. Open **Settings → Archived Sessions**.
2. Select a workspace group to review its archived sessions.
3. Choose **Unarchive** to restore a session, or **Delete** to permanently remove it.
4. Confirm deletion. This action cannot be undone.

## Before you delete

- Deletion always requires confirmation.
- A deleted session is removed from its transcript directory, workspace records, archived-session set, and projection cache.
- Live sessions finish writing before cleanup; unloaded archived sessions are also removed from connected sidebars.

## Can't find Archived Sessions?

Restart DSH Web and hard-refresh the browser after installing or upgrading the plugin. The entry is located in **Settings**, directly after **Connectors**.