# TF-BASE 接續：背景建置與測試

2026-10-22，source_agent: codex。使用者已選擇在TF-BASE開Codex接工單，並明確要求避免反覆跳出Unity執行檔讓本人點選。

## 0. 執行範圍

沿用WORK-ORDER-index及兩款個別範圍鎖；原作/main唯讀，不push、不發布、不刪檔。先核對來源與可恢復副本，精確版本只用6000.5.10f1。沒有來源就先交盤點，不開空專案頂替。

## 1. 給TF-BASE Codex：執行方式

- 用守門JSON回傳的精確Editor絕對路徑，固定後沿用；不要開檔案選擇器、不要重複開Hub/Editor GUI，也不要用未限定版本的Unity.exe關聯啟動。
- 建置用`-batchmode -nographics -quit -projectPath <副本> -executeMethod <已實際存在的建置方法> -logFile <獨立日誌>`。建置方法先在副本內建立/實讀並驗證，不預填不存在的方法名。
- PowerShell啟動使用`Start-Process -WindowStyle Hidden -PassThru`，把含空白的路徑正確引號包好。保存PID、開始時間、log與目標產物，不啟動可見互動視窗。
- 已有相同Build程序時先查PID及log/產物是否持續更新；未證明停住以前不重啟。
- 測試以Unity Test Framework的批次`-runTests -testPlatform EditMode`或`PlayMode`、`-testResults`、`-logFile`執行；先核對該專案實際套件版本。不把不存在的測試或只編譯成功列成測試通過。
- 非圖形邏輯用EditMode測；場景生命週期用適當PlayMode測。需要圖形裝置的內容不能以`-nographics`結果宣稱畫面已驗；WebGL輸出再在本機Chrome實際驗載入、控制、開始/結束/重試/卸載及Console。
- 失敗只回exit/log/錯誤與精確阻礙；不要以反覆開Unity GUI讓使用者按確認代替診斷。授權/登入需要本人時才一次彙整說明，不能繞過安全提示。

## 2. 給獨立驗收者

逐條yes/no附命令：精確版本、單次背景PID/日誌、編譯/Build結果、測試XML、wasm MIME/壓縮header、兩款各自實玩。此文件是工作方式調整，未在TF-BASE執行，不能當成兩款Build成功證據。

## 官方依據（2026-10-22查核）

- [Unity 6.5命令列參數與batchmode/nographics/logFile](https://docs.unity.com/en-us/engine/6000.5/manual/unity-editor/command-line-arguments/editor)
- [Unity官方CLI測試指令](https://github.com/Unity-Technologies/skills/blob/main/skills/unity-cli/references/build-run-test.md)
