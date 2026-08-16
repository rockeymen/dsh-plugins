#sai

sai 是一个围绕本地工作空间设计的 GPLv3 Android 编码代理。它的名字将人工智能与 sail 结合在一起：一个紧凑的代理，旨在通过手机推动工作，
与 Debian/PRoot 兼容的运行时、明确的工具批准以及自带的
模型 API 凭证。

## 当前实现（1.2.0 DSH 预览 6）

- 官方DeepSeek Harness是唯一的交互式Agent引擎。 APK 开始固定 DSH 0.1.0-rc.6
  在 app-private Debian/PRoot 内的离线 Node 24.19.0 上，并将其经过身份验证的 Web 客户端嵌入到
  撰写外壳。
- Android 项目、模型和遗留对话可在不暴露凭据的情况下进行迁移。 DSH 解决
  通过 Android Keystore 凭证插件引用提供程序，旧的 Kotlin 循环不再
  接收主要 UI、语音、桌面或诊断任务。
- 第一方功能作为单独版本的 DSH 捆绑包存在于 `dsh-plugins/` 中：UI、Android、
  语音、模型、请求守护、GitHub、市场、宠物、文物和遗产导入。第三方插件
  发现读取维护的[`awesome-dsh-plugin`](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
  目录，而 sai 仍然执行自己的捆绑包、路径、生命周期脚本和权限预检。
- 预安装了两个固定的社区优化预设，但从未在会话中强制安装：
  `Anchored Standard` 用于最小对齐第一圈锚定，`Router Standard` 用于
  任务感知规范/反应/弱路由（包括特定于 Flash 的弱角色）。两者都是可拆卸的
  并可从扩展中心重新安装；该套件的不受限制的运行时注入器未捆绑。
- DSH 本地来源受随机 HttpOnly 会话 cookie、经过身份验证的健康检查的保护
  以及列入许可名单的 Android 桥接器；没有公开通用的 JavaScript 接口。

- 适用于 Android 10 及更高版本的本机 Kotlin 和 Jetpack Compose UI。
- DSH 事件源会话，包括指导、批准、压缩和后台恢复。
- OpenAI 响应、OpenAI 兼容聊天完成、人类兼容、
  和 Gemini 协议适配器。
- 多项目和多会话工作区 UI、结构化事件渲染、
  可折叠编辑器、附件源选择、ZIP 项目导入、Git
  导入检查点、文件工具、补丁预览、命令风险分类、
  和可恢复的工作。
- Room v3 提供商配置文件，每个提供商有多个模型，加密的 API
  键、模型发现/手动模型、推理控制和任务级使用
  报告。 DeepSeek 价格和总计以人民币显示。
- 用于安装扩展、发现、MCP 的操作扩展中心，
  技能 ZIP/Git 导入、Hooks、插件清单、静态诊断、实时 MCP
  探针、内置建议、回滚元数据和安全禁用
  默认安装。
- DSH-本机仅附加事件、转向输入、上下文压缩、代码工具、
  Git 操作、浏览器功能和明确的语音请求。
- 按键通话输入具有发送/麦克风状态合并、向上取消、
  实时部分字幕，以及可选的、可独立卸载的语音包
  使用流式 Zipformer 加上 Paraformer 最终校正。语音通话模式支持短`speak`
  摘要和转向式中断。
- 具有过期 DOM 节点标识符的仅代理 WebView 环境，
  观察/点击/输入/选择/提交/导航/截图操作，无
  向网页公开的 JavaScript 接口。
- Tauri 2 Windows 伴侣，具有 QR 配对、固定证书 TLS
  WebSocket、X25519/HKDF/AES-GCM 应用程序加密、项目/会话列表、
  冲突安全文本编辑和基本代理对话。桌面请求
  无法代表手机批准危险操作。
- 适用于 ARM64 和 x86_64 的 ABI 匹配的 PRoot/加载器库，本机 `forkpty`
  桥和交互式终端表面。
- 离线捆绑 GitHub CLI 2.97.0 for ARM64/x86_64，支持浏览器设备登录
  以及可选的高级令牌条目。两条路径都将凭证迁移到
  Android Keystore，删除临时`gh`配置，仅注入`GH_TOKEN`
  进入单个受信任的子进程。
- 模型 API、GitHub、MCP/技能目录的共享请求保护层：
  有界并发、GitHub 突变序列化、`Retry-After` 处理、
  幂等请求的指数退避和主机冷却。
- `dsh-plugin/` 是一个可安装的 DeepSeek Harness 捆绑包，公开一个稳定的
  `sai_mobile` 桥接工具，同时将所有 Android 批准保留在手机上。
- 捆绑了基本 Debian 13 运行时、Git、GitHub CLI、Node 24 和固定 DSH

对于离线首先从 SHA-256 验证开始。可选的语言工具链
  和可独立卸载的语音包仍然是单独的下载。
- 运行时激活是原子的。之前验证的 DSH 闭合仍然可用
  从故障屏幕；回滚在应用程序重新启动时固定，直到用户
  显式恢复 APK 捆绑的运行时。

提供者工具、GUI、持久性、审批系统、本机 PRoot 运行时、
PTY 桥和 rootfs 安装程序一起构建为 ARM64 或 x86_64 APK。
可以通过固定的暂存或从源复制本机工件
工作流程记录在 [native/README.md](native/README.md)] 中。 1.2.0预览6 ARM64
build 旨在在 vivo X200s 级设备上进行就地验证，而无需清除应用程序数据。它
包括紧凑型两行 Composer、画布式 PTY 终端、单实例
任务宠物、设置搜索和完整的应用程序主题。

`desktop` 目录包含 Tauri 2 伴侣及其安全说明。
加密直播会话在0.2.0中实现。自动 mDNS 重新连接
和持久的 Windows 凭据管理器身份仍被跟踪为
下一个连接强化里程碑；桌面重新启动当前需要
新鲜的二维码扫描。

## 网站和下载

响应式产品网站位于 [`site/`](site/)，并由
GitHub 每次推送到 `main` 时都会进行寻呼。它介绍了 Android 应用程序和
Windows 伴侣，并根据最新的 GitHub 解析其下载按钮
运行时释放。

推送诸如 `v1.2.0-dsh-preview.2` 之类的版本标签会运行统一的发布工作流程。它
测试和打包 ARM64/x86_64 Android 构建，构建 Windows NSIS
安装程序，创建可选的 `sai-voice-pack-zh-en.apk`，生成
`SHA256SUMS.txt`、CycloneDX SBOM 和许可证通知，并发布所有输出
在一个版本中。两个特定于 ABI 的 DSH 运行时包与
分离了 Ed25519 签名，因此运行时和 Android shell 具有独立的
更新工件。

从预览版 6 开始，Android 应用程序每天检查一次 GitHub 版本，
可以下载正确的 ABI APK 本身。它验证 `SHA256SUMS.txt` 并要求
打开之前匹配当前安装的 sai 的 APK 签名证书
Android 的系统安装程序。更新永远不会静默安装。

## 构建

该项目固定 Android Gradle Plugin 9.2.0、Gradle 9.4.1、Kotlin 2.3.21、
编译 SDK 37，目标 SDK 36，最低 SDK 29。设置 `sdk.dir`
`local.properties`，然后运行`scripts/build.ps1`。

所有大型开发数据都从系统驱动器重定向：

- Android Studio：`D:\Code\Android Studio`
- Android SDK/NDK：`D:\Code\Android\Sdk`
- JDK 17：`D:\Code\Java\jdk-17.0.20+8`
- AVD 图像：`D:\Code\Android\Avd`
- Gradle 缓存和发行版：`D:\Code\GradleHome`
- Android Studio索引和插件：`D:\Code\Android\StudioData`

使用 `scripts/start-android-studio.ps1`，以便 IDE 也继承这些路径。

更多详细信息参见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 和
[文档/BUILDING.md](docs/BUILDING.md)。

## 安全边界

PRoot 提供 Linux 用户空间兼容性，而不是 Docker 级隔离。
不要执行不受信任的存储库或扩展。提供商秘密保留
Android Keystore 支持的加密存储，并且永远不会注入到 shell 中
默认环境。