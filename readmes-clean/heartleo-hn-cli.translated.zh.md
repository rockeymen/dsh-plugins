# 嗯

黑客新闻的终端客户端。

![演示](docs/demo.gif)

## 特点

- 📰 **故事浏览器** — 热门、新、最佳、询问 HN、通过选项卡切换显示 HN
- 💬 **评论线程** — 使用 `j/k` 导航、折叠/展开、延迟加载回复树
- 🌐 **翻译** — 翻译带有 `t` 的标题、带有 `T` 的所有可见标题或选定的评论
- 🔄 **软刷新** — 刷新故事或评论而无需重新启动
- 🎨 **主题** — hn、摩卡、德古拉、东京、nord、gruvbox
- ⚡ **渐进式加载** - 首先加载可见范围，滚动时获取更多内容

## 安装

**自制程序**（macOS / Linux）：

```bash
$ brew install heartleo/tap/hn
```

**winget**（Windows）：

```powershell
$ winget install heartleo.hn
```

**卷曲**（macOS / Linux）：

```bash
$ curl -fsSL https://raw.githubusercontent.com/heartleo/hn-cli/main/install.sh | sh
```

不需要 `sudo` — 二进制文件安装在您的主目录下。安装
目录是从第一个设置的目录中选择的：

### 来源·价值
- **来源**：`HN_INSTALL_DIR` · **值**：按原样使用
- **来源**：`XDG_BIN_HOME` · **值**：按原样使用
- **来源**：`XDG_DATA_HOME` · **值**：`$XDG_DATA_HOME/../bin`
- **来源**：*（默认）* · **值**：`$HOME/.local/bin`

要安装在其他地方：

```bash
$ curl -fsSL https://raw.githubusercontent.com/heartleo/hn-cli/main/install.sh | HN_INSTALL_DIR=~/bin sh
```

如果安装目录不在您的 `$PATH` 上，该脚本会发出警告，并打印
`export PATH=...` 行添加到您的 shell 配置文件中。

该脚本从不调用 `sudo`。要在系统范围内安装，请自行以 root 身份运行：

```bash
$ curl -fsSL https://raw.githubusercontent.com/heartleo/hn-cli/main/install.sh -o install.sh
$ sudo env HN_INSTALL_DIR=/usr/local/bin sh install.sh
```

**预构建的二进制文件** — 从 [GitHub 版本 ](https://github.com/heartleo/hn-cli/releases) 下载

**开始安装**（需要 Go 1.25+）：

```bash
$ go install github.com/heartleo/hn-cli/cmd/hn@latest
```

**从源代码构建：**

```bash
$ git clone https://github.com/heartleo/hn-cli
$ cd hn
$ go build -o hn ./cmd/hn
```

## Claude Code 插件

该存储库还提供了 [**hn**](plugins/hn)，一个 Claude Code 插件，为 Claude 带来了 Hacker News。

```
/plugin marketplace add heartleo/hn-cli
/plugin install hn@hn-cli
```

### 技能·它的作用
- **技能**：`hn-digest` · **它的作用**：扫描首页——今日主题、热点讨论、行业组合

那么就问：`what's on HN today`。用任何语言询问，摘要都会以该语言返回。详情请参阅[插件README](plugins/hn)。

该摘要还每天发布在 [hndigest.heartleo.dev](https://hndigest.heartleo.dev)]。

## DeepSeek Harness 插件

对于 [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/)]，有 [**hacker-news**](plugins/hacker-news)，一个简单的 ESM 插件，可以直接读取公共黑客新闻 API。它既不需要 HN API 密钥，也不需要本地终端客户端。

### 从 npm 安装

发布的包是[`dsh-hacker-news`](https://www.npmjs.com/package/dsh-hacker-news)。它也列在[awesome-dsh-插件社区注册表](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)中。 DSH 配置文件是 pnpm 工作空间根，因此保留 `-w` 标志：

```sh
dsh plugin --profile <name> add -w dsh-hacker-news
```

如果您的 npm 镜像尚未索引最新版本，请针对公共注册表运行安装：

```powershell
$env:npm_config_registry = 'https://registry.npmjs.org/'
dsh plugin --profile <name> add -w dsh-hacker-news
```

启动或重新启动相同的配置文件，然后验证组成的配置是否包含 `dsh-hacker-news`：

```sh
dsh --profile <name>
dsh --profile <name> --dump-config
```

### 从源安装

此表单遵循存储库的 `main` 分支，用于开发或尝试未发布的更改：

```sh
dsh plugin --profile <name> add -w github:heartleo/hn-cli#path:/plugins/hacker-news
```

安装后自然询问，例如：`what's popular on HN?`、`search HN for sqlite`、或`read HN item 49322107 and summarize the discussion`。

### 工具·它的作用
- **工具**：`hn_stories` · **它的作用**：排名提要 — 热门/新/最佳/询问/显示/工作
- **工具**：`hn_item` · **它的作用**：一个项目及其按阅读顺序的回复树
- **工具**：`hn_search` · **它的作用**：Algolia 搜索，按相关性或日期
- **工具**：`hn_user` · **它的作用**：Karma、帐户年龄、个人简介、提交计数

配置请参见【插件README](plugins/hacker-news)】。

## 快速入门

```bash
$ hn        # top stories
$ hn new    # new stories
$ hn best   # best stories
```

## 命令

### 浏览

![浏览演示](docs/demo-browse.gif)

打开交互式 TUI。默认为热门新闻；使用 `←/→` 切换选项卡。

```bash
$ hn        # top stories (default)
$ hn top
$ hn new
$ hn best
$ hn ask
$ hn show
```

### 评论

![评论演示](docs/demo-comments.gif)

在任何故事上按 `Enter` 打开其评论线程。

- 使用`↑/↓`或`k/j`导航
- 按 `Enter` 展开或折叠回复树
- 按`Space`折叠或展开所选评论
- 按 `C` / `E` 折叠或展开全部
- 按`r`跳转到根评论
- 按`R`软刷新
- 按 `Esc` 返回

### 翻译

通过任何 OpenAI 兼容的聊天完成 API 进行翻译。请参阅[配置](#translation-1) 以设置 API 密钥。

```
t   translate selected story title (toggle cached translation)
T   translate all visible titles in one batch request
t   translate selected comment (in comment view)
```

###主题

```bash
$ hn theme          # show current
$ hn theme nord     # set globally
```

可用：`hn`·`mocha`·`dracula`·`tokyo`·`nord`·`gruvbox`

## 按键

### 故事列表

### 关键·动作
- **关键**：`Enter` · **操作**：打开评论线程
- **密钥**：`o` · **操作**：在浏览器中打开
- **按键**：`t` · **操作**：翻译所选标题
- **按键**：`T` · **操作**：翻译所有可见标题
- **按键**：`←` / `→` · **操作**：切换选项卡
- **按键**：`r` · **操作**：刷新
- **按键**：`?` · **操作**：切换帮助
- **按键**：`q` / `Ctrl+C` · **操作**：退出

### 评论主题

### 关键·动作
- **关键**：`j` / `↓` · **操作**：下一条评论
- **关键**：`k` / `↑` · **操作**：之前的评论
- **按键**：`gg` · **操作**：返回顶部
- **关键**：`r` · **操作**：跳转到根评论
- **按键**：`Enter` · **操作**：展开/折叠回复
- **按键**：`Space` · **操作**：折叠/展开所选评论
- **按键**：`C` / `E` · **操作**：全部折叠/展开
- **按键**：`t` · **操作**：翻译所选评论
- **按键**：`R` · **操作**：软刷新
- **按键**：`o` · **操作**：在浏览器中打开故事
- **按键**：`Esc` · **操作**：返回列表
- **按键**：`?` · **操作**：切换帮助
- **按键**：`Q` / `Ctrl+C` · **操作**：退出

## 配置

`hn` 改为 `~/.config/hn/config.json`。工作目录中的`.env`文件也会自动加载；环境变量优先于配置文件。

### 翻译

### 变量·默认值·描述
- **变量**：`HN_TRANSLATE_API_URL` · **默认**：`https://api.openai.com/v1` · **描述**：API 基本 URL
- **变量**：`HN_TRANSLATE_API_KEY` · **默认**：— · **描述**：API 密钥
- **变量**：`HN_TRANSLATE_MODEL` · **默认**：`gpt-4o-mini` · **描述**：型号名称
- **变量**：`HN_TRANSLATE_LANG` · **默认**：`Chinese` · **描述**：目标语言

示例 `.env`：

```bash
HN_TRANSLATE_API_KEY=sk-...
HN_TRANSLATE_LANG=Chinese
```

### 主题

### 变量·描述
- **变量**：`HN_THEME` · **描述**：覆盖主题而不编辑配置

示例 `~/.config/hn/config.json`：

```json
{
  "theme": "mocha",
  "translate": {
    "api_url": "https://api.openai.com/v1",
    "api_key": "sk-...",
    "model": "gpt-4o-mini",
    "language": "Chinese"
  }
}
```