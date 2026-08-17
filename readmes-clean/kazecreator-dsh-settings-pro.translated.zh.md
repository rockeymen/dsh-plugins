# @kazecreator/dsh-settings-pro

DeepSeek Harness **Settings Pro** 插件 — 一包，五项功能：**IM Bridge**、**Usage**、**Memory**、**Pets** 和 **Vision**。

## 快速开始

1. 将软件包安装到配置文件中：

```bash
dsh plugin --profile <name> add @kazecreator/dsh-settings-pro
```

`<name>` 是配置文件名称（`web` 表示 Web GUI 配置文件）；该命令转发到配置文件目录中的 pnpm。

2、在`cordis.patch.yml`中挂载插件：

```yaml
- insert:
    - id: dsh-settings-pro
      name: '@kazecreator/dsh-settings-pro'
      config: {}
```

3. 重新启动 DSH，以便加载新插件。

4. 打开 Web GUI → **Settings Pro**，然后打开您想要的任何内容 - 全部、几个或一次一个。默认情况下，一切都处于关闭状态，因此在您选择加入之前不会运行任何内容，并且每个切换都是活动的（无需重新启动）。

## 通过一个提示安装并启用

这取代了上面的整个[快速入门](#quick-start) - 您**不需要**需要先执行这些步骤。 DSH 的代理具有文件访问权限，因此只需粘贴一个提示，它就会为您安装和启用。将 `[...]` 列表替换为您想要的功能：

```text
Install the @kazecreator/dsh-settings-pro plugin into this DSH profile and enable these features: [usage, memory, pets, vision, telegram, wechat]. Keep anything I didn't list disabled.

1. Install the package: run `dsh plugin --profile  add @kazecreator/dsh-settings-pro` (or `pnpm add @kazecreator/dsh-settings-pro` in the profile directory).
2. Add an `insert` entry for plugin id `dsh-settings-pro` (name `@kazecreator/dsh-settings-pro`) to the profile's `cordis.patch.yml`, and in its `config` turn on only the features I named:
   - usage    → `usageEnabled: true`
   - memory   → `memoryEnabled: true`
   - pets     → `petsEnabled: true`
   - vision   → `visionEnabled: true` (plus `visionBaseUrl`, `visionModel`, `visionApiKeyEnv` — ask me for these if I didn't give them)
   - telegram → `telegramEnabled: true` (plus `telegramBotToken`, `telegramAllowedUserIds` — ask me for these if I didn't give them)
   - wechat   → `wechatEnabled: true`
3. Restart DSH so the new plugin loads.
```

代理会安装软件包、编写补丁、准确设置您命名的 `*Enabled` 密钥，然后忽略其他所有内容。重新启动后，功能运行；从那时起，您仍然可以在 **Settings Pro** 中实时翻转任何切换。

＃＃ 特征

### 功能·它的作用·如何启用
- **功能**：**使用** · **它的作用**：DeepSeek 余额 + 官方计费的每日成本/代币（高峰/非高峰定价） · **如何启用**：Settings Pro → **使用** → 切换
- **功能**：**内存** · **它的作用**：交叉重启内存 + `read_memory` / `write_memory` 工具 · **如何启用**：Settings Pro → **内存** → 切换
- **功能**：**宠物** · **它的作用**：跟随对话的桌面宠物 · **如何启用**：Settings Pro → **宠物** → 切换
- **功能**：**视觉** · **它的作用**：在纯文本模型看到图像之前，通过任何 OpenAI 兼容的 VLM 描述图像 · **如何启用**：Settings Pro → **视觉** → 启用 + 选择模型
- **功能**：**IM Bridge** · **它的作用**：Telegram 和微信桥（内置） · **如何启用**：Settings Pro → **IM Bridge** → 令牌/二维码

如果您想为配置文件预先启用某些功能，`*Enabled` 配置键（`usageEnabled`、`memoryEnabled`、`petsEnabled`、`visionEnabled`、`telegramEnabled`、`wechatEnabled`）也可用作安装时默认值。

## 注释

- **更新：** Settings Pro 每天检查一次 npm 注册表（在启动时和设置部分打开时，重用 24 小时缓存）。当存在较新版本时，**Settings Pro** 导航项上会出现 **NEW** 芯片； **关于**选项卡（最后一个选项卡）显示插件信息、已安装/最新版本、手动**检查更新**操作，以及（仅当注册表安装上存在更新时）**更新和重新启动**按钮（在配置文件中运行 `pnpm add @kazecreator/dsh-settings-pro@latest` 并重新启动 dsh 进程）。如果插件作为 `file:` 链接安装（本地开发签出），则更新按钮将被隐藏，并且“关于”选项卡会说明更新是手动的。
- **使用自动同步读取 Chromium 浏览器会话**（macOS / Windows / Linux 上的 Chrome / Edge / Brave / Arc / Opera）以回填官方计费使用量。不支持 Firefox / Safari。
- **未捆绑宠物桌面应用程序。** 默认“浏览器”打开模式在浏览器选项卡中打开 `/pet`，无需额外安装。 “app”模式需要单独的 Electron 桌面宠物应用程序（源存储库中的 `pet-desktop/` 文件夹），该应用程序不属于 npm 包的一部分。
- **在线宠物库取自 GitHub** — [Awesome Codex Pet](https://codexpet.top) 社区画廊，作者：[@legeling](https://github.com/legeling/awesome-codex-pet)]。感谢该项目和每一位宠物作者的公开提交。它在本地缓存并在网络故障时降级为缓存/离线通知。