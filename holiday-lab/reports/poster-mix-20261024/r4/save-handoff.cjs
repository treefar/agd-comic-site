// 第三輪交接：三份交接最上方插入段落，確認 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict'), path = require('path');
process.chdir(path.resolve(__dirname, '../../../..'));
const heading = '## 2026-10-24 最新：8902海報首頁精簡、塞滿第一畫面、輪播9件';
const note = heading + `

- source_agent: claude（Opus 5.5）；TF-GO。使用者裁定：拿掉集中線、碰！、PRESS START、頂上泡泡與CH.01章節章，保留標題、說明與底部亮點泡泡；拿掉伏末、放回喀嚓與冤枉汪；頂欄更緊湊；第一個畫面要看到整張海報區。
- 最新 http://127.0.0.1:8902/?lang=zh （.measure-poster-mix-20261024-13／app-ZS4KSQ2D.js）。8897原版保留。重啟：node scripts/serve-local-review.cjs --site=.measure-poster-mix-20261024-13 --dashboard=holiday-lab/dashboard/out --port=8902
- 分支 codex/poster-mix24，未commit／push／發布／main／刪檔，C節未動。裝飾以CSS display:none隱藏，原始碼保留；fumo.jpg不再引用但未刪。
- 版面：桌面海報區高度依視窗算（460–1000px），標題區超過畫面高62%再縮字；頂欄放得下時一列（中文≥1280、日文≥1480、英文≥1600）。輪播9件，冤枉汪取景y80%、標題靠右以露出小狗。
- 驗證：1920×1080中英日、1440×900、1366×768、1280×720中文皆整個海報區在第一畫面；1440中英日×9張27/27避讓通過、1366中文9/9；單元12/12、指南11/11、全套58/61（3既有失敗）；儀表板53列47yes／6no／使用者0、18/18，權威 holiday-lab/reports/hero-fit-20261024/verification.json。手機375海報區比一個畫面多約70px。
- 報告 holiday-lab/reports/poster-mix-20261024/r4/REPORT.md。節日遊戲凍結、Flora／胖倉鼠暫緩、無AI生成素材。
- 下一輪第一件事：使用者看8902並決定是否commit；可再處理手機海報區塞滿第一畫面。

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
