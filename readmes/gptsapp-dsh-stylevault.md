# StyleVault（`dsh-stylevault`）

DeepSeek Harness 的经典主题合集：30 套开源配色、完整的 Style Settings 面板、配置可以导出分享。

作者：**Rocky** · 反馈/建议：[@WeWill_Rocky](https://x.com/WeWill_Rocky)

## 为什么做这个

起因很小：我在 VS Code 里用 Catppuccin，终端里用 Nord，Obsidian 里用 Rosé Pine，开了 DSH 想换个颜色，翻了一圈社区，没有我熟悉的那几个经典方案，就自己写了。

做着做着发现，光有预设不够。DSH 里代码块、Diff、思考流、工具输出这些表面，换一套配色后对比度参差不齐——同一套 Nord，代码区清楚了，思考流可能灰成一片。所以没停留在"换色"，而是把这些表面逐个调过：代码高亮、Diff 增删行、状态色、圆角、字体。走的是 Obsidian 那套 Minimal / Style Settings 的路子：默认干净，想折腾也折腾得动。

还有一个朴素的需求：我调好的主题想给别人用，别人调完也想发给我。所以做了导出/导入，一份 JSON 就能把配色、字体、圆角整个搬走。

这是我的个人项目，会持续维护。但 DSH 还在快速迭代（官方自己都说会有破坏性变更），某天某个界面细节变了，欢迎提 issue，我看到会修。

## 装完能干什么

- **30 套经典配色一键切换**：Catppuccin ×4、Nord (+Light)、Tokyo Night (+Storm)、Gruvbox、Everforest、Solarized、Dracula、One Dark、Rosé Pine、Kanagawa、Ayu、GitHub、Monokai、Night Owl、Horizon、Material、OLED Black 等，深浅都有
- **Settings → StyleVault 面板 live 微调**：颜色、UI/代码字体、字号、圆角
- **调完存成"我的方案"**，或导出 JSON 分享，别人导入即用
- **面板中英双语**，跟随 DSH 语言设置

## 安装

```bash
# 本地开发（link 模式）
dsh plugin --profile web add link:/path/to/dsh-stylevault
# 从 GitHub 安装
dsh plugin --profile web add github:GptsApp/dsh-stylevault
```

重启 `dsh web` 或硬刷新。

> 仓库：https://github.com/GptsApp/dsh-stylevault

## 预览

| Nord（深色） | Nord Light（浅色） |
|---|---|
| ![Nord dark](docs/screenshots/preview-dark-nord.png) | ![Nord light](docs/screenshots/preview-light-nord.png) |

## 使用

1. 打开 **Settings → StyleVault**
2. 点选预设卡片（带 6 色预览）
3. 在颜色 / 字体 / 质感区 live 微调
4. **另存为我的方案** → 导出 / 复制分享

### 控制台 API

```js
__STYLEVAULT__.list()
__STYLEVAULT__.set('nord')
__STYLEVAULT__.override({ '--dsw-alias-brand-primary': '#ff7b72' })
__STYLEVAULT__.setFonts({ code: '"JetBrains Mono", monospace' })
__STYLEVAULT__.setOptions({ radius: '10px' })
__STYLEVAULT__.export('My Nord Soft')
__STYLEVAULT__.copyShare()
__STYLEVAULT__.import(jsonOrString)
__STYLEVAULT__.saveScheme('通勤深色')
__STYLEVAULT__.schemes()
__STYLEVAULT__.renameScheme(id, '新名字')
__STYLEVAULT__.deleteScheme(id)
__STYLEVAULT__.setDefaultScheme(id)
```

## 和官方主题的关系

StyleVault 在底层用官方 ThemeService：只覆盖 `--dsw-alias-*` token，不碰布局，所以和官方 Appearance 不冲突。刷新后会自动恢复当前预设。想完全回到官方主题，控制台执行：

```js
__STYLEVAULT__.useOfficial('system')
```

## 已知边界

- DSH 还在 developer preview，token 或界面结构变了可能需要小幅适配；升级前可以先看官方 release notes
- 个别界面元素（如部分输入框）依赖 DSH 内部生成的 class 名，官方改版后可能偶发字体不生效——不会崩，但可能需跟进

## 代码入口

| 文件 | 角色 |
|------|------|
| `lib/client.js` | 客户端主实现（ModuleLoader），含全部预设与设置面板 |
| `lib/index.js` | Host 空壳（呈现全部在客户端） |

## 文档

- [PRD](docs/PRD.md)
- [Phase 1 任务](docs/PHASE1-TASKS.md)
- [配置 Schema](docs/CONFIG-SCHEMA.md)
- [Style Settings IA](docs/STYLE-SETTINGS-IA.md)

## License

MIT。调色板来自各开源项目，本仓库只做 token 映射。

有问题或想法？[@WeWill_Rocky](https://x.com/WeWill_Rocky)，或直接在仓库开 issue。
