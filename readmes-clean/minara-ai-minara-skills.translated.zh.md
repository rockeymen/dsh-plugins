# 米纳拉技能
  ![Xneuro](assets/minara_banner.png)

[Minara](https://minara.ai) 是一款人工智能原生金融操作系统，这些技能将其带入您的代理中。用简单的语言交易美国和韩国股票、期货、指数、大宗商品、外汇和加密货币。跨 EVM、Solana 和 Hyperliquid 运行链上交易、管理钱包并获取实时市场数据。

> **⚡ Strategy Studio** — 超越执行：人工智能支持的回测和人工智能因素组合策略。现已在网络上提供：**[strategy.minara.ai](https://strategy.minara.ai)**。

### 适用于

## 特点

- **现货交易** — 通过代码、代币名称或合约地址在支持的链上购买、出售、交换、转换和转移。
- **永续合约** — Hyperliquid 上的开仓/平仓、杠杆、多钱包管理、交易历史和人工智能自动驾驶仪。
- **限价订单** — 创建、列出和取消现货和永久限价订单。
- **钱包和资金** — 内置钱包、余额、投资组合、存款地址、现货/永久资金、取款、转账和通过 MoonPay 的信用卡入口。
- **人工智能洞察和市场** — 实时链上数据、代币基本面、鲸鱼流量、趋势代币/股票、股票研究、商品和外汇。
- **x402 付款** — 直接从 Minara 钱包支付支持 x402 的 HTTP API。
- **高级版** — 计划、积分和订阅管理。

## 支持的网络

以太坊、Base、Arbitrum、Optimism、Polygon、Avalanche、Solana、BSC、Berachain、Blast、Manta、Mode、Sonic、Conflux、Merlin、Monad、Polymarket、XLayer 和 Hyperliquid (perps)。

## 安装

Claude Code

**一键式（推荐）：** 将此提示发送给您的 Claude Code 代理：

```
Run "curl -fsSL https://raw.githubusercontent.com/Minara-AI/skills/main/scripts/claudecode-minara-skill-setup.sh | bash" to install Minara CLI, Minara Skills and set following config. Follow the login URL when prompted.
```

这将安装 Minara CLI，将技能文件复制到 `~/.claude/skills/minara` 并启动登录流程。

**手册：**

```bash
npm install -g minara@latest
git clone https://github.com/Minara-AI/skills.git /tmp/minara-skills
cp -r /tmp/minara-skills/skills/minara ~/.claude/skills/minara
```

开爪
**一键式（推荐）：** 将此提示发送给您的 OpenClaw 代理：

```
Run "curl -fsSL https://raw.githubusercontent.com/Minara-AI/skills/main/scripts/openclaw-minara-skill-setup.sh | bash" to install Minara CLI, Minara Skills and set following config. Follow the login URL when prompted.
```

这将安装 CLI，将技能文件复制到 `~/.openclaw/skills/minara`，在 `openclaw.json` 中注册技能，开始登录。

**爪轮：**

```bash
clawhub install lowesyang/minara
```

**手册：**

```bash
git clone --branch main https://github.com/Minara-AI/skills.git /tmp/minara-skills
cp -r /tmp/minara-skills/skills/minara ~/.openclaw/workspace/skills/minara

or

cp -r /tmp/minara-skills/skills/minara path/to/openclaw/workspace/skills
```

添加到`~/.openclaw/openclaw.json`：

```json
{
  "skills": {
    "entries": {
      "minara": {
        "enabled": true
      }
    }
  }
}
```

赫尔墨斯

**一键式（推荐）：** 将此提示发送给您的 Hermes 代理商：

```
Run "curl -fsSL https://raw.githubusercontent.com/Minara-AI/skills/main/scripts/hermes-minara-skill-setup.sh | bash" to install Minara CLI, Minara Skills and set following config. Follow the login URL when prompted.
```

这将安装 Minara CLI，将技能文件复制到 `~/.hermes/skills/minara` 并启动登录流程。

**手册：**

```bash
npm install -g minara@latest
git clone https://github.com/Minara-AI/skills.git /tmp/minara-skills
cp -r /tmp/minara-skills/skills/minara ~/.hermes/skills/minara
```

## 快速入门

```
> Login to Minara
> Show my Minara deposit address
> Buy 100 USDC worth of ETH
> What tokens are trending?
```

## 用法

用自然语言与客服人员交谈。它为您运行正确的命令。

### 基本流程

### 步骤·提示示例
- **步骤**：**登录** · **提示示例**：_“登录 Minara”_
- **步骤**：**存款** · **示例提示**：_“显示我的存款地址”_ / _“用信用卡购买加密货币”_ / _“向 perps 存入 500 USDC”_
- **步骤**：**交易** · **提示示例**：_“购买价值 100 USDC 的 ETH”_ / _“将 0.1 ETH 兑换成 USDC”_ / _“出售所有 SOL”_

### Perps 和限价订单

### 目标·示例提示
- **目标**：**开仓** · **提示示例**：_“做多 ETH 永续合约”_ / _“做空 BTC，10 倍杠杆”_
- **目标**：**AI分析** · **提示示例**：_“分析ETH做多还是做空”_ / _“我应该做多BTC吗？”_
- **目标**：**自动驾驶** · **提示示例**：_“为犯罪者启用人工智能自动驾驶”_
- **目标**：**限价订单** · **示例提示**：_“当价格达到 3000 美元时购买 ETH”_ / _“以 150 美元购买 SOL”_
- **目标**：**管理订单** · **提示示例**：_“列出我的限价订单”_ / _“取消限价订单[id]”_

### 更多示例

- _“显示我的加密投资组合”_ / _“我的余额是多少？”_
- _“哪些代币正在流行？”_ / _“搜索 SOL 代币”_
- _“支付 100 USDC 至 [地址]”_ / _“提取 10 SOL 至 [地址]”_

有关完整的 CLI 示例，请参阅 [examples.md](skills/minara/references/examples.md)。

## 基准测试

**88/100** 在 [crypto-skill-bench](https://github.com/Minara-AI/crypto-skill-benchmark)（v3.0.2，Claude Sonnet 4.6，76 个场景）

### 维度·分数
- **维度**：安全·**分数**：91
- **维度**：覆盖范围· **分数**：86
- **维度**：稳健性 · **分数**：88
- **维度**：路由·**分数**：88
- **维度**：用户体验 · **分数**：86

66 人通过，10 人部分，0 人失败。安全门：PASS。

## 脚本

### 脚本·目的
- **脚本**：`scripts/claudecode-minara-skill-setup.sh` · **用途**：Claude Code 的一键安装程序：安装 CLI、复制技能、运行登录
- **脚本**：`scripts/openclaw-minara-skill-setup.sh` · **用途**：OpenClaw的一键安装程序：安装CLI，复制技能，在`openclaw.json`中注册，运行登录
- **脚本**：`scripts/hermes-minara-skill-setup.sh` · **用途**：Hermes 的一键安装程序：安装 CLI、复制技能、运行登录
- **脚本**：`skills/minara/scripts/version-check.sh` · **用途**：会话级版本检测器 - 输出 `UP_TO_DATE`、`SNOOZED` 或 `UPGRADE cli:X→Y [skill:X→Y]`
- **脚本**：`scripts/gen-star-history.py` · **目的**：从实时观星仪数据重新生成 `assets/star-history.svg`（需要 `gh` 验证）。运行，然后提交。

所有设置脚本都是幂等的，并支持相同的三层技能下载回退：ClawHub→GitHub→clawhub CLI。

## 安全

该存储库包含文档文件和安装脚本。没有二进制文件或长期运行的服务。安装脚本从 npm 安装 [Minara CLI](https://www.npmjs.com/package/minara) 并将技能文件复制到技能目录中。凭证由 CLI 的官方登录流程处理；此存储库不收集或存储秘密。

## 链接

- [Discord](https://discord.com/invite/minaraai)
- [米纳拉](https://minara.ai)
- [Minara CLI (npm)](https://www.npmjs.com/package/minara)
- [加密技能基准](https://github.com/Minara-AI/crypto-skill-benchmark)
- [开爪技能](https://docs.openclaw.ai/tools/skills)
- [ClawHub](https://clawhub.ai)