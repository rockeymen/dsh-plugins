# Browser Bridge

通过 WebSocket 把本地工具和真实浏览器连接起来的桥，不需要 CDP。

扩展安装在浏览器里，作为"手"；server 是本地的 WebSocket 枢纽；client 是发指令的入口（Rust CLI），也可通过 bridge-mcp 暴露给 Claude / Cursor 等 agent。

## 项目结构

## 快速开始

### 1. 启动 server

```sh
cd server
cargo run            # 默认监听 ws://127.0.0.1:9225
# 换端口：BRIDGE_PORT=9226 cargo run
```

### 2. 加载插件

```sh
cd extension
pnpm install
pnpm dev             # 会自动打开 Chrome 并加载开发版插件
```

也可以 `pnpm build` 后，在 `chrome://extensions` 打开"开发者模式"，加载 `extension/dist/chrome-mv3` 目录。

### 3. 使用 client

client 连接失败时会**自动拉起 bridge-server**（需要已构建的二进制，可用 `BRIDGE_SERVER_BIN` 指定路径），自动拉起的 server 空闲 120 秒自动退出；插件断线后按 500ms→5s 退避自动重连。

```sh
cd client
cargo run -- list-tabs
cargo run -- navigate https://example.com
cargo run -- click '#submit'
cargo run -- set_value '#username' alice
cargo run -- scrape 'div.card' --fields 'name:.name,price:.price,img:img@src'
cargo run -- querydomains 'browserbridge'
cargo run -- googlesearch 'Haze Seas'
cargo run -- redditsearch 'rust programming'
cargo run -- youtubesearch 'rust programming' --time week --sort popularity --max 10
cargo run -- youtubeinfo 'https://www.youtube.com/watch?v=rQ_J9WH6CGk'
cargo run -- youtuberinfo 'https://www.youtube.com/@xiaojunpodcast/videos'
cargo run -- youtuberinfo '@xiaojunpodcast' --max 20
cargo run -- googletrends 'ai image' --date 'today 1-m' --geo Worldwide
cargo run -- googletrends-compare 'ai image' 'GPTs' --date 'today 1-m'
cargo run -- get-page-markdown --url https://example.com
cargo run -- get-a11y-tree
```

### 指令速查表

### 指令 · 作用
- **指令**: `list-tabs` · **作用**: 列出所有标签页
- **指令**: `new-tab [url]` · **作用**: 新建标签页（可指定 URL）
- **指令**: `activate-tab --tab ` · **作用**: 切换标签页并聚焦窗口
- **指令**: `close-tab [--tab ]` · **作用**: 关闭标签页（默认当前激活页）
- **指令**: `close-auto-tabs` · **作用**: 关闭 bridge 自动打开的全部标签页（不碰手动开的）
- **指令**: `navigate <url>` · **作用**: 导航并等待页面加载完成
- **指令**: `click <target> [--new-tab]` · **作用**: 点击匹配定位的元素（锚点默认当前标签页打开）
- **指令**: `click-at <x> <y>` · **作用**: 按坐标点击
- **指令**: `press-key <key>` · **作用**: 模拟按键（支持修饰键、`--wait-load`）
- **指令**: `scroll --dx --dy` · **作用**: 滚动窗口或指定容器
- **指令**: `set-value <target> <value>` · **作用**: 设置 input/textarea/contenteditable 的值
- **指令**: `check <target>` · **作用**: 勾选/取消 checkbox、radio
- **指令**: `select-option <target> --text/--value/--option-index` · **作用**: 选中下拉项
- **指令**: `clear <target>` · **作用**: 清空输入类元素
- **指令**: `get-value <target>` · **作用**: 读取元素当前值
- **指令**: `scrape  --fields '...'` · **作用**: 按选择器提取结构化数据
- **指令**: `run-script '<js>'` · **作用**: 页面里执行任意 JS，返回 JSON
- **指令**: `get-page-content` · **作用**: 读取页面标题/URL/文本
- **指令**: `get-page-markdown [--url <url>] [--selector <css>] [--full]` · **作用**: 把页面内容转换成标准 Markdown（默认自动提取正文，去掉导航/页脚等噪音）
- **指令**: `get-a11y-tree [--include-hidden] [--max-nodes <n>]` · **作用**: 读取页面 a11y tree，可交互节点（按钮/链接/输入框等）带 `target` 可直接喂给 `click` / `set_value`
- **指令**: `googlesearch '<关键词>'` · **作用**: Google 搜索，输出 `{ tab_id, results }`
- **指令**: `redditsearch '<关键词>'` · **作用**: Reddit 搜索，输出 `{ tab_id, results }`
- **指令**: `youtubesearch '<关键词>' [--time] [--sort] [--max]` · **作用**: YouTube 搜索，支持上传日期 / 优先顺序筛选，最多返回 `--max` 条（默认 5），输出 `{ tab_id, results }`
- **指令**: `youtubeinfo '<视频URL或ID>'` · **作用**: 获取指定 YouTube 视频详情：字幕全文、URL、作者、时长、点赞/评论/订阅数，输出 `{ tab_id, video }`
- **指令**: `youtuberinfo '<频道URL或handle>' [--max]` · **作用**: 获取指定 YouTube 频道（youtuber）的视频列表：频道名、订阅数、视频名称/URL/观看数/时长/发布时间，最多返回 `--max` 条（默认 10），输出 `{ tab_id, channel, videos }`
- **指令**: `googletrends '<关键词>' [--date] [--geo]` · **作用**: Google Trends，输出 `{ trend[], top[], rising[] }`
- **指令**: `googletrends-compare <词1> <词2>... [--date] [--geo]` · **作用**: Google Trends 多词对比，输出 `{ series[] }`
- **指令**: `querydomains '<关键词>' [--tlds 'com,ai,xyz']` · **作用**: Query.Domains 批量查域名注册情况与价格，输出 `{ results[] }`（每项含 domain / tld / status / available / price / badges）

多数指令支持 `--tab ` 指定标签页，默认操作当前激活页。

**标签页管理**：`click` 点击锚点链接默认在当前标签页打开（自动覆盖 `target="_blank"`），需要新开时用 `--new-tab`（由扩展创建标签页，响应会返回新标签页的 `tab_id`，便于链式操作）。`new-tab` 指令和 `click --new-tab` 打开的标签页都会被扩展记录，流程结束后可用 `close-auto-tabs` 一键清理，不会误关你手动打开的标签页。

### close-auto-tabs

清理"自动打开的标签页"，需要**单独执行**（CLI 手动调用，或 MCP 流程在收尾时调用一次），不会误关手动打开的标签页。支持**多 agent 隔离**：

- **MCP（`close_auto_tabs` 工具）**：每个 MCP 进程启动时生成独立身份（`mcp--<nanos>`），只清理**本进程创建**的标签页，不会误关其他 agent 正在用的标签页；任务结束后可再调 `close_agent_window` 关闭自己的专用窗口（连同窗口内标签页一并释放）
- **CLI（`close-auto-tabs`）**：作为人工管理入口，清理全部自动标签页（不管是谁创建的）

**会被清理的**：`new-tab` 指令和 `click --new-tab` 创建的标签页（扩展记录在 `chrome.storage.session`，service worker 重启不丢）。例如 `googletrends` 每次查询都会新开一个标签页，跑完后清理效果最明显：

```sh
cargo run -- googletrends 'ai image'
cargo run -- close-auto-tabs   # 关闭刚才 googletrends 开的标签页
```

**不会被清理的**：手动开的标签页（如 Sitemap Monitor）、以及 `navigate` / `googlesearch` / `redditsearch` 复用的当前标签页（这些不新开 tab，属于"工作标签页"，留着是正常的）。

### get-page-markdown

把页面内容转换成标准 Markdown，输出 `{ tab_id, title, url, markdown }`。转换在页面内直接遍历渲染后的 DOM，SPA 动态渲染的内容也会包含；自动跳过脚本、隐藏元素与表单控件，链接/图片转成绝对 URL。转换核心基于开源 [Turndown](https://github.com/mixmark-io/turndown) + [@joplin/turndown-plugin-gfm](https://github.com/laurent22/joplin/tree/dev/packages/turndown-plugin-gfm)（GFM 表格 / 删除线 / 任务列表），正文提取用 [@mozilla/readability](https://github.com/mozilla/readability)（Firefox 阅读模式同款）。

```sh
cargo run -- get-page-markdown                                  # 当前标签页（自动提取正文）
cargo run -- get-page-markdown --url https://example.com/docs   # 先导航再转换
cargo run -- get-page-markdown --selector article               # 只转换 article 容器
cargo run -- get-page-markdown --full                           # 跳过提取，转换整页
cargo run -- get-page-markdown --selector '#content' --tab 7    # 指定标签页 + 指定容器
```

- `--url`：可选，先导航到该 URL 并等待加载完成，再转换。
- 默认行为：用 Readability 自动提取主内容（去掉导航 / 页脚 / 相关文章等噪音），提取不到或内容过少时退回整页转换。
- `--selector`：可选，只转换匹配该 CSS 选择器的容器（如 `article` / `#content`），优先级最高。
- `--full`：可选，跳过正文自动提取，转换整个页面。

### get-a11y-tree

读取页面 a11y tree（无障碍树），返回 `{ tab_id, title, url, count, nodes[] }`。适合需要与页面交互（点击 / 填表 / 选择 / 勾选）前先了解页面结构、找出可交互元素的场景——比 `get-page-content` 的纯文本更能回答"页面上有什么按钮、输入框、下拉框"：

```sh
cargo run -- get-a11y-tree
cargo run -- get-a11y-tree --max-nodes 1000   # 大页面放宽上限
cargo run -- get-a11y-tree --include-hidden    # 连隐藏元素一起返回
```

`nodes` 是扁平节点列表，每项含 `role`（无障碍角色）/ `name`（可访问名称）/ `value`（当前值）/ `states`（enabled / disabled / checked / expanded 等）/ `depth`（DOM 深度）/ `tag`；可交互节点额外带 `target`，可直接喂给 `click` / `set_value` / `check` / `select_option` / `clear` / `get_value`：

```sh
cargo run -- click '#submit'              # target 直接可用
```

- `--include-hidden`：可选，默认只返回可见元素；开启后包含 `hidden` / `display:none` / `visibility:hidden` / `aria-hidden` 的元素。
- `--max-nodes`：可选，最多返回节点数（默认 500，范围 10-5000），防止大页面输出过大。
- 角色与名称优先用 Chrome 的 `computedRole` / `computedName`（Chrome 135+），低版本自动回退到标签/属性推断；只遍历 light DOM，不穿透 iframe 与 shadow DOM（与元素定位行为一致）。

### googlesearch

Google 搜索专用快捷指令，输出 `{ "tab_id": ..., "results": [...] }`，`tab_id` 是搜索所在标签页（供后续指令链式操作），`results` 每项含 `title` / `description` / `url` / `target`：

```sh
cargo run -- googlesearch 'Haze Seas'
```

`target` 是可直接喂给 `click` 的元素定位（`{ by, value, index }`），方便后续点击某个结果。实现是 client 侧的"站点配方"：用通用原语 `navigate` + `scrape` 编排，选择器作为常量集中在 client 里（`#rso > div` 容器、`data-sncf='1'` 描述等），扩展与协议保持通用。

### querydomains

Query.Domains 域名批量查询，按关键词同时检查多个 TLD 的注册情况与注册价格，输出 `{ tab_id, query, tlds, complete, results[] }`：

```sh
cargo run -- querydomains 'browserbridge'
cargo run -- querydomains 'browserbridge' --tlds 'dev,cloud,blog'   # 自定义 TLD（默认 14 个，最多 20 个）
```

`results` 每项含 `domain` / `tld` / `status`（`available` / `unavailable` / `uncertain`）/ `available`（布尔）/ `price`（可用时的注册价，如 `3 USD`，不可用时为 `null`）/ `badges`（原始徽标：价格、注册年份、`29 days ago` 等）。实现是导航到首页 → 每次都打开 TLD 自定义模态框显式写入后缀（站点会持久化自定义列表，不重置就不是默认 14 个）→ 输入关键词回车 → 用 `run_script` 等到批量检查流（`/api/upstream/check` 的 resource entry 只在请求完成后出现）真正结束后逐行提取（圆点颜色判状态、徽标容器取价格），选择器集中在 `bridge-core/src/recipes/querydomains.rs`。个别 TLD 可能没有价格徽标（上游未返回定价），此时 `price` 为 `null`，属站点数据问题而非超时。

### redditsearch

Reddit 搜索专用快捷指令，返回 `{ tab_id, results[] }`，每项含 `title` / `description` / `published`（相对时间，如 `1mo ago`）/ `published_at`（ISO 时间戳）/ `votes`（整数）/ `comments`（整数）/ `url` / `target`：

```sh
cargo run -- redditsearch 'rust programming'
```

结果页有两种渲染形态：`search-post-with-content-preview`（带正文预览）与 `search-sdui-post`（只有标题），配方同时收取；描述取自帖子正文预览，`search-sdui-post` 形态没有预览时为 `null`。Reddit 首页的搜索框藏在两层 shadow DOM 里，通用定位指令够不到，但配方直接导航到 `/search/?q=`，不依赖首页交互。

### youtubesearch

YouTube 搜索专用快捷指令，返回 `{ tab_id, results[] }`，每项含 `title` / `channel` / `views` / `published` / `duration` / `url` / `target`（`target` 可直接喂给 `click` 打开视频）：

```sh
cargo run -- youtubesearch 'rust programming'
cargo run -- youtubesearch 'rust programming' --time week        # 本周上传
cargo run -- youtubesearch 'rust programming' --sort popularity  # 热门程度优先
cargo run -- youtubesearch 'rust programming' --time month --sort popularity
cargo run -- youtubesearch 'rust programming' --time week --max 10   # 最多返回 10 条
```

- `--time`：上传日期筛选，`any`（默认）/ `today` / `week` / `month` / `year`
- `--sort`：优先顺序，`relevance`（默认）/ `popularity`（热门程度）
- `--max`：最多返回多少条结果（默认 5，至少 1）
- 日期与排序可组合（如 `--time mont