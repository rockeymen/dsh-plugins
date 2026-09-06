![DeepSec](https://github.com/user-attachments/assets/44859857-7122-40f7-812f-2c7f81515182)

# DeepSec

AI 安全攻防一体平台 — Shield 代码审计 + Spear 授权渗透测试

抓出 AI 漏掉的。攻破别人攻不破的。

**English version**: [`README_EN.md`](README_EN.md)

> ## 3 分钟快速上手
>
> 不想看长文档？**点这里 → [`docs/QUICKSTART.zh-CN.md`](docs/QUICKSTART.zh-CN.md)**（中文版）
>
> 下载 Release 里的 `deepsec-tui-windows.exe` → 双击 → 输入 `/shield scan 你的项目` → 2 秒看到漏洞。
> 不会用？仓库自带故意写满漏洞的示例文件 `demo/unsafe-ai-sample.ts`，扫它就能看到效果。

**DeepSec TUI 终端工作台**

https://github.com/user-attachments/assets/2b041a72-4566-48f1-aca8-2c685c0a52cc

— Shield 扫描、Spear 渗透、实时动画

## DeepSec 是什么？

DeepSec 是由 VibeGuard 进化而来的 AI 安全平台，将 **Shield**（AI 代码安全审计）与 **Spear**（授权渗透测试引擎）统一到一套 CLI、一个 TUI 终端工作台和一组 IDE 插件中。

```
┌──────────────────────────────────────────────────────────┐
│                      DeepSec Platform                     │
│                                                          │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│   │ Shield   │  │  Spear   │  │   TUI    │  │   MCP   │ │
│   │ Code     │  │ Pentest  │  │ Terminal │  │ Server  │ │
│   │ Audit    │  │ Engine   │  │ Workbench│  │         │ │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│        │             │             │              │       │
│        └─────────────┴─────────────┴──────────────┘       │
│                          │                               │
│              ┌───────────┴───────────┐                   │
│              │   Unified Config      │                   │
│              │   ~/.deepsec/         │                   │
│              │   config.yaml         │                   │
│              └───────────────────────┘                   │
└──────────────────────────────────────────────────────────┘
         │                              │
   ┌─────┴─────┐                  ┌─────┴──────┐
   │  VSCode   │                  │  JetBrains │
   │  Plugin   │                  │   Plugin   │
   │  (TS/LSP) │                  │  (Kotlin)  │
   └───────────┘                  └────────────┘
```

### Shield — 代码安全审计

从实时正则到 LLM 语义分析的三层检测架构：

### 层 · 检测内容 · 速度 · 原理
- **层**: **L1** · **检测内容**: 幻觉包、硬编码密钥、不安全配置、AI 错误模式 · **速度**: < 50ms · **原理**: 正则 + 熵分析 + 种子目录
- **层**: **L2** · **检测内容**: SQL 注入、XSS、SSRF、路径穿越、命令注入 · **速度**: < 2s · **原理**: Tree-sitter WASM AST 分析
- **层**: **L3** · **检测内容**: 缺失认证/限流/校验等语义漏洞 · **速度**: < 5s · **原理**: LLM（DeepSeek/Claude/OpenAI/Ollama）+ 本地启发式兜底

### Spear — 授权渗透测试

从 VulnClaw 迁移而来的端到端自动化渗透引擎：

- **Recon → Explore → Fact → Reflect → Report → PoC** 全流程自动化
- 40+ 内置技能包（nmap、dirsearch、subfinder、nuclei、sqlmap、ffuf、httpx、feroxbuster）
- 5 种角色（pentester、redteam、auditor、blueteam、ctf_player）
- 签名授权范围（Signed Scope），限时 + 审计日志
- 攻击链可视化，多格式报告（Markdown / SARIF / JSON / HTML）

### TUI — 终端工作台

基于 Rust + ratatui 构建的安全工作台，交互设计借鉴 DeepSeek-TUI：

- 三面板布局：工作区侧边栏 · 会话记录 · 漏洞检查器
- Plan / Agent / YOLO 模式切换
- 斜杠命令系统 + 命令历史回放
- Side-Git 快照（随时创建/恢复代码状态）
- 会话持久化（Ctrl+S 保存 / Ctrl+R 恢复）

## 快速开始

> **想 3 分钟跑起来？直接看 [`docs/QUICKSTART.zh-CN.md`](docs/QUICKSTART.zh-CN.md)（中文）** 或 [`docs/QUICKSTART.md`](docs/QUICKSTART.md)（English）——含"下载即用"的最快路径。

### 安装

```bash
# Python 核心 + CLI
pip install -e .

# Rust TUI（可选）
cargo build --manifest-path tui/Cargo.toml

# IDE 插件
# VSCode: 在项目根目录按 F5 启动 Extension Development Host
# JetBrains: cd jetbrains && ./gradlew buildPlugin
```

> **新手免编译路径**：直接去 [Releases](https://github.com/Unclecheng-li/DeepSec/releases) 下载 `deepsec-tui-windows.exe` / `deepsec-tui-linux` / `deepsec-0.2.0-py3-none-any.whl`，不用装任何编译环境。

### Shield 扫描

```bash
# 扫描项目（L1 + L2，离线）
deepsec shield scan ./src

# 开启 L3 语义分析（需要 LLM API Key）
DEEPSEEK_API_KEY=... deepsec shield scan ./src --layer l3

# 输出 SARIF 报告
deepsec shield scan . --format sarif --output deepsec.sarif

# 流式输出（供 TUI 消费）
deepsec shield scan . --stream

# Agent 配置审计
deepsec shield agent-audit ./agent-config

# 供应链安全检查
deepsec shield supply-chain check .
```

### Spear 渗透测试

```bash
# 1. （可选）维护授权白名单 — 推荐通过 TUI /scope 命令
#    或手动编辑 ~/.deepsec/targets/scope.json 的 targets 字段
#    如需强签名校验：export DEEPSEC_SCOPE_SIGNING_KEY=... && deepsec scope sign ./scope.json

# 2. 运行渗透测试（目标必须在白名单内）
deepsec spear run https://authorized-target.example --authorized ./scope.json

# 3. 仅侦察阶段
deepsec spear recon https://authorized-target.example --authorized ./scope.json

# 4. 列出角色和工具
deepsec spear roles
deepsec spear tools --role pentester
```

### TUI 终端工作台

```bash
# 启动终端工作台
deepsec tui

# 或直接运行 Rust 原生二进制
./tui/target/debug/deepsec-tui-native
```

内置 TUI 斜杠命令：

### 命令 · 说明
- **命令**: `/shield scan` · **说明**: 运行 Shield 扫描
- **命令**: `/spear run` · **说明**: 运行 Spear 渗透（需白名单授权）
- **命令**: `/spear recon` · **说明**: 运行侦察阶段
- **命令**: `/scope add <target>` · **说明**: 将目标加入授权白名单
- **命令**: `/scope remove <target>` · **说明**: 从白名单移除目标
- **命令**: `/scope list` · **说明**: 查看当前白名单
- **命令**: `/report` · **说明**: 生成报告
- **命令**: `/plan` · **说明**: 切换到 Plan 模式
- **命令**: `/agent` · **说明**: 切换到 Agent 模式
- **命令**: `/yolo` · **说明**: 切换到 YOLO 模式（全自动）
- **命令**: `/clear` · **说明**: 清空会话
- **命令**: `/help` · **说明**: 帮助

#### TUI 实操：添加白名单并启动渗透测试

DeepSec TUI 内置授权白名单管理 — 无需手动编辑 `scope.json` 或处理 HMAC 签名密钥。

**1. 启动 TUI**

```bash
deepsec tui
```

**2. 将目标加入白名单**

在 TUI 命令行（底部 `> ` 提示符）输入：

```
/scope add https://your-authorized-domain.com
```

- 目标会被规范化（scheme+host 转小写、去尾部 `/`）并去重，与后端授权匹配规则一致。
- 未指定 `--file` 时，默认取最近一次 `/spear run --authorized <file>` 解析出的绝对路径；若尚未运行过 spear，则回退到 `~/.deepsec/targets/scope.json`。
- 查看当前白名单：`/scope list`
- 移除目标：`/scope remove https://your-authorized-domain.com`

**3. 启动渗透测试**

```
/spear run https://your-authorized-domain.com --authorized ~/.deepsec/targets/scope.json
```

然后：

- 按 `Tab` 在 **Plan / Agent / YOLO** 执行模式间切换（YOLO 为全自动，无需逐步确认）。
- Plan 模式只读，无法直接武装 Spear — 需先切到 Agent 或 YOLO。
- 按 `Y` 确认授权校验并启动；按 `Esc` 取消。
- 运行中按 `Ctrl+C` 可**中止当前任务**（TUI 保持打开）；空闲时按 `Ctrl+C` 退出 TUI。

**4. 安全边界**

- 白名单之外的目标一律拒绝（`target ... is not present in the scope manifest`）。
- 私有/回环/非公网地址仍被阻止，防止打到内网。
- 白名单只接受你**拥有或已书面授权**的资产；任何不在 `targets` 里的第三方生产域名都无法被攻击。

### Side-Git 快照

```bash
# 创建快照
deepsec snapshot create . --mode shield --description "before-refactor"

# 列出快照
deepsec snapshot list .

# 恢复快照
deepsec restore <snapshot-id>
```

## 截图

实时诊断
悬停查看详情

![Real-time diagnostics](https://raw.githubusercontent.com/Unclecheng-li/DeepSec/main/media/demonstration/realtime-diagnostic.png)
![Hover tooltip](https://raw.githubusercontent.com/Unclecheng-li/DeepSec/main/media/demonstration/hover-tooltip.png)

Quick Fix 菜单
Problems 面板

![Quick Fix menu](https://raw.githubusercontent.com/Unclecheng-li/DeepSec/main/media/demonstration/quick-fix.png)
![Problems panel](https://raw.githubusercontent.com/Unclecheng-li/DeepSec/main/media/demonstration/problems-panel.png)

## 架构

DeepSec 是一个多语言项目：

### 组件 · 语言 · 文件数 · 代码量 · 用途
- **组件**: **Python 核心** · **语言**: Python 3.10+ · **文件数**: 153 · **代码量**: 43,500+ · **用途**: Shield 扫描器、Spear 引擎、CLI、MCP Server、角色/工具系统
- **组件**: **IDE 插件** · **语言**: TypeScript · **文件数**: 53 · **代码量**: 21,000+ · **用途**: VSCode 扩展、LSP Server、Tree-sitter SAST
- **组件**: **TUI** · **语言**: Rust · **文件数**: 22 · **代码量**: 2,470+ · **用途**: ratatui 终端工作台
- **组件**: **Rust LSP** · **语言**: Rust · **文件数**: 5 · **代码量**: 7,800+ · **用途**: 原生 L1 LSP 预览

### 项目结构

```
deepsec/                 # Python 核心
├── cli/                 # Typer CLI 入口（shield/spear/snapshot/config/scope）
├── config/              # 统一 YAML 配置 + Pydantic schema
├── core/                # 配置适配器、LLM 客户端、授权、快照、角色
├── shield/              # L1/L2/L3 扫描器、供应链安全、去重、忽略规则
├── spear/               # 渗透引擎（agent/intel/skills/report/warstories）
├── roles/               # YAML 角色定义（pentester/redteam/auditor/blueteam/ctf_player）
├── tools/               # YAML 工具目录（nmap/dirsearch/nuclei/sqlmap/...）
├── mcp/                 # MCP Server（lifecycle/registry/router/diagnostics）
├── report/              # 报告生成 + 攻击链可视化
├── kb/                  # 知识库
├── plugins/             # 插件系统
└── traffic/             # 流量回放与归一化

src/                     # TypeScript IDE 插件
├── extension.ts         # VSCode 扩展入口
├── lspServer.ts         # LSP Server（Node）
├── scanner.ts           # L1/L2 扫描器
├── deepsecBridge.ts     # Python 核心桥接
└── ...

tui/                     # Rust TUI 终端工作台
├── src/
│   ├── app.rs           # App 状态 + 命令分发
│   ├── events.rs        # 键盘事件处理
│   ├── ui/              # 三面板布局（transcript/findings/layout）
│   ├── views/           # Skills Manager 侧边栏
│   ├── theme.rs         # CodeWhale 深色主题
│   ├── sessions.rs      # 会话持久化
│   └── skills/          # Skill 树目录
└── Cargo.toml

rust-lsp/                # Rust 原生 L1 LSP 预览
jetbrains/               # JetBrains 插件（Kotlin）
docs/                    # 使用指南
```

## 配置

DeepSec 使用统一的 YAML 配置文件 `~/.deepsec/config.yaml`：

```bash
deepsec config init      # 初始化配置
deepsec config show      # 查看配置
deepsec config set llm.provider deepseek  # 设置配置项
```

### LLM 配置

DeepSec 支持 13+ 家 LLM 提供商：

### 提供商 · Base URL · 默认模型
- **提供商**: DeepSeek · **Base URL**: `api.deepseek.com/v1` · **默认模型**: `deepseek-chat`
- **提供商**: Anthropic Claude · **Base URL**: `api.anthropic.com/v1` · **默认模型**: `claude-sonnet-5`
- **提供商**: OpenAI · **Base URL**: `api.openai.com/v1` · **默认模型**: `gpt-4o`
- **提供商**: 智谱 GLM · **Base URL**: `open.bigmodel.cn/api/paas/v4` · **默认模型**: `glm-4.7`
- **提供商**: Kimi (Moonshot) · **Base URL**: `api.moonshot.cn/v1` · **默认模型**: `kimi-k2.6`
- **提供商**: 通义千问 · **Base URL**: `dashscope.aliyuncs.com/compatible-mode/v1` · **默认模型**: `qwen3-max`
- **提供商**: SiliconFlow · **Base URL**: `api.siliconflow.cn/v1` · **默认模型**: `deepseek-ai/DeepSeek-V4-Flash`
- **提供商**: 豆包 (ByteDance) · **Base URL**: `ark.cn-beijing.volces.com/api/v3` · **默认模型**: `Doubao-Seed-2.0-Pro`
- **提供商**: 百川 · **Base URL**: `api.baichuan-ai.com/v1` · **默认模型**: `Baichuan4-Turbo`
- **提供商**: MiniMax · **Base URL**: `api.minimaxi.com/v1` · **默认模型**: `MiniMax-M3`
- **提供商**: 阶跃星辰 · **Base URL**: `api.stepfun.com/v1` · **默认模型**: `step-3.5-flash`
- **提供商**: 商汤 · **Base URL**: `api.sensenova.cn/v1` · **默认模型**: `SenseNova-6.7-Flash-Lite`
- **提供商**: 零一万物 · **Base URL**: `api.lingyiwanwu.com/v1` · **默认模型**: `yi-lightning`
- **提供商**: 自定义 · **Base URL**: 自定义 · **默认模型**: 自定义

```bash
# 设置 API Key
deepsec config set llm.provider deepseek
deepsec config set llm.api_key "sk-xxx"

# 或通过环境变量
export DEEPSEC_LLM_API_KEY="sk-xxx"
```

### Spear 授权

Spear 以**授权白名单**为核心闸门：只有 `scope.json` 的 `targets` 数组中明确列出的目标才能被攻击，其余一律拒绝。

> **签名已改为可选**：早期版本要求用 `DEEPSEC_SCOPE_SIGNING_KEY` 对 `scope.json` 做 HMAC-SHA256 签名。现已放宽 — `signature` / `signer` 字段保留但忽略，授权只校验 `targets` 白名单（可选时间窗口仍会校验）。也就是说，你不再需要 `export` 密钥、重新签名或重启 TUI，直接用 TUI 的 `/scope` 命令管理白名单即可（见上文"TUI 实操"）。

白名单文件格式（`~/.deepsec/targets/scope.json`）：

```json
{
  "version": 1,
  "targets": ["https://your-authorized-domain.com"],
  "valid_from": "2026-07-26T00:00:00Z",
  "valid_until": "2026-08-25T00:00:00Z",
  "prohibited_cidrs": ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "127.0.0.0/8", "169.254.0.0/16"],
  "signer": "UncleC",
  "signature": "0000000000000000000000000000000000000000000000000000000000000000",
  "signature_algorithm": "hmac-sha256"
}
```

- `targets`：允许渗透的目标列表。支持 `https://domain`、`domain`、`*.domain` 通配符和裸 IP/CIDR。匹配时自动去尾部 `/`、转小写、对齐 scheme。
- `prohibited_cidrs`：默认阻止私有/回环/链路本地地址，防止打到内网。
- 如需保留强校验，可手动执行 `deepsec scope sign ./scope.json`（需要 `DEEPSEC_SCOPE_SIGNING_KEY`）；不签名不影响使用。

```bash
# （可选）手动签名
export DEEPSEC_SCOPE_SIGNING_KEY="your-secret"
deepsec scope sign ./scope.json

# 校验 scope 结构 / 时间窗口 / 可选签名
deepsec scope verify ./scope.json
```

## IDE 集成

### VSCode

VSCode 扩展提供实时诊断、Quick Fix 和 Findings 侧边栏：

### 设置项 · 默认值 · 说明
- **设置项**: `deepsec.enabled` · **默认值**: `true` · **说明**: 启用/禁用扫描
- **设置项**: `deepsec.scanOnChange` · **默认值**: `true` · **说明**: 编辑时扫描
- **设置项**: `deepsec.scanOnSave` · **默认值**: `true` · **说明**: 保存时扫描
- **设置项**: `deepsec.enableL2` · **默认值**: `true` · **说明**: 启用 L2 SAST
- **设置项**: `deepsec.l2DebounceMs` · **默认值**: `500` · **说明**: L2 防抖
- **设置项**: `deepsec.enableL3` · **默认值**: `false` · **说明**: 启用 L3 语义分析
- **设置项**: `deepsec.l3DebounceMs` · **默认值**: `2000` · **说明**: L3 防抖
- **设置项**: `deepsec.llmProvider` · **默认值**: — · **说明**: LLM 提供商
- **设置项**: `deepsec.deepsecPythonPath` · **默认值**: — · **说明**: DeepSec Python 路径
- **设置项**: `deepsec.dedupWithExistingTools` · **默认值**: `true` · **说明**: 与 SonarQube/Snyk/Semgrep/CodeQL 去重

**Quick Fixes：**
- 幻觉包 → 推荐替代包名
- 硬编码密钥 → 改为环境变量读取
- `yaml.load()` → `yaml.safe_load()`
- SQL f-string → 参数化查询
- `innerHTML` → `textContent`
- Debug/CORS/host 检查 → 机械修复

### JetBrains

JetBrains 插件通过 LSP 协议复用 DeepSec 诊断能力，支持 JetBrains 2025.2+：

```bash
cd jetbrains
./gradlew buildPlugin
# 输出: build/distributions/deepsec-*.zip
```

### Rust LSP 预览

独立的 Rust 原生 L1 LSP Server，用于更低延迟的基础检测：

```bash
cargo run --manifest-path rust-lsp/Cargo.toml -- --stdio
```

## CLI 参考

```bash
# Shield 命令
deepsec shield scan  [--layer all|l1|l2|l3] [--format text|json|sarif|markdown|html] [--stream]
deepsec shield agent-audit 
deepsec shield watch  [--interval 1.0]
deepsec shield supply-chain check  [--private-package pkg]

# Spear 命令
deepsec spear run <target> --authorized <scope.json> [--scope full|web|api|mobile] [--mode quick|standard|deep]
deepsec spear recon <target> --authorized <scope.json>
deepsec spear roles
deepsec spear tools [--role pentester]

# 快照命令
deepsec snapshot create  [--mode shield|spear] [--description "..."]
deepsec snapshot list 

# 配置命令
deepsec config init
deepsec config set <key> <value>
deepsec config show

# Scope 命令
deepsec scope sign <scope.json>      # （可选）签名 scope，需要 DEEPSEC_SCOPE_SIGNING_KEY
deepsec scope verify <scope.json>    # 校验 scope 结构 / 时间窗口 / 可选签名

# 其他
deepsec tui                          # 启动 TUI
deepsec chat                         # 交互式 Spear 工作台
deepsec tools                        # 列出所有工具
deepsec report <result.json> [--format markdown|json|sarif|html] [--chain]
deepsec restore <snapshot-id>
```

## 角色与工具

### 内置角色

### 角色 · 模式 · 说明
- **角色**: `pentester` · **模式**: standard · **说明**: 标准渗透测试
- **角色**: `redteam` · **模式**: deep · **说明**: 红队深度攻击
- **角色**: `auditor` · **模式**: standard · **说明**: 安全审计（只读）
- **角色**: `blueteam` · **模式**: quick · **说明**: 蓝队快速验证
- **角色**: `ctf_player` · **模式**: quick · **说明**: CTF 竞赛模式

### 内置工具

### 工具 · 分类 · 安装检查
- **工具**: nmap · **分类**: 网络 · **安装检查**: `nmap --version`
- **工具**: dirsearch · **分类**: Web · **安装检查**: `dirsearch --version`
- **工具**: subfinder · **分类**: 侦察 · **安装检查**: `subfinder -version`
- **工具**: httpx · **分类**: Web · **安装检查**: `httpx -version`
- **工具**: feroxbuster · **分类**: Web · **安装检查**: `feroxbuster --version`
- **工具**: ffuf · **分类**: Web · **安装检查**: `ffuf -V`
- **工具**: nuclei · **分类**: Web · **安装检查**: `nuclei -version`
- **工具**: sqlmap · **分类**: Web · **安装检查**: `sqlmap --version`

可通过 `deepsec/tools/*.yaml` 添加自定义工具，通过 `deepsec/roles/*.yaml` 添加自定义角色。

## MCP Server

DeepSec 内置 MCP（Model Context Protocol）Server，可被 Claude Desktop、Cursor 等 MCP 客户端调用：

```python
from deepsec.mcp import MCPServer

server = MCPServer()
server.run()
```

支持的工具包括 Shield 扫描、Spear 侦察、报告生成等。

## 测试

```bash
# Python 测试
python -m pytest tests/deepsec/ -v

# TypeScript 测试
npm test

# Rust TUI 测试
cargo test --manifest-path tui/Cargo.toml

# Rust LSP 测试
cargo test --manifest-path rust-lsp/Cargo.toml
```

当前状态：**23 个 Python 测试通过 · 41 个 Rust TUI 测试通过 · TypeScript 干净**

## Docker

```bash
docker build -t deepsec:local .
docker run --rm -v "$PWD:/workspace" deepsec:local shield scan /workspace
```

## 参与贡献

```bash
git clone https://github.com/Unclecheng-li/DeepSec.git
cd DeepSec

# Python 开发环境
pip install -e .[dev]

# Node.js IDE 插件开发
nvm use  # Node.js 22 LTS
npm install
npm run build

# Rust TUI 开发
cargo build --manifest-path tui/Cargo.toml
```

- **报 Bug** — [Open an issue](https://github.com/Unclecheng-li/DeepSec/issues)
- **提需求** — [Start a discussion](https://github.com/Unclecheng-li/DeepSec/discussions)
- **提交 PR** — Fork、功能分支、Pull Request

## 文档

- [快速上手（中文）](docs/QUICKSTART.zh-CN.md) — 3 分钟跑起来
- [Quick Start (English)](docs/QUICKSTART.md) — Get running in 3 minutes
- [架构](docs/architecture.md) — 系统架构细节
- [Shield 指南](docs/shield-guide.md) — 代码审计指南
- [Spear 指南](docs/spear-guide.md) — 渗透测试指南
- [Skill 开发](docs/skill-development.md) — 技能包开发
- [工具配置](docs/tool-config.md) — 工具配置
- [DeepSeek 优化](docs/deepseek-optimization.md) — DeepSeek 模型优化
- [迁移设计](doc/DeepSec-改造设计文档.md) — VibeGuard 到 DeepSec 迁移设计
- [TUI 开发文档](doc/DeepSec-TUI开发文档.md) — TUI 开发指南