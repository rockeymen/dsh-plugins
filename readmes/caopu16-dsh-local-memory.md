# dsh-local-memory

DSH（DeepSeek Harness）本地跨会话记忆插件：捕获每轮对话摘要、注入最近几天记忆，并提供 `memory_search` 工具按需检索全部历史记忆。

纯 JS / 纯文本实现，零 native 依赖。不依赖 memsearch CLI / pymilvus / numpy，因此不受本机 CPU 达不到 x86-64-v2 基线的影响。

## 功能

| 能力 | 说明 |
| --- | --- |
| **capture** | 每轮 `turn/end` 后把用户与助手对话摘要成 markdown bullet，追加到 `<project>/.memsearch/memory/YYYY-MM-DD.md` |
| **inject** | 每轮第 1 步自动注入最近 `injectDays` 天（默认 2 天）的记忆快照 |
| **memory_search** | 纯 JS 关键词匹配，翻**全部**日文件（不止最近 2 天），供模型主动捞更早记忆 |
| **兼容 opencode** | 与 opencode memsearch 插件共用 `.memsearch/memory/` 目录和锚点格式，互读互不覆盖 |


## 安装

### 官方方式（推荐）

项目声明了 DSH bundle（`dsh.bundle.patch`），可以通过 DSH 官方插件命令安装：

```bash
# 已安装 dsh CLI 时
dsh plugin --profile web add github:caopu16/dsh-local-memory

# 从 deepseek-harness 源码运行时
cd /path/to/deepseek-harness
pnpm dsh plugin --profile web add github:caopu16/dsh-local-memory
```

`lib/` 构建产物已提交，因此 git 源码安装不需要运行 `prepare` 构建脚本，也不会触发 pnpm ≥10 的 `allowBuilds` 拦截。

### 本地开发安装（备选）

```bash
cd ~/dsh-local-memory
bash scripts/install.sh
```

安装脚本会：

1. 在项目 `node_modules/@deepseek-ai/` 下创建 `dsh-tools` 和 `dsh-llm` 的本地软链（指向 `~/deepseek-harness` 里的包），让独立项目也能解析 DSH 同款模块。
2. 修改 `~/.dsh/profiles/web/cordis.patch.yml`，把 `local-memory` 插件路径指向 `~/dsh-local-memory/src/index.mjs`。

安装完成后**重启 DSH 并新开一个会话**，`memory_search` 工具才会出现在新会话里；已打开的会话不会自动获得新工具。

## 配置

官方安装后，插件由 bundle 自带的 `cordis.patch.yml` 挂载，行名为包名 `dsh-local-memory`。要覆盖配置，在 `~/.dsh/profiles/web/cordis.patch.yml` 中 patch 同一行：

```yaml
- id: local-memory
  name: 'dsh-local-memory'
  config:
    injectDays: 3
    searchMaxResults: 10
    provider: ''
    model: ''
```

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `captureEnabled` | `true` | 是否捕获新对话 |
| `injectEnabled` | `true` | 是否注入最近记忆 |
| `searchEnabled` | `true` | 是否注册 `memory_search` 工具 |
| `summarizeEnabled` | `true` | 是否用 LLM 摘要；关掉则写原文 |
| `injectDays` | `2` | 注入时回看几个日文件 |
| `injectMaxLinesPerFile` | `40` | 每个日文件最多注入多少行 |
| `captureMaxChars` | `24000` | 单轮原文送摘要器的字符上限 |
| `summarizeMaxTokens` | `1200` | 摘要最大 token |
| `summarizeTimeoutMs` | `120000` | 摘要超时 |
| `minPromptLength` | `8` | 用户消息短于此长度不捕获 |
| `searchMaxResults` | `20` | `memory_search` 单次最多返回几个轮次块 |
| `searchMaxLinesPerResult` | `12` | 每个轮次块最多返回几行正文 |
| `provider` / `model` | 空 | 摘要路由；留空自动用当前 agent 的模型 |

## 使用

日常无需手动操作：capture 自动记录，inject 自动把最近记忆塞进上下文。

当话题可能早于注入窗口时，模型会主动调用：

```
memory_search(query: "flyway V22", top_k: 5)
```

返回结果按关键词/子串命中打分排序，包含日期文件、轮次标题和正文片段。

## 项目结构

```
~/dsh-local-memory/
├── src/
│   ├── index.mjs       # 插件入口：apply / name / inject
│   ├── constants.mjs   # 默认配置、marker、摘要系统提示
│   ├── util.mjs        # 日期、路径、内容块等公共工具
│   ├── capture.mjs     # turn 渲染、摘要、写日文件
│   ├── inject.mjs      # 最近记忆读取与快照消息
│   └── search.mjs      # 纯 JS 关键词召回与结果格式化
├── lib/                # 构建产物（已提交，供官方 dsh plugin 安装使用）
├── cordis.patch.yml    # DSH bundle 补丁层声明
├── scripts/
│   ├── build.mjs       # 把 src/ 构建到 lib/
│   ├── install.sh      # 本地开发安装到 DSH web profile
│   └── smoke-test.mjs  # 加载插件并真实执行 memory_search
├── test/
│   └── search.test.mjs # search 单元测试（node:test）
├── docs/
│   ├── design.md       # 设计说明
│   └── usage.md        # 详细使用与排障
├── package.json
└── README.md
```

## 测试

```bash
cd ~/dsh-local-memory
npm test          # 单元测试（不需要安装）
npm run smoke     # 冒烟测试（需要先执行 install.sh，且存在 jereh 记忆目录）
```

## 记忆文件格式

与 opencode memsearch 插件对齐：

```markdown
# 2026-08-26

## Session 08:49

### 08:49
<!-- session:ses_xxx turn:msg_xxx db:/home/ubuntu/.local/share/opencode/opencode.db -->
- User 要求检查数据库与前端多语言 JSON 文件。
- Assistant 执行了 i18n 同步。
```
