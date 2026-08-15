# dsh-pet 🐾

一只住在 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面里的桌面宠物：待机呼吸、随机动作（含打瞌睡）、偶尔转向、屏幕漫游、点击反应、可拖拽。

这不是一个普通插件，而是**完整的三件套项目**：

```
① 提示词（配方）    →  ② 素材生成链（引擎）  →  ③ 插件（成品）
AI 生成动画的配方     源视频 → 透明动画的管线    运行在 DSH 里的宠物
```

任何人 clone 本仓库，都可以**从零生成自己的桌面宠物**——换角色、换动作、换风格，全流程可复现。

## 快速开始（安装插件）

```sh
dsh plugin --profile web add dsh-pet
```

重启 `dsh web`，宠物出现在右下角。

## 从零生成你自己的宠物（完整流程）

### ① 提示词 → 源视频

用 AI 视频生成工具（如可灵、Runway 等），按 `prompts/桌面宠物 10 秒动作提示词.md` 的配方生成 25 个 10 秒绿幕视频：

- 视频比例 16:9，背景纯绿幕（#00FF00）
- 人物位置/大小固定（头顶 ~20% 高度、脚底 ~85% 高度）
- 动作全程在画幅内，首尾帧为标准正面站立
- 每段动画按秒分解（0-10s 各阶段动作）

生成结果放入 `video/`（25 个 mp4）。

### ② 源视频 → 透明动画（素材链）

```sh
cd scripts
python crop_step01.py        # 裁掉左右绿幕边缘 → step01/
python chroma_step02.py      # 绿幕抠像转透明 → step02/
python normalize_step03.py   # 归一化 1200×1200 统一站立 → step03/
python encode_thumbs.py      # 转码 360×360 播放变体 → step04/
```

**依赖**：Python 3 + ffmpeg（素材链零第三方 pip 依赖，脚本自动用工作区 `.tools/` 下的 ffmpeg）。

### ③ 动画 → 插件

```sh
# 把 step04 的播放变体同步进插件包
cp step04/*.webm dsh-pet/assets/thumb/

# 本地安装插件
dsh plugin --profile web add file:D:/path/to/dsh-pet
```

> 中间产物（step01-04）由脚本生成、不入仓库；`video/` 源视频和脚本是成果、入库维护。

## 项目结构

```
├── prompts/                 # ① 25 个动作的生成提示词（绿幕规范 + 按秒分解）
├── scripts/                 # ② 素材生成链（4 个 Python 脚本）
├── video/                   # ② 源视频（25 个绿幕 mp4）
├── tools/                   # 开发工具：preview.html（素材链各阶段效果预览）
├── dsh-pet/                 # ③ 插件（可独立 npm 发布）
│   ├── lib/index.js         #   host 半侧：/pet 视频路由
│   ├── lib/client.js        #   浏览器半侧：动画链 + 双缓冲播放
│   └── assets/thumb/        #   360×360 播放动画（25 个，~10MB）
├── DESIGN.md                # 设计与实现文档（含踩坑记录）
└── LICENSE                  # MIT
```

## 插件功能

- **动画链**：每个动画（含待机）播完立即按概率选下一个——30% 待机 / 10% 转向 / 40% 动作 / 20% 移动，首尾相接永不停止
- **屏幕漫游**：朝 facing 方向行走，先检查空间、不走出屏幕
- **点击/拖拽**：点击有回应动画，可拖到任意位置
- **左右朝向**：所有动画可镜像，人物可朝左/朝右
- **落地对齐**：动画统一脚底线，宠物始终站在地面上
- **流畅切换**：双缓冲交叉淡入，切换无空白帧

## 运行效果

宠物实际运行在 DSH Web 界面中的样子：

  ![dsh-pet 运行效果 1](assets/screenshots/dsh-pet-running-1.png)
  ![dsh-pet 运行效果 2](assets/screenshots/dsh-pet-running-2.png)

## 效果预览

全部 25 个动画（360×360，插件实际播放用的资源）——GitHub 只对仓库内图片渲染内联预览，故此处用 GIF 演示；完整透明视频见 `dsh-pet/assets/thumb/`：

**待机 / 转向**

  ![待机呼吸休闲](dsh-pet/assets/preview/待机呼吸休闲.gif)
  ![东张西望](dsh-pet/assets/preview/东张西望.gif)

**移动**

  ![螃蟹走路](dsh-pet/assets/preview/螃蟹走路.gif)
  ![原地漂浮踏步](dsh-pet/assets/preview/原地漂浮踏步.gif)

**动作**

  ![悠闲哼歌](dsh-pet/assets/preview/悠闲哼歌.gif)
  ![超大伸懒腰](dsh-pet/assets/preview/超大伸懒腰.gif)
  ![原地专心玩魔方](dsh-pet/assets/preview/原地专心玩魔方.gif)
  ![原地敲击桌面互动](dsh-pet/assets/preview/原地敲击桌面互动.gif)
  ![原地重力下蹲压缩](dsh-pet/assets/preview/原地重力下蹲压缩.gif)
  ![哈欠连天](dsh-pet/assets/preview/哈欠连天.gif)
  ![原地小憩沉眠](dsh-pet/assets/preview/原地小憩沉眠.gif)
  ![原地蹲下玩玩具汽车](dsh-pet/assets/preview/原地蹲下玩玩具汽车.gif)
  ![鲸鱼吐泡泡特效](dsh-pet/assets/preview/鲸鱼吐泡泡特效.gif)
  ![女仆屈膝礼仪](dsh-pet/assets/preview/女仆屈膝礼仪.gif)
  ![被吓一跳（炸毛）](dsh-pet/assets/preview/被吓一跳（炸毛）.gif)
  ![原地跳跃抓碎头顶物品](dsh-pet/assets/preview/原地跳跃抓碎头顶物品.gif)
  ![小幅度原地 360 度旋转展示](dsh-pet/assets/preview/小幅度原地 360 度旋转展示.gif)
  ![偷吃零食被抓住](dsh-pet/assets/preview/偷吃零食被抓住.gif)
  ![玩游戏气急败坏](dsh-pet/assets/preview/玩游戏气急败坏.gif)
  ![用鲸鱼尾巴拍打地面](dsh-pet/assets/preview/用鲸鱼尾巴拍打地面.gif)
  ![打瞌睡被惊醒](dsh-pet/assets/preview/打瞌睡被惊醒.gif)

**点击回应**

  ![点击回应 - 开心跃动](dsh-pet/assets/preview/点击回应 - 开心跃动.gif)
  ![点击回应 - 害羞惊讶](dsh-pet/assets/preview/点击回应 - 害羞惊讶.gif)
  ![点击回应 - 傲娇生气（侧身展示）](dsh-pet/assets/preview/点击回应 - 傲娇生气（侧身展示）.gif)

**拖拽**

  ![被鼠标拖拽悬空反馈](dsh-pet/assets/preview/被鼠标拖拽悬空反馈.gif)

> 注：动画为透明背景；GIF 预览中透明部分显示为页面底色，实际 webm 播放为透明。

## 文档

- [设计与实现](DESIGN.md) —— 架构、动画链模型、素材链、踩坑记录

## 许可

- 代码：MIT
- 素材（动画/提示词）：见仓库说明