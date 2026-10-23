# 字型與換行回歸

保留原font-family與字級。before/result.json是修改前實測：日文320作品列表兩個標題最後只剩「マ」。執行 node holiday-lab/reports/ui-polish-20261023/font/check.cjs before 會真exit1；不是手寫fail旗標。

重跑當前站台：先設環境變數 FONT_QA_URL 為本機server，再 node holiday-lab/reports/ui-polish-20261023/font/probe.cjs <新的資料夾名>，接著 node holiday-lab/reports/ui-polish-20261023/font/check.cjs <同名>。探針真操作作品列表、清明選單/說明/控制頁，zh/en/ja×320/1440，讀Range實際行盒、頁寬、CDP實載字型，不注入遊戲狀態。每次使用新資料夾保留舊證據。final03 綁最後03 build，6/6、孤字與溢位0、errors0。

獨立全14款逐狀態驗收另見../independent/，本探針不代替完整UI或全字元cmap證明。
