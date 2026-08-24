#webdsh

[![webdsh — DeepSeek Harness 在浏览器选项卡中，没有服务器，也没有安装](https://capsule-render.vercel.app/api?type=rect&height=180&color=0:0d1117,55:15407e,100:2f81f7&text=webdsh&fontSize=68&fontColor=ffffff&fontAlignY=45&desc=DeepSeek+Harness+in+a+browser+tab+%C2%B7+no+server+%C2%B7+no+install&descSize=19&descAlignY=70)](https://dsh.zjzh.me/)

> 浏览器选项卡中的 DeepSeek Harness — 真正的代理、真正的节点，无需运行服务器。

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) 是
代理工具，一切都是插件。 `dsh web` 运行 Node 主机并提供服务
一个浏览器客户端。 **webdsh 是，作为静态文件** — 主机在内部运行
页面，代理的命令在 [WebContainers](https://webcontainers.io) 中运行：
节点本身，在选项卡中。

- ⚡ **无需运行。** 没有服务器，没有安装，没有本地节点 - 线束在页面中启动。
- 🖥️ **真正的Node，真正的Python。** `npm install`和`pip install`都可以工作，终端和代理共享一个容器。
- 💾 **或整台 PC。** 将运行时切换到 [v86](https://github.com/copy/v86)，会话运行 FreeDOS、Windows 1.01、Windows 3.1、Windows 98 或 Linux - 模拟 x86，从磁盘映像启动，使用机器实际拥有的工具集。
- 🧩 **真正的插件。** 从 npm、tarball、GitHub 或浏览器的路径安装。
- 📦 **真实的 dsh。** 已发布的 `@deepseek-ai/*` 包，未修改：129 行中的 114 行的组成与 `dsh web` 的组成完全相同。
- 🔒 **您的。** 文件、会话和密钥位于您浏览器的存储中。没有上传任何内容。

## 背景

这里没有任何东西是dsh的叉子。代理循环、工具注册表、模型适配器和
整个 Web 客户端在安装时来自 npm；唯一的修改是
`cordis.patch.yml` 层 — dsh 的机制正是为此而记录的。

该存储库添加的是底层平台：同步 POSIX
文件系统镜像到 IndexedDB (`src/vfs`)，在其上实现 `node:*`
(`src/node`)，会话可以运行的两个运行时 — WebContainers 和
模拟 x86 PC (`src/runtime`) — `/api` 的页内虚拟服务器以及
每个出站请求都会经过 CORS 策略 (`src/net`)，并且插件
该建造船（`packages/`）。

六个组成行被交换，每一行都是因为发货的名称为
页面不能有——或者，在外壳的情况下，不能诚实地描述。还有四个
被重新配置而不是被替换，包括决定是否
这种部署完全可以开辟一条道路。 `npx tsx scripts/alignment.ts` 打印
整个差异。

## 安装

无需安装 — [打开页面](https://dsh.zjzh.me/)。自己运行一下：

```sh
npm ci
npm run build        # → dist/
node scripts/serve.mjs 4173
```

节点 22 或更高版本。 `dist/` 是带有相对 URL 的纯静态文件，因此它可以工作
位于域根、项目路径或本地目录。

## 用法

打开页面，选择一个工作区，开始交谈。

- **文件** — 终端上方的侧边栏操作。浏览工作区，
  打开一个文件，放入文件，然后取出文件：一个文件本身，一个文件
  目录或复选框选择作为 zip。这是相同的文件系统
  代理和终端使用，不可复制。助手命名的文件路径
  当您单击它时，聊天将在此处打开。
- **终端** — `` Ctrl+` `` or the sidebar action. It is Node in this tab, and
  the same machine the agent's tools run in. Closing it hides it; the session,
  its scrollback and its working directory are still there when you reopen.
- **Python** — `python3` and `pip` are there for both of them. The first call
  fetches a 14 MB interpreter; after that it is stored, and packages installed
  with `pip` survive a reload. Write `python3`: `jsh` aliases `python` to it and
  loses the quoting on the way, so `python -c "…"` is a syntax error.
- **Runtime** — the sidebar action below the terminal. A session runs on one
  machine and this is where you pick it. The default is the Node container
  above; the alternative is an emulated 32-bit PC, and the panel is that PC's
  screen — live, with a working keyboard, showing what the assistant is doing.
  Five machines need no setup at all: **Linux** (busybox on a serial console,
  the shortest way here to a real POSIX shell), **FreeDOS**, **MS-DOS 7**,
  **Windows 1.01** and **KolibriOS**. Eleven more boot exactly the same way but
  are not this deployment's to serve a disk for — **Windows 2.03**, **3.0**,
  **3.1**, **95**, **98**, **ME**, **NT 4.0** and **2000**, **MS-DOS 6.22**,
  **Buildroot Linux**, and **Arch Linux**, which is a 2022 kernel with bash,
  python3 and gcc and resumes from a saved machine in about two seconds. For
  those, open a disk image from your computer or point the panel at a host that
  has one. Nothing is downloaded until you choose a machine, and a change
  applies on the next load.
- **Plugins** — Settings → Plugins, or `/插件添加` in the composer.
  Takes an npm name, a tarball URL, `owner/repo#ref`, or a path. The *Installed*
  tab turns one off or removes it; the composition is fixed at boot, so a change
  applies on the next reload and the panel says so.
- **Models** — 42 models across six routes are registered up front and need no
  account, so the page answers before it asks for anything. Settings → Models
  offers the rest of the provider catalog; typing a key is the whole of
  configuring one.
- **Network** — Settings → Network picks the CORS proxy, used only after a
  direct request has actually failed, and reported to you when it is.
- **Persistence** — workspace, sessions and transcripts survive a reload.
  `window.dsh.exportFs()` downloads a zip; `window.dsh.reset()`清除一切。

在模拟机器上，助手会获得不同的工具，因为它是一个
不同的机器：Linux guest 上的 `sh`，DOS 上的 `dos` — 两者都在读取
一个真正的字符流，因此命令的整个输出返回而不是
最后 25 行 — 以及 `vm_screenshot`、`vm_screen`、`vm_key`、`vm_type`、
`vm_mouse`和`vm_wait`随处可见，这是一个工具集的整体
只绘制像素的 guest。里面没有 `jsh`，没有 Node，也没有 Python
会话，并且来宾磁盘与您的文件工具的工作区不共享任何内容
阅读。面板和工具都是这么说的。

值得注意的是：容器的 shell 是 `jsh`，而不是 bash，并且它附带的不是 `git`；
`python3` 是 CPython 3.14 编译为 WebAssembly，首次使用时获取并保留
之后，它有 pip，但没有编译器，没有子进程，也没有套接字；和一个
拒绝浏览器的主机只能通过代理访问，而代理不能访问
延伸到容器。

## 维护者

[@futrime](https://github.com/futrime)