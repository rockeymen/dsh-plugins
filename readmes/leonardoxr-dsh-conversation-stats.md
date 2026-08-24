# dsh-conversation-stats

A DeepSeek Harness plugin that makes the conversation statistics row configurable without patching Harness.

It shadows the shipped `conversation.composer.dock` entry with the same `stats` id at a lower public slot priority, preserving the normal placement and visuals while allowing each metric to be hidden independently.

## Settings

Open **Settings → Plugins → Conversation statistics**. Changes apply live.

- Entire statistics row
- Turns
- Steps
- LLM time
- Tool-call time
- Average time to first token (TTFT)
- Decode throughput (tokens/second)
- Cache-hit percentage
- Input tokens
- Output tokens

All metrics are enabled by default and keep the standard order. The row follows the active DSH English or Chinese locale. It uses the durable whole-session projections when available and preserves the shipped loaded-window fallback otherwise.

## Development

```sh
pnpm install
pnpm check
pnpm pack
```

Install the packed tarball through a DSH profile, then restart Web when convenient so the new host namespace and client bundle are discovered.
