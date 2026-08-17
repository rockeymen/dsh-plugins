# dsh-client-ui-skin-denia · 达妮娅 · 虚无之泡

DeepSeek Harness Web GUI 的鸣潮达妮娅主题皮肤。

## 效果预览

点击图片可查看完整尺寸。

### 布景之形（亮色） · 幻灭之形（暗色）
- **布景之形（亮色）**: [![布景之形](preview/light.webp)](preview/light.webp) · **幻灭之形（暗色）**: [![幻灭之形](preview/dark.webp)](preview/dark.webp)

## 特性

- **双形态切换**：布景之形（亮色）/ 幻灭之形（暗色），含形态切换动画
- **左右全身立绘** + Q版动态 GIF 吉祥物
- **玻璃卡片层级**：root 半透明 + backdrop-filter 模糊
- **泡泡粒子场**：双层虹彩气泡上浮
- **锁链边框**：深紫锁链，跟随侧栏宽度
- **渐变文字**：工作区/会话标题粉紫渐变
- **装饰条 + 四角星**：侧边栏彩虹渐变装饰
- **深色/浅色按钮文字替换**：布景之形 / 幻灭之形
- **新会话欢迎界面注入**：达妮娅标题 + 副标题 + 台词
- **侧栏收起/展开自适应布局**：立绘 + Q版 + 文字居中联动
- **黑白娅分别背景图**

## 版权所有人

### 版权所有人 · 版权所有内容
- **版权所有人**: Kuro Games（库洛游戏） · **版权所有内容**: 「鸣潮」游戏作品及达妮娅（Denia）角色形象原作
- **版权所有人**: Ewnscat · **版权所有内容**: 皮肤覆盖层实现（CSS 配色、SVG 装饰、DOM 装饰逻辑）

\*背景 / 角色 / 画框素材及预览截图来自用户本地素材库。本皮肤为同人创作，与 Kuro Games 无关联。

## 安装

### 懒人版

对你的 dsh 说：
```
安装一下这个皮肤包：https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia
```

### 手动安装

```sh
git clone https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia
cd <harness>
dsh plugin --profile web add ../dsh-client-ui-skin-denia
```

或手动将本包放入 DSH 的 `profiles/web/node_modules/@dsh-external/dsh-client-ui-skin-denia/` 目录下，然后在 `cordis.patch.yml` 中添加：

```yaml
- id: ui-skin-denia
  disabled: false
```

重启 DSH 后在设置 → 皮肤中选择"达妮娅 · 虚无之泡"。

## 调色板

皮肤加载后，界面右下角会出现一个可折叠的调色板面板。所有设置自动保存在浏览器 localStorage，刷新不丢失。

### 亮色 / 暗色（分形态独立控制）

### 控件 · 说明
- **控件**: 背景图 · **说明**: 上传自定义背景 / 清除恢复默认
- **控件**: 左立绘 · **说明**: 显示/隐藏左侧角色立绘
- **控件**: 右立绘 · **说明**: 显示/隐藏右侧角色立绘
- **控件**: Q版吉祥物 · **说明**: 显示/隐藏 Q版 GIF 表情包

### 通用（亮暗两形态同时生效）

### 控件 · 范围 · 默认值
- **控件**: 对话宽度 · **范围**: 500–1000px · **默认值**: 780px
- **控件**: 立绘高度 · **范围**: 30–80vh · **默认值**: 55vh
- **控件**: 立绘水平偏移 · **范围**: −50–50px · **默认值**: 0px
- **控件**: 表情大小 · **范围**: 60–240px · **默认值**: 120px
- **控件**: 表情竖直偏移 · **范围**: −200–200px · **默认值**: 0px
- **控件**: 背景透明度 · **范围**: 20–100% · **默认值**: 100%
- **控件**: 消息文本框 · **范围**: 开/关 · **默认值**: 关
- **控件**: 文本框透明度 · **范围**: 20–100% · **默认值**: 68%
- **控件**: 泡泡粒子场 · **范围**: 开/关 · **默认值**: 开
- **控件**: 泡泡数量 · **范围**: 5–40 · **默认值**: 20
- **控件**: 泡泡速度 · **范围**: 30–200% · **默认值**: 100%
- **控件**: 锁链边框 · **范围**: 开/关 · **默认值**: 开
- **控件**: 装饰条 · **范围**: 开/关 · **默认值**: 开

点击「♻ 恢复默认设置」可一键还原所有选项。

## 兼容性

- DSH Web：0.1.0-rc.6（dsh-web-frontend）
- 平台：Web
- 最近验证日期：2026-08-17

## 更新日志

### v0.0.2 — 2026-08-17

**修复**
- 对话宽度滑块不生效：CSS 选择器改为匹配 DSH Web 真实 DOM（`_centerCol` / `_viewArea` / `_composerSeat`）
- 左侧立绘闪烁：移除 `getComputedStyle()` 强制样式重算，改用 `getBoundingClientRect()` 位置检测
- 刷新后 Q版不出现：添加 2 秒延迟重试，应对 DSH React 异步渲染时序

**新增**
- 右侧 workbench 面板打开时，左立绘和 Q版表情包自动淡出至 20% 透明度，关闭后恢复
- 调色板新增控件：表情大小（60–240px）、表情竖直偏移（−200–200px），亮暗双形态同时生效
- 调色板底部显示当前版本，自动检查 GitHub Release，有新版时提示更新
- README 兼容性声明、package.json `dsh.client.version` 字段

### v0.0.1

- 初始发布

## 致谢

### 来源 · 说明
- **来源**: [maid-atelier](https://github.com/Small-tailqwq/dsh-deep-whale)（Small-tailqwq） · **说明**: 皮肤工程结构思路：模块加载工厂模式、内联背景同步、侧边栏伪元素装饰、工作区树标记逻辑、固定层角色舞台架构
- **来源**: [dsh-client-ui-skin-miku](https://github.com/linxin6666)（@linxin6666） · **说明**: 玻璃卡片层级方式：`[id=root]` backdrop-filter + scrim 遮罩模式
- **来源**: [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)（zhu1090093659） · **说明**: 皮肤工程脚手架

\*反馈问题尽可能在 issue 中发起。

## 许可

本仓库以 **CC BY-NC-SA 4.0**（署名-非商业性使用-相同方式共享）发布，禁止商业性使用。署名链见 `NOTICE`。

Character "Denia" (达妮娅) and "Wuthering Waves" (鸣潮) are trademarks of Kuro Games. This skin is a fan work and is not affiliated with or endorsed by Kuro Games.