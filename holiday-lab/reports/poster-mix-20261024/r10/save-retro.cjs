// 復盤：附加到 LATEST_HANDOFF.md 結尾與 Vault 專案紀錄結尾；寫入前先確認 C 節 SHA 不變（不符就不寫）
const fs = require('fs'), crypto = require('crypto'), assert = require('assert/strict');
const heading = '## 復盤 2026-10-25';
const body = `${heading}

source_agent: claude-code（Opus 5.5）；TF-GO；範圍：系網首屏海報輪播第七至十一階段＋上線準備。

### 1. 做了什麼、改了哪些檔
- 首屏海報（codex/poster-mix24，commit 61c3c830、2a2da4ca、80efedd2，未push）：
  - student-work-draw-model.js：全幅取景 compose、手動取景 manualGeometry／remapExtent、layout 強制標題側、goto 跳張。
  - student-work-draw.jsx：調整模式（?adjust=1，拖曳／放大／標題左右，草稿存 localStorage）、單張 focus.bubbles／focus.tagline 設定。
  - student-work-draw.css：手動取景、靜態模式移面板右上、冤枉汪泡泡移左上、競箱團標語框移右上。
  - data/student-work-draw.json：8 件作品、使用者 5 筆手動取景、冤枉汪 bubbles:"top"、競箱團 tagline:"right"。
  - tests/student-work-draw.test.cjs、tests/student-work-adjust.test.cjs：單元回歸（抽選 15、調整 9）。
  - scripts/apply-poster-adjust.cjs：把調整模式匯出的 JSON 寫入 focus.manual。scripts/build-review-retry.cjs：建置遇 errno -4094 自動重試、只開新資料夾不刪檔。
  - holiday-lab/POSTER-ADJUST-HOWTO.md：調整模式使用說明。
  - holiday-lab/reports/poster-mix-20261024/r6、r8、r9、r10：各階段 REPORT.md、Playwright 驗收（pw-adjust.cjs、pw-drag-debug.cjs 拖曳除錯、apply-adjust-ui.cjs）、儀表板更新 update-dashboard.cjs、交接 save-handoff.cjs、使用者匯出 user-adjust-2026-10-25.json。
  - images/news/7200-obsessive-reality.jpg：補 commit（先前漏交）。
- 上線準備（工作資料夾 C:/agywork/agd-site-release，分支 codex/site-release-20261025，commit 12d11cab、7e769ed7，未push）：app.jsx 拿掉首頁最下方創作試玩；scripts/build.mjs 解除審閱分支公開建置封鎖；data/en/works.json 作者「小颯」→ XiaoSA；review-codex-20261025/WORK-ORDER.md 派 Codex 檢查英日文排版、翻譯、內文（背景執行中）。公開版預覽 http://127.0.0.1:8910/ 。

### 2. 踩雷與根因
- 建置偶發 \`UNKNOWN: unknown error, open 'locale-en.js'\`（errno -4094，Windows 暫時鎖檔）：寫 build-review-retry.cjs 自動重試；第 33 版第 5 次才成功。
- dcg hook 擋 \`> "$TEMP/build32.log"\`、\`cat >> file <<EOF\`：理由「shell redirect to a dynamic or escaped path may truncate a sensitive file」。改用管線 \`| tail\` 加 \`PIPESTATUS\`、Edit／Write 工具。
- \`git cherry-pick -q\` 回 exit 129（cherry-pick 不支援 -q）：拿掉參數重跑。
- CI 測試 tests/en-release.test.cjs 失敗 \`AssertionError: images/news/7200-obsessive-reality.jpg\`：根因是海報圖只在本機、從未 commit；data 引用圖檔卻沒驗證「已被 git 追蹤」。已補 commit。
- CI 測試失敗 \`+ [ '小颯' ]\`（i18n-data-missing）：英文資料與中文相同被視為未翻譯；改 XiaoSA。
- CI 測試 shared-language 仍失敗 \`only reviewed text fields may change; dates, quotas, records and all other facts stay protected\`：根因是 4f0b1969（10/24）重寫 data/admission.json 進修部卡 16 欄，超出已審核清單。**待使用者決定**採用新版或保留線上版，未解前不能部署。
- 先前階段：調整模式拖曳失效（瀏覽器原生圖片拖曳觸發 pointercancel，改 draggable=false）；儀表板 17/18（已綁 SHA 的證據被覆寫，改每階段新資料夾）。

### 3. 額度花費
- mod 量測：累計工作約 79 分鐘；本 session 約 US$31.46；最高用量窗口週 77%。
- 最耗的一步：多輪「建置→Playwright 9 組截圖→看截圖→儀表板重綁」循環（r4–r10 共七輪），每輪都讀多張全尺寸截圖並帶著長對話脈絡；其次是上線前整理差異（git status／diff 清單動輒數百行）。

### 4. 下一步與規則建議
- 下一步：讀 Codex 報告 review-codex-20261025/REPORT.md → 連同進修部招生 16 欄一次問使用者 → 都確定後在發布資料夾重跑 npm ci／build／check:report／CI 測試全綠 → fast-forward push origin HEAD:main → 確認 GitHub Pages run 成功與線上首頁、EN、JA。
- 規則建議（只提案）：
  1. 專案 tests：加「data 引用的 images/ 檔必須被 git ls-files 追蹤」回歸測試（本次漏交圖檔的直接防線）。
  2. 專案 AGENTS.md：上線前在發布資料夾照 deploy-pages.yml 完整跑 npm ci／build／check:report／tests/en-release、shared-language，全綠才 push。
  3. skill（windows-script-encoding 或 verify）：記「dcg 會擋重導向到 $TEMP 變數路徑與 heredoc 附加」，改用管線／Write 工具。
  4. 不建議為 cherry-pick -q 立規則（一次性）。
- 下一輪建議：Claude Code／claude-opus-5-5／high。下一步是對外上線與招生資料取捨，出錯代價高。
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
