# TF-BASE 關機前回傳查證

截至 **2026-10-23 19:49:30（台灣；11:49:30 UTC）**，指定[WebGL交接資料夾](https://drive.google.com/drive/folders/1AyLeNipIEaKPWxgy685eLpuldnlIEsiD)可讀，仍只有5份原工單／腳本，沒有子資料夾、Build log或已回傳WebGL產物。此結論來自本輪兩次新list_folder，不把10:06 UTC舊觀測當目前狀態。

兩份工單本輪實讀仍標SOURCE_UNAVAILABLE，修改日為10月22日。父資料夾本輪也只列該交接folder。關聯名稱及近期WebGL相關folder搜尋未找到新的回傳資料夾，但不是宣稱TF-BASE本機、其他Drive位置或壓縮檔內沒有WebGL。

## 另外找到的舊候選

| 名稱 | 大小 | 修改時間 | 判定 |
|---|---:|---|---|
| [Flora.rar](https://drive.google.com/file/d/1Q66coUuLUypX3m8-Os4ezOYUz9918Cl4/view?usp=drivesdk) | 311,710,087 bytes | 2023-05-16T13:48:57.000Z | 舊壓縮檔；未下載核內部，不當本次WebGL回傳 |
| [FloraCorgi.zip](https://drive.google.com/file/d/1U5f8aXImEnZDAv9_dDCNXV_mvg-MzJd6/view?usp=drivesdk) | 5,679,467,534 bytes | 2026-04-11T15:57:20.705Z | 舊壓縮檔；未下載核內部，不當本次WebGL回傳 |
| [Flora.rar](https://drive.google.com/file/d/1LUDRZyxBgT9V6fKPLW_h9uBmYy86n9ti/view?usp=drivesdk) | 557,980,294 bytes | 2026-04-11T15:57:04.820Z | 舊壓縮檔；未下載核內部，不當本次WebGL回傳 |

較早[Flora目錄](https://drive.google.com/drive/folders/1fqcb9Ndexm-so52k0djr6mO3LKV6QGz1)可讀到Assets／Packages／ProjectSettings及其他Unity形式檔案；僅是舊來源候選，尚未核作品身分與完整性。本輪未深入Library／Assets、未開Unity，也未取5.68GB的同名壓縮檔來臨時建置。

## 本輪可核對的結果

| 項目 | yes／no | 證據 |
|---|---|---|
| 當前交接folder新查詢成功 | yes | 11:47:41及11:49:30 UTC皆5項，真metadata見01／05 JSON |
| 相對舊metadata是否仍同五項 | yes | id/title/mime/size/modified逐筆完全相同；不是引用舊值冒充新查詢 |
| 可見WebGL index／loader／wasm／data完整組合 | no | 指定folder只有五份工單／腳本；未有可驗清單 |
| 本輪可直接把兩款整合進站 | no | 尚無已確認WebGL產物；不使用未核壓縮檔冒充 |
| 已證其他地方完全沒有來源或WebGL | no | 未做全域完整盤點；相關搜尋有MIME限制 |
| 下載大型檔／啟Unity／重送工單／修改分享／發布 | no | 均未執行 |

已連接Google Drive工具在本代理可用，帳戶link_id來自工具自身明列的帳戶metadata，沒有猜ID。個人Drive列出五項；學校帳戶對同folder回空，該空結果只代表此帳戶查詢範圍，不代表其他帳戶亦空。一次關聯搜尋因自寫raw q語法錯誤回400，保留02證據；改正語法後03成功，未將查詢失敗當作未回傳。

實際採證：list_folder（指定folder及parent）、get_file_metadata（folder）、fetch（工單索引及兩工單）、metadata名稱搜尋、近期folder搜尋與有限舊Flora folder listing。沒有新登入或權限變更，不需Chrome備援。

```powershell
node holiday-lab/reports/tfbase-shutdown-check-20261023/assemble.cjs
```

完整工具結果及真觀測時間保存在01–05 JSON；result.json為機讀判定。這項查證完成後不再開新QA或建置，交主控保全與暫停；本代理未執行系統關機。
