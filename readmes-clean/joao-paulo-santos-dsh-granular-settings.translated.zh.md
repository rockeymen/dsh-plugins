#dsh-granular-settings

一个[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(DSH)
插件：将其与您自己的插件一起安装到配置文件中。

**其他插件贡献的设置。**插件需要的旋钮超过
一个粒度：本次会话的模型选择，整体的构建标志
工作区，整个安装的强调色。这个插件是共享的
为所有人提供的平台。 1个注册API，8个控件类型，3个
范围，以及设置对话框中呈现的一个“粒度设置”页面
所有的东西，每个插件都分在一个盒子里。

每个注册都由所属插件的包名称命名，因此
`dsh-foo` 中的 `enabled` 和 `dsh-bar` 中的 `enabled` 是不同的设置
在不同的命名空间中。通用密钥安全；碰撞不可能发生。

不确定如何连接您自己的插件？ [dsh-弹跳方块-示例](https://github.com/joao-paulo-santos/dsh-bouncing-squares-example)
是一个小型工作示例，专门为此构建：三个弹跳方块，
每个范围一个，完全由注册的设置驱动。复制它然后走。

## 三个范围，一页

![](https://github.com/user-attachments/assets/af43d3b2-ba5f-4d21-9291-4c420c5fcab6)

### 范围·价值生活
- **范围**：`session` · **价值生命**：每个会话一个值，以 `<workspace>/.dsh/settings/sessions/<sid>.json` 为单位
- **范围**：`workspace` · **价值生命**：每个工作区一个值，由其会话共享，在 `<workspace>/.dsh/settings/workspace.json` 中
- **范围**：`global` · **价值生命**：插件范围内，与任何工作区无关，在 `~/.dsh/settings/plugins/<namespace>.json` 中

该页面具有三个选项卡：工作区、会话、插件，每个范围一个。它有效
没有打开会话（“插件”选项卡是唯一存在的范围，没有打开）
一）。在每个会话中，“精细设置”视图选项卡也可以位于“聊天”旁边，
渲染同一页面；它的可见性本身就是一个插件设置，默认
上。插件选项卡设置还可以集中移动会话/工作区存储
在 `~/.dsh/` 下而不是在工作空间内。

## 如何安装

需要 DeepSeek Harness 结帐和配置文件，此处为 `web`。克隆两者
依赖项放入插件文件夹中：

```sh
mkdir -p ~/dsh-plugins && cd ~/dsh-plugins
git clone https://github.com/joao-paulo-santos/dsh-event-relay.git
git clone https://github.com/joao-paulo-santos/dsh-granular-settings.git

# from the harness checkout
pnpm dsh plugin --profile web add ~/dsh-plugins/dsh-event-relay
pnpm dsh plugin --profile web add ~/dsh-plugins/dsh-granular-settings

# verify the profile still composes
pnpm dsh --profile web --dump-config
```

然后重新启动线束。设置中出现“粒度设置”页面
对话；没有其他需要连接的东西。

## 如何在我的插件中使用

Host端：注册控件（注入`granularSettings`）：

```js
const gs = ctx.get('granularSettings')
const s = gs.register({
  namespace: 'my-plugin',       // REQUIRED: your package name, [a-z][a-z0-9-]*
  scope: 'session',             // 'session' | 'workspace' | 'global'
  key: 'model',                 // [a-z][a-z0-9-]*, unique only within the namespace
  type: 'enum',
  label: 'Model',
  owner: 'My Plugin',           // display name for the settings box
  description: 'Which model this session uses',
  options: [{ value: 'a', label: 'Model A' }],   // enum and multiselect only
  defaultValue: 'a',
  onChange: (value, target) => {},                // optional, serialized after persist
})

await s.get(sessionIdOrWorkspacePath)   // sessionId, workspace path, or ignored for global
await s.set(sessionIdOrWorkspacePath, 'b')
s.dispose()
```

控件类型及其元数据：

### 类型·值·注册附加信息
- **类型**：`toggle` · **值**：布尔值 · **注册附加**：
- **类型**：`text` · **值**：字符串，最多 4000 个字符 · **注册附加功能**：
- **类型**：`color` · **值**：十六进制字符串 · **注册附加**：
- **类型**：`number` · **值**：有限数量 · **注册附加**：可选 `min`、`max`
- **类型**：`slider` · **值**：数量 · **注册附加信息**：必需 `min`、`max`、`step`
- **类型**：`enum` · **值**：一个选项值 · **注册附加**：必需的 `options` 或提供程序功能
- **类型**：`multiselect` · **值**：选项值数组 · **注册附加**：必需的 `options` 或提供程序函数
- **类型**：`path` · **值**：绝对目录字符串 · **注册附加**：

对于 `enum` 和 `multiselect`，`options` 可能是零参数
函数在描述时评估，因此选项列表可以跟踪实时
图书馆无需重新注册。

浏览器端：一个钩子，服务名与主机相同（注入
`granularSettings`；浏览器和主机平面永远不会看到对方）：

```js
const gs = ctx.get('granularSettings')

// inside any component:
const [model, setModel] = gs.useSetting('my-plugin', 'session', 'model')
const [speed, setSpeed] = gs.useSetting('my-plugin', 'workspace', 'speed')
const [accent, setAccent] = gs.useSetting('my-plugin', 'global', 'accent')   // works sessionless
```

`useSetting` 派生会话上下文本身，订阅更改
（门铃、重新连接、窗口焦点、写入完成）、服务注册
当上下文的真实值加载时默认，并通过乐观地写入
主机。在没有打开会话的情况下，会话和工作区值读取为
`undefined` 和他们的作者是无操作者；全球价值观继续发挥作用。

当行数不够时，也可以贡献整个选项卡：

```js
const off = gs.registerTab({ id: 'my-tab', label: 'My Plugin', order: 40 }, MyComponent)
```

该组件在页面的滚动区域内呈现并接收
设置部分道具，其中包括 `useSessions`。内置选项卡位于
订单 10、20、30。

## 调试

从终端读取页面读取的内容：

```
curl 'http://127.0.0.1:3080/granular-settings/describe'
curl 'http://127.0.0.1:3080/granular-settings/describe?session=<sid>'
```

观看门铃直播：

```
curl -N 'http://127.0.0.1:3080/relay/events?topics=granular-settings'
```

`-N` 使用curl流而不是缓冲。

## 依赖关系

- [dsh-event-relay](https://github.com/joao-paulo-santos/dsh-event-relay)携带变更门铃（硬依赖，两半）

## 依赖于此的插件

- [dsh-bouncing-squares-example](https://github.com/joao-paulo-santos/dsh-bouncing-squares-example)，教程示例：三个弹跳方块，每个范围一个，练习七种控制类型