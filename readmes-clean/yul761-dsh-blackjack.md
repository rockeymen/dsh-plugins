# dsh-blackjack

> ⚠️ **Third-party community project disclaimer**
>
> This project is published and operated by an individual developer and is **not
> affiliated with any model vendor**: it is not an official project of any vendor,
> does not represent their position, is not endorsed or authorized by them, and does
> not use their names or logos as branding elements. The `dsh-` prefix in the project
> name merely follows the community's plugin naming convention and identifies the
> compatibility target.
>
> The upstream that the metering proxy forwards to is an **OpenAI-compatible endpoint
> configured by the operator**; whoever deploys this project decides which service to
> point it at.

An open-source **perk game** for the dsh community: developers play blackjack inside
their own dsh, winning **CHIP** — a game currency funded by the operator. CHIP converts
one-way into "redeemed credit", and that credit can only be spent through this project's
metering proxy. The core experience is: *out of credit mid-task? Play a couple of hands
to keep going.*

The repository contains two parts:

- **The plugin** (installed into each developer's own dsh): the table UI, balance and
  redemption interactions, and the transparent fallback route.
- **The central service** (`packages/server` in this repo, self-hosted by the operator):
  authoritative game state, a four-bucket conservation ledger, the metering proxy, and
  the periodic settlement jobs.

## Participation rules (important — read first)

- **Participation is always free.** A fixed number of free hands every day, at zero cost.
  There is no design — and never will be — that lets you *pay for hands, pay for better
  odds, or pay for better payouts*.
- **The game currency is one-way and closed.** For both CHIP and redeemed credit:
  - **not withdrawable**, not convertible to any fiat currency, and no monetary amount is
    displayed anywhere in the UI;
  - **not transferable** (including between players) and non-refundable;
  - **never lands in any model vendor's account**;
  - the **only** use is spending it through this project's metering proxy — there is no
    other exit.
- **Inactive balances are recycled.** Accounts with no games and no consumption for
  **7 consecutive days** have their balance recycled into the prize pool (the criterion is
  "played a hand or spent credit"; polling the query endpoints does not count as activity).
- **Redeemed credit does not currently expire.** Earlier copy said "valid until the end of
  the season", but season settlement (`seasonSettle`) never touches redeemed credit at all —
  that sentence did not match the implementation, so it has been changed to describe reality.
  Whether to zero it out at season end is a product decision that has not been made yet; if
  it ever is, it will be announced here and inside the plugin first.
- **Your own API key never enters this system**: it is not hosted, not held on your behalf,
  and never used as an in-game resource.
- **Points** are only a ranking and honor currency; they have no fixed exchange rate to CHIP.

## Installing the plugin

To play inside your own dsh you install `packages/plugin` (npm package name
`dsh-blackjack`); you never need to touch the server code:

```sh
dsh plugin --profile web add -w dsh-blackjack
dsh --profile web
```

> ℹ️ **On 0.2.1 and earlier, don't try it on the launch screen.** Running `/blackjack` on
> dsh's launch screen (the "Into the Unknown" view you get when you open a fresh dsh) used
> to execute the command while **nothing appeared on screen** — it looked exactly like a
> broken plugin. **Fixed in 0.2.2**, where the launch screen brings up the table directly.
> On 0.2.1 or earlier, send any message first so a conversation genuinely starts, or open
> an existing conversation from the sidebar, and *then* run `/blackjack`.
>
> This was never specific to this plugin — the host does it to **every command registered
> by any plugin**, and the fix is a plugin-side workaround rather than a host change, so
> other plugins remain affected. Mechanism and workaround in the
> [plugin README](./packages/plugin/README.md#the-launch-screen-used-to-be-blank-fixed-in-022);
> upstream discussion: https://github.com/deepseek-ai/deepseek-harness/discussions/4066
> (minimal reproduction in [`docs/repro/dsh-probe-repro/`](./docs/repro/dsh-probe-repro/)).

Replace `web` with whichever profile you are actually installing into. The `-w` flag is
mandatory: a profile directory is itself a pnpm workspace, and without that flag pnpm
refuses to install. The plugin's own full documentation — command table, config options,
what triggers the fallback route, participation rules, how to uninstall — lives in
[`packages/plugin/README.md`](./packages/plugin/README.md).

## Compliance and contact

This project operates under the obligation-based requirements of China's *Interim Measures
for the Management of Generative AI Services*: open registration, per-request traceable
logging, and a built-in kill switch that can stop service instantly.

- Compliance enquiries, takedown requests, abuse reports:
  **`<operator contact email placeholder: replace before deploying>`**
- On receiving a request from a regulator or from upstream, the operator will stop service
  immediately with the kill switch (see the runbook below) and respond.

## Quick start

### Environment variables

Copy `.env.example` to `.env` (`.env` is already in `.gitignore` — **never commit it**):

### Variable · Description
- **Variable**: `DATABASE_PATH` · **Description**: SQLite file path. Defaults to `/data/app.db` inside the container (on the mounted volume).
- **Variable**: `PORT` · **Description**: HTTP port, defaults to `8787`.
- **Variable**: `ADMIN_TOKEN` · **Description**: Credential for the `/admin/*` endpoints (header `X-Admin-Token`). **If unset, every admin endpoint returns 403.**
- **Variable**: `DEEPSEEK_API_KEY` · **Description**: API key for the upstream OpenAI-compatible endpoint (the variable name follows the existing name in the code). Only ever present in the server's environment.
- **Variable**: `DEEPSEEK_BASE_URL` · **Description**: Upstream base URL; the proxy forwards to `${BASE_URL}/chat/completions`.
- **Variable**: `GITHUB_CLIENT_ID` · **Description**: client_id of the GitHub OAuth App (a public value, used to build the authorize link on the pairing page). **Required for redemption.**
- **Variable**: `GITHUB_CLIENT_SECRET` · **Description**: client_secret of the same OAuth App, used only server-side to exchange the authorization code for an access token; it never appears in any response or log. **Required for redemption.**
- **Variable**: `PUBLIC_URL` · **Description**: The publicly reachable base URL of this service (no trailing slash), used to build the `/pair/<code>` links. **Required for redemption**, and in production it must be the real domain.

**Redemption config self-check (any one missing stops redemption, not the service)**: if any
of the three variables marked "required for redemption" above is missing, the redemption flow
would produce a link that **looks successful but is unusable** — a missing `PUBLIC_URL` hands
every player `http://localhost:8787/pair/<code>`, a missing `GITHUB_CLIENT_ID` builds
`authorize?client_id=&…`, and a missing `GITHUB_CLIENT_SECRET` guarantees the callback's token
exchange fails. So the server logs a loud warning at startup listing what is missing, and
`POST /api/pairing/start` returns **503** across the board (with `missingConfig` and
`operatorHint` in the body) rather than handing out a dead code. The game itself (dealing,
actions, balances) and the metering proxy do not depend on these three variables and keep
working normally.

### Running locally

```bash
pnpm install
pnpm --filter @dsh-blackjack/server test        # full test suite
pnpm --filter @dsh-blackjack/server typecheck
pnpm dev                                        # tsx watch
```

### Docker

```bash
docker build -t dsh-blackjack -f packages/server/Dockerfile .
docker run -p 8787:8787 -v "$PWD/data":/data -e ADMIN_TOKEN=... -e DEEPSEEK_API_KEY=... dsh-blackjack
```

The image runs as the non-root user `node` (uid 1000), and the database lands in `/data` by
default.

### Deploying on Railway

1. Create a service pointing at this repository. The `railway.json` at the repo root already
   points the builder at `packages/server/Dockerfile`; nothing extra to configure in the panel.
2. **You must mount a persistent volume at `/data`** (`railway volume add --mount-path /data`).
   Without a volume the database is written into the container's writable layer and **every
   redeploy silently loses every player balance**. `DATABASE_PATH` already defaults to
   `/data/app.db`.
3. The volume is owned by root, which overrides the `chown` done at image build time. This
   repo's entrypoint handles it: the container starts as root, hands only the data directory
   to `node`, then drops privileges with `setpriv` and execs the app. **Do not** switch to the
   `RAILWAY_RUN_UID=0` approach suggested in Railway's docs — that runs the whole app as root
   and throws away the non-root hardening.
4. **Set `PORT` explicitly to `8787`**, or change the service domain's target port to the
   `PORT` Railway injects (8080 by default). When the two disagree the platform shows Online
   while every external request gets a 502.
5. Configure the environment variables above, then confirm liveness with `/api/health`. With
   the two GitHub variables missing the service still starts normally; only
   `POST /api/pairing/start` returns 503 and lists which ones are absent.

> Points 2–4 above were all learned the hard way during this project's first real deployment:
> Railway's builder outright rejects a `VOLUME` instruction in a Dockerfile, so persistence
> must go through a platform-side volume.

### Single-instance constraint (important)

**This service can only run as a single process, and that process must own the one SQLite
file exclusively.** The following safety properties all depend on "serialized write
transactions inside one process":

- the daily free-hand cap and the "only one round in progress at a time" check;
- the per-player concurrency limit and per-minute rate limit in the metering proxy;
- atomic transfers in the four-bucket ledger.

Scaling horizontally (multiple replicas / processes / a shared volume) makes each of these
checks count on its own and drains the prize pool outright. Scaling out requires first moving
the ledger onto storage with real cross-process transactions, which is out of scope for v1.

### Identity binding: device-code pairing + GitHub OAuth authorization code flow

Redemption requires binding a GitHub account, and one GitHub identity maps to exactly one
player wallet: a player who is already bound cannot rebind (403), and once a GitHub id is
claimed it belongs to that player permanently (binding it to someone else returns 409). This
is the only anti-sockpuppet gate on the prize pool's exit, and the binding rules themselves do
not change.

Binding goes through the full GitHub OAuth authorization code flow, replacing the earlier
approach of "take an access token and call GitHub's user endpoint directly" (that approach did
not verify who issued the token, so a token issued for another application — or leaked from a
dev machine — could be used to bind; that hole is now closed):

1. The plugin calls `POST /api/pairing/start` (player-authenticated) and gets a single-use
   pairing code with a short TTL (900 seconds by default, `pairing_ttl_seconds`) plus a
   `${PUBLIC_URL}/pair/<code>` link, and prompts the user to open it in a browser.
2. The user opens that link in a browser: this step sets an HttpOnly, `SameSite=Lax` binding
   cookie in that browser, and the page first shows a warning (this will bind your GitHub
   account to a wallet and cannot be rebound; only continue if you generated this link
   yourself, and close it immediately if someone sent it to you) *before* the "Continue with
   GitHub" button, which redirects to GitHub's official authorize page (the `state` parameter
   is the pairing code).
3. GitHub sends the user back to `GET /auth/github/callback`. The server first checks that the
   cookie on the request matches the hash recorded when that pairing code was bound (a mismatch
   or a missing cookie is a 403 and nothing is written), then uses the
   `GITHUB_CLIENT_SECRET` — which **only the server holds** — to exchange the authorization
   code for an access token and read the user identity. No token ever passes through the plugin
   or the user's hands, so there is no question of an untrusted token origin.

   **Be precise about what this cookie does and does not prevent**: it proves that "the browser
   completing the OAuth callback" is "the browser that opened our own `/pair/<code>` page". What
   it blocks is an attacker bypassing that page — forging a GitHub authorize link or calling the
   callback URL directly — so that a victim's browser completes a binding without ever having
   touched our domain. What it **does not** prevent is luring a victim into personally opening
   an attacker-generated `/pair/<code>` link, seeing our own page with their own eyes, and
   clicking "Continue with GitHub" themselves: the victim's browser picks up the cookie normally
   and passes the check, and their GitHub identity still ends up bound to the attacker's wallet,
   irrevocably under the one-identity-one-wallet rule. The real mitigation for that second
   technique is the in-page warning in step 2 — putting "this binds your identity, and you
   should only continue if you generated this link yourself" in front of the user *before* they
   click, so they judge the link's provenance themselves, rather than leaning on the cookie
   (which is powerless here by construction — it proves "this browser visited our page", not
   "this browser's owner generated the pairing code").
4. Once the check passes, the binding is written and **the pairing code is rotated into a brand
   new one** (the original is voided, so the code value that passed through GitHub and browser
   history no longer represents any capability), followed by a 302 to the new code's pairing
   page, where the redemption form is submitted (`POST /pair/<new-code>/exchange`). **The code
   is voided again immediately after a successful redemption** — the same code cannot be reused
   to redeem repeatedly.

Unknown, expired and already-used pairing codes all return an indistinguishable 404, to prevent
enumeration.

**After binding, you never make this trip again.** The only reason the browser flow exists is
that GitHub's authorization code flow can only be completed in a browser, and binding only has
to happen once. Once a player is bound, the plugin calls `POST /api/exchange` directly with the
player token it already holds (binding required, otherwise 403
`github-binding-required`), which is what `/blackjack exchange <amount>` does. Both paths share
the same threshold and ledger checks: below the threshold is a 403 `below-exchange-threshold`
(with `thresholdChips` in the response), more than the balance is a 402 `insufficient-balance`,
and neither touches the ledger.

### Player-visible error bodies

Every player-visible error has this same shape:

```json
{ "error": { "code": "below-exchange-threshold", "message": "below exchange threshold", "thresholdChips": 30000 } }
```

- `code` is a stable kebab-case identifier and **is the contract between the server and the
  plugin**; the full list is `PLAYER_ERROR_CODES` in `packages/server/src/http.ts`, and that
  table constrains both the parameter type of the server's `playerError()` and the mapping tests
  on the plugin side, so renaming one without the other fails compilation or tests.
- `message` is for logs and `curl` debugging only. The server does not know the caller's
  language; the wording a player sees always comes from the plugin's own copy tables, looked up
  by `code` (`packages/plugin/src/i18n/`).
- The remaining fields inside `error` are structured facts (`thresholdChips`, `capChips`,
  `maxChips`, …) for the plugin to word its message with.
- A missing token, or one the server does not recognize: 401 `unknown-player-token`.

**The metering proxy (`POST /v1/chat/completions`) is excluded from this**: externally it must
keep the OpenAI-compatible `{ "error": { "message", "type" } }` shape — the host's model routing
layer decides whether to fall back based on that `type` vocabulary, and switching to the shape
above would break it. This inconsistency is deliberate, not an oversight.

## Operations runbook

Every tunable parameter lives in the database's `config` table (not hardcoded, not an
environment variable), is read and written through the admin endpoints, and takes effect
immediately (`max_body_bytes` is the exception — it needs a process restart):

```bash
# Ledger snapshot (four buckets + conservation verdict + kill switch state)
curl -H "X-Admin-Token: $ADMIN_TOKEN" https://<host>/admin/snapshot

# Operator view: DAU, funnel, free/raised round mix, pool flows, and the live value of every config key
curl -H "X-Admin-Token: $ADMIN_TOKEN" https://<host>/admin/metrics

# Change any config key (the key must be a known config key)
curl -X POST -H "X-Admin-Token: $ADMIN_TOKEN" -H 'content-type: application/json' \
  -d '{"key":"free_hands_per_day","value":"2"}' https://<host>/admin/config

# Grant credit to an account directly (pool → game balance → redeemed credit, all in one transaction).
# For seed accounts, compensation, and for testing anything (like the fallback route) that needs
# credit to exist first. Editing the database by hand breaks the four-bucket identity and trips the
# daily reconciliation kill switch, so this endpoint is the only way.
curl -X POST -H "X-Admin-Token: $ADMIN_TOKEN" -H 'content-type: application/json' \
  -d '{"githubLogin":"someone","amountMicro":300000}' https://<host>/adm