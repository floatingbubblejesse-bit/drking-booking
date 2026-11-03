# 官網後台內容的版本控管

官網有兩種地方會被修改：

1. **GitHub 這個 repo 的檔案**（site-theme-entry.js、linevaccines.html、phone-liff.html…）：GitHub 本來就記錄每一次修改。
2. **官網後台（搜博科技 sys_manage）直接改的內容**：後台沒有版本紀錄，所以由這個資料夾保存。

## 存了哪些後台內容

| 檔案 | 後台位置 |
|---|---|
| `cms-01-about.html` … `cms-41-linedoctorschedule.html`（11 頁） | 單元頁面 `common.php?act=edit&id=編號` 的內容 |
| `footer-info.html` | 頁尾資訊 `config.php?act=bottominfo` |
| `head-code.html` | 追蹤碼設定 → 轉換代碼 `config.php?act=code` |

- `versions/live/`：最新快照。每天台灣時間 02:37 自動從官網抓一次。內容有變才會產生一筆修改紀錄，所以修改紀錄就是後台內容的變更史。
- `versions/stable-20261103/` 這類資料夾：存檔版本，不會再變。
- `versions/STATUS.md`：最新快照和每個存檔版本逐項比較，標出哪一項「已變更」。

不在這裡的東西：

- GTM：GTM 本身有「版本」可以回復。
- 醫師介紹（產品）頁、網站基本設定的欄位：沒有保存。

## 看誰改了什麼

- 打開 `versions/STATUS.md`，看哪一項是「已變更」。
- 點 `versions/live/` 裡那個檔案的 History，可以看到每一次變更的前後差異。

## 改壞了，回復到存檔版本

### 方法一：書籤（建議）

第一次先在 Chrome 新增一個書籤，名稱「回復存檔版本」，網址貼上：

```
javascript:(function(){var s=document.createElement('script');s.src='https://floatingbubblejesse-bit.github.io/drking-booking/versions/restore.js?'+Date.now();document.body.appendChild(s);})();
```

之後要回復時：

1. 登入後台，打開要回復的那一頁的編輯畫面（例如「單元頁面」id 39、「頁尾資訊」或「追蹤碼設定」）。
2. 點書籤「回復存檔版本」，右上角會出現小視窗，選版本（預設是最新的存檔版本）。視窗會顯示目前內容和存檔是否相同。
3. 按「載入到編輯器」，檢查畫面沒問題後，按頁面下方的「確認送出」。

不想回復就直接重新整理頁面，什麼都不會改。

### 方法二：手動

1. 在 GitHub 打開 `versions/存檔版本/對應檔案`，按 Raw，全選複製。
2. 把內容裡的 `'` 全部換成 `&qpos;`（後台用這個代替單引號；`head-code.html` 不用換）。
3. 到後台那一頁，編輯器切到「原始碼」，全選貼上，按「確認送出」。

### GitHub 上的檔案

存檔時也在 GitHub 打了標籤（tag），名稱和存檔版本相同（例如 `stable-20261103`）。要把某個檔案回復成那時候的樣子：

1. 在 GitHub 切到該標籤，打開檔案，按 Raw 複製。
2. 回到 main 分支編輯同一個檔案，整個貼上後 commit。

## 存一個新的存檔版本

GitHub → Actions → 「Snapshot site back-office content」→ Run workflow，在欄位填版本名稱（英數字，例如 `stable-20261215`），按執行。

完成後，到 Releases 用同一個名稱打標籤，GitHub 檔案也會一起標記。
