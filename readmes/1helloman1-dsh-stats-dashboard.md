# dsh-stats-dashboard

[![GitHub Stars](https://img.shields.io/github/stars/1HelloMan1/dsh-stats-dashboard?style=social)](https://github.com/1HelloMan1/dsh-stats-dashboard/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/1HelloMan1/dsh-stats-dashboard)](https://github.com/1HelloMan1/dsh-stats-dashboard/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-green.svg)](https://github.com/topics/dsh-plugin)

> 📊 **DeepSeek Harness 插件** — 用量统计看板：按供应商/模型汇总响应速度、调用日志、Token 用量与费用估算

---

## ✨ 功能特点

### 核心指标
- **缓存命中率** — 全局和分模型的缓存效率一目了然
- **响应速度** — 平均耗时、首 Token 延迟 (TTFT)、吞吐量 (tok/s)
- **Token 用量** — 输入/输出/缓存读/缓存写 完整统计
- **费用估算** — 基于内置 DeepSeek 官方定价表实时计算

### 多维度分析
- **供应商维度** — 支持 DeepSeek、OpenCode、OpenCode-Go 等多供应商
- **模型维度** — 按 deepseek-v4-flash、deepseek-v4-pro 等分模型统计
- **会话维度** — 跨会话汇总，单会话筛选
- **时间维度** — 日期范围筛选，实时更新

### 交互功能
- 🔄 **实时刷新** — 手动刷新获取最新数据
- 📥 **CSV 导出** — 导出筛选后的调用日志
- 🔍 **多维筛选** — 搜索/供应商/模型/会话/日期范围
- ⬆️⬇️ **表格排序** — 点击列头按任意指标排序

### 数据展示
- **7 张总览卡** — 调用次数、费用、缓存率、输出、输入、缓存读、缓存写
- **供应商芯片** — 快速查看各供应商用量和费用
- **模型统计表** — 12 列详细指标，按需排序
- **调用日志** — 最近 500 条调用明细，含完整费用和性能指标

---

## 📦 安装

### 方式一：通过 DSH 插件命令（推荐）

```bash
dsh plugin --profile web add "github:1HelloMan1/dsh-stats-dashboard#main"
```

### 方式二：手动安装

```bash
# 克隆仓库
git clone https://github.com/1HelloMan1/dsh-stats-dashboard.git

# 复制到 DSH profile 的 node_modules
cp -r dsh-stats-dashboard ~/.dsh/profiles/node_modules/

# 编辑 DSH profile 的 cordis.patch.yml，添加插件 insert
echo '
- insert:
    - id: stats-dashboard
      name: "dsh-stats-dashboard"
' >> ~/.dsh/profiles/web/cordis.patch.yml

# 重启 DSH
kill $(pgrep -f "dsh web") 2>/dev/null
npx @deepseek-ai/dsh web
```

### 方式三：通过 npm（待发布）

```bash
npm install -g dsh-stats-dashboard
dsh plugin --profile web add dsh-stats-dashboard
```

---

## 🚀 使用

1. 启动 DSH Web 界面
2. 点击左下角 **设置** 齿轮图标
3. 切换到 **插件** 选项卡
4. 点击 **统计看板** 标签页
5. 看到完整的用量统计看板

### 筛选数据
- **搜索框** — 模糊搜索供应商、模型、会话名
- **供应商下拉** — 按供应商筛选（或点击右侧供应商芯片）
- **模型下拉** — 按模型筛选
- **会话下拉** — 按具体会话筛选
- **日期范围** — 选择开始和结束日期

### 导出数据
1. 先用筛选器选择要导出的范围
2. 点击 **导出 CSV** 按钮
3. 自动下载 `dsh-stats-YYYY-MM-DD.csv` 文件
4. 可用 Excel 直接打开（UTF-8 BOM 编码，无乱码）

---

## ⚙️ 配置

### 内置定价表

插件内置 DeepSeek 官方定价（CNY/百万 tokens）：

| 模型 | 输入（未命中） | 缓存读 | 输出 |
|---|---|---|---|
| deepseek-v4-flash | ¥1.00 | ¥0.02 | ¥2.00 |
| deepseek-v4-pro | ¥3.00 | ¥0.025 | ¥6.00 |
| deepseek-chat | ¥2.00 | ¥0.50 | ¥8.00 |
| deepseek-reasoner | ¥4.00 | ¥1.00 | ¥16.00 |

### 自定义定价

编辑 `lib/index.js` 中的 `PRICING` 对象添加新模型：

```javascript
const PRICING = {
  "your-provider\u0000your-model": {
    inputUncachedCny: 1.0,
    cacheReadCny: 0.02,
    outputCny: 2.0
  }
};
```

---

## 📁 文件结构

```
dsh-stats-dashboard/
├── lib/
│   ├── index.js      # Host 端：投影注册、定价表、费用计算
│   └── client.js     # Client 端：看板 UI 组件
├── cordis.patch.yml  # DSH bundle patch 声明
├── package.json      # 插件元数据
└── README.md         # 本文件
```

---

## 🔧 工作原理

### 数据流

```
会话日志 → dsh-session-stats 投影 → session.list RPC
     ↓
dsh-token-meter 投影 → Token 用量 + 费用估算
     ↓
Client 拉取 session.list → 聚合/筛选/渲染
```

### 后端投影

- **sessionStats** — 调用次数、耗时（LLM/首Token/解码）、Token 桶
- **tokenUsage** — 输入/输出/缓存读/缓存写 Token
- **usageDashboard**（本插件注册）— 按 provider/model 聚合统计 + 调用日志

### 前端组件

- **StatsLine** — 底部统计条（响应速度、缓存率、Token 汇总）
- **ContextMeter** — 上下文占用环
- **UsageDashboardTab** — 设置页统计看板（本插件）

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### 开发环境

```bash
# 克隆仓库
git clone https://github.com/1HelloMan1/dsh-stats-dashboard.git
cd dsh-stats-dashboard

# 链接到 DSH profile（开发模式）
ln -s $(pwd) ~/.dsh/profiles/node_modules/dsh-stats-dashboard

# 修改代码后，刷新 DSH 页面即可生效（无需重启）
```

---

## 📄 License

MIT License - 详见 [LICENSE](LICENSE)

---

## 🔗 相关资源

- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — DSH 官方仓库
- [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) — DSH 生态插件列表
- [DSH 插件开发指南](https://github.com/deepseek-ai/deepseek-harness/config/agent-presets/cordis/skills/cordis-plugin-development/SKILL.md) — 官方插件开发文档
- [DeepSeek API 定价](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/) — 官方 API 价格

---

## 🙏 致谢

- [DeepSeek](https://www.deepseek.com/) — 提供强大的 AI 模型
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — 开源 Agent 框架
- 所有 DSH 社区贡献者

---

**如果觉得有用，请给个 ⭐ Star 支持一下！**
