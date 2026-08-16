# 🦉 Angelina Web Decor

**明日方舟·安洁莉娜主题的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) Web UI 增强插件集**

本仓库包含两个可独立使用的**永久插件**（host 插件，随 DSH 启动自动加载）：

### 插件 · 文件 · 功能
- **插件**: 🎨 **网页装饰** · **文件**: `plugin/deco.js` · **功能**: 用本地安洁莉娜素材（透明 PNG 贴纸 + GIF 动画 + UI 元素）铺满页面留白——绝不挡字、小屏自适应、可一键开关
- **插件**: 📷 **照片上传** · **文件**: `plugin/photo.js` + `plugin/photo-client.js` · **功能**: 上传照片 → 以图片消息进入对话流、工作区存档、AI 侧 `photo_uploads`/`photo_delete` 工具、右下角悬浮上传按钮

## 关于安洁莉娜

**安洁莉娜（Angelina）** 是游戏《明日方舟》（Arknights）中的**六星辅助干员**，罗德岛的信使。她性格开朗活泼、乐于助人，使用**反重力源石技艺**（能操控物体的重力），平时带着一把小伞四处送信。本主题的素材即取自她"坐坐、看书、骑行、纸飞机、海边"等日常动作的形象。

## 📸 截图预览

![主界面（对话页装饰）](docs/screenshots/home.png)

![Hero 空状态页装饰](docs/screenshots/hero.png)

> 截图由 headless Chrome 对本地 DSH 实例自动拍摄。

## ✨ 功能

### 功能 · 说明
- **功能**: 🖼️ 页面装饰 · **说明**: 10 组角色贴纸（PNG 静态 / GIF 动画）+ UI 素材散布在对话区、空状态页、侧栏留白处
- **功能**: 🛡️ 绝不挡字 · **说明**: 所有装饰贴在**背景层**（`background-image`），内容永远在装饰之上
- **功能**: 📱 响应式 · **说明**: 尺寸用 `min(px, vw)`，小屏自动缩放 + 隐藏次要层，绝不堆叠
- **功能**: 🧊 毛玻璃质感 · **说明**: 消息气泡局部 `backdrop-filter: blur` + 文字高对比色（不留白朦胧）
- **功能**: 🔘 一键开关 · **说明**: `settings.yaml` 的 `deco.enabled`，热加载生效
- **功能**: 📷 照片上传 · **说明**: 图片以附件消息进入对话流，AI 下一轮可见；工作区留 base64 副本供 AI 解码使用
- **功能**: 🤖 AI 工具 · **说明**: `photo_uploads`（列出照片与路径）/ `photo_delete`（从对话流撤下图片）
- **功能**: ♾️ 永久生效 · **说明**: 全部挂载为 host 插件（`cordis.patch.yml`），DSH 重启自动加载

## 📦 安装

### 1. 放置文件

把本仓库的 `plugin/` 下文件放进工作区与 DSH 配置目录：

```
<工作区>/                      ← 你的 DSH 工作区（session 工作目录）
├── dsh-web-deco.css           ← plugin/dsh-web-deco.css（装饰样式）
└── 网页素材/                   ← 你的安洁莉娜素材文件夹（自备，见"素材说明"）
    ├── PNG/  GIF/  UI素材/

$DSH_HOME/profiles//plugins/
├── deco.js                    ← plugin/deco.js
├── photo.js                   ← plugin/photo.js
└── photo-client.js            ← plugin/photo-client.js（照片上传 UI）
```

### 2. 挂载插件

在 `$DSH_HOME/profiles//cordis.patch.yml` 添加：

```yaml
- insert:
    - id: deco
      name: './plugins/deco.js'
- insert:
    - id: photo
      name: './plugins/photo.js'
```

### 3. 启用开关

在 `$DSH_HOME/settings.yaml` 添加（默认开启）：

```yaml
deco:
  enabled: true
```

### 4. 重启 DSH

重启后装饰与照片上传自动生效（无需批准）。素材目录名、样式文件名、URL 前缀均可通过修改 `deco.js` 顶部常量调整：

```js
const MATERIAL_DIR = '网页素材'     // 素材目录名（相对工作区根）
const STYLE_FILE   = 'dsh-web-deco.css'
const ASSET_PREFIX = '/web-assets'  // 素材 URL 前缀（webServer 路由）
const STYLE_PATH   = '/assets/skin/deco.css'
```

### 📷 照片上传使用

1. 页面**右下角**的 📷 悬浮按钮 → 选择照片（PNG/JPG/WebP/GIF，≤12MB）
2. 图片以用户消息出现在对话流，同时写入工作区 `uploads/*.b64`
3. 对 AI 说"**用它做 XX**"（背景、PPT 插图等）——AI 会调用 `photo_uploads` 拿到路径并解码使用
4. 删除照片：让 AI 调用 `photo_delete`（对话流撤图 + 记录清除 + 文件路径提示）

## 🔘 开关

```yaml
# settings.yaml（热加载，刷新页面即生效）
deco:
  enabled: false    # false = 完全还原官方 UI
```

## 🎨 自定义装饰

所有装饰规则集中在 `dsh-web-deco.css`：

- **素材引用**：`url('/web-assets/PNG/坐坐.png')` 等——素材文件名需与 CSS 引用一致（或改 CSS）
- **布局**：`background-position` 百分比错落排布；顶部区域（y<20%）避免压会话头部
- **响应式**：`min(固定px, vw)` + `max-width: 1000px / 700px` 断点（小屏隐藏次要层：`background-size: 0 0`）
- **毛玻璃**：`.bubble` 规则（局部 blur + 文字对比色，亮/暗主题双份）

## 🧠 技术要点（为什么这样做）

- **背景层不挡字**：装饰全部用 `background-image`；`::after` 伪元素会盖到内容上，勿用
- **贴到真正的不透明层**：布局中"会话根容器"渲染不透明背景，会盖住其下所有装饰——用 `getComputedStyle` 探测 `bg=`/`img=`，把规则选择器贴到实际渲染层
- **`!important` 压内联**：产品运行时注入内联背景样式，装饰规则必须 `!important`
- **禁用 `background-attachment: fixed`**：多层背景 + overflow 容器下 Chrome 不渲染
- **缓存绕行**：样式 `<link>` 加时间戳 query（`?t=Date.now()`），Service Worker 也拦不住
- **生命周期**：路由/tap 的 disposer 用 `ctx.effect(...)` 绑定 fiber，卸载自动清理

开发方法详见 [`skill/`](skill/web-decoration-plugin-development/SKILL.md)。

## 📜 素材与版权说明

- **素材来源**：本主题使用的安洁莉娜素材由**鹰角网络官方**发布（官方在 B 站评论区提供的玩家素材包），官方下载链接：<https://link.hypergryph.com/c/20UR6mkR>
- **仓库不内置素材文件**——请从上述官方链接下载素材包，解压后放入工作区（目录结构见"安装"一节），避免仓库体积膨胀并尊重官方分发渠道
- 《明日方舟》及其角色、美术素材的版权归**上海鹰角网络科技有限公司**所有；官方授权玩家个人使用，请勿用于商业用途

## ⚖️ 许可

代码部分 MIT（随附 LICENSE 则以其为准）。素材版权归鹰角网络（官方发布的玩家素材包）。