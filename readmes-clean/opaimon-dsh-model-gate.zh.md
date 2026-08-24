# dsh-model-gate

[English](README.md) | 中文

面向 DSH 的单模型禁用门禁。按整条 provider 路由或精确的 `provider/model`
对配置拒绝名单 —— 被禁模型从一切发现路径消失，仍到达它们的任何调用都会以
协议内 `MODEL_DISABLED` 错误 chunk 终止。

设计上非破坏：不触碰 provider 配置与凭据。名单是独立覆盖层；删除条目（或
卸载插件）后一切原样恢复。

## 截图

**设置界面** —— 「模型门禁」分区经插件自有的 typert service 读取未过滤目录：
每个 provider 一个折叠组、每行一个开关、组头带启用数徽标。

![模型门禁设置面板](assets/settings-panel.png)

**发现隐藏** —— 禁用一个模型后，它从 Web 选择器与一切发现路径消失，当前选中
状态一并清空。

### 启用 · 禁用
- **启用**: ![模型启用时的选择器](assets/picker-model-enabled.png) · **禁用**: ![模型被禁后的选择器](assets/picker-model-denied.png)

**分发兜底** —— 仍到达被禁模型的回合（subagent、会话标题、残留引用）以协议内
`MODEL_DISABLED` 错误 chunk 收尾；不会发出任何网络请求。

![分发被 MODEL_DISABLED 拦截](assets/dispatch-blocked.png)

## 安装

从 npm 一条命令：

```sh
dsh plugin --profile web add dsh-model-gate
```

或从 [Releases](https://github.com/OPaimon/dsh-model-gate/releases) 下载
`dsh-model-gate-<version>.tgz`，解压后把官方安装器指向解压目录（tgz 内是预
构建的 lib/，无需构建，也不会触发 pnpm 的 `allowBuilds` 提示）：

```sh
tar -xzf dsh-model-gate-0.1.2.tgz    # -> ./package/
dsh plugin --profile web add ./package
```

然后重启一次 DSH，让 bundle 层装载新条目。此后的名单编辑全部经 settings 热
生效，无需再重启。已在 DSH 0.1.x-rc 上验证。

## 用法

编辑 `~/.dsh/settings.yaml` 中的名单段 —— 改动热应用，无需重启：

```yaml
llm-model-gate:
  disabledProviders:
    - openrouter
  disabledModels:
    - "*/kimi-k2.7-code"        # 在所有 provider 上禁用该模型 id
    - "token-rhythm/glm-5"      # 只禁这一对 provider/model
```

匹配精确且区分大小写。禁用某条 provider 路由会隐藏其下所有模型。带 `*`
加斜杠前缀的模型 id 在所有 provider 上生效，包括接受显式 directory 外 id 的
专用路由（如 DeepSeek 直连）。

## 设置界面

Web 设置页有独立的「模型门禁」分区（每个 provider 一个折叠组，每行一个开
关）。面板经插件自有的 typert service 读取未过滤目录，因此已被禁用的模型会
显示为关、可以重新打开；开关写入走与手工编辑 YAML 相同的热应用链路。

行状态说明：

- 精确对、`*/model` 星号规则、或整条 provider 路由任一命中时行为关，行上标
  注原因。
- 把被星号规则禁用的行重新打开，会移除覆盖所有 provider 的那条星号规则（名
  单没有按 provider 的例外）；面板以返回状态重渲染，受影响的行一起翻转。
- provider 标题栏显示启用数徽标；行开关为准。

## 语义

- **发现面（主闸）**：Web 选择器、`session.models` /`llm.models` 目录、
  `task_models` 与 API 请求校验读到的都是过滤视图 —— 被禁模型表现得像从未配
  置过。重新启用后下次刷新即恢复。
- **分发面（兜底）**：仍把请求派发给被禁模型的路径 —— subagent、会话标题、
  自定义路由、显式 id —— 都在公开的 `llm/stream` waterfall 处被拦截，以单个终
  止 chunk `finish{kind:"error", code:"MODEL_DISABLED"}` 结束回合。回合以正常模
  型错误收场；不会发出任何网络请求。
- 若被禁的是当前会话或默认模型，其下一次请求失败；不做自动切换。监听
  `agent/request-error` 的故障转移类插件可自然组合。

## 边界

- Vision-router 克隆是独立路由键：禁用 `openrouter` 不会连带 `openrouter-vision`
  —— 想都禁就都列上。
- Provider 保持安装状态，只有公开列表被过滤；provider 的配置入口（增删改）
  不受影响。
- 完全绕开 DSH LLM 服务直连 HTTP 不属于 DSH 管辖。
- 卸载即移除 bundle 条目；插件卸载时原样恢复原生
  `listProviders`/`listModels` 方法，零残留。`settings.yaml` 里遗留的名单段无
  害。

## 开发

```sh
bash scripts/build.sh     # 需要 DSH_CHECKOUT 或 ~/dsh-harness；同时 shim node_modules/.bin/tsdown
npm run build:client      # 打包 src/client/main.tsx -> lib/client.js（ModuleLoader wrapper）
npm test                  # 单测（node:test）跑在 lib/ 上 - 全新 clone 先执行一次 build
```

测试直接 import 编译产物 `lib/`（源码内的相对 ESM 引用需要 tsc 的 `.js` 重写，
node 的类型剥除不做这件事），并经由 `scripts/build.sh` 建立的符号链接解析宿主
包 —— 全新 clone 先跑一次 build。

在 super-injector 环境里：`dev_inject_plugin <本目录>` 后配合
`dev_reload_package` 免重启迭代。

## 许可证

[MIT](LICENSE)。独立分发的插件：DSH 本体不受影响，保留其自身许可证。