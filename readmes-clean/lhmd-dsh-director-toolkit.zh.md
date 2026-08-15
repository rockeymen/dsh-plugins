![DSH Director Toolkit](docs/assets/director-toolkit-page.png)

# DSH Director Toolkit

[English](README.md) · **中文** · [在线展示页](https://lhmd.github.io/dsh-director-toolkit/)

> 把一个粗糙的 3D 想法，变成真正能开工的镜头单。

DSH Director Toolkit 是给 3D 艺术家和技术美术使用的 DeepSeek Harness 插件。它把一段粗略 brief 变成适用于 Blender、Three.js、Houdini 或 C4D 的制作方向：

- 镜头与构图；
- 灯光、材质、几何与动效；
- 针对软件的渲染设置；
- 从灰模开始的 5 步制作顺序；
- negative prompt、标题、双语展示文案、标签和风险提示。

## 先看效果

打开 [GitHub Pages 展示页](https://lhmd.github.io/dsh-director-toolkit/)，可以直接看到 Blender 短片、一个由多资产组成的四章节故事和一个 Three.js 场景。

![独眼玄瓷](docs/assets/cyclopean-porcelain.gif)

短片分成三拍：青色轮廓出现，独眼转向镜头，最后圣物从底座上方升起。源场景在 [`examples/cyclopean-porcelain.blend`](examples/cyclopean-porcelain.blend)，搭景脚本在 [`scripts/blender-script-demo.py`](scripts/blender-script-demo.py)。

四章分镜由 [`scripts/render-case-videos.py`](scripts/render-case-videos.py) 渲染：铬色轨道、记忆花园、粗粝档案馆和布料机器人。方向数据保存在 [`docs/examples/scene-suite.json`](docs/examples/scene-suite.json)。

| 章节 | 渲染画面 |
| --- | --- |
| 铬色轨道 | ![铬色轨道](docs/assets/cases/chrome-orbit-poster.png) |
| 记忆花园 | ![记忆花园](docs/assets/cases/memory-garden-poster.png) |
| 粗粝档案馆 | ![粗粝档案馆](docs/assets/cases/brutalist-archive-poster.png) |
| 布料机器人 | ![布料机器人](docs/assets/cases/cloth-robot-poster.png) |

## 插件结构

`scene_director` 是本地、确定性的基础工具；`scene_director_v4` 是可选的 Harness/服务端适配器，默认使用 `deepseek-v4-pro`，只从服务端环境变量读取 `DEEPSEEK_API_KEY`。运行时 `director-toolkit` Skill 会告诉 Agent 何时导演 Blender、Three.js、Houdini 或 C4D brief。

仓库遵循 DSH Profile Bundle 结构：

- `cordis.patch.yml` 负责挂载包；
- `src/index.js` 导出 `apply(ctx)` 并注册工具；
- `src/skill.js` 通过 `ctx.skills.register(...)` 注册 Skill；
- 没有 `.codex-plugin`，也没有文件型 Skill 目录。

## 接入 Harness

```bash
npm install -g @deepseek-ai/dsh
dsh plugin --profile web add /absolute/path/to/dsh-director-toolkit
dsh web
```

如果要使用可选 V4 模型，请在 Harness/服务端设置：

```bash
export DEEPSEEK_API_KEY="replace-with-a-rotated-key"
```

## 可修改的本地工作台

可编辑的本地工作台在 [`playground/`](playground/)。

```bash
python3 -m http.server 4175 --directory playground
```

## 开发

```bash
npm test
npm run check:release
npm run check:package
npm run demo
```