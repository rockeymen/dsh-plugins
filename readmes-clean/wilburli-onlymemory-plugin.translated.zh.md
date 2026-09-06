# OnlyMemory  GitHub topic dsh-plugin

零外部依赖的 LLM 长期记忆插件，专为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 设计。

效果图
![alt text](image.png)

记忆管理界面
![alt text](image-1.png)

## 特性

- **零外部依赖** — 不需要向量数据库、Redis、PostgreSQL 等外部服务
- **SQLite + 纯 JS 向量检索** — sql.js（WASM）实现，单文件存储
- **Web 管理界面** — 浏览器中查看、编辑、置顶、删除记忆
- **多项目隔离** — 不同项目记忆完全独立
- **MCP 标准协议** — 通过 `@deepseek-ai/dsh-mcp-client` 与 Harness 无缝集成
- **模块化设计** — 每个子模块可独立替换和扩展
- **导入导出** — JSON 格式，支持跨机器迁移

## 从零安装（新人必看）

以下流程假设你刚拿到一份源码，手把手带你走完从下载到运行的全过程。

### 第 1 步：环境准备

确保你的机器上已安装：

### 工具 · 版本要求 · 检查命令
- **工具**: Node.js · **版本要求**: >= 18 · **检查命令**: `node -v`
- **工具**: pnpm · **版本要求**: >= 8 · **检查命令**: `pnpm -v`
- **工具**: DeepSeek Harness · **版本要求**: 最新版 · **检查命令**: 参考 [Harness 安装文档](https://deepseek-harness.github.io/deepseek-harness/develop/basic/)

> Harness 是 DeepSeek 的 Agent 运行时，OnlyMemory 作为插件运行在它之上。
> 如果你还没有安装 Harness，请先完成 Harness 的安装再继续。

### 第 2 步：获取源码

```bash
# 方式一：Git 克隆
git clone <仓库地址>
cd onlyMemory-plugin

# 方式二：直接下载 ZIP 并解压
cd onlyMemory-plugin
```

### 第 3 步：安装依赖 + 编译

```bash
npm install        # 安装 sql.js、@modelcontextprotocol/sdk 等依赖
npm run build      # 编译 TypeScript → dist/
```

编译成功后会看到 `dist/` 目录下生成 `.js` + `.d.ts` 文件。

### 第 4 步：验证编译结果

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | node bin/only-memory.mjs
```

如果看到如下 JSON 响应，说明编译成功：
```json
{"result":{"serverInfo":{"name":"only-memory","version":"0.1.0"},...},"jsonrpc":"2.0","id":1}
```

### 第 5 步：安装到 Harness

```bash
# 进入 Harness 安装目录
cd /path/to/deepseek-harness

# 安装插件到 web profile
dsh plugin --profile web add /path/to/onlyMemory-plugin
```

> **报 `ERR_PNPM_ADDING_TO_ROOT`？**
> 这是因为 pnpm 的 workspace 保护机制，需要在 profile 目录创建 `.npmrc` 解除限制：
>
> **Windows (PowerShell):**
> ```powershell
> echo "ignore-workspace-root-check=true" > $env:USERPROFILE\.dsh\profiles\web\.npmrc
> ```
>
> **macOS / Linux:**
> ```bash
> echo "ignore-workspace-root-check=true" > ~/.dsh/profiles/web/.npmrc
> ```
>
> 然后重新执行 `dsh plugin --profile web add` 命令。

### 第 6 步：启动 Harness

```bash
dsh web
```

> 如果报 `EADDRINUSE`（端口被占用），换一个端口：
> ```bash
> dsh web --port 3081
> ```
>
> 启动成功后浏览器会自动打开 Harness Web UI（默认 http://127.0.0.1:3080）。

### 第 7 步：验证插件生效

在 Harness 对话中输入：

```
请记住我的验证代号是 lapsang-42
```

然后**开一个新会话**，问：

```
我的验证代号是什么？查一下记忆
```

如果模型调用了 `mcp__only_memory__search` 并返回 `lapsang-42`，说明插件安装成功！

### 第 8 步：验证安装状态（可选）

```bash
# 查看配置树，确认 only-memory 在 bundle 列表中
dsh --profile web --dump-config
```

在输出中搜索 `only_memory`，应该能看到 MCP 客户端配置。

### 卸载

```bash
dsh plugin --profile web remove only-memory
```

## 快速开始

### 安装到 Harness

```bash
# 方式一：dsh plugin add（推荐，永久生效）
dsh plugin --profile web add ./path/to/onlyMemory-plugin

# 方式二：--patch（临时使用）
dsh web --patch ./path/to/onlyMemory-plugin/cordis-patch.yml

# 卸载
dsh plugin --profile web remove only-memory
```

> **首次安装报 `ERR_PNPM_ADDING_TO_ROOT`？** 在 profile 目录创建 `.npmrc`：
> ```powershell
> echo "ignore-workspace-root-check=true" > $env:USERPROFILE\.dsh\profiles\web\.npmrc
> ```

### 本地开发

```bash
npm install          # 安装依赖
npm run build        # 编译 TypeScript → dist/
npm run test         # 运行测试
npm run dev          # watch 模式编译
```

### 独立使用（不依赖 Harness）

```typescript
import { MemoryEngine } from './dist/engine.js';

const engine = new MemoryEngine({ projectId: 'my-app' });
await engine.init();

// 存储
await engine.remember('用户名叫张三，在北京工作', 0.9);

// 检索
const results = await engine.search('用户在哪里工作？');

// 对话集成
const context = await engine.onUserMessage('你好，还记得我吗？');
await engine.onAssistantMessage('当然记得，你是张三，在北京工作。');

// 会话结束触发自动维护（衰减、去重、清理）
await engine.endSession('session-001');

engine.close();
```

## 架构概览

```
Harness (dsh web)
  └── @deepseek-ai/dsh-mcp-client  ──stdio──▶  node bin/only-memory.mjs
                                                    │
                                              ┌─────┴─────┐
                                              │ MemoryEngine │  src/engine.ts
                                              └─────┬─────┘
                    ┌───────────┬───────────┬───────┼───────┬───────────┐
                    ▼           ▼           ▼       ▼       ▼           ▼
              ┌──────────┐ ┌────────┐ ┌────────┐ ┌──────┐ ┌──────┐ ┌──────────┐
              │ SqliteStore│ │Vector │ │Session │ │Scorer│ │Retrie│ │Maintenance│
              │  (sql.js) │ │ Store  │ │ Store  │ │      │ │ ver  │ │  (3个)   │
              └──────────┘ └────────┘ └────────┘ └──────┘ └──────┘ └──────────┘
               storage/     storage/   storage/  scorer/ retriever/ maintenance/
```

### 数据流

```
用户消息 ──▶ onUserMessage()
              ├── EntityExtractor.extract()      提取实体
              ├── MultiRecallRetriever.retrieve() 多路召回
              └── 返回相关记忆上下文

助手消息 ──▶ onAssistantMessage()
              ├── ImportanceScorer.score()       计算重要性
              ├── SqliteStore.insertMemory()      持久化
              └── LocalVectorStore.add()          向量索引

会话结束 ──▶ endSession()
              ├── DecayManager.applyDecay()       时间衰减
              ├── MemoryMerger.merge()            去重合并
              └── MemoryCleaner.clean()           低分清理
```

## 模块详解

### `src/models.ts` — 数据模型

### 导出 · 说明
- **导出**: `enum MemoryType` · **说明**: `Fact` / `Preference` / `Event` / `Behavior`
- **导出**: `enum MemoryStatus` · **说明**: `Active` / `Archived` / `Deleted`
- **导出**: `enum RelationType` · **说明**: `Contradicts` / `Supports` / `Updates` / `Relates`
- **导出**: `interface Memory` · **说明**: 记忆条目（id, content, type, entities, importance, embedding, status...）
- **导出**: `interface SessionSummary` · **说明**: 会话摘要
- **导出**: `interface RetrievalResult` · **说明**: 检索结果（memory + score + channels）
- **导出**: `interface CreateMemoryInput` · **说明**: 创建记忆参数
- **导出**: `generateId()` · **说明**: 生成 UUID
- **导出**: `createMemory()` · **说明**: 创建新 Memory 对象

### `src/config.ts` — 配置管理

```typescript
interface MemoryPluginConfig {
  projectId: string;              // 项目标识，默认 'default'
  dataDir: string;                // 数据根目录，默认 ~/.deepseek_mem
  dbName: string;                 // 数据库文件名，默认 'memory.db'
  topK: number;                   // 检索返回条数，默认 5
  importanceThreshold: number;    // 重要性过滤阈值，默认 0.3
  halfLifeDays: number;           // 衰减半衰期（天），默认 30
  embeddingBackend: 'none' | 'openai' | 'dashscope' | 'local';
  embeddingModel: string;         // Embedding 模型名
  embeddingDim: number;           // 向量维度，默认 1536
  summarizerBackend: 'none' | 'openai' | 'dashscope' | 'deepseek';
}
```

辅助函数：`resolveConfig()` / `getProjectDir()` / `getDbPath()` / `getSessionDir()` / `ensureDirs()`

### `src/engine.ts` — 核心引擎

`MemoryEngine` 是整合所有子模块的主类：

### 方法 · 签名 · 说明
- **方法**: `constructor` · **签名**: `(config?: Partial<MemoryPluginConfig>)` · **说明**: 创建引擎实例
- **方法**: `init()` · **签名**: `async (): Promise<void>` · **说明**: 异步初始化（加载 WASM、数据库、向量）
- **方法**: `remember()` · **签名**: `(content: string, importance?: number): Promise<Memory>` · **说明**: 显式存储一条记忆
- **方法**: `forget()` · **签名**: `(query: string): Promise<number>` · **说明**: 按关键词删除记忆，返回删除数
- **方法**: `search()` · **签名**: `(query: string): RetrievalResult[]` · **说明**: 搜索记忆
- **方法**: `getMemory()` · **签名**: `(id: string): Memory \ · **说明**: null` · 获取单条记忆详情
- **方法**: `updateMemory()` · **签名**: `(id, updates): boolean` · **说明**: 编辑记忆内容/重要度/类型
- **方法**: `pinMemory()` · **签名**: `(id: string): boolean` · **说明**: 置顶记忆（防止衰减和清理）
- **方法**: `unpinMemory()` · **签名**: `(id: string): boolean` · **说明**: 取消置顶
- **方法**: `getAllMemories()` · **签名**: `(): Memory[]` · **说明**: 获取所有活跃记忆
- **方法**: `getStats()` · **签名**: `(): object` · **说明**: 获取统计信息
- **方法**: `onUserMessage()` · **签名**: `(text: string): Promise<string>` · **说明**: 处理用户消息，返回相关记忆上下文
- **方法**: `onAssistantMessage()` · **签名**: `(text: string): Promise<void>` · **说明**: 处理助手消息，提取并存储信息
- **方法**: `startSession()` · **签名**: `(sessionId: string): void` · **说明**: 开始会话
- **方法**: `endSession()` · **签名**: `(sessionId: string): Promise<void>` · **说明**: 结束会话，触发维护
- **方法**: `exportToFile()` · **签名**: `(filePath: string): Promise<void>` · **说明**: 导出为 JSON
- **方法**: `importFromFile()` · **签名**: `(filePath: string): Promise<number>` · **说明**: 从 JSON 导入
- **方法**: `close()` · **签名**: `(): void` · **说明**: 关闭引擎

### `src/storage/sqlite-store.ts` — SQLite 存储

基于 sql.js（纯 JS/WASM），内存操作 + 延迟批量写盘：

### 方法 · 说明
- **方法**: `init()` · **说明**: 异步初始化，加载 WASM 并打开/创建数据库
- **方法**: `insertMemory(memory)` · **说明**: 插入记忆
- **方法**: `getMemory(id)` · **说明**: 按 ID 获取
- **方法**: `updateImportance(id, score)` · **说明**: 更新重要性
- **方法**: `incrementAccessCount(id)` · **说明**: 增加访问计数
- **方法**: `archiveMemory(id)` / `deleteMemory(id)` · **说明**: 归档/删除
- **方法**: `getAllActive()` / `getActiveCount()` · **说明**: 查询活跃记忆
- **方法**: `ftsSearch(query, limit)` · **说明**: LIKE 全文搜索
- **方法**: `entitySearch(entities, limit)` · **说明**: 实体匹配搜索
- **方法**: `getLowImportanceMemories(threshold)` · **说明**: 获取低分记忆
- **方法**: `saveSessionLog(session)` · **说明**: 保存会话日志
- **方法**: `exp