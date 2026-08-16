# win-notify — DeepSeek Harness Windows 通知插件

当 Agent 完成任务或需要用户审批时，通过 Windows Toast 发送桌面通知。

## 文件

| 文件 | 说明 |
|---|---|
| `index.mjs` | 插件源码（ESM Cordis 插件，当前版本 v6） |
| `icon.png` | 通知图标源（256×256，Toast appLogoOverride 直接引用） |
| `icon.ico` | 快捷方式图标（由 icon.png 自动生成，勿手动编辑） |
| `cordis.patch.yml` | 机器级挂载补丁（实际安装位置为 `%USERPROFILE%\.dsh\cordis.patch.yml`） |

## 安装位置（实际生效副本）

- 插件：`%USERPROFILE%\.dsh\plugins\win-notify\`
- 挂载补丁：`%USERPROFILE%\.dsh\cordis.patch.yml`（对所有 dsh profile 生效，每次启动自动挂载）

## 工作原理

- 监听宿主级 `session/event`（会话日志追加广播，根级可达——`approval/request` 与 `agent/status` 为 scope 过滤事件，外部监听不到）
- `approval/asked` → 通知「DeepSeek Harness · 需要确认」（正文：原因｜工具名｜会话标题）
- `turn/end`（reason=`completed` 且为根会话）→ 通知「DeepSeek Harness · 任务完成」
- 通知链路：DeepSeek Harness 自定义 AUMID（`DeepSeekHarness.Notify`，启动菜单快捷方式注册）→ PowerShell AUMID 兜底 → WScript 弹窗兜底
- 激活时自愈：缺失快捷方式则自动创建并写入 AUMID；缺失 icon.ico 则自动从 icon.png 生成并设置

## 更新方法

1. 修改 `index.mjs`
2. 更新 `%USERPROFILE%\.dsh\cordis.patch.yml` 中 `name` 的查询参数（`?v=N` 递增），触发 loader 热重导入
3. 换图标：替换 `icon.png` 并删除 `icon.ico`（下次激活自动重新生成）

## 卸载方法

删除 `%USERPROFILE%\.dsh\cordis.patch.yml` 中的 `win-notify` 行，并删除 `%USERPROFILE%\.dsh\plugins\win-notify\` 目录。

## License

[MIT](LICENSE) © 2026 taskschd1145
