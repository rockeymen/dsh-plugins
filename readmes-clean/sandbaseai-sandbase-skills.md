# SandBase Skills

**88 installable Agent Skills** for research, social intelligence, marketing, and business workflows. Install into any compatible agent (DeepSeek Harness, Claude Code, Codex, Cursor, Gemini CLI) and start working immediately. The flagship research Skill works with host-provided search tools; connect SandBase when you want broader provider coverage.

## What are Skills?

A Skill is an instruction file that teaches an AI agent how to do one specific job. Each Skill defines a repeatable workflow, evidence rules, and output format. Portable Skills can use capabilities already provided by the host agent; specialized social, market, and data workflows can add SandBase providers when configured.

## Quick Start

```bash
# Try it without installing: generate the complete Skill prompt
npx skills use sandbaseai/sandbase-skills@multi-source-search

# Or install it into Codex
npx skills add sandbaseai/sandbase-skills --skill multi-source-search --agent codex

# Use it with your agent's existing web/search tools
# "Fact-check this claim with independent sources and validate the evidence ledger"
```

`multi-source-search` needs no SandBase account when the host agent already provides
search and page-reading tools. For specialized social, market, and data-provider Skills,
set `SANDBASE_API_KEY` in your environment—never in a prompt or committed file.

### DeepSeek Harness

From the root of a DeepSeek Harness project:

```bash
npx --yes github:sandbaseai/sandbase-skills add multi-source-search
dsh web
```

The installer copies the complete Skill to `.dsh/skills/multi-source-search`,
DeepSeek Harness's project-scoped discovery directory. It runs directly from the
GitHub source, so no npm publication or SandBase account is required.

### Claude Code marketplace

Install all 88 Skills as a native Claude Code plugin:

```text
/plugin marketplace add sandbaseai/sandbase-skills
/plugin install sandbase-skills@sandbase-agent-skills
```

The marketplace manifest lists every Skill explicitly, so Claude Code can discover
them on demand without copying directories by hand.

### Verify research output offline

The [`multi-source-search`](research/multi-source-search/SKILL.md) Skill produces an
evidence ledger that can be checked before you trust or share its synthesis:

See the [complete worked example](examples/branch-protection-research.md), which
cross-checks one claim against primary documentation from GitHub, GitLab, and Atlassian.

```bash
python3 research/multi-source-search/scripts/validate_report.py \
  examples/verifiable-research-report.json
# VALID: 3 source(s), 1 claim(s), 2 provider(s)
```

The validator rejects unknown or duplicate sources, inflated confidence, unused
evidence, and high-confidence claims that still have a declared conflict. It runs
offline and checks internal consistency; it does not claim that a source is true.

## Try a Real Workflow

Install the matching Skill, then give your agent one of these tasks:

### Skill · Example task · What you get · Install
- **Skill**: [`twitter-intelligence`](research/twitter-intelligence/SKILL.md) · **Example task**: “Compare sentiment and recurring complaints for Brand A and Brand B on X this month.” · **What you get**: Source-linked posts, trends, accounts, and a structured comparison · **Install**: [skills.sh](https://www.skills.sh/sandbaseai/sandbase-skills/twitter-intelligence)
- **Skill**: [`multi-source-search`](research/multi-source-search/SKILL.md) · **Example task**: “Verify the strongest evidence for and against this market claim.” · **What you get**: Cross-checked web and academic findings with disagreements called out · **Install**: [skills.sh](https://www.skills.sh/sandbaseai/sandbase-skills/multi-source-search)
- **Skill**: [`competitor-monitor`](research/competitor-monitor/SKILL.md) · **Example task**: “Track three competitors’ pricing, launches, content, and social activity.” · **What you get**: A dated competitive-intelligence brief with observed changes · **Install**: [skills.sh](https://www.skills.sh/sandbaseai/sandbase-skills/competitor-monitor)
- **Skill**: [`seo-content-brief`](research/seo-content-brief/SKILL.md) · **Example task**: “Build a writer-ready brief for this target keyword.” · **What you get**: Search intent, competing pages, required subtopics, and differentiation angles · **Install**: [skills.sh](https://www.skills.sh/sandbaseai/sandbase-skills/seo-content-brief)
- **Skill**: [`github-profile-research`](research/github-profile-research/SKILL.md) · **Example task**: “Assess this engineering team’s open-source activity.” · **What you get**: Repository, language, contribution, star, and activity analysis · **Install**: [skills.sh](https://www.skills.sh/sandbaseai/sandbase-skills/github-profile-research)
- **Skill**: [`youtube-research`](research/youtube-research/SKILL.md) · **Example task**: “Map the leading channels and audience questions in this niche.” · **What you get**: Video and channel discovery, transcript evidence, and comment themes · **Install**: [skills.sh](https://www.skills.sh/sandbaseai/sandbase-skills/youtube-research)

## Skill Catalog (88 Skills)

### Social Intelligence (14 Skills)

Research and monitor conversations across every major social platform.

### Skill · Platform · Use it to
- **Skill**: `twitter-intelligence` · **Platform**: Twitter/X · **Use it to**: Search tweets, track trends, analyze users, monitor sentiment
- **Skill**: `youtube-research` · **Platform**: YouTube · **Use it to**: Search videos, analyze channels, extract transcripts, read comments
- **Skill**: `instagram-research` · **Platform**: Instagram · **Use it to**: Analyze profiles, track hashtags, research content strategies
- **Skill**: `tiktok-research` · **Platform**: TikTok · **Use it to**: Search videos, analyze creators, track hashtag challenges
- **Skill**: `linkedin-research` · **Platform**: LinkedIn · **Use it to**: Research companies, professionals, job markets
- **Skill**: `reddit-research` · **Platform**: Reddit · **Use it to**: Search discussions, monitor communities, discover trends
- **Skill**: `xiaohongshu-research` · **Platform**: Xiaohongshu (RED) · **Use it to**: Search notes, analyze creators, track consumer trends
- **Skill**: `weibo-research` · **Platform**: Weibo · **Use it to**: Monitor hot searches, track trending topics, analyze sentiment
- **Skill**: `douyin-research` · **Platform**: Douyin · **Use it to**: Search videos, analyze creators, track challenges
- **Skill**: `wechat-channels-research` · **Platform**: WeChat Channels · **Use it to**: Search videos, analyze live streams
- **Skill**: `wechat-mp-research` · **Platform**: WeChat Official Accounts · **Use it to**: Research articles, analyze accounts
- **Skill**: `wechat-search` · **Platform**: WeChat · **Use it to**: Search across WeChat ecosystem
- **Skill**: `china-social-research` · **Platform**: Multi-platform · **Use it to**: Cross-platform China social research
- **Skill**: `community-research` · **Platform**: Reddit + Telegram · **Use it to**: Online community analysis

### Search & Research (17 Skills)

Find, validate, and synthesize information from multiple sources.

### Skill · Use it to
- **Skill**: `multi-source-search` · **Use it to**: Cross-validate research with host search tools and optional Tavily, Exa, Scholar, and Cloudsway coverage
- **Skill**: `tavily-deep-research` · **Use it to**: Advanced web search with content extraction and site mapping
- **Skill**: `exa-deep-search` · **Use it to**: Semantic search and source extraction with Exa
- **Skill**: `exa-similar-finder` · **Use it to**: Find pages similar to any URL
- **Skill**: `academic-research` · **Use it to**: Search scholarly papers with AI-powered explanations
- **Skill**: `academic-trend-research` · **Use it to**: Track emerging research areas and breakthrough papers
- **Skill**: `google-news-research` · **Use it to**: Monitor news articles and media coverage
- **Skill**: `web-scraper` · **Use it to**: Scrape pages, crawl sites, extract structured data
- **Skill**: `last30days-research` · **Use it to**: Multi-platform research for the last 30 days
- **Skill**: `topic-deep-dive` · **Use it to**: Exhaustive multi-source topic research
- **Skill**: `event-tracker` · **Use it to**: Track events in real-time across platforms
- **Skill**: `trend-spotter` · **Use it to**: Spot emerging trends across platforms
- **Skill**: `news-aggregator` · **Use it to**: Aggregate news from multiple sources
- **Skill**: `market-research` · **Use it to**: Comprehensive market intelligence
- **Skill**: `newsletter-research` · **Use it to**: Discover industry newsletters and publications
- **Skill**: `podcast-research` · **Use it to**: Find podcasts and episodes by topic
- **Skill**: `content-ideation` · **Use it to**: Generate data-backed content ideas

### Business Intelligence (20 Skills)

Company research, sales intelligence, and competitive analysis.

### Skill · Use it to
- **Skill**: `apollo-company-research` · **Use it to**: Search companies, enrich profiles, track hiring
- **Skill**: `akta-company-research` · **Use it to**: Research companies via employee and product reviews
- **Skill**: `company-enrichment` · **Use it to**: Enrich company data from multiple sources
- **Skill**: `google-maps-reviews` · **Use it to**: Analyze local business reviews
- **Skill**: `product-intelligence` · **Use it to**: Cross-platform product market research
- **Skill**: `product-review-extractor` · **Use it to**: Extract and analyze product reviews at scale
- **Skill**: `competitive-pricing` · **Use it to**: Benchmark pricing against competitors
- **Skill**: `pricing-page-analyzer` · **Use it to**: Extract and analyze competitor pricing
- **Skill**: `review-aggregator` · **Use it to**: Aggregate reviews from multiple platforms
- **Skill**: `startup-research` · **Use it to**: Research startups with funding, team, and traction
- **Skill**: `hiring-intelligence` · **Use it to**: Analyze hiring patterns and talent competition
- **Skill**: `talent-sourcing` · **Use it to**: Source candidates by skills and expertise
- **Skill**: `lead-research` · **Use it to**: Build complete prospect profiles
- **Skill**: `outreach-builder` · **Use it to**: Build verified outreach lists
- **Skill**: `email-outreach-prep` · **Use it to**: Prepare personalized email outreach
- **Skill**: `sales-intelligence` · **Use it to**: Account intelligence for sales conversations
- **Skill**: `partnership-research` · **Use it to**: Qualify potential partners with data
- **Skill**: `industry-landscape` · **Use it to**: Map any industry's competitive landscape
- **Skill**: `local-market-research` · **Use it to**: Research local markets with reviews and social data
- **Skill**: `data-enrichment` · **Use it to**: Fill data gaps with verified intelligence

### Marketing & Content (15 Skills)

Brand monitoring, influencer marketing, and content strategy.

### Skill · Use it to
- **Skill**: `brand-monitoring` · **Use it to**: Track brand mentions across all platforms
- **Skill**: `kol-discovery` · **Use it to**: Find and evaluate influencers across platforms
- **Skill**: `influencer-analytics` · **Use it to**: Analyze influencer performance with engagement data
- **Skill**: `social-listening` · **Use it to**: Monitor conversations about any topic globally
- **Skill**: `competitor-content-intelligence` · **Use it to**: Find differentiated content opportunities
- **Skill**: `competitor-monitor` · **Use it to**: Monitor competitor launches, pricing, campaigns, and market signals
- **Skill**: `thought-leadership-monitor` · **Use it to**: Track industry voices and their content
- **Skill**: `pr-media-monitor` · **Use it to**: Track press mentions and media narrative
- **Skill**: `content-performance` · **Use it to**: Analyze content performance across platforms
- **Skill**: `audience-research` · **Use it to**: Understand target audiences from community data
- **Skill**: `social-proof-research` · **Use it to**: Find authentic testimonials and endorsements
- **Skill**: `competitor-ad-research` · **Use it to**: Research competitor advertising strategies
- **Skill**: `hashtag-tracker` · **Use it to**: Track hashtag performance across platforms
- **Skill**: `crisis-monitor` · **Use it to**: Detect and assess crises before they escalate
- **Skill**: `reddit-customer-insights` · **Use it to**: Discover customer language and pain points

### Marketing & SEO (5 Skills)

Search engine optimization, SERP analysis, and technical auditing.

### Skill · Use it to
- **Skill**: `seo-keyword-insights` · **Use it to**: Build evidence-backed keyword strategies with DataForSEO
- **Skill**: `backlink-gap-analysis` · **Use it to**: Find ethical backlink gaps against competitors
- **Skill**: `serp-analysis` · **Use it to**: Analyze live Google SERP results and features
- **Skill**: `seo-content-brief` · **Use it to**: Generate SERP-backed content briefs
- **Skill**: `site-audit` · **Use it to**: Audit website content, structure, and SEO health

### Tools & Utilities (17 Skills)

Practical tools for everyday agent tasks.

### Skill · Use it to
- **Skill**: `email-validator` · **Use it to**: Verify email deliverability and reputation
- **Skill**: `domain-intelligence` · **Use it to**: Research domains (WHOIS, DNS, SSL, security)
- **Skill**: `domain-analyzer` · **Use it to**: Complete domain analysis from DNS to SEO
- **Skill**: `tech-stack-detector` · **Use it to**: Identify what tech powers any website
- **Skill**: `screenshot-capture` · **Use it to**: Capture screenshots of any URL
- **Skill**: `url-to-markdown` · **Use it to**: Convert web pages to clean Markdown
- **Skill**: `youtube-transcript` · **Use it to**: Extract transcripts from YouTube videos
- **Skill**: `document-parser` · **Use it to**: Parse PDFs and documents to text
- **Skill**: `content-translator` · **Use it to**: Translate text between languages
- **Skill**: `sentiment-analyzer` · **Use it to**: Analyze sentiment in any text
- **Skill**: `weather-lookup` · **Use it to**: Check weather conditions worldwide
- **Skill**: `flight-tracker` · **Use it to**: Track flight status in real time
- **Skill**: `currency-converter` · **Use it to**: Convert currencies with live rates
- **Skill**: `github-profile-research` · **Use it to**: Research developer GitHub profiles
- **Skill**: `npm-package-research` · **Use it to**: Evaluate npm packages before installing
- **Skill**: `cve-lookup` · **Use it to**: Look up security vulnerabilities by CVE
- **Skill**: `website-monitor` · **Use it to**: Monitor websites for changes and health

## Install

```bash
# Install any Skill by name
npx skills add sandbaseai/sandbase-skills --skill <skill-name> --agent codex

# Global install (available across all projects)
npx skills add sandbaseai/sandbase-skills --skill <skill-name> --agent codex --global

# Browse available Skills
npx skills add sandbaseai/sandbase-skills --list
```

## Supported Agents

Skills work with any agent that implements the Agent Skills specification:

- **Claude Code** — `~/.claude/skills/`
- **OpenAI Codex** — `~/.codex/skills/`
- **Cursor** — `~/.cursor/skills/`
- **Gemini CLI** — `~/.gemini/skills/`
- **OpenClaw, Hermes, Amp, Devin** — via `npx skills add`

## How It Works

```
User Question → Agent reads SKILL.md → Uses host tools and/or SandBase → Validates evidence → Answer
```

1. You ask a question or give a task
2. Your agent reads the installed Skill's instructions
3. The Skill starts with compatible search or browser tools already available to the host
4. When configured, SandBase adds provider-specific capabilities via `sandbase_describe_tool` → `sandbase_call_tool`
5. The agent executes the workflow, validates structured evidence, and delivers the result

## SandBase Ecosystem

- [SandBase Harness](https://github.com/sandbaseai/sandbase-harness) — run
  persistent agent sessions with sandboxed tools, resumable streams, artifacts,
  cancellation, audit, and replay in your own infrastructure.

## Pricing

Skills themselves are free and open source (Apache-2.0). `multi-source-search`
can use compatible host-provided tools without a SandBase account. Optional SandBase
API calls are usage-based — typically $0.001–$0.01 per call. A typical research task
using those calls costs $0.05–$0.20.

See [sandbase.ai/pricing](https://sandbase.ai/pricing) for current rates.

## Repository Layout

```
research/<skill>/SKILL.md           Agent instruction file
research/<skill>/references/        API maps and workflow guidance
marketing/<skill>/                  Original marketing skills
catalog/skills/                     Web display metadata
integrations/sandbase-registry/     Platform registry manifests
scripts/skillpack.py                Validation helper
```

# Validate locally
python3 scripts/skillpack.py validate
python3 -m unittest discover -s tests -v
```