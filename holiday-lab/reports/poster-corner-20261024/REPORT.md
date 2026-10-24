# 海報提高清晰度、操作與資訊縮至角落

2026-10-24；source_agent: codex；codex/poster-corner24。最新本機 http://127.0.0.1:8897/?lang=zh ，英日改lang=en／ja，儀表板/progress/。未push、發布、main修改、刪檔或執行C節。

海報預覽不透明度52%→88%，停格66%→96%，集中線13%→6%；不修改原圖。原整條資訊帶移除，桌面為右下304px小面板，手機右下240px；作品名16px、完整姓名／老師11px。重複標題與狀態留給輔助科技讀取，畫面只留作品、署名、按鈕與靜態模式。桌面按鈕36px、手機觸控44px。

| 條件 | yes/no | 實際證據 |
| --- | --- | --- |
| 修前確有大橫條及淡化問題 | yes | browser-red.json：資訊帶超過頁框90%寬，不透明度低於88% |
| 最終七組共126條排版／資料／操作條件通過 | yes | r3/case-*.json；三語1440／390，加中文1279×575；整格海報、角落位置、面板比例、無橫溢、署名／連結均逐條true |
| 桌面面板約佔整格6–7%、手機約11–14%面積 | yes | result.json由實測寬高計算，未用手填百分比作驗證；各圖標題長短會改變卡片高度 |
| 滑鼠可抽選且兩個按鈕不被遮擋 | yes | 七份r3/start-*.json皆drawing，最終case皆settled／idle，startHit與linkHit逐點命中；另clicked-link.json實際點進作品網址 |
| 修掉泡泡列透明區域攔截 | yes | hit-red.json實際命中hero-original-highlights；改縮小列的實際寬度，最終各案兩按鈕命中正確。不以padding留透明擋層 |
| 手機資訊卡貼近底角 | yes | 初候選case-zh-390.json底角false，舊EasterEgg被手機樣式改靜態產生額外格列；僅恢復該熱區絕對定位，r3三語底角皆true |
| CSS Build、HTTP及來源保全通過 | yes | node scripts/build.mjs --local-review --out=.measure-poster-corner-20261024-03；build-r3-command.json exit0；本finalize.cjs／finalize-command.json exit0，HTTP11項200＋SHA |
| JS、HTML、原作與其他網站資訊保持 | yes | app-3RVTPKHI.js與HTML逐SHA等同8894；1798其他SHA來源、320保全檔、八原圖不變，仍僅附三個既有策展檔 |
| 新版Console無例外 | yes | console.json按8897來源核對，error0，舊錯誤保留原檔 |
| 新獨立代理／全站／實體手機／母語／完整WCAG均通過 | no | 單檔CSS窄驗，未跑這些全項；六項既有限制保持 |
| 本次另跑模型單元測試／全套E2E／Lint | no | 沒有JS或模型變更，HTML與bundle相同；採CSS Build、七組實際瀏覽器與點擊檢查，不把前輪10個模型回歸稱本次重跑 |

早期等待section可見逾時不是轉為成功：桌面section本來為0高度、資訊絕對定位，後續改等實際作品連結，仍另核phase=settled及timer=idle；wait-target-note.json留存。8895／8896是中途候選，最新是8897。*-command.json保存實際command、cwd、stdout、stderr、exit_code；r3截圖是當下操作位置，不都宣稱首屏。

重啟：node scripts/serve-local-review.cjs --site=.measure-poster-corner-20261024-03 --dashboard=holiday-lab/dashboard/out --port=8897
