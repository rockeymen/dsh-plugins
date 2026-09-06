# Dsh-Client-UI-Custom

[![Awesome DSH Plugin](https://beancookie.github.io/awesome-dsh-plugin/badge.svg)](https://beancookie.github.io/awesome-dsh-plugin)

[**中文**](#中文) · [**English**](#english)

## 中文

### 简介

Dsh-client-ui-custom 是一个纯前端插件，它为用户提供了浮动历史记录条、用户消息md渲染、外观调试、插件市场、快捷键、用量统计和动效功能。

- **修改了通用设置项** —— 在「设置 → 通用」里新增了历史记录条（位置、数量）和用户消息 Markdown 渲染开关；
- **修改了插件项** —— 在「设置 → 插件」里新增了「插件市场」；
- **新增了四个设置页** —— 「外观」「快捷键」「用量统计」「动效」。

所有功能默认关闭，不配置时保持与原生界面一致，全程零 shell 改动。

### 宣传视频

[▶ 点击观看插件宣传视频（B 站）](https://www.bilibili.com/video/BV1fwbX6XEp7)

### 功能选择（按需安装）

插件由七个**相互独立**的功能模块组成：`appearance`（外观）、`shortcuts`（快捷键）、
`usage`（用量统计）、`history`（历史记录条）、`markdown`（用户消息 Markdown
渲染）、`marketplace`（插件市场）、`motion`（动效）。可在插件配置里用 `features`
白名单选择要安装的功能：

```yaml
- id: ui-custom
  name: '@ha-na-bi/dsh-client-ui-custom'
  config:
    features: [shortcuts, usage]   # 只安装「快捷键」+「用量统计」
```

`features` 缺省或为空时，七个功能全部启用。

### 设置改动一览

### 位置 · 类型 · 内容
- **位置**: 设置 → 外观 · **类型**: 新增页面 · **内容**: 主题定制，包括壁纸、玻璃、强调色、表面不透明度、字体与质感
- **位置**: 设置 → 快捷键 · **类型**: 新增页面 · **内容**: 自定义快捷键，包括新建对话、切换模型、思考强度等
- **位置**: 设置 → 应用用量 · **类型**: 新增页面 · **内容**: 用量统计，使用四窗口聚合、趋势图，展示会话用量排行
- **位置**: 设置 → 动效 · **类型**: 新增页面 · **内容**: 对话/侧边栏/新建对话入场动效与选中框动效，含三套一键预设
- **位置**: 设置 → 通用 · **类型**: 修改原有页 · **内容**: 新增浮动历史条（可调节位置，数量）、用户消息 Markdown 渲染开关
- **位置**: 设置 → 插件 · **类型**: 修改原有页 · **内容**: 新增「插件市场」，收录第三方插件目录

### 外观（设置 → 外观）

外观设置提供给用户极大的自定义空间，用户可根据自己需求选择背景、玻璃档位、强调色（可自动从
背景取色）、各表面不透明度、色调渐变、暗色遮罩、字体与字号、主题色滚动条
与内嵌晕影，并可把 ui-theme 的**主题偏好**（浅色 / 深色 / 跟随系统）合并进本
栏。改动通过 `ui-custom` settings 命名空间保存并**即时生效**（主题实时重渲染，
无需重启）。

**预览**—— 主题定制支持小窗预览。

![小窗预览](https://cdn.jsdelivr.net/gh/yoli-mi/dsh-client-ui-custom@main/assets/preview-mini.png)

也支持全屏预览，按 F2 即可退出。

![全屏预览](https://cdn.jsdelivr.net/gh/yoli-mi/dsh-client-ui-custom@main/assets/preview-fullscreen.png)

**预设（Preset）** —— 插件内置了六种预设，每个预设都有独立的风格（预设可独立生效，你自己的 `wallpaper` 仍会叠加在它之下）：

### id · 名称 · 风格
- **id**: `ink-teal` · **名称**: Ink Teal 黛青 · **风格**: 青玉色渐变，静谧沉稳
- **id**: `ink-blue` · **名称**: Ink Blue 黛蓝 · **风格**: 黛蓝渐变，深邃克制的蓝
- **id**: `dusty-rose` · **名称**: Dusty Rose 藕荷 · **风格**: 藕荷色渐变，温润柔和的粉
- **id**: `apricot-gold` · **名称**: Apricot Gold 杏金 · **风格**: 杏金色渐变，温雅低调的金
- **id**: `mist-gray` · **名称**: Mist Gray 雾灰 · **风格**: 雾灰色渐变，清冷安静的灰蓝
- **id**: `ink-violet` · **名称**: Ink Violet 墨紫 · **风格**: 墨紫色渐变，沉静神秘

更多美术选择后续会扩展进这份列表 —— 见 `src/client/presets.ts`。

**玻璃档位** —— `glass` 是透明度的开关；显式设置 `wallpaperBlur`
时总是优先于档位的默认半径：

### 档位 · 模糊 · 饱和度 · 气质
- **档位**: `off` · **模糊**: 0px · **饱和度**: 1.0 · **气质**: 不透明，无玻璃
- **档位**: `light` · **模糊**: 6px · **饱和度**: 1.15 · **气质**: 轻微玻璃
- **档位**: `frosted` · **模糊**: 14px · **饱和度**: 1.25 · **气质**: 强毛玻璃（默认）
- **档位**: `mica` · **模糊**: 22px · **饱和度**: 1.1 · **气质**: 柔和静态质感，保留壁纸色相

**主题配置项** —— 所有字段均可选；显式配置永远优先于预设：

### 键 · 类型 · 默认值 · 含义
- **键**: `preset` · **类型**: string · **默认值**: `''` · **含义**: 预设 id（见上表）；`''` = 不使用预设
- **键**: `wallpaper` · **类型**: string · **默认值**: `''` · **含义**: 壁纸 URL/路径（Web 可访问）；空字符串 = 插件保持关闭
- **键**: `wallpaperBlur` · **类型**: number 0–60 · **默认值**: 玻璃档位默认 · **含义**: `#root` 模糊半径（px）；显式值优先于玻璃档位
- **键**: `glass` · **类型**: enum · **默认值**: `frosted` · **含义**: `off` / `light` / `frosted` / `mica`（见玻璃档位表）
- **键**: `accent` · **类型**: string · **默认值**: `#4176e6` · **含义**: 强调色，整套 deepseek 色阶由它派生
- **键**: `autoAccent` · **类型**: boolean · **默认值**: `false` · **含义**: 从壁纸自动派生强调色（成功后覆盖 `accent`）
- **键**: `surfaceOpacity` · **类型**: number 0–100 · **默认值**: `100` · **含义**: 主表面不透明度（聊天/细节列）
- **键**: `sidebarOpacity` · **类型**: number 0–100 · **默认值**: `100` · **含义**: 侧栏不透明度
- **键**: `chatSurfaceOpacity` · **类型**: number 0–100 · **默认值**: `100` · **含义**: 聊天列不透明度（经 `--dsw-chat-surface`）
- **键**: `inputOpacity` · **类型**: number 0–100 · **默认值**: `100` · **含义**: 输入框不透明度
- **键**: `codeBlockOpacity` · **类型**: number 0–100 · **默认值**: `100` · **含义**: 代码块/行内代码不透明度
- **键**: `darkSurfaceOpacity` · **类型**: number 0–100 · **默认值**: `surfaceOpacity` · **含义**: 暗色模式表面不透明度（独立档位）
- **键**: `gradient` · **类型**: string · **默认值**: `''` · **含义**: 亮色模式下叠加在壁纸上的渐变；空 = 无
- **键**: `darkScrim` · **类型**: number 0–100 · **默认值**: `0` · **含义**: 暗色模式下壁纸上的遮罩强度
- **键**: `fontFamily` · **类型**: string · **默认值**: `''` · **含义**: 字体栈覆盖；空 = 主题默认
- **键**: `scrollbarAccent` · **类型**: boolean · **默认值**: `false` · **含义**: 滚动条使用强调色
- **键**: `vignette` · **类型**: boolean · **默认值**: `false` · **含义**: 应用根节点的柔和内嵌晕影
- **键**: `customCss` · **类型**: string · **默认值**: `''` · **含义**: 原样追加的自定义 CSS（逃生舱）
- **键**: `customVars` · **类型**: object · **默认值**: `{}` · **含义**: 额外写到 `<html>` 上的 CSS 自定义属性（逃生舱）

完整示例：

```yaml
config:
  preset: 'ink-teal'
  wallpaper: 'https://example.com/wall.jpg'
  glass: 'mica'              # 或 wallpaperBlur: 8 自定义半径
  autoAccent: true           # 强调色由壁纸自动派生
  chatSurfaceOpacity: 70
  customCss: |
    .some-hashed-class { border-radius: 16px; }
  customVars:
    '--my-accent-soft': 'rgb(255 127 178 / 0.3)'
```

### 快捷键（设置 → 快捷键）

新增的设置页，提供可自定义的键位绑定。值存在 `ui-custom` settings
命名空间里，运行时的修改无需重启即可生效（loader 配置作为组合层 base，
「恢复默认」会回到 loader 默认值）。

### 动作 · 作用
- **动作**: `newConversation` · **作用**: 新建对话（与侧栏「新建会话」按钮一致）
- **动作**: `switchModel` · **作用**: 循环切换到会话目录中的下一个模型（循环；新模型使用自身默认思考强度）
- **动作**: `cycleThinking` · **作用**: 循环切换当前模型的思考强度（off → … → max，循环）
- **动作**: `sendMessage` · **作用**: 输入框发送手势（默认 `Enter`）
- **动作**: `newline` · **作用**: 输入框换行手势（默认 `Shift+Enter`）
- **动作**: `usagePanel` · **作用**: 呼出应用用量面板（默认未绑定，可在设置中开启，如 `Mod+Alt+U`）
- **动作**: `defaultWorkspace` · **作用**: `newConversation` 打开的目标工作区（空 = 当前/最近）
- **动作**: `modelShortcuts` · **作用**: 一对一模型直达：每个组合键跳到指定模型（combo / provider / model）

![快捷键设置页](https://cdn.jsdelivr.net/gh/yoli-mi/dsh-client-ui-custom@main/assets/shortcuts.png)

实例：

```yaml
config:
  shortcuts:
    newConversation: 'Mod+Alt+N'
    switchModel: 'Mod+Alt+M'
    cycleThinking: 'Mod+Alt+T'
```

习惯 Enter 换行？把发送改为 `Mod+Enter`、换行改为 `Enter` 即可（两个手势
同时命中时发送优先）：

```yaml
config:
  shortcuts:
    sendMessage: 'Mod+Enter'
    newline: 'Enter'
```

模型动作走与内置模型选择器相同的 `session.models` / `session.selectModel`
RPC，输入区的模型显示会自动同步；被寻址的子代理会话会被跳过（与 UI 一致）。
不带 `Mod` 的组合键在输入框聚焦时不会触发，避免劫持正常打字。

### 用量统计（设置 → 应用用量）

用量统计页会统计展示各会话的用量总和（token-meter + session-stats），用户可自选时间跨度
（当前年内到最近三天）。页面展示 **总 / 输入 / 输出 Token、
缓存命中、使用时长、会话数与步数**，并带用量趋势图与会话排行。
会话列表行已携带 Host 计算好的投影基线，无需额外 RPC。

面板可通过快捷键在任何界面呼出。

### 动效（设置 → 动效）

新增的设置页，为 Web 客户端的各个界面提供 Apple 风格的入场动效。每一类动效都有
**独立的开关与样式选择**，互不牵连；也可一键应用整套预设。开关与样式存于
`ui-custom` settings 命名空间，修改实时生效。

**对话入场动效** —— 载入或切换对话时，消息逐行错峰出现，而不是瞬间跳出；每次
切换都会重放动画。6 种样式：淡入上浮 / 轻柔淡入 / 上浮放大 / 右侧滑入 / 模糊显影 / 轻盈缩放。

**侧边栏动效** —— 打开 Web 时侧边栏会话树逐项层叠出现，展开工作区时行项浮现，
当前会话行描出**常驻的选中框**。4 种样式：左侧滑入 / 轻柔淡入 / 纵向展开 / 自上而下。

**新建对话动效** —— 新建对话时，欢迎界面与输入区柔和入场。4 种大表面样式：
轻柔显影 / 轻柔淡入 / 柔和绽放 / 柔和缩放。

**设置界面动效** —— 打开设置时面板从左下角向中间扩张、关闭反向收缩；切换左侧
标签时高亮与页面内容淡入。可单独关闭，关闭后设置面板立即出现/消失。

**一键预设** —— 流畅 / 优雅 / 极简三套方案，把整套开关与样式一次应用到位，无需
逐项调试；应用后仍可自由微调。

所有动效都尊重系统「减弱动态效果」（`prefers-reduced-motion`），开启时自动降级为
短暂淡入；侧边栏选中框在关闭时完全移除。

### 通用设置项的改动

在「设置 → 通用设置」里新增内容：

**浮动历史条（位置 / 数量）** —— 记录某段会话的历史内容：
- **位置**：`left` / `right` / `off`（默认 `off`，关闭时不显示）；
- **数量**：显示最近多少回合（默认 10，`0` = 全部）；
- 点击某段历史条目即可平滑滚动到对应消息，条目来自已挂载的会话快照，纯 DOM 跳转，无额外 RPC；
- 支持**悬挂**：在消息操作行（复制/分支之间）可选择将某段会话悬挂到历史条上，
  置顶回合忽略数量限制、始终显示并带有强调色边框）。

**用户消息 Markdown 渲染** —— 默认关闭；开启后你自己的消息按 Markdown
渲染（标题、列表、代码块、`@子代理` / `@技能` 引用等），关闭时与原生
纯文本外观一致。

![通用设置](https://cdn.jsdelivr.net/gh/yoli-mi/dsh-client-ui-custom@main/assets/general-settings.png)

### 插件项的改动

在「设置 → 插件」里新增第三个 tab **「插件市场」**，通过调用Github API 发现带有dsh-plugin topic的项目，
为用户提供**第三方** DSH 插件目录。

![插件市场](https://cdn.jsdelivr.net/gh/yoli-mi/dsh-client-ui-custom@main/assets/marketplace.png)

### 安装

1. 确保构建会包含该包（`pnpm run build:lib:client`）。
2. 在 Web profile 的补丁层加入浏览器 roster 行 ——
   `~/.dsh/profiles/web/cordis.patch.yml`（或你 profile 中对应的 `dsh.client` roster）：

```yaml
- id: ui-custom
  name: '@ha-na-bi/dsh-client-ui-custom'
  config:
    preset: 'ink-teal'        # 选择预设；下面任意字段会覆盖它
    wallpaper: '/my-wall.jpg'
    wallpaperBlur: 14
```

3. 重启 `dsh web`。

自行构建时需注意：设置页要能加载，`ui-custom` 命名空间必须在 Web 客户端的
设置暴露白名单里（`packages/host/apiproxy/src/api-proxy.ts` 的
`WEB_SETTINGS_NAMESPACES`）——本检出已加入。

### 工作原理

- 浏览器半区先解析 `preset`（presets.ts），按 `DEFAULTS ← 预设 ← 配置`
  合并并对每个字段做钳制（config.ts），再把 `--dsu-*` 自定义属性写到
  `<html>`（apply.ts）。runner 会把 roster 行的 `config` 作为
  `apply(ctx, config)` 的第二个参数传入。
- 样式表（custom.module.css）消费这些变量，用比主题表更高优先级的选择器
  在 `body` / `body[data-ds-dark-theme]` 上重新声明主题 token，插件总是
  赢得级联，且不修改任何插件或 shell 源码。
- 毛玻璃给 `#root` 加 `backdrop-filter`，半透明表面透过它显示壁纸。
- 聊天列旋钮依赖 `ConversationRoot` 读取
  `var(--dsw-chat-surface, var(--dsw-alias-bg-base))` —— 一行完全向后兼容
  的回退写法（没有该 token 的原生 Harness 行为与之前完全一致），见
  `packages/client/ui-conversation`。
- 框架结构：

```
packages/client/ui-custom/
├── src/client/
│   ├── index.ts          # 插件入口：解析预设 → 规范化 → 应用
│   ├── config.ts         # CustomThemeConfig、DEFAULTS、normalizeConfig（类型收窄+钳制）
│   ├── presets.ts        # ThemePreset 注册表 —— 美术选择的扩展面
│   ├── apply.ts          # config → DOM：--dsu-* 变量、customCss、customVars
│   ├── custom.module.css # 消费 --dsu-* 变量的 token 覆盖
│   └── …