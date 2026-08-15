![一位数学家在黑板上工作的档案式黑白照片，具有恒定的 Jacobian 行列式和映射到一个输出的三个不同输入。](docs/assets/jacobian-hero.jpg)

#Jacobian

  代理的原子数学：发现一种类型化操作，运行它，并组合它的有界结果。

Jacobian 是一款 MCP 服务器，为 AI 代理提供了两种高级工具
数学。 `math.find` 发现类型化数学运算并
`math.run` 执行一项选定的操作。同一个数学库是
也可通过 CLI 和本机 Python API 获取。

## 快速入门

运行规范的 Python MCP 命令，无需全局安装 Jacobian：

```sh
uvx --from jacobian jacobian-mcp
```

当 MCP 主机需要 npm 命令时，npm 包是确定性的
同一命令的载体：

```sh
npx jacobian mcp
```

对于持久安装：

```sh
python -m pip install jacobian
jacobian-mcp
```

该软件包包括 Jacobian 精确维护的 Python 后端堆栈：SymPy、
NetworkX、Z3 和 Python-FLINT。正常的 Python 或 npm 安装
因此公开了相同的内置 Python 支持的操作组合。的
测试的二进制安装合约是 glibc Linux x86-64 上的 CPython 3.12 或 3.13；
发布门安装内置轮子并在Python上启动Jacobian
版本。其他系统可能具有兼容的上游轮，但不是一部分
尚未测试过的发布合约。特别是Alpine/musl无法安装
来自 PyPI 的完整强制堆栈。

Python 发行版包含数学内核、CLI 和 MCP 服务器。
npm 包不包含生命周期管理器或 JavaScript API；它仅映射
其确切的包版本对应的 `uvx` 调用。

## 计算一个有界结果

普通操作首先返回数学。例如，
`matrix.determinant.compute` 接受一个精确有理矩阵并返回其
直接决定因素。调用者通过将键入的值传递给
后续操作； Jacobian 不保留项目状态或工件存储。

## 可用数学

内置的投资组合涵盖以下领域的工作：

- 多项式映射和多项式代数；
- 精确的线性代数；
- 图形、路径、着色和同构；
- 有界 SAT 和 SMT 求解；
- 有限代数、概率、几何和拓扑；和
- 精益来源阐述。

SAT 和 SMT 操作直接使用维护的 Z3 Python 绑定。的
可选的 `lean.check` 操作在固定的区域中运行一个有界源代码片段
精益的服务环境。它仅创建一个请求范围的临时目录
并返回类型诊断；它不会公开证明状态会话或
保留源码。使用`math.find`搜索操作，浏览不熟悉的
域，并在调用 `math.run` 一次之前检查一项操作。

参见【域操作库](docs/reference/domain-operation-library.md)
对于维持的运营组合和
[后端要求](docs/how-to/install-native-and-formal-providers.md)。

## 状态

Jacobian 0.11.0 已预稳定。其公布的套餐及运营合同
描述支撑表面；实验运营合同可能会发生变化
版本之间。

## 文档

- [文档主页](docs/index.md) — 教程、操作指南、参考、
  和解释
- [Architecture](docs/explanation/architecture.md) — 运行时结构和
  信任边界
- [产品型号](docs/explanation/product-blueprint.md)——运营合同，
  所有权和项目边界
- 【工具参考](docs/reference/tools.md) — MCP资源及调用
  合同
- [后端要求](docs/how-to/install-native-and-formal-providers.md)
  — 维护 Python 后端和可选的 Lean
- [远程部署](docs/how-to/deploy-remote-mcp.md) — HTTP部署和
  认证