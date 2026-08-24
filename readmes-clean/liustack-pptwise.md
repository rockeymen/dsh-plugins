![pptwise — a real PowerPoint file, not a picture of one](assets/banner.png)

# pptwise

A real PowerPoint file. Not a picture of one.

🥇 The FIRST deck-generation plugin for DeepSeek Harness (dsh) 🥇

## Talk to us

Issues are welcome any time. [Open one](https://github.com/liustack/pptwise/issues/new/choose), or follow **[@liustack](https://x.com/liustack)** on X. Share what you made with pptwise, which harness you use, and what the next release should solve. New releases land there first.

## Highlights

**⚡ Tell your AI what to cover, get the deck.** You bring the content, the engine handles layout, color, type size, and spacing. The same content renders the same deck every time, so there is nothing to redo and no luck involved.

**✏️ Open it in PowerPoint and keep working.** Every heading, bullet, and chart bar opens in PowerPoint for you to retype and restyle. Chart and table figures are the exception: to change the numbers, have your AI rebuild that page. 24 ready-made styles, and you can pull the colors and fonts out of a deck your company already uses.

**🔌 Installs into the agent you already use.** One command puts pptwise into DeepSeek Harness, Claude Code, or any agent that reads a skill folder (Codex and friends), and it knows how to build a deck the moment it lands.

**🔁 Revisions without describing everything again.** One command opens a live preview in your browser. Tell your AI what to change in plain words — the page refreshes itself as each revision lands.

**🔒 No account, no API key to render, no network at render time.** Install it and it works. Node 22.19+ or Bun is all you need on the machine. Optional stock-photo search uses the user's own Pexels key.

## Install

**Step 1, hand it to your AI.** Send it this line:

> Install pptwise following https://raw.githubusercontent.com/liustack/pptwise/main/INSTALL.md, then run the health check and tell me the result.

**On DeepSeek Harness, send this instead.** There pptwise is a native plugin rather than a skill folder, so it has its own guide. You pick the line, not your agent: an agent cannot reliably tell which harness it is running in.

> Install pptwise following https://raw.githubusercontent.com/liustack/pptwise/main/INSTALL-dsh.md, then run the health check and tell me the result.

There is no step 2. Your AI puts the skill folder where your harness reads it, and the skill brings its own version-pinned launcher, so there is no CLI to install by hand. pptwise renders a PPTX entirely locally: no API key, no account, nothing to configure for render. Optional stock-photo search needs the user's own Pexels key. The only prerequisite is Node 22.19+ (or Bun).

## Quick start

An IR is one JSON file describing the whole deck. Write a minimal one, then run the validate → render → preview loop:

```bash
cat > deck.json <<'EOF'
{
  "filename": "hello.pptx",
  "theme": { "id": "consulting" },
  "slides": [
    { "type": "cover", "heading": "Hello pptwise", "subheading": "A first deck in ten minutes" },
    { "type": "content", "heading": "Why it works", "components": [
      { "type": "bullets", "items": ["Semantic IR in", "Native DrawingML out", "Every shape stays editable"] } ] },
    { "type": "ending", "heading": "Thanks" }
  ]
}
EOF
pptwise validate deck.json                              # → OK — 3 slides, theme "consulting"
pptwise render deck.json -o out/hello.pptx              # → wrote out/hello.pptx (3 slides, ~24 KB)
pptwise render deck.json -o out/tech.pptx --theme tech  # same deck, different theme
pptwise preview deck.json -o out/svgs                   # SVG per slide, for a visual self-check
```

One shape rule: `cover`/`chapter`/`ending` slides are heading + subheading only, components live on `content` slides. `validate` says exactly this if you mix them up.

No install at all also works: `npx -y @liustack/pptwise validate deck.json`. In a source checkout, `node dist/cli.js` replaces `pptwise`, and `examples/` has ready-made IR files to try.

The commands you will reach for most:

### Command · Does
- **Command**: `validate <target>` · **Does**: Check the IR, with page numbers on every error
- **Command**: `render <target> [-o <out.pptx>] [--theme ]` · **Does**: Render a `.pptx`. Omit `-o` to write `.pptwise/<deck>/<deck>.pptx`
- **Command**: `preview <target> [-o <dir>] [--html]` · **Does**: One SVG per slide, plus a self-contained review page. Omit `-o` to write `.pptwise/<deck>/`
- **Command**: `serve <target>` · **Does**: Live preview that reloads on every change
- **Command**: `audit <target>` · **Does**: Geometry review: overflow, out-of-bounds, low contrast, overlap
- **Command**: `themes` · **Does**: List the built-in themes
- **Command**: `doctor` · **Does**: Check the install: runtime, skill copies, optional capabilities, self-test render

Full reference: [`docs/cli.md`](./docs/cli.md).

## Documentation

### Doc · Read it when
- **Doc**: [Install guide](./INSTALL.md) · **Read it when**: Handing installation to an agent or checking prerequisites
- **Doc**: [Agent skill](./skills/pptwise/SKILL.md) · **Read it when**: Learning the workflow pptwise teaches an agent
- **Doc**: [CLI manual](./docs/cli.md) · **Read it when**: Looking up commands, flags, audits, previews, and health checks
- **Doc**: [IR reference](./docs/ir.md) · **Read it when**: Writing a deck, slide, component, or narrative in JSON
- **Doc**: [Themes](./docs/themes.md) · **Read it when**: Picking a built-in theme or extracting your own brand
- **Doc**: [Core concepts](./docs/concepts.md) · **Read it when**: Understanding themes, layouts, components, narratives, and capacity
- **Doc**: [Architecture](./docs/architecture.md) · **Read it when**: Working on the render chain or adding a theme, layout, or component
- **Doc**: [Deck projects](./docs/deck-projects.md) · **Read it when**: Building a multi-file deck with locked specs, assets, and live review
- **Doc**: [Layout selection and seed](./docs/selection-and-seed.md) · **Read it when**: Explaining why a layout was picked or keeping revisions stable
- **Doc**: [Contrast system](./docs/contrast-system.md) · **Read it when**: Debugging text color, painted backgrounds, or contrast findings
- **Doc**: [Designing themes](./docs/designing-themes.md) · **Read it when**: Drawing a theme redesign that can actually compile to PPTX
- **Doc**: [Testing](./docs/testing.md) · **Read it when**: Running the right gate, inspecting snapshots, or changing exported XML
- **Doc**: [Internal API](./docs/internal-api.md) · **Read it when**: Understanding why the JavaScript internals carry no semver promise
- **Doc**: [Release guide](./docs/releasing.md) · **Read it when**: Preparing and publishing an npm release
- **Doc**: [CHANGELOG](./CHANGELOG.md) · **Read it when**: Finding what changed in a version

## Credits

Icon primitives are extracted from [lucide](https://lucide.dev) (ISC License). pptwise itself was extracted from a production AI-deck-generation system and CJK-typography-tuned (full-width punctuation width, Chinese line breaking, a Chinese-first font stack, explicit east-asian font-slot declarations) from day one.