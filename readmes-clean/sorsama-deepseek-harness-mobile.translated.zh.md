![DSH 手机 — 口袋里的 DeepSeek Harness](docs/images/banner.jpg)

# DSH 移动 — DeepSeek Harness 远程

  一款开源 Android 伴侣，可将您的 DeepSeek Harness 装进口袋。
  推动会议、审查计划和目标、回答批准和问题并获得通知
  当线束完成时——通过您的手机，通过您的本地网络。

DSH Mobile 是一款 **非官方配套应用程序**
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (MIT)，镜像其 Web GUI
线束自己的视觉语言中的功能对功能。仅限 Android，Kotlin + Jetpack Compose。

[**wiki**](https://github.com/sorsama/deepseek-harness-mobile/wiki) 是面向用户的指南：
[入门](https://github.com/sorsama/deepseek-harness-mobile/wiki/Getting-Started)，
[连接](https://github.com/sorsama/deepseek-harness-mobile/wiki/Connecting)，
[故障排除](https://github.com/sorsama/deepseek-harness-mobile/wiki/Troubleshooting)，
[特色旅游](https://github.com/sorsama/deepseek-harness-mobile/wiki/Feature-Tour) 和
[常见问题解答](https://github.com/sorsama/deepseek-harness-mobile/wiki/FAQ)。

## 截图

### 连接·聊天·轨迹
- **连接**： ![连接屏幕：具有实时可达性、发现、手动输入和自动连接切换功能的最新线束](docs/images/home.png) · **聊天**： ![聊天：带有每个工具图标、工具卡、目标底座和作曲家的流式回合](docs/images/chat.png) · **轨迹**：![轨迹：包含使用总量的每回合分类账](docs/images/trajectory.png)
- **连接**：最新的线束具有实时可达性、LAN 发现、手动 `host:port`、自动连接。 · **聊天**：流式回合、每个工具一个字形、可扩展工具卡、权限选择器。 · **轨迹**：与每回合分类账相同的会话以及使用总量。

### 会话详细信息·子代理
- **会话详细信息**： ![详细信息面板：上下文细分、目标、计划模式、作业、队列、子代理、主机信息](docs/images/session-info.png) · **子代理**： ![具有可连续子项的子代理目录](docs/images/subagent.png)
- **会话详细信息**：上下文细分、目标、计划模式、后台作业、排队轮次、主机信息、会话日志导出。 · **子代理**：子代理目录 - 打开孩子的记录，跟进或打断它。

＃＃ 特征

- **轻松连接** — 自动发现 Wi-Fi 上的线束（活动子网扫描 +
  准备状态 handshake），记住主机并在进入时探测它们的活性，支持
  手动 `host:port` 输入、同一设备设置的环回以及自动连接切换
  （上次使用/LAN/同一设备）。
- **Discord 式导航** — 从左边缘向右滑动以打开分组的工作区
  聊天列表，向左滑动关闭，从右边缘向左滑动进入会话详情面板。
- **完整的聊天体验** - 流式传输，带有推理披露、降价、
  终端/差异/读取/搜索/网络工具卡、队列停靠（编辑/删除/引导）、历史分页、
  图片附件。
- **斜线命令和技能** — 作曲家根据会话自己的内容判定 `/` 行
  命令目录并通过线束的命令网关运行它；目录中没有的任何内容
  声明作为提示发送，这就是调用技能的方式。
- **GUI 所做的一切** — 目标（阶段、回合、暂停/恢复/编辑）、计划模式 + 计划审查、
  权限批准、用户问题、待办事项停靠、子代理（目录、后续、中断）、
  后台作业、工作流运行、技能、模型选择、代理预设、会话搜索、
  轨迹账本、会话导出、消息反馈。
- **通知** — 回合完成、目标完成/被阻止、审核或问题等待着您；
  通过前台服务进行后台连接。
- **看起来像线束** — 确切的 DeepSeek Harness 设计标记（颜色、类型、半径、
  披露行、闪光、墨水按钮）以及浅色/深色/系统主题。
- **11 种语言** — 英语、中文、हिन्दी、西班牙语、法语、阿拉伯语、বাংলা、葡萄牙语、Русский、
  ไทย（RTL 意识）。

## 要求

- Android 8.0+ (minSdk 26)。
- 正在运行的[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
  （针对 `0.1.0-rc.5` 进行测试）。

## 快速开始

1.安装最新的APK
   [发布](https://github.com/sorsama/deepseek-harness-mobile/releases/latest)。
2. 在您的计算机上，使您的手机可以访问该线束：
   - **USB / 模拟器：** `dsh web`，然后 `adb reverse tcp:3080 tcp:3080` — 在应用程序中连接到
     `127.0.0.1:3080`。
   - **Wi-Fi：** 应用中描述的单文件 LAN 补丁
     [`harness/README.md`](harness/README.md)，重启`dsh web`，然后点击**扫描网络**
     在应用程序中。
3. 选择一个会话，进行聊天，并在安全带完成后收到通知。

如果连接尝试失败，应用程序会指出原因；维基百科的
[故障排除](https://github.com/sorsama/deepseek-harness-mobile/wiki/Troubleshooting)页面是
关键是那句话。

## 兼容性和安全性

- 请参阅 [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) 了解线束版本矩阵和
  仅环回表面。
- **首先阅读 [docs/SECURITY.md](docs/SECURITY.md)** — 该安全带没有身份验证；仅
  在受信任的网络上使用 LAN 模式。出于同样的原因，该应用程序在连接屏幕上也这么说。

## 建筑

```sh
./gradlew :app:assembleDebug      # debug APK
./gradlew :app:assembleRelease    # release APK (signed when keystore env is set)
```

发布的版本来自 git 标签：发布工作流程从以下位置导出 `DSH_VERSION_NAME`
标签名称，`versionCode` 是从中派生出来的。本地构建回退到字面值
`app/build.gradle.kts`。

请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)，了解针对真实线束、模块的开发循环
布局和发布工作流程。

## 存储库

### 路径·什么
- **路径**：`core/` · **内容**：纯 JVM 协议核心：有线 DTO、RPC 客户端、WebSocket 下行链路、重新连接循环、会话折叠、通知分类器
- **路径**：`app/` · **内容**：Android UI：屏幕、发现/连接、前台服务、通知、i18n
- **路径**：`mock-harness/` · **内容**：用于测试的harness `/api`服务器的Ktor模拟
- **路径**：`tools/capture/` · **内容**：将真实线束流量记录到一致性装置中
- **路径**：`harness/` · **内容**：配套补丁 + LAN 模式指南
- **路径**：`docs/` · **内容**：[架构](docs/ARCHITECTURE.md)，[协议说明](docs/PROTOCOL.md)，[兼容性](docs/COMPATIBILITY.md)，[安全性](docs/SECURITY.md)]