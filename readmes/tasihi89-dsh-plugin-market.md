# dsh-plugin-market

English | [中文](README.zh.md)

A plugin market **with time-windowed trending charts**, living in the DeepSeek
Harness sidebar. Four plain-language categories × daily / weekly / monthly /
rising charts, 7-day sparklines, bilingual one-line blurbs, and one-click
install / update / uninstall — all inside `dsh web`.

> Status: v0.1 scaffold. Rankings data comes from the companion
> [`dsh-market-data`](https://github.com/Tasihi89/dsh-market-data) pipeline
> (GitHub Actions, zero servers); until that pipeline is live the plugin
> serves its bundled snapshot.

## Install

```sh
dsh plugin --profile web add @changeme/dsh-plugin-market
```

Restart `dsh web` (or use hot reload) — a **Plugin Market** row appears in the
sidebar under New Session, next to the task board.

## What it does

- **Charts, not just sorting**: daily / weekly / monthly star-delta rankings
  computed from a real time series, plus a Rising chart for plugins listed
  within 7 days. Every ranked card carries a 7-day sparkline.
- **Four categories, in plain words**: Do more / Look better / Less hassle /
  Connect more (hover shows the formal taxonomy).
- **Full market**: search, detail view, one-click install with hot reload,
  update (with pnpm release-age handling), uninstall with confirmation,
  npm weekly downloads as a second signal.
- **Bilingual**: UI copy and plugin blurbs in Chinese and English, following
  the DSH interface language.
- **Honest data**: catalog covers the whole `dsh-plugin` GitHub topic;
  entries without a verified install target show as "listed only" with a
  copyable CLI command instead of an install button.

## Security model

Ported from dsh-market's baseline: every mutating endpoint is same-origin
POST only; installs accept only catalog entries whose target re-validates
server-side; build scripts stay blocked by pnpm unless explicitly approved;
restart is limited to loopback requests.

## Development

```sh
pnpm install
npm run typecheck
npm run build      # lib/ (tsc) + client/client.js (tsdown factory bundle)
npm test           # vitest
```

Renaming the npm scope: see [RENAME.md](RENAME.md).

## License

MIT. Incorporates adapted code from
[dsh-market](https://github.com/dsh-market/dsh-market) (MIT) and
[dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) (Apache-2.0) —
see [NOTICE](NOTICE).
