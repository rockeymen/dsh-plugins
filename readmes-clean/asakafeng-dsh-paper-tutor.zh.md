# dsh-paper-tutor（论文精读 Agent 预设）

面向**中文读者**的英文论文精读 Agent 预设插件，为 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) 提供：

- **`paper-tutor` Agent 预设（论文精读）**：中文讲解型人格 + 精读工作流提示词 + 随附 `paper-reading` skill。插件启动时自动安装到 `$DSH_HOME/.agent-presets/paper-tutor/`，在会话预设选择器中直接可选。
- **4 个论文工具**（仅对选用该预设的会话生效）：

### 工具 · 作用
- **工具**: `paper_scan` · **作用**: 盘点工作区论文资产：PDF / LaTeX / 图表图片 / 论文代码 / 数据
- **工具**: `pdf_extract` · **作用**: 纯 JS 提取 PDF 全文（按页、保留版式与双栏顺序）与内嵌图表（自动匹配 caption）
- **工具**: `tex_structure` · **作用**: 解析 LaTeX 结构：章节大纲、图表浮动体、公式、定理、引用键、`\input` 包含关系
- **工具**: `paper_figure` · **作用**: 从 PDF 提取图表并（可选）调用视觉端点解读图表内容

目标用户：**以中文为母语、可能对英文论文 / 术语 / 数学推导感到吃力**的学习者。预设默认按"零基础也能听懂"讲解，支持**速览 / 精读 / 溯源（对照代码）/ 批判**四层深度，产出论文卡片、术语表与论文↔代码对照表。

## 特性

- **零 npm 运行时依赖**：PDF 文本/图片提取为纯 JS 实现（node 内置 zlib），跨平台开箱即用；检测到 `pdftotext`（poppler-utils）时自动使用它加速并提升版式质量（`config.pdftotext: "auto"`，可关）。
- **图表提取**：从 PDF 页面提取内嵌图片（Flate/DCT/Indexed/CMYK/1–16bit），写为 PNG/JPEG 到 `.paper-figures/`，并启发式匹配 "Fig. 1: …" 标题。
- **图表解读**：可选 OpenAI 兼容视觉端点（与 [dsh-tool-vision](https://github.com/Scorp1o117/dsh-tool-vision) 同款配置约定）；未配置时优雅降级为返回图片路径，供多模态模型直接读取或用户查看。
- **幂等安装**：预设安装器只在版本变化时升级（旧版自动备份为 `.bak-<时间戳>`），从不覆盖未标记的用户自建目录。

## 一键安装

### 方式 A：远程安装（推荐，无需克隆仓库）

```bash
curl -fsSL https://raw.githubusercontent.com/ASAKAFENG/dsh-paper-tutor/main/scripts/install.sh | bash -s -- --github
```

脚本会自动：下载最新 Release → 解压装配进 profile（`$DSH_HOME/profiles//node_modules/` + `dsh.profile.bundles` 注册，默认 profile 为 `web`，可用 `--profile <name>` 指定）→ 安装预设到 `$DSH_HOME/.agent-presets/paper-tutor/`。幂等，重复执行安全。

Windows（PowerShell 5.1+/7）：

```powershell
irm https://raw.githubusercontent.com/ASAKAFENG/dsh-paper-tutor/main/scripts/install.ps1 -OutFile install.ps1
powershell -ExecutionPolicy Bypass -File scripts/install.ps1 -Github
```

### 方式 B：本地安装（克隆仓库后）

```bash
git clone https://github.com/ASAKAFENG/dsh-paper-tutor.git
bash dsh-paper-tutor/scripts/install.sh            # 本地装配（link: 指向克隆目录，便于开发）
```

### 方式 C：作为 profile bundle（手动）

```bash
# 在插件仓库目录构建
bash scripts/build.sh

# 装配进 profile（以 web profile 为例）——加入 dependencies link: + bundles 列表、
# 建 node_modules junction
# 在 DSH 内可用 dev_install_package 注入器；手动方式：
#   编辑 profile 的 package.json：
#     "dependencies": { "@dsh-external/dsh-paper-tutor": "link:<本目录>" },
#     "dsh": { "profile": { "bundles": [ ..., "@dsh-external/dsh-paper-tutor" ] } }
#   然后重启 dsh
```

**三种方式任选其一，然后重启 DSH**：bundle 层装配后，安装器把 `paper-tutor` 预设写入 `$DSH_HOME/.agent-presets/`，新开会话即可在预设选择器中选择「论文精读 · Paper Tutor」。

> 卸载：从 profile 的 `package.json` 移除 `dependencies`/`dsh.profile.bundles` 条目，删除 `node_modules/@dsh-external/dsh-paper-tutor` 与 `$DSH_HOME/.agent-presets/paper-tutor`。

### 发布为 marketplace 插件

`npm pack` 产出 tgz 后按 DSH marketplace 规范发布；包内 `cordis.patch.yml` 会在装配时自动注册安装器（安装器同时把预设装入 `$DSH_HOME/.agent-presets/`）。

## 配置

插件行（`cordis.patch.yml` 或预设 `agent.cordis.yml` 的 `config`）：

### 键 · 默认 · 说明
- **键**: `installPreset` · **默认**: `false` · **说明**: host 面：安装/升级随包预设
- **键**: `pdftotext` · **默认**: `"auto"` · **说明**: `auto`/`on`/`off`：是否优先使用 poppler 的 pdftotext
- **键**: `imageDir` · **默认**: `".paper-figures"` · **说明**: 图表输出目录（相对会话工作区）
- **键**: `maxPdfBytes` · **默认**: 200MB · **说明**: 单次解析的 PDF 大小上限
- **键**: `visionBaseURL` · **默认**: `""` · **说明**: OpenAI 兼容视觉端点（如 `https://dashscope.aliyuncs.com/compatible-mode/v1`）
- **键**: `visionApiKey` · **默认**: `""` · **说明**: API Key（优先于环境变量）
- **键**: `visionApiKeyEnv` · **默认**: `"VISION_API_KEY"` · **说明**: 存放 Key 的环境变量名
- **键**: `visionModel` · **默认**: `"gpt-4o-mini"` · **说明**: 视觉模型名
- **键**: `visionMaxTokens` · **默认**: 2048 · **说明**: 视觉回答上限 token
- **键**: `visionTimeoutMs` · **默认**: 90000 · **说明**: 视觉调用超时（毫秒）

视觉端点也可用环境变量配置：`PAPER_TUTOR_VISION_BASE_URL`、`PAPER_TUTOR_VISION_API_KEY`、`PAPER_TUTOR_VISION_MODEL`。未配置时 `paper_figure` 返回图片路径并给出引导，不会报错。

## 使用示例

1. 开一个「论文精读 · Paper Tutor」会话，工作区放好论文 PDF（或 LaTeX 源码 + 代码）。
2. 说："精读这篇论文" 或 "帮我看一下 xxx.pdf，讲清楚方法部分"。
3. Agent 会自动：`paper_scan` 盘点 → `pdf_extract` 建论文卡片 → 逐节讲解 → `paper_figure` 读图 → 对照工作区代码 → 输出精读笔记。

建议把论文配套代码放在同一工作区（或子目录），溯源讲解效果最佳。

### 插件市场

本插件已关联 DSH 插件市场（索引：`bradeGithub/DSH-Plugins-Marketplace`，按 `topic:dsh-plugin` 聚合、每 2 小时自动刷新）：

- 仓库 topics：`dsh-plugin` `deepseek-harness` `dsh` `paper-reading` `pdf` `latex` `academic` `agent-preset` `llm`
- 市场页搜索 `paper-tutor`（或 `dsh-paper-tutor`）即可找到；市场按 **cordis-plugin** 管线安装（根目录刻意不放 install 脚本以避免误判为脚本型；包声明 `dsh.plugin` + `bundle.patch` + `scripts.build`，市场会克隆仓库 → 检测到未构建的 `lib/` 自动执行 `npm run build` → 注册 bundle → 重启生效），预设由插件运行时自动安装到 `$DSH_HOME/.agent-presets/`，卸载可回滚
- 市场安装同样会触发包内安装器：`$DSH_HOME/.agent-presets/paper-tutor/` 自动就位

> 若刚发布/刚加 topic 暂时搜不到，等市场索引刷新（≤2 小时）或先用上方一键安装命令。
## 环境依赖与配套插件

### 系统依赖（本机）

### 级别 · 依赖 · 说明
- **级别**: 必需 · **依赖**: Node.js ≥ 22 · **说明**: DSH 运行时本身的要求（插件 engines 声明同款）；安装脚本也复用 node
- **级别**: 必需 · **依赖**: DSH 0.1.x rc 系列 · **说明**: 依赖 `dsh.profile.bundles` 装配机制；profile 布局 `$DSH_HOME/profiles/<name>/`
- **级别**: 安装必需 · **依赖**: bash ≥ 3.2（Linux/macOS）或 PowerShell 5.1+ / Windows 10 1803+（tar.exe） · **说明**: 一键安装脚本环境
- **级别**: 安装必需 · **依赖**: curl（或 node ≥ 18 的 fetch 兜底）+ tar · **说明**: 远程下载与解压
- **级别**: 强烈推荐 · **依赖**: poppler-utils（`pdftotext`） · **说明**: 文本提取更快、版式/双栏更准；缺失时自动回退内置纯 JS 引擎
- **级别**: 可选 · **依赖**: OpenAI 兼容视觉端点 · **说明**: `paper_figure` 的图表解读能力（见下文"视觉端点"）
- **级别**: 可选 · **依赖**: 网络可达 GitHub · **说明**: 远程一键安装需要；离线可用本地模式（克隆/拷贝后安装）

poppler-utils 安装（一行命令）：

```bash
# Debian / Ubuntu
sudo apt install -y poppler-utils
# RHEL / Fedora
sudo dnf install -y poppler-utils
# macOS（Homebrew）
brew install poppler
# Windows（Scoop / Chocolatey）
scoop install poppler
choco install poppler
```

> 验证：`pdftotext -v`。不装也不影响使用——`pdf_extract` 自动检测并降级为内置引擎（`config.pdftotext` 可强制 on/off）。

### 配套 DSH 插件（可选，推荐）

### 插件 · 推荐度 · 与本插件的关系
- **插件**: [dsh-tool-vision](https://github.com/Scorp1o117/dsh-tool-vision)（视觉模型） · **推荐度**: ⭐ 强烈推荐 · **与本插件的关系**: 提供 `inspect_image` 工具、**Web UI 设置栏**（可视化配置视觉端点）与图片桥接（粘贴的图片自动转文字提示）。`paper_figure` 提取出图表后，若本插件未配置视觉端点，模型可改调 `inspect_image` 读图。两端点配置约定一致（默认读取 `VISION_API_KEY` 环境变量），装了它再配一个视觉端点，图表解读开箱即用
- **插件**: [dsh-tdai-memory](https://github.com/Scorp1o117/dsh-tdai-memory)（跨会话记忆） · **推荐度**: 可选 · **与本插件的关系**: 长期读论文时累积术语表/笔记，新会话可直接延续之前的阅读上下文
- **插件**: dsh-plugin-marketplace（插件市场） · **推荐度**: 可选 · **与本插件的关系**: DSH 官方插件市场，装上述插件最方便：`dsh plugin add <name>`

> 以上均为可选。**不装任何配套插件，paper-tutor 也能独立工作**（PDF/LaTeX/图表提取全内置；图表解读降级为返回图片路径）。

### 视觉端点（可选）配置对照

`paper_figure` 与 dsh-tool-vision 共用同一套约定，任选一种配置方式：

### 配置途径 · 键/变量 · 示例
- **配置途径**: 环境变量（本插件） · **键/变量**: `PAPER_TUTOR_VISION_BASE_URL` / `VISION_API_KEY` / `PAPER_TUTOR_VISION_MODEL` · **示例**: `https://dashscope.aliyuncs.com/compatible-mode/v1` / `sk-...` / `qwen-vl-max`
- **配置途径**: 插件 config（本插件预设行） · **键/变量**: `visionBaseURL` / `visionApiKey` / `visionModel` · **示例**: 同上
- **配置途径**: dsh-tool-vision Web UI 设置 · **键/变量**: 设置页"tool-vision"分区 · **示例**: 同一端点，UI 可视化编辑、热生效

常见免费/低门槛端点：DashScope（阿里云百炼，qwen-vl 系列）、智谱 GLM-4V、Ollama 本地（`llava`/`qwen2.5vl` 等）。
## 开发

```bash
bash scripts/build.sh   # 装配 lib/ + 链接运行时依赖（Windows 用 Git Bash/WSL）
node test/pdf-smoke.mjs # PDF 引擎冒烟测试（生成合成 PDF 验证提取）
```

## 许可证

MIT