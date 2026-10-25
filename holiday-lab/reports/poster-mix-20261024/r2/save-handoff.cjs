// 第二輪交接：三份交接最上方插入段落，確認 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict'), path = require('path');
process.chdir(path.resolve(__dirname, '../../../..'));
const heading = '## 2026-10-24 最新：8900套用Fable顧問8項（手機聯絡、浮動鈕避讓、指南搜尋）';
const note = heading + `

- source_agent: claude（Opus 5.5）；TF-GO。使用者以選項題選定：手機加報名入口、浮動鈕不壓面板、報名鈕改導可用處、手機海報變清楚、面板小字放大、指南搜尋變好用、拿掉內部用語、癡迷的現實縮圖下載進images/。未選：減動態總開關、新聞排序。
- 最新 http://127.0.0.1:8900/?lang=zh （.measure-poster-mix-20261024-03／80檔／app-73QZMYRE.js）。8897原版保留；8898／8899中途版服務已關。重啟：node scripts/serve-local-review.cjs --site=.measure-poster-mix-20261024-03 --dashboard=holiday-lab/dashboard/out --port=8900
- 分支 codex/poster-mix24，未commit／push／發布／main／刪檔，C節未動。產品改 comic-components.jsx、chapters-2.jsx、holiday-home.jsx、student-work-draw.jsx/.css、student-guide.jsx/.css、student-guide-model.js、styles.css、scripts/build.mjs、data/student-work-draw.json、兩個測試；新增 images/news/7200-obsessive-reality.jpg。
- 重點：頂欄 ADMISSION_OPEN=false 時顯示「我適合哪個管道 →」連 #/guide/start，116簡章公布後改 true 即恢復「立即報名」。指南「尚未上線」黑條改由建置旗標 globalThis.AGD_REVIEW_BUILD 控制。
- 驗證：抽選10/10、指南11/11（新增2測試先red後green）、全套56/59（3個既有失敗只涉及未改的admission.json／guide.json日譯／works.json小颯英譯）、Build exit0 Unpaired0；1440中英日29步捲動面板控制項0次被擋、375選單LINE可見、指南搜尋框y1157→485。1366只驗頁頂（窗格縮放下捲動無效）。儀表板53列47yes／6no／使用者0、18/18，權威 holiday-lab/reports/fable-polish-20261024/verification.json。
- 意外：做改動前對照時tar中斷，node --test在 %TEMP%\\agd-head-baseline-1024 暫存副本跑了歷史節日QA測試；工作樹無新增／修改、保全SHA不變。暫存副本未刪，等使用者決定。不是解凍節日QA。
- 報告 holiday-lab/reports/poster-mix-20261024/r2/REPORT.md。節日遊戲繼續凍結，Flora／胖倉鼠暫緩，無生成素材。
- 下一輪第一件事：請使用者看8900並決定是否commit；Fable剩餘建議（減動態、新聞排序、海報srcset、學長姐見證）與總表2–6項待續。

`;
const handoff = 'C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md';
const targets = [handoff, 'holiday-lab/STATUS.md', 'C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md'];
const section = t => { const i = t.indexOf('## C. 要使用者決定的事（Codex 不要自己做）'); assert.ok(i >= 0); const s = t.slice(i), n = s.slice(1).search(/\r?\n## /); return n < 0 ? s : s.slice(0, n + 1); };
const C = '95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680', cHash = t => crypto.createHash('sha256').update(section(t)).digest('hex');
assert.equal(cHash(fs.readFileSync(handoff, 'utf8')), C);
const done = [];
for (const p of targets) {
  let t = fs.readFileSync(p, 'utf8');
  if (t.includes(heading)) { done.push({ file: p, written: false }); continue; }
  if (t.startsWith('---')) { const end = t.indexOf('\n---', 3), nl = t.indexOf('\n', end + 1); t = t.slice(0, nl + 1) + '\n' + note + t.slice(nl + 1); } else t = note + t;
  fs.writeFileSync(p, t); done.push({ file: p, written: true });
}
assert.equal(cHash(fs.readFileSync(handoff, 'utf8')), C);
console.log(JSON.stringify({ done, c_section_unchanged: true }));
