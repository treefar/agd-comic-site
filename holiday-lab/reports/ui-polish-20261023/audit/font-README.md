# 本機遊戲字型技術驗收

source_agent: codex。只讀本輪獨立代理的新最終84組真DOM收據，不開新瀏覽器、不執行勞動節、不修改或下載字型。

## 可重跑命令

字型工具已現跑確認：C:/Python314/python.exe，fontTools 4.63.0。Codex bundled Python沒有fontTools，本輪未安裝套件。

先核本機實檔與每個face的name table：

    C:/Python314/python.exe holiday-lab/reports/ui-polish-20261023/audit/font-coverage.py --inventory-only

再綁已完成的獨立run（替換精確result.json路徑）：

    C:/Python314/python.exe holiday-lab/reports/ui-polish-20261023/audit/font-coverage.py --receipt <本輪最終run/result.json>

腳本拒絕status=running的輸入；結果存在audit/font-coverage.json，含輸入SHA、script SHA、字型檔案SHA、每個face的family/full/PostScript/subfamily、逐語言codepoints與各樣式missing／unknown。

## 字型對映逐筆核對

本輪9份Windows實檔，16個face：msjh.ttc、msjhbd.ttc、segoeui.ttf、segoeuib.ttf、seguisb.ttf、SegUIVar.ttf、YuGothR.ttc、YuGothB.ttc、msgothic.ttc。每筆都從檔案name table讀出family與PostScript名稱，沒有憑檔名推定，也沒有從一個face外推其他face。完整metadata與SHA在font-inventory.json。

CDP實載名稱對映要求family與PostScript兩者都精確符合某一個name table face；找不到就列cdp_mapping_unknown。cmap排除.notdef。

## 驗證界線

1. stack_coverage_pass只代表本機已安裝候選系統字型cmap聯集涵蓋已採文字。另計observed_family_missing，避免只靠過廣候選聯集掩蓋實載family缺字。
2. 獨立runner每個state只抽一個CSS family的可見owner做CDP實載字型檢查，未逐字逐樣式檢查fallback。font-coverage.json明列actual_per_character_fallback_proven=false、actual_per_style_fallback_proven=false；每字實際fallback未知列數另列，不假裝0未知。
3. 原始row有family、weight、size與lineHeight，沒有單獨fontStyle欄；腳本不補造italic/normal證據。
4. 微軟正黑體UI的實載證據與候選字型cmap覆蓋是互補，不能提升成全站、所有裝置、字形連寫或像素級安全區通過。
5. 不以document.fonts.check代替字形覆蓋。沒有宣稱Noto Sans TC一定已安裝；它是CSS要求的字型，CDP記錄實際fallback。
6. 流程pass/fail使用獨立result.json原始狀態；字型覆蓋通過不會把流程失敗改成成功。使用者視覺確認仍獨立。

## 最終結果（03 build／8860）

實際命令：

    C:/Python314/python.exe holiday-lab/reports/ui-polish-20261023/audit/font-coverage.py --receipt holiday-lab/reports/ui-polish-20261023/independent/runs/2026-10-23T08-07-41-848Z/result.json

實際exit0。84contexts、1416states、31608可見文字rows、36組語言／family／weight／size樣式，1416份CDP owner抽樣；16faces／9份Windows檔案，解析錯誤0。輸入result.json SHA：414857a2aa086e055c7360107911ae48adbe61977e8060bb7d3810a8ec86668f。來源before/after相同，流程原結果pass。

| 語言 | 已採不重複codepoints | 候選stack缺字 | stack未知 | 抽樣實載family cmap缺字 |
|---|---:|---:|---:|---:|
| en | 85 | 0 | 0 | 1 |
| ja | 602 | 0 | 0 | 1 |
| zh | 687 | 0 | 0 | 0 |

stack_coverage_pass=true。CDP抽樣名稱Microsoft JhengHei UI / MicrosoftJhengHeiUIRegular，精確對應msjh.ttc face1；其name table與SHA已實讀，名稱對映未知0。這些抽樣不是每字／每weight的實際fallback證明；31608個文字row都沒有逐字actual-font對映，因此該層仍未知，不能與stack未知0混為一談。

en與ja在抽樣實載family的cmap聯集唯一缺項是U+2212「−」（真正負號）。本機Yu Gothic／MS Gothic已核face的cmap可涵蓋，故候選stack缺字仍0；沒有以這份報告斷言瀏覽器實際用了哪個fallback畫負號，也沒有把它當作已見方框的產品bug。保留既有字型，這輪不為補一份技術證據改已凍結03來源。

原始JSON保留每個語言codepoint、每個candidate face覆蓋／缺項、36組CSS樣式、1416份CDP實載owner範例、實檔SHA與全部範圍限制。全站、其他裝置、所有動態組合與使用者視覺確認均未升格。
