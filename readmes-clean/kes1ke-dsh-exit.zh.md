# dsh-exit

**为 DeepSeek Harness Web 界面提供一个明确、可确认的退出控制。**

**简体中文** | [English](https://github.com/KeS1Ke/dsh-exit/blob/main/README.md)

> [!IMPORTANT]
> 确认退出后会结束 dsh 宿主进程并释放其占用的端口；宿主终端窗口和当前浏览器标签页会被刻意保留。

## ✨ 功能概览

`dsh-exit` 在 dsh 设置面板中增加一个独立的**退出**栏目，并使用最高排序值，确保新安装的设置类插件仍排在它前面。

- 先弹出确认弹窗，确认前不会执行退出动作。
- **退出**栏目始终位于设置左侧导航的最底部。
- 确认后调用类型化的 `dshExit/exit` Remote 方法。
- 先返回调用应答，再等待短暂窗口结束宿主进程。
- 释放该进程占用的全部端口；设置页会显示当前 dsh Web 的真实主机和端口。
- 保留宿主终端窗口和浏览器标签页，方便后续操作。
- 使用 dsh 现有设计令牌与 Lucide `power` 电源图标。

## 🎬 GitHub 展示区

下面展示退出流程，以及插件在 dsh 设置面板中的实际效果。

  ![由 Archify 生成的横版 dsh-exit 动态流程图](https://raw.githubusercontent.com/KeS1Ke/dsh-exit/main/docs/dsh-exit-landscape.webp)

  <video controls muted loop playsinline width="720" poster="https://raw.githubusercontent.com/KeS1Ke/dsh-exit/main/docs/dsh-exit-landscape.webp">
    
    
  </video>

## 📸 真实 dsh 界面

下图是已经安装 `dsh-exit` 的真实 dsh 设置界面；红色的**退出**就是设置左侧列表底部的插件导航项。

  ![运行中的 dsh Web 设置界面与底部的 dsh-exit 退出栏目](https://raw.githubusercontent.com/KeS1Ke/dsh-exit/main/docs/dsh-exit-real.png)

## 🧱 npm 包内容

### 层次 · 文件 · 职责
- **层次**: 宿主侧 · **文件**: [`lib/index.js`](lib/index.js) · **职责**: 注册 `dshExit` Cordis 服务和类型化 `exit()` Remote 方法。
- **层次**: 客户端 · **文件**: [`lib/client.js`](lib/client.js) · **职责**: 自包含浏览器 bundle：设置栏目、退出按钮、样式、弹窗、键盘交互和 Remote 挂载。
- **层次**: Bundle 补丁 · **文件**: [`cordis.patch.yml`](cordis.patch.yml) · **职责**: 向 dsh profile 插入插件行。
- **层次**: 包元数据 · **文件**: [`package.json`](package.json) · **职责**: 声明宿主入口、Web 客户端和 Bundle 补丁。

npm 包聚焦于运行所需的源码和包元数据，下面同时提供截图和流程源文件：

### 展示素材 · 位置
- **展示素材**: 动画 WebP · **位置**: [`docs/dsh-exit-landscape.webp`](https://github.com/KeS1Ke/dsh-exit/blob/main/docs/dsh-exit-landscape.webp)
- **展示素材**: MP4 / WebM 视频 · **位置**: [`docs/dsh-exit-landscape.mp4`](https://github.com/KeS1Ke/dsh-exit/blob/main/docs/dsh-exit-landscape.mp4) · [`docs/dsh-exit-landscape.webm`](https://github.com/KeS1Ke/dsh-exit/blob/main/docs/dsh-exit-landscape.webm)
- **展示素材**: Archify 源文件 · **位置**: [`docs/exit-flow-landscape.html`](https://github.com/KeS1Ke/dsh-exit/blob/main/docs/exit-flow-landscape.html) · [`docs/exit-flow-landscape.workflow.json`](https://github.com/KeS1Ke/dsh-exit/blob/main/docs/exit-flow-landscape.workflow.json)
- **展示素材**: 真实界面截图 · **位置**: [`docs/dsh-exit-real.png`](https://github.com/KeS1Ke/dsh-exit/blob/main/docs/dsh-exit-real.png)

## 🚀 从 npm 安装

直接将 npm 包加入 dsh 的 Web profile：

```sh
dsh plugin --profile web add @kesike/dsh-exit
```

安装后重启 profile。裸导入由 dsh 宿主加载器解析，因此本包不声明运行时依赖。更新或移除：

```sh
dsh plugin --profile web update @kesike/dsh-exit
dsh plugin --profile web remove @kesike/dsh-exit
```

## 🖥️ 交互说明

### 操作 · 结果
- **操作**: 点击设置左侧列表底部的红色**退出**栏目 · **结果**: 打开退出栏目和确认操作。
- **操作**: 点击**取消**、按 `Esc` 或点击弹窗外部 · **结果**: 关闭弹窗，不改变宿主状态。
- **操作**: 点击**确认退出** · **结果**: 禁用重复操作并调用宿主 Remote 方法。
- **操作**: Remote 调用失败 · **结果**: 恢复控件并显示行内错误信息。
- **操作**: Remote 调用成功 · **结果**: 关闭弹窗，宿主随后退出。

## 🔌 Remote 接口

宿主侧公开一个严格校验、无参数的 Remote 方法：

```text
namespace: dshExit
method:    exit
result:    true
gateway:   /api/dshExit/exit
```

dsh 客户端网关成功时返回标准 envelope：`{ ok: true, value: true }`。服务端通过 `exiting` 标志防止重复调用，并在应答有机会完成后延迟执行 `process.exit(0)`。

## 🧪 开发检查

在项目根目录执行轻量语法检查：

```sh
node --check lib/index.js
node --check lib/client.js
```

## 🗺️ 快速信息

- **目标：** DeepSeek Harness Web profile
- **安装方式：** npm 包
- **界面位置：** 设置左侧导航的最后一栏
- **执行动作：** 结束 dsh 宿主进程
- **运行端口：** 从设置页当前 dsh Web 地址动态读取
- **仓库主题：** `dsh` · `deepseek-harness` · `dsh-plugin` · `plugin` · `javascript` · `web`

电源图标来自 [Lucide](https://lucide.dev/icons/power)，遵循其 ISC 许可使用。

<sub>界面小而专注，退出动作明确且可预期。</sub>