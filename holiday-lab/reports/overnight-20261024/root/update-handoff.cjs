const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),original='C:/Projects/系網漫畫版_AGDComicSite',before=require('./before.json'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const section=s=>{const i=s.indexOf('## C. 要使用者決定的事（Codex 不要自己做）');assert.ok(i>=0);const t=s.slice(i),n=t.slice(1).search(/\r?\n## /);return n<0?t:t.slice(0,n+1);};
const heading='## 2026-10-24 最新：全項網站核對與本機8875，節日凍結';
const body=`${heading}

- source_agent: codex；TF-GO。使用者凌晨後一次接續已執行；本輪是網站檢查及必要修正，不是發布批准。最新有效 .measure-overnight-20261024-02，360檔、app-UVYLK6U2.js。首頁 http://127.0.0.1:8875/ ，指南 /?lang=zh#/students/guide ，儀表板 /progress/；8874首版與8873／8860舊版保留，不當最新。
- 所有先前網站需求整理47項：40 yes、7 no／缺件。完整逐項理由、指令、stdout／stderr／exit、來源與畫面在 C:/agywork/agd-holiday-prototypes/holiday-lab/reports/overnight-20261024/REPORT.md 及 verification.json；資料／工具／使用者三層分開，使用者新畫面確認0。
- 已修四PROGRAM整句及16個相依欄位三語48操作，115四技進修部一般單招30名已截止；移除統一面試、固定時段與未核保證。四日文職稱保留台灣助理教授／Assistant Professor，不直接等同日本助教。116完整附件、蔣天華中英官方職稱衝突及全處室官方日文名仍待核。
- 指南15卡全題來源核對，維持三欄／直白分類／身分索引／47步小說明，FAQ30→34、來源45→52；新增24組英日譯文。補畢業檢核與離校、請假補考、棄選、抵修免修及兩中心求助分流。105字說明由原回歸抓出後精簡91字，沒有放寬測試；原FAQ、流程及來源日期保留。當期完整附件與年度衝突逐題列缺件，10/24四站受阻／202空內容，不冒稱當日全文讀完。
- 獨立網站6/6、136 yes／0 no、36PNG，14來源＋360建置檔前後SHA一致；78照片原照HTTP SHA及78招生可見值。另日文兩寬角色、旋轉標題目視補驗，原圖不動。root唯讀重核通過。指南／身分／招生路徑及本輪引用回歸18/18；儀表板權威18/18，搜尋／篩選／展開另驗。不是全站逐字cmap、母語或實體手機認證。
- 主網站停止引用已知生成favicon；節日入口改暫緩提示，學生策展保留招生後、頁尾前。小颯完整原畫與署名保留，315原圖／凍結遊戲素材SHA未改；實際82 DOM引用含CSS漸層，不能當整包零AI或權利已全核。所有節日遊戲含勞動節凍結，未測玩／改遊戲／生圖／啟Unity／續跑巨量QA。
- TF-BASE指定交接夾本輪仍5份工單／腳本、未見Flora／胖倉鼠WebGL成品；只代表所查夾，未啟Unity、不重派、不下載大型舊來源。WebGL與7項保留缺口可在儀表板查，不宣稱全部完成。
- 每項本機codex短分支，整合分支codex/overnight-integrated24；未push、未發布、未碰main、未刪檔、C節完全未執行。四份原dirty＋R0、main refs與C節SHA保留；原失敗／partial／舊證據留存。Vault只本機更新，不執行私人整庫同步。
- 儀表板正本 holiday-lab/dashboard/out/index.html，重產 node holiday-lab/build-dashboard.mjs；新模式只採本輪網站718來源綁定，舊遊戲證據不轉新通過。驗證 node C:/AIHome/claude/skills/project-dashboard/scripts/verify-dashboard.js holiday-lab/dashboard/out --authority holiday-lab/dashboard/overnight-authority.cjs 。
- 下一輪第一件事：先看8875與本輪REPORT，按使用者具體回饋續修；先處理有證據的歷史EN對映／字串候選，再補當期官方附件、正式名稱與字型。TF-BASE有新完整包才驗包整合。保持遊戲凍結與C節邊界，不擴大發布。

\`\`\`text
cd C:/agywork/agd-holiday-prototypes
node scripts/serve-local-review.cjs --site=.measure-overnight-20261024-02 --dashboard=holiday-lab/dashboard/out --port=8875
\`\`\`

`;
const handoff=path.join(original,'LATEST_HANDOFF.md'),old=fs.readFileSync(handoff,'utf8');assert.equal(sha(section(old)),before.c_sha256);assert.ok(!old.includes(heading));fs.writeFileSync(handoff,body+old);assert.equal(sha(section(fs.readFileSync(handoff,'utf8'))),before.c_sha256);
const status=path.join(root,'holiday-lab/STATUS.md');fs.writeFileSync(status,body+fs.readFileSync(status,'utf8'));
const vault='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md',note=fs.readFileSync(vault,'utf8'),front=note.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);assert.ok(front);fs.writeFileSync(vault,front[0]+'\n'+body+note.slice(front[0].length));
fs.appendFileSync(path.join(root,'holiday-lab/reports/overnight-20261024/REPORT.md'),'\n## 儀表板與交接\n\nnode holiday-lab/build-dashboard.mjs → exit0；47列、40yes／7no、使用者0，摘要由規則計算。verify-dashboard --authority → 18/18、exit0。原交接、STATUS與既有Vault專案紀錄已本機更新，未執行私人Vault同步。\n');
console.log(JSON.stringify({handoff,status,vault,c_unchanged:true,private_vault_push:false}));
