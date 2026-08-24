# dsh-image-zoom

[English](README.md) | [中文](README.zh.md)

**Smart image splitting and zooming for Vision-Language Models (VLMs) inside [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness).**

Most VLMs downsample large images to ~640k pixels (≈800x800) before inference, making fine details in schematics, PCBs, documents, or dense UI screens illegible. This plugin gives your model two surgical tools (`split_image` / `zoom_detail`) to **see the big picture, then zoom into any numbered region at full resolution** — all without leaving the chat, and with persistent attachments.

## Why

- Vision models **downscale** high-res images. Text on a 4K screen or tiny components on a PCB become a blurry mess.
- Asking the model to guess `x,y,w,h` coordinates on a blurry thumbnail is unreliable.
- This plugin provides a **number-labeled grid** (drawn directly on the thumbnail). The model just says *"Zoom into tile 9"*, and the engine crops the **original full-resolution image** exactly there.
- Results are returned as **inline images** (durable attachments), not temporary file paths.

## How it works

```
You attach a large image (or pass image_path)
        │
        ▼
[split_image] ──► downscaled context + numbered grid overlay
        │              (solid red = cut lines, dashed blue = overlap)
        │
        ▼
Model inspects the labeled overview ──► picks a number (e.g., tile 5)
        │
        ▼
[zoom_detail] ──► crops the ORIGINAL full-res image at that region
        │
        ▼
Inline cropped image returned (can be saved and chained further)
```

### Complete call paths

- **Session-gated**: remembers per-session enable/disable state via the composer toggle.
- **Vision-gated**: automatically detects if the current main model accepts image input; refuses to run on pure-text models.
- **Coordinate abstraction**: you provide pixel coordinates in *what you see* (the downscaled view); the engine auto-scales them to the original image resolution.
- **File chaining**: save a zoom result with `save_to`, then pass that file as `image_path` to zoom even deeper.

## Install

### From npm

```sh
dsh plugin --profile web add dsh-image-zoom
```

`dsh plugin` forwards to pnpm inside the profile, so the package lands in the profile's `node_modules`. Then append the composition row to `~/.dsh/profiles/web/cordis.patch.yml`:

```yaml
- insert:
    - id: image-zoom
      name: dsh-image-zoom
```

### From source (local checkout)

Clone the repository, then run the cross-platform installer (plain Node — works on Windows, macOS and Linux):

```sh
git clone https://github.com/your-username/dsh-image-zoom.git
cd dsh-image-zoom
node install.mjs
```

The installer copies the package to `~/.dsh/profiles/web/dsh-image-zoom` (honors `DSH_HOME`), links it into the profile's `node_modules` (junction on Windows, symlink elsewhere), registers the `link:` dependency in `package.json`, and appends the required insert row to `cordis.patch.yml`. It also migrates away the pre-release `dsh-photo-zoom` name if present.

To uninstall:

```sh
node install.mjs --remove
```

After installation, **restart** your DSH web server:

```sh
dsh --profile web
```

## Tools Overview

### 1. `split_image`

Generates a **labeled overview grid** (attached inline). The grid has:
- **Solid red lines**: Exact tile cut boundaries.
- **Dashed blue rectangles**: Actual capture extent *including overlap margin* (content between the blue edge and red line also appears in the neighboring tile).

**Parameters**:
- `image_index` (int, default 0): Most recent attachment.
- `image_path` (string): Alternative local file (PNG/JPEG/WebP/GIF).
- `save_to` (string): Optional directory or file path to save the overview.
- `type` (enum): `document`, `photo`, `webpage`, `object`, `misc` — hints for grid strategy.
- `rotate` (0/90/180/270): Force rotation (default respects EXIF).

### 2. `zoom_detail`

Crops a specific region **at full original resolution** and returns it inline.

**Parameters** (either view-space coords or `tile`):
- `x`, `y`, `w`, `h` (int): Pixels in the *downscaled view* (auto-scaled to full-res).
- `tile` (int): Numbered tile from a prior `split_image` call (easiest).
- `label` (string): Optional short name for the output image.
- `image_index` / `image_path`: Same as above.
- `save_to` (string): Save crop to disk for chaining.

## Configuration

A small **composer toggle** (sliding switch) appears in the chat input bar when a vision model is active. It controls whether the tools are available for the current session.

- **Enabled (default)**: Tools execute normally.
- **Disabled**: Tools refuse with a clear error ("smart split is switched off").

The toggle communicates with the host via two simple HTTP routes:
- `GET /image-zoom/state` – returns current vision status and enabled state.
- `POST /image-zoom/enabled` – updates the per-session toggle.

No complex settings panel is required; it works out-of-the-box.

## Model Experience

### What the model sees

- **`split_image` result**: A downscaled JPEG with the grid overlay. The model reads the numbers and visual layout.
- **`zoom_detail` result**: A PNG of the exact cropped region at native resolution.

### Token / KV Cache effect

The tools themselves do **not** modify the LLM prompt or KV cache. They produce image attachments that are rendered as standard image content blocks in the conversation. The token cost is purely the cost of the rendered image attachments (managed by DSH's native attachment system).

## Project Structure

```
dsh-image-zoom/
├── lib/
│   ├── index.js             # Host plugin (tools, HTTP toggle, subprocess orchestration)
│   └── client.js            # Client half (composer toggle UI)
├── helper/
│   └── split_helper.cjs     # Sharp-based image processing engine (standalone)
├── LICENSE
└── package.json             # DSH bundle manifest (dsh.client declaration)
install.mjs                  # Cross-platform installer (Windows / macOS / Linux)
```

## Development

The helper uses `sharp` for image manipulation. It is spawned as a subprocess to handle heavy lifting without blocking the main event loop. `sharp` itself is NOT bundled: the engine discovers the copy that ships with the DSH installation (available on every platform DSH supports), so this package stays pure JavaScript.

To test changes, re-run the installer and restart `dsh web`.

## Publish (maintainer)

```sh
cd dsh-image-zoom
npm publish
```

## License

MIT
