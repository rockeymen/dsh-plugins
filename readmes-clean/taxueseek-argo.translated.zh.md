![Argo 阿尔戈：给 Agent 用的统一搜索与证据核验](assets/readme/hero.svg)

  中文 ·

## 它和「模型自带搜索 / AI 搜索 / 聚合搜索」比，强在哪

> 简单来说：前三种方案解决「**人**找信息」，Argo 解决「**Agent 及搜索核查于一身，具备一条龙的搜索服务**」。差别不在界面，在交付物，给人看的叫总结页或链接清单，给 Agent 的应是能排序、能复核、不撑爆上下文的优质内容，更可靠的搜索信息。

  ![左侧三种默认搜索给人看的结果，右侧 Argo 给 Agent 的可吸收证据 JSON](assets/readme/why-better.svg)

### 维度 · 模型自带搜索 · AI 搜索（总结型） · 聚合搜索 / 搜索引擎 · **Argo**
- **维度**: 结果形态 · **模型自带搜索**: 拼好的长文本 · **AI 搜索（总结型）**: 给人看的总结页 · **聚合搜索 / 搜索引擎**: SERP 链接清单 · ****Argo****: **精简 JSON：证据候选 + 可信度分解**
- **维度**: 垂直问题（行情 / 化学式） · **模型自带搜索**: 泛搜网页 · **AI 搜索（总结型）**: 泛搜再总结 · **聚合搜索 / 搜索引擎**: 泛搜网页 · ****Argo****: **直连垂直源，直接给答案**
- **维度**: 证据可信度 · **模型自带搜索**: 无评分 · **AI 搜索（总结型）**: 无结构化评分 · **聚合搜索 / 搜索引擎**: 无评分 · ****Argo****: **selection · absorption · freshness · 共识**
- **维度**: 重复查询 · **模型自带搜索**: 每次都打网 · **AI 搜索（总结型）**: 每次都打网 · **聚合搜索 / 搜索引擎**: 靠页面缓存 · ****Argo****: **双层缓存（内存 + SQLite），热查询约 10ms**
- **维度**: 成本控制 · **模型自带搜索**: 不可控 · **AI 搜索（总结型）**: 单次贵 · **聚合搜索 / 搜索引擎**: 免费但费事 · ****Argo****: **预算模式，免费优先，Key 全可选**
- **维度**: 多语言 · **模型自带搜索**: 随模型走 · **AI 搜索（总结型）**: 随模型走 · **聚合搜索 / 搜索引擎**: 随引擎走 · ****Argo****: **语言检测 + 引擎语言参数 + 多国语言支持**

> 机制上，Argo 把搜索当成一条**证据管线**：语言检测 → 领域路由 → 多引擎召回 → RRF 融合 → 证据快评，交付的是 Agent 可直接排序、可 `fetch` 复核、不撑爆上下文的材料。工具链不用换，需要换的是「搜索结果应该长什么样」——再往下一层，还有和「再包一层搜索 API 的差别」，那是实现细节的对比。

## 这是什么

**Argo 是给 AI Agent 用的多语言搜索基础设施。**

真实检索从来不是「一种语言 + 一个搜索框」：有人问 A 股行情，有人问 World Cup，有人用日文找动画，有人要 IMDb 上的导演信息。Argo 的出发点很朴素——**按领域、按语言、按需求选路**，把问题送到合适的源，而不是一律扫网页标题。联网搜索与本机文件搜索一体可用。

> 产出不是「链接清单」，而是「证据候选 + 可信度分解」。路选对了，证据才站得住。

### 和「再包一层搜索 API」的差别

### 常见做法 · Argo
- **常见做法**: 绑死一个引擎、一个 Key · **Argo**: 多引擎自动选路，免费优先、可配预算
- **常见做法**: 啥问题都泛搜网页 · **Argo**: **垂直源优先**：行情、影视、体育、宏观、化学等先给答案型结果
- **常见做法**: 默认只按中英优化 · **Argo**: **多语言识别 + 引擎语言参数 + 跨语言回退**
- **常见做法**: 搜完直接拼摘要 · **Argo**: 选择门槛 × 证据密度 × 时效 × 多源共识
- **常见做法**: 引擎挂了整条链路挂 · **Argo**: 熔断、负缓存、分阶恢复（防垂直源串味）
- **常见做法**: 每次查询都重新打网 · **Argo**: 双层缓存（内存 + SQLite），热查询约 10ms 级
- **常见做法**: 日常和研究一个慢 · **Argo**: **日常少开引擎、研究再放宽**
- **常见做法**: Agent 上下文被长 JSON 撑爆 · **Argo**: MCP 响应可紧凑裁剪，snippet 可控

## 问啥像啥

  ![四类真实路由：金融、影视、多语言、地理](assets/readme/proof-routes.svg)

### 你这样问 · 大致会怎样
- **你这样问**: 贵州茅台股价 · **大致会怎样**: A 股行情域，优先快照源，够用就停
- **你这样问**: AAPL / 美股盘前 · **大致会怎样**: 美股域，与 A 股分流
- **你这样问**: 肖申克的救赎 主演 / Inception director · **大致会怎样**: 影视域 → IMDb 等
- **你这样问**: 梅西 俱乐部 / 库里 球队 · **大致会怎样**: 体育域 → TheSportsDB 等
- **你这样问**: 埃菲尔铁塔在哪 / where is Eiffel Tower · **大致会怎样**: 地理实体 → OpenStreetMap 等
- **你这样问**: NASA founding year / 国务院职能 · **大致会怎样**: 组织实体 → Wikidata 等
- **你这样问**: 周杰伦 专辑 / Taylor Swift album · **大致会怎样**: 媒体域 → iTunes 等
- **你这样问**: アニメ おすすめ / 한국 영화 추천 · **大致会怎样**: 识别日/韩语 → 语言友好源，少塞中文专用站
- **你这样问**: 美国 CPI、中国 GDP · **大致会怎样**: 宏观数据域；国别分流
- **你这样问**: 阿司匹林 分子式 · **大致会怎样**: 化学域 → PubChem 类答案
- **你这样问**: 台积电估值分歧（深度研究） · **大致会怎样**: 拆子问题 + 多源并行，垂直源被 boost

## 它怎么工作

  ![查询 → 语言与域 → 多引擎召回 → RRF → 证据快评 → 统一 JSON](assets/readme/workflow.svg)

```
查询
  ├─ 意图消歧（可选）
  ├─ 查询改写（可选；路由仍看原始意图）
  ├─ 语言检测 + 语言偏好
  ├─ 路由（域规则 + TF-IDF + 预算 + 语言补充源 + 热路径缓存）
  ├─ 多引擎召回（熔断 / 负缓存 / 并行）
  ├─ 空结果分阶恢复（放宽 → 换同族/通用 → 跨语言；防污染）
  ├─ RRF 融合 + 可选精排
  ├─ 证据快评（权威 · 证据密度 · 时效 · 共识）
  └─ 统一 JSON（含 engine_outcomes / recovery）
```

### 证据评分（简版）

```
selection  ≈ 域名权威，SERP/跳转链压到很低
absorption ≈ 数字 / 定义 / 对比 / 披露等证据密度
freshness  ≈ 发布时间（会忽略「2015 年以来」这类历史对比年）
综合       ≈ 0.40·selection + 0.35·absorption + 0.15·freshness + 0.10·引擎分
```

结果字段含 `selection`、`absorption`、`credibility_fast`、`evidence_flags` 等，方便 Agent 直接排序。

### Agent 使用纪律（建议）

1. **高后果问题**（持仓、安全、是否属实）：search → 看快评分 → 对 top 结果 `fetch` → 再下结论
2. **数字**：写清口径，冲突时并列，不要硬合并
3. **搜索结果页 / 跳转链**：不要当正文信源
4. **社交帖**：当舆情与叙事，不当事实真值
5. **事实核查**：宁可多一两条分层查询（来源 / 对比 / 主体）

## 快速开始

任选一种即可。**不依赖 npm 官方包**也能用最新版（v2.5.1 起以 **GitHub** 为安装真源；当前推荐 **v2.8.0**。npm registry 上的旧包可能滞后，可不走）。

**零配置就能跑**：不配 API Key 时走免费引擎 + 本地 `local_*` 引擎；配了 Key 的源质量通常更好，没配则自动跳过。

### 方式一：一键脚本（推荐本机长期用）

```bash
curl -fsSL https://raw.githubusercontent.com/taxueseek/argo/main/scripts/install.sh | bash
```

装到指定目录、并挂 Skill 入口：

```bash
curl -fsSL https://raw.githubusercontent.com/taxueseek/argo/main/scripts/install.sh \
  | bash -s -- --home "$HOME/.local/share/argo" --link "$HOME/.claude/skills/argo"
```

验证：

```bash
python3 ~/.local/share/argo/scripts/search.py "贵州茅台股价" --json
python3 ~/.local/share/argo/scripts/search.py --list-engines
```

### 方式二：MCP 不装包，直接用 GitHub（推荐 Agent 快速挂载）

需要 **Node.js 18+** 和 **Python 3.10+**，首次执行一次：

```bash
pip3 install pyyaml
```

```bash
npx -y github:taxueseek/argo
```

客户端配置示例（Claude Code / Cursor / Kimi 等）：

```json
{
  "mcpServers": {
    "argo": {
      "command": "npx",
      "args": ["-y", "github:taxueseek/argo"]
    }
  }
}
```

### DeepSeek Harness 一键插件（.dsh-plugin bundle）

在 DeepSeek Harness 里一行安装，模型直接获得 10 个 `mcp__argo__*` 工具：

```bash
dsh plugin --profile web add "github:taxueseek/argo#main&path:packages/dsh-plugin"
```

重启 `dsh web` 后生效。包结构见 `packages/dsh-plugin/`；同 id `mcp-argo` 可在用户层 `cordis.patch.yml` 覆盖（如改用本地源码路径）。

### 依赖清单（通俗版）

### 依赖 · 必需？ · 干什么用 · 不装会怎样
- **依赖**: **PyYAML** · **必需？**: ✅ 必需 · **干什么用**: 读配置文件 · **不装会怎样**: 完全跑不起来，安装脚本会自动装
- **依赖**: **curl_cffi** · **必需？**: ❌ 可选（v2.7.3 新增） · **干什么用**: 模拟浏览器 TLS 指纹，过反爬站（Cloudflare 等） · **不装会怎样**: 反爬站抓取成功率低一些，日常搜索无影响
- **依赖**: **ddgs CLI** · **必需？**: ❌ 可选 · **干什么用**: 本地免 key 搜索的 10 个后端引擎 · **不装会怎样**: 少一批零成本本地搜索源，其余不受影响
- **依赖**: **realtime-index CLI** · **必需？**: ❌ 可选 · **干什么用**: 实时索引引擎（搜刚发布的内容） · **不装会怎样**: 该引擎自动禁用，显式指定会回退通用引擎
- **依赖**: **Chrome** · **必需？**: ❌ 可选 · **干什么用**: 页面截图、JS 渲染页、登录态抓取 · **不装会怎样**: 截图工具不可用，其余正常
- **依赖**: **pdfplumber / PyMuPDF** · **必需？**: ❌ 可选 · **干什么用**: PDF 提取 · **不装会怎样**: argo_pdf 不可用，其余正常
- **依赖**: **Playwright** · **必需？**: ❌ 可选 · **干什么用**: 截图增强 · **不装会怎样**: 截图工具回退 Chrome CDP，其余正常

安装脚本（install.sh）只自动装前两个；其余可选依赖按需 `pip install` 或 `brew install` 即可。
更稳、完全不依赖 Node 的写法：先装脚本（方式一），再指向本机 Python：

```json
{
  "mcpServers": {
    "argo": {
      "command": "python3",
      "args": ["/path/to/argo/scripts/mcp_server.py"]
    }
  }
}
```

Python 路径特殊时：`export ARGO_PYTHON=/path/to/python3`（仅 npx 入口会读）。

### 方式三：git clone（开发 / 改源码）

```bash
git clone https://github.com/taxueseek/argo.git
cd argo
pip3 install pyyaml
bash scripts/install.sh --link ~/.claude/skills/argo   # 可选
python3 scripts/search.py --list-engines
```

## 适用平台

### 平台 · 接入方式 · 说明
- **平台**: **Claude Code** · **接入方式**: MCP / Skill 链接 · **说明**: `npx` 或 `mcp_server.py`；也可用 `link_source.py`
- **平台**: **Kimi / Grok Build** · **接入方式**: MCP Server · **说明**: 同上
- **平台**: **Cursor / Cline / Continue** · **接入方式**: MCP · **说明**: 支持 MCP 的 IDE 插件均可
- **平台**: **命令行** · **接入方式**: `search.py` / `bin/argo` · **说明**: 脚本、定时任务、人工排查
- **平台**: **Python 项目** · **接入方式**: `from search import super_search` · **说明**: 库调用

### 安装后自检

```bash
python3 --version          # 需要 3.10+
python3 -c "import yaml; print('PyYAML OK')"
python3 -m pytest tests/test_unit.py -q   # 可选
python3 scripts/search.py --list-engines
```

## 能做什么

### 五种能力，通俗说

**1. 通用搜索 + 垂直搜索，双管齐下**

日常问题走通用网页搜索；一问到行情、影视、体育、宏观这类「有标准答案」的问题，自动切到垂直源直接给答案，而不是扔给你一堆链接。目前约 120+ 个源、60+ 业务域，金融 / 宏观 / 影视 / 体育 / 地理 / 组织 / 媒体 / 化学 / 学术 / 代码等都有专门的路。

**2. 缓存：不重复花冤枉钱**

时效性没那么强的内容（百科类、历史数据这类），第一次查完会进缓存，之后同样的查询直接命中，不再每次都走一遍 API。双层缓存（内存 + SQLite），热查询约 10ms 级返回，既省钱也省时间。

**3. 专为 Agent 设计，更省 Token**

产出是「证据候选 + 可信度分解」的精简 JSON，不是长篇网页；MCP 响应可以按需裁剪，snippet 可控，不会撑爆 Agent 的上下文。比常规模型自带的搜索能力更专业、更省 Token。

**4. 深度研究**

把一个笼统的问题拆成多个子问题，多源并行采集，最后给出「还差什么证据」的缺口提示。适合综述、调研这类要全面、要扎实的场景。

**5. 登录态专业搜索（专业模式，默认关闭）**

知乎、小红书、公众号这类要登录才能看的内容，以及 JS 渲染页、反爬页，用真实浏览器配合登录态去搜。默认关闭，需要时开启，依赖 ego lite 和 WebBridge 两个东西，详见下节「登录态专业搜索」。

**6. 时间能力（时间窗 + 方向排序）**

要搜「最近几天刚发布的内容」，用 `--since 7d` 这类时间窗框住发布时间范围，判断新旧不再靠猜。支持引擎（如 `realtime_index`，免 Key 实时索引源，结果自带发布时间）把窗口下推给数据源；其余引擎的融合结果会按 `published_at` 兜底剔除明确超窗的条目（宽松策略，无时间字段的保留），返回包带 `time_filtered` 统计，CLI 与 MCP 均支持。`--since 7d` 与「7 天前的绝对日期」等价、共享缓存；`--until 2026-08-01` 含当天。配合 `--sort newest|oldest` 按发布时间重排——找最新动态用 `newest`，找最早出处用 `oldest`。

### 能力入口速查

### 能力 · 说明 · 入口
- **能力**: 统一搜索 · **说明**: 路由 → 召回 → 融合 → 快评 · **入口**: `search.py` / `argo_search`
- **能力**: 本地文件搜索 · **说明**: 本机代码/笔记/记忆（非联网） · **入口**: `argo_local_search`
- **能力**: 深度研究 · **说明**: 拆子问题、多源采集、缺口提示 · **入口**: `research.py` / `argo_research`
- **能力**: 可信度评估 · **说明**: 权威 / 证据密度 / 时效 / 交叉验证 · **入口**: `evidence.py` / `argo_evidence`
- **能力**: 证据核验（闭环） · **说明**: 高后果问题标记 `fetch_required` + 每条 `fetch_suggested`；`--verify` 一键抓正文核验、回填「核实后证据分」、核实过的链接自动记住 · **入口**: `search.py --verify 3` / `research.py --verify 3`
- **能力**: 意图消歧 · **说明**: 多义词、品牌碰撞、策略建议 · **入口**: `clarify.py` / `argo_clarify`
- **能力**: 页面抓取 · **说明**: HTTP 优先，必要时浏览器降级 · **入口**: `argo_fetch`（`mode=extract` 可结构化）
- **能力**: 截图 / PDF · **说明**: 页面截图、PDF 结构化提取 · **入口**: `argo_screenshot` / `argo_pdf`
- **能力**: 站点爬取 · **说明**: 列表页批量抓取 · **入口**: `argo_crawl`
- **能力**: 社交与舆情 · **说明**: 微博 / 小红书 / B 站 / Reddit / X 等 · **入口**: `argo_social_search`
- **能力**: 实时索引搜索 · **说明**: 免 Key 实时索引源，结果带发布时间，适合「最近几天有什么新东西」 · **入口**: `--engine realtime_index`
- **能力**: 时间窗过滤 · **说明**: `--since` / `--until`（`7d` 或 `2026-08-01`）限定发布时间范围；支持引擎下推 + 融合后兜底过