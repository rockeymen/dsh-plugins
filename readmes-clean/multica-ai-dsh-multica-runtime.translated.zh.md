# Multica DSH 运行时

Multica 与公众之间的私有树外运行时桥梁
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)。它暴露了
基于 stdio 的版本化 JSONL 协议并通过
`@deepseek-ai/dsh-base`。不需要对 DeepSeek Harness 进行更改。

![DeepSeek Harness 在 Multica](docs/images/multica-dsh-runtime.png) 中在线运行

## 隐私

- 该存储库仅包含 Multica 集成层。它不
  供应商或重新分发 DeepSeek Harness 源代码。
- 切勿提交 API 密钥、MCP 机密、会话日志或生成的配置文件。
- DSH 遥测被捆绑补丁禁用。
- 标准输出仅适用于协议；诊断转到 stderr。

## 本地开发

该插件使用的 DSH 包是公共 npm 包。这次结账是
目前针对 `@deepseek-ai/dsh@0.1.0-rc.6` 及其匹配进行了验证
`@deepseek-ai/dsh-*` 封装系列。

```bash
pnpm install
pnpm check
pnpm build
```

构建后将本地包安装到 DSH 配置文件中：

```bash
dsh plugin --profile multica add /absolute/path/to/multica-dsh-runtime
```

该插件支持：

```bash
dsh --profile multica --probe
dsh --profile multica --list-models
dsh --profile multica --stdio
```

Multica 仅在 `--probe` 返回协议版本 1 后才发现配置文件。
对于非标准 DSH 安装，请将守护进程指向其启动器：

```bash
export MULTICA_DSH_PATH=/absolute/path/to/dsh
```

运行时合约包括：

- 来自DSH本身的模型和思维层面的发现；
- 提交的文本、推理、工具、结果和代币使用事件；
- 合作取消和持久会话恢复；
- 规范的 Multica MCP 配置转换为 DSH stdio 或
  可流式传输的 HTTP 客户端；
- Multica 守护进程提供的每个运行时/代理会话根；
- 无头一次性批准，没有交互式问题界面。
- 仅将 Multica 的服务器铸造的 `mat_` 任务令牌狭窄地转发到 DSH 的任务令牌中
  否则，凭据会被擦除 shell，因此任务中的 `multica` 命令会保留
  在不暴露模型提供者凭据的情况下进行任务归因。

本地 `.local/` 树被忽略。它可以容纳一个隔离的 DSH 家庭和一个
开发启动器，但都不属于源代码控制。

`DEEPSEEK_API_KEY` 由 DSH 的凭证提供程序在进程运行时读取。它
不得存储在此存储库中。