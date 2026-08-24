# DSH-Version-Inspector

DSH 版本信息插件。在 DSH 的设置面板中新增一个「版本信息」页面，以树状结构展示 **DeepSeek Harness**、**插件**及其**依赖**的版本号。样式沿用 DSH 主题（`--dsw-alias-*` 变量），自动适配 **day / dark** 模式。

<img width="803" height="754" alt="image" src="https://github.com/user-attachments/assets/8b5720db-614f-418c-83aa-90d7d90a980f" />

## 功能

- 设置面板新增「版本信息」页面（`settings.section`，`replaceRisk: none`）
- 树状结构，分三组，节点可展开 / 折叠：
  - **DeepSeek Harness（dsh）**：`@deepseek-ai/dsh` 版本号 + 顶层依赖（默认折叠）
  - **插件**：从 Cordis Loader 读到的其他已挂载插件及其版本（不含本插件）
  - **当前插件**：本插件自身的版本 + `dependencies` / `peerDependencies` 子树
- 每个依赖项展示：名称、已解析版本（安装的真实版本）、声明范围（`^x.y.z`）、所属 section（依赖 / 对等依赖 / 可选依赖）与解析路径
- 宿主解析不到的依赖（如客户端专用的 `react`、未安装的可选依赖）以警示色标注，并显示声明范围
- **紧凑多列布局**：版本项以自适应多列网格（`auto-fill`）密集排布，长列表横向铺开、少滚动
- **搜索过滤**：按包名或版本过滤，快速定位目标包（结果按 Harness / 插件 / 当前插件分组显示并计数）
- 设置页导航中的**最后一个**条目（`order 1000`）
- 样式与现有设置页一致，使用 DSH 主题令牌（CSS 变量），**自动适配 day / dark**

## 数据来源

全部数据由 Host 侧只读收集，通过一个**同源控制路由** `GET /version-info`（回环校验）提供给客户端：

| 项 | 来源 |
| --- | --- |
| Harness 版本 | `@deepseek-ai/dsh/package.json`（模块解析） |
| 插件列表 | Cordis Loader（`ctx.get("loader").entries()`，尽力而为；可用时列出已挂载插件） |
| 各插件版本 | 各插件包 `package.json`（`createRequire` 解析） |
| 依赖版本 | 各包声明依赖的 `package.json`（直接解析优先，回退到模块入口向上查找） |

客户端只在页面打开时做一次同源 `fetch("/version-info")`，之后仅在内存中展开/折叠。

## 安装

需要 [dsh CLI](https://github.com/deepseek-ai/deepseek-harness)（0.1.0-rc.6 及以上）。

从 GitHub 仓库安装：

```sh
dsh plugin --profile web add github:NEVSTOP-LAB/dsh-version-inspector
```

> [!NOTE]
> `--profile web` 是默认 profile。桌面版（[DSH Desktop](https://github.com/anywhere-labs/deepseek-harness-desktop)）用 `--profile desktop`；其他 profile 把 `web` 换成对应名字即可。

建议锁定提交，避免后续更新改变实际内容：

```sh
dsh plugin --profile web add github:NEVSTOP-LAB/dsh-version-inspector#<commit-sha>
```

也可以从 [Releases](https://github.com/NEVSTOP-LAB/dsh-version-inspector/releases) 下载 tarball 安装：

```sh
dsh plugin --profile web add ./dsh-version-inspector-0.1.2.tgz
```

安装后确认组合层里出现该插件：

```sh
dsh --profile web --dump-config
```

启动后，打开设置面板，「版本信息」页面出现在设置页列表。

卸载：

```sh
dsh plugin --profile web remove dsh-version-inspector
```

## 目录结构

```
dsh-version-inspector/
├── .github/workflows/   # CI / Release
├── doc/design.md        # 设计文档
├── index.js             # Host half（版本收集 + /version-info 路由）
├── lib/client.js        # Client half（设置页树状 UI，__ModuleLoader__ bundle）
├── package.json         # bundle manifest（dsh.bundle + dsh.client）
├── cordis.patch.yml     # 组合层：插入插件行
└── scripts/pack.mjs     # tarball 打包
```

## License

MIT
