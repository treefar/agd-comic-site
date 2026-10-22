# 固定提案安全套用器與 Works 完整主標

來源固定 `a11cc9c7cbd34bbda962734c7298fe7fc54988c2`，原提案 83 值；本次可套用 **82 值**，另 1 個歷史 HC canonical 公司名與日文長鍵連動。原精確提案不覆寫。

## 排除與安全範圍

完整排除 `NEWSWORK-a9a863dd86b4-en`，第 104 條 `data/en/news.json /10/content`。此完整段落含「所有作品」和官方「入選作品」規則衝突；Fancy Frontier 名稱、機會語氣等同段小修也暫緩。`excluded-pending.json` 保存完整 old/new 與理由。沒有再硬稱 83 已套用。

白名單只有五個翻譯 JSON：`data/en/news.json`、`data/en/works.json`、`data/en/ui.json`、`data/en/editorial.json`、`data/ja/messages.json`，以及 canonical `data/news.json /16/content` 的公司名精確替換。公司名以外的八位學生、六位台灣／兩位馬來西亞、第八年、七月八日、教師及其他字段均保留。

`prepare(root)` 在任何產品寫入前核對全部完整 old 值、既有 key／新增 override 碰撞、資料紀錄 id／slug、canonical 舊文、新日文長鍵碰撞及固定 plan 是否竄改。用真實固定 build-translations／build-ja-translations 程式在虛擬唯讀檔案介面生成檢查，保證新 EN／JA 鍵都可產生、舊生成鍵消失、82 個值正確，並逐鍵比所有非目標生成值不變。

`applyPrepared()` 再比對所有已讀產品內容、實際路徑、可選 overlay 是否存在、data 目錄清單，並拒絕 prepared 物件竄改，全部通過才開始六檔寫入。這不是跨六檔的原子交易；寫入期間底層 I/O 故障仍須處理，不能宣稱任意中途硬體故障下完全原子。JSON 會以兩空白重新序列化，但非目標字串／字段由深比測試保護。

不從可變工作樹建立測試基準。暫存副本全從固定 Git blob 建立；其中一項先疊先前 13／1 與 About／Labs 44 提案，實際套新 82／1 後深比每個非目標字段，證明不還原主控已完成更新。暫存副本保留不刪。

## 實際指令與結果

```powershell
node --test holiday-lab/translation-review-news-works-final/apply.test.mjs
node holiday-lab/translation-review-news-works-final/root-dryrun.mjs
node --test tests/works-copy-context.test.cjs
```

|驗收|結果與原始證據|
|---|---|
|固定 83 → 排除 1 → 可套 82|yes；golden plan 測試與 excluded-pending.json|
|先紅再實作安全套用|yes；applier-red.txt 為未實作 API 的紅燈；applier-green.txt 14 passed／0 failed|
|固定副本實際 apply、非目標字段深比|yes；14 tests 中第三項，含先前 13／1＋About44|
|固定副本實際生成新英日鍵及移除舊鍵|yes；第四項用真實固定 generator，亦驗 stale disk locales 拒絕|
|漂移、越界、缺鍵、兩類碰撞、並行與遮蔽拒絕|yes；相關測試逐項有原始輸出|
|root 實際 dry-run 0 寫入及輸入 SHA 不變|見 root-dryrun-output.txt／root-dryrun-proof.json 當次實際結果|
|Works 英日完整主標紅→綠|yes；works-context-red.txt → works-context-green.txt，3 passed／0 failed|
|原中文 JSX、20 話、黃色強調 span 保留|yes；固定來源對照測試與 chapters-2.jsx 最小差異|
|Build 08、改後 DOM／字型與排版|no；依派工交由主控整批後單次 Build 08，不另 build 或生成 locale|
|root 產品 JSON 實際 apply|no；只提供 CLI，交主控獨立驗收與套用|

## Works 唯一產品變更

`chapters-2.jsx` 新增 `WorksLocalizedHeading()`，用 raw `React.createElement` 保完整語序，避免共享 fragment 字典再次把字串接壞。英文為「20 chapters of stories. The achievements keep coming.」，日文為「連載20話。実績は途切れない。」；原中文 JSX 保留在 zh 分支，三語保持原換行與黃色強調 span。沒有全域修改逗號／標點，也沒有改 en-pages renderer。

`tests/works-copy-context.test.cjs` 取固定 a11cc9c 的核定完整句作 golden，比對真正產品函式結果與 span／br 結構，並保護原中文分支。改後真實 DOM 與截圖須等主控 Build 08，不以單元測試代替使用者排版驗收。

主控 CLI：

```powershell
node holiday-lab/translation-review-news-works-final/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes
node holiday-lab/translation-review-news-works-final/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes --apply
node holiday-lab/translation-review-news-works-final/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes --verify-applied
# 主控單次 Build 08 生成實體 locales 後：
node holiday-lab/translation-review-news-works-final/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes --verify-applied --require-generated
```
