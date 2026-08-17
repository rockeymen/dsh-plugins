# DSH 书桌宠物

  ![DeepSeek 鲸鱼，呼吸和眨眼](docs/media/idle.gif)

  一个桌面宠物，可以向您展示您的代理正在做什么。
  它漂浮在每个窗口（包括全屏）上方并改变表达方式
  DSH 工作、等待、完成或失败。

  ![空闲、工作、等待、错误、快乐、睡眠](docs/media/states.png)

  <sub>空闲·工作·等待·错误·快乐·睡觉</sub>

## 安装

DSH 已经设置完毕，一条命令：

```bash
dsh plugin --profile web add deepseek-desk-pet
dsh web
```

宠物出现在您的桌面上，漂浮在您正在使用的任何内容之上。
DSH 页面本身没有添加任何内容。

仅限宠物，无 DSH：克隆存储库并运行 `./bin/dsh-desk-pet`。

要关注主分支而不是已发布的版本：

```bash
dsh plugin --profile web add github:anneheartrecord/dsh-desk-pet#main
```

> npm 包是 **deepseek-desk-pet** 而 repo 是 **dsh-desk-pet**：
> npm 拒绝 `dsh-desk-pet`，因为它与不相关的 `dsh-deskpet` 太相似。

**无依赖性。** 它在系统 `/usr/bin/python3` 上运行并与
AppKit 通过 `ctypes`。无需安装，无需构建。

## 使用

### ·
- **拖动** · 将其抓取到任何地方。你离开的地方就是下次开始的地方。
- **单击** · 打开会话列表 — 存在哪些 DSH 会话、哪些会话处于活动状态、正在做什么。再次单击即可关闭。
- **右键单击** · 循环皮肤。
- **停止** · `./bin/dsh-desk-pet --stop`，或停止`dsh web`。

它在后台启动并与您的终端分离，因此您可以关闭
您从中启动它的窗口。

## 州

由您当地的 DSH 驱动。没有什么可配置的。

### 状态·何时
- **状态**：**空闲** · **何时**：无所事事 - 呼吸，时不时眨眼
- **状态**：**工作** · **何时**：DSH 正在运行
- **状态**：**等待** · **何时**：因确认、批准或您的输入而被阻止
- **状态**：**错误** · **何时**：运行失败
- **状态**：**快乐** · **何时**：跑步刚刚结束；几秒钟后恢复空闲状态
- **状态**：**睡眠** · **何时**：当代理空闲时**且**您的指针停止移动时打瞌睡。任何活动或戳戳都会唤醒它。

最后一个故意需要两个时钟：无事可做的代理不是
就像没有人坐在桌子上一样。

## 皮肤

  ![五款皮肤](docs/media/skins.png)

  <sub>DeepSeek 鲸鱼（默认）·蓝鲸·Threadcore·鹦鹉螺·水母</sub>

右键循环，或者`--skin `。每个皮肤在 3 时都具有所有六种状态
每个帧。

＃＃ 选项

```bash
./bin/dsh-desk-pet --scale 0.5      # smaller (default 0.7)
./bin/dsh-desk-pet --skin jellyfish # start on a specific skin
./bin/dsh-desk-pet --reset          # forget saved position, size and skin
./bin/dsh-desk-pet --stop           # stop the running pet
./bin/dsh-desk-pet --foreground     # stay attached, log to this terminal
./bin/dsh-desk-pet --probe          # diagnostics, no window
./bin/dsh-desk-pet --inventory      # frames per skin per state
```

## 它是如何工作的

宠物手表 `~/.dsh` — 正在运行的进程、会话活动和可选的
提示文件 - 并将其找到的内容映射到六个状态。手动驾驶：

```bash
echo '{"kind":"working"}' > ~/.dsh/pet-activity.json
rm ~/.dsh/pet-activity.json          # back to automatic
```

宠物将它看到的内容发布到 `~/.dsh-desk-pet/state.json`，这就是
第二次启动知道其中一个已经在运行以及 `--stop` 如何找到它。

短暂地有第二只宠物镜像到 DSH 页面。它消失了：两只宠物
在一个屏幕上显示为一个错误，而镜子就是失败所在。的
漂浮在一切之上的窗户是值得拥有的东西。

### 为什么是 AppKit 而不是 Tk

macOS 发布了 2010 年发布的 Tcl/Tk 8.5.9，在 macOS 26 上其绘图路径没有
到达屏幕的时间更长：窗口映射，画布报告本身映射，
可见、尺寸正确并将图像保持在正确的坐标处 - 以及
出现的是一个空的灰色矩形。

所以窗口是通过`ctypes`直接构建在AppKit上的。那更是
机械，它购买了 Tk 根本无法提供的三样东西：真正的阿尔法
代替 1 位 GIF 遮罩，而是清除全屏空间的窗口级别，以及
作为子窗口与宠物一起移动的会话面板。

## 发展

```bash
/usr/bin/python3 -m unittest discover -t . -s tests -v     # 148 tests, no display needed
DSH_PET_ART_CHECK=1 /usr/bin/python3 -m unittest discover -t . -s tests   # + the pixel gate
node tests/plugin_smoke.mjs                                 # the plugin's HTTP routes
```

### 艺术管道

```bash
./scripts/generate_frames.py    # fill in missing poses
./scripts/build_frames.py       # key, align, scale; writes both frame sets
./scripts/check_frames.py       # per-pixel inspection
./scripts/contact_sheet.py      # one reviewable image, no window required
```

新艺术作品采用**洋红色 `#FF00FF` 背景**，并且不得使用道具
洋红色。盘子必须是艺术品从未包含的颜色：第一个
批次是在柔和的盘子上生成的 - 水母后面的薄荷绿 - 关闭
足够的字符，没有关键的阈值可以将它们分开，这就是
那只水母在运输时眼睛就被挖掉了。

**generate_frames** 永远不会从头开始重新绘制角色；每个请求都是一个
对现有静态图像进行图像到图像编辑，因为文本到图像无法容纳
跨呼叫的身份。状态帧 `00` 从皮肤的空闲姿势编辑；
帧 `01` 从 **其自身状态** 的帧 00 进行编辑，因为循环需要
稍后再做同一个姿势，而不是两个不同的姿势。

**check_frames** 是唯一查看像素的测试。其他都可以
只比较文件名——这就是皮肤曾经通过整个套件的方式
它的脸上被打出了洞。

### 自定义皮肤

皮肤是框架的文件夹。 `assets/web//<state>/*.png` 的任何内容
单独出现在循环中，无需更改代码。

## 已知限制

- 窗口是一个矩形，因此点击落在周围的透明边距上
  宠物够不到它后面的东西。每像素点击率已写入，但
  尚未接线。
- 还没有菜单 - 右键单击​​循环皮肤而不是打开皮肤。

接下来计划什么，以及故意不计划什么：[docs/ROADMAP.md](docs/ROADMAP.md)。