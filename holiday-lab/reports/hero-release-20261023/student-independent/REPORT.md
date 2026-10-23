# 學生作品首頁與策展示範：獨立驗收

source_agent: codex

2026-10-23。本機受測版本：`.measure-student-hero-20261023-02`，網址 `http://127.0.0.1:8863`。本代理只寫本驗收目錄，未改產品、main、C 節、勞動節，未 push、刪檔、build、啟動 Unity 或 headed 瀏覽器。

最新有效證據為 `runs/2026-10-23T09-48-25-302Z/result.json`。此輪新開單一 headless 程序，原始蒐集器 exit 0；唯讀驗收器 exit 0。9 組首頁、9 組策展、2 條嵌入遊戲核心操作通過，47 張 PNG 有原檔 SHA 核對。54 個文字版面快照全部字型 loaded，沒有量測到水平溢位、控制文字越框或中日文孤字末行。17 個 HTTP 來源檔的前後 SHA 完全一致。

| 驗收條件 | yes／no | 實際證據 |
|---|---|---|
| 節日入口與「畫出來，動起來」同一 Hero 漫畫格，沒有重複整合區 | yes | 9 組確認唯一 `#festival-preview` 位於 `#hero .tier-splash`；27 張換作品 Hero PNG |
| 三語 zh／en／ja，各 320／390／1440 | yes | `cases` 與 `demoCases` 各有完整 9 組互異組合 |
| 完整學生海報，以 contain 呈現，沒有裁切遮罩 | yes | 每組 3 張；自然尺寸、object-fit、祖先裁切與 mask／clipPath 逐筆核對 |
| 作品正式名稱、所有創作者與指導老師保留 | yes | 逐筆對照 `data/news.json` id7140.gallery rank04／05／06；`source-expectations.json` 保留來源 SHA 與完整署名 |
| 消息連結正確指向各作品 | yes | `/work-04`、`/work-05`、`/work-06`；已讀 `pages.jsx` 的路由與 gallery id 實作 |
| 首頁手動換作品，無自動輪播 | yes | 各組下一張與上一張真操作；停留 1700ms 後標題不變 |
| 點擊前不載節日插畫與生成 UI 背景、遊戲、音訊 | yes | 各組初始及選擇節日後 `/holiday-lab/assets/`、`/games/`、`/audio/` 請求皆空，iframe 為 0 |
| 保留原 14 個節日入口，排除勞動節 | yes | 每組檢查選項長度 14、無 labor；折疊入口展開後才操作 |
| modal、跨 iframe 鍵盤、Esc、焦點與背景鎖定 | yes | 9 組驗證 Shift+Tab 進 iframe、iframe Tab 回 close、Esc 關閉、焦點回開始按鈕、inert／overflow 還原 |
| 策展示範能錯誤提示、成功、重設與鍵盤操作 | yes | 9 組各驗入口占用、缺資訊、重複展位；以原生選單與 Space／Home／ArrowDown／Enter 完成，重設恢復初始值 |
| 策展切語言保留配置與勾選 | yes | 每組切下一語言後位置與勾選不變，來源連結保留當前語言 |
| 策展不載生成資產、音訊或 iframe | yes | 9 組全部 forbidden 請求空、iframe 0 |
| 新年與清明嵌入核心可操作 | yes | new-year／en／1440、qingming／ja／320；真 controls 經錯誤與成功流程，各 100/100、有 artifact、回放三鏡頭、正常關閉 |
| Console、pageerror、requestfailed、HTTP 400+ 皆無 | yes | 20 個受測 context 的 errors 全空 |
| 字型完成後才量測／截圖 | yes | 新方法每個採樣先觸發布局再等 fonts.ready；collector 與唯讀驗收器均斷言 loaded；54 個快照全 loaded |
| 全站全部遊戲發布驗收已批准 | no | 本輪限定首頁與一款策展示範、兩條嵌入核心；`full_project_approved=false` |
| 全站每個字元的字型涵蓋率已驗完 | no | 本輪核三語指定頁的實際版面與代表畫面；未執行全站字型 cmap／所有替補字型稽核 |
| 已公開上線 | no | 僅本機審閱版 |

## 真實指令與輸出

在 repo 根目錄執行：

```powershell
$env:STUDENT_QA_URL='http://127.0.0.1:8863'
node holiday-lab/reports/hero-release-20261023/student-independent/run-v2.cjs
```

`run-v2-output.txt` 保存原輸出。末段：

```text
PASS embedded-new-year-en-1440
PASS embedded-qingming-ja-320
STUDENT_ACCEPTANCE pass EVIDENCE C:\agywork\agd-holiday-prototypes\holiday-lab\reports\hero-release-20261023\student-independent\runs\2026-10-23T09-48-25-302Z
NATIVE_EXIT=0
```

唯讀核對：

```text
node holiday-lab/reports/hero-release-20261023/student-independent/verify-v2.cjs holiday-lab/reports/hero-release-20261023/student-independent/runs/2026-10-23T09-48-25-302Z
{"pass":true,"contexts":9,"embedded_routes":2,"demo_contexts":9,"pngs":47,"receipt_sha256":"f0f201431cdc084410379424dca589f8f48ee4f653da98938493f5d3059731ea","full_project_approved":false,"scope":"student-poster Hero and one curation demonstration; selected local review contexts, not full release approval"}
EXIT=0
```

驗收器正反例：

```text
STUDENT_QA_RUN=<上述絕對 run 目錄> node --test holiday-lab/reports/hero-release-20261023/student-independent/verify-v3.test.cjs
tests 12
pass 12
fail 0
skipped 0
EXIT=0
```

包含有效原始證據、同一 mutation harness 未修改原始證據可通過，以及拒絕手機失敗被 summary 蓋掉、缺署名、載入生成插畫、來源漂移、海報 cover、偽 PNG SHA、字型 loading、偽全站批准。先前兩輪失敗證據也必須繼續拒絕。完整輸出見 `verify-tests-v3.txt`；`verification-v2.json` 提供聚合工具可讀結果。`method-v2-freeze.json` 內原凍結檔 SHA 複核仍一致。

## 保留的紅燈與方法修正

1. `runs/2026-10-23T09-35-46-407Z`：8862 原產品的 6 組手機策展有姓名末字、日文 checkbox 與按鈕孤字，原 run 真 exit1。`red-minimal.json` 保留最小失敗與 selector。產品 owner 修正後，主控另 build 8863；本代理沒有修產品。
2. `runs/2026-10-23T09-41-28-837Z`：8863 初次蒐集器表面 pass，但嚴格 `verify.cjs` 真 exit1，11 個換作品狀態字型 loading。原因為原蒐集方法只初次等 fonts.ready，新標題與署名可能再觸發字型子集。`font-readiness-red.json` 與 `verify-original-02-rejection.txt` 留底；此輪不計通過。
3. 另開 v2 run／measure／verify，原方法與上述 raw 全不覆寫。v2 每次採樣先 force layout、等 fonts.ready，再要求 loaded；另存策展成功與切語言重設的版面，不縮字、不降低門檻。新 9+9+2 一次跑完，來源未變。
4. `verify-v2.test.cjs` 的 unchanged-harness 正例真抓到 VM 缺 URL 全域，原 11pass／1fail 輸出保留於 `verify-tests-v2.txt`。另開 `verify-v3.test.cjs` 僅補測試 harness 的 URL，12／12 通過；沒有修改凍結 v2 run、measure、verify 或任何瀏覽器證據。

## 畫面與範圍說明

已實際檢視本輪 `home-ja-320-work-2.png` 與 `demo-ja-320-success.png`：完整海報、作品名與署名可見，未見缺字方框或姓名被拆成末字；這是指定畫面的觀察，不代表使用者已確認美術或全站字型已完測。其他 47 張 PNG 與 DOM 行框資料完整保留供複查。

`images/site-icon.png` 是既有小型 favicon，其前輪來源為生成 UI 的位元組複本，本輪保留。因此本報告只宣稱首頁主視覺與入口未請求節日生成插畫／UI 背景，不宣稱全首頁所有像素零 AI。原節日遊戲在明確點擊後仍可請求既有生成素材，尚待分批調整。本輪未對那些遊戲進行新的全套美術批准。

首頁導覽與既有招生連結在代表 Hero 畫面可見；沒有逐一驗全站連結與所有導覽目的頁。未重跑既有 84／2076 大矩陣、未測實體手機，未測勞動節；理由是本輪只改首頁與獨立策展示範，遊戲程式未變。
