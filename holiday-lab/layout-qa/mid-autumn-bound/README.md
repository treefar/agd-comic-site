# 中秋動態數字訊息：上界可行性診斷

source_agent: codex。這是技術測量，沒有畫介面、改產品、修改文字或遊戲時鐘。

```powershell
node holiday-lab/layout-qa/mid-autumn-bound/digit-probe.cjs
```

固定08／8845，三語×320／1440均實際進入遊戲，讀真正`game-hint`字型／字距／padding／內容寬度；另用同樣式隱藏文字確保font ready後，只以Canvas measureText量測。

六組均得到：數字寬9.2734375px，100個兩位數及1000個三位數與等寬和的誤差0；診斷字元集合最大left overhang1、right overhang1.046875、ascent14、descent4。三份served來源前後SHA一致。完整computed樣式、逐字metric與來源在`latest.json`指向的run。

這只證明可朝「有限數字格式／normal-flow與原safe內的保守墨跡界」驗證。尚未證小數點／百分號／固定文字邊界、所有斷行與組合字形、原圖safe對每行上界、blocker隔離，所以**不能用此診斷宣稱全域最大墨跡或解除正式閘門**。另一位獨立代理在`mid-autumn-bound-proof/`進行最小補證，失敗保留NO；不重新窮舉1.8m種Cartesian組合。
