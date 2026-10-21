# 本機試玩啟動器

打包時複製START.cmd與start.ps1到試玩包根目錄，網站執行檔放在同層site/。雙擊START.cmd後以Windows內建PowerShell提供localhost伺服器，預設8785埠被占用時向後尋找。用Ctrl+C關閉。

測試不開瀏覽器：powershell -NoProfile -ExecutionPolicy Bypass -File start.ps1 -NoBrowser

只檢查解析與版本：powershell -NoProfile -File start.ps1 -Check

PowerShell 5.1／7均已實跑解析；start.ps1為UTF-8 BOM，CMD純ASCII。
