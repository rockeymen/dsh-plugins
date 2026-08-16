# dsh-enter

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI 的客户端插件：
在对话框里按 **Ctrl+Enter（左 Ctrl）** 插入换行，与 Shift+Enter 一致。

## 功能

### 按键 · 行为
- **按键**: Enter · **行为**: 发送
- **按键**: Shift+Enter · **行为**: 换行（原生）
- **按键**: Ctrl+Enter（左 Ctrl） · **行为**: 换行
- **按键**: 右 Ctrl+Enter / Cmd+Enter · **行为**: 加速发送

左/右 Ctrl 通过 `KeyboardEvent.location` 区分；无法报告物理位置的环境（location 为 0，
如部分键盘映射、输入法、远程输入）下，Ctrl+Enter 一律视为左 Ctrl 换行。

## 安装

1. 把插件链接进 web profile：

   ```sh
   dsh plugin --profile web add .
   ```

   或手动将本目录链接到 `$DSH_HOME/profiles/web/node_modules/dsh-enter`。

2. 在 `$DSH_HOME/cordis.patch.yml` 中加入：

   ```yaml
   - insert:
       - id: dsh-enter
         name: dsh-enter
   ```

3. **刷新页面**后生效（HMR 不会自动装载启动后新增的插件，必须刷新一次）。

## 许可证

MIT