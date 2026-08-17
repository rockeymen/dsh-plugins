# star-harness

一套**可复用在各种游戏上**的 NPC Agent 框架，基于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）构建。

内置一个可玩的垂直切片：**星际大航海**——你走进欧米茄空间站的酒吧，和一个退役走私犯谈生意。他会记得你上次干了什么，会因为你砍价而不爽，钱不够时会拒绝成交并给你替代方案。

核心是一句话：**agent 做大脑，tool 做手脚，SQLite 做记忆，游戏引擎做皮囊。**

> 想了解这套设计背后的完整推演、以及我们对未来 AI 游戏的判断，见 [docs/design.md](docs/design.md)。

> **框架 vs 游戏是硬边界。** `src/framework/` 不含任何游戏或客户端知识——没有货币名、没有地点、没有工具名、没有 `three.js`。它只依赖一个 `GameWorld` 接口。这条边界由 `tests/layering.spec.ts` 机械守护：往框架里写一个 `player-1` 或 `npc_speak`，测试就红。换个游戏 = 换 `src/game/`，框架一行不动。

```
┌──────────────────────────────────────────┐
│  游戏引擎  Unity / Godot / Unreal / three.js │
│  渲染、物理、输入、UI                        │
└───────────────┬──────────────────────────┘
                │  WebSocket + 扁平 JSON 帧（引擎永远看不到 dsh 类型）
┌───────────────▼──────────────────────────┐
│  src/framework/   框架层（无游戏知识）        │
│  遭遇生命周期、prompt 组装、帧协议、动作机制    │
│  只依赖 ↓ GameWorld 接口                     │
├──────────────────────────────────────────┤
│  src/game/        游戏层（换游戏只改这里）     │
│  SQLite 状态、具体动作、NPC 人设、种子数据      │
└───────────────┬──────────────────────────┘
                │  tool call（带校验 + 事务）
┌───────────────▼──────────────────────────┐
│  状态层  SQLite                           │
│  角色、市场、货舱、好感、记忆、任务、审计      │
└──────────────────────────────────────────┘
```

依赖方向单向：**游戏 → 框架 → dsh**，从不反向。`src/plugin.ts` 是唯一把三者拼在一起的地方（composition root）。

## 1. 五分钟跑起来（不需要 API key）

```sh
cd star-harness
npm install
npm run seed        # 初始化世界数据库
npm run start:mock  # 用 dsh 自带的 mock LLM 启动，无需任何 key
```

打开 <http://127.0.0.1:3099>，点击吧台前那个蓝色人形。

`start:mock` 用的是 dsh 的 `dsh-llm-mock-server`——一个可编排的 OpenAI 兼容服务器。**真实的适配器、真实的 agent loop、真实的工具管线全都在跑**，只有 provider 那一段线是假的。所以它验证的是架构，不是玩具。

> `world.db` 作为免 seed 演示库被有意提交，因此克隆后直接 `start:mock` 也能跑。`npm run seed` 会从 `src/game/world/seed.ts` 重建一份全新世界。

### 换成真实模型

```sh
echo "DEEPSEEK_API_KEY=sk-你的key" > .env
npm start
```

`.env` 已在 `.gitignore` 里。dsh 通过 `dsh-credentials-local` 在每次请求时解析凭据，key 不会写进任何配置文件。

### 两种拓扑

### 命令 · 配置 · 用于
- **命令**: `npm start` / `npm run start:mock` · **配置**: `game.cordis.yml`，`webRoot: './web'` · **用于**: 浏览器客户端，一个进程跑全栈
- **命令**: `npm run start:headless` · **配置**: `headless.cordis.yml`，`webRoot: ''` · **用于**: **不挂任何客户端**，Unity/Godot/Unreal 通过 `/gh` 接入

两者跑的是同一套框架与同一套帧协议；headless 拓扑里 `GET /` 直接 404（没有客户端），但 NPC 对话照常。这就是“框架不绑 three.js”的意思。

## 2. 你会看到什么

### 现象 · 背后的机制
- **现象**: 对话逐字出现 · **背后的机制**: NPC 的台词是 `npc_speak` 工具的**第一个参数**，框架从还在传输的 tool 参数 JSON 里增量抽出它
- **现象**: 玩家选项是按钮，不是猜的 · **背后的机制**: 选项是工具参数里的结构化数组，不靠解析散文
- **现象**: 钱不够时 NPC 会说"你只有 12000，付不出 90000" · **背后的机制**: `canAfford` guard 拒绝并返回 `hint`，模型读了 hint 才改口
- **现象**: NPC 记得上次的事 · **背后的机制**: 记忆存在 SQLite 的 `memories` 表，每轮由 context provider 重新注入
- **现象**: 走开再回来，NPC 还认识你 · **背后的机制**: **会话是一次性的，记忆不是**（见下文"遭遇域"）
- **现象**: 点"推进 5 天"，世界事件变了 · **背后的机制**: 冷路径：游戏时钟推进，事件进入 NPC 之后的场景摘要

## 3. 架构的三个关键决定

这三个决定是整个框架和"直接调 LLM"的分界线，改之前请先读懂。

### 3.1 遭遇域会话（encounter-scoped session）

一次"玩家走近 NPC → 聊几轮 → 走开"就是一个 agent 的完整生命周期：

```
玩家靠近  → ctx.agents.create({ setup })   建立本次遭遇的 agent
多轮对话  → agent.followup(...)             history 天然连续
玩家离开  → handle.dispose()                 会话日志丢弃
下次再遇  → context provider 从 SQLite 注入记忆摘要
```

**为什么**：NPC 的连续性靠 `memories` 表，不靠会话日志。于是会话可以随时扔掉——500 个 NPC 不需要 500 个常驻会话，不需要上下文压缩，上下文窗口天然可控。

代码在 [`src/framework/encounter.ts`](src/framework/encounter.ts)。

### 3.2 人设进 section，场景进 context

```ts
// 静态人设 → system prompt section，请求前缀稳定，KV cache 可复用
agentCtx.systemPrompt.section({ name: 'npc:persona', order: 0, text: persona })

// 易变场景 → dynamic context，每次组装重新求值，落成 user-role 快照
agentCtx.systemPrompt.context({ name: 'npc:scene', order: 0,
  text: () => renderScene(world.sceneSummary(npcId, playerId)) })
```

**为什么**：变化的世界状态如果塞进 system prompt，每次都会击穿 provider 的前缀缓存。分开放，成本差一个量级。

### 3.3 业务拒绝是"成功的返回值"，不是异常

dsh 把 `throw` 变成给模型看的一句 `Error: <消息>`，信息量太低，模型会反复重试同一件不可能的事。所以：

```ts
// ✅ 库存不足 → 正常返回，带原因、可行替代、事实
return { ok: false, reason: 'insufficient_stock', have: 3, want: 10,
         hint: '只有 3 单位钛矿，最多按 3 成交。' }

// ❌ throw new Error('库存不足')   → 模型一脸茫然继续试
```

`throw` 只留给基础设施故障（数据库挂了）。框架在 [`src/framework/actions.ts`](src/framework/actions.ts) 里自动完成这个转换。

## 4. 教程：改成你自己的游戏

游戏作者只碰三个地方：**世界 schema、动作定义、NPC 人设**。一行 dsh API 都不用写。

### 4.1 加一个动作

动作 = 声明式的 `defineGameAction`。框架自动帮你做掉：参数校验、guard 拒绝转结构化返回、事务包装、审计落库、UI 卡片投影、注册进 dsh。

在 [`src/game/actions/registry.ts`](src/game/actions/registry.ts) 里加（用框架的 `createActionFactory` 绑定后得到的 `defineAction`）：

```ts
ctx.tools.register(defineGameAction(world, {
  name: 'npc_give_intel',
  description: '把一条航线情报卖给玩家。好感低于 20 时你不会开这个口。',
  parameters: {
    npcId:    { type: 'string', required: true },
    playerId: { type: 'string', required: true },
    route:    { type: 'string', required: true, description: '航线描述' },
    price:    { type: 'integer', required: true },
  },
  actorParam: 'npcId',              // 框架据此自动加"死人不能行动"守卫
  guards: [
    inRange('price', 0, 100_000),
    canAfford('playerId', args => args.price),
    // 自己的领域规则，拒绝时要告诉模型"怎样才行"
    (world, args) => {
      const score = world.attitude(args.npcId, args.playerId)
      return score < 20
        ? { reason: 'attitude_too_low',
            hint: `好感只有 ${score}，你不会把航线告诉他。先建立信任。`,
            facts: { score } }
        : undefined
    },
  ],
  // 拿到的是 SQLite 事务句柄：throw 会回滚全部写入
  apply: (tx, args) => {
    tx.addCredits(args.playerId, -args.price)
    tx.addCredits(args.npcId, args.price)
    tx.remember(args.npcId, args.playerId, `卖了他一条航线：${args.route}`)
    return { route: args.route, price: args.price }
  },
  narrate: (_args, effect) => `情报已出手，收 ${String(effect.price)} 信用点`,
}))
```

现成的可复用 guard：`sameLocation` / `hasStock` / `canAfford` / `inRange`，都在 `define.ts` 里，读起来就是游戏规则书。

**写 `description` 的三条经验**：说清什么情况会被拒绝；不要写"请调用此工具"这类元指令；参数的 `description` 是模型唯一的字段说明，别省。

### 4.2 加一个 NPC

NPC 就是 `actors` 表里 `kind='npc'` 的一行。在 [`src/game/world/seed.ts`](src/game/world/seed.ts) 加：

```ts
actor.run('npc-vex', '维克斯', 'npc', 'pirate', 'pirate-bay', 1, 15000, [
  '你是维克斯，海盗湾的中间人。你说话绕圈子，从不直接承诺。',
  '你只认钱，但你怕惹上军方。',
].join('\n'))

db.prepare(`INSERT INTO attitudes (actor_id, target_id, score) VALUES (?,?,?)`)
  .run('npc-vex', 'player-1', -30)   // 初始敌意
```

`archetype`（这里是 `pirate`）用于未来选择 dsh 的 **agent preset**——同一原型的 NPC 共享一次工具/提示词注册，是规模化到几百个 NPC 的关键。当前切片还没接 preset，见"下一步"。

### 4.3 调 NPC 的行为纪律

人设归数据库，**行为协议**归代码：所有 NPC 共享的硬规矩在 [`src/game/persona.ts`](src/game/persona.ts) 的 `NPC_PROTOCOL`，比如"玩家只能通过 `npc_speak` 听到你"、"工具返回 `ok:false` 时读 hint 再决定"、"你不知道自己是 AI"。

场景摘要的内容和详略也在这个文件（`renderScene`）。对话动作叫什么、参数字段怎么命名，由同文件的 `SPEECH` 契约声明，框架据此流式吐字和读取选项。**它每轮都会重发，所以每加一行都是持续成本**。

### 4.4 改世界 schema

改 [`src/game/world/schema.sql`](src/game/world/schema.sql)，然后在 [`src/game/world/store.ts`](src/game/world/store.ts) 加读方法和 `WorldTx` 写方法。这个 `World` 类实现框架的 `GameWorld` + `ActionHost` 两个接口——框架只认这两个接口，不认具体的表。

**注意**：这里故意**没有**用 dsh 的 `storage-domain`。原因是它会把整个 domain 全量读进内存，而且明确不支持跨表事务——但一笔交易要同时改 `actors.credits` 和两行 `cargo`，必须原子。所以状态层自己用 `node:sqlite`（零原生依赖，和 dsh 自己的 `storage-sqlite` 同一个选择）。

## 5. 帧协议

引擎侧唯一需要知道的东西。单一事实源：[`src/framework/protocol.ts`](src/framework/protocol.ts)。

**上行**（引擎 → harness）：

### 帧 · 字段 · 含义
- **帧**: `encounter.open` · **字段**: `id, npcId, playerId` · **含义**: 玩家走近 NPC，建立遭遇
- **帧**: `encounter.say` · **字段**: `id, text?` 或 `optionId?` · **含义**: 玩家说话，或选了某个选项
- **帧**: `encounter.close` · **字段**: `id` · **含义**: 玩家走开，销毁 agent
- **帧**: `world.tick` · **字段**: `days` · **含义**: 游戏时钟推进（冷路径）

**下行**（harness → 引擎）：

### 帧 · 字段 · 引擎该做什么
- **帧**: `encounter.opened` · **字段**: `id, npcName, attitude` · **引擎该做什么**: 立刻播"注意到你"的待机动画，**别等模型**
- **帧**: `say.delta` · **字段**: `id, text` · **引擎该做什么**: 追加到对话框（打字机）
- **帧**: `say.end` · **字段**: `id, mood` · **引擎该做什么**: 收尾，按 mood 切表情/配音
- **帧**: `options` · **字段**: `id, items[]` · **引擎该做什么**: 渲染玩家选项按钮
- **帧**: `action` · **字段**: `id, name, ok, summary` · **引擎该做什么**: **仅表现**：播动画、弹任务日志、刷 HUD
- **帧**: `encounter.idle` · **字段**: `id` · **引擎该做什么**: 重新开放玩家输入
- **帧**: `error` · **字段**: `id, code, message` · **引擎该做什么**: 提示或忽略
- **帧**: `world.event` · **字段**: `locationId, headline` · **引擎该做什么**: HUD 新闻条

> **`action` 帧只用来"表现"。** 状态变更已经在 harness 侧的事务里落盘了，引擎不要重算——否则就出现两个 writer，会拿到看不见的脏读。

## 6. 接入游戏引擎

选 WebSocket 是因为四个引擎**全部零第三方依赖**就能连。协议一套，每个引擎一个瘦客户端。

### Godot（最省事，推荐先接这个）

`WebSocketPeer` 内置，每帧 poll，天然主线程安全：

```gdscript
extends Node

var ws := WebSocketPeer.new()
var encounter_id := ""

func _ready() -> void:
    ws.connect_to_url("ws://127.0.0.1:3099/gh")

func _process(_delta: float) -> void:
    ws.poll()
    while ws.get_available_packet_count() > 0:
        _handle(JSON.parse_string(ws.get_packet().get_string_from_utf8()))

func open_encounter(npc_id: String) -> void:
    encounter_id = "enc-%d" % Time.get_ticks_msec()
    _send({"t": "encounter.open", "id": encounter_id,
           "npcId": npc_id, "playerId": "player-1"})

func choose(option_id: String) -> void:
    _send({"t": "encounter.say", "id": encounter_id, "optionId": option_id})

func _send(frame: Dictionary) ->