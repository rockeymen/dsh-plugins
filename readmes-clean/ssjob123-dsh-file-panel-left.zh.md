# dsh-file-panel-left

**DSH Web 的「纯文件工作台」侧边栏插件** —— 文件资源管理器、编辑器与预览器一体，左树右内容，文件浏览、编辑、引用与对话联动在一个面板里完成。

基于社区插件 `dsh-better-sidebar`（作者 [omdsh-dev](https://github.com/omdsh-dev)，[仓库](https://github.com/omdsh-dev/DSH-better-sidebar)，MIT 许可）精简定制，只保留文件相关能力（文件树 / 编辑器 / 预览 / @引用 / 聊天文件打开），删除了终端、浏览器、Git、任务管理等与文件无关的功能。原名 `dsh_left_bar`，2026 年改名并独立发布。

## 功能特性

**纯文件工作台定位**

- 左树右内容分栏：文件树常驻左侧（搜索 / 刷新），右侧内容区展示打开的文件；未打开文件时显示占位提示
- 已删除终端、浏览器、Git、任务管理、标签栏、下载与插件市场等非文件功能，聚焦文件浏览与编辑

**文件树**

- 懒加载目录（逐层读取），大目录不卡顿
- 软链接支持：识别链接目标类型，失效链接明确标记为「失效的软链接」
- 支持 UNC 网络路径
- 按文件名全局搜索（300ms 防抖，可中止），结果过多时提示截断
- 刷新按钮；树头「+」与文件夹行尾 hover「+」新建文件（内联输入，Enter 创建 / Esc 取消，创建后不自动打开）
- 单击打开文件；树内空白处点选可选中目录（作为新建文件的目标），选中态高亮
- 右键复制相对 / 绝对路径

**CodeMirror 6 编辑器**

- 20+ 种语言语法高亮：JS/TS/JSX、JSON、Python、HTML、CSS、Markdown、XML、YAML、SQL、Java、C/C++、C#、Kotlin、Swift、Rust、Go、PHP、Shell、TOML、INI、nginx、Dockerfile、properties 等（含自定义 INI 高亮）
- Ctrl/Cmd+F 搜索面板、括号配对高亮、代码折叠、自动缩进、活动行高亮、Alt+拖拽列选
- JSON/JSONC 一键格式化（Ctrl/Cmd+Shift+F）
- Ctrl/Cmd+S 手动保存；同时内置每秒轮询的自动保存（有未保存修改才写盘）

**内置 6 种文件查看器**

- 图片 / PDF / Markdown / HTML / 代码（兜底）/ 二进制提示
- Markdown 预览 / 编辑双模式，预览支持 Mermaid 图表渲染
- HTML 预览在沙箱 iframe 中渲染（无法读取界面数据与本地文件），提供「刷新预览」按钮
- 超大文件截断显示（仅展示前 512KB）；不支持的二进制类型给出明确提示

**@引用（自研「添加到对话」+ 官方源并存）**

- 在编辑器选中代码、松开鼠标，弹出「添加到对话」浮窗，向草稿插入 `@相对路径 L12-L25` 纯引用（真实行号、不携带选中文本，省 token；单行选区为 `@路径 L12`，反查失败回退为裸 `@路径`）
- 行号真实可靠：编辑模式直接取 CodeMirror 行号；预览模式经两级反查保证准确，宁可回退为裸引用也不给错行号
- 草稿中以蓝色胶囊展示；hover 胶囊左缘出现 ×，点击即可删除；点击胶囊在侧边栏打开该文件
- DSH 官方 `@` 源（0.1.1-rc.2+，无行号文件胶囊）与自研源同菜单并存；插件绝不触碰官方胶囊（不挂叉号、不拦截）
- 随插件分发 `file-line-reading` skill，指导 AI 按引用行号只读必要内容

**右键菜单**

- 复制相对地址 / 复制绝对地址 / 重命名 / 删除
- 重命名带同名预检与非法字符校验；删除弹窗确认后移入系统回收站（Windows / macOS），会话根目录不可删除

**智能布局**

- 折叠 / 展开按钮：任何展开动作（按钮、聊天打开文件、打开文件）都恢复为视口 65% 的可读宽度
- 内容区「关闭」按钮（X）：收起展示页并把面板宽度收窄到只剩目录树，再次点选文件即恢复 65% 宽度
- 面板宽度与树列宽度均可拖拽（树列 240–480px，默认 280px），会话内持久化

**聊天联动**

- 聊天中的文件链接（工具行、官方「本次产出」行、文件提及）一律在侧边栏打开，不再调用系统默认应用
- 「本次产出」行由 DSH 官方 `ui-deliverables` 原生渲染（0.1.1-rc.2+）；本插件拦截其打开动作，使产物文件与内联码提及都开进侧边栏——这是插件保留的核心差异化

**扩展与本地化**

- 通过 `ctx.betterSidebar` 服务，外部插件可注册侧边栏标签页与文件查看器
- 界面文案中英双语，跟随 DSH 语言设置实时切换
- 会话隔离：每个会话独立的工作目录与面板状态；布局偏好持久化

**平台适配**

- Windows 标题栏兼容模式（为无边框窗口右上角的原生标题栏预留空间）
- 无 settings 服务的部署自动降级：偏好设置写入 `~/.dsh/dsh-file-panel-left-prefs.json`

## 安装

> 环境要求：Node.js ≥ 20、DSH Web（含 `dsh` 命令行）。peer 依赖（React 18、Cordis 与 `@deepseek-ai/dsh-*` 系列）由 DSH 运行时提供，无需手动安装。

### 正式发布版（npm）

```bash
dsh plugin --profile web add dsh-file-panel-left
```

- 一条命令完成安装与挂载：包内声明的 bundle patch（`cordis.patch.yml`）会让 CLI 自动把插件加入 profile 的 bundle 栈，无需手改任何配置文件
- 安装完成后重启 DSH 并硬刷新浏览器（Ctrl+Shift+R / Cmd+Shift+R）即可看到侧边栏
- 指定版本：`dsh plugin --profile web add dsh-file-panel-left@<version>`
- 卸载：`dsh plugin --profile web remove dsh-file-panel-left`
- 若 profile 里之前手动挂载过本插件（`cordis.patch.yml` 中的挂载行），改用 CLI 安装前请先移除旧行，避免双挂载（出现两个侧边栏）

### 本地开发安装（file: 依赖）

在 profile 目录（如 `~/.dsh/profiles/web`）的 `package.json` 中添加本地依赖：

```json
"dependencies": {
  "dsh-file-panel-left": "file:<本地路径>/dsh-file-panel-left"
}
```

在 profile 的 `cordis.patch.yml` 中手动挂载（与 CLI 自动挂载二选一，不要重复）：

```yaml
- insert:
    - id: dsh-file-panel-left
      name: 'dsh-file-panel-left'
```

然后安装：

```bash
cd ~/.dsh/profiles/web
pnpm install
```

注意：pnpm 的 `file:` 依赖是**拷贝**而非软链。每次修改插件源码后，需要删除 profile 中 `node_modules/dsh-file-panel-left` 的旧拷贝再重新安装，否则加载的仍是旧版本：

```powershell
Remove-Item -LiteralPath "$env:USERPROFILE\.dsh\profiles\web\node_modules\dsh-file-panel-left" -Recurse -Force
cd $env:USERPROFILE\.dsh\profiles\web; pnpm install
```

## 使用说明

- **文件树**：单击文件打开；树头或文件夹行尾的「+」新建文件（Enter 创建 / Esc 取消）；顶部搜索框按文件名过滤；右键行可复制路径 / 重命名 / 删除
- **编辑器**：打开代码或配置文件即进入 CodeMirror 编辑器；`Ctrl/Cmd+S` 保存，修改后每秒自动保存；`Ctrl/Cmd+F` 搜索；代码 / 配置文件带折叠、括号配对、列选等 IDE 能力；JSON 文件有格式化按钮（`Ctrl/Cmd+Shift+F`）
- **预览**：Markdown 文件可在「预览 / 编辑」间切换，预览渲染 Mermaid 图；HTML 文件默认在沙箱 iframe 中渲染，工具条可刷新；图片 / PDF 直接预览；不支持的二进制类型显示提示
- **右键菜单**：复制相对地址、复制绝对地址、重命名（重名会提示）、删除（确认后移入系统回收站）
- **@引用**：在编辑器选中代码、松开鼠标 → 点击浮窗「添加到对话」，草稿插入蓝色 `@相对路径 L12-L25` 胶囊（hover 左缘 × 删除）；官方 `@` 源（无行号）也在同一菜单可用

## 配置

插件**没有设置页面**，行为全部为内置默认值，刻意保持简单：

- 展开面板 = 视口宽度的 65%（可拖拽微调，会话内记住）
- 自动保存：每 1 秒轮询，有未保存修改才写盘，不可关闭
- 聊天文件打开拦截：恒开启（工具行 / 本次产出 / 文件提及都会在侧边栏打开），不提供开关
- 删除：确认后移入系统回收站（Windows 10/11 与 macOS）
- HTML 预览：默认启用沙箱（不读取界面数据与本地文件）
- 偏好设置（标题栏兼容等）通过 settings 服务持久化；无 settings 服务的部署自动降级为本地文件

## 平台支持

### 平台 · 支持情况
- **平台**: Windows 10 / 11 · **支持情况**: 完整支持：删除移入系统回收站（基于 PowerShell 的 Microsoft.VisualBasic.FileIO，零额外依赖）；标题栏兼容模式可用
- **平台**: macOS · **支持情况**: 完整支持：删除移入废纸篓（基于 osascript 调用 Finder，零额外依赖）；标题栏兼容模式不适用
- **平台**: Linux · **支持情况**: 浏览 / 编辑 / 预览等全部文件功能可用（@引用由 DSH 官方提供）；**删除为永久删除**（Linux 无系统回收站，删除前需二次确认，删除后无法恢复）

## 已知限制

- 文件按扩展名 + 首部 NUL 字节探测分类：**UTF-16 / UTF-32 编码的文本会被判定为二进制**（首部含 `0x00` 字节），显示二进制提示而非编辑器——如需查看请转存为 UTF-8。按编码探测需要先读完整文件，得不偿失。

## 开发

```bash
pnpm install
pnpm build        # tsc 类型检查产物 + tsdown 打包，输出 lib/
pnpm typecheck    # 仅类型检查（tsc --noEmit）
```

迭代流程：`pnpm build` → 强制同步到 profile（见「本地开发安装」）→ host 端改动重启 DSH、client 端改动硬刷新浏览器 → 浏览器中验证。

## 技术栈与架构

- **Host（Node）**：Cordis 插件，提供文件树 / 读取 / 写入 / 搜索 / 回收站删除 / 重命名等 API 路由；偏好持久化（settings 服务或本地文件降级）
- **Client（浏览器）**：React 18 + CSS Modules；文件树、左树右内容分栏、查看器注册表
- **编辑器**：CodeMirror 6，语言包与扩展按需加载
- **按需分块**：Mermaid、编辑器等重模块以懒加载 chunk 提供，首次打开对应文件时才加载
- **服务化基座**：`ctx.betterSidebar` 服务供外部插件注册标签页与文件查看器
- **i18n**：接入 DSH 语言服务，中英双语、实时切换
- **会话隔离**：每个会话独立工作目录与面板状态，偏好持久化到 localStorage（键 `dsh_left_bar:v1`）

## 许可

[MIT](./LICENSE)

## 致谢

本项目由社区插件 **dsh-better-sidebar**（作者 [omdsh-dev](https://github.com/omdsh-dev)，[DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)，MIT 许可）精简定制而来（原项目名 `dsh_left_bar`，2026 年更名），感谢上游的设计与实现；上游版权声明保留于 [LICENSE](./LICENSE)。