#deepseek-code

驱动 DeepSeek Harness 的 grok-build 终端 UI。全终端
体验——鼠标、选择、回滚搜索、队列和待办事项窗格，
markdown 和语法渲染 — 由 dsh 代理运行时、提供程序支持，
插件和预设。

## 安装（两步）

```sh
npm i -g @deepseek-ai/dsh@next   # the official dsh CLI (0.1.0-rc.6)
git clone --depth 1 https://github.com/HQ1995/deepseek-code.git && cd deepseek-code
bash scripts/install.sh
```

`scripts/install.sh` 下载预构建的 TUI，构建 `grok-leader`
桥接并将其注册到 `deepseek-leader` 配置文件中，并链接 `dscode`
变成`~/.local/bin`。如果全局 npm 安装失败，启动器会回退
按需为 `npx --yes @deepseek-ai/dsh`。

要求：节点`^22.19.0`（或`>=24`）带有npm、pnpm（官方dsh）
插件命令驱动它），并在 Linux x86_64 上使用curl（cargo 在其他地方构建）。

已知差距：已发布的 dsh `0.1.0-rc.6` 缺少 EMFILE/ENOSPC
`deepseek-harness` 前叉携带的手表容量修复。的
deepseek-ai GitHub 存储库是一个仅发布的镜像（已禁用问题和 PR），因此
该修复程序作为分支 `fix/emfile-watch-capacity` 存在于我们的分支中；重新评估
在每个上游版本上。受影响的用户可以从分叉构建 dsh
npm（请参阅 docs/harness-updates.md）。

## 使用

```sh
dscode                # open the TUI
dscode "run tests"    # with a first prompt
```

TUI 本地状态位于 `$DSC_HOME` 下（默认 `~/.dsh/dsc-tui`）；
设置`DSC_HOME`来重新定位它。 `~/.grok` 从未被触及，
环境中的 `GROK_HOME` 被忽略，因此真正的 grok-build 安装可以
共存于同一台机器上。

按键：`Enter` 发送 · `/preset` 选择预设（会话立即重新加载） ·
`Ctrl+S` 简历 · `/model` 选择提供商/型号 · `Ctrl+Q` 退出。

预设：`minimal`（默认）、`code`、`standard`、`cordis`，以及您自己的预设
`~/.dsh/.agent-presets/`。插件：
`dsh plugin --profile deepseek-leader add `。

## 更新

线束来自npm（`npm i -g @deepseek-ai/dsh@next`）；的
`deepseek-harness/` 子模块保留用于分叉的开发/升级跟踪（请参阅
`docs/harness-updates.md`）。要获取存储库更改，请重新运行
`bash scripts/install.sh` — 它重建并重新注册桥。

## 布局

- `third_party/grok-build/` — 供应的 grok-build TUI (Apache-2.0)，二进制
  更名为`dscode`
- `bridge/grok-leader/` — 将 TUI 桥接至主套接字服务器
  harness，作为树外 dsh 插件安装
- `deepseek-harness/` — DeepSeek Harness 前叉 (MIT)，固定为
  子模块；仅开发/升级跟踪，安装程序从不需要

完整手册请参见 `docs/dscode-usage.md`。