# dsh-im

## 中文

通过扫码或已有应用凭据把 IM 机器人接入 DeepSeek Harness。一个插件、一个设置入口，统一管理飞书、微信、钉钉、企业微信和 QQ 机器人。

> GitHub 简介：通过扫码或应用凭据把IM机器人接入DeepSeek Harness（支持飞书、微信、钉钉、企业微信和QQ）。

## 界面

![IM机器人页面](docs/images/imbot.png)

## 当前内置渠道

- 飞书：扫码创建机器人，或使用已有 App ID + App Secret 绑定机器人，使用长连接收发消息；
- 微信：扫码绑定微信机器人，使用腾讯 iLink 长轮询收发消息；
- 钉钉：扫码创建机器人，或使用已有 Client ID + Client Secret 绑定机器人，使用钉钉 Stream 长连接收消息，并通过 AI Card 流式显示 Harness 回答。
- 企业微信：使用企业微信 App 扫码创建智能机器人，或使用已有 Bot ID + Secret 绑定机器人，通过官方 WebSocket 长连接收消息，原生显示“正在思考中”、工具执行进度和流式回答。
- QQ：使用手机 QQ 扫码创建机器人，或使用已有 AppID + AppSecret 绑定机器人，通过 WebSocket 长连接收消息；私聊支持原生“正在输入”和流式回答，群聊在机器人被 @ 后回复。

其他 IM 平台可继续按同一渠道适配器结构接入。

## 安装

```sh
npx -y github:xmanrui/dsh-im install
```

重启 `dsh web`，然后打开「设置 → 插件 → IM机器人」。安装器会用 `dsh-im` 替换 profile 中直接安装的 `dsh-feishu`、`dsh-weixin` 和 `dsh-dingtalk`，但不删除任何渠道数据；原有渠道凭据和扫码绑定会继续使用。

飞书、QQ、钉钉和企业微信页面都提供两种入口：带二维码图标的蓝色「扫码接入机器人」按钮走平台官方扫码流程，右侧带钥匙图标的白色描边「手动接入」按钮连接已经创建的机器人应用。飞书和 QQ 分别填写 App ID + App Secret、AppID + AppSecret；钉钉填写官方 Client ID + Client Secret；企业微信填写官方 Bot ID + Secret。Secret 只提交给本机 Harness Host，并写入受保护的凭据存储；状态接口和机器人列表不会回传 Secret。

钉钉扫码接入时，请使用已加入企业/组织且有权创建机器人的钉钉账号扫描页面二维码，再在钉钉授权页点击「一键创建新机器人」。若提示“该账号还未加入组织”，请先创建组织或换用已加入组织的账号后重新扫码。插件不设置本机二次批准流程，钉钉中的机器人可见范围就是入站访问范围，请只开放给信任的组织、群或成员。

企业微信扫码接入时，请使用已加入企业且具有机器人创建或管理权限的企业微信账号，并在手机端确认创建智能机器人。扫码创建的是企业微信智能机器人，不是让插件直接登录个人微信账号。无论扫码还是凭据绑定，企业微信中的机器人可见范围就是入站访问范围，请只开放给信任的企业成员和群聊。

QQ 扫码接入使用腾讯 QQBot v2 官方流程。默认腾讯授权页会把接入方显示为“第三方机器人”；扫码成功后创建的是 QQ 开放平台机器人，并不是让插件直接控制个人 QQ 账号。扫码绑定只接受扫码者的消息；手动凭据无法识别扫码人，因此使用 QQ 开放平台中的机器人可见范围作为入站访问范围。

飞书扫码绑定会把扫码者作为允许使用者；手动凭据同样无法识别扫码人，因此使用飞书应用的可见范围作为入站访问范围。请在飞书开放平台中只向信任的租户、群或成员开放应用。

## 设计

- Harness 中只注册一个「IM机器人」设置页；
- 飞书、微信、钉钉、企业微信和 QQ 的 Host、客户端与运行时源码都在本仓库维护，不依赖外部独立渠道插件；
- 左侧使用渠道 Logo 切换微信、飞书、钉钉、企业微信和 QQ，不使用启用/停用开关；
- 五个渠道保持独立的 RPC、凭据、连接监督和会话映射；
- 浏览器只获得二维码和脱敏状态；手动输入的 Secret 仅单向提交给本机 Host，任何 RPC 响应都不会返回 App Secret、`bot_token`、钉钉 `client_secret`、企业微信 Secret、QQ `app_secret` 或原始用户标识。

## 本地开发

```sh
npm install
npm run check
node bin/dsh-im.mjs install --source .
```

`npm run check` 运行单元测试、构建 Host/Client 产物，并验证发布包不包含凭据或独立渠道设置页注册。

## English

Connect IM bots to DeepSeek Harness by scanning a QR code or entering existing application credentials. One plugin and one settings entry provide unified management for Feishu, WeChat, DingTalk, WeCom, and QQ bots.

> GitHub description: Connect IM bots to DeepSeek Harness by QR code or application credentials (supports Feishu, WeChat, DingTalk, WeCom, and QQ).

## Interface

![IM bot settings page](docs/images/imbot.png)

## Built-in channels

- 飞书：通过二维码创建机器人或使用App ID + App Secret绑定现有机器人，然后通过长连接发送和接收消息。
- 微信：通过扫描二维码绑定微信机器人，然后通过腾讯iLink长轮询发送和接收消息。
- 钉钉：通过二维码创建机器人或使用客户端 ID + 客户端密钥绑定现有机器人，通过钉钉流接收消息，并通过 AI 卡流式传输 Harness 回复。
- WeCom：通过二维码创建智能机器人或使用Bot ID + Secret绑定现有机器人，通过官方WebSocket连接接收消息，并原生显示思维状态、工具进度和流式回复。
- QQ：通过二维码创建机器人或使用 AppID + AppSecret 绑定现有机器人，通过 WebSocket 连接接收消息，使用本机打字指示器传输私人聊天回复，并在提及时分组回复。

可以通过相同的通道适配器结构添加其他 IM 平台。

## 安装

```sh
npx -y github:xmanrui/dsh-im install
```

重启`dsh web`，然后打开**设置→插件→IM Bot**。安装程序将配置文件中直接安装的 `dsh-feishu`、`dsh-weixin` 和 `dsh-dingtalk` 条目替换为 `dsh-im`，而不删除通道数据。

飞书、QQ、钉钉、微信各提供两个入口。蓝色**二维码访问**操作使用平台二维码流程；右侧带有键标记、概述的“手动访问”操作会连接现有的机器人应用程序。飞书和QQ分别使用App ID + App Secret和AppID + AppSecret，钉钉使用Client ID + Client Secret，微信使用Bot ID + Secret。秘密仅发送到本地 Harness Host 并通过其受保护的凭证提供者存储；状态响应和机器人列表永远不会返回它们。

对于钉钉二维码绑定，请使用属于企业或组织且可以创建机器人的帐号进行扫描，然后在授权页面选择“新建机器人”。如果钉钉报告该帐号未加入组织，请创建一个帐号或切换到已加入组织的帐号，然后重新扫描。没有第二个本地发件人批准流程：机器人的钉钉可见性是其入站访问范围，因此将其限制为受信任的组织、群组或成员。

对于WeCom二维码绑定，使用属于企业且可以创建或管理机器人的帐号进行扫描，然后在手机应用中确认创建智能机器人。这就创建了一个WeCom智能机器人；它不会将插件登录到个人微信帐户。对于 QR 和凭证绑定，将机器人的 WeCom 可见性限制为受信任的企业成员和群聊。

QQ二维码绑定采用腾讯官方QQBot v2流程。腾讯的默认授权页面将集成标记为第三方机器人。扫描创建QQ开放平台机器人；它不会让插件直接控制个人QQ帐户。 QR 绑定仅接受扫描仪的消息。手动凭证无法识别扫描器，因此僵尸程序的QQ开放平台可见性成为其入站访问范围。

飞书二维码绑定将扫描仪记录为允许的用户。手动凭证无法识别扫描仪，因此飞书应用程序的可见性成为其入站访问范围。将应用程序限制为受信任的租户、组或成员。

## 设计

- 在 Harness 中注册单个 **IM Bot** 设置页面。
- 在此存储库中维护飞书、微信、钉钉、微信、QQ 主机、客户端和运行时源，无需外部独立通道插件。
- 使用微信、飞书、钉钉、微信、QQ导航的频道标识，无需启用/禁用开关。
- 保持 RPC 端点、凭证、连接监督和会话映射按通道隔离。
- 仅向浏览器返回 QR 码和经过编辑的状态数据。手动输入的机密以一种方式传输到本地主机；没有 RPC 响应返回 App Secrets、`bot_token`、钉钉 `client_secret`、WeCom Secrets、QQ `app_secret` 或原始用户标识符。

## 本地开发

```sh
npm install
npm run check
node bin/dsh-im.mjs install --source .
```

`npm run check` 运行单元测试，构建主机和客户端工件，并验证已发布的包既不包含凭据也不包含独立通道设置页面注册。