// 第九階段交接：三份交接最上方插入段落，確認 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict'), path = require('path');
process.chdir(path.resolve(__dirname, '../../../..'));
const heading = '## 2026-10-25 最新：8902調整模式（?adjust=1）、Robots／冤枉汪取景、泡泡位置';
const note = heading + `

- source_agent: claude（Opus 5.5）；TF-GO。使用者要求：Robots機器人整個人、冤枉汪窗台貓頭出現；要一個調整模式可逐張手動調位置與大小；選項題結果為不縮小、不留空白。
- 最新 http://127.0.0.1:8902/?lang=zh ，調整模式 http://127.0.0.1:8902/?lang=zh&adjust=1 （.measure-poster-mix-20261024-29-retry4／app-7OT6BK5U.js）。重啟：node scripts/serve-local-review.cjs --site=.measure-poster-mix-20261024-29-retry4 --dashboard=holiday-lab/dashboard/out --port=8902
- 調整模式：拖曳＋放大(100–300%)＋左右上下位置＋強制標題靠左右；草稿存localStorage；複製設定後用 node scripts/apply-poster-adjust.cjs <檔> 寫入 data/student-work-draw.json 的 focus.manual。說明 holiday-lab/POSTER-ADJUST-HOWTO.md。
- 分支 codex/poster-mix24，未commit／push／發布／main／刪檔，C節未動。泡泡移到標題下方；標題靠右時排左側。
- 建置偶發 locale-en.js errno -4094（Windows 暫時打不開）：新增 scripts/build-review-retry.cjs 自動重試；第29版第4次成功。
- 驗證：Playwright調整模式15/15、首屏9組0問題；單元抽選13／調整9／指南11；全套68/71（3既有失敗）；儀表板18/18，權威 holiday-lab/reports/hero-adjust-20261025/verification.json。報告 holiday-lab/reports/poster-mix-20261024/r8/REPORT.md。
- 待使用者：Robots腿下半仍被右下面板擋到、冤枉汪小狗背被泡泡壓到——可用調整模式自己調；是否commit。節日遊戲凍結、無AI生成素材。

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
