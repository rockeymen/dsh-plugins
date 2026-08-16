# dsh-notifier

Unified notification push plugin for DeepSeek Harness (DSH). One minimal `notify()` API in front, many channels behind — both your agent and the harness itself can push to wherever you live.

## Features

- **Dual trigger lines**:
  - **Auto status push** — listens to `session/event` (`turn/end`, `approval/asked`, `agent/error`) and notifies you when tasks finish, fail, or need approval. Debounced 10s, deduped by session.
  - **Agent-initiated** — registers a `notify` tool so the model can call it directly (e.g. when it finishes a long task or needs a decision).
- **26 channels out of the box** (zero runtime deps — only `fetch` + `node:crypto`), from a declarative spec engine (see the [channel matrix](#channels) below):
  - IM webhooks: Telegram / Slack / Discord / Feishu (signed) / DingTalk (HMAC signed) / WeCom / WeCom app / QQ official bot / OneBot 11 / Teams / Mattermost / Google Chat
  - Push apps: Bark / Pushover / PushDeer / Chanify / ntfy / Gotify / iGot
  - China ecosystem: WxPusher / PushPlus / Server酱 / Qmsg / 息知 — plus a generic `webhook` for anything else, and a local terminal `bell`
- **Level-based routing** — `timeSensitive` / `active` / `passive` levels map to per-channel delivery semantics (silent push, priority headers, @-mentions) with tiered retries.
- **Remote approval (optional)** — answer agent approval requests from your phone via Telegram buttons; silence never approves, falls back to the desktop. See [Remote Approval](#remote-approval-双向回传可选).
- **Remote conversation (optional)** — chat with your agent from your phone: plain text is delivered as `followup` (idle) or `inject` (busy), `!` prefix steers mid-turn, and a merge window reassembles rapid-fire mobile typing. See [Conversation](#conversation-远程会话可选).
- **Long-message segmentation** — outbound messages over the per-channel budget are split into `（i/n）`-prefixed segments, delivered in order; any segment failing fails the whole send.
- **Anti-disturb rules** — per-result event gating, keyword include/exclude (literal or regex), and an idle grace window: if you type within `graceSeconds` after a turn ends, the notification is cancelled. See [Rules](#rules--local-bell-防打扰规则可选).
- **Notification ledger & daily digest (optional)** — every broadcast is appended to a local JSONL ledger; on startup you get one `passive` summary of yesterday's traffic. Ledger failures never affect delivery. See [Ledger](#ledger--daily-digest-通知账本可选).
- **Channel health check** — an agent-facing `notify_test` tool plus a standalone CLI (`scripts/test-channel.mjs`) verify a channel end-to-end (config → resolve → send) without touching your real notification semantics.
- **Tool rate limiting** — the `notify` tool is capped by a sliding window (`toolRateLimitPerMinute`, default 10/min, `0` = off), so a prompt-injected agent can't flood your channels.
- **Secrets safe** — channel keys marked `role('secret')`, redacted everywhere including custom webhook headers; `${ENV:NAME}` references keep secrets out of your profile.
- **Never breaks startup** — misconfigured or missing channels are skipped silently with a log line.

## Install

```bash
dsh plugin add dsh-notifier
```

## Configuration

Add channels to your profile patch (`cordis.patch.yml`):

```yaml
insert:
  - id: dsh-notifier
    name: dsh-notifier
    config:
      channels:
        - type: telegram
          botToken: "123456:ABC-DEF..."
          chatId: "987654321"
        - type: dingtalk
          webhook: "https://oapi.dingtalk.com/robot/send?access_token=..."
          secret: "SEC..."
        - type: feishu
          webhook: "https://open.feishu.cn/open-apis/bot/v2/hook/..."
        - type: wxpusher
          appToken: "AT_..."
          uids: ["UID_..."]
        - type: pushplus
          token: "..."
        - type: serverchan
          sct: "SCT..."
        - type: bark
          key: "your-device-key"   # or selfHost: "https://your-bark-server"
        - type: webhook
          url: "https://your-webhook"
          headers: { "x-token": "..." }   # optional
```

## Usage

### Auto push

Just enable the plugin. `turn/end` (success/error/cancelled), `approval/asked`, and `agent/error` events are pushed to all configured channels.

### Agent-initiated

The model can call the `notify` tool:

```
notify({ message: "调研完成，结果已写入 docs/", channel: "telegram", title: "任务完成" })
```

A second tool `notify_test` is registered for health checks: it sends a fixed self-test message (omit `channel` to broadcast) and renders results for config debugging — use it when you want to verify a channel is wired up, not to notify yourself. Both tools are rate-limited with their own sliding window (`toolRateLimitPerMinute`, so a test storm can't bypass the notify limit).

### Health check CLI

Verify one channel outside the harness (exit code 0/1, scriptable):

```bash
node scripts/test-channel.mjs telegram '{"botToken":"...","chatId":"..."}'
node scripts/test-channel.mjs bark --config-file cfg.json   # ${ENV:NAME} refs resolved like runtime
echo '{"key":"..."}' | node scripts/test-channel.mjs bark
```

## Ledger & daily digest (通知账本，可选)

Set `digest.enabled` to append every broadcast to `ledger.jsonl` (timestamp, level, title, delivered/failed channels) under `inbound.stateDir`. On startup, if yesterday had traffic and today's digest hasn't been sent, one `passive` summary is pushed through normal routing; same-day restarts never re-send (`ledger-state.json` remembers the last digest date). The ledger is append-only with amortized compaction (`maxEntries`, default 500), skips corrupt lines, and stays silent on any disk error — it can never break delivery.

```yaml
insert:
  - id: dsh-notifier
    config:
      digest:
        enabled: true
        maxEntries: 500      # compact back to this when 2x exceeded
      inbound:
        stateDir: "~/.dsh/dsh-notifier"   # ledger.jsonl lives here too
      channels:
        - type: bark
          key: "your-device-key"
```

## Remote Approval (双向回传，可选)

Approval requests can be answered from your phone. v0.3.0 ships five inbound channels (telegram / feishu / qq / wxpusher / wechat — see [Inbound channels](#inbound-channels-v030)); telegram / feishu / qq / wechat are long-lived connections or long polling — **no public IP required** (only the wxpusher callback needs to be publicly reachable). The whole stack only starts when `inbound.allowUsers` is non-empty (default-deny whitelist).

```yaml
insert:
  - id: dsh-notifier
    config:
      channels:
        - type: telegram
          botToken: "123456:ABC-DEF..."
          chatId: "987654321"
      inbound:
        allowUsers: ["987654321"]   # your Telegram user id — empty = inbound disabled
        # telegram:                  # optional; falls back to the outbound telegram channel
        #   botToken: "..."
        #   notifyChatIds: ["987654321"]
        # stateDir: "~/.dsh/dsh-notifier"  # pending approvals / dedup / poll cursor
      approval:
        mode: answer                 # observe = push-only shadowing; answer = remote can decide
        timeoutMs: 120000            # no answer → silently fall back to desktop (never auto-approve)
        numberedReply: true          # reply "1" approve / "2" reject on button-less channels
        # escalation:                # re-remind if nobody answers
        #   enabled: true
        #   stages: [{ afterMs: 30000 }, { afterMs: 60000 }]
```

Security properties (all enforced in tests):

- Whitelist default-deny — inbound messages from unknown users are dropped.
- HMAC one-time tokens in every button; replay / forgery / expiry all rejected, first decision wins.
- **Silence never approves** — timeout, parse failure, or any error returns control to the desktop.
- Pending approvals, dedup table, and the polling cursor survive restarts (atomic JSON store).

## Inbound channels (v0.3.0)

Four new inbound channels ride alongside telegram — same whitelist / approval / conversation routing (put the matching platform user id into `inbound.allowUsers`). Button-capable channels (telegram / feishu) approve via card buttons; button-less channels (qq / wxpusher / wechat) approve by **replying `1` (approve) / `2` (reject)**.

### Channel · Transport · Credentials · Buttons · Public IP · Notes
- **Channel**: `feishu` · **Transport**: WebSocket long connection (official SDK, lazy-loaded) · **Credentials**: appId + appSecret (custom app) · **Buttons**: ✅ card · **Public IP**: none · **Notes**: Set event subscription to "long connection"; missing SDK degrades with a Chinese hint
- **Channel**: `qq` · **Transport**: WebSocket gateway, bare protocol (zero SDK) · **Credentials**: appId + appSecret (q.qq.com) · **Buttons**: ❌ numbered reply · **Public IP**: none · **Notes**: C2C DMs + group @; passive replies preferred (separate msg_seq quota)
- **Channel**: `wxpusher` · **Transport**: HTTP callback (`send_up_cmd`) · **Credentials**: appToken · **Buttons**: ❌ numbered reply · **Public IP**: **required** (frp/proxy → `127.0.0.1:8103`) · **Notes**: Secret path is the credential (random 32B hex); upstream `#{appId} command`
- **Channel**: `wechat` · **Transport**: iLink long polling (bare protocol, zero deps) · **Credentials**: QR login via CLI · **Buttons**: ❌ numbered reply · **Public IP**: none · **Notes**: Personal account; one token = one instance; circuit breaker (3 hits/60s → open 15s)

```yaml
inbound:
  allowUsers: ["ou_feishu_openid"]        # user ids of the channels you actually enable
  feishu:
    appId: "cli_xxx"
    appSecret: "${ENV:FEISHU_SECRET}"
  qq:
    appId: "102030405"
    appSecret: "${ENV:QQ_SECRET}"
    # notifyUsers: ["openid_xxx"]          # optional approval push targets (fallback: allowUsers)
    # notifyGroups: ["group_openid"]
  wxpusher:
    appToken: "AT_xxx"
    # webhookPath: "/hook/<random secret>" # auto-generated & printed; host/port configurable
    # allowedIps: ["<WxPusher egress IP>"] # optional second gate
    # notifyUids: ["UID_xxx"]
  wechat: {}                               # credentials come from the login CLI (below)
  # wechat:
  #   notifyUsers: ["wxid_xxx"]
```

WeChat (iLink personal account) needs a one-time QR login; credentials are stored automatically (state.json, 0600):

```bash
node scripts/wechat-login.mjs          # renders a QR in the terminal; --state <dir>
```

Engineering notes (all test-backed):

- **qq**: the official Node SDK is effectively unmaintained — this channel is a bare-protocol implementation (IDENTIFY/RESUME/heartbeat/reconnect; automatic token fetch + cache).
- **wechat**: `context_token` learned on every inbound message and echoed on send; `ret=-2 + unknown error` masquerading as rate-limit triggers a tokenless retry before being counted; `ret=-14` clears credentials and disables the channel with a re-login hint; proactive-send rate limits trip the breaker, any inbound message resets it. Same iLink protocol proven in production by Hermes / OpenClaw.

## Conversation (远程会话，可选)

Whitelisted users can talk to running agents from their phone. The router rides the same inbound stack as remote approval (all five inbound channels as of v0.3.0, `inbound.allowUsers` whitelist); enable it simply by filling the whitelist — no extra switch.

Delivery semantics are picked from agent state:

### You send · Agent idle · Agent busy
- **You send**: plain text · **Agent idle**: `followup` — starts a new turn · **Agent busy**: `inject` — queued at the next step boundary, never interrupts
- **You send**: `!text` · **Agent idle**: `steer` (host maps it to followup) · **Agent busy**: `steer` — redirects the current turn

Typing on a phone fragments sentences. The **merge window** (default 1500 ms) collects consecutive messages from the same user into one before delivery:

- `something..` — trailing `..` flushes immediately
- `something!!` — trailing `!!` flushes immediately **and** steers

Command set (processed instantly, never merged):

### Command · Effect
- **Command**: `/status` · **Effect**: Show your binding and all live agents with status
- **Command**: `/bind <sessionId>` · **Effect**: Pin delivery to one session (survives restarts)
- **Command**: `/unbind` · **Effect**: Drop the pin; fall back to the most recently active agent
- **Command**: `/stop` · **Effect**: Cancel the bound agent's current turn
- **Command**: `/help` · **Effect**: Command help

```yaml
inbound:
  allowUsers: ["987654321"]
  conversation:
    mergeWindowMs: 1500   # 0 disables merging (deliver each message as-is)
    steerPrefix: "!"      # single-char prefix that means steer
```

Unknown commands fall through as plain text, so nothing gets swallowed. Replies (command feedback, "no active session" notices) go back through the channel the message arrived on (all five inbound channels).

## Rules & local bell (防打扰规则，可选)

Not every event deserves a push. Three gates run on the auto-push line, in order:

1. **Event gating** — turn each trigger off, or gate `turn/end` by result kind.
2. **Keywords** — `exclude` wins over `include`; invalid regex entries degrade to literal matching instead of crashing.
3. **Grace window** — after a debounced `turn/end`, wait `graceSeconds`; if any `user/*` session event arrives (you're at the keyboard), the notification is cancelled. Approvals and errors skip the window — they're waiting on a decision.

```yaml
insert:
  - id: dsh-notifier
    config:
      events:
        turnEnd: true            # or per-result: { completed: false, aborted: false }
        approval: true
        agentError: true
      keywords:
        include: []              # whitelist: text must hit at least one (empty = all pass)
        exclude: ["heartbeat"]   # blacklist: any hit suppresses
        regex: false             # treat entries as RegExp source
        caseSensitive: false
      graceSeconds: 120          # 0 (default) = off; headless one-shots usually want 0
      channels:
        - type: bell             # local terminal bell (BEL), no credentials
          count: 2               # rings 1-5
```

`bell` is the host-half local channel for headless/TUI runs (Codex BEL equivalent) — it rings once per notification, respects `silent`, and needs no credentials. The **client half** (`desktop` system notifications / `sound` cues / out-of-view suppression) ships as an experimental skeleton (`src/client/desktop-sound.mjs`): pure decision logic + a documented mount contract for the DSH client runtime, no fake client code in the host repo.

## Channels

### type · Channel · Auth · Free?
- **type**: `bark` · **Channel**: Bark (iOS) · **Auth**: device key (or self-host URL) · **Free?**: ✅
- **type**: `bell` · **Channel**: Terminal bell (local) · **Auth**: — · **Free?**: local
- **type**: `chanify` · **Channel**: Chanify (iOS) · **Auth**: token (or self-host) · **Free?**: ✅
- **type**: `dingtalk` · **Channel**: DingTalk custom robot · **Auth**: webhook + secret (HMAC sign) · **Free?**: ✅
- **type**: `discord` · **Channel**: Discord webhook · **Auth**: webhook URL · **Free?**: ✅
- **type**: `feishu` · **Channel**: Feishu custom bot · **Auth**: webhook (+ sign secret) · **Free?**: ✅
- **type**: `gchat` · **Channel**: Google Chat · **Auth**: space webhook URL · **Free?**: ✅
- **type**: `gotify` · **Channel**: Gotify · **Auth**: server URL + app token · **Free?**: self-host
- **type**: `igot` · **Channel**: iGot (iOS) · **Auth**: push key · **Free?**: ✅ (limits)
- **type**: `mattermost` · **Channel**: Mattermost · **Auth**: base URL + token (+ channel) · **Free?**: self-host
- **type**: `ntfy` · **Channel**: ntfy · **Auth**: topic (+ server URL) · **Free?**: ✅ (self-host)
- **type**: `onebot` · **Channel**: OneBot 11 (QQ) · **Auth**: HTTP endpoint · **Free?**: self-host
- **type**: `pushdeer` · **Channel**: PushDeer · **Auth**: push key · **Free?**: ✅
- **type**: `pushover` · **Channel**: Pushover · **Auth**: user key + app token · **Free?**: paid (one-time)
- **type**: `pushplus` · **Channel**: PushPlus (WeChat) · **Auth**: token · **Free?**: ✅ (limits)
- **type**: `qmsg` · **Channel**: Qmsg酱 (QQ) · **Auth**: key + qq number · **Free?**: ✅ (limits)
- **type**: `qq-bot` · **Channel**: QQ official bot · **Auth**: appId + appSecret · **Free?**: ✅
- **type**: `serverchan` · **Channel**: Server酱 (WeChat) · **Auth**: sendkey · **Free?**: ✅ (limits)
- **type**: `slack` · **Channel**: Slack · **Auth**: incoming webhook URL · **Free?**: ✅
- **type**: `teams` · **Channel**: Microsoft Teams · **Auth**: Power Automate workflow URL · **Free?**: ✅
- **type**: `telegram` · **Channel**: Telegram Bot API · **Auth**: bot token + chat id · **Free?**: ✅
- **type**: `webhook` · **Channel**: Any custom endpoint · **Auth**: — · **Free?**: —
- **type**: `wecom` · **Channel**: WeCom group robot · **Auth**: webhook key · **Free?**: ✅
- **type**: `wecom-app` · **Channel**: WeCom app message · **Auth**: corpid + agentId + secret · **Free?**: ✅
- **type**: `wxpusher` · **Channel**: WxPusher (WeChat) · **Auth**: appToken + uid · **Free?**: ✅ (limits)
- **type**: `xizhi` · **Channel**: 息知 Xizhi · **Auth**: sendkey · **Free?**: ✅ (limits)

## Development

```bash
npm test          # node --test, 329 cases
```

Pure ESM (`.mjs`), zero runtime dependencies. To add a channel: implement the adapter interface (`resolve(cfg)` + `send(msg)`) in `src/adapters/` and register it.

Other plugins can reuse the notifier via `createNotifier(ctx, channels, { routing, segment, onSend })` — `onSend(record)` fires after every broadcast with level/delivered/failed details, ready for custom ledgers or metrics.

## TODO

- Full client half for desktop/sound channels (Web Notification / Web Audio)
- Web settings UI