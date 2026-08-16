# dsh-layered-memory

> 为 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) 打造的分层长期记忆插件 —— 对标高端智能体个性化记忆体系，实现精细化跨会话记忆管理。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 特性

- **三层记忆架构**：瞬时会话记忆（transient）/ 中期情景记忆（episodic）/ 长期语义记忆（semantic），各层独立存储、独立容量上限
- **自动捕获**：`agent/pre-step` 实时捕获用户消息要点到瞬时层，零配置
- **AI 自动提炼**：注册 4 个模型工具 + 系统提示词段落，模型自动保存用户**使用习惯、写作风格、业务需求**（按 `habit / style / business / preference / fact` 分类），任务收尾自动提交情景摘要
- **跨会话精准召回**：CJK 感知分词（单字 + 双字 + 英文词）、重要性加权、45 天指数衰减、语义层权重、标签命中加成的排序评分，结果可直接注入模型上下文
- **语义去重合并**：相似度 ≥ 0.5 自动合并重复事实并累计 `hits`，防止语义层膨胀
- **可视化记忆管理**：设置页「记忆管理」——按层浏览、全文检索（显示匹配度）、行内编辑、二次确认删除/清空、手动新增
- **持久化**：JSON 文件存储于用户目录 `.dsh-memory/`，跨会话、跨工作区共享，可直接查看/备份；串行写队列防并发损坏，主路径写失败自动回退

## 快速开始

### 环境要求

- DeepSeek Harness（支持动态 Cordis 插件，Web GUI 运行）
- Node.js 运行时（Harness 自带）

### 安装（在会话中定义并运行插件）

`host.js` 与 `client.js` 的文件内容即 `cordis_define` 的 `code.host` / `code.client` 参数。在会话中执行：

```js
// 1. 读取源码
const host = await read('dsh-layered-memory/host.js')
const client = await read('dsh-layered-memory/client.js')

// 2. 定义插件
//    cordis_define: {
//      plugin: { kind: 'new', idPrefix: 'mem' },
//      name: 'dsh-layered-memory',
//      purpose: '三层长期记忆系统：瞬时/情景/语义记忆的自动捕获、AI 提炼、跨会话召回与可视化管理。',
//      code: { host, client }
//    }

// 3. 运行（首次需要一次客户端授权）
//    cordis_run: mode 'run'（同版本重跑无需再次授权）
```

安装后：

- 模型获得 `memory_recall` / `memory_remember` / `memory_commit` / `memory_stats` 四个工具
- 系统提示词注入「分层长期记忆系统」使用规则（order 150）
- 设置页出现「记忆管理」页面；插件运行卡片显示实时状态徽章

## 使用方法

### 1. 日常使用（全自动，零操作）

安装后无需任何配置，模型会按提示词规则自动使用记忆系统：

| 场景 | 模型自动行为 |
|---|---|
| 会话开始，或你说"之前/上次/记得吗/照旧/按老规矩" | 自动调用 `memory_recall` 检索相关历史后再回答 |
| 你明确说出可长期复用的偏好（习惯、写作风格、业务要求等） | 自动调用 `memory_remember` 保存并分类 |
| 一段工作完成、任务收尾、或你说"今天先到这/再见" | 自动调用 `memory_commit` 提交会话摘要并沉淀要点 |
| 任何会话中的用户消息 | 插件自动捕获到瞬时层（无需模型参与） |

### 2. 手动指令（给模型发消息即可）

不需要记忆相关术语，用自然语言即可：

```
记住：我汇报时喜欢用表格
以后写文档都用中文，标题用 ## 两级
上次我们讨论的 X 项目结论是什么？
把这个会话记下来
查一下我上次说的关于 Y 的要求
忘记我之前说的那件事吧
```

模型会对应调用 `memory_remember` / `memory_recall` / `memory_commit` 完成操作。（注：删除/清空请使用 UI 或 RPC，模型工具暂不提供删除入口。）

### 3. 管理 UI（设置 → 记忆管理）

点击侧边栏底部「设置」，在左侧导航选择「记忆管理」：

| 功能 | 操作 |
|---|---|
| 查看记忆 | 顶部四个标签：语义记忆 / 情景记忆 / 瞬时记忆 / 全部，按分类与时间排序 |
| 统计 | 顶部徽章显示各层条数；存储路径悬停可见 |
| 检索 | 搜索框输入关键词回车，显示匹配结果与匹配度百分比；清空后回车恢复列表 |
| 编辑 | 每条记录右下「编辑」→ 修改文本/分类/重要度 → 「保存」 |
| 删除 | 「删除」→ 2.5 秒内再次点击「确认删除」 |
| 清空 | 顶部「清空本层/清空全部」→ 再次点击确认 |
| 手动新增 | 「+ 手动添加记忆」→ 选择层级/分类/重要度 → 输入内容 → 「添加记忆」 |

### 4. 数据文件管理

记忆以纯 JSON 存储于 `<用户目录>/.dsh-memory/`（跨会话、跨工作区共享）：

```
.dsh-memory/
├── transient.json   # 瞬时记忆（上限 300 条）
├── episodic.json    # 情景记忆（上限 500 条）
└── semantic.json    # 语义记忆（上限 800 条）
```

- **备份**：直接复制这三个文件即可；恢复时放回原目录
- **迁移**：把目录复制到另一台机器的用户目录下，重新安装插件即可读取
- **隐私**：记忆包含个人数据，默认被 `.gitignore` 排除，不会进入版本库


## 架构

### 记忆分层

| 层 | 存储文件 | 内容 | 来源 | 容量 |
|---|---|---|---|---|
| 瞬时 `transient` | `transient.json` | 当前会话要点（用户消息、AI 笔记） | `agent/pre-step` 自动捕获（2s 冷却、300 字符截断）+ `memory_remember(layer=transient)` | 300 |
| 情景 `episodic` | `episodic.json` | 每会话一条记录（标题、时间、要点、交互数） | `memory_commit` 提交；`agent/disposed` 自动沉淀兜底 | 500 |
| 语义 `semantic` | `semantic.json` | 长期事实（习惯/风格/业务/偏好/事实/其他） | `memory_remember` / `memory_commit(facts)`；相似度 ≥ 0.5 自动合并 | 800 |

存储目录：`<用户目录>/.dsh-memory/`（由 `sandboxPolicy.workspaceRoot` 或 `fs.resolve('.')` 解析，跨会话、跨工作区共享）。主目录写失败时自动回退到根目录 `dsh-memory-<layer>.json`。

### 数据模型

每条记忆条目：

```json
{
  "id": "s_mstyq3l9-asx1jy",
  "layer": "semantic",
  "text": "用户偏好用 Markdown 表格汇报数据",
  "category": "preference",
  "source": "agent",
  "importance": 4,
  "tags": ["汇报", "markdown"],
  "ts": 1786773359277,
  "updatedAt": 1786773359277,
  "sessionId": "session-xxx",
  "sessionTitle": "会话标题",
  "hits": 2,
  "messageCount": 12
}
```

### 召回算法

```
score = (0.15 × min(命中词数, 3)          # 命中基础分
       + 0.40 × 查询覆盖率                # matched / queryTokens
       + 0.10 × 条目密度                  # matched / entryTokens
       + 0.15 × 标签命中)                 # 可选
       × (0.75 + 0.25 × importance/5)    # 重要度加权
       × (0.40 + 0.60 × e^(-ageDays/45))  # 45 天指数衰减
       × 层级权重                          # semantic 1.15 / episodic 1.0 / transient 0.55
```

阈值 `MIN_SCORE = 0.08`，结果按分数降序、同时按更新时间次排序。

## 模型工具 API

### `memory_recall(query, layer?, category?, limit?)`

跨层检索相关历史。**会话开始或用户提到"之前/上次/照旧"时优先调用**。

| 参数 | 类型 | 说明 |
|---|---|---|
| `query` | string (必填) | 检索关键词：主题、人名、项目、术语等 |
| `layer` | enum | `all`（默认）/ `transient` / `episodic` / `semantic` |
| `category` | enum | 语义层分类筛选：`habit` / `style` / `business` / `preference` / `fact` / `other` |
| `limit` | integer | 返回条数，默认 8，最大 20 |

返回 `{ query, count, results[], context }`——`context` 是可直接注入系统上下文的紧凑文本块。

### `memory_remember(text, category?, importance?, tags?, layer?)`

写入语义事实（自动去重合并并累计 `hits`）或瞬时笔记。适用于用户明确表达的长期偏好、习惯、风格、业务需求。

### `memory_commit(summary, facts?, title?)`

提交当前会话：写入情景记忆（摘要），并把 `facts` 数组 `[{text, category?, importance?}]` 沉淀到语义层。适用于工作完成、任务收尾、用户告别时。

### `memory_stats()`

各层条数与存储位置。

## Client RPC（`host.call`）

| 方法 | 参数 | 说明 |
|---|---|---|
| `mem-list` | `{layer?, category?, limit?}` | 列出记忆条目 |
| `mem-add` | `{layer, text, category?, importance?, tags?}` | 手动新增 |
| `mem-update` | `{id, patch:{text?, category?, importance?, tags?}}` | 编辑 |
| `mem-remove` | `{id}` | 删除单条 |
| `mem-clear` | `{layer}` | 清空一层或全部（`all`） |
| `mem-stats` | `{}` | 统计与存储路径 |
| `mem-search` | `{query, layer?, limit?}` | 带匹配度的全文检索 |

## 事件钩子

| 事件 | 模式 | 用途 |
|---|---|---|
| `agent/session-start` | emit | 初始化会话跟踪器 |
| `agent/pre-step` | **waterfall**（必须 `return next()`） | 捕获标准 `UserMessage[]` → 瞬时层 |
| `session/event` | emit | 补充：标题事件 + 尽力提取的角色消息 |
| `agent/disposed` | emit | 自动沉淀情景记录（兜底） |

## 系统提示词段落

`memory-system`（order 150）注入使用规则：

1. 会话开始或用户提到"之前/上次/记得吗/照旧"时，先 `memory_recall` 再作答；
2. 用户表达可长期复用的习惯、风格、业务要求、偏好时，`memory_remember` 并选对 `category`；
3. 工作完成、任务收尾或告别时，`memory_commit` 提交情景摘要 + facts 沉淀；
4. 检索结果只用于辅助回答，不原样复述。

## 配置与调优

| 常量 | 位置 | 默认 | 说明 |
|---|---|---|---|
| `MAX` | host.js | 300/500/800 | 各层容量上限（超出按 `ts` 裁剪最旧） |
| `MIN_SCORE` | host.js | 0.08 | 召回最低分数 |
| 去重阈值 | host.js `findSimilarSemantic` | 0.5 | Jaccard 相似度（保守防误合并） |
| 捕获冷却 | host.js `captureNote` | 2000ms | 同类消息去重间隔 |
| 捕获截断 | host.js `captureNote` | 300 字符 | 瞬时条目长度上限 |

## 开发

```bash
# 语法校验（host.js / client.js 为函数体，用 Function 构造验证）
node -e "const s=require('fs').readFileSync('host.js','utf8');const p=new Function(s)();console.log(typeof p.apply==='function'?'OK':'INVALID')"
```

### 目录结构

```
dsh-layered-memory/
├── host.js          # Host 半区：存储、捕获、召回、模型工具、RPC
├── client.js        # Client 半区：设置页「记忆管理」UI + 运行卡片徽章
├── manifest.json    # define 元数据、版本历史、工具/RPC 清单
├── README.md
├── LICENSE          # MIT
└── .gitignore
```

### 当前版本

**v5 (pkg-5)** — 开源清理：删除未使用代码，sessions 跟踪器容量清理防内存泄漏。

> 项目尚未纳入版本控制，历史版本（v1–v4）仅存在于开发会话记录中；本仓库只维护当前版本。后续变更建议引入 git 后按 tag 记录。

## 已知边界

- 动态插件为进程内定义：Harness 进程重启后需重新 `cordis_run`（记忆数据持久在磁盘，不受影响）
- 插件重启后会话计数器（messageCount/notes）重置，不影响已落盘数据；情景记录以 `memory_commit` 为主路径、`agent/disposed` 为兜底
- 删除/清空操作通过管理 UI 或 RPC 完成；词面去重阈值保守（0.5），语义级去重由模型在提交时判断
- 记忆数据（`.dsh-memory/`）为个人隐私数据，默认不纳入版本控制（见 `.gitignore`）

## Roadmap

- [ ] 记忆导入/导出（JSON/Markdown）
- [ ] 语义层自动晋升（hits ≥ 阈值时从情景层自动提炼）
- [ ] 多语言召回（CJK 双字分词已在中文/英文下工作，计划扩展日韩）
- [ ] 可选向量检索后端（当前为确定性词面评分，零依赖）

## 贡献

欢迎 Issue 与 PR。请保持：

- 纯 JavaScript（沙箱无 TypeScript/import/JSX 转换）
- 无 Node.js 全局依赖（`process`/`Buffer`/`setTimeout` 不可用，使用 `ctx` 服务与 `harness` 内建）
- 所有副作用可逆（`ctx.on` / `slots.inject` / 注册 disposer）

## License

[MIT](LICENSE)
