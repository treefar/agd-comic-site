const fs=require('node:fs'),assert=require('node:assert/strict');
const files=['C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md','holiday-lab/STATUS.md','C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md'];
for(const f of files){let text=fs.readFileSync(f,'utf8');const a='新模式只採本輪網站718來源綁定';assert.ok(text.includes(a));text=text.replace(a,'新模式以本輪718個檔案SHA綁定核對網站證據');fs.writeFileSync(f,text);}
fs.appendFileSync('holiday-lab/reports/overnight-20261024/REPORT.md','\n儀表板獨立補驗 qa/dashboard/：1440／390兩組、17yes／0no、3PNG、exit0，搜尋WebGL／缺件篩選／來源展開／重設／深色均通過。手機文件無橫溢，表格保留容器內水平捲動。Chrome已另開本輪首頁與儀表板並保留供審閱。\n');
console.log('Handoff wording clarified; website/dashboard receipts kept separate.');
