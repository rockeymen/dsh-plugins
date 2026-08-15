![DeepSeek Harness Desktop](deepseek_whale_hermes_rounded.png)

# DeepSeek Harness Desktop

  把 DeepSeek Harness 变成真正适合 Windows 的桌面应用：一键安装、原生通知、顺滑窗口控制与自动更新。

  · [上游来源](#项目来源与分支谱系)
  · [自动更新](#自动更新)
  · [问题反馈](https://github.com/Links2008/DeepSeek-Harness-Desktop/issues)

> [!IMPORTANT]
> 这是由 [Links2008](https://github.com/Links2008) 维护的**非官方 Windows 桌面发行版**。DeepSeek Harness 核心来自 [DeepSeek-AI 官方仓库](https://github.com/deepseek-ai/deepseek-harness)；本仓库不代表 DeepSeek-AI 官方桌面客户端。

## 产品预览

  ![DeepSeek Harness Desktop 主界面](docs/images/desktop-home.png)

  
    ![Agent 预设](docs/images/agent-presets.png)
    ![紧凑侧栏](docs/images/compact-sidebar.png)
  
  
    Agent 预设与模式切换
    紧凑侧栏与沉浸工作区
  

## 核心能力

- Windows 10/11 x64 一键安装，内置独立 Node.js 与 Harness 运行时。
- 红、黄、绿三色窗口控件具备按压与回弹反馈，并使用原生最大化/还原。
- 每次任务真正完成时发送 Windows 系统通知，点击可返回结果。
- 单实例启动、冷启动页、圆角无边框窗口和完整的后端进程清理。
- 保留用户已有的 `~/.dsh` 配置、凭据与会话，不打包任何本机隐私数据。
- 通过 GitHub Releases 自动检查、下载并在退出应用后安装新版本。

## 一分钟开始

1. 前往 [Latest Release](https://github.com/Links2008/DeepSeek-Harness-Desktop/releases/latest)。
2. 下载 `DeepSeekHarness-Setup-<版本>.exe`。
3. 运行安装向导并选择安装目录。
4. 从桌面快捷方式或开始菜单启动 **DeepSeek Harness**。

> [!NOTE]
> 安装包暂未使用商业代码签名证书，Windows SmartScreen 可能显示“未知发布者”。可在 Release 说明中核对 SHA-256，并审计本仓库的构建工作流。

## 项目来源与分支谱系

本仓库在 GitHub 元数据中是独立仓库，不伪装成官方 Fork；代码来源与构建谱系公开记录如下：

```text
deepseek-ai/deepseek-harness
└─ 官方分支：master
   └─ 当前锁定：47f943859bef60e4160492346772ded9b24f765a
      └─ Harness：0.1.0-rc.5
         └─ Windows 桌面发行：Links2008/DeepSeek-Harness-Desktop（main）
```

### 项目 · 当前值
- **项目**: 官方上游 · **当前值**: [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- **项目**: 跟随分支 · **当前值**: `master`
- **项目**: 锁定提交 · **当前值**: [`47f9438`](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a)
- **项目**: 上游版本 · **当前值**: `0.1.0-rc.5`
- **项目**: 桌面仓库分支 · **当前值**: `main`
- **项目**: 状态文件 · **当前值**: [`upstream-lock.json`](upstream-lock.json)

GitHub Actions 每天检查官方 `master`。只有上游变化、桌面壳变化、人工强制构建或失败发布修复时才打包；未变化时直接停止。

## 自动更新

桌面端启动 30 秒后检查 GitHub Releases，之后每 6 小时重试。下载完成后不会强行中断工作，而是在用户正常退出应用时安装。

发布链路依次验证测试、安装包完整性、`latest.yml` SHA-512、`app-update.yml` 更新源、隔离安装、AppID、HTTP 200、运行时版本、端口清理与卸载。任何关键步骤失败都会停止发布。

自动检查、构建和发布仅使用 GitHub Actions、Node.js、electron-builder、7-Zip、NSIS 与 GitHub CLI，**不会调用 GPT、Codex 或 OpenAI API，也不会消耗 GPT/Codex 额度**。

## 从源码构建

```powershell
npm ci
npm test
npm run build:installer
```

构建完整安装器还需要 `bundle/node/node.exe` 与由官方 Harness release families 生成的 `bundle/dsh-runtime`。详细过程可直接查看 [自动构建工作流](.github/workflows/upstream-sync.yml)。

## 贡献者与致谢

### 贡献者 · 主要贡献
- **贡献者**: [Links2008](https://github.com/Links2008) · **主要贡献**: Windows 桌面壳、安装器、通知、窗口交互、自动更新、发布链路与 Windows 实机验收
- **贡献者**: [DeepSeek-AI Team](https://github.com/deepseek-ai) · **主要贡献**: DeepSeek Harness 核心、Agent 能力、插件架构与 Web 运行时
- **贡献者**: [官方上游贡献者](https://github.com/deepseek-ai/deepseek-harness/graphs/contributors) · **主要贡献**: Harness 的持续开发、评审、修复与生态建设

根据 GitHub Contributors 当前统计（2026-08-15），主要上游贡献者包括 [tianyicui](https://github.com/tianyicui)、[LegGasai](https://github.com/LegGasai)、[imccyu](https://github.com/imccyu)、[Chinesezjc](https://github.com/Chinesezjc)、[turtle1999](https://github.com/turtle1999)、[hypatiamay](https://github.com/hypatiamay)、[CreatixChu](https://github.com/CreatixChu)、[kermanx](https://github.com/kermanx)、[ZiyaZhang](https://github.com/ZiyaZhang) 与 [Kingwl](https://github.com/Kingwl)。完整且持续更新的名单以官方 Contributors 页面为准。

感谢 Electron、Node.js、NSIS 及 DeepSeek Harness 依赖生态中的所有开源贡献者。

## 安全与隐私

仓库与安装包不会包含 API Key、Token、Cookie、`.credentials.yaml`、`~/.dsh`、用户会话或本机日志。请不要在 Issue 中粘贴任何凭据。

## 参与贡献

欢迎通过 [Issues](https://github.com/Links2008/DeepSeek-Harness-Desktop/issues) 反馈 Windows 安装、通知、窗口控制、更新或打包问题。提交代码前请先运行 `npm test`。

## 许可证

本仓库的桌面壳、构建脚本和配置遵循 [MIT License](LICENSE)。打包使用的 DeepSeek Harness 及其他第三方依赖继续遵循各自许可证。