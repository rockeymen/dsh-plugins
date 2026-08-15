#VOCALOID MCP

> 一个代理原生制作桥梁，用于作曲、调整、渲染、混合和审核原生 VOCALOID3/4 项目 — **只是为了好玩**而构建。

![48小节冷启动作曲：工程通过，人类聆听仍发现音乐差距](docs/assets/ame-semi-no-aida-arrangement-map.svg)

该存储库允许编码代理从空的时间线或创意简介开始，并完成以下工作：

```text
intent
  → theory / form / harmony / melody
  → Japanese note allocation
  → native IA delivery
  → arrangement
  → original VOCALOID3 Editor rendering
  → isolated stems / mix / master / QC
  → VSQX + hash-bound creative record
```

它不是 MIDI 到 VSQX 转换器，也不是一键热门歌曲生成器。音符、歌词、音素、音符表达、颤音和 VOCALOID 控制曲线编译成原生 VSQ3/VSQ4 结构。获得许可的原始编辑仍然具有综合权威。

该项目已经证明，代理可以成为有用的作曲家助理、制作工程师和实验合作伙伴。它没有**设计的味道或“完美的歌曲”。我们最新的技术上有效的 190 BPM IA_ROCKS 测试仍然得到了诚实的人类结论：人声被伴奏掩盖，结果并不真正感觉像摇滚。

这种区别就是一个特征。

## 实际证明了什么

- 从零开始创建原生 VSQ3/VSQ4 项目，无需复制源项目。
- 使用 Yamaha 的模式和哈希固定的本机 `Vsq3.dll` 加载器探针进行验证。
- 通过原始VOCALOID3编辑器渲染选定的本地授权歌手。
- 歌手替换和可疑的跨组件探针碰撞失败。
- 用明确的假名读法、手动支持的音素、音节分配、休止符、旋律和小 `っ` 计时选择来创作日语歌词。
- 将高级发音、动态、音色、颤音和音高手势编译为原生音符风格和控制曲线。
- 维护修订后的规范歌曲清单，具有稳定的 ID、试运行、有限编辑、历史记录和单独的内容/作曲/混合哈希。
- 渲染多乐器伴奏、独立的人声/乐器主干、确定性效果链、部分自动化、混音、预览、A/B 对和母带。
- 测量 LUFS、LRA、样本/真实峰值、削波、通道平衡、得分/渲染音调、定时、释放和颤音证据。
- 运行确定性音乐理论和编曲诊断，而不让规则或语料库数据组成下一个音符。
- 在以下方面保留简洁、哈希链式的创意决策：

  ```text
  intent → theory → note allocation → IA delivery → arrangement
  ```

- 使用一个固定提示加上一个严格的每首歌曲意图文件，将工作流程转移到真正新鲜的 Codex 会话。

当前自动结果：

```text
102 tests discovered
100 passed
2 intentionally skipped by environment
0 failed
```

## 重要的非声明

通过每一个工程关卡并不意味着一首歌在音乐上是成功的。

### 工程可以建立·工程无法决定
- **工程可以建立**：VSQX在结构上有效·**工程无法决定**：旋律令人难忘
- **工程可以建立**：请求的歌手呈现非静音音频·**工程无法决定**：表演感觉生动
- **工程可以建立**：原生控制已具体化·**工程无法决定**：调整很有品味
- **工程可以建立**：交付是最新且未剪辑的 · **工程无法决定**：IA 正确地参与混合
- **工程可以建立**：该短语避免了具体的理论风险 · **工程无法决定**：该短语说出了听众需要听到的内容
- **工程可以建立**：190 BPM 的安排是稳定的 · **工程无法决定**：实际上感觉像摇滚

## 阅读故事

每篇长篇文章都有繁体中文和英文版本。繁体中文版本是主要的、更个人化的叙述；英文版为更广泛的受众保留了相同的技术主张。

###文章·繁体中文·English
- **文章**：本机工程深入研究 · **繁体中文**：[从空白时间线到一首完成的 VOCALOID 歌曲](blogs/from-blank-timeline-to-finished-vocaloid-song.md) · **英文**：[从空白时间线到完成的 VOCALOID 歌曲](blogs/from-blank-timeline-to-finished-vocaloid-song.en.md)
- **文章**：意图、理论和新鲜的代理作文 · **繁体中文**：[从「它能唱」到「我希望 IA 在这一句唱出什么？」](blogs/from-can-it-sing-to-what-should-ia-sing.md) · **英文**：[来自“它能唱歌吗？”到“这句台词IA应该唱什么？”](blogs/from-can-it-sing-to-what-should-ia-sing.en.md)
- **文章**：有趣的整个项目故事 · **繁体中文**：[叫我们一个编码代理来制作VOCALOID，然后事情失控了](blogs/just-for-fun-we-taught-a-coding-agent-to-make-vocaloid-songs.md) · **英文**：[我们告诉一个编码代理制作VOCALOID歌曲](blogs/just-for-fun-we-taught-a-coding-agent-to-make-vocaloid-songs.en.md)

## 架构

````文本
                         创意/控制飞机

严格的意图文件+固定的座席工作流程+听力问题
                                   │
                                   ▼
          22工具制作MCP简介+14个核心资源
                       + 1 个可选的本地歌词资源
             类型化模式 │ 试运行 │ 预检 │ 有界提案
                                   │
                                   ▼
                         规范 *.song.json
       意图│时间线│和声│人声│编曲│混音│回顾
                                   │
                    ┌──────────────┴──────────────┐
                    ▼ ▼
            母语人声平面 乐器平面
          VSQ3/VSQ4 编译器模式扩展
        XSD + 原生加载器探针 FluidSynth / SF2
          VOCALOID3 编辑器每轨主干
                    └──────────────┬──────────────┘
                                   ▼
                         音频制作专机
             对齐→效果→自动化→求和→主控
                                   │
                                   ▼
                          证据/交付
           散列 │ 依赖关系 │ 历史 │ 日志 │ 预览 │ QC
```

VSQX is a native Editor artifact, not the sole database. The canonical manifest retains information that VSQX does not naturally own: renderer choices, mix chains, artifact dependencies, reviews, intent, and mutation history.

## Creative boundaries

### Intent comes before score

The canonical `vocaloid-composition-intent/v1` contract can declare song, section, and anchor-phrase purpose before any note exists. A phrase direction carries one listening question and can later bind to stable score, tuning, harmony, and arrangement objects.

### Theory is a guardrail

The deterministic `core/v1` analyzer distinguishes structural errors, musical risks, and style observations. It can find timeline contradictions, breath pressure, unresolved tones, voice collisions, register crowding, and arrangement redundancy. It does not infer that a phrase is moving, “IA-like,” or good.

### Phrase grammar is not a melody template

The optional DSL provides versioned role, entry, contour, rhythm, motion, cadence, development, allocation, articulation, and space vocabulary. Bundles are unordered option pools with `melody_material=absent`。他们从不编制音高序列或提供下一个音符。

### 本地 IA 库位于生产运行时之外

制作代理无法查询本地歌曲路径、标题、每首曲目的特征、最近的邻居、参考旋律、延续或创作后百分位数拟合。离线图书馆工作可能只会激发人工审查的、非重构性的短语语法词汇。

## 冷启动组合

这些跟踪的包包含规范清单快照、仅附加创意日志、可读报告和摘要绑定索引。最终的 WAV 文件仅保留在本地。

### 作曲·声音·音阶·录音
- **作曲**：`朝がほどく前に` · **声音**：IA_ROCKS · **规模**：28秒意图优先演示，11个决定 · **记录**：[记录](artifacts/creative-records/asa-ga-hodoku-mae-ni-20260719-a/)
- **作曲**：`遠い灯、青い夜` · **声音**：IA_ROCKS · **音阶**：2:10 冷启动歌曲，13 个决定 · **录音**：[record](artifacts/creative-records/tooi-hi-aoi-yoru-ia-20260719-a/)
- **作曲**：`風は名を呼ばない` · **声音**：原创IA · **音阶**：3:10新鲜特工歌曲，23个决定 · **录音**：[record](artifacts/creative-records/kaze-wa-na-o-yobanai-ia-20260719/)
- **作曲**：`雨と蝉のあいだ` · **声音**：IA_ROCKS · **音阶**：64 秒，190 BPM，24 个决定 · **记录**：[记录](artifacts/creative-records/natsu-ame-semi-ia-rocks-20260719/)

无需本地音频工作区即可安全发布的本机项目位于 [`artifacts/vsqxs/`](artifacts/vsqxs/README.md).

## 快速明星