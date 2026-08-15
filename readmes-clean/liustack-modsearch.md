![ModSearch](https://raw.githubusercontent.com/liustack/modsearch/main/assets/banner.jpg)

# ModSearch

Give the web to any model without it: search, X, and any page.

🌐 The web plugin for DeepSeek Harness (dsh) 🌐

Engines: Antigravity CLI (free, default) · Tavily · Exa · Firecrawl · Grok (X) · local, with automatic failover

Models like DeepSeek-V4-Flash have no web access, or a weak one. ModSearch is a plug-in that greatly strengthens the model's web search, X search, and single-page fetch.

## Talk to us

Something broken, or something missing? [Open an issue](https://github.com/liustack/modsearch/issues/new/choose). For everything else, come find me on X: **[@liustack](https://x.com/liustack)**. What you built with it, which harness you are on, what should come next. New releases land there first, and a proper community space is on the way.

## Features

- **🌐 The web plugin for DeepSeek Harness (dsh):** one command, `npx -y @deepseek-ai/dsh plugin --profile web add @liustack/modsearch@latest`, and dsh's built-in `web_search` runs on the modsearch engine chain with no API key, keeping its native citation cards. Two tools dsh does not have land beside it: `x_search` for X (Twitter) and `read_page` for focused single-page reading. Details in [harness setup](docs/harness-setup.md#deepseek-harness-dsh).
- **Completely free.** The default channel is Antigravity CLI, no API key needed. All three fallback channels (Tavily, Exa, Firecrawl) offer monthly free tiers with no card required.
- **Automatic failover.** When a channel fails or exhausts its quota, the next one takes over.
- **Searches X (Twitter).** With Grok Build installed, ModSearch queries the corpus that web indexes cannot reach.
- **Install once, use everywhere.** Works in Claude Code, Codex, Pi, and OpenCode.

## Supported engines

Any one of these makes search work. Configure with one command each, keys are stored in `~/.modsearch/config.json` (0600, masked when shown):

| Engine | Does | Free tier | Turn it on |
| :-- | :-- | :-- | :-- |
| Antigravity CLI | web search + page fetch | free, browser sign-in | install `agy` and sign in |
| Tavily | web search | 1,000 credits/month, no card | `modsearch config set tavily.apiKey <key>` |
| Exa | web search | $10/month recurring credit (~1,400 searches), no card | `modsearch config set exa.apiKey <key>` |
| Firecrawl | web search + page fetch | 1,000 credits/month, search even works keyless | `modsearch config set firecrawl.apiKey <key>` |
| Grok Build | X (Twitter) search | rides SuperGrok or X Premium | install `grok` and sign in |
| local | page fetch | built in, nothing to install | nothing |

Keys can also come from the environment (`TAVILY_API_KEY`, `EXA_API_KEY`, `FIRECRAWL_API_KEY`). Multiple engines configured means automatic failover, best first. Using a Tavily-, Exa-, or Firecrawl-compatible third-party or self-hosted endpoint? Point the engine at it: `modsearch config set tavily.baseURL <url>`. Every knob, engine by engine, is in the [configuration guide](skills/modsearch/references/configure.md).

## Installation

**Step 1, set up a search engine (the only part that needs your hands).** The default engine, Antigravity CLI, requires a browser sign-in that only you can complete:

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
agy                                                           # sign in, then exit
```

Prefer not to install it? Register a free key with Tavily, Exa, or Firecrawl instead (Tavily 1,000 credits a month, Exa about 1,400 searches a month, Firecrawl 1,000 credits a month, no card required by any of them).

**Step 2, hand the rest to your AI.** Send it this line, along with the key if you chose one:

> Install and configure the modsearch skill following https://github.com/liustack/modsearch/blob/main/INSTALL.md, then run the health check and tell me the result.

## Usage

Once installed, just chat. Ask anything that needs checking, or paste a URL, and the skill triggers on its own: it picks an engine, runs the search or fetch, and the answer comes back with sources.

## See it work

Both screenshots are unedited runs from the Codex desktop app, driving a DeepSeek-V4-Flash that has no web access of its own.

Give it a blog link and ask what the post says. Twenty-five seconds later: a structured summary of the whole post, with no browser involved.

![Text-only DeepSeek summarising a blog link through ModSearch](https://raw.githubusercontent.com/liustack/modsearch/main/assets/demo-codex-fetch.png)

Give it no target at all, just "anything interesting in AI today?". Thirty-six seconds later: six sourced stories, with a closing note on which details came from aggregation and deserve a second look. The note comes from the `uncertainty` field.

![An open-ended question comes back as six sourced stories with a stated confidence caveat](https://raw.githubusercontent.com/liustack/modsearch/main/assets/demo-codex-search.png)

## Documentation

| Doc | Read it when |
| :-- | :-- |
| [INSTALL.md](INSTALL.md) | Installing the skill step by step (written for an agent) |
| [CLI manual](skills/modsearch/references/cli.md) | The CLI the skill drives: flags, config, doctor |
| [Troubleshooting](docs/troubleshooting.md) | A command failed and the message needs decoding |
| [Configuration](skills/modsearch/references/configure.md) | Setting a key, switching engines, fixing config |
| [Output contract](skills/modsearch/references/output-schema.md) | Parsing the JSON or building on it |
| [Harness setup](docs/harness-setup.md) | Wiring it into Codex, Claude Code, OpenCode, or Pi |
| [Security](docs/security.md) | SSRF guards, DNS-rebinding protection, untrusted input |
| [CHANGELOG](CHANGELOG.md) | Finding what changed in a version |

## Shameless plug

This project runs on LIUSTACK Skills: `shaping` before you build, `coding` while you build, `dig` when it breaks, `snapshot` when you hand off. Lighter than Superpowers, and stronger.

```bash
npx -y skills add liustack/liustack -g
```

⭐ If it helps, star [ModSearch](https://github.com/liustack/modsearch) and [liustack](https://github.com/liustack/liustack). Stars are how the next developer finds them.

## Disclaimer

ModSearch is MIT-licensed, so use is not restricted. The author gives no warranty and no endorsement for any particular use, commercial or otherwise. The upstream engines it drives (Antigravity CLI, Tavily, Exa, Firecrawl, Grok Build) each carry their own terms and quotas, and complying with them is the user's responsibility.