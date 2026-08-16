# dsh-ctrl-c

DSH Web 客户端插件：在对话生成过程中按 **Ctrl+C** 直接打断当前轮次 —— 效果与点击输入框上的「停止运行」按钮完全一致（底层都是调用当前会话的 `cancel()`）。

Press **Ctrl+C** while the agent is generating to stop the current turn — identical to clicking the stop button (both call the scoped session's `cancel()`).

## 安装 / Install

```bash
# GitHub 直装 / install straight from GitHub
dsh plugin --profile web add github:Maybemar/dsh-ctrl-c

# npm 发布后 / once published to npm
dsh plugin --profile web add @maybemar/dsh-ctrl-c
```

安装后重启 `dsh web` 并刷新页面即可（插件集合变更需重启；之后改 bundle 内容只需刷新页面）。
Restart `dsh web` and refresh the page once; later bundle edits only need a page refresh.

## 行为规则 / Behavior

| 场景 Scenario | 行为 Behavior |
| --- | --- |
| 正在生成时按 Ctrl+C（无选中文本） | 立即打断当前轮次，顶部弹出确认提示 |
| 有选中文本（页面文字或输入框选区）时按 Ctrl+C | 正常复制，不打断 |
| 没有在生成时按 Ctrl+C | 无操作（保持浏览器默认行为） |
| 打断前有排队消息（生成中发的指令） | 自动按 FIFO 续跑（先移除再重新入队唤醒驱动） |
| Ctrl+Shift+C / Ctrl+Alt+C / Ctrl+Cmd+C | 不拦截（保留 DevTools 等快捷键） |
| 中文输入法组合期间 | 不拦截 |

只打断**当前打开的会话**。DSH 宿主对打断前排队的消息不会自动唤醒驱动，本插件会在打断成功后把仍在排队的消息按 FIFO 重新入队并自动续跑；如不需要自动续跑，在浏览器控制台执行 `localStorage["dsh.ctrlC.autoResume"] = "off"` 即可关闭。
Only the currently open session is interrupted; queued messages resume in FIFO order, same as the official stop button.

## 目录结构 / Layout

- `cordis.patch.yml` — 插入 `ctrl-c` 插件行的 bundle patch
- `lib/index.js` — 宿主半边（no-op 宿主插件，让 loader 条目有活动 fiber 供 client-modules 扫描）
- `lib/client.js` — 浏览器半边（`window.__ModuleLoader__.load` 包装的 Ctrl+C 处理器）
- `src/` — 可读源码（`src/index.ts` 宿主、`src/client/index.ts` 浏览器）
- `scripts/check.mjs` — 包名 / patch 行名 / bundle id 一致性检查（`npm run check`，发布前自动跑）

## 开发 / Development

```bash
npm run check   # 校验改名等改动没有破坏三处一致（package.json / cordis.patch.yml / lib/client.js）
```

发布前（npm）会自动执行 `prepublishOnly: npm run check`。

## License

MIT