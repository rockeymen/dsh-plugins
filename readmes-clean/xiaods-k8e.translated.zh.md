![](https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=200&section=header&text=K8E%20🚀&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=Open%20Source%20Agentic%20AI%20Sandbox%20Matrix&descAlignY=60&descSize=22&animation=fadeIn)

  ![输入 SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=00D4FF&center=true&vCenter=true&width=700&lines=Open+Source+Agentic+AI+Sandbox+Matrix+%F0%9F%A4%96;Secure+Isolated+Agent+Execution+at+Scale+%F0%9F%94%92;Up+and+Running+in+60+Seconds+%E2%9A%A1;Single+Binary+%3C+100MB+%F0%9F%93%A6;E2B+SDK+Compatible+%F0%9F%A4%9D)

> **k8e.sh** — 开源 Agentic AI 沙盒矩阵。 **单个二进制文件低于 100MB**，可将任何 Linux 主机转变为 AI 代理的安全、隔离执行平台 — gVisor、Kata 或 Firecracker 隔离、热池快速启动以及 E2B 兼容 API。 **60 秒**内即可启动并运行。

```bash
curl -sfL https://k8e.sh/install.sh | sh -
```
*就是这样。您的代理沙箱矩阵已准备就绪。 🤖*

## 📖 目录

### #· 部分
- **#**：1 · **部分**：[🤖 K8E 是什么？](#-what-is-k8e)
- **#**：2·**部分**：[🏗️建筑](#️-architecture)
- **#**：3 · **部分**：[⚙️ 组件](#️-components)
- **#**：4 · **部分**：[🚀 快速入门](#-quick-start)
- **#**：5 · **部分**：[🔒 沙盒运行时设置](#-sandbox-runtime-setup)
- **#**：6 · **部分**：[🤖 沙盒 CLI](#-sandbox-cli)
- **#**：7 · **部分**：[🖥️高级安装](#️-advanced-installation)
- **#**：8 · **部分**：[🆚 K8E 与其他沙盒平台](#️-k8e-vs-other-sandbox-platforms)
- **#**：9 · **部分**：[🤝 贡献](#-contributing)
- **#**：10·**部分**：[🙏致谢](#-acknowledgments)

## 🤖 K8E 是什么？

**K8E** 是 **开源 Agentic AI 沙箱矩阵** - 一个自托管沙箱平台，用于大规模运行安全、隔离的 AI 代理工作负载，打包为 100MB 以下的单个二进制文件。

随着自主人工智能代理越来越多地生成和执行不受信任的代码，强大的沙箱基础设施不再是可选的。 K8E 提供了在 60 秒内启动生产级集群所需的一切，以及用于代理隔离、资源治理和临时执行环境的一流原语 - 专为人工智能时代而构建。

> 🔒 **一簇。代理很多。他们之间零信任。**

### 沙盒功能

### 能力·描述
- **功能**：🔒 **硬件隔离** · **描述**：可插入运行时：gVisor（默认）、Kata Containers、Firecracker microVM
- **功能**：🌐 **网络策略** · **描述**：Cilium eBPF `toFQDNs` 出口控制 - 每个会话，无需代理进程；通过 `--cilium-dns-proxy` (KIP-16 M10) 强制执行 `allowed_hosts`
- **功能**：⚖️ **资源配额** · **描述**：每个代理会话的 CPU/内存上限，以防止成本失控
- **功能**：🗑️ **临时工作空间** · **描述**：代理会话结束后自动清理；子代理的每会话工作空间隔离 (KIP-16 M1)
- **功能**：🧠 **暖池** · **描述**：预启动的沙箱 Pod，会话声明延迟低于 500 毫秒；应用程序层准备情况 handshake、自适应大小调整、每会话后台运行上限
- **功能**：📸 **内容寻址快照** · **描述**：具有 zstd 压缩的 SHA-256 CAS 层存储、分块多层清单、增量 `--base` 恢复、服务器端注册表、自动压缩 (KIP-16 M2)
- **功能**：📜 **执行脚本** · **描述**：文件支持、窗口化、偏移可恢复命令脚本 — `k8e-sandbox-cli log` (KIP-16 M4)
- **功能**：📊 **可观察性** · **描述**：Prometheus 指标、仅磁盘 NDJSON 事件流、进程拓扑 — `events` / `ps` CLI (KIP-16 M5)
- **功能**： 🔄 **子代理重用** · **描述**：子代理共享父 pod + 工作空间；隔离复位（KIP-16 M1）
- **功能**：🧾 **CLI 目录** · **描述**：用于 SDK 生成的机器可读命令/标志表面 — `catalog` (KIP-16 M9)
- **功能**：🤝 **代理沙盒兼容** · **描述**：与 [`kubernetes-sigs/agent-sandbox`](https://github.com/kubernetes-sigs/agent-sandbox) 配合使用
- **功能**：🔄 **技能 + CLI** · **描述**：AI 代理（claude code、codex、pi）通过 `k8e-sandbox-cli` CLI 命令连接

## 🏗️ 架构

```
 AI Agents (Claude Code / Codex / Pi / dsh)
        │  k8e-sandbox-cli / plugin tools    (gRPC over mTLS)
        ▼
┌──────────────────────────────────────────────┐
│              SANDBOX GATEWAY                 │
│  sessions · exec · files · PTY terminals     │
│  expose · allow-hosts · snapshots            │
│  warm pool · metrics · event stream          │
└──────────────┬───────────────────────────────┘
               │ claims ready pods from the warm pool
   ┌───────────▼───────────┐   ┌────────────────┐
   │   SANDBOX POD         │   │   SANDBOX POD  │
   │   gVisor / Kata / FC  │ … │   (isolated)   │
   │   agent's code + fs   │   │                │
   └───────────────────────┘   └────────────────┘
        eBPF per-session network policy between all of them
```

一个网关负责每一项操作——会话生命周期、流式执行、
文件系统、PTY 终端、服务暴露 (`expose`)、实时出口策略
(`allow-hosts`) 和内容寻址快照 - 因此代理可以得到审核
门而不是原始的基础设施访问。

## ⚙️ 组件

### 组件·目的
- **组件**：🚪 **沙箱网关** · **用途**：单个 gRPC (mTLS) + E2B 兼容的 HTTP 门：会话、执行、文件、PTY 终端、暴露、快照
- **组件**：🛡️ **gVisor / Kata / Firecracker** · **用途**：可插拔沙箱隔离运行时（用户空间内核/轻量级虚拟机/微虚拟机）
- **组件**：🔷 **Cilium (eBPF)** · **用途**：每会话网络策略和出口控制 - 无代理进程
- **组件**：🧠 **暖池控制器** · **用途**：预启动的沙箱 Pod、自适应大小调整、低于 500 毫秒的声明
- **组件**：🤖 **k8e-sandbox-cli** · **用途**：独立代理 CLI — 连接、运行、公开、快照（`catalog` 用于 SDK 生成）
- **组件**：🔌 **dsh 插件系列** · **用途**：`@k8e-sandbox/*` npm 包 — DeepSeek Harness 与模型表面工具集成

## 🚀 快速入门

### 步骤 1 — 安装沙箱运行时（推荐：在 K8E 之前）

**在** K8E 之前安装运行时填充程序，以便在首次启动时自动检测到它。 **建议使用 gVisor** — 无需 KVM。

```bash
# Download runsc + containerd-shim-runsc-v1 directly from the gVisor release bucket (requires wget)
ARCH=$(uname -m)   # x86_64 on most servers, aarch64 on ARM
URL=https://storage.googleapis.com/gvisor/releases/release/latest/${ARCH}

wget ${URL}/runsc ${URL}/runsc.sha512 \
     ${URL}/containerd-shim-runsc-v1 ${URL}/containerd-shim-runsc-v1.sha512

sha512sum -c runsc.sha512 -c containerd-shim-runsc-v1.sha512   # both must print OK
chmod +x runsc containerd-shim-runsc-v1
sudo mv runsc containerd-shim-runsc-v1 /usr/local/bin/
ls -l /usr/local/bin/runsc /usr/local/bin/containerd-shim-runsc-v1   # verify both installed
```

> K8E 在启动时检测到 `runsc` 并自动将 gVisor 节注入其容器配置 (`/var/lib/k8e/agent/etc/containerd/config.toml`)。不要**运行 `runsc install` — K8E 管理自己的容器配置。

> 需要更强的隔离？请参阅 [Kata 容器和 Firecracker 的沙盒运行时设置 ](#-sandbox-runtime-setup)。

### 步骤 2 — 安装 K8E

```bash
curl -sfL https://k8e.sh/install.sh | sh -
```

### 步骤 3 — 验证沙箱

```bash
k8e-sandbox-cli status        # -> {"available": true, ...}
k8e-sandbox-cli run 'echo hello from the sandbox'
```

（可选地，对于 `KUBECONFIG=/etc/k8e/k8e.yaml`：`kubectl -n sandbox-matrix get pods` 显示温池 Pod。）

### 步骤 4 — 下载 Sandbox CLI 并连接您的 AI 代理

下载独立沙箱 CLI、进行身份验证并将技能安装到您的代理中：

````bash
# 下载沙箱 CLI (~44MB) — 选择您的平台后缀
# k8e-sandbox-cli-linux-amd64 / linux-arm64 / darwin-amd64 / darwin-arm64 / windows-amd64.exe
卷曲-sLO https://github.com/xiaods/k8e/releases/latest/download/k8e-sandbox-cli-linux-amd64
chmod +x k8e-sandbox-cli-linux-amd64

# 将普通命令名称符号链接到下载的文件（不要重命名）
ln -s k8e-sandbox-cli-linux-amd64 k8e-sandbox-cli

# 在服务器上创建 API 密钥（默认 TTL 30 天；使用 --ttl never 表示不会过期）
k8e sandbox-apikey 创建 my-agent
# → {"name":"my-agent","key":"k8e-abc123...","ttl_days":30,"expires_at":"..."}

# 连接：验证 (mTLS) + 将 /k8e-sandbox 技能安装到代理工具中
./k8e-sandbox-cli --endpoint <服务器 IP>:50051 --apikey k8e-abc123... 连接

# 可选的多集群配置文件（~/.k8e/sandbox/profiles.yaml — 不是服务器 /etc/k8e/config.yaml）
# 请参阅 docs/kip-17-sandbox-cli-profiles-and-apikey-ttl.md
# ./k8e-sandbox-cli --profile prod connec