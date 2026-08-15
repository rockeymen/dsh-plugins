# DeepSeek Harness QQBot

An out-of-tree [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) channel plugin that connects an official QQ Bot Gateway to persistent Harness agents.

## Features

- Official `@tencent-connect/qqbot-nodejs` Gateway client
- C2C and group text messages
- Inbound PNG, JPEG, WebP, and GIF images as durable Harness attachments
- Automatic text-only fallback when the selected model does not accept image input
- Inbound voice transcripts and non-image attachment metadata with the temporary QQ download URL
- Outbound assistant text, images, and local workspace files
- A QQ-turn-scoped `qq_send_file` tool with workspace containment and file-size checks
- QQ Markdown replies, enabled by default
- One persistent Harness session per C2C or group conversation
- Harness agent-preset composition for the same tools, prompts, and skills as Web sessions
- Safe reuse of a live session already opened by Web, without a second session writer
- Proactive, requester-bound QQ approval prompts with one-shot Allow and Reject buttons
- Approval timeout rejection, fallback to another composed approval channel, and no escalation carry-over to later tool calls
- Typing indicators, long-reply splitting, per-conversation ordering, duplicate suppression, send retries, and bounded timeouts
- Open, allowlist, or disabled access policies for C2C and group traffic
- `/bot-ping`, `/bot-image-test`, `/bot-file-test`, `/bot-help`, `/bot-status`, and `/bot-cancel`
- Secrets resolved through the Harness credential service instead of plugin configuration
- Dormant startup when AppID or AppSecret is not configured, so installation alone never blocks DSH

## Requirements

- Node.js 22.19 or later
- pnpm 10.33.4
- DeepSeek Harness 0.1.0-rc.6 or later
- A QQ Bot AppID and AppSecret with C2C and/or group message events enabled; Inline Keyboard permission is required for QQ approval buttons

## Install from GitHub

```sh
pnpm dsh plugin --profile web add github:sliverp/DeepSeek-harness-qqbot
```

For a local checkout:

```sh
pnpm dsh plugin --profile web add /absolute/path/to/DeepSeek-harness-qqbot
```

## Configure

Set the AppID in the launch environment and store the AppSecret under the credential reference `QQBOT_APP_SECRET`. An environment value is supported for development:

```sh
export QQBOT_APP_ID='your-app-id'
export QQBOT_APP_SECRET='your-app-secret'
pnpm dsh --profile web
```

The bundle reads `QQBOT_APP_ID`, resolves `QQBOT_APP_SECRET` through `ctx.credentials`, and uses the launch directory as the agent working directory. `DSH_QQBOT_CWD` can override the working directory.

Installing the bundle does not require configuring credentials immediately. If the AppID is empty or the referenced AppSecret is absent or blank, the channel logs that it is inactive and lets DSH finish starting. Configure both values and reload or restart DSH to connect. A non-empty but invalid credential still fails during QQ authentication.

For a durable setup, put `QQBOT_APP_ID` in `~/.dsh/.env` and store `QQBOT_APP_SECRET` with the Harness credential settings surface. Never commit either value.

Override the plugin row in `~/.dsh/profiles/web/cordis.patch.yml` to change access policy or limits:

```yaml
- id: qqbot-channel
  name: deepseek-harness-qqbot
  config:
    appId: !!js process.env.QQBOT_APP_ID
    appSecretRef: QQBOT_APP_SECRET
    cwd: !!js process.env.DSH_QQBOT_CWD ?? process.cwd()
    agentPreset: standard
    c2cPolicy: allowlist
    c2cAllowFrom: [your-user-openid]
    groupPolicy: open
    requireMentionInGroup: true
    imageInputMode: auto
    markdownSupport: true
    approvalTimeoutMs: 120000
    maxOutboundFileBytes: 104857600
```

`imageInputMode` defaults to `auto`: image-capable models receive the durable image block, while text-only models receive a metadata notice and temporary source URL instead of failing the turn. Use `always` only for a route known to accept images, or `never` to force the text fallback.

`markdownSupport` defaults to `true`, matching Tencent's official QQBot channel plugin. It makes the QQ SDK send assistant text as `msg_type=2` so headings, lists, links, emphasis, tables, and code blocks can render in QQ. Set it to `false` only when the bot has not been granted QQ Markdown permission; the QQ API otherwise rejects Markdown messages.

`agentPreset` defaults to the Harness deployment's selected default (normally `standard`). The preset is recorded in the session header and mounted again on resume so QQ conversations receive the same tool, prompt, and skill composition as Web-created sessions. Sessions created by versions without preset composition use the `qqbot-v1-` namespace; this version starts corrected conversations under `qqbot-v2-` and leaves the old history untouched.

During a QQ-triggered turn, an operation that requires Harness approval produces a proactive QQ message with **Allow once** and **Reject** buttons. Only the QQ user who initiated that turn can decide it, including in groups. The grant covers only that exact operation; Harness does not provide a persistent “always allow” outcome. The QQ-scoped instructions require each later tool call to start with the standing sandbox and permit `sandbox_permissions` only on the exact retry of an operation that the sandbox just denied. Unanswered prompts reject after `approvalTimeoutMs`, which defaults to 120,000 milliseconds. A prompt-send failure delegates to another composed approval channel such as Web, while Web-triggered turns continue to use Web directly.

The scoped `qq_send_file` tool lets the agent send a file when the current QQ user asks to receive or download it. Relative paths resolve from `cwd`; absolute paths must also remain inside `cwd`. The plugin resolves symlinks, accepts only regular files, and rejects files larger than `maxOutboundFileBytes`. The default and QQ protocol maximum are 104,857,600 bytes (100 MiB).

The file tool is active only while the plugin processes the current QQ message, so continuing the persisted session from Web cannot send a file to the previous QQ target. If Web already has the same persisted session live, the QQ bridge borrows that agent, waits for its current activity to finish, and never tries to resume a second writer. Use `allowlist` access for every workspace that contains non-public data: an allowed QQ user also has access to the tools supplied by the selected agent preset.

## Verify

After the log reports `QQ Gateway connected`, send the bot `/bot-ping`. It should reply:

```text
pong — DeepSeek Harness QQBot 已连接。
```

Then send ordinary text or an image. The message is appended to the conversation's durable Harness session and the selected default model's response is sent back to QQ.

Send `/bot-image-test` to exercise the official QQ image-upload and outbound-image APIs without depending on model-generated media. The bot should send a blue PNG followed by a success message.

Send `/bot-file-test` to exercise the official QQ file-upload API without invoking a model. The bot should send `qqbot-file-test.txt` followed by a success message. Then ask the agent to send an existing workspace file, such as `Send README.md as a file`; the session should contain a `qq_send_file` call and QQ should receive the attachment.

To verify approval routing, use a permission preset that asks before sandbox escalation and request an operation that needs wider access. QQ should receive a proactive approval message with **Allow once** and **Reject**; choosing either button should resume the same turn without opening the Web approval panel.

## Development

```sh
pnpm install
pnpm run check
```