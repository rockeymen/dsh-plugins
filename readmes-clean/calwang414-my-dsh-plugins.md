# my-dsh-plugins

DeepSeek Harness 个人插件集(插件目录独立仓库)。

## 插件

### 插件 · 说明
- **插件**: [dsh-voice-pet](dsh-voice-pet/) · **说明**: 本地语音 + VRM 桌宠:sherpa-onnx 唤醒词/ASR/TTS 全离线,VRM 虚拟形象随语音说话,支持页面浮层与桌面独立窗口两种形态
- **插件**: [dsh-cdp-browser](dsh-cdp-browser/) · **说明**: 基于 Chrome DevTools Protocol 的浏览器控制插件
- **插件**: [dsh-testhub](dsh-testhub/) · **说明**: 桌面本地测试平台:API 测试(OpenAPI 导入/diff 变更清单)/场景用例(接口融入)/UI 自动化/数据工厂/测试计划(全量+增量回归)/执行报告与失败归因,AI 一键生成 mock、用例、计划与标签
- **插件**: [dsh-ui-design](dsh-ui-design/) · **说明**: 可视化设计工作室:参照 deepseek-idesign@0.2.0(MIT) 实现,对话中生成/精调网站、App 原型、海报等设计

## 安装

**方式 A(推荐):预编译安装包(GitHub Releases,免构建)**

```sh
dsh plugin --profile web add https://github.com/calwang414/my-dsh-plugins/releases/download/v0.1.2/dsh-voice-pet-0.1.2.tgz
dsh plugin --profile web add https://github.com/calwang414/my-dsh-plugins/releases/download/v0.1.3/dsh-cdp-browser-0.1.3.tgz
dsh plugin --profile web add https://github.com/calwang414/my-dsh-plugins/releases/download/dsh-testhub-v0.1.0/dsh-testhub-0.1.0.tgz
dsh plugin --profile web add https://github.com/calwang414/my-dsh-plugins/releases/download/dsh-ui-design-v0.1.4/dsh-ui-design-0.1.4.tgz
# 重启 dsh
```

- voice-pet 首次启动会自动安装引擎依赖(原生 sherpa 库,按平台自动选择)与语音模型(~320MB,hf-mirror);
- cdp-browser 需 Google Chrome(macOS/Windows/Linux 均支持,非默认安装位置可设 DSH_CDP_CHROME);
- ui-design 安装后,会话模式选择器会出现「设计模式」,对话视图新增 Design / PPT 两个标签。
- testhub:对话视图新增「基础配置 / 数据工厂 / API 测试 / UI 自动化 / 用例 / 计划 / 报告」7 个标签;版本迭代后重导 OpenAPI 自动 diff 出变更清单,一键增量回归。

**方式 B:从源码安装**

```sh
git clone https://github.com/calwang414/my-dsh-plugins.git
cd my-dsh-plugins
cd dsh-voice-pet && npm install && (cd engine && npm install) && \
  npx vite build && cp dist/client.js lib/client.js && \
  npx vite build --config vite.standalone.config.js && cd ..
dsh plugin --profile web add ./dsh-voice-pet
dsh plugin --profile web add ./dsh-cdp-browser
# 重启 dsh
```

各插件目录内均有独立 README 与构建说明。