# AI基础设施代理技能

> **⚠️警告**
> 该项目正在积极开发中，由法学硕士大量生成，未经严格校对。请谨慎使用，并在生产使用前验证所有代码。

人工智能基础设施工程师的专业代理技能集合，涵盖技术开发（GPU 内核、分布式训练、推理优化）和软技能（流程图创建、演示设计）。

## 概述

该存储库提供为人工智能基础设施工程量身定制的专家级技能。每项技能都包含领域知识、代码示例和最佳实践，可将 Claude 转变为特定框架和工作流程的专业助理——从编写高性能 CUDA 内核到创建专业技术演示。

### 构造方法（除非另有说明）

1. **知识收集**：使用Gemini DeepResearch收集有关目标框架的全面、最新的信息
2. **技能发展**：使用 Claude Code 中的 `skill-creator` 将研究转化为结构化技能
3. **验证**：测试技能生成的代码示例以确保正确性
4. **维护**：根据最新官方文档定期更新

## 可用技能

### TileLang 开发人员
使用 TileLang 为 NVIDIA、AMD 和 Ascend 硬件编写高性能 GPU 内核。

**能力：**
- 矩阵乘法（GEMM）内核
- FlashAttention 实现
- DeepSeek MLA 运算符
- 性能优化（混合布局、管道、扭曲专业化）
- 跨平台内核开发

**状态：** ✅ 完成

### 威震天内存估算器
估算基于威震天的 MoE 和密集模型的 GPU 内存使用情况。建立在 [megatron_memory_estimator](https://huggingface.co/spaces/ISEEKYAN/megatron_memory_estimator) 之上。

**能力：**
- 从 HuggingFace 配置估计内存
- 支持 MoE 模型（DeepSeek-V3、Qwen 等）
- 并行策略比较（TP/PP/EP/CP）
- 内存优化建议

**状态：** ✅ 完成

### 史莱姆用户
使用 SLIME（用于 RL 扩展的 LLM 后培训框架）的指南。建立在 [THUDM/slime](https://github.com/THUDM/slime) 之上。

**能力：**
- RL 训练设置和配置（GRPO、GSPO、PPO、Reinforce++）
- 多轮工具调用和代理工作流程
- 自定义奖励模型和生成函数
- 威震天和 FSDP 后端配置
- SGLang集成和优化
- 动态采样和部分推出
- 多节点分布式训练

**状态：** ✅ 完成

提示创建此技能，使用 Sonnet 4.5：

````
在此存储库中使用技能创建器创建名为 slime-user 的技能。史莱姆是法学硕士
强化学习扩展的训练后框架。它的仓库是 https://github.com/THUDM/slime.

技能创建流程：

1. Git克隆最新的repo
2. 分析`docs/en`，了解基本结构并为用户编写文档导航指南
入门或查找高级使用文档
3. 从文档和 `examples` 目录中收集有价值的示例，编写关键想法和脚本
向下的路径以供快速参考
4.查看一些重要的源代码，例如`slime/slime/utils/arguments.py`和
`slime/rollout/sglang_rollout.py`，提供其路径和功能，方便快速查找。
```

### TikZ Flowchart
Create professional flowcharts and architecture diagrams using LaTeX TikZ with standardized styles.

**Capabilities:**
- Professional flowcharts with Google Material-like color palette
- Standardized node types (data, memory, operation, kernel boxes)
- Architecture diagrams and process flows
- Grouping and layout best practices
- Clean orthogonal edges and relative positioning

**Example Output:** [QAT Flowchart](gallery/qat_flowchart.pdf) | [Anthropic Theme](gallery/tikz_flowchart_anthropic_theme.png)

![TikZ Flowchart Anthropic Theme](gallery/tikz_flowchart_anthropic_theme.png)

**Status:** ✅ Complete

### Material You Slides
Create presentation slide decks using Material You (Material Design 3) design language.

**Capabilities:**
- Self-contained HTML slides (1280x720) with M3 color tokens
- Roboto typography with multiple weight support
- Professional slide types (title, section divider, content)
- Component library (cards, flow diagrams, metric cards, code blocks)
- Rounded shapes and generous whitespace
- Surface hierarchy without drop shadows
- Structured layouts (columns, tables, lists, tags/chips)

**Example Output:** [SLIME RL Training Slides](gallery/slime_rl_slides.pdf)

**Status:** ✅ Complete

### Anthropic Theme Flowchart
Create polished standalone HTML/CSS flowcharts with Anthropic-inspired pastel styling, reliable geometry, and deterministic connector routing.

**Capabilities:**
- TS-first flowchart specs that generate standalone HTML artifacts
- Deterministic node geometry and anchor-based connector routing
- Transparent dashed grouping frames and pastel role-based node styling
- Hollow `>` 箭头和正交桥连接器
- 从同一几何源生成的画廊就绪导出

**示例输出：** [查看演示 PNG](gallery/anthropic_theme_flowchart_review_demo.png)

![人择主题流程图回顾演示](gallery/anthropic_theme_flowchart_review_demo.png)

**状态：** ✅ 完成

### HF 架构 TikZ
为任何仅 HuggingFace 解码器的 LLM 生成 Sebastian-Raschka 画廊风格的 TikZ 架构图，其中包含每个块的参数公式和具体数字。

**能力：**
- 将 HuggingFace 配置中的架构提取为结构化规范
- 通过 Jinja 模板渲染出版质量的垂直 TikZ 图
- 用参数公式和具体数字注释每个子块
- 支持 MHA、GQA、MLA、超连接、稀疏注意力和学习索引器
- 覆盖密集和 MoE FFN（包括哈希路由）和 MTP 头
- 型号：DeepSeek-V4-Flash、Qwen、Llama、Mistral、gpt-oss 等。

**示例输出：** [DeepSeek-V4-Flash PNG](hf-architecture-tikz/examples/deepseek-v4-flash/deepseek-v4-flash.png) | [PDF](hf-architecture-tikz/examples/deepseek-v4-flash/deepseek-v4-flash.pdf)

![DeepSeek-V4-闪存架构](hf-architecture-tikz/examples/deepseek-v4-flash/deepseek-v4-flash.png)

**状态：** ✅ 完成

### OpenAI 网络可视化
以 OpenAI 的博客/研究/系统卡“dotcom”视觉风格构建图形，以零依赖性的独立 HTML/SVG 形式发出。

**能力：**
- 单色条形图（深色同色调描边、圆角、带向外刻度的黑色 y 轴、无网格线、圆形图例标记、条形上方的值标签、有角度的类别标签）
- 流程/过程图（圆形框、等宽大写药丸、粉红色高光、薄的开放 V 形连接器、虚线负分支）
- 真正的 OpenAI Sans 排版，具有零外部依赖性

**状态：** ✅ 完成

## 计划技能

### SGLang 开发人员
SGLang（结构化生成语言）运行时和优化的开发技能。

**计划能力：**
- SGLang运行时配置
- 定制采样策略
- LLM 推理的性能调整
- 多GPU服务优化

**状态：** 🚧 计划中

### vLLM 开发人员
vLLM 引擎开发和部署技能。

**计划能力：**
- PagedAttention 实现
- 自定义调度程序开发
- 多LoRA服务
- 量化积分

**状态：** 🚧 计划中

## 用法

### 安装技巧

技能的安装是将技能目录放在Claude的技能路径中：

**自然语言：**
直接问Claude Code：“帮我安装https://github.com/yzlnew/infra-skills"的技能

**个人（跨所有项目）：**
```bash
# Clone and copy to personal skills directory
git clone https://github.com/yzlnew/infra-skills.git
mkdir -p ~/.claude/skills
cp -r infra-skills/tilelang-developer ~/.claude/skills/
cp -r infra-skills/megatron-memory-estimator ~/.claude/skills/
cp -r infra-skills/slime-user ~/.claude/skills/
cp -r infra-skills/tikz-flowchart ~/.claude/skills/
cp -r infra-skills/material-you-slides ~/.claude/skills/
cp -r infra-skills/anthropic-theme-flowchart ~/.claude/skills/
cp -r infra-skills/hf-architecture-tikz ~/.claude/skills/
```

**项目级别（对于存储库协作者）：**
```bash
# Clone and copy to project's skills directory
cd your-project
git clone https://github.com/yzlnew/infra-skills.git .claude/skills-repo
mkdir -p .claude/skills
cp -r .claude/skills-repo/tilelang-developer .claude/skills/
cp -r .claude/skills-repo/megatron-memory-estimator .claude/skills/
cp -r .claude/skills-repo/slime-user .claude/skills/
cp -r .claude/skills-repo/tikz-flowchart .claude/skills/
cp -r .claude/skills-repo/material-you-slides .claude/skills/
cp -r .claude/skills-repo/anthropic-theme-flowchart .claude/skills/
cp -r .claude/skills-repo/hf-architecture-tikz .claude/skills/
```

当检测到相关任务时，技能会自动激活。

### 示例

**TileLang 内核开发：**
````bash
# 用户请求：
“编写针对 A100 优化的 FP16 矩阵乘法内核”

# 克劳德加载