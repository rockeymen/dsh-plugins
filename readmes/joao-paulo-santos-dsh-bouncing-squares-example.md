# dsh-bouncing-squares-example

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH)
plugin, and the example plugin for
[dsh-granular-settings](https://github.com/joao-paulo-santos/dsh-granular-settings):
three bouncing squares share your screen, each driven by one settings scope.

| square | scope | what changing it teaches |
|---|---|---|
| blue | `session` | one value per session: two sessions can show two colors at once |
| amber | `workspace` | one value per workspace: every session in the workspace shows the same |
| green | `global` | one plugin-wide value: the same in every workspace, and it keeps bouncing with no session open at all |

## What to try

- Open two sessions in the same workspace and give them different Session
  square colors. Each session square keeps its own color; both workspace
  squares match.
- Switch workspace: the session and workspace squares follow the new
  context, the global square does not change at all.
- Close every session: only the global square remains, because global
  values exist without a session context.
- The workspace square's Text prefix (enum) and Text suffixes (multiselect)
  decorate its label. The global square's size (number) resizes it.

## The settings it registers

Every scope registers the same four keys, `show`, `color`, `text`, `speed`,
so the scope axis is easy to see, plus one or two types the others do not
have:

| scope | keys | types exercised |
|---|---|---|
| `session` | show, color, text, speed | toggle, color, text, slider |
| `workspace` | show, color, text, speed, prefix, suffixes | toggle, color, text, slider, enum, multiselect |
| `global` | show, color, text, speed, size | toggle, color, text, slider, number |

## Code tour

- `lib/index.js`, host half: one `gs.register` call per setting, nothing
  else.
- `lib/client.js`, browser half: each square is a handful of
  `gs.useSetting(NS, scope, key)` calls plus physics. The platform hook
  owns the session context, subscriptions, default fallback, and writes;
  module-scope flight state survives context switches. The global square
  reads the sessionless context, which is why it bounces with no session
  open.

## How to install

Requires a DeepSeek Harness checkout and a profile, here `web`. Clone the
dependencies and this plugin into a plugins folder:

```sh
mkdir -p ~/dsh-plugins && cd ~/dsh-plugins
git clone https://github.com/joao-paulo-santos/dsh-event-relay.git
git clone https://github.com/joao-paulo-santos/dsh-granular-settings.git
git clone https://github.com/joao-paulo-santos/dsh-bouncing-squares-example.git

# from the harness checkout
pnpm dsh plugin --profile web add ~/dsh-plugins/dsh-event-relay
pnpm dsh plugin --profile web add ~/dsh-plugins/dsh-granular-settings
pnpm dsh plugin --profile web add ~/dsh-plugins/dsh-bouncing-squares-example

# verify the profile still composes
pnpm dsh --profile web --dump-config
```

Then restart the harness. The squares appear immediately; their controls
live in the settings dialog under Granular Settings.

## Dependencies

- [dsh-granular-settings](https://github.com/joao-paulo-santos/dsh-granular-settings) provides both halves this plugin talks to
- [dsh-event-relay](https://github.com/joao-paulo-santos/dsh-event-relay) carries the change doorbells (required by dsh-granular-settings)

## Plugins dependent on this

*(none, this is the end of the line: an example, not a platform)*
