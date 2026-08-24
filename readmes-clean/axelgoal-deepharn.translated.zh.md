#Deepharn

** [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的桌面应用程序
在 macOS 上，专为非编程的一切而设计：** 写作、研究、
编排任务并保留它们产生的结果。

它不是主题或官方界面的包装：它是**不同的前端**
通过其 API 与线束对话，由线束本身提供服务并放入
一个本机窗口。

![Deepharn](docs/01-principal.png)

*三折叠栏：左边对话，中间聊天，右边
正确的是正在运行的内容、已产生的内容以及手头上的内容。*

## 它有什么作用

- **对话按“正在进行”/“今天”/“之前”分组**，并包含时间和标记。
- **控制室**包含正在运行的内容，**可交付成果**包含文件
  谈话产生的。
- **使用中**：代理看到哪些技能，启动了哪些子代理以及哪些插件
  他们已加载。
- **模型和推理工作选择器**，带有过滤器（OpenRouter
  提供一百多个型号）。
- **设置**带有插件安装程序和技能管理器，无需下载到终端。
- 删除对话和项目，并重命名它们。
- 三个折叠栏和“仅限聊天”模式。光明与黑暗。

代理的响应会在您键入时绘制，并且文本将呈现为
markdown：段落、项目符号、代码。

## 里面

### ·
- ![Models](docs/02-modelos.png) · **模型和努力。** 按提供商和过滤器分组，因为 OpenRouter 提供了一百多个。推理工作来自每个模型声明的内容。
- ![设置](docs/03-ajustes.png) · **设置。** 活动提供者、项目、技能（如果有拼写错误则发出警告）以及插件安装程序。无需前往航站楼。
- ![仅聊天](docs/04-solo-chat.png) · **仅聊天。** 一个按钮可折叠两栏并保留对话。

## 如何组装

三块，每块都有一个工作：

### 一块 · 它是什么
- **部分**：`app/` · **它是什么**：Swift + WKWebView 中的桌面 shell。他启动安全带，观察它，并在他离开时停止它。
- **部分**：`plugins/deepharn-front/` · **它是什么**：主机插件：为 `/deepharn` 中的前端提供服务，并添加自己的端点来安装插件和管理技能。
- **部分**：`plugins/deepharn-piel/` · **它是什么**：客户端插件：重写官方界面的颜色和字体标记。选修的。

前端是纯 HTML、CSS 和 JavaScript。无框架、无编译、无
依赖项：编辑并重新加载。

**为什么它是从线束本身提供服务：** 它的 API 比较每个的 `Host`
请求并拒绝来自另一个端口的内容。从外部为前端提供服务
它有效；从内部拨打 `/api` 是免费的。

＃＃ 安装

**您需要什么：** macOS 14+ (Apple Silicon)、Node 22+、pnpm、命令行
Xcode 工具和线束 (`npm i -g @deepseek-ai/dsh`)。如果您遗漏了什么，
安装程序会在触摸任何东西之前告诉您。

```bash
git clone https://github.com/AxelGoal/Deepharn.git
cd Deepharn
./instalar.sh
```

这将创建您自己的名为 `deepharn` 的配置文件 —**不会触及您已经使用的配置文件**—，安装
这两个插件，将它们安装在树中并在 `/Applications` 中编译应用程序。

然后，从 Launchpad 中，或者：

```bash
open -a Deepharn
```

一步一步亲手做

```bash
# Un perfil propio, copiado del que ya tienes
cp -R ~/.dsh/profiles/web ~/.dsh/profiles/deepharn

# Los plugins
dsh plugin --profile deepharn add ./plugins/deepharn-front
dsh plugin --profile deepharn add ./plugins/deepharn-piel
```

而他们的行列是`~/.dsh/profiles/deepharn/cordis.patch.yml`。 **小心他
包装器 `insert`**：带有 `id:` 的松散条目覆盖现有行
而不是添加一个新的。

```yaml
- insert:
    - id: deepharn-front
      name: deepharn-front
- insert:
    - id: deepharn-piel
      name: deepharn-piel
```

然后是应用程序：`cd app && ./construir.sh`

无需应用程序也可使用：`dsh --profile deepharn` 并打开
浏览器中的 `http://127.0.0.1:3081/deepharn/`。

### 卸载

```bash
rm -rf ~/.dsh/profiles/deepharn /Applications/Deepharn.app
```

仅此而已。您已经使用的个人资料保持不变，您的对话也保持不变：
他们住在`~/.dsh/sessions`，在剖面之外。

## 如何开始

打开应用程序是您唯一需要做的事情：

1. 检查端口 3081-3083，询问 **您自己的端点**，而不是
   仅当端口响应时 - 这样它就不会挂接到外国线束上。
2. 如果你找到了它，它就会粘住并且不会启动任何东西。当你关闭它时，该服务器
   还活着。
3.如果没有任何内容，启动：`dsh`已安装，npx缓存，或
   `npx -y @deepseek-ai/dsh`。
4. 如果失败，它会说明原因、显示日志并提议重试。
5. 离开时，仅在她启动安全带时才将其停止。

## 我们一路走来学到了什么

它位于 [AS-IS-DONE.md](COMO-ESTA-HECHO.md)：harness API，其方法
及其陷阱。如果您要构建类似的东西，就有地图。

## 小提琴

前端位于 `plugins/deepharn-front/web/`：三个文件，无构建。
使用 ⌘R 对其进行编辑和重新加载。如果触摸服务器一半（`lib/`），请重新启动服务器
带 ⇧⌘R 的安全带。

皮肤（颜色和字体）采用 `plugins/deepharn-piel/src/piel.css`；之后
编辑它，`node construir.mjs`重新组装它。

如果没有出现：线束在**启动时**组成它的树，因此
插件和新技能要求重新启动。

## 状态

它可以工作并且每天都在使用，但它还很年轻，下面的安全带也很旧
*开发者预览版*，因此它有时会破坏兼容性。

**缺少什么：** 通过 WebSocket 逐字流式传输（现在轮询），附上
文件，以及一个不通过菜单的重置按钮。

##许可证

麻省理工学院。