#dsh-plugins-hub

> 一个独立的、社区友好的插件索引 [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness)。
> 通过自动化 + 人工审核进行策划。主题：`dsh-plugin`。

## 特色插件

### 插件 · 描述 · 安装 · 状态 · 安全 · 试用 · 检查于 · 提交
- **插件**：[dsh-netdoctor](https://github.com/TYEclipse/dsh-netdoctor) · **描述**：网络诊断工具箱：DNS 查找、ICMP ping、TCP 端口检查、TLS 证书检查、traceroute、公共 IP — 六个只读探测器、零运行时依赖性 · **安装**：`dsh plugin --profile web add github:TYEclipse/dsh-netdoctor` · **状态**： ✅ 活动 · **安全**：✅ · **试用**：✅ e2e (dns_lookup ×2: 系统 + 8.8.8.8) · **检查于**：2026-08-16 · **提交**：43de786b
- **插件**：[dsh-webfetch](https://github.com/TYEclipse/dsh-webfetch) · **描述**：网页阅读器：获取任何 URL 并提取干净的 Markdown / 纯文本加上链接清单 - 零运行时依赖性，只读 · **安装**：`dsh plugin --profile web add github:TYEclipse/dsh-webfetch` · **状态**：✅ 活动 · **安全**： ✅ · **试用**：✅ e2e (web_fetch) · **检查于**： 2026-08-16 · **提交**：6296371d
- **插件**：[dsh-units](https://github.com/TYEclipse/dsh-units) · **描述**：单位转换工具箱：14个类别（长度、质量、温度、数据大小十进制与二进制、速度、时间、体积、压力、能量、角度、频率、排版 px/pt/em/rem、燃油经济性 mpg ↔ L/100km） - 零运行时依赖性，纯数学 · **安装**： `dsh plugin --profile web add github:TYEclipse/dsh-units` · **状态**： ✅ 活跃 · **安全**： ✅ · **试用**： ✅ e2e (convert_unit) · **检查时间**：2026-08-16 · **提交**：2bdfae10
- **插件**：[dsh-color](https://github.com/TYEclipse/dsh-color) · **描述**：颜色转换工具箱：解析/转换任何 CSS 颜色（十六进制、rgb()/hsl()/hwb()、所有 148 CSS Color 4 命名颜色）、带有 AA/AAA 判决的 WCAG 2.x 对比度、按名称或值查找命名颜色 — 零运行时依赖性、纯数学 · **安装**： `dsh plugin --profile web add github:TYEclipse/dsh-color` · **状态**： ✅ 活跃 · **安全性**： ✅ · **试用**： ✅ e2e (contrast_ratio) · **检查时间**：2026-08-16 · **提交**：2783169
- **插件**：[Code2Skill](https://github.com/leechen298/Code2Skill) · **描述**：三个代理技能，从用户授权的代码生成可移植的功能/MCP工具/工作流程技能包（带离线测试），加上独立的流程和源语义审查 - 纯技能包，麻省理工学院 · **安装**：`dsh plugin --profile web add github:leechen298/Code2Skill#v1.1.3` · **状态**： ✅ 活跃 · **安全**： ✅ · **试用**： ✅ e2e （code2skill-review-源技能调用无头） · **检查于**：2026-08-16 · **提交**：7815d8f1

列： **安全性** = 通过初步来源审查（TRACE-lite：信任/可靠性/可审核性/机密性/有效性）； **试用** = 通过真实的端到端工具调用在隔离的配置文件中进行验证； **提交** = 已验证的确切修订版本。

## 如何添加你的插件

1. 将 `dsh-plugin` 主题添加到您的插件存储库
2. 使用 **插件提交** 模板（插件名称、存储库链接、发布标签、许可证、安装命令）在此存储库中打开问题
3. 管道验证隔离配置文件中的提交 — 安全审查、安装和一次真正的端到端工具调用
4. 已验证的插件已添加到索引中，问题已关闭；失败的提交保持打开状态，并带有 `needs-fix` 标签和摘要回复

## 关于

- 独立社区索引（不隶属于DeepSeek AI）
- 每日自动更新
- 麻省理工学院许可证

*由dsh-自动驾驶仪管道维护。*