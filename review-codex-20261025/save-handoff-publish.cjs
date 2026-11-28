// 上線交接：三份交接最上方插入段落，確認 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict');
const heading = '## 2026-10-25 最新：系網新版已上線（main 8369ec96，Pages run 40162690994 成功）';
const note = heading + `

- source_agent: claude-code（Opus 5.5）；TF-GO。使用者授權「派 Codex 檢查英日文排版、翻譯、內文，有問題問我，沒問題就推上系網；最後的創作試玩先不放」。
- 上線內容：首屏 8 件學生作品全幅海報輪播、日英文強化、在校指南公開（拿掉審閱字樣）、首頁不放創作試玩。依使用者決定修：進修部招生卡用 4f0b1969 新版；教師英文名 Teng Shu-yuan／Chen Mei-jung／Yang Chih-chang；喀嚓 Kacha；陳政名；小颯年份 2021、團隊小颯；週邊→周邊；94% 英文 placement rate；面板依名單變寬不換行。
- 發布方式：repo 是公開的。第一次誤把整條準備分支（含 holiday-lab 兩萬多檔）推送，25 分鐘後察覺並中止，遠端 main 未更新、未外露。改從 origin/main 開 codex/site-publish-20261025（C:/agywork/agd-site-publish），只搬 69 個網站檔，1 個 commit 快轉推上。線上 holiday-lab 404、guide.json 無內部路徑。
- Codex 審查：review-codex-20261025/REPORT.md（11 項，P0 0）。Codex 沙盒開不了 Chromium，排版由 Claude 補測 48 案例無水平捲軸。
- 驗證：本機照 CI npm ci／build／check:report 通過，測試 44/44；Pages 32 秒部署成功；線上 zh／en／ja 200、程式包 app-UBHYJM27.js。
- 載入時間（pw-loadtime.cjs）：桌機可互動 0.8 秒（舊 1.4）；**4G 手機可互動 20.7 秒（舊 3.1）、首屏海報 29 秒**，原因是下方卡片用原尺寸海報當縮圖、與程式包搶頻寬（新版程式包 gzip 425 KB，舊 206 KB）。待使用者決定是否做效能修正。
- 未同步：審閱分支 codex/poster-mix24 尚未帶回準備分支的修正（codex/site-release-20261025，e3a870ab、796ff0de）；本機伺服器 8902、8910 仍在跑；新 skill ~/.claude/skills/agd-comic-site/SKILL.md 記錄流程與地雷。

`;
const handoff = 'C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md';
const targets = [handoff, 'C:/agywork/agd-holiday-prototypes/holiday-lab/STATUS.md', 'C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md'];
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
