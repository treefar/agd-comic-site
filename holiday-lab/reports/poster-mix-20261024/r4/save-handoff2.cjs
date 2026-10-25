// 第五階段交接：三份交接最上方插入段落，確認 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict'), path = require('path');
process.chdir(path.resolve(__dirname, '../../../..'));
const heading = '## 2026-10-25 最新：8902修正快捷按鈕被隱藏與元素重疊，中文頂欄一列到1181';
const note = heading + `

- source_agent: claude（Opus 5.5）；TF-GO。使用者回報：有些頁面元素重疊、有些不見；頂欄還沒調緊湊；伏末拿掉。
- 最新 http://127.0.0.1:8902/?lang=zh （.measure-poster-mix-20261024-16／app-IE4IYQZL.js）。8897原版保留。重啟：node scripts/serve-local-review.cjs --site=.measure-poster-mix-20261024-16 --dashboard=holiday-lab/dashboard/out --port=8902
- 分支 codex/poster-mix24，未commit／push／發布／main／刪檔，C節未動。
- 不見的原因是我自己造成：上一階段為了不擋「靜態模式」勾選框，把右側四顆快捷按鈕在海報面板出現時隱藏，違背使用者先前「恢復右側隨頁面快捷」。已改為快捷按鈕常駐，作品資訊面板往左讓開。
- 頂欄：中文一列門檻降到1181寬（1181–1279縮小間距），1265與1181中文79px一列；英日在1280–1599仍兩列（英文≥1600、日文≥1480才一列），尚未處理。
- 伏末：8902實際送出9件、不含伏末，no-store，建置檔無fumo-2023；請使用者重新整理。fumo.jpg檔案保留。
- 驗證：首屏元件逐張停格檢查，zh 1920／1440／1366／1280／1181、en 1920／1440、ja 1440共9張海報0重疊0消失；平板1100／1024首屏0重疊（截圖逾時）；單元12/12、指南11/11、全套58/61（3既有失敗）；儀表板53列47yes／6no／使用者0、18/18，權威 holiday-lab/reports/hero-recheck-b-20261025/verification.json。
- 錯誤紀錄：建置結束碼曾被管線吃掉；更新腳本曾被字串替換截斷；重跑覆寫了已綁SHA的證據檔（改用新資料夾）。詳 holiday-lab/reports/poster-mix-20261024/r4/REPORT.md。
- 下一輪第一件事：請使用者看8902並決定是否commit；英日頂欄是否再壓縮、手機海報區塞滿第一畫面。節日遊戲凍結、Flora／胖倉鼠暫緩、無AI生成素材。

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
