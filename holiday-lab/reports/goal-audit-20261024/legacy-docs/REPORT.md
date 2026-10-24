# 兩份舊DOC離線全文解析：方法未完成

2026-10-24。兩個原件均未更動，已確認是真正OLE／CFB Word二進位容器；但正文與表格全文仍未成功取得，不能解除這個缺口。阻礙是本輪Word COM參數封送方法未成功，並非已證明文件損壞、密碼／授權限制或外部來源缺件。

## 逐項判定

|項目|yes／no／unknown|實際結果|
|---|---|---|
|兩原件完整存在且SHA未變|yes|認定表31744 bytes、評分表43008 bytes，開始／結束均同既存官方取得收據。|
|是真正OLE Word容器|yes|皆有D0CF11E0A1B11AE1簽章；解析CFB目錄實見WordDocument、1Table及Data stream，sector512。不是用副檔名猜測。|
|認定表完整正文／所有表格欄位|no|Open尚未成功，沒有Content.Text或WordOpenXML；欄名、欄數、申請條件、期間時數及簽核全文均未核，不能從strings補造。|
|實習單位評分表完整正文／所有表格欄位|no|共同方法在認定表Open階段即失敗，評分表未開檔。評分構面、權重、分數與核章全文未核，不可說此文件本身不可讀。|
|本系115／本屆適用|unknown|即使取得舊表全文，也還需當屆適用依據。本輪沒有擴搜或取得這項依據。|
|隱藏專用instance與安全設定|yes|R2、R3均以開工前後唯一新PID證明ownership、before為空；Visible=false、window handle0、巨集3、警示0、外鏈更新false。未接管使用者文件。|
|所有Word程序已清理|yes|最後實查WINWORD為0；所有本輪已知PID均終止，完整命令輸出留存。|
|8881、QA、原DOC及產品變更|no|沒有變更；全部產出只在本責任目錄。未重下載、未安裝工具、未啟Unity或遊戲。|

`verification.json`的7 yes／0 no只代表證據保全、原件不變與方法失敗紀錄完整，並非全文通過。該檔技術欄位`applicable_115:false`表示尚未證成適用，不是已證明不適用；正式判定是unknown。

## 原件與來源

|文件|已保存的官方檔案連結|SHA-256|
|---|---|---|
|產業實習認定表.doc|[官方既存檔案](https://drive.google.com/file/d/14EY2jX1vdtioFvu5M2D2m6BW3l__k0SC/view)|4d62ff2e208f59094897b033d55387b5ac9c077422ccb687d1679c23b8a5db22|
|實習單位評分表.doc|[官方既存檔案](https://drive.google.com/file/d/1ziRTsQMZHaTYeyVGUHDKtQfrtZTvaclr/view)|741c7f463943dafc1ba7680d876f544201427fd35e679479ab9a9a3bbb17255d|

本地輸入為`guide-final-docs-20261024/internship/raw/department-recognition.doc`及`department-evaluation.doc`。來源與歷史修改時間沿用`internship/department-recognition.json`、`department-evaluation.json`，沒有重取或把連接器可讀改稱新驗匿名權限。

## 現成工具盤點與方法

已讀既存internship REPORT／matrix及來源收據，未重新調研實習政策。workspace dependencies提供既存Python／Node；所檢入口中，PATH沒有antiword、catdoc、soffice、pandoc，常見LibreOffice路徑亦未找到。bundled Python未有olefile、compoundfiles、oletools、textract、win32com、comtypes、pypandoc或extract_msg；bundled Node未有word-extractor、officeparser、mammoth、textract或cfb。這只是本次所檢入口，不宣稱整台電腦任何位置絕無其它工具。

已安裝Word位於`C:/Program Files/Microsoft Office/root/Office16/WINWORD.EXE`；實際COM回報版本16.0。因此先使用既裝Word，不安裝額外工具。只準備讀責任目錄內等SHA副本，沒有開原件。安全參數原廠說明參考Microsoft [Documents.Open](https://learn.microsoft.com/en-us/office/vba/api/word.documents.open)、[AutomationSecurity](https://learn.microsoft.com/en-us/office/vba/api/word.application.automationsecurity)及唯讀[WordOpenXML](https://learn.microsoft.com/en-us/office/vba/api/word.document.wordopenxml)，查核2026-10-24；文件說明不替代實際COM成功證據。

### R1：方法錯誤，保留原紅

`extract-office.ps1`試圖讀取Word Application.Hwnd，取得null後轉IntPtr失敗，尚未開檔。finally又因Quit(0)需要PSReference而失敗。原`office-error.json`及`office-command.json`保留exit1，沒有覆寫。

新建的專用空Word PID41452，開始於2026-10-24T02:54:46.2222844Z，與stage建立時間吻合，main window handle0、空標題、開工前無Word。依唯一PID／開始時間／未進開檔階段guard，僅清理該空instance，沒有kill所有Word。`cleanup-command.json`stdout及`cleanup-result.json`記closed:true、remaining_word_ids:[]、exit0。

### R2：PowerShell到COM封送未成功

另存`attempt-r2/`，改為前後唯一新PID ownership與Open／Close／Quit明確ref。專用PID23116及所有隱藏／安全設定已保存於office-instance。

Documents.Open實際錯誤：

```text
Cannot convert the ... input-recognition.doc value of type psobject to type Object.
```

`office-r2-command.json`保存完整stdout、stderr、exit1。finally使用ref Quit成功，stage為dedicated-instance-quit-no-save。未讀認定表，評分表尚未嘗試。

### R3：一次純CLR late-binding修復仍未成功

依主控授權，另存`attempt-r3/`，由C# `Type.InvokeMember`及純`object[]`／string／bool／Type.Missing封送，避開PowerShell byref。新專用PID44704，before空，Word隱藏且安全設定同上。

Documents.Open實際錯誤：

```text
System.Reflection.TargetInvocationException
System.Runtime.InteropServices.COMException: Type mismatch.
HRESULT: 0x80020005 (DISP_E_TYPEMISMATCH)
```

`office-r3-command.json`保存完整stack／stdout／stderr／exit1。沒有取得Content.Text或WordOpenXML，也沒有輸出虛構表格。

Quit已執行。C#立即寫下的`attempt-r3/process-after.json`曾為running:true；稍後唯讀查詢已為0，屬退出時差，原記錄保留。最終`final-process.json`與命令收據證明全部已知PID及WINWORD皆空。沒有再啟Word、沒有新安裝或無限重試。

## 實際命令與收據

下列每條均已實際執行，完整可重現參數、stdout、stderr與exit code在對應JSON；原失敗不能重跑到同一輸出路徑覆寫。

|指令|收據|實際exit|
|---|---|---:|
|`node run-office.cjs`|office-command.json|1|
|`node run-cleanup.cjs`|cleanup-command.json|0|
|`node run-office-r2.cjs`|office-r2-command.json|1|
|`node run-office-r3.cjs`|office-r3-command.json|1|
|`node run-inspect.cjs`|inspect-command.json|0|
|`node run-verify.cjs`|verify-command.json|0|

擷取嘗試stdout只有creating／opening／quit階段，沒有SUCCESS documents或正文輸出。CFB檢查stdout列出真目錄的WordDocument、1Table、Data等stream，不是對檔案做strings，也不把目錄當全文。最後保全驗證stdout為7 yes／0 no，stderr空。

所有PowerShell／C#腳本均ASCII原始碼，擷取文字若成功原本預定另存UTF-8，沒有在JSON寫BOM。實際Word測試宿主為Windows PowerShell，未宣稱跨機／PowerShell7 COM行為皆已驗。

目前不提供產品文案變更或規則提案：因未讀到正文，不能精確核對本系申請及評分欄位，更不能將舊表套成115規定。剩餘工作應記為「DOC解析方法待修」，不要誤列成校方檔案不存在或網站功能壞。原件與失敗證據已保全，本段停止。
