# 提交與保全

產品與證據提交：80f280596bd5bbd13aff519f10ca452a05a44979（fix(i18n): use supported official guide names）。

白名單69檔＝6產品＋本報告目錄63檔；原6dirty與latest-build.json未提交，沒有push。

實際 git fsck --connectivity-only：exit 0，列出 52 筆dangling物件，未刪除或執行GC；完整stdout/stderr見git-product-check.json。20份提交後preimage直接以git cat-file取blob再比SHA，20/20與起始bytes相同。

新版measurement為 .measure-official-guide-names-20261023-01 / app-WGMMQQRX.js / 360files；manifest為freeze-v3.json，不是freeze.json。本次來源/字典測試21/21，UI獨立驗收尚待另代理，未把舊8865畫面當新證據。

產品6檔 git diff --cached --check 實跑exit0。全報告目錄的廣域whitespace檢查會對保留CRLF的preimage和真實stderr空白提出警告；沒有為讓該檢查變綠而改寫原始證據。

後續文件提交只補本檔與git-product-check.json、git-product-check.cjs；不改產品或freeze。
