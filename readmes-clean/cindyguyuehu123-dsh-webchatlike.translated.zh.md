# dsh-webchatlike

> 把 **DeepSeek 网页版 / App 的聊天体验**带进 DeepSeek Harness：编辑提问、重新生成回复、在消息上直接翻版本——就像在 deepseek.com 上聊天一样。

一个面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI 的客户端插件,让对话行为和 deepseek.com 网页版 / App 一致:原位编辑、一键重新生成、逐条消息的版本翻页器。

- **✏️ 编辑重发**——悬停**自己的消息**,在原消息位置**就地**打开编辑框(预填原提问,无弹窗、不新建对话),改完重发。fork 点选在提问回合之前,新会话是干净的 `历史 + 修改后的提问 + 新回答`。
- **🔄 重新生成**——悬停任意 assistant 回复,从该回合之前分叉重新生成。旧提问**不会**重复塞进上下文。
- ** 版本翻页**——**每条**被重新生成 / 编辑重发过的消息旁都会出现 deepseek.com 风格的 `<2/5>` 翻页器(树状模型:**每条消息的版本独立计数**)。左右箭头切换版本,自动定位到同一轮。每个对话记住你最后查看的版本——切去别的对话再回来,不会跳回第 1 版。
- **🌳 分叉整棵树**——「在新对话中分支」(对话内或边栏)会把**整棵树**复制成一份**完全独立的副本**:新根 + 每个版本的副本,新树自带完整版本体系(`` 可翻),从此与原树互不影响。副本根标题带 `(副本)` / `(副本 2)` 递增,分叉后自动定位到你 fork 时所在的版本。
- **🗑️ 删除会话**(需补丁)——从左侧会话菜单彻底删除会话,连同硬盘上的会话日志。

边栏保持干净:版本 fork 折叠进原始对话(一个对话一行),在任意版本里的活动都会照常把该对话浮到顶部。**家族根行**上的重命名、归档、删除作用于整棵树(所有 regenerate/编辑版本);分叉副本是完全独立的对话,只作用于自身。

## ⚠ 依赖 2 个源码补丁

与纯插件不同,本插件扩展了两个 harness **没有公开扩展点**的源码文件:

### 补丁 · 文件数 · 作用
- **补丁**: ui-conversation user-actions 插槽 · **文件数**: 5 · **作用**: 用户消息下方的 ✏️ 按钮座位 + 原位编辑锚点(`position: relative`)+ 对话内「分支」复制整棵树
- **补丁**: ui-workspace 版本折叠 · **文件数**: 4 · **作用**: 边栏永远隐藏版本 fork、当前版本映射回原始行、版本内活动折算进对话排序、恢复最后查看的版本、家族级行操作、边栏分叉复制整棵树

不打补丁时插件能加载,但**编辑按钮和边栏折叠不会出现**。`cordis.patch.yml` 只负责加载插件本身。

## 安装

### 1. 打源码补丁

```bash
cd deepseek-harness
/path/to/dsh-webchatlike/apply-patches.sh   # 逐个复制,冲突时提示
pnpm install
pnpm run build:lib:client && pnpm run build:web
```

### 2. 安装插件

方式一:作为 bundle 安装(已声明 `dsh.bundle`):

```bash
dsh plugin --profile web add <本仓库 git 地址或 npm 包名>
```

方式二:手动在 `~/.dsh/profiles/web/cordis.patch.yml` 注册:

```yaml
- insert:
    - id: chat-actions
      name: 'dsh-webchatlike'
```

手动安装时,请把包加入 `~/.dsh/profiles/web/package.json` 的 dependencies 并在 profile 目录执行 `pnpm install`,让加载器能解析到它。

### 3. 重启

终端 Ctrl+C,重新 `pnpm dsh web`,刷新页面。

## 使用

- 悬停任意 **assistant 回复** → 🔄 重新生成
- 悬停任意 **用户消息** → ✏️ 原位编辑重发
- 对同一回合多次 🔄 / ✏️ 后,回复旁出现 **<2/5>**,点左右箭头切换版本
- 左侧会话列表行尾 ⋯ 菜单 → **删除会话**(带确认框;正在运行的会话拒绝删除)

## 工作原理

- 每个版本都是一个真实的 fork 会话。fork 点选在**目标回合之前**,新会话 = `历史 + 提问 + 新回答`——与 deepseek.com 的树状模型一致。
- 插件把 fork 记录在 localStorage 版本树(`dsh-webchatlike:version-tree`,按**家族根**命名空间:每棵树一个命名空间,分叉副本与原树互不干扰)和「最后查看版本」映射(`dsh-webchatlike:last-version`)里。所有读取都是防御式的:没有插件时,边栏行为与原生完全一致。
- 版本翻页器渲染在**每条**版本化消息上;切换打开兄弟 fork 并滚动定位到同一轮。不依赖 `seedLength`——版本功能不需要任何 host 改动。

## FAQ

**为什么对话的第一条消息没有按钮?** 第一回合之前没有干净的 fork 边界(harness 的 fork 需要一个已完成的回合作为锚点),所以第一条消息不能重新生成 / 编辑——和大多数网页版聊天一致。

## 与上游的关系

- 插件本身只用 harness **公开扩展点**(`conversation.chat.assistant-actions` / `conversation.chat.user-actions` 插槽、`ctx.sessions.fork`、`session.prompt`、`ctx.sessions.open`)。
- 两个补丁是小而自洽的核心改动(共 9 个文件)。上游更新后重新应用即可——`apply-patches.sh` 会先对比再覆盖。

# dsh-webchatlike

> 将**DeepSeek Web /应用程序聊天体验**带到DeepSeek Harness：编辑您的问题，重新生成答案，并在版本之间切换 - 直接在消息上，就像在deepseek.com上聊天一样。

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI 的客户端插件，使对话的行为类似于 deepseek.com Web/应用程序聊天 — 就地编辑、一键重新生成和每消息版本寻呼机。

- **✏️ 编辑并重新发送** — 将鼠标悬停在您自己的消息上，**就地编辑**（无模式，无新聊天），然后重新发送。一个干净的叉子从你的问题之前的转弯处重新开始：`history + edited question + new answer`。
- **🔄 重新生成** — 将鼠标悬停在任何助理回复上，然后从前一回合重新生成它。老问题**没有**重复到上下文中。
- **版本寻呼机** — 每条轮到重新生成或编辑的消息都会获得一个 deepseek.com 风格的 `<2/5>` 寻呼机（树模型：**每条消息的版本独立计数**）。翻阅带有 V 形图案的版本；同一个回合会滚动到视图中。每次对话都会记住您正在查看的版本，因此切换聊天并返回不会将您带到版本 1。
- **🌳 分叉整个树** — “在新对话中分支”（聊天内或侧边栏）将整个树复制到完全独立的副本中：一个新的根加上每个版本的副本，具有自己的完整版本系统（`` pager works), never interacting with the source again. The copy root is titled `base（副本）` / `（副本2）` etc., and the new tree opens at the version you forked FROM.
- **🗑️ Delete session** (patch) — delete a session from the sidebar context menu, including its on-disk log.

The sidebar stays clean: version forks are folded into their original conversation (one row per conversation), and activity inside any version still floats that conversation to the top. **Family-ROOT rows** act on the whole tree for rename/archive/delete (all regenerate/edit versions); fork copies are fully independent conversations that only ever act on themselves.

## ⚠ Requires 2 source patches

Unlike pure plugins, this one extends two harness **source files** that have no public extension points:

### Patch · Files · What it adds
- **Patch**: `ui-conversation` user-actions slot · **Files**: 5 files · **What it adds**: the ✏️ button seat under user messages + the in-place edit anchor (`position：relative`) + in-chat "branch" copies the whole tree
- **Patch**: `ui-workspace`版本叉折叠· **文件**：4个文件· **它添加了什么**：从侧边栏隐藏版本叉（始终），将打开的叉别名为其原始行，将叉活动折叠到对话的新近度中，恢复上次查看的版本，全族范围的行操作，侧边栏叉复制整个树

如果没有它们，插件会加载，但编辑按钮和侧边栏折叠会保持关闭状态。 `cordis.patch.yml` 仅加载插件本身。

## 安装

### 1.应用源补丁

```bash
cd deepseek-harness
/path/to/dsh-webchatlike/apply-patches.sh   # copies files, prompts on conflicts
pnpm install
pnpm run build:lib:client && pnpm run build:web
```

### 2.安装插件

将其作为捆绑包安装（它声明 `dsh.bundle`）：

```bash
dsh plugin --profile web add
```

…或者在 `~/.dsh/profiles/web/cordis.patch.yml` 中手动注册：

```yaml
- insert:
    - id: chat-actions
      name: 'dsh-webchatlike'
```

如果您手动安装，请使包可从配置文件解析（例如，将其添加到 `~/.dsh/profiles/web/package.json` 依赖项和 `pnpm install` 中）。

### 3.重新启动

再次按 Ctrl+C 和 `pnpm dsh web`，然后刷新浏览器。

## 用法

- 将鼠标悬停在**助理回复** → 🔄 上即可重新生成。
- 将鼠标悬停在 **用户消息** → ✏️ 即可就地编辑并重新发送。
- 同回合数次🔄/✏️后，回复显示**<2/5>**；使用 V 形符号切换版本。
- 侧边栏行⋯菜单→ **删除会话**（需要确认；正在运行的会话被拒绝）。

## 它是如何工作的

- 每个版本都是一个真正的分叉会话。叉形切割在目标转弯之前**着陆，因此新会话是 `history + question + new answer` — 与 deepseek.com 的树模型匹配。
- 该插件在 localStorage 版本树（`dsh-webchatlike:version-tree`，以家族 ROOT 命名空间 - 每棵树都有自己的命名空间，因此分叉副本永远不会与源发生冲突）中记录分叉，以及“最后查看的版本”映射（`dsh-webchatlike:last-version`）。读取是完全防御性的：没有插件，侧边栏的行为与库存完全相同。
- 版本寻呼机呈现在**每个**版本化消息上；切换会打开同级叉子并将同一轮滚动到视图中。未使用 `seedLength` — 版本控制无需更改主机。

## 常见问题解答

**为什么对话的第一条消息上没有按钮？** 第一个转弯之前没有干净的叉子边界（线束叉子需要完整的转弯才能锚定），因此在那里无法重新生成/编辑 - 与大多数网络聊天中的第一条消息相同。

## 与上游的关系

- 插件本身仅使用线束**公共扩展点**（`conversation.chat.assistant-actions` / `conversation.chat.user-actions` 插槽、`ctx.sessions.fork`、`session.prompt`、`ctx.sessions.open`）。
- 这两个补丁是小的、独立的核心更改（总共 9 个文件）。上游更新后重新应用 - `apply-patches.sh` 在覆盖之前进行比较和询问。