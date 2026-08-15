<sup>特别感谢：</sup>

    ![](https://raw.githubusercontent.com/warpdotdev/brand-assets/refs/heads/main/Github/Sponsor/Warp-Github-LG-03.png)

### 【Warp，开发者智能终端](https://go.warp.dev/picgo)
[适用于 MacOS、Linux 和 Windows](https://go.warp.dev/picgo)

#PicGo-Core

![picgo-core](https://cdn.jsdelivr.net/gh/Molunerfinn/test/picgo/picgo-core-fix.jpg)

一款图片上传工具。 CLI 和 API 都支持。它还支持插件系统，请查看[Awesome-PicGo](https://github.com/PicGo/Awesome-PicGo)]寻找强大的插件。

更多详情请参见PicGo主页](https://picgo.app/)。

**Typora 原生支持 PicGo-Core**。

## 安装

PicGo 需要 Node.js >= 20.19.0 或 >= 22.12.0。对于较旧的 PicGo 版本 (<= v1.5.x)，Node.js >= 16 就足够了。因为我们需要[ES模块支持](https://joyeecheung.github.io/blog/2025/12/30/require-esm-in-node-js-from-experiment-to-stability/)的稳定性。

### 全局安装

```bash
npm install picgo -g

# or

yarn global add picgo
```

### 本地安装

```bash
npm install picgo -D

# or

yarn add picgo -D
```

## 用法

### 在 CLI 中使用

> PicGo 使用 `SM.MS(S.EE)` 作为默认上传图片主机。

显示帮助：

```bash
$ picgo -h

  Usage: picgo [options] [command]

  Options:
    -v, --version                            output the version number
    -d, --debug                              debug mode
    -s, --silent                             silent mode
    -c, --config                       set config path
    -p, --proxy <url>                        set proxy for uploading
    -h, --help                               display help for command

  Commands:
    install|add [options]        install picgo plugin
    uninstall|rm                 uninstall picgo plugin
    update [options]             update picgo plugin
    set <module> [name] [configName]         configure config of picgo modules (uploader/transformer/plugin)
    upload|u [input...]                      upload, go go go
    use [module] [name] [configName]         use module (uploader/transformer/plugin) of picgo
    get                                       get current picgo module config (uploader/transformer/plugins)
    i18n [lang]                              change picgo language
    uploader                                 manage uploader configurations
    server [options]                         run PicGo as a standalone server
    login [token]                            login to cloud.picgo.app
    logout                                   logout from cloud.picgo.app
    cloud                                    manage PicGo Cloud
    help [command]                           display help for command
```

####从路径上传图片

```bash
picgo upload /xxx/xx/xx.jpg
```

#### 从剪贴板上传图片

> 剪贴板中的图片将转换为 `png`

```bash
picgo upload
```

感谢[vs-picgo](https://github.com/Spades-S/vs-picgo) && [Spades-S](https://github.com/Spades-S)]提供了从剪贴板上传图片的方法。

#### 作为服务器运行

```bash
picgo server -p 36677 -h 127.0.0.1
```

#### 登录[PicGo Cloud](https://cloud.picgo.app)

```bash
picgo login
# or
picgo login <token>
```

#### 退出[PicGo Cloud](https://cloud.picgo.app)

```bash
picgo logout
```

#### 检查 PicGo Cloud 登录状态

使用`picgo cloud auth status`检查当前PicGo Cloud登录状态，而不触发交互式登录。该检查是非阻塞的：当没有本地令牌时，它会立即返回，而不需要任何网络请求。

```bash
picgo cloud auth status

# machine-readable output
picgo cloud auth status --format json
```

该命令设置进程退出代码，以便可以在脚本中使用它：

### 状态 · 含义 · 退出代码
- **状态**：`logged_in` · **含义**：令牌有效 · **退出代码**：`0`
- **状态**：`logged_out` · **含义**：无本地令牌 · **退出代码**：`1`
- **状态**：`invalid` · **含义**：令牌存在，但被服务器拒绝 (401) · **退出代码**：`2`
- **状态**：`error` · **含义**：探测失败（网络/服务器错误） · **退出代码**：`3`

`--format json` 输出是单行，例如：

```json
{"status":"logged_in","loggedIn":true,"user":"someone","plan":1}
```

#### 检查当前模块配置

使用`picgo get`读取当前选择的picgo模块。每个子命令都支持 `--format pretty|json`（默认为 `pretty`）。

```bash
# current uploader type (resolved as picBed.uploader -> picBed.current -> picgo-cloud)
picgo get uploader

# current transformer (defaults to path)
picgo get transformer

# installed plugins with enabled/disabled state
picgo get plugins

# machine-readable output
picgo get uploader --format json
picgo get plugins --format json
```

在 `json` 模式下，每个命令打印单个可解析行，例如：

```json
{"uploader":"github"}
{"transformer":"path"}
{"plugins":[{"name":"picgo-plugin-xxx","enabled":true}]}
```

#### 管理上传器配置

从 v1.8.0 开始，PicGo-Core 支持每个上传器的多种配置。就像Electron版PicGo的配置一样。

您可以使用`picgo set uploader <type> [configName]`来配置不同的上传器配置。

并且您可以使用`picgo use uploader <type> [configName]`在不同的上传器配置之间切换。

例如：

```bash
picgo set uploader github Test

picgo use uploader github Test
```

更多详情可以使用`picgo uploader -h`查看上传者管理的帮助：

```bash
Usage: picgo uploader [options] [command]

Options:
  -h, --help                                display help for command

Commands:
  list [type]                               list uploader configurations
  rename <type> <oldName> <newName>         rename a config
  copy <type> <configName> <newConfigName>  copy a config (does not switch current uploader)
  rm <type> <configName>                    remove a config
```

#### 初始化 picgo 插件模板

注意：插件的模板初始值设定项已移至独立的 [picgo-init](https://github.com/PicGo/PicGo-Init) 包。

您可以使用以下命令来初始化 picgo 插件模板：

```bash
npx picgo-init plugin <your-plugin-folder>
```

### 在节点项目中使用

#### 常用JS

```js
const { PicGo } = require('picgo')
```

#### ES 模块

```js
import { PicGo } from 'picgo'
```

#### API使用示例

```js
const picgo = new PicGo()

// upload a picture from path
picgo.upload(['/xxx/xxx.jpg'])

// upload a picture from clipboard
picgo.upload()
```

## 文档

欲了解更多详细信息，您可以查看[文档](https://docs.picgo.app/core/)。