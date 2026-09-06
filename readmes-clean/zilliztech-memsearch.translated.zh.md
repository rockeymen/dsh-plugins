<h1对齐=“中心”>
  ![](assets/logo-icon.jpg)

  memsearch
</h1>

  用于人工智能编码代理的跨平台语义记忆。

  ![memsearch 演示](https://github.com/user-attachments/assets/427b7152-bc16-408c-a8b0-59a2b05fd1e0)

## 📰 新消息

- **DeepSeek Harness 支持** — MemSearch 现在为 [DeepSeek Harness (DSH)](https://zilliztech.github.io/memsearch/platforms/dsh/)] 带来自动捕获、预步内存注入、基于本机技能的调用、后台维护和只读内存浏览器。
- **记忆中的技能** - MemSearch 现在将您重复的工作流程提炼为可重用、可安装的代理技能（第三个“程序记忆”层），并在后台保持它们最新。参见【记忆中的技能](#skills-from-memory)。
- **高级内存维护** - 可选的后台任务使持久的 `PROJECT.md` 和 `USER.md` 笔记在会话中保持最新状态。请参阅[高级内存维护](#advanced-memory-maintenance)。

### 为什么是memsearch？

- 🌐 **所有平台，一个内存** — 内存流经 [Claude Code](plugins/claude-code/README.md)、[Codex](plugins/codex/README.md)、[DeepSeek Harness](plugins/dsh/README.md)、[OpenClaw](plugins/openclaw/README.md)] 和 [OpenCode](plugins/opencode/README.md)]。一个代理中的对话将成为所有其他代理中的可搜索上下文 - 无需额外设置
- 👥 **对于代理用户**，安装插件，零费力获得持久内存； **对于代理开发人员**，使用完整的 [CLI](https://zilliztech.github.io/memsearch/cli/) 和 [Python API](https://zilliztech.github.io/memsearch/python-api/) 将内存和利用工程构建到您自己的代理中
- 📄 **Markdown 是真理的源泉** — 灵感来自 [OpenClaw](https://github.com/openclaw/openclaw)。你的记忆只是 `.md` 文件——人类可读、可编辑、版本可控。 Milvus 是一个“影子索引”：一种派生的、可重建的缓存
- 🔍 **渐进式检索、混合搜索、智能重复数据删除、实时同步** — 3 层召回（搜索 → 展开 → 转录）；稠密向量+BM25稀疏+RRF重排序； SHA-256 内容哈希会跳过未更改的内容；文件观察器实时自动索引

## 🧑‍💻 代理用户

选择您的平台，安装插件，然后就完成了。每个插件都会自动捕获对话，并以零配置提供语义回忆。

### 对于Claude Code用户

```bash
# Install
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
# Restart Claude Code to activate the plugin
```

重启后就照常和Claude Code聊天即可。该插件会自动捕获每个对话回合。

**验证它是否正常工作** - 经过几次对话后，检查您的内存文件：

```bash
ls .memsearch/memory/          # you should see daily .md files
cat .memsearch/memory/$(date +%Y-%m-%d).md
```

**回忆记忆**——两种触发方式：

```
/memory-recall what did we discuss about Redis?
```
或者只是自然地提问——当克劳德感觉到问题需要历史记录时，它会自动调用该技能：
```
We discussed Redis caching before, what was the TTL we chose?
```

> 📖 [Claude Code 插件文档](https://zilliztech.github.io/memsearch/platforms/claude-code/) · [故障排除](https://zilliztech.github.io/memsearch/platforms/claude-code/troubleshooting/)

### 对于法典用户

```bash
# Install
git clone --depth 1 https://github.com/zilliztech/memsearch.git
bash memsearch/plugins/codex/scripts/install.sh
codex --yolo  # needed for ONNX model network access
```

安装后，照常聊天。 Hooks 捕获并总结每个回合。

**验证其是否正常工作：**

```bash
ls .memsearch/memory/
```

**回忆记忆** — 使用技能：

```
$memory-recall what did we discuss about deployment?
```

> 📖 [Codex 插件文档](https://zilliztech.github.io/memsearch/platforms/codex/)

### DeepSeek Harness用户

```bash
# Install the published plugin into your DSH profile
uv tool install "memsearch[onnx]"
dsh plugin --profile web add @zilliz/memsearch-dsh
# Restart that DSH profile, or start a new session
```

安装后即可正常使用DSH。已完成的转弯会自动捕获，并且仅当相关内存有用时才会在第一个模型步骤之前注入相关内存。

**验证其是否正常工作：**

```bash
ls .memsearch/memory/
```

**回忆记忆** — 自然询问或告诉DSH使用已注册的`memory-recall`技能：

```
Use memory-recall to find what we decided about the deployment architecture.
```

Web 配置文件还添加了一个紧凑的 MemSearch 底座，您可以在其中查看技能候选者并浏览 `.memsearch/` 下支持的文件，而无需编辑它们。

> 📖 [DeepSeek Harness 插件文档](https://zilliztech.github.io/memsearch/platforms/dsh/)

### 对于 OpenClaw 用户

```bash
# Install from ClawHub
openclaw plugins install --force clawhub:memsearch
openclaw config set plugins.entries.memsearch.hooks.allowConversationAccess true
openclaw config set plugins.entries.memsearch.hooks.allowPromptInjection true
openclaw gateway restart
```

安装后，像往常一样在 TUI 中聊天。该插件会自动捕获每个回合。

**验证其正常工作** - 内存文件存储在代理的工作区中：

```bash
# For the main agent:
ls ~/.openclaw/workspace/.memsearch/memory/
# For other agents (e.g. work):
ls ~/.openclaw/workspace-work/.memsearch/memory/
```

**回忆记忆**——两种触发方式：

```
/memory-recall what was the batch size limit we set?
```
或者只是自然地问——当法学硕士感觉到问题需要历史记录时，它会自动调用记忆工具：
```
We discussed batch size limits before, what did we decide?
```

> 📖 [OpenClaw 插件文档](https://zilliztech.github.io/memsearch/platforms/openclaw/) · [在 ClawHub](https://clawhub.ai/plugins/memsearch) 上浏览

### 对于 OpenCode 用户

```json
// In ~/.config/opencode/opencode.json
{ "plugin": ["@zilliz/memsearch-opencode"] }
```

安装后，像往常一样在 TUI 中聊天。后台守护进程捕获对话。

**验证其是否正常工作：**

```bash
ls .memsearch/memory/    # daily .md files appear after a few conversations
```

**回忆记忆**——两种触发方式：

```
/memory-recall what did we discuss about authentication?
```
或者只是自然地问——当法学硕士感觉到问题需要历史记录时，它会自动调用记忆工具：
```
We discussed the authentication flow before, what was the approach?
```

> 📖 [OpenCode 插件文档](https://zilliztech.github.io/memsearch/platforms/opencode/)

### ⚙️ 配置（所有平台）

所有插件共享相同的 memsearch 后端。配置一次，随处可用。

#### 嵌入

默认为 **ONNX bge-m3** — 在 CPU 上本地运行，无 API 密钥，无成本。首次启动时，从 HuggingFace Hub 下载模型（约 558 MB）。

```bash
memsearch config set embedding.provider onnx     # default — local, free
memsearch config set embedding.provider openai   # needs OPENAI_API_KEY
memsearch config set embedding.provider ollama   # local, any model
```

> 所有提供程序和模型：[配置 - 嵌入提供程序](https://zilliztech.github.io/memsearch/home/configuration/#embedding-provider)

#### Milvus 后端

只需更改 `milvus_uri`（以及可选的 `milvus_token`）即可在部署模式之间切换：

**Milvus Lite**（默认）——零配置，单个文件。非常适合入门：

```bash
# Works out of the box, no setup needed
memsearch config get milvus.uri   # → ~/.memsearch/milvus.db
```

⭐ **Zilliz Cloud**（推荐） — 完全托管，[免费套餐可用](https://cloud.zilliz.com/signup?utm_source=github&utm_medium=referral&utm_campaign=memsearch-readme) — [注册](https://cloud.zilliz.com/signup?utm_source=github&utm_medium=referral&utm_campaign=memsearch-readme) 👇:

```bash
memsearch config set milvus.uri "https://in03-xxx.api.gcp-us-west1.zillizcloud.com"
memsearch config set milvus.token "your-api-key"
```

⭐ 注册免费的 Zilliz Cloud 集群

您可以在 Zilliz Cloud 上注册 ](https://cloud.zilliz.com/signup?utm_source=github&utm_medium=referral&utm_campaign=memsearch-readme) 以获得免费集群和 API 密钥。

![注册并获取API key](https://raw.githubusercontent.com/zilliztech/claude-context/master/assets/signup_and_get_apikey.png)

自托管 Milvus 服务器 (Docker) — 适合高级用户

适用于具有专用 Milvus 实例的多用户或团队环境。需要 Docker。参见【官方安装指南](https://milvus.io/docs/install_standalone-docker-compose.md)。

```bash
memsearch config set milvus.uri http://localhost:19530
```

> 📖 完整配置指南：【配置](https://zilliztech.github.io/memsearch/home/configuration/) · 【平台对比](https://zilliztech.github.io/memsearch/platforms/)】

#### 捕获汇总路由

每个插件都会保留其本机捕获摘要器，除非您显式覆盖它：

```bash
memsearch config set plugins.codex.summarize.model gpt-5.1-codex-mini
memsearch config set plugins.opencode.summarize.model anthropic/claude-haiku
```

高级用户可以通过内存路由插件摘要