# 🧠DeepSeek Harness 的 BrainAgent

![BrainAgent](assets/banner.png)

**认知架构作为插件：dsh 代理的记忆、情感、动机、学习和自主权。**

[英文版如下](#english)

## 这是什么

**BrainAgent** 是 [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness)) 的插件，它将全职代理从一次性任务的执行者转变为**长寿的个人助理**，其内部认知系统以大脑原理为模型。

〜60 个模块，与平台的 6 个集成点，**654 个单元测试**，一切都在标准 dsh 挂钩之上运行 - 无需进行任何内核更改。

## 特点

### 💾 记忆
- **情景** - 具有情感和重要性的对话事件
- **语义** - 具有修订历史的稳定事实
- **程序** - 学习的动作场景（“如何回答/如何做”）
- 繁殖过程中的强化（赫布法则），无关的衰减
- 本地存储在磁盘上 - **您的数据永远不会离开机器**

### 🎭 情感和同理心
- 杏仁核对信息的情感色彩进行分类
- 镜像神经元建立对话者的模型（情绪、风格、专业知识）
- 情感记忆存储生动的时刻（“闪光灯”）

### 📚 训练
- 每轮对话都以一个学习周期结束
- 多巴胺系统强化成功的策略
- 基底神经节形成具有成功评级的习惯

### ⚡ 自治
- 四种驱动力：社交、认知、创造力、掌握
- 重要冲动 - 当代理人有话要说（目标、见解、愿望）时，他自己会写信给您
- 目标堆栈驱动长期目标，好奇心驱动发现知识差距
- DMN“在后台思考”，自主研究本身寻找信息
- 内置保险丝：主动消息之间至少间隔 10 分钟，循环断路器

### 🌙自我调节
- 昼夜节律和梦想模式 - 晚上代理“睡觉”并巩固记忆
- 注意力门按相关性过滤上下文（保存令牌）
- 代币经济和丘脑门允许简单的消息传递，而无需昂贵的 LLM 调用
- 代谢预算监控模块资源消耗

### 🪞 个性
- 特工身份：自传记忆、经验教训、能力概况
- Qualia Simulator：当前主观状态
- 时间绑定：时间的连续感

## 安装

### 选项 1：作为封装 dsh（推荐）

一条命令 - 插件将直接从 GitHub 下载：

```sh
npx @deepseek-ai/dsh plugin --profile web add github:stas130286-blip/dsh-brainagent
```

然后启动 Web UI：

```sh
npx @deepseek-ai/dsh web
```

> 该软件包包含一个现成的组装模块 (`lib/index.js`) - 从 GitHub 安装不需要任何组装或脚本权限。

### 选项 2：来自本地副本（用于开发）

```sh
git clone https://github.com/stas130286-blip/dsh-brainagent.git
npx @deepseek-ai/dsh plugin --profile web add ./dsh-brainagent
npx @deepseek-ai/dsh web
```

或者使用覆盖层连接源（从 `--patch` 运行）：

```yaml
- insert:
    - id: brainagent
      name: file:///абсолютный/путь/к/dsh-brainagent/src/index.ts
      config: {}
```

## 用法

与代理交谈 - BrainAgent 自动打开。聊天中可用的命令：

### 团队 · 做什么
- **命令**：`/brain status` · **它的作用**：所有系统状态的完整报告
- **命令**：`/brain memory <запрос>` · **它的作用**：内存搜索
- **团队**：`/brain goals` · **它做什么**：当前目标
- **团队**：`/brain neuro` · **它的作用**：神经调节剂（多巴胺等）
- **团队**：`/brain habits` · **它的作用**：习得的习惯
- **团队**：`/brain learning` · **它的作用**：学习周期和见解
- **命令**：`/brain circadian` · **它的作用**：昼夜节律和睡眠
- **命令**：`/brain dream` · **它的作用**：开始内存整合

...以及其他：`predict`、`pathways`、`personality`、`metabolic`、`emergent`。

所有模块均通过配置方案（39 个标志）进行配置 - 任何组件都可以禁用：

```yaml
- id: brainagent
  name: dsh-brainagent
  config:
    autonomousMinGapMs: 1800000   # пауза между проактивными сообщениями (30 мин)
    modules:
      actionDispatcher: false     # например, отключить автономию
```

## 测试

```sh
pnpm install        # из корня monorepo dsh
pnpm vitest run     # 33 файла, 654 теста
```

## 架构

加工后的dsh `message`通过输送机：

```
Thalamus (классификация) → Amygdala (эмоции) → Hippocampus (извлечение памяти)
→ Prefrontal Cortex (решение, fast/slow path) → контекстная инъекция (pre-step)
→ Cerebellum (оценка качества после ответа) → цикл обучения
```

所有模块通过内部事件总线交换类型信号
（Corpus Callosum），独立定时器通过 `ctx.effect` 运行。

## 要求

- DeepSeek Harness (dsh) 支持 Cordis 插件
- Node.js 22+
- PNPM

## 许可证

**BrainAgent 非商业许可证** - 供所有人免费非商业使用；
仅在与作者同意的情况下用于商业用途。更多详细信息请参见[LICENSE](LICENSE)。

##英语

**BrainAgent** 是 [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness)] 的插件，它将股票代理变成具有受大脑启发的认知系统的长寿个人助理。

〜60 个模块，6 个平台集成点，**654 个单元测试**，完全在库存 dsh 挂钩上运行 - 零核心更改。

**亮点**

- **记忆** — 情景性、语义性和程序性；赫布强化、衰变、仅限本地存储
- **情绪和同理心** — 杏仁核分类、镜像神经元用户建模、闪光灯记忆
- **学习** — 每回合学习周期、多巴胺强化、习惯形成
- **自主性** — 四个驱动器、带有防循环保护的主动消息（Vital Impulse）、目标堆栈、好奇心、背景 DMN 见解
- **自我调节** — 昼夜节律、梦想模式整合、注意力门代币预算、代币经济
- **个性** — 特工身份、Qualia 模拟器、时间绑定

**安装** — 一个命令，直接从 GitHub 获取：

```sh
npx @deepseek-ai/dsh plugin --profile web add github:stas130286-blip/dsh-brainagent
npx @deepseek-ai/dsh web
```

或者从本地克隆：

```sh
git clone https://github.com/stas130286-blip/dsh-brainagent.git
npx @deepseek-ai/dsh plugin --profile web add ./dsh-brainagent
```

提供预构建的捆绑包 (`lib/index.js`) — git 安装不需要构建步骤，也不需要脚本权限。

**命令**：`/brain status`、`/brain memory <query>`、`/brain goals`、`/brain neuro`、`/brain habits`、`/brain learning`、`/brain circadian`、`/brain dream` 等

**测试**：`pnpm vitest run` — 33 个文件，654 个测试

**许可证**：BrainAgent 非商业许可证 — 供所有人免费非商业使用；商业用途需与作者同意。请参阅[许可证](LICENSE)。