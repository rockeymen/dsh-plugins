#@starsinc1708/dsh-tool-council

DeepSeek Harness 的地图缩减子代理委员会：一项任务通过不同的视角分散给几个新孩子，验证者重新检查源头的每项发现，法定人数将他们的投票转化为裁决表。

该插件是工作流程和子代理接缝上的消费者。它的脚本是部署拥有的和构建时常量：模型提供任务文本和可选的预设名称 - 它不能更改拓扑、模式、仲裁或验证。并发限制、取消、worker 终止和 `workflow-run` 会话节点来自 `ctx.workflowEngine`。

## 安装

一条命令，进入 `dsh web` 启动配置文件：

```sh
dsh plugin --profile web add github:starsinc1708/dsh-tool-council
```

然后启动线束并选择模式：

```sh
dsh web
```

**Map-Reduce 模式** 出现在 Composer 的模式菜单中，位于 Standard、PTC、
最小和创造者。选择它会将理事会组成标准代理
飞机；所有其他模式都保持原样。

不需要构建步骤，也不需要 pnpm `allowBuilds` 津贴：此存储库
提交其 `lib/` 输出，因此安装解析为预构建的工件。针a
如果您希望稍后推送无法更改您运行的内容，请提交：

```sh
dsh plugin --profile web add github:starsinc1708/dsh-tool-council#<sha>
```

### 要求

- DeepSeek Harness `0.1.1-rc.2` (`dsh --version`)，`pnpm` 位于 `PATH` 上。
- `web`型材，由`@deepseek-ai/dsh-base`和
  `@deepseek-ai/dsh-web-app`。理事会所需的一切——工作流程
  引擎、`spawn` 提供程序的子代理注册表、设置
  提供商和 `workflow-run` 对话节点 - 已经在这两个中
  捆绑。没有其他需要安装的东西。

### 验证它是否着陆

```sh
dsh --profile web --dump-config | grep -A3 dsh-tool-council
```

具有 `tool-council-host` 行的 `# == @starsinc1708/dsh-tool-council` 层
表示组成的束。第一次`dsh web`启动后，发布的预设
位于磁盘上：

```sh
ls "$DSH_HOME/.agent-presets/map-reduce"     # agent.cordis.yml  preset.yml
```

`$DSH_HOME` 默认为 `~/.dsh`。发布发生在插件加载时，第二次
或两个进入启动，并且预设发现未记忆 - 该模式显示没有
重新启动。

### 其他安装源

```sh
dsh plugin --profile web add ./dsh-tool-council      # a local checkout
dsh plugin --profile web add ./starsinc1708-dsh-tool-council-0.1.1-rc.2.tgz   # pnpm pack output
```

两者都跳过 git fetch 并且也不需要构建津贴。使用本地结帐
开发时：`pnpm build`，然后重启`dsh web`。

### 更新和删除

```sh
dsh plugin --profile web update @starsinc1708/dsh-tool-council
dsh plugin --profile web remove @starsinc1708/dsh-tool-council
```

`remove` 删除了依赖项和捆绑层，因此该工具和设置
卡在下次启动时消失。它**不会**删除已发布的预设 -
一旦写完，`$DSH_HOME/.agent-presets/map-reduce` 就是你的了，名册将
将其列为损坏，插件消失。也删除该目录：

```sh
rm -rf "$DSH_HOME/.agent-presets/map-reduce"
```

### 安装这个对你的机器有什么影响

有两件事值得明确说明，因为两者都在代理沙箱之外：

1. **它将一个目录写入`$DSH_HOME/.agent-presets`。** 预设是一个
   组合，因此该工具将创作一个视为具有与
   外壳访问。每当源 `standard` 时都会重新生成该目录
   预设或此插件的行发生更改，并且对其进行的手动编辑会丢失 - 复制它
   在新的id下发散，并设置`installPreset: false`来停止插件
   根本不写作。
2. **运行会启动新的子代理，这些子代理可以读取并运行您的命令
   ** 这就是重点——验证者重新读取它正在投票的文件
   ——但这意味着理事会运行需要真正的代币和真正的工具调用：
   `bug-hunt`是八个孩子。

## 配置

```yaml
# profiles/<name>/cordis.patch.yml (or the bundle's own cordis.patch.yml)
- insert:
    - id: tool-council-host
      name: '@starsinc1708/dsh-tool-council'
      config:
        installPreset: true
        presetId: map-reduce
        presetName: 'Map-Reduce mode'
        councilPolicy:
          subagentProvider: spawn
          toolName: council
          maxAgentsPerLayer: 12
          maxLayers: 6
          maxFindings: 200
          maxFindingsPerMember: 50
          maxFindingChars: 2000
          maxReportChars: 32768
          maxRunMs: 0            # 0 disables the wall-clock budget
          retryFailedMembers: true
          mergeSameLocation: true
          maxMergeCandidates: 60
          councilEveryRequest: true   # false = offer the council, do not mandate it
          defaultPreset: bug-hunt
          # presets: []   # replaces the four shipped topologies wholesale
```

`councilPolicy` 是工具自己的配置，由始终组成的主机行拥有，因此设置卡可以镜像部署的真实拓扑，并且发布的预设可以使用相同的策略挂载该工具。对于四种已发货拓扑（`bug-hunt`、`research`、`feature-design`、`refactor`）和默认上限，请忽略它。没有按预设合并 - 声明 `presets` 会批量替换它们，因为部分覆盖的角色提示是无人审查的拓扑。

模式无法表达的结构规则在加载时强制执行，并使部署失败而不是调用：每个预设都以一个只有一个角色实例的归约层结束，最多声明一个验证层，并且其后没有映射层，仲裁出现在验证层上，而不是其他地方，`threshold` 仲裁最多是其层的宽度，并且预设、层和角色 ID 在预设中是唯一的。最后两个不是迂腐的——验证层重新聚类并重新编号投票所针对的结果之后的地图层，并且在第二层上重用的角色ID将两个成员折叠成一个实例ID。否则，在每个孩子都得到付款后，两者都会在运行“结束”时失败。

`subagentProvider` 必须注册，必须通告 `outputSchema`，并且不能继承父上下文。用父母的成绩单作为种子的成员将继承父母对问题的框架，这就是该层存在的目的。

### 预算和失败上限

`maxRunMs` 是一次运行的挂钟预算； `0`（默认）将其关闭。它是故意执行两次的。该脚本在每个**层边界**进行检查，并跳过剩余的检查/验证层，同时仍然运行尾随的减少层，因此超出预算的运行会返回它确实收集的结果，标记为 `deadline`，而不是什么也不返回。主机在 `maxRunMs + 60s` 处保留一个硬性的 `run.cancel()` 后退，以防脚本自身的检查无法提供帮助 - 一个永远不会解决的单层。已经在飞行中的孩子永远不会在中层被杀死。

`retryFailedMembers`（默认打开）重新发出一个孩子死亡的 `agent()` 呼叫。死去的孩子会解析其对 `null` 的调用，而不是抛出，因此如果不重试，一次传输故障会默默地移除整个镜头，并且报告中没有任何内容说明这一点。 `maxTotalAgents` 的大小可以覆盖重试和单个合并子项，因为跳闸的 `AGENT_CAP` 会终止运行而不是降低运行质量。

不返回任何内容的归约子项将被报告为**缺失报告**，而不是空报告：工具结果在表上方如此表示，并且持久记录带有 `reportMissing`。

## 图层

一层为 `map`、`verify` 或 `reduce`。它的宽度是其角色 `count` 的总和，每个实例在引擎的并发限制下作为一个 `agent()` 调用运行。

角色与其邻居的不同之处在于其 `prompt` 及其可选的 `model`/`provider`，仅此而已：工作流 `agent()` 挂钩既不接受角色过滤器也不接受工具过滤器。成员确实到达了工作区 - `spawn` 子级加入了父级的预设 - 这就是验证者的投票值得计数的原因：它重新读取引用的位置，而不是根据查找文本进行推理。

## 调查结果和法定人数

地图子项通过结构化输出模式返回结果，因此没有任何东西可以解析散文。每个成员的列表在读取时的上限为 `maxFindingsPerMember`，因此一个健谈的成员无法填充该切片并将较安静的成员排挤掉 - 并且也无法将累积的列表增长到超过 `instances × maxFindingsPerMember`。然后结果聚集在 `normalizeLocation(location) + '|' + fingerprint(title)` 上；最先出现的成员幸存下来，后来的成员贡献了一名记者和一个标题变体。

聚类是词汇性的，因此两个成员在同一位置描述不相关单词中的一个缺陷仍然会作为两个结果到达。当 `mergeSameLocation` 开启（默认）时，**合并子项**会准确接收这些组（共享位置但不共享指纹的集群）并返回作为一个缺陷的 id 集；最早的集群吸收了其他集群的报告者