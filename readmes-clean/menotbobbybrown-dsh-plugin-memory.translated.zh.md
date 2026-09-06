#dsh-plugin-memory

> **DeepSeek Harness (`dsh`) 的持久知识图和长期记忆插件**

`dsh-plugin-memory` 为 DeepSeek Harness 代理提供跨多个对话会话和工作空间生命周期的持久长期记忆、情景回忆和用户偏好跟踪。

## 特点

- 🧠 **长期事实和偏好存储**：记住用户编码偏好、架构决策和项目约定。
- 🔍 **语义和关键词回忆**：排名相关性匹配检索提示的正确上下文。
- 💻 **CLI 管理 (`dsh-memory`)**：直接从终端列出、搜索、添加和忘记记忆。
- 🧩 **Cordis Native**：自动向代理公开 `memory_remember` 和 `memory_recall` 工具。

## 安装

```bash
# Add from GitHub
dsh plugin --profile web add "github:menotbobbybrown/dsh-plugin-memory"
```

## CLI 用法

```bash
# List all remembered items
npx dsh-memory list

# Remember a new preference or fact
npx dsh-memory add "User prefers TypeScript and strict ESLint rules" --type preference --tags coding,style

# Search and recall
npx dsh-memory search "coding style"

# Delete a memory
npx dsh-memory forget
```

## 编程使用（Cordis API）

```typescript
import { Context } from 'cordis';
import * as MemoryPlugin from 'dsh-plugin-memory';

const ctx = new Context();
ctx.plugin(MemoryPlugin);

// Save to memory
ctx.memory.remember('Target database is PostgreSQL 16');

// Recall from memory
const results = ctx.memory.recall('database version');
```