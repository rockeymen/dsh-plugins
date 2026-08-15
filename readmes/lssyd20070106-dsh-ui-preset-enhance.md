# dsh-ui-preset-enhance

[简体中文](README.md) · [English](README.en.md) · [小白安装手册](INSTALL-GUIDE.md)

一个给 **DeepSeek Harness（DSH）WebUI** 用的第三方界面增强插件。

它主要解决 4 件事：**界面个性化、常用 Prompt 复用、Token / Context 查看、手动 Compact。**

> 当前版本：**v0.1.0 Preview**  
> 第三方项目，不是 DeepSeek 官方组件。项目按当前公开的 DSH `0.1.0-rc.6` 客户端接口进行了源码兼容检查，并附带构建、运行入口和 DSH 安装 Smoke Test。正式发布初期仍建议保留 Preview 标记，方便收集不同环境的兼容反馈。

## 效果预览

<p align="center">
  <img src="assets/preview-home.png" alt="DSH WebUI background preview" width="100%" />
</p>

<p align="center">
  <img src="assets/preview-settings.png" alt="DSH appearance settings prototype" width="100%" />
</p>

> 上面两张图来自项目早期视觉原型。正式插件使用独立的 **“设置 → 界面增强”** 页面提供同方向的壁纸、模糊、透明度和强调色功能，具体控件位置可能与原型图略有不同。

## 最简单的安装方法

电脑已经有 Node.js 和 pnpm 时，只需要这一行：

```powershell
npx --yes @deepseek-ai/dsh plugin --profile web add github:lssyd20070106/dsh-ui-preset-enhance
```

安装完成后：

1. 完全关闭并重新启动 DSH Web；
2. 浏览器按 `Ctrl + F5`；
3. 打开 **设置 → 界面增强**。

### 不会命令行？

下载本仓库 ZIP，**先解压**，然后双击：

```text
INSTALL-WINDOWS.cmd
```

它会检查 Node.js、pnpm、插件文件和 DSH 安装结果。遇到问题直接看：

**[《小白安装手册》INSTALL-GUIDE.md](INSTALL-GUIDE.md)**

## 功能

| 功能 | 简单说明 |
| --- | --- |
| 🖼️ 自定义背景 | 本地上传、网络图片或 5 个渐变预设 |
| 🌫️ 透明与模糊 | 调整 DSH 界面层透明度和壁纸模糊 |
| 🎨 主题颜色 | 主色、辅助色与强调色阶 |
| 📑 Prompt 预设 | 7 个内置模板 + 自定义保存 / 删除 / 快速载入 |
| 📊 Token / Context | 查看当前 Session 的 Context 压力、窗口和 Token 组成 |
| 🧹 手动 Compact | 通过当前 Session 的 DSH 命令接口执行 `/compact` |

## 安全与边界

这个项目定位是 **Web 客户端增强**：

- 不注册新的后端 Tool；
- 不修改 Agent-Loop 核心；
- 不上传你保存的 Prompt 到本项目自己的服务器；
- 壁纸、主题和用户 Prompt 预设主要保存在浏览器 `localStorage`；
- 自定义壁纸 URL 只接受 `http://`、`https://` 和图片 `data:` URL，拒绝任意脚本 / CSS URL。

如果你使用网络图片作为壁纸，浏览器仍会正常访问那个图片服务器，因此对方服务器可以收到普通网络请求信息。

## 我们检查了什么

仓库内置两层 Smoke Test：

```text
scripts/smoke.mjs
scripts/runtime-smoke.mjs
```

它们会检查：

- `package.json` / `cordis.patch.yml` / `./client` 导出是否一致；
- `window.__ModuleLoader__.load(...)` 包装和插件 ID；
- Settings 与 Sidebar Slot 是否能注册；
- 当前 Session 的 Token Projection 是否能读到；
- `/compact` 是否走 Session `command()`；
- 已保存壁纸、主题 Token 是否能在插件启动时恢复；
- 构建产物是否含本机绝对路径。

GitHub Actions 还会在干净环境中：

1. TypeScript 检查；
2. 重建 `dsh/client.js` / `dsh/index.js`；
3. JavaScript Syntax Check；
4. `npm pack --dry-run`；
5. 用 `@deepseek-ai/dsh@0.1.0-rc.6` 创建干净 Web Profile，并实际执行一次 `dsh plugin add file:...` 安装检查。

> 自动化测试能覆盖“能否构建、能否加载插件结构、能否被 DSH CLI 安装”。最终的浏览器视觉和不同 DSH 预览版本仍需要真实用户环境反馈。

## 为什么普通用户不用自己编译

仓库直接提交了：

```text
dsh/client.js
dsh/index.js
```

所以普通用户安装的是已经构建好的运行文件，不需要安装 TypeScript，也不需要在安装过程中运行构建脚本。

开发者修改 `src/` 后才需要：

```powershell
npm install
npm run verify
```

## 检查安装是否成功

下载版双击：

```text
VERIFY-WINDOWS.cmd
```

或者运行：

```powershell
npx --yes @deepseek-ai/dsh plugin --profile web list dsh-ui-preset-enhance --depth 0
```

## 卸载

```powershell
npx --yes @deepseek-ai/dsh plugin --profile web remove dsh-ui-preset-enhance
```

下载版也可以双击：

```text
UNINSTALL-WINDOWS.cmd
```

## 推荐搭配：Skills 管理“技巧”插件

如果你经常使用 DSH Skills，我推荐原作者 **Fishquito7** 的：

### [Fishquito7/dsh-skill-viewer](https://github.com/Fishquito7/dsh-skill-viewer)

这个项目**不是我制作的，也不是本项目的一部分**。它主要用于在 DSH Web 界面查看、添加、删除以及热启用 / 停用 Skills。安装方法、版本和问题请以原作者仓库为准。

简单区分：

- **dsh-ui-preset-enhance**：界面、壁纸、主题、Prompt、Token / Context；
- **dsh-skill-viewer**：Skills 管理。

## 项目结构

```text
dsh-ui-preset-enhance/
├─ .github/workflows/ci.yml
├─ assets/                    # README 截图
├─ docs/                      # 设计说明
├─ dsh/                       # 已构建、可直接运行的 DSH 文件
├─ scripts/                   # 构建与 Smoke Test
├─ src/                       # TypeScript / React 源码
├─ INSTALL-GUIDE.md           # 小白安装手册
├─ INSTALL-WINDOWS.cmd        # 双击安装
├─ VERIFY-WINDOWS.cmd         # 双击检查
├─ UNINSTALL-WINDOWS.cmd      # 双击卸载
├─ install.ps1
├─ verify.ps1
├─ uninstall.ps1
├─ package.json
├─ cordis.patch.yml
└─ LICENSE
```

## 开发

需要 Node.js 20+。

```powershell
npm install
npm run typecheck
npm run build
npm run smoke
```

或者一次完成：

```powershell
npm run verify
```

构建脚本只使用 TypeScript，不依赖原生 bundler 二进制；`src/client.tsx` 是单文件 Client Entry，运行时模块由 DSH 的 Client Module Loader 提供。

## 问题反馈

提交 Issue 时最好附上：

- DSH 版本；
- Windows / macOS / Linux 版本；
- 安装命令完整输出；
- 浏览器 Console 的相关红色报错。

请先删除 API Key、Cookie、Token、私有 Prompt、路径中的个人姓名等敏感信息。

## License

MIT — 见 [LICENSE](LICENSE)。
