#DSH-Plugs

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) 的单一插件库 — **一个文件夹 = 一个插件**。

## 插件

### [@just-genius/dsh-session-navigator](plugins/session-navigator)

Codex 风格的消息导航栏：对话记录上的垂直刻度栏，每条用户消息一个刻度，主动突出显示，步进悬停和平滑跳转。

![会话导航器](public/session-nav.png)

### [@just-genius/dsh-模型-定制-ex](plugins/dsh-model-custom-ex)

替换官方模型设置页面（`ui-settings-models` 的分支），为 **Vision** (`input`) 和 **Thinking Strength** (`reasoningEfforts`) 添加每个模型的下拉多项选择 - 这两个选项控制库存页面对 `settings.yaml` 的投注。

![自定义模型设置](public/model-custom-ex.png)

### [@just-genius/dsh-插件市场](plugins/dsh-plugin-marketplace)

将市场选项卡添加到 **设置 → 插件**。它浏览此存储库以及 [awesome-dsh-plugin](https://awesome-dsh-plugin.com/) 目录，标记已安装的插件，并可以复制或运行目录安装命令（需要重新启动）。

### [@just-genius/dsh-桌面-update](plugins/dsh-desktop-update)

侧边栏“设置”按钮旁边的 DSH-桌面更新徽章，由 `window.dshDesktop`（电子预载桥）驱动。空闲状态是一个安静的问号，它打开版本和自动检查门；当有可用更新时，它会变成强调箭头。应用程序更新跳转至GitHub发布； DSH 运行时更新安装到位 (pnpm) 并要求重新启动。跳过一个版本，仅当出现较新的版本时才会返回提示。在普通浏览器（无桥）中，它不会呈现任何内容。

![桌面更新](public/desktop-update.png)

## 存储库布局

```
DSH-Plugs/
├── package.json          # root workspace (shared build/type toolchain)
├── pnpm-workspace.yaml   # packages: ['plugins/*']
├── tsconfig.base.json    # shared TS config
└── plugins/
    └── session-navigator/   # one plugin per folder
```

## 什么是插件

插件是 Cordis 插件 npm 包，分为两半：

### 半·来源·输出·角色
- **Half**：节点 · **来源**：`src/index.ts` · **输出**：`lib/index.js` · **角色**：主机条目（对于纯 UI 插件通常是空的 `apply`）
- **一半**：浏览器 · **来源**：`src/client/index.tsx` · **输出**：`lib/client.js` · **角色**：浏览器入口，通过`window.__ModuleLoader__.load({ id, factory })`注册并在`apply`中使用`ctx.slots.register`安装React面板

`package.json`中的两个关键声明：

- `dsh.client` — 声明浏览器端注入（`inject` 列出它所依赖的客户端包名称；`platform: web`）。
- `dsh.bundle.patch` — 指向 `cordis.patch.yml`，因此安装包会自动将其加载程序行插入配置文件中。

## 命令

```bash
pnpm install      # install dependencies
pnpm build        # build all plugins (src → lib)
pnpm watch        # watch and rebuild
pnpm typecheck    # type-check
pnpm clean        # remove all lib/
```

## 添加插件

1. 复制 `plugins/*` 文件夹并将其重命名为您的插件名称。
2、设置`package.json`的`name`（保留`@just-genius/dsh-*`前缀）。
3. 编辑`src/index.ts`（节点一半）和`src/client/index.tsx`（浏览器一半）。
4.`pnpm build`。

## 安装插件

```bash
# Link a local folder into the profile (relative paths anchor to the current directory)
dsh plugin --profile web add ./plugins/session-navigator
```

因为包声明了 `dsh.bundle.patch`，所以它在安装时自动加入配置文件的捆绑层； **刷新网页**即可看到。

卸载：

```bash
dsh plugin --profile web remove @just-genius/dsh-session-navigator
```