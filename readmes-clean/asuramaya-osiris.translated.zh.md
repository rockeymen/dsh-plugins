#Osiris👁️

> **人工智能代理的持久记忆和协调图。**
> *Palantir 的对象集本体 × Notion 的结构化数据库 × 用于通用代理内存的 MCP。*

Osiris 是一个自托管、与工具无关、来源优先的实体图引擎。它将瞬态代理推理、架构规则、未解决的问题、代理间邮政通信和公共实体记录转换为跨上下文窗口、压缩和线束边界的持久、可查询、事件源图形内存。

```
                  +--------------------------------------------------+
                  |                 AGENT HARNESSES                  |
                  |   Claude Code  *  DeepSeek (DSH)  *  Cursor/AI   |
                  +-------------------------+------------------------+
                                            | MCP (:8790) / HTTP
                  +-------------------------v------------------------+
                  |               OSIRIS MEMORY LAYER                |
                  |  Granular Retrieval  *  Palantir x Notion Algebra|
                  |  Evidence Taxonomy   *  Graphed Fleet Mailbox    |
                  |  Soul Store (Bytea)  *  Multi-Seat Coordination  |
                  +-------------------------+------------------------+
                                            | Actions Waist
                  +-------------------------v------------------------+
                  |               EVENT-SOURCED KERNEL               |
                  |   PostgreSQL 16 (Append-Only)  *  Redis 7 (Bus)  |
                  +--------------------------------------------------+
```

## 🏷️ 标签和生态系统

`memory` · `cordis` · `dsh` · `dsh-plugin` · `deepseek-harness` · `deepseek` · `claude-code` · `cursor` · `mcp` · `model-context-protocol` · `agentic-ai` · `ai` · `llm` · `knowledge-graph` · `provenance` · `palantir-ontology` · `notion-databases` · `event-sourcing` · `autonomous-agents` · `fleet-coordination`

## ⚡ 为什么是 Osiris？

### 维度 · 标准 LLM 代理上下文 · Osiris 内存图
- **维度**：**持久性** · **标准 LLM 代理上下文**：会话结束、重新启动或上下文压缩时丢失 · **Osiris 内存图**：PostgreSQL 16 + Redis 中仅附加、事件源图
- **维度**：**Harness 可移植性** · **标准 LLM 代理上下文**：陷入一种专有的 Harness 格式 · **Osiris 内存图**：`:8790` 上的通用 MCP 服务器（DSH、Claude Code、Cursor、Crush）
- **维度**：**检索成本** · **标准 LLM 代理上下文**：50K–100K 令牌提示转储，导致账单膨胀 · **Osiris 内存图**：粒度 getter（`get_status` ~360 个字符、分页列表、范围搜索）
- **维度**：**真相与出处** · **标准 LLM 代理上下文**：启发式字符串和幻觉共识 · **Osiris 内存图**：具有源内替换的严格 6 层证据分类法
- **维度**：**多代理团队** · **标准 LLM 代理上下文**：无消息路由的孤立会话 · **Osiris 内存图**：图形邮政层（`Message` 对象 + 类型化 `sent_by`/`in_thread` 链接）
- **维度**：**成绩单存档** · **标准 LLM 代理上下文**：易失性本地暂存文件 · **Osiris 内存图**：具有确定性 SHA-256 哈希链的字节精确 Soul 存储

## 🧬 核心原语

### 1. 窄腰动作
每次写入 Osiris 都会经过**动作腰部** (`src/actions/core.py`)。禁止直接写入数据库。每次更改都会生成一个不可变的 `object_events` 日志条目、异步消费者的 `outbox` 事件以及 `audit_log` 条目。

```python
# Atomic mutation through the Actions Waist
async with actions.atomic():
    oid = await actions.create_or_find_object("SoftwareProject", "repo:osiris", actor="agent:thoth")
    await actions.assert_property(oid, "status", "active", source_id="agent:thoth", observed_at=now, confidence=1.0)
    await actions.create_link(from_id=decision_id, to_id=oid, type_="in_repo", source_id="agent:thoth", observed_at=now, confidence=1.0)
```

### 2. 证据分类
置信度从来都不是一个自由形式的数字。每个事实都带有明确的出处类：

- **`SELF_DECLARED`** (1.00) — 直接第一方声明（例如，代理声明其自己的架构选择）。
- **`AUTHORITATIVE_API`** (0.95) — 来自规范 API（EDGAR、CourtListener、OpenSanctions）的验证响应。
- **`DIRECT_OBSERVATION`** (0.90) — 观察到的运行时遥测或执行记录事实。
- **`CORROBORATED`** (0.85) — 独立观察员的多源协议。
- **`CO_OCCURRENCE`** (0.50) — 统计共现或启发式接近。
- **`DERIVED`** (0.40) — 推断的背景回填（例如自动转录本挖掘）。

### 3. Palantir × Notion 合成引擎
组合是可重用、可分叉的查询，表示为 8 运算符封闭代数 AST (`src/orchestrator/compositions.py`)：
- **`select`**、**`traverse`**、**`collect`**、**`subtract`**、**`union`**、**`intersect`**、**`aggregate`**、**`order`**、**`take`**
- 函数转换：`search`（融合BM25 + trigram +语义向量），`discrepancy`，`who_is_this`。

## 🚀 多线束集成

Osiris 通过 `http://127.0.0.1:8790/mcp` 上的 Streamable-HTTP 提供通用 **模型上下文协议 (MCP)** 接口。

### DeepSeek Harness (DSH)
通过 `dsh-plugin/` 中的 Cordis 生命周期插件进行本机零摩擦集成：
- 正在进行中的`turn/start`自动安装和座椅绑定。
- 零子进程后台心跳状态轮询。
- 上下文压缩之前的飞行中 `session/end-seed` 图形结算。

```yaml
# Add to ~/.dsh/profiles/web/cordis.patch.yml
plugins:
  "@deepseek-ai/dsh-mcp-client":
    servers:
      osiris:
        type: streamable-http
        url: http://127.0.0.1:8790/mcp
```

### Claude Code
统一、轻量级的 stdlib hook runner (`scripts/osiris_hook.py`) 替换了 13 个旧脚本：
```json
// Add to ~/.claude/settings.json or .mcp.json
{
  "mcpServers": {
    "osiris": {
      "type": "streamable-http",
      "url": "http://127.0.0.1:8790/mcp"
    }
  }
}
```

### 光标/风帆冲浪/自定义代理
将任何 MCP 兼容代理直接连接到 `http://127.0.0.1:8790/mcp`。

## 📬 图形化的代理间邮政层

代理通过类型化、异步的邮政渠道进行通信，并至少发送一次：
- **广播频道**：`send(to="")` - 将群组邮件传送到安装在存储库上的所有代理。
- **直接消息**：`send(to_agent="<agent_id>")` — 私人代理到代理 DM。
- **图原生拓扑**：每次调度都会在 PostgreSQL 中创建一个带有类型链接的一流 `Message` 节点：
  - `sent_by` -> `Agent`
  - `addressed_to` -> `Agent` / `Seat`
  - `broadcast_to` -> `SoftwareProject`
  - `replies_to` -> `Message`
  - `in_thread` -> `Thread`
- **现有技术检查**：如果已经存在相同的决策或实践，则在调度时自动查询知识图，以提醒代理。

## 🔎 高效粒度检索

停止将 90% 的上下文时间花在简报上。 Osiris提供分层检索：

```
+-----------------------------------------------------------------------------+
|  Tier 1: Glance (~360 chars)                                                |
|  get_status() -> {you: "agent:dsh00001", project: "osiris", mail: "0 unread"}|
+-----------------------------------------------------------------------------+
|  Tier 2: Paginated Lists (~1-2KB)                                           |
|  get_thread_list(project="osiris", kind="obligation", limit=5)              |
|  get_decision_list(project="osiris", limit=5)                               |
|  get_mail()                                                                 |
+-----------------------------------------------------------------------------+
|  Tier 3: Scoped Graph Search (~2-5KB)                                       |
|  graph_search(query="advisory lock xact", project="osiris", max_depth=1)    |
|  consult_canon(query="actions waist")                                       |
+-----------------------------------------------------------------------------+
|  Tier 4: Full Briefing & Recall (On Demand)                                 |
|  orient() * recall(ref="c396b0a2") * dossier(object_ref="repo:osiris")      |
+-----------------------------------------------------------------------------+
```

## 🛠️ 快速入门

### 1.先决条件
- Python 3.12+（`uv` 包管理器）
- 带有 `pg_trgm` 和 `vector` 扩展的 PostgreSQL 16+
- Redis 7+

### 2. 安装和数据库设置
```bash
# Clone the repository
git clone https://github.com/asuramaya/osiris.git
cd osiris

# Install Python dependencies
uv sync

# Run database migrations
DATABASE_URL=postgresql://osiris:osiris@127.0.0.1:5432/osiris uv run alembic upgrade head

# Seed core ontology types and design canon
uv run python -m src.init
```

### 3.启动服务
````bash
# 1.启动Osiris MCP服务器（HTTP / JSON-RPC端口8790）
DA