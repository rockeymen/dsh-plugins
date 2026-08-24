#dsh-learning-bundle

> [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的非官方社区捆绑包。

**DSH 的校样校正环。** 将校正记录为
候选人，慎重采用，仅在正确的情况下回忆
配置文件/工作区/会话，并重建每个模型可见的交付
会话日志。

![已验证的DSH rc.2 run](./docs/demo.svg)的终端式总结

这是一个故意缩小的 Stage 0+1 版本。它不会自动生成
记忆，默默地激活它们，或者声称是一个通用的 RAG 系统。

## 60 秒的证明

相同的无头任务在 DSH 上通过真实插件运行两次
`v0.1.1-rc.2`：

### 手臂 · 学习项目 · 模型可见注入 · 最终响应
- **手臂**：L− · **学习项目**：候选 · **模型可见注射**：0 · **最终响应**：`npm install`
- **手臂**：L+ · **学习项目**：明确采用 · **模型可见注入**：1 · **最终响应**：`pnpm install`

另一个配置文件收到零注入，五个显式 npm/Yarn 覆盖
获胜，L+ 交付是根据持久会话日志重建的。阅读
[当前机器可读的文字记录](./benchmark/results/assembled-transcript-current.json)
或者自己运行快速公共合约：

```sh
git clone --depth 1 --branch v0.3.0 https://github.com/B1lli/dsh-learning-bundle.git
cd dsh-learning-bundle
npm test && npm run benchmark
```

## 适合谁

该捆绑包适用于反复纠正编码代理并需要
调整以在下一个交易日中生存下来，而不会成为隐形的全球
规则：DSH重度用户、独立开发者、专业工程师、
插件/平台作者验证代理行为。

痛苦是累积的而不是戏剧性的：重复的教学浪费了时间，
过于宽泛的记忆会默默地改变不相关的工作，不透明的回忆会让
下一个错误很难诊断。对于经常使用代理的用户来说，这是
高频信任和生产力失败。

## 为什么这个而不是“更多内存”

代理更正只有在可以安全重用时才有用。一个全球性的、
不可见的内存可能会将一个项目的惯例泄漏到另一个项目中；不透明的
即时注入难以审计；自动激活可能会变坏
猜测成为一个持久的规则。

该捆绑包使用四个具体边界：

- 新项目保持 `candidate` 直到明确的 `adopt`；
- 配置文件、工作区和会话范围无法关闭；
- 当前的显式指令会覆盖习得的默认指令；
- 召回的项目记录为 `user/message` 记录
  `source.kind = dsh-learning-recall`。

检查的 rc.2 证据还表明了一个可观察到的差异：
相同的任务在采用之前生成 `npm install`，在采用之后生成 `pnpm install`
所采用的规则已交付。

### 方法 · 它优化了什么 · 这个捆绑包的不同之处
- **方法**：通用内存/RAG · **它优化了什么**：广泛的存储和检索 · **此捆绑包的不同之处**：显式采用、故障关闭范围、当前指令覆盖
- **方法**：`AGENTS.md` / 静态指令 · **它优化了什么**：人工编写的存储库策略 · **此捆绑包的不同之处**：记录/采用/召回生命周期加上每次交付收据
- **方法**：[dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) · **它优化了什么**：具有 Web UI 和多个提供程序的完全受监督的内存控制平面 · **此捆绑包的不同之处**：此捆绑包是无依赖性的，并且故意限制为校正交付
- **方法**：[dsh-continual-evolve](https://github.com/ZK-Andy/dsh-continual-evolve) · **它优化了什么**：版本化自我演化、批准、回滚和基准接受 · **此捆绑包的不同之处**：此捆绑包发布了一个较小的候选者→采用带有每次交付收据和相同任务 L−/L+ 证明的合约
- **方法**：这个捆绑包 · **它优化了什么**：狭隘的校正交付参考 · **这个捆绑包的不同之处**：配置文件/工作空间/会话失败关闭召回、因果 L−/L+ 证明和日志重建

Agent-Memory类别不为空，上面的项目比较有能力
广泛记忆或自我进化的选择。该项目的市场范围较窄
假设插件作者和有评估意识的用户也看重小的，
证明校正仅在以下情况下才达到模型的可检查参考
允许并改变结果。采用（不是本自述文件）必须确定是否
这个利基市场实际上服务不足。

## 行为状态

### 行为·证据
- **行为**：候选→明确采用→主动召回·**证据**：实施和测试
- **行为**：配置文件/工作空间/会话隔离 · **证据**：已实施和测试
- **行为**：当前明确的指令获胜 · **证据**：实施和测试
- **行为**：相邻否定提示不记得· **证据**：实施并测试
- **行为**：记录的、可重构的交付 · **证据**：实施和测试
- **行为**：当前 `dsh` rc.2 上的真正无头插件组件 · **证据**：检查的转录本
- **行为**：历史 rc.8 组装和实时 DeepSeek 3× L− / 3× L+ 样本 · **证据**：检查快照
- **行为**：Web UI、团队共享、自动提取、密封抵抗 · **证据**：未声明

现场样本是有限的演示，而不是总体成功率。

## 真实场景证据

公共场景基准测试涵盖了八个常见问题：包管理器漂移、
Python 测试入口点、格式化程序、monorepo 构建、部署默认值、
仅会话调试、双语发行说明和 `.env` 引导程序。全部
**72/72 确定性产品合同探测通过**跨越候选阻塞，
采用的回忆、释义、相邻否定、身份隔离、当前
覆盖、准确交付的内容和交付重建。

这是公开的回归证据，而不是关于模型质量的声明。它留下来
与检查的 3× L− / 3× L+ 实时 DeepSeek 样本和当前 rc.2 分开
组装消费者。参见[场景报告](./docs/SCENARIO_BENCHMARK.md)和
[机器可读结果](./benchmark/results/scenarios.json)。

## 安装并尝试

要求：节点 22.19+/24+、`PATH` 上的 `pnpm` 以及 `dsh` CLI。

建议：下载预构建的版本 tarball，根据需要检查它，然后
安装它而不运行包构建脚本：

```sh
curl -LO https://github.com/B1lli/dsh-learning-bundle/releases/download/v0.3.0/dsh-learning-bundle-0.3.0.tgz
dsh plugin --profile headless add -w ./dsh-learning-bundle-0.3.0.tgz
```

软件包 CLI 安装在该配置文件内。从工作区
您想要保留的约定：

```sh
cd /path/to/your-project
DSH_LEARNING_BIN="${DSH_HOME:-$HOME/.dsh}/profiles/headless/node_modules/.bin/dsh-learning"

"$DSH_LEARNING_BIN" record \
  --profile headless \
  --statement "Use pnpm instead of npm for dependency installs." \
  --scope workspace --workspace-id "$(pwd -P)" \
  --keyword install,installs,installed,installing --keyword dependencies \
  --exclude "explicitly use npm" \
  --override-term npm --override-term yarn --override-term bun

"$DSH_LEARNING_BIN" adopt
dsh --profile headless "Install the JavaScript dependencies for this workspace."
```

对于开发，请链接结账：

```sh
git clone https://github.com/B1lli/dsh-learning-bundle.git
cd dsh-learning-bundle

# Link this checkout into the headless profile and activate its bundle layer.
dsh plugin --profile headless add -w "$(pwd -P)"

# Record a correction. It is a non-recallable candidate at this point.
node scripts/learning.mjs record \
  --profile headless \
  --statement "Use pnpm instead of npm for dependency installs." \
  --scope workspace --workspace-id "$(pwd -P)" \
  --keyword install,installs,installed,installing --keyword dependencies \
  --exclude "explicitly use npm" \
  --override-term npm --override-term yarn --override-term bun

# Adopt the returned item id, then run a relevant task.
node scripts/learning.mjs adopt
dsh --profile headless "Install the JavaScript dependencies for this workspace."
```

每个 `--keyword` 都是一个必需的触发器组。内部以逗号分隔的值
相同的标志是文字替代：纯 ASCII 单词使用单词边界，
而开发者令牌（例如 `C++`、`@scope/pkg`、CLI 标志和点文件）是
与它们的字面拼写相匹配。每个 `--override-term` 命名一个选择
当前任务抑制学习到的默认值。 CLI 解析工作区
其物理身份的路径，因此符号链接签出与 dsh 记录的 cwd 相匹配。

CLI 和插件按以下顺序解析同一存储：
`DSH_LEARNING_STORE`，`$DSH_HOME/dsh-learning-store.json`，则
`~/.dsh/dsh-learning-store.json`。

## 核心API

Cordis 插件是包的默认导出。无依赖学习
原语可通过显式 `dsh-learning-bundle/core` 获得
子路径：

````js
导入{
  创建学习商店，
  回忆乐