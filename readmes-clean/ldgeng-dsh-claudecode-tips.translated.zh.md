# @claude-code-tips/dsh-plugin

[![DSH 市场](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-zh.svg)](https://dsh.market/)

用于网络配置文件的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) 插件包。它用旋转的 Claude Code 式 **加载字**（原始 56 个字集）取代了静态 **深潜...** 转弯状态标签。状态旁边的经过时间时钟被保留。

## 改变了什么

之前：

```
Deep diving... 12s
```

之后（每隔几秒旋转一次）：

```
Thinking...  12s
```

该实现是一个小型浏览器端客户端插件：它监视聊天 DOM 并仅重写状态文本节点。没有服务器代码，没有模型提示更改，没有 DSH 的分叉。

完整的 56 字轮换列表：

```
Accomplishing, Actioning, Actualizing, Baking, Brewing, Calculating,
Cerebrating, Churning, Clauding, Coalescing, Cogitating, Computing,
Conjuring, Considering, Cooking, Crafting, Creating, Crunching,
Deliberating, Determining, Doing, Effecting, Finagling, Forging,
Forming, Generating, Hatching, Herding, Honking, Hustling, Ideating,
Inferring, Manifesting, Marinating, Moseying, Mulling, Mustering,
Musing, Noodling, Percolating, Pondering, Processing, Puttering,
Reticulating, Ruminating, Schlepping, Shucking, Simmering, Smooshing,
Spinning, Stewing, Synthesizing, Thinking, Transmuting, Vibing, Working
```

## 安装

需要 `web` 配置文件和支持树外捆绑包的 DSH 版本（`dsh` 0.1.0-rc.6 或更高版本）。

```sh
# from this directory
dsh plugin --profile web add .
```

或者从 git checkout 安装：

```sh
dsh plugin --profile web add github:your-name/dsh-claude-code-tips
```

然后启动网络用户界面：

```sh
dsh --profile web
```

## 验证

1. 启动 Web UI 并打开会话。
2. 发送消息。
3. 模型工作时，状态行应显示旋转加载字样，例如 `Thinking...`、`Pondering...` 或 `Musing...`，而不是 `Deep diving...`。

要禁用而不卸载，请添加到配置文件的 `cordis.patch.yml`：

```yaml
- id: claude-code-tips
  disabled: true
```

## 发展

该插件没有构建步骤。 `client.js`是DSH客户端模块系统半加载的浏览器； `cordis.patch.yml` 将其插入网络配置文件中。