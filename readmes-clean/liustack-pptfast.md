![pptfast — make your deck in minutes, not hours](assets/banner.png)

# pptfast

Make your deck in minutes, not hours.

🥇 The FIRST deck-generation plugin for DeepSeek Harness (dsh) 🥇

## Talk to us

Issues are welcome any time. [Open one](https://github.com/liustack/pptfast/issues/new/choose), or follow **[@liustack](https://x.com/liustack)** on X. Share what you made with pptfast, which harness you use, and what the next release should solve. New releases land there first.

## Highlights

**⚡ Tell your AI what to cover, get the deck.** You bring the content, the engine handles layout, color, type size, and spacing. The same content renders the same deck every time, so there is nothing to redo and no luck involved.

**✏️ A real deck, not a picture of one.** Every heading, bullet, and chart bar opens in PowerPoint for you to retype and restyle. Chart and table figures are the exception: to change the numbers, have your AI rebuild that page. 17 ready-made styles, and you can pull the colors and fonts out of a deck your company already uses.

**🔌 Installs into the agent you already use.** One command puts pptfast into DeepSeek Harness, Claude Code, or any agent that reads a skill folder (Codex and friends), and it knows how to build a deck the moment it lands.

**🔁 Revisions without describing everything again.** One command opens a preview page in your browser: page through it, write your notes right on the slides, and your AI picks them up and fixes them. The page refreshes itself as each revision lands.

**🔒 No account, no API key, no network.** Install it and it works. Node 22.19+ or Bun is all you need on the machine.

## Install

**Step 1, hand it to your AI.** Send it this line:

> Install the pptfast deck skill following https://raw.githubusercontent.com/liustack/pptfast/main/INSTALL.md, then run the health check and tell me the result.

There is no step 2. Your AI puts the skill folder where your harness reads it, and the skill brings its own version-pinned launcher, so there is no CLI to install by hand. pptfast renders entirely locally: no API key, no account, nothing to configure. The only prerequisite is Node 22.19+ (or Bun).

**On DeepSeek Harness, it is one command instead.** pptfast is a native DSH plugin there, not a skill folder:

```bash
npx -y @deepseek-ai/dsh plugin --profile web add @liustack/pptfast@0.20.0
```

Name the version. Without it, the install quietly lands on an older release and you miss the newest features. `npm view @liustack/pptfast version` prints the current one. The plugin card shows up as "pptfast", registers the deck-generation skill, and carries the CLI inside its own package. Uninstalling removes the skill with no residue.

## Quick start

An IR is one JSON file describing the whole deck. Write a minimal one, then run the validate → render → preview loop:

```bash
cat > deck.json <<'EOF'
{
  "filename": "hello.pptx",
  "theme": { "id": "consulting" },
  "slides": [
    { "type": "cover", "heading": "Hello pptfast", "subheading": "A first deck in ten minutes" },
    { "type": "content", "heading": "Why it works", "components": [
      { "type": "bullets", "items": ["Semantic IR in", "Native DrawingML out", "Every shape stays editable"] } ] },
    { "type": "ending", "heading": "Thanks" }
  ]
}
EOF
pptfast validate deck.json                              # → OK — 3 slides, theme "consulting"
pptfast render deck.json -o out/hello.pptx              # → wrote out/hello.pptx (3 slides, ~24 KB)
pptfast render deck.json -o out/tech.pptx --theme tech  # same deck, different theme
pptfast preview deck.json -o out/svgs                   # SVG per slide, for a visual self-check
```

One shape rule: `cover`/`chapter`/`ending` slides are heading + subheading only, components live on `content` slides. `validate` says exactly this if you mix them up.

No install at all also works: `npx -y @liustack/pptfast validate deck.json`. In a source checkout, `node dist/cli.js` replaces `pptfast`, and `examples/` has ready-made IR files to try.

The commands you will reach for most:

### Command · Does
- **Command**: `validate <target>` · **Does**: Check the IR, with page numbers on every error
- **Command**: `render <target> -o <out.pptx> [--theme ]` · **Does**: Render a `.pptx`
- **Command**: `preview <target> -o <dir> [--html]` · **Does**: One SVG per slide, plus a self-contained review page
- **Command**: `serve <target>` · **Does**: Live preview that reloads on every change, with reviewer annotations
- **Command**: `audit <target>` · **Does**: Geometry review: overflow, out-of-bounds, low contrast, overlap
- **Command**: `themes` · **Does**: List the 17 built-in themes
- **Command**: `doctor` · **Does**: Check the install: runtime, skill copies, optional capabilities, self-test render

Full reference: [`docs/cli.md`](./docs/cli.md).

## Documentation

### Doc · Read it when
- **Doc**: [Install guide](./INSTALL.md) · **Read it when**: Handing installation to an agent or checking prerequisites
- **Doc**: [Agent skill](./skills/pptfast/SKILL.md) · **Read it when**: Learning the workflow pptfast teaches an agent
- **Doc**: [CLI manual](./docs/cli.md) · **Read it when**: Looking up commands, flags, audits, previews, and health checks
- **Doc**: [IR reference](./docs/ir.md) · **Read it when**: Writing a deck, slide, component, or narrative in JSON
- **Doc**: [Themes](./docs/themes.md) · **Read it when**: Picking a built-in theme or extracting your own brand
- **Doc**: [Core concepts](./docs/concepts.md) · **Read it when**: Understanding themes, layouts, components, narratives, and capacity
- **Doc**: [Architecture](./docs/architecture.md) · **Read it when**: Working on the render chain or adding a theme, layout, or component
- **Doc**: [Deck projects](./docs/deck-projects.md) · **Read it when**: Building a multi-file deck with locked specs, assets, and live review
- **Doc**: [Layout selection and seed](./docs/selection-and-seed.md) · **Read it when**: Explaining why a layout was picked or keeping revisions stable
- **Doc**: [Contrast system](./docs/contrast-system.md) · **Read it when**: Debugging text color, painted backgrounds, or contrast findings
- **Doc**: [Testing](./docs/testing.md) · **Read it when**: Running the right gate, inspecting snapshots, or changing exported XML
- **Doc**: [Internal API](./docs/internal-api.md) · **Read it when**: Understanding why the JavaScript internals carry no semver promise
- **Doc**: [Release guide](./docs/releasing.md) · **Read it when**: Preparing and publishing an npm release
- **Doc**: [CHANGELOG](./CHANGELOG.md) · **Read it when**: Finding what changed in a version

## Credits

Icon primitives are extracted from [lucide](https://lucide.dev) (ISC License). pptfast itself was extracted from a production AI-deck-generation system and CJK-typography-tuned (full-width punctuation width, Chinese line breaking, a Chinese-first font stack, explicit east-asian font-slot declarations) from day one.