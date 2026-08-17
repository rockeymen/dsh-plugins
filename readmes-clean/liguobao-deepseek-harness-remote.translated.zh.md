# DeepSeek Harness 遥控器

## 连接一次。随时准备好。

从您的手机、平板电脑或任何浏览器继续 DeepSeek Harness 会话。

从您随身携带的任何设备返回同一个 Harness 会话。 Harness 继续在您的工作计算机上运行，​​并具有相同的工作区、工具和项目设置。远程只是进入该环境的另一个窗口。

> **开发者预览** — 安装时固定显式版本。

## 你可以做什么

- 关注活动会话并查看其最新进展
- 发送新指令或改变方向
- 回答问题并回复许可请求
- 从任何连接的计算机打开工作区
- 在设备之间移动而无需移动您的工作

可以在浏览器中以及通过另一台计算机上的 Harness 中的 **Remote** 工作区条目使用远程。

## 安装主机插件

在运行 Harness 和项目的计算机上安装插件。

在DSH桌面中，打开**扩展→管理插件…**并安装：

```text
github:liguobao/deepseek-harness-remote#v0.2.23
```

或者为 `web` 配置文件安装它：

```sh
dsh plugin --profile web add "github:liguobao/deepseek-harness-remote#v0.2.23"
```

重新启动 Harness，然后打开 **设置 → 插件 → 插件配置 → DeepSeek 远程连接**。

## 连接你的电脑

使用邀请码 [NRAE-NUUM-C9UY](https://dsh.r2049.cn/app/register?invite_code=NRAE-NUUM-C9UY) 创建帐户，然后：

1. 登录并生成一次性链接代码。
2. 在主机插件中输入代码。
3. 当计算机显示在线时，从远程打开它。

> **注意：** 稍后将提供自托管中继节点选项。

## 设计安全

- 主机仅进行出站连接。没有开放公共端口。
- 会话流量是端到端加密的。该服务中继密文而不存储会话明文或设备私钥。
- Remote 仅公开接口所需的 Harness 功能。它不提供 shell 或远程桌面。
- 文件夹浏览仅列出目录；它无法读取文件或更改文件系统。
- 删除设备会立即撤销其远程访问权限。

实现细节请参见【插件指南](packages/plugin/README.md)、【文档索引](docs/README.md)】和【远程协议](docs/protocol.md)。