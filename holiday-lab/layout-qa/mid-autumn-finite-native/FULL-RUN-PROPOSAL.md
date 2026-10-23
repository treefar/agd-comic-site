# 全集候選方案：僅供主控評估，尚未批准或啟動

前提：720／10第二先導相同，原始法與AST擷取法均保留。這份是執行與獨立複驗規格，不是已完成的run工具或全域證明。

1. 凍結08／8845原6context、原module與字串域／排序／集合SHA、sampler／map、generated擷取及39片段SHA、Chrome版本／DPR／Windows字型檔／CDP完整允許字元、clone DOM結構與computed invariants。任何變動中止該批，不混用不同源收據。
2. 重新計算67,448個去重tuple（保time-x依賴）後，每context完整連續index 0…67447。以512個候選為一checkpoint；一次browser內native batch約數秒，返回後才交接／輸出進度，不開未受控全夜背景程序。六context共約792批；未批准平行多瀏覽器，先維持單一順序做法以保持環境可辨認。
3. 每批前後完整frozen source／font／skin／全字元CDP驗證；候選內原AST的Range／baseline／Canvas／clip／safe及invariant guard仍逐候選執行。每批保存連續index範圍、count、rolling tuple＋文字SHA、逐例最小行/ink/safe必要數據與各極值完整witness。checkpoint落地完成、SHA可重讀後才進下一批；中斷僅從最後完整批續跑，殘批不當完成。
4. 第二先導現在是120候選batch返回後逐值比舊完整結果，觀察無差異；正式run應改為每候選即時執行有效性／有限數值／source invariant拒收，並按已校準方法保存。任何不符先停止NO，不將一整批當成pass吞掉錯誤。
5. 観察極值要分開保存left/right/top/bottom安全餘裕、ink寬高與行數，不能宣稱同一訊息同時達全部最大值。收尾所有候選count／index／去重集合hash／缺口檢查通過後，逐context把全部極值witness放回原真UI輸入與原完整frozen採樣，不能只交clone截圖。
6. 獨立代理不使用fast工具作主要複驗：從served source重算純域與集合SHA，核對每context 67,448完整覆蓋、批次斷點／rolling hash、所有來源／字型收據；重跑10固定真例＋每context極值的完整frozen原法。另以預先固定seed抽128 tuple／context用完整函式核對fast原數據，任何差異退回NO。這些抽樣不能取代主run的全覆蓋。

成本：第二先導純720候選batch約4.68秒，按context差異估全量43.83分鐘；加每512批次前後full/source/font驗證、資料持久化、極值真UI及獨立複驗後必然更久。可先設定90分鐘觀察預算，中途以實際批吞吐更新，不承諾固定完成時間。沒有從快算法推出跨字型、跨瀏覽器或全遊戲UIgate。

資料量需在啟動前由主控決定：原完整輸出密度粗推約2.79GB；正式run可保存逐例必要數值與hash、極值保完整資料，須明列哪些欄位未保留，不能將精簡輸出冒充原完整sampler報告。單純hash不證明測過；需連同可重跑完整遍歷程式、索引覆蓋、原始收據及獨立複驗。

目前只有有界先導工具，**沒有全量啟動入口，沒有排程、沒有新程序，也未宣告GLOBAL_BOUND=YES**。
