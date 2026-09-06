# DeepSeek Harness Docker 服务

适用于 DeepSeek Harness (DSH) 的开源就绪受保护 Docker 操作。的
存储库将 DSH 客户端插件与特权控制器分开。它是
对于需要有用的库存、运行状况、资源、日志、生命周期的团队，
参数、秘密和部署控制，无需暴露原始 Docker、shell 或
远程主机访问 UI 或模型。

## 它提供什么

- 库存显示受控和非受控容器、状态/运行状况、
  资源字段，图像/摘要，部署存储库/分支/SHA/时间/测试状态，
  以及可选的内部或 Tailscale URL。
- 每个服务操作白名单涵盖日志、启动/停止/重新启动、模式驱动
  非秘密参数，以及只写秘密状态/设置/旋转/测试。
- 部署调用受到精确修订保护（存储库、分支、完整 SHA）、租赁和
  幂等的。只有权威的钩子输出才能提供图像摘要，经过验证
  可达性/分支绑定、部署时间和通过测试状态。
- 本地 Docker、受限 SSH 帮助程序和 mTLS JSON 适配器参考
  实施；全部仅使用类型化操作。
- 签名的可信代理身份/RBAC、有限的不透明错误、受保护的编辑
  日志、带有键控检查点的 fsynced 哈希链审计、原子 no-follow
  写入、包/消费者/容器检查和 CI。

## 快速开始

```sh
npm ci --ignore-scripts
npm run ci
cp examples/controller.json /etc/dsh-docker-services/controller.json
```

然后替换示例值，创建专用控制器帐户并
挂钩，并按照[部署说明](docs/DEPLOYMENT.md)。阅读
[授予 Docker/socket 访问权限之前的威胁模型](docs/THREAT-MODEL.md)。

## 项目布局

- `packages/plugin`：DSH插件；没有 Docker 或秘密文件系统访问权限。
- `packages/controller`：特权白名单实施和适配器。
- `packages/shared`：版本化协议和配置验证。
- `examples`：主机单元、容器部署和通用配置。

该项目故意不提供通用部署脚本：deployment
语义是特定于工作负载的，必须由管理员拥有进行审查，
固定挂钩。请参阅 [release](docs/RELEASING.md) 以进行工件分离。