![](https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=200&section=header&text=K8E%20🚀&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=Open%20Source%20Agentic%20AI%20Sandbox%20Matrix&descAlignY=60&descSize=22&animation=fadeIn)

  ![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=00D4FF&center=true&vCenter=true&width=700&lines=Open+Source+Agentic+AI+Sandbox+Matrix+%F0%9F%A4%96;Secure+Isolated+Agent+Execution+at+Scale+%F0%9F%94%92;Up+and+Running+in+60+Seconds+%E2%9A%A1;Single+Binary+%3C+100MB+%F0%9F%93%A6;E2B+SDK+Compatible+%F0%9F%A4%9D)

> **k8e.sh** — Open Source Agentic AI Sandbox Matrix. A **single binary under 100MB** that turns any Linux host into a secure, isolated execution platform for AI agents — gVisor, Kata, or Firecracker isolation, warm-pool fast starts, and an E2B-compatible API. Up and running in **60 seconds**.

```bash
curl -sfL https://k8e.sh/install.sh | sh -
```
*That's it. Your agentic sandbox matrix is ready. 🤖*

## 📖 Table of Contents

### # · Section
- **#**: 1 · **Section**: [🤖 What is K8E?](#-what-is-k8e)
- **#**: 2 · **Section**: [🏗️ Architecture](#️-architecture)
- **#**: 3 · **Section**: [⚙️ Components](#️-components)
- **#**: 4 · **Section**: [🚀 Quick Start](#-quick-start)
- **#**: 5 · **Section**: [🔒 Sandbox Runtime Setup](#-sandbox-runtime-setup)
- **#**: 6 · **Section**: [🤖 Sandbox CLI](#-sandbox-cli)
- **#**: 7 · **Section**: [🖥️ Advanced Installation](#️-advanced-installation)
- **#**: 8 · **Section**: [🆚 K8E vs Other Sandbox Platforms](#️-k8e-vs-other-sandbox-platforms)
- **#**: 9 · **Section**: [🤝 Contributing](#-contributing)
- **#**: 10 · **Section**: [🙏 Acknowledgments](#-acknowledgments)

## 🤖 What is K8E?

**K8E** is the **Open Source Agentic AI Sandbox Matrix** — a self-hosted sandbox platform for running secure, isolated AI agent workloads at scale, packaged as a single binary under 100MB.

As autonomous AI agents increasingly generate and execute untrusted code, robust sandboxing infrastructure is no longer optional. K8E ships everything needed to spin up a production-grade cluster in under 60 seconds, with first-class primitives for agent isolation, resource governance, and ephemeral execution environments — purpose-built for the AI era.

> 🔒 **One cluster. Many agents. Zero trust between them.**

### Sandbox Capabilities

### Capability · Description
- **Capability**: 🔒 **Hardware Isolation** · **Description**: Pluggable runtimes: gVisor (default), Kata Containers, Firecracker microVM
- **Capability**: 🌐 **Network Policies** · **Description**: Cilium eBPF `toFQDNs` egress control — per-session, no proxy process needed; `allowed_hosts` enforced via `--cilium-dns-proxy` (KIP-16 M10)
- **Capability**: ⚖️ **Resource Quotas** · **Description**: CPU/memory caps per agent session to prevent runaway costs
- **Capability**: 🗑️ **Ephemeral Workspaces** · **Description**: Auto-cleanup after agent session ends; per-session workspace isolation for sub-agents (KIP-16 M1)
- **Capability**: 🧠 **Warm Pool** · **Description**: Pre-booted sandbox pods for sub-500ms session claim latency; application-layer readiness handshake, adaptive sizing, per-session background-run caps
- **Capability**: 📸 **Content-Addressed Snapshots** · **Description**: SHA-256 CAS layerstore with zstd compression, chunked multi-layer manifests, incremental `--base` restore, server-side registry, autosquash (KIP-16 M2)
- **Capability**: 📜 **Exec Transcripts** · **Description**: File-backed, windowed, offset-resumable command transcripts — `k8e-sandbox-cli log` (KIP-16 M4)
- **Capability**: 📊 **Observability** · **Description**: Prometheus metrics, disk-only NDJSON event stream, process topology — `events` / `ps` CLI (KIP-16 M5)
- **Capability**: 🔄 **Sub-agent Reuse** · **Description**: Sub-agents share the parent pod + workspace; isolated reset (KIP-16 M1)
- **Capability**: 🧾 **CLI Catalog** · **Description**: Machine-readable command/flag surface for SDK generation — `catalog` (KIP-16 M9)
- **Capability**: 🤝 **agent-sandbox compatible** · **Description**: Works with [`kubernetes-sigs/agent-sandbox`](https://github.com/kubernetes-sigs/agent-sandbox)
- **Capability**: 🔄 **SKILL + CLI** · **Description**: AI agents (claude code, codex, pi) connect via `k8e-sandbox-cli` CLI commands

## 🏗️ Architecture

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

One gateway fronts every operation — session lifecycle, streaming exec,
filesystem, PTY terminals, service exposure (`expose`), live egress policy
(`allow-hosts`) and content-addressed snapshots — so agents get one audited
door instead of raw infrastructure access.

## ⚙️ Components

### Component · Purpose
- **Component**: 🚪 **Sandbox Gateway** · **Purpose**: Single gRPC (mTLS) + E2B-compatible HTTP door: sessions, exec, files, PTY terminals, exposure, snapshots
- **Component**: 🛡️ **gVisor / Kata / Firecracker** · **Purpose**: Pluggable sandbox isolation runtimes (user-space kernel / lightweight VMs / microVMs)
- **Component**: 🔷 **Cilium (eBPF)** · **Purpose**: Per-session network policy & egress control — no proxy process
- **Component**: 🧠 **Warm Pool Controller** · **Purpose**: Pre-booted sandbox pods, adaptive sizing, sub-500ms claims
- **Component**: 🤖 **k8e-sandbox-cli** · **Purpose**: Standalone agent CLI — connect, run, expose, snapshots (`catalog` for SDK generation)
- **Component**: 🔌 **dsh plugin family** · **Purpose**: `@k8e-sandbox/*` npm packages — DeepSeek Harness integration with model-surface tools

## 🚀 Quick Start

### Step 1 — Install a Sandbox Runtime (recommended: before K8E)

Install the runtime shim **before** K8E so it is auto-detected on first startup. **gVisor is recommended** — no KVM required.

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

> K8E detects `runsc` at startup and automatically injects the gVisor stanza into its containerd config (`/var/lib/k8e/agent/etc/containerd/config.toml`). Do **not** run `runsc install` — K8E manages its own containerd configuration.

> Need stronger isolation? See [Sandbox Runtime Setup](#-sandbox-runtime-setup) for Kata Containers and Firecracker.

### Step 2 — Install K8E

```bash
curl -sfL https://k8e.sh/install.sh | sh -
```

### Step 3 — Verify the Sandbox

```bash
k8e-sandbox-cli status        # -> {"available": true, ...}
k8e-sandbox-cli run 'echo hello from the sandbox'
```

(Optionally, with `KUBECONFIG=/etc/k8e/k8e.yaml`: `kubectl -n sandbox-matrix get pods` shows the warm-pool pods.)

### Step 4 — Download Sandbox CLI & Connect Your AI Agent

Download the standalone sandbox CLI, authenticate, and install the skill into your agent:

```bash
# Download sandbox CLI (~44MB) — pick your platform suffix
#   k8e-sandbox-cli-linux-amd64 / linux-arm64 / darwin-amd64 / darwin-arm64 / windows-amd64.exe
curl -sLO https://github.com/xiaods/k8e/releases/latest/download/k8e-sandbox-cli-linux-amd64
chmod +x k8e-sandbox-cli-linux-amd64

# Symlink the plain command name to the downloaded file (do not rename)
ln -s k8e-sandbox-cli-linux-amd64 k8e-sandbox-cli

# Create an API key on the server (default TTL 30 days; use --ttl never for non-expiring)
k8e sandbox-apikey create my-agent
# → {"name":"my-agent","key":"k8e-abc123...","ttl_days":30,"expires_at":"..."}

# Connect: authenticate (mTLS) + install /k8e-sandbox skill into agent harnesses
./k8e-sandbox-cli --endpoint <server-ip>:50051 --apikey k8e-abc123... connect

# Optional multi-cluster profiles (~/.k8e/sandbox/profiles.yaml — not server /etc/k8e/config.yaml)
# See docs/kip-17-sandbox-cli-profiles-and-apikey-ttl.md
# ./k8e-sandbox-cli --profile prod connect --apikey k8e-...
```

> **Local usage:** If you're on the same machine as the K8E server, the CLI auto-discovers TLS certs — just run `k8e-sandbox-cli connect`.

Platform binaries: `k8e-sandbox-cli-{darwin,linux,windows}-{amd64,arm64}` (Windows: `k8e-sandbox-cli-windows-amd64.exe`, symlink via `mklink k8e-sandbox-cli.exe k8e-sandbox-cli-windows-amd64.exe`)

> **One binary, two names:** the downloaded `k8e-sandbox-cli-linux-amd64` file **is** the `k8e-sandbox-cli` command the skill uses. `connect` symlinks it to `~/.local/bin/k8e-sandbox-cli` (on PATH) and installs the `/k8e-sandbox` skill into your agent harnesses, so every skill example (`k8e-sandbox-cli run ...`) is the same file you just downloaded.

Then ask your agent naturally:

> "Run this Python snippet in a sandbox"

The agent executes `k8e-sandbox-cli run` automatically — no session management needed.

Supported agents: **claude code**, **codex**, **pi**.

## 🔒 Sandbox Runtime Setup

K8E auto-detects installed runtimes and registers the corresponding `RuntimeClass`. Choose based on your isolation requirements:

### Runtime · Isolation · Requirement · Boot time
- **Runtime**: **gVisor** · **Isolation**: Syscall interception (userspace kernel) · **Requirement**: None · **Boot time**: ~10ms
- **Runtime**: **Kata Containers** · **Isolation**: VM-backed (QEMU) · **Requirement**: Nested virt or bare metal · **Boot time**: ~500ms
- **Runtime**: **Firecracker** · **Isolation**: Hardware microVM (KVM) · **Requirement**: `/dev/kvm` · **Boot time**: ~125ms

### gVisor — Recommended Default

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

> Do **not** run `runsc install` — K8E manages its own containerd config at `/var/lib/k8e/agent/etc/containerd/config.toml` and auto-injects the gVisor stanza on startup.

### Kata Containers

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/kata-containers/kata-containers/main/utils/kata-manager.sh) install-packages"
kata-runtime check
```

### Firecracker (requires `/dev/kvm`)

```bash
ls /dev/kvm   # verify KVM is available

# Install firecracker-containerd shim + devmapper snapshotter
# See: https://github.com/firecracker-microvm/firecracker-containerd
mkdir -p /var/lib/firecracker-containerd/runtime
# Place hello-vmlinux.bin and default-rootfs.img here
```

### Apply Changes

Install runtimes **before** starting K8E for zero-restart setup. If K8E is already running, restart it after installing a new runtime shim:

```bash
systemctl restart k8e
kubectl get runtimeclass
# NAME          HANDLER       AGE
# gvisor        runsc         10s
# kata          kata-qemu     10s
# firecracker   firecracker   10s   ← only if /dev/kvm present
```

## 🤖 Sandbox CLI

`k8e-sandbox-cli` is a standalone binary (~44MB) that gives AI agents direct access to K8E sandbox infrastructure — no server install needed.

```
AI Agent (claude code / codex / pi)
    │  shell command
    ▼
k8e-sandbox-cli run "print('hello')" --lang python
    │  gRPC (TLS)
    ▼
sandbox-grpc-gateway:50051
    │
    ▼
Isolated Pod (gVisor / Kata / Firecracker)
```

### Install the Skill

**On the server**, create an API key for secure remote access:

```bash
k8e sandbox-apikey create my-agent
# → {"name":"my-agent","key":"k8e-abc123..."}
```

**On the client**, download the standalone CLI, log in, and install the skill:

```bash
# 1. Download the platform-specific binary (~44MB)
#    k8e-sandbox-cli-linux-amd64 / linux-arm64 / darwin-amd64 / darwin-arm64 / windows-amd64.exe
curl -sLO https://github.com/xiaods/k8e/releases/latest/download/k8e-sandbox-cli-linux-amd64
chmod +x k8e-sandbox-cli-linux-amd64

# 2. Symlink the plain command name to the downloaded file (do not rename)
ln -s k8e-sandbox-cli-linux-amd64 k8e-sandbox-cli

# 3. Connect: mTLS auth + install /k8e-sandbox skill into Claude/Codex/Pi
#    Note: --endpoint and --apikey are global flags, placed before the subcommand
./k8e-sandbox-cli --endpoint <server-ip>:50051 --apikey k8e-abc123... connect
```

Platform binaries: `k8e-sandbox-cli-{darwin,linux,windows}-{amd64,arm64}` (Windows: `k8e-sandbox-cli-windows-amd64.exe`, symlink via `mklink k8e-sandbox-cli.exe k8e-sandbox-cli-windows-amd64.exe`)

> **One binary, two names:** the downloaded `k8e-sandbox-cli-linux-amd64` file **is** the `k8e-sandbox-cli` command the skill uses — the symlink is just a plain-name alias to the same file. `connect` installs the `/k8e-sandbox` skill, so every skill example (`k8e-sandbox-cli run ...`) is the same file you just downloaded.

Then in your agent harness:

```text
/k8e-sandbox <goal>
```

Or ask naturally: *"Run this Python snippet in a sandbox"* — the skill drives `k8e-sandbox-cli run`.

### Available Commands

### Command · Description
- **Command**: `k8e-sandbox-cli --profile <name> …` · **Description**: Use named profile from `~/.k8e/sandbox/profiles.yaml` (KIP-17; not `/etc/k8e/config.yaml`)
- **Command**: `k8e-sandbox-cli connect` · **Description**: Connect local/remote gateway and install `/k8e-sandbox` agent skill
- **Command**: `k8e-sandbox-cli connect --skill-only` · **Description**: Re-install agent skill only (no gateway dial)
- **Command**: `k8e-sandbox-cli login` · **Description**: Authenticate only (mTLS cert; no skill install)
- **Command**: `k8e-sandbox-cli run <code>` · **Description**: Run code or shell command (auto-creates/manages session)
- **Command**: `k8e-sandbox-cli status` · **Description**: Check sandbox service availability and current session
- **Command**: `k8e-sandbox-cli create` · **Description**: Create a new session (custom runtime, egress, manifest, git-repo)
- **Command**: `k8e-sandbox-cli destroy <sid>` · **Description**: Destroy a session and free resources
- **Command**: `k8e-sandbox-cli write <sid> ` · **Description**: Write file to `/workspace` (content via stdin)
- **Command**: `k8e-sandbox-cli read <sid> ` · **Description**: Read file from `/workspace`
- **Command**: `k8e-sandbox-cli list <sid>` · **Description**: List files in `/workspace` (filter by `--since` timestamp)
- **Command**: `k8e-sandbox-cli subagent ` · **Description**: Spawn child sandbox under parent session (max depth 1)
- **Command**: `k8e-sandbox-cli confirm <sid> <action>` · **Description**: Gate irreversible action on human approval
- **Command**: `k8e-sandbox-cli approve <approval-id>` · **Description**: Approve a pending confirm request
- **Command**: `k8e sandbox-apikey create <name> [--ttl 30d\ · **Description**: never]` · Create API key (default TTL **30 days**)
- **Command**: `k8e sandbox-apikey list` · **Description**: List API key names + expiry (secrets not shown)
- **Command**: `k8e sandbox-apikey delete <name>` · **Description**: Delete an API key (server-side)

See [pkg/sandboxcli/skills/k8e-sandbox/SKILL.md](pkg/sandboxcli/skills/k8e-sandbox/SKILL.md) and [docs/kip-17-sandbox-cli-profiles-and-apikey-ttl.md](docs/kip-17-sandbox-cli-profiles-and-apikey-ttl.md).

### Quick Examples

```bash
# Run Python code (auto-creates session)
k8e-sandbox-cli run "print('hello')" --lang python

# Shell command (default lang=bash)
k8e-sandbox-cli run "ls -la /workspace"

# TypeScript — type annotations run via tsx
k8e-sandbox-cli run "const nums: number[] = [1, 2, 3]; console.log(nums.reduce((a, b) => a + b, 0))" --lang ts

# Multi-line TypeScript via stdin (interfaces, async/await)
k8e-sandbox-cli run --lang ts <<'EOF'
interface User { name: string; age: number }

async function oldest(users: User[]): Promise<User> {
  return users.reduce((a, b) => (a.age > b.age ? a : b));
}

const users: User[] = [{ name: "Ada", age: 36 }, { name: "Linus", age: 54 }];
oldest(users).then((u) => console.log(`Oldest: ${u.name} (${u.age})`));
EOF

# Multi-line via stdin
k8e-sandbox-cli run --lang python <<'EOF'
for i in range(10):
    print(i)
EOF

# Default egress: pypi.org, files.pythonhosted.org, registry.npmjs.org,
#   objects.githubusercontent.com, github.com, raw.githubusercontent.com
SID=$(k8e-sandbox-cli create | jq -r .session_id)
k8e-sandbox-cli write $SID /workspace/script.py <<'PYEOF'
import pandas as pd
print(pd.__version__)
PYEOF
k8e-sandbox-cli run "pip install pandas" --session-id $SID
k8e-sandbox-cli run "python3 /workspace/script.py" --session-id $SID

# Create session with custom runtime and egress
SID=$(k8e-sandbox-cli create --runtime firecracker --allowed-hosts pypi.org,github.com | jq -r .session_id)

# Clone git repo at session creat