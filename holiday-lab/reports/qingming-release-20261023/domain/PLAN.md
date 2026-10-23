# 清明當前錯誤文字域：最小可審方法

此處只建立 source-derived domain、正常 UI 的候選 action recipe 與純測試。沒有 browser runner、原生最長字形證明或發布批准。`scope.json` 的所有 native／layout／canonical／global 旗標維持 false；不能以檔案名或 1392 數字當成已完成覆蓋。

## 已閉合的來源範圍

- 原 game／runner／catalog／lab.css／ui-layout-contract 五份來源逐 SHA pin。game AST 稽核 status 四個寫點、hint 兩個寫點；唯一 missed-window status 是固定三語 literal，數值相依為空。
- angle 有 61、length 有 101、tension 有 51 個候選 range 格點，共 213 個獨立 owner 字串。聯合格點 314211；`String(i/50)` 只是期望字串，尚未證明 browser range／浮點 stepper 的實際正規化。
- missed-window 後 running=false；改滑桿只改 draft 與自身 output。retry 保留 error status、改 hint；pause 改成 paused hint、resume 改回 catalog blurb。phase0 可有 blurb／retry／paused，phase1、2 另可有 next，共 11 個合法可見模式；音效按鈕兩態獨立，共 22。
- 每個候選模式都有 recipe：從新 mount 使用真來源 callback 與固定 dt=.1 自然成功換段，再自然飛出雲窗；不建立自訂 phase／error state、不改 DOM。runner pause/audio 只在純模型中依 pin 住的來源模擬，明列非 browser 證據。
- 28 個 gameplay 文字 owner 是來源預期數量：toolbar 4 連結＋音效 1；header 3；pause/leave 2；progress/hint 2；help/status 2；slider label 3／output 3／stepper 6；play/retry 2。未來要以實際全文 DOM census 對 sample，不符合或多出未知 owner 即停止；不能只採六個 target。

## 下一個有界校準，尚未授權執行

1. 獨立代理審新方法與相同 valid-plan harness 的負例；主控確認後，另開不可覆寫的新 run。禁止重用 v3／08 的通過旗標或替舊失敗補收據。
2. 凍結 8863 實際 HTTP bytes 與當前原檔、method、sampler、安全區、底圖、browser/runtime、字型檔。source/font before-after、原 Console/page/HTTP/CDP Network 診斷不清空；晚到錯誤或缺 after 即未完成。
3. 六個合約 context：zh/en/ja × 320×900、1440×1000。每次文字／值／模式改變後 force layout → await document.fonts.ready → assert loaded，再取得全文 Range／ink／CDP fonts／PNG；擷取前後再核字型與布局穩定。
4. 每個 context 以真控制從正常開始到自然 missed-window。每軸全部候選值做 direct range 觀察 213 筆；每軸從 min 正向加到 max，再反向減回 min，共 420 個 stepper transition。每筆逐 owner 比對 input.value、output.textContent、完整值集合唯一性，保留原事件與來源時間。這個小步驟先決定「原生字串域」是否成立，不憑 serialization 觀察宣稱墨跡上界。
5. 若要主張布局分離，每筆還需觀察全部文字 owner、Range 行、真 platform fonts、unclipped ink／safe 與 output/row/group/controls/paper 的尺寸、相對位置。所有必要不變項要精確相等，不用 .01px 等任意容差。完整原 sample nodes/blockers/flags 不丟棄；任一原始 ink observation 必須對應自己的完整原生 viewport PNG，不能由別張圖補像素。未跑此層就維持 layout_factorization=false。
6. 22 個 phase/hint/pause/audio 模式的真 UI 到達、全 owner、hint/toolbar 造成的文件 y 位移、桌面 controls 捲動與 window 捲動仍須各自觀察。每段文字都必須在正常捲動下完整可讀；不能以單張超長圖、crop 或清 hidden_scroll_text 旗標代替。
7. 只有上述來源＋原生分離義務成立後，211 個不重複單軸 anchor 配置＋其餘 21 個聯合模式 baseline 才形成 232/context、1392 的**條件工作候選**。目前未證這個縮減足以代表所有合法布局；也沒有 full 執行器。若依賴不變性失敗，精確列受影響 owner／值／模式重新分析，不自動掃幾百萬組。
8. 上界以各 owner／語言／viewport／適用布局的實測 unclipped ink width、height、area、四邊極值與 ties 選出；字數、String 長度不參與選取。每個極值都需要正常 UI 見證與原畫面。不同合法畫面的極值分開保留，不拼接不存在的 super-frame。

## 仍不在本輪完成範圍

實機觸控／使用者美術審閱、完整按鈕 hover/pressed/focus/inert paint order、所有捲動位置、result-artifact 與 replay 不由本來源域通過。物理路徑／時間／重試次數可持續成長，但沒有進入本遊戲內 error 文字；這只能排除它們對 error 字串的相依，不批准其他頁面。

本輪沒有 native/browser/HTTP、沒有改產品、舊方法／raw／canonical／正式合約、C 節或勞動節。準備重算命令：

```text
node holiday-lab/reports/qingming-release-20261023/domain/prepare.mjs
```

命令只會在新 `preparations/<UTC時間>/` 寫 plan、freeze、測試 stdout 與十組來源範例，不會啟動 browser。
