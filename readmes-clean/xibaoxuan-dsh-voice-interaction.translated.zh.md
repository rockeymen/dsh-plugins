# DSH Voice Interaction

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) Web 界面提供语音输入：点击输入框的麦克风按钮，或按住**左 Ctrl**，通过浏览器 Web Speech API 实时把语音转写为中文，并**追加**到输入框草稿（不会自动发送）。

## 功能

- 麦克风按钮 + 按住左 Ctrl 两种触发方式
- 浏览器内置语音识别（`SpeechRecognition`，`zh-CN`），中间结果实时上屏
- 转写结果追加到已有草稿，不覆盖、不自动发送
- 可作为 DSH 客户端插件安装 / 卸载

## 安装 / 卸载

### 方式一：让 DSH 智能体自动安装（推荐）

直接把下面这句话发给你的 DSH 智能体，它就会访问 GitHub、自动拉取并安装：

> 帮我安装 GitHub 上的 DSH 插件 `xibaoxuan/dsh-voice-interaction`

智能体实际执行的是：

```sh
dsh plugin --profile web add github:xibaoxuan/dsh-voice-interaction
```

### 方式二：本地目录安装

```sh
# 在本仓库根目录执行
dsh plugin --profile web add ./dsh-voice-interaction
```

### 卸载

```sh
dsh plugin --profile web remove dsh-voice-interaction
```

安装后重启 `dsh web`，刷新浏览器页面（需 Chrome / Edge）即可在输入框看到麦克风按钮。

### 路径 · 说明
- **路径**: `package.json` · **说明**: 包清单：`dsh.bundle.patch` + `dsh.client`（浏览器半）
- **路径**: `cordis.patch.yml` · **说明**: 宿主 patch 层
- **路径**: `lib/index.js` · **说明**: 宿主半（no-op Cordis 插件）
- **路径**: `lib/core.js` · **说明**: 纯逻辑单一真源（状态机、左 Ctrl 判定、结果拼接）
- **路径**: `lib/client.template.js` · **说明**: 浏览器 bundle 模板（含 `// __VOICE_CORE__` 标记）
- **路径**: `scripts/build.mjs` · **说明**: 构建脚本：把 `lib/core.js` 内联进模板生成 `lib/client.js`
- **路径**: `lib/client.js` · **说明**: 生成产物（勿手改）
- **路径**: `test/core.test.js` · **说明**: 核心逻辑单测

## 开发

```sh
node scripts/build.mjs                              # 重新生成 lib/client.js
node --test --test-isolation=none "test/*.test.js"  # 运行单测
```

修改 `lib/core.js` 或 `lib/client.template.js` 后，运行构建脚本并重启 `dsh web` 生效。

## 许可证

MIT