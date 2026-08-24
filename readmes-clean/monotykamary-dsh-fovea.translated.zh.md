#👁️dsh-fovea

** [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)** 的中心点存储库智能

_查看整个工作空间，代理工作的地方清晰，其他地方便宜。_

  ![dsh-fovea：DeepSeek-蓝色代码图在中心强烈发光并向边缘逐渐褪色](https://raw.githubusercontent.com/monotykamary/dsh-fovea/main/media/cover.svg)

**dsh-fovea** 将 [pi-fovea](https://github.com/monotykamary/pi-fovea) 改编为原生 DeepSeek Harness 插件和捆绑包。它将存储库编译成类型化的加权图表，将问题或变更集转变为兴趣领域，通过该图表分散相关性，并在重要的地方花费有限的上下文预算。

该实现由 Harness 组成，而不是构建并行主机：DSH 拥有工具、策略、生命周期、日志、文件系统访问、子进程和可选溢出。 Fovea 添加了四个存储库智能工具、连续结构漂移检测、斜杠命令和运行时技能。

## 它提供什么

### 表面·目的
- **表面**：`fovea_sketch` · **目的**：调查特征盆地、路线、枢纽和提取覆盖范围。
- **表面**：`fovea_focus` · **目的**：以符号、路线、概念或文件为中心，并揭示其语义邻域。
- **表面**：`fovea_dwell` · **目的**：扩大当前焦点，而不重复公开的外围。
- **表面**：`fovea_impact` · **目的**：对爆炸半径进行排名并查看文件、符号、工作树更改或基本参考差异的顺序。
- **表面**：`/fovea` · **用途**：当 `ctx.commands` 存在时，面向人的状态、重置、草图、聚焦、停留和冲击命令。
- **表面**：`fovea`技能· **目的**：当`ctx.skills`存在时注册的模型/用户指南。
- **表面**：持续同步· **目的**：当存储库漂移在结构上令人惊讶时，安静的基线加上记录的转向。

每个模型工具都会返回一个规范的 JSON 值：

```ts
{ text: string, tokens: number, details: Record<string, JSONValue> }
```

Harness 将 `text` 呈现给模型，而代码模式和其他编程调用者保留 `tokens` 和 `details`。 Fovea **不**取代本机 grep 或精确文件读取：使用它来确定位置和原因，然后精确检查所选源。

## 要求

- Node.js `^22.19.0 || >=24.0.0`
- 本次结帐的 pnpm `11.20.0`
- DeepSeek Harness服务固定到`0.1.0-rc.6`
- 康得思 `^4.0.1`
- Git 用于跟踪文件发现、基本引用影响和共同更改历史记录（普通目录仍然有效）

`@ast-grep/cli` 是运行时依赖项。可执行的分辨率是：`FOVEA_AST_GREP`，然后是打包的 CLI，然后是活动子进程提供程序的 `PATH` 上的裸 `ast-grep`。远程子进程提供程序无法执行主机包的二进制文件，因此在该执行世界中安装 ast-grep 或将 `FOVEA_AST_GREP` 设置为其提供程序可见的路径。

## 从这个结帐处安装

安全本地安装程序构建此包，记录任何先前的配置文件依赖性，要求固定的 DSH CLI 添加结帐链接，并验证组成的 `dsh-fovea` 行。它永远不会启动或重新启动 DSH。

```bash
# Defaults to the web profile
pnpm run install:local

# Select another profile
pnpm run install:local -- --profile tui

# Reuse already-built artifacts
pnpm run install:local -- --skip-build

# Use a non-default DSH home
DSH_HOME=/path/to/home pnpm run install:local
```

安装后重新加载或重新启动所选的运行配置文件。直接使用以下方法验证成分：

```bash
pnpm dlx @monotykamary/dsh@0.1.0-rc.7 --profile web --dump-config
```

仅卸载此签出所拥有的链接并恢复之前的依赖项（如果有）：

```bash
pnpm run uninstall:local
pnpm run uninstall:local -- --profile tui
```

npm 版本存在后，等效的配置文件操作预计为：

```bash
pnpm dlx @monotykamary/dsh@0.1.0-rc.7 plugin --profile web add dsh-fovea
```

## 模型工具参考

所有根都来自呼叫代理的会话 `cwd`；没有 Fovea 工具接受任意文件系统根。刀具 `max_tokens` 值被钳位到 `256–16000`。

### `fovea_sketch(max_tokens?)`

在工作开始时在不熟悉的存储库中使用一次。它强调生产锚点和结构中心，同时崩溃测试和遥远的区域。

### `fovea_focus(query, max_tokens?, fresh?, path?, language?, kind?)`

`query` 可以是符号、路径、概念或存储库相关文件。可选过滤器按路径、语言或图形节点类型缩小范围。设置 `fresh` 来重置显示，即使原子核与先前的焦点匹配。

支持的品种有`function`、`method`、`class`、`interface`、`type`、`field`、`decl`、`file`和`anchor`。

### `fovea_dwell(factor?, max_tokens?)`

扩大当前代理范围的重点。默认扩散倍数为`2`；低于 `1.2` 的值提升至 `1.2`，并且扩散时间在内部受到限制。

### `fovea_impact(files?, symbols?, include_uncommitted?, base?, max_tokens?)`

播种假设或真实的变化，并根据因果路径对后果进行排序。没有明确的种子，它包括未承诺的工作；提供 `base` 会计算 `base...HEAD` 比较，除非还请求 `include_uncommitted`。

一个有效的序列是：

1. `fovea_sketch` 用于不熟悉的存储库。
2. `fovea_focus` 关于最具体的任务名词。
3. 在建议的窗口上进行本机读取/grep。
4. 仅当第一个邻域太窄时才使用 `fovea_dwell`。
5. 完成跨文件更改之前的 `fovea_impact`。

## 人类命令

当配置文件提供`ctx.commands`时，dsh-fovea寄存器：

```text
/fovea status
/fovea reset
/fovea sketch
/fovea focus <query>
/fovea dwell [factor]
/fovea impact [files...]
```

`/fovea <query>` 也是对焦快捷键。命令输出使用配置的默认预算。

## 配置

捆绑补丁插入一行 ID 为 `dsh-fovea`。在所选配置文件的 `$DSH_HOME/profiles//cordis.patch.yml`（或更高版本的 `--patch` 层）中覆盖它：

```yaml
- id: dsh-fovea
  config:
    defaultBudget: 768
    toolTimeoutMs: 120000
    sync:
      mode: enabled
      scope: session
      budget: 512
      steerThreshold: 0.15
      pushFocus: true
      ackClean: false
      warmMutations: true
```

### 键·默认值·有效值
- **按键**：`defaultBudget` · **默认**：`512` · **有效值**：整数 `256–16000`
- **密钥**：`toolTimeoutMs` · **默认**：`120000` · **有效值**：整数 `1000–2147483647`
- **按键**：`sync.mode` · **默认**：`enabled` · **有效值**：`enabled`、`hidden` 或 `disabled`
- **键**：`sync.scope` · **默认**：`session` · **有效值**：`session` 仅针对此对话在索引整个根时输入的顶级目录/根文件； `repository` 恢复根部转向
- **密钥**：`sync.budget` · **默认**：`512` · **有效值**：整数 `128–8192`
- **密钥**：`sync.steerThreshold` · **默认**：`0.15` · **有效值**：有限数量 `0.02–8`
- **键**：`sync.pushFocus` · **默认**：`true` · **有效值**：布尔值
- **密钥**：`sync.ackClean` · **默认**：`false` · **有效值**：布尔值 - 在干净的结构检查后微小的“无新内容”确认
- **密钥**：`sync.warmMutations` · **默认**：`true` · **有效值**：布尔值

未知的配置键无法加载插件。 `enabled` 发出插件 `notice` 消息； `hidden` 使用插件 `instructions` 消息作为模型； `disabled` 删除了同步和突变归因挂钩，同时保留了明确的工具、命令和技能。部署级 `FOVEA_TURN_SYNC=off`（也称为 `0` 或 `false`）逃生舱口始终强制禁用模式。

### 高级环境控制

这些是模块加载时读取的部署级调整控件：

### 变量·默认值·范围/含义
- **变量**：`FOVEA_AST_GREP` · **默认**：打包的 CLI · **范围/含义**：执行世界 ast-grep 路径/名称覆盖
- **变量**：`FOVEA_TURN_SYNC` · **默认**：未设置 · **范围/含义**：`off`、`0` 或 `false` 禁用连续同步
- **变量**：`FOVEA_MAX_FILES` · **默认**：`8000` · **范围/含义**：`100–100000` 发现的文件
- **变量**：`FOVEA_MAX_FILE_BYTES` · **默认**：`1048576` · **范围/含义**：每个源 `65536–67108864` 字节
- **变量**：`FOVEA_MAX_ROOTS` · **默认**：`2` · **范围/含义**：`1–32` 常驻工作区图表
- **变量**：`FOVEA_MAX_AGENT_SESSIONS` · **默认**：`32` · **范围/含义**：`1–4096` 常驻代理/会话注意状态
- **变量**：`FOVEA_SPAWN_CONCURRENCY` · **默认**：`3` · **范围/含义**：`1–32` 并发子进程阶段
- **变量**：`FOVEA_IO_CONCURRENCY` · **默认**：`32` · **范围/含义**：`4–512` 并发提供程序 I/O 操作
- **变量**：`FOVEA_MAX_SUBMODULE_DEPTH` · **默认**：`4` · **范围/含义**：`1–16` 嵌套存储库深度
- **变量**：`FOVEA_AST_GREP_CHUNK` · **默认**：`160` · **范围/含义**：每个 p 的 `32–2048` 文件