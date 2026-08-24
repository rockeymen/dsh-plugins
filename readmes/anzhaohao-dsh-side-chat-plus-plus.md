# dsh-side-chat-plus-plus

Codex 式多标签侧聊增强 —— 从 [`@ahggg/dsh-side-chat`](https://github.com/AHGGG/dsh-side-chat) fork 的破坏式重写。

在原版「选中文字 → 侧聊追问」的基础上，做这些改进：

- **整条消息引用（Codex 式）**：鼠标悬停到任意一条历史消息，右上角出现「引用到侧聊」按钮，无需先选中文字，直接把整条消息作为引用上下文开一个新侧聊。
- **多标签侧聊**：每个侧聊是一个独立标签页，可同时保留多个、切换、关闭，互不干扰（原版同一时间只能有一个侧聊）。
- **生成中选中引用（零等待）**：主会话回复还在生成时，就能选中已输出的文本呼出「添加到对话 / 引用到侧聊」。引用到侧聊立即开工——fork 历史切在「用户问题之后、回复之前」（A3 中回合切点），引文随首条消息注入，不必等模型打完字；若宿主无法在流式回合中切点，会自动等待回合完成后再重试一次。
- **双模式 dock**：右侧停靠布局随 [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) 的状态自动切换——侧栏关闭时主会话为 dock 让位、内容完整可读；侧栏打开时侧聊作为最高图层只覆盖不让位，主会话保持满宽。
- **最高图层**：整个浮层 portal 到 `<body>`，脱离 DSH AppFrame 的 z-index 20 层，稳定盖过 dsh-better-sidebar 等 body 级浮层（z-index 40）。
- **去掉 More details**：删除原版选中工具栏里的「More details」按钮及其内联 prompt，只保留「Add to chat」（主会话引用）与「Ask in side chat」（侧聊追问）。

外观仍保留原版的右下角吸附浮层样式（`.dsh-side-chat-panel` 的 `position: fixed` 定位与主题 token）。

## 与原版的差异

| 维度 | `@ahggg/dsh-side-chat`（原版） | 本插件 |
| --- | --- | --- |
| host | 自带 `ArchivedForkSideChatService`（`sideChatArchived` RPC） | **自带 host**：`DshSideChatPlusPlusPlugin` 重新实现同一 `remote.sideChatArchived` RPC，不依赖官方插件 |
| 侧聊数量 | 单实例（打开新侧聊前必须先关旧的） | 多标签（N 个 `SideChatController`） |
| 引用入口 | 选中文字 → `More details` / `Ask in side chat` | 整条消息悬停按钮 + 选中文字工具栏 |
| 生成中选中 | 不允许（需等消息打完） | 允许，fork 走 A3 中回合切点零等待，失败自动等待重试 |
| 图层 | 依赖 DSH `shell.overlay` 槽位（z-index 20 层内） | portal 到 `<body>`，最高图层，覆盖 better-sidebar |
| 与 better-sidebar 共存 | 相互挤压 | 双模式：侧栏开→侧聊覆盖不让位；侧栏关→相互让位 |
| More details | 有 | 已删除 |

> Typert 描述符刻意保留上游的 wire 命名空间 `sideChatArchived` 与 RPC 方法名（`createArchived` / `selectArchivedModel` / `closeArchived`），但包 id 改为 `dsh-side-chat-plus-plus`（`src/typert.ts` 的 `TYPERT.package`），Cordis 服务键改为 `sideChatPlusPlus`，避免与官方 `sideChat` 服务冲突。

## 目录结构

```
src/
  client/           客户端（多标签 + 整条消息引用 + 生成中选中引用 + 双模式 dock）
    rc6/Rc6SideChatOverlay.tsx  多标签外壳 + 引用按钮注入（portal 到 body）
    side-chat-controller.ts     单个侧聊状态机（每个 tab 一个实例）
    panel/side-chat-layout.ts   双模式 dock 布局（detect better-sidebar 开关）
    selection/                 选中捕获、normalizer（生成中放行）、工具栏、批注 marker
  host/             自带 host（从上游 host 复制）
    archived-fork-service.ts    ArchivedForkSideChatService（fork/archive 会话，A3 中回合切点）
  shared/           共享类型与 wire schema
  index.ts          host 入口（Cordis 插件，重新实现 sideChatArchived RPC）
  remote.ts         Typert remote 贡献（客户端挂载面）
  typert.ts         Typert host 面（wire schema）
scripts/build.mjs   esbuild 编译 host + typert + remote + client
cordis.patch.yml    insert 声明（id=side-chat-plus-plus, name=包名）
```

## 构建

```powershell
npm run build
```

生成 4 个产物：

- `src/index.js` —— host（ESM，`@deepseek-ai/*` 与 `node:*` 保持 external，由 DSH host 解析）
- `src/typert.js` / `src/remote.js` —— Typert host/客户端面（`zod` 打进 bundle）
- `src/client.js` —— 浏览器 bundle（`window.__ModuleLoader__.load` 包裹，`react` 与 `@deepseek-ai/*` 客户端运行时 external）

`zod` 会从当前 DSH profile 探测并打进 bundle（见 `scripts/build.mjs` 的 `resolveZodEntry`）。

## 安装

从 npm 安装（推荐）：

```powershell
dsh plugin --profile web add dsh-side-chat-plus-plus
```

或从 GitHub 安装：

```powershell
dsh plugin --profile web add github:<owner>/dsh-side-chat-plus-plus
```

### 本地开发

```powershell
dsh plugin --profile web add "D:\Postgraduate_JilinUniversity\03_Sundries\02_DevLab\20260822-dsh-side-chat++"
# 修改源码后重新构建，再重启 dsh web
npm run build
```

### 验证清单（0.1.1）

- 主会话生成中选中已输出文本 → 「添加到对话 / 引用到侧聊」立即出现，引用到侧聊发送后**无需等待**立即开工；
- 打开 dsh-better-sidebar → 侧聊浮于其上、主会话保持满宽不被挤压；折叠侧栏 → 主会话恢复让位；
- 消息结束后选中、批注 marker、导出/升级等原有功能不受影响。

## License

MIT。本项目是 `@ahggg/dsh-side-chat`（MIT）的派生作品，归属说明见 [NOTICE](NOTICE)，上游许可证见 [LICENSE](LICENSE)。
