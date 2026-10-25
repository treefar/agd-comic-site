// 在三份交接最上方插入本階段段落（Vault 有 frontmatter 時插在其後），並確認 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict'), path = require('path');
process.chdir(path.resolve(__dirname, '../../..'));
const heading = '## 2026-10-24 最新：8898輪播換圖（拿掉小颯、加不同畫風）＋只增不減複驗＋Fable顧問';
const note = heading + `

- source_agent: claude（Opus 5.5）；TF-GO。使用者說明8897是Codex做的新系網，要求確保穩定且相對舊系網只增不減，請Fable當顧問，並把底圖輪播的小颯換成不同畫風、吸引高中生的作品。
- 分支 codex/poster-mix24（由 codex/newchat-handoff24／c66ef5b0 開出），未commit、未push、未發布、未碰main、未刪檔、C節未動。產品只改 data/student-work-draw.json 與 tests/student-work-draw.test.cjs。
- 只增不減：相對origin/main 0檔刪除／改名；程式刪行皆為同處改寫（h1、三語切換、簡章用語）；中文資料0被刪鍵；en得獎清單其實125→144補齊，是比對腳本按索引誤判。結論：未發現被拔掉的功能。
- 輪播八件（依高中生吸引力排序）：今食堂、葛柏TV秀、喀嚓、癡迷的現實（新加入，YouTube遠端縮圖）、癒光之音、Dear All Robots、競箱團、冤枉汪。小颯只從輪播移除，首頁右側原有原畫格與署名保留。
- 驗證：Node 10pass、10組抽選相鄰不重複、Build exit0（.measure-poster-mix-20261024-01，79檔）、Chrome中文1440輪播一圈8件無小颯、英日375無橫溢、日文實點停格；保全5檔／8原圖／origin/main不變；儀表板53列47yes／6no／使用者0、1936 SHA、18/18。未做：真機、母語、完整WCAG、Console逐頁。
- 最新 http://127.0.0.1:8898/?lang=zh （8897保留不動）。重啟：node scripts/serve-local-review.cjs --site=.measure-poster-mix-20261024-01 --dashboard=holiday-lab/dashboard/out --port=8898
- Fable顧問12條建議在 holiday-lab/reports/takeover-claude-20261024/fable-advice.md，尚未套用，等使用者挑。前三條：手機版缺報名／聯絡入口、桌面右下浮動鈕壓到抽選面板、「立即報名」點進去全是已結束。
- 報告 holiday-lab/reports/poster-mix-20261024/REPORT.md。節日遊戲繼續凍結，Flora／胖倉鼠暫緩，沒有生成素材。
- 下一輪第一件事：請使用者看8898輪播，並從Fable清單挑要做的項目；《癡迷的現實》若要離線穩定需使用者同意下載縮圖進images/。

`;
const handoff = 'C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md';
const targets = [handoff, 'holiday-lab/STATUS.md', 'C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md'];
const section = t => { const i = t.indexOf('## C. 要使用者決定的事（Codex 不要自己做）'); assert.ok(i >= 0); const s = t.slice(i), n = s.slice(1).search(/\r?\n## /); return n < 0 ? s : s.slice(0, n + 1); };
const cHash = t => crypto.createHash('sha256').update(section(t)).digest('hex');
assert.equal(cHash(fs.readFileSync(handoff, 'utf8')), '95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680');
const done = [];
for (const p of targets) {
  if (!fs.existsSync(p)) { done.push({ file: p, written: false, why: 'missing' }); continue; }
  let t = fs.readFileSync(p, 'utf8');
  if (t.includes(heading)) { done.push({ file: p, written: false, why: 'already' }); continue; }
  if (t.startsWith('---')) { const end = t.indexOf('\n---', 3), nl = t.indexOf('\n', end + 1); assert.ok(end > 0 && nl > 0); t = t.slice(0, nl + 1) + '\n' + note + t.slice(nl + 1); } else t = note + t;
  fs.writeFileSync(p, t); done.push({ file: p, written: true });
}
assert.equal(cHash(fs.readFileSync(handoff, 'utf8')), '95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680');
console.log(JSON.stringify({ done, c_section_unchanged: true }, null, 1));
