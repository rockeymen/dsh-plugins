# dsh-blue-whale

A DeepSeek Chat-style blue-whale color skin. Light and dark follow the built-in appearance.

![Home before / after](docs/compare-home.png)

![Brand mark before / after](docs/compare-brand.png)

DSH ships as a black whale. [chat.deepseek.com](https://chat.deepseek.com) is a blue one. This plugin puts Chat blue `#4D6BFE` on the wordmark, hero fish, tab favicon, and primary actions. Light / dark / follow-system stay on the built-in Appearance setting.

## Install

```sh
dsh plugin --profile web add github:starslittle/dsh-blue-whale
```

Restart `dsh web`, then hard-refresh the browser (Ctrl+Shift+R). The skin is **on by default**.

Open **Settings → General → Blue Whale**. A green dot means it is on. **Turn off** matches the stock capsule control; **Turn on** is the blue fill.

## Check that it loaded

### What you see · What to do
- **What you see**: Sidebar whale and `deepseek` letters are blue · **What to do**: It is on
- **What you see**: Still the black whale · **What to do**: Restart, then hard-refresh
- **What you see**: Turning the switch off restores the stock colors · **What to do**: Expected

## What it changes

###  · Stock DSH · This skin
- Sidebar whale + `deepseek` · **Stock DSH**: near-black / near-white · **This skin**: `#4D6BFE`
- Hero whale · **Stock DSH**: same · **This skin**: `#4D6BFE`
- Browser tab icon · **Stock DSH**: black (white in OS dark) · **This skin**: `#4D6BFE`
- Brand / send / accents · **Stock DSH**: black or white · **This skin**: `#4D6BFE`
- Page background · **Stock DSH**: built-in light / dark · **This skin**: unchanged
- Light / dark switch · **Stock DSH**: built-in Appearance · **This skin**: still built-in

Supporting colors come from DSH's own `--dsw-static-deepseek-*` scale.

## What it does not do

- It does not change layout or density
- It does not change a desktop shell's window or tray icon
- Headless and TUI profiles have nothing to paint

Turning it off or uninstalling restores the stock colors immediately.