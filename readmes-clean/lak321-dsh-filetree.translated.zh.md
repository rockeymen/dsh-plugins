# DSH File Tree — DeepSeek Harness 工程文件浏览器

给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面增加**工程查看 / 打开 / 编辑**能力的插件组合。

DSH 官方界面没有文件浏览器，本插件补齐：在会话视图新增 **"文件" 页签**，显示当前工作区（工程）的完整目录树，点击文件即可查看，并支持 **VSCode 风格**的代码编辑与保存。

## 功能

- 📁 **工程查看**：完整目录树，展开/折叠所有子文件夹，跟随当前工作区（切换工程自动切换）
- 📖 **打开文件**：点击任意文件查看内容
- ✏️ **编辑保存**：直接修改并保存到磁盘
- 🎨 **VSCode 风格编辑器**：
  - C/C++ 语法高亮（关键词/字符串/注释/数字/预处理器，Dark+ 配色）
  - 行号栏（随滚动联动）
  - Tab 键缩进（4 空格）+ 回车自动缩进
  - 状态栏（文件类型 / UTF-8 / 光标行列）
  - 深色主题，透明滚动条

## 组成

**Bundle 形态**（标准 DSH 插件包，包根 = 仓库根）：

### 端 · 位置 · 作用
- **端**: Host（Node half） · **位置**: `host/lib/index.js`（`main` / `exports["."]`） · **作用**: 注册 `POST /api/filetree` HTTP 路由（list/read/write，基于 fs 服务）
- **端**: Client（UI half） · **位置**: `client/lib/client.js`（`exports["./client"]` + `dsh.client.platform`） · **作用**: 会话视图"文件"页签：目录树 + VSCode 风格编辑器

组合层：根 [`cordis.patch.yml`](cordis.patch.yml)（`dsh.bundle.patch` 指向），挂载 host half；client half 由 `exports["./client"]` 自动进 `__DSH_BOOT__`。

## 安装

**一条命令（git 源，产物已入库，无需构建）：**

```sh
dsh plugin --profile web add "github:lak321/dsh-filetree#<commit>&path:/"
```

> `<commit>` 换成最新提交号（见仓库主页）。`path:/` 指向仓库根（本 bundle 包根 = 仓库根）。

或**本地目录**（包目录内执行）：

```sh
cd dsh-filetree && dsh plugin --profile web add .
```

装完**重启 DSH**（`npx -y @deepseek-ai/dsh web`），浏览器打开后会话视图顶部出现 **"文件"** 页签。

> 旧的手动复制 `host/`+`client/` 并注入 `cordis.patch.yml` 的方式已废弃，由 bundle 层栈安装替代（见 `install/cordis.patch.example.yml` 仅为历史参考）。

## 使用

1. 打开 DSH Web 界面，进入任意会话
2. 点顶部 **"文件"** 页签（在 对话 / 轨迹 之后）
3. 左侧为当前工程目录树（顶部显示工程名，来自当前工作区 cwd）
4. 点 ▸ 展开文件夹，点文件在右侧打开
5. 编辑 → **保存**（顶栏按钮，未保存显示 ●）；**关闭** 收起编辑器

## 工作原理

- **Host**：`dsh-filetree` 在 apply 时通过 `ctx.get('webServer').register()` 注册 `/api/filetree` 路由，处理器用 `ctx.get('fs')` 执行目录列举 / 读文件 / 写文件。`fs.resolve()` 支持相对路径（工作区根）和绝对路径（如会话 cwd）。
- **Client**：`dsh-client-ui-filetree` 通过 `ctx.slots.inject("conversation.view")` 注册 `files` 页签（`id: "files", order: 20, label: "文件"`）。组件从 `props.useSession` 读取会话 `cwd` 作为文件树根目录，用浏览器 `fetch` 调 `/api/filetree`。编辑器为纯 JS 实现（textarea 叠加语法高亮层 + 行号），无第三方依赖。

## 开发要点（踩坑记录）

- **single slot shadow 需更低 priority**：若替换 `sidebar.workspaces` 这类 single slot，必须用 `priority: -1`，否则 loader 报 "already has a registration at priority 0"。
- **client 插件必须导出 `exports.inject`**（依赖列表，如 `["slots"]`），否则 `ctx.slots` 不可用。
- **client.js 是 `window.__ModuleLoader__.load({ id, factory })` 格式**，factory 内用 `require("react")`，导出 `exports.apply` / `exports.inject`。

## 插件发布

WhaleHub 插件市场提交规范（标准 bundle 整改 + Issue 表单/PR 流程）见
[`docs/whalehub-submission.md`](docs/whalehub-submission.md)。