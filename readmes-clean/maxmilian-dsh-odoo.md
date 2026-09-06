# dsh-odoo

`dsh-odoo` is a free, open-source, read-only DeepSeek Harness plugin for the Odoo external API.
It lets an agent inspect Odoo business data — contacts, quotations, sales orders, invoices,
project tasks, leads, stock — without changing Odoo state. One opt-in tool can create a
strictly limited draft record, and it is not even registered unless you enable it.

> ⚠️ **Not yet validated against a live Odoo server.** Every compatibility assumption in this
> release is taken from the Odoo documentation and covered by mocked tests only. Verify the
> plugin against your own instance before relying on it.

## Tools

### Tool · Purpose
- **Tool**: `odoo_server_info` · **Purpose**: Read the server version and the authenticated user id.
- **Tool**: `odoo_describe_model` · **Purpose**: List the queryable fields of one allow-listed model.
- **Tool**: `odoo_search_read` · **Purpose**: Run a restricted `search_read` on one allow-listed model.
- **Tool**: `odoo_create_draft` · **Purpose**: Create one draft record. **Requires `allowWrite: true`**; otherwise it is never registered.

## Transport

This plugin speaks **JSON-RPC 2.0** to `POST {baseUrl}/jsonrpc`, so your Odoo server must expose
that endpoint (it is provided by the `web` module). If the endpoint is missing, redirected, or
intercepted by a proxy, every tool fails with a `TRANSPORT_UNSUPPORTED` error that says so.
XML-RPC is not implemented.

## Requirements

- DeepSeek Harness with compatible `@deepseek-ai/dsh-tools` APIs
- Node.js 22.19 or newer in the 22.x line, or Node.js 24 or newer
- Bun 1.3.5 or newer when installing from GitHub source or developing locally
- An Odoo URL, database name, login, and API key (or password) with access to the models you query

## Configuration

Environment variables are recommended so credentials do not appear in a profile patch:

```sh
export ODOO_URL='https://odoo.example.com'
export ODOO_DB='production'
export ODOO_USERNAME='integration@example.com'
export ODOO_API_KEY='your-api-key'
```

Plugin config takes precedence over environment variables:

### Config · Environment fallback · Default
- **Config**: `baseUrl` · **Environment fallback**: `ODOO_URL` · **Default**: required
- **Config**: `db` · **Environment fallback**: `ODOO_DB` · **Default**: required
- **Config**: `username` · **Environment fallback**: `ODOO_USERNAME` · **Default**: required
- **Config**: `apiKey` · **Environment fallback**: `ODOO_API_KEY` · **Default**: required
- **Config**: `companyId` · **Environment fallback**: `ODOO_COMPANY_ID` · **Default**: unset
- **Config**: `allowWrite` · **Environment fallback**: none (deliberately) · **Default**: `false`
- **Config**: `locale` · **Environment fallback**: none · **Default**: `en` (`en` / `zh-TW` / `zh-CN` / `ja`)
- **Config**: `defaultLimit` · **Environment fallback**: none · **Default**: `20` (1–100)
- **Config**: `requestTimeoutMs` · **Environment fallback**: none · **Default**: `30000` (1–300000)
- **Config**: `maxResponseBytes` · **Environment fallback**: none · **Default**: `1000000` (1–52428800)

Credentials are only required when a tool actually runs: installing the plugin without filling
them in does not break profile loading. `locale` switches tool and parameter descriptions;
tool names and error messages always stay in English.

## Safety

- **Read-only by default.** No `write`, `unlink`, or workflow actions exist in this release.
- **Model allow list.** Queries are limited to 14 standard models: `res.partner`, `res.users`,
  `res.company`, `product.product`, `product.template`, `sale.order`, `sale.order.line`,
  `purchase.order`, `account.move`, `account.move.line`, `project.project`, `project.task`,
  `crm.lead`, `stock.quant`.
- **No relational traversal.** Domain field names may not contain dots. To filter by a related
  record, query the related model first and then filter with `('partner_id','in',[ids])`. This
  keeps the allow list an actual capability boundary instead of a suggestion.
- **No binary fields.** Fields whose Odoo type is `binary` are rejected, and default field sets
  never include one.
- **Bounded responses.** Default fields per model, `limit` ≤ 100, `offset + limit` ≤ 10000,
  single string values truncated at 2000 characters, and a hard byte cap on every response.
- **Only non-archived records** are returned; the `active_test` context is not exposed.
- **Draft creation is opt-in and fixed.** `sale.order` is always created with `state=draft`;
  `project.task` may not specify `state` or `stage_id`, so Odoo applies its own default stage.
  Only an allow-listed subset of fields is accepted, and one-to-many commands are rejected.

## Non-goals for 0.1

- No business wrapper tools (`list_customers`, `list_quotations`, …). They depend on field
  assumptions that cannot be verified without a live Odoo, and a wrong assumption returns an
  empty result instead of an error — the worst failure mode for an agent. Deferred to 0.2.
- No updates, deletions, or workflow transitions; no attachments or report generation.
- No XML-RPC transport, no model discovery, no multi-database switching, no cursor pagination.

## Development

```sh
bun install
bun run lint
bun run typecheck
bun run test
bun run build
```

`scripts/smoke-odoo.sh` runs a manual end-to-end check against a real server; it is deliberately
excluded from CI.