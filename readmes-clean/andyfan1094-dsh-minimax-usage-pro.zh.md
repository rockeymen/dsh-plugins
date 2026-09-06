# dsh-minimax-usage-pro

> DSH（DeepSeek Harness）bundle 插件，把用户的 MiniMax Token Plan 用量数据展示在 **设置 → 用量** 页面。

本插件是 `@floatingdeaming/minimax-usage@1.0.3` 的 **pro** 版。原版 bundle 插件只能在动态插件上工作，因为 DSH 宿主运行时只对动态插件的 vm 沙箱暴露 `harness.handle(...)`；受信 bundle 插件拿到的是普通 cordis 上下文，无法注册 JSON-RPC 处理器。这一限制在原版宿主日志里表现为 `WARN: harness not available`，设置页里表现为空区块。

`dsh-minimax-usage-pro` 保持同样的 bundle 插件形态，但把客户端→宿主的通信改走 `webServer` 上的普通 HTTP 路由，不再依赖 harness JSON-RPC 体系，因此可以在 **DSH 0.1.0-rc.8** 及任何保留 webServer 服务的后续版本上工作。

## 截图

![dsh-minimax-usage-pro 截图](docs/screenshots/minimax-panel.png)

## 安装

从 [Releases](https://github.com/andyfan1094/dsh-minimax-usage-pro/releases) 下载最新的 `dsh-minimax-usage-pro-*.tgz` 并加入 profile：

```powershell
dsh plugin --profile web add D:\downloads\dsh-minimax-usage-pro-0.1.1.tgz
```

安装后重启 DSH Web 宿主；设置页随后出现「用量」区块。

## 路由（宿主侧）

### 方法 · 路径 · 请求体 · 响应
- **方法**: `GET` · **路径**: `/api/dsh-minimax-usage-pro/has-key` · **请求体**: — · **响应**: `{ ok, hasKey, reason }`
- **方法**: `POST` · **路径**: `/api/dsh-minimax-usage-pro/usage` · **请求体**: `{ force?: boolean }` · **响应**: 归一化后的用量响应（与原版同构）

用量路由只接受 POST，浏览器预取和跨站导航无法触发外部配额请求。两条路由都是尽力而为——MiniMax 返回 `1004` 时，路由返回结构化错误（`statusCode: 1004, errorCode: 'auth_error'`）。

## 设置界面

注册 `settings.section` 槽位 `dsh-minimax-usage-pro`，标签为 **「用量」**，`order: 100`。渲染一张「套餐用量 · Max Plan」卡片，含两条进度行（5 小时 + 每周）、一个刷新按钮，以及窗口聚焦时自动刷新。

## API key

宿主侧按以下优先级读取 MiniMax Token Plan key：

1. `process.env.MINIMAX_API_KEY`
2. `process.env.MINIMAX_CN_API_KEY`
3. `~/.dsh/.credentials.yaml` —— 先 `MINIMAX_API_KEY`，再 `MINIMAX_CN_API_KEY`，与字段顺序无关

## 注意事项

- 该路由**不在** `PRIVILEGED_METHODS` 列表里，任何能访问 `/api/...` 的浏览器会话都能读取。DSH 的 `/api` 围栏默认仅限回环，远程浏览器时扩展为 `--trusted-host`；两种姿态都没问题，因为不会有任何密钥发给浏览器——只有已经解析好的用量数字。
- 该路由按设计绕过 `PRIVILEGED_METHODS` 闸门；如需收紧，把 `'/api/dsh-minimax-usage-pro/usage'` 加进 `~/.dsh/settings.yaml` 的 privileged 列表。