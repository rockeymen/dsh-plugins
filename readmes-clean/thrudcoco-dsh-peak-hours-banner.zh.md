# dsh-peak-hours-banner

  ![预览图：红色高峰横幅与绿色空闲横幅](docs/preview.png)

**DeepSeek Harness（DSH）Web GUI 时段状态横幅插件**

工作时段盯紧余额，空闲时刻记得休息。

[English](README.md) | 简体中文

[功能](#-插件说明与用途) · [显示规则](#%EF%B8%8F-文本显示规则) · [下载安装](#-下载与安装) · [问题反馈](https://github.com/thrudcoco/dsh-peak-hours-banner/issues)

## 📖 插件说明与用途

**dsh-peak-hours-banner** 在 DSH Web GUI 的聊天区顶部常驻一条时段状态横幅：
以你计算机的时钟为准、按北京时间划分 “高峰 / 空闲” 时段，实时提醒你注意
API 余额消耗或适当休息。

- 💰 **成本意识** —— 工作日高峰时段明确提示 “请注意余额消耗” ；
- 🍵 **健康提醒** —— 空闲时段提示 “请注意休息，劳逸结合” ；
- 🌏 **跨时区友好** —— 判定与显示自动换算为使用者所在时区的时间；
- 🔒 **零打扰** —— 纯前端实现，不读取、不上传任何会话内容；
- 🔁 **持久挂载** —— 随 web profile 安装，重启宿主后依然生效，无需每次重装。

横幅右上角提供悬浮控制： “–” 最小化为红/绿状态圆点（点击圆点展开），
 “×” 关闭横幅（刷新页面恢复）。

## 🖥️ 文本显示规则

### 场景 · 横幅显示
- **场景**: 工作日 · 北京时间 09:00–12:00 · **横幅显示**: 🔴 现在是高峰时段（09:00–12:00），请注意余额消耗。
- **场景**: 工作日 · 北京时间 14:00–18:00 · **横幅显示**: 🔴 现在是高峰时段（14:00–18:00），请注意余额消耗。
- **场景**: 工作日其它时间 · **横幅显示**: 🟢 现在是空闲时段，请注意休息，劳逸结合。
- **场景**: 周六 / 周日全天 · **横幅显示**: 🟢 现在是空闲时段，请注意休息，劳逸结合。

规则细节：

- 边界**左闭右开**：9:00、14:00 整起算高峰；12:00、18:00 整起算空闲。
- “周末” 以**北京时间的星期**为准；节假日暂按当日星期处理。
- 文案中的时间范围显示为你本地时区的对应时间（如 UTC-5 用户看到 20:00–23:00）。
- 中英双语跟随 DSH 语言设置，切换即时生效。
- 跨过边界后 **≤15 秒内自动切换**文案与颜色，无需刷新页面。

## 📦 下载与安装

**前提**：已安装 [DeepSeek Harness](https://github.com/deepseek-harness/deepseek-harness)
并至少启动过一次 Web GUI（以便创建 web profile）。

### 方式一：dsh 一键安装（npm 源，推荐）

```bash
dsh plugin --profile web add @thrudcoco/dsh-peak-hours-banner
```

一条命令完成：从 npm 注册表拉取已发布的组合包并注册进 web profile。
包内自带预构建产物，无需本地编译、无需额外构建授权。

> 直接从 GitHub 安装（`dsh plugin --profile web add
> github:thrudcoco/dsh-peak-hours-banner`）理论上也可行，但部分 pnpm 版本会
> 以仓库名注册 git 依赖的键名，导致插件行解析失败——推荐优先使用 npm 或
> `link:` 方式。

也可以从本地 checkout 安装（适合开发者，重建 `lib/` 后下次重启即生效）：

```bash
git clone https://github.com/thrudcoco/dsh-peak-hours-banner.git
dsh plugin --profile web add link:dsh-peak-hours-banner/packages/dsh-peak-hours-banner
```

### 方式二：PowerShell 一键脚本

前提：已安装 [Node.js](https://nodejs.org) ≥ 18。

```powershell
irm https://raw.githubusercontent.com/thrudcoco/dsh-peak-hours-banner/main/install.ps1 | iex
```

脚本会自动完成：下载源码 → 构建 `lib/` → 通过官方
`dsh plugin --profile web add link:…` 流程装入 web profile。

### 方式三：手动安装（源码）

```bash
git clone https://github.com/thrudcoco/dsh-peak-hours-banner.git
cd dsh-peak-hours-banner
node packages/dsh-peak-hours-banner/scripts/build-client.js          # 构建 lib/
dsh plugin --profile web add link:"$PWD/packages/dsh-peak-hours-banner"
```

### 启用

安装完成后**重启 DSH 进程**，打开任意会话——聊天区顶部居中即出现时段横幅。

### 卸载

```bash
dsh plugin --profile web remove @thrudcoco/dsh-peak-hours-banner
```

然后重启 DSH 进程即可。

## ❓ 常见问题

为什么我的横幅颜色和别人不一样？

横幅按 “你计算机的时钟” 换算成北京时间的窗口来判断。你在不同时区，同一
时刻对应的北京时间不同，属正常现象。


周末也会提示高峰吗？

不会。北京时间周六、周日全天为空闲时段（绿色）；节假日暂按当日星期处理。

跨过整点后多久刷新？

≤15 秒。插件每 15 秒做一次分钟边界探测，即使标签页被浏览器节流或系统休眠，
恢复后也会立即补上正确的状态。

会收集我的数据吗？

不会。插件只在你的浏览器里读取本地时钟并渲染文字，不发起任何网络请求。

## 🧱 仓库内容

```
dsh-peak-hours-banner/
├── install.ps1                     # PowerShell 一键安装脚本
├── packages/dsh-peak-hours-banner/ # 插件本体（可安装的组合包）
│   ├── cordis.patch.yml            #   组合补丁：插入 ui-peak-hours-banner 行
│   ├── package.json                #   dsh.client 声明（platform: web）
│   ├── scripts/build-client.js     #   构建：内联核心逻辑 → module-loader 包装
│   ├── src/index.js                #   宿主半区（空壳）
│   ├── src/client/index.js         #   浏览器半区可读源码
│   ├── lib/                        #   预构建产物（github 安装免编译的原因）
├── src/core.js                     # 时段判定纯逻辑（Node 可测，单一事实源）
├── src/client.template.js          # 动态调试用客户端模板
├── scripts/build-client.js         # 动态调试版构建脚本
└── test/                           # node:test 测试套件（72 用例）
```

开发与测试命令见 [`packages/dsh-peak-hours-banner/README.md`](packages/dsh-peak-hours-banner/README.md#build--test)。

## 📄 许可证

本项目以 [Apache License 2.0](LICENSE) 协议开源。

## 👤 创作者声明

- 作者：**[@thrudcoco](https://github.com/thrudcoco)**
- 本项目以 **Apache License 2.0** 协议开源：可自由使用、修改与分发，请保留协议与作者声明。
- 本项目为社区作品，与 DeepSeek 官方无关；DeepSeek Harness 及相关名称归其权利人所有。

#dsh-plugin