![DeepDeck 应用程序图标](branding/app-icon.png)

#DeepDeck

  DeepSeek Harness 的原生桌面客户端。

![DeepDeck 桌面应用程序](docs/deepdeck-brand-preview.png)

DeepDeck 是一款基于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).上游项目作为浅层 Git 子模块固定在 `vendor/deepseek-harness`；该存储库拥有桌面生命周期、插件组成的界面、品牌、打包和自动更新层。 [anywhere-labs/deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop/tree/master/dsh-community-market) 的社区市场固定在 `plugins/community-market` 下，而 [dsh-codex-connect](https://github.com/franksong2702/dsh-codex-connect) 仍然是单独的固定结账。两者都作为普通 Cordis 捆绑包进行预加载。

DeepDeck 重用了官方 `web` 配置文件及其完整的插件组成的 UI。桌面主机在操作系统分配的环回端口上启动 Harness 进程，等待其准备就绪，然后在应用程序窗口中打开本地 UI。关闭应用程序会彻底关闭 Harness 进程。

可以从 **设置 → 插件 → Bun Builder** 编译受信任的本地插件源。 DeepDeck 将此流程捆绑 Bun，创建私有源快照，需要显式构建计划确认，并在不运行依赖项生命周期脚本的情况下发出校验和 `.tgz`。当所选源是当前 Cordis 配置文件安装的确切包时，相同的计划可以就地构建并热替换其主机和客户端条目，而无需重新启动桌面应用程序。所选包自己的构建脚本仍然以用户的权限运行。

## 第一次运行

先决条件：Node.js `^22.19.0` 或 `>=24.0.0`、Corepack 和 Git。

```sh
git submodule update --init --depth 1
pnpm install
pnpm bootstrap
pnpm start
```

`pnpm bootstrap` 安装并构建固定的 Harness、社区市场和 Codex Connect 源，然后构建桌面应用程序。稍后启动仅需要 `pnpm start`，除非固定源版本发生更改。

桌面使用标准 Harness 主目录（未设置时为 `$DSH_HOME` 或 `~/.dsh`），因此配置文件、模型设置、凭据、补丁和已安装的插件与上游 CLI 保持兼容。如果需要独立的桌面配置文件，请在启动前设置 `DSH_HOME`。

## 品牌推广

面向用户的品牌位于 `branding/brand.json` 的上游子模块之外。替换引用的文字标记、标记、图标和应用程序图标文件以重新命名桌面，而无需编辑 `vendor/deepseek-harness`。设置 `DESKTOP_BRAND_PATH` 在启动时加载不同的清单。

## 有用的命令

```sh
pnpm start             # build and launch the desktop client
pnpm start:packaged    # rebuild and launch the packaged desktop client
pnpm check             # type-check desktop main, preload, and renderer code
pnpm test              # run focused desktop tests
pnpm package:local     # build and verify an unsigned local macOS package
pnpm package:mac       # build signed production macOS packages
pnpm harness:build     # rebuild the pinned Harness checkout
pnpm market:build      # rebuild the pinned Community Market bundle
```

有关依赖边界和插件集成方向，请参阅[docs/architecture.md](docs/architecture.md)。

## 桌面更新

打包版本在启动后不久就会检查更新。当有可用版本时，桌面侧边栏会显示更新指示器；用户明确开始下载并看到本机更新程序进度。下载完成后，桌面会安全地停止其 Harness 进程，安装更新，然后自动重新启动。开发启动不会联系更新服务。

`electron-updater` 读取打包管道生成到 `app-update.yml` 中的发布提供程序。 `DEEPSEEK_DESKTOP_UPDATE_URL` 可以使用通用 HTTP(S) 源覆盖该提供程序，以进行受控构建和更新测试。生产更新发布到 `https://deepdeck-updates.getmegaportal.com`。该提要包含平台元数据、签名工件和块图； macOS 版本包括 ZIP 更新目标和 DMG。

签名发布流程和回滚模型请参见[docs/release.md](docs/release.md)]。