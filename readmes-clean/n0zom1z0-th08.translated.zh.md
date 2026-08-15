#东方永夜抄～不朽之夜

  <图片
    src="资源/title-screen.png"
    宽度=“640”
    alt="原版日文TH08 1.00d标题画面">

  ![TH08确切源码重构进度](resources/progress.svg)

本项目旨在重构日文原版源代码
`東方永夜抄 ～ Imperishable Night` 1.00d 版可执行文件，可重现
二元比较作为接受标准。

该存储库继续进行以下工作
[幻想乡俱乐部/th08](https://github.com/GensokyoClub/th08)。其完整的 Git
历史是进口的而不是压制的，保留了作者身份
原始项目的贡献记录。新基建和
重建工作建立在这一基线之上。

该项目仍在积极进行逆向工程工作。现有来源、符号
映射或生成的进度图不得被解释为新的精确的
没有针对目标二进制文件的可重现报告的匹配百分比。
当前源存在库存生成于
[docs/PROGRESS.md](docs/PROGRESS.md) 并故意单独标记
来自严格的精确匹配覆盖。

## 目标可执行文件

提供您自己的原始可执行文件作为 `resources/th08.exe`：

### 属性·所需值
- **属性**：版本·**所需值**：日文原版 1.00d
- **属性**：大小· **所需值**：`840,704` 字节
- **属性**：SHA-256 · **所需值**：`330fbdbf58a710829d65277b4f312cfbb38d5448b3df523e79350b879213d924`
- **属性**：PE镜像库 · **所需值**：`0x00400000`
- **属性**：入口点 · **所需值**：`0x004A619E`

本地化或修补的可执行文件是不同的二进制文件，并且是故意的
超出范围。可执行文件和游戏数据是受版权保护的资产，不属于
包括在内。

```bash
python3 scripts/verify-target.py
```

## 构建

初始化第三方子模块，然后创建上游Visual Studio
.NET 2002/DirectX 8 环境。在 Linux 或 macOS 上：

```bash
git submodule update --init --recursive
./scripts/create_th08_prefix
python3 ./scripts/build.py
```

前缀助手默认使用 Wine；在调用它之前设置 `WINE`
需要不同的兼容运行器。在 Windows 上，使用上游设置
直接编写脚本：

```text
python scripts/create_devenv.py scripts/dls scripts/prefix
python scripts/build.py
```

请参阅[构建和精确匹配](docs/BUILD_MATCHING.md) 的依赖关系，
构建模式、reccmp 和 objdiff 详细信息。

## 分析状态

当前可用的 IDA MCP 会话附加到 TH07。一定不能是
作为TH08的证据。直到确切的 TH08 1.00d IDB 打开并且元数据
飞行前通行证，使用目标端 `objdump`/`llvm-objdump`，正确导入
Ghidra 项目，以及继承的上游映射。参见
[IDA和分析安全性](docs/IDA_MCP.md)。

## 项目地图

- [架构和二进制库存](docs/ARCHITECTURE.md)
- [逆向工程工作流程](docs/RE_WORKFLOW.md)
- [IDA和分析安全](docs/IDA_MCP.md)
- [构建并精确匹配](docs/BUILD_MATCHING.md)
- [生成重建进度](docs/PROGRESS.md)
-【代理操作规则](AGENTS.md)

## 制作人员和出处

这种延续的存在是由于重建和工具工作
[GensokyoClub/th08](https://github.com/GensokyoClub/th08) 的贡献者。
他们的提交在此保留其原始作者/提交者元数据
存储库。上游项目还感谢 @EstexNT 移植其
MSVC7 的 `var_order` 编译指示。

[N0zoM1z0/th07重建](https://github.com/N0zoM1z0/th07)供应
该存储库的工作流程、结构、目标门、声明、匹配和
文档模型。 [幻想乡俱乐部/th06](https://github.com/GensokyoClub/th06)
仅是相邻发动机的佐证；两个参考都不会覆盖 TH08 目标
证据。