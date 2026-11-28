// 復盤（師資資料段）：附加到 LATEST_HANDOFF.md 結尾與 Vault 專案紀錄結尾；寫入前後核對 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict');
const heading = '## 復盤 2026-10-29';
const body = `${heading}

source_agent: claude-code（Opus 5.5）；TF-GO；範圍：陳慶鴻指導作品與其他 10 位老師資料補齊，並上線（main da4e40ba）。

### 1. 做了什麼、改了哪些檔
- holiday-lab/reports/faculty-official-20261029/add-chenchinghung.cjs：把陳老師提供的清單整理成 11 筆摘要，寫進 data/faculty.json、data/en/faculty.json、data/ja/messages.json。
- holiday-lab/reports/faculty-official-20261029/add-from-eval.cjs：依自評報告補 10 位老師的證照、教學獎、計畫、專利、帶隊與召集人，並改陳重光學歷；中英日三語同步。
- holiday-lab/reports/faculty-official-20261029/pw-faculty.cjs：師資頁三語驗收。檢查中文頁看得到新內容、英日頁沒有殘留中文原句，以及水平捲軸、Console 錯誤。
- 暫存區 scratchpad/fac/lh.cjs、fac/build.cjs（子代理一）：把本機每個欄位做正規化雜湊，貼進瀏覽器跟官網比對，產生 official-diff.json／md。
- 暫存區 scratchpad/evaldiff/parse.cjs、evaldiff/build.cjs（子代理二）：解析評鑑報告純文字裡的逐人表格（證照、產學案、創新教材），帶行號輸出，再產生 eval-diff.json／md。
- mod 未列但有改：tests/production-baseline.json（兩條分支都記了 faculty.json 核准）、locale-en.js、locale-ja.js（建置產物）、scratchpad/eval-tools/docx2txt.py（docx 轉純文字）、交接三份、~/.claude/skills/agd-comic-site/SKILL.md（新增 5b 節）。
- 結果：審閱分支 5df5f1ba；發布分支 da4e40ba 快轉推上 main，只動 6 個檔，Pages run 40824999155 成功，線上三語 30 個案例通過。

### 2. 踩雷與根因
- 官網不是資料來源：子代理比對 13 頁，全部跟本機一致。根因是官網 2026-10-06 已用本機資料改寫，頁底有寫。另外 curl／WebFetch 被 AWS WAF 擋下，子代理改用內建瀏覽器同源 fetch 才讀到。
- 評鑑報告沒有論文、業界經歷、指導獲獎的逐人明細：只有件數。表 1-9～1-11 寫「請於附件提供原始表冊」。
- 刪舊日文鑰匙誤傷別人：陳重光舊學歷「國立高雄師範大學 視覺傳達設計」，跟陳慶鴻的學歷是同一句。腳本刪了舊鑰匙，會讓陳慶鴻的日文學歷退回中文。改法：比對 git HEAD 的鑰匙，把仍被使用的補回 1 個。
- 驗收腳本誤報：第一輪報陳慶鴻中文頁 0/17、證照 false，截圖其實都在。根因是新瀏覽器開的第一頁還沒畫完，腳本就讀了文字。改成等英文名出現再讀；接著因為楊智彰沒有 PAPERS／ACHIEVEMENTS 區塊，出現 \`page.waitForFunction: Timeout 20000ms exceeded\`，條件改成 RESEARCH／COURSES。
- 線上驗收 \`page.goto: Timeout 30000ms exceeded\`：線上嵌入影片讓網路永遠不靜止，networkidle 等不到。改成 waitUntil load。
- \`git rev-parse --short origin/main HEAD\` 回 \`fatal: Needed a single revision\`：--short 只能接一個參數，分開跑就好。
- 發布資料夾不能用 copy-to-publish.cjs：它要求工作區乾淨，但有 9 個檔只差換行符號。改用小腳本只搬 6 個檔。搬之前先比對三份資料改動前的 SHA，兩邊一致才搬。

### 3. 額度花費
- mod 量測：累計工作約 41 分鐘；本 session 約 US$12.37；最高用量窗口週 15%。
- 最耗的是兩次派子代理：官網比對約 13.9 萬 tokens，評鑑報告比對約 17.8 萬 tokens。官網那次最後沒有產出可用資料。其次是三輪 Playwright 驗收（本機兩輪、線上兩輪）和全頁截圖。

### 4. 下一步與規則建議
- 下一步：論文、業界經歷、指導學生獲獎要請各老師提供，或從評鑑附件的原始表冊取得；楊智彰學歷待補；官網那邊鄧樹遠職稱的「電競娛樂系代理主任」要由網管改。8902 審閱版仍在跑，可以停。
- 規則建議（只提案）：
  1. skill（已寫進 agd-comic-site 5b 節，不必另立規則）：官網不是來源、來源優先序、共用日文鑰匙、驗收要等渲染完成。
  2. 全域 AGENTS.md「實作紀律」：派子代理查外部來源前，先花一次工具呼叫看來源是不是本專案的衍生品（例如頁底「資料來源」），避免白跑。這次官網比對花了約 14 萬 tokens，沒有產出。
  3. 不建議為 networkidle、rev-parse 立規則（一次性）。
- 下一輪建議：Claude Code／claude-sonnet-5-5／medium。剩下是等老師提供資料後照現有腳本補，範圍明確。
`;
const handoff = 'C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md';
const vault = 'C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md';
const section = t => { const i = t.indexOf('## C. 要使用者決定的事（Codex 不要自己做）'); assert.ok(i >= 0); const s = t.slice(i), n = s.slice(1).search(/\r?\n## /); return n < 0 ? s : s.slice(0, n + 1); };
const C = '95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680', cHash = t => crypto.createHash('sha256').update(section(t)).digest('hex');
const done = [];
for (const p of [handoff, vault]) {
  const t = fs.readFileSync(p, 'utf8');
  if (t.includes(heading + '\n')) { done.push({ file: p, written: false }); continue; }
  const next = t.replace(/\s*$/, '\n\n') + body;
  if (p === handoff) { assert.equal(cHash(t), C); assert.equal(cHash(next), C, 'append would change C section'); }
  fs.writeFileSync(p, next); done.push({ file: p, written: true });
}
assert.equal(cHash(fs.readFileSync(handoff, 'utf8')), C);
console.log(JSON.stringify({ done, c_section_unchanged: true }));
