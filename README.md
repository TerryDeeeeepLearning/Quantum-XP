# 量子能階系統 · Quantum XP

給量子計算研究生的行為經驗值系統。把「對未來最有用的事」量化成 XP，用能階、相干天數與光子點數把每天的選擇變成可以看見的曲線。

離線可用、可安裝到手機主畫面、資料只存在你自己的裝置上。

---

## 三個核心機制

| 機制 | 規則 |
|---|---|
| **能階（等級）** | 累積 XP 決定 E0 → E10+，門檻為 `600n + 100n(n−1)` |
| **相干天數（連續達標）** | 連續 7 天達標後每日 XP +5%，上限 +20%；斷一天歸零 |
| **光子點數** | 每超出當日目標 20 XP 得 1 顆，1 顆 = 30 分鐘無罪惡感娛樂 |

**達標需要同時滿足兩個條件**，缺一不可：

1. 當日總 XP ≥ 每日目標
2. 其中至少 50% 的目標 XP 來自 S／A 級任務（深度門檻）

第二條是刻意設計的。沒有它，光靠早睡早起、三餐正常、重訓就能刷滿分數，系統會變成安慰劑。

---

## 分頁

- **主控台** — 能階圖、今日進度、近 14 日振幅、今日行程
- **打卡** — 任務加減計數，可切換日期補登
- **任務庫** — S/A/B/C/D 五級 XP 排序表，全部可編輯、可新增
- **行程表** — 暑假／開學雙模式、每週固定行程、每日目標、強度調節器、特例日、資料備份
- **回顧** — 週／月／季／半年報告，六項量化指標 + 圖表 + 自動診斷 + 筆記

---

## 部署到 GitHub Pages

不需要在本機安裝 Node，GitHub Actions 會幫你建置。

1. 在 GitHub 建一個新的 repository（建議命名 `quantum-xp`，**Public**）。
2. 把這個資料夾的所有檔案推上去（含隱藏的 `.github` 資料夾）：

   ```bash
   git init
   git add -A
   git commit -m "init: quantum xp system"
   git branch -M main
   git remote add origin https://github.com/<你的帳號>/quantum-xp.git
   git push -u origin main
   ```

   或直接用網頁介面拖曳上傳，但要確認 `.github/workflows/deploy.yml` 有一起上去（網頁上傳有時會漏掉以點開頭的資料夾，若如此請用 git 指令）。

3. 到 repo 的 **Settings → Pages → Build and deployment → Source**，選 **GitHub Actions**。
4. 回到 **Actions** 分頁等綠燈，約一分鐘。
5. 網址是 `https://<你的帳號>.github.io/quantum-xp/`

> `vite.config.js` 裡的 `base` 會被 Actions 自動以 repo 名稱覆寫，所以改 repo 名稱也不會壞。只有在本機跑 `npm run build` 時才需要手動確認那一行。

### 本機開發（可選）

```bash
npm install
npm run dev
```

---

## 安裝到手機

**iPhone（Safari，必須用 Safari）**
開網址 → 分享鈕 → 加入主畫面。之後從主畫面開啟會是全螢幕、無網址列，也能離線使用。

**Android（Chrome）**
開網址 → 右上選單 → 安裝應用程式／加到主畫面。

---

## 資料存在哪裡

`localStorage`，也就是你這台裝置的瀏覽器裡。沒有伺服器、沒有帳號、沒有任何資料離開你的手機。

代價是三件事，請當真：

- **清除瀏覽器資料 = 紀錄全部消失。**
- **手機和電腦的紀錄不互通**，因為它們是兩個瀏覽器。建議固定用一台裝置打卡。
- iOS 若只用 Safari 開網頁而不加到主畫面，長期未使用時系統可能清掉資料。**加到主畫面是必要動作，不是選配。**

所以每週回顧時，順手到「行程表 → 資料 → 匯出備份 JSON」。要換裝置或誤刪時用「從備份還原」讀回來。

---

## 強度升降檔

行程表分頁有五檔強度，一鍵重算七天目標：

| 檔位 | 暑假週合計 | 說明 |
|---|---|---|
| 55% | 385 XP | 撞牆期，先維持不斷線 |
| 70% | 500 XP | 起步（預設） |
| 85% | 600 XP | 進檔 |
| 100% | 705 XP | 標準 |
| 115% | 810 XP | 衝刺 |

**升降規則：連續兩週達標率 ≥ 80% 才升一檔；連續兩週 < 60% 就降一檔。** 不要憑心情調，那會讓數字失去意義。

---

## 技術

React 18 + Vite，無 UI 框架，圖表為手寫 SVG，PWA 用手寫 service worker（runtime caching，不需要預先列出檔名，因此不會被 Vite 的雜湊檔名弄壞）。

```
src/
  data.js        預設任務庫、行程、目標、能階標題
  compute.js     日期工具、能階公式、每日序列、區間彙總
  storage.js     localStorage 讀寫、JSON 匯出匯入
  App.jsx        分頁路由與狀態
  components/    ui / charts / Dashboard / Today / Catalog / Schedule / Review
```

修改 XP 規則不必動程式：深度門檻比例 `CORE_RATIO`、光子換算 `PHOTON_STEP` 都在 `src/data.js` 最上方。
