# DSH 美女系列皮肤 | dsh-beauty-skins

**跑 agent 的地方，也可以是你选的样子。**

给 DeepSeek Harness 用的**美女系列**皮肤：设置里从 [哲风壁纸](https://haowallpaper.com/homeView?page=1&lbName=%E7%BE%8E%E5%A5%B3&sortType=3&rows=9&wpType=3,4) 拉预览网格，点一张即应用，配色从壁纸提取。支持动态壁纸，也保留自定义选图。

本仓库基于 HeiGeAi 的皮肤系统改写，与 DeepSeek 官方无隶属关系。壁纸来自 [哲风壁纸](https://haowallpaper.com)，版权归原站及作者。

![设置里点选美女系列壁纸](docs/screenshot.png)

## 长这样

  ![皮肤预览 1](docs/skin-1.png)
  ![皮肤预览 2](docs/skin-2.png)
  ![皮肤预览 3](docs/skin-3.png)
  ![皮肤预览 4](docs/skin-4.png)
  ![皮肤预览 5](docs/skin-5.png)
  ![皮肤预览 6](docs/skin-6.png)

## 怎么选

设置 → 通用设置 → 皮肤。第一行仍是「自定义（选图）」「默认」「美女系列」；下面是壁纸预览网格，点一张即应用。动态壁纸带「动态」角标，生效后在窗口里循环播放。

每张壁纸都会走和自定义选图同一套本地取色：解码、采样、压成 WebP 存进 `~/.dsh/skins/`，视频本身不落地，由 Host 代理播放。

## 快速开始

前置：一份 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 源码（`0.1.0-rc.7`）、Node.js 22.19+、pnpm。`npx @deepseek-ai/dsh` 装不了，皮肤要跟前端一起构建。

Windows PowerShell（本机若禁止脚本，加上 Bypass）：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1 \path\to\deepseek-harness
cd \path\to\deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

Git Bash / macOS / Linux：

```bash
bash scripts/install.sh /path/to/deepseek-harness
cd /path/to/deepseek-harness && pnpm install && pnpm run build && pnpm dsh web
```

浏览器打开 `http://127.0.0.1:3080`，左下角**设置 → 通用设置 → 皮肤**。退回原样：

```bash
bash scripts/uninstall.sh /path/to/deepseek-harness
```

Windows：`powershell -ExecutionPolicy Bypass -File scripts/uninstall.ps1 \path\to\deepseek-harness`

## 自定义选图

点「自定义（选图）」，本地解码、取色、压成 WebP，图只存在本机 `~/.dsh/skins/`。与点选目录壁纸互不影响。

## 使用须知

- 源码级改动：覆盖 `packages/client/ui-theme` 并打宿主补丁，需要重新 `pnpm run build`。
- 基线 DSH `0.1.0-rc.7`。上游改界面结构时补丁可能打不上。
- 目录壁纸由 Host 代理 [哲风壁纸](https://haowallpaper.com) 的列表与媒体，浏览器不直连、也不内置肖像。素材权利边界见 [NOTICE.md](NOTICE.md)。

## 许可证

代码 [MIT License](LICENSE)。本项目与 DeepSeek 官方无隶属关系。原皮肤引擎来自 [HeiGeAi/deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin)。