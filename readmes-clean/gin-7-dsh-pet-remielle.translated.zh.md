# dsh-pet-remielle · 蕾米埃尔桌宠

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

DeepSeek Harness Web GUI 的《绝区零》角色蕾米埃尔（Remielle）桌宠插件，素材来自《绝区零》官方发布的活动表情包。

## 效果

透明悬浮、随 DSH 工作状态自动切换动画贴纸（下方为实际素材预览，GIF 即桌面宠使用的贴纸）：

### 状态 · 贴纸 · 触发
- **状态**: 工作ing · **贴纸**: ![01 工作ing](assets/01.gif) · **触发**: 正在流式输出回答
- **状态**: 摸鱼ing · **贴纸**: ![02 摸鱼ing](assets/02.gif) · **触发**: 正在调用工具
- **状态**: 得意ing · **贴纸**: ![03 得意ing](assets/03.gif) · **触发**: 一轮收尾 6 秒内
- **状态**: 思考ing · **贴纸**: ![04 思考ing](assets/04.gif) · **触发**: 本轮出现 think 块 / 尚未输出
- **状态**: 等待ing · **贴纸**: ![05 等待ing](assets/05.gif) · **触发**: 提问/批准弹窗等待 · 空闲 2 分钟
- **状态**: 待机ing · **贴纸**: ![06 待机ing](assets/06.gif) · **触发**: 常规空闲

桌宠悬浮于页面右下角（可拖动），透明背景无卡片；左键点击随机播放一个动作，右键菜单可调整缩放/透明度、锁定与重置位置、隐藏↔唤醒、暂停动画，并打开设置面板。

## 安装

```sh
dsh plugin --profile web add github:Gin-7/dsh-pet-remielle
```

加载即生效、卸载即复原（插件行 id 为 `ui-pet-remielle`）。

## 开发与构建

```sh
pnpm install
pnpm build          # 重新生成素材嵌入 + tsdown 构建 lib/
```

- `scripts/generate-art.mjs`：把 `assets/*.gif` 内联为 `src/client/art.generated.ts`（data URI）。
- `build/` 为 tsdown 客户端构建预设。
- 构建产物 `lib/` 已提交，安装无需构建。

## 版权与许可

- **插件源码**：基于 [MIT License](LICENSE) 发布。
- **素材**：来自《绝区零》「初代虚狩，回归」活动表情包，版权归原权利方（米哈游/HoYoverse）所有。本插件仅供个人学习与娱乐，**禁止商业使用与再分发素材本身**。署名与来源链见 `NOTICE`。