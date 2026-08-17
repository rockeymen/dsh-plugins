# DSH 锻造

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件的静态兼容性和权限验证。

> DSH Forge 是社区开发者工具，不是 DeepSeek 官方产品。通过收据不是安全审核。

## 它的作用

DSH Forge 在将插件安装到真实配置文件之前检查插件：

- 验证`dsh.bundle`安装合同；
- 根据选定的 DSH 基线检查官方 DSH 对等范围；
- 应用DSH `rc`版本所需的预发布规则；
- 读取声明的和高信号推断的权限；
- 记录源出处和平台兼容性；
- 可选择为本地包运行 `npm pack --dry-run --ignore-scripts`；
- 发出没有绝对机器路径或用户数据的标准化 JSON 收据。

alpha 从不执行插件生命周期脚本，也不会改变 `~/.dsh`。

## 快速开始

```sh
npm install
npm run build
node dist/cli/main.js verify fixtures/public/healthy-plugin --smoke
node dist/cli/main.js verify https://github.com/owner/plugin --dsh-version 0.1.0-rc.7 --json receipt.json
```

默认基线是 `0.1.0-rc.7`，固定到公共 DSH 标签 `dsh-v0.1.0-rc.7`。

对于 GitHub API 速率限制，请在环境中设置只读 `GITHUB_TOKEN`。该令牌仅用于获取公共 `package.json` 内容，并且永远不会写入收据：

```sh
GITHUB_TOKEN=... node dist/cli/main.js verify https://github.com/owner/plugin
```

## 存储库边界

这个公共存储库包含源代码、模式、测试、清理的固定装置、CI 规则和公共发布收据。它不得包含 API 密钥、签名证书、`.env` 文件、真实的 `~/.dsh` 配置文件、用户记录、私有插件源或包含机器路径的原始日志。

请参阅[SECURITY.md](SECURITY.md)、[CONTRIBUTING.md](CONTRIBUTING.md)]和[docs/release-policy.md](docs/release-policy.md)。

## 状态

`v0.1.0-alpha.1` 是一个有意缩小的垂直切片：静态验证加上安全封装试运行。事务配置文件安装、回滚和桌面操作员将在以后的版本中建立在此收据合同的基础上。