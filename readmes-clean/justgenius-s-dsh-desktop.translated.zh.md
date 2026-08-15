![DSH-Desktop 应用程序图标](build/icon-app.png)

#DSH-Desktop

Electron桌面外壳适用于[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(DSH)。捆绑node + pnpm，将`@deepseek-ai/dsh`安装到`~/.dsh/runtime`中，并在浏览器窗口中提供`dsh web` UI。

  ![DSH-Desktop 截图](public/desktop.png)

## 下载并安装

预构建包发布在 [GitHub Releases](https://github.com/JustGenius-s/DSH-Desktop/releases).首次启动会安装 DSH 运行时（约 1-2 分钟）。

### macOS

1. 从最新版本下载`DSH-Desktop-*.dmg`。
2. 打开`.dmg`，将`DSH-Desktop.app`拖入`/Applications`中。
3. 该应用程序未签名，因此 Gatekeeper 会阻止首次启动。右键单击该应用程序 → **打开**并确认，或运行：

```sh
xattr -dr com.apple.quarantine /Applications/DSH-Desktop.app
```

### 窗口

1. 从最新版本下载`DSH-Desktop Setup *.exe`（安装程序）或`DSH-Desktop-*-win.zip`（便携式）。
2. 运行安装程序，或解压缩存档并启动 `DSH-Desktop.exe`。
3. 构建未签名，因此 SmartScreen 可能会发出警告。单击 **更多信息** → **仍然运行**。

## 它是如何工作的

```
Electron main process
  ├─ bundled node + pnpm (resources/runtime; repo-root runtime/ in dev)
  ├─ first launch: pnpm installs @deepseek-ai/dsh → ~/.dsh/runtime (upgradeable)
  ├─ spawn  dsh web --host 127.0.0.1 --port <free-port>
  └─ BrowserWindow → http://127.0.0.1:
```

DSH 在运行时从 npm 安装，而不是随应用程序一起提供。升级 DSH = 启动时检测较新版本 → 单击“更新”→ 重新启动。无需重建或重新签名。

## 开发

```sh
pnpm install
pnpm collect      # download node + pnpm into runtime/
pnpm start        # first launch installs @deepseek-ai/dsh (~1-2 min)
```

开发和打包的行为相同：都使用捆绑节点和外部 `~/.dsh/runtime`。

## 套餐

```sh
pnpm dist:mac     # macOS dmg + zip
pnpm dist:win     # Windows nsis + zip (run on Windows)
```

macOS 工件未签名；网守阻止首次启动。允许：

```sh
xattr -dr com.apple.quarantine /Applications/DSH-Desktop.app
```

## 运行时依赖

- Node（最新）+ pnpm（最新），通过 `scripts/collect-runtime.mjs` 捆绑
- `@deepseek-ai/dsh`（npm最新），安装到`~/.dsh/runtime`

## 我们的插件

配套 DSH 插件位于 [DSH-Plugs](https://github.com/JustGenius-s/DSH-Plugs)。

## 感谢
- [Linux do](https://linux.do/)