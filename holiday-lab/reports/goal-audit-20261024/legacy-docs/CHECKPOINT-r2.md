# R2方法失敗保全

2026-10-24。兩個原始DOC未改、未重下載；尚未取得正文或表格全文。

- 首輪在Application.Hwnd為null時停止，Quit未用ref又失敗；專用空Word PID41452已經依PID／開始時間／不可見且未開檔guard清理，cleanup exit0，closed true。
- R2以PID差集證明唯一新instance23116；Visible false、window handle0、AutomationSecurity3、UpdateLinksAtOpen false、DisplayAlerts0均已保存。
- R2 Documents.Open發生PowerShell PSObject至COM Object封送錯誤，未讀到正文。不是文件損壞、授權或外部缺件證據。evaluation未嘗試開檔，不能說兩檔內容皆不可讀。
- R2 finally正確ref Quit已成功，office-stage為dedicated-instance-quit-no-save；後續無WINWORD。
- 當前「完整全文／表格讀取」no，原因是方法尚未成功，不把strings或CFB目錄當正文。

主控後續另授權一次純CLR C# Type.InvokeMember late-binding嘗試，另存attempt-r3；上述紅收據及階段結論保持歷史，不覆寫為成功。
