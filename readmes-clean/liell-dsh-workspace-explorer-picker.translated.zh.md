#dsh-workspace-explorer-picker

> 一个 **DeepSeek Harness 桌面** 插件，可在您添加工作区时直接打开本机 **Windows 资源管理器文件夹选择器** - 不再需要应用程序内目录浏览器。

在DeepSeek Harness桌面中点击**添加工作区**通常会打开一个目录
在 Web GUI 中呈现的浏览器。该插件完全跳过该对话框并且
立即打开真正的 **Windows 资源管理器** 文件夹选择器 - 相同的本机
shell 已将其用于“使用 Windows 选择”操作的对话框。

## 特点

- 直接从“添加工作区”打开**本机 Windows 资源管理器文件夹对话框**
  （对话英雄和侧边栏）。
- **无渲染**客户端插件 - 没有自己的 UI 需要维护。
- 使用桌面 shell 自己的选择器 (Electron `dialog.showOpenDialog`) - 完整
  资源管理器体验（快速访问、面包屑、搜索、新建文件夹）。
- **在 DSH 桌面更新中幸存下来**：安装在 `$DSH_HOME`（用户配置文件）下，
  从来没有在`Program Files`里面。
- **幂等安装程序** (`install.ps1`)，可在任何计算机上快速安装。
- **无卷限制**：选择任何可访问的文件夹，包括 exFAT/FAT32
  和网络量。
- **市场就绪**：声明 `dsh.bundle.patch`，因此可以从
  DSH 社区市场 / npm。

## 要求

### 要求·详细信息
- **要求**：操作系统 · **详细信息**：**Windows**（资源管理器选择器是仅限 Windows 的 shell 功能）
- **要求**：应用程序 · **详细信息**：**DeepSeek Harness 桌面**（Electron 桌面应用程序）
- **要求**：GUI 条目 · **详细信息**：应用程序窗口或应用程序打开的浏览器选项卡（桌面选择器桥必须存在）

在桌面外壳之外，插件会退回到主机目录选择器接缝。

## 安装

### 自动（推荐）

需要 PowerShell。从存储库根目录：

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

它的作用：

1.将插件复制到`$DSH_HOME\profiles\node_modules\dsh-workspace-explorer-picker\`中
   （`$DSH_HOME` 默认为 `~/.dsh`）。
2. 将激活行附加到`$DSH_HOME\profiles\desktop\cordis.patch.yml`。
3. 打印确认信息 - 然后**重新启动 DeepSeek Harness Desktop**。

该脚本是幂等的：重新运行它是安全的。

### 手册

1、将`lib`文件夹、`cordis.patch.yml`和`package.json`复制到
   `$DSH_HOME\profiles\node_modules\dsh-workspace-explorer-picker\`。
2. 附加到`$DSH_HOME\profiles\desktop\cordis.patch.yml`：

```yaml
- id: directory-picker
  disabled: true
- insert:
    - id: directory-picker-explorer
      name: 'dsh-workspace-explorer-picker'
```

3. 重新启动DeepSeek Harness桌面。

＃＃＃ 核实

重新启动后，单击 **添加工作区** - Windows 资源管理器文件夹对话框
应立即打开。如果没有任何反应，请检查下面的日志
`%APPDATA%\DSH Desktop\logs\`（参见[故障排除](#troubleshooting)）。

## 市场和 npm

DeepSeek Harness Desktop 的社区市场在安装时从 **npm** 安装插件
包声明了一个 `dsh.bundle.patch` （这个插件确实 - 请参阅
`cordis.patch.yml`）。捆绑补丁禁用库存自适应选择器并
插入此插件，因此当
插件作为捆绑包安装。

1. **发布到 npm** 以便市场可以解析安装目标：

   ```powershell
   npm login
   npm publish
   ```

2. **在目录中列出**（例如 dshfind）：提交您的包裹
   `https://dshfind.com` 遵循其提交流程。目录验证
   存储库反向链接（`package.json` 中的 `repository` 指向您的
   GitHub 存储库）在接受结构化安装证据之前。

3. **用户从市场安装**（DSH桌面中的插件/市场）
   设置）：主机运行`pnpm add dsh-workspace-explorer-picker`，适用
   捆绑补丁，并将其添加到配置文件捆绑中。

## 它是如何工作的

DeepSeek Harness Desktop 由 Cordis 捆绑包组成其 Web GUI，并应用
来自 `$DSH_HOME/profiles//cordis.patch.yml` 的用户补丁层。股票
“添加工作区”流程使用应用内目录浏览器填充 UI 槽。

该插件是一个 *renderless* 客户端插件，占用相同的目录流
插槽（`conversation.hero.workspace.directoryFlow` 和
`sidebar.workspaces.directoryFlow`），并在每次打开时选择一个文件夹：

1. `window.__DSH_DESKTOP_PICK_DIRECTORY__` - DSH 桌面外壳桥
   （Electron `dialog.showOpenDialog` 和 `openDirectory`）- Windows 资源管理器
   文件夹对话框。
2.后备：主机`workspaces.pickDirectory()`目录选择器接缝。

补丁行 `directory-picker`（库存自适应选取器）被禁用，因此
应用内浏览器永远不会出现。

因为所有内容都位于 `$DSH_HOME` 下，所以更新到 DSH 桌面（取代
`Program Files`）永远不要碰该插件。

## 卸载

1. 从 `cordis.patch.yml` 中删除补丁行（参见【手动安装](#manual)】）。
2、删除`$DSH_HOME\profiles\node_modules\dsh-workspace-explorer-picker`。
3. 重新启动DeepSeek Harness桌面。

## 故障排除

### 症状·原因/修复
- **症状**：“添加工作区”仍然打开应用程序内浏览器 · **原因/修复**：应用程序未重新启动，或未应用补丁。重新运行`install.ps1`并重新启动DSH桌面。
- **症状**：单击“添加工作区”时没有任何反应 · **原因/修复**：插件激活失败。检查`%APPDATA%\DSH Desktop\logs\`并确认`profiles\node_modules`下存在包文件夹。
- **症状**：选择器打开，但工作区被拒绝 · **原因/修复**：工作区服务验证服务器端路径；选择一个您可以读写的目录。
- **症状**：拾取器意外回落到主机接缝 · **原因/修复**：在没有桌面桥的情况下打开 GUI（例如手动输入 URL）。请改为通过应用程序打开 GUI。

## 发展

装载机只需要`package.json`（与`dsh.client`和
`dsh.bundle.patch` 声明）和 `lib/`。没有构建步骤：
`lib/client.js` 是一个 `window.__ModuleLoader__.load` 捆绑包，镜像
官方`@deepseek-ai/dsh-client-ui-directory-picker-native`的结构
插件。

```
dsh-workspace-explorer-picker/
|-- lib/
|   |-- index.js        # host half (no-op; the plugin is client-only)
|   |-- client.js       # browser half: renderless directory-flow occupant
###
-
-
-
`-- LICENSE
```

## 出版

### npm

```powershell
npm login
npm pack          # produce the .tgz (verify the contents)
npm publish
git tag v1.0.0
```

### GitHub

```powershell
git remote add origin https://github.com/liell/dsh-workspace-explorer-picker.git
git push -u origin main
```