# dsh-blackjack

[English](./README.md) | **简体中文**

> ⚠️ **社区第三方项目声明**
>
> 本项目由个人开发者发布与运营，**与任何模型厂商均无关联**：不是任何厂商的官方
> 项目、不代表其立场、未获其背书或授权，也不使用其名称与标识作为本项目的品牌
> 元素。项目名中的 `dsh-` 前缀仅遵循社区插件的命名惯例，用于标识兼容目标。
>
> 计量代理转发到的上游是**由运营者自行配置的 OpenAI 兼容端点**，具体选用哪家
> 服务由部署本项目的人自己决定。

一个面向 dsh 社区的开源**福利小游戏**：开发者在自己的 dsh 里
玩 21 点，赢取由运营者出资的游戏币 **CHIP**；CHIP 可单向兑换为「已兑换额度」，
额度只能通过本项目的计量代理消费。核心体验是"跑任务没额度了？打两把续命"。

仓库包含两部分：

- **插件**（安装进开发者各自的 dsh）：牌桌 UI、余额/兑换交互、无感续命路由。
- **中心服务**（本目录 `packages/server`，运营者自托管）：牌局权威、四桶守恒账本、
  计量代理、周期结算任务。

## 参与规则（重要，请先读）

- **参与永远免费。** 每日固定几手免费牌，零成本参与；不存在也永远不会存在
  "付费换手数 / 换概率 / 换赔率"的任何设计。
- **游戏币单向、封闭。** CHIP 与已兑换额度：
  - **不可提现**、不折算任何法定货币、界面不显示金额；
  - **不可转让**（含玩家之间转让）、不可退换；
  - **不会进入任何模型厂商的账户**；
  - **唯一用途**是通过本项目的计量代理消费——除此之外没有任何出口。
- **不活跃会回收。** 连续 **7 天**无游戏且无消费的账户，余额会被回收进奖池
  （判据是"打牌或消费"，轮询查询接口不算活跃）。
- **已兑换额度目前不会过期。** 曾经写作"有效期至本赛季末"，但赛季结算
  （`seasonSettle`）从头到尾没有触碰过已兑换额度，那句话与实现不符，因此改成
  如实描述。是否要在赛季末清零，是一个尚未做出的产品决定——真要做，会先在这里
  和插件内明确公告。
- **玩家自己的 API key 永远不进入本系统**：不托管、不代管、不作为任何游戏内资源。
- **积分**只是排序与荣誉货币，对 CHIP 没有固定汇率。

## 安装插件

开发者在自己的 dsh 里体验游戏，装的是 `packages/plugin`（npm 包名
`dsh-blackjack`），不需要碰服务端代码：

```sh
dsh plugin --profile web add -w dsh-blackjack
dsh --profile web
```

> ℹ️ **0.2.2 起，启动页上直接敲 `/blackjack` 就能出牌桌。** 在此之前（0.2.1 及更早），
> 在 dsh 的启动页（新开 dsh 时那个 “Into the Unknown” 界面）执行 `/blackjack`，命令
> **会真的执行，但画面上什么都不出现**——看起来就像插件坏了。装的是旧版本的话，先
> 随便发一句话让对话真正开始，或从侧边栏打开一个已有对话，再执行 `/blackjack`；点
> “新建会话”没用，那会把你送回启动页。
>
> 这从来不是本插件独有的缺陷，宿主对**所有插件注册的命令**都这样；而这次的修复是
> **插件侧的自救，不是宿主改了**，所以别的插件仍然会撞上。根因与做法见
> 上游讨论：https://github.com/deepseek-ai/deepseek-harness/discussions/4066
> （最小复现见 [`docs/repro/dsh-probe-repro/`](./docs/repro/dsh-probe-repro/)）。

把 `web` 换成你实际要装的 profile 名；`-w` 是必须的，profile 目录本身是一个
pnpm 工作区，缺了这个参数 pnpm 会拒绝安装。插件自己的完整说明——命令表、配置
项、续命路由的触发条件、参与规则、卸载方式——见

## 合规与联系方式

本项目按《生成式人工智能服务管理暂行办法》的义务制要求运行：开放注册、逐请求
记录可追溯日志、内置可即时停服的总开关。

- 合规问询、下架请求、滥用举报：**`<运营者联系邮箱占位：请在部署前替换>`**
- 收到监管或上游要求时，运营者会用总开关（见下文 runbook）即时停服并回复。

## 快速开始

### 环境变量

复制 `.env.example` 为 `.env`（`.env` 已在 `.gitignore` 中，**切勿提交**）：

### 变量 · 说明
- **变量**: `DATABASE_PATH` · **说明**: SQLite 文件路径。容器内默认 `/data/app.db`（挂载卷上）。
- **变量**: `PORT` · **说明**: HTTP 端口，默认 `8787`。
- **变量**: `ADMIN_TOKEN` · **说明**: 管理端点 `/admin/*` 的凭证（请求头 `X-Admin-Token`）。**不设则所有管理端点一律 403。**
- **变量**: `DEEPSEEK_API_KEY` · **说明**: 上游 OpenAI 兼容端点的 API key（变量名沿用代码中的既有名称）。只存在于服务端环境变量。
- **变量**: `DEEPSEEK_BASE_URL` · **说明**: 上游 base URL，代理会向 `${BASE_URL}/chat/completions` 转发。
- **变量**: `GITHUB_CLIENT_ID` · **说明**: GitHub OAuth App 的 client_id（公开值，用来拼配对页的 authorize 跳转链接）。**兑换必需。**
- **变量**: `GITHUB_CLIENT_SECRET` · **说明**: 同一个 OAuth App 的 client_secret，只在服务端用授权码换 access token 时使用，绝不出现在任何响应或日志里。**兑换必需。**
- **变量**: `PUBLIC_URL` · **说明**: 本服务的对外可访问 base URL（不带尾部斜杠），用于拼配对码的 `/pair/<code>` 链接。**兑换必需**，生产环境必须设成真实域名。

**兑换配置自检（缺一即停兑换，不停服）**：上面标了「兑换必需」的三个变量少任何一个，
兑换流程都会产出一条**看起来成功、实际不可用**的链接——`PUBLIC_URL` 缺失会给每个
玩家发 `http://localhost:8787/pair/<code>`，`GITHUB_CLIENT_ID` 缺失会拼出
`authorize?client_id=&…`，`GITHUB_CLIENT_SECRET` 缺失会让回调换 token 必然失败。
因此服务端在启动时会打一条醒目告警列出缺失项，并且 `POST /api/pairing/start`
一律返回 **503**（响应体带 `missingConfig` 与 `operatorHint`），绝不发一个废码出去。
游戏本身（发牌、动作、余额）与计量代理不依赖这三个变量，照常工作。

### 本地运行

```bash
pnpm install
pnpm --filter @dsh-blackjack/server test        # 全量测试
pnpm --filter @dsh-blackjack/server typecheck
pnpm dev                                        # tsx watch
```

### Docker

```bash
docker build -t dsh-blackjack -f packages/server/Dockerfile .
docker run -p 8787:8787 -v "$PWD/data":/data -e ADMIN_TOKEN=... -e DEEPSEEK_API_KEY=... dsh-blackjack
```

镜像以非 root 用户 `node`（uid 1000）运行，数据库默认落在 `/data`。

### Railway 部署

1. 新建服务指向本仓库。仓库根的 `railway.json` 已把构建器指到
   `packages/server/Dockerfile`，无需在面板里再设。
2. **必须挂载持久卷到 `/data`**（`railway volume add --mount-path /data`）。没有卷
   时数据库会写进容器可写层，**每次重新部署都会静默丢掉全部玩家余额**。
   `DATABASE_PATH` 默认已指向 `/data/app.db`。
3. 卷的属主是 root，会盖掉镜像构建期的 `chown`。本仓库的 entrypoint 已处理：容器
   以 root 启动，只把数据目录交给 `node`，随即 `setpriv` 降权再 exec 应用——**不要**
   改用 Railway 文档建议的 `RAILWAY_RUN_UID=0`，那会让整个应用跑在 root 下，废掉
   非 root 加固。
4. **`PORT` 要显式设成 `8787`**，或把服务域名的目标端口改成 Railway 注入的
   `PORT`（默认 8080）。两者不一致时平台会显示 Online 但对外一律 502。
5. 配置上面那几个环境变量，然后用 `/api/health` 确认存活。缺 GitHub 那两个变量时
   服务照常启动，只有 `POST /api/pairing/start` 返回 503 并在响应里列出缺哪几项。

> 以上第 2–4 点都是本项目首次真实部署时踩到的：Railway 的构建器会直接拒绝
> Dockerfile 里的 `VOLUME` 指令，持久化必须走平台侧的卷。

### 单实例约束（重要）

**本服务只能以单进程运行，且该进程独占那一个 SQLite 文件。** 以下几条安全性都
依赖"同一进程内的串行写事务"：

- 每日免费手数上限、"同一时刻只能有一局进行中"的检查；
- 计量代理的单玩家并发上限与每分钟频率上限；
- 四桶账本的原子转移。

横向扩容（多副本 / 多进程 / 卷共享）会让这些检查各算各的，直接击穿奖池。要扩容
必须先把账本迁到支持真正跨进程事务的存储上，这不在 v1 范围内。

### 身份绑定：设备码配对 + GitHub OAuth 授权码流

兑换需要绑定 GitHub 账号，一个 GitHub 身份只能对应一个玩家钱包：已绑定的玩家
不能改绑（403），且某个 GitHub id 一旦被认领就永久归属该玩家（换人再绑 409）。
这是奖池出口唯一的反小号闸门，绑定规则本身不变。

绑定走完整的 GitHub OAuth 授权码流，取代了早期"拿访问令牌直接调 GitHub 用户
接口"的做法（那种做法不校验令牌签发方，为其他应用签发或从开发机泄漏的令牌也能
拿来绑定——这个口子已经关闭）：

1. 插件调用 `POST /api/pairing/start`（玩家鉴权），拿到一个短 TTL（默认 900
   秒，`pairing_ttl_seconds`）的一次性配对码和一条 `${PUBLIC_URL}/pair/<code>`
   链接，提示用户在浏览器里打开。
2. 用户在浏览器打开该链接：这一步会在浏览器上种下一枚 HttpOnly、
   `SameSite=Lax` 的绑定 cookie，页面上会先展示一条警示（这会把你的 GitHub
   账号绑到一个钱包上，且不能改绑；只有这个链接是你自己生成的才继续，别人发
   来的链接直接关掉），然后才是"用 GitHub 继续"按钮，跳转到 GitHub 官方
   authorize 页面（`state` 参数即配对码）。
3. GitHub 把用户带回 `GET /auth/github/callback`，服务端先核对请求带的 cookie
   与该配对码绑定时记下的哈希是否一致（不一致或缺失一律 403、不写库），再用
   **只有它自己持有**的 `GITHUB_CLIENT_SECRET` 把授权码换成 access token 取用
   户身份——全程不经过插件或用户手上的任何令牌，因此不存在令牌来源不可信的
   问题。

   **这枚 cookie 能防住什么、防不住什么要说清楚**：它证明"完成 OAuth 回调的
   浏览器"就是"打开过我们自己 `/pair/<code>` 页面的那个浏览器"——堵住的是攻
   击者绕开这个页面、直接伪造一条 GitHub authorize 链接或裸调用回调地址、让
   受害者的浏览器在从没接触过我们域名的情况下完成绑定这一种手法。它**防不住**
   "诱导受害者亲自打开攻击者生成的 `/pair/<code>` 链接、亲眼看到我们自己的页
   面、亲手点击'用 GitHub 继续'"这种情况——受害者的浏览器会正常拿到这枚
   cookie 并顺利通过校验，其 GitHub 身份依然会绑到攻击者的钱包上，且一号一钱
   包规则下不可撤销。真正针对后一种手法的缓解是上面第 2 步里那条页面内警示：
   把"这会绑定你的身份、只有自己生成的链接才该继续"这件事在点击按钮之前明确
   摆出来，靠用户自己判断链接来源，而不是靠 cookie（cookie 在这个场景里本来
   就无能为力——它只证明"这个浏览器点过我们的页面"，证明不了"这个浏览器的主
   人是配对码的生成者"）。
4. 校验通过后写入绑定，**同时把这个配对码轮换成一枚全新的码**（原码作废，
   经过 GitHub 和浏览器历史的码值不再代表任何能力），302 跳到新码的配对页，
   在这个新页面上提交兑换表单（`POST /pair/<新码>/exchange`）。**兑换成功后
   这枚码同样立刻作废**——同一个码不能被拿去反复兑换。

未知、过期、已经用掉的配对码一律 404，互不区分，避免枚举。

**绑定之后就不必再走这一趟。** 上面这套浏览器流程存在的唯一理由是 GitHub 的
授权码流只能在浏览器里完成，而绑定只需要一次。玩家绑定后，插件用它自己持有的
玩家令牌直接调 `POST /api/exchange`（要求已绑定，否则 403
`github-binding-required`）就能兑换，对应命令是 `/blackjack exchange <数量>`。
两条路径共用同一套门槛与账本校验：未达门槛 403 `below-exchange-threshold`（响应里
一并带上 `thresholdChips`），超出余额 402 `insufficient-balance`，两者都不动账本。

### 玩家可见错误体

所有玩家可见的错误统一是这个形状：

```json
{ "error": { "code": "below-exchange-threshold", "message": "below exchange threshold", "thresholdChips": 30000 } }
```

- `code` 是稳定的 kebab-case 标识，**这是服务端与插件之间的契约**；完整清单在
  `packages/server/src/http.ts` 的 `PLAYER_ERROR_CODES`，那张表同时约束服务端的
  `playerError()` 参数类型和插件那侧的映射测试，改名不同步会编译或测试失败。
- `message` 只供日志与 `curl` 调试。服务端不知道调用者的语言，玩家看到的措辞一律
  由插件按 `code` 查自己的文案表（`packages/plugin/src/i18n/`）。
- `error` 里的其余字段是结构化事实（`thresholdChips`、`capChips`、`maxChips`……），
  给插件措辞用。
- 令牌缺失或服务端不认识该令牌：401 `unknown-player-token`。

**计量代理（`POST /v1/chat/completions`）不在此列**，它对外必须保持 OpenAI 兼容的
`{ "error": { "message", "type" } }` 形状——宿主的模型路由层按那套 `type` 词表判断
要不要回退，换成上面这套会打断它。这是刻意不统一，不是忘了统一。

## 运维 runbook

所有可调参数都在数据库的 `config` 表里（不是硬编码，也不是环境变量），通过管理
端点读写，改完即时生效（`max_body_bytes` 例外，需重启进程）：

```bash
# 查看账本快照（四桶 + 守恒结论 + 总开关状态）
curl -H "X-Admin-Token: $ADMIN_TOKEN" https://<host>/admin/snapshot

# 运营视图：日活、漏斗、免费/加注局占比、奖池流向，以及所有配置项的当前生效值
curl -H "X-Admin-Token: $ADMIN_TOKEN" https://<host>/admin/metrics

# 改任意配置项（键必须是已知配置项）
curl -X POST -H "X-Admin-Token: $ADMIN_TOKEN" -H 'content-type: application/json' \
  -d '{"key":"free_hands_per_day","value":"2"}' https://<host>/admin/config

# 直接给某个账号发额度（奖池 → 游戏余额 → 已兑换额度，一个事务里走完）。
# 用于种子账号、补偿、以及验证续命这类必须先有额度的场景。手改数据库会破坏
# 四桶恒等式、让每日对账自动拉闸，所以只能走这个接口。
curl -X POST -H "X-Admin-Token: $ADMIN_TOKEN" -H 'content-type: application/json' \
  -d '{"githubLogin":"someone","amountMicro":300000}' https://<host>/admin/grant
# 也接受 {"playerId":"..."}；池子不够时 402，账本不动
```

`/admin/config` **只写不读**，改完请用 `/admin/metrics` 的 `config` 字段回读确认——
盲写曾经把几个经济参数写坏并导致服务 500。

`/admin/metrics` 的字段：

### 字段 · 含义
- **字段**: `dau` · **含义**: 最近 30 天每天开过局的独立玩家数
- **字段**: `funnel` · **含义**: 注册 → 玩过 → 绑 GitHub → 兑换过 → 消费过，五级人数。「玩过」与「绑 GitHub」之间的落差就是**赢了却兑不出去**的沉淀人群，是奖池最大的漏损来源
- **字段**: `rounds` · **含义**: 免费局 / 加注局各自的局数与独立玩家数——加注局到底有没有人玩
- **字段**: `poolFlow` · **含义**: `payoutToFreeMicro` / `payoutToRaiseMicro`（奖池分别付给两种局的钱）与 `betsToPoolMicro`（玩家投回池子的钱）。后两者对比即可判断加注局在回血还是放血
- **字段**: `config` · **含义**: 所有配置项的当前生效值

### 几个容易踩的配置项

### 配置项 · 当前值 · 为什么是这个值
- **配置项**: `pool_model` · **当前值**: `deepseek-v4-flash` · **为什么是这个值**: **奖池一律用它服务，不按调用方点名的型号**。花的是运营者的上游余额，型号由出钱的人定；也让「unknown model」这一整类失败从源头消失。代价：玩家界面显示的型号可能与实际服务的不同，插件 README 里已披露
- **配置项**: `price_table` · **当前值**: v4 系列，**取高峰档** · **为什么是这个值**: 上游分高峰/低谷两档、差一倍，而账本只能填一个固定价。按低谷填会让真实账单超过账本记的 `consumed_micro`，击穿 `consumed ≤ deposited`；按高峰填只是低谷时段多扣玩家额度，方向安全
- **配置项**: `proxy_est_max_out_tokens` · **当前值**: `8192` · **为什么是这个值**: 预扣时按多少输出 token 估算。**不能用 `proxy_max_tokens_cap`**：调用方不带 `max_tokens` 时那是 131,072，单这一项就冻结约 ¥1.18，占总冻结 85%，逼得兑换门槛必须定到 ¥1.4 以上
- **配置项**: `proxy_max_concurrent` · **当前值**: `4` · **为什么是这个值**: **dsh 创建会话的那一轮会同时发 3 个 LLM 调用**，不是 1 个（2026-08-22 真机实测）。闸设成 1 时另外两个被拒成 429，额度耗尽的玩家恰好在最该续命的第一句话上仍看到「余额不足」。4 = 实测的 3 加一格余量。原先定 1 的理由是「余额只装得下一笔预扣，第二笔会 402，那是个含糊的错误」——所有玩家可见错误现在都有稳定 `code`、由插件按 `code` 出本地化措辞，402 里还带上 need/have，这个顾虑不再成立
- **配置项**: `exchange_threshold_chips` · **当前值**: `200000`（¥0.40） · **为什么是这个值**: **必须覆盖一次请求的预扣**（约 ¥0.275），不是覆盖成本（约 ¥0.002~0.05）。卡住玩家的一直是预扣这道押金门槛
- **配置项**: `base_bet_chips` · **当前值**: `50000` · **为什么是这个值**: 与门槛的比例决定 all-in 要连赢几次。门槛须落在 `(2×本金, 4×本金]` → 恰好两次（约 18%）。低于下界赢一把就过线；高于上界要三次（7.5%），而 all-in 输了清零，那条路就成陷阱了
- **配置项**: `exchange_cap_per_season_chips` · **当前值**: `3000000`（¥6） · **为什么是这个值**: 单人单赛季兑换上限，防单个玩家把池子搬空。累计额从账本按 `op='exchange'` 求和，**不能读 `players.exchanged_micro`**——后者是当前余额，消费时会减少
- **配置项**: `register_max_per_ip_per_hour` / `register_max_per_hour` · **当前值**: `5` / `30` · **为什么是这个值**: 匿名注册限流。威胁不是花钱（兑换要绑 GitHub、一号一钱包），而是脚本注册大量小号领免费手把奖池掏空，真玩家看到"奖池已发完"。IP 只存加盐哈希。这是起步值，有真实数据后应收紧
- **配置项**: `inactive_recycle_days` · **当前值**: `7` · **为什么是这个值**: 赛季只有一个月，30 天等于赛季内永不回收，沉淀发不出去

**已知与实现不符的地方**：`/api/exchange` 与早期文案曾称已兑换额度"有效期至本赛季末"，
但 `seasonSettle` 从不触碰 `exchanged_micro`——实际不会过期。文案已改为如实描述；
是否在赛季末清零是尚未做出的产品决定。

### 总开关（kill switch）

```bash
curl -X POST -H "X-Admin-Token: $ADMIN_TOKEN" -H 'content-type: application/json' \
  -d '{"on":true}' https://<host>/admin/killswitch
```

- 打开后计量代理立刻对所有请求返回 503（游戏与查询接口不受影响），插件会回退到
  玩家自有配置。
- 它同时是**合规响应预案**：收到监管或上游要求时先拉闸再处理。
- 以下情况系统会**自动**拉闸：单小时消耗超过 `breaker_hourly_micro`；每日对账发现
  四桶守恒不成立；每日对账发现"日志记录的成本"与"账本实际消耗"对不上。
- 排障后手动 `{"on":false}` 复位；复位前先看最近一条 `reconciliation_reports`。

### 周期任务

### 任务 · 触发 · 作用
- **任务**: `reconcile` · **触发**: 每日 00:05 · **作用**: 四桶守恒断言 + 日志/账本交叉校验 + 按模型消耗分解，写入 `reconciliation_reports`；不通过则自动拉闸
- **任务**: 孤儿预扣清扫 · **触发**: 每小时 + 启动时 · **作用**: 释放超过 1 小时未结算的预扣，退还余额并释放并发额度
- **任务**: `recycle` · **触发**: 每日 00:15 · **作用**: 连续 `inactive_recycle_days` 天无游戏且无消费的账户余额回池
- **任务**: `season` · **触发**: **仅手动** · **作用**: 赛季结算，见下

手动触发：`curl -X POST -H "X-Admin-Token: $ADMIN_TOKEN" https://<host>/admin/jobs/<name>`

### 赛季轮换

1. 先拉总开关，停下新的消耗。
2. 跑 `/admin/jobs/reconcile`，确认 `ok: true`（不通过就别继续，先查账）。
3. 跑 `/admin/jobs/season`：未过兑换门槛的游戏余额按 `season_carryover_ratio`
   折算为积分并回池；过线余额结转。已兑换额度不动，其宽限期由不活跃回收兜底。
4. 按当时的上游价目表重新锁定本赛季汇率：更新 `chip_rate_micro` 与 `price_table`。
5. 更新 `season_id`（以及可选的 `sponsor_text`），然后关掉总开关。

### 日常巡检

- `/admin/snapshot` 的 `ok` 必须恒为 `true`；为 `false` 属停机级问题。
- `reconciliation_reports` 最新一条里的 `consumptionCrossCheck.ok` 同样必须为真。
- 最后一道防线是**独立的上游预算账号**：一切防线失效时，最坏结局也只是当期活动
  提前结束。

## 许可

MIT，见 [LICENSE](./LICENSE)。服务端开源是本项目的核心资产：账本与代理的每一行
计价逻辑都可审计。