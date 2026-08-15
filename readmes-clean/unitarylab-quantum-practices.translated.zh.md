![Quantum-Practices — 量子算法最佳实践](docs/social-preview.png)

# ⚛ Quantum-Practices

  量子算法最佳实践
  量子算法最佳实践

  ·

## 英语

###这是什么？

**Quantum-Practices** 是用于量子算法最佳实践的 DeepSeek Harness 工具包。它通过只读的面向模型的工具为 DeepSeek Harness 代理提供结构化、可审查的指导。

作为 DeepSeek Harness 插件，它注册了一个只读 `quantum_practices` 工具，用于从不可变的构建时目录中列出、搜索和阅读打包的量子算法实践指南。

Quantum-Practices 基于并改编自 GitHub 项目 [unitarylab/quantum-skills](https://github.com/unitarylab/quantum-skills)。原项目提供量子算法指导语料库；该存储库将该基础重新构建为 DeepSeek Harness 工具包，并生成只读练习目录。

### ✨ 主要特点

- **渐进式披露** — 根 `SKILL.md` 是轻量级的；算法和模拟器指南仅在需要时加载。
- **DeepSeek Harness 工具包** — `quantum_practices` 公开 `list`、`search` 和 `get`，而不执行代码。
- **只读运行时** — 无网络、子进程、文件系统写入、Python 执行、凭据或本机代码。
- **最佳实践覆盖** - 原语、线性系统、密码学、哈密顿模拟、薛定谔化、本征解算器、梯度、量子机器学习、状态准备和量子纠错。
- **多模拟器支持** — UnitaryLab（推荐）、Qiskit 和 PennyLane，具有明确的选择规则。
- **GitHub 来源语料库** — 练习指南仅从公共 GitHub 上游同步。
- **教育友好** — 适合概念解释、电路设计、代码审查和动手演示。

### 🌟 涵盖的算法

### 类别·算法
- **类别**：**原语** · **算法**：Grover、QPE、Hadamard 测试、Hadamard 变换、幅度放大、幅度估计
- **类别**：**线性系统** · **算法**：HHL、LCU、AQC、VQLS、QSVT-QLSA、QFT、量子信号处理 (QSP)
- **类别**：**密码学** · **算法**：Shor 算法、离散对数、Simon 算法
- **类别**：**哈密尔顿模拟** · **算法**：嘉当分解、Trotter、QDrift、泰勒级数、QSP
- **类别**：**薛定谔化** · **算法**：平流、热（1D/2D）
- **类别**：**特征求解器** · **算法**：NumPyEigensolver、VQD
- **类别**：**梯度** · **算法**：参数平移、有限差分、线性组合、SPSA、反向模式、QFI
- **类别**：**量子机器学习** · **算法**：VQE、VQC、QAOA、QCBM、CVQNN、Fermi-Hubbard VQE
- **类别**：**状态准备** · **算法**：Mottonen、MPS、多路复用器、泡利、叠加
- **类别**：**量子纠错** · **算法**：qLDPC、CSS 代码、超图产品代码

### 💻 支持的模拟器

### 模拟器 · 何时使用 · 平台
- **模拟器**：**UnitaryLab** *（默认）* · **何时使用**：学习、算法演示、PDE 工作流程 · **平台**：Win / macOS / Linux
- **模拟器**：**Qiskit** · **何时使用**：噪声模型、IBM 硬件工作流程 · **平台**：Win / macOS / Linux
- **模拟器**：**PennyLane** · **何时使用**：可微混合优化 · **平台**：Win / macOS / Linux

### 📁 存储库结构

```
quantum-practices/
|
+-- SKILL.md                    # Root practice index used by the catalog
+-- README.md
+-- package.json                # DeepSeek Harness tool-bundle metadata
+-- cordis.patch.yml            # Profile Bundle patch
+-- src/                        # DSH plugin source
+-- lib/                        # Built release artifact
|
+-- algorithms/                 # Quantum algorithm skills
|   +-- primitives/             # Grover, QPE, Hadamard test/transform, AA, AE
|   +-- linear-systems/         # HHL, LCU, AQC, VQLS, QSVT-QLSA, QFT, QSP
|   +-- cryptography/           # Shor, discrete logarithm, Simon
|   +-- hamiltonian-simulation/ # Cartan, Trotter, QDrift, Taylor, QSP
|   +-- schrodingerization/     # Advection and heat-equation workflows
|   +-- eigensolvers/           # NumPyEigensolver, VQD
|   +-- gradients/              # Parameter-shift, finite-diff, SPSA, reverse, QFI
|   +-- quantum-machine-learning/ # VQE, VQC, QAOA, QCBM, CVQNN
|   +-- state-preparation/      # Mottonen, MPS, multiplexer, Pauli, superposition
|   +-- quantum-error-correction/ # qLDPC, CSS codes
|
+-- simulators/                 # Simulator selection & installation guides
    +-- unitarylab/             # Recommended simulator guide
    +-- qiskit/
    +-- pennylane/
```

### DeepSeek Harness 插件

对于大多数用户来说，将 Quantum-Practices 安装到您使用的 DeepSeek Harness 配置文件中，然后让您的代理在回答量子算法问题之前咨询 Quantum-Practices。

如果您使用 Web UI：

```bash
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile web add \
  github:unitarylab/quantum-practices#main
```

安装后重启DeepSeek Harness Web。

如果您使用无头 CLI：

```bash
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile headless add \
  github:unitarylab/quantum-practices#main
```

对于本地开发，直接安装这个checkout：

```bash
dsh plugin --profile web add "/path/to/quantum-practices"
dsh plugin --profile headless add "/path/to/quantum-practices"
```

如需审查或发布证据，请将 `main` 替换为固定的 40 字符提交 SHA。

验证配置文件是否包含插入的行：

```bash
dsh --profile headless --dump-config | \
  rg "tool-quantum-practices|dsh-unitarylab-quantum-practices"
```

预期输出：

```text
# == dsh-unitarylab-quantum-practices
- id: tool-quantum-practices
  name: dsh-unitarylab-quantum-practices
```

运行功能测试：

```bash
npx @deepseek-ai/dsh@0.1.0-rc.6 --profile headless \
  "Use the quantum_practices tool to find the HHL practice guide and explain the required matrix constraints."
```

安装完成后，用户自然可以询问。该模型应在后台调用 `quantum_practices`：

```text
Use Quantum-Practices to review HHL before explaining the matrix constraints on A.
Before writing Grover code, check Quantum-Practices and list the common implementation pitfalls.
Use Quantum-Practices to compare quantum phase estimation and the quantum Fourier transform.
Consult Quantum-Practices and recommend a simulator for a variational quantum algorithm.
Check Quantum-Practices and explain how Trotter and QDrift differ for Hamiltonian simulation.
```

By default, `get` returns a brief, token-conscious view with the most relevant sections. The model should request `detail="full"` only when the user needs full implementation notes, complete examples, or debugging context.

Developers can also inspect the tool contract directly:

```text
quantum_practices(action="list")
quantum_practices(action="search", query="HHL linear system")
quantum_practices(action="get", id="algorithms/linear-systems/hhl")
quantum_practices(action="get", query="Explain HHL matrix constraints")
quantum_practices(action="get", query="Implement HHL with a 2x2 example", detail="full")
```

The DSH plugin never executes `algorithms/**/scripts/*.py` and never installs or imports Python dependencies.

### Build and Verify

```bash
npm ci
npm run check
npm pack --dry-run --json
```

`npm run build` regenerates `src/generated/skill-catalog.ts` and compiles the committed `lib/` release artifact.

### Python Runtime

Quantum-Practices does not ship a root `requirements.txt`, bundled wheels, or a Python runtime. Any Python setup belongs to the separate project where you choose to run generated examples; it is not part of the DeepSeek Harness plugin install path.

## Attribution

Quantum-Practices is a derivative adaptation of [unitarylab/quantum-skills](https://github.com/unitarylab/quantum-skills). See [NOTICE](NOTICE) for attribution details.

## 中文

### 这是什么？

**Quantum-Practices** 是一个面向量子算法最佳实践的 DeepSeek Harness 工具包。它通过一个只读模型工具，为 DeepSeek Harness Agent 提供结构化、可审查的量子算法实践指南。

作为 DeepSeek Harness 插件，它注册一个只读 `quantum_practices` 工具，用于从构建期固化的 Practice Catalog 中列出、搜索和读取量子算法实践指南。

Quantum-Practices 基于 GitHub 项目 [unitarylab/quantum-skills](https://github.com/unitarylab/quantum-skills) 进行二次创作。原项目提供了量子算法指南语料；本仓库在此基础上改造为 DeepSeek Harness 工具包，并生成只读的 Practice Catalog。

### ✨ 核心特性

- **渐进式加载** — 根 `SKILL.md` 轻量，算法与模拟器指南仅在需要时才加载。
- **DeepSeek Harness 工具包** — `quantum_practices` 提供 `list`、`search`、`get`，不执行代码。
- **只读运行时** — 无网络、无 subprocess、无写盘、无 Python 执行、无 credentials、无 native code。
- **最佳实践覆盖** — 基元、线性系统、密码学、哈密顿量模拟、Schrodingerization、本征求解器、梯度方法、量子机器学习、态制备与量子纠错一应俱全。
- **多模拟器支持** — UnitaryLab（推荐）、Qiskit、PennyLane，附明确选型规则。
- **GitHub 来源语料** — Practice guides 仅从公开 GitHub 上游同步。
- **教学友好** — 适用于概念解释、电路设计、代码审查和动手实验。

### 🌟 算法覆盖范围

### 分类 · 算法
- **分类**: **基础量子算法** · **算法**: Grover、QPE、Hadamard