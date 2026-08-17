#dsh-plugin-chatcut

**使用 AI 编辑视频，就在 DeepSeek Harness 中。**

将 [ChatCut](https://chatcut.io) - 代理原生视频编辑器 - 作为一流的 MCP 插件引入 [DSH (DeepSeek Harness)](https://github.com/deepseek-ai)：50 个编辑工具 + 15 个工艺技能，具有一次性 OAuth 设置和全自动令牌刷新。

`#dsh-plugin` `#mcp` `#video-editing` `#chatcut`

![演示：特工删除填充词，时间线涟漪关闭](assets/demo.gif)

## 你得到什么

用通俗易懂的语言询问您的 DSH 代理商：

- 🎙️ **说话头清理** —“删除所有填充词和尴尬的停顿”（基于脚本的编辑：代理编辑*文本*，时间线如下）
- ✂️ **亮点剪辑** — “制作一个关于定价的 30 年代版本”，“保留最好的镜头”
- 💬 **字幕** — 风格化、双语、单词级卡拉 OK 亮点
- 🎨 **动态图形** — 从 JSX 代码或 ChatCut 的模板库生成
- 🔍 **缩放、过渡、LUT、声音效果** — 来自内置库
- 🖼️ **AI 生成** — 图像 (GPT Image)、视频 (Seedance)、音乐、TTS、语音克隆
- 📤 **导出** — mp4 / 音频 / SRT / **NLE XML** (Premiere · DaVinci · FCP) / 透明背景 MG ProRes

一切都落在真正的多轨非编时间轴上，您也可以在 [chatcut.io](https://chatcut.io)] 上手动编辑 - 代理和您实时共享同一个项目。

## 为什么要使用这个插件

ChatCut 官方仅提供 **Claude Code** 和 **Codex** 的插件。本项目对DSH进行了适配：

### 官方插件·此适配器
- **官方插件**：MCP 服务器（streamable-http + OAuth） · **此适配器**：通过 `@deepseek-ai/dsh-mcp-client`（stdio 桥）桥接
- **官方插件**：`claude mcp login` 处理 OAuth · **此适配器**：`chatcut-login.mjs` — 标准 PKCE + 动态注册
- **官方插件**：主机保持令牌新鲜· **此适配器**：`chatcut-bridge.mjs` 在 401 上自动刷新并保留令牌
- **官方插件**：15个工艺技能（SKILL.md）· **此适配器**：安装到`$DSH_HOME/skills/`不变，加上DSH主机适配器技能

**配置一次令牌。再也不用考虑它了。** 桥接器使用旋转刷新令牌刷新访问令牌并将其存储在本地（`0600`）。

## 快速开始

先决条件：一个[ChatCut 帐户](https://chatcut.io)（免费层作品）、DSH 桌面、`api.chatcut.io` 的网络访问权限。

```sh
git clone https://github.com/nigedazhima/dsh-plugin-chatcut.git
cd dsh-plugin-chatcut
```

**1.登录（一次）** — 打开浏览器以进行 ChatCut OAuth：

```sh
# macOS with DSH Desktop (no separate Node needed):
ELECTRON_RUN_AS_NODE=1 "/Applications/DSH Desktop.app/Contents/MacOS/DSH Desktop" scripts/chatcut-login.mjs
# or, with Node >= 18:
node scripts/chatcut-login.mjs
```

令牌写入 `scripts/.tokens.json`（git 忽略，模式 0600）。

**2.安装技能：**

```sh
cp -R skills/chatcut "$HOME/Library/Application Support/dsh-desktop/harness/skills/"
```

**3.安装 MCP 服务器** — 将 `cordis-patch-example.yml` 复制到 `$DSH_HOME/cordis.patch.yml` 中，用此存储库的绝对路径替换 `<REPO>`。

**4.重新启动 DSH 桌面。** 在新会话中，询问：*“列出您的 mcp__chatcut__ 工具”* — 您应该会看到约 50 个工具。

## 它是如何工作的

```
DSH agent ──(stdio MCP)── chatcut-bridge.mjs ──(streamable-http + Bearer)── api.chatcut.io
                              │
                              ├─ 401? → refresh_token → new access_token → persist
                              └─ .tokens.json (0600, git-ignored)
```

- 该桥重用了已与 DSH 捆绑在一起的官方 `@modelcontextprotocol/sdk` — macOS 上的 npm 安装为零。
- 技能是官方 ChatCut 工艺技能（头部说话指南、动态图形、字幕、导出等）加上一个薄型 DSH 主机适配器，可将 Claude-Code-isms（工具前缀、登录命令、浏览器窗格）映射到 DSH 等效项。
- 转录优先编辑：杀手级工作流程是 `read_script` → 使用 ~~删除线~~ 编辑 Markdown 文件 → `apply_script`。删除文本中的句子会在时间轴上删除它。

## 故障排除

### 症状 · 原因/修复
- **症状**：会话中没有 `mcp__chatcut__*` 工具 · **原因/修复**：桥无法启动 - 检查 `$DSH_HOME` 线束日志；通常缺少`.tokens.json`（运行登录）
- **症状**：桥说refresh_token无效·**原因/修复**：重新运行`chatcut-login.mjs`（一轮浏览器）
- **症状**：`api.chatcut.io` 超时 · **原因/修复**：区域相关；设置登录脚本为`HTTPS_PROXY`，并将其添加到cordis补丁中的桥`env`中
- **症状**：列出了工具，但调用失败 · **原因/修复**：检查您是否在浏览器编辑器中登录了同一个 ChatCut 帐户

## 安全说明

- 此存储库不附带任何凭据。 `.tokens.json` 是由您在本地创建的，并且 git 忽略。
- OAuth客户端动态注册（RFC 7591）；没有共享的客户端秘密。
- 令牌文件是 chmod 0600；刷新令牌在每次刷新时轮换。

## 学分

- [ChatCut](https://chatcut.io) 编辑器和官方代理插件
- [DeepSeek Harness](https://github.com/deepseek-ai) 用于可插入代理运行时

*如果这为您节省了一个下午的编辑时间，⭐ 可以帮助其他人找到它。*