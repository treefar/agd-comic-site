# 新版指南獨立UI驗收方法

目前只準備腳本，等待主控提供新凍結URL與build；不得測8879並稱為新版。基於已完成current-rules/qa方法另存，不改舊收據。

執行（參數須由主控實際提供，不使用示例網址冒充）：

```powershell
node run.cjs <新127.0.0.1網址含尾斜線> <新.measure-build目錄名> <未用過tag>
```

6個獨立headless Chromium context：zh/en/ja × 390/1440。首頁只快看導覽、手機選單、13教師卡與頁底入口順序，不進遊戲。原教師照片從已有originals逐份SHA核對後攔截回傳，無78次遠端重抓。

指南15卡全部展開；15卡47步固定契約，FAQ與來源數讀新data。核10張本輪target卡的title／summary／大步／detail／FAQ／warning／flow-note／聯絡標籤；15卡的實際來源title／readability／原URL、各FAQ來源、電話文字與tel href及承辦URL均驗。來源caption不得顯示HTTP／DOM等技術收據。

另做三欄／一欄、分類／轉學生篩選、當語言搜尋與重設、流程定位、缺字替代字元、水平溢位、console／404。fonts.loaded僅表示載入狀態，不聲稱字型cmap或實際fallback零缺字；不重跑全站字型QA。

主控凍結後只跑一次；方法失敗保留原紅收據，修方法另用fresh tag，產品異常先回報，不改產品配合測試。輸出直接WebP、各context JSON與HTML、result.json、tag-command.json。source/data與整份build執行前後SHA及實際HTTP檔案比對會保存；不硬寫舊build檔數。

具體電話契約：證照獎助副電話1712，職涯主電話1713，實習副電話1711。未符合新資料即拒跑；不偷偷套用舊基準。

本方法是Node Playwright，沿用本對話已實證的獨立QA方法及既存bundled runtime；只語法檢查尚不等於UI驗收完成。此階段不呼叫網站、不啟新服務、不操控使用者Chrome分頁。
