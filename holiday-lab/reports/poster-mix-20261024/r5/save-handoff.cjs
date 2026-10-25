// 第五階段交接：三份交接最上方插入段落，確認 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict'), path = require('path');
process.chdir(path.resolve(__dirname, '../../../..'));
const heading = '## 2026-10-25 最新：8902自動構圖主角不被切、8件、面板右下、快捷鈕第二畫面';
const note = heading + `

- source_agent: claude（Opus 5.5）；TF-GO。使用者要求：龍戰於前不要；TV秀閃兩次；其他頁重新構圖、主角不要被切；作品資訊面板固定第一畫面右下；快捷按鈕從第二畫面開始；亮點泡泡被切。
- 最新 http://127.0.0.1:8902/?lang=zh （.measure-poster-mix-20261024-19／app-FQ6535DV.js）。8897原版保留。重啟：node scripts/serve-local-review.cjs --site=.measure-poster-mix-20261024-19 --dashboard=holiday-lab/dashboard/out --port=8902
- 分支 codex/poster-mix24，未commit／push／發布／main／刪檔，C節未動。輪播8件：今食堂、葛柏TV秀、癡迷的現實、喀嚓、癒光之音、Dear All Robots、競箱團、冤枉汪。
- 構圖：student-work-draw-model.js compose()，依每張focus.subject（主角上下範圍）與畫面比例，放得進就滿版置中，否則整張完整顯示，兩側用同一張圖模糊放大填邊（CSS效果，非新繪圖；使用者可改純色）。
- TV秀：24秒取樣每張一輪各一次，無重複；已加海報預先載入、構圖改在繪製前套用以消除閃動。
- 驗證：Playwright背景真瀏覽器（holiday-lab/reports/poster-mix-20261024/r4/pw-verify.cjs，結果pw-run-02）9組尺寸語言首屏0重疊0裁切、快捷鈕首屏隱藏捲過後出現、Console 0；8張截圖目視主角完整（修正Robots頭、喀嚓耳朵）；單元13/13、指南11/11、全套59/62（3既有失敗）；儀表板18/18，權威 holiday-lab/reports/hero-compose-20261025/verification.json。
- 報告 holiday-lab/reports/poster-mix-20261024/r5/REPORT.md。節日遊戲凍結、Flora／胖倉鼠暫緩、無AI生成素材。
- 下一輪第一件事：使用者看8902決定是否commit；模糊填邊是否改純色；英日頂欄、手機版待定。

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
