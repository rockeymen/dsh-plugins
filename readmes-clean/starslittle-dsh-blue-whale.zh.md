# dsh-blue-whale

[English](README.md) · 中文

复刻 DeepSeek Chat 蓝鲸配色的皮肤，亮色/深色跟随系统外观。

![首页对比](docs/compare-home.png)

![品牌对比](docs/compare-brand.png)

DSH 出厂是黑鲸，[chat.deepseek.com](https://chat.deepseek.com) 是蓝鲸。装上后，侧栏字标、欢迎页鲸、浏览器标签页图标、主按钮和强调色换成 Chat 蓝 `#4D6BFE`。亮色 / 深色 / 跟随系统仍走自带的「外观」。

## 安装

```sh
dsh plugin --profile web add github:starslittle/dsh-blue-whale
```

重启 `dsh web`，再硬刷新浏览器（Ctrl+Shift+R）。默认开启。

打开 **设置 → 通用 → 蓝鲸**。标题旁绿点表示已开启。**关闭** 和自带「排队发送」同一颗胶囊；**打开** 是蓝底白字。

## 装完怎么验

### 现象 · 怎么办
- **现象**: 侧栏鲸和 `deepseek` 字变蓝 · **怎么办**: 已生效
- **现象**: 还是黑鲸 · **怎么办**: 重启后再硬刷新
- **现象**: 关掉开关立刻恢复出厂配色 · **怎么办**: 正常

## 改了什么

###  · 出厂 DSH · 本皮肤
- 侧栏鲸 + `deepseek` 字 · **出厂 DSH**: 近黑 / 近白 · **本皮肤**: `#4D6BFE`
- 欢迎页鲸 · **出厂 DSH**: 同上 · **本皮肤**: `#4D6BFE`
- 浏览器标签页图标 · **出厂 DSH**: 黑（系统深色下为白） · **本皮肤**: `#4D6BFE`
- 品牌色 / 发送键 / 强调 · **出厂 DSH**: 黑或白 · **本皮肤**: `#4D6BFE`
- 页面底色 · **出厂 DSH**: 自带浅色 / 深色 · **本皮肤**: 不动
- 亮暗切换 · **出厂 DSH**: 自带外观 · **本皮肤**: 仍走自带外观

辅助色来自 DSH 仓库里的 `--dsw-static-deepseek-*`。

## 不做的事

- 不改布局和信息密度
- 不改 `dsh web` 桌面壳的窗口图标或托盘图标
- headless / TUI 没有界面，不必装

关掉或卸载后，出厂配色立刻回来。

## 许可

MIT