# @deepseek-ai/dsh-client-ui-conversation-outline

Adds a collapsible, per-conversation outline rail to the left of the Web chat transcript. It indexes the current session's user questions and agent answers in flow order; clicking an entry scrolls the transcript to that message and flashes it briefly. A keyword search box beside the title filters the index across each message's full text (case-insensitive). The rail follows its own bottom while the reader stays pinned, collapses to a slim control rail, and renders nothing while no session is current.

See [AGENTS.md](AGENTS.md) for the agent-facing deployment guide.

## Model Experience

None, as the outline renders session data already in the browser; nothing here reaches a model request.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

- The jump scrolls by chat node key, so it addresses only the currently loaded transcript window; a message outside the loaded history page is not reachable until that page is loaded.
- Assistant entries show their first text blocks only; tool calls and reasoning are not summarized in the index.