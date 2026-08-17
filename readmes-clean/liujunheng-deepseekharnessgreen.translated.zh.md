# DeepSeek Harness 绿色整合版启动器

把 DeepSeek Harness（`dsh`）封装成**双击即用**的本地启动器：
不用手动敲安装命令、不用手动开浏览器。**绿色整合**：Node、dsh、npm/pnpm 缓存、会话数据、临时文件
全部只在本目录 `runtime/` 下存取，**不写用户主目录、不装系统环境**，整目录拷走即用。

> **其他语言**：English — [README_EN.md](README_EN.md)（随版本更新翻译一次，供国际用户参考；本文为准）。

## 一、目录结构

```
DeepSeekHarnessLauncher/
├── start.bat              # ★ 双击这个开始（纯 ASCII + CRLF）
├── stop.bat               # 双击这个停止服务
├── launcher.py            # 核心：tkinter 图形界面 + 自动环境准备
├── DSH_Launcher.exe       # ★ 双击这个开始（exe 版，无需装 Python）
├── DSH_Launcher.ico       # 启动器专属图标（绿色小鲸鱼，窗口/托盘/exe 三处统一）
├── build_exe.bat          # 将 launcher.py 打包为 exe 的工具
├── config.json            # 配置（镜像源 / 端口 / Node / Python 版本）
├── runtime/               # ★ 首次运行自动生成，全部本地数据都在这（绿色整合）
│   ├── node/              # 便携版 Node.js（自动下载）
│   ├── dsh/               # 本地安装的 @deepseek-ai/dsh 包
│   ├── dsh-home/          # dsh 数据（会话/配置/存储）
│   ├── python/            # 内置便携 Python 3.10（含 tkinter，自动下载）
│   ├── npm-cache/         # npm 下载缓存（不会写到 ~/.npm）
│   ├── npm-userconfig     # 本地 npm 配置（阻断读取用户主目录 ~/.npmrc）
│   ├── pnpm-home/         # pnpm 全局目录（dsh 插件管理用）
│   ├── pnpm-store/        # pnpm 内容寻址存储
│   ├── pyinstaller/       # 本地 PyInstaller（打包 exe 用，自动安装）
│   ├── tmp/               # 临时文件
│   ├── server.pid         # 服务进程号
│   └── server.log         # 服务运行日志
├── plugins/               # 内置插件源码（dsh-archive-purge 清理归档 / dsh-session-rewind 会话回退 / dsh-file-browser 文件浏览 / dsh-usage-stats 用量统计）
├── skills/                # 本项目的 DSH 经验 Skill（已安装到 TRAE 全局 skills）
└── README.md / README_EN.md  # 中文说明（维护主体）/ 英文说明（随版本更新翻译一次）
```

## 二、使用步骤

> 本启动器提供**两种启动形态**，选其一即可：
> - **exe 版（推荐）**：直接双击 `DSH_Launcher.exe`，**完全无需安装 Python**
> - **脚本版**：双击 `start.bat`，会自动优先使用内置便携 Python（`runtime/python`），内置缺失时才回退到系统 Python

### 前置要求
- 若用 **exe 版**：什么都不用装
- 若用 **start.bat 脚本版**：首次运行会自动下载内置便携 Python（含 tkinter）到 `runtime/python`，之后不再需要系统 Python；只有内置 Python 下载失败时，才需要手动安装 Python 3（勾选 "Add Python to PATH"）作为兜底

### 第一次使用
1. 双击 **start.bat**（或 `DSH_Launcher.exe`）
2. 弹出启动器小窗口，顶部有**状态指示灯**（绿=运行中 / 黄=已就绪 / 灰=未安装）实时显示服务状态
3. 首次使用：点 **【安装环境】**，自动完成（需要联网，耗时几分钟；**npm 安装过程会实时逐行显示进度**，便于确认没有卡住或报错）：
   - 下载便携版 Node.js v22 到 `runtime/node`（国内镜像优先，失败自动回退官方）
   - 本地安装 `@deepseek-ai/dsh` 到 `runtime/dsh`
   - 补齐内置便携 Python 到 `runtime/python`
4. 状态灯变黄后点 **【启动服务】** → 自动打开浏览器 → `http://127.0.0.1:3080`
5. 在网页里：设置 → 模型 → 填入 DeepSeek API Key；然后**选择工作区**（选择你要让 AI 干活的项目文件夹）
6. 之后每次使用：双击 start.bat（或 exe）→ 状态灯变黄说明环境就绪 → 点【启动服务】即可，秒开

### 界面按钮说明
### 按钮 · 作用 · 何时可用
- **按钮**: 安装环境 · **作用**: 下载便携 Node + 安装 dsh + 补齐内置 Python · **何时可用**: 环境未安装 / 未运行服务时
- **按钮**: 启动服务 · **作用**: 拉起 dsh web 服务并自动开浏览器（界面已在浏览器中打开则不重复开新页） · **何时可用**: 环境已就绪且服务未运行
- **按钮**: 停止服务 · **作用**: 停止 dsh 服务 · **何时可用**: 服务运行中
- **按钮**: 打开界面 · **作用**: 手动在浏览器打开 dsh 界面（**必定打开新页面**，不受单页面去重限制） · **何时可用**: 服务运行中
- **按钮**: 检查更新 · **作用**: 查询 npm 上 dsh 最新版本，有新版则弹窗让您选择是否更新；更新前自动备份旧版本到 `runtime/dsh-backup-<版本>`，不覆盖、可手动删除 · **何时可用**: 环境已安装且服务未运行
- **按钮**: 检查绿色版更新 · **作用**: 查询本项目 GitHub 最新 Release（本绿色版外围：启动器/插件/文档等）；发现新版 → 下载到 `runtime/update/` 暂存 → 退出启动器 → 自动覆盖安装并重启。**不替换 `config.json`（你的设置）与 `runtime/`（你的数据）**，旧文件自动备份到 `runtime/update/backup/`，详见第六章 · **何时可用**: 服务未运行
- **按钮**: 插件管理 · **作用**: 弹出插件管理窗口：查看已安装插件、搜索插件（npm 注册表 + GitHub 官方 `dsh-plugin` 话题页）、安装 / 移除插件（详见第五章） · **何时可用**: 环境已就绪
- **按钮**: 数据维护区 · **作用**: 主窗口「数据维护」区（需先停止服务）：**会话管理**按钮 → 弹出会话列表，**勾选（可全选/单选）**后可**恢复（取消归档）**或**永久删除**选中的会话，详见第六章 · **何时可用**: 服务停止后
- **按钮**: 刷新状态 · **作用**: 手动重新检测环境与服务状态 · **何时可用**: 任何时候
- **按钮**: 关于（右上角） · **作用**: 弹出「关于」弹窗：作者、版本号、版本日期、本仓库与官方 dsh 仓库链接（可点击打开），并附**绿色整合·本地化特点**说明（所有文件与依赖全部本地化） · **何时可用**: 任何时候
- **按钮**: 最小化按钮 · **作用**: 最小化到任务栏（任务栏图标保留），**托盘图标从启动起常驻**，点任务栏或托盘图标都能恢复窗口 · **何时可用**: 任何时候
- **按钮**: 右上角 X 关闭 · **作用**: 先弹二次确认（避免误关），确认后自动停止 dsh 服务并退出 · **何时可用**: 任何时候
- **按钮**: 防重复启动 · **作用**: 若启动器已在运行（含最小化到任务栏 / 托盘后台运行），再次打开时不会重复启动服务，而是直接把已运行的窗口调到前台 · **何时可用**: 任何时候

> **专属图标**：启动器使用自定义 **绿色小鲸鱼** 图标（`DSH_Launcher.ico`），任务栏 / 系统托盘 /
> exe 文件三处统一，一眼区分这是 DSH 绿色版（不再是 PyInstaller 默认图标）。

> **WebUI 单页面去重**：启动器会向 WebUI 页面注入心跳脚本，页面打开后每 15 秒向本地
> 127.0.0.1:3081 上报一次；**自动打开**（启动服务后自动开页）时若检测到界面已在浏览器
> 中打开（180 秒内有心跳），就**不再打开新页面**，避免多次重启累积一堆相同标签页。
> **手动点「打开界面」不受此限制，必定打开新页面**。
> 可在「设置」里取消勾选 *启动服务后自动打开浏览器*（对应 `config.json` 的
> `auto_open_browser`，端口可用 `ui_beacon_port` 调整）。

### 停止
- 点启动器里的【停止服务】，或双击 **stop.bat**
- 点右上角 **X** 关闭启动器会先弹**二次确认**（避免误关），确认后自动停止服务
- 点**最小化**按钮会缩到**系统托盘**后台运行（任务栏不显示，主窗口隐藏），点托盘图标恢复显示；
  想要彻底退出仍点右上角 X（或托盘图标所在区域右键无菜单时用 X 关闭）

### 无界面模式（可选）
```bat
python launcher.py --start              :: 启动（守护模式：保持本窗口运行，关窗口或 stop.bat 停止）
python launcher.py --stop               :: 停止
python launcher.py --purge-archived     :: 永久删除全部已归档会话（需先停止服务）
python launcher.py --purge-session  :: 永久删除指定会话（需先停止服务）
python launcher.py --restore-session  :: 复原(取消归档)指定会话（需先停止服务）
python launcher.py --install-plugin <本地插件目录或npm包名> :: 安装插件（本地目录直接给路径即可）
```

## 三、配置项（config.json）

### 字段 · 说明 · 默认值
- **字段**: `mirror` · **说明**: 镜像源：`auto` 自动（国内优先回退官方）/ `cn` 国内 / `official` 官方 · **默认值**: `auto`
- **字段**: `node_version` · **说明**: 便携 Node 版本号 · **默认值**: `22.20.0`
- **字段**: `python_version` · **说明**: 内置便携 Python 版本号 · **默认值**: `3.10.20`
- **字段**: `python_release` · **说明**: python-build-standalone 发布标签（日期） · **默认值**: `20260807`
- **字段**: `dsh_port` · **说明**: 服务端口 · **默认值**: `3080`
- **字段**: `dsh_package` · **说明**: dsh 包名 · **默认值**: `@deepseek-ai/dsh`
- **字段**: `tmp_dir` · **说明**: 临时目录（空 = 默认 `runtime/tmp`，绿色整合；可自定义为任意绝对路径） · **默认值**: 空
- **字段**: `default_workspace` · **说明**: 默认工作区（空 = 自动解析：不冲突时用程序根目录，冲突时自动用程序目录内 `workspace` 子目录；可自定义绝对路径，与临时目录冲突会自动回退并警告） · **默认值**: 空
- **字段**: `dsh_host` · **说明**: dsh web 服务绑定地址：`127.0.0.1`=仅本机访问 / `0.0.0.0`=局域网内其它电脑可远程打开 WebUI · **默认值**: `127.0.0.1`
- **字段**: `trusted_hosts` · **说明**: 受信任主机列表（数组，元素为 host 或 host:port）。**不填（默认）= 绑定局域网时自动信任全部局域网 IP；填了任意一个 = 只信任填写的地址，不再自动全局域网放行** · **默认值**: `[]`

也可在启动器界面【设置】里改镜像和端口（网络相关的【网络设置】见下节），点【保存设置】。

### 网络设置（局域网远程访问）
> 想让**其它电脑的浏览器**远程打开本机部署的 dsh WebUI（例如服务端一台电脑、客户端多台电脑），按下面配置。

- 主窗口「网络设置 (局域网远程访问)」区 →「服务绑定」选 **「局域网 (允许局域网访问 0.0.0.0)」** →「保存网络设置」（下次启动服务时生效）。
- 保存后 **点【启动服务】**，就绪日志会额外显示一行 `局域网访问地址: http://<本机IP>:3080`；局域网内其它电脑用浏览器打开该地址即可使用 WebUI（聊天、工具调用正常）。
- 「受信任主机」**不填（默认）= 自动信任全部局域网 IP**（最简单，局域网内所有电脑都能打开）；**填了任意一个 = 只信任填写的地址**（如只允许特定主机 `my-server.local` 或 `192.168.1.10:3080` 访问），多个用英文逗号分隔。
- **安全边界（请知悉）**：选择局域网模式且不填受信任主机 = **整个局域网网段开放**，任何能连到本机局域网 IP 的设备都能打开并操作 WebUI（可用工具执行）；填了受信任主机则只对填写的主机开放。dsh 的**设置 / 凭据（API Key）类特权操作仍仅本机可改**（远程浏览器访问会返回 403），属官方安全保护。本机模式（默认 `127.0.0.1`）则与以往完全一致，仅本机可访问。
- 命令行/配置文件等价设置：`config.json` 的 `dsh_host`（`127.0.0.1` / `0.0.0.0`）与 `trusted_hosts`（数组）。

## 四、绿色整合说明
- **全部本地化**：便携 Node、dsh 包、npm 缓存、pnpm 存储、会话数据、临时文件，全部在 `runtime/` 下，不写用户主目录（`~/.npm`、`~/.pnpm-store` 等都不会产生）
- **不污染系统**：不装全局 npm 包、不改 PATH、不写注册表
- **整目录迁移**：把整个文件夹复制到任意位置 / 另一台电脑，双击 start.bat 即可继续使用（会话记录跟着走）
- **彻底卸载**：直接删除整个文件夹即可
- **默认工作区自动解析**：因为临时目录在程序目录内，dsh 的 ACL 沙箱不允许工作区包含它。启动器启动时**自动检测**：程序根目录与临时目录冲突时，默认工作区自动用程序目录内 `workspace` 子目录并预置进工作区列表；不冲突时直接用程序根目录。无需手动配置（详见 `config.json` 的 `default_workspace`）

### 迁移到新电脑（完整步骤）
1. **旧电脑先停止服务**：双击 `stop.bat`（或启动器里【停止服务】），避免有进程占用文件导致复制不全
2. **复制整个 `DeepSeekHarnessLauncher` 文件夹**（约 528MB）到新电脑，放任意位置均可（程序按自身位置自动定位，不写死路径）
3. **可选清理**（让迁移更干净、体积更小）：
   - 删除 `runtime/server.pid`、`runtime/server.log`（旧状态残留）
   - 清空 `runtime/tmp`（临时文件）
   - 可删除 `runtime/npm-cache`（纯下载缓存，删除不影响使用，仅日后重装 dsh 会重新下载）
4. **新电脑前置**：**无需装任何东西**。直接用 `DSH_Launcher.exe`，或 `start.bat`（内置便携 Python 在 runtime 里）；只有内置 Python 下载失败时才需装系统 Python。**不需要装 Node**（便携版在 runtime 里）
5. **启动**：双击 `DSH_Launcher.exe`（或 `start.bat`）→ 【启动服务】。API Key、设置、插件、会话记录全部已带过来
6. **工作区注意**：dsh 的会话按"工作区绝对路径"记录（见 `runtime/dsh-home/storages/workspace.json`）。若新电脑的工作区路径与旧机**不一致**，需在网页里重新选择/添加工作区（旧会话数据仍在，不会被删除）；路径一致则完全无感

### 轻量分发 zip（精简在线版，约 8MB）
> 相较"整目录迁移"，此 zip **不含 `runtime/`（不带已下载的环境与会话）**，新机联网后由启动器自动下载 Node / Python / dsh，体积小、适合放到 GitHub Release 分发。
>
> 打包内容与 GitHub 仓库（main 分支）**保持一致**：`launcher.py`、`start.bat`、`stop.bat`、`build_exe.bat`、`DSH_Launcher.exe`、`DSH_Launcher.ico`、`config.json`、`README.md`、`README_EN.md`、`LICENSE`、`plugins/`、`skills/dsh-deploy-maintain/`（`DSH_Launcher.exe` 也上传 GitHub 仓库，与 Release 同源；`DEV_NOTES.md` 与 `.gitignore` 是开发侧文件，不进 release）。

- **最新下载**（GitHub Release，tag `v1.0.7`）：<https://github.com/LiuJunheng/DeepSeekHarnessGreen/releases/latest>
- 仓库：<https://github.com/LiuJunheng/DeepSeekHarnessGreen>

新机使用三步：
1. 解压到任意目录（如 `E:\DeepSeekHarnessLauncher`），双击 **start.bat**（或 `DSH_Launcher.exe`）；
2. 点 **【安装环境】**，等待自动下载便携 Node + 安装 dsh + 补齐便携 Python（需联网，几分钟）；
3. 点 **【启动服务】** → 网页里填 API Key、选工作区（建议选程序目录内自动预置的 `workspace`，避开 ACL 临时目录冲突）即可。

重新生成该 zip（在项目根目录 PowerShell 执行）：
```powershell
Compress-Archive -Path launcher.py, start.bat, stop.bat, build_exe.bat, DSH_Launcher.exe, DSH_Launcher.ico, config.json, README.md, README_EN.md, LICENSE, "plugins", "skills" -DestinationPath DSH_Launcher_GreenPortable_Online_<日期>.zip -CompressionLevel Optimal
```
> **重要（zip 目录结构）**：`-Path` 里的插件/skill 必须传**目录名** `"plugins"` / `"skills"`（zip 内保留 `plugins/`、`skills/` 前缀）。**不能**传 `"plugins\dsh-archive-purge"` 这种子路径——`Compress-Arc