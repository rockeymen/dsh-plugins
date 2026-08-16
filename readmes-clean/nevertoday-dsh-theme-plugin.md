# dsh-theme-plugin

Chinese traditional colors as a **DeepSeek Harness theme pack**. 49 anchor colors × light/dark = **98 themes**, each writing the full token vocabulary (98 tokens: 89 `--dsw-*` plus 9 `--shiki-token-*` syntax slots) and clearing WCAG AA on all 3136 contrast assertions. Twelve of the anchors are marked as a curated shortlist.

  ![竹青 light: raw-silk paper, a green wash on the bubble, and a send button in the anchor green itself](https://raw.githubusercontent.com/nevertoday/dsh-theme-plugin/main/docs/img/theme-zhuqing-light.png)
  ![朱红 dark: sized-xuan paper in warm ink, a deep maroon wash, and a vermilion send button](https://raw.githubusercontent.com/nevertoday/dsh-theme-plugin/main/docs/img/theme-zhuhong-dark.png)
  
  ![群青 light: violet-tinted silk paper, a blue wash, and a blue send button](https://raw.githubusercontent.com/nevertoday/dsh-theme-plugin/main/docs/img/theme-qunqing-light.png)
  ![藤黄 dark: ochre paper in olive ink, an olive wash, and a gold send button](https://raw.githubusercontent.com/nevertoday/dsh-theme-plugin/main/docs/img/theme-tenghuang-dark.png)

  <sub>竹青 · light（素绢）  |  朱红 · dark（熟宣）群青 · light（雪青）  |  藤黄 · dark（赭纸）</sub>
  <sub>One anchor per paper family, same conversation in each. The most saturated patch on screen is always the color you picked.</sub>

## Install

```sh
npx -y @deepseek-ai/dsh plugin --profile web add dsh-theme-plugin@latest
npx -y @deepseek-ai/dsh --profile web          # boot → open http://127.0.0.1:3080/
```

This pulls the prebuilt bundle from npm — no clone, no build step. The `web` profile is created on first boot under `~/.dsh/profiles/web`.

- **Verify** — the browser console logs `registered 98/98 themes (49 light / 49 dark)`, and `dsh --profile web --dump-config` shows a `theme-zhongguo` row.
- **Update** — run the same `add` command again.
- **Uninstall** — `dsh plugin --profile web remove dsh-theme-plugin`

## Usage

Open **Settings → Traditional Colors** and pick a theme; it applies immediately. Themes also have deep links:

```
http://127.0.0.1:3080/#theme=zhuqing-light      # 竹青 light
http://127.0.0.1:3080/#theme=qunqing-dark       # 群青 dark
```

Changing the hash switches themes live. A deep link wins over your remembered pick. The remembered pick lives in `localStorage`, not in `settings.yaml`, so it does not follow you across devices.

### Four ways to find a theme

![The picker on its default view: all 49 anchors of the light branch, grouped into the four paper families](https://raw.githubusercontent.com/nevertoday/dsh-theme-plugin/main/docs/img/use-browse.png)
![The 凌晨 夜航 chip pressed: the list narrows to the eight dark-and-quiet themes, spanning all four paper families](https://raw.githubusercontent.com/nevertoday/dsh-theme-plugin/main/docs/img/use-tier.png)

Browse — opens on all 49 anchors of the current branch, grouped by paper family. Each row's chip is the theme's real paper, veil and focus, so the list previews itself.
By working mood — six chips read left to right as one day: 晨起 morning → 天亮 dawn. Pick `凌晨 夜航` and you get the eight dark-and-quiet themes, whatever their color.

![Typing the pinyin lv into the search box narrows the list to the twelve green themes](https://raw.githubusercontent.com/nevertoday/dsh-theme-plugin/main/docs/img/use-search.png)
![Curated only on the dark branch: twelve edited picks, the panel itself rendered in 竹青 dark](https://raw.githubusercontent.com/nevertoday/dsh-theme-plugin/main/docs/img/use-curated-dark.png)

Search — matches the Chinese name, its pinyin, the seal's name and the mood. Typing `lv` finds all twelve greens without switching keyboards.
Curated only — twelve edited picks covering all four papers and all six moods. Use it when 49 is too many; the panel is themed by the pack, so the dark branch looks like this.

The panel references nothing but `--dsw-*` tokens, which is why it changes color with your pick and doubles as a preview of whatever you are about to choose.

## Design: 纸 · 帘 · 印

Chinese painting does not start with color. It prepares the paper, washes over it, and signs last. These themes are built in that order, and the three characters name three layers.

**纸 Paper** — about 60% of the screen. The ground is not "the traditional color, lightened"; it is a different material. Four families — 素绢 raw silk, 熟宣 sized xuan, 雪青 violet-tinted silk, 赭纸 ochre paper — carry deliberately separated chroma (OKLab ≈ 0.010 / 0.019 / 0.015 / 0.024 respectively), so the four papers are told apart by eye and not only in the data. Light grounds sit at L ≈ 0.963–0.971: off-white rather than white, which is what leaves room for a raised surface above them.

**帘 Veil** — about 25%. The sidebar and message bubbles are the anchor color itself, undiluted by paper, held inside a band of 1.25–1.55 contrast against the paper so the wash can neither disappear nor harden into a slab. **You recognize which traditional color you are in by the bubbles, not by the background.**

**印 Seal** — **the focus is the anchor itself.** The primary button and the send button are the anchor pressed darker. This reverses the pack's original law, under which the primary button was filled by a curated *relative* of the anchor sitting a median 109° away in hue — so choosing 竹青 handed you a crimson call-to-action. That relative is still chosen, still recorded per theme as `sealName` / `sealRel` / `sealWhy`, and now appears only as the active-nav accent: a signature rather than a focus. The picker shows the reasoning ("茜红 · 策展印 · 冷暖对冲").

**Ink** — text, rules and secondary surfaces run down one ink ramp, the paper color pushed darker. Every `nb-XX` step of the base stylesheet becomes a tinted neutral of the same lightness, and hover offsets, elevation steps, borders and interaction alphas are copied verbatim: hue changes, relations do not. The ramp's two **endpoints** are the deliberate exception — those are set here rather than inherited, because the base stylesheet's are the extremes. Light and dark now share one shape: body 16.7–17.5, secondary 7.4–8.0, tertiary 4.6–5.5.

**Syntax** — the code block is where a programmer's eyes actually live, so the highlighter is themed too. The harness highlights through shiki's css-variables theme (nine `--shiki-token-*` slots), and every theme fills them: the five chromatic slots (keyword / string / constant / function / parameter) keep the hue conventions programmers already know, but each color is a real named color picked from the 742-color roster; when the anchor's hue falls within a slot's window, **the anchor itself plays that slot** — in 竹青 the strings are 竹青, in 群青 the constants are 群青. Comments and punctuation are ink, not color: the tertiary and secondary ink steps re-gated against the code-block ground. All nine slots clear 4.5 on that ground, and the five chromatic slots are asserted pairwise ≥ 15° apart in hue.

**Gates** — AA is a floor, and elegance lives at the ceiling, so most rules are two-sided. `pnpm check` re-derives every claim above from the emitted tokens: 3136 contrast rows, plus invariants for veil chroma, the single focus (both focus tokens must be the anchor's own hue and the most saturated patches on screen), syntax-slot hue separation, the anchor-on-stage rule, elevation direction, and full token coverage. It trusts nothing the generator says about itself.

**Six tiers** — 49 color names are not a usable set of options for someone who does not already know traditional colors, so every theme also carries a "how do I want to work today" tier. It is *derived*: the only inputs are the anchor's OKLab lightness, chroma and hue.

```
L < 0.50 ─┬─ C < 0.13 → 夜航 Night   (dark and quiet)
          └─ C ≥ 0.13 → 爆肝 Crunch  (dark and fierce)
C < 0.115 ──────────→ 禅定 Zen       (pale and quiet)
warm (h<120 or h≥315) ─┬─ L < 0.71 → 攻坚 Push  (warm and fierce)
                       └─ L ≥ 0.71 → 收工 Ship  (warm and bright)
cool ───────────────→ 心流 Flow      (cool and saturated)
```

The picker orders them as a programmer's day: Flow at dawn → Zen in the afternoon → Push in the evening → Crunch at midnight → Night in the small hours → Ship at daybreak → Flow again. Anchors land 心流 11 · 禅定 12 · 攻坚 8 · 爆肝 4 · 夜航 8 · 收工 6.

An earlier design gave each of five moods one representative theme, which left most rows in the picker with an empty tag — it read as missing data rather than restraint. As a partition the vocabulary stays at six words while every theme belongs to exactly one tier, so the tag has no holes and doubles as a filter. Six is this data's natural granularity: a seventh cut anywhere carves out a 1–3 theme sliver, at which point the label names a few themes rather than classifying them. The tier *names* are an editorial claim, but that is six claims rather than 49; `pnpm check` pins all four cuts with seven sentinels (群青→Flow, 碧螺春绿→Zen, 朱红→Push, 覆盆子红→Crunch, 满天星紫→Night, 黛紫→Night, 雄黄→Ship), so breaking the tree trips the gate while renaming a tier does not.

**Curation** — twelve of the 49 anchors carry a `curated` flag, reachable through **Curated only**. Both light and dark variants must contain no generator degradation. The list is derived in three passes: editorial seeds → **one per tier** (every tier must survive the narrowing, or its chip would have nothing to offer) → farthest-point sampling in OKLab up to twelve. Every top-up picks the anchor farthest from what is already chosen, so covering all six tiers costs nothing in spread.

Anchors per paper family: 素绢 12 · 熟宣 14 · 雪青 17 · 赭纸 6. Within one mode, the two closest themes still differ by ΔE 0.018 across the four signature dimensions (ground, brand, bubble, focus) against a 0.015 floor.

## Theme roster

49 anchors × light/dark = 98 themes — click to expand

⭐ marks the twelve curated anchors the picker shows first. Display names are `<name>·亮` / `<name>·暗`, e.g. `竹青·暗`. Paper families: 素绢 raw silk, 熟宣 sized xuan paper, 雪青 violet-tinted silk, 赭纸 ochre paper. The seal column is the curated relative described above — a signature mark, not the button color.

### Color · 中文 · Anchor · Paper · Seal · Theme ids (light / dark)
- **Color**: Zhu Qing · **中文**: 竹青 · **Anchor**: `#00A86B` · **Paper**: 素绢 · **Seal**: 茜红 · **Theme ids (light / dark)**: `zhuqing-light` / `zhuqing-dark`
- **Color**: Zhu Hong · **中文**: 朱红 ⭐ · **Anchor**: `#ED5126` · **Paper**: 熟宣 · **Seal**: 赭石 · **Theme ids (light / dark)**: `zhuhong-light` / `zhuhong-dark`
- **Color**: Qun Qing · **中文**: 群青 · **Anchor**: `#1772B4` · **Paper**: 雪青 · **Seal**: 枫叶红 · **Theme ids (light / dark)**: `qunqing-light` / `qunqing-dark`
- **Color**: Teng Huang · **中文**: 藤黄 · **Anchor**: `#FFD111` · **Paper**: 赭纸 · **Seal**: 瑶碧 · **Theme ids (light / dark)**: `tenghuang-light` / `tenghuang-dark`
- **Color**: Jiang Zi · **中文**: 绛紫 ⭐ · **Anchor**: `#8E354A` · **Paper**: 熟宣 · **Seal**: 洋葱紫 · **Theme ids (light / dark)**: `jiangzi-light` / `jiangzi-dark`
- **Color**: Zi Yun · **中文**: 紫云 · **Anchor**: `#A020F0` · **Paper**: 雪青 · **Seal**: 蜻蜓红 · **Theme ids (light / dark)**: `ziyun-light` / `ziyun-dark`
- **Color**: Mei Hong Se · **中文**: 玫红色 · **Anchor**: `#FF007F` · **Paper**: 熟宣 · **Seal**: 品红 · **Theme ids (light / dark)**: `meihongse-light` / `meihongse-dark`
- **Color**: Dan Shu Hong · **中文**: 淡曙红 · **Anchor**: `#EE2746` · **Paper**: 熟宣 · **Seal**: 殷红 · **Theme ids (light / dark)**: `danshuhong-light` / `danshuhong-dark`
- **Color**: Gan Qing · **中文**: 绀青 · **Anchor**: `#4F84FF` · **Paper**: 雪青 · **Seal**: 落霞 · **Theme ids (light / dark)**: `ganqing-light` / `ganqing-dark`
- **Color**: Mei Gui Zi · **中文**: 玫瑰紫 · **Anchor**: `#BA2F7B` · **Paper**: 熟宣 · **Seal**: 高粱红 · **Theme ids (light / dark)**: `meiguizi-light` / `meiguizi-dark`
- **Color**: Ying Wu Lü · **中文**: 鹦鹉绿 · **Anchor**: `#5BAE23` · **Paper**: 素绢 · **Seal**: 猩红 · **Theme ids (light / dark)**: `yingwulv-light` / `yingwulv-dark`
- **Color**: Bo Luo Hong · **中文**: 菠萝红 · **Anchor**: `#FC7930` · **Paper**: 熟宣 · **Seal**: 芙蓉红 · **Theme ids (light / dark)**: `boluohong-light` / `boluohong-dark`
- **Color**: Fu Pen Zi Hong · **中文**: 覆盆子红 ⭐ · **Anchor**: `#AC1F18` · **Paper**: 熟宣 · **Seal**: 苋菜红 · **Theme ids (light / dark)**: `fupenzihong-light` / `fupenzihong-dark`
- **Color**: Cang Bi · **中文**: 苍碧 · **Anchor**: `#2A52BE` · **Paper**: 雪青 · **Seal**: 猩红 · **Theme ids (light / dark)**: `cangbi-light` / `cangbi-dark`
- **Color**: Xiong Huang · **中文**: 雄黄 ⭐ · **Anchor**: `#FF9900` · **Paper**: 赭纸 · **Seal**: 绀青 · **Theme ids (light / dark)**: `xionghuang-light` / `xionghuang-dark`
- **Color**: Hu Po Huang · **中文**: 琥珀黄 · **Anchor**: `#FEBA07` · **Paper**: 赭纸 · **Seal**: 绀青 · **Theme ids (light / dark)**: `hupohuang-light` / `hupohuang-dark`
- **Color**: Wei Zi · **中文**: 魏紫 · **Anchor**: `#7E1671` · **Paper**: 雪青 · **Seal**: 魏紫·深 · **Theme ids (light / dark)**: `weizi-light` / `weizi-dark`
- **Color**: Gan Lan Huang Lü · **中文**: 橄榄黄绿 · **Anchor**: `#BEC936` · **Paper**: 素绢 · **Seal**: 魏紫 · **Theme ids (light / dark)**: `ganlanhuanglv-light` / `ganlanhuanglv-dark`
- **Color**: Huo Zhuan Hong · **中文**: 火砖红 · **Anchor**: `#CD6227` · **Paper**: 熟宣 · **Seal**: 淡可可棕 · **Theme ids (light / dark)**: `huozhuanhong-light` / `huozhuanhong-dark`
- **Color**: Xiang Ye Hong · **中文**: 香叶红 · **Anchor**: `#F07C82` · **Paper**: 熟宣 · **Seal**: 鹅冠红 · **Theme ids (light / dark)**: `xiangyehong-light` / `xiangyehong-dark`
- **Color**: Yan Ying Zi · **中文**: 烟萦紫 · **Anchor**: `#8A4B9C` · **Paper**: 雪青 · **Seal**: 烟萦紫·深 · **Theme ids (light / dark)**: `yanyingzi-light` / `yanyingzi-dark`
- **Color**: Mei Ge · **中文**: 韎韐 · **Anchor**: `#A5441B` · **Paper**: 熟宣 · **Seal**: 蟹蝥红 · **Theme ids (light / dark)**: `meige-light` / `meige-dark`
- **Color**: Li Shou · **中文**: 綟绶 · **Anchor**: `#6B8E23` · **Paper**: 素绢 · **Seal**: 暗紫苑红 · **Theme ids (light / dark)**: `lishou-light` / `lishou-dark`
- **Color**: Zi Teng Luo · **中文**: 紫藤萝 ⭐ · **Anchor**: `#9B8AE8` · **Paper**: 雪青 · **Seal**: 淡罂粟红 · **Theme ids (light / dark)**: `zitengluo-light` / `zitengluo-dark`
- **Color**: Han Xiu Lü · **中文**: 汉绣绿 ⭐ · **Anchor**: `#2E7D32` · **Paper**: 素绢 · **Seal**: 绛紫 · **Theme ids (light / dark)**: `hanxiulv-light` / `hanxiulv-dark`
- **Color**: An Zi Yuan Hong · **中文**: 暗紫苑红 · **Anchor**: `#82202B` · **Paper**: 熟宣 · **Seal**: 殷红 · **Theme ids (light / dark)**: `anziyuanhong-light` / `anziyuanhong-dark`
- **Color**: Xin Lü · **中文**: 新绿 ⭐ · **Anchor**: `#6CC788` · **Paper**: 素绢 · **Seal**: 茜裙 · **Theme ids (light / dark)**: `xinlv-light` / `xinlv-dark`
- **Color**: Ling Meng Hong · **中文**: 菱锰红 ⭐ · **Anchor**: `#D276A3` · **Paper**: 熟宣 · **Seal**: 苋菜紫 · **Theme ids (light / dark)**: `lingmenghong-light` / `lingmenghong-dark`
- **Color**: Man Tian Xing Zi · **中文**: 满天星紫 ⭐ · **Anchor**: `#2E317C` · **Paper**: 雪青 · **Seal**: 栗紫 · **Theme ids (light / dark)**: `mantianxingzi-light` / `mantianxingzi-dark`
- **Color**: Kong Que Lan · **中文**: 孔雀蓝 · **Anchor**: `#0EB0C9` · **Paper**: 雪青 · **Seal**: 胭脂红 · **Theme ids (light / dark)**: `kongquelan-light` / `kongquelan-dark`
- **Color**: Bao Shi Lan · **中文**: 宝石蓝 ⭐ · **Anchor**: `#2486B9` · **Paper**: 雪青 · **Seal**: 朱墙 · **Theme ids (light / dark)**: `baoshilan-light` / `baoshilan-dark`
- **Color**: Mei Die Lü · **中文**: 美蝶绿 · **Anchor**: `#12AA9C` · **Paper**: 素绢 · **Seal**: 枫叶红 · **Theme ids (light / dark)**: `meidielv-light` / `meidielv-dark`
- **Color**: Bian Dou Zi · **中文**: 扁豆紫 · **Anchor**: `#A35C8F` · **Paper**: 雪青 · **Seal**: 扁豆紫·深 · **Theme ids (light / dark)**: `biandouzi-light` / `biandouzi-dark`
- **Color**: Qian Zi Teng Luo · **中文**: 浅紫藤萝 ⭐ · **Anchor**: `#D1B3FF` · **Paper**: 雪青 · **Seal**: 杏子 · **Theme ids (light / dark)**: `qianzitengluo-light` / `qianzitengluo-dark`
- **Color**: Qing Fan Lü · **中文**: 青矾绿 · **Anchor**: `#2C9678` · **Paper**: 素绢 · **Seal**: 汉绣红 · **Theme ids (light / dark)**: `qingfanlv-light` / `qingfanlv-dark`
- **Color**: Bi Luo Chun Lü · **中文**: 碧螺春绿 · **Anchor**: `#867018` · **Paper**: 赭纸 · **Seal**: 苍碧 · **Theme ids (light / dark)**: `biluochunlv-light` / `biluochunlv-dark`
- **Color**: Gan Lan Shi Lü · **中文**: 橄榄石绿 · **Anchor**: `#B2CF87` · **Paper**: 素绢 · **Seal**: 酢酱草红 · **Theme ids (light / dark)**: `ganlanshilv-light` / `ganlanshilv-dark`
- **Color**: Fen Tuan Hua Hong · **中文**: 粉团花红 · **Anchor**: `#EC9BAD` · **Paper**: 熟宣 · **Seal**: 锦葵红 · **Theme ids (light / dark)**: `fentuanhuahong-light` / `fentuanhuahong-dark`
- **Color**: He Ye Lü · **中文**: 荷叶绿 · **Anchor**: `#1A6840` · **Paper**: 素绢 · **Seal**: 栗紫 · **Theme ids (light / dark)**: `heyelv-light` / `heyelv-dark`
- **Color**: Shi Lü · **中文**: 石绿 · **Anchor**: `#57C3C2` · **Paper**: 素绢 · **Seal**: 银红 · **Theme ids (light / dark)**: `shilv-light` / `shilv-dark`
- **Color**: Zha Ye Zong · **中文**: 柞叶棕 · **Anchor**: `#692A1B` · **Paper**: 熟宣 · **Seal**: 栗棕 · **Theme ids (light / dark)**: `zhayezong-light` / `zhayezong-dark`
- **Color**: Chang Chun Hua Lan · **中文**: 长春花蓝 · **Anchor**: `#7EC0EE` · **Paper**: 雪青 · **Seal**: 香叶红 · **Theme ids (light / dark)**: `changchunhualan-light` / `changchunhualan-dark`
- **Color**: Shan Geng Zi · **中文**: 山梗紫 · **Anchor**: `#61649F` · **Paper**: 雪青 · **Seal**: 满江红 · **Theme ids (light / dark)**: `shangengzi-light` / `shangengzi-dark`
- **Color**: Yan Lan · **中文**: 鷃蓝 · **Anchor**: `#144A74` · **Paper**: 雪青 · **Seal**: 枣红 · **Theme ids (light / dark)**: `yanlan-light` / `yanlan-dark`
- **Color**: Fen Lü · **中文**: 粉绿 · **Anchor**: `#83CBAC` · **Paper**: 素绢 · **Seal**: 梅红 · **Theme ids (light / dark)**: `fenlv-light` / `fenlv-dark`
- **Color**: Yu Qin Lan · **中文**: 玉鈫蓝 · **Anchor**: `#126E82` · **Paper**: 雪青 · **Seal**: 赭石 · **Theme ids (light / dark)**: `yuqinlan-light` / `yuqinlan-dark`
- **Color**: Pi Bian · **中文**: 皮弁 · **Anchor**: `#8B5D33` · **Paper**: 赭纸 · **Seal**: 石青 · **Theme ids (light / dark)**: `pibian-light` / `pibian-dark`
- **Color**: Gan Lan Lü · **中文**: 橄榄绿 ⭐ · **Anchor**: `#5E5314` · **Paper**: 赭纸 · **Seal**: 满天星紫 · **Theme ids (light / dark)**: `ganlanlv-light` / `ganlanlv-dark`
- **Color**: Dai Zi · **中文**: 黛紫 · **An