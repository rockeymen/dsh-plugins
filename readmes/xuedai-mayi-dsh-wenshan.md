# dsh-wenshan

[![DeepSeek Harness](https://img.shields.io/badge/DeepSeek_Harness-community_plugin-2d6a4f)](https://github.com/deepseek-ai/deepseek-harness)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

问山是面向地理野外实习的 DeepSeek Harness 社区插件与二次开发项目。它把实习资料整理成可审核、可追溯的知识图谱，再用已发布的知识完成现场导览、教学讲解和问答。

> [!IMPORTANT]
> 本项目不是 DeepSeek 或 DeepSeek Harness 的官方发行版，也不代表上游项目。仓库内保留了一份经过定制的 DeepSeek Harness 源码，用于提供可复现的安装和运行环境。

## 与 DeepSeek Harness 的关系

本项目基于 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 开发，沿用其 Cordis 插件体系。主要扩展包括：

- `dsh-georag`：知识检索、关系扩展、空间查询和知识事件存储插件。
- `dsh-wenshan`：知识演化与野外助教两种 agent 模式的工具和提示词。
- `dsh-wenshan-intake`：资料收录、知识图谱接口和浏览器页面插件。
- `presets` 与 `wenshan.cordis.yml`：问山的 DSH preset 和产品挂载配置。


![问山主界面](docs/images/home.png)

## 功能

- 知识演化：收录文字、PDF、Word、图片、录音和常见 GIS 文件，生成知识草稿，人工确认后再发布。
- 野外助教：只读正式知识库，支持概念检索、邻接关系、位置、气象和行程查询。
- 可交互图谱：搜索、筛选、拖动和定位节点，按需读取笔记正文。
- 本地持久化：原始资料、提取结果、草稿、发布记录分开保存，重启后可恢复。
- 权限隔离：野外助教没有资料写入和知识发布工具。

![知识图谱](docs/images/knowledge-graph.png)

## 运行环境

当前启动脚本面向 Windows 10/11，需要：

- Node.js 24，或 Node.js 22.19 及以上版本
- pnpm
- Python 3.11

首次安装前先确认命令行可以找到 `node`、`pnpm` 和 `py -3.11`。安装 pnpm 可执行：

```powershell
npm install -g pnpm
```

## 快速开始

```powershell
git clone <你的仓库地址>
cd <仓库目录>
.\安装问山.bat
.\启动.bat
```

安装脚本会安装并构建项目内的 DeepSeek Harness，同时安装知识图谱、文档提取、音频转写和 GIS 处理依赖。完成后打开：

- 主界面：`http://127.0.0.1:3080/`
- 知识图谱：`http://127.0.0.1:3080/wenshan/knowledge-graph`

首次进入主界面后，在 `设置 > 模型` 中配置模型和 API Key。凭据写入本机 DSH 配置，不进入本仓库。

## 使用流程

### 收录资料

切换到 `知识演化`，选择一个资料文件夹，或直接粘贴短文本。系统按 SHA-256 内容指纹去重，原件和提取结果会分别保存。

支持的主要格式：

| 类型 | 格式 |
| --- | --- |
| 文字 | TXT、Markdown、CSV、TSV |
| 文档 | PDF、DOCX |
| 图片 | JPG、PNG、WebP、HEIC、TIFF |
| 录音 | MP3、WAV、M4A、OGG、FLAC、AAC |
| GIS | GeoJSON、GPX、包含 Shapefile 或 GDB 的 ZIP |

### 审核并发布

发送 `处理最新资料` 后，知识演化引擎会读取来源并生成草稿。草稿不会自动进入正式知识库。确认内容无误后，按页面提示发送完整口令：

```text
确认发布 draft-xxxxxxxx
```

`可以`、`继续` 等普通回复不会触发发布。发布成功后，检索引擎会立即更新。

### 现场问答

切换到 `野外助教` 即可使用正式知识库。这个模式只注册读取工具，不能修改来源、草稿或已发布知识。

## 数据结构

基础庐山数据位于 `data/*.json`。运行期间新增的资料和知识写入 `data/knowledge/`：

```text
data/knowledge/
├─ events.jsonl
├─ sources/
├─ extracted/
└─ structured/
```

`data/knowledge/`、`data/photos/` 和本机凭据已经加入 `.gitignore`。公开仓库前仍应检查原始实习记录、照片和地理数据的授权与隐私边界。

如需从原始 GDB、Obsidian 知识库和每日整理目录重建基础数据，先修改 `config/lushan.json` 中的三个来源路径，再运行：

```powershell
.\更新数据.bat
```

## 项目结构

```text
presets/                    知识演化与野外助教两个 DSH preset
dsh-georag/                 GeoRAG 检索、空间查询和知识事件存储插件
dsh-wenshan/                DSH 工具注册与两种模式的系统提示词
dsh-wenshan-intake/         资料收录、图谱接口和图谱页面插件
deepseek-harness-master/    项目内定制的 DeepSeek Harness 源码
tools/                      数据构建、资料提取和验收脚本
web/                        独立界面源码及检索评测复用代码
data/                       可公开的基础检索数据
```


## 技术说明

问山基于项目内的 DeepSeek Harness 二次开发。图谱使用 `force-graph`，基础检索结合中文二元组 BM25、知识关系扩展和空间距离衰减。主服务只监听 `127.0.0.1`，适合本机演示和教学环境。

如需部署到公网，应另外配置登录鉴权、HTTPS、限流、文件安全检查和数据备份，不能直接暴露本机服务端口。

## 许可与声明

本项目使用 [MIT License](LICENSE)。DeepSeek Harness 的原始 MIT 许可证、版权声明和第三方依赖声明保留在 `deepseek-harness-master/deepseek-harness-master/` 中，汇总信息见 [NOTICE.md](NOTICE.md)。`force-graph` 使用 MIT 许可证。

`DeepSeek` 和 `DeepSeek Harness` 仅用于说明兼容关系与代码来源。山谷背景由本项目生成，仓库不包含原 Wallpaper Engine 素材包。公开使用庐山示例数据前，请自行确认数据授权和隐私边界。
