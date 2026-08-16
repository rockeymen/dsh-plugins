<h3 align="center">
	![Logo](https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png)
	![](https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png)
	Catppuccin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
	![](https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png)
</h3>

	![Catppuccin Mocha 主题下的 DeepSeek Harness](assets/previews/hero-mocha.png)

## 简介

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI
（`dsh web`）的 [Catppuccin](https://github.com/catppuccin/catppuccin) 主题插件。

它内置 Catppuccin 的四个主题——**Latte**、**Frappé**、**Macchiato**、**Mocha**——
把整个界面的配色都换成对应的 Catppuccin 色板；并在 **设置 → 常规 → 外观**
下方提供一行 **Catppuccin** 快捷切换，选择会自动保存、下次启动自动恢复。

## 特性

- 🎨 四个主题：Latte（浅色）、Frappé / Macchiato / Mocha（深色）
- 🧩 接入官方主题系统，与内置浅色 / 深色 / 跟随系统主题平级
- 🎯 全界面配色覆盖（162 个配色变量），不只是一两个强调色
- ⚙️ 设置页一行切换，选择自动保存、重启自动恢复
- 🌐 中英文双语文案（跟随系统语言）

## 预览

四个主题在 DeepSeek Harness 中的实际效果（截图来自本地 GUI，Mocha 见文首大图）：

🌻 Latte（浅色）
![](assets/previews/latte.png)

🪴 Frappé（深色）
![](assets/previews/frappe.png)

🌺 Macchiato（深色）
![](assets/previews/macchiato.png)

🌿 Mocha（深色）
![](assets/previews/mocha.png)

## 安装

### 方式一：从 npm 安装（推荐）

```sh
dsh plugin --profile web add @nonamelego/dsh-catppuccin
```

装完重启 `dsh web` 即可，`dsh plugin` 会自动把它加进 profile 的 bundles。
其他 profile 把命令里的 `web` 换成对应名字即可（如 `headless`）。

### 方式二：从仓库安装

```sh
dsh plugin --profile web add https://github.com/NoNameLeGo/dsh-catppuccin
```

从 git 安装时 pnpm 可能要求允许构建脚本——按 pnpm 的提示把对应包加进 profile
`pnpm-workspace.yaml` 的 `allowBuilds` 后重跑一次即可。

### 方式三：本地链接（开发调试用）

克隆到本地后，把包链接进 profile 并加入 bundles（下面的路径换成你自己的）：

```sh
pnpm --dir C:\Users\LeGo\.dsh\profiles\web add link:D:\Vibe-Coding\dsh-catppuccin
```

然后在 profile 的 `package.json` 中把 `@nonamelego/dsh-catppuccin` 加进 `dsh.profile.bundles`，
重启 `dsh web` 即可。

## 使用

1. 打开 Web GUI（默认 `http://127.0.0.1:3080`）。
2. 进入 **设置 → 常规**。
3. 在 **外观** 区域下方找到 **Catppuccin** 行，选择主题：
   **Latte**（浅色）、**Frappé**、**Macchiato** 或 **Mocha**（深色）。
4. 选择 **跟随系统** 则回退到官方主题。

## 开发

```sh
pnpm install
pnpm typecheck   # tsc --noEmit 类型检查
pnpm test        # vitest 跑配色表覆盖测试
pnpm build       # tsdown 构建 -> lib/index.js（服务端）+ lib/client.js（浏览器）
```

配色表由生成器脚本产出——修改 `scripts/generate-palettes.mjs` 后重跑：

```sh
node scripts/generate-palettes.mjs
```

## 🙋 常见问题

- Q: **_"为什么外观行里看不到 Catppuccin 主题？"_**\
  A: 官方外观行只列出内置的浅色/深色/跟随系统偏好。四个主题在它正下方的
  **Catppuccin** 行里。
- Q: **_"我的主题选择是怎么记住的？"_**
  A: 选择保存在 `dsh-catppuccin` 设置里，启动时会自动恢复。

## 💝 致谢

- [Catppuccin](https://github.com/catppuccin) 提供的色板与 port 模板
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的插件体系

 

	![](https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/footers/gray0_ctp_on_line.svg?sanitize=true)

	Copyright &copy; 2021-present [Catppuccin Org](https://github.com/catppuccin)