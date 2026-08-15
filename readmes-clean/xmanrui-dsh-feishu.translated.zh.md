# dsh-feishu

[中文](#中文) · [English](#english)

## 中文

把一个或多个飞书机器人直接接入 DeepSeek Harness。安装插件后，在 Harness 的设置页扫码即可逐个创建机器人；每次确认完成并通过连接检查后，都能立即在飞书里与同一个 Harness 智能体连续对话。

### 界面预览

![DeepSeek Harness 飞书机器人扫码接入页面](docs/images/feishu.png)

### 主要能力

- 在 Harness「设置 → 插件 → 飞书」内反复扫码添加多个机器人，无需手动复制 App ID 或 App Secret
- 每个机器人拥有独立凭据、飞书长连接、授权用户、会话映射和消息去重状态
- 单个机器人断线、重连或移除不会中断其他机器人
- 扫码用户自动成为首位授权用户，创建后即可私聊机器人
- 收到消息立即添加处理中 Reaction，成功或失败后更新状态
- 使用飞书 CardKit 原生流式卡片输出，失败时安全回退为普通文本
- 每个飞书会话映射到持久的 Harness 会话，支持多轮上下文
- 默认使用 Harness `standard` 智能体预设，包括网页搜索等工具能力
- App Secret 仅保存在 DSH Host 的凭据存储中，不进入浏览器、二维码或插件配置文件

### 安装

从 GitHub 一条命令安装：

```bash
npx -y github:xmanrui/dsh-feishu install
```

安装后重启 `dsh web`，打开「设置 → 插件 → 飞书」，点击「添加机器人」，再用飞书扫码确认。需要更多机器人时再次点击「添加机器人」即可；扫码只会新增，不会覆盖现有机器人。页面只有在以下条件全部满足后才把该机器人显示为“已连接”：

1. 飞书应用创建成功；
2. 凭据已安全保存；
3. 机器人身份校验成功；
4. 飞书长连接已建立；
5. DeepSeek Harness Host 可访问。

连接成功后，在飞书中找到刚创建的机器人并发送消息即可。每个机器人都支持 `/new`、`/status` 和 `/help`。

### 本地开发

```bash
git clone https://github.com/xmanrui/dsh-feishu.git
cd dsh-feishu
npm install
npm test
npm run build
node bin/dsh-feishu.mjs install --source .
```

插件运行在 `dsh web` 的 Host 进程内，不需要再维护独立桥接服务。非敏感配置保存在 `$DSH_HOME/integrations/dsh-feishu/`，各机器人的会话状态彼此隔离；每个 App Secret 都由 Harness 的 credential provider 独立管理。

当前按 DeepSeek Harness `0.1.0-rc.6` 的插件与 Connection RPC 接口开发。更新 Harness 后，建议先运行测试并验证设置页、扫码和消息收发闭环。

### 安全默认值

- RPC 仅允许本机 Harness 页面访问；
- 浏览器不能提交或读取 App Secret；
- 默认只接受扫码创建机器人的飞书用户消息；
- 机器人使用 `standard` 工具集，但不会自动批准 Harness 的高风险操作；
- 移除某个机器人会只停止它自己的长连接并清除它自己的插件凭据，不影响其他机器人；
- 重复扫码得到同一个飞书应用时会复用原机器人记录，不会产生重复接入。

### 旧版独立桥接

仓库仍保留 `src/index.mjs` 与 `.env.example`，用于兼容早期的独立进程部署。新安装优先使用 Harness 插件模式。

### 许可证

MIT

## English

Connect one or more Feishu bots directly to DeepSeek Harness. After installing the plugin, you can create bots one by one by scanning a QR code in the Harness settings page. Once registration and connection checks succeed, each bot is immediately ready for continuous conversations with the same Harness agent.

### Interface preview

![Feishu bot QR-code setup in DeepSeek Harness](docs/images/feishu.png)

### Features

- 通过在**Harness→设置→插件→飞书**下重复扫描二维码来添加多个机器人，无需手动复制App ID或App Secret
- 为每个机器人保留单独的凭据、飞书长连接、授权用户、会话映射和消息重复数据删除状态
- 重新连接或删除一个机器人而不中断任何其他机器人
- 自动授权扫描二维码的用户，以便机器人在设置后立即准备好直接消息
- 消息到达后立即添加处理反应，然后在请求成功或失败时更新它
- 通过原生飞书 CardKit 卡进行流式回复，并安全回退到纯文本
- 将每个飞书对话映射到持久的 Harness 会话，以实现多回合上下文
- 默认使用Harness `standard`代理预设，包括网页搜索等工具
- 仅将每个应用程序密钥存储在 DSH 主机凭证存储中，而绝不会存储在浏览器、二维码或插件配置文件中

### 安装

使用一个命令从 GitHub 安装：

```bash
npx -y github:xmanrui/dsh-feishu install
```

安装后重启`dsh web`。打开Harness中的**设置→插件→飞书**，点击**添加机器人**，用飞书扫描二维码。重复相同的过程以添加更多机器人；新的扫描永远不会覆盖现有的机器人。仅当以下所有检查均成功后，机器人才会显示为 **已连接**：

1、飞书APP已创建；
2.其凭证已被安全存储；
3. 机器人身份已验证；
4、飞书长连接已建立；
5. DeepSeek Harness 主机可达。

连接后，在飞书中找到新创建的机器人并向其发送消息。每个机器人都支持 `/new`、`/status` 和 `/help`。

### 本地发展

```bash
git clone https://github.com/xmanrui/dsh-feishu.git
cd dsh-feishu
npm install
npm test
npm run build
node bin/dsh-feishu.mjs install --source .
```

该插件在 `dsh web` 主机进程内运行，因此不需要独立的桥接服务。非敏感配置存储在`$DSH_HOME/integrations/dsh-feishu/`下。每个机器人的对话状态都是隔离的，每个应用程序密钥都由 Harness 凭证提供者独立管理。

当前版本针对DeepSeek Harness `0.1.0-rc.6`中的插件和Connection RPC接口。升级 Harness 后，运行测试并验证设置页面、二维码设置和端到端消息流，然后再部署更新。

### 安全默认值

- RPC 端点只能从本地 Harness 页面访问；
- 浏览器既不能提交也不能读取App Secrets；
- 默认情况下，只有通过二维码创建机器人的飞书用户才有权向其发送消息；
- 机器人使用 `standard` 工具集，但从不自动批准高风险 Harness 操作；
- 删除机器人仅停止其自己的长连接并仅删除其自己的插件凭据；
- 再次扫描同一个飞书应用程序会重复使用其现有的机器人记录，而不是创建重复的集成。

### 传统独立桥

该存储库仍包含 `src/index.mjs` 和 `.env.example`，以与早期独立部署兼容。新安装应使用 Harness 插件模式。