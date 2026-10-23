# 同格首頁實作接續

source_agent: codex。產品檔chapters-1.jsx、holiday-home.jsx、holiday-home.css已完成骨架，JSX_PARSE 2/2 PASS；未build（由root統一）。

- 原comic-page上方獨立HolidayHome移入原tier-splash Panel；同格包含系所主標、主述、看系上消息、節日CG/選擇/試玩、3個原資訊入口。
- Hero選項14款，labor排除但原遊戲檔與全列表未動。
- 點擊前不建iframe、不載遊戲或音效；選擇只換既有CG。
- modal body兄弟節點inert；同源iframe首尾Tab回close，close ShiftTab至iframe末控制；Esc/正確來源訊息關閉，還原原inert與overflow後焦點回trigger。
- 減動停用CG輕浮動，原彩蛋保留；不新增程序UI或生圖。
- implementation/hero-check.cjs before 真exit1：festival belongs inside original Hero panel（0!==1）。before/result.json與PNG保留。

等root新build/server後跑 HERO_QA_URL=<url> node holiday-lab/reports/hero-release-20261023/implementation/hero-check.cjs <新資料夾名>，九組三語×320/390/1440。另一代理做獨立驗收。
