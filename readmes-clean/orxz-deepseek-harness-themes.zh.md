# deepseek-harness-themes

面向 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的 UI 主题集合。

> One harness. Multiple styles.

社区维护的主题集合，基于官方主题扩展点（`@deepseek-ai/dsh-client-ui-theme` 的 `ctx.theme`）构建。只关注视觉体验——颜色、表面、状态、代码块、工具调用、终端 UI。不改模型、不改 agent、不改提示词、不改协议。

## 包结构

### 包 · 职责

## 主题

每张预览都由该主题自己的 token 生成；完整画廊见[主题预览](docs/previews.zh.md)。

### 主题 · 基座 · 预览
- **主题**: DeepSeek · **基座**: 浅色——清爽的 DeepSeek 蓝 · **预览**: ![DeepSeek 主题预览](previews/deepseek.svg)
- **主题**: OLED · **基座**: 深色——真黑，适配 OLED 屏幕 · **预览**: ![OLED 主题预览](previews/oled.svg)
- **主题**: Dracula · **基座**: 深色——高对比紫/靛蓝 · **预览**: ![Dracula 主题预览](previews/dracula.svg)
- **主题**: Catppuccin · **基座**: 深色——柔和马卡龙（Mocha） · **预览**: ![Catppuccin 主题预览](previews/catppuccin.svg)
- **主题**: Tokyo Night · **基座**: 深色——午夜蓝 + 霓虹点缀 · **预览**: ![Tokyo Night 主题预览](previews/tokyo-night.svg)
- **主题**: GitHub Dark · **基座**: 深色——熟悉的 GitHub 界面 · **预览**: ![GitHub Dark 主题预览](previews/github-dark.svg)
- **主题**: Solarized · **基座**: 深色——科学配色的青绿底 + 黄色点缀 · **预览**: ![Solarized 主题预览](previews/solarized.svg)
- **主题**: Gruvbox · **基座**: 深色——复古暖色调 + 橙色点缀 · **预览**: ![Gruvbox 主题预览](previews/gruvbox.svg)
- **主题**: Nord · **基座**: 深色——北极冰蓝 + 霜蓝点缀 · **预览**: ![Nord 主题预览](previews/nord.svg)
- **主题**: Synthwave '84 · **基座**: 深色——深紫底上的霓虹粉与青 · **预览**: ![Synthwave ](previews/synthwave-84.svg)
- **主题**: Cobalt2 · **基座**: 深色——钴蓝底 + 标志性黄色 · **预览**: ![Cobalt2 主题预览](previews/cobalt2.svg)

## 安装

两条命令：一条完成依赖安装、profile 层添加与功能挂载，另一条启动 Web 界面。

```sh
dsh plugin --profile web add @dshthemes/ui
dsh web
```

`web` 是随包的 Web profile，首次使用时自动初始化。在 设置 → General 里选主题即可，选择会持久化，之后不再需要终端。

![设置 → General 中的 Theme 选择行](screenshots/settings.png)

卸载同样简单：

```sh
dsh plugin --profile web remove @dshthemes/ui
```

仅用核心包、源码安装、手写 patch 替代方式、本地开发与故障排查见[安装指南](docs/installation.zh.md)。

## 主题理念

主题改变 deepseek-harness 的外观，而非行为。一个主题应当：易于安装、易于切换、易于定制、跨 UI 状态一致、适合长时间编码、与 agent 逻辑解耦。token 契约见[主题规范](docs/theme-spec.zh.md)。

## 贡献

欢迎社区主题——[创建主题](docs/creating-a-theme.zh.md)是分步指南。常驻命令见 [AGENTS.md](AGENTS.md)。

参与须遵守[行为准则](CODE_OF_CONDUCT.md)。安全问题请按[安全策略](SECURITY.md)私下上报。