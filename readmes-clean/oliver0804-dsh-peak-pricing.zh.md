# dsh-peak-pricing

[English](README.md) | 繁體中文

一個 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 外掛，
在輸入框底下加一行：現在是 DeepSeek 的哪個計價時段、還剩多久、以及這個工作階段
到目前為止花了多少錢。

```
4 轮 · 195 步 │ LLM 17m13s │ 首 token 平均 1.3s │ 缓存命中 100%  ·  TPS 117 tok/s
              ● 空闲时段 · 1:35:06 后进入高峰 · 本会话 ¥1.69
```

- **綠點 — 離峰（空闲时段）**：適合開長工作的時候。
- **橘點 — 尖峰（高峰时段）**：同樣的用量價格剛好兩倍。
- **倒數**：目前費率還剩多久，精確到秒。
- **金額**：本次工作階段的花費，每一筆增量都用「它發生當下」的費率計價。

滑鼠停在該行（或用鍵盤聚焦到它）會顯示完整明細：模型、當前費率、四個 token
分桶用量、尖峰時段表——外加一張快取命中率走勢圖：每筆輸入增量一個點，固定
0–100% 縱軸，最多保留最近 120 個點，長工作階段也不會失真。走勢與累計金額同住
`localStorage`，重新整理不會丟；和費用一樣，開啟工作階段後的第一筆讀數只能
整筆取樣，之後的每一點都是精確的增量。

## 安裝

```bash
dsh plugin --profile web add dsh-peak-pricing
```

重啟 `dsh web` 就會出現。確認外掛層已掛載：

```bash
dsh --profile web --dump-config | grep peak-pricing
```

移除：

```bash
dsh plugin --profile web remove dsh-peak-pricing
```

## 價目表

依官方[價格頁](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/)，
DeepSeek 採峰谷定價：尖峰為北京時間**週一至週五**的 09:00–12:00 與
14:00–18:00，其餘時間（含週六、週日全天）為離峰，價格剛好是尖峰的一半。

### 模型 · 時段 · 輸入（快取命中） · 輸入（快取未命中） · 輸出
- **模型**: deepseek-v4-flash · **時段**: 離峰 · **輸入（快取命中）**: ¥0.05 · **輸入（快取未命中）**: ¥1.50 · **輸出**: ¥4.50
- **模型**:  · **時段**: 尖峰 · **輸入（快取命中）**: ¥0.10 · **輸入（快取未命中）**: ¥3.00 · **輸出**: ¥9.00
- **模型**: deepseek-v4-pro · **時段**: 離峰 · **輸入（快取命中）**: ¥0.15 · **輸入（快取未命中）**: ¥4.50 · **輸出**: ¥13.50
- **模型**:  · **時段**: 尖峰 · **輸入（快取命中）**: ¥0.30 · **輸入（快取未命中）**: ¥9.00 · **輸出**: ¥27.00
- **模型**: deepseek-v4-flash-vision-exp · **時段**: 離峰 · **輸入（快取命中）**: ¥0.05 · **輸入（快取未命中）**: ¥1.50 · **輸出**: ¥4.50
- **模型**:  · **時段**: 尖峰 · **輸入（快取命中）**: ¥0.10 · **輸入（快取未命中）**: ¥3.00 · **輸出**: ¥9.00

單位為人民幣元／百萬 tokens。價目表就寫在
[`src/pricing.ts`](src/pricing.ts) 的一個常數裡——DeepSeek 之後調價，改那裡就好。

傳送給 `deepseek-v4-flash-vision-exp` 的圖片會按尺寸換算成 tokens、與文字一併
以輸入計費，所以走的還是同一組用量分桶，這裡無需特別處理。

公告把尖峰限定在平日、未提及假日的例外，因此沒有內建假日曆——每個星期都套用
同一組平日時段。時間一律由 UTC 加上固定 +8 偏移推算（中國全年不實施日光節約
時間），因此瀏覽器在哪個時區都算得對。

### 其他供應商

不走 DeepSeek 分時方案的模型放在第二張表（[`src/pricing.ts`](src/pricing.ts)
裡的 `FLAT_PRICE_TABLE`）：全天單一費率、以供應商自己的幣種計價，必要時可按
時間分段。

### 模型 · 幣種 · 輸入（命中與未命中） · 輸出 · 生效
- **模型**: z-ai/glm-5.3-flash · **幣種**: USD · **輸入（命中與未命中）**: $0.075 · **輸出**: $0.25 · **生效**: 現在 → 2026-09-09 16:00 UTC
- **模型**: z-ai/glm-5.3-flash · **幣種**: USD · **輸入（命中與未命中）**: $0.15 · **輸出**: $0.50 · **生效**: 2026-09-09 16:00 UTC 之後

第一行是 Z.AI 的限時五折優惠（至台北／北京時間 2026-09-10 00:00，即 UTC
2026-09-09 16:00）；之後自動回到原價——解析器只挑當下生效的那一段，促銷到期
不需要任何資料遷移。該模型未公布快取分成，兩個輸入分桶都按單一輸入價計費。

幣種不同就**分幣種各自累計、絕不相加**：一個同時用過 DeepSeek 與 GLM 的
工作階段會顯示成 `¥1.69 + $0.02`，行內與懸浮明細皆是。

## 費用怎麼算出來的

Harness 為每個工作階段發布一份 `tokenUsage` projection：四個**累計**分桶
（`cacheReadTokens`、`uncachedInputTokens`、`cacheWriteTokens`、`outputTokens`），
沒有時間戳。光看累計值無法知道哪些 token 是在哪個費率下計費的，所以這個外掛
改為對**增量**計價：

1. 每次新的讀數都與上一次相減。
2. 差額用「當下」的費率計價——那正是這批 token 實際被計費的時刻。
3. 累計金額以工作階段 id 為鍵存進 `localStorage`，所以重新整理頁面會接著累加，
   而不是把整個工作階段用當下費率重算一次。

因此一段橫跨 17:55 → 18:05 的工作，會被算成「十分鐘尖峰 + 五分鐘離峰」，
而不是十五分鐘都算同一種價。

有兩個對應關係值得明講：

- **`cacheReadTokens` 算快取命中價；`uncachedInputTokens + cacheWriteTokens`
  算快取未命中價。** 公告只把輸入分成命中／未命中兩種，而快取寫入本來就是
  「那次未命中」造成的。
- **一個工作階段的第一筆讀數沒有到達時間可依據**，只能用當下費率整批計價；
  之後的每一筆都是精確的。所以在尖峰時段打開一個舊工作階段，會高估它的歷史
  花費，接著繼續用下去數字就會收斂。

如果當前模型不在價目表裡（其他供應商，或公告未涵蓋的 DeepSeek 模型），時段與
倒數照常運作，金額則直接不顯示，而不是亂猜一個。

**這是給自己安排工作節奏用的估算值，實際請以 DeepSeek 帳單為準。**

## 實作方式

一個套件、兩個半邊，走官方外掛形狀：

- `src/pricing.ts` — 純核心：價目表、時段規則、分桶計價。不碰 React 與 DOM。
  host 入口原樣再匯出，所以 host 端要用同一份價目表算錢也可以。
- `src/client/` — 瀏覽器半邊，掛在 `conversation.composer.dock` 插槽
  （官方統計行用的同一個座位），`order: 120`。當前模型透過
  `ctx.modelDirectories` 軟性取得：沒有硬相依，該服務不在時這行會退化成
  只顯示時段。
- `cordis.patch.yml` — 把外掛插進 profile 名冊的那一行。

瀏覽器 bundle 由 `tsdown` 建置成 client module loader 的 factory 形式
（`window.__ModuleLoader__.load({id, factory})`），並把 `react`、
`react/jsx-runtime` 與所有 `@deepseek-ai/*` 保持 external——這些由執行環境
提供，若把 React 打包進來會出現第二份 React 而讓 hooks 壞掉。

```bash
npm install
npm test        # vitest：時段邊界、分桶計價、累計行為
npm run build   # tsc -b（型別）＋ tsdown（host ESM ＋ client bundle）
```

用 tarball 在本機安裝（本外掛就是這樣驗證的）：

```bash
npm pack
dsh plugin --profile web add "file:$PWD/dsh-peak-pricing-<版本>.tgz"
```

### 介面語言

這行文字提供 `zh`（簡體中文，與 DSH 介面本身及 DeepSeek 公告用詞一致）與 `en`
兩份字典，由 harness 的語言設定決定顯示哪一份。兩份字典都在
[`src/client/locales.ts`](src/client/locales.ts)，改完重新建置即可換成自己想要
的說法（例如把「高峰／空闲」改成繁中的「尖峰／離峰」）。

### 與 dsh-live-stats 並存

`@linxin666/dsh-live-stats` 會把 composer dock 壓成一行不換行的 flex，
好讓它的 TPS 併到官方統計行上。本外掛注入一小段樣式，讓那個容器可以換行，
並讓自己的行佔滿整寬，因此價格會落在下面獨立一行，不會去擠壓統計行。
沒裝那個外掛時，這段樣式不會生效。

## 授權

MIT