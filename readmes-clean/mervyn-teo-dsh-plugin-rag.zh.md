# dsh-plugin-rag

  ![dsh-plugin-rag — 为你的 DSH 会话提供语义记忆](assets/banner.png)

  为你的所有 DeepSeek Harness 聊天会话提供语义记忆（RAG）—— 自动、自包含、非侵入。

## 它做什么

`dsh-plugin-rag` 把你在 Harness 中的每一段对话变成可检索的记忆。随着你聊天，插件会**增量**索引每条新消息，并在压缩/裁剪遮蔽旧内容时**减量**移除，让检索始终反映会话的**当前**表面，而不是一份过期的快照。

- ✅ **自动** —— 无需重建计划，无需手动导出。它监听会话存储，随你工作保持同步。
- ✅ **自包含** —— 嵌入来自任意 OpenAI 兼容的 `/embeddings` 端点；向量保存在**一个本地 JSON 文件**中。无原生模块、无数据库、无额外服务。
- ✅ **非侵入** —— 它*监听*已发布的会话事件，从不修改 agent 主循环；卸载后 Harness 恢复到原始状态。
- ✅ **模型无关** —— 选择内置预设，或接入你自己的端点、模型与 API 密钥。

  ![dsh-plugin-rag 演示](assets/demo.gif)

## 安装

DSH 插件就是一个普通的 npm/Cordis 包，安装方式与
[terminal](https://github.com/mervyn-teo/dsh-plugin-terminal)、
[qr-connect](https://github.com/mervyn-teo/dsh-plugin-qr-connect) 完全一致：把它加入你的 profile 依赖、bundle 列表，以及一行 `cordis.patch.yml` 插入项。

1. **加入依赖**（例如 `~/.dsh/profiles/web/package.json`）：

   ```jsonc
   {
     "dependencies": {
       "dsh-plugin-rag": "github:mervyn-teo/dsh-plugin-rag"
     },
     "dsh": {
       "profile": {
         "bundles": [
           "@deepseek-ai/dsh-base",
           "@deepseek-ai/dsh-web-app",
           "dsh-plugin-rag"
         ]
       }
     }
   }
   ```

   > 也可从本地克隆安装：`"dsh-plugin-rag": "file:/path/to/dsh-plugin-rag"`。

2. **加入插入项**到 profile 的 `cordis.patch.yml`：

   ```yaml
   - insert:
       - id: rag
         name: dsh-plugin-rag
         config:
           enabled: true
           provider: soclaas-bge-m3
           model: bge-m3
           endpoint: https://soclaas-api.comp.nus.edu.sg/v1
           topK: 5
           dataDir: ""
           includeToolResults: true
           includeReasoning: false
           maxChunkChars: 4000
   ```

3. **重新安装并重启** Harness。

## 设置

打开 **设置 → 插件 → RAG 记忆**。卡片提供了把索引器指向任意嵌入提供方所需的字段：

### 字段 · 说明
- **字段**: **启用索引** · **说明**: 开关索引器与 `rag_search` 工具。
- **字段**: **嵌入模型** · **说明**: 选择**已有预设** —— `BGE-M3 (SoCLaaS)`、OpenAI `text-embedding-3-small/large`、`Ollama nomic-embed-text` —— 或 **自定义…** 自填。
- **字段**: **端点 URL** · **说明**: 任意 OpenAI 兼容嵌入端点的基础地址。
- **字段**: **模型名称** · **说明**: 发送给端点的模型字符串。
- **字段**: **API 密钥** · **说明**: 直接粘贴密钥。保存时会持久化到 **harness 设置**（`settings.yaml`）并镜像到 **`.env` 文件**（按 **密钥环境变量** 名），因此重启后仍保留。留空则依次从设置、`.env`、进程环境读取。
- **字段**: **密钥环境变量** · **说明**: API 密钥为空时，在 `.env` 文件中读取 / 写入该环境变量名。
- **字段**: **返回结果数** · **说明**: `rag_search` 默认返回的命中数。
- **字段**: **索引工具结果** · **说明**: 是否也索引工具输出（默认开启）。
- **字段**: **索引推理内容** · **说明**: 是否也索引模型推理块（默认关闭：噪音 + 隐私）。
- **字段**: **每块最大字符数** · **说明**: 长消息的分块大小。

卡片还会显示实时的**索引状态**（块数、会话数、向量维度、模型、数据目录）以及一个**重建索引**按钮。

> ⚠️ **修改模型或端点会触发全量重建**，因为不同模型/提供方的嵌入向量不可互相比较。

## `rag_search` 工具

安装后，模型获得一个一等公民的 `rag_search` 工具。它用你配置的端点嵌入查询，并返回最相关的历史消息（含角色、会话标题与摘要），让 agent 能跨会话回忆起之前的工作、决策、代码与上下文。

```
rag_search("我们是怎么设置 terminal 插件 WebSocket 握手的？")
```

## 工作原理

插件以**非侵入**的方式接入 Harness —— 订阅会话存储已经发布的事件：

### 事件 · 作用
- **事件**: `session/created` · **作用**: 从存储游标处向前重放（新建或恢复的）会话日志。
- **事件**: `session/event` · **作用**: **增量/减量** —— 索引新的 `user/message`、`assistant/message`、`tool/result` 表面事件；对 `replace`（压缩 / 工具结果裁剪）遮蔽的条目执行反索引。
- **事件**: `session/flush` · **作用**: 被等待的持久化检查点；清空待处理的嵌入批次。

消息抽取刻意规避噪音：

- 只索引**真人**的 `user/message`（真实提问，而非系统提示或运行时上下文注入）；
- `assistant/message` 只取其**最终文本**块（跳过推理与工具调用块，除非开启“索引推理内容”）；
- `tool/result` 取工具输出（可选，由分块器截断）。

嵌入以原子 tmp+rename 写入 `~/.dsh/rag/index.json`（可通过 `dataDir` 配置）。每个会话维护一个**游标**记录已处理的最后 `seq`，因此重启是幂等的，只嵌入**新增**内容。

## 卸载

卸载与安装一样干净 —— Harness 本身没有被修改：

1. 从 `cordis.patch.yml` 和 `dsh.profile.bundles` 中移除 `dsh-plugin-rag`。
2. 从 `package.json` 依赖中移除它。
3. 重新安装并重启。

Cordis 会自动销毁插件作用域（监听器、`rag_search` 工具、配置路由），Harness 恢复到与之前完全一致。唯一残留是指数文件本身；删除 `~/.dsh/rag/`（或你的 `dataDir`）即可清除存储的向量。

## 配置参考

### 键 · 默认值 · 说明
- **键**: `enabled` · **默认值**: `true` · **说明**: 是否启用索引与 `rag_search` 工具。
- **键**: `provider` · **默认值**: `soclaas-bge-m3` · **说明**: `soclaas-bge-m3` · `openai-3-small` · `openai-3-large` · `ollama-nomic` · `custom`
- **键**: `model` · **默认值**: `bge-m3` · **说明**: 发送给端点的模型字符串（覆盖预设）。
- **键**: `endpoint` · **默认值**: `https://soclaas-api.comp.nus.edu.sg/v1` · **说明**: OpenAI 兼容嵌入端点基础地址。
- **键**: `topK` · **默认值**: `5` · **说明**: 默认返回结果数（1–50）。
- **键**: `dataDir` · **默认值**: `""` · **说明**: 索引目录；空表示 `~/.dsh/rag`。
- **键**: `includeToolResults` · **默认值**: `true` · **说明**: 是否索引工具结果。
- **键**: `includeReasoning` · **默认值**: `false` · **说明**: 是否索引推理块。
- **键**: `maxChunkChars` · **默认值**: `4000` · **说明**: 每块最大字符数（256–16000）。

## 隐私

默认一切都在本机：索引是本地文件，唯一的外发流量是发往你配置端点的嵌入请求。API 密钥绝不会写入索引，也不属于插件配置：没有相应的设置项，卡片上也无处输入。每个预设各自固定一个凭据引用（`soclaas-bge-m3` → `SOCLAAS_API_KEY`，OpenAI 预设 → `OPENAI_API_KEY`，`custom` → `RAG_API_KEY`），由 DSH 凭据存储解析：先读进程环境变量，再读 `~/.dsh/.credentials.yaml`（模型页写入的同一文件），最后回退到 `.env`。设置卡片只显示该引用当前是否已配置。

## 许可

[MIT](LICENSE)