#dsh-bouncing-squares-example

一个【DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）
插件，以及示例插件
[dsh-粒度设置](https://github.com/joao-paulo-santos/dsh-granular-settings)：
三个弹跳方块共享您的屏幕，每个方块由一个设置范围驱动。

### 方·范围·改变它教什么
- **正方形**：蓝色 · **范围**：`session` · **改变它所教导的内容**：每个会话一个值：两个会话可以同时显示两种颜色
- **正方形**：琥珀色 · **范围**：`workspace` · **更改它所教导的内容**：每个工作区一个值：工作区中的每个会话都显示相同的值
- **方块**：绿色 · **范围**：`global` · **改变它所教导的内容**：一个插件范围的值：在每个工作区中都相同，并且它会在根本没有会话打开的情况下不断弹跳

## 尝试什么

- 在同一工作区中打开两个会话并给它们不同的会话
  方形颜色。每个会话方块都保持自己的颜色；两个工作区
  方块匹配。
- 切换工作空间：会话和工作空间方块遵循新的
  背景下，全球广场根本没有改变。
- 关闭每个会话：只剩下全局广场，因为全局
  值在没有会话上下文的情况下存在。
- 工作区方块的文本前缀（枚举）和文本后缀（多选）
  装饰它的标签。全局方块的大小（数字）会调整它的大小。

## 它注册的设置

每个范围注册相同的四个键，`show`、`color`、`text`、`speed`，
所以范围轴很容易看到，再加上一两种其他类型看不到的
有：

### 范围 · 键 · 行使的类型
- **范围**：`session` · **按键**：显示、颜色、文本、速度 · **执行的类型**：切换、颜色、文本、滑块
- **范围**：`workspace` · **键**：显示、颜色、文本、速度、前缀、后缀 · **执行的类型**：切换、颜色、文本、滑块、枚举、多选
- **范围**：`global` · **按键**：显示、颜色、文本、速度、大小 · **执行的类型**：切换、颜色、文本、滑块、数字

## 代码之旅

- `lib/index.js`，主机一半：每个设置调用一次 `gs.register`，无
  否则。
- `lib/client.js`，浏览器一半：每个方块是一把
  `gs.useSetting(NS, scope, key)` 调用加物理。平台挂钩
  拥有会话上下文、订阅、默认后备和写入；
  模块范围的飞行状态在上下文切换后仍然存在。环球广场
  读取无会话上下文，这就是它在没有会话的情况下反弹的原因
  打开。

## 如何安装

需要 DeepSeek Harness 结帐和配置文件，此处为 `web`。克隆
依赖项和此插件放入插件文件夹中：

```sh
mkdir -p ~/dsh-plugins && cd ~/dsh-plugins
git clone https://github.com/joao-paulo-santos/dsh-event-relay.git
git clone https://github.com/joao-paulo-santos/dsh-granular-settings.git
git clone https://github.com/joao-paulo-santos/dsh-bouncing-squares-example.git

# from the harness checkout
pnpm dsh plugin --profile web add ~/dsh-plugins/dsh-event-relay
pnpm dsh plugin --profile web add ~/dsh-plugins/dsh-granular-settings
pnpm dsh plugin --profile web add ~/dsh-plugins/dsh-bouncing-squares-example

# verify the profile still composes
pnpm dsh --profile web --dump-config
```

然后重新启动线束。方块立即出现；他们的控制
位于“粒度设置”下的“设置”对话框中。

## 依赖关系

- [dsh-capsular-settings](https://github.com/joao-paulo-santos/dsh-granular-settings) 提供此插件对话的两半
- [dsh-event-relay](https://github.com/joao-paulo-santos/dsh-event-relay)携带变更门铃（dsh-grinder-settings需要）

## 依赖于此的插件

*（无，这是该行的结尾：一个示例，而不是一个平台）*