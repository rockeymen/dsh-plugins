![赋范空间 Logo](apps/web/public/dsh-desktop/beyondata-logo.png)

# DeepSeek Harness Studio

赋范空间出品 · 为 DeepSeek Harness 生态打造的现代化桌面开发体验

从公开生态搜索、校验、一键安装与移除 DSH 插件 · 让 DeepSeek 看懂图片

DeepSeek Harness Studio 把本地 Web 工作区、Host 运行管理和桌面窗口整合为开箱即用的开发环境，让开发者可以获取源码、直接修改并在本地继续构建。

[下载 macOS arm64 开发预览版](https://github.com/fufankeji/deepseek-harness-studio/releases) · [下载 Windows x64 开发预览版](https://github.com/fufankeji/deepseek-harness-studio/releases/download/desktop-preview-v0.1.0-rc.5/DeepSeek-Harness-Desktop-Windows-x64-0.1.0-rc.5-Setup.exe)

  ![DeepSeek Harness Studio 大肥鱼拟人默认皮肤](assets/theme-whale-maid-ui.png)

## 先看功能：当前能力与近期路线图

> 状态说明：✅ 已支持；🗓️ 规划中。桌面开发工作区、公开插件中心和中文 DeepSeek 控制已经可用；规划能力会在真实功能可运行后更新状态。

### 能力 · 状态 · 可以做什么
- **能力**: **公开插件中心** · **状态**: ✅ · **可以做什么**: 从 npm 公共生态实时发现带 `dsh-plugin` 标签的插件与 Bundle 封装 Skill Pack，查看详情与风险，一键在线安装，并管理启用、停用和卸载。
- **能力**: **桌面开发工作区** · **状态**: ✅ · **可以做什么**: 在本地打开项目、管理会话与工作区，调用 Harness 的模型、工具、Skills 和插件能力，并直接修改完整源码。
- **能力**: **视觉增强** · **状态**: ✅ · **可以做什么**: 为 DeepSeek 文本工作流补齐图像理解：读取对话附件和工作区图片，再把可追溯的识别结果交给 Agent。
- **能力**: **中文 DeepSeek 控制** · **状态**: ✅ · **可以做什么**: 使用中文权限选项和适配 DeepSeek 的思考模式，在输入区直接完成会话级选择。
- **能力**: **内置皮肤与自由换肤** · **状态**: ✅ · **可以做什么**: 默认使用“大肥鱼拟人”皮肤，可切换“官方原版”或“云端猫咪”，也可选择本地图片并自动适配界面配色。
- **能力**: **独立 MCP、Skills 与工具管理** · **状态**: 🗓️ · **可以做什么**: 后续提供不依赖 Bundle 包装的 MCP Server、Skills 与工具发现和连接管理，按项目自由组合 Agent 能力。
- **能力**: **Agent 预设与多 Agent 协作** · **状态**: 🗓️ · **可以做什么**: 自定义 Agent 与子 Agent，把编码、测试、调研和审查任务交给不同角色协同完成。
- **能力**: **任务规划、后台运行与会话恢复** · **状态**: 🗓️ · **可以做什么**: 管理计划和待办，让长任务在后台继续运行，并随时查看进度或接续历史会话。
- **能力**: **项目规则、Hooks 与长期记忆** · **状态**: 🗓️ · **可以做什么**: 集中管理项目指令、自动化 Hooks 和可持续复用的上下文，让 Agent 按仓库规则稳定工作。
- **能力**: **Git、Worktree 与代码审查** · **状态**: 🗓️ · **可以做什么**: 在隔离工作区并行开发，查看 Diff、提交和审查结果，减少多人或多任务互相干扰。
- **能力**: **浏览器与桌面自动化** · **状态**: 🗓️ · **可以做什么**: 让 Agent 操作网页和本地应用，并通过真实交互结果验证任务是否完成。
- **能力**: **手机远程与消息通道** · **状态**: 🗓️ · **可以做什么**: 从移动端查看和接续任务，并通过常用消息渠道接收通知或触发 Agent。

## 项目简介

DeepSeek Harness Studio 使用 Electron 承载 DeepSeek Harness 的 Web 工作区，并由桌面主进程启动和管理本地 `dsh web` 服务。这个仓库提供完整源码开发环境，使用者可以从 GitHub 克隆或下载代码，在本地安装依赖、编辑源码、启动桌面应用并继续开发。

桌面安装包只通过本仓库的 GitHub Releases 发布，不使用第三方下载站。目前已经提供经过真实 Electron 验收的 macOS arm64 预览 ZIP 和 Windows x64 预览安装程序；需要继续开发时，仍可获取完整源码并在本地启动。

## 核心功能

- **Electron 桌面端**：提供应用窗口、系统托盘、单实例运行、外部链接处理和安全的 preload 通信接口。
- **本地 Harness Host**：桌面主进程启动 `dsh web`，等待本地服务就绪，并在应用退出时关闭 Host 进程。
- **Web 工作区**：保留 DeepSeek Harness 的会话、工作区、模型、工具、Skills 和插件运行能力。
- **公开插件中心**：在线搜索 npm 公共 `dsh-plugin` 生态，在安装前校验确定版本、产物完整性、Bundle 声明和本机兼容性，并在已安装区域管理启用、停用与卸载。
- **对话区视觉增强**：一键启用百炼 Qwen3.8 图像理解，支持截图、照片、图表、OCR 和工作区图片，不替换当前 DeepSeek 主模型。
- **桌面外观设置**：内置“官方原版”“大肥鱼拟人”和“云端猫咪”三套外观，也支持本地背景图片、主体焦点和界面玻璃层调节。
- **完整开发源码**：仓库同时包含桌面应用、Web 界面、CLI、功能包、原生辅助模块、Python SDK、示例和构建脚本。

## 内置皮肤与自由换肤

进入 **设置 → 背景** 即可切换内置皮肤；选择自定义图片时，应用会在本机完成 1920×1080 WebP 裁切与界面配色，不上传原图。


    ![大肥鱼拟人默认皮肤](assets/theme-whale-maid-ui.png)
    ![云端猫咪皮肤](assets/theme-cloud-cat-ui.png)


    大肥鱼拟人 · 默认蓝白鲸灵助手与明亮宫殿，中央留白适配对话区。
    云端猫咪保留原有柔和蓝白猫咪主题，清爽、安静、低干扰。


## 公开插件中心：在线发现、安装与移除

  ![DeepSeek Harness Studio 公开插件中心真实界面](assets/plugin-center-avatars-desktop.png)
  <sub>真实 Desktop 界面：插件头像、公开目录、已安装区域、“安装”按钮与三点管理入口。</sub>

从左侧进入 **插件中心**，即可搜索 npm 公共 Registry 中带 `dsh-plugin` 标签、并符合 DeepSeek Harness Bundle 规范的插件与 Skill Pack。

- **在线发现**：搜索公开插件，查看版本、能力、权限、兼容性和风险说明。
- **一键安装**：下载确定版本并校验包身份、完整性和 Bundle 声明；确认后自动安装并重启 Harness Host 验证运行状态。
- **已安装管理**：集中查看系统、公开目录和本地来源，通过三点菜单启用、停用、更新或卸载插件。
- **安全移除**：卸载默认保留配置与插件数据；需要清理数据时，再由用户单独确认。

## 中文权限与 DeepSeek 模型控制

- **权限选择**：输入区使用 `只读`、`工作区写入` 和 `完全访问` 三档中文权限，作用于当前会话；通用设置只决定后续新会话的默认权限，启用完全访问前必须确认风险。
- **模型与思考模式**：模型和 API Key 仍在设置页统一管理；输入区可查看当前 DeepSeek 模型，并选择 `关闭思考`、`深度思考` 或 `最大思考`，不显示 DeepSeek 不支持的速度档位。

## 视觉增强：让 DeepSeek 看懂图片

当前桌面端使用的 DeepSeek 文本模型无法直接理解图片。开启视觉增强后，内置的百炼 `qwen3.8-max` 会先读取对话中的图片附件或工作区内的 PNG、JPEG、WebP、GIF 文件，再把识别结果作为可追溯的视觉观察提供给 Agent，原有 DeepSeek 模型、权限和会话流程保持不变。

- **随手可用**：输入框左侧提供“视觉增强”快捷开关，悬浮即可查看用途和当前状态。
- **真实验证后开启**：首次启用需要使用一张真实图片验证百炼 API Key；凭证只保存在本机受保护的凭证文件中。
- **覆盖开发场景**：可理解产品截图、报错界面、设计稿、数据图表、照片和图片文字，也可以按路径读取当前工作区图片。

## 下载桌面端

> GitHub Releases 已提供经过真实 Electron 验收的 macOS Apple Silicon 预览 ZIP 和 Windows x64 预览安装程序，运行桌面端无需另行安装 Node.js 或 pnpm。当前均为开发预览资产；正式版本仍将提供完成平台签名的 macOS `.dmg` 和 Windows x64 `.exe`。

[下载 macOS arm64 预览版](https://github.com/fufankeji/deepseek-harness-studio/releases) · [下载 Windows x64 安装程序](https://github.com/fufankeji/deepseek-harness-studio/releases/download/desktop-preview-v0.1.0-rc.5/DeepSeek-Harness-Desktop-Windows-x64-0.1.0-rc.5-Setup.exe)

### macOS arm64

下载并解压预览 ZIP 后，建议先把 `DeepSeek Harness.app` 拖入“应用程序”目录。由于当前预览包尚未经过 Apple 公证，首次打开前需要在“终端”执行：

```sh
xattr -dr com.apple.quarantine "/Applications/DeepSeek Harness.app"
open "/Applications/DeepSeek Harness.app"
```

如果应用没有放在“应用程序”目录，请把命令中的路径替换为实际路径。该命令只应用于从本仓库 GitHub Releases 下载并核验过 SHA-256 的预览包；不要用于来源不明的应用。首次成功打开后，可以像普通应用一样从 Finder 或程序坞启动。

### Windows x64

下载 `DeepSeek-Harness-Desktop-Windows-x64-0.1.0-rc.5-Setup.exe` 后直接运行安装程序。对应的 `SHA256SUMS-windows-x64-preview.txt` 和 `WINDOWS_PREVIEW_VERIFICATION.txt` 位于同一 Release，可用于核对安装包完整性和平台验收结果。

开发预览版使用独立 Pre-release 标签并附带 SHA-256 校验文件，不触发正式安装器发布。正式流程只接受与 Desktop 版本完全一致的 `desktop-v*` 标签；macOS 与 Windows 安装包分别完成平台签名验证后，GitHub 才会同时公开安装文件和 `SHA256SUMS`。

## 快速开始

### 获取源码

使用 Git 克隆仓库：

```sh
git clone https://github.com/fufankeji/deepseek-harness-studio.git
cd deepseek-harness-studio
```

也可以在 GitHub 仓库页面选择 **Code → Download ZIP**，下载并解压源码后进入项目目录。

### 环境要求

- Node.js `^22.19.0 || >=24.0.0`
- pnpm `11.7.0`

### 外部服务准备

下载源码、安装依赖和启动桌面开发环境不需要预先填写 API 密钥。需要在应用中实际调用模型时，再在设置中配置所选模型服务与凭证；凭证不要提交到 Git。

### 安装与启动

安装工作区依赖：

```sh
pnpm install
```

构建所需模块并启动桌面开发环境：

```sh
pnpm run dev:desktop
```

开发启动器会在相关源码或构建输入变化时重新构建；需要强制完整重建时运行：

```sh
pnpm run dev:desktop:rebuild
```

## 常用开发命令

### 命令 · 用途
- **命令**: `pnpm run dev:desktop` · **用途**: 构建必要模块并启动 Electron 桌面应用
- **命令**: `pnpm run dev:desktop:rebuild` · **用途**: 强制完整重建后启动桌面应用
- **命令**: `pnpm run build` · **用途**: 构建 Host、客户端、Web 与桌面端
- **命令**: `pnpm run package:desktop` · **用途**: 为当前平台生成未封装桌面应用
- **命令**: `pnpm run typecheck` · **用途**: 运行 TypeScript 类型检查
- **命令**: `pnpm run test` · **用途**: 运行 Vitest 单元测试

## 建议阅读顺序

1. `apps/desktop/src/main.ts`：桌面应用入口、窗口、托盘和本地 Host 组合。
2. `apps/desktop/src/host-supervisor.ts`：`dsh web` 的启动、就绪检测与退出管理。
3. `apps/desktop/src/preload.ts`：Renderer 可访问的固定桌面接口。
4. `apps/web/`：桌面窗口加载的 Web 工作区。
5. `apps/cli/` 与 `packages/`：CLI 组合以及各项 Harness 能力实现。

## 与 DeepSeek Harness 的关系

本项目基于 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的 Harness 核心、Cordis 插件体系和 Web 界面继续进行桌面端开发。本仓库维护 Electron 桌面入口、本地 Host 管理、桌面交互与配套开发脚本。

## 许可证

本项目使用 [MIT License](LICENSE)。第三方组件的许可证信息见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。