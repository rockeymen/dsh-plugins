# dsh-paste-path

一个 [DSH (DeepSeek Harness)](https://github.com/deepseek-ai/deepseek-harness) 插件：**在 Windows 资源管理器里复制文件，粘贴到 DSH 聊天输入框，自动插入该文件的真实绝对路径** —— 像 Codex 一样引用本地文件，全程不离开浏览器。

> ⚠️ **本仓库不是 npm 包**：不能 `npm install`，也不能挂进 `cordis.yml`。`plugin/` 下两个文件是 **DSH `cordis_define` 工具用的函数体**（动态 Cordis 插件）。安装方法见下方 [安装与使用](#安装与使用)。

## 为什么需要它

浏览器出于安全设计，永远不会暴露粘贴文件的真实绝对路径——`clipboardData.files[].name` 只能拿到文件名。Codex 能显示完整路径，是因为它跑在终端里而非浏览器。

本插件的绕过方案很简单：粘贴发生时，**Host 端读取 Windows 剪贴板的文件列表**（通过 PowerShell `Get-Clipboard -Format FileDropList`）。你在资源管理器里 `Ctrl+C` 复制文件后，剪贴板会保留完整的路径列表——所以 Host 能取回真实绝对路径并回传给浏览器。

## 环境要求

### 项目 · 要求
- **项目**: 系统 · **要求**: Windows（依赖 PowerShell `Get-Clipboard`）
- **项目**: 浏览器 · **要求**: Chromium 内核（Edge / Chrome）
- **项目**: DSH · **要求**: Web 界面，且后端与文件在同一台电脑的同一 Windows 会话（本机 localhost 即可）

## 安装与使用

这是一个**动态 Cordis 插件**——无需 npm 安装，但只在当前会话内生效（DSH 重启后需要重新加载）。

**🪄 零手动安装**：打开 DSH 对话，把 `plugin/host-half.js` 和 `plugin/client-half.js` 的内容贴进去，说一句：*"帮我安装这个动态插件：`code.host` 用第一段，`code.client` 用第二段，然后运行它。"* 它会自动帮你定义并运行。

1. 在 DSH Web 界面调用 `cordis_define` 工具：
   - 把 `plugin/host-half.js` 的内容粘贴到 `code.host`
   - 把 `plugin/client-half.js` 的内容粘贴到 `code.client`
   - 任意 `idPrefix`（如 `fpst`）与名称/用途描述
2. 调用 `cordis_run`，在界面 **Run 卡片上批准**（客户端半区需要浏览器授权）。
3. 完成。在资源管理器中 `Ctrl+C` 复制文件（或文件夹、多选文件），再到 DSH 输入框 `Ctrl+V`：
   - 单个文件 → `D:\work\report.docx`
   - 文件夹 → 完整路径
   - 多选 → 每个路径用空格分隔
   - 含空格的路径 → 自动加双引号

> 提示：粘贴**截图**（剪贴板没有文件列表）会保持 DSH 原有行为——作为图片附件插入，不会变成文字。

## 工作原理

```
资源管理器 Ctrl+C（文件）  ──►  剪贴板持有 CF_HDROP 文件列表
浏览器输入框 Ctrl+V
        │  捕获阶段 window 'paste' 监听接管事件
        ▼
host.call('paste-paths', { files: [{name,size,type}] })
        │
        ▼  Host 端执行（非受限、只读命令）：
        │  Get-Clipboard -Format FileDropList  ──►  真实绝对路径
        ▼
在光标处插入路径（空格分隔，必要时加引号）
```

边界情况处理：

- **截图/图片粘贴** —— 剪贴板无文件列表 → 插件重新派发粘贴事件，DSH 原有的图片附件流程不变。
- **文件名不匹配**（如中文名经管道传输出现编码差异）—— 粘贴本身是权威信号，匹配为空时直接采用剪贴板原始列表。
- **剪贴板读取失败** —— 退化为只插入文件名。

## 沙箱说明

剪贴板查询以 `danger-full-access` 模式运行。动态 Host 半区挂在 Host 根上下文下（没有会话对象），无法解析会话级沙箱策略；ACL 沙箱后端在无会话回退工作区下无法启动（其临时目录位于回退工作区内部）。该命令**固定且只读**（纯剪贴板读取，无文件系统访问），非受限运行是安全的。若希望使用会话级策略，可在插件内用会话对象解析策略并显式传入 `sandboxPolicy`。

## 局限与路线图

- **仅 Windows** —— 剪贴板技巧依赖 PowerShell `Get-Clipboard`；macOS（`osascript`/`pbpaste`）与 Linux（`xclip`）可在同一 Host 半区内扩展。
- **动态生命周期** —— 目前是会话级插件，DSH 重启后消失；固化为 Host 组合安装目前**受上游限制**：静态插件的客户端半区需要 client→host 的 RPC 通道（`@Remote` / `ctx.remote`），而该装配要求在 DSH Web 组合里显式 import `/remote` 产物——这是只有 DSH 维护者才能为第三方包打开的构建期耦合。若官方开放该机制，可安装的 npm 形态（带 `dsh.client` 元数据）就是顺理成章的后续。
- **仅 Chromium** —— 客户端半区使用 `DataTransfer`/`ClipboardEvent` 与捕获阶段监听。