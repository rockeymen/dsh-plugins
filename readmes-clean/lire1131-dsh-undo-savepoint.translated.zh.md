# dsh-undo-savepoint — DSH 撤销/回退系统

[![awesome · DSH plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

**为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 打造的撤销/回退系统：装插件、换皮肤、改设置，自动保存即存档；手动保存随时存档；一键撤销 / 恢复 / 回退到任意版本。DSH 启动不了时，还有局外 WebUI / GUI / CLI 兜底。**

还在为 DSH 崩溃而苦恼？还在担心小改动带来大灾难？配置与插件代码一键回滚、快照密钥脱敏、一键安全模式——DSH 挂了也能自救。

## 预览

### 会话头部：撤销 / 恢复 / 快照 / 对话撤回全部图标化 + 自动快照状态徽章（已存 24 份 · 3 小时前）
- **会话头部：撤销 / 恢复 / 快照 / 对话撤回全部图标化 + 自动快照状态徽章（已存 24 份 · 3 小时前）**: ![header](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/shots/webui-header.png)

### WebUI 快照面板：手动保存 / 撤销 / 恢复 / 清理 / 导出导入 / 安全模式，逐条「差异 / 回退到此版本 / 删除」 · DSH 设置「快照」独立栏目（自动保存 / 保留数量 / 敏感模式 / 插件白名单 / 定时快照）
- **WebUI 快照面板：手动保存 / 撤销 / 恢复 / 清理 / 导出导入 / 安全模式，逐条「差异 / 回退到此版本 / 删除」**: ![panel](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@95230c2/docs/shots/webui-panel.png) · **DSH 设置「快照」独立栏目（自动保存 / 保留数量 / 敏感模式 / 插件白名单 / 定时快照）**: ![settings](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/shots/webui-settings-section.png)

### 局外 WebUI：崩溃横幅 + 撤销 / 重做 / 安全模式 / 诊断 / 对话撤回 / 设置，不依赖 DSH 运行（快照对比与设置见[局外工具](#局外工具dsh-挂了也能用)一节）
- **局外 WebUI：崩溃横幅 + 撤销 / 重做 / 安全模式 / 诊断 / 对话撤回 / 设置，不依赖 DSH 运行（快照对比与设置见[局外工具](#局外工具dsh-挂了也能用)一节）**: ![gui](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@95230c2/docs/shots/gui-main.png)

## 核心能力

### 能力 · 说明
- **能力**: **配置 + 插件代码一键回滚** · **说明**: 快照覆盖配置与用户插件代码树，改坏任何一处都能撤销（含 yield\* 类纯代码事故）；支持 undo / redo / 回退任意版本，WebUI / 对话 / 离线 CLI 三入口
- **能力**: **消息级撤销** · **说明**: 按 AI 消息（或 60s 批次）记录工作区文件变更，一句话回滚「这条消息改了什么」（恢复原内容 / 删除新建文件）；不依赖 git、不碰会话存储；「跟踪工作区目录」可在设置中配置（逗号 / 分号多选，非空时覆盖默认工作目录）
- **能力**: **局内对话撤回** · **说明**: 对话头部「对话撤回」入口 + 消息级撤回面板，在 DSH 面板里即可撤回指定消息批次的文件改动
- **能力**: **密钥脱敏 + 本机 vault** · **说明**: `.env` / 凭据进快照自动脱敏（结构保留），导出 ZIP 零泄露；真实值存本机 vault，本机回滚完整还原
- **能力**: **一键安全模式** · **说明**: DSH 完全起不来时，禁用除撤销系统外所有插件保证能启动；自动快照 + 备份配置（profile / home 双级 patch 一并备份恢复，并中和 `dsh.profile.bundles` 里会导致启动器硬校验失败的条目），一键退出；家目录被重建 / 换机时残留状态自动降级不激活
- **能力**: **崩溃归因** · **说明**: 上次异常退出时直接给出「最后正常快照」id + 一键回退按钮；按日志签名分类崩溃原因（`session-corrupt` / `bundle-check` / `patch-tree`），横幅给出对应处置建议
- **能力**: **会话文件扫描修复** · **说明**: `undo_scan` 扫描 `<home>/sessions/**/session.jsonl.zstd`：单帧布局违规（8/18 崩溃根因）可一键重编码修复（原件留 `.bak` + 隔离区副本），无法解码的只隔离不动；DSH 起不来时用 `dsh-undo.ps1 scan [--fix]` 离线处理（需 Node ≥22.15，Node 20 下降级为提示）
- **能力**: **快照时间线（Time Machine）** · **说明**: 快照按日期分组卡片化（备注 / 标签芯片，尊重 `prefers-reduced-motion`）+ 文件级 diff（新增 / 删除行高亮、目录树导航、逐文件浏览）+ 一键回滚
- **能力**: **快照管理** · **说明**: 备注 / 标签（`undo_note`，时间线可直接编辑）、定时快照（间隔制，自动建档 + 保留清理）、孤儿 blob GC（`undo_compact`，释放磁盘）、ZIP 导出 / 导入（可选 AES-256-GCM 加密，兼容 PowerShell 明文互操作）
- **能力**: **一键诊断 `undo_doctor`** · **说明**: 检查快照目录可写性、blob 完整性（缺失 / 孤儿）、设置文件健康、快照规模分布，输出 ok / warn / err 结构化报告与修复提示
- **能力**: **跨机迁移安全** · **说明**: 恢复前自动预检缺失插件并明确提示；快照可一键导出 / 导入 ZIP 迁移（见 [docs/migration.md](docs/migration.md)）
- **能力**: **局外急救** · **说明**: DSH 挂了也能用：WebUI + GUI 窗口 + CLI + 桌面快捷方式，时间线 / 回滚 / 对比 / 安全模式 / 诊断一应俱全

> 基础能力（键盘快捷键、对话指令、自动清理、双模式保存、可配置参数等）见下文与[更新日志](CHANGELOG.md)。

## 平台支持

v0.4.0 起核心抽取为纯 Node 零依赖模块（`lib/core.mjs` / `lib/zip.mjs`），外围按平台分发，Windows / macOS / Linux 三平台可用：

### 能力 · Windows · macOS · Linux
- **能力**: 配置 / 插件快照、撤销 / 重做 · **Windows**: ✅ · **macOS**: ✅ · **Linux**: ✅
- **能力**: 局外 CLI / GUI · **Windows**: ✅（.bat / .ps1） · **macOS**: ✅（.command） · **Linux**: ✅（.sh）
- **能力**: 局外 WebUI（undo-server） · **Windows**: ✅ · **macOS**: ✅ · **Linux**: ✅
- **能力**: 文件选择对话框 · **Windows**: PowerShell 原生 · **macOS**: osascript · **Linux**: zenity → kdialog（都没有则回退手输）
- **能力**: CI 回归 · **Windows**: windows-latest · **macOS**: macos-latest · **Linux**: ubuntu-latest

> CI 为三平台矩阵（`windows/ubuntu/macos × node[20,22]`）。ZIP 导出 / 导入由纯 Node 零依赖 `lib/zip.mjs` 实现（deflate / 存储、CRC32、UTF-8），不引入运行时依赖，与 PowerShell 互操作已双向验证。

> ![icon](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/app-icon.png)
>
> Logo / 图标：生成提示词见 `docs/logo-prompt.md`；WebUI favicon 用内置 `tools/webui/logo.svg`。自定义图标：透明 PNG 存为 `tools/webui/logo.png`，运行 `node tools/make-ico.mjs tools/webui/logo.png tools/webui/logo.ico` 生成 `.ico`，下次创建快捷方式时自动启用（回退顺序 `logo.ico` → `logo.png` → 系统默认）。

## 崩溃急救速查（按场景选工具）

### 场景 · 操作
- **场景**: 配置 / 插件被改坏 · **操作**: 对话 / WebUI / CLI：`undo` 或 `restore -Id `
- **场景**: 插件代码被改坏 · **操作**: 同上（快照含插件代码树，一键还原）
- **场景**: 上次异常退出，不知回退到哪 · **操作**: WebUI / GUI 横幅显示 last-good 快照，一键回退
- **场景**: **DSH 完全起不来** · **操作**: 桌面「DSH撤销管理器」→ **安全模式**按钮（或 CLI `safe-mode -Label on`）→ 重启 DSH 保证能启动
- **场景**: 崩溃横幅提示会话损坏 · **操作**: 对话 / CLI：`undo_scan quarantine=true` 修复（或离线 `dsh-undo.ps1 scan --fix`）
- **场景**: 恢复后可能缺插件（跨机） · **操作**: 恢复报告预检提示；先装插件或进安全模式
- **场景**: 配置「突然变了」 · **操作**: CLI `recent` / 对话 `undo_recent` 查回滚日志
- **场景**: 撤销涉及插件 / 挂载 · **操作**: 报告提示「重启 DSH 后生效」

### 安全模式确认：一键禁用除本插件外的全部用户插件，保证 DSH 能启动，之后再逐个排查
- **安全模式确认：一键禁用除本插件外的全部用户插件，保证 DSH 能启动，之后再逐个排查**: ![safemode](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/shots/safe-mode-confirm.png)

## 安装

前置：已安装 DSH（`@deepseek-ai/dsh`）与 Node.js（≥20）。

### 方式 A：GitHub 直装（推荐）

安装 master 最新提交：

```bat
dsh plugin --profile web add github:lire1131/dsh-undo-savepoint#master
```

安装完成后重启 DSH 即生效（快照目录、参数等均可在设置中修改）。

### 方式 B：本地源码 / 免发布

1. **把仓库放到本地插件目录**（无中文路径更稳妥），例如 `D:\dsh\plugins\dsh-undo-savepoint`：

```bat
git clone https://github.com/lire1131/dsh-undo-savepoint.git D:\dsh\plugins\dsh-undo-savepoint
```

2. **建立 junction**（Windows），让 DSH 的模块解析器通过包名 `dsh-undo-savepoint` 找到本地源码（host 插件与 WebUI client 插件都靠它）：

```bat
mklink /J "<你的DSH安装>\node_modules\dsh-undo-savepoint" "D:\dsh\plugins\dsh-undo-savepoint"
```

> DSH 从它自己的 `node_modules` 向上解析包名。默认安装位置是 `C:\Users\<用户名>\node_modules`（npm 安装在用户目录时）；若用 npx 缓存运行，则对 npx 缓存目录下的 `node_modules` 建 junction。执行 `npm root -g` 或检查 DSH 启动报错路径即可确认。

3. **挂载到 profile 补丁层**：编辑 `<DSH_HOME>\profiles\web\cordis.patch.yml`，追加：

```yaml
- insert:
    - id: dsh-undo-savepoint
      name: dsh-undo-savepoint
```

4. **生效**：保存即热加载（host 部分）；刷新页面出现头部按钮与设置项；重启 DSH 后一切进入稳态（旧版扁平快照会自动迁移）。

> 依赖说明：host 插件通过 `createRequire('<DSH安装根>/package.json')` 加载 `@deepseek-ai/dsh-tools`。若 DSH 安装在其他位置，设置环境变量 `DSH_ROOT=<DSH安装根>` 即可，无需额外安装依赖。

## 使用（DSH 内）

- **撤销**：头部「撤销」按钮 / `Ctrl+Alt+Z` / 对 AI 说「撤销上一步」。
- **恢复**：「恢复」按钮 / `Ctrl+Alt+Y`（仅当撤销后没有新操作）。
- **手动保存**：面板里「手动保存」/ 对 AI 说「保存快照」/ CLI `snapshot`。
- **回退到指定版本**：面板里点快照行「回退到此版本」；或对 AI 说「回退到 \」；或 CLI `restore -Id `。
- **删除快照**：面板里点「删除」；或 CLI `remove -Id `。
- **消息级撤销**：对话头部「对话撤回」，选择消息批次撤回其文件改动。
- **自定义快捷键**：设置 → 通用 → 撤销 / 恢复快捷键（点击输入框后按组合键，Backspace 清除）。
- **保存参数**：设置 → 通用 → 快照设置（自动保存开关、防抖、保留数、两个目录、跟踪工作区目录，目录旁 📁 按钮可打开系统目录选择器）。其中「跟踪工作区目录」逗号 / 分号多选，非空时覆盖默认工作目录。

### 对话级撤回：按消息批次回滚该批改动（时间可回溯到任意一轮对话之后）
- **对话级撤回：按消息批次回滚该批改动（时间可回溯到任意一轮对话之后）**: ![msgundo](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/shots/message-undo.png)

### 差异预览：文件级变更红删绿增，确认无误再回滚 · 编辑备注 / 标签：快照列表里直接改
- **差异预览：文件级变更红删绿增，确认无误再回滚**: ![webdiff](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/shots/webui-diff.png) · **编辑备注 / 标签：快照列表里直接改**: ![note](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/shots/webui-note.png)

## 局外工具（DSH 挂了也能用）

### 局外 WebUI（推荐，全平台）

```bash
node tools/undo-server.mjs     # 或双击 launch-undo.bat / .command / .sh / .desktop
```

拉起纯本地 `127.0.0.1` 服务器 + 内置网页：时间线 / 回滚 / 对比 / 安全模式 / 诊断，双击即用，不依赖 DSH。插件加载后还会自动在桌面创建「dsh-undo-savepoint」快捷方式，双击直接打开。

### 桌面快捷方式：插件加载后自动创建，双击直接打开局外 WebUI
- **桌面快捷方式：插件加载后自动创建，双击直接打开局外 WebUI**: ![shortcut](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/shots/shortcut-icon.png)

### 快照对比：文件列表 + 变更统计（+8 / -2）+ 行级差异高亮 · 局外设置：防抖 / 保留数量 / 脱敏模式 / 目录选择 / 桌面快捷方式
- **快照对比：文件列表 + 变更统计（+8 / -2）+ 行级差异高亮**: ![guidiff](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/shots/gui-diff.png) · **局外设置：防抖 / 保留数量 / 脱敏模式 / 目录选择 / 桌面快捷方式**: ![guisettings](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/shots/gui-settings.png)

### 工具位置

局外工具（GUI 窗口 + 命令行）不装到桌面，而是随插件装在安装目录里：

### 安装方式 · 工具位置
- **安装方式**: 方式 A：`dsh plugin add` · **工具位置**: `$DSH_HOME\profiles\web\node_modules\dsh-undo-savepoint\tools\`（DSH_HOME 默认 `%USERPROFILE%\.dsh`）
- **安装方式**: 方式 B：clone + junction · **工具位置**: 你 clone 的目录 `...\dsh-undo-savepoint\tools\`

一键创建桌面快捷方式（点开查看 PowerShell 命令）

双击 `tools\make-desktop-shortcut.bat`（自动定位插件目录），桌面出现「DSH撤销管理器」图标；或把下面整段复制到 PowerShell 窗口回车：

```powershell
$dshHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { "$env:USERPROFILE\.dsh" }
$d = @("$dshHome\profiles\web\node_modules\dsh-undo-savepoint", "$dshHome\profiles\node_modules\dsh-undo-savepoint", "$env:USERPROFILE\node_modules\dsh-undo-savepoint") | Where-Object { Test-Path (Join-Path $_ 'tools\dsh-undo-savepoint-gui.bat') } | Select-Object -First 1
if ($d) {
  $w = New-Object -ComObject WScript.Shell
  $s = $w.CreateShortcut((Join-Path ([Environment]::GetFolderPath('Desktop')) 'DSH撤销管理器.lnk'))
  $s.TargetPath = Join-Path $d 'tools\dsh-undo-savepoint-gui.bat'
  $s.WorkingDirectory = Join-Path $d 'tools'
  $s.Save()
  Write-Host "已创建桌面快捷方式：$($s.FullName)"
} e