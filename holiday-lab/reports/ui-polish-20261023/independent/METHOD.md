# 獨立驗收方法

僅寫本目錄；不修改產品、歷史權威、C 節。14 款非勞動節遊戲，中／英／日 × 320×900、1440×1000，共 84 個明列情境；最多三個獨立 headless context 並行。

使用逐位元組副本 `phase-driver.cjs` 的已知解真按鈕／滑桿操作，不匯入遊戲規則、不改遊戲狀態或時鐘。每組測 intro、menu、help、settings、initial、故意失敗、各階段、完成結果、三段重播（開學四段）及重試；每組五張全頁 PNG。這是已知解回歸，並非學生盲測。

`measure.cjs` 唯讀量測實際 DOM Range 行盒、控制項邊界、hidden/clip 裁切、整頁橫捲，另列中日文單一文字加標點末行。最終 v2 必須所有孤尾數為零才 pass。量測器的故意外溢／裁切／孤尾正反例在 `measure.test.cjs`。

`run-v2.cjs` 等待每個圖片 decode、檢查 complete/naturalWidth，等待 `document.fonts.ready`，並保存各狀態每種 CSS family 一個代表節點的 CDP 實際字型；代表節點不是全字元無缺字證明。字元 cmap 檢查由另一獨立來源稽核代理另外產出。Range 是實際排版行盒，不冒稱精確 glyph 墨跡或所有生成底圖內框／特效圖層安全區驗證。

合法分數由實際產品 result builder 的公式逐款核對，完成畫面、儲存作品三份（開學四份）與顯示分數必須一起符合。先故意失敗後，元宵／端午／國慶正常為 96、教師節正常為 97；不能要求全部 100。`completion.test.cjs` 含分數及作品數量負例。

第一批 84 保留原 RED：24 筆是我方過嚴 100 分前提，兩筆是實際開學英文提示與指南搜尋標題不一致，另行憲日文窄版長說明有單字末行。修正後使用全新 03 建置重跑完整 84，不混用原批或 pilot 為最終通過。

所有測量、圖片與 sources before/after 落地；每 case 完成即寫 checkpoint。`verify.cjs` 唯讀重核結果、狀態、作品、圖片、實際字型載入與檔案 SHA。`verify-negative.test.cjs` 在記憶體偽造摘要來驗證拒絕路徑，不改任何原始收據。

這輪不聲稱全動態組合、精確墨跡、實體裝置或完整 UI gate/canonical 通過；不發布、不打包、不推送。
