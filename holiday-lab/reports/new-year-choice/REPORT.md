# 跨年動作：從對數字改為表演 brief

2026-10-22，source_agent: codex。獨立工作樹 `C:/agywork/agd-newyear-choice`，分支 `codex/newyear-choice`，從 `codex/holiday-prototypes` 的 `904ac79` 開始。只修改跨年模組、其測試及本報告資料夾；不啟動 Unity、不 push、不碰 main、不刪檔、不打包。

## 玩家現在做什麼

1. **俐落跨門**：看起步、空中、落地的視覺節奏，把騰空剪得明顯短於前後，仍讓落地看得清楚。
2. **留住騰空**：同一動作換一種導演意圖，把時間留給越過新年門的瞬間，前後仍有可讀的動作。
3. **我的收尾**：玩家選「期待起步／享受騰空／站穩落地」，再剪出這種心情。選擇會改變第三幕的完成條件與保存的作品，不是只換一組指定數字。

起步使用既有蹲身 Sprite 的重心變化，騰空經過連續弧線，落地收住並停留；三張既有關鍵格小卡標出正在播放哪一段。預設靜音也能觀察。減少動態模式保留三個可讀靜態姿勢的切換。

輸入框顯示玩家目前的毫秒數；介面不列固定答案。每次完整預覽後直接回饋可見問題，例如「空中的動作來不及看清」或「空中還不夠醒目」。換幕保留目前數值；更改時間或意圖後都需要重新完整預覽。失敗次數只留紀錄，不扣隱藏分。

## 規則與可行性

維持目前滑桿 80–700ms、步長 10。可讀性下限是起步 160／騰空 140／落地 180ms，整體 800–1900ms。第一幕的空中時間不超過前後較短者的 75%；第二幕空中至少為前後較長者的 125%；第三幕玩家選的段落至少為另外兩段較長者的 130%。

這些是寬的可讀性與比例條件，沒有距離某組中心值多少分的算法，也沒有唯一的最佳毫秒數。有效作品給 100 表示三個 brief 達成，並非替創意或美術品質評滿分。

| 完整作品 | 第一幕 | 第二幕 | 第三幕／意圖 |
|---|---|---|---|
| A：較短的一躍，最後保留期待 | 360／180／360 | 240／600／240 | 600／220／260，期待起步 |
| B：較長的蓄勢，最後站穩 | 560／240／400 | 320／680／300 | 220／240／620，站穩落地 |
| C：手機日文代表作 | 360／180／360 | 240／600／240 | 240／620／260，享受騰空 |

A 與 B 第一幕完整長度不同、第三幕意圖與主導動作也不同，均由 DOM 操作完成。回放的 9 個鏡頭使用實際保存的時間與連續位置 frames；A、B 回放進入第一幕約 200ms 時的位置不同，詳見 browser.json 的 replayFirstPosition，作品資料與畫面均不同。

## 十組代表性輸出

完整指令輸出資料：[ten-combinations.json](ten-combinations.json)。逐組檢視如下，包含三種第三幕意圖，未只看語法成功。

| 幕 | 時間：起步／騰空／落地 | 意圖 | yes／no | 語意 |
|---|---|---|---|---|
| 1 | 360／180／360 | 俐落 | yes | 空中短，前後看得清楚 |
| 1 | 560／240／400 | 俐落 | yes | 蓄勢較長，仍是俐落一躍 |
| 1 | 350／350／350 | 俐落 | no | 三段一樣久，空中沒有短促感 |
| 1 | 700／600／700 | 俐落 | no | 整體拖長，先縮短非重點 |
| 2 | 240／600／240 | 飄浮 | yes | 空中主導，前後可讀 |
| 2 | 320／680／300 | 飄浮 | yes | 另一組較慢的飄浮作品 |
| 2 | 500／300／300 | 飄浮 | no | 起步比空中長，沒有留住空中 |
| 3 | 600／220／260 | 期待起步 | yes | 蹲身準備主導 |
| 3 | 240／620／260 | 享受騰空 | yes | 空中主導 |
| 3 | 220／240／620 | 站穩落地 | yes | 最後姿勢主導 |

另測 799／800ms 與 1900／1901ms 邊界、75%／125%／130% 比例邊界、最小可讀時間、滑桿範圍、NaN／Infinity、未知意圖與完成後再次送出。三種意圖都在現有滑桿範圍內有多組解；沒有無解選項。

## 紅綠證據

先新增六個規則測試，舊模組缺少 `BRIEFS` 匯出而 exit 1。另直接檢查原規則：360／180／360 接受、560／240／400 被原 ±65ms 規則拒絕，保存於 [old-rule-red.json](old-rule-red.json)。新模型讓兩者都成為有效但不同的俐落作品，並以不同動作主導第二、第三幕。

舊測試的 `TARGETS` 引用先完整搜尋，確定只由原模組及其測試使用，才改成表演 brief fixture；歷史驗收報告與其它遊戲未修改。

```text
node --test holiday-lab/tests/new-year-choice.test.mjs
SyntaxError: The requested module '../games/new-year.mjs' does not provide an export named 'BRIEFS'
tests 1, pass 0, fail 1
exit code 1

node --test holiday-lab/tests/new-year*.test.mjs
tests 15
pass 15
fail 0
exit code 0

node holiday-lab/build-review.mjs .review-newyear-choice-01
UI policy: pass true, assets 257, screens 9, errors []
REVIEW_ONLY: .review-newyear-choice-01; 356 files; no publication performed.
exit code 0

node holiday-lab/reports/new-year-choice/browser-test.cjs
YES A: 3 briefs, pointer; intent=launch; replay=9; muted=yes; retry=yes
YES B-keyboard: 3 briefs, keyboard-only; intent=landing; replay=9; muted=yes; retry=yes
YES C-flight: 3 briefs, pointer; intent=flight; replay=9; muted=yes; retry=yes
YES B-reduced: 3 briefs, pointer; intent=landing; replay=9; muted=yes; retry=yes
TOTAL 4/4; page/errors=0
exit code 0

$env:NY_CHOICE_CASE='B-keyboard'; node holiday-lab/reports/new-year-choice/browser-test.cjs
YES B-keyboard: 3 briefs, keyboard-only; intent=landing; replay=9; muted=yes; retry=yes
TOTAL 1/1; page/errors=0
exit code 0
```

Build 有既有 SSR／client color 重複 key 警告。建置重產的 locale-en.js、locale-ja.js、latest-build.json 不納入本次提交；沒有順手修改共用檔。沒有打包，也沒有製作或偽填文字 safe／ink 資料。

## 逐條驗收

| 條件 | yes／no | 實際證據 |
|---|---|---|
| 三幕具有不同 brief，第三幕新增玩家意圖取捨 | yes | 新規則、三種意圖純測試、四次 DOM 完成 |
| 不再要求某組毫秒值 ±65 | yes | 無 TARGETS／距離評分，兩組不同完整作品通過 |
| 失敗指出具體可觀察的動作問題 | yes | A 的 feedback：「空中的動作來不及看清。替騰空多留一點時間。」 |
| 失敗、換幕保留目前滑桿數值 | yes | invalidRetainsValues、retainedAcrossBriefs 與三語 mount 測試 |
| 更改意圖後不能沿用舊預覽送出 | yes | changedIntentInvalidatesPreview、三語 mount 測試 |
| 靜音與完整鍵盤操作可完成 | yes | keyboard-tabs.json：以 Tab 找到各控制項，再用 Home／方向鍵／Enter，未用程式 focus；四次作品 Audio.play 均 0 |
| 實際選擇與時間留在成品，兩作品有異 | yes | browser.json 的 artifact、9 鏡字幕、回放位置與 twoDistinctWorks |
| 明顯失衡被拒、三種意圖都有解、邊界已測 | yes | 15 個純測試、十組實際輸出 |
| UI 素材來源檢查 | yes | 既有 257 張候選，ui-policy pass；沒有新生圖或程序 UI |
| 最新文字安全區閘門與整合發布驗收完成 | no | 需主控合併後由 layout 專員用真新字串採樣，未偽填 safe |
| 真人學生盲測、30–90 秒學習體驗、美術已獲使用者確認 | no | 只有已知解法的代理 DOM 驗證，不能取代真人觀察 |
| 原 P1-03「至少三款改善」已整體完成 | no | 本次只有跨年一款落地，另外兩款為下列具體後續方案 |

已實看中文桌機及日／英文手機第三幕截圖，仍須整合版文字墨跡／安全區檢查。可重跑瀏覽器測試只啟停自己的 8807，沒有干預原有本機伺服器。[browser.json](browser.json) 保存原始結果、實際 runtime SHA 與玩家作品；截圖保留錯誤、第三幕及成品。

## 給 layout／整合者

- `ny-hold-0/1/2`、`ny-preview`、`ny-submit` 保持原 ID；新增 `ny-pose`、`ny-observation`。
- 第三幕才顯示 `ny-focus`，選項 `ny-focus-0/1/2` 分別為 launch／flight／landing，另有 `ny-intent` 說明。
- 採樣需包含三種意圖、最長錯誤回饋、完整試播後的成功回饋、三語與結果／回放字幕。A、B、C 的精確 DOM 解法在 browser-test.cjs；請勿再用舊第二幕 320／140／320 解法。
- source freeze 的測試 runtime SHA-256：`a6203561b7d3712508f213baceda92e4de4b4979ddb9bedbbbbe750d1ed9e950`。Git 換行正規化後應在整合工作樹重新取 hash，不能直接抄本值當該樹指紋。

## 另外兩款：只規畫，未修改

| 款式 | 實質抉擇與可見因果 | 實作順序與驗收 |
|---|---|---|
| 年獸表演課 | 先從眉／眼／嘴的相互關係辨識驚喜、安心、禮貌；第三幕讓玩家選「誇張喜劇／含蓄問候」，而非四個參數對單一角度。允許兩種明顯不同的驚喜表演，保留原表情 rig，不扭曲臉部。 | 先定義可感知的關係與幾何安全範圍，再以三種情緒各至少兩組有效表情作 red/green；DOM 試看→改一個表情部位→反應不同→選意圖保存；回放須保留實際 rig 參數，誇張表情不能只因偏離唯一角度被拒。 |
| 新生第一張地圖 | 讓學生先選「我要辦什麼」，判斷應找哪個窗口；地圖只呈現虛構漫畫動線，避免把照座標移動當成懂得辦事。第三幕可依任務選不同辦理順序與窗口。 | 先逐項核對現有在校指南的窗口／來源，再做至少兩種有效任務路徑與一個錯誤窗口回饋；錯誤應說明為何及下一步，不只扣分。DOM 需由任務→窗口→正確指南連結完成；保留虛構地圖標示，不能冒稱真校園導航。 |

以上兩款尚未實作或驗證，不宣稱整體 P1-03 已關閉。真人學生仍需觀察是否能不看數字答案理解、嘗試並做出自己的作品。
