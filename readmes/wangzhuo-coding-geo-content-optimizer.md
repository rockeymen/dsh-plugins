# GEO Content Optimizer

[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/wangzhuo-coding/geo-content-optimizer/actions/workflows/ci.yml/badge.svg)](https://github.com/wangzhuo-coding/geo-content-optimizer/actions/workflows/ci.yml)

[English](README_EN.md) | 中文

> 输入企业文献资料 → 自动产出适配豆包/Kimi/DeepSeek/通义千问/GPT 等大模型向量库收录的高质量原创文章，并消除 AI 生成痕迹。

GEO（Generative Engine Optimization，生成式引擎优化）内容优化智能体 —— **跨平台、无平台依赖**。区别于传统 SEO 面向搜索引擎爬虫，GEO 面向的是 AI 摘要器和答案引擎：让大模型"读得懂、愿意引、能溯源"。

---

## 功能特色

### 核心能力

| 能力 | 说明 |
|------|------|
| 📄 **多格式文献解析** | 支持 PDF / Word / Excel / PPT / TXT，一键提取纯文本 |
| 🔑 **7类关键词挖掘** | 核心搜索词、长尾场景词、地域实体词、人群标签词、问题描述词、品牌专属词、场景触发词，**结构化输出强制**（Pydantic schema），按优先级公式排序 |
| ✍️ **七层架构内容生成** | EE-A-T 权威性框架 + ACES 结论前置范式 + 三段式 Hook 开篇 + 语义实体密度网络 |
| 🧹 **8维度 AI 降痕** | 句子结构/段落节奏/用词习惯/情感浓度/例证来源/完美度/个性化/关键词密度，3 级别分级处理 |
| 🛡️ **Stage 5 质量守门** | 极限词 lint、品牌溯源密度、结构完整性、**反幻觉守门**（数值溯源核验）、可选 LLM-as-Judge 评分 |
| 📏 **字数自动校准** | LLM 不会数数——程序侧实测字数，偏离「≥1800字/约1500字/不超过2000字」要求时定向扩写/压缩，最多 2 轮收敛到 ±10% 容差带 |
| 🌐 **联网检索补充** | Tavily / Bing RSS / DuckDuckGo 三引擎自动切换，中国可用 |
| 📝 **Word 文档导出** | Markdown → 格式化 Word（.docx），支持标题/表格/列表/代码块 |
| 🧩 **MCP 协议集成** | 一行配置接入 Claude Desktop / Claude Code / WorkBuddy 等 AI 工具 |
| 📦 **智能分块** | 长文本自动分块（≤60000字符/块，重叠500字符），分块结果合并后再进入下游 |

### 5种使用方式

```
CLI 交互模式  →  终端对话，适合快速试用
命令行直接处理  →  --file/--text 参数，适合批量脚本
Streamlit Web UI  →  浏览器操作，适合非技术用户
HTTP API  →  FastAPI 服务，适合集成到现有系统
MCP Server  →  接入 Claude 等 AI 工具，对话式调用
```

---

## 架构

```
输入文献 → [Stage 0 联网检索(可选)] → [Stage 1 清洗切片] → [Stage 2 关键词提取] → [Stage 3 内容生成] → [Stage 4 降痕改写] → [Stage 5 质量守门] → 成品文章 + Word文档
```

| 阶段 | 功能 | 核心方法 |
|------|------|---------|
| Stage 0 | 联网检索（可选） | 自动提取关键概念，三引擎搜索**并行**补充资料，丰富文献素材 |
| Stage 1 | 文献清洗与切片 | 过滤噪声、**语义分块**（段落/句子边界）、提取品牌信息；长文本自动分块**并行处理** |
| Stage 2 | 关键词提取 | **7类关键词**（结构化输出强制）+ 优先级公式（搜索量×相关性×竞争强度）三级排序 |
| Stage 3 | 内容生成 | EE-A-T 权威性框架 + ACES 结论前置 + 七层写作架构 + 语义实体密度 + **FAQ/可引用事实块** |
| Stage 4 | 降痕改写 | 8维度 AI 去痕 + 3级别分级（轻度/中度/深度）+ 自检清单 |
| Stage 5 | 质量守门 | **极限词 lint + 品牌溯源密度 + 结构完整性 + 反幻觉守门 + 可选 LLM-as-Judge 评分**（评分默认仅供参考、不阻断输出；传 `strict=True` 时低于达标线会在结果顶部显式标注「❌ 未达发布线」） |

---

## 快速开始

### 1. 安装

```bash
# 克隆仓库
git clone https://github.com/wangzhuo-coding/geo-content-optimizer.git
cd geo-content-optimizer

# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate    # Windows

# 安装核心依赖
pip install -e .
```

**可选功能**（按需安装）：

```bash
pip install -e ".[mcp]"       # MCP Server（接入Claude等AI工具）
pip install -e ".[webui]"     # Streamlit Web UI
pip install -e ".[postgres]"  # PostgreSQL 持久化
pip install -e ".[s3]"        # S3 文件存储
pip install -e ".[all]"       # 全部可选功能
```

> **Windows 用户**：直接运行 `setup.bat` 一键安装。中国网络建议使用镜像源：
> `pip install -e . -i https://pypi.tuna.tsinghua.edu.cn/simple`

### 2. 配置 API Key

```bash
cp .env.example .env  # Windows: copy .env.example .env
```

编辑 `.env` 文件，填入你的 LLM API Key：

```env
OPENAI_API_KEY=sk-xxx               # 你的 API Key（必填）
OPENAI_BASE_URL=https://api.openai.com/v1   # API 地址
OPENAI_MODEL_NAME=gpt-4o            # 模型名称
```

兼容的 API 供应商：

| 供应商 | Base URL | 模型示例 |
|--------|----------|----------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o` |
| DeepSeek | `https://api.deepseek.com` | `deepseek-chat` |
| 豆包（字节跳动） | `https://ark.cn-beijing.volces.com/api/v3` | `doubao-seed-2-0-pro` |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-max` |
| Kimi（月之暗面） | `https://api.moonshot.cn/v1` | `moonshot-v1-8k` |

### 3. 运行

#### 方式一：CLI 交互模式

```bash
python -m src          # 最简单
python src/cli.py      # 等效
run.bat                # Windows 一键启动
```

#### 方式二：命令行直接处理

```bash
# 输入文本，自动保存到 output/ 目录
python src/cli.py --text "你的文献内容..."

# 处理文件 + 品牌信息
python src/cli.py --file document.pdf --brand "品牌名, 官网地址"

# 启用联网检索 + 导出 Word 文档
python src/cli.py --file doc.pdf --search --docx

# 全功能：文件 + 品牌 + 联网检索 + Word导出
python src/cli.py --file doc.pdf --brand "华为, https://www.huawei.com" --search --docx
```

| 参数 | 说明 |
|------|------|
| `--text "内容"` | 直接输入文本 |
| `--file 路径` | 输入文件（PDF/Word/Excel/PPT/TXT） |
| `--brand "信息"` | 品牌补充信息 |
| `--search` | 启用联网检索（增加1-2分钟） |
| `--docx` | 导出 Word 文档（.docx） |
| `--output 路径` | 指定 Markdown 输出路径 |
| `--verbose` | 显示详细日志 |

#### 方式三：Web UI

```bash
pip install -e ".[webui]"
streamlit run src/web_ui.py
```

浏览器打开后可上传文件、粘贴文本、勾选联网检索和 Word 导出，实时查看处理进度。

#### 方式四：HTTP API 服务

```bash
python -m uvicorn src.main:app --host 127.0.0.1 --port 5000
```

| 接口 | 方法 | 说明 |
|------|------|------|
| `/run` | POST | 同步执行 Agent |
| `/stream_run` | POST | SSE 流式执行 |
| `/cancel/{run_id}` | POST | 取消任务 |
| `/v1/chat/completions` | POST | OpenAI 兼容接口 |
| `/health` | GET | 健康检查 |
| `/graph_parameter` | GET | Agent 图参数 |

Swagger 文档：启动后访问 `http://127.0.0.1:5000/docs`

调用示例：

```bash
curl -X POST http://127.0.0.1:5000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "请优化这篇文献内容..."}]}'
```

#### 方式五：MCP Server（接入 Claude 等 AI 工具）

```bash
pip install -e ".[mcp]"

# stdio 模式（Claude Desktop / Claude Code / WorkBuddy）
python src/mcp_server.py

# SSE HTTP 模式（Web 客户端）
python src/mcp_server.py --transport sse --port 5001
```

**配置 Claude Desktop**（`%APPDATA%\Claude\claude_desktop_config.json`）：

> **重要**：不要在 MCP 配置中写 `env` 字段传 API Key！Claude Code 的 `env` 会覆盖整个环境变量（包括 Windows 必需的 `PATH`），导致 Python 找不到系统 DLL 而启动失败（错误码 -32000）。API Key 请在项目 `.env` 文件中配置，MCP Server 启动时自动读取。

```json
{
  "mcpServers": {
    "geo-content-optimizer": {
      "command": "python",
      "args": ["src/mcp_server.py"],
      "cwd": "/path/to/geo-content-optimizer"
    }
  }
}
```

**配置 WorkBuddy**（`~/.workbuddy/mcp.json`）：

```json
{
  "mcpServers": {
    "geo-content-optimizer": {
      "command": "/path/to/geo-content-optimizer/.venv/Scripts/python.exe",
      "args": ["src/mcp_server.py"],
      "cwd": "/path/to/geo-content-optimizer"
    }
  }
}
```

MCP 工具列表：

| 工具 | 参数 | 说明 |
|------|------|------|
| `parse_document` | `file_path: str` | 解析 PDF / Word(.docx) / TXT / CSV / Excel(.xlsx) / PPT(.pptx) 文件（旧版 .doc/.xls/.ppt 不保证支持） |
| `run_geo_pipeline` | `cleaned_text, brand_info="", enable_search=false, user_requirements="", output_docx=""` | 执行4阶段 GEO 流水线 |
| `web_search` | `query: str, max_results=5` | 联网搜索 |
| `search_and_enrich` | `text: str, brand_info="", max_queries=3` | 提取概念+搜索+合并 |

配置完成后，在 Claude/WorkBuddy 中直接对话即可调用：

```
用户: 请帮我优化这篇华为云的产品白皮书
Claude: → 调用 parse_document 解析文件
        → 调用 run_geo_pipeline 执行4阶段流水线
        → 返回成品文章
```

---

## 用户特殊要求与双闸门（可选）

`run_geo_pipeline` 支持 `user_requirements` 参数（内容方向/目标人群/字数/风格/关键词/平台等）。传入后：
- **写作**（Stage 3/4）按**三层优先级**裁定用户要求：合规/事实/黑帽红线（Tier 0）拒绝并给合规替代；GEO 底线（Tier 1，EE-A-T/ACES/语义实体密度）尽量双赢、二选一保 GEO；其他要求（Tier 2）在约束内最大化满足
- **评分**（Stage 5）增独立第二轴"用户要求满足度"（0-100%），与 100 分 GEO 基线构成**双闸门**：GEO 达标 且 满足度≥80% 才可发布；合规冲突的要求被拒绝+给替代，不计入满足度（默认仅作评分卡建议、不阻断输出；`run_geo_pipeline(strict=True)` 时低于达标线会在结果顶部显式标注未达发布线）

不传 `user_requirements` 则行为不变（第二轴不激活），与生态中 `geo-writer`/`geo-scorer` 技能的机制一致。

### 字数自动校准（R3）

LLM 对"字数"没有稳定感知——同一个「≥1800字」要求可能产出 1200~4700 字。因此流水线**不信任模型的字数自评**，改为程序侧闭环校准：

1. 从 `user_requirements` 解析长度目标：`≥1800字`（下限）/ `不超过2500字`（上限）/ `约1500字`（贴近）/ `1800-2500字`（区间）；
2. Stage 4 降痕改写后，程序用 `len(text)` 实测字数；
3. 偏离容差带（默认 ±10%，`PIPELINE_LENGTH_TOLERANCE`）时，定向执行「扩写/压缩」修正，最多 `PIPELINE_MAX_LENGTH_ATTEMPTS`（默认 2）轮，收敛即停；
4. 修正仍未落带时如实告警并接受残余偏差，不会死循环。

无字数要求时该流程完全跳过，行为与旧版一致。

### 运行时长提示

单次运行 = 5 阶段串行 LLM + 可选 LLM 评分 + 可选联网检索。追求更快时可按需开关：
- `PIPELINE_QUALITY_JUDGE=false`：跳过 LLM 评分（只跑确定性 lint，省一次 LLM 往返）；
- `PIPELINE_SEARCH_MAX_QUERIES=1`：联网检索只提取 1 个关键词（默认 3）；
- `PIPELINE_MAX_LENGTH_ATTEMPTS=1`：字数校准最多修正 1 轮（默认 2）。

### 结构化输出降级说明

若日志出现 `with_structured_output failed ... response_format type is unavailable now`：说明当前模型/接口不支持原生 JSON-Schema 结构化输出。流水线会自动降级为「自由文本 + Pydantic 修复解析」（功能可用，但 Stage1/2 的 schema 强制力下降）。建议改用支持 `response_format=json_schema` 的模型或 OpenAI 兼容接口。

## 环境变量

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `OPENAI_API_KEY` | 是 | — | LLM API Key |
| `OPENAI_BASE_URL` | 否 | `https://api.openai.com/v1` | API 地址 |
| `OPENAI_MODEL_NAME` | 否 | `gpt-4o` | 模型名称 |
| `AGENT_TEMPERATURE` | 否 | `0.7` | Agent 温度 |
| `AGENT_MAX_TOKENS` | 否 | `32768` | Agent 最大 tokens |
| `PIPELINE_MAX_CHUNK_CHARS` | 否 | `60000` | 单块最大字符数（语义分块） |
| `PIPELINE_LLM_MAX_RETRIES` | 否 | `3` | LLM 重试次数（仅瞬时网络/限流错误） |
| `PIPELINE_LLM_TIMEOUT` | 否 | `600` | Pipeline LLM 调用超时秒数 |
| `PIPELINE_LLM_MODEL` | 否 | 空（同 OPENAI_MODEL_NAME） | Pipeline 专用模型 |
| `PIPELINE_MAX_CONCURRENCY` | 否 | `4` | 分块处理 / 联网检索并行并发度 |
| `PIPELINE_MAX_INPUT_CHARS` | 否 | `200000` | 流水线输入文本上限（字符），超过自动截断并告警；`0` 关闭（token 成本控制） |
| `PIPELINE_STAGE3_MAX_SLICES` | 否 | `0` | Stage 3 提示词最多嵌入的切片数（top-K 截断，降 token 成本）；`0` 不限制 |
| `PIPELINE_LENGTH_TOLERANCE` | 否 | `0.10` | 字数校准容差（±10%）。在 `user_requirements` 中检测到字数要求（如「≥1800字」「约1500字」）时，流水线程序侧测字数并定向扩写/压缩直到落带 |
| `PIPELINE_MAX_LENGTH_ATTEMPTS` | 否 | `2` | 字数校准最大修正轮数（模型不会数数，靠程序测量+定向修正收敛；超限后接受残余偏差并告警） |
| `PIPELINE_QUALITY_JUDGE` | 否 | `true` | 是否启用 Stage 5 LLM 评分（关闭则只跑确定性 lint，零 token 成本、运行更快） |
| `PIPELINE_QUALITY_THRESHOLD` | 否 | `80` | GEO 基线达标线（默认 80，对齐项目硬要求 GEO≥80 才可发布；接入 judge prompt，并作为双闸门的 GEO 门） |
| `PIPELINE_SEARCH_MAX_QUERIES` | 否 | `3` | 联网检索每个文本提取的查询数（调小可缩短联网阶段耗时） |
| `PIPELINE_GATE_HARD_DATA` | 否 | `false` | 可选闸门：素材显著数字（≥1000）未出现在正文时拦截"硬数据模糊化"（默认关，避免误报） |
| `PIPELINE_TEMPERATURE_GEN` / `PIPELINE_TEMPERATURE_REWRITE` | 否 | `0.8` / `0.4` | Stage3 生成 / Stage4 改写的温度（设 0 可近似复现，便于调试） |
| `PIPELINE_REQUIREMENT_SATISFACTION_THRESHOLD` | 否 | `80` | 用户要求满足度达标线（双闸门第二轴门，仅当传入 user_requirements 时启用） |
| `GEO_API_KEY` | 否 | 空 | HTTP 写接口鉴权（配置后需 `Authorization: Bearer`；默认服务仅绑定 127.0.0.1，未配置 key 时启动会打印安全警告） |
| `TAVILY_API_KEY` | 否 | - | Tavily 搜索 Key（不配则用免费引擎） |
| `PGDATABASE_URL` | 否 | — | PostgreSQL 连接（配置后持久化） |
| `S3_*` | 否 | — | S3 存储配置 |
| `HTTP_PORT` | 否 | `5000` | HTTP 服务端口 |
| `HTTP_HOST` | 否 | `127.0.0.1` | HTTP 服务绑定地址（默认仅本机；需对外暴露时改 `0.0.0.0` 并设置 `GEO_API_KEY`） |
| `MCP_SSE_HOST` | 否 | `127.0.0.1` | MCP SSE 服务绑定地址（默认仅本机） |
| `HTTP_RATE_LIMIT_PER_MINUTE` | 否 | `60` | 每客户端 IP 每分钟最大请求数（写接口限流；0 关闭） |
| `MCP_SSE_PORT` | 否 | `5001` | MCP SSE 模式端口 |

---

## 开发与质量门禁

安装开发依赖后即可使用工具链：`pip install -e ".[dev]"`

| 工具 | 命令 | 作用 |
|------|------|------|
| pytest + pytest-cov | `pytest` | 全量测试 + 覆盖率报告（当前 `--cov-fail-under=65` 防回归门槛；ECC 目标 80%，缺口为 web_ui 回调 / main.py HTTP 边角，属后续回归计划） |
| ruff | `ruff check src tests` | 代码规范（lint + import 排序） |
| bandit | `bandit -r src -ll` | 安全静态扫描（仅中高危） |

以上三步已接入 GitHub Actions CI（`.github/workflows/ci.yml`），push / PR 时自动执行。

---

## 项目结构

```
geo-content-optimizer/
├── config/
│   └── agent_llm_config.json      # Agent System Prompt + 模型配置
├── scripts/                        # 运行脚本 (Linux/macOS)
├── src/
│   ├── __main__.py                 # python -m src 入口
│   ├── main.py                     # FastAPI HTTP 服务
│   ├── cli.py                      # CLI 交互模式
│   ├── mcp_server.py               # MCP Server（接入Claude等AI工具）
│   ├── web_ui.py                   # Streamlit Web UI
│   ├── agents/
│   │   └── agent.py                # Agent 构建（LangGraph）+ AgentState
│   ├── tools/
│   │   ├── geo_pipeline.py         # 核心：4阶段流水线 + 智能分块 + Word导出
│   │   └── web_search.py           # 联网检索（Tavily/Bing/DuckDuckGo）
│   ├── utils/
│   │   ├── file/
│   │   │   └── file.py             # 文件解析（PDF/Word/Excel/PPT/TXT）
│   │   └── docx_export.py          # Markdown → Word 文档转换
│   └── storage/
│       ├── memory/                 # 内存持久化（默认）
│       ├── database/               # PostgreSQL（可选）
│       └── s3/                     # S3 存储（可选）
├── run.bat                         # Windows 一键启动
├── setup.bat                       # Windows 一键安装
├── .env.example                    # 环境变量模板
├── pyproject.toml                  # 依赖配置
├── LICENSE                         # MIT License
└── README.md
```

## 技术栈

| 层级 | 技术 |
|------|------|
| Agent 框架 | LangChain + LangGraph (create_react_agent) |
| LLM 调用 | ChatOpenAI（兼容所有 OpenAI API） |
| Web API | FastAPI + Uvicorn |
| Web UI | Streamlit（可选） |
| MCP 协议 | FastMCP（接入 Claude 等 AI 工具） |
| CLI | argparse + asyncio |
| 重试机制 | tenacity（指数退避 + JSON 自修复） |
| 持久化 | PostgreSQL（可选）+ S3（可选） |

---

## Contributing

欢迎贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交修改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

开发环境设置：

```bash
python -m venv .venv
pip install -e ".[all]"
pip install pytest pytest-asyncio
```

## Changelog

查看 [CHANGELOG.md](CHANGELOG.md) 了解完整版本变更记录。

## License

[MIT License](LICENSE) — 自由使用、修改和分发。
