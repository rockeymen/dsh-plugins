# dsh-path-anonymizer

[English](README.md) | 中文

DeepSeek Harness 插件：在模型请求前检测用户消息中的工作区外文件路径，替换为编号占位符（`[PATH_n]`），并弹窗确认是否将真实路径发送给模型。

## 安装

```bash
dsh plugin --profile web add github:yzhangjy/dsh-path-anonymizer
```

然后重启 web profile。

## 工作原理

1. **检测** — 正则表达式扫描每条用户消息中的文件路径。

2. **匿名化** — 每个检测到的路径替换为编号占位符：
   ```
   /Users/alice/Documents/project/src/main.ts  →  [PATH_1]
   /etc/nginx/nginx.conf                      →  [PATH_2]
   ~/secrets/.env                             →  [PATH_3]
   ```

   **工作区感知** — 落在 agent 工作目录（`cwd`）**之内**的路径不做处理：模型在系统提示词里
   已经能看到 `cwd`，也能自己遍历工作区，匿名化它们只会破坏 coding 而没有隐私收益。只有
   **工作区之外**的路径（`~/...`、`/etc/...`、其他项目目录等）才会被匿名化。设
   `anonymizeWorkspacePaths: true` 可恢复「全部匿名化」的旧行为。

3. **确认** — 模型请求发送前弹出对话框，列出所有检测到的路径及其占位符。用户选择：
   - **发送匿名占位符**（推荐）— 模型看到 `[PATH_n]`
   - **发送真实路径** — 恢复原始路径
   - **取消本次请求** — 拒绝该步骤

4. **会话记忆** — 对话框提供「记住选择」选项，本次会话后续请求自动应用相同选择。

### 对工具调用的影响

匿名化只改写**用户消息文本**。这确实会以某种特定方式影响工具调用：

- 当某个工作区外路径被匿名后，模型只看到 `[PATH_n]` 而非真实路径，所以它
  **无法用 `read` / `edit` / `bash` 去访问该路径**——它并不知道真实路径，通常会反过来
  请你提供真实路径。
- 在对话框里选择**「发送真实路径」**则会把路径原样发送，模型即可正常访问该外部路径。

本插件是**消息脱敏，而非安全沙箱**。它不会过滤模型自己的工具调用、工具参数或工具结果，
也不会限制文件系统访问（那由 DSH 的沙箱单独负责）。模型从工具结果或自行探索中得知的路径
**不会**被匿名化。

工作区路径不受影响，因此在工作区内读写文件一切照常。

## 配置项

### 配置键 · 默认值 · 说明
- **配置键**: `enabled` · **默认值**: `true` · **说明**: 是否启用路径检测与匿名化
- **配置键**: `confirmEveryTime` · **默认值**: `true` · **说明**: 每次都弹窗确认（false 时仅首次弹窗）
- **配置键**: `maxPathsPerPrompt` · **默认值**: `10` · **说明**: 确认对话框中最多显示的路径数
- **配置键**: `autoAnonymize` · **默认值**: `false` · **说明**: 静默替换，不弹窗
- **配置键**: `anonymizeWorkspacePaths` · **默认值**: `false` · **说明**: 是否也匿名化 `cwd` 之内的路径（默认保留以支持 coding）
- **配置键**: `detector.maxPaths` · **默认值**: `50` · **说明**: 单批消息中最多检测的路径数
- **配置键**: `detector.excludePatterns` · **默认值**: `[]` · **说明**: 额外的排除正则
- **配置键**: `detector.includeSystemPaths` · **默认值**: `false` · **说明**: 是否检测系统路径（/usr/lib/、/etc/ 等）
- **配置键**: `anonymizer.placeholderFormat` · **默认值**: `[PATH_{n}]` · **说明**: 占位符格式；`{n}` 为匹配序号

### 示例：自动匿名化模式

```yaml
- id: path-anonymizer
  config:
    enabled: true
    autoAnonymize: true   # 不弹窗，直接匿名化
```

### 示例：排除额外路径

```yaml
- id: path-anonymizer
  config:
    detector:
      excludePatterns:
        - '^/nix/store/'
        - '^/home/ci/'
```

## 路径检测细则

### 匹配的模式

### 模式 · 示例
- **模式**: Unix 绝对路径 · **示例**: `/Users/alice/project/src/index.ts`
- **模式**: Windows 绝对路径 · **示例**: `C:\Users\alice\Documents\file.txt`
- **模式**: Home 目录 · **示例**: `~/.ssh/config`
- **模式**: 相对路径（`./`） · **示例**: `./src/components/App.tsx`
- **模式**: 相对路径（`../`） · **示例**: `../../config/database.yml`
- **模式**: Windows 相对路径 · **示例**: `.\lib\utils.js`
- **模式**: 环境变量 · **示例**: `%APPDATA%\MyApp\settings.json`
- **模式**: WSL · **示例**: `\\wsl$\Ubuntu\home\user\file.txt`

### 默认排除

- URL（`https://`、`ftp://`、`file://`）
- Shell 重定向（`/dev/null`、`/dev/stdout`）
- 系统路径（`/usr/lib/`、`/etc/`、`/proc/`、`/sys/`、`C:\Windows\`），当 `includeSystemPaths` 为 false 时
- 协议相对 URL（`//`）
- 孤立的 `/`

## 已知限制

- **仅正则检测** — 嵌入复杂代码语法的路径可能被遗漏或误匹配。正则模式在自然语言对话消息的召回率和误报率之间做了平衡。
- **无文件系统校验** — 看起来像有效路径的字符串即被视为路径；插件不会检查文件是否真实存在。
- **仅消息内容** — 检测作用于消息内的文本块；非文本内容块（图片、工具调用）不会被扫描。
- **每次请求一个对话框** — 包含多个消息中路径的批次显示一个合并对话框，而非逐个路径确认。