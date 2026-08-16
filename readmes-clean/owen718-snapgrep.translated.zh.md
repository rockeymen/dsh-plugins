#snapgrep

  进程内三元组索引，可在 [Pi](https://github.com/earendil-works/pi) 中进行代码搜索
  在热索引上通常比 ripgrep 快 40–70 倍 —
  每个结果都会根据 ripgrep 进行逐字节检查。

  ![终端演示：ripgrep 需要 147.7 毫秒来搜索 17 MB 存储库，而 snapgrep 需要 2.1 毫秒，绘制到真实比例](assets/demo.gif)

  没有边车进程。没有守护进程。代理进程内加载的单个 3.2 MB 本机插件。

## 安装

### 圆周率

```sh
npm install -g snapgrep
```

Pi 的内置 `grep` 在每个项目中都会自动替换。要进行确认，请让 Pi 搜索您知道存在的字符串 - 工具详细信息显示 `actualBackend: kernel`。

### 哦我的圆周率 (omp)

```sh
npm install -g snapgrep
```

相同的包，没有变化：omp 将 `@earendil-works/pi-coding-agent` 视为别名范围，并且其加载程序接受 `.pi` 目录以及 `.omp`。

### DeepSeek Harness (dsh)

```sh
dsh plugin --profile headless add snapgrep
```

用`dsh --profile headless --dump-config | grep snapgrep`验证。

它取代了 `grep` 和 `glob`：注册表完全拒绝重复的工具名称，因此内置搜索行被禁用，并且该插件提供两者。 `glob` 运行与内置函数相同的 ripgrep 调用。

仅下载您的计算机可以运行的插件 - 大约 1.2 MB，两个包。没有编译任何内容，也没有启动守护进程。

为 macOS（Apple Silicon 和 Intel）、Linux（x64 和 arm64、glibc）和 Windows x64 预构建。 Alpine/musl 尚未建成；在不受支持的平台上，扩展会命名它无法找到的确切文件，而不是默默地失败。

其他安装方式——无 npm、单个项目或每台机器一个副本

如果没有 npm，脚本会从 [最新版本 ](https://github.com/Owen718/snapgrep/releases/latest) 中获取匹配的存档并安装到 `~/.pi/agent/extensions` 中：

```sh
curl -fsSL https://raw.githubusercontent.com/Owen718/snapgrep/main/install.sh | sh
```

设置`PI_EXTENSIONS_DIR`安装在其他地方。对于可在任何计算机上运行的目录，同一版本中的 `snapgrep-extension-all-platforms.tar.gz` 包含所有五个插件，并在加载时选择正确的一个。

进入单个项目而不是全局：

```sh
git clone https://github.com/Owen718/snapgrep.git

mkdir -p /path/to/your-project/.pi/extensions
cp -R snapgrep/artifacts/pi-extension/pi-fast-grep /path/to/your-project/.pi/extensions/

cd /path/to/your-project
pi --approve
```

`--approve` 仅在第一次需要信任项目级扩展。该工件带有一个范围为其自己目录的 `.gitignore`，因此安装它不会使您的存储库变脏。

从源代码构建：`npm run build:kernel && npm run package:extension`。

中文安装说明见[安装说明.md](artifacts/pi-extension/pi-fast-grep/安装说明.md)。

## 为什么存在

编码代理不断搜索。大型存储库中的每个 `grep` 调用都意味着 ripgrep 会再次读取磁盘上的每个字节 - 数百毫秒，每分钟几次，永远。

索引支持的搜索解决了这个问题，但通常的答案是一个 sidecar 守护进程（Zoekt 以及其上构建的所有内容）：另一个在漂移时启动、监督、保持同步和调试的进程。对于不断启动和停止的 CLI 代理来说，这需要大量的机器。

snapgrep将整个索引放在代理自己的进程中。 Rust 通过 git 快照构建和查询三元组索引； Node通过N-API调用它。启动到第一个查询大约需要半秒，并且索引小于它索引的代码。

## 测量结果

所有数字均为 P50，经过 3 次预热、内核和 ripgrep 在同一运行中交替、在具有相同查询参数和输出限制的同一存储库快照上进行 7 次测量迭代。

### 反对 ripgrep

### 查询 · snapgrep · ripgrep · 加速
- **查询**：稀有令牌，4,000 个文件中的 1 个匹配 · **snapgrep**：0.120 毫秒 · **ripgrep**：230.8 毫秒 · **加速**：**1921×**
- **查询**：转义正则表达式，1,200 个匹配文件 · **snapgrep**：3.188 毫秒 · **ripgrep**：220.2 毫秒 · **加速**：**69×**
- **查询**：17 MB 存储库中的 `createServer` · **snapgrep**：2.065 毫秒 · **ripgrep**：147.7 毫秒 · **加速**：**72×**
- **查询**：`defineConfig`，186 个候选文件 · **snapgrep**：2.574 毫秒 · **ripgrep**：142.9 毫秒 · **加速**：**56×**
- **查询**：`import\.meta`，538 个候选文件 · **snapgrep**：4.179 毫秒 · **ripgrep**：156.5 毫秒 · **加速**：**37×**
- **查询**：路径过滤搜索 · **snapgrep**：0.973 毫秒 · **ripgrep**：8.0 毫秒 · **加速**：**8×**

### 加速消失的地方

加速来自“不读取文件”，因此它会跟踪 ripgrep 必须打开的文件数量。如果将该数字推至极限，优势就会消失。来自在 Linux、单核、20 MB/5,001 个文件的存储库上独立运行：

### 场景 · snapgrep · ripgrep · 加速
- **场景**：每个文件匹配（5,001 个文件） · **snapgrep**：6.98 毫秒 · **ripgrep**：18.5 毫秒 · **加速**：**2.6×**
- **场景**：300个文件匹配 · **snapgrep**：0.22毫秒 · **ripgrep**：14.1毫秒 · **加速**：63.5×
- **场景**：一个文件匹配（稀有令牌） · **snapgrep**：0.006 ms · **ripgrep**：14.2 ms · **加速**：2458×

**当每个文件都匹配时，索引就没有什么可跳过的，而 2.6× 就是它能获胜的全部。** 这是在 JavaScript 存储库中规划像 `function` 这样的查询的数字。四位数是另一个极端：ripgrep 必须扫描整个树以证明标记出现一次，而索引则从发布列表中进行回答。

大多数真实代理搜索位于中间 - 几十到几百个文件中的符号名称。

### 对阵 Zoekt

Zoekt 是参考索引支持引擎。 snapgrep 从其索引提供的每个查询的速度至少是原来的两倍（在同一运行中针对 Zoekt 进行测量）：

### 查询 · snapgrep · Zoekt · 比率
- **查询**：全局过滤器 `*.yaml`，800 个文件 · **snapgrep**：1.533 毫秒 · **Zoekt**：70.4 毫秒 · **比率**：0.022
- **查询**：不区分大小写，500 个文件 · **snapgrep**：3.003 毫秒 · **Zoekt**：51.8 毫秒 · **比率**：0.058
- **查询**：全局过滤器 `*.ts` · **snapgrep**：3.053 毫秒 · **Zoekt**：14.8 毫秒 · **比率**：0.206
- **查询**：不区分大小写 `defineConfig` · **snapgrep**：4.806 毫秒 · **Zoekt**：13.8 毫秒 · **比率**：0.347

Zoekt 的每次查询成本主要由 HTTP 传输、JSON 解码和跨进程边界的重新验证决定。删除进程边界就删除了所有这三个边界。

### 足迹

### · 合成 17.0 MB 语料库 · 真实 17.4 MB 存储库
- 索引大小 · **合成 17.0 MB 语料库**：6.5 MB（0.38× 源） · **真实 17.4 MB 存储库**：15.9 MB（0.91× 源）
- 冷启动第一个查询 · **合成 17.0 MB 语料库**：662 毫秒 · **真实 17.4 MB 存储库**：508 毫秒
- 驻留进程 · **合成 17.0 MB 语料库**：0 · **真实 17.4 MB 存储库**：0

## 为什么要定制内核

并不是因为三元组算法很新颖。事实并非如此——Zoet 多年来一直在这方面做得很好，并且该项目在每一个可接受的变更上都与 Zoekt 进行了比较。

原因是购买索引就意味着购买它的流程边界，而边界的成本比搜索还要高。以下是 Zoekt 在 vite 语料库上最慢的查询实际花费了 18.32 毫秒的时间：

### 舞台·时间·分享
- **阶段**：Zoekt自己的搜索 · **时间**：1.24 ms · **分享**：7%
- **阶段**：HTTP 传输 + JSON 解码 · **时间**：3.58 毫秒 · **分享**：20%
- **阶段**：验证（主要是`rg`进程启动） · **时间**：8.34 ms · **份额**：45%
- **阶段**：本地合并和分类 · **时间**：5.14 ms · **份额**：28%

**搜索本身占账单的 7%。** 另外 93% 是索引在其他地方的成本：序列化查询、跨套接字、解码 JSON，然后生成 ripgrep 来重新读取索引已在内存中的文件。在这台机器上，单个 ripgrep 生成的下限约为 6 毫秒——仅此一项就超过了整个搜索。

拥有内核可以让 93% 消失：

- **索引映射到代理自己的内存中。** 没有套接字，没有 JSON，没有序列化。查询是一个函数调用。
- **验证读取 mmap 索引，而不是磁盘。** 候选者在进程中针对已驻留的字节进行确认，因此不会产生，也不会进行第二次读取。
- **不支持的查询可能会失败关闭而不是近似。**这不是性能参数，而是通用库不够的原因。早期的尝试使用现成的文件查找器来选择候选者；在 Linux 内核树上，它返回了 17,767 个文件，而 ripgrep 找到了 17,772 个文件。嵌套 `.gitignore` 重新包含规则中的五个丢失文件 - 最终的 ripgrep 传递只能删除额外的结果，而永远不会恢复候选阶段已删除的结果。当召回边界是别人的实现细节时，你无法证明它，也无法修复它。
- **索引格式针对这种数据形状进行了调整** — 压缩内容块、delta-varint gram 元数据 — 这就是索引如何达到 0.38–0.91× si