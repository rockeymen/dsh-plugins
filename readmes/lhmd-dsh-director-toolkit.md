![DSH Director Toolkit](docs/assets/director-toolkit-page.png)

# DSH Director Toolkit

[![Pages](https://img.shields.io/github/actions/workflow/status/lhmd/dsh-director-toolkit/pages.yml?branch=main&style=for-the-badge&label=pages)](https://github.com/lhmd/dsh-director-toolkit/actions/workflows/pages.yml) [![Tests](https://img.shields.io/github/actions/workflow/status/lhmd/dsh-director-toolkit/ci.yml?branch=main&style=for-the-badge&label=tests)](https://github.com/lhmd/dsh-director-toolkit/actions) [![DeepSeek V4 Pro](https://img.shields.io/badge/DeepSeek%20V4%20Pro-captured%20examples-2456d6?style=for-the-badge&labelColor=162033)](docs/v4-demo.json) [![License](https://img.shields.io/badge/license-MIT-e56d58?style=for-the-badge&labelColor=162033)](LICENSE)

**English** · [中文入口](README.zh.md) · [Live showcase](https://lhmd.github.io/dsh-director-toolkit/)

> Turn a rough 3D idea into a shot you can build.

DSH Director Toolkit is a DeepSeek Harness plugin for 3D artists and technical designers. It turns a rough brief into a direction pack for Blender, Three.js, Houdini, or C4D:

- camera and composition;
- lighting, materials, geometry, and motion;
- software-aware render settings;
- five build steps starting with a greybox pass;
- negative prompt, titles, bilingual showcase copy, hashtags, and risk flags.

## See it first

Open the [GitHub Pages showcase](https://lhmd.github.io/dsh-director-toolkit/) for the Blender short film, a four-chapter multi-asset story, and a browser-native Three.js study.

![Cyclopean Porcelain](docs/assets/cyclopean-porcelain.gif)

The film has three beats: reveal the cyan silhouette, let the eye find camera, then lift the relic above the plinth. The source scene is [`examples/cyclopean-porcelain.blend`](examples/cyclopean-porcelain.blend); the build script is [`scripts/blender-script-demo.py`](scripts/blender-script-demo.py).

The four story frames are rendered from [`scripts/render-case-videos.py`](scripts/render-case-videos.py): chrome orbit, memory garden, brutalist archive, and cloth robot. The direction data is in [`docs/examples/scene-suite.json`](docs/examples/scene-suite.json).

| Chapter | Render |
| --- | --- |
| Chrome Orbit | ![Chrome Orbit](docs/assets/cases/chrome-orbit-poster.png) |
| Memory Garden | ![Memory Garden](docs/assets/cases/memory-garden-poster.png) |
| Brutalist Archive | ![Brutalist Archive](docs/assets/cases/brutalist-archive-poster.png) |
| Cloth Robot | ![Cloth Robot](docs/assets/cases/cloth-robot-poster.png) |

## Plugin shape

`scene_director` is the local-first deterministic tool. `scene_director_v4` is an optional Harness/server adapter that defaults to `deepseek-v4-pro` and reads `DEEPSEEK_API_KEY` only from the server environment. The runtime `director-toolkit` Skill tells the agent when to direct a Blender, Three.js, Houdini, or C4D brief.

This repository follows the DSH Profile Bundle shape:

- `cordis.patch.yml` mounts the package;
- `src/index.js` exports `apply(ctx)` and registers tools;
- `src/skill.js` registers the Skill through `ctx.skills.register(...)`;
- no `.codex-plugin` directory and no file-based Skill folder.

## Install into Harness

```bash
npm install -g @deepseek-ai/dsh
dsh plugin --profile web add /absolute/path/to/dsh-director-toolkit
dsh web
```

For the optional V4 pass, configure the credential in the Harness/server environment:

```bash
export DEEPSEEK_API_KEY="replace-with-a-rotated-key"
```

## Editable playground

The changeable local editor lives in [`playground/`](playground/).

```bash
python3 -m http.server 4175 --directory playground
```

## Development

```bash
npm test
npm run check:release
npm run check:package
npm run demo
```

## License

MIT.
