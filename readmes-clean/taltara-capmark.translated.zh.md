#capmark

AI 代理插件的功能清单。插件声明它可以做什么，在
Markdown，检查员将其保留。

安装插件会使用您的权限运行其他人的代码 - 它可以读取
您的文件、使用您的凭据并访问网络。今天唯一的事
挡在你面前的是自述文件和你自己对它的阅读。扫描仪
事后查找已知的错误代码。 capmark是另一半：插件
以机器可以检查的形式预先说明它需要什么。

```markdown
capmark: 0.1
plugin: dsh-vision-toolkit

# Capabilities

​```帽
授予 fs:读取范围=工作空间
授予网：获取
​```

# Contracts

​```帽
从不触发：生成
需要批准 fs:read
​```
```

首先是Markdown。从未听说过 capmark 的读者仍然会渲染一个
清晰的安全自述文件 - 不受支持的清单的最坏情况是
文档。

## 保持诚实的规则

词汇表中的每项功能都必须命名一个实际阻止它的机制。

这不是风格偏好。 [DSH讨论#174](https://github.com/deepseek-ai/deepseek-harness/discussions/174)
记录了 `rm -rf` 与 `rm` 一起走动的拒绝规则，然后是
`rmdir` 同样运行。 **模式否认拼写。能力否定结果。**

否认整个工具并不是模式匹配——没有办法重新表述你的
一旦 `bash` 退出桌面，就可以转向 `bash`。所以这里的单位是一套工具
名称。 capmark 表示，任何更精细的内容（例如主机许可名单）都是建议性的
所以大声说出来，而不是让它通过墙壁：

```
warning  advisory-scope  scope on `net:fetch` is recorded and audited, but
                         nothing enforces it — do not rely on it as a boundary
```

悄悄夸大自己的许可系统比没有更糟糕，因为
人们停止阅读代码。

## 检查一项

```sh
npx capmark lint ./CAP.md
```

退出0干净，1发现，2无法运行。 `--json` 用于 CI。

## 无人请求许可系统的保存

工具模式会根据每个请求重新发送，因此代理可能永远不会调用的工具是
每次会议的每一轮都付费。清单已经说明了哪些
是，而 `tools.restrict()` 正好取出其中掉落的面具。

根据启动的 `@deepseek-ai/dsh` `0.1.0-rc.7` Web 配置文件进行测量 — 真实
从运行注册表捕获的模式，而不是估计。重新核对
`0.1.1-rc.2`，其中 `standard`、`code` 和 `cordis` 组合物带有
相同的行，所以这些数字仍然有效：

在`0.1.1-rc.2`上：

### 预设 · 工具 · 架构字节 · 使用 `fs:read` + `net:fetch` 清单 · 剪切
- **预设**：`standard`（默认）·**工具**：25·**模式字节**：25,965·**使用 `fs:read` + `net:fetch` 清单**：5 个工具，3,122 B·**剪切**：**88.0%**
- **预设**：`code` · **工具**：26 · **架构字节**：26,908 · **使用 `fs:read` + `net:fetch` 清单**：6 个工具，4,065 B · **削减**：84.9%
- **预设**：`cordis` · **工具**：32 · **架构字节**：33,453 · **使用 `fs:read` + `net:fetch` 清单**：5 个工具，3,122 B · **削减**：90.7%

在`0.1.0-rc.7`上：

### 预设 · 工具 · 模式字节 · 使用 `fs:read` + `net:fetch` 清单 · 剪切
- **预设**：`standard`（默认）· **工具**：25 · **架构字节**：25,567 · **使用 `fs:read` + `net:fetch` 清单**：5 个工具，2,724 B · **剪切**：**89.3%**
- **预设**：`code` · **工具**：26 · **架构字节**：26,510 · **使用 `fs:read` + `net:fetch` 清单**：6 个工具，3,667 B · **削减**：86.2%
- **预设**：`cordis` · **工具**：32 · **架构字节**：33,055 · **使用 `fs:read` + `net:fetch` 清单**：5 个工具，2,724 B · **削减**：91.8%

两者都是现场捕捉。版本不同是因为编辑了五个工具包
他们的描述，而工具模式主要是它的描述 - 比较
包源预测这里没有变化，启动每个版本都显示
否则。

诚实地阅读：这是工具有效负载，而不是整个请求，并且它适用
真正限定其所声明范围的代理——掩盖通用目的
将代理降到一个插件的授权就会破坏它，这就是报告的原因
拒绝获得没有任何可调用内容的掩码。我们不提出任何延迟声明，
因为我们还没有测量延迟。参见【基准测试](packages/capmark/bench/README.md)
重现它。

`code` 行保留六个工具而不是五个，因为 `run_code` 不能
masked：注册表在应用限制后重新添加代码模式传输，
如果你能说出它的名字，`tools.restrict()` 就会抛出异常。执行不受影响——a
子调度仍然通过策略瀑布 - 但有效负载保留它，并且
数字是这样说的。我们通过掩盖带电安全带发现了这一点；报纸
计算得出89.7%。

## 状态

早。已针对 `@deepseek-ai/dsh`、`0.1.0-rc.7` 和 `0.1.1-rc.2` 进行验证。三个
检查所依赖的软件包 - `dsh-tools`、`dsh-agent-presets`、`dsh-scope` -
这些版本之间的字节相同，因此接缝处的代码相同
两者都有。 `0.1.1-rc.2`增加1个工具包，注册名称为
已经涵盖的词汇。

词汇表有十四种功能，每种功能都与从以下位置捕获的工具名称绑定
启动的 `@deepseek-ai/dsh` 配置文件而不是从文档中读取 -
其中两个（`code:run`、`workflow:run`）的存在是因为测量工具出现了
文档从未提及。
格式版本`0.1`；期待它移动。

- `packages/capmark` — 解析器、linter、词汇、工具掩码编译器、CLI。零依赖。
- `packages/gate` — `dsh-capmark-gate`，DeepSeek Harness 的参考执行器（[readme](packages/gate/README.md)）
——`packages/probe`——测量仪器；针对真实配置文件启动以捕获实时工具模式。未发货。

## 执行

`packages/gate` 将实时代理保存到清单中。在启动的 rc.7 上测量
带有授予 `fs:read` 和禁止 `proc:spawn` 清单的安全带：

```
tools visible: 25 -> 4
bash         deny  - reader declares `never proc:spawn`, and `bash` is part of it
write        deny  - reader declares no capability covering `write`
read         allow
```

它**不**将插件自己的代码沙箱化——`apply()` 在进程中运行
在任何工具调用存在之前具有完整的节点权限。清单规定了什么
*代理*可能会致电。该限制在门的自述文件中说明，而不是留给
有人去发现。

## 开发

```sh
pnpm install
pnpm test
pnpm typecheck
pnpm lint
```