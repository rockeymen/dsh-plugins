# dsh-path-anonymizer

A DeepSeek Harness plugin that detects workspace-external file paths in user messages before model requests, replaces them with numbered placeholders (`[PATH_n]`), and prompts the user to confirm whether the real paths should be sent to the model.

## Installation

```bash
dsh plugin --profile web add github:yzhangjy/dsh-path-anonymizer
```

Then restart the web profile.

## How It Works

1. **Detection** — regular expressions scan each user message for file paths.

2. **Anonymization** — each detected path is replaced with a numbered placeholder:
   ```
   /Users/alice/Documents/project/src/main.ts  →  [PATH_1]
   /etc/nginx/nginx.conf                      →  [PATH_2]
   ~/secrets/.env                             →  [PATH_3]
   ```

   **Workspace awareness** — paths that resolve *inside* the agent's working
   directory (`cwd`) are left untouched: the model already sees `cwd` in the
   system prompt and can explore the workspace itself, so anonymizing those
   would break coding with no privacy gain. Only paths *outside* the workspace
   (`~/...`, `/etc/...`, other projects, …) are anonymized. Set
   `anonymizeWorkspacePaths: true` to revert to anonymize-everything.

3. **Confirmation** — before the model request proceeds, a dialog appears listing every detected path and its placeholder. The user chooses:
   - **Send anonymized placeholders** (recommended) — the model sees `[PATH_n]`
   - **Send real paths** — original paths are restored
   - **Cancel this request** — the step is rejected

4. **Session memory** — the dialog includes a "remember" option so the same choice applies for the rest of the session.

### Effect on tool calls

Anonymization redacts **only the user-message text**. That does affect tool calls
in one specific way:

- When an external path is anonymized, the model sees `[PATH_n]` instead of the
  real path, so it **cannot call `read` / `edit` / `bash` on that path** — it does
  not know the real path. It will usually ask you to reveal it instead.
- Choosing **"send real paths"** in the dialog sends the path verbatim, so the
  model can access that external path normally.

This plugin is **message redaction, not a security sandbox**. It does not filter
the model's own tool calls, tool arguments, or tool results, and it does not
restrict filesystem access (DSH's sandbox governs that separately). A path the
model learns from a tool result or from its own exploration is **not** anonymized.

Workspace paths are untouched, so reading and editing files inside the workspace
works as usual.

## Configuration

### Key · Default · Description
- **Key**: `enabled` · **Default**: `true` · **Description**: Enable path detection and anonymization
- **Key**: `confirmEveryTime` · **Default**: `true` · **Description**: Show the confirmation dialog for every request
- **Key**: `maxPathsPerPrompt` · **Default**: `10` · **Description**: Max paths displayed in the confirmation dialog
- **Key**: `autoAnonymize` · **Default**: `false` · **Description**: Silently replace paths without showing a dialog
- **Key**: `anonymizeWorkspacePaths` · **Default**: `false` · **Description**: Also anonymize paths inside `cwd` (default keeps them for coding)
- **Key**: `detector.maxPaths` · **Default**: `50` · **Description**: Max distinct paths to detect in one batch
- **Key**: `detector.excludePatterns` · **Default**: `[]` · **Description**: Extra regex patterns for paths to ignore
- **Key**: `detector.includeSystemPaths` · **Default**: `false` · **Description**: Also detect system paths (`/usr/lib/`, `/etc/`, etc.)
- **Key**: `anonymizer.placeholderFormat` · **Default**: `[PATH_{n}]` · **Description**: Placeholder format; `{n}` is the match index

### Example: auto-anonymize mode

```yaml
- id: path-anonymizer
  config:
    enabled: true
    autoAnonymize: true   # never shows a dialog
```

### Example: exclude additional patterns

```yaml
- id: path-anonymizer
  config:
    detector:
      excludePatterns:
        - '^/nix/store/'
        - '^/home/ci/'
```

## Path Detection Details

### Matched patterns

### Pattern · Example
- **Pattern**: Unix absolute · **Example**: `/Users/alice/project/src/index.ts`
- **Pattern**: Windows absolute · **Example**: `C:\Users\alice\Documents\file.txt`
- **Pattern**: Home directory · **Example**: `~/.ssh/config`
- **Pattern**: Relative (`./`) · **Example**: `./src/components/App.tsx`
- **Pattern**: Relative (`../`) · **Example**: `../../config/database.yml`
- **Pattern**: Windows relative · **Example**: `.\lib\utils.js`
- **Pattern**: Env variable · **Example**: `%APPDATA%\MyApp\settings.json`
- **Pattern**: WSL · **Example**: `\\wsl$\Ubuntu\home\user\file.txt`

### Excluded by default

- URLs (`https://`, `ftp://`, `file://`)
- Shell redirects (`/dev/null`, `/dev/stdout`)
- System paths (`/usr/lib/`, `/etc/`, `/proc/`, `/sys/`, `C:\Windows\`) when `includeSystemPaths` is false
- Protocol-relative URLs (`//`)
- Lone slash (`/`)

## Known Limitations

- **Regex-only detection** — paths embedded in complex code syntax may be missed or falsely matched. The patterns balance recall against false positives for natural-language chat messages.
- **No filesystem validation** — a string that looks like a valid path is treated as one; the plugin does not check whether the file actually exists.
- **Message content only** — detection operates on text blocks within messages; non-text content blocks (images, tool calls) are not scanned.
- **One dialog per request** — a batch with paths in several messages shows one combined dialog, not one per path.