# Basic Right Sidebar（基础右侧边栏）

面向 **DeepSeek Harness** 的右侧边栏插件：功能区/会话管理双栏导航与面板切换、顶栏工作区/会话面包屑、会话概览与日志下载、原生轨迹视图，以及可配置的顶栏整理。

## 设计理念

Basic Right Sidebar 旨在**仅对 DSH 做 UI 增强**：不引入任何新能力，而是把 DSH 的原生能力搬进右侧边栏展示；定位为**所有功能增强右侧边栏的基础插件**。

对照原生 UI 与其它右侧边栏实现，本插件制作了两个面包屑：

- **会话顶栏 · 工作区/会话面包屑** —— 原生左侧边栏收起时，仍可方便地切换会话与工作空间。
- **侧栏顶栏 · 功能区/概览面包屑** —— 方便切换右侧边栏的多种界面。

导航结构（一级分类，各自拥有二级界面）：

### 一级分类 · 二级界面
- **一级分类**: 会话管理 · **二级界面**: 概览
- **一级分类**: 功能区 · **二级界面**: 概览 · 轨迹

## 截图
会话界面右侧边栏 UI 展示：

**功能区/概览（非全屏）**

![功能区/概览](docs/screenshots/image.png)

**功能区/轨迹（非全屏）**

![功能区/轨迹](docs/screenshots/image-1.png)

**会话管理/概览（非全屏）**

![会话管理/概览](docs/screenshots/image-2.png)

**功能区/轨迹（全屏）**

![功能区/轨迹（全屏）](docs/screenshots/image-3.png)

**右侧边栏收起**

![右侧边栏收起](docs/screenshots/image-4.png)

**插件配置 UI**

![插件配置 UI](docs/screenshots/image-5.png)

![插件配置 UI（续）](docs/screenshots/image-6.png)

## 功能特性

- **两级导航** —— 功能区 / 会话管理菜单切换面板（概览 · 轨迹 / 概览）。
- **工作区/会话面包屑** —— 直接在会话顶栏切换工作区与会话。
- **会话概览** —— 会话信息、日志统计（时间跨度/事件计数/大小）与日志下载（zip）。
- **原生轨迹视图** —— 与 DSH 原生轨迹界面完全一致，无需改动任何系统源码。
- **侧栏控制** —— 顶栏展开/收起与全屏。
- **可配置顶栏整理** —— 逐项隐藏顶栏重复元素：会话日志、会话模式、子代理、后台任务、对话/轨迹 Tab 栏。
- **默认展开** —— 启动后自动展开侧栏；手动收起永远不会被打断。
- **内置基础库** —— 图标库（原生优先）与可复用组件库随插件自带，便于二次开发。

## 安装

`basrs-sidebar` 是一个**组合包（bundle）**——以 npm 包形式分发的配置层（见[官方插件文档](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)）。用 `dsh plugin` 命令安装进 profile：它会自动链接包并追加到 `dsh.profile.bundles`：

```sh
# 从 npm 注册表
dsh plugin --profile web add basrs-sidebar

# 或本地目录 / 打包好的 tarball
dsh plugin --profile web add ./basrs-sidebar
dsh plugin --profile web add ./basrs-sidebar-1.0.0.tgz

# 或直接从 git（纯 JS 包无需构建步骤，无需构建授权）
dsh plugin --profile web add github:xinspark/basrs-sidebar#<sha>
```

然后启动 Web UI：`dsh web`（或 `dsh --profile web`）。首次 `add` 会自动用 `@deepseek-ai/dsh-base` 初始化 profile。

卸载：`dsh plugin --profile web remove basrs-sidebar`（同时移除依赖与组合层）。

插件的 bundle 补丁（`cordis.patch.yml`）会自动注册 host 与 client 两半。客户端按请求加载：客户端改动刷新页面即可，host 改动需要重启。

## 配置

打开 **设置 → 插件 → Basic Right Sidebar**：

### 选项 · 说明
- **选项**: 默认展开右侧边栏 · **说明**: 启动后自动展开侧栏；手动收起不会被重新打断。
- **选项**: 隐藏会话顶栏重复部分 · **说明**: 总开关；开启后可按下方列表逐项勾选隐藏：**会话日志 · 会话模式 · 子代理 · 后台任务 · 对话/轨迹 Tab 栏**。
- **选项**: 启用会话顶栏工作区/会话面包屑 · **说明**: 在会话顶栏左侧显示面包屑；关闭后恢复原生顶栏。

设置持久化到 `$DSH_HOME/plugins/basrs-sidebar/settings.json`。插件自带持久化端点（`/bsrs-settings`）：DSH 官方设置线只暴露白名单内的命名空间，第三方命名空间无法使用。

## 二次开发

- **`index.js`** —— host 半：会话日志统计、任务快照、设置持久化（`GET/POST /bsrs-settings`）。
- **`lib/client.js`** —— 浏览器半（UMD，注册进 DSH `clientModules`）。结构自上而下：
  1. 内嵌的 DSH 官方轨迹视图（懒加载，一般不用碰）。
  2. **图标库**（`createIconLibrary`）—— 原生图标优先；新增图标按库头部规则注册。
  3. **组件库**（`createComponentLibrary`）—— `SectionCard`、下拉菜单、`Tag`、`StateDot`、`TodoList`/`TodoGlyph`/`ProgressGlyph`、任务状态归一化、时间格式化、共享样式。
  4. `apply(ctx)` —— 注册插槽：`details`（侧栏）、`conversation.session.header.actions`（面包屑）、`conversation.session.header.utilities`（侧栏开关）、`settings.plugin.item`（配置卡片）；内置 zh/en 双语字典，跟随 DSH 语言切换。

扩展速查：

- **新增面板** —— 在 `apply` 的 `panels` 列表加一项，并写对应渲染组件。
- **新增文案** —— 在 `BSR_ZH` / `BSR_EN` 字典加 key。
- **新增图标** —— 在图标库注册（原生优先，无原生对应时用自定义）。

## 许可证

[MIT](LICENSE)