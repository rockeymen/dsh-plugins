![dsh-reef](assets/icons/readme/icon-light.png)
  

# dsh-reef

  DeepSeek Harness 全家桶:浏览器自动化 · MCP Server · GitHub/GitLab 集成 · 原生嵌入面板

dsh-reef 是一个 DSH 插件 bundle,一次安装提供五个模块:

### 模块 · 做什么 · 入口
- **模块**: 🐋 **原生面板** · **做什么**: 注入 DSH 界面右下角:模块状态、浏览器实时画面、GitHub 事件看板、五模块设置区 · **入口**: 自动注入,无需配置
- **模块**: 🧭 **浏览器自动化** · **做什么**: 共享 Playwright 浏览器:多标签、多 profile、下载/上传、Cookie、表单回放,21 个 `browser_*` 工具 · **入口**: `browser_*` 工具
- **模块**: 🔌 **MCP Server** · **做什么**: 把 DSH 的会话与 agent 反向暴露给任何 MCP 客户端(Streamable HTTP + OAuth) · **入口**: `http://127.0.0.1:3080/reef/mcp`
- **模块**: 🐙 **GitHub 集成** · **做什么**: 4 个只读工具 + webhook 自动 PR 评审 + issue 自动修复闭环 + 事件看板 · **入口**: `github_*` 工具 + webhook
- **模块**: 🦊 **GitLab 集成** · **做什么**: 3 个只读工具 + webhook 自动 MR 评审 · **入口**: `gitlab_*` 工具 + webhook

设计原则:**能做的一次性操作交给 agent 用 bash 完成(如 GitHub 写操作配 `gh` CLI),插件只做 bash 做不到的常驻自动化与集成**。唯一第三方运行时依赖是 `playwright-core`(复用系统已装的 Edge/Chrome,无需下载 Chromium),不依赖任何 `@deepseek-ai` 运行时包。

## 安装

```sh
dsh plugin --profile web add dsh-reef
```

重启 DSH 生效。不需要某个模块?在 `$DSH_HOME/profiles/web/cordis.patch.yml` 里删掉对应行
(`reef-browser` / `reef-mcp` / `reef-github` / `reef-gitlab` / `reef-console`)或给对应行加
`config: { enabled: false }`。

## 🐋 原生嵌入面板

安装后自动注入 DSH 界面(基于官方 `--dsw-alias-*` 设计变量,自适应亮/暗主题,零 DOM 依赖):

- **悬浮按钮**:右下角圆形按钮显示鲸鱼图标——透明底标志,跟随 DSH 主题自动切换
  (暗色主题 → 白色鲸鱼,亮色主题 → 墨黑鲸鱼);
- **状态行**:浏览器(开关/标签数/当前 URL)、MCP(在线状态)、GitHub(webhook 在线 + 事件数);
- **实时画面**:浏览器打开时显示缩略图,点击弹出大屏模态框——2 秒轮询实时画面,
  下方列出**访问历史**(最近 50 条,按 profile 隔离,点击可在新标签打开);
- **GitHub 事件看板**:最近 3 条 webhook 事件(时间/事件/仓库/编号/处理结果);
- **⚙ 设置区**:五个模块的配置都可在面板里修改,详见 [配置](#-配置)。

## 🧭 浏览器自动化

给 agent 一个共享浏览器会话(**多标签页**,默认 headless,`channel: auto` 自动探测
msedge → chrome → chromium,也可 `executablePath` 指定):

### 工具 · 说明
- **工具**: `browser_open` · **说明**: 打开 URL
- **工具**: `browser_tabs` · **说明**: 标签管理:list / new / switch / close(按 id 或 index)
- **工具**: `browser_snapshot` · **说明**: 读取页面文本/链接/输入框(纯文本模型"看"网页的核心)
- **工具**: `browser_elements` · **说明**: 可交互元素结构化清单(input/button/select/链接 + 现成 CSS 选择器)
- **工具**: `browser_click` / `browser_type` / `browser_press` · **说明**: 点击 / 输入(可清空、可回车提交)/ 按键
- **工具**: `browser_eval` · **说明**: 在页面上下文执行 JS(结果自动净化成 lossless JSON)
- **工具**: `browser_screenshot` · **说明**: 截图存为 PNG(自动清理,见下)
- **工具**: `browser_wait` / `browser_back` / `browser_reload` · **说明**: 等待 / 后退 / 刷新
- **工具**: `browser_status` / `browser_close` · **说明**: 状态 / 关闭会话
- **工具**: `browser_download` / `browser_upload` · **说明**: 下载(保存到工作区)/ 上传本地文件
- **工具**: `browser_cookies` · **说明**: Cookie 管理(list / set / clear,登录态处理)
- **工具**: `browser_form` / `browser_form_save` / `browser_forms` · **说明**: 批量填表 / 保存回放 / 管理已存表单
- **工具**: `browser_profile` · **说明**: 多配置文件:work/personal 等独立会话与登录态(userDataDir 持久化)

**截图自动清理**:`browser_screenshot` 保存的 `.png` 自动修剪——每次截图后即时清理 +
每小时定时清扫;默认保留最近 7 天、最多 200 张(`screenshotMaxAgeDays` /
`screenshotMaxCount`,设为 0 关闭对应规则),只清理截图目录直属文件。

> 首次调用浏览器工具时自动启动浏览器;启动失败会提示安装 Chromium
> (`npx playwright install chromium`)或配置 `executablePath`。

## 🔌 MCP Server

把 DSH 变成一台 MCP 服务器。任何支持 Streamable HTTP 的 MCP 客户端都能接:

```json
{
  "mcpServers": {
    "dsh": { "url": "http://127.0.0.1:3080/reef/mcp" }
  }
}
```

**5 个工具**:`dsh_list_sessions`(列出本机会话)、`dsh_read_session`(读事件摘要)、
`dsh_search_sessions`(全文搜索)、`dsh_run_agent`(用默认模型跑一次性 agent,
长任务流式输出 + 进度通知)、`dsh_agents_status`(当前运行中的 agent)。

**鉴权**(三选一或并存):

- **静态 Bearer token**:面板 ⚙ → MCP 模块直接填 token,保存即时生效;客户端请求带
  `Authorization: Bearer <token>`;
- **环境变量引用**:`authTokenEnv` 指向环境变量名;
- **OAuth 2.0 client_credentials**:`oauthEnabled: true` + `MCP_CLIENT_ID` /
  `MCP_CLIENT_SECRET`,token 端点 `/reef/mcp/oauth/token`,RFC 8414 发现端点
  `/.well-known/oauth-authorization-server`。

## 🐙 GitHub 集成

**只读工具 × 4**(公共仓库无需 token,匿名 60 次/小时;配置 `GITHUB_TOKEN` 后
无此限制且可访问私有仓库):

### 工具 · 说明
- **工具**: `github_repo` · **说明**: 仓库元信息(星标/fork/issues/默认分支)
- **工具**: `github_issues` · **说明**: issue 列表(state/limit)
- **工具**: `github_pulls` · **说明**: PR 列表(state/limit)
- **工具**: `github_pr` · **说明**: PR 详情(可带文件 diff)

> **写操作**让 agent 用 bash 跑 `gh` CLI(优先,UTF-8 安全)或 `curl` +
> `GITHUB_TOKEN` 完成,与工具层功能等价且更灵活。注意:Windows PowerShell 发
> 中文 JSON body 必须用 `[System.Text.Encoding]::UTF8.GetBytes()` 传字节流,
> 否则会按 ISO-8859-1 编码变乱码;发布后回读校验。

**Webhook 自动 PR 评审**:仓库 Settings → Webhooks 添加
`http://<机器>:3080/reef/github/webhook`(Content type: application/json,
Secret 与 `GITHUB_WEBHOOK_SECRET` 一致,事件勾选 Pull requests)。PR 打开/更新时
自动拉取 diff → 调用评审模型 → 以 COMMENT 评审提交。同一 PR 同一 head commit
只评审一次(`reviewDedupe`,默认开启)。评审模型默认用 DSH 默认模型,可在面板
设置区指定 provider/model。

**Issue 自动修复闭环**:配置 `autoFixRepos`(仓库 → 本地路径映射)后,新 issue
自动触发一个 DSH agent 在本地仓库修复:fetch → 建 `fix/issue-N` 分支 → 修复 +
测试 → push → 自动开 PR。`autoFixLabels` 可限定只处理带特定标签的 issue。

**事件看板**:面板 GitHub 行实时显示最近 webhook 事件,数据端点
`GET /reef/github/events`。

## 🦊 GitLab 集成

**只读工具 × 3**(需要 `GITLAB_TOKEN`):

### 工具 · 说明
- **工具**: `gitlab_project` · **说明**: 项目信息(星标/fork/issues/默认分支)
- **工具**: `gitlab_issues` · **说明**: issue 列表(state/limit)
- **工具**: `gitlab_mr_list` · **说明**: MR 列表(state/limit,含来源/目标分支)

> 写操作(建 issue/MR、评论)用 bash 跑 `glab` CLI 或 `curl` + `GITLAB_TOKEN`。

**Webhook 自动 MR 评审**:仓库 Settings → Webhooks 添加
`http://<机器>:3080/reef/gitlab/webhook`(Secret Token 与 `GITLAB_WEBHOOK_SECRET`
一致,事件勾选 Merge Request)。MR 打开/更新时自动评审并以 note 发布(带 🤖 前缀)。
自建 GitLab 实例:改 `apiBase`(如 `https://gitlab.example.com/api/v4`)。

## ⚙ 配置

三个层级:插件内置默认(cordis.patch.yml)→ 面板设置区(运行时)→ 用户
profile 的 cordis.patch.yml(启动时覆盖)。

### 1. 面板设置区(推荐日常使用)

DSH 界面右下角 ⚙,五个模块的配置全在面板里:

- **凭据类**(GitHub/GitLab token、webhook 密钥、MCP 访问 token):优先写入 DSH
  凭据库(`$DSH_HOME/.credentials.yaml`,0600),部署未挂载凭据服务时回退到插件
  自有存储(`$DSH_HOME/.dsh-reef/tokens.json`,0600)。凭据值永不回传页面;
  环境变量已提供时输入框自动禁用(环境变量优先级更高)。
- **普通配置**(headless、浏览器通道、截图目录/保留策略、操作超时、评审模型、
  自动评审事件等):写入 `$DSH_HOME/.dsh-reef/settings.json`(0600,字段白名单
  校验),使用时点读取**即时生效**;输入框留空 = 恢复默认。
- **路径类**(标 ⟳):liveViewPath、webhookPath、MCP path、面板基路径——路由
  注册时生效,**改动需重启 DSH**。
- 每个模块标题栏右侧有**保存**按钮:有未保存改动时变绿高亮,保存后熄灭。

### 2. cordis.patch.yml(启动配置)

```yaml
# $DSH_HOME/profiles/web/cordis.patch.yml
- insert:
    - id: reef-browser
      name: dsh-reef/browser
      config:
        channel: auto        # auto | msedge | chrome | chromium | ""(playwright 默认)
        executablePath: ""   # 显式指定浏览器可执行文件(优先于 channel)
        headless: true
        userDataDir: ""      # 设置后登录态跨 DSH 重启保留
        screenshotDir: .dsh-reef/screenshots
        screenshotMaxAgeDays: 7   # 截图保留天数(0 = 不按时间清理)
        screenshotMaxCount: 200   # 截图保留数量上限(0 = 不按数量清理)
        downloadDir: .dsh-reef/downloads
        liveViewPath: /reef/browser
        maxTextChars: 20000
        maxLinks: 50
        timeoutMs: 30000

    - id: reef-mcp
      name: dsh-reef/mcp
      config:
        path: /reef/mcp
        authTokenEnv: ""            # 静态 Bearer token 环境变量名
        oauthEnabled: false
        oauthClientIdEnv: MCP_CLIENT_ID
        oauthClientSecretEnv: MCP_CLIENT_SECRET
        runAgentTimeoutMs: 300000
        runAgentMaxOutputChars: 120000
        listSessionsLimit: 50

    - id: reef-github
      name: dsh-reef/github
      config:
        tokenEnv: GITHUB_TOKEN
        apiBase: https://api.github.com
        webhookPath: /reef/github/webhook
        webhookSecretEnv: GITHUB_WEBHOOK_SECRET
        reviewModel: {}             # { provider, model },空则用默认模型
        reviewMaxDiffChars: 60000
        autoReviewEvents: [opened, synchronize, reopened]
        reviewDedupe: true          # 同一 PR 同一 head sha 只评审一次
        autoFixRepos: {}            # 例: { "owner/repo": "C:/path/to/repo" }
        autoFixLabels: []           # 非空时只处理带这些标签之一的 issue
        autoFixTimeoutMs: 600000

    - id: reef-console
      name: dsh-reef/console
      config:
        path: /reef                 # 面板/embed 基路径

    - id: reef-gitlab
      name: dsh-reef/gitlab
      config:
        tokenEnv: GITLAB_TOKEN
        apiBase: https://gitlab.com/api/v4
        webhookPath: /reef/gitlab/webhook
        webhookSecretEnv: GITLAB_WEBHOOK_SECRET
        reviewModel: {}
        reviewMaxDiffChars: 60000
        autoReviewEvents: [open, update, reopen]
```

## 开发

```sh
npm install          # 安装开发依赖
npm test             # 单元测试(vitest)
npm run verify       # typecheck + test + build
node test/browser-launch.mjs   # 验证本机浏览器通道可启动
```

本地热加载调试(无需安装到 profile):

```sh
dsh --profile web --patch ./e2e.patch.yml --port 3111
```