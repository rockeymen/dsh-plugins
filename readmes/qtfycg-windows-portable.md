# windows-portable

DeepSeek Harness 的 Windows 便携版分发。内置 Node.js 运行时与全部依赖，解压后双击即可启动，无需安装 Node.js、pnpm 或任何其他工具链。

## 特性

- **开箱即用**：自带 Node.js v24.15.0 运行时与完整依赖，无需系统预装任何工具链。
- **一键启动**：双击 `DeepSeekHarness.exe` 即可拉起本地服务并自动打开浏览器。
- **便携运行**：解压即用，运行数据与日志保存在用户目录，不污染系统环境。

## 目录结构

```
windows-portable/
├── DeepSeekHarness.exe          # 启动器（Rust 编写），拉起 Node 服务并打开浏览器
└── runtime/
    ├── node.exe                 # 内置 Node.js 运行时（v24.15.0，Windows x64）
    └── app/
        ├── package.json         # 依赖部署根（仅声明 @deepseek-ai/dsh）
        ├── node_modules.7z      # 压缩后的依赖树（随仓库分发，减小体积）
        └── node_modules/        # 解压后的依赖树（git 忽略，运行时直接使用）
```

## 快速开始

1. 下载并解压本仓库（或直接 clone）。
2. 若目录中尚无 `windows-portable/runtime/app/node_modules/`，请先将同目录下的 `node_modules.7z` 解压为 `node_modules/`。
3. 双击 `windows-portable/DeepSeekHarness.exe`，等待浏览器自动打开即可开始使用。

### 启动器用法

```
DeepSeekHarness.exe [--no-open] [workspace-directory]
```

| 参数 | 说明 |
| --- | --- |
| `--no-open` | 启动后不自动打开浏览器 |
| `workspace-directory` | 指定初始工作目录（缺省为当前目录） |

启动器会依次：

1. 使用内置 `runtime/node.exe` 运行 `runtime/app/node_modules/@deepseek-ai/dsh/lib/bin.js` 的 `web` 命令；
2. 等待 Web 服务就绪（最长 45 秒）；
3. 就绪后自动打开 `http://127.0.0.1:<port>`。

## 数据与日志

运行数据与日志保存在用户目录，而非程序目录：

- 状态与日志：`%LOCALAPPDATA%\DeepSeekHarness\`
  - `logs/launcher.log`：启动器日志
  - `launcher-state.txt`：启动器状态

## 构建 / 打包

本仓库是纯分发仓库，不包含启动器与依赖的源码。各产物的来源如下：

| 产物 | 来源 |
| --- | --- |
| `DeepSeekHarness.exe` | Rust 启动器，源码不在本仓库，需单独编译 |
| `runtime/node.exe` | 官方 Node.js Windows x64 二进制 |
| `runtime/app/node_modules.7z` | 上游 `@deepseek-ai/dsh` 依赖树经压缩打包 |

如需更新版本：

1. 更新 `windows-portable/runtime/app/package.json` 中的 `@deepseek-ai/dsh` 版本；
2. 重新执行 `pnpm install --prod` 生成新的 `node_modules/`；
3. 用 7-Zip 将 `node_modules/` 压缩为 `node_modules.7z`（覆盖原文件）；
4. 替换 `runtime/node.exe` 与 `DeepSeekHarness.exe`。

## 相关项目

- 上游：[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- CLI 包：`@deepseek-ai/dsh`

## 许可证

本项目依据 [Apache License 2.0](LICENSE) 分发。DeepSeek Harness 及其依赖遵循各自的开源许可证。
