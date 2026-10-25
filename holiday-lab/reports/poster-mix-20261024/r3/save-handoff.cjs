// 第三輪交接：三份交接最上方插入段落，確認 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict'), path = require('path');
process.chdir(path.resolve(__dirname, '../../../..'));
const heading = '## 2026-10-24 最新：8902輪播換別年度作品＋標題自動避開主視覺';
const note = heading + `

- source_agent: claude（Opus 5.5）；TF-GO。使用者說喀嚓、冬枉汪不夠好看要換別年度，並要求底圖閃出時畫面元素自動避開主視覺。
- 最新 http://127.0.0.1:8902/?lang=zh （.measure-poster-mix-20261024-09／app-4GPFUUKG.js）。8897原版保留；8900及中途埠已關。重啟：node scripts/serve-local-review.cjs --site=.measure-poster-mix-20261024-09 --dashboard=holiday-lab/dashboard/out --port=8902
- 分支 codex/poster-mix24，未commit／push／發布／main／刪檔，C節未動。
- 換圖：喀嚓、冤枉汪移出；新增2023年《龍戰於前》（高樂怡，插畫設計組第一名）、《伏末》（陳彥蓉，海報設計組第一名），來源系官網2023-12-20報導原圖（images/news/2023-design-awards/，未修改），署名照報導；指導老師欄「陳慧萍 · 陳重光」為報導寫的參賽同學指導老師，非逐件指定。兩件無官方英日譯名，三語顯示原中文。
- 避讓：桌面≥1181px，標題與按鈕依每張海報主體位置縮到空位（student-work-draw-model.js layout()；focus.y/x 為看圖指定，mobileX 為吸睛度分析）。第一版「找最佳排法」只從34%降到31%被蓋，不採用；吸睛度重心會把龍的海報裁掉臉，改人工指定。
- 驗證：1440中英日×8張24/24不壓主體；1280中文7/8（伏末超門檻0.002未放寬）；375無溢出；單元測試12/12；指南11/11；全套58/61（3個既有失敗，涉及的資料檔未改）；儀表板53列47yes／6no／使用者0、18/18，權威 holiday-lab/reports/poster-avoid-20261024/verification.json。
- 注意：預覽窗格閒置時不出畫面幀，動畫會停在透明度0，截圖看起來標題淡淡的，不是版面問題。使用者實機 Chrome 的動畫觀感尚未驗。
- 報告 holiday-lab/reports/poster-mix-20261024/r3/REPORT.md。節日遊戲仍凍結，Flora／胖倉鼠暫緩，無AI生成素材。
- 下一輪第一件事：請使用者看8902，決定是否commit；Fable剩餘建議（減動態總開關、新聞排序、海報srcset、學長姐見證）與總表2–6項待續。

`.replace('冬枉汪', '冤枉汪');
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
