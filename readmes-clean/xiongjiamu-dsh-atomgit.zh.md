# dsh-atomgit

[English](README.md) | 中文

AtomGit 插件 bundle,让 DeepSeek Harness(dsh)用户开箱即用地通过 AtomGit 托管代码。一个包装齐三层能力:

### 层 · 来源 · 在 dsh 里的形态
- **层**: 流程层 · **来源**: [atomgit-skills](https://gitcode.com/hust-open-atom-club/atomgit-skills) · **在 dsh 里的形态**: 六个内置技能,进入模型 `<available_skills>` 目录,可被 `skill` 工具加载
- **层**: 执行层 · **来源**: [atomgit-cli](https://gitcode.com/hust-open-atom-club/atomgit-cli)(`ag`) · **在 dsh 里的形态**: 模型经内置 bash 工具直接执行 `ag` 命令
- **层**: 交互层 · **来源**: AtomGit 平台托管的 MCP server(`https://api.gitcode.com/mcp-server/v1/mcp`) · **在 dsh 里的形态**: 原生工具 `mcp__gitcode__*`,经 `@deepseek-ai/dsh-mcp-client` 以 streamable-http 接入,无需本地起服务

内置技能(来自 atomgit-skills 上游,随包 vendored):`atomgit-plan-issues`、`atomgit-implement-issue`、`atomgit-review-pr`、`atomgit-merge-pr`、`atomgit-publish-cli-release`、`atomgit-mirror-to-github`。

## 安装

前置要求——**一步鉴权,三个模块通用**:

```sh
# 只需装好 ag 并登录一次:
# `ag auth login` 会把 AtomGit PAT 存到 ~/.config/ag-cli/token.json。
npm install -g @hust-open-atom-club/atomgit-cli
ag auth login
```

仅此而已。MCP 端点与技能都不需要再单独配置令牌。

## 统一鉴权

三个模块共用**同一个 AtomGit PAT**——与 `ag auth login` 获取的 OAuth 令牌是同一个东西:

### 模块 · 鉴权方式
- **模块**: `ag` CLI / 技能 · **鉴权方式**: 直接读取 `~/.config/ag-cli/token.json`
- **模块**: MCP 端点(`mcp__gitcode__*`) · **鉴权方式**: 插件的 `atomgitAuth` 服务从同一份 ag 凭据文件解析令牌,并以 `Authorization: Bearer ` 发送;无需用户额外设置

可选覆盖:想用别的令牌(例如在 GitCode「个人设置 → 访问令牌」手动创建的 PAT),在 dsh 运行目录的 `.env` 里设置 `GITCODE_TOKEN` 即可——ag 凭据文件缺失时插件会回退到它。

安装 bundle(在包含本目录的目录下执行):

```sh
dsh plugin --profile web add ./dsh-atomgit
# 或从远端:dsh plugin --profile web add github:you/dsh-atomgit#<sha>
dsh web
```

## 使用效果

启动后模型侧自动获得:

- `<available_skills>` 目录出现六个 `atomgit-*` 技能,按需用 `skill` 工具加载;技能内的 `references/`(如 `ag-commands.md`)由目录资源指引按需读取。
- 原生工具 `mcp__gitcode__*`(仓库/分支/Issue/PR/搜索),来自 AtomGit 平台托管的 MCP server——无需本地安装、Docker 或 Python。
- bash 里可执行 `ag`(`ag repo view`、`ag pr list`、`ag issue create` 等)。

典型工作流:让模型用 `atomgit-plan-issues` 规划 Issue → `atomgit-implement-issue` 实现并开 PR → `atomgit-review-pr` 审查 → 你显式授权后 `atomgit-merge-pr` 合并。

## 配置覆盖

patch 按行整体替换 `config`,用户在 profile `cordis.patch.yml` 或 `--patch` overlay 里按行 id 覆盖:

```yaml
# 完全禁用 MCP(只用技能 + ag):
- id: mcp-gitcode
  disabled: true

# 换一个端点(如自建 MCP server):
- id: mcp-gitcode
  inject: [atomgitAuth]
  config:
    serverName: gitcode
    transport: streamable-http
    url: https://your-host/mcp
    headers:
      Authorization: !!js '`Bearer ${ctx.atomgitAuth.token ?? ""}`'
```

## 技能同步

技能目录 `skills/` 从 atomgit-skills 上游按 tag 同步,保证"插件版本 ↔ 技能版本"可复现:

```sh
npm run sync-skills            # 同步 main
npm run sync-skills -- v1.2.3  # 同步某个 tag
```

## 许可

- 本 bundle 的插件代码与打包结构:MulanPSL-2.0。
- 内置技能来自 [atomgit-skills](https://gitcode.com/hust-open-atom-club/atomgit-skills),其许可证(MulanPSL-2.0)随技能复制于 `skills/LICENSE`。