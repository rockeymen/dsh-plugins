# dsh-feishu

DSH 的独立飞书自建应用集成插件。

## 功能

- 通过官方 WebSocket 长连接接收飞书文本与富文本（post）消息；保留链接与 @提及，内嵌图片会下载并保留为图片输入，其他媒体降级为可读占位文本。
- 通过官方资源 API 下载图片消息到本地媒体目录，经 DSH 附件服务保存后，向所选 agent 模型发送原生 `{ type: 'image', attachment }` 内容块；下载失败或附件准入被拒时，降级为基于路径的识图提示或纯文本告知。
- 每个飞书 chatId 对应一个独立的顶级 DSH agent/会话，绝不复用 Web 对话。
- 把所有现存及持久化的 `session-feishu*` 会话挂到拥有其 cwd 的真实 DSH 工作区。新会话标题为 `飞书 · <首条有效消息>`；泛泛的问候先以 `飞书会话` 起名，出现有效内容后再升级；用户手动改过的标题不会被覆盖。
- 默认跟随 DSH 当前默认模型，也可为飞书单独指定 provider、model 及该模型声明的推理级别。
- 用可配置的 Agent 预设（默认 `cordis`）组装每个飞书 Agent，继承宿主的文件沙箱与审批策略。
- 收到消息后先在原消息上添加 OK 表情作为即时确认。
- 表情回复 API 不可用时，降级为短文本确认。
- 在 `turn/start` 时打开一张蓝头部的飞书卡片 JSON 2.0 流式卡片：状态、记号字号纯文本工具进度、Markdown 答案与独立的 `hr` + 记号字号元数据行各占独立元素。仅工具事件不会重发答案元素，答案的累计更新保留 CardKit 的前缀流式行为，只让新后缀参与动画。页脚每秒一次心跳刷新模型、推理级别与已用时长，完成/取消/出错/卸载时停止。
- CardKit 流式 API 不可用或失败时降级为普通文本，最终答案不丢失。
- 容忍 DSH 启动竞态（模型适配器晚于本插件注册）：飞书 WebSocket 立即启动，会话创建短暂等待 `NO_ADAPTER` 消除。
- 错误与会话被释放的提示会发回同一会话。
- 使用配置的飞书应用 API，无需自建群 webhook。

## 截图

![dsh-feishu 截图](docs/screenshots/feishu-panel.png)

## 安装

从 [Releases](https://github.com/andyfan1094/dsh-feishu/releases) 下载最新的 `dsh-feishu-*.tgz` 并加入 profile：

```powershell
dsh plugin --profile web add D:\downloads\dsh-feishu-0.2.2.tgz
```

安装后重启 DSH Web 宿主，再完成下方的 profile 配置。

本地开发可改用 checkout 链接安装：

```powershell
dsh plugin --profile web add link:D:/项目/dsh-feishu
```

## Profile 配置

把插件加入 profile bundle 列表并在 profile patch 中配置。未配置凭据时，随包 bundle 行保持禁用：

    - id: dsh-feishu
      config:
        enabled: true
        appId: cli_xxx
        appSecret: your-secret
        allowUsers:
          - ou_xxx
        ack: true
        ackReaction: OK
        provider: ''
        model: ''
        reasoningEffort: ''
        agentPreset: cordis

业务消息必须配置 `allowUsers`，空列表会拒绝所有用户。

`provider` 与 `model` 都留空时跟随 DSH 当前默认选择。Web 面板通过 `llm.resolveModelInfo(provider, model)` 读取推理级别，只提供所选模型声明过的档位。

修改 provider、model、推理级别或 Agent 预设会释放所有在跑的飞书 Agent。更新是事务性的：替换的桥接启动失败时，恢复存储的配置与原桥接。会话 id 使用 `v2` 配置指纹，缺 `meta.agentPreset` 的旧会话会被保留，但不会在新的工具组合下恢复；下一条飞书消息会创建或恢复匹配的 `v2` 会话。

## 命令

- `/status` 显示当前飞书会话的独立会话及其真实 provider、model、推理级别与 Agent 预设。
- `/stop` 取消当前飞书会话的任务。
- `/help` 显示命令列表。

插件包含宿主集成与 Web 配置面板，使用 session/event 与 agent/* 宿主事件，注册仅回环可访问的 `/api/dsh-feishu/*` 路由，不修改 DSH 核心源码。