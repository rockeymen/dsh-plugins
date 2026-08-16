# dsh-theme-cyberpunk2077-custom — NIGHT CITY EDITION（定制增强版）

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![DSH](https://img.shields.io/badge/DeepSeek%20Harness-0.1.0--rc.6-blue)
![GitHub stars](https://img.shields.io/github/stars/Gewuji/dsh-theme-cyberpunk2077-custom?style=social)

> 欢迎来到夜之城。你的 DeepSeek Harness 已经被改装过了——而且比原版更野。

基于 [Tommy00748/dsh-theme-cyberpunk2077](https://github.com/Tommy00748/dsh-theme-cyberpunk2077)（MIT）深度定制的 Cyberpunk 2077 / 夜之城主题。纯浏览器客户端插件，零音频资源，全部 Web Audio 实时合成。

在原版基础上做了大量增强：**音量放大 4.5 倍、双层动态 CRT、RELIC 狂暴干扰、全屏随机代码背景**——夜之城氛围直接拉满。

![NIGHT CITY](assets/screenshot.png)

## ✨ 特色功能

### 🔊 音效增强
- 所有合成音效增益放大 **~4.5 倍（+13dB）**：打字机按键音、发送/完成/错误/通知音，清晰可闻
- 零音频资源，全部 Web Audio 实时合成

### 🖥️ 双层动态 CRT
- **文字层**：密集细扫描线（2px 周期）**静止**覆盖在内容上，不干扰阅读
- **背景层**：青白亮线在面板背景中**持续向下滚动**
- **扫描带**：每轮随机 1~3 根、**同速错开**，从上到下整齐扫过；轮与轮之间数量和速度重新随机（时慢时快）
- 亮度条 + 霓虹雾 + 城市网格

### 📡 RELIC 干扰（狂暴版）
- 每 **15~30 秒随机触发**，持续 **0.1~0.2 秒**一闪而过
- 整个界面被**左右甩动 ±300~340px**、侧栏反向撕裂、红青全屏闪色
- 真·屏幕错位，不是透明遮罩糊弄

### 💻 全屏随机代码背景
- **终端日志式**代码从下往上持续翻动，**铺满整个屏幕**（列数随宽度自适应）
- **红色系**霓虹配色（红 / 红橙 / 琥珀）
- **每 30 秒重新生成全新随机代码**——夜之城词汇 × 代码句式随机组合，几乎不重样

### 🎛️ 控制面板（DECK）
- CRT 扫描线 / Relic 干扰 / 开机转场 / 打字音效 / 消息音 / **代码背景** 各自独立开关
- `SND` 一键静音全部；所有偏好存 localStorage

### 🥚 彩蛋
- 输入 `relic` 并发送 → 「WAKE UP, SAMURAI. WE HAVE A CITY TO BURN.」
- 输入 `johnny` 并发送 → 强尼·银手夺屏 2.6 秒

### 🛡️ 性能护栏
- `prefers-reduced-motion` 下自动关闭全部动画
- 小屏（≤768px）自动精简特效

## ⚡ 安装

```bash
dsh plugin --profile web add git+https://github.com/Gewuji/dsh-theme-cyberpunk2077-custom.git
```

重启 `dsh web`，强刷浏览器（Ctrl+F5），看到 NIGHT CITY 开机转场即成功。

> 需要目标设备能访问 GitHub（国内建议挂代理）。

## 🔄 更新

```bash
dsh plugin --profile web update dsh-theme-cyberpunk2077
```

重启 `dsh web` 生效。

## 🎨 自定义

所有特效数值都在 `lib/client.js`，可直接修改：

| 想调什么 | 去哪改 |
|---|---|
| 音效音量 | `playKeyClick` / `blip()` 里的增益值 |
| 扫描线密度 / 颜色 | CSS `#root::after` |
| RELIC 频率 / 强度 | `startRelicLoop()` 的间隔 + `cpShift` 动画 |
| 代码背景内容 / 速度 | `startCodeBg()` + `.cp-code-line` 颜色 |

## 🧹 卸载

```bash
dsh plugin --profile web rm dsh-theme-cyberpunk2077
```

删掉 `~/.dsh/profiles/web/cordis.patch.yml` 里的 `ui-theme-cyberpunk` 行，重启即可。

## 📜 许可证

MIT — 基于 [Tommy00748/dsh-theme-cyberpunk2077](https://github.com/Tommy00748/dsh-theme-cyberpunk2077)（MIT）定制。
