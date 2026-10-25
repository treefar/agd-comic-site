// 第十階段交接：三份交接最上方插入段落，確認 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict'), path = require('path');
process.chdir(path.resolve(__dirname, '../../../..'));
const heading = '## 2026-10-25 最新：8902套用使用者調整取景、靜態模式移到面板右上';
const note = heading + `

- source_agent: claude（Opus 5.5）；TF-GO。使用者用調整模式匯出5筆取景（TV秀、喀嚓、癒光之音、Dear All Robots、競箱團），已寫入 data/student-work-draw.json 的 focus.manual（原始檔 holiday-lab/reports/poster-mix-20261024/r9/user-adjust-2026-10-25.json）；並要求靜態模式移到資訊面板上方，已移到右上與作品名同列。
- 最新 http://127.0.0.1:8902/?lang=zh ，調整模式 ?lang=zh&adjust=1 （.measure-poster-mix-20261024-31）。重啟：node scripts/serve-local-review.cjs --site=.measure-poster-mix-20261024-31 --dashboard=holiday-lab/dashboard/out --port=8902
- 分支 codex/poster-mix24，未commit／push／發布／main／刪檔，C節未動。
- 驗證：首屏9組0問題、Console 0；調整模式15/15；單元22/22、指南11/11；全套68/71（3既有失敗）；儀表板18/18，權威 holiday-lab/reports/hero-user-adjust-20261025/verification.json。報告 holiday-lab/reports/poster-mix-20261024/r9/REPORT.md。
- 待使用者：是否commit；冤枉汪、今食堂、癡迷的現實仍為自動取景。節日遊戲凍結、無AI生成素材。

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
