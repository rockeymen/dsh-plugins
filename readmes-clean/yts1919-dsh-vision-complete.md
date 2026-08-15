# DeepSeek 完整视觉能力插件（Vision-Complete）

> 一键安装，让 DeepSeek 拥有「眼睛和耳朵」：看图、取字、定位物体、理解视频、转写语音、分析音乐、读 PDF/文档、截图直读。

DeepSeek 本身是纯文本模型，看不到图、听不到声。这个插件把下面两套东西整合成一个包，装一次就能用：

### 组成 · 作用
- **组成**: **`skills/vision-multimodal`** · **作用**: 核心 skill：教 DeepSeek 该调哪个工具看图/听声。含 `vision.py`（零依赖，可接任意 OpenAI 兼容视觉模型）
- **组成**: **`tools/screenshot-tool`** · **作用**: Windows 截图自动保存：截图后剪贴板自动变成图片路径，粘贴即让 DeepSeek 读图
- **组成**: **qwen-mm-plugins MCP**（安装时自动注册） · **作用**: 三个 MCP 服务器（core / api / video-memory），提供通义千问的云/本地视觉工具
- **组成**: **`references/`** · **作用**: API Key 配置、多供应商切换等说明

## 一、安装（4 步）

> 需要 Windows + PowerShell。全程约 5 分钟。

> 🔑 **开始前先知道一件事**：这个插件本身不含「眼睛」模型，它是调用**云端视觉大模型**（默认通义千问）来替你看图。所以你必须先准备一个 **API Key**（见第 3 步）。**没有 key，装完也用不了**——这是唯一绕不开的一步，别跳过。

### 第 1 步：下载本仓库并解压

在仓库页点绿色 **Code** 按钮 → **Download ZIP** → 解压到任意位置；或用命令：

```bash
# GitHub（国内打不开就用下面的 Gitee 地址）
git clone https://github.com/Yts1919/dsh-vision-complete.git
# Gitee 码云（国内访问更快）
git clone https://gitee.com/yonnn/dsh-vision-complete.git
```

比如解压/克隆到 `C:\DeepSeek-Vision\`（**文件夹叫什么名字都行**，不影响安装）。

> 💡 **解压到 D 盘、E 盘、桌面等任何位置都一样**：比如你解压到了 `D:\我的插件\DeepSeek-Vision`，后面就在这个文件夹里双击 `install.bat` 操作即可。**盘符（C:/D:/E:…）和文件夹名都不影响安装**——只要记得自己解压到了哪里、进到那个文件夹就行。

### 第 2 步：双击 `install.bat` 安装

**最简单：直接双击 `install.bat`**，会弹出安装窗口并自动完成安装（装 skill → 注册 MCP → 装截图工具 → 环境自检）。窗口最后会停住，看到「安装完成」就是成功。

> ⚠️ **不要右键 `install.ps1` 选「使用 PowerShell 运行」**——那样脚本一跑完（或一报错）窗口就会**一闪就关**，什么也看不到。`install.bat` 已经内置了执行权限和结束停留，双击它最稳。

命令行方式（可选，路径换成你自己的实际位置）：

```powershell
# 先进入你解压出来的文件夹（把下面路径改成你的实际路径，例如 D:\我的插件\DeepSeek-Vision）
cd C:\DeepSeek-Vision
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

### 第 3 步：配置 API Key（必做，否则云端模型用不了）

打开这个文件，按里面步骤 5 分钟搞定：
```
C:\Users\你的用户名\.dsh\skills\vision-multimodal\references\api-key-setup.md
```

一句话版：去 [阿里云百炼](https://bailian.console.aliyun.com/) 建一个 API-KEY，然后 PowerShell 执行：

```powershell
setx DASHSCOPE_API_KEY "sk-你的key"
```

最后**完全退出并重启 DeepSeek Harness**，完成。

### 第 4 步：验证是否成功

1. 随便找一张图片（或按 `Win+Shift+S` 截一张），拖进 DeepSeek 聊天框。
2. 对它说「描述这张图」。
3. ✅ 能返回图片内容 = 装好了，开始用吧。
4. ❌ 报「没有 API Key / 401」→ 回第 3 步：确认 `DASHSCOPE_API_KEY` 已设置，并**完全退出重开** Harness。
5. ❌ 报「没有 `mcp__qwen-mm-plugins-*` 工具」→ 看下面「常见问题」第二条。

> 💡 **兜底办法**：如果实在配不好环境变量，直接把 API Key 整段**粘贴发给 DeepSeek** 也行（例：「这是我的 key：sk-xxx，接下来看图都用它」）。它会在**本次对话里**直接用这个 key 看图。注意这只是临时方案，重启后仍建议按第 3 步配好，这样每次都能自动生效。

## 二、怎么用

装好后，**直接跟 DeepSeek 说话就行**，不需要记命令。例如：

- 「描述一下这张图」+ 发图
- 「把这张截图里的文字提取出来」
- 「图里的猫在哪个位置，帮我画个框」
- 「总结这段视频讲了什么」+ 发视频
- 「把这个会议录音转成文字」
- 「这张 PDF 第 2 页讲了什么」

模型会自动触发 `vision-multimodal`，自己选对工具。

### 截图直读（装了 screenshot-tool 后）

这个功能让你**截完图直接就能让 DeepSeek 读**，不用手动存文件、再拖文件，特别适合截屏提问。

**原理**：装插件时附带了一个「截图监控」小脚本。它开着时，你按截图键，截图会自动存成 PNG 文件，同时剪贴板会被替换成**这张图的路径文字**——所以你粘贴出来的是路径，DeepSeek 顺着路径就能读到图。

**第 1 步：开启截图监控（只需做一次，之后保持窗口开着）**

1. 打开文件夹 `C:\Users\你的用户名\.dsh\tools\screenshot-tool\`（`~\.dsh` 里的 `~` 就是你的用户目录，例如 `C:\Users\张三`）。
2. 双击 `start-screenshot-autosave.bat` → 会弹出一个**黑色小窗口**，**别关它**（关掉监控，截图直读就停了）。
3. （可选）想以后开机自动开启：双击 `install-autostart.bat` 一次即可，之后就不用每次手动开。

**第 2 步：截图并提问**

1. 按 `Win+Shift+S`，用鼠标框选要截图的区域。
2. 回到 DeepSeek 聊天框，按 `Ctrl+V` 粘贴 —— 这时粘出来的是一个 `.png` 路径（不是图片本身，这是正常的）。
3. 直接说「读一下这张图 / 把里面文字提取出来」即可。

> **什么时候会生效？** 只有当 DeepSeek（`127.0.0.1:3080`）开着时，截图才会被自动接管；DeepSeek 关掉后，截图恢复正常（剪贴板里是图片，可正常贴到微信、Word 等）。

**截图存到哪了？** 双击同目录下的 `open-save-folder.bat` 一键打开保存目录。默认保存在 `C:\Users\你的用户名\Pictures\DeepSeek-Shots`；想换位置，设置环境变量 `DS_SHOT_DIR` 即可（见 `tools/screenshot-tool/README-使用说明.md`）。

### 换别的模型（可选，方式 B）

**先说结论：绝大多数人用不着这一节。** 插件默认走「方式 A」——直接调用**通义千问（Qwen）**的视觉模型，你只要在「安装」第 3 步配好 `DASHSCOPE_API_KEY` 就能看图/听声了，下面这段可以直接跳过。

只有这两种情况才需要往下看：

- 你想换**别的厂商模型**（OpenAI / 智谱 GLM / Kimi / 硅基流动 / 本地 Ollama）；
- 你的环境里**没有 MCP 工具**（即「方式 A」不可用）。

这时用「方式 B」——命令行调用 `vision.py`（零第三方依赖，装个 Python 3.7+ 就能跑）。三步：

```bash
# 第 1 步：生成配置文件（只需做一次）
copy config.example.json config.json

# 第 2 步：用记事本打开 config.json，把 "provider" 改成你要的厂商，例如：
#   "provider": "openai"      → 用 OpenAI
#   "provider": "glm"         → 用智谱 GLM
#   "provider": "kimi"        → 用月之暗面 Kimi
#   "provider": "qwen"        → 用通义千问
#   "provider": "ollama"      → 用本地 Ollama（无需 key）

# 第 3 步：设置对应厂商的 API Key，然后运行（以 OpenAI 为例）：
setx OPENAI_API_KEY "sk-你的key"
python vision.py chat --image 图.png --prompt "描述这张图"
```

每个厂商对应的 **Key 环境变量名**、**接口地址**、**注册/拿 Key 的网址**，都列在 `skills/vision-multimodal/references/providers.md`，照着填就行。

## 三、能力清单

### 能力 · 说明
- **能力**: 🖼 图片理解 / 问答 · **说明**: 描述、问答、看图说话
- **能力**: 🔤 OCR 取字 · **说明**: 截图、票据、文档拍照提取文字
- **能力**: 🎯 物体检测定位 · **说明**: 找目标、画框、裁剪
- **能力**: 🎬 视频理解 · **说明**: 画面+声音时间线、找事件、数次数
- **能力**: 🎙 语音转写 · **说明**: 普通转写、带时间戳、多说话人分离
- **能力**: 🎵 音乐分析 · **说明**: 风格、情绪、乐器、调性
- **能力**: 📄 文档可视化 · **说明**: PDF / Office / CSV / 代码 / 3D / notebook
- **能力**: 📷 截图直读 · **说明**: 截图自动存盘并转成路径
- **能力**: ✂️ 图像分割 · **说明**: 把目标从图里抠出来（进阶，需 SAM3）
- **能力**: 🎞 长视频（30 分钟+） · **说明**: 语义记忆与检索

## 四、常见问题

### 现象 · 解决
- **现象**: 报 401 / 没有 API Key / 鉴权失败 · **解决**: 还没配 `DASHSCOPE_API_KEY`，或配了但**没完全退出重开 Harness**（环境变量只在重启后生效）
- **现象**: 模型说「没有注册 `mcp__qwen-mm-plugins-*` 工具」 · **解决**: ① 确认装了 `uv`（install 窗口自检会提示）；② **完全退出并重开 Harness**（MCP 服务器要重启才加载）
- **现象**: 只能用 `vision.py`、没有 MCP 工具 · **解决**: 同上；`vision.py` 也能看图，但同样要先配好 Key
- **现象**: `python vision.py` 报找不到命令 · **解决**: 装 Python 3.7+，勾选「Add to PATH」
- **现象**: `vision.py` 报 SSL / `_ssl` 模块错误 · **解决**: 你的 Python 环境坏了（常见于 Anaconda），换官网安装的 Python 或修复后重试
- **现象**: 视频转写报 ffmpeg 缺失 · **解决**: 安装 ffmpeg 并加入 PATH
- **现象**: 截图粘贴出来还是图片不是路径 · **解决**: 确认截图监控窗口在运行、DeepSeek 端口是 3080（否则设 `DS_PORT`）
- **现象**: 想卸载 · **解决**: 双击 `uninstall.bat`

## 附：打不开 GitHub 怎么办？

GitHub 在国内有时打不开，但本仓库已同步到 **Gitee（码云）**，国内可直接访问：

**① Gitee 下载（国内秒开，推荐）**
- 网页：打开 https://gitee.com/yonnn/dsh-vision-complete → 点「克隆/下载」→ 下载 ZIP；
- 或命令行：`git clone https://gitee.com/yonnn/dsh-vision-complete.git`

**② 让作者直接发你压缩包**
找作者（QQ / 微信 / 网盘 / 群文件）要 `dsh-vision-complete.zip`，解压后双击 `install.bat` 即可。

**③ 镜像加速站（备用）**
把下面地址完整粘到浏览器地址栏，回车会直接下载压缩包：

```
https://ghproxy.com/https://github.com/Yts1919/dsh-vision-complete/archive/refs/heads/main.zip
```

> 若失效，把开头的 `ghproxy.com` 换成 `gh-proxy.com`、`ghfast.top`、`mirror.ghproxy.com` 再试。

## 五、目录结构

```
（仓库根目录 = 你解压/克隆出来的文件夹）
├── install.bat              ★ 双击这个安装
├── install.ps1              安装脚本（install.bat 会自动调用）
├── uninstall.bat            双击卸载
├── uninstall.ps1            卸载脚本
├── README.md                本说明
├── LICENSE                  MIT
├── skills/
│   └── vision-multimodal/
│       ├── SKILL.md         核心 skill 指令
│       ├── vision.py        多供应商视觉客户端（零依赖）
│       ├── config.example.json
│       └── references/
│           ├── api-key-setup.md   配置 DASHSCOPE_API_KEY
│           └── providers.md       多供应商接入
└── tools/
    └── screenshot-tool/     截图自动保存工具
```

## 六、许可证

[MIT](LICENSE)。依赖的 `qwen-mm-plugins` 由 QwenLM 提供，按各自许可证使用。