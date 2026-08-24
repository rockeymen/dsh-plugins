# dsh-background

> 版本 **1.0.6** · 为 DeepSeek Harness 聊天页设置自定义背景壁纸。

在 DSH 的**设置 → 背景**里配置：本地上传 / 图片链接、透明度、深色遮罩、聊天区或全屏作用范围。
所有设置与图片持久化到本机，重启后依然生效；卸载即完全还原。

## 功能

- **三种图片来源**：无背景 / 本地上传（PNG·JPG·GIF·WebP，≤20MB）/ 图片链接（http/https）。
- **自动缩放**：上传与链接图片统一在浏览器 canvas 等比缩放到屏幕对应尺寸（保持宽高比），
  图片比屏幕大就缩小、比屏幕小就放大；既贴合屏幕显示，也防超大图占内存。
- **透明度滑杆（0–100%）**：数值越大壁纸越明显、表面越通透。
- **深色遮罩滑杆（0–100%）**：数值越大遮罩越深（0–100 平滑变化，不修改图片数据）。
- **作用范围**：
  - **聊天区（默认）**：壁纸作用于对话整体（头部 + 消息流 + 输入框），整块采用统一的
    亮度/透明度，观感一致；**侧边栏保持 100% 不透明**，不被壁纸透出。
  - **全屏**：壁纸铺满整个窗口（含侧边栏），所有区域统一透明/亮度。
- **一致性**：聊天区与全屏共用同一套壁纸 + 半透明处理机制，保证头部/消息/输入框
  透出的壁纸与明暗观感一致。
- **持久化**：配置与图片存于 `$DSH_HOME/storages/dsh-background/`，重启 DSH 后仍生效；
  上传与 URL 图片应用后都保存为本地文件，离线也能显示。
- **双主题**：颜色全部走 DSH 主题 token（`--dsw-*`），深浅色自动适配，不写死颜色。

## 安装

从 GitHub 安装（推荐，随仓库持续更新）：

```bash
pnpm dsh plugin --profile web add github:lcohvne-tomorin/dsh-background#84955f4534bf3b2b7d6f300e5d8f72b9ec52a772
```

> git 依赖按插件开发标准锁定完整 commit（40 位 hex），升级时更新 hash 为最新提交。
> 也可直接克隆到 `/node_modules/dsh-background/` 后，在
> `/cordis.patch.yml` 追加（或使用包内 `cordis.patch.yml` 的 insert 块）：

```yaml
- insert:
    - id: dsh-background
      name: dsh-background
```

重启 DeepSeek Harness，打开 **设置 → 背景**。

（发布形态：`package.json` 声明 `dsh.bundle.patch`，可用
`pnpm dsh plugin --profile web add <spec>` 安装。）

## 使用

1. 打开 **设置 → 背景**，勾选「启用背景」。
2. 选「本地上传」选图，或切到「图片链接」粘贴 http(s) 图片地址并点「下载并应用」。
3. 拖动透明度和深色遮罩滑杆到满意；「作用范围」可切 聊天区 / 全屏。
4. 选「无背景」或关闭「启用背景」即恢复默认。

## 权限与影响声明（安装前审查）

- **联网**：仅当你在「图片链接」里粘贴 URL 时，host 半会向该 URL 发起下载
  （streams，20MB 上限，仅 http/https，20s 超时，最多跟随 5 次重定向）；
  下载会封锁私网/回环/链路本地/云元数据地址（SSRF 防护），图片按魔数校验。
  其余操作不联网。
- **读写文件**：配置与图片写入 `$DSH_HOME/storages/dsh-background/`；选择「无背景」
  或停用时会清除该目录下的背景图片。
- **全局 UI 修改**：开启壁纸后注入样式（所有规则挂在 `html.dbg-active` 根类下，
  关闭「启用背景」即一键回滚到默认外观）；聊天区模式下侧边栏不被壁纸透出，全屏模式
  会令侧边栏与消息卡片/输入区半透明以透出壁纸。
- **不采集、不上传任何会话/用户数据**；无未经鉴权的写状态 HTTP 端点：写端点要求
  `Host` 为回环地址 + 同源校验 + 进程级 CSRF token + 简单限流；`value` 配置字段
  host 端白名单校验，错误响应不泄露内部细节。

## 开发

- Host 半 `lib/index.js`：持久化、上传/URL 下载、只读图片端点、CSRF 防护、请求体上限。
- Client 半 `lib/client.js`：设置页 UI、canvas 缩放、`html.dbg-active` 作用域化 CSS。
- 变更记录见 [CHANGELOG.md](CHANGELOG.md)。

## 卸载

1. 删掉 `/cordis.patch.yml` 里对应的 `- insert:` 块；
2. 删除 `/node_modules/dsh-background/` 目录；
3. 重启 DSH。插件卸载时自动移除注入的样式；如愿意可手动删除
   `$DSH_HOME/storages/dsh-background/` 残留文件。