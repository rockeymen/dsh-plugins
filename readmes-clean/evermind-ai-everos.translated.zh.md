![EverOS 横幅](https://github.com/user-attachments/assets/806e9d7f-c861-4b89-9141-11e38f8753e3)

  <kbd>目录</kbd>

- [为什么是 OS](#why-ever-os)
- [快速入门](#quick-start)
- [使用案例](#use-cases)
- [文档](#documentation)
- [EverMind 生态系统](#evermind-ecosystems)
- [投稿](#contributing)

## 为什么是操作系统

EverOS 是一个 Python 库和本地优先内存运行时，用于代理和
制造商。它为编码助手、应用程序、
从第一天起就开始使用设备和工作流程。它存储对话、文件和代理
轨迹为可读 Markdown，然后同步本地 SQLite 和 LanceDB 索引
用于快速检索和自我进化重用。

标题
EverOS
其他代理内存库

Markdown 真相来源
✅ 可读、可编辑、可比较、Git 版本化的规范 `.md` 文件
❌ 通常是 API、矢量、图形、仪表板或数据库状态

直接文件编辑
✅ 编辑`.md`文件；级联观察者同步
❌ 通常是 SDK、API、仪表板或后端更新路径

本地三部分堆栈
✅ Markdown + SQLite + LanceDB；不需要 MongoDB、Elasticsearch 或 Redis
❌ 通常依赖于托管服务、矢量数据库、图形数据库或服务器堆栈

用户+代理跟踪
✅ 用户`episodes/profile`和代理`cases/skills`是单独的一级表面
❌ 通常以聊天记录、个人资料、实体、事实或检索记录为中心

正交检索
✅ 按 `user_id`、`agent_id`、`app_id`、`project_id` 和 `session_id` 搜索
❌ 通常是应用程序、命名空间、租户、线程或图形范围

知识百科
✅ 可编辑、有源代码支持的 Markdown 知识页面，具有分类、CRUD API 和主题搜索
❌ 通常与内存分离，被困在仪表板中，或者不与源文件绑定

反思
✅ 离线记忆进化，合并情节集群并细化会话之间的个人资料和技能
❌ 通常仅用于检索记忆，很少有背景巩固或长期改善

## 快速入门

> 一个 OpenRouter API 密钥足以启动 EverOS，写入持久内存，
> 并通过关键字搜索检索它们。

### 先决条件

-Python 3.12+
- 一个 [OpenRouter API 密钥](https://openrouter.ai/keys)

### 1.安装

```bash
uv pip install everos
# or: pip install everos
```

### 2. 尝试独立演示 - 无需密钥

无需 API 密钥或服务器设置 - 运行一个命令即可快速体验如何
EverOS存储和调用存储器：

```bash
# If you installed EverOS as a package:
everos demo

# If you cloned or forked this repository and have not activated .venv:
uv run everos demo
```

输入EverOS应该记住的内容，然后提出相关问题来观看
记忆通过摄取->提取->索引->回忆来移动。

<https://github.com/user-attachments/assets/98cb8e1e-2ca8-4504-b0a6-0b9a040a0a5c>

### 3. 初始化并添加您的 OpenRouter 密钥

```bash
everos init
```

这将创建 `~/.everos/everos.toml` 和 `~/.everos/ome.toml`。打开
`~/.everos/everos.toml`;生成的模型和 OpenRouter URL 已经
正确，因此仅替换空的 `api_key`：

```toml
[llm]
model = "openai/gpt-4.1-mini"
api_key = "<OPENROUTER_API_KEY>"
base_url = "https://openrouter.ai/api/v1"
```

这是最小的第 1 层设置：内存添加、刷新、Markdown 持久化、
级联索引和关键字搜索。

如果您想要不同的内存根，请使用 `everos init --root `。通过
后续命令与 `--root ` 相同。

### 4.启动EverOS

```bash
everos server start
```

保持服务器运行，然后打开第二个终端并检查它：

```bash
curl http://127.0.0.1:8000/health
```

寻找 `"status":"ok"`。通过这种一键设置，`capabilities.llm`
`true`；嵌入和重新排序保持为 `false`，直到您配置它们。

### 5. 添加并检索您的第一个记忆

> [!注意]
> 业务端点位于 `/api/v2` 下。旧的 `/api/v1` 前缀仍然存在
> 解析为相同的处理程序，以便现有集成继续工作，但它
> 是一个遗留别名，可能会在未来的主要版本中删除 - 写入新的
> 针对 `/api/v2` 的代码。

添加一个小对话：

```bash
TS=$(($(date +%s)*1000))

curl -X POST http://127.0.0.1:8000/api/v2/memory/add \
  -H 'Content-Type: application/json' \
  -d "{
    \"session_id\": \"demo-001\",
    \"app_id\": \"default\",
    \"project_id\": \"default\",
    \"messages\": [
      {\"sender_id\": \"alice\", \"role\": \"user\", \"timestamp\": $TS, \"content\": \"I love climbing in Yosemite every spring.\"},
      {\"sender_id\": \"alice\", \"role\": \"user\", \"timestamp\": $((TS+10000)), \"content\": \"My favorite coffee shop is Blue Bottle in SOMA.\"}
    ]
  }"
```

在会话结束时刷新内存：

```bash
curl -X POST http://127.0.0.1:8000/api/v2/memory/flush \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"demo-001","app_id":"default","project_id":"default"}'
```

搜索回来：

```bash
curl -X POST http://127.0.0.1:8000/api/v2/memory/search \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "alice",
    "app_id": "default",
    "project_id": "default",
    "query": "Where do I like to climb?",
    "method": "keyword",
    "top_k": 5
  }'
```

您应该在响应中看到 Yosemite 内存。保留
`"method": "keyword"`在此一键设置，因为API默认为混合
搜索，这需要嵌入提供者。

> [!提示]
> **第一个记忆已解锁。**
> 你刚刚给了 EverOS 一个事实，将其刷新到持久的 Markdown 支持的内存中，
> 并通过本地索引搜索回来。这就是核心循环。
> 想了解真相的来源吗？打开`~/.everos`并检查生成的
> 降价文件。

有关带注释的响应和 EverOS 创建的 Markdown 文件，请参阅
[快速启动.md](QUICKSTART.md)。

### 一键可以做什么？

OpenRouter一键设置为EverOS Tier 1。支持服务器启动，
内存添加和刷新、持久 Markdown 存储、级联索引和关键字
搜索。仅当您需要以下功能时才添加可选提供商：

### 配置·添加
- **配置**：仅`[llm]` · **添加**：核心内存流程和关键字搜索
- **配置**：新增`[embedding]` · **新增**：矢量/用户混合搜索、反射、技能提取
- **配置**：也添加`[rerank]` · **添加**：代理搜索、默认代理混合搜索和知识维基
- **配置**：额外添加 `[multimodal]` 和解析器 · **添加**：图像、PDF、音频和办公文件摄取

`/health` 报告缺少可选功能并返回明确的信息
HTTP 422（如果您请求需要它们的功能）。

> [!注意]
> `everos demo --live` 与步骤 2 中的独立演示不同：
> 连接到正在运行的服务器并使用真正的添加/刷新/搜索流程。它使用
> 混合搜索，因此在运行之前添加嵌入提供程序。

### 可选：摄取多模式文件

摄取非文本内容（图像/pdf/音频/办公文档）
通过 `/api/v2/memory/add` `content` 项目，安装可选的
额外：

```bash
uv pip install 'everos[multimodal]'   # or: pip install 'everos[multimodal]'
```

这会引入 `everalgo-parser`（通过 `[svg]` 捆绑包提供 SVG 支持）
开罗斯VG）。配置`everos.toml`中的`[multimodal]`部分；它的默认值
型号为 `google/gemini-3-flash-preview` 通过 OpenRouter。

**Office 文档支持需要 LibreOffice 作为系统依赖项。**
解析器将 shell 输出到 `soffice`（LibreOffice 的无头渲染器）
将 `.doc` / `.docx` / `.ppt` / `.pptx` / `.xls` / `.xlsx` 转换为 PDF
在将结果输入多模式法学硕士之前。没有 LibreOffice，
Office 上传返回 HTTP 415，并带有明确的错误消息； PDF / 图片
/音频/HTML/电子邮件解析不受影响。

在提供 Office 文档之前在主机上安装：

```bash
brew install --cask libreoffice              # macOS
sudo apt-get install -y libreoffice          # Debian / Ubuntu
```

### 对于贡献者

```bash
git clone https://github.com/EverMind-AI/EverOS.git
cd EverOS
uv sync                              # creates ./.venv and installs deps
uv run everos demo --plain           # try the local educational demo; no API keys needed
uv run everos init                   # add one OpenRouter key to ~/.everos/everos.toml

uv run everos --help
make test
```

## 用例

既然您已经拥有了第一个成功的 EverOS 时刻，请探索一下人们会做什么
正在利用跨代理、应用程序和社区的持久内存进行构建
集成。

用例展示了持久内存在实际产品中的应用
工作流程。一些示例已打包在此存储库中；其他人指出
您可以学习和适应的外部演示或集成。

[![横幅-gif](https://github.com/user-attachments/assets/840470d7-a838-4c05-8685-dd797d4e9cdf)](https://evermind.ai/usecase_reunite)

#### 重聚 - 与 EverOS 一起寻找

父母描述他们所记得的事情。孩子们描述他们所记得的事情。 Reunite 使用语义记忆来展现联系。

[了解更多](https://evermind.ai/usecase_reunite)

[![横幅-gif](https://github.com/