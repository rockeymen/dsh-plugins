# dsh-weekly-hot

![DSH](assets/DSH.png)

DSH Web UI 的「每周热门插件」榜单插件：**飙升榜**（7/30/90 天 Star 增长 + 更新活跃度加权）与**精选主题榜**（社区 awesome 列表 + 主题标签）。零服务器、零运行时依赖（仅 React peer），数据全部由浏览器直连 GitHub 获取。

## 界面预览

![面板截图](assets/screenshot.png)

## 功能

- **入口**：右缘悬浮按钮（🔥 本周热门插件）随时点开；设置 → 插件 → 每周热门插件 也有官方入口；不喜欢悬浮按钮可在设置里关闭
- **定时弹窗**：到期自动弹出最新榜单，间隔可选 关闭/每天/每周/每两周/自定义分钟数（默认每周），面板 ⚙️ 设置与设置页均可修改；手动打开会重置计时
- **外观自定义**：面板宽度（360–720px 滑杆）、背景图片（默认 DSH 插画 / 无 / 自定义 URL）、背景透明度，面板 ⚙️ 设置即时生效
- **加载与限流**：加载时大号旋转指示 + 骨架屏；GitHub 限流时不再报英文错误——显示「X 分 X 秒后自动重试」倒计时并在配额恢复时自动重试，有缓存则直接展示缓存数据
- **飙升榜**：`topic:dsh-plugin` 全量检索 × localStorage 星标基线差值（首访无基线时按近期活跃度估算并标注「估算」）；新仓库加权、近 30 天推送活跃度加权
- **精选主题榜**：解析 awesome-dsh-plugin / Oh-My-DSH 等社区精选 README，按 #UI #工具 #记忆 #工作流 #视觉 #多模态 主题分桶，主题不足时用 topics/描述推导补齐
- **插件卡片**：名称 + GitHub 链接、README 首句描述（raw.githubusercontent 懒加载补全）、topics/主题标签、★ 数、增长数、一键安装
- **一键安装**：浏览器 POST 到宿主侧 `/api/dsh-weekly-hot/install`（仅回环可达），宿主执行 `dsh plugin --profile web add github:<owner>/<repo>`；失败时展示 stderr 与手动命令
- **额度管理**：展示 GitHub API 剩余额度与恢复倒计时；设置页可填 Token（仅存浏览器 localStorage）
- **缓存与降级**：搜索缓存 1h、精选列表缓存 6h、README/包校验缓存 24h；限流时自动回落缓存数据并提示
- **验证与排除**：package.json `dsh` 字段校验（卡片 ✓ 标记），排除 deepseek-ai 官方核心仓库与归档仓库

## 安装

```bash
# npm（推荐）
dsh plugin --profile web add dsh-weekly-hot
# GitHub
dsh plugin --profile web add "github:XCNXNXNX/dsh-weekly-hot"
# 或本地开发
dsh plugin --profile web add link:C:/tool/DeepSeek/DeepSeekHarness/my-plugins/dsh-weekly-hot
```

重启 `dsh web` 生效。

## 配置

`config.json`（随插件分发，改后刷新生效）：

```json
{
  "榜单配置": {
    "飙升榜": { "时间窗口": [7, 30, 90], "最小Star数": 0, "榜单长度": 50 },
    "精选主题榜": { "主题列表": ["UI", "工具", "记忆", "工作流", "视觉", "多模态"], "每主题数量": 10 }
  },
  "数据源": {
    "优先使用社区精选": true,
    "社区精选列表": ["https://raw.githubusercontent.com/…/README.md"],
    "GitHub Token": ""
  },
  "UI": { "自动刷新间隔": 3600, "默认榜单": "飙升榜", "默认时间窗口": 7 }
}
```

Token 也可在面板 ⚙️ 设置中填写（优先于文件，仅存 localStorage）。

## 数据来源

- GitHub Search API：`topic:dsh-plugin`（权威索引）+ 仓库元数据（stars/forks/topics/pushed_at）
- raw.githubusercontent.com：README 首句、package.json `dsh` 字段校验
- 社区精选：awesome-dsh-plugin、Oh-My-DSH（面板底部标注实际来源）

飙升榜的增长数为**本地基线差值**：GitHub API 不提供历史 Star 快照，插件每次刷新记录一次观测值，跨周期的增长会在下一个窗口精确显示。

## 开发

```bash
npm install   # 或 pnpm install
npm run build # esbuild 双产物（lib/index.js 宿主半体 + lib/client.js 浏览器半体）+ tsc 类型
```

结构：`src/index.ts` 宿主半体（安装 route）；`src/client/` 浏览器半体（`launcher.ts` 悬浮按钮、`panel-mount.tsx` 独立 React root 弹窗、`store.ts` 控制器与定时弹窗调度、`services/` GitHub 与精选数据、`utils/scoring.ts` 飙升加权）。

## 许可

BSD-3-Clause
