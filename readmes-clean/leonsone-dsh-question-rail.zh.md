# dsh-question-rail

[English](README.md) | **中文**

一个模仿 [DeepSeek Harness](https://github.com/deepseek-ai/dsh) 网页版界面**右侧问题条**的 DSH 插件——右缘一条竖向问题栏，常态收起为窄列小横线，鼠标靠近时向右展开，列出当前会话**每一轮的用户提问**，点击后平滑滚动定位到对应位置。

- **一套渲染、两种状态**——收起态横线列与展开态列表是**同一套 `.qrl_item`**。收起时只露每条右侧的小横线；悬停时面板拉宽显示文字。样式、间距（`min-height:36px` + `3px`）、右侧参考线完全一致。
- **点击跳转任意轮**——点击某条问题，对话区平滑滚动到那一轮（`data-chat-anchor-key` 锚点）并带一圈高亮。
- **仅对话视图渲染**——读取每会话 chat store（`ctx.slots.entries("conversation.session")` + `resolveStore` 的 `view` 字段，与 DSH 头部标签同源），只在**对话**视图显示；切到轨迹 / 上下文 / Design / PPT 或首页立即隐藏。
- **完整历史**——DSH 会话历史是分页窗口（`hasMore`）。问题条自动循环调用 `session.loadOlder()` 直到 `hasMore === false`，列出**全部**轮次而非仅当前窗口。
- **性能优化**——`useSessions` 只选 `current`；订阅「渲染签名」（问题集合 + 当前视图）而非整个会话快照，流式输出 / 工具调用不会重渲染列表（打字不再卡顿）；点击处理用稳定引用、列表按签名 memo。
- **主题适配**——面板文字 & 详情框依据 `body[data-ds-dark-theme]` 切换配色（深色用白字、浅色用黑字）；面板本身透明，无边框、无底色。
- **键盘可达**——每个问题项是 `role="button"` + `tabIndex=0`，支持 Enter/Space 触发。
- **零运行时依赖**——node 半故意为空（仅让加载器发现该包）；浏览器半只用 `react` / `react/jsx-runtime` 两个 seed 词。

## 实现

### 层 · 说明
- **层**: **node 半**（`lib/index.js`） · **说明**: 空 `apply()`——只需成为活跃 cordis loader entry，让 `dsh-client-modules` 以 `/plugins/dsh-question-rail/client.js` 提供浏览器半。
- **层**: **浏览器半**（`lib/client.js`） · **说明**: 经 `window.__ModuleLoader__.load` 注册，`apply(ctx)` 将问题条注入 **`shell.overlay`** 槽位（frame 级浮层、可加性、默认穿透点击）。
- **层**: **数据** · **说明**: 读取当前会话的 `ConversationSnapshot.nodes`（完整列表，而非窗口化的 `chat.order`），抽取 `user` / `steering`，并把 `seq` 映射为 chat `key` 用于滚动定位。
- **层**: **视图门控** · **说明**: `ctx.slots.entries("conversation.session") → resolveStore(handle, sessionId) → store.getSnapshot().view`——与 DSH 头部标签同源。仅当 `view === "chat"` 时渲染。

## 安装

```powershell
# 本地开发（link 模式——源码改动硬刷新即生效）
dsh plugin --profile web add link:D:/path/to/dsh-question-rail

# 或直接从 GitHub 安装（需要本机 git + GitHub token）
dsh plugin --profile web add github:LeonSone/dsh-question-rail
```

`dsh plugin add` 会把包加入 profile 的 `dependencies`；因为包声明了 `dsh.bundle`，它会自动追加到 `dsh.profile.bundles`。

> **新 client 包需要一次重启**。`dsh.client` 的发现扫描只在启动时注册`新`包（bundle *内容*改动可热加载）。首次安装后需**重启 `dsh web`**，再**硬刷新浏览器**（Cmd/Ctrl+Shift+R）。

## 使用

安装后，活跃对话的右缘会出现一列小横线：

### 操作 · 行为
- **操作**: 鼠标靠近右缘 · **行为**: 窄列拉宽，露出每轮问题（12px 单行、右对齐、末尾小横线）。
- **操作**: 悬停某条问题 · **行为**: 左侧显示详情框，尽量展示**全文**（上限 50vh，可滚动）。
- **操作**: 点击某条问题 · **行为**: 对话区平滑滚动到那一轮并闪烁高亮。
- **操作**: 切到轨迹 / 上下文 / Design / PPT · **行为**: 问题条立即隐藏（chat 视图门控）。
- **操作**: 空会话 / 首页 · **行为**: 不渲染。

## 开发

```
lib/client.js          浏览器半（ModuleLoader 包，注入 shell.overlay）
lib/index.js           node 半（空 apply；仅用于发现）
cordis.patch.yml       bundle patch（挂载 node 半）
test/*.mjs             无头契约与抽取逻辑测试
```

运行检查：

```sh
node test/bundle-contract.test.mjs   # __ModuleLoader__.load / apply / inject / shell.overlay 注册
node test/bind-fix.test.mjs          # 闭包绑定 getSnapshot/subscribe（消除"this 丢失"崩溃）
node test/extract.test.mjs           # 完整列表抽取：只取 user/steering，锚点映射
node test/loadolder.test.mjs         # loadOlder 循环直到 hasMore=false（完整历史）
```

## 许可

MIT