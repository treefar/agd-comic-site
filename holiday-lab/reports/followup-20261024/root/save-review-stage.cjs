const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base='holiday-lab/reports/followup-20261024/',original='C:/Projects/系網漫畫版_AGDComicSite',sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const stateFile=path.join(root,base,'verification.json'),state=JSON.parse(fs.readFileSync(stateFile));const row=state.checks.find(c=>c.id==='short-lines');row.reason='本輪無橫向溢位；Range有16筆旋轉h2候選，不把幾何候選當產品孤尾。相同標題與樣式前輪已有目視排除證據；本輪未宣稱全內文孤尾0。';
for(const c of state.checks)c.evidence=c.evidence.map(f=>f===base+'root/current-proof.json'?base+'root/current-proof-final.json':f);const proofPath=base+'root/current-proof-final.json',bytes=fs.readFileSync(path.join(root,proofPath));state.sources=state.sources.filter(s=>s.file!==base+'root/current-proof.json');if(!state.sources.some(s=>s.file===proofPath))state.sources.push({file:proofPath,bytes:bytes.length,sha256:sha(bytes)});fs.writeFileSync(stateFile,JSON.stringify(state,null,2)+'\n');
const title='## 2026-10-24 最新：8876可審閱，年份／聯絡與英文資料已補正';
const note=`${title}

- source_agent: codex；TF-GO。使用者要求到一段落先看新的本地網頁，已在Chrome開啟 http://127.0.0.1:8876/ 。指南 /?lang=zh#/students/guide ，儀表板 /progress/ 。最新 .measure-followup-20261024-01，360檔／app-3A2EBGL2.js；8875為前輪保留版。
- 三組子代理分別完成英文對映、字形可用性、8處室窗口補查。Root已套25項EN資料對齊，實際build未成對21→0、衝突21→0；既有17條與未核專名CHECK保留，不改runtime。有效字典8項差異全部是有依據的聯絡文案。
- 小颯第27屆首獎依CELSYS2021-04-28主辦公告，中英作品年份2022→2021，三語可見WIN2021，原圖／署名不改。現行請假分機2126取代舊索引2114；諮商2127／動遊特教2149分流。招生選才組及通識官方英文已核並修正，未把新特教舊合併名或自譯日文冒稱官方名。
- 新版獨立主6組148yes，補6組64yes；58有效原圖、60無損WebP含2 lazy載入診斷圖，來源／360build前後相同。21項回歸exit0、主控SHA再核exit0。16筆旋轉h2 Range候選另列，不宣稱全站孤尾0；工具#admission與h1定位首敗保留，產品沒配合錯測改動。
- 字型8875有限6狀態79,079字元配對有glyph；主資料候選2,204字元可用。8876新增古／折2字已有限cmap及CSS range補驗，不換字型／人名／資格；不是逐字實際fallback或跨OS驗收。82 DOM引用已分61圖片、20CSS、1停用icon逐項追來源，315原圖／凍結遊戲素材未變，不宣稱所有製程／權利已核。
- 儀表板目前49列、43yes／6保留缺口、使用者0；新資料來源 followup-20261024/verification.json，保留前輪原始收據。重產 node holiday-lab/build-dashboard.mjs ，權威驗證仍用 dashboard/overnight-authority.cjs；18/18。完整逐項表、實際命令stdout/stderr/exit及限制見 holiday-lab/reports/followup-20261024/REPORT.md 。
- TF-BASE指定交接夾本輪01:12 UTC左右再次只讀回查，仍5份工單／腳本，未見Flora／胖倉鼠WebGL，詳root/webgl-recheck.json。未啟Unity、不重派、不下載舊大包。所有節日遊戲含勞動節維持凍結，未開發／測玩／大量QA／生圖；入口仍頁底。
- 每項codex短分支，本機整合 codex/followup-review24；不push、不發布、不碰main、不刪檔、C節不動；四dirty＋R0及原圖SHA保留。Vault只本機記錄，不做私人整庫推送。目標尚未宣告完成。
- 下一輪第一件事：先回收使用者對8876的具體畫面意見，再補當期官方全文／版本衝突與正式外文名；有WebGL新成品再驗包。全站字型、真人／母語與素材權利缺口保留，禁止自行恢復節日或擴大發布。

\`\`\`text
cd C:/agywork/agd-holiday-prototypes
node scripts/serve-local-review.cjs --site=.measure-followup-20261024-01 --dashboard=holiday-lab/dashboard/out --port=8876
\`\`\`

`;
const cpart=s=>{const i=s.indexOf('## C. 要使用者決定的事（Codex 不要自己做）');assert.ok(i>=0);const t=s.slice(i),n=t.slice(1).search(/\r?\n## /);return n<0?t:t.slice(0,n+1);};
const h=path.join(original,'LATEST_HANDOFF.md'),old=fs.readFileSync(h,'utf8'),ch=sha(cpart(old));assert.equal(ch,'95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680');assert.ok(!old.includes(title));fs.writeFileSync(h,note+old);assert.equal(sha(cpart(fs.readFileSync(h,'utf8'))),ch);
const status=path.join(root,'holiday-lab/STATUS.md');fs.writeFileSync(status,note+fs.readFileSync(status,'utf8'));
const vault='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md',v=fs.readFileSync(vault,'utf8'),front=v.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);assert.ok(front);fs.writeFileSync(vault,front[0]+'\n'+note+v.slice(front[0].length));
console.log(JSON.stringify({latest:'http://127.0.0.1:8876/',checks:state.checks.length,yes:state.checks.filter(c=>c.result==='yes').length,no:state.checks.filter(c=>c.result==='no').length,c_unchanged:true,private_vault_push:false}));
