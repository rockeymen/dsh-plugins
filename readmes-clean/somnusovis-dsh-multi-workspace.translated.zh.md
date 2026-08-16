#dsh-multi-workspace

DeepSeek Harness (DSH) 的多工作空间沙箱。

自动授予对所有已注册工作区的文件写入访问权限 - 在 UI 中添加工作区，立即写入，无需配置。

## 问题

默认情况下，DSH 文件沙箱仅允许写入一个工作区目录（会话 cwd）。写入其他目录需要沙箱升级。

## 解决方案

该插件在每次沙箱策略检查时读取实时工作区注册表，并将每个注册的工作区路径作为附加的可写根注入。

## 它是如何工作的

两层：
1. 包装 sandboxPolicy.resolve() 以附加工作空间路径
2. 在每个工作区根目录上使用重试回退来包装 fs.writeText/editText

## 安装

```
dsh plugin --profile web add github:somnusovis/dsh-multi-workspace

# Or from npm (once published)
dsh plugin --profile web add dsh-multi-workspace
```

重新启动 DSH Web 服务并刷新浏览器。