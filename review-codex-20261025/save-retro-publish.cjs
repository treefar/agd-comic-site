// 復盤（上線段）：附加到 LATEST_HANDOFF.md 結尾與 Vault 專案紀錄結尾；寫入前後核對 C 節 SHA 不變
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict');
const heading = '## 復盤 2026-10-25（二）上線段';
const body = `${heading}

source_agent: claude-code（Opus 5.5）；TF-GO；範圍：派 Codex 審查 → 依使用者決定修正 → 公開發布 → 載入時間量測。

### 1. 做了什麼、改了哪些檔
- 發布準備（C:/agywork/agd-site-release，分支 codex/site-release-20261025）：
  - app.jsx：拿掉首頁最下面創作試玩區塊。
  - scripts/build.mjs：解除審閱分支公開建置封鎖；新增公開版資料過濾（dist 裡拿掉 guide.json 的 evidence_path／http_recheck 與 data/en 的 [CHECK]）。
  - data/en/works.json：作者「小颯」→ XiaoSA（英文與中文相同會被判為未翻譯）。
  - student-work-draw.jsx：輪播海報改為頁面載完後逐張預載。student-work-draw.css（mod 未列）：桌面資訊面板依名單變寬、不換行。
  - 經腳本修改（mod 未列）：data/en/news.json、stats.json、ui.json、admission.json、faculty.json、data/ja/messages.json、flow-ui.json、data/labs.json、data/works.json、data/news.json、chapters-2.jsx、student-guide.jsx、tests/production-baseline.json、tests/shared-language.test.cjs。
  - review-codex-20261025/：WORK-ORDER.md（Codex 工單，第 0 節範圍鎖）、apply-fixes-20261025.cjs（教師英文名、非應屆生、官網→公式サイト、去重複中文、placement rate、周邊、指南審閱字樣）、apply-names-20261025.cjs（Kacha、陳政名）、rebase-baseline-20261025.cjs（核對差異只有核准項；因 works.json 中止，改手動記核准）、claude-layout/pw-layout.cjs（英日 3 尺寸 × 8 頁排版）、claude-layout/pw-loadtime.cjs（首頁載入量測）、copy-to-publish.cjs（只搬網站檔到發布資料夾）、publish-baseline.cjs（發布版保護測試改單純指紋比對）、save-handoff-publish.cjs（上線交接）。
- 發布（C:/agywork/agd-site-publish，codex/site-publish-20261025）：從 origin/main 開，69 檔 1 commit 8369ec96 快轉推上 main；Pages run 40162690994 成功。tests/student-work-draw.test.cjs 改為找不到 holiday-lab 查證檔時給空物件（該段迴圈無資料）。
- 其他：scratchpad/admission-diff.cjs（列出招生資料超出核准的 16 欄，一次性診斷）；holiday-lab/reports/poster-mix-20261024/r10/save-retro.cjs（上一段復盤）；~/.claude/skills/agd-comic-site/SKILL.md（新建系網 skill：部署、兩段式發布、保護測試、翻譯地雷、已確認名稱、載入速度）；images/news/7200-obsessive-reality.jpg 補 commit。

### 2. 踩雷與根因
- **把整條準備分支推上公開 repo**：\`git push origin HEAD:main\` 帶了 226 個 commit、holiday-lab 27,430 檔。根因：推送前沒看 repo visibility 與 \`git diff --stat origin/main..HEAD\` 檔案量，也沒照交接寫的「從 main 另開分支選移」。察覺點是上傳程序吃 500 MB 記憶體；TaskStop＋停 git-remote-https，\`git ls-remote\` 確認 main 仍 1b8322e6、未外露。改兩段式發布。
- 第一次推送 \`error: pack-objects died of signal 15\`／\`the remote end hung up unexpectedly\`：根因是我自己加的 \`timeout 60\` 砍掉打包程序，不是網路。
- Codex 審查 A 排版未完成：\`spawn EPERM\`（Codex 沙盒不能啟動 Chromium）。由 Claude 用 Playwright 補跑。
- CI 測試失敗鏈：\`AssertionError: images/news/7200-obsessive-reality.jpg\`（圖未 commit）；\`+ [ '小颯' ]\`（英文同中文）；\`only reviewed text fields may change\`（進修部 16 欄）；\`labs.json\`／\`works.json\` 指紋不符（核准改動）；shared-language 測試用 \`git show 904ac799\` 與讀 holiday-lab exact-plan，GitHub 淺複製與公開 repo 都會失敗；student-work-draw 測試 \`ENOENT … r3/catalog-proof.json\`。逐項經使用者核准後記入 approvals，發布版測試改單純指紋比對。
- apply-names 腳本 \`"陳政民" expected 2, got 4\`：日文以中文全文當鑰匙，消息全文也含該名；連中文 news.json 一起改。
- dcg 擋：\`git checkout <ref> -- <path>\`（改用 git show 寫檔腳本）、重導向到 $TEMP、\`cat >> <<EOF\`。
- 全 repo 搜尋超過 120 秒：holiday-lab 有大量舊副本；改限定 data/ 與根目錄。
- Edit 工具 \`File has not been read yet\`：先 Read 再改。
- 效能誤判：以為「8 張海報同時預載」是主因，改完 4G 可互動仍 39.7 秒；逐請求列出才知海報在程式執行前就被下方卡片的 lazy 圖抓走。本機不壓縮、HTTP/1.1 也讓數字失真，以線上量測為準。

### 3. 額度花費
- mod 量測：累計工作約 62 分鐘；本 session 約 US$44.31；最高用量窗口週 77%。
- 最耗的一步：誤推整條分支後的等待與中止處理，連帶重做發布分支、重跑 npm ci／build／測試多輪；其次是大量輸出的指令（git status／diff 數百行、Playwright 結果 JSON、多張全尺寸截圖）累積在長對話脈絡中。

### 4. 下一步與規則建議
- 下一步：把 codex/site-release-20261025 的修正（7a48479a、e3a870ab、796ff0de）帶回審閱分支 codex/poster-mix24；停掉本機 8902、8910；Codex 報告未處理項待查證（其他作品多套英文譯名、就業統計「5 年總畢業生 300+」期間、聯合登記「5 名」口徑、國際交流 2018/7 起訖）；手機載入速度使用者決定先不修。
- 規則建議（只提案）：
  1. **hook（最優先）**：攔 \`git push … main\`，若遠端 repo 是 public 且 \`git diff --name-only origin/main..HEAD\` 含 holiday-lab/、reports/、work-orders/ 或超過 200 檔就擋下要求確認。這次只靠人工察覺。
  2. 全域 AGENTS.md「實作紀律」：推送前先看 repo 是否公開與推送檔案數；git push 不設短 timeout，長推送放背景等通知。
  3. 系網 skill 已更新（兩段式發布、淺複製、翻譯鑰匙、載入量測），不需再立規則。
  4. 專案 tests：加「data 引用的 images 必須被 git 追蹤」測試（上一段已提，仍未做）。
- 下一輪建議：Claude Code／claude-sonnet-5-5／medium。剩下是分支同步與清理，範圍明確。
`;
const handoff = 'C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md';
const vault = 'C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md';
const section = t => { const i = t.indexOf('## C. 要使用者決定的事（Codex 不要自己做）'); assert.ok(i >= 0); const s = t.slice(i), n = s.slice(1).search(/\r?\n## /); return n < 0 ? s : s.slice(0, n + 1); };
const C = '95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680', cHash = t => crypto.createHash('sha256').update(section(t)).digest('hex');
const done = [];
for (const p of [handoff, vault]) {
  const t = fs.readFileSync(p, 'utf8');
  if (t.includes(heading)) { done.push({ file: p, written: false }); continue; }
  const next = t.replace(/\s*$/, '\n\n') + body;
  if (p === handoff) { assert.equal(cHash(t), C); assert.equal(cHash(next), C, 'append would change C section'); }
  fs.writeFileSync(p, next); done.push({ file: p, written: true });
}
assert.equal(cHash(fs.readFileSync(handoff, 'utf8')), C);
console.log(JSON.stringify({ done, c_section_unchanged: true }));
