[![skills.sh](https://skills.sh/b/octoparse/agent-skills)](https://skills.sh/octoparse/agent-skills)

<p align="center">
  <img src="assets/logo.png" alt="Octoparse" width="96" height="96">
</p>

<h1 align="center">Octoparse Agent Skills</h1>

<p align="center">
  <strong>Octoparse web scraping skills for coding agents</strong>
</p>

<p align="center">
  <a href="#skills"><img src="https://img.shields.io/badge/templates-670%2B-0055FF?style=flat-square&labelColor=0D1117" alt="670+ templates"></a>
  <a href="https://mcp.octoparse.com"><img src="https://img.shields.io/badge/MCP-compatible-30363D?style=flat-square&labelColor=0D1117" alt="MCP compatible"></a>
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> &bull;
  <a href="#skills">Skills</a> &bull;
  <a href="#example-use-cases">Use cases</a> &bull;
  <a href="#installation">Installation</a> &bull;
  <a href="#pricing">Pricing</a> &bull;
  <a href="#resources">Resources</a>
</p>

---

## Overview

An agent is only as useful as the data it can reach. These skills extend that reach:
describe what you need, and Octoparse collects it from the live web and returns it as rows
your agent can work with straight away.

- **The sites most requests are about** — 670+ maintained scrapers across Google Maps,
  Amazon, LinkedIn, Indeed, Booking, TripAdvisor, Reddit, TikTok, and YouTube, plus local
  directories in eight languages: Gelbe Seiten, Pagesjaunes, Naver, Suumo, MercadoLibre.
- **The scrapers you have already built** — tasks configured in your own Octoparse account
  run and export by name, side by side with the maintained ones.
- **Workflows that move from one site to the next** — collect a list of businesses, follow
  their websites, gather contact details there. The skills know which handoffs hold up.
- **A cloud that carries the work** — collection runs on Octoparse's servers, not your
  machine, and a long job keeps going after the conversation ends, ready to export when
  you return.

When your agent has access to all these data sources, it can suggest workflows you wouldn't
have thought to build yourself.

---

## Quick start

```bash
npx skills add octoparse/agent-skills
```

Or, in Claude Code:

```
/plugin marketplace add octoparse/agent-skills
/plugin install octoparse@octoparse-agent-skills
```

Authorize with `/mcp`, then ask for what you want:

> *Find dentists in Chicago with phone numbers and websites, and export them as CSV.*

From there the agent works out which template fits, what its inputs are actually called,
what the run will cost in rows, and where the results end up.

---

## Skills

| Skill | What it does |
|---|---|
| **[`octoparse-ultimate-scraper`](skills/octoparse-ultimate-scraper/)** | Picks the template a request calls for, runs it in the cloud, and exports the rows. Nine workflow guides carry the shortlists and the traps for each kind of job, from lead generation to price tracking. |
| **[`octoparse-mcp-setup`](skills/octoparse-mcp-setup/)** | Connect and authorize the Octoparse MCP server in any client. A bundled reference covers config paths and quirks for Claude Code, Cursor, VS Code, Gemini CLI, Qwen Code, TRAE, and OpenClaw, plus what to do about 401 and 403. |

---

## Example use cases

Each of these is a whole job rather than a single call — the agent picks the template, adds
a second pass when one genuinely helps, and tells you what it came back with.

| Use case | Example prompt |
|---|---|
| **Lead generation** | Find dentists in Chicago on Google Maps, then crawl their websites for emails and social links, and export a CSV for my CRM. |
| **Competitor pricing** | Pull the current price, stock, and seller for these 40 Amazon ASINs and put them in a spreadsheet. |
| **Market research** | Show me what's selling in Amazon Best Sellers for wireless earbuds, with the price band across the top 50 listings. |
| **Reputation analysis** | Pull recent reviews for our hotel from TripAdvisor, Booking, and Google Maps, and summarise the top complaint themes. |
| **Social listening** | Collect Reddit and X posts mentioning our brand, plus the comment threads, so I can analyse sentiment. |
| **Local market depth** | Find plumbers in Munich on Gelbe Seiten with phone numbers, or pull Suumo apartment listings in Setagaya with layout and station distance. |
| **Supplier vetting** | Shortlist suppliers on Kompass, then check each one's filings on North Data before I contact them. |


---

## Installation

Quick start covers the two common paths — `npx skills add` for any of 70+ agents, or the
plugin in Claude Code. What follows is everything around them.

### Options and MCP

`npx skills add` takes `--skill octoparse-ultimate-scraper` to install just the scraper,
`-g` to install user-wide, and `--list` to preview without installing.

It installs skill files only. The Claude Code plugin declares the MCP server itself, so
`/mcp` is all that is left there; with any other client, ask your agent to run the
`octoparse-mcp-setup` skill once the skills are in place — it finds the right config file
for your client and walks the authorization.

### Agent Plugins clients

The repo ships a root `plugin.json` and `mcp.json` conforming to
[Agent Plugins 1.0.0](https://agent-plugins.org), the vendor-neutral packaging standard
whose steering committee includes Amazon, Cursor, Microsoft, OpenAI, and Vercel. Clients
implementing it discover the skills and the MCP server without further configuration.

### Any other agent that reads Markdown

Point it at `skills/octoparse-ultimate-scraper/SKILL.md` and register
`https://mcp.octoparse.com` as an MCP server.

---

## Prerequisites

1. **An Octoparse account** — sign up at [octoparse.com](https://www.octoparse.com).
2. **Authorization** — `/mcp` opens browser OAuth. For headless or CI use, create an API
   key in the [account console](https://www.octoparse.com/console/account-center/api-keys)
   and send it as an `x-api-key` header.

---

## Resources

- **[MCP documentation](https://www.octoparse.com/docs/en/mcp)** — tool reference and
  authorization.
- **[Template library](https://www.octoparse.com/template)** — every template with its
  inputs, outputs, and pricing.
- **[Help center](https://helpcenter.octoparse.com)** — account and plan questions.
- **[Issues](https://github.com/octoparse/agent-skills/issues)** or support@octoparse.com —
  when something here is wrong or a site you need is missing.
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — repository layout and the checks that run on
  every change.

---

## Pricing

**A free account includes 2,000 rows per month** through MCP and the API, and it applies
to paid templates too, not just the free ones — enough to evaluate real workloads before
committing to a plan.

Beyond that allowance, templates bill per output line and many remain free. The agent
sizes every run in rows before starting it, so you know what a job will consume before it
runs rather than after.

See [octoparse.com/pricing](https://www.octoparse.com/pricing) for plan details.

---

<p align="center">
  <sub>AI agents reading this: start at <a href="skills/octoparse-ultimate-scraper/SKILL.md"><code>skills/octoparse-ultimate-scraper/SKILL.md</code></a> for routing and the execution contract.</sub>
</p>
