# 節日全面試作：獨立瀏覽器驗收

日期：2026-10-22。目標：`http://127.0.0.1:8800/holiday-lab/`。測試使用 bundled Playwright Chromium 1234；每例獨立瀏覽器 context，不匯入遊戲規則、不呼叫 ctx.complete、不寫遊戲 state。

## 第一輪：確實攔到整合錯誤

指令：

```text
node holiday-lab/qa/playthrough.cjs
PASS new-year zh 1440: completion, real artifact, 3 replay shots, retry, resources
FAIL lunar-new-year zh 1440: locator.fill: Error: strict mode violation: locator('#lny-brow') resolved to 2 elements
PASS lantern zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS children zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS dragon-boat zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS mid-autumn zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS teachers zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS national-day zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS semester zh 1440: completion, real artifact, 3 replay shots, retry, resources
FAIL exhibition zh 1440: locator.click: Error: strict mode violation: locator('#exhibition-info-1') resolved to 2 elements
PASS new-year en 390: completion, real artifact, 3 replay shots, retry, resources
FAIL lunar-new-year ja 768: locator.fill: Error: strict mode violation: locator('#lny-brow') resolved to 2 elements
TOTAL 9/12 passed; fail
exit code 1
```

失敗來自圖層與控制項重複 ID，影響 label 對應與唯一定位；未改成寬鬆 selector 掩蓋錯誤。已立即回報主控修正。年獸眉毛圖層偏高另列視覺修正。首輪 runId `2026-10-22T13-06-06-447Z` 的 stage/result/replay/failure 截圖全保留在 screenshots；完整 JSON 會由後續實跑保留於 previousRuns。

目視另抓到英文390px結果頁的文字壓框：`new-year-en-390-result.png` 中按鈕文字落在黑色底邊，頁面面板黑框穿過左側說明文字。已回報主控調整生成按鈕的安全內距／文字置中，以及大面板圖的尺寸用法；不能用無水平溢出的DOM測試宣稱這項已通過。

## 最新複驗

`.review-local-02` 完整複驗：`2026-10-22T13-20-56-816Z`，實際 Chromium `151.0.7922.34`。指令與最終輸出：

```text
node holiday-lab/qa/playthrough.cjs
PASS new-year zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS lunar-new-year zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS lantern zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS children zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS dragon-boat zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS mid-autumn zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS teachers zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS national-day zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS semester zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS exhibition zh 1440: completion, real artifact, 3 replay shots, retry, resources
PASS new-year en 390: completion, real artifact, 3 replay shots, retry, resources
PASS lunar-new-year ja 768: completion, real artifact, 3 replay shots, retry, resources
TOTAL 12/12 passed; pass
exit code 0
```

每例均實際執行以下檢查，逐例證據與玩家 artifact 在 `playthrough.json`：

| 驗收條件 | yes/no | 實際證據 |
|---|---|---|
| 10款中文以 DOM 操作完成 | yes | 10/10中文案例 status=pass，非直接呼叫規則 |
| 初始錯誤動作不能完成或前進 | yes | 12/12 initialWrongBlocked=yes |
| 圖層與按鈕／滑桿 ID 不再重複 | yes | 12/12 duplicateIds=[]；原年獸、畢展 strict mode 症狀消失 |
| 每款結果有實際玩家資料 | yes | 12/12 artifact 物件非空；如跨年三段 timing、中秋 cuts、畢展 works |
| 英文變體改變玩家作品 | yes | 英文跨年第一幕440/160/400，與中文400/180/380不同，最終 assert.notDeepEqual 通過 |
| 重播確實經過至少3個鏡頭 | yes | 12/12 replayShots=[0,1,2]，每例有replay-stage實際截圖 |
| 重新創作沒有舊進度 | yes | 12/12 retryFresh=yes；0/3且再次初始錯誤仍被擋 |
| 390px觸控與鍵盤替代 | yes | 英文跨年用touchscreen.tap按鈕；原生range ArrowLeft確實少10 |
| 英日實際說明翻譯 | yes | 英文 ny-instructions 與日文 lny-intro 文字斷言，不只看html lang |
| 暫停凍結動畫與禁止控制 | yes | 中文跨年暫停400ms角色style未變，controls.inert=true，再繼續完成 |
| 圖片解碼、Console／pageerror／requestfailed | yes | 12/12缺圖與三種錯誤陣列皆空 |
| 水平溢出 | yes | 1440／390／768共12案例 horizontalOverflow=false |
| 修正後按鈕文字／面板內距 | yes | 已實際檢視新版英文390結果PNG，舊按鈕壓底邊與頁面框穿字症狀未再出現；非美術定稿確認 |
| 年獸五官對位舊症狀 | yes | 已實際檢視新版中文1440及日文768舞台PNG，眉毛未再浮於頭頂上方；非美術定稿確認 |
| hint左右黑網點與文字淨空 | yes | `.review-local-03` 中英390px已逐張實看：hint改用九宮格淨空面板，舊網點覆字症狀未再出現；見下節 |

runner、catalog、10個遊戲模組的實際 served SHA-256 與瀏覽器版本同存 JSON；不是以工作目錄推測受測版本。

## CSS最後複驗

主控 `.review-local-03` 只改 hint／marquee CSS。已核對最新 runner、catalog、10款模組 served SHA-256 與完整12案例那輪逐筆相同，`playthrough.json.preservedFullMatrix.javascriptSha256Unchanged=true`，因此保留完整矩陣；只重跑受影響的手機390px中文／英文跨年。

```text
node -e "process.env.HOLIDAY_QA_GAMES='new-year';process.env.HOLIDAY_QA_LANG='zh';process.env.HOLIDAY_QA_WIDTH='390';require('./holiday-lab/qa/playthrough.cjs')"
PASS new-year zh 390: completion, real artifact, 3 replay shots, retry, resources
TOTAL 1/1 passed; pass
exit code 0

node -e "process.env.HOLIDAY_QA_GAMES='new-year';process.env.HOLIDAY_QA_LANG='en';process.env.HOLIDAY_QA_WIDTH='390';process.env.HOLIDAY_QA_VARIANT='1';require('./holiday-lab/qa/playthrough.cjs')"
PASS new-year en 390: completion, real artifact, 3 replay shots, retry, resources
TOTAL 1/1 passed; pass
exit code 0

node --check holiday-lab/qa/playthrough.cjs
(無輸出)
exit code 0
git diff --check
(無輸出)
exit code 0
```

| 最後驗收 | yes/no | 證據 |
|---|---|---|
| 手機中英 hint不再疊黑網點 | yes | 實際檢視 `2026-10-22T13-27-48-760Z-new-year-zh-390-layout.png`、`2026-10-22T13-28-03-396Z-new-year-en-390-layout.png`，文字置於淨空內區 |
| 英文390結果按鈕／說明未壓框 | yes | 實際檢視 `2026-10-22T13-28-03-396Z-new-year-en-390-result.png` |
| 手機上鍵盤離開重播 | yes | 中英案例皆 focus replay-back 後 press Enter，返回結果並能retry |
| 離開遊戲回列表、10款入口仍可見 | yes | 中英案例 exitArchive=yes，實際點leave-game後數到10個open按鈕 |
| CSS版號指紋 | yes | 兩語均 `afac35d566a0eb304689d3feb37dd9882961e25282de6ee415dea4dad7694559` |

所有歷次JSON都在 previousRuns 保全，截圖檔案不刪；目前無本次DOM／手機代表視覺複驗的未解阻斷問題。這不代表使用者已確認美術，也不代表完成正式發布驗收。

## 範圍與限制

- 已逐張實際讀取10款 stage 截圖，觀察生成素材是否有缺漏與角色／物件對位；這不是使用者美術確認。
- 中文10款1440px；英文跨年390px使用 touchscreen.tap 按鈕及鍵盤原生滑桿；日文年獸768px。
- 斷言包含錯誤操作不前進、真實DOM通關、玩家 artifact、重播至少3鏡、重開清進度、圖片解碼、Console／pageerror／requestfailed、水平溢出、三語代表字串。新腳本另加入所有 DOM ID 唯一性檢查。
- 每例 reduce motion；非減少動態、音訊聽感、實體手機、原網站首頁與正式部署不在此回歸範圍，交由主控另驗。
- 只修改 QA 所屬檔案，未 push、未碰 main、未刪檔、未改遊戲／runner／交接C節。
