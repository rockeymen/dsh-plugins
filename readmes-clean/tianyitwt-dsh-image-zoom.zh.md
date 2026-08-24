# dsh-image-zoom

为 [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness) 提供的**智能图像切分与放大**工具。

大多数视觉大模型（VLM）在推理前会将大图强制压缩到约 64 万像素（≈800x800），导致图纸、PCB、文档或高密 UI 中的细小文字和细节完全模糊。本插件为模型提供两把手术刀（`split_image` / `zoom_detail`），让模型**先看全局概览，再以全分辨率放大任意编号区域**——全程在聊天中完成，结果以持久附件返回。

## 为什么需要

- 视觉模型**压缩**高分辨率图像，4K 屏幕上的文字或 PCB 上的微小元件变成模糊的马赛克。
- 让模型在模糊缩略图上猜 `x,y,w,h` 坐标极不可靠。
- 本插件提供**带编号的标注网格**（直接画在缩略图上），模型只需说“放大第 9 格”，引擎就会精确裁剪**原始全分辨率图像**的对应区域。
- 结果以**内联图像**（持久附件）返回，而非临时文件路径。

## 工作方式

```
你上传大图（或通过 image_path 传入文件）
        │
        ▼
[split_image] ──► 生成缩略图 + 编号网格叠加层
        │              （红色实线 = 精确切分边界，蓝色虚线 = 含重叠的实际范围）
        │
        ▼
模型查看标注概览图 ──► 选中某个编号（如第 5 格）
        │
        ▼
[zoom_detail] ──► 裁剪**原始全分辨率**图像的那一区域
        │
        ▼
内联返回裁剪图（可保存并继续链式放大）
```

### 完整调用线路

- **会话级门控**：通过编辑器开关记住每个会话的启用/禁用状态。
- **视觉门控**：自动检测当前主模型是否支持图像输入，纯文本模型拒绝执行。
- **坐标抽象**：你提供的坐标是*你所看到的*（压缩视图）像素，引擎自动缩放映射到原始图像分辨率。
- **文件链式处理**：通过 `save_to` 保存放大结果，再将其作为 `image_path` 传入，实现更深层放大。

## 安装

### 从 npm

```sh
dsh plugin --profile web add dsh-image-zoom
```

`dsh plugin` 会在 profile 目录内转发给 pnpm，包随即落入 profile 的 `node_modules`。然后向 `~/.dsh/profiles/web/cordis.patch.yml` 追加组合行：

```yaml
- insert:
    - id: image-zoom
      name: dsh-image-zoom
```

### 从源码（本地检出）

克隆仓库，然后运行跨平台安装器（纯 Node——Windows、macOS、Linux 通用）：

```sh
git clone https://github.com/your-username/dsh-image-zoom.git
cd dsh-image-zoom
node install.mjs
```

安装器会把包复制到 `~/.dsh/profiles/web/dsh-image-zoom`（遵循 `DSH_HOME`），在 profile 的 `node_modules` 中创建链接（Windows 为 junction，其余平台为符号链接），在 `package.json` 中注册 `link:` 依赖，并向 `cordis.patch.yml` 追加所需的插入行。若存在旧的 `dsh-photo-zoom` 安装，会自动迁移清理。

卸载命令：

```sh
node install.mjs --remove
```

安装完成后，**重启** DSH Web 服务：

```sh
dsh --profile web
```

## 工具说明

### 1. `split_image`

生成一张**带编号的标注网格图**（内联附件）。网格包含：
- **红色实线**：精确的网格切分边界。
- **蓝色虚线矩形**：实际捕获范围*包含重叠边距*（蓝线与红线之间的内容也会出现在相邻格子中）。

**参数**：
- `image_index` (整数, 默认 0)：最近一张附件。
- `image_path` (字符串)：替代源，本地文件路径（PNG/JPEG/WebP/GIF）。
- `save_to` (字符串)：可选，保存概览图的目录或文件路径。
- `type` (枚举)：`document`, `photo`, `webpage`, `object`, `misc` —— 网格策略提示。
- `rotate` (0/90/180/270)：强制旋转（默认遵循 EXIF 方向）。

### 2. `zoom_detail`

以**原始全分辨率**裁剪指定区域，并以内联图片返回。

**参数**（支持视图坐标或 `tile` 编号）：
- `x`, `y`, `w`, `h` (整数)：*压缩视图*中的像素坐标（自动缩放至全分辨率）。
- `tile` (整数)：来自先前 `split_image` 的编号格子（最易用）。
- `label` (字符串)：可选，输出图片的简短名称。
- `image_index` / `image_path`：同上。
- `save_to` (字符串)：保存裁剪图到磁盘，便于链式调用。

## 配置

当视觉模型激活时，聊天输入栏会出现一个**滑动开关**，控制当前会话是否启用该工具。

- **启用（默认）**：工具正常执行。
- **禁用**：工具拒绝执行并给出明确提示（“智能切分已关闭”）。

开关通过两个简单的 HTTP 路由与宿主通信：
- `GET /image-zoom/state` – 返回当前视觉状态和开关状态。
- `POST /image-zoom/enabled` – 更新会话开关。

无需复杂设置页面，开箱即用。

## 模型体验

### 模型能看到什么

- **`split_image` 结果**：带网格叠加的压缩 JPEG。模型读取编号和视觉布局。
- **`zoom_detail` 结果**：精确裁剪区域的原始分辨率 PNG。

### Token / KV Cache 影响

工具本身**不会**修改 LLM 提示词或 KV Cache。它们生成图像附件，作为标准图像内容块渲染在对话中。Token 消耗完全由 DSH 原生附件系统管理（即渲染图片的常规代价）。

## 项目结构

```
dsh-image-zoom/
├── lib/
│   ├── index.js             # 宿主插件（工具定义、HTTP 开关、子进程编排）
│   └── client.js            # 客户端（编辑器开关 UI）
├── helper/
│   └── split_helper.cjs     # 基于 Sharp 的图像处理引擎（独立子进程）
├── LICENSE
└── package.json             # DSH Bundle 清单（dsh.client 声明）
install.mjs                  # 跨平台安装器（Windows / macOS / Linux）
```

## 开发

辅助进程使用 `sharp` 处理图像，以子进程方式运行，避免阻塞主事件循环。`sharp` 本身**不随包分发**：引擎会自发现 DSH 安装自带的那份（DSH 支持的每个平台都带），因此本包保持纯 JavaScript。

修改代码后，重新运行安装器并重启 `dsh web` 即可生效。

## 发布（维护者）

```sh
cd dsh-image-zoom
npm publish
```

## 许可证

MIT