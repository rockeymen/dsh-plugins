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

### 场景 Scenario · 行为 Behavior
- **场景 Scenario**: 正在生成时按 Ctrl+C（无选中文本） · **行为 Behavior**: 立即打断当前轮次，顶部弹出确认提示
- **场景 Scenario**: 有选中文本（页面文字或输入框选区）时按 Ctrl+C · **行为 Behavior**: 正常复制，不打断
- **场景 Scenario**: 没有在生成时按 Ctrl+C · **行为 Behavior**: 无操作（保持浏览器默认行为）
- **场景 Scenario**: 打断前有排队消息（生成中发的指令） · **行为 Behavior**: 自动按 FIFO 续跑（先移除再重新入队唤醒驱动）
- **场景 Scenario**: Ctrl+Shift+C / Ctrl+Alt+C / Ctrl+Cmd+C · **行为 Behavior**: 不拦截（保留 DevTools 等快捷键）
- **场景 Scenario**: 中文输入法组合期间 · **行为 Behavior**: 不拦截

只打断**当前打开的会话**。DSH 宿主对打断前排队的消息不会自动唤醒驱动，本插件会在打断成功后把仍在排队的消息按 FIFO 重新入队并自动续跑；如不需要自动续跑，在浏览器控制台执行 `localStorage["dsh.ctrlC.autoResume"] = "off"` 即可关闭。
Only the currently open session is interrupted; queued messages resume in FIFO order, same as the official stop button.

## 开发 / Development

```bash
npm run check   # 校验改名等改动没有破坏三处一致（package.json / cordis.patch.yml / lib/client.js）
```

发布前（npm）会自动执行 `prepublishOnly: npm run check`。