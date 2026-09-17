# Kodohon（講故事）— 代理進場須知

本庫是 **Fami 可分享門面**（GitHub Pages）＋ **家裡保險庫**（本機 HTTP 經 Cloudflare 隧道）。產品內容是講故事音檔；門面殼與鑑權走 Fami 共用規則。

## 架構

| 層 | 說明 |
|---|---|
| **Pages 門面** | 靜態 HTML／JS／CSS，公開在 `https://theoldfathertw.github.io/kodohon/` |
| **隧道 origin** | `config.js` 的 `window.VAULT_ORIGIN` 指向家裡保險庫；鑰匙與隧道網址不進 git |
| **保險庫** | 本機 `python -m kodohon vault`（預設埠 8767）；音檔在 `F:\KoDoHoN\library` |

桌機、iPad Safari、iPhone Safari 共用同一顆 Pages 網址。交付入口是 GitHub Pages，不是 exe／bat。

## UI 殼（fami-shared-ui）

畫面詞彙表以 skill **`fami-shared-ui`** 為準。開工前必讀。

| 詞 | 含義 |
|---|---|
| 返回 | 共用返回按鈕／行為 |
| 確認 | 共用確認按鈕／行為 |
| 找卡／操作卡 | 搜尋與操作用的標準卡片 |
| 愛心 | 多選／最愛工具列 |
| 首頁頭 | 連上後個人頁頂部標題列 |

預設交付 **標準版個人頁**（封面縮圖、長押多選、齒輪菜單圖示、入口色塊連上後隱藏等）。禁止未經詢問做閹割版。

活標本：`E:\FamilyPhotos\web`、`D:\Mybook\web`。改共用殼時須 **雙邊同步** 並提高 `?v=`。

## FamiGate 核心

- 鑑權與 origin 解析優先走 **`gate.js` 的 `window.FamiGate`**（單一 FamiGate 核心）。
- **不要** 無必要地 fork `gate.js`；產品差異用外掛或設定，不要複製整顆核心。
- 讀取 origin：`FamiGate.origin()` 或 `window.VAULT_ORIGIN`（與 config 一致）。

## 共用政策（能共用的物件 100% 共用）

1. **可共用物件必須 100% 共用** — 返回、確認、找卡、操作卡、齒輪、等待語言、入口／個人頁骨架等，不得各門面私製第三種變體。
2. **禁止自造第三種卡** — 需要新樣式時在 fami-shared-ui 詞彙表定義編號（如返回2），不得偷偷改原件。
3. **改一顆共用件＝改所有掛上的門** — 本庫與 **famibook**、**gamepal** 為同型可分享門；改共用 chrome 時須一併考量兄弟門面。
4. **專案色** — 只換被點名專案的 `:root` 色票與圖示；未點名的兄弟門維持原色。

## 本庫邊界

- **可改**：產品邏輯（講故事列表、播放、標記等）、專案文案、專案色、Pages 資產。
- **慎改／需必要性審核**：`gate.js`、`door.js`、`hey.html` — 與 famibook／gamepal 共用；fork 前須自審「有必要」三條。
- **runtime config**：`config.js` 的 `VAULT_ORIGIN` 隨隧道更新；不提交個人鑰匙。

## Git 與上線

- 會出現在 GitHub Pages 的門面檔：驗證後 commit + push **`main`**，提高 `?v=`。
- 不要推金鑰、音檔、PDF、保險庫內部資料。

## 相關 skill

- **`fami-shared-ui`** — 詞彙表、標準版個人頁、bootstrap
- **`ios-home-web`** — iPhone／iPad／桌機三套表面、Pages＋隧道架構
