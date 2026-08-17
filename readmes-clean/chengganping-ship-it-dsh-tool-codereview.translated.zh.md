#dsh-tool-codereview

> 适用于 DeepSeek Harness 的人工智能代码审查和安全扫描插件

## 特点

- **code_review**：全面的代码质量分析
- **security_scan**：OWASP Top 10 漏洞扫描
- **dependency_audit**：基于CVE的漏洞检测
- **performance_check**：N+1，内存泄漏检测
- **code_check**：快速通过/失败验证

## 安装

```bash
dsh plugin --profile web add https://github.com/chengganping-ship-it/dsh-tool-codereview/archive/refs/tags/v0.3.0.tar.gz
```